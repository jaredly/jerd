import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
const z#6a5b05d8 = (n#:0: int#builtin): int#builtin ={}> {
    if n#:0 <#builtin 10 {
        log#builtin("Ok");
    };
    n#:0 +#builtin 2;
}
```
*/
export const hash_6a5b05d8: (arg_0: number) => number = (n: number) => {
  (() => {
    if (n < 10) {
      return log("Ok");
    }
  })();

  return n + 2;
};

/*
z#6a5b05d8(n: 3)
*/
hash_6a5b05d8(3);