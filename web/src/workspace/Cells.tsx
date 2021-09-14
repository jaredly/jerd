/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app

import * as React from 'react';
import { idName } from '@jerd/language/src/typing/env';
import { MovePosition } from '../Cell/Cell';
import { Cell, Content, Display, EvalEnv, RenderPlugins } from '../State';
import { runTerm } from '../eval';
import { HistoryUpdate, State, Workspace } from '../App';
import { Env, Id, nullLocation } from '@jerd/language/src/typing/types';
import { WorkspacePicker } from './WorkspacePicker';
import { sortCells } from './Workspace';
import { Cell2 } from '../Cell/Cell2';

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
    | { type: 'focus'; id: string; active: boolean; direction?: 'up' | 'down' }
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
    focus: { id: string; tick: number; active: boolean } | null;
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
                    <Cell2
                        key={id}
                        getHistory={getHistory}
                        focused={focus && focus.id == id ? focus : null}
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
