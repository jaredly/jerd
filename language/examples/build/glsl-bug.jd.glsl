#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform float u_time;

uniform vec2 u_mouse;

uniform int u_mousebutton;

uniform vec3 u_camera;

uniform vec2 u_resolution;

struct MovingTo_43dedff0{
    vec2 h43dedff0_0;
    vec2 h43dedff0_1;
};

struct At_343b47f0{
    vec2 h343b47f0_0;
};

struct Target_33b4b136{
    int tag;
    vec2 h343b47f0_0;
    vec2 h43dedff0_0;
    vec2 h43dedff0_1;
};

struct State_1e665e2c{
    vec2 h1e665e2c_0;
    Target_33b4b136 h1e665e2c_1;
};

// skipping AddSub_a318c258, contains type variables

// skipping GLSLEnv_d2ea39a0, contains type variables

struct ColorDist_0ef7cb40{
    float h0ef7cb40_0;
    vec3 h0ef7cb40_1;
};

struct T34b50ca6{
    State_1e665e2c state;
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
    int mouseButton;
};

/**
```
const lerp#0c604a2c = (a#:0: float#builtin, b#:1: float#builtin, c#:2: float#builtin): float#builtin ={}> c#:2 
        *#builtin (b#:1 -#builtin a#:0) 
    +#builtin a#:0
```
*/
/*(
    a#:0: float,
    b#:1: float,
    c#:2: float,
): float => c#:2 * b#:1 - a#:0 + a#:0*/float lerp_0c604a2c(float a_0, float b_1, float c_2) {
    return ((c_2 * (b_1 - a_0)) + a_0);
}

/**
```
const mix#1d944e78 = (a#:0: Vec3#9f1c0644, b#:1: Vec3#9f1c0644, c#:2: float#builtin): Vec3#9f1c0644 ={}> {
    Vec3#9f1c0644{
        x#43802a16#0: lerp#0c604a2c(a: a#:0.x#43802a16#0, b: b#:1.x#43802a16#0, c#:2),
        y#43802a16#1: lerp#0c604a2c(a: a#:0.y#43802a16#1, b: b#:1.y#43802a16#1, c#:2),
        z#9f1c0644#0: lerp#0c604a2c(a: a#:0.z#9f1c0644#0, b: b#:1.z#9f1c0644#0, c#:2),
    };
}
```
*/
/*(
    a#:0: Vec3#🐬,
    b#:1: Vec3#🐬,
    c#:2: float,
): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{
    z: lerp#🐣☺️👶(a#:0.#Vec3#🐬#0, b#:1.#Vec3#🐬#0, c#:2),
    x: lerp#🐣☺️👶(a#:0.#Vec2#🐭😉😵😃#0, b#:1.#Vec2#🐭😉😵😃#0, c#:2),
    y: lerp#🐣☺️👶(a#:0.#Vec2#🐭😉😵😃#1, b#:1.#Vec2#🐭😉😵😃#1, c#:2),
}*/vec3 mix_1d944e78(vec3 a_0, vec3 b_1, float c_2) {
    return vec3(
        lerp_0c604a2c(a_0.x, b_1.x, c_2),
        lerp_0c604a2c(a_0.y, b_1.y, c_2),
        lerp_0c604a2c(a_0.z, b_1.z, c_2)
    );
}

