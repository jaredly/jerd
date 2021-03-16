// The app

import * as t from '@babel/types';
import * as React from 'react';
import parse, { Toplevel } from '../../src/parsing/parser';
import {
    optimizeAST,
    removeTypescriptTypes,
} from '../../src/printing/typeScriptOptimize';
import { typeFile } from '../../src/typing/typeFile';
import { fileToTypescript } from '../../src/printing/fileToTypeScript';
import * as builtins from '../../src/printing/prelude';

import { presetEnv } from '../../src/typing/preset';
import generate from '@babel/generator';
import { idName } from '../../src/typing/env';
import { Env, Id, defaultRng, selfEnv } from '../../src/typing/types';
import { printTerm } from '../../src/printing/typeScriptPrinter';
import { CellView, Cell, EvalEnv, Content } from './Cell';

// Yea

type State = {
    env: Env;
    cells: { [key: string]: Cell };
    evalEnv: EvalEnv;
};

const genId = () => Math.random().toString(36).slice(2);
const blankCell: Cell = {
    id: '',
    content: { type: 'raw', text: '' },
    display: '',
};

const saveKey = 'jd-repl-cache';

const initialState = (): State => {
    const saved = window.localStorage.getItem(saveKey);
    const env = presetEnv();
    if (saved) {
        try {
            const data = JSON.parse(saved);
            return {
                ...data,
                env: {
                    ...data.env,
                    global: {
                        ...data.env.global,
                        builtins: env.global.builtins,
                        builtinTypes: env.global.builtinTypes,
                        rng: env.global.rng,
                    },
                },
                evalEnv: {
                    builtins,
                    terms: data.evalEnv.terms,
                },
            };
        } catch (err) {
            window.localStorage.removeItem(saveKey);
        }
    }
    return {
        env,
        cells: {},
        evalEnv: {
            builtins,
            terms: {},
        },
    };
};

class TimeoutError extends Error {}

const runTerm = (env: Env, id: Id, evalEnv: EvalEnv) => {
    const term = env.global.terms[idName(id)];
    if (!term) {
        throw new Error(`No term ${idName(id)}`);
    }
    const self = env.global.idNames[idName(id)]
        ? {
              name: idName(id),
              type: term.is,
          }
        : null;
    const runEnv = self != null ? selfEnv(env, self) : env;
    let termAst: any = printTerm(
        runEnv,
        { scope: 'jdScope', limitExecutionTime: true },
        term,
    );
    let ast = t.file(t.program([t.expressionStatement(termAst)], [], 'script'));
    optimizeAST(ast);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: 'cell-123',
    });
    const start = Date.now();
    let ticks = 0;
    const timeLimit = 200;
    const jdScope = {
        ...evalEnv,
        terms: {
            ...evalEnv.terms,
        },
        checkExecutionLimit: () => {
            ticks += 1;
            if (ticks++ % 100 === 0) {
                if (Date.now() - start > timeLimit) {
                    throw new TimeoutError('Execution took too long');
                }
            }
        },
    };
    console.log('code', code);
    const result = eval(code);
    // For recursive functions
    jdScope.terms[idName(id)] = result;
    console.log('Got result', result);
    return result;
};

const contentMatches = (one: Content, two: Content) => {
    if (one.type === 'raw' || two.type === 'raw') {
        return false;
    }
    return one.type === two.type && idName(one.id) === idName(two.id);
};

export default () => {
    const [state, setState] = React.useState(() => initialState());
    React.useEffect(() => {
        window.localStorage.setItem(saveKey, JSON.stringify(state));
    }, [state]);
    // @ts-ignore
    window.evalEnv = state.evalEnv;
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
                <CellView
                    key={id}
                    env={state.env}
                    cell={state.cells[id]}
                    evalEnv={state.evalEnv}
                    onRemove={() => {
                        setState((state) => {
                            const cells = { ...state.cells };
                            delete cells[id];
                            return { ...state, cells };
                        });
                    }}
                    onRun={(id) => {
                        console.log('Running', id, state.env, state.evalEnv);
                        let result;
                        try {
                            result = runTerm(state.env, id, state.evalEnv);
                        } catch (err) {
                            console.log(`Failed to run!`);
                            console.log(err);
                            return;
                        }
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
                    addCell={(content) => {
                        if (
                            Object.keys(state.cells).some((id) =>
                                contentMatches(
                                    content,
                                    state.cells[id].content,
                                ),
                            )
                        ) {
                            return;
                        }
                        const id = genId();
                        setState((state) => ({
                            ...state,
                            cells: {
                                ...state.cells,
                                [id]: { ...blankCell, id, content },
                            },
                        }));
                    }}
                    onChange={(env, cell) => {
                        setState((state) => {
                            if (
                                cell.content.type === 'expr' ||
                                cell.content.type === 'term'
                            ) {
                                const id = cell.content.id;
                                let result;
                                try {
                                    result = runTerm(env, id, state.evalEnv);
                                } catch (err) {
                                    console.log(`Failed to run!`);
                                    console.log(err);
                                    return state;
                                }
                                return {
                                    ...state,
                                    env,
                                    evalEnv: {
                                        ...state.evalEnv,
                                        terms: {
                                            ...state.evalEnv.terms,
                                            [idName(id)]: result,
                                        },
                                    },
                                    cells: { ...state.cells, [cell.id]: cell },
                                };
                            }
                            return {
                                ...state,
                                env,
                                cells: { ...state.cells, [cell.id]: cell },
                            };
                        });
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
        </div>
    );
};
