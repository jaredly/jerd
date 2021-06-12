/* @jsx jsx */
import { jsx } from '@emotion/react';
// My first little render plugin!

import * as React from 'react';
import { void_ } from '@jerd/language/src/typing/preset';
import { RenderPlugins } from '../State';
import { handleSimpleShallow2 } from '@jerd/language/src/printing/builtins';
import { idFromName } from '@jerd/language/src/typing/env';
import { nullLocation } from '../../../language/src/typing/types';

type Output = { type: 'out'; text: string } | { type: 'in'; text: string };

const ChatBot = ({ fn }: { fn: any }) => {
    const [state, setState] = React.useState({
        output: [] as Array<Output>,
        cont: null as ((value: string) => void) | null,
        completed: false,
    });
    const [value, setValue] = React.useState('');

    const handleOnce = React.useCallback((fn, handlers, done) => {
        handleSimpleShallow2(
            '7426668e',
            fn,
            [
                (handlers, value: any, k) => {
                    setState((state) => ({
                        ...state,
                        cont: (readValue) =>
                            handleOnce(
                                (handlers: any, done: any) =>
                                    k(readValue, handlers, done),
                                handlers,
                                done,
                            ),
                    }));
                },
                (handlers, value: string, k) => {
                    setState((state) => ({
                        ...state,
                        output: state.output.concat([
                            { type: 'out', text: value },
                        ]),
                    }));
                    handleOnce(
                        (handlers: any, done: any) => k(null, handlers, done),
                        handlers,
                        done,
                    );
                },
            ],
            (handlers, fnReturnValue) => {
                done(handlers, fnReturnValue);
            },
            handlers,
        );
    }, []);

    React.useEffect(() => {
        setState({
            output: [],
            cont: null,
            completed: false,
        });
        handleOnce(fn, null, (_: any, value: any) =>
            setState((state) => ({ ...state, completed: true })),
        );
    }, [fn]);

    return (
        <div
            style={{
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
            }}
        >
            {state.output.map((o, i) => (
                <div key={i} style={{ padding: 4 }}>
                    {o.type === 'out' ? '>' : '<'} {o.text}
                </div>
            ))}
            {state.cont && !state.completed ? (
                <div
                    style={{
                        padding: 4,
                    }}
                >
                    <input
                        style={{
                            fontFamily: 'inherit',
                            color: 'inherit',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(100,100,100,0.4)',
                            padding: 4,
                        }}
                        value={value}
                        onChange={(evt) => setValue(evt.target.value)}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Enter') {
                                setValue('');
                                const text = evt.currentTarget.value;
                                setState((state) => ({
                                    ...state,
                                    output: state.output.concat([
                                        {
                                            type: 'in',
                                            text,
                                        },
                                    ]),
                                }));
                                if (state.cont) {
                                    state.cont(text);
                                }
                            }
                        }}
                    />
                </div>
            ) : null}
            {state.completed ? (
                <button
                    css={{
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontFamily: 'inherit',
                        color: 'inherit',
                        margin: 4,
                        padding: '4px 8px',
                        ':hover': {
                            backgroundColor: 'rgba(100,100,100,0.3)',
                        },
                    }}
                    onClick={() => {
                        setState({
                            output: [],
                            cont: null,
                            completed: false,
                        });
                        handleOnce(fn, null, (_: any, value: any) =>
                            setState((state) => ({
                                ...state,
                                completed: true,
                            })),
                        );
                    }}
                >
                    Execution complete. Restart?
                </button>
            ) : null}
        </div>
    );
};

const plugins: RenderPlugins = {
    basic: {
        id: 'basic',
        name: 'Stdio',
        type: {
            type: 'lambda',
            typeVbls: [],
            effectVbls: [],
            args: [],
            effects: [
                {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id: idFromName('7426668e'),
                    },
                },
            ],
            rest: null,
            res: void_,
            location: nullLocation,
        },
        render: (fn: (handlers: any, done: any) => void) => {
            return <ChatBot fn={fn} />;
        },
    },
};

export default plugins;
