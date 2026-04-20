import { Plugin, PluginSettingTab, Setting, App, Editor, MarkdownView, EditorPosition, debounce } from 'obsidian';

interface BartlebySettings {
	enabled: boolean;
	markerCharacter: string;
	markerColor: string;
	showCharacterCounter: boolean;
	countMode: 'remaining' | 'used';
	characterLimit: number;
}

const DEFAULT_SETTINGS: BartlebySettings = {
	enabled: true,
	markerCharacter: '*',
	markerColor: '#ff6b6b',
	showCharacterCounter: true,
	countMode: 'used',
	characterLimit: 280
};

interface CharacterCount {
	total: number;
	remaining: number;
	exceedsLimit: boolean;
	limitPosition?: number;
}

export default class BartlebyPlugin extends Plugin {
	settings: BartlebySettings;
	statusBarItem: HTMLElement;
	activeEditor: Editor | null = null;
	markerWidget: HTMLElement | null = null;
	lastContent: string = '';
	activeFilePath: string | null = null;

	// URL detection regex - matches various URL formats
	private readonly urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9]+\.[a-zA-Z]{2,}[^\s]*)/g;
	
	// Emoji detection regex - matches unicode emoji sequences
	private readonly emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

	async onload() {
		await this.loadSettings();

		// Add status bar item
		this.statusBarItem = this.addStatusBarItem();
		this.statusBarItem.addClass('bartleby-status');

		// Register editor change events
		this.registerEvent(
			this.app.workspace.on('active-leaf-change', () => {
				this.updateActiveEditor();
			})
		);

		this.registerEvent(
			this.app.workspace.on('editor-change', (editor: Editor) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				const filePath = view?.file?.path ?? null;
				if (this.settings.enabled && this.activeFilePath !== null && this.activeFilePath === filePath && editor === this.activeEditor) {
					this.debouncedUpdateCharacterCount();
				}
			})
		);

		// Command palette toggle
		this.addCommand({
			id: 'bartleby-toggle',
			name: 'Toggle for this note',
			callback: () => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return;

				const filePath = view.file?.path ?? null;
				if (this.activeFilePath === filePath) {
					// Deactivate
					this.activeFilePath = null;
					this.removeMarker();
					this.updateStatusBar(null);
				} else {
					// Activate on this note
					this.activeFilePath = filePath;
					this.activeEditor = view.editor;
					this.debouncedUpdateCharacterCount();
				}
			}
		});

		// Initialize with current editor
		this.updateActiveEditor();

		// Add settings tab
		this.addSettingTab(new BartlebySettingTab(this.app, this));

		// Add CSS styles
		this.addStyles();
	}

	onunload() {
		this.removeMarker();
		this.statusBarItem?.remove();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	public updateActiveEditor() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			this.activeEditor = activeView.editor;
			// Only run if this is the note the user activated Bartleby on
			if (this.activeFilePath === (activeView.file?.path ?? null)) {
				this.debouncedUpdateCharacterCount();
			} else {
				this.removeMarker();
				this.updateStatusBar(null);
			}
		} else {
			this.activeEditor = null;
			this.removeMarker();
			this.updateStatusBar(null);
		}
	}

	// Debounced function to prevent excessive updates while typing
	private debouncedUpdateCharacterCount = debounce(() => {
		this.updateCharacterCount();
	}, 50, true);

	private updateCharacterCount() {
		if (!this.activeEditor || !this.settings.enabled) {
			this.removeMarker();
			this.updateStatusBar(null);
			return;
		}

		const content = this.activeEditor.getValue();
		const characterCount = this.calculateCharacterCount(content);

		this.updateStatusBar(characterCount);
		this.updateMarker(content, characterCount);

		this.lastContent = content;
	}

	private calculateCharacterCount(content: string): CharacterCount {
		let adjustedContent = content;
		let characterOffset = 0;

		// Replace URLs with placeholder of 23 characters
		const urls = content.match(this.urlRegex) || [];
		let limitPosition = 0;
		let runningCount = 0;

		for (const url of urls) {
			const urlStart = adjustedContent.indexOf(url);
			const beforeUrl = adjustedContent.substring(0, urlStart);
			const afterUrl = adjustedContent.substring(urlStart + url.length);
			
			// Count characters before this URL
			const beforeCount = this.countCharactersInSegment(beforeUrl);
			
			// If we haven't exceeded the limit yet, check if this gets us there
			if (runningCount + beforeCount + 23 <= this.settings.characterLimit) {
				runningCount += beforeCount + 23;
			} else if (limitPosition === 0) {
				// This URL pushes us over the limit
				const remainingBeforeLimit = this.settings.characterLimit - runningCount - beforeCount;
				if (remainingBeforeLimit > 0) {
					// We can fit some of the URL
					limitPosition = urlStart + Math.max(0, remainingBeforeLimit);
				} else {
					// The limit is somewhere in the text before this URL
					limitPosition = this.findPositionAtCharacterCount(beforeUrl, this.settings.characterLimit - runningCount) + runningCount;
				}
			}
			
			// Replace URL with 23-character placeholder
			const placeholder = 'x'.repeat(23);
			adjustedContent = beforeUrl + placeholder + afterUrl;
			characterOffset += placeholder.length - url.length;
		}

		// Count total characters in adjusted content
		const totalCount = this.countCharactersInSegment(adjustedContent);
		
		// Find limit position if not already set
		if (limitPosition === 0 && totalCount > this.settings.characterLimit) {
			limitPosition = this.findPositionAtCharacterCount(content, this.settings.characterLimit);
		}

		return {
			total: totalCount,
			remaining: this.settings.characterLimit - totalCount,
			exceedsLimit: totalCount > this.settings.characterLimit,
			limitPosition: limitPosition > 0 ? limitPosition : undefined
		};
	}

	private countCharactersInSegment(text: string): number {
		// Count emojis as 2 characters each
		const emojiCount = (text.match(this.emojiRegex) || []).length;
		
		// Remove emojis and count remaining characters
		const textWithoutEmojis = text.replace(this.emojiRegex, '');
		
		return textWithoutEmojis.length + (emojiCount * 2);
	}

	private findPositionAtCharacterCount(content: string, targetCount: number): number {
		let currentCount = 0;
		let position = 0;

		for (let i = 0; i < content.length; i++) {
			const char = content[i];
			
			// Check if this is the start of an emoji
			if (this.emojiRegex.test(char)) {
				currentCount += 2;
			} else {
				currentCount += 1;
			}

			position = i + 1;

			if (currentCount >= targetCount) {
				return position;
			}
		}

		return position;
	}

	private updateStatusBar(characterCount: CharacterCount | null) {
		if (!this.settings.showCharacterCounter || !characterCount) {
			this.statusBarItem.setText('');
			return;
		}

		const displayText = this.settings.countMode === 'remaining' 
			? `${characterCount.remaining} left`
			: `${characterCount.total}/${this.settings.characterLimit}`;

		// Color coding
		let className = 'bartleby-counter-green';
		if (characterCount.total > this.settings.characterLimit) {
			className = 'bartleby-counter-red';
		} else if (characterCount.total > this.settings.characterLimit - 30) {
			className = 'bartleby-counter-yellow';
		}

		this.statusBarItem.setText(displayText);
		this.statusBarItem.className = `bartleby-status ${className}`;
	}

	private updateMarker(content: string, characterCount: CharacterCount) {
		this.removeMarker();

		if (!characterCount.exceedsLimit || characterCount.limitPosition === undefined) {
			return;
		}

		const editor = this.activeEditor;
		if (!editor) return;

		// Find line and character position for the limit
		const lines = content.substring(0, characterCount.limitPosition).split('\n');
		const line = lines.length - 1;
		const ch = lines[lines.length - 1].length;

		// Create marker element
		this.markerWidget = document.createElement('span');
		this.markerWidget.textContent = this.settings.markerCharacter;
		this.markerWidget.className = 'bartleby-marker';
		this.markerWidget.style.color = this.settings.markerColor;

		// Insert marker at the calculated position
		try {
			const pos: EditorPosition = { line, ch };
			editor.replaceRange(this.settings.markerCharacter, pos, pos);
		} catch (error) {
			console.error('Bartleby: Error inserting marker:', error);
		}
	}

	private removeMarker() {
		if (!this.activeEditor || !this.lastContent) return;

		const content = this.activeEditor.getValue();
		const markerIndex = content.indexOf(this.settings.markerCharacter);
		
		if (markerIndex !== -1) {
			// Check if this marker was inserted by our plugin
			const beforeMarker = content.substring(0, markerIndex);
			const characterCount = this.calculateCharacterCount(beforeMarker);
			
			// If the marker is approximately at the character limit, remove it
			if (Math.abs(characterCount.total - this.settings.characterLimit) <= 2) {
				const lines = beforeMarker.split('\n');
				const line = lines.length - 1;
				const ch = lines[lines.length - 1].length;
				const pos: EditorPosition = { line, ch };
				const endPos: EditorPosition = { line, ch: ch + this.settings.markerCharacter.length };
				
				this.activeEditor.replaceRange('', pos, endPos);
			}
		}

		if (this.markerWidget) {
			this.markerWidget.remove();
			this.markerWidget = null;
		}
	}

	private addStyles() {
		const style = document.createElement('style');
		style.id = 'bartleby-styles';
		style.textContent = `
			.bartleby-marker {
				background-color: rgba(255, 107, 107, 0.2);
				border-radius: 2px;
				padding: 0 2px;
				font-weight: bold;
			}

			.bartleby-status {
				font-size: 12px;
				padding: 2px 6px;
				border-radius: 3px;
			}

			.bartleby-counter-green {
				color: var(--text-success);
			}

			.bartleby-counter-yellow {
				color: var(--text-warning);
			}

			.bartleby-counter-red {
				color: var(--text-error);
			}
		`;
		document.head.appendChild(style);
	}
}

