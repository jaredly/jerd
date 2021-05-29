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

const CellWrapper = ({
    title,
    onRemove,
    onToggleSource,
    children,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
    onRemove: () => void;
    onToggleSource: (() => void) | null | undefined;
}) => {
    return (
        <div
            style={{
                padding: 4,
                position: 'relative',
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
                }}
            >
                {title}
            </div>
            {children}
            <div
                css={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    top: 8,
                    left: '100%',
                }}
            >
                <button
                    onClick={onRemove}
                    css={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        ':hover': {
                            backgroundColor: '#2b2b2b',
                        },
                    }}
                >
                    ╳
                </button>
                {onToggleSource ? (
                    <button
                        onClick={onToggleSource}
                        css={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontFamily: 'monospace',
                            color: 'white',
                            cursor: 'pointer',
                            ':hover': {
                                backgroundColor: '#2b2b2b',
                            },
                        }}
                    >
                        {'{}'}
                    </button>
                ) : null}
            </div>
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
        >
            {body}
        </CellWrapper>
    );
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
