import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const FloatEq#c41f7386 = Eq#553b4b8e<float#builtin>{"=="#553b4b8e#0: floatEq#builtin}
```
*/
export const hash_c41f7386: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: floatEq
} as t_553b4b8e<number>);

/**
```
const StringEq#606c7034 = Eq#553b4b8e<string#builtin>{"=="#553b4b8e#0: stringEq#builtin}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
Person#270b466e{name#270b466e#0: "hi", age#270b466e#1: 2}.name#270b466e#0 
    ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "Person",
  name: "hi",
  age: 2
} as t_270b466e).name, "hi");

/*
Box#df326b42{x#3c665e84#0: 1.0, y#3c665e84#1: 1.0, w#df326b42#0: 2.0, h#df326b42#1: 2.0}.x#3c665e84#0 
    ==#c41f7386#553b4b8e#0 1.0
*/
assertCall(hash_c41f7386.h553b4b8e_0, ({
  type: "Box",
  x: 1,
  y: 1,
  w: 2,
  h: 2
} as t_df326b42).x, 1);

/*
Box#df326b42{
        ...Pos#3c665e84{x#3c665e84#0: 10.0, y#3c665e84#1: 5.0},
        w#df326b42#0: 1.0,
        h#df326b42#1: 2.0,
    }.x#3c665e84#0 
    ==#c41f7386#553b4b8e#0 10.0
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