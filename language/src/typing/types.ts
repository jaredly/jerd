// Types for the typed tree

import { Identifier, Loc } from '../parsing/parser';
import { idName } from './env';
import seedrandom from 'seedrandom';
import { applyEffectVariables } from './typeExpr';
import { getTypeError } from './getTypeError';

export type Location = { start: Loc; end: Loc; source?: string; idx?: number };
export const nullLoc: Loc = { line: 1, column: 0, offset: 0 };

export const locToStart = (loc: Location): Location => ({
    ...loc,
    end: loc.start,
});
export const locToEnd = (loc: Location): Location => ({
    ...loc,
    start: loc.end,
});

export const encompassingLoc = (left: Location, right: Location) => {
    if (left.start === nullLoc) {
        return right;
    }
    if (right.end === nullLoc) {
        return left;
    }
    return { start: left.start, end: right.end };
};

export const nullLocation: Location = {
    start: nullLoc,
    end: nullLoc,
    source: '<generated>',
};

export const refsEqual = (one: Reference, two: Reference) => {
    return one.type === 'builtin'
        ? two.type === 'builtin' && one.name === two.name
        : // STOPSHIP: substitute the selfHash if one of the ids is self.
          two.type === 'user' && idsEqual(one.id, two.id);
};

export const isBuiltin = (one: Term, name: string) =>
    one.type === 'ref' && one.ref.type === 'builtin' && one.ref.name === name;

export const idsEqual = (one: Id, two: Id): boolean =>
    one.hash === two.hash && one.pos === two.pos && one.size === two.size;

export type Id = { hash: string; size: number; pos: number };
export type Reference = { type: 'builtin'; name: string } | UserReference;

export type UserReference = { type: 'user'; id: Id };
export type Symbol = { name: string; unique: number };

export const symbolsEqual = (one: Symbol, two: Symbol) =>
    one.unique === two.unique;

export const typeVblDeclsEqual = (one: TypeVblDecl, two: TypeVblDecl) =>
    one.unique === two.unique &&
    one.subTypes.length === two.subTypes.length &&
    one.subTypes.every((s, i) => idsEqual(s, two.subTypes[i]));

/*********** ENV STUFF ************/

export type Env = {
    // oh here's where we would do kind?
    // like args n stuff?
    global: GlobalEnv;
    local: LocalEnv;
    term: TermEnv;
    depth: number;
};

export type TermEnv = {
    nextTraceId: number;
    localNames: { [unique: number]: string };
};

export type MetaData = {
    /**
     * @deprecated this attribute is deprecated
     */
    tags: Array<string>;
    author?: string;
    supersedes?: string;
    supersededBy?: string;
    // Ok folks, here's our tests. this is our chance to make
    // then structured at all;
    tests?: Array<{
        id: Id;
        // Do we want to allow options? idk
        display?: { type: string };
    }>;
    // if superseedes is null, this might contain a source that
    // wasn't replaced.
    basedOn?: string;
    createdMs: number;
};

export type GlobalEnv = {
    rng: () => number;
    names: { [humanName: string]: Array<Id> };
    idNames: { [idName: string]: string };
    terms: { [idName: string]: Term };
    exportedTerms: { [humanName: string]: Id };
    metaData: {
        [idName: string]: MetaData;
    };
    builtins: { [key: string]: Type };

    // number here is "number of type arguments"
    builtinTypes: { [key: string]: number };

    typeNames: { [humanName: string]: Array<Id> };
    types: { [idName: string]: TypeDef };

    // These are two ways of saying the same thing
    recordGroups: { [key: string]: Array<string> };
    attributeNames: { [humanName: string]: Array<{ id: Id; idx: number }> };

    effectNames: { [humanName: string]: Array<string> };
    effectConstructors: {
        // TODO: multi here
        [humanName: string]: { idName: string; idx: number };
    };
    effectConstrNames: { [idName: string]: Array<string> };
    effects: {
        [key: string]: Array<{
            args: Array<Type>;
            ret: Type;
        }>;
    };

    decoratorNames: { [humanName: string]: Array<Id> };
    decorators: {
        [idName: string]: DecoratorDef;
    };
};

