/**
 * Base styles for LowCode components
 */
export class BaseStyles {
    
    public static getBaseStyles(): string {
        return `
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", sans-serif;
                font-size: var(--vscode-font-size);
                color: var(--vscode-foreground);
                background-color: var(--vscode-sideBar-background);
                margin: 0;
                padding: 20px;
                line-height: 1.6;
                overflow-y: auto;
            }
            
            .section {
                margin-bottom: 25px;
            }
            
            .section-title {
                color: var(--vscode-sideBarTitle-foreground);
                font-size: 1.2em;
                margin-bottom: 15px;
                border-bottom: 1px solid var(--vscode-panel-border);
                padding-bottom: 5px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 6px 12px;
                border-radius: 3px;
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

            /* Editable field styling */
            .editable-field {
                background: var(--vscode-input-background);
                border: 1px solid var(--vscode-input-border);
                border-radius: 3px;
                padding: 5px 8px;
                color: var(--vscode-input-foreground);
                font-size: 0.9em;
                white-space: pre-wrap;
                min-height: 28px;
                outline: none;
                transition: border-color 0.2s;
                cursor: text;
            }
            
            .editable-field:hover:not([readonly]) {
                border-color: var(--vscode-focusBorder);
            }
            
            .editable-field:focus {
                border-color: var(--vscode-focusBorder);
                box-shadow: 0 0 0 1px var(--vscode-focusBorder);
            }

            .editable-field[readonly] {
                cursor: default;
                opacity: 0.7;
            }
        `;
    }
}