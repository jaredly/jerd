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
const yy#5c747e1a: ((int) ={}> int, int, int) ={}> int = (
    one#:0: (int) ={}> int,
    z#:1: int,
    b#:2: int,
) ={}> one#:0((z#:1 + b#:2))
```
*/
export const hash_5c747e1a: (arg_0: (arg_0: number) => number, arg_1: number, arg_2: number) => number = (one: (arg_0: number) => number, z: number, b: number) => one(z + b);

/**
```
const h#15ece66a: (int) ={}> int = (m#:0: int) ={}> (m#:0 - 2)
```
*/
export const hash_15ece66a: (arg_0: number) => number = (m: number) => m - 2;

/**
```
const z#f4c397d2: (int) ={}> int = (m#:0: int) ={}> (m#:0 + 2)
```
*/
export const hash_f4c397d2: (arg_0: number) => number = (m: number) => m + 2;

/**
```
const y#7df35068: ((int) ={}> int, int) ={}> int = (doit#:0: (int) ={}> int, v#:1: int) ={}> yy#5c747e1a(
    doit#:0,
    doit#:0((v#:1 * 2)),
    5,
)
```
*/
export const hash_7df35068: (arg_0: (arg_0: number) => number, arg_1: number) => number = (doit: (arg_0: number) => number, v: number) => hash_5c747e1a(doit, doit(v * 2), 5);

/**
```
const IntEq#9275f914: Eq#553b4b8e<int> = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/*
IntEq#9275f914."=="#553b4b8e#0(y#7df35068(z#f4c397d2, 30), (((60 + 2) + 5) + 2))
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_7df35068(hash_f4c397d2, 30), 60 + 2 + 5 + 2);

/*
IntEq#9275f914."=="#553b4b8e#0(y#7df35068(h#15ece66a, 30), (((60 - 2) + 5) - 2))
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_7df35068(hash_15ece66a, 30), 60 - 2 + 5 - 2);

/*
IntEq#9275f914."=="#553b4b8e#0(y#7df35068((n#:0: int) ={}> (n#:0 + 3), 30), ((60 + 5) + 6))
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_7df35068((n: number) => n + 3, 30), 60 + 5 + 6);