export const mergeGlobalEnvs = (
    old: GlobalEnv,
    newEnv: GlobalEnv,
): GlobalEnv => ({
    ...newEnv,
    builtins: old.builtins,
    builtinTypes: old.builtinTypes,
    metaData: { ...old.metaData, ...newEnv.metaData },
    rng: newEnv.rng,
    recordGroups: {
        ...old.recordGroups,
        ...newEnv.recordGroups,
    },
    decoratorNames: mergeNames(
        old.decoratorNames,
        newEnv.decoratorNames,
        idName,
    ),
    decorators: {
        ...old.decorators,
        ...newEnv.decorators,
    },
    attributeNames: mergeNames(
        old.attributeNames,
        newEnv.attributeNames,
        (m) => idName(m.id) + ':' + m.idx,
    ),
    typeNames: mergeNames(old.typeNames, newEnv.typeNames, idName),
    idNames: {
        ...old.idNames,
        ...newEnv.idNames,
    },
    types: {
        ...old.types,
        ...newEnv.types,
    },
    names: mergeNames(old.names, newEnv.names, idName),
    terms: {
        // In case we added newEnv global terms
        ...old.terms,
        ...newEnv.terms,
    },
});

export const mergeNames = <T>(
    a: { [key: string]: Array<T> },
    b: { [key: string]: Array<T> },
    toString: (id: T) => string,
) => {
    const names = { ...a };
    Object.keys(b).forEach((name) => {
        if (!names[name]) {
            names[name] = b[name];
            return;
        }
        const got: { [key: string]: true } = {};
        names[name].forEach((k) => (got[toString(k)] = true));
        names[name] = names[name].concat(
            b[name].filter((n) => !got[toString(n)]),
        );
    });
    return names;
};

export type DecoratorDefArg = {
    argLocation: Location;
    argName: string;
    location: Location;
    type: Type | null;
};
export type DecoratorDef = {
    unique: number;
    arguments: Array<DecoratorDefArg>;
    typeVbls: Array<TypeVblDecl>;
    typeArgs: Array<{ sym: Symbol; location: Location }>;
    restArg: {
        argLocation: Location;
        argName: string;
        location: Location;
        type: Type | null;
    } | null;
    targetType: Type | null;
    location: Location;
};

export type Self =
    | {
          type: 'Term';
          name: string;
          ann: Type;
      }
    | { type: 'Effect'; name: string; vbls: Array<number> }
    | {
          type: 'Type';
          name: string;
          vbls: Array<TypeVblDecl>;
      };

// TBH I should have a completely different local env for
// type checking (getTypeError) than I do for parsing.
export type LocalEnv = {
    unique: { current: number };
    self: Self | null;
    locals: { [key: string]: { sym: Symbol; type: Type } };
    localNames: { [name: string]: number };
    typeVbls: { [unique: number]: { subTypes: Array<Id> } }; // TODO: this will include kind or row constraint
    typeVblNames: { [key: string]: Symbol };
    effectVbls: { [key: string]: Symbol };
    tmpTypeVbls: { [key: string]: Array<TypeConstraint> }; // constraints
    // Sym ids encountered in the text will be remapped
    symMapping: { [key: number]: number };
    // manual type variables can't have constriaints, right? or can they?
    // I can figure that out later.
};

export const defaultRng = (seed: string = 'seed') => seedrandom(seed);

export const newEnv = (self: Self | null, seed: string = 'seed'): Env => ({
    depth: 0,
    global: {
        rng: defaultRng(seed),
        names: {},
        idNames: {},
        exportedTerms: {},
        metaData: {},
        terms: {},
        builtins: {},
        builtinTypes: {},
        typeNames: {},
        types: {},
        attributeNames: {},
        recordGroups: {},

        effectNames: {},
        effectConstructors: {},
        effectConstrNames: {},
        effects: {},

        decorators: {},
        decoratorNames: {},
    },
    term: {
        nextTraceId: 0,
        localNames: {},
    },
    local: {
        unique: { current: 0 },
        self,
        symMapping: {},
        effectVbls: {},
        locals: {},
        localNames: {},
        typeVblNames: {},
        typeVbls: {},
        tmpTypeVbls: {},
    },
});

export const newLocal = (): LocalEnv => ({
    unique: { current: 0 },
    self: null,
    symMapping: {},
    effectVbls: {},
    locals: {},
    localNames: {},
    typeVblNames: {},
    typeVbls: {},
    tmpTypeVbls: {},
});

export const newWithGlobal = (env: GlobalEnv): Env => ({
    depth: 0,
    global: cloneGlobalEnv(env),
    local: newLocal(),
    term: { nextTraceId: 0, localNames: {} },
});

