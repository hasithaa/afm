import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';

/**
 * Interface Configuration Form Tab Component
 */
export class InterfaceFormComponent implements StyledComponent, ScriptedComponent {
    
    public render(config: LowCodeConfig): string {
        const { readonly, document } = config;
        const { disabledAttr } = this.getReadonlyAttributes(readonly);
        
        // For now, use default values - interface parsing will be enhanced later
        const interfaceType: string = 'function';
        const inputs: any[] = [];
        const outputType = 'text';
        const outputDescription = '';
        
        return `
            <div class="form-section">
                <h5 class="section-title">
                    <i class="codicon codicon-symbol-interface"></i>
                    Interface Configuration
                </h5>
                <p class="section-description">
                    Configure your agent's interface, input/output parameters, and service exposure settings.
                </p>
                
                <!-- Interface Type -->
                <div class="form-subsection">
                    <div class="form-group">
                        <label for="interface-type">Interface Type</label>
                        <select id="interface-type" class="form-control" ${disabledAttr}>
                            <option value="function" ${interfaceType === 'function' ? 'selected' : ''}>Function (callable within application)</option>
                            <option value="service" ${interfaceType === 'service' ? 'selected' : ''}>Service (network-accessible)</option>
                        </select>
                        <small class="form-text">Functions are callable within applications, services are network-accessible</small>
                    </div>
                </div>

                <!-- Input Parameters -->
                <div class="form-subsection">
                    <h6 class="subsection-title">Input Parameters</h6>
                    
                    <div class="parameters-container">
                        <div class="parameters-list" id="input-parameters-list">
                            <!-- Input parameters will be populated here -->
                        </div>
                        <button type="button" class="btn btn-outline add-parameter-btn" 
                                id="add-input-param-btn" ${disabledAttr}>
                            <i class="codicon codicon-add"></i>
                            Add Input Parameter
                        </button>
                    </div>
                </div>

                <!-- Output Parameters -->
                <div class="form-subsection">
                    <h6 class="subsection-title">Output Parameters</h6>
                    
                    <div class="parameters-container">
                        <div class="parameters-list" id="output-parameters-list">
                            <!-- Output parameters will be populated here -->
                        </div>
                        <button type="button" class="btn btn-outline add-parameter-btn" 
                                id="add-output-param-btn" ${disabledAttr}>
                            <i class="codicon codicon-add"></i>
                            Add Output Parameter
                        </button>
                    </div>
                </div>

                <!-- Service Exposure (shown only when service type is selected) -->
                <div class="form-subsection service-exposure-section" id="service-exposure-section" style="display: none;">
                    <h6 class="subsection-title">Service Exposure</h6>
                    
                    <div class="form-group">
                        <label for="http-path">HTTP Endpoint Path</label>
                        <input type="text" id="http-path" class="form-control" 
                               placeholder="/math-tutor" ${disabledAttr}>
                        <small class="form-text">The URL path where this service will be accessible</small>
                    </div>

                    <div class="form-group">
                        <label for="auth-type">Authentication Type</label>
                        <select id="auth-type" class="form-control" ${disabledAttr}>
                            <option value="">None</option>
                            <option value="oauth2">OAuth 2.0</option>
                            <option value="api_key">API Key</option>
                            <option value="bearer">Bearer Token</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="a2a-discoverable" ${disabledAttr}>
                            Discoverable by other agents (A2A)
                        </label>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="agent-card-name">Agent Card Name</label>
                            <input type="text" id="agent-card-name" class="form-control" 
                                   placeholder="Math Tutor Service" ${disabledAttr}>
                        </div>
                        <div class="form-group">
                            <label for="agent-card-icon">Agent Card Icon</label>
                            <input type="url" id="agent-card-icon" class="form-control" 
                                   placeholder="https://example.com/icon.png" ${disabledAttr}>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="agent-card-description">Agent Card Description</label>
                        <textarea id="agent-card-description" class="form-control" rows="2" 
                                  placeholder="Description shown when other agents discover this service" 
                                  ${disabledAttr}></textarea>
                    </div>
                </div>
            </div>
        `;
    }

