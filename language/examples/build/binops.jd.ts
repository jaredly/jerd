import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type Addable#0cd54a60<T#:0> = {
    "+": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_0cd54a60<T_0> = {
  type: "0cd54a60";
  h0cd54a60_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

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
const arrayEq#7825e3a8 = <T#:0>(one#:0: Array<T#:0>, two#:1: Array<T#:0>, eq#:2: Eq#553b4b8e<T#:0>): bool ={}> {
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
        eq = eq;
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
const ArrayEq#bef2134a = <T#:0>(eq#:0: Eq#553b4b8e<T#:0>): Eq#553b4b8e<Array<T#:0>> ={}> Eq#553b4b8e<
    Array<T#:0>,
>{
    "=="#553b4b8e#0: (one#:1: Array<T#:0>, two#:2: Array<T#:0>): bool ={}> len<T#:0>(one#:1) ==#9275f914#553b4b8e#0 len<
        T#:0,
    >(two#:2) && arrayEq#7825e3a8<T#:0>(one#:1, two#:2, eq#:0),
}
```
*/
export const hash_bef2134a: <T_0>(arg_0: t_553b4b8e<T_0>) => t_553b4b8e<Array<T_0>> = <T_0>(eq$0: t_553b4b8e<T_0>) => ({
  type: "553b4b8e",
  h553b4b8e_0: (one$1: Array<T_0>, two$2: Array<T_0>) => hash_9275f914.h553b4b8e_0(len(one$1), len(two$2)) && hash_7825e3a8(one$1, two$2, eq$0)
} as t_553b4b8e<Array<T_0>>);

/**
```
const deep#dcfc5c32 = 1.0 * (2.0 - 3.0 * (4.0 + 2.0 * 10.0))
```
*/
export const hash_dcfc5c32: number = 1 * (2 - 3 * (4 + 2 * 10));

/**
```
const den#70ad3796 = 1.0 * (2.0 - 3.0 * 5.0)
```
*/
export const hash_70ad3796: number = 1 * (2 - 3 * 5);

/**
```
const FloatEq#c41f7386 = Eq#553b4b8e<float>{"=="#553b4b8e#0: floatEq}
```
*/
export const hash_c41f7386: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: floatEq
} as t_553b4b8e<number>);

/**
```
const ArrayIntEq#4419935c = ArrayEq#bef2134a<int>(IntEq#9275f914)
```
*/
export const hash_4419935c: t_553b4b8e<Array<T_0>> = hash_bef2134a(hash_9275f914);

/**
```
const goToTown#a4c2a3f0 = (t#:0: Tuple2<int, int>): int ={}> t#:0.0
```
*/
export const hash_a4c2a3f0: (arg_0: [number, number]) => number = (t: [number, number]) => t[0];

/**
```
const IntArrayAddable#f2052a3a = Addable#0cd54a60<Array<int>>{
    "+"#0cd54a60#0: (a#:0: Array<int>, b#:1: Array<int>): Array<int> ={}> concat<int>(a#:0, b#:1),
}
```
*/
export const hash_f2052a3a: t_0cd54a60<Array<number>> = ({
  type: "0cd54a60",
  h0cd54a60_0: (a: Array<number>, b: Array<number>) => concat(a, b)
} as t_0cd54a60<Array<number>>);

/*
<int>[1] +#f2052a3a#0cd54a60#0 <int>[2, 3]
*/
hash_f2052a3a.h0cd54a60_0([1], [2, 3]);

/*
goToTown#a4c2a3f0((2, 3)) ==#9275f914#553b4b8e#0 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_a4c2a3f0([2, 3]), 2);

/*
ArrayEq#bef2134a<int>(IntEq#9275f914)."=="#553b4b8e#0(<int>[1, 2], <int>[1, 2])
*/
assertCall(hash_bef2134a(hash_9275f914).h553b4b8e_0, [1, 2], [1, 2]);

/*
ArrayEq#bef2134a<int>(IntEq#9275f914)."=="#553b4b8e#0(<int>[1, 2, 3], <int>[1, 2, 3])
*/
assertCall(hash_bef2134a(hash_9275f914).h553b4b8e_0, [1, 2, 3], [1, 2, 3]);

/*
<int>[1, 2] ==#4419935c#553b4b8e#0 <int>[1, 2]
*/
assertCall(hash_4419935c.h553b4b8e_0, [1, 2], [1, 2]);

/*
1 + 2 * 3 ==#9275f914#553b4b8e#0 7
*/
assertCall(hash_9275f914.h553b4b8e_0, 1 + 2 * 3, 7);

/*
den#70ad3796 ==#c41f7386#553b4b8e#0 -13.0
*/
assertCall(hash_c41f7386.h553b4b8e_0, hash_70ad3796, -13);

/*
deep#dcfc5c32 ==#c41f7386#553b4b8e#0 -70.0
*/
assertCall(hash_c41f7386.h553b4b8e_0, hash_dcfc5c32, -70);