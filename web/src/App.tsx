// The app

import * as React from 'react';
import { Env } from '@jerd/language/src/typing/types';
import { Cell, EvalEnv, getToplevel, Plugins } from './Cell';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { printToString } from '@jerd/language/src/printing/printer';

import Cells, { contentMatches, genId, blankCell } from './Cells';
import DrawablePlugins from './display/Drawable';
import StdioPlugins from './display/Stdio';
import { initialState, saveState } from './persistence';
import Library from './Library';

const defaultPlugins: Plugins = {
    ...DrawablePlugins,
    ...StdioPlugins,
};

// Yea

export type State = {
    env: Env;
    cells: { [key: string]: Cell };
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
        return Object.keys(state.cells)
            .map((k) => {
                const c = state.cells[k].content;
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
                            Object.keys(state.cells).some((id) =>
                                contentMatches(
                                    content,
                                    state.cells[id].content,
                                ),
                            )
                        ) {
                            return;
                        }
                        const id = genId();
                        setState((state) => ({
                            ...state,
                            cells: {
                                [id]: { ...blankCell, id, content },
                                ...state.cells,
                            },
                        }));
                    }}
                />
            </div>
            <Cells state={state} plugins={defaultPlugins} setState={setState} />
        </div>
    );
};
