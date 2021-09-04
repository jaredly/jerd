import React from 'react';
import { min, modInt } from '../../../../language/src/printing/builtins';
import { idFromName } from '../../../../language/src/typing/env';
import { refType } from '../../../../language/src/typing/preset';
import { Env, nullLocation, Term } from '../../../../language/src/typing/types';
import { EvalEnv, RenderPlugins } from '../../State';
import {
    CanvasScene,
    CanvasScene_id,
    Color,
    Drawable,
    Drawable_id,
    Geom,
} from './canvas-jd';

export const geomPath = (ctx: CanvasRenderingContext2D, geom: Geom) => {
    switch (geom.type) {
        case 'Rect':
            ctx.rect(geom.pos.x, geom.pos.y, geom.size.x, geom.size.y);
            return;
        case 'Line':
            ctx.moveTo(geom.p1.x, geom.p1.y);
            ctx.lineTo(geom.p2.x, geom.p2.y);
            return;
        case 'Polygon':
            if (!geom.points.length) {
                return;
            }
            ctx.moveTo(geom.points[0].x, geom.points[0].y);
            if (geom.points.length === 1) {
                ctx.lineTo(geom.points[0].x, geom.points[0].y);
                return;
            }
            for (let i = 1; i < geom.points.length; i++) {
                ctx.lineTo(geom.points[i].x, geom.points[i].y);
            }
            if (geom.closed && geom.points.length > 2) {
                ctx.lineTo(geom.points[0].x, geom.points[0].y);
            }
            return;
        case 'Ellipse': {
            ctx.ellipse(
                geom.pos.x,
                geom.pos.y,
                geom.radius.x,
                geom.radius.y,
                geom.rotation,
                0,
                Math.PI * 2,
            );
            return;
        }
        default:
            console.warn(`not drawing yet ${geom.type}`);
    }
};

