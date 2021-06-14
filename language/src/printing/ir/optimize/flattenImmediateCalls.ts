import { idFromName, idName, newSym } from '../../../typing/env';
import { LocatedError } from '../../../typing/errors';
import { showLocation } from '../../../typing/typeExpr';
import {
    Env,
    Id,
    idsEqual,
    RecordDef,
    refsEqual,
    Symbol,
    symbolsEqual,
} from '../../../typing/types';
import { termToGlsl } from '../../glslPrinter';
import { printToString } from '../../printer';
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
    Loc,
    OutputOptions,
    Record,
    RecordSubType,
    ReturnStmt,
    Stmt,
    Tuple,
    Type,
    typesEqual,
} from '../types';
import {
    bool,
    callExpression,
    define,
    handlerSym,
    int,
    pureFunction,
    typeFromTermType,
    var_,
    void_,
} from '../utils';
import { and, asBlock, builtin, iffe } from '../utils';
import { inlint } from './inline';
import { isConstant } from './optimize';
import { transformRepeatedly } from './utils';

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

export const addContinueChecks = (
    env: Env,
    done: Symbol,
    body: Stmt,
    loc: Loc,
    touched: Array<Stmt>,
): Block => {
    return transformStmt(body, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type === 'lambda' || expr.type === 'handle') {
                return false;
            }
            return null;
        },
        block: (block) => {
            if (touched.includes(block)) {
                return null;
            }
            if (!hasTrailingItems(block)) {
                return null;
            }
            // START HERE:
            // I think a more precise version of this would be:
            // A; if B {}; C; if D {}; E
            // becomes
            // A; if B {}; if continueBlock { if D {}; if continueBlock { E } }
            // They need to be nested.
            // This should be a STOPSHIP, as I'm sure some things are broken..

            block.items[0].type;

            // AND NEXT: These won't work for `loop`s -- I need to add a `break` as well
            // as the assign.
            // How do I know that I'm in a loop?
            const res: Array<Stmt> = [];
            for (let i = 0; i < block.items.length; i++) {
                const at = i;
                const stmt = block.items[i];
                if (stmt.type !== 'if') {
                    const nonifs: Array<Stmt> = [stmt];
                    while (
                        i < block.items.length - 1 &&
                        block.items[i + 1].type !== 'if'
                    ) {
                        i++;
                        nonifs.push(block.items[i]);
                    }
                    if (at === 0) {
                        res.push(...nonifs);
                        continue;
                    }
                    const yes: Block = {
                        type: 'Block',
                        items: nonifs,
                        loc: loc,
                    };
                    touched.push(yes);

                    res.push({
                        type: 'if',
                        cond: var_(done, loc, bool),
                        yes,
                        no: null,
                        loc: loc,
                    });
                } else {
                    if (at === 0) {
                        res.push(stmt);
                        continue;
                    }
                    res.push({
                        ...stmt,
                        cond: callExpression(
                            env,
                            builtin(
                                '&&',
                                loc,
                                pureFunction([bool, bool], bool),
                            ),
                            [var_(done, loc, bool), stmt.cond],
                            loc,
                        ),
                    });
                }
            }
            const newBlock = { ...block, items: res };
            touched.push(newBlock);
            return newBlock;
        },
    }) as Block;
};

const hasTrailingItems = (block: Block) => {
    return block.items.find((item, i) => {
        if (item.type === 'if' || item.type === 'Loop') {
            return i < block.items.length - 1;
        }
        return false;
    });
};

