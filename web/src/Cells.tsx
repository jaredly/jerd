/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app

import * as React from 'react';
import { idFromName, idName } from '@jerd/language/src/typing/env';
import { CellView, MovePosition } from './Cell';
import { Cell, Content, EvalEnv, RenderPlugins } from './State';
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

const Cells = ({
    state,
    plugins,
    setState,
    focus,
    setFocus,
}: {
    state: State;
    focus: { id: string; tick: number } | null;
    setFocus: (f: { id: string; tick: number } | null) => void;
    plugins: RenderPlugins;
    setState: (fn: (s: State) => State) => void;
}) => {
    const work: Workspace = activeWorkspace(state);
    const focusRef = React.useRef(focus);
    focusRef.current = focus;

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

    const sortedCellIds = Object.keys(work.cells).sort(sortCells(work.cells));

    const onFocus = React.useCallback(
        (id: string) =>
            !focus || focus.id !== id ? setFocus({ id, tick: 0 }) : null,
        [],
    );

    const onPin = React.useCallback((display, id) => {
        setState(
            modActiveWorkspace((workspace) => ({
                ...workspace,
                pins: workspace.pins.concat([{ display, id }]),
            })),
        );
    }, []);

    const onRemove = React.useCallback((id: string) => {
        setState(
            modActiveWorkspace((work) => {
                const cells = { ...work.cells };
                delete cells[id];
                return { ...work, cells };
            }),
        );
    }, []);

    const onRun = React.useCallback(
        (id) => {
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
        },
        [state],
    );

    const addCell_ = React.useCallback(
        (content, position: Position) => {
            const work = activeWorkspace(state);
            const matching = Object.keys(work.cells).find((id) =>
                contentMatches(content, work.cells[id].content),
            );
            if (matching) {
                if (focus && focus.id == matching) {
                    setFocus({
                        id: matching,
                        tick: focus.tick + 1,
                    });
                } else {
                    setFocus({ id: matching, tick: 0 });
                }
                return;
            }
            const id = genId();
            setState(
                modActiveWorkspace(
                    addCell({ ...blankCell, id, content }, position),
                ),
            );
            setFocus({ id, tick: 0 });
        },
        [state],
    );

    const onDuplicate = React.useCallback((id: string) => {
        const pos: Position = { type: 'after', id };
        const nid = genId();
        setState(
            modActiveWorkspace((w: Workspace) => {
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
        setFocus({ id: nid, tick: 0 });
    }, []);

    const onMove = React.useCallback((id: string, position: MovePosition) => {
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
            modActiveWorkspace((w: Workspace) => {
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
    }, []);

    const onChange = React.useCallback((env, cell) => {
        console.log('Change', cell);
        setState((state) => {
            return onChangeCell(env, state, cell);
        });
    }, []);

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
            <WorkspacePicker state={state} setState={setState} />
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
                        focused={focus && focus.id == id ? focus.tick : null}
                        onFocus={onFocus}
                        maxWidth={maxWidth}
                        env={state.env}
                        cell={work.cells[id]}
                        evalEnv={state.evalEnv}
                        plugins={plugins}
                        onPin={onPin}
                        onRemove={onRemove}
                        onRun={onRun}
                        addCell={addCell_}
                        onDuplicate={onDuplicate}
                        onMove={onMove}
                        onChange={onChange}
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
                        const id = genId();
                        setState(
                            modActiveWorkspace((workspace) => ({
                                ...workspace,
                                cells: {
                                    ...workspace.cells,
                                    [id]: {
                                        ...blankCell,
                                        id,
                                        order: calculateOrder(workspace.cells, {
                                            type: 'last',
                                        }),
                                    },
                                },
                            })),
                        );
                        setFocus({ id, tick: 0 });
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

const sortCells = (cells: { [key: string]: Cell }) => (
    a: string,
    b: string,
) => {
    return cells[a].order - cells[b].order;
};

const calculateOrder = (
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
        prevCell.content.id !== cell.content.id
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
            const other = w.cells[cid];
            if (other.content.type !== 'term') {
                return;
            }
            const oid = other.content.id;
            const term = env.global.terms[idName(oid)];
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
                const top = getToplevel(env, other.content);
                const { env: nenv, content } = updateToplevel(
                    env,
                    { ...(top as any), term: newTerm },
                    cell.content,
                );
                state = onChangeCell(nenv, state, { ...other, content });
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
