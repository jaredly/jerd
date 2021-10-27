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

const ctxWithPrelude = () => {
    const ctx = newContext();
    ctx.builtins = defaultBuiltins();
    [ctx.library] = typeFile(
        ctx,
        parseTyped(`
        const as = intToString;
        const as = intToFloat;
        const as = floatToInt;
        const as = floatToString;
        type As<From, To> = {
            as: (From) => To,
        }
        `),
    );

    [ctx.library] = typeFile(ctx, parseTyped(preludeRaw));
    return ctx;
};

const skip = ['type-errors.jd'];
describe('all the examples?', () => {
    // it(`should type the prelude`, () => {
    //     const ctx: Context = ctxWithPrelude();
    // });

    let ctx: Context;
    beforeAll(() => {
        ctx = ctxWithPrelude();
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
