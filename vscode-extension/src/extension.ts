import * as vscode from 'vscode';
import { AfmAgentExplorerProvider } from './providers/AfmAgentExplorerProvider';
import { AfmSplitViewProvider } from './providers/AfmSplitViewProvider';
import { AfmWebviewProvider } from './providers/AfmWebviewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('AFM Extension is now active!');

    // Register Agent Explorer view provider
    const agentExplorerProvider = new AfmAgentExplorerProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('afm.agentExplorer', agentExplorerProvider)
    );

    // Register command to open AFM files with user's preferred default view
    context.subscriptions.push(
        vscode.commands.registerCommand('afm.openWithDefaultView', async (uri?: vscode.Uri) => {
            const targetUri = uri || vscode.window.activeTextEditor?.document.uri;
            if (targetUri) {
                const config = vscode.workspace.getConfiguration('afm');
                const defaultView = config.get<string>('defaultView', 'webview');
                
                switch (defaultView) {
                    case 'webview':
                        // Open in webview-only mode
                        await AfmWebviewProvider.openWebview(targetUri);
                        break;
                    case 'split':
                        await AfmSplitViewProvider.openSplitView(targetUri);
                        break;
                    case 'source':
                        const document = await vscode.workspace.openTextDocument(targetUri);
                        await vscode.window.showTextDocument(document, {
                            viewColumn: vscode.ViewColumn.One,
                            preview: false
                        });
                        break;
                }
            } else {
                vscode.window.showErrorMessage('No AFM file selected');
            }
        })
    );

    // Register command to open AFM files with split view
    context.subscriptions.push(
        vscode.commands.registerCommand('afm.openWithSplitView', async (uri?: vscode.Uri) => {
            const targetUri = uri || vscode.window.activeTextEditor?.document.uri;
            if (targetUri) {
                await AfmSplitViewProvider.openSplitView(targetUri);
            } else {
                vscode.window.showErrorMessage('No AFM file selected');
            }
        })
    );

    // Register command to open in source mode (text editor only)
    context.subscriptions.push(
        vscode.commands.registerCommand('afm.openInSourceMode', async (uri?: vscode.Uri) => {
            const targetUri = uri || vscode.window.activeTextEditor?.document.uri;
            if (targetUri) {
                const document = await vscode.workspace.openTextDocument(targetUri);
                await vscode.window.showTextDocument(document, {
                    viewColumn: vscode.ViewColumn.One,
                    preview: false
                });
            } else {
                vscode.window.showErrorMessage('No AFM file selected');
            }
        })
    );

    // Register command to open in webview mode (Agent View only)
    context.subscriptions.push(
        vscode.commands.registerCommand('afm.openInWebviewMode', async (uri?: vscode.Uri) => {
            const targetUri = uri || vscode.window.activeTextEditor?.document.uri;
            if (targetUri) {
                // Open in webview-only mode
                await AfmWebviewProvider.openWebview(targetUri);
            } else {
                vscode.window.showErrorMessage('No AFM file selected');
            }
        })
    );

    // Register toggle command for Agent View
    context.subscriptions.push(
        vscode.commands.registerCommand('afm.toggleAgentView', async (uri?: vscode.Uri) => {
            await AfmSplitViewProvider.toggleAgentView(uri);
        })
    );

    // Register close command for Agent View
    context.subscriptions.push(
        vscode.commands.registerCommand('afm.closeAgentView', async () => {
            AfmSplitViewProvider.disposePanel();
        })
    );

    // Handle AFM file opening based on user setting
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(async (editor) => {
            if (editor && isAfmFile(editor.document.fileName)) {
                // Check if this is a newly opened file and apply default view
                const config = vscode.workspace.getConfiguration('afm');
                const defaultView = config.get<string>('defaultView', 'webview');
                
                // Only apply default view logic if there's no existing split view panel
                if (defaultView === 'split' && !AfmSplitViewProvider.hasPanel()) {
                    setTimeout(async () => {
                        await AfmSplitViewProvider.openSplitView(editor.document.uri);
                    }, 100);
                } else if (AfmSplitViewProvider.hasPanel()) {
                    // If panel exists, update it for the new file
                    await AfmSplitViewProvider.updateForActiveEditor();
                }
            }
        })
    );

    // Track opened documents to auto-switch to preferred view
    let isHandlingFileOpen = false;
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(async (document) => {
            if (isAfmFile(document.fileName) && !isHandlingFileOpen) {
                isHandlingFileOpen = true;
                try {
                    const config = vscode.workspace.getConfiguration('afm');
                    const defaultView = config.get<string>('defaultView', 'webview');
                    
                    // Wait a bit for the editor to be ready
                    setTimeout(async () => {
                        try {
                            // Check if there's an active editor for this document
                            const activeEditor = vscode.window.activeTextEditor;
                            const isActiveForThisDoc = activeEditor?.document.uri.toString() === document.uri.toString();
                            
                            switch (defaultView) {
                                case 'webview':
                                    // Only close and redirect if this document is actively shown in an editor
                                    if (isActiveForThisDoc) {
                                        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                                        await AfmWebviewProvider.openWebview(document.uri);
                                    }
                                    break;
                                case 'split':
                                    // Open in split view
                                    await AfmSplitViewProvider.openSplitView(document.uri);
                                    break;
                                case 'source':
                                default:
                                    // Keep in source mode (do nothing)
                                    break;
                            }
                        } finally {
                            isHandlingFileOpen = false;
                        }
                    }, 200);
                } catch (error) {
                    console.error('Error handling AFM file open:', error);
                    isHandlingFileOpen = false;
                }
            }
        })
    );
}

function isAfmFile(filePath: string): boolean {
    return filePath.endsWith('.afm') || filePath.endsWith('.afm.md');
}

export function deactivate() {
    console.log('AFM Extension is now deactivated!');
}
