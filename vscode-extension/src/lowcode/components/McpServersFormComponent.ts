import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { LowCodeUtils } from '../utils';

export interface McpServer {
    name: string;
    command: string;
    env?: Record<string, string>;
}

export class McpServersFormComponent implements StyledComponent, ScriptedComponent {

    public render(config: LowCodeConfig): string {
        const { readonly, document } = config;
        const { disabledAttr } = this.getReadonlyAttributes(readonly);
        
        // For now, use empty array - MCP servers will be added to metadata later
        const mcpServers: McpServer[] = [];

        return `
            <div class="form-section">
                <h5 class="section-title">
                    <i class="codicon codicon-server-process"></i>
                    MCP Server Connections
                </h5>
                <p class="section-description">
                    Connect to Model Context Protocol (MCP) servers that provide tools and resources to your agent.
                </p>

                <div class="servers-container">
                    <div id="mcp-servers-list" class="servers-list">
                        ${this.renderMcpServers(mcpServers, readonly)}
                    </div>
                    ${!readonly ? `
                        <div class="add-server-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="mcp-server-name">Server Name <span class="required">*</span></label>
                                    <input 
                                        type="text" 
                                        id="mcp-server-name" 
                                        class="form-control" 
                                        placeholder="filesystem"
                                        ${disabledAttr}
                                    >
                                    <div class="form-text">Unique identifier for this MCP server</div>
                                </div>
                                <div class="form-group">
                                    <label for="mcp-server-command">Command <span class="required">*</span></label>
                                    <input 
                                        type="text" 
                                        id="mcp-server-command" 
                                        class="form-control" 
                                        placeholder="npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/files"
                                        ${disabledAttr}
                                    >
                                    <div class="form-text">Command to start the MCP server</div>
                                </div>
                                <div class="form-group">
                                    <button 
                                        type="button" 
                                        id="add-mcp-server-btn" 
                                        class="btn btn-secondary"
                                        ${disabledAttr}
                                    >
                                        <i class="codicon codicon-add"></i> Add Server
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    private renderMcpServers(mcpServers: McpServer[], readonly: boolean): string {
        if (!mcpServers || mcpServers.length === 0) {
            return '<div class="empty-state">No MCP servers configured yet</div>';
        }

        return mcpServers.map((server, index) => `
            <div class="server-item" data-index="${index}">
                <div class="server-header">
                    <span class="server-title">${LowCodeUtils.escapeHtml(server.name)}</span>
                    ${!readonly ? `
                        <button type="button" class="remove-item" onclick="removeMcpServer(${index})">
                            <i class="codicon codicon-trash"></i> Remove
                        </button>
                    ` : ''}
                </div>
                <div class="form-text">Command: ${LowCodeUtils.escapeHtml(server.command)}</div>
                ${server.env && Object.keys(server.env).length > 0 ? `
                    <div class="form-text">Environment: ${LowCodeUtils.escapeJson(server.env)}</div>
                ` : ''}
            </div>
        `).join('');
    }

    public getStyles(): string {
        return `
            /* MCP Servers Specific Styles */
            .add-server-form {
                border-top: 1px solid var(--vscode-panel-border);
                padding-top: 12px;
                margin-top: 12px;
            }

            .server-item {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 12px;
                margin-bottom: 8px;
                background-color: var(--vscode-input-background);
            }

            .server-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .server-title {
                font-weight: 500;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
            }

            .servers-list {
                margin-bottom: 12px;
                min-height: 20px;
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
            // MCP Servers Management
            function addMcpServer() {
                const nameInput = document.getElementById('mcp-server-name');
                const commandInput = document.getElementById('mcp-server-command');
                
                if (!nameInput || !commandInput) return;
                
                const name = nameInput.value.trim();
                const command = commandInput.value.trim();
                
                if (!name || !command) {
                    alert('Please enter both server name and command');
                    return;
                }
                
                if (!agentData.mcpServers) {
                    agentData.mcpServers = [];
                }
                
                // Check for duplicates
                const exists = agentData.mcpServers.some(server => server.name === name);
                if (exists) {
                    alert('MCP server with this name already exists');
                    return;
                }
                
                agentData.mcpServers.push({ name, command });
                renderMcpServers();
                
                // Clear inputs
                nameInput.value = '';
                commandInput.value = '';
            }

            function removeMcpServer(index) {
                if (agentData.mcpServers && index >= 0 && index < agentData.mcpServers.length) {
                    agentData.mcpServers.splice(index, 1);
                    renderMcpServers();
                }
            }

            function renderMcpServers() {
                const serversList = document.getElementById('mcp-servers-list');
                if (!serversList) return;
                
                if (!agentData.mcpServers || agentData.mcpServers.length === 0) {
                    serversList.innerHTML = '<div class="empty-state">No MCP servers configured yet</div>';
                    return;
                }
                
                serversList.innerHTML = agentData.mcpServers.map((server, index) => \`
                    <div class="server-item">
                        <div class="server-header">
                            <span class="server-title">\${server.name}</span>
                            <button type="button" class="remove-item" onclick="removeMcpServer(\${index})">
                                <i class="codicon codicon-trash"></i> Remove
                            </button>
                        </div>
                        <div class="form-text">Command: \${server.command}</div>
                    </div>
                \`).join('');
            }

            // Initialize MCP servers component
            document.addEventListener('DOMContentLoaded', () => {
                const addServerBtn = document.getElementById('add-mcp-server-btn');
                if (addServerBtn) {
                    addServerBtn.addEventListener('click', addMcpServer);
                }
                renderMcpServers();
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