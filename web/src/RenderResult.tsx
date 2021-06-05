/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import {
    addExpr,
    addDefine,
    addRecord,
    addEnum,
    idName,
    addEffect,
    idFromName,
} from '@jerd/language/src/typing/env';
import {
    EnumDef,
    Env,
    Id,
    RecordDef,
    selfEnv,
    Term,
    Type,
    typesEqual,
} from '@jerd/language/src/typing/types';
import {
    declarationToPretty,
    termToPretty,
    ToplevelT,
    toplevelToPretty,
} from '@jerd/language/src/printing/printTsLike';
import { printToAttributedText } from '@jerd/language/src/printing/printer';
import Editor from './Editor';
import { termToJS } from './eval';
import { renderAttributedText } from './Render';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import { void_ } from '@jerd/language/src/typing/preset';
import { Cell, Content, Display, EvalEnv, Plugins, PluginT } from './State';
import { nullLocation } from '@jerd/language/src/parsing/parser';
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
    collapsed,
    setCollapsed,
    onSetPlugin,
    onPin,
}: {
    onSetPlugin: (d: Display | null) => void;
    plugins: Plugins;
    cell: Cell;
    id: Id;
    env: Env;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
    collapsed: boolean | undefined;
    setCollapsed: (c: boolean) => void;
    onPin: (display: Display, id: Id) => void;
}) => {
    const hash = idName(id);
    // const term = env.global.terms[hash];

    // if (term.is.type !== 'lambda' && !evalEnv.terms[hash]) {
    //     return (
    //         <button
    //             css={{
    //                 cursor: 'pointer',
    //                 backgroundColor: 'transparent',
    //                 border: 'none',
    //                 fontFamily: 'inherit',
    //                 color: 'inherit',
    //                 margin: 8,
    //                 padding: '4px 8px',
    //                 ':hover': {
    //                     backgroundColor: 'rgba(100,100,100,0.3)',
    //                 },
    //             }}
    //             onClick={() => onRun(id)}
    //         >
    //             Evaluate
    //         </button>
    //     );
    // }

    React.useEffect(() => {
        if (evalEnv.terms[hash] == null) {
            onRun(id);
        }
    }, [evalEnv.terms[hash] == null]);

    if (evalEnv.terms[hash] == null) {
        return <span>Unevaluated</span>;
    }

    // if (collapsed) {
    //     return (
    //         <div
    //             style={{ cursor: 'pointer' }}
    //             onClick={() => setCollapsed(false)}
    //         >
    //             Collapsed
    //         </div>
    //     );
    // }

    const renderPlugin = getPlugin(
        plugins,
        env,
        cell.display,
        cell.content,
        evalEnv.terms[hash],
        evalEnv,
    );
    if (renderPlugin != null) {
        return (
            <RenderPlugin
                display={cell.display}
                plugins={plugins}
                onSetPlugin={onSetPlugin}
                onPin={() => onPin(cell.display!, idFromName(hash))}
            >
                {renderPlugin()}
            </RenderPlugin>
        );
    }

    const matching = getMatchingPlugins(plugins, env, cell);
    if (!matching || !matching.length) {
        if (cell.content.type === 'expr') {
            const t = env.global.terms[idName(cell.content.id)];
            console.log(showType(env, t.is));
            Object.keys(plugins).forEach((k) => {
                const err = getTypeError(
                    env,
                    t.is,
                    plugins[k].type,
                    nullLocation,
                );
                if (!err) {
                    console.error('its good', k);
                } else {
                    console.log(k, err.toString());
                }
            });
            console.log(
                cell.content,
                matching,
                cell.content.type,
                cell.display,
            );
            console.log(plugins);
        }
    }

    return (
        <div
            style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                position: 'relative',
                padding: 8,
            }}
        >
            {/* <button
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}
                onClick={() => setCollapsed(true)}
            >
                -
            </button> */}
            {typeof evalEnv.terms[hash] === 'function'
                ? null
                : JSON.stringify(evalEnv.terms[hash], null, 2)}
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
            ) : null
            // <div>No matching render plugins</div>
            }
        </div>
    );
};

export const getPlugin = (
    plugins: Plugins,
    env: Env,
    display: Display | undefined | null,
    content: Content,
    // cell: Cell,
    value: any,
    evalEnv: EvalEnv,
): (() => JSX.Element) | null => {
    if (!display || !plugins[display.type]) {
        return null;
    }
    switch (content.type) {
        case 'expr':
        case 'term':
            const t = env.global.terms[idName(content.id)];
            const plugin: PluginT = plugins[display.type];
            const err = getTypeError(env, t.is, plugin.type, nullLocation);
            if (err == null) {
                return () => plugin.render(value, evalEnv, env, t);
            }
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
    plugins: Plugins;
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
    plugins: Plugins,
    env: Env,
    cell: Cell,
): Array<string> | null => {
    switch (cell.content.type) {
        case 'expr':
        case 'term':
            const t = env.global.terms[idName(cell.content.id)];
            if (
                !cell.display ||
                !plugins[cell.display.type] ||
                !typesEqual(plugins[cell.display.type].type, t.is)
            ) {
                return Object.keys(plugins).filter((k) => {
                    if (
                        getTypeError(
                            env,
                            t.is,
                            plugins[k].type,
                            nullLocation,
                        ) == null
                    ) {
                        return true;
                    }
                });
            }
    }
    return null;
};
