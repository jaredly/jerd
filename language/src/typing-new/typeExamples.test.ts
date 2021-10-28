import fs from 'fs';
import path from 'path';
import {
    Decorated,
    DecoratedToplevel,
    parseTyped,
} from '../parsing/parser-new';
import { typeFile, typeToplevel } from './typeFile';
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
        it(`examples/${name}`, () => {
            ctx.bindings.unique.current = 0;
            ctx.warnings = [];
            const text = fs.readFileSync(path.join(base, name), 'utf8');
            let exprs;
            const parsed = parseTyped(text);
            if (!parsed.tops) {
                return; // nothing to type folks
            }
            let shouldFail: Array<DecoratedToplevel> = [];
            parsed.tops!.items = parsed.tops!.items.filter((ok) => {
                if (
                    ok.decorators.length === 1 &&
                    ok.decorators[0].id.text === 'typeError'
                ) {
                    shouldFail.push(ok);
                    return false;
                }
                return true;
            });
            [ctx.library, exprs] = typeFile(ctx, parsed);
            expect(ctx.warnings).toEqual([]);
            exprs.forEach((expr) => {
                expect(expr).toNotHaveErrors(ctx);
            });
            shouldFail.forEach((top) => {
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
            });
        });
    });
});
