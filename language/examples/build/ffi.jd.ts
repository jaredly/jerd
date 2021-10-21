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
const FloatEq#000a9fb6 = Eq#3b6b23ae<float#builtin>{"=="#3b6b23ae#0: floatEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: floatEq}
```
*/
export const hash_000a9fb6: t_3b6b23ae<number> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: floatEq
} as t_3b6b23ae<number>);

/**
```
const StringEq#0d81b26d = Eq#3b6b23ae<string#builtin>{"=="#3b6b23ae#0: stringEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: stringEq}
```
*/
export const hash_0d81b26d: t_3b6b23ae<string> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: stringEq
} as t_3b6b23ae<string>);

/*
Person#685f28e5{name#685f28e5#0: "hi", age#685f28e5#1: 2}.name#685f28e5#0 
    ==#0d81b26d#3b6b23ae#0 "hi"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "hi", "hi")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "hi", "hi");

/*
Box#041c13d2{x#c9939268#0: 1.0, y#c9939268#1: 1.0, w#041c13d2#0: 2.0, h#041c13d2#1: 2.0}.x#c9939268#0 
    ==#000a9fb6#3b6b23ae#0 1.0
assertCall(FloatEq#🔥🥗.#Eq#☂️🍰🔥#0, 1, 1)
*/
assertCall(hash_000a9fb6.h3b6b23ae_0, 1, 1);

/*
Box#041c13d2{
        ...Pos#c9939268{x#c9939268#0: 10.0, y#c9939268#1: 5.0},
        w#041c13d2#0: 1.0,
        h#041c13d2#1: 2.0,
    }.x#c9939268#0 
    ==#000a9fb6#3b6b23ae#0 10.0
assertCall(
    FloatEq#🔥🥗.#Eq#☂️🍰🔥#0,
    Box#🥈🏨🙁{TODO SPREADs}{w: 1, h: 2, x: _#:0, y: _#:0}.#Pos#☘️#0,
    10,
)
*/
assertCall(hash_000a9fb6.h3b6b23ae_0, ({ ...({
    type: "Pos",
    x: 10,
    y: 5
  } as t_c9939268),
  type: "Box",
  w: 1,
  h: 2
} as t_041c13d2).x, 10);