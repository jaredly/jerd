import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#0b7d29dc = {
    age: int#builtin,
}
```
*/
type t_0b7d29dc = {
  type: "0b7d29dc";
  h0b7d29dc_0: number;
};

/**
```
type HasName#eb3cecdc = {
    name: string#builtin,
}
```
*/
type t_eb3cecdc = {
  type: "eb3cecdc";
  heb3cecdc_0: string;
};

/**
```
type Person#4eecb3b0 = {
    ...HasName#eb3cecdc,
    ...HasAge#0b7d29dc,
    what: int#builtin,
}
```
*/
type t_4eecb3b0 = {
  type: "4eecb3b0";
  h4eecb3b0_0: number;
  heb3cecdc_0: string;
  h0b7d29dc_0: number;
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
type Employee#2ef0e962 = {
    ...Person#4eecb3b0,
    address: string#builtin,
}
```
*/
type t_2ef0e962 = {
  type: "2ef0e962";
  h2ef0e962_0: string;
  h4eecb3b0_0: number;
  heb3cecdc_0: string;
  h0b7d29dc_0: number;
};

/**
```
type House#2b08e432 = {
    occupant: Person#4eecb3b0,
}
```
*/
type t_2b08e432 = {
  type: "2b08e432";
  h2b08e432_0: t_4eecb3b0;
};

/**
```
type Counter#712ce3f2<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_712ce3f2<T_0> = {
  type: "712ce3f2";
  h712ce3f2_0: T_0;
  h712ce3f2_1: number;
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
type Animal#51baa10e = {
    ...HasName#eb3cecdc,
    furColor: string#builtin,
}
```
*/
type t_51baa10e = {
  type: "51baa10e";
  h51baa10e_0: string;
  heb3cecdc_0: string;
};

/**
```
const me#34cf55aa = Person#4eecb3b0{
    name#eb3cecdc#0: "June",
    age#0b7d29dc#0: 10,
    what#4eecb3b0#0: 3,
}
```
*/
export const hash_34cf55aa: t_4eecb3b0 = ({
  type: "4eecb3b0",
  heb3cecdc_0: "June",
  h0b7d29dc_0: 10,
  h4eecb3b0_0: 3
} as t_4eecb3b0);

/**
```
const aPerson#c5746a56 = Person#4eecb3b0{
    name#eb3cecdc#0: "ralf",
    age#0b7d29dc#0: 23,
    what#4eecb3b0#0: 2,
}
```
*/
export const hash_c5746a56: t_4eecb3b0 = ({
  type: "4eecb3b0",
  heb3cecdc_0: "ralf",
  h0b7d29dc_0: 23,
  h4eecb3b0_0: 2
} as t_4eecb3b0);

