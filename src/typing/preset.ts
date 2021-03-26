// Presets

import { newEnv, Type, TypeVblDecl } from './types';

export const builtinType = (
    name: string,
    typeVbls: Array<Type> = [],
): Type => ({
    type: 'ref',
    ref: { type: 'builtin', name },
    location: null,
    typeVbls,
    effectVbls: [],
});

export const int: Type = builtinType('int');
export const float: Type = builtinType('float');
export const string: Type = builtinType('string');
export const void_: Type = builtinType('void');
export const bool: Type = builtinType('bool');

export const binOps = ['++', '+', '>', '<', '/', '*', '==', '-'];

export const pureFunction = (
    args: Array<Type>,
    res: Type,
    typeVbls: Array<TypeVblDecl> = [],
): Type => {
    return {
        type: 'lambda',
        typeVbls,
        effectVbls: [],
        args,
        effects: [],
        rest: null,
        res,
        location: null,
    };
};

export function presetEnv() {
    const env = newEnv({
        name: 'global',
        type: {
            type: 'ref',
            ref: { type: 'builtin', name: 'never' },
            location: null,
            typeVbls: [],
            effectVbls: [],
        },
    });
    env.global.builtins['true'] = bool;
    env.global.builtins['false'] = bool;

    // Just for the eff paper
    env.global.builtins['isSquare'] = pureFunction([int], bool);
    env.global.builtins['intToString'] = pureFunction([int], string);
    env.global.builtins['intToFloat'] = pureFunction([int], float);

    const T: TypeVblDecl = { unique: 10000, subTypes: [] };
    const T0: Type = {
        type: 'var',
        sym: { unique: 10000, name: 'T' },
        location: null,
    };
    env.global.builtins['++'] = pureFunction([string, string], string);
    env.global.builtins['>'] = pureFunction([T0, T0], bool, [T]);
    env.global.builtins['<'] = pureFunction([T0, T0], bool, [T]);
    env.global.builtins['=='] = pureFunction([T0, T0], bool, [T]);
    env.global.builtins['+'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['-'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['/'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['*'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['^'] = pureFunction([T0, T0], T0, [T]);

    env.global.builtins['max'] = pureFunction([float, float], float);
    env.global.builtins['min'] = pureFunction([float, float], float);
    env.global.builtins['sqrt'] = pureFunction([float], float);
    env.global.builtins['ln'] = pureFunction([float], float);
    env.global.builtins['sin'] = pureFunction([float], float);
    env.global.builtins['cos'] = pureFunction([float], float);
    env.global.builtins['tan'] = pureFunction([float], float);
    env.global.builtins['asin'] = pureFunction([float], float);
    env.global.builtins['acos'] = pureFunction([float], float);
    env.global.builtins['atan'] = pureFunction([float], float);
    env.global.builtins['atan2'] = pureFunction([float, float], float);
    env.global.builtins['PI'] = float;
    env.global.builtins['TAU'] = float;

    env.global.builtins['log'] = pureFunction([string], void_);
    // const concat = <T>(one: Array<T>, two: Array<T>) => Array<T>
    const array = builtinType('Array', [T0]);
    env.global.builtins['concat'] = pureFunction([array, array], array, [T]);
    env.global.builtinTypes['unit'] = 0;
    env.global.builtinTypes['void'] = 0;
    env.global.builtinTypes['int'] = 0;
    env.global.builtinTypes['float'] = 0;
    env.global.builtinTypes['bool'] = 0;
    env.global.builtinTypes['string'] = 0;
    env.global.builtinTypes['Array'] = 1;

    env.global.typeNames['Some'] = { hash: 'Some', pos: 0, size: 1 };
    env.global.idNames['Some'] = 'Some';
    env.global.typeNames['None'] = { hash: 'None', pos: 0, size: 1 };
    env.global.idNames['None'] = 'None';
    env.global.types['None'] = {
        unique: 1,
        type: 'Record',
        typeVbls: [],
        effectVbls: [],
        extends: [],
        items: [],
        location: null,
        ffi: null,
    };
    env.global.types['Some'] = {
        unique: 0,
        type: 'Record',
        typeVbls: [T],
        effectVbls: [],
        extends: [],
        items: [T0],
        location: null,
        ffi: null,
    };
    env.global.recordGroups['Some'] = ['contents'];
    env.global.attributeNames['contents'] = {
        idx: 0,
        id: { hash: 'Some', pos: 0, size: 1 },
    };
    // and then no recordGroups

    return env;
}
