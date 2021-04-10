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
} from '@jerd/language/src/printing/printTsLike';
import { printToAttributedText } from '@jerd/language/src/printing/printer';
import Editor from './Editor';
import { termToJS } from './eval';
import { renderAttributedText } from './Render';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import { void_ } from '@jerd/language/src/typing/preset';
import { Cell, Content, Display, EvalEnv, Plugins, PluginT } from './State';
import { nullLocation } from '@jerd/language/src/parsing/parser';

const maxWidth = 80;

export type CellProps = {
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
    onRemove,
    onToggleSource,
    children,
}: {
    children: React.ReactNode;
    onRemove: () => void;
    onToggleSource: (() => void) | null | undefined;
}) => {
    return (
        <div style={{ width: 800, padding: 4, position: 'relative' }}>
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
    if (editing) {
        return (
            <CellWrapper onRemove={onRemove} onToggleSource={null}>
                <Editor
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
        <CellWrapper
            onRemove={onRemove}
            onToggleSource={() => setShowSource(!showSource)}
        >
            <RenderItem
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
    plugins: Plugins,
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
                        getTypeError(
                            env,
                            t.is,
                            plugins[k].type,
                            nullLocation,
                        ) === null
                    ) {
                        return true;
                    }
                });
            }
    }
    return null;
};

