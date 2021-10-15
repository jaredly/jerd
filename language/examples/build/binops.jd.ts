import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.4035738849882096) type Addable#1e488087<T#:0> = {
    "+": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_1e488087<T_0> = {
  type: "1e488087";
  h1e488087_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
@unique(0.5383562320075749) type Eq#51ea2a36<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_51ea2a36<T_0> = {
  type: "51ea2a36";
  h51ea2a36_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const rec arrayEq#0b9c95cc = <T#:0>(
    one#:0: Array#builtin<T#:0>,
    two#:1: Array#builtin<T#:0>,
    eq#:2: Eq#51ea2a36<T#:0>,
): bool#builtin ={}> {
    switch (one#:0, two#:1) {
        ([], []) => true,
        ([one#:3, ...rone#:4], [two#:5, ...rtwo#:6]) => if one#:3 ==#:2#51ea2a36#0 two#:5 {
            0b9c95cc#self<T#:0>(rone#:4, rtwo#:6, eq#:2);
        } else {
            false;
        },
        _ => false,
    };
}
<T>(one#:0: Array<[var]T#:0>, two#:1: Array<[var]T#:0>, eq#:2: Eq#🦩🥜👩‍💻😃<[var]T#:0>): bool => {
    const one_i#:11: int = 0;
    const two_i#:12: int = 0;
    loop(unbounded) {
        if len(two#:1) - two_i#:12 == 0 && len(one#:0) - one_i#:11 == 0 {
            return true;
        };
        if len(two#:1) - two_i#:12 >= 1 && len(one#:0) - one_i#:11 >= 1 {
            if eq#:2.#Eq#🦩🥜👩‍💻😃#0(one#:0[0 + one_i#:11], two#:1[0 + two_i#:12]) {
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
export const hash_0b9c95cc: <T_0>(arg_0: Array<T_0>, arg_1: Array<T_0>, arg_2: t_51ea2a36<T_0>) => boolean = <T_0>(one: Array<T_0>, two: Array<T_0>, eq: t_51ea2a36<T_0>) => {
  let one_i: number = 0;
  let two_i: number = 0;

  while (true) {
    if (two.length - two_i == 0 && one.length - one_i == 0) {
      return true;
    }

    if (two.length - two_i >= 1 && one.length - one_i >= 1) {
      if (eq.h51ea2a36_0(one[0 + one_i], two[0 + two_i])) {
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
const IntEq#ec95f154 = Eq#51ea2a36<int#builtin>{"=="#51ea2a36#0: intEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: intEq}
```
*/
export const hash_ec95f154: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: intEq
} as t_51ea2a36<number>);

/**
```
const ArrayEq#1a50aec3 = <T#:0>(eq#:0: Eq#51ea2a36<T#:0>): Eq#51ea2a36<Array#builtin<T#:0>> ={}> Eq#51ea2a36<
    Array#builtin<T#:0>,
>{
    "=="#51ea2a36#0: (one#:1: Array#builtin<T#:0>, two#:2: Array#builtin<T#:0>): bool#builtin ={}> len#builtin<
                T#:0,
            >(one#:1) 
            ==#ec95f154#51ea2a36#0 len#builtin<T#:0>(two#:2) 
        &&#builtin arrayEq#0b9c95cc<T#:0>(one#:1, two#:2, eq#:0),
}
<T>(eq#:0: Eq#🦩🥜👩‍💻😃<[var]T#:0>): Eq#🦩🥜👩‍💻😃<Array<[var]T#:0>> => Eq#🦩🥜👩‍💻😃{TODO SPREADs}{
    h51ea2a36_0: (one#:1: Array<[var]T#:0>, two#:2: Array<[var]T#:0>): bool => IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(
        len<[var]T#:0>(one#:1),
        len<[var]T#:0>(two#:2),
    ) && arrayEq#👨‍❤️‍👨🚂🦿<[var]T#:0>(one#:1, two#:2, eq#:0),
}
```
*/
export const hash_1a50aec3: <T_0>(arg_0: t_51ea2a36<T_0>) => t_51ea2a36<Array<T_0>> = <T_0>(eq$0: t_51ea2a36<T_0>) => ({
  type: "51ea2a36",
  h51ea2a36_0: (one$1: Array<T_0>, two$2: Array<T_0>) => hash_ec95f154.h51ea2a36_0(len(one$1), len(two$2)) && hash_0b9c95cc(one$1, two$2, eq$0)
} as t_51ea2a36<Array<T_0>>);

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
const FloatEq#9ca984ce = Eq#51ea2a36<float#builtin>{"=="#51ea2a36#0: floatEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: floatEq}
```
*/
export const hash_9ca984ce: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: floatEq
} as t_51ea2a36<number>);

/**
```
const ArrayIntEq#513ad540 = ArrayEq#1a50aec3<int#builtin>(eq: IntEq#ec95f154)
ArrayEq#🍧😔🏋️<int>(IntEq#🦹‍♂️)
```
*/
export const hash_513ad540: t_51ea2a36<Array<number>> = hash_1a50aec3(hash_ec95f154);

/**
```
const goToTown#19cbd74a = (t#:0: Tuple2#builtin<int#builtin, int#builtin>): int#builtin ={}> t#:0.0
(t#:0: Tuple2<int, int>): int => t#:0.0
```
*/
export const hash_19cbd74a: (arg_0: [number, number]) => number = (t: [number, number]) => t[0];

/**
```
const IntArrayAddable#14929696 = Addable#1e488087<Array#builtin<int#builtin>>{
    "+"#1e488087#0: (a#:0: Array#builtin<int#builtin>, b#:1: Array#builtin<int#builtin>): Array#builtin<
        int#builtin,
    > ={}> concat#builtin<int#builtin>(a#:0, b#:1),
}
Addable#🤍🐻‍❄️👩‍👦‍👦{TODO SPREADs}{
    h1e488087_0: (a#:0: Array<int>, b#:1: Array<int>): Array<int> => concat<int>(a#:0, b#:1),
}
```
*/
export const hash_14929696: t_1e488087<Array<number>> = ({
  type: "1e488087",
  h1e488087_0: (a: Array<number>, b: Array<number>) => concat(a, b)
} as t_1e488087<Array<number>>);

/*
<int#builtin>[1] +#14929696#1e488087#0 <int#builtin>[2, 3]
IntArrayAddable#🥩🖕👩‍🍼.#Addable#🤍🐻‍❄️👩‍👦‍👦#0([1], [2, 3])
*/
hash_14929696.h1e488087_0([1], [2, 3]);

/*
goToTown#19cbd74a(t: (2, 3)) ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, goToTown#🚏🏝️🚣((2, 3)), 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_19cbd74a([2, 3]), 2);

/*
ArrayEq#1a50aec3<int#builtin>(eq: IntEq#ec95f154)."=="#51ea2a36#0(
    <int#builtin>[1, 2],
    <int#builtin>[1, 2],
)
assertCall(ArrayEq#🍧😔🏋️<int>(IntEq#🦹‍♂️).#Eq#🦩🥜👩‍💻😃#0, [1, 2], [1, 2])
*/
assertCall(hash_1a50aec3(hash_ec95f154).h51ea2a36_0, [1, 2], [1, 2]);

/*
ArrayEq#1a50aec3<int#builtin>(eq: IntEq#ec95f154)."=="#51ea2a36#0(
    <int#builtin>[1, 2, 3],
    <int#builtin>[1, 2, 3],
)
assertCall(ArrayEq#🍧😔🏋️<int>(IntEq#🦹‍♂️).#Eq#🦩🥜👩‍💻😃#0, [1, 2, 3], [1, 2, 3])
*/
assertCall(hash_1a50aec3(hash_ec95f154).h51ea2a36_0, [1, 2, 3], [1, 2, 3]);

/*
<int#builtin>[1, 2] ==#513ad540#51ea2a36#0 <int#builtin>[1, 2]
assertCall(ArrayIntEq#🧕🍣🧑‍🏭😃.#Eq#🦩🥜👩‍💻😃#0, [1, 2], [1, 2])
*/
assertCall(hash_513ad540.h51ea2a36_0, [1, 2], [1, 2]);

/*
1 +#builtin 2 *#builtin 3 ==#ec95f154#51ea2a36#0 7
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 1 + 2 * 3, 7)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 1 + 2 * 3, 7);

/*
den#70ad3796 ==#9ca984ce#51ea2a36#0 -13.0
assertCall(FloatEq#👨‍🦰.#Eq#🦩🥜👩‍💻😃#0, den#🌡️🛢️🏯😃, -13)
*/
assertCall(hash_9ca984ce.h51ea2a36_0, hash_70ad3796, -13);

/*
deep#dcfc5c32 ==#9ca984ce#51ea2a36#0 -70.0
assertCall(FloatEq#👨‍🦰.#Eq#🦩🥜👩‍💻😃#0, deep#🤢, -70)
*/
assertCall(hash_9ca984ce.h51ea2a36_0, hash_dcfc5c32, -70);

/*
thing#5bafb634 ==#ec95f154#51ea2a36#0 0
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, thing#🦢🛷🤹😃, 0)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_5bafb634, 0);