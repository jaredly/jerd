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
} from '@jerd/language/src/typing/env';
import {
    EnumDef,
    Env,
    Id,
    RecordDef,
    selfEnv,
    Type,
} from '@jerd/language/src/typing/types';
import {
    declarationToPretty,
    termToPretty,
    ToplevelT,
    toplevelToPretty,
} from '@jerd/language/src/printing/printTsLike';
import { printToAttributedText } from '@jerd/language/src/printing/printer';
import Editor from './Editor';
import { renderAttributedText } from './Render';
import { getTypeErorr } from '@jerd/language/src/typing/getTypeError';

const maxWidth = 60;

export type Content =
    | { type: 'term'; id: Id; name: string }
    | { type: 'expr'; id: Id }
    | { type: 'record'; id: Id; name: string; attrs: Array<string> }
    | { type: 'enum'; id: Id; name: string }
    | { type: 'effect'; id: Id; name: string; constrNames: Array<string> }
    | { type: 'raw'; text: string };
export type Cell = {
    id: string;
    content: Content;
    display?: Display;
    collapsed?: boolean;
};

export type PluginT = {
    id: string;
    name: string;
    type: Type;
    render: (value: any) => React.ReactNode;
};
export type Plugins = { [id: string]: PluginT };
export type Display = { type: string; opts: { [key: string]: any } };

export type EvalEnv = {
    builtins: { [key: string]: any };
    terms: { [hash: string]: any };
    executionLimit: { ticks: number; maxTime: number; enabled: boolean };
};

export type CellProps = {
    cell: Cell;
    env: Env;
    onChange: (env: Env, cell: Cell) => void;
    onRun: (id: Id) => void;
    onRemove: () => void;
    evalEnv: EvalEnv;
    addCell: (content: Content) => void;
    plugins: { [id: string]: PluginT };
};

const CellWrapper = ({ onRemove, children }) => {
    return (
        <div style={{ width: 800, padding: 4, position: 'relative' }}>
            {children}
            <button
                onClick={onRemove}
                css={{
                    position: 'absolute',
                    top: 8,
                    padding: '4px 8px',
                    borderRadius: 4,
                    left: '100%',
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
        </div>
    );
};

export const CellView = ({
    cell,
    env,
    onChange,
    onRemove,
    onRun,
    evalEnv,
    addCell,
    plugins,
}: CellProps) => {
    const [editing, setEditing] = React.useState(cell.content.type == 'raw');
    if (editing) {
        return (
            <CellWrapper onRemove={onRemove}>
                <Editor
                    env={env}
                    plugins={plugins}
                    evalEnv={evalEnv}
                    display={cell.display}
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
                            const { env: nenv, content } = updateToplevel(
                                env,
                                term,
                            );
                            onChange(nenv, {
                                ...cell,
                                content,
                            });
                        }
                        setEditing(false);
                    }}
                />
            </CellWrapper>
        );
    }

    return (
        <CellWrapper onRemove={onRemove}>
            <RenderItem
                onSetPlugin={(display) => {
                    onChange(env, { ...cell, display });
                }}
                cell={cell}
                plugins={plugins}
                content={cell.content}
                onEdit={() => setEditing(true)}
                addCell={addCell}
                collapsed={cell.collapsed}
                setCollapsed={(collapsed) =>
                    onChange(env, { ...cell, collapsed })
                }
                env={env}
                evalEnv={evalEnv}
                onRun={onRun}
            />
        </CellWrapper>
    );
};

const getMatchingPlugins = (
    plugins,
    env: Env,
    cell: Cell,
): Array<string> | null => {
    switch (cell.content.type) {
        case 'expr':
        case 'term':
            const t = env.global.terms[idName(cell.content.id)];
            if (!cell.display || !plugins[cell.display.type]) {
                return Object.keys(plugins).filter((k) => {
                    if (
                        getTypeErorr(env, t.is, plugins[k].type, null) === null
                    ) {
                        return true;
                    }
                });
            }
    }
    return null;
};

export const getPlugin = (
    plugins,
    env: Env,
    display: Display | null,
    content: Content,
    // cell: Cell,
    value: any,
): (() => React.ReactNode) | null => {
    if (!display || !plugins[display.type]) {
        return null;
    }
    switch (content.type) {
        case 'expr':
        case 'term':
            const t = env.global.terms[idName(content.id)];
            const plugin: PluginT = plugins[display.type];
            const err = getTypeErorr(env, t.is, plugin.type, null);
            if (err == null) {
                return () => plugin.render(value);
            }
    }
    return null;
};

