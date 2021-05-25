#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform sampler2D u_buffer0;

uniform float u_time;

uniform vec2 u_mouse;

uniform vec3 u_camera;

uniform vec2 u_resolution;

struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};

struct Person_ba1e5642{
    string hba1e5642_0;
    int hba1e5642_1;
};

// skipping As_As, contains type variables

// skipping Eq_553b4b8e, contains type variables

/**
```
const arrayEq#7825e3a8: <T#:0>(Array<T#:0>, Array<T#:0>, Eq#553b4b8e<T#:0>) ={}> bool = <T#:0>(
    one#:0: Array<T#:0>,
    two#:1: Array<T#:0>,
    eq#:2: Eq#553b4b8e<T#:0>,
) ={}> {
    switch (one#:0, two#:1) {
        ([], []) => true,
        ([one#:3, ...rone#:4], [two#:5, ...rtwo#:6]) => if eq#:2."=="#553b4b8e#0(one#:3, two#:5) {
            7825e3a8<T#:0>(rone#:4, rtwo#:6, eq#:2);
        } else {
            false;
        },
        _#:7 => false,
    };
}
```
*/
bool arrayEq_7825e3a8(
    Array one_0,
    Array two_1,
    Eq_553b4b8e eq_2
) {
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
                eq_2 = eq_2;
                continue;
            } else {
                return nope_term_boolean;
            };
        };
        return nope_term_boolean;
    };
}

/**
```
const getString#64605d94: () ={Read#22024b72}> string = () ={Read#22024b72}> raise!(
    Read#22024b72.read(),
)
```
*/
void getString_64605d94(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_1
) {
    nope_stmt_Expression;
}

/**
```
const ArrayEq#bef2134a: <T#:0>(Eq#553b4b8e<T#:0>) ={}> Eq#553b4b8e<Array<T#:0>> = <T#:0>(
    eq#:0: Eq#553b4b8e<T#:0>,
) ={}> Eq#553b4b8e<Array<T#:0>>{
    "=="#553b4b8e#0: (one#:1: Array<T#:0>, two#:2: Array<T#:0>) ={}> (IntEq#9275f914."=="#553b4b8e#0(
        len<T#:0>(one#:1),
        len<T#:0>(two#:2),
    ) && arrayEq#7825e3a8<T#:0>(one#:1, two#:2, eq#:0)),
}
```
*/
Eq_553b4b8e ArrayEq_bef2134a(
    Eq_553b4b8e eq_0
) {
    return Eq_553b4b8e(
        lambda-woops(one_1, two_2){
            ((len(one_1) == len(two_2)) && arrayEq_7825e3a8(one_1, two_2, eq_0));
        }
    );
}

/**
```
const getPerson#5d7fc4f0: () ={Read#22024b72}> Person#ba1e5642 = () ={Read#22024b72}> Person#ba1e5642{
    name#ba1e5642#0: getString#64605d94(),
    age#ba1e5642#1: 5,
}
```
*/
void getPerson_5d7fc4f0(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_2
) {
    nope_stmt_Expression;
}

/**
```
const getPersonName#5499a084: () ={Read#22024b72}> string = () ={Read#22024b72}> Person#ba1e5642{
    name#ba1e5642#0: getString#64605d94(),
    age#ba1e5642#1: 5,
}.name#ba1e5642#0
```
*/
void getPersonName_5499a084(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_3
) {
    nope_stmt_Expression;
}

/**
```
const getStringArr#3bfdbd8c: () ={Read#22024b72}> Array<string> = () ={Read#22024b72}> <string>[
    getString#64605d94(),
]
```
*/
void getStringArr_3bfdbd8c(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_2
) {
    nope_stmt_Expression;
}

/**
```
const provideIncrement#4ffa1f88: <T#:0>(string, int, () ={Read#22024b72}> T#:0) ={}> T#:0 = <T#:0>(
    v#:0: string,
    i#:1: int,
    fn#:2: () ={Read#22024b72}> T#:0,
) ={}> handle! fn#:2 {
    Read.read#0(() => k#:4) => 4ffa1f88<T#:0>(
        v#:0,
        (i#:1 + 1),
        () ={Read#22024b72}> k#:4((v#:0 + i#:1 as#1175499e string)),
    ),
    pure(v#:3) => v#:3,
}
```
*/
invalid_var provideIncrement_4ffa1f88(
    string v_0,
    int i_1,
    invalid_cps_lambda fn_2
) {
    invalid_var result_5;
    nope_stmt_Expression;
    return result_5;
}

