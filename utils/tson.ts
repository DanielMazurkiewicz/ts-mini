import Serializer from './serializer'
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
    begin,
    view
} = Serializer();

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

const N08 = 11;  // Negative integer 8 bit
const N16 = 12;  // Negative integer 16 bit
const N24 = 13;  // Negative integer 24 bit
const N32 = 14;  // Negative integer 32 bit
const N40 = 15;  // Negative integer 40 bit
const N48 = 16;  // Negative integer 48 bit


const F32 = 17;
const F64 = 18;
const Str = 19;

const ArS = 20;  // Array start
const ArE = 21;  // Array start

const ObS = 22;  // Object start
const ObP = 0;   // Object property definition
const ObE = 1;   // Object end


const isFloat32Buffer = new Float32Array(1);
const isFloat32 = (num: number) => (isFloat32Buffer[0] = num) === num;


const dictionary = Dictionary(2); // 0 and 1 are reserved for ObP and ObE

export const toTSON = (object: any, globalDictionary = dictionary, ld?: IDictionary) => {
    let localDictionary = ld;
    if (!localDictionary) {
        localDictionary = Dictionary(globalDictionary.length());
        begin()
    }

    if (object === null) {
        pushU08(Nul);
    } else if (object === undefined) {
        pushU08(Und);
    } else if (object === false) {
        pushU08(Fal);
    } else if (object === true) {
        pushU08(Tru);
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
    if (ld) return view()
}