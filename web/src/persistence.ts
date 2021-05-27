import { State } from './App';

import { allLiteral } from '@jerd/language/src/typing/analyze';
import { loadBuiltins } from '@jerd/language/src/printing/loadBuiltins';
import { loadPrelude } from '@jerd/language/src/printing/loadPrelude';
import * as builtins from '@jerd/language/src/printing/builtins';
import {
    GlobalEnv,
    newLocal,
    newWithGlobal,
    Type,
} from '@jerd/language/src/typing/types';

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

// @ts-ignore
window.stateToString = stateToString;

export const saveState = (state: State) => {
    window.localStorage.setItem(saveKey, stateToString(state));
};

// @ts-ignore
window.importState = saveState;

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
    console.log('initial env', env);
    if (saved) {
        try {
            const data: State = JSON.parse(saved);
            const glob: GlobalEnv = data.env.global;
            if (!data.workspaces) {
                data.workspaces = {
                    default: {
                        name: 'Default',
                        // @ts-ignore
                        pins: data.pins,
                        // @ts-ignore
                        cells: data.cells,
                        order: 0,
                    },
                };
                data.activeWorkspace = 'default';
                // @ts-ignore
                delete data.cells;
            }
            // @ts-ignore
            if (data.pins) {
                Object.keys(data.workspaces).forEach((k) => {
                    data.workspaces[k].pins = [];
                });
                // @ts-ignore
                data.workspaces.default.pins = data.pins;
                // @ts-ignore
                delete data.pins;
            }
            // Fix env format change
            Object.keys(glob.typeNames).forEach((name) => {
                if (!Array.isArray(glob.typeNames[name])) {
                    // @ts-ignore
                    glob.typeNames[name] = [glob.typeNames[name]];
                }
            });
            Object.keys(glob.names).forEach((name) => {
                if (!Array.isArray(glob.names[name])) {
                    // @ts-ignore
                    glob.names[name] = [glob.names[name]];
                }
            });
            Object.keys(glob.attributeNames).forEach((name) => {
                if (!Array.isArray(glob.attributeNames[name])) {
                    // @ts-ignore
                    glob.attributeNames[name] = [glob.attributeNames[name]];
                }
            });
            Object.keys(glob.effectNames).forEach((name) => {
                if (!Array.isArray(glob.effectNames[name])) {
                    // @ts-ignore
                    glob.effectNames[name] = [glob.effectNames[name]];
                }
            });
            const metaData = { ...data.env.global.metaData, ...env.metaData };
            Object.keys(glob.terms).forEach((id) => {
                if (!metaData[id]) {
                    metaData[id] = {
                        tags: [],
                        createdMs: Date.now(),
                    };
                }
            });
            return {
                ...data,
                env: {
                    ...data.env,
                    global: {
                        ...data.env.global,
                        builtins: env.builtins,
                        builtinTypes: env.builtinTypes,
                        metaData,
                        rng: env.rng,
                        recordGroups: {
                            ...env.recordGroups,
                            ...data.env.global.recordGroups,
                        },
                        attributeNames: {
                            ...env.attributeNames,
                            ...data.env.global.attributeNames,
                        },
                        typeNames: {
                            ...env.typeNames,
                            ...data.env.global.typeNames,
                        },
                        idNames: {
                            ...env.idNames,
                            ...data.env.global.idNames,
                        },
                        types: {
                            ...env.types,
                            ...data.env.global.types,
                        },
                        names: {
                            ...env.names,
                            ...data.env.global.names,
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
        activeWorkspace: 'default',
        workspaces: {
            default: {
                name: 'Default',
                cells: {},
                pins: [],
                order: 0,
            },
        },
        evalEnv: {
            builtins,
            terms: {},
            executionLimit: { ticks: 0, maxTime: 0, enabled: false },
        },
    };
};