export const cloneGlobalEnv = (env: GlobalEnv): GlobalEnv => {
    return {
        rng: env.rng,
        attributeNames: { ...env.attributeNames },
        recordGroups: { ...env.recordGroups },
        exportedTerms: { ...env.exportedTerms },
        metaData: { ...env.metaData },
        names: { ...env.names },
        idNames: { ...env.idNames },
        terms: { ...env.terms },
        builtins: { ...env.builtins },
        typeNames: { ...env.typeNames },
        builtinTypes: { ...env.builtinTypes },
        types: { ...env.types },
        effectNames: { ...env.effectNames },
        effectConstructors: { ...env.effectConstructors },
        effectConstrNames: { ...env.effectConstrNames },
        effects: { ...env.effects },
        decoratorNames: { ...env.decoratorNames },
        decorators: { ...env.decorators },
    };
};

export const selfEnv = (env: Env, self: Self): Env => {
    return {
        ...env,
        local: {
            ...env.local,
            self,
        },
        term: { nextTraceId: 0, localNames: {} },
    };
};

export const cloneLocalEnv = (env: LocalEnv): LocalEnv => ({
    self: env.self,
    effectVbls: { ...env.effectVbls },
    symMapping: { ...env.symMapping },
    locals: { ...env.locals },
    localNames: { ...env.localNames },
    unique: env.unique,
    typeVbls: { ...env.typeVbls },
    typeVblNames: { ...env.typeVblNames },
    tmpTypeVbls: env.tmpTypeVbls,
});

// export const termEnv = (env: Env): Env => {
//     return {
//         depth: 0,
//         global: cloneGlobalEnv(env.global),
//         local: cloneLocalEnv(env.local),
//         term: { nextTraceId: 0 },
//     };
// };

export const subEnv = (env: Env): Env => {
    // console.log('SUB ENV', env.depth, env.local.typeVbls);
    return {
        depth: env.depth + 1,
        global: cloneGlobalEnv(env.global),
        local: cloneLocalEnv(env.local),
        term: env.term,
    };
};

export type Case = {
    constr: number; // the index
    args: Array<{ sym: Symbol; type: Type }>;
    k: { sym: Symbol; type: Type };
    body: Term;
    decorators?: Decorators;
};

export type EffectReference = {
    type: 'ref';
    ref: Reference;
    location?: null | Location;
};
export type EffectRef =
    | EffectReference
    | { type: 'var'; sym: Symbol; location?: null | Location }; // TODO var, also args
export type Handle = {
    type: 'handle';
    location: Location;
    target: Term; // this must needs be typed as a LambdaType
    // These are the target's effects minus the one that is handled here.
    effect: Reference;
    cases: Array<Case>;
    pure: {
        arg: Symbol;
        body: Term;
    };
    // this is the type of the bodies of the cases
    // also of the pure, which is maybe simplest
    is: Type;
    decorators?: Decorators;
};
export type Raise = {
    type: 'raise';
    location: Location;
    ref: Reference;
    idx: number;
    args: Array<Term>;
    is: Type;
    decorators?: Decorators;
};

export type CPSAble =
    | Raise
    | Handle
    | {
          type: 'if';
          location: Location;
          cond: Term;
          yes: Term;
          no: Term | null;
          is: Type;
          decorators?: Decorators;
      }
    | Sequence
    | Apply;
export type Sequence = {
    type: 'sequence';
    location: Location;
    sts: Array<Term | Let>;
    is: Type;
    decorators?: Decorators;
};
export type Apply = {
    type: 'apply';
    location: Location;
    target: Term;
    typeVbls: Array<Type>;
    effectVbls: Array<EffectRef> | null;
    hadAllVariableEffects?: boolean;
    args: Array<Term>;
    is: Type; // this matches the return type of target
    decorators?: Decorators;
};

// This doesn't do type checking
export const apply = (
    target: Term,
    args: Array<Term>,
    location: Location,
): Term => ({
    type: 'apply',
    location,
    target,
    typeVbls: [],
    effectVbls: null,
    hadAllVariableEffects: false,
    args,
    is: (target.is as LambdaType).res, // this matches the return type of target
});

export type Let = {
    type: 'Let';
    location: Location;
    idLocation: Location;
    binding: Symbol; // TODO patterns folks
    value: Term;
    is: Type;
    decorators?: Decorators;
};

export type Var = {
    type: 'var';
    location: Location;
    sym: Symbol;
    is: Type;
    decorators?: Decorators;
};

export const getAllSubTypes = (
    env: GlobalEnv,
    extend: Array<Id>,
): Array<Id> => {
    return ([] as Array<Id>).concat(
        ...extend.map((id) =>
            [id].concat(
                getAllSubTypes(
                    env,
                    (env.types[idName(id)] as RecordDef).extends,
                ),
            ),
        ),
    );
};

