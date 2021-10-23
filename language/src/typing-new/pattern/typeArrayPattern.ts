import { ArrayPattern } from '../../parsing/parser-new';
import { void_ } from '../../typing/preset';
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
    let expectedElement: Type;
    let error = false;
    if (
        expected.type !== 'ref' ||
        expected.ref.type !== 'builtin' ||
        expected.ref.name !== 'Array'
    ) {
        // OOOOH HERE we want a late binding type for sure,
        // because otherwise this will /always/ be wrong, which is no fun.
        expectedElement = void_;
        error = true;
    } else {
        expectedElement = expected.typeVbls[0];
    }
    term.items?.items.forEach((item) => {
        if (item.type === 'ArrayPatternSpread') {
            let typed: TPattern;
            if (item.pattern) {
                typed = typePattern(ctx, item.pattern, bindings, expected);
            } else {
                typed = {
                    type: 'Ignore',
                    location: item.location,
                };
            }
            if (spread != null) {
                postItems.push({
                    type: 'DuplicateSpread',
                    inner: typed,
                    location: item.location,
                });
            } else {
                spread = typed;
            }
        } else if (spread == null) {
            preItems.push(typePattern(ctx, item, bindings, expectedElement));
        } else {
            postItems.push(typePattern(ctx, item, bindings, expectedElement));
        }
    });

    const res: TPattern = {
        type: 'Array',
        preItems,
        spread,
        postItems,
        location: term.location,
        is: expectedElement,
    };
    if (error) {
        return {
            type: 'PTypeError',
            inner: res,
            location: res.location,
            is: expected,
        };
    }
    return res;
}
