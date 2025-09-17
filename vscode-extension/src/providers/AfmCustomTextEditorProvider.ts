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

    private getHtmlForWebview(webview: vscode.Webview, afmDoc: AfmDocument): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                    padding: 10px;
                }
                .metadata-panel {
                    width: 300px;
                    background-color: var(--vscode-sideBar-background);
                    border-left: 1px solid var(--vscode-panel-border);
                    padding: 10px;
                    overflow-y: auto;
                }
                .markdown-editor {
                    flex: 1;
                    width: 100%;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    font-family: var(--vscode-editor-font-family);
                    font-size: var(--vscode-editor-font-size);
                    padding: 10px;
                    resize: none;
                    outline: none;
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
            </style>
        </head>
        <body>
            <div class="editor-container">
                <h3>Markdown Content</h3>
                <textarea class="markdown-editor" id="markdownEditor" placeholder="Write your markdown content here...">${afmDoc.content || ''}</textarea>
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

            <script>
                const vscode = acquireVsCodeApi();
                
                const markdownEditor = document.getElementById('markdownEditor');
                const nameInput = document.getElementById('name');
                const descriptionInput = document.getElementById('description');
                const versionInput = document.getElementById('version');
                const namespaceInput = document.getElementById('namespace');
                const licenseInput = document.getElementById('license');

                // Update markdown content
                markdownEditor.addEventListener('input', () => {
                    vscode.postMessage({
                        type: 'updateMarkdown',
                        content: markdownEditor.value
                    });
                });

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
