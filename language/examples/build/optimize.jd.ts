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
const rec recurse#be476d3c = (n#:0: int#builtin): int#builtin ={}> {
    if n#:0 >#builtin 5 {
        be476d3c#self(n#:0 -#builtin 1) +#builtin 1;
    } else {
        3;
    };
}
(n#:0: int): int => {
    if n#:0 > 5 {
        return recurse#👳(n#:0 - 1) + 1;
    } else {
        return 3;
    };
}
```
*/
export const hash_be476d3c: (arg_0: number) => number = (n: number) => {
  if (n > 5) {
    return hash_be476d3c(n - 1) + 1;
  } else {
    return 3;
  }
};

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
const m#13597ff1 = {
    const x#:1 = recurse#be476d3c(
        n: {
            const y#:0 = recurse#be476d3c(n: 4);
            y#:0 +#builtin 2 +#builtin y#:0;
        } +#builtin 3,
    );
    x#:1 +#builtin 3 +#builtin x#:1;
}
((): int => {
    const result#:2: int;
    const y#:0: int = recurse#👳(4);
    result#:2 = y#:0 + 2 + y#:0;
    const x#:1: int = recurse#👳(result#:2 + 3);
    return x#:1 + 3 + x#:1;
})()
```
*/
export const hash_13597ff1: number = (() => {
  let result: number;
  let y: number = hash_be476d3c(4);
  result = y + 2 + y;
  let x: number = hash_be476d3c(result + 3);
  return x + 3 + x;
})();

/**
```
const ArrayIntEq#0d2e6b26 = ArrayEq#0656ab3a<int#builtin>(eq: IntEq#6d46a318)
ArrayEq#🚖🚴‍♀️👾<int>(IntEq#🌃🚴🍶😃)
```
*/
export const hash_0d2e6b26: t_3b6b23ae<Array<number>> = hash_0656ab3a(hash_6d46a318);

/*
<int#builtin>[1, 2] ==#0d2e6b26#3b6b23ae#0 <int#builtin>[1, 2]
assertCall(ArrayIntEq#🚃🪐👩.#Eq#☂️🍰🔥#0, [1, 2], [1, 2])
*/
assertCall(hash_0d2e6b26.h3b6b23ae_0, [1, 2], [1, 2]);

/*
{
    const a#:0 = <int#builtin>[1, 2, 3];
    switch a#:0 {
        [a#:1, ...b#:2] => switch b#:2 {
            [b#:3, ...c#:4] => switch c#:4 {
                [c#:5] => a#:1 ==#6d46a318#3b6b23ae#0 1 &&#builtin b#:3 ==#6d46a318#3b6b23ae#0 2 
                    &&#builtin c#:5 ==#6d46a318#3b6b23ae#0 3,
                _ => false,
            },
            _ => false,
        },
        _ => false,
    };
}
assert(
    ((): bool => {
        const a#:0: Array<int> = [1, 2, 3];
        if len(a#:0) >= 1 {
            if len(a#:0) - 1 >= 1 {
                if len(a#:0) - 1 + 1 == 1 {
                    return IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0(a#:0[0], 1) && IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0(
                        a#:0[0 + 1],
                        2,
                    ) && IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0(a#:0[0 + 1 + 1], 3);
                };
                return false;
            };
            return false;
        };
        return false;
    })(),
)
*/
assert((() => {
  let a: Array<number> = [1, 2, 3];

  if (a.length >= 1) {
    if (a.length - 1 >= 1) {
      if (a.length - (1 + 1) == 1) {
        return hash_6d46a318.h3b6b23ae_0(a[0], 1) && hash_6d46a318.h3b6b23ae_0(a[0 + 1], 2) && hash_6d46a318.h3b6b23ae_0(a[0 + (1 + 1)], 3);
      }

      return false;
    }

    return false;
  }

  return false;
})());

/*
m#13597ff1
m#🪁🌼💂‍♂️
*/
hash_13597ff1;