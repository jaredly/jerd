// Type definitions for state

import {
    Env,
    Id,
    Term,
    Type,
    ToplevelDefine,
    ToplevelEffect,
    ToplevelEnum,
    ToplevelExpression,
    ToplevelRecord,
} from '@jerd/language/src/typing/types';
import { Traces } from './eval';

// hmm so I want
// - hide
// - show
// - show a couple

export type TopContent =
    | {
          type: 'term';
          id: Id;
          proposed?: null | ToplevelDefine | ToplevelExpression;
          tests?: true | Array<Id>;
      }
    | { type: 'record'; id: Id; proposed?: null | ToplevelRecord }
    | { type: 'enum'; id: Id; proposed?: null | ToplevelEnum }
    | { type: 'effect'; id: Id; proposed?: null | ToplevelEffect };

export type Content = TopContent | RawContent;
export type RawContent = { type: 'raw'; text: string };
// | { type: 'markdown'; text: string };

export const getTopContent = (content: Content): null | TopContent =>
    content.type === 'raw' ? null : content;
// || content.type === 'markdown'

export type Cell = {
    id: string;
    order: number;
    content: Content;
    display?: Display | null;
    collapsed?: boolean;
};

// Ok so I think in future, there will be configuration that you set up
// in-editor, where you can say "I want this editor plugin to apply to"
// this function call or something".
// And I guess you can author editor plugins via the language itself...
export type Filter = {
    type: 'nodeType';
    termType: string;
};

export type EditPluginT = {
    id: string;
    filter: Filter;
};

export type RenderPluginT = {
    id: string;
    name: string;
    type: Type;
    render: (
        value: any,
        evalEnv: EvalEnv,
        env: Env,
        term: Term,
        startPaused: boolean,
    ) => JSX.Element;
};
export type RenderPlugins = { [id: string]: RenderPluginT };
export type Display = { type: string; opts: { [key: string]: any } };

export type EvalEnv = {
    builtins: { [key: string]: any };
    terms: { [hash: string]: any };
    executionLimit: { ticks: number; maxTime: number; enabled: boolean };
    traceObj: Traces;
};

// import { Env, Id } from '@jerd/language/src/typing/types';
// import { Cell, Display, EvalEnv } from './State';

// Yea

export type HistoryUpdate = {
    type: 'update';
    cellId: string;
    fromId: Id;
    toId: Id;
};
export type HistoryItem =
    | HistoryUpdate
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
    version: number;
    env: Env;
    // terms to terms
    // terms to types and types to types
    // [srcId, srcKind term/type, destId, destKind term/type]
    index: Indices;
    activeWorkspace: string;
    workspaces: { [key: string]: Workspace };
    evalEnv: EvalEnv;
};
