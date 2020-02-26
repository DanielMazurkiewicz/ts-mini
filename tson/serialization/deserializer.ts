import { V32, V16 } from '../../utils/binValues'
import throwError from '../../utils/throwError';
import { ERROR_DESERIALISER_GPB128_TOO_BIG } from '../../ERRORS';


export default (buffer: DataView) => {

    let cursor = 0;
        
    const gU08 = () => buffer.getUint8(cursor++);
    

    const gPB128 = () => {
        let result = 0;
        let weight = 1;
        let u08: number;
        let safety = 0;
        do {
            u08 = gU08();
            const value = u08 & 127;
            result += value * weight;
            weight *= 128;
            safety++;
            if (safety > 10) throwError(ERROR_DESERIALISER_GPB128_TOO_BIG)
        } while (u08 < 128)

        return result;
    }


    return {
        // Unsigned integer 8 bit
        gU08,
        
        // Unsigned integer 16 bit
        gU16: () => {
            const oldCursor = cursor;
            cursor+=2;
            return buffer.getUint16(oldCursor);
        },
        
        // Unsigned integer 24 bit
        gU24: () => {
            const oldCursor = cursor;
            cursor+=3;
            return buffer.getUint16(oldCursor) + (buffer.getUint8(oldCursor + 2) * V16)
        },
        
        // Unsigned integer 32 bit
        gU32: () => {
            const oldCursor = cursor;
            cursor+=4;
            return buffer.getUint32(oldCursor);
        },
        
        // Unsigned integer 40 bit
        gU40: () => {
            const oldCursor = cursor;
            cursor+=5;
            return buffer.getUint32(oldCursor) + (buffer.getUint8(oldCursor + 4) * V32)
        },
        
        // Unsigned integer 48 bit
        gU48: () => {
            const oldCursor = cursor;
            cursor+=6;
            return buffer.getUint32(oldCursor) + (buffer.getUint16(oldCursor + 4) * V32)
        },
        
        
        // Float 32 bit
        gF32: () => {
            const oldCursor = cursor;
            cursor+=4;
            return buffer.getFloat32(oldCursor);
        },
        
        gF64: () => {
            const oldCursor = cursor;
            cursor+=8;
            return buffer.getFloat64(oldCursor);
        },
        
        // Unsigned integer base 128
        gPB128,
        
        // Utf string base 128
        gStr: () => {
            const length = gPB128();
            const result = []
            for (let i = 0; i < length; i++) {
                result.push(String.fromCharCode(gPB128()));
            }
            return result.join('');
        },
        gBegin: (buf: DataView) => {
            cursor = 0;
            buffer = buf;
        }
    }

}
