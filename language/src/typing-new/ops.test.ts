import {
    Expression,
    parseTyped,
    WithUnary,
    WithUnary_inner,
    Location,
} from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import {
    nullLocation,
    Term,
    Type,
    TypeError,
    ErrorTerm,
    Symbol,
    Id,
} from '../typing/types';
import * as preset from '../typing/preset';
import { GroupedOp, reGroupOps } from './ops';
import { ctxToEnv } from './migrate';
import { Context, NamedDefns } from './Context';
import { typeExpression } from './typeExpression';
import { addRecord, addTerm } from './Library';
import { printToString } from '../printing/printer';
import { termToPretty } from '../printing/printTsLike';
import { showLocation } from '../typing/typeExpr';
import { transformTerm } from '../typing/auto-transform';
import { showType } from '../typing/unify';
import {
    customMatchers,
    errorSerilaizer,
    fakeOp,
    newContext,
    parseExpression,
    parseToplevels,
    rawSnapshotSerializer,
    warningsSerializer,
} from './test-utils';
import { findErrors } from './typeRecord';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

const l = (n: number) => '[({<'[n % 4];
const r = (n: number) => '])}>'[n % 4];

const int = (w: Expression) => (w.type === 'Int' ? w.contents : null);
const groups = (w: Expression | GroupedOp, i: number): any =>
    w.type !== 'GroupedOp'
        ? int(w)
        : `${w.items[0].op.op}${l(i)}${groups(
              w.left,
              i + 1,
          )} ${w.items.map((n) => groups(n.right, i + 1)).join(' ')}${r(i)}`;

const simpleCtx = () => {
    const { ctx, slash } = addSimpleRecord(newContext());

    let slashImpl;
    [ctx.library, slashImpl] = addTerm(
        ctx.library,
        preset.recordLiteral(slash, [fakeIntOp]),
        'slash',
    );

    return { ctx, slash, slashImpl };
};

describe('just parse & group', () => {
    it('ok', () => {
        const parsed = parseTyped(
            `2 + 3 * 4 * 5 * 3 / 2 * 102 + 1 + 2 ^ 3 & 4`,
        );
        const top = parsed.tops!.items[0].top;
        if (top.type === 'ToplevelExpression' && top.expr.type === 'BinOp') {
            expect(groups(reGroupOps(top.expr), 0)).toMatchInlineSnapshot(
                `&[+(2 *{/<*[3 4 5 3] 2> 102} 1 ^{2 3}) 4]`,
            );
        } else {
            expect(false).toBe(true);
        }
    });
});

/*

/ int float
/ int int
* int int
> int int

x int
x float
y int
y float

- test for ...extends
- and honestly I really should handle type variables in extends
- test for generics folks
    - both at the record level, and at the row (function) level

*/

const fakeIntOp = fakeOp(preset.int);

const unique = 1;
const T: Type = {
    type: 'var',
    location: nullLocation,
    sym: { unique, name: 'T' },
};

const fakeAnyOp = preset.lambdaLiteral(
    [
        { sym: { unique: 0, name: 'left' }, is: T, location: nullLocation },
        { sym: { name: 'right', unique: 1 }, is: T, location: nullLocation },
    ],
    {
        type: 'Hole',
        is: T,
        location: nullLocation,
    },
    undefined,
    [{ sym: { unique, name: 'T' }, subTypes: [], location: nullLocation }],
);

