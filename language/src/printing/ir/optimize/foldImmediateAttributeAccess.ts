import { idName } from '../../../typing/env';
import { LocatedError } from '../../../typing/errors';
import { idsEqual, refsEqual } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import { Expr } from '../types';
import { Context } from './optimize';

// Ohhh this is a case where we monomorphized the .... op
// ... and somehow it didn't translate to the attribute it looks like....
export const foldImmediateAttributeAccess = (ctx: Context, outer: Expr) =>
    transformExpr(outer, {
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
            // WHYYYYYYYYYYYYYYYYY OK so somehow
            // our "specialize a record based on ... type variables"
            // is working before ... but not after.
            // maybe
            // hmm. so refTypeVbls, are they being applied correctly?
            const sub = target.subTypes[idName(expr.ref.id)];
            if (!sub) {
                console.log(target.subTypes, expr.ref.id, target.loc);
                require('fs').writeFileSync(
                    './env.dump.json',
                    JSON.stringify(
                        { env: ctx.env, target, expr, outer },
                        null,
                        2,
                    ),
                );
                throw new LocatedError(
                    expr.loc,
                    `UNEXPECTED ${expr.ref.id.hash} attribute of ${target.base.ref.id.hash}`,
                );
            }
            if (sub.rows[expr.idx]) {
                return sub.rows[expr.idx];
            }
            return null;
        },
    });
