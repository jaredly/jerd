#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

// skipping CutOut_af969fe0, contains type variables

// skipping As_As, contains type variables

// skipping Neg_3c2a4898, contains type variables

// skipping Mul_1de4e4c0, contains type variables

// skipping AddSub_b99b22d8, contains type variables

struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};

// skipping Div_5ac12902, contains type variables

/* *
```
const EPSILON#17261aaa = 0.0001
```
 */
const float EPSILON_17261aaa = 0.00010;

/**
```
const max#4ad0798a = (v#:0: Vec2#43802a16, n#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
    x#43802a16#0: max#builtin(v#:0.x#43802a16#0, n#:1),
    y#43802a16#1: max#builtin(v#:0.y#43802a16#1, n#:1),
}
```
*/
vec2 max_4ad0798a(
    vec2 v_0,
    float n_1
) {
    return vec2(max(v_0.x, n_1), max(v_0.y, n_1));
}

/**
```
const xz#76ad3e42 = (v#:0: Vec3#9f1c0644): Vec2#43802a16 ={}> vec2#54a9f2ef(
    x: v#:0.x#43802a16#0,
    y: v#:0.z#9f1c0644#0,
)
```
*/
vec2 xz_76ad3e42(
    vec3 v_0
) {
    return vec2(v_0.x, v_0.z);
}

/**
```
const length#c2805852 = (v#:0: Vec2#43802a16): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
        +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1,
)
```
*/
float length_c2805852(
    vec2 v_0
) {
    return sqrt(((v_0.x * v_0.x) + (v_0.y * v_0.y)));
}

