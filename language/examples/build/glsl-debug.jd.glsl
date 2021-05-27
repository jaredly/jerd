#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform sampler2D u_buffer0;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

// skipping Ord_2d895d64, contains type variables

struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};

/* -- generated -- */
bool V3233d904_2d895d64_1(vec2 a_2, vec2 b_3) {
    return ((a_2.x > b_3.x) && (a_2.y > b_3.y));
}

/**
```
const simple#6062a703: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    pos#:1: Vec2#43802a16,
) ={}> {
    vec4#72fca9b4(
        if Vec2Ord#3233d904.">"#2d895d64#1(pos#:1, vec2#54a9f2ef(10.0, 20.0)) {
            1.0;
        } else {
            2.0;
        },
    );
}
```
*/
vec4 simple_6062a703(
    GLSLEnv_451d5252 env_0,
    vec2 pos_1
) {
    float lambdaBlockResult_4;
    if (V3233d904_2d895d64_1(pos_1, vec2(10.0, 20.0))) {
        lambdaBlockResult_4 = 1.0;
    } else {
        lambdaBlockResult_4 = 2.0;
    };
    return vec4(lambdaBlockResult_4);
}

void main() {
    fragColor = simple_6062a703(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}