import { hashObject, idName } from '../../../typing/env';
import { Id, newWithGlobal } from '../../../typing/types';
import { debugExpr } from '../../irDebugPrinter';
import { printToString } from '../../printer';
import { reUnique } from '../../typeScriptPrinterSimple';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr, LambdaExpr, Stmt } from '../types';
import { maxUnique } from './inline';
import { Context } from './optimize';

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
export const liftToTopLevel = (ctx: Context, lambda: LambdaExpr): Expr => {
    // We're bringing this to the top level, it can have fresh uniques
    lambda = reUnique({ current: 0 }, lambda) as LambdaExpr;
    const hash = hashObject(lambda);
    const id: Id = { hash, size: 1, pos: 0 };
    const senv = newWithGlobal(ctx.env.global);
    senv.local.unique.current = maxUnique(lambda);
    let expr: LambdaExpr = ctx.optimize(
        { ...ctx, env: senv, id },
        lambda,
    ) as LambdaExpr;
    // const e = new Error();
    // expr.note = (expr.note || '') + '\nLifted to toplevel\n' + e.stack + '\n';
    // expr.note += printToString(debugExpr(ctx.env, expr), 100);
    // console.log(e);
    ctx.exprs[idName(id)] = {
        expr: expr,
        inline: false,
        source: { id: ctx.id, kind: 'lambda' },
    };
    return {
        type: 'term',
        id,
        loc: expr.loc,
        is: expr.is,
    };
};

export const liftLambdas = (ctx: Context, expr: Expr) => {
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
                    value: liftToTopLevel(ctx, stmt.value),
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
