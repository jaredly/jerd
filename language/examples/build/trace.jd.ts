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
const otherTerm#2189e92c = (n#:0: int): int ={}> trace!(n#:0 - 1, "Yes")
```
*/
export const hash_2189e92c: (arg_0: number) => number = (n: number) => n - 1;

/**
```
const oneTerm#fa256dec = (m#:0: int): int ={}> trace!(m#:0, "Hello from tracing!") + trace!(
    otherTerm#2189e92c(4),
)
```
*/
export const hash_fa256dec: (arg_0: number) => number = (m: number) => m + hash_2189e92c(4);

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
oneTerm#fa256dec(4) + oneTerm#fa256dec(1) ==#9275f914#553b4b8e#0 11
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_fa256dec(4) + hash_fa256dec(1), 11);