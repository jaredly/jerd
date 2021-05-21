import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
const z#6a5b05d8: (int) ={}> int = (n#:0: int) ={}> {
    if (n#:0 < 10) {
        log("Ok");
    };
    (n#:0 + 2);
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
z#6a5b05d8(3)
*/
hash_6a5b05d8(3);