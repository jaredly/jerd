import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
const z#6b583f49: Array<string> = <string>["hi", "ho"]
```
*/
export const hash_6b583f49: Array<string> = ["hi", "ho"];

/**
```
const b#05ebca85: Array<string> = <string>["Good", ...z#6b583f49, "uhuh"]
```
*/
export const hash_05ebca85: Array<string> = ["Good", ...hash_6b583f49, "uhuh"];

/**
```
const a#707b8ca0: Array<string> = <string>[...z#6b583f49, "Yes"]
```
*/
export const hash_707b8ca0: Array<string> = [...hash_6b583f49, "Yes"];

/*
switch a#707b8ca0 {[] => false, [..._#:0, "Yes"] => true, _#:1 => false}
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
switch <void>[] {[one#:0, ...rest#:1] => false, [] => true}
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
switch a#707b8ca0 {[] => false, [..._#:0, "Yes"] => true, _#:1 => false}
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
    ["Bad", ..._#:0] => false,
    ["Good", ..._#:1, "Bad"] => false,
    ["Good", ..._#:2, "uhuh"] => true,
    _#:3 => false,
}
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