    public getStyles(): string {
        return `
            /* Interface Form Styles */
            .form-subsection {
                margin-bottom: 24px;
                padding-bottom: 20px;
                border-bottom: 1px solid var(--vscode-panel-border);
            }

            .form-subsection:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }

            .subsection-title {
                color: var(--vscode-textLink-foreground);
                margin-bottom: 12px;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .subsection-title:before {
                content: "•";
                color: var(--vscode-textLink-foreground);
                font-weight: bold;
            }

            .parameters-container {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 12px;
                background-color: var(--vscode-editor-background);
            }

            .parameters-list {
                margin-bottom: 12px;
                min-height: 20px;
            }

            .parameter-item {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 12px;
                margin-bottom: 8px;
                background-color: var(--vscode-input-background);
            }

            .parameter-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .parameter-title {
                font-weight: 500;
                color: var(--vscode-foreground);
            }

            .remove-item {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: 1px solid var(--vscode-button-border);
                border-radius: 3px;
                padding: 4px 8px;
                cursor: pointer;
                font-size: 11px;
                transition: background-color 0.2s;
            }

            .remove-item:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
            }

            .service-exposure-section {
                border-left: 4px solid var(--vscode-textLink-foreground);
            }
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // Interface Form Scripts
            function initializeInterfaceHandlers() {
                // Interface type change handler
                const interfaceTypeSelect = document.getElementById('interface-type');
                const serviceExposureSection = document.getElementById('service-exposure-section');

                if (interfaceTypeSelect) {
                    interfaceTypeSelect.addEventListener('change', function() {
                        const isService = this.value === 'service';
                        serviceExposureSection.style.display = isService ? 'block' : 'none';
                        notifyFormChange();
                    });
                }

                // Parameter management
                const addInputBtn = document.getElementById('add-input-param-btn');
                const addOutputBtn = document.getElementById('add-output-param-btn');

                if (addInputBtn) {
                    addInputBtn.addEventListener('click', () => addParameter('input'));
                }
                if (addOutputBtn) {
                    addOutputBtn.addEventListener('click', () => addParameter('output'));
                }

                function addParameter(type) {
                    const container = document.getElementById(\`\${type}-parameters-list\`);
                    const paramId = \`\${type}-param-\${Date.now()}\`;
                    
                    const paramDiv = document.createElement('div');
                    paramDiv.className = 'parameter-item';
                    paramDiv.innerHTML = \`
                        <div class="parameter-header">
                            <span class="parameter-title">Parameter</span>
                            <button type="button" class="remove-item">
                                <i class="codicon codicon-trash"></i> Remove
                            </button>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" class="form-control param-name" placeholder="parameter_name">
                            </div>
                            <div class="form-group">
                                <label>Type</label>
                                <select class="form-control param-type">
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="boolean">boolean</option>
                                    <option value="json">json</option>
                                    <option value="file">file</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" class="form-control param-description" placeholder="Parameter description">
                        </div>
                        \${type === 'input' ? \`
                        <div class="form-group">
                            <label>
                                <input type="checkbox" class="param-required"> Required
                            </label>
                        </div>
                        \` : ''}
                    \`;

                    const removeBtn = paramDiv.querySelector('.remove-item');
                    removeBtn.addEventListener('click', function() {
                        paramDiv.remove();
                        notifyFormChange();
                    });

                    // Add change listeners for form fields
                    paramDiv.querySelectorAll('input, select').forEach(input => {
                        input.addEventListener('change', notifyFormChange);
                    });

                    container.appendChild(paramDiv);
                    notifyFormChange();
                }

                // Add change listeners to form fields
                document.querySelectorAll('#interface-type, #http-path, #auth-type, #a2a-discoverable, #agent-card-name, #agent-card-icon, #agent-card-description').forEach(input => {
                    input.addEventListener('change', notifyFormChange);
                });
            }

            // Expose for external use
            window.interfaceForm = {
                initialize: initializeInterfaceHandlers
            };
        `;
    }

    private getReadonlyAttributes(readonly: boolean): { readonlyAttr: string; disabledAttr: string } {
        return {
            readonlyAttr: readonly ? 'readonly' : '',
            disabledAttr: readonly ? 'disabled' : ''
        };
    }
}