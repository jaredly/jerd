import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation } from '../typing/types';
import { addDecorator, addRecord } from './Library';
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

// ugh ok so I have somewhat less energy for making the decorated business
// really robust.

describe('typeDecorated', () => {
    it(`select based on target type`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addDecorator(
            ctx.library,
            preset.decoratorDef([], preset.float),
            'slider',
        );

        let id2;
        [ctx.library, id2] = addDecorator(
            ctx.library,
            preset.decoratorDef([], preset.string),
            'slider',
        );

        let res = parseExpression(ctx, `(@slider "hi")`);
        expect(ctx.warnings).toEqual([]);
        expect(termToString(ctx, res)).toEqual(`(@slider#${idName(id2)} "hi")`);
        expect(res).toNotHaveErrors(ctx);

        res = parseExpression(ctx, `(@slider 1.1)`);
        expect(ctx.warnings).toEqual([]);
        expect(termToString(ctx, res)).toEqual(`(@slider#${idName(id)} 1.1)`);
        expect(res).toNotHaveErrors(ctx);
    });

    it(`let's try something simple potato`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addDecorator(
            ctx.library,
            preset.decoratorDef([
                {
                    argName: 'min',
                    type: preset.int,
                    argLocation: nullLocation,
                    location: nullLocation,
                },
                {
                    argName: 'max',
                    type: preset.float,
                    argLocation: nullLocation,
                    location: nullLocation,
                },
            ]),
            'slider',
        );

        let res = parseExpression(ctx, `(@slider(2, 3.0) "yes")`);
        expect(ctx.warnings).toEqual([]);
        expect(termToString(ctx, res)).toEqual(
            `(@slider#${idName(id)}(min: 2, max: 3.0) "yes")`,
        );
        expect(res).toNotHaveErrors(ctx);

        res = parseExpression(ctx, `(@slider(3.0) "yes")`);
        expect(ctx.warnings).toEqual([]);
        expect(termToString(ctx, res)).toEqual(
            `(@slider#${idName(id)}(min: 3.0, max: _) "yes")`,
        );
        expect(showTermErrors(ctx, res)).toEqual(`\
Expected int#builtin, found float#builtin : 3.0 at 1:2-1:14
[Hole] at 1:2-1:20`);
    });
});
