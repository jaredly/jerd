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
import { Env, Id, defaultRng } from '../../src/typing/types';
import { printTerm } from '../../src/printing/typeScriptPrinter';
import { CellView, Cell, EvalEnv } from './Cell';

// Yea

// const toJs = (raw: string) => {
//     const parsed: Array<Toplevel> = parse(raw);

//     const { expressions, env } = typeFile(parsed);
//     const ast = fileToTypescript(expressions, env, {}, true, false);
//     removeTypescriptTypes(ast);
//     const { code, map } = generate(ast, {
//         sourceMaps: true,
//         sourceFileName: 'hello.jd',
//     });
//     return code;
// };

// const setupEnv = () => {
//     const env = presetEnv()
// }

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
    if (saved) {
        try {
            const data = JSON.parse(saved);
            return {
                ...data,
                env: {
                    ...data.env,
                    global: {
                        ...data.env.global,
                        rng: defaultRng(),
                    },
                },
            };
        } catch (err) {
            window.localStorage.removeItem(saveKey);
        }
    }
    return {
        env: presetEnv(),
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
    let termAst: any = printTerm(
        env,
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
    console.log('Got result', result);
    return result;
};

export default () => {
    const [state, setState] = React.useState(() => initialState());
    React.useEffect(() => {
        window.localStorage.setItem(saveKey, JSON.stringify(state));
    }, [state]);
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
                    onRun={(id) => {
                        console.log('Running', id, state.env, state.evalEnv);
                        let result;
                        try {
                            result = runTerm(state.env, id, state.evalEnv);
                        } catch (err) {
                            console.log(`Failed to run!`);
                            console.error(err);
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
                    onChange={(env, cell) => {
                        setState((state) => {
                            if (
                                cell.content.type === 'expr' ||
                                cell.content.type === 'term'
                            ) {
                                const id = cell.content.id;
                                const result = runTerm(env, id, state.evalEnv);
                                setState((state) => ({
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
                                }));
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
