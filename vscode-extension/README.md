# AFM Extension for VS Code

A comprehensive VS Code extension for editing Agent File Markdown (.afm) files with multiple viewing modes and intelligent file handling.

## ✨ Features

- **�️ Three Viewing Modes**: Choose how you want to edit AFM files
  - **LowCode Mode**: Form-based visual editor (default)
  - **Split View**: Text editor + visual editor side-by-side
  - **Source Mode**: Standard text editor only

- **🎯 Smart File Opening**: AFM files automatically open in your preferred mode
- **📁 Agent Explorer**: Dedicated sidebar to browse all agents in your workspace
- **✏️ Live Editing**: All modes stay synchronized - edit in any view
- **⚙️ User Settings**: Configure your preferred default view mode
- **🏷️ Format Support**: Both `.afm` and `.afm.md` file formats

## 🚀 Quick Start

1. **Install the extension**:
   ```bash
   ./install.sh
   ```

2. **Open any AFM file** - it opens in LowCode Mode by default

3. **Change your preferred mode** in VS Code settings:
   - Go to Settings → Extensions → AFM Agent
   - Set "Default View" to: `webview`, `split`, or `source`

4. **Use the Agent Explorer**:
   - Click the AFM icon in the Activity Bar
   - Browse all agents in your workspace

## 📖 How to Use

### LowCode Mode (Visual Editor)
- Click on any metadata field to edit
- Changes auto-save after 1 second
- Clean card-based interface
- Perfect for quick metadata updates

### Split View Mode
- Left: Native text editor for raw editing
- Right: Visual editor for metadata
- Both sides stay synchronized
- Best for detailed editing

### Source Mode
- Standard VS Code markdown editor
- Full syntax highlighting
- Traditional editing experience

### Available Commands
- `AFM: Open in Agent Web View` - Open in visual mode
- `AFM: Open in Source Mode` - Open in text editor
- `AFM: Open with Split View` - Open in split mode
- `AFM: Toggle Agent View` - Toggle split view

## ⚙️ Settings

Configure the extension in VS Code settings:

- **AFM Agent > Default View**: Choose `webview`, `split`, or `source`
  - `webview`: Opens AFM files in visual editor
  - `split`: Opens in split view (text + visual)
  - `source`: Opens in standard text editor

## 🐛 Troubleshooting

### Files Don't Open in Preferred Mode

**Solution**: Check your settings:
1. Go to Settings → Extensions → AFM Agent
2. Verify "Default View" is set correctly
3. Restart VS Code if needed

### Visual Editor Doesn't Load

**Solutions**:
1. Run command: `AFM: Open in Agent Web View`
2. Check file extension is `.afm` or `.afm.md`
3. Reload window: `Cmd+Shift+P` → "Developer: Reload Window"

### Settings Change Doesn't Work

**Solution**: 
1. Close all AFM file tabs
2. Reopen the AFM file to see the new default mode
3. Or use the specific commands to force a particular mode

## 📋 File Format Support

### Pure AFM Files (`.afm`)
```markdown
# Agent Name

Agent instructions and content...
```

### AFM with Frontmatter (`.afm.md`)
```yaml
---
name: "My Agent"
description: "A helpful agent"
version: "1.0.0"
namespace: "default"
---

# Agent Instructions

Agent content...
```

## 🔧 Development Status

✅ **Fully Implemented**
- All three viewing modes working
- Smart file opening with user preferences  
- Agent Explorer in Activity Bar
- Live synchronization between all views
- Auto-save functionality
- Proper error handling
