// ugh

import {
    Env,
    idsEqual,
    Reference,
    refsEqual,
} from '../../language/src/typing/types';
import { Vec2, Vec3, Vec4 } from './display/OpenGL';

const createShader = (
    gl: WebGL2RenderingContext,
    kind: number,
    source: string,
) => {
    const shader = gl.createShader(kind);
    if (!shader) {
        // TODO: Indicate in the UI that this is probably just the browser limiting stuff
        throw new Error(`no shader`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        const error = gl.getShaderInfoLog(shader);
        // console.error(error);
        gl.deleteShader(shader);
        const err = new Error(`Not compiled: ` + error);
        // @ts-ignore
        err.shader = source;
        throw err;
    }

    return shader;
};

const makeTextureAndStuff = (
    gl: WebGL2RenderingContext,
    i: number,
    textures: Array<BufferInfo>,
): BufferInfo => {
    if (textures[i]) {
        return textures[i];
    }
    const targetTextureWidth = gl.canvas.width;
    const targetTextureHeight = gl.canvas.height;
    const texture = gl.createTexture();
    // if (!texture) {
    //     throw new Error(`Unable to make texture`);
    // }
    // textures[i] = texture;
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        targetTextureWidth,
        targetTextureHeight,
        border,
        format,
        type,
        data,
    );

    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Create and bind the framebuffer
    const fb = gl.createFramebuffer();
    // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // gl.framebufferTexture2D(
    //     gl.FRAMEBUFFER,
    //     gl.COLOR_ATTACHMENT0,
    //     gl.TEXTURE_2D,
    //     texture,
    //     level,
    // );

    textures[i] = { fb: fb!, texture: texture!, i };
    return textures[i];
};

const defaultVertextShader = `#version 300 es
layout (location=0) in vec4 position;

void main() {
    gl_Position = position;
}`;

export type BufferInfo = {
    fb: WebGLFramebuffer;
    texture: WebGLTexture;
    i: number;
};

