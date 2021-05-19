import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];

/**
```
type As#As<T#:10000, T#:10001> = {
    as: (T#:10000) ={}> Y#:10001,
}
```
*/
type t_As<T_10000, T_10001> = {
  type: "As";
  hAs_0: (arg_0: T_10000) => T_10001;
};

/**
```
type None#None = {}
```
*/
type t_None = {
  type: "None";
};

/**
```
type Some#Some<T#:10000> = {
    contents: T#:10000,
}
```
*/
type t_Some<T_10000> = {
  type: "Some";
  hSome_0: T_10000;
};

/**
```
type ToStr#b416ead2<T#:0> = {
    str: (T#:0) ={}> string,
}
```
*/
type t_b416ead2<T_0> = {
  type: "b416ead2";
  hb416ead2_0: (arg_0: T_0) => string;
};

/**
```
type ToFloat#c13d2c8a<T#:0> = {
    float: (T#:0) ={}> float,
}
```
*/
type t_c13d2c8a<T_0> = {
  type: "c13d2c8a";
  hc13d2c8a_0: (arg_0: T_0) => number;
};

/**
```
type ToInt#c5d60378<T#:0> = {
    int: (T#:0) ={}> int,
}
```
*/
type t_c5d60378<T_0> = {
  type: "c5d60378";
  hc5d60378_0: (arg_0: T_0) => number;
};

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
@ffi type Vec2#43802a16 = {
    x: float,
    y: float,
}
```
*/
type t_43802a16 = {
  type: "Vec2";
  x: number;
  y: number;
};

/**
```
@ffi type Vec3#9f1c0644 = {
    ...Vec2#43802a16,
    z: float,
}
```
*/
type t_9f1c0644 = {
  type: "Vec3";
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi type Vec4#3b941378 = {
    ...Vec3#9f1c0644,
    w: float,
}
```
*/
type t_3b941378 = {
  type: "Vec4";
  w: number;
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi type Mat4#d92781e8 = {
    r1: Vec4#3b941378,
    r2: Vec4#3b941378,
    r3: Vec4#3b941378,
    r4: Vec4#3b941378,
}
```
*/
type t_d92781e8 = {
  type: "Mat4";
  r1: t_3b941378;
  r2: t_3b941378;
  r3: t_3b941378;
  r4: t_3b941378;
};

/**
```
type AddSub#b99b22d8<T#:0, T#:1, T#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_b99b22d8<T_0, T_1, T_2> = {
  type: "b99b22d8";
  hb99b22d8_0: (arg_0: T_0, arg_1: T_1) => T_2;
  hb99b22d8_1: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Mul#1de4e4c0<T#:0, T#:1, T#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_1de4e4c0<T_0, T_1, T_2> = {
  type: "1de4e4c0";
  h1de4e4c0_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Div#5ac12902<T#:0, T#:1, T#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_5ac12902<T_0, T_1, T_2> = {
  type: "5ac12902";
  h5ac12902_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

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
export const hash_1d302ade: (arg_0: string) => (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (responseValue$0: string) => (fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result$4: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result$4 = hash_1d302ade(responseValue$0 + ".")((handlers$15000: Handlers, done$5: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(responseValue$0, handlers$15000, (handlers$15000: Handlers, returnValue$7: string) => done$5(handlers$15000, returnValue$7));
    });
  }], (handlers$15000: Handlers, a$2: string) => {
    result$4 = a$2;
  });
  return result$4;
};

/**
```
const freturn#38ab4eac: () ={}> string = () ={}> "yes"
```
*/
export const hash_38ab4eac: () => string = () => "yes";

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
export const hash_8366c3ec: (arg_0: string) => (arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => string = (responseValue$0: string) => (passIn$1: string, fn$2:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result$5: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", (handlers$15000: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
    fn$2(passIn$1, handlers$15000, (handlers$15000: Handlers, returnValue$8: string) => done$6(handlers$15000, returnValue$8));
  }, [(handlers$15000, _, k$4:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result$5 = hash_1d302ade(responseValue$0 + ".")((handlers$15000: Handlers, done$9: (arg_0: Handlers, arg_1: string) => void) => {
      k$4(responseValue$0, handlers$15000, (handlers$15000: Handlers, returnValue$11: string) => done$9(handlers$15000, returnValue$11));
    });
  }], (handlers$15000: Handlers, a$3: string) => {
    result$5 = a$3;
  });
  return result$5;
};

