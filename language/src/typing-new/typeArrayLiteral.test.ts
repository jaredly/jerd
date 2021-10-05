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
import { ctxToEnv } from './migrate';
import { Context, NamedDefns } from './Context';
import { typeExpression } from './typeExpression';
import { addRecord, addTerm } from './Library';
import { printToString } from '../printing/printer';
import { termToPretty } from '../printing/printTsLike';
import { showLocation } from '../typing/typeExpr';
import { transformTerm } from '../typing/auto-transform';
import { showType } from '../typing/unify';
import {
    customMatchers,
    errorSerilaizer,
    findErrors,
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

describe('typeArrayLiteral', () => {
    it('should work', () => {
        const ctx = newContext();

        const res = parseExpression(ctx, `[1, 2, 3]`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<int#builtin>[1, 2, 3]`,
        );
    });

    it('should work with float', () => {
        const ctx = newContext();

        const res = parseExpression(ctx, `[1.0, 2, 3]`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<float#builtin>[1.0, 2.0, 3.0]`,
        );
    });

    it('should work with float', () => {
        const ctx = newContext();
        ctx.builtins.types.float = 0;

        const res = parseExpression(ctx, `<float>[1, 2, 3]`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<float#builtin>[1.0, 2.0, 3.0]`,
        );
    });

    it('should spread', () => {
        const ctx = newContext();
        const res = parseExpression(ctx, `[...[1], 2, 3]`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<int#builtin>[...<int#builtin>[1], 2, 3]`,
        );
    });

    it('should spread', () => {
        const ctx = newContext();
        const res = parseExpression(ctx, `[2, ...[1], 2, 3]`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<int#builtin>[2, ...<int#builtin>[1], 2, 3]`,
        );
    });

    it('should work empty', () => {
        const ctx = newContext();
        const res = parseExpression(ctx, `[]`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<void#builtin>[]`,
        );
    });

    it('should work empty', () => {
        const ctx = newContext();
        ctx.builtins.types.float = 0;
        const res = parseExpression(ctx, `[...<float>[]]`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<float#builtin>[...<float#builtin>[]]`,
        );
    });

    it('should work empty', () => {
        const ctx = newContext();
        ctx.builtins.types.float = 0;
        const res = parseExpression(ctx, `[[1], []]`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toMatchInlineSnapshot(
            `<Array#builtin<int#builtin>>[<int#builtin>[1], <int#builtin>[]]`,
        );
    });

    describe('failure', () => {
        it('should work empty', () => {
            const ctx = newContext();
            ctx.builtins.types.float = 0;
            const res = parseExpression(ctx, `[[1], 2]`);
            expect(ctx.warnings).toHaveLength(0);
            expect(showTermErrors(ctx, res!)).toMatchInlineSnapshot(
                `2 at 1:7-1:8`,
            );
            expect(termToString(ctx, res)).toMatchInlineSnapshot(
                `<Array#builtin<int#builtin>>[<int#builtin>[1], 2]`,
            );
        });

        it('cant spread non-array', () => {
            const ctx = newContext();
            ctx.builtins.types.float = 0;
            const res = parseExpression(ctx, `[...2]`);
            expect(ctx.warnings).toHaveLength(0);
            expect(showTermErrors(ctx, res!)).toMatchInlineSnapshot(
                `2 at 1:5-1:6`,
            );
            expect(termToString(ctx, res)).toMatchInlineSnapshot(
                `<void#builtin>[...2]`,
            );
        });
    });
});
