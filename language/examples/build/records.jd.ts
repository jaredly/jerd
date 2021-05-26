import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#6124659c = {
    age: int,
}
```
*/
type t_6124659c = {
  type: "6124659c";
  h6124659c_0: number;
};

/**
```
type HasName#6a039486 = {
    name: string,
}
```
*/
type t_6a039486 = {
  type: "6a039486";
  h6a039486_0: string;
};

/**
```
type Person#f3071cb4 = {
    ...HasName#6a039486,
    ...HasAge#6124659c,
    what: int,
}
```
*/
type t_f3071cb4 = {
  type: "f3071cb4";
  hf3071cb4_0: number;
  h6a039486_0: string;
  h6124659c_0: number;
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
type Employee#26bae8cc = {
    ...Person#f3071cb4,
    address: string,
}
```
*/
type t_26bae8cc = {
  type: "26bae8cc";
  h26bae8cc_0: string;
  hf3071cb4_0: number;
  h6a039486_0: string;
  h6124659c_0: number;
};

/**
```
type House#62e9902a = {
    occupant: Person#f3071cb4,
}
```
*/
type t_62e9902a = {
  type: "62e9902a";
  h62e9902a_0: t_f3071cb4;
};

/**
```
type Counter#63e99840<T#:0> = {
    item: T#:0,
    count: int,
}
```
*/
type t_63e99840<T_0> = {
  type: "63e99840";
  h63e99840_0: T_0;
  h63e99840_1: number;
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
type Animal#7857e0fa = {
    ...HasName#6a039486,
    furColor: string,
}
```
*/
type t_7857e0fa = {
  type: "7857e0fa";
  h7857e0fa_0: string;
  h6a039486_0: string;
};

/**
```
const me#5e45983c: Person#f3071cb4 = Person#f3071cb4{
    name#6a039486#0: "June",
    age#6124659c#0: 10,
    what#f3071cb4#0: 3,
}
```
*/
export const hash_5e45983c: t_f3071cb4 = ({
  type: "f3071cb4",
  h6a039486_0: "June",
  h6124659c_0: 10,
  hf3071cb4_0: 3
} as t_f3071cb4);

/**
```
const aPerson#70b89ec9: Person#f3071cb4 = Person#f3071cb4{
    name#6a039486#0: "ralf",
    age#6124659c#0: 23,
    what#f3071cb4#0: 2,
}
```
*/
export const hash_70b89ec9: t_f3071cb4 = ({
  type: "f3071cb4",
  h6a039486_0: "ralf",
  h6124659c_0: 23,
  hf3071cb4_0: 2
} as t_f3071cb4);

/**
```
const aDog#ed5b05d8: Animal#7857e0fa = Animal#7857e0fa{
    name#6a039486#0: "wolrf",
    furColor#7857e0fa#0: "red",
}
```
*/
export const hash_ed5b05d8: t_7857e0fa = ({
  type: "7857e0fa",
  h6a039486_0: "wolrf",
  h7857e0fa_0: "red"
} as t_7857e0fa);

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
const countNamed#6c9369de: Counter#63e99840<<T#:0: HasName#6a039486>(T#:0) ={}> string> = Counter#63e99840<
    <T#:0: HasName#6a039486>(T#:0) ={}> string,
>{
    item#63e99840#0: <T#:0: HasName#6a039486>(input#:0: T#:0) ={}> input#:0.name#6a039486#0,
    count#63e99840#1: 10,
}
```
*/
export const hash_6c9369de: t_63e99840<<T_0 extends {
  h6a039486_0: string;
}>(arg_0: T_0) => string> = ({
  type: "63e99840",
  h63e99840_0: <T_0 extends {
    h6a039486_0: string;
  }>(input: T_0) => input.h6a039486_0,
  h63e99840_1: 10
} as t_63e99840<<T_0 extends {
  h6a039486_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#0b9f92a4: Counter#63e99840<<T#:0>(T#:0) ={}> string> = Counter#63e99840<
    <T#:0>(T#:0) ={}> string,
>{item#63e99840#0: <T#:0>(input#:0: T#:0) ={}> "hi", count#63e99840#1: 10}
```
*/
export const hash_0b9f92a4: t_63e99840<<T_0>(arg_0: T_0) => string> = ({
  type: "63e99840",
  h63e99840_0: <T_0>(input: T_0) => "hi",
  h63e99840_1: 10
} as t_63e99840<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#e777cbc8: Counter#63e99840<int> = Counter#63e99840<int>{
    item#63e99840#0: 10,
    count#63e99840#1: 4000,
}
```
*/
export const hash_e777cbc8: t_63e99840<number> = ({
  type: "63e99840",
  h63e99840_0: 10,
  h63e99840_1: 4000
} as t_63e99840<number>);

/**
```
const here#1f9be1f8: House#62e9902a = House#62e9902a{occupant#62e9902a#0: me#5e45983c}
```
*/
export const hash_1f9be1f8: t_62e9902a = ({
  type: "62e9902a",
  h62e9902a_0: hash_5e45983c
} as t_62e9902a);

/**
```
const getName#0bf244a2: <T#:0: Person#f3071cb4>(T#:0) ={}> string = <T#:0: Person#f3071cb4>(
    m#:0: T#:0,
) ={}> m#:0.name#6a039486#0
```
*/
export const hash_0bf244a2: <T_0 extends {
  hf3071cb4_0: number;
  h6a039486_0: string;
  h6124659c_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  hf3071cb4_0: number;
  h6a039486_0: string;
  h6124659c_0: number;
}>(m: T_0) => m.h6a039486_0;

/**
```
const them#2e0e7030: Employee#26bae8cc = Employee#26bae8cc{
    what#f3071cb4#0: 3,
    name#6a039486#0: "You",
    age#6124659c#0: 100,
    address#26bae8cc#0: "No",
}
```
*/
export const hash_2e0e7030: t_26bae8cc = ({
  type: "26bae8cc",
  hf3071cb4_0: 3,
  h6a039486_0: "You",
  h6124659c_0: 100,
  h26bae8cc_0: "No"
} as t_26bae8cc);

/**
```
const you#084506a4: Employee#26bae8cc = Employee#26bae8cc{...me#5e45983c, address#26bae8cc#0: "Yes"}
```
*/
export const hash_084506a4: t_26bae8cc = ({ ...hash_5e45983c,
  type: "26bae8cc",
  h26bae8cc_0: "Yes"
} as t_26bae8cc);

/**
```
const alsoMe#7c36939a: Person#f3071cb4 = Person#f3071cb4{...me#5e45983c, what#f3071cb4#0: 11}
```
*/
export const hash_7c36939a: t_f3071cb4 = ({ ...hash_5e45983c,
  type: "f3071cb4",
  hf3071cb4_0: 11
} as t_f3071cb4);

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
StringEq#606c7034."=="#553b4b8e#0(me#5e45983c.name#6a039486#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5e45983c.h6a039486_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(me#5e45983c.age#6124659c#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5e45983c.h6124659c_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(alsoMe#7c36939a.name#6a039486#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7c36939a.h6a039486_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(alsoMe#7c36939a.what#f3071cb4#0, 11)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_7c36939a.hf3071cb4_0, 11);

/*
StringEq#606c7034."=="#553b4b8e#0(you#084506a4.name#6a039486#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_084506a4.h6a039486_0, "June");

/*
StringEq#606c7034."=="#553b4b8e#0(them#2e0e7030.name#6a039486#0, "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2e0e7030.h6a039486_0, "You");

/*
StringEq#606c7034."=="#553b4b8e#0(them#2e0e7030.address#26bae8cc#0, "No")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2e0e7030.h26bae8cc_0, "No");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#0bf244a2<Person#f3071cb4>(me#5e45983c), "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0bf244a2(hash_5e45983c), "June");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#0bf244a2<Employee#26bae8cc>(them#2e0e7030), "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0bf244a2(hash_2e0e7030), "You");

/*
StringEq#606c7034."=="#553b4b8e#0(here#1f9be1f8.occupant#62e9902a#0.name#6a039486#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1f9be1f8.h62e9902a_0.h6a039486_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(countMe#e777cbc8.item#63e99840#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_e777cbc8.h63e99840_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(
    Counter#63e99840<() ={}> string>{item#63e99840#0: () ={}> "hi", count#63e99840#1: 10}.item#63e99840#0(),
    "hi",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "63e99840",
  h63e99840_0: () => "hi",
  h63e99840_1: 10
} as t_63e99840<() => string>).h63e99840_0(), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#0b9f92a4.item#63e99840#0<string>("String"), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0b9f92a4.h63e99840_0("String"), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#0b9f92a4.item#63e99840#0<int>(10), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0b9f92a4.h63e99840_0(10), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(
    countNamed#6c9369de.item#63e99840#0<Person#f3071cb4>(me#5e45983c),
    "June",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_6c9369de.h63e99840_0(hash_5e45983c), "June");

/*
IntEq#9275f914."=="#553b4b8e#0(gotit#9781cfa0.contents#Some#0, 5)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#87daa600{...aDog#ed5b05d8, ...aPerson#70b89ec9}.name#6a039486#0,
    "ralf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_ed5b05d8,
  ...hash_70b89ec9,
  type: "87daa600"
} as t_87daa600).h6a039486_0, "ralf");

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#87daa600{...aPerson#70b89ec9, ...aDog#ed5b05d8}.name#6a039486#0,
    "wolrf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_70b89ec9,
  ...hash_ed5b05d8,
  type: "87daa600"
} as t_87daa600).h6a039486_0, "wolrf");