import SocketConnectionManager from "./managers/socket-connection-manager.js";
import RabbitMqConnectionManager from "./managers/rabbit-mq-connection-manager.js";
import config from "../config.json" assert {type: "json"};

/**
 * This module is the main object consisting of connections created using the rabbitmq
 * and socket_io connection managers, as well as incoming request handlers, as well as
 * their redistribution. This architecture provides the ability to design logic, in
 * which the server-distributor, receiving a request from the user, collects data by
 * making requests to microservices (database service; neural network service);
 */
export class GatewayAgent {/*
    ┌───┐    ┌────────────────┐    ┌─────────┐
    │ - ├────►distributor     └────►database │
    │ u │    │server          ◄────┐service  │
    │ s │    │----------------│    └─────────┤
    │ e │    │data logistics  └────►neural nt│
    │ r ◄────┤logic           ◄────┐service  │
    └───┘    └────────────────┘    └─────────┘
(http/socket connection)        (amqp connection)*/

    /**Connection object to neural network service class rabbitMQConnectionManager*/
    NTSConnection;

    /** Connection object to database service using rabbitMQConnectionManager*/
    DBSConnection;

    /**Connection object to clients using socketIOConnectionManager*/
    CLSConnection;

    /**Prepares connection to neural network service using rabbitMQConnectionManager*/
    createNTSConnection() {
        this.NTSConnection = new RabbitMqConnectionManager({
            name: "NEURAL-NT-CONNECTION",
            consumeOn: config.FROM_NT_CHANNEL,
            dispatchTo: config.TO_NT_CHANNEL,
            durable: true,
            showLogs: true,
            showInfoTable: true,
        })
    }

    /**Creates connection to neural network service using rabbitMQConnectionManager*/
    connectNTS() {/*
        ┌─┬───────┬───────────────┐       ┌───────────────────────┐
        │ │       │ redis server  │       │                       │
        │ │ agent ├───────────────┴──────►│ neural network server │
        │ │       │ rabbit mq connection  │                       │
        └─┴───────┴────────────────       └───────────────────────┘ */
        this.NTSConnection.connect();
    }

    /**Prepares connection to database service using rabbitMQConnectionManager*/
    createDBSConnection() {
        this.DBSConnection = new RabbitMqConnectionManager({
            name: "DATABASE-CONNECTION",
            consumeOn: config.FROM_DB_CHANNEL,
            dispatchTo: config.TO_DB_CHANNEL,
            durable: true,
            showLogs: true,
            showInfoTable: true,
        })
    }

    /**Creates connection to database service using rabbitMQConnectionManager*/
    connectDBS() {/*
        ┌─┬───────┬───────────────┐       ┌───────────────────────┐
        │ │       │ redis server  │       │                       │
        │ │ agent ├───────────────┴──────►│    database server    │
        │ │       │ rabbit mq connection  │                       │
        └─┴───────┴────────────────       └───────────────────────┘ */
        this.NTSConnection.connect();
    }

    /**Creates connection to client side using socketIOConnectionManager*/
    createCLSConnection() {
        this.CLSConnection = new SocketConnectionManager(config.CLIENT_URL);
    }
}