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
} from '../../typing/types';
import { bool, pureFunction, void_ } from '../../typing/preset';
import { showLocation } from '../../typing/typeExpr';

import {
    Expr,
    // handlersType,
    // handlerSym,
    stringLiteral,
    callExpression,
    OutputOptions,
} from './types';
import {
    printLambdaBody,
    sequenceToBlock,
    sortedExplicitEffects,
} from './lambda';
import { printTerm } from './term';
import {
    blockStatement,
    arrowFunctionExpression,
    isSimple,
    ifStatement,
    iffe,
} from './utils';
import { idName, refName } from '../../typing/env';
import { LocatedError } from '../../typing/errors';
import { showType } from '../../typing/unify';
import { printHandle } from './handle';

// export const handlerVar = (loc: Loc): Expr => ({
//     type: 'var',
//     sym: handlerSym,
//     loc,
// });

// export const cpsLambda = (arg: Arg, body: Expr | Block, loc: Loc): Expr => {
//     return {
//         type: 'lambda',
//         args: [
//             {
//                 sym: handlerSym,
//                 type: builtinType('handlers'),
//                 loc: null,
//             },
//             arg,
//         ],
//         body,
//         res: void_,
//         loc,
//     };
// };

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
                // note: 'let-lambda',
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
            if (
                ([] as Array<EffectRef>).concat(...term.args.map(getEffects))
                    .length > 0
            ) {
                return stringLiteral('raise args effects', null);
            }
            if (term.ref.type === 'builtin') {
                throw new Error('ok');
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
            if (!done) {
                throw new Error(`wot done`);
            }
            if (!done.is) {
                throw new Error(`no done is ${done.type}`);
            }
            if (done.is.type !== 'lambda') {
                throw new Error('done not a lambda');
            }
            const doneEffects = done.is.args
                .map((arg) =>
                    arg.type === 'effect-handler'
                        ? { type: 'ref', ref: arg.ref, location: null }
                        : null,
                )
                .filter(Boolean) as Array<EffectReference>;
            // const doneHandlerTypes = doneEffects.map((eff) =>
            //     effectHandlerType(env, eff),
            // );
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
                    // TODO: if this isn't (theEffectHandler, theValue)
                    // we might need to wrap it (for example if it expects more effects than that)
                    .concat([done]),
                is: void_,
                targetType: t,
                loc: term.location,
                concreteType: t,
            };
            // return {
            //     type: 'raise',
            //     effect: term.ref.id,
            //     idx: term.idx,
            //     args: term.args.map((t) => printTerm(env, opts, t)),
            //     loc: term.location,
            //     done,
            // };
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

            // STOPSHIP: I'm sure none of this works.
            // I should really write some tests.
            const condEffects = getEffects(term.cond);
            if (condEffects.length) {
                return termToAstCPS(env, opts, term.cond, effectHandlers, {
                    type: 'lambda',
                    args: [
                        {
                            sym: { name: 'cond', unique: 1000 },
                            type: bool,
                            loc: term.cond.location,
                        },
                    ],
                    is: pureFunction([bool], void_),
                    body: {
                        type: 'Block',
                        items: [
                            ifStatement(
                                {
                                    type: 'var',
                                    sym: { name: 'cond', unique: 1000 },
                                    loc: term.cond.location,
                                    is: bool,
                                },
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
                        loc: term.location,
                    },
                    res: void_,
                    loc: term.location,
                });
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
                // const argSyms = args.map((arg, i) =>
                //     isSimple(arg)
                //         ? null
                //         : { name: `arg_${i}`, unique: env.local.unique++ },
                // );
                // let target = printTerm(env, opts, term.target);
                // if (term.hadAllVariableEffects) {
                //     target = {
                //         type: 'effectfulOrDirect',
                //         target,
                //         effectful: true,
                //         loc: target.loc,
                //         is: term.target.is,
                //     };
                // }
                // let inner: Expr = done;
                // if (term.target.is.effects.length > 0) {
                //     // ok so the thing is,
                //     // i only need to cps it out if the arg
                //     // is an apply that does cps.
                //     // but not if that arg has an arg that does cps,
                //     // right?
                //     inner = callExpression(
                //         target,
                //         // STOSHIP: add handler n stuff
                //         {
                //             ...term.originalTargetType,
                //             args: term.originalTargetType.args.concat([
                //                 ...effectHandlerTypes,
                //                 pureFunction([term.is], void_),
                //             ]),
                //             res: void_,
                //         },
                //         void_,
                //         (argSyms.map((sym, i) =>
                //             sym
                //                 ? { type: 'var', sym, loc: null }
                //                 : printTerm(env, opts, args[i]),
                //         ) as Array<Expr>).concat([
                //             ...effectHandlersToPass,
                //             inner,
                //         ]),
                //         target.loc,
                //     );
                // } else {
                //     if (!term.originalTargetType) {
                //         throw new Error(
                //             `No original targt type ${showLocation(
                //                 term.location,
                //             )}`,
                //         );
                //     }
                //     if (done.is.type !== 'lambda') {
                //         throw new Error('done not a lambda');
                //     }
                //     const effects = done.is.args
                //         .map((arg) =>
                //             arg.type === 'effect-handler'
                //                 ? { type: 'ref', ref: arg.ref, location: null }
                //                 : null,
                //         )
                //         .filter(Boolean) as Array<EffectReference>;
                //     const doneHandlerTypes = effects.map((eff) =>
                //         effectHandlerType(env, eff),
                //     );
                //     // hm. I feel like I need to introspect `done`.
                //     // and have a way to flatten out immediate calls.
                //     // or I could do that post-hoc?
                //     // I mean that might make things simpler tbh.
                //     inner = callExpression(
                //         done,
                //         // pureFunction(
                //         //     [
                //         //         // STOP handlersType,
                //         //         ...doneHandlerTypes,
                //         //         builtinType('any'),
                //         //     ],
                //         //     void_,
                //         // ),
                //         done.is,
                //         void_,
                //         [
                //             ...effects.map(
                //                 (eff) => effectHandlers[refName(eff.ref)].expr,
                //             ),
                //             // so here is where we want to
                //             // put the "body"
                //             // which might include inverting it.
                //             callExpression(
                //                 target,
                //                 {
                //                     ...term.originalTargetType,
                //                     args: term.originalTargetType.args.concat([
                //                         ...doneHandlerTypes,
                //                         pureFunction([term.is], void_),
                //                     ]),
                //                     res: void_,
                //                 },
                //                 term.is,
                //                 argSyms.map((sym, i) =>
                //                     sym
                //                         ? {
                //                               type: 'var',
                //                               sym,
                //                               loc: null,
                //                           }
                //                         : printTerm(env, opts, args[i]),
                //                 ) as Array<Expr>,
                //                 target.loc,
                //             ),
                //         ],
                //         target.loc,
                //     );
                // }
                // for (let i = args.length - 1; i >= 0; i--) {
                //     if (isSimple(args[i])) {
                //         continue;
                //     }
                //     const arg = args[i];
                //     // TODO: handle um `raise`, because that's a thing
                //     if (arg.type === 'raise') {
                //         // const ty = arg.is
                //         const eff: EffectReference = {
                //             type: 'ref',
                //             ref: arg.ref,
                //         };
                //         inner = termToAstCPS(
                //             env,
                //             opts,
                //             args[i],
                //             effectHandlers,
                //             arrowFunctionExpression(
                //                 [
                //                     {
                //                         sym:
                //                             effectHandlers[refName(eff.ref)]
                //                                 .sym,
                //                         type: effectHandlerType(env, eff),
                //                         loc: null,
                //                         // hmm this is where doing things in reverse is a little weird?
                //                     },
                //                     {
                //                         sym: argSyms[i]!,
                //                         loc: args[i].location,
                //                         type: args[i].is,
                //                     },
                //                 ],
                //                 blockStatement(
                //                     [
                //                         {
                //                             type: 'Expression',
                //                             expr: inner,
                //                             loc: inner.loc,
                //                         },
                //                     ],
                //                     inner.loc,
                //                 ),
                //                 void_,
                //                 args[i].location,
                //                 pureFunction(
                //                     [effectHandlerType(env, eff), args[i].is],
                //                     void_,
                //                 ),
                //             ),
                //         );
                //     } else {
                //         if (arg.type !== 'apply') {
                //             throw new LocatedError(
                //                 arg.location,
                //                 `Arg has effects, but isn't an apply ${arg.type}`,
                //             );
                //         }
                //         const ty = arg.target.is;
                //         if (ty.type !== 'lambda') {
                //             throw new Error('apply target not a lambda');
                //         }
                //         inner = termToAstCPS(
                //             env,
                //             opts,
                //             args[i],
                //             effectHandlers,
                //             arrowFunctionExpression(
                //                 [
                //                     ...sortedExplicitEffects(ty.effects).map(
                //                         (eff) => ({
                //                             sym:
                //                                 effectHandlers[refName(eff.ref)]
                //                                     .sym,
                //                             type: effectHandlerType(env, eff),
                //                             loc: null,
                //                             // hmm this is where doing things in reverse is a little weird?
                //                         }),
                //                     ),
                //                     {
                //                         sym: argSyms[i]!,
                //                         loc: args[i].location,
                //                         type: args[i].is,
                //                     },
                //                 ],
                //                 blockStatement(
                //                     [
                //                         {
                //                             type: 'Expression',
                //                             expr: inner,
                //                             loc: inner.loc,
                //                         },
                //                     ],
                //                     inner.loc,
                //                 ),
                //                 void_,
                //                 args[i].location,
                //                 pureFunction(
                //                     [
                //                         ...sortedExplicitEffects(
                //                             ty.effects,
                //                         ).map((eff) =>
                //                             effectHandlerType(env, eff),
                //                         ),
                //                         args[i].is,
                //                     ],
                //                     void_,
                //                 ),
                //             ),
                //         );
                //     }
                // }
                // return inner;
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
                    .concat([...effectHandlersToPass, done]),
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
