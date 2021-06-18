import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type None#d1d0008c = {}
```
*/
type t_d1d0008c = {
  type: "d1d0008c";
};

/**
```
type Some#d5b172b8<T#:0> = {
    value: T#:0,
}
```
*/
type t_d5b172b8<T_0> = {
  type: "d5b172b8";
  hd5b172b8_0: T_0;
};

/**
```
type Twice#66dd537e<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_66dd537e<T_0> = {
  type: "66dd537e";
  h66dd537e_0: T_0;
  h66dd537e_1: T_0;
};

/*enum Option#5d5eeefc<T#:0> {
    Some#d5b172b8<T#:0>,
    None#d1d0008c,
}*/
type t_5d5eeefc<T_0> = t_d5b172b8<T_0> | t_d1d0008c;

/*enum OptionOrTwice#dc0f4938<T#:0> {
    ...Option#5d5eeefc<T#:0>,
    Twice#66dd537e<T#:0>,
}*/
type t_dc0f4938<T_0> = t_66dd537e<T_0> | t_d5b172b8<T_0> | t_d1d0008c;

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
const y#e5c5b134 = Option#5d5eeefc<int#builtin>:None#d1d0008c
```
*/
export const hash_e5c5b134: t_5d5eeefc<number> = ({
  type: "d1d0008c"
} as t_5d5eeefc<number>);

/**
```
const check#56e2ea7b = (y1#:0: OptionOrTwice#dc0f4938<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#66dd537e{two: 5} => false,
    Twice#66dd537e => false,
    Option#5d5eeefc as x#:1 => switch x#:1 {Some#d5b172b8 => false, None#d1d0008c => true},
}
```
*/
export const hash_56e2ea7b: (arg_0: t_dc0f4938<number>) => boolean = (y1: t_dc0f4938<number>) => {
  if (y1.type === "66dd537e" && y1.h66dd537e_1 === 5) {
    return false;
  }

  if (y1.type === "66dd537e") {
    return false;
  }

  if (y1.type === "d5b172b8" || y1.type === "d1d0008c") {
    let x: t_dc0f4938<number> = y1;

    if (x.type === "d5b172b8") {
      return false;
    }

    if (x.type === "d1d0008c") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#551a37fb = (y#:0: Option#5d5eeefc<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#d5b172b8 as x#:1 => x#:1.value#d5b172b8#0 ==#9275f914#553b4b8e#0 2,
    None#d1d0008c => true,
}
```
*/
export const hash_551a37fb: (arg_0: t_5d5eeefc<number>) => boolean = (y: t_5d5eeefc<number>) => {
  if (y.type === "d5b172b8") {
    return hash_9275f914.h553b4b8e_0(y.hd5b172b8_0, 2);
  }

  if (y.type === "d1d0008c") {
    return true;
  }

  throw "Math failed";
};

/**
```
const isNotFalse#7caa41a0 = (n#:0: bool#builtin): bool#builtin ={}> switch n#:0 {
    false => false,
    _#:1 => true,
}
```
*/
export const hash_7caa41a0: (arg_0: boolean) => boolean = (n: boolean) => {
  if (n === false) {
    return false;
  }

  return true;
};

/**
```
const isSomeYes#2a82c352 = (v#:0: Option#5d5eeefc<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#d5b172b8{value: "no"} => false,
    None#d1d0008c => false,
    Some#d5b172b8{value: v#:1} => v#:1 ==#606c7034#553b4b8e#0 "yes",
}
```
*/
export const hash_2a82c352: (arg_0: t_5d5eeefc<string>) => boolean = (v: t_5d5eeefc<string>) => {
  if (v.type === "d5b172b8" && v.hd5b172b8_0 === "no") {
    return false;
  }

  if (v.type === "d1d0008c") {
    return false;
  }

  if (v.type === "d5b172b8") {
    return hash_606c7034.h553b4b8e_0(v.hd5b172b8_0, "yes");
  }

  throw "Math failed";
};

