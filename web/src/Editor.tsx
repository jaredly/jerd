/** @jsx jsx */
// The editor bit

import { jsx, withTheme } from '@emotion/react';
import * as React from 'react';
import { parse, SyntaxError } from '@jerd/language/src/parsing/grammar';
import { Toplevel } from '@jerd/language/src/parsing/parser';
import {
    printToAttributedText,
    printToString,
} from '@jerd/language/src/printing/printer';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { showLocation } from '@jerd/language/src/typing/typeExpr';
import {
    Env,
    Id,
    newWithGlobal,
    Symbol,
    Term,
    Type,
    nullLocation,
} from '@jerd/language/src/typing/types';
import {
    hashObject,
    idName,
    typeToplevelT,
    ToplevelT,
} from '@jerd/language/src/typing/env';
import { renderAttributedText } from './Render';
import AutoresizeTextarea from 'react-textarea-autosize';
import {
    LocatedError,
    TypeError,
    UnresolvedIdentifier,
} from '@jerd/language/src/typing/errors';
import { Display, EvalEnv, RenderPlugins } from './State';
import { runTerm } from './eval';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import ColorTextarea from './ColorTextarea';
import { RenderPlugin } from './RenderResult';
import { Selection } from './Cell';
import { addLocationIndices } from '../../language/src/typing/analyze';
import { Action } from './Cells';

type AutoName =
    | { type: 'local'; name: string; defn: { sym: Symbol; type: Type } }
    | { type: 'global'; name: string; id: Array<Id>; term: Term };

const AutoComplete = ({ env, name }: { env: Env; name: string }) => {
    const matchingNames: Array<AutoName> = Object.keys(env.local.localNames)
        .filter((n) => n.toLowerCase().startsWith(name.toLowerCase()))
        .map(
            (name) =>
                ({
                    type: 'local',
                    name,
                    defn: env.local.locals[env.local.localNames[name]],
                } as AutoName),
        )
        .concat(
            Object.keys(env.global.names)
                .filter((n) => n.toLowerCase().startsWith(name.toLowerCase()))
                .map(
                    (name) =>
                        ({
                            type: 'global',
                            name,
                            id: env.global.names[name],
                            term:
                                env.global.terms[
                                    idName(env.global.names[name][0])
                                ],
                        } as AutoName),
                ),
        );
    if (!matchingNames.length) {
        return <div>No defined names matching {name}</div>;
    }
    return (
        <div>
            <div>Did you mean...</div>
            {matchingNames.map((n, i) => (
                <div
                    key={
                        n.type === 'global'
                            ? idName(n.id[0])
                            : n.defn.sym.unique
                    }
                >
                    {n.name}#
                    {n.type === 'global'
                        ? idName(n.id[0])
                        : ':' + n.defn.sym.unique}
                    {/* {n}#{idName(env.global.names[n])} */}
                </div>
            ))}
        </div>
    );
};

const white = (num: number) => {
    let r = '';
    for (let i = 0; i < num; i++) {
        r += ' ';
    }
    return r;
};

const ShowError = ({
    err,
    env,
    text,
}: {
    err: Error;
    env: Env;
    text: string;
}) => {
    if (err instanceof UnresolvedIdentifier) {
        return <AutoComplete env={err.env} name={err.id.text} />;
    }
    const lines = text.split(/\n/g);
    if (err instanceof SyntaxError) {
        console.log('syntax error', err);
        console.log(Object.keys(err));
        console.log(err.expected, err.found, err.location, err.name);
        return (
            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                Syntax error at {showLocation(err.location) + '\n'}
                {lines[err.location.start.line - 1] + '\n'}
                {white(err.location.start.column - 1) + '^\n'}
                {lines
                    .slice(err.location.start.line, err.location.end.line + 2)
                    .join('\n')}
            </div>
        );
    }
    if (err instanceof LocatedError && err.loc) {
        return (
            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {err.toString()} at {showLocation(err.loc) + '\n'}
                {lines[err.loc.start.line - 1] + '\n'}
                {white(err.loc.start.column - 1) + '^\n'}
                {lines
                    .slice(err.loc.start.line, err.loc.end.line + 2)
                    .join('\n')}
            </div>
        );
    }
    if (err instanceof TypeError) {
        return <div>{err.toString()}</div>;
    }
    console.log('error here we are');
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
    dispatch,
    // onPin,
    onSetPlugin,
    maxWidth,
    selection,
    setSelection,
    text,
    evaled,
    typed,
    setText,
    err,
}: {
    env: Env;
    maxWidth: number;
    selection: Selection;
    setSelection: (fn: (s: Selection) => Selection) => void;
    onSetPlugin: (plugin: Display | null) => void;
    contents: ToplevelT | null;
    onClose: (term: ToplevelT | null) => void;
    onChange: (term: ToplevelT | string) => void;
    // onPin: (display: Display, id: Id) => void;
    dispatch: (action: Action) => void;
    evalEnv: EvalEnv;
    display: Display | null | undefined;
    plugins: RenderPlugins;
    text: string;
    evaled: any;
    typed: ToplevelT | null;
    setText: (text: string) => void;
    err: Error | null;
}) => {
    const lastValidResult = React.useRef(null as null | [ToplevelT, any]);
    if (typed != null && evaled != null) {
        lastValidResult.current = [typed, evaled];
    }

    // START HERE: Move this up to Cell.tsx
    const renderPlugin = getRenderPlugin(
        plugins,
        env,
        display,
        lastValidResult.current ? lastValidResult.current : [typed, evaled],
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
                    unique={
                        contents && contents.type === 'RecordDef'
                            ? contents.def.unique
                            : null
                    }
                    selection={{
                        idx: selection.idx,
                        node: selection.node,
                        pos: 'change',
                    }}
                    updateSelection={(newSel) =>
                        setSelection((s) =>
                            newSel
                                ? {
                                      idx: newSel.idx,
                                      marks: [],
                                      node: newSel.node,
                                      level: 'text',
                                  }
                                : { ...s, node: null },
                        )
                    }
                    onChange={(text: string) => setText(text)}
                    onKeyDown={(evt: any) => {
                        if (evt.metaKey && evt.key === 'Enter') {
                            console.log('apply and stuff');
                            onChange(typed == null ? text : typed);
                        }
                        if (evt.key === 'Escape') {
                            onClose(typed);
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
                        onClick={() => onClose(null)}
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
                    onPin={() =>
                        dispatch({
                            type: 'pin',
                            display: display!,
                            id: getId(typed!),
                        })
                    }
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
                    <ShowError err={err} env={env} text={text} />
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
    plugins: RenderPlugins,
    env: Env,
    display: Display | null | undefined,
    [typed, evaled]: [ToplevelT | null, any],
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
    const err = getTypeError(
        env,
        term.is,
        plugin.type,
        nullLocation,
        undefined,
        true,
    );
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
