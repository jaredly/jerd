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
const within#0c09e1ca = (
    found#:0: float#builtin,
    expected#:1: float#builtin,
    margin#:2: float#builtin,
): bool#builtin ={}> {
    if found#:0 -#builtin margin#:2 <#builtin expected#:1 {
        found#:0 +#builtin margin#:2 >#builtin expected#:1;
    } else {
        false;
    };
}
(found#:0: float, expected#:1: float, margin#:2: float): bool => {
    if found#:0 - margin#:2 < expected#:1 {
        return found#:0 + margin#:2 > expected#:1;
    } else {
        return false;
    };
}
```
*/
export const hash_0c09e1ca: (arg_0: number, arg_1: number, arg_2: number) => boolean = (found: number, expected: number, margin: number) => {
  if (found - margin < expected) {
    return found + margin > expected;
  } else {
    return false;
  }
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

/*
sqrt#builtin(4.0) ==#000a9fb6#3b6b23ae#0 2.0
assertCall(FloatEq#🔥🥗.#Eq#☂️🍰🔥#0, sqrt(4), 2)
*/
assertCall(hash_000a9fb6.h3b6b23ae_0, sqrt(4), 2);

/*
within#0c09e1ca(found: sin#builtin(PI#builtin), expected: 0.0, margin: 0.0001)
assertCall(within#💑🍑🦷, sin(PI), 0, 0.0001)
*/
assertCall(hash_0c09e1ca, sin(PI), 0, 0.0001);

/*
floatToInt#builtin(2.3) ==#6d46a318#3b6b23ae#0 2
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, floatToInt(2.3), 2)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, floatToInt(2.3), 2);

/*
concat#builtin<int#builtin>(<int#builtin>[1], <int#builtin>[2, 3])
concat<int>([1], [2, 3])
*/
concat([1], [2, 3]);