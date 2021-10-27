import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.5661807692527293) type Addable#d2395568<T#:0> = {
    "+": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_d2395568<T> = {
  type: "d2395568";
  hd2395568_0: (arg_0: T, arg_1: T) => T;
};

/**
```
@unique(0.5383562320075749) type Eq#2f333afa<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_2f333afa<T> = {
  type: "2f333afa";
  h2f333afa_0: (arg_0: T, arg_1: T) => boolean;
};

/**
```
const rec arrayEq#3b667c60 = <T#:0>(
    one#:0: Array#builtin<T#:0>,
    two#:1: Array#builtin<T#:0>,
    eq#:2: Eq#2f333afa<T#:0>,
): bool#builtin ={}> {
    switch (one#:0, two#:1) {
        ([], []) => true,
        ([one#:3, ...rone#:4], [two#:5, ...rtwo#:6]) => if one#:3 ==#:2#2f333afa#0 two#:5 {
            3b667c60#self<T#:0>(rone#:4, rtwo#:6, eq#:2);
        } else {
            false;
        },
        _ => false,
    };
}
<T>(one#:0: Array<[var]T#:0>, two#:1: Array<[var]T#:0>, eq#:2: Eq#🧱👨‍🦰🏖️<[var]T#:0>): bool => {
    const one_i#:11: int = 0;
    const two_i#:12: int = 0;
    loop(unbounded) {
        if len(two#:1) - two_i#:12 == 0 && len(one#:0) - one_i#:11 == 0 {
            return true;
        };
        if len(two#:1) - two_i#:12 >= 1 && len(one#:0) - one_i#:11 >= 1 {
            if eq#:2.#Eq#🧱👨‍🦰🏖️#0(one#:0[0 + one_i#:11], two#:1[0 + two_i#:12]) {
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
export const hash_3b667c60: <T>(arg_0: Array<T>, arg_1: Array<T>, arg_2: t_2f333afa<T>) => boolean = <T>(one: Array<T>, two: Array<T>, eq: t_2f333afa<T>) => {
  let one_i: number = 0;
  let two_i: number = 0;

  while (true) {
    if (two.length - two_i == 0 && one.length - one_i == 0) {
      return true;
    }

    if (two.length - two_i >= 1 && one.length - one_i >= 1) {
      if (eq.h2f333afa_0(one[0 + one_i], two[0 + two_i])) {
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
const IntEq#24558044 = Eq#2f333afa<int#builtin>{"=="#2f333afa#0: intEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: intEq}
```
*/
export const hash_24558044: t_2f333afa<number> = ({
  type: "2f333afa",
  h2f333afa_0: intEq
} as t_2f333afa<number>);