/**
```
const spreadPerson#279e45cf: () ={Read#22024b72}> Person#ba1e5642 = () ={Read#22024b72}> Person#ba1e5642{
    ...getPerson#5d7fc4f0(),
    age#ba1e5642#1: 20,
}
```
*/
void spreadPerson_279e45cf(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_2
) {
    nope_stmt_Expression;
}

/**
```
const callAgain#a8135548: () ={Read#22024b72}> () ={}> string = () ={Read#22024b72}> {
    const v#:0 = getString#64605d94();
    () ={}> v#:0;
}
```
*/
void callAgain_a8135548(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_1
) {
    nope_stmt_Expression;
}

/**
```
const sideBar#2df6410a: (int) ={Read#22024b72}> string = (n#:0: int) ={Read#22024b72}> {
    if IntEq#9275f914."=="#553b4b8e#0(n#:0, 5) {
        getString#64605d94();
    } else {
        "wot";
    };
}
```
*/
void sideBar_2df6410a(
    int n_0,
    invalid_effect_handler handlers_15000,
    invalid_lambda done_1
) {
    if ((n_0 == 5)) {
        nope_stmt_Expression;
    } else {
        nope_stmt_Expression;
    };
}

/**
```
const ifYes#5bf7f75c: () ={Read#22024b72}> string = () ={Read#22024b72}> {
    if StringEq#606c7034."=="#553b4b8e#0(getString#64605d94(), "Yes") {
        "good";
    } else {
        "nope";
    };
}
```
*/
void ifYes_5bf7f75c(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_3
) {
    nope_stmt_Expression;
}

/**
```
const provideStringPlain#2dbf3eae: <T#:0>(string, () ={Read#22024b72}> T#:0) ={}> T#:0 = <T#:0>(
    v#:0: string,
    fn#:1: () ={Read#22024b72}> T#:0,
) ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => 2dbf3eae<T#:0>(v#:0, () ={Read#22024b72}> k#:3(v#:0)),
    pure(v#:2) => v#:2,
}
```
*/
invalid_var provideStringPlain_2dbf3eae(
    string v_0,
    invalid_cps_lambda fn_1
) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/**
```
const provideString#0247dd82: (string, () ={Read#22024b72}> string) ={}> string = (
    v#:0: string,
    fn#:1: () ={Read#22024b72}> string,
) ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => (0247dd82(v#:0, () ={Read#22024b72}> (k#:3((v#:0 + "got")) + "back")) + "provided"),
    pure(v#:2) => (v#:2 + "pure"),
}
```
*/
string provideString_0247dd82(
    string v_0,
    invalid_cps_lambda fn_1
) {
    string result_5;
    nope_stmt_Expression;
    return result_5;
}

