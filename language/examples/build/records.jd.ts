import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#148cd2ed = {
    age: int#builtin,
}
```
*/
type t_148cd2ed = {
  type: "148cd2ed";
  h148cd2ed_0: number;
};

/**
```
type HasName#c1c230b4 = {
    name: string#builtin,
}
```
*/
type t_c1c230b4 = {
  type: "c1c230b4";
  hc1c230b4_0: string;
};

/**
```
type Person#4884c1cc = {
    ...HasName#c1c230b4,
    ...HasAge#148cd2ed,
    what: int#builtin,
}
```
*/
type t_4884c1cc = {
  type: "4884c1cc";
  h4884c1cc_0: number;
  hc1c230b4_0: string;
  h148cd2ed_0: number;
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
type Employee#0a4b5426 = {
    ...Person#4884c1cc,
    address: string#builtin,
}
```
*/
type t_0a4b5426 = {
  type: "0a4b5426";
  h0a4b5426_0: string;
  h4884c1cc_0: number;
  hc1c230b4_0: string;
  h148cd2ed_0: number;
};

/**
```
type Counter#2ef58180<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_2ef58180<T_0> = {
  type: "2ef58180";
  h2ef58180_0: T_0;
  h2ef58180_1: number;
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
type Animal#5b6b8606 = {
    ...HasName#c1c230b4,
    furColor: string#builtin,
}
```
*/
type t_5b6b8606 = {
  type: "5b6b8606";
  h5b6b8606_0: string;
  hc1c230b4_0: string;
};

/**
```
type House#32125340 = {
    occupant: Person#4884c1cc,
}
```
*/
type t_32125340 = {
  type: "32125340";
  h32125340_0: t_4884c1cc;
};

/**
```
const me#5a30e7b0 = Person#4884c1cc{
    name#c1c230b4#0: "June",
    age#148cd2ed#0: 10,
    what#4884c1cc#0: 3,
}
```
*/
export const hash_5a30e7b0: t_4884c1cc = ({
  type: "4884c1cc",
  hc1c230b4_0: "June",
  h148cd2ed_0: 10,
  h4884c1cc_0: 3
} as t_4884c1cc);

/**
```
const aPerson#461db524 = Person#4884c1cc{
    name#c1c230b4#0: "ralf",
    age#148cd2ed#0: 23,
    what#4884c1cc#0: 2,
}
```
*/
export const hash_461db524: t_4884c1cc = ({
  type: "4884c1cc",
  hc1c230b4_0: "ralf",
  h148cd2ed_0: 23,
  h4884c1cc_0: 2
} as t_4884c1cc);

