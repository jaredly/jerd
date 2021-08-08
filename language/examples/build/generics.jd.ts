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
const addTwo#f4c397d2 = (one#:0: int#builtin): int#builtin ={}> one#:0 +#builtin 2
```
*/
export const hash_f4c397d2: (arg_0: number) => number = (one: number) => one + 2;

/**
```
const callme#777bf1fc = <T#:0>(x#:0: (T#:0) ={}> T#:0, arg#:1: T#:0): T#:0 ={}> x#:0(arg#:1)
```
*/
export const hash_777bf1fc: <T_0>(arg_0: (arg_0: T_0) => T_0, arg_1: T_0) => T_0 = <T_0>(x: (arg_0: T_0) => T_0, arg: T_0) => x(arg);

/**
```
const scopeIt#36626a20 = (x#:0: int#builtin): (y: int#builtin) ={}> int#builtin ={}> (
    y#:1: int#builtin,
): int#builtin ={}> x#:0 +#builtin y#:1
```
*/
export const hash_36626a20: (arg_0: number) => (arg_0: number) => number = (x: number) => (y: number) => x + y;

/**
```
const callIt#2d15e126 = callme#777bf1fc<int#builtin>(x: addTwo#f4c397d2, arg: 5)
```
*/
export const hash_2d15e126: number = hash_777bf1fc(hash_f4c397d2, 5);

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const ten#48447074 = scopeIt#36626a20(x: 4)(6)
```
*/
export const hash_48447074: number = hash_36626a20(4)(6);

/*
ten#48447074 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_48447074, 10);

/*
callIt#2d15e126 ==#9275f914#553b4b8e#0 7
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_2d15e126, 7);