// The bulk of stuff happens here

import {
    Env,
    Symbol,
    LambdaType,
    Handle,
    UserReference,
    EffectReference,
    Type as TermType,
} from '../../typing/types';
import { Expr, OutputOptions, Stmt, Type } from './types';
import {
    arrowFunctionExpression,
    pureFunction,
    typeFromTermType,
    void_,
} from './utils';

import { iffe, asBlock } from './utils';
import { printLambdaBody } from './lambda';
import { printTerm } from './term';

export const printHandle = (env: Env, opts: OutputOptions, term: Handle) => {
    if (opts.explicitHandlerFns) {
        return printHandleNew(env, opts, term, null);
    }
    const mapType = (t: TermType) => typeFromTermType(env, opts, t);
    const sym: Symbol = { name: 'result', unique: env.local.unique++ };
    return iffe(env, {
        type: 'Block',
        items: [
            {
                type: 'Define',
                sym,
                loc: term.location,
                value: null,
                fakeInit: true,
                is: mapType(term.is),
            },
            {
                type: 'Expression',
                expr: {
                    type: 'handle',
                    is: mapType(term.is),
                    target: printTerm(env, opts, term.target),
                    loc: term.location,
                    effect: (term.effect as UserReference).id,
                    pure: {
                        argType: mapType((term.target.is as LambdaType).res),
                        arg: term.pure.arg,
                        // body: printLambdaBody(
                        //     env,
                        //     opts,
                        //     term.pure.body,
                        //     null,
                        // ),
                        body: {
                            type: 'Block',
                            loc: term.pure.body.location,
                            items: [
                                {
                                    type: 'Assign',
                                    sym,
                                    is: mapType(term.pure.body.is),
                                    loc: term.pure.body.location,
                                    value: iffe(
                                        env,
                                        asBlock(
                                            printLambdaBody(
                                                env,
                                                opts,
                                                term.pure.body,
                                                null,
                                            ),
                                        ),
                                    ),
                                },
                            ],
                        },
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
                        body: {
                            type: 'Block',
                            loc: kase.body.location,
                            items: [
                                {
                                    type: 'Assign',
                                    sym,
                                    is: mapType(kase.body.is),
                                    loc: kase.body.location,
                                    value: iffe(
                                        env,
                                        asBlock(
                                            printLambdaBody(
                                                env,
                                                opts,
                                                kase.body,
                                                null,
                                            ),
                                        ),
                                    ),
                                },
                            ],
                        },
                    })),
                    done: null,
                },
                loc: term.location,
            },
            {
                type: 'Return',
                value: {
                    type: 'var',
                    sym,
                    loc: term.location,
                    is: mapType(term.is),
                },
                loc: term.location,
            },
        ],
        loc: term.location,
    });
};

import { EffectHandlers, effectHandlerType } from './cps';
import { refName } from '../../typing/env';
import { printHandleNew } from './handle-new';

// export const printHandleNew = (
//     env: Env,
//     opts: OutputOptions,
//     term: Handle,
//     effectHandlers: EffectHandlers,
//     cps: Expr | null,
// ) => {
//     /*
//             handle! fn {
//                 Write.write((v) => k) => xyz,
//                 pure(x) => z,
//             }

//             becomes

//             let fnReturnPointer = {pure as a function that just takes a value}
//             fn([
//                 (value: string, rawK: (handler: handle123123, returnValue: string) => void) => {
//                     const k = (returnValue: string, handler: handle123123, returnToHandler: ...) => {
//                         fnReturnPointer = returnToHandler
//                         rawK(handler, reyturnValue)
//                     }
//                     // k is now set.
//                 }
//             ], (_handlerIThink, returnValue) => fnReturnPointer(returnValue))

//             // ok worth a shot