/**
```
const abs#394fe488 = (v#:0: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
    x#43802a16#0: abs#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: abs#builtin(v#:0.y#43802a16#1),
}
```
*/
vec2 abs_394fe488(
    vec2 v_0
) {
    return vec2(abs(v_0.x), abs(v_0.y));
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
mat4 rotate_d804569c(
    float tx_0,
    float ty_1,
    float tz_2
) {
    float cg = cos(tx_0);
    float sg = sin(tx_0);
    float cb = cos(ty_1);
    float sb = sin(ty_1);
    float ca = cos(tz_2);
    float sa = sin(tz_2);
    return mat4(
        vec4((ca * cb), (((ca * sb) * sg) - (sa * cg)), (((ca * sb) * cg) + (sa * sg)), 0.0),
        vec4((sa * cb), (((sa * sb) * sg) + (ca * cg)), (((sa * sb) * cg) - (ca * sg)), 0.0),
        vec4(-sb, (cb * sg), (cb * cg), 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
}

/* -- generated -- */
vec4 V16557d10_1de4e4c0_0(mat4 mat_0, vec4 vec_1) {
    return vec4(
        dot(mat_0[0], vec_1),
        dot(mat_0[1], vec_1),
        dot(mat_0[2], vec_1),
        dot(mat_0[3], vec_1)
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
vec3 xyz_1aedf216(
    vec4 v_0
) {
    return vec3(v_0.x, v_0.y, v_0.z);
}

/**
```
const normalize#48e6ea27 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> v#:0 
    /#68f73ad4#5ac12902#0 length#63e16b7a(v#:0)
```
*/
vec3 normalize_48e6ea27(
    vec3 v_0
) {
    return (v_0 / length(v_0));
}

/**
```
const rec shortestDistanceToSurface#52c7ebac = (
    sceneSDF#:0: (GLSLEnv#451d5252, Vec3#9f1c0644) ={}> float#builtin,
    env#:1: GLSLEnv#451d5252,
    eye#:2: Vec3#9f1c0644,
    marchingDirection#:3: Vec3#9f1c0644,
    start#:4: float#builtin,
    end#:5: float#builtin,
    stepsLeft#:6: int#builtin,
): float#builtin ={}> {
    const dist#:7 = sceneSDF#:0(
        env#:1,
        eye#:2 +#1c6fdd91#b99b22d8#0 start#:4 *#c4a91006#1de4e4c0#0 marchingDirection#:3,
    );
    if dist#:7 <#builtin EPSILON#17261aaa {
        start#:4;
    } else {
        const depth#:8 = start#:4 +#builtin dist#:7;
        if depth#:8 >=#builtin end#:5 ||#builtin stepsLeft#:6 <=#builtin 0 {
            end#:5;
        } else {
            52c7ebac#self(
                sceneSDF#:0,
                env#:1,
                eye#:2,
                marchingDirection#:3,
                depth#:8,
                end#:5,
                stepsLeft#:6 -#builtin 1,
            );
        };
    };
}
```
*/
float shortestDistanceToSurface_52c7ebac(
    invalid_lambda sceneSDF_0,
    GLSLEnv_451d5252 env_1,
    vec3 eye_2,
    vec3 marchingDirection_3,
    float start_4,
    float end_5,
    int stepsLeft_6
) {
    for (int i=0; i<10000; i++) {
        float dist = sceneSDF_0(env_1, (eye_2 + (start_4 * marchingDirection_3)));
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
const xy#4e146cdf = (v#:0: Vec3#9f1c0644): Vec2#43802a16 ={}> vec2#54a9f2ef(
    x: v#:0.x#43802a16#0,
    y: v#:0.y#43802a16#1,
)
```
*/
vec2 xy_4e146cdf(
    vec3 v_0
) {
    return vec2(v_0.x, v_0.y);
}

/**
```
const cappedCylinder#0ba54544 = (p#:0: Vec3#9f1c0644, r#:1: float#builtin, h#:2: float#builtin): float#builtin ={}> {
    const d#:3 = abs#394fe488(
            v: vec2#54a9f2ef(x: length#c2805852(v: xz#76ad3e42(v: p#:0)), y: p#:0.y#43802a16#1),
        ) 
        -#70bb2056#b99b22d8#1 vec2#54a9f2ef(x: r#:1, y: h#:2);
    min#builtin(max#builtin(d#:3.x#43802a16#0, d#:3.y#43802a16#1), 0.0) 
        +#builtin length#c2805852(v: max#4ad0798a(v: d#:3, n: 0.0));
}
```
*/
float cappedCylinder_0ba54544(
    vec3 p_0,
    float r_1,
    float h_2
) {
    vec2 d = (abs_394fe488(vec2(length_c2805852(xz_76ad3e42(p_0)), p_0.y)) - vec2(r_1, h_2));
    return (min(max(d.x, d.y), 0.0) + length_c2805852(max_4ad0798a(d, 0.0)));
}

/**
```
const rotate#6734d670 = (
    pos#:0: Vec3#9f1c0644,
    x#:1: float#builtin,
    y#:2: float#builtin,
    z#:3: float#builtin,
): Vec3#9f1c0644 ={}> {
    xyz#1aedf216(
        v: rotate#d804569c(tx: x#:1, ty: y#:2, tz: z#:3) 
            *#16557d10#1de4e4c0#0 vec4#b00b79a0(v: pos#:0, w: 1.0),
    );
}
```
*/
vec3 rotate_6734d670(
    vec3 pos_0,
    float x_1,
    float y_2,
    float z_3
) {
    return xyz_1aedf216(V16557d10_1de4e4c0_0(rotate_d804569c(x_1, y_2, z_3), vec4(pos_0, 1.0)));
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
vec3 cross_54f2119c(
    vec3 one_0,
    vec3 two_1
) {
    return vec3(
        ((one_0.y * two_1.z) - (two_1.y * one_0.z)),
        ((one_0.z * two_1.x) - (two_1.z * one_0.x)),
        ((one_0.x * two_1.y) - (two_1.x * one_0.y))
    );
}

/**
```
const radians#dabe7f9c = (degrees#:0: float#builtin): float#builtin ={}> degrees#:0 /#builtin 180.0 
    *#builtin PI#builtin
```
*/
float radians_dabe7f9c(
    float degrees_0
) {
    return ((degrees_0 / 180.0) * PI);
}

/**
```
const vec3#5808ec54 = (v#:0: Vec2#43802a16, z#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    ...v#:0,
    z#9f1c0644#0: z#:1,
}
```
*/
vec3 vec3_5808ec54(
    vec2 v_0,
    float z_1
) {
    return vec3(v_0.x, v_0.y, z_1);
}

/**
```
const random#347089ef = (st#:0: Vec2#43802a16): float#builtin ={}> {
    fract#495c4d22(
        v: sin#builtin(
                dot#369652bb(
                    a: st#:0,
                    b: Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
