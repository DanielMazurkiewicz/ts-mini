const isFloat32Buffer = new Float32Array(1);
export default (num: number) => {
    isFloat32Buffer[0] = num;
    const f32 = isFloat32Buffer[0];
    return f32 === num;
}