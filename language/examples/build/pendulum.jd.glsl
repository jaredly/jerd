#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform sampler2D u_buffer0;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};

// skipping Mul_1de4e4c0, contains type variables

// skipping Div_5ac12902, contains type variables

// skipping AddSub_b99b22d8, contains type variables

/* *
```
const TWO_PI#fc1474ce: float = (PI * 2.0)
```
 */
const float TWO_PI_fc1474ce = (PI * 2.0);

/* *
```
const MaxVelocity#158e986a: float = 0.1
```
 */
const float MaxVelocity_158e986a = 0.10;

/**
```
const lerp#0c604a2c: (float, float, float) ={}> float = (a#:0: float, b#:1: float, c#:2: float) ={}> ((c#:2 * (b#:1 - a#:0)) + a#:0)
```
*/
float lerp_0c604a2c(
    float a_0,
    float b_1,
    float c_2
) {
    return ((c_2 * (b_1 - a_0)) + a_0);
}

/**
```
const fract#495c4d22: (float) ={}> float = (v#:0: float) ={}> (v#:0 - floor(v#:0))
```
*/
float fract_495c4d22(
    float v_0
) {
    return (v_0 - floor(v_0));
}

/**
```
const vec4#4d4983bb: (float, float, float, float) ={}> Vec4#3b941378 = (
    x#:0: float,
    y#:1: float,
    z#:2: float,
    w#:3: float,
) ={}> Vec4#3b941378{z#9f1c0644#0: z#:2, x#43802a16#0: x#:0, y#43802a16#1: y#:1, w#3b941378#0: w#:3}
```
*/
vec4 vec4_4d4983bb(
    float x_0,
    float y_1,
    float z_2,
    float w_3
) {
    return vec4(x_0, y_1, z_2, w_3);
}

/**
```
const normalizeTheta#c3a71e42: (float) ={}> float = (t#:0: float) ={}> if (t#:0 > PI) {
    (t#:0 - TWO_PI#fc1474ce);
} else {
    if (t#:0 < -PI) {
        (t#:0 + TWO_PI#fc1474ce);
    } else {
        t#:0;
    };
}
```
*/
float normalizeTheta_c3a71e42(
    float t_0
) {
    if ((t_0 > PI)) {
        return (t_0 - TWO_PI_fc1474ce);
    } else {
        if ((t_0 < -PI)) {
            return (t_0 + TWO_PI_fc1474ce);
        } else {
            return t_0;
        };
    };
}

/* *
```
const r2#0ce717e6: float = 100.0
```
 */
const float r2_0ce717e6 = 100.0;

/* *
```
const m2#b48c60a0: float = 20.0
```
 */
const float m2_b48c60a0 = 20.0;

/* *
```
const g#4466af4c: float = 0.15
```
 */
const float g_4466af4c = 0.150;

/* *
```
const pixScale#32bd7938: Vec4#3b941378 = Vec4#3b941378{
    z#9f1c0644#0: (MaxVelocity#158e986a * 2.0),
    x#43802a16#0: TWO_PI#fc1474ce,
    y#43802a16#1: TWO_PI#fc1474ce,
    w#3b941378#0: (MaxVelocity#158e986a * 2.0),
}
```
 */
const vec4 pixScale_32bd7938 = vec4(
    TWO_PI_fc1474ce,
    TWO_PI_fc1474ce,
    (MaxVelocity_158e986a * 2.0),
    (MaxVelocity_158e986a * 2.0)
);

/* *
```
const pixOff#44de0a86: Vec4#3b941378 = Vec4#3b941378{
    z#9f1c0644#0: MaxVelocity#158e986a,
    x#43802a16#0: PI,
    y#43802a16#1: PI,
    w#3b941378#0: MaxVelocity#158e986a,
}
```
 */
const vec4 pixOff_44de0a86 = vec4(
    PI,
    PI,
    MaxVelocity_158e986a,
    MaxVelocity_158e986a
);

