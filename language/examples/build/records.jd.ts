import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#4082e170 = {
    age: int#builtin,
}
```
*/
type t_4082e170 = {
  type: "4082e170";
  h4082e170_0: number;
};

/**
```
type HasName#ad561a20 = {
    name: string#builtin,
}
```
*/
type t_ad561a20 = {
  type: "ad561a20";
  had561a20_0: string;
};

/**
```
type Person#58c1982c = {
    ...HasName#ad561a20,
    ...HasAge#4082e170,
    what: int#builtin,
}
```
*/
type t_58c1982c = {
  type: "58c1982c";
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
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
type Employee#2736d9d6 = {
    ...Person#58c1982c,
    address: string#builtin,
}
```
*/
type t_2736d9d6 = {
  type: "2736d9d6";
  h2736d9d6_0: string;
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
};

/**
```
type House#164905e5 = {
    occupant: Person#58c1982c,
}
```
*/
type t_164905e5 = {
  type: "164905e5";
  h164905e5_0: t_58c1982c;
};

/**
```
type Counter#a4491948<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_a4491948<T_0> = {
  type: "a4491948";
  ha4491948_0: T_0;
  ha4491948_1: number;
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
type Animal#225ab688 = {
    ...HasName#ad561a20,
    furColor: string#builtin,
}
```
*/
type t_225ab688 = {
  type: "225ab688";
  h225ab688_0: string;
  had561a20_0: string;
};

/**
```
const me#5af8296e = Person#58c1982c{name#ad561a20#0: "June", age#4082e170#0: 10, what#58c1982c#0: 3}
```
*/
export const hash_5af8296e: t_58c1982c = ({
  type: "58c1982c",
  had561a20_0: "June",
  h4082e170_0: 10,
  h58c1982c_0: 3
} as t_58c1982c);

/**
```
const aPerson#37c99a88 = Person#58c1982c{
    name#ad561a20#0: "ralf",
    age#4082e170#0: 23,
    what#58c1982c#0: 2,
}
```
*/
export const hash_37c99a88: t_58c1982c = ({
  type: "58c1982c",
  had561a20_0: "ralf",
  h4082e170_0: 23,
  h58c1982c_0: 2
} as t_58c1982c);

