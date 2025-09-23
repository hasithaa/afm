import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { LowCodeUtils } from '../utils';
import { AfmParser } from '../../utils/parser';

/**
 * Content preview component showing markdown content with edit functionality
 */
export class ContentPreviewComponent implements StyledComponent, ScriptedComponent {
    
    public render(config: LowCodeConfig): string {
        const { document, readonly } = config;
        // Extract only the markdown content, without YAML frontmatter
        const markdownContent = document.content ? AfmParser.extractMarkdownContent(document.content) : '';
        
        return `
            <div class="section">
                <div class="section-header">
                    <div class="section-title">📄 Content Preview</div>
                    ${!readonly ? `
                    <div class="content-controls">
                        <button class="edit-content-btn" data-editing="false" title="Edit Content">✏️ Edit</button>
                    </div>
                    ` : ''}
                </div>
                
                <!-- Markdown Preview Mode -->
                <div id="content-preview-container" class="content-preview-container">
                    <div id="markdown-preview" class="markdown-preview"></div>
                </div>
                
                <div id="content-edit-container" class="content-edit-container" style="display: none;">
                    <textarea 
                        id="content-editor" 
                        class="content-editor" 
                        placeholder="Enter your agent's markdown content here...">${LowCodeUtils.escapeHtml(markdownContent)}</textarea>
                    <div class="editor-controls">
                        <button class="save-content-btn" title="Save Content">💾 Save</button>
                        <button class="cancel-edit-btn" title="Cancel Edit">❌ Cancel</button>
                    </div>
                </div>
                
                <!-- Hidden fields to store full content for YAML frontmatter preservation -->
                <input type="hidden" id="full-document-content" value="${LowCodeUtils.escapeHtml(document.content || '')}">
            </div>
        `;
    }