/**
```
const unnamed#test_main: (GLSLEnv#451d5252, vec2) ={}> vec4 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: vec2,
) ={}> {
    const t0#:4 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#0247dd82("Yes", getString#64605d94),
        "Yesgotbackpureprovided",
    );
    const t1#:5 = StringEq#606c7034."=="#553b4b8e#0(
        ((provideStringPlain#2dbf3eae<string>("Yes", ifYes#5bf7f75c) + ":") + provideStringPlain#2dbf3eae<
            string,
        >("Yes?", ifYes#5bf7f75c)),
        "good:nope",
    );
    const t2#:6 = StringEq#606c7034."=="#553b4b8e#0(
        ((provideStringPlain#2dbf3eae<string>("Yes", () ={Read#22024b72}> sideBar#2df6410a(5)) + ":") + provideStringPlain#2dbf3eae<
            string,
        >("Yes?", () ={Read#22024b72}> sideBar#2df6410a(4))),
        "Yes:wot",
    );
    const t3#:7 = StringEq#606c7034."=="#553b4b8e#0(
        provideStringPlain#2dbf3eae<string>("what", () ={Read#22024b72}> callAgain#a8135548()()),
        "what",
    );
    const t4#:8 = StringEq#606c7034."=="#553b4b8e#0(
        provideStringPlain#2dbf3eae<Person#ba1e5642>("Me", getPerson#5d7fc4f0).name#ba1e5642#0,
        "Me",
    );
    const t5#:9 = StringEq#606c7034."=="#553b4b8e#0(
        provideStringPlain#2dbf3eae<Person#ba1e5642>("Me", spreadPerson#279e45cf).name#ba1e5642#0,
        "Me",
    );
    const t6#:10 = ArrayStringEq#0d35c408."=="#553b4b8e#0(
        provideIncrement#4ffa1f88<Array<string>>(
            "Hi",
            0,
            () ={Read#22024b72}> <string>[getString#64605d94(), getString#64605d94()],
        ),
        <string>["Hi0", "Hi1"],
    );
    const t7#:11 = ArrayStringEq#0d35c408."=="#553b4b8e#0(
        provideIncrement#4ffa1f88<Array<string>>(
            "Hi",
            0,
            () ={Read#22024b72}> <string>[...getStringArr#3bfdbd8c(), getString#64605d94()],
        ),
        <string>["Hi0", "Hi1"],
    );
    const t8#:12 = StringEq#606c7034."=="#553b4b8e#0(
        provideStringPlain#2dbf3eae<string>("ok", getPersonName#5499a084),
        "ok",
    );
    const size#:2 = (env#:0.resolution#451d5252#1.x#43802a16#0 / 20.0);
    const size#:3 = (size#:2 * 0.4);
    if (((((((((t0#:4 && (length((fragCoord#:1 - (vec2(1.0, 1.0) * size#:2))) < size#:3)) || (t1#:5 && (length(
        (fragCoord#:1 - (vec2(2.0, 1.0) * size#:2)),
    ) < size#:3))) || (t2#:6 && (length((fragCoord#:1 - (vec2(3.0, 1.0) * size#:2))) < size#:3))) || (t3#:7 && (length(
        (fragCoord#:1 - (vec2(4.0, 1.0) * size#:2)),
    ) < size#:3))) || (t4#:8 && (length((fragCoord#:1 - (vec2(5.0, 1.0) * size#:2))) < size#:3))) || (t5#:9 && (length(
        (fragCoord#:1 - (vec2(6.0, 1.0) * size#:2)),
    ) < size#:3))) || (t6#:10 && (length((fragCoord#:1 - (vec2(7.0, 1.0) * size#:2))) < size#:3))) || (t7#:11 && (length(
        (fragCoord#:1 - (vec2(8.0, 1.0) * size#:2)),
    ) < size#:3))) || (t8#:12 && (length((fragCoord#:1 - (vec2(9.0, 1.0) * size#:2))) < size#:3))) vec4(
        0.0,
        1.0,
        0.0,
        1.0,
    ) else if (((((((((!(t0#:4) && (length((fragCoord#:1 - (vec2(1.0, 1.0) * size#:2))) < size#:3)) || (!(
        t1#:5,
    ) && (length((fragCoord#:1 - (vec2(2.0, 1.0) * size#:2))) < size#:3))) || (!(t2#:6) && (length(
        (fragCoord#:1 - (vec2(3.0, 1.0) * size#:2)),
    ) < size#:3))) || (!(t3#:7) && (length((fragCoord#:1 - (vec2(4.0, 1.0) * size#:2))) < size#:3))) || (!(
        t4#:8,
    ) && (length((fragCoord#:1 - (vec2(5.0, 1.0) * size#:2))) < size#:3))) || (!(t5#:9) && (length(
        (fragCoord#:1 - (vec2(6.0, 1.0) * size#:2)),
    ) < size#:3))) || (!(t6#:10) && (length((fragCoord#:1 - (vec2(7.0, 1.0) * size#:2))) < size#:3))) || (!(
        t7#:11,
    ) && (length((fragCoord#:1 - (vec2(8.0, 1.0) * size#:2))) < size#:3))) || (!(t8#:12) && (length(
        (fragCoord#:1 - (vec2(9.0, 1.0) * size#:2)),
    ) < size#:3))) vec4(1.0, 0.0, 0.0, 1.0) else vec4(1.0, 1.0, 1.0, 1.0);
}
```
*/
vec4 Vtest_main(
    GLSLEnv_451d5252 env_0,
    vec2 fragCoord_1
) {
    bool t0_4 = stringEq(provideString_0247dd82(Yes, getString_64605d94), Yesgotbackpureprovided);
    bool t1_5 = stringEq(
        ((provideStringPlain_2dbf3eae(Yes, ifYes_5bf7f75c) + :) + provideStringPlain_2dbf3eae(
            Yes?,
            ifYes_5bf7f75c
        )),
        good:nope
    );
    bool t2_6 = stringEq(
        ((provideStringPlain_2dbf3eae(
            Yes,
            lambda-woops(handlers_15000, done_18){
                nope_stmt_Expression;
            }
        ) + :) + provideStringPlain_2dbf3eae(
            Yes?,
            lambda-woops(handlers_15000, done_21){
                nope_stmt_Expression;
            }
        )),
        Yes:wot
    );
    bool t3_7 = stringEq(
        provideStringPlain_2dbf3eae(
            what,
            lambda-woops(handlers_15000, done_24){
                nope_stmt_Expression;
            }
        ),
        what
    );
    bool t4_8 = stringEq(provideStringPlain_2dbf3eae(Me, getPerson_5d7fc4f0).hba1e5642_0, Me);
    bool t5_9 = stringEq(provideStringPlain_2dbf3eae(Me, spreadPerson_279e45cf).hba1e5642_0, Me);
    bool t6_10 = ArrayEq_bef2134a(Eq_553b4b8e(stringEq)).h553b4b8e_0(
        provideIncrement_4ffa1f88(
            Hi,
            0,
            lambda-woops(handlers_15000, done_27){
                nope_stmt_Expression;
            }
        ),
        nope_term_array
    );
    bool t7_11 = ArrayEq_bef2134a(Eq_553b4b8e(stringEq)).h553b4b8e_0(
        provideIncrement_4ffa1f88(
            Hi,
            0,
            lambda-woops(handlers_15000, done_32){
                nope_stmt_Expression;
            }
        ),
        nope_term_array
    );
    bool t8_12 = stringEq(provideStringPlain_2dbf3eae(ok, getPersonName_5499a084), ok);
    float size_2 = (env_0.resolution.x / 20.0);
    float size_3 = (size_2 * 0.40);
    if ((((((((((t0_4 && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3)) || (t1_5 && (length(
        (fragCoord_1 - (vec2(2.0, 1.0) * size_2))
    ) < size_3))) || (t2_6 && (length((fragCoord_1 - (vec2(3.0, 1.0) * size_2))) < size_3))) || (t3_7 && (length(
        (fragCoord_1 - (vec2(4.0, 1.0) * size_2))
    ) < size_3))) || (t4_8 && (length((fragCoord_1 - (vec2(5.0, 1.0) * size_2))) < size_3))) || (t5_9 && (length(
        (fragCoord_1 - (vec2(6.0, 1.0) * size_2))
    ) < size_3))) || (t6_10 && (length((fragCoord_1 - (vec2(7.0, 1.0) * size_2))) < size_3))) || (t7_11 && (length(
        (fragCoord_1 - (vec2(8.0, 1.0) * size_2))
    ) < size_3))) || (t8_12 && (length((fragCoord_1 - (vec2(9.0, 1.0) * size_2))) < size_3)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if ((((((((((!(t0_4) && (length((fragCoord_1 - (vec2(1.0, 1.0) * size_2))) < size_3)) || (!(
            t1_5
        ) && (length((fragCoord_1 - (vec2(2.0, 1.0) * size_2))) < size_3))) || (!(t2_6) && (length(
            (fragCoord_1 - (vec2(3.0, 1.0) * size_2))
        ) < size_3))) || (!(t3_7) && (length((fragCoord_1 - (vec2(4.0, 1.0) * size_2))) < size_3))) || (!(
            t4_8
        ) && (length((fragCoord_1 - (vec2(5.0, 1.0) * size_2))) < size_3))) || (!(t5_9) && (length(
            (fragCoord_1 - (vec2(6.0, 1.0) * size_2))
        ) < size_3))) || (!(t6_10) && (length((fragCoord_1 - (vec2(7.0, 1.0) * size_2))) < size_3))) || (!(
            t7_11
        ) && (length((fragCoord_1 - (vec2(8.0, 1.0) * size_2))) < size_3))) || (!(t8_12) && (length(
            (fragCoord_1 - (vec2(9.0, 1.0) * size_2))
        ) < size_3)))) {
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