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

/**
```
const pure#33e34a3a: () ={}> string = () ={}> "AA"
```
*/
string pure_33e34a3a() {
    return AA;
}

/**
```
const freturn#38ab4eac: () ={}> string = () ={}> "yes"
```
*/
string freturn_38ab4eac() {
    return yes;
}

/* -- generated -- */
void V7ebb0318(
    string arg_0,
    invalid_effect_handler handlers_15000,
    invalid_lambda done_24
) {
    nope_stmt_Expression;
}

/**
```
const provideStringWithArg#8366c3ec: (string) ={}> (string, (string) ={GetString#22024b72}> string) ={}> string = (
    responseValue#:0: string,
) ={}> (passIn#:1: string, fn#:2: (string) ={GetString#22024b72}> string) ={}> {
    handle! () ={GetString#22024b72}> fn#:2(passIn#:1) {
        GetString.get#0(() => k#:4) => provideString#1d302ade((responseValue#:0 ++ "."))(
            () ={GetString#22024b72}> k#:4(responseValue#:0),
        ),
        pure(a#:3) => a#:3,
    };
}
```
*/
invalid_lambda provideStringWithArg_8366c3ec(
    string responseValue_0
) {
    return lambda-woops(passIn_1, fn_2){
        string result_5;
        nope_stmt_Expression;
        return result_5;
    };
}

/* -- generated -- */
void Ve094f8ca(invalid_effect_handler handlers_15000, invalid_lambda done_23) {
    nope_stmt_Expression;
}

/* -- generated -- */
void V5397bc18(invalid_effect_handler handlers_15000, invalid_lambda done_22) {
    nope_stmt_Expression;
}

/**
```
const impure#74eaa230: () ={GetString#22024b72}> string = () ={GetString#22024b72}> "A"
```
*/
void impure_74eaa230(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_1
) {
    nope_stmt_Expression;
}

/* -- generated -- */
void V6cab3c32(invalid_effect_handler handlers_15000, invalid_lambda done_21) {
    nope_stmt_Expression;
}

/* -- generated -- */
string identity_66787b36(string x_0) {
    return x_0;
}

/**
```
const arg#7578690a: (string) ={}> string = (arg#:0: string) ={}> (arg#:0 ++ "1")
```
*/
string arg_7578690a(
    string arg_0
) {
    return ++(arg_0, 1);
}

/**
```
const call#5e9cab43: () ={}> string = () ={}> (freturn#38ab4eac() + "a")
```
*/
string call_5e9cab43() {
    return (freturn_38ab4eac() + a);
}

