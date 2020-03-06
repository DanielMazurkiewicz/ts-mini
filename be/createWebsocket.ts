import * as WebSocket from 'ws';

import { IConnectionOptions } from './createHttp';
import createHttp from './createHttp';

import Tson from '../tson/tson';
import { IncomingMessage } from 'http';
import throwError from '../utils/throwError';
import { 
    ERROR_BE_CREATE_WEBSOCKET_ON_CONNECTION_ALREADY_EXIST, 
    ERROR_BE_CREATE_WEBSOCKET_ON_CLOSE_ALREADY_EXIST, 
    ERROR_BE_CREATE_WEBSOCKET_ON_ERROR_ALREADY_EXIST, 
    ERROR_BE_CREATE_WEBSOCKET_IMPROPER_PUSHPOINTID, 
    ERROR_BE_CREATE_WEBSOCKET_WEBSOCKET_PROBLEM,
    ERROR_BE_CREATE_WEBSOCKET_INVALID_TSON,
    ERROR_BE_CREATE_WEBSOCKET_IMPROPER_REQUEST_FORMAT,
    ERROR_BE_CREATE_WEBSOCKET_NON_EXISTING_ENDPOINT,
    ERROR_BE_CREATE_WEBSOCKET_INVALID_MESSAGE_DATA,
    ERROR_BE_CREATE_WEBSOCKET_ENDPOINT_FAILED,
    ERROR_BE_CREATE_WEBSOCKET_RESPONSE_FAILED

} from '../ERRORS';

type Endpoint = (data: any) => any;
type Endpoints = Map<number, [boolean, Endpoint]>;



export interface ISession {
    [prop: string]: any
    con: WebSocket
    errorCode?: number
}


/*

Communication protocols:
    Client                                                      <-> Server

    broadcast:          <endpointId, ...requestData>
    request-response:   <endpointId, returnId, ...requestData>  --- <returnId, responseData>
    request-response:   <endpointId, returnId, ...requestData>  --- <returnId, responseData, errorCode>


    Server                                                      <-> Client

    push:               <pushpointId, ...requestData>

*/



export default (port: number, options: IConnectionOptions = {}) => {
    const server = createHttp(port, options)
    const wss = new WebSocket.Server({ server });
    
    const endpoints: Endpoints = new Map();
    const tson = Tson();

    let onconnection: (session: ISession, request: IncomingMessage) => void;
    let onerror: (session: ISession, errorCode: number, details: any[]) => void;
    let onclose: (session: ISession, code: number, reason: string) => void;

    const reportError = (session: ISession, errorCode: number, ...details: any[]) => {
        if (onerror) {
            onerror(session, errorCode, details);
        } else {
            throwError(errorCode, session, ...details);
        }
    }

    wss.on('connection', (ws, request) => {
        const session: ISession = {
            con: ws
        };

        if (onconnection) onconnection(session, request);

        ws.on('close', (code, reason) => {
            if (onclose) onclose(session, code, reason)
        })
        ws.on('error', (error) => {
            reportError(session, ERROR_BE_CREATE_WEBSOCKET_WEBSOCKET_PROBLEM, error);
        })



        ws.on('message', (data) => {
            if (!(data instanceof Buffer)) {
                reportError(session, ERROR_BE_CREATE_WEBSOCKET_INVALID_MESSAGE_DATA, data);
                return;
            }

            let json: any;
            try {
                json = tson.toJSON(new DataView(data.buffer, data.byteOffset, data.byteLength));
            } catch (error) {
                reportError(session, ERROR_BE_CREATE_WEBSOCKET_INVALID_TSON, error);
                return;
            }

            if (!(json instanceof Array)) {
                reportError(session, ERROR_BE_CREATE_WEBSOCKET_IMPROPER_REQUEST_FORMAT, json);
                return;
            }

            const endpointId = json.shift();
            const endpointDescriptor = endpoints.get(endpointId);
            if (!endpointDescriptor) {
                reportError(session, ERROR_BE_CREATE_WEBSOCKET_NON_EXISTING_ENDPOINT, endpointId, json);
                return;
            } 
            const [isBroadcast, endpoint] = endpointDescriptor;
            if (isBroadcast) {
                json.unshift(session);

                try {
                    // @ts-ignore
                    endpoint.apply(undefined, json);
                } catch (e) {
                    reportError(session, ERROR_BE_CREATE_WEBSOCKET_ENDPOINT_FAILED, endpointId, json);
                    return;
                }
            } else {
                const returnId = json[0];
                json[0] = session;

                let response: any;
                try {
                    // @ts-ignore
                    response = endpoint.apply(undefined, json);
                } catch (e) {
                    reportError(session, ERROR_BE_CREATE_WEBSOCKET_ENDPOINT_FAILED, endpointId, json);
                    return;
                }

                const respond = (responseData: any) => {
                    const responseMessage = [returnId, responseData];
                    if (session.errorCode !== undefined) {
                        responseMessage.push(session.errorCode);
                        delete session.errorCode;
                    }
                    ws.send(tson.make(responseMessage));
                }

                if (response instanceof Promise) {
                    response
                    .then(respond)
                    .catch((reason) => {
                        reportError(session, ERROR_BE_CREATE_WEBSOCKET_RESPONSE_FAILED, endpointId, returnId, json, reason);
                    })
                } else {
                    try {
                        respond(response);    
                    } catch (e) {
                        reportError(session, ERROR_BE_CREATE_WEBSOCKET_RESPONSE_FAILED, endpointId, returnId, json, e, response);
                    }
                }
            }
        });
    });

    const me = {
        onconnection: (callback: (session: ISession, request: IncomingMessage) => void) => {
            // @ts-ignore
            if (onconnection) {
                throwError(ERROR_BE_CREATE_WEBSOCKET_ON_CONNECTION_ALREADY_EXIST);
            }
            onconnection = callback;
            return me;
        },

        onclose: (callback: (session: ISession, code: number, reason: string) => void) => {
            // @ts-ignore
            if (onclose) {
                throwError(ERROR_BE_CREATE_WEBSOCKET_ON_CLOSE_ALREADY_EXIST);
            }
            onclose = callback;
            return me;
        },

        onerror: (callback: (session: ISession, errorCode: number, details: any[]) => void) => {
            // @ts-ignore
            if (onerror) {
                throwError(ERROR_BE_CREATE_WEBSOCKET_ON_ERROR_ALREADY_EXIST);
            }
            onerror = callback;
            return me;
        },

        onreqres: (endpointId: number, callback: (session: ISession, ...args: any[]) => any) => {
            endpoints.set(endpointId, [false, callback]);
            return me;
        },
        onbroadcast: (endpointId: number, callback: (session: ISession, ...args: any[]) => void) => {
            endpoints.set(endpointId, [true, callback]);
            return me;
        },

        getPush: <PushFunction>(pushpointId: number) => {
            if (pushpointId >= 0) throwError(ERROR_BE_CREATE_WEBSOCKET_IMPROPER_PUSHPOINTID, pushpointId);

            return <PushFunction><unknown>((sessions: ISession | ISession[] | Map<ISession, any>, ...pushData: any) => {
                pushData.unshift(pushpointId);
                if (sessions instanceof Map) {
                    sessions.forEach((v, session) => {
                        session.con.send(tson.make(pushData));
                    })
                } else if (sessions instanceof Array) {
                    for (let i = 0; i < sessions.length; i++) {
                        sessions[i].con.send(tson.make(pushData));
                    }
                } else {
                    sessions.con.send(tson.make(pushData));
                }
            })
        },
    }

    return me;
}