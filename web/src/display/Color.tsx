// This is the fake one?
/* @jsx jsx */
import { jsx } from '@emotion/react';
import * as React from 'react';
import { RenderPlugins } from '../State';
import { Vec3 } from './OpenGL';

const plugins: RenderPlugins = {
    animation: {
        id: 'color-vec3',
        name: 'Color',
        type: Vec3,
        render: (v: { x: number; y: number; z: number }) => {
            return (
                <div
                    style={{
                        width: 40,
                        height: 40,
                        margin: 8,
                        backgroundColor: `rgb(${v.x * 255}, ${v.y * 255}, ${
                            v.z * 255
                        })`,
                    }}
                />
            );
        },
    },
};

export default plugins;
