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

// skipping As_As, contains type variables

// skipping Eq_553b4b8e, contains type variables

/**
```
const one#5678a3a0: (float) ={}> float = (a#:0: float) ={}> (a#:0 + 4.0)
```
*/
float one_5678a3a0(
    float a_0
) {
    return (a_0 + 4.0);
}

/**
```
const one#f4c397d2: (int) ={}> int = (a#:0: int) ={}> (a#:0 + 2)
```
*/
int one_f4c397d2(
    int a_0
) {
    return (a_0 + 2);
}

/**
```
const unnamed#test_main: (GLSLEnv#451d5252, vec2) ={}> vec4 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: vec2,
) ={}> {
    const t0#:4 = FloatEq#c41f7386."=="#553b4b8e#0(
        (one#f4c397d2(2) as#6f186ad1 float + one#5678a3a0(3.0)),
        11.0,
    );
    const size#:2 = (env#:0.resolution#451d5252#1.x#43802a16#0 / 20.0);
    const size#:3 = (size#:2 * 0.4);
    if (t0#:4 && (length((fragCoord#:1 - (vec2(1.0, 1.0) * size#:2))) < size#:3)) vec4(
        0.0,
        1.0,
        0.0,
        1.0,
    ) else if (!(t0#:4) && (length((fragCoord#:1 - (vec2(1.0, 1.0) * size#:2))) < size#:3)) vec4(
        1.0,
        0.0,
        0.0,
        1.0,
    ) else vec4(1.0, 1.0, 1.0, 1.0);
}
```
*/
vec4 Vtest_main(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    bool t0_4 = ((float(one_f4c397d2(2)) + one_5678a3a0(3.0)) == 11.0);
    float size_2 = (env_0.resolution.x / 20.0);
    float size_3 = (size_2 * 0.40);
    if ((t0_4 && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if ((!(t0_4) && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3))) {
            return vec4(1.0, 0.0, 0.0, 1.0);
        } else {
            return vec4(1.0, 1.0, 1.0, 1.0);
        };
    };
}

void main() {
    fragColor = Vtest_main(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}