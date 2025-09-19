#!/bin/bash

# AFM Extension Installation Script

echo "🔧 Installing AFM Extension for VS Code..."

# Compile the extension
echo "📦 Compiling extension..."
npm run compile

# Package the extension
echo "📦 Packaging extension..."
npx vsce package --no-dependencies --allow-missing-repository

# Install the extension
echo "🚀 Installing extension in VS Code..."
code --install-extension afm-extension-0.1.0.vsix

echo "✅ AFM Extension installed successfully!"
echo ""
echo "🎯 How to use:"
echo "1. Open any .afm or .afm.md file"
echo "2. The profile view should open automatically"
echo "3. Click 'Edit Instructions' to edit markdown content"
echo ""
echo "🐛 If the profile view doesn't open automatically:"
echo "1. Right-click on an AFM file in explorer"
echo "2. Select 'Open Profile View'"
echo ""
echo "💡 Test files are available in test-samples/ directory"