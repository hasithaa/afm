import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { LowCodeUtils } from '../utils';

/**
 * Agent Details Form Tab Component
 */
export class AgentDetailsFormComponent implements StyledComponent, ScriptedComponent {
    
    public render(config: LowCodeConfig): string {
        const { readonly, document } = config;
        const { disabledAttr } = this.getReadonlyAttributes(readonly);
        
        // Extract data from document metadata
        const metadata = document.metadata || {};
        const name = metadata.name || '';
        const description = metadata.description || '';
        const version = metadata.version || '';
        const namespace = metadata.namespace || '';
        const license = metadata.license || '';
        const iconUrl = metadata.iconUrl || '';
        const authors = metadata.authors || [];
        const provider = metadata.provider || {};
        
        return `
            <div class="form-section">
                <h5 class="section-title">
                    <i class="codicon codicon-info"></i>
                    Basic Information
                </h5>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="agent-name">Agent Name <span class="required">*</span></label>
                        <input type="text" id="agent-name" class="form-control" 
                               value="${LowCodeUtils.escapeHtml(name)}"
                               placeholder="e.g., Math Tutor" ${disabledAttr} required>
                        <small class="form-text">Human-readable name for your agent</small>
                    </div>
                    <div class="form-group">
                        <label for="agent-namespace">Namespace</label>
                        <input type="text" id="agent-namespace" class="form-control" 
                               value="${LowCodeUtils.escapeHtml(namespace)}"
                               placeholder="e.g., education, productivity" ${disabledAttr}>
                        <small class="form-text">Category or domain for your agent</small>
                    </div>
                </div>

                <div class="form-group">
                    <label for="agent-description">Description</label>
                    <textarea id="agent-description" class="form-control" rows="3" 
                              placeholder="Brief description of your agent's purpose and capabilities" 
                              ${disabledAttr}>${LowCodeUtils.escapeHtml(description)}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="agent-version">Version</label>
                        <input type="text" id="agent-version" class="form-control" 
                               value="${LowCodeUtils.escapeHtml(version)}"
                               placeholder="1.0.0" pattern="\\d+\\.\\d+\\.\\d+" ${disabledAttr}>
                        <small class="form-text">Semantic versioning (MAJOR.MINOR.PATCH)</small>
                    </div>
                    <div class="form-group">
                        <label for="license">License</label>
                        <input type="text" id="license" class="form-control" 
                               value="${LowCodeUtils.escapeHtml(license)}"
                               placeholder="e.g., MIT, Apache 2.0" ${disabledAttr}>
                        <small class="form-text">License under which your agent is distributed</small>
                    </div>
                </div>

                <div class="form-group">
                    <label for="icon-url">Icon URL</label>
                    <input type="url" id="icon-url" class="form-control" 
                           value="${LowCodeUtils.escapeHtml(iconUrl)}"
                           placeholder="https://example.com/icon.png" ${disabledAttr}>
                    <small class="form-text">URL to an icon representing your agent</small>
                </div>
            </div>

            <div class="form-section">
                <h5 class="section-title">
                    <i class="codicon codicon-person"></i>
                    Authors & Contributors
                </h5>
                
                <div class="authors-container">
                    <div id="authors-list" class="authors-list">
                        ${this.renderAuthors(authors)}
                    </div>
                    ${!readonly ? `
                        <div class="add-author-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="author-name">Name</label>
                                    <input type="text" id="author-name" class="form-control" placeholder="John Doe">
                                </div>
                                <div class="form-group">
                                    <label for="author-email">Email</label>
                                    <input type="email" id="author-email" class="form-control" placeholder="john@example.com">
                                </div>
                                <div class="form-group">
                                    <button type="button" id="add-author-btn" class="btn btn-secondary">
                                        <i class="codicon codicon-add"></i> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="form-section">
                <h5 class="section-title">
                    <i class="codicon codicon-organization"></i>
                    Provider Information
                </h5>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="provider-organization">Organization</label>
                        <input type="text" id="provider-organization" class="form-control" 
                               value="${LowCodeUtils.escapeHtml(provider.organization || '')}"
                               placeholder="e.g., Your Company Name" ${disabledAttr}>
                        <small class="form-text">Organization or company providing this agent</small>
                    </div>
                    <div class="form-group">
                        <label for="provider-url">Provider URL</label>
                        <input type="url" id="provider-url" class="form-control" 
                               value="${LowCodeUtils.escapeHtml(provider.url || '')}"
                               placeholder="https://yourcompany.com" ${disabledAttr}>
                        <small class="form-text">Website or URL for the provider</small>
                    </div>
                </div>
            </div>
        `;
    }

    private renderAuthors(authors: any[]): string {
        if (!Array.isArray(authors) || authors.length === 0) {
            return '<p class="no-authors">No authors added yet.</p>';
        }

        return authors.map((author, index) => {
            const name = typeof author === 'string' ? author : (author.name || '');
            const email = typeof author === 'object' ? (author.email || '') : '';
            
            return `
                <div class="author-card" data-index="${index}">
                    <div class="author-info">
                        <div class="author-name">${LowCodeUtils.escapeHtml(name)}</div>
                        ${email ? `<div class="author-email">${LowCodeUtils.escapeHtml(email)}</div>` : ''}
                    </div>
                    <button type="button" class="remove-author" data-index="${index}" title="Remove author">
                        <i class="codicon codicon-close"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    public getStyles(): string {
        return `
            /* Agent Details Form Styles */
            .authors-container {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 12px;
                background-color: var(--vscode-editor-background);
            }

            .authors-list {
                margin-bottom: 12px;
                min-height: 20px;
            }

            .no-authors {
                color: var(--vscode-descriptionForeground);
                font-style: italic;
                margin: 0;
                padding: 8px;
                text-align: center;
            }

            .author-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: var(--vscode-editorWidget-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 8px 12px;
                margin-bottom: 8px;
                transition: background-color 0.2s;
            }

            .author-card:hover {
                background-color: var(--vscode-list-hoverBackground);
            }

            .author-info {
                flex: 1;
            }

            .author-name {
                font-weight: 500;
                color: var(--vscode-editor-foreground);
                margin-bottom: 2px;
            }

            .author-email {
                font-size: 0.9em;
                color: var(--vscode-descriptionForeground);
            }

            .remove-author {
                background: none;
                border: none;
                color: var(--vscode-icon-foreground);
                cursor: pointer;
                padding: 4px;
                border-radius: 3px;
                opacity: 0.7;
                transition: all 0.2s;
            }

            .remove-author:hover {
                opacity: 1;
                background-color: var(--vscode-toolbar-hoverBackground);
            }

            .add-author-form .form-row {
                grid-template-columns: 1fr 1fr auto;
                gap: 8px;
                margin-bottom: 0;
                align-items: end;
            }
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // Agent Details Form Scripts
            function initializeAgentDetailsHandlers() {
                // Author management
                const addAuthorBtn = document.getElementById('add-author-btn');
                const authorNameInput = document.getElementById('author-name');
                const authorEmailInput = document.getElementById('author-email');
                const authorsList = document.getElementById('authors-list');

                if (addAuthorBtn) {
                    addAuthorBtn.addEventListener('click', function() {
                        const name = authorNameInput.value.trim();
                        const email = authorEmailInput.value.trim();

                        if (name) {
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

                if (authorNameInput) {
                    authorNameInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            addAuthorBtn.click();
                        }
                    });
                }

                function addAuthor(name, email) {
                    // Remove "no authors" message if it exists
                    const noAuthorsMsg = authorsList.querySelector('.no-authors');
                    if (noAuthorsMsg) {
                        noAuthorsMsg.remove();
                    }

                    const authorCard = document.createElement('div');
                    authorCard.className = 'author-card';
                    authorCard.innerHTML = \`
                        <div class="author-info">
                            <div class="author-name">\${name}</div>
                            \${email ? \`<div class="author-email">\${email}</div>\` : ''}
                        </div>
                        <button type="button" class="remove-author" title="Remove author">
                            <i class="codicon codicon-close"></i>
                        </button>
                    \`;

                    authorCard.querySelector('.remove-author').addEventListener('click', function() {
                        authorCard.remove();
                        
                        // Show "no authors" message if list is empty
                        if (authorsList.children.length === 0) {
                            authorsList.innerHTML = '<p class="no-authors">No authors added yet.</p>';
                        }
                        
                        notifyFormChange();
                    });

                    authorsList.appendChild(authorCard);
                    notifyFormChange();
                }

                // Handle existing remove author buttons
                document.querySelectorAll('.remove-author').forEach(btn => {
                    btn.addEventListener('click', function() {
                        this.closest('.author-card').remove();
                        
                        // Show "no authors" message if list is empty
                        if (authorsList.children.length === 0) {
                            authorsList.innerHTML = '<p class="no-authors">No authors added yet.</p>';
                        }
                        
                        notifyFormChange();
                    });
                });

                // Add change listeners to all form inputs
                document.querySelectorAll('#agent-name, #agent-description, #agent-version, #agent-namespace, #license, #icon-url, #provider-organization, #provider-url').forEach(input => {
                    input.addEventListener('change', notifyFormChange);
                });
            }

            // Expose for external use
            window.agentDetailsForm = {
                initialize: initializeAgentDetailsHandlers
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