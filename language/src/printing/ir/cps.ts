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
} from '../../typing/types';
import {
    bool,
    builtinType,
    lambdaTypeFromTermType,
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
import { printRaise } from './handle-new';

// export type EffectHandlers = { [id: string]: { expr: Expr; sym: Symbol } };

export const effectHandlerType = (env: Env, eff: EffectReference): Type => {
    return {
        type: 'effect-handler',
        ref: eff.ref,
        loc: null,
    };
};

export const effectConstructorType = (
    env: Env,
    opts: OutputOptions,
    eff: EffectReference,
    constr: { args: Array<TermType>; ret: TermType },
): Type => {
    const mapType = (t: TermType) => typeFromTermType(env, opts, t);
    return pureFunction(
        constr.args
            .map(mapType)
            .concat([
                pureFunction(
                    [
                        effectHandlerType(env, eff),
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
                [],
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
                args.map((arg, i) => printTerm(env, opts, arg)),
                cps,
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
) => {
    if (opts.explicitHandlerFns) {
        return sortedExplicitEffects(effects).map((eff) =>
            effectHandlerType(env, eff),
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
                        throw new Error(`No effect handler defined`);
                    }
                    return v;
                })
        );
    } else {
        return [handlerVar(loc)];
    }
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
            const t = effectHandlerType(env, eff);
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

export const passDone = (
    env: Env,
    opts: OutputOptions,
    target: Expr,
    args: Array<Expr>,
    cps: CPS,
    loc: Loc,
    typeVbls?: Array<Type>,
) => {
    const targetType = target.is as ILambdaType;
    const doneType = cps.done.is as ILambdaType;
    const expectedDoneType = targetType.args[
        targetType.args.length - 1
    ] as ILambdaType;
    if (expectedDoneType.args.length > doneType.args.length) {
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

    return callExpression(
        env,
        target,
        args.concat([
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
    // if (returnValue != null && dt.args.length === 2) {
    //     args.push(returnValue);
    // }
    return callExpression(env, cps.done, args, loc);
};
