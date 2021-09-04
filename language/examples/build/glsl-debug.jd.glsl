#version 300 es
precision mediump float;
out vec4 fragColor;
const float PI = 3.14159;
uniform float u_time;
uniform vec2 u_mouse;
uniform int u_mousebutton;
uniform vec3 u_camera;
uniform vec2 u_resolution;
struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};
/* -- generated -- */
/* (env#:0: GLSLEnv#🕷️⚓😣😃, pos#:1: Vec3#🐬): float => length(pos#:1) - 0.5 */
float m_lambda_0b97ae6b(GLSLEnv_451d5252 env_0, vec3 pos_1) {
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
/* (
    arg0#:11: GLSLEnv#🕷️⚓😣😃,
    arg1#:12: Vec2#🐭😉😵😃,
): Vec4#🕒🧑‍🏫🎃 => {
    const result#:13: Vec4#🕒🧑‍🏫🎃;
    if m_lambda#🍂👣🦿(arg0#:11, vec3(arg1#:12, 0)) > m_lambda#🍂👣🦿(arg0#:11, vec3(arg1#:12, 1)) {
        result#:13 = vec4(0);
    } else {
        result#:13 = vec4(1);
    };
    const pos#:10: Vec2#🐭😉😵😃 = arg1#:12 + vec2(0, 0.5);
    const result#:15: Vec4#🕒🧑‍🏫🎃;
    if m_lambda#🍂👣🦿(arg0#:11, vec3(pos#:10, 0)) > m_lambda#🍂👣🦿(arg0#:11, vec3(pos#:10, 1)) {
        result#:15 = vec4(0);
    } else {
        result#:15 = vec4(1);
    };
    return (result#:13 + result#:15) / (2);
} */
vec4 m_3c4200ce(GLSLEnv_451d5252 arg0_11, vec2 arg1_12) {
    vec4 result;
    if ((m_lambda_0b97ae6b(arg0_11, vec3(arg1_12, 0.0)) > m_lambda_0b97ae6b(arg0_11, vec3(arg1_12, 1.0)))) {
        result = vec4(0.0);
    } else {
        result = vec4(1.0);
    };
    vec2 pos = (arg1_12 + vec2(0.0, 0.50));
    vec4 result_15;
    if ((m_lambda_0b97ae6b(arg0_11, vec3(pos, 0.0)) > m_lambda_0b97ae6b(arg0_11, vec3(pos, 1.0)))) {
        result_15 = vec4(0.0);
    } else {
        result_15 = vec4(1.0);
    };
    return ((result + result_15) / 2.0);
}
void main() {
    fragColor = m_3c4200ce(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
}