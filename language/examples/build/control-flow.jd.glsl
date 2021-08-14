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
const x2#b022715c = (): int#builtin ={}> {
    const y#:1 = {
        const n#:0 = 2;
        if n#:0 +#builtin n#:0 <#builtin 3 {
            4;
        } else {
            2;
        };
    };
    y#:1 +#builtin 2 +#builtin y#:1;
}
```
*/
/* (): int => {
    const y#:1: int;
    if 2 + 2 < 3 {
        y#:1 = 4;
    } else {
        y#:1 = 2;
    };
    return y#:1 + 2 + y#:1;
} */
int x2_b022715c() {
    int y;
    if (((2 + 2) < 3)) {
        y = 4;
    } else {
        y = 2;
    };
    return ((y + 2) + y);
}
/**
```
const z#526b8b52 = (n#:0: int#builtin): int#builtin ={}> {
    const m#:3 = {
        const z#:1 = n#:0 +#builtin 2;
        switch z#:1 {3 => 3, 4 => 4, 5 => 10, _#:2 => 11};
    };
    m#:3 +#builtin m#:3 *#builtin 2;
}
```
*/
/* (
    n#:0: int,
): int => {
    const z#:1: int = n#:0 + 2;
    const m#:3: int;
    const continueBlock#:6: bool = true;
    if z#:1 == 3 {
        m#:3 = 3;
        continueBlock#:6 = false;
    };
    if continueBlock#:6 {
        if z#:1 == 4 {
            m#:3 = 4;
            continueBlock#:6 = false;
        };
        if continueBlock#:6 {
            if z#:1 == 5 {
                m#:3 = 10;
                continueBlock#:6 = false;
            };
            if continueBlock#:6 {
                m#:3 = 11;
                continueBlock#:6 = false;
            };
        };
    };
    return m#:3 + m#:3 * 2;
} */
int z_526b8b52(int n_0) {
    int z = (n_0 + 2);
    int m;
    bool continueBlock = true;
    if (z == 3) {
        m = 3;
        continueBlock = false;
    };
    if (continueBlock) {
        if (z == 4) {
            m = 4;
            continueBlock = false;
        };
        if (continueBlock) {
            if (z == 5) {
                m = 10;
                continueBlock = false;
            };
            if (continueBlock) {
                m = 11;
                continueBlock = false;
            };
        };
    };
    return (m + (m * 2));
}
/**
```
const unnamed#test_main = (env#:0: GLSLEnv#451d5252, fragCoord#:1: vec2#builtin): vec4#builtin ={}> {
    const t0#:4 = x#0992c290 ==#9275f914#553b4b8e#0 6;
    const t1#:5 = z#526b8b52(n: 2) ==#9275f914#553b4b8e#0 12;
    const t2#:6 = x2#b022715c() ==#9275f914#553b4b8e#0 6;
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
    const result#:8: int;
    const continueBlock#:9: bool = true;
    const y#:7: int;
    if 10 < 3 {
        y#:7 = 4;
    } else {
        y#:7 = 2;
    };
    if continueBlock#:9 {
        result#:8 = y#:7 + 2 + y#:7;
        continueBlock#:9 = false;
    };
    const t0#:4: bool = result#:8 == 6;
    const t1#:5: bool = z#🛑🍽️👨‍✈️😃(2) == 12;
    const t2#:6: bool = x2#🧛() == 6;
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
    int result;
    bool continueBlock_9 = true;
    int y_7;
    if ((10 < 3)) {
        y_7 = 4;
    } else {
        y_7 = 2;
    };
    if (continueBlock_9) {
        result = ((y_7 + 2) + y_7);
        continueBlock_9 = false;
    };
    bool t0 = (result == 6);
    bool t1 = (z_526b8b52(2) == 12);
    bool t2 = (x2_b022715c() == 6);
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