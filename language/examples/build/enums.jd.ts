import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type None#3903f090 = {}
```
*/
type t_3903f090 = {
  type: "3903f090";
};

/**
```
type Some#58d2adaa<T#:0> = {
    value: T#:0,
}
```
*/
type t_58d2adaa<T_0> = {
  type: "58d2adaa";
  h58d2adaa_0: T_0;
};

/**
```
type Twice#294413c2<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_294413c2<T_0> = {
  type: "294413c2";
  h294413c2_0: T_0;
  h294413c2_1: T_0;
};

/*enum Option#18208c90<T#:0> {
    Some#58d2adaa<T#:0>,
    None#3903f090,
}*/
type t_18208c90<T_0> = t_58d2adaa<T_0> | t_3903f090;

/*enum OptionOrTwice#3015bf1c<T#:0> {
    ...Option#18208c90<T#:0>,
    Twice#294413c2<T#:0>,
}*/
type t_3015bf1c<T_0> = t_294413c2<T_0> | t_58d2adaa<T_0> | t_3903f090;

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
const IntEq#9275f914 = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const StringEq#606c7034 = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/**
```
const y#1aa39702 = Option#18208c90<int>:None#3903f090
```
*/
export const hash_1aa39702: t_18208c90<number> = ({
  type: "3903f090"
} as t_18208c90<number>);