    public getStyles(): string {
        return `
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .content-controls {
                display: flex;
                gap: 8px;
            }
            
            .edit-content-btn,
            .save-content-btn,
            .cancel-edit-btn {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 3px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 0.85em;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .edit-content-btn:hover,
            .save-content-btn:hover,
            .cancel-edit-btn:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            
            .save-content-btn:disabled,
            .cancel-edit-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .save-content-btn:disabled:hover,
            .cancel-edit-btn:disabled:hover {
                background-color: var(--vscode-terminal-ansiGreen, #4caf50);
            }
            
            .cancel-edit-btn:disabled:hover {
                background-color: var(--vscode-editorError-foreground, #f44336);
            }
            
            .save-content-btn {
                background-color: var(--vscode-terminal-ansiGreen, #4caf50);
            }
            
            .cancel-edit-btn {
                background-color: var(--vscode-editorError-foreground, #f44336);
            }
            
            .content-preview-container {
                background: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .markdown-preview {
                padding: 16px;
                font-family: var(--vscode-editor-font-family);
                font-size: 14px;
                line-height: 1.6;
                color: var(--vscode-editor-foreground);
            }
            
            .markdown-preview h1,
            .markdown-preview h2,
            .markdown-preview h3,
            .markdown-preview h4,
            .markdown-preview h5,
            .markdown-preview h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-weight: bold;
                color: var(--vscode-editor-foreground);
            }
            
            .markdown-preview h1 {
                font-size: 2em;
                border-bottom: 2px solid var(--vscode-panel-border);
                padding-bottom: 0.3em;
            }
            
            .markdown-preview h2 {
                font-size: 1.5em;
                border-bottom: 1px solid var(--vscode-panel-border);
                padding-bottom: 0.3em;
            }
            
            .markdown-preview p {
                margin-bottom: 1em;
            }
            
            .markdown-preview code {
                background: var(--vscode-textCodeBlock-background);
                color: var(--vscode-textPreformat-foreground);
                padding: 2px 4px;
                border-radius: 3px;
                font-family: var(--vscode-editor-font-family);
                font-size: 0.9em;
            }
            
            .markdown-preview pre {
                background: var(--vscode-textCodeBlock-background);
                color: var(--vscode-textPreformat-foreground);
                padding: 12px;
                border-radius: 4px;
                overflow-x: auto;
                margin: 1em 0;
                border: 1px solid var(--vscode-panel-border);
            }
            
            .markdown-preview pre code {
                background: none;
                padding: 0;
            }
            
            .markdown-preview blockquote {
                border-left: 4px solid var(--vscode-panel-border);
                margin: 0;
                padding-left: 1em;
                color: var(--vscode-descriptionForeground);
                font-style: italic;
            }
            
            .markdown-preview ul,
            .markdown-preview ol {
                padding-left: 2em;
                margin-bottom: 1em;
            }
            
            .markdown-preview li {
                margin-bottom: 0.25em;
            }
            
            .markdown-preview a {
                color: var(--vscode-textLink-foreground);
                text-decoration: none;
            }
            
            .markdown-preview a:hover {
                text-decoration: underline;
            }
            
            .empty-state {
                text-align: center;
                color: var(--vscode-descriptionForeground);
                font-style: italic;
                padding: 2em;
            }
            
            .content-edit-container {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                background: var(--vscode-editor-background);
            }
            
            .content-editor {
                width: 100%;
                min-height: 300px;
                max-height: 400px;
                padding: 16px;
                border: none;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                font-family: var(--vscode-editor-font-family);
                font-size: 14px;
                line-height: 1.5;
                resize: vertical;
                outline: none;
            }
            
            .editor-controls {
                display: flex;
                gap: 8px;
                padding: 12px 16px;
                border-top: 1px solid var(--vscode-panel-border);
                background: var(--vscode-editorWidget-background);
            }
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // Simple markdown parser for basic rendering
            function parseMarkdown(text) {
                if (!text || text.trim() === '') {
                    return '<div class="empty-state">No content available</div>';
                }
                
                // Basic markdown parsing
                let html = text
                    // Code blocks (must be before inline code)
                    .replace(/\\\`\\\`\\\`([\\s\\S]*?)\\\`\\\`\\\`/gim, '<pre><code>$1</code></pre>')
                    // Headers (largest to smallest)
                    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                    // Bold
                    .replace(/\\*\\*(.*?)\\*\\*/gim, '<strong>$1</strong>')
                    // Italic
                    .replace(/\\*(.*?)\\*/gim, '<em>$1</em>')
                    // Inline code
                    .replace(/\\\`(.*?)\\\`/gim, '<code>$1</code>')
                    // Links
                    .replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/gim, '<a href="$2">$1</a>')
                    // Blockquotes
                    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                    // Unordered lists
                    .replace(/^[\\*\\-\\+] (.*$)/gim, '<li>$1</li>')
                    // Ordered lists
                    .replace(/^\\d+\\. (.*$)/gim, '<li>$1</li>')
                    // Line breaks
                    .replace(/\\n\\n/gim, '</p><p>')
                    .replace(/\\n/gim, '<br>');
                
                // Wrap lists
                html = html.replace(/(<li>.*<\\/li>)/gims, '<ul>$1</ul>');
                
                // Wrap in paragraphs if not already wrapped
                if (!html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>') && !html.includes('<ul>') && !html.includes('<pre>')) {
                    html = '<p>' + html + '</p>';
                }
                
                return html;
            }
            
            // Simple YAML frontmatter and markdown extraction
            function extractMarkdownContent(fullContent) {
                if (!fullContent) return '';
                
                const yamlMatch = fullContent.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/);
                return yamlMatch ? yamlMatch[2] : fullContent;
            }
            
            function replaceMarkdownContent(originalContent, newMarkdownContent) {
                if (!originalContent) return newMarkdownContent;
                
                const yamlMatch = originalContent.match(/^(---\\n[\\s\\S]*?\\n---\\n)/);
                
                if (yamlMatch) {
                    return yamlMatch[1] + newMarkdownContent;
                }
                
                // No YAML frontmatter, just return the new markdown content
                return newMarkdownContent;
            }
            
            // Content management
            let currentMarkdownContent = '';
            let fullDocumentContent = '';
            let isEditing = false;
            
            // Initialize content preview
            function initializeContentPreview() {
                const editBtn = document.querySelector('.edit-content-btn');
                const saveBtn = document.querySelector('.save-content-btn');
                const cancelBtn = document.querySelector('.cancel-edit-btn');
                const markdownPreview = document.getElementById('markdown-preview');
                const contentEditor = document.getElementById('content-editor');
                const fullContentInput = document.getElementById('full-document-content');
                
                if (!markdownPreview || !contentEditor) {
                    console.warn('Content preview elements not found');
                    return;
                }
                
                // Get initial content
                fullDocumentContent = fullContentInput ? fullContentInput.value : '';
                currentMarkdownContent = extractMarkdownContent(fullDocumentContent) || contentEditor.value || '';
                
                // Set the editor to show only markdown content (without YAML frontmatter)
                contentEditor.value = currentMarkdownContent;
                
                // Render initial markdown
                updateMarkdownPreview();
                
                // Attach event listeners
                if (editBtn) {
                    editBtn.addEventListener('click', handleEditClick);
                }
                if (saveBtn) {
                    saveBtn.addEventListener('click', handleSaveClick);
                }
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', handleCancelClick);
                }
            }
            
            function updateMarkdownPreview() {
                const markdownPreview = document.getElementById('markdown-preview');
                if (markdownPreview) {
                    markdownPreview.innerHTML = parseMarkdown(currentMarkdownContent);
                }
            }
            
            function handleEditClick() {
                isEditing = true;
                const contentEditor = document.getElementById('content-editor');
                
                // Set editor content to markdown only (without YAML frontmatter)
                if (contentEditor) {
                    contentEditor.value = currentMarkdownContent;
                }
                
                showEditMode();
            }
            
            function handleSaveClick() {
                const contentEditor = document.getElementById('content-editor');
                if (!contentEditor) return;
                
                const newMarkdownContent = contentEditor.value;
                
                // Reconstruct full document with YAML frontmatter + new markdown content
                const newFullContent = replaceMarkdownContent(fullDocumentContent, newMarkdownContent);
                
                // Update our state
                currentMarkdownContent = newMarkdownContent;
                fullDocumentContent = newFullContent;
                
                // Send content update to extension with request to refresh webview
                if (typeof window.vscode !== 'undefined') {
                    console.log('Sending updateContent message with content:', newFullContent);
                    window.vscode.postMessage({
                        type: 'updateContent',
                        content: newFullContent,
                        refreshWebview: true // Request webview refresh after save
                    });
                } else if (typeof vscode !== 'undefined') {
                    console.log('Using global vscode API');
                    vscode.postMessage({
                        type: 'updateContent',
                        content: newFullContent,
                        refreshWebview: true // Request webview refresh after save
                    });
                } else {
                    console.warn('VSCode API not available');
                }
                
                // Show saving feedback immediately
                showSavingFeedback();
            }
            
            function handleCancelClick() {
                const contentEditor = document.getElementById('content-editor');
                if (contentEditor) {
                    // Restore original markdown content (without YAML frontmatter)
                    contentEditor.value = currentMarkdownContent;
                }
                
                showPreviewMode();
                isEditing = false;
            }
            
            function showEditMode() {
                const previewContainer = document.getElementById('content-preview-container');
                const editContainer = document.getElementById('content-edit-container');
                const editBtn = document.querySelector('.edit-content-btn');
                
                if (previewContainer) previewContainer.style.display = 'none';
                if (editContainer) editContainer.style.display = 'block';
                if (editBtn) {
                    editBtn.textContent = '👁️ Preview';
                    editBtn.setAttribute('data-editing', 'true');
                }
                
                // Focus the editor
                const contentEditor = document.getElementById('content-editor');
                if (contentEditor) {
                    contentEditor.focus();
                }
            }
            
            function showPreviewMode() {
                const previewContainer = document.getElementById('content-preview-container');
                const editContainer = document.getElementById('content-edit-container');
                const editBtn = document.querySelector('.edit-content-btn');
                
                if (previewContainer) previewContainer.style.display = 'block';
                if (editContainer) editContainer.style.display = 'none';
                if (editBtn) {
                    editBtn.textContent = '✏️ Edit';
                    editBtn.setAttribute('data-editing', 'false');
                }
            }
            
            function showSavingFeedback() {
                const saveBtn = document.querySelector('.save-content-btn');
                const cancelBtn = document.querySelector('.cancel-edit-btn');
                
                if (saveBtn) {
                    saveBtn.textContent = '⏳ Saving...';
                    saveBtn.style.backgroundColor = 'var(--vscode-progressBar-background)';
                    saveBtn.disabled = true;
                }
                
                if (cancelBtn) {
                    cancelBtn.disabled = true;
                }
            }
            
            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeContentPreview);
            } else {
                initializeContentPreview();
            }
        `;
    }
}