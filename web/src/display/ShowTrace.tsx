import * as React from 'react';
import { Env } from '@jerd/language/src/typing/types';
import { Trace } from '../Cell/Editor';
import { hashStyle } from '../Cell/Cell';
import { Vec4 } from './OpenGL';
import { nameForId } from '@jerd/language/src/typing/env';

export const ShowTrace = ({
    trace: { color, traces },
    env,
    pos,
}: {
    trace: { color: Vec4; traces: { [key: string]: Array<Array<Trace>> } };
    env: Env;
    pos: { x: number; y: number };
}) => {
    return (
        <div
            style={{
                fontFamily: '"Source Code Pro", monospace',
                whiteSpace: 'pre-wrap',
            }}
        >
            <div style={{ display: 'flex', padding: '8px 0' }}>
                Output color at ({pos.x}, {pos.y}):
                <div
                    style={{
                        width: 20,
                        height: 20,
                        marginLeft: 8,
                        border: '1px solid black',
                        backgroundColor: `rgba(${color.x * 255},${
                            color.y * 255
                        },${color.z * 255}, ${color.w})`,
                    }}
                ></div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                }}
            >
                {Object.keys(traces).map((hash) =>
                    traces[hash].map((items, i) => (
                        <div key={`${hash}:${i}`}>
                            <div>
                                <span style={hashStyle}>
                                    {nameForId(env, hash)
                                        ? nameForId(env, hash) + '#' + hash
                                        : '#' + hash}
                                </span>
                                trace {i}
                            </div>
                            {items.length > 10 ? (
                                <div>
                                    {items.slice(0, 5).map((item, j) => (
                                        <TraceItem i={j} item={item} key={j} />
                                    ))}
                                    ...
                                    {items.slice(-5).map((item, j) => (
                                        <TraceItem
                                            i={items.length - 5 + j}
                                            item={item}
                                            key={items.length - 5 + j}
                                        />
                                    ))}
                                </div>
                            ) : (
                                items.map((item, j) => (
                                    <TraceItem i={j} item={item} key={j} />
                                ))
                            )}
                        </div>
                    )),
                )}
            </div>
        </div>
    );
};

const TraceItem = ({ i, item }: { i: number; item: Trace }) => {
    return (
        <div>
            {i}: {showItem(item.arg)}{' '}
            {item.others.length
                ? item.others.map((v, i) => (
                      <span key={i} style={{ marginRight: 8 }}>
                          {showItem(v)}
                      </span>
                  ))
                : null}
        </div>
    );
};

const showItem = (value: any) => {
    if (!value || typeof value === 'string') {
        return JSON.stringify(value);
    }
    if (typeof value === 'function') {
        return `Function with ${value.length} arguments`;
    }
    if (typeof value === 'number') {
        if (Math.floor(value) === value) {
            return value.toString();
        } else {
            return value.toFixed(4);
        }
    }
    if (typeof value === 'object') {
        if (value.type === 'Vec2') {
            return `(${value.x.toFixed(4)}, ${value.y.toFixed(4)})`;
        }
        if (value.type === 'Vec3') {
            return `(${value.x.toFixed(4)}, ${value.y.toFixed(
                2,
            )}, ${value.z.toFixed(4)})`;
        }
        if (value.type === 'Vec4') {
            return `(${value.x.toFixed(4)}, ${value.y.toFixed(
                2,
            )}, ${value.z.toFixed(4)}, ${value.w.toFixed(4)})`;
        }
    }
    return JSON.stringify(value);
};
