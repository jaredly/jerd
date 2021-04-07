import { idFromName, idName } from '../../typing/env';
import { void_ } from '../../typing/preset';
import { showLocation } from '../../typing/typeExpr';
import {
    Env,
    Id,
    isBuiltin,
    RecordDef,
    Symbol,
    walkTerm,
} from '../../typing/types';
import {
    defaultVisitor,
    transformBlock,
    transformExpr,
    transformLambdaBody,
    Visitor,
} from './transform';
import {
    Apply,
    Block,
    Expr,
    isTerm,
    Record,
    RecordSubType,
    ReturnStmt,
    Stmt,
} from './types';
import { and, asBlock, iffe } from './utils';

const symName = (sym: Symbol) => `${sym.name}$${sym.unique}`;

export const optimizeDefine = (env: Env, expr: Expr, id: Id): Expr => {
    expr = optimize(expr);
    expr = optimizeTailCalls(env, expr, id);
    return expr;
};

export const optimize = (expr: Expr): Expr => {
    const transformers: Array<(e: Expr) => Expr> = [
        removeUnusedVariables,
        removeNestedBlocksWithoutDefines,
        flattenNestedIfs,
        flattenIffe,
    ];
    transformers.forEach((t) => (expr = t(expr)));
    return expr;
};

export const optimizer = (visitor: Visitor) => (expr: Expr): Expr =>
    transformRepeatedly(expr, visitor);

// This flattens IFFEs that are the bodies of a lambda expr, or
// the value of a return statement.
export const flattenIffe = optimizer({
    ...defaultVisitor,
    block: (block) => {
        const items: Array<Stmt> = [];
        let changed = false;
        block.items.forEach((stmt) => {
            if (
                stmt.type === 'Return' &&
                stmt.value.type === 'apply' &&
                stmt.value.args.length === 0 &&
                stmt.value.target.type === 'lambda'
            ) {
                items.push(...asBlock(stmt.value.target.body).items);
                changed = true;
            } else {
                items.push(stmt);
            }
        });
        return changed ? { ...block, items } : block;
    },
    expr: (expr) => {
        if (
            expr.type === 'lambda' &&
            expr.body.type === 'apply' &&
            expr.body.args.length === 0 &&
            expr.body.target.type === 'lambda'
        ) {
            return {
                ...expr,
                body: expr.body.target.body,
            };
            // return false
        }
        return null;
    },
});

// TODO: need an `&&` logicOp type. Or just a general binOp type?
// or something. Maybe have && be a builtin, binop.
export const flattenNestedIfs = (expr: Expr): Expr => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (stmt.type !== 'if') {
                return null;
            }
            if (stmt.no != null) {
                return null;
            }
            if (stmt.yes.items.length !== 1) {
                return null;
            }
            if (stmt.yes.items[0].type !== 'if') {
                return null;
            }
            if (stmt.yes.items[0].no !== null) {
                return null;
            }
            return {
                ...stmt,
                cond: and(stmt.cond, stmt.yes.items[0].cond, stmt.loc),
                yes: stmt.yes.items[0].yes,
            };
        },
    });
};

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

export const removeNestedBlocksWithoutDefines = (expr: Expr): Expr => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        block: (block) => {
            const items: Array<Stmt> = [];
            let changed = false;
            block.items.forEach((item) => {
                if (
                    item.type === 'Block' &&
                    !item.items.some((item) => item.type === 'Define')
                ) {
                    changed = true;
                    items.push(...item.items);
                } else {
                    items.push(item);
                }
            });
            return changed ? { ...block, items } : block;
        },
    });
};