/**
```
const pure#33e34a3a: () ={}> string = () ={}> "AA"
```
*/
export const hash_33e34a3a: () => string = () => "AA";

/**
```
const impure#74eaa230: () ={GetString#22024b72}> string = () ={GetString#22024b72}> "A"
```
*/
export const hash_74eaa230:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers$15000, "A");
};

/**
```
const FloatEq#c41f7386: Eq#553b4b8e<float> = Eq#553b4b8e<float>{"=="#553b4b8e#0: floatEq}
```
*/
export const hash_c41f7386: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: floatEq
} as t_553b4b8e<number>);

/**
```
const IntEq#9275f914: Eq#553b4b8e<int> = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const identity#d762885a: <T#:0>(T#:0) ={}> T#:0 = <T#:0>(x#:0: T#:0) ={}> x#:0
```
*/
export const hash_d762885a: <T_0>(arg_0: T_0) => T_0 = <T_0>(x$0: T_0) => x$0;

/**
```
const arg#7578690a: (string) ={}> string = (arg#:0: string) ={}> (arg#:0 ++ "1")
```
*/
export const hash_7578690a: (arg_0: string) => string = (arg$0: string) => arg$0 + "1";

/**
```
const call#5e9cab43: () ={}> string = () ={}> (freturn#38ab4eac() + "a")
```
*/
export const hash_5e9cab43: () => string = () => hash_38ab4eac() + "a";

/**
```
const StringEq#606c7034: Eq#553b4b8e<string> = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
true
*/
assert(true);

/*
StringEq#606c7034."=="#553b4b8e#0("hi", "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, "hi", "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(freturn#38ab4eac(), "yes")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_38ab4eac(), "yes");

/*
StringEq#606c7034."=="#553b4b8e#0(call#5e9cab43(), "yesa")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5e9cab43(), "yesa");

/*
StringEq#606c7034."=="#553b4b8e#0(arg#7578690a("2"), "21")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7578690a("2"), "21");

/*
StringEq#606c7034."=="#553b4b8e#0((identity#d762885a<string>("5") ++ "4"), "54")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_d762885a("5") + "4", "54");

/*
IntEq#9275f914."=="#553b4b8e#0(2, (1 + 1))
*/
assertCall(hash_9275f914.h553b4b8e_0, 2, 1 + 1);

/*
IntEq#9275f914."=="#553b4b8e#0((2 + (3 * 4)), (16 - 2))
*/
assertCall(hash_9275f914.h553b4b8e_0, 2 + 3 * 4, 16 - 2);

/*
FloatEq#c41f7386."=="#553b4b8e#0((2.2 * 2.0), 4.4)
*/
assertCall(hash_c41f7386.h553b4b8e_0, 2.2 * 2, 4.4);

/*
IntEq#9275f914."=="#553b4b8e#0((2 ^ 3), 8)
*/
assertCall(hash_9275f914.h553b4b8e_0, pow(2, 3), 8);

/*
FloatEq#c41f7386."=="#553b4b8e#0(sqrt((2.0 * 2.0)), 2.0)
*/
assertCall(hash_c41f7386.h553b4b8e_0, sqrt(2 * 2), 2);

/*
StringEq#606c7034."=="#553b4b8e#0(provideString#1d302ade("hi")(() ={GetString#22024b72}> "m"), "m")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d302ade("hi")((handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers$15000, "m");
}), "m");

/*
StringEq#606c7034."=="#553b4b8e#0(provideString#1d302ade("hi")(impure#74eaa230), "A")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d302ade("hi")(hash_74eaa230), "A");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideString#1d302ade("hi")(() ={GetString#22024b72}> pure#33e34a3a()),
    "AA",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d302ade("hi")((handlers$15000: Handlers, done$2: (arg_0: Handlers, arg_1: string) => void) => {
  done$2(handlers$15000, hash_33e34a3a());
}), "AA");

/*
StringEq#606c7034."=="#553b4b8e#0(provideString#1d302ade("hi")(() ={GetString#22024b72}> "m"), "m")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d302ade("hi")((handlers$15000: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  done$3(handlers$15000, "m");
}), "m");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringWithArg#8366c3ec("hi")(
        "Passed in",
        (arg#:0: string) ={GetString#22024b72}> (arg#:0 ++ "-m"),
    ),
    "Passed in-m",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_8366c3ec("hi")("Passed in", (arg$0: string, handlers$15000: Handlers, done$4: (arg_0: Handlers, arg_1: string) => void) => {
  done$4(handlers$15000, arg$0 + "-m");
}), "Passed in-m");