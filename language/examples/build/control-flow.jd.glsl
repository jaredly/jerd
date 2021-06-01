#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform sampler2D u_buffer0;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

// skipping Eq_553b4b8e, contains type variables

struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};

/**
```
const x2#b022715c = (): int ={}> {
    const y#:1 = {
        const n#:0 = 2;
        if n#:0 + n#:0 < 3 {
            4;
        } else {
            2;
        };
    };
    y#:1 + 2 + y#:1;
}
```
*/
int x2_b022715c() {
    int y_1;
    int n_0 = 2;
    if (((n_0 + n_0) < 3)) {
        y_1 = 4;
    } else {
        y_1 = 2;
    };
    return ((y_1 + 2) + y_1);
}

/**
```
const z#526b8b52 = (n#:0: int): int ={}> {
    const m#:3 = {
        const z#:1 = n#:0 + 2;
        switch z#:1 {3 => 3, 4 => 4, 5 => 10, _#:2 => 11};
    };
    m#:3 + m#:3 * 2;
}
```
*/
int z_526b8b52(
    int n_0
) {
    int m_3;
    bool continueBlock_5 = true;
    int z_1 = (n_0 + 2);
    if ((continueBlock_5 && z_1 == 3)) {
        m_3 = 3;
        continueBlock_5 = false;
    };
    if ((continueBlock_5 && z_1 == 4)) {
        m_3 = 4;
        continueBlock_5 = false;
    };
    if ((continueBlock_5 && z_1 == 5)) {
        m_3 = 10;
        continueBlock_5 = false;
    };
    if (continueBlock_5) {
        m_3 = 11;
        continueBlock_5 = false;
    };
    return (m_3 + (m_3 * 2));
}

/**
```
const unnamed#test_main = (env#:0: GLSLEnv#451d5252, fragCoord#:1: vec2): vec4 ={}> {
    const t0#:4 = x#0992c290 ==#9275f914#553b4b8e#0 6;
    const t1#:5 = z#526b8b52(2) ==#9275f914#553b4b8e#0 12;
    const t2#:6 = x2#b022715c() ==#9275f914#553b4b8e#0 6;
    const size#:2 = env#:0.resolution#451d5252#1.x#43802a16#0 / 20.0;
    const size#:3 = size#:2 * 0.4;
    if (t0#:4 && length(fragCoord#:1 - vec2(1.0, 1.0) * size#:2) < size#:3) || (t1#:5 && length(
        fragCoord#:1 - vec2(2.0, 1.0) * size#:2,
    ) < size#:3) || (t2#:6 && length(fragCoord#:1 - vec2(3.0, 1.0) * size#:2) < size#:3) vec4(
        0.0,
        1.0,
        0.0,
        1.0,
    ) else if (!(t0#:4) && length(fragCoord#:1 - vec2(1.0, 1.0) * size#:2) < size#:3) || (!(t1#:5) && length(
        fragCoord#:1 - vec2(2.0, 1.0) * size#:2,
    ) < size#:3) || (!(t2#:6) && length(fragCoord#:1 - vec2(3.0, 1.0) * size#:2) < size#:3) vec4(
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
    int lambdaBlockResult_9;
    bool continueBlock_10 = true;
    int y_8;
    if ((continueBlock_10 && (10 < 3))) {
        y_8 = 4;
    } else {
        y_8 = 2;
    };
    if (continueBlock_10) {
        lambdaBlockResult_9 = ((y_8 + 2) + y_8);
        continueBlock_10 = false;
    };
    bool t0_4 = (lambdaBlockResult_9 == 6);
    bool t1_5 = (z_526b8b52(2) == 12);
    bool t2_6 = (x2_b022715c() == 6);
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