import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#101ec344 = {
    age: int,
}
```
*/
type t_101ec344 = {
  type: "101ec344";
  h101ec344_0: number;
};

/**
```
type HasName#6884cdfb = {
    name: string,
}
```
*/
type t_6884cdfb = {
  type: "6884cdfb";
  h6884cdfb_0: string;
};

/**
```
type Person#3db80978 = {
    ...HasName#6884cdfb,
    ...HasAge#101ec344,
    what: int,
}
```
*/
type t_3db80978 = {
  type: "3db80978";
  h3db80978_0: number;
  h6884cdfb_0: string;
  h101ec344_0: number;
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
type Employee#4c9268c0 = {
    ...Person#3db80978,
    address: string,
}
```
*/
type t_4c9268c0 = {
  type: "4c9268c0";
  h4c9268c0_0: string;
  h3db80978_0: number;
  h6884cdfb_0: string;
  h101ec344_0: number;
};

/**
```
type House#7ff302d2 = {
    occupant: Person#3db80978,
}
```
*/
type t_7ff302d2 = {
  type: "7ff302d2";
  h7ff302d2_0: t_3db80978;
};

/**
```
type Counter#125b691c<T#:0> = {
    item: T#:0,
    count: int,
}
```
*/
type t_125b691c<T_0> = {
  type: "125b691c";
  h125b691c_0: T_0;
  h125b691c_1: number;
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
type Animal#31541c9a = {
    ...HasName#6884cdfb,
    furColor: string,
}
```
*/
type t_31541c9a = {
  type: "31541c9a";
  h31541c9a_0: string;
  h6884cdfb_0: string;
};

/**
```
const me#03660c54: Person#3db80978 = Person#3db80978{
    name#6884cdfb#0: "June",
    age#101ec344#0: 10,
    what#3db80978#0: 3,
}
```
*/
export const hash_03660c54: t_3db80978 = ({
  type: "3db80978",
  h6884cdfb_0: "June",
  h101ec344_0: 10,
  h3db80978_0: 3
} as t_3db80978);

/**
```
const aDog#1e14ea14: Animal#31541c9a = Animal#31541c9a{
    name#6884cdfb#0: "wolrf",
    furColor#31541c9a#0: "red",
}
```
*/
export const hash_1e14ea14: t_31541c9a = ({
  type: "31541c9a",
  h6884cdfb_0: "wolrf",
  h31541c9a_0: "red"
} as t_31541c9a);

/**
```
const gotit#9781cfa0: Some#Some<int> = Some#Some<int>{contents#Some#0: 5}
```
*/
export const hash_9781cfa0: t_Some<number> = ({
  type: "Some",
  hSome_0: 5
} as t_Some<number>);

/**
```
const countNamed#7eff579e: Counter#125b691c<<T#:0: HasName#6884cdfb>(T#:0) ={}> string> = Counter#125b691c<
    <T#:0: HasName#6884cdfb>(T#:0) ={}> string,
>{
    item#125b691c#0: <T#:0: HasName#6884cdfb>(input#:0: T#:0) ={}> input#:0.name#6884cdfb#0,
    count#125b691c#1: 10,
}
```
*/
export const hash_7eff579e: t_125b691c<<T_0 extends {
  h6884cdfb_0: string;
}>(arg_0: T_0) => string> = ({
  type: "125b691c",
  h125b691c_0: <T_0 extends {
    h6884cdfb_0: string;
  }>(input: T_0) => input.h6884cdfb_0,
  h125b691c_1: 10
} as t_125b691c<<T_0 extends {
  h6884cdfb_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#341e618e: Counter#125b691c<<T#:0>(T#:0) ={}> string> = Counter#125b691c<
    <T#:0>(T#:0) ={}> string,
>{item#125b691c#0: <T#:0>(input#:0: T#:0) ={}> "hi", count#125b691c#1: 10}
```
*/
export const hash_341e618e: t_125b691c<<T_0>(arg_0: T_0) => string> = ({
  type: "125b691c",
  h125b691c_0: <T_0>(input: T_0) => "hi",
  h125b691c_1: 10
} as t_125b691c<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#4688e5fe: Counter#125b691c<int> = Counter#125b691c<int>{
    item#125b691c#0: 10,
    count#125b691c#1: 4000,
}
```
*/
export const hash_4688e5fe: t_125b691c<number> = ({
  type: "125b691c",
  h125b691c_0: 10,
  h125b691c_1: 4000
} as t_125b691c<number>);

/**
```
const here#5dfb20a2: House#7ff302d2 = House#7ff302d2{occupant#7ff302d2#0: me#03660c54}
```
*/
export const hash_5dfb20a2: t_7ff302d2 = ({
  type: "7ff302d2",
  h7ff302d2_0: hash_03660c54
} as t_7ff302d2);

/**
```
const getName#366b982a: <T#:0: Person#3db80978>(T#:0) ={}> string = <T#:0: Person#3db80978>(
    m#:0: T#:0,
) ={}> m#:0.name#6884cdfb#0
```
*/
export const hash_366b982a: <T_0 extends {
  h3db80978_0: number;
  h6884cdfb_0: string;
  h101ec344_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h3db80978_0: number;
  h6884cdfb_0: string;
  h101ec344_0: number;
}>(m: T_0) => m.h6884cdfb_0;

/**
```
const them#39bd7876: Employee#4c9268c0 = Employee#4c9268c0{
    what#3db80978#0: 3,
    name#6884cdfb#0: "You",
    age#101ec344#0: 100,
    address#4c9268c0#0: "No",
}
```
*/
export const hash_39bd7876: t_4c9268c0 = ({
  type: "4c9268c0",
  h3db80978_0: 3,
  h6884cdfb_0: "You",
  h101ec344_0: 100,
  h4c9268c0_0: "No"
} as t_4c9268c0);

/**
```
const you#e62122c4: Employee#4c9268c0 = Employee#4c9268c0{...me#03660c54, address#4c9268c0#0: "Yes"}
```
*/
export const hash_e62122c4: t_4c9268c0 = ({ ...hash_03660c54,
  type: "4c9268c0",
  h4c9268c0_0: "Yes"
} as t_4c9268c0);

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
const aPerson#48019860: Person#3db80978 = Person#3db80978{
    name#6884cdfb#0: "ralf",
    age#101ec344#0: 23,
    what#3db80978#0: 2,
}
```
*/
export const hash_48019860: t_3db80978 = ({
  type: "3db80978",
  h6884cdfb_0: "ralf",
  h101ec344_0: 23,
  h3db80978_0: 2
} as t_3db80978);

