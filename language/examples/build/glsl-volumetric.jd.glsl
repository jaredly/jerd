#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

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

// skipping Neg_3c2a4898, contains type variables

// skipping Div_5ac12902, contains type variables

// skipping Mul_1de4e4c0, contains type variables

// skipping AddSub_b99b22d8, contains type variables

/**
```
const max#3af3fc3c = (v#:0: Vec3#9f1c0644): float#builtin ={}> {
    max#builtin(max#builtin(v#:0.x#43802a16#0, v#:0.y#43802a16#1), v#:0.z#9f1c0644#0);
}
```
*/
float max_3af3fc3c(
    vec3 v_0
) {
    return max(max(v_0.x, v_0.y), v_0.z);
}

/**
```
const opRepLim#cffec7f4 = (p#:0: Vec3#9f1c0644, c#:1: float#builtin, l#:2: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    p#:0 
        -#1c6fdd91#b99b22d8#1 c#:1 
            *#c4a91006#1de4e4c0#0 clamp#5483fdc2(
                v: round#65acfcda(v: p#:0 /#68f73ad4#5ac12902#0 c#:1),
                min: NegVec3#a5cd53ce."-"#3c2a4898#0(l#:2),
                max: l#:2,
            );
}
```
*/
vec3 opRepLim_cffec7f4(
    vec3 p_0,
    float c_1,
    vec3 l_2
) {
    return (p_0 - (c_1 * clamp(round((p_0 / c_1)), -l_2, l_2)));
}

/* *
```
const EPSILON#ec7f8d1c = 0.00005
```
 */
const float EPSILON_ec7f8d1c = 0.00005;

/**
```
const sceneSDF#c6d72c68 = (iTime#:0: float#builtin, samplePoint#:1: Vec3#9f1c0644): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p1#:3 = opRepLim#cffec7f4(
        p: samplePoint#:1,
        c: 0.25,
        l: Vec3#9f1c0644{x#43802a16#0: 2.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
    );
    min#builtin(
        max#builtin(
            max#3af3fc3c(
                v: abs#1a074578(v: p1#:3) 
                    -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                        x#43802a16#0: 0.1,
                        y#43802a16#1: 0.3,
                        z#9f1c0644#0: 0.6,
                    },
            ),
            -max#3af3fc3c(
                v: abs#1a074578(v: p1#:3) 
                    -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                        x#43802a16#0: 0.11,
                        y#43802a16#1: 0.2,
                        z#9f1c0644#0: 0.55,
                    },
            ),
        ),
        max#3af3fc3c(
            v: abs#1a074578(
                    v: samplePoint#:1 
                        -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                            x#43802a16#0: 0.0,
                            y#43802a16#1: 1.0,
                            z#9f1c0644#0: -0.1,
                        },
                ) 
                -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                    x#43802a16#0: 2.1,
                    y#43802a16#1: 0.1,
                    z#9f1c0644#0: 2.1,
                },
        ),
    );
}
```
*/
float sceneSDF_c6d72c68(
    float iTime_0,
    vec3 samplePoint_1
) {
    vec3 p1 = opRepLim_cffec7f4(samplePoint_1, 0.250, vec3(2.0, 0.0, 0.0));
    return min(
        max(
            max_3af3fc3c((abs(p1) - vec3(0.10, 0.30, 0.60))),
            -max_3af3fc3c((abs(p1) - vec3(0.110, 0.20, 0.550)))
        ),
        max_3af3fc3c((abs((samplePoint_1 - vec3(0.0, 1.0, -0.10))) - vec3(2.10, 0.10, 2.10)))
    );
}

/* -- generated -- */
float shortestDistanceToSurface_specialization_6ad47240(
    float iTime_1,
    vec3 eye_2,
    vec3 marchingDirection_3,
    float start_4,
    float end_5,
    int stepsLeft_6
) {
    for (int i=0; i<10000; i++) {
        if ((stepsLeft_6 <= 0)) {
            return end_5;
        } else {
            float dist = sceneSDF_c6d72c68(iTime_1, (eye_2 + (start_4 * marchingDirection_3)));
            if ((dist < EPSILON_ec7f8d1c)) {
                return start_4;
            } else {
                float depth = (start_4 + dist);
                if ((depth >= end_5)) {
                    return end_5;
                } else {
                    start_4 = depth;
                    stepsLeft_6 = (stepsLeft_6 - 1);
                    continue;
                };
            };
        };
    };
}

/* *
```
const MAX_MARCHING_STEPS#62404440 = 255
```
 */
const int MAX_MARCHING_STEPS_62404440 = 255;

