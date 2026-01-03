import { fastify, FastifyInstance } from "fastify";
import { fastifyStatic } from "@fastify/static";
import { fastifyView } from "@fastify/view";
import path from "node:path";
import ejs from "ejs";

export class SlidesWebserver {
	private _server: FastifyInstance = fastify({ logger: false });
	private _port: number = 3000;
	private _contentPath: string = "";

	constructor(vaultDir: string, pluginDir: string) {
		this._server.register(fastifyView, {
			engine: {
				ejs: ejs,
			},
			templates: pluginDir,
		});

		this._server.get("/", (request, reply) => {
			reply.view("index.ejs", {
				language: "en",
				title: "Slide",
				theme: "night",
				highlight_theme: "monokai",
				slidePath: this._contentPath,
			});
		});

		this._server.register(fastifyStatic, {
			root: vaultDir,
			prefix: "/md/",
		});

		this._server.register(fastifyStatic, {
			root: path.join(pluginDir, "dist"),
			prefix: "/dist/",
			decorateReply: false,
		});

		this._server.register(fastifyStatic, {
			root: path.join(pluginDir, "plugin"),
			prefix: "/plugin/",
			decorateReply: false,
		});
	}

	show(contentPath: string) {
		this._contentPath = contentPath;
	}

	start() {
		this._server
			.listen({ port: this._port })
			.then(() => {
				console.debug(
					`Slides webserver is running at http://localhost:${this._port}`
				);
			})
			.catch((err) => {
				console.error("Error starting Slides webserver:", err);
			});
	}

	stop() {
		this._server
			.close()
			.then(() => {
				console.debug("Slides webserver closed.");
			})
			.catch((err) => {
				console.error("Error stopping Slides webserver:", err);
			});
	}
}
