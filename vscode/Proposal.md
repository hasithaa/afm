# AFM Extension for VS Code - Current Implementation

This document describes the current implementation of the AFM (Agent File Markdown) VS Code extension.

## Overview

The AFM extension provides an intuitive interface for editing `.afm` and `.afm.md` files with three distinct viewing modes and automatic file detection.

## Current Features

### Three Viewing Modes

1. **LowCode Mode** (Default)
   - Form-based interface for editing agent metadata
   - Visual agent profile with editable fields
   - Auto-save functionality
   - Clean, card-based layout

2. **Split View Mode**
   - Left side: Native VS Code text editor
   - Right side: LowCode Mode interface
   - Both sides stay synchronized
   - Best of both worlds - raw editing + visual interface

3. **Source Mode**
   - Standard VS Code text editor
   - Full markdown and YAML syntax highlighting
   - Native editing experience

### Smart File Opening

- **Explorer Integration**: Clicking AFM files in Explorer opens in your preferred mode
- **User Settings**: Configure default view in VS Code settings (`AFM Agent > Default View`)
- **Automatic Detection**: Extension automatically handles `.afm` and `.afm.md` files

### Agent Explorer (Activity Bar)

- Dedicated AFM icon in Activity Bar
- Lists all agents in workspace
- Organized by namespace
- Quick access to any agent file

## User Experience

### Opening AFM Files
When you click on an AFM file in the file explorer, it opens in your configured default mode:
- **webview**: Opens directly in LowCode Mode
- **split**: Opens in Split View (text editor + LowCode Mode)
- **source**: Opens in standard text editor

### Editing Workflow
1. **Metadata editing**: Use LowCode Mode for quick form-based editing
2. **Content editing**: Use text editor for markdown content
3. **Advanced editing**: Use Split View to see both views simultaneously

### Commands Available
- `AFM: Open in Agent Web View` - Force open in LowCode Mode
- `AFM: Open in Source Mode` - Force open in text editor
- `AFM: Open with Split View` - Force open in Split View
- `AFM: Toggle Agent View` - Toggle split view on/off

## Technical Implementation

### Architecture
- **WebviewProvider**: Handles LowCode Mode interface
- **SplitViewProvider**: Manages split view layout
- **Document Events**: Keeps all views synchronized
- **Configuration**: User preferences for default behavior

### File Format Support
- **Pure AFM** (`.afm`): Markdown with inline metadata
- **AFM with Frontmatter** (`.afm.md`): YAML frontmatter + markdown content

### Metadata Schema
Supports all standard AFM metadata fields:
- `name`, `description`, `version`
- `namespace`, `author`, `authors`
- `provider`, `iconUrl`, `license`

## Current Status: ✅ Fully Implemented

All core features are working:
- ✅ Three viewing modes implemented
- ✅ Smart file opening with user preferences
- ✅ Agent Explorer in Activity Bar
- ✅ Synchronized editing across all modes
- ✅ Auto-save and file watching
- ✅ Proper error handling and navigation