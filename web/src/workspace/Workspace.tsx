/** @jsx jsx */
import { jsx } from '@emotion/react';
import * as React from 'react';
import {
    HistoryItem,
    HistoryUpdate,
    State,
    Workspace as WorkspaceT,
} from '../State';
import Cells, {
    activeWorkspace,
    blankCell,
    contentMatches,
    genId,
    modActiveWorkspace,
} from './Cells';

import { runTerm } from '../eval';
import Library from '../Library';
import { Cell, Content } from '../State';
import { Pin } from './Pin';
import { QuickMenu } from './QuickMenu';
import { idName } from '@jerd/language/src/typing/env';
import { Id } from '@jerd/language/src/typing/types';
import { defaultPlugins } from '../defaultPlugins';
import { makeReducer } from './makeReducer';
import { ImportExport } from './ImportExport';

export type Props = {
    state: State;
    setState: ((fn: (s: State) => State) => void) & ((s: State) => void);
};

export const sortCells = (cells: { [key: string]: Cell }) => (
    a: string,
    b: string,
) => {
    return cells[a].order - cells[b].order;
};

export const useUpdated = <T,>(value: T) => {
    const ref = React.useRef(value);
    ref.current = value;
    return ref;
};

const useCommandP = (setShowMenu: (show: boolean) => void) => {
    React.useEffect(() => {
        const fn = (evt: KeyboardEvent) => {
            if (evt.key === 'p' && (evt.metaKey || evt.ctrlKey)) {
                evt.preventDefault();
                evt.stopPropagation();
                setShowMenu(true);
                return;
            }
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, []);
};

export const Workspace = ({ state, setState }: Props) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const [showFrozen, setShowFrozen] = React.useState(false);

    const workspace = activeWorkspace(state);

    useCommandP(setShowMenu);

    const work: WorkspaceT = activeWorkspace(state);
    const sortedCellIds = React.useMemo(
        () => Object.keys(work.cells).sort(sortCells(work.cells)),
        [work],
    );

    const sortedCellIds$ = useUpdated(sortedCellIds);

    const [focus, setFocus] = React.useState(
        (sortedCellIds.length
            ? {
                  id: sortedCellIds[0],
                  tick: 0,
                  active: false,
              }
            : null) as null | { id: string; tick: number; active: boolean },
    );

    const onOpen = React.useCallback(
        (content: Content) => {
            if (
                Object.keys(
                    state.workspaces[state.activeWorkspace].cells,
                ).some((id) =>
                    contentMatches(
                        content,
                        state.workspaces[state.activeWorkspace].cells[id]
                            .content,
                    ),
                )
            ) {
                return;
            }
            const id = genId();
            setFocus({ id, tick: 0, active: false });
            setState(
                modActiveWorkspace((workspace) => ({
                    ...workspace,
                    cells: {
                        [id]: { ...blankCell, id, content },
                        ...workspace.cells,
                    },
                })),
            );
        },
        [state.workspaces],
    );

    const onRemove = React.useCallback(
        (pin: Pin) =>
            setState(
                modActiveWorkspace((workspace) => ({
                    ...workspace,
                    archivedPins: workspace.archivedPins.filter(
                        (p) => p !== pin,
                    ),
                    pins: workspace.pins.filter((p) => p !== pin),
                })),
            ),
        [],
    );

    const onArchive = React.useCallback(
        (pin: Pin) =>
            setState(
                modActiveWorkspace((workspace) => {
                    const isFrozen = workspace.archivedPins.includes(pin);
                    if (isFrozen) {
                        return {
                            ...workspace,
                            archivedPins: workspace.archivedPins.filter(
                                (p) => p !== pin,
                            ),
                            pins: workspace.pins.concat([pin]),
                        };
                    }
                    return {
                        ...workspace,
                        pins: workspace.pins.filter((p) => p !== pin),
                        archivedPins: workspace.archivedPins.concat([pin]),
                    };
                }),
            ),
        [],
    );

    const onRun = React.useCallback(
        (id: Id) => {
            let results: { [key: string]: any };
            try {
                const term = state.termForId(env, id);
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

    const state$ = useUpdated(state);
    const focus$ = useUpdated(focus);

    const processAction = React.useCallback(
        makeReducer(state$, sortedCellIds$, setFocus, focus$, setState),
        [],
    );

    React.useEffect(() => {
        const fn = (evt: KeyboardEvent) => {
            if (evt.target !== document.body) {
                return;
            }
            const focus = focus$.current;
            if (!focus || focus.active) {
                return;
            }
            if (evt.key === 'k' || evt.key === 'ArrowUp') {
                const up = focusUp(sortedCellIds$.current, focus.id, false);
                if (up) {
                    setFocus(up);
                }
                evt.preventDefault();
                evt.stopPropagation();
                return;
            }
            if (evt.key === 'j' || evt.key === 'ArrowDown') {
                const down = focusDown(sortedCellIds$.current, focus.id, false);
                if (down) {
                    setFocus(down);
                }
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (evt.key === 'o') {
                processAction({
                    type: 'add',
                    position: { type: 'after', id: focus.id },
                    content: { type: 'raw', text: '' },
                });
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (evt.key === 'O') {
                processAction({
                    type: 'add',
                    position: { type: 'before', id: focus.id },
                    content: { type: 'raw', text: '' },
                });
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (evt.key === 'Enter') {
                evt.preventDefault();
                evt.stopPropagation();
                setFocus({ ...focus, active: true });
            }
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, []);

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'row',
                color: '#D4D4D4',
            }}
        >
            <Library
                env={state.env}
                onOpen={onOpen}
                plugins={defaultPlugins}
                footer={<ImportExport state={state} setState={setState} />}
            />
            <Cells
                sortedCellIds={sortedCellIds}
                processAction={processAction}
                state={state}
                focus={focus}
                plugins={defaultPlugins}
            />
            <div
                style={{
                    overflow: 'auto',
                    width: 200,
                    flexShrink: 0,
                }}
            >
                <div style={{ padding: 8 }}>Pinned terms</div>
                <div
                    onClick={() => {
                        setShowFrozen(!showFrozen);
                    }}
                    css={{
                        cursor: 'pointer',
                        padding: '4px 8px',
                        ':hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                    }}
                >
                    {workspace.archivedPins.length
                        ? `${workspace.archivedPins.length} frozen pins`
                        : null}
                </div>
                {(showFrozen
                    ? workspace.archivedPins.concat(workspace.pins)
                    : workspace.pins
                ).map((pin, i) => (
                    <div
                        key={i + ' ' + idName(pin.id)}
                        css={{
                            position: 'relative',
                        }}
                    >
                        <Pin
                            pin={pin}
                            env={state.env}
                            evalEnv={state.evalEnv}
                            plugins={defaultPlugins}
                            onOpen={onOpen}
                            isFrozen={workspace.archivedPins.includes(pin)}
                            onArchive={onArchive}
                            onRemove={onRemove}
                            onRun={onRun}
                        />
                    </div>
                ))}
                <div
                    css={{
                        flex: 1,
                    }}
                >
                    <div>Workspace History</div>
                    {workspace.history.map((item, i) => (
                        <div
                            key={i}
                            css={{
                                fontSize: '80%',
                                fontFamily: 'monospace',
                            }}
                        >
                            {item.type === 'update'
                                ? `#${idName(item.fromId)} -> #${idName(
                                      item.toId,
                                  )}`
                                : `Pin ${item.id}`}
                        </div>
                    ))}
                </div>
            </div>
            {showMenu ? (
                <QuickMenu
                    env={state.env}
                    index={state.index}
                    onClose={() => setShowMenu(false)}
                    onOpen={onOpen}
                />
            ) : null}
        </div>
    );
};

export const focusDown = (
    sortedCellIds: Array<string>,
    id: string,
    active: boolean,
) => {
    const at = sortedCellIds.indexOf(id);
    if (at < sortedCellIds.length - 1) {
        return {
            id: sortedCellIds[at + 1],
            tick: 0,
            active,
        };
    }
};

export const focusUp = (
    sortedCellIds: Array<string>,
    id: string,
    active: boolean,
) => {
    const at = sortedCellIds.indexOf(id);
    return at > 0
        ? {
              id: sortedCellIds[at - 1],
              tick: 0,
              active,
          }
        : null;
};
