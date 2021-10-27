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
const StringEq#8a86d00e = Eq#2f333afa<string#builtin>{"=="#2f333afa#0: stringEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: stringEq}
```
*/
export const hash_8a86d00e: t_2f333afa<string> = ({
  type: "2f333afa",
  h2f333afa_0: stringEq
} as t_2f333afa<string>);

/*
Person#2b31c3ee{name#2b31c3ee#0: "hi", age#2b31c3ee#1: 2}.name#2b31c3ee#0 
    ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "hi", "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "hi", "hi");

/*
Box#448fa1f8{x#1498b92c#0: 1.0, y#1498b92c#1: 1.0, w#448fa1f8#0: 2.0, h#448fa1f8#1: 2.0}.x#1498b92c#0 
    ==#143b5e82#2f333afa#0 1.0
assertCall(FloatEq#🌽🍸🤵‍♀️.#Eq#🧱👨‍🦰🏖️#0, 1, 1)
*/
assertCall(hash_143b5e82.h2f333afa_0, 1, 1);

/*
Box#448fa1f8{
        ...Pos#1498b92c{x#1498b92c#0: 10.0, y#1498b92c#1: 5.0},
        w#448fa1f8#0: 1.0,
        h#448fa1f8#1: 2.0,
    }.x#1498b92c#0 
    ==#143b5e82#2f333afa#0 10.0
assertCall(
    FloatEq#🌽🍸🤵‍♀️.#Eq#🧱👨‍🦰🏖️#0,
    Box#🐱⛸️😦😃{TODO SPREADs}{w: 1, h: 2, x: _#:0, y: _#:0}.#Pos#👨‍🚒🐥👩‍🍼#0,
    10,
)
*/
assertCall(hash_143b5e82.h2f333afa_0, ({ ...({
    type: "Pos",
    x: 10,
    y: 5
  } as t_1498b92c),
  type: "Box",
  w: 1,
  h: 2
} as t_448fa1f8).x, 10);