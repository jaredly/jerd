import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.17190900029596334) type HasAge#304c4708 = {
    age: int#builtin,
}
```
*/
type t_304c4708 = {
  type: "304c4708";
  h304c4708_0: number;
};

/**
```
@unique(0.3173776871115852) type HasName#133f3ef0 = {
    name: string#builtin,
}
```
*/
type t_133f3ef0 = {
  type: "133f3ef0";
  h133f3ef0_0: string;
};

/**
```
@unique(0.7221910962235999) type Person#32398158 = {
    ...HasName#133f3ef0,
    ...HasAge#304c4708,
    what: int#builtin,
}
```
*/
type t_32398158 = {
  type: "32398158";
  h32398158_0: number;
  h133f3ef0_0: string;
  h304c4708_0: number;
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
@unique(0.847365010938303) type Employee#64b68d60 = {
    ...Person#32398158,
    address: string#builtin,
}
```
*/
type t_64b68d60 = {
  type: "64b68d60";
  h64b68d60_0: string;
  h32398158_0: number;
  h133f3ef0_0: string;
  h304c4708_0: number;
};

/**
```
@unique(0.19363310523987504) type House#36c7dd40 = {
    occupant: Person#32398158,
}
```
*/
type t_36c7dd40 = {
  type: "36c7dd40";
  h36c7dd40_0: t_32398158;
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
@unique(0.5593450613043727) type Counter#91221594<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_91221594<T> = {
  type: "91221594";
  h91221594_0: T;
  h91221594_1: number;
};

/**
```
@unique(0.49131752795885836) type Animal#56146516 = {
    ...HasName#133f3ef0,
    furColor: string#builtin,
}
```
*/
type t_56146516 = {
  type: "56146516";
  h56146516_0: string;
  h133f3ef0_0: string;
};

/**
```
const me#6910918c = Person#32398158{
    name#133f3ef0#0: "June",
    age#304c4708#0: 10,
    what#32398158#0: 3,
}
Person#🧙‍♀️🌷💈{TODO SPREADs}{h32398158_0: 3, h133f3ef0_0: "June", h304c4708_0: 10}
```
*/
export const hash_6910918c: t_32398158 = ({
  type: "32398158",
  h133f3ef0_0: "June",
  h304c4708_0: 10,
  h32398158_0: 3
} as t_32398158);

/**
```
const aDog#ab73ee4e = Animal#56146516{name#133f3ef0#0: "wolrf", furColor#56146516#0: "red"}
Animal#🧑‍💼🧑‍🔬🧜‍♀️😃{TODO SPREADs}{h56146516_0: "red", h133f3ef0_0: "wolrf"}
```
*/
export const hash_ab73ee4e: t_56146516 = ({
  type: "56146516",
  h133f3ef0_0: "wolrf",
  h56146516_0: "red"
} as t_56146516);

