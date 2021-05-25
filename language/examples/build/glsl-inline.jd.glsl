#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform sampler2D u_buffer0;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

// skipping Eq_553b4b8e, contains type variables

struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};

// skipping Mul_1de4e4c0, contains type variables

// skipping AddSub_b99b22d8, contains type variables

// skipping Div_5ac12902, contains type variables

/* *
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
 */
const int MAX_MARCHING_STEPS_62404440 = 255;

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

/* *
```
const EPSILON#ec7f8d1c: float = 0.00005
```
 */
const float EPSILON_ec7f8d1c = 0.00005;

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
const sceneSDF#6009ff98: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const double#:2 = (iTime#:0 * 2.0);
    const p1#:3 = samplePoint#:1;
    (length#1cc335a2(p1#:3) - 0.5);
}
```
*/
float sceneSDF_6009ff98(
    float iTime_0,
    vec3 samplePoint_1
) {
    return (length(samplePoint_1) - 0.50);
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

/* -- generated -- */
float shortestDistanceToSurface_30e67a7c(
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
            float dist_7 = sceneSDF_6009ff98(iTime_1, (eye_2 + (start_4 * marchingDirection_3)));
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

/**
```
const fishingBoueys#746ed81c: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
) ={}> {
    const dir#:2 = rayDirection#fb220c84(45.0, env#:0.resolution#451d5252#1, fragCoord#:1);
    const eye#:3 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:4 = shortestDistanceToSurface#56314282(
        sceneSDF#6009ff98,
        env#:0.time#451d5252#0,
        eye#:3,
        dir#:2,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    if (dist#:4 > (MAX_DIST#0ce717e6 - EPSILON#ec7f8d1c)) {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 0.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 1.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    };
}
```
*/
vec4 fishingBoueys_746ed81c(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    if ((shortestDistanceToSurface_30e67a7c(
        env_0.time,
        vec3(0.0, 0.0, 5.0),
        rayDirection_fb220c84(45.0, env_0.resolution, fragCoord_1),
        MIN_DIST_f2cd39b8,
        MAX_DIST_0ce717e6,
        MAX_MARCHING_STEPS_62404440
    ) > (MAX_DIST_0ce717e6 - EPSILON_ec7f8d1c))) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        return vec4(1.0, 0.0, 0.0, 1.0);
    };
}

void main() {
    fragColor = fishingBoueys_746ed81c(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}