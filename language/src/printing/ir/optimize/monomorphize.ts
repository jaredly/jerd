// Well first pass, we can just monomorphize types, like people usually do.
// ugh nvm that's complicated.

import { hashObject, idFromName, idName } from '../../../typing/env';
import { Env } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr, LambdaExpr, LambdaType } from '../types';
import {
    applyTypeVariables,
    applyTypeVariablesToRecord,
    makeTypeVblMapping,
    recordDefFromTermType,
    subtTypeVars,
    typeFromTermType,
} from '../utils';
// import { maxUnique } from './inline';
import { Context, Exprs } from './optimize';

export const monomorphizeTypes = (
    { env, exprs, types, opts }: Context,
    expr: Expr,
): Expr => {
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            switch (expr.type) {
                case 'lambda': {
                    let changed = false;
                    const args = expr.args.map((arg) => {
                        if (
                            arg.type.type === 'ref' &&
                            arg.type.ref.type === 'user' &&
                            arg.type.typeVbls.length > 0
                        ) {
                            const defn =
                                env.global.types[idName(arg.type.ref.id)];
                            if (defn.type === 'Record') {
                                const def = recordDefFromTermType(
                                    env,
                                    opts,
                                    defn,
                                );
                                // oooh hm got to go back I guess
                                // ooh wait so type variables
                                // we don't have an IR version of type declarations
                                // and maybe we need one?
                                const ndef = applyTypeVariablesToRecord(
                                    env,
                                    def,
                                    arg.type.typeVbls,
                                    expr.loc,
                                    idName(arg.type.ref.id),
                                );
                                const hash = hashObject(ndef);
                                const nid = idFromName(hash);
                                types[hash] = {
                                    typeDef: ndef,
                                    source: arg.type.ref.id,
                                };
                                changed = true;
                                return {
                                    ...arg,
                                    type: {
                                        ...arg.type,
                                        typeVbls: [],
                                        ref: { ...arg.type.ref, id: nid },
                                    },
                                };
                            }
                        }
                        return arg;
                    });
                    return changed
                        ? {
                              ...expr,
                              args,
                              is: {
                                  ...(expr.is as LambdaType),
                                  args: args.map((arg) => arg.type),
                              },
                          }
                        : null;
                }
            }
            return null;
        },
        stmt: (stmt) => {
            // TODO: define and maybe assign idk
            return null;
        },
    });
};

export const monomorphize = ({ env, exprs }: Context, expr: Expr): Expr => {
    // let outerMax = maxUnique(expr);
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
                typeVbls: [],
                target: {
                    ...expr.target,
                    id: { hash: newHash, size: 1, pos: 0 },
                },
            };
        },
    });
};
