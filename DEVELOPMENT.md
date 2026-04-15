# Development Guide

This guide will help you set up the development environment and understand the codebase structure for the Bartleby Obsidian plugin.

## 🏗️ Project Structure

```
Bartleby/
├── main.ts                 # Main plugin logic
├── manifest.json           # Plugin metadata
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript configuration
├── esbuild.config.mjs     # Build configuration
├── styles.css             # Plugin CSS styles
├── README.md              # User documentation
├── requirements.md        # Project requirements
├── ideation.md           # Original concept
├── LICENSE               # MIT license
├── .gitignore           # Git ignore rules
└── notes.md             # Development notes
```

## 🛠️ Development Setup

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Obsidian (latest version)
- TypeScript knowledge

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Bartleby
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Link to Obsidian plugins directory:**
   ```bash
   # Create a symbolic link to your Obsidian plugins directory
   # Replace the path with your actual Obsidian plugins directory
   ln -s $(pwd) ~/.obsidian/plugins/bartleby-x-post-editor
   ```

4. **Build the plugin:**
   ```bash
   npm run build
   ```

5. **Enable in Obsidian:**
   - Start Obsidian
   - Go to Settings → Community Plugins
   - Enable "Bartleby"

### Development Workflow

1. **Start development mode:**
   ```bash
   npm run dev
   ```
   This will watch for file changes and automatically rebuild.

2. **Make changes to the code**

3. **Reload the plugin in Obsidian:**
   - Press `Ctrl+Shift+I` (or `Cmd+Option+I` on Mac) to open Developer Tools
   - Go to Console tab
   - Run: `app.plugins.disablePlugin('bartleby-x-post-editor')`
   - Run: `app.plugins.enablePlugin('bartleby-x-post-editor')`
   - Or restart Obsidian

## 🎯 Key Components

### Main Plugin Class (`BartlebyPlugin`)

The main plugin extends Obsidian's `Plugin` class and handles:
- Editor event monitoring
- Character counting logic
- Visual marker placement
- Status bar updates

### Character Counting Algorithm

The core logic implements X's character counting rules:

```typescript
private calculateCharacterCount(content: string): CharacterCount {
    // 1. Replace URLs with 23-character placeholders
    // 2. Count emojis as 2 characters each
    // 3. Calculate total character count
    // 4. Find position where limit is exceeded
}
```

### Settings Management

Settings are handled through:
- `BartlebySettings` interface defining all options
- `BartlebySettingTab` class providing the UI
- Persistent storage using Obsidian's data API

### Real-time Updates

Uses a debounced approach to prevent performance issues:
- 50ms debounce on editor changes
- Efficient character counting
- Minimal DOM manipulation

## 🧪 Testing

### Manual Testing Checklist

- [ ] Basic character counting works correctly
- [ ] Marker appears/disappears at 280 characters
- [ ] URLs count as 23 characters
- [ ] Emojis count as 2 characters each
- [ ] @mentions and #hashtags count correctly
- [ ] Status bar updates in real-time
- [ ] Settings panel works
- [ ] Plugin enables/disables properly
- [ ] Works in both edit and preview modes

### Test Cases

1. **URL Handling:**
   ```
   Check this link: https://verylongdomainname.com/extremely-long-path-that-would-exceed-280-characters-if-counted-normally
   ```

2. **Emoji Handling:**
   ```
   Hello world! 😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌
   ```

3. **Mixed Content:**
   ```
   Follow me @username and check out #hashtag with this link: https://example.com 🚀
   ```

### Debugging

1. **Enable Developer Tools:**
   - Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

2. **View Console Logs:**
   - Check for any error messages
   - Use `console.log()` statements for debugging

3. **Inspect Elements:**
   - Right-click on marker or status bar
   - Select "Inspect Element" to view DOM structure

## 📝 Code Style

### TypeScript Guidelines
- Use strict type checking
- Prefer interfaces over types for objects
- Use meaningful variable names
- Add JSDoc comments for public methods

### CSS Guidelines
- Use CSS custom properties (variables) for theming
- Follow BEM naming convention for classes
- Support both light and dark themes
- Consider accessibility (high contrast mode)

### Git Workflow
- Use conventional commit messages
- Create feature branches for new functionality
- Write descriptive pull request descriptions
- Update documentation for user-facing changes

## 🚀 Building for Release

1. **Update version numbers:**
   ```bash
   # Update manifest.json and package.json versions
   ```

2. **Build production version:**
   ```bash
   npm run build
   ```

3. **Create release files:**
   - `main.js` (bundled code)
   - `manifest.json` (metadata)
   - `styles.css` (if using external CSS)

4. **Test thoroughly:**
   - Install from built files
   - Test all major features
   - Verify on different themes

## 🔧 Common Issues

### Plugin Not Loading
- Check manifest.json syntax
- Verify minAppVersion compatibility
- Check console for error messages

### Marker Not Appearing
- Verify character counting logic
- Check CSS styles are applied
- Ensure editor is in edit mode

### Performance Problems
- Profile the character counting function
- Check for memory leaks
- Optimize DOM manipulation

## 📚 Resources

- [Obsidian Plugin API Documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Obsidian Plugin Developer Discord](https://discord.gg/obsidianmd)
- [Example Plugins Repository](https://github.com/obsidianmd/obsidian-sample-plugin)

## 🤝 Contributing

See the main README.md for contribution guidelines. When contributing:

1. Follow the code style guidelines
2. Add tests for new features
3. Update documentation
4. Test across different platforms
5. Consider accessibility implications

## 📞 Support

For development questions:
- Check the Obsidian Plugin Developer docs
- Join the Obsidian Discord community
- Create detailed GitHub issues

Happy coding! 🎉