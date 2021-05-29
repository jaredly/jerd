/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app

import * as React from 'react';
import { idFromName, idName } from '@jerd/language/src/typing/env';
import { CellView } from './Cell';
import { Cell, Content, Plugins } from './State';
import { runTerm } from './eval';
import { State, Workspace } from './App';

export const genId = () => Math.random().toString(36).slice(2);
export const blankCell: Cell = {
    id: '',
    content: { type: 'raw', text: '' },
};

export const contentMatches = (one: Content, two: Content) => {
    if (one.type === 'raw' || two.type === 'raw') {
        return false;
    }
    return one.type === two.type && idName(one.id) === idName(two.id);
};

const WorkspacePicker = ({
    state,
    setState,
}: {
    state: State;
    setState: (fn: (current: State) => State) => void;
}) => {
    const [editing, setEditing] = React.useState(null as string | null);
    let body;
    if (editing != null) {
        body = (
            <React.Fragment>
                <input
                    value={editing}
                    autoFocus
                    onChange={(evt) => {
                        setEditing(evt.target.value);
                    }}
                />
                <button
                    onClick={() => {
                        setState(
                            modActiveWorkspace((w) => ({
                                ...w,
                                name: editing,
                            })),
                        );
                        setEditing(null);
                    }}
                >
                    Ok
                </button>
                <button
                    onClick={() => {
                        setEditing(null);
                    }}
                >
                    Cancel
                </button>
            </React.Fragment>
        );
    } else {
        body = (
            <React.Fragment>
                <select
                    value={state.activeWorkspace}
                    onChange={(evt) => {
                        const activeWorkspace = evt.target.value;
                        console.log(evt.target.value);
                        if (evt.target.value === '<new>') {
                            const id = genId();
                            setState((state) => ({
                                ...state,
                                activeWorkspace: id,
                                workspaces: {
                                    ...state.workspaces,
                                    [id]: {
                                        name: 'New Workspace',
                                        pins: [],
                                        cells: {},
                                        order: Object.keys(state.workspaces)
                                            .length,
                                    },
                                },
                            }));
                        } else {
                            setState((state) => ({
                                ...state,
                                activeWorkspace,
                            }));
                        }
                    }}
                >
                    {Object.keys(state.workspaces).map((id) => (
                        <option value={id} key={id}>
                            {state.workspaces[id].name}
                        </option>
                    ))}
                    <option value="<new>">Create new workspace</option>
                </select>
                <button
                    onClick={() => {
                        setEditing(
                            state.workspaces[state.activeWorkspace].name,
                        );
                    }}
                >
                    Edit
                </button>
            </React.Fragment>
        );
    }
    return (
        <div
            css={{
                padding: '8px 16px',
                fontSize: 16,
            }}
        >
            Workspace: {body}
        </div>
    );
};

const Cells = ({
    state,
    plugins,
    setState,
}: {
    state: State;
    plugins: Plugins;
    setState: (fn: (s: State) => State) => void;
}) => {
    const work = activeWorkspace(state);

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
                {Object.keys(work.cells).map((id) => (
                    <CellView
                        key={id}
                        maxWidth={maxWidth}
                        env={state.env}
                        cell={work.cells[id]}
                        evalEnv={state.evalEnv}
                        plugins={plugins}
                        onPin={(display, id) => {
                            setState(
                                modActiveWorkspace((workspace) => ({
                                    ...workspace,
                                    pins: workspace.pins.concat([
                                        { display, id },
                                    ]),
                                })),
                            );
                        }}
                        onRemove={() => {
                            setState(
                                modActiveWorkspace((work) => {
                                    const cells = { ...work.cells };
                                    delete cells[id];
                                    return { ...work, cells };
                                }),
                            );
                        }}
                        onRun={(id) => {
                            console.log(
                                'Running',
                                id,
                                state.env,
                                state.evalEnv,
                            );
                            let results: { [key: string]: any };
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
                            const work = activeWorkspace(state);
                            if (
                                Object.keys(work.cells).some((id) =>
                                    contentMatches(
                                        content,
                                        work.cells[id].content,
                                    ),
                                )
                            ) {
                                return;
                            }
                            const id = genId();
                            setState(
                                modActiveWorkspace((workspace) => ({
                                    ...workspace,
                                    cells: {
                                        ...workspace.cells,
                                        [id]: { ...blankCell, id, content },
                                    },
                                })),
                            );
                        }}
                        onChange={(env, cell) => {
                            console.log('Change', cell);
                            setState((state) => {
                                const w =
                                    state.workspaces[state.activeWorkspace];
                                if (cell.content === w.cells[cell.id].content) {
                                    return modActiveWorkspace((workspace) => ({
                                        ...workspace,
                                        cells: {
                                            ...workspace.cells,
                                            [cell.id]: cell,
                                        },
                                    }))({ ...state, env });
                                }
                                if (
                                    cell.content.type === 'expr' ||
                                    cell.content.type === 'term'
                                ) {
                                    const id = cell.content.id;
                                    let results: any;
                                    try {
                                        const term =
                                            env.global.terms[idName(id)];
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
                                    return modActiveWorkspace((workspace) => ({
                                        ...workspace,
                                        cells: {
                                            ...workspace.cells,
                                            [cell.id]: cell,
                                        },
                                    }))({
                                        ...state,
                                        env,
                                        evalEnv: {
                                            ...state.evalEnv,
                                            terms: {
                                                ...state.evalEnv.terms,
                                                ...results,
                                            },
                                        },
                                    });
                                }
                                return modActiveWorkspace((workspace) => ({
                                    ...workspace,
                                    cells: {
                                        ...workspace.cells,
                                        [cell.id]: cell,
                                    },
                                }))({ ...state, env });
                            });
                        }}
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
                                    [id]: { ...blankCell, id },
                                },
                            })),
                        );
                    }}
                >
                    New Cell
                </button>
            </div>
        </div>
    );
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
