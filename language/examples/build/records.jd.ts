import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.3173776871115852) type HasAge#fa39255c = {
    age: int#builtin,
}
```
*/
type t_fa39255c = {
  type: "fa39255c";
  hfa39255c_0: number;
};

/**
```
@unique(0.8935410428147438) type HasName#670dfe3e = {
    name: string#builtin,
}
```
*/
type t_670dfe3e = {
  type: "670dfe3e";
  h670dfe3e_0: string;
};

/**
```
@unique(0.17190900029596334) type Person#768bd0fc = {
    ...HasName#670dfe3e,
    ...HasAge#fa39255c,
    what: int#builtin,
}
```
*/
type t_768bd0fc = {
  type: "768bd0fc";
  h768bd0fc_0: number;
  h670dfe3e_0: string;
  hfa39255c_0: number;
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
@unique(0.7221910962235999) type Employee#68ee9c71 = {
    ...Person#768bd0fc,
    address: string#builtin,
}
```
*/
type t_68ee9c71 = {
  type: "68ee9c71";
  h68ee9c71_0: string;
  h768bd0fc_0: number;
  h670dfe3e_0: string;
  hfa39255c_0: number;
};

/**
```
@unique(0.847365010938303) type House#c2d8fc08 = {
    occupant: Person#768bd0fc,
}
```
*/
type t_c2d8fc08 = {
  type: "c2d8fc08";
  hc2d8fc08_0: t_768bd0fc;
};

/**
```
@unique(0.19363310523987504) type Counter#20a52230<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_20a52230<T_0> = {
  type: "20a52230";
  h20a52230_0: T_0;
  h20a52230_1: number;
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
@unique(0.5593450613043727) type Animal#cf80d044 = {
    ...HasName#670dfe3e,
    furColor: string#builtin,
}
```
*/
type t_cf80d044 = {
  type: "cf80d044";
  hcf80d044_0: string;
  h670dfe3e_0: string;
};

/**
```
const me#11116ee4 = Person#768bd0fc{
    name#670dfe3e#0: "June",
    age#fa39255c#0: 10,
    what#768bd0fc#0: 3,
}
Person#🤷‍♂️🏜️🛸😃{TODO SPREADs}{h768bd0fc_0: 3, h670dfe3e_0: "June", hfa39255c_0: 10}
```
*/
export const hash_11116ee4: t_768bd0fc = ({
  type: "768bd0fc",
  h670dfe3e_0: "June",
  hfa39255c_0: 10,
  h768bd0fc_0: 3
} as t_768bd0fc);

/**
```
const aPerson#6ec8dfe0 = Person#768bd0fc{
    name#670dfe3e#0: "ralf",
    age#fa39255c#0: 23,
    what#768bd0fc#0: 2,
}
Person#🤷‍♂️🏜️🛸😃{TODO SPREADs}{h768bd0fc_0: 2, h670dfe3e_0: "ralf", hfa39255c_0: 23}
```
*/
export const hash_6ec8dfe0: t_768bd0fc = ({
  type: "768bd0fc",
  h670dfe3e_0: "ralf",
  hfa39255c_0: 23,
  h768bd0fc_0: 2
} as t_768bd0fc);

