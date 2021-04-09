import { State } from './App';

import { allLiteral } from '@jerd/language/src/typing/analyze';
import { loadBuiltins } from '@jerd/language/src/printing/loadBuiltins';
import { loadPrelude } from '@jerd/language/src/printing/loadPrelude';
import * as builtins from '@jerd/language/src/printing/builtins';
import { newLocal, newWithGlobal, Type } from '@jerd/language/src/typing/types';

const saveKey = 'jd-repl-cache';

export const stateToString = (state: State) => {
    const terms: { [key: string]: any } = {};
    Object.keys(state.evalEnv.terms).forEach((k) => {
        if (allLiteral(state.env, state.env.global.terms[k].is)) {
            terms[k] = state.evalEnv.terms[k];
        }
    });
    return JSON.stringify({ ...state, evalEnv: { ...state.evalEnv, terms } });
};

export const saveState = (state: State) => {
    window.localStorage.setItem(saveKey, stateToString(state));
};

export const initialState = (): State => {
    const saved = window.localStorage.getItem(saveKey);
    const builtinsMap = loadBuiltins();
    const typedBuiltins: { [key: string]: Type } = {};
    Object.keys(builtinsMap).forEach((b) => {
        const v = builtinsMap[b];
        if (v != null) {
            typedBuiltins[b] = v;
        }
    });
    const env = loadPrelude(typedBuiltins);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            return {
                ...data,
                env: {
                    ...data.env,
                    global: {
                        ...data.env.global,
                        builtins: env.builtins,
                        builtinTypes: env.builtinTypes,
                        rng: env.rng,
                        recordGroups: {
                            ...env.recordGroups,
                            ...data.env.global.recordGroups,
                        },
                        attributeNames: {
                            ...env.attributeNames,
                            ...data.env.global.attributeNames,
                        },
                        types: {
                            ...env.types,
                            ...data.env.global.types,
                        },
                        terms: {
                            // In case we added new global terms
                            ...env.terms,
                            ...data.env.global.terms,
                        },
                    },
                    // Reset the local env
                    local: newLocal(),
                },
                pins: data.pins || [],
                evalEnv: {
                    builtins,
                    terms: data.evalEnv.terms,
                    executionLimit: { ticks: 0, maxTime: 0, enabled: false },
                },
            };
        } catch (err) {
            window.localStorage.removeItem(saveKey);
        }
    }
    return {
        env: newWithGlobal(env),
        cells: {},
        pins: [],
        evalEnv: {
            builtins,
            terms: {},
            executionLimit: { ticks: 0, maxTime: 0, enabled: false },
        },
    };
};
