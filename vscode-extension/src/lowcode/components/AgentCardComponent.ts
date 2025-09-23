import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { LowCodeUtils } from '../utils';

/**
 * Agent profile card component with edit/save pattern
 */
export class AgentCardComponent implements StyledComponent, ScriptedComponent {
    
    public render(config: LowCodeConfig): string {
        const { document, uri, readonly } = config;
        const agentName = document.metadata?.name || LowCodeUtils.getAgentName(uri);
        const description = document.metadata?.description || 'No description provided';
        // Don't default version to '0.0.1' - keep it empty if not set
        const version = document.metadata?.version || '';
        // Don't default namespace to 'default' - keep it empty if not set  
        const namespace = document.metadata?.namespace || '';
        const license = document.metadata?.license || '';
        const author = document.metadata?.author || '';
        const iconUrl = document.metadata?.iconUrl || '';
        
        return `
            <div class="agent-card">
                <!-- Preview Mode -->
                <div id="metadata-preview" class="metadata-preview">
                    <div class="agent-header">
                        <div class="agent-icon" id="agentIcon" ${iconUrl ? `style="background-image: url(${iconUrl}); background-size: cover;"` : ''}>
                            ${iconUrl ? '' : '🤖'}
                        </div>
                        <div class="agent-title-block">
                            <h1 class="agent-name">${LowCodeUtils.escapeHtml(agentName)}</h1>
                            <p class="agent-description">${LowCodeUtils.escapeHtml(description)}</p>
                        </div>
                    </div>

                    <div class="agent-details-compact">
                        <div class="detail-row">
                            <span class="detail-label">Namespace:</span>
                            <span class="detail-value">${LowCodeUtils.escapeHtml(namespace)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Version:</span>
                            <span class="detail-value">${LowCodeUtils.escapeHtml(version)}</span>
                        </div>
                        ${license ? `
                        <div class="detail-row">
                            <span class="detail-label">License:</span>
                            <span class="detail-value">${LowCodeUtils.escapeHtml(license)}</span>
                        </div>` : ''}
                        ${author ? `
                        <div class="detail-row">
                            <span class="detail-label">Author:</span>
                            <span class="detail-value">${LowCodeUtils.escapeHtml(author)}</span>
                        </div>` : ''}
                        ${iconUrl ? `
                        <div class="detail-row">
                            <span class="detail-label">Icon URL:</span>
                            <span class="detail-value">${LowCodeUtils.escapeHtml(iconUrl)}</span>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    public getStyles(): string {
        return `
            .agent-card {
                background-color: var(--vscode-editorWidget-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 5px;
                padding: 20px;
                margin-bottom: 30px;
                position: relative;
            }
            
            /* Preview Mode Styles */
            .metadata-preview .agent-header {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .metadata-preview .agent-icon {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #555;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2em;
                color: #ccc;
                margin-right: 15px;
                flex-shrink: 0;
            }
            
            .metadata-preview .agent-title-block {
                flex: 1;
            }
            
            .metadata-preview .agent-name {
                margin: 0 0 8px 0;
                font-size: 1.4em;
                font-weight: bold;
                color: var(--vscode-editor-foreground);
            }
            
            .metadata-preview .agent-description {
                margin: 0;
                color: var(--vscode-descriptionForeground);
                font-style: italic;
            }
            
            .agent-details-compact {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 8px;
                margin-top: 15px;
            }
            
            .detail-row {
                display: flex;
                align-items: center;
                padding: 4px 0;
            }
            
            .detail-label {
                font-weight: bold;
                color: var(--vscode-editor-foreground);
                margin-right: 8px;
                min-width: 80px;
            }
            
            .detail-value {
                color: var(--vscode-descriptionForeground);
                flex: 1;
                word-break: break-word;
            }
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // Agent Card Component - Read-only display
            console.log('Agent card component loaded');
        `;
    }
}