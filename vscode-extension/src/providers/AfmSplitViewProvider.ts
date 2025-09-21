import * as vscode from 'vscode';
import { AfmParser, AfmDocument } from '../utils/parser';
import { AfmLowCodeHtmlGenerator } from '../lowcode';

export class AfmSplitViewProvider {
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

    public static async toggleAgentView(uri?: vscode.Uri) {
        console.log('Toggle Agent View called with URI:', uri?.toString());
        console.log('Current panel exists:', this.hasPanel());
        
        // If panel exists, close it
        if (this.hasPanel()) {
            console.log('Closing existing Agent View panel');
            this.disposePanel();
            vscode.window.showInformationMessage('Agent View closed');
            return;
        }

        // If no URI provided, try to get it from active editor
        if (!uri) {
            const activeEditor = vscode.window.activeTextEditor;
            console.log('Active editor:', activeEditor?.document.fileName);
            if (activeEditor && isAfmFile(activeEditor.document.fileName)) {
                uri = activeEditor.document.uri;
                console.log('Using active editor URI:', uri.toString());
            } else {
                vscode.window.showErrorMessage('No AFM file is currently active');
                return;
            }
        }

        // Open the agent view
        console.log('Opening Agent View for:', uri.toString());
        await this.openSplitView(uri);
    }

    public static async updateForActiveEditor() {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || !isAfmFile(activeEditor.document.fileName)) {
            return;
        }

        const activeUri = activeEditor.document.uri;
        
        // If we have a panel and it's for a different file, update it
        if (this.hasPanel() && this.currentUri?.toString() !== activeUri.toString()) {
            console.log('Updating Agent View for new active file:', activeUri.toString());
            this.currentUri = activeUri;
            if (this.sharedPanel) {
                this.sharedPanel.title = `Agent: ${this.getAgentName(activeUri)}`;
                await this.updateWebviewContent(this.sharedPanel, activeEditor.document);
            }
        }
    }

    public static async openSplitView(uri: vscode.Uri) {
        console.log('Opening split view for:', uri.toString());
        
        try {
            // First, open the native text editor if it's not already open
            const document = await vscode.workspace.openTextDocument(uri);
            const editor = vscode.window.activeTextEditor;
            
            if (!editor || editor.document.uri.toString() !== uri.toString()) {
                await vscode.window.showTextDocument(document, {
                    viewColumn: vscode.ViewColumn.One,
                    preview: false
                });
            }

            // Close existing panel if it exists
            if (this.sharedPanel) {
                this.sharedPanel.dispose();
            }

            // Create new shared webview panel
            this.sharedPanel = vscode.window.createWebviewPanel(
                'afmAgentView',
                `Agent: ${this.getAgentName(uri)}`,
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [],
                    enableFindWidget: true
                }
            );

            this.currentUri = uri;
            console.log('Created shared webview panel for:', uri.toString());

            // Set up the webview content
            await this.updateWebviewContent(this.sharedPanel, document);

            // Handle disposal
            this.sharedPanel.onDidDispose(() => {
                this.sharedPanel = undefined;
                this.currentUri = undefined;
            });

            // Handle messages from webview
            this.sharedPanel.webview.onDidReceiveMessage(async (message) => {
                switch (message.type) {
                    case 'updateMetadata':
                        await this.updateMetadata(document, message.metadata);
                        break;
                    case 'openInEditor':
                        await vscode.window.showTextDocument(document, vscode.ViewColumn.One);
                        break;
                }
            });

            // Watch for document changes to update webview
            const disposable = vscode.workspace.onDidChangeTextDocument(async (e) => {
                if (this.currentUri && e.document.uri.toString() === this.currentUri.toString()) {
                    if (this.sharedPanel) {
                        await this.updateWebviewContent(this.sharedPanel, e.document);
                    }
                }
            });

            this.sharedPanel.onDidDispose(() => {
                disposable.dispose();
            });

            return this.sharedPanel;
        } catch (error) {
            console.error('Error opening split view:', error);
            vscode.window.showErrorMessage(`Failed to open AFM split view: ${error}`);
            throw error;
        }
    }

    private static getAgentName(uri: vscode.Uri): string {
        const fileName = uri.path.split('/').pop() || '';
        return fileName.replace(/\.(afm\.md|afm)$/, '');
    }

    private static async updateWebviewContent(panel: vscode.WebviewPanel, document: vscode.TextDocument) {
        const afmDoc = AfmParser.parseAfmDocument(document.getText());
        // Use editable mode for split view - both sides are now editable
        panel.webview.html = AfmLowCodeHtmlGenerator.generateHtml(panel.webview, afmDoc, document.uri, false); // false = editable
    }

    private static async updateMetadata(document: vscode.TextDocument, newMetadata: any) {
        const currentContent = document.getText();
        const afmDoc = AfmParser.parseAfmDocument(currentContent);
        
        const updatedDoc: AfmDocument = {
            ...afmDoc,
            metadata: newMetadata
        };

        const newContent = AfmParser.serializeAfmDocument(updatedDoc);
        
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            newContent
        );
        
        await vscode.workspace.applyEdit(edit);
    }
}

function isAfmFile(filePath: string): boolean {
    return filePath.endsWith('.afm') || filePath.endsWith('.afm.md');
}