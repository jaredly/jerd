// The bulk of stuff happens here

import {
    Env,
    Symbol,
    LambdaType,
    Handle,
    UserReference,
    EffectReference,
    EffectRef,
    Raise,
} from '../../typing/types';
import {
    Expr,
    OutputOptions,
    Stmt,
    Type,
    LambdaType as ILambdaType,
    Loc,
    Block,
    typesEqual,
    Arg,
    CPS,
} from './types';
import {
    arrowFunctionExpression,
    assign,
    callExpression,
    define,
    expectLambdaType,
    expressionStatement,
    lambdaTypeFromTermType,
    pureFunction,
    returnStatement,
    showType,
    tupleType,
    typeFromTermType,
    var_,
    void_,
    withSym,
} from './utils';

import { iffe, asBlock, block } from './utils';
import { printLambdaBody } from './lambda';
import { printTerm } from './term';
import { newSym, refName } from '../../typing/env';
import {
    effectConstructorType,
    effectHandlerType,
    handleArgsForEffects,
    handlerTypesForEffects,
    handleValuesForEffects,
    passDone,
} from './cps';
import { args } from '../printer';
import { isVoid } from '../../typing/terms/handle';

export const printHandleNew = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    done: CPS | null,
): Expr => {
    if (!done) {
        const resT = typeFromTermType(env, opts, term.is);
        return withSyncDone(env, opts, resT, term.location, (done) =>
            _printHandleNew(env, opts, term, done),
        );
    }

    return iffe(
        env,
        block(_printHandleNew(env, opts, term, done), term.location),
    );
};

export const printRaise = (
    env: Env,
    opts: OutputOptions,
    term: Raise,
    cps: CPS,
): Expr => {
    const raise = cps.handlers[refName(term.ref)];
    if (!raise) {
        throw new Error(`No handler for ${refName(term.ref)}`);
    }
    // TODO: Need to index I think?
    const target: Expr = {
        type: 'tupleAccess',
        idx: term.idx,
        loc: term.location,
        target: raise,
        is: effectConstructorType(
            env,
            opts,
            {
                type: 'ref',
                ref: term.ref,
            },
            env.global.effects[refName(term.ref)][term.idx],
            term.location,
        ),
    };
    // hmmmmmmmmmmmmmmm ok so if raise doesn't have a return value
    // and the next thing wants a `void` value,
    // what is a body to do?
    return passDone(
        env,
        opts,
        target,
        term.args.map((arg) => printTerm(env, opts, arg)),
        term.args.map((a) => a.is),
        term.args.map((a) => a.is),
        cps,
        term.location,
        [],
    );
    // return callExpression(
    //     env,
    //     target,
    //     [...term.args.map((arg) => printTerm(env, opts, arg)), cps.done],
    //     term.location,
    // );
};

