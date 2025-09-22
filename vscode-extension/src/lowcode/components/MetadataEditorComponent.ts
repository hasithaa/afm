import { LowCodeComponent, LowCodeConfig, StyledComponent, ScriptedComponent } from '../types';
import { LowCodeUtils } from '../utils';

/**
 * Metadata editor component - now integrated into AgentCardComponent
 * This component is kept for potential future advanced editing features
 */
export class MetadataEditorComponent implements StyledComponent, ScriptedComponent {
    
    public render(config: LowCodeConfig): string {
        // The main editing is now handled by AgentCardComponent
        // This can be used for advanced metadata features in the future
        return '';
    }

    public getStyles(): string {
        return `
            /* Styles moved to AgentCardComponent */
        `;
    }

    public getScripts(nonce: string): string {
        return `
            // Main editing functionality moved to AgentCardComponent
            // This can be used for advanced features
        `;
    }
}