import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#130899e0 = {
    age: int#builtin,
}
```
*/
type t_130899e0 = {
  type: "130899e0";
  h130899e0_0: number;
};

/**
```
type HasName#0e2d666c = {
    name: string#builtin,
}
```
*/
type t_0e2d666c = {
  type: "0e2d666c";
  h0e2d666c_0: string;
};

/**
```
type Person#4691589b = {
    ...HasName#0e2d666c,
    ...HasAge#130899e0,
    what: int#builtin,
}
```
*/
type t_4691589b = {
  type: "4691589b";
  h4691589b_0: number;
  h0e2d666c_0: string;
  h130899e0_0: number;
};

/**
```
type Eq#51ea2a36<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_51ea2a36<T_0> = {
  type: "51ea2a36";
  h51ea2a36_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
type Employee#3e893316 = {
    ...Person#4691589b,
    address: string#builtin,
}
```
*/
type t_3e893316 = {
  type: "3e893316";
  h3e893316_0: string;
  h4691589b_0: number;
  h0e2d666c_0: string;
  h130899e0_0: number;
};

/**
```
type House#a2d9d606 = {
    occupant: Person#4691589b,
}
```
*/
type t_a2d9d606 = {
  type: "a2d9d606";
  ha2d9d606_0: t_4691589b;
};

/**
```
type Counter#effec30a<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_effec30a<T_0> = {
  type: "effec30a";
  heffec30a_0: T_0;
  heffec30a_1: number;
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
type Animal#407cbcea = {
    ...HasName#0e2d666c,
    furColor: string#builtin,
}
```
*/
type t_407cbcea = {
  type: "407cbcea";
  h407cbcea_0: string;
  h0e2d666c_0: string;
};

/**
```
const me#a305a5f0 = Person#4691589b{
    name#0e2d666c#0: "June",
    age#130899e0#0: 10,
    what#4691589b#0: 3,
}
Person#👌🥱😹😃{TODO SPREADs}{h4691589b_0: 3, h0e2d666c_0: "June", h130899e0_0: 10}
```
*/
export const hash_a305a5f0: t_4691589b = ({
  type: "4691589b",
  h0e2d666c_0: "June",
  h130899e0_0: 10,
  h4691589b_0: 3
} as t_4691589b);

/**
```
const aPerson#40a98cfe = Person#4691589b{
    name#0e2d666c#0: "ralf",
    age#130899e0#0: 23,
    what#4691589b#0: 2,
}
Person#👌🥱😹😃{TODO SPREADs}{h4691589b_0: 2, h0e2d666c_0: "ralf", h130899e0_0: 23}
```
*/
export const hash_40a98cfe: t_4691589b = ({
  type: "4691589b",
  h0e2d666c_0: "ralf",
  h130899e0_0: 23,
  h4691589b_0: 2
} as t_4691589b);

/**
```
const aDog#4f3dda89 = Animal#407cbcea{name#0e2d666c#0: "wolrf", furColor#407cbcea#0: "red"}
Animal#🙆‍♂️🚞😂😃{TODO SPREADs}{h407cbcea_0: "red", h0e2d666c_0: "wolrf"}
```
*/
export const hash_4f3dda89: t_407cbcea = ({
  type: "407cbcea",
  h0e2d666c_0: "wolrf",
  h407cbcea_0: "red"
} as t_407cbcea);

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
const countNamed#3305f514 = Counter#effec30a<<T#:0: HasName#0e2d666c>(T#:0) ={}> string#builtin>{
    item#effec30a#0: <T#:0: HasName#0e2d666c>(input#:0: T#:0): string#builtin ={}> input#:0.name#0e2d666c#0,
    count#effec30a#1: 10,
}
Counter#🏯{TODO SPREADs}{
    heffec30a_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🍃⛴️🙍‍♀️#0,
    heffec30a_1: 10,
}
```
*/
export const hash_3305f514: t_effec30a<<T_0 extends {
  h0e2d666c_0: string;
}>(arg_0: T_0) => string> = ({
  type: "effec30a",
  heffec30a_0: <T_0 extends {
    h0e2d666c_0: string;
  }>(input: T_0) => input.h0e2d666c_0,
  heffec30a_1: 10
} as t_effec30a<<T_0 extends {
  h0e2d666c_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#36dfeef6 = Counter#effec30a<<T#:0>(T#:0) ={}> string#builtin>{
    item#effec30a#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#effec30a#1: 10,
}
Counter#🏯{TODO SPREADs}{heffec30a_0: <T>(input#:0: [var]T#:0): string => "hi", heffec30a_1: 10}
```
*/
export const hash_36dfeef6: t_effec30a<<T_0>(arg_0: T_0) => string> = ({
  type: "effec30a",
  heffec30a_0: <T_0>(input: T_0) => "hi",
  heffec30a_1: 10
} as t_effec30a<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#22fed686 = Counter#effec30a<int#builtin>{
    item#effec30a#0: 10,
    count#effec30a#1: 4000,
}
Counter#🏯{TODO SPREADs}{heffec30a_0: 10, heffec30a_1: 4000}
```
*/
export const hash_22fed686: t_effec30a<number> = ({
  type: "effec30a",
  heffec30a_0: 10,
  heffec30a_1: 4000
} as t_effec30a<number>);

/**
```
const here#46b8ccda = House#a2d9d606{occupant#a2d9d606#0: me#a305a5f0}
House#🐃{TODO SPREADs}{ha2d9d606_0: me#🐶}
```
*/
export const hash_46b8ccda: t_a2d9d606 = ({
  type: "a2d9d606",
  ha2d9d606_0: hash_a305a5f0
} as t_a2d9d606);

/**
```
const getName#5dcc60d4 = <T#:0: Person#4691589b>(m#:0: T#:0): string#builtin ={}> m#:0.name#0e2d666c#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🍃⛴️🙍‍♀️#0
```
*/
export const hash_5dcc60d4: <T_0 extends {
  h4691589b_0: number;
  h0e2d666c_0: string;
  h130899e0_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h4691589b_0: number;
  h0e2d666c_0: string;
  h130899e0_0: number;
}>(m: T_0) => m.h0e2d666c_0;

/**
```
const them#9464fae8 = Employee#3e893316{
    what#4691589b#0: 3,
    name#0e2d666c#0: "You",
    age#130899e0#0: 100,
    address#3e893316#0: "No",
}
Employee#⛺🦋⛸️{TODO SPREADs}{h3e893316_0: "No", h4691589b_0: 3}
```
*/
export const hash_9464fae8: t_3e893316 = ({
  type: "3e893316",
  h4691589b_0: 3,
  h0e2d666c_0: "You",
  h130899e0_0: 100,
  h3e893316_0: "No"
} as t_3e893316);

/**
```
const you#35f57b96 = Employee#3e893316{...me#a305a5f0, address#3e893316#0: "Yes"}
Employee#⛺🦋⛸️{TODO SPREADs}{h3e893316_0: "Yes", h4691589b_0: _#:0}
```
*/
export const hash_35f57b96: t_3e893316 = ({ ...hash_a305a5f0,
  type: "3e893316",
  h3e893316_0: "Yes"
} as t_3e893316);

/**
```
const alsoMe#41761ace = Person#4691589b{...me#a305a5f0, what#4691589b#0: 11}
Person#👌🥱😹😃{TODO SPREADs}{h4691589b_0: 11, h0e2d666c_0: _#:0, h130899e0_0: _#:0}
```
*/
export const hash_41761ace: t_4691589b = ({ ...hash_a305a5f0,
  type: "4691589b",
  h4691589b_0: 11
} as t_4691589b);

/**
```
const IntEq#ec95f154 = Eq#51ea2a36<int#builtin>{"=="#51ea2a36#0: intEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: intEq}
```
*/
export const hash_ec95f154: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: intEq
} as t_51ea2a36<number>);