/**
```
const mix#1d944e78: (Vec3#9f1c0644, Vec3#9f1c0644, float) ={}> Vec3#9f1c0644 = (
    a#:0: Vec3#9f1c0644,
    b#:1: Vec3#9f1c0644,
    c#:2: float,
) ={}> {
    Vec3#9f1c0644{
        x#43802a16#0: lerp#0c604a2c(a#:0.x#43802a16#0, b#:1.x#43802a16#0, c#:2),
        y#43802a16#1: lerp#0c604a2c(a#:0.y#43802a16#1, b#:1.y#43802a16#1, c#:2),
        z#9f1c0644#0: lerp#0c604a2c(a#:0.z#9f1c0644#0, b#:1.z#9f1c0644#0, c#:2),
    };
}
```
*/
vec3 mix_1d944e78(
    vec3 a_0,
    vec3 b_1,
    float c_2
) {
    return vec3(
        lerp_0c604a2c(a_0.x, b_1.x, c_2),
        lerp_0c604a2c(a_0.y, b_1.y, c_2),
        lerp_0c604a2c(a_0.z, b_1.z, c_2)
    );
}

/* *
```
const kxyz#1f96d598: Vec3#9f1c0644 = Vec3#9f1c0644{
    x#43802a16#0: 1.0,
    y#43802a16#1: (2.0 / 3.0),
    z#9f1c0644#0: (1.0 / 3.0),
}
```
 */
const vec3 kxyz_1f96d598 = vec3(
    1.0,
    (2.0 / 3.0),
    (1.0 / 3.0)
);

/**
```
const fract3#228606f4: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
    x#43802a16#0: fract#495c4d22(v#:0.x#43802a16#0),
    y#43802a16#1: fract#495c4d22(v#:0.y#43802a16#1),
    z#9f1c0644#0: fract#495c4d22(v#:0.z#9f1c0644#0),
}
```
*/
vec3 fract3_228606f4(
    vec3 v_0
) {
    return vec3(fract_495c4d22(v_0.x), fract_495c4d22(v_0.y), fract_495c4d22(v_0.z));
}

/**
```
const vabs#1a074578: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
    x#43802a16#0: abs(v#:0.x#43802a16#0),
    y#43802a16#1: abs(v#:0.y#43802a16#1),
    z#9f1c0644#0: abs(v#:0.z#9f1c0644#0),
}
```
*/
vec3 vabs_1a074578(
    vec3 v_0
) {
    return vec3(abs(v_0.x), abs(v_0.y), abs(v_0.z));
}

/**
```
const vabs2#394fe488: (Vec2#43802a16) ={}> Vec2#43802a16 = (v#:0: Vec2#43802a16) ={}> Vec2#43802a16{
    x#43802a16#0: abs(v#:0.x#43802a16#0),
    y#43802a16#1: abs(v#:0.y#43802a16#1),
}
```
*/
vec2 vabs2_394fe488(
    vec2 v_0
) {
    return vec2(abs(v_0.x), abs(v_0.y));
}

/**
```
const vmax2#e8162c1c: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    max(v#:0.x#43802a16#0, v#:0.y#43802a16#1);
}
```
*/
float vmax2_e8162c1c(
    vec2 v_0
) {
    return max(v_0.x, v_0.y);
}

/**
```
const length2#2e6a5f32: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    sqrt(((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)));
}
```
*/
float length2_2e6a5f32(
    vec2 v_0
) {
    return sqrt(((v_0.x * v_0.x) + (v_0.y * v_0.y)));
}

