/**
 * Base scripts for LowCode components
 */
export class BaseScripts {
    
    public static getBaseScripts(): string {
        return `
            const vscode = acquireVsCodeApi();
            
            function openInEditor() {
                vscode.postMessage({ type: 'openInEditor' });
            }
            
            // Listen for document updates
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'documentUpdated':
                        // Update the form fields if the document was changed externally
                        if (message.metadata) {
                            updateFormFields(message.metadata);
                        }
                        break;
                }
            });
            
            function updateFormFields(metadata) {
                const fields = ['name', 'description', 'version', 'namespace', 'license', 'author'];
                fields.forEach(field => {
                    const element = document.getElementById(field);
                    if (element) {
                        element.value = metadata[field] || '';
                    }
                });
            }
        `;
    }
}