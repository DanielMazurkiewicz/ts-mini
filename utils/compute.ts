

// turbo.js
// (c) turbo - github.com/turbo
// MIT licensed

"use strict";


type TWebGL = WebGL2RenderingContext | WebGLRenderingContext;

var attrs = {
    alpha : false,
    antialias : false
};

var vertexShaderCode = `
attribute vec2 position;
varying vec2 pos;
attribute vec2 texture;

void main(void) {
  pos = texture;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

var stdlib = `

precision mediump float;
uniform sampler2D u_texture;
varying vec2 pos;

vec4 read(void) {
  return texture2D(u_texture, pos);
}

void commit(vec4 val) {
  gl_FragColor = val;
}

// user code begins here
`;


const getContext = (canvas: HTMLCanvasElement, ctx: string) => {
    return canvas.getContext(ctx, attrs);
}

const getWebGL = (canvas = document.createElement('canvas')): TWebGL => {

    let gl = <WebGL2RenderingContext>getContext(canvas, "webgl2");

    if (gl) {
        // @ts-ignore
        gl.gl2 = true;
        return gl;
    }

    // Try to grab the standard context. If it fails, fallback to experimental.
    return <WebGLRenderingContext>(getContext(canvas, "webgl") || getContext(canvas, "experimental-webgl"));
}


// Transfer data onto clamped texture and turn off any filtering
function createTexture(gl: TWebGL, data: ArrayBufferView, size: number) {
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.FLOAT, data);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}

const getShader = (gl: TWebGL, code: string, type = gl.VERTEX_SHADER) => {
    const shader = <WebGLShader>gl.createShader(type);
    // @ts-ignore
    gl.shaderSource(shader, code);
    // @ts-ignore
    gl.compileShader(shader);
    return shader;
}

const getProgram = (gl: TWebGL, ...shaders: WebGLShader[]) => {
    const program = <WebGLProgram>gl.createProgram();
    for (let i = 0; i < shaders.length; i ++) {
        gl.attachShader(program, shaders[i]);
    }
    gl.linkProgram(program);
    return program;
}

// GPU texture buffer from JS typed array
function newBuffer(gl: TWebGL, data: number[], f?: Uint16ArrayConstructor, e = gl.ARRAY_BUFFER) {
    var buf = gl.createBuffer();
    gl.bindBuffer(e, buf);
    gl.bufferData(e, new (f || Float32Array)(data), gl.STATIC_DRAW);
    return buf;
}



function builder(gl: TWebGL, code: string) {


    // turbo.js requires a 32bit float vec4 texture. Some systems only provide 8bit/float
    // textures. A workaround is being created, but turbo.js shouldn't be used on those
    // systems anyway.
    // @ts-ignore
    if (!gl.gl2 && !gl.getExtension('OES_texture_float'))
        throw new Error('turbojs: Required texture format OES_texture_float not supported.');

    var positionBuffer = newBuffer(gl, [ -1, -1, 1, -1, 1, 1, -1, 1 ]);
    var textureBuffer  = newBuffer(gl, [  0,  0, 1,  0, 1, 1,  0, 1 ]);
    var indexBuffer    = newBuffer(gl, [  1,  2, 0,  3, 0, 2 ], Uint16Array, gl.ELEMENT_ARRAY_BUFFER);


    const vertexShader = getShader(gl, vertexShaderCode);

    // This should not fail.
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
        throw new Error(
            "\nturbojs: Could not build internal vertex shader (fatal).\n" + "\n" +
            "INFO: >REPORT< THIS. That's our fault!\n" + "\n" +
            "--- CODE DUMP ---\n" + vertexShaderCode + "\n\n" +
            "--- ERROR LOG ---\n" + gl.getShaderInfoLog(vertexShader)
        );


    const fragmentShader = getShader(gl, stdlib + code, gl.FRAGMENT_SHADER);


    // Use this output to debug the shader
    // Keep in mind that WebGL GLSL is **much** stricter than e.g. OpenGL GLSL
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        var LOC = code.split('\n');
        var dbgMsg = "ERROR: Could not build shader (fatal).\n\n------------------ KERNEL CODE DUMP ------------------\n";

        for (var nl = 0; nl < LOC.length; nl++)
            dbgMsg += (stdlib.split('\n').length + nl) + "> " + LOC[nl] + "\n";

        dbgMsg += "\n--------------------- ERROR  LOG ---------------------\n" + gl.getShaderInfoLog(fragmentShader);

        throw new Error(dbgMsg);
    }


    const program = getProgram(gl, vertexShader, fragmentShader)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error('turbojs: Failed to link GLSL program code.');

    var uTexture = gl.getUniformLocation(program, 'u_texture');
    var aPosition = gl.getAttribLocation(program, 'position');
    var aTexture = gl.getAttribLocation(program, 'texture');

    gl.useProgram(program);


    // run code against a pre-allocated array
    return function (ipt) {
        var size = Math.sqrt(ipt.data.length) / 4;
        var texture = createTexture(gl, ipt.data, size);

        gl.viewport(0, 0, size, size);
        gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());

        // Types arrays speed this up tremendously.
        var nTexture = createTexture(gl, new Float32Array(ipt.data.length), size);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, nTexture, 0);

        if (!gl.gl2) {
            // Test for mobile bug MDN->WebGL_best_practices, bullet 7
            var frameBufferStatus = (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE);

            if (!frameBufferStatus)
                throw new Error('turbojs: Error attaching float texture to framebuffer. Your device is probably incompatible. Error info: ' + frameBufferStatus.message);
        }


        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(uTexture, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.enableVertexAttribArray(aTexture);
        gl.vertexAttribPointer(aTexture, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        gl.readPixels(0, 0, size, size, gl.RGBA, gl.FLOAT, ipt.data);
        //                                 ^ 4 x 32 bit ^

        return ipt.data.subarray(0, ipt.length);
    }
}

export const build = builder

    // backward compatibility support
export const run = function(ipt, code) {
    builder(code)(ipt);
}

export const alloc = function(sz) {
    // A sane limit for most GPUs out there.
    // JS falls apart before GLSL limits could ever be reached.
    if (sz > 16777216)
        throw new Error("turbojs: Whoops, the maximum array size is exceeded!");

    var ns = Math.pow(Math.pow(2, Math.ceil(Math.log(sz) / 1.386) - 1), 2);
    return {
        data : new Float32Array(ns * 16),
        length : sz
    };
}



