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
    EffectRef,
    getAllSubTypes,
    Record,
    Id,
    RecordDef,
    idsEqual,
    RecordBase,
    UserReference,
} from './types';
import { Expression, Identifier, Location, Statement } from '../parsing/parser';
import { subEnv, effectsMatch } from './types';
import typeType, { newTypeVbl, walkType } from './typeType';
import { showType, fitsExpectation } from './unify';
import { void_, bool } from './preset';
import { items, printToString } from '../printing/printer';
import { refToPretty, symToPretty } from '../printing/printTsLike';
import { idName } from './env';

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

const expandEffectVars = (
    effects: Array<EffectRef>,
    vbls: { [unique: number]: Array<EffectRef> },
    nullIfUnchanged: boolean,
): null | Array<EffectRef> => {
    let changed = false;
    const result: Array<EffectRef> = [];
    effects.forEach((eff) => {
        if (eff.type === 'var' && vbls[eff.sym.unique] != null) {
            result.push(...vbls[eff.sym.unique]);
            changed = true;
        } else {
            result.push(eff);
        }
    });
    if (changed || !nullIfUnchanged) {
        return result;
    }
    return null;
};

const subtEffectVars = (
    t: Type,
    vbls: { [unique: number]: Array<EffectRef> },
): Type => {
    return (
        walkType(t, (t) => {
            if (t.type === 'lambda') {
                let changed = false;
                const effects = expandEffectVars(t.effects, vbls, true);
                if (effects != null) {
                    return {
                        ...t,
                        effects,
                    };
                }
            }
            return null;
        }) || t
    );
};

