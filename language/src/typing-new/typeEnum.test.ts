import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation } from '../typing/types';
import { addEnum, addRecord } from './Library';
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

describe('typeRecord', () => {
    it(`type arguments`, () => {
        const ctx = newContext();

        const sym = { name: 'T', unique: 0 };
        let some;
        [ctx.library, some] = addRecord(
            ctx.library,
            preset.recordDefn(
                [preset.varType(sym)],
                void 0,
                [{ location: nullLocation, sym, subTypes: [] }],
                void 0,
                0,
            ),
            'Some',
            ['contents'],
        );

        let both;
        [ctx.library, both] = addEnum(
            ctx.library,
            preset.enumDefn(
                [preset.refType(some, [preset.varType(sym)])],
                [{ location: nullLocation, sym, subTypes: [] }],
            ),
            'Both',
        );

        let res = parseExpression(ctx, `Both:Some<int>{_: 12}`);
        expect(termToString(ctx, res)).toEqual(
            `Both#${idName(both)}<[type hole]>:Some#${idName(
                some,
            )}<int#builtin>{contents#${idName(some)}#0: 12}`,
        );

        res = parseExpression(ctx, `Both<int>:Some<int>{_: 12}`);
        expect(termToString(ctx, res)).toEqual(
            `Both#${idName(both)}<int#builtin>:Some#${idName(
                some,
            )}<int#builtin>{contents#${idName(some)}#0: 12}`,
        );
    });

    it(`Enum inheritance, should be upgradeable`, () => {
        const ctx = newContext(`
		enum One {
			Two{},
		};
		enum Three {...One, Four{} };
		const one = One:Two;
		`);

        let res = parseExpression(ctx, `Three:one`);
        expect(res).toNotHaveErrors(ctx);
        res = parseExpression(ctx, `Three:Two`);
        expect(res).toNotHaveErrors(ctx);
    });

    it(`let's try something simple`, () => {
        const ctx = newContext();

        let red;
        [ctx.library, red] = addRecord(
            ctx.library,
            preset.recordDefn([], void 0, void 0, void 0, 0),
            'Red',
            [],
        );

        let green;
        [ctx.library, green] = addRecord(
            ctx.library,
            preset.recordDefn([], void 0, void 0, void 0, 1),
            'Green',
            [],
        );

        let blue;
        [ctx.library, blue] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int], void 0, void 0, void 0, 2),
            'Blue',
            ['age'],
        );

        let color;
        [ctx.library, color] = addEnum(
            ctx.library,
            preset.enumDefn([
                preset.userTypeReference(red),
                preset.userTypeReference(green),
            ]),
            'Color',
        );

        let res = parseExpression(ctx, `Color:Green`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `Color#${idName(color)}:Green#${idName(green)}`,
        );
        expect(res.is).toEqualType(preset.refType(color), ctx);
        expect(res).toNotHaveErrors(ctx);

        res = parseExpression(ctx, `Color#${idName(color)}:Green`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `Color#${idName(color)}:Green#${idName(green)}`,
        );
        expect(res.is).toEqualType(preset.refType(color), ctx);
        expect(res).toNotHaveErrors(ctx);

        res = parseExpression(ctx, `Color#123123:Green`);
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:1-1:19: Invalid enum id: #123123`,
        );
    });
});
