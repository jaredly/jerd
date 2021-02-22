// Types for the typed tree

export type Id = { hash: string; size: number; pos: number };
export type Reference =
    | { type: 'builtin'; name: string }
    | { type: 'user'; id: Id };

export type Symbol = { name: string; unique: number };

export type Case = {
    constr: number; // the index
    args: Array<Symbol>;
    k: Symbol;
    body: Term;
};

export type CPSAble =
    | {
          type: 'raise';
          ref: Reference;
          idx: number;
          args: Array<Term>;
          argsEffects: Array<Reference>;
          effects: Array<Reference>;
          is: Type;
      }
    | {
          type: 'handle';
          target: Term; // this must needs be typed as a LambdaType
          // These are the target's effects minus the one that is handled here.
          effects: Array<Reference>;
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
          type: 'sequence';
          sts: Array<Term>;
          effects: Array<Reference>;
          is: Type;
      }
    | {
          type: 'apply';
          target: Term;
          argsEffects: Array<Reference>;
          effects: Array<Reference>;
          args: Array<Term>;
          is: Type; // this matches the return type of target
      };

export type Term =
    | CPSAble
    | { type: 'self'; is: Type }
    | {
          type: 'ref';
          ref: Reference;
          is: Type;
      }
    | {
          type: 'var';
          sym: Symbol;
          is: Type;
      }
    | {
          type: 'int';
          value: number; // TODO other builtin types
          is: Type;
      }
    | { type: 'string'; text: string; is: Type }
    | {
          type: 'lambda';
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
- hm yeah what if I just added generic functions first
- and then added (generic) records?
- or even just records
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

export type TypeRef =
    | {
          type: 'ref';
          ref: Reference;
      }
    | { type: 'var'; sym: Symbol };

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
    // TODO type variables! (handled higher up I guess)
    // TODO optional arguments!
    // TODO modular implicits!
    args: Array<Type>;
    effects: Array<Reference>;
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
    typeVbls: { [key: string]: Array<TypeConstraint> }; // constraints
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
        locals: {},
        typeVbls: {},
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
        locals: { ...env.local.locals },
        unique: env.local.unique,
        typeVbls: env.local.typeVbls,
    },
});

export const getEffects = (t: Term): Array<Reference> => {
    if (t.type === 'apply') {
        return dedupEffects(t.argsEffects.concat(t.effects));
    } else if (t.type === 'sequence') {
        return t.effects;
    } else if (t.type === 'raise') {
        return dedupEffects(t.effects.concat(t.argsEffects));
    } else {
        return [];
    }
};

export const dedupEffects = (effects: Array<Reference>) => {
    const used: { [key: string]: boolean } = {};
    return effects.filter((e) => {
        const k = e.type === 'builtin' ? e.name : e.id.hash;
        if (used[k]) {
            return false;
        }
        used[k] = true;
        return true;
    });
};
