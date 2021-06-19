import { idName, newSym } from '../../../typing/env';
import { showLocation } from '../../../typing/typeExpr';
import { Env, Id, Symbol } from '../../../typing/types';
import { debugExpr } from '../../irDebugPrinter';
import { printToString } from '../../printer';
import { reUnique } from '../../typeScriptPrinterSimple';
import { uniquesReallyAreUnique } from '../analyze';
import { defaultVisitor, transformExpr, Visitor } from '../transform';
import { Arg, Expr, OutputOptions, Stmt, Tuple } from '../types';
import {
    and,
    arrowFunctionExpression,
    asBlock,
    callExpression,
    var_,
} from '../utils';
import { arraySlices } from './arraySlices';
import { arraySliceLoopToIndex } from './arraySliceToLoopIndex';
import { explicitSpreads } from './explicitSpreads';
import { flattenIffe } from './flattenIFFE';
import {
    flattenImmediateAssigns,
    flattenImmediateCalls,
} from './flattenImmediateCalls';
import { flattenRecordSpreads } from './flattenRecordSpread';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { inlineFunctionsCalledWithCapturingLambdas, inlint } from './inline';
import { inlineCallsThatReturnFunctions } from './inlineCallsThatReturnFunctions';
import {
    monoconstant,
    specializeFunctionsCalledWithLambdas,
} from './monoconstant';
import { monomorphize } from './monomorphize';
import { optimizeTailCalls } from './tailCall';
import { transformRepeatedly } from './utils';

export type Context = {
    id: Id;
    env: Env;
    exprs: Exprs;
    opts: OutputOptions;
    optimize: Optimizer2;
};

export const toOldOptimize = (opt: Optimizer2): Optimizer => (
    env: Env,
    irOpts: OutputOptions,
    exprs: Exprs,
    expr: Expr,
    id: Id,
) => opt({ exprs, env, opts: irOpts, id, optimize: opt }, expr);

export type Optimizer2 = (ctx: Context, expr: Expr) => Expr;

export type Optimizer = (
    senv: Env,
    irOpts: OutputOptions,
    exprs: Exprs,
    expr: Expr,
    id: Id,
) => Expr;

export const optimizeRepeatedly = (
    opt: Optimizer2 | Array<Optimizer2>,
): Optimizer2 => (ctx: Context, expr: Expr) => {
    if (Array.isArray(opt)) {
        opt = combineOpts(opt);
    }
    for (let i = 0; i < 100; i++) {
        const newExpr = opt(ctx, expr);
        if (newExpr === expr) {
            return expr;
        }
        expr = newExpr;
        uniquesReallyAreUnique(expr);
    }
    throw new Error(`Optimize failed to converge`);
};

export const combineOpts = (opts: Array<Optimizer2>): Optimizer2 => (
    ctx: Context,
    expr: Expr,
) => {
    opts.forEach((fn) => {
        // console.log('run opt', fn);
        expr = fn(ctx, expr);
    });
    return expr;
};

export const midOpt = (
    fn: (env: Env, exprs: Exprs, expr: Expr) => Expr,
): Optimizer => (env: Env, _: OutputOptions, exprs: Exprs, expr: Expr) =>
    fn(env, exprs, expr);

export const symName = (sym: Symbol) => `${sym.name}$${sym.unique}`;

