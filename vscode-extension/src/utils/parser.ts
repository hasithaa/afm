import * as yaml from 'yaml';
import { AfmDocument, AfmMetadata } from './types';

export class AfmParser {
    public static parseAfmDocument(content: string): AfmDocument {
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

    public static serializeAfmDocument(document: AfmDocument): string {
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
