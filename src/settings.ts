import {App, PluginSettingTab, Setting} from "obsidian";
import SlidesPlugin from "./main.js";

export interface SlidesPluginSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: SlidesPluginSettings = {
	mySetting: 'default'
}

export class SlidesSettingTab extends PluginSettingTab {
	plugin: SlidesPlugin;

	constructor(app: App, plugin: SlidesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Settings #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
