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

// skipping Eq_553b4b8e, contains type variables

struct Person_066d8180{
    string h066d8180_0;
    int h066d8180_1;
};

/**
```
const getString#64605d94 = (): string ={Read#22024b72}> raise!(Read#22024b72.read())
```
*/
void getString_64605d94(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_1
) {
    nope_stmt_Expression;
}

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

/**
```
const getPerson#2a1f854a = (): Person#066d8180 ={Read#22024b72}> Person#066d8180{
    name#066d8180#0: getString#64605d94(),
    age#066d8180#1: 5,
}
```
*/
void getPerson_2a1f854a(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_2
) {
    nope_stmt_Expression;
}

/**
```
const getPersonName#3b2dbacb = (): string ={Read#22024b72}> Person#066d8180{
    name#066d8180#0: getString#64605d94(),
    age#066d8180#1: 5,
}.name#066d8180#0
```
*/
void getPersonName_3b2dbacb(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_3
) {
    nope_stmt_Expression;
}

/* -- generated -- */
string provideStringPlain_77fff6ae(string v_0, invalid_cps_lambda fn_1) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/**
```
const getStringArr#3bfdbd8c = (): Array<string> ={Read#22024b72}> <string>[getString#64605d94()]
```
*/
void getStringArr_3bfdbd8c(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_2
) {
    nope_stmt_Expression;
}

/* -- generated -- */
Array provideIncrement_07bba278(string v_0, int i_1, invalid_cps_lambda fn_2) {
    invalid_var result_5;
    nope_stmt_Expression;
    return result_5;
}

/* -- generated -- */
Eq_553b4b8e ArrayEq_37a56af4(Eq_553b4b8e eq_0) {
    return Eq_553b4b8e(
        lambda-woops(one_1, two_2){
            ((len(one_1) == len(two_2)) && arrayEq_cb18de62(one_1, two_2, eq_0));
        }
    );
}

/**
```
const spreadPerson#4668b1c3 = (): Person#066d8180 ={Read#22024b72}> Person#066d8180{
    ...getPerson#2a1f854a(),
    age#066d8180#1: 20,
}
```
*/
void spreadPerson_4668b1c3(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_2
) {
    nope_stmt_Expression;
}

/* -- generated -- */
Person_066d8180 provideStringPlain_328ce59c(
    string v_0,
    invalid_cps_lambda fn_1
) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/* -- generated -- */
Person_066d8180 provideStringPlain_2fdaac58(
    string v_0,
    invalid_cps_lambda fn_1
) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/**
```
const callAgain#a8135548 = (): () ={}> string ={Read#22024b72}> {
    const v#:0 = getString#64605d94();
    (): string ={}> v#:0;
}
```
*/
void callAgain_a8135548(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_1
) {
    nope_stmt_Expression;
}

/* -- generated -- */
string provideStringPlain_e40e69cc(string v_0, invalid_cps_lambda fn_1) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/* -- generated -- */
string provideStringPlain_00b70758(string v_0, invalid_cps_lambda fn_1) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/**
```
const sideBar#2df6410a = (n#:0: int): string ={Read#22024b72}> {
    if n#:0 ==#9275f914#553b4b8e#0 5 {
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

/* -- generated -- */
string provideStringPlain_0e4049d0(string v_0, invalid_cps_lambda fn_1) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/* -- generated -- */
string provideStringPlain_72cfc962(string v_0, invalid_cps_lambda fn_1) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/**
```
const ifYes#5bf7f75c = (): string ={Read#22024b72}> {
    if getString#64605d94() ==#606c7034#553b4b8e#0 "Yes" {
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

/* -- generated -- */
string provideStringPlain_3fd7e46c(string v_0, invalid_cps_lambda fn_1) {
    invalid_var result_4;
    nope_stmt_Expression;
    return result_4;
}

/* -- generated -- */
Array provideIncrement_88814478(string v_0, int i_1, invalid_cps_lambda fn_2) {
    invalid_var result_5;
    nope_stmt_Expression;
    return result_5;
}

