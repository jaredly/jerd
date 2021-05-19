import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/*enum Option#45258310<T#:0> {
    Some#0043a33c<T#:0>,
    None#2449af94,
}*/
type t_45258310<T_0> = t_0043a33c<T_0> | t_2449af94;

/**
```
type As#As<T#:10000, T#:10001> = {
    as: (T#:10000) ={}> Y#:10001,
}
```
*/
type t_As<T_10000, T_10001> = {
  type: "As";
  hAs_0: (arg_0: T_10000) => T_10001;
};

/**
```
type None#None = {}
```
*/
type t_None = {
  type: "None";
};

/**
```
type Some#Some<T#:10000> = {
    contents: T#:10000,
}
```
*/
type t_Some<T_10000> = {
  type: "Some";
  hSome_0: T_10000;
};

/**
```
type ToStr#b416ead2<T#:0> = {
    str: (T#:0) ={}> string,
}
```
*/
type t_b416ead2<T_0> = {
  type: "b416ead2";
  hb416ead2_0: (arg_0: T_0) => string;
};

/**
```
type ToFloat#c13d2c8a<T#:0> = {
    float: (T#:0) ={}> float,
}
```
*/
type t_c13d2c8a<T_0> = {
  type: "c13d2c8a";
  hc13d2c8a_0: (arg_0: T_0) => number;
};

/**
```
type ToInt#c5d60378<T#:0> = {
    int: (T#:0) ={}> int,
}
```
*/
type t_c5d60378<T_0> = {
  type: "c5d60378";
  hc5d60378_0: (arg_0: T_0) => number;
};

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
@ffi type Vec2#43802a16 = {
    x: float,
    y: float,
}
```
*/
type t_43802a16 = {
  type: "Vec2";
  x: number;
  y: number;
};

/**
```
@ffi type Vec3#9f1c0644 = {
    ...Vec2#43802a16,
    z: float,
}
```
*/
type t_9f1c0644 = {
  type: "Vec3";
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi type Vec4#3b941378 = {
    ...Vec3#9f1c0644,
    w: float,
}
```
*/
type t_3b941378 = {
  type: "Vec4";
  w: number;
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi type Mat4#d92781e8 = {
    r1: Vec4#3b941378,
    r2: Vec4#3b941378,
    r3: Vec4#3b941378,
    r4: Vec4#3b941378,
}
```
*/
type t_d92781e8 = {
  type: "Mat4";
  r1: t_3b941378;
  r2: t_3b941378;
  r3: t_3b941378;
  r4: t_3b941378;
};

/**
```
type AddSub#b99b22d8<T#:0, T#:1, T#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_b99b22d8<T_0, T_1, T_2> = {
  type: "b99b22d8";
  hb99b22d8_0: (arg_0: T_0, arg_1: T_1) => T_2;
  hb99b22d8_1: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Mul#1de4e4c0<T#:0, T#:1, T#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_1de4e4c0<T_0, T_1, T_2> = {
  type: "1de4e4c0";
  h1de4e4c0_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Div#5ac12902<T#:0, T#:1, T#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_5ac12902<T_0, T_1, T_2> = {
  type: "5ac12902";
  h5ac12902_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Id#ef65b416 = {
    hash: string,
    size: int,
    pos: int,
}
```
*/
type t_ef65b416 = {
  type: "ef65b416";
  hef65b416_0: string;
  hef65b416_1: number;
  hef65b416_2: number;
};

/**
```
type Some#0043a33c<T#:0> = {
    value: T#:0,
}
```
*/
type t_0043a33c<T_0> = {
  type: "0043a33c";
  h0043a33c_0: T_0;
};

/**
```
type None#2449af94 = {}
```
*/
type t_2449af94 = {
  type: "2449af94";
};

/**
```
type Twice#70487bcc<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_70487bcc<T_0> = {
  type: "70487bcc";
  h70487bcc_0: T_0;
  h70487bcc_1: T_0;
};

