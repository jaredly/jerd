// Ok so the tricky thing here is that I've been passing around `is`s like candy
// And now I'll want to mutate or update them ... and what do we do.
// Like, should I instead have the `.is` on terms potentially reference a previous definition?
// In the same way that syms don't own their names anymore?
// hmmmm
// because const x = [1,2,3];
// const y = x;
// I can't just change the x declaration's type,
// I have to follow it all the way down the line.
// Like :find a Define that is an array, where the right side has been determined. Synchronize them:
// Seems like a ton of work

import { newSym } from '../../../typing/env';
import { nullLocation } from '../../../typing/types';
import { debugExpr } from '../../irDebugPrinter';
import { printToString } from '../../printer';
import { defaultVisitor, transformExpr } from '../transform';
import {
    ArrayExpr,
    ArrayType,
    Assign,
    Expr,
    InferredSize,
    Loop,
    LoopBounds,
    Stmt,
    Type,
} from '../types';
import {
    builtin,
    callExpression,
    int,
    intLiteral,
    pureFunction,
} from '../utils';
import { Context, Optimizer2 } from './optimize';

const isAppendOrPrepend = (array: ArrayExpr) => {
    return (
        array.items.length === 2 &&
        array.items[0].type !== array.items[1].type &&
        (array.items[0].type === 'Spread' || array.items[1].type === 'Spread')
    );
};

export const loopSpreadToArraySet: Optimizer2 = (
    context: Context,
    expr: Expr,
) => {
    let replacement: null | [number, Expr] = null;
    const res = transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (
                replacement &&
                expr.type === 'var' &&
                expr.sym.unique === replacement[0]
            ) {
                return { ...replacement[1], loc: expr.loc };
            }
            if (expr.type !== 'lambda') {
                return null;
            }
            const arrayArgs = expr.args.filter((a) => a.type.type === 'Array');
            // let foundSym = null
            const loop = expr.body.items.find((t) => t.type === 'Loop') as Loop;
            if (!loop) {
                return null;
            }
            const respread = loop.body.items.find(
                (item) =>
                    item.type === 'Assign' &&
                    arrayArgs.find(
                        (arg) => arg.sym.unique === item.sym.unique,
                    ) &&
                    item.value.type === 'array' &&
                    item.value.items.find(
                        (m) =>
                            m.type === 'Spread' &&
                            m.value.type === 'var' &&
                            m.value.sym.unique === item.sym.unique,
                    ) &&
                    isAppendOrPrepend(item.value),
            ) as Assign;

            // STOPSHIP: Assert that the variable isn't reassigned anywhere else!

            // console.log('YES', respread);
            if (!respread) {
                return null;
            }
            const sym = newSym(context.env, 'newArray');
            const idxSym = newSym(context.env, 'idx');
            const arg = arrayArgs.find(
                (arg) => arg.sym.unique === respread.sym.unique,
            );
            const newType: ArrayType = {
                type: 'Array',
                inferredSize: null,
                inner: (arg!.type as ArrayType).inner,
                loc: expr.loc,
            };
            replacement = [
                respread.sym.unique,
                { type: 'var', sym, loc: nullLocation, is: newType },
            ];
            return {
                ...expr,
                body: {
                    ...expr.body,
                    items: ([
                        {
                            type: 'Define',
                            is: newType,
                            sym,
                        },
                        {
                            type: 'Define',
                            sym: idxSym,
                            is: int,
                            value: intLiteral(0, expr.loc),
                        },
                    ] as Array<Stmt>).concat(
                        expr.body.items.map((i) => {
                            if (i === loop) {
                                return {
                                    ...loop,
                                    body: {
                                        ...loop.body,
                                        items: loop.body.items.map((i) => {
                                            if (i === respread) {
                                                const value = i.value as ArrayExpr;
                                                // We're appending, great
                                                const m: Stmt = {
                                                    type: 'ArraySet',
                                                    idx: {
                                                        type: 'var',
                                                        sym: idxSym,
                                                        is: int,
                                                        loc: i.loc,
                                                    },
                                                    sym,
                                                    loc: i.loc,
                                                    value: value
                                                        .items[1] as Expr,
                                                };
                                                return {
                                                    type: 'Block',
                                                    items: [
                                                        m,
                                                        {
                                                            type: 'Assign',
                                                            loc: i.loc,
                                                            sym: idxSym,
                                                            value: callExpression(
                                                                context.env,
                                                                builtin(
                                                                    '+',
                                                                    i.loc,
                                                                    pureFunction(
                                                                        [
                                                                            int,
                                                                            int,
                                                                        ],
                                                                        int,
                                                                    ),
                                                                ),
                                                                [
                                                                    {
                                                                        type:
                                                                            'var',
                                                                        sym: idxSym,
                                                                        is: int,
                                                                        loc:
                                                                            i.loc,
                                                                    },
                                                                    intLiteral(
                                                                        1,
                                                                        i.loc,
                                                                    ),
                                                                ],
                                                                i.loc,
                                                            ),
                                                            is: int,
                                                        },
                                                    ],
                                                    loc: i.loc,
                                                };
                                            } else {
                                                return i;
                                            }
                                        }),
                                    },
                                };
                            } else {
                                return i;
                            }
                        }),
                    ),
                },
            };
        },
    });
    // if (res !== expr) {
    //     console.log('TRANSFORMED');
    //     console.log(printToString(debugExpr(context.env, res), 100));
    // }
    return res;
};

export const inferArraySize: Optimizer2 = (context: Context, expr: Expr) => {
    const updatedSyms: { [key: number]: InferredSize } = {};
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (
                expr.type === 'arrayIndex' &&
                expr.value.type === 'array' &&
                expr.idx.type === 'int'
            ) {
                const items = expr.value.items.filter(
                    (e) => e.type !== 'Spread',
                ) as Array<Expr>;
                if (
                    items.length === expr.value.items.length &&
                    expr.idx.value < items.length
                ) {
                    return items[expr.idx.value];
                }
                return null;
            }
            if (
                expr.type === 'arrayLen' &&
                expr.value.is.type === 'Array' &&
                expr.value.is.inferredSize &&
                expr.value.is.inferredSize.type === 'exactly'
            ) {
                return {
                    type: 'int',
                    value: expr.value.is.inferredSize.size,
                    loc: expr.loc,
                    is: int,
                };
            }
            if (
                expr.type === 'array' &&
                expr.is.type === 'Array' &&
                expr.is.inferredSize == null
            ) {
                const hasSpread = expr.items.some((s) => s.type === 'Spread');
                if (!hasSpread) {
                    return {
                        ...expr,
                        is: {
                            ...expr.is,
                            inferredSize: {
                                type: 'exactly',
                                size: expr.items.length,
                            },
                        },
                    };
                }
            }
            if (
                expr.type === 'var' &&
                expr.is.type === 'Array' &&
                updatedSyms[expr.sym.unique]
            ) {
                return {
                    ...expr,
                    is: {
                        ...expr.is,
                        inferredSize: updatedSyms[expr.sym.unique],
                    },
                };
            }
            return null;
        },
        stmt: (stmt) => {
            if (
                stmt.type === 'Define' &&
                stmt.is.type === 'Array' &&
                stmt.is.inferredSize == null &&
                stmt.value &&
                stmt.value.is.type === 'Array' &&
                stmt.value.is.inferredSize != null
            ) {
                updatedSyms[stmt.sym.unique] = stmt.value.is.inferredSize;
                return {
                    ...stmt,
                    is: {
                        ...stmt.is,
                        inferredSize: stmt.value.is.inferredSize,
                    },
                };
            }
            return null;
        },
    });
};
