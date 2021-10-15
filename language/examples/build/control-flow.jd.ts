import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

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
const x2#35e96910 = (): int#builtin ={}> {
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
(): int => {
    const y#:1: int;
    if 2 + 2 < 3 {
        y#:1 = 4;
    } else {
        y#:1 = 2;
    };
    return y#:1 + 2 + y#:1;
}
```
*/
export const hash_35e96910: () => number = () => {
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
const z#741ca132 = (n#:0: int#builtin): int#builtin ={}> {
    const m#:2 = {
        const z#:1 = n#:0 +#builtin 2;
        switch z#:1 {3 => 3, 4 => 4, 5 => 10, _ => 11};
    };
    m#:2 +#builtin m#:2 *#builtin 2;
}
(n#:0: int): int => {
    const m#:2: int;
    const continueBlock#:4: bool = true;
    const z#:1: int = n#:0 + 2;
    if z#:1 == 3 {
        m#:2 = 3;
        continueBlock#:4 = false;
    };
    if continueBlock#:4 {
        if z#:1 == 4 {
            m#:2 = 4;
            continueBlock#:4 = false;
        };
        if continueBlock#:4 {
            if z#:1 == 5 {
                m#:2 = 10;
                continueBlock#:4 = false;
            };
            if continueBlock#:4 {
                m#:2 = 11;
                continueBlock#:4 = false;
            };
        };
    };
    return m#:2 + m#:2 * 2;
}
```
*/
export const hash_741ca132: (arg_0: number) => number = (n: number) => {
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
const x#05d2d0f6 = {
    const y#:0 = if 10 <#builtin 3 {
        4;
    } else {
        2;
    };
    y#:0 +#builtin 2 +#builtin y#:0;
}
((): int => {
    const y#:0: int;
    if 10 < 3 {
        y#:0 = 4;
    } else {
        y#:0 = 2;
    };
    return y#:0 + 2 + y#:0;
})()
```
*/
export const hash_05d2d0f6: number = (() => {
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
const IntEq#ec95f154 = Eq#51ea2a36<int#builtin>{"=="#51ea2a36#0: intEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: intEq}
```
*/
export const hash_ec95f154: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: intEq
} as t_51ea2a36<number>);

/*
x#05d2d0f6 ==#ec95f154#51ea2a36#0 6
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, x#🙇‍♂️✍️💀, 6)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_05d2d0f6, 6);

/*
z#741ca132(n: 2) ==#ec95f154#51ea2a36#0 12
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, z#🕵️‍♂️🚅🏎️😃(2), 12)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_741ca132(2), 12);

/*
x2#35e96910() ==#ec95f154#51ea2a36#0 6
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, x2#🧑‍🔧🏵️🛫(), 6)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_35e96910(), 6);