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

const plugin: PluginT = {
    id: 'drawable',
    name: 'Drawable',
    type: DrawableT,
    render: (drawable: Drawable) => {
        return <div>Hello folks {drawable.shape.type}</div>;
    },
};

export default plugin;
