import { idFromName, idName, newSym } from '../../../typing/env';
import {
    Env,
    Id,
    idsEqual,
    RecordDef,
    refsEqual,
    Symbol,
    symbolsEqual,
} from '../../../typing/types';
import { reUnique } from '../../typeScriptPrinterSimple';
import {
    defaultVisitor,
    ExprVisitor,
    transformBlock,
    transformExpr,
    transformLambdaBody,
    transformStmt,
    Visitor,
} from '../transform';
import {
    Apply,
    Block,
    Define,
    Expr,
    isTerm,
    LambdaExpr,
    OutputOptions,
    Record,
    RecordSubType,
    ReturnStmt,
    Stmt,
    Tuple,
    Type,
} from '../types';
import {
    callExpression,
    define,
    handlerSym,
    int,
    pureFunction,
    typeFromTermType,
    var_,
} from '../utils';
import { and, asBlock, builtin, iffe } from '../utils';
import { inlint } from './inline';
import { isConstant, transformRepeatedly } from './optimize';

export const hasReturns = (stmt: Stmt): boolean => {
    switch (stmt.type) {
        case 'Return':
            return true;
        case 'Block':
            return stmt.items.some(hasReturns);
        case 'Loop':
            return hasReturns(stmt.body);
        case 'if':
            return (
                hasReturns(stmt.yes) || (stmt.no != null && hasReturns(stmt.no))
            );
        default:
            return false;
    }
};

export const hasNonFinalReturn = (block: Block) => {
    const lastItem = block.items[block.items.length - 1];
    let hasNonFinalReturn = false;
    transformStmt(block, {
        ...defaultVisitor,
        expr: (expr) => {
            return false; // don't traverse into expressions
            // if (expr.type === 'lambda' || expr.type === 'handle') {
            //     return false
            // }
            // return null
        },
        stmt: (stmt) => {
            if (stmt.type === 'Return' && stmt !== lastItem) {
                hasNonFinalReturn = true;
                return false;
            }
            return null;
        },
    });
    return hasNonFinalReturn;
};

// STOPSHIP: Bail if there's a `return` that's not the last item of the lambda
export const flattenDefineLambdas = (
    env: Env,
    stmt: Stmt,
): Array<Stmt> | Stmt => {
    let prefixes: Array<Stmt> = [];
    const result = transformStmt(stmt, {
        ...defaultVisitor,
        // Don't go into sub-blocks
        block: (block) => {
            return false;
        },
        // stmt: stmt => {
        //     // don't recurse into stmts? I mean....
        //     return false
        // },
        expr: (expr) => {
            // Don't go into lambdas
            if (expr.type === 'lambda' || expr.type === 'handle') {
                return false;
            }
            if (
                expr.type !== 'apply' ||
                expr.target.type !== 'lambda' ||
                expr.target.body.type !== 'Block'
            ) {
                return null;
            }

            if (hasNonFinalReturn(expr.target.body)) {
                return null;
            }

            const sym = newSym(env, `lambdaBlockResult`);

            const args = expr.args;
            const stmts: Array<Stmt> = expr.target.args
                .map(
                    (arg, i) =>
                        ({
                            type: 'Define',
                            loc: arg.loc,
                            is: arg.type,
                            value: args[i],
                            sym: arg.sym,
                        } as Define),
                )
                .filter((arg) => arg.sym.unique !== handlerSym.unique);
            stmts.push({
                type: 'Define',
                sym,
                is: expr.is,
                value: null,
                loc: expr.loc,
            });
            //.concat([{ ...stmt, value: null }]);

            const byUnique: { [key: number]: Expr } | null =
                expr.target.args.length > 0 ? {} : null;
            if (byUnique) {
                expr.target.args.forEach((arg, i) => {
                    byUnique[arg.sym.unique] = args[i];
                });
            }
            expr.target.body.items.forEach((item) => {
                const result = transformStmt(item, {
                    ...defaultVisitor,
                    expr: (expr) => {
                        // stop recursion
                        if (expr.type === 'lambda' || expr.type === 'handle') {
                            return false;
                        }
                        return null;
                    },
                    stmt: (stmt) => {
                        // oooh hm this won't quite work
                        // because for my "match" dealios
                        // I depend on `returns` actually returning.
                        // I might need to set a `done` flag?
                        // or something? Yeah.
                        if (stmt.type === 'Return') {
                            return {
                                type: 'Assign',
                                sym,
                                value: stmt.value,
                                loc: stmt.loc,
                                is: stmt.value.is,
                            };
                        }
                        return null;
                    },
                });
                let results = Array.isArray(result) ? result : [result];
                if (byUnique) {
                    results = ([] as Array<Stmt>).concat(
                        ...results.map(
                            (result): Array<Stmt> => {
                                const m = transformStmt(
                                    result,
                                    substituteVariables(byUnique),
                                );
                                return Array.isArray(m) ? m : [m];
                            },
                        ),
                    );
                }
                stmts.push(...results);
            });
            prefixes = stmts.concat(prefixes);
            // return stmts;
            return var_(sym, expr.loc, expr.is);
        },
    });
    if (!prefixes.length) {
        return result;
    }
    return prefixes.concat(Array.isArray(result) ? result : [result]);
};

