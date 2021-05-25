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

// skipping As_As, contains type variables

// skipping AddSub_b99b22d8, contains type variables

// skipping Mul_1de4e4c0, contains type variables

// skipping Div_5ac12902, contains type variables

/* *
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
 */
const int MAX_MARCHING_STEPS_62404440 = 255;

/**
```
const negVec3#4129390c: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> {
    Vec3#9f1c0644{
        x#43802a16#0: -v#:0.x#43802a16#0,
        y#43802a16#1: -v#:0.y#43802a16#1,
        z#9f1c0644#0: -v#:0.z#9f1c0644#0,
    };
}
```
*/
vec3 negVec3_4129390c(
    vec3 v_0
) {
    return vec3(-v_0.x, -v_0.y, -v_0.z);
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
const vmax#3af3fc3c: (Vec3#9f1c0644) ={}> float = (v#:0: Vec3#9f1c0644) ={}> {
    max(max(v#:0.x#43802a16#0, v#:0.y#43802a16#1), v#:0.z#9f1c0644#0);
}
```
*/
float vmax_3af3fc3c(
    vec3 v_0
) {
    return max(max(v_0.x, v_0.y), v_0.z);
}

/**
```
const opRepLim#47cca838: (Vec3#9f1c0644, float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    p#:0: Vec3#9f1c0644,
    c#:1: float,
    l#:2: Vec3#9f1c0644,
) ={}> {
    AddSubVec3#1c6fdd91."-"#b99b22d8#1(
        p#:0,
        ScaleVec3#c4a91006."*"#1de4e4c0#0(
            c#:1,
            clamp#5483fdc2(
                roundv#65acfcda(ScaleVec3Rev#68f73ad4."/"#5ac12902#0(p#:0, c#:1)),
                negVec3#4129390c(l#:2),
                l#:2,
            ),
        ),
    );
}
```
*/
vec3 opRepLim_47cca838(
    vec3 p_0,
    float c_1,
    vec3 l_2
) {
    return (p_0 - (c_1 * clamp(round((p_0 / c_1)), negVec3_4129390c(l_2), l_2)));
}

/* *
```
const EPSILON#ec7f8d1c: float = 0.00005
```
 */
const float EPSILON_ec7f8d1c = 0.00005;

/**
```
const sceneSDF#51cd937e: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const double#:2 = (iTime#:0 * 2.0);
    const p1#:3 = opRepLim#47cca838(
        samplePoint#:1,
        0.25,
        Vec3#9f1c0644{x#43802a16#0: 2.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
    );
    min(
        max(
            vmax#3af3fc3c(
                AddSubVec3#1c6fdd91."-"#b99b22d8#1(
                    vabs#1a074578(p1#:3),
                    Vec3#9f1c0644{x#43802a16#0: 0.1, y#43802a16#1: 0.3, z#9f1c0644#0: 0.6},
                ),
            ),
            -vmax#3af3fc3c(
                AddSubVec3#1c6fdd91."-"#b99b22d8#1(
                    vabs#1a074578(p1#:3),
                    Vec3#9f1c0644{x#43802a16#0: 0.11, y#43802a16#1: 0.2, z#9f1c0644#0: 0.55},
                ),
            ),
        ),
        vmax#3af3fc3c(
            AddSubVec3#1c6fdd91."-"#b99b22d8#1(
                vabs#1a074578(
                    AddSubVec3#1c6fdd91."-"#b99b22d8#1(
                        samplePoint#:1,
                        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: -0.1},
                    ),
                ),
                Vec3#9f1c0644{x#43802a16#0: 10.2, y#43802a16#1: 10.0, z#9f1c0644#0: 0.1},
            ),
        ),
    );
}
```
*/
float sceneSDF_51cd937e(
    float iTime_0,
    vec3 samplePoint_1
) {
    vec3 p1_3 = opRepLim_47cca838(samplePoint_1, 0.250, vec3(2.0, 0.0, 0.0));
    return min(
        max(
            vmax_3af3fc3c((vabs_1a074578(p1_3) - vec3(0.10, 0.30, 0.60))),
            -vmax_3af3fc3c((vabs_1a074578(p1_3) - vec3(0.110, 0.20, 0.550)))
        ),
        vmax_3af3fc3c(
            (vabs_1a074578((samplePoint_1 - vec3(0.0, 0.0, -0.10))) - vec3(10.20, 10.0, 0.10))
        )
    );
}

/**
```
const shortestDistanceToSurface#22a8b392: (float, Vec3#9f1c0644, Vec3#9f1c0644, float, float, int) ={}> float = (
    iTime#:0: float,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
) ={}> {
    if (stepsLeft#:5 <= 0) {
        end#:4;
    } else {
        const dist#:6 = sceneSDF#51cd937e(
            iTime#:0,
            AddSubVec3#1c6fdd91."+"#b99b22d8#0(
                eye#:1,
                ScaleVec3#c4a91006."*"#1de4e4c0#0(start#:3, marchingDirection#:2),
            ),
        );
        if (dist#:6 < EPSILON#ec7f8d1c) {
            start#:3;
        } else {
            const depth#:7 = (start#:3 + dist#:6);
            if (depth#:7 >= end#:4) {
                end#:4;
            } else {
                22a8b392(
                    iTime#:0,
                    eye#:1,
                    marchingDirection#:2,
                    depth#:7,
                    end#:4,
                    (stepsLeft#:5 - 1),
                );
            };
        };
    };
}
```
*/
float shortestDistanceToSurface_22a8b392(
    float iTime_0,
    vec3 eye_1,
    vec3 marchingDirection_2,
    float start_3,
    float end_4,
    int stepsLeft_5
) {
    for (int i=0; i<10000; i++) {
        if ((stepsLeft_5 <= 0)) {
            return end_4;
        } else {
            float dist_6 = sceneSDF_51cd937e(iTime_0, (eye_1 + (start_3 * marchingDirection_2)));
            if ((dist_6 < EPSILON_ec7f8d1c)) {
                return start_3;
            } else {
                float depth_7 = (start_3 + dist_6);
                if ((depth_7 >= end_4)) {
                    return end_4;
                } else {
                    iTime_0 = iTime_0;
                    eye_1 = eye_1;
                    marchingDirection_2 = marchingDirection_2;
                    start_3 = depth_7;
                    end_4 = end_4;
                    stepsLeft_5 = (stepsLeft_5 - 1);
                    continue;
                };
            };
        };
    };
}

/**
```
const distance#b962a56c: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> float = (
    one#:0: Vec3#9f1c0644,
    two#:1: Vec3#9f1c0644,
) ={}> length#1cc335a2(AddSubVec3#1c6fdd91."-"#b99b22d8#1(two#:1, one#:0))
```
*/
float distance_b962a56c(
    vec3 one_0,
    vec3 two_1
) {
    return length((two_1 - one_0));
}

/**
```
const volumetricSample#bc6322d4: (
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    float,
    Vec3#9f1c0644,
    int,
) ={}> float = (
    iTime#:0: float,
    light#:1: Vec3#9f1c0644,
    eye#:2: Vec3#9f1c0644,
    dist#:3: float,
    percent#:4: float,
    dir#:5: Vec3#9f1c0644,
    left#:6: int,
) ={}> {
    const rdist#:7 = (percent#:4 * dist#:3);
    const sample#:8 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
        eye#:2,
        ScaleVec3#c4a91006."*"#1de4e4c0#0(rdist#:7, dir#:5),
    );
    const lightDist#:9 = distance#b962a56c(sample#:8, light#:1);
    const toLight#:10 = AddSubVec3#1c6fdd91."-"#b99b22d8#1(sample#:8, light#:1);
    const marchToLight#:11 = shortestDistanceToSurface#22a8b392(
        iTime#:0,
        sample#:8,
        ScaleVec3#c4a91006."*"#1de4e4c0#0(-1.0, normalize#ce463a80(toLight#:10)),
        0.0,
        lightDist#:9,
        MAX_MARCHING_STEPS#62404440,
    );
    if (marchToLight#:11 >= (lightDist#:9 - 0.1)) {
        (dist#:3 / pow((1.0 + lightDist#:9), 2.0));
    } else {
        0.0;
    };
}
```
*/
float volumetricSample_bc6322d4(
    float iTime_0,
    vec3 light_1,
    vec3 eye_2,
    float dist_3,
    float percent_4,
    vec3 dir_5,
    int left_6
) {
    vec3 sample_8 = (eye_2 + ((percent_4 * dist_3) * dir_5));
    float lightDist_9 = distance_b962a56c(sample_8, light_1);
    if ((shortestDistanceToSurface_22a8b392(
        iTime_0,
        sample_8,
        (-1.0 * normalize((sample_8 - light_1))),
        0.0,
        lightDist_9,
        MAX_MARCHING_STEPS_62404440
    ) >= (lightDist_9 - 0.10))) {
        return (dist_3 / pow((1.0 + lightDist_9), 2.0));
    } else {
        return 0.0;
    };
}

/* *
```
const MAX_DIST#0ce717e6: float = 100.0
```
 */
const float MAX_DIST_0ce717e6 = 100.0;

/* *
```
const MIN_DIST#f2cd39b8: float = 0.0
```
 */
const float MIN_DIST_f2cd39b8 = 0.0;

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
const cross#54f2119c: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    one#:0: Vec3#9f1c0644,
    two#:1: Vec3#9f1c0644,
) ={}> Vec3#9f1c0644{
    x#43802a16#0: ((one#:0.y#43802a16#1 * two#:1.z#9f1c0644#0) - (two#:1.y#43802a16#1 * one#:0.z#9f1c0644#0)),
    y#43802a16#1: ((one#:0.z#9f1c0644#0 * two#:1.x#43802a16#0) - (two#:1.z#9f1c0644#0 * one#:0.x#43802a16#0)),
    z#9f1c0644#0: ((one#:0.x#43802a16#0 * two#:1.y#43802a16#1) - (two#:1.x#43802a16#0 * one#:0.y#43802a16#1)),
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
const vec3#5808ec54: (Vec2#43802a16, float) ={}> Vec3#9f1c0644 = (v#:0: Vec2#43802a16, z#:1: float) ={}> Vec3#9f1c0644{
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
const radians#dabe7f9c: (float) ={}> float = (degrees#:0: float) ={}> ((degrees#:0 / 180.0) * PI)
```
*/
float radians_dabe7f9c(
    float degrees_0
) {
    return ((degrees_0 / 180.0) * PI);
}

