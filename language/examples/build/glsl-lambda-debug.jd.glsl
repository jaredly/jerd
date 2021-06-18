#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

/* -- generated -- */
float unnamed_lambda_041ad038(vec3 pos_0) {
    return length(pos_0);
}

/* -- generated -- */
float callIt_specialization_2f32b102(vec3 eye_1) {
    return unnamed_lambda_041ad038(eye_1);
}

/* -- generated -- */
vec3 estimateNormal_specialization_49157882() {
    return vec3(unnamed_lambda_041ad038(vec3(0.0)));
}

/**
```
const unnamed#e8d2ec00 = superSample#65753cd2(
    sdf: marchNormals#78ed8034(
        sceneSDF: (pos#:0: Vec3#9f1c0644): float#builtin ={}> length#63e16b7a(v: pos#:0),
    ),
)
```
*/
vec4 unnamed_e8d2ec00(
    vec2 coord_3
) {
    return vec4(estimateNormal_specialization_49157882(), callIt_specialization_2f32b102(vec3(0.0)));
}

void main() {
    fragColor = unnamed_e8d2ec00(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}