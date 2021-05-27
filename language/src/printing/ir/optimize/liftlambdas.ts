import { hashObject } from '../../../typing/env';
import { Env, Id } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr, LambdaExpr } from '../types';
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
    const immediatelyCalled: Array<LambdaExpr> = [];
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr: Expr) => {
            if (expr === toplevel) {
                return null;
            }
            if (expr.type === 'apply' && expr.target.type === 'lambda') {
                immediatelyCalled.push(expr.target);
            }
            if (
                expr.type !== 'lambda' ||
                immediatelyCalled.includes(expr) ||
                findCapturedVariables(expr).length > 0
            ) {
                return null;
            }
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
