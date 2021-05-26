// Well first pass, we can just monomorphize types, like people usually do.
// ugh nvm that's complicated.

import { hashObject, idName } from '../../../typing/env';
import { Env } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr, LambdaExpr, LambdaType } from '../types';
import { applyTypeVariables, makeTypeVblMapping, subtTypeVars } from '../utils';
import { maxUnique } from './inline';
import { Exprs } from './optimize';

export const monomorphize = (env: Env, exprs: Exprs, expr: Expr): Expr => {
    let outerMax = maxUnique(expr);
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (
                expr.type !== 'apply' ||
                expr.typeVbls.length === 0 ||
                expr.target.type !== 'term'
            ) {
                return null;
            }
            const newHash = hashObject({
                base: expr.target.id,
                vbls: expr.typeVbls,
            });
            const target = exprs[idName(expr.target.id)];
            if (!target) {
                console.error('no target?', expr.target.id);
                return null;
            }
            const l = target.expr as LambdaExpr;
            const newType = applyTypeVariables(env, l.is, expr.typeVbls);
            env.global.idNames[newHash] =
                env.global.idNames[idName(expr.target.id)];
            const mapping = makeTypeVblMapping(l.is.typeVbls, expr.typeVbls);
            exprs[newHash] = {
                inline: false,
                expr: transformExpr(l, {
                    ...defaultVisitor,
                    expr: (expr) => {
                        const is = subtTypeVars(expr.is, mapping, undefined);
                        if (expr.type === 'lambda') {
                            const res = subtTypeVars(
                                expr.res,
                                mapping,
                                undefined,
                            );
                            let changed = false;
                            const args = expr.args.map((arg) => {
                                const n = subtTypeVars(
                                    arg.type,
                                    mapping,
                                    undefined,
                                );
                                if (n !== arg.type) {
                                    changed = true;
                                    return { ...arg, type: n };
                                }
                                return arg;
                            });
                            return changed || res !== expr.res || is !== expr.is
                                ? ({ ...expr, is, res, args } as LambdaExpr)
                                : expr;
                        }
                        return is !== expr.is
                            ? ({ ...expr, is } as Expr)
                            : expr;
                    },
                }),
            };
            return {
                ...expr,
                target: {
                    ...expr.target,
                    id: { hash: newHash, size: 1, pos: 0 },
                },
            };
        },
    });
};
