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

// skipping Neg_3c2a4898, contains type variables

// skipping Div_5ac12902, contains type variables

// skipping Mul_1de4e4c0, contains type variables

// skipping AddSub_b99b22d8, contains type variables

/* *
```
const EPSILON#ec7f8d1c: float = 0.00005
```
 */
const float EPSILON_ec7f8d1c = 0.00005;

/**
```
const estimateNormal#6700be1f: ((float, Vec3#9f1c0644) ={}> float, float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    p#:2: Vec3#9f1c0644,
) ={}> normalize#48e6ea27(
    Vec3#9f1c0644{
        x#43802a16#0: (sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, x#43802a16#0: (p#:2.x#43802a16#0 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, x#43802a16#0: (p#:2.x#43802a16#0 - EPSILON#ec7f8d1c)},
        )),
        y#43802a16#1: (sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, y#43802a16#1: (p#:2.y#43802a16#1 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, y#43802a16#1: (p#:2.y#43802a16#1 - EPSILON#ec7f8d1c)},
        )),
        z#9f1c0644#0: (sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, z#9f1c0644#0: (p#:2.z#9f1c0644#0 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, z#9f1c0644#0: (p#:2.z#9f1c0644#0 - EPSILON#ec7f8d1c)},
        )),
    },
)
```
*/
vec3 estimateNormal_6700be1f(
    invalid_lambda sceneSDF_0,
    float iTime_1,
    vec3 p_2
) {
    return normalize(
        vec3(
            (sceneSDF_0(
                iTime_1,
                lambda-woops(){
                    return vec3((p_2.x + EPSILON_ec7f8d1c), p_2.y, p_2.z);
                }()
            ) - sceneSDF_0(
                iTime_1,
                lambda-woops(){
                    return vec3((p_2.x - EPSILON_ec7f8d1c), p_2.y, p_2.z);
                }()
            )),
            (sceneSDF_0(
                iTime_1,
                lambda-woops(){
                    return vec3(p_2.x, (p_2.y + EPSILON_ec7f8d1c), p_2.z);
                }()
            ) - sceneSDF_0(
                iTime_1,
                lambda-woops(){
                    return vec3(p_2.x, (p_2.y - EPSILON_ec7f8d1c), p_2.z);
                }()
            )),
            (sceneSDF_0(
                iTime_1,
                lambda-woops(){
                    return vec3(p_2.x, p_2.y, (p_2.z + EPSILON_ec7f8d1c));
                }()
            ) - sceneSDF_0(
                iTime_1,
                lambda-woops(){
                    return vec3(p_2.x, p_2.y, (p_2.z - EPSILON_ec7f8d1c));
                }()
            ))
        )
    );
}