export type ConcreteBase<Contents> = {
    type: 'Concrete';
    ref: UserReference;
    rows: Array<Contents>;
    location: Location;
    spread: Term | null; // only one spread per type makes sense
};
export type RecordBase<Contents> =
    | ConcreteBase<Contents>
    | { type: 'Variable'; var: Symbol; spread: Term; location: Location };

export type Record = {
    type: 'Record';
    base: RecordBase<Term | null>;
    is: Type;
    // For each subtype, we might have members defined
    subTypes: {
        [id: string]: {
            covered: boolean;
            spread: Term | null;
            rows: Array<Term | null>;
        };
    };
    location: Location;
    decorators?: Decorators;
};

export type ArrayLiteral = {
    type: 'Array';
    location: Location;
    items: Array<Term | ArraySpread>;
    is: TypeReference;
    decorators?: Decorators;
};

export type ArraySpread = {
    type: 'ArraySpread';
    value: Term;
    location: Location;
    decorators?: Decorators;
};

// This is basically a type coersion? well not when we have to deal with unions explicitly
export type Enum = {
    type: 'Enum';
    inner: Term;
    is: TypeReference;
    location: Location;
    decorators?: Decorators;
};

export type Switch = {
    type: 'Switch';
    term: Term;
    cases: Array<SwitchCase>;
    is: Type;
    location: Location;
    decorators?: Decorators;
};

export type SwitchCase = {
    location: Location;
    pattern: Pattern;
    body: Term;
    decorators?: Decorators;
};

export type Pattern =
    | Literal
    | AliasPattern
    | RecordPattern
    | TuplePattern
    | ArrayPattern
    | EnumPattern
    | Ignore
    | Binding;
export type Ignore = {
    type: 'Ignore';
    location: Location;
    decorators?: Decorators;
};
export type Binding = {
    type: 'Binding';
    sym: Symbol;
    location: Location;
    decorators?: Decorators;
};
export type AliasPattern = {
    type: 'Alias';
    name: Symbol;
    inner: Pattern;
    location: Location;
    decorators?: Decorators;
};
export type EnumPattern = {
    type: 'Enum';
    ref: TypeReference;
    location: Location;
    decorators?: Decorators;
};
export type RecordPattern = {
    type: 'Record';
    ref: TypeReference;
    items: Array<RecordPatternItem>;
    location: Location;
    decorators?: Decorators;
};
export type RecordPatternItem = {
    // sym: Symbol;
    ref: UserReference;
    idx: number; // is this right? hm no I need to know the subtype too
    location: Location;
    pattern: Pattern;
    is: Type;
    decorators?: Decorators;
};
export type ArrayPattern = {
    type: 'Array';
    preItems: Array<Pattern>;
    // TBH spread & postItems should go in the same
    // type that's nullable.
    // Because you can never have postItems if you
    // don't have spread.
    // like `spread: {pattern: Pattern, postItems: Array<Pattern>} | null`
    spread: Pattern | null;
    postItems: Array<Pattern>;
    location: Location;
    is: Type;
    decorators?: Decorators;
};
export type TuplePattern = {
    type: 'Tuple';
    items: Array<Pattern>;
    location: Location;
    decorators?: Decorators;
};

export type Unary = {
    type: 'unary';
    op: '-' | '!';
    inner: Term;
    location: Location;
    is: Type;
    decorators?: Decorators;
};

export type TypeError = {
    type: 'TypeError';
    is: Type; // this is the type that was needed
    inner: Term; // this has the type that was found
    location: Location;
    message?: string;
    decorators?: Decorators;
};

export type Ambiguous = {
    type: 'Ambiguous';
    options: Array<Term>;
    is: AmbiguousType;
    location: Location;
    decorators?: Decorators;
};

export type ErrorTerm = Ambiguous | TypeError;

// some-term
// : some-type
// = some-pattern
export type Decorator = {
    name: { id: Id; location: Location };
    location: Location;
    args: Array<DecoratorArg>;
};
export type DecoratorArg =
    | {
          type: 'Term';
          term: Term;
      }
    | { type: 'Type'; contents: Type }
    | { type: 'Pattern'; pattern: Pattern };

export type Decorators = Array<Decorator>;

// Term assertions
(t: Term, p: Pattern, y: Type) => {
    let tl: Location = t.location;
    let tt: Type = t.is;
    let td: undefined | Decorators = t.decorators;

    let p_: Location = p.location;
    let pd: undefined | Decorators = p.decorators;

    let yl: Location = y.location;
    let yd: undefined | Decorators = y.decorators;
};

