import fs from 'fs';
import path from 'path';
import { parseTyped } from '../parsing/parser-new';
import { typeFile } from './typeFile';
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
import { defaultBuiltins } from './builtins';
import { Context } from './Context';
import { preludeRaw } from '../printing/loadPrelude';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

const skip = ['type-errors.jd'];
describe('all the examples?', () => {
    let ctx: Context;
    beforeAll(() => {
        ctx = newContext();
        ctx.builtins = defaultBuiltins();
        [ctx.library] = typeFile(
            ctx,
            parseTyped(`
        const as = intToString;
        const as = intToFloat;
        const as = floatToInt;
        const as = floatToString;

        `),
            // ${preludeRaw}
        );
    });
    it(`why isnt as working`, () => {
        // const text = fs.readFileSync(path.join(base, name), 'utf8');
        const text = `
type Eq<T> = {
    "==": (T, T) => bool,
}

                const rec arrayEq: <T,>(Array<T>, Array<T>, Eq<T>) => bool
                = <T,>(one: Array<T>, two: Array<T>, eq: Eq<T>): bool => {
                    switch (one, two) {
                        ([], []) => true,
                        ([one, ...rone], [two, ...rtwo]) => if eq."=="(one, two) {
                            arrayEq<T>(rone, rtwo, eq)
                        } else {
                            false
                        },
                        _ => false
                    }
                };
                arrayEq
            `;
        let exprs;
        [ctx.library, exprs] = typeFile(ctx, parseTyped(text));
        exprs.forEach((expr) => {
            expect(expr).toNotHaveErrors(ctx);
        });
    });

    const base = path.join(__dirname, '../../examples');
    fs.readdirSync(base).forEach((name) => {
        if (skip.includes(name) || !name.endsWith('.jd')) {
            return;
        }
        it.skip(`examples/${name}`, () => {
            const text = fs.readFileSync(path.join(base, name), 'utf8');
            let exprs;
            [ctx.library, exprs] = typeFile(ctx, parseTyped(text));
            exprs.forEach((expr) => {
                expect(expr).toNotHaveErrors(ctx);
            });
        });
    });
});
