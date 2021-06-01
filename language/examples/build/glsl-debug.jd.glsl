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

/* -- generated -- */
float V7c4de6f0(float m_0) {
    return (m_0 / 2.0);
}

/* -- generated -- */
float inner_8288bc4c() {
    float m_1 = (2.0 + 3.0);
    return V7c4de6f0((10.0 + (m_1 * m_1)));
}

/**
```
const z#f619aa18 = outer#6cf560da((m#:0: float): float ={}> m#:0 / 2.0, true)
```
*/
vec4 z_f619aa18(
    GLSLEnv_451d5252 env_7,
    vec2 p_8
) {
    float z_9 = (p_8.x + p_8.y);
    return vec4(inner_8288bc4c(), p_8.y, z_9, z_9);
}

void main() {
    fragColor = z_f619aa18(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}