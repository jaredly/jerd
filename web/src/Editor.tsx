// The editor bit

import * as React from 'react';
import { parse, SyntaxError } from '../../src/parsing/grammar';
import { Expression, Toplevel } from '../../src/parsing/parser';
import {
    printToAttributedText,
    printToString,
} from '../../src/printing/printer';
import {
    termToPretty,
    toplevelToPretty,
    ToplevelT,
} from '../../src/printing/printTsLike';
import typeExpr, { showLocation } from '../../src/typing/typeExpr';
import { EnumDef, Env, Id, Symbol, Term, Type } from '../../src/typing/types';
import { idName, typeToplevelT } from '../../src/typing/env';
import { renderAttributedText } from './Render';
import AutoresizeTextarea from 'react-textarea-autosize';
import { TypeError, UnresolvedIdentifier } from '../../src/typing/errors';

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
            term: env.global.terms[idName(env.global.names[name])],
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
                        : 'sym#' + n.defn.sym.unique}
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

export default ({
    env,
    contents,
    onClose,
    onChange,
}: {
    env: Env;
    contents: ToplevelT | string;
    onClose: () => void;
    onChange: (term: ToplevelT | string) => void;
}) => {
    const [text, setText] = React.useState(() => {
        return typeof contents === 'string'
            ? contents
            : printToString(toplevelToPretty(env, contents), 50);
    });
    const [typed, err] = React.useMemo(() => {
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
                    env,
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

    return (
        <div style={{ marginRight: 10 }}>
            {/* <div
                contentEditable
                autoCorrect="false"
                spellCheck="false"
                style={{
                    whiteSpace: 'pre',
                    fontFamily: '"Source Code Pro", monospace',
                }}
            >
                {renderAttributedText(
                    env.global,
                    printToAttributedText(toplevelToPretty(env, typed), 80),
                    null,
                    true,
                )}
            </div> */}
            <AutoresizeTextarea
                value={text}
                autoFocus
                // onBlur={() => {
                //     onClose();
                // }}
                onChange={(evt) => setText(evt.target.value)}
                onKeyDown={(evt) => {
                    if (evt.metaKey && evt.key === 'Enter') {
                        console.log('run it');
                        onChange(typed == null ? text : typed);
                    }
                    if (evt.key === 'Escape') {
                        onClose();
                    }
                }}
                style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    fontFamily: '"Source Code Pro", monospace',
                    // height: 200,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    padding: 8,
                    border: 'none',
                    fontSize: 'inherit',
                    outline: 'none',
                }}
            />
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
                        printToAttributedText(toplevelToPretty(env, typed), 50),
                    )
                )}
                {typed != null && typed.id != null ? (
                    // @ts-ignore
                    <div style={styles.hash}>#{idName(typed.id)}</div>
                ) : null}
            </div>
        </div>
    );
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
