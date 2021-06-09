// This is the fake one?

import * as React from 'react';
import { wrapWithExecutaionLimit } from './Drawable';
import { EvalEnv } from '../State';
import { GLSLEnv, newGLSLEnv, OpenGLFn } from './OpenGL';

export const ShaderCPU = ({
    fn,
    evalEnv,
}: {
    fn: OpenGLFn;
    evalEnv: EvalEnv;
}) => {
    const canvasRef = React.useRef(null as null | HTMLCanvasElement);
    const [paused, setPaused] = React.useState(false);
    // const [data, setData] = React.useState([]);
    const [error, setError] = React.useState(null as any | null);

    const wrapped = React.useMemo(() => wrapWithExecutaionLimit(evalEnv, fn), [
        fn,
    ]);
    const fc = React.useRef(wrapped);
    fc.current = wrapped;

    const timer = React.useRef(0);

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
                env = newGLSLEnv(ctx.canvas);
                canvasRef.current.addEventListener('mousemove', (evt) => {
                    const box = (evt.target as HTMLCanvasElement).getBoundingClientRect();
                    env.mouse.x = evt.clientX - box.left;
                    env.mouse.y = evt.clientY - box.top;
                });
            }
            timer.current += (Date.now() - start) / 1000;
            start = Date.now();
            env.time = timer.current;
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

    return (
        <canvas
            onClick={() => setPaused(!paused)}
            ref={canvasRef}
            width="200"
            height="200"
        />
    );
};

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
            const color = fn(env, {
                type: 'Vec2',
                x: x * dx,
                y: ctx.canvas.height - y * dy,
            });
            ctx.fillStyle = `rgba(${color.x * 255},${color.y * 255},${
                color.z * 255
            },${color.w})`;
            ctx.fillRect(x * dx, y * dy, dx, dy);
        }
    }
};
