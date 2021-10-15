import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
const z#12863dfa = (n#:0: int#builtin): int#builtin ={}> {
    if n#:0 <#builtin 10 {
        log#builtin("Ok");
    };
    n#:0 +#builtin 2;
}
(n#:0: int): int => {
    if n#:0 < 10 {
        log("Ok");
    };
    return n#:0 + 2;
}
```
*/
export const hash_12863dfa: (arg_0: number) => number = (n: number) => {
  if (n < 10) {
    log("Ok");
  }

  return n + 2;
};

/*
z#12863dfa(n: 3)
z#🐈‍⬛🧗🧑‍🚀(3)
*/
hash_12863dfa(3);