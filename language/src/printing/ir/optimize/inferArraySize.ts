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

import { defaultVisitor, transformExpr } from '../transform';
import { Expr, InferredSize, Type } from '../types';
import { int } from '../utils';
import { Context, Optimizer2 } from './optimize';

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
