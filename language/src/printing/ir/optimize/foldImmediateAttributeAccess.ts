import { idName } from '../../../typing/env';
import { idsEqual, refsEqual } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr } from '../types';
import { Context } from './optimize';

export const foldImmediateAttributeAccess = (ctx: Context, expr: Expr) =>
    transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type !== 'attribute') {
                return null;
            }
            const target =
                expr.target.type === 'SpecializeEnum'
                    ? expr.target.inner
                    : expr.target;
            if (target.type !== 'record') {
                return null;
            }
            if (target.base.type !== 'Concrete') {
                // TODO: support this too
                return null;
            }
            if (refsEqual(expr.ref, target.base.ref)) {
                const row = target.base.rows[expr.idx];
                if (row) {
                    return row;
                }
                if (!target.base.spread) {
                    console.log(
                        new Error(`Must have a spread if row is empty, right?`),
                    );
                    return null;
                }
                return { ...expr, target: target.base.spread };
            }
            if (expr.ref.type !== 'user') {
                return null;
            }
            const sub = target.subTypes[idName(expr.ref.id)];
            if (sub.rows[expr.idx]) {
                return sub.rows[expr.idx];
            }
            return null;
        },
    });