export const removeUnusedVariables = (expr: Expr): Expr => {
    const used: { [key: string]: boolean } = {};
    const visitor: Visitor = {
        ...defaultVisitor,
        expr: (value: Expr) => {
            switch (value.type) {
                case 'var':
                    used[symName(value.sym)] = true;
            }
            return null;
        },
    };
    if (transformExpr(expr, visitor) !== expr) {
        throw new Error(`Noop visitor somehow mutated`);
    }
    const remover: Visitor = {
        ...defaultVisitor,
        block: (block) => {
            const items = block.items.filter((stmt) => {
                const unused =
                    (stmt.type === 'Define' || stmt.type === 'Assign') &&
                    used[symName(stmt.sym)] !== true;
                return !unused;
            });
            return items.length !== block.items.length
                ? { ...block, items }
                : null;
        },
    };
    return transformExpr(expr, remover);
};

/// Optimizations for go, and possibly other languages

export const goOptimizations = (env: Env, expr: Expr): Expr => {
    const transformers: Array<(env: Env, e: Expr) => Expr> = [
        flattenRecordSpreads,
    ];
    transformers.forEach((t) => (expr = t(env, expr)));
    return expr;
};

const hasSpreads = (expr: Record) =>
    (expr.base.type === 'Concrete' && expr.base.spread != null) ||
    Object.keys(expr.subTypes).some((k) => expr.subTypes[k].spread != null);

export const flattenRecordSpreads = (env: Env, expr: Expr): Expr => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type !== 'record') {
                return null;
            }
            // nothing to flatten
            if (!hasSpreads(expr)) {
                return null;
            }
            return flattenRecordSpread(env, expr);
        },
    });
};

const isConstant = (arg: Expr) => {
    switch (arg.type) {
        case 'int':
        case 'float':
        case 'string':
        case 'term':
        case 'builtin':
        case 'var':
            return true;
        default:
            return false;
    }
};

export const flattenRecordSpread = (env: Env, expr: Record): Expr => {
    // console.log('flatten');
    const inits: Array<Stmt> = [];

    const subTypes: { [key: string]: RecordSubType } = { ...expr.subTypes };

    if (expr.base.type === 'Concrete') {
        const b = expr.base;
        if (expr.base.spread) {
            let target: Expr;
            if (isConstant(expr.base.spread)) {
                target = expr.base.spread;
            } else {
                const v: Symbol = { name: 'arg', unique: env.local.unique++ };
                inits.push({
                    type: 'Define',
                    sym: v,
                    value: expr.base.spread,
                    loc: expr.loc,
                    is: expr.is,
                });
                target = { type: 'var', sym: v, loc: expr.loc };
            }
            // const d = env.global.types[idName(expr.base.ref.id)] as RecordDef;
            const rows: Array<Expr> = expr.base.rows.map((row, i) => {
                if (row == null) {
                    return {
                        type: 'attribute',
                        target,
                        ref: b.ref,
                        idx: i,
                        loc: expr.loc,
                    };
                } else {
                    return row;
                }
            });
            expr = { ...expr, base: { ...expr.base, spread: null, rows } };

            Object.keys(expr.subTypes).forEach((k) => {
                const subType = expr.subTypes[k];
                const rows: Array<Expr> = subType.rows.map((row, i) => {
                    if (row == null) {
                        return {
                            type: 'attribute',
                            // TODO: check if this is complex,
                            // and if so, make a variable
                            target,
                            ref: { type: 'user', id: idFromName(k) },
                            idx: i,
                            loc: expr.loc,
                        };
                    } else {
                        return row;
                    }
                });
                subTypes[k] = { ...subType, rows };
            });
        } else if (expr.base.rows.some((r) => r == null)) {
            throw new Error(`No spread, but some null`);
        }
    } else {
        throw new Error('variable sorry');
    }

    Object.keys(expr.subTypes).forEach((k) => {
        const subType = expr.subTypes[k];
        if (subType.spread) {
            let target: Expr;
            if (isConstant(subType.spread)) {
                target = subType.spread;
            } else {
                const v: Symbol = {
                    name: 'st' + k,
                    unique: env.local.unique++,
                };
                inits.push({
                    type: 'Define',
                    sym: v,
                    value: subType.spread,
                    loc: subType.spread.loc,
                    is: {
                        type: 'ref',
                        ref: { type: 'user', id: idFromName(k) },
                        location: null,
                        // STOPSHIP: ???
                        typeVbls: [],
                        effectVbls: [],
                    },
                });
                target = { type: 'var', sym: v, loc: expr.loc };
            }
            const rows: Array<Expr> = subType.rows.map((row, i) => {
                if (row == null) {
                    return {
                        type: 'attribute',
                        // TODO: check if this is complex,
                        // and if so, make a variable
                        target,
                        ref: { type: 'user', id: idFromName(k) },
                        idx: i,
                        loc: expr.loc,
                    };
                } else {
                    return row;
                }
            });
            subTypes[k] = { ...subTypes[k], spread: null, rows };
        } else {
            subTypes[k] = subTypes[k];
        }
    });
    expr = { ...expr, subTypes };

    if (hasSpreads(expr)) {
        throw new Error('not gone');
    }

    if (inits.length) {
        return iffe(
            {
                type: 'Block',
                items: inits.concat({
                    type: 'Return',
                    loc: expr.loc,
                    value: expr,
                }),
                loc: expr.loc,
            },
            {
                type: 'ref',
                location: null,
                // @ts-ignore
                ref: expr.base.ref,
                typeVbls: [],
                effectVbls: [],
            },
        );
    } else {
        return expr;
    }
};