export const flattenImmediateCalls = (env: Env, expr: Expr) => {
    // console.log('flatten');
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            // not the place
            if (stmt.type === 'Block') {
                return null;
            }
            // Take care of the top-level expression-statement case,
            // where we actually want to ignore the return.
            if (
                stmt.type === 'Expression' &&
                stmt.expr.type === 'apply' &&
                stmt.expr.target.type === 'lambda'
            ) {
                if (stmt.expr.target.body.type !== 'Block') {
                    return null;
                }
                if (hasNonFinalReturn(stmt.expr.target.body)) {
                    return null;
                }
                const items = stmt.expr.target.body.items;
                const lastItem = items[items.length - 1];
                if (lastItem.type === 'Return') {
                    const changed = items.slice();
                    changed[items.length - 1] = {
                        type: 'Expression',
                        expr: lastItem.value,
                        loc: lastItem.loc,
                    };
                    return changed;
                }
                return items;
            }
            // definitely unique
            // if (true) {
            return flattenDefineLambdas(env, stmt);
            // return null;
            // }
            // if (stmt.type === 'Define' && stmt.value) {
            //     return flattenDefineLambdas(env, stmt);
            // }

            // if (stmt.type === 'Define') {
            //     if (
            //         !stmt.value ||
            //         stmt.value.type !== 'apply' ||
            //         stmt.value.target.type !== 'lambda' ||
            //         stmt.value.target.body.type !== 'Block'
            //     ) {
            //         return null;
            //     }
            //     const sym = stmt.sym;
            //     const target = stmt.value.target;
            //     const args = stmt.value.args;
            //     const stmts: Array<Stmt> = (stmt.value.target.args
            //         .map(
            //             (arg, i) =>
            //                 ({
            //                     type: 'Define',
            //                     loc: arg.loc,
            //                     is: arg.type,
            //                     value: args[i],
            //                     sym: arg.sym,
            //                 } as Define),
            //         )
            //         .filter(
            //             (arg) => arg.sym.unique !== handlerSym.unique,
            //         ) as Array<Stmt>).concat([{ ...stmt, value: null }]);
            //     const byUnique: { [key: number]: Expr } | null =
            //         target.args.length > 0 ? {} : null;
            //     if (byUnique) {
            //         stmt.value.target.args.forEach((arg, i) => {
            //             byUnique[arg.sym.unique] = args[i];
            //         });
            //     }
            //     stmt.value.target.body.items.forEach((item) => {
            //         const result = transformStmt(item, {
            //             ...defaultVisitor,
            //             expr: (expr) => {
            //                 // stop recursion
            //                 if (
            //                     expr.type === 'lambda' ||
            //                     expr.type === 'handle'
            //                 ) {
            //                     return false;
            //                 }
            //                 return null;
            //             },
            //             stmt: (stmt) => {
            //                 if (stmt.type === 'Return') {
            //                     return {
            //                         type: 'Assign',
            //                         sym,
            //                         value: stmt.value,
            //                         loc: stmt.loc,
            //                         is: stmt.value.is,
            //                     };
            //                 }
            //                 return null;
            //             },
            //         });
            //         let results = Array.isArray(result) ? result : [result];
            //         if (byUnique) {
            //             results = ([] as Array<Stmt>).concat(
            //                 ...results.map(
            //                     (result): Array<Stmt> => {
            //                         const m = transformStmt(
            //                             result,
            //                             substituteVariables(byUnique),
            //                         );
            //                         return Array.isArray(m) ? m : [m];
            //                     },
            //                 ),
            //             );
            //         }
            //         stmts.push(...results);
            //     });
            //     return stmts;
            // }
            // if (stmt.type === 'Expression') {
            //     if (
            //         stmt.expr.type === 'apply' &&
            //         stmt.expr.target.type === 'lambda'
            //     ) {
            //         const expr = stmt.expr;
            //         const lets: Array<Stmt> = stmt.expr.target.args
            //             .map(
            //                 (arg, i) =>
            //                     ({
            //                         type: 'Define',
            //                         loc: arg.loc,
            //                         is: arg.type,
            //                         value: expr.args[i],
            //                         sym: arg.sym,
            //                     } as Define),
            //             )
            //             .filter((arg) => arg.sym.unique !== handlerSym.unique);
            //         const byUnique: { [key: number]: Expr } = {};
            //         stmt.expr.target.args.forEach((arg, i) => {
            //             byUnique[arg.sym.unique] = expr.args[i];
            //         });
            //         if (stmt.expr.target.body.type === 'Block') {
            //             // NOTE we should be able to manage this actually
            //             if (hasReturns(stmt.expr.target.body)) {
            //                 return null;
            //             }
            //             stmt.expr.target.body.items.forEach((stmt) => {
            //                 const res = transformStmt(
            //                     stmt,
            //                     substituteVariables(byUnique),
            //                 );
            //                 if (Array.isArray(res)) {
            //                     lets.push(...res);
            //                 } else {
            //                     lets.push(res);
            //                 }
            //             });
            //         } else {
            //             lets.push({
            //                 type: 'Expression',
            //                 loc: stmt.loc,
            //                 expr: transformExpr(
            //                     stmt.expr.target.body,
            //                     substituteVariables(byUnique),
            //                 ),
            //             });
            //         }
            //         return lets;
            //     }
            // }
            // if (stmt.type === 'Return') {
            //     // if (stmt.)
            //     // TODO
            // }
            // return null;
        },

        expr: (expr) => {
            if (expr.type !== 'apply' || expr.target.type !== 'lambda') {
                return null;
            }
            let body: Expr;
            if (expr.target.body.type === 'Block') {
                if (
                    expr.target.body.items.length !== 1 ||
                    expr.target.body.items[0].type !== 'Expression'
                ) {
                    return null;
                }
                body = expr.target.body.items[0].expr;
            } else {
                body = expr.target.body;
            }
            if (expr.args.length === 0) {
                return body;
            }
            // each arg must *either* be single-use, or simple
            const complex = expr.args
                .map((arg, i) => (isConstant(arg) ? null : i))
                .filter((x) => x != null) as Array<number>;
            const multiUse = complex.length
                ? checkMultiUse(expr.target, complex)
                : [];
            const byUnique: { [key: number]: Expr } = {};
            const targs = expr.target.args;
            expr.args.forEach((arg, i) => {
                if (!multiUse.includes(i)) {
                    byUnique[targs[i].sym.unique] = arg;
                }
            });
            const args = expr.args;
            // console.log(body);
            // console.log(byUnique);
            // console.log('new body');
            const newBody = transformExpr(body, {
                ...defaultVisitor,
                expr: (expr) => {
                    if (
                        expr.type === 'var' &&
                        byUnique[expr.sym.unique] != null // &&
                        // !args.includes(expr)
                    ) {
                        return [byUnique[expr.sym.unique]];
                    }
                    return null;
                },
            });
            // console.log('ok');

            if (multiUse.length > 0) {
                const inits: Array<Stmt> = multiUse.map((i) =>
                    define(targs[i].sym, expr.args[i]),
                );
                return iffe(env, {
                    type: 'Block',
                    items: inits.concat({
                        type: 'Return',
                        loc: expr.loc,
                        value: newBody,
                    }),
                    loc: expr.loc,
                });
            }

            return newBody;

            // console.log('yes please', expr.args);
            // return null;
        },
    });
};

