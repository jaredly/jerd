import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
const hello#f4c397d2 = (n#:0: int#builtin): int#builtin ={}> n#:0 +#builtin 2
(n#:0: int): int => n#:0 + 2
```
*/
export const hash_f4c397d2: (arg_0: number) => number = (n: number) => n + 2;

/**
```
const m#8d2d2d94 = <int#builtin>[1, 2]
[1, 2]
```
*/
export const hash_8d2d2d94: Array<number> = [1, 2];

/**
```
const world#118f1780 = (n#:0: int#builtin, m#:1: int#builtin): int#builtin ={}> hello#f4c397d2(
        n: m#:1,
    ) 
    -#builtin n#:0
(n#:0: int, m#:1: int): int => hello#🥈(m#:1) - n#:0
```
*/
export const hash_118f1780: (arg_0: number, arg_1: number) => number = (n: number, m: number) => hash_f4c397d2(m) - n;

/*
Hello#2d892b6c{age#2d892b6c#0: world#118f1780(n: 20, m: 17), name#2d892b6c#1: "whatsit"}
Hello#⏳🐚🍹{TODO SPREADs}{age: world#🕖🎏👩‍💼(20, 17), name: "whatsit"}
*/
({
  type: "Hello",
  age: hash_118f1780(20, 17),
  name: "whatsit"
} as t_2d892b6c);

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