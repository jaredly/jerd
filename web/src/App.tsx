// The app

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
import { EnumDef, Env, Id, RecordDef } from '../../src/typing/types';
import {
    declarationToPretty,
    enumToPretty,
    recordToPretty,
    termToPretty,
    ToplevelT,
    toplevelToPretty,
} from '../../src/printing/printTsLike';
import {
    printToString,
    printToAttributedText,
    AttributedText,
} from '../../src/printing/printer';
import { render } from 'react-dom';
import Editor from './Editor';
import { renderAttributedText } from './Render';
import { printTerm, termToAST } from '../../src/printing/typeScriptPrinter';

// Yea

const toJs = (raw: string) => {
    const parsed: Array<Toplevel> = parse(raw);

    const { expressions, env } = typeFile(parsed);
    const ast = fileToTypescript(expressions, env, {}, true, false);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: 'hello.jd',
    });
    return code;
};

// const setupEnv = () => {
//     const env = presetEnv()
// }

const maxWidth = 60;

type Content =
    | { type: 'term'; id: Id; name: string }
    | { type: 'expr'; id: Id }
    | { type: 'record'; id: Id; name: string; attrs: Array<string> }
    | { type: 'raw'; text: string };
type Cell = {
    id: string;
    content: Content;
    display: string;
};

type State = {
    env: Env;
    cells: { [key: string]: Cell };
    evalEnv: EvalEnv;
};
type EvalEnv = {
    builtins: { [key: string]: Function };
    terms: { [hash: string]: any };
};

const genId = () => Math.random().toString(36).slice(2);
const blankCell: Cell = {
    id: '',
    content: { type: 'raw', text: '' },
    display: '',
};

const initialState = (): State => ({
    env: presetEnv(),
    cells: {},
    evalEnv: {
        builtins,
        terms: {},
    },
});

// type Action = {type: 'new-cell', cell: Cell} | {
//     type: 'update-cell',
//     cell: Cell,
//     id: number,
// }

// const reduce = (state: State, action: Action): State => {
//     switch (action.type) {

//     }
// };

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

const Cell = ({
    cell,
    env,
    onChange,
    onRun,
    evalEnv,
}: {
    cell: Cell;
    env: Env;
    onChange: (env: Env, cell: Cell) => void;
    onRun: (id: Id) => void;
    evalEnv: EvalEnv;
}) => {
    const [editing, setEditing] = React.useState(cell.content.type == 'raw');
    return (
        <div style={{ width: 300, padding: 20 }}>
            <h4>Cell</h4>
            <button onClick={() => setEditing(!editing)}>Edit</button>
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
                padding: 16,
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
}: {
    env: Env;
    content: Content;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
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
                        padding: 16,
                    }}
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
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                        padding: 16,
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
        return <div>{content.text}</div>;
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
        // } else {
        //     return <div>Unknown id {JSON.stringify(content)}</div>;
    }
};

const runTerm = (env: Env, id: Id, evalEnv: EvalEnv) => {
    const term = env.global.terms[idName(id)];
    if (!term) {
        throw new Error(`No term ${idName(id)}`);
    }
    let termAst: any = printTerm(env, { scope: 'jdScope' }, term);
    let ast = t.file(t.program([t.expressionStatement(termAst)], [], 'script'));
    optimizeAST(ast);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: 'cell-123',
    });
    const jdScope = evalEnv;
    console.log('code', code);
    const result = eval(code);
    console.log('Got result', result);
    return result;
};

export default () => {
    // const [state, dispatch] = React.useReducer(reduce, () => initialState());
    const [state, setState] = React.useState(() => initialState());
    // const [text, setText] = React.useState(defaultText);
    // const [data, setData] = React.useState(() => {
    //     return typeFile(parse(defaultText));
    // });
    // const [editing, setEditing] = React.useState(null)
    // const js = React.useMemo(() => {
    //     try {
    //         return toJs(text);
    //     } catch (err) {
    //         return `Failed to compile: ${err.message}`;
    //     }
    // }, [text]);
    return (
        <div
            style={{
                backgroundColor: '#1E1E1E',
                padding: 20,
                color: '#D4D4D4',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {Object.keys(state.cells).map((id) => (
                <Cell
                    key={id}
                    env={state.env}
                    cell={state.cells[id]}
                    evalEnv={state.evalEnv}
                    onRun={(id) => {
                        console.log('Running', id, state.env, state.evalEnv);
                        const result = runTerm(state.env, id, state.evalEnv);
                        setState((state) => ({
                            ...state,
                            evalEnv: {
                                ...state.evalEnv,
                                terms: {
                                    ...state.evalEnv.terms,
                                    [idName(id)]: result,
                                },
                            },
                        }));
                    }}
                    onChange={(env, cell) => {
                        setState((state) => ({
                            ...state,
                            env,
                            cells: { ...state.cells, [cell.id]: cell },
                        }));
                    }}
                />
            ))}
            <button
                onClick={() => {
                    const id = genId();
                    setState((state) => ({
                        ...state,
                        cells: {
                            ...state.cells,
                            [id]: { ...blankCell, id },
                        },
                    }));
                }}
            >
                New Cell
            </button>
            {/* <div style={{ flex: 1 }}>
                {Object.keys(data.env.global.terms).map((hash) => (
                    <div key={hash}>
                        <pre>
                            <code>
                                {renderAttributedText(
                                    printToAttributedText(
                                        declarationToPretty(
                                            data.env,
                                            { hash, size: 1, pos: 0 },
                                            data.env.global.terms[hash],
                                        ),
                                        maxWidth,
                                    ),
                                )}
                            </code>
                        </pre>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                {data.expressions.map((expr, i) => (
                    <div key={i}>
                        <EditableExpression expr={expr} env={data.env} />
                    </div>
                ))}
            </div>
            <div style={{ flex: 0.5 }}>
                {Object.keys(data.env.global.types).map((hash) => (
                    <div key={hash}>
                        <pre>
                            <code>
                                {data.env.global.types[hash].type === 'Enum'
                                    ? renderAttributedText(
                                          printToAttributedText(
                                              enumToPretty(
                                                  data.env,
                                                  { hash, size: 1, pos: 0 },
                                                  data.env.global.types[
                                                      hash
                                                  ] as EnumDef,
                                              ),
                                              maxWidth,
                                          ),
                                      )
                                    : renderAttributedText(
                                          printToAttributedText(
                                              recordToPretty(
                                                  data.env,
                                                  { hash, size: 1, pos: 0 },
                                                  data.env.global.types[
                                                      hash
                                                  ] as RecordDef,
                                              ),
                                              maxWidth,
                                          ),
                                      )}
                            </code>
                        </pre>
                    </div>
                ))}
            </div> */}
            {/* <textarea
                style={{
                    width: 500,
                    height: 300,
                    fontFamily: '"Source Code Pro", monospace',
                }}
                value={text}
                onChange={(evt) => setText(evt.target.value)}
            /> */}
            {/* <button
                onClick={() => {
                    runCode(js);
                }}
            >
                Run!
            </button>
            <pre>{js}</pre> */}
        </div>
    );
};

// export const EditableExpression = ({ env, expr }) => {
//     const [editing, setEditing] = React.useState(false);
//     if (editing) {
//         return (
//             <Editor env={env} expr={expr} onClose={() => setEditing(false)} />
//         );
//     }
//     return (
//         <pre onClick={() => setEditing(true)}>
//             <code>
//                 {renderAttributedText(
//                     printToAttributedText(termToPretty(env, expr), maxWidth),
//                 )}
//             </code>
//         </pre>
//     );
// };
