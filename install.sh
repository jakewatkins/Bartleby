#!/bin/bash

# Bartleby Plugin Installation Script
# Usage: ./install.sh /path/to/your/obsidian/vault

if [ -z "$1" ]; then
    echo "❌ Please provide your Obsidian vault path"
    echo "Usage: ./install.sh /path/to/your/obsidian/vault"
    echo ""
    echo "To find your vault path:"
    echo "1. Open Obsidian"
    echo "2. Go to Settings → About"
    echo "3. Look for 'Vault path'"
    exit 1
fi

VAULT_PATH="$1"
PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/bartleby-x-post-editor"

# Check if vault exists
if [ ! -d "$VAULT_PATH" ]; then
    echo "❌ Vault directory does not exist: $VAULT_PATH"
    exit 1
fi

# Create plugin directory
echo "📁 Creating plugin directory..."
mkdir -p "$PLUGIN_DIR"

# Copy plugin files
echo "📋 Copying plugin files..."
cp main.js "$PLUGIN_DIR/"
cp manifest.json "$PLUGIN_DIR/"
cp styles.css "$PLUGIN_DIR/"

# Check if files were copied
if [ -f "$PLUGIN_DIR/main.js" ] && [ -f "$PLUGIN_DIR/manifest.json" ]; then
    echo "✅ Plugin installed successfully!"
    echo "📍 Location: $PLUGIN_DIR"
    echo ""
    echo "Next steps:"
    echo "1. Restart Obsidian"
    echo "2. Go to Settings → Community Plugins"
    echo "3. Enable 'Bartleby'"
    echo "4. Start writing your X posts!"
else
    echo "❌ Installation failed - could not copy files"
    exit 1
fi