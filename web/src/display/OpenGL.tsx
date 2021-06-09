// This is the fake one?

import * as React from 'react';
import { Env, Id, Term } from '@jerd/language/src/typing/types';
import {
    builtinType,
    int,
    pureFunction,
    refType,
} from '@jerd/language/src/typing/preset';
import { EvalEnv, Plugins } from '../State';
import { hashObject, idName } from '@jerd/language/src/typing/env';
import { wrapWithExecutaionLimit } from './Drawable';
import {
    generateShader,
    generateSingleShader,
} from '@jerd/language/src/printing/glslPrinter';
import { setup } from '../setupGLSL';
import { Traces } from '../eval';
import { Trace } from '../Editor';
import { hashStyle } from '../Cell';
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
    const [error, setError] = React.useState(null as any | null);

    const [tracing, setTracing] = React.useState(false);
    const [transcodingProgress, setTranscodingProgress] = React.useState(0.0);
    const [recordingLength, setRecordingLength] = React.useState(
        Math.ceil(2 * Math.PI * 60),
    );

    const shaders = React.useMemo(() => {
        if (term.is.type === 'lambda') {
            return [compileGLSL(term, envWithTerm(env, term), 0)];
        }
        if (term.type !== 'Tuple') {
            throw new Error(`Expression must be a tuple literal`);
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
        <div>
            <canvas
                onClick={() =>
                    setPlayState(playState === 'paused' ? 'playing' : 'paused')
                }
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
            <button
                onClick={() => {
                    timer.current = 0;
                    setPlayState('recording');
                    setRestartCount(restartCount + 1);
                }}
            >
                Record 2PI seconds at 60fps
            </button>
            <button
                onClick={() => {
                    timer.current = 0;
                    if (playState !== 'playing') {
                        setPlayState('playing');
                    }
                    setRestartCount(restartCount + 1);
                }}
            >
                Restart
            </button>
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
                <ShowTrace trace={traceValue} env={env} pos={mousePos} />
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

const plugins: Plugins = {
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
