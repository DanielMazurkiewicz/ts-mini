import Serializer from './serialization/serializer'
import Deserializer from './serialization/deserializer'
import Dictionary, { IDictionary } from '../utils/dictionary'
import { V08, V16, V24, V32, V40, V48 } from '../utils/binValues'
import throwError from '../utils/throwError'
import isFloat32 from './isFloat32'
import {
    TSON_IDENTIFIER__Nul, TSON_IDENTIFIER__Und, TSON_IDENTIFIER__Fal, TSON_IDENTIFIER__Tru, TSON_IDENTIFIER__Nan,
    TSON_IDENTIFIER__P08, TSON_IDENTIFIER__P16, TSON_IDENTIFIER__P24, TSON_IDENTIFIER__P32, TSON_IDENTIFIER__P40, TSON_IDENTIFIER__P48, TSON_IDENTIFIER__Pin,
    TSON_IDENTIFIER__N08, TSON_IDENTIFIER__N16, TSON_IDENTIFIER__N24, TSON_IDENTIFIER__N32, TSON_IDENTIFIER__N40, TSON_IDENTIFIER__N48, TSON_IDENTIFIER__Nin,
    TSON_IDENTIFIER__F32, TSON_IDENTIFIER__F64, TSON_IDENTIFIER__Str, TSON_IDENTIFIER__Ref, TSON_IDENTIFIER__Bin,
    TSON_IDENTIFIER__ArS, TSON_IDENTIFIER__ArE,
    TSON_IDENTIFIER__ObS, TSON_IDENTIFIER__ObP, TSON_IDENTIFIER__ObE,
    TSON_IDENTIFIER__Nof,
} from './enums'
import { ERROR_TSON_IMPROPER_IDENTIFIER } from '../ERRORS'

const {
    sF32, sF64,
    sPB128,
    sStr,
    sU08, sU16, sU24, sU32, sU40, sU48,
    sBegin,
    view
} = Serializer();

const {
    gF32, gF64,
    gPB128,
    gStr,
    gU08, gU16, gU24, gU32, gU40, gU48,
    gBegin,
} = Deserializer(view());


export interface ITson {
    make: (object: any) => DataView | undefined;
    toJSON: (data: DataView) => any;
    addToDictionary: (names: string[]) => void;
}

