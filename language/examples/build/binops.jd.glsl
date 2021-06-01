#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform sampler2D u_buffer0;

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
bool arrayEq_cb18de62(Array one_0, Array two_1, Eq_553b4b8e eq_2) {
    int one_i_12 = 0;
    int two_i_13 = 0;
    for (int i=0; i<10000; i++) {
        if ((((nope_term_arrayLen - two_i_13) == 0) && ((nope_term_arrayLen - one_i_12) == 0))) {
            return nope_term_boolean;
        };
        if ((((nope_term_arrayLen - two_i_13) >= 1) && ((nope_term_arrayLen - one_i_12) >= 1))) {
            if (eq_2.h553b4b8e_0(nope_term_arrayIndex, nope_term_arrayIndex)) {
                one_i_12 = (one_i_12 + 1);
                two_i_13 = (two_i_13 + 1);
                continue;
            } else {
                return nope_term_boolean;
            };
        };
        return nope_term_boolean;
    };
}

/* -- generated -- */
Eq_553b4b8e ArrayEq_663480cc(Eq_553b4b8e eq_0) {
    return Eq_553b4b8e(
        lambda-woops(one_1, two_2){
            ((len(one_1) == len(two_2)) && arrayEq_cb18de62(one_1, two_2, eq_0));
        }
    );
}

/* -- generated -- */
Eq_553b4b8e ArrayEq_7d8580f8(Eq_553b4b8e eq_0) {
    return Eq_553b4b8e(
        lambda-woops(one_1, two_2){
            ((len(one_1) == len(two_2)) && arrayEq_cb18de62(one_1, two_2, eq_0));
        }
    );
}

/* -- generated -- */
Eq_553b4b8e ArrayEq_332a4530(Eq_553b4b8e eq_0) {
    return Eq_553b4b8e(
        lambda-woops(one_1, two_2){
            ((len(one_1) == len(two_2)) && arrayEq_cb18de62(one_1, two_2, eq_0));
        }
    );
}

/**
```
const goToTown#a4c2a3f0 = (t#:0: Tuple2<int, int>): int ={}> t#:0.0
```
*/
int goToTown_a4c2a3f0(
    Tuple2 t_0
) {
    return t_0[0];
}

