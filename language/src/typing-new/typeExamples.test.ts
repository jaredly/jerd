import fs from 'fs';
import path from 'path';
import {
    Decorated,
    DecoratedToplevel,
    parseTyped,
} from '../parsing/parser-new';
import { typeDecoratedToplevel, typeFile, typeToplevel } from './typeFile';
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
import { errorTracker, errorVisitor } from './Library';
import { transformToplevelT } from '../typing/auto-transform';
import { showLocation } from '../typing/typeExpr';
import { printToString } from '../printing/printer';
import { toplevelToPretty } from '../printing/printTsLike';
import { ctxToEnv } from './migrate';
import { Term } from '../typing/types';

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

    let preludeCtx: Context;
    beforeAll(() => {
        preludeCtx = ctxWithPrelude();
    });

    const base = path.join(__dirname, '../../examples');
    fs.readdirSync(base).forEach((name) => {
        if (skip.includes(name) || !name.endsWith('.jd')) {
            return;
        }
        it(`examples/${name}`, () => {
            const ctx = newContext();
            ctx.library = preludeCtx.library;
            ctx.builtins = preludeCtx.builtins;
            const text = fs.readFileSync(path.join(base, name), 'utf8');
            // let exprs;
            const parsed = parseTyped(text);
            if (!parsed.tops) {
                return; // nothing to type folks
            }

            parsed.tops.items.forEach((top) => {
                if (
                    top.decorators.length === 1 &&
                    top.decorators[0].id.text === 'typeError'
                ) {
                    const res = typeToplevel(ctx, top.top);
                    const tracker = errorTracker();
                    transformToplevelT(res, errorVisitor(tracker), null);
                    const errs =
                        tracker.types.length +
                        tracker.terms.length +
                        tracker.patterns.length;
                    if (errs === 0) {
                        expect('No errors?').toEqual(
                            printToString(
                                toplevelToPretty(ctxToEnv(ctx), res),
                                100,
                            ) +
                                ' at ' +
                                showLocation(top.location),
                        );
                    }
                } else {
                    let res;
                    [ctx.library, res] = typeDecoratedToplevel(ctx, top);
                    if (res.type === 'expr') {
                        expect(res.expr).toNotHaveErrors(ctx);
                    }
                }
            });
        });
    });
});
