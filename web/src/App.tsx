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
import { saveState, stateToString } from './persistence';
import { Cell, Content, Display, EvalEnv, RenderPlugins } from './State';
import { getToplevel } from './toplevels';
import { Workspace } from './Workspace';

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

    return <Workspace state={state} setState={setState} />;
};
