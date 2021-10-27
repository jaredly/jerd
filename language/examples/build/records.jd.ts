import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.8408403012585762) type HasAge#3fd4722e = {
    age: int#builtin,
}
```
*/
type t_3fd4722e = {
  type: "3fd4722e";
  h3fd4722e_0: number;
};

/**
```
@unique(0.5661807692527293) type HasName#4a2e4364 = {
    name: string#builtin,
}
```
*/
type t_4a2e4364 = {
  type: "4a2e4364";
  h4a2e4364_0: string;
};

/**
```
@unique(0.14972816008023876) type Person#62af9da8 = {
    ...HasName#4a2e4364,
    ...HasAge#3fd4722e,
    what: int#builtin,
}
```
*/
type t_62af9da8 = {
  type: "62af9da8";
  h62af9da8_0: number;
  h4a2e4364_0: string;
  h3fd4722e_0: number;
};

/**
```
@unique(0.5383562320075749) type Eq#2f333afa<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_2f333afa<T> = {
  type: "2f333afa";
  h2f333afa_0: (arg_0: T, arg_1: T) => boolean;
};

/**
```
@unique(0.5383562320075749) type Employee#35d142b2 = {
    ...Person#62af9da8,
    address: string#builtin,
}
```
*/
type t_35d142b2 = {
  type: "35d142b2";
  h35d142b2_0: string;
  h62af9da8_0: number;
  h4a2e4364_0: string;
  h3fd4722e_0: number;
};

/**
```
@unique(0.969424254802974) type House#76fa8d38 = {
    occupant: Person#62af9da8,
}
```
*/
type t_76fa8d38 = {
  type: "76fa8d38";
  h76fa8d38_0: t_62af9da8;
};

/**
```
@unique(0.17852990309013597) type Counter#08f30712<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_08f30712<T> = {
  type: "08f30712";
  h08f30712_0: T;
  h08f30712_1: number;
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
  hSome_0: T;
};

/**
```
@unique(0.5425139598776044) type Animal#3eab08a3 = {
    ...HasName#4a2e4364,
    furColor: string#builtin,
}
```
*/
type t_3eab08a3 = {
  type: "3eab08a3";
  h3eab08a3_0: string;
  h4a2e4364_0: string;
};

/**
```
const me#2f312324 = Person#62af9da8{
    name#4a2e4364#0: "June",
    age#3fd4722e#0: 10,
    what#62af9da8#0: 3,
}
Person#🚴⛳🐔😃{TODO SPREADs}{h62af9da8_0: 3, h4a2e4364_0: "June", h3fd4722e_0: 10}
```
*/
export const hash_2f312324: t_62af9da8 = ({
  type: "62af9da8",
  h4a2e4364_0: "June",
  h3fd4722e_0: 10,
  h62af9da8_0: 3
} as t_62af9da8);

/**
```
const aPerson#d2fd7d82 = Person#62af9da8{
    name#4a2e4364#0: "ralf",
    age#3fd4722e#0: 23,
    what#62af9da8#0: 2,
}
Person#🚴⛳🐔😃{TODO SPREADs}{h62af9da8_0: 2, h4a2e4364_0: "ralf", h3fd4722e_0: 23}
```
*/
export const hash_d2fd7d82: t_62af9da8 = ({
  type: "62af9da8",
  h4a2e4364_0: "ralf",
  h3fd4722e_0: 23,
  h62af9da8_0: 2
} as t_62af9da8);

