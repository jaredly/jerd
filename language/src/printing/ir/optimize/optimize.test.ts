import { parse } from '../../../parsing/grammar';
import { Toplevel } from '../../../parsing/parser';
import { hashObject, idName, withoutLocs } from '../../../typing/env';
import { presetEnv } from '../../../typing/preset';
import { typeFile } from '../../../typing/typeFile';
import { Env, nullLocation, Term } from '../../../typing/types';
import { assembleItemsForFile } from '../../glslPrinter';
import { reUnique } from '../../typeScriptPrinterSimple';
import { Expr, OutputOptions } from '../types';
import { Exprs, Optimizer, removeUnusedVariables } from './optimize';

const processTerm = (
    name: string,
    raw: string,
    initialEnv: Env,
    optimization: Optimizer = (_1, _2, _3, expr, _5) => expr,
): {
    inOrder: Array<string>;
    irTerms: Exprs;
} => {
    const parsed: Array<Toplevel> = parse(raw);
    let { expressions, env } = typeFile(parsed, initialEnv, name);
    if (expressions.length !== 1) {
        throw new Error(`Expect 1 expression`);
    }

    const expr: Term = expressions[0];
    const hash = hashObject(expr);
    const id = { hash, size: 1, pos: 0 };
    // console.log(hash);
    env.global.idNames[idName(id)] = 'main';
    env.global.terms[hash] = expr;

    return assembleItemsForFile(
        env,
        [
            {
                type: 'ref',
                ref: { type: 'user', id },
                location: nullLocation,
                is: expr.is,
            },
        ],
        [idName(id)],
        {},
        {},
        optimization,
    );
};

let initialEnv = presetEnv({});

const runFixture = (
    key: string,
    fixture: [string, string],
    optimize: Optimizer,
) => {
    const first = processTerm(key, fixture[0], initialEnv, optimize);
    const expected = processTerm(key, fixture[1], initialEnv);
    first.inOrder.forEach((id, i) => {
        expect(
            withoutLocs(reUnique({ current: 0 }, first.irTerms[id].expr)),
        ).toEqual(
            withoutLocs(
                reUnique(
                    { current: 0 },
                    expected.irTerms[expected.inOrder[i]].expr,
                ),
            ),
        );
    });
};

const testFixtures = (
    name: string,
    fixtures: { [key: string]: [string, string] },
    optimize: Optimizer,
) => {
    describe(name, () => {
        Object.keys(fixtures).forEach((key) => {
            it(key, () => {
                runFixture(key, fixtures[key], optimize);
            });
        });
    });
};

// STOPSHIP: reenable
// testFixtures(
//     'removeUnusedVariable',
//     {
//         basic: [
//             `{
//         const x = 10;
//         const y = 5;
//         y + 2
//     }`,
//             `{
//         const y = 5;
//         y + 2
//     }`,
//         ],
//         acrossLambda: [
//             `{
//             const x = 10;
//             const y = 11;
//             (y: int) => {
//                 const z = x;
//                 x + 2 + y
//             }
//         }`,
//             `{
//             const x = 10;
//             (y: int) => {
//                 x + 2 + y
//             }
//         }`,
//         ],
//     },
//     removeUnusedVariables,
// );
