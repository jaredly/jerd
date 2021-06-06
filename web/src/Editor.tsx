/** @jsx jsx */
// The editor bit

import { jsx } from '@emotion/react';
import * as React from 'react';
import { parse, SyntaxError } from '@jerd/language/src/parsing/grammar';
import { nullLocation, Toplevel } from '@jerd/language/src/parsing/parser';
import {
    printToAttributedText,
    printToString,
} from '@jerd/language/src/printing/printer';
import {
    toplevelToPretty,
    ToplevelT,
} from '@jerd/language/src/printing/printTsLike';
import { showLocation } from '@jerd/language/src/typing/typeExpr';
import {
    Env,
    Id,
    newWithGlobal,
    Symbol,
    Term,
    Type,
} from '@jerd/language/src/typing/types';
import {
    hashObject,
    idName,
    typeToplevelT,
} from '@jerd/language/src/typing/env';
import { renderAttributedText } from './Render';
import AutoresizeTextarea from 'react-textarea-autosize';
import {
    TypeError,
    UnresolvedIdentifier,
} from '@jerd/language/src/typing/errors';
import { Display, EvalEnv, Plugins } from './State';
import { runTerm } from './eval';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import ColorTextarea from './ColorTextarea';
import { RenderPlugin } from './RenderResult';

type AutoName =
    | { type: 'local'; name: string; defn: { sym: Symbol; type: Type } }
    | { type: 'global'; name: string; id: Id; term: Term };

const AutoComplete = ({ env, name }: { env: Env; name: string }) => {
    const matchingNames: Array<AutoName> = Object.keys(env.local.localNames)
        .filter((n) => n.toLowerCase().startsWith(name.toLowerCase()))
        .map((name) => ({
            type: 'local',
            name,
            defn: env.local.locals[env.local.localNames[name]],
        }));
    Object.keys(env.global.names)
        .filter((n) => n.toLowerCase().startsWith(name.toLowerCase()))
        .map((name) => ({
            type: 'global',
            name,
            id: env.global.names[name],
            term: env.global.terms[idName(env.global.names[name][0])],
        }));
    if (!matchingNames.length) {
        return <div>No defined names matching {name}</div>;
    }
    return (
        <div>
            <div>Did you mean...</div>
            {matchingNames.map((n, i) => (
                <div
                    key={n.type === 'global' ? idName(n.id) : n.defn.sym.unique}
                >
                    {n.name}#
                    {n.type === 'global'
                        ? idName(n.id)
                        : ':' + n.defn.sym.unique}
                    {/* {n}#{idName(env.global.names[n])} */}
                </div>
            ))}
        </div>
    );
};

const ShowError = ({ err, env }: { err: Error; env: Env }) => {
    if (err instanceof UnresolvedIdentifier) {
        return <AutoComplete env={err.env} name={err.id.text} />;
        // return <div>Unresolved {err.id.text}</div>;
    }
    if (err instanceof SyntaxError) {
        return <div>Syntax error at {showLocation(err.location)}</div>;
    }
    if (err instanceof TypeError) {
        return <div>{err.toString()}</div>;
    }
    console.log(err);
    return <div>{err.message}</div>;
};

export type Trace = { ts: number; arg: any; others: Array<any> };

export type Traces = {
    [idName: string]: Array<Array<Trace>>;
};

