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
float m_lambda_7c39d44b(GLSLEnv_451d5252 env_0, vec3 pos_1) {
    return (length(pos_1) - 0.50);
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
    GLSLEnv_451d5252 arg0_9,
    vec2 arg1_10
) {
    GLSLEnv_451d5252 env = arg0_9;
    vec2 pos = arg1_10;
    vec4 lambdaBlockResult;
    if ((m_lambda_7c39d44b(env, vec3((pos + vec2(0.0, 0.50)), 0.0)) > m_lambda_7c39d44b(
        env,
        vec3((pos + vec2(0.0, 0.50)), 1.0)
    ))) {
        lambdaBlockResult = vec4(0.0);
    } else {
        lambdaBlockResult = vec4(1.0);
    };
    vec4 lambdaBlockResult_19;
    if ((m_lambda_7c39d44b(env, vec3(pos, 0.0)) > m_lambda_7c39d44b(env, vec3(pos, 1.0)))) {
        lambdaBlockResult_19 = vec4(0.0);
    } else {
        lambdaBlockResult_19 = vec4(1.0);
    };
    return ((lambdaBlockResult_19 + lambdaBlockResult) / 2.0);
}

void main() {
    fragColor = m_3c4200ce(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}