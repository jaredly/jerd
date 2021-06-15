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
const unnamed#e8d2ec00 = superSample#65753cd2(
    sdf: marchNormals#78ed8034(
        sceneSDF: (pos#:0: Vec3#9f1c0644): float#builtin ={}> length#63e16b7a(v: pos#:0),
    ),
)
```
*/
vec4 unnamed_e8d2ec00(
    vec2 arg0_1
) {
    return lambda-woops(sdf){
        lambda-woops(coord){
            return sdf(coord);
        };
    }(arg0_1);
}

void main() {
    fragColor = unnamed_e8d2ec00(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}