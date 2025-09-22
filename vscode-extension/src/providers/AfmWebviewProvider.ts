import * as vscode from 'vscode';
import * as path from 'path';
import { AfmParser, AfmDocument } from '../utils/parser';
import { AfmLowCodeHtmlGenerator } from '../lowcode';
import { PythonCodeGenerator } from '../utils/PythonCodeGenerator';
import { BallerinaCodeGenerator } from '../utils/BallerinaCodeGenerator';

export class AfmWebviewProvider {
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
                console.log('Received message:', message.type, message);
                switch (message.type) {
                    case 'updateMetadata':
                        await this.updateMetadata(document, message.metadata, message.field);
                        if (message.refreshWebview) {
                            // Refresh the webview content after successful save
                            await this.updateWebviewContent();
                            await this.sendDocumentToWebview(document);
                        }
                        break;
                    case 'updateContent':
                        await this.updateContent(document, message.content);
                        if (message.refreshWebview) {
                            // Refresh the webview content after successful save
                            await this.updateWebviewContent();
                            await this.sendDocumentToWebview(document);
                        }
                        break;
                    case 'openInEditor':
                        await vscode.window.showTextDocument(document, vscode.ViewColumn.Two);
                        break;
                    case 'webviewReady':
                        // Send initial document data to webview
                        await this.sendDocumentToWebview(document);
                        break;
                    case 'runAgent':
                        await this.handleRunAgent(document, message.language || 'python3');
                        break;
                }
            });

            await this.updateWebviewContent();

            const fileWatcher = vscode.workspace.onDidChangeTextDocument(async (event) => {
                if (event.document.uri.toString() === this.currentUri?.toString() && !this.isUpdatingDocument) {
                    // Debounce updates to avoid conflicts
                    clearTimeout(this.updateTimeout);
                    this.updateTimeout = setTimeout(async () => {
                        await this.updateWebviewContent();
                        await this.sendDocumentToWebview(event.document);
                    }, 300); // 300ms debounce
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
            const afmDoc = AfmParser.parseAfmDocument(content);

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

    private static async sendDocumentToWebview(document: vscode.TextDocument) {
        if (!this.sharedPanel) return;
        
        try {
            const content = document.getText();
            const afmDoc = AfmParser.parseAfmDocument(content);
            
            this.sharedPanel.webview.postMessage({
                type: 'documentUpdated',
                metadata: afmDoc.metadata,
                content: afmDoc.content
            });
        } catch (error) {
            console.error('Error sending document to webview:', error);
        }
    }

    private static async updateMetadata(document: vscode.TextDocument, newMetadata: any, specificField?: string) {
        try {
            // Set flag to prevent recursive updates
            this.isUpdatingDocument = true;
            
            // Clear any pending update timeouts first
            if (AfmWebviewProvider.updateTimeout) {
                clearTimeout(AfmWebviewProvider.updateTimeout);
                AfmWebviewProvider.updateTimeout = undefined;
            }

            // Log the update for debugging
            if (specificField) {
                console.log(`Updating specific field: ${specificField}`, newMetadata);
            } else {
                console.log('Updating metadata:', newMetadata);
            }

            // Get the latest document to avoid version conflicts
            const latestDocument = await vscode.workspace.openTextDocument(document.uri);
            const currentContent = latestDocument.getText();
            console.log('Current document content:', currentContent);
            const afmDoc = AfmParser.parseAfmDocument(currentContent);
            console.log('Parsed AFM document metadata:', afmDoc.metadata);
            
            // Merge new metadata with existing metadata
            const mergedMetadata = {
                ...afmDoc.metadata,
                ...newMetadata
            };
            console.log('Merged metadata:', mergedMetadata);
            
            // Only update if metadata actually changed
            const metadataChanged = JSON.stringify(afmDoc.metadata) !== JSON.stringify(mergedMetadata);
            if (!metadataChanged) {
                console.log('No metadata changes detected, skipping update');
                return; // No changes to apply
            }
            
            const updatedDoc: AfmDocument = {
                ...afmDoc,
                metadata: mergedMetadata
            };

            const newContent = AfmParser.serializeAfmDocument(updatedDoc, latestDocument.uri.fsPath);
            console.log('Serialized new content:', newContent);
            
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
                `Successfully saved ${specificField}` : 
                'Metadata updated successfully';
            console.log(successMessage);
            
            // Show a brief success message for field-specific saves
            if (specificField) {
                vscode.window.showInformationMessage(
                    `✅ ${specificField.charAt(0).toUpperCase() + specificField.slice(1)} saved successfully`,
                    { modal: false }
                ).then(() => {
                    // Auto-dismiss after 2 seconds
                    setTimeout(() => {}, 2000);
                });
            }
        } catch (error) {
            console.error('Error updating metadata:', error);
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
            
            console.log('Updating content');

            // Get the latest document to avoid version conflicts
            const latestDocument = await vscode.workspace.openTextDocument(document.uri);
            const currentContent = latestDocument.getText();
            const afmDoc = AfmParser.parseAfmDocument(currentContent);
            
            // Only update if content actually changed
            const contentChanged = afmDoc.content !== newContent;
            if (!contentChanged) {
                console.log('No content changes detected, skipping update');
                return; // No changes to apply
            }
            
            const updatedDoc: AfmDocument = {
                ...afmDoc,
                content: newContent
            };

            const serializedContent = AfmParser.serializeAfmDocument(updatedDoc, latestDocument.uri.fsPath);
            
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
            
            console.log('Content updated successfully');
            
            // Show a brief success message
            vscode.window.showInformationMessage(
                '✅ Content saved successfully',
                { modal: false }
            );
        } catch (error) {
            console.error('Error updating content:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Failed to save content: ${errorMessage}`);
        } finally {
            // Reset flag after a short delay to allow the update to propagate
            setTimeout(() => {
                this.isUpdatingDocument = false;
            }, 500);
        }
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

    /**
     * Handle run agent command
     */
    private static async handleRunAgent(document: vscode.TextDocument, language: string = 'python3'): Promise<void> {
        try {
            console.log(`Running agent for document: ${document.uri.fsPath} in language: ${language}`);
            
            // Parse the AFM document to get agent info
            const content = document.getText();
            const afmDoc = AfmParser.parseAfmDocument(content);
            
            // Get workspace root
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found. Please open a workspace.');
                return;
            }
            
            // Get the agent ID (same logic as in code generators)
            const namespace = afmDoc.metadata?.namespace || 'default';
            const name = afmDoc.metadata?.name || 'agent';
            const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const cleanNamespace = namespace.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const agentId = `${cleanNamespace}_${cleanName}`;
            
            // Determine target directory and main file based on language
            let targetDir: string;
            let mainFile: string;
            let checkCommand: string;
            let installCommand: string;
            let runCommand: string;
            
            if (language === 'ballerina') {
                targetDir = `${workspaceFolder.uri.fsPath}/target/${agentId}/ballerina`;
                mainFile = `${targetDir}/main.bal`;
                checkCommand = 'bal version';
                installCommand = 'echo "Ballerina dependencies managed by build"';
                runCommand = ''; // Will be set dynamically with user input
            } else {
                // Default to python3
                targetDir = `${workspaceFolder.uri.fsPath}/target/${agentId}/python3`;
                mainFile = `${targetDir}/main.py`;
                checkCommand = 'python3 -c "from openai import OpenAI; import toml" 2>/dev/null || echo "Installing requirements..."';
                installCommand = 'python3 -c "from openai import OpenAI; import toml" 2>/dev/null || pip3 install -r requirements.txt';
                runCommand = ''; // Will be set dynamically with user input
            }
            
            // Always regenerate the code (delete and recreate)
            const languageDisplayName = language === 'ballerina' ? 'Ballerina' : 'Python';
            
            // Delete existing directory if it exists
            try {
                await vscode.workspace.fs.delete(vscode.Uri.file(targetDir), { recursive: true });
                console.log(`Deleted existing ${languageDisplayName} agent directory: ${targetDir}`);
            } catch {
                // Directory doesn't exist, which is fine
                console.log(`No existing ${languageDisplayName} agent directory to delete`);
            }
            
            // Generate fresh code
            if (language === 'ballerina') {
                await BallerinaCodeGenerator.generateBallerinaAgent(afmDoc, workspaceFolder.uri.fsPath, document.uri);
            } else {
                await PythonCodeGenerator.generatePythonAgent(afmDoc, workspaceFolder.uri.fsPath, document.uri);
            }
            
            console.log(`Generated fresh ${languageDisplayName} agent code in: ${targetDir}`);
            
            // Get user input before creating terminal
            let finalMessage: string;
            
            if (language !== 'ballerina') {
                // Prompt for user message and run the agent (Python behavior)
                const userMessage = await vscode.window.showInputBox({
                    prompt: `Enter your message for the ${afmDoc.metadata?.name || 'AFM Agent'}`,
                    placeHolder: 'What would you like to ask the agent?',
                    value: 'Hello! What can you help me with?'
                });
                
                // Use provided message or default if cancelled/empty
                finalMessage = (userMessage && userMessage.trim()) ? userMessage.trim() : 'Hello! What can you help me with?';
            } else {
                // Prompt for user message for Ballerina too
                const userMessage = await vscode.window.showInputBox({
                    prompt: `Enter your message for the ${afmDoc.metadata?.name || 'AFM Agent'}`,
                    placeHolder: 'What would you like to ask the agent?',
                    value: 'Hello! What can you help me with?'
                });
                
                // Use provided message or default if cancelled/empty
                finalMessage = (userMessage && userMessage.trim()) ? userMessage.trim() : 'Hello! What can you help me with?';
            }
            
            // Open a terminal and run the agent
            const terminal = vscode.window.createTerminal({
                name: `AFM Agent (${languageDisplayName}): ${afmDoc.metadata?.name || 'Agent'}`,
                cwd: targetDir
            });
            
            terminal.show();
            
            // Check dependencies and API key
            terminal.sendText(checkCommand);
            
            if (language !== 'ballerina') {
                terminal.sendText(installCommand);
                terminal.sendText('if [ -z "$OPENAI_API_KEY" ]; then echo "⚠️  Warning: OPENAI_API_KEY environment variable is not set"; fi');
                
                // Run with the message we got earlier
                const escapedMessage = finalMessage.replace(/"/g, '\\"').replace(/'/g, "\\'");
                terminal.sendText(`python3 main.py "${escapedMessage}"`);
            } else {
                // For Ballerina, check if API key is set in Config.toml or environment
                terminal.sendText('if [ -z "$OPENAI_API_KEY" ] && ! grep -q "openai_api_key" Config.toml 2>/dev/null; then echo "⚠️  Warning: OPENAI_API_KEY not set in environment or Config.toml"; fi');
                
                // Run with the message we got earlier
                const escapedMessage = finalMessage.replace(/"/g, '\\"');
                terminal.sendText(`bal run -- "${escapedMessage}"`);
            }
            
        } catch (error) {
            console.error('Error running agent:', error);
            vscode.window.showErrorMessage(`Failed to run agent: ${error}`);
        }
    }
}
