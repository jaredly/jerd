/** @jsx jsx */
import { jsx } from '@emotion/react';
// A cmd-p menu for pulling things up quickly

// Behavior
// # Search
// - with no input, list the most recently used things (grouping things with the same name)
// - with some input, do fuzzy matching on the name
// - if you select a type and tab, that becomes the search term, and we're now searching for usages
//   - this should all be well indexed in a `termRelations` table (user: id, used: id)
// # Commands
// - import/export environment
// - um probably some refactoring commands? idk

import * as React from 'react';
import { printToAttributedText } from '@jerd/language/src/printing/printer';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { idFromName, idName, ToplevelT } from '@jerd/language/src/typing/env';
import {
    Env,
    idsEqual,
    nullLoc,
    nullLocation,
} from '@jerd/language/src/typing/types';
import { Index, Indices } from '../App';
import { HashIcon } from '../HashIcon';
import { renderAttributedText } from '../Cell/Render';
import { Content } from '../State';

export type Props = {
    env: Env;
    index: Indices;
    onClose: () => unknown;
    onOpen: (content: Content) => void;
};

export type State = {
    input: string;
    selected: number;
    hashIdx: number;
    refered: Array<Option>;
};

export type Option = {
    title: React.ReactNode;
    onClick: () => void;
    subOptions: Array<Option>;
    toplevel?: ToplevelT;
};

const optionForTerms = (
    name: string,
    env: Env,
    onOpen: (c: Content) => void,
): null | Option => {
    const ids = env.global.names[name];
    if (!ids) {
        return null;
    }
    const tops: Array<ToplevelT> = ids.map((id) => ({
        type: 'Define',
        name,
        term: env.global.terms[idName(id)],
        location: env.global.terms[idName(id)].location,
        id,
    }));
    return {
        title: name,
        toplevel: tops[0],
        onClick: () => {
            onOpen({
                type: 'term',
                id: ids[0],
            });
        },
        subOptions: ids.map((id, i) => ({
            title: '#' + idName(id),
            toplevel: tops[i],
            onClick: () => onOpen({ type: 'term', id }),
            referent: { type: 'term' },
            subOptions: [],
        })),
    };
};

const optionForTypes = (
    name: string,
    env: Env,
    onOpen: (c: Content) => void,
): Option => {
    const ids = env.global.typeNames[name];
    const tops = ids.map((id): ToplevelT | undefined => {
        const defn = env.global.types[idName(id)];
        if (defn.type === 'Record') {
            return {
                type: 'RecordDef',
                id,
                def: defn,
                attrNames: env.global.recordGroups[idName(id)],
                location: defn.location,
                name,
            };
        }
    });
    return {
        title: '(t)' + name,
        toplevel: tops[0],
        onClick: () => {
            if (tops[0] && tops[0].type === 'RecordDef') {
                onOpen({
                    type: 'record',
                    id: ids[0],
                });
            }
        },
        subOptions: ids.map((id, i) => ({
            title: '#' + idName(id),
            toplevel: tops[i],
            subOptions: [],
            onClick: () => {
                const t = tops[i];
                if (t && t.type === 'RecordDef') {
                    onOpen({
                        type: 'record',
                        id,
                    });
                }
            }, // onOpen({type: 'type', id, name})
        })),
    };
};

