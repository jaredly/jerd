import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@unique(0.8935410428147438) type HasAge#5f1552d4 = {
    age: int#builtin,
}
```
*/
type t_5f1552d4 = {
  type: "5f1552d4";
  h5f1552d4_0: number;
};

/**
```
@unique(0.1529782475451004) type HasName#4ca5ebe4 = {
    name: string#builtin,
}
```
*/
type t_4ca5ebe4 = {
  type: "4ca5ebe4";
  h4ca5ebe4_0: string;
};

/**
```
@unique(0.3173776871115852) type Person#7286e49b = {
    ...HasName#4ca5ebe4,
    ...HasAge#5f1552d4,
    what: int#builtin,
}
```
*/
type t_7286e49b = {
  type: "7286e49b";
  h7286e49b_0: number;
  h4ca5ebe4_0: string;
  h5f1552d4_0: number;
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
@unique(0.17190900029596334) type Employee#5535830a = {
    ...Person#7286e49b,
    address: string#builtin,
}
```
*/
type t_5535830a = {
  type: "5535830a";
  h5535830a_0: string;
  h7286e49b_0: number;
  h4ca5ebe4_0: string;
  h5f1552d4_0: number;
};

/**
```
@unique(0.7221910962235999) type House#fe565314 = {
    occupant: Person#7286e49b,
}
```
*/
type t_fe565314 = {
  type: "fe565314";
  hfe565314_0: t_7286e49b;
};

/**
```
@unique(0.847365010938303) type Counter#06bb0187<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_06bb0187<T> = {
  type: "06bb0187";
  h06bb0187_0: T;
  h06bb0187_1: number;
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
@unique(0.19363310523987504) type Animal#0f9f18da = {
    ...HasName#4ca5ebe4,
    furColor: string#builtin,
}
```
*/
type t_0f9f18da = {
  type: "0f9f18da";
  h0f9f18da_0: string;
  h4ca5ebe4_0: string;
};

/**
```
const me#3c441a16 = Person#7286e49b{
    name#4ca5ebe4#0: "June",
    age#5f1552d4#0: 10,
    what#7286e49b#0: 3,
}
Person#👌🤾‍♀️🚅😃{TODO SPREADs}{h7286e49b_0: 3, h4ca5ebe4_0: "June", h5f1552d4_0: 10}
```
*/
export const hash_3c441a16: t_7286e49b = ({
  type: "7286e49b",
  h4ca5ebe4_0: "June",
  h5f1552d4_0: 10,
  h7286e49b_0: 3
} as t_7286e49b);

/**
```
const aPerson#6d763106 = Person#7286e49b{
    name#4ca5ebe4#0: "ralf",
    age#5f1552d4#0: 23,
    what#7286e49b#0: 2,
}
Person#👌🤾‍♀️🚅😃{TODO SPREADs}{h7286e49b_0: 2, h4ca5ebe4_0: "ralf", h5f1552d4_0: 23}
```
*/
export const hash_6d763106: t_7286e49b = ({
  type: "7286e49b",
  h4ca5ebe4_0: "ralf",
  h5f1552d4_0: 23,
  h7286e49b_0: 2
} as t_7286e49b);