export type Term =
    | ErrorTerm
    | CPSAble
    | Unary
    | { type: 'self'; is: Type; location: Location; decorators?: Decorators }
    // For now, we don't have subtyping
    // but when we do, we'll need like a `subrows: {[id: string]: Array<Term>}`
    | Record
    | Switch
    | Enum
    | {
          type: 'Trace';
          idx: number;
          args: Array<Term>;
          is: Type;
          location: Location;
          decorators?: Decorators;
      }
    | ArrayLiteral
    | TupleLiteral
    | TupleAccess
    | Attribute
    | Ref
    | Var
    | LiteralWithTemplateString
    | Lambda;

export type Ref = {
    type: 'ref';
    location: Location;
    ref: Reference;
    is: Type;
    decorators?: Decorators;
};
export type Attribute = {
    type: 'Attribute';
    target: Term;
    ref: Reference;
    refTypeVbls?: Array<Type>;
    idx: number;
    // Shouldn't impact hash
    inferred: boolean;
    location: Location;
    idLocation: Location;
    is: Type;
    decorators?: Decorators;
};

export type TupleLiteral = {
    type: 'Tuple';
    is: TypeReference;
    items: Array<Term>;
    location: Location;
    decorators?: Decorators;
};

export type TupleAccess = {
    type: 'TupleAccess';
    is: Type;
    target: Term;
    idx: number;
    location: Location;
    decorators?: Decorators;
};

export type Literal = String | Float | Int | Boolean;
export type LiteralWithTemplateString =
    | String
    | TemplateString
    | Float
    | Int
    | Boolean;
export type Float = {
    type: 'float';
    location: Location;
    value: number;
    is: Type;
    decorators?: Decorators;
};
export type Int = {
    type: 'int';
    location: Location;
    value: number;
    is: Type;
    decorators?: Decorators;
};
export type TemplateString = {
    type: 'TemplateString';
    pairs: Array<{
        prefix: string;
        id: null | Id;
        location: Location;
        contents: Term;
    }>;
    suffix: string;
    location: Location;
    is: Type;
    decorators?: Decorators;
};
export type String = {
    type: 'string';
    text: string;
    is: Type;
    location: Location;
    decorators?: Decorators;
};
export type Boolean = {
    type: 'boolean';
    value: boolean;
    is: Type;
    location: Location;
    decorators?: Decorators;
};
export type Lambda = {
    type: 'lambda';
    location: Location;
    args: Array<Symbol>;
    idLocations: Array<Location>;
    body: Term;
    is: LambdaType;
    /**
     * @deprecated this field is deprecated
     */
    tags?: Array<string>;
    decorators?: Decorators;
};

// from thih
// type Type_ = TVar (Tyvar Id Kind)
// | TCon (Tycon Id Kind)
// | TAp Type_ Type_

// tUnit = TCon (Tycon “()” Star )
// tChar = TCon (Tycon “Char” Star )
// tInt = TCon (Tycon “Int” Star )
// tInteger = TCon (Tycon “Integer” Star )
// tFloat = TCon (Tycon “Float” Star )
// tDouble = TCon (Tycon “Double” Star )
// tList = TCon (Tycon “[]” (Kfun Star Star ))
// tArrow = TCon (Tycon “(->)” (Kfun Star (Kfun Star Star )))
// tTuple2 = TCon (Tycon “(,)” (Kfun Star (Kfun Star Star )))

// Can values have kinds?
// does that even make sense?
// What if I just sayd "these are unbound variables"?
// like these are "forall"s, that'll have to be resolved....

// so <X> before a type reference means "arg" and <X> after a type reference means "apply", right?
// maybe too confusing. but I get it at least at the moment.
// So when parsing a type.
// some things are args, some things are application, right?
//

export type EnumDef = {
    type: 'Enum';
    location: Location;
    typeVbls: Array<TypeVblDecl>;
    effectVbls: Array<number>;
    extends: Array<UserTypeReference>;
    items: Array<UserTypeReference>;
    decorators?: Decorators;
};

export type TypeDef = RecordDef | EnumDef;
export type RecordDef = {
    type: 'Record';
    unique: number;
    location: Location;
    typeVbls: Array<TypeVblDecl>; // TODO: kind, row etc.
    effectVbls: Array<number>;
    extends: Array<Id>;
    items: Array<Type>;
    ffi: { tag: string; names: Array<string> } | null;
    decorators?: Decorators;
    defaults?: {
        [idAndNumber: string]: {
            // Null for the toplevel record
            id: null | Id;
            idx: number;
            value: Term;
        };
    };
};

