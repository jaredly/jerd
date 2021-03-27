// The app

import * as React from 'react';
import { Env } from '@jerd/language/src/typing/types';
import { Cell, EvalEnv, getToplevel, Plugins } from './Cell';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { printToString } from '@jerd/language/src/printing/printer';

import Cells from './Cells';
import DrawablePlugins from './display/Drawable';
import { initialState, saveState } from './persistence';

const defaultPlugins: Plugins = {
    ...DrawablePlugins,
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

    return <Cells state={state} plugins={defaultPlugins} setState={setState} />;
};
