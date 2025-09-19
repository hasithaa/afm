import * as vscode from 'vscode';
import { AfmAgentExplorerProvider } from './providers/AfmAgentExplorerProvider';
import { AfmCustomTextEditorProvider } from './providers/AfmCustomTextEditorProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('AFM Extension is now active!');

    // Register Agent Explorer view provider
    const agentExplorerProvider = new AfmAgentExplorerProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('afm.agentExplorer', agentExplorerProvider)
    );

    // Register custom text editor provider for .afm/.afm.md files
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            'afm.agentUiView',
            new AfmCustomTextEditorProvider(context),
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: false,
            }
        )
    );
}

export function deactivate() {
    console.log('AFM Extension is now deactivated!');
}
