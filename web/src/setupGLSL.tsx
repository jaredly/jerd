// ugh

const createShader = (
    gl: WebGL2RenderingContext,
    kind: number,
    source: string,
) => {
    const shader = gl.createShader(kind);
    if (!shader) {
        throw new Error(`no shader`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error(`Not compiled`);
    }

    return shader;
};

const defaultVertextShader = `#version 300 es
layout (location=0) in vec4 position;

void main() {
    gl_Position = position;
}`;

// Many thanks to https://github.com/tsherif/webgl2examples/
export const setup = (gl: WebGL2RenderingContext, fragmentShader: string) => {
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
    gl.useProgram(program);
    gl.deleteShader(fragment);
    gl.deleteShader(vertex);

    const utime = gl.getUniformLocation(program, 'u_time');
    gl.uniform1f(utime, 0.0);

    const uresolution = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(uresolution, gl.canvas.width, gl.canvas.height);

    var triangleArray = gl.createVertexArray();
    gl.bindVertexArray(triangleArray);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    return (uTime: number) => {
        gl.uniform1f(utime, uTime);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
};

const bl = [-1.0, -1.0, 0.0];
const br = [1.0, -1.0, 0.0];
const tr = [1.0, 1.0, 0.0];
const tl = [-1.0, 1.0, 0.0];

var positions = new Float32Array(bl.concat(br, tr, bl, tr, tl));
