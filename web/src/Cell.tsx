/** @jsx jsx */
import { Interpolation, jsx, Theme } from '@emotion/react';
import {
    hashObject,
    idFromName,
    idName,
    ToplevelT,
    typeToplevelT,
} from '@jerd/language/src/typing/env';
import {
    Env,
    Id,
    idsEqual,
    newWithGlobal,
    nullLocation,
    Reference,
    selfEnv,
    Term,
} from '@jerd/language/src/typing/types';
// Ok
import * as React from 'react';
import { parse, Toplevel } from '../../language/src/parsing/parser';
import { printToString } from '../../language/src/printing/printer';
import { toplevelToPretty } from '../../language/src/printing/printTsLike';
import { addLocationIndices } from '../../language/src/typing/analyze';
import { Action } from './Cells';
import { cellTitle } from './cellTitle';
import { CellWrapper } from './CellWrapper';
import { compileGLSL, envWithTerm, getStateUniform } from './display/OpenGL';
import Editor, { Traces } from './Editor';
import { runTerm, termToJS } from './eval';
import { getMenuItems } from './getMenuItems';
import { RenderItem } from './RenderItem';
import { Cell, EvalEnv, RenderPluginT } from './State';
import { getToplevel, updateToplevel } from './toplevels';

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
    focused: number | null;
    plugins: { [id: string]: RenderPluginT };
    evalEnv: EvalEnv;
    dispatch: (action: Action) => void;
};

export type Selection = {
    level: 'outer' | 'inner' | 'text';
    idx: number;
    marks: Array<number>;
    node?: HTMLElement | null;
};

