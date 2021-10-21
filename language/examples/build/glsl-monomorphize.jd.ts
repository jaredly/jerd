import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.5383562320075749) type Eq#3b6b23ae<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_3b6b23ae<T> = {
  type: "3b6b23ae";
  h3b6b23ae_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const IntEq#6d46a318 = Eq#3b6b23ae<int#builtin>{"=="#3b6b23ae#0: intEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: intEq}
```
*/
export const hash_6d46a318: t_3b6b23ae<number> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: intEq
} as t_3b6b23ae<number>);

/**
```
const identity#3ded3b40 = <T#:0>(x#:0: T#:0): T#:0 ={}> x#:0
<T>(x#:0: [var]T#:0): [var]T#:0 => x#:0
```
*/
export const hash_3ded3b40: <T>(arg_0: T_0) => T_0 = <T>(x: T_0) => x;

/**
```
const FloatEq#000a9fb6 = Eq#3b6b23ae<float#builtin>{"=="#3b6b23ae#0: floatEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: floatEq}
```
*/
export const hash_000a9fb6: t_3b6b23ae<number> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: floatEq
} as t_3b6b23ae<number>);

/*
identity#3ded3b40<float#builtin>(x: 1.0) ==#000a9fb6#3b6b23ae#0 1.0
assertCall(FloatEq#🔥🥗.#Eq#☂️🍰🔥#0, identity#🚜⛽🏏<float>(1), 1)
*/
assertCall(hash_000a9fb6.h3b6b23ae_0, hash_3ded3b40(1), 1);

/*
identity#3ded3b40<int#builtin>(x: 2) ==#6d46a318#3b6b23ae#0 2
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, identity#🚜⛽🏏<int>(2), 2)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_3ded3b40(2), 2);