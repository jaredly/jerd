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
const yy#5c747e1a = (one#:0: (int#builtin) ={}> int#builtin, z#:1: int#builtin, b#:2: int#builtin): int#builtin ={}> one#:0(
    z#:1 +#builtin b#:2,
)
```
*/
export const hash_5c747e1a: (arg_0: (arg_0: number) => number, arg_1: number, arg_2: number) => number = (one: (arg_0: number) => number, z: number, b: number) => one(z + b);

/**
```
const h#15ece66a = (m#:0: int#builtin): int#builtin ={}> m#:0 -#builtin 2
```
*/
export const hash_15ece66a: (arg_0: number) => number = (m: number) => m - 2;

/**
```
const z#f4c397d2 = (m#:0: int#builtin): int#builtin ={}> m#:0 +#builtin 2
```
*/
export const hash_f4c397d2: (arg_0: number) => number = (m: number) => m + 2;

/**
```
const y#7df35068 = (doit#:0: (int#builtin) ={}> int#builtin, v#:1: int#builtin): int#builtin ={}> yy#5c747e1a(
    one: doit#:0,
    z: doit#:0(v#:1 *#builtin 2),
    b: 5,
)
```
*/
export const hash_7df35068: (arg_0: (arg_0: number) => number, arg_1: number) => number = (doit: (arg_0: number) => number, v: number) => hash_5c747e1a(doit, doit(v * 2), 5);

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/*
y#7df35068(doit: z#f4c397d2, v: 30) ==#9275f914#553b4b8e#0 60 +#builtin 2 +#builtin 5 +#builtin 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_7df35068(hash_f4c397d2, 30), 60 + 2 + 5 + 2);

/*
y#7df35068(doit: h#15ece66a, v: 30) ==#9275f914#553b4b8e#0 60 -#builtin 2 +#builtin 5 -#builtin 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_7df35068(hash_15ece66a, 30), 60 - 2 + 5 - 2);

/*
y#7df35068(doit: (n#:0: int#builtin): int#builtin ={}> n#:0 +#builtin 3, v: 30) 
    ==#9275f914#553b4b8e#0 60 +#builtin 5 +#builtin 6
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_7df35068((n: number) => n + 3, 30), 60 + 5 + 6);