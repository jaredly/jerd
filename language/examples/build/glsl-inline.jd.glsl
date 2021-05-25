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

/* -- generated -- */
int V7ff373d8(int n_0) {
    return (n_0 + 3);
}

/**
```
const h#15ece66a: (int) ={}> int = (m#:0: int) ={}> (m#:0 - 2)
```
*/
int h_15ece66a(
    int m_0
) {
    return (m_0 - 2);
}

/**
```
const z#f4c397d2: (int) ={}> int = (m#:0: int) ={}> (m#:0 + 2)
```
*/
int z_f4c397d2(
    int m_0
) {
    return (m_0 + 2);
}

/* -- generated -- */
int yy_14f3fa5c(int z_1, int b_2) {
    return V7ff373d8((z_1 + b_2));
}

/* -- generated -- */
int yy_656979cc(int z_1, int b_2) {
    return h_15ece66a((z_1 + b_2));
}

/* -- generated -- */
int yy_26f2ed3c(int z_1, int b_2) {
    return z_f4c397d2((z_1 + b_2));
}

/* -- generated -- */
int y_a053e7fe(int v_1) {
    return yy_14f3fa5c(V7ff373d8((v_1 * 2)), 5);
}

/* -- generated -- */
int y_210b82d0(int v_1) {
    return yy_656979cc(h_15ece66a((v_1 * 2)), 5);
}

/* -- generated -- */
int y_22df04e0(int v_1) {
    return yy_26f2ed3c(z_f4c397d2((v_1 * 2)), 5);
}

/**
```
const unnamed#test_main: (GLSLEnv#451d5252, vec2) ={}> vec4 = (
    env#:1: GLSLEnv#451d5252,
    fragCoord#:2: vec2,
) ={}> {
    const t0#:5 = IntEq#9275f914."=="#553b4b8e#0(y#7df35068(z#f4c397d2, 30), (((60 + 2) + 5) + 2));
    const t1#:6 = IntEq#9275f914."=="#553b4b8e#0(y#7df35068(h#15ece66a, 30), (((60 - 2) + 5) - 2));
    const t2#:7 = IntEq#9275f914."=="#553b4b8e#0(
        y#7df35068((n#:0: int) ={}> (n#:0 + 3), 30),
        ((60 + 5) + 6),
    );
    const size#:3 = (env#:1.resolution#451d5252#1.x#43802a16#0 / 20.0);
    const size#:4 = (size#:3 * 0.4);
    if (((t0#:5 && (length((fragCoord#:2 - (vec2(1.0, 1.0) * size#:3))) < size#:4)) || (t1#:6 && (length(
        (fragCoord#:2 - (vec2(2.0, 1.0) * size#:3)),
    ) < size#:4))) || (t2#:7 && (length((fragCoord#:2 - (vec2(3.0, 1.0) * size#:3))) < size#:4))) vec4(
        0.0,
        1.0,
        0.0,
        1.0,
    ) else if (((!(t0#:5) && (length((fragCoord#:2 - (vec2(1.0, 1.0) * size#:3))) < size#:4)) || (!(
        t1#:6,
    ) && (length((fragCoord#:2 - (vec2(2.0, 1.0) * size#:3))) < size#:4))) || (!(t2#:7) && (length(
        (fragCoord#:2 - (vec2(3.0, 1.0) * size#:3)),
    ) < size#:4))) vec4(1.0, 0.0, 0.0, 1.0) else vec4(1.0, 1.0, 1.0, 1.0);
}
```
*/
vec4 Vtest_main(
    GLSLEnv_451d5252 env_1,
    vec2 fragCoord_2
) {
    bool t0_5 = (y_22df04e0(30) == (((60 + 2) + 5) + 2));
    bool t1_6 = (y_210b82d0(30) == (((60 - 2) + 5) - 2));
    bool t2_7 = (y_a053e7fe(30) == ((60 + 5) + 6));
    float size_3 = (env_1.resolution.x / 20.0);
    float size_4 = (size_3 * 0.40);
    if ((((t0_5 && (length((fragCoord_2 - (vec2(1.0, 1.0) * size_3))) < size_4)) || (t1_6 && (length(
        (fragCoord_2 - (vec2(2.0, 1.0) * size_3))
    ) < size_4))) || (t2_7 && (length((fragCoord_2 - (vec2(3.0, 1.0) * size_3))) < size_4)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if ((((!(t0_5) && (length((fragCoord_2 - (vec2(1.0, 1.0) * size_3))) < size_4)) || (!(t1_6) && (length(
            (fragCoord_2 - (vec2(2.0, 1.0) * size_3))
        ) < size_4))) || (!(t2_7) && (length((fragCoord_2 - (vec2(3.0, 1.0) * size_3))) < size_4)))) {
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