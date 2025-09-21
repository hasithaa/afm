import * as vscode from 'vscode';
import { AfmDocument } from '../utils/types';

/**
 * Configuration for the LowCode component system
 */
export interface LowCodeConfig {
    readonly: boolean;
    webview: vscode.Webview;
    document: AfmDocument;
    uri: vscode.Uri;
}

/**
 * Base interface for all LowCode components
 */
export interface LowCodeComponent {
    render(config: LowCodeConfig): string;
}

/**
 * Component that can handle styles
 */
export interface StyledComponent extends LowCodeComponent {
    getStyles(): string;
}

/**
 * Component that can handle scripts
 */
export interface ScriptedComponent extends LowCodeComponent {
    getScripts(nonce: string): string;
}

/**
 * HTML template context
 */
export interface TemplateContext {
    title: string;
    nonce: string;
    cspSource: string;
    styles: string;
    body: string;
    scripts: string;
}