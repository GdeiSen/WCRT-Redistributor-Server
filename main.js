import {GatewayAgent} from "./src/index.js";
const gatewayAgent = new GatewayAgent();

gatewayAgent.createNTSConnection();
gatewayAgent.createDBSConnection();
gatewayAgent.connectDBS();
gatewayAgent.connectNTS();
