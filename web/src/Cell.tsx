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
import { Position } from './Cells';
import { cellTitle } from './cellTitle';
import { CellWrapper } from './CellWrapper';
import { compileGLSL, envWithTerm, getStateUniform } from './display/OpenGL';
import Editor from './Editor';
import { termToJS } from './eval';
import { getMenuItems } from './getMenuItems';
import { RenderItem } from './RenderItem';
import { Cell, Content, Display, EvalEnv, RenderPluginT } from './State';
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
    onDuplicate: (id: string) => void;
    onFocus: (id: string, direction?: 'up' | 'down') => void;
    onChange: (env: Env | null, cell: Cell) => void;
    onRun: (id: Id) => void;
    onRemove: (id: string) => void;
    onMove: (id: string, position: MovePosition) => void;
    evalEnv: EvalEnv;
    addCell: (
        content: Content,
        position: Position,
        updateEnv?: (e: Env) => Env,
    ) => void;
    plugins: { [id: string]: RenderPluginT };
    onPin: (display: Display, id: Id) => void;
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
    onChange,
    onRemove,
    onDuplicate,
    onRun,
    onFocus,
    focused,
    evalEnv,
    addCell,
    onPin,
    onMove,
    plugins,
    getHistory,
}: CellProps) => {
    // const [editing, setEditing] = React.useState(cell.content.type == 'raw');
    const [showSource, setShowSource] = React.useState(false);
    const [showGLSL, setShowGLSL] = React.useState(false);

    const [selection, setSelection] = React.useState({
        level: cell.content.type === 'raw' ? 'text' : 'outer',
        idx: 0,
        marks: [],
    } as Selection);

    const onSetPlugin = React.useCallback(
        (display) => {
            onChange(null, { ...cell, display });
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
            onChange(nenv, {
                ...cell,
                content,
            });
        },
        [env, cell],
    );

    const onEdit = React.useCallback(() => {
        onFocus(cell.id);
        setSelection((s) => ({ ...s, level: 'text' }));
    }, [cell]);

    const body =
        selection.level === 'text' ? (
            <Editor
                maxWidth={maxWidth}
                env={env}
                onPin={onPin}
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
                onClose={updateProposed(cell, onChange, setSelection)}
                onChange={(rawOrToplevel) => {
                    onFocus(cell.id);
                    if (typeof rawOrToplevel === 'string') {
                        onChange(null, {
                            ...cell,
                            content: { type: 'raw', text: rawOrToplevel },
                        });
                    } else {
                        const { env: nenv, content } = updateToplevel(
                            env,
                            rawOrToplevel,
                            cell.content,
                        );
                        onChange(nenv, {
                            ...cell,
                            content,
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
                    onFocus(cell.id);
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
                    onFocus(cell.id, direction);
                }}
                onClick={() => {
                    setSelection((s) => ({ ...s, level: 'outer' }));
                    onFocus(cell.id);
                }}
                onPending={updatePending(cell, onChange)}
                onPin={onPin}
                cell={cell}
                plugins={plugins}
                content={cell.content}
                onEdit={onEdit}
                addCell={addCell}
                env={env}
                evalEnv={evalEnv}
                onRun={onRun}
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
                    addCell(
                        { type: 'raw', text: '' },
                        { type: 'after', id: cell.id },
                    );
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
        onChange(env, { ...cell, collapsed });

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
                rejectProposed(cell, onChange, env),
                acceptProposed(cell, env, onSetToplevel),
            )}
            onRevertToTerm={(id: Id) => {
                onChange(env, { ...cell, content: { type: 'term', id } });
            }}
            onRemove={() => onRemove(cell.id)}
            focused={focused}
            onFocus={() => onFocus(cell.id)}
            collapsed={cell.collapsed || false}
            setCollapsed={setCollapsed}
            onToggleSource={() => setShowSource(!showSource)}
            menuItems={getMenuItems({
                onMove,
                onDuplicate,
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
    onChange: (env: Env | null, cell: Cell) => void,
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
                        onChange(null, {
                            ...cell,
                            content: {
                                ...cell.content,
                                proposed: null,
                            },
                        });
                    }
                } else {
                    onChange(null, {
                        ...cell,
                        content: {
                            ...cell.content,
                            proposed: {
                                term: proposedToplevel.term,
                                id: id,
                            },
                        },
                    });
                }
            } else if (cell.content.proposed) {
                onChange(null, {
                    ...cell,
                    content: { ...cell.content, proposed: null },
                });
            }
        }
        setSelection((s) => ({ ...s, level: 'inner' }));
    };
};

function rejectProposed(
    cell: Cell,
    onChange: (env: Env | null, cell: Cell) => void,
    env: Env,
): (() => void) | undefined {
    return () => {
        if (cell.content.type === 'term') {
            onChange(env, {
                ...cell,
                content: { ...cell.content, proposed: undefined },
            });
        }
    };
}

function acceptProposed(
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
    onChange: (env: Env | null, cell: Cell) => void,
): (term: Term) => void {
    return (pending) => {
        if (cell.content.type === 'term') {
            const id = idFromName(hashObject(pending));
            if (idsEqual(cell.content.id, id)) {
                if (cell.content.proposed) {
                    onChange(null, {
                        ...cell,
                        content: {
                            ...cell.content,
                            proposed: null,
                        },
                    });
                }
                return;
            }
            onChange(null, {
                ...cell,
                content: {
                    ...cell.content,
                    proposed: {
                        term: pending,
                        id: id,
                    },
                },
            });
        }
    };
}
