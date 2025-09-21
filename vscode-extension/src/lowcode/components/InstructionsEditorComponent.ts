import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { LowCodeUtils } from '../utils';

/**
 * Instructions editor component for editing agent content/prompts
 * This is a placeholder for future implementation
 */
export class InstructionsEditorComponent implements StyledComponent, ScriptedComponent {
    
    public render(config: LowCodeConfig): string {
        const { readonly } = config;
        
        // For now, just return a placeholder
        // TODO: Implement rich markdown editor for agent instructions
        if (readonly) {
            return `
                <div class="section">
                    <div class="section-title">📋 Instructions</div>
                    <div class="instructions-preview">
                        <div class="empty-state">Instructions editor will be available in future updates</div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="section">
                <div class="section-title">📋 Edit Instructions</div>
                <div class="instructions-editor-placeholder">
                    <div class="empty-state">
                        Rich instructions editor coming soon!<br>
                        <small>For now, use the source editor for editing agent content.</small>
                    </div>
                </div>
            </div>
        `;
    }

    public getStyles(): string {
        return `
            .instructions-preview,
            .instructions-editor-placeholder {
                background: var(--vscode-textCodeBlock-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 20px;
                min-height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .instructions-editor-placeholder .empty-state small {
                display: block;
                margin-top: 8px;
                font-size: 11px;
                opacity: 0.8;
            }
        `;
    }

    public getScripts(nonce: string): string {
        // Placeholder for future scripts
        return `
            // Instructions editor scripts will be added here
            console.log('Instructions editor placeholder loaded');
        `;
    }
}