/**
```
const sminCubic#e7c85424 = (a#:0: float#builtin, b#:1: float#builtin, k#:2: float#builtin): float#builtin ={}> {
    const h#:3 = max#builtin(k#:2 -#builtin abs#builtin(a#:0 -#builtin b#:1), 0.0) /#builtin k#:2;
    const sixth#:4 = 1.0 /#builtin 6.0;
    min#builtin(a#:0, b#:1) 
        -#builtin h#:3 *#builtin h#:3 *#builtin h#:3 *#builtin k#:2 *#builtin sixth#:4;
}
```
*/
/*(
    a#:0: float,
    b#:1: float,
    k#:2: float,
): float => {
    const h#:3: float = max(k#:2 - abs(a#:0 - b#:1), 0) / k#:2;
    return min(a#:0, b#:1) - h#:3 * h#:3 * h#:3 * k#:2 * 1 / 6;
}*/float sminCubic_e7c85424(float a_0, float b_1, float k_2) {
    float h = (max((k_2 - abs((a_0 - b_1))), 0.0) / k_2);
    return (min(a_0, b_1) - ((((h * h) * h) * k_2) * (1.0 / 6.0)));
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
const vec3#dc78826c = (x#:0: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: x#:0,
    y#43802a16#1: x#:0,
    z#9f1c0644#0: x#:0,
}
```
*/
/*(
    x#:0: float,
): Vec3#🐬 => Vec3#🐬{TODO SPREADs}{z: x#:0, x: x#:0, y: x#:0}*/vec3 vec3_dc78826c(float x_0) {
    return vec3(x_0, x_0, x_0);
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
const colorMin#33ee82d6 = (
    one#:0: ColorDist#0ef7cb40,
    two#:1: ColorDist#0ef7cb40,
    between#:2: float#builtin,
): ColorDist#0ef7cb40 ={}> {
    if one#:0.dist#0ef7cb40#0 <#builtin 0.0 ||#builtin two#:1.dist#0ef7cb40#0 <#builtin 0.0 {
        if one#:0.dist#0ef7cb40#0 <#builtin two#:1.dist#0ef7cb40#0 {
            one#:0;
        } else {
            two#:1;
        };
    } else if one#:0.dist#0ef7cb40#0 +#builtin two#:1.dist#0ef7cb40#0 <#builtin between#:2 {
        ColorDist#0ef7cb40{
            dist#0ef7cb40#0: sminCubic#e7c85424(
                a: one#:0.dist#0ef7cb40#0,
                b: two#:1.dist#0ef7cb40#0,
                k: between#:2,
            ),
            color#0ef7cb40#1: mix#1d944e78(
                a: one#:0.color#0ef7cb40#1,
                b: two#:1.color#0ef7cb40#1,
                c: (one#:0.dist#0ef7cb40#0 +#builtin two#:1.dist#0ef7cb40#0) /#builtin between#:2,
            ),
        };
    } else if one#:0.dist#0ef7cb40#0 <#builtin two#:1.dist#0ef7cb40#0 {
        one#:0;
    } else {
        two#:1;
    };
}
```
*/
/*(
    one#:0: ColorDist#🚜🦮🙋,
    two#:1: ColorDist#🚜🦮🙋,
    between#:2: float,
): ColorDist#🚜🦮🙋 => {
    if one#:0.#ColorDist#🚜🦮🙋#0 < 0 || two#:1.#ColorDist#🚜🦮🙋#0 < 0 {
        if one#:0.#ColorDist#🚜🦮🙋#0 < two#:1.#ColorDist#🚜🦮🙋#0 {
            return one#:0;
        } else {
            return two#:1;
        };
    } else {
        if one#:0.#ColorDist#🚜🦮🙋#0 + two#:1.#ColorDist#🚜🦮🙋#0 < between#:2 {
            return ColorDist#🚜🦮🙋{TODO SPREADs}{
                h0ef7cb40_0: sminCubic#😶(
                    one#:0.#ColorDist#🚜🦮🙋#0,
                    two#:1.#ColorDist#🚜🦮🙋#0,
                    between#:2,
                ),
                h0ef7cb40_1: mix#🍑🧑‍🏭👩‍👩‍👦(
                    one#:0.#ColorDist#🚜🦮🙋#1,
                    two#:1.#ColorDist#🚜🦮🙋#1,
                    (one#:0.#ColorDist#🚜🦮🙋#0 + two#:1.#ColorDist#🚜🦮🙋#0) / (between#:2),
                ),
            };
        } else {
            if one#:0.#ColorDist#🚜🦮🙋#0 < two#:1.#ColorDist#🚜🦮🙋#0 {
                return one#:0;
            } else {
                return two#:1;
            };
        };
    };
}*/ColorDist_0ef7cb40 colorMin_33ee82d6(
    ColorDist_0ef7cb40 one_0,
    ColorDist_0ef7cb40 two_1,
    float between_2
) {
    if (((one_0.h0ef7cb40_0 < 0.0) || (two_1.h0ef7cb40_0 < 0.0))) {
        if ((one_0.h0ef7cb40_0 < two_1.h0ef7cb40_0)) {
            return one_0;
        } else {
            return two_1;
        };
    } else {
        if (((one_0.h0ef7cb40_0 + two_1.h0ef7cb40_0) < between_2)) {
            return ColorDist_0ef7cb40(
                sminCubic_e7c85424(one_0.h0ef7cb40_0, two_1.h0ef7cb40_0, between_2),
                mix_1d944e78(
                    one_0.h0ef7cb40_1,
                    two_1.h0ef7cb40_1,
                    ((one_0.h0ef7cb40_0 + two_1.h0ef7cb40_0) / between_2)
                )
            );
        } else {
            if ((one_0.h0ef7cb40_0 < two_1.h0ef7cb40_0)) {
                return one_0;
            } else {
                return two_1;
            };
        };
    };
}

