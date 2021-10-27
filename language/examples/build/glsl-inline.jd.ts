import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.5383562320075749) type Eq#2f333afa<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_2f333afa<T> = {
  type: "2f333afa";
  h2f333afa_0: (arg_0: T, arg_1: T) => boolean;
};

/**
```
const yy#c0ca7b20 = (one#:0: (int#builtin) ={}> int#builtin, z#:1: int#builtin, b#:2: int#builtin): int#builtin ={}> one#:0(
    z#:1 +#builtin b#:2,
)
(one#:0: (int) => int, z#:1: int, b#:2: int): int => one#:0(z#:1 + b#:2)
```
*/
export const hash_c0ca7b20: (arg_0: (arg_0: number) => number, arg_1: number, arg_2: number) => number = (one: (arg_0: number) => number, z: number, b: number) => one(z + b);

/**
```
const h#d902711c = (m#:0: int#builtin): int#builtin ={}> m#:0 -#builtin 2
(m#:0: int): int => m#:0 - 2
```
*/
export const hash_d902711c: (arg_0: number) => number = (m: number) => m - 2;

/**
```
const z#353b9e6c = (m#:0: int#builtin): int#builtin ={}> m#:0 +#builtin 2
(m#:0: int): int => m#:0 + 2
```
*/
export const hash_353b9e6c: (arg_0: number) => number = (m: number) => m + 2;

/**
```
const y#6fbf49c0 = (doit#:0: (int#builtin) ={}> int#builtin, v#:1: int#builtin): int#builtin ={}> yy#c0ca7b20(
    one: doit#:0,
    z: doit#:0(v#:1 *#builtin 2),
    b: 5,
)
(doit#:0: (int) => int, v#:1: int): int => yy#🎠(doit#:0, doit#:0(v#:1 * 2), 5)
```
*/
export const hash_6fbf49c0: (arg_0: (arg_0: number) => number, arg_1: number) => number = (doit: (arg_0: number) => number, v: number) => hash_c0ca7b20(doit, doit(v * 2), 5);

/**
```
const IntEq#24558044 = Eq#2f333afa<int#builtin>{"=="#2f333afa#0: intEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: intEq}
```
*/
export const hash_24558044: t_2f333afa<number> = ({
  type: "2f333afa",
  h2f333afa_0: intEq
} as t_2f333afa<number>);

/*
y#6fbf49c0(doit: z#353b9e6c, v: 30) 
    ==#24558044#2f333afa#0 60 +#builtin 2 +#builtin 5 +#builtin 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, y#🛀🥈🏘️😃(z#🍃🌍🚧, 30), 60 + 2 + 5 + 2)
*/
assertCall(hash_24558044.h2f333afa_0, hash_6fbf49c0(hash_353b9e6c, 30), 60 + 2 + 5 + 2);

/*
y#6fbf49c0(doit: h#d902711c, v: 30) 
    ==#24558044#2f333afa#0 60 -#builtin 2 +#builtin 5 -#builtin 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, y#🛀🥈🏘️😃(h#🧑‍💻, 30), 60 - 2 + 5 - 2)
*/
assertCall(hash_24558044.h2f333afa_0, hash_6fbf49c0(hash_d902711c, 30), 60 - 2 + 5 - 2);

/*
y#6fbf49c0(doit: (n#:0: int#builtin): int#builtin ={}> n#:0 +#builtin 3, v: 30) 
    ==#24558044#2f333afa#0 60 +#builtin 5 +#builtin 6
assertCall(
    IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0,
    y#🛀🥈🏘️😃((n#:0: int): int => n#:0 + 3, 30),
    60 + 5 + 6,
)
*/
assertCall(hash_24558044.h2f333afa_0, hash_6fbf49c0((n: number) => n + 3, 30), 60 + 5 + 6);