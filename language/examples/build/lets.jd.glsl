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
const fib#ac346fbc: (int, int, int) ={}> int = (prev#:0: int, cur#:1: int, n#:2: int) ={}> if IntEq#9275f914."=="#553b4b8e#0(
    n#:2,
    0,
) {
    prev#:0;
} else {
    ac346fbc(cur#:1, (prev#:0 + cur#:1), (n#:2 - 1));
}
```
*/
int fib_ac346fbc(
    int prev_0,
    int cur_1,
    int n_2
) {
    for (int i=0; i<10000; i++) {
        if ((n_2 == 0)) {
            return prev_0;
        } else {
            int recur_4 = (prev_0 + cur_1);
            prev_0 = cur_1;
            cur_1 = recur_4;
            n_2 = (n_2 - 1);
            continue;
        };
    };
}

/**
```
const z#ce5d9b4c: (int) ={}> int = (n#:0: int) ={}> {
    const m#:1 = (n#:0 + 2);
    (m#:1 - 1);
}
```
*/
int z_ce5d9b4c(
    int n_0
) {
    return ((n_0 + 2) - 1);
}

/* -- generated -- */
int V4f4fbbd4() {
    return 10;
}

/**
```
const unnamed#test_main: (GLSLEnv#451d5252, vec2) ={}> vec4 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: vec2,
) ={}> {
    const t0#:4 = IntEq#9275f914."=="#553b4b8e#0(x#0c634e04, 10);
    const t1#:5 = IntEq#9275f914."=="#553b4b8e#0(z#ce5d9b4c(10), 11);
    const t2#:6 = IntEq#9275f914."=="#553b4b8e#0(fib#ac346fbc(0, 1, 10), 55);
    const size#:2 = (env#:0.resolution#451d5252#1.x#43802a16#0 / 20.0);
    const size#:3 = (size#:2 * 0.4);
    if (((t0#:4 && (length((fragCoord#:1 - (vec2(1.0, 1.0) * size#:2))) < size#:3)) || (t1#:5 && (length(
        (fragCoord#:1 - (vec2(2.0, 1.0) * size#:2)),
    ) < size#:3))) || (t2#:6 && (length((fragCoord#:1 - (vec2(3.0, 1.0) * size#:2))) < size#:3))) vec4(
        0.0,
        1.0,
        0.0,
        1.0,
    ) else if (((!(t0#:4) && (length((fragCoord#:1 - (vec2(1.0, 1.0) * size#:2))) < size#:3)) || (!(
        t1#:5,
    ) && (length((fragCoord#:1 - (vec2(2.0, 1.0) * size#:2))) < size#:3))) || (!(t2#:6) && (length(
        (fragCoord#:1 - (vec2(3.0, 1.0) * size#:2)),
    ) < size#:3))) vec4(1.0, 0.0, 0.0, 1.0) else vec4(1.0, 1.0, 1.0, 1.0);
}
```
*/
vec4 Vtest_main(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    bool t0_4 = (V4f4fbbd4() == 10);
    bool t1_5 = (z_ce5d9b4c(10) == 11);
    bool t2_6 = (fib_ac346fbc(0, 1, 10) == 55);
    float size_2 = (env_0.resolution.x / 20.0);
    float size_3 = (size_2 * 0.40);
    if ((((t0_4 && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3)) || (t1_5 && (length(
        (fragCoord_1 - (vec2(2.0, 1.0) * size_2))
    ) < size_3))) || (t2_6 && (length((fragCoord_1 - (vec2(3.0, 1.0) * size_2))) < size_3)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if ((((!(t0_4) && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3)) || (!(t1_5) && (length(
            (fragCoord_1 - (vec2(2.0, 1.0) * size_2))
        ) < size_3))) || (!(t2_6) && (length((fragCoord_1 - (vec2(3.0, 1.0) * size_2))) < size_3)))) {
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