/**
```
const aDog#39bc5c68 = Animal#3eab08a3{name#4a2e4364#0: "wolrf", furColor#3eab08a3#0: "red"}
Animal#👉🍦🤿{TODO SPREADs}{h3eab08a3_0: "red", h4a2e4364_0: "wolrf"}
```
*/
export const hash_39bc5c68: t_3eab08a3 = ({
  type: "3eab08a3",
  h4a2e4364_0: "wolrf",
  h3eab08a3_0: "red"
} as t_3eab08a3);

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
const countNamed#b973153e = Counter#08f30712<<T#:0: HasName#4a2e4364>(T#:0) ={}> string#builtin>{
    item#08f30712#0: <T#:0: HasName#4a2e4364>(input#:0: T#:0): string#builtin ={}> input#:0.name#4a2e4364#0,
    count#08f30712#1: 10,
}
Counter#🕍🦴💣{TODO SPREADs}{
    h08f30712_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🚠🌗👈😃#0,
    h08f30712_1: 10,
}
```
*/
export const hash_b973153e: t_08f30712<<T extends {
  h4a2e4364_0: string;
}>(arg_0: T) => string> = ({
  type: "08f30712",
  h08f30712_0: <T extends {
    h4a2e4364_0: string;
  }>(input: T) => input.h4a2e4364_0,
  h08f30712_1: 10
} as t_08f30712<<T extends {
  h4a2e4364_0: string;
}>(arg_0: T) => string>);

/**
```
const countAny#bb5f3180 = Counter#08f30712<<T#:0>(T#:0) ={}> string#builtin>{
    item#08f30712#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#08f30712#1: 10,
}
Counter#🕍🦴💣{TODO SPREADs}{h08f30712_0: <T>(input#:0: [var]T#:0): string => "hi", h08f30712_1: 10}
```
*/
export const hash_bb5f3180: t_08f30712<<T>(arg_0: T) => string> = ({
  type: "08f30712",
  h08f30712_0: <T>(input: T) => "hi",
  h08f30712_1: 10
} as t_08f30712<<T>(arg_0: T) => string>);

/**
```
const countMe#7e556d2e = Counter#08f30712<int#builtin>{
    item#08f30712#0: 10,
    count#08f30712#1: 4000,
}
Counter#🕍🦴💣{TODO SPREADs}{h08f30712_0: 10, h08f30712_1: 4000}
```
*/
export const hash_7e556d2e: t_08f30712<number> = ({
  type: "08f30712",
  h08f30712_0: 10,
  h08f30712_1: 4000
} as t_08f30712<number>);

/**
```
const here#14bc89be = House#76fa8d38{occupant#76fa8d38#0: me#2f312324}
House#👷‍♂️🍳⏱️😃{TODO SPREADs}{h76fa8d38_0: me#🎪😦🏖️}
```
*/
export const hash_14bc89be: t_76fa8d38 = ({
  type: "76fa8d38",
  h76fa8d38_0: hash_2f312324
} as t_76fa8d38);

/**
```
const getName#e272c22a = <T#:0: Person#62af9da8>(m#:0: T#:0): string#builtin ={}> m#:0.name#4a2e4364#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🚠🌗👈😃#0
```
*/
export const hash_e272c22a: <T extends {
  h62af9da8_0: number;
  h4a2e4364_0: string;
  h3fd4722e_0: number;
}>(arg_0: T) => string = <T extends {
  h62af9da8_0: number;
  h4a2e4364_0: string;
  h3fd4722e_0: number;
}>(m: T) => m.h4a2e4364_0;

/**
```
const them#06dbc57d = Employee#35d142b2{
    what#62af9da8#0: 3,
    name#4a2e4364#0: "You",
    age#3fd4722e#0: 100,
    address#35d142b2#0: "No",
}
Employee#🍝😖🛩️{TODO SPREADs}{h35d142b2_0: "No", h62af9da8_0: 3}
```
*/
export const hash_06dbc57d: t_35d142b2 = ({
  type: "35d142b2",
  h62af9da8_0: 3,
  h4a2e4364_0: "You",
  h3fd4722e_0: 100,
  h35d142b2_0: "No"
} as t_35d142b2);

/**
```
const you#1f03a5cc = Employee#35d142b2{...me#2f312324, address#35d142b2#0: "Yes"}
Employee#🍝😖🛩️{TODO SPREADs}{h35d142b2_0: "Yes", h62af9da8_0: _#:0}
```
*/
export const hash_1f03a5cc: t_35d142b2 = ({ ...hash_2f312324,
  type: "35d142b2",
  h35d142b2_0: "Yes"
} as t_35d142b2);

/**
```
const alsoMe#40da929e = Person#62af9da8{...me#2f312324, what#62af9da8#0: 11}
Person#🚴⛳🐔😃{TODO SPREADs}{h62af9da8_0: 11, h4a2e4364_0: _#:0, h3fd4722e_0: _#:0}
```
*/
export const hash_40da929e: t_62af9da8 = ({ ...hash_2f312324,
  type: "62af9da8",
  h62af9da8_0: 11
} as t_62af9da8);

/**
```
const StringEq#8a86d00e = Eq#2f333afa<string#builtin>{"=="#2f333afa#0: stringEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: stringEq}
```
*/
export const hash_8a86d00e: t_2f333afa<string> = ({
  type: "2f333afa",
  h2f333afa_0: stringEq
} as t_2f333afa<string>);

/**
```
const IntEq#24558044 = Eq#2f333afa<int#builtin>{"=="#2f333afa#0: intEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: intEq}
```
*/
export const hash_24558044: t_2f333afa<number> = ({
  type: "2f333afa",
  h2f333afa_0: intEq
} as t_2f333afa<number>);

/*
me#2f312324.name#4a2e4364#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, me#🎪😦🏖️.#HasName#🚠🌗👈😃#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_2f312324.h4a2e4364_0, "June");

/*
me#2f312324.age#3fd4722e#0 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, me#🎪😦🏖️.#HasAge#🐥🧑‍💻♦️#0, 10)
*/
assertCall(hash_24558044.h2f333afa_0, hash_2f312324.h3fd4722e_0, 10);

/*
alsoMe#40da929e.name#4a2e4364#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, alsoMe#🌯🥘🥰😃.#HasName#🚠🌗👈😃#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_40da929e.h4a2e4364_0, "June");

/*
alsoMe#40da929e.what#62af9da8#0 ==#24558044#2f333afa#0 11
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, alsoMe#🌯🥘🥰😃.#Person#🚴⛳🐔😃#0, 11)
*/
assertCall(hash_24558044.h2f333afa_0, hash_40da929e.h62af9da8_0, 11);

/*
you#1f03a5cc.name#4a2e4364#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, you#👨‍❤️‍👨🙆🐶.#HasName#🚠🌗👈😃#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_1f03a5cc.h4a2e4364_0, "June");

/*
them#06dbc57d.name#4a2e4364#0 ==#8a86d00e#2f333afa#0 "You"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, them#🧑‍🦼🗻🙀.#HasName#🚠🌗👈😃#0, "You")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_06dbc57d.h4a2e4364_0, "You");

/*
them#06dbc57d.address#35d142b2#0 ==#8a86d00e#2f333afa#0 "No"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, them#🧑‍🦼🗻🙀.#Employee#🍝😖🛩️#0, "No")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_06dbc57d.h35d142b2_0, "No");

/*
getName#e272c22a<Person#62af9da8>(m: me#2f312324) ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, getName#🐔<Person#🚴⛳🐔😃>(me#🎪😦🏖️), "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_e272c22a(hash_2f312324), "June");

/*
getName#e272c22a<Employee#35d142b2>(m: them#06dbc57d) ==#8a86d00e#2f333afa#0 "You"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, getName#🐔<Employee#🍝😖🛩️>(them#🧑‍🦼🗻🙀), "You")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_e272c22a(hash_06dbc57d), "You");

/*
here#14bc89be.occupant#76fa8d38#0.name#4a2e4364#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    here#🧘‍♂️🎢🧑‍🍼.#House#👷‍♂️🍳⏱️😃#0.#HasName#🚠🌗👈😃#0,
    "June",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_14bc89be.h76fa8d38_0.h4a2e4364_0, "June");

/*
countMe#7e556d2e.item#08f30712#0 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, countMe#👮🧚‍♀️🥋😃.#Counter#🕍🦴💣#0, 10)
*/
assertCall(hash_24558044.h2f333afa_0, hash_7e556d2e.h08f30712_0, 10);

/*
Counter#08f30712<() ={}> string#builtin>{
        item#08f30712#0: (): string#builtin ={}> "hi",
        count#08f30712#1: 10,
    }.item#08f30712#0() 
    ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "hi", "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "hi", "hi");

/*
countAny#bb5f3180.item#08f30712#0<string#builtin>("String") ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, countAny#🧑‍🦽.#Counter#🕍🦴💣#0<string>("String"), "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_bb5f3180.h08f30712_0("String"), "hi");

/*
countAny#bb5f3180.item#08f30712#0<int#builtin>(10) ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, countAny#🧑‍🦽.#Counter#🕍🦴💣#0<int>(10), "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_bb5f3180.h08f30712_0(10), "hi");

/*
countNamed#b973153e.item#08f30712#0<Person#62af9da8>(me#2f312324) ==#8a86d00e#2f333afa#0 "June"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    countNamed#👳‍♀️.#Counter#🕍🦴💣#0<Person#🚴⛳🐔😃>(me#🎪😦🏖️),
    "June",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_b973153e.h08f30712_0(hash_2f312324), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#24558044#2f333afa#0 5
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_24558044.h2f333afa_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#8c6117e0{...aDog#39bc5c68, ...aPerson#d2fd7d82}.name#4a2e4364#0 
    ==#8a86d00e#2f333afa#0 "ralf"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    WereWolf#🏒{TODO SPREADs}{h3eab08a3_0: _#:0, h62af9da8_0: _#:0}.#HasName#🚠🌗👈😃#0,
    "ralf",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, ({ ...hash_39bc5c68,
  ...hash_d2fd7d82,
  type: "8c6117e0"
} as t_8c6117e0).h4a2e4364_0, "ralf");

/*
WereWolf#8c6117e0{...aPerson#d2fd7d82, ...aDog#39bc5c68}.name#4a2e4364#0 
    ==#8a86d00e#2f333afa#0 "wolrf"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    WereWolf#🏒{TODO SPREADs}{h3eab08a3_0: _#:0, h62af9da8_0: _#:0}.#HasName#🚠🌗👈😃#0,
    "wolrf",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, ({ ...hash_d2fd7d82,
  ...hash_39bc5c68,
  type: "8c6117e0"
} as t_8c6117e0).h4a2e4364_0, "wolrf");

/*
SomethingWithDefaults#6441a648{name#6441a648#0: "Me", age#6441a648#1: 4}.hasGlasses#6441a648#2 
    ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SomethingWithDefaults#6441a648{
        name#6441a648#0: "Me",
        age#6441a648#1: 4,
        hasGlasses#6441a648#2: true,
    }.hasGlasses#6441a648#2 
    ==#builtin true
assertEqual(true, true)
*/
assertEqual(true, true);

/*
One#f724205c.name#f724205c#0 ==#8a86d00e#2f333afa#0 "One"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "One", "One")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "One", "One");

/*
Two#37ea3d01.name#f724205c#0 ==#8a86d00e#2f333afa#0 "Two"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Two", "Two")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Two", "Two");

/*
Two#37ea3d01.age#37ea3d01#0 ==#24558044#2f333afa#0 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 2, 2)
*/
assertCall(hash_24558044.h2f333afa_0, 2, 2);

/*
Two#37ea3d01.last#f724205c#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
Three#0bd9f45c.name#f724205c#0 ==#8a86d00e#2f333afa#0 "Three"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Three", "Three")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Three", "Three");

/*
Three#0bd9f45c{age#37ea3d01#0: 5}.age#37ea3d01#0 ==#24558044#2f333afa#0 5
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 5, 5)
*/
assertCall(hash_24558044.h2f333afa_0, 5, 5);

/*
Three#0bd9f45c.size#0bd9f45c#0 ==#24558044#2f333afa#0 3
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 3, 3)
*/
assertCall(hash_24558044.h2f333afa_0, 3, 3);

/*
Three#0bd9f45c.last#f724205c#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
Four#026ce4c8{color#026ce4c8#0: "red"}.color#026ce4c8#0 ==#8a86d00e#2f333afa#0 "red"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "red", "red")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "red", "red");

/*
Four#026ce4c8{color#026ce4c8#0: "red"}.last#f724205c#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
SubitemWithDefaults#788b52d2{name#6441a648#0: "Stephen"}.hasGlasses#6441a648#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#788b52d2{name#6441a648#0: "Stephen"}.name#6441a648#0 
    ==#8a86d00e#2f333afa#0 "Stephen"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Stephen", "Stephen")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#788b52d2.name#6441a648#0 ==#8a86d00e#2f333afa#0 "Hello"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Hello", "Hello")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Hello", "Hello");

/*
SubitemWithDefaults#788b52d2.hasGlasses#6441a648#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#788b52d2.age#6441a648#1 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 10, 10)
*/
assertCall(hash_24558044.h2f333afa_0, 10, 10);