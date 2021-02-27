import {
    Env,
    Type,
    Term,
    Reference,
    dedupEffects,
    getEffects,
    Symbol,
    Case,
    LambdaType,
    Let,
    typesEqual,
    refsEqual,
    symbolsEqual,
} from './types';
import { Expression, Location, Statement } from './parser';
import { subEnv } from './types';
import typeType, { newTypeVbl, walkType } from './typeType';
import { showType } from './unify';
import { void_, bool } from './preset';
import { items } from './printer';

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

// const maybeSeq = (env: Env, sts): Term => {
//     if (sts.length === 1) {
//         return typeExpr(env, sts[0]);
//     }
//     const inner = sts.map((s) => typeExpr(env, s));
//     return {
//         type: 'sequence',
//         sts: inner,
//         effects: [].concat(...inner.map(getEffects)),
//         is: inner[inner.length - 1].is,
//     };
// };

// TODO type-directed resolution pleaseeeee
const resolveIdentifier = (
    env: Env,
    text: string,
    location: Location,
): Term | null => {
    if (env.local.locals[text]) {
        const { sym, type } = env.local.locals[text];
        return {
            type: 'var',
            location,
            sym,
            is: type,
        };
    }
    if (env.local.self && text === env.local.self.name) {
        return {
            location,
            type: 'self',
            is: env.local.self.type,
        };
    }
    if (env.global.names[text]) {
        const id = env.global.names[text];
        const term = env.global.terms[id.hash];
        // console.log(`${text} : its a global: ${showType(term.is)}`);
        return {
            type: 'ref',
            location,
            ref: {
                type: 'user',
                id,
            },
            is: term.is,
        };
    }
    if (env.global.builtins[text]) {
        const type = env.global.builtins[text];
        return {
            type: 'ref',
            location,
            is: type,
            ref: { type: 'builtin', name: text },
        };
    }
    return null;
};

const subtTypeVars = (t: Type, vbls: { [unique: number]: Type }): Type => {
    return (
        walkType(t, (t) => {
            if (t.type === 'var') {
                if (vbls[t.sym.unique]) {
                    // console.log('SUBST', vbls[t.sym.unique]);
                    return vbls[t.sym.unique];
                }
                return t;
            }
            if (t.type === 'ref') {
                if (t.ref.type === 'builtin') {
                    return null;
                }
                throw new Error(`Not support yet ${JSON.stringify(t)}`);
            }
            return null;
        }) || t
    );
};

const applyTypeVariables = (env: Env, type: Type, vbls: Array<Type>): Type => {
    if (type.type === 'lambda') {
        const t: LambdaType = type as LambdaType;

        const mapping: { [unique: number]: Type } = {};
        if (vbls.length !== t.typeVbls.length) {
            console.log('the ones', t.typeVbls);
            throw new Error(
                `Wrong number of type variables: ${vbls.length} : ${t.typeVbls.length}`,
            );
        }
        vbls.forEach((typ, i) => {
            mapping[t.typeVbls[i]] = typ;
        });
        return {
            ...type,
            typeVbls: [], // TODO allow partial application!
            args: type.args.map((t) => subtTypeVars(t, mapping)),
            // TODO effects with type vars!
            rest: null, // TODO rest args
            res: subtTypeVars(type.res, mapping),
        };
    }
    // should I go full-on whatsit? maybe not yet.
    throw new Error(`Can't apply variables to non-lambdas just yet`);
    // return type;
};

// const typeStatement = (env: Env, expr: Statement): Term | Let => {
//     if (expr.type === 'define') {
//         return {
//             type: 'Let',
//             binding: expr.id.text,
//         };
//     } else {
//         return typeExpr(env, expr);
//     }
// };

