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
        // TODO use the effects and stuff, once I have raise and suffixes implemented.
        expect(termToString(ctx, res)).toMatchInlineSnapshot(`
            <T#:3: Hi#688af3e6>{e#:2}(
                a#:4: int#builtin,
                b#:5: int#builtin,
                c#:6: (arg: T#:3) ={}> int#builtin,
                arg#:7: T#:3,
            ): int#builtin ={What#20bf83b4, e#:2}> a#:4 +#builtin b#:5
        `);
    });

    it('should track effect usages', () => {
        const ctx = newContext();
        let id;
        [ctx.library, id] = addEffect(
            ctx.library,
            {
                type: 'EffectDef',
                constrs: [{ args: [preset.int], ret: preset.void_ }],
                location: nullLocation,
            },
            'What',
            ['what'],
        );
        const res = parseExpression(ctx, `() => raise!(What.what(23))`);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(): void#builtin ={What#895a3b94}> raise!(What#895a3b94.what(23))`,
        );
    });

    it('should track effect usages even when incorrectly specified', () => {
        const ctx = newContext();
        let id;
        [ctx.library, id] = addEffect(
            ctx.library,
            {
                type: 'EffectDef',
                constrs: [{ args: [preset.int], ret: preset.void_ }],
                location: nullLocation,
            },
            'What',
            ['what'],
        );
        const res = parseExpression(ctx, `() ={}> raise!(What.what(23))`);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(): void#builtin ={What#895a3b94}> raise!(What#895a3b94.what(23))`,
        );
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:1-1:30: Function body had an effect that wasn't declated: ref:895a3b94`,
        );
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

    // SOOOOOO what would I need to do to get local recursion? Is that important at all?
    it('should work recursive', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.types.float = 0;

        ctx.bindings.self = {
            name: 'hello',
            type: preset.pureFunction([], preset.int),
        };
        const res = parseExpression(ctx, `(): int => hello#self()`);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `(): int#builtin ={}> hello#self()`,
        );
        expect(res.is).toEqualType(preset.pureFunction([], preset.int), ctx);
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
