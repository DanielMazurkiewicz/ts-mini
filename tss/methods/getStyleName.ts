import { TStyleId } from "../structures/TStyleId";

export default (id: TStyleId): string => 
    // @ts-ignore
    id.__tsm_sid;