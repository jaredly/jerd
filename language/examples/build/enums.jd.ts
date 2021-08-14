import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type None#3a07356f = {}
```
*/
type t_3a07356f = {
  type: "3a07356f";
};

/**
```
type Some#786ef518<T#:0> = {
    value: T#:0,
}
```
*/
type t_786ef518<T_0> = {
  type: "786ef518";
  h786ef518_0: T_0;
};

/**
```
type Twice#7897b3ae<T#:0> = {
    one: T#:0,
    two: T#:0,
}
```
*/
type t_7897b3ae<T_0> = {
  type: "7897b3ae";
  h7897b3ae_0: T_0;
  h7897b3ae_1: T_0;
};

/*enum Option#230ce7b8<T#:0> {
    Some#786ef518<T#:0>,
    None#3a07356f,
}*/
type t_230ce7b8<T_0> = t_786ef518<T_0> | t_3a07356f;

/*enum OptionOrTwice#54aaf46c<T#:0> {
    ...Option#230ce7b8<T#:0>,
    Twice#7897b3ae<T#:0>,
}*/
type t_54aaf46c<T_0> = t_7897b3ae<T_0> | t_786ef518<T_0> | t_3a07356f;

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
const y#ffbfae7e = Option#230ce7b8<int#builtin>:None#3a07356f
```
*/
export const hash_ffbfae7e: t_230ce7b8<number> = ({
  type: "3a07356f"
} as t_230ce7b8<number>);

/**
```
const check#33248e2c = (y1#:0: OptionOrTwice#54aaf46c<int#builtin>): bool#builtin ={}> switch y1#:0 {
    Twice#7897b3ae{two: 5} => false,
    Twice#7897b3ae => false,
    Option#230ce7b8 as x#:1 => switch x#:1 {Some#786ef518 => false, None#3a07356f => true},
}
```
*/
export const hash_33248e2c: (arg_0: t_54aaf46c<number>) => boolean = (y1: t_54aaf46c<number>) => {
  if (y1.type === "7897b3ae" && y1.h7897b3ae_1 === 5) {
    return false;
  }

  if (y1.type === "7897b3ae") {
    return false;
  }

  if (y1.type === "786ef518" || y1.type === "3a07356f") {
    let x: t_54aaf46c<number> = y1;

    if (x.type === "786ef518") {
      return false;
    }

    if (x.type === "3a07356f") {
      return true;
    }

    throw "Math failed";
  }

  throw "Math failed";
};