/**
```
const check#a29e5df8 = (y1#:0: OptionOrTwice#3015bf1c<int>): bool ={}> switch y1#:0 {
    Twice#294413c2{two: 5} => false,
    Twice#294413c2 => false,
    Option#18208c90 as x#:1 => switch x#:1 {Some#58d2adaa => false, None#3903f090 => true},
}
```
*/
export const hash_a29e5df8: (arg_0: t_3015bf1c<number>) => boolean = (y1: t_3015bf1c<number>) => {
  if (y1.type === "294413c2" && y1.h294413c2_1 === 5) {
    return false;
  }

  if (y1.type === "294413c2") {
    return false;
  }

  if (y1.type === "58d2adaa" || y1.type === "3903f090") {
    let x: t_3015bf1c<number> = y1;

    if (x.type === "58d2adaa") {
      return false;
    }

    if (x.type === "3903f090") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#54fd37b8 = (y#:0: Option#18208c90<int>): bool ={}> switch y#:0 {
    Some#58d2adaa as x#:1 => x#:1.value#58d2adaa#0 ==#9275f914#553b4b8e#0 2,
    None#3903f090 => true,
}
```
*/
export const hash_54fd37b8: (arg_0: t_18208c90<number>) => boolean = (y: t_18208c90<number>) => {
  if (y.type === "58d2adaa") {
    return hash_9275f914.h553b4b8e_0(y.h58d2adaa_0, 2);
  }

  if (y.type === "3903f090") {
    return true;
  }

  throw "Math failed";
};

/**
```
const isNotFalse#7caa41a0 = (n#:0: bool): bool ={}> switch n#:0 {false => false, _#:1 => true}
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
const isSomeYes#4f2d2f18 = (v#:0: Option#18208c90<string>): bool ={}> switch v#:0 {
    Some#58d2adaa{value: "no"} => false,
    None#3903f090 => false,
    Some#58d2adaa{value: v#:1} => v#:1 ==#606c7034#553b4b8e#0 "yes",
}
```
*/
export const hash_4f2d2f18: (arg_0: t_18208c90<string>) => boolean = (v: t_18208c90<string>) => {
  if (v.type === "58d2adaa" && v.h58d2adaa_0 === "no") {
    return false;
  }

  if (v.type === "3903f090") {
    return false;
  }

  if (v.type === "58d2adaa") {
    return hash_606c7034.h553b4b8e_0(v.h58d2adaa_0, "yes");
  }

  throw "Math failed";
};

/**
```
const isTen#5768cc58 = (n#:0: int): bool ={}> switch n#:0 {4 => false, 10 => true, _#:1 => false}
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
const getWithDefault#5fc3b398 = <T#:0>(x#:0: Option#18208c90<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#58d2adaa{value: v#:2} => v#:2, None#3903f090 => default#:1};
}
```
*/
export const hash_5fc3b398: <T_0>(arg_0: t_18208c90<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_18208c90<T_0>, default$1: T_0) => {
  if (x$0.type === "58d2adaa") {
    return x$0.h58d2adaa_0;
  }

  if (x$0.type === "3903f090") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#654f2202 = <T#:0>(x#:0: Option#18208c90<T#:0>): bool ={}> {
    switch x#:0 {Some#58d2adaa => true, None#3903f090 => false};
}
```
*/
export const hash_654f2202: <T_0>(arg_0: t_18208c90<T_0>) => boolean = <T_0>(x$0: t_18208c90<T_0>) => {
  if (x$0.type === "58d2adaa") {
    return true;
  }

  if (x$0.type === "3903f090") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#52874b44 = OptionOrTwice#3015bf1c<int>:y#1aa39702
```
*/
export const hash_52874b44: t_3015bf1c<number> = hash_1aa39702;

/**
```
const y1t#39a7754c = (y1#:0: OptionOrTwice#3015bf1c<int>): int ={}> switch y1#:0 {
    Twice#294413c2{one: one#:1, two: two#:2} => one#:1 + two#:2,
    None#3903f090 => 2,
    _#:3 => 0,
}
```
*/
export const hash_39a7754c: (arg_0: t_3015bf1c<number>) => number = (y1: t_3015bf1c<number>) => {
  if (y1.type === "294413c2") {
    return y1.h294413c2_0 + y1.h294413c2_1;
  }

  if (y1.type === "3903f090") {
    return 2;
  }

  return 0;
};

/**
```
const y2#02c58cda = OptionOrTwice#3015bf1c<int>:Twice#294413c2<int>{
    one#294413c2#0: 3,
    two#294413c2#1: 10,
}
```
*/
export const hash_02c58cda: t_3015bf1c<number> = ({
  type: "294413c2",
  h294413c2_0: 3,
  h294413c2_1: 10
} as t_3015bf1c<number>);

/*
switch y2#02c58cda {Twice#294413c2{one: one#:0, two: two#:1} => one#:0 + two#:1, _#:2 => 0} ==#9275f914#553b4b8e#0 13
*/
assertCall(hash_9275f914.h553b4b8e_0, (() => {
  if (hash_02c58cda.type === "294413c2") {
    return hash_02c58cda.h294413c2_0 + hash_02c58cda.h294413c2_1;
  }

  return 0;
})(), 13);

/*
y1t#39a7754c(y1#52874b44) ==#9275f914#553b4b8e#0 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_39a7754c(hash_52874b44), 2);

/*
isPresent#654f2202<int>(Option#18208c90<int>:Some#58d2adaa<int>{value#58d2adaa#0: 3}) == true
*/
assertEqual(hash_654f2202(({
  type: "58d2adaa",
  h58d2adaa_0: 3
} as t_18208c90<number>)), true);

/*
isPresent#654f2202<int>(Option#18208c90<int>:None#3903f090) == false
*/
assertEqual(hash_654f2202(({
  type: "3903f090"
} as t_18208c90<number>)), false);

/*
getWithDefault#5fc3b398<int>(Option#18208c90<int>:None#3903f090, 20) ==#9275f914#553b4b8e#0 20
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5fc3b398(({
  type: "3903f090"
} as t_18208c90<number>), 20), 20);

/*
getWithDefault#5fc3b398<int>(Option#18208c90<int>:Some#58d2adaa<int>{value#58d2adaa#0: 3}, 20) ==#9275f914#553b4b8e#0 3
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5fc3b398(({
  type: "58d2adaa",
  h58d2adaa_0: 3
} as t_18208c90<number>), 20), 3);

/*
isTen#5768cc58(10) == true
*/
assertEqual(hash_5768cc58(10), true);

/*
isSomeYes#4f2d2f18(Option#18208c90<string>:Some#58d2adaa<string>{value#58d2adaa#0: "yes"}) == true
*/
assertEqual(hash_4f2d2f18(({
  type: "58d2adaa",
  h58d2adaa_0: "yes"
} as t_18208c90<string>)), true);

/*
isNotFalse#7caa41a0(true) == true
*/
assertEqual(hash_7caa41a0(true), true);

/*
isAs#54fd37b8(y#1aa39702)
*/
assertCall(hash_54fd37b8, hash_1aa39702);

/*
check#a29e5df8(y1#52874b44)
*/
assertCall(hash_a29e5df8, hash_52874b44);