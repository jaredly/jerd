import { Expression } from './parser';
import deepEqual from 'fast-deep-equal';

export type Id = { hash: string; size: number; pos: number };
export type Reference =
    | { type: 'builtin'; name: string }
    | { type: 'user'; id: Id };

export type Term =
    | {
          type: 'ref';
          ref: Reference;
          is: Type;
      }
    | {
          type: 'var';
          name: string;
          unique: number;
          is: Type;
      }
    | {
          type: 'int';
          value: number; // TODO other builtin types
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
};

export const newEnv = (): Env => ({ names: {}, terms: {}, builtins: {} });

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

const typeExpr = (env: Env, expr: Expression, hint?: Type | null): Term => {
    switch (expr.type) {
        case 'int':
            return {
                type: 'int',
                value: expr.value,
                is: { type: 'ref', ref: { type: 'builtin', name: 'int' } },
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
                    throw new Error(`Wrong type for arg ${i}`);
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
            throw new Error(`Undefined identifier ${expr.text}`);
    }
};

export default typeExpr;
