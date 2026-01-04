import { Plugin } from "obsidian";
import { SlidesWebserver } from "./webserver.js";
import path from "node:path";
import { requestUrl } from "obsidian";
import JSZip from "jszip";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

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
		await this.checkForExtraPluginFiles(pluginDir);
		this.webserver = new SlidesWebserver(vaultDir, pluginDir);
		this.webserver.start();
	}

	onunload() {
		this.webserver.stop();
	}

	async checkForExtraPluginFiles(pluginDir: string) {
		let allExtraPluginFilesExists = true;
		["index.ejs", "dist", "plugin"].every((name) => {	
			allExtraPluginFilesExists &&= existsSync(path.join(pluginDir, name));
		});
		if (!allExtraPluginFilesExists) {
			await this.downloadAndExtractExtraPluginFiles(pluginDir);	
		}
	}

	async downloadAndExtractExtraPluginFiles(pluginDir: string) {
		console.debug("Downloading extra plugin files...");
		const downloadUrl = `https://github.com/trutzio/obsidian-trutzio-slides/releases/download/${this.manifest.version}/trutzio-slides.zip`;
		await requestUrl(downloadUrl).then(async (response) => {
			if (response.status !== 200) {
				throw new Error(
					`Failed to download ${downloadUrl}: HTTP ${response.status}`
				);
			}
			const zip = new JSZip();
			await zip
				.loadAsync(response.arrayBuffer)
				.then((unzipped) => {
					unzipped.forEach((relativePath, file) => {
						const fullPath = path.join(pluginDir, relativePath);
						if (file.dir) {
							mkdirSync(fullPath, { recursive: true });
						} else {
							file.async("nodebuffer")
								.then((data) => {
									writeFileSync(fullPath, data);
								})
								.catch((error) => {
									console.error(
										`Error writing file ${fullPath}:`,
										error
									);
								});
						}
					});
				})
				.catch((error) => {
					console.error("Error unzipping the plugin files:", error);
				});
		});
	}
}
