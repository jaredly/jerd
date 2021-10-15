import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.6868119967742512) type None#280d2df4 = {}
```
*/
type t_280d2df4 = {
  type: "280d2df4";
};

/**
```
@unique(0.6911171338613936) type Some#df443d10<T#:0> = {
    value: T#:0,
}
```
*/
type t_df443d10<T_0> = {
  type: "df443d10";
  hdf443d10_0: T_0;
};

/**
```
@unique(0.22735088588829966) type Twice#4c44569a<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_4c44569a<T_0> = {
  type: "4c44569a";
  h4c44569a_0: T_0;
  h4c44569a_1: T_0;
};

/*enum Option#012fd7d0<T#:0> {
    Some#df443d10<T#:0>,
    None#280d2df4,
}*/
type t_012fd7d0<T_0> = t_df443d10<T_0> | t_280d2df4;

/*enum OptionOrTwice#fb0d03e0<T#:0> {
    ...Option#012fd7d0<T#:0>,
    Twice#4c44569a<T#:0>,
}*/
type t_fb0d03e0<T_0> = t_4c44569a<T_0> | t_df443d10<T_0> | t_280d2df4;

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
const y#36988134 = Option#012fd7d0<int#builtin>:None#280d2df4
Option#🏅🎮☺️<int>:None#🐩🛣️🥔{TODO SPREADs}{}
```
*/
export const hash_36988134: t_012fd7d0<number> = ({
  type: "280d2df4"
} as t_012fd7d0<number>);

/**
```
const check#0a3a535c = (y1#:0: OptionOrTwice#fb0d03e0<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#4c44569a{two: 5} => false,
    Twice#4c44569a => false,
    Option#012fd7d0 as x#:1 => switch x#:1 {Some#df443d10 => false, None#280d2df4 => true},
}
(y1#:0: OptionOrTwice#🏒<int>): bool => {
    if isRecord!(y1#:0, Twice#🍕👩‍🏭👅😃) && y1#:0.#Twice#🍕👩‍🏭👅😃#1 == 5 {
        return false;
    };
    if isRecord!(y1#:0, Twice#🍕👩‍🏭👅😃) {
        return false;
    };
    if isRecord!(y1#:0, Some#🧑‍🔧) || isRecord!(y1#:0, None#🐩🛣️🥔) {
        const x#:1: OptionOrTwice#🏒<int> = Option#🏅🎮☺️ <- y1#:0;
        if isRecord!(x#:1, Some#🧑‍🔧) {
            return false;
        };
        if isRecord!(x#:1, None#🐩🛣️🥔) {
            return true;
        };
        match_fail!();
    };
    match_fail!();
}
```
*/
export const hash_0a3a535c: (arg_0: t_fb0d03e0<number>) => boolean = (y1: t_fb0d03e0<number>) => {
  if (y1.type === "4c44569a" && y1.h4c44569a_1 === 5) {
    return false;
  }

  if (y1.type === "4c44569a") {
    return false;
  }

  if (y1.type === "df443d10" || y1.type === "280d2df4") {
    let x: t_fb0d03e0<number> = y1;

    if (x.type === "df443d10") {
      return false;
    }

    if (x.type === "280d2df4") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#8d498684 = (y#:0: Option#012fd7d0<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#df443d10 as x#:1 => x#:1.value#df443d10#0 ==#ec95f154#51ea2a36#0 2,
    None#280d2df4 => true,
}
(y#:0: Option#🏅🎮☺️<int>): bool => {
    if isRecord!(y#:0, Some#🧑‍🔧) {
        return IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(Some#🧑‍🔧 <- y#:0.#Some#🧑‍🔧#0, 2);
    };
    if isRecord!(y#:0, None#🐩🛣️🥔) {
        return true;
    };
    match_fail!();
}
```
*/
export const hash_8d498684: (arg_0: t_012fd7d0<number>) => boolean = (y: t_012fd7d0<number>) => {
  if (y.type === "df443d10") {
    return hash_ec95f154.h51ea2a36_0(y.hdf443d10_0, 2);
  }

  if (y.type === "280d2df4") {
    return true;
  }

  throw "Math failed";
};

