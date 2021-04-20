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
import { resolveEffect, symPrefix } from './env';
import { LocatedError, MismatchedTypeVbl } from './errors';

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
        case 'TypeRef': {
            const typeVbls = type.typeVbls
                ? type.typeVbls.map((t) => typeType(env, t))
                : [];
            const effectVbls = type.effectVbls
                ? type.effectVbls.map((e) => resolveEffect(env, e))
                : [];
            if (type.id.hash && type.id.hash.startsWith(symPrefix)) {
                const unique = +type.id.hash.slice(symPrefix.length);
                return {
                    type: 'var',
                    sym: { unique, name: type.id.text },
                    location: type.location,
                    // STOPSHIP: typeVbls and effectVbls for vars
                };
            }
            if (env.local.typeVblNames[type.id.text] != null) {
                return {
                    type: 'var',
                    sym: env.local.typeVblNames[type.id.text],
                    location: type.location,
                    // STOPSHIP: typeVbls and effectVbls for vars
                };
            }
            if (
                env.local.self &&
                env.local.self.type === 'Type' &&
                (env.local.self.name === type.id.text ||
                    (type.id.hash && type.id.hash === '#self'))
            ) {
                // TODO: include the kind restrictions
                if (env.local.self.vbls.length !== typeVbls.length) {
                    throw new LocatedError(
                        type.location,
                        `Wrong number of type variables.`,
                    );
                }
                return {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id: {
                            hash: '<self>',
                            pos: 0,
                            size: 1,
                        },
                    },
                    typeVbls,
                    effectVbls,
                    location: type.location,
                };
            }
            if (env.global.typeNames[type.id.text] != null) {
                return {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id: env.global.typeNames[type.id.text],
                    },
                    typeVbls,
                    effectVbls,
                    location: type.location,
                };
            }
            if (env.global.builtinTypes[type.id.text] != null) {
                return {
                    type: 'ref',
                    ref: { type: 'builtin', name: type.id.text },
                    location: type.location,
                    typeVbls,
                    effectVbls,
                };
            }
            throw new Error(`Unknown type "${type.id.text}"`);
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

const parseUnique = (hash: string | null, backup: number) =>
    hash && hash.startsWith(symPrefix) ? +hash.slice(symPrefix.length) : backup;

export const newEnvWithTypeAndEffectVbls = (
    env: Env,
    typevbls: Array<TypeVbl>,
    effvbls: Array<Identifier>,
) => {
    if (typevbls.length === 0 && effvbls.length === 0) {
        return { typeInner: env, typeVbls: [], effectVbls: [] };
    }

    // // TODO: how do I do multiple effect vbls, with explicit calling?
    // // b/c, for the general "e", it can take in any extra things that
    // // aren't specified. But if there are two variables (e and f, for example),
    // // how would you indicate which are allocated to which?
    // // maybe {Aewsome, {Sauce, Ome}}? like I guess
    // const effectVbls: Array<number> = [];
    // expr.effvbls.forEach((id) => {
    //     const unique = Object.keys(typeInner.local.effectVbls).length;
    //     const sym: Symbol = { name: id.text, unique };
    //     typeInner.local.effectVbls[id.text] = sym;
    //     effectVbls.push(sym.unique);
    //     // console.log('VBL', sym);
    // });

    const typeInner = subEnv(env);
    const typeVbls: Array<{ unique: number; subTypes: Array<Id> }> = [];
    typevbls.forEach(({ id, subTypes }) => {
        const unique = parseUnique(
            id.hash,
            Object.keys(typeInner.local.typeVbls).length,
        );
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
        const unique = parseUnique(
            id.hash,
            Object.keys(typeInner.local.effectVbls).length,
        );
        const sym: Symbol = { name: id.text, unique };
        typeInner.local.effectVbls[id.text] = sym;
        effectVbls.push(sym.unique);
    });
    return { typeInner, typeVbls, effectVbls };
};

export default typeType;
