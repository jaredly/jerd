/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import { idName, idFromName } from '@jerd/language/src/typing/env';
import {
    Env,
    Id,
    nullLocation,
    Term,
    Type,
    typesEqual,
} from '@jerd/language/src/typing/types';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import {
    Cell,
    Content,
    Display,
    EvalEnv,
    RenderPlugins,
    RenderPluginT,
} from './State';
import { showType } from '@jerd/language/src/typing/unify';

/*

What do I want here?
This is for terms and exprs (so, named an unnamed terms really)

Really we're talking about display plugins.
The default one is "json", right? Or something close to it, ideally.
That would also keep track of functions and stuff.

soo should I just auto-evaluate everything as the page loads? That might be a good idea honestly.
Like why would we ever have stuff not be evaluated.

Anyway, 

*/

export const RenderResult = ({
    plugins,
    cell,
    id,
    env,
    evalEnv,
    onRun,
    onSetPlugin,
    value,
    term,
    onPin,
}: {
    onSetPlugin: (d: Display | null) => void;
    plugins: RenderPlugins;
    cell: Cell;
    id: Id;
    env: Env;
    evalEnv: EvalEnv;
    value: any;
    term: Term;
    onRun: (id: Id) => void;
    onPin: (display: Display, id: Id) => void;
}) => {
    // const hash = idName(id);

    // const term = env.global.terms[hash];

    React.useEffect(() => {
        if (value == null) {
            onRun(id);
        }
    }, [value == null]);

    if (value == null) {
        return <span>Unevaluated</span>;
    }

    const renderPlugin = getPlugin(
        plugins,
        env,
        cell.display,
        term,
        value,
        evalEnv,
    );
    if (renderPlugin != null) {
        return (
            <RenderPlugin
                display={cell.display}
                plugins={plugins}
                onSetPlugin={onSetPlugin}
                onPin={() => onPin(cell.display!, id)}
            >
                {renderPlugin()}
            </RenderPlugin>
        );
    }

    const matching = getMatchingPlugins(plugins, env, cell.display, term.is);

    return (
        <div
            style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                position: 'relative',
                padding: 8,
            }}
        >
            {typeof value === 'function'
                ? null
                : JSON.stringify(value, null, 2)}
            {matching && matching.length ? (
                <div>
                    <h4>Available render plugins</h4>

                    {matching.map((k) => (
                        <button
                            key={k}
                            onClick={() => {
                                onSetPlugin({ type: k, opts: {} });
                            }}
                        >
                            {plugins[k].name}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export const getPlugin = (
    plugins: RenderPlugins,
    env: Env,
    display: Display | undefined | null,
    term: Term,
    value: any,
    // TODO: I only need the "control ovjects" here,
    // not the terms or builtins. It would be nice to
    // extract those out
    evalEnv: EvalEnv,
): (() => JSX.Element) | null => {
    if (!display || !plugins[display.type]) {
        return null;
    }
    const plugin: RenderPluginT = plugins[display.type];
    const err = getTypeError(env, term.is, plugin.type, nullLocation);
    if (err == null) {
        return () => plugin.render(value, evalEnv, env, term, true);
    }
    return null;
};

export const RenderPlugin = ({
    children,
    display,
    plugins,
    onSetPlugin,
    onPin,
}: {
    children: React.ReactNode;
    display: Display | undefined | null;
    plugins: RenderPlugins;
    onSetPlugin: (name: Display | null) => void;
    onPin: null | (() => void);
}) => {
    const [zoom, setZoom] = React.useState(false);
    return (
        <div
            style={{
                // padding: 8,
                border: '2px solid #2b2b2b',
                borderRadius: 4,
                position: 'relative',
                ...(zoom
                    ? {
                          position: 'fixed',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          background: 'black',
                      }
                    : null),
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    padding: 8,
                    paddingTop: 6,
                    backgroundColor: !zoom ? '#2b2b2b' : 'transparent',
                    fontSize: '80%',
                    borderRadius: 4,
                }}
            >
                <button
                    css={{
                        cursor: 'pointer',
                        fontSize: '50%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        padding: 0,
                        marginRight: zoom ? 0 : 8,
                    }}
                    onClick={() => setZoom(!zoom)}
                >
                    🔍
                </button>
                {!zoom ? (
                    <span>
                        {onPin ? (
                            <button
                                css={{
                                    cursor: 'pointer',
                                    fontSize: '50%',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'inherit',
                                    padding: 0,
                                    marginRight: 8,
                                }}
                                onClick={() => onPin()}
                            >
                                📌
                            </button>
                        ) : null}
                        {plugins[display!.type].name}
                        <button
                            css={{
                                cursor: 'pointer',
                                fontSize: '50%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'inherit',
                                padding: 0,
                                marginLeft: 8,
                            }}
                            onClick={() => onSetPlugin(null)}
                        >
                            ╳
                        </button>
                    </span>
                ) : null}
            </div>

            <div style={{ padding: 8 }}>{children}</div>
        </div>
    );
};

const getMatchingPlugins = (
    plugins: RenderPlugins,
    env: Env,
    display: Display | null | undefined,
    type: Type,
): Array<string> | null => {
    if (
        !display ||
        !plugins[display.type] ||
        !typesEqual(plugins[display.type].type, type)
    ) {
        return Object.keys(plugins).filter((k) => {
            if (
                getTypeError(env, type, plugins[k].type, nullLocation) == null
            ) {
                return true;
            }
        });
    }
    return null;
};
