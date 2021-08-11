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
    Decorator,
    Env,
    Id,
    Location,
    newWithGlobal,
    nullLocation,
    Reference,
    refsEqual,
    Term,
    Type,
} from '@jerd/language/src/typing/types';
import * as React from 'react';
import {
    GLSLBuffer1_id,
    GLSLEnv_id,
    GLSLSceneOld_id,
    hsla_id,
    hsl_id,
    rgba_id,
    rgb_id,
    slider$1_id,
    slider$2_id,
    slider_id,
    title_id,
    Vec2_id,
    Vec3_id,
    Vec4_id,
} from '../../../language/src/printing/prelude-types';
import { sortAllDepsPlain } from '../../../language/src/typing/analyze';
import { LocatedError, TypeError } from '../../../language/src/typing/errors';
import { transform } from '../../../language/src/typing/transform';
import { showLocation } from '../../../language/src/typing/typeExpr';
import { refName } from '../../../language/src/typing/typePattern';
import { EvalEnv, RenderPlugins } from '../State';
import { widgetForDecorator } from './Decorators';
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

    const [sliderState, setSliderState] = React.useState(
        {} as {
            [term: string]: {
                [idx: number]: { options: any; replacement: Term };
            };
        },
    );

    const sliderData = React.useMemo(() => {
        const termDeps: { [source: string]: Array<string> } = {};
        const found: {
            [termId: string]: {
                [idx: number]: {
                    title: string | null;
                    widget: React.FunctionComponent<{
                        data: any;
                        onUpdate: (term: Term, data: any) => void;
                    }>;
                    loc: Location;
                };
            };
        } = {};
        const crawlTerm = (term: Term, id: Id) => {
            const hash = idName(id);
            if (found[hash]) {
                return; // already traversed
            }
            found[hash] = {};
            termDeps[hash] = [];
            transform(term, {
                term: (t) => {
                    if (t.decorators) {
                        const widgetIds = [
                            slider$2_id,
                            slider$1_id,
                            slider_id,
                            rgba_id,
                            rgb_id,
                            hsl_id,
                            hsla_id,
                        ];
                        const widget = t.decorators.filter((d) =>
                            widgetIds.includes(idName(d.name.id)),
                        );
                        if (widget.length > 1) {
                            console.error(`Too many widgets on a term`);
                            console.error(widget);
                            return null;
                        }
                        const titleDec = t.decorators.filter(
                            (d) => idName(d.name.id) === title_id,
                        );
                        const title = titleDec.length
                            ? (titleDec[0].args[0] as any).term.text
                            : null;
                        // console.log(title, widget);
                        if (widget.length) {
                            const decorator = widget[0];
                            const w = widgetForDecorator(decorator, t);
                            if (w) {
                                found[hash][t.location.idx!] = {
                                    title,
                                    loc: t.location,
                                    widget: w,
                                };
                            }
                        }
                    }
                    if (t.type === 'ref' && t.ref.type === 'user') {
                        const otherHash = idName(t.ref.id);
                        if (!termDeps[hash].includes(otherHash)) {
                            termDeps[hash].push(otherHash);
                        }
                        crawlTerm(env.global.terms[otherHash], t.ref.id);
                    }

                    return null;
                },
            });
        };
        const topId = idFromName(hashObject(term));
        crawlTerm(term, topId);
        // console.log('found', found);
        return { sliders: found, termsInOrder: sortAllDepsPlain(termDeps) };
    }, [term]);

    const termAndEnvWithSliders = React.useMemo(() => {
        // Basic strategy:
        // - go through sliders ... maybe have sliders grouped by term, yeah that's a good idea
        // - anyway, for each term, make a replacement term
        // - then go through and substitute references to the unslid terms for references to the slid ones. Right?
        // uhhh hm but wait we need to do this in topological order
        // ok so we now have a mapping of dependencies.
        // if we can just go in reverse dependency order, remapping as we go, it should work just fine, right?
        const { sliders, termsInOrder } = sliderData;
        const slidEnv = envWithTerm(newWithGlobal(env.global), term);
        const mapping: { [hash: string]: Id } = {};
        const newTerms = termsInOrder.map((hash) => {
            const newTerm = transform(slidEnv.global.terms[hash], {
                term: (term) => {
                    if (
                        sliderState[hash] &&
                        sliderState[hash][term.location.idx!]
                    ) {
                        return sliderState[hash][term.location.idx!]
                            .replacement;
                    }
                    if (term.type === 'ref' && term.ref.type === 'user') {
                        const name = idName(term.ref.id);
                        if (mapping[name]) {
                            // console.log('MAPPED', name);
                            return {
                                ...term,
                                ref: { ...term.ref, id: mapping[name] },
                            };
                        }
                    }
                    return null;
                },
            });
            const newHash = hashObject(newTerm);
            if (newHash === hash) {
                return newTerm;
            }
            // if (newTerm === slidEnv.global.terms[hash]) {
            //     console.log('DIFF', hash, newHash);
            //     throw new Error(`hash is different?`);
            // }
            // console.log(
            //     'DIFFERENT',
            //     hash,
            //     newHash,
            //     newTerm,
            //     hashObject(slidEnv.global.terms[hash]),
            // );
            const newId = idFromName(newHash);
            mapping[hash] = newId;
            slidEnv.global.terms[newHash] = newTerm;
            slidEnv.global.idNames[newHash] = slidEnv.global.idNames[hash];
            return newTerm;
        });
        // console.log(mapping, newTerms);
        return {
            env: slidEnv,
            term: newTerms[newTerms.length - 1],
        };
    }, [term, sliderData, sliderState]);

    // START HERE:
    // Render out the widgets! Should be quite simple. Use sliderState.
    // THEN
    // do a `const slidTerm = React.useMemo(() => {}, [term, sliders, sliderState])`
    // and have my shaders and whatnot depend on that.
    // If there are no sliders, then it's a no-op.
    // yeah should be pretty straightforward.

    const shaders = React.useMemo(() => {
        const { env, term } = termAndEnvWithSliders;
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
        let items;
        if (
            term.type === 'Record' &&
            term.is.type === 'ref' &&
            refsEqual(term.is.ref, {
                type: 'user',
                id: idFromName(GLSLBuffer1_id),
            })
        ) {
            if (term.base.type !== 'Concrete') {
                throw new Error(`abstract recrod`);
            }
            items = term.base.rows.map((r) => r!);
        } else if (term.type !== 'Tuple') {
            const err = new Error(`Expression must be a tuple literal`);
            console.error();
            setError(err);
            return null;
        } else {
            items = term.items;
        }
        try {
            return items.map((item) =>
                compileGLSL(item, envWithTerm(env, item), items.length - 1),
            );
        } catch (err) {
            console.error(err);
            setError(err);
            return null;
        }
    }, [termAndEnvWithSliders]);

    const onTrace = React.useCallback(
        (mousePos, time, canvas) => {
            const { env, term } = termAndEnvWithSliders;
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
        [termAndEnvWithSliders],
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
        <div>
            <OpenGLCanvas
                onTrace={onTrace}
                shaders={shaders.map((shader) => shader.text)}
                startPaused={startPaused}
                onError={setError}
                renderTrace={(traceValue, mousePos) => (
                    <ShowTrace
                        trace={traceValue}
                        env={termAndEnvWithSliders.env}
                        pos={mousePos}
                    />
                )}
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {Object.keys(sliderData.sliders).map((hash) => {
                    const idxs = Object.keys(sliderData.sliders[hash]);
                    if (!idxs.length) {
                        return;
                    }
                    return (
                        <div key={hash} style={{ padding: 4 }}>
                            <h4>
                                {termAndEnvWithSliders.env.global.idNames[
                                    hash
                                ] || hash}
                            </h4>
                            <div style={{ display: 'flex' }}>
                                {idxs.map((idx) => {
                                    const config =
                                        sliderData.sliders[hash][parseInt(idx)];
                                    const Widget = config.widget;
                                    return (
                                        <div key={idx} style={{ padding: 4 }}>
                                            {config.title ? (
                                                <div
                                                    style={{
                                                        marginBottom: 16,
                                                        textAlign: 'center',
                                                        padding: 4,
                                                        backgroundColor: '#555',
                                                    }}
                                                >
                                                    {config.title}
                                                </div>
                                            ) : null}
                                            <Widget
                                                data={
                                                    sliderState[hash] &&
                                                    sliderState[hash][+idx]
                                                        ? sliderState[hash][
                                                              +idx
                                                          ].options
                                                        : null
                                                }
                                                onUpdate={(newTerm, data) => {
                                                    setSliderState((state) => ({
                                                        ...state,
                                                        [hash]: {
                                                            ...state[hash],
                                                            [idx]: {
                                                                options: data,
                                                                replacement: newTerm,
                                                            },
                                                        },
                                                    }));
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
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
        type: refType(idFromName(GLSLBuffer1_id)),
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

    openglBuffer1_alt: {
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
