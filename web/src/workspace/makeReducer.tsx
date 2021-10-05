import * as React from 'react';
import { State, Workspace as WorkspaceT } from '../State';
import {
    Action,
    activeWorkspace,
    addCell,
    blankCell,
    calculateOrder,
    contentMatches,
    genId,
    modActiveWorkspace,
    Position,
} from './Cells';
import { onChangeCell } from './onChangeCell';
import { runTerm } from '../eval';
import { idName } from '@jerd/language/src/typing/env';
import { focusUp, focusDown } from './Workspace';

export function makeReducer(
    state$: React.MutableRefObject<State>,
    sortedCellIds$: { current: string[] },
    setFocus: (f: { id: string; tick: number; active: boolean } | null) => void,
    focusRef: React.MutableRefObject<{
        id: string;
        tick: number;
        active: boolean;
    } | null>,
    setState: (fn: (s: State) => State) => void,
): (action: Action) => void {
    return (action: Action) => {
        const focus = focusRef.current;
        const sortedCellIds = sortedCellIds$.current;
        const state = state$.current;

        switch (action.type) {
            case 'focus': {
                const { id, direction, active } = action;
                if (direction === 'up') {
                    const up = focusUp(sortedCellIds, id, active);
                    if (up) {
                        setFocus(up);
                    }
                    return;
                }
                if (direction === 'down') {
                    const down = focusDown(sortedCellIds, id, active);
                    if (down) {
                        setFocus(down);
                    }
                    return;
                }
                if (!focus || focus.id !== id || active !== focus.active) {
                    setFocus({ id, tick: 0, active });
                }
                return;
            }
            case 'remove': {
                return setState(
                    modActiveWorkspace((work) => {
                        const cells = { ...work.cells };
                        delete cells[action.id];
                        return { ...work, cells };
                    }),
                );
            }
            case 'run': {
                const { id } = action;
                let results: { [key: string]: any };
                try {
                    const term = state.env.global.terms[idName(id)];
                    if (!term) {
                        throw new Error(`No term ${idName(id)}`);
                    }

                    results = runTerm(state.env, term, id, state.evalEnv);
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
                return;
            }
            case 'add': {
                const { content, position, updateEnv } = action;
                const work = activeWorkspace(state);
                const matching = Object.keys(work.cells).find((id) =>
                    contentMatches(content, work.cells[id].content),
                );
                if (matching) {
                    if (focus && focus.id == matching) {
                        setFocus({
                            id: matching,
                            tick: focus.tick + 1,
                            active: false,
                        });
                    } else {
                        setFocus({ id: matching, tick: 0, active: false });
                    }
                    return;
                }
                const id = genId();
                setState((state) => {
                    if (updateEnv) {
                        state = { ...state, env: updateEnv(state.env) };
                    }

                    return modActiveWorkspace(
                        addCell({ ...blankCell, id, content }, position),
                    )(state);
                });
                setFocus({ id, tick: 0, active: false });
                return;
            }
            case 'duplicate': {
                const { id } = action;
                const pos: Position = { type: 'after', id };
                const nid = genId();
                setState(
                    modActiveWorkspace((w: WorkspaceT) => {
                        const order = calculateOrder(w.cells, pos);
                        return {
                            ...w,
                            cells: {
                                ...w.cells,
                                [nid]: {
                                    ...w.cells[id],
                                    id: nid,
                                    order,
                                },
                            },
                        };
                    }),
                );
                setFocus({ id: nid, tick: 0, active: false });
                return;
            }
            case 'move': {
                const { position, id } = action;
                if (typeof position !== 'string') {
                    return;
                }
                const idx = sortedCellIds.indexOf(id);
                if (idx === 0 && position === 'up') {
                    return;
                }
                if (idx === sortedCellIds.length - 1 && position === 'down') {
                    return;
                }

                const pos: Position =
                    position === 'up'
                        ? {
                              type: 'before',
                              id: sortedCellIds[idx - 1],
                          }
                        : {
                              type: 'after',
                              id: sortedCellIds[idx + 1],
                          };

                setState(
                    modActiveWorkspace((w: WorkspaceT) => {
                        const order = calculateOrder(w.cells, pos);
                        return {
                            ...w,
                            cells: {
                                ...w.cells,
                                [id]: {
                                    ...w.cells[id],
                                    order,
                                },
                            },
                        };
                    }),
                );
                return;
            }
            case 'change': {
                return setState((state) => {
                    return onChangeCell(
                        action.env ? action.env : state.env,
                        state,
                        action.cell,
                    );
                });
            }
            case 'pin': {
                const { display, id } = action;
                return setState(
                    modActiveWorkspace((workspace) => ({
                        ...workspace,
                        pins: workspace.pins.concat([{ display, id }]),
                    })),
                );
            }

            case 'workspace:new': {
                const id = genId();
                return setState((state) => ({
                    ...state,
                    activeWorkspace: id,
                    workspaces: {
                        ...state.workspaces,
                        [id]: {
                            name: 'New Workspace',
                            pins: [],
                            cells: {},
                            history: [],
                            archivedPins: [],
                            currentPin: 0,
                            order: Object.keys(state.workspaces).length,
                        },
                    },
                }));
            }
            case 'workspace:focus': {
                return setState((state) => ({
                    ...state,
                    activeWorkspace: action.id,
                }));
            }
            case 'workspace:rename': {
                setState(
                    modActiveWorkspace((w) => ({
                        ...w,
                        name: action.name,
                    })),
                );
            }
        }
    };
}
