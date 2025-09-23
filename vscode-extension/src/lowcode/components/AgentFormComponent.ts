import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { AgentDetailsFormComponent } from './AgentDetailsFormComponent';
import { InterfaceFormComponent } from './InterfaceFormComponent';
import { McpServersFormComponent } from './McpServersFormComponent';
import { A2aPeersFormComponent } from './A2aPeersFormComponent';
import { AgentCardComponent } from './AgentCardComponent';

/**
 * Main Agent Configuration Component with Card/Form View Switching
 */
export class AgentFormComponent implements StyledComponent, ScriptedComponent {
    private data: any;
    private readonly: boolean;
    private agentDetailsForm: AgentDetailsFormComponent;
    private interfaceForm: InterfaceFormComponent;
    private mcpServersForm: McpServersFormComponent;
    private a2aPeersForm: A2aPeersFormComponent;
    private agentCard: AgentCardComponent;

    constructor(data: any = {}, readonly: boolean = false) {
        this.data = data;
        this.readonly = readonly;
        
        // Initialize sub-components
        this.agentDetailsForm = new AgentDetailsFormComponent();
        this.interfaceForm = new InterfaceFormComponent();
        this.mcpServersForm = new McpServersFormComponent();
        this.a2aPeersForm = new A2aPeersFormComponent();
        this.agentCard = new AgentCardComponent();
    }
    
    public render(config: LowCodeConfig): string {
        const { readonly } = config;
        
        return `
            <div class="agent-container">
                <!-- Agent Card View (Default) -->
                <div id="agent-card-view" class="view-container">
                    ${this.agentCard.render(config)}
                    ${!readonly ? `
                        <div class="card-actions">
                            <button id="edit-config-btn" class="btn btn-primary">
                                <i class="codicon codicon-gear"></i>
                                Edit Configuration
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- Agent Form View (Hidden by default) -->
                <div id="agent-form-view" class="view-container" style="display: none;">
                    ${this.renderFormView(config)}
                </div>
            </div>
        `;
    }

    private renderFormView(config: LowCodeConfig): string {
        const { readonly } = config;
        const { disabledAttr } = this.getReadonlyAttributes(readonly);
        
        return `
            <div class="agent-form-container">
                <!-- Form Header -->
                <div class="form-header">
                    <h4 class="form-title">
                        <i class="codicon codicon-gear"></i>
                        Agent Configuration
                    </h4>
                    <p class="form-description">
                        Configure your agent's metadata, interface, and connections using the forms below.
                    </p>
                </div>

                <!-- Form Navigation Tabs -->
                <div class="form-tabs">
                    <button class="tab-button active" data-tab="metadata" ${disabledAttr}>
                        <i class="codicon codicon-person"></i>
                        Agent Details
                    </button>
                    <button class="tab-button" data-tab="interface" ${disabledAttr}>
                        <i class="codicon codicon-gear"></i>
                        Interface
                    </button>
                    <button class="tab-button" data-tab="mcp" ${disabledAttr}>
                        <i class="codicon codicon-plug"></i>
                        MCP Connections
                    </button>
                    <button class="tab-button" data-tab="a2a" ${disabledAttr}>
                        <i class="codicon codicon-organization"></i>
                        Agent Network
                    </button>
                </div>

                <!-- Form Content Container -->
                <div class="form-content">
                    <!-- Agent Metadata Tab -->
                    <div class="tab-content active" id="metadata-tab">
                        ${this.agentDetailsForm.render(config)}
                    </div>

                    <!-- Interface Configuration Tab -->
                    <div class="tab-content" id="interface-tab">
                        ${this.interfaceForm.render(config)}
                    </div>

                    <!-- MCP Connections Tab -->
                    <div class="tab-content" id="mcp-tab">
                        ${this.mcpServersForm.render(config)}
                    </div>

                    <!-- A2A Connections Tab -->
                    <div class="tab-content" id="a2a-tab">
                        ${this.a2aPeersForm.render(config)}
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="form-actions">
                    <button class="btn btn-primary" id="saveMetadataBtn" ${disabledAttr}>
                        <i class="codicon codicon-save"></i>
                        Save Configuration
                    </button>
                    <button class="btn btn-secondary" id="closeFormBtn2" ${disabledAttr}>
                        <i class="codicon codicon-close"></i>
                        Close
                    </button>
                </div>
            </div>
        `;
    }

    public getStyles(): string {
        return `
            /* View Container Styles */
            .agent-container {
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
            }

            .view-container {
                display: block;
            }

            /* Card Actions */
            .card-actions {
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--vscode-panel-border);
            }

