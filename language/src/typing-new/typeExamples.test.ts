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

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

const skip = ['type-errors.jd'];

describe('all the examples?', () => {
    const base = path.join(__dirname, '../../examples');
    fs.readdirSync(base).forEach((name) => {
        if (skip.includes(name) || !name.endsWith('.jd')) {
            return;
        }
        it(`examples/${name}`, () => {
            const text = fs.readFileSync(path.join(base, name), 'utf8');
            const ctx = newContext();
            let exprs;
            [ctx.library, exprs] = typeFile(ctx, parseTyped(text));
            exprs.forEach((expr) => {
                expect(expr).toNotHaveErrors(ctx);
            });
        });
    });
});
