import { parseTyped } from '../parsing/parser-new';
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
import { typeFile } from './typeFile';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

describe('typeFile', () => {
    it(`expr`, () => {
        const ctx = newContext();
        let exprs;
        [ctx.library, exprs] = typeFile(ctx, parseTyped(`23`));
        expect(exprs).toHaveLength(1);
        expect(exprs[0].is).toEqualType(preset.int, ctx);
    });

    it(`defn`, () => {
        const ctx = newContext();
        let exprs, id;
        [ctx.library, exprs, [id]] = typeFile(
            ctx,
            parseTyped(`const x = 10\nx`),
        );
        expect(ctx.library.terms.names.x).toEqual([id]);
        if (exprs[0].type !== 'ref') {
            throw new Error('not a ref');
        }
        expect(exprs[0].ref).toEqual({ type: 'user', id: id });
    });

    it(`supercedes`, () => {
        const ctx = newContext();
        let exprs, id1, id2;
        [ctx.library, , [id1, id2]] = typeFile(
            ctx,
            parseTyped(
                `@createdAt(500)
				@deprecated(200) const x = 10;
				@basedOn(x)
				@supercedes#builtin(x) const x = 20`,
            ),
        );
        expect(ctx.library.terms.names.x).toEqual([id2, id1]);
        expect(ctx.library.terms.defns[idName(id2)].meta.supercedes).toEqual(
            id1,
        );
        expect(ctx.library.terms.defns[idName(id1)].meta.deprecated).toEqual(
            200,
        );
        expect(ctx.library.terms.defns[idName(id1)].meta.created).toEqual(500);
        let id3;
        [ctx.library, , [id3]] = typeFile(
            ctx,
            parseTyped(
                `
				@basedOn(what#${idName(id2)})
				const what = 2000`,
            ),
        );
        expect(ctx.library.terms.defns[idName(id3)].meta.basedOn).toEqual(id2);
    });

    it(`enum`, () => {
        const ctx = newContext();
        let id;
        [ctx.library, , [id]] = typeFile(
            ctx,
            parseTyped(`
			@unique#builtin(100.0)
			effect Stdio {
				Read: () => string,
				Write: (string) => void,
			}
			`),
        );
        expect(ctx.library.effects.names.Stdio).toEqual([id]);
        // TODO: support uniques for effects
        // expect(ctx.library.effects.defns[idName(id)].defn.unique).toEqual(100);
    });

    it(`decorator`, () => {
        const ctx = newContext();
        let id, expr;
        [ctx.library, [expr], [id]] = typeFile(
            ctx,
            parseTyped(`
			@unique#builtin(100)
			decorator Slider(min: int, max: int) float;
			(@Slider(10, 20) 45.0)
		`),
        );
        expect(ctx.library.decorators.defns[idName(id)].defn.unique).toEqual(
            100,
        );
        expect(termToString(ctx, expr)).toEqual(
            `(@Slider#${idName(id)}(min: 10, max: 20) 45.0)`,
        );
        expect(expr.decorators![0].name.id).toEqual(id);
    });

    // it(``);
});
