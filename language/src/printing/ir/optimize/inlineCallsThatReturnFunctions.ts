import { idName } from '../../../typing/env';
import { Env } from '../../../typing/types';
import { reUnique } from '../../typeScriptPrinterSimple';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr, OutputOptions } from '../types';
import { Exprs } from './optimize';

// This is just calls to terms. Not calls to vars, or lambdas
export const inlineCallsThatReturnFunctions = (
    env: Env,
    irOpts: OutputOptions,
    exprs: Exprs,
    expr: Expr,
) => {
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (
                expr.type !== 'apply' ||
                expr.target.is.type !== 'lambda' ||
                expr.target.type !== 'term' ||
                expr.target.is.res.type !== 'lambda'
            ) {
                return null;
            }
            const t = exprs[idName(expr.target.id)];
            return {
                ...expr,
                target: reUnique(env.local.unique, t.expr),
            };
        },
    });
};
