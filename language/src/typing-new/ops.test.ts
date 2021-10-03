import { parseTyped, WithUnary } from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import { nullLocation } from '../typing/types';
import * as preset from '../typing/preset';
import { GroupedOp, reGroupOps } from './ops';
import { Context, ctxToEnv, NamedDefns, typeBinOp } from './typeFile';
import { addRecord } from './Library';
import { printToString } from '../printing/printer';
import { termToPretty } from '../printing/printTsLike';

export const rawSnapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && typeof value === 'string';
    },
    print(value, _, __) {
        return value as string;
    },
};
expect.addSnapshotSerializer(rawSnapshotSerializer);

const l = (n: number) => '[({<'[n % 4];
const r = (n: number) => '])}>'[n % 4];

const int = (w: WithUnary) =>
    w.inner.sub.type === 'Int' ? w.inner.sub.contents : null;
const groups = (w: WithUnary | GroupedOp, i: number): any =>
    w.type === 'WithUnary'
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
        if (top.type === 'ToplevelExpression') {
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

describe('full parse maybe', () => {
    it('ok', () => {
        const ctx: Context = newContext();
        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            {
                type: 'Record',
                effectVbls: [],
                extends: [],
                ffi: null,
                items: [
                    {
                        type: 'lambda',
                        args: [preset.int, preset.int],
                        effectVbls: [],
                        effects: [],
                        location: nullLocation,
                        res: preset.int,
                        rest: null,
                        typeVbls: [],
                    },
                ],
                location: nullLocation,
                typeVbls: [],
                unique: 0,
            },
            'slash',
            ['/'],
        );
        // ctx.library.types.constructors.names['/'] = [{ idx: 0, id: slash }];
        // ctx.library.types.defns[idName(slash)] = {
        // };
        // ctx.library.types.names['div'] = [slash];

        const slashInt = idFromName('slash-int');
        ctx.library.terms.defns[idName(slashInt)] = {
            type: 'Record',
            location: nullLocation,
            subTypes: {},
            is: {
                type: 'ref',
                ref: { type: 'user', id: slash },
                location: nullLocation,
                typeVbls: [],
            },
            base: {
                location: nullLocation,
                ref: { type: 'user', id: slash },
                spread: null,
                type: 'Concrete',
                rows: [
                    {
                        type: 'lambda',
                        args: [
                            { unique: 0, name: 'left' },
                            { name: 'right', unique: 1 },
                        ],
                        body: {
                            type: 'Hole',
                            is: preset.int,
                            location: nullLocation,
                        },
                        idLocations: [],
                        is: preset.pureFunction(
                            [preset.int, preset.int],
                            preset.int,
                        ),
                        location: nullLocation,
                    },
                ],
            },
        };
        ctx.library.terms.names['slash'] = [slashInt];

        // const parsed = parseTyped(
        //     `2 + 3 * 4 * 5 * 3 / 2 * 102 + 1 + 2 ^ 3 & 4`,
        // );

        const parsed = parseTyped(`2 / 3`);
        const top = parsed.tops![0].top;
        if (top.type !== 'ToplevelExpression') {
            return expect(false).toBe(true);
        }
        const res = typeBinOp(ctx, top.expr, []);
        expect(ctx.warnings).toHaveLength(0);
        expect(res).toBeTruthy();
        expect(
            printToString(termToPretty(ctxToEnv(ctx), res!), 100),
        ).toMatchInlineSnapshot(`2 /#slash-int#d28f8708#0 3`);

        // expect(groups(reGroupOps(top.expr), 0)).toMatchInlineSnapshot(
        //     `&[+(2 *{/<*[3 4 5 3] 2> 102} 1 ^{2 3}) 4]`,
        // );
    });
});
