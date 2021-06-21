import { Env, nullLocation, Symbol } from '../../../typing/types';
import { reUnique } from '../../typeScriptPrinterSimple';
import {
    defaultVisitor,
    transformBlock,
    transformExpr,
    transformStmt,
    Visitor,
} from '../transform';
import { Assign, Block, Define, Expr } from '../types';
import { block, intLiteral } from '../utils';
import { Context, isConstant } from './optimize';

// export const foldConstantAssignments2 = (ctx: Context, expr: Expr) => {
//     return foldInner(ctx, expr, {});
// };

// Null: not initialized yet (or it wasn't constant)
// False: poisoned
type Defines = { [key: number]: Expr | null | false };

// Ok, so I could do the "level it was assigned"
// but I don't want "sibling" deep levels to be able
// to infect each other.
//
/*
const x =10

if true {
    x = 2
    // this is fine
    const z = x
} else {
    x = 3
}

const y = x

if false {
    // Needs to know that x is bad news
    y = x
}

So, what I need is ....
...

yeah, so "deeper levels can see all parents"
but parent levels shouldn't /see/ deeper levels,
but still need to know that a thing has been "corrupted".

So I'm thinking I want a list of maps?

orrr
well

so a child just needs to set a flat on the parent one
indicating that it is gonzo for the purposes of the parent


*/

const isConstantOrLambda = (expr: Expr, foldLambdas: boolean) => {
    if (foldLambdas && expr.type === 'lambda') {
        return true;
    }
    return isConstant(expr);
};

const foldVisitor = (
    ctx: Context,
    defines: Defines,
    foldLambdas: boolean,
): Visitor => {
    return visitorGeneral({
        onDefine: (define) => {
            defines[define.sym.unique] =
                define.value != null &&
                isConstantOrLambda(define.value, foldLambdas)
                    ? define.value
                    : null;
        },
        onAssign: (assign) => {
            if (defines[assign.sym.unique] !== false) {
                defines[assign.sym.unique] = isConstantOrLambda(
                    assign.value,
                    foldLambdas,
                )
                    ? assign.value
                    : null;
            }
        },
        onGet: (s) => {
            const v = defines[s.unique];
            if (v != null && v !== false) {
                if (v.type === 'lambda') {
                    return reUnique(ctx.env.local.unique, v);
                }
                return v;
            }
            return null;
        },
        onNested: (b, noOuterRedefines) => {
            const inner: Defines = { ...defines };
            if (noOuterRedefines) {
                transformBlock(b, {
                    ...defaultVisitor,
                    stmt: (stmt) => {
                        if (stmt.type === 'Assign') {
                            // x = x doesn't count
                            if (
                                stmt.value.type === 'var' &&
                                stmt.sym.unique === stmt.value.sym.unique
                            ) {
                                return null;
                            }
                            inner[stmt.sym.unique] = false;
                        }
                        return null;
                    },
                });
                // START HERE: We're erroring because:
                /*

                int x = 10
                loop {
                    // This x is being folded, but it shouldn't!
                    int y = x
                    x = x + 1
                }

                TODO: Traverse the dealio, and poison all
                assigns, before we do the normal transform

                */
            }
            const res = transformBlock(b, foldVisitor(ctx, inner, foldLambdas));
            Object.keys(inner).forEach((s) => {
                const k = +s;
                if (defines[k] !== undefined && inner[k] !== defines[k]) {
                    defines[k] = false;
                }
            });
            return res;
        },
    });
};

const foldThemUpFolks = (ctx: Context, expr: Expr, foldLambdas: boolean) => {
    const defines: { [key: number]: Expr | null | false } = {};
    return transformExpr(expr, foldVisitor(ctx, defines, foldLambdas));
};

type FoldVisitor = {
    onDefine: (d: Define) => void;
    onAssign: (a: Assign) => void;
    onGet: (s: Symbol) => Expr | null;
    onNested: (b: Block, noOuterRedfines: boolean) => Block;
};

