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
const x2#b022715c = (): int#builtin ={}> {
    const y#:1 = {
        const n#:0 = 2;
        if n#:0 +#builtin n#:0 <#builtin 3 {
            4;
        } else {
            2;
        };
    };
    y#:1 +#builtin 2 +#builtin y#:1;
}
```
*/
export const hash_b022715c: () => number = () => {
  let y: number;

  if (2 + 2 < 3) {
    y = 4;
  } else {
    y = 2;
  }

  return y + 2 + y;
};

/**
```
const z#b1f9e632 = (n#:0: int#builtin): int#builtin ={}> {
    const m#:2 = {
        const z#:1 = n#:0 +#builtin 2;
        switch z#:1 {3 => 3, 4 => 4, 5 => 10, _ => 11};
    };
    m#:2 +#builtin m#:2 *#builtin 2;
}
```
*/
export const hash_b1f9e632: (arg_0: number) => number = (n: number) => {
  let m: number;
  let continueBlock: boolean = true;
  let z: number = n + 2;

  if (z === 3) {
    m = 3;
    continueBlock = false;
  }

  if (continueBlock) {
    if (z === 4) {
      m = 4;
      continueBlock = false;
    }

    if (continueBlock) {
      if (z === 5) {
        m = 10;
        continueBlock = false;
      }

      if (continueBlock) {
        m = 11;
        continueBlock = false;
      }
    }
  }

  return m + m * 2;
};

/**
```
const x#0992c290 = {
    const y#:0 = if 10 <#builtin 3 {
        4;
    } else {
        2;
    };
    y#:0 +#builtin 2 +#builtin y#:0;
}
```
*/
export const hash_0992c290: number = (() => {
  let y$0: number;

  if (10 < 3) {
    y$0 = 4;
  } else {
    y$0 = 2;
  }

  return y$0 + 2 + y$0;
})();

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/*
x#0992c290 ==#9275f914#553b4b8e#0 6
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_0992c290, 6);

/*
z#b1f9e632(n: 2) ==#9275f914#553b4b8e#0 12
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_b1f9e632(2), 12);

/*
x2#b022715c() ==#9275f914#553b4b8e#0 6
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_b022715c(), 6);