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
const FloatEq#9ca984ce = Eq#51ea2a36<float#builtin>{"=="#51ea2a36#0: floatEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: floatEq}
```
*/
export const hash_9ca984ce: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: floatEq
} as t_51ea2a36<number>);

/**
```
const StringEq#da00b310 = Eq#51ea2a36<string#builtin>{"=="#51ea2a36#0: stringEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: stringEq}
```
*/
export const hash_da00b310: t_51ea2a36<string> = ({
  type: "51ea2a36",
  h51ea2a36_0: stringEq
} as t_51ea2a36<string>);

/*
Person#685f28e5{name#685f28e5#0: "hi", age#685f28e5#1: 2}.name#685f28e5#0 
    ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "hi", "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, "hi", "hi");

/*
Box#adbd7cc8{x#c9939268#0: 1.0, y#c9939268#1: 1.0, w#adbd7cc8#0: 2.0, h#adbd7cc8#1: 2.0}.x#c9939268#0 
    ==#9ca984ce#51ea2a36#0 1.0
assertCall(FloatEq#👨‍🦰.#Eq#🦩🥜👩‍💻😃#0, 1, 1)
*/
assertCall(hash_9ca984ce.h51ea2a36_0, 1, 1);

/*
Box#adbd7cc8{
        ...Pos#c9939268{x#c9939268#0: 10.0, y#c9939268#1: 5.0},
        w#adbd7cc8#0: 1.0,
        h#adbd7cc8#1: 2.0,
    }.x#c9939268#0 
    ==#9ca984ce#51ea2a36#0 10.0
assertCall(
    FloatEq#👨‍🦰.#Eq#🦩🥜👩‍💻😃#0,
    Box#👦{TODO SPREADs}{w: 1, h: 2, x: _#:0, y: _#:0}.#Pos#☘️#0,
    10,
)
*/
assertCall(hash_9ca984ce.h51ea2a36_0, ({ ...({
    type: "Pos",
    x: 10,
    y: 5
  } as t_c9939268),
  type: "Box",
  w: 1,
  h: 2
} as t_adbd7cc8).x, 10);