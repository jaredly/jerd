import { Expression } from '../parsing/parser-new';
import * as preset from '../typing/preset';
import { Term, Type, typesEqual } from '../typing/types';
import { reGroupOps, typeGroup } from './ops';
import { typeArrayLiteral } from './typeArrayLiteral';
import { Context } from './Context';
import { typeIdentifier } from './typeIdentifier';
import { typeBlock } from './typeBlock';
import { typeArrow } from './typeArrow';

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
        case 'Block':
            return typeBlock(ctx, term, expected);
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
        case 'Lambda': {
            return typeArrow(ctx, term, expected);
        }
        // case 'WithUnary': {
        //     if (term.op != null) {
        //         throw new Error('no unary');
        //     }
        //     return typeExpression(ctx, term.inner, expected);
        // }
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
