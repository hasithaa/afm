#!/bin/bash

# Build and deploy the AFM VS Code extension

echo "🔨 Building extension..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "📦 Packaging extension..."
vsce package --allow-missing-repository

if [ $? -ne 0 ]; then
    echo "❌ Packaging failed"
    exit 1
fi

echo "🚀 Installing extension..."
code --install-extension afm-extension-0.1.0.vsix --force

if [ $? -eq 0 ]; then
    echo "✅ Extension deployed successfully!"
    echo "📝 Please reload VS Code to use the updated extension"
else
    echo "❌ Installation failed"
    exit 1
fi