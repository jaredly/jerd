import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.4035738849882096) type Addable#e5de2440<T#:0> = {
    "+": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_e5de2440<T> = {
  type: "e5de2440";
  he5de2440_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

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
const rec arrayEq#47c98b7c = <T#:0>(
    one#:0: Array#builtin<T#:0>,
    two#:1: Array#builtin<T#:0>,
    eq#:2: Eq#3b6b23ae<T#:0>,
): bool#builtin ={}> {
    switch (one#:0, two#:1) {
        ([], []) => true,
        ([one#:3, ...rone#:4], [two#:5, ...rtwo#:6]) => if one#:3 ==#:2#3b6b23ae#0 two#:5 {
            47c98b7c#self<T#:0>(rone#:4, rtwo#:6, eq#:2);
        } else {
            false;
        },
        _ => false,
    };
}
<T>(one#:0: Array<[var]T#:0>, two#:1: Array<[var]T#:0>, eq#:2: Eq#☂️🍰🔥<[var]T#:0>): bool => {
    const one_i#:11: int = 0;
    const two_i#:12: int = 0;
    loop(unbounded) {
        if len(two#:1) - two_i#:12 == 0 && len(one#:0) - one_i#:11 == 0 {
            return true;
        };
        if len(two#:1) - two_i#:12 >= 1 && len(one#:0) - one_i#:11 >= 1 {
            if eq#:2.#Eq#☂️🍰🔥#0(one#:0[0 + one_i#:11], two#:1[0 + two_i#:12]) {
                one_i#:11 = one_i#:11 + 1;
                two_i#:12 = two_i#:12 + 1;
                continue;
            } else {
                return false;
            };
        };
        return false;
    };
}
```
*/
export const hash_47c98b7c: <T>(arg_0: Array<T_0>, arg_1: Array<T_0>, arg_2: t_3b6b23ae<T_0>) => boolean = <T>(one: Array<T_0>, two: Array<T_0>, eq: t_3b6b23ae<T_0>) => {
  let one_i: number = 0;
  let two_i: number = 0;

  while (true) {
    if (two.length - two_i == 0 && one.length - one_i == 0) {
      return true;
    }

    if (two.length - two_i >= 1 && one.length - one_i >= 1) {
      if (eq.h3b6b23ae_0(one[0 + one_i], two[0 + two_i])) {
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
const ArrayEq#0656ab3a = <T#:0>(eq#:0: Eq#3b6b23ae<T#:0>): Eq#3b6b23ae<Array#builtin<T#:0>> ={}> Eq#3b6b23ae<
    Array#builtin<T#:0>,
>{
    "=="#3b6b23ae#0: (one#:1: Array#builtin<T#:0>, two#:2: Array#builtin<T#:0>): bool#builtin ={}> len#builtin<
                T#:0,
            >(one#:1) 
            ==#6d46a318#3b6b23ae#0 len#builtin<T#:0>(two#:2) 
        &&#builtin arrayEq#47c98b7c<T#:0>(one#:1, two#:2, eq#:0),
}
<T>(eq#:0: Eq#☂️🍰🔥<[var]T#:0>): Eq#☂️🍰🔥<Array<[var]T#:0>> => Eq#☂️🍰🔥{TODO SPREADs}{
    h3b6b23ae_0: (one#:1: Array<[var]T#:0>, two#:2: Array<[var]T#:0>): bool => IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0(
        len<[var]T#:0>(one#:1),
        len<[var]T#:0>(two#:2),
    ) && arrayEq#🕔🌲💟😃<[var]T#:0>(one#:1, two#:2, eq#:0),
}
```
*/
export const hash_0656ab3a: <T>(arg_0: t_3b6b23ae<T_0>) => t_3b6b23ae<Array<T_0>> = <T>(eq$0: t_3b6b23ae<T_0>) => ({
  type: "3b6b23ae",
  h3b6b23ae_0: (one$1: Array<T_0>, two$2: Array<T_0>) => hash_6d46a318.h3b6b23ae_0(len(one$1), len(two$2)) && hash_47c98b7c(one$1, two$2, eq$0)
} as t_3b6b23ae<Array<T_0>>);

/**
```
const thing#5bafb634 = 1 -#builtin (2 -#builtin 1)
1 - 2 - 1
```
*/
export const hash_5bafb634: number = 1 - (2 - 1);

/**
```
const deep#dcfc5c32 = 1.0 
    *#builtin (2.0 -#builtin 3.0 *#builtin (4.0 +#builtin 2.0 *#builtin 10.0))
1 * 2 - 3 * 4 + 2 * 10
```
*/
export const hash_dcfc5c32: number = 1 * (2 - 3 * (4 + 2 * 10));

/**
```
const den#70ad3796 = 1.0 *#builtin (2.0 -#builtin 3.0 *#builtin 5.0)
1 * 2 - 3 * 5
```
*/
export const hash_70ad3796: number = 1 * (2 - 3 * 5);

