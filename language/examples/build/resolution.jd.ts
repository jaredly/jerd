import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
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
const one#5678a3a0 = (a#:0: float): float ={}> (a#:0 + 4.0)
```
*/
export const hash_5678a3a0: (arg_0: number) => number = (a: number) => a + 4;

/**
```
const one#f4c397d2 = (a#:0: int): int ={}> (a#:0 + 2)
```
*/
export const hash_f4c397d2: (arg_0: number) => number = (a: number) => a + 2;

/**
```
const IntAsFloat#6f186ad1 = As#As<int, float>{as#As#0: intToFloat}
```
*/
export const hash_6f186ad1: t_As<number, number> = ({
  type: "As",
  hAs_0: intToFloat
} as t_As<number, number>);

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
((one#f4c397d2(2) as#6f186ad1 float + one#5678a3a0(3.0)) ==#c41f7386#553b4b8e#0 11.0)
*/
assertCall(hash_c41f7386.h553b4b8e_0, hash_6f186ad1.hAs_0(hash_f4c397d2(2)) + hash_5678a3a0(3), 11);