/**
```
const unnamed#test_main = (env#:0: GLSLEnv#451d5252, fragCoord#:1: vec2): vec4 ={}> {
    const t0#:4 = goToTown#a4c2a3f0((2, 3)) ==#9275f914#553b4b8e#0 2;
    const t1#:5 = ArrayEq#bef2134a<int>(IntEq#9275f914)."=="#553b4b8e#0(<int>[1, 2], <int>[1, 2]);
    const t2#:6 = ArrayEq#bef2134a<int>(IntEq#9275f914)."=="#553b4b8e#0(
        <int>[1, 2, 3],
        <int>[1, 2, 3],
    );
    const t3#:7 = <int>[1, 2] ==#4419935c#553b4b8e#0 <int>[1, 2];
    const t4#:8 = 1 + 2 * 3 ==#9275f914#553b4b8e#0 7;
    const t5#:9 = den#70ad3796 ==#c41f7386#553b4b8e#0 -13.0;
    const t6#:10 = deep#dcfc5c32 ==#c41f7386#553b4b8e#0 -70.0;
    const t7#:11 = thing#5bafb634 ==#9275f914#553b4b8e#0 0;
    const size#:2 = env#:0.resolution#451d5252#1.x#43802a16#0 / 20.0;
    const size#:3 = size#:2 * 0.4;
    if (t0#:4 && length(fragCoord#:1 - vec2(1.0, 1.0) * size#:2) < size#:3) || (t1#:5 && length(
        fragCoord#:1 - vec2(2.0, 1.0) * size#:2,
    ) < size#:3) || (t2#:6 && length(fragCoord#:1 - vec2(3.0, 1.0) * size#:2) < size#:3) || (t3#:7 && length(
        fragCoord#:1 - vec2(4.0, 1.0) * size#:2,
    ) < size#:3) || (t4#:8 && length(fragCoord#:1 - vec2(5.0, 1.0) * size#:2) < size#:3) || (t5#:9 && length(
        fragCoord#:1 - vec2(6.0, 1.0) * size#:2,
    ) < size#:3) || (t6#:10 && length(fragCoord#:1 - vec2(7.0, 1.0) * size#:2) < size#:3) || (t7#:11 && length(
        fragCoord#:1 - vec2(8.0, 1.0) * size#:2,
    ) < size#:3) vec4(0.0, 1.0, 0.0, 1.0) else if (!(t0#:4) && length(
        fragCoord#:1 - vec2(1.0, 1.0) * size#:2,
    ) < size#:3) || (!(t1#:5) && length(fragCoord#:1 - vec2(2.0, 1.0) * size#:2) < size#:3) || (!(
        t2#:6,
    ) && length(fragCoord#:1 - vec2(3.0, 1.0) * size#:2) < size#:3) || (!(t3#:7) && length(
        fragCoord#:1 - vec2(4.0, 1.0) * size#:2,
    ) < size#:3) || (!(t4#:8) && length(fragCoord#:1 - vec2(5.0, 1.0) * size#:2) < size#:3) || (!(
        t5#:9,
    ) && length(fragCoord#:1 - vec2(6.0, 1.0) * size#:2) < size#:3) || (!(t6#:10) && length(
        fragCoord#:1 - vec2(7.0, 1.0) * size#:2,
    ) < size#:3) || (!(t7#:11) && length(fragCoord#:1 - vec2(8.0, 1.0) * size#:2) < size#:3) vec4(
        1.0,
        0.0,
        0.0,
        1.0,
    ) else vec4(1.0, 1.0, 1.0, 1.0);
}
```
*/
vec4 Vtest_main(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    bool t0_4 = (goToTown_a4c2a3f0(nope_term_tuple) == 2);
    bool t1_5 = ArrayEq_332a4530(Eq_553b4b8e(==)).h553b4b8e_0(nope_term_array, nope_term_array);
    bool t2_6 = ArrayEq_7d8580f8(Eq_553b4b8e(==)).h553b4b8e_0(nope_term_array, nope_term_array);
    bool t3_7 = ArrayEq_663480cc(Eq_553b4b8e(==)).h553b4b8e_0(nope_term_array, nope_term_array);
    bool t4_8 = ((1 + (2 * 3)) == 7);
    bool t5_9 = ((1.0 * (2.0 - (3.0 * 5.0))) == -13.0);
    bool t6_10 = ((1.0 * (2.0 - (3.0 * (4.0 + (2.0 * 10.0))))) == -70.0);
    bool t7_11 = ((1 - (2 - 1)) == 0);
    float size_2 = (env_0.resolution.x / 20.0);
    float size_3 = (size_2 * 0.40);
    if (((((((((t0_4 && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3)) || (t1_5 && (length(
        (fragCoord_1 - (vec2(2.0, 1.0) * size_2))
    ) < size_3))) || (t2_6 && (length((fragCoord_1 - (vec2(3.0, 1.0) * size_2))) < size_3))) || (t3_7 && (length(
        (fragCoord_1 - (vec2(4.0, 1.0) * size_2))
    ) < size_3))) || (t4_8 && (length((fragCoord_1 - (vec2(5.0, 1.0) * size_2))) < size_3))) || (t5_9 && (length(
        (fragCoord_1 - (vec2(6.0, 1.0) * size_2))
    ) < size_3))) || (t6_10 && (length((fragCoord_1 - (vec2(7.0, 1.0) * size_2))) < size_3))) || (t7_11 && (length(
        (fragCoord_1 - (vec2(8.0, 1.0) * size_2))
    ) < size_3)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if (((((((((!(t0_4) && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3)) || (!(
            t1_5
        ) && (length((fragCoord_1 - (vec2(2.0, 1.0) * size_2))) < size_3))) || (!(t2_6) && (length(
            (fragCoord_1 - (vec2(3.0, 1.0) * size_2))
        ) < size_3))) || (!(t3_7) && (length((fragCoord_1 - (vec2(4.0, 1.0) * size_2))) < size_3))) || (!(
            t4_8
        ) && (length((fragCoord_1 - (vec2(5.0, 1.0) * size_2))) < size_3))) || (!(t5_9) && (length(
            (fragCoord_1 - (vec2(6.0, 1.0) * size_2))
        ) < size_3))) || (!(t6_10) && (length((fragCoord_1 - (vec2(7.0, 1.0) * size_2))) < size_3))) || (!(
            t7_11
        ) && (length((fragCoord_1 - (vec2(8.0, 1.0) * size_2))) < size_3)))) {
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