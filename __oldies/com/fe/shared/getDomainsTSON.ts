import Tson, { ITson } from "../../../../tson/tson";

const domains: Record<string, ITson> = {}

export default (domain: string) => {
    if (!domains[domain]) {
        return domains[domain] = Tson();  
    }
    return domains[domain];    
}
