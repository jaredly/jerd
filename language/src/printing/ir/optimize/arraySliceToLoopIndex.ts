import { Symbol, symbolsEqual } from '../../../typing/types';
import {
    defaultVisitor,
    transformExpr,
    transformStmt,
    Visitor,
} from '../transform';
import { Expr, Stmt, Type } from '../types';
import { builtin, callExpression, int, pureFunction } from '../utils';
import { minus, plus } from './arraySlices';
import { Context, symName } from './optimize';

export const arraySliceLoopToIndex = (ctx: Context, expr: Expr): Expr => {
    if (expr.type !== 'lambda') {
        // console.log('not a lambda', expr.type);
        return expr;
    }
    // being fairly conservative here
    if (
        expr.body.type !== 'Block' ||
        expr.body.items.length !== 1 ||
        expr.body.items[0].type !== 'Loop'
    ) {
        // console.log('not a block', expr.body.type);
        return expr;
    }
    const arrayArgs = expr.args.filter((arg) => arg.type.type === 'Array');
    if (!arrayArgs.length) {
        // console.log('no arrays');
        return expr;
    }
    const argMap: { [key: string]: null | boolean } = {};
    // null = no slice
    // false = disqualified
    // true = slice
    // Valid state transitions:
    //   null -> true
    //   null -> false
    //   true -> false
    arrayArgs.forEach((a) => (argMap[symName(a.sym)] = null));
    // IF an array arg is used for anything other than
    // - arr.length
    // - arr[idx]
    // - arr.slice
    // Then it is disqualified
    // Also, if it's not used for arr.slice, we don't need to mess
    transformExpr(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (
                stmt.type === 'Assign' &&
                stmt.value.type === 'slice' &&
                stmt.value.end === null &&
                stmt.value.value.type === 'var' &&
                symbolsEqual(stmt.sym, stmt.value.value.sym)
            ) {
                const n = symName(stmt.sym);
                if (argMap[n] !== false) {
                    argMap[n] = true;
                }
                return false;
            }
            return null;
        },
        expr: (expr) => {
            switch (expr.type) {
                case 'var':
                    // console.log('Found a far!', expr);
                    argMap[symName(expr.sym)] = false;
                    return null;
                // Slices *are* disqualifying if they're not
                // a self-assign slice
                case 'arrayIndex':
                case 'arrayLen':
                    if (expr.value.type === 'var') {
                        // don't recurse, these are valid uses
                        return false;
                    }
                    return null;
            }
            return null;
        },
    });
    // I wonder if there's a more general optimization
    // that I can do that would remove the need for slices
    // even when it's not self-recursive.......
    const corrects = arrayArgs.filter((k) => argMap[symName(k.sym)] === true);
    if (!corrects.length) {
        // console.log('no corrects', argMap);
        return expr;
    }
    const indexForSym: { [key: string]: { sym: Symbol; type: Type } } = {};
    const indices: Array<Symbol> = corrects.map((arg) => {
        const unique = ctx.env.local.unique.current++;
        const s = { name: arg.sym.name + '_i', unique };
        indexForSym[symName(arg.sym)] = { sym: s, type: int };
        return s;
    });
    const modified: Array<Expr> = [];
    const stmtTransformer: Visitor = {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (
                stmt.type === 'Assign' &&
                stmt.value.type === 'slice' &&
                stmt.value.end === null &&
                stmt.value.value.type === 'var' &&
                symbolsEqual(stmt.sym, stmt.value.value.sym)
            ) {
                const n = symName(stmt.sym);
                if (argMap[n] === true) {
                    return {
                        ...stmt,
                        sym: indexForSym[n].sym,
                        value: callExpression(
                            ctx.env,
                            builtin(
                                '+',
                                expr.loc,
                                pureFunction([int, int], int),
                            ),
                            [
                                {
                                    type: 'var',
                                    loc: expr.loc,
                                    sym: indexForSym[n].sym,
                                    is: indexForSym[n].type,
                                },
                                stmt.value.start,
                            ],
                            expr.loc,
                        ),
                    };
                }
                return false;
            }
            return null;
        },
        expr: (expr) => {
            switch (expr.type) {
                case 'arrayIndex': {
                    if (expr.value.type === 'var') {
                        const n = symName(expr.value.sym);
                        if (argMap[n] === true) {
                            return {
                                ...expr,
                                idx: plus(
                                    ctx.env,
                                    expr.idx,
                                    {
                                        type: 'var',
                                        loc: expr.loc,
                                        sym: indexForSym[n].sym,
                                        is: indexForSym[n].type,
                                    },
                                    expr.loc,
                                ),
                            };
                        }
                    }
                    return null;
                }
                case 'arrayLen':
                    if (expr.value.type === 'var') {
                        if (modified.includes(expr)) {
                            return false;
                        }
                        const n = symName(expr.value.sym);
                        if (argMap[n] === true) {
                            modified.push(expr);
                            return minus(
                                ctx.env,
                                expr,
                                {
                                    type: 'var',
                                    loc: expr.loc,
                                    sym: indexForSym[n].sym,
                                    is: indexForSym[n].type,
                                },
                                expr.loc,
                            );
                        }
                    }
                    return null;
            }
            return null;
        },
    };
    const items: Array<Stmt> = [];
    expr.body.items.forEach((item) => {
        const res = transformStmt(item, stmtTransformer);
        if (Array.isArray(res)) {
            items.push(...res);
        } else {
            items.push(res);
        }
    });
    return {
        ...expr,
        body: {
            ...expr.body,
            items: indices
                .map(
                    (sym) =>
                        ({
                            type: 'Define',
                            loc: expr.loc,
                            is: int,
                            sym,
                            value: {
                                type: 'int',
                                value: 0,
                                loc: expr.loc,
                                is: int,
                            },
                        } as Stmt),
                )
                .concat(items),
        },
    };
};
