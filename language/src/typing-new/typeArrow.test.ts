import * as preset from '../typing/preset';
import { LambdaType, nullLocation } from '../typing/types';
import { addEffect, addRecord, addTerm } from './Library';
import {
    customMatchers,
    errorSerilaizer,
    fakeOp,
    newContext,
    parseExpression,
    rawSnapshotSerializer,
    showTermErrors,
    showTypeErrors,
    termToString,
    warningsSerializer,
} from './test-utils';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

const fakeIntOp = fakeOp(preset.int);

describe('typeArrow', () => {
    it('should work', () => {
        const ctx = newContext();

        const res = parseExpression(ctx, `() => 10`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(): int#builtin ={}> 10`,
        );
        expect(res.is).toEqualType(preset.pureFunction([], preset.int), ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it('should work, if complicated', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.ops.binary['+'] = [
            { left: preset.int, right: preset.int, output: preset.int },
        ];
        let id;
        [ctx.library, id] = addEffect(
            ctx.library,
            { type: 'EffectDef', constrs: [], location: nullLocation },
            'What',
            [],
        );
        [ctx.library] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hi',
            ['abc'],
        );

        const res = parseExpression(
            ctx,
            `<T: Hi>{e}(a: int, b: int, c: (arg: T) => int, arg: T): int ={What, e}> a + b`,
        );
        expect(res).toNotHaveErrors(ctx);
        expect(
            (res.is as LambdaType).effects.map((a) => ({
                ...a,
                location: nullLocation,
            })),
        ).toEqual([
            { type: 'ref', ref: { type: 'user', id }, location: nullLocation },
            {
                type: 'var',
                sym: { name: 'e', unique: 2 },
                location: nullLocation,
            },
        ]);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(`
            <T#:3: Hi#688af3e6>{e#:2}(
                a#:4: int#builtin,
                b#:5: int#builtin,
                c#:6: (arg: T#:3) ={}> int#builtin,
                arg#:7: T#:3,
            ): int#builtin ={What#20bf83b4, e#:2}> a#:4 +#builtin b#:5
        `);
    });

    it('should work with basic late-binding of expected types, in both directions', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.types.float = 0;
        ctx.builtins.ops.binary['+'] = [
            { left: preset.int, right: preset.float, output: preset.int },
        ];
        let res = parseExpression(ctx, `(a, b: float) => a + b`);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(a#:1: int#builtin, b#:2: float#builtin): int#builtin ={}> a#:1 +#builtin b#:2`,
        );
        expect(res).toNotHaveErrors(ctx);

        res = parseExpression(ctx, `(a: int, b) => a + b`);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(a#:3: int#builtin, b#:4: float#builtin): int#builtin ={}> a#:3 +#builtin b#:4`,
        );
        expect(res).toNotHaveErrors(ctx);
    });

    it('should work with expected type', () => {
        const ctx = newContext();
        const res = parseExpression(ctx, `(a) => a`, [
            preset.pureFunction([preset.int], preset.int),
        ]);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(a#:1: int#builtin): int#builtin ={}> a#:1`,
        );
        expect(res).toNotHaveErrors(ctx);
    });

    it('should just give holes if nothing specified', () => {
        const ctx = newContext();
        const res = parseExpression(ctx, `(a) => a`, []);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(a#:1: [type hole]): [type hole] ={}> a#:1`,
        );
        expect(showTypeErrors(ctx, res.is)).toMatchInlineSnapshot(`
            [type hole] at 1:8-1:9
            [type hole] at 1:8-1:9
        `);
    });

    it('should put holes of things that never get inferred', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        const res = parseExpression(ctx, `(a, b: int) => b`, []);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(a#:1: [type hole], b#:2: int#builtin): int#builtin ={}> b#:2`,
        );
        expect(showTypeErrors(ctx, res.is)).toMatchInlineSnapshot(
            `[type hole] at 1:2-1:3`,
        );
    });
});
