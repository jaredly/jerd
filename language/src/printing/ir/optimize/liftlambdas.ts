import { hashObject } from '../../../typing/env';
import { Env, Id } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr, LambdaExpr, Stmt } from '../types';
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

// The caller needs to ensure that no variables are being captured.
export const liftToTopLevel = (
    env: Env,
    exprs: Exprs,
    lambda: LambdaExpr,
): Expr => {
    const hash = hashObject(lambda);
    const id: Id = { hash, size: 1, pos: 0 };
    let expr: Expr = optimizeDefine(env, lambda, id, exprs);
    exprs[hash] = { expr: expr, inline: false };
    return {
        type: 'term',
        id,
        loc: expr.loc,
        is: expr.is,
    };
};

export const liftLambdas = (env: Env, exprs: Exprs, expr: Expr) => {
    const toplevel = expr;
    const immediatelyCalled: Array<LambdaExpr> = [];
    return transformExpr(expr, {
        ...defaultVisitor,
        stmt: (stmt: Stmt) => {
            if (
                (stmt.type === 'Define' || stmt.type === 'Assign') &&
                stmt.value &&
                stmt.value.type === 'lambda'
            ) {
                return {
                    ...stmt,
                    value: liftToTopLevel(env, exprs, stmt.value),
                };
            }
            return null;
        },
        // expr: (expr: Expr) => {
        //     if (expr === toplevel) {
        //         return null;
        //     }
        //     if (expr.type === 'apply' && expr.target.type === 'lambda') {
        //         immediatelyCalled.push(expr.target);
        //     }
        //     if (
        //         expr.type !== 'lambda' ||
        //         immediatelyCalled.includes(expr) ||
        //         findCapturedVariables(expr).length > 0
        //     ) {
        //         return null;
        //     }
        //     return liftToTopLevel(env, exprs, expr);
        // },
    });
};
