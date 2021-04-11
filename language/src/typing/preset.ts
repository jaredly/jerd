// Presets

import { LambdaType, newEnv, Type, TypeVblDecl } from './types';

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

export const binOps = [
    '++',
    '+',
    '>',
    '<',
    '/',
    '*',
    '==',
    '-',
    '^',
    '>=',
    '<=',
    '&&',
    '||',
];

export const pureFunction = (
    args: Array<Type>,
    res: Type,
    typeVbls: Array<TypeVblDecl> = [],
): LambdaType => {
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

// This seems like it would work, right?
`
type ToStr<T> = {
    str: T => string
}
type ToFloat<T> = {float: T => float}

const IntToStr: ToStr<int> = ToStr<int>{str: intToString}
const FloatToStr: ToStr<float> = ToStr<float>{str: floatToString}
const IntToFloat: ToFloat<int> = ToFloat<int>{float: intToFloat}

:str(x) (inferred to be IntToStr.str(x))
:float(n) (inferred to be IntToFloat.float(n))

or .str(x)? and .float(x)? I mean that's more consistent...
clearer what's going on...

and then .+? ./? I'd say all binops have implicit "." before them.
And then we just do aggressive inlining.
`;

export function presetEnv(builtins: { [key: string]: Type }) {
    const env = newEnv(null);
    env.global.builtins = {
        ...env.global.builtins,
        ...builtins,
    };
    // env.global.builtins['true'] = bool;
    // env.global.builtins['false'] = bool;

    // Just for the eff paper
    // env.global.builtins['isSquare'] = pureFunction([int], bool);
    // env.global.builtins['intToString'] = pureFunction([int], string);
    // env.global.builtins['intToFloat'] = pureFunction([int], float);

    const T: TypeVblDecl = { unique: 10000, subTypes: [] };
    const Y: TypeVblDecl = { unique: 10001, subTypes: [] };
    const Y0: Type = {
        type: 'var',
        sym: { unique: 10001, name: 'Y' },
        location: null,
    };
    const T0: Type = {
        type: 'var',
        sym: { unique: 10000, name: 'T' },
        location: null,
    };
    env.global.builtins['++'] = pureFunction([string, string], string);
    env.global.builtins['>='] = pureFunction([T0, T0], bool, [T]);
    env.global.builtins['<='] = pureFunction([T0, T0], bool, [T]);
    env.global.builtins['>'] = pureFunction([T0, T0], bool, [T]);
    env.global.builtins['<'] = pureFunction([T0, T0], bool, [T]);
    env.global.builtins['=='] = pureFunction([T0, T0], bool, [T]);
    env.global.builtins['+'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['-'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['/'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['*'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['^'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['&&'] = pureFunction([bool, bool], bool);
    env.global.builtins['||'] = pureFunction([bool, bool], bool);

    // env.global.builtins['log'] = pureFunction([string], void_);
    // const concat = <T>(one: Array<T>, two: Array<T>) => Array<T>
    const array = builtinType('Array', [T0]);
    // env.global.builtins['concat'] = pureFunction([array, array], array, [T]);
    env.global.builtinTypes['unit'] = 0;
    env.global.builtinTypes['void'] = 0;
    env.global.builtinTypes['int'] = 0;
    env.global.builtinTypes['float'] = 0;
    env.global.builtinTypes['bool'] = 0;
    env.global.builtinTypes['string'] = 0;
    env.global.builtinTypes['Array'] = 1;

    for (let i = 2; i < 10; i++) {
        env.global.builtinTypes['Tuple' + i] = i;
    }

    env.global.typeNames['As'] = { hash: 'As', pos: 0, size: 1 };
    env.global.types['As'] = {
        unique: 2,
        type: 'Record',
        typeVbls: [T, Y],
        effectVbls: [],
        extends: [],
        items: [pureFunction([T0], Y0)],
        location: null,
        ffi: null,
    };
    env.global.recordGroups['As'] = ['as'];
    env.global.idNames['As'] = 'As';
    env.global.attributeNames['as'] = {
        idx: 0,
        id: { hash: 'As', pos: 0, size: 1 },
    };

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

    return env;
}