/**
```
const volumetric#51a6cf2c: (
    float,
    Vec2#43802a16,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
    float,
    int,
    float,
) ={}> float = (
    iTime#:0: float,
    seed#:1: Vec2#43802a16,
    light#:2: Vec3#9f1c0644,
    eye#:3: Vec3#9f1c0644,
    dist#:4: float,
    dir#:5: Vec3#9f1c0644,
    current#:6: float,
    left#:7: int,
    total#:8: float,
) ={}> {
    if (left#:7 <= 0) {
        current#:6;
    } else {
        const percent#:9 = (left#:7 as#6f186ad1 float / total#:8);
        const sample#:10 = volumetricSample#bc6322d4(
            iTime#:0,
            light#:2,
            eye#:3,
            dist#:4,
            percent#:9,
            dir#:5,
            left#:7,
        );
        51a6cf2c(
            iTime#:0,
            seed#:1,
            light#:2,
            eye#:3,
            dist#:4,
            dir#:5,
            (current#:6 + sample#:10),
            (left#:7 - 1),
            total#:8,
        );
    };
}
```
*/
float volumetric_51a6cf2c(
    float iTime_0,
    vec2 seed_1,
    vec3 light_2,
    vec3 eye_3,
    float dist_4,
    vec3 dir_5,
    float current_6,
    int left_7,
    float total_8
) {
    for (int i=0; i<10000; i++) {
        if ((left_7 <= 0)) {
            return current_6;
        } else {
            float recur_17 = (current_6 + volumetricSample_bc6322d4(
                iTime_0,
                light_2,
                eye_3,
                dist_4,
                (float(left_7) / total_8),
                dir_5,
                left_7
            ));
            iTime_0 = iTime_0;
            seed_1 = seed_1;
            light_2 = light_2;
            eye_3 = eye_3;
            dist_4 = dist_4;
            dir_5 = dir_5;
            current_6 = recur_17;
            left_7 = (left_7 - 1);
            total_8 = total_8;
            continue;
        };
    };
}

