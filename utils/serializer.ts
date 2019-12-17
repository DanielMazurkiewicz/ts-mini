import { V32 } from './binValues'


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
    
    const pushU08 = (value: number) => {
        const oldCursor = cursor;
        cursor++;
        if (cursor >= bufferSize) extendBuffer()
        buffer.setUint8(oldCursor, value);
    }

    const pushPB128 = (num: number) => {
        do {
            let toStore = num & 127;
            num = Math.floor(num / 128);
            pushU08(num ? toStore : toStore + 128);
        } while (num)
    }


    return {
        // Unsigned integer 8 bit
        pushU08,
        
        // Unsigned integer 16 bit
        pushU16: (value: number) => {
            const oldCursor = cursor;
            cursor+=2;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint16(oldCursor, value);
        },
        
        // Unsigned integer 24 bit
        pushU24: (value: number) => {
            const oldCursor = cursor;
            cursor+=4;
            if (cursor >= bufferSize) extendBuffer()
            cursor--;
            buffer.setUint32(oldCursor, value);
        },
        
        // Unsigned integer 32 bit
        pushU32: (value: number) => {
            const oldCursor = cursor;
            cursor+=4;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint32(oldCursor, value);
        },
        
        // Unsigned integer 40 bit
        pushU40: (value: number) => {
            const oldCursor = cursor;
            cursor+=5;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint32(oldCursor, value);
            buffer.setUint8(oldCursor, value / V32);
        },
        
        // Unsigned integer 48 bit
        pushU48: (value: number) => {
            const oldCursor = cursor;
            cursor+=6;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setUint32(oldCursor, value);
            buffer.setUint16(oldCursor, value / V32);
        },
        
        
        // Float 32 bit
        pushF32: (value: number) => {
            const oldCursor = cursor;
            cursor+=4;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setFloat32(oldCursor, value);
        },
        
        pushF64: (value: number) => {
            const oldCursor = cursor;
            cursor+=8;
            if (cursor >= bufferSize) extendBuffer()
            buffer.setFloat64(oldCursor, value);
        },
        
        // Unsigned integer base 128
        pushPB128,
        
        // Utf string base 128
        pushStr: (str: string) => {
            pushPB128(str.length);
            for (let i = 0; i < str.length; i++) {
                pushPB128(str.charCodeAt(i));
            }
        },
        begin: () => cursor = 0,
    }

}
