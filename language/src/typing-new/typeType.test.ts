import {
    Expression,
    parseTyped,
    WithUnary,
    WithUnary_inner,
    Location,
} from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import {
    nullLocation,
    Term,
    Type,
    TypeError,
    ErrorTerm,
    Symbol,
    Id,
} from '../typing/types';
import * as preset from '../typing/preset';
import { GroupedOp, reGroupOps } from './ops';
import { Context, ctxToEnv, NamedDefns } from './typeFile';
import { typeExpression } from './typeExpression';
import { addEffect, addRecord, addTerm } from './Library';
import { printToString } from '../printing/printer';
import { termToPretty } from '../printing/printTsLike';
import { showLocation } from '../typing/typeExpr';
import { transformTerm } from '../typing/auto-transform';
import { showType } from '../typing/unify';
import {
    customMatchers,
    errorTypeSerilaizer,
    findErrors,
    findTypeErrors,
    newContext,
    rawSnapshotSerializer,
    typeToString,
} from './test-utils';
import { typeType } from './typeType';

export const parseType = (ctx: Context, text: string) => {
    ctx.bindings.unique.current = 0;
    const parsed = parseTyped(`const x: ${text} = 1`);
    const top = parsed.tops!.items[0].top;
    if (top.type !== 'Define' || !top.ann) {
        throw new Error(`fundamental parser error on ${text}`);
    }
    return typeType(ctx, top.ann);
};
expect.extend(customMatchers);
expect.addSnapshotSerializer(errorTypeSerilaizer);
expect.addSnapshotSerializer(rawSnapshotSerializer);