export const optimizeDefineNew = (
    env: Env,
    expr: Expr,
    id: Id,
    exprs: Exprs | null,
): Expr => {
    const orig = expr;
    const fns = exprs ? glslOpts : javascriptOpts;
    const exprss = exprs || {};
    const opt = optimizeRepeatedly(fns);
    const ctx: Context = {
        env,
        id,
        exprs: exprss,
        opts: {},
        optimize: opt,
    };

    try {
        expr = opt(ctx, expr);
        uniquesReallyAreUnique(expr);
    } catch (err) {
        console.log('-- oops --');
        console.error(err);
        // Oh no! Inconsistent!
        // Let's do this again, but more slowly.
        const opt = optimizeRepeatedly((ctx, expr) => {
            fns.forEach((fn) => {
                // const uMax = maxUnique(expr);
                // if (uMax > ctx.env.local.unique.current) {
                //     console.log(
                //         'inlint unique max greater',
                //         uMax,
                //         ctx.env.local.unique.current,
                //     );
                //     ctx.env.local.unique.current = uMax;
                // }
                try {
                    expr = fn(ctx, expr);
                    uniquesReallyAreUnique(expr);
                } catch (err) {
                    console.log('Offending optimizer');
                    console.log(fn);
                    console.log(printToString(debugExpr(env, expr), 100));
                    console.log(showLocation(err.loc));
                    throw err;
                }
            });
            return expr;
        });
        const ctx: Context = {
            env,
            id,
            exprs: exprss,
            opts: {},
            optimize: opt,
        };
        expr = opt(ctx, orig);
    }
    return expr;
};

export const optimizeDefine = (
    env: Env,
    expr: Expr,
    id: Id,
    exprs: Exprs | null,
): Expr => {
    // STOPSHIP: re-enable
    // expr = optimizeDefineOld(env, expr, id);
    // if (exprs) {
    //     expr = optimizeAggressive(
    //         {
    //             env,
    //             exprs,
    //             id,
    //             optimize: optimizeAggressive,
    //             opts: {},
    //         },
    //         expr,
    //     );
    // }
    // expr = optimizeDefineOld(env, expr, id);
    // if (exprs) {
    //     expr = optimizeAggressive(
    //         {
    //             env,
    //             exprs,
    //             id,
    //             optimize: optimizeAggressive,
    //             opts: {},
    //         },
    //         expr,
    //     );
    // }
    uniquesReallyAreUnique(expr);
    return expr;
};

export const optimizeDefineOld = (ctx: Context, expr: Expr): Expr => {
    expr = optimize(ctx, expr);
    expr = optimizeTailCalls(ctx, expr);
    expr = optimize(ctx, expr);
    expr = arraySliceLoopToIndex(ctx, expr);
    return expr;
};

export type Exprs = {
    [idName: string]: {
        expr: Expr;
        inline: boolean;
        source?: { id: Id; kind: string };
        comment?: string;
    };
};