/**
```
const aDog#f8049898 = Animal#51baa10e{name#eb3cecdc#0: "wolrf", furColor#51baa10e#0: "red"}
```
*/
export const hash_f8049898: t_51baa10e = ({
  type: "51baa10e",
  heb3cecdc_0: "wolrf",
  h51baa10e_0: "red"
} as t_51baa10e);

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
const countNamed#0b86407c = Counter#712ce3f2<<T#:0: HasName#eb3cecdc>(T#:0) ={}> string#builtin>{
    item#712ce3f2#0: <T#:0: HasName#eb3cecdc>(input#:0: T#:0): string#builtin ={}> input#:0.name#eb3cecdc#0,
    count#712ce3f2#1: 10,
}
```
*/
export const hash_0b86407c: t_712ce3f2<<T_0 extends {
  heb3cecdc_0: string;
}>(arg_0: T_0) => string> = ({
  type: "712ce3f2",
  h712ce3f2_0: <T_0 extends {
    heb3cecdc_0: string;
  }>(input: T_0) => input.heb3cecdc_0,
  h712ce3f2_1: 10
} as t_712ce3f2<<T_0 extends {
  heb3cecdc_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#bcada9fe = Counter#712ce3f2<<T#:0>(T#:0) ={}> string#builtin>{
    item#712ce3f2#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#712ce3f2#1: 10,
}
```
*/
export const hash_bcada9fe: t_712ce3f2<<T_0>(arg_0: T_0) => string> = ({
  type: "712ce3f2",
  h712ce3f2_0: <T_0>(input: T_0) => "hi",
  h712ce3f2_1: 10
} as t_712ce3f2<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#2c7cd4e4 = Counter#712ce3f2<int#builtin>{
    item#712ce3f2#0: 10,
    count#712ce3f2#1: 4000,
}
```
*/
export const hash_2c7cd4e4: t_712ce3f2<number> = ({
  type: "712ce3f2",
  h712ce3f2_0: 10,
  h712ce3f2_1: 4000
} as t_712ce3f2<number>);

/**
```
const here#4e90f19e = House#2b08e432{occupant#2b08e432#0: me#34cf55aa}
```
*/
export const hash_4e90f19e: t_2b08e432 = ({
  type: "2b08e432",
  h2b08e432_0: hash_34cf55aa
} as t_2b08e432);

/**
```
const getName#45f8ce34 = <T#:0: Person#4eecb3b0>(m#:0: T#:0): string#builtin ={}> m#:0.name#eb3cecdc#0
```
*/
export const hash_45f8ce34: <T_0 extends {
  h4eecb3b0_0: number;
  heb3cecdc_0: string;
  h0b7d29dc_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h4eecb3b0_0: number;
  heb3cecdc_0: string;
  h0b7d29dc_0: number;
}>(m: T_0) => m.heb3cecdc_0;

/**
```
const them#02e36504 = Employee#2ef0e962{
    what#4eecb3b0#0: 3,
    name#eb3cecdc#0: "You",
    age#0b7d29dc#0: 100,
    address#2ef0e962#0: "No",
}
```
*/
export const hash_02e36504: t_2ef0e962 = ({
  type: "2ef0e962",
  h4eecb3b0_0: 3,
  heb3cecdc_0: "You",
  h0b7d29dc_0: 100,
  h2ef0e962_0: "No"
} as t_2ef0e962);

/**
```
const you#71cecfd8 = Employee#2ef0e962{...me#34cf55aa, address#2ef0e962#0: "Yes"}
```
*/
export const hash_71cecfd8: t_2ef0e962 = ({ ...hash_34cf55aa,
  type: "2ef0e962",
  h2ef0e962_0: "Yes"
} as t_2ef0e962);

/**
```
const alsoMe#5a041840 = Person#4eecb3b0{...me#34cf55aa, what#4eecb3b0#0: 11}
```
*/
export const hash_5a041840: t_4eecb3b0 = ({ ...hash_34cf55aa,
  type: "4eecb3b0",
  h4eecb3b0_0: 11
} as t_4eecb3b0);

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
me#34cf55aa.name#eb3cecdc#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_34cf55aa.heb3cecdc_0, "June");

/*
me#34cf55aa.age#0b7d29dc#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_34cf55aa.h0b7d29dc_0, 10);

/*
alsoMe#5a041840.name#eb3cecdc#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5a041840.heb3cecdc_0, "June");

/*
alsoMe#5a041840.what#4eecb3b0#0 ==#9275f914#553b4b8e#0 11
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5a041840.h4eecb3b0_0, 11);

/*
you#71cecfd8.name#eb3cecdc#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_71cecfd8.heb3cecdc_0, "June");

/*
them#02e36504.name#eb3cecdc#0 ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_02e36504.heb3cecdc_0, "You");

/*
them#02e36504.address#2ef0e962#0 ==#606c7034#553b4b8e#0 "No"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_02e36504.h2ef0e962_0, "No");

/*
getName#45f8ce34<Person#4eecb3b0>(m: me#34cf55aa) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_45f8ce34(hash_34cf55aa), "June");

/*
getName#45f8ce34<Employee#2ef0e962>(m: them#02e36504) ==#606c7034#553b4b8e#0 "You"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_45f8ce34(hash_02e36504), "You");

/*
here#4e90f19e.occupant#2b08e432#0.name#eb3cecdc#0 ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_4e90f19e.h2b08e432_0.heb3cecdc_0, "June");

/*
countMe#2c7cd4e4.item#712ce3f2#0 ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_2c7cd4e4.h712ce3f2_0, 10);

/*
Counter#712ce3f2<() ={}> string#builtin>{
        item#712ce3f2#0: (): string#builtin ={}> "hi",
        count#712ce3f2#1: 10,
    }.item#712ce3f2#0() 
    ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "712ce3f2",
  h712ce3f2_0: () => "hi",
  h712ce3f2_1: 10
} as t_712ce3f2<() => string>).h712ce3f2_0(), "hi");

/*
countAny#bcada9fe.item#712ce3f2#0<string#builtin>("String") ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_bcada9fe.h712ce3f2_0("String"), "hi");

/*
countAny#bcada9fe.item#712ce3f2#0<int#builtin>(10) ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_bcada9fe.h712ce3f2_0(10), "hi");

/*
countNamed#0b86407c.item#712ce3f2#0<Person#4eecb3b0>(me#34cf55aa) ==#606c7034#553b4b8e#0 "June"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0b86407c.h712ce3f2_0(hash_34cf55aa), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#9275f914#553b4b8e#0 5
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#46264b1c{...aDog#f8049898, ...aPerson#c5746a56}.name#eb3cecdc#0 
    ==#606c7034#553b4b8e#0 "ralf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_f8049898,
  ...hash_c5746a56,
  type: "46264b1c"
} as t_46264b1c).heb3cecdc_0, "ralf");

/*
WereWolf#46264b1c{...aPerson#c5746a56, ...aDog#f8049898}.name#eb3cecdc#0 
    ==#606c7034#553b4b8e#0 "wolrf"
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_c5746a56,
  ...hash_f8049898,
  type: "46264b1c"
} as t_46264b1c).heb3cecdc_0, "wolrf");