const RenderResult = ({
    plugins,
    cell,
    id,
    env,
    evalEnv,
    onRun,
    collapsed,
    setCollapsed,
    onSetPlugin,
}: {
    onSetPlugin: (d: Display) => void;
    plugins: Plugins;
    cell: Cell;
    id: Id;
    env: Env;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
    collapsed: boolean;
    setCollapsed: (c: boolean) => void;
}) => {
    const hash = idName(id);
    if (!evalEnv.terms[hash]) {
        return <button onClick={() => onRun(id)}>Not run yet</button>;
    }

    if (collapsed) {
        return (
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => setCollapsed(false)}
            >
                Collapsed
            </div>
        );
    }

    const renderPlugin = getPlugin(
        plugins,
        env,
        cell.display,
        cell.content,
        evalEnv.terms[hash],
    );
    if (renderPlugin != null) {
        return renderPlugin() as JSX.Element;
    }

    const matching = getMatchingPlugins(plugins, env, cell);

    return (
        <div
            style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                position: 'relative',
                padding: 8,
            }}
        >
            <button
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}
                onClick={() => setCollapsed(true)}
            >
                -
            </button>
            {JSON.stringify(evalEnv.terms[hash], null, 2)}
            {matching && matching.length ? (
                <div>
                    <h4>Available render plugins</h4>

                    {matching.map((k) => (
                        <button
                            key={k}
                            onClick={() => {
                                onSetPlugin({ type: k, opts: {} });
                            }}
                        >
                            {plugins[k].name}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

const enumContent = (env: Env, hash: string): Content => {
    return {
        type: 'enum',
        id: { hash, size: 1, pos: 0 },
        name: env.global.idNames[hash],
    };
};

const recordContent = (env: Env, hash: string): Content => {
    return {
        type: 'record',
        id: { hash, size: 1, pos: 0 },
        name: env.global.idNames[hash],
        attrs: env.global.recordGroups[hash],
    };
};

const RenderItem = ({
    env,
    cell,
    content,
    evalEnv,
    onRun,
    onEdit,
    addCell,
    plugins,

    collapsed,
    setCollapsed,
    onSetPlugin,
}: {
    env: Env;
    cell: Cell;
    plugins: Plugins;
    content: Content;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
    addCell: (content: Content) => void;
    onEdit: () => void;
    collapsed: boolean;
    setCollapsed: (n: boolean) => void;
    onSetPlugin: (display: Display) => void;
}) => {
    const onClick = (id, kind) => {
        console.log(kind);
        if (kind === 'term') {
            addCell({
                type: 'term',
                id: { hash: id, size: 1, pos: 0 },
                name: env.global.idNames[id],
            });
            return true;
        } else if (kind === 'type') {
            if (env.global.types[id].type === 'Record') {
                addCell(recordContent(env, id));
                return true;
            } else {
                addCell(enumContent(env, id));
                return true;
            }
        } else if (kind === 'record') {
            addCell(recordContent(env, id));
            return true;
        }
    };
    // if (content.type === 'record')
    if (content.type === 'expr') {
        const id = idName(content.id);
        if (!env.global.terms[id]) {
            return <div>Unknown ID {id}</div>;
        }
        const term = env.global.terms[id];
        return (
            <div>
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                        position: 'relative',
                        padding: 8,
                    }}
                    onClick={() => onEdit()}
                >
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            termToPretty(env, term),
                            maxWidth,
                        ),
                        onClick,
                    )}
                    <div
                        // @ts-ignore
                        style={styles.hash}
                        onClick={(evt) => evt.stopPropagation()}
                    >
                        #{id}
                    </div>
                </div>
                <RenderResult
                    onSetPlugin={onSetPlugin}
                    cell={cell}
                    plugins={plugins}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    id={content.id}
                    env={env}
                    evalEnv={evalEnv}
                    onRun={onRun}
                />
            </div>
        );
    } else if (content.type === 'term') {
        const id = idName(content.id);
        if (!env.global.terms[id]) {
            return <div>Unknown ID {id}</div>;
        }
        const term = env.global.terms[id];
        return (
            <div>
                <div
                    onClick={() => onEdit()}
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                        position: 'relative',
                        padding: 8,
                    }}
                >
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            declarationToPretty(
                                selfEnv(env, {
                                    name: content.name,
                                    type: term.is,
                                }),
                                content.id,
                                term,
                            ),
                            maxWidth,
                        ),
                        onClick,
                    )}
                    <div
                        // @ts-ignore
                        style={styles.hash}
                        onClick={(evt) => evt.stopPropagation()}
                    >
                        #{id}
                    </div>
                </div>
                <RenderResult
                    onSetPlugin={onSetPlugin}
                    cell={cell}
                    plugins={plugins}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    id={content.id}
                    env={env}
                    evalEnv={evalEnv}
                    onRun={onRun}
                />
            </div>
        );
    } else if (content.type === 'raw') {
        return (
            <div
                onClick={() => onEdit()}
                style={{
                    fontFamily: '"Source Code Pro", monospace',
                    whiteSpace: 'pre-wrap',
                    position: 'relative',
                    padding: 8,
                }}
            >
                {content.text}
                {/* @ts-ignore */}
                <div style={styles.hash}>raw</div>
            </div>
        );
    } else {
        const top = getToplevel(env, content);
        return (
            <div
                style={{
                    fontFamily: '"Source Code Pro", monospace',
                    whiteSpace: 'pre-wrap',
                    position: 'relative',
                    padding: 8,
                }}
                onClick={() => onEdit()}
            >
                {renderAttributedText(
                    env.global,
                    printToAttributedText(toplevelToPretty(env, top), maxWidth),
                    onClick,
                )}
                {/* @ts-ignore */}
                <div style={styles.hash}>#{idName(content.id)}</div>
            </div>
        );
    }
};

