import { fastify, FastifyInstance } from "fastify";
import { Notice } from "obsidian";

export class SlidesWebserver {

    private _server: FastifyInstance;
    private _port: number = 3000;

    constructor() {
        this._server = fastify({ logger: false });
        this._server.get('/', async (request, reply) => {
            return { hello: 'world' };
        });
    }

    async start() {
        try {
            console.info("Starting Slides webserver ...");
            await this._server.listen({ host: "localhost", port: this._port });
            console.info("Slides webserver is ready to go.");
        } catch (err) {
            new Notice(`Unable to start slides webserver. Is ${this._port} already in use?`);
            console.error("Unable to start slides webserver", err);
        }
    }

}