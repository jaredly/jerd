import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
const z#6b583f49 = <string#builtin>["hi", "ho"]
["hi", "ho"]
```
*/
export const hash_6b583f49: Array<string> = ["hi", "ho"];

/**
```
const b#05ebca85 = <string#builtin>["Good", ...z#6b583f49, "uhuh"]
["Good", ...z#🛹🐪🍣😃, "uhuh"]
```
*/
export const hash_05ebca85: Array<string> = ["Good", ...hash_6b583f49, "uhuh"];

/**
```
const a#707b8ca0 = <string#builtin>[...z#6b583f49, "Yes"]
[...z#🛹🐪🍣😃, "Yes"]
```
*/
export const hash_707b8ca0: Array<string> = [...hash_6b583f49, "Yes"];

/*
switch a#707b8ca0 {[] => false, [..., "Yes"] => true, _ => false}
assert(
    ((): bool => {
        if len(a#🤘🍴🏫😃) == 0 {
            return false;
        };
        if len(a#🤘🍴🏫😃) >= 1 && a#🤘🍴🏫😃[len(a#🤘🍴🏫😃) - 1] == "Yes" {
            return true;
        };
        return false;
    })(),
)
*/
assert((() => {
  if (hash_707b8ca0.length == 0) {
    return false;
  }

  if (hash_707b8ca0.length >= 1 && hash_707b8ca0[hash_707b8ca0.length - 1] === "Yes") {
    return true;
  }

  return false;
})());

/*
switch <void#builtin>[] {[one#:0, ...rest#:1] => false, [] => true}
assert(
    ((): bool => {
        const discriminant#:2: Array<void> = [];
        if len(discriminant#:2) >= 1 {
            return false;
        };
        if len(discriminant#:2) == 0 {
            return true;
        };
        match_fail!();
    })(),
)
*/
assert((() => {
  let discriminant: Array<void> = [];

  if (discriminant.length >= 1) {
    return false;
  }

  if (discriminant.length == 0) {
    return true;
  }

  throw "Math failed";
})());

/*
switch a#707b8ca0 {[] => false, [..., "Yes"] => true, _ => false}
assert(
    ((): bool => {
        if len(a#🤘🍴🏫😃) == 0 {
            return false;
        };
        if len(a#🤘🍴🏫😃) >= 1 && a#🤘🍴🏫😃[len(a#🤘🍴🏫😃) - 1] == "Yes" {
            return true;
        };
        return false;
    })(),
)
*/
assert((() => {
  if (hash_707b8ca0.length == 0) {
    return false;
  }

  if (hash_707b8ca0.length >= 1 && hash_707b8ca0[hash_707b8ca0.length - 1] === "Yes") {
    return true;
  }

  return false;
})());

/*
switch b#05ebca85 {
    [] => false,
    ["Bad"] => false,
    ["Bad", ...] => false,
    ["Good", ..., "Bad"] => false,
    ["Good", ..., "uhuh"] => true,
    _ => false,
}
assert(
    ((): bool => {
        if len(b#🥬🏕️☠️) == 0 {
            return false;
        };
        if len(b#🥬🏕️☠️) == 1 && b#🥬🏕️☠️[0] == "Bad" {
            return false;
        };
        if len(b#🥬🏕️☠️) >= 1 && b#🥬🏕️☠️[0] == "Bad" {
            return false;
        };
        if len(b#🥬🏕️☠️) >= 2 && b#🥬🏕️☠️[0] == "Good" && b#🥬🏕️☠️[len(b#🥬🏕️☠️) - 1] == "Bad" {
            return false;
        };
        if len(b#🥬🏕️☠️) >= 2 && b#🥬🏕️☠️[0] == "Good" && b#🥬🏕️☠️[len(b#🥬🏕️☠️) - 1] == "uhuh" {
            return true;
        };
        return false;
    })(),
)
*/
assert((() => {
  if (hash_05ebca85.length == 0) {
    return false;
  }

  if (hash_05ebca85.length == 1 && hash_05ebca85[0] === "Bad") {
    return false;
  }

  if (hash_05ebca85.length >= 1 && hash_05ebca85[0] === "Bad") {
    return false;
  }

  if (hash_05ebca85.length >= 2 && hash_05ebca85[0] === "Good" && hash_05ebca85[hash_05ebca85.length - 1] === "Bad") {
    return false;
  }

  if (hash_05ebca85.length >= 2 && hash_05ebca85[0] === "Good" && hash_05ebca85[hash_05ebca85.length - 1] === "uhuh") {
    return true;
  }

  return false;
})());

/*
switch a#707b8ca0 {[one#:0, ...rest#:1] => true, [] => false}
assert(
    ((): bool => {
        if len(a#🤘🍴🏫😃) >= 1 {
            return true;
        };
        if len(a#🤘🍴🏫😃) == 0 {
            return false;
        };
        match_fail!();
    })(),
)
*/
assert((() => {
  if (hash_707b8ca0.length >= 1) {
    return true;
  }

  if (hash_707b8ca0.length == 0) {
    return false;
  }

  throw "Math failed";
})());