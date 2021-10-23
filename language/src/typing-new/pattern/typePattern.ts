import { Pattern } from '../../parsing/parser-new';
import { bool, float, int, string } from '../../typing/preset';
import { Type, Pattern as TPattern } from '../../typing/types';
import { Bindings, Context, idToSym, ValueBinding } from '../Context';
import { resolveTypeId } from '../resolve';
import { fixString } from '../typeTemplateString';

// export const wrapExpected = (
// 	ctx: Context,
// 	type: Type,
// ): TPattern => {
// }

export const typePattern = (
    ctx: Context,
    term: Pattern,
    bindings: Array<ValueBinding>,
    expected: Array<Type>,
): TPattern => {
    switch (term.type) {
        case 'PatternAs': {
            const sym = idToSym(ctx, term.as);
            const pattern = typePattern(ctx, term.inner, bindings, expected);
            return {
                type: 'Alias',
                inner: pattern,
                location: term.location,
                name: sym,
            };
        }
        case 'Int':
            return {
                type: 'int',
                is: int,
                location: term.location,
                value: parseInt(term.contents),
            };
        case 'Float':
            return {
                type: 'float',
                is: float,
                location: term.location,
                value: parseFloat(term.contents),
            };
        case 'Boolean':
            return {
                type: 'boolean',
                is: bool,
                location: term.location,
                value: term.v === 'true',
            };
        case 'String':
            return {
                type: 'string',
                is: string,
                location: term.location,
                // TODO: this probably needs a json fix?
                text: fixString(term.contents),
            };
        case 'TuplePattern':
            // TODO: parse out the expected ...
            return {
                type: 'Tuple',
                location: term.location,
                items: term.items.items.map((item) =>
                    typePattern(ctx, item, bindings, []),
                ),
            };
        // case 'RecordPattern': {
        //     const id = resolveTypeId(ctx, term.id);
        //     if (!id) {
        //         return { type: 'PHole', location: term.location };
        //     }

        //     return {
        //         type: 'Record',
        //         location: term.location,
        //         ref: {
        //             type: 'ref',
        //             ref: { type: 'user', id },
        //             location: term.location,
        //             typeVbls: [],
        //         },
        //         items,
        //     };
        // }
        case 'Identifier':
        case 'ArrayPattern':
            break;
    }
    throw new Error('nope');
};
