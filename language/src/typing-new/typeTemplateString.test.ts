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

        let res = parseExpression(ctx, `"hello"`);
        expect(res.is).toEqualType(preset.string, ctx);
        expect(res.type).toEqual('string');
    });

    it(`basic interp`, () => {
        const ctx = newContext();

        let res = parseExpression(ctx, '"hel${"what"}lo"');
        expect(res.is).toEqualType(preset.string, ctx);
        expect(res.type).toEqual('TemplateString');
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(`"hel\${"what"}lo"`);
    });

    it(`as interp`, () => {
        const ctx = newContext();
        let id;
        [ctx.library, [id]] = parseToplevels(
            ctx,
            `const as = (arg: int): string => "hi"`,
        );

        let res = parseExpression(ctx, `"he\${10}lo"`);
        expect(res.is).toEqualType(preset.string, ctx);
        expect(res.type).toEqual('TemplateString');
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(`"he\$#${idName(id)}{10}lo"`);
    });
});