/**
```
const isNotFalse#0932d938 = (n#:0: bool#builtin): bool#builtin ={}> switch n#:0 {
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
export const hash_0932d938: (arg_0: boolean) => boolean = (n: boolean) => {
  if (n === false) {
    return false;
  }

  return true;
};

/**
```
const isSomeYes#647eeb02 = (v#:0: Option#012fd7d0<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#df443d10{value: "no"} => false,
    None#280d2df4 => false,
    Some#df443d10{value: v#:1} => v#:1 ==#da00b310#51ea2a36#0 "yes",
}
(v#:0: Option#🏅🎮☺️<string>): bool => {
    if isRecord!(v#:0, Some#🧑‍🔧) && v#:0.#Some#🧑‍🔧#0 == "no" {
        return false;
    };
    if isRecord!(v#:0, None#🐩🛣️🥔) {
        return false;
    };
    if isRecord!(v#:0, Some#🧑‍🔧) {
        return StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0(v#:0.#Some#🧑‍🔧#0, "yes");
    };
    match_fail!();
}
```
*/
export const hash_647eeb02: (arg_0: t_012fd7d0<string>) => boolean = (v: t_012fd7d0<string>) => {
  if (v.type === "df443d10" && v.hdf443d10_0 === "no") {
    return false;
  }

  if (v.type === "280d2df4") {
    return false;
  }

  if (v.type === "df443d10") {
    return hash_da00b310.h51ea2a36_0(v.hdf443d10_0, "yes");
  }

  throw "Math failed";
};

/**
```
const isTen#5bea934a = (n#:0: int#builtin): bool#builtin ={}> switch n#:0 {
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
export const hash_5bea934a: (arg_0: number) => boolean = (n: number) => {
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
const getWithDefault#17b49b53 = <T#:0>(x#:0: Option#012fd7d0<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#df443d10{value: v#:2} => v#:2, None#280d2df4 => default#:1};
}
<T>(x#:0: Option#🏅🎮☺️<[var]T#:0>, default#:1: [var]T#:0): [var]T#:0 => {
    if isRecord!(x#:0, Some#🧑‍🔧) {
        return x#:0.#Some#🧑‍🔧#0;
    };
    if isRecord!(x#:0, None#🐩🛣️🥔) {
        return default#:1;
    };
    match_fail!();
}
```
*/
export const hash_17b49b53: <T_0>(arg_0: t_012fd7d0<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_012fd7d0<T_0>, default$1: T_0) => {
  if (x$0.type === "df443d10") {
    return x$0.hdf443d10_0;
  }

  if (x$0.type === "280d2df4") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#4d0d9570 = <T#:0>(x#:0: Option#012fd7d0<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#df443d10 => true, None#280d2df4 => false};
}
<T>(x#:0: Option#🏅🎮☺️<[var]T#:0>): bool => {
    if isRecord!(x#:0, Some#🧑‍🔧) {
        return true;
    };
    if isRecord!(x#:0, None#🐩🛣️🥔) {
        return false;
    };
    match_fail!();
}
```
*/
export const hash_4d0d9570: <T_0>(arg_0: t_012fd7d0<T_0>) => boolean = <T_0>(x$0: t_012fd7d0<T_0>) => {
  if (x$0.type === "df443d10") {
    return true;
  }

  if (x$0.type === "280d2df4") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#65177da4 = OptionOrTwice#fb0d03e0<int#builtin>:y#36988134
OptionOrTwice#🏒<int>:y#💂🐻‍❄️🛎️
```
*/
export const hash_65177da4: t_fb0d03e0<number> = hash_36988134;

/**
```
const y1t#155edfe8 = (y1#:0: OptionOrTwice#fb0d03e0<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#4c44569a{one: one#:1, two: two#:2} => one#:1 +#builtin two#:2,
    None#280d2df4 => 2,
    _ => 0,
}
(y1#:0: OptionOrTwice#🏒<int>): int => {
    if isRecord!(y1#:0, Twice#🍕👩‍🏭👅😃) {
        return y1#:0.#Twice#🍕👩‍🏭👅😃#0 + y1#:0.#Twice#🍕👩‍🏭👅😃#1;
    };
    if isRecord!(y1#:0, None#🐩🛣️🥔) {
        return 2;
    };
    return 0;
}
```
*/
export const hash_155edfe8: (arg_0: t_fb0d03e0<number>) => number = (y1: t_fb0d03e0<number>) => {
  if (y1.type === "4c44569a") {
    return y1.h4c44569a_0 + y1.h4c44569a_1;
  }

  if (y1.type === "280d2df4") {
    return 2;
  }

  return 0;
};

/**
```
const y2#a570b050 = OptionOrTwice#fb0d03e0<int#builtin>:Twice#4c44569a<int#builtin>{
    one#4c44569a#0: 3,
    two#4c44569a#1: 10,
}
OptionOrTwice#🏒<int>:Twice#🍕👩‍🏭👅😃{TODO SPREADs}{h4c44569a_0: 3, h4c44569a_1: 10}
```
*/
export const hash_a570b050: t_fb0d03e0<number> = ({
  type: "4c44569a",
  h4c44569a_0: 3,
  h4c44569a_1: 10
} as t_fb0d03e0<number>);

