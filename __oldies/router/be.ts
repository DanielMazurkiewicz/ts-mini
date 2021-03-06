import {IncomingMessage, ServerResponse} from 'http';


const parameter = '/p';
const catchAll = '/*';
const methods = '/m';

const userOptions: Record<string, string> = {
    ':': parameter,
    '*': catchAll
}


type TRouteCallback = (req: IncomingMessage, res: ServerResponse, parameters: string[], data: Record<string, any>, urlQuery: string, next?: ()=>any) => any

export default (uncaught: TRouteCallback) => {
    const root = new Map<string, any>()

    const route = (req: IncomingMessage, res: ServerResponse) => {
        const url = req.url;
        if (url) {
            const [urlPathFull, urlQuery] = url.split('?');
            const urlPath = urlPathFull.split('/');
            let current = root;
            let next: Map<string, any>;
    
            let data: Record<string, any> = {};
            let parameters: string[] = []
    
            for (let i = 1; i < urlPath.length; i++) {
                const pathElement = urlPath[i];
                if (next = current.get(pathElement)) {
                    current = next;
                } else if (next = current.get(parameter)) {
                    parameters.push(pathElement);
                    current = next;
                } else if (next = current.get(catchAll)) {
                    parameters = parameters.concat(urlPath.slice(i));
                    current = next;
                    break;
                } else {
                    uncaught(req, res, parameters, data, urlQuery);
                    return;
                }
            }
    
            const method = <string>(req.headers.m || req.method);
            const methodsList = <Record<string, any>>current.get(methods);
            if (!methodsList) {
                uncaught(req, res, parameters, data, urlQuery);
                return;
            }

            const toExecute = methodsList[method];
            if (toExecute) {
                let executedId = 0;
                function proceedNext() {
                    if (executedId < toExecute.length) {
                        toExecute[executedId++](req, res, parameters, data, urlQuery, proceedNext);
                    }
                }
        
                proceedNext();    
            } else {
                uncaught(req, res, parameters, data, urlQuery);                
            }
        }
    }

    const use = (method: string, urlPath: string | string[], toExecute: TRouteCallback[]) => {

        if (typeof urlPath === 'string') urlPath = urlPath.split('/');
        let current = root;
        let next: Map<string, any>;

        for (let i = 1; i < urlPath.length; i++) {
            let pathElement = urlPath[i];
            pathElement = userOptions[pathElement] || pathElement;

            if (next = current.get(pathElement)) {
                current = next
            } else {
                current.set(pathElement, next = new Map<string, any>());
                current = next;
            }
        }
        let methodsList = current.get(methods);
        if (!methodsList) current.set(methods, methodsList = {});
        if (methodsList[method]) throw new Error(`${method}:${urlPath}`);
        methodsList[method] = toExecute
        return REST;
    }

    type TMethod = Record<string, (urlPath: string | string[], ...toExecute: TRouteCallback[]) => TMethod>

    const REST = new Proxy(<TMethod>{}, {
        get: function(target, prop, receiver) {
            return (urlPath: string | string[], ...toExecute: TRouteCallback[]) => use((<string>prop).toUpperCase(), urlPath, toExecute);
        }
    })

    return {
        REST,
        route,
    };
}