//             */
//     const sym: Symbol = { name: 'result', unique: env.local.unique++ };
//     const doneS: Symbol = { name: 'done', unique: env.local.unique++ };
//     const doneT: Type = pureFunction([
//             typeFromTermType(term.is)], void_)
//     const doneVar: Expr = cps || {
//         type: 'var',
//         sym: doneS,
//         loc: null,
//         is: doneT,
//     };
//     const returnHandler: Symbol = {
//         name: 'returnHandler',
//         unique: env.local.unique++,
//     };
//     const finalValue: Symbol = {
//         name: 'finalValue',
//         unique: env.local.unique++,
//     };
//     const fnReturnPointer: Symbol = {
//         name: 'fnReturnPointer',
//         unique: env.local.unique++,
//     };
//     const targetType = term.target.is as LambdaType;
//     const effRef: EffectReference = { type: 'ref', ref: term.effect };
//     const effDev = env.global.effects[refName(term.effect)];
//     const handlerSym: Symbol = { name: 'handler', unique: env.local.unique++ };
//     effectHandlers = {
//         ...effectHandlers,
//         [refName(effRef.ref)]: {
//             sym: handlerSym,
//             expr: {
//                 type: 'var',
//                 sym: handlerSym,
//                 loc: term.location,
//                 is: effectHandlerType(env, effRef),
//             },
//         },
//     };
//     return iffe(
//         env,
//         {
//             type: 'Block',
//             items: [
//                 ...(cps
//                     ? []
//                     : ([
//                           {
//                               type: 'Define',
//                               sym,
//                               loc: term.location,
//                               value: null,
//                               is: term.is,
//                               fakeInitialization: true,
//                           },
//                           {
//                               type: 'Define',
//                               sym: doneS,
//                               loc: term.location,
//                               is: doneT,
//                               value: arrowFunctionExpression(
//                                   [
//                                       {
//                                           sym: finalValue,
//                                           type: typeFromTermType(term.is),
//                                           loc: term.location,
//                                       },
//                                   ],
//                                   {
//                                       type: 'Block',
//                                       loc: term.location,
//                                       items: [
//                                           {
//                                               type: 'Assign',
//                                               sym,
//                                               value: {
//                                                   type: 'var',
//                                                   sym: finalValue,
//                                                   loc: term.location,
//                                                   is: typeFromTermType(term.is),
//                                               },
//                                               is: void_,
//                                               loc: term.location,
//                                           },
//                                       ],
//                                   },
//                                 //   void_,
//                                   term.location,
//                                 //   [],
//                                 //   'done',
//                               ),
//                           },
//                       ] as Array<Stmt>)),
//                 {
//                     type: 'Define',
//                     sym: fnReturnPointer,
//                     loc: term.location,
//                     value: arrowFunctionExpression(
//                         [
//                             {
//                                 sym: returnHandler,
//                                 type: effectHandlerType(env, effRef),
//                                 loc: term.pure.body.location,
//                             },
//                             {
//                                 sym: term.pure.arg,
//                                 type: (term.target.is as LambdaType).res,
//                                 loc: term.pure.body.location,
//                             },
//                         ],
//                         printLambdaBody(
//                             env,
//                             opts,
//                             term.pure.body,
//                             // here's where we'd pass them in if they existed.
//                             // effectHandlers,
//                             doneVar,
//                         ),
//                         void_,
//                         term.pure.body.location,
//                     ),
//                 },
//                 {
//                     type: 'Define',
//                     sym: handlerSym,
//                     loc: term.location,
//                     is: effectHandlerType(env, effRef),
//                     value: {
//                         type: 'tuple',
//                         loc: term.location,
//                         // TODO: Delete this attribute? duplicate. oh maybe not
//                         itemTypes: term.cases.map((_, i) =>
//                             effectConstructorType(
//                                 env,
//                                 {
//                                     type: 'ref',
//                                     ref: term.effect,
//                                 },
//                                 effDev[i],
//                             ),
//                         ),
//                         items: term.cases.map((kase, i) => {
//                             const rawK: Symbol = {
//                                 name: 'rawK',
//                                 unique: env.local.unique++,
//                             };
//                             const kh: Symbol = {
//                                 name: 'handlers',
//                                 unique: env.local.unique++,
//                             };
//                             const returnToHandler: Symbol = {
//                                 name: 'returnToHandler',
//                                 unique: env.local.unique++,
//                             };
//                             const returnToHandlerType: Type = pureFunction(
//                                 [
//                                     effectHandlerType(env, effRef),
//                                     targetType.res,
//                                 ],
//                                 void_,
//                             );
//                             const isVoid = typesEqual(effDev[i].ret, void_);
//                             const value: Symbol | null = isVoid
//                                 ? null
//                                 : {
//                                       name: 'value',
//                                       unique: env.local.unique++,
//                                   };
//                             const rawKType: Type = pureFunction(
//                                 [
//                                     effectHandlerType(env, effRef),
//                                     ...(typesEqual(effDev[i].ret, void_)
//                                         ? []
//                                         : [effDev[i].ret]),
//                                 ],
//                                 void_,
//                             );
//                             return arrowFunctionExpression(
//                                 [
//                                     ...kase.args.map((sym, si) => ({
//                                         sym,
//                                         type: effDev[i].args[si],
//                                         loc: kase.body.location,
//                                     })),
//                                     {
//                                         sym: rawK,
//                                         type: rawKType,
//                                         loc: kase.body.location,
//                                     },
//                                 ],
//                                 prependToBody(
//                                     {
//                                         type: 'Define',
//                                         sym: kase.k,
//                                         loc: kase.body.location,
//                                         comment:
//                                             'the type ' +
//                                             printType(env, returnToHandlerType),
//                                         value: arrowFunctionExpression(
//                                             [
//                                                 ...(value == null
//                                                     ? []
//                                                     : [
//                                                           {
//                                                               sym: value,
//                                                               type:
//                                                                   effDev[i].ret,
//                                                               loc:
//                                                                   kase.body
//                                                                       .location,
//                                                           } as Arg,
//                                                       ]),
//                                                 {
//                                                     sym: kh,
//                                                     type: effectHandlerType(
//                                                         env,
//                                                         effRef,
//                                                     ),
//                                                     loc: kase.body.location,
//                                                 },
//                                                 {
//                                                     sym: returnToHandler,
//                                                     type: returnToHandlerType,
//                                                     loc: kase.body.location,
//                                                 },
//                                             ],
//                                             {
//                                                 type: 'Block',
//                                                 items: [
//                                                     {
//                                                         type: 'Assign',
//                                                         sym: fnReturnPointer,
//                                                         loc: kase.body.location,
//                                                         value: {
//                                                             type: 'var',
//                                                             sym: returnToHandler,
//                                                             loc:
//                                                                 kase.body
//                                                                     .location,
//                                                             is: returnToHandlerType,
//                                                         },
//                                                         is: void_,
//                                                     },
//                                                     {
//                                                         type: 'Expression',
//                                                         loc: kase.body.location,
//                                                         expr: callExpression(
//                                                             env,
//                                                             {
//                                                                 type: 'var',
//                                                                 sym: rawK,
//                                                                 loc:
//                                                                     kase.body
//                                                                         .location,
//                                                                 is: rawKType,
//                                                             },
//                                                             rawKType,
//                                                             void_,
//                                                             [
//                                                                 {
//                                                                     type: 'var',
//                                                                     sym: kh,
//                                                                     is: effectHandlerType(
//                                                                         env,
//                                                                         effRef,
//                                                                     ),
//                                                                     loc:
//                                                                         kase
//                                                                             .body
//                                                                             .location,
//                                                                 },
//                                                                 ...(value
//                                                                     ? [
//                                                                           {
//                                                                               type:
//                                                                                   'var',
//                                                                               sym: value,
//                                                                               loc:
//                                                                                   kase
//                                                                                       .body
//                                                                                       .location,
//                                                                               is:
//                                                                                   effDev[
//                                                                                       i
//                                                                                   ]
//                                                                                       .ret,
//                                                                           } as Expr,
//                                                                       ]
//                                                                     : []),
//                                                             ],
//                                                             kase.body.location,
//                                                         ),
//                                                     },
//                                                 ],
//                                                 loc: kase.body.location,
//                                             },
//                                             void_,
//                                             kase.body.location,
//                                             [],
//                                             'kase body',
//                                         ),
//                                     },
//                                     printLambdaBody(
//                                         env,
//                                         opts,
//                                         kase.body,
//                                         effectHandlers,
//                                         doneVar,
//                                     ),
//                                 ),
//                                 void_,
//                                 term.pure.body.location,
//                                 [],
//                                 'handle i thnk',
//                             );
//                         }),
//                         is: tupleType(
//                             term.cases.map((_, i) =>
//                                 effectConstructorType(
//                                     env,
//                                     {
//                                         type: 'ref',
//                                         ref: term.effect,
//                                     },
//                                     effDev[i],
//                                 ),
//                             ),
//                         ), // lol
//                     },
//                 },
//                 {
//                     type: 'Expression',
//                     expr: callExpression(
//                         env,
//                         printTerm(env, opts, term.target),
//                         term.target.is as LambdaType,
//                         void_,
//                         [
//                             ...sortedExplicitEffects(
//                                 (term.target.is as LambdaType).effects,
//                             ).map((r) => effectHandlers[refName(r.ref)].expr),
//                             arrowFunctionExpression(
//                                 [
//                                     ...sortedExplicitEffects(
//                                         (term.target.is as LambdaType).effects,
//                                     ).map((r) => ({
//                                         sym: effectHandlers[refName(r.ref)].sym,
//                                         type: effectHandlerType(env, r),
//                                         loc: term.pure.body.location,
//                                     })),
//                                     // {
//                                     //     sym: returnHandler,
//                                     //     type: effectHandlerType(env, {
//                                     //         type: 'ref',
//                                     //         ref: term.effect,
//                                     //     }),
//                                     //     loc: term.pure.body.location,
//                                     // },
//                                     {
//                                         sym: term.pure.arg,
//                                         type: (term.target.is as LambdaType)
//                                             .res,
//                                         loc: term.pure.body.location,
//                                     },
//                                 ],
//                                 callExpression(
//                                     env,
//                                     {
//                                         type: 'var',
//                                         sym: fnReturnPointer,
//                                         loc: term.location,
//                                         is: pureFunction(
//                                             [
//                                                 effectHandlerType(env, effRef),
//                                                 term.is,
//                                             ],
//                                             void_,
//                                             [],
//                                             term.location,
//                                             'handle-return-pointer',
//                                         ),
//                                     },
//                                     pureFunction(
//                                         [
//                                             effectHandlerType(env, effRef),
//                                             term.is,
//                                         ],
//                                         void_,
//                                         [],
//                                         term.location,
//                                         'calling-return-pointer-i-guess',
//                                     ),
//                                     void_,
//                                     [
//                                         {
//                                             type: 'var',
//                                             sym:
//                                                 effectHandlers[
//                                                     refName(effRef.ref)
//                                                 ].sym,
//                                             is: effectHandlerType(env, effRef),
//                                             loc: term.location,
//                                         },
//                                         // ...sortedExplicitEffects(
//                                         //     (term.target.is as LambdaType).effects,
//                                         // ).map((r) => effectHandlers[refName(r.ref)].expr),
//                                         {
//                                             type: 'var',
//                                             sym: term.pure.arg,
//                                             is: (term.target.is as LambdaType)
//                                                 .res,
//                                             loc: term.location,
//                                         },
//                                     ],
//                                     term.location,
//                                 ),
//                                 void_,
//                                 term.pure.body.location,
//                                 [],
//                                 'handle yes',
//                             ),
//                         ],
//                         term.location,
//                     ),
//                     loc: term.location,
//                 },
//                 ...(cps
//                     ? []
//                     : [
//                           {
//                               type: 'Return',
//                               value: {
//                                   type: 'var',
//                                   sym,
//                                   loc: term.location,
//                                   is: term.is,
//                               },
//                               loc: term.location,
//                           } as Stmt,
//                       ]),
//             ],
//             loc: term.location,
//         },
//         term.is,
//     );
// };

// const prependToBody = (stmt: Stmt, body: Expr | Block): Block => {
//     if (body.type === 'Block') {
//         return { ...body, items: [stmt, ...body.items] };
//     } else {
//         return {
//             type: 'Block',
//             items: [stmt, { type: 'Return', value: body, loc: body.loc }],
//             loc: body.loc,
//         };
//     }
// };