export const hasTailCall = (body: Block | Expr, self: Id): boolean => {
    let found = false;
    let hasLoop = false;
    transformLambdaBody(body, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (isSelfTail(stmt, self)) {
                found = true;
            } else if (stmt.type === 'Loop') {
                hasLoop = true;
            }
            return null;
        },
        expr: (expr) => {
            if (expr.type === 'lambda') {
                // don't recurse into lambdas
                return false;
            }
            // no changes, but do recurse
            return null;
        },
    });
    return found && !hasLoop;
};

const isSelfTail = (stmt: Stmt, self: Id) =>
    stmt.type === 'Return' &&
    stmt.value.type === 'apply' &&
    isTerm(stmt.value.target, self);

export const optimizeTailCalls = (env: Env, expr: Expr, self: Id) => {
    if (expr.type === 'lambda') {
        const body = tailCallRecursion(
            env,
            expr.body,
            expr.args.map((a) => a.sym),
            self,
        );
        return body !== expr.body ? { ...expr, body } : expr;
    }
    return expr;
};

export const tailCallRecursion = (
    env: Env,
    body: Block | Expr,
    argNames: Array<Symbol>,
    self: Id,
): Block | Expr => {
    if (!hasTailCall(body, self)) {
        return body;
    }
    return {
        type: 'Block',
        loc: body.loc,
        items: [
            {
                type: 'Loop',
                loc: body.loc,
                body: transformBlock(asBlock(body), {
                    ...defaultVisitor,
                    block: (block) => {
                        if (!block.items.some((s) => isSelfTail(s, self))) {
                            return null;
                        }

                        const items: Array<Stmt> = [];
                        block.items.forEach((stmt) => {
                            if (isSelfTail(stmt, self)) {
                                const apply = (stmt as ReturnStmt)
                                    .value as Apply;
                                const vbls = apply.args.map((arg, i) => {
                                    const sym: Symbol = {
                                        name: 'recur',
                                        unique: env.local.unique++,
                                    };
                                    // TODO: we need the type of all the things I guess...
                                    items.push({
                                        type: 'Define',
                                        sym,
                                        loc: arg.loc,
                                        value: arg,
                                        is: void_,
                                    });
                                    return sym;
                                });
                                vbls.forEach((sym, i) => {
                                    items.push({
                                        type: 'Assign',
                                        sym: argNames[i],
                                        loc: apply.args[i].loc,
                                        is: void_,
                                        value: {
                                            type: 'var',
                                            sym,
                                            loc: apply.args[i].loc,
                                        },
                                    });
                                });
                                items.push({ type: 'Continue', loc: stmt.loc });
                            } else {
                                items.push(stmt);
                            }
                        });
                        return { ...block, items };
                    },
                }),
            },
        ],
    };
};
