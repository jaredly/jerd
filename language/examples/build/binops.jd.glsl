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
struct T6e21272e{
    invalid_lambda h6e21272e_0;
};
struct T022421b6{
    invalid_lambda h022421b6_0;
};
/* -- generated -- */
/* (one#:0: Array, two#:1: Array, eq#:2: unnamed#🚝😧🍽️😃): bool => {
    const one_i#:12: int = 0;
    const two_i#:13: int = 0;
    loop {
        if len(two#:1) - two_i#:13 == 0 && len(one#:0) - one_i#:12 == 0 {
            return true;
        };
        if len(two#:1) - two_i#:13 >= 1 && len(one#:0) - one_i#:12 >= 1 {
            if eq#:2.#Eq#🌕☕🦹😃#0(one#:0[0 + one_i#:12], two#:1[0 + two_i#:13]) {
                one_i#:12 = one_i#:12 + 1;
                two_i#:13 = two_i#:13 + 1;
                continue;
            } else {
                return false;
            };
        };
        return false;
    };
} */
bool arrayEq_6f3f6a04(Array[invalid_var_[object Object]] one_0, Array[invalid_var_[object Object]] two_1, T6e21272e eq_2) {
    int one_i = 0;
    int two_i = 0;
    for (int i=0; i<10000; i++) {
        if ((((nope_term_arrayLen - two_i) == 0) && ((nope_term_arrayLen - one_i) == 0))) {
            return true;
        };
        if ((((nope_term_arrayLen - two_i) >= 1) && ((nope_term_arrayLen - one_i) >= 1))) {
            if (eq_2.h553b4b8e_0(nope_term_arrayIndex, nope_term_arrayIndex)) {
                one_i = (one_i + 1);
                two_i = (two_i + 1);
                continue;
            } else {
                return false;
            };
        };
        return false;
    };
}
/* -- generated -- */
/* (eq#:0: unnamed#🤽‍♀️👨‍⚖️😐): Eq#🌕☕🦹😃 => Eq#🌕☕🦹😃{TODO SPREADs}{
    h553b4b8e_0: (one#:1: Array, two#:2: Array): bool => len(one#:1) == len(two#:2) && arrayEq#🐮🏉🏖️😃(one#:1, two#:2, eq#:0),
} */
Eq_553b4b8e[Array[int]] ArrayEq_764e1d18(T022421b6 eq_0) {
    return Eq_553b4b8e(lambda-woops(one, two){
        return ((len(one) == len(two)) && arrayEq_6f3f6a04(one, two, eq_0));
    });
}
/* -- generated -- */
/* (eq#:0: unnamed#🤽‍♀️👨‍⚖️😐): Eq#🌕☕🦹😃 => Eq#🌕☕🦹😃{TODO SPREADs}{
    h553b4b8e_0: (one#:1: Array, two#:2: Array): bool => len(one#:1) == len(two#:2) && arrayEq#🐮🏉🏖️😃(one#:1, two#:2, eq#:0),
} */
Eq_553b4b8e[Array[int]] ArrayEq_70e76540(T022421b6 eq_0) {
    return Eq_553b4b8e(lambda-woops(one, two){
        return ((len(one) == len(two)) && arrayEq_6f3f6a04(one, two, eq_0));
    });
}
/**
```
const goToTown#a4c2a3f0 = (t#:0: Tuple2#builtin<int#builtin, int#builtin>): int#builtin ={}> t#:0.0
```
*/
/* (t#:0: Tuple2): int => t#:0[0] */
int goToTown_a4c2a3f0(Tuple2[int, int] t_0) {
    return t_0[0];
}
/* -- generated -- */
/* (eq#:0: unnamed#🤽‍♀️👨‍⚖️😐): Eq#🌕☕🦹😃 => Eq#🌕☕🦹😃{TODO SPREADs}{
    h553b4b8e_0: (one#:1: Array, two#:2: Array): bool => len(one#:1) == len(two#:2) && arrayEq#🐮🏉🏖️😃(one#:1, two#:2, eq#:0),
} */
Eq_553b4b8e[Array[int]] ArrayEq_61409146(T022421b6 eq_0) {
    return Eq_553b4b8e(lambda-woops(one, two){
        return ((len(one) == len(two)) && arrayEq_6f3f6a04(one, two, eq_0));
    });
}
/**
```
const unnamed#test_main = (env#:0: GLSLEnv#451d5252, fragCoord#:1: vec2#builtin): vec4#builtin ={}> {
    const t0#:4 = goToTown#a4c2a3f0(t: (2, 3)) ==#9275f914#553b4b8e#0 2;
    const t1#:5 = ArrayEq#bef2134a<int#builtin>(eq: IntEq#9275f914)."=="#553b4b8e#0(
        <int#builtin>[1, 2],
        <int#builtin>[1, 2],
    );
    const t2#:6 = ArrayEq#bef2134a<int#builtin>(eq: IntEq#9275f914)."=="#553b4b8e#0(
        <int#builtin>[1, 2, 3],
        <int#builtin>[1, 2, 3],
    );
    const t3#:7 = <int#builtin>[1, 2] ==#4419935c#553b4b8e#0 <int#builtin>[1, 2];
    const t4#:8 = 1 +#builtin 2 *#builtin 3 ==#9275f914#553b4b8e#0 7;
    const t5#:9 = den#70ad3796 ==#c41f7386#553b4b8e#0 -13.0;
    const t6#:10 = deep#dcfc5c32 ==#c41f7386#553b4b8e#0 -70.0;
    const t7#:11 = thing#5bafb634 ==#9275f914#553b4b8e#0 0;
    const size#:2 = env#:0.camera#451d5252#2.x#43802a16#0 /#builtin 20.0;
    const size#:3 = size#:2 *#builtin 0.4;
    if (t0#:4 
                                    &&#builtin length#builtin(
                                            fragCoord#:1 
                                                -#builtin vec2#builtin(1.0, 1.0) *#builtin size#:2,
                                        ) 
                                        <#builtin size#:3) 
                                ||#builtin (t1#:5 
                                    &&#builtin length#builtin(
                                            fragCoord#:1 
                                                -#builtin vec2#builtin(2.0, 1.0) *#builtin size#:2,
                                        ) 
                                        <#builtin size#:3) 
                            ||#builtin (t2#:6 
                                &&#builtin length#builtin(
                                        fragCoord#:1 
                                            -#builtin vec2#builtin(3.0, 1.0) *#builtin size#:2,
                                    ) 
                                    <#builtin size#:3) 
                        ||#builtin (t3#:7 
                            &&#builtin length#builtin(
                                    fragCoord#:1 
                                        -#builtin vec2#builtin(4.0, 1.0) *#builtin size#:2,
                                ) 
                                <#builtin size#:3) 
                    ||#builtin (t4#:8 
                        &&#builtin length#builtin(
                                fragCoord#:1 -#builtin vec2#builtin(5.0, 1.0) *#builtin size#:2,
                            ) 
                            <#builtin size#:3) 
                ||#builtin (t5#:9 
                    &&#builtin length#builtin(
                            fragCoord#:1 -#builtin vec2#builtin(6.0, 1.0) *#builtin size#:2,
                        ) 
                        <#builtin size#:3) 
            ||#builtin (t6#:10 
                &&#builtin length#builtin(
                        fragCoord#:1 -#builtin vec2#builtin(7.0, 1.0) *#builtin size#:2,
                    ) 
                    <#builtin size#:3) 
        ||#builtin (t7#:11 
            &&#builtin length#builtin(
                    fragCoord#:1 -#builtin vec2#builtin(8.0, 1.0) *#builtin size#:2,
                ) 
                <#builtin size#:3) vec4#builtin(0.0, 1.0, 0.0, 1.0) else if (!#builtin(t0#:4) 
                                    &&#builtin length#builtin(
                                            fragCoord#:1 
                                                -#builtin vec2#builtin(1.0, 1.0) *#builtin size#:2,
                                        ) 
                                        <#builtin size#:3) 
                                ||#builtin (!#builtin(t1#:5) 
                                    &&#builtin length#builtin(
                                            fragCoord#:1 
                                                -#builtin vec2#builtin(2.0, 1.0) *#builtin size#:2,
                                        ) 
                                        <#builtin size#:3) 
                            ||#builtin (!#builtin(t2#:6) 
                                &&#builtin length#builtin(
                                        fragCoord#:1 
                                            -#builtin vec2#builtin(3.0, 1.0) *#builtin size#:2,
                                    ) 
                                    <#builtin size#:3) 
                        ||#builtin (!#builtin(t3#:7) 
                            &&#builtin length#builtin(
                                    fragCoord#:1 
                                        -#builtin vec2#builtin(4.0, 1.0) *#builtin size#:2,
                                ) 
                                <#builtin size#:3) 
                    ||#builtin (!#builtin(t4#:8) 
                        &&#builtin length#builtin(
                                fragCoord#:1 -#builtin vec2#builtin(5.0, 1.0) *#builtin size#:2,
                            ) 
                            <#builtin size#:3) 
                ||#builtin (!#builtin(t5#:9) 
                    &&#builtin length#builtin(
                            fragCoord#:1 -#builtin vec2#builtin(6.0, 1.0) *#builtin size#:2,
                        ) 
                        <#builtin size#:3) 
            ||#builtin (!#builtin(t6#:10) 
                &&#builtin length#builtin(
                        fragCoord#:1 -#builtin vec2#builtin(7.0, 1.0) *#builtin size#:2,
                    ) 
                    <#builtin size#:3) 
        ||#builtin (!#builtin(t7#:11) 
            &&#builtin length#builtin(
                    fragCoord#:1 -#builtin vec2#builtin(8.0, 1.0) *#builtin size#:2,
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
    const t0#:4: bool = goToTown#🪀((2, 3)) == 2;
    const t1#:5: bool = ArrayEq#🧕👩‍👩‍👦🗽😃(Eq#🌕☕🦹😃{TODO SPREADs}{h553b4b8e_0: ==}).#Eq#🌕☕🦹😃#0([1, 2], [1, 2]);
    const t2#:6: bool = ArrayEq#👩‍💼🕥🚠😃(Eq#🌕☕🦹😃{TODO SPREADs}{h553b4b8e_0: ==}).#Eq#🌕☕🦹😃#0([1, 2, 3], [1, 2, 3]);
    const t3#:7: bool = ArrayEq#👰‍♀️😶🦏😃(Eq#🌕☕🦹😃{TODO SPREADs}{h553b4b8e_0: ==}).#Eq#🌕☕🦹😃#0([1, 2], [1, 2]);
    const t4#:8: bool = 1 + 2 * 3 == 7;
    const t5#:9: bool = 1 * 2 - 3 * 5 == -13;
    const t6#:10: bool = 1 * 2 - 3 * 4 + 2 * 10 == -70;
    const t7#:11: bool = 1 - 2 - 1 == 0;
    const size#:2: float = env#:0.#GLSLEnv#🕷️⚓😣😃#2.#Vec2#🐭😉😵😃#0 / 20;
    const size#:3: float = size#:2 * 0.4;
    if (t0#:4 && length(fragCoord#:1 - vec2(1, 1) * size#:2) < size#:3) || (t1#:5 && length(fragCoord#:1 - vec2(2, 1) * size#:2) < size#:3) || t2#:6 && length(fragCoord#:1 - vec2(3, 1) * size#:2) < size#:3 || t3#:7 && length(
        fragCoord#:1 - vec2(4, 1) * size#:2,
    ) < size#:3 || t4#:8 && length(fragCoord#:1 - vec2(5, 1) * size#:2) < size#:3 || t5#:9 && length(fragCoord#:1 - vec2(6, 1) * size#:2) < size#:3 || t6#:10 && length(
        fragCoord#:1 - vec2(7, 1) * size#:2,
    ) < size#:3 || t7#:11 && length(fragCoord#:1 - vec2(8, 1) * size#:2) < size#:3 {
        return vec4(0, 1, 0, 1);
    } else {
        if (!(t0#:4) && length(fragCoord#:1 - vec2(1, 1) * size#:2) < size#:3) || (!(t1#:5) && length(fragCoord#:1 - vec2(2, 1) * size#:2) < size#:3) || !(t2#:6) && length(
            fragCoord#:1 - vec2(3, 1) * size#:2,
        ) < size#:3 || !(t3#:7) && length(fragCoord#:1 - vec2(4, 1) * size#:2) < size#:3 || !(t4#:8) && length(fragCoord#:1 - vec2(5, 1) * size#:2) < size#:3 || !(t5#:9) && length(
            fragCoord#:1 - vec2(6, 1) * size#:2,
        ) < size#:3 || !(t6#:10) && length(fragCoord#:1 - vec2(7, 1) * size#:2) < size#:3 || !(t7#:11) && length(fragCoord#:1 - vec2(8, 1) * size#:2) < size#:3 {
            return vec4(1, 0, 0, 1);
        } else {
            return vec4(1, 1, 1, 1);
        };
    };
} */
vec4 Vtest_main(GLSLEnv_451d5252 env_0, vec2 fragCoord_1) {
    bool t0 = (goToTown_a4c2a3f0(tuples_not_supported) == 2);
    bool t1 = ArrayEq_70e76540(Eq_553b4b8e(==)).h553b4b8e_0(nope_term_array, nope_term_array);
    bool t2 = ArrayEq_764e1d18(Eq_553b4b8e(==)).h553b4b8e_0(nope_term_array, nope_term_array);
    bool t3 = ArrayEq_61409146(Eq_553b4b8e(==)).h553b4b8e_0(nope_term_array, nope_term_array);
    bool t4 = ((1 + (2 * 3)) == 7);
    bool t5 = ((1.0 * (2.0 - (3.0 * 5.0))) == -13.0);
    bool t6 = ((1.0 * (2.0 - (3.0 * (4.0 + (2.0 * 10.0))))) == -70.0);
    bool t7 = ((1 - (2 - 1)) == 0);
    float size = (env_0.camera.x / 20.0);
    float size_3 = (size * 0.40);
    if (((((((((t0 && (length((fragCoord_1 - (vec2(1.0, 1.0) * size))) < size_3)) || (t1 && (length((fragCoord_1 - (vec2(2.0, 1.0) * size))) < size_3))) || (t2 && (length(
        (fragCoord_1 - (vec2(3.0, 1.0) * size))
    ) < size_3))) || (t3 && (length((fragCoord_1 - (vec2(4.0, 1.0) * size))) < size_3))) || (t4 && (length((fragCoord_1 - (vec2(5.0, 1.0) * size))) < size_3))) || (t5 && (length(
        (fragCoord_1 - (vec2(6.0, 1.0) * size))
    ) < size_3))) || (t6 && (length((fragCoord_1 - (vec2(7.0, 1.0) * size))) < size_3))) || (t7 && (length((fragCoord_1 - (vec2(8.0, 1.0) * size))) < size_3)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if (((((((((!(t0) && (length((fragCoord_1 - (vec2(1.0, 1.0) * size))) < size_3)) || (!(t1) && (length((fragCoord_1 - (vec2(2.0, 1.0) * size))) < size_3))) || (!(t2) && (length(
            (fragCoord_1 - (vec2(3.0, 1.0) * size))
        ) < size_3))) || (!(t3) && (length((fragCoord_1 - (vec2(4.0, 1.0) * size))) < size_3))) || (!(t4) && (length((fragCoord_1 - (vec2(5.0, 1.0) * size))) < size_3))) || (!(t5) && (length(
            (fragCoord_1 - (vec2(6.0, 1.0) * size))
        ) < size_3))) || (!(t6) && (length((fragCoord_1 - (vec2(7.0, 1.0) * size))) < size_3))) || (!(t7) && (length((fragCoord_1 - (vec2(8.0, 1.0) * size))) < size_3)))) {
            return vec4(1.0, 0.0, 0.0, 1.0);
        } else {
            return vec4(1.0, 1.0, 1.0, 1.0);
        };
    };
}
void main() {
    fragColor = Vtest_main(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
}