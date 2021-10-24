import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { LambdaType, nullLocation } from '../typing/types';
import { addEffect, addEnum, addRecord, addTerm } from './Library';
import {
    customMatchers,
    errorSerilaizer,
    fakeOp,
    newContext,
    parseExpression,
    rawSnapshotSerializer,
    showTermErrors,
    showTypeErrors,
    termToString,
    warningsSerializer,
} from './test-utils';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

describe('typeSwitch', () => {
    it('should work', () => {
        const ctx = newContext();

        const res = parseExpression(
            ctx,
            `switch 10 {
			0 => true,
			1 => false,
			10 => true,
			_ => false
		}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `switch 10 {0 => true, 1 => false, 10 => true, _ => false}`,
        );
        expect(res.is).toEqualType(preset.bool, ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it('should insert catchall if not exhaustive', () => {
        const ctx = newContext();

        const res = parseExpression(
            ctx,
            `switch 10 {
			0 => true,
			1 => false,
			10 => true,
		}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `switch 10 {0 => true, 1 => false, 10 => true, _ => _}`,
        );
        expect(res.is).toEqualType(preset.bool, ctx);
        expect(showTermErrors(ctx, res)).toEqual(`[Hole] at 1:1-5:4`);
    });

    it('basic stuff', () => {
        const ctx = newContext();
        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.string]),
            'HasName',
            ['name'],
        );
        let id2;
        [ctx.library, id2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int, preset.float], [preset.refType(id)]),
            'Person',
            ['age', 'money'],
        );

        let enu;
        [ctx.library, enu] = addEnum(
            ctx.library,
            preset.enumDefn([preset.refType(id2)]),
            'Enum',
        );

        let res = parseExpression(
            ctx,
            `(m: Enum) => switch m {
				Person{age} => age,
			}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `(m#:1: Enum#${idName(
                enu,
            )}): int#builtin ={}> switch m#:1 {Person#${idName(
                id2,
            )}{age#:2} => age#:2}`,
        );
        // expect(res.is).toEqualType(preset.bool, ctx);
        expect(res).toNotHaveErrors(ctx);

        res = parseExpression(
            ctx,
            `(m: Enum) => switch m {
				Person{age: 10} => 20,
			}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `(m#:3: Enum#${idName(
                enu,
            )}): int#builtin ={}> switch m#:3 {Person#${idName(
                id2,
            )}{age: 10} => 20, _ => _}`,
        );
        expect(showTermErrors(ctx, res)).toMatchInlineSnapshot(
            `[Hole] at 1:14-3:5`,
        );
    });

    // TODO TODO: test array, tuple, exhaustiveness stuff.
});
