import Tson from '../tson/tson';
import throwError from '../utils/throwError';
import { 
    ERROR_FE_CREATE_WEBSOCKET_IMPROPER_PUSHPOINTID, 
    ERROR_FE_CREATE_WEBSOCKET_STATUS_CHANGE_ALREADY_EXIST, 
    ERROR_FE_CREATE_WEBSOCKET_STAGE_CHANGE_ALREADY_EXIST, 
    ERROR_FE_CREATE_WEBSOCKET_REQRES_TIMEOUT, 
} from '../ERRORS';


export interface IConnectionOptions {
    retryInterval?: number
}


export const 
    CONNECTION_STATUS__NOT_CONNECTED = 0,
    CONNECTION_STATUS__CONNECTED = 1;


export const 
    CONNECTION_STAGE__NOT_CONNECTED = -2,
    CONNECTION_STAGE__CONNECTED = 1,
    CONNECTION_STAGE__DISCONECTED = -1,
    CONNECTION_STAGE__RECONNECTED = 2;


export default (url: string, options: IConnectionOptions = {}) => {
    options.retryInterval = options.retryInterval || 5000;

    let openRequests: Map<number, any> =  new Map();
    let nextResponseId = 1;
    let awaitingResponses = 0;

    const tson = Tson();

    let ws: WebSocket;

    let connectionStatus: number = CONNECTION_STATUS__NOT_CONNECTED;
    let connectionStage: number = CONNECTION_STAGE__NOT_CONNECTED;
    let onstatuschange: (status: number, ws: WebSocket, evt?: Event) => void;
    let onstagechange: (stage: number, ws: WebSocket, evt?: Event) => void;

    const wsConnect = () => {
        ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
    
        ws.onopen = (event) => {
            console.log('===Open')
            connectionStatus = CONNECTION_STATUS__CONNECTED;
            if (onstatuschange) onstatuschange(connectionStatus, ws, event);

            connectionStage = (connectionStage === CONNECTION_STAGE__NOT_CONNECTED) ? CONNECTION_STAGE__CONNECTED : CONNECTION_STAGE__RECONNECTED;
            if (onstagechange) onstagechange(connectionStage, ws, event);
        }
    
        ws.onclose = (event) => {
            console.log('===Close', connectionStage)
            if ((connectionStage === CONNECTION_STAGE__CONNECTED) || (connectionStage === CONNECTION_STAGE__RECONNECTED)) {
                connectionStage = CONNECTION_STAGE__DISCONECTED;
                if (onstagechange) onstagechange(connectionStage, ws, event);
            }

            if ((connectionStage === CONNECTION_STAGE__DISCONECTED) || (connectionStage === CONNECTION_STAGE__NOT_CONNECTED)) {
                setTimeout(wsConnect, options.retryInterval);
            }

            if (connectionStatus !== CONNECTION_STATUS__NOT_CONNECTED) {
                connectionStatus = CONNECTION_STATUS__NOT_CONNECTED
                if (onstatuschange) onstatuschange(connectionStatus, ws, event);
            }
        }

        // ws.onerror = (event) => {
        //     console.log('Error', event)
        // }

        ws.onmessage = (event) => {
            const response = <Array<any>>tson.toJSON(new DataView(event.data));
            const responseId = response.shift();
            const openRequest = openRequests.get(responseId);
            const isPush = openRequest[0];
            const resolver = openRequest[1];    
            if (isPush) {
                resolver.apply(undefined, response);
            } else {
                const timeoutId = openRequest[2];
                if (timeoutId !== undefined) {
                    clearInterval(timeoutId);
                }
                openRequests.delete(responseId);
                awaitingResponses--;
                resolver(response[0]);
            }
        }    
    }


    wsConnect();

    const me = {
        getBroadcast: <BroadcastFunction>(endpointId: number) => {
            return <BroadcastFunction><unknown>((...dataToTransmit: any[]) => {
                dataToTransmit.unshift(endpointId);
                const data = tson.make(dataToTransmit);

                console.log('Broadcast', endpointId, dataToTransmit, data)
                // TODO: check if below works or not
                // @ts-ignore
                ws.send(data);

            })
        },
        getReqres: <ReqresFunction>(endpointId: number, timeout = 60000) => {
            return <ReqresFunction><unknown>((...dataToTransmit: any[]): Promise<any> => {
                let id: number;
                if (awaitingResponses) {
                    id = nextResponseId++;
                } else {
                    nextResponseId = 2;
                    id = 1
                }
                awaitingResponses++;

                dataToTransmit.unshift(id);
                dataToTransmit.unshift(endpointId);
                const data = tson.make(dataToTransmit);
                const promise = new Promise<any>((resolver: (value?: any) => void, reject: (reason?: any) => void) => {
                    if (timeout) {
                        const timeoutId = setTimeout(() => {
                            openRequests.delete(id);
                            awaitingResponses--;
                            reject([ERROR_FE_CREATE_WEBSOCKET_REQRES_TIMEOUT, endpointId, id]);
                        }, timeout);
                        openRequests.set(id, [false, resolver, timeoutId]);
                    } else {
                        openRequests.set(id, [false, resolver]);
                    }
                });

                console.log('Reqres', endpointId, id, dataToTransmit, data)

                // TODO: check if below works or not
                // @ts-ignore
                ws.send(data);
                
                return promise;

            })
        },
        onpush: (pushpointId: number, callback: (...pushData: any) => any) => {
            if (pushpointId >= 0) throwError(ERROR_FE_CREATE_WEBSOCKET_IMPROPER_PUSHPOINTID, pushpointId);
            openRequests.set(pushpointId, [true, callback])
            return me;
        },

        onstatuschange: (callback: (status: number, ws: WebSocket, evt?: Event) => void) => {
            console.log('===Status')
            // @ts-ignore
            if (onstatuschange) {
                throwError(ERROR_FE_CREATE_WEBSOCKET_STATUS_CHANGE_ALREADY_EXIST);
            }
            onstatuschange = callback;
            callback(connectionStatus, ws)
            return me;
        },
        onstagechange: (callback: (stage: number, ws: WebSocket, evt?: Event) => void) => {
            console.log('===Stage')
            // @ts-ignore
            if (onstagechange) {
                throwError(ERROR_FE_CREATE_WEBSOCKET_STAGE_CHANGE_ALREADY_EXIST);
            }
            onstagechange = callback;
            callback(connectionStage, ws)
            return me;
        },

    }

    return me;
}



