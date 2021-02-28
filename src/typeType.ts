import { Type as ParseType } from './parser';

// TODO come up with a sourcemappy notion of "unique location in the parse tree"
// that doesn't mean keeping track of column & line.
// because we'll need it in a web ui.
import { Env, Symbol, subEnv, Type } from './types';

export const walkType = (
    term: Type,
    handle: (term: Type) => Type | null,
): Type | null => {
    const changed = handle(term);
    if (changed) {
        // console.log(
        //     `Term: ${JSON.stringify(term)} became ${JSON.stringify(changed)}`,
        // );
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
    // console.log('TYPEING TYPE', type);
    switch (type.type) {
        case 'id': {
            if (env.local.typeVbls[type.text] != null) {
                return {
                    type: 'var',
                    sym: env.local.typeVbls[type.text],
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
            const typeVbls: Array<number> = [];
            type.typevbls.forEach((id) => {
                const unique = Object.keys(typeInner.local.typeVbls).length;
                const sym: Symbol = { name: id.text, unique };
                typeInner.local.typeVbls[id.text] = sym;
                typeVbls.push(sym.unique);
            });

            return {
                type: 'lambda',
                args: type.args.map((a) => typeType(typeInner, a)),
                typeVbls,
                effectVbls: [],
                location: type.location,
                effects: type.effects.map((id) => {
                    if (env.local.effectVbls[id.text]) {
                        return {
                            type: 'var',
                            sym: env.local.effectVbls[id.text],
                        };
                    }
                    if (!env.global.effectNames[id.text]) {
                        throw new Error(`No effect named ${id.text}`);
                    }
                    return {
                        type: 'ref',
                        ref: {
                            type: 'user',
                            id: {
                                hash: env.global.effectNames[id.text],
                                pos: 0,
                                size: 1,
                            },
                        },
                    };
                }), // TODO what um. Do all Terms need an effect?
                // like, these are the effects ... of executing this term?
                // and then a lamhda has none?
                // ok so just apply and sequence I should think, right?
                // the other ones don't?
                res: typeType(typeInner, type.res),
                rest: null,
            };
        }
    }
};

export default typeType;
