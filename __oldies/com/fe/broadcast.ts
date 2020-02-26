import getConnection from './shared/getConnection';
import getDomainsTSON from './shared/getDomainsTSON';

export default <ReqData>(url: string, endpointId: number, domain = 'default') => {
    let TSON = getDomainsTSON(domain);
    const [ws] = getConnection(url, TSON);
    return (data: ReqData) => {
        const toTransmit = [endpointId, data]; 
        const tson = TSON.make(toTransmit);
        // @ts-ignore
        ws.send(tson);    
    }
}
