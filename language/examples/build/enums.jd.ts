import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type None#39b96e26 = {}
```
*/
type t_39b96e26 = {
  type: "39b96e26";
};

/**
```
type Some#cd95aa0c<T#:0> = {
    value: T#:0,
}
```
*/
type t_cd95aa0c<T_0> = {
  type: "cd95aa0c";
  hcd95aa0c_0: T_0;
};

/**
```
type Twice#31bad56e<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_31bad56e<T_0> = {
  type: "31bad56e";
  h31bad56e_0: T_0;
  h31bad56e_1: T_0;
};

/*enum Option#0db74110<T#:0> {
    Some#cd95aa0c<T#:0>,
    None#39b96e26,
}*/
type t_0db74110<T_0> = t_cd95aa0c<T_0> | t_39b96e26;

/*enum OptionOrTwice#596d86d0<T#:0> {
    ...Option#0db74110<T#:0>,
    Twice#31bad56e<T#:0>,
}*/
type t_596d86d0<T_0> = t_31bad56e<T_0> | t_cd95aa0c<T_0> | t_39b96e26;

/**
```
type Eq#51ea2a36<T#:0> = {
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
const StringEq#da00b310 = Eq#51ea2a36<string#builtin>{"=="#51ea2a36#0: stringEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: stringEq}
```
*/
export const hash_da00b310: t_51ea2a36<string> = ({
  type: "51ea2a36",
  h51ea2a36_0: stringEq
} as t_51ea2a36<string>);

/**
```
const y#cee9d368 = Option#0db74110<int#builtin>:None#39b96e26
Option#🧑‍🔧👨‍👩‍👧👱‍♀️<int>:None#🦘🌹⭐{TODO SPREADs}{}
```
*/
export const hash_cee9d368: t_0db74110<number> = ({
  type: "39b96e26"
} as t_0db74110<number>);

