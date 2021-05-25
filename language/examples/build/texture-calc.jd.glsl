#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform sampler2D u_buffer0;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

// skipping Div_5ac12902, contains type variables

/**
```
const pendulum#2d222162: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644, sampler2D) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
    buffer#:4: sampler2D,
) ={}> {
    if (iTime#:0 < 0.1) {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 0.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        const current#:5 = texture(
            buffer#:4,
            MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, iResolution#:2),
        );
        Vec4#3b941378{...current#:5, x#43802a16#0: (current#:5.x#43802a16#0 + 0.00001)};
    };
}
```
*/
vec4 pendulum_2d222162(
    float iTime_0,
    vec2 fragCoord_1,
    vec2 iResolution_2,
    vec3 uCamera_3,
    sampler2D buffer_4
) {
    if ((iTime_0 < 0.10)) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        vec4 current_5 = texture(buffer_4, (fragCoord_1 / iResolution_2));
        return vec4((current_5.x + 0.00001), current_5.y, current_5.z, current_5.w);
    };
}

/**
```
const main#3a366a4a: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644, sampler2D) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
    buffer#:4: sampler2D,
) ={}> {
    texture(buffer#:4, MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, iResolution#:2));
}
```
*/
vec4 main_3a366a4a(
    float iTime_0,
    vec2 fragCoord_1,
    vec2 iResolution_2,
    vec3 uCamera_3,
    sampler2D buffer_4
) {
    return texture(buffer_4, (fragCoord_1 / iResolution_2));
}

#if defined(BUFFER_0)

void main() {
    fragColor = pendulum_2d222162(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy,
        u_buffer0
    );
}

#else

void main() {
    fragColor = main_3a366a4a(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy,
        u_buffer0
    );
}

#endif
