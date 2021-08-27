import { idName } from '../../../typing/env';
import { idsEqual, refsEqual } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr } from '../types';
import { Context } from './optimize';

// Ohhh this is a case where we monomorphized the .... op
// ... and somehow it didn't translate to the attribute it looks like....
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
            // erggggggh mmmm maybe I need to reorder things
            // if (expr.refTypeVbls)
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
            if (!sub) {
                console.log(`UNEXPECTED`);
                console.log(target);
                console.log(expr);
                console.log(ctx.env.global.types[idName(expr.ref.id)]);
                console.log(ctx.env.global.types[idName(target.base.ref.id)]);
                return null;
            }
            if (sub.rows[expr.idx]) {
                return sub.rows[expr.idx];
            }
            return null;
        },
    });
