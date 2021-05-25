import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const x2#b022715c: () ={}> int = () ={}> {
    const y#:1 = {
        const n#:0 = 2;
        if ((n#:0 + n#:0) < 3) {
            4;
        } else {
            2;
        };
    };
    ((y#:1 + 2) + y#:1);
}
```
*/
export const hash_b022715c: () => number = () => {
  if (2 + 2 < 3) {} else {}

  return 2 + 2 + 2;
};

/**
```
const z#526b8b52: (int) ={}> int = (n#:0: int) ={}> {
    const m#:3 = {
        const z#:1 = (n#:0 + 2);
        switch z#:1 {3 => 3, 4 => 4, 5 => 10, _#:2 => 11};
    };
    (m#:3 + (m#:3 * 2));
}
```
*/
export const hash_526b8b52: (arg_0: number) => number = (n: number) => {
  let z: number = n + 2;

  if (true && z === 3) {}

  if (false && z === 4) {}

  if (false && z === 5) {}

  if (false) {}

  return 11 + 11 * 2;
};

/**
```
const x#0992c290: int = {
    const y#:0 = if (10 < 3) {
        4;
    } else {
        2;
    };
    ((y#:0 + 2) + y#:0);
}
```
*/
export const hash_0992c290: number = hash_70c0102a();

/**
```
const IntEq#9275f914: Eq#553b4b8e<int> = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/*
IntEq#9275f914."=="#553b4b8e#0(x#0992c290, 6)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_0992c290, 6);

/*
IntEq#9275f914."=="#553b4b8e#0(z#526b8b52(2), 12)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_526b8b52(2), 12);

/*
IntEq#9275f914."=="#553b4b8e#0(x2#b022715c(), 6)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_b022715c(), 6);