// | {
//     type: 'FFIRecord',
//     extends: Array<Id>,
//     items: {[key: string]: Type}
// }

// export type TypeExpr = {
//     inner: Type;
//     applied: Array<TypeExpr>;
//     paramed: Array<TypeExpr>;
// };
// I guess we need a `TypeDecl` type. yeah.

// | { type: 'atom'; inner: Type }
// | { type: 'apply'; inner: TypeExpr; args: Array<TypeExpr> }
// | { type: 'lambda'; inner: TypeExpr; args: Array<Symbol> };

/*
So here is a thing.
I want to be grounded in real-world use cases,
so that I'm not spinning in circles
but the real world use cases I'm chasing
are quite complicated.

My first pass had effects working! So good!
Now I'm trying to add like a dozen things at once.
- record types
- generics
- etc.

NEW PLAN:
- hm yeah what if I just added generic functions first
- and then added records?
- and then support spreading / row polymorphism (hey generics thx)
- and then made them genericable?
- yeah that sounds much better.
- but yeah, at the moment I've got an idea of what I'm shooting for, which is nice.
*/

// So then we reduce the things and things
// now, we don't really allow anonymous record or enum types
// but maybe that doesn't matter.
// maybe the internals of a Type
// uh
// ok so when I'm type checking
// and I'm like "this value has this type"
// what's that type?
// like
// is it a typeexpr?
// b/c that's maybe a little much
// idk
// like A reference can have things we're applying to it
// but can it really have lambdas too?
// and do we nest them?
// I really don't think we nest them.
// Yeah I'm thinking it's just one layer, that's all you get folks.
// ok I think that should be enought to capture it.
// T<A> => applied[A]
// T<A<B>> => applied[A applied [B]]

export const isRecord = (one: Type, ref: Reference) => {
    return one.type === 'ref' && refsEqual(one.ref, ref);
};

export const typesEqual = (one: Type | null, two: Type | null): boolean => {
    if (one == null || two == null) {
        return one == two;
    }
    return getTypeError(null, one, two, nullLocation) === null;
    // if (one.type === 'ref' || two.type === 'ref') {
    //     if (one.type === 'ref' && two.type === 'ref') {
    //         return refsEqual(one.ref, two.ref);
    //     }
    //     if (one.type === 'ref' && one.ref.type === 'builtin') {
    //         return two.type === 'ref' && refsEqual(one.ref, two.ref);
    //     }
    //     if (two.type === 'ref' && two.ref.type === 'builtin') {
    //         return one.type === 'ref' && refsEqual(two.ref, one.ref);
    //     }
    //     // STOPSHIP: resolve type references
    //     // throw new Error(`Need to lookup types sorry`);
    //     return false;
    // }
    // if (one.type === 'var') {
    //     return two.type === 'var' && symbolsEqual(one.sym, two.sym);
    // }
    // if (one.type === 'lambda') {
    //     return (
    //         two.type === 'lambda' &&
    //         deepEqual(one.typeVbls, two.typeVbls) &&
    //         one.args.length === two.args.length &&
    //         one.args.every((arg, i) => typesEqual(arg, two.args[i])) &&
    //         one.effects.length === two.effects.length &&
    //         effectsMatch(one.effects, two.effects) &&
    //         typesEqual(one.res, two.res) &&
    //         typesEqual(one.rest, two.rest)
    //     );
    // }
    // return false;
};

const effectKey = (e: EffectRef) =>
    e.type === 'ref'
        ? 'ref:' + (e.ref.type === 'builtin' ? e.ref.name : idName(e.ref.id))
        : 'sym:' + e.sym.unique;

// TODO: should I allow variables to be flexible here? idk
export const effectsMatch = (
    one: Array<EffectRef>,
    two: Array<EffectRef>,
    lessAllowed: boolean = false,
    // mapping?: { [oneUnique: number]: number },
) => {
    const ones: { [k: string]: boolean } = {};
    const twos: { [k: string]: boolean } = {};
    one.forEach((e) => {
        ones[effectKey(e)] = true;
    });
    for (let e of two) {
        const k = effectKey(e);
        twos[k] = true;
        if (!ones[k]) {
            // console.log(`Missing`, k, one.map(effectKey), two.map(effectKey));
            return false;
        }
    }
    // Verify that everything in one is also in two
    if (!lessAllowed) {
        for (let e of one) {
            if (!twos[effectKey(e)]) {
                return false;
            }
        }
    }

    return true;
};

