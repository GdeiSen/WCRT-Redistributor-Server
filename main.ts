/**
This project is being developed solely for informational purposes and does not carry any commercial use!
https://github.com/GdeiSen/WCRT-Redistributor-Server.git
*/

import {GatewayAgent} from "./src";
const gatewayAgent = new GatewayAgent();

gatewayAgent.createNTSConnection();
gatewayAgent.createDBSConnection();
gatewayAgent.createCLSConnection();
gatewayAgent.connectCLS();
gatewayAgent.connectDBS();
gatewayAgent.connectNTS();
