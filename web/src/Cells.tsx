// The app

import * as React from 'react';
import { idName } from '../../src/typing/env';
import { CellView, Cell, Content } from './Cell';
import { runTerm } from './eval';

const genId = () => Math.random().toString(36).slice(2);
const blankCell: Cell = {
    id: '',
    content: { type: 'raw', text: '' },
};

const contentMatches = (one: Content, two: Content) => {
    if (one.type === 'raw' || two.type === 'raw') {
        return false;
    }
    return one.type === two.type && idName(one.id) === idName(two.id);
};

const Cells = ({ state, plugins, setState }) => {
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
                    plugins={plugins}
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

export default Cells;
