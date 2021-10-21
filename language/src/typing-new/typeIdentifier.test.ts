import { Location } from '../parsing/parser-new';
import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation, Symbol } from '../typing/types';
import { addTerm } from './Library';
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
        [ctx.library, id] = addTerm(
            ctx.library,
            preset.intLiteral(10, nullLocation),
            'what',
        );

        const res = parseExpression(ctx, `what`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#${idName(id)}`);
    });

    it('should work with a binding', () => {
        const ctx = newContext();
        const sym: Symbol = { name: 'what', unique: 1 };
        ctx.bindings.values.push({
            sym,
            location: nullLocation as Location,
            type: preset.int,
        });

        const res = parseExpression(ctx, `what`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#:1`);
    });

    it('binding should win over global defn', () => {
        const ctx = newContext();
        const sym: Symbol = { name: 'what', unique: 1 };
        ctx.bindings.values.push({
            sym,
            location: nullLocation as Location,
            type: preset.int,
        });

        let id;
        [ctx.library, id] = addTerm(
            ctx.library,
            preset.intLiteral(10, nullLocation),
            'what',
        );

        const res = parseExpression(ctx, `what`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#:1`);
    });

    it('fallback to global defn if the type is wrong', () => {
        const ctx = newContext();
        const sym: Symbol = { name: 'what', unique: 1 };
        ctx.bindings.values.push({
            sym,
            location: nullLocation as Location,
            type: preset.string,
        });

        let id;
        [ctx.library, id] = addTerm(
            ctx.library,
            preset.intLiteral(10, nullLocation),
            'what',
        );

        const res = parseExpression(ctx, `what`, [preset.int]);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#${idName(id)}`);
    });

    it('ignore binding of the wrong name', () => {
        const ctx = newContext();
        const sym: Symbol = { name: 'other', unique: 1 };
        ctx.bindings.values.push({
            sym,
            location: nullLocation as Location,
            type: preset.int,
        });

        let id;
        [ctx.library, id] = addTerm(
            ctx.library,
            preset.intLiteral(10, nullLocation),
            'what',
        );

        const res = parseExpression(ctx, `what`, [preset.int]);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#${idName(id)}`);
    });

    it('should work with ID resolution', () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addTerm(
            ctx.library,
            preset.intLiteral(10, nullLocation),
            'what',
        );

        const res = parseExpression(ctx, `what#${idName(id)}`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#${idName(id)}`);
    });

    it('should recover from invalid ID', () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addTerm(
            ctx.library,
            preset.intLiteral(10, nullLocation),
            'what',
        );

        const res = parseExpression(ctx, `what#abdefg`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:1-1:12: Unable to resolve term hash #abdefg`,
        );
        expect(termToString(ctx, res)).toEqual(`what#${idName(id)}`);
    });

    it('should recover from invalid type', () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addTerm(
            ctx.library,
            preset.intLiteral(10, nullLocation),
            'what',
        );

        const res = parseExpression(ctx, `what`, [preset.string]);
        expect(showTermErrors(ctx, res!)).toMatchInlineSnapshot(
            `Expected string#builtin, found int#builtin : what#6e9352f2 at 1:1-1:5`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#${idName(id)}`);
    });

    it('should work with a builtin', () => {
        const ctx = newContext();
        ctx.builtins.terms['what'] = preset.int;

        const res = parseExpression(ctx, `what`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#builtin`);
        expect(res.is).toEqualType(preset.int, ctx);
    });

    it('should work with an explicit builtin', () => {
        const ctx = newContext();
        ctx.builtins.terms['what'] = preset.int;

        let id;
        [ctx.library, id] = addTerm(
            ctx.library,
            preset.intLiteral(10, nullLocation),
            'what',
        );

        const res = parseExpression(ctx, `what#builtin`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`what#builtin`);
        expect(res.is).toEqualType(preset.int, ctx);
    });

    describe('failure', () => {
        it('should give a NotFound', () => {
            const ctx = newContext();
            const res = parseExpression(ctx, `what`);
            expect(ctx.warnings).toHaveLength(0);
            expect(showTermErrors(ctx, res!)).toMatchInlineSnapshot(
                `NOTFOND(what) at 1:1-1:5`,
            );
            expect(termToString(ctx, res)).toMatchInlineSnapshot(
                `NOTFOND(what)`,
            );
        });
    });
});