/*enum OptionOrTwice#d0eff35c<T#:0> {
    ...Option#45258310<T#:0>,
    Twice#70487bcc<T#:0>,
}*/
type t_d0eff35c<T_0> = t_70487bcc<T_0> | t_0043a33c<T_0> | t_2449af94;

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
const y#1878539c: Option#45258310<int> = Option#45258310<int>:None#2449af94
```
*/
export const hash_1878539c: t_45258310<number> = ({
  type: "2449af94"
} as t_45258310<number>);

/**
```
const check#752b5f22: (OptionOrTwice#d0eff35c<int>) ={}> bool = (y1#:0: OptionOrTwice#d0eff35c<int>) ={}> switch y1#:0 {
    Twice#70487bcc{two: 5} => false,
    Twice#70487bcc => false,
    Option#45258310 as x#:1 => switch x#:1 {Some#0043a33c => false, None#2449af94 => true},
}
```
*/
export const hash_752b5f22: (arg_0: t_d0eff35c<number>) => boolean = (y1$0: t_d0eff35c<number>) => {
  if (y1$0.type === "70487bcc" && y1$0.h70487bcc_1 === 5) {
    return false;
  }

  if (y1$0.type === "70487bcc") {
    return false;
  }

  if (y1$0.type === "0043a33c" || y1$0.type === "2449af94") {
    let x$1: t_d0eff35c<number> = y1$0;

    if (x$1.type === "0043a33c") {
      return false;
    }

    if (x$1.type === "2449af94") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#7684e5e9: (Option#45258310<int>) ={}> bool = (y#:0: Option#45258310<int>) ={}> switch y#:0 {
    Some#0043a33c as x#:1 => IntEq#9275f914."=="#553b4b8e#0(x#:1.value#0043a33c#0, 2),
    None#2449af94 => true,
}
```
*/
export const hash_7684e5e9: (arg_0: t_45258310<number>) => boolean = (y$0: t_45258310<number>) => {
  if (y$0.type === "0043a33c") {
    return intEq(y$0.h0043a33c_0, 2);
  }

  if (y$0.type === "2449af94") {
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
export const hash_7caa41a0: (arg_0: boolean) => boolean = (n$0: boolean) => {
  if (n$0 === false) {
    return false;
  }

  return true;
};

/**
```
const isSomeYes#5bb5304c: (Option#45258310<string>) ={}> bool = (v#:0: Option#45258310<string>) ={}> switch v#:0 {
    Some#0043a33c{value: "no"} => false,
    None#2449af94 => false,
    Some#0043a33c{value: v#:1} => StringEq#606c7034."=="#553b4b8e#0(v#:1, "yes"),
}
```
*/
export const hash_5bb5304c: (arg_0: t_45258310<string>) => boolean = (v$0: t_45258310<string>) => {
  if (v$0.type === "0043a33c" && v$0.h0043a33c_0 === "no") {
    return false;
  }

  if (v$0.type === "2449af94") {
    return false;
  }

  if (v$0.type === "0043a33c") {
    return stringEq(v$0.h0043a33c_0, "yes");
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
export const hash_5768cc58: (arg_0: number) => boolean = (n$0: number) => {
  if (n$0 === 4) {
    return false;
  }

  if (n$0 === 10) {
    return true;
  }

  return false;
};

/**
```
const getWithDefault#16e40f74: <T#:0>(Option#45258310<T#:0>, T#:0) ={}> T#:0 = <T#:0>(
    x#:0: Option#45258310<T#:0>,
    default#:1: T#:0,
) ={}> {
    switch x#:0 {Some#0043a33c{value: v#:2} => v#:2, None#2449af94 => default#:1};
}
```
*/
export const hash_16e40f74: <T_0>(arg_0: t_45258310<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_45258310<T_0>, default$1: T_0) => {
  if (x$0.type === "0043a33c") {
    return x$0.h0043a33c_0;
  }

  if (x$0.type === "2449af94") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#0c1d2cb0: <T#:0>(Option#45258310<T#:0>) ={}> bool = <T#:0>(
    x#:0: Option#45258310<T#:0>,
) ={}> {
    switch x#:0 {Some#0043a33c => true, None#2449af94 => false};
}
```
*/
export const hash_0c1d2cb0: <T_0>(arg_0: t_45258310<T_0>) => boolean = <T_0>(x$0: t_45258310<T_0>) => {
  if (x$0.type === "0043a33c") {
    return true;
  }

  if (x$0.type === "2449af94") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#38ea7aec: OptionOrTwice#d0eff35c<int> = OptionOrTwice#d0eff35c<int>:y#1878539c
```
*/
export const hash_38ea7aec: t_d0eff35c<number> = hash_1878539c;

/**
```
const y1t#15dc4398: (OptionOrTwice#d0eff35c<int>) ={}> int = (y1#:0: OptionOrTwice#d0eff35c<int>) ={}> switch y1#:0 {
    Twice#70487bcc{one: one#:1, two: two#:2} => (one#:1 + two#:2),
    None#2449af94 => 2,
    _#:3 => 0,
}
```
*/
export const hash_15dc4398: (arg_0: t_d0eff35c<number>) => number = (y1$0: t_d0eff35c<number>) => {
  if (y1$0.type === "70487bcc") {
    return y1$0.h70487bcc_0 + y1$0.h70487bcc_1;
  }

  if (y1$0.type === "2449af94") {
    return 2;
  }

  return 0;
};

/**
```
const y2#21eb7d2c: OptionOrTwice#d0eff35c<int> = OptionOrTwice#d0eff35c<int>:Twice#70487bcc<int>{
    one#70487bcc#0: 3,
    two#70487bcc#1: 10,
}
```
*/
export const hash_21eb7d2c: t_d0eff35c<number> = ({
  type: "70487bcc",
  h70487bcc_0: 3,
  h70487bcc_1: 10
} as t_d0eff35c<number>);

/*
IntEq#9275f914."=="#553b4b8e#0(
    switch y2#21eb7d2c {Twice#70487bcc{one: one#:0, two: two#:1} => (one#:0 + two#:1), _#:2 => 0},
    13,
)
*/
assertCall(hash_9275f914.h553b4b8e_0, (() => {
  if (hash_21eb7d2c.type === "70487bcc") {
    return hash_21eb7d2c.h70487bcc_0 + hash_21eb7d2c.h70487bcc_1;
  }

  return 0;
})(), 13);

/*
IntEq#9275f914."=="#553b4b8e#0(y1t#15dc4398(y1#38ea7aec), 2)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_15dc4398(hash_38ea7aec), 2);

/*
(isPresent#0c1d2cb0<int>(Option#45258310<int>:Some#0043a33c<int>{value#0043a33c#0: 3}) == true)
*/
assertEqual(hash_0c1d2cb0(({
  type: "0043a33c",
  h0043a33c_0: 3
} as t_45258310<number>)), true);

/*
(isPresent#0c1d2cb0<int>(Option#45258310<int>:None#2449af94) == false)
*/
assertEqual(hash_0c1d2cb0(({
  type: "2449af94"
} as t_45258310<number>)), false);

/*
IntEq#9275f914."=="#553b4b8e#0(
    getWithDefault#16e40f74<int>(Option#45258310<int>:None#2449af94, 20),
    20,
)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_16e40f74(({
  type: "2449af94"
} as t_45258310<number>), 20), 20);

/*
IntEq#9275f914."=="#553b4b8e#0(
    getWithDefault#16e40f74<int>(Option#45258310<int>:Some#0043a33c<int>{value#0043a33c#0: 3}, 20),
    3,
)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_16e40f74(({
  type: "0043a33c",
  h0043a33c_0: 3
} as t_45258310<number>), 20), 3);

/*
(isTen#5768cc58(10) == true)
*/
assertEqual(hash_5768cc58(10), true);

/*
(isSomeYes#5bb5304c(Option#45258310<string>:Some#0043a33c<string>{value#0043a33c#0: "yes"}) == true)
*/
assertEqual(hash_5bb5304c(({
  type: "0043a33c",
  h0043a33c_0: "yes"
} as t_45258310<string>)), true);

/*
(isNotFalse#7caa41a0(true) == true)
*/
assertEqual(hash_7caa41a0(true), true);

/*
isAs#7684e5e9(y#1878539c)
*/
assertCall(hash_7684e5e9, hash_1878539c);

/*
check#752b5f22(y1#38ea7aec)
*/
assertCall(hash_752b5f22, hash_38ea7aec);