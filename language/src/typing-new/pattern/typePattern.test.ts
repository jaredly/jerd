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
    expected: Array<Type> = [],
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
    });

    // it();
});
