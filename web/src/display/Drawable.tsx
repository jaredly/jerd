// My first little render plugin!

import * as React from 'react';
import {
    nullLocation,
    Type,
    TypeReference,
    UserReference,
} from '@jerd/language/src/typing/types';
import {
    builtinType,
    int,
    pureFunction,
} from '@jerd/language/src/typing/preset';
import { EvalEnv, RenderPlugins, RenderPluginT } from '../State';
import { idFromName } from '@jerd/language/src/typing/env';

// TODO: I should be able to generate these
// automatically.
type Nullable<T> = { type: 'Empty' } | { type: 'Ok'; value: T };

type Border = {
    type: 'Border';
    width: number;
    color: string;
};

// type Pos = { type: 'Pos'; x: number; y: number };
type Shape =
    | {
          type: 'Circle';
          x: number;
          y: number;
          r: number;
      }
    | {
          type: 'Box';
          x: number;
          y: number;
          w: number;
          h: number;
      };

type Drawable = {
    type: 'Drawable';
    shape: Shape;
    fill: string;
    border: Nullable<Border>;
};

const refType = (hash: string, typeVbls: Array<Type> = []): TypeReference => ({
    type: 'ref',
    location: nullLocation,
    // effectVbls: [],
    typeVbls,
    ref: {
        type: 'user',
        id: idFromName(hash),
    },
});

export const drawableToSvg = (d: Drawable, i?: number) => {
    if (d.shape.type === 'Circle') {
        return (
            <circle
                key={i}
                stroke={
                    d.border.type === 'Ok' ? d.border.value.color : undefined
                }
                strokeWidth={
                    d.border.type === 'Ok' ? d.border.value.width : undefined
                }
                cx={d.shape.x}
                cy={d.shape.y}
                r={d.shape.r}
                fill={d.fill}
            />
        );
    }
    if (d.shape.type === 'Box') {
        return (
            <rect
                key={i}
                stroke={
                    d.border.type === 'Ok' ? d.border.value.color : undefined
                }
                strokeWidth={
                    d.border.type === 'Ok' ? d.border.value.width : undefined
                }
                x={d.shape.x}
                y={d.shape.y}
                width={d.shape.w}
                height={d.shape.h}
                fill={d.fill}
            />
        );
    }
};

export const wrapWithExecutaionLimit = (evalEnv: EvalEnv, fn: any) => {
    return (...args: any) => {
        const need = evalEnv.executionLimit.enabled === false;
        // STOPSHIP: Because we're doing this synchronously,
        // we should save the previous one (if enabled) and
        // restore it after our execution.
        if (need) {
            evalEnv.executionLimit.enabled = true;
            evalEnv.executionLimit.maxTime = Date.now() + 200;
            evalEnv.executionLimit.ticks = 0;
        }
        try {
            const res = fn(...args);
            if (need) {
                evalEnv.executionLimit.enabled = false;
            }
            return res;
        } catch (err) {
            if (need) {
                evalEnv.executionLimit.enabled = false;
            }
            throw err;
        }
    };
};

const Animation = ({
    fn,
    evalEnv,
}: {
    evalEnv: EvalEnv;
    fn: (n: number) => Array<Drawable>;
}) => {
    const [paused, setPaused] = React.useState(false);
    const [data, setData] = React.useState([]);
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
        let tick = 0;
        const tid = setInterval(() => {
            tick += 1;
            try {
                setData(fc.current(tick));
            } catch (err) {
                clearInterval(tid);
                setError(err);
            }
        }, 40);
        return () => clearInterval(tid);
    }, [paused]);
    if (error != null) {
        return <div>{error.message}</div>;
    }
    return (
        <div onClick={() => setPaused(!paused)}>
            <svg width="100%" height="200px" xmlns="http://www.w3.org/2000/svg">
                {data.map((d, i) => drawableToSvg(d, i))}
            </svg>
        </div>
    );
};

const plugins: RenderPlugins = {
    animation: {
        id: 'animation',
        name: 'Animation',
        type: pureFunction([int], builtinType('Array', [refType('4a4abfb4')])),
        render: (fn: (n: number) => Array<Drawable>, evalEnv: EvalEnv) => {
            return <Animation evalEnv={evalEnv} fn={fn} />;
        },
    },
    drawable: {
        id: 'drawable',
        name: 'Drawable',
        type: refType('4a4abfb4'),
        render: (drawable: Drawable) => {
            return (
                <div>
                    <svg
                        width="100%"
                        height="100px"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {drawableToSvg(drawable)}
                    </svg>
                </div>
            );
        },
    },
    shape: {
        id: 'shape',
        name: 'Shape',
        type: refType('b1f0a4a6'),
        render: (shape: Shape) => {
            return (
                <div>
                    <svg
                        width="100%"
                        height="100px"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {drawableToSvg({
                            type: 'Drawable',
                            shape,
                            fill: 'none',
                            border: {
                                type: 'Ok',
                                value: {
                                    type: 'Border',
                                    width: 1,
                                    color: 'white',
                                },
                            },
                        })}
                    </svg>
                </div>
            );
        },
    },
    shapes: {
        id: 'shapes',
        name: 'Array<Shape>',
        type: builtinType('Array', [refType('b1f0a4a6')]),
        render: (shapes: Array<Shape>) => {
            return (
                <div>
                    <svg
                        width="100%"
                        height="100px"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {shapes.map((shape, i) =>
                            drawableToSvg(
                                {
                                    type: 'Drawable',
                                    shape,
                                    fill: 'none',
                                    border: {
                                        type: 'Ok',
                                        value: {
                                            type: 'Border',
                                            width: 1,
                                            color: 'white',
                                        },
                                    },
                                },
                                i,
                            ),
                        )}
                    </svg>
                </div>
            );
        },
    },
};

export default plugins;
