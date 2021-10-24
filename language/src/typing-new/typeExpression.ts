import { Expression } from '../parsing/parser-new';
import * as preset from '../typing/preset';
import { Term, Type, typesEqual, UserTypeReference } from '../typing/types';
import { reGroupOps, typeGroup } from './ops';
import { typeArrayLiteral } from './typeArrayLiteral';
import { Context } from './Context';
import { typeIdentifier } from './typeIdentifier';
import { typeBlock } from './typeBlock';
import { typeArrow } from './typeArrow';
import { typeRaise } from './typeRaise';
import { typeSuffix } from './typeSuffix';
import { typeRecord } from './typeRecord';
import { typeUnary } from './typeUnary';
import { typeTemplateString } from './typeTemplateString';
import { typeEnum } from './typeEnum';
import { typeSwitch } from './typeSwitch';
import { typeDecorated } from './typeDecorated';

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
        case 'RecordLiteral':
            return typeRecord(ctx, term, expected);
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
        case 'Raise': {
            return typeRaise(ctx, term, expected);
        }
        case 'WithUnary': {
            return typeUnary(ctx, term, expected);
        }
        case 'WithSuffix': {
            // Ok, we're going to type these from the outside in, so that
            // we get out expecteds right.
            if (term.suffixes.length === 0) {
                return typeExpression(ctx, term.target, expected);
            }
            const right = term.suffixes[term.suffixes.length - 1];
            const inner =
                term.suffixes.length === 1
                    ? term.target
                    : { ...term, suffixes: term.suffixes.slice(0, -1) };
            return typeSuffix(ctx, right, inner, expected);
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
        case 'Boolean':
            return {
                type: 'boolean',
                is: preset.bool,
                location: term.location,
                value: term.v === 'true',
            };
        case 'ArrayLiteral':
            return typeArrayLiteral(ctx, term, expected);
        case 'Trace':
            console.warn(`IGNORING TRACE, I DONT LIKE IT`);
            return typeExpression(ctx, term.args.items[0], expected);
        case 'TupleLiteral':
            const expectedTuple: null | UserTypeReference = expected.find(
                (t) =>
                    t.type === 'ref' &&
                    t.typeVbls.length === term.items.items.length &&
                    t.ref.type === 'builtin' &&
                    t.ref.name === `Tuple${term.items.items.length}`,
            ) as UserTypeReference | null;
            const values = term.items.items.map((item, i) => {
                return typeExpression(
                    ctx,
                    item,
                    expectedTuple ? [expectedTuple.typeVbls[i]] : [],
                );
            });
            return wrapExpected(
                {
                    type: 'Tuple',
                    is: {
                        type: 'ref',
                        location: term.location,
                        ref: {
                            type: 'builtin',
                            name: `Tuple${term.items.items.length}`,
                        },
                        typeVbls: values.map((v) => v.is),
                    },
                    items: values,
                    location: term.location,
                },
                expected,
            );
        case 'TemplateString':
            return typeTemplateString(ctx, term, expected);
        case 'If': {
            const cond = typeExpression(ctx, term.cond, [preset.bool]);
            const yes = typeExpression(ctx, term.yes, expected);
            const no = term.no
                ? typeExpression(
                      ctx,
                      term.no.type === 'IfElse' ? term.no.v : term.no,
                      [yes.is],
                  )
                : term.no;
            return {
                type: 'if',
                cond,
                is: yes.is,
                location: term.location,
                no,
                yes,
            };
        }
        case 'Switch':
            return typeSwitch(ctx, term, expected);
        case 'EnumLiteral':
            return typeEnum(ctx, term, expected);
        case 'Decorated':
            return typeDecorated(ctx, term, expected);
        case 'Handle':
            break;
        default:
            let _x: never = term;
    }
    throw new Error('no absub: ' + term.type);
};