/**
```
const StringEq#da00b310 = Eq#51ea2a36<string#builtin>{"=="#51ea2a36#0: stringEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: stringEq}
```
*/
export const hash_da00b310: t_51ea2a36<string> = ({
  type: "51ea2a36",
  h51ea2a36_0: stringEq
} as t_51ea2a36<string>);

/*
me#a305a5f0.name#0e2d666c#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, me#🐶.#HasName#🍃⛴️🙍‍♀️#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_a305a5f0.h0e2d666c_0, "June");

/*
me#a305a5f0.age#130899e0#0 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, me#🐶.#HasAge#👨‍👧🦘👮‍♀️#0, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_a305a5f0.h130899e0_0, 10);

/*
alsoMe#41761ace.name#0e2d666c#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, alsoMe#🍮💃😛😃.#HasName#🍃⛴️🙍‍♀️#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_41761ace.h0e2d666c_0, "June");

/*
alsoMe#41761ace.what#4691589b#0 ==#ec95f154#51ea2a36#0 11
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, alsoMe#🍮💃😛😃.#Person#👌🥱😹😃#0, 11)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_41761ace.h4691589b_0, 11);

/*
you#35f57b96.name#0e2d666c#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, you#🌡️🧛‍♀️🛬.#HasName#🍃⛴️🙍‍♀️#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_35f57b96.h0e2d666c_0, "June");

/*
them#9464fae8.name#0e2d666c#0 ==#da00b310#51ea2a36#0 "You"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, them#🌎.#HasName#🍃⛴️🙍‍♀️#0, "You")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_9464fae8.h0e2d666c_0, "You");

/*
them#9464fae8.address#3e893316#0 ==#da00b310#51ea2a36#0 "No"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, them#🌎.#Employee#⛺🦋⛸️#0, "No")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_9464fae8.h3e893316_0, "No");

/*
getName#5dcc60d4<Person#4691589b>(m: me#a305a5f0) ==#da00b310#51ea2a36#0 "June"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    getName#🧑‍🦰🌃👩‍👩‍👦‍👦😃<Person#👌🥱😹😃>(me#🐶),
    "June",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_5dcc60d4(hash_a305a5f0), "June");

/*
getName#5dcc60d4<Employee#3e893316>(m: them#9464fae8) ==#da00b310#51ea2a36#0 "You"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    getName#🧑‍🦰🌃👩‍👩‍👦‍👦😃<Employee#⛺🦋⛸️>(them#🌎),
    "You",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_5dcc60d4(hash_9464fae8), "You");

/*
here#46b8ccda.occupant#a2d9d606#0.name#0e2d666c#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, here#🧑‍🦲🦆😼😃.#House#🐃#0.#HasName#🍃⛴️🙍‍♀️#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_46b8ccda.ha2d9d606_0.h0e2d666c_0, "June");

/*
countMe#22fed686.item#effec30a#0 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, countMe#🥦☄️🐦.#Counter#🏯#0, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_22fed686.heffec30a_0, 10);

/*
Counter#effec30a<() ={}> string#builtin>{
        item#effec30a#0: (): string#builtin ={}> "hi",
        count#effec30a#1: 10,
    }.item#effec30a#0() 
    ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "hi", "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, "hi", "hi");

/*
countAny#36dfeef6.item#effec30a#0<string#builtin>("String") ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, countAny#🏞️♠️⌚.#Counter#🏯#0<string>("String"), "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_36dfeef6.heffec30a_0("String"), "hi");

/*
countAny#36dfeef6.item#effec30a#0<int#builtin>(10) ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, countAny#🏞️♠️⌚.#Counter#🏯#0<int>(10), "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_36dfeef6.heffec30a_0(10), "hi");

/*
countNamed#3305f514.item#effec30a#0<Person#4691589b>(me#a305a5f0) ==#da00b310#51ea2a36#0 "June"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    countNamed#👨‍🏭🧑‍🦼🚋.#Counter#🏯#0<Person#👌🥱😹😃>(me#🐶),
    "June",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_3305f514.heffec30a_0(hash_a305a5f0), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#ec95f154#51ea2a36#0 5
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#73b150bb{...aDog#4f3dda89, ...aPerson#40a98cfe}.name#0e2d666c#0 
    ==#da00b310#51ea2a36#0 "ralf"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    WereWolf#🦶😩🚗😃{TODO SPREADs}{h407cbcea_0: _#:0, h4691589b_0: _#:0}.#HasName#🍃⛴️🙍‍♀️#0,
    "ralf",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_4f3dda89,
  ...hash_40a98cfe,
  type: "73b150bb"
} as t_73b150bb).h0e2d666c_0, "ralf");

/*
WereWolf#73b150bb{...aPerson#40a98cfe, ...aDog#4f3dda89}.name#0e2d666c#0 
    ==#da00b310#51ea2a36#0 "wolrf"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    WereWolf#🦶😩🚗😃{TODO SPREADs}{h407cbcea_0: _#:0, h4691589b_0: _#:0}.#HasName#🍃⛴️🙍‍♀️#0,
    "wolrf",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_40a98cfe,
  ...hash_4f3dda89,
  type: "73b150bb"
} as t_73b150bb).h0e2d666c_0, "wolrf");

/*
SomethingWithDefaults#6e98f2ff{name#6e98f2ff#0: "Me", age#6e98f2ff#1: 4}.hasGlasses#6e98f2ff#2 
    ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SomethingWithDefaults#6e98f2ff{
        name#6e98f2ff#0: "Me",
        age#6e98f2ff#1: 4,
        hasGlasses#6e98f2ff#2: true,
    }.hasGlasses#6e98f2ff#2 
    ==#builtin true
assertEqual(true, true)
*/
assertEqual(true, true);

