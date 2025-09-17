import * as vscode from 'vscode';
import { AfmCustomTextEditorProvider } from './providers/AfmCustomTextEditorProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('AFM Extension is now active!');

    // Register the custom text editor for AFM files
    context.subscriptions.push(
        AfmCustomTextEditorProvider.register(context)
    );

    // Register deploy command
    context.subscriptions.push(
        vscode.commands.registerCommand('afm.deployAgent', () => {
            vscode.window.showInformationMessage('🚀 Deploy Agent functionality coming soon!');
        })
    );
}

export function deactivate() {
    console.log('AFM Extension is now deactivated!');
}