/**
```
const isTen#5768cc58 = (n#:0: int#builtin): bool#builtin ={}> switch n#:0 {
    4 => false,
    10 => true,
    _#:1 => false,
}
```
*/
export const hash_5768cc58: (arg_0: number) => boolean = (n: number) => {
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
const getWithDefault#d31a802a = <T#:0>(x#:0: Option#5d5eeefc<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#d5b172b8{value: v#:2} => v#:2, None#d1d0008c => default#:1};
}
```
*/
export const hash_d31a802a: <T_0>(arg_0: t_5d5eeefc<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_5d5eeefc<T_0>, default$1: T_0) => {
  if (x$0.type === "d5b172b8") {
    return x$0.hd5b172b8_0;
  }

  if (x$0.type === "d1d0008c") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#51d85674 = <T#:0>(x#:0: Option#5d5eeefc<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#d5b172b8 => true, None#d1d0008c => false};
}
```
*/
export const hash_51d85674: <T_0>(arg_0: t_5d5eeefc<T_0>) => boolean = <T_0>(x$0: t_5d5eeefc<T_0>) => {
  if (x$0.type === "d5b172b8") {
    return true;
  }

  if (x$0.type === "d1d0008c") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#60b21ed9 = OptionOrTwice#dc0f4938<int#builtin>:y#e5c5b134
```
*/
export const hash_60b21ed9: t_dc0f4938<number> = hash_e5c5b134;

/**
```
const y1t#6a4f6f96 = (y1#:0: OptionOrTwice#dc0f4938<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#66dd537e{one: one#:1, two: two#:2} => one#:1 +#builtin two#:2,
    None#d1d0008c => 2,
    _#:3 => 0,
}
```
*/
export const hash_6a4f6f96: (arg_0: t_dc0f4938<number>) => number = (y1: t_dc0f4938<number>) => {
  if (y1.type === "66dd537e") {
    return y1.h66dd537e_0 + y1.h66dd537e_1;
  }

  if (y1.type === "d1d0008c") {
    return 2;
  }

  return 0;
};

/**
```
const y2#4bcb9ac6 = OptionOrTwice#dc0f4938<int#builtin>:Twice#66dd537e<int#builtin>{
    one#66dd537e#0: 3,
    two#66dd537e#1: 10,
}
```
*/
export const hash_4bcb9ac6: t_dc0f4938<number> = ({
  type: "66dd537e",
  h66dd537e_0: 3,
  h66dd537e_1: 10
} as t_dc0f4938<number>);

/*
switch y2#4bcb9ac6 {Twice#66dd537e{one: one#:0, two: two#:1} => one#:0 +#builtin two#:1, _#:2 => 0} 
    ==#9275f914#553b4b8e#0 13
*/
assertCall(hash_9275f914.h553b4b8e_0, (() => {
  if (hash_4bcb9ac6.type === "66dd537e") {
    return hash_4bcb9ac6.h66dd537e_0 + hash_4bcb9ac6.h66dd537e_1;
  }

  return 0;
})(), 13);

/*
y1t#6a4f6f96(y1#60b21ed9) ==#9275f914#553b4b8e#0 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_6a4f6f96(hash_60b21ed9), 2);

/*
isPresent#51d85674<int#builtin>(
        x: Option#5d5eeefc<int#builtin>:Some#d5b172b8<int#builtin>{value#d5b172b8#0: 3},
    ) 
    ==#builtin true
*/
assertEqual(hash_51d85674(({
  type: "d5b172b8",
  hd5b172b8_0: 3
} as t_5d5eeefc<number>)), true);

/*
isPresent#51d85674<int#builtin>(x: Option#5d5eeefc<int#builtin>:None#d1d0008c) ==#builtin false
*/
assertEqual(hash_51d85674(({
  type: "d1d0008c"
} as t_5d5eeefc<number>)), false);

/*
getWithDefault#d31a802a<int#builtin>(x: Option#5d5eeefc<int#builtin>:None#d1d0008c, default: 20) 
    ==#9275f914#553b4b8e#0 20
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_d31a802a(({
  type: "d1d0008c"
} as t_5d5eeefc<number>), 20), 20);

/*
getWithDefault#d31a802a<int#builtin>(
        x: Option#5d5eeefc<int#builtin>:Some#d5b172b8<int#builtin>{value#d5b172b8#0: 3},
        default: 20,
    ) 
    ==#9275f914#553b4b8e#0 3
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_d31a802a(({
  type: "d5b172b8",
  hd5b172b8_0: 3
} as t_5d5eeefc<number>), 20), 3);

/*
isTen#5768cc58(n: 10) ==#builtin true
*/
assertEqual(hash_5768cc58(10), true);

/*
isSomeYes#2a82c352(
        v: Option#5d5eeefc<string#builtin>:Some#d5b172b8<string#builtin>{value#d5b172b8#0: "yes"},
    ) 
    ==#builtin true
*/
assertEqual(hash_2a82c352(({
  type: "d5b172b8",
  hd5b172b8_0: "yes"
} as t_5d5eeefc<string>)), true);

/*
isNotFalse#7caa41a0(n: true) ==#builtin true
*/
assertEqual(hash_7caa41a0(true), true);

/*
isAs#551a37fb(y#e5c5b134)
*/
assertCall(hash_551a37fb, hash_e5c5b134);

/*
check#56e2ea7b(y1#60b21ed9)
*/
assertCall(hash_56e2ea7b, hash_60b21ed9);