/**
```
const update#74a18562: (float, float, float, float) ={}> Vec4#3b941378 = (
    a1#:0: float,
    a2#:1: float,
    a1_v#:2: float,
    a2_v#:3: float,
) ={}> {
    const num1#:4 = ((-g#4466af4c * ((2.0 * m2#b48c60a0) + m2#b48c60a0)) * sin(a1#:0));
    const num2#:5 = ((-m2#b48c60a0 * g#4466af4c) * sin((a1#:0 - (2.0 * a2#:1))));
    const num3#:6 = ((-2.0 * sin((a1#:0 - a2#:1))) * m2#b48c60a0);
    const num4#:7 = (((a2_v#:3 * a2_v#:3) * r2#0ce717e6) + (((a1_v#:2 * a1_v#:2) * r2#0ce717e6) * cos(
        (a1#:0 - a2#:1),
    )));
    const den#:8 = (r2#0ce717e6 * (((2.0 * m2#b48c60a0) + m2#b48c60a0) - (m2#b48c60a0 * cos(
        ((2.0 * a1#:0) - (2.0 * a2#:1)),
    ))));
    const a1_a#:9 = (((num1#:4 + num2#:5) + (num3#:6 * num4#:7)) / den#:8);
    const num1#:10 = (2.0 * sin((a1#:0 - a2#:1)));
    const num2#:11 = (((a1_v#:2 * a1_v#:2) * r2#0ce717e6) * (m2#b48c60a0 + m2#b48c60a0));
    const num3#:12 = ((g#4466af4c * (m2#b48c60a0 + m2#b48c60a0)) * cos(a1#:0));
    const num4#:13 = ((((a2_v#:3 * a2_v#:3) * r2#0ce717e6) * m2#b48c60a0) * cos((a1#:0 - a2#:1)));
    const den#:14 = (r2#0ce717e6 * (((2.0 * m2#b48c60a0) + m2#b48c60a0) - (m2#b48c60a0 * cos(
        ((2.0 * a1#:0) - (2.0 * a2#:1)),
    ))));
    const a2_a#:15 = ((num1#:10 * ((num2#:11 + num3#:12) + num4#:13)) / den#:14);
    const a1_v#:16 = (a1_v#:2 + a1_a#:9);
    const a2_v#:17 = (a2_v#:3 + a2_a#:15);
    const a1#:18 = (a1#:0 + a1_v#:16);
    const a2#:19 = (a2#:1 + a2_v#:17);
    const a1#:20 = normalizeTheta#c3a71e42(a1#:18);
    const a2#:21 = normalizeTheta#c3a71e42(a2#:19);
    vec4#4d4983bb(a1#:20, a2#:21, a1_v#:16, a2_v#:17);
}
```
*/
vec4 update_74a18562(
    float a1_0,
    float a2_1,
    float a1_v_2,
    float a2_v_3
) {
    float a1_v_16 = (a1_v_2 + (((((-g_4466af4c * ((2.0 * m2_b48c60a0) + m2_b48c60a0)) * sin(a1_0)) + ((-m2_b48c60a0 * g_4466af4c) * sin(
        (a1_0 - (2.0 * a2_1))
    ))) + (((-2.0 * sin((a1_0 - a2_1))) * m2_b48c60a0) * (((a2_v_3 * a2_v_3) * r2_0ce717e6) + (((a1_v_2 * a1_v_2) * r2_0ce717e6) * cos(
        (a1_0 - a2_1)
    ))))) / (r2_0ce717e6 * (((2.0 * m2_b48c60a0) + m2_b48c60a0) - (m2_b48c60a0 * cos(
        ((2.0 * a1_0) - (2.0 * a2_1))
    ))))));
    float a2_v_17 = (a2_v_3 + (((2.0 * sin((a1_0 - a2_1))) * (((((a1_v_2 * a1_v_2) * r2_0ce717e6) * (m2_b48c60a0 + m2_b48c60a0)) + ((g_4466af4c * (m2_b48c60a0 + m2_b48c60a0)) * cos(
        a1_0
    ))) + ((((a2_v_3 * a2_v_3) * r2_0ce717e6) * m2_b48c60a0) * cos((a1_0 - a2_1))))) / (r2_0ce717e6 * (((2.0 * m2_b48c60a0) + m2_b48c60a0) - (m2_b48c60a0 * cos(
        ((2.0 * a1_0) - (2.0 * a2_1))
    ))))));
    return vec4_4d4983bb(
        normalizeTheta_c3a71e42((a1_0 + a1_v_16)),
        normalizeTheta_c3a71e42((a2_1 + a2_v_17)),
        a1_v_16,
        a2_v_17
    );
}

/**
```
const dataToPixel#6ca470d0: (Vec4#3b941378) ={}> Vec4#3b941378 = (v#:0: Vec4#3b941378) ={}> {
    const res#:1 = Scale42#5776a60e."/"#5ac12902#0(
        AddSubVec4#0555d260."+"#b99b22d8#0(v#:0, pixOff#44de0a86),
        pixScale#32bd7938,
    );
    res#:1;
}
```
*/
vec4 dataToPixel_6ca470d0(
    vec4 v_0
) {
    return ((v_0 + pixOff_44de0a86) / pixScale_32bd7938);
}

