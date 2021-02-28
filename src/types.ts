// Types for the typed tree

import { Location } from './parser';
import deepEqual from 'fast-deep-equal';

export const refsEqual = (one: Reference, two: Reference) => {
    return one.type === 'builtin'
        ? two.type === 'builtin' && one.name === two.name
        : two.type === 'user' && idsEqual(one.id, two.id);
};

export const idsEqual = (one: Id, two: Id): boolean =>
    one.hash === two.hash && one.pos === two.pos && one.size === two.size;

export type Id = { hash: string; size: number; pos: number };
export type Reference =
    | { type: 'builtin'; name: string }
    | { type: 'user'; id: Id };

export type Symbol = { name: string; unique: number };

export const symbolsEqual = (one: Symbol, two: Symbol) =>
    one.unique === two.unique;

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
          argsEffects: Array<EffectRef>;
          effects: Array<EffectRef>;
          is: Type;
      }
    | {
          type: 'handle';
          location: Location | null;
          target: Term; // this must needs be typed as a LambdaType
          // These are the target's effects minus the one that is handled here.
          effects: Array<EffectRef>;
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
          effects: Array<EffectRef>;
          is: Type;
      }
    | {
          type: 'sequence';
          location: Location | null;
          sts: Array<Term | Let>;
          effects: Array<EffectRef>;
          is: Type;
      }
    | {
          type: 'apply';
          location: Location | null;
          target: Term;
          argsEffects: Array<EffectRef>;
          effects: Array<EffectRef>;
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
export type Term =
    | CPSAble
    | { type: 'self'; is: Type; location: Location | null }
    | {
          type: 'ref';
          location: Location | null;
          ref: Reference;
          is: Type;
      }
    | Var
    | {
          type: 'int';
          location: Location | null;
          value: number; // TODO other builtin types
          is: Type;
      }
    | { type: 'string'; text: string; is: Type; location: Location | null }
    | {
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

export type TypeExpr = {
    inner: Type;
    applied: Array<TypeExpr>;
    paramed: Array<TypeExpr>;
};
// START HERE: and maybe try to typecheck some of records?
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

export const typesEqual = (
    env: Env,
    one: Type | null,
    two: Type | null,
): boolean => {
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
        throw new Error(`Need to lookup types sorry`);
    }
    if (one.type === 'var') {
        return two.type === 'var' && symbolsEqual(one.sym, two.sym);
    }
    if (one.type === 'lambda') {
        return (
            two.type === 'lambda' &&
            deepEqual(one.typeVbls, two.typeVbls) &&
            one.args.length === two.args.length &&
            one.args.every((arg, i) => typesEqual(env, arg, two.args[i])) &&
            one.effects.length === two.effects.length &&
            effectsMatch(one.effects, two.effects) &&
            typesEqual(env, one.res, two.res) &&
            typesEqual(env, one.rest, two.rest)
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

export type TypeRef =
    | {
          type: 'ref';
          ref: Reference;
          location: Location | null;
      }
    | { type: 'var'; sym: Symbol; location: Location | null };

export type Type = TypeRef | LambdaType;

// Here's the basics folks
// kind lambdas can't have effects, thank goodness
// So when we're resolving type declarations, we'll probably
// have to do some inferency-looking stuff for types?
export type Kind =
    | { type: 'concrete' }
    | { type: 'lambda'; arg: Kind; reult: Kind };

export type LambdaType = {
    type: 'lambda';
    location: Location | null;
    // TODO: this shouldn't be an array,
    // we don't have to be order dependent here.
    typeVbls: Array<number>; // TODO: kind, row etc.
    effectVbls: Array<number>;
    // TODO type variables! (handled higher up I guess)
    // TODO optional arguments!
    // TODO modular implicits!
    args: Array<Type>;
    effects: Array<EffectRef>;
    rest: Type | null;
    res: Type;
};

export type GlobalEnv = {
    names: { [key: string]: Id };
    terms: { [key: string]: Term };
    builtins: { [key: string]: Type };

    typeNames: { [key: string]: Id };
    builtinTypes: { [key: string]: number };
    types: { [key: string]: number };

    effectNames: { [key: string]: string };
    effectConstructors: { [key: string]: { hash: string; idx: number } };
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
    typeVbls: { [key: string]: Symbol }; // TODO: this will include kind or row constraint
    effectVbls: { [key: string]: Symbol };
    tmpTypeVbls: { [key: string]: Array<TypeConstraint> }; // constraints
    // manual type variables can't have constriaints, right? or can they?
    // I can figure that out later.
};

export type TypeConstraint =
    | {
          type: 'smaller-than';
          other: Type; // the super type
      }
    | { type: 'larger-than'; other: Type }; // the sub type

export type Env = {
    // oh here's where we would do kind?
    // like args n stuff?
    global: GlobalEnv;
    local: LocalEnv;
};

export const newEnv = (self: { name: string; type: Type }): Env => ({
    global: {
        names: {},
        terms: {},
        builtins: {},
        builtinTypes: {},
        typeNames: {},
        types: {},

        effectNames: {},
        effectConstructors: {},
        effects: {},
    },
    local: {
        unique: 0,
        self,
        effectVbls: {},
        locals: {},
        typeVbls: {},
        tmpTypeVbls: {},
    },
});

export const subEnv = (env: Env): Env => ({
    global: {
        names: { ...env.global.names },
        terms: { ...env.global.terms },
        builtins: { ...env.global.builtins },
        typeNames: { ...env.global.typeNames },
        builtinTypes: { ...env.global.builtinTypes },
        types: { ...env.global.types },
        effectNames: { ...env.global.effectNames },
        effectConstructors: { ...env.global.effectConstructors },
        effects: { ...env.global.effects },
    },
    local: {
        self: env.local.self,
        effectVbls: { ...env.local.effectVbls },
        locals: { ...env.local.locals },
        unique: env.local.unique,
        typeVbls: { ...env.local.typeVbls },
        tmpTypeVbls: env.local.tmpTypeVbls,
    },
});

export const getEffects = (t: Term | Let): Array<EffectRef> => {
    switch (t.type) {
        case 'Let':
            return getEffects(t.value);
        case 'apply':
            return dedupEffects(t.argsEffects.concat(t.effects));
        case 'sequence':
            return t.effects;
        case 'raise':
            return dedupEffects(t.effects.concat(t.argsEffects));
        case 'if':
            return t.effects;
        case 'int':
        case 'string':
        case 'lambda':
        case 'self':
        case 'ref':
        case 'var':
            return [];
        case 'handle':
            return dedupEffects(
                getEffects(t.pure.body).concat(
                    ...t.cases.map((k) => getEffects(k.body)),
                ),
            );
        default:
            let _x: never = t;
            throw new Error('Unhandled term');
    }
};

export const dedupEffects = (effects: Array<EffectRef>) => {
    const used: { [key: string]: boolean } = {};
    return effects.filter((e) => {
        const k = effectKey(e);
        if (used[k]) {
            return false;
        }
        used[k] = true;
        return true;
    });
};
