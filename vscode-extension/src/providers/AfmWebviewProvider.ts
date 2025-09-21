import * as vscode from 'vscode';
import { AfmParser, AfmDocument } from '../utils/parser';
import { AfmLowCodeHtmlGenerator } from '../lowcode';

export class AfmWebviewProvider {
    private static sharedPanel: vscode.WebviewPanel | undefined;
    private static currentUri: vscode.Uri | undefined;

    public static hasPanel(): boolean {
        return this.sharedPanel !== undefined;
    }

    public static disposePanel() {
        if (this.sharedPanel) {
            this.sharedPanel.dispose();
            this.sharedPanel = undefined;
            this.currentUri = undefined;
        }
    }

    public static async openWebview(uri: vscode.Uri) {
        console.log('Opening AFM file in LowCode Mode (editable):', uri.toString());

        if (this.sharedPanel && this.currentUri?.toString() === uri.toString()) {
            this.sharedPanel.reveal(vscode.ViewColumn.One);
            return;
        }

        if (this.sharedPanel) {
            this.disposePanel();
        }

        try {
            const document = await vscode.workspace.openTextDocument(uri);

            this.sharedPanel = vscode.window.createWebviewPanel(
                'afmLowCodeMode',
                `Agent: ${this.getAgentName(uri)}`,
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [],
                    enableFindWidget: true
                }
            );

            this.currentUri = uri;

            this.sharedPanel.onDidDispose(() => {
                this.sharedPanel = undefined;
                this.currentUri = undefined;
            });

            this.sharedPanel.webview.onDidReceiveMessage(async (message) => {
                switch (message.type) {
                    case 'updateMetadata':
                        await this.updateMetadata(document, message.metadata);
                        break;
                    case 'openInEditor':
                        await vscode.window.showTextDocument(document, vscode.ViewColumn.Two);
                        break;
                }
            });

            await this.updateWebviewContent();

            const fileWatcher = vscode.workspace.onDidChangeTextDocument(async (event) => {
                if (event.document.uri.toString() === this.currentUri?.toString()) {
                    await this.updateWebviewContent();
                }
            });

            this.sharedPanel.onDidDispose(() => {
                fileWatcher.dispose();
            });
        } catch (error) {
            console.error('Error opening LowCode Mode:', error);
            vscode.window.showErrorMessage(`Failed to open AFM LowCode Mode: ${error}`);
            throw error;
        }
    }

    private static getAgentName(uri: vscode.Uri): string {
        const fileName = uri.path.split('/').pop() || '';
        return fileName.replace(/\.(afm\.md|afm)$/, '');
    }

    private static async updateWebviewContent() {
        if (!this.sharedPanel || !this.currentUri) return;

        try {
            const document = await vscode.workspace.openTextDocument(this.currentUri);
            const content = document.getText();
            const afmDoc = AfmParser.parseAfmDocument(content, this.currentUri.fsPath);

            this.sharedPanel.webview.html = AfmLowCodeHtmlGenerator.generateHtml(
                this.sharedPanel.webview, 
                afmDoc, 
                this.currentUri, 
                false
            );
        } catch (error) {
            console.error('Error updating webview content:', error);
            this.sharedPanel.webview.html = this.generateErrorHtml(error);
        }
    }

    private static async updateMetadata(document: vscode.TextDocument, newMetadata: any) {
        const currentContent = document.getText();
        const afmDoc = AfmParser.parseAfmDocument(currentContent, document.uri.fsPath);
        
        const updatedDoc: AfmDocument = {
            ...afmDoc,
            metadata: newMetadata
        };

        const newContent = AfmParser.serializeAfmDocument(updatedDoc, document.uri.fsPath);
        
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            newContent
        );
        
        await vscode.workspace.applyEdit(edit);
    }

    private static generateErrorHtml(error: any): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>AFM LowCode Mode - Error</title>
    <style>
        body { font-family: var(--vscode-font-family); margin: 20px; }
        .error { background: var(--vscode-inputValidation-errorBackground); padding: 20px; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="error">
        <h2>Error Loading AFM File</h2>
        <pre>${error.toString()}</pre>
    </div>
</body>
</html>`;
    }
}
