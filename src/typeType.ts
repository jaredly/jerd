import { Expression, Type as ParseType } from './parser';
import deepEqual from 'fast-deep-equal';

// TODO come up with a sourcemappy notion of "unique location in the parse tree"
// that doesn't mean keeping track of column & line.
// because we'll need it in a web ui.
import { Env, Type } from './types';

const typeType = (env: Env, type: ParseType | null): Type => {
    if (type == null) {
        const unique = Object.keys(env.local.typeVbls).length;
        env.local.typeVbls[unique] = [];
        console.log('New type just dropped', unique);
        return { type: 'var', sym: { unique, name: 'var_' + unique } };
    }
    // console.log('TYPEING TYPE', type);
    switch (type.type) {
        case 'id': {
            if (env.global.typeNames[type.text] != null) {
                return {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id: env.global.typeNames[type.text],
                    },
                };
            }
            if (env.global.builtinTypes[type.text] != null) {
                return {
                    type: 'ref',
                    ref: { type: 'builtin', name: type.text },
                };
            }
            throw new Error(`Unknown type "${type.text}"`);
        }

        case 'lambda':
            // console.log('LAM', type);
            return {
                type: 'lambda',
                args: type.args.map((a) => typeType(env, a)),
                effects: type.effects.map((id) => {
                    if (!env.global.effectNames[id.text]) {
                        throw new Error(`No effect named ${id.text}`);
                    }
                    return {
                        type: 'user',
                        id: {
                            hash: env.global.effectNames[id.text],
                            pos: 0,
                            size: 1,
                        },
                    };
                }), // TODO what um. Do all Terms need an effect?
                // like, these are the effects ... of executing this term?
                // and then a lamhda has none?
                // ok so just apply and sequence I should think, right?
                // the other ones don't?
                res: typeType(env, type.res),
                rest: null,
            };
    }
};

export default typeType;
