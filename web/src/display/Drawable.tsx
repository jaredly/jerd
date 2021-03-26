// My first little render plugin!

import * as React from 'react';
import { Type, TypeReference, UserReference } from '../../../src/typing/types';
import { builtinType, int, pureFunction } from '../../../src/typing/preset';
import { Plugins, PluginT } from '../Cell';

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
    location: null,
    effectVbls: [],
    typeVbls,
    ref: {
        type: 'user',
        id: { hash, pos: 0, size: 1 },
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

const Animation = ({ fn }: { fn: (n: number) => Array<Drawable> }) => {
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        let tick = 0;
        const tid = setInterval(() => {
            tick += 1;
            setData(fn(tick));
        }, 40);
        return () => clearInterval(tid);
    }, [fn]);
    return (
        <div>
            <svg
                width="100px"
                height="100px"
                xmlns="http://www.w3.org/2000/svg"
            >
                {data.map((d, i) => drawableToSvg(d, i))}
            </svg>
        </div>
    );
};

const plugins: Plugins = {
    animation: {
        id: 'animation',
        name: 'Animation',
        type: pureFunction([int], builtinType('Array', [refType('4a4abfb4')])),
        render: (fn: (n: number) => Array<Drawable>) => {
            return <Animation fn={fn} />;
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
                        width="100px"
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
                        width="100px"
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
                        width="100px"
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
