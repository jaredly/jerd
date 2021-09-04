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
// skipping Eq_553b4b8e, contains type variables
/**
```
const rec fib#ac346fbc = (prev#:0: int#builtin, cur#:1: int#builtin, n#:2: int#builtin): int#builtin ={}> if n#:2 
    ==#9275f914#553b4b8e#0 0 {
    prev#:0;
} else {
    ac346fbc#self(cur#:1, prev#:0 +#builtin cur#:1, n#:2 -#builtin 1);
}
```
*/
/* (
    prev#:0: int,
    cur#:1: int,
    n#:2: int,
): int => {
    loop {
        if n#:2 == 0 {
            return prev#:0;
        } else {
            const recur#:4: int = prev#:0 + cur#:1;
            prev#:0 = cur#:1;
            cur#:1 = recur#:4;
            n#:2 = n#:2 - 1;
            continue;
        };
    };
} */
int fib_ac346fbc(int prev_0, int cur_1, int n_2) {
    for (int i=0; i<10000; i++) {
        if ((n_2 == 0)) {
            return prev_0;
        } else {
            int recur = (prev_0 + cur_1);
            prev_0 = cur_1;
            cur_1 = recur;
            n_2 = (n_2 - 1);
            continue;
        };
    };
}
/**
```
const z#ce5d9b4c = (n#:0: int#builtin): int#builtin ={}> {
    const m#:1 = n#:0 +#builtin 2;
    m#:1 -#builtin 1;
}
```
*/
/* (n#:0: int): int => n#:0 + 2 - 1 */
int z_ce5d9b4c(int n_0) {
    return ((n_0 + 2) - 1);
}
/* *
```
const x#0c634e04 = {
    const y#:0 = 10;
    y#:0;
}
```
 */
/*10*/const int x_0c634e04 = 10;
/**
```
const unnamed#test_main = (env#:0: GLSLEnv#451d5252, fragCoord#:1: vec2#builtin): vec4#builtin ={}> {
    const t0#:4 = x#0c634e04 ==#9275f914#553b4b8e#0 10;
    const t1#:5 = z#ce5d9b4c(n: 10) ==#9275f914#553b4b8e#0 11;
    const t2#:6 = fib#ac346fbc(prev: 0, cur: 1, n: 10) ==#9275f914#553b4b8e#0 55;
    const size#:2 = env#:0.camera#451d5252#2.x#43802a16#0 /#builtin 20.0;
    const size#:3 = size#:2 *#builtin 0.4;
    if (t0#:4 
                &&#builtin length#builtin(
                        fragCoord#:1 -#builtin vec2#builtin(1.0, 1.0) *#builtin size#:2,
                    ) 
                    <#builtin size#:3) 
            ||#builtin (t1#:5 
                &&#builtin length#builtin(
                        fragCoord#:1 -#builtin vec2#builtin(2.0, 1.0) *#builtin size#:2,
                    ) 
                    <#builtin size#:3) 
        ||#builtin (t2#:6 
            &&#builtin length#builtin(
                    fragCoord#:1 -#builtin vec2#builtin(3.0, 1.0) *#builtin size#:2,
                ) 
                <#builtin size#:3) vec4#builtin(0.0, 1.0, 0.0, 1.0) else if (!#builtin(t0#:4) 
                &&#builtin length#builtin(
                        fragCoord#:1 -#builtin vec2#builtin(1.0, 1.0) *#builtin size#:2,
                    ) 
                    <#builtin size#:3) 
            ||#builtin (!#builtin(t1#:5) 
                &&#builtin length#builtin(
                        fragCoord#:1 -#builtin vec2#builtin(2.0, 1.0) *#builtin size#:2,
                    ) 
                    <#builtin size#:3) 
        ||#builtin (!#builtin(t2#:6) 
            &&#builtin length#builtin(
                    fragCoord#:1 -#builtin vec2#builtin(3.0, 1.0) *#builtin size#:2,
                ) 
                <#builtin size#:3) vec4#builtin(1.0, 0.0, 0.0, 1.0) else vec4#builtin(
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
    const t0#:4: bool = x#🐮👩‍🦰👶 == 10;
    const t1#:5: bool = z#🛤️(10) == 11;
    const t2#:6: bool = fib#🎇(0, 1, 10) == 55;
    const size#:2: float = env#:0.#GLSLEnv#🕷️⚓😣😃#2.#Vec2#🐭😉😵😃#0 / 20;
    const size#:3: float = size#:2 * 0.4;
    if (t0#:4 && length(fragCoord#:1 - vec2(1, 1) * size#:2) < size#:3) || (t1#:5 && length(fragCoord#:1 - vec2(2, 1) * size#:2) < size#:3) || t2#:6 && length(fragCoord#:1 - vec2(3, 1) * size#:2) < size#:3 {
        return vec4(0, 1, 0, 1);
    } else {
        if (!(t0#:4) && length(fragCoord#:1 - vec2(1, 1) * size#:2) < size#:3) || (!(t1#:5) && length(fragCoord#:1 - vec2(2, 1) * size#:2) < size#:3) || !(t2#:6) && length(
            fragCoord#:1 - vec2(3, 1) * size#:2,
        ) < size#:3 {
            return vec4(1, 0, 0, 1);
        } else {
            return vec4(1, 1, 1, 1);
        };
    };
} */
vec4 Vtest_main(GLSLEnv_451d5252 env_0, vec2 fragCoord_1) {
    bool t0 = (x_0c634e04 == 10);
    bool t1 = (z_ce5d9b4c(10) == 11);
    bool t2 = (fib_ac346fbc(0, 1, 10) == 55);
    float size = (env_0.camera.x / 20.0);
    float size_3 = (size * 0.40);
    if ((((t0 && (length((fragCoord_1 - (vec2(1.0, 1.0) * size))) < size_3)) || (t1 && (length((fragCoord_1 - (vec2(2.0, 1.0) * size))) < size_3))) || (t2 && (length(
        (fragCoord_1 - (vec2(3.0, 1.0) * size))
    ) < size_3)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if ((((!(t0) && (length((fragCoord_1 - (vec2(1.0, 1.0) * size))) < size_3)) || (!(t1) && (length((fragCoord_1 - (vec2(2.0, 1.0) * size))) < size_3))) || (!(t2) && (length(
            (fragCoord_1 - (vec2(3.0, 1.0) * size))
        ) < size_3)))) {
            return vec4(1.0, 0.0, 0.0, 1.0);
        } else {
            return vec4(1.0, 1.0, 1.0, 1.0);
        };
    };
}
void main() {
    fragColor = Vtest_main(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
}