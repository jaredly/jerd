import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.5383562320075749) type Eq#51ea2a36<T#:0> = {
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
const addTwo#353b9e6c = (one#:0: int#builtin): int#builtin ={}> one#:0 +#builtin 2
(one#:0: int): int => one#:0 + 2
```
*/
export const hash_353b9e6c: (arg_0: number) => number = (one: number) => one + 2;

/**
```
const callme#25f9596b = <T#:0>(x#:0: (T#:0) ={}> T#:0, arg#:1: T#:0): T#:0 ={}> x#:0(arg#:1)
<T>(x#:0: ([var]T#:0) => [var]T#:0, arg#:1: [var]T#:0): [var]T#:0 => x#:0(arg#:1)
```
*/
export const hash_25f9596b: <T_0>(arg_0: (arg_0: T_0) => T_0, arg_1: T_0) => T_0 = <T_0>(x: (arg_0: T_0) => T_0, arg: T_0) => x(arg);

/**
```
const scopeIt#4be86ab4 = (x#:0: int#builtin): (y: int#builtin) ={}> int#builtin ={}> (
    y#:1: int#builtin,
): int#builtin ={}> x#:0 +#builtin y#:1
(x#:0: int): (int) => int => (y#:1: int): int => x#:0 + y#:1
```
*/
export const hash_4be86ab4: (arg_0: number) => (arg_0: number) => number = (x: number) => (y: number) => x + y;

/**
```
const callIt#09628198 = callme#25f9596b<int#builtin>(x: addTwo#353b9e6c, arg: 5)
callme#💆🦠🌼<int>(addTwo#🍃🌍🚧, 5)
```
*/
export const hash_09628198: number = hash_25f9596b(hash_353b9e6c, 5);

/**
```
const ten#62aa9914 = scopeIt#4be86ab4(x: 4)(6)
scopeIt#🍢🐰👃😃(4)(6)
```
*/
export const hash_62aa9914: number = hash_4be86ab4(4)(6);

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
ten#62aa9914 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, ten#👨‍🏭🥣🐔😃, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_62aa9914, 10);

/*
callIt#09628198 ==#ec95f154#51ea2a36#0 7
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, callIt#🏌️‍♀️🤘👋, 7)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_09628198, 7);