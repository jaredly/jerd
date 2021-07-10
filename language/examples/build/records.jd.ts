import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#6f94e290 = {
    age: int#builtin,
}
```
*/
type t_6f94e290 = {
  type: "6f94e290";
  h6f94e290_0: number;
};

/**
```
type HasName#72629e32 = {
    name: string#builtin,
}
```
*/
type t_72629e32 = {
  type: "72629e32";
  h72629e32_0: string;
};

/**
```
type Person#251afc1a = {
    ...HasName#72629e32,
    ...HasAge#6f94e290,
    what: int#builtin,
}
```
*/
type t_251afc1a = {
  type: "251afc1a";
  h251afc1a_0: number;
  h72629e32_0: string;
  h6f94e290_0: number;
};

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
type Employee#9f76c608 = {
    ...Person#251afc1a,
    address: string#builtin,
}
```
*/
type t_9f76c608 = {
  type: "9f76c608";
  h9f76c608_0: string;
  h251afc1a_0: number;
  h72629e32_0: string;
  h6f94e290_0: number;
};

/**
```
type House#75ff6d9a = {
    occupant: Person#251afc1a,
}
```
*/
type t_75ff6d9a = {
  type: "75ff6d9a";
  h75ff6d9a_0: t_251afc1a;
};

/**
```
type Counter#43dee7da<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_43dee7da<T_0> = {
  type: "43dee7da";
  h43dee7da_0: T_0;
  h43dee7da_1: number;
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
type Animal#fd0924c4 = {
    ...HasName#72629e32,
    furColor: string#builtin,
}
```
*/
type t_fd0924c4 = {
  type: "fd0924c4";
  hfd0924c4_0: string;
  h72629e32_0: string;
};

/**
```
const me#f1927f86 = Person#251afc1a{
    name#72629e32#0: "June",
    age#6f94e290#0: 10,
    what#251afc1a#0: 3,
}
```
*/
export const hash_f1927f86: t_251afc1a = ({
  type: "251afc1a",
  h72629e32_0: "June",
  h6f94e290_0: 10,
  h251afc1a_0: 3
} as t_251afc1a);

/**
```
const aPerson#26d2e2d4 = Person#251afc1a{
    name#72629e32#0: "ralf",
    age#6f94e290#0: 23,
    what#251afc1a#0: 2,
}
```
*/
export const hash_26d2e2d4: t_251afc1a = ({
  type: "251afc1a",
  h72629e32_0: "ralf",
  h6f94e290_0: 23,
  h251afc1a_0: 2
} as t_251afc1a);

/**
```
const aDog#4f2b700e = Animal#fd0924c4{name#72629e32#0: "wolrf", furColor#fd0924c4#0: "red"}
```
*/
export const hash_4f2b700e: t_fd0924c4 = ({
  type: "fd0924c4",
  h72629e32_0: "wolrf",
  hfd0924c4_0: "red"
} as t_fd0924c4);

/**
```
const gotit#9781cfa0 = Some#Some<int#builtin>{contents#Some#0: 5}
```
*/
export const hash_9781cfa0: t_Some<number> = ({
  type: "Some",
  hSome_0: 5
} as t_Some<number>);

