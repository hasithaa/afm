# AFM Try-it React App

This is a React-based web application for creating and editing Agent Flavored Markdown (AFM) files. The application has been converted from a vanilla JavaScript implementation to a modern React app with ES build using Vite.

## ✅ Recent Updates

**Fixed Key Features:**
- ✅ **Metadata Tabs**: All metadata form tabs (Basic Information, Authors & Provider, Connections, Additional Details) are now fully functional
- ✅ **Form State Management**: Proper React state management for all form fields
- ✅ **Hub & Spoke Mode**: Low-code view placeholder implemented (visual editor coming soon)
- ✅ **Default Templates**: New AFM files start with helpful template content
- ✅ **Improved Styling**: Better responsive design and visual improvements
- ✅ **Debug Console**: Working debug functionality for development

## Features

- **Create New AFM Files**: Start from scratch with a helpful template
- **Upload Existing AFM Files**: Drag and drop or browse to upload .afm files
- **Rich Markdown Editor**: Powered by EasyMDE with live preview
- **Metadata Forms**: Complete form interface for all AFM metadata
- **Editor Modes**: Pro Code (markdown) and Hub & Spoke (visual placeholder)
- **Local Storage**: Save and manage AFM files in browser storage
- **Export/Download**: Download your AFM files as .afm files
- **Responsive Design**: Modern, responsive UI with Bootstrap
- **Debug Console**: Development debugging tools

## Getting Started

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:8080` (or the next available port)

3. Open your browser and navigate to the local URL shown in the terminal

### Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

### Serving the Production Build

To serve the production build:
```bash
npm run serve
```

This will serve the built files on port 8080.

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.jsx       # App header with navigation
│   ├── HomePage.jsx     # Home page with create/upload options
│   ├── EditorPage.jsx   # Main editor with EasyMDE
│   ├── PreviewPage.jsx  # Preview and export functionality
│   └── DebugConsole.jsx # Debug console component
├── utils/               # Utility functions
│   ├── debug.js         # Debug logging utilities
│   └── storage.js       # Local storage management
├── App.jsx              # Main App component with routing
├── App.css              # App-specific styles
├── index.css            # Global styles
└── main.jsx             # App entry point
```

## Technology Stack

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and development server
- **Bootstrap 5** - CSS framework
- **Bootstrap Icons** - Icon library
- **EasyMDE** - Markdown editor
- **Marked** - Markdown parser
- **js-yaml** - YAML parser for metadata

## Key Features

### Editor Modes
- **Pro Code**: Direct markdown editing with EasyMDE
- **Hub & Spoke**: Visual editor (placeholder for future implementation)

### File Management
- Local browser storage for saving drafts
- Import/export AFM files
- File upload via drag-and-drop

### Preview & Export
- Live markdown preview
- Full-page preview mode
- Download as .afm files

## Development Notes

- The app uses ES modules and modern JavaScript features
- State management is handled with React hooks
- Local storage is used for persistence
- Debug console available in development mode

## Future Enhancements

- Docker containerization
- Hub & Spoke visual editor implementation
- Cloud storage integration
- Collaboration features
- Agent deployment capabilities

## Migration from Vanilla JS

This React version maintains all the core functionality of the original vanilla JavaScript application while providing:

- Better code organization and maintainability
- Modern development tooling with Vite
- Component-based architecture
- Type-safe development (ready for TypeScript)
- Improved build optimization
- Hot module replacement in development
