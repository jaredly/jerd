// Presets

// import { Location } from '../parsing/parser';
import { Loc } from '../printing/ir/types';
import { idFromName, typeForIdRaw } from './env';
import { LocatedError } from './errors';
import { getTypeError } from './getTypeError';
import {
    apply,
    LambdaType,
    newEnv,
    nullLocation,
    Symbol,
    Term,
    Type,
    TypeVblDecl,
    Location,
    TypeReference,
    Id,
    Record,
    RecordDef,
    RecordSubType,
    Lambda,
    UserTypeReference,
    EnumDef,
    TypeVar,
    DecoratorDef,
    DecoratorArg,
    DecoratorDefArg,
    EffectDef,
} from './types';

export const builtinLocation: Location = {
    ...nullLocation,
    source: '<builtin>',
};

export const userTypeReference = (id: Id): UserTypeReference => ({
    type: 'ref',
    location: nullLocation,
    ref: { type: 'user', id },
    typeVbls: [],
});

export const builtinType = (
    name: string,
    typeVbls: Array<Type> = [],
): Type => ({
    type: 'ref',
    ref: { type: 'builtin', name },
    location: builtinLocation,
    typeVbls,
    // effectVbls: [],
});

export const varType = (sym: Symbol): TypeVar => ({
    type: 'var',
    sym,
    location: builtinLocation,
});