export default ({
    env,
    contents,
    onClose,
    onChange,
    evalEnv,
    display,
    plugins,
    onPin,
    onSetPlugin,
    maxWidth,
}: {
    env: Env;
    maxWidth: number;
    onSetPlugin: (plugin: Display | null) => void;
    contents: ToplevelT | string;
    onClose: () => void;
    onChange: (term: ToplevelT | string) => void;
    onPin: (display: Display, id: Id) => void;
    evalEnv: EvalEnv;
    display: Display | null | undefined;
    plugins: Plugins;
}) => {
    const evalCache = React.useRef({} as { [key: string]: any });

    const [traces, setTraces] = React.useState({} as Traces);

    const [text, setText] = React.useState(() => {
        return typeof contents === 'string'
            ? contents
            : printToString(toplevelToPretty(env, contents), 50);
    });

    const [typed, err]: [ToplevelT | null, Error | null] = React.useMemo(() => {
        if (text.trim().length === 0) {
            return [null, null];
        }
        try {
            const parsed: Array<Toplevel> = parse(text);
            if (parsed.length > 1) {
                return [
                    null,
                    { type: 'error', message: 'multiple toplevel items' },
                ];
            }
            return [
                typeToplevelT(
                    newWithGlobal(env.global),
                    parsed[0],
                    typeof contents !== 'string' &&
                        contents.type === 'RecordDef'
                        ? contents.def.unique
                        : null,
                ),
                null,
            ];
        } catch (err) {
            return [null, err];
        }
    }, [text]);

    // TODO: cache these intermediate

    const evaled = React.useMemo(() => {
        if (typed && (typed.type === 'Expression' || typed.type === 'Define')) {
            const id =
                typed.type === 'Expression'
                    ? { hash: hashObject(typed.term), size: 1, pos: 0 }
                    : typed.id;
            const already = evalEnv.terms[idName(id)];
            // oooh hm should the traces be part of the evalCache? it might want to be...
            // because we cache these things...
            // anyway, let's leave this for the moment. it doesn't actually matter just yet
            if (already) {
                return already;
            } else if (evalCache.current[idName(id)] != null) {
                return evalCache.current[idName(id)];
            } else {
                try {
                    setTraces({});
                    const v = runTerm(env, typed.term, id, evalEnv)[idName(id)];
                    evalCache.current[idName(id)] = v;
                    return v;
                } catch (err) {
                    console.log('Failure while evaling', err);
                    //
                }
            }
        }
        return null;
    }, [typed]);

    const renderPlugin = getRenderPlugin(
        plugins,
        env,
        display,
        typed,
        evaled,
        evalEnv,
    );

    return (
        <div style={{ marginRight: 10 }}>
            <div css={{ position: 'relative' }}>
                <ColorTextarea
                    // NOTE: this is ~uncontrolled at the moment.
                    value={text}
                    env={env}
                    maxWidth={maxWidth}
                    contents={contents}
                    onChange={(text: string) => setText(text)}
                    onKeyDown={(evt: any) => {
                        if (evt.metaKey && evt.key === 'Enter') {
                            console.log('run it');
                            onChange(typed == null ? text : typed);
                        }
                        if (evt.key === 'Escape') {
                            onClose();
                        }
                    }}
                />
                <div
                    css={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                    }}
                >
                    <button
                        onClick={() => onChange(typed == null ? text : typed)}
                        css={{
                            padding: '4px 8px',
                            fontWeight: 200,
                            borderRadius: 4,
                            border: 'none',
                            fontFamily: 'inherit',
                            backgroundColor: 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                            ':hover': {
                                backgroundColor: '#2b2b2b',
                            },
                        }}
                    >
                        save
                    </button>

                    <button
                        onClick={onClose}
                        css={{
                            padding: '4px 8px',
                            fontWeight: 200,
                            borderRadius: 4,
                            border: 'none',
                            fontFamily: 'inherit',
                            backgroundColor: 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                            ':hover': {
                                backgroundColor: '#2b2b2b',
                            },
                        }}
                    >
                        cancel
                    </button>
                </div>
            </div>
            {renderPlugin != null ? (
                <RenderPlugin
                    // onPin={null}
                    onPin={() => onPin(display!, getId(typed!))}
                    display={display}
                    plugins={plugins}
                    onSetPlugin={onSetPlugin}
                >
                    {renderPlugin()}
                </RenderPlugin>
            ) : null}
            <div
                style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: '"Source Code Pro", monospace',
                    padding: 8,
                    position: 'relative',
                }}
            >
                {err != null ? (
                    <ShowError err={err} env={env} />
                ) : typed == null ? null : (
                    renderAttributedText(
                        env.global,
                        printToAttributedText(
                            toplevelToPretty(env, typed),
                            maxWidth,
                        ),
                    )
                )}
                {typed != null && (typed as any).id != null ? (
                    // @ts-ignore
                    <div style={styles.hash}>#{idName(typed.id)}</div>
                ) : null}
            </div>
            {JSON.stringify(evaled)}
            {/* {JSON.stringify(traces)} */}
        </div>
    );
};

const getId = (typed: ToplevelT): Id => {
    if (typed.type === 'Expression') {
        return { hash: hashObject(typed.term), size: 1, pos: 0 };
    }
    if (typed.type === 'Define') {
        return typed.id;
    }
    throw new Error(`No id for ${typed.type}`);
};

const getRenderPlugin = (
    plugins: Plugins,
    env: Env,
    display: Display | null | undefined,
    typed: ToplevelT | null,
    evaled: any,
    evalEnv: EvalEnv,
) => {
    if (display == null || typed == null || evaled == null) {
        return null;
    }

    const plugin = plugins[display.type];
    if (!plugin) {
        console.log('Unknown type?', display);
        return;
    }
    let term: Term;
    let id;
    if (typed.type === 'Expression') {
        term = typed.term;
        id = { hash: hashObject(typed.term), size: 1, pos: 0 };
    } else if (typed.type === 'Define') {
        term = typed.term;
        id = typed.id;
    } else {
        return null;
    }
    const err = getTypeError(env, term.is, plugin.type, nullLocation);
    if (err == null) {
        return () => plugin.render(evaled, evalEnv, env, term, false);
    }

    return null;
};

const styles = {
    hash: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: '80%',
        color: 'rgba(255,255,255,0.5)',
    },
};