export default () => {
    const dictionary = Dictionary<string>(2); // 0 and 1 are reserved for ObP and ObE

    const addToDictionary = (names: string[]) => names.forEach(n => dictionary.add(n));


    const isReference = (key: any, dictionary: IDictionary<any>) => {
        const keyId = dictionary.id(key); // Check if exist in dictionary
        if (keyId === undefined) {
            dictionary.add(key);
            return false;
        }
        sU08(TSON_IDENTIFIER__Ref);
        sPB128(keyId);
        return true;
    }

    const make = (object: any, ld?: IDictionary<string>, refDictionary = Dictionary<any>(), subsequent?: boolean) => {
        if (!ld) { // local dictionary
            ld = Dictionary(dictionary.length());
            sBegin()
        }

        switch (typeof object) {
            case 'boolean':
                object ? sU08(TSON_IDENTIFIER__Tru) : sU08(TSON_IDENTIFIER__Fal);
            break;
            case 'string':
                sU08(TSON_IDENTIFIER__Str);
                sStr(object);
            break;
            case 'number':
                const absolute = Math.abs(object);
                if (absolute < V48 && Number.isInteger(object)) { // save as integer value
                    if (absolute < V32) {
                        if (absolute < V24) {
                            if (absolute < V08) {
                                sU08(TSON_IDENTIFIER__P08 + (object < 0 ? TSON_IDENTIFIER__Nof : 0));
                                sU08(absolute);
                            } else if (absolute < V16) {
                                sU08(TSON_IDENTIFIER__P16 + (object < 0 ? TSON_IDENTIFIER__Nof : 0))                
                                sU16(absolute);
                            } else {
                                sU08(TSON_IDENTIFIER__P24 + (object < 0 ? TSON_IDENTIFIER__Nof : 0))                
                                sU24(absolute);
                            }
                        } else {
                            sU08(TSON_IDENTIFIER__P32 + (object < 0 ? TSON_IDENTIFIER__Nof : 0))                
                            sU32(absolute);    
                        }
                    } else if (absolute < V40) {
                        sU08(TSON_IDENTIFIER__P40 + (object < 0 ? TSON_IDENTIFIER__Nof : 0))                
                        sU40(absolute);
                    } else {
                        sU08(TSON_IDENTIFIER__P48 + (object < 0 ? TSON_IDENTIFIER__Nof : 0))                
                        sU48(absolute);
                    }
                } else if (absolute === Infinity) {
                    (object < 0) ? sU08(TSON_IDENTIFIER__Nin) : sU08(TSON_IDENTIFIER__Pin);
                } else { // save as float value
                    if (isFloat32(object)) {
                        sU08(TSON_IDENTIFIER__F32);
                        sF32(object)
                    } else {
                        sU08(TSON_IDENTIFIER__F64);
                        sF64(object)
                    }
                }
            break;

            default:
                if (object instanceof Array) {
                    if (!isReference(object, refDictionary)) {
                        sU08(TSON_IDENTIFIER__ArS);
                        for (let i = 0; i < object.length; i++) {
                            make(object[i], ld, refDictionary, true)
                        }
                        sU08(TSON_IDENTIFIER__ArE);    
                    }
                } else if (!object) { // null or undefined
                    (object === null) ? sU08(TSON_IDENTIFIER__Nul) : sU08(TSON_IDENTIFIER__Und);
                } else { // object
                    if (!isReference(object, refDictionary)) {
                        sU08(TSON_IDENTIFIER__ObS);
                        for (let key in object) {
                            const value = object[key];
                            if (value !== undefined) {
                                let keyId = dictionary.id(key); // Check if exist in global dictionary
                                if (keyId === undefined) {
                                    keyId = ld.id(key);  // Check if was already added to local dictionary
                                }
                                
                                if (keyId === undefined) { // if wasn't in local dictionary then add it and place full property details
                                    ld.add(key);
                                    sPB128(TSON_IDENTIFIER__ObP);
                                    sStr(key);
                                    
                                } else {
                                    sPB128(keyId);
                                }
                                make(value, ld, refDictionary, true)
                            }        
                        }
                        sPB128(TSON_IDENTIFIER__ObE);
                    }
                }
        }

        if (!subsequent) return view()
    }

    const toJSON = (data: DataView, ld?: string[], refDictionary: any[] = []) => {
        if (!ld) { // local dictionary
            // ld = Dictionary(dictionary.length());
            ld = new Array(dictionary.length())
            gBegin(data);
        }

        let value: any;
        let instruction = gU08();
        switch (instruction) {
            case TSON_IDENTIFIER__Nul: return null;
            case TSON_IDENTIFIER__Und: return undefined;
            case TSON_IDENTIFIER__Fal: return false;
            case TSON_IDENTIFIER__Tru: return true;
            case TSON_IDENTIFIER__Nan: return NaN;

            case TSON_IDENTIFIER__P08: return gU08();
            case TSON_IDENTIFIER__P16: return gU16();
            case TSON_IDENTIFIER__P24: return gU24();
            case TSON_IDENTIFIER__P32: return gU32();
            case TSON_IDENTIFIER__P40: return gU40();
            case TSON_IDENTIFIER__P48: return gU48();
            case TSON_IDENTIFIER__Pin: return Infinity;

            case TSON_IDENTIFIER__N08: return -gU08();
            case TSON_IDENTIFIER__N16: return -gU16();
            case TSON_IDENTIFIER__N24: return -gU24();
            case TSON_IDENTIFIER__N32: return -gU32();
            case TSON_IDENTIFIER__N40: return -gU40();
            case TSON_IDENTIFIER__N48: return -gU48();
            case TSON_IDENTIFIER__Nin: return -Infinity;

            case TSON_IDENTIFIER__F32: return gF32();
            case TSON_IDENTIFIER__F64: return gF64();
            case TSON_IDENTIFIER__Str: return gStr();
            case TSON_IDENTIFIER__Ref: return refDictionary[gPB128()];

            case TSON_IDENTIFIER__ObS:
                const obj: Record<string, any> = {};
                refDictionary.push(obj);
                while (1) {
                    const keyId = gPB128();
                    let key: string;
                    if (keyId === TSON_IDENTIFIER__ObE) return obj;
                    if (keyId === TSON_IDENTIFIER__ObP) {
                        key = gStr();
                        // ld.add(key)
                        ld.push(key);
                    } else {
                        key = dictionary.key(keyId);
                        // if (key === undefined) key = ld.key(keyId);
                        if (key === undefined) key = ld[keyId];
                    }
                    obj[key] = toJSON(data, ld, refDictionary);
                }
        
            case TSON_IDENTIFIER__ArS:
                const array: any = [];
                refDictionary.push(array);
                while (1) {
                    value = toJSON(data, ld, refDictionary);
                    if (value === Array) return array;
                    array.push(value);
                }

            case TSON_IDENTIFIER__ArE: return Array;
            default:
                throwError(ERROR_TSON_IMPROPER_IDENTIFIER, instruction)
        }
    }
    return { make, toJSON, addToDictionary }
}
