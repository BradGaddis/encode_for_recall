import { App, Editor, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface EncoderRecallSettings {
	replacementChar: string;
}

const DEFAULT_SETTINGS: EncoderRecallSettings = {
	replacementChar: 'default'
}

export default class EncoderRecall extends Plugin {
	settings: EncoderRecallSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Encode Text', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Text encoded!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new EncodingRecallSettings(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
class EncodingRecallSettings extends PluginSettingTab {
	plugin: EncoderRecall;

	constructor(app: App, plugin: EncoderRecall) {
		super(app, plugin);
		this.plugin = plugin;
	}

	

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Replacement Character')
			.setDesc('The character that will replace the original character during encoding')
			.addText(text => text
				.setPlaceholder('Enter a character')
				.setValue(this.plugin.settings.replacementChar)
				.onChange(async (value) => {
					this.plugin.settings.replacementChar = value;
					await this.plugin.saveSettings();
				}));
	}
}
