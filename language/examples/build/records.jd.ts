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
@unique(0.3173776871115852) type Person#3e2389d1 = {
    ...HasName#22eac480,
    ...HasAge#20646fd6,
    what: int#builtin,
}
```
*/
type t_3e2389d1 = {
  type: "3e2389d1";
  h3e2389d1_0: number;
  h22eac480_0: string;
  h20646fd6_0: number;
};

/**
```
@unique(0.5383562320075749) type Eq#51ea2a36<T#:0> = {
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
@unique(0.17190900029596334) type Employee#e8c17b0c = {
    ...Person#3e2389d1,
    address: string#builtin,
}
```
*/
type t_e8c17b0c = {
  type: "e8c17b0c";
  he8c17b0c_0: string;
  h3e2389d1_0: number;
  h22eac480_0: string;
  h20646fd6_0: number;
};

/**
```
@unique(0.7221910962235999) type House#55b26747 = {
    occupant: Person#3e2389d1,
}
```
*/
type t_55b26747 = {
  type: "55b26747";
  h55b26747_0: t_3e2389d1;
};

/**
```
@unique(0.847365010938303) type Counter#5fde9766<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_5fde9766<T_0> = {
  type: "5fde9766";
  h5fde9766_0: T_0;
  h5fde9766_1: number;
};

/**
```
@unique(0) type Some#Some<T#:10000> = {
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
@unique(0.19363310523987504) type Animal#4f4fc676 = {
    ...HasName#22eac480,
    furColor: string#builtin,
}
```
*/
type t_4f4fc676 = {
  type: "4f4fc676";
  h4f4fc676_0: string;
  h22eac480_0: string;
};

/**
```
const me#884693d8 = Person#3e2389d1{
    name#22eac480#0: "June",
    age#20646fd6#0: 10,
    what#3e2389d1#0: 3,
}
Person#👨‍👩‍👧‍👦🙍‍♀️🏓{TODO SPREADs}{h3e2389d1_0: 3, h22eac480_0: "June", h20646fd6_0: 10}
```
*/
export const hash_884693d8: t_3e2389d1 = ({
  type: "3e2389d1",
  h22eac480_0: "June",
  h20646fd6_0: 10,
  h3e2389d1_0: 3
} as t_3e2389d1);

/**
```
const aPerson#f10e145c = Person#3e2389d1{
    name#22eac480#0: "ralf",
    age#20646fd6#0: 23,
    what#3e2389d1#0: 2,
}
Person#👨‍👩‍👧‍👦🙍‍♀️🏓{TODO SPREADs}{h3e2389d1_0: 2, h22eac480_0: "ralf", h20646fd6_0: 23}
```
*/
export const hash_f10e145c: t_3e2389d1 = ({
  type: "3e2389d1",
  h22eac480_0: "ralf",
  h20646fd6_0: 23,
  h3e2389d1_0: 2
} as t_3e2389d1);