/**
```
const pixelToData#446114f2: (Vec4#3b941378) ={}> Vec4#3b941378 = (v#:0: Vec4#3b941378) ={}> AddSubVec4#0555d260."-"#b99b22d8#1(
    Mul42#1b694fee."*"#1de4e4c0#0(v#:0, pixScale#32bd7938),
    pixOff#44de0a86,
)
```
*/
vec4 pixelToData_446114f2(
    vec4 v_0
) {
    return ((v_0 * pixScale_32bd7938) - pixOff_44de0a86);
}

/**
```
const hsv2rgb#5c8b4a90: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (c#:0: Vec3#9f1c0644) ={}> {
    const K#:1 = vec4#4d4983bb(1.0, (2.0 / 3.0), (1.0 / 3.0), 3.0);
    const xxx#:2 = Vec3#9f1c0644{
        x#43802a16#0: c#:0.x#43802a16#0,
        y#43802a16#1: c#:0.x#43802a16#0,
        z#9f1c0644#0: c#:0.x#43802a16#0,
    };
    const p#:3 = vabs#1a074578(
        AddSubVec3_#3b80b971."-"#b99b22d8#1(
            ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(
                fract3#228606f4(AddSubVec3#1c6fdd91."+"#b99b22d8#0(xxx#:2, kxyz#1f96d598)),
                6.0,
            ),
            3.0,
        ),
    );
    const kxxx#:4 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
    ScaleVec3#c4a91006."*"#1de4e4c0#0(
        c#:0.z#9f1c0644#0,
        mix#1d944e78(
            kxxx#:4,
            clamp#5483fdc2(
                AddSubVec3#1c6fdd91."-"#b99b22d8#1(p#:3, kxxx#:4),
                Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
                Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
            ),
            c#:0.y#43802a16#1,
        ),
    );
}
```
*/
vec3 hsv2rgb_5c8b4a90(
    vec3 c_0
) {
    vec3 kxxx_4 = vec3(1.0, 1.0, 1.0);
    return (c_0.z * mix_1d944e78(
        kxxx_4,
        clamp(
            (vabs_1a074578(
                ((fract3_228606f4((vec3(c_0.x, c_0.x, c_0.x) + kxyz_1f96d598)) * 6.0) - 3.0)
            ) - kxxx_4),
            vec3(0.0, 0.0, 0.0),
            vec3(1.0, 1.0, 1.0)
        ),
        c_0.y
    ));
}

/**
```
const rect#0fa3bd82: (Vec2#43802a16, Vec2#43802a16, float, float) ={}> float = (
    samplePos#:0: Vec2#43802a16,
    center#:1: Vec2#43802a16,
    w#:2: float,
    h#:3: float,
) ={}> {
    vmax2#e8162c1c(
        AddSubVec2#70bb2056."-"#b99b22d8#1(
            vabs2#394fe488(AddSubVec2#70bb2056."-"#b99b22d8#1(samplePos#:0, center#:1)),
            Vec2#43802a16{x#43802a16#0: w#:2, y#43802a16#1: h#:3},
        ),
    );
}
```
*/
float rect_0fa3bd82(
    vec2 samplePos_0,
    vec2 center_1,
    float w_2,
    float h_3
) {
    return vmax2_e8162c1c((vabs2_394fe488((samplePos_0 - center_1)) - vec2(w_2, h_3)));
}

/**
```
const circle#7103c1d2: (Vec2#43802a16, Vec2#43802a16, float) ={}> float = (
    samplePos#:0: Vec2#43802a16,
    center#:1: Vec2#43802a16,
    r#:2: float,
) ={}> {
    (length2#2e6a5f32(AddSubVec2#70bb2056."-"#b99b22d8#1(samplePos#:0, center#:1)) - r#:2);
}
```
*/
float circle_7103c1d2(
    vec2 samplePos_0,
    vec2 center_1,
    float r_2
) {
    return (length2_2e6a5f32((samplePos_0 - center_1)) - r_2);
}

