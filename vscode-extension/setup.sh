#!/bin/bash

# AFM VS Code Extension Setup Script

echo "🚀 Setting up AFM VS Code Extension..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the vscode-extension directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
npm run compile

# Run linter
echo "🧹 Running linter..."
npm run lint

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Open VS Code"
echo "2. Press F5 to launch the extension development host"
echo "3. Open a .afm file to test the extension"
echo "4. Check the AFM side panel in the activity bar"
echo ""
echo "📝 To test with the sample file:"
echo "   code sample.afm"
echo ""
echo "🔧 Development commands:"
echo "   npm run watch    - Watch mode for development"
echo "   npm run package  - Package the extension"
echo "   npm run publish  - Publish to marketplace"