// Many thanks to https://github.com/tsherif/webgl2examples/
export const setup = (
    gl: WebGL2RenderingContext,
    fragmentShader: string,
    currentTime: number,
    mousePos?: { x: number; y: number; button: number },
    state?: { value: unknown; type: Reference; env: Env },
    bufferShaders: Array<string> = [],
    textures: Array<BufferInfo> = [],
) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    const vertex = createShader(gl, gl.VERTEX_SHADER, defaultVertextShader);
    const program = gl.createProgram();
    if (!program) {
        throw new Error(`No program`);
    }
    gl.attachShader(program, fragment);
    gl.attachShader(program, vertex);
    gl.linkProgram(program);
    gl.validateProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error('Failed ot link');
    }
    gl.deleteShader(fragment);
    gl.deleteShader(vertex);

    type Bound = {
        utime: WebGLUniformLocation;
        umouse: WebGLUniformLocation;
        umousebutton: WebGLUniformLocation;
        ustate: null | ((value: unknown) => void);
        textureLocs: Array<WebGLUniformLocation>;
    };

    const bindUniforms = (program: WebGLProgram): Bound => {
        const textureLocs: Array<WebGLUniformLocation> = [];
        for (let i = 0; i < bufferShaders.length; i++) {
            const loc = gl.getUniformLocation(program, `u_buffer${i}`);
            gl.uniform1i(loc, i);
            textureLocs.push(loc!);
        }

        const utime = gl.getUniformLocation(program, 'u_time')!;
        gl.uniform1f(utime, currentTime);

        const uresolution = gl.getUniformLocation(program, 'u_resolution');
        gl.uniform2f(uresolution, gl.canvas.width, gl.canvas.height);

        const umousebutton = gl.getUniformLocation(program, 'u_mousebutton')!;
        if (mousePos) {
            gl.uniform1i(umousebutton, mousePos.button);
        }

        const umouse = gl.getUniformLocation(program, 'u_mouse')!;
        if (mousePos) {
            gl.uniform2f(umouse, mousePos.x, mousePos.y);
        }

        let ustate = null;
        if (state) {
            ustate = getStateLocations(
                gl,
                program,
                state.env,
                state.type,
                // state.value,
            );
            if (ustate) {
                ustate(state.value);
            }
        }

        return { utime, umouse, umousebutton, textureLocs, ustate };
    };

    const bufferPrograms = bufferShaders.map((fragmentShader) => {
        const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
        const vertex = createShader(gl, gl.VERTEX_SHADER, defaultVertextShader);
        const program = gl.createProgram();
        if (!program) {
            throw new Error(`No program`);
        }
        gl.attachShader(program, fragment);
        gl.attachShader(program, vertex);
        gl.linkProgram(program);
        gl.validateProgram(program);
        const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            throw new Error('Failed ot link');
        }
        gl.deleteShader(fragment);
        gl.deleteShader(vertex);
        gl.useProgram(program);
        return { program, bound: bindUniforms(program) };
    });

    let frameBuffers: Array<BufferInfo> = [];
    let backBuffers: Array<BufferInfo> = [];

    for (let i = 0; i < bufferShaders.length; i++) {
        frameBuffers.push(makeTextureAndStuff(gl, i, textures));
        backBuffers.push(
            makeTextureAndStuff(gl, bufferShaders.length + i, textures),
        );
    }

    const swap = () => {
        const tmp = frameBuffers;
        frameBuffers = backBuffers;
        backBuffers = tmp;
    };

    gl.useProgram(program);
    const bound = bindUniforms(program);

    var triangleArray = gl.createVertexArray();
    gl.bindVertexArray(triangleArray);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    bufferPrograms.forEach(({ program, bound }, i) => {
        gl.useProgram(program);

        bound.textureLocs.forEach((loc, i) => {
            gl.uniform1i(loc, backBuffers[i].i);
        });

        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers[i].fb);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            frameBuffers[i].texture,
            0,
        );
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // const bound = bindUniforms(program);
    });

    gl.useProgram(program);

    bound.textureLocs.forEach((loc, i) => {
        gl.uniform1i(loc, frameBuffers[i].i);
    });

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // clear & draw
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    return (
        uTime: number,
        mousePos?: { x: number; y: number; button: number },
        state?: unknown,
    ) => {
        swap();
        if (bufferPrograms.length) {
            bufferPrograms.forEach(({ program, bound }, i) => {
                gl.useProgram(program);

                gl.uniform1f(bound.utime, uTime);

                if (mousePos) {
                    gl.uniform2f(bound.umouse, mousePos.x, mousePos.y);
                    gl.uniform1i(bound.umousebutton, mousePos.button);
                }

                if (state && bound.ustate) {
                    bound.ustate(state);
                }

                bound.textureLocs.forEach((loc, i) => {
                    gl.uniform1i(loc, backBuffers[i].i);
                });

                gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers[i].fb);
                gl.framebufferTexture2D(
                    gl.FRAMEBUFFER,
                    gl.COLOR_ATTACHMENT0,
                    gl.TEXTURE_2D,
                    frameBuffers[i].texture,
                    0,
                );
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            });

            gl.useProgram(program);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        gl.uniform1f(bound.utime, uTime);

        // TODO: Need to handle many different state types
        if (state && bound.ustate) {
            bound.ustate(state);
            // gl.uniform2f(bound.ustate, state.x, state.y);
        }

        if (mousePos) {
            gl.uniform2f(bound.umouse, mousePos.x, mousePos.y);
            gl.uniform1i(bound.umousebutton, mousePos.button);
        }

        bound.textureLocs.forEach((loc, i) => {
            gl.uniform1i(loc, frameBuffers[i].i);
        });

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
};

const bl = [-1.0, -1.0, 0.0];
const br = [1.0, -1.0, 0.0];
const tr = [1.0, 1.0, 0.0];
const tl = [-1.0, 1.0, 0.0];

var positions = new Float32Array(bl.concat(br, tr, bl, tr, tl));

export const getStateLocations = (
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    env: Env,
    type: Reference,
) => {
    if (type.type === 'builtin' && type.name === 'float') {
        const ustate = gl.getUniformLocation(program, 'u_state')!;
        return (newState: unknown) => {
            gl.uniform1f(ustate, newState as number);
        };
    } else if (type.type === 'builtin' && type.name === 'int') {
        const ustate = gl.getUniformLocation(program, 'u_state')!;
        return (newState: unknown) => {
            gl.uniform1i(ustate, newState as number);
        };
    } else if (refsEqual(type, Vec2.ref)) {
        const ustate = gl.getUniformLocation(program, 'u_state')!;
        return (newState: unknown) => {
            const state = newState as { type: 'Vec2'; x: number; y: number };
            gl.uniform2f(ustate, state.x, state.y);
        };
    } else if (refsEqual(type, Vec3.ref)) {
        const ustate = gl.getUniformLocation(program, 'u_state')!;
        return (newState: unknown) => {
            const state = newState as {
                type: 'Vec3';
                x: number;
                y: number;
                z: number;
            };
            gl.uniform3f(ustate, state.x, state.y, state.z);
        };
    } else if (refsEqual(type, Vec4.ref)) {
        const ustate = gl.getUniformLocation(program, 'u_state')!;
        return (newState: unknown) => {
            const state = newState as {
                type: 'Vec4';
                x: number;
                y: number;
                z: number;
                w: number;
            };
            gl.uniform4f(ustate, state.x, state.y, state.z, state.w);
        };
    } else {
        throw new Error('Unable to handle this kind of state');
    }
};