/**
```
const pendulum#bf7a10e0: (GLSLEnv#451d5252, Vec2#43802a16, sampler2D) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D,
) ={}> {
    if (env#:0.time#451d5252#0 <= 0.01) {
        const t#:3 = MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1);
        vec4#4d4983bb(0.0, 0.0, t#:3.x#43802a16#0, t#:3.y#43802a16#1);
    } else {
        const current#:4 = texture(
            buffer#:2,
            MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
        );
        const current#:5 = pixelToData#446114f2(current#:4);
        dataToPixel#6ca470d0(
            update#74a18562(
                current#:5.x#43802a16#0,
                current#:5.y#43802a16#1,
                current#:5.z#9f1c0644#0,
                current#:5.w#3b941378#0,
            ),
        );
    };
}
```
*/
vec4 pendulum_bf7a10e0(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1,
    sampler2D buffer_2
) {
    if ((env_0.time <= 0.010)) {
        vec2 t_3 = (fragCoord_1 / env_0.resolution);
        return vec4_4d4983bb(0.0, 0.0, t_3.x, t_3.y);
    } else {
        vec4 current_5 = pixelToData_446114f2(texture(buffer_2, (fragCoord_1 / env_0.resolution)));
        return dataToPixel_6ca470d0(
            update_74a18562(current_5.x, current_5.y, current_5.z, current_5.w)
        );
    };
}

