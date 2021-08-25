import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type None#3183a2ff = {}
```
*/
type t_3183a2ff = {
  type: "3183a2ff";
};

/**
```
type Some#62b2859e<T#:0> = {
    value: T#:0,
}
```
*/
type t_62b2859e<T_0> = {
  type: "62b2859e";
  h62b2859e_0: T_0;
};

/**
```
type Twice#1d60b725<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_1d60b725<T_0> = {
  type: "1d60b725";
  h1d60b725_0: T_0;
  h1d60b725_1: T_0;
};

/*enum Option#0bfc15ce<T#:0> {
    Some#62b2859e<T#:0>,
    None#3183a2ff,
}*/
type t_0bfc15ce<T_0> = t_62b2859e<T_0> | t_3183a2ff;

/*enum OptionOrTwice#3ad4fd70<T#:0> {
    ...Option#0bfc15ce<T#:0>,
    Twice#1d60b725<T#:0>,
}*/
type t_3ad4fd70<T_0> = t_1d60b725<T_0> | t_62b2859e<T_0> | t_3183a2ff;

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const StringEq#606c7034 = Eq#553b4b8e<string#builtin>{"=="#553b4b8e#0: stringEq#builtin}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/**
```
const y#737d344c = Option#0bfc15ce<int#builtin>:None#3183a2ff
```
*/
export const hash_737d344c: t_0bfc15ce<number> = ({
  type: "3183a2ff"
} as t_0bfc15ce<number>);

