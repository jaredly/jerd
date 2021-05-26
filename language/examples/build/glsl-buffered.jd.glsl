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

// skipping Div_5ac12902, contains type variables

// skipping AddSub_b99b22d8, contains type variables

/**
```
const isLive#5df4f34f: (Vec4#3b941378) ={}> bool = (color#:0: Vec4#3b941378) ={}> (color#:0.x#43802a16#0 > 0.5)
```
*/
bool isLive_5df4f34f(
    vec4 color_0
) {
    return (color_0.x > 0.50);
}

/**
```
const neighbor#821c67e8: (Vec2#43802a16, Vec2#43802a16, Vec2#43802a16, sampler2D) ={}> int = (
    offset#:0: Vec2#43802a16,
    coord#:1: Vec2#43802a16,
    res#:2: Vec2#43802a16,
    buffer#:3: sampler2D,
) ={}> {
    const coord#:4 = AddSubVec2#70bb2056."+"#b99b22d8#0(coord#:1, offset#:0);
    if isLive#5df4f34f(texture(buffer#:3, MulVec2#090f77e7."/"#5ac12902#0(coord#:4, res#:2))) {
        1;
    } else {
        0;
    };
}
```
*/
int neighbor_821c67e8(
    vec2 offset_0,
    vec2 coord_1,
    vec2 res_2,
    sampler2D buffer_3
) {
    if (isLive_5df4f34f(texture(buffer_3, ((coord_1 + offset_0) / res_2)))) {
        return 1;
    } else {
        return 0;
    };
}

/**
```
const dot#369652bb: (Vec2#43802a16, Vec2#43802a16) ={}> float = (
    a#:0: Vec2#43802a16,
    b#:1: Vec2#43802a16,
) ={}> {
    ((a#:0.x#43802a16#0 * b#:1.x#43802a16#0) + (a#:0.y#43802a16#1 * b#:1.y#43802a16#1));
}
```
*/
float dot_369652bb(
    vec2 a_0,
    vec2 b_1
) {
    return ((a_0.x * b_1.x) + (a_0.y * b_1.y));
}

/**
```
const fract#495c4d22: (float) ={}> float = (v#:0: float) ={}> (v#:0 - floor(v#:0))
```
*/
float fract_495c4d22(
    float v_0
) {
    return (v_0 - floor(v_0));
}

/**
```
const countNeighbors#77a447bc: (Vec2#43802a16, Vec2#43802a16, sampler2D) ={}> int = (
    coord#:0: Vec2#43802a16,
    res#:1: Vec2#43802a16,
    buffer#:2: sampler2D,
) ={}> {
    (((((((neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: 0.0},
        coord#:0,
        res#:1,
        buffer#:2,
    ) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: 1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: -1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: 0.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: 1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: -1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: 1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: -1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    ));
}
```
*/
int countNeighbors_77a447bc(
    vec2 coord_0,
    vec2 res_1,
    sampler2D buffer_2
) {
    return (((((((neighbor_821c67e8(vec2(-1.0, 0.0), coord_0, res_1, buffer_2) + neighbor_821c67e8(
        vec2(-1.0, 1.0),
        coord_0,
        res_1,
        buffer_2
    )) + neighbor_821c67e8(vec2(-1.0, -1.0), coord_0, res_1, buffer_2)) + neighbor_821c67e8(
        vec2(1.0, 0.0),
        coord_0,
        res_1,
        buffer_2
    )) + neighbor_821c67e8(vec2(1.0, 1.0), coord_0, res_1, buffer_2)) + neighbor_821c67e8(
        vec2(1.0, -1.0),
        coord_0,
        res_1,
        buffer_2
    )) + neighbor_821c67e8(vec2(0.0, 1.0), coord_0, res_1, buffer_2)) + neighbor_821c67e8(
        vec2(0.0, -1.0),
        coord_0,
        res_1,
        buffer_2
    ));
}