/**
```
const max#3af3fc3c: (Vec3#9f1c0644) ={}> float = (v#:0: Vec3#9f1c0644) ={}> {
    max(max(v#:0.x#43802a16#0, v#:0.y#43802a16#1), v#:0.z#9f1c0644#0);
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
const opRepLim#cffec7f4: (Vec3#9f1c0644, float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    p#:0: Vec3#9f1c0644,
    c#:1: float,
    l#:2: Vec3#9f1c0644,
) ={}> {
    (p#:0 -#1c6fdd91#b99b22d8#1 (c#:1 *#c4a91006#1de4e4c0#0 clamp#5483fdc2(
        round#65acfcda((p#:0 /#68f73ad4#5ac12902#0 c#:1)),
        NegVec3#a5cd53ce."-"#3c2a4898#0(l#:2),
        l#:2,
    )));
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

/**
```
const phongContribForLight#61e7f2ba: (
    (float, Vec3#9f1c0644) ={}> float,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
) ={}> Vec3#9f1c0644 = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    k_d#:2: Vec3#9f1c0644,
    k_s#:3: Vec3#9f1c0644,
    alpha#:4: float,
    p#:5: Vec3#9f1c0644,
    eye#:6: Vec3#9f1c0644,
    lightPos#:7: Vec3#9f1c0644,
    lightIntensity#:8: Vec3#9f1c0644,
) ={}> {
    const N#:9 = estimateNormal#6700be1f(sceneSDF#:0, iTime#:1, p#:5);
    const L#:10 = normalize#48e6ea27((lightPos#:7 -#1c6fdd91#b99b22d8#1 p#:5));
    const V#:11 = normalize#48e6ea27((eye#:6 -#1c6fdd91#b99b22d8#1 p#:5));
    const R#:12 = normalize#48e6ea27(reflect#a6961410(NegVec3#a5cd53ce."-"#3c2a4898#0(L#:10), N#:9));
    const dotLN#:13 = dot#255c39c3(L#:10, N#:9);
    if (dotLN#:13 < 0.0) {
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0};
    } else {
        const dotRV#:14 = dot#255c39c3(R#:12, V#:11);
        if (dotRV#:14 < 0.0) {
            const m#:15 = (k_d#:2 *#1d31aa6e#1de4e4c0#0 dotLN#:13);
            (lightIntensity#:8 *#73d73040#1de4e4c0#0 m#:15);
        } else {
            const m#:16 = ((k_d#:2 *#1d31aa6e#1de4e4c0#0 dotLN#:13) +#1c6fdd91#b99b22d8#0 (k_s#:3 *#1d31aa6e#1de4e4c0#0 pow(
                dotRV#:14,
                alpha#:4,
            )));
            (lightIntensity#:8 *#73d73040#1de4e4c0#0 m#:16);
        };
    };
}
```
*/
vec3 phongContribForLight_61e7f2ba(
    invalid_lambda sceneSDF_0,
    float iTime_1,
    vec3 k_d_2,
    vec3 k_s_3,
    float alpha_4,
    vec3 p_5,
    vec3 eye_6,
    vec3 lightPos_7,
    vec3 lightIntensity_8
) {
    vec3 N_9 = estimateNormal_6700be1f(sceneSDF_0, iTime_1, p_5);
    vec3 L_10 = normalize((lightPos_7 - p_5));
    vec3 V_11 = normalize((eye_6 - p_5));
    vec3 R_12 = normalize(reflect(-L_10, N_9));
    float dotLN_13 = dot(L_10, N_9);
    if ((dotLN_13 < 0.0)) {
        return vec3(0.0, 0.0, 0.0);
    } else {
        float dotRV_14 = dot(R_12, V_11);
        if ((dotRV_14 < 0.0)) {
            vec3 m_15 = (k_d_2 * dotLN_13);
            return (lightIntensity_8 * m_15);
        } else {
            vec3 m_16 = ((k_d_2 * dotLN_13) + (k_s_3 * pow(dotRV_14, alpha_4)));
            return (lightIntensity_8 * m_16);
        };
    };
}

/**
```
const sceneSDF#c6d72c68: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const double#:2 = (iTime#:0 * 2.0);
    const p1#:3 = opRepLim#cffec7f4(
        samplePoint#:1,
        0.25,
        Vec3#9f1c0644{x#43802a16#0: 2.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
    );
    min(
        max(
            max#3af3fc3c(
                (abs#1a074578(p1#:3) -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                    x#43802a16#0: 0.1,
                    y#43802a16#1: 0.3,
                    z#9f1c0644#0: 0.6,
                }),
            ),
            -max#3af3fc3c(
                (abs#1a074578(p1#:3) -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                    x#43802a16#0: 0.11,
                    y#43802a16#1: 0.2,
                    z#9f1c0644#0: 0.55,
                }),
            ),
        ),
        max#3af3fc3c(
            (abs#1a074578(
                (samplePoint#:1 -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                    x#43802a16#0: 0.0,
                    y#43802a16#1: 1.0,
                    z#9f1c0644#0: -0.1,
                }),
            ) -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                x#43802a16#0: 2.1,
                y#43802a16#1: 0.1,
                z#9f1c0644#0: 2.1,
            }),
        ),
    );
}
```
*/
float sceneSDF_c6d72c68(
    float iTime_0,
    vec3 samplePoint_1
) {
    vec3 p1_3 = opRepLim_cffec7f4(samplePoint_1, 0.250, vec3(2.0, 0.0, 0.0));
    return min(
        max(
            max_3af3fc3c((abs(p1_3) - vec3(0.10, 0.30, 0.60))),
            -max_3af3fc3c((abs(p1_3) - vec3(0.110, 0.20, 0.550)))
        ),
        max_3af3fc3c((abs((samplePoint_1 - vec3(0.0, 1.0, -0.10))) - vec3(2.10, 0.10, 2.10)))
    );
}

