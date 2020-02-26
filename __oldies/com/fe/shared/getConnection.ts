import { ITson } from '../../../../tson/tson';
import connections from './connections';
import { TOpenRequests } from './connections';
import { RESPONSE } from './enums/RESPONSE';


export default (url: string, TSON: ITson) => {
    let ws: WebSocket;
    let openRequests: TOpenRequests;
    let connection = connections.get(url);
    
    if (!connection) {
        ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
        openRequests =  new Map();
        connection = [ws, openRequests];
        connections.set(url, connection)

        ws.onmessage = function (event) {
            const response = TSON.toJSON(event.data);
            const id = response[RESPONSE.REQUEST_ID];
            const resolver = openRequests.get(id);
            if (resolver) {
                resolver(response);
                openRequests.delete(id);
            } else {
                // drop silently
            }
        }
    }
    return connection;
}