export type UserTypeReference = {
    type: 'ref';
    ref: UserReference;
    location: Location;
    typeVbls: Array<Type>;
    decorators?: Decorators;
    // effectVbls: Array<EffectRef>;
};
export type TypeReference = {
    type: 'ref';
    ref: Reference;
    location: Location;
    typeVbls: Array<Type>;
    decorators?: Decorators;
    // effectVbls: Array<EffectRef>;
};
export type TypeRef = UserTypeReference | TypeReference | TypeVar; // will also support vbls at some point I guess

export type TypeVar = {
    type: 'var';
    sym: Symbol;
    location: Location;
    decorators?: Decorators;
};

export type AmbiguousType = {
    type: 'Ambiguous';
    location: Location;
    decorators?: Decorators;
};
export type Type = TypeRef | LambdaType | AmbiguousType;

// Here's the basics folks
// kind lambdas can't have effects, thank goodness
// So when we're resolving type declarations, we'll probably
// have to do some inferency-looking stuff for types?
export type Kind =
    | { type: 'concrete' }
    | { type: 'lambda'; arg: Kind; reult: Kind };

export type TypeVblDecl = {
    subTypes: Array<Id>;
    unique: number;
    // TODO: make these required
    name?: string;
    location?: Location;
    decorators?: Decorators;
};

export type LambdaType = {
    type: 'lambda';
    location: Location;
    // TODO: this shouldn't be an array,
    // we don't have to be order dependent here.
    typeVbls: Array<TypeVblDecl>; // TODO: kind, row etc.
    effectVbls: Array<number>;
    // TODO optional arguments!
    // TODO modular implicits!
    // TODO: Make this required, this is just for backwards compat
    argNames?: Array<null | { text: string; location: Location }>;
    args: Array<Type>;
    effects: Array<EffectRef>;
    rest: Type | null;
    res: Type;
    decorators?: Decorators;
};

export type RecordRow = {
    id: Identifier;
    type: Type;
    decorators?: Decorators;
};

export type RecordType = {
    type: 'Record';
    items: Array<RecordRow>;
    extends: Array<Reference>;
    decorators?: Decorators;
};

export type TypeConstraint =
    | {
          type: 'smaller-than';
          other: Type; // the super type
      }
    | { type: 'larger-than'; other: Type }; // the sub type

export type EffectDef = {
    type: 'EffectDef';
    constrs: Array<{ args: Array<Type>; ret: Type }>;
    location: Location;
    decorators?: Decorators;
};

const emptyEffects: Array<EffectRef> = [];

// TODO need to resolve probably
export const getEffects = (t: Term | Let): Array<EffectRef> => {
    switch (t.type) {
        case 'Let':
            return getEffects(t.value);
        case 'Array':
            return emptyEffects.concat(
                ...t.items.map((i) =>
                    getEffects(i.type === 'ArraySpread' ? i.value : i),
                ),
            );
        case 'TypeError':
            return getEffects(t.inner);
        case 'Ambiguous':
            return ([] as Array<EffectRef>).concat(
                ...t.options.map(getEffects),
            );
        case 'apply': {
            let is = t.target.is as LambdaType;
            if (t.effectVbls) {
                is = applyEffectVariables(null, is, t.effectVbls) as LambdaType;
            }
            return dedupEffects(
                (is as LambdaType).effects.concat(...t.args.map(getEffects)),
            );
        }
        case 'sequence':
            return emptyEffects.concat(...t.sts.map(getEffects));
        case 'raise':
            return dedupEffects(
                [{ type: 'ref', ref: t.ref } as EffectRef].concat(
                    ...t.args.map(getEffects),
                ),
            );
        case 'if':
            return dedupEffects(
                getEffects(t.cond)
                    .concat(getEffects(t.yes))
                    .concat(t.no ? getEffects(t.no) : []),
            );
        case 'int':
        case 'float':
        case 'string':
        case 'boolean':
        case 'lambda':
        case 'self':
        case 'ref':
        case 'var':
            return [];
        case 'handle':
            // ok we also need to talk about ... the function we're calling
            const thisKey = effectKey({ type: 'ref', ref: t.effect });
            return dedupEffects(
                getEffects(t.pure.body)
                    .concat(...t.cases.map((k) => getEffects(k.body)))
                    .concat(
                        (t.target.is as LambdaType).effects.filter(
                            (e) => effectKey(e) !== thisKey,
                        ),
                    ),
            );
        case 'Attribute':
        case 'TupleAccess':
            return getEffects(t.target);
        case 'Record': {
            const effects = [] as Array<EffectRef>;
            if (t.base.type === 'Concrete') {
                t.base.rows.forEach((row, i) => {
                    if (row != null) {
                        effects.push(...getEffects(row));
                    }
                });
            }
            if (t.base.spread) {
                effects.push(...getEffects(t.base.spread));
            }
            for (let id of Object.keys(t.subTypes)) {
                const spread = t.subTypes[id].spread;
                if (spread != null) {
                    effects.push(...getEffects(spread));
                }
                t.subTypes[id].rows.forEach((row) =>
                    row ? effects.push(...getEffects(row)) : null,
                );
            }

            return effects;
        }
        case 'Enum':
        case 'unary':
            return getEffects(t.inner);
        case 'Trace':
            return emptyEffects.concat(...t.args.map(getEffects));
        case 'Switch':
            return getEffects(t.term).concat(
                ...t.cases.map((c) => getEffects(c.body)),
            );
        case 'Tuple':
            return emptyEffects.concat(...t.items.map(getEffects));
        case 'TemplateString':
            return emptyEffects.concat(
                ...t.pairs.map((i) => getEffects(i.contents)),
            );
        default:
            let _x: never = t;
            throw new Error('Unhandled term');
    }
};