export const _printHandleNew = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    cps: CPS,
): Array<Stmt> => {
    /*
    handle! fn {
        Write.write((v) => k) => xyz,
        pure(x) => z,
    }

    becomes

    let fnReturnPointer = {pure as a function that just takes a value}
    fn([
        (value: string, rawK: (handler: handle123123, returnValue: string) => void) => {
            const k = (returnValue: string, handler: handle123123, returnToHandler: ...) => {
                fnReturnPointer = returnToHandler
                rawK(handler, reyturnValue)
            }
            // k is now set.
        }
    ], (_handlerIThink, returnValue) => fnReturnPointer(returnValue))

    // ok worth a shot
    */
    const fnReturnPointer = newSym(env, 'fnReturnPointer');
    const targetType = expectLambdaType(
        env,
        opts,
        lambdaTypeFromTermType(env, opts, term.target.is as LambdaType),
    );
    const targetReturnType = typeFromTermType(
        env,
        opts,
        (term.target.is as LambdaType).res,
    );

    const effectRef: EffectRef = { type: 'ref', ref: term.effect };

    const { args, handlers } = handleArgsForEffects(
        env,
        opts,
        [effectRef],
        term.location,
    );

    const doneArgs = args.slice();
    const targetReturnsVoid = typesEqual(targetReturnType, void_);
    if (!targetReturnsVoid) {
        doneArgs.push({
            type: targetReturnType,
            sym: term.pure.arg,
            loc: term.location,
        });
    }

    const fnReturn = arrowFunctionExpression(
        doneArgs,
        printLambdaBody(env, opts, term.pure.body, cps),
        term.location,
    );

    const fnDone = withSym(env, 'returnValue', (returnValue) =>
        arrowFunctionExpression(
            targetReturnsVoid
                ? args
                : args.concat([
                      {
                          type: targetReturnType,
                          sym: returnValue,
                          loc: term.location,
                      },
                  ]),
            callExpression(
                env,
                var_(fnReturnPointer, term.location, fnReturn.is),
                [
                    ...handleValuesForEffects(
                        env,
                        opts,
                        { ...cps.handlers, ...handlers },
                        fnReturn.is.args,
                        term.location,
                    ),
                    ...(targetReturnsVoid
                        ? []
                        : [var_(returnValue, term.location, targetReturnType)]),
                ],
                term.location,
            ),
            term.location,
        ),
    );

    const thisHandler = printEffectHandler(
        env,
        opts,
        term,
        fnReturnPointer,
        cps,
        term.location,
    );
    const thisHandlerSym = newSym(env, 'thisHandler');
    const withThisHandler = {
        ...cps.handlers,
        ...handlers,
        [refName(effectRef.ref)]: var_(
            thisHandlerSym,
            term.location,
            effectHandlerType(env, effectRef, term.location),
        ),
    };

    // TODO can I make this as straightforward as I can?
    return [
        define(fnReturnPointer, fnReturn),
        define(thisHandlerSym, thisHandler),
        expressionStatement(
            callExpression(
                env,
                printTerm(env, opts, term.target),
                [
                    ...handleValuesForEffects(
                        env,
                        opts,
                        withThisHandler,
                        targetType.args,
                        term.location,
                    ),
                    fnDone,
                ],
                term.location,
            ),
        ),
    ];
};