/**
```
const unnamed#test_main = (env#:0: GLSLEnv#451d5252, fragCoord#:1: vec2): vec4 ={}> {
    const t0#:4 = provideString#0247dd82("Yes", getString#64605d94) ==#606c7034#553b4b8e#0 "Yesgotbackpureprovided";
    const t1#:5 = provideStringPlain#2dbf3eae<string>("Yes", ifYes#5bf7f75c) + ":" + provideStringPlain#2dbf3eae<
        string,
    >("Yes?", ifYes#5bf7f75c) ==#606c7034#553b4b8e#0 "good:nope";
    const t2#:6 = provideStringPlain#2dbf3eae<string>(
        "Yes",
        (): string ={Read#22024b72}> sideBar#2df6410a(5),
    ) + ":" + provideStringPlain#2dbf3eae<string>(
        "Yes?",
        (): string ={Read#22024b72}> sideBar#2df6410a(4),
    ) ==#606c7034#553b4b8e#0 "Yes:wot";
    const t3#:7 = provideStringPlain#2dbf3eae<string>(
        "what",
        (): string ={Read#22024b72}> callAgain#a8135548()(),
    ) ==#606c7034#553b4b8e#0 "what";
    const t4#:8 = provideStringPlain#2dbf3eae<Person#066d8180>("Me", getPerson#2a1f854a).name#066d8180#0 ==#606c7034#553b4b8e#0 "Me";
    const t5#:9 = provideStringPlain#2dbf3eae<Person#066d8180>("Me", spreadPerson#4668b1c3).name#066d8180#0 ==#606c7034#553b4b8e#0 "Me";
    const t6#:10 = provideIncrement#4ffa1f88<Array<string>>(
        "Hi",
        0,
        (): Array<string> ={Read#22024b72}> <string>[getString#64605d94(), getString#64605d94()],
    ) ==#0d35c408#553b4b8e#0 <string>["Hi0", "Hi1"];
    const t7#:11 = provideIncrement#4ffa1f88<Array<string>>(
        "Hi",
        0,
        (): Array<string> ={Read#22024b72}> <string>[
            ...getStringArr#3bfdbd8c(),
            getString#64605d94(),
        ],
    ) ==#0d35c408#553b4b8e#0 <string>["Hi0", "Hi1"];
    const t8#:12 = provideStringPlain#2dbf3eae<string>("ok", getPersonName#3b2dbacb) ==#606c7034#553b4b8e#0 "ok";
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
    ) < size#:3) || (t8#:12 && length(fragCoord#:1 - vec2(9.0, 1.0) * size#:2) < size#:3) vec4(
        0.0,
        1.0,
        0.0,
        1.0,
    ) else if (!(t0#:4) && length(fragCoord#:1 - vec2(1.0, 1.0) * size#:2) < size#:3) || (!(t1#:5) && length(
        fragCoord#:1 - vec2(2.0, 1.0) * size#:2,
    ) < size#:3) || (!(t2#:6) && length(fragCoord#:1 - vec2(3.0, 1.0) * size#:2) < size#:3) || (!(
        t3#:7,
    ) && length(fragCoord#:1 - vec2(4.0, 1.0) * size#:2) < size#:3) || (!(t4#:8) && length(
        fragCoord#:1 - vec2(5.0, 1.0) * size#:2,
    ) < size#:3) || (!(t5#:9) && length(fragCoord#:1 - vec2(6.0, 1.0) * size#:2) < size#:3) || (!(
        t6#:10,
    ) && length(fragCoord#:1 - vec2(7.0, 1.0) * size#:2) < size#:3) || (!(t7#:11) && length(
        fragCoord#:1 - vec2(8.0, 1.0) * size#:2,
    ) < size#:3) || (!(t8#:12) && length(fragCoord#:1 - vec2(9.0, 1.0) * size#:2) < size#:3) vec4(
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
    bool t0_4 = (provideString_0247dd82(Yes, getString_64605d94) == Yesgotbackpureprovided);
    bool t1_5 = (((provideStringPlain_3fd7e46c(Yes, ifYes_5bf7f75c) + :) + provideStringPlain_72cfc962(
        Yes?,
        ifYes_5bf7f75c
    )) == good:nope);
    bool t2_6 = (((provideStringPlain_0e4049d0(
        Yes,
        lambda-woops(handlers_15000, done_18){
            nope_stmt_Expression;
        }
    ) + :) + provideStringPlain_00b70758(
        Yes?,
        lambda-woops(handlers_15000, done_21){
            nope_stmt_Expression;
        }
    )) == Yes:wot);
    bool t3_7 = (provideStringPlain_e40e69cc(
        what,
        lambda-woops(handlers_15000, done_24){
            nope_stmt_Expression;
        }
    ) == what);
    bool t4_8 = (provideStringPlain_2fdaac58(Me, getPerson_2a1f854a).h066d8180_0 == Me);
    bool t5_9 = (provideStringPlain_328ce59c(Me, spreadPerson_4668b1c3).h066d8180_0 == Me);
    bool t6_10 = ArrayEq_37a56af4(Eq_553b4b8e(==)).h553b4b8e_0(
        provideIncrement_07bba278(
            Hi,
            0,
            lambda-woops(handlers_15000, done_27){
                nope_stmt_Expression;
            }
        ),
        nope_term_array
    );
    bool t7_11 = ArrayEq_37a56af4(Eq_553b4b8e(==)).h553b4b8e_0(
        provideIncrement_88814478(
            Hi,
            0,
            lambda-woops(handlers_15000, done_32){
                nope_stmt_Expression;
            }
        ),
        nope_term_array
    );
    bool t8_12 = (provideStringPlain_77fff6ae(ok, getPersonName_3b2dbacb) == ok);
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