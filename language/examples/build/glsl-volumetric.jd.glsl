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

/* -- generated -- */
float shortestDistanceToSurface_76155748(
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
            float dist_7 = sceneSDF_2a446490(iTime_1, (eye_2 + (start_4 * marchingDirection_3)));
            if ((dist_7 < EPSILON_ec7f8d1c)) {
                return start_4;
            } else {
                float depth_8 = (start_4 + dist_7);
                if ((depth_8 >= end_5)) {
                    return end_5;
                } else {
                    start_4 = depth_8;
                    stepsLeft_6 = (stepsLeft_6 - 1);
                    continue;
                };
            };
        };
    };
}

/* *
```
const EPSILON#ec7f8d1c: float = 0.00005
```
 */
const float EPSILON_ec7f8d1c = 0.00005;

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
const reflect#a6961410: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    I#:0: Vec3#9f1c0644,
    N#:1: Vec3#9f1c0644,
) ={}> {
    AddSubVec3#1c6fdd91."-"#b99b22d8#1(
        I#:0,
        ScaleVec3#c4a91006."*"#1de4e4c0#0((2.0 * dot#255c39c3(N#:1, I#:0)), N#:1),
    );
}
```
*/
vec3 reflect_a6961410(
    vec3 I_0,
    vec3 N_1
) {
    return (I_0 - ((2.0 * dot(N_1, I_0)) * N_1));
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
const sceneSDF#2a446490: (float, Vec3#9f1c0644) ={}> float = (
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
                        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 1.0, z#9f1c0644#0: -0.1},
                    ),
                ),
                Vec3#9f1c0644{x#43802a16#0: 2.1, y#43802a16#1: 0.1, z#9f1c0644#0: 2.1},
            ),
        ),
    );
}
```
*/
float sceneSDF_2a446490(
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
            (vabs_1a074578((samplePoint_1 - vec3(0.0, 1.0, -0.10))) - vec3(2.10, 0.10, 2.10))
        )
    );
}

/* -- generated -- */
vec3 estimateNormal_c8d03178(float iTime_1, vec3 p_2) {
    return normalize(
        vec3(
            (sceneSDF_2a446490(iTime_1, vec3((p_2.x + EPSILON_ec7f8d1c), p_2.y, p_2.z)) - sceneSDF_2a446490(
                iTime_1,
                vec3((p_2.x - EPSILON_ec7f8d1c), p_2.y, p_2.z)
            )),
            (sceneSDF_2a446490(iTime_1, vec3(p_2.x, (p_2.y + EPSILON_ec7f8d1c), p_2.z)) - sceneSDF_2a446490(
                iTime_1,
                vec3(p_2.x, (p_2.y - EPSILON_ec7f8d1c), p_2.z)
            )),
            (sceneSDF_2a446490(iTime_1, vec3(p_2.x, p_2.y, (p_2.z + EPSILON_ec7f8d1c))) - sceneSDF_2a446490(
                iTime_1,
                vec3(p_2.x, p_2.y, (p_2.z - EPSILON_ec7f8d1c))
            ))
        )
    );
}

/* -- generated -- */
vec3 phongContribForLight_5af50544(
    float iTime_1,
    vec3 k_d_2,
    vec3 k_s_3,
    float alpha_4,
    vec3 p_5,
    vec3 eye_6,
    vec3 lightPos_7,
    vec3 lightIntensity_8
) {
    vec3 N_9 = estimateNormal_c8d03178(iTime_1, p_5);
    vec3 L_10 = normalize((lightPos_7 - p_5));
    float dotLN_13 = dot(L_10, N_9);
    if ((dotLN_13 < 0.0)) {
        return vec3(0.0, 0.0, 0.0);
    } else {
        float dotRV_14 = dot(
            normalize(reflect_a6961410(negVec3_4129390c(L_10), N_9)),
            normalize((eye_6 - p_5))
        );
        if ((dotRV_14 < 0.0)) {
            return (lightIntensity_8 * (k_d_2 * dotLN_13));
        } else {
            return (lightIntensity_8 * ((k_d_2 * dotLN_13) + (k_s_3 * pow(dotRV_14, alpha_4))));
        };
    };
}

/* -- generated -- */
vec3 phongIllumination_0d68cffa(
    float iTime_1,
    vec3 k_a_2,
    vec3 k_d_3,
    vec3 k_s_4,
    float alpha_5,
    vec3 p_6,
    vec3 eye_7
) {
    return ((((0.50 * vec3(1.0, 1.0, 1.0)) * k_a_2) + phongContribForLight_5af50544(
        iTime_1,
        k_d_3,
        k_s_4,
        alpha_5,
        p_6,
        eye_7,
        vec3((4.0 * sin(iTime_1)), 2.0, (4.0 * cos(iTime_1))),
        vec3(0.40, 0.40, 0.40)
    )) + phongContribForLight_5af50544(
        iTime_1,
        k_d_3,
        k_s_4,
        alpha_5,
        p_6,
        eye_7,
        vec3((2.0 * sin((0.370 * iTime_1))), (2.0 * cos((0.370 * iTime_1))), 2.0),
        vec3(0.40, 0.40, 0.40)
    ));
}

/* -- generated -- */
vec4 phongLit_4495ec10(GLSLEnv_451d5252 env_1, vec2 fragCoord_2) {
    vec3 dir_3 = rayDirection_fb220c84(45.0, env_1.resolution, fragCoord_2);
    vec3 eye_4 = vec3(0.0, 0.0, 5.0);
    float dist_5 = shortestDistanceToSurface_76155748(
        env_1.time,
        eye_4,
        dir_3,
        MIN_DIST_f2cd39b8,
        MAX_DIST_0ce717e6,
        MAX_MARCHING_STEPS_62404440
    );
    if ((dist_5 > (MAX_DIST_0ce717e6 - EPSILON_ec7f8d1c))) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        vec3 color_11 = phongIllumination_0d68cffa(
            env_1.time,
            vec3(0.90, 0.20, 0.30),
            vec3(0.0, 0.20, 0.70),
            vec3(1.0, 1.0, 1.0),
            10.0,
            (eye_4 + (dist_5 * dir_3)),
            eye_4
        );
        return vec4(color_11.x, color_11.y, color_11.z, 1.0);
    };
}

/**
```
const randFolks#0833029c: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
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
    phongLit#4c611aab(sceneSDF#2a446490, env#:0, fragCoord#:1);
}
```
*/
vec4 randFolks_0833029c(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    return phongLit_4495ec10(env_0, fragCoord_1);
}

void main() {
    fragColor = randFolks_0833029c(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}