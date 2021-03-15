// Types for the typed tree

import { Expression, Identifier, Location } from '../parsing/parser';
import deepEqual from 'fast-deep-equal';
import { idName } from './env';
import seedrandom from 'seedrandom';

export const refsEqual = (one: Reference, two: Reference) => {
    return one.type === 'builtin'
        ? two.type === 'builtin' && one.name === two.name
        : two.type === 'user' && idsEqual(one.id, two.id);
};

export const idsEqual = (one: Id, two: Id): boolean =>
    one.hash === two.hash && one.pos === two.pos && one.size === two.size;

export type Id = { hash: string; size: number; pos: number };
export type Reference = { type: 'builtin'; name: string } | UserReference;

export type UserReference = { type: 'user'; id: Id };
export type Symbol = { name: string; unique: number };

export const symbolsEqual = (one: Symbol, two: Symbol) =>
    one.unique === two.unique;

export type Env = {
    // oh here's where we would do kind?
    // like args n stuff?
    global: GlobalEnv;
    local: LocalEnv;
    depth: number;
};

export type GlobalEnv = {
    rng: () => number;
    names: { [key: string]: Id };
    idNames: { [idName: string]: string };
    terms: { [key: string]: Term };
    builtins: { [key: string]: Type };

    // number here is "number of type arguments"
    builtinTypes: { [key: string]: number };

    typeNames: { [key: string]: Id };
    types: { [key: string]: TypeDef };

    // These are two ways of saying the same thing
    recordGroups: { [key: string]: Array<string> };
    attributeNames: { [key: string]: { id: Id; idx: number } };

    effectNames: { [key: string]: string };
    effectConstructors: { [key: string]: { hash: string; idx: number } };
    effectConstrNames: { [idName: string]: Array<string> };
    effects: {
        [key: string]: Array<{
            args: Array<Type>;
            ret: Type;
        }>;
    };
};

export type LocalEnv = {
    unique: number;
    self: {
        name: string;
        type: Type;
    };
    locals: { [key: string]: { sym: Symbol; type: Type } };
    typeVbls: { [unique: number]: { subTypes: Array<Id> } }; // TODO: this will include kind or row constraint
    typeVblNames: { [key: string]: Symbol };
    effectVbls: { [key: string]: Symbol };
    tmpTypeVbls: { [key: string]: Array<TypeConstraint> }; // constraints
    // manual type variables can't have constriaints, right? or can they?
    // I can figure that out later.
};

export type Case = {
    constr: number; // the index
    args: Array<Symbol>;
    k: Symbol;
    body: Term;
};

export type EffectRef =
    | { type: 'ref'; ref: Reference; location?: null | Location }
    | { type: 'var'; sym: Symbol; location?: null | Location }; // TODO var, also args

export type CPSAble =
    | {
          type: 'raise';
          location: Location | null;
          ref: Reference;
          idx: number;
          args: Array<Term>;
          is: Type;
      }
    | {
          type: 'handle';
          location: Location | null;
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
      }
    | {
          type: 'if';
          location: Location | null;
          cond: Term;
          yes: Term;
          no: Term | null;
          is: Type;
      }
    | {
          type: 'sequence';
          location: Location | null;
          sts: Array<Term | Let>;
          is: Type;
      }
    | {
          type: 'apply';
          location: Location | null;
          target: Term;
          typeVbls: Array<Type>;
          effectVbls: Array<EffectRef> | null;
          hadAllVariableEffects?: boolean;
          args: Array<Term>;
          is: Type; // this matches the return type of target
      };

export type Let = {
    type: 'Let';
    location: Location | null;
    binding: Symbol; // TODO patterns folks
    value: Term;
    is: Type;
};

export type Var = {
    type: 'var';
    location: Location | null;
    sym: Symbol;
    is: Type;
};

export const getAllSubTypes = (env: GlobalEnv, t: RecordDef): Array<Id> => {
    return ([] as Array<Id>).concat(
        ...t.extends.map((id) =>
            [id].concat(
                getAllSubTypes(env, env.types[idName(id)] as RecordDef),
            ),
        ),
    );
};

