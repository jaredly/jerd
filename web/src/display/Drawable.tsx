// My first little render plugin!

import * as React from 'react';
import { TypeReference, UserReference } from '../../../src/typing/types';
import { PluginT } from '../Cell';

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

const DrawableT: TypeReference = {
    type: 'ref',
    location: null,
    effectVbls: [],
    typeVbls: [],
    ref: {
        type: 'user',
        id: { hash: '4a4abfb4', pos: 0, size: 1 },
    },
};

export const drawableToSvg = (d: Drawable) => {
    if (d.shape.type === 'Circle') {
        return (
            <circle cx={d.shape.x} cy={d.shape.y} r={d.shape.r} fill={d.fill} />
        );
    }
    if (d.shape.type === 'Box') {
        return (
            <rect
                x={d.shape.x}
                y={d.shape.y}
                width={d.shape.w}
                height={d.shape.h}
                fill={d.fill}
            />
        );
    }
};

const plugin: PluginT = {
    id: 'drawable',
    name: 'Drawable',
    type: DrawableT,
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
};

export default plugin;
