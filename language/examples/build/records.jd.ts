import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#6a26227c = {
    age: int#builtin,
}
```
*/
type t_6a26227c = {
  type: "6a26227c";
  h6a26227c_0: number;
};

/**
```
type HasName#65f75ea8 = {
    name: string#builtin,
}
```
*/
type t_65f75ea8 = {
  type: "65f75ea8";
  h65f75ea8_0: string;
};

/**
```
type Person#0fba9ca6 = {
    ...HasName#65f75ea8,
    ...HasAge#6a26227c,
    what: int#builtin,
}
```
*/
type t_0fba9ca6 = {
  type: "0fba9ca6";
  h0fba9ca6_0: number;
  h65f75ea8_0: string;
  h6a26227c_0: number;
};

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
type Employee#3bbc3b79 = {
    ...Person#0fba9ca6,
    address: string#builtin,
}
```
*/
type t_3bbc3b79 = {
  type: "3bbc3b79";
  h3bbc3b79_0: string;
  h0fba9ca6_0: number;
  h65f75ea8_0: string;
  h6a26227c_0: number;
};

/**
```
type House#9fbdb1f4 = {
    occupant: Person#0fba9ca6,
}
```
*/
type t_9fbdb1f4 = {
  type: "9fbdb1f4";
  h9fbdb1f4_0: t_0fba9ca6;
};

/**
```
type Counter#2bea186d<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_2bea186d<T_0> = {
  type: "2bea186d";
  h2bea186d_0: T_0;
  h2bea186d_1: number;
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
type Animal#348b8aae = {
    ...HasName#65f75ea8,
    furColor: string#builtin,
}
```
*/
type t_348b8aae = {
  type: "348b8aae";
  h348b8aae_0: string;
  h65f75ea8_0: string;
};

/**
```
const me#1ba3f64c = Person#0fba9ca6{
    name#65f75ea8#0: "June",
    age#6a26227c#0: 10,
    what#0fba9ca6#0: 3,
}
```
*/
export const hash_1ba3f64c: t_0fba9ca6 = ({
  type: "0fba9ca6",
  h65f75ea8_0: "June",
  h6a26227c_0: 10,
  h0fba9ca6_0: 3
} as t_0fba9ca6);

/**
```
const aPerson#84444f9c = Person#0fba9ca6{
    name#65f75ea8#0: "ralf",
    age#6a26227c#0: 23,
    what#0fba9ca6#0: 2,
}
```
*/
export const hash_84444f9c: t_0fba9ca6 = ({
  type: "0fba9ca6",
  h65f75ea8_0: "ralf",
  h6a26227c_0: 23,
  h0fba9ca6_0: 2
} as t_0fba9ca6);

/**
```
const aDog#2a776e4c = Animal#348b8aae{name#65f75ea8#0: "wolrf", furColor#348b8aae#0: "red"}
```
*/
export const hash_2a776e4c: t_348b8aae = ({
  type: "348b8aae",
  h65f75ea8_0: "wolrf",
  h348b8aae_0: "red"
} as t_348b8aae);

/**
```
const gotit#9781cfa0 = Some#Some<int#builtin>{contents#Some#0: 5}
```
*/
export const hash_9781cfa0: t_Some<number> = ({
  type: "Some",
  hSome_0: 5
} as t_Some<number>);

