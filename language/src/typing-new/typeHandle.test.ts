import { Location } from '../parsing/parser-new';
import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation, Symbol } from '../typing/types';
import { addEffect, addTerm } from './Library';
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

describe('typeIdentifier', () => {
    it('should work', () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addEffect(
            ctx.library,
            preset.effectDef([{ args: [preset.int], ret: preset.float }]),
            'Effect',
            ['what'],
        );

        const res = parseExpression(
            ctx,
            `(f: () ={Effect}> int) => {
			handle! f {
				Effect.what((v) => k) => {
					v
				},
				pure(k) => 10
			}
		}`,
        );
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(`
(f#:1: () ={Effect#40a2b3fe}> int#builtin): int#builtin ={}> {
    handle! f#:1 {Effect.what#0((v#:3) => k#:2) => {
        v#:3;
    }, pure(k#:4) => 10};
}
`);
    });
});