/* -- generated -- */
float volumetricSample_specialization_81652468(
    float iTime_1,
    vec3 light_2,
    vec3 eye_3,
    float dist_4,
    float percent_5,
    vec3 dir_6,
    int left_7
) {
    vec3 sample_9 = (eye_3 + ((percent_5 * dist_4) * dir_6));
    float lightDist = distance(sample_9, light_2);
    if ((shortestDistanceToSurface_specialization_6ad47240(
        iTime_1,
        sample_9,
        (-1.0 * normalize((sample_9 - light_2))),
        0.0,
        lightDist,
        MAX_MARCHING_STEPS_62404440
    ) >= (lightDist - 0.10))) {
        return (dist_4 / pow((1.0 + lightDist), 2.0));
    } else {
        return 0.0;
    };
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

/* -- generated -- */
float volumetric_specialization_3cc4ce38(
    float iTime_1,
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
            current_7 = (current_7 + volumetricSample_specialization_81652468(
                iTime_1,
                light_3,
                eye_4,
                dist_5,
                (float(left_8) / total_9),
                dir_6,
                left_8
            ));
            left_8 = (left_8 - 1);
            continue;
        };
    };
}

/* *
```
const MAX_DIST#0ce717e6 = 100.0
```
 */
const float MAX_DIST_0ce717e6 = 100.0;

/* *
```
const MIN_DIST#f2cd39b8 = 0.0
```
 */
const float MIN_DIST_f2cd39b8 = 0.0;

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
    vec3 f = normalize((center_1 - eye_0));
    vec3 s = normalize(cross_54f2119c(f, up_2));
    vec3 u = cross_54f2119c(s, f);
    vec4 lambdaBlockResult;
    vec3 spread = -f;
    lambdaBlockResult = vec4(spread.x, spread.y, spread.z, 0.0);
    return mat4(
        vec4(s.x, s.y, s.z, 0.0),
        vec4(u.x, u.y, u.z, 0.0),
        lambdaBlockResult,
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
    return normalize(
        vec3((fragCoord_2 - (size_1 / 2.0)), -(size_1.y / tan((radians(fieldOfView_0) / 2.0))))
    );
}

/* -- generated -- */
vec4 fishingBoueys_specialization_19918a50(
    float iTime_1,
    vec2 fragCoord_2,
    vec2 iResolution_3,
    vec3 uCamera_4
) {
    vec3 viewDir = rayDirection_6258178a(45.0, iResolution_3, fragCoord_2);
    vec3 worldDir = xyz_1aedf216(
        V16557d10_1de4e4c0_0(
            viewMatrix_c336d78c(uCamera_4, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0)),
            vec4(viewDir.x, viewDir.y, viewDir.z, 0.0)
        )
    );
    float dist_10 = shortestDistanceToSurface_specialization_6ad47240(
        iTime_1,
        uCamera_4,
        worldDir,
        MIN_DIST_f2cd39b8,
        MAX_DIST_0ce717e6,
        MAX_MARCHING_STEPS_62404440
    );
    if ((dist_10 > (MAX_DIST_0ce717e6 - EPSILON_ec7f8d1c))) {
        return vec4(1.0, 1.0, 0.0, 1.0);
    } else {
        float brightness = ((volumetric_specialization_3cc4ce38(
            iTime_1,
            ((fragCoord_2 / iResolution_3) + (iTime_1 / 1000.0)),
            vec3((0.150 + (sin((iTime_1 / 2.0)) / 1.0)), 0.0, 0.050),
            uCamera_4,
            dist_10,
            worldDir,
            0.0,
            int(10.0),
            10.0
        ) * 3.0) / 10.0);
        vec3 spread_16 = (((vec3(1.0, 1.0, 1.0) * brightness) * brightness) * brightness);
        return vec4(spread_16.x, spread_16.y, spread_16.z, 1.0);
    };
}

/**
```
const randFolks#5bc245fa = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const scale#:2 = 40.0;
    const small#:3 = round#b9171b62(v: fragCoord#:1 /#afc24bbe#5ac12902#0 scale#:2) 
        *#28569bc0#1de4e4c0#0 scale#:2;
    const small#:4 = vec2#54a9f2ef(
        x: small#:3.x#43802a16#0,
        y: small#:3.y#43802a16#1 +#builtin env#:0.time#451d5252#0,
    );
    const v#:5 = random#347089ef(st: small#:4 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const bouey#:6 = fishingBoueys#4d821b9e(
        sceneSDF#c6d72c68,
        iTime: env#:0.time#451d5252#0,
        fragCoord#:1,
        iResolution: env#:0.resolution#451d5252#1,
        uCamera: env#:0.camera#451d5252#2 *#1d31aa6e#1de4e4c0#0 -1.0,
    );
    bouey#:6;
}
```
*/
vec4 randFolks_5bc245fa(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    return fishingBoueys_specialization_19918a50(
        env_0.time,
        fragCoord_1,
        env_0.resolution,
        (env_0.camera * -1.0)
    );
}

void main() {
    fragColor = randFolks_5bc245fa(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}