const visitorGeneral = ({
    onDefine,
    onAssign,
    onGet,
    onNested,
}: FoldVisitor): Visitor => {
    const defines: Defines = {};
    // sooo
    // anything defined at my level or lower, I update or use
    // anything defined above my level, I can use or invalidate
    return {
        ...defaultVisitor,
        stmt: (stmt, visitor) => {
            if (stmt.type === 'Define') {
                onDefine(stmt);
            }
            if (stmt.type === 'Assign') {
                onAssign(stmt);
                // if(defines[stmt.sym.unique] !== undefined) {
                //     defines[stmt.sym.unique] = isConstant(stmt.value) ? stmt.value : null
                // }
                // if (outer[stmt.sym.unique] != null) {
                //     outer[stmt.sym.unique] = false
                // }
            }
            if (stmt.type === 'if') {
                // const newOuter = {...outer, ...defines}
                const yes = onNested(stmt.yes, false);
                const no = stmt.no ? onNested(stmt.no, false) : stmt.no;
                const cond = transformExpr(stmt.cond, visitor);
                if (yes !== stmt.yes || no !== stmt.no || cond !== stmt.cond) {
                    return { type: '*stop*', stmt: { ...stmt, yes, no, cond } };
                }
                return false;
            }
            if (stmt.type === 'Loop') {
                // STOPSHIP: account for bounds!
                const body = onNested(stmt.body, true);
                if (body !== stmt.body) {
                    return { type: '*stop*', stmt: { ...stmt, body } };
                }
                return false;
            }
            return null;
        },
        expr: (expr) => {
            if (expr.type === 'lambda') {
                const body = onNested(expr.body, true);
                return body !== expr.body ? [{ ...expr, body }] : false;
            }
            if (expr.type === 'apply' && expr.target.type === 'var') {
                const v = onGet(expr.target.sym);
                if (v != null) {
                    return { ...expr, target: v };
                }
                return null;
                //     return intLiteral(200, nullLocation);
            }
            if (expr.type === 'var') {
                const v = onGet(expr.sym);
                if (v != null) {
                    return [v];
                }
                return null;
                // if (v != null) {
                //     // if (v.type === 'lambda') {
                //     //     return reUnique(ctx.env.local.unique, v);
                //     // }
                //     return v;
                // }
            }
            return null;
        },
    };
};

// const visitor2 = (ctx: Context, outer: Defines): Visitor => {
//     const defines: Defines = {};
//     // sooo
//     // anything defined at my level or lower, I update or use
//     // anything defined above my level, I can use or invalidate
//     return {
//         ...defaultVisitor,
//         stmt: (stmt, visitor) => {
//             if (stmt.type === 'Define') {
//                 defines[stmt.sym.unique] =
//                     stmt.value != null && isConstant(stmt.value)
//                         ? stmt.value
//                         : null;
//             }
//             if (stmt.type === 'Assign') {
//                 if (defines[stmt.sym.unique] !== undefined) {
//                     defines[stmt.sym.unique] = isConstant(stmt.value)
//                         ? stmt.value
//                         : null;
//                 }
//                 if (outer[stmt.sym.unique] != null) {
//                     outer[stmt.sym.unique] = false;
//                 }
//             }
//             if (stmt.type === 'if') {
//                 const newOuter = { ...outer, ...defines };
//                 const yes = transformBlock(stmt.yes, visitor2(ctx, newOuter));
//                 const no = stmt.no
//                     ? transformBlock(stmt.no, visitor2(ctx, newOuter))
//                     : stmt.no;
//                 const cond = transformExpr(stmt.cond, visitor);
//                 if (yes !== stmt.yes || no !== stmt.no || cond !== stmt.cond) {
//                     return { type: '*stop*', stmt: { ...stmt, yes, no, cond } };
//                 }
//                 return false;
//             }
//             // if (stmt.type)
//             return null;
//         },
//         expr: (expr) => {
//             if (expr.type === 'var') {
//                 let v = defines[expr.sym.unique];
//                 if (v != null && v !== false) {
//                     if (v.type === 'lambda') {
//                         return reUnique(ctx.env.local.unique, v);
//                     }
//                     return v;
//                 }
//                 v = outer[expr.sym.unique];
//                 if (v != null && v !== false) {
//                     if (v.type === 'lambda') {
//                         return reUnique(ctx.env.local.unique, v);
//                     }
//                     return v;
//                 }
//             }
//             return null;
//         },
//     };
// };

