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

// skipping Min_0c2608f2, contains type variables

struct Circle_23c98f91{
    vec2 h23c98f91_0;
    float h23c98f91_1;
};

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
const circleSDF#39fb69e2: (Vec2#43802a16, Circle#23c98f91) ={}> float = (
    p#:0: Vec2#43802a16,
    circle#:1: Circle#23c98f91,
) ={}> {
    (length2#2e6a5f32(AddSubVec2#70bb2056."-"#b99b22d8#1(p#:0, circle#:1.pos#23c98f91#0)) - circle#:1.r#23c98f91#1);
}
```
*/
float circleSDF_39fb69e2(
    vec2 p_0,
    Circle_23c98f91 circle_1
) {
    return (length2_2e6a5f32((p_0 - circle_1.h23c98f91_0)) - circle_1.h23c98f91_1);
}

/**
```
const hello#5c16a7c5: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
) ={}> {
    const circle#:2 = Circle#23c98f91{
        pos#23c98f91#0: env#:0.mouse#451d5252#3,
        r#23c98f91#1: (40.0 + (cos((env#:0.time#451d5252#0 * 4.0)) * 20.0)),
    };
    const color#:3 = if (Min#a42728cc."--"#0c2608f2#0(
        circleSDF#39fb69e2(fragCoord#:1, circle#:2),
        circleSDF#39fb69e2(
            fragCoord#:1,
            Circle#23c98f91{
                pos#23c98f91#0: AddSubVec2#70bb2056."+"#b99b22d8#0(
                    env#:0.mouse#451d5252#3,
                    Vec2#43802a16{x#43802a16#0: 10.0, y#43802a16#1: 20.0},
                ),
                r#23c98f91#1: 30.0,
            },
        ),
    ) < 0.0) {
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0};
    } else {
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
    };
    Vec4#3b941378{...color#:3, w#3b941378#0: 1.0};
}
```
*/
vec4 hello_5c16a7c5(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    vec3 color_3;
    if ((min(
        circleSDF_39fb69e2(
            fragCoord_1,
            Circle_23c98f91(env_0.mouse, (40.0 + (cos((env_0.time * 4.0)) * 20.0)))
        ),
        circleSDF_39fb69e2(fragCoord_1, Circle_23c98f91((env_0.mouse + vec2(10.0, 20.0)), 30.0))
    ) < 0.0)) {
        color_3 = vec3(1.0, 0.0, 0.0);
    } else {
        color_3 = vec3(1.0, 1.0, 1.0);
    };
    return vec4(color_3.x, color_3.y, color_3.z, 1.0);
}

void main() {
    fragColor = hello_5c16a7c5(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}