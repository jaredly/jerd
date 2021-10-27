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
const identity#3ded3b40 = <T#:0>(x#:0: T#:0): T#:0 ={}> x#:0
<T>(x#:0: [var]T#:0): [var]T#:0 => x#:0
```
*/
export const hash_3ded3b40: <T>(arg_0: T) => T = <T>(x: T) => x;

/**
```
const FloatEq#143b5e82 = Eq#2f333afa<float#builtin>{"=="#2f333afa#0: floatEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: floatEq}
```
*/
export const hash_143b5e82: t_2f333afa<number> = ({
  type: "2f333afa",
  h2f333afa_0: floatEq
} as t_2f333afa<number>);

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
identity#3ded3b40<float#builtin>(x: 1.0) ==#143b5e82#2f333afa#0 1.0
assertCall(FloatEq#🌽🍸🤵‍♀️.#Eq#🧱👨‍🦰🏖️#0, identity#🚜⛽🏏<float>(1), 1)
*/
assertCall(hash_143b5e82.h2f333afa_0, hash_3ded3b40(1), 1);

/*
identity#3ded3b40<int#builtin>(x: 2) ==#24558044#2f333afa#0 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, identity#🚜⛽🏏<int>(2), 2)
*/
assertCall(hash_24558044.h2f333afa_0, hash_3ded3b40(2), 2);