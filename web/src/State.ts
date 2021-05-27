// Type definitions for state

import { Env, Id, Term, Type } from '@jerd/language/src/typing/types';

export type Content =
    | { type: 'term'; id: Id; name: string }
    | { type: 'expr'; id: Id }
    | { type: 'record'; id: Id; name: string; attrs: Array<string> }
    | { type: 'enum'; id: Id; name: string }
    | { type: 'effect'; id: Id; name: string; constrNames: Array<string> }
    | { type: 'raw'; text: string };
export type Cell = {
    id: string;
    content: Content;
    display?: Display | null;
    collapsed?: boolean;
};

export type PluginT = {
    id: string;
    name: string;
    type: Type;
    render: (value: any, evalEnv: EvalEnv, env: Env, term: Term) => JSX.Element;
};
export type Plugins = { [id: string]: PluginT };
export type Display = { type: string; opts: { [key: string]: any } };

export type EvalEnv = {
    builtins: { [key: string]: any };
    terms: { [hash: string]: any };
    executionLimit: { ticks: number; maxTime: number; enabled: boolean };
};
