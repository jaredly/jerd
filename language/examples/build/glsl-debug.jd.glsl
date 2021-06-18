#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

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
vec4 m_lambda_f467f07a(GLSLEnv_451d5252 env_5, vec2 pos_6) {
    return ((sdf_4(env_5, pos_6) + sdf_4(env_5, (pos_6 + vec2(0.0, 0.50)))) / 2.0);
}

/**
```
const m#3c4200ce = superSample#7fbe027c(
    sdf: marchNormals#3a9d3bbb(
        sdf: (env#:0: GLSLEnv#451d5252, pos#:1: Vec3#9f1c0644): float#builtin ={}> length#63e16b7a(
                v: pos#:1,
            ) 
            -#builtin 0.5,
    ),
)
```
*/
vec4 m_3c4200ce(
    GLSLEnv_451d5252 arg0_2,
    vec2 arg1_3
) {
    return m_lambda_f467f07a(arg0_2, arg1_3);
}

void main() {
    fragColor = m_3c4200ce(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}