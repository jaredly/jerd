/** @jsx jsx */
import { Interpolation, jsx, Theme } from '@emotion/react';
import {
    hashObject,
    idFromName,
    idName,
    ToplevelT,
} from '@jerd/language/src/typing/env';
import {
    Env,
    Id,
    idsEqual,
    nullLocation,
    Reference,
    selfEnv,
    Term,
} from '@jerd/language/src/typing/types';
// Ok
import * as React from 'react';
import { Action } from '../workspace/Cells';
import { compileGLSL, envWithTerm, getStateUniform } from '../display/OpenGL';
import { termToJS } from '../eval';
import { Cell, EvalEnv, RenderPluginT } from '../State';

// const maxWidth = 80;

export type MovePosition = 'up' | 'down' | { type: 'workspace'; idx: number };

// lol this props list is the worst
// should I just use redux or something
// hmmmm
// or just have a way to

export type CellProps = {
    maxWidth: number;
    cell: Cell;
    env: Env;
    getHistory: (id: string) => Array<Id>;
    focused: { tick: number; active: boolean } | null;
    plugins: { [id: string]: RenderPluginT };
    evalEnv: EvalEnv;
    dispatch: (action: Action) => void;
};

export type Selection = {
    level: 'normal' | 'text';
    idx: number;
    marks: Array<number>;
    node?: HTMLElement | null;
};

const ViewGLSL = ({
    env,
    term,
    hash,
}: {
    env: Env;
    term: Term;
    hash: string;
}) => {
    const source = React.useMemo(() => {
        if (term.is.type === 'lambda') {
            return compileGLSL(term, envWithTerm(env, term), 0, false).text;
        } else if (term.type !== 'Record' || term.base.type !== 'Concrete') {
            throw new Error(`Must be a record literal`);
        }
        const render = term.base.rows[2];
        if (!render) {
            throw new Error(`not concrete`);
        }
        const stateUniform: null | Reference = getStateUniform(term);
        if (stateUniform == null) {
            throw new Error(`Nope`);
        }

        return compileGLSL(
            render,
            envWithTerm(env, render),
            0,
            false,
            stateUniform,
        ).text;
    }, [env, term]);
    return <div css={sourceStyle}>{source}</div>;
};

const sourceStyle: Interpolation<Theme> = {
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    lineHeight: 1.4,
    color: '#bbb',
    textShadow: '1px 1px 2px #000',
    padding: '8px 12px',
    background: '#333',
    borderRadius: '4px',
};

export const ViewSource = ({
    env,
    term,
    hash,
}: {
    env: Env;
    term: Term;
    hash: string;
}) => {
    const source = React.useMemo(() => {
        return termToJS(
            selfEnv(env, {
                type: 'Term',
                name: hash,
                ann: term.is,
            }),
            term,
            idFromName(hash),
            {},
        );
    }, [env, term]);
    return <div css={sourceStyle}>{source}</div>;
};

export const hashStyle = {
    color: 'white',
    marginRight: 8,
    fontSize: '80%',
    background: '#2b2b2b',
    padding: '2px 8px',
    borderRadius: 4,
};

export const updateProposed = (
    cell: Cell,
    dispatch: (action: Action) => void,
    // onChange: (env: Env | null, cell: Cell) => void,
    proposedToplevel: ToplevelT | null,
) => {
    if (cell.content.type === 'term') {
        if (
            proposedToplevel != null &&
            (proposedToplevel.type === 'Define' ||
                proposedToplevel.type === 'Expression')
        ) {
            const id = idFromName(hashObject(proposedToplevel.term));
            if (idsEqual(id, cell.content.id)) {
                if (cell.content.proposed) {
                    dispatch({
                        type: 'change',
                        cell: {
                            ...cell,
                            content: {
                                ...cell.content,
                                proposed: null,
                            },
                        },
                    });
                }
            } else {
                dispatch({
                    type: 'change',
                    cell: {
                        ...cell,
                        content: {
                            ...cell.content,
                            proposed: proposedToplevel,
                        },
                    },
                });
            }
        } else if (cell.content.proposed) {
            dispatch({
                type: 'change',
                cell: {
                    ...cell,
                    content: { ...cell.content, proposed: null },
                },
            });
        }
    }
};

export function rejectProposed(
    cell: Cell,
    dispatch: (action: Action) => void,
    // onChange: (env: Env | null, cell: Cell) => void,
    env: Env,
): (() => void) | undefined {
    return () => {
        if (cell.content.type === 'term') {
            dispatch({
                type: 'change',
                env,
                cell: {
                    ...cell,
                    content: { ...cell.content, proposed: undefined },
                },
            });
        }
    };
}

export function acceptProposed(
    cell: Cell,
    env: Env,
    onSetToplevel: (toplevel: ToplevelT) => void,
): (() => void) | undefined {
    return () => {
        if (cell.content.type === 'term' && cell.content.proposed) {
            onSetToplevel(cell.content.proposed);
        }
    };
}

export function updatePending(
    cell: Cell,
    dispatch: (action: Action) => void,
    // onChange: (env: Env | null, cell: Cell) => void,
): (term: Term) => void {
    return (pending) => {
        if (cell.content.type === 'term') {
            const id = idFromName(hashObject(pending));
            if (idsEqual(cell.content.id, id)) {
                if (cell.content.proposed) {
                    dispatch({
                        type: 'change',
                        cell: {
                            ...cell,
                            content: {
                                ...cell.content,
                                proposed: null,
                            },
                        },
                    });
                }
                return;
            }
            dispatch({
                type: 'change',
                cell: {
                    ...cell,
                    content: {
                        ...cell.content,
                        proposed: {
                            type: 'Expression',
                            term: pending,
                            location: nullLocation,
                            id: id,
                        },
                    },
                },
            });
        }
    };
}
