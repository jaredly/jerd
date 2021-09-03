import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type HasAge#a0d405a6 = {
    age: int#builtin,
}
```
*/
type t_a0d405a6 = {
  type: "a0d405a6";
  ha0d405a6_0: number;
};

/**
```
type HasName#4878c6fa = {
    name: string#builtin,
}
```
*/
type t_4878c6fa = {
  type: "4878c6fa";
  h4878c6fa_0: string;
};

/**
```
type Person#3a86a2c5 = {
    ...HasName#4878c6fa,
    ...HasAge#a0d405a6,
    what: int#builtin,
}
```
*/
type t_3a86a2c5 = {
  type: "3a86a2c5";
  h3a86a2c5_0: number;
  h4878c6fa_0: string;
  ha0d405a6_0: number;
};

/**
```
type Eq#51ea2a36<T#:0> = {
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
type Employee#3acb06b1 = {
    ...Person#3a86a2c5,
    address: string#builtin,
}
```
*/
type t_3acb06b1 = {
  type: "3acb06b1";
  h3acb06b1_0: string;
  h3a86a2c5_0: number;
  h4878c6fa_0: string;
  ha0d405a6_0: number;
};

/**
```
type House#5917dff8 = {
    occupant: Person#3a86a2c5,
}
```
*/
type t_5917dff8 = {
  type: "5917dff8";
  h5917dff8_0: t_3a86a2c5;
};

/**
```
type Counter#d5979c30<T#:0> = {
    item: T#:0,
    count: int#builtin,
}
```
*/
type t_d5979c30<T_0> = {
  type: "d5979c30";
  hd5979c30_0: T_0;
  hd5979c30_1: number;
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
type Animal#79fbcdfe = {
    ...HasName#4878c6fa,
    furColor: string#builtin,
}
```
*/
type t_79fbcdfe = {
  type: "79fbcdfe";
  h79fbcdfe_0: string;
  h4878c6fa_0: string;
};

/**
```
const me#2224fa6e = Person#3a86a2c5{
    name#4878c6fa#0: "June",
    age#a0d405a6#0: 10,
    what#3a86a2c5#0: 3,
}
```
*/
export const hash_2224fa6e: t_3a86a2c5 = ({
  type: "3a86a2c5",
  h4878c6fa_0: "June",
  ha0d405a6_0: 10,
  h3a86a2c5_0: 3
} as t_3a86a2c5);

/**
```
const aPerson#01797ad2 = Person#3a86a2c5{
    name#4878c6fa#0: "ralf",
    age#a0d405a6#0: 23,
    what#3a86a2c5#0: 2,
}
```
*/
export const hash_01797ad2: t_3a86a2c5 = ({
  type: "3a86a2c5",
  h4878c6fa_0: "ralf",
  ha0d405a6_0: 23,
  h3a86a2c5_0: 2
} as t_3a86a2c5);

