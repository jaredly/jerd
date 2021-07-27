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

// skipping Neg_3c2a4898, contains type variables

// skipping AddSub_b99b22d8, contains type variables

// skipping Div_5ac12902, contains type variables

// skipping Mul_1de4e4c0, contains type variables

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
/*(
    x#:0: float,
    y#:1: float,
    z#:2: float,
    w#:3: float,
): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: w#:3, z: z#:2}*/vec4 vec4_4d4983bb(
    float x_0,
    float y_1,
    float z_2,
    float w_3
) {
    return vec4(x_0, y_1, z_2, w_3);
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
/*(
    a#:0: Vec4#🕒🧑‍🏫🎃,
    b#:1: Vec4#🕒🧑‍🏫🎃,
): float => a#:0.#Vec2#🐭😉😵😃#0 * b#:1.#Vec2#🐭😉😵😃#0 + a#:0.#Vec2#🐭😉😵😃#1 * b#:1.#Vec2#🐭😉😵😃#1 + a#:0.#Vec3#🐬#0 * b#:1.#Vec3#🐬#0 + a#:0.#Vec4#🕒🧑‍🏫🎃#0 * b#:1.#Vec4#🕒🧑‍🏫🎃#0*/float dot_a0178052(
    vec4 a_0,
    vec4 b_1
) {
    return ((((a_0.x * b_1.x) + (a_0.y * b_1.y)) + (a_0.z * b_1.z)) + (a_0.w * b_1.w));
}

/**
```
const vec4#b00b79a0 = (v#:0: Vec3#9f1c0644, w#:1: float#builtin): Vec4#3b941378 ={}> Vec4#3b941378{
    ...v#:0,
    w#3b941378#0: w#:1,
}
```
*/
/*(
    v#:0: Vec3#🐬,
    w#:1: float,
): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: w#:1, z: v#:0.#Vec3#🐬#0}*/vec4 vec4_b00b79a0(
    vec3 v_0,
    float w_1
) {
    return vec4(v_0.x, v_0.y, v_0.z, w_1);
}

/**
```
const rotate#d804569c = (tx#:0: float#builtin, ty#:1: float#builtin, tz#:2: float#builtin): Mat4#d92781e8 ={}> {
    const cg#:3 = cos#builtin(tx#:0);
    const sg#:4 = sin#builtin(tx#:0);
    const cb#:5 = cos#builtin(ty#:1);
    const sb#:6 = sin#builtin(ty#:1);
    const ca#:7 = cos#builtin(tz#:2);
    const sa#:8 = sin#builtin(tz#:2);
    Mat4#d92781e8{
        r1#d92781e8#0: vec4#4d4983bb(
            x: ca#:7 *#builtin cb#:5,
            y: ca#:7 *#builtin sb#:6 *#builtin sg#:4 -#builtin sa#:8 *#builtin cg#:3,
            z: ca#:7 *#builtin sb#:6 *#builtin cg#:3 +#builtin sa#:8 *#builtin sg#:4,
            w: 0.0,
        ),
        r2#d92781e8#1: vec4#4d4983bb(
            x: sa#:8 *#builtin cb#:5,
            y: sa#:8 *#builtin sb#:6 *#builtin sg#:4 +#builtin ca#:7 *#builtin cg#:3,
            z: sa#:8 *#builtin sb#:6 *#builtin cg#:3 -#builtin ca#:7 *#builtin sg#:4,
            w: 0.0,
        ),
        r3#d92781e8#2: vec4#4d4983bb(
            x: -sb#:6,
            y: cb#:5 *#builtin sg#:4,
            z: cb#:5 *#builtin cg#:3,
            w: 0.0,
        ),
        r4#d92781e8#3: vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
```
*/
/*(
    tx#:0: float,
    ty#:1: float,
    tz#:2: float,
): Mat4#🗣️ => {
    const cg#:3: float = cos(tx#:0);
    const sg#:4: float = sin(tx#:0);
    const cb#:5: float = cos(ty#:1);
    const sb#:6: float = sin(ty#:1);
    const ca#:7: float = cos(tz#:2);
    const sa#:8: float = sin(tz#:2);
    return Mat4#🗣️{TODO SPREADs}{
        r1: vec4#🎆🌷🧑‍🦰😃(
            ca#:7 * cb#:5,
            ca#:7 * sb#:6 * sg#:4 - sa#:8 * cg#:3,
            ca#:7 * sb#:6 * cg#:3 + sa#:8 * sg#:4,
            0,
        ),
        r2: vec4#🎆🌷🧑‍🦰😃(
            sa#:8 * cb#:5,
            sa#:8 * sb#:6 * sg#:4 + ca#:7 * cg#:3,
            sa#:8 * sb#:6 * cg#:3 - ca#:7 * sg#:4,
            0,
        ),
        r3: vec4#🎆🌷🧑‍🦰😃(-sb#:6, cb#:5 * sg#:4, cb#:5 * cg#:3, 0),
        r4: vec4#🎆🌷🧑‍🦰😃(0, 0, 0, 1),
    };
}*/mat4 rotate_d804569c(float tx_0, float ty_1, float tz_2) {
    float cg = cos(tx_0);
    float sg = sin(tx_0);
    float cb = cos(ty_1);
    float sb = sin(ty_1);
    float ca = cos(tz_2);
    float sa = sin(tz_2);
    return mat4(
        vec4_4d4983bb(
            (ca * cb),
            (((ca * sb) * sg) - (sa * cg)),
            (((ca * sb) * cg) + (sa * sg)),
            0.0
        ),
        vec4_4d4983bb(
            (sa * cb),
            (((sa * sb) * sg) + (ca * cg)),
            (((sa * sb) * cg) - (ca * sg)),
            0.0
        ),
        vec4_4d4983bb(-sb, (cb * sg), (cb * cg), 0.0),
        vec4_4d4983bb(0.0, 0.0, 0.0, 1.0)
    );
}

/* -- generated -- */
/*(mat#:0: Mat4#🗣️, vec#:1: Vec4#🕒🧑‍🏫🎃): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{
    w: dot#😞(mat#:0.#Mat4#🗣️#3, vec#:1),
    z: dot#😞(mat#:0.#Mat4#🗣️#2, vec#:1),
}*/vec4 V16557d10_1de4e4c0_0(mat4 mat_0, vec4 vec_1) {
    return vec4(
        dot_a0178052(mat_0[0], vec_1),
        dot_a0178052(mat_0[1], vec_1),
        dot_a0178052(mat_0[2], vec_1),
        dot_a0178052(mat_0[3], vec_1)
    );
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
/*(
    v#:0: Vec4#🕒🧑‍🏫🎃,
): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: v#:0.#Vec3#🐬#0,
    x: v#:0.#Vec2#🐭😉😵😃#0,
    y: v#:0.#Vec2#🐭😉😵😃#1,
}*/vec3 xyz_1aedf216(vec4 v_0) {
    return vec3(v_0.x, v_0.y, v_0.z);
}

/**
```
const length#63e16b7a = (v#:0: Vec3#9f1c0644): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
            +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1 
        +#builtin v#:0.z#9f1c0644#0 *#builtin v#:0.z#9f1c0644#0,
)
```
*/
/*(
    v#:0: Vec3#🐬,
): float => sqrt(
    v#:0.#Vec2#🐭😉😵😃#0 * v#:0.#Vec2#🐭😉😵😃#0 + v#:0.#Vec2#🐭😉😵😃#1 * v#:0.#Vec2#🐭😉😵😃#1 + v#:0.#Vec3#🐬#0 * v#:0.#Vec3#🐬#0,
)*/float length_63e16b7a(vec3 v_0) {
    return sqrt((((v_0.x * v_0.x) + (v_0.y * v_0.y)) + (v_0.z * v_0.z)));
}

/* -- generated -- */
/*(v#:0: Vec3#🐬, scale#:1: float): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: v#:0.#Vec3#🐬#0 / scale#:1,
    x: v#:0.#Vec2#🐭😉😵😃#0 / scale#:1,
    y: v#:0.#Vec2#🐭😉😵😃#1 / scale#:1,
}*/vec3 V68f73ad4_5ac12902_0(vec3 v_0, float scale_1) {
    return vec3((v_0.x / scale_1), (v_0.y / scale_1), (v_0.z / scale_1));
}

/**
```
const rotate#6734d670 = (
    v#:0: Vec3#9f1c0644,
    x#:1: float#builtin,
    y#:2: float#builtin,
    z#:3: float#builtin,
): Vec3#9f1c0644 ={}> {
    xyz#1aedf216(
        v: rotate#d804569c(tx: x#:1, ty: y#:2, tz: z#:3) 
            *#16557d10#1de4e4c0#0 vec4#b00b79a0(v#:0, w: 1.0),
    );
}
```
*/
/*(
    v#:0: Vec3#🐬,
    x#:1: float,
    y#:2: float,
    z#:3: float,
): Vec3#🐬 => xyz#🐭🕔🤸(
    generated#16557d10_1de4e4c0_0(rotate#🥪(x#:1, y#:2, z#:3), vec4#🏊‍♂️(v#:0, 1)),
)*/vec3 rotate_6734d670(vec3 v_0, float x_1, float y_2, float z_3) {
    return xyz_1aedf216(
        V16557d10_1de4e4c0_0(rotate_d804569c(x_1, y_2, z_3), vec4_b00b79a0(v_0, 1.0))
    );
}

/* -- generated -- */
/*(v#:0: Vec3#🐬): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: -v#:0.#Vec3#🐬#0,
    x: -v#:0.#Vec2#🐭😉😵😃#0,
    y: -v#:0.#Vec2#🐭😉😵😃#1,
}*/vec3 Va5cd53ce_3c2a4898_0(vec3 v_0) {
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
/*(
    one#:0: Vec3#🐬,
    two#:1: Vec3#🐬,
): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: one#:0.#Vec2#🐭😉😵😃#0 * two#:1.#Vec2#🐭😉😵😃#1 - two#:1.#Vec2#🐭😉😵😃#0 * one#:0.#Vec2#🐭😉😵😃#1,
    x: one#:0.#Vec2#🐭😉😵😃#1 * two#:1.#Vec3#🐬#0 - two#:1.#Vec2#🐭😉😵😃#1 * one#:0.#Vec3#🐬#0,
    y: one#:0.#Vec3#🐬#0 * two#:1.#Vec2#🐭😉😵😃#0 - two#:1.#Vec3#🐬#0 * one#:0.#Vec2#🐭😉😵😃#0,
}*/vec3 cross_54f2119c(vec3 one_0, vec3 two_1) {
    return vec3(
        ((one_0.y * two_1.z) - (two_1.y * one_0.z)),
        ((one_0.z * two_1.x) - (two_1.z * one_0.x)),
        ((one_0.x * two_1.y) - (two_1.x * one_0.y))
    );
}

/* -- generated -- */
/*(one#:2: Vec3#🐬, two#:3: Vec3#🐬): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: one#:2.#Vec3#🐬#0 - two#:3.#Vec3#🐬#0,
    x: one#:2.#Vec2#🐭😉😵😃#0 - two#:3.#Vec2#🐭😉😵😃#0,
    y: one#:2.#Vec2#🐭😉😵😃#1 - two#:3.#Vec2#🐭😉😵😃#1,
}*/vec3 V1c6fdd91_b99b22d8_1(vec3 one_2, vec3 two_3) {
    return vec3((one_2.x - two_3.x), (one_2.y - two_3.y), (one_2.z - two_3.z));
}

/**
```
const normalize#48e6ea27 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> v#:0 
    /#68f73ad4#5ac12902#0 length#63e16b7a(v#:0)
```
*/
/*(
    v#:0: Vec3#🐬,
): Vec3#🐬 => generated#68f73ad4_5ac12902_0(v#:0, length#🕓🤬🐲😃(v#:0))*/vec3 normalize_48e6ea27(
    vec3 v_0
) {
    return V68f73ad4_5ac12902_0(v_0, length_63e16b7a(v_0));
}

/**
```
const radians#dabe7f9c = (degrees#:0: float#builtin): float#builtin ={}> degrees#:0 /#builtin 180.0 
    *#builtin PI#builtin
```
*/
/*(
    degrees#:0: float,
): float => degrees#:0 / 180 * PI*/float radians_dabe7f9c(float degrees_0) {
    return ((degrees_0 / 180.0) * PI);
}

/* -- generated -- */
/*(v#:0: Vec2#🐭😉😵😃, scale#:1: float): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{
    x: v#:0.#Vec2#🐭😉😵😃#0 / scale#:1,
    y: v#:0.#Vec2#🐭😉😵😃#1 / scale#:1,
}*/vec2 Vafc24bbe_5ac12902_0(vec2 v_0, float scale_1) {
    return vec2((v_0.x / scale_1), (v_0.y / scale_1));
}

/* -- generated -- */
/*(one#:2: Vec2#🐭😉😵😃, two#:3: Vec2#🐭😉😵😃): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{
    x: one#:2.#Vec2#🐭😉😵😃#0 - two#:3.#Vec2#🐭😉😵😃#0,
    y: one#:2.#Vec2#🐭😉😵😃#1 - two#:3.#Vec2#🐭😉😵😃#1,
}*/vec2 V70bb2056_b99b22d8_1(vec2 one_2, vec2 two_3) {
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
/*(
    v#:0: Vec2#🐭😉😵😃,
    z#:1: float,
): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{z: z#:1, x: v#:0.#Vec2#🐭😉😵😃#0, y: v#:0.#Vec2#🐭😉😵😃#1}*/vec3 vec3_5808ec54(
    vec2 v_0,
    float z_1
) {
    return vec3(v_0.x, v_0.y, z_1);
}

/* *
```
const EPSILON#17261aaa = 0.0001
```
 */
/*0.0001*/const float EPSILON_17261aaa = 0.00010;

/* -- generated -- */
/*(env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec3#🐬): float => {
    const pos#:2: Vec3#🐬 = rotate#🍊💂‍♂️🍍😃(
        pos#:1,
        0,
        env#:0.#GLSLEnv#🕷️⚓😣😃#0 / 2,
        env#:0.#GLSLEnv#🕷️⚓😣😃#0,
    );
    const period#:4: float = 30 * sin(env#:0.#GLSLEnv#🕷️⚓😣😃#0) + 1;
    return length#🕓🤬🐲😃(pos#:2) - 0.5 - (sin(pos#:2.#Vec2#🐭😉😵😃#0 * period#:4) + sin(
        pos#:2.#Vec3#🐬#0 * period#:4,
    ) + sin(pos#:2.#Vec2#🐭😉😵😃#1 * period#:4)) / ((sin(env#:0.#GLSLEnv#🕷️⚓😣😃#0 / 2) + 1) * (60) + 1);
}*/float ok_lambda_aaa6336a(GLSLEnv_451d5252 env_0, vec3 pos_1) {
    vec3 pos = rotate_6734d670(pos_1, 0.0, (env_0.time / 2.0), env_0.time);
    float period = (30.0 * (sin(env_0.time) + 1.0));
    return ((length_63e16b7a(pos) - 0.50) - (((sin((pos.x * period)) + sin((pos.z * period))) + sin(
        (pos.y * period)
    )) / (((sin((env_0.time / 2.0)) + 1.0) * 60.0) + 1.0)));
}

/**
```
const vec3#18cdf03e = (x#:0: float#builtin, y#:1: float#builtin, z#:2: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: x#:0,
    y#43802a16#1: y#:1,
    z#9f1c0644#0: z#:2,
}
```
*/
/*(
    x#:0: float,
    y#:1: float,
    z#:2: float,
): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{z: z#:2, x: x#:0, y: y#:1}*/vec3 vec3_18cdf03e(
    float x_0,
    float y_1,
    float z_2
) {
    return vec3(x_0, y_1, z_2);
}

/* -- generated -- */
/*(scale#:0: float, v#:1: Vec3#🐬): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: v#:1.#Vec3#🐬#0 * scale#:0,
    x: v#:1.#Vec2#🐭😉😵😃#0 * scale#:0,
    y: v#:1.#Vec2#🐭😉😵😃#1 * scale#:0,
}*/vec3 Vc4a91006_1de4e4c0_0(float scale_0, vec3 v_1) {
    return vec3((v_1.x * scale_0), (v_1.y * scale_0), (v_1.z * scale_0));
}

/* -- generated -- */
/*(one#:0: Vec3#🐬, two#:1: Vec3#🐬): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: one#:0.#Vec3#🐬#0 + two#:1.#Vec3#🐬#0,
    x: one#:0.#Vec2#🐭😉😵😃#0 + two#:1.#Vec2#🐭😉😵😃#0,
    y: one#:0.#Vec2#🐭😉😵😃#1 + two#:1.#Vec2#🐭😉😵😃#1,
}*/vec3 V1c6fdd91_b99b22d8_0(vec3 one_0, vec3 two_1) {
    return vec3((one_0.x + two_1.x), (one_0.y + two_1.y), (one_0.z + two_1.z));
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
/*(
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
}*/mat4 viewMatrix_c336d78c(vec3 eye_0, vec3 center_1, vec3 up_2) {
    vec3 f = normalize_48e6ea27(V1c6fdd91_b99b22d8_1(center_1, eye_0));
    vec3 s = normalize_48e6ea27(cross_54f2119c(f, up_2));
    vec3 spread = cross_54f2119c(s, f);
    vec3 spread_7 = Va5cd53ce_3c2a4898_0(f);
    return mat4(
        vec4(s.x, s.y, s.z, 0.0),
        vec4(spread.x, spread.y, spread.z, 0.0),
        vec4(spread_7.x, spread_7.y, spread_7.z, 0.0),
        vec4_4d4983bb(0.0, 0.0, 0.0, 1.0)
    );
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
/*(
    fieldOfView#:0: float,
    size#:1: Vec2#🐭😉😵😃,
    fragCoord#:2: Vec2#🐭😉😵😃,
): Vec3#🐬 => normalize#🦡🤹🕳️😃(
    vec3#😩🐢🧑‍🦽😃(
        generated#70bb2056_b99b22d8_1(fragCoord#:2, generated#afc24bbe_5ac12902_0(size#:1, 2)),
        -size#:1.#Vec2#🐭😉😵😃#1 / tan(radians#🌟(fieldOfView#:0) / 2),
    ),
)*/vec3 rayDirection_6258178a(float fieldOfView_0, vec2 size_1, vec2 fragCoord_2) {
    return normalize_48e6ea27(
        vec3_5808ec54(
            V70bb2056_b99b22d8_1(fragCoord_2, Vafc24bbe_5ac12902_0(size_1, 2.0)),
            -(size_1.y / tan((radians_dabe7f9c(fieldOfView_0) / 2.0)))
        )
    );
}

/* -- generated -- */
/*(one#:0: Vec4#🕒🧑‍🏫🎃, two#:1: Vec4#🕒🧑‍🏫🎃): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{
    w: one#:0.#Vec4#🕒🧑‍🏫🎃#0 + two#:1.#Vec4#🕒🧑‍🏫🎃#0,
    z: one#:0.#Vec3#🐬#0 + two#:1.#Vec3#🐬#0,
}*/vec4 V0555d260_b99b22d8_0(vec4 one_0, vec4 two_1) {
    return vec4((one_0.x + two_1.x), (one_0.y + two_1.y), (one_0.z + two_1.z), (one_0.w + two_1.w));
}

/* -- generated -- */
/*(v#:0: Vec4#🕒🧑‍🏫🎃, scale#:1: float): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{
    w: v#:0.#Vec4#🕒🧑‍🏫🎃#0 / scale#:1,
    z: v#:0.#Vec3#🐬#0 / scale#:1,
}*/vec4 V56d43c0e_5ac12902_0(vec4 v_0, float scale_1) {
    return vec4((v_0.x / scale_1), (v_0.y / scale_1), (v_0.z / scale_1), (v_0.w / scale_1));
}

/**
```
const vec2#54a9f2ef = (x#:0: float#builtin, y#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
    x#43802a16#0: x#:0,
    y#43802a16#1: y#:1,
}
```
*/
/*(
    x#:0: float,
    y#:1: float,
): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{x: x#:0, y: y#:1}*/vec2 vec2_54a9f2ef(
    float x_0,
    float y_1
) {
    return vec2(x_0, y_1);
}

/* -- generated -- */
/*(one#:0: Vec2#🐭😉😵😃, two#:1: Vec2#🐭😉😵😃): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{
    x: one#:0.#Vec2#🐭😉😵😃#0 + two#:1.#Vec2#🐭😉😵😃#0,
    y: one#:0.#Vec2#🐭😉😵😃#1 + two#:1.#Vec2#🐭😉😵😃#1,
}*/vec2 V70bb2056_b99b22d8_0(vec2 one_0, vec2 two_1) {
    return vec2((one_0.x + two_1.x), (one_0.y + two_1.y));
}

/* -- generated -- */
/*(v#:0: Vec3#🐬, scale#:1: float): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: v#:0.#Vec3#🐬#0 * scale#:1,
    x: v#:0.#Vec2#🐭😉😵😃#0 * scale#:1,
    y: v#:0.#Vec2#🐭😉😵😃#1 * scale#:1,
}*/vec3 V1d31aa6e_1de4e4c0_0(vec3 v_0, float scale_1) {
    return vec3((v_0.x * scale_1), (v_0.y * scale_1), (v_0.z * scale_1));
}

/* -- generated -- */
/*(env#:1: GLSLEnv#🕷️⚓😣😃, p#:2: Vec3#🐬): Vec3#🐬 => normalize#🦡🤹🕳️😃(
    vec3#🧐🕔🧖(
        ok_lambda#🧳(
            env#:1,
            Vec3#🐬{TODO SPREADs}{
                z: p#:2.#Vec3#🐬#0,
                x: p#:2.#Vec2#🐭😉😵😃#0 + EPSILON#🧂💃🚶‍♂️,
                y: p#:2.#Vec2#🐭😉😵😃#1,
            },
        ) - ok_lambda#🧳(
            env#:1,
            Vec3#🐬{TODO SPREADs}{
                z: p#:2.#Vec3#🐬#0,
                x: p#:2.#Vec2#🐭😉😵😃#0 - EPSILON#🧂💃🚶‍♂️,
                y: p#:2.#Vec2#🐭😉😵😃#1,
            },
        ),
        ok_lambda#🧳(
            env#:1,
            Vec3#🐬{TODO SPREADs}{
                z: p#:2.#Vec3#🐬#0,
                x: p#:2.#Vec2#🐭😉😵😃#0,
                y: p#:2.#Vec2#🐭😉😵😃#1 + EPSILON#🧂💃🚶‍♂️,
            },
        ) - ok_lambda#🧳(
            env#:1,
            Vec3#🐬{TODO SPREADs}{
                z: p#:2.#Vec3#🐬#0,
                x: p#:2.#Vec2#🐭😉😵😃#0,
                y: p#:2.#Vec2#🐭😉😵😃#1 - EPSILON#🧂💃🚶‍♂️,
            },
        ),
        ok_lambda#🧳(
            env#:1,
            Vec3#🐬{TODO SPREADs}{
                z: p#:2.#Vec3#🐬#0 + EPSILON#🧂💃🚶‍♂️,
                x: p#:2.#Vec2#🐭😉😵😃#0,
                y: p#:2.#Vec2#🐭😉😵😃#1,
            },
        ) - ok_lambda#🧳(
            env#:1,
            Vec3#🐬{TODO SPREADs}{
                z: p#:2.#Vec3#🐬#0 - EPSILON#🧂💃🚶‍♂️,
                x: p#:2.#Vec2#🐭😉😵😃#0,
                y: p#:2.#Vec2#🐭😉😵😃#1,
            },
        ),
    ),
)*/vec3 estimateNormal_specialization_7579ca6e(GLSLEnv_451d5252 env_1, vec3 p_2) {
    return normalize_48e6ea27(
        vec3_18cdf03e(
            (ok_lambda_aaa6336a(env_1, vec3((p_2.x + EPSILON_17261aaa), p_2.y, p_2.z)) - ok_lambda_aaa6336a(
                env_1,
                vec3((p_2.x - EPSILON_17261aaa), p_2.y, p_2.z)
            )),
            (ok_lambda_aaa6336a(env_1, vec3(p_2.x, (p_2.y + EPSILON_17261aaa), p_2.z)) - ok_lambda_aaa6336a(
                env_1,
                vec3(p_2.x, (p_2.y - EPSILON_17261aaa), p_2.z)
            )),
            (ok_lambda_aaa6336a(env_1, vec3(p_2.x, p_2.y, (p_2.z + EPSILON_17261aaa))) - ok_lambda_aaa6336a(
                env_1,
                vec3(p_2.x, p_2.y, (p_2.z - EPSILON_17261aaa))
            ))
        )
    );
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
/*(
    x#:0: float,
): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: x#:0, z: x#:0}*/vec4 vec4_72fca9b4(float x_0) {
    return vec4(x_0, x_0, x_0, x_0);
}

/* -- generated -- */
/*(
    env#:1: GLSLEnv#🕷️⚓😣😃,
    eye#:2: Vec3#🐬,
    marchingDirection#:3: Vec3#🐬,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
): float => {
    loop {
        const dist#:7: float = ok_lambda#🧳(
            env#:1,
            generated#1c6fdd91_b99b22d8_0(
                eye#:2,
                generated#c4a91006_1de4e4c0_0(start#:4, marchingDirection#:3),
            ),
        );
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
}*/float shortestDistanceToSurface_specialization_0bcae438(
    GLSLEnv_451d5252 env_1,
    vec3 eye_2,
    vec3 marchingDirection_3,
    float start_4,
    float end_5,
    int stepsLeft_6
) {
    for (int i=0; i<10000; i++) {
        float dist = ok_lambda_aaa6336a(
            env_1,
            V1c6fdd91_b99b22d8_0(eye_2, Vc4a91006_1de4e4c0_0(start_4, marchingDirection_3))
        );
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
/*(
    resolution#:0: Vec2#🐭😉😵😃,
    coord#:1: Vec2#🐭😉😵😃,
    eye#:2: Vec3#🐬,
    fieldOfView#:3: float,
): Vec3#🐬 => {
    const spread#:7: Vec3#🐬 = rayDirection#🌑🐂🦨😃(fieldOfView#:3, resolution#:0, coord#:1);
    return xyz#🐭🕔🤸(
        generated#16557d10_1de4e4c0_0(
            viewMatrix#🌓(
                Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0},
                Vec3#🐬{TODO SPREADs}{z: 0, x: 0, y: 0},
                Vec3#🐬{TODO SPREADs}{z: 0, x: 0, y: 1},
            ),
            Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 0, z: spread#:7.#Vec3#🐬#0},
        ),
    );
}*/vec3 getWorldDir_92052fca(vec2 resolution_0, vec2 coord_1, vec3 eye_2, float fieldOfView_3) {
    vec3 spread_7 = rayDirection_6258178a(fieldOfView_3, resolution_0, coord_1);
    return xyz_1aedf216(
        V16557d10_1de4e4c0_0(
            viewMatrix_c336d78c(vec3(0.0, 0.0, 5.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0)),
            vec4(spread_7.x, spread_7.y, spread_7.z, 0.0)
        )
    );
}

/**
```
const ok#0cccfe1a = multiSample#0ae0f98c(
    fn: marchNormals#132bd797(
        sceneSDF: (env#:0: GLSLEnv#451d5252, pos#:1: Vec3#9f1c0644): float#builtin ={}> {
            const pos#:2 = rotate#6734d670(
                v: pos#:1,
                x: 0.0,
                y: env#:0.time#451d5252#0 /#builtin 2.0,
                z: env#:0.time#451d5252#0,
            );
            const mag#:3 = (sin#builtin(env#:0.time#451d5252#0 /#builtin 2.0) +#builtin 1.0) 
                    *#builtin 60.0 
                +#builtin 1.0;
            const period#:4 = 30.0 *#builtin (sin#builtin(env#:0.time#451d5252#0) +#builtin 1.0);
            const sphere#:5 = length#63e16b7a(v: pos#:2) -#builtin 0.5;
            const bumps#:6 = sin#builtin(pos#:2.x#43802a16#0 *#builtin period#:4) 
                    +#builtin sin#builtin(pos#:2.z#9f1c0644#0 *#builtin period#:4) 
                +#builtin sin#builtin(pos#:2.y#43802a16#1 *#builtin period#:4);
            sphere#:5 -#builtin bumps#:6 /#builtin mag#:3;
        },
    ),
)
```
*/
/*(
    arg0#:41: GLSLEnv#🕷️⚓😣😃,
    arg1#:42: Vec2#🐭😉😵😃,
): Vec4#🕒🧑‍🏫🎃 => {
    const result#:43: Vec4#🕒🧑‍🏫🎃;
    const eye#:18: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:19: Vec3#🐬 = getWorldDir#🎁(
        arg0#:41.#GLSLEnv#🕷️⚓😣😃#1,
        arg1#:42,
        eye#:18,
        45,
    );
    const dist#:20: float = shortestDistanceToSurface_specialization#😵🍡👂(
        arg0#:41,
        eye#:18,
        worldDir#:19,
        0,
        100,
        255,
    );
    if dist#:20 > 100 - EPSILON#🧂💃🚶‍♂️ {
        result#:43 = vec4#🤽🚇🚞😃(0);
    } else {
        result#:43 = vec4#🏊‍♂️(
            estimateNormal_specialization#🍈🍌🚤😃(
                arg0#:41,
                generated#1c6fdd91_b99b22d8_0(
                    eye#:18,
                    generated#1d31aa6e_1de4e4c0_0(worldDir#:19, dist#:20),
                ),
            ),
            1,
        );
    };
    const result#:45: Vec4#🕒🧑‍🏫🎃;
    const eye#:23: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:24: Vec3#🐬 = getWorldDir#🎁(
        arg0#:41.#GLSLEnv#🕷️⚓😣😃#1,
        generated#70bb2056_b99b22d8_0(arg1#:42, vec2#⛰️🍅👨‍🍼😃(0.5, 0)),
        eye#:23,
        45,
    );
    const dist#:25: float = shortestDistanceToSurface_specialization#😵🍡👂(
        arg0#:41,
        eye#:23,
        worldDir#:24,
        0,
        100,
        255,
    );
    if dist#:25 > 100 - EPSILON#🧂💃🚶‍♂️ {
        result#:45 = vec4#🤽🚇🚞😃(0);
    } else {
        result#:45 = vec4#🏊‍♂️(
            estimateNormal_specialization#🍈🍌🚤😃(
                arg0#:41,
                generated#1c6fdd91_b99b22d8_0(
                    eye#:23,
                    generated#1d31aa6e_1de4e4c0_0(worldDir#:24, dist#:25),
                ),
            ),
            1,
        );
    };
    const result#:47: Vec4#🕒🧑‍🏫🎃;
    const eye#:28: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:29: Vec3#🐬 = getWorldDir#🎁(
        arg0#:41.#GLSLEnv#🕷️⚓😣😃#1,
        generated#70bb2056_b99b22d8_0(arg1#:42, vec2#⛰️🍅👨‍🍼😃(-0.5, 0)),
        eye#:28,
        45,
    );
    const dist#:30: float = shortestDistanceToSurface_specialization#😵🍡👂(
        arg0#:41,
        eye#:28,
        worldDir#:29,
        0,
        100,
        255,
    );
    if dist#:30 > 100 - EPSILON#🧂💃🚶‍♂️ {
        result#:47 = vec4#🤽🚇🚞😃(0);
    } else {
        result#:47 = vec4#🏊‍♂️(
            estimateNormal_specialization#🍈🍌🚤😃(
                arg0#:41,
                generated#1c6fdd91_b99b22d8_0(
                    eye#:28,
                    generated#1d31aa6e_1de4e4c0_0(worldDir#:29, dist#:30),
                ),
            ),
            1,
        );
    };
    const result#:49: Vec4#🕒🧑‍🏫🎃;
    const eye#:33: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:34: Vec3#🐬 = getWorldDir#🎁(
        arg0#:41.#GLSLEnv#🕷️⚓😣😃#1,
        generated#70bb2056_b99b22d8_0(arg1#:42, vec2#⛰️🍅👨‍🍼😃(0, 0.5)),
        eye#:33,
        45,
    );
    const dist#:35: float = shortestDistanceToSurface_specialization#😵🍡👂(
        arg0#:41,
        eye#:33,
        worldDir#:34,
        0,
        100,
        255,
    );
    if dist#:35 > 100 - EPSILON#🧂💃🚶‍♂️ {
        result#:49 = vec4#🤽🚇🚞😃(0);
    } else {
        result#:49 = vec4#🏊‍♂️(
            estimateNormal_specialization#🍈🍌🚤😃(
                arg0#:41,
                generated#1c6fdd91_b99b22d8_0(
                    eye#:33,
                    generated#1d31aa6e_1de4e4c0_0(worldDir#:34, dist#:35),
                ),
            ),
            1,
        );
    };
    const result#:51: Vec4#🕒🧑‍🏫🎃;
    const eye#:38: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:39: Vec3#🐬 = getWorldDir#🎁(
        arg0#:41.#GLSLEnv#🕷️⚓😣😃#1,
        generated#70bb2056_b99b22d8_0(arg1#:42, vec2#⛰️🍅👨‍🍼😃(0, -0.5)),
        eye#:38,
        45,
    );
    const dist#:40: float = shortestDistanceToSurface_specialization#😵🍡👂(
        arg0#:41,
        eye#:38,
        worldDir#:39,
        0,
        100,
        255,
    );
    if dist#:40 > 100 - EPSILON#🧂💃🚶‍♂️ {
        result#:51 = vec4#🤽🚇🚞😃(0);
    } else {
        result#:51 = vec4#🏊‍♂️(
            estimateNormal_specialization#🍈🍌🚤😃(
                arg0#:41,
                generated#1c6fdd91_b99b22d8_0(
                    eye#:38,
                    generated#1d31aa6e_1de4e4c0_0(worldDir#:39, dist#:40),
                ),
            ),
            1,
        );
    };
    return generated#56d43c0e_5ac12902_0(
        generated#0555d260_b99b22d8_0(
            generated#0555d260_b99b22d8_0(
                generated#0555d260_b99b22d8_0(
                    generated#0555d260_b99b22d8_0(result#:43, result#:45),
                    result#:47,
                ),
                result#:49,
            ),
            result#:51,
        ),
        5,
    );
}*/vec4 ok_0cccfe1a(GLSLEnv_451d5252 arg0_41, vec2 arg1_42) {
    vec4 result;
    vec3 eye = vec3(0.0, 0.0, 5.0);
    vec3 worldDir = getWorldDir_92052fca(arg0_41.resolution, arg1_42, eye, 45.0);
    float dist_20 = shortestDistanceToSurface_specialization_0bcae438(
        arg0_41,
        eye,
        worldDir,
        0.0,
        100.0,
        255
    );
    if ((dist_20 > (100.0 - EPSILON_17261aaa))) {
        result = vec4_72fca9b4(0.0);
    } else {
        result = vec4_b00b79a0(
            estimateNormal_specialization_7579ca6e(
                arg0_41,
                V1c6fdd91_b99b22d8_0(eye, V1d31aa6e_1de4e4c0_0(worldDir, dist_20))
            ),
            1.0
        );
    };
    vec4 result_45;
    vec3 eye_23 = vec3(0.0, 0.0, 5.0);
    vec3 worldDir_24 = getWorldDir_92052fca(
        arg0_41.resolution,
        V70bb2056_b99b22d8_0(arg1_42, vec2_54a9f2ef(0.50, 0.0)),
        eye_23,
        45.0
    );
    float dist_25 = shortestDistanceToSurface_specialization_0bcae438(
        arg0_41,
        eye_23,
        worldDir_24,
        0.0,
        100.0,
        255
    );
    if ((dist_25 > (100.0 - EPSILON_17261aaa))) {
        result_45 = vec4_72fca9b4(0.0);
    } else {
        result_45 = vec4_b00b79a0(
            estimateNormal_specialization_7579ca6e(
                arg0_41,
                V1c6fdd91_b99b22d8_0(eye_23, V1d31aa6e_1de4e4c0_0(worldDir_24, dist_25))
            ),
            1.0
        );
    };
    vec4 result_47;
    vec3 eye_28 = vec3(0.0, 0.0, 5.0);
    vec3 worldDir_29 = getWorldDir_92052fca(
        arg0_41.resolution,
        V70bb2056_b99b22d8_0(arg1_42, vec2_54a9f2ef(-0.50, 0.0)),
        eye_28,
        45.0
    );
    float dist_30 = shortestDistanceToSurface_specialization_0bcae438(
        arg0_41,
        eye_28,
        worldDir_29,
        0.0,
        100.0,
        255
    );
    if ((dist_30 > (100.0 - EPSILON_17261aaa))) {
        result_47 = vec4_72fca9b4(0.0);
    } else {
        result_47 = vec4_b00b79a0(
            estimateNormal_specialization_7579ca6e(
                arg0_41,
                V1c6fdd91_b99b22d8_0(eye_28, V1d31aa6e_1de4e4c0_0(worldDir_29, dist_30))
            ),
            1.0
        );
    };
    vec4 result_49;
    vec3 eye_33 = vec3(0.0, 0.0, 5.0);
    vec3 worldDir_34 = getWorldDir_92052fca(
        arg0_41.resolution,
        V70bb2056_b99b22d8_0(arg1_42, vec2_54a9f2ef(0.0, 0.50)),
        eye_33,
        45.0
    );
    float dist_35 = shortestDistanceToSurface_specialization_0bcae438(
        arg0_41,
        eye_33,
        worldDir_34,
        0.0,
        100.0,
        255
    );
    if ((dist_35 > (100.0 - EPSILON_17261aaa))) {
        result_49 = vec4_72fca9b4(0.0);
    } else {
        result_49 = vec4_b00b79a0(
            estimateNormal_specialization_7579ca6e(
                arg0_41,
                V1c6fdd91_b99b22d8_0(eye_33, V1d31aa6e_1de4e4c0_0(worldDir_34, dist_35))
            ),
            1.0
        );
    };
    vec4 result_51;
    vec3 eye_38 = vec3(0.0, 0.0, 5.0);
    vec3 worldDir_39 = getWorldDir_92052fca(
        arg0_41.resolution,
        V70bb2056_b99b22d8_0(arg1_42, vec2_54a9f2ef(0.0, -0.50)),
        eye_38,
        45.0
    );
    float dist_40 = shortestDistanceToSurface_specialization_0bcae438(
        arg0_41,
        eye_38,
        worldDir_39,
        0.0,
        100.0,
        255
    );
    if ((dist_40 > (100.0 - EPSILON_17261aaa))) {
        result_51 = vec4_72fca9b4(0.0);
    } else {
        result_51 = vec4_b00b79a0(
            estimateNormal_specialization_7579ca6e(
                arg0_41,
                V1c6fdd91_b99b22d8_0(eye_38, V1d31aa6e_1de4e4c0_0(worldDir_39, dist_40))
            ),
            1.0
        );
    };
    return V56d43c0e_5ac12902_0(
        V0555d260_b99b22d8_0(
            V0555d260_b99b22d8_0(
                V0555d260_b99b22d8_0(V0555d260_b99b22d8_0(result, result_45), result_47),
                result_49
            ),
            result_51
        ),
        5.0
    );
}

void main() {
    fragColor = ok_0cccfe1a(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}