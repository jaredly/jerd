import { idFromName, idName, newSym } from '../../../typing/env';
import { Env, getAllSubTypes, RecordDef } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr, OutputOptions, Stmt } from '../types';
import {
    attribute,
    block,
    define,
    iffe,
    isConstant,
    isConstantExpr,
    var_,
} from '../utils';
import { Context } from './optimize';

export const missingOrConstant = (v: Expr | null) =>
    v == null || isConstantExpr(v);

// TODO: allow just lifting the spreads
export const explicitSpreads = (ctx: Context, expr: Expr): Expr => {
    const env = ctx.env;
    const opts = ctx.opts;
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type !== 'record') {
                return null;
            }
            // No spreads
            if (
                !expr.base.spread &&
                !Object.keys(expr.subTypes).some(
                    (s) => !!expr.subTypes[s].spread,
                )
            ) {
                return null;
            }
            const items: Array<Stmt> = [];
            let base = expr.base;
            const subTypes = { ...expr.subTypes };
            if (base.type === 'Concrete' && base.spread) {
                const b = base;
                let v: Expr;
                if (isConstantExpr(base.spread)) {
                    v = base.spread;
                } else {
                    const sym = newSym(env, 'spread');
                    items.push(define(sym, base.spread, base.spread.loc));
                    v = var_(sym, base.spread.loc, base.spread.is);
                }
                base = {
                    ...base,
                    // Explicitifying
                    spread: null,
                    rows: base.rows.map((row, i) =>
                        row
                            ? row
                            : attribute(
                                  ctx.env,
                                  ctx.opts,
                                  v!,
                                  b.ref,
                                  [],
                                  i,
                                  expr.loc,
                              ),
                    ),
                };

                // STOPSHIP: this doesn't um properly spread multiple spreads

                const recordDef = env.global.types[
                    idName(base.ref.id)
                ] as RecordDef;
                getAllSubTypes(
                    env.global.types,
                    recordDef.extends.map((t) => t.ref.id),
                ).forEach((sub) => {
                    const sn = idName(sub);
                    expr.subTypes[sn].rows.forEach((row, i) => {
                        if (!row) {
                            subTypes[sn].rows[i] = attribute(
                                env,
                                opts,
                                v,
                                { type: 'user', id: sub },
                                [],
                                i,
                                expr.loc,
                            );
                        }
                    });
                });
            }

            Object.keys(subTypes).forEach((t) => {
                const sub = subTypes[t];
                if (sub.spread) {
                    let v: Expr;
                    if (isConstantExpr(sub.spread)) {
                        v = sub.spread;
                    } else {
                        const sym = newSym(env, 'spread');
                        items.push(define(sym, sub.spread, sub.spread.loc));
                        v = var_(sym, sub.spread.loc, sub.spread.is);
                    }

                    // const sym = newSym(env, 'spread');
                    // items.push(define(sym, sub.spread, sub.spread.loc));
                    subTypes[t] = {
                        ...sub,
                        // spread: v,
                        spread: null,
                        rows: sub.rows.map((row, i) =>
                            row
                                ? row
                                : attribute(
                                      env,
                                      opts,
                                      v!,
                                      { type: 'user', id: idFromName(t) },
                                      [],
                                      i,
                                      expr.loc,
                                  ),
                        ),
                    };
                    const recordDef = env.global.types[t] as RecordDef;
                    getAllSubTypes(
                        env.global.types,
                        recordDef.extends.map((t) => t.ref.id),
                    ).forEach((sub) => {
                        const sn = idName(sub);
                        expr.subTypes[sn].rows.forEach((row, i) => {
                            if (!row) {
                                subTypes[sn].rows[i] = attribute(
                                    env,
                                    opts,
                                    v!,
                                    { type: 'user', id: sub },
                                    [],
                                    i,
                                    expr.loc,
                                );
                            }
                        });
                        // const d = env.global.types[idName(sub)] as RecordDef;
                        // return d.items.map((type, i) => ({
                        //     id: sub,
                        //     i,
                        //     type,
                        // }));
                    });
                }
            });
            items.push({
                type: 'Return',
                value: { ...expr, base, subTypes },
                loc: expr.loc,
            });
            return iffe(env, block(items, expr.loc));
        },
    });
};