describe('non-generic examples', () => {
    it('local definition', () => {
        const { ctx, slash } = simpleCtx();

        ctx.bindings.values.push({
            location: nullLocation as Location,
            sym: { unique: 10, name: 'slash' },
            type: {
                type: 'ref',
                ref: { type: 'user', id: slash },
                typeVbls: [],
                location: nullLocation,
            },
        });

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#:10#d28f8708#0 3`,
        );
    });

    it('toplevel definition, using a basic record', () => {
        const { ctx } = simpleCtx();

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
    });

    it('builtin', () => {
        const ctx = newContext();
        ctx.builtins.ops.binary['+'] = [
            { left: preset.int, right: preset.float, output: preset.int },
        ];

        const res = parseExpression(ctx, `2 + 3.0`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res).toNotHaveErrors(ctx);
        expect(res.is).toEqualType(preset.int, ctx);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(`2 +#builtin 3.0`);
    });

    it('toplevel wins over builtin', () => {
        const { ctx } = simpleCtx();
        ctx.builtins.ops.binary['+'] = [
            { left: preset.int, right: preset.float, output: preset.int },
        ];

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
    });

    // it(`unary`, () => {
    //     const ctx = newContext();
    //     [ctx.library] = parseToplevels(
    //         ctx,
    //         `
    //     type Un<T> = {
    //         "-": (T) => T
    //     }
    //     const M = Un<string>{"-": (m: string) => "-" + m};
    //     `,
    //     );
    //     let res = parseExpression(ctx, `-"yes"`);
    //     expect(res).toNotHaveErrors(ctx);
    // });

    it('toplevel definition, two to choose from', () => {
        const ctx = newContext();

        const float = fakeOp(preset.float);

        let slashF; // const slash = idFromName('slash');
        [ctx.library, slashF] = addRecord(
            ctx.library,
            preset.recordDefn([float.is]),
            'slash',
            ['/'],
        );

        [ctx.library] = addTerm(
            ctx.library,
            preset.recordLiteral(slashF, [float]),
            'slash',
        );

        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn([fakeIntOp.is]),
            'slash',
            ['/'],
        );

        [ctx.library] = addTerm(
            ctx.library,
            preset.recordLiteral(slash, [fakeIntOp]),
            'slash',
        );

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
        const res1 = parseExpression(ctx, `2.0 / 3.0`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res1).toNotHaveErrors(ctx);
        expect(termToString(ctx, res1)).toMatchInlineSnapshot(
            `2.0 /#2a551f71#69c30a31#0 3.0`,
        );
        // Auto-convert the second one...
        const res3 = parseExpression(ctx, `2.0 / 3`);
        expect(termToString(ctx, res3)).toMatchInlineSnapshot(
            `2.0 /#2a551f71#69c30a31#0 3.0`,
        );
        expect(res3).toNotHaveErrors(ctx);
    });

    it('toplevel definition, impl for a record that extends the operator type', () => {
        const ctx = newContext();

        let slash;
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn([fakeIntOp.is]),
            'slash',
            ['/'],
        );

        let slash2;
        [ctx.library, slash2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int], [preset.userTypeReference(slash)]),
            'slash2',
            ['what'],
        );

        let slashImpl;
        [ctx.library, slashImpl] = addTerm(
            ctx.library,
            preset.recordLiteral(
                slash2,
                [preset.intLiteral(10, nullLocation)],
                {
                    [idName(slash)]: {
                        covered: true,
                        rows: [fakeIntOp],
                        spread: null,
                    },
                },
            ),
            'slash',
        );

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#1a321d3e#d28f8708#0 3`,
        );
    });
});

const addSimpleRecord = (ctx: Context) => {
    let slash; // const slash = idFromName('slash');
    [ctx.library, slash] = addRecord(
        ctx.library,
        preset.recordDefn([fakeIntOp.is]),
        'slash',
        ['/'],
    );

    return { ctx, slash };
};

describe('failures', () => {
    it('type exists but no impl', () => {
        const ctx = newContext();

        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn([fakeIntOp.is]),
            'slash',
            ['/'],
        );

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(1);
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:2-1:6: No values found that match the operator. I found some types though.`,
        );
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `NOTFOND(/){}(2, 3)`,
        );
        expect({ ctx, errors: findErrors(res) }).toMatchInlineSnapshot(
            `NOTFOND(/) at 1:2-1:6`,
        );
    });

    it('no type exists', () => {
        const ctx = newContext();

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(1);
        expect(ctx.warnings).toMatchInlineSnapshot(`1:2-1:6: No attribute /`);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `NOTFOND(/){}(2, 3)`,
        );
        expect({ ctx, errors: findErrors(res) }).toMatchInlineSnapshot(
            `NOTFOND(/) at 1:2-1:6`,
        );
    });

    it('right is wrong type', () => {
        const { ctx } = simpleCtx();
        const res = parseExpression(ctx, `2 / 3.0`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3.0`,
        );
        expect({ ctx, errors: findErrors(res) }).toMatchInlineSnapshot(
            `3.0 at 1:5-1:8`,
        );
    });

    it('left is wrong type', () => {
        const { ctx } = simpleCtx();
        const res = parseExpression(ctx, `2.0 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2.0 /#a7b87324#d28f8708#0 3`,
        );
        expect(
            findErrors(res)
                .map((t) => termToString(ctx, t))
                .join('\n'),
        ).toMatchInlineSnapshot(`2.0`);
    });

    it('both are wrong types', () => {
        const { ctx } = simpleCtx();
        const res = parseExpression(ctx, `2.0 / 3.0`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2.0 /#a7b87324#d28f8708#0 3.0`,
        );
        expect(
            findErrors(res)
                .map((t) => termToString(ctx, t))
                .join('\n'),
        ).toMatchInlineSnapshot(`
            2.0
            3.0
        `);
    });
});

