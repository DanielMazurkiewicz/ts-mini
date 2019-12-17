import Serializer from './serialization/serializer'
import Deserializer from './serialization/deserializer'
import Dictionary, { IDictionary } from './dictionary'
import { V08, V16, V24, V32, V40, V48 } from './binValues'

const {
    pushF32,
    pushF64,
    pushPB128,
    pushStr,
    pushU08,
    pushU16,
    pushU24,
    pushU32,
    pushU40,
    pushU48,
    pushBegin,
    view
} = Serializer();

const {
    unshiftF32,
    unshiftF64,
    unshiftPB128,
    unshiftStr,
    unshiftU08,
    unshiftU16,
    unshiftU24,
    unshiftU32,
    unshiftU40,
    unshiftU48,
    unshiftBegin,
} = Deserializer(view());

const Nul = 0;
const Und = 1;
const Fal = 2;
const Tru = 3;
const Nan = 4;


const P08 = 5;  // Positive integer 8 bit
const P16 = 6;  // Positive integer 16 bit
const P24 = 7;  // Positive integer 24 bit
const P32 = 8;  // Positive integer 32 bit
const P40 = 9;  // Positive integer 40 bit
const P48 = 10;  // Positive integer 48 bit
const Pin = 11;  // Positive infinity


const N08 = 12;  // Negative integer 8 bit
const N16 = 13;  // Negative integer 16 bit
const N24 = 14;  // Negative integer 24 bit
const N32 = 15;  // Negative integer 32 bit
const N40 = 16;  // Negative integer 40 bit
const N48 = 17;  // Negative integer 48 bit
const Nin = 18;  // Negative infinity


const F32 = 19;
const F64 = 20;
const Str = 21;

const ArS = 22;  // Array start
const ArE = 23;  // Array end

const ObS = 24;  // Object start
const ObP = 0;   // Object property definition
const ObE = 1;   // Object end


const isFloat32Buffer = new Float32Array(1);
const isFloat32 = (num: number) => {
    isFloat32Buffer[0] = num;
    const f32 = isFloat32Buffer[0];
    return f32 === num;
}


const dictionary = Dictionary(2); // 0 and 1 are reserved for ObP and ObE

export const toTSON = (object: any, globalDictionary = dictionary, ld?: IDictionary) => {
    let localDictionary = ld;
    if (!localDictionary) {
        localDictionary = Dictionary(globalDictionary.length());
        pushBegin()
    }

    if (object === null) {
        pushU08(Nul);
    } else if (object === undefined) {
        pushU08(Und);
    } else if (typeof object === 'boolean') {
        object ? pushU08(Tru) : pushU08(Fal);
    } else if (typeof object === 'number') {
        const absolute = Math.abs(object);
        if (absolute < V48 && Number.isInteger(object)) { // save as integer value
            if (absolute < V32) { 
                if (absolute < V24) {
                    if (absolute < V08) {
                        pushU08(P08 + (object < 0 ? 6 : 0));
                        pushU08(absolute);
                    } else if (absolute < V16) {
                        pushU08(P16 + (object < 0 ? 6 : 0))                
                        pushU16(absolute);
                    } else {
                        pushU08(P24 + (object < 0 ? 6 : 0))                
                        pushU24(absolute);    
                    }
                } else {
                    pushU08(P32 + (object < 0 ? 6 : 0))                
                    pushU32(absolute);    
                }
            } else if (absolute < V40) {
                pushU08(P40 + (object < 0 ? 6 : 0))                
                pushU40(absolute);
            } else {
                pushU08(P48 + (object < 0 ? 6 : 0))                
                pushU48(absolute);
            }
        } else if (absolute === Infinity) {
            (object < 0) ? pushU08(Nin) : pushU08(Pin);
        } else { // save as float value
            if (isFloat32(object)) {
                pushU08(F32);
                pushF32(object)
            } else {
                pushU08(F64);
                pushF64(object)
            }
        }
    } else if (typeof object === 'string') {
        pushU08(Str);
        pushStr(object);
    } else if (object instanceof Array) {
        pushU08(ArS);
        for (let i = 0; i < object.length; i++) {
            toTSON(object[i], globalDictionary, localDictionary)
        }
        pushU08(ArE);
    } else { // object
        pushU08(ObS);
        for (let key in object) {
            const value = object[key];
            if (value !== undefined) {
                let keyId = globalDictionary.getId(key); // Check if exist in global dictionary
                if (keyId === undefined) {
                    keyId = localDictionary.getId(key);  // Check if was already added to local dictionary
                }
                
                if (keyId === undefined) { // if wasn't in local dictionary then add it and place full property details
                    localDictionary.add(key);
                    pushPB128(ObP);
                    pushStr(key);
                    
                } else {
                    pushPB128(keyId);
                }
                toTSON(value, globalDictionary, localDictionary)
            }        
        }
        pushPB128(ObE);
    }
    if (!ld) return view()
}


export const fromTSON = (data: DataView, globalDictionary = dictionary, rootLevel = true) => {
    if (rootLevel) unshiftBegin(data);
    let value: any;
    let instruction = unshiftU08();
    switch (instruction) {
        case Nul: return null;
        case Und: return undefined;
        case Fal: return false;
        case Tru: return true;
        case Nan: return NaN;

        case P08: return unshiftU08();
        case P16: return unshiftU16();
        case P24: return unshiftU24();
        case P32: return unshiftU32();
        case P40: return unshiftU40();
        case P48: return unshiftU48();
        case Pin: return Infinity;

        case N08: return -unshiftU08();
        case N16: return -unshiftU16();
        case N24: return -unshiftU24();
        case N32: return -unshiftU32();
        case N40: return -unshiftU40();
        case N48: return -unshiftU48();
        case Nin: return -Infinity;

        case F32: return unshiftF32();
        case F64: return unshiftF64();
        case Str: return unshiftStr();

        case ObS:
            return {}
        case ArS:
            const array: any = [];
            while (1) {
                value = fromTSON(data);
                if (value === Array) return array;
                array.push(value);
            }
        case ArE: return Array;
    }
}