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

/* *
```
const EPSILON#17261aaa = 0.0001
```
 */
const float EPSILON_17261aaa = 0.00010;

/* -- generated -- */
float V31eb0dc0(GLSLEnv_451d5252 env_0, vec3 p_1) {
    return (length(p_1) - 1.0);
}

/**
```
const unnamed#82078c8c = marchNormals#4a29cc54(
    (env#:0: GLSLEnv#451d5252, p#:1: Vec3#9f1c0644): float ={}> length#63e16b7a(p#:1) - 1.0,
)
```
*/
vec4 unnamed_82078c8c(
    GLSLEnv_451d5252 env_5,
    vec2 coord_6
) {
    vec3 eye_7 = vec3(0.0, 0.0, 5.0);
    if ((V31eb0dc0(env_5, eye_7) > (100.0 - EPSILON_17261aaa))) {
        return vec4(1.0);
    } else {
        return vec4(V31eb0dc0(env_5, (eye_7 + 1.0)));
    };
}

void main() {
    fragColor = unnamed_82078c8c(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}