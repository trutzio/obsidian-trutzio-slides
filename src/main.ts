import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	SlidesPluginSettings,
	SlidesSettingTab,
} from "./settings.js";
import { SlidesWebserver } from "./webserver.js";
import path from "node:path";

export default class SlidesPlugin extends Plugin {
	settings: SlidesPluginSettings;

	webserver: SlidesWebserver;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("info", "Show slides", (evt: MouseEvent) => {
			const targetDocument = this.app.workspace.getActiveFile();
			if (targetDocument) {
				this.webserver.show(targetDocument.path);
				window.open("http://localhost:3000");
			}
		});

		this.addSettingTab(new SlidesSettingTab(this.app, this));

		const vaultDir = (
			this.app.vault.adapter as unknown as { basePath: string }
		).basePath;
		const pluginDir = path.join(
			vaultDir,
			this.manifest.dir ? this.manifest.dir : "" // TODO: Check if empty string is correct
		);
		this.webserver = new SlidesWebserver(vaultDir, pluginDir);
		this.webserver.start();
	}

	onunload() {
		this.webserver.stop();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<SlidesPluginSettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
