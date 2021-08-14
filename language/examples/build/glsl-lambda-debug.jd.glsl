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
// skipping Mul_1de4e4c0, contains type variables
// skipping Neg_3c2a4898, contains type variables
// skipping AddSub_b99b22d8, contains type variables
// skipping Div_5ac12902, contains type variables
/**
```
const length#63e16b7a = (v#:0: Vec3#9f1c0644): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
            +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1 
        +#builtin v#:0.z#9f1c0644#0 *#builtin v#:0.z#9f1c0644#0,
)
```
*/
/* (
    v#:0: Vec3#🐬,
): float => sqrt(v#:0.#Vec2#🐭😉😵😃#0 * v#:0.#Vec2#🐭😉😵😃#0 + v#:0.#Vec2#🐭😉😵😃#1 * v#:0.#Vec2#🐭😉😵😃#1 + v#:0.#Vec3#🐬#0 * v#:0.#Vec3#🐬#0) */
float length_63e16b7a(vec3 v_0) {
    return sqrt((((v_0.x * v_0.x) + (v_0.y * v_0.y)) + (v_0.z * v_0.z)));
}
/* -- generated -- */
/* (v#:0: Vec3#🐬, scale#:1: float): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{z: v#:0.#Vec3#🐬#0 / scale#:1, x: v#:0.#Vec2#🐭😉😵😃#0 / scale#:1, y: v#:0.#Vec2#🐭😉😵😃#1 / scale#:1} */
vec3 V68f73ad4_5ac12902_0(
    vec3 v_0,
    float scale_1
) {
    return vec3((v_0.x / scale_1), (v_0.y / scale_1), (v_0.z / scale_1));
}
/* *
```
const EPSILON#17261aaa = 0.0001
```
 */