// export const foldInner = (ctx: Context, expr: Expr, outer: Defines) => {
//     const defines: Defines = {};
//     // sooo
//     // anything defined at my level or lower, I update or use
//     // anything defined above my level, I can use or invalidate
//     return transformExpr(expr, {
//         ...defaultVisitor,
//         stmt: (stmt) => {
//             if (stmt.type === 'Define') {
//                 defines[stmt.sym.unique] =
//                     stmt.value != null && isConstant(stmt.value)
//                         ? stmt.value
//                         : null;
//             }
//             if (stmt.type === 'Assign') {
//                 if (defines[stmt.sym.unique] !== undefined) {
//                     defines[stmt.sym.unique] = isConstant(stmt.value)
//                         ? stmt.value
//                         : null;
//                 }
//                 if (outer[stmt.sym.unique] != null) {
//                     outer[stmt.sym.unique] = false;
//                 }
//             }
//             if (stmt.type === 'if') {
//                 // const yes = foldInner(ctx, stmt)
//             }
//             return null;
//         },
//         expr: (expr) => {
//             if (expr.type === 'var') {
//                 let v = defines[expr.sym.unique];
//                 if (v != null && v !== false) {
//                     if (v.type === 'lambda') {
//                         return reUnique(ctx.env.local.unique, v);
//                     }
//                     return v;
//                 }
//                 v = outer[expr.sym.unique];
//                 if (v != null && v !== false) {
//                     if (v.type === 'lambda') {
//                         return reUnique(ctx.env.local.unique, v);
//                     }
//                     return v;
//                 }
//             }
//             return null;
//         },
//     });
// };

// const checkAssigns: (constants: { [key: number]: Expr | null }) => Visitor = (
//     constants,
// ) => ({
//     ...defaultVisitor,
//     expr: (expr) => {
//         if (expr.type === 'var' && constants[expr.sym.unique] != null) {
//             return constants[expr.sym.unique];
//         }
//         return null;
//     },
//     stmt: (stmt) => {
//         if (stmt.type === 'Assign') {
//             constants[stmt.sym.unique] = null;
//         }
//         if (stmt.type === 'Loop' && stmt.bounds != null) {
//             constants[stmt.bounds.sym.unique] = null;
//         }
//         return null;
//     },
// });

// const visitor = (
//     ctx: Context,
//     constants: { [key: number]: Expr | null },
//     foldLambdas: boolean,
// ): Visitor => ({
//     ...defaultVisitor,
//     expr: (expr, level) => {
//         // Lambdas that aren't toplevel should invalidate anything they assign to
//         if (expr.type === 'lambda' && level !== 0) {
//             let body = transformStmt(expr.body, checkAssigns(constants));
//             if (Array.isArray(body)) {
//                 body = block(body, expr.body.loc);
//             }
//             let changed =
//                 body !== expr.body ? ({ ...expr, body } as Expr) : expr;
//             changed = foldConstantAssignments(foldLambdas)(ctx, changed);
//             return changed !== expr ? [changed] : false;
//         }
//         if (expr.type === 'handle') {
//             return false;
//         }
//         if (expr.type === 'var') {
//             const v = constants[expr.sym.unique];
//             if (v != null) {
//                 if (v.type === 'lambda') {
//                     return reUnique(ctx.env.local.unique, v);
//                 }
//                 return v;
//             }
//         }
//         return null;
//     },
//     stmt: (stmt, revisit) => {
//         // const checkAssigns: Visitor = {
//         //     ...defaultVisitor,
//         //     expr: (expr) => {
//         //         if (expr.type === 'lambda') {
//         //             return false;
//         //         }
//         //         return null;
//         //     },
//         //     stmt: (stmt) => {
//         //         if (stmt.type === 'Assign') {
//         //             constants[stmt.sym.unique] = null;
//         //         }
//         //         return null;
//         //     },
//         // };

