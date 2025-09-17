# AFM VS Code Extension

A Visual Studio Code extension that provides rich editing support for Agent File Markdown (`.afm`) format files using a **Custom Text Editor** approach.

## ✨ **Features**

### 🎯 **Custom Text Editor Implementation**
- **File as single source of truth** - AFM file on disk is the authority
- **Automatic YAML stripping** - Shows only Markdown content for editing
- **Integrated metadata panel** - Side-by-side YAML metadata editing
- **Real-time synchronization** - Changes automatically merge back to file
- **No popups or prompts** - Seamless editing experience

### 🏗️ **Architecture**

#### **Custom Text Editor (`AfmCustomTextEditorProvider`)**
- Automatically opens for `.afm` files
- **Left panel**: Native Markdown editing (YAML frontmatter hidden)
- **Right panel**: Form-based metadata editing (name, description, version, etc.)
- **Automatic save/load**: Handles YAML parsing and serialization
- **Two-way sync**: Changes in either panel update the underlying file

## 🚀 **Installation & Usage**

1. **Setup:**
   ```bash
   cd vscode-extension
   ./setup.sh
   ```

2. **Development:**
   ```bash
   npm run watch    # Watch mode
   code .           # Open in VS Code
   # Press F5 to launch extension development host
   ```

3. **Testing:**
   - Open any `.afm` file in the development host
   - **Custom editor automatically opens** with:
     - Left side: Markdown content only
     - Right side: Metadata editing form
   - Edit either side and changes sync to the file

## 📁 **Clean Project Structure**

```
src/
├── extension.ts                        # Main activation logic
├── providers/
│   └── AfmCustomTextEditorProvider.ts  # Custom text editor implementation
└── utils/
    ├── types.ts                        # Type definitions
    └── parser.ts                       # AFM parsing utilities

syntaxes/
└── afm.tmLanguage.json                 # Language grammar

language-configuration.json             # Language configuration
package.json                            # Extension manifest
```

## 🎯 **Key Benefits**

✅ **Simple & Clean**: No complex virtual documents or syncing  
✅ **File-based**: Single source of truth approach  
✅ **Native Experience**: Real text editing with form-based metadata  
✅ **Automatic**: No user intervention needed  
✅ **Integrated**: Side-by-side editing interface  

## 🔧 **How It Works**

1. **Opening AFM file**: Custom editor automatically replaces default text editor
2. **Loading**: AFM file is parsed, YAML extracted, Markdown shown in left panel
3. **Editing**: Both panels allow editing with real-time synchronization
4. **Saving**: YAML metadata + Markdown content automatically merged back to file

## � **Development Commands**

- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch mode for development  
- `npm run lint` - Run ESLint
- `npm run package` - Package the extension

## 🎪 **Usage Example**

When you open `sample.afm`:
- **Before**: See YAML frontmatter + Markdown content
- **With Extension**: 
  - Left panel shows only Markdown content for clean editing
  - Right panel shows form fields for metadata (name, description, version, etc.)
  - Changes in either panel automatically save to the `.afm` file

This implementation perfectly realizes the "file as single source of truth" approach with automatic YAML handling!