// TODO:
// - a local implementation of the type dealio
// - type variables folks

const simpleGeneric = () => {
    const ctx = newContext();

    const unique = 1;
    const sym = { unique, name: 'T' };
    const T: Type = {
        type: 'var',
        location: nullLocation,
        sym,
    };

    let slash; // const slash = idFromName('slash');
    [ctx.library, slash] = addRecord(
        ctx.library,
        preset.recordDefn(
            [preset.pureFunction([T, T], T)],
            [],
            [{ sym, subTypes: [], location: nullLocation }],
        ),
        'slash',
        ['/'],
    );

    let slashImpl;
    [ctx.library, slashImpl] = addTerm(
        ctx.library,
        preset.recordLiteral(slash, [fakeIntOp], {}, [preset.int]),
        'slash',
    );

    return { ctx, unique, T, slash, slashImpl };
};

describe('generic examples', () => {
    it('toplevel definition, using a generic record', () => {
        const { ctx } = simpleGeneric();

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#35cbfb14#6e97893a#0 3`,
        );
    });

    it('toplevel definition, using a generic record, two to choose from', () => {
        const { ctx, slash } = simpleGeneric();

        [ctx.library] = addTerm(
            ctx.library,
            preset.recordLiteral(slash, [fakeIntOp], {}, [preset.int]),
            'slash',
        );

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#35cbfb14#6e97893a#0 3`,
        );
    });

    const complexGeneric = () => {
        const ctx = newContext();

        const unique = 1;
        const sym = { unique, name: 'A' };
        const A: Type = {
            type: 'var',
            location: nullLocation,
            sym,
        };

        const uniqueB = 2;
        const symB = { unique: uniqueB, name: 'B' };
        const B: Type = {
            type: 'var',
            location: nullLocation,
            sym: symB,
        };

        const uniqueC = 3;
        const symC = { unique: uniqueC, name: 'C' };
        const C: Type = {
            type: 'var',
            location: nullLocation,
            sym: symC,
        };

        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn(
                [preset.pureFunction([A, B], C)],
                [],
                [
                    { sym, subTypes: [], location: nullLocation },
                    { sym: symB, subTypes: [], location: nullLocation },
                    { sym: symC, subTypes: [], location: nullLocation },
                ],
            ),
            'slash',
            ['/'],
        );

        return { ctx, slash };
    };

    it('toplevel definition, using a generic record, both at play', () => {
        const { ctx, slash } = complexGeneric();

        [ctx.library] = addTerm(
            ctx.library,
            preset.recordLiteral(slash, [fakeOp(preset.float)], {}, [
                preset.float,
                preset.float,
                preset.int,
            ]),
            'slashFloat',
        );

        [ctx.library] = addTerm(
            ctx.library,
            preset.recordLiteral(slash, [fakeIntOp], {}, [
                preset.int,
                preset.int,
                preset.int,
            ]),
            'slash',
        );

        const res = parseExpression(ctx, `1.2 / 2.3 / 2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `1.2 /#96e39c78#627c3bcc#0 2.3 /#69881e54#627c3bcc#0 2 /#69881e54#627c3bcc#0 3`,
        );
    });

    it('toplevel definition, using a generic /function/', () => {
        const ctx = newContext();

        const unique = 1;
        const sym = { unique, name: 'T' };
        const T: Type = {
            type: 'var',
            location: nullLocation,
            sym,
        };

        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn(
                [
                    preset.pureFunction([T, T], T, [
                        { sym, subTypes: [], location: nullLocation },
                    ]),
                ],
                [],
                [],
            ),
            'slash',
            ['/'],
        );

        let slashImpl;
        [ctx.library, slashImpl] = addTerm(
            ctx.library,
            preset.recordLiteral(slash, [fakeAnyOp], {}),
            'slash',
        );

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#06ca643e#eec7a598#0 3`,
        );
        // Explicit now
        const res2 = parseExpression(
            ctx,
            `2 /#${idName(slashImpl)}#${idName(slash)}#0 3`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res2)).toMatchInlineSnapshot(
            `2 /#06ca643e#eec7a598#0 3`,
        );
    });

    it('local type variable', () => {
        const { ctx, slash } = addSimpleRecord(newContext());

        const tunique = 1;
        const tsym: Symbol = { unique: tunique, name: 'T' };
        ctx.bindings.types.push({
            location: nullLocation as Location,
            subTypes: [slash],
            sym: tsym,
        });
        ctx.bindings.values.push({
            location: nullLocation as Location,
            sym: { unique: 10, name: 'slasher' },
            type: { type: 'var', sym: tsym, location: nullLocation },
        });

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#:10#d28f8708#0 3`,
        );
        const res2 = parseExpression(ctx, `2 /#:10#d28f8708#0 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res2)).toMatchInlineSnapshot(
            `2 /#:10#d28f8708#0 3`,
        );
    });

    it('local type variable invalid', () => {
        const { ctx, slash } = addSimpleRecord(newContext());

        const tunique = 1;
        const tsym: Symbol = { unique: tunique, name: 'T' };
        ctx.bindings.types.push({
            location: nullLocation as Location,
            subTypes: [],
            sym: tsym,
        });
        ctx.bindings.values.push({
            location: nullLocation as Location,
            sym: { unique: 10, name: 'slasher' },
            type: { type: 'var', sym: tsym, location: nullLocation },
        });

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:2-1:6: No values found that match the operator. I found some types though.`,
        );
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `NOTFOND(/){}(2, 3)`,
        );
        const res2 = parseExpression(ctx, `2 /#:10#d28f8708#0 3`);
        expect(termToString(ctx, res2)).toMatchInlineSnapshot(
            `NOTFOND(/){}(2, 3)`,
        );
        const res3 = parseExpression(ctx, `2 /#:11#d28f8708#0 3`);
        expect(termToString(ctx, res3)).toMatchInlineSnapshot(
            `NOTFOND(/){}(2, 3)`,
        );
    });
});

