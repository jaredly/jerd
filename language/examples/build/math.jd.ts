import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

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
const FloatEq#c41f7386 = Eq#553b4b8e<float#builtin>{"=="#553b4b8e#0: floatEq#builtin}
```
*/
export const hash_c41f7386: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: floatEq
} as t_553b4b8e<number>);

/*
sqrt#builtin(4.0) ==#c41f7386#553b4b8e#0 2.0
*/
assertCall(hash_c41f7386.h553b4b8e_0, sqrt(4), 2);

/*
within#004be9c0(found: sin#builtin(PI#builtin), expected: 0.0, margin: 0.0001)
*/
assertCall(hash_004be9c0, sin(PI), 0, 0.0001);

/*
floatToInt#builtin(2.3) ==#9275f914#553b4b8e#0 2
*/
assertCall(hash_9275f914.h553b4b8e_0, floatToInt(2.3), 2);

/*
concat#builtin<int#builtin>(<int#builtin>[1], <int#builtin>[2, 3])
*/
concat([1], [2, 3]);