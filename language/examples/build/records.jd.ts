import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.17190900029596334) type HasAge#55ecd4f4 = {
    age: int#builtin,
}
```
*/
type t_55ecd4f4 = {
  type: "55ecd4f4";
  h55ecd4f4_0: number;
};

/**
```
@unique(0.3173776871115852) type HasName#80c3ca0c = {
    name: string#builtin,
}
```
*/
type t_80c3ca0c = {
  type: "80c3ca0c";
  h80c3ca0c_0: string;
};

/**
```
@unique(0.7221910962235999) type Person#4653170c = {
    ...HasName#80c3ca0c,
    ...HasAge#55ecd4f4,
    what: int#builtin,
}
```
*/
type t_4653170c = {
  type: "4653170c";
  h4653170c_0: number;
  h80c3ca0c_0: string;
  h55ecd4f4_0: number;
};

/**
```
@unique(0.5383562320075749) type Eq#3b6b23ae<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_3b6b23ae<T> = {
  type: "3b6b23ae";
  h3b6b23ae_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
@unique(0.847365010938303) type Employee#5c6cf600 = {
    ...Person#4653170c,
    address: string#builtin,
}
```
*/
type t_5c6cf600 = {
  type: "5c6cf600";
  h5c6cf600_0: string;
  h4653170c_0: number;
  h80c3ca0c_0: string;
  h55ecd4f4_0: number;
};

/**
```
@unique(0.19363310523987504) type House#e6d167cc = {
    occupant: Person#4653170c,
}
```
*/
type t_e6d167cc = {
  type: "e6d167cc";
  he6d167cc_0: t_4653170c;
};

/**
```
@unique(0.5593450613043727) type Counter#fd53ae1a<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_fd53ae1a<T> = {
  type: "fd53ae1a";
  hfd53ae1a_0: T_0;
  hfd53ae1a_1: number;
};

/**
```
@unique(0) type Some#Some<T#:10000> = {
    contents: T#:10000,
}
```
*/
type t_Some<T> = {
  type: "Some";
  hSome_0: T_10000;
};

/**
```
@unique(0.49131752795885836) type Animal#58aab3c4 = {
    ...HasName#80c3ca0c,
    furColor: string#builtin,
}
```
*/
type t_58aab3c4 = {
  type: "58aab3c4";
  h58aab3c4_0: string;
  h80c3ca0c_0: string;
};

/**
```
const me#0cfe2758 = Person#4653170c{
    name#80c3ca0c#0: "June",
    age#55ecd4f4#0: 10,
    what#4653170c#0: 3,
}
Person#💒👄👾😃{TODO SPREADs}{h4653170c_0: 3, h80c3ca0c_0: "June", h55ecd4f4_0: 10}
```
*/
export const hash_0cfe2758: t_4653170c = ({
  type: "4653170c",
  h80c3ca0c_0: "June",
  h55ecd4f4_0: 10,
  h4653170c_0: 3
} as t_4653170c);

/**
```
const aPerson#301b0334 = Person#4653170c{
    name#80c3ca0c#0: "ralf",
    age#55ecd4f4#0: 23,
    what#4653170c#0: 2,
}
Person#💒👄👾😃{TODO SPREADs}{h4653170c_0: 2, h80c3ca0c_0: "ralf", h55ecd4f4_0: 23}
```
*/
export const hash_301b0334: t_4653170c = ({
  type: "4653170c",
  h80c3ca0c_0: "ralf",
  h55ecd4f4_0: 23,
  h4653170c_0: 2
} as t_4653170c);

/**
```
const aDog#db0c087e = Animal#58aab3c4{name#80c3ca0c#0: "wolrf", furColor#58aab3c4#0: "red"}
Animal#🎎🍱👯‍♂️😃{TODO SPREADs}{h58aab3c4_0: "red", h80c3ca0c_0: "wolrf"}
```
*/
export const hash_db0c087e: t_58aab3c4 = ({
  type: "58aab3c4",
  h80c3ca0c_0: "wolrf",
  h58aab3c4_0: "red"
} as t_58aab3c4);

/**
```
const gotit#9781cfa0 = Some#Some<int#builtin>{contents#Some#0: 5}
Some{TODO SPREADs}{hSome_0: 5}
```
*/
export const hash_9781cfa0: t_Some<number> = ({
  type: "Some",
  hSome_0: 5
} as t_Some<number>);

