// The app

import * as t from '@babel/types';
import * as React from 'react';
import {
    optimizeAST,
    removeTypescriptTypes,
} from '../../src/printing/typeScriptOptimize';
import * as builtins from '../../src/printing/prelude';

import { presetEnv } from '../../src/typing/preset';
import {
    getSortedTermDependencies,
    allLiteral,
} from '../../src/typing/analyze';
import generate from '@babel/generator';
import { idName } from '../../src/typing/env';
import { Env, Id, selfEnv, Term } from '../../src/typing/types';
import { printTerm } from '../../src/printing/typeScriptPrinter';
import { CellView, Cell, EvalEnv, Content, getToplevel, Plugins } from './Cell';
import { toplevelToPretty } from '../../src/printing/printTsLike';
import { printToString } from '../../src/printing/printer';

import DrawablePlugins from './display/Drawable';

const defaultPlugins: Plugins = {
    ...DrawablePlugins,
};

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
                    // Reset the local env
                    local: env.local,
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

const termToJS = (env: Env, term: Term, idName: string) => {
    let termAst: any = printTerm(
        env,
        { scope: 'jdScope', limitExecutionTime: true },
        term,
    );
    let ast = t.file(t.program([t.returnStatement(termAst)], [], 'script'));
    optimizeAST(ast);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: idName,
    });

    return code;
};

const runWithExecutionLimit = (
    code: string,
    evalEnv: EvalEnv,
    idName: string,
) => {
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
    // yay now it's safe from weird scoping things.
    const result = new Function('jdScope', code)(jdScope);
    // This is so recursive calls work
    jdScope.terms[idName] = result;
    return result;
};

export const runTerm = (env: Env, term: Term, id: Id, evalEnv: EvalEnv) => {
    const results = {};

    const deps = getSortedTermDependencies(env, term, id);
    console.log(deps);
    const idn = idName(id);
    deps.forEach((dep) => {
        if (evalEnv.terms[dep] == null) {
            console.log(dep, 'isnt there');
            const depTerm = idn === dep ? term : env.global.terms[dep];
            const self = { name: dep, type: term.is };
            const code = termToJS(selfEnv(env, self), depTerm, dep);
            const innerEnv = {
                ...evalEnv,
                terms: { ...evalEnv.terms, ...results },
            };
            const result = runWithExecutionLimit(code, innerEnv, dep);
            results[dep] = result;
            console.log('result', dep, result);
        } else {
            console.log('already evaluated', dep, evalEnv.terms[dep]);
        }
    });
    return results;
};

const contentMatches = (one: Content, two: Content) => {
    if (one.type === 'raw' || two.type === 'raw') {
        return false;
    }
    return one.type === two.type && idName(one.id) === idName(two.id);
};

const stateToString = (state: State) => {
    const terms = {};
    Object.keys(state.evalEnv.terms).forEach((k) => {
        if (allLiteral(state.env, state.env.global.terms[k].is)) {
            terms[k] = state.evalEnv.terms[k];
            // } else {
            //     console.warn(`Not saving ${k}, not all literal`);
        }
    });
    return JSON.stringify({ ...state, evalEnv: { ...state.evalEnv, terms } });
};

export default () => {
    const [state, setState] = React.useState(() => initialState());
    React.useEffect(() => {
        window.localStorage.setItem(saveKey, stateToString(state));
    }, [state]);
    // @ts-ignore
    window.evalEnv = state.evalEnv;
    // @ts-ignore
    window.state = state;
    // @ts-ignore
    window.renderFile = () => {
        return Object.keys(state.cells)
            .map((k) => {
                const c = state.cells[k].content;
                if (c.type !== 'raw' && c.type !== 'expr') {
                    const top = getToplevel(state.env, c);
                    return printToString(
                        toplevelToPretty(state.env, top),
                        100,
                        { hideIds: true },
                    );
                }
                return null;
            })
            .filter(Boolean)
            .join('\n\n');
    };
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
                    plugins={defaultPlugins}
                    onRemove={() => {
                        setState((state) => {
                            const cells = { ...state.cells };
                            delete cells[id];
                            return { ...state, cells };
                        });
                    }}
                    onRun={(id) => {
                        console.log('Running', id, state.env, state.evalEnv);
                        let results;
                        try {
                            const term = state.env.global.terms[idName(id)];
                            if (!term) {
                                throw new Error(`No term ${idName(id)}`);
                            }

                            results = runTerm(
                                state.env,
                                term,
                                id,
                                state.evalEnv,
                            );
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
                                    ...results,
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
                            if (cell.content === state.cells[cell.id].content) {
                                return {
                                    ...state,
                                    cells: { ...state.cells, [cell.id]: cell },
                                };
                            }
                            if (
                                cell.content.type === 'expr' ||
                                cell.content.type === 'term'
                            ) {
                                const id = cell.content.id;
                                let results: any;
                                try {
                                    const term = env.global.terms[idName(id)];
                                    if (!term) {
                                        throw new Error(
                                            `No term ${idName(id)}`,
                                        );
                                    }

                                    results = runTerm(
                                        env,
                                        term,
                                        id,
                                        state.evalEnv,
                                    );
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
                                            ...results,
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
