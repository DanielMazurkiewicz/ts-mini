import Tson, { ITson } from '../../../tson/tson';
import getConnection from './shared/getConnection';
import { ERROR } from './shared/enums/ERROR'
import { types } from 'util';
import getDomainsTSON from './shared/getDomainsTSON';

let requestId = 1; // Zero reserved for broadcast

export type TResponse<ResData> = [number, number, ResData?]; // [requestId, responseCode, responseData]

const domains: Record<string, ITson> = {}

export default <ReqData, ResData>(url: string, endpointId: number, domain = 'default', timeoutInMs = 60000) => {
    let TSON = getDomainsTSON(domain);
    const [ws, openRequests] = getConnection(url, TSON);


    return (data: ReqData, timeout = timeoutInMs): Promise<TResponse<ResData>> | undefined => {
        const id = requestId++;
        const toTransmit = [endpointId, id, data];
        const tson = TSON.make(toTransmit);
    
        if (!tson) {
            return new Promise<TResponse<ResData>>(resolver => resolver([id, ERROR.TSON_DATA_ISSUE]));
        } else {
            // @ts-ignore
            ws.send(tson);
    
            return new Promise<TResponse<ResData>>(resolver => {
                openRequests.set(id, resolver);
                if (timeout) setTimeout(() => {
                    if (openRequests.get(id)) {
                        openRequests.delete(id);
                        resolver([id, ERROR.REQUEST_TIMEOUT]);
                    }
                }, timeout);
            });
        }
    }
}
