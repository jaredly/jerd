/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app

import * as React from 'react';
import { hashObject, idFromName, idName } from '@jerd/language/src/typing/env';
import { CellView, MovePosition } from './Cell';
import { Cell, Content, Display, EvalEnv, RenderPlugins } from './State';
import { runTerm } from './eval';
import { HistoryItem, HistoryUpdate, State, Workspace } from './App';
import {
    Env,
    Id,
    idsEqual,
    Location,
    nullLocation,
    Term,
} from '../../language/src/typing/types';
import { transform } from '../../language/src/typing/transform';
import { getTypeError } from '../../language/src/typing/getTypeError';
import { getToplevel, updateToplevel } from './toplevels';
import { WorkspacePicker } from './WorkspacePicker';
import { sortCells } from './Workspace';

export const genId = () => Math.random().toString(36).slice(2);
export const blankCell: Cell = {
    id: '',
    order: 0,
    content: { type: 'raw', text: '' },
};

export const contentMatches = (one: Content, two: Content) => {
    if (one.type === 'raw' || two.type === 'raw') {
        return false;
    }
    return one.type === two.type && idName(one.id) === idName(two.id);
};

export type Action =
    | { type: 'duplicate'; id: string }
    | { type: 'focus'; id: string; direction?: 'up' | 'down' }
    | { type: 'change'; env?: Env | null; cell: Cell }
    | { type: 'run'; id: Id }
    | { type: 'remove'; id: string }
    | { type: 'move'; id: string; position: MovePosition }
    | {
          type: 'add';
          content: Content;
          position: Position;
          updateEnv?: (e: Env) => Env;
      }
    | { type: 'pin'; display: Display; id: Id }
    | { type: 'workspace:new' }
    | { type: 'workspace:rename'; name: string }
    | { type: 'workspace:focus'; id: string };

const Cells = ({
    state,
    plugins,
    focus,
    sortedCellIds,
    processAction,
}: {
    state: State;
    focus: { id: string; tick: number } | null;
    plugins: RenderPlugins;
    sortedCellIds: Array<string>;
    processAction: (action: Action) => void;
}) => {
    const work: Workspace = activeWorkspace(state);

    const tester = React.useRef(null as null | HTMLDivElement);
    const container = React.useRef(null as null | HTMLDivElement);

    const [maxWidth, setMaxWidth] = React.useState(80);

    React.useEffect(() => {
        const fn = () => {
            if (!tester.current || !container.current) {
                return;
            }
            const div = tester.current;
            const root = container.current;
            const size = div.getBoundingClientRect().width;
            const full = root.getBoundingClientRect().width;
            const chars = Math.floor(full / size);
            setMaxWidth(chars - 10);
        };
        if (!tester.current || !container.current) {
            setTimeout(fn, 20);
        } else {
            fn();
        }
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, [tester.current, container.current]);

    const getHistory = React.useCallback(
        (cellId: string) => {
            const items = work.history.filter(
                (item) => item.cellId === cellId && item.type === 'update',
            ) as Array<HistoryUpdate>;
            return items.map((item) => item.fromId);
        },
        [work.history],
    );

    return (
        <div
            style={{
                flex: 1,
                backgroundColor: '#1E1E1E',
                color: '#D4D4D4',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <WorkspacePicker state={state} processAction={processAction} />
            <div
                style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    overflow: 'auto',
                    padding: 20,
                    paddingRight: 40,
                    paddingBottom: '75vh',
                }}
                ref={container}
            >
                <span
                    ref={tester}
                    style={{
                        visibility: 'hidden',
                        pointerEvents: 'none',
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                        position: 'relative',
                        padding: 0,
                        margin: 0,
                    }}
                >
                    M
                </span>
                {sortedCellIds.map((id) => (
                    <CellView
                        key={id}
                        getHistory={getHistory}
                        focused={focus && focus.id == id ? focus.tick : null}
                        maxWidth={maxWidth}
                        env={state.env}
                        cell={work.cells[id]}
                        evalEnv={state.evalEnv}
                        plugins={plugins}
                        dispatch={processAction}
                    />
                ))}
                <button
                    css={{
                        width: '200px',
                        color: 'inherit',
                        fontFamily: 'inherit',
                        border: 'none',
                        display: 'block',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        marginTop: 24,
                        borderRadius: 4,
                        backgroundColor: 'rgba(100,100,100,0.1)',
                        ':hover': {
                            backgroundColor: 'rgba(100,100,100,0.3)',
                        },
                    }}
                    onClick={() => {
                        processAction({
                            type: 'add',
                            content: blankCell.content,
                            position: { type: 'last' },
                        });
                    }}
                >
                    New Cell
                </button>
            </div>
        </div>
    );
};

export type Position =
    | { type: 'first' }
    | { type: 'last' }
    | { type: 'after'; id: string }
    | { type: 'before'; id: string };

export const calculateOrder = (
    cells: { [key: string]: Cell },
    position: Position,
): number => {
    switch (position.type) {
        case 'first':
            const min = Object.keys(cells).reduce(
                (v: null | number, k) =>
                    v != null ? Math.min(v, cells[k].order) : cells[k].order,
                null,
            );
            return min != null ? min - 10 : 0;
        case 'last':
            const max = Object.keys(cells).reduce(
                (v: null | number, k: string) =>
                    v != null ? Math.max(v, cells[k].order) : cells[k].order,
                null,
            );
            return max != null ? max + 10 : 0;
        case 'after':
        case 'before':
            const sorted = Object.keys(cells).sort(sortCells(cells));
            const idx = sorted.indexOf(position.id);
            if (idx === -1) {
                console.warn(`Relative not found!`, position, cells);
                return calculateOrder(cells, {
                    type: position.type === 'before' ? 'first' : 'last',
                });
            }
            if (position.type === 'before') {
                return idx === 0
                    ? cells[sorted[idx]].order - 10
                    : (cells[sorted[idx - 1]].order +
                          cells[sorted[idx]].order) /
                          2;
            } else {
                return idx === sorted.length - 1
                    ? cells[sorted[idx]].order + 10
                    : (cells[sorted[idx + 1]].order +
                          cells[sorted[idx]].order) /
                          2;
            }
        default:
            let _x: never = position;
            throw new Error(
                `Unexpected position type ${(position as any).type}`,
            );
    }
};

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

export const updateEvalEnv = (env: Env, id: Id, evalEnv: EvalEnv): EvalEnv => {
    let results: any = {};
    try {
        const term = env.global.terms[idName(id)];
        if (!term) {
            throw new Error(`No term ${idName(id)}`);
        }

        results = runTerm(env, term, id, evalEnv);
    } catch (err) {
        console.log(`Failed to run!`);
        console.log(err);
        // return state;
    }
    return {
        ...evalEnv,
        terms: {
            ...evalEnv.terms,
            ...results,
        },
    };
};

export const activeWorkspace = (state: State) =>
    state.workspaces[state.activeWorkspace];

export const modActiveWorkspace = (fn: (w: Workspace) => Workspace) => (
    state: State,
) => ({
    ...state,
    workspaces: {
        ...state.workspaces,
        [state.activeWorkspace]: fn(state.workspaces[state.activeWorkspace]),
    },
});

export default Cells;

export const addCell = (cell: Cell, position: Position) => (
    workspace: Workspace,
) => ({
    ...workspace,
    cells: {
        ...workspace.cells,
        [cell.id]: {
            ...cell,
            order: calculateOrder(workspace.cells, position),
        },
    },
});
