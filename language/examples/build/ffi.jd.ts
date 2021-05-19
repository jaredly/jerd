import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

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
@ffi type Person#270b466e = {
    name: string,
    age: int,
}
```
*/
type t_270b466e = {
  type: "Person";
  name: string;
  age: number;
};

/**
```
@ffi type Pos#3c665e84 = {
    x: float,
    y: float,
}
```
*/
type t_3c665e84 = {
  type: "Pos";
  x: number;
  y: number;
};

/**
```
@ffi type Box#df326b42 = {
    ...Pos#3c665e84,
    w: float,
    h: float,
}
```
*/
type t_df326b42 = {
  type: "Box";
  w: number;
  h: number;
  x: number;
  y: number;
};

/**
```
@ffi type Circle#d2a33a0a = {
    ...Pos#3c665e84,
    r: float,
}
```
*/
type t_d2a33a0a = {
  type: "Circle";
  r: number;
  x: number;
  y: number;
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
const StringEq#606c7034: Eq#553b4b8e<string> = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
StringEq#606c7034."=="#553b4b8e#0(
    Person#270b466e{name#270b466e#0: "hi", age#270b466e#1: 2}.name#270b466e#0,
    "hi",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "Person",
  name: "hi",
  age: 2
} as t_270b466e).name, "hi");

/*
FloatEq#c41f7386."=="#553b4b8e#0(
    Box#df326b42{x#3c665e84#0: 1.0, y#3c665e84#1: 1.0, w#df326b42#0: 2.0, h#df326b42#1: 2.0}.x#3c665e84#0,
    1.0,
)
*/
assertCall(hash_c41f7386.h553b4b8e_0, ({
  type: "Box",
  x: 1,
  y: 1,
  w: 2,
  h: 2
} as t_df326b42).x, 1);

/*
FloatEq#c41f7386."=="#553b4b8e#0(
    Box#df326b42{
        ...Pos#3c665e84{x#3c665e84#0: 10.0, y#3c665e84#1: 5.0},
        w#df326b42#0: 1.0,
        h#df326b42#1: 2.0,
    }.x#3c665e84#0,
    10.0,
)
*/
assertCall(hash_c41f7386.h553b4b8e_0, ({ ...({
    type: "Pos",
    x: 10,
    y: 5
  } as t_3c665e84),
  type: "Box",
  w: 1,
  h: 2
} as t_df326b42).x, 10);