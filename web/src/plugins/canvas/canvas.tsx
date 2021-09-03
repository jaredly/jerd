import React from 'react';
import { idFromName } from '../../../../language/src/typing/env';
import { refType } from '../../../../language/src/typing/preset';
import { Env, nullLocation, Term } from '../../../../language/src/typing/types';
import { EvalEnv, RenderPlugins } from '../../State';
import {
    CanvasScene,
    CanvasScene_id,
    Color,
    Drawable,
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
    React.useEffect(() => {
        if (startPaused || !loaded) {
            return;
        }
        if (!canvas.current) {
            return;
        }
        const ctx = canvas.current.getContext('2d');
        if (!ctx) {
            return;
        }
        // let state = value.initial;
        let now = Date.now();
        const fn = () => {
            if (value.clear) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
            drawShapes(ctx, value.draw(state.current));
            tid = requestAnimationFrame(fn);

            let nww = Date.now();
            state.current = value.update(state.current, nww - now);
            now = nww;
        };
        let tid = requestAnimationFrame(fn);

        return () => cancelAnimationFrame(tid);
    }, [startPaused, value, loaded]);

    return (
        <div>
            <canvas
                ref={(node) => {
                    if (node) {
                        canvas.current = node;
                        setLoaded(true);
                    }
                }}
            />
        </div>
    );
};

const plugins: RenderPlugins = {
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