const printEffectHandler = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    fnReturnPointer: Symbol,
    cps: CPS,
    loc: Loc,
): Expr => {
    const targetType = expectLambdaType(
        env,
        opts,
        lambdaTypeFromTermType(env, opts, term.target.is as LambdaType),
    );
    const targetReturnType = typeFromTermType(
        env,
        opts,
        (term.target.is as LambdaType).res,
    );
    const effRef: EffectReference = { type: 'ref', ref: term.effect };
    const effDev = env.global.effects[refName(term.effect)];
    return {
        type: 'tuple',
        loc: term.location,
        items: term.cases.map((kase, i) => {
            const rawK: Symbol = {
                name: 'rawK',
                unique: env.local.unique.current++,
            };
            const kh: Symbol = {
                name: 'handlers',
                unique: env.local.unique.current++,
            };
            const returnToHandler: Symbol = {
                name: 'returnToHandler',
                unique: env.local.unique.current++,
            };
            const returnToHandlerType: Type = pureFunction(
                [
                    effectHandlerType(env, effRef, term.location),
                    targetReturnType,
                ],
                void_,
            );
            const ret = typeFromTermType(env, opts, effDev[i].ret);
            const isVoid = typesEqual(ret, void_);
            const value: Symbol | null = isVoid
                ? null
                : {
                      name: 'value',
                      unique: env.local.unique.current++,
                  };
            const rawKType: Type = pureFunction(
                [
                    effectHandlerType(env, effRef, term.location),
                    ...(typesEqual(ret, void_) ? [] : [ret]),
                ],
                void_,
            );
            return arrowFunctionExpression(
                [
                    ...kase.args.map((arg, si) => ({
                        sym: arg.sym,
                        type: typeFromTermType(env, opts, arg.type),
                        loc: kase.body.location,
                    })),
                    {
                        sym: rawK,
                        type: rawKType,
                        loc: kase.body.location,
                    },
                ],
                prependToBody(
                    {
                        type: 'Define',
                        sym: kase.k.sym,
                        is: typeFromTermType(env, opts, kase.k.type),
                        loc: kase.body.location,
                        // comment:
                        //     'the type ' +
                        //     printType(env, returnToHandlerType),
                        value: arrowFunctionExpression(
                            [
                                ...(value == null
                                    ? []
                                    : [
                                          {
                                              sym: value,
                                              type: ret,
                                              loc: kase.body.location,
                                          } as Arg,
                                      ]),
                                {
                                    sym: kh,
                                    type: effectHandlerType(
                                        env,
                                        effRef,
                                        term.location,
                                    ),
                                    loc: kase.body.location,
                                },
                                {
                                    sym: returnToHandler,
                                    type: returnToHandlerType,
                                    loc: kase.body.location,
                                },
                            ],
                            {
                                type: 'Block',
                                items: [
                                    {
                                        type: 'Assign',
                                        sym: fnReturnPointer,
                                        loc: kase.body.location,
                                        value: {
                                            type: 'var',
                                            sym: returnToHandler,
                                            loc: kase.body.location,
                                            is: returnToHandlerType,
                                        },
                                        is: void_,
                                    },
                                    {
                                        type: 'Expression',
                                        loc: kase.body.location,
                                        expr: callExpression(
                                            env,
                                            {
                                                type: 'var',
                                                sym: rawK,
                                                loc: kase.body.location,
                                                is: rawKType,
                                            },
                                            [
                                                {
                                                    type: 'var',
                                                    sym: kh,
                                                    is: effectHandlerType(
                                                        env,
                                                        effRef,
                                                        term.location,
                                                    ),
                                                    loc: kase.body.location,
                                                },
                                                ...(value
                                                    ? [
                                                          {
                                                              type: 'var',
                                                              sym: value,
                                                              loc:
                                                                  kase.body
                                                                      .location,
                                                              is: ret,
                                                          } as Expr,
                                                      ]
                                                    : []),
                                            ],
                                            kase.body.location,
                                        ),
                                    },
                                ],
                                loc: kase.body.location,
                            },
                            // void_,
                            kase.body.location,
                            [],
                            // 'kase body',
                        ),
                    },
                    printLambdaBody(
                        env,
                        opts,
                        kase.body,
                        // effectHandlers,
                        cps,
                    ),
                ),
                // void_,
                term.pure.body.location,
                [],
                // 'handle i thnk',
            );
        }),
        is: tupleType(
            term.cases.map((_, i) =>
                effectConstructorType(
                    env,
                    opts,
                    {
                        type: 'ref',
                        ref: term.effect,
                    },
                    effDev[i],
                    term.location,
                ),
            ),
            term.location,
        ), // lol
    };
};

export const withSyncDone = (
    env: Env,
    opts: OutputOptions,
    vt: Type,
    loc: Loc,
    fn: (cps: CPS) => Array<Stmt>,
): Expr => {
    const sym: Symbol = newSym(env, 'result');
    const doneS: Symbol = newSym(env, 'done');
    const doneT: Type = pureFunction(
        // No effects here, we don't have any info about them I dont think.
        [...handlerTypesForEffects(env, opts, [], loc), vt],
        void_,
    );
    const { args, handlers } = handleArgsForEffects(env, opts, [], loc);

    return iffe(
        env,
        block(
            [
                define(sym, undefined, loc, vt, true),
                define(doneS, withSym(env, 'value', (value) =>
                    arrowFunctionExpression(
                        [...args, { type: vt, sym: value, loc }],
                        block([assign(sym, var_(value, loc, vt))], loc),
                        loc,
                    ),
                )),
                ...fn({ done: var_(doneS, loc, doneT), handlers }),
                returnStatement(var_(sym, loc, vt)),
            ],
            loc,
        ),
    );
};

const prependToBody = (stmt: Stmt, body: Expr | Block): Block => {
    if (body.type === 'Block') {
        return { ...body, items: [stmt, ...body.items] };
    } else {
        return {
            type: 'Block',
            items: [stmt, { type: 'Return', value: body, loc: body.loc }],
            loc: body.loc,
        };
    }
};
