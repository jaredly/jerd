/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import {
    idName,
    idFromName,
    ToplevelT,
    hashObject,
} from '@jerd/language/src/typing/env';
import {
    Env,
    Id,
    selfEnv,
    Term,
    Type,
    nullLocation,
    Reference,
    idsEqual,
} from '@jerd/language/src/typing/types';
import {
    toplevelToPretty,
    typeToPretty,
    typeVblDeclsToPretty,
} from '@jerd/language/src/printing/printTsLike';
import {
    atom,
    id,
    items,
    printToAttributedText,
    printToString,
} from '@jerd/language/src/printing/printer';
import Editor from './Editor';
import { termToJS } from './eval';
import { renderAttributedText } from './Render';
import {
    Cell,
    Content,
    Display,
    EvalEnv,
    RenderPluginT,
    TopContent,
} from './State';
import { getToplevel, updateToplevel } from './toplevels';
import { RenderItem } from './RenderItem';
import {
    expressionDeps,
    expressionTypeDeps,
} from '@jerd/language/src/typing/analyze';
import { envWithTerm, compileGLSL, getStateUniform } from './display/OpenGL';
import { Position } from './Cells';
import { CellWrapper, MenuItem } from './CellWrapper';

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
        setSelection((s) => ({ ...s, level: 'text' }));
        onFocus(cell.id);
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
                onClose={(proposedToplevel) => {
                    if (cell.content.type === 'term') {
                        if (
                            proposedToplevel != null &&
                            (proposedToplevel.type === 'Define' ||
                                proposedToplevel?.type === 'Expression')
                        ) {
                            const id = idFromName(
                                hashObject(proposedToplevel.term),
                            );
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
                }}
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
                onPending={(pending) => {
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
                }}
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
            // console.log('key', evt.key);
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
                () => {
                    if (cell.content.type === 'term') {
                        onChange(env, {
                            ...cell,
                            content: { ...cell.content, proposed: undefined },
                        });
                    }
                },
                () => {
                    if (cell.content.type === 'term' && cell.content.proposed) {
                        const name =
                            env.global.idNames[idName(cell.content.id)];
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
                },
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
            menuItems={() => {
                return [
                    { name: 'Move up', action: () => onMove(cell.id, 'up') },
                    {
                        name: 'Move down',
                        action: () => onMove(cell.id, 'down'),
                    },
                    { name: 'Move to workspace', action: () => {} },
                    {
                        name: 'Duplicate cell',
                        action: () => onDuplicate(cell.id),
                    },
                    {
                        name: 'History',
                        action: () => console.log('Ok history I guess'),
                    },
                    ...(cell.collapsed
                        ? [
                              {
                                  name: 'Expand',
                                  action: () => setCollapsed(false),
                              },
                          ]
                        : [
                              {
                                  name: 'Collapse',
                                  action: () => setCollapsed(true),
                              },
                              term
                                  ? showSource
                                      ? {
                                            name: 'Hide generated javascript',
                                            action: () => setShowSource(false),
                                        }
                                      : {
                                            name: 'Show generated javascript',
                                            action: () => setShowSource(true),
                                        }
                                  : null,
                              term
                                  ? showGLSL
                                      ? {
                                            name: 'Hide generated GLSL',
                                            action: () => setShowGLSL(false),
                                        }
                                      : {
                                            name: 'Show generated GLSL',
                                            action: () => setShowGLSL(true),
                                        }
                                  : null,
                              term
                                  ? {
                                        name: 'Debug GLSL',
                                        action: () =>
                                            (window.location.search =
                                                '?debug-glsl=' +
                                                idName(
                                                    (cell.content as any).id,
                                                )),
                                    }
                                  : null,
                          ]),
                    ...(cell.content.type === 'term'
                        ? [
                              {
                                  name:
                                      'Export term & dependencies to tslike syntax',
                                  action: () => {
                                      if (cell.content.type !== 'term') {
                                          return;
                                      }
                                      const text = generateExport(
                                          env,
                                          cell.content.id,
                                      );
                                      navigator.clipboard.writeText(text);
                                  },
                              },
                              {
                                  name: 'Export with IDs',
                                  action: () => {
                                      if (cell.content.type !== 'term') {
                                          return;
                                      }
                                      const text = generateExport(
                                          env,
                                          cell.content.id,
                                          false,
                                      );
                                      navigator.clipboard.writeText(text);
                                  },
                              },
                          ]
                        : []),
                ].filter(Boolean) as Array<MenuItem>;
            }}
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
    return (
        <div
            css={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                lineHeight: 1.4,
                color: '#bbb',
                textShadow: '1px 1px 2px #000',
                padding: '8px 12px',
                background: '#333',
                borderRadius: '4px',
            }}
        >
            {source}
        </div>
    );
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
    return (
        <div
            css={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                lineHeight: 1.4,
                color: '#bbb',
                textShadow: '1px 1px 2px #000',
                padding: '8px 12px',
                background: '#333',
                borderRadius: '4px',
            }}
        >
            {source}
        </div>
    );
};

