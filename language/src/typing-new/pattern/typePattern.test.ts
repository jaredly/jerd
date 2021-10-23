import { parseTyped } from '../../parsing/parser-new';
import { idFromName, idName } from '../../typing/env';
import * as preset from '../../typing/preset';
import { patternIs } from '../../typing/typePattern';
import { Pattern, Type } from '../../typing/types';
import { Context, ValueBinding } from '../Context';
import { addEnum, addRecord } from '../Library';
import {
    customMatchers,
    errorSerilaizer,
    findPatternErrors,
    newContext,
    parseExpression,
    parseToplevels,
    patternErrorToString,
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

        let res = parsePattern(ctx, `10`, [], preset.int);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`10`);
        expect(patternIs(res, preset.int)).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrorsP(ctx);

        res = parsePattern(ctx, `10.1`, [], preset.float);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`10.1`);
        expect(patternIs(res, preset.float)).toEqualType(preset.float, ctx);
        expect(res).toNotHaveErrorsP(ctx);

        const bindings: Array<ValueBinding> = [];
        res = parsePattern(ctx, `"yes" as what`, bindings, preset.string);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`"yes" as what#:1`);
        expect(bindings.map((b) => b.sym)).toEqual([
            { unique: 1, name: 'what' },
        ]);
        expect(patternIs(res, preset.string)).toEqualType(preset.string, ctx);
        expect(res).toNotHaveErrorsP(ctx);
    });
});

describe('record', () => {
    it('basic record I think', () => {
        const ctx = newContext();
        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int, preset.float]),
            'Hello',
            ['what', 'thing'],
        );

        let res = parsePattern(ctx, `Hello{what: 10}`, [], preset.refType(id));
        expect(ctx.warnings).toHaveLength(0);
        expect(res).toNotHaveErrorsP(ctx);
        expect(patternToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{what: 10}`,
        );

        // We should have good type checing
        res = parsePattern(ctx, `Hello{what: 10.0}`, [], preset.refType(id));
        expect(ctx.warnings).toHaveLength(0);
        expect(showPatternErrors(ctx, res)).toEqual(
            `Expected int#builtin, found float#builtin : 10.0 1:19-1:23`,
        );
        expect(patternToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{what: 10.0}`,
        );

        const bindings: Array<ValueBinding> = [];
        // What if .. um .. idk
        res = parsePattern(
            ctx,
            `Hello{what: 10, thing#:3}`,
            bindings,
            preset.int,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(showPatternErrors(ctx, res)).toMatchInlineSnapshot(`""`);
        expect(patternToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{what: 10, thing#:3}`,
        );
        expect(bindings.map((m) => m.sym)).toEqual([
            { unique: 3, name: 'thing' },
        ]);
    });

    it('missing record', () => {
        const ctx = newContext();
        let res = parsePattern(
            ctx,
            `Hello{what: 10}`,
            [],
            preset.refType(idFromName('what')),
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(showPatternErrors(ctx, res)).toMatchInlineSnapshot(`
            ErrorRecordPattern: Hello{what: 10} 1:7-1:22
            PNotFound: Hello 1:7-1:22
            Expected void#builtin, found int#builtin : 10 1:19-1:21
        `);
        expect(patternToString(ctx, res)).toEqual(`Hello{what: 10}`);
    });
});

describe('tuple', () => {
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
});

describe('array', () => {
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

    it('multiple spreads are an error', () => {
        const ctx = newContext();
        const t = preset.builtinType('Array', [preset.int]);

        let res = parsePattern(ctx, '[a, ...a, ...b, c]', [], t);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(
            `[a#:1, ...a#:2, ...b#:3, c#:4]`,
        );
        expect(showPatternErrors(ctx, res)).toEqual(
            `DuplicateSpread: ...b#:3 1:17-1:21`,
        );
    });

    it('spreading a non-array is an error', () => {
        const ctx = newContext();
        const t = preset.builtinType('Array', [preset.int]);

        let res = parsePattern(ctx, '[a, ...3, c]', [], t);
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toEqual(`[a#:1, ...3, c#:2]`);
        expect(showPatternErrors(ctx, res)).toEqual(
            `Expected Array#builtin<int#builtin>, found int#builtin : 3 1:14-1:15`,
        );
    });

    it('enum + record subtypes', () => {
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

        let res = parsePattern(
            ctx,
            'Person{name: "what", age}',
            [],
            preset.refType(enu),
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(patternToString(ctx, res)).toMatchInlineSnapshot(
            `Person#d0ee8d78{name: "what", age#:1}`,
        );
        expect(res).toNotHaveErrorsP(ctx);
    });
});

const showPatternErrors = (ctx: Context, pattern: Pattern) => {
    return findPatternErrors(pattern)
        .map((p) => patternErrorToString(ctx, p))
        .join('\n');
};
