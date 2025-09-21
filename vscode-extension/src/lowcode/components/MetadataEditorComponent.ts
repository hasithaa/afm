import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { LowCodeUtils } from '../utils';

/**
 * Metadata editor component with form fields
 */
export class MetadataEditorComponent implements StyledComponent, ScriptedComponent {
    
    public render(config: LowCodeConfig): string {
        const { document, readonly } = config;
        const { readonlyAttr } = LowCodeUtils.getReadonlyAttributes(readonly);
        
        // Don't render the editor if in readonly mode
        if (readonly) {
            return '';
        }
        
        const name = document.metadata?.name || '';
        const description = document.metadata?.description || '';
        const version = document.metadata?.version || '';
        const namespace = document.metadata?.namespace || '';
        const license = document.metadata?.license || '';
        const author = document.metadata?.author || '';
        
        return `
            <div class="section">
                <div class="section-title">📝 Edit Metadata</div>
                
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" value="${LowCodeUtils.escapeHtml(name)}" placeholder="Agent name" ${readonlyAttr}>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" placeholder="Agent description" ${readonlyAttr}>${LowCodeUtils.escapeHtml(description)}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="version">Version</label>
                    <input type="text" id="version" value="${LowCodeUtils.escapeHtml(version)}" placeholder="1.0.0" ${readonlyAttr}>
                </div>
                
                <div class="form-group">
                    <label for="namespace">Namespace</label>
                    <input type="text" id="namespace" value="${LowCodeUtils.escapeHtml(namespace)}" placeholder="default" ${readonlyAttr}>
                </div>
                
                <div class="form-group">
                    <label for="license">License</label>
                    <input type="text" id="license" value="${LowCodeUtils.escapeHtml(license)}" placeholder="MIT" ${readonlyAttr}>
                </div>

                <div class="form-group">
                    <label for="author">Author</label>
                    <input type="text" id="author" value="${LowCodeUtils.escapeHtml(author)}" placeholder="Name <email@example.com>" ${readonlyAttr}>
                </div>
            </div>
        `;
    }

    public getStyles(): string {
        return `
            .form-group {
                margin-bottom: 15px;
            }
            
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            input, textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--vscode-input-border);
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border-radius: 3px;
                box-sizing: border-box;
                font-size: 13px;
            }
            
            input:focus:not(:disabled), textarea:focus:not(:disabled) {
                outline: 1px solid var(--vscode-focusBorder);
                border-color: var(--vscode-focusBorder);
            }
            
            input:disabled, textarea:disabled {
                cursor: not-allowed;
                background-color: var(--vscode-input-background);
                opacity: 0.6;
            }
            
            textarea {
                resize: vertical;
                min-height: 60px;
                line-height: 1.4;
            }
        `;
    }

    public getScripts(nonce: string): string {
        return `
            function updateMetadata() {
                const metadata = {
                    name: document.getElementById('name').value,
                    description: document.getElementById('description').value,
                    version: document.getElementById('version').value,
                    namespace: document.getElementById('namespace').value,
                    license: document.getElementById('license').value,
                    author: document.getElementById('author').value
                };
                
                // Remove empty values
                Object.keys(metadata).forEach(key => {
                    if (!metadata[key]) {
                        delete metadata[key];
                    }
                });
                
                vscode.postMessage({
                    type: 'updateMetadata',
                    metadata: metadata
                });
            }
            
            // Auto-save on input changes
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    clearTimeout(window.saveTimeout);
                    window.saveTimeout = setTimeout(updateMetadata, 1000); // Auto-save after 1 second of no typing
                });
            });
        `;
    }
}