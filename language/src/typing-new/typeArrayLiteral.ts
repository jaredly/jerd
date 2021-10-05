import { ArrayLiteral } from '../parsing/parser-new';
import * as preset from '../typing/preset';
import { arrayType } from '../typing/typeExpr';
import { ArraySpread, Term, Type } from '../typing/types';
import { Context } from './typeFile';
import { typeType } from './typeType';
import { typeExpression, wrapExpected } from './typeExpression';

export const typeArrayLiteral = (
    ctx: Context,
    term: ArrayLiteral,
    expected: Array<Type>,
): Term => {
    let el: Type | null = null;
    if (term.ann) {
        el = typeType(ctx, term.ann);
    }
    const items: Array<Term | ArraySpread> =
        term.items?.items.map((item) => {
            if (item.type === 'ArraySpread') {
                let value = typeExpression(
                    ctx,
                    item.value,
                    el ? [arrayType(el)] : [],
                );
                if (!el) {
                    if (
                        value.is.type !== 'ref' ||
                        value.is.ref.type !== 'builtin' ||
                        value.is.ref.name !== 'Array' ||
                        value.is.typeVbls.length !== 1
                    ) {
                        value = {
                            type: 'TypeError',
                            inner: value,
                            is: arrayType(preset.void_),
                            location: value.location,
                        };
                    } else {
                        el = value.is.typeVbls[0];
                    }
                }
                return { type: 'ArraySpread', value, location: item.location };
            } else {
                const value = typeExpression(ctx, item, el ? [el] : []);
                if (!el) {
                    el = value.is;
                }
                return value;
            }
        }) || [];
    if (!el && expected.length) {
        expected.some((t) => {
            if (
                t.type === 'ref' &&
                t.ref.type === 'builtin' &&
                t.ref.name === 'Array' &&
                t.typeVbls.length === 1
            ) {
                el = t.typeVbls[0];
                return true;
            }
        });
    }
    return wrapExpected(
        {
            type: 'Array',
            is: arrayType(el || preset.void_),
            items,
            location: term.location,
        },
        expected,
    );
};
