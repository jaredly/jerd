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

        it('cant do arrays', () => {
            expect(
                processOne(`
				(env: GLSLEnv, pos: Vec2) => {
					const items = [1, 2, 3];
					vec4(switch items {
						[] => 2.0,
						[n, ...] => n as float
					})
				}
			`),
            ).toMatchInlineSnapshot(`
                INVALID GLSL:
                - Invalid GLSL at 4:18-4:23: Array length not inferrable
                - Invalid GLSL at 4:18-4:23: Array length not inferrable
                - Invalid GLSL at 4:18-4:23: Array length not inferrable

                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => {
                    const items#:2: Array<int, {"type":"exactly","size":3}> = [1, 2, 3];
                    const result#:5: float;
                    const continueBlock#:6: bool = true;
                    if len(items#:2) == 0 {
                        result#:5 = 2;
                        continueBlock#:6 = false;
                    };
                    if continueBlock#:6 {
                        if len(items#:2) >= 1 {
                            result#:5 = float(items#:2[0]);
                            continueBlock#:6 = false;
                        };
                        if continueBlock#:6 {
                            match_fail!();
                        };
                    };
                    return vec4(result#:5);
                } */
                vec4 V404e7e22(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    int[3] items = int[](1, 2, 3);
                    float result;
                    bool continueBlock = true;
                    if ((items.length() == 0)) {
                        result = 2.0;
                        continueBlock = false;
                    };
                    if (continueBlock) {
                        if ((items.length() >= 1)) {
                            result = float(items[0]);
                            continueBlock = false;
                        };
                        if (continueBlock) {
                            // match fail;
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
                    const m = (1, 2.0);
                    vec4(m.0 as float)
				}
				`,
                ),
            ).toMatchInlineSnapshot(`
                INVALID GLSL:
                - Invalid GLSL at 3:31-3:39: No un-monomorphized type variables allowed

                /* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => vec4(float((1, 2).0)) */
                vec4 Vf85fe002(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                    return vec4(float(tuples_not_supported[0]));
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