export const optimizeAggressive = (ctx: Context, expr: Expr): Expr => {
    expr = inlint(ctx, expr);
    // console.log('[after inline]', printToString(termToGlsl(env, {}, expr), 50));
    expr = monomorphize(ctx, expr);
    // console.log('[after mono]', printToString(termToGlsl(env, {}, expr), 50));
    expr = monoconstant(ctx, expr);
    // console.log('[after const]', printToString(termToGlsl(env, {}, expr), 50));
    // UGHH This is aweful that I'm adding these all over the place.
    // I should just run through each pass repeatedly until we have no more changes.
    // right?
    expr = optimize(ctx, expr);

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

const fromSimpleOpt = (fn: (env: Env, expr: Expr) => Expr): Optimizer2 => (
    ctx: Context,
    expr: Expr,
) => fn(ctx.env, expr);

export const optimize = (ctx: Context, expr: Expr): Expr => {
    const transformers: Array<(ctx: Context, e: Expr) => Expr> = [
        // OK so this iffe thing is still the only thing
        // helping us with the `if` at the end of
        // shortestDistanceToSurface

        fromSimpleOpt(flattenIffe),
        removeUnusedVariables,
        fromSimpleOpt(removeNestedBlocksWithoutDefinesAndCodeAfterReturns),
        fromSimpleOpt(foldConstantTuples),
        fromSimpleOpt(removeSelfAssignments),
        foldConstantAssignments(false),
        foldSingleUseAssignments,
        fromSimpleOpt(flattenNestedIfs),
        fromSimpleOpt(arraySlices),
        foldConstantAssignments(false),
        removeUnusedVariables,
        fromSimpleOpt(flattenNestedIfs),
        flattenImmediateCalls,
    ];
    transformers.forEach((t) => (expr = t(ctx, expr)));
    return expr;
};

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

export const removeNestedBlocksWithoutDefinesAndCodeAfterReturns = (
    env: Env,
    expr: Expr,
): Expr => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        // expr: (expr) => {
        //     if (
        //         expr.type === 'lambda' &&
        //         expr.body.items.length === 1 &&
        //         expr.body.items[0].type === 'Return'
        //     ) {
        //         return { ...expr, body: expr.body.items[0].value };
        //     }
        //     return null;
        // },
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

export const removeUnusedVariables = (ctx: Context, expr: Expr): Expr => {
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

export const isConstant = (arg: Expr): boolean => {
    switch (arg.type) {
        case 'int':
        case 'float':
        case 'string':
        case 'term':
        case 'genTerm':
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

export const simpleOpt = (fn: (env: Env, expr: Expr) => Expr): Optimizer => (
    env,
    opts,
    exprs,
    expr,
    id,
) => fn(env, expr);

const javascriptOpts: Array<Optimizer2> = [
    optimize,
    optimizeTailCalls,
    optimize,
    arraySliceLoopToIndex,
];

export const ensureToplevelFunctionsAreLambdas = (ctx: Context, expr: Expr) => {
    if (expr.is.type !== 'lambda' || expr.type === 'lambda') {
        return expr;
    }
    // TODO: fn types having args would be nice so we
    // can name these args here.
    const args: Array<Arg> = expr.is.args.map((t, i) => ({
        type: t,
        sym: newSym(ctx.env, 'arg' + i),
        loc: expr.loc,
    }));
    return arrowFunctionExpression(
        args,
        asBlock(
            callExpression(
                ctx.env,
                expr,
                args.map((arg) => var_(arg.sym, arg.loc, arg.type)),
                expr.loc,
            ),
        ),
        expr.loc,
    );
};

/* So, things we need to handle lambdas completely:
  - inline calls that return functions
  - outline local lambdas! buuut how do we deal
    with lambdas that close over things? um I think the idea
    there was to just fold those up? Or something? Or maybe
    turn them into functions that take a record? Yeah so
    we'd need an Expr type that is "lambda with scope vbls"
    and then when applying it or whatever, we might end up
    passing the vbls in as a record or something...
    I think I'll need an IRType that's "lambda with scope'
    as well... so that I can track function arguments
    correctly? maybe? idk.
        - see, if we're compiling for Zig, then I can have
          function pointers, but not closures.
          And so I'll need to specialize any functions
          that use a closured function. But non-closured
          functions can be handled as-is.

    Yeah, so maybe the process is

  - turn all lambdas that close over things into
    lambda-with-scope.
  - inline any calls that return functions
  - flatten immediate calls
  - specialize any functions that take functions as arguments

  I think that's it?
*/

/*
Ok, so somewhat end-game level stuff:
if I have a top-level thing that isn't /const/able,
I think the *right* way to do it would be to compute it
in main(), and then pass it around to anything that needs it.
but that's a bottom-up rather than a top-down thing like the
lambda constantization is, right?
oh wait; because toplevel things have to be pure (yay) they
/must/ be precomutable, and so I can precompute them during
compilation!

Now I do have to think about what that would look like
for things that are lambdas.
like `const plus2 = plus(2)`

ok we'll get to that when we need to.



*/

const glslOpts: Array<Optimizer2> = [
    specializeFunctionsCalledWithLambdas,
    inlineCallsThatReturnFunctions,
    flattenImmediateCalls,
    foldSingleUseAssignments,
    foldConstantAssignments(true),
    flattenImmediateAssigns,
    removeUnusedVariables,

    inlineFunctionsCalledWithCapturingLambdas,
    ensureToplevelFunctionsAreLambdas,
    inlineCallsThatReturnFunctions,
    explicitSpreads,
    ...javascriptOpts,
    inlint,
    monomorphize,
    // monoconstant,
    optimize,
];