//         // Assigns in if blocks should invalidate the variables
//         if (stmt.type === 'if') {
//             transformStmt(stmt.yes, checkAssigns(constants));
//             if (stmt.no) {
//                 transformStmt(stmt.no, checkAssigns(constants));
//             }
//             let yes = transformBlock(stmt.yes, visitor(ctx, {}, foldLambdas));
//             let no = stmt.no
//                 ? transformBlock(stmt.no, visitor(ctx, {}, foldLambdas))
//                 : stmt.no;
//             return yes !== stmt.yes || no !== stmt.no
//                 ? [{ ...stmt, yes, no }]
//                 : false;
//         }
//         // Assigns in loops should also invalidate
//         if (stmt.type === 'Loop') {
//             if (stmt.bounds != null) {
//                 constants[stmt.bounds.sym.unique] = null;
//             }
//             transformStmt(stmt.body, checkAssigns(constants));
//             let body = transformBlock(stmt.body, visitor(ctx, {}, foldLambdas));
//             return body !== stmt.body
//                 ? { type: '*stop*', stmt: { ...stmt, body } }
//                 : false;
//         }
//         // Remove x = x
//         if (
//             stmt.type === 'Assign' &&
//             stmt.value.type === 'var' &&
//             stmt.sym.unique === stmt.value.sym.unique
//         ) {
//             return [];
//         }
//         if (
//             (stmt.type === 'Define' || stmt.type === 'Assign') &&
//             stmt.value != null &&
//             (isConstant(stmt.value) ||
//                 (foldLambdas && stmt.value.type === 'lambda'))
//         ) {
//             if (stmt.value.type === 'lambda') {
//                 if (typeof ctx.env.local.unique.current !== 'number') {
//                     throw new Error('what no unique');
//                 }
//                 // START HERE:
//                 // At *some* point, we are:
//                 // eliminating something, such that we have
//                 // dangling references.
//                 // Maybe I should make a "verify all symbols are defined"
//                 // consistency check, similar to "all uniques are unique".
//                 /// HASDKLJ OH WAIT
//                 // This is just saying that we're capturing some variables
//                 // Which is perfectly fine.
//                 // So, re-unique, if it sees something it doesn't own,
//                 // should leave it alone. Well that makes total sense.
//                 constants[stmt.sym.unique] = transformExpr(stmt.value, revisit);
//             } else {
//                 // ohhhhhhhh HDMASMDJKFDJSDKLFMmmmmm
//                 // SO
//                 // what if
//                 // The value that we're plopping here
//                 // gets stale?????
//                 // I thin kthat might be whats happening.
//                 // Because we're inlining a fnction and such
//                 // but the outer one has already been
//                 constants[stmt.sym.unique] = transformExpr(stmt.value, revisit);
//             }
//         }
//         return null;
//     },
// });

// Ugh ok so I do need to track scopes I guess
// Yeaht that's the way to do it. hrmmm
// Or actually I could just recursively call this! yeah that's great.
export const foldConstantAssignments = (foldLambdas: boolean) => (
    ctx: Context,
    topExpr: Expr,
): Expr => {
    return foldThemUpFolks(ctx, topExpr, foldLambdas);
    // This is the old way
    // return transformExpr(topExpr, visitor(ctx, {}, foldLambdas));
};

// export const foldConstantAssignmentsBlock = (ctx: Context, topExpr: Block): Block => {
//     // hrmmmmmmmmm soooooo hmmmm
//     let constants: { [v: string]: Expr | null } = {};
//     // let tupleConstants: { [v: string]: Tuple } = {};
//     // console.log('>> ', showLocation(topExpr.loc));
//     return transformExpr(topExpr, visitor(ctx, constants));
// };
