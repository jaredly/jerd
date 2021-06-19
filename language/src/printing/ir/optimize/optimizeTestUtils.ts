import { parse } from '../../../parsing/grammar';
import { hashObject, idFromName, idName } from '../../../typing/env';
import { typeFile } from '../../../typing/typeFile';
import { Env, newWithGlobal, nullLocation, Term } from '../../../typing/types';
import { assembleItemsForFile, hasInvalidGLSL } from '../../glslPrinter';
import { debugExpr, debugType, idToDebug } from '../../irDebugPrinter';
import { loadInit } from '../../loadPrelude';
import { atom, items, printToString } from '../../printer';
import * as pp from '../../printer';
import { Exprs, Optimizer, Optimizer2, toOldOptimize } from './optimize';
import { presetEnv } from '../../../typing/preset';
import { uniquesReallyAreUnique } from '../analyze';
import { UniqueError } from '../../../typing/errors';
import { Expr } from '../types';

// const init = loadInit();
export const defaultEnv = presetEnv({});

export type Result = {
    env: Env;
    irTerms: Exprs;
    inOrder: Array<string>;
};

export const resultForExpr = (env: Env, expr: Expr): Result => {
    const hash = hashObject(expr);
    const result: Result = {
        env,
        irTerms: { [hash]: { expr, inline: false } },
        inOrder: [hash],
    };
    return result;
};

export const runOpt = (env: Env, expr: Expr, opt: Optimizer2) =>
    opt(
        {
            env,
            exprs: {},
            opts: {},
            optimize: opt,
            id: { hash: 'nope', size: 1, pos: 0 },
        },
        expr,
    );

export const expectValidGlsl = (result: Result) => {
    result.inOrder.forEach((id) => {
        uniquesReallyAreUnique(result.irTerms[id].expr);
        expect(hasInvalidGLSL(result.irTerms[id].expr)).toBeFalsy();
    });
    return result;
};

export const runFixture = (text: string, optimize: Optimizer2) => {
    const initialEnv = newWithGlobal(defaultEnv.global);
    let res;
    try {
        res = typeFile(parse(text), initialEnv, 'test-fixture');
    } catch (err) {
        throw new Error(err.toString());
    }
    const { env, expressions } = res;
    const mains: Array<Term> = expressions.map((expr, i) => {
        const hash = hashObject(expr);
        const id = { hash, size: 1, pos: 0 };
        env.global.idNames[idName(id)] = 'expr' + i;
        env.global.terms[hash] = expr;
        return {
            type: 'ref',
            ref: { type: 'user', id },
            location: nullLocation,
            is: expr.is,
        };
    });

    try {
        const { inOrder, irTerms } = assembleItemsForFile(
            env,
            mains,
            mains.map((main) => idName((main as any).ref.id)),
            {},
            {},
            toOldOptimize(optimize),
        );

        return { env, irTerms, inOrder };
    } catch (err) {
        if (err instanceof UniqueError) {
            console.log(printToString(debugExpr(env, err.expr), 100));
        }
        throw err;
    }
};

export const snapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && value.env && value.irTerms && value.inOrder != null;
    },
    print(value, _, indent) {
        const { env, inOrder, irTerms } = value as {
            env: Env;
            inOrder: Array<string>;
            irTerms: Exprs;
        };
        const extraIdNames: { [id: string]: string } = {};
        inOrder.forEach((id) => {
            if (irTerms[id].source) {
                extraIdNames[id] = `${
                    env.global.idNames[idName(irTerms[id].source!.id)]
                }_${irTerms[id].source!.kind}`;
            }
        });
        const envWithNames = {
            ...env,
            global: {
                ...env.global,
                idNames: { ...env.global.idNames, ...extraIdNames },
            },
        };
        return inOrder
            .map((id) =>
                printToString(
                    items([
                        atom('const '),
                        idToDebug(envWithNames, idFromName(id), false),
                        atom(': '),
                        debugType(envWithNames, irTerms[id].expr.is),
                        // pp.id(getName(env, irTerms, id), id, 'term'),
                        atom(' = '),
                        debugExpr(envWithNames, irTerms[id].expr),
                    ]),
                    50,
                ),
            )
            .join('\n\n');
    },
};

// const getName = (env: Env, exprs: Exprs, id: string) => {
//     if (exprs[id].source) {
//         const parentName = env.global.idNames[idName(exprs[id].source!.id)];
//         if (parentName) {
//             return `${parentName}:${exprs[id].source!.kind}`;
//         }
//     }
//     return env.global.idNames[id] || 'unnamed';
// };
