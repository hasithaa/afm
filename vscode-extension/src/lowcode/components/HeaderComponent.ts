import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';

/**
 * Header component with title and mode indicator
 */
export class HeaderComponent implements StyledComponent, ScriptedComponent {
    
    public render(config: LowCodeConfig): string {
        const { readonly } = config;
        const { disabledAttr } = this.getReadonlyAttributes(readonly);
        
        return `
            <div class="header">
                <div>
                    <div class="title">AFM Agent - ${readonly ? 'Preview Mode' : 'LowCode Mode'}</div>
                </div>
                <div class="header-actions">
                    <button class="btn" id="editSourceBtn" ${disabledAttr}>📝 Edit Source</button>
                    <div class="dropdown" id="runDropdown" ${disabledAttr}>
                        <button class="btn dropdown-btn" id="runDropdownBtn" ${disabledAttr}>
                            ▶️ Run <span class="dropdown-arrow">▼</span>
                        </button>
                        <div class="dropdown-content" id="runDropdownContent">
                            <a href="#" id="runBallerinaBtn" ${disabledAttr}>▶️ Run Ballerina</a>
                        </div>
                    </div>
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
            
            .header-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            /* Dropdown Styles */
            .dropdown {
                position: relative;
                display: inline-block;
            }
            
            .dropdown-btn {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .dropdown-arrow {
                font-size: 10px;
                transition: transform 0.2s;
            }
            
            .dropdown.open .dropdown-arrow {
                transform: rotate(180deg);
            }
            
            .dropdown-content {
                display: none;
                position: absolute;
                right: 0;
                background-color: var(--vscode-dropdown-background);
                border: 1px solid var(--vscode-dropdown-border);
                border-radius: 3px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                z-index: 1000;
                min-width: 140px;
                margin-top: 2px;
            }
            
            .dropdown.open .dropdown-content {
                display: block;
            }
            
            .dropdown-content a {
                color: var(--vscode-dropdown-foreground);
                padding: 8px 12px;
                text-decoration: none;
                display: block;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s;
            }
            
            .dropdown-content a:hover {
                background-color: var(--vscode-list-hoverBackground);
            }
            
            .dropdown-content a:active {
                background-color: var(--vscode-list-activeSelectionBackground);
            }
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // Header component event handlers
            document.addEventListener('DOMContentLoaded', function() {
                // Edit Source button
                const editSourceBtn = document.getElementById('editSourceBtn');
                if (editSourceBtn) {
                    editSourceBtn.addEventListener('click', function() {
                        if (window.vscode) {
                            window.vscode.postMessage({ type: 'openInEditor' });
                        }
                    });
                }

                // Run dropdown button
                const runDropdownBtn = document.getElementById('runDropdownBtn');
                const runDropdown = document.getElementById('runDropdown');
                if (runDropdownBtn && runDropdown) {
                    runDropdownBtn.addEventListener('click', function() {
                        runDropdown.classList.toggle('open');
                        
                        // Close dropdown when clicking outside
                        function closeDropdown(e) {
                            if (!runDropdown.contains(e.target)) {
                                runDropdown.classList.remove('open');
                                document.removeEventListener('click', closeDropdown);
                            }
                        }
                        
                        setTimeout(() => {
                            document.addEventListener('click', closeDropdown);
                        }, 0);
                    });
                }

                // Ballerina run button
                const runBallerinaBtn = document.getElementById('runBallerinaBtn');
                if (runBallerinaBtn) {
                    runBallerinaBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const runDropdown = document.getElementById('runDropdown');
                        if (runDropdown) {
                            runDropdown.classList.remove('open');
                        }
                        
                        if (window.vscode) {
                            window.vscode.postMessage({
                                type: 'runAgent',
                                language: 'ballerina'
                            });
                        }
                    });
                }
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