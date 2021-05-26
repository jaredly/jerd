import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#51cfc6f4 = {
    age: int,
}
```
*/
type t_51cfc6f4 = {
  type: "51cfc6f4";
  h51cfc6f4_0: number;
};

/**
```
type HasName#6dee38a4 = {
    name: string,
}
```
*/
type t_6dee38a4 = {
  type: "6dee38a4";
  h6dee38a4_0: string;
};

/**
```
type Person#5ea2ba3c = {
    ...HasName#6dee38a4,
    ...HasAge#51cfc6f4,
    what: int,
}
```
*/
type t_5ea2ba3c = {
  type: "5ea2ba3c";
  h5ea2ba3c_0: number;
  h6dee38a4_0: string;
  h51cfc6f4_0: number;
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
type Employee#62a6242b = {
    ...Person#5ea2ba3c,
    address: string,
}
```
*/
type t_62a6242b = {
  type: "62a6242b";
  h62a6242b_0: string;
  h5ea2ba3c_0: number;
  h6dee38a4_0: string;
  h51cfc6f4_0: number;
};

/**
```
type Counter#7a48b20c<T#:0> = {
    item: T#:0,
    count: int,
}
```
*/
type t_7a48b20c<T_0> = {
  type: "7a48b20c";
  h7a48b20c_0: T_0;
  h7a48b20c_1: number;
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
type Animal#0d456e64 = {
    ...HasName#6dee38a4,
    furColor: string,
}
```
*/
type t_0d456e64 = {
  type: "0d456e64";
  h0d456e64_0: string;
  h6dee38a4_0: string;
};

/**
```
type House#71931750 = {
    occupant: Person#5ea2ba3c,
}
```
*/
type t_71931750 = {
  type: "71931750";
  h71931750_0: t_5ea2ba3c;
};

/**
```
const me#5c742a35: Person#5ea2ba3c = Person#5ea2ba3c{
    name#6dee38a4#0: "June",
    age#51cfc6f4#0: 10,
    what#5ea2ba3c#0: 3,
}
```
*/
export const hash_5c742a35: t_5ea2ba3c = ({
  type: "5ea2ba3c",
  h6dee38a4_0: "June",
  h51cfc6f4_0: 10,
  h5ea2ba3c_0: 3
} as t_5ea2ba3c);

/**
```
const aPerson#1af7d91c: Person#5ea2ba3c = Person#5ea2ba3c{
    name#6dee38a4#0: "ralf",
    age#51cfc6f4#0: 23,
    what#5ea2ba3c#0: 2,
}
```
*/
export const hash_1af7d91c: t_5ea2ba3c = ({
  type: "5ea2ba3c",
  h6dee38a4_0: "ralf",
  h51cfc6f4_0: 23,
  h5ea2ba3c_0: 2
} as t_5ea2ba3c);

/**
```
const aDog#6d91f0dc: Animal#0d456e64 = Animal#0d456e64{
    name#6dee38a4#0: "wolrf",
    furColor#0d456e64#0: "red",
}
```
*/
export const hash_6d91f0dc: t_0d456e64 = ({
  type: "0d456e64",
  h6dee38a4_0: "wolrf",
  h0d456e64_0: "red"
} as t_0d456e64);

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
const countNamed#2b7a7bbe: Counter#7a48b20c<<T#:0: HasName#6dee38a4>(T#:0) ={}> string> = Counter#7a48b20c<
    <T#:0: HasName#6dee38a4>(T#:0) ={}> string,
>{
    item#7a48b20c#0: <T#:0: HasName#6dee38a4>(input#:0: T#:0) ={}> input#:0.name#6dee38a4#0,
    count#7a48b20c#1: 10,
}
```
*/
export const hash_2b7a7bbe: t_7a48b20c<<T_0 extends {
  h6dee38a4_0: string;
}>(arg_0: T_0) => string> = ({
  type: "7a48b20c",
  h7a48b20c_0: <T_0 extends {
    h6dee38a4_0: string;
  }>(input: T_0) => input.h6dee38a4_0,
  h7a48b20c_1: 10
} as t_7a48b20c<<T_0 extends {
  h6dee38a4_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#773a0500: Counter#7a48b20c<<T#:0>(T#:0) ={}> string> = Counter#7a48b20c<
    <T#:0>(T#:0) ={}> string,
>{item#7a48b20c#0: <T#:0>(input#:0: T#:0) ={}> "hi", count#7a48b20c#1: 10}
```
*/
export const hash_773a0500: t_7a48b20c<<T_0>(arg_0: T_0) => string> = ({
  type: "7a48b20c",
  h7a48b20c_0: <T_0>(input: T_0) => "hi",
  h7a48b20c_1: 10
} as t_7a48b20c<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#5e0cde84: Counter#7a48b20c<int> = Counter#7a48b20c<int>{
    item#7a48b20c#0: 10,
    count#7a48b20c#1: 4000,
}
```
*/
export const hash_5e0cde84: t_7a48b20c<number> = ({
  type: "7a48b20c",
  h7a48b20c_0: 10,
  h7a48b20c_1: 4000
} as t_7a48b20c<number>);

/**
```
const here#d01cd094: House#71931750 = House#71931750{occupant#71931750#0: me#5c742a35}
```
*/
export const hash_d01cd094: t_71931750 = ({
  type: "71931750",
  h71931750_0: hash_5c742a35
} as t_71931750);

/**
```
const getName#cbde9f3a: <T#:0: Person#5ea2ba3c>(T#:0) ={}> string = <T#:0: Person#5ea2ba3c>(
    m#:0: T#:0,
) ={}> m#:0.name#6dee38a4#0
```
*/
export const hash_cbde9f3a: <T_0 extends {
  h5ea2ba3c_0: number;
  h6dee38a4_0: string;
  h51cfc6f4_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h5ea2ba3c_0: number;
  h6dee38a4_0: string;
  h51cfc6f4_0: number;
}>(m: T_0) => m.h6dee38a4_0;

/**
```
const them#5eaf46e1: Employee#62a6242b = Employee#62a6242b{
    what#5ea2ba3c#0: 3,
    name#6dee38a4#0: "You",
    age#51cfc6f4#0: 100,
    address#62a6242b#0: "No",
}
```
*/
export const hash_5eaf46e1: t_62a6242b = ({
  type: "62a6242b",
  h5ea2ba3c_0: 3,
  h6dee38a4_0: "You",
  h51cfc6f4_0: 100,
  h62a6242b_0: "No"
} as t_62a6242b);

/**
```
const you#3b3203e8: Employee#62a6242b = Employee#62a6242b{...me#5c742a35, address#62a6242b#0: "Yes"}
```
*/
export const hash_3b3203e8: t_62a6242b = ({ ...hash_5c742a35,
  type: "62a6242b",
  h62a6242b_0: "Yes"
} as t_62a6242b);

/**
```
const alsoMe#5c18746e: Person#5ea2ba3c = Person#5ea2ba3c{...me#5c742a35, what#5ea2ba3c#0: 11}
```
*/
export const hash_5c18746e: t_5ea2ba3c = ({ ...hash_5c742a35,
  type: "5ea2ba3c",
  h5ea2ba3c_0: 11
} as t_5ea2ba3c);

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

/*
StringEq#606c7034."=="#553b4b8e#0(me#5c742a35.name#6dee38a4#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5c742a35.h6dee38a4_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(me#5c742a35.age#51cfc6f4#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5c742a35.h51cfc6f4_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(alsoMe#5c18746e.name#6dee38a4#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5c18746e.h6dee38a4_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(alsoMe#5c18746e.what#5ea2ba3c#0, 11)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5c18746e.h5ea2ba3c_0, 11);

/*
StringEq#606c7034."=="#553b4b8e#0(you#3b3203e8.name#6dee38a4#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3b3203e8.h6dee38a4_0, "June");

/*
StringEq#606c7034."=="#553b4b8e#0(them#5eaf46e1.name#6dee38a4#0, "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5eaf46e1.h6dee38a4_0, "You");

/*
StringEq#606c7034."=="#553b4b8e#0(them#5eaf46e1.address#62a6242b#0, "No")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5eaf46e1.h62a6242b_0, "No");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#cbde9f3a<Person#5ea2ba3c>(me#5c742a35), "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_cbde9f3a(hash_5c742a35), "June");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#cbde9f3a<Employee#62a6242b>(them#5eaf46e1), "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_cbde9f3a(hash_5eaf46e1), "You");

/*
StringEq#606c7034."=="#553b4b8e#0(here#d01cd094.occupant#71931750#0.name#6dee38a4#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_d01cd094.h71931750_0.h6dee38a4_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(countMe#5e0cde84.item#7a48b20c#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5e0cde84.h7a48b20c_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(
    Counter#7a48b20c<() ={}> string>{item#7a48b20c#0: () ={}> "hi", count#7a48b20c#1: 10}.item#7a48b20c#0(),
    "hi",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "7a48b20c",
  h7a48b20c_0: () => "hi",
  h7a48b20c_1: 10
} as t_7a48b20c<() => string>).h7a48b20c_0(), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#773a0500.item#7a48b20c#0<string>("String"), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_773a0500.h7a48b20c_0("String"), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#773a0500.item#7a48b20c#0<int>(10), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_773a0500.h7a48b20c_0(10), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(
    countNamed#2b7a7bbe.item#7a48b20c#0<Person#5ea2ba3c>(me#5c742a35),
    "June",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2b7a7bbe.h7a48b20c_0(hash_5c742a35), "June");

/*
IntEq#9275f914."=="#553b4b8e#0(gotit#9781cfa0.contents#Some#0, 5)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#55b66023{...aDog#6d91f0dc, ...aPerson#1af7d91c}.name#6dee38a4#0,
    "ralf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_6d91f0dc,
  ...hash_1af7d91c,
  type: "55b66023"
} as t_55b66023).h6dee38a4_0, "ralf");

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#55b66023{...aPerson#1af7d91c, ...aDog#6d91f0dc}.name#6dee38a4#0,
    "wolrf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_1af7d91c,
  ...hash_6d91f0dc,
  type: "55b66023"
} as t_55b66023).h6dee38a4_0, "wolrf");