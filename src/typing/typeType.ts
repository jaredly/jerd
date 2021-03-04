import { Type as ParseType } from '../parsing/parser';

// TODO come up with a sourcemappy notion of "unique location in the parse tree"
// that doesn't mean keeping track of column & line.
// because we'll need it in a web ui.
import { Env, Symbol, subEnv, Type, Id } from './types';
import { resolveEffect, showLocation } from './typeExpr';

export const walkType = (
    term: Type,
    handle: (term: Type) => Type | null,
): Type | null => {
    const changed = handle(term);
    if (changed) {
        return changed;
    }
    if (term.type === 'lambda') {
        const newArgs = term.args.slice();
        let changed = false;
        term.args.forEach((arg, i) => {
            const neww = walkType(arg, handle);
            if (neww != null) {
                changed = true;
                newArgs[i] = neww;
            }
        });
        const newres = walkType(term.res, handle);
        if (newres != null) {
            changed = true;
        }
        if (changed) {
            return {
                type: 'lambda',
                typeVbls: term.typeVbls.slice(),
                effectVbls: term.effectVbls.slice(),
                location: term.location,
                args: newArgs,
                effects: term.effects, // STOPSHIP bring them in
                res: newres || term.res,
                rest: null, // STOPSHIP handle rest
            };
        }
    }
    return null;
};

export const newTypeVbl = (env: Env): Type => {
    const unique = Object.keys(env.local.tmpTypeVbls).length;
    env.local.tmpTypeVbls[unique] = [];
    return {
        type: 'var',
        sym: { unique, name: 'var_' + unique },
        location: null,
        subTypes: [],
    };
};

const typeType = (env: Env, type: ParseType | null): Type => {
    if (type == null) {
        return newTypeVbl(env);
    }
    switch (type.type) {
        case 'id': {
            if (env.local.typeVbls[type.text] != null) {
                return {
                    type: 'var',
                    sym: env.local.typeVbls[type.text].sym,
                    subTypes: env.local.typeVbls[type.text].subTypes,
                    location: type.location,
                };
            }
            if (env.global.typeNames[type.text] != null) {
                return {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id: env.global.typeNames[type.text],
                    },
                    location: type.location,
                };
            }
            if (env.global.builtinTypes[type.text] != null) {
                return {
                    type: 'ref',
                    ref: { type: 'builtin', name: type.text },
                    location: type.location,
                };
            }
            throw new Error(`Unknown type "${type.text}"`);
        }

        case 'lambda': {
            const typeInner = subEnv(env);
            const typeVbls: Array<{ unique: number; subTypes: Array<Id> }> = [];
            type.typevbls.forEach(({ id, subTypes }) => {
                const unique = Object.keys(typeInner.local.typeVbls).length;
                const sym: Symbol = { name: id.text, unique };
                const st = subTypes.map((id) => {
                    const t = env.global.typeNames[id.text];
                    if (!t) {
                        throw new Error(
                            `Unknown subtype ${id.text} at ${showLocation(
                                id.location,
                            )}`,
                        );
                    }
                    return t;
                });
                typeInner.local.typeVbls[id.text] = { sym, subTypes: st };
                typeVbls.push({ unique: sym.unique, subTypes: st });
            });
            const effectVbls: Array<number> = [];
            type.effvbls.forEach((id) => {
                const unique = Object.keys(typeInner.local.effectVbls).length;
                const sym: Symbol = { name: id.text, unique };
                typeInner.local.effectVbls[id.text] = sym;
                effectVbls.push(sym.unique);
            });

            return {
                type: 'lambda',
                args: type.args.map((a) => typeType(typeInner, a)),
                typeVbls,
                effectVbls,
                location: type.location,
                effects: type.effects.map((id) => resolveEffect(typeInner, id)),
                res: typeType(typeInner, type.res),
                rest: null,
            };
        }
    }
};

export default typeType;
