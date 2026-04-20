# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bartleby is an Obsidian plugin that helps users compose X (Twitter) posts by providing real-time visual feedback about character limits. It inserts a visual marker (`*`) at the 280-character cutoff point and displays live character counts in the status bar.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Watch mode (auto-rebuilds on changes)
npm run build      # Production build (type-check + bundle)
```

There is no automated test suite — testing is manual via Obsidian (see `DEVELOPMENT.md` for the checklist).

## Architecture

All plugin logic lives in a single file: `main.ts`. Key classes:

- **`BartlebyPlugin`** — Extends Obsidian's `Plugin`. Manages lifecycle, registers editor change listeners, debounces updates (50ms), and orchestrates marker + status bar updates.
- **`BartlebySettingTab`** — Settings UI using Obsidian's `PluginSettingTab` / `Setting` components.

### Core Data Flow

```
Editor change → debouncedUpdateCharacterCount (50ms)
    → calculateCharacterCount   (applies X counting rules)
    → updateMarker              (inserts marker char at cutoff position)
    → updateStatusBar           (color-coded count display)
```

### X Character Counting Rules (`calculateCharacterCount`)

- URLs (any format matched by regex) → 23 characters (X's t.co standard)
- Emojis (Unicode ranges) → 2 characters each
- All other characters → 1 each

### Marker Insertion (`updateMarker`)

The marker is real text inserted into the editor (not a decoration). The function:
1. Calculates the absolute character position where the limit is exceeded
2. Converts that to line/column coordinates by scanning newlines
3. Removes the old marker then calls `editor.replaceRange()` to insert the new one

### Build

esbuild bundles `main.ts` → `main.js` (CommonJS, ES2018 target). Obsidian itself and Node builtins are externalized (not bundled).

## Local Development Setup

Symlink the repo into Obsidian's plugins directory to test live:

```bash
ln -s $(pwd) ~/.obsidian/plugins/bartleby-x-post-editor
```

After code changes in dev mode, reload the plugin from Obsidian's developer console:

```javascript
app.plugins.disablePlugin('bartleby-x-post-editor')
app.plugins.enablePlugin('bartleby-x-post-editor')
```

Open DevTools with Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows/Linux).
