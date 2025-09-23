import * as vscode from 'vscode';

/**
 * Utility functions for LowCode components
 */
export class LowCodeUtils {
    
    /**
     * Generate a random nonce for CSP
     */
    public static generateNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Escape HTML characters to prevent XSS and template literal issues
     */
    public static escapeHtml(text: string): string {
        if (!text) return '';
        // Convert non-string values to string safely
        if (typeof text !== 'string') {
            try {
                text = String(text);
            } catch (error) {
                console.warn('Failed to convert value to string:', error);
                return '';
            }
        }
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Safely escape JSON for use in JavaScript template literals
     */
    public static escapeJson(obj: any): string {
        if (obj === null || obj === undefined) return '';
        try {
            const jsonString = JSON.stringify(obj);
            // Don't display empty objects
            if (jsonString === '{}' || jsonString === '[]') return '';
            return this.escapeHtml(jsonString);
        } catch (error) {
            console.warn('Failed to stringify object for escaping:', error);
            return '';
        }
    }

    /**
     * Get agent name from URI
     */
    public static getAgentName(uri: vscode.Uri): string {
        const fileName = uri.path.split('/').pop() || '';
        return fileName.replace(/\.(afm\.md|afm)$/, '');
    }

    /**
     * Get readonly attributes for form inputs
     */
    public static getReadonlyAttributes(readonly: boolean): { readonlyAttr: string; disabledAttr: string } {
        return {
            readonlyAttr: readonly ? 'readonly' : '',
            disabledAttr: readonly ? 'disabled' : ''
        };
    }
}