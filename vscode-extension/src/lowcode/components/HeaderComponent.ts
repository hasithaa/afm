import { LowCodeComponent, LowCodeConfig, StyledComponent } from '../types';

/**
 * Header component with title and mode indicator
 */
export class HeaderComponent implements StyledComponent {
    
    public render(config: LowCodeConfig): string {
        const { readonly } = config;
        const { disabledAttr } = this.getReadonlyAttributes(readonly);
        
        return `
            <div class="header">
                <div>
                    <div class="title">AFM Agent - ${readonly ? 'Preview Mode' : 'LowCode Mode'}</div>
                    <div class="mode-indicator">${readonly ? '👁️ Preview Mode' : '✏️ Edit Mode'}</div>
                </div>
                <div>
                    <button class="btn" onclick="openInEditor()" ${disabledAttr}>📝 Edit Source</button>
                </div>
            </div>
        `;
    }

    public getStyles(): string {
        return `
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            
            .title {
                font-size: 18px;
                font-weight: bold;
                color: var(--vscode-textLink-foreground);
            }
            
            .mode-indicator {
                background: var(--vscode-statusBarItem-prominentBackground);
                color: var(--vscode-statusBarItem-prominentForeground);
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .mode-indicator.readonly {
                background: var(--vscode-statusBarItem-warningBackground);
                color: var(--vscode-statusBarItem-warningForeground);
            }
        `;
    }

    private getReadonlyAttributes(readonly: boolean): { readonlyAttr: string; disabledAttr: string } {
        return {
            readonlyAttr: readonly ? 'readonly' : '',
            disabledAttr: readonly ? 'disabled' : ''
        };
    }
}