/**
```
const aDog#7033cea8 = Animal#4f4fc676{name#22eac480#0: "wolrf", furColor#4f4fc676#0: "red"}
Animal#🍏🪁🧏‍♀️😃{TODO SPREADs}{h4f4fc676_0: "red", h22eac480_0: "wolrf"}
```
*/
export const hash_7033cea8: t_4f4fc676 = ({
  type: "4f4fc676",
  h22eac480_0: "wolrf",
  h4f4fc676_0: "red"
} as t_4f4fc676);

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
const countNamed#91b0a9f4 = Counter#5fde9766<<T#:0: HasName#22eac480>(T#:0) ={}> string#builtin>{
    item#5fde9766#0: <T#:0: HasName#22eac480>(input#:0: T#:0): string#builtin ={}> input#:0.name#22eac480#0,
    count#5fde9766#1: 10,
}
Counter#🛰️🌧️🐅😃{TODO SPREADs}{
    h5fde9766_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🧡🍜🐥#0,
    h5fde9766_1: 10,
}
```
*/
export const hash_91b0a9f4: t_5fde9766<<T_0 extends {
  h22eac480_0: string;
}>(arg_0: T_0) => string> = ({
  type: "5fde9766",
  h5fde9766_0: <T_0 extends {
    h22eac480_0: string;
  }>(input: T_0) => input.h22eac480_0,
  h5fde9766_1: 10
} as t_5fde9766<<T_0 extends {
  h22eac480_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#24185fc0 = Counter#5fde9766<<T#:0>(T#:0) ={}> string#builtin>{
    item#5fde9766#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#5fde9766#1: 10,
}
Counter#🛰️🌧️🐅😃{TODO SPREADs}{
    h5fde9766_0: <T>(input#:0: [var]T#:0): string => "hi",
    h5fde9766_1: 10,
}
```
*/
export const hash_24185fc0: t_5fde9766<<T_0>(arg_0: T_0) => string> = ({
  type: "5fde9766",
  h5fde9766_0: <T_0>(input: T_0) => "hi",
  h5fde9766_1: 10
} as t_5fde9766<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#6db48736 = Counter#5fde9766<int#builtin>{
    item#5fde9766#0: 10,
    count#5fde9766#1: 4000,
}
Counter#🛰️🌧️🐅😃{TODO SPREADs}{h5fde9766_0: 10, h5fde9766_1: 4000}
```
*/
export const hash_6db48736: t_5fde9766<number> = ({
  type: "5fde9766",
  h5fde9766_0: 10,
  h5fde9766_1: 4000
} as t_5fde9766<number>);

/**
```
const here#f9483778 = House#55b26747{occupant#55b26747#0: me#884693d8}
House#🚲✋🧚‍♀️😃{TODO SPREADs}{h55b26747_0: me#🏐}
```
*/
export const hash_f9483778: t_55b26747 = ({
  type: "55b26747",
  h55b26747_0: hash_884693d8
} as t_55b26747);

/**
```
const getName#5a8c3398 = <T#:0: Person#3e2389d1>(m#:0: T#:0): string#builtin ={}> m#:0.name#22eac480#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🧡🍜🐥#0
```
*/
export const hash_5a8c3398: <T_0 extends {
  h3e2389d1_0: number;
  h22eac480_0: string;
  h20646fd6_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h3e2389d1_0: number;
  h22eac480_0: string;
  h20646fd6_0: number;
}>(m: T_0) => m.h22eac480_0;

/**
```
const them#acf95cb8 = Employee#e8c17b0c{
    what#3e2389d1#0: 3,
    name#22eac480#0: "You",
    age#20646fd6#0: 100,
    address#e8c17b0c#0: "No",
}
Employee#💒{TODO SPREADs}{he8c17b0c_0: "No", h3e2389d1_0: 3}
```
*/
export const hash_acf95cb8: t_e8c17b0c = ({
  type: "e8c17b0c",
  h3e2389d1_0: 3,
  h22eac480_0: "You",
  h20646fd6_0: 100,
  he8c17b0c_0: "No"
} as t_e8c17b0c);

/**
```
const you#79c27bdd = Employee#e8c17b0c{...me#884693d8, address#e8c17b0c#0: "Yes"}
Employee#💒{TODO SPREADs}{he8c17b0c_0: "Yes", h3e2389d1_0: _#:0}
```
*/
export const hash_79c27bdd: t_e8c17b0c = ({ ...hash_884693d8,
  type: "e8c17b0c",
  he8c17b0c_0: "Yes"
} as t_e8c17b0c);

/**
```
const alsoMe#58c71266 = Person#3e2389d1{...me#884693d8, what#3e2389d1#0: 11}
Person#👨‍👩‍👧‍👦🙍‍♀️🏓{TODO SPREADs}{h3e2389d1_0: 11, h22eac480_0: _#:0, h20646fd6_0: _#:0}
```
*/
export const hash_58c71266: t_3e2389d1 = ({ ...hash_884693d8,
  type: "3e2389d1",
  h3e2389d1_0: 11
} as t_3e2389d1);

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
me#884693d8.name#22eac480#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, me#🏐.#HasName#🧡🍜🐥#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_884693d8.h22eac480_0, "June");

/*
me#884693d8.age#20646fd6#0 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, me#🏐.#HasAge#🥎👩‍🔬🐃#0, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_884693d8.h20646fd6_0, 10);

/*
alsoMe#58c71266.name#22eac480#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, alsoMe#🌾👫🧖😃.#HasName#🧡🍜🐥#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_58c71266.h22eac480_0, "June");

/*
alsoMe#58c71266.what#3e2389d1#0 ==#ec95f154#51ea2a36#0 11
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, alsoMe#🌾👫🧖😃.#Person#👨‍👩‍👧‍👦🙍‍♀️🏓#0, 11)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_58c71266.h3e2389d1_0, 11);

/*
you#79c27bdd.name#22eac480#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, you#🎳🤞🌟😃.#HasName#🧡🍜🐥#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_79c27bdd.h22eac480_0, "June");

/*
them#acf95cb8.name#22eac480#0 ==#da00b310#51ea2a36#0 "You"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, them#🦾.#HasName#🧡🍜🐥#0, "You")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_acf95cb8.h22eac480_0, "You");

/*
them#acf95cb8.address#e8c17b0c#0 ==#da00b310#51ea2a36#0 "No"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, them#🦾.#Employee#💒#0, "No")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_acf95cb8.he8c17b0c_0, "No");

/*
getName#5a8c3398<Person#3e2389d1>(m: me#884693d8) ==#da00b310#51ea2a36#0 "June"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    getName#🌝💒🚴😃<Person#👨‍👩‍👧‍👦🙍‍♀️🏓>(me#🏐),
    "June",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_5a8c3398(hash_884693d8), "June");

/*
getName#5a8c3398<Employee#e8c17b0c>(m: them#acf95cb8) ==#da00b310#51ea2a36#0 "You"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, getName#🌝💒🚴😃<Employee#💒>(them#🦾), "You")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_5a8c3398(hash_acf95cb8), "You");

/*
here#f9483778.occupant#55b26747#0.name#22eac480#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, here#🕒.#House#🚲✋🧚‍♀️😃#0.#HasName#🧡🍜🐥#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_f9483778.h55b26747_0.h22eac480_0, "June");

/*
countMe#6db48736.item#5fde9766#0 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, countMe#🚒👩‍🎤🥂😃.#Counter#🛰️🌧️🐅😃#0, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_6db48736.h5fde9766_0, 10);

/*
Counter#5fde9766<() ={}> string#builtin>{
        item#5fde9766#0: (): string#builtin ={}> "hi",
        count#5fde9766#1: 10,
    }.item#5fde9766#0() 
    ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "hi", "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, "hi", "hi");

/*
countAny#24185fc0.item#5fde9766#0<string#builtin>("String") ==#da00b310#51ea2a36#0 "hi"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    countAny#🎉🐁🦖.#Counter#🛰️🌧️🐅😃#0<string>("String"),
    "hi",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_24185fc0.h5fde9766_0("String"), "hi");

/*
countAny#24185fc0.item#5fde9766#0<int#builtin>(10) ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, countAny#🎉🐁🦖.#Counter#🛰️🌧️🐅😃#0<int>(10), "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_24185fc0.h5fde9766_0(10), "hi");

/*
countNamed#91b0a9f4.item#5fde9766#0<Person#3e2389d1>(me#884693d8) ==#da00b310#51ea2a36#0 "June"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    countNamed#🐩.#Counter#🛰️🌧️🐅😃#0<Person#👨‍👩‍👧‍👦🙍‍♀️🏓>(me#🏐),
    "June",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_91b0a9f4.h5fde9766_0(hash_884693d8), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#ec95f154#51ea2a36#0 5
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#7fb30b5a{...aDog#7033cea8, ...aPerson#f10e145c}.name#22eac480#0 
    ==#da00b310#51ea2a36#0 "ralf"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    WereWolf#🛥️👀♠️😃{TODO SPREADs}{h4f4fc676_0: _#:0, h3e2389d1_0: _#:0}.#HasName#🧡🍜🐥#0,
    "ralf",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_7033cea8,
  ...hash_f10e145c,
  type: "7fb30b5a"
} as t_7fb30b5a).h22eac480_0, "ralf");

/*
WereWolf#7fb30b5a{...aPerson#f10e145c, ...aDog#7033cea8}.name#22eac480#0 
    ==#da00b310#51ea2a36#0 "wolrf"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    WereWolf#🛥️👀♠️😃{TODO SPREADs}{h4f4fc676_0: _#:0, h3e2389d1_0: _#:0}.#HasName#🧡🍜🐥#0,
    "wolrf",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_f10e145c,
  ...hash_7033cea8,
  type: "7fb30b5a"
} as t_7fb30b5a).h22eac480_0, "wolrf");

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
One#57463bc4.name#57463bc4#0 ==#da00b310#51ea2a36#0 "One"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "One", "One")
*/
assertCall(hash_da00b310.h51ea2a36_0, "One", "One");

/*
Two#cafbe68a.name#57463bc4#0 ==#da00b310#51ea2a36#0 "Two"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Two", "Two")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Two", "Two");

/*
Two#cafbe68a.age#cafbe68a#0 ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 2, 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 2, 2);

/*
Two#cafbe68a.last#57463bc4#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
Three#75f743da.name#57463bc4#0 ==#da00b310#51ea2a36#0 "Three"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Three", "Three")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Three", "Three");

/*
Three#75f743da{age#cafbe68a#0: 5}.age#cafbe68a#0 ==#ec95f154#51ea2a36#0 5
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 5, 5)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 5, 5);

/*
Three#75f743da.size#75f743da#0 ==#ec95f154#51ea2a36#0 3
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 3, 3)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 3, 3);

/*
Three#75f743da.last#57463bc4#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
Four#258ed19c{color#258ed19c#0: "red"}.color#258ed19c#0 ==#da00b310#51ea2a36#0 "red"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "red", "red")
*/
assertCall(hash_da00b310.h51ea2a36_0, "red", "red");

/*
Four#258ed19c{color#258ed19c#0: "red"}.last#57463bc4#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
SubitemWithDefaults#716916bc{name#36a9774e#0: "Stephen"}.hasGlasses#36a9774e#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#716916bc{name#36a9774e#0: "Stephen"}.name#36a9774e#0 
    ==#da00b310#51ea2a36#0 "Stephen"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Stephen", "Stephen")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#716916bc.name#36a9774e#0 ==#da00b310#51ea2a36#0 "Hello"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Hello", "Hello")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Hello", "Hello");

/*
SubitemWithDefaults#716916bc.hasGlasses#36a9774e#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#716916bc.age#36a9774e#1 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 10, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 10, 10);