/**
```
const xyz#1aedf216: (Vec4#3b941378) ={}> Vec3#9f1c0644 = (v#:0: Vec4#3b941378) ={}> Vec3#9f1c0644{
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
const viewMatrix#c4780f44: (Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644) ={}> Mat4#d92781e8 = (
    eye#:0: Vec3#9f1c0644,
    center#:1: Vec3#9f1c0644,
    up#:2: Vec3#9f1c0644,
) ={}> {
    const f#:3 = normalize#ce463a80(AddSubVec3#1c6fdd91."-"#b99b22d8#1(center#:1, eye#:0));
    const s#:4 = normalize#ce463a80(cross#54f2119c(f#:3, up#:2));
    const u#:5 = cross#54f2119c(s#:4, f#:3);
    Mat4#d92781e8{
        r1#d92781e8#0: Vec4#3b941378{...s#:4, w#3b941378#0: 0.0},
        r2#d92781e8#1: Vec4#3b941378{...u#:5, w#3b941378#0: 0.0},
        r3#d92781e8#2: Vec4#3b941378{...negVec3#4129390c(f#:3), w#3b941378#0: 0.0},
        r4#d92781e8#3: vec4#4d4983bb(0.0, 0.0, 0.0, 1.0),
    };
}
```
*/
mat4 viewMatrix_c4780f44(
    vec3 eye_0,
    vec3 center_1,
    vec3 up_2
) {
    vec3 f_3 = normalize((center_1 - eye_0));
    vec3 s_4 = normalize(cross_54f2119c(f_3, up_2));
    vec3 u_5 = cross_54f2119c(s_4, f_3);
    vec4 lambdaBlockResult_8;
    vec3 spread_6 = negVec3_4129390c(f_3);
    lambdaBlockResult_8 = vec4(spread_6.x, spread_6.y, spread_6.z, 0.0);
    return mat4(
        vec4(s_4.x, s_4.y, s_4.z, 0.0),
        vec4(u_5.x, u_5.y, u_5.z, 0.0),
        lambdaBlockResult_8,
        vec4_4d4983bb(0.0, 0.0, 0.0, 1.0)
    );
}

