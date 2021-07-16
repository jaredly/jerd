// Type definitions for state

import { Env, Id, Term, Type } from '@jerd/language/src/typing/types';
import { Traces } from './eval';

export type TopContent =
    | { type: 'term'; id: Id; name: string | null }
    | { type: 'record'; id: Id; name: string; attrs: Array<string> }
    | { type: 'enum'; id: Id; name: string }
    | { type: 'effect'; id: Id; name: string; constrNames: Array<string> };

export type Content = TopContent | { type: 'raw'; text: string };

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