/**
```
const countNamed#be66d616 = Counter#fd53ae1a<<T#:0: HasName#80c3ca0c>(T#:0) ={}> string#builtin>{
    item#fd53ae1a#0: <T#:0: HasName#80c3ca0c>(input#:0: T#:0): string#builtin ={}> input#:0.name#80c3ca0c#0,
    count#fd53ae1a#1: 10,
}
Counter#🐰{TODO SPREADs}{
    hfd53ae1a_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🐏#0,
    hfd53ae1a_1: 10,
}
```
*/
export const hash_be66d616: t_fd53ae1a<<T extends {
  h80c3ca0c_0: string;
}>(arg_0: T_0) => string> = ({
  type: "fd53ae1a",
  hfd53ae1a_0: <T extends {
    h80c3ca0c_0: string;
  }>(input: T_0) => input.h80c3ca0c_0,
  hfd53ae1a_1: 10
} as t_fd53ae1a<<T extends {
  h80c3ca0c_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#10a60e2d = Counter#fd53ae1a<<T#:0>(T#:0) ={}> string#builtin>{
    item#fd53ae1a#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#fd53ae1a#1: 10,
}
Counter#🐰{TODO SPREADs}{hfd53ae1a_0: <T>(input#:0: [var]T#:0): string => "hi", hfd53ae1a_1: 10}
```
*/
export const hash_10a60e2d: t_fd53ae1a<<T>(arg_0: T_0) => string> = ({
  type: "fd53ae1a",
  hfd53ae1a_0: <T>(input: T_0) => "hi",
  hfd53ae1a_1: 10
} as t_fd53ae1a<<T>(arg_0: T_0) => string>);

/**
```
const countMe#4fcfcea9 = Counter#fd53ae1a<int#builtin>{
    item#fd53ae1a#0: 10,
    count#fd53ae1a#1: 4000,
}
Counter#🐰{TODO SPREADs}{hfd53ae1a_0: 10, hfd53ae1a_1: 4000}
```
*/
export const hash_4fcfcea9: t_fd53ae1a<number> = ({
  type: "fd53ae1a",
  hfd53ae1a_0: 10,
  hfd53ae1a_1: 4000
} as t_fd53ae1a<number>);

/**
```
const here#244e447c = House#e6d167cc{occupant#e6d167cc#0: me#0cfe2758}
House#🎟️{TODO SPREADs}{he6d167cc_0: me#🛳️🕦👨‍🦱}
```
*/
export const hash_244e447c: t_e6d167cc = ({
  type: "e6d167cc",
  he6d167cc_0: hash_0cfe2758
} as t_e6d167cc);

/**
```
const getName#affef6d0 = <T#:0: Person#4653170c>(m#:0: T#:0): string#builtin ={}> m#:0.name#80c3ca0c#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🐏#0
```
*/
export const hash_affef6d0: <T extends {
  h4653170c_0: number;
  h80c3ca0c_0: string;
  h55ecd4f4_0: number;
}>(arg_0: T_0) => string = <T extends {
  h4653170c_0: number;
  h80c3ca0c_0: string;
  h55ecd4f4_0: number;
}>(m: T_0) => m.h80c3ca0c_0;

/**
```
const them#e65855fe = Employee#5c6cf600{
    what#4653170c#0: 3,
    name#80c3ca0c#0: "You",
    age#55ecd4f4#0: 100,
    address#5c6cf600#0: "No",
}
Employee#🐎🚙💏😃{TODO SPREADs}{h5c6cf600_0: "No", h4653170c_0: 3}
```
*/
export const hash_e65855fe: t_5c6cf600 = ({
  type: "5c6cf600",
  h4653170c_0: 3,
  h80c3ca0c_0: "You",
  h55ecd4f4_0: 100,
  h5c6cf600_0: "No"
} as t_5c6cf600);

/**
```
const you#82ff4028 = Employee#5c6cf600{...me#0cfe2758, address#5c6cf600#0: "Yes"}
Employee#🐎🚙💏😃{TODO SPREADs}{h5c6cf600_0: "Yes", h4653170c_0: _#:0}
```
*/
export const hash_82ff4028: t_5c6cf600 = ({ ...hash_0cfe2758,
  type: "5c6cf600",
  h5c6cf600_0: "Yes"
} as t_5c6cf600);

/**
```
const alsoMe#4525c334 = Person#4653170c{...me#0cfe2758, what#4653170c#0: 11}
Person#💒👄👾😃{TODO SPREADs}{h4653170c_0: 11, h80c3ca0c_0: _#:0, h55ecd4f4_0: _#:0}
```
*/
export const hash_4525c334: t_4653170c = ({ ...hash_0cfe2758,
  type: "4653170c",
  h4653170c_0: 11
} as t_4653170c);

/**
```
const IntEq#6d46a318 = Eq#3b6b23ae<int#builtin>{"=="#3b6b23ae#0: intEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: intEq}
```
*/
export const hash_6d46a318: t_3b6b23ae<number> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: intEq
} as t_3b6b23ae<number>);

/**
```
const StringEq#0d81b26d = Eq#3b6b23ae<string#builtin>{"=="#3b6b23ae#0: stringEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: stringEq}
```
*/
export const hash_0d81b26d: t_3b6b23ae<string> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: stringEq
} as t_3b6b23ae<string>);

/*
me#0cfe2758.name#80c3ca0c#0 ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, me#🛳️🕦👨‍🦱.#HasName#🐏#0, "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_0cfe2758.h80c3ca0c_0, "June");

/*
me#0cfe2758.age#55ecd4f4#0 ==#6d46a318#3b6b23ae#0 10
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, me#🛳️🕦👨‍🦱.#HasAge#🧏‍♀️🚑🧛‍♀️😃#0, 10)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_0cfe2758.h55ecd4f4_0, 10);

/*
alsoMe#4525c334.name#80c3ca0c#0 ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, alsoMe#🚐💇‍♀️😞😃.#HasName#🐏#0, "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_4525c334.h80c3ca0c_0, "June");

/*
alsoMe#4525c334.what#4653170c#0 ==#6d46a318#3b6b23ae#0 11
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, alsoMe#🚐💇‍♀️😞😃.#Person#💒👄👾😃#0, 11)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_4525c334.h4653170c_0, 11);

/*
you#82ff4028.name#80c3ca0c#0 ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, you#😬.#HasName#🐏#0, "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_82ff4028.h80c3ca0c_0, "June");

/*
them#e65855fe.name#80c3ca0c#0 ==#0d81b26d#3b6b23ae#0 "You"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, them#🐆.#HasName#🐏#0, "You")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_e65855fe.h80c3ca0c_0, "You");

/*
them#e65855fe.address#5c6cf600#0 ==#0d81b26d#3b6b23ae#0 "No"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, them#🐆.#Employee#🐎🚙💏😃#0, "No")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_e65855fe.h5c6cf600_0, "No");

/*
getName#affef6d0<Person#4653170c>(m: me#0cfe2758) ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, getName#🍼<Person#💒👄👾😃>(me#🛳️🕦👨‍🦱), "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_affef6d0(hash_0cfe2758), "June");

/*
getName#affef6d0<Employee#5c6cf600>(m: them#e65855fe) ==#0d81b26d#3b6b23ae#0 "You"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, getName#🍼<Employee#🐎🚙💏😃>(them#🐆), "You")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_affef6d0(hash_e65855fe), "You");

/*
here#244e447c.occupant#e6d167cc#0.name#80c3ca0c#0 ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, here#💟🌘🐬.#House#🎟️#0.#HasName#🐏#0, "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_244e447c.he6d167cc_0.h80c3ca0c_0, "June");

/*
countMe#4fcfcea9.item#fd53ae1a#0 ==#6d46a318#3b6b23ae#0 10
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, countMe#🧈🔮🤷‍♂️😃.#Counter#🐰#0, 10)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_4fcfcea9.hfd53ae1a_0, 10);

/*
Counter#fd53ae1a<() ={}> string#builtin>{
        item#fd53ae1a#0: (): string#builtin ={}> "hi",
        count#fd53ae1a#1: 10,
    }.item#fd53ae1a#0() 
    ==#0d81b26d#3b6b23ae#0 "hi"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "hi", "hi")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "hi", "hi");

/*
countAny#10a60e2d.item#fd53ae1a#0<string#builtin>("String") ==#0d81b26d#3b6b23ae#0 "hi"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    countAny#🐤🏃🧑‍🌾.#Counter#🐰#0<string>("String"),
    "hi",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_10a60e2d.hfd53ae1a_0("String"), "hi");

/*
countAny#10a60e2d.item#fd53ae1a#0<int#builtin>(10) ==#0d81b26d#3b6b23ae#0 "hi"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, countAny#🐤🏃🧑‍🌾.#Counter#🐰#0<int>(10), "hi")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_10a60e2d.hfd53ae1a_0(10), "hi");

/*
countNamed#be66d616.item#fd53ae1a#0<Person#4653170c>(me#0cfe2758) ==#0d81b26d#3b6b23ae#0 "June"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    countNamed#🐭.#Counter#🐰#0<Person#💒👄👾😃>(me#🛳️🕦👨‍🦱),
    "June",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_be66d616.hfd53ae1a_0(hash_0cfe2758), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#6d46a318#3b6b23ae#0 5
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#16e784d6{...aDog#db0c087e, ...aPerson#301b0334}.name#80c3ca0c#0 
    ==#0d81b26d#3b6b23ae#0 "ralf"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    WereWolf#🧑‍🦱👨‍👧‍👦💇{TODO SPREADs}{h58aab3c4_0: _#:0, h4653170c_0: _#:0}.#HasName#🐏#0,
    "ralf",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, ({ ...hash_db0c087e,
  ...hash_301b0334,
  type: "16e784d6"
} as t_16e784d6).h80c3ca0c_0, "ralf");

/*
WereWolf#16e784d6{...aPerson#301b0334, ...aDog#db0c087e}.name#80c3ca0c#0 
    ==#0d81b26d#3b6b23ae#0 "wolrf"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    WereWolf#🧑‍🦱👨‍👧‍👦💇{TODO SPREADs}{h58aab3c4_0: _#:0, h4653170c_0: _#:0}.#HasName#🐏#0,
    "wolrf",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, ({ ...hash_301b0334,
  ...hash_db0c087e,
  type: "16e784d6"
} as t_16e784d6).h80c3ca0c_0, "wolrf");

/*
SomethingWithDefaults#3cfcc3f6{name#3cfcc3f6#0: "Me", age#3cfcc3f6#1: 4}.hasGlasses#3cfcc3f6#2 
    ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SomethingWithDefaults#3cfcc3f6{
        name#3cfcc3f6#0: "Me",
        age#3cfcc3f6#1: 4,
        hasGlasses#3cfcc3f6#2: true,
    }.hasGlasses#3cfcc3f6#2 
    ==#builtin true
assertEqual(true, true)
*/
assertEqual(true, true);

/*
One#4bb69f9d.name#4bb69f9d#0 ==#0d81b26d#3b6b23ae#0 "One"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "One", "One")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "One", "One");

/*
Two#7ed3ad62.name#4bb69f9d#0 ==#0d81b26d#3b6b23ae#0 "Two"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Two", "Two")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Two", "Two");

/*
Two#7ed3ad62.age#7ed3ad62#0 ==#6d46a318#3b6b23ae#0 2
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 2, 2)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 2, 2);

/*
Two#7ed3ad62.last#4bb69f9d#1 ==#0d81b26d#3b6b23ae#0 "Last"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Last", "Last")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Last", "Last");

/*
Three#95e625dc.name#4bb69f9d#0 ==#0d81b26d#3b6b23ae#0 "Three"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Three", "Three")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Three", "Three");

/*
Three#95e625dc{age#7ed3ad62#0: 5}.age#7ed3ad62#0 ==#6d46a318#3b6b23ae#0 5
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 5, 5)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 5, 5);

/*
Three#95e625dc.size#95e625dc#0 ==#6d46a318#3b6b23ae#0 3
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 3, 3)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 3, 3);

/*
Three#95e625dc.last#4bb69f9d#1 ==#0d81b26d#3b6b23ae#0 "Last"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Last", "Last")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Last", "Last");

/*
Four#ecd79dd0{color#ecd79dd0#0: "red"}.color#ecd79dd0#0 ==#0d81b26d#3b6b23ae#0 "red"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "red", "red")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "red", "red");

/*
Four#ecd79dd0{color#ecd79dd0#0: "red"}.last#4bb69f9d#1 ==#0d81b26d#3b6b23ae#0 "Last"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Last", "Last")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Last", "Last");

/*
SubitemWithDefaults#b71f0f3c{name#3cfcc3f6#0: "Stephen"}.hasGlasses#3cfcc3f6#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#b71f0f3c{name#3cfcc3f6#0: "Stephen"}.name#3cfcc3f6#0 
    ==#0d81b26d#3b6b23ae#0 "Stephen"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Stephen", "Stephen")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#b71f0f3c.name#3cfcc3f6#0 ==#0d81b26d#3b6b23ae#0 "Hello"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Hello", "Hello")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Hello", "Hello");

/*
SubitemWithDefaults#b71f0f3c.hasGlasses#3cfcc3f6#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#b71f0f3c.age#3cfcc3f6#1 ==#6d46a318#3b6b23ae#0 10
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 10, 10)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 10, 10);