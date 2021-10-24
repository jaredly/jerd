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
@unique(0.6911171338613936) type Some#a0b4d1b4<T#:0> = {
    value: T#:0,
}
```
*/
type t_a0b4d1b4<T> = {
  type: "a0b4d1b4";
  ha0b4d1b4_0: T_0;
};

/**
```
@unique(0.22735088588829966) type Twice#3444f780<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_3444f780<T> = {
  type: "3444f780";
  h3444f780_0: T_0;
  h3444f780_1: T_0;
};

/*enum Option#9854cdf0<T#:0> {
    Some#a0b4d1b4<T#:0>,
    None#280d2df4,
}*/
type t_9854cdf0<T> = t_a0b4d1b4<T_0> | t_280d2df4;

/*enum OptionOrTwice#58d5ae20<T#:0> {
    ...Option#9854cdf0<T#:0>,
    Twice#3444f780<T#:0>,
}*/
type t_58d5ae20<T> = t_3444f780<T_0> | t_a0b4d1b4<T_0> | t_280d2df4;

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
const StringEq#0d81b26d = Eq#3b6b23ae<string#builtin>{"=="#3b6b23ae#0: stringEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: stringEq}
```
*/
export const hash_0d81b26d: t_3b6b23ae<string> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: stringEq
} as t_3b6b23ae<string>);

/**
```
const y#668420b6 = Option#9854cdf0<int#builtin>:None#280d2df4
Option#🐶<int>:None#🐩🛣️🥔{TODO SPREADs}{}
```
*/
export const hash_668420b6: t_9854cdf0<number> = ({
  type: "280d2df4"
} as t_9854cdf0<number>);

/**
```
const check#34e4fc8e = (y1#:0: OptionOrTwice#58d5ae20<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#3444f780{two: 5} => false,
    Twice#3444f780 => false,
    Option#9854cdf0 as x#:1 => switch x#:1 {Some#a0b4d1b4 => false, None#280d2df4 => true},
}
(y1#:0: OptionOrTwice#🐻‍❄️💆🧖‍♂️😃<int>): bool => {
    if isRecord!(y1#:0, Twice#🕖👳‍♂️🦽) && y1#:0.#Twice#🕖👳‍♂️🦽#1 == 5 {
        return false;
    };
    if isRecord!(y1#:0, Twice#🕖👳‍♂️🦽) {
        return false;
    };
    if isRecord!(y1#:0, Some#🤽) || isRecord!(y1#:0, None#🐩🛣️🥔) {
        const x#:1: OptionOrTwice#🐻‍❄️💆🧖‍♂️😃<int> = Option#🐶 <- y1#:0;
        if isRecord!(x#:1, Some#🤽) {
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
export const hash_34e4fc8e: (arg_0: t_58d5ae20<number>) => boolean = (y1: t_58d5ae20<number>) => {
  if (y1.type === "3444f780" && y1.h3444f780_1 === 5) {
    return false;
  }

  if (y1.type === "3444f780") {
    return false;
  }

  if (y1.type === "a0b4d1b4" || y1.type === "280d2df4") {
    let x: t_58d5ae20<number> = y1;

    if (x.type === "a0b4d1b4") {
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
const isAs#d18ba174 = (y#:0: Option#9854cdf0<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#a0b4d1b4 as x#:1 => x#:1.value#a0b4d1b4#0 ==#6d46a318#3b6b23ae#0 2,
    None#280d2df4 => true,
}
(y#:0: Option#🐶<int>): bool => {
    if isRecord!(y#:0, Some#🤽) {
        return IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0(Some#🤽 <- y#:0.#Some#🤽#0, 2);
    };
    if isRecord!(y#:0, None#🐩🛣️🥔) {
        return true;
    };
    match_fail!();
}
```
*/
export const hash_d18ba174: (arg_0: t_9854cdf0<number>) => boolean = (y: t_9854cdf0<number>) => {
  if (y.type === "a0b4d1b4") {
    return hash_6d46a318.h3b6b23ae_0(y.ha0b4d1b4_0, 2);
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
const isSomeYes#07649480 = (v#:0: Option#9854cdf0<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#a0b4d1b4{value: "no"} => false,
    None#280d2df4 => false,
    Some#a0b4d1b4{value: v#:1} => v#:1 ==#0d81b26d#3b6b23ae#0 "yes",
}
(v#:0: Option#🐶<string>): bool => {
    if isRecord!(v#:0, Some#🤽) && v#:0.#Some#🤽#0 == "no" {
        return false;
    };
    if isRecord!(v#:0, None#🐩🛣️🥔) {
        return false;
    };
    if isRecord!(v#:0, Some#🤽) {
        return StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0(v#:0.#Some#🤽#0, "yes");
    };
    match_fail!();
}
```
*/
export const hash_07649480: (arg_0: t_9854cdf0<string>) => boolean = (v: t_9854cdf0<string>) => {
  if (v.type === "a0b4d1b4" && v.ha0b4d1b4_0 === "no") {
    return false;
  }

  if (v.type === "280d2df4") {
    return false;
  }

  if (v.type === "a0b4d1b4") {
    return hash_0d81b26d.h3b6b23ae_0(v.ha0b4d1b4_0, "yes");
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
const getWithDefault#429d376a = <T#:0>(x#:0: Option#9854cdf0<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#a0b4d1b4{value: v#:2} => v#:2, None#280d2df4 => default#:1};
}
<T>(x#:0: Option#🐶<[var]T#:0>, default#:1: [var]T#:0): [var]T#:0 => {
    if isRecord!(x#:0, Some#🤽) {
        return x#:0.#Some#🤽#0;
    };
    if isRecord!(x#:0, None#🐩🛣️🥔) {
        return default#:1;
    };
    match_fail!();
}
```
*/
export const hash_429d376a: <T>(arg_0: t_9854cdf0<T_0>, arg_1: T_0) => T_0 = <T>(x$0: t_9854cdf0<T_0>, default$1: T_0) => {
  if (x$0.type === "a0b4d1b4") {
    return x$0.ha0b4d1b4_0;
  }

  if (x$0.type === "280d2df4") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#078ebb0c = <T#:0>(x#:0: Option#9854cdf0<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#a0b4d1b4 => true, None#280d2df4 => false};
}
<T>(x#:0: Option#🐶<[var]T#:0>): bool => {
    if isRecord!(x#:0, Some#🤽) {
        return true;
    };
    if isRecord!(x#:0, None#🐩🛣️🥔) {
        return false;
    };
    match_fail!();
}
```
*/
export const hash_078ebb0c: <T>(arg_0: t_9854cdf0<T_0>) => boolean = <T>(x$0: t_9854cdf0<T_0>) => {
  if (x$0.type === "a0b4d1b4") {
    return true;
  }

  if (x$0.type === "280d2df4") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#340b0d4e = OptionOrTwice#58d5ae20<int#builtin>:y#668420b6
OptionOrTwice#🐻‍❄️💆🧖‍♂️😃<int>:y#🤳👨‍⚖️☘️😃
```
*/
export const hash_340b0d4e: t_58d5ae20<number> = hash_668420b6;

/**
```
const y1t#08fab53e = (y1#:0: OptionOrTwice#58d5ae20<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#3444f780{one#:1, two#:2} => one#:1 +#builtin two#:2,
    None#280d2df4 => 2,
    _ => 0,
}
(y1#:0: OptionOrTwice#🐻‍❄️💆🧖‍♂️😃<int>): int => {
    if isRecord!(y1#:0, Twice#🕖👳‍♂️🦽) {
        return y1#:0.#Twice#🕖👳‍♂️🦽#0 + y1#:0.#Twice#🕖👳‍♂️🦽#1;
    };
    if isRecord!(y1#:0, None#🐩🛣️🥔) {
        return 2;
    };
    return 0;
}
```
*/
export const hash_08fab53e: (arg_0: t_58d5ae20<number>) => number = (y1: t_58d5ae20<number>) => {
  if (y1.type === "3444f780") {
    return y1.h3444f780_0 + y1.h3444f780_1;
  }

  if (y1.type === "280d2df4") {
    return 2;
  }

  return 0;
};

/**
```
const y2#99ff79ce = OptionOrTwice#58d5ae20<int#builtin>:Twice#3444f780<int#builtin>{
    one#3444f780#0: 3,
    two#3444f780#1: 10,
}
OptionOrTwice#🐻‍❄️💆🧖‍♂️😃<int>:Twice#🕖👳‍♂️🦽{TODO SPREADs}{h3444f780_0: 3, h3444f780_1: 10}
```
*/
export const hash_99ff79ce: t_58d5ae20<number> = ({
  type: "3444f780",
  h3444f780_0: 3,
  h3444f780_1: 10
} as t_58d5ae20<number>);

/*
switch y2#99ff79ce {Twice#3444f780{one#:0, two#:1} => one#:0 +#builtin two#:1, _ => 0} 
    ==#6d46a318#3b6b23ae#0 13
assertCall(
    IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0,
    ((): int => {
        if isRecord!(y2#👪, Twice#🕖👳‍♂️🦽) {
            return y2#👪.#Twice#🕖👳‍♂️🦽#0 + y2#👪.#Twice#🕖👳‍♂️🦽#1;
        };
        return 0;
    })(),
    13,
)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, (() => {
  if (hash_99ff79ce.type === "3444f780") {
    return hash_99ff79ce.h3444f780_0 + hash_99ff79ce.h3444f780_1;
  }

  return 0;
})(), 13);

/*
y1t#08fab53e(y1#340b0d4e) ==#6d46a318#3b6b23ae#0 2
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, y1t#👳‍♀️🍘💣(y1#🤶🍧🚜), 2)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_08fab53e(hash_340b0d4e), 2);

/*
isPresent#078ebb0c<int#builtin>(
        x: Option#9854cdf0<int#builtin>:Some#a0b4d1b4<int#builtin>{value#a0b4d1b4#0: 3},
    ) 
    ==#builtin true
assertEqual(isPresent#💒☂️💗<int>(Option#🐶<int>:Some#🤽{TODO SPREADs}{ha0b4d1b4_0: 3}), true)
*/
assertEqual(hash_078ebb0c(({
  type: "a0b4d1b4",
  ha0b4d1b4_0: 3
} as t_9854cdf0<number>)), true);

/*
isPresent#078ebb0c<int#builtin>(x: Option#9854cdf0<int#builtin>:None#280d2df4) ==#builtin false
assertEqual(isPresent#💒☂️💗<int>(Option#🐶<int>:None#🐩🛣️🥔{TODO SPREADs}{}), false)
*/
assertEqual(hash_078ebb0c(({
  type: "280d2df4"
} as t_9854cdf0<number>)), false);

/*
getWithDefault#429d376a<int#builtin>(x: Option#9854cdf0<int#builtin>:None#280d2df4, default: 20) 
    ==#6d46a318#3b6b23ae#0 20
assertCall(
    IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0,
    getWithDefault#🧳🛢️🤥😃<int>(Option#🐶<int>:None#🐩🛣️🥔{TODO SPREADs}{}, 20),
    20,
)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_429d376a(({
  type: "280d2df4"
} as t_9854cdf0<number>), 20), 20);

/*
getWithDefault#429d376a<int#builtin>(
        x: Option#9854cdf0<int#builtin>:Some#a0b4d1b4<int#builtin>{value#a0b4d1b4#0: 3},
        default: 20,
    ) 
    ==#6d46a318#3b6b23ae#0 3
assertCall(
    IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0,
    getWithDefault#🧳🛢️🤥😃<int>(Option#🐶<int>:Some#🤽{TODO SPREADs}{ha0b4d1b4_0: 3}, 20),
    3,
)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_429d376a(({
  type: "a0b4d1b4",
  ha0b4d1b4_0: 3
} as t_9854cdf0<number>), 20), 3);

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
isSomeYes#07649480(
        v: Option#9854cdf0<string#builtin>:Some#a0b4d1b4<string#builtin>{value#a0b4d1b4#0: "yes"},
    ) 
    ==#builtin true
assertEqual(isSomeYes#🧡🧑‍✈️💝(Option#🐶<string>:Some#🤽{TODO SPREADs}{ha0b4d1b4_0: "yes"}), true)
*/
assertEqual(hash_07649480(({
  type: "a0b4d1b4",
  ha0b4d1b4_0: "yes"
} as t_9854cdf0<string>)), true);

/*
isNotFalse#0932d938(n: true) ==#builtin true
assertEqual(isNotFalse#👷‍♂️🤳🗯️(true), true)
*/
assertEqual(hash_0932d938(true), true);

/*
isAs#d18ba174(y#668420b6)
assertCall(isAs#🧍, y#🤳👨‍⚖️☘️😃)
*/
assertCall(hash_d18ba174, hash_668420b6);

/*
check#34e4fc8e(y1#340b0d4e)
assertCall(check#🕳️👲⛽, y1#🤶🍧🚜)
*/
assertCall(hash_34e4fc8e, hash_340b0d4e);