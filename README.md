# Bartleby - X (Twitter) Post Editor for Obsidian

> "I would prefer not to... exceed the character limit." - Bartleby, the Scrivener

Bartleby is an Obsidian plugin that helps you compose X (formerly Twitter) posts by providing real-time visual feedback about character limits. It accounts for X's specific character counting rules and shows exactly where your content will be truncated.

## ✨ Features

### Core Functionality
- **Visual Character Limit Indicator**: Displays an asterisk (`*`) at the 280th character position when content exceeds the limit
- **Real-time Updates**: Marker position updates as you type or edit
- **Smart Character Counting**: Implements X's specific counting rules:
  - URLs count as 23 characters (X's t.co shortened length)
  - Emojis count as 2 characters each
  - @mentions and #hashtags count their actual length
  - Standard text counts 1 character per character

### URL Handling
- Automatic detection of various URL formats:
  - `https://example.com`
  - `http://example.com`
  - `www.example.com`
  - `example.com`
- All detected URLs count as exactly 23 characters regardless of actual length
- Works with URLs containing punctuation or within parentheses

### Character Counter
- Live character count display in the status bar
- Color-coded indicators:
  - 🟢 Green (0-250 characters)
  - 🟡 Yellow (251-280 characters) 
  - 🔴 Red (281+ characters)
- Toggle between "characters used" (XXX/280) and "characters remaining" (XXX left)

### Customization Options
- Enable/disable the plugin globally
- Customize the character limit (default: 280)
- Change the marker character (default: `*`)
- Adjust marker color with hex codes
- Toggle character counter visibility
- Choose counter display mode

## 🚀 Installation

### Manual Installation
1. Download the latest release files (`main.js`, `manifest.json`, `styles.css`)
2. Create a folder named `bartleby-x-post-editor` in your Obsidian plugins folder:
   - Windows: `%APPDATA%\Obsidian\plugins\`
   - macOS: `~/Library/Application Support/obsidian/plugins/`
   - Linux: `~/.config/obsidian/plugins/`
3. Place the downloaded files in the created folder
4. Restart Obsidian
5. Enable "Bartleby" in Settings → Community Plugins

### From Source (Development)
```bash
# Clone the repository
git clone https://github.com/jakewatkins/bartleby-obsidian-plugin.git
cd bartleby-obsidian-plugin

# Install dependencies
npm install

# Build the plugin
npm run build

# For development with auto-rebuild
npm run dev
```

## 📖 Usage

### Basic Usage
1. Open any note in Obsidian
2. Start typing your X post content
3. When you exceed 280 characters, an asterisk (`*`) will appear at the cutoff point
4. The status bar shows your current character count with color coding

### Example
```
This is my tweet content that goes on for quite a bit and when it hits the character limit you'll see an asterisk right here*and this content will be hidden on X unless someone clicks "show more"
```

### Working with URLs
```
Check out this amazing article: https://reallylongdomainname.com/very-long-article-path-that-would-normally-be-many-characters*but X shortens it to 23 chars
```

### Special Characters
- **URLs**: `https://example.com` → counts as 23 characters
- **Emojis**: `😀` → counts as 2 characters  
- **Mentions**: `@username` → counts as actual length (9 characters)
- **Hashtags**: `#hashtag` → counts as actual length (8 characters)

## ⚙️ Settings

Access settings via Settings → Plugin Options → Bartleby:

| Setting | Description | Default |
|---------|-------------|---------|
| Enable Plugin | Turn character counting on/off globally | ✅ Enabled |
| Character Limit | Set the character limit for posts | 280 |
| Marker Character | Character to show at limit position | `*` |
| Marker Color | Hex color for the marker | `#ff6b6b` |
| Show Character Counter | Display count in status bar | ✅ Enabled |
| Counter Display Mode | Show used vs remaining characters | Used (XXX/280) |

## 🎯 Use Cases

- **Thread Planning**: Write long-form content and see natural break points
- **Draft Optimization**: Refine tweets to fit within the character limit
- **URL Management**: Account for shortened URLs when planning content
- **Multi-language Posts**: Handle emoji-heavy content accurately

## 🔧 Technical Details

### Character Counting Algorithm
The plugin implements X's specific character counting rules:
- Standard characters: 1 char = 1 count
- URLs (any format): Always 23 characters
- Emojis (Unicode): 2 characters each
- @mentions/#hashtags: Actual length including symbols
- Line breaks: 1 character each

### Performance
- Debounced updates (50ms) prevent lag while typing
- Minimal memory footprint that scales with content length
- No impact on Obsidian startup time

### Compatibility
- Supports Obsidian API 1.0+
- Works on Windows, macOS, and Linux
- Compatible with both editing and live preview modes
- Respects Obsidian's theme system

## 🐛 Troubleshooting

### Marker Not Appearing
- Check that the plugin is enabled in settings
- Verify your content exceeds the character limit
- Ensure you're in a markdown editing view

### Incorrect Character Count
- URLs should automatically be detected and count as 23 chars
- Emojis count as 2 characters each
- Check settings for correct character limit value

### Performance Issues
- The plugin uses debounced updates to prevent lag
- Try disabling other plugins to identify conflicts
- Report persistent issues on GitHub

## 🛣️ Roadmap

### Planned Features (Future Versions)
- Thread composition support (1/n, 2/n format)
- Smart content splitting suggestions at sentence boundaries
- X API integration for direct posting
- Preview mode showing truncated vs. full content
- Template system for common post types

## 📝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Herman Melville's "Bartleby, the Scrivener"
- Built for the Obsidian community
- Thanks to the Obsidian team for their excellent plugin API

## 📞 Support

- 🐛 Bug reports: [GitHub Issues](https://github.com/jakewatkins/bartleby-obsidian-plugin/issues)
- 💡 Feature requests: [GitHub Discussions](https://github.com/jakewatkins/bartleby-obsidian-plugin/discussions)
- 📖 Documentation: This README and inline code comments

---

*Made with ❤️ for the Obsidian community*