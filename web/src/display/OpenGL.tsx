// This is the fake one?

import * as React from 'react';
import {
    Env,
    Term,
    Type,
    TypeReference,
    UserReference,
} from '@jerd/language/src/typing/types';
import {
    builtinType,
    int,
    pureFunction,
    refType,
} from '@jerd/language/src/typing/preset';
import { EvalEnv, Plugins, PluginT } from '../State';
import { hashObject, idFromName, idName } from '@jerd/language/src/typing/env';
import { wrapWithExecutaionLimit } from './Drawable';
import { generateShader } from '@jerd/language/src/printing/glslPrinter';
import { setup } from '../setupGLSL';

type GLSLEnv = {
    type: 'GLSLEnv';
    time: number;
    resolution: Vec2;
    camera: Vec3;
    mouse: Vec2;
};
type Vec2 = { type: 'Vec2'; x: number; y: number };
type Vec3 = { type: 'Vec3'; x: number; y: number; z: number };

type OpenGLFn = (glslEnv: GLSLEnv, fragCoord: Vec2) => any;

const drawToCanvas = (
    ctx: CanvasRenderingContext2D,
    fn: OpenGLFn,
    env: GLSLEnv,
) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const w = 20;
    const h = 20;

    const dx = ctx.canvas.width / w;
    const dy = ctx.canvas.height / h;
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            const color = fn(env, { type: 'Vec2', x: x * dx, y: y * dy });
            ctx.fillStyle = `rgba(${color.x * 255},${color.y * 255},${
                color.z * 255
            },${color.w})`;
            ctx.fillRect(x * dx, y * dy, dx, dy);
        }
    }
};

const newGLSLEnv = (ctx: CanvasRenderingContext2D): GLSLEnv => ({
    type: 'GLSLEnv',
    time: 0,
    resolution: {
        type: 'Vec2',
        x: ctx.canvas.width,
        y: ctx.canvas.height,
    },
    camera: { type: 'Vec3', x: 1.0, y: 0.0, z: 0.0 },
    mouse: {
        type: 'Vec2',
        x: ctx.canvas.width / 2,
        y: ctx.canvas.height / 2,
    },
});

const ShaderCPU = ({ fn, evalEnv }: { fn: OpenGLFn; evalEnv: EvalEnv }) => {
    const canvasRef = React.useRef(null as null | HTMLCanvasElement);
    const [paused, setPaused] = React.useState(false);
    // const [data, setData] = React.useState([]);
    const [error, setError] = React.useState(null as any | null);

    const wrapped = React.useMemo(() => wrapWithExecutaionLimit(evalEnv, fn), [
        fn,
    ]);
    const fc = React.useRef(wrapped);
    fc.current = wrapped;

    React.useEffect(() => {
        if (paused) {
            return;
        }
        let env: GLSLEnv;

        let start = Date.now();
        const tid = setInterval(() => {
            if (!canvasRef.current) {
                return;
            }
            const ctx = canvasRef.current.getContext('2d')!;
            if (!env) {
                env = newGLSLEnv(ctx);
                canvasRef.current.addEventListener('mousemove', (evt) => {
                    const box = (evt.target as HTMLCanvasElement).getBoundingClientRect();
                    env.mouse.x = evt.clientX - box.left;
                    env.mouse.y = evt.clientY - box.top;
                });
            }
            env.time = (Date.now() - start) / 1000;
            try {
                drawToCanvas(ctx, fc.current, env);
            } catch (err) {
                clearInterval(tid);
                setError(err);
            }
        }, 40);
        return () => clearInterval(tid);
    }, [paused]);

    if (error != null) {
        return (
            <div
                style={{
                    whiteSpace: 'pre-wrap',
                }}
            >
                {error.message}
            </div>
        );
    }

    return <canvas ref={canvasRef} width="200" height="200" />;
};

const compileGLSL = (term: Term, env: Env) => {
    const termId = { hash: hashObject(term), size: 1, pos: 0 };
    return generateShader(
        env,
        { includeCanonicalNames: true, showAllUniques: true },
        {},
        termId,
        [],
    );
};

