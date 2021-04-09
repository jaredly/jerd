import { State } from './App';

import { presetEnv } from '@jerd/language/src/typing/preset';
import { allLiteral } from '@jerd/language/src/typing/analyze';
import { loadBuiltins } from '@jerd/language/src/printing/loadBuiltins';
import * as builtins from '@jerd/language/src/printing/builtins';

const saveKey = 'jd-repl-cache';

export const stateToString = (state: State) => {
    const terms = {};
    Object.keys(state.evalEnv.terms).forEach((k) => {
        if (allLiteral(state.env, state.env.global.terms[k].is)) {
            terms[k] = state.evalEnv.terms[k];
            // } else {
            //     console.warn(`Not saving ${k}, not all literal`);
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
    const env = presetEnv(builtinsMap);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            return {
                ...data,
                env: {
                    ...data.env,
                    global: {
                        ...data.env.global,
                        builtins: env.global.builtins,
                        builtinTypes: env.global.builtinTypes,
                        rng: env.global.rng,
                        recordGroups: {
                            ...env.global.recordGroups,
                            ...data.env.global.recordGroups,
                        },
                        attributeNames: {
                            ...env.global.attributeNames,
                            ...data.env.global.attributeNames,
                        },
                        types: {
                            ...env.global.types,
                            ...data.env.global.types,
                        },
                        terms: {
                            // In case we added new global terms
                            ...env.global.terms,
                            ...data.env.global.terms,
                        },
                    },
                    // Reset the local env
                    local: env.local,
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
        env,
        cells: {},
        pins: [],
        evalEnv: {
            builtins,
            terms: {},
            executionLimit: { ticks: 0, maxTime: 0, enabled: false },
        },
    };
};