/**
```
const alsoMe#21133749: Person#3db80978 = Person#3db80978{...me#03660c54, what#3db80978#0: 11}
```
*/
export const hash_21133749: t_3db80978 = ({ ...hash_03660c54,
  type: "3db80978",
  h3db80978_0: 11
} as t_3db80978);

/*
StringEq#606c7034."=="#553b4b8e#0(me#03660c54.name#6884cdfb#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_03660c54.h6884cdfb_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(me#03660c54.age#101ec344#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_03660c54.h101ec344_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(alsoMe#21133749.name#6884cdfb#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_21133749.h6884cdfb_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(alsoMe#21133749.what#3db80978#0, 11)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_21133749.h3db80978_0, 11);

/*
StringEq#606c7034."=="#553b4b8e#0(you#e62122c4.name#6884cdfb#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_e62122c4.h6884cdfb_0, "June");

/*
StringEq#606c7034."=="#553b4b8e#0(them#39bd7876.name#6884cdfb#0, "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_39bd7876.h6884cdfb_0, "You");

/*
StringEq#606c7034."=="#553b4b8e#0(them#39bd7876.address#4c9268c0#0, "No")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_39bd7876.h4c9268c0_0, "No");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#366b982a<Person#3db80978>(me#03660c54), "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_366b982a(hash_03660c54), "June");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#366b982a<Employee#4c9268c0>(them#39bd7876), "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_366b982a(hash_39bd7876), "You");

/*
StringEq#606c7034."=="#553b4b8e#0(here#5dfb20a2.occupant#7ff302d2#0.name#6884cdfb#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5dfb20a2.h7ff302d2_0.h6884cdfb_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(countMe#4688e5fe.item#125b691c#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_4688e5fe.h125b691c_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(
    Counter#125b691c<() ={}> string>{item#125b691c#0: () ={}> "hi", count#125b691c#1: 10}.item#125b691c#0(),
    "hi",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "125b691c",
  h125b691c_0: () => "hi",
  h125b691c_1: 10
} as t_125b691c<() => string>).h125b691c_0(), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#341e618e.item#125b691c#0<string>("String"), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_341e618e.h125b691c_0("String"), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#341e618e.item#125b691c#0<int>(10), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_341e618e.h125b691c_0(10), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(
    countNamed#7eff579e.item#125b691c#0<Person#3db80978>(me#03660c54),
    "June",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7eff579e.h125b691c_0(hash_03660c54), "June");

/*
IntEq#9275f914."=="#553b4b8e#0(gotit#9781cfa0.contents#Some#0, 5)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#98b94e48{...aDog#1e14ea14, ...aPerson#48019860}.name#6884cdfb#0,
    "ralf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_1e14ea14,
  ...hash_48019860,
  type: "98b94e48"
} as t_98b94e48).h6884cdfb_0, "ralf");

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#98b94e48{...aPerson#48019860, ...aDog#1e14ea14}.name#6884cdfb#0,
    "wolrf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_48019860,
  ...hash_1e14ea14,
  type: "98b94e48"
} as t_98b94e48).h6884cdfb_0, "wolrf");