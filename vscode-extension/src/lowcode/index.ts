import * as vscode from 'vscode';
import { AfmDocument } from '../utils/types';
import { LowCodePageBuilder } from './LowCodePageBuilder';
import { LowCodeConfig } from './types';

/**
 * Main entry point for LowCode HTML generation
 * This replaces the old monolithic AfmLowCodeHtmlGenerator
 */
export class LowCodeHtmlGenerator {
    
    private static pageBuilder = new LowCodePageBuilder();
    
    /**
     * Generate HTML for LowCode mode
     */
    public static generateHtml(
        webview: vscode.Webview, 
        afmDoc: AfmDocument, 
        uri: vscode.Uri, 
        readonly: boolean = false
    ): string {
        const config: LowCodeConfig = {
            readonly,
            webview,
            document: afmDoc,
            uri
        };
        
        return this.pageBuilder.buildPage(config);
    }
}

// Export the main generator for backward compatibility
export { LowCodeHtmlGenerator as AfmLowCodeHtmlGenerator };