/**
```
const rayDirection#fb220c84: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec3#9f1c0644 = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
) ={}> {
    const xy#:3 = AddSubVec2#70bb2056."-"#b99b22d8#1(
        fragCoord#:2,
        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(size#:1, 2.0),
    );
    const z#:4 = (size#:1.y#43802a16#1 / tan((radians#dabe7f9c(fieldOfView#:0) / 2.0)));
    normalize#ce463a80(vec3#5808ec54(xy#:3, -z#:4));
}
```
*/
vec3 rayDirection_fb220c84(
    float fieldOfView_0,
    vec2 size_1,
    vec2 fragCoord_2
) {
    return normalize(
        vec3_5808ec54(
            (fragCoord_2 - (size_1 / 2.0)),
            -(size_1.y / tan((radians_dabe7f9c(fieldOfView_0) / 2.0)))
        )
    );
}

/**
```
const fishingBoueys#c225509c: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
) ={}> {
    const viewDir#:4 = rayDirection#fb220c84(45.0, iResolution#:2, fragCoord#:1);
    const eye#:5 = uCamera#:3;
    const viewToWorld#:6 = viewMatrix#c4780f44(
        eye#:5,
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
    );
    const worldDir#:7 = xyz#1aedf216(
        MatByVector#16557d10."*"#1de4e4c0#0(
            viewToWorld#:6,
            Vec4#3b941378{...viewDir#:4, w#3b941378#0: 0.0},
        ),
    );
    const dir#:8 = worldDir#:7;
    const dist#:9 = shortestDistanceToSurface#22a8b392(
        iTime#:0,
        eye#:5,
        dir#:8,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    if (dist#:9 > (MAX_DIST#0ce717e6 - EPSILON#ec7f8d1c)) {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 0.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        const worldPosForPixel#:10 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
            eye#:5,
            ScaleVec3#c4a91006."*"#1de4e4c0#0(dist#:9, dir#:8),
        );
        const light1Pos#:11 = Vec3#9f1c0644{
            x#43802a16#0: (0.15 + (sin((iTime#:0 / 2.0)) / 1.0)),
            y#43802a16#1: 0.0,
            z#9f1c0644#0: 0.05,
        };
        const surfaces#:12 = lightSurface#61465ac7(
            iTime#:0,
            worldPosForPixel#:10,
            light1Pos#:11,
            0.0,
            0.01,
        );
        const samples#:13 = 10.0;
        const brightness#:14 = ((volumetric#51a6cf2c(
            iTime#:0,
            AddSubVec2_#6d631644."+"#b99b22d8#0(
                MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, iResolution#:2),
                (iTime#:0 / 1000.0),
            ),
            light1Pos#:11,
            eye#:5,
            dist#:9,
            dir#:8,
            0.0,
            samples#:13 as#184a69ed int,
            samples#:13,
        ) * 3.0) / samples#:13);
        Vec4#3b941378{
            ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(
                ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(
                    ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, brightness#:14),
                    brightness#:14,
                ),
                brightness#:14,
            ),
            w#3b941378#0: 1.0,
        };
    };
}
```
*/
vec4 fishingBoueys_c225509c(
    float iTime_0,
    vec2 fragCoord_1,
    vec2 iResolution_2,
    vec3 uCamera_3
) {
    vec3 viewDir_4 = rayDirection_fb220c84(45.0, iResolution_2, fragCoord_1);
    vec3 eye_5 = uCamera_3;
    vec3 dir_8 = xyz_1aedf216(
        (viewMatrix_c4780f44(eye_5, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0)) * vec4(
            viewDir_4.x,
            viewDir_4.y,
            viewDir_4.z,
            0.0
        ))
    );
    float dist_9 = shortestDistanceToSurface_22a8b392(
        iTime_0,
        eye_5,
        dir_8,
        MIN_DIST_f2cd39b8,
        MAX_DIST_0ce717e6,
        MAX_MARCHING_STEPS_62404440
    );
    if ((dist_9 > (MAX_DIST_0ce717e6 - EPSILON_ec7f8d1c))) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        float samples_13 = 10.0;
        float brightness_14 = ((volumetric_51a6cf2c(
            iTime_0,
            ((fragCoord_1 / iResolution_2) + (iTime_0 / 1000.0)),
            vec3((0.150 + (sin((iTime_0 / 2.0)) / 1.0)), 0.0, 0.050),
            eye_5,
            dist_9,
            dir_8,
            0.0,
            int(samples_13),
            samples_13
        ) * 3.0) / samples_13);
        vec3 spread_15 = (((vec3(1.0, 1.0, 1.0) * brightness_14) * brightness_14) * brightness_14);
        return vec4(spread_15.x, spread_15.y, spread_15.z, 1.0);
    };
}

