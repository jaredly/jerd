/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import { idName, idFromName, ToplevelT } from '@jerd/language/src/typing/env';
import {
    Env,
    Id,
    selfEnv,
    Term,
    Type,
    nullLocation,
    Reference,
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

// const maxWidth = 80;

export type MovePosition = 'up' | 'down' | { type: 'workspace'; idx: number };

export type CellProps = {
    maxWidth: number;
    cell: Cell;
    env: Env;
    focused: number | null;
    onDuplicate: (id: string) => void;
    onFocus: (id: string) => void;
    onChange: (env: Env, cell: Cell) => void;
    onRun: (id: Id) => void;
    onRemove: (id: string) => void;
    onMove: (id: string, position: MovePosition) => void;
    evalEnv: EvalEnv;
    addCell: (content: Content, position: Position) => void;
    plugins: { [id: string]: RenderPluginT };
    onPin: (display: Display, id: Id) => void;
};

export type MenuItem = { name: string; action: () => void };

const CellWrapper = ({
    title,
    onRemove,
    onToggleSource,
    children,
    menuItems,
    focused,
    onFocus,
    collapsed,
    setCollapsed,
}: {
    title: React.ReactNode;
    focused: number | null;
    onFocus: () => void;
    children: React.ReactNode;
    onRemove: () => void;
    onToggleSource: (() => void) | null | undefined;
    menuItems: () => Array<MenuItem>;
    collapsed: boolean;
    setCollapsed: (c: boolean) => void;
}) => {
    const [menu, setMenu] = React.useState(false);
    const ref = React.useRef(null as null | HTMLElement);
    React.useEffect(() => {
        if (focused != null && ref.current) {
            ref.current.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [focused]);
    return (
        <div
            ref={(node) => {
                if (node != null) {
                    ref.current = node;
                    if (focused != null) {
                        node.scrollIntoView({
                            block: 'nearest',
                            behavior: 'smooth',
                        });
                    }
                }
            }}
            css={{
                padding: 4,
                borderBottom: '2px dashed #ababab',
                marginBottom: 8,
                border: `2px solid ${
                    focused != null ? '#5d5dff' : 'transparent'
                }`,
            }}
            onClick={onFocus}
        >
            <div
                css={{
                    backgroundColor: '#151515',
                    padding: '8px 12px',
                    marginBottom: 0,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                {title}
                <div style={{ flex: 1 }} />
                <div
                    css={{
                        position: 'relative',
                        alignSelf: 'flex-start',
                    }}
                >
                    <div
                        css={{
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                        onClick={() => setMenu(!menu)}
                    >
                        menü
                        {menu ? (
                            <div
                                css={{
                                    zIndex: 1000,
                                    backgroundColor: '#333',
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    width: 200,
                                    marginTop: 8,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                }}
                            >
                                {menuItems().map((item, i) => (
                                    <div
                                        key={i}
                                        css={{
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                            ':hover': {
                                                backgroundColor: '#444',
                                            },
                                        }}
                                        onClick={() => {
                                            item.action();
                                            setMenu(false);
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
                <button
                    onClick={onRemove}
                    css={{
                        border: '1px solid transparent',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        color: 'red',
                        marginLeft: 8,
                        borderRadius: 3,
                        ':hover': {
                            borderColor: '#500',
                        },
                    }}
                >
                    ╳
                </button>
            </div>
            {collapsed ? null : children}
        </div>
    );
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
}: CellProps) => {
    const [editing, setEditing] = React.useState(cell.content.type == 'raw');
    const [showSource, setShowSource] = React.useState(false);
    const [showGLSL, setShowGLSL] = React.useState(false);
    const body = editing ? (
        <Editor
            maxWidth={maxWidth}
            env={env}
            onPin={onPin}
            plugins={plugins}
            evalEnv={evalEnv}
            display={cell.display}
            onSetPlugin={(display) => {
                onChange(env, { ...cell, display });
            }}
            contents={
                cell.content.type == 'raw'
                    ? cell.content.text
                    : getToplevel(env, cell.content)
            }
            onClose={() => setEditing(false)}
            onChange={(rawOrToplevel) => {
                onFocus(cell.id);
                if (typeof rawOrToplevel === 'string') {
                    onChange(env, {
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
                setEditing(false);
            }}
        />
    ) : cell.content.type === 'raw' ? (
        <div
            onClick={() => {
                setEditing(true);
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
            {cell.content.text.trim() === '' ? '[empty]' : cell.content.text}
        </div>
    ) : (
        <RenderItem
            maxWidth={maxWidth}
            onSetPlugin={(display) => {
                onChange(env, { ...cell, display });
            }}
            // onChange={}
            onChange={(toplevel: ToplevelT) => {
                const { env: nenv, content } = updateToplevel(
                    env,
                    toplevel,
                    cell.content,
                );
                onChange(nenv, {
                    ...cell,
                    content,
                });
            }}
            onPin={onPin}
            cell={cell}
            plugins={plugins}
            content={cell.content}
            onEdit={() => {
                setEditing(true);
                onFocus(cell.id);
            }}
            addCell={addCell}
            env={env}
            evalEnv={evalEnv}
            onRun={onRun}
        />
    );

    // const top = getToplevel(env, cell.content);
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
            console.log('key', evt.key);
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
                    setEditing(true);
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
            title={cellTitle(env, cell, maxWidth, cell.collapsed)}
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
                    cell.content.type === 'term'
                        ? {
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
                          }
                        : null,
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

const generateExport = (env: Env, id: Id) => {
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
    return items
        .map((pp) => printToString(pp, 100, { hideIds: true }))
        .join('\n\n');
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
                    <span css={hashStyle}>#{idName(cell.content.id)}</span>
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
        // case 'expr': {
        //     const term = env.global.terms[idName(cell.content.id)];
        //     return (
        //         <div
        //             style={{
        //                 fontFamily: '"Source Code Pro", monospace',
        //                 whiteSpace: 'pre-wrap',
        //             }}
        //         >
        //             <Icon
        //                 name={
        //                     term.is.type === 'lambda'
        //                         ? 'icons_function'
        //                         : 'icons_value'
        //                 }
        //             />
        //             <span css={hashStyle}>#{idName(cell.content.id)}</span>
        //             {renderAttributedText(
        //                 env.global,
        //                 printToAttributedText(
        //                     typeToPretty(env, term.is),
        //                     maxWidth,
        //                 ),
        //                 null,
        //             )}{' '}
        //         </div>
        //     );
        // }
        default:
            return cell.content.type;
    }
};

// const Hash = ({id}) =>
