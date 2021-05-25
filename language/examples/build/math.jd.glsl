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
const within#004be9c0: (float, float, float) ={}> bool = (
    found#:0: float,
    expected#:1: float,
    margin#:2: float,
) ={}> {
    if ((found#:0 - margin#:2) < expected#:1) {
        ((found#:0 + margin#:2) > expected#:1);
    } else {
        false;
    };
}
```
*/
bool within_004be9c0(
    float found_0,
    float expected_1,
    float margin_2
) {
    if (((found_0 - margin_2) < expected_1)) {
        return ((found_0 + margin_2) > expected_1);
    } else {
        return nope_term_boolean;
    };
}

/**
```
const unnamed#test_main: (GLSLEnv#451d5252, vec2) ={}> vec4 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: vec2,
) ={}> {
    const t0#:4 = FloatEq#c41f7386."=="#553b4b8e#0(sqrt(4.0), 2.0);
    const t1#:5 = within#004be9c0(sin(PI), 0.0, 0.0001);
    const t2#:6 = IntEq#9275f914."=="#553b4b8e#0(floatToInt(2.3), 2);
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
    bool t0_4 = (sqrt(4.0) == 2.0);
    bool t1_5 = within_004be9c0(sin(PI), 0.0, 0.00010);
    bool t2_6 = (floatToInt(2.30) == 2);
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