/**
```
const countNamed#b32e231e = Counter#2bea186d<<T#:0: HasName#65f75ea8>(T#:0) ={}> string#builtin>{
    item#2bea186d#0: <T#:0: HasName#65f75ea8>(input#:0: T#:0): string#builtin ={}> input#:0.name#65f75ea8#0,
    count#2bea186d#1: 10,
}
```
*/
export const hash_b32e231e: t_2bea186d<<T_0 extends {
  h65f75ea8_0: string;
}>(arg_0: T_0) => string> = ({
  type: "2bea186d",
  h2bea186d_0: <T_0 extends {
    h65f75ea8_0: string;
  }>(input: T_0) => input.h65f75ea8_0,
  h2bea186d_1: 10
} as t_2bea186d<<T_0 extends {
  h65f75ea8_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#53a332a6 = Counter#2bea186d<<T#:0>(T#:0) ={}> string#builtin>{
    item#2bea186d#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#2bea186d#1: 10,
}
```
*/
export const hash_53a332a6: t_2bea186d<<T_0>(arg_0: T_0) => string> = ({
  type: "2bea186d",
  h2bea186d_0: <T_0>(input: T_0) => "hi",
  h2bea186d_1: 10
} as t_2bea186d<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#3c0b5b3c = Counter#2bea186d<int#builtin>{
    item#2bea186d#0: 10,
    count#2bea186d#1: 4000,
}
```
*/
export const hash_3c0b5b3c: t_2bea186d<number> = ({
  type: "2bea186d",
  h2bea186d_0: 10,
  h2bea186d_1: 4000
} as t_2bea186d<number>);

/**
```
const here#8844eede = House#9fbdb1f4{occupant#9fbdb1f4#0: me#1ba3f64c}
```
*/
export const hash_8844eede: t_9fbdb1f4 = ({
  type: "9fbdb1f4",
  h9fbdb1f4_0: hash_1ba3f64c
} as t_9fbdb1f4);

/**
```
const getName#5aaa8198 = <T#:0: Person#0fba9ca6>(m#:0: T#:0): string#builtin ={}> m#:0.name#65f75ea8#0
```
*/
export const hash_5aaa8198: <T_0 extends {
  h0fba9ca6_0: number;
  h65f75ea8_0: string;
  h6a26227c_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h0fba9ca6_0: number;
  h65f75ea8_0: string;
  h6a26227c_0: number;
}>(m: T_0) => m.h65f75ea8_0;

/**
```
const them#3eb5bfe8 = Employee#3bbc3b79{
    what#0fba9ca6#0: 3,
    name#65f75ea8#0: "You",
    age#6a26227c#0: 100,
    address#3bbc3b79#0: "No",
}
```
*/
export const hash_3eb5bfe8: t_3bbc3b79 = ({
  type: "3bbc3b79",
  h0fba9ca6_0: 3,
  h65f75ea8_0: "You",
  h6a26227c_0: 100,
  h3bbc3b79_0: "No"
} as t_3bbc3b79);

/**
```
const you#820de2b2 = Employee#3bbc3b79{...me#1ba3f64c, address#3bbc3b79#0: "Yes"}
```
*/
export const hash_820de2b2: t_3bbc3b79 = ({ ...hash_1ba3f64c,
  type: "3bbc3b79",
  h3bbc3b79_0: "Yes"
} as t_3bbc3b79);

/**
```
const alsoMe#9e584706 = Person#0fba9ca6{...me#1ba3f64c, what#0fba9ca6#0: 11}
```
*/
export const hash_9e584706: t_0fba9ca6 = ({ ...hash_1ba3f64c,
  type: "0fba9ca6",
  h0fba9ca6_0: 11
} as t_0fba9ca6);

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

/*
me#1ba3f64c.name#65f75ea8#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1ba3f64c.h65f75ea8_0, "June");

/*
me#1ba3f64c.age#6a26227c#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_1ba3f64c.h6a26227c_0, 10);

/*
alsoMe#9e584706.name#65f75ea8#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_9e584706.h65f75ea8_0, "June");

/*
alsoMe#9e584706.what#0fba9ca6#0 ==#9275f914#553b4b8e#0 11
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9e584706.h0fba9ca6_0, 11);

/*
you#820de2b2.name#65f75ea8#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_820de2b2.h65f75ea8_0, "June");

/*
them#3eb5bfe8.name#65f75ea8#0 ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3eb5bfe8.h65f75ea8_0, "You");

/*
them#3eb5bfe8.address#3bbc3b79#0 ==#606c7034#553b4b8e#0 "No"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3eb5bfe8.h3bbc3b79_0, "No");

/*
getName#5aaa8198<Person#0fba9ca6>(m: me#1ba3f64c) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5aaa8198(hash_1ba3f64c), "June");

/*
getName#5aaa8198<Employee#3bbc3b79>(m: them#3eb5bfe8) ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5aaa8198(hash_3eb5bfe8), "You");

/*
here#8844eede.occupant#9fbdb1f4#0.name#65f75ea8#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_8844eede.h9fbdb1f4_0.h65f75ea8_0, "June");

/*
countMe#3c0b5b3c.item#2bea186d#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_3c0b5b3c.h2bea186d_0, 10);

/*
Counter#2bea186d<() ={}> string#builtin>{
        item#2bea186d#0: (): string#builtin ={}> "hi",
        count#2bea186d#1: 10,
    }.item#2bea186d#0() 
    ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "2bea186d",
  h2bea186d_0: () => "hi",
  h2bea186d_1: 10
} as t_2bea186d<() => string>).h2bea186d_0(), "hi");

/*
countAny#53a332a6.item#2bea186d#0<string#builtin>("String") ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_53a332a6.h2bea186d_0("String"), "hi");

/*
countAny#53a332a6.item#2bea186d#0<int#builtin>(10) ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_53a332a6.h2bea186d_0(10), "hi");

/*
countNamed#b32e231e.item#2bea186d#0<Person#0fba9ca6>(me#1ba3f64c) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_b32e231e.h2bea186d_0(hash_1ba3f64c), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#9275f914#553b4b8e#0 5
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#7f932ec6{...aDog#2a776e4c, ...aPerson#84444f9c}.name#65f75ea8#0 
    ==#606c7034#553b4b8e#0 "ralf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_2a776e4c,
  ...hash_84444f9c,
  type: "7f932ec6"
} as t_7f932ec6).h65f75ea8_0, "ralf");

/*
WereWolf#7f932ec6{...aPerson#84444f9c, ...aDog#2a776e4c}.name#65f75ea8#0 
    ==#606c7034#553b4b8e#0 "wolrf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_84444f9c,
  ...hash_2a776e4c,
  type: "7f932ec6"
} as t_7f932ec6).h65f75ea8_0, "wolrf");