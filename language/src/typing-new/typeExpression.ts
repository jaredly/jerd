import { Expression, Identifier } from '../parsing/parser-new';
import * as preset from '../typing/preset';
import { Term, Type, typesEqual } from '../typing/types';
import { parseIdOrSym } from './hashes';
import { reGroupOps, typeGroup } from './ops';
import { resolveNamedValue, resolveValue } from './resolve';
import { typeArrayLiteral } from './typeArrayLiteral';
import { Context } from './typeFile';

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
        return named;
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

export const wrapExpected = (term: Term, expected: Array<Type>): Term => {
    if (expected.length && !expected.some((t) => typesEqual(t, term.is))) {
        return {
            type: 'TypeError',
            inner: term,
            is: expected[0],
            location: term.location,
        };
    }
    return term;
};

export const typeExpression = (
    ctx: Context,
    term: Expression,
    expected: Array<Type>,
): Term => {
    switch (term.type) {
        case 'Identifier': {
            return typeIdentifier(ctx, term, expected);
        }
        case 'BinOp': {
            const grouped = reGroupOps(term);
            if (grouped.type !== 'GroupedOp') {
                return typeExpression(ctx, grouped, expected);
            }
            return wrapExpected(typeGroup(ctx, grouped, expected), expected);
        }
        case 'WithUnary': {
            if (term.op != null) {
                throw new Error('no unary');
            }
            return typeExpression(ctx, term.inner, expected);
        }
        case 'Float': {
            return wrapExpected(
                {
                    type: 'float',
                    location: term.location,
                    is: preset.float,
                    value: +term.contents,
                },
                expected,
            );
        }
        case 'Int':
            // If it might expect an int, go with that
            if (
                expected.some(
                    (t) =>
                        t.type === 'ref' &&
                        t.ref.type === 'builtin' &&
                        t.ref.name === 'int',
                )
            ) {
                return {
                    type: 'int',
                    location: term.location,
                    is: preset.int,
                    value: +term.contents,
                };
            }
            // if it's expecting a float, we can do that too
            if (
                expected.some(
                    (t) =>
                        t.type === 'ref' &&
                        t.ref.type === 'builtin' &&
                        t.ref.name === 'float',
                )
            ) {
                return {
                    type: 'float',
                    location: term.location,
                    is: preset.float,
                    value: +term.contents,
                };
            }
            return wrapExpected(
                {
                    type: 'int',
                    location: term.location,
                    is: preset.int,
                    value: +term.contents,
                },
                expected,
            );
        case 'ArrayLiteral':
            return typeArrayLiteral(ctx, term, expected);
    }
    throw new Error('no absub: ' + term.type);
};