```
*/
float random_347089ef(
    vec2 st_0
) {
    return fract((sin(dot(st_0, vec2(12.98980, 78.2330))) * 43758.54531));
}

/**
```
const volumetricSample#20dcd432 = (
    sceneSDF#:0: (GLSLEnv#451d5252, Vec3#9f1c0644) ={}> float#builtin,
    env#:1: GLSLEnv#451d5252,
    light#:2: Vec3#9f1c0644,
    eye#:3: Vec3#9f1c0644,
    dist#:4: float#builtin,
    percent#:5: float#builtin,
    dir#:6: Vec3#9f1c0644,
    left#:7: int#builtin,
): float#builtin ={}> {
    const rdist#:8 = percent#:5 *#builtin dist#:4;
    const sample#:9 = eye#:3 +#1c6fdd91#b99b22d8#0 rdist#:8 *#c4a91006#1de4e4c0#0 dir#:6;
    const lightDist#:10 = distance#29bb6cab(one: sample#:9, two: light#:2);
    const toLight#:11 = sample#:9 -#1c6fdd91#b99b22d8#1 light#:2;
    const marchToLight#:12 = shortestDistanceToSurface#52c7ebac(
        sceneSDF#:0,
        env#:1,
        eye: sample#:9,
        marchingDirection: -1.0 *#c4a91006#1de4e4c0#0 normalize#48e6ea27(v: toLight#:11),
        start: 0.0,
        end: lightDist#:10,
        stepsLeft: 255,
    );
    if marchToLight#:12 >=#builtin lightDist#:10 -#builtin 0.1 {
        dist#:4 /#builtin pow#builtin(1.0 +#builtin lightDist#:10, 2.0);
    } else {
        0.0;
    };
}
```
*/
float volumetricSample_20dcd432(
    invalid_lambda sceneSDF_0,
    GLSLEnv_451d5252 env_1,
    vec3 light_2,
    vec3 eye_3,
    float dist_4,
    float percent_5,
    vec3 dir_6,
    int left_7
) {
    vec3 sample_9 = (eye_3 + ((percent_5 * dist_4) * dir_6));
    float lightDist = distance(sample_9, light_2);
    if ((shortestDistanceToSurface_52c7ebac(
        sceneSDF_0,
        env_1,
        sample_9,
        (-1.0 * normalize_48e6ea27((sample_9 - light_2))),
        0.0,
        lightDist,
        255
    ) >= (lightDist - 0.10))) {
        return (dist_4 / pow((1.0 + lightDist), 2.0));
    } else {
        return 0.0;
    };
}

/* -- generated -- */
float unnamed_lambda_c7a42ad4(GLSLEnv_451d5252 env_0, vec3 pos_1) {
    vec3 cpos = rotate_6734d670(pos_1, 0.0, 0.0, (PI / 2.0));
    float lambdaBlockResult;
    int start = 0;
    float initial = abs(cappedCylinder_0ba54544(cpos, 0.40, 1.0));
    for (int i=0; i<10000; i++) {
        if ((start >= 7)) {
            lambdaBlockResult = initial;
        } else {
            float n = float(start);
            start = (start + 1);
            initial = min(
                initial,
                (length_c2805852(
                    (xy_4e146cdf(
                        rotate_6734d670(
                            cpos,
                            0.0,
                            ((((env_0.time * n) / 2.0) + (n * (PI / 10.0))) + 0.50),
                            0.0
                        )
                    ) - vec2(0.0, (n / 10.0)))
                ) - 0.020)
            );
            continue;
        };
    };
    return min((pos_1.z + 2.0), lambdaBlockResult);
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
mat4 viewMatrix_c336d78c(
    vec3 eye_0,
    vec3 center_1,
    vec3 up_2
) {
    vec3 f = normalize_48e6ea27((center_1 - eye_0));
    vec3 s = normalize_48e6ea27(cross_54f2119c(f, up_2));
    vec3 spread = -f;
    vec3 spread_10 = cross_54f2119c(s, f);
    return mat4(
        vec4(s.x, s.y, s.z, 0.0),
        vec4(spread_10.x, spread_10.y, spread_10.z, 0.0),
        vec4(spread.x, spread.y, spread.z, 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
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
vec3 rayDirection_6258178a(
    float fieldOfView_0,
    vec2 size_1,
    vec2 fragCoord_2
) {
    return normalize_48e6ea27(
        vec3_5808ec54(
            (fragCoord_2 - (size_1 / 2.0)),
            -(size_1.y / tan((radians_dabe7f9c(fieldOfView_0) / 2.0)))
        )
    );
}

/* -- generated -- */
vec2 V090f77e7_5ac12902_0(vec2 v_0, vec2 scale_1) {
    return vec2((v_0.x / scale_1.x), (v_0.y / scale_1.y));
}

/* -- generated -- */
vec2 V9e207bb6_d8a54ca8_0(vec2 one_0, float two_1) {
    return vec2((one_0.x + two_1), (one_0.y + two_1));
}

/**
```
const rec volumetric#0ecc095f = (
    sceneSDF#:0: (GLSLEnv#451d5252, Vec3#9f1c0644) ={}> float#builtin,
    env#:1: GLSLEnv#451d5252,
    seed#:2: Vec2#43802a16,
    light#:3: Vec3#9f1c0644,
    eye#:4: Vec3#9f1c0644,
    dist#:5: float#builtin,
    dir#:6: Vec3#9f1c0644,
    current#:7: float#builtin,
    left#:8: int#builtin,
    total#:9: float#builtin,
): float#builtin ={}> {
    if left#:8 <=#builtin 0 {
        current#:7;
    } else {
        const percent#:10 = random#347089ef(
            st: Vec2#43802a16{
                x#43802a16#0: seed#:2.x#43802a16#0,
                y#43802a16#1: seed#:2.y#43802a16#1 +#builtin left#:8 as#6f186ad1 float#builtin,
            },
        );
        const sample#:11 = volumetricSample#20dcd432(
            sceneSDF#:0,
            env#:1,
            light#:3,
            eye#:4,
            dist#:5,
            percent#:10,
            dir#:6,
            left#:8,
        );
        0ecc095f#self(
            sceneSDF#:0,
            env#:1,
            seed#:2,
            light#:3,
            eye#:4,
            dist#:5,
            dir#:6,
            current#:7 +#builtin sample#:11,
            left#:8 -#builtin 1,
            total#:9,
        );
    };
}
```
*/
float volumetric_0ecc095f(
    invalid_lambda sceneSDF_0,
    GLSLEnv_451d5252 env_1,
    vec2 seed_2,
    vec3 light_3,
    vec3 eye_4,
    float dist_5,
    vec3 dir_6,
    float current_7,
    int left_8,
    float total_9
) {
    for (int i=0; i<10000; i++) {
        if ((left_8 <= 0)) {
            return current_7;
        } else {
            current_7 = (current_7 + volumetricSample_20dcd432(
                sceneSDF_0,
                env_1,
                light_3,
                eye_4,
                dist_5,
                random_347089ef(vec2(seed_2.x, (seed_2.y + float(left_8)))),
                dir_6,
                left_8
            ));
            left_8 = (left_8 - 1);
            continue;
        };
    };
}

/* -- generated -- */
float shortestDistanceToSurface_specialization_a5d844f0(
    GLSLEnv_451d5252 env_1,
    vec3 eye_2,
    vec3 marchingDirection_3,
    float start_4,
    float end_5,
    int stepsLeft_6
) {
    for (int i=0; i<10000; i++) {
        float dist = unnamed_lambda_c7a42ad4(env_1, (eye_2 + (start_4 * marchingDirection_3)));
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
vec3 getWorldDir_92052fca(
    vec2 resolution_0,
    vec2 coord_1,
    vec3 eye_2,
    float fieldOfView_3
) {
    vec3 spread_9 = rayDirection_6258178a(fieldOfView_3, resolution_0, coord_1);
    return xyz_1aedf216(
        V16557d10_1de4e4c0_0(
            viewMatrix_c336d78c(vec3(0.0, 0.0, 5.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0)),
            vec4(spread_9.x, spread_9.y, spread_9.z, 0.0)
        )
    );
}

/**
```
const unnamed#1dd6d66c = {
    const sdf#:11 = (env#:0: GLSLEnv#451d5252, pos#:1: Vec3#9f1c0644): float#builtin ={}> {
        const cpos#:2 = rotate#6734d670(pos#:1, x: 0.0, y: 0.0, z: PI#builtin /#builtin 2.0);
        const cylindar#:3 = cappedCylinder#0ba54544(p: cpos#:2, r: 0.4, h: 1.0);
        const slice#:4 = PI#builtin /#builtin 10.0;
        const cross#:7 = (n#:5: float#builtin): float#builtin ={}> {
            const pos#:6 = rotate#6734d670(
                pos: cpos#:2,
                x: 0.0,
                y: env#:0.time#451d5252#0 *#builtin n#:5 /#builtin 2.0 
                        +#builtin n#:5 *#builtin slice#:4 
                    +#builtin 0.5,
                z: 0.0,
            );
            length#c2805852(
                    v: xy#4e146cdf(v: pos#:6) 
                        -#70bb2056#b99b22d8#1 vec2#54a9f2ef(x: 0.0, y: n#:5 /#builtin 10.0),
                ) 
                -#builtin 0.02;
        };
        const cylindar#:10 = reduceRangeFloat#6bca28a2(
            start: 0,
            end: 7,
            initial: abs#builtin(cylindar#:3),
            fn: (current#:8: float#builtin, i#:9: int#builtin): float#builtin ={}> current#:8 
                <<<#0fb28206#af969fe0#0 cross#:7(i#:9 as#6f186ad1 float#builtin),
        );
        pos#:1.z#9f1c0644#0 +#builtin 2.0 <<<#0fb28206#af969fe0#0 cylindar#:10;
    };
    const m#:13 = marchVolume#4c9fa02c(
        sceneSDF: sdf#:11,
        lightPos: (env#:12: GLSLEnv#451d5252): Vec3#9f1c0644 ={}> vec3#18cdf03e(
            x: sin#builtin(env#:12.time#451d5252#0) /#builtin 3.0,
            y: 0.0,
            z: 0.0,
        ),
        exposure: 3.0,
        samples: 10.0,
    );
    const n#:14 = marchNormals#132bd797(sceneSDF: sdf#:11);
    m#:13;
}
```
*/
vec4 unnamed_1dd6d66c(
    GLSLEnv_451d5252 arg0_105,
    vec2 arg1_106
) {
    invalid_lambda sceneSDF = lambda-woops(env, pos){
        vec3 cpos_111 = rotate_6734d670(pos, 0.0, 0.0, (PI / 2.0));
        float lambdaBlockResult_139;
        int start_140 = 0;
        float initial_142 = abs(cappedCylinder_0ba54544(cpos_111, 0.40, 1.0));
        int start_140 = 0;
        float initial_142 = abs(cappedCylinder_0ba54544(cpos_111, 0.40, 1.0));
        for (int i=0; i<10000; i++) {
            if ((start_140 >= 7)) {
                lambdaBlockResult_139 = initial_142;
            } else {
                float n_176 = float(start_140);
                start_140 = (start_140 + 1);
                initial_142 = min(
                    initial_142,
                    (length_c2805852(
                        (xy_4e146cdf(
                            rotate_6734d670(
                                cpos_111,
                                0.0,
                                ((((env.time * n_176) / 2.0) + (n_176 * (PI / 10.0))) + 0.50),
                                0.0
                            )
                        ) - vec2(0.0, (n_176 / 10.0)))
                    ) - 0.020)
                );
                continue;
            };
        };
        return min((pos.z + 2.0), lambdaBlockResult_139);
    };
    GLSLEnv_451d5252 env_167 = arg0_105;
    vec3 eye = vec3(0.0, 0.0, 5.0);
    vec3 worldDir = getWorldDir_92052fca(arg0_105.resolution, arg1_106, eye, 45.0);
    float dist_171 = shortestDistanceToSurface_specialization_a5d844f0(
        arg0_105,
        eye,
        worldDir,
        0.0,
        100.0,
        255
    );
    if ((dist_171 > (100.0 - EPSILON_17261aaa))) {
        return vec4(0.0);
    } else {
        float brightness = ((volumetric_0ecc095f(
            sceneSDF,
            env_167,
            V9e207bb6_d8a54ca8_0(
                V090f77e7_5ac12902_0(arg1_106, env_167.resolution),
                (env_167.time / 1000.0)
            ),
            vec3((sin(env_167.time) / 3.0), 0.0, 0.0),
            eye,
            dist_171,
            worldDir,
            0.0,
            int(10.0),
            10.0
        ) * 3.0) / 10.0);
        return vec4((((vec3(1.0) * brightness) * brightness) * brightness), 1.0);
    };
}

void main() {
    fragColor = unnamed_1dd6d66c(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}