// Normalizing the order of these on purpose
export const dedupEffects = (effects: Array<EffectRef>) => {
    const used: { [key: string]: EffectRef } = {};
    effects.forEach((e) => {
        const k = effectKey(e);
        if (used[k]) {
            return false;
        }
        used[k] = e;
        return true;
    });
    return Object.keys(used)
        .sort()
        .map((k) => used[k]);
};

export const walkTerm = (
    term: Term | Let,
    handle: (term: Term | Let) => void,
): void => {
    handle(term);
    switch (term.type) {
        case 'Let':
            return walkTerm(term.value, handle);
        case 'Ambiguous':
            term.options.forEach((t) => walkTerm(t, handle));
            return;
        case 'TypeError':
            return walkTerm(term.inner, handle);
        case 'raise':
            return term.args.forEach((t) => walkTerm(t, handle));
        case 'if':
            walkTerm(term.cond, handle);
            walkTerm(term.yes, handle);
            if (term.no) {
                walkTerm(term.no, handle);
            }
            return;
        case 'handle':
            walkTerm(term.target, handle);
            walkTerm(term.pure.body, handle);
            term.cases.forEach((kase) => walkTerm(kase.body, handle));
            return;
        case 'sequence':
            return term.sts.forEach((t) => walkTerm(t, handle));
        case 'apply':
            walkTerm(term.target, handle);
            return term.args.forEach((t) => walkTerm(t, handle));
        case 'lambda':
            return walkTerm(term.body, handle);
        case 'Record':
            if (term.base.spread) {
                walkTerm(term.base.spread, handle);
            }
            if (term.base.type === 'Concrete') {
                term.base.rows.forEach((term) =>
                    term ? walkTerm(term, handle) : null,
                );
            }
            Object.keys(term.subTypes).forEach((id) => {
                const subType = term.subTypes[id];
                if (subType.spread != null) {
                    walkTerm(subType.spread, handle);
                }
                subType.rows.forEach((row) =>
                    row ? walkTerm(row, handle) : null,
                );
            });
            return;
        case 'Switch':
            walkTerm(term.term, handle);
            term.cases.forEach((kase) => {
                walkTerm(kase.body, handle);
            });
            return;
        case 'Enum':
        case 'unary':
            return walkTerm(term.inner, handle);
        case 'Tuple':
            term.items.forEach((item) => {
                walkTerm(item, handle);
            });
            return;
        case 'Array':
            term.items.forEach((item) => {
                if (item.type === 'ArraySpread') {
                    walkTerm(item.value, handle);
                } else {
                    walkTerm(item, handle);
                }
            });
            return;
        case 'TupleAccess':
        case 'Attribute':
            walkTerm(term.target, handle);
            return;
        case 'Trace':
            term.args.forEach((arg) => walkTerm(arg, handle));
            return;
        case 'string':
        case 'int':
        case 'float':
        case 'boolean':
        case 'self':
        case 'ref':
        case 'var':
            return;
        case 'TemplateString':
            term.pairs.forEach((item) => walkTerm(item.contents, handle));
            return;
        default:
            let _x: never = term;
            throw new Error(`Unexpected term type ${(term as any).type}`);
    }
};