/**
```
const unnamed#test_main: (GLSLEnv#451d5252, vec2) ={}> vec4 = (
    env#:1: GLSLEnv#451d5252,
    fragCoord#:2: vec2,
) ={}> {
    const t0#:5 = true;
    const t1#:6 = StringEq#606c7034."=="#553b4b8e#0("hi", "hi");
    const t2#:7 = StringEq#606c7034."=="#553b4b8e#0(freturn#38ab4eac(), "yes");
    const t3#:8 = StringEq#606c7034."=="#553b4b8e#0(call#5e9cab43(), "yesa");
    const t4#:9 = StringEq#606c7034."=="#553b4b8e#0(arg#7578690a("2"), "21");
    const t5#:10 = StringEq#606c7034."=="#553b4b8e#0((identity#d762885a<string>("5") ++ "4"), "54");
    const t6#:11 = IntEq#9275f914."=="#553b4b8e#0(2, (1 + 1));
    const t7#:12 = IntEq#9275f914."=="#553b4b8e#0((2 + (3 * 4)), (16 - 2));
    const t8#:13 = FloatEq#c41f7386."=="#553b4b8e#0((2.2 * 2.0), 4.4);
    const t9#:14 = IntEq#9275f914."=="#553b4b8e#0((2 ^ 3), 8);
    const t10#:15 = FloatEq#c41f7386."=="#553b4b8e#0(sqrt((2.0 * 2.0)), 2.0);
    const t11#:16 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#1d302ade("hi")(() ={GetString#22024b72}> "m"),
        "m",
    );
    const t12#:17 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#1d302ade("hi")(impure#74eaa230),
        "A",
    );
    const t13#:18 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#1d302ade("hi")(() ={GetString#22024b72}> pure#33e34a3a()),
        "AA",
    );
    const t14#:19 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#1d302ade("hi")(() ={GetString#22024b72}> "m"),
        "m",
    );
    const t15#:20 = StringEq#606c7034."=="#553b4b8e#0(
        provideStringWithArg#8366c3ec("hi")(
            "Passed in",
            (arg#:0: string) ={GetString#22024b72}> (arg#:0 ++ "-m"),
        ),
        "Passed in-m",
    );
    const size#:3 = (env#:1.resolution#451d5252#1.x#43802a16#0 / 20.0);
    const size#:4 = (size#:3 * 0.4);
    if ((((((((((((((((t0#:5 && (length((fragCoord#:2 - (vec2(1.0, 1.0) * size#:3))) < size#:4)) || (t1#:6 && (length(
        (fragCoord#:2 - (vec2(2.0, 1.0) * size#:3)),
    ) < size#:4))) || (t2#:7 && (length((fragCoord#:2 - (vec2(3.0, 1.0) * size#:3))) < size#:4))) || (t3#:8 && (length(
        (fragCoord#:2 - (vec2(4.0, 1.0) * size#:3)),
    ) < size#:4))) || (t4#:9 && (length((fragCoord#:2 - (vec2(5.0, 1.0) * size#:3))) < size#:4))) || (t5#:10 && (length(
        (fragCoord#:2 - (vec2(6.0, 1.0) * size#:3)),
    ) < size#:4))) || (t6#:11 && (length((fragCoord#:2 - (vec2(7.0, 1.0) * size#:3))) < size#:4))) || (t7#:12 && (length(
        (fragCoord#:2 - (vec2(8.0, 1.0) * size#:3)),
    ) < size#:4))) || (t8#:13 && (length((fragCoord#:2 - (vec2(9.0, 1.0) * size#:3))) < size#:4))) || (t9#:14 && (length(
        (fragCoord#:2 - (vec2(10.0, 1.0) * size#:3)),
    ) < size#:4))) || (t10#:15 && (length((fragCoord#:2 - (vec2(11.0, 1.0) * size#:3))) < size#:4))) || (t11#:16 && (length(
        (fragCoord#:2 - (vec2(12.0, 1.0) * size#:3)),
    ) < size#:4))) || (t12#:17 && (length((fragCoord#:2 - (vec2(13.0, 1.0) * size#:3))) < size#:4))) || (t13#:18 && (length(
        (fragCoord#:2 - (vec2(14.0, 1.0) * size#:3)),
    ) < size#:4))) || (t14#:19 && (length((fragCoord#:2 - (vec2(15.0, 1.0) * size#:3))) < size#:4))) || (t15#:20 && (length(
        (fragCoord#:2 - (vec2(16.0, 1.0) * size#:3)),
    ) < size#:4))) vec4(0.0, 1.0, 0.0, 1.0) else if ((((((((((((((((!(t0#:5) && (length(
        (fragCoord#:2 - (vec2(1.0, 1.0) * size#:3)),
    ) < size#:4)) || (!(t1#:6) && (length((fragCoord#:2 - (vec2(2.0, 1.0) * size#:3))) < size#:4))) || (!(
        t2#:7,
    ) && (length((fragCoord#:2 - (vec2(3.0, 1.0) * size#:3))) < size#:4))) || (!(t3#:8) && (length(
        (fragCoord#:2 - (vec2(4.0, 1.0) * size#:3)),
    ) < size#:4))) || (!(t4#:9) && (length((fragCoord#:2 - (vec2(5.0, 1.0) * size#:3))) < size#:4))) || (!(
        t5#:10,
    ) && (length((fragCoord#:2 - (vec2(6.0, 1.0) * size#:3))) < size#:4))) || (!(t6#:11) && (length(
        (fragCoord#:2 - (vec2(7.0, 1.0) * size#:3)),
    ) < size#:4))) || (!(t7#:12) && (length((fragCoord#:2 - (vec2(8.0, 1.0) * size#:3))) < size#:4))) || (!(
        t8#:13,
    ) && (length((fragCoord#:2 - (vec2(9.0, 1.0) * size#:3))) < size#:4))) || (!(t9#:14) && (length(
        (fragCoord#:2 - (vec2(10.0, 1.0) * size#:3)),
    ) < size#:4))) || (!(t10#:15) && (length((fragCoord#:2 - (vec2(11.0, 1.0) * size#:3))) < size#:4))) || (!(
        t11#:16,
    ) && (length((fragCoord#:2 - (vec2(12.0, 1.0) * size#:3))) < size#:4))) || (!(t12#:17) && (length(
        (fragCoord#:2 - (vec2(13.0, 1.0) * size#:3)),
    ) < size#:4))) || (!(t13#:18) && (length((fragCoord#:2 - (vec2(14.0, 1.0) * size#:3))) < size#:4))) || (!(
        t14#:19,
    ) && (length((fragCoord#:2 - (vec2(15.0, 1.0) * size#:3))) < size#:4))) || (!(t15#:20) && (length(
        (fragCoord#:2 - (vec2(16.0, 1.0) * size#:3)),
    ) < size#:4))) vec4(1.0, 0.0, 0.0, 1.0) else vec4(1.0, 1.0, 1.0, 1.0);
}
```
*/
vec4 Vtest_main(
    GLSLEnv_451d5252 env_1,
    vec2 fragCoord_2
) {
    bool t0_5 = nope_term_boolean;
    bool t1_6 = stringEq(hi, hi);
    bool t2_7 = stringEq(freturn_38ab4eac(), yes);
    bool t3_8 = stringEq(call_5e9cab43(), yesa);
    bool t4_9 = stringEq(arg_7578690a(2), 21);
    bool t5_10 = stringEq(++(identity_66787b36(5), 4), 54);
    bool t6_11 = (2 == (1 + 1));
    bool t7_12 = ((2 + (3 * 4)) == (16 - 2));
    bool t8_13 = ((2.20 * 2.0) == 4.40);
    bool t9_14 = ((2 ^ 3) == 8);
    bool t10_15 = (sqrt((2.0 * 2.0)) == 2.0);
    bool t11_16 = stringEq(provideString_1d302ade(hi)(V6cab3c32), m);
    bool t12_17 = stringEq(provideString_1d302ade(hi)(impure_74eaa230), A);
    bool t13_18 = stringEq(provideString_1d302ade(hi)(V5397bc18), AA);
    bool t14_19 = stringEq(provideString_1d302ade(hi)(Ve094f8ca), m);
    bool t15_20 = stringEq(provideStringWithArg_8366c3ec(hi)(Passed in, V7ebb0318), Passed in-m);
    float size_3 = (env_1.resolution.x / 20.0);
    float size_4 = (size_3 * 0.40);
    if (((((((((((((((((t0_5 && (length((fragCoord_2 - (vec2(1.0, 1.0) * size_3))) < size_4)) || (t1_6 && (length(
        (fragCoord_2 - (vec2(2.0, 1.0) * size_3))
    ) < size_4))) || (t2_7 && (length((fragCoord_2 - (vec2(3.0, 1.0) * size_3))) < size_4))) || (t3_8 && (length(
        (fragCoord_2 - (vec2(4.0, 1.0) * size_3))
    ) < size_4))) || (t4_9 && (length((fragCoord_2 - (vec2(5.0, 1.0) * size_3))) < size_4))) || (t5_10 && (length(
        (fragCoord_2 - (vec2(6.0, 1.0) * size_3))
    ) < size_4))) || (t6_11 && (length((fragCoord_2 - (vec2(7.0, 1.0) * size_3))) < size_4))) || (t7_12 && (length(
        (fragCoord_2 - (vec2(8.0, 1.0) * size_3))
    ) < size_4))) || (t8_13 && (length((fragCoord_2 - (vec2(9.0, 1.0) * size_3))) < size_4))) || (t9_14 && (length(
        (fragCoord_2 - (vec2(10.0, 1.0) * size_3))
    ) < size_4))) || (t10_15 && (length((fragCoord_2 - (vec2(11.0, 1.0) * size_3))) < size_4))) || (t11_16 && (length(
        (fragCoord_2 - (vec2(12.0, 1.0) * size_3))
    ) < size_4))) || (t12_17 && (length((fragCoord_2 - (vec2(13.0, 1.0) * size_3))) < size_4))) || (t13_18 && (length(
        (fragCoord_2 - (vec2(14.0, 1.0) * size_3))
    ) < size_4))) || (t14_19 && (length((fragCoord_2 - (vec2(15.0, 1.0) * size_3))) < size_4))) || (t15_20 && (length(
        (fragCoord_2 - (vec2(16.0, 1.0) * size_3))
    ) < size_4)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if (((((((((((((((((!(t0_5) && (length((fragCoord_2 - (vec2(1.0, 1.0) * size_3))) < size_4)) || (!(
            t1_6
        ) && (length((fragCoord_2 - (vec2(2.0, 1.0) * size_3))) < size_4))) || (!(t2_7) && (length(
            (fragCoord_2 - (vec2(3.0, 1.0) * size_3))
        ) < size_4))) || (!(t3_8) && (length((fragCoord_2 - (vec2(4.0, 1.0) * size_3))) < size_4))) || (!(
            t4_9
        ) && (length((fragCoord_2 - (vec2(5.0, 1.0) * size_3))) < size_4))) || (!(t5_10) && (length(
            (fragCoord_2 - (vec2(6.0, 1.0) * size_3))
        ) < size_4))) || (!(t6_11) && (length((fragCoord_2 - (vec2(7.0, 1.0) * size_3))) < size_4))) || (!(
            t7_12
        ) && (length((fragCoord_2 - (vec2(8.0, 1.0) * size_3))) < size_4))) || (!(t8_13) && (length(
            (fragCoord_2 - (vec2(9.0, 1.0) * size_3))
        ) < size_4))) || (!(t9_14) && (length((fragCoord_2 - (vec2(10.0, 1.0) * size_3))) < size_4))) || (!(
            t10_15
        ) && (length((fragCoord_2 - (vec2(11.0, 1.0) * size_3))) < size_4))) || (!(t11_16) && (length(
            (fragCoord_2 - (vec2(12.0, 1.0) * size_3))
        ) < size_4))) || (!(t12_17) && (length((fragCoord_2 - (vec2(13.0, 1.0) * size_3))) < size_4))) || (!(
            t13_18
        ) && (length((fragCoord_2 - (vec2(14.0, 1.0) * size_3))) < size_4))) || (!(t14_19) && (length(
            (fragCoord_2 - (vec2(15.0, 1.0) * size_3))
        ) < size_4))) || (!(t15_20) && (length((fragCoord_2 - (vec2(16.0, 1.0) * size_3))) < size_4)))) {
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