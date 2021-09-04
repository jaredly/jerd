import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type Eq#51ea2a36<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_51ea2a36<T_0> = {
  type: "51ea2a36";
  h51ea2a36_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const yy#5c747e1a = (one#:0: (int#builtin) ={}> int#builtin, z#:1: int#builtin, b#:2: int#builtin): int#builtin ={}> one#:0(
    z#:1 +#builtin b#:2,
)
(one#:0: (int) => int, z#:1: int, b#:2: int): int => one#:0(z#:1 + b#:2)
```
*/
export const hash_5c747e1a: (arg_0: (arg_0: number) => number, arg_1: number, arg_2: number) => number = (one: (arg_0: number) => number, z: number, b: number) => one(z + b);

/**
```
const h#15ece66a = (m#:0: int#builtin): int#builtin ={}> m#:0 -#builtin 2
(m#:0: int): int => m#:0 - 2
```
*/
export const hash_15ece66a: (arg_0: number) => number = (m: number) => m - 2;

/**
```
const z#f4c397d2 = (m#:0: int#builtin): int#builtin ={}> m#:0 +#builtin 2
(m#:0: int): int => m#:0 + 2
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
(doit#:0: (int) => int, v#:1: int): int => yy#🐰🧑‍🎤👩‍❤️‍💋‍👨😃(doit#:0, doit#:0(v#:1 * 2), 5)
```
*/
export const hash_7df35068: (arg_0: (arg_0: number) => number, arg_1: number) => number = (doit: (arg_0: number) => number, v: number) => hash_5c747e1a(doit, doit(v * 2), 5);

/**
```
const IntEq#ec95f154 = Eq#51ea2a36<int#builtin>{"=="#51ea2a36#0: intEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: intEq}
```
*/
export const hash_ec95f154: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: intEq
} as t_51ea2a36<number>);

/*
y#7df35068(doit: z#f4c397d2, v: 30) 
    ==#ec95f154#51ea2a36#0 60 +#builtin 2 +#builtin 5 +#builtin 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, y#😸🧑‍🦰🏑😃(z#🥈, 30), 60 + 2 + 5 + 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_7df35068(hash_f4c397d2, 30), 60 + 2 + 5 + 2);

/*
y#7df35068(doit: h#15ece66a, v: 30) 
    ==#ec95f154#51ea2a36#0 60 -#builtin 2 +#builtin 5 -#builtin 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, y#😸🧑‍🦰🏑😃(h#🍁🚕🧛‍♀️, 30), 60 - 2 + 5 - 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_7df35068(hash_15ece66a, 30), 60 - 2 + 5 - 2);

/*
y#7df35068(doit: (n#:0: int#builtin): int#builtin ={}> n#:0 +#builtin 3, v: 30) 
    ==#ec95f154#51ea2a36#0 60 +#builtin 5 +#builtin 6
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    y#😸🧑‍🦰🏑😃((n#:0: int): int => n#:0 + 3, 30),
    60 + 5 + 6,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_7df35068((n: number) => n + 3, 30), 60 + 5 + 6);