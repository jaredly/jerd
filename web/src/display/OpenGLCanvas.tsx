// This is the fake one?
/* @jsx jsx */
import { css, jsx } from '@emotion/react';
import * as React from 'react';
import { setup } from '../setupGLSL';

export type PlayState = 'playing' | 'paused' | 'recording' | 'transcoding';

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

const makeFfmpeg = (
    zoom: number,
    onFrame: (frame: number) => void,
    onDone: (url: string) => void,
) => {
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
                    onFrame(frame);
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
                onDone(URL.createObjectURL(blob));
                break;
        }
    };

    return (images: Array<{ name: string; data: Uint8Array }>) => {
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
                '-vf',
                `scale=iw*${zoom}:ih*${zoom}:flags=neighbor`,
                'out.mp4',
            ],
            MEMFS: images,
        });
    };
};

export const OpenGLCanvas = ({
    shaders,
    startPaused,
    onTrace,
    onError,
    renderTrace,
    initialSize = 200,
    initialZoom = 0.5,
    // START HERE: Use state if its there....
    state,
}: {
    initialSize?: number;
    initialZoom?: number;
    startPaused: boolean;
    shaders: Array<string>;
    onError: (e: Error) => void;
    // For tracing, optional
    onTrace?: (
        mousePos: { x: number; y: number },
        time: number,
        canvas: HTMLCanvasElement,
    ) => void;
    renderTrace?: (
        trace: any,
        mousePos: { x: number; y: number },
    ) => React.ReactNode;
    state?: {
        initial: any;
        step: (env: any, prev: any) => any;
    };
}) => {
    const [zoom, setZoom] = React.useState(initialZoom);
    const [width, setWidth] = React.useState(initialSize);
    const [canvas, setCanvas] = React.useState(
        null as null | HTMLCanvasElement,
    );
    const [restartCount, setRestartCount] = React.useState(0);
    const [playState, setPlayState] = React.useState(
        (startPaused ? 'paused' : 'playing') as PlayState,
    );
    const [showSettings, toggleSettings] = React.useState(false);

    const [tracing, setTracing] = React.useState(false);
    const [transcodingProgress, setTranscodingProgress] = React.useState({
        start: 0.0,
        percent: 0.0,
    });
    const [recordingLength, setRecordingLength] = React.useState(
        Math.ceil(2 * Math.PI * 60),
    );

    const timer = React.useRef(0);

    const [video, setVideo] = React.useState(null as null | string);

    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0, button: -1 });
    const currentMousePos = React.useRef(mousePos);
    currentMousePos.current = mousePos;

    const traceValue = React.useMemo(() => {
        if (!tracing || !canvas || !onTrace) {
            return null;
        }
        return onTrace(mousePos, timer.current, canvas);
    }, [tracing, mousePos, onTrace]);

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
                shaders[0],
                timer.current,
                currentMousePos.current,
                shaders.slice(1),
                textures.current,
            );
            return update;
        } catch (err) {
            console.log(err);
            onError(err);
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
            // Clear out any video
            setVideo(null);

            const sendRun = makeFfmpeg(
                zoom,
                (frame) =>
                    setTranscodingProgress((t) => ({
                        ...t,
                        percent: frame / recordingLength,
                        // start: t.start === 0.0 ? Date.now() : t.start,
                    })),
                setVideo,
            );

            const images: Array<{ name: string; data: Uint8Array }> = [];

            let tid: any;
            let tick = 0;
            const fn = () => {
                updateFn(tick / 60, currentMousePos.current);
                setTranscodingProgress({
                    start: Date.now(),
                    percent: tick / recordingLength,
                });

                const dataUrl = canvas!.toDataURL('image/jpeg');
                const data = convertDataURIToBinary(dataUrl);

                images.push({
                    name: `img${tick.toString().padStart(3, '0')}.jpg`,
                    data,
                });

                if (tick++ > recordingLength) {
                    sendRun(images);
                    setPlayState('transcoding');
                    setTranscodingProgress({ start: Date.now(), percent: 0 });

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
                            x: (evt.clientX - box.left) / zoom,
                            y: (box.height - (evt.clientY - box.top)) / zoom,
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
                        imageRendering: 'pixelated',
                    }}
                    // Double size for retina
                    width={width / zoom + ''}
                    height={width / zoom + ''}
                />
                <HoverPanel
                    playState={playState}
                    setPlayState={setPlayState}
                    timer={timer}
                    restart={restart}
                    showSettings={showSettings}
                    toggleSettings={toggleSettings}
                />
            </div>
            {showSettings ? (
                <div>
                    Width:
                    <input
                        style={{ width: 40 }}
                        value={width + ''}
                        onChange={(evt) => {
                            const value = +evt.target.value;
                            if (!isNaN(value)) {
                                setWidth(value);
                            }
                        }}
                    />
                    Zoom:
                    <input
                        style={{ width: 40 }}
                        value={zoom + ''}
                        onChange={(evt) => {
                            const value = +evt.target.value;
                            if (!isNaN(value)) {
                                setZoom(value);
                            }
                        }}
                    />
                    {renderTrace ? (
                        tracing && traceValue ? (
                            renderTrace(traceValue, mousePos)
                        ) : (
                            <button onClick={() => setTracing(true)}>
                                Trace
                            </button>
                        )
                    ) : null}
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
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                JSON.stringify({ shaders, zoom, size: width }),
                            );
                        }}
                    >
                        Copy as JSON
                    </button>
                </div>
            ) : null}
            {transcodingProgress.start !== 0.0
                ? `${playState}: ${(transcodingProgress.percent * 100).toFixed(
                      2,
                  )}% ETA: ${calcEta(transcodingProgress)}`
                : null}
            {video ? <video src={video} loop controls /> : null}
        </div>
    );
};

export const HoverPanel = ({
    playState,
    setPlayState,
    timer,
    restart,
    showSettings,
    toggleSettings,
}: {
    playState: PlayState;
    setPlayState: (s: PlayState) => void;
    timer: { current: number };
    restart: () => void;
    showSettings: boolean;
    toggleSettings: (s: boolean) => void;
}) => (
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
);

const calcEta = ({ start, percent }: { start: number; percent: number }) => {
    const delta = Date.now() - start;
    const total = delta / percent;
    const secondsLeft = Math.floor((total - delta) / 1000);
    return `${((secondsLeft / 60) | 0).toString().padStart(2, '0')}:${(
        secondsLeft % 60
    )
        .toString()
        .padStart(2, '0')}`;
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