/**
```
const phongIllumination#22d47860: (
    (float, Vec3#9f1c0644) ={}> float,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
) ={}> Vec3#9f1c0644 = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    k_a#:2: Vec3#9f1c0644,
    k_d#:3: Vec3#9f1c0644,
    k_s#:4: Vec3#9f1c0644,
    alpha#:5: float,
    p#:6: Vec3#9f1c0644,
    eye#:7: Vec3#9f1c0644,
) ={}> {
    const ambientLight#:8 = (0.5 *#c4a91006#1de4e4c0#0 Vec3#9f1c0644{
        x#43802a16#0: 1.0,
        y#43802a16#1: 1.0,
        z#9f1c0644#0: 1.0,
    });
    const color#:9 = (ambientLight#:8 *#73d73040#1de4e4c0#0 k_a#:2);
    const light1Pos#:10 = Vec3#9f1c0644{
        x#43802a16#0: (4.0 * sin(iTime#:1)),
        y#43802a16#1: 2.0,
        z#9f1c0644#0: (4.0 * cos(iTime#:1)),
    };
    const light1Intensity#:11 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:12 = (color#:9 +#1c6fdd91#b99b22d8#0 phongContribForLight#61e7f2ba(
        sceneSDF#:0,
        iTime#:1,
        k_d#:3,
        k_s#:4,
        alpha#:5,
        p#:6,
        eye#:7,
        light1Pos#:10,
        light1Intensity#:11,
    ));
    const light2Pos#:13 = Vec3#9f1c0644{
        x#43802a16#0: (2.0 * sin((0.37 * iTime#:1))),
        y#43802a16#1: (2.0 * cos((0.37 * iTime#:1))),
        z#9f1c0644#0: 2.0,
    };
    const light2Intensity#:14 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:15 = (color#:12 +#1c6fdd91#b99b22d8#0 phongContribForLight#61e7f2ba(
        sceneSDF#:0,
        iTime#:1,
        k_d#:3,
        k_s#:4,
        alpha#:5,
        p#:6,
        eye#:7,
        light2Pos#:13,
        light2Intensity#:14,
    ));
    color#:15;
}
```
*/
vec3 phongIllumination_22d47860(
    invalid_lambda sceneSDF_0,
    float iTime_1,
    vec3 k_a_2,
    vec3 k_d_3,
    vec3 k_s_4,
    float alpha_5,
    vec3 p_6,
    vec3 eye_7
) {
    vec3 ambientLight_8 = (0.50 * vec3(1.0, 1.0, 1.0));
    vec3 color_9 = (ambientLight_8 * k_a_2);
    vec3 light1Pos_10 = vec3((4.0 * sin(iTime_1)), 2.0, (4.0 * cos(iTime_1)));
    vec3 light1Intensity_11 = vec3(0.40, 0.40, 0.40);
    vec3 color_12 = (color_9 + phongContribForLight_61e7f2ba(
        sceneSDF_0,
        iTime_1,
        k_d_3,
        k_s_4,
        alpha_5,
        p_6,
        eye_7,
        light1Pos_10,
        light1Intensity_11
    ));
    vec3 light2Pos_13 = vec3((2.0 * sin((0.370 * iTime_1))), (2.0 * cos((0.370 * iTime_1))), 2.0);
    vec3 light2Intensity_14 = vec3(0.40, 0.40, 0.40);
    vec3 color_15 = (color_12 + phongContribForLight_61e7f2ba(
        sceneSDF_0,
        iTime_1,
        k_d_3,
        k_s_4,
        alpha_5,
        p_6,
        eye_7,
        light2Pos_13,
        light2Intensity_14
    ));
    return color_15;
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

/* -- generated -- */
float shortestDistanceToSurface_0ca24bb0(
    float iTime_1,
    vec3 eye_2,
    vec3 marchingDirection_3,
    float start_4,
    float end_5,
    int stepsLeft_6
) {
    invalid_lambda sceneSDF_0 = sceneSDF_c6d72c68;
    for (int i=0; i<10000; i++) {
        if ((stepsLeft_6 <= 0)) {
            return end_5;
        } else {
            float dist_7 = sceneSDF_0(iTime_1, (eye_2 + (start_4 * marchingDirection_3)));
            if ((dist_7 < EPSILON_ec7f8d1c)) {
                return start_4;
            } else {
                float depth_8 = (start_4 + dist_7);
                if ((depth_8 >= end_5)) {
                    return end_5;
                } else {
                    invalid_lambda recur_9 = sceneSDF_0;
                    float recur_10 = iTime_1;
                    vec3 recur_11 = eye_2;
                    vec3 recur_12 = marchingDirection_3;
                    float recur_13 = depth_8;
                    float recur_14 = end_5;
                    int recur_15 = (stepsLeft_6 - 1);
                    sceneSDF_0 = recur_9;
                    iTime_1 = recur_10;
                    eye_2 = recur_11;
                    marchingDirection_3 = recur_12;
                    start_4 = recur_13;
                    end_5 = recur_14;
                    stepsLeft_6 = recur_15;
                    continue;
                };
            };
        };
    };
}

/**
```
const rayDirection#6258178a: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec3#9f1c0644 = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
) ={}> {
    const xy#:3 = (fragCoord#:2 -#70bb2056#b99b22d8#1 (size#:1 /#afc24bbe#5ac12902#0 2.0));
    const z#:4 = (size#:1.y#43802a16#1 / tan((radians#dabe7f9c(fieldOfView#:0) / 2.0)));
    normalize#48e6ea27(vec3#5808ec54(xy#:3, -z#:4));
}
```
*/
vec3 rayDirection_6258178a(
    float fieldOfView_0,
    vec2 size_1,
    vec2 fragCoord_2
) {
    vec2 xy_3 = (fragCoord_2 - (size_1 / 2.0));
    float z_4 = (size_1.y / tan((radians(fieldOfView_0) / 2.0)));
    return normalize(vec3(xy_3, -z_4));
}

/* *
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
 */
const int MAX_MARCHING_STEPS_62404440 = 255;

/* -- generated -- */
vec4 phongLit_7dbfe64a(GLSLEnv_451d5252 env_1, vec2 fragCoord_2) {
    invalid_lambda sceneSDF_0 = sceneSDF_c6d72c68;
    vec3 dir_3 = rayDirection_6258178a(45.0, env_1.resolution, fragCoord_2);
    vec3 eye_4 = vec3(0.0, 0.0, 5.0);
    float dist_5 = shortestDistanceToSurface_0ca24bb0(
        env_1.time,
        eye_4,
        dir_3,
        MIN_DIST_f2cd39b8,
        MAX_DIST_0ce717e6,
        MAX_MARCHING_STEPS_62404440
    );
    if ((dist_5 > (MAX_DIST_0ce717e6 - EPSILON_ec7f8d1c))) {
        return vec4(vec3(0.0), 1.0);
    } else {
        vec3 worldPosForPixel_6 = (eye_4 + (dist_5 * dir_3));
        vec3 K_a_7 = vec3(0.90, 0.20, 0.30);
        vec3 K_d_8 = vec3(0.0, 0.20, 0.70);
        vec3 K_s_9 = vec3(1.0, 1.0, 1.0);
        float shininess_10 = 10.0;
        vec3 color_11 = phongIllumination_22d47860(
            sceneSDF_0,
            env_1.time,
            K_a_7,
            K_d_8,
            K_s_9,
            shininess_10,
            worldPosForPixel_6,
            eye_4
        );
        return vec4(color_11.x, color_11.y, color_11.z, 1.0);
    };
}

/**
```
const randFolks#220f14aa: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
) ={}> {
    const scale#:2 = 40.0;
    const small#:3 = (round#b9171b62((fragCoord#:1 /#afc24bbe#5ac12902#0 scale#:2)) *#28569bc0#1de4e4c0#0 scale#:2);
    const small#:4 = vec2#54a9f2ef(
        small#:3.x#43802a16#0,
        (small#:3.y#43802a16#1 + env#:0.time#451d5252#0),
    );
    const v#:5 = ((random#347089ef((small#:4 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1)) / 10.0) + 0.9);
    phongLit#528645fb(sceneSDF#c6d72c68, env#:0, fragCoord#:1);
}
```
*/
vec4 randFolks_220f14aa(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    vec2 small_3 = (round((fragCoord_1 / 40.0)) * 40.0);
    return phongLit_7dbfe64a(env_0, fragCoord_1);
}

void main() {
    fragColor = randFolks_220f14aa(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}