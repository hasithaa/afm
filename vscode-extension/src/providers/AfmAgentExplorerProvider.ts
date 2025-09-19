import * as vscode from 'vscode';
import * as path from 'path';

export class AfmAgentExplorerProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'afm.agentExplorer';

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'openAgent':
                    if (data.uri) {
                        const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(data.uri));
                        await vscode.window.showTextDocument(document, vscode.ViewColumn.One);
                    }
                    break;
                case 'refresh':
                    this._refresh();
                    break;
                case 'createNewAgent':
                    await this._createNewAgent();
                    break;
            }
        });

        // Watch for file system changes
        const watcher = vscode.workspace.createFileSystemWatcher('**/*.{afm,afm.md}');
        watcher.onDidCreate(() => this._refresh());
        watcher.onDidDelete(() => this._refresh());
        watcher.onDidChange(() => this._refresh());

        // Initial load
        this._refresh();
    }

    private async _refresh() {
        if (!this._view) {
            return;
        }

        const agents = await this._findAfmFiles();
        this._view.webview.postMessage({
            type: 'updateAgents',
            agents: agents
        });
    }

    private async _findAfmFiles(): Promise<any[]> {
        const afmFiles = await vscode.workspace.findFiles('**/*.{afm,afm.md}', '**/node_modules/**');
        const agents: any[] = [];

        for (const file of afmFiles) {
            try {
                const document = await vscode.workspace.openTextDocument(file);
                const content = document.getText();
                const agent = this._parseAfmMetadata(content, file);
                agents.push(agent);
            } catch (error) {
                console.error('Error parsing AFM file:', file.fsPath, error);
            }
        }

        // Group by namespace
        const grouped = agents.reduce((acc: Record<string, any[]>, agent: any) => {
            const namespace = agent.namespace || 'default';
            if (!acc[namespace]) {
                acc[namespace] = [];
            }
            acc[namespace].push(agent);
            return acc;
        }, {} as Record<string, any[]>);

        return Object.entries(grouped).map(([namespace, agentList]) => ({
            namespace,
            agents: agentList.sort((a: any, b: any) => a.name.localeCompare(b.name))
        }));
    }

    private _parseAfmMetadata(content: string, uri: vscode.Uri): any {
        const basename = path.basename(uri.fsPath, path.extname(uri.fsPath));
        const name = basename.replace(/\.afm$/, '');

        // Simple frontmatter parsing
        let metadata: any = { name };
        
        if (content.startsWith('---\n')) {
            const endIndex = content.indexOf('\n---\n', 4);
            if (endIndex !== -1) {
                const yamlContent = content.substring(4, endIndex);
                try {
                    // Simple YAML parsing for basic fields
                    const lines = yamlContent.split('\n');
                    for (const line of lines) {
                        const colonIndex = line.indexOf(':');
                        if (colonIndex !== -1) {
                            const key = line.substring(0, colonIndex).trim();
                            const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                            metadata[key] = value;
                        }
                    }
                } catch (error) {
                    console.error('Error parsing YAML frontmatter:', error);
                }
            }
        }

        return {
            ...metadata,
            uri: uri.toString(),
            path: vscode.workspace.asRelativePath(uri),
            name: metadata.name || name,
            namespace: metadata.namespace || 'default',
            description: metadata.description || '',
            version: metadata.version || '0.0.0'
        };
    }

    private async _createNewAgent() {
        const name = await vscode.window.showInputBox({
            prompt: 'Enter agent name',
            placeHolder: 'my-agent'
        });

        if (!name) {
            return;
        }

        const namespace = await vscode.window.showInputBox({
            prompt: 'Enter namespace (optional)',
            placeHolder: 'default'
        });

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const fileName = `${name}.afm.md`;
        const filePath = vscode.Uri.joinPath(workspaceFolder.uri, fileName);

        const template = `---
name: ${name}
namespace: ${namespace || 'default'}
version: 0.1.0
description: A new AFM agent
---

# ${name}

## Role

You are a helpful assistant.

## Instructions

- Be helpful and informative
- Provide clear and concise responses
`;

        try {
            await vscode.workspace.fs.writeFile(filePath, Buffer.from(template, 'utf8'));
            const document = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(document, vscode.ViewColumn.One);
            this._refresh();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create agent: ${error}`);
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
            <title>AFM Agent Explorer</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    font-size: var(--vscode-font-size);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-sideBar-background);
                    margin: 0;
                    padding: 10px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--vscode-panel-border);
                }
                .title {
                    font-size: 14px;
                    font-weight: bold;
                }
                .actions {
                    display: flex;
                    gap: 5px;
                }
                .btn {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 4px 8px;
                    border-radius: 2px;
                    cursor: pointer;
                    font-size: 12px;
                }
                .btn:hover {
                    background: var(--vscode-button-hoverBackground);
                }
                .btn-secondary {
                    background: var(--vscode-button-secondaryBackground);
                    color: var(--vscode-button-secondaryForeground);
                }
                .btn-secondary:hover {
                    background: var(--vscode-button-secondaryHoverBackground);
                }
                .namespace-group {
                    margin-bottom: 15px;
                }
                .namespace-header {
                    font-size: 12px;
                    font-weight: bold;
                    color: var(--vscode-textLink-foreground);
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .agent-item {
                    padding: 8px 12px;
                    margin-bottom: 2px;
                    border-radius: 3px;
                    cursor: pointer;
                    border-left: 3px solid transparent;
                }
                .agent-item:hover {
                    background-color: var(--vscode-list-hoverBackground);
                    border-left-color: var(--vscode-textLink-foreground);
                }
                .agent-name {
                    font-size: 13px;
                    font-weight: 500;
                    margin-bottom: 2px;
                }
                .agent-description {
                    font-size: 11px;
                    color: var(--vscode-descriptionForeground);
                    line-height: 1.3;
                }
                .agent-meta {
                    font-size: 10px;
                    color: var(--vscode-descriptionForeground);
                    margin-top: 4px;
                    display: flex;
                    justify-content: space-between;
                }
                .empty-state {
                    text-align: center;
                    color: var(--vscode-descriptionForeground);
                    font-size: 12px;
                    margin: 20px 0;
                }
                .loading {
                    text-align: center;
                    color: var(--vscode-descriptionForeground);
                    font-size: 12px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">Agents</div>
                <div class="actions">
                    <button class="btn btn-secondary" onclick="refresh()">↻</button>
                    <button class="btn" onclick="createNew()">+</button>
                </div>
            </div>
            
            <div id="content">
                <div class="loading">Loading agents...</div>
            </div>

            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
                
                function refresh() {
                    vscode.postMessage({ type: 'refresh' });
                    document.getElementById('content').innerHTML = '<div class="loading">Loading agents...</div>';
                }
                
                function createNew() {
                    vscode.postMessage({ type: 'createNewAgent' });
                }
                
                function openAgent(uri) {
                    vscode.postMessage({ 
                        type: 'openAgent',
                        uri: uri
                    });
                }
                
                // Listen for messages from the extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'updateAgents':
                            updateAgentsList(message.agents);
                            break;
                    }
                });
                
                function updateAgentsList(namespaceGroups) {
                    const content = document.getElementById('content');
                    
                    if (!namespaceGroups || namespaceGroups.length === 0) {
                        content.innerHTML = '<div class="empty-state">No AFM agents found in workspace.<br><br><button class="btn" onclick="createNew()">Create your first agent</button></div>';
                        return;
                    }
                    
                    let html = '';
                    
                    for (const group of namespaceGroups) {
                        html += \`
                            <div class="namespace-group">
                                <div class="namespace-header">\${escapeHtml(group.namespace)}</div>
                        \`;
                        
                        for (const agent of group.agents) {
                            html += \`
                                <div class="agent-item" onclick="openAgent('\${agent.uri}')">
                                    <div class="agent-name">\${escapeHtml(agent.name)}</div>
                                    \${agent.description ? \`<div class="agent-description">\${escapeHtml(agent.description)}</div>\` : ''}
                                    <div class="agent-meta">
                                        <span>v\${escapeHtml(agent.version)}</span>
                                        <span>\${escapeHtml(agent.path)}</span>
                                    </div>
                                </div>
                            \`;
                        }
                        
                        html += '</div>';
                    }
                    
                    content.innerHTML = html;
                }
                
                function escapeHtml(unsafe) {
                    return unsafe
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
                }
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