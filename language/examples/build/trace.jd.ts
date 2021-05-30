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
const oneTerm#3d1dc2e8 = (m#:0: int): int ={}> trace!(trace!(m#:0, "the m") + 2)
```
*/
export const hash_3d1dc2e8: (arg_0: number) => number = (m: number) => $trace("3d1dc2e8", 1, $trace("3d1dc2e8", 0, m, "the m") + 2);

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/*
oneTerm#3d1dc2e8(4) ==#9275f914#553b4b8e#0 6
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_3d1dc2e8(4), 6);