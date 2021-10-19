import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.8935410428147438) type HasAge#20646fd6 = {
    age: int#builtin,
}
```
*/
type t_20646fd6 = {
  type: "20646fd6";
  h20646fd6_0: number;
};

/**
```
@unique(0.1529782475451004) type HasName#22eac480 = {
    name: string#builtin,
}
```
*/
type t_22eac480 = {
  type: "22eac480";
  h22eac480_0: string;
};

/**
```
@unique(0.3173776871115852) type Person#36788d8f = {
    ...HasName#22eac480,
    ...HasAge#20646fd6,
    what: int#builtin,
}
```
*/
type t_36788d8f = {
  type: "36788d8f";
  h36788d8f_0: number;
  h22eac480_0: string;
  h20646fd6_0: number;
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
@unique(0.17190900029596334) type Employee#51b48fc2 = {
    ...Person#36788d8f,
    address: string#builtin,
}
```
*/
type t_51b48fc2 = {
  type: "51b48fc2";
  h51b48fc2_0: string;
  h36788d8f_0: number;
  h22eac480_0: string;
  h20646fd6_0: number;
};

/**
```
@unique(0.7221910962235999) type House#92d9cc30 = {
    occupant: Person#36788d8f,
}
```
*/
type t_92d9cc30 = {
  type: "92d9cc30";
  h92d9cc30_0: t_36788d8f;
};

/**
```
@unique(0.847365010938303) type Counter#ab4ea2e4<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_ab4ea2e4<T> = {
  type: "ab4ea2e4";
  hab4ea2e4_0: T_0;
  hab4ea2e4_1: number;
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
@unique(0.19363310523987504) type Animal#5983af02 = {
    ...HasName#22eac480,
    furColor: string#builtin,
}
```
*/
type t_5983af02 = {
  type: "5983af02";
  h5983af02_0: string;
  h22eac480_0: string;
};

/**
```
const me#f13d3064 = Person#36788d8f{
    name#22eac480#0: "June",
    age#20646fd6#0: 10,
    what#36788d8f#0: 3,
}
Person#🧗🦥🚀{TODO SPREADs}{h36788d8f_0: 3, h22eac480_0: "June", h20646fd6_0: 10}
```
*/
export const hash_f13d3064: t_36788d8f = ({
  type: "36788d8f",
  h22eac480_0: "June",
  h20646fd6_0: 10,
  h36788d8f_0: 3
} as t_36788d8f);

/**
```
const aPerson#1feaff33 = Person#36788d8f{
    name#22eac480#0: "ralf",
    age#20646fd6#0: 23,
    what#36788d8f#0: 2,
}
Person#🧗🦥🚀{TODO SPREADs}{h36788d8f_0: 2, h22eac480_0: "ralf", h20646fd6_0: 23}
```
*/
export const hash_1feaff33: t_36788d8f = ({
  type: "36788d8f",
  h22eac480_0: "ralf",
  h20646fd6_0: 23,
  h36788d8f_0: 2
} as t_36788d8f);

/**
```
const aDog#220b40bc = Animal#5983af02{name#22eac480#0: "wolrf", furColor#5983af02#0: "red"}
Animal#🏥🙆‍♀️🏌️‍♀️😃{TODO SPREADs}{h5983af02_0: "red", h22eac480_0: "wolrf"}
```
*/
export const hash_220b40bc: t_5983af02 = ({
  type: "5983af02",
  h22eac480_0: "wolrf",
  h5983af02_0: "red"
} as t_5983af02);

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
const countNamed#af457a68 = Counter#ab4ea2e4<<T#:0: HasName#22eac480>(T#:0) ={}> string#builtin>{
    item#ab4ea2e4#0: <T#:0: HasName#22eac480>(input#:0: T#:0): string#builtin ={}> input#:0.name#22eac480#0,
    count#ab4ea2e4#1: 10,
}
Counter#🥄{TODO SPREADs}{
    hab4ea2e4_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🧡🍜🐥#0,
    hab4ea2e4_1: 10,
}
```
*/
export const hash_af457a68: t_ab4ea2e4<<T extends {
  h22eac480_0: string;
}>(arg_0: T_0) => string> = ({
  type: "ab4ea2e4",
  hab4ea2e4_0: <T extends {
    h22eac480_0: string;
  }>(input: T_0) => input.h22eac480_0,
  hab4ea2e4_1: 10
} as t_ab4ea2e4<<T extends {
  h22eac480_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#44e56cfe = Counter#ab4ea2e4<<T#:0>(T#:0) ={}> string#builtin>{
    item#ab4ea2e4#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#ab4ea2e4#1: 10,
}
Counter#🥄{TODO SPREADs}{hab4ea2e4_0: <T>(input#:0: [var]T#:0): string => "hi", hab4ea2e4_1: 10}
```
*/
export const hash_44e56cfe: t_ab4ea2e4<<T>(arg_0: T_0) => string> = ({
  type: "ab4ea2e4",
  hab4ea2e4_0: <T>(input: T_0) => "hi",
  hab4ea2e4_1: 10
} as t_ab4ea2e4<<T>(arg_0: T_0) => string>);