const subtTypeVars = (t: Type, vbls: { [unique: number]: Type }): Type => {
    return (
        walkType(t, (t) => {
            if (t.type === 'var') {
                if (vbls[t.sym.unique]) {
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

export const showLocation = (loc: Location | null) => {
    if (!loc) {
        return `<no location>`;
    }
    return `${loc.start.line}:${loc.start.column}-${loc.end.line}:${loc.end.column}`;
};

export const applyEffectVariables = (
    env: Env,
    type: Type,
    vbls: Array<EffectRef>,
): Type => {
    if (type.type === 'lambda') {
        const t: LambdaType = type as LambdaType;

        const mapping: { [unique: number]: Array<EffectRef> } = {};

        if (type.effectVbls.length !== 1) {
            throw new Error(
                `Multiple effect variables not yet supported: ${showType(
                    type,
                )} : ${showLocation(type.location)}`,
            );
        }

        mapping[type.effectVbls[0]] = vbls;

        return {
            ...type,
            effectVbls: [],
            effects: expandEffectVars(type.effects, mapping, false)!,
            args: type.args.map((t) => subtEffectVars(t, mapping)),
            // TODO effects with type vars!
            rest: null, // TODO rest args
            res: subtEffectVars(type.res, mapping),
        };
    }
    // should I go full-on whatsit? maybe not yet.
    throw new Error(`Can't apply variables to non-lambdas just yet`);
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
            // STOPSHIP CHECK HERE
            const subs = t.typeVbls[i].subTypes;
            for (let sub of subs) {
                if (!hasSubType(env, typ, sub)) {
                    throw new Error(`Expected a subtype of ${idName(sub)}`);
                }
            }
            // if (hasSubType(typ, ))
            mapping[t.typeVbls[i].unique] = typ;
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
};

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
                        binding: sym,
                        value,
                        is: void_,
                    });
                } else {
                    inner.push(typeExpr(innerEnv, item));
                }
            }
            return {
                type: 'sequence',
                sts: inner,
                location: expr.location,
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
                    args: [left, rarg],
                    is: is.res,
                };
            });
            return left;
        }
        case 'WithSuffix': {
            // So, among the denormalizations that we have,
            // the fact that references copy over the type of the thing
            // being referenced might be a little odd.
            let target = typeExpr(env, expr.target);
            for (let suffix of expr.suffixes) {
                if (suffix.type === 'Apply') {
                    const { args, typevbls, effectVbls } = suffix;
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

                    const prevEffects =
                        target.is.type === 'lambda' ? target.is.effects : [];
                    const mappedVbls: null | Array<EffectRef> = effectVbls
                        ? effectVbls.map((id) => resolveEffect(env, id))
                        : null;
                    if (mappedVbls != null) {
                        const pre = target.is;
                        target = {
                            ...target,
                            is: applyEffectVariables(
                                env,
                                target.is,
                                mappedVbls,
                            ) as LambdaType,
                        };
                        // console.log(
                        //     `Mapped effect variables - ${showType(
                        //         pre,
                        //     )} ---> ${showType(target.is)}`,
                        // );
                    }
                    const postEffects =
                        target.is.type === 'lambda' ? target.is.effects : [];

                    let is: LambdaType;
                    if (target.is.type === 'var') {
                        const argTypes: Array<Type> = [];
                        for (let i = 0; i < args.length; i++) {
                            argTypes.push(newTypeVbl(env));
                        }
                        is = {
                            type: 'lambda',
                            typeVbls: [],
                            effectVbls: [],
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
                                )} but its a ${
                                    target.is.type
                                } : ${JSON.stringify(target.is)}`,
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

                    const resArgs: Array<Term> = [];
                    args.forEach((term, i) => {
                        const t: Term = typeExpr(env, term, is.args[i]);
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
                    });

                    target = {
                        type: 'apply',
                        // STOPSHIP(sourcemap): this should be better
                        location: target.location,
                        hadAllVariableEffects:
                            effectVbls != null &&
                            prevEffects.length > 0 &&
                            prevEffects.filter((e) => e.type === 'ref')
                                .length === 0,
                        target,
                        args: resArgs,
                        is: is.res,
                    };
                } else if (suffix.type === 'Attribute') {
                    // OOOOKKK.
                    // So here we have some choices, right?
                    // first we find the object this is likely to be attached to
                    // ermmm yeah maybe this is where constraint solving becomes a thing?
                    // which, ugh
                    // So yeah, when parsing, if there are multiple things with the
                    // same name, tough beans I'm sorry.
                    // Oh maybe allow it to be "fully qualified"?
                    // like `.<Person>name`? or `.Person::name`?
                    // yeah that could be cool.
                    if (!env.global.attributeNames[suffix.id.text]) {
                        throw new Error(
                            `Unknown attribute name ${suffix.id.text}`,
                        );
                    }
                    const { id, idx } = env.global.attributeNames[
                        suffix.id.text
                    ];
                    const t = env.global.types[idName(id)];
                    if (t.type !== 'Record') {
                        throw new Error(`${idName(id)} is not a record type`);
                    }
                    const ref: Reference = { type: 'user', id };
                    if (
                        !typesEqual(env, target.is, {
                            type: 'ref',
                            ref,
                            location: null,
                        }) &&
                        !hasSubType(env, target.is, id)
                    ) {
                        // }
                        // if (
                        //     !fitsExpectation(env, target.is, {
                        //         type: 'ref',
                        //         ref,
                        //         location: null,
                        //     })
                        // ) {
                        throw new Error(
                            `Expression at ${showLocation(
                                suffix.location,
                            )} is not a ${idName(id)} or its supertype`,
                        );
                    }

                    target = {
                        type: 'Attribute',
                        target,
                        location: suffix.location,
                        idx,
                        ref,
                        is: t.items[idx],
                    };
                }
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
            throw new Error(
                `Identifier "${expr.text}" at ${showLocation(
                    expr.location,
                )} hasn't been defined anywhere.`,
            );
        }
        case 'lambda': {
            const typeInner =
                expr.typevbls.length || expr.effvbls.length ? subEnv(env) : env;
            const typeVbls: Array<{ unique: number; subTypes: Array<Id> }> = [];
            expr.typevbls.forEach(({ id, subTypes }) => {
                const unique = Object.keys(typeInner.local.typeVbls).length;
                const sym: Symbol = { name: id.text, unique };
                const st = subTypes.map((id) => {
                    const t = env.global.typeNames[id.text];
                    if (!t) {
                        throw new Error(
                            `Unknown subtype ${id.text} at ${showLocation(
                                id.location,
                            )}`,
                        );
                    }
                    return t;
                });
                typeInner.local.typeVblNames[id.text] = sym;
                typeInner.local.typeVbls[sym.unique] = {
                    subTypes: st,
                };
                typeVbls.push({ unique: sym.unique, subTypes: st });
            });

            // TODO: how do I do multiple effect vbls, with explicit calling?
            // b/c, for the general "e", it can take in any extra things that
            // aren't specified. But if there are two variables (e and f, for example),
            // how would you indicate which are allocated to which?
            // maybe {Aewsome, {Sauce, Ome}}? like I guess
            const effectVbls: Array<number> = [];
            expr.effvbls.forEach((id) => {
                const unique = Object.keys(typeInner.local.effectVbls).length;
                const sym: Symbol = { name: id.text, unique };
                typeInner.local.effectVbls[id.text] = sym;
                effectVbls.push(sym.unique);
                // console.log('VBL', sym);
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
                const declaredEffects: Array<EffectRef> = expr.effects.map(
                    (effName) => resolveEffect(typeInner, effName),
                );
                if (declaredEffects.length === 0 && effects.length !== 0) {
                    throw new Error(
                        `Function is declared as pure, but is not. ${effects.length} effects found.`,
                    );
                }
                if (!effectsMatch(declaredEffects, effects, true)) {
                    throw new Error(
                        `Function declared with explicit effects, but missing at least one: ${declaredEffects
                            .map((e) =>
                                e.type === 'ref'
                                    ? printToString(refToPretty(e.ref), 100)
                                    : printToString(symToPretty(e.sym), 100),
                            )
                            .join(',')}`,
                    );
                }
                effects.push(...declaredEffects);
            }

            return {
                type: 'lambda',
                args,
                body,
                location: expr.location,
                is: {
                    type: 'lambda',
                    location: expr.location,
                    typeVbls,
                    effectVbls,
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
                (e) => e.type !== 'ref' || !refsEqual(effect, e.ref),
            );
            const otherEffects = effects.concat({ type: 'ref', ref: effect });

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

            const cases: Array<Case> = [];
            expr.cases.forEach((kase) => {
                const idx =
                    env.global.effectConstructors[
                        kase.name.text + '.' + kase.constr.text
                    ].idx;
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
                        effectVbls: [],
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
                cases,
                pure: { arg: sym, body: pure },
                is: pure.is,
            };
        }
        case 'raise': {
            const key = expr.name.text + '.' + expr.constr.text;
            const effid = env.global.effectConstructors[key];
            if (!effid) {
                throw new Error(`Unknown effect ${key}`);
            }
            const eff = env.global.effects[effid.hash][effid.idx];
            if (eff.args.length !== expr.args.length) {
                throw new Error(`Effect constructor wrong number of args`);
            }
            const ref: Reference = {
                type: 'user',
                id: { hash: effid.hash, size: 1, pos: 0 },
            };
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
            });

            return {
                type: 'raise',
                location: expr.location,
                ref,
                idx: effid.idx,
                args,
                is: eff.ret,
            };
        }
        case 'Record': {
            const names: { [key: string]: { i: number; id: Id | null } } = {};

            const subTypes: {
                [id: string]: {
                    covered: boolean;
                    spread: Term | null;
                    rows: Array<Term | null>;
                };
            } = {};
            const subTypeTypes: { [id: string]: RecordDef } = {};

            let base: RecordBase;
            let subTypeIds: Array<Id>;
            let is: Type;

            if (env.local.typeVblNames[expr.id.text]) {
                const sym = env.local.typeVblNames[expr.id.text];
                const t = env.local.typeVbls[sym.unique];
                base = {
                    type: 'Variable',
                    var: env.local.typeVblNames[expr.id.text],
                };
                subTypeIds = [];
                t.subTypes.forEach((id) => {
                    const t = env.global.types[idName(id)];
                    subTypeIds.push(...getAllSubTypes(env.global, t));
                });
                is = { type: 'var', sym, location: expr.id.location };
            } else {
                const id = env.global.typeNames[expr.id.text];
                if (!id) {
                    throw new Error(
                        `No Record type ${expr.id.text} at ${showLocation(
                            expr.location,
                        )}`,
                    );
                }
                const t = env.global.types[idName(id)];
                const ref: Reference = { type: 'user', id };
                const rows: Array<Term | null> = new Array(t.items.length);

                // So we can detect missing items
                rows.fill(null);
                base = { rows, ref, type: 'Concrete' };
                env.global.recordGroups[idName(id)].forEach(
                    (name, i) => (names[name] = { i, id: null }),
                );

                // TODO: deduplicate
                subTypeIds = getAllSubTypes(env.global, t);
                is = { type: 'ref', ref, location: expr.id.location };
            }

            let spread = null;

            subTypeIds.forEach((id) => {
                const t = env.global.types[idName(id)];
                subTypeTypes[idName(id)] = t;
                const rows = new Array(t.items.length);
                rows.fill(null);
                subTypes[idName(id)] = {
                    covered: false,
                    spread: null,
                    rows,
                };
                env.global.recordGroups[idName(id)].forEach(
                    (name, i) => (names[name] = { i, id }),
                );
            });

            // How to indicate what spreads are covered?
            // and how are we codegenning this?
            // like with go, we won't be spreading, we'll
            // be specifying each item
            // ok, I think we need to

            // const names = env.global.recordGroups[idName(id)];
            expr.rows.forEach((row) => {
                if (row.type === 'Spread') {
                    const v = typeExpr(env, row.value);
                    if (base.type === 'Concrete') {
                        if (
                            typesEqual(env, v.is, {
                                type: 'ref',
                                ref: base.ref,
                                location: null,
                            })
                        ) {
                            Object.keys(subTypes).forEach(
                                (k) => (subTypes[k].covered = true),
                            );
                            spread = v;
                            return;
                        }
                    } else if (
                        v.is.type === 'var' &&
                        symbolsEqual(v.is.sym, base.var)
                    ) {
                        Object.keys(subTypes).forEach(
                            (k) => (subTypes[k].covered = true),
                        );
                        spread = v;
                        return;
                    }
                    // ummm I kindof want to
                    for (let id of subTypeIds) {
                        if (
                            typesEqual(env, v.is, {
                                type: 'ref',
                                ref: { type: 'user', id },
                                location: null,
                            })
                        ) {
                            subTypes[idName(id)].spread = v;
                            subTypes[idName(id)].covered = true;
                            getAllSubTypes(
                                env.global,
                                subTypeTypes[idName(id)],
                            ).forEach((sid) => {
                                subTypes[idName(sid)].covered = true;
                            });
                            return;
                        }
                    }
                    throw new Error(`Invalid spread ${showType(v.is)}`);
                }

                if (!names[row.id.text]) {
                    throw new Error(
                        `Unexpected attrbute name ${
                            row.id.text
                        } at ${showLocation(row.id.location)}`,
                    );
                }
                const { i, id } = names[row.id.text];
                let rowsToMod =
                    id == null && base.type === 'Concrete'
                        ? base.rows
                        : subTypes[idName(id!)].rows;
                const recordType =
                    id == null && base.type === 'Concrete'
                        ? env.global.types[idName(base.ref.id)]
                        : subTypeTypes[idName(id!)];
                if (rowsToMod[i] != null) {
                    throw new Error(
                        `Multiple values provided for ${
                            names[i]
                        } at ${showLocation(row.id.location)}`,
                    );
                }
                const v = typeExpr(env, row.value);
                rowsToMod[i] = v;
                if (!fitsExpectation(env, v.is, recordType.items[i])) {
                    throw new Error(
                        `Invalid type for attribute ${
                            row.id.text
                        } at ${showLocation(
                            row.value.location,
                        )}. Expected ${showType(
                            recordType.items[i],
                        )}, got ${showType(v.is)}`,
                    );
                }
            });
            // TODO: once I have subtyping, this will have to be more clever.
            // of course, `rows` will also need to be more clever.
            if (spread == null && base.type === 'Concrete') {
                const r = base.ref;
                base.rows.forEach((row, i) => {
                    if (row == null) {
                        throw new Error(
                            `Record missing attribute "${
                                env.global.recordGroups[idName(r.id)][i]
                            }" at ${showLocation(expr.location)}`,
                        );
                    }
                });
            }
            Object.keys(subTypes).forEach((id) => {
                if (!subTypes[id].covered) {
                    subTypes[id].rows.forEach((row, i) => {
                        if (row == null) {
                            throw new Error(
                                `Record missing attribute from subtype ${id} "${
                                    env.global.recordGroups[id][i]
                                }" at ${showLocation(expr.location)}`,
                            );
                        }
                    });
                }
            });
            return {
                type: 'Record',
                location: expr.location,
                base,
                // ref,
                is,
                spread,
                subTypes,
                // rows,
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

export const resolveEffect = (env: Env, id: Identifier): EffectRef => {
    // TODO abstract this into "resolveEffect" probably
    if (env.local.effectVbls[id.text]) {
        return {
            type: 'var',
            sym: env.local.effectVbls[id.text],
        };
    }
    if (!env.global.effectNames[id.text]) {
        throw new Error(`No effect named ${id.text}`);
    }
    return {
        type: 'ref',
        ref: {
            type: 'user',
            id: {
                hash: env.global.effectNames[id.text],
                pos: 0,
                size: 1,
            },
        },
    };
};

export const hasSubType = (env: Env, type: Type, id: Id) => {
    if (type.type === 'var') {
        const found = env.local.typeVbls[type.sym.unique];
        for (let sid of found.subTypes) {
            if (idsEqual(id, sid)) {
                return true;
            }
            const t = env.global.types[idName(sid)];
            const allSubTypes = getAllSubTypes(env.global, t);
            if (allSubTypes.find((x) => idsEqual(id, x)) != null) {
                return true;
            }
        }
    }
    if (type.type !== 'ref' || type.ref.type === 'builtin') {
        return false;
    }
    if (idsEqual(type.ref.id, id)) {
        return true;
    }
    const t = env.global.types[idName(type.ref.id)];
    const allSubTypes = getAllSubTypes(env.global, t);
    return allSubTypes.find((x) => idsEqual(id, x)) != null;
};

export default typeExpr;
