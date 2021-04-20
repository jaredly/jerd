// General thing

import {
    Term,
    Env,
    Type,
    getEffects,
    Let,
    Var,
    EffectRef,
    EffectReference,
    Symbol,
    typesEqual,
    refsEqual,
    EffectHandler,
    Reference,
} from '../../typing/types';
import { pureFunction, void_ } from '../../typing/preset';

import { Expr, callExpression, OutputOptions, Loc, Arg } from './types';
import {
    printLambdaBody,
    sequenceToBlock,
    sortedExplicitEffects,
} from './lambda';
import { printTerm } from './term';
import { blockStatement, ifStatement, iffe } from './utils';
import { idName, refName } from '../../typing/env';
import { LocatedError } from '../../typing/errors';
import { showType } from '../../typing/unify';
import { printHandle } from './handle';

export type EffectHandlers = { [id: string]: { expr: Expr; sym: Symbol } };

export const termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    effectHandlers: EffectHandlers,
    done: Expr,
): Expr => {
    return _termToAstCPS(env, opts, term, effectHandlers, done);
};

export const effectHandlerType = (env: Env, eff: EffectReference): Type => {
    return {
        type: 'effect-handler',
        ref: eff.ref,
        location: null,
    };
};

export const effectConstructorType = (
    env: Env,
    eff: EffectReference,
    constr: { args: Array<Type>; ret: Type },
): Type => {
    // const constr = env.global.effects[refName(eff.ref)][idx];
    return pureFunction(
        constr.args.concat([
            pureFunction(
                [
                    effectHandlerType(env, eff),
                    ...(typesEqual(constr.ret, void_) ? [] : [constr.ret]),
                ],
                void_,
            ),
        ]),
        void_,
        // constr.ret,
    );
};

