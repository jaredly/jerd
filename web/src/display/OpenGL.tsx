// This is the fake one?
/* @jsx jsx */
import { jsx } from '@emotion/react';
import { generateSingleShader } from '@jerd/language/src/printing/glslPrinter';
import { hashObject, idName } from '@jerd/language/src/typing/env';
import {
    builtinType,
    pureFunction,
    refType,
} from '@jerd/language/src/typing/preset';
import { Env, Id, Term } from '@jerd/language/src/typing/types';
import * as React from 'react';
import { EvalEnv, RenderPlugins } from '../State';
import { OpenGLCanvas } from './OpenGLCanvas';
import { ShaderCPU } from './ShaderCPU';
import { ShowTrace } from './ShowTrace';

export type GLSLEnv = {
    type: 'GLSLEnv';
    time: number;
    resolution: Vec2;
    camera: Vec3;
    mouse: Vec2;
};
export type Vec2 = { type: 'Vec2'; x: number; y: number };
export type Vec3 = { type: 'Vec3'; x: number; y: number; z: number };
export type Vec4 = { type: 'Vec4'; x: number; y: number; z: number; w: number };

export type OpenGLFn = (glslEnv: GLSLEnv, fragCoord: Vec2) => any;

export const newGLSLEnv = (canvas: HTMLCanvasElement): GLSLEnv => ({
    type: 'GLSLEnv',
    time: 0,
    resolution: {
        type: 'Vec2',
        x: canvas.width,
        y: canvas.height,
    },
    camera: { type: 'Vec3', x: 0.0, y: 0.0, z: -5.0 },
    mouse: {
        type: 'Vec2',
        x: canvas.width / 2,
        y: canvas.height / 2,
    },
});

export const compileGLSL = (
    term: Term,
    env: Env,
    buffers: number = 0,
    includeComments = true,
) => {
    const termId =
        term.type === 'ref' && term.ref.type === 'user'
            ? term.ref.id
            : { hash: hashObject(term), size: 1, pos: 0 };
    return generateSingleShader(
        env,
        { includeCanonicalNames: true, showAllUniques: false },
        {},
        termId,
        buffers,
        includeComments,
    );
};

export const envWithTerm = (env: Env, term: Term) => {
    const id = { hash: hashObject(term), size: 1, pos: 0 };
    return {
        ...env,
        global: {
            ...env.global,
            terms: {
                ...env.global.terms,
                [idName(id)]: term,
            },
        },
    };
};

const ShaderGLSLBuffers = ({
    fn,
    term,
    env,
    evalEnv,
    startPaused,
}: {
    fn: OpenGLFn;
    term: Term;
    env: Env;
    evalEnv: EvalEnv;
    startPaused: boolean;
}) => {
    const [error, setError] = React.useState(null as any | null);

    const shaders = React.useMemo(() => {
        if (term.is.type === 'lambda') {
            try {
                return [compileGLSL(term, envWithTerm(env, term), 0)];
            } catch (err) {
                console.error(err);
                setError(err);
                return null;
            }
        }
        // TODO: it would be really nice to be able to lift this restriction.
        // Something like "inline this until we have a literal"?
        // Although maybe I'd actually want to do that at the Term level
        // instead of IR? hmmmmmmmmmmmmmmmm
        // oh I dunno. because if it evaluates to like, a block ...
        // hmm.
        // ok maybe I'd just throw everything I have at it, take the result
        // and do `.0` or `.1` or so, and see if it ends up being good.
        // I'd have to make tuple constant folding happen, but that doesn't sound too bad.
        // Also inlining of "anything that returns anything that contains a function",
        // instead of just "returns a function".
        if (term.type !== 'Tuple') {
            const err = new Error(`Expression must be a tuple literal`);
            console.error();
            setError(err);
            return null;
        }
        try {
            return term.items.map((item) =>
                compileGLSL(
                    item,
                    envWithTerm(env, item),
                    term.items.length - 1,
                ),
            );
        } catch (err) {
            console.error(err);
            setError(err);
            return null;
        }
    }, [term]);

    const onTrace = React.useCallback(
        (mousePos, time, canvas) => {
            const hash = hashObject(term);
            const id: Id = { hash, size: 1, pos: 0 };
            // const fn = evalEnv.terms[idName(id)];
            if (typeof fn !== 'function') {
                console.log('not a function', fn);
                return null;
            }

            const glEnv = newGLSLEnv(canvas);
            glEnv.time = time;

            const old = evalEnv.traceObj.traces;
            const traces = (evalEnv.traceObj.traces = {});
            const color = fn(glEnv, {
                type: 'Vec2',
                x: mousePos.x,
                y: mousePos.y,
            });
            evalEnv.traceObj.traces = old;
            return { color, traces };
        },
        [term],
    );

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
                    {error.message + '\n' + error.stack}
                </div>
                {shaders != null ? (
                    <pre
                        style={{
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {error.shader ? error.shader : shaders[0].text}
                    </pre>
                ) : null}
            </div>
        );
    }

    if (shaders == null) {
        return <div>No shaders!!</div>;
    }

    return (
        <OpenGLCanvas
            onTrace={onTrace}
            shaders={shaders.map((shader) => shader.text)}
            startPaused={startPaused}
            onError={setError}
            renderTrace={(traceValue, mousePos) => (
                <ShowTrace trace={traceValue} env={env} pos={mousePos} />
            )}
        />
    );
};

const shaderFunction = (buffers: number) => {
    const args = [refType('451d5252'), refType('43802a16')];
    for (let i = 0; i < buffers; i++) {
        args.push(builtinType('sampler2D'));
    }
    return pureFunction(args, refType('3b941378'));
};

const plugins: RenderPlugins = {
    openglBuffer1: {
        id: 'opengl1',
        name: 'Shader GLSL',
        type: builtinType('Tuple2', [shaderFunction(1), shaderFunction(1)]),
        render: (
            fn: OpenGLFn,
            evalEnv: EvalEnv,
            env: Env,
            term: Term,
            startPaused: boolean,
        ) => {
            return (
                <ShaderGLSLBuffers
                    fn={fn}
                    env={env}
                    evalEnv={evalEnv}
                    term={term}
                    startPaused={startPaused}
                />
            );
        },
    },
    openglBuffer2: {
        id: 'opengl2',
        name: 'Shader GLSL',
        type: builtinType('Tuple3', [
            shaderFunction(2),
            shaderFunction(2),
            shaderFunction(2),
        ]),
        render: (
            fn: OpenGLFn,
            evalEnv: EvalEnv,
            env: Env,
            term: Term,
            startPaused: boolean,
        ) => {
            return (
                <ShaderGLSLBuffers
                    fn={fn}
                    env={env}
                    evalEnv={evalEnv}
                    term={term}
                    startPaused={startPaused}
                />
            );
        },
    },
    opengl: {
        id: 'opengl',
        name: 'Shader GLSL',
        type: pureFunction(
            [refType('451d5252'), refType('43802a16')],
            refType('3b941378'),
        ),
        render: (
            fn: OpenGLFn,
            evalEnv: EvalEnv,
            env: Env,
            term: Term,
            startPaused: boolean,
        ) => {
            // return <div>Ok folks</div>;
            return (
                <ShaderGLSLBuffers
                    fn={fn}
                    env={env}
                    evalEnv={evalEnv}
                    term={term}
                    startPaused={startPaused}
                />
            );
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
            return <ShaderCPU fn={fn} evalEnv={evalEnv} />;
        },
    },
};
export default plugins;