export const refType = (
    id: Id,
    typeVbls: Array<Type> = [],
): UserTypeReference => ({
    type: 'ref',
    ref: { type: 'user', id },
    location: builtinLocation,
    typeVbls,
    // effectVbls: [],
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

export const lambdaLiteral = (
    args: Array<{ sym: Symbol; is: Type; location: Location }>,
    body: Term,
    location: Location = nullLocation,
    typeVbls: Array<TypeVblDecl> = [],
): Lambda => ({
    type: 'lambda',
    args: args.map((arg) => ({ sym: arg.sym, location: arg.location })),
    body: body,
    is: pureFunction(
        args.map((arg) => arg.is),
        body.is,
        typeVbls,
    ),
    location,
});

export const pureFunction = (
    args: Array<Type>,
    res: Type,
    typeVbls: Array<TypeVblDecl> = [],
): LambdaType => {
    return {
        type: 'lambda',
        typeVbls,
        effectVbls: [],
        argNames: args.map((arg) => null),
        args,
        effects: [],
        rest: null,
        res,
        location: builtinLocation,
    };
};

export const enumDefn = (
    items: Array<UserTypeReference>,
    typeVbls: Array<TypeVblDecl> = [],
    location: Location = nullLocation,
): EnumDef => ({
    type: 'Enum',
    effectVbls: [],
    extends: [],
    items,
    location,
    typeVbls,
});

export const effectDef = (
    constrs: Array<{ args: Array<Type>; ret: Type }>,
    location: Location = nullLocation,
): EffectDef => ({
    constrs,
    location,
    type: 'EffectDef',
});

export const decoratorDef = (
    args: Array<DecoratorDefArg>,
    targetType: Type | null = null,
    typeVbls: Array<TypeVblDecl> = [],
    restArg: DecoratorDefArg | null = null,
    unique: number = 0,
    location: Location = nullLocation,
): DecoratorDef => ({
    arguments: args,
    location,
    restArg,
    targetType,
    typeArgs: [],
    typeVbls,
    unique,
});

export const recordDefn = (
    items: Array<Type>,
    extenders: Array<UserTypeReference> = [],
    typeVbls: Array<TypeVblDecl> = [],
    location: Location = nullLocation,
    unique: number = 0,
): RecordDef => ({
    type: 'Record',
    effectVbls: [],
    extends: extenders,
    ffi: null,
    items: items,
    location,
    typeVbls,
    unique,
});

export const recordLiteral = (
    id: Id,
    rows: Array<Term>,
    subTypes: { [id: string]: RecordSubType } = {},
    typeVbls: Array<Type> = [],
): Record => ({
    type: 'Record',
    location: nullLocation,
    subTypes,
    is: {
        type: 'ref',
        ref: { type: 'user', id },
        location: nullLocation,
        typeVbls,
    },
    base: {
        location: nullLocation,
        ref: { type: 'user', id },
        spread: null,
        type: 'Concrete',
        rows: rows,
    },
});

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

export const numeric = builtinType('numeric');

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

    const T: TypeVblDecl = {
        sym: {
            unique: 10000,
            name: 'T',
        },
        subTypes: [],
        location: nullLocation,
    };
    const Y: TypeVblDecl = {
        sym: {
            unique: 10001,
            name: 'Y',
        },
        subTypes: [],
        location: nullLocation,
    };
    const Y0: Type = {
        type: 'var',
        sym: { unique: 10001, name: 'Y' },
        location: builtinLocation,
    };
    const T0: Type = {
        type: 'var',
        sym: { unique: 10000, name: 'T' },
        location: builtinLocation,
    };
    env.global.builtins['++'] = pureFunction([string, string], string);
    env.global.builtins['>='] = pureFunction([numeric, numeric], bool, []);
    env.global.builtins['<='] = pureFunction([numeric, numeric], bool, []);
    env.global.builtins['>'] = pureFunction([numeric, numeric], bool, []);
    env.global.builtins['<'] = pureFunction([numeric, numeric], bool, []);
    env.global.builtins['=='] = pureFunction([T0, T0], bool, [T]);
    // TODO: make builtins or something for this?
    env.global.builtins['+'] = pureFunction([numeric, numeric], numeric, []);
    env.global.builtins['-'] = pureFunction([numeric, numeric], numeric, []);
    env.global.builtins['*'] = pureFunction([numeric, numeric], numeric, []);
    env.global.builtins['/'] = pureFunction([numeric, numeric], numeric, []);
    // env.global.builtins['-'] = pureFunction([T0, T0], T0, [T]);
    // env.global.builtins['/'] = pureFunction([T0, T0], T0, [T]);
    // env.global.builtins['*'] = pureFunction([T0, T0], T0, [T]);
    env.global.builtins['^'] = pureFunction([numeric, numeric], numeric, [T]);
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
    // GLSL my good folks
    env.global.builtinTypes['sampler2D'] = 0;

    for (let i = 2; i < 10; i++) {
        env.global.builtinTypes['Tuple' + i] = i;
    }

    env.global.typeNames['As'] = [{ hash: 'As', pos: 0, size: 1 }];
    env.global.types['As'] = {
        unique: 2,
        type: 'Record',
        typeVbls: [T, Y],
        effectVbls: [],
        extends: [],
        items: [pureFunction([T0], Y0)],
        location: builtinLocation,
        ffi: null,
    };
    env.global.recordGroups['As'] = ['as'];
    env.global.idNames['As'] = 'As';
    env.global.attributeNames['as'] = [
        {
            idx: 0,
            id: { hash: 'As', pos: 0, size: 1 },
        },
    ];

    env.global.typeNames['Some'] = [{ hash: 'Some', pos: 0, size: 1 }];
    env.global.idNames['Some'] = 'Some';
    env.global.typeNames['None'] = [{ hash: 'None', pos: 0, size: 1 }];
    env.global.idNames['None'] = 'None';
    env.global.types['None'] = {
        unique: 1,
        type: 'Record',
        typeVbls: [],
        effectVbls: [],
        extends: [],
        items: [],
        location: builtinLocation,
        ffi: null,
    };
    env.global.types['Some'] = {
        unique: 0,
        type: 'Record',
        typeVbls: [T],
        effectVbls: [],
        extends: [],
        items: [T0],
        location: builtinLocation,
        ffi: null,
    };
    env.global.recordGroups['Some'] = ['contents'];
    env.global.attributeNames['contents'] = [
        {
            idx: 0,
            id: { hash: 'Some', pos: 0, size: 1 },
        },
    ];

    return env;
}
export const builtin = (name: string, is: Type, loc: Loc): Term => ({
    type: 'ref',
    ref: { type: 'builtin', name },
    is,
    location: loc,
});

export const floatLiteral = (value: number, location: Location): Term => ({
    type: 'float',
    value,
    location,
    is: float,
});

export const intLiteral = (value: number, location: Location): Term => ({
    type: 'int',
    value,
    location,
    is: int,
});

export const stringLiteral = (text: string, location: Location): Term => ({
    type: 'string',
    text,
    location,
    is: string,
});

export const applyBuiltin = (
    name: string,
    args: Array<Term>,
    is: Type,
    loc: Location,
): Term =>
    apply(
        builtin(
            name,
            pureFunction(
                args.map((arg) => arg.is),
                is,
            ),
            loc,
        ),
        args,
        loc,
    );

export const var_ = (sym: Symbol, is: Type, loc: Loc): Term => ({
    type: 'var',
    sym,
    is,
    location: loc,
});

export const if_ = (
    cond: Term,
    yes: Term,
    no: Term | null,
    loc: Location,
): Term => {
    const noType = no == null ? void_ : no.is;
    const err = getTypeError(null, yes.is, noType, loc);
    if (err != null) {
        throw err;
    }
    return {
        type: 'if',
        cond,
        yes,
        no,
        is: yes.is,
        location: loc,
    };
};

export const and = (left: Term, right: Term, loc: Loc) =>
    apply(
        builtin('&&', pureFunction([bool, bool], bool), loc),
        [left, right],
        loc,
    );

export const or = (left: Term, right: Term, loc: Loc) =>
    apply(
        builtin('||', pureFunction([bool, bool], bool), loc),
        [left, right],
        loc,
    );