/**
```
const aDog#409d95c4 = Animal#0f9f18da{name#4ca5ebe4#0: "wolrf", furColor#0f9f18da#0: "red"}
Animal#🧑‍🦲🎐🤦‍♂️{TODO SPREADs}{h0f9f18da_0: "red", h4ca5ebe4_0: "wolrf"}
```
*/
export const hash_409d95c4: t_0f9f18da = ({
  type: "0f9f18da",
  h4ca5ebe4_0: "wolrf",
  h0f9f18da_0: "red"
} as t_0f9f18da);

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
const countNamed#9c808e1e = Counter#06bb0187<<T#:0: HasName#4ca5ebe4>(T#:0) ={}> string#builtin>{
    item#06bb0187#0: <T#:0: HasName#4ca5ebe4>(input#:0: T#:0): string#builtin ={}> input#:0.name#4ca5ebe4#0,
    count#06bb0187#1: 10,
}
Counter#🕺🦑😼{TODO SPREADs}{
    h06bb0187_0: <T>(input#:0: [var]T#:0): string => input#:0.#HasName#🥊🧑‍🦯🧑😃#0,
    h06bb0187_1: 10,
}
```
*/
export const hash_9c808e1e: t_06bb0187<<T extends {
  h4ca5ebe4_0: string;
}>(arg_0: T) => string> = ({
  type: "06bb0187",
  h06bb0187_0: <T extends {
    h4ca5ebe4_0: string;
  }>(input: T) => input.h4ca5ebe4_0,
  h06bb0187_1: 10
} as t_06bb0187<<T extends {
  h4ca5ebe4_0: string;
}>(arg_0: T) => string>);

/**
```
const countAny#457ae1ce = Counter#06bb0187<<T#:0>(T#:0) ={}> string#builtin>{
    item#06bb0187#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#06bb0187#1: 10,
}
Counter#🕺🦑😼{TODO SPREADs}{h06bb0187_0: <T>(input#:0: [var]T#:0): string => "hi", h06bb0187_1: 10}
```
*/
export const hash_457ae1ce: t_06bb0187<<T>(arg_0: T) => string> = ({
  type: "06bb0187",
  h06bb0187_0: <T>(input: T) => "hi",
  h06bb0187_1: 10
} as t_06bb0187<<T>(arg_0: T) => string>);

/**
```
const countMe#589a12e6 = Counter#06bb0187<int#builtin>{
    item#06bb0187#0: 10,
    count#06bb0187#1: 4000,
}
Counter#🕺🦑😼{TODO SPREADs}{h06bb0187_0: 10, h06bb0187_1: 4000}
```
*/
export const hash_589a12e6: t_06bb0187<number> = ({
  type: "06bb0187",
  h06bb0187_0: 10,
  h06bb0187_1: 4000
} as t_06bb0187<number>);

/**
```
const here#68399ade = House#fe565314{occupant#fe565314#0: me#3c441a16}
House#🕋{TODO SPREADs}{hfe565314_0: me#🐭👩‍🏫🎎}
```
*/
export const hash_68399ade: t_fe565314 = ({
  type: "fe565314",
  hfe565314_0: hash_3c441a16
} as t_fe565314);

/**
```
const getName#dc4732fc = <T#:0: Person#7286e49b>(m#:0: T#:0): string#builtin ={}> m#:0.name#4ca5ebe4#0
<T>(m#:0: [var]T#:0): string => m#:0.#HasName#🥊🧑‍🦯🧑😃#0
```
*/
export const hash_dc4732fc: <T extends {
  h7286e49b_0: number;
  h4ca5ebe4_0: string;
  h5f1552d4_0: number;
}>(arg_0: T) => string = <T extends {
  h7286e49b_0: number;
  h4ca5ebe4_0: string;
  h5f1552d4_0: number;
}>(m: T) => m.h4ca5ebe4_0;

/**
```
const them#5dfdec20 = Employee#5535830a{
    what#7286e49b#0: 3,
    name#4ca5ebe4#0: "You",
    age#5f1552d4#0: 100,
    address#5535830a#0: "No",
}
Employee#🏯🧜‍♂️🦹😃{TODO SPREADs}{h5535830a_0: "No", h7286e49b_0: 3}
```
*/
export const hash_5dfdec20: t_5535830a = ({
  type: "5535830a",
  h7286e49b_0: 3,
  h4ca5ebe4_0: "You",
  h5f1552d4_0: 100,
  h5535830a_0: "No"
} as t_5535830a);

/**
```
const you#6e32cb1c = Employee#5535830a{...me#3c441a16, address#5535830a#0: "Yes"}
Employee#🏯🧜‍♂️🦹😃{TODO SPREADs}{h5535830a_0: "Yes", h7286e49b_0: _#:0}
```
*/
export const hash_6e32cb1c: t_5535830a = ({ ...hash_3c441a16,
  type: "5535830a",
  h5535830a_0: "Yes"
} as t_5535830a);

/**
```
const alsoMe#a532963e = Person#7286e49b{...me#3c441a16, what#7286e49b#0: 11}
Person#👌🤾‍♀️🚅😃{TODO SPREADs}{h7286e49b_0: 11, h4ca5ebe4_0: _#:0, h5f1552d4_0: _#:0}
```
*/
export const hash_a532963e: t_7286e49b = ({ ...hash_3c441a16,
  type: "7286e49b",
  h7286e49b_0: 11
} as t_7286e49b);

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
me#3c441a16.name#4ca5ebe4#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, me#🐭👩‍🏫🎎.#HasName#🥊🧑‍🦯🧑😃#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_3c441a16.h4ca5ebe4_0, "June");

/*
me#3c441a16.age#5f1552d4#0 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, me#🐭👩‍🏫🎎.#HasAge#🍶🦹‍♂️🐕😃#0, 10)
*/
assertCall(hash_24558044.h2f333afa_0, hash_3c441a16.h5f1552d4_0, 10);

/*
alsoMe#a532963e.name#4ca5ebe4#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, alsoMe#🐲.#HasName#🥊🧑‍🦯🧑😃#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_a532963e.h4ca5ebe4_0, "June");

/*
alsoMe#a532963e.what#7286e49b#0 ==#24558044#2f333afa#0 11
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, alsoMe#🐲.#Person#👌🤾‍♀️🚅😃#0, 11)
*/
assertCall(hash_24558044.h2f333afa_0, hash_a532963e.h7286e49b_0, 11);

/*
you#6e32cb1c.name#4ca5ebe4#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, you#🌆🤝🍴😃.#HasName#🥊🧑‍🦯🧑😃#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_6e32cb1c.h4ca5ebe4_0, "June");

/*
them#5dfdec20.name#4ca5ebe4#0 ==#8a86d00e#2f333afa#0 "You"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, them#🤐🕟👨‍👦‍👦😃.#HasName#🥊🧑‍🦯🧑😃#0, "You")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_5dfdec20.h4ca5ebe4_0, "You");

/*
them#5dfdec20.address#5535830a#0 ==#8a86d00e#2f333afa#0 "No"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, them#🤐🕟👨‍👦‍👦😃.#Employee#🏯🧜‍♂️🦹😃#0, "No")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_5dfdec20.h5535830a_0, "No");

/*
getName#dc4732fc<Person#7286e49b>(m: me#3c441a16) ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, getName#🏚️<Person#👌🤾‍♀️🚅😃>(me#🐭👩‍🏫🎎), "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_dc4732fc(hash_3c441a16), "June");

/*
getName#dc4732fc<Employee#5535830a>(m: them#5dfdec20) ==#8a86d00e#2f333afa#0 "You"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    getName#🏚️<Employee#🏯🧜‍♂️🦹😃>(them#🤐🕟👨‍👦‍👦😃),
    "You",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_dc4732fc(hash_5dfdec20), "You");

/*
here#68399ade.occupant#fe565314#0.name#4ca5ebe4#0 ==#8a86d00e#2f333afa#0 "June"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, here#🧃🌾🌶️😃.#House#🕋#0.#HasName#🥊🧑‍🦯🧑😃#0, "June")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_68399ade.hfe565314_0.h4ca5ebe4_0, "June");

/*
countMe#589a12e6.item#06bb0187#0 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, countMe#🏺🥒👯😃.#Counter#🕺🦑😼#0, 10)
*/
assertCall(hash_24558044.h2f333afa_0, hash_589a12e6.h06bb0187_0, 10);

/*
Counter#06bb0187<() ={}> string#builtin>{
        item#06bb0187#0: (): string#builtin ={}> "hi",
        count#06bb0187#1: 10,
    }.item#06bb0187#0() 
    ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "hi", "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "hi", "hi");

/*
countAny#457ae1ce.item#06bb0187#0<string#builtin>("String") ==#8a86d00e#2f333afa#0 "hi"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    countAny#👪🥮😤😃.#Counter#🕺🦑😼#0<string>("String"),
    "hi",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_457ae1ce.h06bb0187_0("String"), "hi");

/*
countAny#457ae1ce.item#06bb0187#0<int#builtin>(10) ==#8a86d00e#2f333afa#0 "hi"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, countAny#👪🥮😤😃.#Counter#🕺🦑😼#0<int>(10), "hi")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_457ae1ce.h06bb0187_0(10), "hi");

/*
countNamed#9c808e1e.item#06bb0187#0<Person#7286e49b>(me#3c441a16) ==#8a86d00e#2f333afa#0 "June"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    countNamed#🦇.#Counter#🕺🦑😼#0<Person#👌🤾‍♀️🚅😃>(me#🐭👩‍🏫🎎),
    "June",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_9c808e1e.h06bb0187_0(hash_3c441a16), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#24558044#2f333afa#0 5
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, gotit#⛅.#Some#0, 5)
*/
assertCall(hash_24558044.h2f333afa_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#99a85718{...aDog#409d95c4, ...aPerson#6d763106}.name#4ca5ebe4#0 
    ==#8a86d00e#2f333afa#0 "ralf"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    WereWolf#🌃{TODO SPREADs}{h0f9f18da_0: _#:0, h7286e49b_0: _#:0}.#HasName#🥊🧑‍🦯🧑😃#0,
    "ralf",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, ({ ...hash_409d95c4,
  ...hash_6d763106,
  type: "99a85718"
} as t_99a85718).h4ca5ebe4_0, "ralf");

/*
WereWolf#99a85718{...aPerson#6d763106, ...aDog#409d95c4}.name#4ca5ebe4#0 
    ==#8a86d00e#2f333afa#0 "wolrf"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    WereWolf#🌃{TODO SPREADs}{h0f9f18da_0: _#:0, h7286e49b_0: _#:0}.#HasName#🥊🧑‍🦯🧑😃#0,
    "wolrf",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, ({ ...hash_6d763106,
  ...hash_409d95c4,
  type: "99a85718"
} as t_99a85718).h4ca5ebe4_0, "wolrf");

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
One#57463bc4.name#57463bc4#0 ==#8a86d00e#2f333afa#0 "One"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "One", "One")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "One", "One");

/*
Two#b3ff688c.name#57463bc4#0 ==#8a86d00e#2f333afa#0 "Two"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Two", "Two")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Two", "Two");

/*
Two#b3ff688c.age#b3ff688c#0 ==#24558044#2f333afa#0 2
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 2, 2)
*/
assertCall(hash_24558044.h2f333afa_0, 2, 2);

/*
Two#b3ff688c.last#57463bc4#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
Three#6d2c6424.name#57463bc4#0 ==#8a86d00e#2f333afa#0 "Three"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Three", "Three")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Three", "Three");

/*
Three#6d2c6424{age#b3ff688c#0: 5}.age#b3ff688c#0 ==#24558044#2f333afa#0 5
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 5, 5)
*/
assertCall(hash_24558044.h2f333afa_0, 5, 5);

/*
Three#6d2c6424.size#6d2c6424#0 ==#24558044#2f333afa#0 3
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 3, 3)
*/
assertCall(hash_24558044.h2f333afa_0, 3, 3);

/*
Three#6d2c6424.last#57463bc4#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
Four#06321c70{color#06321c70#0: "red"}.color#06321c70#0 ==#8a86d00e#2f333afa#0 "red"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "red", "red")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "red", "red");

/*
Four#06321c70{color#06321c70#0: "red"}.last#57463bc4#1 ==#8a86d00e#2f333afa#0 "Last"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Last", "Last")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Last", "Last");

/*
SubitemWithDefaults#0d45b2e6{name#36a9774e#0: "Stephen"}.hasGlasses#36a9774e#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#0d45b2e6{name#36a9774e#0: "Stephen"}.name#36a9774e#0 
    ==#8a86d00e#2f333afa#0 "Stephen"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Stephen", "Stephen")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Stephen", "Stephen");

/*
SubitemWithDefaults#0d45b2e6.name#36a9774e#0 ==#8a86d00e#2f333afa#0 "Hello"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, "Hello", "Hello")
*/
assertCall(hash_8a86d00e.h2f333afa_0, "Hello", "Hello");

/*
SubitemWithDefaults#0d45b2e6.hasGlasses#36a9774e#2 ==#builtin false
assertEqual(false, false)
*/
assertEqual(false, false);

/*
SubitemWithDefaults#0d45b2e6.age#36a9774e#1 ==#24558044#2f333afa#0 10
assertCall(IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0, 10, 10)
*/
assertCall(hash_24558044.h2f333afa_0, 10, 10);