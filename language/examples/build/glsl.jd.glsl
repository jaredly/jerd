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
const sminCubic#e7c85424: (float, float, float) ={}> float = (a#:0: float, b#:1: float, k#:2: float) ={}> {
    const h#:3 = (max((k#:2 - abs((a#:0 - b#:1))), 0.0) / k#:2);
    const sixth#:4 = (1.0 / 6.0);
    (min(a#:0, b#:1) - ((((h#:3 * h#:3) * h#:3) * k#:2) * sixth#:4));
}
```
*/
float sminCubic_e7c85424(
    float a_0,
    float b_1,
    float k_2
) {
    float h_3 = (max((k_2 - abs((a_0 - b_1))), 0.0) / k_2);
    return (min(a_0, b_1) - ((((h_3 * h_3) * h_3) * k_2) * (1.0 / 6.0)));
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
const sceneSDF#737360a9: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const double#:2 = (iTime#:0 * 2.0);
    const p2#:3 = AddSubVec3#1c6fdd91."-"#b99b22d8#1(
        samplePoint#:1,
        Vec3#9f1c0644{
            x#43802a16#0: (-sin(double#:2) / 2.0),
            y#43802a16#1: (sin((iTime#:0 / 4.0)) / 2.0),
            z#9f1c0644#0: (cos(double#:2) / 2.0),
        },
    );
    const p1#:4 = samplePoint#:1;
    const p2#:5 = opRepLim#47cca838(
        p2#:3,
        0.1,
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
    );
    sminCubic#e7c85424((length#1cc335a2(p1#:4) - 0.5), (length#1cc335a2(p2#:5) - 0.03), 0.1);
}
```
*/
float sceneSDF_737360a9(
    float iTime_0,
    vec3 samplePoint_1
) {
    float double_2 = (iTime_0 * 2.0);
    return sminCubic_e7c85424(
        (length(samplePoint_1) - 0.50),
        (length(
            opRepLim_47cca838(
                (samplePoint_1 - vec3(
                    (-sin(double_2) / 2.0),
                    (sin((iTime_0 / 4.0)) / 2.0),
                    (cos(double_2) / 2.0)
                )),
                0.10,
                vec3(1.0, 1.0, 1.0)
            )
        ) - 0.030),
        0.10
    );
}

/**
```
const estimateNormal#fcd3504c: (float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
) ={}> normalize#ce463a80(
    Vec3#9f1c0644{
        x#43802a16#0: (sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 - EPSILON#ec7f8d1c)},
        )),
        y#43802a16#1: (sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 - EPSILON#ec7f8d1c)},
        )),
        z#9f1c0644#0: (sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 - EPSILON#ec7f8d1c)},
        )),
    },
)
```
*/
vec3 estimateNormal_fcd3504c(
    float iTime_0,
    vec3 p_1
) {
    return normalize(
        vec3(
            (sceneSDF_737360a9(iTime_0, vec3((p_1.x + EPSILON_ec7f8d1c), p_1.y, p_1.z)) - sceneSDF_737360a9(
                iTime_0,
                vec3((p_1.x - EPSILON_ec7f8d1c), p_1.y, p_1.z)
            )),
            (sceneSDF_737360a9(iTime_0, vec3(p_1.x, (p_1.y + EPSILON_ec7f8d1c), p_1.z)) - sceneSDF_737360a9(
                iTime_0,
                vec3(p_1.x, (p_1.y - EPSILON_ec7f8d1c), p_1.z)
            )),
            (sceneSDF_737360a9(iTime_0, vec3(p_1.x, p_1.y, (p_1.z + EPSILON_ec7f8d1c))) - sceneSDF_737360a9(
                iTime_0,
                vec3(p_1.x, p_1.y, (p_1.z - EPSILON_ec7f8d1c))
            ))
        )
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
const isPointingTowardLight#bbae554c: (float, Vec3#9f1c0644, Vec3#9f1c0644) ={}> bool = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
    lightPos#:2: Vec3#9f1c0644,
) ={}> {
    const N#:3 = estimateNormal#fcd3504c(iTime#:0, p#:1);
    const L#:4 = normalize#ce463a80(AddSubVec3#1c6fdd91."-"#b99b22d8#1(lightPos#:2, p#:1));
    const dotLN#:5 = dot#255c39c3(L#:4, N#:3);
    (dotLN#:5 >= 0.0);
}
```
*/
bool isPointingTowardLight_bbae554c(
    float iTime_0,
    vec3 p_1,
    vec3 lightPos_2
) {
    return (dot(normalize((lightPos_2 - p_1)), estimateNormal_fcd3504c(iTime_0, p_1)) >= 0.0);
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
const shortestDistanceToSurface#7b1e309a: (float, Vec3#9f1c0644, Vec3#9f1c0644, float, float, int) ={}> float = (
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
        const dist#:6 = sceneSDF#737360a9(
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
                7b1e309a(
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
float shortestDistanceToSurface_7b1e309a(
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
            float dist_6 = sceneSDF_737360a9(iTime_0, (eye_1 + (start_3 * marchingDirection_2)));
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
const dot2#369652bb: (Vec2#43802a16, Vec2#43802a16) ={}> float = (
    a#:0: Vec2#43802a16,
    b#:1: Vec2#43802a16,
) ={}> {
    ((a#:0.x#43802a16#0 * b#:1.x#43802a16#0) + (a#:0.y#43802a16#1 * b#:1.y#43802a16#1));
}
```
*/
float dot2_369652bb(
    vec2 a_0,
    vec2 b_1
) {
    return ((a_0.x * b_1.x) + (a_0.y * b_1.y));
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
const fishingBoueys#3cabd8b2: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
) ={}> {
    const dir#:3 = rayDirection#fb220c84(45.0, iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#7b1e309a(
        iTime#:0,
        eye#:4,
        dir#:3,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    const light#:6 = 0.2;
    if (dist#:5 > (MAX_DIST#0ce717e6 - EPSILON#ec7f8d1c)) {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 0.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        const worldPosForPixel#:7 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
            eye#:4,
            ScaleVec3#c4a91006."*"#1de4e4c0#0(dist#:5, dir#:3),
        );
        const K_a#:8 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:9 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:10 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:11 = 10.0;
        const light1Pos#:12 = Vec3#9f1c0644{
            x#43802a16#0: (10.0 * sin(iTime#:0)),
            y#43802a16#1: (10.0 * cos(iTime#:0)),
            z#9f1c0644#0: 5.0,
        };
        const toLight#:13 = AddSubVec3#1c6fdd91."-"#b99b22d8#1(light1Pos#:12, worldPosForPixel#:7);
        if isPointingTowardLight#bbae554c(iTime#:0, worldPosForPixel#:7, light1Pos#:12) {
            const marchToLight#:14 = shortestDistanceToSurface#7b1e309a(
                iTime#:0,
                light1Pos#:12,
                ScaleVec3#c4a91006."*"#1de4e4c0#0(-1.0, normalize#ce463a80(toLight#:13)),
                MIN_DIST#f2cd39b8,
                MAX_DIST#0ce717e6,
                MAX_MARCHING_STEPS#62404440,
            );
            if (marchToLight#:14 > (MAX_DIST#0ce717e6 - (EPSILON#ec7f8d1c * 10.0))) {
                Vec4#3b941378{
                    ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:6),
                    w#3b941378#0: 1.0,
                };
            } else {
                const offset#:15 = (marchToLight#:14 - length#1cc335a2(toLight#:13));
                const penumbra#:16 = 0.1;
                if (offset#:15 < (-EPSILON#ec7f8d1c * 1000.0)) {
                    Vec4#3b941378{
                        ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:6),
                        w#3b941378#0: 1.0,
                    };
                } else {
                    Vec4#3b941378{...white#0678f03c, w#3b941378#0: 1.0};
                };
            };
        } else {
            Vec4#3b941378{
                ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:6),
                w#3b941378#0: 1.0,
            };
        };
    };
}
```
*/
vec4 fishingBoueys_3cabd8b2(
    float iTime_0,
    vec2 fragCoord_1,
    vec2 iResolution_2
) {
    vec3 dir_3 = rayDirection_fb220c84(45.0, iResolution_2, fragCoord_1);
    vec3 eye_4 = vec3(0.0, 0.0, 5.0);
    float dist_5 = shortestDistanceToSurface_7b1e309a(
        iTime_0,
        eye_4,
        dir_3,
        MIN_DIST_f2cd39b8,
        MAX_DIST_0ce717e6,
        MAX_MARCHING_STEPS_62404440
    );
    float light_6 = 0.20;
    if ((dist_5 > (MAX_DIST_0ce717e6 - EPSILON_ec7f8d1c))) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        vec3 worldPosForPixel_7 = (eye_4 + (dist_5 * dir_3));
        vec3 light1Pos_12 = vec3((10.0 * sin(iTime_0)), (10.0 * cos(iTime_0)), 5.0);
        vec3 toLight_13 = (light1Pos_12 - worldPosForPixel_7);
        if (isPointingTowardLight_bbae554c(iTime_0, worldPosForPixel_7, light1Pos_12)) {
            float marchToLight_14 = shortestDistanceToSurface_7b1e309a(
                iTime_0,
                light1Pos_12,
                (-1.0 * normalize(toLight_13)),
                MIN_DIST_f2cd39b8,
                MAX_DIST_0ce717e6,
                MAX_MARCHING_STEPS_62404440
            );
            if ((marchToLight_14 > (MAX_DIST_0ce717e6 - (EPSILON_ec7f8d1c * 10.0)))) {
                vec3 spread_16 = (vec3(1.0, 1.0, 1.0) * light_6);
                return vec4(spread_16.x, spread_16.y, spread_16.z, 1.0);
            } else {
                if (((marchToLight_14 - length(toLight_13)) < (-EPSILON_ec7f8d1c * 1000.0))) {
                    vec3 spread_17 = (vec3(1.0, 1.0, 1.0) * light_6);
                    return vec4(spread_17.x, spread_17.y, spread_17.z, 1.0);
                } else {
                    return vec4(
                        vec3(1.0, 1.0, 1.0).x,
                        vec3(1.0, 1.0, 1.0).y,
                        vec3(1.0, 1.0, 1.0).z,
                        1.0
                    );
                };
            };
        } else {
            vec3 spread_18 = (vec3(1.0, 1.0, 1.0) * light_6);
            return vec4(spread_18.x, spread_18.y, spread_18.z, 1.0);
        };
    };
}

/**
```
const random#347089ef: (Vec2#43802a16) ={}> float = (st#:0: Vec2#43802a16) ={}> {
    fract#495c4d22(
        (sin(dot2#369652bb(st#:0, Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233})) * 43758.5453123),
    );
}
```
*/
float random_347089ef(
    vec2 st_0
) {
    return fract_495c4d22((sin(dot2_369652bb(st_0, vec2(12.98980, 78.2330))) * 43758.54531));
}

/**
```
const roundv2#b9171b62: (Vec2#43802a16) ={}> Vec2#43802a16 = (v#:0: Vec2#43802a16) ={}> Vec2#43802a16{
    x#43802a16#0: round(v#:0.x#43802a16#0),
    y#43802a16#1: round(v#:0.y#43802a16#1),
}
```
*/
vec2 roundv2_b9171b62(
    vec2 v_0
) {
    return vec2(round(v_0.x), round(v_0.y));
}

/**
```
const randFolks#32a9474b: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
) ={}> {
    const scale#:2 = 14.0;
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
    const two#:6 = AddSubVec4#0555d260."+"#b99b22d8#0(
        Vec4#3b941378{...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(red#7d188c3c, v#:5), w#3b941378#0: 1.0},
        fishingBoueys#3cabd8b2(env#:0.time#451d5252#0, fragCoord#:1, env#:0.resolution#451d5252#1),
    );
    Scale4#56d43c0e."/"#5ac12902#0(two#:6, 2.0);
}
```
*/
vec4 randFolks_32a9474b(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    float scale_2 = 14.0;
    vec2 small_3 = (roundv2_b9171b62((fragCoord_1 / scale_2)) * scale_2);
    vec4 lambdaBlockResult_8;
    vec3 spread_7 = (vec3(1.0, 0.0, 0.0) * ((random_347089ef(
        (vec2(small_3.x, (small_3.y + env_0.time)) / env_0.resolution)
    ) / 10.0) + 0.90));
    lambdaBlockResult_8 = vec4(spread_7.x, spread_7.y, spread_7.z, 1.0);
    return ((lambdaBlockResult_8 + fishingBoueys_3cabd8b2(env_0.time, fragCoord_1, env_0.resolution)) / 2.0);
}

void main() {
    fragColor = randFolks_32a9474b(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}