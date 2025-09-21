import { LowCodeComponent, LowCodeConfig, StyledComponent } from '../types';
import { LowCodeUtils } from '../utils';

/**
 * Agent profile card component showing metadata overview
 */
export class AgentCardComponent implements StyledComponent {
    
    public render(config: LowCodeConfig): string {
        const { document, uri } = config;
        const agentName = document.metadata?.name || LowCodeUtils.getAgentName(uri);
        const description = document.metadata?.description || 'No description provided';
        const version = document.metadata?.version || '0.0.0';
        const namespace = document.metadata?.namespace || 'default';
        const license = document.metadata?.license || 'Not specified';
        const author = document.metadata?.author || 'Not specified';
        
        return `
            <div class="agent-card">
                <div class="agent-name">${LowCodeUtils.escapeHtml(agentName)}</div>
                <div class="agent-description">${LowCodeUtils.escapeHtml(description)}</div>
                <div class="agent-meta">
                    <div class="meta-item">
                        <div class="meta-label">Version</div>
                        <div class="meta-value">${LowCodeUtils.escapeHtml(version)}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Namespace</div>
                        <div class="meta-value">${LowCodeUtils.escapeHtml(namespace)}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">License</div>
                        <div class="meta-value">${LowCodeUtils.escapeHtml(license)}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Author</div>
                        <div class="meta-value">${LowCodeUtils.escapeHtml(author)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    public getStyles(): string {
        return `
            .agent-card {
                background: var(--vscode-sideBar-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 6px;
                padding: 16px;
                margin-bottom: 20px;
            }
            
            .agent-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 8px;
                color: var(--vscode-textLink-foreground);
            }
            
            .agent-description {
                color: var(--vscode-descriptionForeground);
                font-size: 13px;
                line-height: 1.5;
                margin-bottom: 12px;
            }
            
            .agent-meta {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                font-size: 12px;
            }
            
            .meta-item {
                display: flex;
                flex-direction: column;
            }
            
            .meta-label {
                color: var(--vscode-descriptionForeground);
                margin-bottom: 2px;
            }
            
            .meta-value {
                color: var(--vscode-foreground);
                font-weight: 500;
            }
        `;
    }
}