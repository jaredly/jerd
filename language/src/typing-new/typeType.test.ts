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
import { addRecord, addTerm } from './Library';
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

    // TODO: Now for type variable application!
    // And ... some other stuff!
    // like lambdas I guess.

    describe('failures', () => {
        it('basic missing id', () => {
            const ctx = newContext();
            const res = parseType(ctx, 'int');
            expect(typeToString(ctx, res)).toMatchInlineSnapshot(
                `[Not Found: int]`,
            );
            expect({
                ctx,
                errorTypes: findTypeErrors(res),
            }).toMatchInlineSnapshot(`[Not Found: int] at 1:10-1:13`);
        });
    });
});