/*
switch y2#a570b050 {Twice#4c44569a{one: one#:0, two: two#:1} => one#:0 +#builtin two#:1, _ => 0} 
    ==#ec95f154#51ea2a36#0 13
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    ((): int => {
        if isRecord!(y2#😖, Twice#🍕👩‍🏭👅😃) {
            return y2#😖.#Twice#🍕👩‍🏭👅😃#0 + y2#😖.#Twice#🍕👩‍🏭👅😃#1;
        };
        return 0;
    })(),
    13,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, (() => {
  if (hash_a570b050.type === "4c44569a") {
    return hash_a570b050.h4c44569a_0 + hash_a570b050.h4c44569a_1;
  }

  return 0;
})(), 13);

/*
y1t#155edfe8(y1#65177da4) ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, y1t#⛸️💧🦹‍♀️(y1#⛹️‍♀️👨‍👦‍👦🦗😃), 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_155edfe8(hash_65177da4), 2);

/*
isPresent#4d0d9570<int#builtin>(
        x: Option#012fd7d0<int#builtin>:Some#df443d10<int#builtin>{value#df443d10#0: 3},
    ) 
    ==#builtin true
assertEqual(
    isPresent#💇‍♀️🚡👨‍🦳😃<int>(Option#🏅🎮☺️<int>:Some#🧑‍🔧{TODO SPREADs}{hdf443d10_0: 3}),
    true,
)
*/
assertEqual(hash_4d0d9570(({
  type: "df443d10",
  hdf443d10_0: 3
} as t_012fd7d0<number>)), true);

/*
isPresent#4d0d9570<int#builtin>(x: Option#012fd7d0<int#builtin>:None#280d2df4) ==#builtin false
assertEqual(isPresent#💇‍♀️🚡👨‍🦳😃<int>(Option#🏅🎮☺️<int>:None#🐩🛣️🥔{TODO SPREADs}{}), false)
*/
assertEqual(hash_4d0d9570(({
  type: "280d2df4"
} as t_012fd7d0<number>)), false);

/*
getWithDefault#17b49b53<int#builtin>(x: Option#012fd7d0<int#builtin>:None#280d2df4, default: 20) 
    ==#ec95f154#51ea2a36#0 20
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    getWithDefault#🚧👨‍✈️👨‍🦯<int>(Option#🏅🎮☺️<int>:None#🐩🛣️🥔{TODO SPREADs}{}, 20),
    20,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_17b49b53(({
  type: "280d2df4"
} as t_012fd7d0<number>), 20), 20);

/*
getWithDefault#17b49b53<int#builtin>(
        x: Option#012fd7d0<int#builtin>:Some#df443d10<int#builtin>{value#df443d10#0: 3},
        default: 20,
    ) 
    ==#ec95f154#51ea2a36#0 3
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    getWithDefault#🚧👨‍✈️👨‍🦯<int>(
        Option#🏅🎮☺️<int>:Some#🧑‍🔧{TODO SPREADs}{hdf443d10_0: 3},
        20,
    ),
    3,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_17b49b53(({
  type: "df443d10",
  hdf443d10_0: 3
} as t_012fd7d0<number>), 20), 3);

/*
switch None#280d2df4 {None#280d2df4 => true}
assert(
    ((): bool => {
        if isRecord!(None#🐩🛣️🥔{TODO SPREADs}{}, None#🐩🛣️🥔) {
            return true;
        };
        match_fail!();
    })(),
)
*/
assert((() => {
  if (({
    type: "280d2df4"
  } as t_280d2df4).type === "280d2df4") {
    return true;
  }

  throw "Math failed";
})());

/*
isTen#5bea934a(n: 10) ==#builtin true
assertEqual(isTen#🚏🥘🧘‍♂️😃(10), true)
*/
assertEqual(hash_5bea934a(10), true);

/*
isSomeYes#647eeb02(
        v: Option#012fd7d0<string#builtin>:Some#df443d10<string#builtin>{value#df443d10#0: "yes"},
    ) 
    ==#builtin true
assertEqual(
    isSomeYes#🏥🎄🐡😃(Option#🏅🎮☺️<string>:Some#🧑‍🔧{TODO SPREADs}{hdf443d10_0: "yes"}),
    true,
)
*/
assertEqual(hash_647eeb02(({
  type: "df443d10",
  hdf443d10_0: "yes"
} as t_012fd7d0<string>)), true);

/*
isNotFalse#0932d938(n: true) ==#builtin true
assertEqual(isNotFalse#👷‍♂️🤳🗯️(true), true)
*/
assertEqual(hash_0932d938(true), true);

/*
isAs#8d498684(y#36988134)
assertCall(isAs#🥒, y#💂🐻‍❄️🛎️)
*/
assertCall(hash_8d498684, hash_36988134);

/*
check#0a3a535c(y1#65177da4)
assertCall(check#✈️🍖👉, y1#⛹️‍♀️👨‍👦‍👦🦗😃)
*/
assertCall(hash_0a3a535c, hash_65177da4);