/**
```
const isAs#bb3a2c42 = (y#:0: Option#230ce7b8<int#builtin>): bool#builtin ={}> switch y#:0 {
    Some#786ef518 as x#:1 => x#:1.value#786ef518#0 ==#9275f914#553b4b8e#0 2,
    None#3a07356f => true,
}
```
*/
export const hash_bb3a2c42: (arg_0: t_230ce7b8<number>) => boolean = (y: t_230ce7b8<number>) => {
  if (y.type === "786ef518") {
    return hash_9275f914.h553b4b8e_0(y.h786ef518_0, 2);
  }

  if (y.type === "3a07356f") {
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
const isSomeYes#4fc437dc = (v#:0: Option#230ce7b8<string#builtin>): bool#builtin ={}> switch v#:0 {
    Some#786ef518{value: "no"} => false,
    None#3a07356f => false,
    Some#786ef518{value: v#:1} => v#:1 ==#606c7034#553b4b8e#0 "yes",
}
```
*/
export const hash_4fc437dc: (arg_0: t_230ce7b8<string>) => boolean = (v: t_230ce7b8<string>) => {
  if (v.type === "786ef518" && v.h786ef518_0 === "no") {
    return false;
  }

  if (v.type === "3a07356f") {
    return false;
  }

  if (v.type === "786ef518") {
    return hash_606c7034.h553b4b8e_0(v.h786ef518_0, "yes");
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
const getWithDefault#5a04c5f2 = <T#:0>(x#:0: Option#230ce7b8<T#:0>, default#:1: T#:0): T#:0 ={}> {
    switch x#:0 {Some#786ef518{value: v#:2} => v#:2, None#3a07356f => default#:1};
}
```
*/
export const hash_5a04c5f2: <T_0>(arg_0: t_230ce7b8<T_0>, arg_1: T_0) => T_0 = <T_0>(x$0: t_230ce7b8<T_0>, default$1: T_0) => {
  if (x$0.type === "786ef518") {
    return x$0.h786ef518_0;
  }

  if (x$0.type === "3a07356f") {
    return default$1;
  }

  throw "Math failed";
};

/**
```
const isPresent#9e09c72a = <T#:0>(x#:0: Option#230ce7b8<T#:0>): bool#builtin ={}> {
    switch x#:0 {Some#786ef518 => true, None#3a07356f => false};
}
```
*/
export const hash_9e09c72a: <T_0>(arg_0: t_230ce7b8<T_0>) => boolean = <T_0>(x$0: t_230ce7b8<T_0>) => {
  if (x$0.type === "786ef518") {
    return true;
  }

  if (x$0.type === "3a07356f") {
    return false;
  }

  throw "Math failed";
};

/**
```
const y1#01219a02 = OptionOrTwice#54aaf46c<int#builtin>:y#ffbfae7e
```
*/
export const hash_01219a02: t_54aaf46c<number> = hash_ffbfae7e;

/**
```
const y1t#7365ed67 = (y1#:0: OptionOrTwice#54aaf46c<int#builtin>): int#builtin ={}> switch y1#:0 {
    Twice#7897b3ae{one: one#:1, two: two#:2} => one#:1 +#builtin two#:2,
    None#3a07356f => 2,
    _#:3 => 0,
}
```
*/
export const hash_7365ed67: (arg_0: t_54aaf46c<number>) => number = (y1: t_54aaf46c<number>) => {
  if (y1.type === "7897b3ae") {
    return y1.h7897b3ae_0 + y1.h7897b3ae_1;
  }

  if (y1.type === "3a07356f") {
    return 2;
  }

  return 0;
};

/**
```
const y2#918b9a84 = OptionOrTwice#54aaf46c<int#builtin>:Twice#7897b3ae<int#builtin>{
    one#7897b3ae#0: 3,
    two#7897b3ae#1: 10,
}
```
*/
export const hash_918b9a84: t_54aaf46c<number> = ({
  type: "7897b3ae",
  h7897b3ae_0: 3,
  h7897b3ae_1: 10
} as t_54aaf46c<number>);

/*
switch y2#918b9a84 {Twice#7897b3ae{one: one#:0, two: two#:1} => one#:0 +#builtin two#:1, _#:2 => 0} 
    ==#9275f914#553b4b8e#0 13
*/
assertCall(hash_9275f914.h553b4b8e_0, (() => {
  if (hash_918b9a84.type === "7897b3ae") {
    return hash_918b9a84.h7897b3ae_0 + hash_918b9a84.h7897b3ae_1;
  }

  return 0;
})(), 13);

/*
y1t#7365ed67(y1#01219a02) ==#9275f914#553b4b8e#0 2
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_7365ed67(hash_01219a02), 2);

/*
isPresent#9e09c72a<int#builtin>(
        x: Option#230ce7b8<int#builtin>:Some#786ef518<int#builtin>{value#786ef518#0: 3},
    ) 
    ==#builtin true
*/
assertEqual(hash_9e09c72a(({
  type: "786ef518",
  h786ef518_0: 3
} as t_230ce7b8<number>)), true);

/*
isPresent#9e09c72a<int#builtin>(x: Option#230ce7b8<int#builtin>:None#3a07356f) ==#builtin false
*/
assertEqual(hash_9e09c72a(({
  type: "3a07356f"
} as t_230ce7b8<number>)), false);

/*
getWithDefault#5a04c5f2<int#builtin>(x: Option#230ce7b8<int#builtin>:None#3a07356f, default: 20) 
    ==#9275f914#553b4b8e#0 20
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5a04c5f2(({
  type: "3a07356f"
} as t_230ce7b8<number>), 20), 20);

/*
getWithDefault#5a04c5f2<int#builtin>(
        x: Option#230ce7b8<int#builtin>:Some#786ef518<int#builtin>{value#786ef518#0: 3},
        default: 20,
    ) 
    ==#9275f914#553b4b8e#0 3
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5a04c5f2(({
  type: "786ef518",
  h786ef518_0: 3
} as t_230ce7b8<number>), 20), 3);

/*
switch None#3a07356f {None#3a07356f => true}
*/
assert((() => {
  if (({
    type: "3a07356f"
  } as t_3a07356f).type === "3a07356f") {
    return true;
  }

  throw "Math failed";
})());

/*
isTen#5768cc58(n: 10) ==#builtin true
*/
assertEqual(hash_5768cc58(10), true);

/*
isSomeYes#4fc437dc(
        v: Option#230ce7b8<string#builtin>:Some#786ef518<string#builtin>{value#786ef518#0: "yes"},
    ) 
    ==#builtin true
*/
assertEqual(hash_4fc437dc(({
  type: "786ef518",
  h786ef518_0: "yes"
} as t_230ce7b8<string>)), true);

/*
isNotFalse#7caa41a0(n: true) ==#builtin true
*/
assertEqual(hash_7caa41a0(true), true);

/*
isAs#bb3a2c42(y#ffbfae7e)
*/
assertCall(hash_bb3a2c42, hash_ffbfae7e);

/*
check#33248e2c(y1#01219a02)
*/
assertCall(hash_33248e2c, hash_01219a02);