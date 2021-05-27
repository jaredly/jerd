// Well first pass, we can just monomorphize types, like people usually do.
// ugh nvm that's complicated.

import { hashObject, idFromName, idName } from '../../../typing/env';
import { Env, Id } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Block, Expr, LambdaExpr, LambdaType, Stmt } from '../types';
import {
    applyTypeVariables,
    block,
    makeTypeVblMapping,
    subtTypeVars,
} from '../utils';
import { maxUnique } from './inline';
import {
    findCapturedVariables,
    liftLambdas,
    liftToTopLevel,
} from './liftlambdas';
import { Exprs, optimizeAggressive, optimizeDefine } from './optimize';

export const monoconstant = (env: Env, exprs: Exprs, expr: Expr): Expr => {
    // let outerMax = maxUnique(expr);
    // expr = liftLambdas(env, exprs, expr)
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
                        return { arg: liftToTopLevel(env, exprs, arg), i };
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
            // const lambdaArgs: Array<{
            //     arg: Expr;
            //     i: number;
            // }> = expr.args
            //     .map((arg, i) => ({ arg, i }))
            //     .filter((a) => a.arg.is.type === 'lambda');
            // .map((arg) => {
            //     if (arg.arg.type === 'lambda') {
            //         // toplevel that folks
            //         if (findCapturedVariables(arg.arg).length) {
            //             return arg;
            //         }
            //         const hash = hashObject(arg.arg);
            //         const id: Id = { hash, size: 1, pos: 0 };
            //         exprs[hash] = { expr: arg.arg, inline: false };
            //         return {
            //             ...arg,
            //             arg: {
            //                 type: 'term',
            //                 id,
            //                 loc: arg.arg.loc,
            //                 is: arg.arg.is,
            //             },
            //         };
            //     } else {
            //         return arg;
            //     }
            // });
            const indices: { [key: number]: true } = {};
            lambdaArgs.forEach((arg) => (indices[arg.i] = true));
            const newHash = hashObject({
                base: expr.target.id,
                lambdaArgs: lambdaArgs,
            });
            const target = exprs[idName(expr.target.id)];
            if (!target) {
                console.error('no target?', expr.target.id);
                return null;
            }
            const l = target.expr as LambdaExpr;
            env.global.idNames[newHash] =
                env.global.idNames[idName(expr.target.id)];

            // MODIFY:
            // types
            // args
            const args = l.args.filter((_, i) => !indices[i]);
            const is = {
                ...l.is,
                args: l.is.args.filter((_, i) => !indices[i]),
            };

            const vblMapping: { [unique: number]: Expr } = {};
            lambdaArgs.forEach(
                (arg) => (vblMapping[l.args[arg.i].sym.unique] = arg.arg),
            );

            const body = wrapBlock(
                l.body,
                lambdaArgs.map((arg) => ({
                    type: 'Define',
                    sym: l.args[arg.i].sym,
                    loc: l.args[arg.i].loc,
                    value: arg.arg,
                    is: arg.arg.is,
                })),
            );

            let newTerm: Expr = { ...l, is, args, body };
            const id = { hash: newHash, size: 1, pos: 0 };
            newTerm = optimizeDefine(env, newTerm, id);
            newTerm = optimizeAggressive(env, exprs, newTerm, id);
            newTerm = optimizeDefine(env, newTerm, id);

            exprs[newHash] = {
                inline: false,
                expr: newTerm,
            };
            return {
                ...expr,
                target: {
                    ...expr.target,
                    id: id,
                },
                args: expr.args.filter((_, i) => !indices[i]),
            };
        },
    });
};

const wrapBlock = (body: Expr | Block, stmts: Array<Stmt>): Block => {
    if (body.type === 'Block') {
        return {
            ...body,
            items: stmts.concat(body.items),
        };
    } else {
        return block(
            stmts.concat([
                {
                    type: 'Return',
                    value: body,
                    loc: body.loc,
                },
            ]),
            body.loc,
        );
    }
};
