import { Pattern } from '../../parsing/parser-new';
import { bool, float, int, string } from '../../typing/preset';
import { patternIs } from '../../typing/typePattern';
import { Type, Pattern as TPattern } from '../../typing/types';
import { Bindings, Context, idToSym, ValueBinding } from '../Context';
import { resolveTypeId } from '../resolve';
import { fixString } from '../typeTemplateString';
import { typeArrayPattern } from './typeArrayPattern';
import { typeRecordPattern } from './typeRecordPattern';
import { typeTuplePattern } from './typeTuplePattern';

// export const wrapExpected = (
// 	ctx: Context,
// 	type: Type,
// ): TPattern => {
// }

export const typePattern = (
    ctx: Context,
    term: Pattern,
    bindings: Array<ValueBinding>,
    expected: Type,
): TPattern => {
    switch (term.type) {
        case 'PatternAs': {
            const sym = idToSym(ctx, term.as);
            const pattern = typePattern(ctx, term.inner, bindings, expected);
            bindings.push({
                location: term.location,
                sym,
                type: patternIs(pattern, expected),
            });
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
        case 'TuplePattern': {
            return typeTuplePattern(expected, term, ctx, bindings);
        }
        case 'Identifier': {
            if (term.text === '_' && term.hash == null) {
                return { type: 'Ignore', location: term.location };
            }
            const sym = idToSym(ctx, term);
            bindings.push({ sym, type: expected, location: term.location });
            return {
                type: 'Binding',
                sym,
                location: term.location,
            };
        }
        case 'ArrayPattern':
            // ok, so how to reconcile expected? and stuff
            return typeArrayPattern(expected, term, ctx, bindings);
        case 'RecordPattern': {
            return typeRecordPattern(ctx, term, bindings, expected);
        }
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
        default:
            let _x: never = term;
    }
    throw new Error(`nope ${(term as any).type}`);
};