export const QuickMenu = ({ env, index, onClose, onOpen }: Props) => {
    const [state, setState] = React.useState({
        input: '',
        selected: 0,
        hashIdx: 0,
        refered: [],
    } as State);

    // TODO: If you have a bunch of unnameds that are derivitives of each other,
    // group them in the results
    const results: Array<Option> = React.useMemo(() => {
        if (state.refered.length) {
            let options: Array<Option> | null = null;
            state.refered.forEach((r) => {
                if (!r || !r.toplevel) {
                    return;
                }
                if (r.toplevel.type === 'Define') {
                    const to = index.termsToTerms.to[idName(r.toplevel.id)];
                    if (options == null) {
                        options = to.map((id) => {
                            const name =
                                env.global.idNames[idName(id)] || 'unnamed';
                            const toplevel: ToplevelT = {
                                type: 'Define',
                                term: env.global.terms[idName(id)],
                                location: env.global.terms[idName(id)].location,
                                name,
                                id,
                            };
                            return {
                                title: name,
                                subOptions: [],
                                onClick: () => onOpen({ type: 'term', id }),
                                toplevel,
                            };
                        });
                    } else {
                        options = options.filter((opt) => {
                            const top = opt.toplevel;
                            return (
                                top &&
                                top.type === 'Define' &&
                                to.find((i) => idsEqual(top.id, i))
                            );
                        });
                    }
                } else if (r.toplevel.type === 'RecordDef') {
                    const to =
                        index.termsToTypes.to[idName(r.toplevel.id)] || [];
                    if (options == null) {
                        options = to.map((id) => {
                            const name =
                                env.global.idNames[idName(id)] || 'unnamed';
                            const toplevel: ToplevelT = {
                                type: 'Define',
                                term: env.global.terms[idName(id)],
                                location: env.global.terms[idName(id)].location,
                                name,
                                id,
                            };
                            return {
                                title: name,
                                subOptions: [],
                                onClick: () => onOpen({ type: 'term', id }),
                                toplevel,
                            };
                        });
                    } else {
                        options = options.filter((opt) => {
                            if (
                                !opt.toplevel ||
                                opt.toplevel.type !== 'Define'
                            ) {
                                return false;
                            }
                            const id = opt.toplevel.id;

                            return to.find((i) => idsEqual(id, i));
                        });
                    }
                }
            });
            // const options = index.to[state.refered[0].toplevel]
            // return options.map(id => env.global.terms[idName(id)] ? {type: 'term', id} : null)
            return options || [];
        }

        if (state.input.startsWith('#')) {
            const needle = state.input.slice(1);
            return Object.keys(env.global.terms)
                .filter((id) => id.startsWith(needle))
                .map(
                    (id) =>
                        ({
                            title: '#' + id,
                            toplevel: {
                                type: 'Expression',
                                term: env.global.terms[id],
                                location: env.global.terms[id].location,
                                id: idFromName(id),
                            },
                            onClick: () => {
                                onOpen({ type: 'term', id: idFromName(id) });
                            },
                            subOptions: [],
                        } as Option),
                );
        }

        const names = Object.keys(env.global.names);
        const typeNames = Object.keys(env.global.typeNames);
        const needle = state.input.toLowerCase();
        // TODO: sort by added date
        // env.global.metaData
        if (state.input == '') {
            return names
                .slice(-10)
                .map((n) => optionForTerms(n, env, onOpen))
                .filter((n) => n != null) as Array<Option>;
        }
        return names
            .filter((n) => n.toLowerCase().includes(needle))
            .map((n) => optionForTerms(n, env, onOpen))
            .filter((n) => n != null)
            .concat(
                typeNames
                    .filter((n) => n.toLowerCase().includes(needle))
                    .map((n) => optionForTypes(n, env, onOpen)),
            ) as Array<Option>;
    }, [env, state.input, state.refered]);

    const toplevel: ToplevelT | undefined = React.useMemo(():
        | undefined
        | ToplevelT => {
        const current = results[state.selected];
        if (!current) {
            return;
        }
        return current.subOptions &&
            state.hashIdx > 0 &&
            state.hashIdx < current.subOptions.length
            ? current.subOptions[state.hashIdx].toplevel
            : current.toplevel;
        // if (current.type === 'term') {
        //     const id = env.global.names[current.name][state.hashIdx];
        //     const term = env.global.terms[idName(id)];
        //     return {
        //         type: 'Define',
        //         name: current.name,
        //         location: term.location,
        //         id,
        //         term,
        //     };
        // }
        // return null;
    }, [env, state.selected, state.hashIdx, results]);
    const meta =
        toplevel && toplevel.type === 'Define'
            ? env.global.metaData[idName(toplevel.id)]
            : null;

    return (
        <div
            onMouseDown={(evt) => {
                if (evt.target === evt.currentTarget) {
                    onClose();
                }
            }}
            css={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.2)',
                display: 'flex',
                padding: 30,
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                css={{
                    display: 'flex',
                    maxWidth: '90vw',
                    boxShadow: '0 0 2px #fff',
                    padding: 4,
                    flex: 1,
                    minHeight: 100,
                    borderRadius: 4,
                    width: 800,
                    flexDirection: 'column',
                    backgroundColor: '#333',
                    alignItems: 'stretch',
                }}
            >
                {state.refered.map((r, i) => (
                    <div key={i}>{r.title}</div>
                ))}
                <input
                    value={state.input}
                    css={{
                        fontSize: '120%',
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        padding: 8,
                    }}
                    autoFocus
                    onChange={(evt) => {
                        setState((s) => ({
                            ...s,
                            input: evt.target.value,
                            selected: 0,
                            hashIdx: 0,
                        }));
                    }}
                    onKeyDown={(evt) => {
                        if (evt.key === 'Escape') {
                            evt.preventDefault();
                            onClose();
                            return;
                        }
                        if (evt.key === 'Tab') {
                            const r = results[state.selected];
                            // const id =
                            //     r.type === 'term'
                            //         ? env.global.names[r.name][state.hashIdx]
                            //         : env.global.typeNames[r.name][
                            //               state.hashIdx
                            //           ];
                            evt.preventDefault();
                            evt.stopPropagation();
                            if (!r) {
                                return;
                            }
                            setState((s) => ({
                                ...s,
                                input: '',
                                refered: s.refered.concat([
                                    state.hashIdx > 0 &&
                                    r.subOptions &&
                                    r.subOptions.length > state.hashIdx
                                        ? r.subOptions[state.hashIdx]
                                        : r,
                                ]),
                                selected: 0,
                                hashIdx: 0,
                            }));
                            return;
                        }
                        if (evt.key === 'ArrowUp') {
                            setState((s) => ({
                                ...s,
                                selected: wrap(results.length, s.selected - 1),
                                hashIdx: 0,
                            }));
                        }
                        if (evt.key === 'ArrowDown') {
                            setState((s) => ({
                                ...s,
                                selected: wrap(results.length, s.selected + 1),
                                hashIdx: 0,
                            }));
                        }
                        if (evt.key === 'ArrowRight') {
                            const t = evt.target as HTMLInputElement;
                            // TODO: only if selection is at the far right
                            if (t.selectionStart! < t.value.length) {
                                return;
                            }
                            setState((s) => {
                                const r = results[s.selected];
                                return {
                                    ...s,
                                    hashIdx: wrap(
                                        r.subOptions ? r.subOptions.length : 0,
                                        state.hashIdx + 1,
                                    ),
                                };
                            });
                            return;
                        }
                        if (evt.key === 'Enter') {
                            const r = results[state.selected];
                            r.onClick();
                            onClose();
                        }
                    }}
                />
                <div
                    css={{
                        overflow: 'auto',
                        // minHeight: 100,
                        flex: 1,
                    }}
                >
                    {results.map((r, i) => {
                        return (
                            <div
                                onMouseOver={() => {
                                    setState((s) => ({
                                        ...s,
                                        selected: i,
                                        hashIdx: 0,
                                    }));
                                }}
                                onClick={() => {
                                    r.onClick();
                                    onClose();
                                }}
                                key={i /* TODO id */}
                                style={
                                    i === state.selected
                                        ? {
                                              backgroundColor:
                                                  'rgba(255,255,255,0.2)',
                                          }
                                        : undefined
                                }
                                css={{
                                    padding: 8,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {r.title}
                                <div css={{ flex: 1 }} />
                                {r.subOptions.map((id, hidx) => (
                                    <div
                                        key={hidx}
                                        onClick={(evt) => {
                                            evt.stopPropagation();
                                            id.onClick();
                                            onClose();
                                        }}
                                        onMouseOver={(evt) => {
                                            evt.stopPropagation();
                                            setState((s) => ({
                                                ...s,
                                                selected: i,
                                                hashIdx: hidx,
                                            }));
                                        }}
                                        css={{
                                            padding: '2px 4px',
                                            borderRadius: 2,
                                        }}
                                        style={
                                            i === state.selected &&
                                            hidx === state.hashIdx
                                                ? {
                                                      backgroundColor:
                                                          'rgba(255,255,255,0.2)',
                                                  }
                                                : undefined
                                        }
                                    >
                                        {id.title}
                                        {/* <HashIcon hash={id.hash} /> */}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
                {/* <div css={{ flex: 1 }} /> */}
                {meta ? (
                    <div>
                        <span css={{ fontFamily: 'monospace' }}>
                            {new Date(meta.createdMs).toLocaleString()}
                            {meta.supersededBy ? ' (superceded)' : ''}
                        </span>
                    </div>
                ) : null}
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                        position: 'relative',
                        cursor: 'pointer',
                        // maxHeight: '50vh',
                        // minHeight: 100,
                        overflow: 'auto',
                        flex: 1,
                        // flexGrow: 1,
                        padding: 8,
                    }}
                >
                    {toplevel
                        ? renderAttributedText(
                              env.global,
                              printToAttributedText(
                                  toplevelToPretty(env, toplevel),
                                  100,
                              ),
                              undefined,
                              // onClick(env, cell, addCell, setScrub, term, value),
                              false,
                              undefined,
                              undefined,
                              // (id, kind) =>
                              //     [
                              //         'term',
                              //         'type',
                              //         'as',
                              //         'record',
                              //         'custom-binop',
                              //         'float',
                              //     ].includes(kind),
                          )
                        : null}
                </div>
            </div>
        </div>
    );
};

const wrap = (length: number, n: number) =>
    n < 0 ? length - 1 : n > length - 1 ? 0 : n;
