import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation } from '../typing/types';
import { addRecord } from './Library';
import {
    customMatchers,
    errorSerilaizer,
    newContext,
    parseExpression,
    parseToplevels,
    rawSnapshotSerializer,
    showTermErrors,
    termToString,
    warningsSerializer,
} from './test-utils';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

describe('typeAttribute', () => {
    it(`let's try something simple`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hello',
            ['hello'],
        );
        let what;
        [ctx.library, [what]] = parseToplevels(
            ctx,
            `const what = Hello{hello: 10}`,
        );

        let res = parseExpression(ctx, `what.hello`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `what#${idName(what)}.hello#${idName(id)}#0`,
        );
        expect(res.is).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrors(ctx);

        // explicit
        res = parseExpression(ctx, `what.hello#${idName(id)}#0`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `what#${idName(what)}.hello#${idName(id)}#0`,
        );
        expect(res.is).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it(`type vbl`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hello',
            ['hello'],
        );

        let res = parseExpression(ctx, `<T: Hello>(m: T) => m.hello`);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<T#:2: Hello#688af3e6>(m#:3: T#:2): int#builtin ={}> m#:3.hello#688af3e6#0`,
        );
    });

    it(`some errors`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hello',
            ['hello'],
        );
        let id2;
        [ctx.library, id2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float]),
            'Other',
            ['whatsit'],
        );
        let what;
        [ctx.library, [what]] = parseToplevels(ctx, `const what = 10`);
        let who;
        [ctx.library, [who]] = parseToplevels(
            ctx,
            `const who = Hello{hello: 10}`,
        );

        expect(showTermErrors(ctx, parseExpression(ctx, `what.hello`))).toEqual(
            `what#${idName(what)}.hello at 1:5-1:11`,
        );

        expect(showTermErrors(ctx, parseExpression(ctx, `what.whooo`))).toEqual(
            `what#${idName(what)}.whooo at 1:5-1:11`,
        );

        expect(
            showTermErrors(ctx, parseExpression(ctx, `who.whatsit`)),
        ).toEqual(`who#${idName(who)}.whatsit at 1:4-1:12`);
    });
});
