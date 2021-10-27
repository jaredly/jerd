import {
    hashObject,
    idFromName,
    idName,
    termForId,
} from '@jerd/language/src/typing/env';
import { Cell, EvalEnv } from '../State';
import { HistoryItem, State, Workspace } from '../State';
import {
    Env,
    Id,
    idsEqual,
    Location,
    Term,
} from '@jerd/language/src/typing/types';
import { transform } from '@jerd/language/src/typing/transform';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import { getToplevel, updateToplevel } from '../toplevels';
import { modActiveWorkspace } from './Cells';
import { runTerm } from '../eval';

// What things am I updating?
// - cells
// - env
// - evalEnv

export const onChangeCell = (env: Env, state: State, cell: Cell): State => {
    const w = state.workspaces[state.activeWorkspace];
    let evalEnv = state.evalEnv;

    // Evaluate the new cell contents
    if (cell.content !== w.cells[cell.id].content) {
        if (cell.content.type === 'term') {
            evalEnv = updateEvalEnv(env, cell.content.id, state.evalEnv);
        }
    }

    // Update the cell
    state = modActiveWorkspace((workspace) => ({
        ...workspace,
        cells: {
            ...workspace.cells,
            [cell.id]: cell,
        },
    }))({ ...state, env, evalEnv });

    // Go through other cells, find dependencies
    return updateOtherCells(w, cell, w.cells[cell.id], state, env, evalEnv);
};

export const updateEvalEnv = (env: Env, id: Id, evalEnv: EvalEnv): EvalEnv => {
    let results: any = {};
    try {
        const term = termForId(env, id);
        if (!term) {
            throw new Error(`No term ${idName(id)}`);
        }

        results = runTerm(env, term, id, evalEnv);
    } catch (err) {
        console.log(`Failed to run!`);
        console.log(err);
        return evalEnv;
    }
    return {
        ...evalEnv,
        terms: {
            ...evalEnv.terms,
            ...results,
        },
    };
};

function updateOtherCells(
    w: Workspace,
    cell: Cell,
    prevCell: Cell,
    // replace: (location: Location) => Term,
    state: State,
    env: Env,
    evalEnv: EvalEnv,
): State {
    if (prevCell.content.type !== 'term' || cell.content.type !== 'term') {
        return state;
    }
    if (idsEqual(prevCell.content.id, cell.content.id)) {
        return state;
    }

    const historyItem: HistoryItem = {
        type: 'update',
        cellId: cell.id,
        fromId: prevCell.content.id,
        toId: cell.content.id,
    };

    const prevId = prevCell.content.id;
    const prevTerm = termForId(env, prevId);
    const newId = cell.content.id;
    const newTerm = termForId(env, newId);
    const areDifferent = getTypeError(
        env,
        newTerm.is,
        prevTerm.is,
        newTerm.location,
    );

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
        const proposed = otherCell.content.proposed;
        if (proposed) {
            const term = proposed.term;
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
                                // TODO: retain name of thing
                                propose: {
                                    ...proposed,
                                    term: newTerm,
                                    id: idFromName(hashObject(newTerm)),
                                    location: newTerm.location,
                                },
                                // proposed: {
                                //     type: 'Expression',
                                //     // @ts-ignore // TODO: Update proposed for all kinds of things
                                // },
                            },
                        },
                    },
                }))({ ...state, env, evalEnv });
            }
            return state;
        }

        // const term = other.content.proposed
        //     ? other.content.proposed.term
        const term = termForId(env, otherCell.content.id);
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

    state = modActiveWorkspace((workspace) => ({
        ...workspace,
        history: workspace.history.concat([historyItem!]),
    }))(state);

    return state;
}
