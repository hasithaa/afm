import * as vscode from 'vscode';
import { AfmDocument } from './types';

/**
 * Shared utility for generating the LowCode Mode HTML for AFM files.
 * Used by both AfmWebviewProvider (editable) and AfmSplitViewProvider (readonly preview).
 */
export class AfmLowCodeHtmlGenerator {
    
    public static generateHtml(
        webview: vscode.Webview, 
        afmDoc: AfmDocument, 
        uri: vscode.Uri, 
        readonly: boolean = false
    ): string {
        const nonce = this.getNonce();
        const readonlyAttr = readonly ? 'readonly' : '';
        const disabledAttr = readonly ? 'disabled' : '';
        
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
            <title>AFM Agent - ${readonly ? 'Preview Mode' : 'LowCode Mode'}</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    font-size: var(--vscode-font-size);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                    margin: 0;
                    padding: 20px;
                    line-height: 1.6;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--vscode-panel-border);
                }
                .title {
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--vscode-textLink-foreground);
                }
                .mode-indicator {
                    background: ${readonly ? 'var(--vscode-statusBarItem-warningBackground)' : 'var(--vscode-statusBarItem-prominentBackground)'};
                    color: ${readonly ? 'var(--vscode-statusBarItem-warningForeground)' : 'var(--vscode-statusBarItem-prominentForeground)'};
                    padding: 4px 8px;
                    border-radius: 3px;
                    font-size: 11px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .btn {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 6px 12px;
                    border-radius: 2px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-left: 8px;
                }
                .btn:hover:not(:disabled) {
                    background: var(--vscode-button-hoverBackground);
                }
                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .section {
                    margin-bottom: 25px;
                }
                .section-title {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 12px;
                    color: var(--vscode-textLink-foreground);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    font-size: 12px;
                    color: var(--vscode-descriptionForeground);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border-radius: 3px;
                    box-sizing: border-box;
                    font-size: 13px;
                    opacity: ${readonly ? '0.7' : '1'};
                }
                input:focus:not(:disabled), textarea:focus:not(:disabled) {
                    outline: 1px solid var(--vscode-focusBorder);
                    border-color: var(--vscode-focusBorder);
                }
                input:disabled, textarea:disabled {
                    cursor: not-allowed;
                    background-color: var(--vscode-input-background);
                    opacity: 0.6;
                }
                textarea {
                    resize: vertical;
                    min-height: 60px;
                    line-height: 1.4;
                }
                .agent-card {
                    background: var(--vscode-sideBar-background);
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 6px;
                    padding: 16px;
                    margin-bottom: 20px;
                }
                .agent-name {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: var(--vscode-textLink-foreground);
                }
                .agent-description {
                    color: var(--vscode-descriptionForeground);
                    font-size: 13px;
                    line-height: 1.5;
                    margin-bottom: 12px;
                }
                .agent-meta {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    font-size: 12px;
                }
                .meta-item {
                    display: flex;
                    flex-direction: column;
                }
                .meta-label {
                    color: var(--vscode-descriptionForeground);
                    margin-bottom: 2px;
                }
                .meta-value {
                    color: var(--vscode-foreground);
                    font-weight: 500;
                }
                .content-preview {
                    background: var(--vscode-textCodeBlock-background);
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 4px;
                    padding: 16px;
                    max-height: 200px;
                    overflow-y: auto;
                    font-family: var(--vscode-editor-font-family);
                    font-size: 12px;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    color: var(--vscode-textPreformat-foreground);
                }
                .empty-state {
                    text-align: center;
                    color: var(--vscode-descriptionForeground);
                    font-style: italic;
                    padding: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <div class="title">AFM Agent - ${readonly ? 'Preview Mode' : 'LowCode Mode'}</div>
                    <div class="mode-indicator">${readonly ? '👁️ Preview Mode' : '✏️ Edit Mode'}</div>
                </div>
                <div>
                    <button class="btn" onclick="openInEditor()" ${disabledAttr}>📝 Edit Source</button>
                </div>
            </div>

            <div class="agent-card">
                <div class="agent-name">${this.escapeHtml(afmDoc.metadata?.name || this.getAgentName(uri))}</div>
                <div class="agent-description">${this.escapeHtml(afmDoc.metadata?.description || 'No description provided')}</div>
                <div class="agent-meta">
                    <div class="meta-item">
                        <div class="meta-label">Version</div>
                        <div class="meta-value">${this.escapeHtml(afmDoc.metadata?.version || '0.0.0')}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Namespace</div>
                        <div class="meta-value">${this.escapeHtml(afmDoc.metadata?.namespace || 'default')}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">License</div>
                        <div class="meta-value">${this.escapeHtml(afmDoc.metadata?.license || 'Not specified')}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Author</div>
                        <div class="meta-value">${this.escapeHtml(afmDoc.metadata?.author || 'Not specified')}</div>
                    </div>
                </div>
            </div>

            ${readonly ? '' : `
            <div class="section">
                <div class="section-title">📝 Edit Metadata</div>
                
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" value="${this.escapeHtml(afmDoc.metadata?.name || '')}" placeholder="Agent name" ${readonlyAttr}>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" placeholder="Agent description" ${readonlyAttr}>${this.escapeHtml(afmDoc.metadata?.description || '')}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="version">Version</label>
                    <input type="text" id="version" value="${this.escapeHtml(afmDoc.metadata?.version || '')}" placeholder="1.0.0" ${readonlyAttr}>
                </div>
                
                <div class="form-group">
                    <label for="namespace">Namespace</label>
                    <input type="text" id="namespace" value="${this.escapeHtml(afmDoc.metadata?.namespace || '')}" placeholder="default" ${readonlyAttr}>
                </div>
                
                <div class="form-group">
                    <label for="license">License</label>
                    <input type="text" id="license" value="${this.escapeHtml(afmDoc.metadata?.license || '')}" placeholder="MIT" ${readonlyAttr}>
                </div>

                <div class="form-group">
                    <label for="author">Author</label>
                    <input type="text" id="author" value="${this.escapeHtml(afmDoc.metadata?.author || '')}" placeholder="Name <email@example.com>" ${readonlyAttr}>
                </div>
            </div>
            `}

            <div class="section">
                <div class="section-title">📄 Content Preview</div>
                <div class="content-preview">${afmDoc.content ? this.escapeHtml(afmDoc.content.substring(0, 500) + (afmDoc.content.length > 500 ? '...' : '')) : '<div class="empty-state">No content available</div>'}</div>
            </div>

            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
                
                function openInEditor() {
                    vscode.postMessage({ type: 'openInEditor' });
                }
                
                ${readonly ? '' : `
                function updateMetadata() {
                    const metadata = {
                        name: document.getElementById('name').value,
                        description: document.getElementById('description').value,
                        version: document.getElementById('version').value,
                        namespace: document.getElementById('namespace').value,
                        license: document.getElementById('license').value,
                        author: document.getElementById('author').value
                    };
                    
                    // Remove empty values
                    Object.keys(metadata).forEach(key => {
                        if (!metadata[key]) {
                            delete metadata[key];
                        }
                    });
                    
                    vscode.postMessage({
                        type: 'updateMetadata',
                        metadata: metadata
                    });
                }
                
                // Auto-save on input changes
                const inputs = document.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.addEventListener('input', () => {
                        clearTimeout(window.saveTimeout);
                        window.saveTimeout = setTimeout(updateMetadata, 1000); // Auto-save after 1 second of no typing
                    });
                });
                `}
                
                // Listen for document updates
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'documentUpdated':
                            // Update the form fields if the document was changed externally
                            if (message.metadata && !${readonly}) {
                                document.getElementById('name').value = message.metadata.name || '';
                                document.getElementById('description').value = message.metadata.description || '';
                                document.getElementById('version').value = message.metadata.version || '';
                                document.getElementById('namespace').value = message.metadata.namespace || '';
                                document.getElementById('license').value = message.metadata.license || '';
                                document.getElementById('author').value = message.metadata.author || '';
                            }
                            break;
                    }
                });
            </script>
        </body>
        </html>`;
    }

    private static getAgentName(uri: vscode.Uri): string {
        const fileName = uri.path.split('/').pop() || '';
        return fileName.replace(/\.(afm\.md|afm)$/, '');
    }

    private static getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private static escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}