const ShaderGLSL = ({ term, env }: { term: Term; env: Env }) => {
    const [canvas, setCanvas] = React.useState(
        null as null | HTMLCanvasElement,
    );
    const [paused, setPaused] = React.useState(false);
    const [error, setError] = React.useState(null as any | null);

    const shader = React.useMemo(() => {
        const id = { hash: hashObject(term), size: 1, pos: 0 };
        try {
            return compileGLSL(term, {
                ...env,
                global: {
                    ...env.global,
                    terms: {
                        ...env.global.terms,
                        [idName(id)]: term,
                    },
                },
            });
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, [term]);
    const fc = React.useRef(shader);
    fc.current = shader;

    const timer = React.useRef(0);

    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const currentMousePos = React.useRef(mousePos);
    currentMousePos.current = mousePos;

    React.useEffect(() => {
        if (!canvas || paused || !shader) {
            return;
        }
        const ctx = canvas.getContext('webgl2');
        if (!ctx) {
            return;
        }
        try {
            const update = setup(
                ctx,
                shader.text,
                timer.current,
                currentMousePos.current,
            );
            let tid: any;
            let last = Date.now();
            const fn = () => {
                const now = Date.now();
                timer.current += (now - last) / 1000;
                last = now;
                update(timer.current, currentMousePos.current);
                tid = requestAnimationFrame(fn);
            };
            tid = requestAnimationFrame(fn);
            return () => cancelAnimationFrame(tid);
        } catch (err) {
            setError(err);
        }
    }, [canvas, shader, paused]);

    if (error != null) {
        return (
            <div>
                <div
                    style={{
                        padding: 4,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        backgroundColor: '#300',
                    }}
                >
                    {error.message}
                </div>
                {shader != null ? (
                    <pre
                        style={{
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {shader.text}
                    </pre>
                ) : null}
            </div>
        );
    }

    return (
        <div>
            <canvas
                onClick={() => setPaused(!paused)}
                onMouseMove={(evt) => {
                    const box = (evt.target as HTMLCanvasElement).getBoundingClientRect();
                    setMousePos({
                        x: (evt.clientX - box.left) * 2,
                        y: (box.height - (evt.clientY - box.top)) * 2,
                    });
                }}
                ref={(node) => {
                    if (node && !canvas) {
                        setCanvas(node);
                    }
                }}
                style={{
                    width: 200,
                    height: 200,
                }}
                // Double size for retina
                width="400"
                height="400"
            />
        </div>
    );
};

const plugins: Plugins = {
    // openglFake: {
    //     id: 'opengl-fake',
    //     name: 'Shader CPU',
    // },
    openglBuffer1: {
        id: 'opengl',
        name: 'Shader GLSL',
        type: builtinType('Tuple2', [
            pureFunction(
                [
                    refType('451d5252'),
                    refType('43802a16'),
                    builtinType('sampler2D'),
                ],
                refType('3b941378'),
            ),
            pureFunction(
                [
                    refType('451d5252'),
                    refType('43802a16'),
                    builtinType('sampler2D'),
                ],
                refType('3b941378'),
            ),
        ]),
        render: (fn: OpenGLFn, evalEnv: EvalEnv, env: Env, term: Term) => {
            // return <div>Ok folks</div>;
            return <ShaderGLSL env={env} term={term} />;
        },
    },
    opengl: {
        id: 'opengl',
        name: 'Shader GLSL',
        type: pureFunction(
            [refType('451d5252'), refType('43802a16')],
            refType('3b941378'),
        ),
        render: (fn: OpenGLFn, evalEnv: EvalEnv, env: Env, term: Term) => {
            // return <div>Ok folks</div>;
            return <ShaderGLSL env={env} term={term} />;
        },
    },
    'opengl-fake': {
        id: 'opengl-fake',
        name: 'Shader CPU',
        type: pureFunction(
            [refType('451d5252'), refType('43802a16')],
            refType('3b941378'),
        ),
        render: (fn: OpenGLFn, evalEnv: EvalEnv) => {
            // return <div>Hello fokls</div>;
            return <ShaderCPU fn={fn} evalEnv={evalEnv} />;
        },
    },
};
export default plugins;