export const getPlugin = (
    plugins: Plugins,
    env: Env,
    display: Display | undefined | null,
    content: Content,
    // cell: Cell,
    value: any,
    evalEnv: EvalEnv,
): (() => JSX.Element) | null => {
    if (!display || !plugins[display.type]) {
        return null;
    }
    switch (content.type) {
        case 'expr':
        case 'term':
            const t = env.global.terms[idName(content.id)];
            const plugin: PluginT = plugins[display.type];
            const err = getTypeError(env, t.is, plugin.type, nullLocation);
            if (err == null) {
                return () => plugin.render(value, evalEnv);
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
    onPin,
}: {
    onSetPlugin: (d: Display | null) => void;
    plugins: Plugins;
    cell: Cell;
    id: Id;
    env: Env;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
    collapsed: boolean | undefined;
    setCollapsed: (c: boolean) => void;
    onPin: (display: Display, id: Id) => void;
}) => {
    const hash = idName(id);
    if (!evalEnv.terms[hash]) {
        return (
            <button
                css={{
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontFamily: 'inherit',
                    color: 'inherit',
                    margin: 8,
                    padding: '4px 8px',
                    ':hover': {
                        backgroundColor: 'rgba(100,100,100,0.3)',
                    },
                }}
                onClick={() => onRun(id)}
            >
                Evaluate
            </button>
        );
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
        evalEnv,
    );
    if (renderPlugin != null) {
        return (
            <RenderPlugin
                display={cell.display}
                plugins={plugins}
                onSetPlugin={onSetPlugin}
                onPin={() => onPin(cell.display!, idFromName(hash))}
            >
                {renderPlugin()}
            </RenderPlugin>
        );
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

const enumContent = (env: Env, rawId: string): Content => {
    return {
        type: 'enum',
        id: idFromName(rawId),
        name: env.global.idNames[rawId],
    };
};

const recordContent = (env: Env, rawId: string): Content => {
    return {
        type: 'record',
        id: idFromName(rawId),
        name: env.global.idNames[rawId],
        attrs: env.global.recordGroups[rawId],
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
    showSource,

    collapsed,
    setCollapsed,
    onSetPlugin,
    onPin,
}: {
    env: Env;
    cell: Cell;
    plugins: Plugins;
    content: Content;
    evalEnv: EvalEnv;
    showSource: boolean;
    onRun: (id: Id) => void;
    addCell: (content: Content) => void;
    onEdit: () => void;
    collapsed: boolean | undefined;
    setCollapsed: (n: boolean) => void;
    onSetPlugin: (display: Display | null) => void;
    onPin: (display: Display, id: Id) => void;
}) => {
    const onClick = (id: string, kind: string) => {
        console.log(kind);
        if (kind === 'term' || kind === 'as') {
            addCell({
                type: 'term',
                id: idFromName(id),
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
        return false;
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
                    onPin={onPin}
                    cell={cell}
                    plugins={plugins}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    id={content.id}
                    env={env}
                    evalEnv={evalEnv}
                    onRun={onRun}
                />
                {showSource ? (
                    <ViewSource
                        hash={idName(content.id)}
                        env={env}
                        term={term}
                    />
                ) : null}
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
                    onPin={onPin}
                    cell={cell}
                    plugins={plugins}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    id={content.id}
                    env={env}
                    evalEnv={evalEnv}
                    onRun={onRun}
                />
                {showSource ? (
                    <ViewSource
                        hash={idName(content.id)}
                        env={env}
                        term={term}
                    />
                ) : null}
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
                name: hash,
                type: term.is,
            }),
            term,
            idFromName(hash),
            false,
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
            location: nullLocation,
        };
    }
    if (content.type === 'term') {
        return {
            type: 'Define',
            term: env.global.terms[idName(content.id)],
            id: content.id,
            location: nullLocation,
            name: content.name,
        };
    }
    if (content.type === 'record') {
        return {
            type: 'RecordDef',
            def: env.global.types[idName(content.id)] as RecordDef,
            name: content.name,
            attrNames: content.attrs,
            location: nullLocation,
            id: content.id,
        };
    }
    if (content.type === 'effect') {
        return {
            type: 'Effect',
            constrNames: env.global.effectConstrNames[idName(content.id)],
            name: content.name,
            location: nullLocation,
            id: content.id,
            effect: {
                type: 'EffectDef',
                constrs: env.global.effects[idName(content.id)],
                location: nullLocation,
            },
        };
    }
    if (content.type === 'enum') {
        return {
            type: 'EnumDef',
            def: env.global.types[idName(content.id)] as EnumDef,
            name: content.name,
            location: nullLocation,
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

export const RenderPlugin = ({
    children,
    display,
    plugins,
    onSetPlugin,
    onPin,
}: {
    children: React.ReactNode;
    display: Display | undefined | null;
    plugins: Plugins;
    onSetPlugin: (name: Display | null) => void;
    onPin: null | (() => void);
}) => {
    const [zoom, setZoom] = React.useState(false);
    return (
        <div
            style={{
                // padding: 8,
                border: '2px solid #2b2b2b',
                borderRadius: 4,
                position: 'relative',
                ...(zoom
                    ? {
                          position: 'fixed',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          background: 'black',
                      }
                    : null),
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    padding: 8,
                    paddingTop: 6,
                    backgroundColor: !zoom ? '#2b2b2b' : 'transparent',
                    fontSize: '80%',
                    borderRadius: 4,
                }}
            >
                <button
                    css={{
                        cursor: 'pointer',
                        fontSize: '50%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        padding: 0,
                        marginRight: zoom ? 0 : 8,
                    }}
                    onClick={() => setZoom(!zoom)}
                >
                    🔍
                </button>
                {!zoom ? (
                    <span>
                        {onPin ? (
                            <button
                                css={{
                                    cursor: 'pointer',
                                    fontSize: '50%',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'inherit',
                                    padding: 0,
                                    marginRight: 8,
                                }}
                                onClick={() => onPin()}
                            >
                                📌
                            </button>
                        ) : null}
                        {plugins[display!.type].name}
                        <button
                            css={{
                                cursor: 'pointer',
                                fontSize: '50%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'inherit',
                                padding: 0,
                                marginLeft: 8,
                            }}
                            onClick={() => onSetPlugin(null)}
                        >
                            ╳
                        </button>
                    </span>
                ) : null}
            </div>

            <div style={{ padding: 8 }}>{children}</div>
        </div>
    );
};
