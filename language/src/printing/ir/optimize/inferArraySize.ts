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

import { idName, newSym } from '../../../typing/env';
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
    LambdaType,
    Loop,
    LoopBounds,
    loopCount,
    returnTypeForStmt,
    Stmt,
    Type,
} from '../types';
import {
    builtin,
    callExpression,
    int,
    intLiteral,
    pureFunction,
    var_,
} from '../utils';
import { specializeFunction } from './monoconstant';
import { monomorphize } from './monomorphize';
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
            if (!loop || !loop.bounds) {
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

            if (!respread) {
                return null;
            }
            const arg = arrayArgs.find(
                (arg) => arg.sym.unique === respread.sym.unique,
            );
            const at = arg!.type as ArrayType;
            // This needs to have been inferred already
            if (at.inferredSize === null) {
                return null;
            }
            const sym = newSym(context.env, 'newArray');
            const idxSym = newSym(context.env, 'idx');

            // ok so we need to calculate the size of the loop
            const loopSize = loopCount(loop.bounds);
            if (!loopSize) {
                return null;
            }

            const newType: ArrayType = {
                type: 'Array',
                inferredSize: {
                    type: 'relative',
                    offset: loopSize,
                    to: at.inferredSize,
                },
                inner: (arg!.type as ArrayType).inner,
                loc: expr.loc,
            };
            replacement = [
                respread.sym.unique,
                { type: 'var', sym, loc: nullLocation, is: newType },
            ];
            let startingIndex: Expr;
            // Append
            if ((respread.value as ArrayExpr).items[0].type === 'Spread') {
                startingIndex = intLiteral(0, expr.loc);
            } else {
                // TODO: This needs to be -1, right?
                switch (loopSize.type) {
                    case 'exactly':
                        startingIndex = intLiteral(loopSize.size, expr.loc);
                        break;
                    case 'constant':
                        startingIndex = var_(loopSize.sym, expr.loc, int);
                        break;
                    default:
                        return null;
                }
                // startingIndex = loop.bounds.
            }
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
                            value: startingIndex,
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
                                                if (value.items.length !== 2) {
                                                    throw new Error(
                                                        `Only length 2 arrays supported just now`,
                                                    );
                                                }
                                                let valueToAdd;
                                                let offset;
                                                if (
                                                    value.items[0].type ===
                                                        'Spread' &&
                                                    value.items[1].type !==
                                                        'Spread'
                                                ) {
                                                    valueToAdd = value.items[1];
                                                    offset = intLiteral(
                                                        1,
                                                        i.loc,
                                                    );
                                                } else if (
                                                    value.items[1].type ===
                                                        'Spread' &&
                                                    value.items[0].type !==
                                                        'Spread'
                                                ) {
                                                    valueToAdd = value.items[0];
                                                    offset = intLiteral(
                                                        -1,
                                                        i.loc,
                                                    );
                                                } else {
                                                    return i;
                                                }

                                                // if (
                                                //     value.items[0].type ===
                                                //         'Spread' &&
                                                //     value.items[1].type !==
                                                //         'Spread'
                                                // ) {
                                                // We're appending, great
                                                const arraySet: Stmt = {
                                                    type: 'ArraySet',
                                                    idx: {
                                                        type: 'var',
                                                        sym: idxSym,
                                                        is: int,
                                                        loc: i.loc,
                                                    },
                                                    sym,
                                                    loc: i.loc,
                                                    value: valueToAdd,
                                                };
                                                const update: Stmt = {
                                                    type: 'Assign',
                                                    loc: i.loc,
                                                    sym: idxSym,
                                                    value: callExpression(
                                                        context.env,
                                                        builtin(
                                                            '+',
                                                            i.loc,
                                                            pureFunction(
                                                                [int, int],
                                                                int,
                                                            ),
                                                        ),
                                                        [
                                                            {
                                                                type: 'var',
                                                                sym: idxSym,
                                                                is: int,
                                                                loc: i.loc,
                                                            },
                                                            offset,
                                                        ],
                                                        i.loc,
                                                    ),
                                                    is: int,
                                                };
                                                return {
                                                    type: 'Block',
                                                    items: [arraySet, update],
                                                    loc: i.loc,
                                                };
                                                // } else if (
                                                //     value.items[1].type ===
                                                //         'Spread' &&
                                                //     value.items[0].type !==
                                                //         'Spread'

                                                // ) {
                                                //     return i;
                                                // }
                                                // return i
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

// START HERE:
// - when specializing a function for array size,
//   we have to check all inferredSizes of all array types in the function,
//   substituting: Array literals {type: 'variable'}, and int literals {type: 'constant'}

export const inferArraySize: Optimizer2 = (context: Context, expr: Expr) => {
    const updatedSyms: { [key: number]: InferredSize } = {};
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (
                expr.type === 'apply' &&
                expr.target.type === 'term' &&
                expr.is.type === 'Array' &&
                expr.is.inferredSize == null &&
                expr.args.length > 0 &&
                // TODO: Should I do this incrementally? idk.
                // I think I only want to substitute once I can /know/ that the
                // resulting things will all be 'exact'.
                // So this is the simple way, but doing the second route would probably
                // also work, and would be more flexible. And it also wouldn't give spurious
                // results.
                // So yeah, I think I want: any args that are used in the `.res` array.
                // But what if the array use is strictly localized? I'd still need to track that.
                // So really, it's any arg that's used in the body at all. Which would result in
                // maybe too much duplicate computation. Should I memoize the "looking for arrays"?
                !expr.args.some(
                    (e) =>
                        e.type !== 'int' &&
                        (e.type !== 'array' ||
                            !e.is.inferredSize ||
                            e.is.inferredSize.type !== 'exactly'),
                )
                // expr.args.some((e) => e.type === 'int' || e.type === 'array')
            ) {
                const term = context.exprs[idName(expr.target.id)];
                if (
                    !term ||
                    term.expr.type !== 'lambda' ||
                    term.expr.res.type !== 'Array'
                    // term.expr.res.inferredSize == null
                ) {
                    // console.error('NOO', term.expr.is);
                    return null;
                }
                // console.error('YAAA');
                const newExpr = specializeFunction(
                    context,
                    expr,
                    expr.args
                        .map((arg, i) => ({ i, arg }))
                        .filter(
                            (arg) =>
                                arg.arg.type === 'int' ||
                                arg.arg.type === 'array',
                        ),
                );
                return newExpr;
            }
            if (expr.type === 'lambda') {
                let changed = false;
                const args = expr.args.map((arg) => {
                    if (
                        arg.type.type === 'Array' &&
                        arg.type.inferredSize === null
                    ) {
                        changed = true;
                        const size: InferredSize = {
                            type: 'variable',
                            sym: newSym(context.env, 'size'),
                        };
                        const t: ArrayType = {
                            ...arg.type,
                            inferredSize: size,
                        };
                        updatedSyms[arg.sym.unique] = size;
                        return { ...arg, type: t };
                    }
                    return arg;
                });
                let res = expr.res;
                if (
                    expr.res.type === 'Array' &&
                    expr.res.inferredSize == null
                ) {
                    const newRes = returnTypeForStmt(expr.body);
                    if (
                        newRes &&
                        newRes.type === 'Array' &&
                        newRes.inferredSize != null
                    ) {
                        res = newRes;
                    }
                }
                const is = expr.is as LambdaType;
                return changed || res !== expr.res
                    ? {
                          ...expr,
                          args,
                          res,
                          is: { ...is, args: args.map((a) => a.type), res },
                      }
                    : null;
            }
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
                expr.type === 'apply' &&
                expr.target.type === 'builtin' &&
                expr.target.name === 'len' &&
                expr.args.length === 1 &&
                expr.args[0].is.type === 'Array' &&
                expr.args[0].is.inferredSize &&
                expr.args[0].is.inferredSize.type === 'exactly'
            ) {
                return {
                    type: 'int',
                    value: expr.args[0].is.inferredSize.size,
                    loc: expr.loc,
                    is: int,
                };
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
