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
        );
    });
    it(`why isnt as working`, () => {
        // const text = fs.readFileSync(path.join(base, name), 'utf8');
        const text = `

const one = (a: float) => a + 4.0;
const one = (a: int) => a + 2;

// one(2) as float + one(3.0) == 11.0
// one(2.0);
one(1);

// const x: int = 1;
// x as float
        `;
        let exprs;
        [ctx.library, exprs] = typeFile(ctx, parseTyped(text));
        exprs.forEach((expr) => {
            expect(expr).toNotHaveErrors(ctx);
        });
    });
    // const base = path.join(__dirname, '../../examples');
    // fs.readdirSync(base).forEach((name) => {
    //     if (skip.includes(name) || !name.endsWith('.jd')) {
    //         return;
    //     }
    //     it(`examples/${name}`, () => {
    //         const text = fs.readFileSync(path.join(base, name), 'utf8');
    //         let exprs;
    //         [ctx.library, exprs] = typeFile(ctx, parseTyped(text));
    //         exprs.forEach((expr) => {
    //             expect(expr).toNotHaveErrors(ctx);
    //         });
    //     });
    // });
});