const typeExpr = (env: Env, expr: Expression, hint?: Type | null): Term => {
    switch (expr.type) {
        case 'int':
            return {
                type: 'int',
                value: expr.value,
                location: expr.location,
                is: {
                    type: 'ref',
                    location: expr.location,
                    ref: { type: 'builtin', name: 'int' },
                },
            };
        case 'string':
            return {
                type: 'string',
                text: expr.text,
                location: expr.location,
                is: {
                    location: expr.location,
                    type: 'ref',
                    ref: { type: 'builtin', name: 'string' },
                },
            };
        case 'block': {
            const inner: Array<Term | Let> = [];
            let innerEnv = env;
            for (let item of expr.items) {
                if (item.type === 'define') {
                    const value = typeExpr(innerEnv, item.expr);
                    innerEnv = subEnv(innerEnv);
                    // innerEnv.local.locals

                    const type = item.ann
                        ? typeType(innerEnv, item.ann)
                        : value.is;
                    if (
                        item.ann &&
                        fitsExpectation(env, value.is, type) === false
                    ) {
                        throw new Error(
                            `Value of const doesn't match type annotation. ${showType(
                                value.is,
                            )}, expected ${showType(type)}`,
                        );
                    }
                    const unique = Object.keys(innerEnv.local.locals).length;
                    const sym: Symbol = { name: item.id.text, unique };
                    innerEnv.local.locals[item.id.text] = { sym, type };
                    inner.push({
                        type: 'Let',
                        location: item.location,
                        // location: expr.location,
                        binding: sym,
                        value,
                        is: void_,
                    });
                } else {
                    inner.push(typeExpr(innerEnv, item));
                }
            }
            // TODO: maybeSeq?
            // const inner = expr.items.map((s) => typeExpr(env, s));
            return {
                type: 'sequence',
                sts: inner,
                location: expr.location,
                effects: dedupEffects(
                    ([] as Array<Reference>).concat(...inner.map(getEffects)),
                ),
                is: inner[inner.length - 1].is,
            };
        }
        case 'If': {
            const cond = typeExpr(env, expr.cond);
            const yes = typeExpr(env, expr.yes);
            const no = expr.no ? typeExpr(env, expr.no) : null;
            if (fitsExpectation(env, cond.is, bool) !== true) {
                throw new Error(`Condition of if must be a boolean`);
            }

            if (fitsExpectation(env, yes.is, no ? no.is : void_) !== true) {
                throw new Error(`Branches of if dont agree`);
            }
            return {
                type: 'if',
                cond,
                yes,
                no,
                location: expr.location,
                effects: dedupEffects([
                    ...getEffects(cond),
                    ...getEffects(yes),
                    ...(no ? getEffects(no) : []),
                ]),
                is: yes.is,
            };
        }
        case 'ops': {
            // ok, left associative, right? I think so.
            let left: Term = typeExpr(env, expr.first);
            expr.rest.forEach(({ op, right }) => {
                let is = env.global.builtins[op];
                if (!is) {
                    throw new Error(`Unexpected binary op ${op}`);
                }
                if (is.type !== 'lambda') {
                    throw new Error(`${op} is not a function`);
                }
                if (is.args.length !== 2) {
                    throw new Error(`${op} is not a binary function`);
                }
                const rarg = typeExpr(env, right);

                if (is.typeVbls.length === 1) {
                    if (!typesEqual(env, left.is, rarg.is)) {
                        throw new Error(
                            `Binops must have same-typed arguments`,
                        );
                    }
                    is = applyTypeVariables(env, is, [left.is]) as LambdaType;
                }

                if (fitsExpectation(env, left.is, is.args[0]) !== true) {
                    throw new Error(`first arg to ${op} wrong type`);
                }
                if (fitsExpectation(env, rarg.is, is.args[1]) !== true) {
                    throw new Error(`second arg to ${op} wrong type`);
                }
                left = {
                    type: 'apply',
                    location: null,
                    target: {
                        location: null,
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
            for (let { args, typevbls } of expr.args) {
                if (typevbls.length) {
                    // HERMMM This might be illegal.
                    // or rather, doing it like this
                    // does weird things to the pretty-printing end.
                    // Because we lose the `<T>`.
                    target = {
                        ...target,
                        is: applyTypeVariables(
                            env,
                            target.is,
                            typevbls.map((t) => typeType(env, t)),
                        ) as LambdaType,
                    };
                }

                let is: LambdaType;
                if (target.is.type === 'var') {
                    const argTypes: Array<Type> = [];
                    for (let i = 0; i < args.length; i++) {
                        argTypes.push(newTypeVbl(env));
                    }
                    is = {
                        type: 'lambda',
                        typeVbls: [],
                        location: null,
                        args: argTypes,
                        effects: [], // STOPSHIP add effect vbls
                        res: newTypeVbl(env),
                        rest: null, // STOPSHIP(rest)
                    };
                    if (fitsExpectation(env, is, target.is) !== true) {
                        throw new Error('we literally just created this');
                    }
                } else {
                    if (target.is.type !== 'lambda') {
                        throw new Error(
                            `Trying to call ${JSON.stringify(
                                expr.target,
                            )} but its a ${target.is.type} : ${JSON.stringify(
                                target.is,
                            )}`,
                        );
                    }
                    if (target.is.args.length !== args.length) {
                        throw new Error(
                            `Wrong number of arguments ${JSON.stringify(
                                expr,
                                null,
                                2,
                            )}`,
                        );
                    }
                    is = target.is;
                }

                const effects: Array<Reference> = [];
                const resArgs: Array<Term> = [];
                args.forEach((term, i) => {
                    const t = typeExpr(env, term, is.args[i]);
                    if (fitsExpectation(env, t.is, is.args[i]) !== true) {
                        throw new Error(
                            `Wrong type for arg ${i}: \nFound: ${showType(
                                t.is,
                            )}\nbut expected ${showType(
                                is.args[i],
                            )} : ${JSON.stringify(expr.location)}`,
                        );
                    }
                    resArgs.push(t);
                    effects.push(...getEffects(t));
                });

                target = {
                    type: 'apply',
                    // STOPSHIP(sourcemap): this should be better
                    location: target.location,
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
            const term = resolveIdentifier(env, expr.text, expr.location);
            if (term != null) {
                // console.log(`${expr.text} : ${showType(term.is)}`);
                return term;
            }
            console.log(env.local.locals);
            throw new Error(`Undefined identifier ${expr.text}`);
        }
        case 'lambda': {
            const typeInner = expr.typevbls.length ? subEnv(env) : env;
            const typeVbls: Array<number> = [];
            expr.typevbls.forEach((id) => {
                const unique = Object.keys(typeInner.local.typeVbls).length;
                const sym: Symbol = { name: id.text, unique };
                typeInner.local.typeVbls[id.text] = sym;
                typeVbls.push(sym.unique);
            });
            // expr.effects.map(id => )
            // console.log('Lambda type vbls', typeVbls);

            // ok here's where we do a little bit of inference?
            // or do I just say "all is specified, we can infer in the IDE"?
            const inner = subEnv(typeInner);
            const args: Array<Symbol> = [];
            const argst: Array<Type> = [];

            expr.args.forEach(({ id, type: rawType }) => {
                const type = typeType(typeInner, rawType);
                const unique = Object.keys(inner.local.locals).length;
                const sym: Symbol = { name: id.text, unique };
                inner.local.locals[id.text] = { sym, type };
                args.push(sym);
                argst.push(type);
            });
            const body = typeExpr(inner, expr.body);
            if (expr.rettype) {
                if (
                    fitsExpectation(
                        typeInner,
                        body.is,
                        typeType(typeInner, expr.rettype),
                    ) !== true
                ) {
                    throw new Error(
                        `Return type of lambda doesn't fit type declaration`,
                    );
                }
            }
            const effects = getEffects(body);
            if (expr.effects != null) {
                const declaredEffects: Array<Reference> = expr.effects.map(
                    (effName) => {
                        const effId = env.global.effectNames[effName.text];
                        if (!effId) {
                            throw new Error(`No effect named ${effName.text}`);
                        }
                        return {
                            type: 'user',
                            id: { hash: effId, size: 1, pos: 0 },
                        };
                    },
                );
                if (declaredEffects.length === 0 && effects.length !== 0) {
                    throw new Error(
                        `Function is declared as pure, but is not. ${effects.length} effects found.`,
                    );
                }
                for (let inner of effects) {
                    if (
                        !declaredEffects.some((item) => refsEqual(item, inner))
                    ) {
                        throw new Error(
                            `Function declared with explicit effects, but without ${JSON.stringify(
                                inner,
                            )}`,
                        );
                    }
                }
                effects.push(...declaredEffects);
            }

            // console.log('VBLS', typeVbls);
            return {
                type: 'lambda',
                args,
                body,
                location: expr.location,
                is: {
                    type: 'lambda',
                    location: expr.location,
                    typeVbls,
                    effects: dedupEffects(effects),
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
                (e) => !refsEqual(effect, e),
            );
            const otherEffects = effects.concat(effect);

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

            const cases: Array<Case> = [];
            expr.cases.forEach((kase) => {
                const idx = env.global.effectConstructors[kase.constr.text].idx;
                const constr = constrs[idx];
                const inner = subEnv(env);
                const args = (kase.args || []).map((id, i) => {
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
                        location: kase.location,
                        typeVbls: [],
                        args: isVoid(constr.ret) ? [] : [constr.ret],
                        effects: otherEffects,
                        rest: null,
                        res: targetReturn,
                    },
                };

                const body = typeExpr(inner, kase.body);
                if (!typesEqual(env, body.is, pure.is)) {
                    throw new Error(
                        `All case arms must have the same return type: ${showType(
                            body.is,
                        )} ${showType(pure.is)}`,
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
                location: expr.location,
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
            const args: Array<Term> = [];
            expr.args.forEach((term, i) => {
                const t = typeExpr(env, term, eff.args[i]);
                if (fitsExpectation(env, t.is, eff.args[i]) !== true) {
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
                location: expr.location,
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

const int: Type = {
    type: 'ref',
    ref: { type: 'builtin', name: 'int' },
    location: null,
};

type UnificationResult = true | false | Symbol;

// `t` is being passed as an argument to a function that expects `target`.
// Is it valid?
export const fitsExpectation = (
    env: Env | null,
    t: Type,
    target: Type,
): UnificationResult => {
    if (t.type === 'var' && env != null) {
        // if (env.local.typeVbls[])
        if (typesEqual(env, t, target)) {
            return true;
        }
        // if (target.type === 'var')
        if (!env.local.tmpTypeVbls[t.sym.unique]) {
            throw new Error(
                `Explicit type variable ${t.sym.name}#${
                    t.sym.unique
                } can't unify with ${showType(target)}`,
            );
        }
        env.local.tmpTypeVbls[t.sym.unique].push({
            type: 'smaller-than',
            other: target,
        });
        // TODO check if it's obviously broken
        return true;
    }
    if (target.type === 'var' && env != null) {
        if (!env.local.tmpTypeVbls[target.sym.unique]) {
            throw new Error(
                `Unable to unify ${showType(t)} ${
                    t.location
                } with type variable ${target.sym.name}#${target.sym.unique} ${
                    t.location
                }`,
            );
        }
        env.local.tmpTypeVbls[target.sym.unique].push({
            type: 'larger-than',
            other: t,
        });
        // TODO check if it's obviously broken
        return true;
    }
    if (t.type !== target.type) {
        // um there's a chance we'd need to resolve something? maybe?
        return false;
    }
    switch (t.type) {
        case 'var':
            if (target.type === 'var') {
                if (!symbolsEqual(t.sym, target.sym)) {
                    return target.sym;
                }
                return true;
            }
            console.log('env is null I guess');
            return false;
        case 'ref':
            return env ? typesEqual(env, t, target) : false;
        case 'lambda':
            if (target.type !== 'lambda') {
                return false;
            }
            // unless there's optional arguments going on here, stay tuned?
            // I guess. maybe.
            if (target.args.length !== t.args.length) {
                console.log('arglen');
                return false;
            }
            const res = fitsExpectation(env, t.res, target.res);
            if (res !== true) {
                console.log('resoff', t.res, target.res);
                return res;
            }
            // Is target allowed to have more, or fewer effects than t?
            // more. t's effects list must be a strict subset.
            t.effects.forEach((e) => {
                if (!target.effects.some((ef) => refsEqual(ef, e))) {
                    throw new Error(
                        `Argument has effect ${JSON.stringify(
                            e,
                        )}, which was not expected.`,
                    );
                }
            });
            for (let i = 0; i < t.args.length; i++) {
                const arg = fitsExpectation(env, t.args[i], target.args[i]);
                if (arg !== true) {
                    console.log('Arg is off', i);
                    console.log(t.args[i], target.args[i]);
                    return arg;
                }
            }
            return true;
    }
};

export default typeExpr;
