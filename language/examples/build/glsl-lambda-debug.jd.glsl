#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

/**
```
const callIt#384c60bc = (sceneSDF#:0: (Vec3#9f1c0644) ={}> float#builtin, eye#:1: Vec3#9f1c0644): float#builtin ={}> {
    sceneSDF#:0(eye#:1);
}
```
*/
float callIt_384c60bc(
    invalid_lambda sceneSDF_0,
    vec3 eye_1
) {
    return sceneSDF_0(eye_1);
}

/**
```
const estimateNormal#11a35a34 = (sceneSDF#:0: (Vec3#9f1c0644) ={}> float#builtin): Vec3#9f1c0644 ={}> vec3#dc78826c(
    x: sceneSDF#:0(vec3#dc78826c(x: 0.0)),
)
```
*/
vec3 estimateNormal_11a35a34(
    invalid_lambda sceneSDF_0
) {
    return vec3(sceneSDF_0(vec3(0.0)));
}

/* -- generated -- */
vec4 unnamed_lambda_4394a4d0(vec2 coord_6) {
    return vec4(estimateNormal_11a35a34(sceneSDF_5), callIt_384c60bc(sceneSDF_5, vec3(0.0)));
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
    return unnamed_lambda_4394a4d0(coord_3);
}

void main() {
    fragColor = unnamed_e8d2ec00(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}