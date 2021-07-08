import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#5dc1538c = {
    age: int#builtin,
}
```
*/
type t_5dc1538c = {
  type: "5dc1538c";
  h5dc1538c_0: number;
};

/**
```
type HasName#7ffb15a6 = {
    name: string#builtin,
}
```
*/
type t_7ffb15a6 = {
  type: "7ffb15a6";
  h7ffb15a6_0: string;
};

/**
```
type Person#1e5bfcf4 = {
    ...HasName#7ffb15a6,
    ...HasAge#5dc1538c,
    what: int#builtin,
}
```
*/
type t_1e5bfcf4 = {
  type: "1e5bfcf4";
  h1e5bfcf4_0: number;
  h7ffb15a6_0: string;
  h5dc1538c_0: number;
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
type Employee#7c386be0 = {
    ...Person#1e5bfcf4,
    address: string#builtin,
}
```
*/
type t_7c386be0 = {
  type: "7c386be0";
  h7c386be0_0: string;
  h1e5bfcf4_0: number;
  h7ffb15a6_0: string;
  h5dc1538c_0: number;
};

/**
```
type House#6febb808 = {
    occupant: Person#1e5bfcf4,
}
```
*/
type t_6febb808 = {
  type: "6febb808";
  h6febb808_0: t_1e5bfcf4;
};

/**
```
type Counter#28ad7060<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_28ad7060<T_0> = {
  type: "28ad7060";
  h28ad7060_0: T_0;
  h28ad7060_1: number;
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
type Animal#3eec0102 = {
    ...HasName#7ffb15a6,
    furColor: string#builtin,
}
```
*/
type t_3eec0102 = {
  type: "3eec0102";
  h3eec0102_0: string;
  h7ffb15a6_0: string;
};

/**
```
const me#8b5e50c4 = Person#1e5bfcf4{
    name#7ffb15a6#0: "June",
    age#5dc1538c#0: 10,
    what#1e5bfcf4#0: 3,
}
```
*/
export const hash_8b5e50c4: t_1e5bfcf4 = ({
  type: "1e5bfcf4",
  h7ffb15a6_0: "June",
  h5dc1538c_0: 10,
  h1e5bfcf4_0: 3
} as t_1e5bfcf4);

/**
```
const aPerson#3602ea70 = Person#1e5bfcf4{
    name#7ffb15a6#0: "ralf",
    age#5dc1538c#0: 23,
    what#1e5bfcf4#0: 2,
}
```
*/
export const hash_3602ea70: t_1e5bfcf4 = ({
  type: "1e5bfcf4",
  h7ffb15a6_0: "ralf",
  h5dc1538c_0: 23,
  h1e5bfcf4_0: 2
} as t_1e5bfcf4);

/**
```
const aDog#119b34f9 = Animal#3eec0102{name#7ffb15a6#0: "wolrf", furColor#3eec0102#0: "red"}
```
*/
export const hash_119b34f9: t_3eec0102 = ({
  type: "3eec0102",
  h7ffb15a6_0: "wolrf",
  h3eec0102_0: "red"
} as t_3eec0102);

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
const countNamed#1d40b8c5 = Counter#28ad7060<<T#:0: HasName#7ffb15a6>(T#:0) ={}> string#builtin>{
    item#28ad7060#0: <T#:0: HasName#7ffb15a6>(input#:0: T#:0): string#builtin ={}> input#:0.name#7ffb15a6#0,
    count#28ad7060#1: 10,
}
```
*/
export const hash_1d40b8c5: t_28ad7060<<T_0 extends {
  h7ffb15a6_0: string;
}>(arg_0: T_0) => string> = ({
  type: "28ad7060",
  h28ad7060_0: <T_0 extends {
    h7ffb15a6_0: string;
  }>(input: T_0) => input.h7ffb15a6_0,
  h28ad7060_1: 10
} as t_28ad7060<<T_0 extends {
  h7ffb15a6_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#b9763660 = Counter#28ad7060<<T#:0>(T#:0) ={}> string#builtin>{
    item#28ad7060#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#28ad7060#1: 10,
}
```
*/
export const hash_b9763660: t_28ad7060<<T_0>(arg_0: T_0) => string> = ({
  type: "28ad7060",
  h28ad7060_0: <T_0>(input: T_0) => "hi",
  h28ad7060_1: 10
} as t_28ad7060<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#3115ea0c = Counter#28ad7060<int#builtin>{
    item#28ad7060#0: 10,
    count#28ad7060#1: 4000,
}
```
*/
export const hash_3115ea0c: t_28ad7060<number> = ({
  type: "28ad7060",
  h28ad7060_0: 10,
  h28ad7060_1: 4000
} as t_28ad7060<number>);

/**
```
const here#22e3486e = House#6febb808{occupant#6febb808#0: me#8b5e50c4}
```
*/
export const hash_22e3486e: t_6febb808 = ({
  type: "6febb808",
  h6febb808_0: hash_8b5e50c4
} as t_6febb808);

/**
```
const them#7fa2bdd0 = Employee#7c386be0{
    what#1e5bfcf4#0: 3,
    name#7ffb15a6#0: "You",
    age#5dc1538c#0: 100,
    address#7c386be0#0: "No",
}
```
*/
export const hash_7fa2bdd0: t_7c386be0 = ({
  type: "7c386be0",
  h1e5bfcf4_0: 3,
  h7ffb15a6_0: "You",
  h5dc1538c_0: 100,
  h7c386be0_0: "No"
} as t_7c386be0);

/**
```
const you#f2be3098 = Employee#7c386be0{...me#8b5e50c4, address#7c386be0#0: "Yes"}
```
*/
export const hash_f2be3098: t_7c386be0 = ({ ...hash_8b5e50c4,
  type: "7c386be0",
  h7c386be0_0: "Yes"
} as t_7c386be0);

/**
```
const alsoMe#5f189724 = Person#1e5bfcf4{...me#8b5e50c4, what#1e5bfcf4#0: 11}
```
*/
export const hash_5f189724: t_1e5bfcf4 = ({ ...hash_8b5e50c4,
  type: "1e5bfcf4",
  h1e5bfcf4_0: 11
} as t_1e5bfcf4);

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
const getName#99997058 = <T#:0: Person#1e5bfcf4>(m#:0: T#:0): string#builtin ={}> m#:0.name#7ffb15a6#0
```
*/
export const hash_99997058: <T_0 extends {
  h1e5bfcf4_0: number;
  h7ffb15a6_0: string;
  h5dc1538c_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h1e5bfcf4_0: number;
  h7ffb15a6_0: string;
  h5dc1538c_0: number;
}>(m: T_0) => m.h7ffb15a6_0;