/**
```
const aDog#146e6bcd = Animal#cf80d044{name#670dfe3e#0: "wolrf", furColor#cf80d044#0: "red"}
Animal#😯{TODO SPREADs}{hcf80d044_0: "red", h670dfe3e_0: "wolrf"}
```
*/
export const hash_146e6bcd: t_cf80d044 = ({
  type: "cf80d044",
  h670dfe3e_0: "wolrf",
  hcf80d044_0: "red"
} as t_cf80d044);

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
const countNamed#ed9e213c = Counter#20a52230<<T#:0: HasName#670dfe3e>(T#:0) ={}> string#builtin>{
    item#20a52230#0: <T#:0: HasName#670dfe3e>(input#:0: T#:0): string#builtin ={}> input#:0.name#670dfe3e#0,
    count#20a52230#1: 10,
}
Counter#🐧🤱🐗{TODO SPREADs}{
    h20a52230_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🐲🕡🍊😃#0,
    h20a52230_1: 10,
}
```
*/
export const hash_ed9e213c: t_20a52230<<T_0 extends {
  h670dfe3e_0: string;
}>(arg_0: T_0) => string> = ({
  type: "20a52230",
  h20a52230_0: <T_0 extends {
    h670dfe3e_0: string;
  }>(input: T_0) => input.h670dfe3e_0,
  h20a52230_1: 10
} as t_20a52230<<T_0 extends {
  h670dfe3e_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#cb2ad660 = Counter#20a52230<<T#:0>(T#:0) ={}> string#builtin>{
    item#20a52230#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#20a52230#1: 10,
}
Counter#🐧🤱🐗{TODO SPREADs}{h20a52230_0: <T>(input#:0: [var]T#:0): string => "hi", h20a52230_1: 10}
```
*/
export const hash_cb2ad660: t_20a52230<<T_0>(arg_0: T_0) => string> = ({
  type: "20a52230",
  h20a52230_0: <T_0>(input: T_0) => "hi",
  h20a52230_1: 10
} as t_20a52230<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#6e193e84 = Counter#20a52230<int#builtin>{
    item#20a52230#0: 10,
    count#20a52230#1: 4000,
}
Counter#🐧🤱🐗{TODO SPREADs}{h20a52230_0: 10, h20a52230_1: 4000}
```
*/
export const hash_6e193e84: t_20a52230<number> = ({
  type: "20a52230",
  h20a52230_0: 10,
  h20a52230_1: 4000
} as t_20a52230<number>);

/**
```
const here#40af9fcc = House#c2d8fc08{occupant#c2d8fc08#0: me#11116ee4}
House#🙂{TODO SPREADs}{hc2d8fc08_0: me#🥄😈👨‍🔧}
```
*/
export const hash_40af9fcc: t_c2d8fc08 = ({
  type: "c2d8fc08",
  hc2d8fc08_0: hash_11116ee4
} as t_c2d8fc08);

/**
```
const getName#8a95d08a = <T#:0: Person#768bd0fc>(m#:0: T#:0): string#builtin ={}> m#:0.name#670dfe3e#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🐲🕡🍊😃#0
```
*/
export const hash_8a95d08a: <T_0 extends {
  h768bd0fc_0: number;
  h670dfe3e_0: string;
  hfa39255c_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h768bd0fc_0: number;
  h670dfe3e_0: string;
  hfa39255c_0: number;
}>(m: T_0) => m.h670dfe3e_0;

/**
```
const them#ca7d546e = Employee#68ee9c71{
    what#768bd0fc#0: 3,
    name#670dfe3e#0: "You",
    age#fa39255c#0: 100,
    address#68ee9c71#0: "No",
}
Employee#🙉🌩️🥖😃{TODO SPREADs}{h68ee9c71_0: "No", h768bd0fc_0: 3}
```
*/
export const hash_ca7d546e: t_68ee9c71 = ({
  type: "68ee9c71",
  h768bd0fc_0: 3,
  h670dfe3e_0: "You",
  hfa39255c_0: 100,
  h68ee9c71_0: "No"
} as t_68ee9c71);

/**
```
const you#57ace514 = Employee#68ee9c71{...me#11116ee4, address#68ee9c71#0: "Yes"}
Employee#🙉🌩️🥖😃{TODO SPREADs}{h68ee9c71_0: "Yes", h768bd0fc_0: _#:0}
```
*/
export const hash_57ace514: t_68ee9c71 = ({ ...hash_11116ee4,
  type: "68ee9c71",
  h68ee9c71_0: "Yes"
} as t_68ee9c71);

/**
```
const alsoMe#8bf6f704 = Person#768bd0fc{...me#11116ee4, what#768bd0fc#0: 11}
Person#🤷‍♂️🏜️🛸😃{TODO SPREADs}{h768bd0fc_0: 11, h670dfe3e_0: _#:0, hfa39255c_0: _#:0}
```
*/
export const hash_8bf6f704: t_768bd0fc = ({ ...hash_11116ee4,
  type: "768bd0fc",
  h768bd0fc_0: 11
} as t_768bd0fc);

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
me#11116ee4.name#670dfe3e#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, me#🥄😈👨‍🔧.#HasName#🐲🕡🍊😃#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_11116ee4.h670dfe3e_0, "June");

/*
me#11116ee4.age#fa39255c#0 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, me#🥄😈👨‍🔧.#HasAge#🧛#0, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_11116ee4.hfa39255c_0, 10);

/*
alsoMe#8bf6f704.name#670dfe3e#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, alsoMe#🏨.#HasName#🐲🕡🍊😃#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_8bf6f704.h670dfe3e_0, "June");

/*
alsoMe#8bf6f704.what#768bd0fc#0 ==#ec95f154#51ea2a36#0 11
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, alsoMe#🏨.#Person#🤷‍♂️🏜️🛸😃#0, 11)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_8bf6f704.h768bd0fc_0, 11);

/*
you#57ace514.name#670dfe3e#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, you#👨‍🏭🚕🧑‍🦯😃.#HasName#🐲🕡🍊😃#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_57ace514.h670dfe3e_0, "June");

/*
them#ca7d546e.name#670dfe3e#0 ==#da00b310#51ea2a36#0 "You"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, them#😿.#HasName#🐲🕡🍊😃#0, "You")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_ca7d546e.h670dfe3e_0, "You");

/*
them#ca7d546e.address#68ee9c71#0 ==#da00b310#51ea2a36#0 "No"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, them#😿.#Employee#🙉🌩️🥖😃#0, "No")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_ca7d546e.h68ee9c71_0, "No");

/*
getName#8a95d08a<Person#768bd0fc>(m: me#11116ee4) ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, getName#💥<Person#🤷‍♂️🏜️🛸😃>(me#🥄😈👨‍🔧), "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_8a95d08a(hash_11116ee4), "June");

/*
getName#8a95d08a<Employee#68ee9c71>(m: them#ca7d546e) ==#da00b310#51ea2a36#0 "You"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, getName#💥<Employee#🙉🌩️🥖😃>(them#😿), "You")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_8a95d08a(hash_ca7d546e), "You");

/*
here#40af9fcc.occupant#c2d8fc08#0.name#670dfe3e#0 ==#da00b310#51ea2a36#0 "June"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, here#🎟️⛳😉😃.#House#🙂#0.#HasName#🐲🕡🍊😃#0, "June")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_40af9fcc.hc2d8fc08_0.h670dfe3e_0, "June");

/*
countMe#6e193e84.item#20a52230#0 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, countMe#🥒🐝🥢😃.#Counter#🐧🤱🐗#0, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_6e193e84.h20a52230_0, 10);

/*
Counter#20a52230<() ={}> string#builtin>{
        item#20a52230#0: (): string#builtin ={}> "hi",
        count#20a52230#1: 10,
    }.item#20a52230#0() 
    ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "hi", "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, "hi", "hi");

/*
countAny#cb2ad660.item#20a52230#0<string#builtin>("String") ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, countAny#🌷.#Counter#🐧🤱🐗#0<string>("String"), "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_cb2ad660.h20a52230_0("String"), "hi");

/*
countAny#cb2ad660.item#20a52230#0<int#builtin>(10) ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, countAny#🌷.#Counter#🐧🤱🐗#0<int>(10), "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_cb2ad660.h20a52230_0(10), "hi");

/*
countNamed#ed9e213c.item#20a52230#0<Person#768bd0fc>(me#11116ee4) ==#da00b310#51ea2a36#0 "June"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    countNamed#👳.#Counter#🐧🤱🐗#0<Person#🤷‍♂️🏜️🛸😃>(me#🥄😈👨‍🔧),
    "June",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_ed9e213c.h20a52230_0(hash_11116ee4), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#ec95f154#51ea2a36#0 5
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#c62d8e38{...aDog#146e6bcd, ...aPerson#6ec8dfe0}.name#670dfe3e#0 
    ==#da00b310#51ea2a36#0 "ralf"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    WereWolf#🦜{TODO SPREADs}{hcf80d044_0: _#:0, h768bd0fc_0: _#:0}.#HasName#🐲🕡🍊😃#0,
    "ralf",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_146e6bcd,
  ...hash_6ec8dfe0,
  type: "c62d8e38"
} as t_c62d8e38).h670dfe3e_0, "ralf");

/*
WereWolf#c62d8e38{...aPerson#6ec8dfe0, ...aDog#146e6bcd}.name#670dfe3e#0 
    ==#da00b310#51ea2a36#0 "wolrf"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    WereWolf#🦜{TODO SPREADs}{hcf80d044_0: _#:0, h768bd0fc_0: _#:0}.#HasName#🐲🕡🍊😃#0,
    "wolrf",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_6ec8dfe0,
  ...hash_146e6bcd,
  type: "c62d8e38"
} as t_c62d8e38).h670dfe3e_0, "wolrf");

/*
SomethingWithDefaults#1d9d1615{name#1d9d1615#0: "Me", age#1d9d1615#1: 4}.hasGlasses#1d9d1615#2 
    ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SomethingWithDefaults#1d9d1615{
        name#1d9d1615#0: "Me",
        age#1d9d1615#1: 4,
        hasGlasses#1d9d1615#2: true,
    }.hasGlasses#1d9d1615#2 
    ==#builtin true
assertEqual(true, true)
*/
assertEqual(true, true);

/*
One#22a7cbf6.name#22a7cbf6#0 ==#da00b310#51ea2a36#0 "One"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "One", "One")
*/
assertCall(hash_da00b310.h51ea2a36_0, "One", "One");

/*
Two#523ce19e.name#22a7cbf6#0 ==#da00b310#51ea2a36#0 "Two"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Two", "Two")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Two", "Two");

/*
Two#523ce19e.age#523ce19e#0 ==#ec95f154#51ea2a36#0 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 2, 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 2, 2);

/*
Two#523ce19e.last#22a7cbf6#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
Three#9da778fc.name#22a7cbf6#0 ==#da00b310#51ea2a36#0 "Three"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Three", "Three")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Three", "Three");

/*
Three#9da778fc{age#523ce19e#0: 5}.age#523ce19e#0 ==#ec95f154#51ea2a36#0 5
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 5, 5)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 5, 5);

/*
Three#9da778fc.size#9da778fc#0 ==#ec95f154#51ea2a36#0 3
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 3, 3)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 3, 3);

/*
Three#9da778fc.last#22a7cbf6#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
Four#2d1aa91a{color#2d1aa91a#0: "red"}.color#2d1aa91a#0 ==#da00b310#51ea2a36#0 "red"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "red", "red")
*/
assertCall(hash_da00b310.h51ea2a36_0, "red", "red");

/*
Four#2d1aa91a{color#2d1aa91a#0: "red"}.last#22a7cbf6#1 ==#da00b310#51ea2a36#0 "Last"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Last", "Last")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Last", "Last");

/*
SubitemWithDefaults#0d85ed7a{name#1d9d1615#0: "Stephen"}.hasGlasses#1d9d1615#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#0d85ed7a{name#1d9d1615#0: "Stephen"}.name#1d9d1615#0 
    ==#da00b310#51ea2a36#0 "Stephen"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Stephen", "Stephen")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#0d85ed7a.name#1d9d1615#0 ==#da00b310#51ea2a36#0 "Hello"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "Hello", "Hello")
*/
assertCall(hash_da00b310.h51ea2a36_0, "Hello", "Hello");

/*
SubitemWithDefaults#0d85ed7a.hasGlasses#1d9d1615#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#0d85ed7a.age#1d9d1615#1 ==#ec95f154#51ea2a36#0 10
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 10, 10)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 10, 10);