/**
```
const check#229f29c8 = (y1#:0: OptionOrTwice#596d86d0<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#31bad56e{two: 5} => false,
    Twice#31bad56e => false,
    Option#0db74110 as x#:1 => switch x#:1 {Some#cd95aa0c => false, None#39b96e26 => true},
}
(y1#:0: OptionOrTwice#🍼💺🏌️😃<int>): bool => {
    if isRecord!(y1#:0, Twice#💇🍣🌅) && y1#:0.#Twice#💇🍣🌅#1 == 5 {
        return false;
    };
    if isRecord!(y1#:0, Twice#💇🍣🌅) {
        return false;
    };
    if isRecord!(y1#:0, Some#🐏) || isRecord!(y1#:0, None#🦘🌹⭐) {
        const x#:1: OptionOrTwice#🍼💺🏌️😃<int> = Option#🧑‍🔧👨‍👩‍👧👱‍♀️ <- y1#:0;
        if isRecord!(x#:1, Some#🐏) {
            return false;
        };
        if isRecord!(x#:1, None#🦘🌹⭐) {
            return true;
        };
        match_fail!();
    };
    match_fail!();
}
```
*/
export const hash_229f29c8: (arg_0: t_596d86d0<number>) => boolean = (y1: t_596d86d0<number>) => {
  if (y1.type === "31bad56e" && y1.h31bad56e_1 === 5) {
    return false;
  }

  if (y1.type === "31bad56e") {
    return false;
  }

  if (y1.type === "cd95aa0c" || y1.type === "39b96e26") {
    let x: t_596d86d0<number> = y1;

    if (x.type === "cd95aa0c") {
      return false;
    }

    if (x.type === "39b96e26") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#4b5c985c = (y#:0: Option#0db74110<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#cd95aa0c as x#:1 => x#:1.value#cd95aa0c#0 ==#ec95f154#51ea2a36#0 2,
    None#39b96e26 => true,
}
(y#:0: Option#🧑‍🔧👨‍👩‍👧👱‍♀️<int>): bool => {
    if isRecord!(y#:0, Some#🐏) {
        return IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(Some#🐏 <- y#:0.#Some#🐏#0, 2);
    };
    if isRecord!(y#:0, None#🦘🌹⭐) {
        return true;
    };
    match_fail!();
}
```
*/
export const hash_4b5c985c: (arg_0: t_0db74110<number>) => boolean = (y: t_0db74110<number>) => {
  if (y.type === "cd95aa0c") {
    return hash_ec95f154.h51ea2a36_0(y.hcd95aa0c_0, 2);
  }

  if (y.type === "39b96e26") {
    return true;
  }

  throw "Math failed";
};

/**
```
const isNotFalse#28f05e73 = (n#:0: bool#builtin): bool#builtin ={}> switch n#:0 {
    false => false,
    _ => true,
}
(n#:0: bool): bool => {
    if n#:0 == false {
        return false;
    };
    return true;
}
```
*/
export const hash_28f05e73: (arg_0: boolean) => boolean = (n: boolean) => {
  if (n === false) {
    return false;
  }

  return true;
};

/**
```
const isSomeYes#0d54d792 = (v#:0: Option#0db74110<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#cd95aa0c{value: "no"} => false,
    None#39b96e26 => false,
    Some#cd95aa0c{value: v#:1} => v#:1 ==#da00b310#51ea2a36#0 "yes",
}
(v#:0: Option#🧑‍🔧👨‍👩‍👧👱‍♀️<string>): bool => {
    if isRecord!(v#:0, Some#🐏) && v#:0.#Some#🐏#0 == "no" {
        return false;
    };
    if isRecord!(v#:0, None#🦘🌹⭐) {
        return false;
    };
    if isRecord!(v#:0, Some#🐏) {
        return StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0(v#:0.#Some#🐏#0, "yes");
    };
    match_fail!();
}
```
*/
export const hash_0d54d792: (arg_0: t_0db74110<string>) => boolean = (v: t_0db74110<string>) => {
  if (v.type === "cd95aa0c" && v.hcd95aa0c_0 === "no") {
    return false;
  }

  if (v.type === "39b96e26") {
    return false;
  }

  if (v.type === "cd95aa0c") {
    return hash_da00b310.h51ea2a36_0(v.hcd95aa0c_0, "yes");
  }

  throw "Math failed";
};

/**
```
const isTen#1dfd6720 = (n#:0: int#builtin): bool#builtin ={}> switch n#:0 {
    4 => false,
    10 => true,
    _ => false,
}
(n#:0: int): bool => {
    if n#:0 == 4 {
        return false;
    };
    if n#:0 == 10 {
        return true;
    };
    return false;
}
```
*/
export const hash_1dfd6720: (arg_0: number) => boolean = (n: number) => {
  if (n === 4) {
    return false;
  }

  if (n === 10) {
    return true;
  }

  return false;
};

/**
```
const getWithDefault#543eb0b2 = <T#:0>(x#:0: Option#0db74110<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#cd95aa0c{value: v#:2} => v#:2, None#39b96e26 => default#:1};
}
<T>(x#:0: Option#🧑‍🔧👨‍👩‍👧👱‍♀️<[var]T#:0>, default#:1: [var]T#:0): [var]T#:0 => {
    if isRecord!(x#:0, Some#🐏) {
        return x#:0.#Some#🐏#0;
    };
    if isRecord!(x#:0, None#🦘🌹⭐) {
        return default#:1;
    };
    match_fail!();
}
```
*/
export const hash_543eb0b2: <T_0>(arg_0: t_0db74110<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_0db74110<T_0>, default$1: T_0) => {
  if (x$0.type === "cd95aa0c") {
    return x$0.hcd95aa0c_0;
  }

  if (x$0.type === "39b96e26") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#4d7e0998 = <T#:0>(x#:0: Option#0db74110<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#cd95aa0c => true, None#39b96e26 => false};
}
<T>(x#:0: Option#🧑‍🔧👨‍👩‍👧👱‍♀️<[var]T#:0>): bool => {
    if isRecord!(x#:0, Some#🐏) {
        return true;
    };
    if isRecord!(x#:0, None#🦘🌹⭐) {
        return false;
    };
    match_fail!();
}
```
*/
export const hash_4d7e0998: <T_0>(arg_0: t_0db74110<T_0>) => boolean = <T_0>(x$0: t_0db74110<T_0>) => {
  if (x$0.type === "cd95aa0c") {
    return true;
  }

  if (x$0.type === "39b96e26") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#14333f90 = OptionOrTwice#596d86d0<int#builtin>:y#cee9d368
OptionOrTwice#🍼💺🏌️😃<int>:y#🛸
```
*/
export const hash_14333f90: t_596d86d0<number> = hash_cee9d368;

/**
```
const y1t#e7f5708a = (y1#:0: OptionOrTwice#596d86d0<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#31bad56e{one: one#:1, two: two#:2} => one#:1 +#builtin two#:2,
    None#39b96e26 => 2,
    _ => 0,
}
(y1#:0: OptionOrTwice#🍼💺🏌️😃<int>): int => {
    if isRecord!(y1#:0, Twice#💇🍣🌅) {
        return y1#:0.#Twice#💇🍣🌅#0 + y1#:0.#Twice#💇🍣🌅#1;
    };
    if isRecord!(y1#:0, None#🦘🌹⭐) {
        return 2;
    };
    return 0;
}
```
*/
export const hash_e7f5708a: (arg_0: t_596d86d0<number>) => number = (y1: t_596d86d0<number>) => {
  if (y1.type === "31bad56e") {
    return y1.h31bad56e_0 + y1.h31bad56e_1;
  }

  if (y1.type === "39b96e26") {
    return 2;
  }

  return 0;
};

/**
```
const y2#10c7428a = OptionOrTwice#596d86d0<int#builtin>:Twice#31bad56e<int#builtin>{
    one#31bad56e#0: 3,
    two#31bad56e#1: 10,
}
OptionOrTwice#🍼💺🏌️😃<int>:Twice#💇🍣🌅{TODO SPREADs}{h31bad56e_0: 3, h31bad56e_1: 10}
```
*/
export const hash_10c7428a: t_596d86d0<number> = ({
  type: "31bad56e",
  h31bad56e_0: 3,
  h31bad56e_1: 10
} as t_596d86d0<number>);

/*
switch y2#10c7428a {Twice#31bad56e{one: one#:0, two: two#:1} => one#:0 +#builtin two#:1, _ => 0} 
    ==#ec95f154#51ea2a36#0 13
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    ((): int => {
        if isRecord!(y2#🥜👨‍👩‍👧👩‍🌾, Twice#💇🍣🌅) {
            return y2#🥜👨‍👩‍👧👩‍🌾.#Twice#💇🍣🌅#0 + y2#🥜👨‍👩‍👧👩‍🌾.#Twice#💇🍣🌅#1;
        };
        return 0;
    })(),
    13,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, (() => {
  if (hash_10c7428a.type === "31bad56e") {
    return hash_10c7428a.h31bad56e_0 + hash_10c7428a.h31bad56e_1;
  }

  return 0;
})(), 13);

/*
y1t#e7f5708a(y1#14333f90) ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, y1t#💥(y1#🌗👨‍🦱🤵‍♀️), 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_e7f5708a(hash_14333f90), 2);

/*
isPresent#4d7e0998<int#builtin>(
        x: Option#0db74110<int#builtin>:Some#cd95aa0c<int#builtin>{value#cd95aa0c#0: 3},
    ) 
    ==#builtin true
assertEqual(
    isPresent#🏌️‍♀️🕗👩‍🦳😃<int>(
        Option#🧑‍🔧👨‍👩‍👧👱‍♀️<int>:Some#🐏{TODO SPREADs}{hcd95aa0c_0: 3},
    ),
    true,
)
*/
assertEqual(hash_4d7e0998(({
  type: "cd95aa0c",
  hcd95aa0c_0: 3
} as t_0db74110<number>)), true);

/*
isPresent#4d7e0998<int#builtin>(x: Option#0db74110<int#builtin>:None#39b96e26) ==#builtin false
assertEqual(
    isPresent#🏌️‍♀️🕗👩‍🦳😃<int>(Option#🧑‍🔧👨‍👩‍👧👱‍♀️<int>:None#🦘🌹⭐{TODO SPREADs}{}),
    false,
)
*/
assertEqual(hash_4d7e0998(({
  type: "39b96e26"
} as t_0db74110<number>)), false);

/*
getWithDefault#543eb0b2<int#builtin>(x: Option#0db74110<int#builtin>:None#39b96e26, default: 20) 
    ==#ec95f154#51ea2a36#0 20
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    getWithDefault#🤝🌈🤵‍♀️😃<int>(Option#🧑‍🔧👨‍👩‍👧👱‍♀️<int>:None#🦘🌹⭐{TODO SPREADs}{}, 20),
    20,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_543eb0b2(({
  type: "39b96e26"
} as t_0db74110<number>), 20), 20);

/*
getWithDefault#543eb0b2<int#builtin>(
        x: Option#0db74110<int#builtin>:Some#cd95aa0c<int#builtin>{value#cd95aa0c#0: 3},
        default: 20,
    ) 
    ==#ec95f154#51ea2a36#0 3
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    getWithDefault#🤝🌈🤵‍♀️😃<int>(
        Option#🧑‍🔧👨‍👩‍👧👱‍♀️<int>:Some#🐏{TODO SPREADs}{hcd95aa0c_0: 3},
        20,
    ),
    3,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_543eb0b2(({
  type: "cd95aa0c",
  hcd95aa0c_0: 3
} as t_0db74110<number>), 20), 3);

/*
switch None#39b96e26 {None#39b96e26 => true}
assert(
    ((): bool => {
        if isRecord!(None#🦘🌹⭐{TODO SPREADs}{}, None#🦘🌹⭐) {
            return true;
        };
        match_fail!();
    })(),
)
*/
assert((() => {
  if (({
    type: "39b96e26"
  } as t_39b96e26).type === "39b96e26") {
    return true;
  }

  throw "Math failed";
})());

/*
isTen#1dfd6720(n: 10) ==#builtin true
assertEqual(isTen#🎠⛴️👨‍👦‍👦(10), true)
*/
assertEqual(hash_1dfd6720(10), true);

/*
isSomeYes#0d54d792(
        v: Option#0db74110<string#builtin>:Some#cd95aa0c<string#builtin>{value#cd95aa0c#0: "yes"},
    ) 
    ==#builtin true
assertEqual(
    isSomeYes#🌙💂‍♂️👩‍🦱(
        Option#🧑‍🔧👨‍👩‍👧👱‍♀️<string>:Some#🐏{TODO SPREADs}{hcd95aa0c_0: "yes"},
    ),
    true,
)
*/
assertEqual(hash_0d54d792(({
  type: "cd95aa0c",
  hcd95aa0c_0: "yes"
} as t_0db74110<string>)), true);

/*
isNotFalse#28f05e73(n: true) ==#builtin true
assertEqual(isNotFalse#🍍😛🥨(true), true)
*/
assertEqual(hash_28f05e73(true), true);

/*
isAs#4b5c985c(y#cee9d368)
assertCall(isAs#👿🚃💅😃, y#🛸)
*/
assertCall(hash_4b5c985c, hash_cee9d368);

/*
check#229f29c8(y1#14333f90)
assertCall(check#👨‍❤️‍💋‍👨🎁🦃, y1#🌗👨‍🦱🤵‍♀️)
*/
assertCall(hash_229f29c8, hash_14333f90);