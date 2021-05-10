import { idFromName, newSym } from '../../../typing/env';
import { Env } from '../../../typing/types';
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

export const missingOrConstant = (v: Expr | null) =>
    v == null || isConstantExpr(v);

// TODO: allow just lifting the spreads
export const explicitSpreads = (
    env: Env,
    opts: OutputOptions,
    expr: Expr,
): Expr => {
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
                console.log('no spreads', expr.subTypes);
                return null;
            }
            // console.log('spreads');
            const items: Array<Stmt> = [];
            let base = expr.base;
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
                            : attribute(env, opts, v!, b.ref, i, expr.loc),
                    ),
                };
            }
            const subTypes = { ...expr.subTypes };
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
                                      i,
                                      expr.loc,
                                  ),
                        ),
                    };
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
