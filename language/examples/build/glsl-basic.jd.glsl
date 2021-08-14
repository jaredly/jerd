#version 300 es
precision mediump float;
out vec4 fragColor;
const float PI = 3.14159;
uniform float u_time;
uniform vec2 u_mouse;
uniform int u_mousebutton;
uniform vec3 u_camera;
uniform vec2 u_resolution;
// skipping As_As, contains type variables
// skipping Min_74a2078f, contains type variables
struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};
// skipping AddSub_b99b22d8, contains type variables
struct Circle_580f64c6{
    vec2 h580f64c6_0;
    float h580f64c6_1;
};
/**
```
const circleSDF#16a14c3a = (p#:0: Vec2#43802a16, circle#:1: Circle#580f64c6): float#builtin ={}> {
    length#c2805852(v: p#:0 -#70bb2056#b99b22d8#1 circle#:1.pos#580f64c6#0) 
        -#builtin circle#:1.r#580f64c6#1;
}
```
*/
/* (
    p#:0: Vec2#🐭😉😵😃,
    circle#:1: Circle#👶🏈🧑‍🦽😃,
): float => length(p#:0 - circle#:1.#Circle#👶🏈🧑‍🦽😃#0) - circle#:1.#Circle#👶🏈🧑‍🦽😃#1 */
float circleSDF_16a14c3a(vec2 p_0, Circle_580f64c6 circle_1) {
    return (length((p_0 - circle_1.h580f64c6_0)) - circle_1.h580f64c6_1);
}
/**
```
const hello#c303e69c = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const circle#:2 = Circle#580f64c6{
        pos#580f64c6#0: env#:0.mouse#451d5252#3,
        r#580f64c6#1: 40.0 
            +#builtin cos#builtin(env#:0.time#451d5252#0 *#builtin 4.0) *#builtin 20.0,
    };
    const color#:4 = if circleSDF#16a14c3a(p: fragCoord#:1, circle#:2) 
            --#e16e0d58#74a2078f#0 circleSDF#16a14c3a(
                p: fragCoord#:1,
                circle: Circle#580f64c6{
                    pos#580f64c6#0: env#:0.mouse#451d5252#3 
                        +#70bb2056#b99b22d8#0 Vec2#43802a16{
                            x#43802a16#0: 10.0,
                            y#43802a16#1: 20.0,
                        },
                    r#580f64c6#1: 30.0,
                },
            ) 
        <#builtin 0.0 {
        switch modInt#builtin(fragCoord#:1.x#43802a16#0 as#184a69ed int#builtin, 2) {
            0 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
            _#:3 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
        };
    } else {
        abs#1a074578(v: Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: -1.0});
    };
    Vec4#3b941378{...color#:4, w#3b941378#0: 1.0};
}
```
*/
/* (
    env#:0: GLSLEnv#🕷️⚓😣😃,
    fragCoord#:1: Vec2#🐭😉😵😃,
): Vec4#🕒🧑‍🏫🎃 => {
    const color#:4: Vec3#🐬;
    if min(
        circleSDF#🤠😓🧟‍♀️(fragCoord#:1, Circle#👶🏈🧑‍🦽😃{TODO SPREADs}{h580f64c6_0: env#:0.#GLSLEnv#🕷️⚓😣😃#3, h580f64c6_1: 40 + cos(env#:0.#GLSLEnv#🕷️⚓😣😃#0 * 4) * 20}),
        circleSDF#🤠😓🧟‍♀️(fragCoord#:1, Circle#👶🏈🧑‍🦽😃{TODO SPREADs}{h580f64c6_0: env#:0.#GLSLEnv#🕷️⚓😣😃#3 + Vec2#🐭😉😵😃{TODO SPREADs}{x: 10, y: 20}, h580f64c6_1: 30}),
    ) < 0 {
        const result#:7: Vec3#🐬;
        const continueBlock#:8: bool = true;
        if int(fragCoord#:1.#Vec2#🐭😉😵😃#0) modInt 2 == 0 {
            result#:7 = Vec3#🐬{TODO SPREADs}{z: 0, x: 1, y: 0};
            continueBlock#:8 = false;
        };
        if continueBlock#:8 {
            result#:7 = Vec3#🐬{TODO SPREADs}{z: 0, x: 1, y: 1};
            continueBlock#:8 = false;
        };
        color#:4 = result#:7;
    } else {
        color#:4 = abs(Vec3#🐬{TODO SPREADs}{z: -1, x: 1, y: 1});
    };
    return Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: color#:4.#Vec3#🐬#0};
} */
vec4 hello_c303e69c(GLSLEnv_451d5252 env_0, vec2 fragCoord_1) {
    vec3 color;
    if ((min(
        circleSDF_16a14c3a(fragCoord_1, Circle_580f64c6(env_0.mouse, (40.0 + (cos((env_0.time * 4.0)) * 20.0)))),
        circleSDF_16a14c3a(fragCoord_1, Circle_580f64c6((env_0.mouse + vec2(10.0, 20.0)), 30.0))
    ) < 0.0)) {
        vec3 result;
        bool continueBlock = true;
        if ((int(fragCoord_1.x) % 2) == 0) {
            result = vec3(1.0, 0.0, 0.0);
            continueBlock = false;
        };
        if (continueBlock) {
            result = vec3(1.0, 1.0, 0.0);
            continueBlock = false;
        };
        color = result;
    } else {
        color = abs(vec3(1.0, 1.0, -1.0));
    };
    return vec4(color.x, color.y, color.z, 1.0);
}
void main() {
    fragColor = hello_c303e69c(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
}