/**
```
const FloatEq#000a9fb6 = Eq#3b6b23ae<float#builtin>{"=="#3b6b23ae#0: floatEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: floatEq}
```
*/
export const hash_000a9fb6: t_3b6b23ae<number> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: floatEq
} as t_3b6b23ae<number>);

/**
```
const ArrayIntEq#0d2e6b26 = ArrayEq#0656ab3a<int#builtin>(eq: IntEq#6d46a318)
ArrayEq#🚖🚴‍♀️👾<int>(IntEq#🌃🚴🍶😃)
```
*/
export const hash_0d2e6b26: t_3b6b23ae<Array<number>> = hash_0656ab3a(hash_6d46a318);

/**
```
const goToTown#19cbd74a = (t#:0: Tuple2#builtin<int#builtin, int#builtin>): int#builtin ={}> t#:0.0
(t#:0: Tuple2<int, int>): int => t#:0.0
```
*/
export const hash_19cbd74a: (arg_0: [number, number]) => number = (t: [number, number]) => t[0];

/**
```
const IntArrayAddable#a30027a4 = Addable#e5de2440<Array#builtin<int#builtin>>{
    "+"#e5de2440#0: (a#:0: Array#builtin<int#builtin>, b#:1: Array#builtin<int#builtin>): Array#builtin<
        int#builtin,
    > ={}> concat#builtin<int#builtin>(a#:0, b#:1),
}
Addable#😟{TODO SPREADs}{
    he5de2440_0: (a#:0: Array<int>, b#:1: Array<int>): Array<int> => concat<int>(a#:0, b#:1),
}
```
*/
export const hash_a30027a4: t_e5de2440<Array<number>> = ({
  type: "e5de2440",
  he5de2440_0: (a: Array<number>, b: Array<number>) => concat(a, b)
} as t_e5de2440<Array<number>>);

/*
<int#builtin>[1] +#a30027a4#e5de2440#0 <int#builtin>[2, 3]
IntArrayAddable#🌦️.#Addable#😟#0([1], [2, 3])
*/
hash_a30027a4.he5de2440_0([1], [2, 3]);

/*
goToTown#19cbd74a(t: (2, 3)) ==#6d46a318#3b6b23ae#0 2
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, goToTown#🚏🏝️🚣((2, 3)), 2)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_19cbd74a([2, 3]), 2);

/*
ArrayEq#0656ab3a<int#builtin>(eq: IntEq#6d46a318)."=="#3b6b23ae#0(
    <int#builtin>[1, 2],
    <int#builtin>[1, 2],
)
assertCall(ArrayEq#🚖🚴‍♀️👾<int>(IntEq#🌃🚴🍶😃).#Eq#☂️🍰🔥#0, [1, 2], [1, 2])
*/
assertCall(hash_0656ab3a(hash_6d46a318).h3b6b23ae_0, [1, 2], [1, 2]);

/*
ArrayEq#0656ab3a<int#builtin>(eq: IntEq#6d46a318)."=="#3b6b23ae#0(
    <int#builtin>[1, 2, 3],
    <int#builtin>[1, 2, 3],
)
assertCall(ArrayEq#🚖🚴‍♀️👾<int>(IntEq#🌃🚴🍶😃).#Eq#☂️🍰🔥#0, [1, 2, 3], [1, 2, 3])
*/
assertCall(hash_0656ab3a(hash_6d46a318).h3b6b23ae_0, [1, 2, 3], [1, 2, 3]);

/*
<int#builtin>[1, 2] ==#0d2e6b26#3b6b23ae#0 <int#builtin>[1, 2]
assertCall(ArrayIntEq#🚃🪐👩.#Eq#☂️🍰🔥#0, [1, 2], [1, 2])
*/
assertCall(hash_0d2e6b26.h3b6b23ae_0, [1, 2], [1, 2]);

/*
1 +#builtin 2 *#builtin 3 ==#6d46a318#3b6b23ae#0 7
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 1 + 2 * 3, 7)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 1 + 2 * 3, 7);

/*
den#70ad3796 ==#000a9fb6#3b6b23ae#0 -13.0
assertCall(FloatEq#🔥🥗.#Eq#☂️🍰🔥#0, den#🌡️🛢️🏯😃, -13)
*/
assertCall(hash_000a9fb6.h3b6b23ae_0, hash_70ad3796, -13);

/*
deep#dcfc5c32 ==#000a9fb6#3b6b23ae#0 -70.0
assertCall(FloatEq#🔥🥗.#Eq#☂️🍰🔥#0, deep#🤢, -70)
*/
assertCall(hash_000a9fb6.h3b6b23ae_0, hash_dcfc5c32, -70);

/*
thing#5bafb634 ==#6d46a318#3b6b23ae#0 0
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, thing#🦢🛷🤹😃, 0)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_5bafb634, 0);