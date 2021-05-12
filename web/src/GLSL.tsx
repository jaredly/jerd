// For GLSL goodness

import * as React from 'react';
import parse, { Toplevel } from '@jerd/language/src/parsing/parser';
import { typeFile } from '@jerd/language/src/typing/typeFile';
import { OutputOptions as IOutputOptions } from '@jerd/language/src/printing/ir/types';
import { newWithGlobal, Type } from '@jerd/language/src/typing/types';
import { loadBuiltins } from '@jerd/language/src/printing/loadBuiltins';
import { loadPrelude } from '@jerd/language/src/printing/loadPrelude';
import { OutputOptions } from '@jerd/language/src/printing/typeScriptPrinterSimple';
import { fileToGlsl } from '@jerd/language/src/printing/glslPrinter';
import { setup } from './setupGLSL';

const key = 'glsl-jerd';

const tsBuiltins = loadBuiltins();
const typedBuiltins: { [key: string]: Type } = {};
Object.keys(tsBuiltins).forEach((b) => {
    const v = tsBuiltins[b];
    if (v != null) {
        typedBuiltins[b] = v;
    }
});

const builtinNames = Object.keys(tsBuiltins);
const initialGlobal = loadPrelude(typedBuiltins);
const initialEnv = newWithGlobal(initialGlobal);

const defaultSource = `// Hello world

@ffi type Vec2 = {x: float, y: float}
@ffi type Vec3 = { ...Vec2, z: float}
@ffi type Vec4 = { ...Vec3, w: float}

@main
const justRed = (iTime: float, fragCoord: Vec2, iResolution: Vec2) => {
  Vec4{x: sin(iTime * 3.0) * 0.5 + 0.5, y: 1.0, z: 0.0, w: 1.0}
}
`;

export default () => {
    const [text, setText] = React.useState(
        () => window.localStorage.getItem(key) || defaultSource,
    );
    const [output, setOutput] = React.useState('');

    const canvas = React.useRef(null);
    const sandboxRef = React.useRef(null);
    const updateRef = React.useRef(null);

    React.useEffect(() => {
        let t = 0;
        const fn = () => {
            t += 0.01;
            if (updateRef.current) {
                updateRef.current(t);
            }
            rid = requestAnimationFrame(fn);
        };
        let rid = requestAnimationFrame(fn);
        return () => cancelAnimationFrame(rid);
    }, []);

    React.useEffect(() => {
        const tid = setTimeout(() => {
            const parsed: Array<Toplevel> = parse(text);

            const { expressions, env } = typeFile(
                parsed,
                initialEnv,
                'sandbox.jd',
            );
            const irOpts: IOutputOptions = {
                explicitHandlerFns: false,
            };
            const oopts: OutputOptions = {
                optimize: true,
                optimizeAggressive: true,
                showAllUniques: true,
            };

            const pp = fileToGlsl(
                expressions,
                env,
                oopts,
                irOpts,
                false,
                true,
                builtinNames,
            );
            setOutput(pp);
            const update = setup(sandboxRef.current, pp);
            updateRef.current = update;
            // const string_vert_code = `#version 300 es
            // #ifdef GL_ES
            // precision mediump float;
            // #endif
            // in vec2 a_position;
            // in vec2 a_texcoord;
            // out vec2 v_texcoord;
            // out vec2 v_position;
            // void main() {
            //     v_position = a_position;
            //     v_texcoord = a_texcoord;
            // }`;

            // const string_vert_code = `#version 300 es
            // precision mediump float;
            // in vec4 a_position;
            // in vec4 a_normal;
            // in vec2 a_texcoord;
            // in vec4 a_color;
            // out vec4 v_position;
            // out vec4 v_normal;
            // out vec2 v_texcoord;
            // out vec4 v_color;

            // // in vec4 a_position;
            // // out vec4 Position;
            // void main(){
            //     v_position = a_position;
            // }
            // `;

            // sandboxRef.current.load(pp);
        }, 100);
        return () => clearTimeout(tid);
    }, [text]);

    React.useEffect(() => {
        if (!canvas.current) {
            return console.error('npe');
        }
        const gl = canvas.current.getContext('webgl2');
        // // @ts-ignore
        // const sandbox = new window.glsl.Canvas(canvas.current);
        // // @ts-ignore
        // const sandbox = new window.GlslCanvas(canvas.current);
        const defaultFrag = `#version 300 es

precision mediump float;

out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    fragColor = vec4(1.00000, 1.00000, 0.00000, 1.00000);
}`;
        // const string_frag_code =
        //     'void main(){\ngl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\n}\n';
        setup(gl, defaultFrag);
        // sandbox.load(string_frag_code);
        sandboxRef.current = gl;
    }, []);

    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <div>
                <textarea
                    style={{ minWidth: 600, minHeight: 400 }}
                    value={text}
                    onChange={(evt) => {
                        setText(evt.target.value);
                        window.localStorage.setItem(key, evt.target.value);
                    }}
                />
                <div
                    style={{
                        color: 'white',
                        fontFamily: 'monospace',
                        padding: 8,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {output}
                </div>
            </div>
            <div>
                <canvas
                    style={{ width: 400, height: 400 }}
                    width={800}
                    height={800}
                    ref={canvas}
                />
            </div>
        </div>
    );
};
