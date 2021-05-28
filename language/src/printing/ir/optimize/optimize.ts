import { idFromName, idName } from '../../../typing/env';
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
} from '../utils';
import { and, asBlock, builtin, iffe } from '../utils';
import { flattenImmediateCalls } from './flattenImmediateCalls';
import { inlint } from './inline';
import { monoconstant } from './monoconstant';
import { monomorphize } from './monomorphize';

export type Optimizer = (
    senv: Env,
    irOpts: OutputOptions,
    irTerms: Exprs,
    irTerm: Expr,
    id: Id,
) => Expr;

const symName = (sym: Symbol) => `${sym.name}$${sym.unique}`;

export const optimizeDefine = (env: Env, expr: Expr, id: Id): Expr => {
    expr = optimize(env, expr);
    expr = optimizeTailCalls(env, expr, id);
    expr = optimize(env, expr);
    expr = arraySliceLoopToIndex(env, expr);
    // expr = arraySlices(env, expr);
    return expr;
};

export type Exprs = {
    [idName: string]: { expr: Expr; inline: boolean; comment?: string };
};

export const optimizeAggressive = (
    env: Env,
    exprs: Exprs,
    expr: Expr,
    id: Id,
): Expr => {
    expr = inlint(env, exprs, expr, id);
    expr = monomorphize(env, exprs, expr);
    expr = monoconstant(env, exprs, expr);
    // Ok, now that we've inlined /some/ things,
    // let's inline more things!
    // Like, when we find ... a lambda being passed
    // well first
    // when we find a lambda as a variable
    // we go ahead and inline it everywhere
    // unless it takes scope variables
    // in which case we just die a little
    // maybe?
    // Although: We could turn it into:
    // lambda_scope: {a: a, b: b, c: c} (we'd have to gen a type for it)
    // and then when "passing" the lambda in, we instead pass the struct.
    // How would that jive with the notion of passing in various functions,
    // and doing a bunch of IFs?
    // Ok so first we inline constants, right?
    // to see if we can remove the scope variable
    // hmm ok yeah.

    // ok well first step is not to do lambdas, but rather
    // just top-level functions.
    return expr;
};

export const optimize = (env: Env, expr: Expr): Expr => {
    const transformers: Array<(env: Env, e: Expr) => Expr> = [
        // OK so this iffe thing is still the only thing
        // helping us with the `if` at the end of
        // shortestDistanceToSurface

        flattenIffe,

        // removeUnusedVariables,
        // removeNestedBlocksWithoutDefinesAndCodeAfterReturns,
        // foldConstantTuples,
        // removeSelfAssignments,
        // foldConstantAssignments,
        // foldSingleUseAssignments,
        flattenNestedIfs,
        arraySlices,
        foldConstantAssignments,
        removeUnusedVariables,
        flattenNestedIfs,
        // flattenImmediateCalls,
    ];
    transformers.forEach((t) => (expr = t(env, expr)));
    return expr;
};

export const optimizer = (visitor: Visitor) => (env: Env, expr: Expr): Expr =>
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
        }
        if (
            expr.type === 'lambda' &&
            expr.body.type === 'Block' &&
            expr.body.items.length === 1 &&
            expr.body.items[0].type === 'Expression' &&
            expr.body.items[0].expr.type === 'apply' &&
            expr.body.items[0].expr.target.type === 'lambda' &&
            expr.body.items[0].expr.args.length === 0
        ) {
            return {
                ...expr,
                body: expr.body.items[0].expr.target.body,
            };
        }
        return null;
    },
});