export const flattenLambda = (
    env: Env,
    expr: Apply,
    target: LambdaExpr,
    returnAs: Symbol | null,
): Array<Stmt> => {
    const args = expr.args;
    const stmts: Array<Stmt> = target.args
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

    // If there's only one thing in town, go for it.
    if (target.body.type !== 'Block') {
        if (returnAs) {
            stmts.push({
                type: 'Assign',
                sym: returnAs,
                value: target.body,
                loc: target.body.loc,
                is: target.body.is,
            });
        } else {
            stmts.push({
                type: 'Expression',
                expr: target.body,
                loc: target.body.loc,
            });
        }
        return stmts;
    }

    const byUnique: { [key: number]: Expr } | null =
        target.args.length > 0 ? {} : null;
    if (byUnique) {
        target.args.forEach((arg, i) => {
            byUnique[arg.sym.unique] = args[i];
        });
    }
    const done = newSym(env, 'continueBlock');
    stmts.push({
        type: 'Define',
        is: bool,
        loc: target.loc,
        value: builtin('true', target.loc, bool),
        sym: done,
    });
    // TODO: only do this if we have non-final returns
    const touched: Array<Block> = [];

    // This is a debug assert -- remove for prod please.
    transformStmt(target.body, {
        ...defaultVisitor,
        block: (block) => {
            block.items.forEach((item, i) => {
                if (item.type === 'Return' && i !== block.items.length - 1) {
                    throw new Error(`Non-terminal return!`);
                }
            });
            return null;
        },
    });

    // const wrapItems = (items: Array<Stmt>, inLoop: boolean) => {
    //     // What do we look for? trailing items after an "if" or a "loop"
    // };

    // Add the "if continueBlock" everywhere.
    const body = addContinueChecks(
        env,
        done,
        target.body,
        target.loc,
        touched,
    ) as Block;

    body.items.forEach((item) => {
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
                    return [
                        returnAs
                            ? {
                                  type: 'Assign',
                                  sym: returnAs,
                                  value: stmt.value,
                                  loc: stmt.loc,
                                  is: stmt.value.is,
                              }
                            : {
                                  type: 'Expression',
                                  loc: stmt.loc,
                                  expr: stmt.value,
                              },
                        {
                            type: 'Assign',
                            sym: done,
                            value: builtin('false', stmt.loc, bool),
                            loc: stmt.loc,
                            is: bool,
                        },
                    ];
                }
                // return multiple
                // OK HERE: we could, for every thing,
                // make it a pain in the bhind
                // but lets not
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
    return stmts;
    // return [target.body];
};

const flattenSingleLambda = (
    env: Env,
    expr: Expr,
    prefixes: Array<Stmt>,
): null | { prefixes: Array<Stmt>; res: Expr | null } => {
    if (
        expr.type !== 'apply' ||
        expr.target.type !== 'lambda' ||
        expr.target.body.type !== 'Block'
    ) {
        return null;
    }
    const stmts: Array<Stmt> = [];

    // if (true) {
    //     return null;
    // }

    const sym = typesEqual(expr.is, void_)
        ? null
        : newSym(env, `lambdaBlockResult`);

    if (sym) {
        stmts.push({
            type: 'Define',
            sym,
            is: expr.is,
            value: null,
            fakeInit: true,
            loc: expr.loc,
        });
    }
    stmts.push(...flattenLambda(env, expr, expr.target, sym));

    prefixes = stmts.concat(prefixes);
    // return stmts;
    return { prefixes, res: sym ? var_(sym, expr.loc, expr.is) : null };
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
        block: (_) => {
            return false;
        },
        stmt: (stmt) => {
            if (stmt.type === 'Return') {
                const res = flattenSingleLambda(env, stmt.value, prefixes);
                if (res != null) {
                    prefixes = res.prefixes;
                    if (res.res) {
                        return { ...stmt, value: res.res };
                    } else {
                        return [];
                    }
                }
            } else if (stmt.type === 'Expression') {
                const res = flattenSingleLambda(env, stmt.expr, prefixes);
                if (res != null) {
                    prefixes = res.prefixes;
                    if (res.res) {
                        return { ...stmt, value: res.res };
                    } else {
                        return [];
                    }
                }
            }
            return null;
        },
        expr: (expr) => {
            // Don't go into lambdas or handles
            if (expr.type === 'lambda' || expr.type === 'handle') {
                return false;
            }
            const res = flattenSingleLambda(env, expr, prefixes);
            if (res != null) {
                prefixes = res.prefixes;
                if (res.res) {
                    return res.res;
                } else {
                    throw new LocatedError(
                        expr.loc,
                        `Got to an expr, and the value is void....`,
                    );
                }
            }
            return null;
        },
    });
    if (!prefixes.length) {
        return result;
    }
    return prefixes.concat(Array.isArray(result) ? result : [result]);
};

export const flattenImmediateCalls = (env: Env, expr: Expr) => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            // not the place
            if (stmt.type === 'Block') {
                return null;
            }

            if (
                (stmt.type === 'Assign' || stmt.type === 'Define') &&
                stmt.value &&
                stmt.value.type === 'apply' &&
                stmt.value.target.type === 'lambda'
            ) {
                // const x = (() => {})()
                const stmts: Array<Stmt> = [];
                if (stmt.type === 'Define') {
                    stmts.push({
                        type: 'Define',
                        sym: stmt.sym,
                        is: stmt.is,
                        value: null,
                        fakeInit: true,
                        loc: stmt.loc,
                    });
                }
                stmts.push(
                    ...flattenLambda(
                        env,
                        stmt.value,
                        stmt.value.target,
                        stmt.sym,
                    ),
                );

                // return stmts;
                return stmts;
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
            return flattenDefineLambdas(env, stmt);
        },

        expr: (expr) => {
            if (expr.type === 'handle') {
                return false;
            }
            // TODO: huh should I just remove the "lambda body is expr" case
            // from the IR? that would simplify some things.
            if (expr.type === 'lambda' && expr.body.type !== 'Block') {
                // handle the toplevel case folks
                const ret: Stmt = {
                    type: 'Return',
                    value: expr.body,
                    loc: expr.body.loc,
                };
                // const block = asBlock(expr.body)
                let flattened = flattenDefineLambdas(env, ret);
                if (flattened === ret) {
                    return null;
                }
                if (!Array.isArray(flattened)) {
                    flattened = [flattened];
                }

                return {
                    ...expr,
                    body: {
                        type: 'Block',
                        loc: expr.body.loc,
                        items: flattened,
                    },
                };
            }

            if (expr.type !== 'apply' || expr.target.type !== 'lambda') {
                return null;
            }
            let body: Expr;
            if (expr.target.body.type === 'Block') {
                if (expr.target.body.items.length !== 1) {
                    return null;
                }
                if (expr.target.body.items[0].type === 'Expression') {
                    body = expr.target.body.items[0].expr;
                } else if (expr.target.body.items[0].type === 'Return') {
                    body = expr.target.body.items[0].value;
                } else {
                    return null;
                }
                // TODO TODO: we have sophisticated inlining now, we don't have
                // to bail here on multi-item bodies.
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