/*
One#3d4c6d54.name#3d4c6d54#0 ==#da00b310#51ea2a36#0 "One"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "One", "One")
*/
assertCall(hash_da00b310.h51ea2a36_0, "One", "One");

/*
Two#38635804.name#3d4c6d54#0 ==#da00b310#51ea2a36#0 "Two"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Two", "Two")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Two", "Two");

/*
Two#38635804.age#38635804#0 ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 2, 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 2, 2);

/*
Two#38635804.last#3d4c6d54#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
Three#1c58bdf6.name#3d4c6d54#0 ==#da00b310#51ea2a36#0 "Three"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Three", "Three")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Three", "Three");

/*
Three#1c58bdf6{age#38635804#0: 5}.age#38635804#0 ==#ec95f154#51ea2a36#0 5
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 5, 5)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 5, 5);

/*
Three#1c58bdf6.size#1c58bdf6#0 ==#ec95f154#51ea2a36#0 3
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 3, 3)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 3, 3);

/*
Three#1c58bdf6.last#3d4c6d54#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
Four#7915b1cc{color#7915b1cc#0: "red"}.color#7915b1cc#0 ==#da00b310#51ea2a36#0 "red"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "red", "red")
*/
assertCall(hash_da00b310.h51ea2a36_0, "red", "red");

/*
Four#7915b1cc{color#7915b1cc#0: "red"}.last#3d4c6d54#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
SubitemWithDefaults#3e6fdb0d{name#6e98f2ff#0: "Stephen"}.hasGlasses#6e98f2ff#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#3e6fdb0d{name#6e98f2ff#0: "Stephen"}.name#6e98f2ff#0 
    ==#da00b310#51ea2a36#0 "Stephen"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Stephen", "Stephen")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#3e6fdb0d.name#6e98f2ff#0 ==#da00b310#51ea2a36#0 "Hello"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Hello", "Hello")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Hello", "Hello");

/*
SubitemWithDefaults#3e6fdb0d.hasGlasses#6e98f2ff#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#3e6fdb0d.age#6e98f2ff#1 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 10, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 10, 10);