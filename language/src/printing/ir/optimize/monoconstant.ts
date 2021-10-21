// Well first pass, we can just monomorphize types, like people usually do.
// ugh nvm that's complicated.

import { hashObject, idName } from '../../../typing/env';
import { newWithGlobal } from '../../../typing/types';
import {
    defaultVisitor,
    transformBlock,
    transformExpr,
    transformType,
    Visitor,
} from '../transform';
import {
    Apply,
    Block,
    Expr,
    InferredSize,
    LambdaExpr,
    LambdaType,
    Stmt,
} from '../types';
import { maxUnique } from './inline';
import {
    findCapturedVariables,
    liftLambdas,
    liftToTopLevel,
} from './liftlambdas';
import { Context } from './optimize';

export const specializeFunctionsCalledWithLambdas = (
    ctx: Context,
    expr: Expr,
): Expr => {
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            // Ok what's the story
            // If we're calling a function, and one of the arguments
            // is of type `lambda`
            if (expr.type !== 'apply' || expr.target.type !== 'term') {
                return null;
            }
            const largs = expr.args
                .map((arg, i) => ({ arg, i }))
                .filter((a) => a.arg.is.type === 'lambda')
                .map(({ arg, i }) => {
                    // Lift any lambdas that we can
                    if (
                        arg.type === 'lambda' &&
                        findCapturedVariables(arg).length === 0
                    ) {
                        return { arg: liftToTopLevel(ctx, arg), i };
                    }
                    return { arg, i };
                });
            // Only lambdas and terms supported at the moment
            if (
                largs.length === 0 ||
                largs.some((a) => a.arg.type !== 'term')
            ) {
                return null;
            }
            const lambdaArgs: Array<{ arg: Expr; i: number }> = largs;

            return specializeFunction(ctx, expr, lambdaArgs);
        },
    });
};

export const specializeFunction = (
    ctx: Context,
    expr: Apply,
    argsToInline: Array<{ i: number; arg: Expr }>,
) => {
    if (expr.target.type !== 'term') {
        throw new Error(`not a term`);
    }

    const indices: { [key: number]: true } = {};
    argsToInline.forEach((arg) => (indices[arg.i] = true));
    const target = ctx.exprs[idName(expr.target.id)];
    if (!target) {
        console.error('no target?', expr.target.id);
        return null;
    }
    const l = target.expr as LambdaExpr;
    const lis = l.is as LambdaType;

    const newHash = hashObject({
        base: expr.target.id,
        lambdaArgs: argsToInline,
    });

    // MODIFY:
    // types
    // args
    const args = l.args.filter((_, i) => !indices[i]);

    const vblMapping: { [unique: number]: Expr } = {};
    argsToInline.forEach(
        (arg) => (vblMapping[l.args[arg.i].sym.unique] = arg.arg),
    );

    const knownSizes: { [unique: number]: number } = {};
    argsToInline.forEach((arg) => {
        let larg = l.args[arg.i];
        if (
            larg.type.type === 'Array' &&
            larg.type.inferredSize &&
            larg.type.inferredSize.type === 'variable' &&
            arg.arg.type === 'array' &&
            arg.arg.is.inferredSize &&
            arg.arg.is.inferredSize.type === 'exactly'
        ) {
            knownSizes[larg.type.inferredSize.sym.unique] =
                arg.arg.is.inferredSize.size;
        }
        if (arg.arg.type === 'int') {
            knownSizes[larg.sym.unique] = arg.arg.value;
        }
    });

    const transform: Visitor = {
        ...defaultVisitor,
        type: (type) => {
            if (type.type === 'Array' && type.inferredSize != null) {
                const transformed = transformInferredSize(
                    type.inferredSize,
                    (iz) => {
                        if (
                            iz.type === 'relative' &&
                            iz.offset.type === 'exactly' &&
                            iz.to.type === 'exactly'
                        ) {
                            return {
                                type: 'exactly',
                                size: iz.offset.size + iz.to.size,
                            };
                        }
                        if (
                            iz.type === 'variable' &&
                            knownSizes[iz.sym.unique] != null
                        ) {
                            return {
                                type: 'exactly',
                                size: knownSizes[iz.sym.unique],
                            };
                        }
                        if (
                            iz.type === 'constant' &&
                            knownSizes[iz.sym.unique] != null
                        ) {
                            return {
                                type: 'exactly',
                                size: knownSizes[iz.sym.unique],
                            };
                        }
                        return iz;
                    },
                );
                if (transformed !== type.inferredSize) {
                    return { ...type, inferredSize: transformed };
                }
            }
            return null;
        },
    };

    const body = wrapBlock(
        transformBlock(l.body, transform),
        argsToInline.map((arg) => ({
            type: 'Define',
            sym: l.args[arg.i].sym,
            loc: l.args[arg.i].loc,
            value: arg.arg,
            is: arg.arg.is,
        })),
    );

    const is: LambdaType = {
        ...lis,
        args: l.is.args.filter((_, i) => !indices[i]),
        res: transformType(lis.res, transform, 0),
    };

    let newTerm: LambdaExpr = {
        ...l,
        is,
        args,
        body,
        res: transformType(l.res, transform, 0),
    };

    const id = { hash: newHash, size: 1, pos: 0 };
    const senv = newWithGlobal(ctx.env.global);
    senv.local.unique.current = maxUnique(newTerm);
    newTerm = ctx.optimize({ ...ctx, env: senv, id }, newTerm) as LambdaExpr;

    // TODO: Sources could just be part of Exprs
    ctx.exprs[newHash] = {
        inline: false,
        expr: newTerm,
        source: {
            id: expr.target.id,
            kind: 'specialization',
        },
    };

    return {
        ...expr,
        target: {
            ...expr.target,
            is: newTerm.is,
            id: id,
        },
        args: expr.args.filter((_, i) => !indices[i]),
        is: newTerm.res,
    };
};

export const transformInferredSize = (
    iz: InferredSize,
    fn: (iz: InferredSize) => InferredSize,
): InferredSize => {
    const t = fn(iz);
    if (t !== iz) {
        return t;
    }
    switch (iz.type) {
        case 'multiple': {
            let changed = false;
            const sizes = iz.sizes.map((size) => {
                const t = fn(size);
                changed = changed || t !== size;
                return t;
            });
            if (changed) {
                return fn({ ...iz, sizes });
            }
            return iz;
        }
        case 'relative': {
            const to = fn(iz.to);
            const offset = fn(iz.offset);
            return to !== iz.to || offset !== iz.offset
                ? fn({ ...iz, to, offset })
                : iz;
        }
    }
    return iz;
};

export const monoconstant = (ctx: Context, expr: Expr): Expr => {
    // console.log('const');
    // let outerMax = maxUnique(expr);
    expr = liftLambdas(ctx, expr);
    return specializeFunctionsCalledWithLambdas(ctx, expr);
};

const wrapBlock = (body: Block, stmts: Array<Stmt>): Block => {
    return {
        ...body,
        items: stmts.concat(body.items),
    };
};
