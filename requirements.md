# Bartleby - X (Twitter) Post Editor Plugin for Obsidian

## Project Overview
Bartleby is an Obsidian plugin that helps users compose X (formerly Twitter) posts by providing real-time visual feedback about character limits and post formatting. The plugin ensures users can see exactly where their content will be truncated and accounts for X's specific character counting rules.

## Functional Requirements

### FR1: Core Character Limit Indicator
**Priority**: P0 (Must Have)
- **Description**: Display a visual marker (asterisk `*`) at the 280th character position in the editor
- **Behavior**: 
  - Marker appears only when content exceeds 280 characters
  - Marker position updates in real-time as user types or edits
  - Marker disappears when content is 280 characters or fewer
  - Marker should be visually distinct but non-intrusive

### FR2: Smart Character Counting
**Priority**: P0 (Must Have)
- **Description**: Implement X-specific character counting rules
- **Rules**:
  - Standard text: 1 character per character
  - URLs (any format): Count as 23 characters (X's t.co shortened length)
  - @mentions: Count actual characters including the @ symbol
  - #hashtags: Count actual characters including the # symbol
  - Emojis: Count as 2 characters each
  - Line breaks: Count as 1 character each

### FR3: URL Detection and Handling
**Priority**: P0 (Must Have)
- **Description**: Automatically detect URLs and apply correct character counting
- **Supported URL formats**:
  - `http://example.com`
  - `https://example.com`
  - `www.example.com`
  - `example.com`
- **Behavior**:
  - When URL is detected, count as 23 characters regardless of actual length
  - Visual indication of URL detection (subtle highlighting or different color)
  - Real-time updates when URLs are added, modified, or removed

### FR4: Character Counter Display
**Priority**: P1 (Should Have)
- **Description**: Show current character count and remaining characters
- **Location**: Status bar or dedicated UI element
- **Format**: "XXX/280" where XXX is current count
- **Color coding**:
  - Green: 0-250 characters
  - Yellow: 251-280 characters
  - Red: 281+ characters

### FR5: Plugin Integration
**Priority**: P0 (Must Have)
- **Description**: Seamless integration with Obsidian's editor
- **Requirements**:
  - Works in both editing and live preview modes
  - Respects Obsidian's theme system
  - Minimal performance impact on typing
  - Compatible with other plugins (no conflicts)

## Non-Functional Requirements

### NFR1: Performance
- Character counting and marker positioning should have no perceivable delay during typing
- Plugin should not impact Obsidian startup time significantly (<100ms)
- Memory usage should be minimal and scale with content length

### NFR2: Usability
- Plugin should be intuitive without requiring documentation
- Visual indicators should be accessibility-friendly (color-blind safe)
- Should work consistently across different Obsidian themes

### NFR3: Compatibility
- Support Obsidian API version 1.0+
- Compatible with desktop versions (Windows, macOS, Linux)
- Mobile compatibility is nice-to-have for future versions

## Technical Specifications

### Character Counting Algorithm
```typescript
interface CharacterCountRules {
  url: number; // Always 23 characters
  emoji: number; // 2 characters each
  mention: number; // Actual length including @
  hashtag: number; // Actual length including #
  linebreak: number; // 1 character
  standard: number; // 1 character per character
}
```

### URL Detection Pattern
- Regex pattern to detect URLs in various formats
- Handle edge cases like URLs within parentheses or followed by punctuation
- Consider URLs that span multiple lines

### Plugin Settings
- **Enable/Disable Plugin**: Global toggle
- **Marker Character**: Allow customization (default: `*`)
- **Marker Color**: Theme-aware customization
- **Show Character Counter**: Toggle for status display
- **Count Mode**: Toggle between "characters remaining" vs "characters used"

## User Interface Requirements

### UI1: Visual Marker
- **Appearance**: Distinctive but non-disruptive
- **Position**: Inserted at exact 280th character position
- **Style**: Should integrate with current theme
- **Behavior**: Appears/disappears smoothly

### UI2: Character Counter
- **Location**: Obsidian status bar (bottom of editor)
- **Format**: Configurable display format
- **Visibility**: Always visible when plugin is active

### UI3: Settings Panel
- Standard Obsidian settings integration
- Organized sections for different feature categories
- Live preview of changes where applicable

## Acceptance Criteria

### AC1: Basic Functionality
- [ ] Asterisk appears at 280th character when content exceeds limit
- [ ] Asterisk position updates in real-time during editing
- [ ] Asterisk disappears when content is ≤280 characters
- [ ] Character count is accurate according to X rules

### AC2: URL Handling
- [ ] URLs are detected in all supported formats
- [ ] URLs count as exactly 23 characters regardless of actual length
- [ ] Multiple URLs in same post are handled correctly
- [ ] URL detection works with punctuation and formatting

### AC3: Special Character Handling
- [ ] @mentions count correctly (including @ symbol)
- [ ] #hashtags count correctly (including # symbol)
- [ ] Emojis count as 2 characters each
- [ ] Line breaks count as 1 character each

### AC4: Performance
- [ ] No noticeable lag during typing
- [ ] Plugin loads without impacting Obsidian startup
- [ ] Works smoothly with documents of various sizes

### AC5: Integration
- [ ] Works in both editing and live preview modes
- [ ] Respects user's chosen theme
- [ ] Settings integrate with Obsidian's settings panel
- [ ] No conflicts with popular Obsidian plugins

## Future Enhancements (Out of Scope for MVP)
- Thread composition support (1/n, 2/n format)
- Smart content splitting suggestions
- X API integration for direct posting
- Preview mode showing truncated vs. full content
- Template system for common post types
- Analytics and engagement predictions

## Testing Requirements
- Unit tests for character counting algorithm
- Integration tests with Obsidian editor
- Performance benchmarks
- Cross-platform compatibility testing
- Accessibility compliance testing

## Deliverables
1. Functional Obsidian plugin (.js bundle)
2. Plugin manifest (manifest.json)
3. User documentation (README.md)
4. Installation instructions
5. Settings documentation
6. Source code with proper TypeScript types