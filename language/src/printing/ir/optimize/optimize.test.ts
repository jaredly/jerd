import { parse } from '../../../parsing/grammar';
import { nullLocation, Toplevel } from '../../../parsing/parser';
import { hashObject, idName, withoutLocs } from '../../../typing/env';
import { presetEnv } from '../../../typing/preset';
import { typeFile } from '../../../typing/typeFile';
import { Env, Id, Term } from '../../../typing/types';
import { assembleItemsForFile } from '../../glslPrinter';
import { Expr, OutputOptions } from '../types';
import { Exprs, removeUnusedVariables } from './optimize';

const fixtures: { [key: string]: [string, string] } = {
    basic: [
        `{
        const x = 10;
        const y = 5;
        y + 2
    }`,
        `{
        const y = 5;
        y + 2
    }`,
    ],
};

const processTerm = (
    name: string,
    raw: string,
    initialEnv: Env,
    optimization: (
        senv: Env,
        irOpts: OutputOptions,
        irTerms: Exprs,
        irTerm: Expr,
        id: Id,
    ) => Expr = (_1, _2, _3, expr, _5) => expr,
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

describe('removeUnusedVariable', () => {
    Object.keys(fixtures).forEach((key) => {
        it(key, () => {
            const first = processTerm(
                key,
                fixtures[key][0],
                initialEnv,
                (env, opts, exprs, expr, id) =>
                    removeUnusedVariables(env, expr),
            );
            const expected = processTerm(key, fixtures[key][1], initialEnv);
            first.inOrder.forEach((id, i) => {
                expect(withoutLocs(first.irTerms[id].expr)).toEqual(
                    withoutLocs(expected.irTerms[expected.inOrder[i]].expr),
                );
            });
            // expect(withoutLocations(first)).toEqual(withoutLocations(expected));
        });
    });
});