describe('typeType', () => {
    it('should work with a builtin', () => {
        const ctx = newContext();
        ctx.builtins.types['int'] = 0;
        const res = parseType(ctx, 'int');
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(`int#builtin`);
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);
    });

    it('should work with a tuple of builtins', () => {
        const ctx = newContext();
        ctx.builtins.types['int'] = 0;
        const res = parseType(ctx, '(int, int)');
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(`(int#builtin, int#builtin)`);
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);
    });

    it('should work with a global type', () => {
        const ctx = newContext();
        [ctx.library] = addRecord(ctx.library, preset.recordDefn([]), 'ok', []);
        const res = parseType(ctx, 'ok');
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(`ok#59f7c4d4`);
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);
        // Bad hash
        expect(typeToString(ctx, parseType(ctx, `ok#123123123`))).toEqual(
            printed,
        );
        expect(typeToString(ctx, parseType(ctx, `ok#:123`))).toEqual(printed);
    });

    it('should work with a type variable', () => {
        const ctx = newContext();
        ctx.bindings.types.push({
            location: nullLocation as Location,
            subTypes: [],
            sym: { unique: 1, name: 'ok' },
        });
        const res = parseType(ctx, 'ok');
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(`ok#:1`);
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);
        // Bad hash
        expect(typeToString(ctx, parseType(ctx, `ok#123123123`))).toEqual(
            printed,
        );
        expect(typeToString(ctx, parseType(ctx, `ok#:100`))).toEqual(printed);
    });

    const okVbl = preset.recordDefn(
        [],
        [],
        [
            {
                subTypes: [],
                unique: 10,
                location: nullLocation,
            },
        ],
    );

    it('should work with a global type with type vbls', () => {
        const ctx = newContext();
        ctx.builtins.types['int'] = 0;
        [ctx.library] = addRecord(ctx.library, okVbl, 'ok', []);
        const res = parseType(ctx, 'ok<int>');
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(`ok#fe7af268<int#builtin>`);
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);
    });

    const okSub = (sub: Id) =>
        preset.recordDefn(
            [],
            [],
            [
                {
                    subTypes: [sub],
                    unique: 10,
                    location: nullLocation,
                },
                {
                    subTypes: [sub],
                    unique: 20,
                    location: nullLocation,
                },
            ],
        );

    it('should work with a global type with type vbls and subTypes', () => {
        const ctx = newContext();
        ctx.builtins.types['int'] = 0;
        let base;
        [ctx.library, base] = addRecord(
            ctx.library,
            preset.recordDefn([]),
            'base',
            [],
        );
        [ctx.library] = addRecord(
            ctx.library,
            preset.recordDefn([], [base]),
            'base2',
            [],
        );
        [ctx.library] = addRecord(ctx.library, okSub(base), 'ok', []);
        const res = parseType(ctx, 'ok<base, base2>');
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(
            `ok#c4cc162c<base#59f7c4d4, base2#a836f2e4>`,
        );
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);

        expect(showTypeErrors(ctx, parseType(ctx, `ok<() => int, int>`)))
            .toMatchInlineSnapshot(`
            [not a subtype: () ={}> int#builtin of (base#59f7c4d4) at 1:13-1:22
            [not a subtype: int#builtin of (base#59f7c4d4) at 1:24-1:27
        `);
    });

    it('should work for a lambda', () => {
        const ctx = newContext();
        ctx.builtins.types['int'] = 0;
        [ctx.library] = addRecord(ctx.library, okVbl, 'ok', []);
        const res = parseType(
            ctx,
            '(what: int, who: int, when: ok<int>) => int',
        );
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(
            `(what: int#builtin, who: int#builtin, when: ok#fe7af268<int#builtin>) ={}> int#builtin`,
        );
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);
    });

    it('should work for a lambda with generics', () => {
        const ctx = newContext();
        ctx.builtins.types['int'] = 0;
        [ctx.library] = addRecord(ctx.library, okVbl, 'ok', []);
        const res = parseType(
            ctx,
            '<A, B>(what: A, who: int, when: ok<B>) => B',
        );
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(
            `<A#:0, B#:1>(what: A#:0, who: int#builtin, when: ok#fe7af268<B#:1>) ={}> B#:1`,
        );
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);
    });

    it('should work for a lambda with generics and bounds and effects', () => {
        const ctx = newContext();
        [ctx.library] = addEffect(
            ctx.library,
            {
                constrs: [],
                location: nullLocation,
                type: 'EffectDef',
            },
            'Eff',
            [],
        );
        ctx.builtins.types['int'] = 0;
        [ctx.library] = addRecord(ctx.library, okVbl, 'ok', []);
        let base1;
        [ctx.library, base1] = addRecord(
            ctx.library,
            preset.recordDefn([]),
            'Base1',
            [],
        );
        [ctx.library] = addRecord(
            ctx.library,
            preset.recordDefn([], [base1]),
            'Base2',
            [],
        );
        const res = parseType(
            ctx,
            '<A: Base1, B>{e}(what: A, who: () ={e}> int, when: ok<B>) ={e, Eff}> B',
        );
        const printed = typeToString(ctx, res);
        expect(printed).toMatchInlineSnapshot(`
            <A#:0: Base1#59f7c4d4, B#:1>{e#:2}(
                what: A#:0,
                who: () ={e#:2}> int#builtin,
                when: ok#fe7af268<B#:1>,
            ) ={e#:2, Eff#20bf83b4}> B#:1
        `);
        expect(res).toNotHaveErrorsT(ctx);
        expect(typeToString(ctx, parseType(ctx, printed))).toEqual(printed);
    });

    // START HERE:
    // Also add some more failure modes, like if the effect cant be found.
    // Which currently will just swallow it unfortunately.

    describe('failures', () => {
        it('not enough vbls provided', () => {
            const ctx = newContext();
            ctx.builtins.types['int'] = 0;
            [ctx.library] = addRecord(ctx.library, okVbl, 'ok', []);
            const res = parseType(ctx, 'ok');
            const printed = typeToString(ctx, res);
            expect(printed).toMatchInlineSnapshot(`ok#fe7af268<[type hole]>`);
            expect(showTypeErrors(ctx, res)).toMatchInlineSnapshot(
                `[type hole] at 1:10-1:12`,
            );
        });

        it('too many vbls provided', () => {
            const ctx = newContext();
            ctx.builtins.types['int'] = 0;
            [ctx.library] = addRecord(ctx.library, okVbl, 'ok', []);
            const res = parseType(ctx, 'ok<int, int>');
            const printed = typeToString(ctx, res);
            expect(printed).toMatchInlineSnapshot(
                `[extra vbls ok#fe7af268<int#builtin> (int#builtin)]`,
            );
            expect(showTypeErrors(ctx, res)).toMatchInlineSnapshot(
                `[extra vbls ok#fe7af268<int#builtin> (int#builtin)] at 1:10-1:22`,
            );
        });

        it('basic missing id', () => {
            const ctx = newContext();
            const res = parseType(ctx, 'int');
            expect(typeToString(ctx, res)).toMatchInlineSnapshot(
                `[Not Found: int]`,
            );
            expect(showTypeErrors(ctx, res)).toMatchInlineSnapshot(
                `[Not Found: int] at 1:10-1:13`,
            );
        });
    });
});

export const showTypeErrors = (ctx: Context, res: Type) => {
    return findTypeErrors(res)
        .map(
            (err) =>
                `${showType(ctxToEnv(ctx), err)} at ${showLocation(
                    err.location,
                )}`,
        )
        .join('\n');
};
