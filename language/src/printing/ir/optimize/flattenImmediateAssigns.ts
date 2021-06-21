import { defaultVisitor, transformExpr, transformStmt } from '../transform';
import { Define, Expr, Stmt } from '../types';
import { Context } from './optimize';

/**
 *
 */
export const flattenImmediateAssigns = (ctx: Context, expr: Expr): Expr =>
    transformExpr(expr, {
        ...defaultVisitor,
        block: (block) => {
            let last = null;
            let results: Array<Stmt> = [];

            const pending: {
                [unique: number]: { define: number; assign: number | null };
            } = {};

            for (let i = 0; i < block.items.length; i++) {
                const stmt = block.items[i];

                transformStmt(stmt, {
                    ...defaultVisitor,
                    stmt: (inner) => {
                        if (
                            inner !== stmt &&
                            inner.type === 'Assign' &&
                            pending[inner.sym.unique] != null &&
                            pending[inner.sym.unique].assign == null
                        ) {
                            // Clear it out, we're assigning in some sub-block somewhere
                            delete pending[inner.sym.unique];
                        }
                        return null;
                    },
                    expr: (expr) => {
                        if (
                            expr.type === 'var' &&
                            pending[expr.sym.unique] != null &&
                            pending[expr.sym.unique].assign == null
                        ) {
                            // Clear it out, we're accessing before the assign somehow
                            delete pending[expr.sym.unique];
                        }
                        return null;
                    },
                });

                if (stmt.type === 'Define' && stmt.value == null) {
                    pending[stmt.sym.unique] = { define: i, assign: null };
                }
                if (
                    stmt.type === 'Assign' &&
                    pending[stmt.sym.unique] != null &&
                    pending[stmt.sym.unique].assign == null
                ) {
                    pending[stmt.sym.unique].assign = i;
                }
            }

            const remove: Array<number> = Object.keys(pending)
                .map((k: any) =>
                    pending[k].assign != null ? pending[k].define : null,
                )
                .filter((x) => x != null) as Array<number>;
            const assigns: Array<number> = Object.keys(pending)
                .map((k: any) => pending[k].assign)
                .filter((x) => x != null) as Array<number>;

            if (!remove.length) {
                return null;
            }

            const result: Array<Stmt> = [];
            block.items.forEach((stmt, i) => {
                if (remove.includes(i)) {
                    return;
                }
                if (assigns.includes(i) && stmt.type === 'Assign') {
                    result.push({
                        ...(block.items[
                            pending[stmt.sym.unique].define
                        ] as Define),
                        value: stmt.value,
                    });
                    return;
                }
                result.push(stmt);
            });

            return { ...block, items: result };
        },
    });
