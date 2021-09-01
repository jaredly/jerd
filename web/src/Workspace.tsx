/** @jsx jsx */
import { jsx } from '@emotion/react';
import * as React from 'react';
import {
    HistoryItem,
    HistoryUpdate,
    State,
    Workspace as WorkspaceT,
} from './App';
import Cells, {
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

import DrawablePlugins from './display/Drawable';
import OpenGLPlugins from './display/OpenGL';
import ColorPlugins from './display/Color';
import StdioPlugins from './display/Stdio';
import MusicPlugins from './plugins/music/music';
import { runTerm } from './eval';
import Library from './Library';
import { Cell, Content, RenderPlugins } from './State';
import { Pin } from './Pin';
import { QuickMenu } from './QuickMenu';
import { idName } from '../../language/src/typing/env';
import { Id } from '../../language/src/typing/types';
import { stateToString } from './persistence';

const defaultPlugins: RenderPlugins = {
    ...DrawablePlugins,
    ...StdioPlugins,
    ...OpenGLPlugins,
    ...ColorPlugins,
    ...MusicPlugins,
};

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

const useUpdated = <T,>(value: T) => {
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

    const [focus, setFocus] = React.useState(
        null as null | { id: string; tick: number },
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
            setFocus({ id, tick: 0 });
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

    const work: WorkspaceT = activeWorkspace(state);

    const sortedCellIds = React.useMemo(
        () => Object.keys(work.cells).sort(sortCells(work.cells)),
        [work],
    );

    const sortedCellIds$ = useUpdated(sortedCellIds);
    const state$ = useUpdated(state);

    const focus$ = useUpdated(focus);

    const processAction = React.useCallback(
        makeReducer(state$, sortedCellIds$, setFocus, focus$, setState),
        [],
    );

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

export const ImportExport = ({
    state,
    setState,
}: {
    state: State;
    setState: (s: State) => void;
}) => {
    const [url, setUrl] = React.useState(null as string | null);
    return (
        <div
            css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
            }}
        >
            <div>
                <button
                    onClick={() => {
                        const blob = new Blob([stateToString(state)]);
                        const url = URL.createObjectURL(blob);
                        setUrl(url);
                    }}
                >
                    Export
                </button>
                {url ? (
                    <a
                        href={url}
                        download={`jerd-ide-dump-${new Date().toISOString()}.json`}
                    >
                        Download dump
                    </a>
                ) : null}
            </div>
            <div>
                Import:{' '}
                <input
                    type="file"
                    onChange={(evt) => {
                        if (
                            !evt.target.files ||
                            evt.target.files.length !== 1
                        ) {
                            console.log('no files! or wrong', evt.target.files);
                            return;
                        }
                        const file = evt.target.files[0];
                        const reader = new FileReader();
                        reader.onload = () => {
                            const data = JSON.parse(reader.result as string);
                            setState(data);
                        };
                        reader.readAsText(file, 'utf8');
                    }}
                />
            </div>
        </div>
    );
};

export function makeReducer(
    state$: React.MutableRefObject<State>,
    sortedCellIds$: { current: string[] },
    setFocus: (f: { id: string; tick: number } | null) => void,
    focusRef: React.MutableRefObject<{ id: string; tick: number } | null>,
    setState: (fn: (s: State) => State) => void,
): (action: Action) => void {
    return (action: Action) => {
        const focus = focusRef.current;
        const sortedCellIds = sortedCellIds$.current;
        const state = state$.current;

        switch (action.type) {
            case 'focus': {
                const { id, direction } = action;
                if (direction === 'up') {
                    const at = sortedCellIds.indexOf(id);
                    if (at > 0) {
                        setFocus({ id: sortedCellIds[at - 1], tick: 0 });
                    }
                    return;
                }
                if (direction === 'down') {
                    const at = sortedCellIds.indexOf(id);
                    if (at < sortedCellIds.length - 1) {
                        setFocus({ id: sortedCellIds[at + 1], tick: 0 });
                    }
                    return;
                }
                if (!focusRef.current || focusRef.current.id !== id) {
                    setFocus({ id, tick: 0 });
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
                        });
                    } else {
                        setFocus({ id: matching, tick: 0 });
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
                setFocus({ id, tick: 0 });
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
                setFocus({ id: nid, tick: 0 });
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
