#version 300 es
precision mediump float;
out vec4 fragColor;
const float PI = 3.14159;
uniform float u_time;
uniform vec2 u_mouse;
uniform int u_mousebutton;
uniform vec3 u_camera;
uniform vec2 u_resolution;
// skipping Eq_553b4b8e, contains type variables
struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};
/**
```
const otherTerm#2189e92c = (n#:0: int#builtin): int#builtin ={}> trace!(n#:0 -#builtin 1, "Yes")
```
*/
/* (n#:0: int): int => trace!(n#:0 - 1, "Yes") */
int otherTerm_2189e92c(int n_0) {
    return (n_0 - 1);
}
/**
```
const oneTerm#fa256dec = (m#:0: int#builtin): int#builtin ={}> trace!(m#:0, "Hello from tracing!") 
    +#builtin trace!(otherTerm#2189e92c(n: 4))
```
*/
/* (m#:0: int): int => trace!(
    m#:0,
    "Hello from tracing!",
) + trace!(otherTerm#👨‍🚒🍓🐀(4)) */
int oneTerm_fa256dec(int m_0) {
    return (m_0 + otherTerm_2189e92c(4));
}
/**
```
const unnamed#test_main = (env#:0: GLSLEnv#451d5252, fragCoord#:1: vec2#builtin): vec4#builtin ={}> {
    const t0#:4 = oneTerm#fa256dec(m: 4) +#builtin oneTerm#fa256dec(m: 1) 
        ==#9275f914#553b4b8e#0 11;
    const size#:2 = env#:0.camera#451d5252#2.x#43802a16#0 /#builtin 20.0;
    const size#:3 = size#:2 *#builtin 0.4;
    if t0#:4 
        &&#builtin length#builtin(fragCoord#:1 -#builtin vec2#builtin(1.0, 1.0) *#builtin size#:2) 
            <#builtin size#:3 vec4#builtin(0.0, 1.0, 0.0, 1.0) else if !#builtin(t0#:4) 
        &&#builtin length#builtin(fragCoord#:1 -#builtin vec2#builtin(1.0, 1.0) *#builtin size#:2) 
            <#builtin size#:3 vec4#builtin(1.0, 0.0, 0.0, 1.0) else vec4#builtin(
        1.0,
        1.0,
        1.0,
        1.0,
    );
}
```
*/
/* (
    env#:0: GLSLEnv#🕷️⚓😣😃,
    fragCoord#:1: vec2,
): vec4 => {
    const t0#:4: bool = oneTerm#🐵(4) + oneTerm#🐵(1) == 11;
    const size#:2: float = env#:0.#GLSLEnv#🕷️⚓😣😃#2.#Vec2#🐭😉😵😃#0 / 20;
    const size#:3: float = size#:2 * 0.4;
    if t0#:4 && length(fragCoord#:1 - vec2(1, 1) * size#:2) < size#:3 {
        return vec4(0, 1, 0, 1);
    } else {
        if !(t0#:4) && length(fragCoord#:1 - vec2(1, 1) * size#:2) < size#:3 {
            return vec4(1, 0, 0, 1);
        } else {
            return vec4(1, 1, 1, 1);
        };
    };
} */
vec4 Vtest_main(GLSLEnv_451d5252 env_0, vec2 fragCoord_1) {
    bool t0 = ((oneTerm_fa256dec(4) + oneTerm_fa256dec(1)) == 11);
    float size = (env_0.camera.x / 20.0);
    float size_3 = (size * 0.40);
    if ((t0 && (length((fragCoord_1 - (vec2(1.0, 1.0) * size))) < size_3))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if ((!(t0) && (length((fragCoord_1 - (vec2(1.0, 1.0) * size))) < size_3))) {
            return vec4(1.0, 0.0, 0.0, 1.0);
        } else {
            return vec4(1.0, 1.0, 1.0, 1.0);
        };
    };
}
void main() {
    fragColor = Vtest_main(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
}