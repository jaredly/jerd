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
@unique(2) type As#As<T#:10000, Y#:10001> = {
    as: (T#:10000) ={}> Y#:10001,
}
```
*/
type t_As<T, Y> = {
  type: "As";
  hAs_0: (arg_0: T) => Y;
};

/**
```
const one#5c58851a = (a#:0: float#builtin): float#builtin ={}> a#:0 +#builtin 4.0
(a#:0: float): float => a#:0 + 4
```
*/
export const hash_5c58851a: (arg_0: number) => number = (a: number) => a + 4;

/**
```
const one#353b9e6c = (a#:0: int#builtin): int#builtin ={}> a#:0 +#builtin 2
(a#:0: int): int => a#:0 + 2
```
*/
export const hash_353b9e6c: (arg_0: number) => number = (a: number) => a + 2;

/**
```
const IntAsFloat#6f186ad1 = As#As<int#builtin, float#builtin>{as#As#0: intToFloat#builtin}
As#😉{TODO SPREADs}{hAs_0: intToFloat}
```
*/
export const hash_6f186ad1: t_As<number, number> = ({
  type: "As",
  hAs_0: intToFloat
} as t_As<number, number>);

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

/*
one#353b9e6c(a: 2) as#6f186ad1 float#builtin +#builtin one#5c58851a(a: 3.0) 
    ==#143b5e82#2f333afa#0 11.0
assertCall(
    FloatEq#🌽🍸🤵‍♀️.#Eq#🧱👨‍🦰🏖️#0,
    IntAsFloat#🥛🐰🗻😃.#As#😉#0(one#🍃🌍🚧(2)) + one#👨‍🔬🐨👬😃(3),
    11,
)
*/
assertCall(hash_143b5e82.h2f333afa_0, hash_6f186ad1.hAs_0(hash_353b9e6c(2)) + hash_5c58851a(3), 11);