import { ArrayPattern } from '../../parsing/parser-new';
import { Type, Pattern as TPattern } from '../../typing/types';
import { Context, ValueBinding } from '../Context';
import { typePattern } from './typePattern';

export function typeArrayPattern(
    expected: Type,
    term: ArrayPattern,
    ctx: Context,
    bindings: ValueBinding[],
): TPattern {
    const preItems: Array<TPattern> = [];
    let spread: TPattern | null = null;
    const postItems: Array<TPattern> = [];
    if (
        expected.type !== 'ref' ||
        expected.ref.type !== 'builtin' ||
        expected.ref.name !== 'Array'
    ) {
        throw new Error(`Array pattern type mismatch`);
    }
    const expectedElement = expected.typeVbls[0];
    term.items?.items.forEach((item) => {
        if (item.type === 'ArrayPatternSpread') {
            if (spread != null) {
                throw new Error(
                    `Cannot have multiple spreads in the same array pattern`,
                );
            }
            if (item.pattern) {
                spread = typePattern(ctx, item.pattern, bindings, expected);
            } else {
                spread = {
                    type: 'Ignore',
                    location: item.location,
                };
            }
        } else if (spread == null) {
            preItems.push(typePattern(ctx, item, bindings, expectedElement));
        } else {
            postItems.push(typePattern(ctx, item, bindings, expectedElement));
        }
    });

    return {
        type: 'Array',
        preItems,
        spread,
        postItems,
        location: term.location,
        is: expectedElement,
    };
}
