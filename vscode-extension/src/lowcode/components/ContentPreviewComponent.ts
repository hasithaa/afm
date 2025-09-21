import { LowCodeComponent, LowCodeConfig, StyledComponent } from '../types';
import { LowCodeUtils } from '../utils';

/**
 * Content preview component showing markdown content
 */
export class ContentPreviewComponent implements StyledComponent {
    
    public render(config: LowCodeConfig): string {
        const { document } = config;
        const content = document.content;
        
        let previewContent: string;
        if (content) {
            const truncated = content.substring(0, 500);
            const displayContent = truncated + (content.length > 500 ? '...' : '');
            previewContent = LowCodeUtils.escapeHtml(displayContent);
        } else {
            previewContent = '<div class="empty-state">No content available</div>';
        }
        
        return `
            <div class="section">
                <div class="section-title">📄 Content Preview</div>
                <div class="content-preview">${previewContent}</div>
            </div>
        `;
    }

    public getStyles(): string {
        return `
            .content-preview {
                background: var(--vscode-textCodeBlock-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 16px;
                max-height: 200px;
                overflow-y: auto;
                font-family: var(--vscode-editor-font-family);
                font-size: 12px;
                line-height: 1.5;
                white-space: pre-wrap;
                color: var(--vscode-textPreformat-foreground);
            }
        `;
    }
}