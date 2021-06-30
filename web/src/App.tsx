/** @jsx jsx */
import { jsx } from '@emotion/react';
import { printToString } from '@jerd/language/src/printing/printer';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { idName } from '@jerd/language/src/typing/env';
import { Env, Id } from '@jerd/language/src/typing/types';
// The app
import * as React from 'react';
import Cells, {
    activeWorkspace,
    blankCell,
    contentMatches,
    genId,
    modActiveWorkspace,
} from './Cells';
import DrawablePlugins from './display/Drawable';
import OpenGLPlugins from './display/OpenGL';
import StdioPlugins from './display/Stdio';
import { runTerm } from './eval';
import Library from './Library';
import { saveState, stateToString } from './persistence';
import { Pin } from './Pin';
import { QuickMenu } from './QuickMenu';
import { Cell, Content, Display, EvalEnv, RenderPlugins } from './State';
import { getToplevel } from './toplevels';

const defaultPlugins: RenderPlugins = {
    ...DrawablePlugins,
    ...StdioPlugins,
    ...OpenGLPlugins,
};

// Yea

export type HistoryItem =
    | {
          type: 'update';
          cellId: string;
          fromHash: string;
          toHash: string;
      }
    | {
          type: 'pin';
          cellId: string;
          id: string;
      }; // etc. TODO fill in if I have ideas

export type Workspace = {
    name: string;
    cells: { [key: string]: Cell };
    // TODO: add a history to each pin
    pins: Array<{ display: Display; id: Id }>;
    archivedPins: Array<{ display: Display; id: Id }>;
    currentPin: number;
    order: number;
    history: Array<HistoryItem>;
};

// TODO: This should just be taken care of by indexeddb
export type Index = {
    // Things that the key references
    from: { [key: string]: Array<Id> };
    // Things that reference the key
    to: { [key: string]: Array<Id> };
};
export type Indices = {
    termsToTerms: Index;
    termsToTypes: Index;
    typesToTypes: Index;
};

export type State = {
    env: Env;
    // terms to terms
    // terms to types and types to types
    // [srcId, srcKind term/type, destId, destKind term/type]
    index: Indices;
    activeWorkspace: string;
    workspaces: { [key: string]: Workspace };
    evalEnv: EvalEnv;
};

export default ({ initial }: { initial: State }) => {
    const [state, setState] = React.useState(() => initial);
    const [showMenu, setShowMenu] = React.useState(false);
    const [showFrozen, setShowFrozen] = React.useState(false);
    React.useEffect(() => {
        saveState(state);
    }, [state]);
    // @ts-ignore
    window.evalEnv = state.evalEnv;
    // @ts-ignore
    window.state = state;
    // @ts-ignore
    window.renderFile = () => {
        return Object.keys(state.workspaces[state.activeWorkspace].cells)
            .map((k) => {
                const c =
                    state.workspaces[state.activeWorkspace].cells[k].content;
                if (c.type !== 'raw' && c.type !== 'expr') {
                    const top = getToplevel(state.env, c);
                    return printToString(
                        toplevelToPretty(state.env, top),
                        100,
                        { hideIds: true },
                    );
                }
                return null;
            })
            .filter(Boolean)
            .join('\n\n');
    };

    React.useEffect(() => {
        const fn = (evt: KeyboardEvent) => {
            if (evt.key === 'p' && (evt.metaKey || evt.ctrlKey)) {
                evt.preventDefault();
                setShowMenu(true);
                return;
            }
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, []);

    const workspace = activeWorkspace(state);

    const [focus, setFocus] = React.useState(
        null as null | { id: string; tick: number },
    );

    const onOpen = (content: Content) => {
        if (
            Object.keys(
                state.workspaces[state.activeWorkspace].cells,
            ).some((id) =>
                contentMatches(
                    content,
                    state.workspaces[state.activeWorkspace].cells[id].content,
                ),
            )
        ) {
            return;
        }
        const id = genId();
        setFocus({ id, tick: 0 });
        setState((state) => {
            const w = state.workspaces[state.activeWorkspace];
            return {
                ...state,
                workspaces: {
                    ...state.workspaces,
                    [state.activeWorkspace]: {
                        ...w,
                        cells: {
                            [id]: { ...blankCell, id, content },
                            ...w.cells,
                        },
                    },
                },
            };
        });
    };

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
            {/* <div
                style={{
                    // position: 'absolute',
                    // top: 0,
                    // left: 0,
                    // bottom: 0,
                    // overflow: 'auto',
                    maxWidth: 200,
                }}
            > */}
            <Library env={state.env} onOpen={onOpen} />
            {/* </div> */}
            <Cells
                state={state}
                focus={focus}
                setFocus={setFocus}
                plugins={defaultPlugins}
                setState={setState}
            />
            <div
                style={{
                    // position: 'absolute',
                    // width: 200,
                    // top: 0,
                    // right: 0,
                    // bottom: 0,
                    overflow: 'auto',
                    // color: 'white',
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
                        key={i}
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
                            onArchive={() =>
                                setState(
                                    modActiveWorkspace((workspace) => {
                                        const isFrozen = workspace.archivedPins.includes(
                                            pin,
                                        );
                                        if (isFrozen) {
                                            return {
                                                ...workspace,
                                                archivedPins: workspace.archivedPins.filter(
                                                    (p) => p !== pin,
                                                ),
                                                pins: workspace.pins.concat([
                                                    pin,
                                                ]),
                                            };
                                        }
                                        return {
                                            ...workspace,
                                            pins: workspace.pins.filter(
                                                (p) => p !== pin,
                                            ),
                                            archivedPins: workspace.archivedPins.concat(
                                                [pin],
                                            ),
                                        };
                                    }),
                                )
                            }
                            onRemove={() =>
                                setState(
                                    modActiveWorkspace((workspace) => ({
                                        ...workspace,
                                        archivedPins: workspace.archivedPins.filter(
                                            (p) => p !== pin,
                                        ),
                                        pins: workspace.pins.filter(
                                            (p) => p !== pin,
                                        ),
                                    })),
                                )
                            }
                            onRun={(id: Id) => {
                                let results: { [key: string]: any };
                                try {
                                    const term =
                                        state.env.global.terms[idName(id)];
                                    if (!term) {
                                        throw new Error(
                                            `No term ${idName(id)}`,
                                        );
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
                        />
                    </div>
                ))}
            </div>
            {/* <ImportExport state={state} setState={setState} /> */}
            <ImportExport state={state} setState={setState} />
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
