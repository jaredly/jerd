// This is for testing things that we can print to typescript

import { Loc, Location, parse } from '../parsing/parser';
import { PP, printToString } from './printer';
import { toplevelToPretty } from './printTsLike';
import {
    assembleItemsForFile,
    declarationToGlsl,
    defaultOptimizer,
    fileToGlsl,
    generateShader,
    getInvalidLocs,
    hasInvalidGLSL,
    makeTermExpr,
    populateBuiltins,
    shaderAllButMains,
} from './glslPrinter';
import {
    addToplevelToEnv,
    hashObject,
    idFromName,
    idName,
    typeToplevelT,
} from '../typing/env';
import { newWithGlobal, selfEnv } from '../typing/types';
import { loadInit } from './loadPrelude';
import { typeFile } from '../typing/typeFile';
import { showLocation } from '../typing/typeExpr';
import { glslOpts, nameForOpt, Optimizer2 } from './ir/optimize/optimize';
import { Context } from 'vm';
import { Expr } from './ir/types';
import { debugExpr } from './irDebugPrinter';

export const snapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && typeof value === 'string';
    },
    print(value, _, __) {
        return value as string;
    },
};

expect.addSnapshotSerializer(snapshotSerializer);

const init = loadInit();
const process = (raw: string) => {
    let initialEnv = newWithGlobal(init.initialEnv);
    let toplevels;
    try {
        toplevels = parse(raw);
    } catch (err) {
        console.log(err);
        throw err;
    }
    const { expressions, env } = typeFile(toplevels, initialEnv, 'test');
    return fileToGlsl(expressions, env, { includeCanonicalNames: true }, {})
        .text;
};

const processOne = (raw: string, optimizer: Optimizer2 = defaultOptimizer) => {
    let initialEnv = newWithGlobal(init.initialEnv);
    let toplevels;
    try {
        toplevels = parse(raw);
    } catch (err) {
        console.log(err);
        throw err;
    }
    const { expressions, env } = typeFile(toplevels, initialEnv, 'test');
    const last = expressions[expressions.length - 1];
    const mainId = idFromName(hashObject(last));
    env.global.terms[idName(mainId)] = last;

    const required = [mainId].map((id) => makeTermExpr(id, env));

    const builtins = populateBuiltins(env);

    const { inOrder, irTerms } = assembleItemsForFile(
        { ...env, typeDefs: {} },
        required,
        [mainId].map(idName),
        {},
        builtins,
        optimizer,
    );
    const items: Array<{
        text: PP;
        locs: Array<{ loc: Location; reason: string }>;
    }> = [];
    const opts = {};

    const typeDefs = {};

    inOrder.forEach((name) => {
        const locs = getInvalidLocs(irTerms[name].expr, name);

        const senv = env.global.terms[name]
            ? selfEnv(env, {
                  type: 'Term',
                  name,
                  ann: env.global.terms[name].is,
              })
            : env;
        items.push({
            text: declarationToGlsl(
                // Empty out the localNames
                // { ...senv, local: { ...senv.local, localNames: {} } },
                { ...senv, typeDefs },
                { includeCanonicalNames: true },
                name,
                irTerms[name].expr,
                null,
            ),
            locs,
        });
    });

    return items
        .map((item) => {
            const sourceMap = {};
            let text = printToString(item.text, 200, undefined, sourceMap);
            if (item.locs.length) {
                text =
                    `INVALID GLSL:\n` +
                    item.locs
                        .map(
                            (l) =>
                                `- Invalid GLSL at ${showLocation(l.loc)}: ${
                                    l.reason
                                }`,
                        )
                        .join('\n') +
                    '\n\n' +
                    text;
            }
            return text;
        })
        .join('\n');
};

