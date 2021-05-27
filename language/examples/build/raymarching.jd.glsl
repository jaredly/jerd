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

// skipping Div_5ac12902, contains type variables

// skipping Neg_3c2a4898, contains type variables

// skipping Mul_1de4e4c0, contains type variables

// skipping AddSub_b99b22d8, contains type variables

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
const sphereSDF#54a6d11a: (Vec3#9f1c0644, Vec3#9f1c0644, float) ={}> float = (
    samplePoint#:0: Vec3#9f1c0644,
    center#:1: Vec3#9f1c0644,
    radius#:2: float,
) ={}> (distance#29bb6cab(samplePoint#:0, center#:1) - radius#:2)
```
*/
float sphereSDF_54a6d11a(
    vec3 samplePoint_0,
    vec3 center_1,
    float radius_2
) {
    return (distance(samplePoint_0, center_1) - radius_2);
}

/**
```
const differenceSDF#fdad0384: (float, float) ={}> float = (distA#:0: float, distB#:1: float) ={}> {
    max(distA#:0, -distB#:1);
}
```
*/
float differenceSDF_fdad0384(
    float distA_0,
    float distB_1
) {
    return max(distA_0, -distB_1);
}

/**
```
const unionSDF#5ee91162: (float, float) ={}> float = (distA#:0: float, distB#:1: float) ={}> {
    min(distA#:0, distB#:1);
}
```
*/
float unionSDF_5ee91162(
    float distA_0,
    float distB_1
) {
    return min(distA_0, distB_1);
}

/**
```
const rotateY#23cedd78: (float) ={}> Mat4#d92781e8 = (theta#:0: float) ={}> {
    const c#:1 = cos(theta#:0);
    const s#:2 = sin(theta#:0);
    Mat4#d92781e8{
        r1#d92781e8#0: vec4#4d4983bb(c#:1, 0.0, s#:2, 0.0),
        r2#d92781e8#1: vec4#4d4983bb(c#:1, 1.0, c#:1, 0.0),
        r3#d92781e8#2: vec4#4d4983bb(-s#:2, 0.0, c#:1, 0.0),
        r4#d92781e8#3: vec4#4d4983bb(0.0, 0.0, 0.0, 1.0),
    };
}
```
*/
mat4 rotateY_23cedd78(
    float theta_0
) {
    float c_1 = cos(theta_0);
    float s_2 = sin(theta_0);
    return mat4(
        vec4(c_1, 0.0, s_2, 0.0),
        vec4(c_1, 1.0, c_1, 0.0),
        vec4(-s_2, 0.0, c_1, 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
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

/* *
```
const EPSILON#17261aaa: float = 0.0001
```
 */
const float EPSILON_17261aaa = 0.00010;

/**
```
const sceneSDF#5f91fed4: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const cubePoint#:2 = samplePoint#:1;
    const cubePoint#:3 = AddSubVec3#1c6fdd91."-"#b99b22d8#1(
        cubePoint#:2,
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
    );
    const cubePoint#:4 = xyz#1aedf216(
        MatByVector#16557d10."*"#1de4e4c0#0(
            rotateY#23cedd78((iTime#:0 / PI)),
            Vec4#3b941378{...cubePoint#:3, w#3b941378#0: 1.0},
        ),
    );
    const size#:5 = ((sin(iTime#:0) * 0.2) + 0.4);
    const cosize#:6 = ((cos(iTime#:0) * 0.2) + 0.4);
    const offset#:7 = 0.6;
    const cubeSize#:8 = Vec3#9f1c0644{
        x#43802a16#0: size#:5,
        y#43802a16#1: cosize#:6,
        z#9f1c0644#0: size#:5,
    };
    const innerCubeSize#:9 = Vec3#9f1c0644{
        x#43802a16#0: (size#:5 * offset#:7),
        y#43802a16#1: (cosize#:6 * offset#:7),
        z#9f1c0644#0: (size#:5 * offset#:7),
    };
    const circles#:10 = min(
        sphereSDF#54a6d11a(
            samplePoint#:1,
            Vec3#9f1c0644{x#43802a16#0: 0.25, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
            0.5,
        ),
        sphereSDF#54a6d11a(
            samplePoint#:1,
            Vec3#9f1c0644{x#43802a16#0: -0.5, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
            0.5,
        ),
    );
    unionSDF#5ee91162(
        differenceSDF#fdad0384(
            circles#:10,
            max#3af3fc3c(
                AddSubVec3#1c6fdd91."-"#b99b22d8#1(abs#1a074578(cubePoint#:4), cubeSize#:8),
            ),
        ),
        max#3af3fc3c(
            AddSubVec3#1c6fdd91."-"#b99b22d8#1(abs#1a074578(cubePoint#:4), innerCubeSize#:9),
        ),
    );
}
```
*/
float sceneSDF_5f91fed4(
    float iTime_0,
    vec3 samplePoint_1
) {
    vec3 cubePoint_3 = (samplePoint_1 - vec3(0.0, 0.0, -1.0));
    vec3 cubePoint_4 = xyz_1aedf216(
        (rotateY_23cedd78((iTime_0 / PI)) * vec4(cubePoint_3.x, cubePoint_3.y, cubePoint_3.z, 1.0))
    );
    float size_5 = ((sin(iTime_0) * 0.20) + 0.40);
    float cosize_6 = ((cos(iTime_0) * 0.20) + 0.40);
    return unionSDF_5ee91162(
        differenceSDF_fdad0384(
            min(
                sphereSDF_54a6d11a(samplePoint_1, vec3(0.250, 0.0, -1.0), 0.50),
                sphereSDF_54a6d11a(samplePoint_1, vec3(-0.50, 0.0, -1.0), 0.50)
            ),
            max_3af3fc3c((abs(cubePoint_4) - vec3(size_5, cosize_6, size_5)))
        ),
        max_3af3fc3c((abs(cubePoint_4) - vec3((size_5 * 0.60), (cosize_6 * 0.60), (size_5 * 0.60))))
    );
}

/**
```
const estimateNormal#17edaa9c: (float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
) ={}> normalize#48e6ea27(
    Vec3#9f1c0644{
        x#43802a16#0: (sceneSDF#5f91fed4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 + EPSILON#17261aaa)},
        ) - sceneSDF#5f91fed4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 - EPSILON#17261aaa)},
        )),
        y#43802a16#1: (sceneSDF#5f91fed4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 + EPSILON#17261aaa)},
        ) - sceneSDF#5f91fed4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 - EPSILON#17261aaa)},
        )),
        z#9f1c0644#0: (sceneSDF#5f91fed4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 + EPSILON#17261aaa)},
        ) - sceneSDF#5f91fed4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 - EPSILON#17261aaa)},
        )),
    },
)
```
*/
vec3 estimateNormal_17edaa9c(
    float iTime_0,
    vec3 p_1
) {
    return normalize(
        vec3(
            (sceneSDF_5f91fed4(iTime_0, vec3((p_1.x + EPSILON_17261aaa), p_1.y, p_1.z)) - sceneSDF_5f91fed4(
                iTime_0,
                vec3((p_1.x - EPSILON_17261aaa), p_1.y, p_1.z)
            )),
            (sceneSDF_5f91fed4(iTime_0, vec3(p_1.x, (p_1.y + EPSILON_17261aaa), p_1.z)) - sceneSDF_5f91fed4(
                iTime_0,
                vec3(p_1.x, (p_1.y - EPSILON_17261aaa), p_1.z)
            )),
            (sceneSDF_5f91fed4(iTime_0, vec3(p_1.x, p_1.y, (p_1.z + EPSILON_17261aaa))) - sceneSDF_5f91fed4(
                iTime_0,
                vec3(p_1.x, p_1.y, (p_1.z - EPSILON_17261aaa))
            ))
        )
    );
}

/**
```
const phongContribForLight#2cd4f58d: (
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    k_d#:1: Vec3#9f1c0644,
    k_s#:2: Vec3#9f1c0644,
    alpha#:3: float,
    p#:4: Vec3#9f1c0644,
    eye#:5: Vec3#9f1c0644,
    lightPos#:6: Vec3#9f1c0644,
    lightIntensity#:7: Vec3#9f1c0644,
) ={}> {
    const N#:8 = estimateNormal#17edaa9c(iTime#:0, p#:4);
    const L#:9 = normalize#48e6ea27(AddSubVec3#1c6fdd91."-"#b99b22d8#1(lightPos#:6, p#:4));
    const V#:10 = normalize#48e6ea27(AddSubVec3#1c6fdd91."-"#b99b22d8#1(eye#:5, p#:4));
    const R#:11 = normalize#48e6ea27(reflect#a6961410(NegVec3#a5cd53ce."-"#3c2a4898#0(L#:9), N#:8));
    const dotLN#:12 = dot#255c39c3(L#:9, N#:8);
    const dotRV#:13 = dot#255c39c3(R#:11, V#:10);
    if (dotLN#:12 < 0.0) {
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0};
    } else {
        if (dotRV#:13 < 0.0) {
            const m#:14 = ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(k_d#:1, dotLN#:12);
            MulVec3#73d73040."*"#1de4e4c0#0(lightIntensity#:7, m#:14);
        } else {
            const m#:15 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
                ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(k_d#:1, dotLN#:12),
                ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(k_s#:2, pow(dotRV#:13, alpha#:3)),
            );
            MulVec3#73d73040."*"#1de4e4c0#0(lightIntensity#:7, m#:15);
        };
    };
}
```
*/
vec3 phongContribForLight_2cd4f58d(
    float iTime_0,
    vec3 k_d_1,
    vec3 k_s_2,
    float alpha_3,
    vec3 p_4,
    vec3 eye_5,
    vec3 lightPos_6,
    vec3 lightIntensity_7
) {
    vec3 N_8 = estimateNormal_17edaa9c(iTime_0, p_4);
    vec3 L_9 = normalize((lightPos_6 - p_4));
    float dotLN_12 = dot(L_9, N_8);
    float dotRV_13 = dot(normalize(reflect(-L_9, N_8)), normalize((eye_5 - p_4)));
    if ((dotLN_12 < 0.0)) {
        return vec3(0.0, 0.0, 0.0);
    } else {
        if ((dotRV_13 < 0.0)) {
            return (lightIntensity_7 * (k_d_1 * dotLN_12));
        } else {
            return (lightIntensity_7 * ((k_d_1 * dotLN_12) + (k_s_2 * pow(dotRV_13, alpha_3))));
        };
    };
}

/**
```
const phongIllumination#eb0d8500: (
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    k_a#:1: Vec3#9f1c0644,
    k_d#:2: Vec3#9f1c0644,
    k_s#:3: Vec3#9f1c0644,
    alpha#:4: float,
    p#:5: Vec3#9f1c0644,
    eye#:6: Vec3#9f1c0644,
) ={}> {
    const ambientLight#:7 = ScaleVec3#c4a91006."*"#1de4e4c0#0(
        0.5,
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
    );
    const color#:8 = MulVec3#73d73040."*"#1de4e4c0#0(ambientLight#:7, k_a#:1);
    const light1Pos#:9 = Vec3#9f1c0644{
        x#43802a16#0: (4.0 * sin(iTime#:0)),
        y#43802a16#1: 2.0,
        z#9f1c0644#0: (4.0 * cos(iTime#:0)),
    };
    const light1Intensity#:10 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:11 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
        color#:8,
        phongContribForLight#2cd4f58d(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            light1Pos#:9,
            light1Intensity#:10,
        ),
    );
    const light2Pos#:12 = Vec3#9f1c0644{
        x#43802a16#0: (2.0 * sin((0.37 * iTime#:0))),
        y#43802a16#1: (2.0 * cos((0.37 * iTime#:0))),
        z#9f1c0644#0: 2.0,
    };
    const light2Intensity#:13 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:14 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
        color#:11,
        phongContribForLight#2cd4f58d(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            light2Pos#:12,
            light2Intensity#:13,
        ),
    );
    color#:14;
}
```
*/
vec3 phongIllumination_eb0d8500(
    float iTime_0,
    vec3 k_a_1,
    vec3 k_d_2,
    vec3 k_s_3,
    float alpha_4,
    vec3 p_5,
    vec3 eye_6
) {
    return ((((0.50 * vec3(1.0, 1.0, 1.0)) * k_a_1) + phongContribForLight_2cd4f58d(
        iTime_0,
        k_d_2,
        k_s_3,
        alpha_4,
        p_5,
        eye_6,
        vec3((4.0 * sin(iTime_0)), 2.0, (4.0 * cos(iTime_0))),
        vec3(0.40, 0.40, 0.40)
    )) + phongContribForLight_2cd4f58d(
        iTime_0,
        k_d_2,
        k_s_3,
        alpha_4,
        p_5,
        eye_6,
        vec3((2.0 * sin((0.370 * iTime_0))), (2.0 * cos((0.370 * iTime_0))), 2.0),
        vec3(0.40, 0.40, 0.40)
    ));
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
const shortestDistanceToSurface#3f4c6d77: (float, Vec3#9f1c0644, Vec3#9f1c0644, float, float, int) ={}> float = (
    iTime#:0: float,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
) ={}> {
    const dist#:6 = sceneSDF#5f91fed4(
        iTime#:0,
        AddSubVec3#1c6fdd91."+"#b99b22d8#0(
            eye#:1,
            ScaleVec3#c4a91006."*"#1de4e4c0#0(start#:3, marchingDirection#:2),
        ),
    );
    if (dist#:6 < EPSILON#17261aaa) {
        start#:3;
    } else {
        const depth#:7 = (start#:3 + dist#:6);
        if ((depth#:7 >= end#:4) || (stepsLeft#:5 <= 0)) {
            end#:4;
        } else {
            3f4c6d77#self(
                iTime#:0,
                eye#:1,
                marchingDirection#:2,
                depth#:7,
                end#:4,
                (stepsLeft#:5 - 1),
            );
        };
    };
}
```
*/
float shortestDistanceToSurface_3f4c6d77(
    float iTime_0,
    vec3 eye_1,
    vec3 marchingDirection_2,
    float start_3,
    float end_4,
    int stepsLeft_5
) {
    for (int i=0; i<10000; i++) {
        float dist_6 = sceneSDF_5f91fed4(iTime_0, (eye_1 + (start_3 * marchingDirection_2)));
        if ((dist_6 < EPSILON_17261aaa)) {
            return start_3;
        } else {
            float depth_7 = (start_3 + dist_6);
            if (((depth_7 >= end_4) || (stepsLeft_5 <= 0))) {
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
}

/**
```
const rayDirection#6258178a: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec3#9f1c0644 = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
) ={}> {
    const xy#:3 = AddSubVec2#70bb2056."-"#b99b22d8#1(
        fragCoord#:2,
        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(size#:1, 2.0),
    );
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
    return normalize(
        vec3((fragCoord_2 - (size_1 / 2.0)), -(size_1.y / tan((radians(fieldOfView_0) / 2.0))))
    );
}

/* *
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
 */
const int MAX_MARCHING_STEPS_62404440 = 255;

/**
```
const mainImage#e4a02974: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
) ={}> {
    const dir#:2 = rayDirection#6258178a(45.0, env#:0.resolution#451d5252#1, fragCoord#:1);
    const eye#:3 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:4 = shortestDistanceToSurface#3f4c6d77(
        env#:0.time#451d5252#0,
        eye#:3,
        dir#:2,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    if (dist#:4 > (MAX_DIST#0ce717e6 - EPSILON#17261aaa)) {
        Vec4#3b941378{z#9f1c0644#0: 1.0, x#43802a16#0: 1.0, y#43802a16#1: 1.0, w#3b941378#0: 1.0};
    } else {
        const p#:5 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
            eye#:3,
            ScaleVec3#c4a91006."*"#1de4e4c0#0(dist#:4, dir#:2),
        );
        const K_a#:6 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:7 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:8 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:9 = 10.0;
        const color#:10 = phongIllumination#eb0d8500(
            env#:0.time#451d5252#0,
            K_a#:6,
            K_d#:7,
            K_s#:8,
            shininess#:9,
            p#:5,
            eye#:3,
        );
        Vec4#3b941378{...color#:10, w#3b941378#0: 1.0};
    };
}
```
*/
vec4 mainImage_e4a02974(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    vec3 dir_2 = rayDirection_6258178a(45.0, env_0.resolution, fragCoord_1);
    vec3 eye_3 = vec3(0.0, 0.0, 5.0);
    float dist_4 = shortestDistanceToSurface_3f4c6d77(
        env_0.time,
        eye_3,
        dir_2,
        MIN_DIST_f2cd39b8,
        MAX_DIST_0ce717e6,
        MAX_MARCHING_STEPS_62404440
    );
    if ((dist_4 > (MAX_DIST_0ce717e6 - EPSILON_17261aaa))) {
        return vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        vec3 color_10 = phongIllumination_eb0d8500(
            env_0.time,
            vec3(0.90, 0.20, 0.30),
            vec3(0.0, 0.20, 0.70),
            vec3(1.0, 1.0, 1.0),
            10.0,
            (eye_3 + (dist_4 * dir_2)),
            eye_3
        );
        return vec4(color_10.x, color_10.y, color_10.z, 1.0);
    };
}

void main() {
    fragColor = mainImage_e4a02974(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}