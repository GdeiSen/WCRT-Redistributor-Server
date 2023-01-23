import express from "express";
import * as http from "http";
import {Server} from "socket.io";
import {EventEmitter} from "events";
import cors from "cors";
import cookieParser from "cookie-parser";

export default class ClientConnection {
    /**
     * Creates a connection object using socket io
     * @param {string} url url to connect
     */
    constructor(url) {
        this.url = url;
        this.MessageEmitter = new EventEmitter();
        this.app = express();
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: url,
            credentials: true,
            optionSuccessStatus: 200
        }));
        this.server = http.createServer(this.app);
    }

    /**
     * Trying to create server using socket io
     */
    async connect() {
        this.io = new Server(this.server, {cors: '*'});
        this.io.on("connection", (socket) => {
            this.socket = socket;
            socket.on('message', (message) => {
                this.MessageEmitter.emit('message', message, socket);
            })
        });
        this.server.listen(this.url);
        this.MessageEmitter.on('message', (message) => {
            console.log(message)
        })
        console.log(`⬜ Ready To Consume Messages From The Client On Port [${this.url}]`)
    }

    /**
     * Sending a message to all connecting clients
     * @param {string} channel name of event (channel)
     * @param {string} args data to send
     */
    emitSocket(channel, args) {
        if (!this.io) return 0;
        this.io.emit(channel, args);
    }

}
