import { Identifier } from '../parsing/parser-new';
import * as preset from '../typing/preset';
import { Term, Type } from '../typing/types';
import { parseIdOrSym } from './hashes';
import { resolveNamedValue, resolveValue } from './resolve';
import { Context } from './Context';
import { wrapExpected } from './typeExpression';

export const typeIdentifier = (
    ctx: Context,
    term: Identifier,
    expected: Array<Type>,
): Term => {
    if (term.hash) {
        const idOrSym = parseIdOrSym(term.hash.slice(1));
        const resolved = idOrSym && resolveValue(ctx, idOrSym, term.location);
        if (resolved) {
            return resolved;
        }
        ctx.warnings.push({
            location: term.location,
            text: `Unable to resolve term hash ${term.hash}`,
        });
    }
    const named = resolveNamedValue(ctx, term.text, term.location, expected);
    if (named) {
        return wrapExpected(named, expected);
    }
    if (expected.length) {
        // Try resolving without an expected type
        const got = resolveNamedValue(ctx, term.text, term.location, []);
        if (got) {
            return {
                type: 'TypeError',
                is: expected[0],
                inner: got,
                location: term.location,
            };
        }
    }
    return {
        type: 'NotFound',
        is: expected.length ? expected[0] : preset.void_,
        location: term.location,
        text: term.text,
    };
};