/**
```
const aPerson#16d31bf4 = Person#32398158{
    name#133f3ef0#0: "ralf",
    age#304c4708#0: 23,
    what#32398158#0: 2,
}
Person#🧙‍♀️🌷💈{TODO SPREADs}{h32398158_0: 2, h133f3ef0_0: "ralf", h304c4708_0: 23}
```
*/
export const hash_16d31bf4: t_32398158 = ({
  type: "32398158",
  h133f3ef0_0: "ralf",
  h304c4708_0: 23,
  h32398158_0: 2
} as t_32398158);

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
const countNamed#b2fb59b6 = Counter#91221594<<T#:0: HasName#133f3ef0>(T#:0) ={}> string#builtin>{
    item#91221594#0: <T#:0: HasName#133f3ef0>(input#:0: T#:0): string#builtin ={}> input#:0.name#133f3ef0#0,
    count#91221594#1: 10,
}
Counter#⛷️{TODO SPREADs}{
    h91221594_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🌋🏆🕵️‍♀️#0,
    h91221594_1: 10,
}
```
*/
export const hash_b2fb59b6: t_91221594<<T extends {
  h133f3ef0_0: string;
}>(arg_0: T) => string> = ({
  type: "91221594",
  h91221594_0: <T extends {
    h133f3ef0_0: string;
  }>(input: T) => input.h133f3ef0_0,
  h91221594_1: 10
} as t_91221594<<T extends {
  h133f3ef0_0: string;
}>(arg_0: T) => string>);

/**
```
const countAny#11bb0aee = Counter#91221594<<T#:0>(T#:0) ={}> string#builtin>{
    item#91221594#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#91221594#1: 10,
}
Counter#⛷️{TODO SPREADs}{h91221594_0: <T>(input#:0: [var]T#:0): string => "hi", h91221594_1: 10}
```
*/
export const hash_11bb0aee: t_91221594<<T>(arg_0: T) => string> = ({
  type: "91221594",
  h91221594_0: <T>(input: T) => "hi",
  h91221594_1: 10
} as t_91221594<<T>(arg_0: T) => string>);

/**
```
const countMe#eaa4e7ae = Counter#91221594<int#builtin>{
    item#91221594#0: 10,
    count#91221594#1: 4000,
}
Counter#⛷️{TODO SPREADs}{h91221594_0: 10, h91221594_1: 4000}
```
*/
export const hash_eaa4e7ae: t_91221594<number> = ({
  type: "91221594",
  h91221594_0: 10,
  h91221594_1: 4000
} as t_91221594<number>);

/**
```
const here#86b6cc74 = House#36c7dd40{occupant#36c7dd40#0: me#6910918c}
House#🧕🦝⏳{TODO SPREADs}{h36c7dd40_0: me#🧖😶🥞😃}
```
*/
export const hash_86b6cc74: t_36c7dd40 = ({
  type: "36c7dd40",
  h36c7dd40_0: hash_6910918c
} as t_36c7dd40);

/**
```
const getName#61de1eaa = <T#:0: Person#32398158>(m#:0: T#:0): string#builtin ={}> m#:0.name#133f3ef0#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🌋🏆🕵️‍♀️#0
```
*/
export const hash_61de1eaa: <T extends {
  h32398158_0: number;
  h133f3ef0_0: string;
  h304c4708_0: number;
}>(arg_0: T) => string = <T extends {
  h32398158_0: number;
  h133f3ef0_0: string;
  h304c4708_0: number;
}>(m: T) => m.h133f3ef0_0;

/**
```
const them#94f648d8 = Employee#64b68d60{
    what#32398158#0: 3,
    name#133f3ef0#0: "You",
    age#304c4708#0: 100,
    address#64b68d60#0: "No",
}
Employee#🧜‍♂️⛹️‍♂️🐌😃{TODO SPREADs}{h64b68d60_0: "No", h32398158_0: 3}
```
*/
export const hash_94f648d8: t_64b68d60 = ({
  type: "64b68d60",
  h32398158_0: 3,
  h133f3ef0_0: "You",
  h304c4708_0: 100,
  h64b68d60_0: "No"
} as t_64b68d60);

/**
```
const you#0e0373f8 = Employee#64b68d60{...me#6910918c, address#64b68d60#0: "Yes"}
Employee#🧜‍♂️⛹️‍♂️🐌😃{TODO SPREADs}{h64b68d60_0: "Yes", h32398158_0: _#:0}
```
*/
export const hash_0e0373f8: t_64b68d60 = ({ ...hash_6910918c,
  type: "64b68d60",
  h64b68d60_0: "Yes"
} as t_64b68d60);

/**
```
const alsoMe#18c5e161 = Person#32398158{...me#6910918c, what#32398158#0: 11}
Person#🧙‍♀️🌷💈{TODO SPREADs}{h32398158_0: 11, h133f3ef0_0: _#:0, h304c4708_0: _#:0}
```
*/
export const hash_18c5e161: t_32398158 = ({ ...hash_6910918c,
  type: "32398158",
  h32398158_0: 11
} as t_32398158);

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
me#6910918c.name#133f3ef0#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, me#🧖😶🥞😃.#HasName#🌋🏆🕵️‍♀️#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_6910918c.h133f3ef0_0, "June");

/*
me#6910918c.age#304c4708#0 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, me#🧖😶🥞😃.#HasAge#🏬🛕🏨#0, 10)
*/
assertCall(hash_24558044.h2f333afa_0, hash_6910918c.h304c4708_0, 10);

/*
alsoMe#18c5e161.name#133f3ef0#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, alsoMe#🧜‍♀️🧎‍♂️🧖.#HasName#🌋🏆🕵️‍♀️#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_18c5e161.h133f3ef0_0, "June");

/*
alsoMe#18c5e161.what#32398158#0 ==#24558044#2f333afa#0 11
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, alsoMe#🧜‍♀️🧎‍♂️🧖.#Person#🧙‍♀️🌷💈#0, 11)
*/
assertCall(hash_24558044.h2f333afa_0, hash_18c5e161.h32398158_0, 11);

/*
you#0e0373f8.name#133f3ef0#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, you#🎲👱‍♂️🙍.#HasName#🌋🏆🕵️‍♀️#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_0e0373f8.h133f3ef0_0, "June");

/*
them#94f648d8.name#133f3ef0#0 ==#8a86d00e#2f333afa#0 "You"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, them#🧑‍🦳.#HasName#🌋🏆🕵️‍♀️#0, "You")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_94f648d8.h133f3ef0_0, "You");

/*
them#94f648d8.address#64b68d60#0 ==#8a86d00e#2f333afa#0 "No"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, them#🧑‍🦳.#Employee#🧜‍♂️⛹️‍♂️🐌😃#0, "No")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_94f648d8.h64b68d60_0, "No");

/*
getName#61de1eaa<Person#32398158>(m: me#6910918c) ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, getName#🧂🕥🦔😃<Person#🧙‍♀️🌷💈>(me#🧖😶🥞😃), "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_61de1eaa(hash_6910918c), "June");

/*
getName#61de1eaa<Employee#64b68d60>(m: them#94f648d8) ==#8a86d00e#2f333afa#0 "You"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    getName#🧂🕥🦔😃<Employee#🧜‍♂️⛹️‍♂️🐌😃>(them#🧑‍🦳),
    "You",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_61de1eaa(hash_94f648d8), "You");

/*
here#86b6cc74.occupant#36c7dd40#0.name#133f3ef0#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, here#💌.#House#🧕🦝⏳#0.#HasName#🌋🏆🕵️‍♀️#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_86b6cc74.h36c7dd40_0.h133f3ef0_0, "June");

/*
countMe#eaa4e7ae.item#91221594#0 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, countMe#☂️.#Counter#⛷️#0, 10)
*/
assertCall(hash_24558044.h2f333afa_0, hash_eaa4e7ae.h91221594_0, 10);

/*
Counter#91221594<() ={}> string#builtin>{
        item#91221594#0: (): string#builtin ={}> "hi",
        count#91221594#1: 10,
    }.item#91221594#0() 
    ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "hi", "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "hi", "hi");

/*
countAny#11bb0aee.item#91221594#0<string#builtin>("String") ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, countAny#🏔️🍦👩‍🔬.#Counter#⛷️#0<string>("String"), "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_11bb0aee.h91221594_0("String"), "hi");

/*
countAny#11bb0aee.item#91221594#0<int#builtin>(10) ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, countAny#🏔️🍦👩‍🔬.#Counter#⛷️#0<int>(10), "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_11bb0aee.h91221594_0(10), "hi");

/*
countNamed#b2fb59b6.item#91221594#0<Person#32398158>(me#6910918c) ==#8a86d00e#2f333afa#0 "June"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    countNamed#🤽‍♀️.#Counter#⛷️#0<Person#🧙‍♀️🌷💈>(me#🧖😶🥞😃),
    "June",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_b2fb59b6.h91221594_0(hash_6910918c), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#24558044#2f333afa#0 5
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_24558044.h2f333afa_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#a1eeebfe{...aPerson#16d31bf4, ...aDog#ab73ee4e}.name#133f3ef0#0 
    ==#8a86d00e#2f333afa#0 "ralf"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    WereWolf#♣️{TODO SPREADs}{h56146516_0: _#:0, h32398158_0: _#:0}.#HasName#🌋🏆🕵️‍♀️#0,
    "ralf",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, ({ ...hash_16d31bf4,
  ...hash_ab73ee4e,
  type: "a1eeebfe"
} as t_a1eeebfe).h133f3ef0_0, "ralf");

/*
WereWolf#a1eeebfe{...aPerson#16d31bf4, ...aDog#ab73ee4e}.name#133f3ef0#0 
    ==#8a86d00e#2f333afa#0 "wolrf"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    WereWolf#♣️{TODO SPREADs}{h56146516_0: _#:0, h32398158_0: _#:0}.#HasName#🌋🏆🕵️‍♀️#0,
    "wolrf",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, ({ ...hash_16d31bf4,
  ...hash_ab73ee4e,
  type: "a1eeebfe"
} as t_a1eeebfe).h133f3ef0_0, "wolrf");

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
One#4bb69f9d.name#4bb69f9d#0 ==#8a86d00e#2f333afa#0 "One"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "One", "One")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "One", "One");

/*
Two#7ed3ad62.name#4bb69f9d#0 ==#8a86d00e#2f333afa#0 "Two"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Two", "Two")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Two", "Two");

/*
Two#7ed3ad62.age#7ed3ad62#0 ==#24558044#2f333afa#0 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 2, 2)
*/
assertCall(hash_24558044.h2f333afa_0, 2, 2);

/*
Two#7ed3ad62.last#4bb69f9d#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
Three#95e625dc.name#4bb69f9d#0 ==#8a86d00e#2f333afa#0 "Three"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Three", "Three")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Three", "Three");

/*
Three#95e625dc{age#7ed3ad62#0: 5}.age#7ed3ad62#0 ==#24558044#2f333afa#0 5
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 5, 5)
*/
assertCall(hash_24558044.h2f333afa_0, 5, 5);

/*
Three#95e625dc.size#95e625dc#0 ==#24558044#2f333afa#0 3
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 3, 3)
*/
assertCall(hash_24558044.h2f333afa_0, 3, 3);

/*
Three#95e625dc.last#4bb69f9d#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
Four#52847e80{color#52847e80#0: "red"}.color#52847e80#0 ==#8a86d00e#2f333afa#0 "red"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "red", "red")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "red", "red");

/*
Four#52847e80{color#52847e80#0: "red"}.last#4bb69f9d#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
SubitemWithDefaults#b71f0f3c{name#3cfcc3f6#0: "Stephen"}.hasGlasses#3cfcc3f6#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#b71f0f3c{name#3cfcc3f6#0: "Stephen"}.name#3cfcc3f6#0 
    ==#8a86d00e#2f333afa#0 "Stephen"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Stephen", "Stephen")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#b71f0f3c.name#3cfcc3f6#0 ==#8a86d00e#2f333afa#0 "Hello"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Hello", "Hello")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Hello", "Hello");

/*
SubitemWithDefaults#b71f0f3c.hasGlasses#3cfcc3f6#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#b71f0f3c.age#3cfcc3f6#1 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 10, 10)
*/
assertCall(hash_24558044.h2f333afa_0, 10, 10);