export type RecordBase<Contents> =
    | {
          type: 'Concrete';
          ref: UserReference;
          rows: Array<Contents>;
          spread: Term | null; // only one spread per type makes sense
      }
    | { type: 'Variable'; var: Symbol; spread: Term };

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
    location: Location | null;
};

export type ArrayLiteral = {
    type: 'Array';
    location: Location | null;
    items: Array<Term | ArraySpread>;
    is: TypeReference;
};

export type ArraySpread = {
    type: 'ArraySpread';
    value: Term;
    location: Location | null;
};

// This is basically a type coersion?
export type Enum = {
    type: 'Enum';
    inner: Term;
    is: TypeReference;
    location: Location | null;
};

export type Switch = {
    type: 'Switch';
    term: Term;
    cases: Array<SwitchCase>;
    is: Type;
    location: Location | null;
};

export type SwitchCase = {
    pattern: Pattern;
    body: Term;
};

export type Pattern =
    | Literal
    | AliasPattern
    | RecordPattern
    | EnumPattern
    | Binding;
export type Binding = {
    type: 'Binding';
    sym: Symbol;
    location: Location | null;
};
export type AliasPattern = {
    type: 'Alias';
    name: Symbol;
    inner: Pattern;
    location: Location | null;
};
export type EnumPattern = {
    type: 'Enum';
    ref: TypeReference;
    location: Location | null;
};
export type RecordPattern = {
    type: 'Record';
    ref: TypeReference;
    items: Array<RecordPatternItem>;
    location: Location | null;
};
export type RecordPatternItem = {
    // sym: Symbol;
    ref: UserReference;
    idx: number; // is this right? hm no I need to know the subtype too
    location: Location | null;
    pattern: Pattern;
    is: Type;
};

export type Term =
    | CPSAble
    | { type: 'self'; is: Type; location: Location | null }
    // For now, we don't have subtyping
    // but when we do, we'll need like a `subrows: {[id: string]: Array<Term>}`
    | Record
    | Switch
    | Enum
    | ArrayLiteral
    | {
          type: 'Attribute';
          target: Term;
          ref: Reference;
          idx: number;
          location: Location | null;
          is: Type;
      }
    | {
          type: 'ref';
          location: Location | null;
          ref: Reference;
          is: Type;
      }
    | Var
    | Literal
    | Lambda;

export type Literal = String | Int | Boolean;
export type Int = {
    type: 'int';
    location: Location | null;
    value: number; // TODO other builtin types
    is: Type;
};
export type String = {
    type: 'string';
    text: string;
    is: Type;
    location: Location | null;
};
export type Boolean = {
    type: 'boolean';
    value: boolean;
    is: Type;
    location: Location | null;
};
export type Lambda = {
    type: 'lambda';
    location: Location | null;
    args: Array<Symbol>;
    body: Term;
    is: LambdaType;
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
    location: Location | null;
    typeVbls: Array<TypeVblDecl>;
    effectVbls: Array<number>;
    extends: Array<TypeReference>;
    items: Array<TypeReference>;
};

export type TypeDef = RecordDef | EnumDef;
export type RecordDef = {
    type: 'Record';
    unique: number;
    location: Location | null;
    typeVbls: Array<TypeVblDecl>; // TODO: kind, row etc.
    effectVbls: Array<number>;
    extends: Array<Id>;
    items: Array<Type>;
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
    if (one.type === 'ref' || two.type === 'ref') {
        if (one.type === 'ref' && two.type === 'ref') {
            return refsEqual(one.ref, two.ref);
        }
        if (one.type === 'ref' && one.ref.type === 'builtin') {
            return two.type === 'ref' && refsEqual(one.ref, two.ref);
        }
        if (two.type === 'ref' && two.ref.type === 'builtin') {
            return one.type === 'ref' && refsEqual(two.ref, one.ref);
        }
        // STOPSHIP: resolve type references
        // throw new Error(`Need to lookup types sorry`);
        return false;
    }
    if (one.type === 'var') {
        return two.type === 'var' && symbolsEqual(one.sym, two.sym);
    }
    if (one.type === 'lambda') {
        return (
            two.type === 'lambda' &&
            deepEqual(one.typeVbls, two.typeVbls) &&
            one.args.length === two.args.length &&
            one.args.every((arg, i) => typesEqual(arg, two.args[i])) &&
            one.effects.length === two.effects.length &&
            effectsMatch(one.effects, two.effects) &&
            typesEqual(one.res, two.res) &&
            typesEqual(one.rest, two.rest)
        );
    }
    return false;
};

