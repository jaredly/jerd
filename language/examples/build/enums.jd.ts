import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.14972816008023876) type None#bf32b378 = {}
```
*/
type t_bf32b378 = {
  type: "bf32b378";
};

/**
```
@unique(0.8408403012585762) type Some#68a49429<T#:0> = {
    value: T#:0,
}
```
*/
type t_68a49429<T> = {
  type: "68a49429";
  h68a49429_0: T;
};

/**
```
@unique(0.5383562320075749) type Twice#f4bca304<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_f4bca304<T> = {
  type: "f4bca304";
  hf4bca304_0: T;
  hf4bca304_1: T;
};

/*enum Option#8c38e2d0<T#:0> {
    Some#68a49429<T#:0>,
    None#bf32b378,
}*/
type t_8c38e2d0<T> = t_68a49429<T> | t_bf32b378;

/*enum OptionOrTwice#3beae218<T#:0> {
    ...Option#8c38e2d0<T#:0>,
    Twice#f4bca304<T#:0>,
}*/
type t_3beae218<T> = t_f4bca304<T> | t_68a49429<T> | t_bf32b378;

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
const StringEq#8a86d00e = Eq#2f333afa<string#builtin>{"=="#2f333afa#0: stringEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: stringEq}
```
*/
export const hash_8a86d00e: t_2f333afa<string> = ({
  type: "2f333afa",
  h2f333afa_0: stringEq
} as t_2f333afa<string>);

/**
```
const y#f1472b54 = Option#8c38e2d0<int#builtin>:None#bf32b378
Option#🍼<int>:None#🕒{TODO SPREADs}{}
```
*/
export const hash_f1472b54: t_8c38e2d0<number> = ({
  type: "bf32b378"
} as t_8c38e2d0<number>);

/**
```
const check#53788bc0 = (y1#:0: OptionOrTwice#3beae218<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#f4bca304{two: 5} => false,
    Twice#f4bca304 => false,
    Option#8c38e2d0 as x#:1 => switch x#:1 {Some#68a49429 => false, None#bf32b378 => true},
}
(y1#:0: OptionOrTwice#🐀🥮✨<int>): bool => {
    if isRecord!(y1#:0, Twice#🏨) && y1#:0.#Twice#🏨#1 == 5 {
        return false;
    };
    if isRecord!(y1#:0, Twice#🏨) {
        return false;
    };
    if isRecord!(y1#:0, Some#🤥🧑‍✈️🥜😃) || isRecord!(y1#:0, None#🕒) {
        const x#:1: OptionOrTwice#🐀🥮✨<int> = Option#🍼 <- y1#:0;
        if isRecord!(x#:1, Some#🤥🧑‍✈️🥜😃) {
            return false;
        };
        if isRecord!(x#:1, None#🕒) {
            return true;
        };
        match_fail!();
    };
    match_fail!();
}
```
*/
export const hash_53788bc0: (arg_0: t_3beae218<number>) => boolean = (y1: t_3beae218<number>) => {
  if (y1.type === "f4bca304" && y1.hf4bca304_1 === 5) {
    return false;
  }

  if (y1.type === "f4bca304") {
    return false;
  }

  if (y1.type === "68a49429" || y1.type === "bf32b378") {
    let x: t_3beae218<number> = y1;

    if (x.type === "68a49429") {
      return false;
    }

    if (x.type === "bf32b378") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#4a4e8a92 = (y#:0: Option#8c38e2d0<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#68a49429 as x#:1 => x#:1.value#68a49429#0 ==#24558044#2f333afa#0 2,
    None#bf32b378 => true,
}
(y#:0: Option#🍼<int>): bool => {
    if isRecord!(y#:0, Some#🤥🧑‍✈️🥜😃) {
        return IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0(Some#🤥🧑‍✈️🥜😃 <- y#:0.#Some#🤥🧑‍✈️🥜😃#0, 2);
    };
    if isRecord!(y#:0, None#🕒) {
        return true;
    };
    match_fail!();
}
```
*/
export const hash_4a4e8a92: (arg_0: t_8c38e2d0<number>) => boolean = (y: t_8c38e2d0<number>) => {
  if (y.type === "68a49429") {
    return hash_24558044.h2f333afa_0(y.h68a49429_0, 2);
  }

  if (y.type === "bf32b378") {
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
const isSomeYes#139f88d3 = (v#:0: Option#8c38e2d0<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#68a49429{value: "no"} => false,
    None#bf32b378 => false,
    Some#68a49429{value: v#:1} => v#:1 ==#8a86d00e#2f333afa#0 "yes",
}
(v#:0: Option#🍼<string>): bool => {
    if isRecord!(v#:0, Some#🤥🧑‍✈️🥜😃) && v#:0.#Some#🤥🧑‍✈️🥜😃#0 == "no" {
        return false;
    };
    if isRecord!(v#:0, None#🕒) {
        return false;
    };
    if isRecord!(v#:0, Some#🤥🧑‍✈️🥜😃) {
        return StringEq#😍.#Eq#🧱👨‍🦰🏖️#0(v#:0.#Some#🤥🧑‍✈️🥜😃#0, "yes");
    };
    match_fail!();
}
```
*/
export const hash_139f88d3: (arg_0: t_8c38e2d0<string>) => boolean = (v: t_8c38e2d0<string>) => {
  if (v.type === "68a49429" && v.h68a49429_0 === "no") {
    return false;
  }

  if (v.type === "bf32b378") {
    return false;
  }

  if (v.type === "68a49429") {
    return hash_8a86d00e.h2f333afa_0(v.h68a49429_0, "yes");
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
const getWithDefault#4e2189db = <T#:0>(x#:0: Option#8c38e2d0<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#68a49429{value: v#:2} => v#:2, None#bf32b378 => default#:1};
}
<T>(x#:0: Option#🍼<[var]T#:0>, default#:1: [var]T#:0): [var]T#:0 => {
    if isRecord!(x#:0, Some#🤥🧑‍✈️🥜😃) {
        return x#:0.#Some#🤥🧑‍✈️🥜😃#0;
    };
    if isRecord!(x#:0, None#🕒) {
        return default#:1;
    };
    match_fail!();
}
```
*/
export const hash_4e2189db: <T>(arg_0: t_8c38e2d0<T>, arg_1: T) => T = <T>(x$0: t_8c38e2d0<T>, default$1: T) => {
  if (x$0.type === "68a49429") {
    return x$0.h68a49429_0;
  }

  if (x$0.type === "bf32b378") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#4b9f8eb0 = <T#:0>(x#:0: Option#8c38e2d0<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#68a49429 => true, None#bf32b378 => false};
}
<T>(x#:0: Option#🍼<[var]T#:0>): bool => {
    if isRecord!(x#:0, Some#🤥🧑‍✈️🥜😃) {
        return true;
    };
    if isRecord!(x#:0, None#🕒) {
        return false;
    };
    match_fail!();
}
```
*/
export const hash_4b9f8eb0: <T>(arg_0: t_8c38e2d0<T>) => boolean = <T>(x$0: t_8c38e2d0<T>) => {
  if (x$0.type === "68a49429") {
    return true;
  }

  if (x$0.type === "bf32b378") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#c47448f6 = OptionOrTwice#3beae218<int#builtin>:y#f1472b54
OptionOrTwice#🐀🥮✨<int>:y#⚓
```
*/
export const hash_c47448f6: t_3beae218<number> = hash_f1472b54;

/**
```
const y1t#159d7836 = (y1#:0: OptionOrTwice#3beae218<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#f4bca304{one#:1, two#:2} => one#:1 +#builtin two#:2,
    None#bf32b378 => 2,
    _ => 0,
}
(y1#:0: OptionOrTwice#🐀🥮✨<int>): int => {
    if isRecord!(y1#:0, Twice#🏨) {
        return y1#:0.#Twice#🏨#0 + y1#:0.#Twice#🏨#1;
    };
    if isRecord!(y1#:0, None#🕒) {
        return 2;
    };
    return 0;
}
```
*/
export const hash_159d7836: (arg_0: t_3beae218<number>) => number = (y1: t_3beae218<number>) => {
  if (y1.type === "f4bca304") {
    return y1.hf4bca304_0 + y1.hf4bca304_1;
  }

  if (y1.type === "bf32b378") {
    return 2;
  }

  return 0;
};

/**
```
const y2#07ff0aea = OptionOrTwice#3beae218<int#builtin>:Twice#f4bca304<int#builtin>{
    one#f4bca304#0: 3,
    two#f4bca304#1: 10,
}
OptionOrTwice#🐀🥮✨<int>:Twice#🏨{TODO SPREADs}{hf4bca304_0: 3, hf4bca304_1: 10}
```
*/
export const hash_07ff0aea: t_3beae218<number> = ({
  type: "f4bca304",
  hf4bca304_0: 3,
  hf4bca304_1: 10
} as t_3beae218<number>);

/*
switch y2#07ff0aea {Twice#f4bca304{one#:0, two#:1} => one#:0 +#builtin two#:1, _ => 0} 
    ==#24558044#2f333afa#0 13
assertCall(
    IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0,
    ((): int => {
        if isRecord!(y2#🌐🎋❤️, Twice#🏨) {
            return y2#🌐🎋❤️.#Twice#🏨#0 + y2#🌐🎋❤️.#Twice#🏨#1;
        };
        return 0;
    })(),
    13,
)
*/
assertCall(hash_24558044.h2f333afa_0, (() => {
  if (hash_07ff0aea.type === "f4bca304") {
    return hash_07ff0aea.hf4bca304_0 + hash_07ff0aea.hf4bca304_1;
  }

  return 0;
})(), 13);

/*
y1t#159d7836(y1#c47448f6) ==#24558044#2f333afa#0 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, y1t#🥶🛫🧚(y1#🙇‍♂️), 2)
*/
assertCall(hash_24558044.h2f333afa_0, hash_159d7836(hash_c47448f6), 2);

/*
isPresent#4b9f8eb0<int#builtin>(
        x: Option#8c38e2d0<int#builtin>:Some#68a49429<int#builtin>{value#68a49429#0: 3},
    ) 
    ==#builtin true
assertEqual(
    isPresent#🍛🏸🦿😃<int>(Option#🍼<int>:Some#🤥🧑‍✈️🥜😃{TODO SPREADs}{h68a49429_0: 3}),
    true,
)
*/
assertEqual(hash_4b9f8eb0(({
  type: "68a49429",
  h68a49429_0: 3
} as t_8c38e2d0<number>)), true);

/*
isPresent#4b9f8eb0<int#builtin>(x: Option#8c38e2d0<int#builtin>:None#bf32b378) ==#builtin false
assertEqual(isPresent#🍛🏸🦿😃<int>(Option#🍼<int>:None#🕒{TODO SPREADs}{}), false)
*/
assertEqual(hash_4b9f8eb0(({
  type: "bf32b378"
} as t_8c38e2d0<number>)), false);

/*
getWithDefault#4e2189db<int#builtin>(x: Option#8c38e2d0<int#builtin>:None#bf32b378, default: 20) 
    ==#24558044#2f333afa#0 20
assertCall(
    IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0,
    getWithDefault#👩‍👩‍👧‍👦👺🙍‍♀️😃<int>(Option#🍼<int>:None#🕒{TODO SPREADs}{}, 20),
    20,
)
*/
assertCall(hash_24558044.h2f333afa_0, hash_4e2189db(({
  type: "bf32b378"
} as t_8c38e2d0<number>), 20), 20);

/*
getWithDefault#4e2189db<int#builtin>(
        x: Option#8c38e2d0<int#builtin>:Some#68a49429<int#builtin>{value#68a49429#0: 3},
        default: 20,
    ) 
    ==#24558044#2f333afa#0 3
assertCall(
    IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0,
    getWithDefault#👩‍👩‍👧‍👦👺🙍‍♀️😃<int>(
        Option#🍼<int>:Some#🤥🧑‍✈️🥜😃{TODO SPREADs}{h68a49429_0: 3},
        20,
    ),
    3,
)
*/
assertCall(hash_24558044.h2f333afa_0, hash_4e2189db(({
  type: "68a49429",
  h68a49429_0: 3
} as t_8c38e2d0<number>), 20), 3);

/*
switch None#bf32b378 {None#bf32b378 => true}
assert(
    ((): bool => {
        if isRecord!(None#🕒{TODO SPREADs}{}, None#🕒) {
            return true;
        };
        match_fail!();
    })(),
)
*/
assert((() => {
  if (({
    type: "bf32b378"
  } as t_bf32b378).type === "bf32b378") {
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
isSomeYes#139f88d3(
        v: Option#8c38e2d0<string#builtin>:Some#68a49429<string#builtin>{value#68a49429#0: "yes"},
    ) 
    ==#builtin true
assertEqual(
    isSomeYes#👩‍🦰🏓👷‍♀️(Option#🍼<string>:Some#🤥🧑‍✈️🥜😃{TODO SPREADs}{h68a49429_0: "yes"}),
    true,
)
*/
assertEqual(hash_139f88d3(({
  type: "68a49429",
  h68a49429_0: "yes"
} as t_8c38e2d0<string>)), true);

/*
isNotFalse#0932d938(n: true) ==#builtin true
assertEqual(isNotFalse#👷‍♂️🤳🗯️(true), true)
*/
assertEqual(hash_0932d938(true), true);

/*
isAs#4a4e8a92(y#f1472b54)
assertCall(isAs#🧇🌤️👆😃, y#⚓)
*/
assertCall(hash_4a4e8a92, hash_f1472b54);

/*
check#53788bc0(y1#c47448f6)
assertCall(check#🎉🐼👷😃, y1#🙇‍♂️)
*/
assertCall(hash_53788bc0, hash_c47448f6);