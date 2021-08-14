// This is for testing things that we can print to typescript

import { parse } from '../parsing/parser';
import { printToString } from './printer';
import { toplevelToPretty } from './printTsLike';
import { fileToGlsl } from './glslPrinter';
import { addToplevelToEnv, typeToplevelT } from '../typing/env';
import { presetEnv } from '../typing/preset';
import { newWithGlobal, Term } from '../typing/types';
import { loadInit } from './loadPrelude';
import { typeFile } from '../typing/typeFile';

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
    // const result: Array<string> = [];
    // const expressions: Array<Term> = [];
    // toplevels.forEach((rawTop) => {
    //     const top = typeToplevelT(env, rawTop);
    //     const res = addToplevelToEnv(env, top);
    //     env = res.env;
    //     if (top.type === 'Expression') {
    //         expressions.push(top.term);
    //     }
    // });
    return fileToGlsl(expressions, env, { includeCanonicalNames: true }, {})
        .text;
};

describe('glslPrinter', () => {
    it('works', () => {
        expect(
            process(`
		@ffi
		@main
		const res = (env: GLSLEnv, pos: Vec2) => vec4(1.0)
		`),
        ).toMatchInlineSnapshot(`
            "#version 300 es
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
            /*(env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec2#🐭😉😵😃): Vec4#🕒🧑‍🏫🎃 => vec4(
                1,
            )*/vec4 res_498ef43c(GLSLEnv_451d5252 env_0, vec2 pos_1) {
                return vec4(1.0);
            }
            void main() {
                fragColor = res_498ef43c(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
            }"
        `);
        // yes
    });
});