/**
```
const main#6b937d8a: (GLSLEnv#451d5252, Vec2#43802a16, sampler2D) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D,
) ={}> {
    const currentPos#:3 = MulVec2#090f77e7."/"#5ac12902#0(
        env#:0.mouse#451d5252#3,
        env#:0.resolution#451d5252#1,
    );
    const currentp#:4 = texture(buffer#:2, currentPos#:3);
    const current#:5 = pixelToData#446114f2(currentp#:4);
    const p1#:6 = AddSubVec2#70bb2056."-"#b99b22d8#1(
        fragCoord#:1,
        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(env#:0.resolution#451d5252#1, 2.0),
    );
    const c1#:7 = Vec2#43802a16{
        x#43802a16#0: (sin(current#:5.x#43802a16#0) * r2#0ce717e6),
        y#43802a16#1: (-cos(current#:5.x#43802a16#0) * r2#0ce717e6),
    };
    const c2#:8 = Vec2#43802a16{
        x#43802a16#0: (c1#:7.x#43802a16#0 + (sin(current#:5.y#43802a16#1) * r2#0ce717e6)),
        y#43802a16#1: (c1#:7.y#43802a16#1 - (cos(current#:5.y#43802a16#1) * r2#0ce717e6)),
    };
    if (circle#7103c1d2(p1#:6, c1#:7, 10.0) < 0.0) {
        vec4#4d4983bb(1.0, 0.0, 0.0, 1.0);
    } else {
        if (circle#7103c1d2(p1#:6, c2#:8, 10.0) < 0.0) {
            vec4#4d4983bb(1.0, 1.0, 0.0, 1.0);
        } else {
            if (max(
                rect#0fa3bd82(
                    p1#:6,
                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                        env#:0.mouse#451d5252#3,
                        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(env#:0.resolution#451d5252#1, 2.0),
                    ),
                    10.0,
                    10.0,
                ),
                -rect#0fa3bd82(
                    p1#:6,
                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                        env#:0.mouse#451d5252#3,
                        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(env#:0.resolution#451d5252#1, 2.0),
                    ),
                    9.0,
                    9.0,
                ),
            ) < 0.0) {
                vec4#4d4983bb(0.0, 0.0, 0.0, 1.0);
            } else {
                if (length2#2e6a5f32(
                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                        p1#:6,
                        AddSubVec2#70bb2056."-"#b99b22d8#1(
                            env#:0.mouse#451d5252#3,
                            ScaleVec2Rev#afc24bbe."/"#5ac12902#0(env#:0.resolution#451d5252#1, 2.0),
                        ),
                    ),
                ) < 100.0) {
                    const t#:9 = texture(
                        buffer#:2,
                        MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
                    );
                    const rgb#:10 = hsv2rgb#5c8b4a90(
                        Vec3#9f1c0644{
                            x#43802a16#0: t#:9.z#9f1c0644#0,
                            y#43802a16#1: t#:9.w#3b941378#0,
                            z#9f1c0644#0: 1.0,
                        },
                    );
                    Vec4#3b941378{...rgb#:10, w#3b941378#0: 1.0};
                } else {
                    if (length2#2e6a5f32(
                        AddSubVec2#70bb2056."-"#b99b22d8#1(
                            p1#:6,
                            AddSubVec2#70bb2056."-"#b99b22d8#1(
                                env#:0.mouse#451d5252#3,
                                ScaleVec2Rev#afc24bbe."/"#5ac12902#0(
                                    env#:0.resolution#451d5252#1,
                                    2.0,
                                ),
                            ),
                        ),
                    ) < 101.0) {
                        vec4#4d4983bb(0.0, 0.0, 0.0, 1.0);
                    } else {
                        const t#:11 = texture(
                            buffer#:2,
                            MulVec2#090f77e7."/"#5ac12902#0(
                                fragCoord#:1,
                                env#:0.resolution#451d5252#1,
                            ),
                        );
                        const rgb#:12 = hsv2rgb#5c8b4a90(
                            Vec3#9f1c0644{
                                x#43802a16#0: t#:11.y#43802a16#1,
                                y#43802a16#1: t#:11.x#43802a16#0,
                                z#9f1c0644#0: 1.0,
                            },
                        );
                        Vec4#3b941378{...rgb#:12, w#3b941378#0: 1.0};
                    };
                };
            };
        };
    };
}
```
*/
vec4 main_6b937d8a(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1,
    sampler2D buffer_2
) {
    vec4 current_5 = pixelToData_446114f2(texture(buffer_2, (env_0.mouse / env_0.resolution)));
    vec2 p1_6 = (fragCoord_1 - (env_0.resolution / 2.0));
    vec2 c1_7 = vec2((sin(current_5.x) * r2_0ce717e6), (-cos(current_5.x) * r2_0ce717e6));
    if ((circle_7103c1d2(p1_6, c1_7, 10.0) < 0.0)) {
        return vec4_4d4983bb(1.0, 0.0, 0.0, 1.0);
    } else {
        if ((circle_7103c1d2(
            p1_6,
            vec2(
                (c1_7.x + (sin(current_5.y) * r2_0ce717e6)),
                (c1_7.y - (cos(current_5.y) * r2_0ce717e6))
            ),
            10.0
        ) < 0.0)) {
            return vec4_4d4983bb(1.0, 1.0, 0.0, 1.0);
        } else {
            if ((max(
                rect_0fa3bd82(p1_6, (env_0.mouse - (env_0.resolution / 2.0)), 10.0, 10.0),
                -rect_0fa3bd82(p1_6, (env_0.mouse - (env_0.resolution / 2.0)), 9.0, 9.0)
            ) < 0.0)) {
                return vec4_4d4983bb(0.0, 0.0, 0.0, 1.0);
            } else {
                if ((length2_2e6a5f32((p1_6 - (env_0.mouse - (env_0.resolution / 2.0)))) < 100.0)) {
                    vec4 t_9 = texture(buffer_2, (fragCoord_1 / env_0.resolution));
                    vec3 rgb_10 = hsv2rgb_5c8b4a90(vec3(t_9.z, t_9.w, 1.0));
                    return vec4(rgb_10.x, rgb_10.y, rgb_10.z, 1.0);
                } else {
                    if ((length2_2e6a5f32((p1_6 - (env_0.mouse - (env_0.resolution / 2.0)))) < 101.0)) {
                        return vec4_4d4983bb(0.0, 0.0, 0.0, 1.0);
                    } else {
                        vec4 t_11 = texture(buffer_2, (fragCoord_1 / env_0.resolution));
                        vec3 rgb_12 = hsv2rgb_5c8b4a90(vec3(t_11.y, t_11.x, 1.0));
                        return vec4(rgb_12.x, rgb_12.y, rgb_12.z, 1.0);
                    };
                };
            };
        };
    };
}

#if defined(BUFFER_0)

void main() {
    fragColor = pendulum_bf7a10e0(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy,
        u_buffer0
    );
}

#else

void main() {
    fragColor = main_6b937d8a(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy,
        u_buffer0
    );
}

#endif
