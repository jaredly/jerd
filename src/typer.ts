import { Expression, Type as ParseType } from './parser';
import deepEqual from 'fast-deep-equal';

export type Id = { hash: string; size: number; pos: number };
export type Reference =
    | { type: 'builtin'; name: string }
    | { type: 'user'; id: Id };

export type Symbol = { name: string; unique: number };

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
          cases: Array<{
              constr: number; // the index
              args: Array<Symbol>;
              k: Symbol;
              body: Term;
          }>;
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
    self: null | {
        name: string;
        type: Type;
    };
    // builtinTypes: { [key: string]: Type };
    locals: { [key: string]: { sym: Symbol; type: Type } };
    typeVbls: { [key: string]: Array<TypeConstraint> }; // constraints
};

export type TypeConstraint = {
    smaller: Type; // the sub type
    larger: Type;
};

export type Env = {
    // oh here's where we would do kind?
    // like args n stuff?
    global: GlobalEnv;
    local: LocalEnv;
};

export const newEnv = (): Env => ({
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

        self: null,
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
        typeVbls: {},
    },
});

// TODO come up with a sourcemappy notion of "unique location in the parse tree"
// that doesn't mean keeping track of column & line.
// because we'll need it in a web ui.

// `t` is being passed as an argument to a function that expects `target`.
// Is it valid?
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
            // Is target allowed to have more, or fewer effects than t?
            // more. t's effects list must be a strict subset.
            t.effects.forEach((e) => {
                if (!target.effects.some((ef) => deepEqual(ef, e))) {
                    throw new Error(
                        `Argument has effect ${JSON.stringify(
                            e,
                        )}, which was not expected.`,
                    );
                }
            });
            for (let i = 0; i < t.args.length; i++) {
                if (!fitsExpectation(t.args[i], target.args[i])) {
                    return false;
                }
            }
            return true;
    }
};

