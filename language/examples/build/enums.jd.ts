import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.6911171338613936) type None#1429a010 = {}
```
*/
type t_1429a010 = {
  type: "1429a010";
};

/**
```
@unique(0.5903901106623508) type Some#7b9f4d72<T#:0> = {
    value: T#:0,
}
```
*/
type t_7b9f4d72<T_0> = {
  type: "7b9f4d72";
  h7b9f4d72_0: T_0;
};

/**
```
@unique(0.6868119967742512) type Twice#7d21597b<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_7d21597b<T_0> = {
  type: "7d21597b";
  h7d21597b_0: T_0;
  h7d21597b_1: T_0;
};

/*enum Option#55644470<T#:0> {
    Some#7b9f4d72<T#:0>,
    None#1429a010,
}*/
type t_55644470<T_0> = t_7b9f4d72<T_0> | t_1429a010;

/*enum OptionOrTwice#2aecd2e4<T#:0> {
    ...Option#55644470<T#:0>,
    Twice#7d21597b<T#:0>,
}*/
type t_2aecd2e4<T_0> = t_7d21597b<T_0> | t_7b9f4d72<T_0> | t_1429a010;

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
const y#beb5a2d4 = Option#55644470<int#builtin>:None#1429a010
Option#🙈👨‍🔧🧙😃<int>:None#😘☘️🤵‍♂️{TODO SPREADs}{}
```
*/
export const hash_beb5a2d4: t_55644470<number> = ({
  type: "1429a010"
} as t_55644470<number>);

/**
```
const check#08510fc2 = (y1#:0: OptionOrTwice#2aecd2e4<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#7d21597b{two: 5} => false,
    Twice#7d21597b => false,
    Option#55644470 as x#:1 => switch x#:1 {Some#7b9f4d72 => false, None#1429a010 => true},
}
(y1#:0: OptionOrTwice#🥄🚐🍙<int>): bool => {
    if isRecord!(y1#:0, Twice#👨‍🦯🥱🥈😃) && y1#:0.#Twice#👨‍🦯🥱🥈😃#1 == 5 {
        return false;
    };
    if isRecord!(y1#:0, Twice#👨‍🦯🥱🥈😃) {
        return false;
    };
    if isRecord!(y1#:0, Some#🚶‍♂️🥉🎃😃) || isRecord!(y1#:0, None#😘☘️🤵‍♂️) {
        const x#:1: OptionOrTwice#🥄🚐🍙<int> = Option#🙈👨‍🔧🧙😃 <- y1#:0;
        if isRecord!(x#:1, Some#🚶‍♂️🥉🎃😃) {
            return false;
        };
        if isRecord!(x#:1, None#😘☘️🤵‍♂️) {
            return true;
        };
        match_fail!();
    };
    match_fail!();
}
```
*/
export const hash_08510fc2: (arg_0: t_2aecd2e4<number>) => boolean = (y1: t_2aecd2e4<number>) => {
  if (y1.type === "7d21597b" && y1.h7d21597b_1 === 5) {
    return false;
  }

  if (y1.type === "7d21597b") {
    return false;
  }

  if (y1.type === "7b9f4d72" || y1.type === "1429a010") {
    let x: t_2aecd2e4<number> = y1;

    if (x.type === "7b9f4d72") {
      return false;
    }

    if (x.type === "1429a010") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#3520893c = (y#:0: Option#55644470<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#7b9f4d72 as x#:1 => x#:1.value#7b9f4d72#0 ==#ec95f154#51ea2a36#0 2,
    None#1429a010 => true,
}
(y#:0: Option#🙈👨‍🔧🧙😃<int>): bool => {
    if isRecord!(y#:0, Some#🚶‍♂️🥉🎃😃) {
        return IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(Some#🚶‍♂️🥉🎃😃 <- y#:0.#Some#🚶‍♂️🥉🎃😃#0, 2);
    };
    if isRecord!(y#:0, None#😘☘️🤵‍♂️) {
        return true;
    };
    match_fail!();
}
```
*/
export const hash_3520893c: (arg_0: t_55644470<number>) => boolean = (y: t_55644470<number>) => {
  if (y.type === "7b9f4d72") {
    return hash_ec95f154.h51ea2a36_0(y.h7b9f4d72_0, 2);
  }

  if (y.type === "1429a010") {
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
const isSomeYes#19a7eac4 = (v#:0: Option#55644470<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#7b9f4d72{value: "no"} => false,
    None#1429a010 => false,
    Some#7b9f4d72{value: v#:1} => v#:1 ==#da00b310#51ea2a36#0 "yes",
}
(v#:0: Option#🙈👨‍🔧🧙😃<string>): bool => {
    if isRecord!(v#:0, Some#🚶‍♂️🥉🎃😃) && v#:0.#Some#🚶‍♂️🥉🎃😃#0 == "no" {
        return false;
    };
    if isRecord!(v#:0, None#😘☘️🤵‍♂️) {
        return false;
    };
    if isRecord!(v#:0, Some#🚶‍♂️🥉🎃😃) {
        return StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0(v#:0.#Some#🚶‍♂️🥉🎃😃#0, "yes");
    };
    match_fail!();
}
```
*/
export const hash_19a7eac4: (arg_0: t_55644470<string>) => boolean = (v: t_55644470<string>) => {
  if (v.type === "7b9f4d72" && v.h7b9f4d72_0 === "no") {
    return false;
  }

  if (v.type === "1429a010") {
    return false;
  }

  if (v.type === "7b9f4d72") {
    return hash_da00b310.h51ea2a36_0(v.h7b9f4d72_0, "yes");
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
const getWithDefault#a79c2db2 = <T#:0>(x#:0: Option#55644470<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#7b9f4d72{value: v#:2} => v#:2, None#1429a010 => default#:1};
}
<T>(x#:0: Option#🙈👨‍🔧🧙😃<[var]T#:0>, default#:1: [var]T#:0): [var]T#:0 => {
    if isRecord!(x#:0, Some#🚶‍♂️🥉🎃😃) {
        return x#:0.#Some#🚶‍♂️🥉🎃😃#0;
    };
    if isRecord!(x#:0, None#😘☘️🤵‍♂️) {
        return default#:1;
    };
    match_fail!();
}
```
*/
export const hash_a79c2db2: <T_0>(arg_0: t_55644470<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_55644470<T_0>, default$1: T_0) => {
  if (x$0.type === "7b9f4d72") {
    return x$0.h7b9f4d72_0;
  }

  if (x$0.type === "1429a010") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#1cf42fe0 = <T#:0>(x#:0: Option#55644470<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#7b9f4d72 => true, None#1429a010 => false};
}
<T>(x#:0: Option#🙈👨‍🔧🧙😃<[var]T#:0>): bool => {
    if isRecord!(x#:0, Some#🚶‍♂️🥉🎃😃) {
        return true;
    };
    if isRecord!(x#:0, None#😘☘️🤵‍♂️) {
        return false;
    };
    match_fail!();
}
```
*/
export const hash_1cf42fe0: <T_0>(arg_0: t_55644470<T_0>) => boolean = <T_0>(x$0: t_55644470<T_0>) => {
  if (x$0.type === "7b9f4d72") {
    return true;
  }

  if (x$0.type === "1429a010") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#548129b1 = OptionOrTwice#2aecd2e4<int#builtin>:y#beb5a2d4
OptionOrTwice#🥄🚐🍙<int>:y#🍶
```
*/
export const hash_548129b1: t_2aecd2e4<number> = hash_beb5a2d4;

/**
```
const y1t#f827c170 = (y1#:0: OptionOrTwice#2aecd2e4<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#7d21597b{one: one#:1, two: two#:2} => one#:1 +#builtin two#:2,
    None#1429a010 => 2,
    _ => 0,
}
(y1#:0: OptionOrTwice#🥄🚐🍙<int>): int => {
    if isRecord!(y1#:0, Twice#👨‍🦯🥱🥈😃) {
        return y1#:0.#Twice#👨‍🦯🥱🥈😃#0 + y1#:0.#Twice#👨‍🦯🥱🥈😃#1;
    };
    if isRecord!(y1#:0, None#😘☘️🤵‍♂️) {
        return 2;
    };
    return 0;
}
```
*/
export const hash_f827c170: (arg_0: t_2aecd2e4<number>) => number = (y1: t_2aecd2e4<number>) => {
  if (y1.type === "7d21597b") {
    return y1.h7d21597b_0 + y1.h7d21597b_1;
  }

  if (y1.type === "1429a010") {
    return 2;
  }

  return 0;
};

/**
```
const y2#6a478cce = OptionOrTwice#2aecd2e4<int#builtin>:Twice#7d21597b<int#builtin>{
    one#7d21597b#0: 3,
    two#7d21597b#1: 10,
}
OptionOrTwice#🥄🚐🍙<int>:Twice#👨‍🦯🥱🥈😃{TODO SPREADs}{h7d21597b_0: 3, h7d21597b_1: 10}
```
*/
export const hash_6a478cce: t_2aecd2e4<number> = ({
  type: "7d21597b",
  h7d21597b_0: 3,
  h7d21597b_1: 10
} as t_2aecd2e4<number>);

/*
switch y2#6a478cce {Twice#7d21597b{one: one#:0, two: two#:1} => one#:0 +#builtin two#:1, _ => 0} 
    ==#ec95f154#51ea2a36#0 13
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    ((): int => {
        if isRecord!(y2#👨‍🦰👩‍👦🥘😃, Twice#👨‍🦯🥱🥈😃) {
            return y2#👨‍🦰👩‍👦🥘😃.#Twice#👨‍🦯🥱🥈😃#0 + y2#👨‍🦰👩‍👦🥘😃.#Twice#👨‍🦯🥱🥈😃#1;
        };
        return 0;
    })(),
    13,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, (() => {
  if (hash_6a478cce.type === "7d21597b") {
    return hash_6a478cce.h7d21597b_0 + hash_6a478cce.h7d21597b_1;
  }

  return 0;
})(), 13);

/*
y1t#f827c170(y1#548129b1) ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, y1t#💇‍♀️(y1#🤼😨🤱😃), 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_f827c170(hash_548129b1), 2);

/*
isPresent#1cf42fe0<int#builtin>(
        x: Option#55644470<int#builtin>:Some#7b9f4d72<int#builtin>{value#7b9f4d72#0: 3},
    ) 
    ==#builtin true
assertEqual(
    isPresent#🏒👨‍🌾👨‍👩‍👦<int>(
        Option#🙈👨‍🔧🧙😃<int>:Some#🚶‍♂️🥉🎃😃{TODO SPREADs}{h7b9f4d72_0: 3},
    ),
    true,
)
*/
assertEqual(hash_1cf42fe0(({
  type: "7b9f4d72",
  h7b9f4d72_0: 3
} as t_55644470<number>)), true);

/*
isPresent#1cf42fe0<int#builtin>(x: Option#55644470<int#builtin>:None#1429a010) ==#builtin false
assertEqual(
    isPresent#🏒👨‍🌾👨‍👩‍👦<int>(Option#🙈👨‍🔧🧙😃<int>:None#😘☘️🤵‍♂️{TODO SPREADs}{}),
    false,
)
*/
assertEqual(hash_1cf42fe0(({
  type: "1429a010"
} as t_55644470<number>)), false);

/*
getWithDefault#a79c2db2<int#builtin>(x: Option#55644470<int#builtin>:None#1429a010, default: 20) 
    ==#ec95f154#51ea2a36#0 20
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    getWithDefault#🤼‍♂️<int>(Option#🙈👨‍🔧🧙😃<int>:None#😘☘️🤵‍♂️{TODO SPREADs}{}, 20),
    20,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_a79c2db2(({
  type: "1429a010"
} as t_55644470<number>), 20), 20);

/*
getWithDefault#a79c2db2<int#builtin>(
        x: Option#55644470<int#builtin>:Some#7b9f4d72<int#builtin>{value#7b9f4d72#0: 3},
        default: 20,
    ) 
    ==#ec95f154#51ea2a36#0 3
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    getWithDefault#🤼‍♂️<int>(
        Option#🙈👨‍🔧🧙😃<int>:Some#🚶‍♂️🥉🎃😃{TODO SPREADs}{h7b9f4d72_0: 3},
        20,
    ),
    3,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_a79c2db2(({
  type: "7b9f4d72",
  h7b9f4d72_0: 3
} as t_55644470<number>), 20), 3);

/*
switch None#1429a010 {None#1429a010 => true}
assert(
    ((): bool => {
        if isRecord!(None#😘☘️🤵‍♂️{TODO SPREADs}{}, None#😘☘️🤵‍♂️) {
            return true;
        };
        match_fail!();
    })(),
)
*/
assert((() => {
  if (({
    type: "1429a010"
  } as t_1429a010).type === "1429a010") {
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
isSomeYes#19a7eac4(
        v: Option#55644470<string#builtin>:Some#7b9f4d72<string#builtin>{value#7b9f4d72#0: "yes"},
    ) 
    ==#builtin true
assertEqual(
    isSomeYes#🍨🐈‍⬛🏄‍♂️(
        Option#🙈👨‍🔧🧙😃<string>:Some#🚶‍♂️🥉🎃😃{TODO SPREADs}{h7b9f4d72_0: "yes"},
    ),
    true,
)
*/
assertEqual(hash_19a7eac4(({
  type: "7b9f4d72",
  h7b9f4d72_0: "yes"
} as t_55644470<string>)), true);

/*
isNotFalse#28f05e73(n: true) ==#builtin true
assertEqual(isNotFalse#🍍😛🥨(true), true)
*/
assertEqual(hash_28f05e73(true), true);

/*
isAs#3520893c(y#beb5a2d4)
assertCall(isAs#👳😐🛑, y#🍶)
*/
assertCall(hash_3520893c, hash_beb5a2d4);

/*
check#08510fc2(y1#548129b1)
assertCall(check#🎋😮🤎, y1#🤼😨🤱😃)
*/
assertCall(hash_08510fc2, hash_548129b1);