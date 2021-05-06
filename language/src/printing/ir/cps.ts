// General thing

import {
    Term,
    Env,
    Type as TermType,
    getEffects,
    Let,
    Var,
    EffectRef,
    UserReference,
    EffectReference,
    LambdaType,
    Symbol,
    refsEqual,
} from '../../typing/types';
import {
    bool,
    builtinType,
    lambdaTypeFromTermType,
    parseCPSArgs,
    pureFunction,
    showType,
    sortedExplicitEffects,
    typeFromTermType,
    var_,
    void_,
} from './utils';
import { showLocation } from '../../typing/typeExpr';

import {
    stringLiteral,
    callExpression,
    handlerSym,
    handlersType,
} from './utils';

import {
    Loc,
    Expr,
    Block,
    Arg,
    LambdaType as ILambdaType,
    OutputOptions,
    Type,
    CPS,
    EffectHandlers,
    EffectHandler,
} from './types';
import { printLambdaBody, sequenceToBlock } from './lambda';
import { printTerm } from './term';
import {
    ifStatement,
    iffe,
    blockStatement,
    arrowFunctionExpression,
    isSimple,
} from './utils';
import { maybeWrapPureFunction } from '../../typing/transform';
import { isVoid } from '../../typing/terms/handle';
import { newSym, refName } from '../../typing/env';
import { printHandleNew, printRaise } from './handle-new';

// export type EffectHandlers = { [id: string]: { expr: Expr; sym: Symbol } };

export const effectHandlerType = (
    env: Env,
    eff: EffectReference,
    loc: Loc,
): Type => {
    return {
        type: 'effect-handler',
        ref: eff.ref,
        loc,
    };
};

export const effectConstructorType = (
    env: Env,
    opts: OutputOptions,
    eff: EffectReference,
    constr: { args: Array<TermType>; ret: TermType },
    loc: Loc,
): Type => {
    const mapType = (t: TermType) => typeFromTermType(env, opts, t);
    return pureFunction(
        constr.args
            .map(mapType)
            .concat([
                pureFunction(
                    [
                        effectHandlerType(env, eff, loc),
                        ...(isVoid(constr.ret) ? [] : [mapType(constr.ret)]),
                    ],
                    void_,
                    [],
                    null,
                ),
            ]),
        void_,
        [],
        null,
    );
};

export const handlerVar = (loc: Loc): Expr => ({
    type: 'var',
    sym: handlerSym,
    loc,
    is: handlersType,
});

export const handlerArg = (loc: Loc): Arg => ({
    sym: handlerSym,
    type: handlersType,
    loc: loc,
});

// export const cpsLambda = (
//     env: Env,
//     opts: OutputOptions,
//     arg: Arg,
//     body: Expr | Block,
//     loc: Loc,
// ): Expr => {
//     return arrowFunctionExpression(
//         [...handleArgsForEffects(env, opts, [], loc), arg],
//         body,
//         loc,
//     );
// };

export const termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    cps: CPS,
): Expr => {
    return _termToAstCPS(env, opts, term, cps);
};

