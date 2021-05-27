#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform sampler2D u_buffer0;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

// skipping Ord_2d895d64, contains type variables

/**
```
const goToTown#6da4831a: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    pos#:1: Vec2#43802a16,
) ={}> {
    vec4#b00b79a0(
        if Vec2Ord#3233d904."<"#2d895d64#0(pos#:1, vec2#54a9f2ef(10.0, 50.0)) {
            vec3#18cdf03e(1.0, 0.0, 0.0);
        } else {
            if (pos#:1.x#43802a16#0 < 20.0) {
                vec3#18cdf03e(1.0, 1.0, 0.0);
            } else {
                vec3#18cdf03e(0.0, 0.0, 0.0);
            };
        },
        1.0,
    );
}
```
*/
vec4 goToTown_6da4831a(
    GLSLEnv_451d5252 env_0,
    vec2 pos_1
) {
    return vec4(
        lambda-woops(){
            if ((pos_1 < vec2(10.0, 50.0))) {
                return vec3(1.0, 0.0, 0.0);
            } else {
                if ((pos_1.x < 20.0)) {
                    return vec3(1.0, 1.0, 0.0);
                } else {
                    return vec3(0.0, 0.0, 0.0);
                };
            };
        }(),
        1.0
    );
}

void main() {
    fragColor = goToTown_6da4831a(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}