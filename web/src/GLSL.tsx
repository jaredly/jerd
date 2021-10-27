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
import { runTerm } from './eval';
import {
    idFromName,
    idName,
    termForIdRaw,
} from '@jerd/language/src/typing/env';
import * as builtins from '@jerd/language/src/printing/builtins';

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

type Vec2 = { type: 'Vec2'; x: number; y: number };

type Hover = {
    text: string;
    x: number;
    y: number;
    pos: Vec2;
};

const printResult = (value: any): string => {
    if (value == null) {
        return `null`;
    }
    if (typeof value === 'number') {
        return value.toFixed(4);
    }
    if (typeof value === 'object') {
        if (value.type === 'Vec2') {
            return `(${printResult(value.x)}, ${printResult(value.y)})`;
        }
        if (value.type === 'Vec3') {
            return `(${printResult(value.x)}, ${printResult(
                value.y,
            )}, ${printResult(value.z)})`;
        }
        if (value.type === 'Vec4') {
            return `(${printResult(value.x)}, ${printResult(
                value.y,
            )}, ${printResult(value.z)}, ${printResult(value.w)})`;
        }
    }
    return JSON.stringify(value);
};

export default () => {
    const [text, setText] = React.useState(
        () => window.localStorage.getItem(key) || defaultSource,
    );
    const [output, setOutput] = React.useState('');
    const [hover, setHover] = React.useState(null as Hover | null);

    const currentHover = React.useRef(hover);
    currentHover.current = hover;
    const canvas = React.useRef(null as null | HTMLCanvasElement);
    const sandboxRef = React.useRef(null as null | WebGL2RenderingContext);
    const updateRef = React.useRef(null);
    const jsRef = React.useRef(
        null as null | ((v: number, pos: Vec2, size: Vec2) => any),
    );
    const currentTime = React.useRef(0.0);

    const [isRunning, setIsRunning] = React.useState(true);

    React.useEffect(() => {
        if (!isRunning) {
            return;
        }
        let start = Date.now();
        const fn = () => {
            currentTime.current += (Date.now() - start) / 1000;
            start = Date.now();
            if (updateRef.current) {
                // @ts-ignore
                updateRef.current(currentTime.current);
                if (currentHover.current) {
                    const fn = jsRef.current;
                    if (!fn) {
                        return;
                    }
                    const box = canvas.current!.getBoundingClientRect();
                    const value = fn(
                        currentTime.current,
                        currentHover.current.pos,
                        {
                            type: 'Vec2',
                            x: box.width * 2,
                            y: box.height * 2,
                        },
                    );
                    setHover({
                        ...currentHover.current,
                        text: printResult(value),
                    });
                }
            }
            rid = requestAnimationFrame(fn);
        };
        let rid = requestAnimationFrame(fn);
        return () => cancelAnimationFrame(rid);
    }, [isRunning]);

    React.useEffect(() => {
        const tid = setTimeout(() => {
            const parsed: Array<Toplevel> = parse(text);

            let res;
            try {
                res = typeFile(parsed, initialEnv, 'sandbox.jd');
            } catch (err) {
                console.error(err);
                console.error(err.toString());
                console.log(err);
                return;
            }
            const { expressions, env } = res;
            const irOpts: IOutputOptions = {
                explicitHandlerFns: false,
            };
            const oopts: OutputOptions = {
                optimize: true,
                optimizeAggressive: true,
                showAllUniques: true,
            };

            const mains = Object.keys(env.global.metaData).filter((k) =>
                env.global.metaData[k].tags.includes('main'),
            );
            if (!mains.length) {
                console.error('No `main` found');
                return;
            }
            const main = idFromName(mains[0]);
            // @ts-ignore
            const evalEnv = (window.evalEnv = {
                builtins,
                terms: {},
                executionLimit: { ticks: 0, maxTime: 0, enabled: false },
                traceObj: { traces: null },
            });

            const result = runTerm(
                env,
                termForIdRaw(env, mains[0]),
                main,
                evalEnv,
                false,
            );
            const fn = result[idName(main)];
            // console.log(fn);
            jsRef.current = fn;

            const pp = fileToGlsl(
                expressions,
                env,
                oopts,
                irOpts,
                // false,
                // true,
                // builtinNames,
            );
            setOutput(pp.text);
            // @ts-ignore
            const update = setup(sandboxRef.current, pp, currentTime.current);
            // @ts-ignore
            updateRef.current = update;
        }, 100);
        return () => clearTimeout(tid);
    }, [text]);

    React.useEffect(() => {
        if (!canvas.current) {
            return console.error('npe');
        }
        const gl = canvas.current.getContext('webgl2');
        if (!gl) {
            throw new Error(`No webgl2 sorry`);
        }
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
        setup(gl, defaultFrag, 0.0);
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
                    onClick={(evt) => setIsRunning(!isRunning)}
                    onMouseLeave={(evt) => {
                        setHover(null);
                    }}
                    onMouseMove={(evt) => {
                        // START HERE:
                        // Ok folks, what we really want is a `trace!()` macro
                        // that will populate this hover dealio as we mouse around
                        // so that we can real-time introspect what's going on
                        // yes that's right my good folks.
                        // all the good stuff, right here.
                        const box = evt.currentTarget.getBoundingClientRect();
                        const dx = evt.clientX - box.left;
                        const dy = box.height - (evt.clientY - box.top);
                        const pos: Vec2 = {
                            type: 'Vec2',
                            x: dx * 2,
                            y: dy * 2,
                        };
                        const fn = jsRef.current;
                        if (!fn) {
                            return;
                        }
                        const value = fn(currentTime.current, pos, {
                            type: 'Vec2',
                            x: box.width * 2,
                            y: box.height * 2,
                        });
                        setHover({
                            text: printResult(value),
                            x: evt.clientX,
                            y: evt.clientY,
                            pos: pos,
                        });
                    }}
                />
                {hover ? (
                    <div
                        style={{
                            position: 'absolute',
                            fontFamily: 'monospace',
                            top: hover.y + 8,
                            left: hover.x + 8,
                            padding: 4,
                            opacity: 0.4,
                            backgroundColor: 'white',
                            border: '1px solid black',
                            pointerEvents: 'none',
                        }}
                    >
                        {hover.text}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
