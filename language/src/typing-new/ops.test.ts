import {
    Expression,
    parseTyped,
    WithUnary,
    WithUnary_inner,
} from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import { nullLocation, Location, Term, Type } from '../typing/types';
import * as preset from '../typing/preset';
import { GroupedOp, reGroupOps } from './ops';
import {
    Context,
    ctxToEnv,
    NamedDefns,
    typeBinOp,
    typeExpression,
} from './typeFile';
import { addRecord, addTerm } from './Library';
import { printToString } from '../printing/printer';
import { termToPretty } from '../printing/printTsLike';
import { showLocation } from '../typing/typeExpr';

export const rawSnapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && typeof value === 'string';
    },
    print(value, _, __) {
        return value as string;
    },
};
expect.addSnapshotSerializer(rawSnapshotSerializer);
export const warningsSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return (
            Array.isArray(value) &&
            value.every(
                (v) =>
                    v &&
                    typeof v.text === 'string' &&
                    typeof v.location === 'object',
            )
        );
    },
    print(value, _, __) {
        return (value as Array<{ location: Location; text: string }>)
            .map((item) => `${showLocation(item.location)}: ${item.text}`)
            .join('\n');
    },
};
expect.addSnapshotSerializer(warningsSerializer);

const l = (n: number) => '[({<'[n % 4];
const r = (n: number) => '])}>'[n % 4];

const int = (w: Expression) =>
    w.type === 'WithUnary'
        ? w.inner.type === 'Int'
            ? w.inner.contents
            : null
        : null;
const groups = (w: Expression | GroupedOp, i: number): any =>
    w.type !== 'GroupedOp'
        ? int(w)
        : `${w.items[0].op.op}${l(i)}${groups(
              w.left,
              i + 1,
          )} ${w.items.map((n) => groups(n.right, i + 1)).join(' ')}${r(i)}`;

describe('just parse & group', () => {
    it('ok', () => {
        const parsed = parseTyped(
            `2 + 3 * 4 * 5 * 3 / 2 * 102 + 1 + 2 ^ 3 & 4`,
        );
        const top = parsed.tops![0].top;
        if (top.type === 'ToplevelExpression' && top.expr.type === 'BinOp') {
            expect(groups(reGroupOps(top.expr), 0)).toMatchInlineSnapshot(
                `&[+(2 *{/<*[3 4 5 3] 2> 102} 1 ^{2 3}) 4]`,
            );
        } else {
            expect(false).toBe(true);
        }
    });
});

const namedDefns = <T>(): NamedDefns<T> => ({ defns: {}, names: {} });
const newContext = (): Context => ({
    warnings: [],
    unique: { current: 0 },
    bindings: {
        self: null,
        types: [],
        values: [],
    },
    library: {
        terms: namedDefns(),
        decorators: namedDefns(),
        types: {
            ...namedDefns(),
            constructors: { names: {}, idToNames: {} },
            superTypes: {},
        },
        effects: {
            ...namedDefns(),
            constructors: { names: {}, idToNames: {} },
        },
    },
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

const fakeIntOp = preset.lambdaLiteral(
    [
        { sym: { unique: 0, name: 'left' }, is: preset.int },
        { sym: { name: 'right', unique: 1 }, is: preset.int },
    ],
    {
        type: 'Hole',
        is: preset.int,
        location: nullLocation,
    },
);

const unique = 1;
const T: Type = {
    type: 'var',
    location: nullLocation,
    sym: { unique, name: 'T' },
};

const fakeAnyOp = preset.lambdaLiteral(
    [
        { sym: { unique: 0, name: 'left' }, is: T },
        { sym: { name: 'right', unique: 1 }, is: T },
    ],
    {
        type: 'Hole',
        is: T,
        location: nullLocation,
    },
    undefined,
    [{ unique, subTypes: [] }],
);

export const parseExpression = (ctx: Context, raw: string) => {
    const parsed = parseTyped(raw);
    const top = parsed.tops![0].top;
    if (top.type !== 'ToplevelExpression') {
        return expect(false).toBe(true);
    }
    return typeExpression(ctx, top.expr, []);
};

describe('failures', () => {
    it('type exists but no impl', () => {
        const ctx: Context = newContext();

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
        expect(termToString(ctx, res)).toMatchInlineSnapshot(`[null term]`);
    });

    it('no type exists', () => {
        const ctx: Context = newContext();

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(1);
        expect(ctx.warnings).toMatchInlineSnapshot(`1:2-1:6: No attribute /`);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(`[null term]`);
    });
});

// TODO:
// - a local implementation of the type dealio
// - type variables folks

describe('generic examples', () => {
    it('toplevel definition, using a generic record', () => {
        const ctx: Context = newContext();

        const unique = 1;
        const T: Type = {
            type: 'var',
            location: nullLocation,
            sym: { unique, name: 'T' },
        };

        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn(
                [preset.pureFunction([T, T], T)],
                [],
                [{ unique, subTypes: [] }],
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

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#e17b40b4#e3800aa8#0 3`,
        );
    });

    it('toplevel definition, using a generic /function/', () => {
        const ctx: Context = newContext();

        const unique = 1;
        const T: Type = {
            type: 'var',
            location: nullLocation,
            sym: { unique, name: 'T' },
        };

        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn(
                [preset.pureFunction([T, T], T, [{ unique, subTypes: [] }])],
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
            `2 /#1b191ec9#49d8f77e#0 3`,
        );
    });
});

describe('non-generic examples', () => {
    it('toplevel definition, using a basic record', () => {
        const ctx: Context = newContext();

        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn([fakeIntOp.is]),
            'slash',
            ['/'],
        );

        let slashImpl;
        [ctx.library, slashImpl] = addTerm(
            ctx.library,
            preset.recordLiteral(slash, [fakeIntOp]),
            'slash',
        );

        const res = parseExpression(ctx, `2 / 3`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `2 /#ae81c704#d28f8708#0 3`,
        );
    });

    it('toplevel definition, impl for a record that extends the operator type', () => {
        const ctx: Context = newContext();

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
            preset.recordDefn([preset.int], [slash]),
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
            `2 /#f249c8e4#d28f8708#0 3`,
        );
    });
});

const termToString = (ctx: Context, term: Term | null | void) =>
    term == null
        ? '[null term]'
        : printToString(termToPretty(ctxToEnv(ctx), term), 100);