/**
```
const countMe#9a6acde8 = Counter#ab4ea2e4<int#builtin>{
    item#ab4ea2e4#0: 10,
    count#ab4ea2e4#1: 4000,
}
Counter#🥄{TODO SPREADs}{hab4ea2e4_0: 10, hab4ea2e4_1: 4000}
```
*/
export const hash_9a6acde8: t_ab4ea2e4<number> = ({
  type: "ab4ea2e4",
  hab4ea2e4_0: 10,
  hab4ea2e4_1: 4000
} as t_ab4ea2e4<number>);

/**
```
const here#1ee76ac6 = House#92d9cc30{occupant#92d9cc30#0: me#f13d3064}
House#🤒{TODO SPREADs}{h92d9cc30_0: me#👽}
```
*/
export const hash_1ee76ac6: t_92d9cc30 = ({
  type: "92d9cc30",
  h92d9cc30_0: hash_f13d3064
} as t_92d9cc30);

/**
```
const getName#12adf033 = <T#:0: Person#36788d8f>(m#:0: T#:0): string#builtin ={}> m#:0.name#22eac480#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🧡🍜🐥#0
```
*/
export const hash_12adf033: <T extends {
  h36788d8f_0: number;
  h22eac480_0: string;
  h20646fd6_0: number;
}>(arg_0: T_0) => string = <T extends {
  h36788d8f_0: number;
  h22eac480_0: string;
  h20646fd6_0: number;
}>(m: T_0) => m.h22eac480_0;

/**
```
const them#c5a31744 = Employee#51b48fc2{
    what#36788d8f#0: 3,
    name#22eac480#0: "You",
    age#20646fd6#0: 100,
    address#51b48fc2#0: "No",
}
Employee#🎋👨‍🎨👩‍🔬😃{TODO SPREADs}{h51b48fc2_0: "No", h36788d8f_0: 3}
```
*/
export const hash_c5a31744: t_51b48fc2 = ({
  type: "51b48fc2",
  h36788d8f_0: 3,
  h22eac480_0: "You",
  h20646fd6_0: 100,
  h51b48fc2_0: "No"
} as t_51b48fc2);

/**
```
const alsoMe#579f208e = Person#36788d8f{...me#f13d3064, what#36788d8f#0: 11}
Person#🧗🦥🚀{TODO SPREADs}{h36788d8f_0: 11, h22eac480_0: _#:0, h20646fd6_0: _#:0}
```
*/
export const hash_579f208e: t_36788d8f = ({ ...hash_f13d3064,
  type: "36788d8f",
  h36788d8f_0: 11
} as t_36788d8f);

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

/**
```
const you#30426464 = Employee#51b48fc2{...me#f13d3064, address#51b48fc2#0: "Yes"}
Employee#🎋👨‍🎨👩‍🔬😃{TODO SPREADs}{h51b48fc2_0: "Yes", h36788d8f_0: _#:0}
```
*/
export const hash_30426464: t_51b48fc2 = ({ ...hash_f13d3064,
  type: "51b48fc2",
  h51b48fc2_0: "Yes"
} as t_51b48fc2);

