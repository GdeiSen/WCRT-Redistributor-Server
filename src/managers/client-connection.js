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
        /*--------------------------------------------------------------
        ├─────────────┐
        │node js      │
        │http server  │
        ├───────┐     │
        │express│     │
        │app    │     │
        └───────┴─────┴...
        ----------------------------------------------------------------
        at this point, the designer creates an express application
        and then, using the native node js http module, creates a
        server where the already created express application is
        transferred, thereby showing that we will continue to use
        express "under the hood"
        ---------------------------------------------------------------*/
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

    /**Trying to create server using socket io*/
    async connect() {
        /*--------------------------------------------------------------
        ┌───────────────────┐  ┌──────────────────┐                 ┌───┐
        │socket io          │  │socket io server  ◄─────────────────┤   │
        │server             │  │                  │ socket "events" │ c │
        ├─────────────┐     │  ├────────────┐     ├─────────────────► l │
        │node js      │     │  │node js     │     │                 │ i │
        │http server  │     │  │http server │     │                 │ e │
        ├───────┐     │     │  ├───────┐    │     │                 │ n │
        │express│     │     │  │express├────┼─────┼──[middleware]───► t │
        │app    │     │     │  │app    │    │     │express "methods"│ s │
        │       │     │     │  │       ◄────┼─────┼──[middleware]───┤   │
        └───────┴─────┴─────┘  └──────────────────┘                 └───┘
        ----------------------------------------------------------------
        at this point, we wrap all this packaging in the socket io
        layer using the function:
        this.io = new Server( [ node js http server [express app ] ] )
        ---------------------------------------------------------------*/
        this.io = new Server(this.server);
        this.io.on("connection", (socket) => {
            socket.on('message', (message) => {
                this.MessageEmitter.emit('message', message, socket);
            })
        });
        this.server.listen(this.url);
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
