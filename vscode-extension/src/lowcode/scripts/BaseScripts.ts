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
            
            // Updated metadata function for contenteditable fields
            function updateMetadata() {
                const metadata = {};
                
                // Collect all editable field values
                const editableFields = document.querySelectorAll('.editable-field[data-field]');
                editableFields.forEach(field => {
                    const fieldPath = field.dataset.field;
                    const value = field.textContent.trim();
                    
                    if (value) {
                        if (fieldPath.includes('.')) {
                            // Handle nested objects like provider.organization
                            const parts = fieldPath.split('.');
                            let current = metadata;
                            for (let i = 0; i < parts.length - 1; i++) {
                                if (!current[parts[i]]) {
                                    current[parts[i]] = {};
                                }
                                current = current[parts[i]];
                            }
                            current[parts[parts.length - 1]] = value;
                        } else if (fieldPath === 'authors') {
                            // Handle authors as array
                            metadata[fieldPath] = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                        } else {
                            metadata[fieldPath] = value;
                        }
                    }
                });
                
                vscode.postMessage({
                    type: 'updateMetadata',
                    metadata: metadata
                });
            }
            
            // Listen for document updates from extension
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'documentUpdated':
                        if (message.metadata) {
                            updateFormFields(message.metadata);
                        }
                        break;
                }
            });
            
            // Update contenteditable fields with new metadata
            function updateFormFields(metadata) {
                const editableFields = document.querySelectorAll('.editable-field[data-field]');
                editableFields.forEach(field => {
                    const fieldPath = field.dataset.field;
                    let value = '';
                    
                    if (fieldPath.includes('.')) {
                        // Handle nested fields
                        const parts = fieldPath.split('.');
                        let current = metadata;
                        for (const part of parts) {
                            if (current && current[part] !== undefined) {
                                current = current[part];
                            } else {
                                current = '';
                                break;
                            }
                        }
                        value = current || '';
                    } else if (Array.isArray(metadata[fieldPath])) {
                        value = metadata[fieldPath].join(', ');
                    } else {
                        value = metadata[fieldPath] || '';
                    }
                    
                    if (field.textContent !== value) {
                        field.textContent = value;
                    }
                });
                
                // Update icon if needed
                const iconElement = document.getElementById('agentIcon');
                if (iconElement && metadata.iconUrl) {
                    iconElement.style.backgroundImage = \`url(\${metadata.iconUrl})\`;
                    iconElement.style.backgroundSize = 'cover';
                    iconElement.textContent = '';
                } else if (iconElement) {
                    iconElement.style.backgroundImage = '';
                    iconElement.textContent = '🤖';
                }
            }
        `;
    }
}