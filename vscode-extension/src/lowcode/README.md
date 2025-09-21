# LowCode Component System

This directory contains the refactored LowCode UI system for the AFM extension. The code has been broken down into manageable, component-based modules for better maintainability and extensibility.

## Architecture

### Core Files
- **`index.ts`** - Main entry point, exports `LowCodeHtmlGenerator`
- **`LowCodePageBuilder.ts`** - Main page builder that combines all components
- **`types.ts`** - TypeScript interfaces and types
- **`utils.ts`** - Utility functions (nonce generation, HTML escaping, etc.)

### Components (`components/`)
Each component is responsible for a specific part of the UI:

- **`HeaderComponent.ts`** - Title bar with mode indicator and action buttons
- **`AgentCardComponent.ts`** - Agent metadata overview card
- **`MetadataEditorComponent.ts`** - Form for editing agent metadata
- **`ContentPreviewComponent.ts`** - Preview of agent content/instructions
- **`InstructionsEditorComponent.ts`** - Placeholder for future rich editor

### Styles (`styles/`)
- **`BaseStyles.ts`** - Shared base styles for all components

### Scripts (`scripts/`)
- **`BaseScripts.ts`** - Shared JavaScript functionality

## How It Works

1. **Component Interface**: All components implement `LowCodeComponent` interface
2. **Styled Components**: Components that need CSS implement `StyledComponent`
3. **Scripted Components**: Components that need JavaScript implement `ScriptedComponent`
4. **Page Builder**: Combines all components into a complete HTML page
5. **Configuration**: Each component receives a `LowCodeConfig` with context

## Adding New Components

1. Create a new component file in `components/`
2. Implement required interfaces (`LowCodeComponent`, optionally `StyledComponent`/`ScriptedComponent`)
3. Add to `components/index.ts`
4. Register in `LowCodePageBuilder.ts` constructor
5. Compile and test

## Benefits of This Architecture

✅ **Modular**: Each component is self-contained
✅ **Extensible**: Easy to add new components
✅ **Maintainable**: Clear separation of concerns
✅ **Reusable**: Components can be reused in different contexts
✅ **Type-Safe**: Full TypeScript support
✅ **Testable**: Each component can be tested independently

## Migration

The old monolithic `AfmLowCodeHtmlGenerator` has been replaced with this new system while maintaining the same external API for backward compatibility.