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
                ${!readonly ? `
                <div class="card-header-controls">
                    <div id="preview-controls" class="preview-controls">
                        <button class="edit-metadata-btn" title="Edit Metadata">✏️ Edit</button>
                    </div>
                    <div id="edit-controls" class="edit-controls" style="display: none;">
                        <button class="save-metadata-btn" title="Save Changes">💾 Save</button>
                        <button class="cancel-metadata-btn" title="Cancel Edit">❌ Cancel</button>
                    </div>
                </div>
                ` : ''}

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

                <div id="metadata-edit" class="metadata-edit" style="display: none;">
                    <div class="edit-form">
                        <div class="form-row">
                            <label for="edit-name">Name:</label>
                            <input type="text" id="edit-name" value="${LowCodeUtils.escapeHtml(agentName)}" />
                        </div>
                        <div class="form-row">
                            <label for="edit-description">Description:</label>
                            <textarea id="edit-description">${LowCodeUtils.escapeHtml(description)}</textarea>
                        </div>
                        <div class="form-row">
                            <label for="edit-namespace">Namespace:</label>
                            <input type="text" id="edit-namespace" value="${LowCodeUtils.escapeHtml(namespace)}" />
                        </div>
                        <div class="form-row">
                            <label for="edit-version">Version:</label>
                            <input type="text" id="edit-version" value="${LowCodeUtils.escapeHtml(version)}" />
                        </div>
                        <div class="form-row">
                            <label for="edit-license">License:</label>
                            <input type="text" id="edit-license" value="${LowCodeUtils.escapeHtml(license)}" />
                        </div>
                        <div class="form-row">
                            <label for="edit-author">Author:</label>
                            <input type="text" id="edit-author" value="${LowCodeUtils.escapeHtml(author)}" />
                        </div>
                        <div class="form-row">
                            <label for="edit-iconUrl">Icon URL:</label>
                            <input type="text" id="edit-iconUrl" value="${LowCodeUtils.escapeHtml(iconUrl)}" />
                        </div>
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
            
            .card-header-controls {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 15px;
                gap: 8px;
            }
            
            .preview-controls,
            .edit-controls {
                display: flex;
                gap: 8px;
            }
            
            .edit-metadata-btn,
            .save-metadata-btn,
            .cancel-metadata-btn {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 3px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s;
                margin-left: 8px;
            }
            
            .edit-metadata-btn:hover,
            .save-metadata-btn:hover,
            .cancel-metadata-btn:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            
            .save-metadata-btn:disabled,
            .cancel-metadata-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .save-metadata-btn:disabled:hover,
            .cancel-metadata-btn:disabled:hover {
                background-color: var(--vscode-button-background);
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
            
            .metadata-edit {
                background-color: var(--vscode-input-background);
                border: 1px solid var(--vscode-input-border);
                border-radius: 4px;
                padding: 16px;
            }
            
            .edit-form {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .form-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .form-row label {
                font-weight: bold;
                color: var(--vscode-editor-foreground);
                font-size: 12px;
            }
            
            .form-row input,
            .form-row textarea {
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
                border-radius: 3px;
                padding: 6px 8px;
                font-family: var(--vscode-font-family);
                font-size: 13px;
            }
            
            .form-row input:focus,
            .form-row textarea:focus {
                outline: none;
                border-color: var(--vscode-focusBorder);
            }
            
            .form-row textarea {
                min-height: 60px;
                resize: vertical;
            }
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // Metadata state management
            let originalMetadata = {};
            let isEditingMetadata = false;
            
            // Initialize metadata management
            function initializeMetadata() {
                const editBtn = document.querySelector('.edit-metadata-btn');
                const saveBtn = document.querySelector('.save-metadata-btn');
                const cancelBtn = document.querySelector('.cancel-metadata-btn');
                
                if (editBtn) {
                    editBtn.addEventListener('click', handleEditMetadata);
                }
                if (saveBtn) {
                    saveBtn.addEventListener('click', handleSaveMetadata);
                }
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', handleCancelMetadata);
                }
                
                // Store original metadata values
                storeOriginalMetadata();
            }
            
            function storeOriginalMetadata() {
                const fields = ['name', 'description', 'namespace', 'version', 'license', 'author', 'iconUrl'];
                fields.forEach(field => {
                    const input = document.getElementById('edit-' + field);
                    if (input) {
                        originalMetadata[field] = input.value;
                        console.log('Stored original ' + field + ':', input.value);
                    }
                });
                console.log('Original metadata stored:', originalMetadata);
            }
            
            function handleEditMetadata() {
                isEditingMetadata = true;
                
                // Show edit mode, hide preview mode
                const previewDiv = document.getElementById('metadata-preview');
                const editDiv = document.getElementById('metadata-edit');
                const previewControls = document.getElementById('preview-controls');
                const editControls = document.getElementById('edit-controls');
                
                if (previewDiv) previewDiv.style.display = 'none';
                if (editDiv) editDiv.style.display = 'block';
                if (previewControls) previewControls.style.display = 'none';
                if (editControls) editControls.style.display = 'flex';
                
                // Focus first input
                const firstInput = document.getElementById('edit-name');
                if (firstInput) {
                    firstInput.focus();
                    firstInput.select();
                }
            }
            
            function handleSaveMetadata() {
                // Collect form data
                const metadata = {};
                const fields = ['name', 'description', 'namespace', 'version', 'license', 'author', 'iconUrl'];
                
                // Include all fields, even if empty (so they can be cleared)
                fields.forEach(field => {
                    const input = document.getElementById('edit-' + field);
                    if (input) {
                        const value = input.value.trim();
                        // Include the field with its value (empty string if cleared)
                        metadata[field] = value;
                    }
                });
                
                console.log('Saving metadata:', metadata);
                
                // Send to extension with request to refresh webview
                if (typeof vscode !== 'undefined') {
                    vscode.postMessage({
                        type: 'updateMetadata',
                        metadata: metadata,
                        field: 'all', // Indicate this is a bulk update
                        refreshWebview: true // Request webview refresh after save
                    });
                } else {
                    console.warn('VSCode API not available');
                }
                
                // Show saving feedback immediately
                showSavingFeedback();
            }
            
            function handleCancelMetadata() {
                // Restore original values
                Object.keys(originalMetadata).forEach(field => {
                    const input = document.getElementById('edit-' + field);
                    if (input) {
                        input.value = originalMetadata[field] || '';
                    }
                });
                
                showPreviewMode();
            }
            
            function showPreviewMode() {
                isEditingMetadata = false;
                
                const previewDiv = document.getElementById('metadata-preview');
                const editDiv = document.getElementById('metadata-edit');
                const previewControls = document.getElementById('preview-controls');
                const editControls = document.getElementById('edit-controls');
                
                if (previewDiv) previewDiv.style.display = 'block';
                if (editDiv) editDiv.style.display = 'none';
                if (previewControls) previewControls.style.display = 'flex';
                if (editControls) editControls.style.display = 'none';
            }
            
            function updatePreviewFromForm(metadata) {
                // Update the preview elements with new values
                const nameEl = document.querySelector('.metadata-preview .agent-name');
                const descEl = document.querySelector('.metadata-preview .agent-description');
                
                if (nameEl && metadata.name) nameEl.textContent = metadata.name;
                if (descEl && metadata.description) descEl.textContent = metadata.description;
                
                // Update detail rows
                const detailRows = document.querySelectorAll('.agent-details-compact .detail-row');
                detailRows.forEach(row => {
                    const label = row.querySelector('.detail-label');
                    const value = row.querySelector('.detail-value');
                    
                    if (label && value) {
                        const labelText = label.textContent.toLowerCase().replace(':', '');
                        if (metadata[labelText]) {
                            value.textContent = metadata[labelText];
                        }
                    }
                });
                
                // Update icon if iconUrl changed
                if (metadata.iconUrl) {
                    const iconEl = document.getElementById('agentIcon');
                    if (iconEl) {
                        iconEl.style.backgroundImage = 'url(' + metadata.iconUrl + ')';
                        iconEl.style.backgroundSize = 'cover';
                        iconEl.textContent = '';
                    }
                }
                
                // Store as new original values
                originalMetadata = { ...metadata };
            }
            
            function showSavingFeedback() {
                const saveBtn = document.querySelector('.save-metadata-btn');
                if (saveBtn) {
                    saveBtn.textContent = '⏳ Saving...';
                    saveBtn.style.backgroundColor = 'var(--vscode-progressBar-background)';
                    saveBtn.disabled = true;
                    
                    // Disable cancel button as well during save
                    const cancelBtn = document.querySelector('.cancel-metadata-btn');
                    if (cancelBtn) {
                        cancelBtn.disabled = true;
                    }
                }
            }
            
            function showSaveSuccessFeedback() {
                const saveBtn = document.querySelector('.save-metadata-btn');
                if (saveBtn) {
                    const originalText = saveBtn.textContent;
                    saveBtn.textContent = '✅ Saved';
                    saveBtn.style.backgroundColor = 'var(--vscode-terminal-ansiGreen)';
                    
                    setTimeout(() => {
                        saveBtn.textContent = originalText;
                        saveBtn.style.backgroundColor = '';
                    }, 2000);
                }
            }
            
            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeMetadata);
            } else {
                initializeMetadata();
            }
        `;
    }
}