const effectKey = (e: EffectRef) =>
    e.type === 'ref'
        ? 'ref:' + (e.ref.type === 'builtin' ? e.ref.name : e.ref.id.hash)
        : 'sym:' + e.sym.unique;

// TODO: should I allow variables to be flexible here? idk
export const effectsMatch = (
    one: Array<EffectRef>,
    two: Array<EffectRef>,
    lessAllowed: boolean = false,
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
            // console.log(`Missing`, k, one, two);
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

export type TypeReference = {
    type: 'ref';
    ref: Reference;
    location: Location | null;
    typeVbls: Array<Type>;
    effectVbls: Array<EffectRef>;
};
export type TypeRef = TypeReference | TypeVar; // will also support vbls at some point I guess

export type TypeVar = {
    type: 'var';
    sym: Symbol;
    location: Location | null;
};

export type Type = TypeRef | LambdaType;

// Here's the basics folks
// kind lambdas can't have effects, thank goodness
// So when we're resolving type declarations, we'll probably
// have to do some inferency-looking stuff for types?
export type Kind =
    | { type: 'concrete' }
    | { type: 'lambda'; arg: Kind; reult: Kind };

export type TypeVblDecl = { subTypes: Array<Id>; unique: number };

export type LambdaType = {
    type: 'lambda';
    location: Location | null;
    // TODO: this shouldn't be an array,
    // we don't have to be order dependent here.
    typeVbls: Array<TypeVblDecl>; // TODO: kind, row etc.
    effectVbls: Array<number>;
    // TODO type variables! (handled higher up I guess)
    // TODO optional arguments!
    // TODO modular implicits!
    args: Array<Type>;
    effects: Array<EffectRef>;
    rest: Type | null;
    res: Type;
};

export type RecordRow = {
    id: Identifier;
    type: Type;
};

export type RecordType = {
    type: 'Record';
    items: Array<RecordRow>;
    extends: Array<Reference>;
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
};

export const newEnv = (
    self: { name: string; type: Type },
    seed: string = 'seed',
): Env => ({
    depth: 0,
    global: {
        rng: seedrandom(seed),
        names: {},
        idNames: {},
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
    },
    local: {
        unique: 0,
        self,
        effectVbls: {},
        locals: {},
        typeVblNames: {},
        typeVbls: {},
        tmpTypeVbls: {},
    },
});

export const cloneGlobalEnv = (env: GlobalEnv): GlobalEnv => {
    return {
        rng: env.rng,
        attributeNames: { ...env.attributeNames },
        recordGroups: { ...env.recordGroups },
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
    };
};

export const subEnv = (env: Env): Env => {
    // console.log('SUB ENV', env.depth, env.local.typeVbls);
    return {
        depth: env.depth + 1,
        global: cloneGlobalEnv(env.global),
        local: {
            self: env.local.self,
            effectVbls: { ...env.local.effectVbls },
            locals: { ...env.local.locals },
            unique: env.local.unique,
            typeVbls: { ...env.local.typeVbls },
            typeVblNames: { ...env.local.typeVblNames },
            tmpTypeVbls: env.local.tmpTypeVbls,
        },
    };
};

// TODO need to resolve probably
export const getEffects = (t: Term | Let): Array<EffectRef> => {
    switch (t.type) {
        case 'Let':
            return getEffects(t.value);
        case 'Array':
            return ([] as Array<EffectRef>).concat(
                ...t.items.map((i) =>
                    getEffects(i.type === 'ArraySpread' ? i.value : i),
                ),
            );
        case 'apply':
            return dedupEffects(
                (t.target.is as LambdaType).effects.concat(
                    ...t.args.map(getEffects),
                ),
            );
        case 'sequence':
            return ([] as Array<EffectRef>).concat(...t.sts.map(getEffects));
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
            return getEffects(t.inner);
        case 'Switch':
            return getEffects(t.term).concat(
                ...t.cases.map((c) => getEffects(c.body)),
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
        case 'raise':
            return term.args.forEach((t) => walkTerm(t, handle));
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
    }
};
