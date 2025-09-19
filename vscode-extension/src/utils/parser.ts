import * as yaml from 'yaml';
import { AfmDocument, AfmMetadata } from './types';

// Re-export types for convenience
export { AfmDocument, AfmMetadata } from './types';

export class AfmParser {
    public static isAfmFile(filePath: string): boolean {
        return filePath.endsWith('.afm') || filePath.endsWith('.afm.md');
    }

    public static getAfmFileType(filePath: string): 'afm' | 'afm.md' | 'unknown' {
        if (filePath.endsWith('.afm.md')) {
            return 'afm.md';
        } else if (filePath.endsWith('.afm')) {
            return 'afm';
        }
        return 'unknown';
    }

    public static parseAfmDocument(content: string, filePath?: string): AfmDocument {
        const fileType = filePath ? this.getAfmFileType(filePath) : 'afm.md'; // Default to .afm.md behavior
        
        if (fileType === 'afm') {
            // .afm files are pure markdown, metadata comes from external source or default
            return {
                metadata: {},
                content: content
            };
        }
        
        // .afm.md files have YAML frontmatter
        const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (!yamlMatch) {
            return {
                metadata: {},
                content: content
            };
        }

        try {
            const metadata = yaml.parse(yamlMatch[1]) as AfmMetadata;
            const markdownContent = yamlMatch[2];
            
            return {
                metadata,
                content: markdownContent
            };
        } catch (error) {
            console.error('Error parsing YAML frontmatter:', error);
            return {
                metadata: {},
                content: content
            };
        }
    }

    public static serializeAfmDocument(document: AfmDocument, filePath?: string): string {
        const fileType = filePath ? this.getAfmFileType(filePath) : 'afm.md';
        
        if (fileType === 'afm') {
            // .afm files are pure markdown
            return document.content;
        }
        
        // .afm.md files include YAML frontmatter
        if (!document.metadata || Object.keys(document.metadata).length === 0) {
            return document.content;
        }

        const yamlContent = yaml.stringify(document.metadata);
        return `---\n${yamlContent}---\n${document.content}`;
    }

    public static extractMarkdownContent(content: string): string {
        const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        return yamlMatch ? yamlMatch[2] : content;
    }

    public static hasYamlFrontmatter(content: string): boolean {
        return /^---\n[\s\S]*?\n---/.test(content);
    }

    public static replaceMarkdownContent(originalContent: string, newMarkdownContent: string): string {
        const yamlMatch = originalContent.match(/^(---\n[\s\S]*?\n---\n)/);
        
        if (yamlMatch) {
            return yamlMatch[1] + newMarkdownContent;
        }
        
        // No YAML frontmatter, just return the new markdown content
        return newMarkdownContent;
    }
}
