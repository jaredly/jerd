import { Index, Indices, State } from './App';

import {
    allLiteral,
    getUserDependencies,
    getUserTypeDependencies,
} from '@jerd/language/src/typing/analyze';
import { loadBuiltins } from '@jerd/language/src/printing/loadBuiltins';
import { loadPrelude } from '@jerd/language/src/printing/loadPrelude';
import * as builtins from '@jerd/language/src/printing/builtins';
import {
    GlobalEnv,
    Id,
    newLocal,
    newWithGlobal,
    Type,
} from '@jerd/language/src/typing/types';
import localForage from 'localforage';
import { idFromName, idName } from '../../language/src/typing/env';

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
    localForage.setItem(saveKey, stateToString(state));
    // window.localStorage.setItem(saveKey, stateToString(state));
};

// @ts-ignore
window.importState = saveState;

const CURRENT_VERSION = 1;

export const initialState = async (): Promise<State> => {
    const oldSaved = window.localStorage.getItem(saveKey);
    let saved: string | null = '';
    if (oldSaved != null) {
        localForage.setItem(saveKey, oldSaved);
        window.localStorage.removeItem(saveKey);
        saved = oldSaved;
    } else {
        saved = await localForage.getItem(saveKey);
    }
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
                        currentPin: 0,
                        history: [],
                        archivedPins: [],
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

            // Add "order" indices and such
            Object.keys(data.workspaces).forEach((k) => {
                const work = data.workspaces[k];

                if (work.history == null) {
                    work.history = [];
                }
                if (work.currentPin == null) {
                    work.currentPin = 0;
                }

                if (work.archivedPins == null) {
                    work.archivedPins = [];
                }

                const cells = Object.keys(data.workspaces[k].cells);
                if (
                    cells.length &&
                    data.workspaces[k].cells[cells[0]].order == null
                ) {
                    cells.forEach((id, i) => {
                        data.workspaces[k].cells[id].order = i * 10;
                    });
                }

                if (data.version == null || data.version < 1) {
                    cells.forEach((id) => {
                        const cell = data.workspaces[k].cells[id];
                        if ((cell.content as any).type === 'expr') {
                            cell.content.type = 'term';
                            // @ts-ignore
                            cell.content.name = null;
                        }
                    });
                }
            });

            // STOPSHIP: Update the index when updating env 🤔 need a more structured way to do this.
            // maybe the index should be part of env? but no, I don't like that.
            // if (!data.index) {
            data.index = buildIndex(data.env.global);
            // }

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
                version: CURRENT_VERSION,
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
                        typeNames: mergeNames(
                            env.typeNames,
                            data.env.global.typeNames,
                        ),
                        idNames: {
                            ...env.idNames,
                            ...data.env.global.idNames,
                        },
                        types: {
                            ...env.types,
                            ...data.env.global.types,
                        },
                        names: mergeNames(env.names, data.env.global.names),
                        terms: {
                            // In case we added new global terms
                            ...env.terms,
                            ...data.env.global.terms,
                        },
                    },
                    // Reset the local env
                    local: newLocal(),
                    term: { nextTraceId: 0, localNames: {} },
                },
                evalEnv: {
                    builtins,
                    terms: data.evalEnv.terms,
                    executionLimit: { ticks: 0, maxTime: 0, enabled: false },
                    traceObj: { traces: null },
                },
            };
        } catch (err) {
            console.log('OH NOES', err);
            throw err;
            // window.localStorage.removeItem(saveKey);
        }
    }
    return {
        version: CURRENT_VERSION,
        env: newWithGlobal(env),
        activeWorkspace: 'default',
        index: {
            termsToTerms: { from: {}, to: {} },
            termsToTypes: { from: {}, to: {} },
            typesToTypes: { from: {}, to: {} },
        },
        workspaces: {
            default: {
                name: 'Default',
                cells: {},
                pins: [],
                archivedPins: [],
                order: 0,
                currentPin: 0,
                history: [],
            },
        },
        evalEnv: {
            builtins,
            terms: {},
            executionLimit: { ticks: 0, maxTime: 0, enabled: false },
            traceObj: { traces: null },
        },
    };
};

export const mergeNames = (
    a: { [key: string]: Array<Id> },
    b: { [key: string]: Array<Id> },
) => {
    const names = { ...a };
    Object.keys(b).forEach((name) => {
        if (!names[name]) {
            names[name] = b[name];
            return;
        }
        const got: { [key: string]: true } = {};
        names[name].forEach((k) => (got[idName(k)] = true));
        names[name] = names[name].concat(
            b[name].filter((n) => !got[idName(n)]),
        );
    });
    return names;
};

export const buildIndex = (env: GlobalEnv): Indices => {
    const termsToTerms: Index = { from: {}, to: {} };

    Object.keys(env.terms).forEach((idRaw, i) => {
        const id = idFromName(idRaw);
        const term = env.terms[idRaw];

        termsToTerms.from[idRaw] = getUserDependencies(term);
        termsToTerms.to[idRaw] = [];
    });

    Object.keys(env.terms).forEach((idRaw) => {
        const sid = idFromName(idRaw);
        termsToTerms.from[idRaw].forEach((id) => {
            termsToTerms.to[idName(id)].push(sid);
        });
    });

    const termsToTypes: Index = { from: {}, to: {} };

    Object.keys(env.terms).forEach((idRaw, i) => {
        const id = idFromName(idRaw);
        const term = env.terms[idRaw];
        const types = getUserTypeDependencies(term);

        termsToTypes.from[idRaw] = types;
        types.forEach((t) => {
            const ti = idName(t);
            if (!termsToTypes.to[ti]) {
                termsToTypes.to[ti] = [];
            }
            termsToTypes.to[ti].push(id);
        });
    });

    const typesToTypes: Index = { from: {}, to: {} };

    // try {
    //     console.log(types);
    //     // index.from[idRaw] = index.from[idRaw].concat(i);
    // } catch (err) {
    //     console.log(err);
    // }
    // // .concat(
    // //     getUserTypeDependencies(term),
    // // );

    return {
        termsToTerms,
        termsToTypes,
        typesToTypes,
    };
};
