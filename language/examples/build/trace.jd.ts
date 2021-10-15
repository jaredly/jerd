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
const otherTerm#54218b0c = (n#:0: int#builtin): int#builtin ={}> trace!(n#:0 -#builtin 1, "Yes")
(n#:0: int): int => trace!(n#:0 - 1, "Yes")
```
*/
export const hash_54218b0c: (arg_0: number) => number = (n: number) => n - 1;

/**
```
const oneTerm#055080e0 = (m#:0: int#builtin): int#builtin ={}> trace!(m#:0, "Hello from tracing!") 
    +#builtin trace!(otherTerm#54218b0c(n: 4))
(m#:0: int): int => trace!(m#:0, "Hello from tracing!") + trace!(otherTerm#💒👺🤵‍♂️😃(4))
```
*/
export const hash_055080e0: (arg_0: number) => number = (m: number) => m + hash_54218b0c(4);

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
oneTerm#055080e0(m: 4) +#builtin oneTerm#055080e0(m: 1) ==#ec95f154#51ea2a36#0 11
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, oneTerm#🙍🤐😫(4) + oneTerm#🙍🤐😫(1), 11)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_055080e0(4) + hash_055080e0(1), 11);