export const getColor = (color: Color) => {
    switch (color.type) {
        case 'CSS':
            return color.value;
        case 'Rgba':
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
};

export const drawShapes = (
    ctx: CanvasRenderingContext2D,
    shapes: Array<Drawable>,
) => {
    shapes.forEach((shape) => {
        if (shape.type === 'Fill') {
            ctx.beginPath();
            geomPath(ctx, shape.geom);
            ctx.fillStyle = getColor(shape.color);
            ctx.fill();
        } else if (shape.type === 'Stroke') {
            ctx.beginPath();
            geomPath(ctx, shape.geom);
            ctx.strokeStyle = getColor(shape.color);
            ctx.lineWidth = shape.width;
            ctx.lineCap = shape.lineCaps.type.toLowerCase() as CanvasLineCap;
            ctx.stroke();
        } else {
            ctx.font = shape.font;
            ctx.textAlign = shape.textAlign.type.toLowerCase() as CanvasTextAlign;
            if (shape.stroke === 0) {
                ctx.fillStyle = getColor(shape.color);
                ctx.fillText(shape.text, shape.pos.x, shape.pos.y);
            } else {
                ctx.strokeStyle = getColor(shape.color);
                ctx.lineWidth = shape.stroke;
                ctx.strokeText(shape.text, shape.pos.x, shape.pos.y);
            }
        }
    });
};

export const CanvasSceneView = <T,>({
    value,
    env,
    term,
    startPaused,
}: {
    value: CanvasScene<T>;
    evalEnv: EvalEnv;
    env: Env;
    term: Term;
    // TODO: support
    startPaused: boolean;
}) => {
    const canvas = React.useRef(null as null | HTMLCanvasElement);
    const [loaded, setLoaded] = React.useState(false);
    const state = React.useRef(value.initial);

    const [paused, setPaused] = React.useState(startPaused);

    // const startPaused$ = React.useRef(startPaused)
    const paused$ = React.useRef(paused);
    paused$.current = paused;
    React.useEffect(() => {
        // if (startPaused$.current === startPaused) {
        // 	return
        // }
        if (startPaused && !paused$.current) {
            setPaused(true);
        }
        if (!startPaused && paused$.current) {
            setPaused(false);
        }
    }, [startPaused]);

    React.useEffect(() => {
        if (paused || !loaded) {
            return;
        }
        if (!canvas.current) {
            return;
        }
        const ctx = canvas.current.getContext('2d');
        if (!ctx) {
            return;
        }
        const fps = value.fps;
        // let state = value.initial;
        let now = Date.now();
        let tid: number;
        const fn = () => {
            if (value.clear) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
            drawShapes(ctx, value.draw(state.current));
            if (fps >= 60.0) {
                tid = requestAnimationFrame(fn);
            } else {
                tid = (setTimeout(fn, 1000 / fps) as unknown) as number;
            }

            let nww = Date.now();
            state.current = value.update(state.current, nww - now);
            now = nww;
        };
        fn();

        return () => {
            fps >= 60.0 ? cancelAnimationFrame(tid) : clearTimeout(tid);
        };
    }, [paused, value, loaded]);

    return (
        <div>
            <canvas
                width={value.size.x}
                height={value.size.y}
                style={{ maxWidth: '100vw' }}
                ref={(node) => {
                    if (node) {
                        canvas.current = node;
                        setLoaded(true);
                    }
                }}
            />
            <div>
                <button
                    style={buttonStyle}
                    onClick={() => {
                        setPaused(!paused);
                    }}
                >
                    {paused ? 'Start' : 'Pause'}
                </button>
                <button
                    style={buttonStyle}
                    onClick={() => {
                        state.current = value.initial;
                        const ctx = canvas.current?.getContext('2d');
                        ctx?.clearRect(
                            0,
                            0,
                            ctx.canvas.width,
                            ctx.canvas.height,
                        );
                    }}
                >
                    Restart
                </button>
            </div>
        </div>
    );
};

const buttonStyle = {
    border: 'none',
    color: '#ccc',
    marginRight: 4,
    backgroundColor: '#111',
    padding: '4px 8px',
    cursor: 'pointer',
};

const drawableBounds = (geom: Geom) => {
    switch (geom.type) {
        case 'Polygon': {
            const minX = geom.points.reduce(
                (c, v) => Math.min(c, v.x),
                Infinity,
            );
            const minY = geom.points.reduce(
                (c, v) => Math.min(c, v.y),
                Infinity,
            );
            const maxX = geom.points.reduce(
                (c, v) => Math.max(c, v.x),
                -Infinity,
            );
            const maxY = geom.points.reduce(
                (c, v) => Math.max(c, v.y),
                -Infinity,
            );
            return {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
            };
        }
        case 'Rect':
            return {
                x: geom.pos.x,
                y: geom.pos.y,
                width: geom.size.x,
                height: geom.size.y,
            };
        case 'Ellipse':
            const mr = Math.max(geom.radius.x, geom.radius.y);
            return {
                x: geom.pos.x - mr,
                y: geom.pos.y - mr,
                width: mr * 2,
                height: mr * 2,
            };
        case 'Line':
            const x = Math.min(geom.p1.x, geom.p2.x);
            const y = Math.min(geom.p1.y, geom.p2.y);
            const ax = Math.max(geom.p1.x, geom.p2.x);
            const ay = Math.max(geom.p1.y, geom.p2.y);
            return { x, y, width: ax - x, height: ay - y };
    }
    return { x: 0, y: 0, width: 100, height: 100 };
};

const expandBounds = (
    bounds: { x: number; y: number; width: number; height: number },
    margin: number,
) => ({
    x: bounds.x - margin,
    y: bounds.y - margin,
    width: bounds.width + margin * 2,
    height: bounds.height + margin * 2,
});

const SingleDrawable = ({ value }: { value: Drawable }) => {
    const [loaded, setLoaded] = React.useState(
        null as null | HTMLCanvasElement,
    );
    const bounds = React.useMemo(
        () =>
            value.type === 'Text'
                ? { x: 0, y: 0, width: 100, height: 100 }
                : expandBounds(drawableBounds(value.geom), 10),
        [value],
    );
    React.useEffect(() => {
        if (!loaded) {
            return;
        }
        const ctx = loaded.getContext('2d')!;
        ctx.save();
        ctx.clearRect(0, 0, loaded.width, loaded.height);
        ctx.translate(-bounds.x, -bounds.y);
        drawShapes(ctx, [value]);
        ctx.restore();
    }, [loaded, value]);
    return (
        <canvas
            width={Math.min(bounds.width, 1000)}
            height={Math.min(bounds.height, 1000)}
            ref={(node) => {
                if (node && !loaded) {
                    setLoaded(node);
                }
            }}
        />
    );
};

const plugins: RenderPlugins = {
    drawable: {
        id: 'drawable',
        name: 'Drawable',
        type: refType(idFromName(Drawable_id)),
        render: (value: Drawable, evalEnv: EvalEnv) => {
            return <SingleDrawable value={value} />;
        },
    },
    canvas: {
        id: 'canvas',
        name: 'Canvas',
        type: refType(idFromName(CanvasScene_id), [
            {
                type: 'var',
                sym: { name: 'T', unique: 0 },
                location: nullLocation,
            },
        ]),
        render: <T,>(
            value: CanvasScene<T>,
            evalEnv: EvalEnv,
            env: Env,
            term: Term,
            startPaused: boolean,
        ) => {
            return (
                <CanvasSceneView
                    value={value}
                    env={env}
                    evalEnv={evalEnv}
                    term={term}
                    startPaused={startPaused}
                />
            );
        },
    },
};
export default plugins;
