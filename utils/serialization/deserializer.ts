import { V32, V16 } from '../binValues'
import throwError from '../throwError';


export default (buffer: DataView) => {

    let cursor = 0;
        
    const unshiftU08 = () => buffer.getUint8(cursor++);
    

    const unshiftPB128 = () => {
        let result = 0;
        let weight = 1;
        let u08: number;
        let safety = 0;
        do {
            u08 = unshiftU08();
            const value = u08 & 127;
            result += value * weight;
            weight *= 128;
            safety++;
            if (safety > 10) throwError(2)
        } while (u08 < 128)

        return result;
    }


    return {
        // Unsigned integer 8 bit
        unshiftU08,
        
        // Unsigned integer 16 bit
        unshiftU16: () => {
            const oldCursor = cursor;
            cursor+=2;
            return buffer.getUint16(oldCursor);
        },
        
        // Unsigned integer 24 bit
        unshiftU24: () => {
            const oldCursor = cursor;
            cursor+=3;
            return buffer.getUint16(oldCursor) + (buffer.getUint16(oldCursor + 2) * V16)
        },
        
        // Unsigned integer 32 bit
        unshiftU32: () => {
            const oldCursor = cursor;
            cursor+=4;
            return buffer.getUint32(oldCursor);
        },
        
        // Unsigned integer 40 bit
        unshiftU40: () => {
            const oldCursor = cursor;
            cursor+=5;
            return buffer.getUint32(oldCursor) + (buffer.getUint8(oldCursor + 4) * V32)
        },
        
        // Unsigned integer 48 bit
        unshiftU48: () => {
            const oldCursor = cursor;
            cursor+=6;
            return buffer.getUint32(oldCursor) + (buffer.getUint16(oldCursor + 4) * V32)
        },
        
        
        // Float 32 bit
        unshiftF32: () => {
            const oldCursor = cursor;
            cursor+=4;
            return buffer.getFloat32(oldCursor);
        },
        
        unshiftF64: () => {
            const oldCursor = cursor;
            cursor+=8;
            return buffer.getFloat64(oldCursor);
        },
        
        // Unsigned integer base 128
        unshiftPB128,
        
        // Utf string base 128
        unshiftStr: () => {
            const length = unshiftPB128();
            const result = []
            for (let i = 0; i < length; i++) {
                result.push(String.fromCharCode(unshiftPB128()));
            }
            return result.join('');
        },
        unshiftBegin: (buf: DataView) => {
            cursor = 0;
            buffer = buf;
        }
    }

}
