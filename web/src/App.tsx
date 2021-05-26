/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app

import * as React from 'react';
import { Env, Id } from '@jerd/language/src/typing/types';
import { getToplevel } from './Cell';
import { Cell, Display, EvalEnv, Plugins, PluginT } from './State';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { printToString } from '@jerd/language/src/printing/printer';

import Cells, { contentMatches, genId, blankCell } from './Cells';
import DrawablePlugins from './display/Drawable';
import StdioPlugins from './display/Stdio';
import { initialState, saveState } from './persistence';
import Library from './Library';
import { idName } from '@jerd/language/src/typing/env';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import { runTerm } from './eval';
import { nullLocation } from '@jerd/language/src/parsing/parser';

const defaultPlugins: Plugins = {
    ...DrawablePlugins,
    ...StdioPlugins,
};

// Yea

export type Workspace = {
    name: string;
    cells: { [key: string]: Cell };
    order: number;
};

export type State = {
    env: Env;
    activeWorkspace: string;
    workspaces: { [key: string]: Workspace };
    pins: Array<{ display: Display; id: Id }>;
    evalEnv: EvalEnv;
};

export default () => {
    const [state, setState] = React.useState(() => initialState());
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

    return (
        <div>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    overflow: 'auto',
                }}
            >
                <Library
                    env={state.env}
                    onOpen={(content) => {
                        if (
                            Object.keys(
                                state.workspaces[state.activeWorkspace].cells,
                            ).some((id) =>
                                contentMatches(
                                    content,
                                    state.workspaces[state.activeWorkspace]
                                        .cells[id].content,
                                ),
                            )
                        ) {
                            return;
                        }
                        const id = genId();
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
                    }}
                />
            </div>
            <Cells state={state} plugins={defaultPlugins} setState={setState} />
            <div
                style={{
                    position: 'absolute',
                    width: 200,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'auto',
                    color: 'white',
                }}
            >
                Pins
                {state.pins.map((pin, i) => (
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
                        <button
                            css={{
                                cursor: 'pointer',
                                fontSize: '50%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'inherit',
                                padding: 0,
                                marginLeft: 8,
                            }}
                            onClick={() =>
                                setState((state) => ({
                                    ...state,
                                    pins: state.pins.filter((p) => p !== pin),
                                }))
                            }
                        >
                            ╳
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Pin = ({
    pin,
    env,
    evalEnv,
    plugins,
    onRun,
}: {
    pin: { id: Id; display: Display };
    env: Env;
    evalEnv: EvalEnv;
    plugins: Plugins;
    onRun: (id: Id) => void;
}) => {
    if (!evalEnv.terms[idName(pin.id)]) {
        return (
            <div>
                Not eval {idName(pin.id)}
                <button onClick={() => onRun(pin.id)}>Run</button>
            </div>
        );
    }
    const t = env.global.terms[idName(pin.id)];
    const plugin: PluginT = plugins[pin.display.type];
    const err = getTypeError(env, t.is, plugin.type, nullLocation);
    if (err == null) {
        return plugin.render(evalEnv.terms[idName(pin.id)], evalEnv);
    }
    return <div>Error folks</div>;
};
