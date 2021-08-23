import { Expr } from '../intermediateRepresentation';
import { defaultVisitor, transformExpr } from '../transform';
import { floatLiteral, intLiteral } from '../utils';
import { Context } from './optimize';

const mathOps = ['+', '-', '*', '/'];

export const foldSimpleMath = (ctx: Context, expr: Expr) => {
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (
                expr.type === 'apply' &&
                expr.target.type === 'builtin' &&
                expr.target.name === 'len' &&
                expr.args.length === 1 &&
                expr.args[0].is.type === 'Array' &&
                expr.args[0].is.inferredSize &&
                expr.args[0].is.inferredSize.type === 'exactly'
            ) {
                return intLiteral(expr.args[0].is.inferredSize.size, expr.loc);
            }
            if (
                expr.type === 'arrayLen' &&
                expr.value.is.type === 'Array' &&
                expr.value.is.inferredSize &&
                expr.value.is.inferredSize.type === 'exactly'
            ) {
                return intLiteral(expr.value.is.inferredSize.size, expr.loc);
            }
            if (
                expr.type === 'apply' &&
                expr.target.type === 'builtin' &&
                mathOps.includes(expr.target.name) &&
                expr.args.every(
                    (arg) => arg.type === 'int' || arg.type === 'float',
                )
            ) {
                const values = expr.args.map((a) =>
                    a.type === 'int'
                        ? a.value
                        : a.type === 'float'
                        ? a.value
                        : null,
                ) as Array<number>;
                if (values.some((v) => v === null)) {
                    throw new Error(`Invariant`);
                }
                if (expr.args[0].type === 'int') {
                    if (expr.target.name === '*') {
                        return intLiteral(values[0] * values[1], expr.loc);
                    }
                    if (expr.target.name === '/') {
                        return intLiteral(
                            Math.floor(values[0] / values[1]),
                            expr.loc,
                        );
                    }
                    if (expr.target.name === '+') {
                        return intLiteral(values[0] + values[1], expr.loc);
                    }
                    if (expr.target.name === '-') {
                        if (values.length === 2) {
                            return intLiteral(values[0] - values[1], expr.loc);
                        } else {
                            return intLiteral(-values[0], expr.loc);
                        }
                    }
                } else {
                    if (expr.target.name === '*') {
                        return floatLiteral(values[0] * values[1], expr.loc);
                    }
                    if (expr.target.name === '/') {
                        return floatLiteral(
                            Math.floor(values[0] / values[1]),
                            expr.loc,
                        );
                    }
                    if (expr.target.name === '+') {
                        return floatLiteral(values[0] + values[1], expr.loc);
                    }
                    if (expr.target.name === '-') {
                        if (values.length === 2) {
                            return floatLiteral(
                                values[0] - values[1],
                                expr.loc,
                            );
                        } else {
                            return floatLiteral(-values[0], expr.loc);
                        }
                    }
                }
            }
            // Remove +/- 0
            if (
                expr.type === 'apply' &&
                expr.target.type === 'builtin' &&
                expr.args.length === 2 &&
                expr.target.name === '+' &&
                expr.args.some(
                    (a) =>
                        (a.type === 'int' || a.type === 'float') &&
                        a.value === 0,
                )
            ) {
                const other = expr.args.filter(
                    (a) =>
                        !(
                            (a.type === 'int' || a.type === 'float') &&
                            a.value === 0
                        ),
                );
                // Both zero?
                if (!other.length) {
                    return expr.args[0];
                }
                if (other.length !== 1) {
                    return null;
                }
                return other[0];
            }
            return null;
        },
    });
};