/*
me#8b5e50c4.name#7ffb15a6#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_8b5e50c4.h7ffb15a6_0, "June");

/*
me#8b5e50c4.age#5dc1538c#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_8b5e50c4.h5dc1538c_0, 10);

/*
alsoMe#5f189724.name#7ffb15a6#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5f189724.h7ffb15a6_0, "June");

/*
alsoMe#5f189724.what#1e5bfcf4#0 ==#9275f914#553b4b8e#0 11
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5f189724.h1e5bfcf4_0, 11);

/*
you#f2be3098.name#7ffb15a6#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_f2be3098.h7ffb15a6_0, "June");

/*
them#7fa2bdd0.name#7ffb15a6#0 ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7fa2bdd0.h7ffb15a6_0, "You");

/*
them#7fa2bdd0.address#7c386be0#0 ==#606c7034#553b4b8e#0 "No"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7fa2bdd0.h7c386be0_0, "No");

/*
getName#99997058<Person#1e5bfcf4>(m: me#8b5e50c4) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_99997058(hash_8b5e50c4), "June");

/*
getName#99997058<Employee#7c386be0>(m: them#7fa2bdd0) ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_99997058(hash_7fa2bdd0), "You");

/*
here#22e3486e.occupant#6febb808#0.name#7ffb15a6#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_22e3486e.h6febb808_0.h7ffb15a6_0, "June");

/*
countMe#3115ea0c.item#28ad7060#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_3115ea0c.h28ad7060_0, 10);

/*
Counter#28ad7060<() ={}> string#builtin>{
        item#28ad7060#0: (): string#builtin ={}> "hi",
        count#28ad7060#1: 10,
    }.item#28ad7060#0() 
    ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "28ad7060",
  h28ad7060_0: () => "hi",
  h28ad7060_1: 10
} as t_28ad7060<() => string>).h28ad7060_0(), "hi");

/*
countAny#b9763660.item#28ad7060#0<string#builtin>("String") ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_b9763660.h28ad7060_0("String"), "hi");

/*
countAny#b9763660.item#28ad7060#0<int#builtin>(10) ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_b9763660.h28ad7060_0(10), "hi");

/*
countNamed#1d40b8c5.item#28ad7060#0<Person#1e5bfcf4>(me#8b5e50c4) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d40b8c5.h28ad7060_0(hash_8b5e50c4), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#9275f914#553b4b8e#0 5
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#7b334d8c{...aDog#119b34f9, ...aPerson#3602ea70}.name#7ffb15a6#0 
    ==#606c7034#553b4b8e#0 "ralf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_119b34f9,
  ...hash_3602ea70,
  type: "7b334d8c"
} as t_7b334d8c).h7ffb15a6_0, "ralf");

/*
WereWolf#7b334d8c{...aPerson#3602ea70, ...aDog#119b34f9}.name#7ffb15a6#0 
    ==#606c7034#553b4b8e#0 "wolrf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_3602ea70,
  ...hash_119b34f9,
  type: "7b334d8c"
} as t_7b334d8c).h7ffb15a6_0, "wolrf");