// cps: t.Identifier // is it the done fn, or the thing I want you to bind to?
const _termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    effectHandlers: EffectHandlers,
    done: Expr,
): Expr => {
    //     // No effects in the term
    if (!getEffects(term).length && term.type !== 'Let') {
        if (done.is.type !== 'lambda') {
            throw new Error('done not a lambda');
        }
        const effects = done.is.args
            .map((arg) =>
                arg.type === 'effect-handler'
                    ? { type: 'ref', ref: arg.ref, location: null }
                    : null,
            )
            .filter(Boolean) as Array<EffectReference>;
        const doneHandlerTypes = effects.map((eff) =>
            effectHandlerType(env, eff),
        );
        return {
            type: 'apply',
            target: done,
            is: void_,
            targetType: pureFunction([...doneHandlerTypes, term.is], void_),
            concreteType: pureFunction([...doneHandlerTypes, term.is], void_),
            args: [
                ...effects.map((eff) => effectHandlers[refName(eff.ref)].expr),
                printTerm(env, opts, term),
            ],
            loc: null,
        };
    }
    switch (term.type) {
        case 'handle':
            return printHandle(env, opts, term, effectHandlers, done);
        case 'Let': {
            return termToAstCPS(env, opts, term.value, effectHandlers, {
                type: 'lambda',
                note: 'let-lambda',
                args: [
                    ...sortedExplicitEffects(getEffects(term.value)).map(
                        (eff) => ({
                            sym: effectHandlers[refName(eff.ref)].sym,
                            type: effectHandlerType(env, eff),
                            loc: term.location,
                        }),
                    ),
                    {
                        sym: term.binding,
                        type: term.value.is,
                        loc: term.location,
                    },
                ],
                body: {
                    type: 'apply',
                    target: done,
                    is: void_,
                    targetType: pureFunction([], void_),
                    concreteType: pureFunction([], void_),
                    args: [],
                    loc: null,
                },
                res: void_,
                loc: term.location,
                is: pureFunction(
                    [
                        ...sortedExplicitEffects(
                            getEffects(term.value),
                        ).map((eff) => effectHandlerType(env, eff)),
                        term.is,
                    ],
                    void_,
                ),
            });
        }
        case 'raise': {
            if (term.args.some((a) => getEffects(a).length > 0)) {
                throw new LocatedError(
                    term.location,
                    'Raise arguments have effects. Call liftEffects first',
                );
            }
            if (term.ref.type === 'builtin') {
                throw new Error('Cannot raise builtins');
            }
            const constr = env.global.effects[idName(term.ref.id)][term.idx];
            const t = pureFunction(
                constr.args.concat([pureFunction([constr.ret], void_)]),
                constr.ret,
            );
            const handler = effectHandlers[idName(term.ref.id)];
            if (!handler) {
                throw new Error(`No handler for ${idName(term.ref.id)}`);
            }
            if (done.is.type !== 'lambda') {
                throw new Error(
                    `CPS continuation function is not a lambda ${done.is.type}`,
                );
            }
            const doneEffects = done.is.args
                .map((arg) =>
                    arg.type === 'effect-handler'
                        ? { type: 'ref', ref: arg.ref, location: null }
                        : null,
                )
                .filter(Boolean) as Array<EffectReference>;
            if (
                doneEffects.length !== 1 ||
                !refsEqual(doneEffects[0].ref, term.ref)
            ) {
                const effRef: EffectReference = { type: 'ref', ref: term.ref };
                const hsym = { name: 'handler', unique: env.local.unique++ };
                const vsym = { name: 'valuez', unique: env.local.unique++ };
                const effT = effectHandlerType(env, effRef);
                done = {
                    type: 'lambda',
                    note: 'raise-done',
                    args: [
                        { sym: hsym, type: effT, loc: term.location },
                        ...(typesEqual(constr.ret, void_)
                            ? []
                            : [
                                  {
                                      sym: vsym,
                                      type: constr.ret,
                                      loc: term.location,
                                  },
                              ]),
                    ],
                    is: pureFunction([effT], void_),
                    loc: term.location,
                    res: void_,
                    body: {
                        type: 'apply',
                        target: done,
                        args: [
                            ...(doneEffects.map((eff) =>
                                refsEqual(eff.ref, effRef.ref)
                                    ? {
                                          type: 'var',
                                          sym: hsym,
                                          loc: term.location,
                                      }
                                    : effectHandlers[refName(eff.ref)].expr,
                            ) as Array<Expr>),
                            ...((typesEqual(constr.ret, void_)
                                ? []
                                : [
                                      {
                                          type: 'var',
                                          sym: vsym,
                                          loc: term.location,
                                          is: constr.ret,
                                      },
                                  ]) as Array<Expr>),
                        ],
                        is: void_,
                        loc: term.location,
                        targetType: done.is,
                        concreteType: done.is,
                    },
                };
            }
            return {
                type: 'apply',
                target: {
                    type: 'tupleAccess',
                    idx: term.idx,
                    loc: term.location,
                    target: handler.expr,
                    is: effectConstructorType(
                        env,
                        { type: 'ref', ref: { type: 'user', id: term.ref.id } },
                        constr,
                    ),
                },
                args: term.args
                    .map((t) => printTerm(env, opts, t))
                    // STOPSHIP: if this isn't (theEffectHandler, theValue)
                    // we might need to wrap it (for example if it expects more effects than that)
                    .concat([
                        maybeWrapForEffects(
                            env,
                            [{ type: 'ref', ref: term.ref } as EffectReference],
                            effectHandlers,
                            done,
                            term.location,
                        ),
                    ]),
                is: void_,
                targetType: t,
                loc: term.location,
                concreteType: t,
            };
        }
        case 'if': {
            if (done.is.type !== 'lambda') {
                throw new Error('done not a lambda');
            }
            const effects = done.is.args
                .map((arg) =>
                    arg.type === 'effect-handler'
                        ? { type: 'ref', ref: arg.ref, location: null }
                        : null,
                )
                .filter(Boolean) as Array<EffectReference>;
            const doneHandlerTypes = effects.map((eff) =>
                effectHandlerType(env, eff),
            );

            if (getEffects(term.cond).length > 0) {
                throw new Error(
                    `If condition has effects. Call liftEffects first.`,
                );
            }

            const cond = printTerm(env, opts, term.cond);

            return iffe(
                blockStatement(
                    [
                        ifStatement(
                            cond,
                            printLambdaBody(
                                env,
                                opts,
                                term.yes,
                                effectHandlers,
                                done,
                            ),
                            term.no
                                ? printLambdaBody(
                                      env,
                                      opts,
                                      term.no,
                                      effectHandlers,
                                      done,
                                  )
                                : callExpression(
                                      done,
                                      pureFunction(doneHandlerTypes, void_),
                                      void_,
                                      [
                                          ...effects.map(
                                              (eff) =>
                                                  effectHandlers[
                                                      refName(eff.ref)
                                                  ].expr,
                                          ),
                                      ],
                                      term.location,
                                  ),
                            term.location,
                        ),
                    ],
                    term.location,
                ),
                void_,
            );
        }
        case 'apply': {
            if (getEffects(term.target).length) {
                throw new Error(`target affects in an apply, sorry`);
            }
            const u = env.local.unique++;

            if (term.target.is.type !== 'lambda') {
                throw new Error(`Target is not a function`);
            }
            const argTypes = term.target.is.args;
            const args = term.args.map((arg, i) => {
                return maybeWrapPureFunction(env, arg, argTypes[i]);
            });

            const argsEffects = ([] as Array<EffectRef>).concat(
                ...term.args.map(getEffects),
            );

            const explicitEffects = sortedExplicitEffects(
                term.target.is.effects,
            );
            const effectHandlersToPass = explicitEffects.map((eff) => {
                if (!effectHandlers[refName(eff.ref)]) {
                    console.log(effectHandlers);
                    throw new LocatedError(
                        term.location,
                        `No handler for ${refName(
                            eff.ref,
                        )} while calling ${showType(env, term.target.is)}`,
                    );
                }
                return effectHandlers[refName(eff.ref)].expr;
            });
            const effectHandlerTypes = explicitEffects.map((eff) => {
                // return  effectHandlers[refName(eff.ref)]
                return effectHandlerType(env, eff);
                // return void_; // STOPSHIP
            });

            if (term.args.some((t) => getEffects(t).length > 0)) {
                throw new Error(
                    `Apply has args effects. Call liftEffects first.`,
                );
            }
            let target = printTerm(env, opts, term.target);
            if (term.hadAllVariableEffects) {
                target = {
                    type: 'effectfulOrDirect',
                    target,
                    effectful: true,
                    loc: target.loc,
                    is: term.target.is,
                };
            }
            return callExpression(
                target,
                {
                    ...term.originalTargetType,
                    args: term.originalTargetType.args.concat([
                        ...effectHandlerTypes,
                        pureFunction([term.is], void_),
                    ]),
                    res: void_,
                },
                term.is,
                args
                    .map((arg, i) => printTerm(env, opts, arg))
                    .concat([
                        ...effectHandlersToPass,
                        maybeWrapForEffects(
                            env,
                            explicitEffects,
                            effectHandlers,
                            done,
                            term.location,
                        ),
                    ]),
                target.loc,
            );
        }
        case 'sequence':
            return iffe(
                sequenceToBlock(env, opts, term, effectHandlers, done),
                term.is,
            );
        // throw new Error(
        //     `Sequence encountered. This should probably be a lambda body?`,
        // );
        default:
            // console.log('ELSE', term.type);
            return callExpression(
                done,
                pureFunction([term.is], void_),
                void_,
                [printTerm(env, opts, term)],
                term.location,
            );
    }
};

