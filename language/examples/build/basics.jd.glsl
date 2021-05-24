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
const provideString#1d302ade: (string) ={}> (() ={GetString#22024b72}> string) ={}> string = (
    responseValue#:0: string,
) ={}> (fn#:1: () ={GetString#22024b72}> string) ={}> {
    handle! fn#:1 {
        GetString.get#0(() => k#:3) => 1d302ade((responseValue#:0 ++ "."))(
            () ={GetString#22024b72}> k#:3(responseValue#:0),
        ),
        pure(a#:2) => a#:2,
    };
}
```
*/
invalid_lambda provideString_1d302ade(
    string responseValue_0
) {
    return lambda-woops(fn_1){
        string result_4;
        nope_stmt_Expression;
        return result_4;
    };
}

/**
```
const freturn#38ab4eac: () ={}> string = () ={}> "yes"
```
*/
string freturn_38ab4eac() {
    return yes;
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
const impure#74eaa230: () ={GetString#22024b72}> string = () ={GetString#22024b72}> "A"
```
*/
void impure_74eaa230(
    invalid_effect_handler handlers_15000,
    invalid_lambda done_1
) {
    nope_stmt_Expression;
}

/**
```
const identity#d762885a: <T#:0>(T#:0) ={}> T#:0 = <T#:0>(x#:0: T#:0) ={}> x#:0
```
*/
invalid_var identity_d762885a(
    invalid_var x_0
) {
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
const unnamed#test_main: (GLSLEnv#451d5252, unnamed#629a8360) ={}> unnamed#5026f640 = (
    env#:1: GLSLEnv#451d5252,
    fragCoord#:2: unnamed#629a8360,
) ={}> {
    const t0#:4 = true;
    const t1#:5 = StringEq#606c7034."=="#553b4b8e#0("hi", "hi");
    const t2#:6 = StringEq#606c7034."=="#553b4b8e#0(freturn#38ab4eac(), "yes");
    const t3#:7 = StringEq#606c7034."=="#553b4b8e#0(call#5e9cab43(), "yesa");
    const t4#:8 = StringEq#606c7034."=="#553b4b8e#0(arg#7578690a("2"), "21");
    const t5#:9 = StringEq#606c7034."=="#553b4b8e#0((identity#d762885a<string>("5") ++ "4"), "54");
    const t6#:10 = IntEq#9275f914."=="#553b4b8e#0(2, (1 + 1));
    const t7#:11 = IntEq#9275f914."=="#553b4b8e#0((2 + (3 * 4)), (16 - 2));
    const t8#:12 = FloatEq#c41f7386."=="#553b4b8e#0((2.2 * 2.0), 4.4);
    const t9#:13 = IntEq#9275f914."=="#553b4b8e#0((2 ^ 3), 8);
    const t10#:14 = FloatEq#c41f7386."=="#553b4b8e#0(sqrt((2.0 * 2.0)), 2.0);
    const t11#:15 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#1d302ade("hi")(() ={GetString#22024b72}> "m"),
        "m",
    );
    const t12#:16 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#1d302ade("hi")(impure#74eaa230),
        "A",
    );
    const t13#:17 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#1d302ade("hi")(() ={GetString#22024b72}> pure#33e34a3a()),
        "AA",
    );
    const t14#:18 = StringEq#606c7034."=="#553b4b8e#0(
        provideString#1d302ade("hi")(() ={GetString#22024b72}> "m"),
        "m",
    );
    const t15#:19 = StringEq#606c7034."=="#553b4b8e#0(
        provideStringWithArg#8366c3ec("hi")(
            "Passed in",
            (arg#:0: string) ={GetString#22024b72}> (arg#:0 ++ "-m"),
        ),
        "Passed in-m",
    );
    const size#:3 = env#:1.resolution#451d5252#1.x#43802a16#0;
    if ((((((((((((((((t0#:4 && (length((fragCoord#:2 - (vec2(0.0, 0.0) * size#:3))) < size#:3)) || (t1#:5 && (length(
        (fragCoord#:2 - (vec2(1.0, 0.0) * size#:3)),
    ) < size#:3))) || (t2#:6 && (length((fragCoord#:2 - (vec2(2.0, 0.0) * size#:3))) < size#:3))) || (t3#:7 && (length(
        (fragCoord#:2 - (vec2(3.0, 0.0) * size#:3)),
    ) < size#:3))) || (t4#:8 && (length((fragCoord#:2 - (vec2(4.0, 0.0) * size#:3))) < size#:3))) || (t5#:9 && (length(
        (fragCoord#:2 - (vec2(5.0, 0.0) * size#:3)),
    ) < size#:3))) || (t6#:10 && (length((fragCoord#:2 - (vec2(6.0, 0.0) * size#:3))) < size#:3))) || (t7#:11 && (length(
        (fragCoord#:2 - (vec2(7.0, 0.0) * size#:3)),
    ) < size#:3))) || (t8#:12 && (length((fragCoord#:2 - (vec2(8.0, 0.0) * size#:3))) < size#:3))) || (t9#:13 && (length(
        (fragCoord#:2 - (vec2(9.0, 0.0) * size#:3)),
    ) < size#:3))) || (t10#:14 && (length((fragCoord#:2 - (vec2(10.0, 0.0) * size#:3))) < size#:3))) || (t11#:15 && (length(
        (fragCoord#:2 - (vec2(11.0, 0.0) * size#:3)),
    ) < size#:3))) || (t12#:16 && (length((fragCoord#:2 - (vec2(12.0, 0.0) * size#:3))) < size#:3))) || (t13#:17 && (length(
        (fragCoord#:2 - (vec2(13.0, 0.0) * size#:3)),
    ) < size#:3))) || (t14#:18 && (length((fragCoord#:2 - (vec2(14.0, 0.0) * size#:3))) < size#:3))) || (t15#:19 && (length(
        (fragCoord#:2 - (vec2(15.0, 0.0) * size#:3)),
    ) < size#:3))) vec4(0.0, 1.0, 0.0, 1.0) else if ((((((((((((((((!(t0#:4) && (length(
        (fragCoord#:2 - (vec2(0.0, 0.0) * size#:3)),
    ) < size#:3)) || (!(t1#:5) && (length((fragCoord#:2 - (vec2(1.0, 0.0) * size#:3))) < size#:3))) || (!(
        t2#:6,
    ) && (length((fragCoord#:2 - (vec2(2.0, 0.0) * size#:3))) < size#:3))) || (!(t3#:7) && (length(
        (fragCoord#:2 - (vec2(3.0, 0.0) * size#:3)),
    ) < size#:3))) || (!(t4#:8) && (length((fragCoord#:2 - (vec2(4.0, 0.0) * size#:3))) < size#:3))) || (!(
        t5#:9,
    ) && (length((fragCoord#:2 - (vec2(5.0, 0.0) * size#:3))) < size#:3))) || (!(t6#:10) && (length(
        (fragCoord#:2 - (vec2(6.0, 0.0) * size#:3)),
    ) < size#:3))) || (!(t7#:11) && (length((fragCoord#:2 - (vec2(7.0, 0.0) * size#:3))) < size#:3))) || (!(
        t8#:12,
    ) && (length((fragCoord#:2 - (vec2(8.0, 0.0) * size#:3))) < size#:3))) || (!(t9#:13) && (length(
        (fragCoord#:2 - (vec2(9.0, 0.0) * size#:3)),
    ) < size#:3))) || (!(t10#:14) && (length((fragCoord#:2 - (vec2(10.0, 0.0) * size#:3))) < size#:3))) || (!(
        t11#:15,
    ) && (length((fragCoord#:2 - (vec2(11.0, 0.0) * size#:3))) < size#:3))) || (!(t12#:16) && (length(
        (fragCoord#:2 - (vec2(12.0, 0.0) * size#:3)),
    ) < size#:3))) || (!(t13#:17) && (length((fragCoord#:2 - (vec2(13.0, 0.0) * size#:3))) < size#:3))) || (!(
        t14#:18,
    ) && (length((fragCoord#:2 - (vec2(14.0, 0.0) * size#:3))) < size#:3))) || (!(t15#:19) && (length(
        (fragCoord#:2 - (vec2(15.0, 0.0) * size#:3)),
    ) < size#:3))) vec4(1.0, 0.0, 0.0, 1.0) else vec4(1.0, 1.0, 1.0, 1.0);
}
```
*/
T5026f640 Vtest_main(
    GLSLEnv_451d5252 env_1,
    T629a8360 fragCoord_2
) {
    bool t0_4 = nope_term_boolean;
    bool t1_5 = stringEq(hi, hi);
    bool t2_6 = stringEq(freturn_38ab4eac(), yes);
    bool t3_7 = stringEq(call_5e9cab43(), yesa);
    bool t4_8 = stringEq(arg_7578690a(2), 21);
    bool t5_9 = stringEq(++(identity_d762885a(5), 4), 54);
    bool t6_10 = (2 == (1 + 1));
    bool t7_11 = ((2 + (3 * 4)) == (16 - 2));
    bool t8_12 = ((2.20 * 2.0) == 4.40);
    bool t9_13 = ((2 ^ 3) == 8);
    bool t10_14 = (sqrt((2.0 * 2.0)) == 2.0);
    bool t11_15 = stringEq(
        provideString_1d302ade(hi)(lambda-woops(handlers_15000, done_20){
            nope_stmt_Expression;
        }),
        m
    );
    bool t12_16 = stringEq(provideString_1d302ade(hi)(impure_74eaa230), A);
    bool t13_17 = stringEq(
        provideString_1d302ade(hi)(lambda-woops(handlers_15000, done_21){
            nope_stmt_Expression;
        }),
        AA
    );
    bool t14_18 = stringEq(
        provideString_1d302ade(hi)(lambda-woops(handlers_15000, done_22){
            nope_stmt_Expression;
        }),
        m
    );
    bool t15_19 = stringEq(
        provideStringWithArg_8366c3ec(hi)(
            Passed in,
            lambda-woops(arg_0, handlers_15000, done_23){
                nope_stmt_Expression;
            }
        ),
        Passed in-m
    );
    float size_3 = env_1.resolution.x;
    if (((((((((((((((((t0_4 && (length((fragCoord_2 - (vec2(0.0, 0.0) * size_3))) < size_3)) || (t1_5 && (length(
        (fragCoord_2 - (vec2(1.0, 0.0) * size_3))
    ) < size_3))) || (t2_6 && (length((fragCoord_2 - (vec2(2.0, 0.0) * size_3))) < size_3))) || (t3_7 && (length(
        (fragCoord_2 - (vec2(3.0, 0.0) * size_3))
    ) < size_3))) || (t4_8 && (length((fragCoord_2 - (vec2(4.0, 0.0) * size_3))) < size_3))) || (t5_9 && (length(
        (fragCoord_2 - (vec2(5.0, 0.0) * size_3))
    ) < size_3))) || (t6_10 && (length((fragCoord_2 - (vec2(6.0, 0.0) * size_3))) < size_3))) || (t7_11 && (length(
        (fragCoord_2 - (vec2(7.0, 0.0) * size_3))
    ) < size_3))) || (t8_12 && (length((fragCoord_2 - (vec2(8.0, 0.0) * size_3))) < size_3))) || (t9_13 && (length(
        (fragCoord_2 - (vec2(9.0, 0.0) * size_3))
    ) < size_3))) || (t10_14 && (length((fragCoord_2 - (vec2(10.0, 0.0) * size_3))) < size_3))) || (t11_15 && (length(
        (fragCoord_2 - (vec2(11.0, 0.0) * size_3))
    ) < size_3))) || (t12_16 && (length((fragCoord_2 - (vec2(12.0, 0.0) * size_3))) < size_3))) || (t13_17 && (length(
        (fragCoord_2 - (vec2(13.0, 0.0) * size_3))
    ) < size_3))) || (t14_18 && (length((fragCoord_2 - (vec2(14.0, 0.0) * size_3))) < size_3))) || (t15_19 && (length(
        (fragCoord_2 - (vec2(15.0, 0.0) * size_3))
    ) < size_3)))) {
        return vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        if (((((((((((((((((!(t0_4) && (length((fragCoord_2 - (vec2(0.0, 0.0) * size_3))) < size_3)) || (!(
            t1_5
        ) && (length((fragCoord_2 - (vec2(1.0, 0.0) * size_3))) < size_3))) || (!(t2_6) && (length(
            (fragCoord_2 - (vec2(2.0, 0.0) * size_3))
        ) < size_3))) || (!(t3_7) && (length((fragCoord_2 - (vec2(3.0, 0.0) * size_3))) < size_3))) || (!(
            t4_8
        ) && (length((fragCoord_2 - (vec2(4.0, 0.0) * size_3))) < size_3))) || (!(t5_9) && (length(
            (fragCoord_2 - (vec2(5.0, 0.0) * size_3))
        ) < size_3))) || (!(t6_10) && (length((fragCoord_2 - (vec2(6.0, 0.0) * size_3))) < size_3))) || (!(
            t7_11
        ) && (length((fragCoord_2 - (vec2(7.0, 0.0) * size_3))) < size_3))) || (!(t8_12) && (length(
            (fragCoord_2 - (vec2(8.0, 0.0) * size_3))
        ) < size_3))) || (!(t9_13) && (length((fragCoord_2 - (vec2(9.0, 0.0) * size_3))) < size_3))) || (!(
            t10_14
        ) && (length((fragCoord_2 - (vec2(10.0, 0.0) * size_3))) < size_3))) || (!(t11_15) && (length(
            (fragCoord_2 - (vec2(11.0, 0.0) * size_3))
        ) < size_3))) || (!(t12_16) && (length((fragCoord_2 - (vec2(12.0, 0.0) * size_3))) < size_3))) || (!(
            t13_17
        ) && (length((fragCoord_2 - (vec2(13.0, 0.0) * size_3))) < size_3))) || (!(t14_18) && (length(
            (fragCoord_2 - (vec2(14.0, 0.0) * size_3))
        ) < size_3))) || (!(t15_19) && (length((fragCoord_2 - (vec2(15.0, 0.0) * size_3))) < size_3)))) {
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