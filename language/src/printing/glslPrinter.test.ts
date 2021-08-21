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

const processOne = (raw: string) => {
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
        defaultOptimizer,
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
                const rec rangeOne = (n: int): Array<int> => {
                    if n > 0 {
                        [...rangeOne(n - 1), n - 1]
                    } else {
                        <int>[]
                    }
                };

                (env: GLSLEnv, pos: Vec2) => {
                    const items = range(10);
                    vec4(len<int>(items) as float)
                }
            `),
            ).toMatchInlineSnapshot(`
                INVALID GLSL:
                - Invalid GLSL at 18:25-18:32: Array length not inferrable

                /* (n#:0: int, collect#:1: Array<int, {"type":"variable","sym":{"name":"size","unique":4}}>): Array<int, {"type":"relative","offset":{"type":"constant","sym":{"name":"n","unique":0}},"to":{"type":"variable","sym":{"name":"size","unique":4}}}> => {
                    const newArray#:5: Array<int, {"type":"relative","offset":{"type":"constant","sym":{"name":"n","unique":0}},"to":{"type":"variable","sym":{"name":"size","unique":4}}}>;
                    const idx#:6: int = 0;
                    for (; n#:0 > 0; n#:0 = n#:0 - 1) {
                        newArray#:5[idx#:6] = n#:0 - 1;
                        idx#:6 = idx#:6 + 1;
                        continue;
                    };
                    return newArray#:5;
                } */
                int[size_4 + n_0] rangeInner_0aaff2a7(int n_0, int[size_4] collect_1) {
                    int[size_4 + n_0] newArray;
                    int idx = 0;
                    for (; n_0 > 0; n_0 = (n_0 - 1)) {
                        newArray[idx] = (n_0 - 1);
                        idx = (idx + 1);
                        continue;
                    };
                    return newArray;
                }
                INVALID GLSL:
                - Invalid GLSL at 65:43-65:53: Array length not inferrable

                /* (n#:0: int): Array<int> => rangeInner#🥗♥️✊(n#:0, []) */
                int[NULL] range_6cecd922(int n_0) {
                    return rangeInner_0aaff2a7(n_0, int[]());
                }
                INVALID GLSL:
                - Invalid GLSL at 81:35-81:40: Array length not inferrable

                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => vec4(float(len(range#🧑‍🎨🚒🍮😃(10)))) */
                vec4 V63549a30(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    return vec4(float(len(range_6cecd922(10))));
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
                    const items#:2: Array<int, {"type":"exactly","size":3}> = [1, 2, 3];
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
                    for (; start < 5; start = (start + 1)) {
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
                    T3b93e3eb m = T3b93e3eb((10 + (2 / 23)), 2);
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
                    T28531bb0 m = T28531bb0((1 + 2), 2.0);
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