export const maybeWrapForEffects = (
    env: Env,
    expected: Array<EffectReference>,
    effectHandlers: EffectHandlers,
    term: Expr,
    loc: Loc,
): Expr => {
    if (term.is.type !== 'lambda') {
        throw new LocatedError(term.loc, `Term must be a lambda.`);
    }
    const hasValue =
        term.is.args[term.is.args.length - 1].type !== 'effect-handler';
    // We expect done to be "effect handlers" + "result value"
    const effects: Array<Reference> = (hasValue
        ? term.is.args.slice(0, -1)
        : term.is.args
    )
        .filter((arg) => arg.type === 'effect-handler')
        .map((arg) => (arg as EffectHandler).ref);
    if (effects.length !== term.is.args.length - (hasValue ? 1 : 0)) {
        console.log(term.is.args, effects);
        throw new LocatedError(
            loc || term.loc,
            `Compiler error; done expects something other than effect handlers`,
        );
    }
    if (
        effects.length === expected.length &&
        !effects.some((ref, i) => !refsEqual(ref, expected[i].ref))
    ) {
        return term;
    }
    const valueType = hasValue ? term.is.args[term.is.args.length - 1] : null;
    const valueSym: Symbol | null = hasValue
        ? { name: `value`, unique: env.local.unique++ }
        : null;
    // console.log(effects, expected);
    const handlers: { [key: string]: Expr } = {};
    const args: Array<Arg> = expected
        .map((eff) => {
            const sym: Symbol = {
                name: `handle${refName(eff.ref)}`,
                unique: env.local.unique++,
            };
            const ty = effectHandlerType(env, eff);
            handlers[refName(eff.ref)] = { type: 'var', sym, loc, is: ty };
            return {
                sym,
                type: ty,
                loc: loc,
            };
        })
        .concat(hasValue ? [{ sym: valueSym!, type: valueType!, loc }] : []);

    return {
        type: 'lambda',
        note: 'wrapped for effects',
        loc: loc || term.loc,
        args,
        res: void_,
        body: {
            type: 'apply',
            target: term,
            is: void_,
            loc,
            targetType: term.is,
            concreteType: term.is,
            args: effects
                .map((ref) => {
                    if (handlers[refName(ref)]) {
                        return handlers[refName(ref)];
                    }
                    return effectHandlers[refName(ref)].expr;
                })
                .concat(
                    hasValue
                        ? [{ sym: valueSym!, type: 'var', loc, is: valueType! }]
                        : [],
                ),
        },
        is: pureFunction(
            expected.map((eff) => effectHandlerType(env, eff)),
            void_,
        ),
    };
    // throw new LocatedError(loc || term.loc, `Mismatch`);
};

export const maybeWrapPureFunction = (env: Env, arg: Term, t: Type): Term => {
    // console.error(`Maybe ${showType(env, arg.is)} : ${showType(env, t)}`);
    if (t.type !== 'lambda' || t.effects.length === 0) {
        return arg;
    }
    if (arg.is.type !== 'lambda') {
        throw new Error(
            `arg not a lambda, would be cool to statically keep these in sync`,
        );
    }
    if (arg.is.effects.length !== 0) {
        return arg;
    }
    const args: Array<Var> = arg.is.args.map((t, i) => ({
        type: 'var',
        is: t,
        location: null,
        sym: {
            unique: env.local.unique++,
            name: `arg_${i}`,
        },
    }));
    return {
        type: 'lambda',
        args: args.map((a) => a.sym),
        is: {
            ...arg.is,
            effects: t.effects,
        },
        location: arg.location,
        body: {
            type: 'apply',
            originalTargetType: pureFunction([], arg.is.res),
            location: arg.location,
            typeVbls: [],
            effectVbls: null,
            args,
            target: arg,
            is: arg.is.res,
        },
        // effects: t.effects,
    };
};