/**
```
const ArrayEq#ea2992fa = <T#:0>(eq#:0: Eq#2f333afa<T#:0>): Eq#2f333afa<Array#builtin<T#:0>> ={}> Eq#2f333afa<
    Array#builtin<T#:0>,
>{
    "=="#2f333afa#0: (one#:1: Array#builtin<T#:0>, two#:2: Array#builtin<T#:0>): bool#builtin ={}> len#builtin<
                T#:0,
            >(one#:1) 
            ==#24558044#2f333afa#0 len#builtin<T#:0>(two#:2) 
        &&#builtin arrayEq#3b667c60<T#:0>(one#:1, two#:2, eq#:0),
}
<T>(eq#:0: Eq#🧱👨‍🦰🏖️<[var]T#:0>): Eq#🧱👨‍🦰🏖️<Array<[var]T#:0>> => Eq#🧱👨‍🦰🏖️{TODO SPREADs}{
    h2f333afa_0: (one#:1: Array<[var]T#:0>, two#:2: Array<[var]T#:0>): bool => IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0(
        len<[var]T#:0>(one#:1),
        len<[var]T#:0>(two#:2),
    ) && arrayEq#🤡🏊🔥<[var]T#:0>(one#:1, two#:2, eq#:0),
}
```
*/
export const hash_ea2992fa: <T>(arg_0: t_2f333afa<T>) => t_2f333afa<Array<T>> = <T>(eq$0: t_2f333afa<T>) => ({
  type: "2f333afa",
  h2f333afa_0: (one$1: Array<T>, two$2: Array<T>) => hash_24558044.h2f333afa_0(len(one$1), len(two$2)) && hash_3b667c60(one$1, two$2, eq$0)
} as t_2f333afa<Array<T>>);

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
const FloatEq#143b5e82 = Eq#2f333afa<float#builtin>{"=="#2f333afa#0: floatEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: floatEq}
```
*/
export const hash_143b5e82: t_2f333afa<number> = ({
  type: "2f333afa",
  h2f333afa_0: floatEq
} as t_2f333afa<number>);

/**
```
const ArrayIntEq#f5e5c604 = ArrayEq#ea2992fa<int#builtin>(eq: IntEq#24558044)
ArrayEq#🧱<int>(IntEq#😯🧜‍♂️🐟)
```
*/
export const hash_f5e5c604: t_2f333afa<Array<number>> = hash_ea2992fa(hash_24558044);

/**
```
const goToTown#19cbd74a = (t#:0: Tuple2#builtin<int#builtin, int#builtin>): int#builtin ={}> t#:0.0
(t#:0: Tuple2<int, int>): int => t#:0.0
```
*/
export const hash_19cbd74a: (arg_0: [number, number]) => number = (t: [number, number]) => t[0];

/**
```
const IntArrayAddable#5ec36516 = Addable#d2395568<Array#builtin<int#builtin>>{
    "+"#d2395568#0: (a#:0: Array#builtin<int#builtin>, b#:1: Array#builtin<int#builtin>): Array#builtin<
        int#builtin,
    > ={}> concat#builtin<int#builtin>(a#:0, b#:1),
}
Addable#🧟{TODO SPREADs}{
    hd2395568_0: (a#:0: Array<int>, b#:1: Array<int>): Array<int> => concat<int>(a#:0, b#:1),
}
```
*/
export const hash_5ec36516: t_d2395568<Array<number>> = ({
  type: "d2395568",
  hd2395568_0: (a: Array<number>, b: Array<number>) => concat(a, b)
} as t_d2395568<Array<number>>);

/*
<int#builtin>[1] +#5ec36516#d2395568#0 <int#builtin>[2, 3]
IntArrayAddable#🧑‍💼👩‍🦲🐵😃.#Addable#🧟#0([1], [2, 3])
*/
hash_5ec36516.hd2395568_0([1], [2, 3]);

/*
goToTown#19cbd74a(t: (2, 3)) ==#24558044#2f333afa#0 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, goToTown#🚏🏝️🚣((2, 3)), 2)
*/
assertCall(hash_24558044.h2f333afa_0, hash_19cbd74a([2, 3]), 2);

/*
ArrayEq#ea2992fa<int#builtin>(eq: IntEq#24558044)."=="#2f333afa#0(
    <int#builtin>[1, 2],
    <int#builtin>[1, 2],
)
assertCall(ArrayEq#🧱<int>(IntEq#😯🧜‍♂️🐟).#Eq#🧱👨‍🦰🏖️#0, [1, 2], [1, 2])
*/
assertCall(hash_ea2992fa(hash_24558044).h2f333afa_0, [1, 2], [1, 2]);

/*
ArrayEq#ea2992fa<int#builtin>(eq: IntEq#24558044)."=="#2f333afa#0(
    <int#builtin>[1, 2, 3],
    <int#builtin>[1, 2, 3],
)
assertCall(ArrayEq#🧱<int>(IntEq#😯🧜‍♂️🐟).#Eq#🧱👨‍🦰🏖️#0, [1, 2, 3], [1, 2, 3])
*/
assertCall(hash_ea2992fa(hash_24558044).h2f333afa_0, [1, 2, 3], [1, 2, 3]);

/*
<int#builtin>[1, 2] ==#f5e5c604#2f333afa#0 <int#builtin>[1, 2]
assertCall(ArrayIntEq#🐮.#Eq#🧱👨‍🦰🏖️#0, [1, 2], [1, 2])
*/
assertCall(hash_f5e5c604.h2f333afa_0, [1, 2], [1, 2]);

/*
1 +#builtin 2 *#builtin 3 ==#24558044#2f333afa#0 7
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 1 + 2 * 3, 7)
*/
assertCall(hash_24558044.h2f333afa_0, 1 + 2 * 3, 7);

/*
den#70ad3796 ==#143b5e82#2f333afa#0 -13.0
assertCall(FloatEq#🌽🍸🤵‍♀️.#Eq#🧱👨‍🦰🏖️#0, den#🌡️🛢️🏯😃, -13)
*/
assertCall(hash_143b5e82.h2f333afa_0, hash_70ad3796, -13);

/*
deep#dcfc5c32 ==#143b5e82#2f333afa#0 -70.0
assertCall(FloatEq#🌽🍸🤵‍♀️.#Eq#🧱👨‍🦰🏖️#0, deep#🤢, -70)
*/
assertCall(hash_143b5e82.h2f333afa_0, hash_dcfc5c32, -70);

/*
thing#5bafb634 ==#24558044#2f333afa#0 0
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, thing#🦢🛷🤹😃, 0)
*/
assertCall(hash_24558044.h2f333afa_0, hash_5bafb634, 0);