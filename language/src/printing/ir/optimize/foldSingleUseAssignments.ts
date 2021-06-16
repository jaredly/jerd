import { Env, symbolsEqual } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr, Stmt } from '../types';
import { Context, symName } from './optimize';

// We need to ensure that
/*
let y = 1
let x = y
y = 3
z = x
*/
// doesn't end up with z being equal to 3.
// So we need to ensure that ... "nothing that is used by
// this thing gets reassigned"?
export const foldSingleUseAssignments = (ctx: Context, expr: Expr): Expr => {
    let usages: { [v: string]: number } = {};
    let subUses: { [v: string]: { [key: string]: boolean } } = {};
    transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type === 'var') {
                const n = symName(expr.sym);
                // console.log('hi', expr.sym, usages[n]);
                usages[n] = (usages[n] || 0) + 1;
            }
            return null;
        },
        stmt: (stmt) => {
            if (stmt.type === 'Assign') {
                const en = symName(stmt.sym);
                usages[en] = (usages[en] || 0) + 1;

                // We're reassigning something! Anything that uses
                // this variable, but that hasn't yet seen its first use,
                // should be "poisoned".
                Object.keys(subUses[en] || {}).forEach((k) => {
                    // Special case: if the value we're assigning to is the
                    // single-use variable itself, we're fine
                    if (
                        stmt.value.type === 'var' &&
                        symName(stmt.value.sym) === k
                    ) {
                        return;
                    }
                    if (usages[k] !== 1) {
                        usages[k] = 2; // disqualify from single-use
                    }
                });
            } else if (stmt.type === 'Define' && stmt.value != null) {
                const top = symName(stmt.sym);
                // const subs: {[key: string]: boolean} = {}
                transformExpr(stmt.value, {
                    ...defaultVisitor,
                    expr: (expr) => {
                        if (expr.type === 'var') {
                            const en = symName(expr.sym);
                            if (!subUses[en]) {
                                subUses[en] = {};
                            }
                            subUses[en][top] = true;
                        }
                        return null;
                    },
                });
                // subUses[symName(stmt.sym)] = subs
                // return false;
            }
            return null;
        },
    });
    const singles: { [key: string]: boolean } = {};
    let found = false;
    Object.keys(usages).forEach((k) => {
        if (usages[k] === 1) {
            found = true;
            singles[k] = true;
        }
    });
    // console.log(usages, singles);
    if (!found) {
        return expr;
    }
    const defns: { [key: string]: Expr } = {};
    return transformExpr(expr, {
        ...defaultVisitor,
        block: (block) => {
            const items: Array<Stmt> = [];
            block.items.forEach((item) => {
                if (item.type === 'Define' && singles[symName(item.sym)]) {
                    defns[symName(item.sym)] = item.value!;
                    return; // skip this
                }
                if (
                    item.type === 'Assign' &&
                    item.value.type === 'var' &&
                    symbolsEqual(item.sym, item.value.sym)
                ) {
                    return; // x = x, noop
                }
                items.push(item);
            });
            return items.length !== block.items.length
                ? { ...block, items }
                : block;
        },
        expr: (value) => {
            if (value.type === 'var') {
                const v = defns[symName(value.sym)];
                if (v != null) {
                    return v;
                }
            }
            return null;
        },
        // stmt: (value) => {
        //     if (
        //         (value.type === 'Define' || value.type === 'Assign') &&
        //         value.value != null &&
        //         isConstant(value.value)
        //     ) {
        //         constants[symName(value.sym)] = value.value;
        //     }
        //     return null;
        // },
    });
};