/*
me#f13d3064.name#22eac480#0 ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, me#👽.#HasName#🧡🍜🐥#0, "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_f13d3064.h22eac480_0, "June");

/*
me#f13d3064.age#20646fd6#0 ==#6d46a318#3b6b23ae#0 10
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, me#👽.#HasAge#🥎👩‍🔬🐃#0, 10)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_f13d3064.h20646fd6_0, 10);

/*
alsoMe#579f208e.name#22eac480#0 ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, alsoMe#🕳️🧧🧎‍♀️😃.#HasName#🧡🍜🐥#0, "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_579f208e.h22eac480_0, "June");

/*
alsoMe#579f208e.what#36788d8f#0 ==#6d46a318#3b6b23ae#0 11
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, alsoMe#🕳️🧧🧎‍♀️😃.#Person#🧗🦥🚀#0, 11)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_579f208e.h36788d8f_0, 11);

/*
you#30426464.name#22eac480#0 ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, you#👽✋🏨.#HasName#🧡🍜🐥#0, "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_30426464.h22eac480_0, "June");

/*
them#c5a31744.name#22eac480#0 ==#0d81b26d#3b6b23ae#0 "You"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, them#🦽.#HasName#🧡🍜🐥#0, "You")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_c5a31744.h22eac480_0, "You");

/*
them#c5a31744.address#51b48fc2#0 ==#0d81b26d#3b6b23ae#0 "No"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, them#🦽.#Employee#🎋👨‍🎨👩‍🔬😃#0, "No")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_c5a31744.h51b48fc2_0, "No");

/*
getName#12adf033<Person#36788d8f>(m: me#f13d3064) ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, getName#🤮🕔👩‍🚀<Person#🧗🦥🚀>(me#👽), "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_12adf033(hash_f13d3064), "June");

/*
getName#12adf033<Employee#51b48fc2>(m: them#c5a31744) ==#0d81b26d#3b6b23ae#0 "You"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    getName#🤮🕔👩‍🚀<Employee#🎋👨‍🎨👩‍🔬😃>(them#🦽),
    "You",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_12adf033(hash_c5a31744), "You");

/*
here#1ee76ac6.occupant#92d9cc30#0.name#22eac480#0 ==#0d81b26d#3b6b23ae#0 "June"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, here#🍪👩‍👩‍👧🦍.#House#🤒#0.#HasName#🧡🍜🐥#0, "June")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_1ee76ac6.h92d9cc30_0.h22eac480_0, "June");

/*
countMe#9a6acde8.item#ab4ea2e4#0 ==#6d46a318#3b6b23ae#0 10
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, countMe#🗣️.#Counter#🥄#0, 10)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_9a6acde8.hab4ea2e4_0, 10);

/*
Counter#ab4ea2e4<() ={}> string#builtin>{
        item#ab4ea2e4#0: (): string#builtin ={}> "hi",
        count#ab4ea2e4#1: 10,
    }.item#ab4ea2e4#0() 
    ==#0d81b26d#3b6b23ae#0 "hi"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "hi", "hi")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "hi", "hi");

/*
countAny#44e56cfe.item#ab4ea2e4#0<string#builtin>("String") ==#0d81b26d#3b6b23ae#0 "hi"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    countAny#🧑‍⚕️🧚‍♀️😭😃.#Counter#🥄#0<string>("String"),
    "hi",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_44e56cfe.hab4ea2e4_0("String"), "hi");

/*
countAny#44e56cfe.item#ab4ea2e4#0<int#builtin>(10) ==#0d81b26d#3b6b23ae#0 "hi"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, countAny#🧑‍⚕️🧚‍♀️😭😃.#Counter#🥄#0<int>(10), "hi")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_44e56cfe.hab4ea2e4_0(10), "hi");

/*
countNamed#af457a68.item#ab4ea2e4#0<Person#36788d8f>(me#f13d3064) ==#0d81b26d#3b6b23ae#0 "June"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    countNamed#☘️.#Counter#🥄#0<Person#🧗🦥🚀>(me#👽),
    "June",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_af457a68.hab4ea2e4_0(hash_f13d3064), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#6d46a318#3b6b23ae#0 5
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#9d302364{...aDog#220b40bc, ...aPerson#1feaff33}.name#22eac480#0 
    ==#0d81b26d#3b6b23ae#0 "ralf"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    WereWolf#🚠{TODO SPREADs}{h5983af02_0: _#:0, h36788d8f_0: _#:0}.#HasName#🧡🍜🐥#0,
    "ralf",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, ({ ...hash_220b40bc,
  ...hash_1feaff33,
  type: "9d302364"
} as t_9d302364).h22eac480_0, "ralf");

/*
WereWolf#9d302364{...aPerson#1feaff33, ...aDog#220b40bc}.name#22eac480#0 
    ==#0d81b26d#3b6b23ae#0 "wolrf"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    WereWolf#🚠{TODO SPREADs}{h5983af02_0: _#:0, h36788d8f_0: _#:0}.#HasName#🧡🍜🐥#0,
    "wolrf",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, ({ ...hash_1feaff33,
  ...hash_220b40bc,
  type: "9d302364"
} as t_9d302364).h22eac480_0, "wolrf");

/*
SomethingWithDefaults#36a9774e{name#36a9774e#0: "Me", age#36a9774e#1: 4}.hasGlasses#36a9774e#2 
    ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SomethingWithDefaults#36a9774e{
        name#36a9774e#0: "Me",
        age#36a9774e#1: 4,
        hasGlasses#36a9774e#2: true,
    }.hasGlasses#36a9774e#2 
    ==#builtin true
assertEqual(true, true)
*/
assertEqual(true, true);

