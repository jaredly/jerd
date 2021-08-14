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
import { Expr } from '../types';
import { Context, Optimizer2 } from './optimize';

export const inferArraySize: Optimizer2 = (context: Context, expr: Expr) => {
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
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
