import { parseTyped } from '../../parsing/parser-new';
import { idName } from '../../typing/env';
import * as preset from '../../typing/preset';
import { patternIs } from '../../typing/typePattern';
import { Type } from '../../typing/types';
import { Context, ValueBinding } from '../Context';
import {
    customMatchers,
    errorSerilaizer,
    newContext,
    parseExpression,
    parseToplevels,
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

        let res = parsePattern(ctx, `10`);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`10`);
        expect(patternIs(res, preset.int)).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrorsP(ctx);

        res = parsePattern(ctx, `10.1`);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`10.1`);
        expect(patternIs(res, preset.float)).toEqualType(preset.float, ctx);
        expect(res).toNotHaveErrorsP(ctx);

        const bindings: Array<ValueBinding> = [];
        res = parsePattern(ctx, `"yes" as what`, bindings);
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
});
