import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.5383562320075749) type Eq#3b6b23ae<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_3b6b23ae<T> = {
  type: "3b6b23ae";
  h3b6b23ae_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const IntEq#6d46a318 = Eq#3b6b23ae<int#builtin>{"=="#3b6b23ae#0: intEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: intEq}
```
*/
export const hash_6d46a318: t_3b6b23ae<number> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: intEq
} as t_3b6b23ae<number>);

/**
```
const rec fib#874a44e2 = (prev#:0: int#builtin, cur#:1: int#builtin, n#:2: int#builtin): int#builtin ={}> if n#:2 
    ==#6d46a318#3b6b23ae#0 0 {
    prev#:0;
} else {
    874a44e2#self(cur#:1, prev#:0 +#builtin cur#:1, n#:2 -#builtin 1);
}
(prev#:0: int, cur#:1: int, n#:2: int): int => {
    loop(unbounded) {
        if IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0(n#:2, 0) {
            return prev#:0;
        } else {
            const recur#:4: int = prev#:0 + cur#:1;
            prev#:0 = cur#:1;
            cur#:1 = recur#:4;
            n#:2 = n#:2 - 1;
            continue;
        };
    };
}
```
*/
export const hash_874a44e2: (arg_0: number, arg_1: number, arg_2: number) => number = (prev: number, cur: number, n: number) => {
  while (true) {
    if (hash_6d46a318.h3b6b23ae_0(n, 0)) {
      return prev;
    } else {
      let recur: number = prev + cur;
      prev = cur;
      cur = recur;
      n = n - 1;
      continue;
    }
  }
};

/**
```
const z#560f2d40 = (n#:0: int#builtin): int#builtin ={}> {
    const m#:1 = n#:0 +#builtin 2;
    m#:1 -#builtin 1;
}
(n#:0: int): int => n#:0 + 2 - 1
```
*/
export const hash_560f2d40: (arg_0: number) => number = (n$0: number) => n$0 + 2 - 1;

/**
```
const x#6a4891d8 = {
    const y#:0 = 10;
    y#:0;
}
10
```
*/
export const hash_6a4891d8: number = 10;

/*
x#6a4891d8 ==#6d46a318#3b6b23ae#0 10
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, x#👨‍👨‍👧‍👧🦦🥘😃, 10)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_6a4891d8, 10);

/*
z#560f2d40(n: 10) ==#6d46a318#3b6b23ae#0 11
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, z#🧕🎗️🧜‍♂️😃(10), 11)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_560f2d40(10), 11);

/*
fib#874a44e2(prev: 0, cur: 1, n: 10) ==#6d46a318#3b6b23ae#0 55
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, fib#🙍‍♀️(0, 1, 10), 55)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_874a44e2(0, 1, 10), 55);