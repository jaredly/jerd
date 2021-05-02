// The bulk of stuff happens here

import {
    Env,
    Symbol,
    LambdaType,
    Handle,
    UserReference,
    EffectReference,
    EffectRef,
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
} from './types';
import {
    arrowFunctionExpression,
    assign,
    callExpression,
    define,
    expressionStatement,
    lambdaTypeFromTermType,
    pureFunction,
    returnStatement,
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
} from './cps';

export const printHandleNew = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    done: Expr | null,
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

export const _printHandleNew = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    done: Expr,
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
    const targetType = lambdaTypeFromTermType(
        env,
        opts,
        term.target.is as LambdaType,
    ) as ILambdaType;

    const effectRef: EffectRef = { type: 'ref', ref: term.effect };

    const fnReturn = arrowFunctionExpression(
        [
            ...handleArgsForEffects(env, opts, [effectRef], term.location),
            {
                type: targetType.res,
                sym: term.pure.arg,
                loc: term.location,
            },
        ],
        printLambdaBody(env, opts, term.pure.body, done),
        term.location,
    );

    const fnDone = withSym(env, 'returnValue', (returnValue) =>
        arrowFunctionExpression(
            [
                ...handleArgsForEffects(env, opts, [effectRef], term.location),
                {
                    sym: returnValue,
                    type: targetType.res,
                    loc: term.location,
                },
            ],
            callExpression(
                env,
                var_(fnReturnPointer, term.location, fnReturn.is),
                [
                    ...handleValuesForEffects(
                        env,
                        opts,
                        fnReturn.is.args,
                        term.location,
                    ),
                    var_(returnValue, term.location, targetType.res),
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
        done,
        term.location,
    );
    const thisHandlerSym = newSym(env, 'thisHandler');

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
    done: Expr,
    loc: Loc,
): Expr => {
    const targetType = lambdaTypeFromTermType(
        env,
        opts,
        term.target.is as LambdaType,
    ) as ILambdaType;
    const effRef: EffectReference = { type: 'ref', ref: term.effect };
    const effDev = env.global.effects[refName(term.effect)];
    return {
        type: 'tuple',
        loc: term.location,
        items: term.cases.map((kase, i) => {
            const rawK: Symbol = {
                name: 'rawK',
                unique: env.local.unique++,
            };
            const kh: Symbol = {
                name: 'handlers',
                unique: env.local.unique++,
            };
            const returnToHandler: Symbol = {
                name: 'returnToHandler',
                unique: env.local.unique++,
            };
            const returnToHandlerType: Type = pureFunction(
                [effectHandlerType(env, effRef), targetType.res],
                void_,
            );
            const ret = typeFromTermType(env, opts, effDev[i].ret);
            const isVoid = typesEqual(ret, void_);
            const value: Symbol | null = isVoid
                ? null
                : {
                      name: 'value',
                      unique: env.local.unique++,
                  };
            const rawKType: Type = pureFunction(
                [
                    effectHandlerType(env, effRef),
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
                                    type: effectHandlerType(env, effRef),
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
                        done,
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
    fn: (done: Expr) => Array<Stmt>,
): Expr => {
    const sym: Symbol = newSym(env, 'result');
    const doneS: Symbol = newSym(env, 'done');
    const doneT: Type = pureFunction(
        [...handlerTypesForEffects(env, opts, []), vt],
        void_,
    );

    return iffe(
        env,
        block(
            [
                define(sym, undefined, loc, vt, true),
                define(doneS, withSym(env, 'value', (value) =>
                    arrowFunctionExpression(
                        [
                            ...handleArgsForEffects(env, opts, [], loc),
                            { type: vt, sym: value, loc },
                        ],
                        block([assign(sym, var_(value, loc, vt))], loc),
                        loc,
                    ),
                )),
                ...fn(var_(doneS, loc, doneT)),
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
