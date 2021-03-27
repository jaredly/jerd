import { State } from './App';

import { presetEnv } from '@jerd/language/src/typing/preset';
import { allLiteral } from '@jerd/language/src/typing/analyze';
import * as builtins from '@jerd/language/src/printing/prelude';

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
    const env = presetEnv();
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
                    },
                    // Reset the local env
                    local: env.local,
                },
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
        evalEnv: {
            builtins,
            terms: {},
            executionLimit: { ticks: 0, maxTime: 0, enabled: false },
        },
    };
};
