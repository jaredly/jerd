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

// skipping Min_5cfbbc08, contains type variables

struct Circle_44c72b50{
    vec2 h44c72b50_0;
    float h44c72b50_1;
};

// skipping As_As, contains type variables

// skipping AddSub_b99b22d8, contains type variables

/**
```
const length2#2e6a5f32: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    sqrt(((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)));
}
```
*/
float length2_2e6a5f32(
    vec2 v_0
) {
    return sqrt(((v_0.x * v_0.x) + (v_0.y * v_0.y)));
}

/**
```
const circleSDF#838b925a: (Vec2#43802a16, Circle#44c72b50) ={}> float = (
    p#:0: Vec2#43802a16,
    circle#:1: Circle#44c72b50,
) ={}> {
    (length2#2e6a5f32(AddSubVec2#70bb2056."-"#b99b22d8#1(p#:0, circle#:1.pos#44c72b50#0)) - circle#:1.r#44c72b50#1);
}
```
*/
float circleSDF_838b925a(
    vec2 p_0,
    Circle_44c72b50 circle_1
) {
    return (length2_2e6a5f32((p_0 - circle_1.h44c72b50_0)) - circle_1.h44c72b50_1);
}

/**
```
const hello#66ea94db: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
) ={}> {
    const circle#:2 = Circle#44c72b50{
        pos#44c72b50#0: env#:0.mouse#451d5252#3,
        r#44c72b50#1: (40.0 + (cos((env#:0.time#451d5252#0 * 4.0)) * 20.0)),
    };
    const color#:4 = if (Min#4e1890c8."--"#5cfbbc08#0(
        circleSDF#838b925a(fragCoord#:1, circle#:2),
        circleSDF#838b925a(
            fragCoord#:1,
            Circle#44c72b50{
                pos#44c72b50#0: AddSubVec2#70bb2056."+"#b99b22d8#0(
                    env#:0.mouse#451d5252#3,
                    Vec2#43802a16{x#43802a16#0: 10.0, y#43802a16#1: 20.0},
                ),
                r#44c72b50#1: 30.0,
            },
        ),
    ) < 0.0) {
        switch modInt(fragCoord#:1.x#43802a16#0 as#184a69ed int, 2) {
            0 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
            _#:3 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
        };
    } else {
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
    };
    Vec4#3b941378{...color#:4, w#3b941378#0: 1.0};
}
```
*/
vec4 hello_66ea94db(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    vec3 color_4;
    bool continueBlock_6 = true;
    if ((min(
        circleSDF_838b925a(
            fragCoord_1,
            Circle_44c72b50(env_0.mouse, (40.0 + (cos((env_0.time * 4.0)) * 20.0)))
        ),
        circleSDF_838b925a(fragCoord_1, Circle_44c72b50((env_0.mouse + vec2(10.0, 20.0)), 30.0))
    ) < 0.0)) {
        if ((int(fragCoord_1.x) % 2) == 0) {
            color_4 = vec3(1.0, 0.0, 0.0);
            continueBlock_6 = false;
        };
        if (continueBlock_6) {
            color_4 = vec3(1.0, 1.0, 0.0);
            continueBlock_6 = false;
        };
    } else {
        color_4 = vec3(1.0, 1.0, 1.0);
        continueBlock_6 = false;
    };
    return vec4(color_4.x, color_4.y, color_4.z, 1.0);
}

void main() {
    fragColor = hello_66ea94db(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}