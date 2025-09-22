import { parse as yamlParse, stringify as yamlStringify } from 'yaml';
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

    static parseAfmDocument(content: string): { metadata: AfmDocument['metadata']; content: string } {
        try {
            console.log('AfmParser.parseAfmDocument: Starting parse of content:', content.substring(0, 200) + '...');
            
            if (content.startsWith('---')) {
                const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
                if (frontMatterMatch) {
                    const yamlContent = frontMatterMatch[1];
                    const markdownContent = frontMatterMatch[2];
                    console.log('AfmParser.parseAfmDocument: Found YAML content:', yamlContent);
                    
                    const metadata = yamlParse(yamlContent) as AfmDocument['metadata'];
                    console.log('AfmParser.parseAfmDocument: Parsed metadata:', JSON.stringify(metadata, null, 2));
                    
                    return { metadata: metadata || {}, content: markdownContent };
                }
            }
            
            // No front matter found
            console.log('AfmParser.parseAfmDocument: No front matter found, returning empty metadata');
            return { metadata: {}, content: content };
        } catch (error) {
            console.error('Error parsing AFM document:', error);
            return { metadata: {}, content: content };
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

        // Filter out empty string values for cleaner YAML
        const filteredMetadata: Partial<AfmMetadata> = {};
        (Object.keys(document.metadata) as (keyof AfmMetadata)[]).forEach(key => {
            const value = document.metadata[key];
            if (value !== null && value !== undefined && value !== '') {
                (filteredMetadata as any)[key] = value;
            }
        });

        // If no non-empty metadata, return just content
        if (Object.keys(filteredMetadata).length === 0) {
            return document.content;
        }

        const yamlContent = yamlStringify(filteredMetadata);
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
