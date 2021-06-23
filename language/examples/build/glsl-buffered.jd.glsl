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
const isLive#5df4f34f = (color#:0: Vec4#3b941378): bool#builtin ={}> color#:0.x#43802a16#0 
    >#builtin 0.5
```
*/
bool isLive_5df4f34f(
    vec4 color_0
) {
    return (color_0.x > 0.50);
}

/**
```
const neighbor#821c67e8 = (
    offset#:0: Vec2#43802a16,
    coord#:1: Vec2#43802a16,
    res#:2: Vec2#43802a16,
    buffer#:3: sampler2D#builtin,
): int#builtin ={}> {
    const coord#:4 = coord#:1 +#70bb2056#b99b22d8#0 offset#:0;
    if isLive#5df4f34f(color: texture#builtin(buffer#:3, coord#:4 /#090f77e7#5ac12902#0 res#:2)) {
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
const countNeighbors#77a447bc = (
    coord#:0: Vec2#43802a16,
    res#:1: Vec2#43802a16,
    buffer#:2: sampler2D#builtin,
): int#builtin ={}> {
    neighbor#821c67e8(
                                    offset: Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: 0.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                                +#builtin neighbor#821c67e8(
                                    offset: Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: 1.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                            +#builtin neighbor#821c67e8(
                                offset: Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: -1.0},
                                coord#:0,
                                res#:1,
                                buffer#:2,
                            ) 
                        +#builtin neighbor#821c67e8(
                            offset: Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: 0.0},
                            coord#:0,
                            res#:1,
                            buffer#:2,
                        ) 
                    +#builtin neighbor#821c67e8(
                        offset: Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: 1.0},
                        coord#:0,
                        res#:1,
                        buffer#:2,
                    ) 
                +#builtin neighbor#821c67e8(
                    offset: Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: -1.0},
                    coord#:0,
                    res#:1,
                    buffer#:2,
                ) 
            +#builtin neighbor#821c67e8(
                offset: Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: 1.0},
                coord#:0,
                res#:1,
                buffer#:2,
            ) 
        +#builtin neighbor#821c67e8(
            offset: Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: -1.0},
            coord#:0,
            res#:1,
            buffer#:2,
        );
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
const random#347089ef = (st#:0: Vec2#43802a16): float#builtin ={}> {
    fract#495c4d22(
        v: sin#builtin(
                dot#369652bb(
                    a: st#:0,
                    b: Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
```
*/
float random_347089ef(
    vec2 st_0
) {
    return fract((sin(dot(st_0, vec2(12.98980, 78.2330))) * 43758.54531));
}

/**
```
const drawToBuffer#5af2137f = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    if env#:0.time#451d5252#0 <#builtin 0.01 {
        if random#347089ef(st: fragCoord#:1 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1) 
            >#builtin 0.95 {
            live#59488bde;
        } else {
            dead#b12c041e;
        };
    } else {
        const self#:3 = isLive#5df4f34f(
            color: texture#builtin(
                buffer#:2,
                fragCoord#:1 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1,
            ),
        );
        const neighbors#:4 = countNeighbors#77a447bc(
            coord: fragCoord#:1,
            res: env#:0.resolution#451d5252#1,
            buffer#:2,
        );
        if (self#:3 &&#builtin neighbors#:4 ==#9275f914#553b4b8e#0 2) 
            ||#builtin neighbors#:4 ==#9275f914#553b4b8e#0 3 {
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
        int neighbors = countNeighbors_77a447bc(fragCoord_1, env_0.resolution, buffer_2);
        if (((isLive_5df4f34f(texture(buffer_2, (fragCoord_1 / env_0.resolution))) && (neighbors == 2)) || (neighbors == 3))) {
            return vec4(1.0, 0.60, 1.0, 1.0);
        } else {
            return vec4(0.0, 0.0, 0.0, 1.0);
        };
    };
}

/**
```
const drawToScreen#5349442c = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer0#:2: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    const diff#:3 = env#:0.mouse#451d5252#3 -#70bb2056#b99b22d8#1 fragCoord#:1;
    if length#c2805852(v: diff#:3) <#builtin 250.0 {
        const newCoord#:4 = env#:0.mouse#451d5252#3 
            -#70bb2056#b99b22d8#1 diff#:3 /#afc24bbe#5ac12902#0 4.0;
        texture#builtin(buffer0#:2, newCoord#:4 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1);
    } else {
        texture#builtin(buffer0#:2, fragCoord#:1 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1);
    };
}
```
*/
vec4 drawToScreen_5349442c(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1,
    sampler2D buffer0_2
) {
    vec2 diff = (env_0.mouse - fragCoord_1);
    if ((length(diff) < 250.0)) {
        return texture(buffer0_2, ((env_0.mouse - (diff / 4.0)) / env_0.resolution));
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
