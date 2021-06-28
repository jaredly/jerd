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
import { printToAttributedText } from '../../language/src/printing/printer';
import { toplevelToPretty } from '../../language/src/printing/printTsLike';
import { idFromName, idName, ToplevelT } from '../../language/src/typing/env';
import { Env, nullLoc, nullLocation } from '../../language/src/typing/types';
import { HashIcon } from './HashIcon';
import { renderAttributedText } from './Render';
import { Content } from './State';

export type Props = {
    env: Env;
    onClose: () => unknown;
    onOpen: (content: Content) => void;
};

export type State = {
    input: string;
    selected: number;
    hashIdx: number;
    refered: Array<{ type: 'type' | 'term'; id: string }>;
};

export const QuickMenu = ({ env, onClose, onOpen }: Props) => {
    const [state, setState] = React.useState({
        input: '',
        selected: 0,
        hashIdx: 0,
        refered: [],
    } as State);

    const results = React.useMemo(() => {
        const names = Object.keys(env.global.names);
        const typeNames = Object.keys(env.global.typeNames);
        const needle = state.input.toLowerCase();
        // TODO: sort by added date
        // env.global.metaData
        if (state.input == '') {
            return names.slice(-10).map((n) => ({ type: 'term', name: n }));
        }
        return names
            .filter((n) => n.toLowerCase().includes(needle))
            .map((n) => ({ type: 'term', name: n }))
            .concat(
                typeNames
                    .filter((n) => n.toLowerCase().includes(needle))
                    .map((n) => ({ type: 'type', name: n })),
            );
    }, [env, state.input, state.refered]);

    const toplevel: ToplevelT | null = React.useMemo((): null | ToplevelT => {
        const current = results[state.selected];
        if (!current) {
            return null;
        }
        if (current.type === 'term') {
            const id = env.global.names[current.name][state.hashIdx];
            const term = env.global.terms[idName(id)];
            return {
                type: 'Define',
                name: current.name,
                location: term.location,
                id,
                term,
            };
        }
        return null;
    }, [env, state.selected, state.hashIdx, results]);
    const meta =
        toplevel && toplevel.type === 'Define'
            ? env.global.metaData[idName(toplevel.id)]
            : null;

    return (
        <div
            css={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.1)',
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
                                const hashes =
                                    r.type === 'term'
                                        ? env.global.names[r.name]
                                        : env.global.typeNames[r.name];
                                return {
                                    ...s,
                                    selected: wrap(
                                        results.length,
                                        s.selected + 1,
                                    ),
                                    hashIdx: wrap(
                                        hashes.length,
                                        state.hashIdx + 1,
                                    ),
                                };
                            });
                        }
                        if (evt.key === 'Enter') {
                            const r = results[state.selected];
                            if (r.type === 'term') {
                                onOpen({
                                    type: 'term',
                                    id: env.global.names[r.name][state.hashIdx],
                                    name: r.name,
                                });
                                onClose();
                            }
                        }
                    }}
                />
                <div
                    css={{
                        overflow: 'auto',
                        minHeight: 100,
                    }}
                >
                    {results
                        .map((r) => {
                            if (r.type === 'term') {
                                return {
                                    key: 'term-' + r.name,
                                    title: r.name,
                                    ids: env.global.names[r.name],
                                    item: r,
                                };
                            } else {
                                return {
                                    key: 'type-' + r.name,
                                    title: r.name,
                                    ids: env.global.typeNames[r.name],
                                    item: r,
                                };
                            }
                        })
                        .map((r, i) => {
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
                                        if (r.item.type === 'term') {
                                            onOpen({
                                                type: 'term',
                                                id: r.ids[0],
                                                name: r.item.name,
                                            });
                                            onClose();
                                        }
                                    }}
                                    key={r.key}
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
                                    {r.ids.map((id, hidx) => (
                                        <div
                                            key={idName(id)}
                                            onClick={(evt) => {
                                                evt.stopPropagation();
                                                if (r.item.type === 'term') {
                                                    onOpen({
                                                        type: 'term',
                                                        id: id,
                                                        name: r.item.name,
                                                    });
                                                    onClose();
                                                }
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
                                            #{idName(id)}
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
                        minHeight: 100,
                        overflow: 'auto',
                        flex: 1,
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