/**
```
const random#347089ef: (Vec2#43802a16) ={}> float = (st#:0: Vec2#43802a16) ={}> {
    fract#495c4d22(
        (sin(dot#369652bb(st#:0, Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233})) * 43758.5453123),
    );
}
```
*/
float random_347089ef(
    vec2 st_0
) {
    return fract_495c4d22((sin(dot_369652bb(st_0, vec2(12.98980, 78.2330))) * 43758.54531));
}

/**
```
const length#c2805852: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> sqrt(
    ((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)),
)
```
*/
float length_c2805852(
    vec2 v_0
) {
    return sqrt(((v_0.x * v_0.x) + (v_0.y * v_0.y)));
}

/**
```
const drawToBuffer#5af2137f: (GLSLEnv#451d5252, Vec2#43802a16, sampler2D) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D,
) ={}> {
    if (env#:0.time#451d5252#0 < 0.01) {
        if (random#347089ef(
            MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
        ) > 0.95) {
            live#59488bde;
        } else {
            dead#b12c041e;
        };
    } else {
        const self#:3 = isLive#5df4f34f(
            texture(
                buffer#:2,
                MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
            ),
        );
        const neighbors#:4 = countNeighbors#77a447bc(
            fragCoord#:1,
            env#:0.resolution#451d5252#1,
            buffer#:2,
        );
        if ((self#:3 && IntEq#9275f914."=="#553b4b8e#0(neighbors#:4, 2)) || IntEq#9275f914."=="#553b4b8e#0(
            neighbors#:4,
            3,
        )) {
            live#59488bde;
        } else {
            dead#b12c041e;
        };
    };
}
```
*/
vec4 drawToBuffer_5af2137f(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1,
    sampler2D buffer_2
) {
    if ((env_0.time < 0.010)) {
        if ((random_347089ef((fragCoord_1 / env_0.resolution)) > 0.950)) {
            return vec4(1.0, 0.60, 1.0, 1.0);
        } else {
            return vec4(0.0, 0.0, 0.0, 1.0);
        };
    } else {
        int neighbors_4 = countNeighbors_77a447bc(fragCoord_1, env_0.resolution, buffer_2);
        if (((isLive_5df4f34f(texture(buffer_2, (fragCoord_1 / env_0.resolution))) && (neighbors_4 == 2)) || (neighbors_4 == 3))) {
            return vec4(1.0, 0.60, 1.0, 1.0);
        } else {
            return vec4(0.0, 0.0, 0.0, 1.0);
        };
    };
}

/**
```
const drawToScreen#5349442c: (GLSLEnv#451d5252, Vec2#43802a16, sampler2D) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer0#:2: sampler2D,
) ={}> {
    const diff#:3 = AddSubVec2#70bb2056."-"#b99b22d8#1(env#:0.mouse#451d5252#3, fragCoord#:1);
    if (length#c2805852(diff#:3) < 250.0) {
        const newCoord#:4 = AddSubVec2#70bb2056."-"#b99b22d8#1(
            env#:0.mouse#451d5252#3,
            ScaleVec2Rev#afc24bbe."/"#5ac12902#0(diff#:3, 4.0),
        );
        texture(
            buffer0#:2,
            MulVec2#090f77e7."/"#5ac12902#0(newCoord#:4, env#:0.resolution#451d5252#1),
        );
    } else {
        texture(
            buffer0#:2,
            MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
        );
    };
}
```
*/
vec4 drawToScreen_5349442c(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1,
    sampler2D buffer0_2
) {
    vec2 diff_3 = (env_0.mouse - fragCoord_1);
    if ((length_c2805852(diff_3) < 250.0)) {
        return texture(buffer0_2, ((env_0.mouse - (diff_3 / 4.0)) / env_0.resolution));
    } else {
        return texture(buffer0_2, (fragCoord_1 / env_0.resolution));
    };
}

#if defined(BUFFER_0)

void main() {
    fragColor = drawToBuffer_5af2137f(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy,
        u_buffer0
    );
}

#else

void main() {
    fragColor = drawToScreen_5349442c(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy,
        u_buffer0
    );
}

#endif
