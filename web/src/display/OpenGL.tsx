// This is the fake one?
/* @jsx jsx */
import { jsx } from '@emotion/react';
import {
    generateSingleShader,
    GLSLEnvId,
} from '@jerd/language/src/printing/glslPrinter';
import { hashObject, idFromName, idName } from '@jerd/language/src/typing/env';
import {
    builtinType,
    pureFunction,
    refType,
} from '@jerd/language/src/typing/preset';
import {
    Env,
    Id,
    nullLocation,
    Reference,
    Term,
    Type,
} from '@jerd/language/src/typing/types';
import * as React from 'react';
import {
    GLSLEnv_id,
    GLSLSceneOld_id,
    Vec2_id,
    Vec3_id,
    Vec4_id,
} from '../../../language/src/printing/prelude-types';
import { LocatedError, TypeError } from '../../../language/src/typing/errors';
import { showLocation } from '../../../language/src/typing/typeExpr';
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
    stateUniform?: Reference,
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
        undefined,
        stateUniform,
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

export const getStateUniform = (term: Term): Reference | null => {
    if (
        term.is.type === 'ref' &&
        term.is.typeVbls.length === 1 &&
        term.is.typeVbls[0].type === 'ref'
    ) {
        if (term.is.typeVbls[0].typeVbls.length) {
            throw new Error(`state uniform can't be generic yet`);
        }
        return term.is.typeVbls[0].ref;
    }
    return null;
};

const ShaderGLSLScene = <T,>({
    value,
    term,
    env,
    evalEnv,
    startPaused,
}: {
    value: GLSLScene<T>;
    term: Term;
    env: Env;
    evalEnv: EvalEnv;
    startPaused: boolean;
}) => {
    const [error, setError] = React.useState(null as any | null);

    const [shaders, stateUniform] = React.useMemo(() => {
        try {
            if (term.type !== 'Record') {
                throw new Error(`Must be a record literal`);
            }
            const render =
                term.base.type === 'Concrete' ? term.base.rows[2] : null;
            if (!render) {
                throw new Error(`Unable to get render function out`);
            }
            const stateUniform: null | Reference = getStateUniform(term);
            if (stateUniform == null) {
                throw new Error(`Nope`);
            }
            return [
                [
                    compileGLSL(
                        render,
                        envWithTerm(env, render),
                        0,
                        undefined,
                        stateUniform,
                    ),
                ],
                stateUniform,
            ];
        } catch (err) {
            console.error(err);
            setError(err);
            return [null, null];
        }
    }, [term]);

    const onTrace = React.useCallback(
        (mousePos, time, canvas) => {
            const hash = hashObject(term);
            const id: Id = { hash, size: 1, pos: 0 };
            // const fn = evalEnv.terms[idName(id)];
            if (typeof value.render !== 'function') {
                console.log('not a function', value.render);
                return null;
            }

            // TODO: figure out the env

            // const glEnv = newGLSLEnv(canvas);
            // glEnv.time = time;

            // const old = evalEnv.traceObj.traces;
            // const traces = (evalEnv.traceObj.traces = {});
            // const color = value.render(glEnv, {
            //     type: 'Vec2',
            //     x: mousePos.x,
            //     y: mousePos.y,
            // });
            // evalEnv.traceObj.traces = old;
            // return { color, traces };
            return null;
        },
        [term],
    );

    if (error != null) {
        let message = error.message;
        if (error instanceof LocatedError && error.loc) {
            message = `${error.toString()} at ${showLocation(error.loc)}`;
        } else if (error instanceof TypeError) {
            message = error.toString();
        }
        if (message === 'no shader') {
            return (
                <div>
                    No shader, the browser probably throttled the opengl
                    contexts.
                </div>
            );
        }
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
                    {message + '\n' + error.stack}
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

    if (shaders == null || stateUniform == null) {
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
            state={{
                initial: value.initial,
                step: value.step,
                stateType: stateUniform,
                env,
            }}
        />
    );
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
        // TODO: Make this better.
        // If we get an error, and then update things
        // please clear this!!!
        // yeah not totally sure how to do it 🤔
        // openglcanvas tries to re-render where possible
        return (
            <div>
                <button onClick={() => setError(null)}>Try again</button>
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

export const Vec4 = refType(idFromName(Vec4_id));
export const Vec3 = refType(idFromName(Vec3_id));
export const Vec2 = refType(idFromName(Vec2_id));
const GLSLEnv = refType(GLSLEnvId);
const GLSLEnvT = refType(idFromName(GLSLEnv_id), [
    {
        type: 'var',
        sym: { name: 'T', unique: 0 },
        location: nullLocation,
    },
]);
const GLSLSceneRef = refType(idFromName(GLSLSceneOld_id), [
    {
        type: 'var',
        sym: { name: 'T', unique: 0 },
        location: nullLocation,
    },
]);

const shaderFunction = (buffers: number) => {
    const args: Array<Type> = [GLSLEnv, Vec2];
    for (let i = 0; i < buffers; i++) {
        args.push(builtinType('sampler2D'));
    }
    return pureFunction(args, Vec4);
};

// Ok, so what we need is:
// the ability to have parameterized dealios
// like, if you find a type variable, add a constraint for it.
// this could be the beginning of the inferences

export type GLSLEnv2<T> = {
    state: T;
    time: number;
    resolution: Vec2;
    camera: Vec3;
    mouse: Vec2;
    mouseButton: number;
};

export type GLSLScene<T> = {
    type: 'GLSLScene';
    initial: T;
    step: (env: GLSLEnv2<T>, prev: GLSLEnv2<T>) => T;
    render: (env: GLSLEnv2<T>, pos: Vec2) => Vec4;
};

const plugins: RenderPlugins = {
    openGlglOk: {
        id: 'openGlglOk',
        name: 'Shader for goodness',
        type: GLSLSceneRef,
        render: <T,>(
            value: GLSLScene<T>,
            evalEnv: EvalEnv,
            env: Env,
            term: Term,
            startPaused: boolean,
        ) => {
            return (
                <ShaderGLSLScene
                    value={value}
                    env={env}
                    evalEnv={evalEnv}
                    term={term}
                    startPaused={startPaused}
                />
            );
        },
    },

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
        type: pureFunction([GLSLEnv, Vec2], Vec4),
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
        type: pureFunction([GLSLEnv, Vec2], Vec4),
        render: (fn: OpenGLFn, evalEnv: EvalEnv) => {
            return <ShaderCPU fn={fn} evalEnv={evalEnv} />;
        },
    },
};
export default plugins;
