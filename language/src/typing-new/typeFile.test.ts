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
        // expect(ctx.library.effects.defns[idName(id)].defn.unique).toEqual(100);
    });

    // it(``);
});