// TODO: need an `&&` logicOp type. Or just a general binOp type?
// or something. Maybe have && be a builtin, binop.
export const flattenNestedIfs = (env: Env, expr: Expr): Expr => {
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
                cond: and(env, stmt.cond, stmt.yes.items[0].cond, stmt.loc),
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

export const removeNestedBlocksWithoutDefinesAndCodeAfterReturns = (
    env: Env,
    expr: Expr,
): Expr => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (
                expr.type === 'lambda' &&
                expr.body.type === 'Block' &&
                expr.body.items.length === 1 &&
                expr.body.items[0].type === 'Return'
            ) {
                return { ...expr, body: expr.body.items[0].value };
            }
            return null;
        },
        block: (block) => {
            const items: Array<Stmt> = [];
            let changed = false;
            let hasReturned = false;
            block.items.forEach((item, i) => {
                if (hasReturned) {
                    changed = true;
                    return;
                }
                if (item.type === 'Return') {
                    items.push(item);
                    hasReturned = true;
                    return;
                }
                if (
                    item.type === 'Block' &&
                    // It's ok to have defines if it's the last item in the block
                    (i === block.items.length - 1 ||
                        !item.items.some((item) => item.type === 'Define'))
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

export const foldConstantTuples = (env: Env, expr: Expr): Expr => {
    let tupleConstants: { [v: string]: Tuple | null } = {};
    return transformExpr(expr, {
        ...defaultVisitor,
        // Don't go into lambdas
        expr: (value) => {
            if (value.type === 'tupleAccess') {
                if (value.target.type === 'var') {
                    const t = tupleConstants[symName(value.target.sym)];
                    if (t != null) {
                        if (isConstant(t.items[value.idx])) {
                            return t.items[value.idx];
                        }
                    }
                }
            }
            if (value.type === 'var') {
                const v = tupleConstants[symName(value.sym)];
                if (v != null) {
                    tupleConstants[symName(value.sym)] = null;
                }
            }
            return null;
        },
        stmt: (value) => {
            if (
                (value.type === 'Define' || value.type === 'Assign') &&
                value.value != null &&
                value.value.type === 'tuple'
            ) {
                tupleConstants[symName(value.sym)] = value.value;
            }
            return null;
        },
    });
};

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
export const foldSingleUseAssignments = (env: Env, expr: Expr): Expr => {
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

export const removeSelfAssignments = (_: Env, expr: Expr) =>
    transformExpr(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (
                stmt.type === 'Assign' &&
                stmt.value.type === 'var' &&
                stmt.sym.unique === stmt.value.sym.unique
            ) {
                return [];
            }
            return null;
        },
    });

export const foldConstantAssignments = (env: Env, expr: Expr): Expr => {
    let constants: { [v: string]: Expr | null } = {};
    // let tupleConstants: { [v: string]: Tuple } = {};
    return transformExpr(expr, {
        ...defaultVisitor,
        // Don't go into lambdas that aren't the toplevel one
        expr: (value) => {
            if (value.type === 'lambda' && value !== expr) {
                return false;
            }
            if (value.type === 'handle') {
                return false;
            }
            if (value.type === 'var') {
                const v = constants[symName(value.sym)];
                if (v != null) {
                    return v;
                }
            }
            return null;
        },
        stmt: (value) => {
            if (value.type === 'if') {
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
                transformStmt(value.yes, checkAssigns);
                if (value.no) {
                    transformStmt(value.no, checkAssigns);
                }
                return false;
            }
            // Remove x = x
            if (
                value.type === 'Assign' &&
                value.value.type === 'var' &&
                value.sym.unique === value.value.sym.unique
            ) {
                return [];
            }
            if (
                (value.type === 'Define' || value.type === 'Assign') &&
                value.value != null &&
                isConstant(value.value)
            ) {
                constants[symName(value.sym)] = value.value;
            }
            return null;
        },
    });
};

export const removeUnusedVariables = (env: Env, expr: Expr): Expr => {
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

export const goOptimizations = (
    env: Env,
    opts: OutputOptions,
    expr: Expr,
): Expr => {
    const transformers: Array<
        (env: Env, opts: OutputOptions, e: Expr) => Expr
    > = [flattenRecordSpreads];
    transformers.forEach((t) => (expr = t(env, opts, expr)));
    return expr;
};

const hasSpreads = (expr: Record) =>
    (expr.base.type === 'Concrete' && expr.base.spread != null) ||
    Object.keys(expr.subTypes).some((k) => expr.subTypes[k].spread != null);

export const flattenRecordSpreads = (
    env: Env,
    opts: OutputOptions,
    expr: Expr,
): Expr => {
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
            return flattenRecordSpread(env, opts, expr);
        },
    });
};

export const isConstant = (arg: Expr): boolean => {
    switch (arg.type) {
        case 'int':
        case 'float':
        case 'string':
        case 'term':
        case 'builtin':
        case 'var':
            return true;
        case 'tupleAccess':
            return isConstant(arg.target);
        case 'attribute':
            return isConstant(arg.target);
        default:
            return false;
    }
};

export const flattenRecordSpread = (
    env: Env,
    opts: OutputOptions,
    expr: Record,
): Expr => {
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
                const v: Symbol = {
                    name: 'arg_spread',
                    unique: env.local.unique.current++,
                };
                inits.push({
                    type: 'Define',
                    sym: v,
                    value: expr.base.spread,
                    loc: expr.loc,
                    is: expr.is,
                });
                target = { type: 'var', sym: v, loc: expr.loc, is: expr.is };
            }
            const d = env.global.types[idName(expr.base.ref.id)] as RecordDef;
            const rows: Array<Expr> = expr.base.rows.map((row, i) => {
                if (row == null) {
                    return {
                        type: 'attribute',
                        target,
                        ref: b.ref,
                        idx: i,
                        loc: expr.loc,
                        is: typeFromTermType(env, opts, d.items[i]),
                    };
                } else {
                    return row;
                }
            });
            expr = { ...expr, base: { ...expr.base, spread: null, rows } };

            Object.keys(expr.subTypes).forEach((k) => {
                const subType = expr.subTypes[k];
                const d = env.global.types[k] as RecordDef;
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
                            is: typeFromTermType(env, opts, d.items[i]),
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
                    unique: env.local.unique.current++,
                };
                inits.push({
                    type: 'Define',
                    sym: v,
                    value: subType.spread,
                    loc: subType.spread.loc,
                    is: {
                        type: 'ref',
                        ref: { type: 'user', id: idFromName(k) },
                        loc: null,
                        typeVbls: [],
                    },
                });
                target = { type: 'var', sym: v, loc: expr.loc, is: expr.is };
            }
            const d = env.global.types[k] as RecordDef;
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
                        is: typeFromTermType(env, opts, d.items[i]),
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
        return iffe(env, {
            type: 'Block',
            items: inits.concat({
                type: 'Return',
                loc: expr.loc,
                value: expr,
            }),
            loc: expr.loc,
        });
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
            // This is where we would define any de-slicers
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
                                        unique: env.local.unique.current++,
                                    };
                                    // TODO: we need the type of all the things I guess...
                                    items.push({
                                        type: 'Define',
                                        sym,
                                        loc: arg.loc,
                                        value: arg,
                                        is: arg.is,
                                    });
                                    return sym;
                                });
                                vbls.forEach((sym, i) => {
                                    items.push({
                                        type: 'Assign',
                                        sym: argNames[i],
                                        loc: apply.args[i].loc,
                                        is: apply.args[i].is,
                                        value: {
                                            type: 'var',
                                            sym,
                                            loc: apply.args[i].loc,
                                            is: apply.args[i].is,
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

export const arraySliceLoopToIndex = (env: Env, expr: Expr): Expr => {
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
    const arrayArgs = expr.args.filter(
        (arg) =>
            arg.type.type === 'ref' &&
            arg.type.ref.type === 'builtin' &&
            arg.type.ref.name === 'Array',
    );
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
        const unique = env.local.unique.current++;
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
                            env,
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
                                idx: callExpression(
                                    env,
                                    builtin(
                                        '+',
                                        expr.loc,
                                        pureFunction([int, int], int),
                                    ),
                                    [
                                        expr.idx,
                                        {
                                            type: 'var',
                                            loc: expr.loc,
                                            sym: indexForSym[n].sym,
                                            is: indexForSym[n].type,
                                        },
                                    ],
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
                            return callExpression(
                                env,
                                builtin(
                                    '-',
                                    expr.loc,
                                    pureFunction([int, int], int),
                                ),
                                [
                                    expr,
                                    {
                                        type: 'var',
                                        loc: expr.loc,
                                        sym: indexForSym[n].sym,
                                        is: indexForSym[n].type,
                                    },
                                ],
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
                            loc: null,
                            is: int,
                            sym,
                            value: {
                                type: 'int',
                                value: 0,
                                loc: null,
                                is: int,
                            },
                        } as Stmt),
                )
                .concat(items),
        },
    };
};

export const arraySlices = (env: Env, expr: Expr): Expr => {
    const arrayInfos: {
        [key: string]: {
            start: Symbol;
            src: Symbol;
        };
    } = {};
    const resolve = (sym: Symbol): { src: Symbol; start: Expr } | null => {
        const n = symName(sym);
        if (!arrayInfos[n]) {
            return null;
        }
        // let {start, src} = arrayInfos[n]
        let start: Expr = {
            type: 'var',
            loc: null,
            sym: arrayInfos[n].start,
            is: int,
        };
        let src = arrayInfos[n].src;
        const nxt = resolve(arrayInfos[n].src);
        if (nxt != null) {
            src = nxt.src;
            start = callExpression(
                env,
                builtin('+', expr.loc, pureFunction([int, int], int)),
                [start, nxt.start],
                expr.loc,
            );
        }
        return { src, start };
    };

    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            switch (expr.type) {
                case 'slice':
                    if (expr.value.type === 'var' && expr.end == null) {
                        const res = resolve(expr.value.sym);
                        if (res == null) {
                            return null;
                        }
                        return {
                            ...expr,
                            value: { ...expr.value, sym: res.src },
                            start: callExpression(
                                env,
                                builtin(
                                    '+',
                                    expr.loc,
                                    pureFunction([int, int], int),
                                ),
                                [expr.start, res.start],
                                expr.loc,
                            ),
                        };
                    }
                    return null;
                case 'arrayIndex':
                    if (expr.value.type === 'var') {
                        const res = resolve(expr.value.sym);
                        if (res == null) {
                            return null;
                        }
                        return {
                            ...expr,
                            value: { ...expr.value, sym: res.src },
                            idx: callExpression(
                                env,
                                builtin(
                                    '+',
                                    expr.loc,
                                    pureFunction([int, int], int),
                                ),
                                [expr.idx, res.start],
                                expr.loc,
                            ),
                        };
                    }
                    return null;
                case 'arrayLen':
                    if (expr.value.type === 'var') {
                        const res = resolve(expr.value.sym);
                        if (res == null) {
                            return null;
                        }
                        return callExpression(
                            env,
                            builtin(
                                '-',
                                expr.loc,
                                pureFunction([int, int], int),
                            ),
                            [
                                {
                                    ...expr,
                                    value: { ...expr.value, sym: res.src },
                                },
                                res.start,
                            ],
                            expr.loc,
                        );
                    }
                    return null;
            }
            return null;
        },
        stmt: (stmt) => {
            // TODO assign as well
            if (
                stmt.type === 'Define' &&
                stmt.value != null &&
                stmt.value.type === 'slice' &&
                stmt.value.end == null &&
                stmt.value.value.type === 'var'
            ) {
                const sym = {
                    name: stmt.sym.name + '_i',
                    unique: env.local.unique.current++,
                };
                arrayInfos[symName(stmt.sym)] = {
                    start: sym,
                    src: stmt.value.value.sym,
                };
                return [
                    stmt,
                    {
                        type: 'Define',
                        is: int,
                        loc: stmt.loc,
                        sym,
                        value: stmt.value.start,
                    },
                ];
            }
            return null;
        },
    });
};
