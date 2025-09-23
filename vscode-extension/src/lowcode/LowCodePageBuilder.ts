import { LowCodeConfig, TemplateContext, StyledComponent, ScriptedComponent } from './types';
import { LowCodeUtils } from './utils';
import { BaseStyles } from './styles/BaseStyles';
import { BaseScripts } from './scripts/BaseScripts';
import { HeaderComponent } from './components/HeaderComponent';
import { ContentPreviewComponent } from './components/ContentPreviewComponent';
import { AgentFormComponent } from './components/AgentFormComponent';

/**
 * Main page builder for LowCode mode
 */
export class LowCodePageBuilder {
    
    private components: (StyledComponent & Partial<ScriptedComponent>)[] = [];
    
    constructor() {
        // Register core components that are always present
        this.components = [
            new HeaderComponent(),
            new AgentFormComponent(),
            new ContentPreviewComponent()
        ];
    }
    
    /**
     * Build the complete HTML page
     */
    public buildPage(config: LowCodeConfig): string {
        const nonce = LowCodeUtils.generateNonce();
        const context = this.buildContext(config, nonce);
        
        return this.renderTemplate(context);
    }
    
    /**
     * Build the template context by combining all components
     */
    private buildContext(config: LowCodeConfig, nonce: string): TemplateContext {
        const title = `AFM Agent - ${config.readonly ? 'Preview Mode' : 'LowCode Mode'}`;
        const styles = this.collectStyles();
        const body = this.collectBody(config);
        const scripts = this.collectScripts(nonce, config.readonly);
        
        return {
            title,
            nonce,
            cspSource: config.webview.cspSource,
            styles,
            body,
            scripts
        };
    }
    
    /**
     * Collect all styles from components
     */
    private collectStyles(): string {
        const baseStyles = BaseStyles.getBaseStyles();
        const componentStyles = this.components
            .map(component => component.getStyles())
            .join('\n');
        
        return baseStyles + '\n' + componentStyles;
    }
    
    /**
     * Collect all body content from components
     */
    private collectBody(config: LowCodeConfig): string {
        return this.components
            .map(component => component.render(config))
            .join('\n');
    }
    
    /**
     * Collect all scripts from components
     */
    private collectScripts(nonce: string, readonly: boolean): string {
        const baseScripts = BaseScripts.getBaseScripts();
        
        // Only collect scripts from components if not readonly
        let componentScripts = '';
        if (!readonly) {
            componentScripts = this.components
                .filter(component => 'getScripts' in component && component.getScripts)
                .map(component => (component as ScriptedComponent).getScripts(nonce))
                .join('\n');
        }
        
        return baseScripts + '\n' + componentScripts;
    }
    
    /**
     * Render the final HTML template
     */
    private renderTemplate(context: TemplateContext): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${context.cspSource} 'unsafe-inline'; script-src 'nonce-${context.nonce}';">
            <title>${context.title}</title>
            <style>
                ${context.styles}
            </style>
        </head>
        <body>
            ${context.body}
            
            <script nonce="${context.nonce}">
                ${context.scripts}
            </script>
        </body>
        </html>`;
    }
}