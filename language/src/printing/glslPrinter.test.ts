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
import { debugExpr, hashToEmoji } from './irDebugPrinter';

export const rawSnapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && typeof value === 'string';
    },
    print(value, _, __) {
        return value as string;
    },
};

expect.addSnapshotSerializer(rawSnapshotSerializer);

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
    env.global.idNames[idName(mainId)] = 'toplevel';

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
                    `\nINVALID GLSL:\n` +
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
    it('it should know about builtin types', () => {
        // NOTE: If this is failing, you probably need to run
        // `yarn prelude-types`
        expect(processOne(`vec2(2.0, 2.0)`)).toMatchInlineSnapshot(
            `/*vec2(2, 2)*/const vec2 toplevel_d1db03ce = vec2(2.0, 2.0);`,
        );
    });

    it('should be able to add vec2s', () => {
        expect(
            processOne(`vec2(2.0, 2.0) + vec2(3.0, 1.0)`),
        ).toMatchInlineSnapshot(
            `/*vec2(2, 2) + vec2(3, 1)*/const vec2 toplevel_486959fe = (vec2(2.0, 2.0) + vec2(3.0, 1.0));`,
        );
    });

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
                float thing_5461dc4c(int n_0) {
                    return float((n_0 * 2));
                }
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => vec4(vec3(pos#:1, thing#😥💖👰‍♀️😃(23)), 1) */
                vec4 toplevel_7da04efa(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    return vec4(vec3(pos_1, thing_5461dc4c(23)), 1.0);
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
                float toplevel_lambda_401795b0(int n_0) {
                    return (float(n_0) + 1.20);
                }
                /* (): float => toplevel_lambda#🤸‍♀️👩‍👧😃😃(2) + 2.3 */
                float basic_specialization_ed5118a0() {
                    return (toplevel_lambda_401795b0(2) + 2.30);
                }
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => vec4(basic_specialization#🤘()) */
                vec4 toplevel_428e330a(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    return vec4(basic_specialization_ed5118a0());
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
                            return awesome#🍃(n#:0 / 2) + 1;
                        } else {
                            return awesome#🍃(n#:0 * 3 + 1) + 1;
                        };
                    };
                } */
                int awesome_92580e6c(int n_0) {
                    if ((n_0 <= 1)) {
                        return 1;
                    } else {
                        if (((n_0 % 2) == 0)) {
                            return (awesome_92580e6c((n_0 / 2)) + 1);
                        } else {
                            return (awesome_92580e6c(((n_0 * 3) + 1)) + 1);
                        };
                    };
                }
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => vec4(float(awesome#🍃(3))) */
                vec4 toplevel_350d2344(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    return vec4(float(awesome_92580e6c(3)));
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

        it('should be able to collapse array len', () => {
            expect(
                processOne(`(a: int) => {
                const v = <int>[1,2,3];
                len<int>(v) + a
            }`),
            ).toMatchInlineSnapshot(`
                /* (a#:0: int): int => 3 + a#:0 */
                int toplevel_16913e28(int a_0) {
                    return (3 + a_0);
                }
            `);
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
            spy.push(`####### [ start new opt ] #######`);
            spy.push(printToString(debugExpr(ctx.env, expr), 100));
            for (let i = 0; i < 50; i++) {
                let start = expr;
                glslOpts.forEach((opt) => {
                    ctx.notes = [];
                    const post = opt(ctx, expr);
                    if (post !== expr) {
                        spy.push(
                            `# [${nameForOpt(opt)}]\n${printToString(
                                debugExpr(ctx.env, post),
                                100,
                            )}`,
                        );
                    } else if (ctx.notes.length) {
                        spy.push(
                            `# [${nameForOpt(opt)}]\n - ${ctx.notes.join(
                                '\n - ',
                            )}`,
                        );
                    }
                    ctx.notes = null;
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

        // -------------------------------
        // START HERE: This all breaks somehow
        // if I make a map alias that doesn't need the collect arg
        // It looks like maybe we're inferring an array size as zero,
        // when at array does have a spread reassignment.
        // I thought we prevented that.
        //
        // Ok yeah, when applying arguments to an inline function,
        // before propagating the size, we need to verify that it's allowed.
        // Otherwise, we'll need to actually ditch the size info I think 🤔
        //
        // Yeah, hm so maybe this goes for any place where we're transforming inferred sizes?
        // Like, I probably should have an inferred size type that is "variable", so that
        // I know not to override it.

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
                const map = <T, R>(values: Array<T>, fn: (T) => R) => map<T, R>(values, fn, <R>[]);
                (env: GLSLEnv, pos: Vec2) => {
                    const circles = map<int, float>(range(10), (i: int) => {
                        const at = env.resolution / 10.0 * (i as float);
                        length(pos - at) - (i as float * 10.0)
                    });
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
                float toplevel_lambda_63d89fa0(float one_0, float two_1) {
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
                int[10] rangeInner_specialization_42f846d8() {
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

                /* (items#:0: Array<float; size#:9>, init#:1: float): float => {
                    const items_i#:10: int = 0;
                    loop(unbounded) {
                        if len(items#:0) - items_i#:10 == 0 {
                            return init#:1;
                        };
                        if len(items#:0) - items_i#:10 >= 1 {
                            const recur#:7: float = toplevel_lambda#⛅🦡🐍😃(init#:1, items#:0[items_i#:10]);
                            items_i#:10 = items_i#:10 + 1;
                            init#:1 = recur#:7;
                            continue;
                        };
                        match_fail!();
                    };
                } */
                float Ve39686d0(float[size_9] items_0, float init_1) {
                    int items_i = 0;
                    for (int i=0; i<10000; i++) {
                        if (((items_0.length() - items_i) == 0)) {
                            return init_1;
                        };
                        if (((items_0.length() - items_i) >= 1)) {
                            float recur = toplevel_lambda_63d89fa0(init_1, items_0[items_i]);
                            items_i++;
                            init_1 = recur;
                            continue;
                        };
                        // match fail;
                    };
                }
                /* (): Array<int; 10> => rangeInner_specialization#🍹🦙😷😃() */
                int[10] range_specialization_db2201b8() {
                    return rangeInner_specialization_42f846d8();
                }

                INVALID GLSL:
                - Invalid GLSL at 12:28-12:34: Array length not inferrable
                - Invalid GLSL at 13:31-13:38: Array length not inferrable
                - Invalid GLSL at 12:28-12:34: Array length not inferrable
                - Invalid GLSL at 12:28-12:34: Array length not inferrable
                - Invalid GLSL at 14:68-14:92: Spreads not supported in arrays
                - Invalid GLSL at 14:68-14:92: Array length not inferrable
                - Invalid GLSL at 14:75-14:82: Array length not inferrable
                - Invalid GLSL at 16:71-16:74: Array length not inferrable

                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
                    const values#:10: Array<int; 10> = range_specialization#🤾‍♂️();
                    const collect#:12: Array<float; 0> = [];
                    const result#:15: Array<float>;
                    const values_i#:13: int = 0;
                    loop(unbounded) {
                        if len(values#:10) - values_i#:13 == 0 {
                            result#:15 = collect#:12;
                            break;
                        };
                        if len(values#:10) - values_i#:13 >= 1 {
                            const i#:17: [var]T#:0 = values#:10[values_i#:13];
                            values_i#:13 = values_i#:13 + 1;
                            collect#:12 = [...collect#:12, length(pos#:1 - env#:0.#GLSLEnv#🏏#1 / 10 * float(i#:17)) - float(i#:17) * 10];
                            continue;
                        };
                        match_fail!();
                    };
                    if unnamed#🍼(result#:15, 1000) < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                } */
                vec4 toplevel_c73fd942(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    int[10] values = range_specialization_db2201b8();
                    float[0] collect = float[]();
                    float[NULL] result;
                    int values_i = 0;
                    for (int i=0; i<10000; i++) {
                        if (((values.length() - values_i) == 0)) {
                            result = collect;
                            break;
                        };
                        if (((values.length() - values_i) >= 1)) {
                            invalid_var:T_0 i = values[values_i];
                            values_i++;
                            collect = ArrayWithSpreads<null>[...collect, (length((pos_1 - ((env_0.resolution / 10.0) * float(i)))) - (float(i) * 10.0))];
                            continue;
                        };
                        // match fail;
                    };
                    if ((Ve39686d0(result, 1000.0) < 0.0)) {
                        return vec4(1.0);
                    } else {
                        return vec4(0.0);
                    };
                }
            `);
        });

        it('should be able to reduce with a bounded loop', () => {
            const listened: Array<string> = [];
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
                () => reduce<int, float>(range(10), 0.0, (v: float, i: int) => v + i as float)
            `,
                    spyingOptimizer(listened),
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
                int[10] rangeInner_specialization_42f846d8() {
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
                /* (v#:0: float, i#:1: int): float => v#:0 + float(i#:1) */
                float toplevel_lambda_dd8c017c(float v_0, int i_1) {
                    return (v_0 + float(i_1));
                }
                /* (): Array<int; 10> => rangeInner_specialization#🍹🦙😷😃() */
                int[10] range_specialization_db2201b8() {
                    return rangeInner_specialization_42f846d8();
                }
                /* (items#:0: Array<int; 10>, init#:1: float): float => {
                    const items_i#:10: int = 0;
                    loop(unbounded) {
                        if 10 - items_i#:10 == 0 {
                            return init#:1;
                        };
                        if 10 - items_i#:10 >= 1 {
                            const recur#:7: float = toplevel_lambda#👩‍🦯(init#:1, items#:0[items_i#:10]);
                            items_i#:10 = items_i#:10 + 1;
                            init#:1 = recur#:7;
                            continue;
                        };
                        match_fail!();
                    };
                } */
                float undefined_specialization_5b876a5b(int[10] items_0, float init_1) {
                    int items_i = 0;
                    for (int i=0; i<10000; i++) {
                        if (((10 - items_i) == 0)) {
                            return init_1;
                        };
                        if (((10 - items_i) >= 1)) {
                            float recur = toplevel_lambda_dd8c017c(init_1, items_0[items_i]);
                            items_i++;
                            init_1 = recur;
                            continue;
                        };
                        // match fail;
                    };
                }
                /* (): float => undefined_specialization#🌹👩‍👩‍👧🤾‍♂️😃(range_specialization#🤾‍♂️(), 0) */
                float toplevel_4b753882() {
                    return undefined_specialization_5b876a5b(range_specialization_db2201b8(), 0.0);
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
                (env: GLSLEnv, pos: Vec2) => {
                    const mv = reduce<int, float>(range(10), 1000.0, (current: float, i: int) => {
                        const at = env.resolution / 10.0 * (i as float);
                        min(current, length(pos - at) - (i as float * 10.0))
                    });

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
                int[10] rangeInner_specialization_42f846d8() {
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
                /* (): Array<int; 10> => rangeInner_specialization#🍹🦙😷😃() */
                int[10] range_specialization_db2201b8() {
                    return rangeInner_specialization_42f846d8();
                }
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
                    const items#:6: Array<int; 10> = range_specialization#🤾‍♂️();
                    const init#:7: float = 1000;
                    const items_i#:9: int = 0;
                    for (; items_i#:9 <= 10; items_i#:9 = items_i#:9 + 1) {
                        const i#:14: int = items#:6[items_i#:9];
                        init#:7 = min(init#:7, length(pos#:1 - env#:0.#GLSLEnv#🏏#1 / 10 * float(i#:14)) - float(i#:14) * 10);
                        continue;
                    };
                    if init#:7 < 0 {
                        return vec4(1);
                    } else {
                        return vec4(0);
                    };
                } */
                vec4 toplevel_432e01aa(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    int[10] items = range_specialization_db2201b8();
                    float init = 1000.0;
                    int items_i = 0;
                    for (; items_i <= 10; items_i++) {
                        int i = items[items_i];
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
                int[10] rangeInner_specialization_42f846d8() {
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
                /* (): Array<int; 10> => rangeInner_specialization#🍹🦙😷😃() */
                int[10] range_specialization_db2201b8() {
                    return rangeInner_specialization_42f846d8();
                }
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
                    const first#:4: int;
                    const continueBlock#:6: bool = true;
                    if 10 >= 1 {
                        first#:4 = range_specialization#🤾‍♂️()[0];
                        continueBlock#:6 = false;
                    };
                    if continueBlock#:6 {
                        first#:4 = 10;
                        continueBlock#:6 = false;
                    };
                    return vec4(float(10) + float(first#:4));
                } */
                vec4 toplevel_5fdf92f4(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    int first;
                    bool continueBlock = true;
                    if ((10 >= 1)) {
                        first = range_specialization_db2201b8()[0];
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
                int[10] rangeInner_specialization_5138eb98() {
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
                /* (): Array<int; 10> => rangeInner_specialization#🌝🐊🧑‍🏭😃() */
                int[10] range_specialization_3358031c() {
                    return rangeInner_specialization_5138eb98();
                }
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
                    const first#:4: int;
                    const continueBlock#:6: bool = true;
                    if 10 >= 1 {
                        first#:4 = range_specialization#🌆🐎🚑()[0];
                        continueBlock#:6 = false;
                    };
                    if continueBlock#:6 {
                        first#:4 = 10;
                        continueBlock#:6 = false;
                    };
                    return vec4(float(10) + float(first#:4));
                } */
                vec4 toplevel_73e88e7c(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    int first;
                    bool continueBlock = true;
                    if ((10 >= 1)) {
                        first = range_specialization_3358031c()[0];
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
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
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
                vec4 toplevel_adb93658(GLSLEnv_a25a17de env_0, vec2 pos_1) {
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
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
                    const start#:4: int = 0;
                    const init#:6: float = 1000;
                    const result#:8: float;
                    const continueBlock#:9: bool = true;
                    for (; start#:4 < 5; start#:4 = start#:4 + 1) {
                        init#:6 = min(init#:6, length(pos#:1 - vec2(float(start#:4) * 30 + sin(env#:0.#GLSLEnv#🏏#0), float(start#:4) * 30)) - 10);
                        continue;
                    };
                    if continueBlock#:9 {
                        result#:8 = init#:6;
                        continueBlock#:9 = false;
                    };
                    return vec4(result#:8);
                } */
                vec4 toplevel_5a451e7c(GLSLEnv_a25a17de env_0, vec2 pos_1) {
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
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
                    const m#:2: unnamed#🚐🌘👩‍🏫 = RECORDNOTFOUND;
                    return vec4(float(m#:2.#unnamed#🚐🌘👩‍🏫#0), float(m#:2.#unnamed#🚐🌘👩‍🏫#1), float(m#:2.#unnamed#🚐🌘👩‍🏫#0), 2.3);
                } */
                vec4 toplevel_77150cfa(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    T106e4734 m = T106e4734(10, 2);
                    return vec4(float(m.h106e4734_0), float(m.h106e4734_1), float(m.h106e4734_0), 2.30);
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
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
                    const m#:2: unnamed#🌕 = RECORDNOTFOUND;
                    return vec4(float(m#:2.#unnamed#🌕#0) + float(m#:2.#unnamed#🌕#0));
                } */
                vec4 toplevel_7ec2fa1b(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    T8dbd478e m = T8dbd478e(3, 2.0);
                    return vec4((float(m.h8dbd478e_0) + float(m.h8dbd478e_0)));
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
                /* (n#:0: int, m#:1: unnamed#🌕): unnamed#🌕 => RECORDNOTFOUND */
                T8dbd478e makeIt_092ba55c(int n_0, T8dbd478e m_1) {
                    return T8dbd478e((n_0 + int(m_1.h8dbd478e_1)), float((n_0 + m_1.h8dbd478e_0)));
                }
                /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
                    const m#:2: unnamed#🌕 = makeIt#🧛🌏🗨️(2, RECORDNOTFOUND);
                    return vec4(float(m#:2.#unnamed#🌕#0) + m#:2.#unnamed#🌕#1);
                } */
                vec4 toplevel_2c109762(GLSLEnv_a25a17de env_0, vec2 pos_1) {
                    T8dbd478e m = makeIt_092ba55c(2, T8dbd478e(1, 4.0));
                    return vec4((float(m.h8dbd478e_0) + m.h8dbd478e_1));
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
            /* struct GLSLEnv#🏏 {
                time: float;
                resolution: Vec2#🍱🐶💣;
                camera: Vec3#😦;
                mouse: Vec2#🍱🐶💣;
            } */
            struct GLSLEnv_a25a17de{
                float time;
                vec2 resolution;
                vec3 camera;
                vec2 mouse;
            };
            /**
            \`\`\`
            const res#a38570e0 = (env#:0: GLSLEnv#a25a17de, pos#:1: Vec2#08f7c2ac): Vec4#b1f05ae8 ={}> vec4#ba091e3e(
                x: 1.0,
            )
            \`\`\`
            */
            /* (env#:0: GLSLEnv#🏏, pos#:1: Vec2#🍱🐶💣): Vec4#🌎 => vec4(1) */
            vec4 res_a38570e0(
                GLSLEnv_a25a17de env_0,
                vec2 pos_1
            ) {
                return vec4(1.0);
            }
            void main() {
                fragColor = res_a38570e0(GLSLEnv_a25a17de(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
            }
        `);
        // yes
    });
});
