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
@unique(0.7221910962235999) type Person#9d950a36 = {
    ...HasName#80c3ca0c,
    ...HasAge#55ecd4f4,
    what: int#builtin,
}
```
*/
type t_9d950a36 = {
  type: "9d950a36";
  h9d950a36_0: number;
  h80c3ca0c_0: string;
  h55ecd4f4_0: number;
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
@unique(0.847365010938303) type Employee#6631fbda = {
    ...Person#9d950a36,
    address: string#builtin,
}
```
*/
type t_6631fbda = {
  type: "6631fbda";
  h6631fbda_0: string;
  h9d950a36_0: number;
  h80c3ca0c_0: string;
  h55ecd4f4_0: number;
};

/**
```
@unique(0.19363310523987504) type House#8c14ea32 = {
    occupant: Person#9d950a36,
}
```
*/
type t_8c14ea32 = {
  type: "8c14ea32";
  h8c14ea32_0: t_9d950a36;
};

/**
```
@unique(0.5593450613043727) type Counter#2599b683<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_2599b683<T_0> = {
  type: "2599b683";
  h2599b683_0: T_0;
  h2599b683_1: number;
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
@unique(0.49131752795885836) type Animal#c265a206 = {
    ...HasName#80c3ca0c,
    furColor: string#builtin,
}
```
*/
type t_c265a206 = {
  type: "c265a206";
  hc265a206_0: string;
  h80c3ca0c_0: string;
};

/**
```
const me#3759ec44 = Person#9d950a36{
    name#80c3ca0c#0: "June",
    age#55ecd4f4#0: 10,
    what#9d950a36#0: 3,
}
Person#🦩{TODO SPREADs}{h9d950a36_0: 3, h80c3ca0c_0: "June", h55ecd4f4_0: 10}
```
*/
export const hash_3759ec44: t_9d950a36 = ({
  type: "9d950a36",
  h80c3ca0c_0: "June",
  h55ecd4f4_0: 10,
  h9d950a36_0: 3
} as t_9d950a36);

/**
```
const aPerson#20b371e8 = Person#9d950a36{
    name#80c3ca0c#0: "ralf",
    age#55ecd4f4#0: 23,
    what#9d950a36#0: 2,
}
Person#🦩{TODO SPREADs}{h9d950a36_0: 2, h80c3ca0c_0: "ralf", h55ecd4f4_0: 23}
```
*/
export const hash_20b371e8: t_9d950a36 = ({
  type: "9d950a36",
  h80c3ca0c_0: "ralf",
  h55ecd4f4_0: 23,
  h9d950a36_0: 2
} as t_9d950a36);