/**
```
const aDog#04323944 = Animal#79fbcdfe{name#4878c6fa#0: "wolrf", furColor#79fbcdfe#0: "red"}
```
*/
export const hash_04323944: t_79fbcdfe = ({
  type: "79fbcdfe",
  h4878c6fa_0: "wolrf",
  h79fbcdfe_0: "red"
} as t_79fbcdfe);

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
const countNamed#459f59d0 = Counter#d5979c30<<T#:0: HasName#4878c6fa>(T#:0) ={}> string#builtin>{
    item#d5979c30#0: <T#:0: HasName#4878c6fa>(input#:0: T#:0): string#builtin ={}> input#:0.name#4878c6fa#0,
    count#d5979c30#1: 10,
}
```
*/
export const hash_459f59d0: t_d5979c30<<T_0 extends {
  h4878c6fa_0: string;
}>(arg_0: T_0) => string> = ({
  type: "d5979c30",
  hd5979c30_0: <T_0 extends {
    h4878c6fa_0: string;
  }>(input: T_0) => input.h4878c6fa_0,
  hd5979c30_1: 10
} as t_d5979c30<<T_0 extends {
  h4878c6fa_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#c50a3a34 = Counter#d5979c30<<T#:0>(T#:0) ={}> string#builtin>{
    item#d5979c30#0: <T#:0>(input#:0: T#:0): string#builtin ={}> "hi",
    count#d5979c30#1: 10,
}
```
*/
export const hash_c50a3a34: t_d5979c30<<T_0>(arg_0: T_0) => string> = ({
  type: "d5979c30",
  hd5979c30_0: <T_0>(input: T_0) => "hi",
  hd5979c30_1: 10
} as t_d5979c30<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#7aa85621 = Counter#d5979c30<int#builtin>{
    item#d5979c30#0: 10,
    count#d5979c30#1: 4000,
}
```
*/
export const hash_7aa85621: t_d5979c30<number> = ({
  type: "d5979c30",
  hd5979c30_0: 10,
  hd5979c30_1: 4000
} as t_d5979c30<number>);

/**
```
const here#3f7695a4 = House#5917dff8{occupant#5917dff8#0: me#2224fa6e}
```
*/
export const hash_3f7695a4: t_5917dff8 = ({
  type: "5917dff8",
  h5917dff8_0: hash_2224fa6e
} as t_5917dff8);

/**
```
const getName#c389f018 = <T#:0: Person#3a86a2c5>(m#:0: T#:0): string#builtin ={}> m#:0.name#4878c6fa#0
```
*/
export const hash_c389f018: <T_0 extends {
  h3a86a2c5_0: number;
  h4878c6fa_0: string;
  ha0d405a6_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h3a86a2c5_0: number;
  h4878c6fa_0: string;
  ha0d405a6_0: number;
}>(m: T_0) => m.h4878c6fa_0;

/**
```
const them#7b60b106 = Employee#3acb06b1{
    what#3a86a2c5#0: 3,
    name#4878c6fa#0: "You",
    age#a0d405a6#0: 100,
    address#3acb06b1#0: "No",
}
```
*/
export const hash_7b60b106: t_3acb06b1 = ({
  type: "3acb06b1",
  h3a86a2c5_0: 3,
  h4878c6fa_0: "You",
  ha0d405a6_0: 100,
  h3acb06b1_0: "No"
} as t_3acb06b1);

/**
```
const you#4a74e12c = Employee#3acb06b1{...me#2224fa6e, address#3acb06b1#0: "Yes"}
```
*/
export const hash_4a74e12c: t_3acb06b1 = ({ ...hash_2224fa6e,
  type: "3acb06b1",
  h3acb06b1_0: "Yes"
} as t_3acb06b1);

/**
```
const alsoMe#2c44fe3e = Person#3a86a2c5{...me#2224fa6e, what#3a86a2c5#0: 11}
```
*/
export const hash_2c44fe3e: t_3a86a2c5 = ({ ...hash_2224fa6e,
  type: "3a86a2c5",
  h3a86a2c5_0: 11
} as t_3a86a2c5);

/**
```
const IntEq#ec95f154 = Eq#51ea2a36<int#builtin>{"=="#51ea2a36#0: intEq#builtin}
```
*/
export const hash_ec95f154: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: intEq
} as t_51ea2a36<number>);

/**
```
const StringEq#da00b310 = Eq#51ea2a36<string#builtin>{"=="#51ea2a36#0: stringEq#builtin}
```
*/
export const hash_da00b310: t_51ea2a36<string> = ({
  type: "51ea2a36",
  h51ea2a36_0: stringEq
} as t_51ea2a36<string>);

/*
me#2224fa6e.name#4878c6fa#0 ==#da00b310#51ea2a36#0 "June"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_2224fa6e.h4878c6fa_0, "June");

/*
me#2224fa6e.age#a0d405a6#0 ==#ec95f154#51ea2a36#0 10
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_2224fa6e.ha0d405a6_0, 10);

/*
alsoMe#2c44fe3e.name#4878c6fa#0 ==#da00b310#51ea2a36#0 "June"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_2c44fe3e.h4878c6fa_0, "June");

/*
alsoMe#2c44fe3e.what#3a86a2c5#0 ==#ec95f154#51ea2a36#0 11
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_2c44fe3e.h3a86a2c5_0, 11);

/*
you#4a74e12c.name#4878c6fa#0 ==#da00b310#51ea2a36#0 "June"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_4a74e12c.h4878c6fa_0, "June");

/*
them#7b60b106.name#4878c6fa#0 ==#da00b310#51ea2a36#0 "You"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_7b60b106.h4878c6fa_0, "You");

/*
them#7b60b106.address#3acb06b1#0 ==#da00b310#51ea2a36#0 "No"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_7b60b106.h3acb06b1_0, "No");

/*
getName#c389f018<Person#3a86a2c5>(m: me#2224fa6e) ==#da00b310#51ea2a36#0 "June"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_c389f018(hash_2224fa6e), "June");

/*
getName#c389f018<Employee#3acb06b1>(m: them#7b60b106) ==#da00b310#51ea2a36#0 "You"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_c389f018(hash_7b60b106), "You");

/*
here#3f7695a4.occupant#5917dff8#0.name#4878c6fa#0 ==#da00b310#51ea2a36#0 "June"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_3f7695a4.h5917dff8_0.h4878c6fa_0, "June");

/*
countMe#7aa85621.item#d5979c30#0 ==#ec95f154#51ea2a36#0 10
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_7aa85621.hd5979c30_0, 10);

/*
Counter#d5979c30<() ={}> string#builtin>{
        item#d5979c30#0: (): string#builtin ={}> "hi",
        count#d5979c30#1: 10,
    }.item#d5979c30#0() 
    ==#da00b310#51ea2a36#0 "hi"
*/
assertCall(hash_da00b310.h51ea2a36_0, ({
  type: "d5979c30",
  hd5979c30_0: () => "hi",
  hd5979c30_1: 10
} as t_d5979c30<() => string>).hd5979c30_0(), "hi");

/*
countAny#c50a3a34.item#d5979c30#0<string#builtin>("String") ==#da00b310#51ea2a36#0 "hi"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_c50a3a34.hd5979c30_0("String"), "hi");

/*
countAny#c50a3a34.item#d5979c30#0<int#builtin>(10) ==#da00b310#51ea2a36#0 "hi"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_c50a3a34.hd5979c30_0(10), "hi");

/*
countNamed#459f59d0.item#d5979c30#0<Person#3a86a2c5>(me#2224fa6e) ==#da00b310#51ea2a36#0 "June"
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_459f59d0.hd5979c30_0(hash_2224fa6e), "June");

/*
gotit#9781cfa0.contents#Some#0 ==#ec95f154#51ea2a36#0 5
*/
assertCall(hash_ec95f154.h51ea2a36_0, hash_9781cfa0.hSome_0, 5);

/*
WereWolf#23c23c80{...aDog#04323944, ...aPerson#01797ad2}.name#4878c6fa#0 
    ==#da00b310#51ea2a36#0 "ralf"
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_04323944,
  ...hash_01797ad2,
  type: "23c23c80"
} as t_23c23c80).h4878c6fa_0, "ralf");

/*
WereWolf#23c23c80{...aPerson#01797ad2, ...aDog#04323944}.name#4878c6fa#0 
    ==#da00b310#51ea2a36#0 "wolrf"
*/
assertCall(hash_da00b310.h51ea2a36_0, ({ ...hash_01797ad2,
  ...hash_04323944,
  type: "23c23c80"
} as t_23c23c80).h4878c6fa_0, "wolrf");

/*
SomethingWithDefaults#039f0aae{name#039f0aae#0: "Me", age#039f0aae#1: 4}.hasGlasses#039f0aae#2 
    ==#builtin false
*/
assertEqual(({
  type: "039f0aae",
  h039f0aae_0: "Me",
  h039f0aae_1: 4,
  h039f0aae_2: false
} as t_039f0aae).h039f0aae_2, false);

/*
SomethingWithDefaults#039f0aae{
        name#039f0aae#0: "Me",
        age#039f0aae#1: 4,
        hasGlasses#039f0aae#2: true,
    }.hasGlasses#039f0aae#2 
    ==#builtin true
*/
assertEqual(({
  type: "039f0aae",
  h039f0aae_0: "Me",
  h039f0aae_1: 4,
  h039f0aae_2: true
} as t_039f0aae).h039f0aae_2, true);