/**
```
const randFolks#580d0d97: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
) ={}> {
    const scale#:2 = 40.0;
    const small#:3 = Vec2float#28569bc0."*"#1de4e4c0#0(
        roundv2#b9171b62(ScaleVec2Rev#afc24bbe."/"#5ac12902#0(fragCoord#:1, scale#:2)),
        scale#:2,
    );
    const small#:4 = Vec2#43802a16{
        x#43802a16#0: small#:3.x#43802a16#0,
        y#43802a16#1: (small#:3.y#43802a16#1 + env#:0.time#451d5252#0),
    };
    const v#:5 = ((random#347089ef(
        MulVec2#090f77e7."/"#5ac12902#0(small#:4, env#:0.resolution#451d5252#1),
    ) / 10.0) + 0.9);
    const bouey#:6 = fishingBoueys#c225509c(
        env#:0.time#451d5252#0,
        fragCoord#:1,
        env#:0.resolution#451d5252#1,
        ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(env#:0.camera#451d5252#2, -1.0),
    );
    bouey#:6;
}
```
*/
vec4 randFolks_580d0d97(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    return fishingBoueys_c225509c(env_0.time, fragCoord_1, env_0.resolution, (env_0.camera * -1.0));
}

void main() {
    fragColor = randFolks_580d0d97(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}