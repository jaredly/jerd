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
                `Expected Array#builtin<int#builtin>, found int#builtin : 2 at 1:7-1:8`,
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
                `Expected Array#builtin<void#builtin>, found int#builtin : 2 at 1:5-1:6`,
            );
            expect(termToString(ctx, res)).toMatchInlineSnapshot(
                `<void#builtin>[...2]`,
            );
        });
    });
});
