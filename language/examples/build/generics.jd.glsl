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

// skipping Eq_553b4b8e, contains type variables

/**
```
const addTwo#f4c397d2: (int) ={}> int = (one#:0: int) ={}> (one#:0 + 2)
```
*/
int addTwo_f4c397d2(
    int one_0
) {
    return (one_0 + 2);
}

/* -- generated -- */
int callme_c17766ce(int arg_1) {
    return addTwo_f4c397d2(arg_1);
}

/**
```
const scopeIt#36626a20: (int) ={}> (int) ={}> int = (x#:0: int) ={}> (y#:1: int) ={}> (x#:0 + y#:1)
```
*/
invalid_lambda scopeIt_36626a20(
    int x_0
) {
    return lambda-woops(y_1){
        (x_0 + y_1);
    };
}

/**
```
const unnamed#test_main: (GLSLEnv#451d5252, vec2) ={}> vec4 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: vec2,
) ={}> {
    const t0#:4 = IntEq#9275f914."=="#553b4b8e#0(ten#48447074, 10);
    const t1#:5 = IntEq#9275f914."=="#553b4b8e#0(callIt#2d15e126, 7);
    const size#:2 = (env#:0.resolution#451d5252#1.x#43802a16#0 / 20.0);
    const size#:3 = (size#:2 * 0.4);
    if ((t0#:4 && (length((fragCoord#:1 - (vec2(1.0, 1.0) * size#:2))) < size#:3)) || (t1#:5 && (length(
        (fragCoord#:1 - (vec2(2.0, 1.0) * size#:2)),
    ) < size#:3))) vec4(0.0, 1.0, 0.0, 1.0) else if ((!(t0#:4) && (length(
        (fragCoord#:1 - (vec2(1.0, 1.0) * size#:2)),
    ) < size#:3)) || (!(t1#:5) && (length((fragCoord#:1 - (vec2(2.0, 1.0) * size#:2))) < size#:3))) vec4(
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
    bool t0_4 = (scopeIt_36626a20(4)(6) == 10);
    bool t1_5 = (callme_c17766ce(5) == 7);
    float size_2 = (env_0.resolution.x / 20.0);
    float size_3 = (size_2 * 0.40);
    if (((t0_4 && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3)) || (t1_5 && (length(
        (fragCoord_1 - (vec2(2.0, 1.0) * size_2))
    ) < size_3)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if (((!(t0_4) && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3)) || (!(t1_5) && (length(
            (fragCoord_1 - (vec2(2.0, 1.0) * size_2))
        ) < size_3)))) {
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