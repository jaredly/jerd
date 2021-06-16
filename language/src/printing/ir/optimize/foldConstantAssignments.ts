import { Env } from '../../../typing/types';
import {
    defaultVisitor,
    transformExpr,
    transformStmt,
    Visitor,
} from '../transform';
import { Expr } from '../types';
import { block } from '../utils';
import { Context, isConstant } from './optimize';

// Ugh ok so I do need to track scopes I guess
// Yeaht that's the way to do it. hrmmm
// Or actually I could just recursively call this! yeah that's great.
export const foldConstantAssignments = (ctx: Context, topExpr: Expr): Expr => {
    // hrmmmmmmmmm soooooo hmmmm
    let constants: { [v: string]: Expr | null } = {};
    // let tupleConstants: { [v: string]: Tuple } = {};
    // console.log('>> ', showLocation(topExpr.loc));
    return transformExpr(topExpr, {
        ...defaultVisitor,
        expr: (expr, level) => {
            // Lambdas that aren't toplevel should invalidate anything they assign to
            if (expr.type === 'lambda' && level !== 0) {
                // console.log(
                //     'lambda at',
                //     showLocation(expr.loc),
                //     showLocation(topExpr.loc),
                //     level,
                // );
                // console.log(new Error().stack);
                const checkAssigns: Visitor = {
                    ...defaultVisitor,
                    expr: (expr) => {
                        // if (expr.type === 'var') {
                        //     console.log(
                        //         'inner',
                        //         expr.sym,
                        //         constants[expr.sym.unique],
                        //     );
                        // }
                        if (
                            expr.type === 'var' &&
                            constants[expr.sym.unique] != null
                        ) {
                            return constants[expr.sym.unique];
                        }
                        return null;
                    },
                    stmt: (stmt) => {
                        if (stmt.type === 'Assign') {
                            constants[stmt.sym.unique] = null;
                        }
                        return null;
                    },
                };
                let body =
                    expr.body.type === 'Block'
                        ? transformStmt(expr.body, checkAssigns)
                        : transformExpr(expr.body, checkAssigns);
                if (Array.isArray(body)) {
                    body = block(body, expr.body.loc);
                }
                let changed =
                    body !== expr.body ? ({ ...expr, body } as Expr) : expr;
                // console.log(
                //     'Fold lambda constants',
                //     showLocation(topExpr.loc),
                //     showLocation(changed.loc),
                // );
                changed = foldConstantAssignments(ctx, changed);
                return changed !== expr ? [changed] : false;
            }
            if (expr.type === 'handle') {
                return false;
            }
            if (expr.type === 'var') {
                const v = constants[expr.sym.unique];
                if (v != null) {
                    return v;
                }
            }
            return null;
        },
        stmt: (stmt) => {
            // Assigns in if blocks should invalidate the variables
            if (stmt.type === 'if') {
                const checkAssigns: Visitor = {
                    ...defaultVisitor,
                    expr: (expr) => {
                        if (expr.type === 'lambda') {
                            return false;
                        }
                        return null;
                    },
                    stmt: (stmt) => {
                        if (stmt.type === 'Assign') {
                            constants[stmt.sym.unique] = null;
                        }
                        return null;
                    },
                };
                transformStmt(stmt.yes, checkAssigns);
                if (stmt.no) {
                    transformStmt(stmt.no, checkAssigns);
                }
                return false;
            }
            // Remove x = x
            if (
                stmt.type === 'Assign' &&
                stmt.value.type === 'var' &&
                stmt.sym.unique === stmt.value.sym.unique
            ) {
                return [];
            }
            if (
                (stmt.type === 'Define' || stmt.type === 'Assign') &&
                stmt.value != null &&
                isConstant(stmt.value)
            ) {
                constants[stmt.sym.unique] = stmt.value;
            }
            return null;
        },
    });
};
