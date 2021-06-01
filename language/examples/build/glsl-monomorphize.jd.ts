import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

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
const IntEq#9275f914 = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const identity#d762885a = <T#:0>(x#:0: T#:0): T#:0 ={}> x#:0
```
*/
export const hash_d762885a: <T_0>(arg_0: T_0) => T_0 = <T_0>(x: T_0) => x;

/**
```
const FloatEq#c41f7386 = Eq#553b4b8e<float>{"=="#553b4b8e#0: floatEq}
```
*/
export const hash_c41f7386: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: floatEq
} as t_553b4b8e<number>);

/*
identity#d762885a<float>(1.0) ==#c41f7386#553b4b8e#0 1.0
*/
assertCall(hash_c41f7386.h553b4b8e_0, hash_d762885a(1), 1);

/*
identity#d762885a<int>(2) ==#9275f914#553b4b8e#0 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_d762885a(2), 2);