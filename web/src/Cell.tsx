// Ok

import * as t from '@babel/types';
import * as React from 'react';
import parse, {
    Expression,
    Location,
    Toplevel,
} from '../../src/parsing/parser';
import {
    optimizeAST,
    removeTypescriptTypes,
} from '../../src/printing/typeScriptOptimize';
import { typeFile } from '../../src/typing/typeFile';
import { fileToTypescript } from '../../src/printing/fileToTypeScript';
import * as builtins from '../../src/printing/prelude';

import { bool, presetEnv } from '../../src/typing/preset';
import generate from '@babel/generator';
import runCode from './eval';
import {
    typeDefine,
    typeEffect,
    typeTypeDefn,
    addExpr,
    addDefine,
    addRecord,
    idName,
} from '../../src/typing/env';
import { Env, Id, RecordDef } from '../../src/typing/types';
import {
    declarationToPretty,
    termToPretty,
    ToplevelT,
    toplevelToPretty,
} from '../../src/printing/printTsLike';
import { printToAttributedText } from '../../src/printing/printer';
import Editor from './Editor';
import { renderAttributedText } from './Render';

const maxWidth = 60;

export type Content =
    | { type: 'term'; id: Id; name: string }
    | { type: 'expr'; id: Id }
    | { type: 'record'; id: Id; name: string; attrs: Array<string> }
    | { type: 'raw'; text: string };
export type Cell = {
    id: string;
    content: Content;
    display: string;
};

export type EvalEnv = {
    builtins: { [key: string]: Function };
    terms: { [hash: string]: any };
};

export type CellProps = {
    cell: Cell;
    env: Env;
    onChange: (env: Env, cell: Cell) => void;
    onRun: (id: Id) => void;
    evalEnv: EvalEnv;
};

export const CellView = ({
    cell,
    env,
    onChange,
    onRun,
    evalEnv,
}: CellProps) => {
    const [editing, setEditing] = React.useState(cell.content.type == 'raw');
    return (
        <div style={{ width: 300, padding: 4 }}>
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
                    env={env}
                    evalEnv={evalEnv}
                    onRun={onRun}
                />
            )}
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

const RenderItem = ({
    env,
    content,
    evalEnv,
    onRun,
    onEdit,
}: {
    env: Env;
    content: Content;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
    onEdit: () => void;
}) => {
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
                        padding: 8,
                    }}
                    onClick={() => onEdit()}
                >
                    {renderAttributedText(
                        printToAttributedText(
                            termToPretty(env, term),
                            maxWidth,
                        ),
                    )}
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
                        padding: 8,
                    }}
                >
                    {renderAttributedText(
                        printToAttributedText(
                            declarationToPretty(env, content.id, term),
                            maxWidth,
                        ),
                    )}
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
        return <div onClick={() => onEdit()}>Raw text: {content.text}</div>;
    } else {
        const top = getToplevel(env, content);
        return (
            <div
                style={{
                    fontFamily: '"Source Code Pro", monospace',
                    whiteSpace: 'pre-wrap',
                    padding: 16,
                }}
            >
                {renderAttributedText(
                    printToAttributedText(toplevelToPretty(env, top), maxWidth),
                )}
            </div>
        );
    }
};

const getToplevel = (env: Env, content: Content): ToplevelT => {
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
};

const updateToplevel = (
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
    } else {
        throw new Error('toplevel type not yet supported');
    }
};
