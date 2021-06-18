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

/* *
```
const EPSILON#17261aaa = 0.0001
```
 */
const float EPSILON_17261aaa = 0.00010;

/* -- generated -- */
vec4 unnamed_lambda_1f2e12d2(GLSLEnv_451d5252 env_5, vec2 coord_6) {
    vec3 eye = vec3(0.0, 0.0, 5.0);
    if ((sceneSDF_4(env_5, eye) > (100.0 - EPSILON_17261aaa))) {
        return vec4(1.0);
    } else {
        return vec4(sceneSDF_4(env_5, (eye + 1.0)));
    };
}

/**
```
const unnamed#82078c8c = marchNormals#4a29cc54(
    sceneSDF: (env#:0: GLSLEnv#451d5252, p#:1: Vec3#9f1c0644): float#builtin ={}> length#63e16b7a(
            v: p#:1,
        ) 
        -#builtin 1.0,
)
```
*/
vec4 unnamed_82078c8c(
    GLSLEnv_451d5252 arg0_2,
    vec2 arg1_3
) {
    return unnamed_lambda_1f2e12d2(arg0_2, arg1_3);
}

void main() {
    fragColor = unnamed_82078c8c(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}