import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type None#423d0096 = {}
```
*/
type t_423d0096 = {
  type: "423d0096";
};

/**
```
type Some#20a63341<T#:0> = {
    value: T#:0,
}
```
*/
type t_20a63341<T_0> = {
  type: "20a63341";
  h20a63341_0: T_0;
};

/**
```
type Twice#413b9784<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_413b9784<T_0> = {
  type: "413b9784";
  h413b9784_0: T_0;
  h413b9784_1: T_0;
};

/*enum Option#8cfb7050<T#:0> {
    Some#20a63341<T#:0>,
    None#423d0096,
}*/
type t_8cfb7050<T_0> = t_20a63341<T_0> | t_423d0096;

/*enum OptionOrTwice#146d267e<T#:0> {
    ...Option#8cfb7050<T#:0>,
    Twice#413b9784<T#:0>,
}*/
type t_146d267e<T_0> = t_413b9784<T_0> | t_20a63341<T_0> | t_423d0096;

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
const y#3d75c736 = Option#8cfb7050<int#builtin>:None#423d0096
Option#😖<int>:None#👋🚜😑😃{TODO SPREADs}{}
```
*/
export const hash_3d75c736: t_8cfb7050<number> = ({
  type: "423d0096"
} as t_8cfb7050<number>);

/**
```
const check#5d37d014 = (y1#:0: OptionOrTwice#146d267e<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#413b9784{two: 5} => false,
    Twice#413b9784 => false,
    Option#8cfb7050 as x#:1 => switch x#:1 {Some#20a63341 => false, None#423d0096 => true},
}
(y1#:0: OptionOrTwice#🥑🛹👰‍♀️<int>): bool => {
    if isRecord!(y1#:0, Twice#🕘🔪😚😃) && y1#:0.#Twice#🕘🔪😚😃#1 == 5 {
        return false;
    };
    if isRecord!(y1#:0, Twice#🕘🔪😚😃) {
        return false;
    };
    if isRecord!(y1#:0, Some#🏎️🧖🐗) || isRecord!(y1#:0, None#👋🚜😑😃) {
        const x#:1: OptionOrTwice#🥑🛹👰‍♀️<int> = Option#😖 <- y1#:0;
        if isRecord!(x#:1, Some#🏎️🧖🐗) {
            return false;
        };
        if isRecord!(x#:1, None#👋🚜😑😃) {
            return true;
        };
        match_fail!();
    };
    match_fail!();
}
```
*/
export const hash_5d37d014: (arg_0: t_146d267e<number>) => boolean = (y1: t_146d267e<number>) => {
  if (y1.type === "413b9784" && y1.h413b9784_1 === 5) {
    return false;
  }

  if (y1.type === "413b9784") {
    return false;
  }

  if (y1.type === "20a63341" || y1.type === "423d0096") {
    let x: t_146d267e<number> = y1;

    if (x.type === "20a63341") {
      return false;
    }

    if (x.type === "423d0096") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#0e29b0f0 = (y#:0: Option#8cfb7050<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#20a63341 as x#:1 => x#:1.value#20a63341#0 ==#ec95f154#51ea2a36#0 2,
    None#423d0096 => true,
}
(y#:0: Option#😖<int>): bool => {
    if isRecord!(y#:0, Some#🏎️🧖🐗) {
        return IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(Some#🏎️🧖🐗 <- y#:0.#Some#🏎️🧖🐗#0, 2);
    };
    if isRecord!(y#:0, None#👋🚜😑😃) {
        return true;
    };
    match_fail!();
}
```
*/
export const hash_0e29b0f0: (arg_0: t_8cfb7050<number>) => boolean = (y: t_8cfb7050<number>) => {
  if (y.type === "20a63341") {
    return hash_ec95f154.h51ea2a36_0(y.h20a63341_0, 2);
  }

  if (y.type === "423d0096") {
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
const isSomeYes#62f83d5c = (v#:0: Option#8cfb7050<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#20a63341{value: "no"} => false,
    None#423d0096 => false,
    Some#20a63341{value: v#:1} => v#:1 ==#da00b310#51ea2a36#0 "yes",
}
(v#:0: Option#😖<string>): bool => {
    if isRecord!(v#:0, Some#🏎️🧖🐗) && v#:0.#Some#🏎️🧖🐗#0 == "no" {
        return false;
    };
    if isRecord!(v#:0, None#👋🚜😑😃) {
        return false;
    };
    if isRecord!(v#:0, Some#🏎️🧖🐗) {
        return StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0(v#:0.#Some#🏎️🧖🐗#0, "yes");
    };
    match_fail!();
}
```
*/
export const hash_62f83d5c: (arg_0: t_8cfb7050<string>) => boolean = (v: t_8cfb7050<string>) => {
  if (v.type === "20a63341" && v.h20a63341_0 === "no") {
    return false;
  }

  if (v.type === "423d0096") {
    return false;
  }

  if (v.type === "20a63341") {
    return hash_da00b310.h51ea2a36_0(v.h20a63341_0, "yes");
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
const getWithDefault#25371a28 = <T#:0>(x#:0: Option#8cfb7050<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#20a63341{value: v#:2} => v#:2, None#423d0096 => default#:1};
}
<T>(x#:0: Option#😖<[var]T#:0>, default#:1: [var]T#:0): [var]T#:0 => {
    if isRecord!(x#:0, Some#🏎️🧖🐗) {
        return x#:0.#Some#🏎️🧖🐗#0;
    };
    if isRecord!(x#:0, None#👋🚜😑😃) {
        return default#:1;
    };
    match_fail!();
}
```
*/
export const hash_25371a28: <T_0>(arg_0: t_8cfb7050<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_8cfb7050<T_0>, default$1: T_0) => {
  if (x$0.type === "20a63341") {
    return x$0.h20a63341_0;
  }

  if (x$0.type === "423d0096") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#31e7122a = <T#:0>(x#:0: Option#8cfb7050<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#20a63341 => true, None#423d0096 => false};
}
<T>(x#:0: Option#😖<[var]T#:0>): bool => {
    if isRecord!(x#:0, Some#🏎️🧖🐗) {
        return true;
    };
    if isRecord!(x#:0, None#👋🚜😑😃) {
        return false;
    };
    match_fail!();
}
```
*/
export const hash_31e7122a: <T_0>(arg_0: t_8cfb7050<T_0>) => boolean = <T_0>(x$0: t_8cfb7050<T_0>) => {
  if (x$0.type === "20a63341") {
    return true;
  }

  if (x$0.type === "423d0096") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#2ddce734 = OptionOrTwice#146d267e<int#builtin>:y#3d75c736
OptionOrTwice#🥑🛹👰‍♀️<int>:y#🚒🚶🏀
```
*/
export const hash_2ddce734: t_146d267e<number> = hash_3d75c736;

/**
```
const y1t#05cd7be4 = (y1#:0: OptionOrTwice#146d267e<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#413b9784{one: one#:1, two: two#:2} => one#:1 +#builtin two#:2,
    None#423d0096 => 2,
    _ => 0,
}
(y1#:0: OptionOrTwice#🥑🛹👰‍♀️<int>): int => {
    if isRecord!(y1#:0, Twice#🕘🔪😚😃) {
        return y1#:0.#Twice#🕘🔪😚😃#0 + y1#:0.#Twice#🕘🔪😚😃#1;
    };
    if isRecord!(y1#:0, None#👋🚜😑😃) {
        return 2;
    };
    return 0;
}
```
*/
export const hash_05cd7be4: (arg_0: t_146d267e<number>) => number = (y1: t_146d267e<number>) => {
  if (y1.type === "413b9784") {
    return y1.h413b9784_0 + y1.h413b9784_1;
  }

  if (y1.type === "423d0096") {
    return 2;
  }

  return 0;
};

/**
```
const y2#b4ff5f6e = OptionOrTwice#146d267e<int#builtin>:Twice#413b9784<int#builtin>{
    one#413b9784#0: 3,
    two#413b9784#1: 10,
}
OptionOrTwice#🥑🛹👰‍♀️<int>:Twice#🕘🔪😚😃{TODO SPREADs}{h413b9784_0: 3, h413b9784_1: 10}
```
*/
export const hash_b4ff5f6e: t_146d267e<number> = ({
  type: "413b9784",
  h413b9784_0: 3,
  h413b9784_1: 10
} as t_146d267e<number>);

/*
switch y2#b4ff5f6e {Twice#413b9784{one: one#:0, two: two#:1} => one#:0 +#builtin two#:1, _ => 0} 
    ==#ec95f154#51ea2a36#0 13
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    ((): int => {
        if isRecord!(y2#⏰, Twice#🕘🔪😚😃) {
            return y2#⏰.#Twice#🕘🔪😚😃#0 + y2#⏰.#Twice#🕘🔪😚😃#1;
        };
        return 0;
    })(),
    13,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, (() => {
  if (hash_b4ff5f6e.type === "413b9784") {
    return hash_b4ff5f6e.h413b9784_0 + hash_b4ff5f6e.h413b9784_1;
  }

  return 0;
})(), 13);

/*
y1t#05cd7be4(y1#2ddce734) ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, y1t#🥊🛫👿(y1#🚐🚕🥤), 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_05cd7be4(hash_2ddce734), 2);

/*
isPresent#31e7122a<int#builtin>(
        x: Option#8cfb7050<int#builtin>:Some#20a63341<int#builtin>{value#20a63341#0: 3},
    ) 
    ==#builtin true
assertEqual(isPresent#🐔👫🌉<int>(Option#😖<int>:Some#🏎️🧖🐗{TODO SPREADs}{h20a63341_0: 3}), true)
*/
assertEqual(hash_31e7122a(({
  type: "20a63341",
  h20a63341_0: 3
} as t_8cfb7050<number>)), true);

/*
isPresent#31e7122a<int#builtin>(x: Option#8cfb7050<int#builtin>:None#423d0096) ==#builtin false
assertEqual(isPresent#🐔👫🌉<int>(Option#😖<int>:None#👋🚜😑😃{TODO SPREADs}{}), false)
*/
assertEqual(hash_31e7122a(({
  type: "423d0096"
} as t_8cfb7050<number>)), false);

/*
getWithDefault#25371a28<int#builtin>(x: Option#8cfb7050<int#builtin>:None#423d0096, default: 20) 
    ==#ec95f154#51ea2a36#0 20
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    getWithDefault#🐾💏🕸️<int>(Option#😖<int>:None#👋🚜😑😃{TODO SPREADs}{}, 20),
    20,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_25371a28(({
  type: "423d0096"
} as t_8cfb7050<number>), 20), 20);

/*
getWithDefault#25371a28<int#builtin>(
        x: Option#8cfb7050<int#builtin>:Some#20a63341<int#builtin>{value#20a63341#0: 3},
        default: 20,
    ) 
    ==#ec95f154#51ea2a36#0 3
assertCall(
    IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0,
    getWithDefault#🐾💏🕸️<int>(Option#😖<int>:Some#🏎️🧖🐗{TODO SPREADs}{h20a63341_0: 3}, 20),
    3,
)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_25371a28(({
  type: "20a63341",
  h20a63341_0: 3
} as t_8cfb7050<number>), 20), 3);

/*
switch None#423d0096 {None#423d0096 => true}
assert(
    ((): bool => {
        if isRecord!(None#👋🚜😑😃{TODO SPREADs}{}, None#👋🚜😑😃) {
            return true;
        };
        match_fail!();
    })(),
)
*/
assert((() => {
  if (({
    type: "423d0096"
  } as t_423d0096).type === "423d0096") {
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
isSomeYes#62f83d5c(
        v: Option#8cfb7050<string#builtin>:Some#20a63341<string#builtin>{value#20a63341#0: "yes"},
    ) 
    ==#builtin true
assertEqual(
    isSomeYes#🧛🐪🐦😃(Option#😖<string>:Some#🏎️🧖🐗{TODO SPREADs}{h20a63341_0: "yes"}),
    true,
)
*/
assertEqual(hash_62f83d5c(({
  type: "20a63341",
  h20a63341_0: "yes"
} as t_8cfb7050<string>)), true);

/*
isNotFalse#28f05e73(n: true) ==#builtin true
assertEqual(isNotFalse#🍍😛🥨(true), true)
*/
assertEqual(hash_28f05e73(true), true);

/*
isAs#0e29b0f0(y#3d75c736)
assertCall(isAs#🙋‍♂️🍃🙍‍♀️, y#🚒🚶🏀)
*/
assertCall(hash_0e29b0f0, hash_3d75c736);

/*
check#5d37d014(y1#2ddce734)
assertCall(check#😙🐩👨‍👩‍👧‍👧😃, y1#🚐🚕🥤)
*/
assertCall(hash_5d37d014, hash_2ddce734);