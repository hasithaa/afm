import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { LowCodeUtils } from '../utils';

export interface A2aPeer {
    id: string;
    url: string;
    description?: string;
}

export class A2aPeersFormComponent implements StyledComponent, ScriptedComponent {

    public render(config: LowCodeConfig): string {
        const { readonly, document } = config;
        const { disabledAttr } = this.getReadonlyAttributes(readonly);
        
        // For now, use empty array - A2A peers will be added to metadata later
        const a2aPeers: A2aPeer[] = [];

        return `
            <div class="form-section">
                <h3 class="section-title">
                    <i class="codicon codicon-organization"></i>
                    Agent-to-Agent (A2A) Network
                </h3>
                <p class="section-description">
                    Configure connections to other agents for collaborative workflows and distributed processing.
                </p>

                <div class="peers-container">
                    <div id="a2a-peers-list" class="peers-list">
                        ${this.renderA2aPeers(a2aPeers, readonly)}
                    </div>
                    ${!readonly ? `
                        <div class="add-peer-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="a2a-peer-id">Agent ID <span class="required">*</span></label>
                                    <input 
                                        type="text" 
                                        id="a2a-peer-id" 
                                        class="form-control" 
                                        placeholder="math-tutor-agent"
                                        ${disabledAttr}
                                    >
                                    <div class="form-text">Unique identifier of the peer agent</div>
                                </div>
                                <div class="form-group">
                                    <label for="a2a-peer-url">Connection URL <span class="required">*</span></label>
                                    <input 
                                        type="text" 
                                        id="a2a-peer-url" 
                                        class="form-control" 
                                        placeholder="http://localhost:3001"
                                        ${disabledAttr}
                                    >
                                    <div class="form-text">URL where the peer agent can be reached</div>
                                </div>
                                <div class="form-group">
                                    <button 
                                        type="button" 
                                        id="add-a2a-peer-btn" 
                                        class="btn btn-secondary"
                                        ${disabledAttr}
                                    >
                                        <i class="codicon codicon-add"></i> Add Peer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    private renderA2aPeers(a2aPeers: A2aPeer[], readonly: boolean): string {
        if (!a2aPeers || a2aPeers.length === 0) {
            return '<div class="empty-state">No A2A peers configured yet</div>';
        }

        return a2aPeers.map((peer: A2aPeer, index: number) => `
            <div class="peer-item" data-index="${index}">
                <div class="peer-header">
                    <span class="peer-title">${LowCodeUtils.escapeHtml(peer.id)}</span>
                    ${!readonly ? `
                        <button type="button" class="remove-item" onclick="removeA2aPeer(${index})">
                            <i class="codicon codicon-trash"></i> Remove
                        </button>
                    ` : ''}
                </div>
                <div class="form-text">URL: ${LowCodeUtils.escapeHtml(peer.url)}</div>
                ${peer.description ? `
                    <div class="form-text">Description: ${peer.description}</div>
                ` : ''}
            </div>
        `).join('');
    }

    public getStyles(): string {
        return `
            /* A2A Peers Specific Styles */
            .add-peer-form {
                border-top: 1px solid var(--vscode-panel-border);
                padding-top: 12px;
                margin-top: 12px;
            }

            .peer-item {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 12px;
                margin-bottom: 8px;
                background-color: var(--vscode-input-background);
            }

            .peer-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .peer-title {
                font-weight: 500;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
            }

            .peers-list {
                margin-bottom: 12px;
                min-height: 20px;
            }

            .peers-container {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 12px;
                background-color: var(--vscode-editor-background);
            }

            .empty-state {
                text-align: center;
                color: var(--vscode-descriptionForeground);
                font-style: italic;
                padding: 20px;
                font-size: 13px;
            }
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // A2A Peers Management
            function addA2aPeer() {
                const idInput = document.getElementById('a2a-peer-id');
                const urlInput = document.getElementById('a2a-peer-url');
                
                if (!idInput || !urlInput) return;
                
                const id = idInput.value.trim();
                const url = urlInput.value.trim();
                
                if (!id || !url) {
                    alert('Please enter both peer ID and URL');
                    return;
                }
                
                if (!agentData.a2aPeers) {
                    agentData.a2aPeers = [];
                }
                
                // Check for duplicates
                const exists = agentData.a2aPeers.some(peer => peer.id === id);
                if (exists) {
                    alert('A2A peer with this ID already exists');
                    return;
                }
                
                agentData.a2aPeers.push({ id, url });
                renderA2aPeers();
                
                // Clear inputs
                idInput.value = '';
                urlInput.value = '';
            }

            function removeA2aPeer(index) {
                if (agentData.a2aPeers && index >= 0 && index < agentData.a2aPeers.length) {
                    agentData.a2aPeers.splice(index, 1);
                    renderA2aPeers();
                }
            }

            function renderA2aPeers() {
                const peersList = document.getElementById('a2a-peers-list');
                if (!peersList) return;
                
                if (!agentData.a2aPeers || agentData.a2aPeers.length === 0) {
                    peersList.innerHTML = '<div class="empty-state">No A2A peers configured yet</div>';
                    return;
                }
                
                peersList.innerHTML = agentData.a2aPeers.map((peer, index) => \`
                    <div class="peer-item">
                        <div class="peer-header">
                            <span class="peer-title">\${peer.id}</span>
                            <button type="button" class="remove-item" onclick="removeA2aPeer(\${index})">
                                <i class="codicon codicon-trash"></i> Remove
                            </button>
                        </div>
                        <div class="form-text">URL: \${peer.url}</div>
                    </div>
                \`).join('');
            }

            // Initialize A2A peers component
            document.addEventListener('DOMContentLoaded', () => {
                const addPeerBtn = document.getElementById('add-a2a-peer-btn');
                if (addPeerBtn) {
                    addPeerBtn.addEventListener('click', addA2aPeer);
                }
                renderA2aPeers();
            });
        `;
    }

    private getReadonlyAttributes(readonly: boolean): { readonlyAttr: string; disabledAttr: string } {
        return {
            readonlyAttr: readonly ? 'readonly' : '',
            disabledAttr: readonly ? 'disabled' : ''
        };
    }
}