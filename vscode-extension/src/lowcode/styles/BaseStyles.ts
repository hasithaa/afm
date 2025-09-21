/**
 * Base styles for LowCode components
 */
export class BaseStyles {
    
    public static getBaseStyles(): string {
        return `
            body {
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            
            .section {
                margin-bottom: 25px;
            }
            
            .section-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 12px;
                color: var(--vscode-textLink-foreground);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 6px 12px;
                border-radius: 2px;
                cursor: pointer;
                font-size: 12px;
                margin-left: 8px;
            }
            
            .btn:hover:not(:disabled) {
                background: var(--vscode-button-hoverBackground);
            }
            
            .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .empty-state {
                text-align: center;
                color: var(--vscode-descriptionForeground);
                font-style: italic;
                padding: 20px;
            }
        `;
    }
}