// const Hash = ({id}) =>

const styles = {
    hash: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: '80%',
        color: 'rgba(255,255,255,0.5)',
    },
};

export const getToplevel = (env: Env, content: Content): ToplevelT => {
    if (content.type === 'expr') {
        return {
            type: 'Expression',
            term: env.global.terms[idName(content.id)],
            location: null,
        };
    }
    if (content.type === 'term') {
        return {
            type: 'Define',
            term: env.global.terms[idName(content.id)],
            id: content.id,
            location: null,
            name: content.name,
        };
    }
    if (content.type === 'record') {
        return {
            type: 'RecordDef',
            def: env.global.types[idName(content.id)] as RecordDef,
            name: content.name,
            attrNames: content.attrs,
            location: null,
            id: content.id,
        };
    }
    if (content.type === 'effect') {
        return {
            type: 'Effect',
            constrNames: env.global.effectConstrNames[idName(content.id)],
            name: content.name,
            location: null,
            id: content.id,
            effect: {
                type: 'EffectDef',
                constrs: env.global.effects[idName(content.id)],
                location: null,
            },
        };
    }
    if (content.type === 'enum') {
        return {
            type: 'EnumDef',
            def: env.global.types[idName(content.id)] as EnumDef,
            name: content.name,
            location: null,
            id: content.id,
        };
    }
    throw new Error(`unsupported toplevel`);
};

export const updateToplevel = (
    env: Env,
    term: ToplevelT,
): { env: Env; content: Content } => {
    if (term.type === 'Expression') {
        const { id, env: nenv } = addExpr(env, term.term);
        return { content: { type: 'expr', id: id }, env: nenv };
    } else if (term.type === 'Define') {
        const { id, env: nenv } = addDefine(env, term.name, term.term);
        return {
            content: { type: 'term', id: id, name: term.name },
            env: nenv,
        };
    } else if (term.type === 'RecordDef') {
        const { id, env: nenv } = addRecord(
            env,
            term.name,
            term.attrNames,
            term.def,
        );
        return {
            content: {
                type: 'record',
                id: id,
                name: term.name,
                attrs: term.attrNames,
            },
            env: nenv,
        };
    } else if (term.type === 'EnumDef') {
        const { id, env: nenv } = addEnum(env, term.name, term.def);
        return {
            content: {
                type: 'enum',
                id: id,
                name: term.name,
            },
            env: nenv,
        };
    } else if (term.type === 'Effect') {
        const { env: nenv, id } = addEffect(
            env,
            term.name,
            term.constrNames,
            term.effect,
        );
        return {
            content: {
                type: 'effect',
                id: id,
                name: term.name,
                constrNames: term.constrNames,
            },
            env: nenv,
        };
    } else {
        throw new Error('toplevel type not yet supported');
    }
};
