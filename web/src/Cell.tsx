// Ok

import * as React from 'react';
import {
    addExpr,
    addDefine,
    addRecord,
    addEnum,
    idName,
    addEffect,
} from '../../src/typing/env';
import { EnumDef, Env, Id, RecordDef, selfEnv } from '../../src/typing/types';
import {
    declarationToPretty,
    termToPretty,
    ToplevelT,
    toplevelToPretty,
} from '../../src/printing/printTsLike';
import { printToAttributedText } from '../../src/printing/printer';
import Editor from './Editor';
import ColorEditor from './ColorEditor';
import { renderAttributedText } from './Render';

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
    display: string;
};

export type EvalEnv = {
    builtins: { [key: string]: any };
    terms: { [hash: string]: any };
};

export type CellProps = {
    cell: Cell;
    env: Env;
    onChange: (env: Env, cell: Cell) => void;
    onRun: (id: Id) => void;
    onRemove: () => void;
    evalEnv: EvalEnv;
    addCell: (content: Content) => void;
};

export const CellView = ({
    cell,
    env,
    onChange,
    onRemove,
    onRun,
    evalEnv,
    addCell,
}: CellProps) => {
    const [editing, setEditing] = React.useState(cell.content.type == 'raw');
    return (
        <div style={{ width: 500, padding: 4, position: 'relative' }}>
            {editing ? (
                <Editor
                    env={env}
                    contents={
                        cell.content.type == 'raw'
                            ? cell.content.text
                            : getToplevel(env, cell.content)
                    }
                    onClose={() => setEditing(false)}
                    onChange={(term) => {
                        console.log('change');
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
            ) : (
                <RenderItem
                    content={cell.content}
                    onEdit={() => setEditing(true)}
                    addCell={addCell}
                    env={env}
                    evalEnv={evalEnv}
                    onRun={onRun}
                />
            )}
            <button
                onClick={onRemove}
                style={{ position: 'absolute', top: 8, left: '100%' }}
            >
                x
            </button>
        </div>
    );
};

const RenderResult = ({ id, env, evalEnv, onRun }) => {
    const hash = idName(id);
    if (!evalEnv.terms[hash]) {
        return <button onClick={() => onRun(id)}>Not run yet</button>;
    }
    return (
        <div
            style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                padding: 8,
            }}
        >
            {JSON.stringify(evalEnv.terms[hash], null, 2)}
        </div>
    );
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
    content,
    evalEnv,
    onRun,
    onEdit,
    addCell,
}: {
    env: Env;
    content: Content;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
    addCell: (content: Content) => void;
    onEdit: () => void;
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
                return false;
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
