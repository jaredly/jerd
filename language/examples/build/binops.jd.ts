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
type Addable#11263092<T#:0> = {
    "+": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_11263092<T_0> = {
  type: "11263092";
  h11263092_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
const rec arrayEq#7825e3a8 = <T#:0>(
    one#:0: Array#builtin<T#:0>,
    two#:1: Array#builtin<T#:0>,
    eq#:2: Eq#553b4b8e<T#:0>,
): bool#builtin ={}> {
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
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const ArrayEq#bef2134a = <T#:0>(eq#:0: Eq#553b4b8e<T#:0>): Eq#553b4b8e<Array#builtin<T#:0>> ={}> Eq#553b4b8e<
    Array#builtin<T#:0>,
>{
    "=="#553b4b8e#0: (one#:1: Array#builtin<T#:0>, two#:2: Array#builtin<T#:0>): bool#builtin ={}> len#builtin<
                T#:0,
            >(one#:1) 
            ==#9275f914#553b4b8e#0 len#builtin<T#:0>(two#:2) 
        &&#builtin arrayEq#7825e3a8<T#:0>(one#:1, two#:2, eq#:0),
}
```
*/
export const hash_bef2134a: <T_0>(arg_0: t_553b4b8e<T_0>) => t_553b4b8e<Array<T_0>> = <T_0>(eq$0: t_553b4b8e<T_0>) => ({
  type: "553b4b8e",
  h553b4b8e_0: (one$1: Array<T_0>, two$2: Array<T_0>) => hash_9275f914.h553b4b8e_0(len(one$1), len(two$2)) && hash_7825e3a8(one$1, two$2, eq$0)
} as t_553b4b8e<Array<T_0>>);

/**
```
const thing#5bafb634 = 1 -#builtin (2 -#builtin 1)
```
*/
export const hash_5bafb634: number = 1 - (2 - 1);

/**
```
const deep#dcfc5c32 = 1.0 
    *#builtin (2.0 -#builtin 3.0 *#builtin (4.0 +#builtin 2.0 *#builtin 10.0))
```
*/
export const hash_dcfc5c32: number = 1 * (2 - 3 * (4 + 2 * 10));

/**
```
const den#70ad3796 = 1.0 *#builtin (2.0 -#builtin 3.0 *#builtin 5.0)
```
*/
export const hash_70ad3796: number = 1 * (2 - 3 * 5);

/**
```
const FloatEq#c41f7386 = Eq#553b4b8e<float#builtin>{"=="#553b4b8e#0: floatEq#builtin}
```
*/
export const hash_c41f7386: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: floatEq
} as t_553b4b8e<number>);

/**
```
const ArrayIntEq#4419935c = ArrayEq#bef2134a<int#builtin>(eq: IntEq#9275f914)
```
*/
export const hash_4419935c: t_553b4b8e<Array<number>> = hash_bef2134a(hash_9275f914);

/**
```
const goToTown#a4c2a3f0 = (t#:0: Tuple2#builtin<int#builtin, int#builtin>): int#builtin ={}> t#:0.0
```
*/
export const hash_a4c2a3f0: (arg_0: [number, number]) => number = (t: [number, number]) => t[0];

/**
```
const IntArrayAddable#82902218 = Addable#11263092<Array#builtin<int#builtin>>{
    "+"#11263092#0: (a#:0: Array#builtin<int#builtin>, b#:1: Array#builtin<int#builtin>): Array#builtin<
        int#builtin,
    > ={}> concat#builtin<int#builtin>(a#:0, b#:1),
}
```
*/
export const hash_82902218: t_11263092<Array<number>> = ({
  type: "11263092",
  h11263092_0: (a: Array<number>, b: Array<number>) => concat(a, b)
} as t_11263092<Array<number>>);

/*
<int#builtin>[1] +#82902218#11263092#0 <int#builtin>[2, 3]
*/
hash_82902218.h11263092_0([1], [2, 3]);

/*
goToTown#a4c2a3f0(t: (2, 3)) ==#9275f914#553b4b8e#0 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_a4c2a3f0([2, 3]), 2);

/*
ArrayEq#bef2134a<int#builtin>(eq: IntEq#9275f914)."=="#553b4b8e#0(
    <int#builtin>[1, 2],
    <int#builtin>[1, 2],
)
*/
assertCall(hash_bef2134a(hash_9275f914).h553b4b8e_0, [1, 2], [1, 2]);

/*
ArrayEq#bef2134a<int#builtin>(eq: IntEq#9275f914)."=="#553b4b8e#0(
    <int#builtin>[1, 2, 3],
    <int#builtin>[1, 2, 3],
)
*/
assertCall(hash_bef2134a(hash_9275f914).h553b4b8e_0, [1, 2, 3], [1, 2, 3]);

/*
<int#builtin>[1, 2] ==#4419935c#553b4b8e#0 <int#builtin>[1, 2]
*/
assertCall(hash_4419935c.h553b4b8e_0, [1, 2], [1, 2]);

/*
1 +#builtin 2 *#builtin 3 ==#9275f914#553b4b8e#0 7
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

/*
thing#5bafb634 ==#9275f914#553b4b8e#0 0
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5bafb634, 0);