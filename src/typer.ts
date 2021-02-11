import { Expression, Type as ParseType } from './parser';
import deepEqual from 'fast-deep-equal';

export type Id = { hash: string; size: number; pos: number };
export type Reference =
    | { type: 'builtin'; name: string }
    | { type: 'user'; id: Id };

export type Symbol = { name: string; unique: number };

export type Term =
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
    | { type: 'text'; text: string; is: Type }
    | {
          type: 'lambda';
          args: Array<Symbol>;
          body: Term;
          is: Type;
      }
    | {
          type: 'sequence';
          sts: Array<Term>;
          is: Type;
      }
    | {
          type: 'apply';
          target: Term;
          args: Array<Term>;
          is: Type; // this matches the return type of target
      };

export type Type =
    | {
          type: 'ref';
          ref: Reference;
      }
    | {
          type: 'lambda';
          // TODO optional arguments!
          args: Array<Type>;
          rest: Type | null;
          res: Type;
      };

export type Env = {
    names: { [key: string]: Id };
    terms: { [key: string]: Term };
    builtins: { [key: string]: Type };

    typeNames: { [key: string]: Id };
    builtinTypes: { [key: string]: number };
    types: { [key: string]: number };
    // oh here's where we would do kind?
    // like args n stuff?

    // builtinTypes: { [key: string]: Type };
    locals: { [key: string]: { sym: Symbol; type: Type } };
};

export const newEnv = (): Env => ({
    names: {},
    terms: {},
    builtins: {},
    builtinTypes: {},
    typeNames: {},
    types: {},
    locals: {},
});
export const subEnv = (env: Env): Env => ({
    names: { ...env.names },
    terms: { ...env.terms },
    builtins: { ...env.builtins },
    typeNames: { ...env.typeNames },
    builtinTypes: { ...env.builtinTypes },
    types: { ...env.types },
    locals: { ...env.locals },
});

// TODO come up with a sourcemappy notion of "unique location in the parse tree"
// that doesn't mean keeping track of column & line.
// because we'll need it in a web ui.

const fitsExpectation = (t: Type, target: Type) => {
    if (t.type !== target.type) {
        // um there's a chance we'd need to resolve something? maybe?
        return;
    }
    switch (t.type) {
        case 'ref':
            return deepEqual(t, target);
        case 'lambda':
            if (target.type !== 'lambda') {
                return false;
            }
            // unless there's optional arguments going on here, stay tuned?
            // I guess. maybe.
            if (target.args.length !== t.args.length) {
                return false;
            }
            if (!fitsExpectation(t.res, target.res)) {
                return false;
            }
            for (let i = 0; i < t.args.length; i++) {
                if (!fitsExpectation(t.args[i], target.args[i])) {
                    return false;
                }
            }
            return true;
    }
};

const typeType = (env: Env, type: ParseType): Type => {
    switch (type.type) {
        case 'id': {
            if (env.typeNames[type.text] != null) {
                return {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id: env.typeNames[type.text],
                    },
                };
            }
            if (env.builtinTypes[type.text] != null) {
                return {
                    type: 'ref',
                    ref: { type: 'builtin', name: type.text },
                };
            }
            throw new Error(`Unknown type "${type.text}"`);
        }

        case 'lambda':
            return {
                type: 'lambda',
                args: type.args.map((a) => typeType(env, a)),
                res: typeType(env, type.res),
                rest: null,
            };
    }
};

const typeExpr = (env: Env, expr: Expression, hint?: Type | null): Term => {
    switch (expr.type) {
        case 'int':
            return {
                type: 'int',
                value: expr.value,
                is: { type: 'ref', ref: { type: 'builtin', name: 'int' } },
            };
        case 'text':
            return {
                type: 'text',
                text: expr.text,
                is: { type: 'ref', ref: { type: 'builtin', name: 'text' } },
            };
        case 'apply': {
            const target = typeExpr(env, expr.terms[0]);
            const { is } = target;
            if (is.type !== 'lambda') {
                throw new Error(
                    `Trying to call ${JSON.stringify(expr)} but its a ${
                        is.type
                    }`,
                );
            }
            if (is.args.length !== expr.terms.length - 1) {
                throw new Error(`Wrong number of arguments`);
            }
            const args = [];
            expr.terms.slice(1).forEach((term, i) => {
                const t = typeExpr(env, term, is.args[i]);
                if (!fitsExpectation(t.is, is.args[i])) {
                    throw new Error(
                        `Wrong type for arg ${i}: ${JSON.stringify(
                            t.is,
                        )}, expected ${JSON.stringify(is.args[i])}`,
                    );
                }
                args.push(t);
            });

            return {
                type: 'apply',
                target,
                args,
                is: is.res,
            };
        }
        case 'id':
            if (env.names[expr.text]) {
                const id = env.names[expr.text];
                const term = env.terms[id.hash];
                // oh wait also check locals, TODO
                return {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id,
                    },
                    is: term.is,
                };
            }
            if (env.builtins[expr.text]) {
                const type = env.builtins[expr.text];
                return {
                    type: 'ref',
                    is: type,
                    ref: { type: 'builtin', name: expr.text },
                };
            }
            if (env.locals[expr.text]) {
                const { sym, type } = env.locals[expr.text];
                return {
                    type: 'var',
                    sym,
                    is: type,
                };
            }
            console.log(env.locals);
            throw new Error(`Undefined identifier ${expr.text}`);
        case 'lambda': {
            // ok here's where we do a little bit of inference?
            // or do I just say "all is specified, we can infer in the IDE"?
            const inner = subEnv(env);
            const args = [];
            const argst = [];
            expr.args.forEach(({ id, type: rawType }) => {
                const type = typeType(env, rawType);
                const unique = Object.keys(inner.locals).length;
                const sym = { name: id.text, unique };
                inner.locals[id.text] = { sym, type };
                args.push(sym);
                argst.push(type);
            });
            const body = maybeSeq(inner, expr.sts);
            return {
                type: 'lambda',
                args,
                body,
                is: {
                    type: 'lambda',
                    args: argst,
                    rest: null,
                    res: body.is,
                },
            };
        }
        default:
            throw new Error(`Unexpected parse type ${expr.type}`);
    }
};

const maybeSeq = (env: Env, sts): Term => {
    if (sts.length === 1) {
        return typeExpr(env, sts[0]);
    }
    const inner = sts.map((s) => typeExpr(env, s));
    return {
        type: 'sequence',
        sts: inner,
        is: inner[inner.length - 1].is,
    };
};

const int: Type = { type: 'ref', ref: { type: 'builtin', name: 'int' } };

export default typeExpr;
