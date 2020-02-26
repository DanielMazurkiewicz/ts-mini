import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

export interface IConnectionOptions {
    secured?: boolean;
}

export default (port: number, options: IConnectionOptions = {}) => {
    if (options.secured) {
        const srv = https.createServer({
            cert: fs.readFileSync('/path/to/cert.pem'),
            key: fs.readFileSync('/path/to/key.pem')
        });
        srv.listen(port);
        return srv;
    } 
    const srv = http.createServer();
    srv.listen(port);
    return srv;
}