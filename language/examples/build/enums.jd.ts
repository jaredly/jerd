import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.6868119967742512) type None#6fdb00d4 = {}
```
*/
type t_6fdb00d4 = {
  type: "6fdb00d4";
};

/**
```
@unique(0.6911171338613936) type Some#117199e0<T#:0> = {
    value: T#:0,
}
```
*/
type t_117199e0<T> = {
  type: "117199e0";
  h117199e0_0: T;
};

/**
```
@unique(0.22735088588829966) type Twice#9a0166a0<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_9a0166a0<T> = {
  type: "9a0166a0";
  h9a0166a0_0: T;
  h9a0166a0_1: T;
};

/*enum Option#63d0f130<T#:0> {
    Some#117199e0<T#:0>,
    None#6fdb00d4,
}*/
type t_63d0f130<T> = t_117199e0<T> | t_6fdb00d4;

/*enum OptionOrTwice#50787efe<T#:0> {
    ...Option#63d0f130<T#:0>,
    Twice#9a0166a0<T#:0>,
}*/
type t_50787efe<T> = t_9a0166a0<T> | t_117199e0<T> | t_6fdb00d4;

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
const y#521d48f4 = Option#63d0f130<int#builtin>:None#6fdb00d4
Option#👮‍♀️😎🐍😃<int>:None#🧑‍🦰🦑🏠😃{TODO SPREADs}{}
```
*/
export const hash_521d48f4: t_63d0f130<number> = ({
  type: "6fdb00d4"
} as t_63d0f130<number>);

/**
```
const check#3167cf6c = (y1#:0: OptionOrTwice#50787efe<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#9a0166a0{two: 5} => false,
    Twice#9a0166a0 => false,
    Option#63d0f130 as x#:1 => switch x#:1 {Some#117199e0 => false, None#6fdb00d4 => true},
}
(y1#:0: OptionOrTwice#🏡🐻🧑‍⚖️😃<int>): bool => {
    if isRecord!(y1#:0, Twice#🥙) && y1#:0.#Twice#🥙#1 == 5 {
        return false;
    };
    if isRecord!(y1#:0, Twice#🥙) {
        return false;
    };
    if isRecord!(y1#:0, Some#👨‍👧🤖👨‍💼) || isRecord!(y1#:0, None#🧑‍🦰🦑🏠😃) {
        const x#:1: OptionOrTwice#🏡🐻🧑‍⚖️😃<int> = Option#👮‍♀️😎🐍😃 <- y1#:0;
        if isRecord!(x#:1, Some#👨‍👧🤖👨‍💼) {
            return false;
        };
        if isRecord!(x#:1, None#🧑‍🦰🦑🏠😃) {
            return true;
        };
        match_fail!();
    };
    match_fail!();
}
```
*/
export const hash_3167cf6c: (arg_0: t_50787efe<number>) => boolean = (y1: t_50787efe<number>) => {
  if (y1.type === "9a0166a0" && y1.h9a0166a0_1 === 5) {
    return false;
  }

  if (y1.type === "9a0166a0") {
    return false;
  }

  if (y1.type === "117199e0" || y1.type === "6fdb00d4") {
    let x: t_50787efe<number> = y1;

    if (x.type === "117199e0") {
      return false;
    }

    if (x.type === "6fdb00d4") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#071284d3 = (y#:0: Option#63d0f130<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#117199e0 as x#:1 => x#:1.value#117199e0#0 ==#24558044#2f333afa#0 2,
    None#6fdb00d4 => true,
}
(y#:0: Option#👮‍♀️😎🐍😃<int>): bool => {
    if isRecord!(y#:0, Some#👨‍👧🤖👨‍💼) {
        return IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0(Some#👨‍👧🤖👨‍💼 <- y#:0.#Some#👨‍👧🤖👨‍💼#0, 2);
    };
    if isRecord!(y#:0, None#🧑‍🦰🦑🏠😃) {
        return true;
    };
    match_fail!();
}
```
*/
export const hash_071284d3: (arg_0: t_63d0f130<number>) => boolean = (y: t_63d0f130<number>) => {
  if (y.type === "117199e0") {
    return hash_24558044.h2f333afa_0(y.h117199e0_0, 2);
  }

  if (y.type === "6fdb00d4") {
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
const isSomeYes#27e40938 = (v#:0: Option#63d0f130<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#117199e0{value: "no"} => false,
    None#6fdb00d4 => false,
    Some#117199e0{value: v#:1} => v#:1 ==#8a86d00e#2f333afa#0 "yes",
}
(v#:0: Option#👮‍♀️😎🐍😃<string>): bool => {
    if isRecord!(v#:0, Some#👨‍👧🤖👨‍💼) && v#:0.#Some#👨‍👧🤖👨‍💼#0 == "no" {
        return false;
    };
    if isRecord!(v#:0, None#🧑‍🦰🦑🏠😃) {
        return false;
    };
    if isRecord!(v#:0, Some#👨‍👧🤖👨‍💼) {
        return StringEq#😍.#Eq#🧱👨‍🦰🏖️#0(v#:0.#Some#👨‍👧🤖👨‍💼#0, "yes");
    };
    match_fail!();
}
```
*/
export const hash_27e40938: (arg_0: t_63d0f130<string>) => boolean = (v: t_63d0f130<string>) => {
  if (v.type === "117199e0" && v.h117199e0_0 === "no") {
    return false;
  }

  if (v.type === "6fdb00d4") {
    return false;
  }

  if (v.type === "117199e0") {
    return hash_8a86d00e.h2f333afa_0(v.h117199e0_0, "yes");
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
const getWithDefault#85221a94 = <T#:0>(x#:0: Option#63d0f130<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#117199e0{value: v#:2} => v#:2, None#6fdb00d4 => default#:1};
}
<T>(x#:0: Option#👮‍♀️😎🐍😃<[var]T#:0>, default#:1: [var]T#:0): [var]T#:0 => {
    if isRecord!(x#:0, Some#👨‍👧🤖👨‍💼) {
        return x#:0.#Some#👨‍👧🤖👨‍💼#0;
    };
    if isRecord!(x#:0, None#🧑‍🦰🦑🏠😃) {
        return default#:1;
    };
    match_fail!();
}
```
*/
export const hash_85221a94: <T>(arg_0: t_63d0f130<T>, arg_1: T) => T = <T>(x$0: t_63d0f130<T>, default$1: T) => {
  if (x$0.type === "117199e0") {
    return x$0.h117199e0_0;
  }

  if (x$0.type === "6fdb00d4") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#c34f5d32 = <T#:0>(x#:0: Option#63d0f130<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#117199e0 => true, None#6fdb00d4 => false};
}
<T>(x#:0: Option#👮‍♀️😎🐍😃<[var]T#:0>): bool => {
    if isRecord!(x#:0, Some#👨‍👧🤖👨‍💼) {
        return true;
    };
    if isRecord!(x#:0, None#🧑‍🦰🦑🏠😃) {
        return false;
    };
    match_fail!();
}
```
*/
export const hash_c34f5d32: <T>(arg_0: t_63d0f130<T>) => boolean = <T>(x$0: t_63d0f130<T>) => {
  if (x$0.type === "117199e0") {
    return true;
  }

  if (x$0.type === "6fdb00d4") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#7d58c0a6 = OptionOrTwice#50787efe<int#builtin>:y#521d48f4
OptionOrTwice#🏡🐻🧑‍⚖️😃<int>:y#🧏‍♀️🛑👩‍🎤😃
```
*/
export const hash_7d58c0a6: t_50787efe<number> = hash_521d48f4;

/**
```
const y1t#715cc2ec = (y1#:0: OptionOrTwice#50787efe<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#9a0166a0{one#:1, two#:2} => one#:1 +#builtin two#:2,
    None#6fdb00d4 => 2,
    _ => 0,
}
(y1#:0: OptionOrTwice#🏡🐻🧑‍⚖️😃<int>): int => {
    if isRecord!(y1#:0, Twice#🥙) {
        return y1#:0.#Twice#🥙#0 + y1#:0.#Twice#🥙#1;
    };
    if isRecord!(y1#:0, None#🧑‍🦰🦑🏠😃) {
        return 2;
    };
    return 0;
}
```
*/
export const hash_715cc2ec: (arg_0: t_50787efe<number>) => number = (y1: t_50787efe<number>) => {
  if (y1.type === "9a0166a0") {
    return y1.h9a0166a0_0 + y1.h9a0166a0_1;
  }

  if (y1.type === "6fdb00d4") {
    return 2;
  }

  return 0;
};

/**
```
const y2#50515cc9 = OptionOrTwice#50787efe<int#builtin>:Twice#9a0166a0<int#builtin>{
    one#9a0166a0#0: 3,
    two#9a0166a0#1: 10,
}
OptionOrTwice#🏡🐻🧑‍⚖️😃<int>:Twice#🥙{TODO SPREADs}{h9a0166a0_0: 3, h9a0166a0_1: 10}
```
*/
export const hash_50515cc9: t_50787efe<number> = ({
  type: "9a0166a0",
  h9a0166a0_0: 3,
  h9a0166a0_1: 10
} as t_50787efe<number>);

/*
switch y2#50515cc9 {Twice#9a0166a0{one#:0, two#:1} => one#:0 +#builtin two#:1, _ => 0} 
    ==#24558044#2f333afa#0 13
assertCall(
    IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0,
    ((): int => {
        if isRecord!(y2#👧😤👨‍🏫😃, Twice#🥙) {
            return y2#👧😤👨‍🏫😃.#Twice#🥙#0 + y2#👧😤👨‍🏫😃.#Twice#🥙#1;
        };
        return 0;
    })(),
    13,
)
*/
assertCall(hash_24558044.h2f333afa_0, (() => {
  if (hash_50515cc9.type === "9a0166a0") {
    return hash_50515cc9.h9a0166a0_0 + hash_50515cc9.h9a0166a0_1;
  }

  return 0;
})(), 13);

/*
y1t#715cc2ec(y1#7d58c0a6) ==#24558044#2f333afa#0 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, y1t#🗾🚋⛲😃(y1#👇🐧⚾😃), 2)
*/
assertCall(hash_24558044.h2f333afa_0, hash_715cc2ec(hash_7d58c0a6), 2);

/*
isPresent#c34f5d32<int#builtin>(
        x: Option#63d0f130<int#builtin>:Some#117199e0<int#builtin>{value#117199e0#0: 3},
    ) 
    ==#builtin true
assertEqual(
    isPresent#🕵️‍♂️<int>(Option#👮‍♀️😎🐍😃<int>:Some#👨‍👧🤖👨‍💼{TODO SPREADs}{h117199e0_0: 3}),
    true,
)
*/
assertEqual(hash_c34f5d32(({
  type: "117199e0",
  h117199e0_0: 3
} as t_63d0f130<number>)), true);

/*
isPresent#c34f5d32<int#builtin>(x: Option#63d0f130<int#builtin>:None#6fdb00d4) ==#builtin false
assertEqual(isPresent#🕵️‍♂️<int>(Option#👮‍♀️😎🐍😃<int>:None#🧑‍🦰🦑🏠😃{TODO SPREADs}{}), false)
*/
assertEqual(hash_c34f5d32(({
  type: "6fdb00d4"
} as t_63d0f130<number>)), false);

/*
getWithDefault#85221a94<int#builtin>(x: Option#63d0f130<int#builtin>:None#6fdb00d4, default: 20) 
    ==#24558044#2f333afa#0 20
assertCall(
    IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0,
    getWithDefault#🍖<int>(Option#👮‍♀️😎🐍😃<int>:None#🧑‍🦰🦑🏠😃{TODO SPREADs}{}, 20),
    20,
)
*/
assertCall(hash_24558044.h2f333afa_0, hash_85221a94(({
  type: "6fdb00d4"
} as t_63d0f130<number>), 20), 20);

/*
getWithDefault#85221a94<int#builtin>(
        x: Option#63d0f130<int#builtin>:Some#117199e0<int#builtin>{value#117199e0#0: 3},
        default: 20,
    ) 
    ==#24558044#2f333afa#0 3
assertCall(
    IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0,
    getWithDefault#🍖<int>(
        Option#👮‍♀️😎🐍😃<int>:Some#👨‍👧🤖👨‍💼{TODO SPREADs}{h117199e0_0: 3},
        20,
    ),
    3,
)
*/
assertCall(hash_24558044.h2f333afa_0, hash_85221a94(({
  type: "117199e0",
  h117199e0_0: 3
} as t_63d0f130<number>), 20), 3);

/*
switch None#6fdb00d4 {None#6fdb00d4 => true}
assert(
    ((): bool => {
        if isRecord!(None#🧑‍🦰🦑🏠😃{TODO SPREADs}{}, None#🧑‍🦰🦑🏠😃) {
            return true;
        };
        match_fail!();
    })(),
)
*/
assert((() => {
  if (({
    type: "6fdb00d4"
  } as t_6fdb00d4).type === "6fdb00d4") {
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
isSomeYes#27e40938(
        v: Option#63d0f130<string#builtin>:Some#117199e0<string#builtin>{value#117199e0#0: "yes"},
    ) 
    ==#builtin true
assertEqual(
    isSomeYes#👷‍♂️👨‍🎓🥑(
        Option#👮‍♀️😎🐍😃<string>:Some#👨‍👧🤖👨‍💼{TODO SPREADs}{h117199e0_0: "yes"},
    ),
    true,
)
*/
assertEqual(hash_27e40938(({
  type: "117199e0",
  h117199e0_0: "yes"
} as t_63d0f130<string>)), true);

/*
isNotFalse#0932d938(n: true) ==#builtin true
assertEqual(isNotFalse#👷‍♂️🤳🗯️(true), true)
*/
assertEqual(hash_0932d938(true), true);

/*
isAs#071284d3(y#521d48f4)
assertCall(isAs#👩‍🦰🤙🙉, y#🧏‍♀️🛑👩‍🎤😃)
*/
assertCall(hash_071284d3, hash_521d48f4);

/*
check#3167cf6c(y1#7d58c0a6)
assertCall(check#⏳🐕‍🦺⛺, y1#👇🐧⚾😃)
*/
assertCall(hash_3167cf6c, hash_7d58c0a6);