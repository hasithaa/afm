import * as vscode from 'vscode';
import { AfmParser } from '../utils/parser';
import { AfmDocument } from '../utils/types';

export class AfmCustomTextEditorProvider implements vscode.CustomTextEditorProvider {
    private static readonly viewType = 'afm.editor';
    
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new AfmCustomTextEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            AfmCustomTextEditorProvider.viewType, 
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: false,
            }
        );
        return providerRegistration;
    }

    constructor(private readonly context: vscode.ExtensionContext) {}

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Parse the AFM document
        const afmDoc = AfmParser.parseAfmDocument(document.getText());
        
        // Set up the webview
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, afmDoc);

        // Handle messages from the webview
        webviewPanel.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'updateMarkdown':
                    await this.updateMarkdownContent(document, message.content, afmDoc.metadata);
                    break;
                case 'updateMetadata':
                    await this.updateMetadata(document, message.metadata, afmDoc.content);
                    break;
                case 'command':
                    vscode.commands.executeCommand(message.command);
                    break;
            }
        });

        // Update webview when document changes
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                const updatedDoc = AfmParser.parseAfmDocument(document.getText());
                webviewPanel.webview.postMessage({
                    type: 'documentChanged',
                    content: updatedDoc.content,
                    metadata: updatedDoc.metadata
                });
            }
        });

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });
    }

    private async updateMarkdownContent(
        document: vscode.TextDocument, 
        newMarkdownContent: string, 
        metadata: any
    ): Promise<void> {
        const edit = new vscode.WorkspaceEdit();
        const newDocument: AfmDocument = {
            metadata,
            content: newMarkdownContent
        };
        const newFileContent = AfmParser.serializeAfmDocument(newDocument);
        
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            newFileContent
        );
        
        await vscode.workspace.applyEdit(edit);
    }

    private async updateMetadata(
        document: vscode.TextDocument,
        newMetadata: any,
        markdownContent: string
    ): Promise<void> {
        const edit = new vscode.WorkspaceEdit();
        const newDocument: AfmDocument = {
            metadata: newMetadata,
            content: markdownContent
        };
        const newFileContent = AfmParser.serializeAfmDocument(newDocument);
        
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            newFileContent
        );
        
        await vscode.workspace.applyEdit(edit);
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    private getHtmlForWebview(webview: vscode.Webview, afmDoc: AfmDocument): string {
        const nonce = getNonce();
        
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
            <title>AFM Editor</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    font-size: var(--vscode-font-size);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                    margin: 0;
                    padding: 0;
                    display: flex;
                    height: 100vh;
                }
                .editor-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    height: 100vh;
                }
                .metadata-panel {
                    width: 300px;
                    background-color: var(--vscode-sideBar-background);
                    border-left: 1px solid var(--vscode-panel-border);
                    padding: 10px;
                    overflow-y: auto;
                    height: 100vh;
                }
                .markdown-editor {
                    flex: 1;
                    width: 100%;
                    height: 100%;
                    border: none;
                    background-color: var(--vscode-editor-background);
                    color: var(--vscode-editor-foreground);
                    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
                    font-size: 14px;
                    padding: 15px;
                    resize: none;
                    outline: none;
                    line-height: 1.6;
                    tab-size: 4;
                    white-space: pre-wrap;
                    box-sizing: border-box;
                    /* Add subtle grid lines */
                    background-image: 
                        linear-gradient(to right, var(--vscode-editorLineNumber-background) 59px, transparent 60px),
                        repeating-linear-gradient(
                            transparent,
                            transparent 1.5em,
                            rgba(128, 128, 128, 0.1) 1.5em,
                            rgba(128, 128, 128, 0.1) calc(1.5em + 1px)
                        );
                    background-size: 100% 100%, 100% 1.6em;
                    background-position: 0 0, 0 15px;
                }
                .markdown-editor:focus {
                    border: none;
                    outline: 1px solid var(--vscode-focusBorder);
                }
                .editor-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 15px;
                    background-color: var(--vscode-editorGroupHeader-tabsBackground);
                    border-bottom: 1px solid var(--vscode-panel-border);
                    font-size: 13px;
                    font-weight: 500;
                }
                .editor-toolbar {
                    display: none; /* Hide toolbar buttons, we'll use context menu instead */
                }
                .context-menu {
                    position: absolute;
                    background-color: var(--vscode-menu-background);
                    border: 1px solid var(--vscode-menu-border);
                    border-radius: 3px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                    min-width: 180px;
                    display: none;
                }
                .context-menu-item {
                    padding: 6px 12px;
                    cursor: pointer;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .context-menu-item:hover {
                    background-color: var(--vscode-menu-selectionBackground);
                    color: var(--vscode-menu-selectionForeground);
                }
                .context-menu-separator {
                    height: 1px;
                    background-color: var(--vscode-menu-separatorBackground);
                    margin: 4px 0;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input, textarea, select {
                    width: 100%;
                    padding: 5px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border-radius: 2px;
                    box-sizing: border-box;
                }
                .section-title {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: var(--vscode-textLink-foreground);
                    border-bottom: 1px solid var(--vscode-panel-border);
                    padding-bottom: 5px;
                }
                .line-numbers {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 50px;
                    background-color: var(--vscode-editorLineNumber-background);
                    color: var(--vscode-editorLineNumber-foreground);
                    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    padding: 15px 5px 15px 10px;
                    text-align: right;
                    border-right: 1px solid var(--vscode-panel-border);
                    user-select: none;
                    white-space: pre;
                    overflow: hidden;
                }
                .editor-wrapper {
                    position: relative;
                    flex: 1;
                    display: flex;
                }
                .markdown-editor-with-numbers {
                    padding-left: 60px;
                    margin: 0;
                    border: none;
                }
                /* Rich text styling for markdown content */
                .markdown-editor {
                    background-image: 
                        linear-gradient(to right, transparent 59px, var(--vscode-editor-background) 60px),
                        repeating-linear-gradient(
                            transparent,
                            transparent 1.5em,
                            var(--vscode-editorLineNumber-foreground) 1.5em,
                            var(--vscode-editorLineNumber-foreground) calc(1.5em + 1px)
                        );
                    background-size: 100% 100%, 100% 1.6em;
                    background-position: 0 0, 0 15px;
                }
                
                /* Markdown syntax highlighting overlay */
                .markdown-overlay {
                    position: absolute;
                    top: 15px;
                    left: 60px;
                    right: 0;
                    pointer-events: none;
                    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    color: transparent;
                    white-space: pre-wrap;
                    z-index: 1;
                }
                
                /* Header styles */
                .markdown-overlay .header-1 {
                    font-size: 1.8em;
                    font-weight: bold;
                    color: var(--vscode-symbolIcon-colorForeground);
                }
                
                .markdown-overlay .header-2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: var(--vscode-symbolIcon-colorForeground);
                }
                
                .markdown-overlay .header-3 {
                    font-size: 1.3em;
                    font-weight: bold;
                    color: var(--vscode-symbolIcon-colorForeground);
                }
                
                /* Code block styles */
                .markdown-overlay .code-block {
                    background-color: var(--vscode-textCodeBlock-background);
                    border-left: 3px solid var(--vscode-textPreformat-foreground);
                    padding: 8px 12px;
                    margin: 4px 0;
                    border-radius: 3px;
                }
                
                .markdown-overlay .inline-code {
                    background-color: var(--vscode-textCodeBlock-background);
                    color: var(--vscode-textPreformat-foreground);
                    padding: 2px 4px;
                    border-radius: 2px;
                }
                
                /* Bold and italic */
                .markdown-overlay .bold {
                    font-weight: bold;
                    color: var(--vscode-editor-foreground);
                }
                
                .markdown-overlay .italic {
                    font-style: italic;
                    color: var(--vscode-editor-foreground);
                }
                
                /* List styles */
                .markdown-overlay .list-item {
                    color: var(--vscode-list-focusForeground);
                }
                
                /* Link styles */
                .markdown-overlay .link {
                    color: var(--vscode-textLink-foreground);
                    text-decoration: underline;
                }
                
                /* Image preview */
                .image-preview {
                    position: relative;
                    display: inline-block;
                    margin: 4px 0;
                }
                
                .image-preview-tooltip {
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    background-color: var(--vscode-editorHoverWidget-background);
                    border: 1px solid var(--vscode-editorHoverWidget-border);
                    border-radius: 3px;
                    padding: 8px;
                    display: none;
                    z-index: 1000;
                    max-width: 300px;
                }
                
                .image-preview:hover .image-preview-tooltip {
                    display: block;
                }
                
                .image-preview-tooltip img {
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 2px;
                }
            </style>
        </head>
        <body>
            <div class="editor-container">
                <div class="editor-header">
                    <span>Markdown Content</span>
                    <span>Right-click for actions</span>
                </div>
                <div class="editor-wrapper">
                    <div class="line-numbers" id="lineNumbers"></div>
                    <textarea class="markdown-editor markdown-editor-with-numbers" id="markdownEditor" placeholder="Write your markdown content here...">${this.escapeHtml(afmDoc.content || '')}</textarea>
                    <div class="markdown-overlay" id="markdownOverlay"></div>
                </div>
            </div>
            
            <div class="metadata-panel">
                <div class="section-title">Agent Metadata</div>
                
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" value="${afmDoc.metadata?.name || ''}" placeholder="Agent name">
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" rows="3" placeholder="Agent description">${afmDoc.metadata?.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="version">Version</label>
                    <input type="text" id="version" value="${afmDoc.metadata?.version || ''}" placeholder="1.0.0">
                </div>
                
                <div class="form-group">
                    <label for="namespace">Namespace</label>
                    <input type="text" id="namespace" value="${afmDoc.metadata?.namespace || ''}" placeholder="namespace">
                </div>
                
                <div class="form-group">
                    <label for="license">License</label>
                    <input type="text" id="license" value="${afmDoc.metadata?.license || ''}" placeholder="MIT">
                </div>
            </div>

            <!-- Context Menu -->
            <div class="context-menu" id="contextMenu">
                <div class="context-menu-item" onclick="insertTitle()">
                    📄 Add Title
                </div>
                <div class="context-menu-item" onclick="insertInstruction()">
                    📝 Add Instruction
                </div>
                <div class="context-menu-item" onclick="insertExample()">
                    💻 Add Example
                </div>
                <div class="context-menu-item" onclick="insertSection()">
                    📁 Add Section
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" onclick="formatSelection()">
                    ✨ Format Selection
                </div>
                <div class="context-menu-item" onclick="deployAgent()">
                    🚀 Deploy Agent
                </div>
            </div>

            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
                const markdownEditor = document.getElementById('markdownEditor');
                const lineNumbers = document.getElementById('lineNumbers');
                const contextMenu = document.getElementById('contextMenu');
                const markdownOverlay = document.getElementById('markdownOverlay');

                // Simple markdown highlighting
                function renderMarkdownOverlay() {
                    const content = markdownEditor.value;
                    markdownOverlay.innerHTML = '';
                    
                    // For now, just sync the overlay position
                    markdownOverlay.scrollTop = markdownEditor.scrollTop;
                }

                function escapeHtml(unsafe) {
                    return unsafe
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
                }
                
                // Update line numbers
                function updateLineNumbers() {
                    const lines = markdownEditor.value.split('\\n');
                    const numbers = [];
                    for (let i = 1; i <= Math.max(lines.length, 20); i++) {
                        numbers.push(i.toString().padStart(2, ' '));
                    }
                    lineNumbers.textContent = numbers.join('\\n');
                }

                // Sync line numbers with scroll
                markdownEditor.addEventListener('scroll', () => {
                    lineNumbers.scrollTop = markdownEditor.scrollTop;
                });

                // Sync line numbers with editor height
                function syncLineNumberHeight() {
                    lineNumbers.style.height = markdownEditor.scrollHeight + 'px';
                    updateLineNumbers();
                }

                // Initialize
                updateLineNumbers();
                syncLineNumberHeight();
                
                // Update line numbers on content change
                markdownEditor.addEventListener('input', () => {
                    updateLineNumbers();
                    syncLineNumberHeight();
                    vscode.postMessage({
                        type: 'updateMarkdown',
                        content: markdownEditor.value
                    });
                });

                // Context menu handling
                markdownEditor.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = e.pageX + 'px';
                    contextMenu.style.top = e.pageY + 'px';
                });

                // Hide context menu when clicking elsewhere
                document.addEventListener('click', (e) => {
                    if (!contextMenu.contains(e.target)) {
                        contextMenu.style.display = 'none';
                    }
                });

                // Hide context menu on escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        contextMenu.style.display = 'none';
                    }
                });
                
                // Keyboard shortcuts
                markdownEditor.addEventListener('keydown', (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        switch (e.key.toLowerCase()) {
                            case 't':
                                e.preventDefault();
                                insertTitle();
                                break;
                            case 'i':
                                e.preventDefault();
                                insertInstruction();
                                break;
                            case 'e':
                                e.preventDefault();
                                insertExample();
                                break;
                            case 'd':
                                if (e.shiftKey) {
                                    e.preventDefault();
                                    deployAgent();
                                }
                                break;
                            case '/':
                                e.preventDefault();
                                showQuickActions();
                                break;
                        }
                    }
                    
                    // Tab handling
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = markdownEditor.selectionStart;
                        const end = markdownEditor.selectionEnd;
                        markdownEditor.value = markdownEditor.value.substring(0, start) + '    ' + markdownEditor.value.substring(end);
                        markdownEditor.selectionStart = markdownEditor.selectionEnd = start + 4;
                        updateLineNumbers();
                    }
                });

                // Quick actions (Ctrl+/)
                function showQuickActions() {
                    const selection = markdownEditor.selectionStart;
                    const rect = markdownEditor.getBoundingClientRect();
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = (rect.left + 100) + 'px';
                    contextMenu.style.top = (rect.top + 100) + 'px';
                }
                
                // Action functions
                function insertTitle() {
                    insertText('# Title\\n\\n');
                    contextMenu.style.display = 'none';
                }
                
                function insertInstruction() {
                    insertText('- New instruction\\n');
                    contextMenu.style.display = 'none';
                }
                
                function insertExample() {
                    insertText('\`\`\`\\nExample code or interaction\\n\`\`\`\\n\\n');
                    contextMenu.style.display = 'none';
                }
                
                function insertSection() {
                    insertText('## Section Title\\n\\nContent\\n\\n');
                    contextMenu.style.display = 'none';
                }

                function formatSelection() {
                    const start = markdownEditor.selectionStart;
                    const end = markdownEditor.selectionEnd;
                    const selectedText = markdownEditor.value.substring(start, end);
                    
                    if (selectedText) {
                        // Simple formatting - make selection bold
                        const formatted = '**' + selectedText + '**';
                        markdownEditor.value = markdownEditor.value.substring(0, start) + formatted + markdownEditor.value.substring(end);
                        markdownEditor.selectionStart = start;
                        markdownEditor.selectionEnd = start + formatted.length;
                        updateLineNumbers();
                        vscode.postMessage({
                            type: 'updateMarkdown',
                            content: markdownEditor.value
                        });
                    }
                    contextMenu.style.display = 'none';
                }
                
                function deployAgent() {
                    vscode.postMessage({
                        type: 'command',
                        command: 'afm.deployAgent'
                    });
                    contextMenu.style.display = 'none';
                }
                
                function insertText(text) {
                    const start = markdownEditor.selectionStart;
                    const end = markdownEditor.selectionEnd;
                    markdownEditor.value = markdownEditor.value.substring(0, start) + text + markdownEditor.value.substring(end);
                    markdownEditor.selectionStart = markdownEditor.selectionEnd = start + text.length;
                    markdownEditor.focus();
                    updateLineNumbers();
                    vscode.postMessage({
                        type: 'updateMarkdown',
                        content: markdownEditor.value
                    });
                }

                // Metadata form elements
                const nameInput = document.getElementById('name');
                const descriptionInput = document.getElementById('description');
                const versionInput = document.getElementById('version');
                const namespaceInput = document.getElementById('namespace');
                const licenseInput = document.getElementById('license');

                // Update metadata
                function updateMetadata() {
                    vscode.postMessage({
                        type: 'updateMetadata',
                        metadata: {
                            name: nameInput.value,
                            description: descriptionInput.value,
                            version: versionInput.value,
                            namespace: namespaceInput.value,
                            license: licenseInput.value
                        }
                    });
                }

                nameInput.addEventListener('input', updateMetadata);
                descriptionInput.addEventListener('input', updateMetadata);
                versionInput.addEventListener('input', updateMetadata);
                namespaceInput.addEventListener('input', updateMetadata);
                licenseInput.addEventListener('input', updateMetadata);

                // Listen for document changes
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'documentChanged':
                            markdownEditor.value = message.content || '';
                            updateLineNumbers();
                            nameInput.value = message.metadata?.name || '';
                            descriptionInput.value = message.metadata?.description || '';
                            versionInput.value = message.metadata?.version || '';
                            namespaceInput.value = message.metadata?.namespace || '';
                            licenseInput.value = message.metadata?.license || '';
                            break;
                    }
                });
            </script>
        </body>
        </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
