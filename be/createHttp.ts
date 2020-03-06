import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

export interface IConnectionOptions {
    secured?: boolean;
    cert?: string;
    key?: string;
}

export default (port: number, options: IConnectionOptions = {}) => {
    if (options.secured) {
        const srv = https.createServer({
            // @ts-ignore
            cert: fs.readFileSync(options.cert), // '/path/to/cert.pem'
            // @ts-ignore
            key: fs.readFileSync(options.key)    // '/path/to/key.pem'
        });
        srv.listen(port);
        return srv;
    } 
    const srv = http.createServer();
    srv.listen(port);
    return srv;
}