/* -- generated -- */
/*(one#:2: Vec2#🐭😉😵😃, two#:3: Vec2#🐭😉😵😃): Vec2#🐭😉😵😃 => Vec2#🐭😉😵😃{TODO SPREADs}{
    x: one#:2.#Vec2#🐭😉😵😃#0 - two#:3.#Vec2#🐭😉😵😃#0,
    y: one#:2.#Vec2#🐭😉😵😃#1 - two#:3.#Vec2#🐭😉😵😃#1,
}*/vec2 V65fcaa4e_a318c258_1(vec2 one_2, vec2 two_3) {
    return vec2((one_2.x - two_3.x), (one_2.y - two_3.y));
}

/**
```
const length#c2805852 = (v#:0: Vec2#43802a16): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
        +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1,
)
```
*/
/*(
    v#:0: Vec2#🐭😉😵😃,
): float => sqrt(
    v#:0.#Vec2#🐭😉😵😃#0 * v#:0.#Vec2#🐭😉😵😃#0 + v#:0.#Vec2#🐭😉😵😃#1 * v#:0.#Vec2#🐭😉😵😃#1,
)*/float length_c2805852(vec2 v_0) {
    return sqrt(((v_0.x * v_0.x) + (v_0.y * v_0.y)));
}

/**
```
const mix#0bd4b442 = (a#:0: Vec4#3b941378, b#:1: Vec4#3b941378, c#:2: float#builtin): Vec4#3b941378 ={}> {
    Vec4#3b941378{
        z#9f1c0644#0: lerp#0c604a2c(a: a#:0.z#9f1c0644#0, b: b#:1.z#9f1c0644#0, c#:2),
        x#43802a16#0: lerp#0c604a2c(a: a#:0.x#43802a16#0, b: b#:1.x#43802a16#0, c#:2),
        y#43802a16#1: lerp#0c604a2c(a: a#:0.y#43802a16#1, b: b#:1.y#43802a16#1, c#:2),
        w#3b941378#0: lerp#0c604a2c(a: a#:0.w#3b941378#0, b: b#:1.w#3b941378#0, c#:2),
    };
}
```
*/
/*(
    a#:0: Vec4#🕒🧑‍🏫🎃,
    b#:1: Vec4#🕒🧑‍🏫🎃,
    c#:2: float,
): Vec4#🕒🧑‍🏫🎃 => Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{
    w: lerp#🐣☺️👶(a#:0.#Vec4#🕒🧑‍🏫🎃#0, b#:1.#Vec4#🕒🧑‍🏫🎃#0, c#:2),
    z: lerp#🐣☺️👶(a#:0.#Vec3#🐬#0, b#:1.#Vec3#🐬#0, c#:2),
}*/vec4 mix_0bd4b442(vec4 a_0, vec4 b_1, float c_2) {
    return vec4(
        lerp_0c604a2c(a_0.x, b_1.x, c_2),
        lerp_0c604a2c(a_0.y, b_1.y, c_2),
        lerp_0c604a2c(a_0.z, b_1.z, c_2),
        lerp_0c604a2c(a_0.w, b_1.w, c_2)
    );
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
const x#752af9ee = (env#:0: GLSLEnv#d2ea39a0<State#1e665e2c>, pos#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const user#:2 = ColorDist#0ef7cb40{
        dist#0ef7cb40#0: length#c2805852(
                v: pos#:1 -#65fcaa4e#a318c258#1 env#:0.state#d2ea39a0#0.pos#1e665e2c#0,
            ) 
            -#builtin 10.0,
        color#0ef7cb40#1: xyz#1aedf216(v: blue#2bb0f8ee),
    };
    const target#:7 = ColorDist#0ef7cb40{
        dist#0ef7cb40#0: length#c2805852(
                v: pos#:1 
                    -#65fcaa4e#a318c258#1 {
                        switch env#:0.state#d2ea39a0#0.target#1e665e2c#1 {
                            At#343b47f0{pos: pos#:3} => pos#:3,
                            MovingTo#43dedff0{current: current#:4} => current#:4,
                        };
                    },
            ) 
            -#builtin 20.0,
        color#0ef7cb40#1: xyz#1aedf216(
            v: switch env#:0.state#d2ea39a0#0.target#1e665e2c#1 {
                At#343b47f0 => green#7d3af1cc,
                MovingTo#43dedff0{current: current#:5, pos: pos#:6} => mix#0bd4b442(
                    a: green#7d3af1cc,
                    b: vec4#4d4983bb(x: 0.0, y: 0.5, z: 0.5, w: 1.0),
                    c: min#builtin(
                        1.0,
                        length#c2805852(v: current#:5 -#65fcaa4e#a318c258#1 pos#:6) /#builtin 10.0,
                    ),
                ),
            },
        ),
    };
    const res#:8 = colorMin#33ee82d6(one: user#:2, two: target#:7, between: 20.0);
    vec4#b00b79a0(
        v: if res#:8.dist#0ef7cb40#0 <#builtin 0.0 {
            res#:8.color#0ef7cb40#1;
        } else {
            vec3#dc78826c(x: 1.0);
        },
        w: 1.0,
    );
}
```
*/
/*(
    env#:0: unnamed#👇🤵‍♀️🛣️,
    pos#:1: Vec2#🐭😉😵😃,
): Vec4#🕒🧑‍🏫🎃 => {
    const result#:11: Vec4#🕒🧑‍🏫🎃;
    const continueBlock#:12: bool = true;
    if isRecord!(env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#1, At#🪀🥛🛵) {
        result#:11 = vec4#🎆🌷🧑‍🦰😃(0, 1, 0, 1);
        continueBlock#:12 = false;
    };
    if continueBlock#:12 {
        if isRecord!(env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#1, MovingTo#🪀💧🤓😃) {
            result#:11 = mix#☹️👩‍🚒🦻(
                vec4#🎆🌷🧑‍🦰😃(0, 1, 0, 1),
                vec4#🎆🌷🧑‍🦰😃(0, 0.5, 0.5, 1),
                min(
                    1,
                    length#😞(
                        generated#65fcaa4e_a318c258_1(
                            env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#1.#MovingTo#🪀💧🤓😃#1,
                            env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#1.#MovingTo#🪀💧🤓😃#0,
                        ),
                    ) / 10,
                ),
            );
            continueBlock#:12 = false;
        };
        if continueBlock#:12 {
            match_fail!();
        };
    };
    const result#:15: Vec2#🐭😉😵😃;
    const continueBlock#:16: bool = true;
    if isRecord!(env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#1, At#🪀🥛🛵) {
        result#:15 = env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#1.#At#🪀🥛🛵#0;
        continueBlock#:16 = false;
    };
    if continueBlock#:16 {
        if isRecord!(env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#1, MovingTo#🪀💧🤓😃) {
            result#:15 = env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#1.#MovingTo#🪀💧🤓😃#1;
            continueBlock#:16 = false;
        };
        if continueBlock#:16 {
            match_fail!();
        };
    };
    const res#:8: ColorDist#🚜🦮🙋 = colorMin#🍷⛅🚚(
        ColorDist#🚜🦮🙋{TODO SPREADs}{
            h0ef7cb40_0: length#😞(
                generated#65fcaa4e_a318c258_1(
                    pos#:1,
                    env#:0.#GLSLEnv#🏊‍♂️#0.#State#🐣🏌️‍♂️👩‍👧‍👦#0,
                ),
            ) - 10,
            h0ef7cb40_1: xyz#🐭🕔🤸(vec4#🎆🌷🧑‍🦰😃(0, 0, 1, 1)),
        },
        ColorDist#🚜🦮🙋{TODO SPREADs}{
            h0ef7cb40_0: length#😞(generated#65fcaa4e_a318c258_1(pos#:1, result#:15)) - 20,
            h0ef7cb40_1: xyz#🐭🕔🤸(result#:11),
        },
        20,
    );
    const result#:13: Vec3#🐬;
    if res#:8.#ColorDist#🚜🦮🙋#0 < 0 {
        result#:13 = res#:8.#ColorDist#🚜🦮🙋#1;
    } else {
        result#:13 = vec3#🍃(1);
    };
    return vec4#🏊‍♂️(result#:13, 1);
}*/vec4 x_752af9ee(T34b50ca6 env_0, vec2 pos_1) {
    vec4 result;
    bool continueBlock = true;
    if (env_0.state.h1e665e2c_1.tag == 0) {
        result = vec4_4d4983bb(0.0, 1.0, 0.0, 1.0);
        continueBlock = false;
    };
    if (continueBlock) {
        if (env_0.state.h1e665e2c_1.tag == 1) {
            result = mix_0bd4b442(
                vec4_4d4983bb(0.0, 1.0, 0.0, 1.0),
                vec4_4d4983bb(0.0, 0.50, 0.50, 1.0),
                min(
                    1.0,
                    (length_c2805852(
                        V65fcaa4e_a318c258_1(
                            env_0.state.h1e665e2c_1.h43dedff0_1,
                            env_0.state.h1e665e2c_1.h43dedff0_0
                        )
                    ) / 10.0)
                )
            );
            continueBlock = false;
        };
        if (continueBlock) {
            // match fail;
        };
    };
    vec2 result_15;
    bool continueBlock_16 = true;
    if (env_0.state.h1e665e2c_1.tag == 0) {
        result_15 = env_0.state.h1e665e2c_1.h343b47f0_0;
        continueBlock_16 = false;
    };
    if (continueBlock_16) {
        if (env_0.state.h1e665e2c_1.tag == 1) {
            result_15 = env_0.state.h1e665e2c_1.h43dedff0_1;
            continueBlock_16 = false;
        };
        if (continueBlock_16) {
            // match fail;
        };
    };
    ColorDist_0ef7cb40 res = colorMin_33ee82d6(
        ColorDist_0ef7cb40(
            (length_c2805852(V65fcaa4e_a318c258_1(pos_1, env_0.state.h1e665e2c_0)) - 10.0),
            xyz_1aedf216(vec4_4d4983bb(0.0, 0.0, 1.0, 1.0))
        ),
        ColorDist_0ef7cb40(
            (length_c2805852(V65fcaa4e_a318c258_1(pos_1, result_15)) - 20.0),
            xyz_1aedf216(result)
        ),
        20.0
    );
    vec3 result_13;
    if ((res.h0ef7cb40_0 < 0.0)) {
        result_13 = res.h0ef7cb40_1;
    } else {
        result_13 = vec3_dc78826c(1.0);
    };
    return vec4_b00b79a0(result_13, 1.0);
}

void main() {
    fragColor = x_752af9ee(
        GLSLEnv_d2ea39a0(u_state, u_time, u_resolution, u_camera, u_mouse, u_mousebutton),
        gl_FragCoord.xy
    );
}