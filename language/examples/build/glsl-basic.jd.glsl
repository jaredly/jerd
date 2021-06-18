#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

// skipping As_As, contains type variables

// skipping Min_0c2608f2, contains type variables

struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};

// skipping AddSub_b99b22d8, contains type variables

struct Circle_23c98f91{
    vec2 h23c98f91_0;
    float h23c98f91_1;
};

/**
```
const circleSDF#596bb3b4 = (p#:0: Vec2#43802a16, circle#:1: Circle#23c98f91): float#builtin ={}> {
    length#c2805852(v: p#:0 -#70bb2056#b99b22d8#1 circle#:1.pos#23c98f91#0) 
        -#builtin circle#:1.r#23c98f91#1;
}
```
*/
float circleSDF_596bb3b4(
    vec2 p_0,
    Circle_23c98f91 circle_1
) {
    return (length((p_0 - circle_1.h23c98f91_0)) - circle_1.h23c98f91_1);
}

/**
```
const hello#ac281138 = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const circle#:2 = Circle#23c98f91{
        pos#23c98f91#0: env#:0.mouse#451d5252#3,
        r#23c98f91#1: 40.0 
            +#builtin cos#builtin(env#:0.time#451d5252#0 *#builtin 4.0) *#builtin 20.0,
    };
    const color#:4 = if circleSDF#596bb3b4(p: fragCoord#:1, circle#:2) 
            --#a42728cc#0c2608f2#0 circleSDF#596bb3b4(
                p: fragCoord#:1,
                circle: Circle#23c98f91{
                    pos#23c98f91#0: env#:0.mouse#451d5252#3 
                        +#70bb2056#b99b22d8#0 Vec2#43802a16{
                            x#43802a16#0: 10.0,
                            y#43802a16#1: 20.0,
                        },
                    r#23c98f91#1: 30.0,
                },
            ) 
        <#builtin 0.0 {
        switch modInt#builtin(fragCoord#:1.x#43802a16#0 as#184a69ed int#builtin, 2) {
            0 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
            _#:3 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
        };
    } else {
        abs#1a074578(v: Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: -1.0});
    };
    Vec4#3b941378{...color#:4, w#3b941378#0: 1.0};
}
```
*/
vec4 hello_ac281138(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    vec3 color;
    if ((min(
        circleSDF_596bb3b4(
            fragCoord_1,
            Circle_23c98f91(env_0.mouse, (40.0 + (cos((env_0.time * 4.0)) * 20.0)))
        ),
        circleSDF_596bb3b4(fragCoord_1, Circle_23c98f91((env_0.mouse + vec2(10.0, 20.0)), 30.0))
    ) < 0.0)) {
        bool continueBlock = true;
        if ((int(fragCoord_1.x) % 2) == 0) {
            color = vec3(1.0, 0.0, 0.0);
            continueBlock = false;
        };
        if (continueBlock) {
            color = vec3(1.0, 1.0, 0.0);
            continueBlock = false;
        };
    } else {
        color = abs(vec3(1.0, 1.0, -1.0));
    };
    return vec4(color.x, color.y, color.z, 1.0);
}

void main() {
    fragColor = hello_ac281138(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}