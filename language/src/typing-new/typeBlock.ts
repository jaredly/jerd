import { Block } from '../parsing/parser-new';
import { void_ } from '../typing/preset';
import { Let, Sequence, Term, Type } from '../typing/types';
import { Context, idToSym } from './Context';
import { typeExpression, wrapExpected } from './typeExpression';
import { typeType } from './typeType';

export const typeBlock = (
    ctx: Context,
    block: Block,
    expected: Array<Type>,
): Sequence => {
    const values = ctx.bindings.values.slice();
    ctx = { ...ctx, bindings: { ...ctx.bindings, values } };
    const sts: Array<Term | Let> =
        block.items?.items.map((st, i) => {
            if (st.type === 'Define') {
                const ann = st.ann ? typeType(ctx, st.ann) : null;
                const value = typeExpression(ctx, st.expr, ann ? [ann] : []);
                const sym = idToSym(ctx, st.id);
                values.unshift({
                    location: st.location,
                    sym,
                    type: value.is,
                });
                return {
                    type: 'Let',
                    binding: { sym, location: st.id.location },
                    is: void_,
                    location: st.location,
                    value,
                };
            } else {
                return typeExpression(
                    ctx,
                    st,
                    i === block.items!.items.length - 1 ? expected : [],
                );
            }
        }) || [];
    return wrapExpected(
        {
            type: 'sequence',
            location: block.location,
            is: sts && sts.length ? sts[sts.length - 1].is : void_,
            sts,
        },
        expected,
    ) as Sequence;
};
