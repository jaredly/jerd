import { TuplePattern } from '../../parsing/parser-new';
import { Type, Pattern as TPattern } from '../../typing/types';
import { Context, ValueBinding } from '../Context';
import { typePattern } from './typePattern';

export function typeTuplePattern(
    expected: Type,
    term: TuplePattern,
    ctx: Context,
    bindings: ValueBinding[],
): TPattern {
    let types: Array<Type>;
    // ALERT: Here's another place where
    // having late-bound type variables is a must!
    if (
        expected.type !== 'ref' ||
        expected.ref.type !== 'builtin' ||
        !expected.ref.name.startsWith('Tuple')
    ) {
        types = term.items.items.map((_) => ({
            type: 'THole',
            location: term.location,
        }));
        // return {type: 'PTypeError'}
    } else {
        types = expected.typeVbls;
    }
    return {
        type: 'Tuple',
        location: term.location,
        items: types.map((type, i) =>
            i >= term.items.items.length
                ? { type: 'PHole', location: term.location }
                : typePattern(ctx, term.items.items[i], bindings, type),
        ),
    };
}
