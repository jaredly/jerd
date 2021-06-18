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
float unnamed_lambda_a5e200ec(GLSLEnv_451d5252 env_0, vec3 p_1) {
    return (length(p_1) - 1.0);
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
    GLSLEnv_451d5252 env_3,
    vec2 coord_4
) {
    vec3 eye = vec3(0.0, 0.0, 5.0);
    if ((unnamed_lambda_a5e200ec(env_3, eye) > (100.0 - EPSILON_17261aaa))) {
        return vec4(1.0);
    } else {
        return vec4(unnamed_lambda_a5e200ec(env_3, (eye + 1.0)));
    };
}

void main() {
    fragColor = unnamed_82078c8c(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}