/**
```
const aDog#060f3d6c = Animal#c265a206{name#80c3ca0c#0: "wolrf", furColor#c265a206#0: "red"}
Animal#🐃{TODO SPREADs}{hc265a206_0: "red", h80c3ca0c_0: "wolrf"}
```
*/
export const hash_060f3d6c: t_c265a206 = ({
  type: "c265a206",
  h80c3ca0c_0: "wolrf",
  hc265a206_0: "red"
} as t_c265a206);

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
const countNamed#633c8821 = Counter#2599b683<<T#:0: HasName#80c3ca0c>(T#:0) ={}> string#builtin>{
    item#2599b683#0: <T#:0: HasName#80c3ca0c>(input#:0: T#:0): string#builtin ={}> input#:0.name#80c3ca0c#0,
    count#2599b683#1: 10,
}
Counter#🌶️🍇💮{TODO SPREADs}{
    h2599b683_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🐏#0,
    h2599b683_1: 10,
}
```
*/
export const hash_633c8821: t_2599b683<<T_0 extends {
  h80c3ca0c_0: string;
}>(arg_0: T_0) => string> = ({
  type: "2599b683",
  h2599b683_0: <T_0 extends {
    h80c3ca0c_0: string;
  }>(input: T_0) => input.h80c3ca0c_0,
  h2599b683_1: 10
} as t_2599b683<<T_0 extends {
  h80c3ca0c_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#36465d74 = Counter#2599b683<<T#:0>(T#:0) ={}> string#builtin>{
    item#2599b683#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#2599b683#1: 10,
}
Counter#🌶️🍇💮{TODO SPREADs}{
    h2599b683_0: <T>(input#:0: [var]T#:0): string => "hi",
    h2599b683_1: 10,
}
```
*/
export const hash_36465d74: t_2599b683<<T_0>(arg_0: T_0) => string> = ({
  type: "2599b683",
  h2599b683_0: <T_0>(input: T_0) => "hi",
  h2599b683_1: 10
} as t_2599b683<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#02712b19 = Counter#2599b683<int#builtin>{
    item#2599b683#0: 10,
    count#2599b683#1: 4000,
}
Counter#🌶️🍇💮{TODO SPREADs}{h2599b683_0: 10, h2599b683_1: 4000}
```
*/
export const hash_02712b19: t_2599b683<number> = ({
  type: "2599b683",
  h2599b683_0: 10,
  h2599b683_1: 4000
} as t_2599b683<number>);

/**
```
const here#5f16a694 = House#8c14ea32{occupant#8c14ea32#0: me#3759ec44}
House#🦅{TODO SPREADs}{h8c14ea32_0: me#😯🥝🕜}
```
*/
export const hash_5f16a694: t_8c14ea32 = ({
  type: "8c14ea32",
  h8c14ea32_0: hash_3759ec44
} as t_8c14ea32);

/**
```
const getName#aac49c28 = <T#:0: Person#9d950a36>(m#:0: T#:0): string#builtin ={}> m#:0.name#80c3ca0c#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🐏#0
```
*/
export const hash_aac49c28: <T_0 extends {
  h9d950a36_0: number;
  h80c3ca0c_0: string;
  h55ecd4f4_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h9d950a36_0: number;
  h80c3ca0c_0: string;
  h55ecd4f4_0: number;
}>(m: T_0) => m.h80c3ca0c_0;

/**
```
const them#1906f734 = Employee#6631fbda{
    what#9d950a36#0: 3,
    name#80c3ca0c#0: "You",
    age#55ecd4f4#0: 100,
    address#6631fbda#0: "No",
}
Employee#🏉💔🌳😃{TODO SPREADs}{h6631fbda_0: "No", h9d950a36_0: 3}
```
*/
export const hash_1906f734: t_6631fbda = ({
  type: "6631fbda",
  h9d950a36_0: 3,
  h80c3ca0c_0: "You",
  h55ecd4f4_0: 100,
  h6631fbda_0: "No"
} as t_6631fbda);

/**
```
const you#6967b854 = Employee#6631fbda{...me#3759ec44, address#6631fbda#0: "Yes"}
Employee#🏉💔🌳😃{TODO SPREADs}{h6631fbda_0: "Yes", h9d950a36_0: _#:0}
```
*/
export const hash_6967b854: t_6631fbda = ({ ...hash_3759ec44,
  type: "6631fbda",
  h6631fbda_0: "Yes"
} as t_6631fbda);

/**
```
const alsoMe#cc24dff4 = Person#9d950a36{...me#3759ec44, what#9d950a36#0: 11}
Person#🦩{TODO SPREADs}{h9d950a36_0: 11, h80c3ca0c_0: _#:0, h55ecd4f4_0: _#:0}
```
*/
export const hash_cc24dff4: t_9d950a36 = ({ ...hash_3759ec44,
  type: "9d950a36",
  h9d950a36_0: 11
} as t_9d950a36);

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
me#3759ec44.name#80c3ca0c#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, me#😯🥝🕜.#HasName#🐏#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_3759ec44.h80c3ca0c_0, "June");

/*
me#3759ec44.age#55ecd4f4#0 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, me#😯🥝🕜.#HasAge#🧏‍♀️🚑🧛‍♀️😃#0, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_3759ec44.h55ecd4f4_0, 10);

/*
alsoMe#cc24dff4.name#80c3ca0c#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, alsoMe#🧿.#HasName#🐏#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_cc24dff4.h80c3ca0c_0, "June");

/*
alsoMe#cc24dff4.what#9d950a36#0 ==#ec95f154#51ea2a36#0 11
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, alsoMe#🧿.#Person#🦩#0, 11)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_cc24dff4.h9d950a36_0, 11);

/*
you#6967b854.name#80c3ca0c#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, you#😩🦍🥩😃.#HasName#🐏#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_6967b854.h80c3ca0c_0, "June");

/*
them#1906f734.name#80c3ca0c#0 ==#da00b310#51ea2a36#0 "You"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, them#🚐🧘🧗‍♂️.#HasName#🐏#0, "You")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_1906f734.h80c3ca0c_0, "You");

/*
them#1906f734.address#6631fbda#0 ==#da00b310#51ea2a36#0 "No"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, them#🚐🧘🧗‍♂️.#Employee#🏉💔🌳😃#0, "No")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_1906f734.h6631fbda_0, "No");

/*
getName#aac49c28<Person#9d950a36>(m: me#3759ec44) ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, getName#😬<Person#🦩>(me#😯🥝🕜), "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_aac49c28(hash_3759ec44), "June");

/*
getName#aac49c28<Employee#6631fbda>(m: them#1906f734) ==#da00b310#51ea2a36#0 "You"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, getName#😬<Employee#🏉💔🌳😃>(them#🚐🧘🧗‍♂️), "You")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_aac49c28(hash_1906f734), "You");

/*
here#5f16a694.occupant#8c14ea32#0.name#80c3ca0c#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, here#🍖🚴‍♂️🐕😃.#House#🦅#0.#HasName#🐏#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_5f16a694.h8c14ea32_0.h80c3ca0c_0, "June");

/*
countMe#02712b19.item#2599b683#0 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, countMe#🏙️😨🙄.#Counter#🌶️🍇💮#0, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_02712b19.h2599b683_0, 10);

/*
Counter#2599b683<() ={}> string#builtin>{
        item#2599b683#0: (): string#builtin ={}> "hi",
        count#2599b683#1: 10,
    }.item#2599b683#0() 
    ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "hi", "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, "hi", "hi");

/*
countAny#36465d74.item#2599b683#0<string#builtin>("String") ==#da00b310#51ea2a36#0 "hi"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    countAny#🧍🏌️‍♂️🚠.#Counter#🌶️🍇💮#0<string>("String"),
    "hi",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_36465d74.h2599b683_0("String"), "hi");

/*
countAny#36465d74.item#2599b683#0<int#builtin>(10) ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, countAny#🧍🏌️‍♂️🚠.#Counter#🌶️🍇💮#0<int>(10), "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_36465d74.h2599b683_0(10), "hi");

/*
countNamed#633c8821.item#2599b683#0<Person#9d950a36>(me#3759ec44) ==#da00b310#51ea2a36#0 "June"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    countNamed#🤨🎢🦆😃.#Counter#🌶️🍇💮#0<Person#🦩>(me#😯🥝🕜),
    "June",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_633c8821.h2599b683_0(hash_3759ec44), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#ec95f154#51ea2a36#0 5
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#5f39ceda{...aDog#060f3d6c, ...aPerson#20b371e8}.name#80c3ca0c#0 
    ==#da00b310#51ea2a36#0 "ralf"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    WereWolf#🍻🍍🐕‍🦺😃{TODO SPREADs}{hc265a206_0: _#:0, h9d950a36_0: _#:0}.#HasName#🐏#0,
    "ralf",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_060f3d6c,
  ...hash_20b371e8,
  type: "5f39ceda"
} as t_5f39ceda).h80c3ca0c_0, "ralf");

/*
WereWolf#5f39ceda{...aPerson#20b371e8, ...aDog#060f3d6c}.name#80c3ca0c#0 
    ==#da00b310#51ea2a36#0 "wolrf"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    WereWolf#🍻🍍🐕‍🦺😃{TODO SPREADs}{hc265a206_0: _#:0, h9d950a36_0: _#:0}.#HasName#🐏#0,
    "wolrf",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_20b371e8,
  ...hash_060f3d6c,
  type: "5f39ceda"
} as t_5f39ceda).h80c3ca0c_0, "wolrf");

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
One#4bb69f9d.name#4bb69f9d#0 ==#da00b310#51ea2a36#0 "One"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "One", "One")
*/
assertCall(hash_da00b310.h51ea2a36_0, "One", "One");

/*
Two#6be83e87.name#4bb69f9d#0 ==#da00b310#51ea2a36#0 "Two"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Two", "Two")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Two", "Two");

/*
Two#6be83e87.age#6be83e87#0 ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 2, 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 2, 2);

/*
Two#6be83e87.last#4bb69f9d#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
Three#0d40b89f.name#4bb69f9d#0 ==#da00b310#51ea2a36#0 "Three"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Three", "Three")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Three", "Three");

/*
Three#0d40b89f{age#6be83e87#0: 5}.age#6be83e87#0 ==#ec95f154#51ea2a36#0 5
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 5, 5)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 5, 5);

/*
Three#0d40b89f.size#0d40b89f#0 ==#ec95f154#51ea2a36#0 3
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 3, 3)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 3, 3);

/*
Three#0d40b89f.last#4bb69f9d#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
Four#58bf9be2{color#58bf9be2#0: "red"}.color#58bf9be2#0 ==#da00b310#51ea2a36#0 "red"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "red", "red")
*/
assertCall(hash_da00b310.h51ea2a36_0, "red", "red");

/*
Four#58bf9be2{color#58bf9be2#0: "red"}.last#4bb69f9d#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
SubitemWithDefaults#a5fd0efe{name#3cfcc3f6#0: "Stephen"}.hasGlasses#3cfcc3f6#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#a5fd0efe{name#3cfcc3f6#0: "Stephen"}.name#3cfcc3f6#0 
    ==#da00b310#51ea2a36#0 "Stephen"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Stephen", "Stephen")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#a5fd0efe.name#3cfcc3f6#0 ==#da00b310#51ea2a36#0 "Hello"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Hello", "Hello")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Hello", "Hello");

/*
SubitemWithDefaults#a5fd0efe.hasGlasses#3cfcc3f6#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#a5fd0efe.age#3cfcc3f6#1 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 10, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 10, 10);