const _termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    cps: CPS,
): Expr => {
    const mapType = (t: TermType) => typeFromTermType(env, opts, t);
    // No effects in the term
    if (!getEffects(term).length && term.type !== 'Let') {
        const tt = mapType(term.is);
        return callDone(
            env,
            opts,
            cps,
            printTerm(env, opts, term),
            term.location,
        );
    }
    switch (term.type) {
        case 'handle': {
            if (getEffects(term.target).length > 0) {
                throw new Error(
                    `Handle target has effects! should be a lambda`,
                );
            }
            if (opts.explicitHandlerFns) {
                return printHandleNew(env, opts, term, cps);
            }
            return {
                type: 'handle',
                target: printTerm(env, opts, term.target),
                effect: (term.effect as UserReference).id,
                loc: term.location,
                pure: {
                    arg: term.pure.arg,
                    argType: mapType((term.target.is as LambdaType).res),
                    body: printLambdaBody(env, opts, term.pure.body, cps),
                },
                cases: term.cases.map((kase) => ({
                    ...kase,
                    args: kase.args.map((arg) => ({
                        ...arg,
                        type: mapType(arg.type),
                    })),
                    k: {
                        ...kase.k,
                        type: mapType(kase.k.type),
                    },
                    body: printLambdaBody(env, opts, kase.body, cps),
                })),
                is: void_,
                done: cps.done,
            };
        }
        case 'Let': {
            const { args, handlers } = handleArgsForEffects(
                env,
                opts,
                // UMMMM yeah this is probably it
                // like
                // um
                getEffects(term.value),
                term.location,
            );
            return termToAstCPS(env, opts, term.value, {
                ...cps,
                done: arrowFunctionExpression(
                    [
                        ...args,
                        {
                            sym: term.binding,
                            type: mapType(term.is),
                            loc: term.location,
                        },
                    ],
                    callDone(
                        env,
                        opts,
                        { ...cps, handlers: { ...cps.handlers, ...handlers } },
                        null,
                        term.location,
                    ),
                    term.location,
                ),
            });
        }
        case 'raise': {
            if (opts.explicitHandlerFns) {
                return printRaise(env, opts, term, cps);
            }
            if (
                ([] as Array<EffectRef>).concat(...term.args.map(getEffects))
                    .length > 0
            ) {
                return stringLiteral('raise args effects', null);
            }
            if (term.ref.type === 'builtin') {
                throw new Error('ok');
            }
            return {
                type: 'raise',
                effect: term.ref.id,
                idx: term.idx,
                args: term.args.map((t) => printTerm(env, opts, t)),
                loc: term.location,
                is: void_,
                done: cps.done,
            };
        }
        case 'if': {
            const condEffects = getEffects(term.cond);
            if (condEffects.length) {
                throw new Error(`Condition effects -- call liftEffects first`);
            }

            const cond = printTerm(env, opts, term.cond);

            return iffe(
                env,
                blockStatement(
                    [
                        ifStatement(
                            cond,
                            printLambdaBody(env, opts, term.yes, cps),
                            term.no
                                ? printLambdaBody(env, opts, term.no, cps)
                                : callDone(env, opts, cps, null, term.location),
                            term.location,
                        ),
                    ],
                    term.location,
                ),
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

            if (term.args.some((arg) => getEffects(arg).length > 0)) {
                throw new Error(
                    `Apply arg had an effect - you need to run liftEffects first.`,
                );
            }
            let target = printTerm(env, opts, term.target);
            if (target.is.type === 'effectful-or-direct') {
                target = {
                    type: 'effectfulOrDirect',
                    target,
                    effectful: true,
                    loc: target.loc,
                    is: target.is.effectful,
                };
            }
            return passDone(
                env,
                opts,
                target,
                args.map((arg, i) =>
                    maybeWrapForEffects(
                        env,
                        opts,
                        printTerm(env, opts, arg),
                        arg.is,
                        argTypes[i],
                        cps.handlers,
                        // (term.target.is as LambdaType).effects
                    ),
                ),
                args.map((arg) => arg.is),
                argTypes,
                cps,
                // {
                //     done: maybeWrapDone(
                //         env,
                //         opts,
                //         cps.done,
                //         (term.target.is as LambdaType).effects,
                //         cps.handlers,
                //     ),
                //     handlers: cps.handlers,
                // },
                term.location,
                term.typeVbls.map(mapType),
            );
        }
        case 'sequence':
            return iffe(env, sequenceToBlock(env, opts, term, cps));
        default:
            return callDone(
                env,
                opts,
                cps,
                printTerm(env, opts, term),
                term.location,
            );
    }
};

// Should I have a function
// that gets the "handler arguments"?
// and the "done argument"?
// I need a function that is "does this done function want an argument"
// right?
export const handlerTypesForEffects = (
    env: Env,
    opts: OutputOptions,
    effects: Array<EffectRef>,
    loc: Loc,
) => {
    if (opts.explicitHandlerFns) {
        return sortedExplicitEffects(effects).map((eff) =>
            effectHandlerType(env, eff, loc),
        );
    } else {
        return [handlersType];
    }
};

export const handleValuesForEffects = (
    env: Env,
    opts: OutputOptions,
    effectHandlers: EffectHandlers,
    types: Array<Type>,
    loc: Loc,
): Array<Expr> => {
    if (opts.explicitHandlerFns) {
        // return [];
        // return [handlerVar(loc)];
        return (
            (types.filter(
                (t) => t.type === 'effect-handler',
            ) as Array<EffectHandler>)
                // START HERE: I think I want `Env` to be expanded
                // to include effect mappings.
                // But really I want to change out the `Env` used in the IR
                // world entirely.
                // So it would keep `global`, and then `local` would just have unique maybe,
                // and then it would have `effectHandlers`. Which would be great.
                // WAIT
                // NO
                // ok different plan:
                // the `cps` variable which gets passed around
                // and which is sometimes null
                // it should be {done: Expr, effectHandlers: {}}
                // right?
                // seems legit
                .map((t, i) => {
                    const v = effectHandlers[refName(t.ref)];
                    if (!v) {
                        throw new Error(
                            `No effect handler defined for ${refName(t.ref)}`,
                        );
                    }
                    return v;
                })
        );
    } else {
        return [handlerVar(loc)];
    }
};

// STOPSHIP: handle type variables?
export const maybeWrapForEffects = (
    env: Env,
    opts: OutputOptions,
    expr: Expr,
    termType: TermType,
    expectedType: TermType,
    outerHandlers: EffectHandlers,
    // passedEffects: Array<EffectRef>
) => {
    if (expr.is.type !== 'lambda') {
        return expr;
    }
    termType = termType as LambdaType;
    expectedType = expectedType as LambdaType;
    const termEffects = sortedExplicitEffects(termType.effects);
    const expectedEffects = sortedExplicitEffects(expectedType.effects);
    // console.log('term', termEffects, 'expected', expectedEffects);
    if (
        !(
            termEffects.length !== expectedEffects.length ||
            termEffects.some(
                (t, i) => !refsEqual(t.ref, expectedEffects[i].ref),
            )
        )
    ) {
        // console.log('no need to wrap');
        return expr;
    }

    const { args, handlers } = handleArgsForEffects(
        env,
        opts,
        expectedEffects,
        expr.loc,
    );
    let returnValue = null;

    // ugh
    // ok, so the format of these functions,
    // and I should really just make a separate function type
    // like `cpsLambda`, that has `effectHandlers` and `done`
    // specified separately from `args`
    // but as we have it, we have
    // [normal args], [effect handlers], [done]
    // right?
    // And so, the normal args um might need modification too I guess?
    // also we'll be doing passDone
    const expectedLambda = lambdaTypeFromTermType(
        env,
        opts,
        expectedType,
    ) as ILambdaType;
    const expectedDone = expectedLambda.args[expectedLambda.args.length - 1];

    const otherArgs: Array<Arg> = expectedType.args.map((t, i) => {
        return {
            type: typeFromTermType(env, opts, t),
            sym: newSym(env, `arg${i}`),
            loc: expr.loc,
        };
    });
    const doneArg: Arg = {
        type: expectedDone,
        sym: newSym(env, 'done'),
        loc: expr.loc,
    };

    const cps = {
        done: maybeWrapDone(
            env,
            opts,
            var_(doneArg.sym, expr.loc, doneArg.type),
            expectedEffects,
            outerHandlers,
        ),
        handlers: { ...outerHandlers, ...handlers },
    };
    const result = arrowFunctionExpression(
        // TODO: pass the done one? idk
        otherArgs.concat(args).concat([doneArg]),
        passDone(
            env,
            opts,
            expr,
            otherArgs.map((arg, i) => {
                // maybe wrap here too?
                return var_(arg.sym, arg.loc, arg.type);
            }),
            expectedType.args,
            expectedType.args,
            cps,
            expr.loc,
            [], // STOPSHIP type vbls?
        ),

        expr.loc,
    );
    // console.log('Wrapped');
    // console.log('- ', showType(env, expr.is));
    // console.log('- ', showType(env, result.is));
    // console.log('- ', showType(env, cps.done.is));
    return result;
};

// This should return a new mapping for effectHandlers too
// because we're creating them
// for the body.
export const handleArgsForEffects = (
    env: Env,
    opts: OutputOptions,
    effects: Array<EffectRef>,
    loc: Loc,
): { args: Array<Arg>; handlers: EffectHandlers } => {
    if (opts.explicitHandlerFns) {
        const args: Array<Arg> = [];
        const handlers: EffectHandlers = {};
        sortedExplicitEffects(effects).forEach((eff) => {
            const sym = newSym(env, 'handle' + refName(eff.ref));
            const t = effectHandlerType(env, eff, loc);
            args.push({
                type: t,
                sym: sym,
                loc,
            });
            handlers[refName(eff.ref)] = var_(sym, loc, t);
        });
        return { args, handlers };
    } else {
        return { args: [handlerArg(loc)], handlers: {} };
    }
};

// Ok, next hurdle. When passing in a function
// that expects more handlers than are provided
// because the receiving function has an effect variable,
// we need to wrap it in another lambda
// that does the translation.

// Q: Should I refuse to allow using {e} more than one level deep?
// like {e}(fn: (() ={e}> void) => void) => string?
// Is that a problem at all?
// I should least have a test that does this, to see what it
// would even look like.

// Huh ok maybe I do want to support that. Will need to account
// for that.

// export const

export const passDone = (
    env: Env,
    opts: OutputOptions,
    target: Expr,
    args: Array<Expr>,
    argTypes: Array<TermType>,
    expectedArgTypes: Array<TermType>,
    cps: CPS,
    loc: Loc,
    typeVbls?: Array<Type>,
) => {
    // console.log('>> calling passDone with', showType(env, target.is));
    const targetType = target.is as ILambdaType;
    const doneType = cps.done.is as ILambdaType;
    const expectedDoneType = targetType.args[
        targetType.args.length - 1
    ] as ILambdaType;

    // What is a `done`?
    // It takes some number of handler arguments
    // and potentially a value.
    // Should I make a custom type just for that?
    // I dunno, that might make things wierd
    // when I want to call it.
    // But, on the other hand, `done`s aren't really
    // meant to be general-purpose functions, they don't
    // exist in user space.
    // So I could potentially get away with that.
    // ok
    // but for the moment, I'll just be hacking things together
    // with introspecting the types of arguments.
    // yup.
    const expectedDoneEffects = expectedDoneType.args.filter(
        (arg) => arg.type === 'effect-handler',
    ) as Array<EffectHandler>;
    const providedDoneEffects = doneType.args.filter(
        (arg) => arg.type === 'effect-handler',
    ) as Array<EffectHandler>;
    if (
        expectedDoneEffects.length !== providedDoneEffects.length ||
        expectedDoneEffects.some(
            (t, i) => !refsEqual(t.ref, providedDoneEffects[i].ref),
        )
    ) {
        // console.log('Wrapping done in passDone folks');
        // console.log('- expected', showType(env, expectedDoneType));
        // console.log('- found', showType(env, cps.done.is));
        // START HERE: Flesh this out
        const { args, handlers } = handleArgsForEffects(
            env,
            opts,
            expectedDoneEffects.map((t) => ({ type: 'ref', ref: t.ref })),
            loc,
        );
        let returnValue = null;
        let returnType = null;
        if (expectedDoneType.args.length > expectedDoneEffects.length) {
            const sym = newSym(env, 'returnValue');
            returnType =
                expectedDoneType.args[expectedDoneType.args.length - 1];
            args.push({
                sym,
                type: returnType,
                loc,
            });
            returnValue = sym;
        }
        const oldCps = cps;
        cps = {
            ...cps,
            done: arrowFunctionExpression(
                args,
                callDone(
                    env,
                    opts,
                    cps,
                    returnValue ? var_(returnValue, loc, returnType!) : null,
                    loc,
                ),
                loc,
            ),
        };
        // console.log(`Wrapped again in passdone`);
        // console.log('- ', showType(env, oldCps.done.is));
        // console.log('- ', showType(env, cps.done.is));
        // console.log(
        //     'expectedDoneEffects',
        //     expectedDoneEffects.map((t) => refName(t.ref)),
        // );
        // console.log(
        //     'providedDoneEffects',
        //     providedDoneEffects.map((t) => refName(t.ref)),
        // );
        // console.log('args', args);
        // throw new Error(`Dones differ yes`);
    } else if (expectedDoneType.args.length > doneType.args.length) {
        const args: Array<Arg> = expectedDoneType.args.map((type, i) => ({
            type,
            loc,
            sym: { name: `arg_${i}`, unique: env.local.unique++ },
        }));
        cps = {
            ...cps,
            done: arrowFunctionExpression(
                args,
                callExpression(
                    env,
                    cps.done,
                    args.slice(0, doneType.args.length).map((arg) => ({
                        type: 'var',
                        sym: arg.sym,
                        is: arg.type,
                        loc,
                    })),
                    loc,
                    [],
                ),
                loc,
            ),
        };
    }

    // START HERE:
    // Ok, so here's where we need to .... do something
    // If 'done' wants more/fewer handlers than I'm likely to provide
    // (as target.is.effects will indicate)
    // then I need to wrap done in a function that just requests
    // then handlers that I'm going to provide, and which gets the
    // rest from the ambient cps.handlers info.
    // console.log('<<');

    return callExpression(
        env,
        target,
        // is this when we might translate the arguments?
        // I think it might be.
        args
            .map(
                (arg, i) =>
                    // START HERE: Is this the way to get
                    // two levels deep to work? idk!
                    // maybeWrapForEffects(
                    //     env,
                    //     opts,
                    //     arg,
                    //     expectedArgTypes[i],
                    //     argTypes[i],
                    //     cps.handlers,
                    //     // (term.target.is as LambdaType).effects
                    // ),
                    arg,
                // arg,
            )
            .concat([
                ...handleValuesForEffects(
                    env,
                    opts,
                    cps.handlers,
                    (target.is as ILambdaType).args,
                    target.loc,
                ),
                cps.done,
            ]),
        loc,
        typeVbls,
    );
};

const getDoneReturnType = (doneType: Type) => {
    if (doneType.type !== 'lambda') {
        throw new Error(`Not a lambda`);
    }
    const lastArg = doneType.args[doneType.args.length - 1];
    if (!lastArg) {
        return null;
    }
    if (lastArg.type === 'effect-handler') {
        return null;
    }
    return lastArg;
};

// Assumes to be sorted
const effectsMatch = (
    one: Array<EffectReference>,
    two: Array<EffectReference>,
) => {
    return (
        one.length === two.length &&
        one.every((t, i) => refsEqual(t.ref, two[i].ref))
    );
};

export const maybeWrapDone = (
    env: Env,
    opts: OutputOptions,
    done: Expr,
    expectedEffects: Array<EffectReference>,
    outerHandlers: EffectHandlers,
) => {
    const doneEffects = (done.is as ILambdaType).args.filter(
        (t) => t.type === 'effect-handler',
    ) as Array<EffectHandler>;
    if (
        effectsMatch(
            expectedEffects,
            doneEffects.map((r) => ({ type: 'ref', ref: r.ref })),
        )
    ) {
        return done;
    }

    const { args, handlers } = handleArgsForEffects(
        env,
        opts,
        expectedEffects,
        done.loc,
    );

    let returnValue: Arg | null = null;
    const returnType = getDoneReturnType(done.is);
    if (returnType) {
        returnValue = {
            sym: newSym(env, 'returnValue'),
            type: returnType,
            loc: done.loc,
        };
    }

    // console.log('wrapping done folks', args);

    const result = arrowFunctionExpression(
        // TODO: pass the done one? idk
        args.concat(returnValue ? [returnValue] : []),
        callDone(
            env,
            opts,
            { done, handlers: { ...outerHandlers, ...handlers } },
            returnValue
                ? var_(returnValue.sym, returnValue.loc, returnValue.type)
                : null,
            done.loc,
        ),
        done.loc,
    );
    // console.log(
    //     'Wrapped done\n',
    //     showType(env, done.is),
    //     '\n',
    //     showType(env, result.is),
    // );
    return result;
};

export const callDone = (
    env: Env,
    opts: OutputOptions,
    cps: CPS,
    returnValue: Expr | null,
    loc: Loc,
) => {
    if (cps.done.is.type !== 'lambda') {
        throw new Error(`Done is not a lambda ${cps.done.is.type}`);
    }
    const dt = cps.done.is as ILambdaType;
    const args = handleValuesForEffects(env, opts, cps.handlers, dt.args, loc);
    const lastArg = dt.args.length > 0 ? dt.args[dt.args.length - 1] : null;
    const wantsValue = lastArg ? lastArg.type !== 'effect-handler' : false;
    if (returnValue != null && wantsValue) {
        args.push(returnValue);
    }
    return callExpression(env, cps.done, args, loc);
};