/**
```
const check#32879bc4 = (y1#:0: OptionOrTwice#3ad4fd70<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#1d60b725{two: 5} => false,
    Twice#1d60b725 => false,
    Option#0bfc15ce as x#:1 => switch x#:1 {Some#62b2859e => false, None#3183a2ff => true},
}
```
*/
export const hash_32879bc4: (arg_0: t_3ad4fd70<number>) => boolean = (y1: t_3ad4fd70<number>) => {
  if (y1.type === "1d60b725" && y1.h1d60b725_1 === 5) {
    return false;
  }

  if (y1.type === "1d60b725") {
    return false;
  }

  if (y1.type === "62b2859e" || y1.type === "3183a2ff") {
    let x: t_3ad4fd70<number> = y1;

    if (x.type === "62b2859e") {
      return false;
    }

    if (x.type === "3183a2ff") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#40af7fcc = (y#:0: Option#0bfc15ce<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#62b2859e as x#:1 => x#:1.value#62b2859e#0 ==#9275f914#553b4b8e#0 2,
    None#3183a2ff => true,
}
```
*/
export const hash_40af7fcc: (arg_0: t_0bfc15ce<number>) => boolean = (y: t_0bfc15ce<number>) => {
  if (y.type === "62b2859e") {
    return hash_9275f914.h553b4b8e_0(y.h62b2859e_0, 2);
  }

  if (y.type === "3183a2ff") {
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
const isSomeYes#6373eee0 = (v#:0: Option#0bfc15ce<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#62b2859e{value: "no"} => false,
    None#3183a2ff => false,
    Some#62b2859e{value: v#:1} => v#:1 ==#606c7034#553b4b8e#0 "yes",
}
```
*/
export const hash_6373eee0: (arg_0: t_0bfc15ce<string>) => boolean = (v: t_0bfc15ce<string>) => {
  if (v.type === "62b2859e" && v.h62b2859e_0 === "no") {
    return false;
  }

  if (v.type === "3183a2ff") {
    return false;
  }

  if (v.type === "62b2859e") {
    return hash_606c7034.h553b4b8e_0(v.h62b2859e_0, "yes");
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
const getWithDefault#3e408efe = <T#:0>(x#:0: Option#0bfc15ce<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#62b2859e{value: v#:2} => v#:2, None#3183a2ff => default#:1};
}
```
*/
export const hash_3e408efe: <T_0>(arg_0: t_0bfc15ce<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_0bfc15ce<T_0>, default$1: T_0) => {
  if (x$0.type === "62b2859e") {
    return x$0.h62b2859e_0;
  }

  if (x$0.type === "3183a2ff") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#f7321534 = <T#:0>(x#:0: Option#0bfc15ce<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#62b2859e => true, None#3183a2ff => false};
}
```
*/
export const hash_f7321534: <T_0>(arg_0: t_0bfc15ce<T_0>) => boolean = <T_0>(x$0: t_0bfc15ce<T_0>) => {
  if (x$0.type === "62b2859e") {
    return true;
  }

  if (x$0.type === "3183a2ff") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#6d8ca0c4 = OptionOrTwice#3ad4fd70<int#builtin>:y#737d344c
```
*/
export const hash_6d8ca0c4: t_3ad4fd70<number> = hash_737d344c;

/**
```
const y1t#3c690c4b = (y1#:0: OptionOrTwice#3ad4fd70<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#1d60b725{one: one#:1, two: two#:2} => one#:1 +#builtin two#:2,
    None#3183a2ff => 2,
    _ => 0,
}
```
*/
export const hash_3c690c4b: (arg_0: t_3ad4fd70<number>) => number = (y1: t_3ad4fd70<number>) => {
  if (y1.type === "1d60b725") {
    return y1.h1d60b725_0 + y1.h1d60b725_1;
  }

  if (y1.type === "3183a2ff") {
    return 2;
  }

  return 0;
};

/**
```
const y2#3a219bee = OptionOrTwice#3ad4fd70<int#builtin>:Twice#1d60b725<int#builtin>{
    one#1d60b725#0: 3,
    two#1d60b725#1: 10,
}
```
*/
export const hash_3a219bee: t_3ad4fd70<number> = ({
  type: "1d60b725",
  h1d60b725_0: 3,
  h1d60b725_1: 10
} as t_3ad4fd70<number>);

/*
switch y2#3a219bee {Twice#1d60b725{one: one#:0, two: two#:1} => one#:0 +#builtin two#:1, _ => 0} 
    ==#9275f914#553b4b8e#0 13
*/
assertCall(hash_9275f914.h553b4b8e_0, (() => {
  if (hash_3a219bee.type === "1d60b725") {
    return hash_3a219bee.h1d60b725_0 + hash_3a219bee.h1d60b725_1;
  }

  return 0;
})(), 13);

/*
y1t#3c690c4b(y1#6d8ca0c4) ==#9275f914#553b4b8e#0 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_3c690c4b(hash_6d8ca0c4), 2);

/*
isPresent#f7321534<int#builtin>(
        x: Option#0bfc15ce<int#builtin>:Some#62b2859e<int#builtin>{value#62b2859e#0: 3},
    ) 
    ==#builtin true
*/
assertEqual(hash_f7321534(({
  type: "62b2859e",
  h62b2859e_0: 3
} as t_0bfc15ce<number>)), true);

/*
isPresent#f7321534<int#builtin>(x: Option#0bfc15ce<int#builtin>:None#3183a2ff) ==#builtin false
*/
assertEqual(hash_f7321534(({
  type: "3183a2ff"
} as t_0bfc15ce<number>)), false);

/*
getWithDefault#3e408efe<int#builtin>(x: Option#0bfc15ce<int#builtin>:None#3183a2ff, default: 20) 
    ==#9275f914#553b4b8e#0 20
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_3e408efe(({
  type: "3183a2ff"
} as t_0bfc15ce<number>), 20), 20);

/*
getWithDefault#3e408efe<int#builtin>(
        x: Option#0bfc15ce<int#builtin>:Some#62b2859e<int#builtin>{value#62b2859e#0: 3},
        default: 20,
    ) 
    ==#9275f914#553b4b8e#0 3
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_3e408efe(({
  type: "62b2859e",
  h62b2859e_0: 3
} as t_0bfc15ce<number>), 20), 3);

/*
switch None#3183a2ff {None#3183a2ff => true}
*/
assert((() => {
  if (({
    type: "3183a2ff"
  } as t_3183a2ff).type === "3183a2ff") {
    return true;
  }

  throw "Math failed";
})());

/*
isTen#1dfd6720(n: 10) ==#builtin true
*/
assertEqual(hash_1dfd6720(10), true);

/*
isSomeYes#6373eee0(
        v: Option#0bfc15ce<string#builtin>:Some#62b2859e<string#builtin>{value#62b2859e#0: "yes"},
    ) 
    ==#builtin true
*/
assertEqual(hash_6373eee0(({
  type: "62b2859e",
  h62b2859e_0: "yes"
} as t_0bfc15ce<string>)), true);

/*
isNotFalse#28f05e73(n: true) ==#builtin true
*/
assertEqual(hash_28f05e73(true), true);

/*
isAs#40af7fcc(y#737d344c)
*/
assertCall(hash_40af7fcc, hash_737d344c);

/*
check#32879bc4(y1#6d8ca0c4)
*/
assertCall(hash_32879bc4, hash_6d8ca0c4);