class BartlebySettingTab extends PluginSettingTab {
	plugin: BartlebyPlugin;

	constructor(app: App, plugin: BartlebyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Bartleby Settings' });

		new Setting(containerEl)
			.setName('Enable Plugin')
			.setDesc('Turn the Bartleby character counter on or off')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enabled)
				.onChange(async (value) => {
					this.plugin.settings.enabled = value;
					await this.plugin.saveSettings();
					this.plugin.updateActiveEditor();
				}));

		new Setting(containerEl)
			.setName('Character Limit')
			.setDesc('Set the character limit for posts (default: 280 for X/Twitter)')
			.addText(text => text
				.setPlaceholder('280')
				.setValue(this.plugin.settings.characterLimit.toString())
				.onChange(async (value) => {
					const limit = parseInt(value);
					if (!isNaN(limit) && limit > 0) {
						this.plugin.settings.characterLimit = limit;
						await this.plugin.saveSettings();
						this.plugin.updateActiveEditor();
					}
				}));

		new Setting(containerEl)
			.setName('Marker Character')
			.setDesc('Character to display at the limit position')
			.addText(text => text
				.setPlaceholder('*')
				.setValue(this.plugin.settings.markerCharacter)
				.onChange(async (value) => {
					if (value.length > 0) {
						this.plugin.settings.markerCharacter = value[0];
						await this.plugin.saveSettings();
					}
				}));

		new Setting(containerEl)
			.setName('Marker Color')
			.setDesc('Color for the character limit marker')
			.addText(text => text
				.setPlaceholder('#ff6b6b')
				.setValue(this.plugin.settings.markerColor)
				.onChange(async (value) => {
					if (value.match(/^#[0-9A-F]{6}$/i) || value.match(/^#[0-9A-F]{3}$/i)) {
						this.plugin.settings.markerColor = value;
						await this.plugin.saveSettings();
					}
				}));

		new Setting(containerEl)
			.setName('Show Character Counter')
			.setDesc('Display character count in the status bar')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showCharacterCounter)
				.onChange(async (value) => {
					this.plugin.settings.showCharacterCounter = value;
					await this.plugin.saveSettings();
					this.plugin.updateActiveEditor();
				}));

		new Setting(containerEl)
			.setName('Counter Display Mode')
			.setDesc('Show characters used or characters remaining')
			.addDropdown(dropdown => dropdown
				.addOption('used', 'Characters Used (XXX/280)')
				.addOption('remaining', 'Characters Remaining (XXX left)')
				.setValue(this.plugin.settings.countMode)
				.onChange(async (value: 'used' | 'remaining') => {
					this.plugin.settings.countMode = value;
					await this.plugin.saveSettings();
					this.plugin.updateActiveEditor();
				}));
	}
}