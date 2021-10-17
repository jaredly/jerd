import * as preset from '../typing/preset';
import { addRecord, addTerm } from './Library';
import {
    customMatchers,
    errorSerilaizer,
    fakeOp,
    newContext,
    parseExpression,
    rawSnapshotSerializer,
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
        ctx.builtins.ops.binary['+'] = [[preset.int, preset.int]];

        // hmmm I kinda think I should have some builtin binops. How do I set that up?
        // like I don't have the wherewithall to say builtin.types.+ = 1 or something.
        // I guess I could just define some builtin ops ... builtins.ops = {'+': [[int, int]], '-': [[int], [float], [int, int], [float, float]]}}

        let slash; // const slash = idFromName('slash');
        [ctx.library, slash] = addRecord(
            ctx.library,
            preset.recordDefn([fakeIntOp.is]),
            'plus',
            ['+'],
        );

        [ctx.library] = addTerm(
            ctx.library,
            preset.recordLiteral(slash, [fakeIntOp]),
            'plus',
        );

        const res = parseExpression(
            ctx,
            `(a: int, b: int) => {
				a + b
			}`,
        );
        expect(termToString(ctx, res)).toMatchInlineSnapshot(`
(a#:1: int#builtin, b#:2: int#builtin): int#builtin ={}> {
    a#:1 +#a7b87324#d28f8708#0 b#:2;
}
`);
        expect(res).toNotHaveErrors(ctx);
    });
});
