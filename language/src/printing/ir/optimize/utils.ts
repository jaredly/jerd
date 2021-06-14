import { Env } from '../../../typing/types';
import {
    defaultVisitor,
    transformBlock,
    transformExpr,
    transformLambdaBody,
    transformStmt,
    Visitor,
} from '../transform';
import { Expr } from '../types';

export const optimizer = (visitor: Visitor) => (env: Env, expr: Expr): Expr =>
    transformRepeatedly(expr, visitor);

export const transformRepeatedly = (expr: Expr, visitor: Visitor): Expr => {
    while (true) {
        const nexp = transformExpr(expr, visitor);
        if (nexp === expr) {
            break;
        }
        expr = nexp;
    }
    return expr;
};