export const substituteVariablesExpr = (byUnique: {
    [key: number]: Expr;
}): ExprVisitor => {
    return (expr) => {
        if (
            expr.type === 'var' &&
            byUnique[expr.sym.unique] != null // &&
            // !args.includes(expr)
        ) {
            return [byUnique[expr.sym.unique]];
        }
        return null;
    };
};

export const substituteVariables = (byUnique: {
    [key: number]: Expr;
}): Visitor => {
    return {
        ...defaultVisitor,
        expr: substituteVariablesExpr(byUnique),
    };
};

// export const substituteVariables = (
//     expr: Expr,
//     byUnique: { [key: number]: Expr },
// ) => {
//     return transformExpr(expr, {
//         ...defaultVisitor,
//         expr: (expr) => {
//             if (
//                 expr.type === 'var' &&
//                 byUnique[expr.sym.unique] != null // &&
//                 // !args.includes(expr)
//             ) {
//                 return [byUnique[expr.sym.unique]];
//             }
//             return null;
//         },
//     });
// };

const checkMultiUse = (expr: LambdaExpr, indices: Array<number>) => {
    const uniques = indices.map((i) => expr.args[i].sym.unique);
    const uses: { [u: number]: number } = {};
    uniques.forEach((u) => (uses[u] = 0));
    transformExpr(expr.body as Expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type === 'var' && uniques.includes(expr.sym.unique)) {
                uses[expr.sym.unique] += 1;
            }
            return null;
        },
    });
    return indices.filter((i) => uses[expr.args[i].sym.unique] > 1);
};
