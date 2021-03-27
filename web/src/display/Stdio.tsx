/* @jsx jsx */
import { jsx } from '@emotion/react';
// My first little render plugin!

import * as React from 'react';
import {
    Type,
    TypeReference,
    UserReference,
} from '@jerd/language/src/typing/types';
import {
    builtinType,
    int,
    pureFunction,
    void_,
} from '@jerd/language/src/typing/preset';
import { Plugins } from '../Cell';
import { handleSimpleShallow2 } from '@jerd/language/src/printing/prelude';

const ChatBot = ({ fn }) => {
    const [state, setState] = React.useState({
        output: [],
        cont: null,
        completed: false,
    });
    const [value, setValue] = React.useState('');

    const handleOnce = React.useCallback((fn, handlers, done) => {
        handleSimpleShallow2(
            '7426668e',
            fn,
            [
                (handlers, value, k) => {
                    setState((state) => ({
                        ...state,
                        cont: (readValue) =>
                            handleOnce(
                                (handlers, done) =>
                                    k(readValue, handlers, done),
                                handlers,
                                done,
                            ),
                    }));
                },
                (handlers, value, k) => {
                    setState((state) => ({
                        ...state,
                        output: state.output.concat([
                            { type: 'out', text: value },
                        ]),
                    }));
                    handleOnce(
                        (handlers, done) => k(null, handlers, done),
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
        handleOnce(fn, null, (_, value) =>
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
                        autoFocus
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
                                state.cont(text);
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
                        handleOnce(fn, null, (_, value) =>
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

const plugins: Plugins = {
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
                        id: { hash: '7426668e', size: 1, pos: 0 },
                    },
                },
            ],
            rest: null,
            res: void_,
            location: null,
        },
        render: (fn: (handlers: any, done: any) => void) => {
            return <ChatBot fn={fn} />;
        },
    },
};

export default plugins;
