#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

// skipping Eq_553b4b8e, contains type variables

struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};

/* -- generated -- */
int undefined_lambda_7eb78a88(int n_0) {
    return (n_0 + 3);
}

/**
```
const h#15ece66a = (m#:0: int#builtin): int#builtin ={}> m#:0 -#builtin 2
```
*/
int h_15ece66a(
    int m_0
) {
    return (m_0 - 2);
}

/**
```
const z#f4c397d2 = (m#:0: int#builtin): int#builtin ={}> m#:0 +#builtin 2
```
*/
int z_f4c397d2(
    int m_0
) {
    return (m_0 + 2);
}

/* -- generated -- */
int yy_specialization_d7ebe870(int z_1, int b_2) {
    return undefined_lambda_7eb78a88((z_1 + b_2));
}

/* -- generated -- */
int yy_specialization_202b9fb0(int z_1, int b_2) {
    return h_15ece66a((z_1 + b_2));
}

/* -- generated -- */
int yy_specialization_99328d90(int z_1, int b_2) {
    return z_f4c397d2((z_1 + b_2));
}

/* -- generated -- */
int y_specialization_697000a0(int v_1) {
    return yy_specialization_d7ebe870(undefined_lambda_7eb78a88((v_1 * 2)), 5);
}

/* -- generated -- */
int y_specialization_270df8de(int v_1) {
    return yy_specialization_202b9fb0(h_15ece66a((v_1 * 2)), 5);
}

/* -- generated -- */
int y_specialization_7f8ca5c4(int v_1) {
    return yy_specialization_99328d90(z_f4c397d2((v_1 * 2)), 5);
}

/**
```
const unnamed#test_main = (env#:1: GLSLEnv#451d5252, fragCoord#:2: vec2#builtin): vec4#builtin ={}> {
    const t0#:5 = y#7df35068(doit: z#f4c397d2, v: 30) 
        ==#9275f914#553b4b8e#0 60 +#builtin 2 +#builtin 5 +#builtin 2;
    const t1#:6 = y#7df35068(doit: h#15ece66a, v: 30) 
        ==#9275f914#553b4b8e#0 60 -#builtin 2 +#builtin 5 -#builtin 2;
    const t2#:7 = y#7df35068(doit: (n#:0: int#builtin): int#builtin ={}> n#:0 +#builtin 3, v: 30) 
        ==#9275f914#553b4b8e#0 60 +#builtin 5 +#builtin 6;
    const size#:3 = env#:1.resolution#451d5252#1.x#43802a16#0 /#builtin 20.0;
    const size#:4 = size#:3 *#builtin 0.4;
    if (t0#:5 
                &&#builtin length#builtin(
                        fragCoord#:2 -#builtin vec2#builtin(1.0, 1.0) *#builtin size#:3,
                    ) 
                    <#builtin size#:4) 
            ||#builtin (t1#:6 
                &&#builtin length#builtin(
                        fragCoord#:2 -#builtin vec2#builtin(2.0, 1.0) *#builtin size#:3,
                    ) 
                    <#builtin size#:4) 
        ||#builtin (t2#:7 
            &&#builtin length#builtin(
                    fragCoord#:2 -#builtin vec2#builtin(3.0, 1.0) *#builtin size#:3,
                ) 
                <#builtin size#:4) vec4#builtin(0.0, 1.0, 0.0, 1.0) else if (!#builtin(t0#:5) 
                &&#builtin length#builtin(
                        fragCoord#:2 -#builtin vec2#builtin(1.0, 1.0) *#builtin size#:3,
                    ) 
                    <#builtin size#:4) 
            ||#builtin (!#builtin(t1#:6) 
                &&#builtin length#builtin(
                        fragCoord#:2 -#builtin vec2#builtin(2.0, 1.0) *#builtin size#:3,
                    ) 
                    <#builtin size#:4) 
        ||#builtin (!#builtin(t2#:7) 
            &&#builtin length#builtin(
                    fragCoord#:2 -#builtin vec2#builtin(3.0, 1.0) *#builtin size#:3,
                ) 
                <#builtin size#:4) vec4#builtin(1.0, 0.0, 0.0, 1.0) else vec4#builtin(
        1.0,
        1.0,
        1.0,
        1.0,
    );
}
```
*/
vec4 Vtest_main(
    GLSLEnv_451d5252 env_1,
    vec2 fragCoord_2
) {
    bool t0 = (y_specialization_7f8ca5c4(30) == (((60 + 2) + 5) + 2));
    bool t1 = (y_specialization_270df8de(30) == (((60 - 2) + 5) - 2));
    bool t2 = (y_specialization_697000a0(30) == ((60 + 5) + 6));
    float size = (env_1.resolution.x / 20.0);
    float size_4 = (size * 0.40);
    if ((((t0 && (length((fragCoord_2 - (vec2(1.0, 1.0) * size))) < size_4)) || (t1 && (length(
        (fragCoord_2 - (vec2(2.0, 1.0) * size))
    ) < size_4))) || (t2 && (length((fragCoord_2 - (vec2(3.0, 1.0) * size))) < size_4)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if ((((!(t0) && (length((fragCoord_2 - (vec2(1.0, 1.0) * size))) < size_4)) || (!(t1) && (length(
            (fragCoord_2 - (vec2(2.0, 1.0) * size))
        ) < size_4))) || (!(t2) && (length((fragCoord_2 - (vec2(3.0, 1.0) * size))) < size_4)))) {
            return vec4(1.0, 0.0, 0.0, 1.0);
        } else {
            return vec4(1.0, 1.0, 1.0, 1.0);
        };
    };
}

void main() {
    fragColor = Vtest_main(
        GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse),
        gl_FragCoord.xy
    );
}