/**
```
const aDog#5cd59c5d = Animal#225ab688{name#ad561a20#0: "wolrf", furColor#225ab688#0: "red"}
```
*/
export const hash_5cd59c5d: t_225ab688 = ({
  type: "225ab688",
  had561a20_0: "wolrf",
  h225ab688_0: "red"
} as t_225ab688);

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
const countNamed#8aced828 = Counter#a4491948<<T#:0: HasName#ad561a20>(T#:0) ={}> string#builtin>{
    item#a4491948#0: <T#:0: HasName#ad561a20>(input#:0: T#:0): string#builtin ={}> input#:0.name#ad561a20#0,
    count#a4491948#1: 10,
}
```
*/
export const hash_8aced828: t_a4491948<<T_0 extends {
  had561a20_0: string;
}>(arg_0: T_0) => string> = ({
  type: "a4491948",
  ha4491948_0: <T_0 extends {
    had561a20_0: string;
  }>(input: T_0) => input.had561a20_0,
  ha4491948_1: 10
} as t_a4491948<<T_0 extends {
  had561a20_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#5a5f83a0 = Counter#a4491948<<T#:0>(T#:0) ={}> string#builtin>{
    item#a4491948#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#a4491948#1: 10,
}
```
*/
export const hash_5a5f83a0: t_a4491948<<T_0>(arg_0: T_0) => string> = ({
  type: "a4491948",
  ha4491948_0: <T_0>(input: T_0) => "hi",
  ha4491948_1: 10
} as t_a4491948<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#3fcbf771 = Counter#a4491948<int#builtin>{item#a4491948#0: 10, count#a4491948#1: 4000}
```
*/
export const hash_3fcbf771: t_a4491948<number> = ({
  type: "a4491948",
  ha4491948_0: 10,
  ha4491948_1: 4000
} as t_a4491948<number>);

/**
```
const here#7bf95f66 = House#164905e5{occupant#164905e5#0: me#5af8296e}
```
*/
export const hash_7bf95f66: t_164905e5 = ({
  type: "164905e5",
  h164905e5_0: hash_5af8296e
} as t_164905e5);

/**
```
const getName#1ef63c92 = <T#:0: Person#58c1982c>(m#:0: T#:0): string#builtin ={}> m#:0.name#ad561a20#0
```
*/
export const hash_1ef63c92: <T_0 extends {
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
}>(m: T_0) => m.had561a20_0;

/**
```
const them#3a789ae6 = Employee#2736d9d6{
    what#58c1982c#0: 3,
    name#ad561a20#0: "You",
    age#4082e170#0: 100,
    address#2736d9d6#0: "No",
}
```
*/
export const hash_3a789ae6: t_2736d9d6 = ({
  type: "2736d9d6",
  h58c1982c_0: 3,
  had561a20_0: "You",
  h4082e170_0: 100,
  h2736d9d6_0: "No"
} as t_2736d9d6);

/**
```
const you#3baa0bc6 = Employee#2736d9d6{...me#5af8296e, address#2736d9d6#0: "Yes"}
```
*/
export const hash_3baa0bc6: t_2736d9d6 = ({ ...hash_5af8296e,
  type: "2736d9d6",
  h2736d9d6_0: "Yes"
} as t_2736d9d6);

/**
```
const alsoMe#88bf856c = Person#58c1982c{...me#5af8296e, what#58c1982c#0: 11}
```
*/
export const hash_88bf856c: t_58c1982c = ({ ...hash_5af8296e,
  type: "58c1982c",
  h58c1982c_0: 11
} as t_58c1982c);

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
me#5af8296e.name#ad561a20#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5af8296e.had561a20_0, "June");

/*
me#5af8296e.age#4082e170#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5af8296e.h4082e170_0, 10);

/*
alsoMe#88bf856c.name#ad561a20#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_88bf856c.had561a20_0, "June");

/*
alsoMe#88bf856c.what#58c1982c#0 ==#9275f914#553b4b8e#0 11
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_88bf856c.h58c1982c_0, 11);

/*
you#3baa0bc6.name#ad561a20#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3baa0bc6.had561a20_0, "June");

/*
them#3a789ae6.name#ad561a20#0 ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3a789ae6.had561a20_0, "You");

/*
them#3a789ae6.address#2736d9d6#0 ==#606c7034#553b4b8e#0 "No"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3a789ae6.h2736d9d6_0, "No");

/*
getName#1ef63c92<Person#58c1982c>(m: me#5af8296e) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1ef63c92(hash_5af8296e), "June");

/*
getName#1ef63c92<Employee#2736d9d6>(m: them#3a789ae6) ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1ef63c92(hash_3a789ae6), "You");

/*
here#7bf95f66.occupant#164905e5#0.name#ad561a20#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7bf95f66.h164905e5_0.had561a20_0, "June");

/*
countMe#3fcbf771.item#a4491948#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_3fcbf771.ha4491948_0, 10);

/*
Counter#a4491948<() ={}> string#builtin>{
        item#a4491948#0: (): string#builtin ={}> "hi",
        count#a4491948#1: 10,
    }.item#a4491948#0() 
    ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "a4491948",
  ha4491948_0: () => "hi",
  ha4491948_1: 10
} as t_a4491948<() => string>).ha4491948_0(), "hi");

/*
countAny#5a5f83a0.item#a4491948#0<string#builtin>("String") ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5a5f83a0.ha4491948_0("String"), "hi");

/*
countAny#5a5f83a0.item#a4491948#0<int#builtin>(10) ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5a5f83a0.ha4491948_0(10), "hi");

/*
countNamed#8aced828.item#a4491948#0<Person#58c1982c>(me#5af8296e) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_8aced828.ha4491948_0(hash_5af8296e), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#9275f914#553b4b8e#0 5
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#9b77cbb0{...aDog#5cd59c5d, ...aPerson#37c99a88}.name#ad561a20#0 
    ==#606c7034#553b4b8e#0 "ralf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_5cd59c5d,
  ...hash_37c99a88,
  type: "9b77cbb0"
} as t_9b77cbb0).had561a20_0, "ralf");

/*
WereWolf#9b77cbb0{...aPerson#37c99a88, ...aDog#5cd59c5d}.name#ad561a20#0 
    ==#606c7034#553b4b8e#0 "wolrf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_37c99a88,
  ...hash_5cd59c5d,
  type: "9b77cbb0"
} as t_9b77cbb0).had561a20_0, "wolrf");