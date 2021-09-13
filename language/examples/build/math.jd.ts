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
const IntEq#ec95f154 = Eq#51ea2a36<int#builtin>{"=="#51ea2a36#0: intEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: intEq}
```
*/
export const hash_ec95f154: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: intEq
} as t_51ea2a36<number>);

/**
```
const within#004be9c0 = (
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
export const hash_004be9c0: (arg_0: number, arg_1: number, arg_2: number) => boolean = (found: number, expected: number, margin: number) => {
  if (found - margin < expected) {
    return found + margin > expected;
  } else {
    return false;
  }
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

/*
sqrt#builtin(4.0) ==#9ca984ce#51ea2a36#0 2.0
assertCall(FloatEq#👨‍🦰.#Eq#🦩🥜👩‍💻😃#0, sqrt(4), 2)
*/
assertCall(hash_9ca984ce.h51ea2a36_0, sqrt(4), 2);

/*
within#004be9c0(found: sin#builtin(PI#builtin), expected: 0.0, margin: 0.0001)
assertCall(within#🛀🧱😆, sin(PI), 0, 0.0001)
*/
assertCall(hash_004be9c0, sin(PI), 0, 0.0001);

/*
floatToInt#builtin(2.3) ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, floatToInt(2.3), 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, floatToInt(2.3), 2);

/*
concat#builtin<int#builtin>(<int#builtin>[1], <int#builtin>[2, 3])
concat<int>([1], [2, 3])
*/
concat([1], [2, 3]);