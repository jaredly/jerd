import { hashObject } from '../../../typing/env';
import { Env, Id } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr } from '../types';
import { Exprs, optimizeAggressive, optimizeDefine } from './optimize';

export const findCapturedVariables = (lambda: Expr): Array<number> => {
    const captured: Array<number> = [];
    const defined: { [key: number]: true } = {};
    transformExpr(lambda, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (stmt.type === 'Define') {
                defined[stmt.sym.unique] = true;
            }
            return null;
        },
        expr: (expr) => {
            if (expr.type === 'lambda') {
                expr.args.forEach((arg) => (defined[arg.sym.unique] = true));
            }
            if (expr.type === 'var') {
                if (!defined[expr.sym.unique]) {
                    captured.push(expr.sym.unique);
                }
            }
            return null;
        },
    });
    return captured;
};

export const liftLambdas = (env: Env, exprs: Exprs, expr: Expr) => {
    const toplevel = expr;
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr: Expr) => {
            if (expr === toplevel) {
                return null;
            }
            if (
                expr.type !== 'lambda' ||
                findCapturedVariables(expr).length > 0
            ) {
                return null;
            }
            // TODO: TODO: got to optimize this I think
            // In case it has stuff that needs to be optimized.
            const hash = hashObject(expr);
            const id: Id = { hash, size: 1, pos: 0 };
            expr = optimizeDefine(env, expr, id);
            expr = optimizeAggressive(env, exprs, expr, id);
            exprs[hash] = { expr: expr, inline: false };
            return {
                type: 'term',
                id,
                loc: expr.loc,
                is: expr.is,
            };
        },
    });
};