            .btn {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 4px;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.2s;
            }

            .btn:hover {
                background-color: var(--vscode-button-hoverBackground);
            }

            .btn-primary {
                background-color: var(--vscode-textLink-foreground);
                color: var(--vscode-button-foreground);
            }

            .btn-primary:hover {
                background-color: var(--vscode-textLink-activeForeground);
            }

            .btn-secondary {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
            }

            .btn-secondary:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
            }

            /* Agent Form Container */
            .agent-form-container {
                padding: 20px;
                max-width: 900px;
                margin: 0 auto;
            }

            .form-header {
                margin-bottom: 24px;
            }

            .form-actions {
                display: flex;
                gap: 8px;
            }

            .form-title {
                color: var(--vscode-foreground);
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 18px;
                font-weight: 600;
            }

            .form-description {
                color: var(--vscode-descriptionForeground);
                margin-bottom: 0;
                font-size: 14px;
            }

            /* Tab Navigation */
            .form-tabs {
                display: flex;
                border-bottom: 1px solid var(--vscode-panel-border);
                margin-bottom: 24px;
                overflow-x: auto;
                justify-content: center;
            }

            .tab-button {
                background: none;
                border: none;
                padding: 12px 16px;
                color: var(--vscode-tab-inactiveForeground);
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                font-weight: 500;
                white-space: nowrap;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .tab-button:hover {
                color: var(--vscode-tab-activeForeground);
                background-color: var(--vscode-tab-hoverBackground);
            }

            .tab-button.active {
                color: var(--vscode-tab-activeForeground);
                border-bottom-color: var(--vscode-textLink-foreground);
            }

            .tab-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Tab Content */
            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            /* Common Form Styles */
            .form-section {
                margin-bottom: 32px;
                padding: 20px;
                background-color: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 6px;
            }

            .section-title {
                color: var(--vscode-textLink-foreground);
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 15px;
                font-weight: 600;
            }

            .section-description {
                color: var(--vscode-descriptionForeground);
                margin-bottom: 16px;
                font-size: 13px;
                line-height: 1.4;
            }

            .form-group {
                margin-bottom: 16px;
            }

            .form-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 16px;
            }

            .form-row .form-group {
                margin-bottom: 0;
            }

            label {
                display: block;
                color: var(--vscode-foreground);
                font-weight: 500;
                margin-bottom: 6px;
                font-size: 13px;
            }

            .required {
                color: var(--vscode-errorForeground);
            }

            .form-control {
                width: 100%;
                padding: 8px 12px;
                background-color: var(--vscode-input-background);
                border: 1px solid var(--vscode-input-border);
                border-radius: 3px;
                color: var(--vscode-input-foreground);
                font-size: 13px;
                font-family: var(--vscode-font-family);
                transition: border-color 0.2s ease;
            }

            .form-control:focus {
                outline: none;
                border-color: var(--vscode-focusBorder);
                box-shadow: 0 0 0 1px var(--vscode-focusBorder);
            }

            .form-control:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .form-text {
                color: var(--vscode-descriptionForeground);
                font-size: 11px;
                margin-top: 4px;
                line-height: 1.3;
            }

            textarea.form-control {
                resize: vertical;
                min-height: 60px;
                font-family: var(--vscode-font-family);
            }

            /* Buttons */
            .btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                text-decoration: none;
                transition: all 0.2s ease;
                border: 1px solid transparent;
            }

            .btn-primary {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border-color: var(--vscode-button-background);
            }

            .btn-primary:hover {
                background-color: var(--vscode-button-hoverBackground);
            }

            .btn-secondary {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border-color: var(--vscode-button-border);
            }

            .btn-secondary:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
            }

            .btn-outline {
                background-color: transparent;
                color: var(--vscode-textLink-foreground);
                border-color: var(--vscode-textLink-foreground);
            }

            .btn-outline:hover {
                background-color: var(--vscode-textLink-foreground);
                color: var(--vscode-button-foreground);
            }

            .btn-sm {
                padding: 4px 8px;
                font-size: 11px;
            }

            .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Form Actions */
            .form-actions {
                display: flex;
                gap: 12px;
                padding: 20px;
                background-color: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 6px;
                margin-top: 24px;
                justify-content: center;
            }

            /* Container styles */
            .servers-container,
            .peers-container {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 12px;
                background-color: var(--vscode-editor-background);
            }

            .servers-list,
            .peers-list {
                margin-bottom: 12px;
                min-height: 20px;
            }

            .server-item,
            .peer-item {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 12px;
                margin-bottom: 8px;
                background-color: var(--vscode-input-background);
            }

            .server-header,
            .peer-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .server-title,
            .peer-title {
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

            /* Responsive Design */
            @media (max-width: 600px) {
                .agent-form-container {
                    padding: 12px;
                }

                .form-row {
                    grid-template-columns: 1fr;
                }

                .form-tabs {
                    flex-wrap: wrap;
                }

                .tab-button {
                    flex: 1;
                    min-width: 120px;
                }

                .form-actions {
                    flex-direction: column;
                }
            }

            /* Include styles from sub-components */
            ${this.agentCard.getStyles()}
            ${this.agentDetailsForm.getStyles()}
            ${this.interfaceForm.getStyles()}
            ${this.mcpServersForm.getStyles()}
            ${this.a2aPeersForm.getStyles()}
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // Agent Form Component Scripts with View Switching
            document.addEventListener('DOMContentLoaded', function() {
                console.log('DOM loaded, initializing view switching...'); // Debug log
                
                // Define all functions first
                function initializeViewSwitching() {
                    console.log('Initializing view switching...'); // Debug log
                    const cardView = document.getElementById('agent-card-view');
                    const formView = document.getElementById('agent-form-view');
                    const editConfigBtn = document.getElementById('edit-config-btn');

                    console.log('Elements found:', {
                        cardView: !!cardView,
                        formView: !!formView,
                        editConfigBtn: !!editConfigBtn
                    }); // Debug log

                    // Show form view when Edit Configuration is clicked
                    if (editConfigBtn) {
                        console.log('Attaching event listener to Edit Configuration button'); // Debug log
                        editConfigBtn.addEventListener('click', function() {
                            console.log('Edit Configuration clicked'); // Debug log
                            if (cardView && formView) {
                                console.log('Switching views: hiding card, showing form'); // Debug log
                                cardView.style.display = 'none';
                                formView.style.display = 'block';
                            } else {
                                console.error('Card or form view not found', { cardView: !!cardView, formView: !!formView });
                            }
                        });
                    } else {
                        console.error('Edit Configuration button not found!');
                    }
                }
                
                // View switching functionality
                initializeViewSwitching();
                
                const formContainer = document.querySelector('.agent-form-container');
                if (formContainer) {
                    // Tab switching functionality
                    const tabButtons = formContainer.querySelectorAll('.tab-button');
                    const tabContents = formContainer.querySelectorAll('.tab-content');

                    tabButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            const tabId = this.getAttribute('data-tab');
                            
                            // Update tab buttons
                            tabButtons.forEach(btn => btn.classList.remove('active'));
                            this.classList.add('active');
                            
                            // Update tab contents
                            tabContents.forEach(content => content.classList.remove('active'));
                            const targetContent = document.getElementById(tabId + '-tab');
                            if (targetContent) {
                                targetContent.classList.add('active');
                            }
                        });
                    });

                    // Initialize form handlers
                    initializeMetadataHandlers();
                }

                // Initialize additional form handlers
                initializeMcpHandlers();
                initializeA2AHandlers();
                initializeFormActions();
            }); // End of DOMContentLoaded event listener

            function initializeMetadataHandlers() {
                // Author management
                const addAuthorBtn = document.getElementById('add-author-btn');
                const authorNameInput = document.getElementById('author-name');
                const authorEmailInput = document.getElementById('author-email');
                const authorsList = document.getElementById('authors-list');

                if (addAuthorBtn) {
                    addAuthorBtn.addEventListener('click', function() {
                        const name = authorNameInput.value.trim();
                        const email = authorEmailInput.value.trim();

                        if (name && email) {
                            addAuthor(name, email);
                            authorNameInput.value = '';
                            authorEmailInput.value = '';
                        }
                    });
                }

                // Enter key support for author inputs
                if (authorEmailInput) {
                    authorEmailInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            addAuthorBtn.click();
                        }
                    });
                }

                function addAuthor(name, email) {
                    const authorTag = document.createElement('span');
                    authorTag.className = 'author-tag';
                    authorTag.innerHTML = \`
                        \${name} &lt;\${email}&gt;
                        <button type="button" class="remove-author" title="Remove author">
                            <i class="codicon codicon-close"></i>
                        </button>
                    \`;

                    authorTag.querySelector('.remove-author').addEventListener('click', function() {
                        authorTag.remove();
                        notifyFormChange();
                    });

                    authorsList.appendChild(authorTag);
                    notifyFormChange();
                }

                // Agent identifier validation
                const identifierInput = document.getElementById('agent-identifier');
                if (identifierInput) {
                    identifierInput.addEventListener('input', function() {
                        const value = this.value;
                        const isValid = /^[a-z0-9][a-z0-9_-]*$/.test(value) || value === '';
                        
                        this.classList.toggle('is-invalid', !isValid && value !== '');
                        this.classList.toggle('is-valid', isValid && value !== '');
                    });
                }
            }

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
            }

            function initializeMcpHandlers() {
                const addServerBtn = document.getElementById('add-mcp-server-btn');
                
                if (addServerBtn) {
                    addServerBtn.addEventListener('click', addMcpServer);
                }

                function addMcpServer() {
                    const container = document.getElementById('mcp-servers-list');
                    const serverId = \`mcp-server-\${Date.now()}\`;
                    
                    const serverDiv = document.createElement('div');
                    serverDiv.className = 'server-item';
                    serverDiv.innerHTML = \`
                        <div class="server-header">
                            <span class="server-title">MCP Server</span>
                            <button type="button" class="remove-item">
                                <i class="codicon codicon-trash"></i> Remove
                            </button>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Server Name</label>
                                <input type="text" class="form-control server-name" placeholder="e.g., github_api">
                            </div>
                            <div class="form-group">
                                <label>Transport Type</label>
                                <select class="form-control transport-type">
                                    <option value="http_sse">HTTP SSE</option>
                                    <option value="stdio">STDIO</option>
                                    <option value="streamable_http">Streamable HTTP</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="url-label">URL</label>
                            <input type="text" class="form-control transport-url" placeholder="e.g., https://mcp.github.com/api">
                        </div>
                        <div class="form-group" style="display: none;">
                            <label class="command-label">Command</label>
                            <input type="text" class="form-control transport-command" placeholder="e.g., npx -y @modelcontextprotocol/server-filesystem">
                        </div>
                        <div class="form-group">
                            <label>Authentication Type</label>
                            <select class="form-control auth-type">
                                <option value="">None</option>
                                <option value="oauth2">OAuth 2.0</option>
                                <option value="api_key">API Key</option>
                                <option value="bearer">Bearer Token</option>
                            </select>
                        </div>
                    \`;

                    // Transport type change handler
                    const transportSelect = serverDiv.querySelector('.transport-type');
                    const urlGroup = serverDiv.querySelector('.form-group:has(.transport-url)');
                    const commandGroup = serverDiv.querySelector('.form-group:has(.transport-command)');

                    transportSelect.addEventListener('change', function() {
                        const isStdio = this.value === 'stdio';
                        urlGroup.style.display = isStdio ? 'none' : 'block';
                        commandGroup.style.display = isStdio ? 'block' : 'none';
                        notifyFormChange();
                    });

                    const removeBtn = serverDiv.querySelector('.remove-item');
                    removeBtn.addEventListener('click', function() {
                        serverDiv.remove();
                        notifyFormChange();
                    });

                    // Add change listeners
                    serverDiv.querySelectorAll('input, select').forEach(input => {
                        input.addEventListener('change', notifyFormChange);
                    });

                    container.appendChild(serverDiv);
                    notifyFormChange();
                }

                // Tool filter handlers
                const allowToolsTextarea = document.getElementById('allow-tools');
                const denyToolsTextarea = document.getElementById('deny-tools');

                if (allowToolsTextarea) {
                    allowToolsTextarea.addEventListener('change', notifyFormChange);
                }
                if (denyToolsTextarea) {
                    denyToolsTextarea.addEventListener('change', notifyFormChange);
                }
            }

            function initializeA2AHandlers() {
                const addPeerBtn = document.getElementById('add-a2a-peer-btn');
                
                if (addPeerBtn) {
                    addPeerBtn.addEventListener('click', addA2APeer);
                }

                function addA2APeer() {
                    const container = document.getElementById('a2a-peers-list');
                    const peerId = \`a2a-peer-\${Date.now()}\`;
                    
                    const peerDiv = document.createElement('div');
                    peerDiv.className = 'peer-item';
                    peerDiv.innerHTML = \`
                        <div class="peer-header">
                            <span class="peer-title">Peer Agent</span>
                            <button type="button" class="remove-item">
                                <i class="codicon codicon-trash"></i> Remove
                            </button>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Peer Name</label>
                                <input type="text" class="form-control peer-name" placeholder="e.g., research_assistant">
                            </div>
                            <div class="form-group">
                                <label>Endpoint URL</label>
                                <input type="url" class="form-control peer-endpoint" placeholder="https://agents.example.com/research-assistant">
                            </div>
                        </div>
                    \`;

                    const removeBtn = peerDiv.querySelector('.remove-item');
                    removeBtn.addEventListener('click', function() {
                        peerDiv.remove();
                        notifyFormChange();
                    });

                    // Add change listeners
                    peerDiv.querySelectorAll('input').forEach(input => {
                        input.addEventListener('change', notifyFormChange);
                    });

                    container.appendChild(peerDiv);
                    notifyFormChange();
                }
            }

            function initializeFormActions() {
                const saveBtn = document.getElementById('saveMetadataBtn');
                const closeBtn2 = document.getElementById('closeFormBtn2');

                if (saveBtn) {
                    saveBtn.addEventListener('click', function() {
                        const formData = collectFormData();
                        if (window.vscode) {
                            window.vscode.postMessage({
                                type: 'saveMetadata',
                                data: formData
                            });
                        }
                    });
                }

                if (closeBtn2) {
                    closeBtn2.addEventListener('click', function() {
                        // Switch back to card view
                        const cardView = document.getElementById('agent-card-view');
                        const formView = document.getElementById('agent-form-view');
                        if (cardView && formView) {
                            formView.style.display = 'none';
                            cardView.style.display = 'block';
                        }
                    });
                }

                // Add change listeners to all form inputs
                document.querySelectorAll('.form-control').forEach(input => {
                    input.addEventListener('change', notifyFormChange);
                });
            }

            function collectFormData() {
                const formData = {
                    identifier: document.getElementById('agent-identifier')?.value || '',
                    name: document.getElementById('agent-name')?.value || '',
                    description: document.getElementById('agent-description')?.value || '',
                    version: document.getElementById('agent-version')?.value || '',
                    namespace: document.getElementById('agent-namespace')?.value || '',
                    license: document.getElementById('agent-license')?.value || '',
                    iconUrl: document.getElementById('agent-icon')?.value || '',
                    authors: collectAuthors(),
                    provider: {
                        organization: document.getElementById('provider-org')?.value || '',
                        url: document.getElementById('provider-url')?.value || ''
                    },
                    interface: {
                        type: document.getElementById('interface-type')?.value || 'function',
                        signature: {
                            input: collectParameters('input'),
                            output: collectParameters('output')
                        },
                        exposure: collectExposureSettings()
                    },
                    connections: {
                        mcp: {
                            servers: collectMcpServers(),
                            tool_filter: {
                                allow: (document.getElementById('allow-tools')?.value || '').split('\\n').filter(line => line.trim()),
                                deny: (document.getElementById('deny-tools')?.value || '').split('\\n').filter(line => line.trim())
                            }
                        },
                        a2a: {
                            peers: collectA2APeers()
                        }
                    }
                };

                return formData;
            }

            function collectAuthors() {
                const authors = [];
                document.querySelectorAll('.author-tag').forEach(tag => {
                    const text = tag.textContent.trim();
                    if (text) {
                        authors.push(text);
                    }
                });
                return authors;
            }

            function collectParameters(type) {
                const parameters = [];
                document.querySelectorAll(\`#\${type}-parameters-list .parameter-item\`).forEach(item => {
                    const param = {
                        name: item.querySelector('.param-name')?.value || '',
                        type: item.querySelector('.param-type')?.value || 'string',
                        description: item.querySelector('.param-description')?.value || ''
                    };
                    
                    if (type === 'input') {
                        param.required = item.querySelector('.param-required')?.checked || false;
                    }

                    if (param.name) {
                        parameters.push(param);
                    }
                });
                return parameters;
            }

            function collectExposureSettings() {
                const interfaceType = document.getElementById('interface-type')?.value;
                if (interfaceType !== 'service') {
                    return {};
                }

                return {
                    http: {
                        path: document.getElementById('http-path')?.value || '',
                        authentication: {
                            type: document.getElementById('auth-type')?.value || ''
                        }
                    },
                    a2a: {
                        discoverable: document.getElementById('a2a-discoverable')?.checked !== false,
                        agent_card: {
                            name: document.getElementById('agent-card-name')?.value || '',
                            description: document.getElementById('agent-card-description')?.value || '',
                            icon: document.getElementById('agent-card-icon')?.value || ''
                        }
                    }
                };
            }

            function collectMcpServers() {
                const servers = [];
                document.querySelectorAll('#mcp-servers-list .server-item').forEach(item => {
                    const transportType = item.querySelector('.transport-type')?.value || 'http_sse';
                    const server = {
                        name: item.querySelector('.server-name')?.value || '',
                        transport: {
                            type: transportType
                        }
                    };

                    if (transportType === 'stdio') {
                        server.transport.command = item.querySelector('.transport-command')?.value || '';
                    } else {
                        server.transport.url = item.querySelector('.transport-url')?.value || '';
                    }

                    const authType = item.querySelector('.auth-type')?.value;
                    if (authType) {
                        server.authentication = { type: authType };
                    }

                    if (server.name) {
                        servers.push(server);
                    }
                });
                return servers;
            }

            function collectA2APeers() {
                const peers = [];
                document.querySelectorAll('#a2a-peers-list .peer-item').forEach(item => {
                    const peer = {
                        name: item.querySelector('.peer-name')?.value || '',
                        endpoint: item.querySelector('.peer-endpoint')?.value || ''
                    };

                    if (peer.name && peer.endpoint) {
                        peers.push(peer);
                    }
                });
                return peers;
            }

            function resetForm() {
                // Clear all inputs
                document.querySelectorAll('.form-control').forEach(input => {
                    if (input.type === 'checkbox') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });

                // Clear dynamic lists
                document.getElementById('authors-list').innerHTML = '';
                document.getElementById('input-parameters-list').innerHTML = '';
                document.getElementById('output-parameters-list').innerHTML = '';
                document.getElementById('mcp-servers-list').innerHTML = '';
                document.getElementById('a2a-peers-list').innerHTML = '';

                // Hide service exposure section
                document.getElementById('service-exposure-section').style.display = 'none';

                // Reset to first tab
                document.querySelector('.tab-button[data-tab="metadata"]').click();

                notifyFormChange();
            }

            function notifyFormChange() {
                if (window.vscode) {
                    window.vscode.postMessage({
                        type: 'formChanged',
                        data: collectFormData()
                    });
                }
            }

            // Expose functions for external use
            window.afmForm = {
                collectFormData,
                resetForm,
                loadFormData: function(data) {
                    // TODO: Implement form data loading
                }
            };

            // Include AgentCardComponent scripts
            ${this.agentCard.getScripts ? this.agentCard.getScripts(nonce) : ''}
        `;
    }

    private getReadonlyAttributes(readonly: boolean): { readonlyAttr: string; disabledAttr: string } {
        return {
            readonlyAttr: readonly ? 'readonly' : '',
            disabledAttr: readonly ? 'disabled' : ''
        };
    }
}