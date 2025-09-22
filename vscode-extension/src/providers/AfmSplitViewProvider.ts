import * as vscode from 'vscode';
import { AfmParser, AfmDocument } from '../utils/parser';
import { AfmLowCodeHtmlGenerator } from '../lowcode';

export class AfmSplitViewProvider {
    private static sharedPanel: vscode.WebviewPanel | undefined;
    private static currentUri: vscode.Uri | undefined;
    private static updateTimeout: NodeJS.Timeout | undefined;
    private static isUpdatingDocument: boolean = false;

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
                        await AfmSplitViewProvider.updateMetadata(document, message.metadata, message.field);
                        if (message.refreshWebview && this.sharedPanel) {
                            // Refresh the webview content after successful save
                            await AfmSplitViewProvider.updateWebviewContent(this.sharedPanel, document);
                            await AfmSplitViewProvider.sendDocumentToWebview(this.sharedPanel, document);
                        }
                        break;
                    case 'updateContent':
                        await AfmSplitViewProvider.updateContent(document, message.content);
                        if (message.refreshWebview && this.sharedPanel) {
                            // Refresh the webview content after successful save
                            await AfmSplitViewProvider.updateWebviewContent(this.sharedPanel, document);
                            await AfmSplitViewProvider.sendDocumentToWebview(this.sharedPanel, document);
                        }
                        break;
                    case 'openInEditor':
                        await vscode.window.showTextDocument(document, vscode.ViewColumn.One);
                        break;
                    case 'webviewReady':
                        // Send initial document data to webview
                        if (this.sharedPanel) {
                            await AfmSplitViewProvider.sendDocumentToWebview(this.sharedPanel, document);
                        }
                        break;
                }
            });

            // Watch for document changes to update webview
            const disposable = vscode.workspace.onDidChangeTextDocument(async (e) => {
                if (this.currentUri && e.document.uri.toString() === this.currentUri.toString() && !this.isUpdatingDocument) {
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

    private static async sendDocumentToWebview(panel: vscode.WebviewPanel, document: vscode.TextDocument): Promise<void> {
        if (!panel) {
            return;
        }

        try {
            const content = document.getText();
            const afmDoc = AfmParser.parseAfmDocument(content);
            
            await panel.webview.postMessage({
                type: 'documentUpdated',
                content: afmDoc
            });
        } catch (error) {
            console.error('Error sending document to webview:', error);
        }
    }

    private static async updateMetadata(document: vscode.TextDocument, newMetadata: any, specificField?: string) {
        try {
            // Set flag to prevent recursive updates
            this.isUpdatingDocument = true;
            
            // Log the update for debugging
            if (specificField) {
                console.log(`Updating specific field in split view: ${specificField}`, newMetadata);
            } else {
                console.log('Updating metadata in split view:', newMetadata);
            }
            
            // Get the latest document to avoid version conflicts
            const latestDocument = await vscode.workspace.openTextDocument(document.uri);
            const currentContent = latestDocument.getText();
            const afmDoc = AfmParser.parseAfmDocument(currentContent);
            
            // Merge new metadata with existing metadata
            const mergedMetadata = {
                ...afmDoc.metadata,
                ...newMetadata
            };
            
            // Only update if metadata actually changed
            const metadataChanged = JSON.stringify(afmDoc.metadata) !== JSON.stringify(mergedMetadata);
            if (!metadataChanged) {
                console.log('No metadata changes detected in split view, skipping update');
                return; // No changes to apply
            }
            
            const updatedDoc: AfmDocument = {
                ...afmDoc,
                metadata: mergedMetadata
            };

            const newContent = AfmParser.serializeAfmDocument(updatedDoc);
            
            // Try using TextEditor approach instead of WorkspaceEdit
            const editors = vscode.window.visibleTextEditors.filter(editor => 
                editor.document.uri.toString() === document.uri.toString()
            );
            
            if (editors.length > 0) {
                // Use the active text editor to avoid version conflicts
                const editor = editors[0];
                const fullRange = new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(editor.document.getText().length)
                );
                
                const success = await editor.edit(editBuilder => {
                    editBuilder.replace(fullRange, newContent);
                });
                
                if (!success) {
                    throw new Error('Failed to apply edit using TextEditor');
                }
            } else {
                // Fallback to WorkspaceEdit if no editor is open
                const edit = new vscode.WorkspaceEdit();
                edit.replace(
                    latestDocument.uri,
                    new vscode.Range(0, 0, latestDocument.lineCount, 0),
                    newContent
                );
                
                const success = await vscode.workspace.applyEdit(edit);
                if (!success) {
                    throw new Error('Failed to apply WorkspaceEdit');
                }
            }
            
            const successMessage = specificField ? 
                `Successfully saved ${specificField} in split view` : 
                'Metadata updated successfully in split view';
            console.log(successMessage);
            
            // Show a brief success message for field-specific saves
            if (specificField) {
                vscode.window.showInformationMessage(
                    `✅ ${specificField.charAt(0).toUpperCase() + specificField.slice(1)} saved successfully`,
                    { modal: false }
                );
            }
        } catch (error) {
            console.error('Error updating metadata in split view:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorContext = specificField ? ` for field ${specificField}` : '';
            vscode.window.showErrorMessage(`Failed to save metadata${errorContext}: ${errorMessage}`);
        } finally {
            // Reset flag after a short delay to allow the update to propagate
            setTimeout(() => {
                this.isUpdatingDocument = false;
            }, 500);
        }
    }

    private static async updateContent(document: vscode.TextDocument, newContent: string) {
        try {
            // Set flag to prevent recursive updates
            this.isUpdatingDocument = true;
            
            console.log('Updating content in split view');
            
            // Get the latest document to avoid version conflicts
            const latestDocument = await vscode.workspace.openTextDocument(document.uri);
            const currentContent = latestDocument.getText();
            const afmDoc = AfmParser.parseAfmDocument(currentContent);
            
            // Only update if content actually changed
            const contentChanged = afmDoc.content !== newContent;
            if (!contentChanged) {
                console.log('No content changes detected in split view, skipping update');
                return; // No changes to apply
            }
            
            const updatedDoc: AfmDocument = {
                ...afmDoc,
                content: newContent
            };

            const serializedContent = AfmParser.serializeAfmDocument(updatedDoc);
            
            // Try using TextEditor approach instead of WorkspaceEdit
            const editors = vscode.window.visibleTextEditors.filter(editor => 
                editor.document.uri.toString() === document.uri.toString()
            );
            
            if (editors.length > 0) {
                // Use the active text editor to avoid version conflicts
                const editor = editors[0];
                const fullRange = new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(editor.document.getText().length)
                );
                
                const success = await editor.edit(editBuilder => {
                    editBuilder.replace(fullRange, serializedContent);
                });
                
                if (!success) {
                    throw new Error('Failed to apply content edit using TextEditor');
                }
            } else {
                // Fallback to WorkspaceEdit if no editor is open
                const edit = new vscode.WorkspaceEdit();
                edit.replace(
                    latestDocument.uri,
                    new vscode.Range(0, 0, latestDocument.lineCount, 0),
                    serializedContent
                );
                
                const success = await vscode.workspace.applyEdit(edit);
                if (!success) {
                    throw new Error('Failed to apply content WorkspaceEdit');
                }
            }
            
            console.log('Content updated successfully in split view');
            
            // Show a brief success message
            vscode.window.showInformationMessage(
                '✅ Content saved successfully',
                { modal: false }
            );
        } catch (error) {
            console.error('Error updating content in split view:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Failed to save content: ${errorMessage}`);
        } finally {
            // Reset flag after a short delay to allow the update to propagate
            setTimeout(() => {
                this.isUpdatingDocument = false;
            }, 500);
        }
    }
}

function isAfmFile(filePath: string): boolean {
    return filePath.endsWith('.afm') || filePath.endsWith('.afm.md');
}