export const typeType = (env: Env, type: ParseType): Type => {
    if (!type) {
        return null;
    }
    // console.log('TYPEING TYPE', type);
    switch (type.type) {
        case 'id': {
            if (env.global.typeNames[type.text] != null) {
                return {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id: env.global.typeNames[type.text],
                    },
                };
            }
            if (env.global.builtinTypes[type.text] != null) {
                return {
                    type: 'ref',
                    ref: { type: 'builtin', name: type.text },
                };
            }
            throw new Error(`Unknown type "${type.text}"`);
        }

        case 'lambda':
            // console.log('LAM', type);
            return {
                type: 'lambda',
                args: type.args.map((a) => typeType(env, a)),
                effects: type.effects.map((id) => {
                    if (!env.global.effectNames[id.text]) {
                        throw new Error(`No effect named ${id.text}`);
                    }
                    return {
                        type: 'user',
                        id: {
                            hash: env.global.effectNames[id.text],
                            pos: 0,
                            size: 1,
                        },
                    };
                }), // TODO what um. Do all Terms need an effect?
                // like, these are the effects ... of executing this term?
                // and then a lamhda has none?
                // ok so just apply and sequence I should think, right?
                // the other ones don't?
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
        case 'string':
            return {
                type: 'string',
                text: expr.text,
                is: { type: 'ref', ref: { type: 'builtin', name: 'string' } },
            };
        case 'block': {
            // TODO: maybeSeq?
            const inner = expr.items.map((s) => typeExpr(env, s));
            return {
                type: 'sequence',
                sts: inner,
                effects: dedupEffects([].concat(...inner.map(getEffects))),
                is: inner[inner.length - 1].is,
            };
        }
        case 'ops': {
            // ok, left associative, right? I think so.
            let left: Term = typeExpr(env, expr.first);
            expr.rest.forEach(({ op, right }) => {
                const is = env.global.builtins[op];
                if (!is) {
                    throw new Error(`Unexpected boolean op ${op}`);
                }
                if (is.type !== 'lambda') {
                    throw new Error(`${op} is not a function`);
                }
                if (is.args.length !== 2) {
                    throw new Error(`${op} is not a binary function`);
                }
                const rarg = typeExpr(env, right);
                if (!fitsExpectation(left.is, is.args[0])) {
                    throw new Error(`first arg to ${op} wrong type`);
                }
                if (!fitsExpectation(rarg.is, is.args[1])) {
                    throw new Error(`second arg to ${op} wrong type`);
                }
                left = {
                    type: 'apply',
                    target: {
                        type: 'ref',
                        ref: { type: 'builtin', name: op },
                        is,
                    },
                    effects: is.effects,
                    argsEffects: getEffects(left).concat(getEffects(rarg)),
                    args: [left, rarg],
                    is: is.res,
                };
            });
            return left;
        }
        case 'apply': {
            let target = typeExpr(env, expr.target);
            for (let args of expr.args) {
                const { is } = target;
                if (is.type !== 'lambda') {
                    throw new Error(
                        `Trying to call ${JSON.stringify(
                            expr.target,
                        )} but its a ${is.type} : ${JSON.stringify(is)}`,
                    );
                }
                if (is.args.length !== args.length) {
                    throw new Error(
                        `Wrong number of arguments ${JSON.stringify(
                            expr,
                            null,
                            2,
                        )}`,
                    );
                }
                const effects = [];
                const resArgs = [];
                args.forEach((term, i) => {
                    const t = typeExpr(env, term, is.args[i]);
                    if (!fitsExpectation(t.is, is.args[i])) {
                        throw new Error(
                            `Wrong type for arg ${i}: \n${JSON.stringify(
                                t.is,
                                null,
                                2,
                            )}, expected \n${JSON.stringify(
                                is.args[i],
                                null,
                                2,
                            )} : ${JSON.stringify(expr.location)}`,
                        );
                    }
                    resArgs.push(t);
                    effects.push(...getEffects(t));
                });

                target = {
                    type: 'apply',
                    target,
                    args: resArgs,
                    effects: is.effects,
                    argsEffects: effects,
                    is: is.res,
                };
            }
            return target;
        }
        case 'id': {
            if (env.local.self && expr.text === env.local.self.name) {
                return {
                    type: 'self',
                    is: env.local.self.type,
                };
            }
            if (env.local.locals[expr.text]) {
                const { sym, type } = env.local.locals[expr.text];
                return {
                    type: 'var',
                    sym,
                    is: type,
                };
            }
            if (env.global.names[expr.text]) {
                const id = env.global.names[expr.text];
                const term = env.global.terms[id.hash];
                return {
                    type: 'ref',
                    ref: {
                        type: 'user',
                        id,
                    },
                    is: term.is,
                };
            }
            if (env.global.builtins[expr.text]) {
                const type = env.global.builtins[expr.text];
                return {
                    type: 'ref',
                    is: type,
                    ref: { type: 'builtin', name: expr.text },
                };
            }
            console.log(env.local.locals);
            throw new Error(`Undefined identifier ${expr.text}`);
        }
        case 'lambda': {
            // ok here's where we do a little bit of inference?
            // or do I just say "all is specified, we can infer in the IDE"?
            const inner = subEnv(env);
            const args = [];
            const argst = [];
            expr.args.forEach(({ id, type: rawType }) => {
                const type = typeType(env, rawType);
                const unique = Object.keys(inner.local.locals).length;
                const sym = { name: id.text, unique };
                inner.local.locals[id.text] = { sym, type };
                args.push(sym);
                argst.push(type);
            });
            const body = typeExpr(inner, expr.body);
            if (expr.rettype) {
                if (!fitsExpectation(body.is, typeType(env, expr.rettype))) {
                    throw new Error(
                        `Return type of lambda doesn't fit type declaration`,
                    );
                }
            }
            return {
                type: 'lambda',
                args,
                body,
                is: {
                    type: 'lambda',
                    effects: getEffects(body),
                    args: argst,
                    rest: null,
                    res: body.is,
                },
            };
        }
        case 'handle': {
            const target = typeExpr(env, expr.target);
            // console.log(target);
            let effName = expr.cases[0].name;
            if (expr.cases.some((c) => c.name.text !== effName.text)) {
                throw new Error(
                    `Can't handle multiple effects in one handler.`,
                );
            }
            const effId = env.global.effectNames[effName.text];
            if (!effId) {
                throw new Error(`No effect named ${effName.text}`);
            }
            const constrs = env.global.effects[effId];
            const effect: Reference = {
                type: 'user',
                id: { hash: effId, size: 1, pos: 0 },
            };
            const effects = getEffects(target).filter(
                (e) => !deepEqual(effect, e),
            );
            const otherEffects = effects.concat(effect);
            // const otherEffects = effects.slice();

            if (target.is.type !== 'lambda') {
                throw new Error(`Target of a handle must be a lambda`);
            }
            if (target.is.args.length !== 0) {
                throw new Error(`Target of a handle must take 0 args`);
            }
            const targetReturn = target.is.res;

            // but then, effects found in the bodies also get added.
            // so we'll need some deduping
            const inner = subEnv(env);
            const unique = Object.keys(inner.local.locals).length;
            const sym = { name: expr.pure.arg.text, unique };
            inner.local.locals[expr.pure.arg.text] = {
                sym,
                type: targetReturn,
            };
            const pure = typeExpr(inner, expr.pure.body);

            effects.push(...getEffects(pure));

            const cases = [];
            expr.cases.forEach((kase) => {
                const idx = env.global.effectConstructors[kase.constr.text].idx;
                const constr = constrs[idx];
                const inner = subEnv(env);
                const args = kase.args.map((id, i) => {
                    const unique = Object.keys(inner.local.locals).length;
                    const sym = { name: id.text, unique };
                    inner.local.locals[id.text] = {
                        sym,
                        type: constr.args[i],
                    };
                    return sym;
                });
                const unique = Object.keys(inner.local.locals).length;
                const k = { name: kase.k.text, unique };
                inner.local.locals[k.name] = {
                    sym: k,
                    type: {
                        type: 'lambda',
                        args: isVoid(constr.ret) ? [] : [constr.ret],
                        effects: otherEffects,
                        rest: null,
                        res: targetReturn,
                    },
                };

                const body = typeExpr(inner, kase.body);
                if (!deepEqual(body.is, pure.is)) {
                    throw new Error(
                        `All case arms must have the same return type`,
                    );
                }

                cases.push({
                    constr: idx,
                    args,
                    k,
                    body,
                });
            });

            return {
                type: 'handle',
                target,
                effect,
                effects: dedupEffects(effects),
                cases,
                pure: { arg: sym, body: pure },
                is: pure.is,
            };
        }
        case 'raise': {
            // um id vs constr?
            const effid = env.global.effectConstructors[expr.constr.text];
            if (!effid) {
                throw new Error(`Unknown effect ${expr.constr.text}`);
            }
            const eff = env.global.effects[effid.hash][effid.idx];
            // if (eff.type !== 'lambda') {
            //     throw new Error(
            //         `Non-lambda effect constructor ${JSON.stringify(eff)}`,
            //     );
            // }
            if (eff.args.length !== expr.args.length) {
                throw new Error(`Effect constructor wrong number of args`);
            }
            const ref: Reference = {
                type: 'user',
                id: { hash: effid.hash, size: 1, pos: 0 },
            };
            const argsEffects: Array<Reference> = [];
            const args = [];
            expr.args.forEach((term, i) => {
                const t = typeExpr(env, term, eff.args[i]);
                if (!fitsExpectation(t.is, eff.args[i])) {
                    throw new Error(
                        `Wrong type for arg ${i}: ${JSON.stringify(
                            t.is,
                        )}, expected ${JSON.stringify(eff.args[i])}`,
                    );
                }
                args.push(t);
                argsEffects.push(...getEffects(t));
            });

            return {
                type: 'raise',
                ref,
                idx: effid.idx,
                argsEffects,
                effects: [ref],
                args,
                is: eff.ret,
            };
        }
        default:
            let _x: never = expr;
            throw new Error(`Unexpected parse type ${(expr as any).type}`);
    }
};

const isVoid = (x: Type) => {
    return (
        x.type === 'ref' && x.ref.type === 'builtin' && x.ref.name === 'void'
    );
};

const dedupEffects = (effects) => {
    const used = {};
    return effects.filter((e) => {
        const k = e.type === 'builtin' ? e.name : e.id.hash;
        if (used[k]) {
            return false;
        }
        used[k] = true;
        return true;
    });
};

const maybeSeq = (env: Env, sts): Term => {
    if (sts.length === 1) {
        return typeExpr(env, sts[0]);
    }
    const inner = sts.map((s) => typeExpr(env, s));
    return {
        type: 'sequence',
        sts: inner,
        effects: [].concat(...inner.map(getEffects)),
        is: inner[inner.length - 1].is,
    };
};

const int: Type = { type: 'ref', ref: { type: 'builtin', name: 'int' } };

export default typeExpr;
