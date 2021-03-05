import {
    Identifier,
    LambdaType,
    Type as ParseType,
    TypeVbl,
} from '../parsing/parser';

// TODO come up with a sourcemappy notion of "unique location in the parse tree"
// that doesn't mean keeping track of column & line.
// because we'll need it in a web ui.
import { Env, Symbol, subEnv, Type, Id } from './types';
import { showLocation } from './typeExpr';
import { resolveEffect } from './env';

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
    };
};

const typeType = (env: Env, type: ParseType | null): Type => {
    if (type == null) {
        return newTypeVbl(env);
    }
    switch (type.type) {
        case 'id': {
            if (env.local.typeVblNames[type.text] != null) {
                return {
                    type: 'var',
                    sym: env.local.typeVblNames[type.text],
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
            const {
                typeInner,
                typeVbls,
                effectVbls,
            } = newEnvWithTypeAndEffectVbls(env, type.typevbls, type.effvbls);

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

export const newEnvWithTypeAndEffectVbls = (
    env: Env,
    typevbls: Array<TypeVbl>,
    effvbls: Array<Identifier>,
) => {
    if (typevbls.length === 0 && effvbls.length === 0) {
        return { typeInner: env, typeVbls: [], effectVbls: [] };
    }
    const typeInner = subEnv(env);
    const typeVbls: Array<{ unique: number; subTypes: Array<Id> }> = [];
    typevbls.forEach(({ id, subTypes }) => {
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
        typeInner.local.typeVbls[sym.unique] = { subTypes: st };
        typeInner.local.typeVblNames[id.text] = sym;
        typeVbls.push({ unique: sym.unique, subTypes: st });
    });
    const effectVbls: Array<number> = [];
    effvbls.forEach((id) => {
        const unique = Object.keys(typeInner.local.effectVbls).length;
        const sym: Symbol = { name: id.text, unique };
        typeInner.local.effectVbls[id.text] = sym;
        effectVbls.push(sym.unique);
    });
    return { typeInner, typeVbls, effectVbls };
};

export default typeType;
