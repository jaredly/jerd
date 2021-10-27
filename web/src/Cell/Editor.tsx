/** @jsx jsx */
// The editor bit

import { jsx } from '@emotion/react';
import { SyntaxError } from '@jerd/language/src/parsing/grammar';
import { idName } from '@jerd/language/src/typing/env';
import {
    LocatedError,
    TypeError,
    UnresolvedIdentifier,
} from '@jerd/language/src/typing/errors';
import { showLocation } from '@jerd/language/src/typing/typeExpr';
import { Env, Id, Symbol, Term, Type } from '@jerd/language/src/typing/types';

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

export const ShowError = ({
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
                Syntax error at {showLocation(err.location as any) + '\n'}
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

// const getRenderPlugin = (
//     plugins: RenderPlugins,
//     env: Env,
//     display: Display | null | undefined,
//     [typed, evaled]: [ToplevelT | null, any],
//     evalEnv: EvalEnv,
// ) => {
//     if (display == null || typed == null || evaled == null) {
//         return null;
//     }

//     const plugin = plugins[display.type];
//     if (!plugin) {
//         console.log('Unknown type?', display);
//         return;
//     }
//     let term: Term;
//     let id;
//     if (typed.type === 'Expression') {
//         term = typed.term;
//         id = { hash: hashObject(typed.term), size: 1, pos: 0 };
//     } else if (typed.type === 'Define') {
//         term = typed.term;
//         id = typed.id;
//     } else {
//         return null;
//     }
//     const err = getTypeError(
//         env,
//         term.is,
//         plugin.type,
//         nullLocation,
//         undefined,
//         true,
//     );
//     if (err == null) {
//         return () => plugin.render(evaled, evalEnv, env, term, false);
//     }

//     return null;
// };

const styles = {
    hash: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: '80%',
        color: 'rgba(255,255,255,0.5)',
    },
};
