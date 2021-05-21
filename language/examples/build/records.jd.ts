import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#2125e824 = {
    age: int,
}
```
*/
type t_2125e824 = {
  type: "2125e824";
  h2125e824_0: number;
};

/**
```
type HasName#074ab22d = {
    name: string,
}
```
*/
type t_074ab22d = {
  type: "074ab22d";
  h074ab22d_0: string;
};

/**
```
type Person#d03a204e = {
    ...HasName#074ab22d,
    ...HasAge#2125e824,
    what: int,
}
```
*/
type t_d03a204e = {
  type: "d03a204e";
  hd03a204e_0: number;
  h074ab22d_0: string;
  h2125e824_0: number;
};

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
type Employee#4b4e7edc = {
    ...Person#d03a204e,
    address: string,
}
```
*/
type t_4b4e7edc = {
  type: "4b4e7edc";
  h4b4e7edc_0: string;
  hd03a204e_0: number;
  h074ab22d_0: string;
  h2125e824_0: number;
};

/**
```
type House#6fd21cc4 = {
    occupant: Person#d03a204e,
}
```
*/
type t_6fd21cc4 = {
  type: "6fd21cc4";
  h6fd21cc4_0: t_d03a204e;
};

/**
```
type Counter#1eb32f70<T#:0> = {
    item: T#:0,
    count: int,
}
```
*/
type t_1eb32f70<T_0> = {
  type: "1eb32f70";
  h1eb32f70_0: T_0;
  h1eb32f70_1: number;
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
type Animal#2e088eea = {
    ...HasName#074ab22d,
    furColor: string,
}
```
*/
type t_2e088eea = {
  type: "2e088eea";
  h2e088eea_0: string;
  h074ab22d_0: string;
};

/**
```
const me#6c2be494: Person#d03a204e = Person#d03a204e{
    name#074ab22d#0: "June",
    age#2125e824#0: 10,
    what#d03a204e#0: 3,
}
```
*/
export const hash_6c2be494: t_d03a204e = ({
  type: "d03a204e",
  h074ab22d_0: "June",
  h2125e824_0: 10,
  hd03a204e_0: 3
} as t_d03a204e);

/**
```
const aPerson#c681be40: Person#d03a204e = Person#d03a204e{
    name#074ab22d#0: "ralf",
    age#2125e824#0: 23,
    what#d03a204e#0: 2,
}
```
*/
export const hash_c681be40: t_d03a204e = ({
  type: "d03a204e",
  h074ab22d_0: "ralf",
  h2125e824_0: 23,
  hd03a204e_0: 2
} as t_d03a204e);

/**
```
const aDog#0ee8a2a0: Animal#2e088eea = Animal#2e088eea{
    name#074ab22d#0: "wolrf",
    furColor#2e088eea#0: "red",
}
```
*/
export const hash_0ee8a2a0: t_2e088eea = ({
  type: "2e088eea",
  h074ab22d_0: "wolrf",
  h2e088eea_0: "red"
} as t_2e088eea);

/**
```
const gotit#9781cfa0: Some#Some<int> = Some#Some<int>{contents#Some#0: 5}
```
*/
export const hash_9781cfa0: t_Some<number> = ({
  type: "Some",
  hSome_0: 5
} as t_Some<number>);

/**
```
const countNamed#c9d3a414: Counter#1eb32f70<<T#:0: HasName#074ab22d>(T#:0) ={}> string> = Counter#1eb32f70<
    <T#:0: HasName#074ab22d>(T#:0) ={}> string,