/**
```
const countNamed#57d6650e = Counter#43dee7da<<T#:0: HasName#72629e32>(T#:0) ={}> string#builtin>{
    item#43dee7da#0: <T#:0: HasName#72629e32>(input#:0: T#:0): string#builtin ={}> input#:0.name#72629e32#0,
    count#43dee7da#1: 10,
}
```
*/
export const hash_57d6650e: t_43dee7da<<T_0 extends {
  h72629e32_0: string;
}>(arg_0: T_0) => string> = ({
  type: "43dee7da",
  h43dee7da_0: <T_0 extends {
    h72629e32_0: string;
  }>(input: T_0) => input.h72629e32_0,
  h43dee7da_1: 10
} as t_43dee7da<<T_0 extends {
  h72629e32_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#368ae45c = Counter#43dee7da<<T#:0>(T#:0) ={}> string#builtin>{
    item#43dee7da#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#43dee7da#1: 10,
}
```
*/
export const hash_368ae45c: t_43dee7da<<T_0>(arg_0: T_0) => string> = ({
  type: "43dee7da",
  h43dee7da_0: <T_0>(input: T_0) => "hi",
  h43dee7da_1: 10
} as t_43dee7da<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#39011d90 = Counter#43dee7da<int#builtin>{
    item#43dee7da#0: 10,
    count#43dee7da#1: 4000,
}
```
*/
export const hash_39011d90: t_43dee7da<number> = ({
  type: "43dee7da",
  h43dee7da_0: 10,
  h43dee7da_1: 4000
} as t_43dee7da<number>);

/**
```
const here#5d061954 = House#75ff6d9a{occupant#75ff6d9a#0: me#f1927f86}
```
*/
export const hash_5d061954: t_75ff6d9a = ({
  type: "75ff6d9a",
  h75ff6d9a_0: hash_f1927f86
} as t_75ff6d9a);

/**
```
const getName#73a4b778 = <T#:0: Person#251afc1a>(m#:0: T#:0): string#builtin ={}> m#:0.name#72629e32#0
```
*/
export const hash_73a4b778: <T_0 extends {
  h251afc1a_0: number;
  h72629e32_0: string;
  h6f94e290_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h251afc1a_0: number;
  h72629e32_0: string;
  h6f94e290_0: number;
}>(m: T_0) => m.h72629e32_0;

/**
```
const them#364ee0bc = Employee#9f76c608{
    what#251afc1a#0: 3,
    name#72629e32#0: "You",
    age#6f94e290#0: 100,
    address#9f76c608#0: "No",
}
```
*/
export const hash_364ee0bc: t_9f76c608 = ({
  type: "9f76c608",
  h251afc1a_0: 3,
  h72629e32_0: "You",
  h6f94e290_0: 100,
  h9f76c608_0: "No"
} as t_9f76c608);

/**
```
const you#0ba6c656 = Employee#9f76c608{...me#f1927f86, address#9f76c608#0: "Yes"}
```
*/
export const hash_0ba6c656: t_9f76c608 = ({ ...hash_f1927f86,
  type: "9f76c608",
  h9f76c608_0: "Yes"
} as t_9f76c608);

/**
```
const alsoMe#0c457bae = Person#251afc1a{...me#f1927f86, what#251afc1a#0: 11}
```
*/
export const hash_0c457bae: t_251afc1a = ({ ...hash_f1927f86,
  type: "251afc1a",
  h251afc1a_0: 11
} as t_251afc1a);

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const StringEq#606c7034 = Eq#553b4b8e<string#builtin>{"=="#553b4b8e#0: stringEq#builtin}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
me#f1927f86.name#72629e32#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_f1927f86.h72629e32_0, "June");

/*
me#f1927f86.age#6f94e290#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_f1927f86.h6f94e290_0, 10);

/*
alsoMe#0c457bae.name#72629e32#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0c457bae.h72629e32_0, "June");

/*
alsoMe#0c457bae.what#251afc1a#0 ==#9275f914#553b4b8e#0 11
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_0c457bae.h251afc1a_0, 11);

/*
you#0ba6c656.name#72629e32#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0ba6c656.h72629e32_0, "June");

/*
them#364ee0bc.name#72629e32#0 ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_364ee0bc.h72629e32_0, "You");

/*
them#364ee0bc.address#9f76c608#0 ==#606c7034#553b4b8e#0 "No"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_364ee0bc.h9f76c608_0, "No");

/*
getName#73a4b778<Person#251afc1a>(m: me#f1927f86) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_73a4b778(hash_f1927f86), "June");

/*
getName#73a4b778<Employee#9f76c608>(m: them#364ee0bc) ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_73a4b778(hash_364ee0bc), "You");

/*
here#5d061954.occupant#75ff6d9a#0.name#72629e32#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5d061954.h75ff6d9a_0.h72629e32_0, "June");

/*
countMe#39011d90.item#43dee7da#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_39011d90.h43dee7da_0, 10);

/*
Counter#43dee7da<() ={}> string#builtin>{
        item#43dee7da#0: (): string#builtin ={}> "hi",
        count#43dee7da#1: 10,
    }.item#43dee7da#0() 
    ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "43dee7da",
  h43dee7da_0: () => "hi",
  h43dee7da_1: 10
} as t_43dee7da<() => string>).h43dee7da_0(), "hi");

/*
countAny#368ae45c.item#43dee7da#0<string#builtin>("String") ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_368ae45c.h43dee7da_0("String"), "hi");

/*
countAny#368ae45c.item#43dee7da#0<int#builtin>(10) ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_368ae45c.h43dee7da_0(10), "hi");

/*
countNamed#57d6650e.item#43dee7da#0<Person#251afc1a>(me#f1927f86) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_57d6650e.h43dee7da_0(hash_f1927f86), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#9275f914#553b4b8e#0 5
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#17fd7853{...aDog#4f2b700e, ...aPerson#26d2e2d4}.name#72629e32#0 
    ==#606c7034#553b4b8e#0 "ralf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_4f2b700e,
  ...hash_26d2e2d4,
  type: "17fd7853"
} as t_17fd7853).h72629e32_0, "ralf");

/*
WereWolf#17fd7853{...aPerson#26d2e2d4, ...aDog#4f2b700e}.name#72629e32#0 
    ==#606c7034#553b4b8e#0 "wolrf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_26d2e2d4,
  ...hash_4f2b700e,
  type: "17fd7853"
} as t_17fd7853).h72629e32_0, "wolrf");