const CellView_ = ({
    cell,
    env,
    maxWidth,
    focused,
    evalEnv,
    dispatch,
    plugins,
    getHistory,
}: CellProps) => {
    const [showSource, setShowSource] = React.useState(false);
    const [showGLSL, setShowGLSL] = React.useState(false);

    const [selection, setSelection] = React.useState({
        level: cell.content.type === 'raw' ? 'text' : 'outer',
        idx: 0,
        marks: [],
    } as Selection);

    const onSetPlugin = React.useCallback(
        (display) => {
            dispatch({ type: 'change', cell: { ...cell, display } });
        },
        [cell],
    );

    const onSetToplevel = React.useCallback(
        (toplevel: ToplevelT) => {
            const { env: nenv, content } = updateToplevel(
                env,
                toplevel,
                cell.content,
            );
            dispatch({ type: 'change', env: nenv, cell: { ...cell, content } });
        },
        [env, cell],
    );

    const onEdit = React.useCallback(() => {
        dispatch({ type: 'focus', id: cell.id });
        setSelection((s) => ({ ...s, level: 'text' }));
    }, [cell]);

    const contents =
        cell.content.type == 'raw'
            ? cell.content.text
            : getToplevel(env, cell.content);

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
                addLocationIndices(
                    typeToplevelT(
                        newWithGlobal(env.global),
                        parsed[0],
                        typeof contents !== 'string' &&
                            contents.type === 'RecordDef'
                            ? contents.def.unique
                            : null,
                    ),
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

    // START HERE PLEASE:
    // bring the RenderItem dealios out here
    // - when editing text, we're not going to update the propsed
    //   all the time... but when switching we probably do, right?
    //   also out here we can manage simple undo/redo, right? I think?
    //   but not right at the moment.
    const body =
        selection.level === 'text' ? (
            <Editor
                text={text}
                evaled={evaled}
                typed={typed}
                setText={setText}
                err={err}
                maxWidth={maxWidth}
                env={env}
                dispatch={dispatch}
                plugins={plugins}
                evalEnv={evalEnv}
                display={cell.display}
                selection={selection}
                setSelection={setSelection}
                onSetPlugin={onSetPlugin}
                contents={
                    cell.content.type == 'raw'
                        ? cell.content.text
                        : getToplevel(env, cell.content)
                }
                onClose={updateProposed(cell, dispatch, setSelection)}
                onChange={(rawOrToplevel) => {
                    dispatch({ type: 'focus', id: cell.id });
                    if (typeof rawOrToplevel === 'string') {
                        dispatch({
                            type: 'change',
                            cell: {
                                ...cell,
                                content: { type: 'raw', text: rawOrToplevel },
                            },
                        });
                    } else {
                        const { env: nenv, content } = updateToplevel(
                            env,
                            rawOrToplevel,
                            cell.content,
                        );
                        dispatch({
                            type: 'change',
                            env: nenv,
                            cell: {
                                ...cell,
                                content,
                            },
                        });
                    }
                    // setEditing(false);
                    setSelection((s) => ({ ...s, level: 'inner' }));
                }}
            />
        ) : cell.content.type === 'raw' ? (
            <div
                onClick={() => {
                    // setEditing(true);
                    setSelection((s) => ({ ...s, level: 'text' }));
                    dispatch({ type: 'focus', id: cell.id });
                }}
                style={{
                    fontFamily: '"Source Code Pro", monospace',
                    whiteSpace: 'pre-wrap',
                    position: 'relative',
                    cursor: 'pointer',
                    padding: 8,
                }}
            >
                {cell.content.text.trim() === ''
                    ? '[empty]'
                    : cell.content.text}
            </div>
        ) : (
            <RenderItem
                maxWidth={maxWidth}
                onSetPlugin={onSetPlugin}
                onChange={onSetToplevel}
                selection={selection}
                setSelection={setSelection}
                focused={focused != null}
                onFocus={(direction?: 'up' | 'down') => {
                    dispatch({ type: 'focus', id: cell.id, direction });
                }}
                onClick={() => {
                    setSelection((s) => ({ ...s, level: 'outer' }));
                    dispatch({ type: 'focus', id: cell.id });
                }}
                onPending={updatePending(cell, dispatch)}
                dispatch={dispatch}
                cell={cell}
                plugins={plugins}
                content={cell.content}
                onEdit={onEdit}
                env={env}
                evalEnv={evalEnv}
            />
        );

    const term =
        cell.content.type === 'term'
            ? env.global.terms[idName(cell.content.id)]
            : null;

    React.useEffect(() => {
        if (focused == null) {
            return;
        }
        const fn = (evt: KeyboardEvent) => {
            if (
                document.activeElement !== document.body ||
                evt.target !== document.body
            ) {
                return;
            }
            if (evt.key === 'Enter') {
                evt.preventDefault();
                evt.stopPropagation();
                if (evt.shiftKey) {
                    dispatch({
                        type: 'add',
                        content: { type: 'raw', text: '' },
                        position: { type: 'after', id: cell.id },
                    });
                } else {
                    // um let's start editing? I don't have control over that just yet.
                    setSelection((s) => ({ ...s, level: 'text' }));
                }
            }
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [focused != null]);

    const setCollapsed = (collapsed: boolean) =>
        dispatch({ type: 'change', cell: { ...cell, collapsed } });

    return (
        <CellWrapper
            getHistory={() => ({
                env,
                items: getHistory(cell.id),
            })}
            title={cellTitle(
                env,
                cell,
                maxWidth,
                cell.collapsed,
                rejectProposed(cell, dispatch, env),
                acceptProposed(cell, env, onSetToplevel),
            )}
            onRevertToTerm={(id: Id) => {
                dispatch({
                    type: 'change',
                    cell: { ...cell, content: { type: 'term', id } },
                });
            }}
            onRemove={() => dispatch({ type: 'remove', id: cell.id })}
            focused={focused}
            onFocus={() => dispatch({ type: 'focus', id: cell.id })}
            collapsed={cell.collapsed || false}
            setCollapsed={setCollapsed}
            onToggleSource={() => setShowSource(!showSource)}
            menuItems={getMenuItems({
                dispatch,
                // onMove,
                // onDuplicate,
                setCollapsed,
                setShowSource,
                term,
                showSource,
                showGLSL,
                cell,
                env,
                setShowGLSL,
            })}
        >
            {body}
            {term && showSource && cell.content.type === 'term' ? (
                <ViewSource
                    hash={idName(cell.content.id)}
                    env={env}
                    term={term}
                />
            ) : null}
            {term && showGLSL && cell.content.type === 'term' ? (
                <ViewGLSL
                    hash={idName(cell.content.id)}
                    env={env}
                    term={term}
                />
            ) : null}
        </CellWrapper>
    );
};

export const CellView = React.memo(CellView_);

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

const ViewSource = ({
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

const updateProposed = (
    cell: Cell,
    dispatch: (action: Action) => void,
    // onChange: (env: Env | null, cell: Cell) => void,
    setSelection: React.Dispatch<React.SetStateAction<Selection>>,
): ((term: ToplevelT | null) => void) => {
    return (proposedToplevel) => {
        if (cell.content.type === 'term') {
            if (
                proposedToplevel != null &&
                (proposedToplevel.type === 'Define' ||
                    proposedToplevel?.type === 'Expression')
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
                                proposed: {
                                    term: proposedToplevel.term,
                                    id: id,
                                },
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
        setSelection((s) => ({ ...s, level: 'inner' }));
    };
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
            const name = env.global.idNames[idName(cell.content.id)];
            const top: ToplevelT = name
                ? {
                      type: 'Define',
                      term: cell.content.proposed.term,
                      name,
                      id: cell.content.id,
                      location: nullLocation,
                  }
                : {
                      type: 'Expression',
                      term: cell.content.proposed.term,
                      location: nullLocation,
                  };
            onSetToplevel(top);
        }
    };
}

function updatePending(
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
                            term: pending,
                            id: id,
                        },
                    },
                },
            });
        }
    };
}
