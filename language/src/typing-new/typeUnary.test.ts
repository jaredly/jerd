import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation } from '../typing/types';
import { addRecord } from './Library';
import {
    customMatchers,
    errorSerilaizer,
    newContext,
    parseExpression,
    rawSnapshotSerializer,
    showTermErrors,
    termToString,
    warningsSerializer,
} from './test-utils';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

describe('typeUnary', () => {
    it(`missing`, () => {
        const ctx = newContext();
        let res = parseExpression(ctx, `-5`, [preset.string]);
        expect(res.is).toEqualType(preset.string, ctx);
        expect(showTermErrors(ctx, res)).toMatchInlineSnapshot(
            `NOTFOND(-) at 1:1-1:3`,
        );
        res = parseExpression(ctx, `-5`);
        expect(res.is).toEqualType(preset.void_, ctx);
    });

    it(`let's try something simple`, () => {
        const ctx = newContext();
        ctx.builtins.ops.unary['-'] = [
            {
                input: preset.int,
                output: preset.int,
            },
            {
                input: preset.float,
                output: preset.float,
            },
        ];

        let res = parseExpression(ctx, `-5`);
        expect(res.is).toEqualType(preset.int, ctx);
        res = parseExpression(ctx, `-5.0`);
        expect(res.is).toEqualType(preset.float, ctx);
        // with expected
        res = parseExpression(ctx, `-5`, [preset.float]);
        expect(res.is).toEqualType(preset.float, ctx);
        res = parseExpression(ctx, `-5`, [preset.string]);
        expect(res.is).toEqualType(preset.string, ctx);
    });
});