>{
    item#1eb32f70#0: <T#:0: HasName#074ab22d>(input#:0: T#:0) ={}> input#:0.name#074ab22d#0,
    count#1eb32f70#1: 10,
}
```
*/
export const hash_c9d3a414: t_1eb32f70<<T_0 extends {
  h074ab22d_0: string;
}>(arg_0: T_0) => string> = ({
  type: "1eb32f70",
  h1eb32f70_0: <T_0 extends {
    h074ab22d_0: string;
  }>(input: T_0) => input.h074ab22d_0,
  h1eb32f70_1: 10
} as t_1eb32f70<<T_0 extends {
  h074ab22d_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#be30270c: Counter#1eb32f70<<T#:0>(T#:0) ={}> string> = Counter#1eb32f70<
    <T#:0>(T#:0) ={}> string,
>{item#1eb32f70#0: <T#:0>(input#:0: T#:0) ={}> "hi", count#1eb32f70#1: 10}
```
*/
export const hash_be30270c: t_1eb32f70<<T_0>(arg_0: T_0) => string> = ({
  type: "1eb32f70",
  h1eb32f70_0: <T_0>(input: T_0) => "hi",
  h1eb32f70_1: 10
} as t_1eb32f70<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#2ba0dd9e: Counter#1eb32f70<int> = Counter#1eb32f70<int>{
    item#1eb32f70#0: 10,
    count#1eb32f70#1: 4000,
}
```
*/
export const hash_2ba0dd9e: t_1eb32f70<number> = ({
  type: "1eb32f70",
  h1eb32f70_0: 10,
  h1eb32f70_1: 4000
} as t_1eb32f70<number>);

/**
```
const here#51cc04c4: House#6fd21cc4 = House#6fd21cc4{occupant#6fd21cc4#0: me#6c2be494}
```
*/
export const hash_51cc04c4: t_6fd21cc4 = ({
  type: "6fd21cc4",
  h6fd21cc4_0: hash_6c2be494
} as t_6fd21cc4);

/**
```
const getName#fc0cef1c: <T#:0: Person#d03a204e>(T#:0) ={}> string = <T#:0: Person#d03a204e>(
    m#:0: T#:0,
) ={}> m#:0.name#074ab22d#0
```
*/
export const hash_fc0cef1c: <T_0 extends {
  hd03a204e_0: number;
  h074ab22d_0: string;
  h2125e824_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  hd03a204e_0: number;
  h074ab22d_0: string;
  h2125e824_0: number;
}>(m: T_0) => m.h074ab22d_0;

/**
```
const them#e497f81e: Employee#4b4e7edc = Employee#4b4e7edc{
    what#d03a204e#0: 3,
    name#074ab22d#0: "You",
    age#2125e824#0: 100,
    address#4b4e7edc#0: "No",
}
```
*/
export const hash_e497f81e: t_4b4e7edc = ({
  type: "4b4e7edc",
  hd03a204e_0: 3,
  h074ab22d_0: "You",
  h2125e824_0: 100,
  h4b4e7edc_0: "No"
} as t_4b4e7edc);

/**
```
const you#9c4b0594: Employee#4b4e7edc = Employee#4b4e7edc{...me#6c2be494, address#4b4e7edc#0: "Yes"}
```
*/
export const hash_9c4b0594: t_4b4e7edc = ({ ...hash_6c2be494,
  type: "4b4e7edc",
  h4b4e7edc_0: "Yes"
} as t_4b4e7edc);

/**
```
const alsoMe#686d8d88: Person#d03a204e = Person#d03a204e{...me#6c2be494, what#d03a204e#0: 11}
```
*/
export const hash_686d8d88: t_d03a204e = ({ ...hash_6c2be494,
  type: "d03a204e",
  hd03a204e_0: 11
} as t_d03a204e);

/**
```
const IntEq#9275f914: Eq#553b4b8e<int> = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const StringEq#606c7034: Eq#553b4b8e<string> = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
StringEq#606c7034."=="#553b4b8e#0(me#6c2be494.name#074ab22d#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_6c2be494.h074ab22d_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(me#6c2be494.age#2125e824#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_6c2be494.h2125e824_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(alsoMe#686d8d88.name#074ab22d#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_686d8d88.h074ab22d_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(alsoMe#686d8d88.what#d03a204e#0, 11)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_686d8d88.hd03a204e_0, 11);

/*
StringEq#606c7034."=="#553b4b8e#0(you#9c4b0594.name#074ab22d#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_9c4b0594.h074ab22d_0, "June");

/*
StringEq#606c7034."=="#553b4b8e#0(them#e497f81e.name#074ab22d#0, "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_e497f81e.h074ab22d_0, "You");

/*
StringEq#606c7034."=="#553b4b8e#0(them#e497f81e.address#4b4e7edc#0, "No")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_e497f81e.h4b4e7edc_0, "No");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#fc0cef1c<Person#d03a204e>(me#6c2be494), "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_fc0cef1c(hash_6c2be494), "June");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#fc0cef1c<Employee#4b4e7edc>(them#e497f81e), "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_fc0cef1c(hash_e497f81e), "You");

/*
StringEq#606c7034."=="#553b4b8e#0(here#51cc04c4.occupant#6fd21cc4#0.name#074ab22d#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_51cc04c4.h6fd21cc4_0.h074ab22d_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(countMe#2ba0dd9e.item#1eb32f70#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_2ba0dd9e.h1eb32f70_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(
    Counter#1eb32f70<() ={}> string>{item#1eb32f70#0: () ={}> "hi", count#1eb32f70#1: 10}.item#1eb32f70#0(),
    "hi",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "1eb32f70",
  h1eb32f70_0: () => "hi",
  h1eb32f70_1: 10
} as t_1eb32f70<() => string>).h1eb32f70_0(), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#be30270c.item#1eb32f70#0<string>("String"), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_be30270c.h1eb32f70_0("String"), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#be30270c.item#1eb32f70#0<int>(10), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_be30270c.h1eb32f70_0(10), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(
    countNamed#c9d3a414.item#1eb32f70#0<Person#d03a204e>(me#6c2be494),
    "June",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_c9d3a414.h1eb32f70_0(hash_6c2be494), "June");

/*
IntEq#9275f914."=="#553b4b8e#0(gotit#9781cfa0.contents#Some#0, 5)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#c124ab08{...aDog#0ee8a2a0, ...aPerson#c681be40}.name#074ab22d#0,
    "ralf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_0ee8a2a0,
  ...hash_c681be40,
  type: "c124ab08"
} as t_c124ab08).h074ab22d_0, "ralf");

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#c124ab08{...aPerson#c681be40, ...aDog#0ee8a2a0}.name#074ab22d#0,
    "wolrf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_c681be40,
  ...hash_0ee8a2a0,
  type: "c124ab08"
} as t_c124ab08).h074ab22d_0, "wolrf");