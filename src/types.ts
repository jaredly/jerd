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

export type TypeRef =
    | {
          type: 'ref';
          ref: Reference;
      }
    | { type: 'var'; sym: Symbol };

export type Type = TypeRef | LambdaType;

export type LambdaType = {
    type: 'lambda';
    // TODO type variables!
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
    // builtinTypes: { [key: string]: Type };
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
