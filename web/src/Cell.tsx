/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import {
    addExpr,
    addDefine,
    addRecord,
    addEnum,
    idName,
    addEffect,
    idFromName,
} from '@jerd/language/src/typing/env';
import {
    EnumDef,
    Env,
    Id,
    RecordDef,
    selfEnv,
    Term,
    Type,
} from '@jerd/language/src/typing/types';
import {
    declarationToPretty,
    termToPretty,
    ToplevelT,
    toplevelToPretty,
    typeToPretty,
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
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import { void_ } from '@jerd/language/src/typing/preset';
import { Cell, Content, Display, EvalEnv, Plugins, PluginT } from './State';
import { nullLocation } from '@jerd/language/src/parsing/parser';
import { RenderResult } from './RenderResult';
import { getToplevel, updateToplevel } from './toplevels';
import { RenderItem } from './RenderItem';
import {
    expressionDeps,
    expressionTypeDeps,
} from '@jerd/language/src/typing/analyze';

// const maxWidth = 80;

export type CellProps = {
    maxWidth: number;
    cell: Cell;
    env: Env;
    onChange: (env: Env, cell: Cell) => void;
    onRun: (id: Id) => void;
    onRemove: () => void;
    evalEnv: EvalEnv;
    addCell: (content: Content) => void;
    plugins: { [id: string]: PluginT };
    onPin: (display: Display, id: Id) => void;
};

export type MenuItem = { name: string; action: () => void };

const CellWrapper = ({
    title,
    onRemove,
    onToggleSource,
    children,
    menuItems,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
    onRemove: () => void;
    onToggleSource: (() => void) | null | undefined;
    menuItems: () => Array<MenuItem>;
}) => {
    const [menu, setMenu] = React.useState(false);
    return (
        <div
            style={{
                padding: 4,
                borderBottom: '2px dashed #ababab',
                marginBottom: 8,
            }}
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
            </div>
            {children}
        </div>
    );
};

export const CellView = ({
    cell,
    env,
    maxWidth,
    onChange,
    onRemove,
    onRun,
    evalEnv,
    addCell,
    onPin,
    plugins,
}: CellProps) => {
    const [editing, setEditing] = React.useState(cell.content.type == 'raw');
    const [showSource, setShowSource] = React.useState(false);
    const body = editing ? (
        <Editor
            maxWidth={maxWidth}
            env={env}
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
            onChange={(term) => {
                if (typeof term === 'string') {
                    onChange(env, {
                        ...cell,
                        content: { type: 'raw', text: term },
                    });
                } else {
                    const { env: nenv, content } = updateToplevel(env, term);
                    onChange(nenv, {
                        ...cell,
                        content,
                    });
                }
                setEditing(false);
            }}
        />
    ) : (
        <RenderItem
            maxWidth={maxWidth}
            onSetPlugin={(display) => {
                onChange(env, { ...cell, display });
            }}
            onPin={onPin}
            cell={cell}
            plugins={plugins}
            content={cell.content}
            onEdit={() => setEditing(true)}
            addCell={addCell}
            showSource={showSource}
            collapsed={cell.collapsed}
            setCollapsed={(collapsed) => onChange(env, { ...cell, collapsed })}
            env={env}
            evalEnv={evalEnv}
            onRun={onRun}
        />
    );

    return (
        <CellWrapper
            title={cellTitle(env, cell, maxWidth)}
            onRemove={onRemove}
            onToggleSource={() => setShowSource(!showSource)}
            menuItems={() => {
                return [
                    { name: 'Delete cell', action: onRemove },
                    showSource
                        ? {
                              name: 'Hide generated javascript',
                              action: () => setShowSource(false),
                          }
                        : {
                              name: 'Show generated javascript',
                              action: () => setShowSource(true),
                          },
                    cell.content.type === 'term' || cell.content.type === 'expr'
                        ? {
                              name:
                                  'Export term & dependencies to tslike syntax',
                              action: () => {
                                  if (
                                      cell.content.type !== 'term' &&
                                      cell.content.type !== 'expr'
                                  ) {
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
        </CellWrapper>
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
    return items.map((pp) => printToString(pp, 100)).join('\n\n');
};

export const hashStyle = {
    color: 'white',
    marginRight: 8,
    fontSize: '80%',
    background: '#2b2b2b',
    padding: '2px 8px',
    borderRadius: 4,
};

const cellTitle = (env: Env, cell: Cell, maxWidth: number) => {
    switch (cell.content.type) {
        case 'raw':
            return `[raw text, invalid syntax]`;
        case 'effect':
            return `effect ${cell.content.name}`;
        case 'term': {
            const term = env.global.terms[idName(cell.content.id)];
            return (
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <span css={hashStyle}>#{idName(cell.content.id)}</span>
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            items([
                                id(
                                    cell.content.name,
                                    idName(cell.content.id),
                                    'term',
                                ),
                                atom(': '),
                                typeToPretty(env, term.is),
                            ]),
                            maxWidth,
                        ),
                        null,
                    )}{' '}
                </div>
            );
        }
        case 'expr': {
            const term = env.global.terms[idName(cell.content.id)];
            return (
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <span css={hashStyle}>#{idName(cell.content.id)}</span>
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            typeToPretty(env, term.is),
                            maxWidth,
                        ),
                        null,
                    )}{' '}
                </div>
            );
        }
        default:
            return cell.content.type;
    }
};

// const Hash = ({id}) =>