describe('glslPrinter', () => {
    describe('things that glsl should be able to handle', () => {
        it('basic thing', () => {
            expect(
                processOne(
                    `
					const thing = (n: int) => (n * 2) as float;
					(env: GLSLEnv, pos: Vec2) => vec4(vec3(pos, thing(23)), 1.0)`,
                ),
            ).toMatchInlineSnapshot(`
                /* (n#:0: int): float => float(n#:0 * 2) */
                float thing_ac9c267c(int n_0) {
                    return float((n_0 * 2));
                }
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => vec4(vec3(pos#:1, thing#🍅(23)), 1) */
                vec4 V48febf40(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    return vec4(vec3(pos_1, thing_ac9c267c(23)), 1.0);
                }
            `);
        });

        it('passed-in function', () => {
            expect(
                processOne(
                    `const basic = (f: (int) => float) => f(2) + 2.3;
				(env: GLSLEnv, pos: Vec2) => vec4(basic((n: int) => n as float + 1.2))`,
                ),
            ).toMatchInlineSnapshot(`
                /* (n#:0: int): float => float(n#:0) + 1.2 */
                float undefined_lambda_6d47897a(int n_0) {
                    return (float(n_0) + 1.20);
                }
                /* (): float => undefined_lambda#🧑‍🦯👨‍👧‍👧🍶😃(2) + 2.3 */
                float basic_specialization_befc7844() {
                    return (undefined_lambda_6d47897a(2) + 2.30);
                }
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => vec4(basic_specialization#😯()) */
                vec4 V0d60a1fc(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    return vec4(basic_specialization_befc7844());
                }
            `);
        });

        it('cant do recursion', () => {
            expect(
                processOne(`const rec awesome = (n: int): int => {
				if n <= 1 { 1 } else {
					if modInt(n, 2) == 0 {
						awesome(n / 2) + 1
					} else {
						awesome(n * 3 + 1) + 1
					}
				}
			};
			(env: GLSLEnv, pos: Vec2) => vec4(awesome(3) as float)
			`),
            ).toMatchInlineSnapshot(`
                INVALID GLSL:
                - Invalid GLSL at 4:7-4:14: Can't have recursion
                - Invalid GLSL at 6:7-6:14: Can't have recursion

                /* (n#:0: int): int => {
                    if n#:0 <= 1 {
                        return 1;
                    } else {
                        if (n#:0 modInt 2) == (0) {
                            return awesome#👸🥞🍖😃(n#:0 / 2) + 1;
                        } else {
                            return awesome#👸🥞🍖😃(n#:0 * 3 + 1) + 1;
                        };
                    };
                } */
                int awesome_694a453b(int n_0) {
                    if ((n_0 <= 1)) {
                        return 1;
                    } else {
                        if (((n_0 % 2) == 0)) {
                            return (awesome_694a453b((n_0 / 2)) + 1);
                        } else {
                            return (awesome_694a453b(((n_0 * 3) + 1)) + 1);
                        };
                    };
                }
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => vec4(float(awesome#👸🥞🍖😃(3))) */
                vec4 V664a1263(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    return vec4(float(awesome_694a453b(3)));
                }
            `);
        });

        it.skip('cant handle array spread oops', () => {
            expect(
                processOne(`
                (env: GLSLEnv, pos: Vec2) => {
                    const items = [1,2,3];
                    const more = [...items, 3, 4];
                    switch more {
                        [] => 1,
                        [..., m] => m,
                        _ => 3
                    }
                }
            `),
            ).toMatchInlineSnapshot();
        });

        // OK so TODO what I want is
        // - run the actual post-ir code as javascript, and also run the pre-ir version,
        //   and assert that they produce the same value.
        // - and also keep track of the snapshot, that's nice too.
        // But so how do I handle the "array declaration" dealio 🤔
        // I mean, in javascript, we might end up with wasted allocations if this is just a
        // "we're defining this, and then overwriting it in a second", right?
        // Maybe I really should have a separate Stmt type for "declare an array of x length"
        // Because does it apply to other things? I don't think so.

        const spyingOptimizer = (spy: Array<string>): Optimizer2 => (
            ctx,
            expr: Expr,
        ) => {
            spy.push('--- [ start new opt ] ---');
            for (let i = 0; i < 100; i++) {
                let start = expr;
                glslOpts.forEach((opt) => {
                    const post = opt(ctx, expr);
                    if (post !== expr) {
                        spy.push(
                            `# [${nameForOpt(opt)}]\n${printToString(
                                debugExpr(ctx.env, post),
                                100,
                            )}`,
                        );
                    }
                    expr = post;
                });
                if (expr === start) {
                    return expr;
                }
            }
            spy.push('!!!! OPTMIZE FAILED TO CONVERGE !!!!');
            // throw new Error(`Optimize failed to converge`);
            return expr;
        };

        it('can range, map, and reduce', () => {
            const listened: Array<string> = [];

            expect(
                processOne(
                    `
                const rec rangeInner = (n: int, collect: Array<int>): Array<int> => {
                    if n > 0 { rangeInner(n - 1, <int>[n - 1, ...collect]) } else { collect }
                };
                const range = (n: int) => rangeInner(n, <int>[]);
                const rec reduce = <T, R>(items: Array<T>, init: R, fn: (R, T) ={}> R): R ={}> 
                    switch items {
                        [] => init,
                        [item, ...rest] => reduce#self<T, R>(rest, fn(init, item), fn),
                    };
                const rec map = <T, R>(values: Array<T>, fn: (value: T) ={}> R, collect: Array<R>): Array<R> ={}>
                    switch values {
                        [] => collect,
                        [one, ...rest] => map#self<T, R>(rest, fn, <R>[...collect, fn(one)]),
                    };
                (env: GLSLEnv, pos: Vec2) => {
                    const circles = map<int, float>(range(10), (i: int) => {
                        const at = env.resolution / 10.0 * (i as float);
                        length(pos - at) - (i as float * 10.0)
                    }, <float>[]);
                    const mv = reduce<float, float>(circles, 1000.0, (one: float, two: float) => min(one, two));

                    if mv < 0.0 {
                        vec4(1.0)
                    } else {
                        vec4(0.0)
                    }
                }
                    `,
                    spyingOptimizer(listened),
                ),
            ).toMatchInlineSnapshot(`
                /* (one#:0: float, two#:1: float): float => min(one#:0, two#:1) */
                float undefined_lambda_420d731c(float one_0, float two_1) {
                    return min(one_0, two_1);
                }
                /* (): Array<int; 10> => {
                    const n#:0: int = 10;
                    const newArray#:5: Array<int; 10>;
                    const idx#:6: int = 9;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 - 1;
                        continue;
                    };
                    return newArray#:5;
                } */
                int[10] rangeInner_specialization_5ca3dee8() {
                    int n = 10;
                    int[10] newArray;
                    int idx = 9;
                    for (; n > 0; n--) {
                        newArray[idx] = (n - 1);
                        idx--;
                        continue;
                    };
                    return newArray;
                }
                INVALID GLSL:
                - Invalid GLSL at 7:28-7:33: Array length not inferrable
                - Invalid GLSL at 7:28-7:33: Array length not inferrable
                - Invalid GLSL at 7:28-7:33: Array length not inferrable

                /* <T, R>(items#:0: Array<[var]T#:0; size#:9>, init#:1: float): float => {
                    const items_i#:10: int = 0;
                    loop(unbounded) {
                        if len(items#:0) - items_i#:10 == 0 {
                            return init#:1;
                        };
                        if len(items#:0) - items_i#:10 >= 1 {
                            const recur#:7: float = undefined_lambda#🌆✈️🤐😃(init#:1, items#:0[0 + items_i#:10]);
                            items_i#:10 = items_i#:10 + 1;
                            init#:1 = recur#:7;
                            continue;
                        };
                        match_fail!();
                    };
                } */
                float V4b0653f4<T, R>(invalid_var:T_0[size_9] items_0, float init_1) {
                    int items_i = 0;
                    for (int i=0; i<10000; i++) {
                        if (((items_0.length() - items_i) == 0)) {
                            return init_1;
                        };
                        if (((items_0.length() - items_i) >= 1)) {
                            float recur = undefined_lambda_420d731c(init_1, items_0[(0 + items_i)]);
                            items_i++;
                            init_1 = recur;
                            continue;
                        };
                        // match fail;
                    };
                }
                /* (): Array<int; 10> => rangeInner_specialization#🌎🙇‍♀️💑😃() */
                int[10] range_specialization_9ca6a6d8() {
                    return rangeInner_specialization_5ca3dee8();
                }
                INVALID GLSL:
                - Invalid GLSL at 14:68-14:92: Spreads not supported in arrays
                - Invalid GLSL at 14:68-14:92: Array length not inferrable
                - Invalid GLSL at 14:75-14:82: Array length not inferrable
                - Invalid GLSL at 13:31-13:38: Array length not inferrable

                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = range_specialization#🍹();
                    const collect#:12: Array<float> = [];
                    const values_i#:13: int = 0;
                    for (; values_i#:13 <= 10; values_i#:13 = values_i#:13 + 1) {
                        const i#:17: int = values#:10[0 + values_i#:13];
                        collect#:12 = [...collect#:12, length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10];
                        continue;
                    };
                    if unnamed#🧿⛷️👐😃(collect#:12, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                } */
                vec4 V4cb0c816(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    int[10] values = range_specialization_9ca6a6d8();
                    float[NULL] collect = float[]();
                    int values_i = 0;
                    for (; values_i <= 10; values_i++) {
                        int i = values[(0 + values_i)];
                        collect = ArrayWithSpreads<null>[...collect, (length((pos_1 - ((env_0.resolution / 10.0) * float(i)))) - (float(i) * 10.0))];
                        continue;
                    };
                    if ((V4b0653f4(collect, 1000.0) < 0.0)) {
                        return vec4(1.0);
                    } else {
                        return vec4(0.0);
                    };
                }
            `);

            expect(listened.join('\n')).toMatchInlineSnapshot(`
                --- [ start new opt ] ---
                # [flattenImmediateCalls2]
                (n#:0: int, collect#:1: Array<int>): Array<int> => {
                    if n#:0 > 0 {
                        return rangeInner#🍁(n#:0 - 1, [n#:0 - 1, ...collect#:1]);
                    } else {
                        return collect#:1;
                    };
                }
                # [optimizeTailCalls]
                (n#:0: int, collect#:1: Array<int>): Array<int> => {
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        const recur#:2: int = n#:0 - 1;
                        const recur#:3: Array<int> = [n#:0 - 1, ...collect#:1];
                        collect#:1 = recur#:3;
                        continue;
                    };
                    return collect#:1;
                }
                # [removeUnusedVariables]
                (n#:0: int, collect#:1: Array<int>): Array<int> => {
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        const recur#:3: Array<int> = [n#:0 - 1, ...collect#:1];
                        collect#:1 = recur#:3;
                        continue;
                    };
                    return collect#:1;
                }
                # [foldSingleUseAssignments]
                (n#:0: int, collect#:1: Array<int>): Array<int> => {
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        collect#:1 = [n#:0 - 1, ...collect#:1];
                        continue;
                    };
                    return collect#:1;
                }
                # [inferArraySize]
                (n#:0: int, collect#:1: Array<int; size#:4>): Array<int> => {
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        collect#:1 = [n#:0 - 1, ...collect#:1];
                        continue;
                    };
                    return collect#:1;
                }
                # [loopSpreadToArraySet]
                (n#:0: int, collect#:1: Array<int; size#:4>): Array<int> => {
                    const newArray#:5: Array<int; size#:4 + n#:0>;
                    const idx#:6: int = n#:0 - 1;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        {
                            newArray#:5[idx#:6] = n#:0 - 1;
                            idx#:6 = idx#:6 - 1;
                        };
                        continue;
                    };
                    return newArray#:5;
                }
                # [removeNestedBlocksAndCodeAfterReturns]
                (n#:0: int, collect#:1: Array<int; size#:4>): Array<int> => {
                    const newArray#:5: Array<int; size#:4 + n#:0>;
                    const idx#:6: int = n#:0 - 1;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 - 1;
                        continue;
                    };
                    return newArray#:5;
                }
                # [inferArraySize]
                (n#:0: int, collect#:1: Array<int; size#:4>): Array<int; size#:4 + n#:0> => {
                    const newArray#:5: Array<int; size#:4 + n#:0>;
                    const idx#:6: int = n#:0 - 1;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 - 1;
                        continue;
                    };
                    return newArray#:5;
                }
                --- [ start new opt ] ---
                # [removeNestedBlocksAndCodeAfterReturns]
                <T, R>(items#:0: Array<[var]T#:0>, init#:1: [var]R#:1, fn#:2: ([var]R#:1, [var]T#:0) => [var]R#:1): [var]R#:1 => ((): [var]R#:1 => {
                    if len(items#:0) == 0 {
                        return init#:1;
                    };
                    if len(items#:0) >= 1 {
                        const item#:3: [var]T#:0 = items#:0[0];
                        const rest#:4: Array<[var]T#:0> = [slice];
                        return reduce#🌓🏛️😹😃<[var]T#:0, [var]R#:1>(rest#:4, fn#:2(init#:1, item#:3), fn#:2);
                    };
                    match_fail!();
                })()
                # [flattenImmediateCalls2]
                <T, R>(items#:0: Array<[var]T#:0>, init#:1: [var]R#:1, fn#:2: ([var]R#:1, [var]T#:0) => [var]R#:1): [var]R#:1 => {
                    if len(items#:0) == 0 {
                        return init#:1;
                    };
                    if len(items#:0) >= 1 {
                        const item#:3: [var]T#:0 = items#:0[0];
                        const rest#:4: Array<[var]T#:0> = [slice];
                        return reduce#🌓🏛️😹😃<[var]T#:0, [var]R#:1>(rest#:4, fn#:2(init#:1, item#:3), fn#:2);
                    };
                    match_fail!();
                }
                # [foldSingleUseAssignments]
                <T, R>(items#:0: Array<[var]T#:0>, init#:1: [var]R#:1, fn#:2: ([var]R#:1, [var]T#:0) => [var]R#:1): [var]R#:1 => {
                    if len(items#:0) == 0 {
                        return init#:1;
                    };
                    if len(items#:0) >= 1 {
                        return reduce#🌓🏛️😹😃<[var]T#:0, [var]R#:1>([slice], fn#:2(init#:1, items#:0[0]), fn#:2);
                    };
                    match_fail!();
                }
                # [optimizeTailCalls]
                <T, R>(items#:0: Array<[var]T#:0>, init#:1: [var]R#:1, fn#:2: ([var]R#:1, [var]T#:0) => [var]R#:1): [var]R#:1 => {
                    loop(unbounded) {
                        if len(items#:0) == 0 {
                            return init#:1;
                        };
                        if len(items#:0) >= 1 {
                            const recur#:6: Array<[var]T#:0> = [slice];
                            const recur#:7: [var]R#:1 = fn#:2(init#:1, items#:0[0]);
                            const recur#:8: ([var]R#:1, [var]T#:0) => [var]R#:1 = fn#:2;
                            items#:0 = recur#:6;
                            init#:1 = recur#:7;
                            fn#:2 = recur#:8;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [foldSingleUseAssignments]
                <T, R>(items#:0: Array<[var]T#:0>, init#:1: [var]R#:1, fn#:2: ([var]R#:1, [var]T#:0) => [var]R#:1): [var]R#:1 => {
                    loop(unbounded) {
                        if len(items#:0) == 0 {
                            return init#:1;
                        };
                        if len(items#:0) >= 1 {
                            const recur#:7: [var]R#:1 = fn#:2(init#:1, items#:0[0]);
                            items#:0 = [slice];
                            init#:1 = recur#:7;
                            fn#:2 = fn#:2;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [inferArraySize]
                <T, R>(
                    items#:0: Array<[var]T#:0; size#:9>,
                    init#:1: [var]R#:1,
                    fn#:2: ([var]R#:1, [var]T#:0) => [var]R#:1,
                ): [var]R#:1 => {
                    loop(unbounded) {
                        if len(items#:0) == 0 {
                            return init#:1;
                        };
                        if len(items#:0) >= 1 {
                            const recur#:7: [var]R#:1 = fn#:2(init#:1, items#:0[0]);
                            items#:0 = [slice];
                            init#:1 = recur#:7;
                            fn#:2 = fn#:2;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [arraySliceLoopToIndex]
                <T, R>(
                    items#:0: Array<[var]T#:0; size#:9>,
                    init#:1: [var]R#:1,
                    fn#:2: ([var]R#:1, [var]T#:0) => [var]R#:1,
                ): [var]R#:1 => {
                    const items_i#:10: int = 0;
                    loop(unbounded) {
                        if len(items#:0) - items_i#:10 == 0 {
                            return init#:1;
                        };
                        if len(items#:0) - items_i#:10 >= 1 {
                            const recur#:7: [var]R#:1 = fn#:2(init#:1, items#:0[0 + items_i#:10]);
                            items_i#:10 = items_i#:10 + 1;
                            init#:1 = recur#:7;
                            fn#:2 = fn#:2;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # []
                <T, R>(
                    items#:0: Array<[var]T#:0; size#:9>,
                    init#:1: [var]R#:1,
                    fn#:2: ([var]R#:1, [var]T#:0) => [var]R#:1,
                ): [var]R#:1 => {
                    const items_i#:10: int = 0;
                    loop(unbounded) {
                        if len(items#:0) - items_i#:10 == 0 {
                            return init#:1;
                        };
                        if len(items#:0) - items_i#:10 >= 1 {
                            const recur#:7: [var]R#:1 = fn#:2(init#:1, items#:0[0 + items_i#:10]);
                            items_i#:10 = items_i#:10 + 1;
                            init#:1 = recur#:7;
                            continue;
                        };
                        match_fail!();
                    };
                }
                --- [ start new opt ] ---
                # [inferArraySize]
                (n#:0: int): Array<int> => rangeInner#🍁(n#:0, [])
                --- [ start new opt ] ---
                # [removeNestedBlocksAndCodeAfterReturns]
                <T, R>(values#:0: Array<[var]T#:0>, fn#:1: ([var]T#:0) => [var]R#:1, collect#:2: Array<[var]R#:1>): Array<[var]R#:1> => ((): Array<[var]R#:1> => {
                    if len(values#:0) == 0 {
                        return collect#:2;
                    };
                    if len(values#:0) >= 1 {
                        const one#:3: [var]T#:0 = values#:0[0];
                        const rest#:4: Array<[var]T#:0> = [slice];
                        return map#🥏<[var]T#:0, [var]R#:1>(rest#:4, fn#:1, [...collect#:2, fn#:1(one#:3)]);
                    };
                    match_fail!();
                })()
                # [flattenImmediateCalls2]
                <T, R>(values#:0: Array<[var]T#:0>, fn#:1: ([var]T#:0) => [var]R#:1, collect#:2: Array<[var]R#:1>): Array<[var]R#:1> => {
                    if len(values#:0) == 0 {
                        return collect#:2;
                    };
                    if len(values#:0) >= 1 {
                        const one#:3: [var]T#:0 = values#:0[0];
                        const rest#:4: Array<[var]T#:0> = [slice];
                        return map#🥏<[var]T#:0, [var]R#:1>(rest#:4, fn#:1, [...collect#:2, fn#:1(one#:3)]);
                    };
                    match_fail!();
                }
                # [foldSingleUseAssignments]
                <T, R>(values#:0: Array<[var]T#:0>, fn#:1: ([var]T#:0) => [var]R#:1, collect#:2: Array<[var]R#:1>): Array<[var]R#:1> => {
                    if len(values#:0) == 0 {
                        return collect#:2;
                    };
                    if len(values#:0) >= 1 {
                        return map#🥏<[var]T#:0, [var]R#:1>([slice], fn#:1, [...collect#:2, fn#:1(values#:0[0])]);
                    };
                    match_fail!();
                }
                # [optimizeTailCalls]
                <T, R>(values#:0: Array<[var]T#:0>, fn#:1: ([var]T#:0) => [var]R#:1, collect#:2: Array<[var]R#:1>): Array<[var]R#:1> => {
                    loop(unbounded) {
                        if len(values#:0) == 0 {
                            return collect#:2;
                        };
                        if len(values#:0) >= 1 {
                            const recur#:6: Array<[var]T#:0> = [slice];
                            const recur#:7: ([var]T#:0) => [var]R#:1 = fn#:1;
                            const recur#:8: Array<[var]R#:1> = [...collect#:2, fn#:1(values#:0[0])];
                            values#:0 = recur#:6;
                            fn#:1 = recur#:7;
                            collect#:2 = recur#:8;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [foldSingleUseAssignments]
                <T, R>(values#:0: Array<[var]T#:0>, fn#:1: ([var]T#:0) => [var]R#:1, collect#:2: Array<[var]R#:1>): Array<[var]R#:1> => {
                    loop(unbounded) {
                        if len(values#:0) == 0 {
                            return collect#:2;
                        };
                        if len(values#:0) >= 1 {
                            const recur#:8: Array<[var]R#:1> = [...collect#:2, fn#:1(values#:0[0])];
                            values#:0 = [slice];
                            fn#:1 = fn#:1;
                            collect#:2 = recur#:8;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [inferArraySize]
                <T, R>(
                    values#:0: Array<[var]T#:0; size#:9>,
                    fn#:1: ([var]T#:0) => [var]R#:1,
                    collect#:2: Array<[var]R#:1; size#:10>,
                ): Array<[var]R#:1> => {
                    loop(unbounded) {
                        if len(values#:0) == 0 {
                            return collect#:2;
                        };
                        if len(values#:0) >= 1 {
                            const recur#:8: Array<[var]R#:1> = [...collect#:2, fn#:1(values#:0[0])];
                            values#:0 = [slice];
                            fn#:1 = fn#:1;
                            collect#:2 = recur#:8;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [arraySliceLoopToIndex]
                <T, R>(
                    values#:0: Array<[var]T#:0; size#:9>,
                    fn#:1: ([var]T#:0) => [var]R#:1,
                    collect#:2: Array<[var]R#:1; size#:10>,
                ): Array<[var]R#:1> => {
                    const values_i#:11: int = 0;
                    loop(unbounded) {
                        if len(values#:0) - values_i#:11 == 0 {
                            return collect#:2;
                        };
                        if len(values#:0) - values_i#:11 >= 1 {
                            const recur#:8: Array<[var]R#:1> = [...collect#:2, fn#:1(values#:0[0 + values_i#:11])];
                            values_i#:11 = values_i#:11 + 1;
                            fn#:1 = fn#:1;
                            collect#:2 = recur#:8;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # []
                <T, R>(
                    values#:0: Array<[var]T#:0; size#:9>,
                    fn#:1: ([var]T#:0) => [var]R#:1,
                    collect#:2: Array<[var]R#:1; size#:10>,
                ): Array<[var]R#:1> => {
                    const values_i#:11: int = 0;
                    loop(unbounded) {
                        if len(values#:0) - values_i#:11 == 0 {
                            return collect#:2;
                        };
                        if len(values#:0) - values_i#:11 >= 1 {
                            const recur#:8: Array<[var]R#:1> = [...collect#:2, fn#:1(values#:0[0 + values_i#:11])];
                            values_i#:11 = values_i#:11 + 1;
                            collect#:2 = recur#:8;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [inferArraySize]
                <T, R>(
                    values#:0: Array<[var]T#:0; size#:9>,
                    fn#:1: ([var]T#:0) => [var]R#:1,
                    collect#:2: Array<[var]R#:1; size#:10>,
                ): Array<[var]R#:1; size#:10> => {
                    const values_i#:11: int = 0;
                    loop(unbounded) {
                        if len(values#:0) - values_i#:11 == 0 {
                            return collect#:2;
                        };
                        if len(values#:0) - values_i#:11 >= 1 {
                            const recur#:8: Array<[var]R#:1> = [...collect#:2, fn#:1(values#:0[0 + values_i#:11])];
                            values_i#:11 = values_i#:11 + 1;
                            collect#:2 = recur#:8;
                            continue;
                        };
                        match_fail!();
                    };
                }
                --- [ start new opt ] ---
                --- [ start new opt ] ---
                --- [ start new opt ] ---
                # [foldConstantsAndLambdas]
                <T, R>(items#:0: Array<[var]T#:0; size#:9>, init#:1: [var]R#:1): [var]R#:1 => {
                    const fn#:2: (float, float) => float = unnamed#🌆✈️🤐😃;
                    const items_i#:10: int = 0;
                    loop(unbounded) {
                        if len(items#:0) - items_i#:10 == 0 {
                            return init#:1;
                        };
                        if len(items#:0) - items_i#:10 >= 1 {
                            const recur#:7: [var]R#:1 = unnamed#🌆✈️🤐😃(init#:1, items#:0[0 + items_i#:10]);
                            items_i#:10 = items_i#:10 + 1;
                            init#:1 = recur#:7;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [removeUnusedVariables]
                <T, R>(items#:0: Array<[var]T#:0; size#:9>, init#:1: [var]R#:1): [var]R#:1 => {
                    const items_i#:10: int = 0;
                    loop(unbounded) {
                        if len(items#:0) - items_i#:10 == 0 {
                            return init#:1;
                        };
                        if len(items#:0) - items_i#:10 >= 1 {
                            const recur#:7: [var]R#:1 = unnamed#🌆✈️🤐😃(init#:1, items#:0[0 + items_i#:10]);
                            items_i#:10 = items_i#:10 + 1;
                            init#:1 = recur#:7;
                            continue;
                        };
                        match_fail!();
                    };
                }
                # [specializeFunctionsCalledWithLambdas]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const circles#:4: Array<float> = map#🥏<int, float>(
                        range#🖐️✍️👌😃(10),
                        (i#:2: int): float => {
                            const at#:3: Vec2#🐭😉😵😃 = Vec2float#🛴🎳🧇😃.#Mul#🦷👷‍♀️👨‍👦#0(
                                ScaleVec2Rev#🎠🧩🛸.#Div#👨‍🎓😨🚵‍♂️😃#0(env#:0.#GLSLEnv#🕷️⚓😣😃#1, 10),
                                IntAsFloat#🥛🐰🗻😃.#As#😉#0(i#:2),
                            );
                            return length#😦(AddSubVec2#🧑‍🔧🚍🐅😃.#AddSub#🍹#1(pos#:1, at#:3)) - IntAsFloat#🥛🐰🗻😃.#As#😉#0(
                                i#:2,
                            ) * 10;
                        },
                        [],
                    );
                    const mv#:7: float = unnamed#🐰⛳🍤😃<float, float>(circles#:4, 1000);
                    return ((): Vec4#🕒🧑‍🏫🎃 => {
                        if mv#:7 < 0 {
                            return ((): Vec4#🕒🧑‍🏫🎃 => vec4#🤽🚇🚞😃(1))();
                        } else {
                            return ((): Vec4#🕒🧑‍🏫🎃 => vec4#🤽🚇🚞😃(0))();
                        };
                    })();
                }
                # [flattenImmediateCalls2]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const circles#:4: Array<float> = map#🥏<int, float>(
                        range#🖐️✍️👌😃(10),
                        (i#:2: int): float => {
                            const at#:3: Vec2#🐭😉😵😃 = Vec2float#🛴🎳🧇😃.#Mul#🦷👷‍♀️👨‍👦#0(
                                ScaleVec2Rev#🎠🧩🛸.#Div#👨‍🎓😨🚵‍♂️😃#0(env#:0.#GLSLEnv#🕷️⚓😣😃#1, 10),
                                IntAsFloat#🥛🐰🗻😃.#As#😉#0(i#:2),
                            );
                            return length#😦(AddSubVec2#🧑‍🔧🚍🐅😃.#AddSub#🍹#1(pos#:1, at#:3)) - IntAsFloat#🥛🐰🗻😃.#As#😉#0(
                                i#:2,
                            ) * 10;
                        },
                        [],
                    );
                    const mv#:7: float = unnamed#🐰⛳🍤😃<float, float>(circles#:4, 1000);
                    if mv#:7 < 0 {
                        return vec4#🤽🚇🚞😃(1);
                    } else {
                        return vec4#🤽🚇🚞😃(0);
                    };
                }
                # [foldSingleUseAssignments]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    if unnamed#🐰⛳🍤😃<float, float>(
                        map#🥏<int, float>(
                            range#🖐️✍️👌😃(10),
                            (i#:2: int): float => length#😦(
                                AddSubVec2#🧑‍🔧🚍🐅😃.#AddSub#🍹#1(
                                    pos#:1,
                                    Vec2float#🛴🎳🧇😃.#Mul#🦷👷‍♀️👨‍👦#0(
                                        ScaleVec2Rev#🎠🧩🛸.#Div#👨‍🎓😨🚵‍♂️😃#0(env#:0.#GLSLEnv#🕷️⚓😣😃#1, 10),
                                        IntAsFloat#🥛🐰🗻😃.#As#😉#0(i#:2),
                                    ),
                                ),
                            ) - IntAsFloat#🥛🐰🗻😃.#As#😉#0(i#:2) * 10,
                            [],
                        ),
                        1000,
                    ) < 0 {
                        return vec4#🤽🚇🚞😃(1);
                    } else {
                        return vec4#🤽🚇🚞😃(0);
                    };
                }
                # [inlineFunctionsCalledWithCapturingLambdas]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    if unnamed#🐰⛳🍤😃<float, float>(
                        (<T, R>(
                            values#:10: Array<[var]T#:0; size#:9>,
                            fn#:11: ([var]T#:0) => [var]R#:1,
                            collect#:12: Array<[var]R#:1; size#:10>,
                        ): Array<[var]R#:1; size#:10> => {
                            const values_i#:13: int = 0;
                            loop(unbounded) {
                                if len(values#:10) - values_i#:13 == 0 {
                                    return collect#:12;
                                };
                                if len(values#:10) - values_i#:13 >= 1 {
                                    const recur#:14: Array<[var]R#:1> = [
                                        ...collect#:12,
                                        fn#:11(values#:10[0 + values_i#:13]),
                                    ];
                                    values_i#:13 = values_i#:13 + 1;
                                    collect#:12 = recur#:14;
                                    continue;
                                };
                                match_fail!();
                            };
                        })<int, float>(
                            range#🖐️✍️👌😃(10),
                            (i#:2: int): float => length#😦(
                                AddSubVec2#🧑‍🔧🚍🐅😃.#AddSub#🍹#1(
                                    pos#:1,
                                    Vec2float#🛴🎳🧇😃.#Mul#🦷👷‍♀️👨‍👦#0(
                                        ScaleVec2Rev#🎠🧩🛸.#Div#👨‍🎓😨🚵‍♂️😃#0(env#:0.#GLSLEnv#🕷️⚓😣😃#1, 10),
                                        IntAsFloat#🥛🐰🗻😃.#As#😉#0(i#:2),
                                    ),
                                ),
                            ) - IntAsFloat#🥛🐰🗻😃.#As#😉#0(i#:2) * 10,
                            [],
                        ),
                        1000,
                    ) < 0 {
                        return vec4#🤽🚇🚞😃(1);
                    } else {
                        return vec4#🤽🚇🚞😃(0);
                    };
                }
                # [inlint]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    if unnamed#🐰⛳🍤😃<float, float>(
                        (<T, R>(
                            values#:10: Array<[var]T#:0; size#:9>,
                            fn#:11: ([var]T#:0) => [var]R#:1,
                            collect#:12: Array<[var]R#:1; size#:10>,
                        ): Array<[var]R#:1; size#:10> => {
                            const values_i#:13: int = 0;
                            loop(unbounded) {
                                if len(values#:10) - values_i#:13 == 0 {
                                    return collect#:12;
                                };
                                if len(values#:10) - values_i#:13 >= 1 {
                                    const recur#:14: Array<[var]R#:1> = [
                                        ...collect#:12,
                                        fn#:11(values#:10[0 + values_i#:13]),
                                    ];
                                    values_i#:13 = values_i#:13 + 1;
                                    collect#:12 = recur#:14;
                                    continue;
                                };
                                match_fail!();
                            };
                        })<int, float>(
                            range#🖐️✍️👌😃(10),
                            (i#:2: int): float => length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:2)) - float(
                                i#:2,
                            ) * 10,
                            [],
                        ),
                        1000,
                    ) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [monomorphize]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    if unnamed#🧿⛷️👐😃(
                        (<T, R>(
                            values#:10: Array<[var]T#:0; size#:9>,
                            fn#:11: ([var]T#:0) => [var]R#:1,
                            collect#:12: Array<[var]R#:1; size#:10>,
                        ): Array<[var]R#:1; size#:10> => {
                            const values_i#:13: int = 0;
                            loop(unbounded) {
                                if len(values#:10) - values_i#:13 == 0 {
                                    return collect#:12;
                                };
                                if len(values#:10) - values_i#:13 >= 1 {
                                    const recur#:14: Array<[var]R#:1> = [
                                        ...collect#:12,
                                        fn#:11(values#:10[0 + values_i#:13]),
                                    ];
                                    values_i#:13 = values_i#:13 + 1;
                                    collect#:12 = recur#:14;
                                    continue;
                                };
                                match_fail!();
                            };
                        })<int, float>(
                            range#🖐️✍️👌😃(10),
                            (i#:2: int): float => length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:2)) - float(
                                i#:2,
                            ) * 10,
                            [],
                        ),
                        1000,
                    ) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [flattenImmediateCalls2]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int> = range#🖐️✍️👌😃(10);
                    const fn#:11: (int) => float = (i#:2: int): float => length(
                        pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:2),
                    ) - float(i#:2) * 10;
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const continueBlock#:16: bool = true;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            continueBlock#:16 = false;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const recur#:14: Array<[var]R#:1> = [
                                ...collect#:12,
                                fn#:11(values#:10[0 + values_i#:13]),
                            ];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = recur#:14;
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                --- [ start new opt ] ---
                # [foldSingleUseAssignments]
                (): Array<int> => rangeInner#🍁(10, [])
                --- [ start new opt ] ---
                # [foldConstantsAndLambdas]
                (): Array<int; 10> => {
                    const n#:0: int = 10;
                    const collect#:1: Array<int; 0> = [];
                    const newArray#:5: Array<int; 10>;
                    const idx#:6: int = 10 - 1;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 - 1;
                        continue;
                    };
                    return newArray#:5;
                }
                # [removeUnusedVariables]
                (): Array<int; 10> => {
                    const n#:0: int = 10;
                    const newArray#:5: Array<int; 10>;
                    const idx#:6: int = 10 - 1;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 - 1;
                        continue;
                    };
                    return newArray#:5;
                }
                # [foldSimpleMath]
                (): Array<int; 10> => {
                    const n#:0: int = 10;
                    const newArray#:5: Array<int; 10>;
                    const idx#:6: int = 9;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 - 1;
                        continue;
                    };
                    return newArray#:5;
                }
                # [inferArraySize]
                (): Array<int> => unnamed#🌎🙇‍♀️💑😃()
                # [inferArraySize]
                (): Array<int; 10> => unnamed#🌎🙇‍♀️💑😃()
                # [inferArraySize]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int> = unnamed#🍹();
                    const fn#:11: (int) => float = (i#:2: int): float => length(
                        pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:2),
                    ) - float(i#:2) * 10;
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const continueBlock#:16: bool = true;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            continueBlock#:16 = false;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const recur#:14: Array<[var]R#:1> = [
                                ...collect#:12,
                                fn#:11(values#:10[0 + values_i#:13]),
                            ];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = recur#:14;
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [foldSingleUseAssignments]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int> = unnamed#🍹();
                    const fn#:11: (int) => float = (i#:2: int): float => length(
                        pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:2),
                    ) - float(i#:2) * 10;
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            continueBlock#:16 = false;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const recur#:14: Array<[var]R#:1> = [
                                ...collect#:12,
                                fn#:11(values#:10[0 + values_i#:13]),
                            ];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = recur#:14;
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [foldConstantsAndLambdas]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int> = unnamed#🍹();
                    const fn#:11: (int) => float = (i#:2: int): float => length(
                        pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:2),
                    ) - float(i#:2) * 10;
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            continueBlock#:16 = false;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const recur#:14: Array<[var]R#:1> = [
                                ...collect#:12,
                                ((i#:17: int): float => length(
                                    pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17),
                                ) - float(i#:17) * 10)(values#:10[0 + values_i#:13]),
                            ];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = recur#:14;
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [removeUnusedVariables]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const recur#:14: Array<[var]R#:1> = [
                                ...collect#:12,
                                ((i#:17: int): float => length(
                                    pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17),
                                ) - float(i#:17) * 10)(values#:10[0 + values_i#:13]),
                            ];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = recur#:14;
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [flattenImmediateCalls2]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const i#:17: int = values#:10[0 + values_i#:13];
                            const recur#:14: Array<[var]R#:1> = [
                                ...collect#:12,
                                length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                            ];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = recur#:14;
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [inferArraySize]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const i#:17: int = values#:10[0 + values_i#:13];
                            const recur#:14: Array<[var]R#:1> = [
                                ...collect#:12,
                                length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                            ];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = recur#:14;
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [foldSingleUseAssignments]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const i#:17: int = values#:10[0 + values_i#:13];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = [
                                ...collect#:12,
                                length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                            ];
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [inferArraySize]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if 10 - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            break;
                        };
                        if 10 - values_i#:13 >= 1 {
                            const i#:17: int = values#:10[0 + values_i#:13];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = [
                                ...collect#:12,
                                length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                            ];
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [inferLoopBounds]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    for (; values_i#:13 <= -(0 - 10); values_i#:13 = values_i#:13 + 1) {
                        const i#:17: int = values#:10[0 + values_i#:13];
                        collect#:12 = [
                            ...collect#:12,
                            length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                        ];
                        continue;
                    };
                    {
                        result#:15 = collect#:12;
                    };
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [removeNestedBlocksAndCodeAfterReturns]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    for (; values_i#:13 <= -(0 - 10); values_i#:13 = values_i#:13 + 1) {
                        const i#:17: int = values#:10[0 + values_i#:13];
                        collect#:12 = [
                            ...collect#:12,
                            length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                        ];
                        continue;
                    };
                    result#:15 = collect#:12;
                    if unnamed#🧿⛷️👐😃(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [foldConstantsAndLambdas]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const result#:15: Array<[var]R#:1>;
                    const values_i#:13: int = 0;
                    for (; values_i#:13 <= -(0 - 10); values_i#:13 = values_i#:13 + 1) {
                        const i#:17: int = values#:10[0 + values_i#:13];
                        collect#:12 = [
                            ...collect#:12,
                            length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                        ];
                        continue;
                    };
                    result#:15 = collect#:12;
                    if unnamed#🧿⛷️👐😃(collect#:12, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [flattenImmediateAssigns]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const values_i#:13: int = 0;
                    for (; values_i#:13 <= -(0 - 10); values_i#:13 = values_i#:13 + 1) {
                        const i#:17: int = values#:10[0 + values_i#:13];
                        collect#:12 = [
                            ...collect#:12,
                            length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                        ];
                        continue;
                    };
                    const result#:15: Array<[var]R#:1> = collect#:12;
                    if unnamed#🧿⛷️👐😃(collect#:12, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [removeUnusedVariables]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const values_i#:13: int = 0;
                    for (; values_i#:13 <= -(0 - 10); values_i#:13 = values_i#:13 + 1) {
                        const i#:17: int = values#:10[0 + values_i#:13];
                        collect#:12 = [
                            ...collect#:12,
                            length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                        ];
                        continue;
                    };
                    if unnamed#🧿⛷️👐😃(collect#:12, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [foldSimpleMath]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const values_i#:13: int = 0;
                    for (; values_i#:13 <= -(-10); values_i#:13 = values_i#:13 + 1) {
                        const i#:17: int = values#:10[0 + values_i#:13];
                        collect#:12 = [
                            ...collect#:12,
                            length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                        ];
                        continue;
                    };
                    if unnamed#🧿⛷️👐😃(collect#:12, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
                # [foldSimpleMath]
                (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const values#:10: Array<int; 10> = unnamed#🍹();
                    const collect#:12: Array<float> = [];
                    const values_i#:13: int = 0;
                    for (; values_i#:13 <= 10; values_i#:13 = values_i#:13 + 1) {
                        const i#:17: int = values#:10[0 + values_i#:13];
                        collect#:12 = [
                            ...collect#:12,
                            length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:17)) - float(i#:17) * 10,
                        ];
                        continue;
                    };
                    if unnamed#🧿⛷️👐😃(collect#:12, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                }
            `);
        });

        it('can reduce also', () => {
            expect(
                processOne(
                    `
                const rec rangeInner = (n: int, collect: Array<int>): Array<int> => {
                    if n > 0 { rangeInner(n - 1, <int>[n - 1, ...collect]) } else { collect }
                };
                const range = (n: int) => rangeInner(n, <int>[]);
                const rec reduce = <T, R>(
                    items: Array<T>,
                    init: R,
                    fn: (R, T) ={}> R,
                ): R ={}> switch items {
                    [] => init,
                    [item, ...rest] => reduce#self<T, R>(rest, fn(init, item), fn),
                };
                // const rec map = <T, R>(
                //     values: Array<T>,
                //     fn: (value: T) ={}> R,
                //     collect: Array<R>,
                // ): Array<R> ={}> {
                //     switch values {
                //         [] => collect,
                //         [one, ...rest] => map#self<T, R>(
                //             rest,
                //             fn,
                //             <R>[...collect, fn(one)],
                //         ),
                //     };
                // }
                (env: GLSLEnv, pos: Vec2) => {
                    const mv = reduce<int, float>(range(10), 1000.0, (current: float, i: int) => {
                        const at = env.resolution / 10.0 * (i as float);
                        min(current, length(pos - at) - (i as float * 10.0))
                    });

                    // const circles = map<int, float>(range(10), (i: int) => {
                    //     const at = env.resolution / 10.0 * (i as float);
                    //     length(pos - at) - (i as float * 10.0)
                    // }, <float>[]);
                    // const mv = reduce<float, float>(circles, 1000.0, (one: float, two: float) => min(one, two));

                    if mv < 0.0 {
                        vec4(1.0)
                    } else {
                        vec4(0.0)
                    }
                }
                `,
                ),
            ).toMatchInlineSnapshot(`
                /* (): Array<int; 10> => {
                    const n#:0: int = 10;
                    const newArray#:5: Array<int; 10>;
                    const idx#:6: int = 9;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 - 1;
                        continue;
                    };
                    return newArray#:5;
                } */
                int[10] rangeInner_specialization_bbd6f930() {
                    int n = 10;
                    int[10] newArray;
                    int idx = 9;
                    for (; n > 0; n--) {
                        newArray[idx] = (n - 1);
                        idx--;
                        continue;
                    };
                    return newArray;
                }
                /* (): Array<int; 10> => rangeInner_specialization#👮‍♀️() */
                int[10] range_specialization_3a3457dc() {
                    return rangeInner_specialization_bbd6f930();
                }
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const items#:6: Array<int; 10> = range_specialization#🥏👩‍🏭🌥️();
                    const init#:7: float = 1000;
                    const items_i#:9: int = 0;
                    for (; items_i#:9 <= 10; items_i#:9 = items_i#:9 + 1) {
                        const i#:14: int = items#:6[0 + items_i#:9];
                        init#:7 = min(init#:7, length(pos#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 10 * float(i#:14)) - float(i#:14) * 10);
                        continue;
                    };
                    if init#:7 < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                } */
                vec4 V3ea457a2(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    int[10] items = range_specialization_3a3457dc();
                    float init = 1000.0;
                    int items_i = 0;
                    for (; items_i <= 10; items_i++) {
                        int i = items[(0 + items_i)];
                        init = min(init, (length((pos_1 - ((env_0.resolution / 10.0) * float(i)))) - (float(i) * 10.0)));
                        continue;
                    };
                    if ((init < 0.0)) {
                        return vec4(1.0);
                    } else {
                        return vec4(0.0);
                    };
                }
            `);
        });

        it('can do a forward range', () => {
            expect(
                processOne(`
                const rec rangeInner = (n: int, collect: Array<int>): Array<int> => {
                    if n > 0 {
                        rangeInner(n - 1, <int>[n - 1, ...collect])
                    } else {
                        collect
                    }
                };
                const range = (n: int) => rangeInner(n, <int>[]);
                (env: GLSLEnv, pos: Vec2) => {
                    const items = range(10);
                    const first = switch items {
                        [one, ...] => one,
                        _ => 10
                    };
                    vec4(len<int>(items) as float + first as float)
                }
                `),
            ).toMatchInlineSnapshot(`
                /* (): Array<int; 10> => {
                    const n#:0: int = 10;
                    const newArray#:5: Array<int; 10>;
                    const idx#:6: int = 9;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 - 1;
                        continue;
                    };
                    return newArray#:5;
                } */
                int[10] rangeInner_specialization_665f8f04() {
                    int n = 10;
                    int[10] newArray;
                    int idx = 9;
                    for (; n > 0; n--) {
                        newArray[idx] = (n - 1);
                        idx--;
                        continue;
                    };
                    return newArray;
                }
                /* (): Array<int; 10> => rangeInner_specialization#🏨🏸🌵😃() */
                int[10] range_specialization_16893e00() {
                    return rangeInner_specialization_665f8f04();
                }
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const first#:4: int;
                    const continueBlock#:6: bool = true;
                    if 10 >= 1 {
                        first#:4 = range_specialization#🐎🐝🧟()[0];
                        continueBlock#:6 = false;
                    };
                    if continueBlock#:6 {
                        first#:4 = 10;
                        continueBlock#:6 = false;
                    };
                    return vec4(float(10) + float(first#:4));
                } */
                vec4 V04ff7fdb(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    int first;
                    bool continueBlock = true;
                    if ((10 >= 1)) {
                        first = range_specialization_16893e00()[0];
                        continueBlock = false;
                    };
                    if (continueBlock) {
                        first = 10;
                        continueBlock = false;
                    };
                    return vec4((float(10) + float(first)));
                }
            `);
        });

        it('can figure out the length of a range', () => {
            expect(
                processOne(`
                // So for this, things would be simpler if we new that collect
                // starts as []. Right?
                // Like if we knew we could inline this into the 'range' dealio.
                // sooo I mean actually, we do know that we need to monoconstant
                // any functions that take an array as the argument, right?
                // eh, I dunno if there's a way to do this in a principled fashion.
                // should I just have range be a builtin? And have it be like the only
                // way that these things are done? And then have map be a builtin as well?
                // Like that would be a quick & easy way to do it ...
                // range(n) -> array of ints
                // map()    -> transform an array, easy to do
                // hmmmmmmm 
                const rec rangeInner = (n: int, collect: Array<int>): Array<int> => {
                    if n > 0 {
                        rangeInner(n - 1, <int>[...collect, n - 1])
                    } else {
                        collect
                    }
                };
                // Ok, so
                // maybe I'm distracted. Can I turn this ^
                // into

                // int[NULL] rangeInner_0aaff2a7(int n_0, int[NULL] collect_1) {
                //     for (; n_0 > 0; n_0 = (n_0 - 1)) {
                //         collect_1 = <array with spreads>;
                //         continue;
                //     };
                //     return collect_1;
                // }

                // int[N + n_0] rangeInner_0aaff2a7(int n_0, int[N] collect_1) {
                //     int[N + n_0] collect_2;
                //     arrayCopy(collect_1, collect_2, 0); // this could be an ir term, expands to the for loop
                //     for (; n_0 > 0; n_0 = (n_0 - 1)) {
                //         collect_2[n_0 + N] = n_0 - 1;
                //         continue;
                //     };
                //     return collect_2;
                // }

                // And then we monoconstant the n_0 and the N
                // And the arrayCopy goes away because collect_1 is empty
                // and then we're all set?

                // Ok, so we would detect:
                // x = [...x, other]
                // in a loop, right?
                // and we could say "we need a new plan"
                // that is x with length that is more than the loop
                // As long as there's only one x spread in the loop.
                // orrrrrrr
                // I guess we could technically account for any code paths.
                // hmmm like I think I need a transform function that does what
                // go does, where it will give you statements in blocks with
                // continuation indications.
                // so that you could follow the contents of the loop, separately
                // tracking the incremental increase in size for one or the other.

                // ok but what about loop unrolling?
                // so it would be great to detect that the loop contents are trivial, and so we
                // can unroll the loop. yeah that would be rad.

                const range = (n: int) => rangeInner(n, <int>[]);

                // Could I ... in some kind of good way ...
                // figure out that we're recursively building an array ...
                // and reduce this down to an imperative "push" kind of situation?
                // and then in glsl, we could .. hm . prefill the array,
                // and have the range be instead setting the values?
                // const rec rangeOne = (n: int): Array<int> => {
                //     if n > 0 {
                //         [...rangeOne(n - 1), n - 1]
                //     } else {
                //         <int>[]
                //     }
                // };

                (env: GLSLEnv, pos: Vec2) => {
                    const items = range(10);
                    const first = switch items {
                        [one, ...] => one,
                        _ => 10
                    };
                    vec4(len<int>(items) as float + first as float)
                }
            `),
            ).toMatchInlineSnapshot(`
                /* (): Array<int; 10> => {
                    const n#:0: int = 10;
                    const newArray#:5: Array<int; 10>;
                    const idx#:6: int = 0;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 + 1;
                        continue;
                    };
                    return newArray#:5;
                } */
                int[10] rangeInner_specialization_04f74044() {
                    int n = 10;
                    int[10] newArray;
                    int idx = 0;
                    for (; n > 0; n--) {
                        newArray[idx] = (n - 1);
                        idx++;
                        continue;
                    };
                    return newArray;
                }
                /* (): Array<int; 10> => rangeInner_specialization#😯👨‍👩‍👧😱() */
                int[10] range_specialization_691e29f4() {
                    return rangeInner_specialization_04f74044();
                }
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const first#:4: int;
                    const continueBlock#:6: bool = true;
                    if 10 >= 1 {
                        first#:4 = range_specialization#🐩🌑🥞😃()[0];
                        continueBlock#:6 = false;
                    };
                    if continueBlock#:6 {
                        first#:4 = 10;
                        continueBlock#:6 = false;
                    };
                    return vec4(float(10) + float(first#:4));
                } */
                vec4 Vfdb1f564(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    int first;
                    bool continueBlock = true;
                    if ((10 >= 1)) {
                        first = range_specialization_691e29f4()[0];
                        continueBlock = false;
                    };
                    if (continueBlock) {
                        first = 10;
                        continueBlock = false;
                    };
                    return vec4((float(10) + float(first)));
                }
            `);
        });

        it('can do some arrays', () => {
            expect(
                processOne(`
				(env: GLSLEnv, pos: Vec2) => {
					const items = [1, 2, 3];
					vec4(switch items {
						[] => 2.0,
						[n, m, ...] => n as float + m as float,
                        _ => 1.0
					})
				}
			`),
            ).toMatchInlineSnapshot(`
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const items#:2: Array<int; 3> = [1, 2, 3];
                    const result#:6: float;
                    const continueBlock#:7: bool = true;
                    if 3 == 0 {
                        result#:6 = 2;
                        continueBlock#:7 = false;
                    };
                    if continueBlock#:7 {
                        if 3 >= 2 {
                            result#:6 = float(items#:2[0]) + float(items#:2[1]);
                            continueBlock#:7 = false;
                        };
                        if continueBlock#:7 {
                            result#:6 = 1;
                            continueBlock#:7 = false;
                        };
                    };
                    return vec4(result#:6);
                } */
                vec4 V49b7324c(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    int[3] items = int[](1, 2, 3);
                    float result;
                    bool continueBlock = true;
                    if ((3 == 0)) {
                        result = 2.0;
                        continueBlock = false;
                    };
                    if (continueBlock) {
                        if ((3 >= 2)) {
                            result = (float(items[0]) + float(items[1]));
                            continueBlock = false;
                        };
                        if (continueBlock) {
                            result = 1.0;
                            continueBlock = false;
                        };
                    };
                    return vec4(result);
                }
            `);
        });

        it('can turn recursion into loop', () => {
            expect(
                processOne(
                    `
				const rec reduceRange = <T>(
					start: int,
					end: int,
					init: T,
					fn: (T, int) ={}> T,
				): T ={}> {
					if start >= end {
						init;
					} else {
						reduceRange#self<T>(start + 1, end, fn(init, start), fn);
					};
				}

				(env: GLSLEnv, pos: Vec2): Vec4 ={}> {
					vec4(reduceRange<float>(
						start: 0,
						end: 5,
						init: 1000.0,
						fn: (dist: float, i: int): float ={}> min(
							dist,
							length(
								v: pos 
									- vec2(
										x: i as float * 30.0 
											+ sin(env.time),
										y: i as float * 30.0,
									),
							) 
								- 10.0,
						),
					))
				}
				`,
                ),
            ).toMatchInlineSnapshot(`
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const start#:4: int = 0;
                    const init#:6: float = 1000;
                    const result#:8: float;
                    const continueBlock#:9: bool = true;
                    for (; start#:4 < 5; start#:4 = start#:4 + 1) {
                        init#:6 = min(init#:6, length(pos#:1 - vec2(float(start#:4) * 30 + sin(env#:0.#GLSLEnv#🕷️⚓😣😃#0), float(start#:4) * 30)) - 10);
                        continue;
                    };
                    if continueBlock#:9 {
                        result#:8 = init#:6;
                        continueBlock#:9 = false;
                    };
                    return vec4(result#:8);
                } */
                vec4 V0a089f74(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    int start = 0;
                    float init = 1000.0;
                    float result;
                    bool continueBlock = true;
                    for (; start < 5; start++) {
                        init = min(init, (length((pos_1 - vec2(((float(start) * 30.0) + sin(env_0.time)), (float(start) * 30.0)))) - 10.0));
                        continue;
                    };
                    if (continueBlock) {
                        result = init;
                        continueBlock = false;
                    };
                    return vec4(result);
                }
            `);
        });

        it('can handle generics', () => {
            expect(
                processOne(
                    `
                    type X<A> = {name: A, age: int};
				(env: GLSLEnv, pos: Vec2): Vec4 ={}> {
                    const m = X<int>{name: 10 + 2 / 23, age: 2};
                    vec4(m.name as float, m.age as float, m.name as float, 2.3)
				}
				`,
                ),
            ).toMatchInlineSnapshot(`
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const m#:2: unnamed#🎽🤦🎃 = RECORDNOTFOUND;
                    return vec4(float(m#:2.#unnamed#🎽🤦🎃#0), float(m#:2.#unnamed#🎽🤦🎃#1), float(m#:2.#unnamed#🎽🤦🎃#0), 2.3);
                } */
                vec4 Va5e41384(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    T3b93e3eb m = T3b93e3eb(10, 2);
                    return vec4(float(m.h3b93e3eb_0), float(m.h3b93e3eb_1), float(m.h3b93e3eb_0), 2.30);
                }
            `);
        });

        it('can handle tuples and such', () => {
            expect(
                processOne(
                    `
				(env: GLSLEnv, pos: Vec2): Vec4 ={}> {
                    const m = (1 + 2, 2.0);
                    vec4(m.0 as float + m.0 as float)
				}
				`,
                ),
            ).toMatchInlineSnapshot(`
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const m#:2: unnamed#⛱️👶🥬 = RECORDNOTFOUND;
                    return vec4(float(m#:2.#unnamed#⛱️👶🥬#0) + float(m#:2.#unnamed#⛱️👶🥬#0));
                } */
                vec4 V21d793a2(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    T28531bb0 m = T28531bb0(3, 2.0);
                    return vec4((float(m.h28531bb0_0) + float(m.h28531bb0_0)));
                }
            `);
        });

        it('can handle tuples as function return values', () => {
            expect(
                processOne(
                    `
                    const makeIt = (n: int, m: (int, float)) => (n + m.1 as int, (n + m.0) as float);
                    (env: GLSLEnv, pos: Vec2): Vec4 ={}> {
                        const m = makeIt(2, (1, 4.0));
                        vec4(m.0 as float + m.1)
                    }
				`,
                ),
            ).toMatchInlineSnapshot(`
                /* (n#:0: int, m#:1: unnamed#🥑🛵🐅😃): unnamed#🌯👱‍♂️🍸 => RECORDNOTFOUND */
                T2d73729e makeIt_4c8c66ea(int n_0, T5fdd0e7e m_1) {
                    return T2d73729e((n_0 + int(m_1.h5fdd0e7e_1)), float((n_0 + m_1.h5fdd0e7e_0)));
                }
                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const m#:2: unnamed#🌯👱‍♂️🍸 = makeIt#🌐🏙️👦😃(2, RECORDNOTFOUND);
                    return vec4(float(m#:2.#unnamed#🌯👱‍♂️🍸#0) + m#:2.#unnamed#🌯👱‍♂️🍸#1);
                } */
                vec4 V21439752(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    T2d73729e m = makeIt_4c8c66ea(2, T58122424(1, 4.0));
                    return vec4((float(m.h2d73729e_0) + m.h2d73729e_1));
                }
            `);
        });
    });

    it.skip('can print to opengl2', () => {
        throw new Error('nope it cant');
    });

    it('full shader output works', () => {
        expect(
            process(`
		@ffi
		@main
		const res = (env: GLSLEnv, pos: Vec2) => vec4(1.0)
		`),
        ).toMatchInlineSnapshot(`
            #version 300 es
            precision mediump float;
            out vec4 fragColor;
            const float PI = 3.14159;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform int u_mousebutton;
            uniform vec3 u_camera;
            uniform vec2 u_resolution;
            struct GLSLEnv_451d5252{
                float time;
                vec2 resolution;
                vec3 camera;
                vec2 mouse;
            };
            /**
            \`\`\`
            const res#498ef43c = (env#:0: GLSLEnv#451d5252, pos#:1: Vec2#43802a16): Vec4#3b941378 ={}> vec4#72fca9b4(
                x: 1.0,
            )
            \`\`\`
            */
            /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => vec4(
                1,
            ) */
            vec4 res_498ef43c(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                return vec4(1.0);
            }
            void main() {
                fragColor = res_498ef43c(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
            }
        `);
        // yes
    });
});
