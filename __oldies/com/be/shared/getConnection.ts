import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as WebSocket from 'ws';

import { fromTSON, toTSON } from '../../../../tson/tson';

export interface ConnectionOptions {
    secured?: boolean;
}


const getHttpServer = (port: number, options: ConnectionOptions = {}) => {
    if (options.secured) {
        return https.createServer({
            cert: fs.readFileSync('/path/to/cert.pem'),
            key: fs.readFileSync('/path/to/key.pem')
        });      
    } else {
        return http.createServer();
    }
}

type Endpoint = (data: any) => any;
type Endpoints = Array<Endpoint>;

const enum MESSAGE_SIZE {
    BROADCAST = 2,
    REQUEST_RESPONSE = 3
}


export default (port: number, options: ConnectionOptions = {}) => {
    const server = getHttpServer(port, options)
    const wss = new WebSocket.Server({ server });

    const endpoints: Endpoints = [];

    wss.on('connection', (ws, request) => {
        
        ws.on('message', (data) => {
            if (data instanceof ArrayBuffer) {
                const json = fromTSON(new DataView(data));
                switch (json.length) {

                    case MESSAGE_SIZE.BROADCAST: {
                        const [endpointId, requestData] = json;
                        const endpoint = endpoints[endpointId];
                        if (endpoint) {
                            endpoint(requestData);
                        }
                    }
                    break;

                    case MESSAGE_SIZE.REQUEST_RESPONSE: {
                        const [endpointId, id, requestData] = json;
                        const endpoint = endpoints[endpointId];
                        if (endpoint) {
                            const response = endpoint(requestData);
                            if (response !== undefined) {
                                ws.send(toTSON([id, response]))
                            }
                        }
                    }
                    break;

                    default:
                        // log some error
                }

            } else {
                // log some error
            }
            // console.log('received: %s', message);
        });

        ws.send('something');
    });

    server.listen(8080);
}

