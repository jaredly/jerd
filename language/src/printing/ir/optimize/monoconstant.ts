// Well first pass, we can just monomorphize types, like people usually do.
// ugh nvm that's complicated.

import { hashObject, idName } from '../../../typing/env';
import { defaultVisitor, transformExpr } from '../transform';
import { Apply, Block, Expr, LambdaExpr, Stmt } from '../types';
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

            // const indices: { [key: number]: true } = {};
            // lambdaArgs.forEach((arg) => (indices[arg.i] = true));
            // const newHash = hashObject({
            //     base: expr.target.id,
            //     lambdaArgs: lambdaArgs,
            // });
            // const target = ctx.exprs[idName(expr.target.id)];
            // if (!target) {
            //     console.error('no target?', expr.target.id);
            //     return null;
            // }
            // const l = target.expr as LambdaExpr;

            // // MODIFY:
            // // types
            // // args
            // const args = l.args.filter((_, i) => !indices[i]);
            // const is = {
            //     ...l.is,
            //     args: l.is.args.filter((_, i) => !indices[i]),
            // };

            // const vblMapping: { [unique: number]: Expr } = {};
            // lambdaArgs.forEach(
            //     (arg) => (vblMapping[l.args[arg.i].sym.unique] = arg.arg),
            // );

            // const body = wrapBlock(
            //     l.body,
            //     lambdaArgs.map((arg) => ({
            //         type: 'Define',
            //         sym: l.args[arg.i].sym,
            //         loc: l.args[arg.i].loc,
            //         value: arg.arg,
            //         is: arg.arg.is,
            //     })),
            // );

            // let newTerm: Expr = { ...l, is, args, body };
            // const id = { hash: newHash, size: 1, pos: 0 };
            // newTerm = ctx.optimize({ ...ctx, id }, newTerm);

            // // TODO: Sources could just be part of Exprs
            // ctx.exprs[newHash] = {
            //     inline: false,
            //     expr: newTerm,
            //     source: {
            //         id: expr.target.id,
            //         kind: 'specialization',
            //     },
            // };
            // return {
            //     ...expr,
            //     target: {
            //         ...expr.target,
            //         id: id,
            //     },
            //     args: expr.args.filter((_, i) => !indices[i]),
            // };
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

    const newHash = hashObject({
        base: expr.target.id,
        lambdaArgs: argsToInline,
    });

    // MODIFY:
    // types
    // args
    const args = l.args.filter((_, i) => !indices[i]);
    const is = {
        ...l.is,
        args: l.is.args.filter((_, i) => !indices[i]),
    };

    const vblMapping: { [unique: number]: Expr } = {};
    argsToInline.forEach(
        (arg) => (vblMapping[l.args[arg.i].sym.unique] = arg.arg),
    );

    const body = wrapBlock(
        l.body,
        argsToInline.map((arg) => ({
            type: 'Define',
            sym: l.args[arg.i].sym,
            loc: l.args[arg.i].loc,
            value: arg.arg,
            is: arg.arg.is,
        })),
    );

    let newTerm: Expr = { ...l, is, args, body };
    // const newHash = hashObject(newTerm);
    const id = { hash: newHash, size: 1, pos: 0 };
    newTerm = ctx.optimize({ ...ctx, id }, newTerm);

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
            id: id,
        },
        args: expr.args.filter((_, i) => !indices[i]),
    };
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
