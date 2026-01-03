import { Plugin } from "obsidian";
import { SlidesWebserver } from "./webserver.js";
import path from "node:path";

export default class SlidesPlugin extends Plugin {
	webserver: SlidesWebserver;

	async onload() {
		this.addRibbonIcon(
			"file-chart-pie",
			"Show slides",
			(evt: MouseEvent) => {
				const targetDocument = this.app.workspace.getActiveFile();
				if (targetDocument) {
					this.webserver.show(targetDocument.path);
					window.open("http://localhost:3000");
				}
			}
		);

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
}
