import { Symbol } from '../../../typing/types';
import { reUnique } from '../../typeScriptPrinterSimple';
import {
    defaultVisitor,
    transformBlock,
    transformExpr,
    Visitor,
} from '../transform';
import { Assign, Block, Define, Expr } from '../types';
import { Context, isConstant } from './optimize';

// Null: not initialized yet (or it wasn't constant)
// False: poisoned (no longer usable)
type Defines = { [key: number]: Expr | null | false };

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
        onInvalidate: (sym) => {
            defines[sym.unique] = false;
        },
        onNested: (b, noOuterRedefines) => {
            const inner: Defines = { ...defines };
            if (noOuterRedefines) {
                transformBlock(b, {
                    ...defaultVisitor,
                    stmt: (stmt) => {
                        if (stmt.type === 'Loop' && stmt.bounds) {
                            inner[stmt.bounds.sym.unique] = false;
                        }
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
    onInvalidate: (s: Symbol) => void;
};

const visitorGeneral = ({
    onDefine,
    onAssign,
    onGet,
    onNested,
    onInvalidate,
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
                if (stmt.bounds) {
                    onInvalidate(stmt.bounds.sym);
                }
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
            if (expr.type === 'handle') {
                const pure = onNested(expr.pure.body, true);
                let changed = false;
                const cases = expr.cases.map((kase) => {
                    const body = onNested(kase.body, true);
                    changed = changed || body !== kase.body;
                    return { ...kase, body };
                });
                return pure !== expr.pure.body || changed
                    ? {
                          ...expr,
                          pure: { ...expr.pure, body: pure, cases },
                      }
                    : expr;
            }
            if (expr.type === 'apply' && expr.target.type === 'var') {
                const v = onGet(expr.target.sym);
                if (v != null) {
                    return { ...expr, target: v };
                }
                return null;
            }
            if (expr.type === 'var') {
                const v = onGet(expr.sym);
                if (v != null) {
                    return [v];
                }
                return null;
            }
            return null;
        },
    };
};

// Ugh ok so I do need to track scopes I guess
// Yeaht that's the way to do it. hrmmm
// Or actually I could just recursively call this! yeah that's great.
export const foldConstantAssignments = (foldLambdas: boolean) => (
    ctx: Context,
    topExpr: Expr,
): Expr => {
    return foldThemUpFolks(ctx, topExpr, foldLambdas);
};
