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

/**
```
const simple#cf5c743c: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    pos#:1: Vec2#43802a16,
) ={}> {
    vec4#72fca9b4(if true {
        1.0;
    } else {
        2.0;
    });
}
```
*/
vec4 simple_cf5c743c(
    GLSLEnv_451d5252 env_0,
    vec2 pos_1
) {
    float lambdaBlockResult_3;
    if (nope_term_boolean) {
        lambdaBlockResult_3 = 1.0;
    } else {
        lambdaBlockResult_3 = 2.0;
    };
    return vec4(lambdaBlockResult_3);
}

void main() {
    fragColor = simple_cf5c743c(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}