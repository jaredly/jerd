import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
const hello#353b9e6c = (n#:0: int#builtin): int#builtin ={}> n#:0 +#builtin 2
(n#:0: int): int => n#:0 + 2
```
*/
export const hash_353b9e6c: (arg_0: number) => number = (n: number) => n + 2;

/**
```
const m#8d2d2d94 = <int#builtin>[1, 2]
[1, 2]
```
*/
export const hash_8d2d2d94: Array<number> = [1, 2];

/**
```
const world#179e7b7a = (n#:0: int#builtin, m#:1: int#builtin): int#builtin ={}> hello#353b9e6c(
        n: m#:1,
    ) 
    -#builtin n#:0
(n#:0: int, m#:1: int): int => hello#🍃🌍🚧(m#:1) - n#:0
```
*/
export const hash_179e7b7a: (arg_0: number, arg_1: number) => number = (n: number, m: number) => hash_353b9e6c(m) - n;

/*
Hello#021b0b9e{age#021b0b9e#0: world#179e7b7a(n: 20, m: 17), name#021b0b9e#1: "whatsit"}
Hello#🌌🍦🤨{TODO SPREADs}{age: world#🕓🌌🧎‍♀️(20, 17), name: "whatsit"}
*/
({
  type: "Hello",
  age: hash_179e7b7a(20, 17),
  name: "whatsit"
} as t_021b0b9e);

/*
(2, 3)
(2, 3)
*/
[2, 3];

/*
<int#builtin>[1, 2]
[1, 2]
*/
[1, 2];

/*
<int#builtin>[...m#8d2d2d94, 3]
[...m#⛷️, 3]
*/
[...hash_8d2d2d94, 3];