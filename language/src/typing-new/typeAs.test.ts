import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation } from '../typing/types';
import { addRecord, addTerm } from './Library';
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

describe('typeTemplateString', () => {
    it(`basic`, () => {
        const ctx = newContext();
        ctx.builtins.terms['floatToInt'] = preset.pureFunction(
            [preset.float],
            preset.int,
        );
        let id;
        [ctx.library, [id]] = parseToplevels(ctx, `const as = floatToInt`);

        // hermmm
        // so float -> int -> float, easy money
        // float -> string, int -> string, bool -> string, definitely want
        // what about string as int? no dice.
        // parseInt might give you NaN
        // hrmmm
        // and here we have the optional again.
        let res = parseExpression(ctx, `1.0 as int`);
        expect(res.is).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(`as#${idName(id)}(1.0)`);
    });

    it('user-defined', () => {
        const ctx = newContext();

        let id;
        [ctx.library, [id]] = parseToplevels(
            ctx,
            `const as = (v: string): int => 3;`,
        );

        let res = parseExpression(ctx, `"hello" as int`);
        expect(res.is).toEqualType(preset.int, ctx);
        expect(termToString(ctx, res)).toEqual(`as#${idName(id)}(v: "hello")`);
    });
});