const generateExport = (env: Env, id: Id, hideIds: boolean = true) => {
    const typesInOrder: Array<ToplevelT> = expressionTypeDeps(env, [
        env.global.terms[idName(id)],
    ]).map(
        (idRaw): ToplevelT => {
            const defn = env.global.types[idRaw];
            const name = env.global.idNames[idRaw];
            if (defn.type === 'Record') {
                return {
                    type: 'RecordDef',
                    attrNames: env.global.recordGroups[idRaw],
                    def: defn,
                    id: idFromName(idRaw),
                    location: nullLocation,
                    name,
                };
            } else {
                return {
                    type: 'EnumDef',
                    def: defn,
                    id: idFromName(idRaw),
                    location: nullLocation,
                    name,
                };
            }
        },
    );
    const depsInOrder: Array<ToplevelT> = expressionDeps(env, [
        env.global.terms[idName(id)],
    ])
        .concat([idName(id)])
        .map((idRaw) => ({
            type: 'Define',
            id: idFromName(idRaw),
            term: env.global.terms[idRaw],
            location: nullLocation,
            name: env.global.idNames[idRaw],
        }));
    const items = typesInOrder
        .concat(depsInOrder)
        .map((top) => toplevelToPretty(env, top));
    return items.map((pp) => printToString(pp, 100, { hideIds })).join('\n\n');
};

export const hashStyle = {
    color: 'white',
    marginRight: 8,
    fontSize: '80%',
    background: '#2b2b2b',
    padding: '2px 8px',
    borderRadius: 4,
};

const Icon = ({ name }: { name: string }) => (
    <img
        src={`/imgs/${name}.svg`}
        css={{
            width: 16,
            height: 16,
            color: 'inherit',
            marginBottom: -4,
            marginRight: 8,
        }}
    />
);

const cellTitle = (
    env: Env,
    cell: Cell,
    maxWidth: number,
    collapsed?: boolean,
    clearPending?: () => void,
    acceptPending?: () => void,
) => {
    if (collapsed) {
        maxWidth = 10000;
    }
    switch (cell.content.type) {
        case 'raw':
            return <em>unevaluated</em>;
        case 'effect':
            const name = env.global.idNames[idName(cell.content.id)];
            return `effect ${name}`;
        case 'record': {
            const name = env.global.idNames[idName(cell.content.id)];
            const type = env.global.types[idName(cell.content.id)];
            return (
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <Icon name="icons_type" />
                    <span css={hashStyle}>#{idName(cell.content.id)}</span>
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            items([
                                id(name, idName(cell.content.id), 'type'),
                                typeVblDeclsToPretty(env, type.typeVbls),
                            ]),
                            maxWidth,
                        ),
                        // TODO onclick
                        null,
                    )}{' '}
                </div>
            );
        }
        case 'term': {
            const term = env.global.terms[idName(cell.content.id)];
            const name = env.global.idNames[idName(cell.content.id)];
            return (
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <Icon
                        name={
                            term.is.type === 'lambda'
                                ? 'icons_function'
                                : 'icons_value'
                        }
                    />
                    <span
                        css={{ ...hashStyle, cursor: 'pointer' }}
                        onClick={clearPending}
                    >
                        #{idName(cell.content.id)}
                    </span>
                    {cell.content.proposed ? (
                        <span>
                            {' <- '}
                            <span
                                css={{
                                    ...hashStyle,
                                    cursor: 'pointer',
                                    // backgroundColor: '#fa0',
                                    border: '2px solid #fa0',
                                }}
                                onClick={acceptPending}
                            >
                                #{idName(cell.content.proposed.id)}
                            </span>
                        </span>
                    ) : null}
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            name
                                ? items([
                                      id(name, idName(cell.content.id), 'term'),
                                      atom(': '),
                                      typeToPretty(env, term.is),
                                  ])
                                : typeToPretty(env, term.is),
                            maxWidth,
                        ),
                        // TODO onclick
                        null,
                    )}{' '}
                </div>
            );
        }
        default:
            return cell.content.type;
    }
};
