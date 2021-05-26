import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type None#24ef3f16 = {}
```
*/
type t_24ef3f16 = {
  type: "24ef3f16";
};

/**
```
type Some#1634a9ca<T#:0> = {
    value: T#:0,
}
```
*/
type t_1634a9ca<T_0> = {
  type: "1634a9ca";
  h1634a9ca_0: T_0;
};

/**
```
type Twice#4bb04994<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_4bb04994<T_0> = {
  type: "4bb04994";
  h4bb04994_0: T_0;
  h4bb04994_1: T_0;
};

/*enum Option#803bbb68<T#:0> {
    Some#1634a9ca<T#:0>,
    None#24ef3f16,
}*/
type t_803bbb68<T_0> = t_1634a9ca<T_0> | t_24ef3f16;

/*enum OptionOrTwice#b4ec7260<T#:0> {
    ...Option#803bbb68<T#:0>,
    Twice#4bb04994<T#:0>,
}*/
type t_b4ec7260<T_0> = t_4bb04994<T_0> | t_1634a9ca<T_0> | t_24ef3f16;

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const IntEq#9275f914: Eq#553b4b8e<int> = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const StringEq#606c7034: Eq#553b4b8e<string> = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/**
```
const y#75e5fb91: Option#803bbb68<int> = Option#803bbb68<int>:None#24ef3f16
```
*/
export const hash_75e5fb91: t_803bbb68<number> = ({
  type: "24ef3f16"
} as t_803bbb68<number>);