/*
One#57463bc4.name#57463bc4#0 ==#0d81b26d#3b6b23ae#0 "One"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "One", "One")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "One", "One");

/*
Two#b3ff688c.name#57463bc4#0 ==#0d81b26d#3b6b23ae#0 "Two"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Two", "Two")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Two", "Two");

/*
Two#b3ff688c.age#b3ff688c#0 ==#6d46a318#3b6b23ae#0 2
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 2, 2)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 2, 2);

/*
Two#b3ff688c.last#57463bc4#1 ==#0d81b26d#3b6b23ae#0 "Last"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Last", "Last")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Last", "Last");

/*
Three#6d2c6424.name#57463bc4#0 ==#0d81b26d#3b6b23ae#0 "Three"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Three", "Three")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Three", "Three");

/*
Three#6d2c6424{age#b3ff688c#0: 5}.age#b3ff688c#0 ==#6d46a318#3b6b23ae#0 5
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 5, 5)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 5, 5);

/*
Three#6d2c6424.size#6d2c6424#0 ==#6d46a318#3b6b23ae#0 3
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 3, 3)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 3, 3);

/*
Three#6d2c6424.last#57463bc4#1 ==#0d81b26d#3b6b23ae#0 "Last"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Last", "Last")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Last", "Last");

/*
Four#c56a44ee{color#c56a44ee#0: "red"}.color#c56a44ee#0 ==#0d81b26d#3b6b23ae#0 "red"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "red", "red")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "red", "red");

/*
Four#c56a44ee{color#c56a44ee#0: "red"}.last#57463bc4#1 ==#0d81b26d#3b6b23ae#0 "Last"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Last", "Last")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Last", "Last");

/*
SubitemWithDefaults#0d45b2e6{name#36a9774e#0: "Stephen"}.hasGlasses#36a9774e#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#0d45b2e6{name#36a9774e#0: "Stephen"}.name#36a9774e#0 
    ==#0d81b26d#3b6b23ae#0 "Stephen"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Stephen", "Stephen")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#0d45b2e6.name#36a9774e#0 ==#0d81b26d#3b6b23ae#0 "Hello"
assertCall(StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0, "Hello", "Hello")
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, "Hello", "Hello");

/*
SubitemWithDefaults#0d45b2e6.hasGlasses#36a9774e#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#0d45b2e6.age#36a9774e#1 ==#6d46a318#3b6b23ae#0 10
assertCall(IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0, 10, 10)
*/
assertCall(hash_6d46a318.h3b6b23ae_0, 10, 10);