describe('explicit hashes', () => {
    it('correct', () => {
        const { ctx, slash, slashImpl } = simpleCtx();
        const res = parseExpression(
            ctx,
            `2 /#${idName(slashImpl)}#${idName(slash)}#0 3`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
    });

    it('incorrect', () => {
        const { ctx, slash, slashImpl } = simpleCtx();
        const res = parseExpression(
            ctx,
            `2 /#0${idName(slashImpl)}#${idName(slash)}#0 3`,
        );
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:2-1:27: Unable to resolve value for operator`,
        );
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
    });

    it('incorrect type', () => {
        const { ctx, slash, slashImpl } = simpleCtx();
        const res = parseExpression(
            ctx,
            `2 /#${idName(slashImpl)}#0${idName(slash)}#0 3`,
        );
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:2-1:27: Attribute type 0d28f8708 doesn't exist`,
        );
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
    });

    it('invalid', () => {
        const { ctx, slash, slashImpl } = simpleCtx();
        const res = parseExpression(ctx, `2 /#aaa 3`);
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:2-1:10: Unable to parse hash "#aaa"`,
        );
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
    });

    it('invalid', () => {
        const { ctx, slash, slashImpl } = simpleCtx();
        const res = parseExpression(ctx, `2 /#${idName(slashImpl)}#0 3`);
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:2-1:17: Invalid hash "#a7b87324#0"`,
        );
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
    });

    it('wrong', () => {
        const { ctx, slash, slashImpl } = simpleCtx();

        let wrong;
        [ctx.library, wrong] = addTerm(
            ctx.library,
            preset.intLiteral(100, nullLocation),
        );

        const res = parseExpression(
            ctx,
            `2 /#${idName(wrong)}#${idName(slash)}#0 3`,
        );
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:2-1:26: Attribute target is a int#builtin, not a user-defined toplevel type`,
        );
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#a7b87324#d28f8708#0 3`,
        );
    });

    it('local definition beats global', () => {
        const { ctx, slash, slashImpl } = simpleCtx();

        ctx.bindings.values.push({
            location: nullLocation as Location,
            sym: { unique: 10, name: 'slash' },
            type: {
                type: 'ref',
                ref: { type: 'user', id: slash },
                typeVbls: [],
                location: nullLocation,
            },
        });

        const res = parseExpression(ctx, `2 /#:10#${idName(slash)}#0 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#:10#d28f8708#0 3`,
        );
    });
});

const termToString = (ctx: Context, term: Term | null | void) =>
    term == null
        ? '[null term]'
        : printToString(termToPretty(ctxToEnv(ctx), term), 100);
