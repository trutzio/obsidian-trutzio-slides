import { fastify, FastifyInstance } from "fastify";
import { fastifyStatic } from "@fastify/static";
import { fastifyView } from "@fastify/view";
import path from "node:path";

export class SlidesWebserver {
	private _server: FastifyInstance = fastify({ logger: false });
	private _port: number = 3000;
	private _contentPath: string = "";

	constructor(vaultDir: string, pluginDir: string) {

		this._server.register(fastifyView, {
			engine: {
				ejs: require("ejs"),
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
			root: path.join(pluginDir, "node_modules/reveal.js/dist"),
			prefix: "/dist/",
			decorateReply: false,
		});

		this._server.register(fastifyStatic, {
			root: path.join(pluginDir, "node_modules/reveal.js/plugin"),
			prefix: "/plugin/",
			decorateReply: false,
		});
	}

	async show(contentPath: string) {
		this._contentPath = contentPath;
	}

	async start() {
		await this._server.listen({ port: this._port });
		console.info("Slides webserver is ready to go.");
	}

	async stop() {
		await this._server.close();
		console.info("Slides webserver closed.");
	}
}
