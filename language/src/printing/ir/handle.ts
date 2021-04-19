// The bulk of stuff happens here

import {
    Term,
    Handle,
    Env,
    Type,
    getEffects,
    Symbol,
    Reference,
    Let,
    Var,
    EffectRef,
    Lambda,
    LambdaType,
    walkTerm,
    Pattern,
    UserReference,
    EffectReference,
    typesEqual,
} from '../../typing/types';
import {
    binOps,
    bool,
    builtinType,
    float,
    int,
    pureFunction,
    string,
    void_,
} from '../../typing/preset';
import { showType } from '../../typing/unify';
import {
    applyEffectVariables,
    getEnumReferences,
    showLocation,
    tupleType,
} from '../../typing/typeExpr';
import { idFromName, idName, refName } from '../../typing/env';

import {
    Loc,
    Expr,
    Stmt,
    callExpression,
    OutputOptions,
    Arg,
    Block,
} from './types';

import {
    effectConstructorType,
    EffectHandlers,
    effectHandlerType,
    maybeWrapPureFunction,
    termToAstCPS,
} from './cps';
import {
    iffe,
    arrowFunctionExpression,
    blockStatement,
    ifStatement,
    returnStatement,
    isConstant,
    builtin,
    asBlock,
} from './utils';
import { printPattern } from './pattern';
import { printLambda, printLambdaBody } from './lambda';
import { printTerm } from './term';

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
    const effRef: EffectReference = { type: 'ref', ref: term.effect };
    const effDev = env.global.effects[refName(term.effect)];
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
                              is: term.is,
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
                    is: term.is,
                },
                {
                    type: 'Expression',
                    expr: callExpression(
                        printTerm(env, opts, term.target),
                        term.target.is as LambdaType,
                        void_,
                        // STOPSHIP: we need to pass in any other handlers that we have
                        // that this thin is expecting.
                        // so really, add this to the effectHandlers map
                        // START HERE PLESE
                        [
                            // Here's where we'd change to have a builtin handlers type probably
                            {
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
                                            effDev[i].ret,
                                        ],
                                        void_,
                                    );
                                    const isVoid = typesEqual(
                                        effDev[i].ret,
                                        void_,
                                    );
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
                                            // {
                                            //     sym: term.pure.arg,
                                            //     type: (term.target
                                            //         .is as LambdaType)
                                            //         .res,
                                            //     loc:
                                            //         term.pure.body
                                            //             .location,
                                            // },
                                        ] as Array<Arg>,
                                        res: void_,
                                        loc: term.pure.body.location,
                                        is: pureFunction(
                                            [
                                                (term.target.is as LambdaType)
                                                    .res,
                                            ],
                                            void_,
                                        ),
                                        // OKKKK so the last thing to do here
                                        // is redefine `k`
                                        // so that it sets the fnReturnPointer
                                        // I think that's it?
                                        body: prependToBody(
                                            {
                                                type: 'Define',
                                                sym: kase.k,
                                                loc: kase.body.location,
                                                value: {
                                                    type: 'lambda',
                                                    is: pureFunction(
                                                        [
                                                            ...(isVoid
                                                                ? []
                                                                : [
                                                                      effDev[i]
                                                                          .ret,
                                                                  ]),
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
                                                                          effDev[
                                                                              i
                                                                          ].ret,
                                                                      loc:
                                                                          kase
                                                                              .body
                                                                              .location,
                                                                  } as Arg,
                                                              ]),
                                                        {
                                                            sym: kh,
                                                            type: effectHandlerType(
                                                                env,
                                                                effRef,
                                                            ),
                                                            loc:
                                                                kase.body
                                                                    .location,
                                                        },
                                                        {
                                                            sym: returnToHandler,
                                                            type: returnToHandlerType,
                                                            loc:
                                                                kase.body
                                                                    .location,
                                                        },
                                                    ],
                                                    body: {
                                                        type: 'Block',
                                                        items: [
                                                            {
                                                                type: 'Assign',
                                                                sym: fnReturnPointer,
                                                                loc:
                                                                    kase.body
                                                                        .location,
                                                                value: {
                                                                    type: 'var',
                                                                    sym: returnToHandler,
                                                                    loc:
                                                                        kase
                                                                            .body
                                                                            .location,
                                                                    is: returnToHandlerType,
                                                                },
                                                                is: void_,
                                                            },
                                                            {
                                                                type:
                                                                    'Expression',
                                                                loc:
                                                                    kase.body
                                                                        .location,
                                                                expr: {
                                                                    type:
                                                                        'apply',
                                                                    is: void_,
                                                                    targetType: kType,
                                                                    concreteType: kType,
                                                                    target: {
                                                                        type:
                                                                            'var',
                                                                        sym: rawK,
                                                                        loc:
                                                                            kase
                                                                                .body
                                                                                .location,
                                                                        is: kType,
                                                                    },
                                                                    args: [
                                                                        {
                                                                            type:
                                                                                'var',
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
                                                                        kase
                                                                            .body
                                                                            .location,
                                                                },
                                                            },
                                                        ],
                                                        loc: kase.body.location,
                                                    },
                                                    loc: kase.body.location,
                                                },
                                                is: void_,
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
                            {
                                type: 'lambda',
                                args: [
                                    {
                                        sym: returnHandler,
                                        type: effectHandlerType(env, {
                                            type: 'ref',
                                            ref: term.effect,
                                        }),
                                        loc: term.pure.body.location,
                                    },
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
                                            sym: returnHandler,
                                            is: effectHandlerType(env, effRef),
                                            loc: term.location,
                                        },
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
                    /* expr: {
                                type: 'handle',
                                target: printTerm(env, opts, term.target),
                                loc: term.location,
                                effect: (term.effect as UserReference).id,
                                pure: {
                                    arg: term.pure.arg,
                                    body: {
                                        type: 'Block',
                                        loc: term.pure.body.location,
                                        items: [
                                            {
                                                type: 'Assign',
                                                sym,
                                                is: term.pure.body.is,
                                                loc: term.pure.body.location,
                                                value: iffe(
                                                    asBlock(
                                                        printLambdaBody(
                                                            env,
                                                            opts,
                                                            term.pure.body,
                                                            {},
                                                            null,
                                                        ),
                                                    ),
                                                    term.pure.body.is,
                                                ),
                                            },
                                        ],
                                    },
                                },
                                cases: term.cases.map((kase) => ({
                                    ...kase,
                                    body: {
                                        type: 'Block',
                                        loc: kase.body.location,
                                        items: [
                                            {
                                                type: 'Assign',
                                                sym,
                                                is: kase.body.is,
                                                loc: kase.body.location,
                                                value: iffe(
                                                    asBlock(
                                                        printLambdaBody(
                                                            env,
                                                            opts,
                                                            kase.body,
                                                            {},
                                                            null,
                                                        ),
                                                    ),
                                                    kase.body.is,
                                                ),
                                            },
                                        ],
                                    },
                                })),
                                done: null,
                                is: term.pure.body.is,
                            },
                            */
                    loc: term.location,
                },
                {
                    type: 'Return',
                    value: {
                        type: 'var',
                        sym,
                        loc: term.location,
                        is: term.is,
                    },
                    loc: term.location,
                },
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