/**
```
const check#d9b1cc82: (OptionOrTwice#b4ec7260<int>) ={}> bool = (y1#:0: OptionOrTwice#b4ec7260<int>) ={}> switch y1#:0 {
    Twice#4bb04994{two: 5} => false,
    Twice#4bb04994 => false,
    Option#803bbb68 as x#:1 => switch x#:1 {Some#1634a9ca => false, None#24ef3f16 => true},
}
```
*/
export const hash_d9b1cc82: (arg_0: t_b4ec7260<number>) => boolean = (y1: t_b4ec7260<number>) => {
  if (y1.type === "4bb04994" && y1.h4bb04994_1 === 5) {
    return false;
  }

  if (y1.type === "4bb04994") {
    return false;
  }

  if (y1.type === "1634a9ca" || y1.type === "24ef3f16") {
    let x: t_b4ec7260<number> = y1;

    if (x.type === "1634a9ca") {
      return false;
    }

    if (x.type === "24ef3f16") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#690ca0da: (Option#803bbb68<int>) ={}> bool = (y#:0: Option#803bbb68<int>) ={}> switch y#:0 {
    Some#1634a9ca as x#:1 => IntEq#9275f914."=="#553b4b8e#0(x#:1.value#1634a9ca#0, 2),
    None#24ef3f16 => true,
}
```
*/
export const hash_690ca0da: (arg_0: t_803bbb68<number>) => boolean = (y: t_803bbb68<number>) => {
  if (y.type === "1634a9ca") {
    return hash_9275f914.h553b4b8e_0(y.h1634a9ca_0, 2);
  }

  if (y.type === "24ef3f16") {
    return true;
  }

  throw "Math failed";
};

/**
```
const isNotFalse#7caa41a0: (bool) ={}> bool = (n#:0: bool) ={}> switch n#:0 {
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
const isSomeYes#c607d920: (Option#803bbb68<string>) ={}> bool = (v#:0: Option#803bbb68<string>) ={}> switch v#:0 {
    Some#1634a9ca{value: "no"} => false,
    None#24ef3f16 => false,
    Some#1634a9ca{value: v#:1} => StringEq#606c7034."=="#553b4b8e#0(v#:1, "yes"),
}
```
*/
export const hash_c607d920: (arg_0: t_803bbb68<string>) => boolean = (v: t_803bbb68<string>) => {
  if (v.type === "1634a9ca" && v.h1634a9ca_0 === "no") {
    return false;
  }

  if (v.type === "24ef3f16") {
    return false;
  }

  if (v.type === "1634a9ca") {
    return hash_606c7034.h553b4b8e_0(v.h1634a9ca_0, "yes");
  }

  throw "Math failed";
};

/**
```
const isTen#5768cc58: (int) ={}> bool = (n#:0: int) ={}> switch n#:0 {
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
const getWithDefault#44e510ea: <T#:0>(Option#803bbb68<T#:0>, T#:0) ={}> T#:0 = <T#:0>(
    x#:0: Option#803bbb68<T#:0>,
    default#:1: T#:0,
) ={}> {
    switch x#:0 {Some#1634a9ca{value: v#:2} => v#:2, None#24ef3f16 => default#:1};
}
```
*/
export const hash_44e510ea: <T_0>(arg_0: t_803bbb68<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_803bbb68<T_0>, default$1: T_0) => {
  if (x$0.type === "1634a9ca") {
    return x$0.h1634a9ca_0;
  }

  if (x$0.type === "24ef3f16") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#474c9033: <T#:0>(Option#803bbb68<T#:0>) ={}> bool = <T#:0>(
    x#:0: Option#803bbb68<T#:0>,
) ={}> {
    switch x#:0 {Some#1634a9ca => true, None#24ef3f16 => false};
}
```
*/
export const hash_474c9033: <T_0>(arg_0: t_803bbb68<T_0>) => boolean = <T_0>(x$0: t_803bbb68<T_0>) => {
  if (x$0.type === "1634a9ca") {
    return true;
  }

  if (x$0.type === "24ef3f16") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#2162b482: OptionOrTwice#b4ec7260<int> = OptionOrTwice#b4ec7260<int>:y#75e5fb91
```
*/
export const hash_2162b482: t_b4ec7260<number> = hash_75e5fb91;

/**
```
const y1t#f2c89fec: (OptionOrTwice#b4ec7260<int>) ={}> int = (y1#:0: OptionOrTwice#b4ec7260<int>) ={}> switch y1#:0 {
    Twice#4bb04994{one: one#:1, two: two#:2} => (one#:1 + two#:2),
    None#24ef3f16 => 2,
    _#:3 => 0,
}
```
*/
export const hash_f2c89fec: (arg_0: t_b4ec7260<number>) => number = (y1: t_b4ec7260<number>) => {
  if (y1.type === "4bb04994") {
    return y1.h4bb04994_0 + y1.h4bb04994_1;
  }

  if (y1.type === "24ef3f16") {
    return 2;
  }

  return 0;
};

/**
```
const y2#45b1d51e: OptionOrTwice#b4ec7260<int> = OptionOrTwice#b4ec7260<int>:Twice#4bb04994<int>{
    one#4bb04994#0: 3,
    two#4bb04994#1: 10,
}
```
*/
export const hash_45b1d51e: t_b4ec7260<number> = ({
  type: "4bb04994",
  h4bb04994_0: 3,
  h4bb04994_1: 10
} as t_b4ec7260<number>);

/*
IntEq#9275f914."=="#553b4b8e#0(
    switch y2#45b1d51e {Twice#4bb04994{one: one#:0, two: two#:1} => (one#:0 + two#:1), _#:2 => 0},
    13,
)
*/
assertCall(hash_9275f914.h553b4b8e_0, (() => {
  if (hash_45b1d51e.type === "4bb04994") {
    return hash_45b1d51e.h4bb04994_0 + hash_45b1d51e.h4bb04994_1;
  }

  return 0;
})(), 13);

/*
IntEq#9275f914."=="#553b4b8e#0(y1t#f2c89fec(y1#2162b482), 2)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_f2c89fec(hash_2162b482), 2);

/*
(isPresent#474c9033<int>(Option#803bbb68<int>:Some#1634a9ca<int>{value#1634a9ca#0: 3}) == true)
*/
assertEqual(hash_474c9033(({
  type: "1634a9ca",
  h1634a9ca_0: 3
} as t_803bbb68<number>)), true);

/*
(isPresent#474c9033<int>(Option#803bbb68<int>:None#24ef3f16) == false)
*/
assertEqual(hash_474c9033(({
  type: "24ef3f16"
} as t_803bbb68<number>)), false);

/*
IntEq#9275f914."=="#553b4b8e#0(
    getWithDefault#44e510ea<int>(Option#803bbb68<int>:None#24ef3f16, 20),
    20,
)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_44e510ea(({
  type: "24ef3f16"
} as t_803bbb68<number>), 20), 20);

/*
IntEq#9275f914."=="#553b4b8e#0(
    getWithDefault#44e510ea<int>(Option#803bbb68<int>:Some#1634a9ca<int>{value#1634a9ca#0: 3}, 20),
    3,
)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_44e510ea(({
  type: "1634a9ca",
  h1634a9ca_0: 3
} as t_803bbb68<number>), 20), 3);

/*
(isTen#5768cc58(10) == true)
*/
assertEqual(hash_5768cc58(10), true);

/*
(isSomeYes#c607d920(Option#803bbb68<string>:Some#1634a9ca<string>{value#1634a9ca#0: "yes"}) == true)
*/
assertEqual(hash_c607d920(({
  type: "1634a9ca",
  h1634a9ca_0: "yes"
} as t_803bbb68<string>)), true);

/*
(isNotFalse#7caa41a0(true) == true)
*/
assertEqual(hash_7caa41a0(true), true);

/*
isAs#690ca0da(y#75e5fb91)
*/
assertCall(hash_690ca0da, hash_75e5fb91);

/*
check#d9b1cc82(y1#2162b482)
*/
assertCall(hash_d9b1cc82, hash_2162b482);