/**
```
const aDog#6f7dec51 = Animal#5b6b8606{name#c1c230b4#0: "wolrf", furColor#5b6b8606#0: "red"}
```
*/
export const hash_6f7dec51: t_5b6b8606 = ({
  type: "5b6b8606",
  hc1c230b4_0: "wolrf",
  h5b6b8606_0: "red"
} as t_5b6b8606);

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
const countNamed#887a5008 = Counter#2ef58180<<T#:0: HasName#c1c230b4>(T#:0) ={}> string#builtin>{
    item#2ef58180#0: <T#:0: HasName#c1c230b4>(input#:0: T#:0): string#builtin ={}> input#:0.name#c1c230b4#0,
    count#2ef58180#1: 10,
}
```
*/
export const hash_887a5008: t_2ef58180<<T_0 extends {
  hc1c230b4_0: string;
}>(arg_0: T_0) => string> = ({
  type: "2ef58180",
  h2ef58180_0: <T_0 extends {
    hc1c230b4_0: string;
  }>(input: T_0) => input.hc1c230b4_0,
  h2ef58180_1: 10
} as t_2ef58180<<T_0 extends {
  hc1c230b4_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#b2cfc534 = Counter#2ef58180<<T#:0>(T#:0) ={}> string#builtin>{
    item#2ef58180#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#2ef58180#1: 10,
}
```
*/
export const hash_b2cfc534: t_2ef58180<<T_0>(arg_0: T_0) => string> = ({
  type: "2ef58180",
  h2ef58180_0: <T_0>(input: T_0) => "hi",
  h2ef58180_1: 10
} as t_2ef58180<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#782e3155 = Counter#2ef58180<int#builtin>{
    item#2ef58180#0: 10,
    count#2ef58180#1: 4000,
}
```
*/
export const hash_782e3155: t_2ef58180<number> = ({
  type: "2ef58180",
  h2ef58180_0: 10,
  h2ef58180_1: 4000
} as t_2ef58180<number>);

/**
```
const here#736ebd4c = House#32125340{occupant#32125340#0: me#5a30e7b0}
```
*/
export const hash_736ebd4c: t_32125340 = ({
  type: "32125340",
  h32125340_0: hash_5a30e7b0
} as t_32125340);

/**
```
const getName#7e5ab133 = <T#:0: Person#4884c1cc>(m#:0: T#:0): string#builtin ={}> m#:0.name#c1c230b4#0
```
*/
export const hash_7e5ab133: <T_0 extends {
  h4884c1cc_0: number;
  hc1c230b4_0: string;
  h148cd2ed_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h4884c1cc_0: number;
  hc1c230b4_0: string;
  h148cd2ed_0: number;
}>(m: T_0) => m.hc1c230b4_0;

/**
```
const them#76a6b4c6 = Employee#0a4b5426{
    what#4884c1cc#0: 3,
    name#c1c230b4#0: "You",
    age#148cd2ed#0: 100,
    address#0a4b5426#0: "No",
}
```
*/
export const hash_76a6b4c6: t_0a4b5426 = ({
  type: "0a4b5426",
  h4884c1cc_0: 3,
  hc1c230b4_0: "You",
  h148cd2ed_0: 100,
  h0a4b5426_0: "No"
} as t_0a4b5426);

/**
```
const you#051d22ce = Employee#0a4b5426{...me#5a30e7b0, address#0a4b5426#0: "Yes"}
```
*/
export const hash_051d22ce: t_0a4b5426 = ({ ...hash_5a30e7b0,
  type: "0a4b5426",
  h0a4b5426_0: "Yes"
} as t_0a4b5426);

/**
```
const alsoMe#6e5e11fe = Person#4884c1cc{...me#5a30e7b0, what#4884c1cc#0: 11}
```
*/
export const hash_6e5e11fe: t_4884c1cc = ({ ...hash_5a30e7b0,
  type: "4884c1cc",
  h4884c1cc_0: 11
} as t_4884c1cc);

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
me#5a30e7b0.name#c1c230b4#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5a30e7b0.hc1c230b4_0, "June");

/*
me#5a30e7b0.age#148cd2ed#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5a30e7b0.h148cd2ed_0, 10);

/*
alsoMe#6e5e11fe.name#c1c230b4#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_6e5e11fe.hc1c230b4_0, "June");

/*
alsoMe#6e5e11fe.what#4884c1cc#0 ==#9275f914#553b4b8e#0 11
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_6e5e11fe.h4884c1cc_0, 11);

/*
you#051d22ce.name#c1c230b4#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_051d22ce.hc1c230b4_0, "June");

/*
them#76a6b4c6.name#c1c230b4#0 ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_76a6b4c6.hc1c230b4_0, "You");

/*
them#76a6b4c6.address#0a4b5426#0 ==#606c7034#553b4b8e#0 "No"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_76a6b4c6.h0a4b5426_0, "No");

/*
getName#7e5ab133<Person#4884c1cc>(m: me#5a30e7b0) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7e5ab133(hash_5a30e7b0), "June");

/*
getName#7e5ab133<Employee#0a4b5426>(m: them#76a6b4c6) ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7e5ab133(hash_76a6b4c6), "You");

/*
here#736ebd4c.occupant#32125340#0.name#c1c230b4#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_736ebd4c.h32125340_0.hc1c230b4_0, "June");

/*
countMe#782e3155.item#2ef58180#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_782e3155.h2ef58180_0, 10);

/*
Counter#2ef58180<() ={}> string#builtin>{
        item#2ef58180#0: (): string#builtin ={}> "hi",
        count#2ef58180#1: 10,
    }.item#2ef58180#0() 
    ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "2ef58180",
  h2ef58180_0: () => "hi",
  h2ef58180_1: 10
} as t_2ef58180<() => string>).h2ef58180_0(), "hi");

/*
countAny#b2cfc534.item#2ef58180#0<string#builtin>("String") ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_b2cfc534.h2ef58180_0("String"), "hi");

/*
countAny#b2cfc534.item#2ef58180#0<int#builtin>(10) ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_b2cfc534.h2ef58180_0(10), "hi");

/*
countNamed#887a5008.item#2ef58180#0<Person#4884c1cc>(me#5a30e7b0) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_887a5008.h2ef58180_0(hash_5a30e7b0), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#9275f914#553b4b8e#0 5
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#ef8e9400{...aDog#6f7dec51, ...aPerson#461db524}.name#c1c230b4#0 
    ==#606c7034#553b4b8e#0 "ralf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_6f7dec51,
  ...hash_461db524,
  type: "ef8e9400"
} as t_ef8e9400).hc1c230b4_0, "ralf");

/*
WereWolf#ef8e9400{...aPerson#461db524, ...aDog#6f7dec51}.name#c1c230b4#0 
    ==#606c7034#553b4b8e#0 "wolrf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_461db524,
  ...hash_6f7dec51,
  type: "ef8e9400"
} as t_ef8e9400).hc1c230b4_0, "wolrf");