// Presets

import { newEnv, Type } from './types';

const builtinType = (name: string): Type => ({
    type: 'ref',
    ref: { type: 'builtin', name },
    location: null,
});

export const int: Type = builtinType('int');
export const string: Type = builtinType('string');
export const void_: Type = builtinType('void');
export const bool: Type = builtinType('bool');

export const binOps = ['++', '+', '>', '<', '/', '*', '==', '-'];

const pureFunction = (args: Array<Type>, res: Type): Type => {
    return {
        type: 'lambda',
        typeVbls: [],
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
        },
    });
    env.global.builtins['true'] = bool;
    env.global.builtins['false'] = bool;

    // Just for the eff paper
    env.global.builtins['isSquare'] = pureFunction([int], bool);
    env.global.builtins['intToString'] = pureFunction([int], string);

    env.global.builtins['++'] = pureFunction([string, string], string);
    env.global.builtins['>'] = pureFunction([int, int], bool);
    env.global.builtins['<'] = pureFunction([int, int], bool);
    env.global.builtins['=='] = {
        type: 'lambda',
        typeVbls: [10000],
        effectVbls: [],
        args: [
            { type: 'var', sym: { unique: 10000, name: 'T' }, location: null },
            { type: 'var', sym: { unique: 10000, name: 'T' }, location: null },
        ],
        effects: [],
        rest: null,
        res: bool,
        location: null,
    };
    env.global.builtins['+'] = pureFunction([int, int], int);
    env.global.builtins['-'] = pureFunction([int, int], int);
    env.global.builtins['/'] = pureFunction([int, int], int);
    env.global.builtins['*'] = pureFunction([int, int], int);
    env.global.builtins['log'] = pureFunction([string], void_);
    env.global.builtinTypes['unit'] = 0;
    env.global.builtinTypes['void'] = 0;
    env.global.builtinTypes['int'] = 0;
    env.global.builtinTypes['bool'] = 0;
    env.global.builtinTypes['string'] = 0;

    return env;
}