/*0.0001*/const float EPSILON_17261aaa = 0.00010;
/* -- generated -- */
/* (scale#:0: float, v#:1: Vec3#🐬): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{z: v#:1.#Vec3#🐬#0 * scale#:0, x: v#:1.#Vec2#🐭😉😵😃#0 * scale#:0, y: v#:1.#Vec2#🐭😉😵😃#1 * scale#:0} */
vec3 Vc4a91006_1de4e4c0_0(
    float scale_0,
    vec3 v_1
) {
    return vec3((v_1.x * scale_0), (v_1.y * scale_0), (v_1.z * scale_0));
}
/* -- generated -- */
/* (one#:0: Vec3#🐬, two#:1: Vec3#🐬): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: one#:0.#Vec3#🐬#0 + two#:1.#Vec3#🐬#0,
    x: one#:0.#Vec2#🐭😉😵😃#0 + two#:1.#Vec2#🐭😉😵😃#0,
    y: one#:0.#Vec2#🐭😉😵😃#1 + two#:1.#Vec2#🐭😉😵😃#1,
} */
vec3 V1c6fdd91_b99b22d8_0(vec3 one_0, vec3 two_1) {
    return vec3((one_0.x + two_1.x), (one_0.y + two_1.y), (one_0.z + two_1.z));
}
/* -- generated -- */
/* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec3#🐬): float => length#🕓🤬🐲😃(pos#:1) - 2 */
float unnamed_lambda_23017b64(GLSLEnv_451d5252 env_0, vec3 pos_1) {
    return (length_63e16b7a(pos_1) - 2.0);
}
/* -- generated -- */
/* (one#:2: Vec3#🐬, two#:3: Vec3#🐬): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: one#:2.#Vec3#🐬#0 - two#:3.#Vec3#🐬#0,
    x: one#:2.#Vec2#🐭😉😵😃#0 - two#:3.#Vec2#🐭😉😵😃#0,
    y: one#:2.#Vec2#🐭😉😵😃#1 - two#:3.#Vec2#🐭😉😵😃#1,
} */
vec3 V1c6fdd91_b99b22d8_1(vec3 one_2, vec3 two_3) {
    return vec3((one_2.x - two_3.x), (one_2.y - two_3.y), (one_2.z - two_3.z));
}
/**
```
const normalize#48e6ea27 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> v#:0 
    /#68f73ad4#5ac12902#0 length#63e16b7a(v#:0)
```
*/
/* (v#:0: Vec3#🐬): Vec3#🐬 => generated#68f73ad4_5ac12902_0(
    v#:0,
    length#🕓🤬🐲😃(v#:0),
) */
vec3 normalize_48e6ea27(vec3 v_0) {
    return V68f73ad4_5ac12902_0(v_0, length_63e16b7a(v_0));
}
/* -- generated -- */
/* (env#:1: GLSLEnv#🕷️⚓😣😃, eye#:2: Vec3#🐬, marchingDirection#:3: Vec3#🐬, start#:4: float, end#:5: float, stepsLeft#:6: int): float => {
    loop {
        const dist#:7: float = unnamed_lambda#🚠☠️🐧(env#:1, generated#1c6fdd91_b99b22d8_0(eye#:2, generated#c4a91006_1de4e4c0_0(start#:4, marchingDirection#:3)));
        if dist#:7 < EPSILON#🧂💃🚶‍♂️ {
            return start#:4;
        } else {
            const depth#:8: float = start#:4 + dist#:7;
            if depth#:8 >= end#:5 || stepsLeft#:6 <= 0 {
                return end#:5;
            } else {
                start#:4 = depth#:8;
                stepsLeft#:6 = stepsLeft#:6 - 1;
                continue;
            };
        };
    };
} */
float shortestDistanceToSurface_specialization_131b8984(GLSLEnv_451d5252 env_1, vec3 eye_2, vec3 marchingDirection_3, float start_4, float end_5, int stepsLeft_6) {
    for (int i=0; i<10000; i++) {
        float dist = unnamed_lambda_23017b64(env_1, V1c6fdd91_b99b22d8_0(eye_2, Vc4a91006_1de4e4c0_0(start_4, marchingDirection_3)));
        if ((dist < EPSILON_17261aaa)) {
            return start_4;
        } else {
            float depth = (start_4 + dist);
            if (((depth >= end_5) || (stepsLeft_6 <= 0))) {
                return end_5;
            } else {
                start_4 = depth;
                stepsLeft_6 = (stepsLeft_6 - 1);
                continue;
            };
        };
    };
}
/**
```
const distance#29bb6cab = (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): float#builtin ={}> length#63e16b7a(
    v: two#:1 -#1c6fdd91#b99b22d8#1 one#:0,
)
```
*/
/* (
    one#:0: Vec3#🐬,
    two#:1: Vec3#🐬,
): float => length#🕓🤬🐲😃(generated#1c6fdd91_b99b22d8_1(two#:1, one#:0)) */
float distance_29bb6cab(vec3 one_0, vec3 two_1) {
    return length_63e16b7a(V1c6fdd91_b99b22d8_1(two_1, one_0));
}
/**
```
const vec4#4d4983bb = (
    x#:0: float#builtin,
    y#:1: float#builtin,
    z#:2: float#builtin,
    w#:3: float#builtin,
): Vec4#3b941378 ={}> Vec4#3b941378{
    z#9f1c0644#0: z#:2,
    x#43802a16#0: x#:0,
    y#43802a16#1: y#:1,
    w#3b941378#0: w#:3,
}
```
*/
/* (
    x#:0: float,
    y#:1: float,
    z#:2: float,
    w#:3: float,
): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: w#:3, z: z#:2} */
vec4 vec4_4d4983bb(float x_0, float y_1, float z_2, float w_3) {
    return vec4(x_0, y_1, z_2, w_3);
}
/* -- generated -- */
/* (v#:0: Vec3#🐬): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{z: -v#:0.#Vec3#🐬#0, x: -v#:0.#Vec2#🐭😉😵😃#0, y: -v#:0.#Vec2#🐭😉😵😃#1} */
vec3 Va5cd53ce_3c2a4898_0(vec3 v_0) {
    return vec3(-v_0.x, -v_0.y, -v_0.z);
}
/**
```
const cross#54f2119c = (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: one#:0.y#43802a16#1 *#builtin two#:1.z#9f1c0644#0 
        -#builtin two#:1.y#43802a16#1 *#builtin one#:0.z#9f1c0644#0,
    y#43802a16#1: one#:0.z#9f1c0644#0 *#builtin two#:1.x#43802a16#0 
        -#builtin two#:1.z#9f1c0644#0 *#builtin one#:0.x#43802a16#0,
    z#9f1c0644#0: one#:0.x#43802a16#0 *#builtin two#:1.y#43802a16#1 
        -#builtin two#:1.x#43802a16#0 *#builtin one#:0.y#43802a16#1,
}
```
*/
/* (
    one#:0: Vec3#🐬,
    two#:1: Vec3#🐬,
): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: one#:0.#Vec2#🐭😉😵😃#0 * two#:1.#Vec2#🐭😉😵😃#1 - two#:1.#Vec2#🐭😉😵😃#0 * one#:0.#Vec2#🐭😉😵😃#1,
    x: one#:0.#Vec2#🐭😉😵😃#1 * two#:1.#Vec3#🐬#0 - two#:1.#Vec2#🐭😉😵😃#1 * one#:0.#Vec3#🐬#0,
    y: one#:0.#Vec3#🐬#0 * two#:1.#Vec2#🐭😉😵😃#0 - two#:1.#Vec3#🐬#0 * one#:0.#Vec2#🐭😉😵😃#0,
} */
vec3 cross_54f2119c(vec3 one_0, vec3 two_1) {
    return vec3(((one_0.y * two_1.z) - (two_1.y * one_0.z)), ((one_0.z * two_1.x) - (two_1.z * one_0.x)), ((one_0.x * two_1.y) - (two_1.x * one_0.y)));
}
/**
```
const dot#a0178052 = (a#:0: Vec4#3b941378, b#:1: Vec4#3b941378): float#builtin ={}> {
    a#:0.x#43802a16#0 *#builtin b#:1.x#43802a16#0 
                +#builtin a#:0.y#43802a16#1 *#builtin b#:1.y#43802a16#1 
            +#builtin a#:0.z#9f1c0644#0 *#builtin b#:1.z#9f1c0644#0 
        +#builtin a#:0.w#3b941378#0 *#builtin b#:1.w#3b941378#0;
}
```
*/
/* (
    a#:0: Vec4#🕒🧑‍🏫🎃,
    b#:1: Vec4#🕒🧑‍🏫🎃,
): float => a#:0.#Vec2#🐭😉😵😃#0 * b#:1.#Vec2#🐭😉😵😃#0 + a#:0.#Vec2#🐭😉😵😃#1 * b#:1.#Vec2#🐭😉😵😃#1 + a#:0.#Vec3#🐬#0 * b#:1.#Vec3#🐬#0 + a#:0.#Vec4#🕒🧑‍🏫🎃#0 * b#:1.#Vec4#🕒🧑‍🏫🎃#0 */
float dot_a0178052(
    vec4 a_0,
    vec4 b_1
) {
    return ((((a_0.x * b_1.x) + (a_0.y * b_1.y)) + (a_0.z * b_1.z)) + (a_0.w * b_1.w));
}
/**
```
const radians#dabe7f9c = (degrees#:0: float#builtin): float#builtin ={}> degrees#:0 /#builtin 180.0 
    *#builtin PI#builtin
```
*/
/* (degrees#:0: float): float => degrees#:0 / 180 * PI */
float radians_dabe7f9c(
    float degrees_0
) {
    return ((degrees_0 / 180.0) * PI);
}
/* -- generated -- */
/* (v#:0: Vec2#🐭😉😵😃, scale#:1: float): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{x: v#:0.#Vec2#🐭😉😵😃#0 / scale#:1, y: v#:0.#Vec2#🐭😉😵😃#1 / scale#:1} */
vec2 Vafc24bbe_5ac12902_0(
    vec2 v_0,
    float scale_1
) {
    return vec2((v_0.x / scale_1), (v_0.y / scale_1));
}
/* -- generated -- */
/* (one#:2: Vec2#🐭😉😵😃, two#:3: Vec2#🐭😉😵😃): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{
    x: one#:2.#Vec2#🐭😉😵😃#0 - two#:3.#Vec2#🐭😉😵😃#0,
    y: one#:2.#Vec2#🐭😉😵😃#1 - two#:3.#Vec2#🐭😉😵😃#1,
} */
vec2 V70bb2056_b99b22d8_1(vec2 one_2, vec2 two_3) {
    return vec2((one_2.x - two_3.x), (one_2.y - two_3.y));
}
/**
```
const vec3#5808ec54 = (v#:0: Vec2#43802a16, z#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    ...v#:0,
    z#9f1c0644#0: z#:1,
}
```
*/
/* (v#:0: Vec2#🐭😉😵😃, z#:1: float): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: z#:1,
    x: v#:0.#Vec2#🐭😉😵😃#0,
    y: v#:0.#Vec2#🐭😉😵😃#1,
} */
vec3 vec3_5808ec54(vec2 v_0, float z_1) {
    return vec3(v_0.x, v_0.y, z_1);
}
/**
```
const vec3#dc78826c = (x#:0: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: x#:0,
    y#43802a16#1: x#:0,
    z#9f1c0644#0: x#:0,
}
```
*/
/* (x#:0: float): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: x#:0,
    x: x#:0,
    y: x#:0,
} */
vec3 vec3_dc78826c(float x_0) {
    return vec3(x_0, x_0, x_0);
}
/* -- generated -- */
/* (env#:1: GLSLEnv#🕷️⚓😣😃, light#:2: Vec3#🐬, eye#:3: Vec3#🐬, dist#:4: float, percent#:5: float, dir#:6: Vec3#🐬, left#:7: int): float => {
    const sample#:9: Vec3#🐬 = generated#1c6fdd91_b99b22d8_0(eye#:3, generated#c4a91006_1de4e4c0_0(percent#:5 * dist#:4, dir#:6));
    const lightDist#:10: float = distance#👊🥂🌭(sample#:9, light#:2);
    if shortestDistanceToSurface_specialization#🏃‍♂️🍽️🕵️(
        env#:1,
        sample#:9,
        generated#c4a91006_1de4e4c0_0(-1, normalize#🦡🤹🕳️😃(generated#1c6fdd91_b99b22d8_1(sample#:9, light#:2))),
        0,
        lightDist#:10,
        255,
    ) >= lightDist#:10 - 0.1 {
        return dist#:4 / pow(1 + lightDist#:10, 2);
    } else {
        return 0;
    };
} */
float volumetricSample_specialization_6ead990b(GLSLEnv_451d5252 env_1, vec3 light_2, vec3 eye_3, float dist_4, float percent_5, vec3 dir_6, int left_7) {
    vec3 sample_9 = V1c6fdd91_b99b22d8_0(eye_3, Vc4a91006_1de4e4c0_0((percent_5 * dist_4), dir_6));
    float lightDist = distance_29bb6cab(sample_9, light_2);
    if ((shortestDistanceToSurface_specialization_131b8984(env_1, sample_9, Vc4a91006_1de4e4c0_0(-1.0, normalize_48e6ea27(V1c6fdd91_b99b22d8_1(sample_9, light_2))), 0.0, lightDist, 255) >= (lightDist - 0.10))) {
        return (dist_4 / pow((1.0 + lightDist), 2.0));
    } else {
        return 0.0;
    };
}
/**
```
const viewMatrix#c336d78c = (eye#:0: Vec3#9f1c0644, center#:1: Vec3#9f1c0644, up#:2: Vec3#9f1c0644): Mat4#d92781e8 ={}> {
    const f#:3 = normalize#48e6ea27(v: center#:1 -#1c6fdd91#b99b22d8#1 eye#:0);
    const s#:4 = normalize#48e6ea27(v: cross#54f2119c(one: f#:3, two: up#:2));
    const u#:5 = cross#54f2119c(one: s#:4, two: f#:3);
    Mat4#d92781e8{
        r1#d92781e8#0: Vec4#3b941378{...s#:4, w#3b941378#0: 0.0},
        r2#d92781e8#1: Vec4#3b941378{...u#:5, w#3b941378#0: 0.0},
        r3#d92781e8#2: Vec4#3b941378{...NegVec3#a5cd53ce."-"#3c2a4898#0(f#:3), w#3b941378#0: 0.0},
        r4#d92781e8#3: vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
```
*/
/* (
    eye#:0: Vec3#🐬,
    center#:1: Vec3#🐬,
    up#:2: Vec3#🐬,
): Mat4#🗣️ => {
    const f#:3: Vec3#🐬 = normalize#🦡🤹🕳️😃(generated#1c6fdd91_b99b22d8_1(center#:1, eye#:0));
    const s#:4: Vec3#🐬 = normalize#🦡🤹🕳️😃(cross#🚣💜🧑‍🎄😃(f#:3, up#:2));
    const spread#:6: Vec3#🐬 = cross#🚣💜🧑‍🎄😃(s#:4, f#:3);
    const spread#:7: Vec3#🐬 = generated#a5cd53ce_3c2a4898_0(f#:3);
    return Mat4#🗣️{TODO SPREADs}{
        r1: Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 0, z: s#:4.#Vec3#🐬#0},
        r2: Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 0, z: spread#:6.#Vec3#🐬#0},
        r3: Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 0, z: spread#:7.#Vec3#🐬#0},
        r4: vec4#🎆🌷🧑‍🦰😃(0, 0, 0, 1),
    };
} */
mat4 viewMatrix_c336d78c(vec3 eye_0, vec3 center_1, vec3 up_2) {
    vec3 f = normalize_48e6ea27(V1c6fdd91_b99b22d8_1(center_1, eye_0));
    vec3 s = normalize_48e6ea27(cross_54f2119c(f, up_2));
    vec3 spread = cross_54f2119c(s, f);
    vec3 spread_7 = Va5cd53ce_3c2a4898_0(f);
    return mat4(vec4(s.x, s.y, s.z, 0.0), vec4(spread.x, spread.y, spread.z, 0.0), vec4(spread_7.x, spread_7.y, spread_7.z, 0.0), vec4_4d4983bb(0.0, 0.0, 0.0, 1.0));
}
/* -- generated -- */
/* (mat#:0: Mat4#🗣️, vec#:1: Vec4#🕒🧑‍🏫🎃): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: dot#😞(mat#:0.#Mat4#🗣️#3, vec#:1), z: dot#😞(mat#:0.#Mat4#🗣️#2, vec#:1)} */
vec4 V16557d10_1de4e4c0_0(
    mat4 mat_0,
    vec4 vec_1
) {
    return vec4(dot_a0178052(mat_0[0], vec_1), dot_a0178052(mat_0[1], vec_1), dot_a0178052(mat_0[2], vec_1), dot_a0178052(mat_0[3], vec_1));
}
/**
```
const xyz#1aedf216 = (v#:0: Vec4#3b941378): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: v#:0.x#43802a16#0,
    y#43802a16#1: v#:0.y#43802a16#1,
    z#9f1c0644#0: v#:0.z#9f1c0644#0,
}
```
*/
/* (
    v#:0: Vec4#🕒🧑‍🏫🎃,
): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{z: v#:0.#Vec3#🐬#0, x: v#:0.#Vec2#🐭😉😵😃#0, y: v#:0.#Vec2#🐭😉😵😃#1} */
vec3 xyz_1aedf216(vec4 v_0) {
    return vec3(v_0.x, v_0.y, v_0.z);
}
/**
```
const rayDirection#6258178a = (
    fieldOfView#:0: float#builtin,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
): Vec3#9f1c0644 ={}> {
    const xy#:3 = fragCoord#:2 -#70bb2056#b99b22d8#1 size#:1 /#afc24bbe#5ac12902#0 2.0;
    const z#:4 = size#:1.y#43802a16#1 
        /#builtin tan#builtin(radians#dabe7f9c(degrees: fieldOfView#:0) /#builtin 2.0);
    normalize#48e6ea27(v: vec3#5808ec54(v: xy#:3, z: -z#:4));
}
```
*/
/* (
    fieldOfView#:0: float,
    size#:1: Vec2#🐭😉😵😃,
    fragCoord#:2: Vec2#🐭😉😵😃,
): Vec3#🐬 => normalize#🦡🤹🕳️😃(
    vec3#😩🐢🧑‍🦽😃(generated#70bb2056_b99b22d8_1(fragCoord#:2, generated#afc24bbe_5ac12902_0(size#:1, 2)), -size#:1.#Vec2#🐭😉😵😃#1 / tan(radians#🌟(fieldOfView#:0) / 2)),
) */
vec3 rayDirection_6258178a(float fieldOfView_0, vec2 size_1, vec2 fragCoord_2) {
    return normalize_48e6ea27(vec3_5808ec54(V70bb2056_b99b22d8_1(fragCoord_2, Vafc24bbe_5ac12902_0(size_1, 2.0)), -(size_1.y / tan((radians_dabe7f9c(fieldOfView_0) / 2.0)))));
}
/* -- generated -- */
/* (v#:0: Vec3#🐬, scale#:1: float): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{z: v#:0.#Vec3#🐬#0 * scale#:1, x: v#:0.#Vec2#🐭😉😵😃#0 * scale#:1, y: v#:0.#Vec2#🐭😉😵😃#1 * scale#:1} */
vec3 V1d31aa6e_1de4e4c0_0(
    vec3 v_0,
    float scale_1
) {
    return vec3((v_0.x * scale_1), (v_0.y * scale_1), (v_0.z * scale_1));
}
/**
```
const vec4#b00b79a0 = (v#:0: Vec3#9f1c0644, w#:1: float#builtin): Vec4#3b941378 ={}> Vec4#3b941378{
    ...v#:0,
    w#3b941378#0: w#:1,
}
```
*/
/* (v#:0: Vec3#🐬, w#:1: float): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{
    w: w#:1,
    z: v#:0.#Vec3#🐬#0,
} */
vec4 vec4_b00b79a0(vec3 v_0, float w_1) {
    return vec4(v_0.x, v_0.y, v_0.z, w_1);
}
/* -- generated -- */
/* (env#:0: GLSLEnv#🕷️⚓😣😃): Vec3#🐬 => vec3#🍃(0) */
vec3 unnamed_lambda_f8d66bf8(GLSLEnv_451d5252 env_0) {
    return vec3_dc78826c(0.0);
}
/* -- generated -- */
/* (v#:0: Vec2#🐭😉😵😃, scale#:1: Vec2#🐭😉😵😃): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{
    x: v#:0.#Vec2#🐭😉😵😃#0 / scale#:1.#Vec2#🐭😉😵😃#0,
    y: v#:0.#Vec2#🐭😉😵😃#1 / scale#:1.#Vec2#🐭😉😵😃#1,
} */
vec2 V090f77e7_5ac12902_0(vec2 v_0, vec2 scale_1) {
    return vec2((v_0.x / scale_1.x), (v_0.y / scale_1.y));
}
/* -- generated -- */
/* (one#:0: Vec2#🐭😉😵😃, two#:1: float): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{x: one#:0.#Vec2#🐭😉😵😃#0 + two#:1, y: one#:0.#Vec2#🐭😉😵😃#1 + two#:1} */
vec2 V6d631644_b99b22d8_0(
    vec2 one_0,
    float two_1
) {
    return vec2((one_0.x + two_1), (one_0.y + two_1));
}
/* -- generated -- */
/* (env#:1: GLSLEnv#🕷️⚓😣😃, seed#:2: Vec2#🐭😉😵😃, light#:3: Vec3#🐬, eye#:4: Vec3#🐬, dist#:5: float, dir#:6: Vec3#🐬, current#:7: float, left#:8: int, total#:9: float): float => {
    for (; left#:8 > 0; left#:8 = left#:8 - 1) {
        current#:7 = current#:7 + volumetricSample_specialization#👨‍🌾🛰️🌐😃(env#:1, light#:3, eye#:4, dist#:5, float(left#:8) / total#:9, dir#:6, left#:8);
        continue;
    };
    return current#:7;
} */
float volumetricStepped_specialization_927b8ce0(GLSLEnv_451d5252 env_1, vec2 seed_2, vec3 light_3, vec3 eye_4, float dist_5, vec3 dir_6, float current_7, int left_8, float total_9) {
    for (; left_8 > 0; left_8 = (left_8 - 1)) {
        current_7 = (current_7 + volumetricSample_specialization_6ead990b(env_1, light_3, eye_4, dist_5, (float(left_8) / total_9), dir_6, left_8));
        continue;
    };
    return current_7;
}
/**
```
const vec4#72fca9b4 = (x#:0: float#builtin): Vec4#3b941378 ={}> Vec4#3b941378{
    z#9f1c0644#0: x#:0,
    x#43802a16#0: x#:0,
    y#43802a16#1: x#:0,
    w#3b941378#0: x#:0,
}
```
*/
/* (
    x#:0: float,
): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: x#:0, z: x#:0} */
vec4 vec4_72fca9b4(float x_0) {
    return vec4(x_0, x_0, x_0, x_0);
}
/**
```
const getWorldDir#92052fca = (
    resolution#:0: Vec2#43802a16,
    coord#:1: Vec2#43802a16,
    eye#:2: Vec3#9f1c0644,
    fieldOfView#:3: float#builtin,
): Vec3#9f1c0644 ={}> {
    const viewDir#:4 = rayDirection#6258178a(
        fieldOfView#:3,
        size: resolution#:0,
        fragCoord: coord#:1,
    );
    const eye#:5 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const viewToWorld#:6 = viewMatrix#c336d78c(
        eye#:5,
        center: Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
        up: Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
    );
    xyz#1aedf216(
        v: viewToWorld#:6 *#16557d10#1de4e4c0#0 Vec4#3b941378{...viewDir#:4, w#3b941378#0: 0.0},
    );
}
```
*/
/* (
    resolution#:0: Vec2#🐭😉😵😃,
    coord#:1: Vec2#🐭😉😵😃,
    eye#:2: Vec3#🐬,
    fieldOfView#:3: float,
): Vec3#🐬 => {
    const spread#:7: Vec3#🐬 = rayDirection#🌑🐂🦨😃(fieldOfView#:3, resolution#:0, coord#:1);
    return xyz#🐭🕔🤸(
        generated#16557d10_1de4e4c0_0(
            viewMatrix#🌓(Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0}, Vec3#🐬{TODO SPREADs}{z: 0, x: 0, y: 0}, Vec3#🐬{TODO SPREADs}{z: 0, x: 0, y: 1}),
            Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 0, z: spread#:7.#Vec3#🐬#0},
        ),
    );
} */
vec3 getWorldDir_92052fca(vec2 resolution_0, vec2 coord_1, vec3 eye_2, float fieldOfView_3) {
    vec3 spread_7 = rayDirection_6258178a(fieldOfView_3, resolution_0, coord_1);
    return xyz_1aedf216(V16557d10_1de4e4c0_0(viewMatrix_c336d78c(vec3(0.0, 0.0, 5.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0)), vec4(spread_7.x, spread_7.y, spread_7.z, 0.0)));
}
/**
```
const unnamed#d8a4e754 = {
    const m#:3 = marchVolumeStepped#b4499eea(
        sceneSDF: (env#:0: GLSLEnv#451d5252, pos#:1: Vec3#9f1c0644): float#builtin ={}> {
            length#63e16b7a(v: pos#:1) -#builtin 2.0;
        },
        lightPos: (env#:2: GLSLEnv#451d5252): Vec3#9f1c0644 ={}> vec3#dc78826c(x: 0.0),
        exposure: 3.0,
        samples: 100.0,
    );
    m#:3;
}
```
*/
/* (
    arg0#:26: GLSLEnv#🕷️⚓😣😃,
    arg1#:27: Vec2#🐭😉😵😃,
): Vec4#🕒🧑‍🏫🎃 => {
    const eye#:22: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:23: Vec3#🐬 = getWorldDir#🎁(arg0#:26.#GLSLEnv#🕷️⚓😣😃#1, arg1#:27, eye#:22, 45);
    const dist#:24: float = shortestDistanceToSurface_specialization#🏃‍♂️🍽️🕵️(arg0#:26, eye#:22, worldDir#:23, 0, 100, 255);
    if dist#:24 > 100 - EPSILON#🧂💃🚶‍♂️ {
        return vec4#🤽🚇🚞😃(0);
    } else {
        const brightness#:25: float = volumetricStepped_specialization#🙍(
            arg0#:26,
            generated#6d631644_b99b22d8_0(generated#090f77e7_5ac12902_0(arg1#:27, arg0#:26.#GLSLEnv#🕷️⚓😣😃#1), arg0#:26.#GLSLEnv#🕷️⚓😣😃#0 / 1000),
            unnamed_lambda#🎲(arg0#:26),
            eye#:22,
            dist#:24,
            worldDir#:23,
            0,
            int(100),
            100,
        ) * 3 / 100;
        return vec4#🏊‍♂️(generated#1d31aa6e_1de4e4c0_0(generated#1d31aa6e_1de4e4c0_0(generated#1d31aa6e_1de4e4c0_0(vec3#🍃(1), brightness#:25), brightness#:25), brightness#:25), 1);
    };
} */
vec4 unnamed_d8a4e754(GLSLEnv_451d5252 arg0_26, vec2 arg1_27) {
    vec3 eye = vec3(0.0, 0.0, 5.0);
    vec3 worldDir = getWorldDir_92052fca(arg0_26.resolution, arg1_27, eye, 45.0);
    float dist_24 = shortestDistanceToSurface_specialization_131b8984(arg0_26, eye, worldDir, 0.0, 100.0, 255);
    if ((dist_24 > (100.0 - EPSILON_17261aaa))) {
        return vec4_72fca9b4(0.0);
    } else {
        float brightness = ((volumetricStepped_specialization_927b8ce0(
            arg0_26,
            V6d631644_b99b22d8_0(V090f77e7_5ac12902_0(arg1_27, arg0_26.resolution), (arg0_26.time / 1000.0)),
            unnamed_lambda_f8d66bf8(arg0_26),
            eye,
            dist_24,
            worldDir,
            0.0,
            int(100.0),
            100.0
        ) * 3.0) / 100.0);
        return vec4_b00b79a0(V1d31aa6e_1de4e4c0_0(V1d31aa6e_1de4e4c0_0(V1d31aa6e_1de4e4c0_0(vec3_dc78826c(1.0), brightness), brightness), brightness), 1.0);
    };
}
void main() {
    fragColor = unnamed_d8a4e754(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
}