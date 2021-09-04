#version 300 es
precision mediump float;
out vec4 fragColor;
const float PI = 3.14159;
uniform sampler2D u_buffer0;
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
// skipping Mul_1de4e4c0, contains type variables
// skipping AddSub_b99b22d8, contains type variables
// skipping Div_5ac12902, contains type variables
/**
```
const normalizeTheta#c3a71e42 = (t#:0: float#builtin): float#builtin ={}> if t#:0 
    >#builtin PI#builtin {
    t#:0 -#builtin TWO_PI#fc1474ce;
} else if t#:0 <#builtin -PI#builtin {
    t#:0 +#builtin TWO_PI#fc1474ce;
} else {
    t#:0;
}
```
*/
/* (
    t#:0: float,
): float => {
    if t#:0 > PI {
        return t#:0 - PI * 2;
    } else {
        if t#:0 < -PI {
            return t#:0 + PI * 2;
        } else {
            return t#:0;
        };
    };
} */
float normalizeTheta_c3a71e42(float t_0) {
    if ((t_0 > PI)) {
        return (t_0 - (PI * 2.0));
    } else {
        if ((t_0 < -PI)) {
            return (t_0 + (PI * 2.0));
        } else {
            return t_0;
        };
    };
}
/* *
```
const r2#0ce717e6 = 100.0
```
 */
/*100*/const float r2_0ce717e6 = 100.0;
/* *
```
const m2#b48c60a0 = 20.0
```
 */
/*20*/const float m2_b48c60a0 = 20.0;
/* *
```
const g#4466af4c = 0.15
```
 */
/*0.15*/const float g_4466af4c = 0.150;
/* *
```
const MaxVelocity#158e986a = 0.1
```
 */
