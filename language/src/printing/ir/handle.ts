// The bulk of stuff happens here

import {
    Handle,
    Env,
    Type,
    Symbol,
    LambdaType,
    EffectReference,
    typesEqual,
} from '../../typing/types';
import { pureFunction, void_ } from '../../typing/preset';
import { tupleType } from '../../typing/typeExpr';
import { refName } from '../../typing/env';

import { Expr, Stmt, callExpression, OutputOptions, Arg, Block } from './types';

import {
    effectConstructorType,
    EffectHandlers,
    effectHandlerType,
} from './cps';
import { iffe } from './utils';
import { printLambdaBody, sortedExplicitEffects } from './lambda';
import { printTerm } from './term';
import { showType } from '../../typing/unify';
import { printType } from '../typeScriptPrinter';

export const printHandle = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    effectHandlers: EffectHandlers,
    cps: Expr | null,
) => {
    /*
            handle! fn {
                Write.write((v) => k) => xyz,
                pure(x) => z,
            }

            becomes


            let fnReturnPointer = {pure as a function that just takes a value}
            fn([
                (value: string, done: (handler: handle123123) => void) => {
                    const k = (handler, returnToHandler) => {
                        fnReturnPointer = returnToHandler
                        done(handler)
                    }
                    // k is now set.
                }
            ], (_handlerIThink, returnValue) => fnReturnPointer(returnValue))

            // ok worth a shot

            */
    const sym: Symbol = { name: 'result', unique: env.local.unique++ };
    const doneS: Symbol = { name: 'done', unique: env.local.unique++ };
    const doneVar: Expr = cps || {
        type: 'var',
        sym: doneS,
        loc: null,
        is: pureFunction([term.is], void_),
    };
    const returnHandler: Symbol = {
        name: 'returnHandler',
        unique: env.local.unique++,
    };
    const finalValue: Symbol = {
        name: 'finalValue',
        unique: env.local.unique++,
    };
    const fnReturnPointer: Symbol = {
        name: 'fnReturnPointer',
        unique: env.local.unique++,
    };
    const targetType = term.target.is as LambdaType;
    const effRef: EffectReference = { type: 'ref', ref: term.effect };
    const effDev = env.global.effects[refName(term.effect)];
    const handlerSym: Symbol = { name: 'handler', unique: env.local.unique++ };
    effectHandlers = {
        ...effectHandlers,
        [refName(effRef.ref)]: {
            sym: handlerSym,
            expr: {
                type: 'var',
                sym: handlerSym,
                loc: term.location,
                is: effectHandlerType(env, effRef),
            },
        },
    };
    return iffe(
        {
            type: 'Block',
            items: [
                ...(cps
                    ? []
                    : ([
                          {
                              type: 'Define',
                              sym,
                              loc: term.location,
                              value: null,
                              is: term.is,
                              fakeInitialization: true,
                          },
                          {
                              type: 'Define',
                              sym: doneS,
                              loc: term.location,
                              value: {
                                  type: 'lambda',
                                  args: [
                                      {
                                          sym: finalValue,
                                          type: term.is,
                                          loc: term.location,
                                      },
                                  ],
                                  res: void_,
                                  loc: term.location,
                                  body: {
                                      type: 'Block',
                                      loc: term.location,
                                      items: [
                                          {
                                              type: 'Assign',
                                              sym,
                                              value: {
                                                  type: 'var',
                                                  sym: finalValue,
                                                  loc: term.location,
                                                  is: term.is,
                                              },
                                              is: void_,
                                              loc: term.location,
                                          },
                                      ],
                                  },
                                  is: pureFunction([term.is], void_),
                              },
                          },
                      ] as Array<Stmt>)),
                {
                    type: 'Define',
                    sym: fnReturnPointer,
                    loc: term.location,
                    value: {
                        type: 'lambda',
                        args: [
                            {
                                sym: returnHandler,
                                type: effectHandlerType(env, effRef),
                                loc: term.pure.body.location,
                            },
                            {
                                sym: term.pure.arg,
                                type: (term.target.is as LambdaType).res,
                                loc: term.pure.body.location,
                            },
                        ],
                        res: void_,
                        loc: term.pure.body.location,
                        is: pureFunction(
                            [
                                effectHandlerType(env, effRef),
                                (term.target.is as LambdaType).res,
                            ],
                            void_,
                        ),
                        body: printLambdaBody(
                            env,
                            opts,
                            term.pure.body,
                            // here's where we'd pass them in if they existed.
                            effectHandlers,
                            doneVar,
                        ),
                    },
                },
                {
                    type: 'Define',
                    sym: handlerSym,
                    loc: term.location,
                    is: effectHandlerType(env, effRef),
                    value: {
                        type: 'tuple',
                        loc: term.location,
                        // TODO: Delete this attribute? duplicate. oh maybe not
                        itemTypes: term.cases.map((_, i) =>
                            effectConstructorType(
                                env,
                                {
                                    type: 'ref',
                                    ref: term.effect,
                                },
                                effDev[i],
                            ),
                        ),
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
                                [
                                    effectHandlerType(env, effRef),
                                    targetType.res,
                                ],
                                void_,
                            );
                            const isVoid = typesEqual(effDev[i].ret, void_);
                            const value: Symbol | null = isVoid
                                ? null
                                : {
                                      name: 'value',
                                      unique: env.local.unique++,
                                  };
                            const kType: Type = pureFunction(
                                [
                                    effectHandlerType(env, effRef),
                                    ...(typesEqual(effDev[i].ret, void_)
                                        ? []
                                        : [effDev[i].ret]),
                                ],
                                void_,
                            );
                            return {
                                type: 'lambda',
                                args: [
                                    ...kase.args.map((sym, si) => ({
                                        sym,
                                        type: effDev[i].args[si],
                                        loc: kase.body.location,
                                    })),
                                    {
                                        sym: rawK,
                                        type: kType,
                                    },
                                ] as Array<Arg>,
                                res: void_,
                                loc: term.pure.body.location,
                                is: pureFunction([targetType.res], void_),
                                // OKKKK so the last thing to do here
                                // is redefine `k`
                                // so that it sets the fnReturnPointer
                                // I think that's it?
                                body: prependToBody(
                                    {
                                        type: 'Define',
                                        sym: kase.k,
                                        loc: kase.body.location,
                                        comment:
                                            'the type ' +
                                            printType(env, returnToHandlerType),
                                        value: {
                                            type: 'lambda',
                                            is: pureFunction(
                                                [
                                                    ...(isVoid
                                                        ? []
                                                        : [effDev[i].ret]),
                                                    effectHandlerType(
                                                        env,
                                                        effRef,
                                                    ),
                                                    returnToHandlerType,
                                                ],
                                                void_,
                                            ),
                                            res: void_,
                                            args: [
                                                ...(value == null
                                                    ? []
                                                    : [
                                                          {
                                                              sym: value,
                                                              type:
                                                                  effDev[i].ret,
                                                              loc:
                                                                  kase.body
                                                                      .location,
                                                          } as Arg,
                                                      ]),
                                                {
                                                    sym: kh,
                                                    type: effectHandlerType(
                                                        env,
                                                        effRef,
                                                    ),
                                                    loc: kase.body.location,
                                                },
                                                {
                                                    sym: returnToHandler,
                                                    type: returnToHandlerType,
                                                    loc: kase.body.location,
                                                },
                                            ],
                                            body: {
                                                type: 'Block',
                                                items: [
                                                    {
                                                        type: 'Assign',
                                                        sym: fnReturnPointer,
                                                        loc: kase.body.location,
                                                        value: {
                                                            type: 'var',
                                                            sym: returnToHandler,
                                                            loc:
                                                                kase.body
                                                                    .location,
                                                            is: returnToHandlerType,
                                                        },
                                                        is: void_,
                                                    },
                                                    {
                                                        type: 'Expression',
                                                        loc: kase.body.location,
                                                        expr: {
                                                            type: 'apply',
                                                            is: void_,
                                                            targetType: kType,
                                                            concreteType: kType,
                                                            target: {
                                                                type: 'var',
                                                                sym: rawK,
                                                                loc:
                                                                    kase.body
                                                                        .location,
                                                                is: kType,
                                                            },
                                                            args: [
                                                                {
                                                                    type: 'var',
                                                                    sym: kh,
                                                                    is: effectHandlerType(
                                                                        env,
                                                                        effRef,
                                                                    ),
                                                                    loc:
                                                                        kase
                                                                            .body
                                                                            .location,
                                                                },
                                                                ...(value
                                                                    ? [
                                                                          {
                                                                              type:
                                                                                  'var',
                                                                              sym: value,
                                                                              loc:
                                                                                  kase
                                                                                      .body
                                                                                      .location,
                                                                              is:
                                                                                  effDev[
                                                                                      i
                                                                                  ]
                                                                                      .ret,
                                                                          } as Expr,
                                                                      ]
                                                                    : []),
                                                            ],
                                                            loc:
                                                                kase.body
                                                                    .location,
                                                        },
                                                    },
                                                ],
                                                loc: kase.body.location,
                                            },
                                            loc: kase.body.location,
                                        },
                                    },
                                    printLambdaBody(
                                        env,
                                        opts,
                                        kase.body,
                                        effectHandlers,
                                        doneVar,
                                    ),
                                ),
                            };
                        }),
                        is: tupleType(
                            term.cases.map((_, i) =>
                                effectConstructorType(
                                    env,
                                    {
                                        type: 'ref',
                                        ref: term.effect,
                                    },
                                    effDev[i],
                                ),
                            ),
                        ), // lol
                    },
                },
                {
                    type: 'Expression',
                    expr: callExpression(
                        printTerm(env, opts, term.target),
                        term.target.is as LambdaType,
                        void_,
                        [
                            ...sortedExplicitEffects(
                                (term.target.is as LambdaType).effects,
                            ).map((r) => effectHandlers[refName(r.ref)].expr),
                            {
                                type: 'lambda',
                                args: [
                                    ...sortedExplicitEffects(
                                        (term.target.is as LambdaType).effects,
                                    ).map((r) => ({
                                        sym: effectHandlers[refName(r.ref)].sym,
                                        type: effectHandlerType(env, r),
                                        loc: term.pure.body.location,
                                    })),
                                    // {
                                    //     sym: returnHandler,
                                    //     type: effectHandlerType(env, {
                                    //         type: 'ref',
                                    //         ref: term.effect,
                                    //     }),
                                    //     loc: term.pure.body.location,
                                    // },
                                    {
                                        sym: term.pure.arg,
                                        type: (term.target.is as LambdaType)
                                            .res,
                                        loc: term.pure.body.location,
                                    },
                                ],
                                res: void_,
                                loc: term.pure.body.location,
                                is: pureFunction(
                                    [
                                        effectHandlerType(env, {
                                            type: 'ref',
                                            ref: term.effect,
                                        }),
                                        (term.target.is as LambdaType).res,
                                    ],
                                    void_,
                                ),
                                body: callExpression(
                                    {
                                        type: 'var',
                                        sym: fnReturnPointer,
                                        loc: term.location,
                                        is: pureFunction([term.is], void_),
                                    },
                                    pureFunction(
                                        [
                                            effectHandlerType(env, effRef),
                                            term.is,
                                        ],
                                        void_,
                                    ),
                                    void_,
                                    [
                                        {
                                            type: 'var',
                                            sym:
                                                effectHandlers[
                                                    refName(effRef.ref)
                                                ].sym,
                                            is: effectHandlerType(env, effRef),
                                            loc: term.location,
                                        },
                                        // ...sortedExplicitEffects(
                                        //     (term.target.is as LambdaType).effects,
                                        // ).map((r) => effectHandlers[refName(r.ref)].expr),
                                        {
                                            type: 'var',
                                            sym: term.pure.arg,
                                            is: (term.target.is as LambdaType)
                                                .res,
                                            loc: term.location,
                                        },
                                    ],
                                    term.location,
                                ),
                            },
                        ],
                        term.location,
                    ),
                    loc: term.location,
                },
                ...(cps
                    ? []
                    : [
                          {
                              type: 'Return',
                              value: {
                                  type: 'var',
                                  sym,
                                  loc: term.location,
                                  is: term.is,
                              },
                              loc: term.location,
                          } as Stmt,
                      ]),
            ],
            loc: term.location,
        },
        term.is,
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
