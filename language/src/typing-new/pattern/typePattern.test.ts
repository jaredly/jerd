import { parseTyped } from '../../parsing/parser-new';
import { idName } from '../../typing/env';
import * as preset from '../../typing/preset';
import { patternIs } from '../../typing/typePattern';
import { Pattern, Type } from '../../typing/types';
import { Context, ValueBinding } from '../Context';
import {
    customMatchers,
    errorSerilaizer,
    findPatternErrors,
    newContext,
    parseExpression,
    parseToplevels,
    patternErrorToString,
    patternToString,
    rawSnapshotSerializer,
    showTermErrors,
    termToString,
    warningsSerializer,
} from '../test-utils';
import { typePattern } from './typePattern';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

export const parsePattern = (
    ctx: Context,
    raw: string,
    bindings: Array<ValueBinding> = [],
    expected: Type = preset.void_,
) => {
    const parsed = parseTyped('const ' + raw + ' = 10');
    const top = parsed.tops!.items[0].top;
    if (top.type !== 'Define') {
        expect(false).toBe(true);
        throw new Error(`nope`);
    }
    return typePattern(ctx, top.id, bindings, expected);
};

describe('typePattern', () => {
    it('should with int and float', () => {
        const ctx = newContext();

        let res = parsePattern(ctx, `10`, [], preset.int);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`10`);
        expect(patternIs(res, preset.int)).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrorsP(ctx);

        res = parsePattern(ctx, `10.1`, [], preset.float);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`10.1`);
        expect(patternIs(res, preset.float)).toEqualType(preset.float, ctx);
        expect(res).toNotHaveErrorsP(ctx);

        const bindings: Array<ValueBinding> = [];
        res = parsePattern(ctx, `"yes" as what`, bindings, preset.string);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`"yes" as what#:1`);
        expect(bindings.map((b) => b.sym)).toEqual([
            { unique: 1, name: 'what' },
        ]);
        expect(patternIs(res, preset.string)).toEqualType(preset.string, ctx);
        expect(res).toNotHaveErrorsP(ctx);
    });

    it('tuples should be nice', () => {
        const ctx = newContext();
        const bindings: Array<ValueBinding> = [];
        let res = parsePattern(
            ctx,
            `(a, 2)`,
            bindings,
            preset.builtinType('Tuple2', [preset.float, preset.int]),
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`(a#:1, 2)`);
        expect(bindings.map((b) => b.sym)).toEqual([{ unique: 1, name: 'a' }]);
        expect(res).toNotHaveErrorsP(ctx);
    });

    it('array stuff?', () => {
        const ctx = newContext();
        const t = preset.builtinType('Array', [preset.int]);

        let res = parsePattern(ctx, '[]', [], t);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`[]`);
        expect(res).toNotHaveErrorsP(ctx);

        res = parsePattern(ctx, '[a, ..., 2]', [], t);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`[a#:1, ..., 2]`);
        expect(res).toNotHaveErrorsP(ctx);

        res = parsePattern(ctx, '[a, b, 23, ...]', [], t);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`[a#:2, b#:3, 23, ...]`);
        expect(res).toNotHaveErrorsP(ctx);
    });

    it('multiple spreads are an error', () => {
        const ctx = newContext();
        const t = preset.builtinType('Array', [preset.int]);

        let res = parsePattern(ctx, '[a, ...a, ...b, c]', [], t);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(
            `[a#:1, ...a#:2, ...b#:3, c#:4]`,
        );
        expect(showPatternErrors(ctx, res)).toEqual(`DuplicateSpread: ...b#:3`);
    });

    it('spreading a non-array is an error', () => {
        const ctx = newContext();
        const t = preset.builtinType('Array', [preset.int]);

        let res = parsePattern(ctx, '[a, ...3, c]', [], t);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`[a#:1, ...3, c#:2]`);
        expect(showPatternErrors(ctx, res)).toEqual(
            `Expected Array#builtin<int#builtin>, found int#builtin : 3`,
        );
    });
});

const showPatternErrors = (ctx: Context, pattern: Pattern) => {
    return findPatternErrors(pattern)
        .map((p) => patternErrorToString(ctx, p))
        .join('\n');
};
