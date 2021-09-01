import { hashObject, idFromName, idName } from '@jerd/language/src/typing/env';
import { Cell } from './State';
import { HistoryItem, State } from './App';
import { Env, idsEqual, Location, Term } from '../../language/src/typing/types';
import { transform } from '../../language/src/typing/transform';
import { getTypeError } from '../../language/src/typing/getTypeError';
import { getToplevel, updateToplevel } from './toplevels';
import { updateEvalEnv, modActiveWorkspace } from './Cells';

// What things am I updating?
// - cells
// - env
// - evalEnv

export const onChangeCell = (env: Env, state: State, cell: Cell): State => {
    const w = state.workspaces[state.activeWorkspace];
    let evalEnv = state.evalEnv;
    if (cell.content !== w.cells[cell.id].content) {
        if (cell.content.type === 'term') {
            evalEnv = updateEvalEnv(env, cell.content.id, state.evalEnv);
        }
    }

    let historyItem = null as null | HistoryItem;

    state = modActiveWorkspace((workspace) => ({
        ...workspace,
        cells: {
            ...workspace.cells,
            [cell.id]: cell,
        },
    }))({ ...state, env, evalEnv });

    const prevCell = w.cells[cell.id];
    if (
        prevCell.content.type === 'term' &&
        cell.content.type === 'term' &&
        !idsEqual(prevCell.content.id, cell.content.id)
    ) {
        const prevId = prevCell.content.id;
        const prevTerm = env.global.terms[idName(prevId)];
        const newId = cell.content.id;
        const newTerm = env.global.terms[idName(newId)];
        const areDifferent = getTypeError(
            env,
            newTerm.is,
            prevTerm.is,
            newTerm.location,
        );

        historyItem = {
            type: 'update',
            cellId: cell.id,
            fromId: prevCell.content.id,
            toId: cell.content.id,
        };

        const replace = (location: Location): Term => {
            const newRef: Term = {
                type: 'ref',
                ref: { type: 'user', id: newId },
                is: newTerm.is,
                location,
            };
            return areDifferent
                ? {
                      type: 'TypeError',
                      is: prevTerm.is,
                      inner: newRef,
                      location,
                  }
                : newRef;
        };

        // START HERE:
        // go through other cells, find dependencies
        Object.keys(w.cells).forEach((cid) => {
            if (cid === cell.id) {
                return;
            }
            const otherCell = w.cells[cid];
            if (otherCell.content.type !== 'term') {
                return;
            }
            // QQQQ: Do I update the proposed, and the currently accepted one?
            // Or just the proposed?
            // For now, we'll only update the proposed.
            if (otherCell.content.proposed) {
                const term = otherCell.content.proposed.term;
                const newTerm = transform(term, {
                    let: (_) => null,
                    term: (term) => {
                        if (
                            term.type === 'ref' &&
                            term.ref.type === 'user' &&
                            idsEqual(term.ref.id, prevId)
                        ) {
                            return replace(term.location);
                        }
                        return null;
                    },
                });

                if (newTerm !== term) {
                    state = modActiveWorkspace((workspace) => ({
                        ...workspace,
                        cells: {
                            ...workspace.cells,
                            [otherCell.id]: {
                                ...otherCell,
                                content: {
                                    ...otherCell.content,
                                    proposed: {
                                        term: newTerm,
                                        id: idFromName(hashObject(newTerm)),
                                    },
                                },
                            },
                        },
                    }))({ ...state, env, evalEnv });
                }
                return state;
            }

            // const term = other.content.proposed
            //     ? other.content.proposed.term
            const term = env.global.terms[idName(otherCell.content.id)];
            if (!term) {
                console.error(
                    `No term ${idName(otherCell.content.id)} from cell ${
                        otherCell.id
                    } 🤔`,
                );
                return;
            }
            const newTerm = transform(term, {
                let: (_) => null,
                term: (term) => {
                    if (
                        term.type === 'ref' &&
                        term.ref.type === 'user' &&
                        idsEqual(term.ref.id, prevId)
                    ) {
                        return replace(term.location);
                    }
                    return null;
                },
            });

            if (newTerm !== term) {
                const top = getToplevel(env, otherCell.content);
                const { env: nenv, content } = updateToplevel(
                    env,
                    { ...(top as any), term: newTerm },
                    cell.content,
                );
                state = onChangeCell(nenv, state, { ...otherCell, content });
            }
        });
    }

    if (historyItem) {
        state = modActiveWorkspace((workspace) => ({
            ...workspace,
            history: workspace.history.concat([historyItem!]),
        }))(state);
    }

    return state;
};
