import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#e3c8b29a = {
    age: int,
}
```
*/
type t_e3c8b29a = {
  type: "e3c8b29a";
  he3c8b29a_0: number;
};

/**
```
type HasName#227d413c = {
    name: string,
}
```
*/
type t_227d413c = {
  type: "227d413c";
  h227d413c_0: string;
};

/**
```
type Person#672feec8 = {
    ...HasName#227d413c,
    ...HasAge#e3c8b29a,
    what: int,
}
```
*/
type t_672feec8 = {
  type: "672feec8";
  h672feec8_0: number;
  h227d413c_0: string;
  he3c8b29a_0: number;
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
type Employee#656ce53e = {
    ...Person#672feec8,
    address: string,
}
```
*/
type t_656ce53e = {
  type: "656ce53e";
  h656ce53e_0: string;
  h672feec8_0: number;
  h227d413c_0: string;
  he3c8b29a_0: number;
};

/**
```
type House#0ac87de4 = {
    occupant: Person#672feec8,
}
```
*/
type t_0ac87de4 = {
  type: "0ac87de4";
  h0ac87de4_0: t_672feec8;
};

/**
```
type Counter#5d0a3ff0<T#:0> = {
    item: T#:0,
    count: int,
}
```
*/
type t_5d0a3ff0<T_0> = {
  type: "5d0a3ff0";
  h5d0a3ff0_0: T_0;
  h5d0a3ff0_1: number;
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
type Animal#049e987a = {
    ...HasName#227d413c,
    furColor: string,
}
```
*/
type t_049e987a = {
  type: "049e987a";
  h049e987a_0: string;
  h227d413c_0: string;
};

/**
```
const me#c686f264 = Person#672feec8{name#227d413c#0: "June", age#e3c8b29a#0: 10, what#672feec8#0: 3}
```
*/
export const hash_c686f264: t_672feec8 = ({
  type: "672feec8",
  h227d413c_0: "June",
  he3c8b29a_0: 10,
  h672feec8_0: 3
} as t_672feec8);

/**
```
const aPerson#630d2122 = Person#672feec8{
    name#227d413c#0: "ralf",
    age#e3c8b29a#0: 23,
    what#672feec8#0: 2,
}
```
*/
export const hash_630d2122: t_672feec8 = ({
  type: "672feec8",
  h227d413c_0: "ralf",
  he3c8b29a_0: 23,
  h672feec8_0: 2
} as t_672feec8);

/**
```
const aDog#6ed46fc5 = Animal#049e987a{name#227d413c#0: "wolrf", furColor#049e987a#0: "red"}
```
*/
export const hash_6ed46fc5: t_049e987a = ({
  type: "049e987a",
  h227d413c_0: "wolrf",
  h049e987a_0: "red"
} as t_049e987a);

/**
```
const gotit#9781cfa0 = Some#Some<int>{contents#Some#0: 5}
```
*/
export const hash_9781cfa0: t_Some<number> = ({
  type: "Some",
  hSome_0: 5
} as t_Some<number>);

/**
```
const countNamed#77fb56a1 = Counter#5d0a3ff0<<T#:0: HasName#227d413c>(T#:0) ={}> string>{
    item#5d0a3ff0#0: <T#:0: HasName#227d413c>(input#:0: T#:0): string ={}> input#:0.name#227d413c#0,
    count#5d0a3ff0#1: 10,
}
```
*/
export const hash_77fb56a1: t_5d0a3ff0<<T_0 extends {
  h227d413c_0: string;
}>(arg_0: T_0) => string> = ({
  type: "5d0a3ff0",
  h5d0a3ff0_0: <T_0 extends {
    h227d413c_0: string;
  }>(input: T_0) => input.h227d413c_0,
  h5d0a3ff0_1: 10
} as t_5d0a3ff0<<T_0 extends {
  h227d413c_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#7bc93dec = Counter#5d0a3ff0<<T#:0>(T#:0) ={}> string>{
    item#5d0a3ff0#0: <T#:0>(input#:0: T#:0): string ={}> "hi",
    count#5d0a3ff0#1: 10,
}
```
*/
export const hash_7bc93dec: t_5d0a3ff0<<T_0>(arg_0: T_0) => string> = ({
  type: "5d0a3ff0",
  h5d0a3ff0_0: <T_0>(input: T_0) => "hi",
  h5d0a3ff0_1: 10
} as t_5d0a3ff0<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#632c6e2c = Counter#5d0a3ff0<int>{item#5d0a3ff0#0: 10, count#5d0a3ff0#1: 4000}
```
*/
export const hash_632c6e2c: t_5d0a3ff0<number> = ({
  type: "5d0a3ff0",
  h5d0a3ff0_0: 10,
  h5d0a3ff0_1: 4000
} as t_5d0a3ff0<number>);

/**
```
const here#67ad42d2 = House#0ac87de4{occupant#0ac87de4#0: me#c686f264}
```
*/
export const hash_67ad42d2: t_0ac87de4 = ({
  type: "0ac87de4",
  h0ac87de4_0: hash_c686f264
} as t_0ac87de4);

/**
```
const getName#b1ae33cc = <T#:0: Person#672feec8>(m#:0: T#:0): string ={}> m#:0.name#227d413c#0
```
*/
export const hash_b1ae33cc: <T_0 extends {
  h672feec8_0: number;
  h227d413c_0: string;
  he3c8b29a_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h672feec8_0: number;
  h227d413c_0: string;
  he3c8b29a_0: number;
}>(m: T_0) => m.h227d413c_0;

/**
```
const them#89119f84 = Employee#656ce53e{
    what#672feec8#0: 3,
    name#227d413c#0: "You",
    age#e3c8b29a#0: 100,
    address#656ce53e#0: "No",
}
```
*/
export const hash_89119f84: t_656ce53e = ({
  type: "656ce53e",
  h672feec8_0: 3,
  h227d413c_0: "You",
  he3c8b29a_0: 100,
  h656ce53e_0: "No"
} as t_656ce53e);

/**
```
const you#0c626516 = Employee#656ce53e{...me#c686f264, address#656ce53e#0: "Yes"}
```
*/
export const hash_0c626516: t_656ce53e = ({ ...hash_c686f264,
  type: "656ce53e",
  h656ce53e_0: "Yes"
} as t_656ce53e);

/**
```
const alsoMe#5b5b39e8 = Person#672feec8{...me#c686f264, what#672feec8#0: 11}
```
*/
export const hash_5b5b39e8: t_672feec8 = ({ ...hash_c686f264,
  type: "672feec8",
  h672feec8_0: 11
} as t_672feec8);

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

/*
me#c686f264.name#227d413c#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_c686f264.h227d413c_0, "June");

/*
me#c686f264.age#e3c8b29a#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_c686f264.he3c8b29a_0, 10);

/*
alsoMe#5b5b39e8.name#227d413c#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5b5b39e8.h227d413c_0, "June");

/*
alsoMe#5b5b39e8.what#672feec8#0 ==#9275f914#553b4b8e#0 11
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5b5b39e8.h672feec8_0, 11);

/*
you#0c626516.name#227d413c#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0c626516.h227d413c_0, "June");

/*
them#89119f84.name#227d413c#0 ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_89119f84.h227d413c_0, "You");

/*
them#89119f84.address#656ce53e#0 ==#606c7034#553b4b8e#0 "No"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_89119f84.h656ce53e_0, "No");

/*
getName#b1ae33cc<Person#672feec8>(me#c686f264) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_b1ae33cc(hash_c686f264), "June");

/*
getName#b1ae33cc<Employee#656ce53e>(them#89119f84) ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_b1ae33cc(hash_89119f84), "You");

/*
here#67ad42d2.occupant#0ac87de4#0.name#227d413c#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_67ad42d2.h0ac87de4_0.h227d413c_0, "June");

/*
countMe#632c6e2c.item#5d0a3ff0#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_632c6e2c.h5d0a3ff0_0, 10);

/*
Counter#5d0a3ff0<() ={}> string>{item#5d0a3ff0#0: (): string ={}> "hi", count#5d0a3ff0#1: 10}.item#5d0a3ff0#0() ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "5d0a3ff0",
  h5d0a3ff0_0: () => "hi",
  h5d0a3ff0_1: 10
} as t_5d0a3ff0<() => string>).h5d0a3ff0_0(), "hi");

/*
countAny#7bc93dec.item#5d0a3ff0#0<string>("String") ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7bc93dec.h5d0a3ff0_0("String"), "hi");

/*
countAny#7bc93dec.item#5d0a3ff0#0<int>(10) ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7bc93dec.h5d0a3ff0_0(10), "hi");

/*
countNamed#77fb56a1.item#5d0a3ff0#0<Person#672feec8>(me#c686f264) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_77fb56a1.h5d0a3ff0_0(hash_c686f264), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#9275f914#553b4b8e#0 5
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#4ca2cf94{...aDog#6ed46fc5, ...aPerson#630d2122}.name#227d413c#0 ==#606c7034#553b4b8e#0 "ralf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_6ed46fc5,
  ...hash_630d2122,
  type: "4ca2cf94"
} as t_4ca2cf94).h227d413c_0, "ralf");

/*
WereWolf#4ca2cf94{...aPerson#630d2122, ...aDog#6ed46fc5}.name#227d413c#0 ==#606c7034#553b4b8e#0 "wolrf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_630d2122,
  ...hash_6ed46fc5,
  type: "4ca2cf94"
} as t_4ca2cf94).h227d413c_0, "wolrf");