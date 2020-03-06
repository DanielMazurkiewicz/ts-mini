import { TStyleId } from "../structures/TStyleId";
import uid from "../../utils/uid";

export default (obj: any = {}): TStyleId => {
    obj.__tsm_sid = uid();
    return obj;
}