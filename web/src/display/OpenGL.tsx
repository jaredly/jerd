// This is the fake one?
/* @jsx jsx */
import { css, jsx } from '@emotion/react';

import * as React from 'react';
import { Env, Id, Term } from '@jerd/language/src/typing/types';
import {
    builtinType,
    int,
    pureFunction,
    refType,
} from '@jerd/language/src/typing/preset';
import { EvalEnv, RenderPlugins } from '../State';
import { hashObject, idName } from '@jerd/language/src/typing/env';
import { generateSingleShader } from '@jerd/language/src/printing/glslPrinter';
import { setup } from '../setupGLSL';
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

export const IconButton = ({
    icon,
    onClick,
    selected,
}: {
    icon: string;
    onClick: () => void;
    selected?: boolean;
}) => {
    return (
        <button
            onClick={onClick}
            css={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: 4,
                margin: 0,
                cursor: 'pointer',
                transition: '.2s ease color',
                fontSize: '80%',
                color: '#2a5e7d',
                ':hover': {
                    color: '#9edbff',
                },
                ...(selected ? { color: '#24aeff' } : undefined),
            }}
        >
            <span
                className="material-icons"
                css={{
                    // textShadow: '1px 1px 0px #aaa',
                    fontSize: 20,
                    pointerEvents: 'visible',
                }}
            >
                {icon}
            </span>
        </button>
    );
};

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

function convertDataURIToBinary(dataURI: string) {
    var base64 = dataURI.replace(/^data[^,]+,/, '');
    var raw = window.atob(base64);
    var rawLength = raw.length;

    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}

export type PlayState = 'playing' | 'paused' | 'recording' | 'transcoding';

