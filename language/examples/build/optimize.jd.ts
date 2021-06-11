import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
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
const rec arrayEq#7825e3a8 = <T#:0>(
    one#:0: Array<T#:0>,
    two#:1: Array<T#:0>,
    eq#:2: Eq#553b4b8e<T#:0>,
): bool ={}> {
    switch (one#:0, two#:1) {
        ([], []) => true,
        ([one#:3, ...rone#:4], [two#:5, ...rtwo#:6]) => if eq#:2."=="#553b4b8e#0(one#:3, two#:5) {
            7825e3a8#self<T#:0>(rone#:4, rtwo#:6, eq#:2);
        } else {
            false;
        },
        _#:7 => false,
    };
}
```
*/
export const hash_7825e3a8: <T_0>(arg_0: Array<T_0>, arg_1: Array<T_0>, arg_2: t_553b4b8e<T_0>) => boolean = <T_0>(one: Array<T_0>, two: Array<T_0>, eq: t_553b4b8e<T_0>) => {
  let one_i: number = 0;
  let two_i: number = 0;

  while (true) {
    if (two.length - two_i == 0 && one.length - one_i == 0) {
      return true;
    }

    if (two.length - two_i >= 1 && one.length - one_i >= 1) {
      if (eq.h553b4b8e_0(one[0 + one_i], two[0 + two_i])) {
        one_i = one_i + 1;
        two_i = two_i + 1;
        continue;
      } else {
        return false;
      }
    }

    return false;
  }
};

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const rec recurse#3306c09c = (n#:0: int): int ={}> {
    if n#:0 > 5 {
        3306c09c#self(n#:0 - 1) + 1;
    } else {
        3;
    };
}
```
*/
export const hash_3306c09c: (arg_0: number) => number = (n: number) => {
  if (n > 5) {
    return hash_3306c09c(n - 1) + 1;
  } else {
    return 3;
  }
};

/**
```
const ArrayEq#bef2134a = <T#:0>(eq#:0: Eq#553b4b8e<T#:0>): Eq#553b4b8e<Array<T#:0>> ={}> Eq#553b4b8e<
    Array<T#:0>,
>{
    "=="#553b4b8e#0: (one#:1: Array<T#:0>, two#:2: Array<T#:0>): bool ={}> len<T#:0>(one#:1) 
            ==#9275f914#553b4b8e#0 len<T#:0>(two#:2) 
        && arrayEq#7825e3a8<T#:0>(one#:1, two#:2, eq#:0),
}
```
*/
export const hash_bef2134a: <T_0>(arg_0: t_553b4b8e<T_0>) => t_553b4b8e<Array<T_0>> = <T_0>(eq$0: t_553b4b8e<T_0>) => ({
  type: "553b4b8e",
  h553b4b8e_0: (one$1: Array<T_0>, two$2: Array<T_0>) => hash_9275f914.h553b4b8e_0(len(one$1), len(two$2)) && hash_7825e3a8(one$1, two$2, eq$0)
} as t_553b4b8e<Array<T_0>>);

/**
```
const m#b92dd000 = {
    const x#:1 = recurse#3306c09c({
        const y#:0 = recurse#3306c09c(4);
        y#:0 + 2 + y#:0;
    } + 3);
    x#:1 + 3 + x#:1;
}
```
*/
export const hash_b92dd000: number = (() => {
  let lambdaBlockResult: number = (null as any);
  let y: number = hash_3306c09c(4);
  lambdaBlockResult = y + 2 + y;
  let x: number = hash_3306c09c(lambdaBlockResult + 3);
  return x + 3 + x;
})();

/**
```
const ArrayIntEq#4419935c = ArrayEq#bef2134a<int>(IntEq#9275f914)
```
*/
export const hash_4419935c: t_553b4b8e<Array<T_0>> = hash_bef2134a(hash_9275f914);

/*
<int>[1, 2] ==#4419935c#553b4b8e#0 <int>[1, 2]
*/
assertCall(hash_4419935c.h553b4b8e_0, [1, 2], [1, 2]);

/*
{
    const a#:0 = <int>[1, 2, 3];
    switch a#:0 {
        [a#:1, ...b#:2] => switch b#:2 {
            [b#:3, ...c#:4] => switch c#:4 {
                [c#:5] => a#:1 ==#9275f914#553b4b8e#0 1 && b#:3 ==#9275f914#553b4b8e#0 2 
                    && c#:5 ==#9275f914#553b4b8e#0 3,
                _#:6 => false,
            },
            _#:7 => false,
        },
        _#:8 => false,
    };
}
*/
assert((() => {
  let a: Array<number> = [1, 2, 3];

  if (a.length >= 1) {
    let b_i: number = 1;

    if (a.length - b_i >= 1) {
      let c_i: number = 1;

      if (a.length - (c_i + b_i) == 1) {
        return hash_9275f914.h553b4b8e_0(a[0], 1) && hash_9275f914.h553b4b8e_0(a[0 + b_i], 2) && hash_9275f914.h553b4b8e_0(a[0 + (c_i + b_i)], 3);
      }

      return false;
    }

    return false;
  }

  return false;
})());

/*
m#b92dd000
*/
hash_b92dd000;