export type TOpenRequests = Map<number, any>;
export type TConnection = [WebSocket, TOpenRequests];


export default new Map<string, TConnection>(); // Websocket, open requests