const hover = css({
    opacity: 0,
    // backgroundColor: 'rgba(50, 50, 50, 0.1)',
    paddingTop: 2,
    transition: '.3s ease opacity',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
});

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
    const [width, setWidth] = React.useState(200);
    const [canvas, setCanvas] = React.useState(
        null as null | HTMLCanvasElement,
    );
    const [restartCount, setRestartCount] = React.useState(0);
    const [playState, setPlayState] = React.useState(
        (startPaused ? 'paused' : 'playing') as PlayState,
    );
    const [showSettings, toggleSettings] = React.useState(false);
    const [error, setError] = React.useState(null as any | null);

    const [tracing, setTracing] = React.useState(false);
    const [transcodingProgress, setTranscodingProgress] = React.useState(0.0);
    const [recordingLength, setRecordingLength] = React.useState(
        Math.ceil(2 * Math.PI * 60),
    );

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

    const timer = React.useRef(0);

    const [video, setVideo] = React.useState(null as null | string);

    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0, button: -1 });
    const currentMousePos = React.useRef(mousePos);
    currentMousePos.current = mousePos;

    const traceValue = React.useMemo(() => {
        if (!tracing || !canvas) {
            return null;
        }
        const hash = hashObject(term);
        const id: Id = { hash, size: 1, pos: 0 };
        // const fn = evalEnv.terms[idName(id)];
        if (typeof fn !== 'function') {
            console.log('not a function', fn);
            return null;
        }

        const glEnv = newGLSLEnv(canvas);
        glEnv.time = timer.current;

        const old = evalEnv.traceObj.traces;
        const traces = (evalEnv.traceObj.traces = {});
        const color = fn(glEnv, {
            type: 'Vec2',
            x: mousePos.x,
            y: mousePos.y,
        });
        evalEnv.traceObj.traces = old;
        return { color, traces };
    }, [tracing, mousePos, term]);

    const textures = React.useRef([]);

    const restart = () => {
        setRestartCount(restartCount + 1);
        textures.current = [];
    };

    const updateFn = React.useMemo(() => {
        if (!canvas || !shaders) {
            return null;
        }
        const ctx = canvas.getContext('webgl2');
        if (!ctx) {
            return;
        }
        try {
            const update = setup(
                ctx,
                shaders[0].text,
                timer.current,
                currentMousePos.current,
                shaders.slice(1).map((shader) => shader.text),
                textures.current,
            );
            return update;
        } catch (err) {
            console.log(err);
            setError(err);
        }
    }, [canvas, shaders, restartCount]);

    React.useEffect(() => {
        if (
            !updateFn ||
            playState === 'paused' ||
            playState === 'transcoding'
        ) {
            return;
        }
        if (playState === 'recording') {
            // um just go to 2PI? let's try that...
            // or maybe 4pi, idk
            // 60fps please I think
            const ffmpeg = new Worker('./ffmpeg-worker-mp4.js');

            // const totalSeconds = Math.PI * 4;

            ffmpeg.onmessage = function (e) {
                var msg = e.data;
                switch (msg.type) {
                    case 'stdout':
                    case 'stderr':
                        if (msg.data.startsWith('frame=')) {
                            const frame = +(msg.data as string)
                                .slice('frame='.length)
                                .trimStart()
                                .split(' ')[0];
                            setTranscodingProgress(frame / recordingLength);
                        }
                        console.log(msg.data);
                        // messages += msg.data + "\n";
                        break;
                    case 'exit':
                        console.log('Process exited with code ' + msg.data);
                        //worker.terminate();
                        break;

                    case 'done':
                        const blob = new Blob([msg.data.MEMFS[0].data], {
                            type: 'video/mp4',
                        });
                        setVideo(URL.createObjectURL(blob));
                        break;
                }
            };

            const images: Array<{ name: string; data: Uint8Array }> = [];

            let tid: any;
            let tick = 0;
            const fn = () => {
                updateFn(tick / 60, currentMousePos.current);

                const dataUrl = canvas!.toDataURL('image/jpeg');
                const data = convertDataURIToBinary(dataUrl);

                images.push({
                    name: `img${tick.toString().padStart(3, '0')}.jpg`,
                    data,
                });

                if (tick++ > recordingLength) {
                    ffmpeg.postMessage({
                        type: 'run',
                        TOTAL_MEMORY: 268435456,
                        //arguments: 'ffmpeg -framerate 24 -i img%03d.jpeg output.mp4'.split(' '),
                        arguments: [
                            '-r',
                            '60',
                            '-i',
                            'img%03d.jpg',
                            '-c:v',
                            'libx264',
                            '-crf',
                            '18',
                            '-pix_fmt',
                            'yuv420p',
                            '-vb',
                            '20M',
                            'out.mp4',
                        ],
                        MEMFS: images,
                    });
                    setPlayState('transcoding');

                    return; // done
                }
                tid = requestAnimationFrame(fn);
            };
            tid = requestAnimationFrame(fn);
            return () => cancelAnimationFrame(tid);
        } else {
            let tid: any;
            let last = Date.now();
            const fn = () => {
                const now = Date.now();
                timer.current += (now - last) / 1000;
                last = now;
                updateFn(timer.current, currentMousePos.current);
                tid = requestAnimationFrame(fn);
            };
            tid = requestAnimationFrame(fn);
            return () => cancelAnimationFrame(tid);
        }
    }, [updateFn, playState, restartCount]);

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

    return (
        <div
            onMouseDown={(evt) => {
                evt.stopPropagation();
            }}
            onClick={(evt) => {
                evt.stopPropagation();
            }}
        >
            <div
                css={{
                    position: 'relative',
                    display: 'inline-block',
                    [`:hover .hover`]: {
                        opacity: 1.0,
                    },
                }}
            >
                <canvas
                    onMouseMove={(evt) => {
                        const box = (evt.target as HTMLCanvasElement).getBoundingClientRect();
                        setMousePos({
                            x: (evt.clientX - box.left) * 2,
                            y: (box.height - (evt.clientY - box.top)) * 2,
                            button: evt.button != null ? evt.button : -1,
                        });
                    }}
                    ref={(node) => {
                        if (node && !canvas) {
                            setCanvas(node);
                        }
                    }}
                    style={{
                        width: width,
                        height: width,
                    }}
                    // Double size for retina
                    width={width * 2 + ''}
                    height={width * 2 + ''}
                />
                <div css={hover} className="hover">
                    <IconButton
                        icon="play_arrow"
                        selected={playState === 'playing'}
                        onClick={() => {
                            if (playState !== 'playing') {
                                setPlayState('playing');
                            }
                        }}
                    />
                    <IconButton
                        icon="pause"
                        selected={playState === 'paused'}
                        onClick={() => {
                            if (playState !== 'paused') {
                                setPlayState('paused');
                            }
                        }}
                    />
                    <IconButton
                        icon="replay"
                        selected={false}
                        onClick={() => {
                            timer.current = 0;
                            if (playState !== 'playing') {
                                setPlayState('playing');
                            }
                            restart();
                        }}
                    />
                    <IconButton
                        icon="circle"
                        onClick={() => {
                            timer.current = 0;
                            setPlayState('recording');
                            restart();
                        }}
                        selected={playState === 'recording'}
                    />
                    <IconButton
                        icon="settings"
                        onClick={() => toggleSettings(!showSettings)}
                        selected={showSettings}
                    />
                </div>
            </div>
            {showSettings ? (
                <div>
                    Width:
                    <input
                        value={width + ''}
                        onChange={(evt) => {
                            const value = +evt.target.value;
                            if (!isNaN(value)) {
                                setWidth(value);
                            }
                        }}
                    />
                    {tracing && traceValue ? (
                        <ShowTrace
                            trace={traceValue}
                            env={env}
                            pos={mousePos}
                        />
                    ) : (
                        <button onClick={() => setTracing(true)}>Trace</button>
                    )}
                    Recording length (frames):
                    <input
                        value={recordingLength.toString()}
                        onChange={(evt) => {
                            const value = parseInt(evt.target.value);
                            if (!isNaN(value)) {
                                setRecordingLength(value);
                            }
                        }}
                    />
                </div>
            ) : null}
            {transcodingProgress > 0
                ? `Transcoding: ${(transcodingProgress * 100).toFixed(2)}%`
                : null}
            {video ? <video src={video} loop controls /> : null}
        </div>
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