/*0.1*/const float MaxVelocity_158e986a = 0.10;
/**
```
const max#e8162c1c = (v#:0: Vec2#43802a16): float#builtin ={}> {
    max#builtin(v#:0.x#43802a16#0, v#:0.y#43802a16#1);
}
```
*/
/* (v#:0: Vec2#🐭😉😵😃): float => max(
    v#:0.#Vec2#🐭😉😵😃#0,
    v#:0.#Vec2#🐭😉😵😃#1,
) */
float max_e8162c1c(vec2 v_0) {
    return max(v_0.x, v_0.y);
}
/**
```
const update#74a18562 = (
    a1#:0: float#builtin,
    a2#:1: float#builtin,
    a1_v#:2: float#builtin,
    a2_v#:3: float#builtin,
): Vec4#3b941378 ={}> {
    const num1#:4 = -g#4466af4c *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0) 
        *#builtin sin#builtin(a1#:0);
    const num2#:5 = -m2#b48c60a0 *#builtin g#4466af4c 
        *#builtin sin#builtin(a1#:0 -#builtin 2.0 *#builtin a2#:1);
    const num3#:6 = -2.0 *#builtin sin#builtin(a1#:0 -#builtin a2#:1) *#builtin m2#b48c60a0;
    const num4#:7 = a2_v#:3 *#builtin a2_v#:3 *#builtin r2#0ce717e6 
        +#builtin a1_v#:2 *#builtin a1_v#:2 *#builtin r2#0ce717e6 
            *#builtin cos#builtin(a1#:0 -#builtin a2#:1);
    const den#:8 = r2#0ce717e6 
        *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0 
            -#builtin m2#b48c60a0 
                *#builtin cos#builtin(2.0 *#builtin a1#:0 -#builtin 2.0 *#builtin a2#:1));
    const a1_a#:9 = (num1#:4 +#builtin num2#:5 +#builtin num3#:6 *#builtin num4#:7) /#builtin den#:8;
    const num1#:10 = 2.0 *#builtin sin#builtin(a1#:0 -#builtin a2#:1);
    const num2#:11 = a1_v#:2 *#builtin a1_v#:2 *#builtin r2#0ce717e6 
        *#builtin (m2#b48c60a0 +#builtin m2#b48c60a0);
    const num3#:12 = g#4466af4c *#builtin (m2#b48c60a0 +#builtin m2#b48c60a0) 
        *#builtin cos#builtin(a1#:0);
    const num4#:13 = a2_v#:3 *#builtin a2_v#:3 *#builtin r2#0ce717e6 *#builtin m2#b48c60a0 
        *#builtin cos#builtin(a1#:0 -#builtin a2#:1);
    const den#:14 = r2#0ce717e6 
        *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0 
            -#builtin m2#b48c60a0 
                *#builtin cos#builtin(2.0 *#builtin a1#:0 -#builtin 2.0 *#builtin a2#:1));
    const a2_a#:15 = num1#:10 *#builtin (num2#:11 +#builtin num3#:12 +#builtin num4#:13) 
        /#builtin den#:14;
    const a1_v#:16 = a1_v#:2 +#builtin a1_a#:9;
    const a2_v#:17 = a2_v#:3 +#builtin a2_a#:15;
    const a1#:18 = a1#:0 +#builtin a1_v#:16;
    const a2#:19 = a2#:1 +#builtin a2_v#:17;
    const a1#:20 = normalizeTheta#c3a71e42(t: a1#:18);
    const a2#:21 = normalizeTheta#c3a71e42(t: a2#:19);
    vec4#4d4983bb(x: a1#:20, y: a2#:21, z: a1_v#:16, w: a2_v#:17);
}
```
*/
/* (
    a1#:0: float,
    a2#:1: float,
    a1_v#:2: float,
    a2_v#:3: float,
): Vec4#🕒🧑‍🏫🎃 => {
    const a1_v#:16: float = a1_v#:2 + (-g#🛤️🚵😳😃 * 2 * m2#🤘 + m2#🤘 * sin(a1#:0) + -m2#🤘 * g#🛤️🚵😳😃 * sin(a1#:0 - 2 * a2#:1) + -2 * sin(a1#:0 - a2#:1) * m2#🤘 * a2_v#:3 * a2_v#:3 * r2#🥅👬👨‍🦰 + a1_v#:2 * a1_v#:2 * r2#🥅👬👨‍🦰 * cos(
        a1#:0 - a2#:1,
    )) / (r2#🥅👬👨‍🦰 * 2 * m2#🤘 + m2#🤘 - m2#🤘 * cos(2 * a1#:0 - 2 * a2#:1));
    const a2_v#:17: float = a2_v#:3 + 2 * sin(a1#:0 - a2#:1) * a1_v#:2 * a1_v#:2 * r2#🥅👬👨‍🦰 * m2#🤘 + m2#🤘 + g#🛤️🚵😳😃 * m2#🤘 + m2#🤘 * cos(a1#:0) + a2_v#:3 * a2_v#:3 * r2#🥅👬👨‍🦰 * m2#🤘 * cos(
        a1#:0 - a2#:1,
    ) / r2#🥅👬👨‍🦰 * 2 * m2#🤘 + m2#🤘 - m2#🤘 * cos(2 * a1#:0 - 2 * a2#:1);
    return vec4(normalizeTheta#🐳(a1#:0 + a1_v#:16), normalizeTheta#🐳(a2#:1 + a2_v#:17), a1_v#:16, a2_v#:17);
} */
vec4 update_74a18562(float a1_0, float a2_1, float a1_v_2, float a2_v_3) {
    float a1_v = (a1_v_2 + (((((-g_4466af4c * ((2.0 * m2_b48c60a0) + m2_b48c60a0)) * sin(a1_0)) + ((-m2_b48c60a0 * g_4466af4c) * sin((a1_0 - (2.0 * a2_1))))) + (((-2.0 * sin((a1_0 - a2_1))) * m2_b48c60a0) * (((a2_v_3 * a2_v_3) * r2_0ce717e6) + (((a1_v_2 * a1_v_2) * r2_0ce717e6) * cos(
        (a1_0 - a2_1)
    ))))) / (r2_0ce717e6 * (((2.0 * m2_b48c60a0) + m2_b48c60a0) - (m2_b48c60a0 * cos(((2.0 * a1_0) - (2.0 * a2_1))))))));
    float a2_v = (a2_v_3 + (((2.0 * sin((a1_0 - a2_1))) * (((((a1_v_2 * a1_v_2) * r2_0ce717e6) * (m2_b48c60a0 + m2_b48c60a0)) + ((g_4466af4c * (m2_b48c60a0 + m2_b48c60a0)) * cos(a1_0))) + ((((a2_v_3 * a2_v_3) * r2_0ce717e6) * m2_b48c60a0) * cos(
        (a1_0 - a2_1)
    )))) / (r2_0ce717e6 * (((2.0 * m2_b48c60a0) + m2_b48c60a0) - (m2_b48c60a0 * cos(((2.0 * a1_0) - (2.0 * a2_1))))))));
    return vec4(normalizeTheta_c3a71e42((a1_0 + a1_v)), normalizeTheta_c3a71e42((a2_1 + a2_v)), a1_v, a2_v);
}
/**
```
const dataToPixel#6ca470d0 = (v#:0: Vec4#3b941378): Vec4#3b941378 ={}> {
    const res#:1 = (v#:0 +#0555d260#b99b22d8#0 pixOff#44de0a86) 
        /#5776a60e#5ac12902#0 pixScale#32bd7938;
    res#:1;
}
```
*/
/* (
    v#:0: Vec4#🕒🧑‍🏫🎃,
): Vec4#🕒🧑‍🏫🎃 => (v#:0 + Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: MaxVelocity#😻🌨️🧙‍♀️, z: MaxVelocity#😻🌨️🧙‍♀️}) / (Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{
    w: MaxVelocity#😻🌨️🧙‍♀️ * 2,
    z: MaxVelocity#😻🌨️🧙‍♀️ * 2,
}) */
vec4 dataToPixel_6ca470d0(vec4 v_0) {
    return ((v_0 + vec4(PI, PI, MaxVelocity_158e986a, MaxVelocity_158e986a)) / vec4((PI * 2.0), (PI * 2.0), (MaxVelocity_158e986a * 2.0), (MaxVelocity_158e986a * 2.0)));
}
/**
```
const pixelToData#446114f2 = (v#:0: Vec4#3b941378): Vec4#3b941378 ={}> v#:0 
        *#1b694fee#1de4e4c0#0 pixScale#32bd7938 
    -#0555d260#b99b22d8#1 pixOff#44de0a86
```
*/
/* (
    v#:0: Vec4#🕒🧑‍🏫🎃,
): Vec4#🕒🧑‍🏫🎃 => v#:0 * Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: MaxVelocity#😻🌨️🧙‍♀️ * 2, z: MaxVelocity#😻🌨️🧙‍♀️ * 2} - Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{
    w: MaxVelocity#😻🌨️🧙‍♀️,
    z: MaxVelocity#😻🌨️🧙‍♀️,
} */
vec4 pixelToData_446114f2(vec4 v_0) {
    return ((v_0 * vec4((PI * 2.0), (PI * 2.0), (MaxVelocity_158e986a * 2.0), (MaxVelocity_158e986a * 2.0))) - vec4(PI, PI, MaxVelocity_158e986a, MaxVelocity_158e986a));
}
/**
```
const hsv2rgb#5c8b4a90 = (c#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    const K#:1 = vec4#4d4983bb(x: 1.0, y: 2.0 /#builtin 3.0, z: 1.0 /#builtin 3.0, w: 3.0);
    const xxx#:2 = Vec3#9f1c0644{
        x#43802a16#0: c#:0.x#43802a16#0,
        y#43802a16#1: c#:0.x#43802a16#0,
        z#9f1c0644#0: c#:0.x#43802a16#0,
    };
    const p#:3 = abs#1a074578(
        v: fract#228606f4(v: xxx#:2 +#1c6fdd91#b99b22d8#0 kxyz#1f96d598) *#1d31aa6e#1de4e4c0#0 6.0 
            -#3b80b971#b99b22d8#1 3.0,
    );
    const kxxx#:4 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
    c#:0.z#9f1c0644#0 
        *#c4a91006#1de4e4c0#0 mix#1d944e78(
            a: kxxx#:4,
            b: clamp#5483fdc2(
                v: p#:3 -#1c6fdd91#b99b22d8#1 kxxx#:4,
                min: Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
                max: Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
            ),
            c: c#:0.y#43802a16#1,
        );
}
```
*/
/* (
    c#:0: Vec3#🐬,
): Vec3#🐬 => {
    const kxxx#:4: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 1, x: 1, y: 1};
    return c#:0.#Vec3#🐬#0 * mix(
        kxxx#:4,
        clamp(
            abs(fract(Vec3#🐬{TODO SPREADs}{z: c#:0.#Vec2#🐭😉😵😃#0, x: c#:0.#Vec2#🐭😉😵😃#0, y: c#:0.#Vec2#🐭😉😵😃#0} + Vec3#🐬{TODO SPREADs}{z: 1 / 3, x: 1, y: 2 / 3}) * 6 - 3) - kxxx#:4,
            Vec3#🐬{TODO SPREADs}{z: 0, x: 0, y: 0},
            Vec3#🐬{TODO SPREADs}{z: 1, x: 1, y: 1},
        ),
        c#:0.#Vec2#🐭😉😵😃#1,
    );
} */
vec3 hsv2rgb_5c8b4a90(vec3 c_0) {
    vec3 kxxx = vec3(1.0, 1.0, 1.0);
    return (c_0.z * mix(kxxx, clamp((abs(((fract((vec3(c_0.x, c_0.x, c_0.x) + vec3(1.0, (2.0 / 3.0), (1.0 / 3.0)))) * 6.0) - 3.0)) - kxxx), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)), c_0.y));
}
/**
```
const rect#0fa3bd82 = (
    samplePos#:0: Vec2#43802a16,
    center#:1: Vec2#43802a16,
    w#:2: float#builtin,
    h#:3: float#builtin,
): float#builtin ={}> {
    max#e8162c1c(
        v: abs#394fe488(v: samplePos#:0 -#70bb2056#b99b22d8#1 center#:1) 
            -#70bb2056#b99b22d8#1 Vec2#43802a16{x#43802a16#0: w#:2, y#43802a16#1: h#:3},
    );
}
```
*/
/* (
    samplePos#:0: Vec2#🐭😉😵😃,
    center#:1: Vec2#🐭😉😵😃,
    w#:2: float,
    h#:3: float,
): float => max#🤗(abs(samplePos#:0 - center#:1) - Vec2#🐭😉😵😃{TODO SPREADs}{x: w#:2, y: h#:3}) */
float rect_0fa3bd82(vec2 samplePos_0, vec2 center_1, float w_2, float h_3) {
    return max_e8162c1c((abs((samplePos_0 - center_1)) - vec2(w_2, h_3)));
}
/**
```
const circle#297cc3b2 = (samplePos#:0: Vec2#43802a16, center#:1: Vec2#43802a16, r#:2: float#builtin): float#builtin ={}> {
    length#c2805852(v: samplePos#:0 -#70bb2056#b99b22d8#1 center#:1) -#builtin r#:2;
}
```
*/
/* (
    samplePos#:0: Vec2#🐭😉😵😃,
    center#:1: Vec2#🐭😉😵😃,
    r#:2: float,
): float => length(samplePos#:0 - center#:1) - r#:2 */
float circle_297cc3b2(vec2 samplePos_0, vec2 center_1, float r_2) {
    return (length((samplePos_0 - center_1)) - r_2);
}
/**
```
const pendulum#bf7a10e0 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    if env#:0.time#451d5252#0 <=#builtin 0.01 {
        const t#:3 = fragCoord#:1 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1;
        vec4#4d4983bb(x: 0.0, y: 0.0, z: t#:3.x#43802a16#0, w: t#:3.y#43802a16#1);
    } else {
        const current#:4 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1,
        );
        const current#:5 = pixelToData#446114f2(v: current#:4);
        dataToPixel#6ca470d0(
            v: update#74a18562(
                a1: current#:5.x#43802a16#0,
                a2: current#:5.y#43802a16#1,
                a1_v: current#:5.z#9f1c0644#0,
                a2_v: current#:5.w#3b941378#0,
            ),
        );
    };
}
```
*/
/* (
    env#:0: GLSLEnv#🕷️⚓😣😃,
    fragCoord#:1: Vec2#🐭😉😵😃,
    buffer#:2: sampler2D,
): Vec4#🕒🧑‍🏫🎃 => {
    if env#:0.#GLSLEnv#🕷️⚓😣😃#0 <= 0.01 {
        const t#:3: Vec2#🐭😉😵😃 = fragCoord#:1 / env#:0.#GLSLEnv#🕷️⚓😣😃#1;
        return vec4(0, 0, t#:3.#Vec2#🐭😉😵😃#0, t#:3.#Vec2#🐭😉😵😃#1);
    } else {
        const current#:5: Vec4#🕒🧑‍🏫🎃 = pixelToData#🧏😲😳😃(texture(buffer#:2, fragCoord#:1 / env#:0.#GLSLEnv#🕷️⚓😣😃#1));
        return dataToPixel#👨‍🦳🧑‍💻🥧😃(update#🧝👹🚏😃(current#:5.#Vec2#🐭😉😵😃#0, current#:5.#Vec2#🐭😉😵😃#1, current#:5.#Vec3#🐬#0, current#:5.#Vec4#🕒🧑‍🏫🎃#0));
    };
} */
vec4 pendulum_bf7a10e0(GLSLEnv_451d5252 env_0, vec2 fragCoord_1, sampler2D buffer_2) {
    if ((env_0.time <= 0.010)) {
        vec2 t = (fragCoord_1 / env_0.resolution);
        return vec4(0.0, 0.0, t.x, t.y);
    } else {
        vec4 current = pixelToData_446114f2(texture(buffer_2, (fragCoord_1 / env_0.resolution)));
        return dataToPixel_6ca470d0(update_74a18562(current.x, current.y, current.z, current.w));
    };
}
/**
```
const main#28a1e0b2 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    const currentPos#:3 = env#:0.mouse#451d5252#3 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1;
    const currentp#:4 = texture#builtin(buffer#:2, currentPos#:3);
    const current#:5 = pixelToData#446114f2(v: currentp#:4);
    const p1#:6 = fragCoord#:1 
        -#70bb2056#b99b22d8#1 env#:0.resolution#451d5252#1 /#afc24bbe#5ac12902#0 2.0;
    const c1#:7 = Vec2#43802a16{
        x#43802a16#0: sin#builtin(current#:5.x#43802a16#0) *#builtin r2#0ce717e6,
        y#43802a16#1: -cos#builtin(current#:5.x#43802a16#0) *#builtin r2#0ce717e6,
    };
    const c2#:8 = Vec2#43802a16{
        x#43802a16#0: c1#:7.x#43802a16#0 
            +#builtin sin#builtin(current#:5.y#43802a16#1) *#builtin r2#0ce717e6,
        y#43802a16#1: c1#:7.y#43802a16#1 
            -#builtin cos#builtin(current#:5.y#43802a16#1) *#builtin r2#0ce717e6,
    };
    if circle#297cc3b2(samplePos: p1#:6, center: c1#:7, r: 10.0) <#builtin 0.0 {
        vec4#4d4983bb(x: 1.0, y: 0.0, z: 0.0, w: 1.0);
    } else if circle#297cc3b2(samplePos: p1#:6, center: c2#:8, r: 10.0) <#builtin 0.0 {
        vec4#4d4983bb(x: 1.0, y: 1.0, z: 0.0, w: 1.0);
    } else if max#builtin(
            rect#0fa3bd82(
                samplePos: p1#:6,
                center: env#:0.mouse#451d5252#3 
                    -#70bb2056#b99b22d8#1 env#:0.resolution#451d5252#1 /#afc24bbe#5ac12902#0 2.0,
                w: 10.0,
                h: 10.0,
            ),
            -rect#0fa3bd82(
                samplePos: p1#:6,
                center: env#:0.mouse#451d5252#3 
                    -#70bb2056#b99b22d8#1 env#:0.resolution#451d5252#1 /#afc24bbe#5ac12902#0 2.0,
                w: 9.0,
                h: 9.0,
            ),
        ) 
        <#builtin 0.0 {
        vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else if length#c2805852(
            v: p1#:6 
                -#70bb2056#b99b22d8#1 (env#:0.mouse#451d5252#3 
                    -#70bb2056#b99b22d8#1 env#:0.resolution#451d5252#1 /#afc24bbe#5ac12902#0 2.0),
        ) 
        <#builtin 100.0 {
        const t#:9 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1,
        );
        const rgb#:10 = hsv2rgb#5c8b4a90(
            c: Vec3#9f1c0644{
                x#43802a16#0: t#:9.z#9f1c0644#0,
                y#43802a16#1: t#:9.w#3b941378#0,
                z#9f1c0644#0: 1.0,
            },
        );
        Vec4#3b941378{...rgb#:10, w#3b941378#0: 1.0};
    } else if length#c2805852(
            v: p1#:6 
                -#70bb2056#b99b22d8#1 (env#:0.mouse#451d5252#3 
                    -#70bb2056#b99b22d8#1 env#:0.resolution#451d5252#1 /#afc24bbe#5ac12902#0 2.0),
        ) 
        <#builtin 101.0 {
        vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else {
        const t#:11 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1,
        );
        const rgb#:12 = hsv2rgb#5c8b4a90(
            c: Vec3#9f1c0644{
                x#43802a16#0: t#:11.y#43802a16#1,
                y#43802a16#1: t#:11.x#43802a16#0,
                z#9f1c0644#0: 1.0,
            },
        );
        Vec4#3b941378{...rgb#:12, w#3b941378#0: 1.0};
    };
}
```
*/
/* (
    env#:0: GLSLEnv#🕷️⚓😣😃,
    fragCoord#:1: Vec2#🐭😉😵😃,
    buffer#:2: sampler2D,
): Vec4#🕒🧑‍🏫🎃 => {
    const current#:5: Vec4#🕒🧑‍🏫🎃 = pixelToData#🧏😲😳😃(texture(buffer#:2, env#:0.#GLSLEnv#🕷️⚓😣😃#3 / env#:0.#GLSLEnv#🕷️⚓😣😃#1));
    const p1#:6: Vec2#🐭😉😵😃 = fragCoord#:1 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 2;
    const c1#:7: Vec2#🐭😉😵😃 = Vec2#🐭😉😵😃{TODO SPREADs}{x: sin(current#:5.#Vec2#🐭😉😵😃#0) * r2#🥅👬👨‍🦰, y: -cos(current#:5.#Vec2#🐭😉😵😃#0) * r2#🥅👬👨‍🦰};
    if circle#❄️🚋🥓(p1#:6, c1#:7, 10) < 0 {
        return vec4(1, 0, 0, 1);
    } else {
        if circle#❄️🚋🥓(
            p1#:6,
            Vec2#🐭😉😵😃{TODO SPREADs}{x: c1#:7.#Vec2#🐭😉😵😃#0 + sin(current#:5.#Vec2#🐭😉😵😃#1) * r2#🥅👬👨‍🦰, y: c1#:7.#Vec2#🐭😉😵😃#1 - cos(current#:5.#Vec2#🐭😉😵😃#1) * r2#🥅👬👨‍🦰},
            10,
        ) < 0 {
            return vec4(1, 1, 0, 1);
        } else {
            if max(
                rect#👩‍🦽🙋🤦‍♀️(p1#:6, env#:0.#GLSLEnv#🕷️⚓😣😃#3 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 2, 10, 10),
                -rect#👩‍🦽🙋🤦‍♀️(p1#:6, env#:0.#GLSLEnv#🕷️⚓😣😃#3 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 2, 9, 9),
            ) < 0 {
                return vec4(0, 0, 0, 1);
            } else {
                if length(p1#:6 - env#:0.#GLSLEnv#🕷️⚓😣😃#3 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 2) < 100 {
                    const t#:9: Vec4#🕒🧑‍🏫🎃 = texture(buffer#:2, fragCoord#:1 / env#:0.#GLSLEnv#🕷️⚓😣😃#1);
                    const spread#:13: Vec3#🐬 = hsv2rgb#🥯☕👨‍❤️‍💋‍👨😃(Vec3#🐬{TODO SPREADs}{z: 1, x: t#:9.#Vec3#🐬#0, y: t#:9.#Vec4#🕒🧑‍🏫🎃#0});
                    return Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: spread#:13.#Vec3#🐬#0};
                } else {
                    if length(p1#:6 - env#:0.#GLSLEnv#🕷️⚓😣😃#3 - env#:0.#GLSLEnv#🕷️⚓😣😃#1 / 2) < 101 {
                        return vec4(0, 0, 0, 1);
                    } else {
                        const t#:11: Vec4#🕒🧑‍🏫🎃 = texture(buffer#:2, fragCoord#:1 / env#:0.#GLSLEnv#🕷️⚓😣😃#1);
                        const spread#:14: Vec3#🐬 = hsv2rgb#🥯☕👨‍❤️‍💋‍👨😃(Vec3#🐬{TODO SPREADs}{z: 1, x: t#:11.#Vec2#🐭😉😵😃#1, y: t#:11.#Vec2#🐭😉😵😃#0});
                        return Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: spread#:14.#Vec3#🐬#0};
                    };
                };
            };
        };
    };
} */
vec4 main_28a1e0b2(GLSLEnv_451d5252 env_0, vec2 fragCoord_1, sampler2D buffer_2) {
    vec4 current = pixelToData_446114f2(texture(buffer_2, (env_0.mouse / env_0.resolution)));
    vec2 p1 = (fragCoord_1 - (env_0.resolution / 2.0));
    vec2 c1 = vec2((sin(current.x) * r2_0ce717e6), (-cos(current.x) * r2_0ce717e6));
    if ((circle_297cc3b2(p1, c1, 10.0) < 0.0)) {
        return vec4(1.0, 0.0, 0.0, 1.0);
    } else {
        if ((circle_297cc3b2(p1, vec2((c1.x + (sin(current.y) * r2_0ce717e6)), (c1.y - (cos(current.y) * r2_0ce717e6))), 10.0) < 0.0)) {
            return vec4(1.0, 1.0, 0.0, 1.0);
        } else {
            if ((max(rect_0fa3bd82(p1, (env_0.mouse - (env_0.resolution / 2.0)), 10.0, 10.0), -rect_0fa3bd82(p1, (env_0.mouse - (env_0.resolution / 2.0)), 9.0, 9.0)) < 0.0)) {
                return vec4(0.0, 0.0, 0.0, 1.0);
            } else {
                if ((length((p1 - (env_0.mouse - (env_0.resolution / 2.0)))) < 100.0)) {
                    vec4 t_9 = texture(buffer_2, (fragCoord_1 / env_0.resolution));
                    vec3 spread = hsv2rgb_5c8b4a90(vec3(t_9.z, t_9.w, 1.0));
                    return vec4(spread.x, spread.y, spread.z, 1.0);
                } else {
                    if ((length((p1 - (env_0.mouse - (env_0.resolution / 2.0)))) < 101.0)) {
                        return vec4(0.0, 0.0, 0.0, 1.0);
                    } else {
                        vec4 t_11 = texture(buffer_2, (fragCoord_1 / env_0.resolution));
                        vec3 spread_14 = hsv2rgb_5c8b4a90(vec3(t_11.y, t_11.x, 1.0));
                        return vec4(spread_14.x, spread_14.y, spread_14.z, 1.0);
                    };
                };
            };
        };
    };
}
#if defined(BUFFER_0)
void main() {
    fragColor = pendulum_bf7a10e0(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy, u_buffer0);
}
#else
void main() {
    fragColor = main_28a1e0b2(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy, u_buffer0);
}
#endif
