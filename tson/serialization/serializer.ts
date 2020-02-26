import { V32, V16 } from '../../utils/binValues'


export default () => {
    let pageSize = 16384;
    let bufferSize = 0;
    let arrayBuffer: ArrayBuffer;
    let buffer: DataView;
    
    let cursor = 0;
    
    const extendBuffer = (size = pageSize) => {
        bufferSize += size;
        const oldBuffer = arrayBuffer;
        arrayBuffer = new ArrayBuffer(bufferSize);
        new Uint8Array(arrayBuffer).set(new Uint8Array(oldBuffer))
        buffer = new DataView(arrayBuffer);
    }
    
    const sU08 = (value: number) => {
        const oldCursor = cursor;
        cursor++;
        if (cursor >= bufferSize) extendBuffer()
        buffer.setUint8(oldCursor, value);
    }

    const sPB128 = (num: number) => {
        do {
            let toStore = num & 127;
            num = Math.floor(num / 128);
            sU08(num ? toStore : toStore + 128);
        } while (num)
    }


    return {
        // Unsigned integer 8 bit
        sU08,
        
        // Unsigned integer 16 bit
        sU16: (value: number) => {
            const oldCursor = cursor;
            cursor+=2;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint16(oldCursor, value);
        },
        
        // Unsigned integer 24 bit
        sU24: (value: number) => {
            const oldCursor = cursor;
            cursor+=3;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint16(oldCursor, value);
            buffer.setUint8(oldCursor + 2, value / V16);
        },
        
        // Unsigned integer 32 bit
        sU32: (value: number) => {
            const oldCursor = cursor;
            cursor+=4;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint32(oldCursor, value);
        },
        
        // Unsigned integer 40 bit
        sU40: (value: number) => {
            const oldCursor = cursor;
            cursor+=5;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint32(oldCursor, value);
            buffer.setUint8(oldCursor + 4, value / V32);
        },
        
        // Unsigned integer 48 bit
        sU48: (value: number) => {
            const oldCursor = cursor;
            cursor+=6;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint32(oldCursor, value);
            buffer.setUint16(oldCursor + 4, value / V32);
        },
        
        
        // Float 32 bit
        sF32: (value: number) => {
            const oldCursor = cursor;
            cursor+=4;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setFloat32(oldCursor, value);
        },
        
        sF64: (value: number) => {
            const oldCursor = cursor;
            cursor+=8;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setFloat64(oldCursor, value);
        },
        
        // Unsigned integer base 128
        sPB128,
        
        // Utf string base 128
        sStr: (str: string) => {
            sPB128(str.length);
            for (let i = 0; i < str.length; i++) {
                sPB128(str.charCodeAt(i));
            }
        },
        sBegin: () => cursor = 0,
        view: () => arrayBuffer && new DataView(arrayBuffer, 0, cursor)
    }

}
