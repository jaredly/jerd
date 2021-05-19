import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type As#As<T#:10000, T#:10001> = {
    as: (T#:10000) ={}> Y#:10001,
}
```
*/
type t_As<T_10000, T_10001> = {
  type: "As";
  hAs_0: (arg_0: T_10000) => T_10001;
};

/**
```
type None#None = {}
```
*/
type t_None = {
  type: "None";
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
type ToStr#b416ead2<T#:0> = {
    str: (T#:0) ={}> string,
}
```
*/
type t_b416ead2<T_0> = {
  type: "b416ead2";
  hb416ead2_0: (arg_0: T_0) => string;
};

/**
```
type ToFloat#c13d2c8a<T#:0> = {
    float: (T#:0) ={}> float,
}
```
*/
type t_c13d2c8a<T_0> = {
  type: "c13d2c8a";
  hc13d2c8a_0: (arg_0: T_0) => number;
};

/**
```
type ToInt#c5d60378<T#:0> = {
    int: (T#:0) ={}> int,
}
```
*/
type t_c5d60378<T_0> = {
  type: "c5d60378";
  hc5d60378_0: (arg_0: T_0) => number;
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
@ffi type Vec2#43802a16 = {
    x: float,
    y: float,
}
```
*/
type t_43802a16 = {
  type: "Vec2";
  x: number;
  y: number;
};

/**
```
@ffi type Vec3#9f1c0644 = {
    ...Vec2#43802a16,
    z: float,
}
```
*/
type t_9f1c0644 = {
  type: "Vec3";
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi type Vec4#3b941378 = {
    ...Vec3#9f1c0644,
    w: float,
}
```
*/
type t_3b941378 = {
  type: "Vec4";
  w: number;
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi type Mat4#d92781e8 = {
    r1: Vec4#3b941378,
    r2: Vec4#3b941378,
    r3: Vec4#3b941378,
    r4: Vec4#3b941378,
}
```
*/
type t_d92781e8 = {
  type: "Mat4";
  r1: t_3b941378;
  r2: t_3b941378;
  r3: t_3b941378;
  r4: t_3b941378;
};

/**
```
type AddSub#b99b22d8<T#:0, T#:1, T#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_b99b22d8<T_0, T_1, T_2> = {
  type: "b99b22d8";
  hb99b22d8_0: (arg_0: T_0, arg_1: T_1) => T_2;
  hb99b22d8_1: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Mul#1de4e4c0<T#:0, T#:1, T#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_1de4e4c0<T_0, T_1, T_2> = {
  type: "1de4e4c0";
  h1de4e4c0_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Div#5ac12902<T#:0, T#:1, T#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_5ac12902<T_0, T_1, T_2> = {
  type: "5ac12902";
  h5ac12902_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type HasName#ad561a20 = {
    name: string,
}
```
*/
type t_ad561a20 = {
  type: "ad561a20";
  had561a20_0: string;
};

/**
```
type HasAge#4082e170 = {
    age: int,
}
```
*/
type t_4082e170 = {
  type: "4082e170";
  h4082e170_0: number;
};

/**
```
type Person#58c1982c = {
    ...HasName#ad561a20,
    ...HasAge#4082e170,
    what: int,
}
```
*/
type t_58c1982c = {
  type: "58c1982c";
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
};

/**
```
type Employee#2736d9d6 = {
    ...Person#58c1982c,
    address: string,
}
```
*/
type t_2736d9d6 = {
  type: "2736d9d6";
  h2736d9d6_0: string;
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
};

/**
```
type House#164905e5 = {
    occupant: Person#58c1982c,
}
```
*/
type t_164905e5 = {
  type: "164905e5";
  h164905e5_0: t_58c1982c;
};

/**
```
type Counter#a4491948<T#:0> = {
    item: T#:0,
    count: int,
}
```
*/
type t_a4491948<T_0> = {
  type: "a4491948";
  ha4491948_0: T_0;
  ha4491948_1: number;
};

/**
```
type Animal#225ab688 = {
    ...HasName#ad561a20,
    furColor: string,
}
```
*/
type t_225ab688 = {
  type: "225ab688";
  h225ab688_0: string;
  had561a20_0: string;
};

/**
```
type WereWolf#9b77cbb0 = {
    ...Animal#225ab688,
    ...Person#58c1982c,
}
```
*/
type t_9b77cbb0 = {
  type: "9b77cbb0";
  h225ab688_0: string;
  had561a20_0: string;
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
};

/**
```
const me#5af8296e: Person#58c1982c = Person#58c1982c{
    name#ad561a20#0: "June",
    age#4082e170#0: 10,
    what#58c1982c#0: 3,
}
```
*/
export const hash_5af8296e: t_58c1982c = ({
  type: "58c1982c",
  had561a20_0: "June",
  h4082e170_0: 10,
  h58c1982c_0: 3
} as t_58c1982c);

/**
```
const aPerson#37c99a88: Person#58c1982c = Person#58c1982c{
    name#ad561a20#0: "ralf",
    age#4082e170#0: 23,
    what#58c1982c#0: 2,
}
```
*/
export const hash_37c99a88: t_58c1982c = ({
  type: "58c1982c",
  had561a20_0: "ralf",
  h4082e170_0: 23,
  h58c1982c_0: 2
} as t_58c1982c);

/**
```
const aDog#5cd59c5d: Animal#225ab688 = Animal#225ab688{
    name#ad561a20#0: "wolrf",
    furColor#225ab688#0: "red",
}
```
*/
export const hash_5cd59c5d: t_225ab688 = ({
  type: "225ab688",
  had561a20_0: "wolrf",
  h225ab688_0: "red"
} as t_225ab688);

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
const countNamed#8aced828: Counter#a4491948<<T#:0: HasName#ad561a20>(T#:0) ={}> string> = Counter#a4491948<
    <T#:0: HasName#ad561a20>(T#:0) ={}> string,
>{
    item#a4491948#0: <T#:0: HasName#ad561a20>(input#:0: T#:0) ={}> input#:0.name#ad561a20#0,
    count#a4491948#1: 10,
}
```
*/
export const hash_8aced828: t_a4491948<<T_0 extends {
  had561a20_0: string;
}>(arg_0: T_0) => string> = ({
  type: "a4491948",
  ha4491948_0: <T_0 extends {
    had561a20_0: string;
  }>(input$0: T_0) => input$0.had561a20_0,
  ha4491948_1: 10
} as t_a4491948<<T_0 extends {
  had561a20_0: string;
}>(arg_0: T_0) => string>);

/**
```
const countAny#5a5f83a0: Counter#a4491948<<T#:0>(T#:0) ={}> string> = Counter#a4491948<
    <T#:0>(T#:0) ={}> string,
>{item#a4491948#0: <T#:0>(input#:0: T#:0) ={}> "hi", count#a4491948#1: 10}
```
*/
export const hash_5a5f83a0: t_a4491948<<T_0>(arg_0: T_0) => string> = ({
  type: "a4491948",
  ha4491948_0: <T_0>(input$0: T_0) => "hi",
  ha4491948_1: 10
} as t_a4491948<<T_0>(arg_0: T_0) => string>);

/**
```
const countMe#3fcbf771: Counter#a4491948<int> = Counter#a4491948<int>{
    item#a4491948#0: 10,
    count#a4491948#1: 4000,
}
```
*/
export const hash_3fcbf771: t_a4491948<number> = ({
  type: "a4491948",
  ha4491948_0: 10,
  ha4491948_1: 4000
} as t_a4491948<number>);

/**
```
const here#7bf95f66: House#164905e5 = House#164905e5{occupant#164905e5#0: me#5af8296e}
```
*/
export const hash_7bf95f66: t_164905e5 = ({
  type: "164905e5",
  h164905e5_0: hash_5af8296e
} as t_164905e5);

/**
```
const getName#1ef63c92: <T#:0: Person#58c1982c>(T#:0) ={}> string = <T#:0: Person#58c1982c>(
    m#:0: T#:0,
) ={}> m#:0.name#ad561a20#0
```
*/
export const hash_1ef63c92: <T_0 extends {
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
}>(arg_0: T_0) => string = <T_0 extends {
  h58c1982c_0: number;
  had561a20_0: string;
  h4082e170_0: number;
}>(m$0: T_0) => m$0.had561a20_0;

/**
```
const them#3a789ae6: Employee#2736d9d6 = Employee#2736d9d6{
    what#58c1982c#0: 3,
    name#ad561a20#0: "You",
    age#4082e170#0: 100,
    address#2736d9d6#0: "No",
}
```
*/
export const hash_3a789ae6: t_2736d9d6 = ({
  type: "2736d9d6",
  h58c1982c_0: 3,
  had561a20_0: "You",
  h4082e170_0: 100,
  h2736d9d6_0: "No"
} as t_2736d9d6);

/**
```
const you#3baa0bc6: Employee#2736d9d6 = Employee#2736d9d6{...me#5af8296e, address#2736d9d6#0: "Yes"}
```
*/
export const hash_3baa0bc6: t_2736d9d6 = ({ ...hash_5af8296e,
  type: "2736d9d6",
  h2736d9d6_0: "Yes"
} as t_2736d9d6);

/**
```
const alsoMe#88bf856c: Person#58c1982c = Person#58c1982c{...me#5af8296e, what#58c1982c#0: 11}
```
*/
export const hash_88bf856c: t_58c1982c = ({ ...hash_5af8296e,
  type: "58c1982c",
  h58c1982c_0: 11
} as t_58c1982c);

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
StringEq#606c7034."=="#553b4b8e#0(me#5af8296e.name#ad561a20#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5af8296e.had561a20_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(me#5af8296e.age#4082e170#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_5af8296e.h4082e170_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(alsoMe#88bf856c.name#ad561a20#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_88bf856c.had561a20_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(alsoMe#88bf856c.what#58c1982c#0, 11)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_88bf856c.h58c1982c_0, 11);

/*
StringEq#606c7034."=="#553b4b8e#0(you#3baa0bc6.name#ad561a20#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3baa0bc6.had561a20_0, "June");

/*
StringEq#606c7034."=="#553b4b8e#0(them#3a789ae6.name#ad561a20#0, "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3a789ae6.had561a20_0, "You");

/*
StringEq#606c7034."=="#553b4b8e#0(them#3a789ae6.address#2736d9d6#0, "No")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_3a789ae6.h2736d9d6_0, "No");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#1ef63c92<Person#58c1982c>(me#5af8296e), "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1ef63c92(hash_5af8296e), "June");

/*
StringEq#606c7034."=="#553b4b8e#0(getName#1ef63c92<Employee#2736d9d6>(them#3a789ae6), "You")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1ef63c92(hash_3a789ae6), "You");

/*
StringEq#606c7034."=="#553b4b8e#0(here#7bf95f66.occupant#164905e5#0.name#ad561a20#0, "June")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7bf95f66.h164905e5_0.had561a20_0, "June");

/*
IntEq#9275f914."=="#553b4b8e#0(countMe#3fcbf771.item#a4491948#0, 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_3fcbf771.ha4491948_0, 10);

/*
StringEq#606c7034."=="#553b4b8e#0(
    Counter#a4491948<() ={}> string>{item#a4491948#0: () ={}> "hi", count#a4491948#1: 10}.item#a4491948#0(),
    "hi",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({
  type: "a4491948",
  ha4491948_0: () => "hi",
  ha4491948_1: 10
} as t_a4491948<() => string>).ha4491948_0(), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#5a5f83a0.item#a4491948#0<string>("String"), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5a5f83a0.ha4491948_0("String"), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(countAny#5a5f83a0.item#a4491948#0<int>(10), "hi")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5a5f83a0.ha4491948_0(10), "hi");

/*
StringEq#606c7034."=="#553b4b8e#0(
    countNamed#8aced828.item#a4491948#0<Person#58c1982c>(me#5af8296e),
    "June",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_8aced828.ha4491948_0(hash_5af8296e), "June");

/*
IntEq#9275f914."=="#553b4b8e#0(gotit#9781cfa0.contents#Some#0, 5)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_9781cfa0.hSome_0, 5);

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#9b77cbb0{...aDog#5cd59c5d, ...aPerson#37c99a88}.name#ad561a20#0,
    "ralf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_5cd59c5d,
  ...hash_37c99a88,
  type: "9b77cbb0"
} as t_9b77cbb0).had561a20_0, "ralf");

/*
StringEq#606c7034."=="#553b4b8e#0(
    WereWolf#9b77cbb0{...aPerson#37c99a88, ...aDog#5cd59c5d}.name#ad561a20#0,
    "wolrf",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, ({ ...hash_37c99a88,
  ...hash_5cd59c5d,
  type: "9b77cbb0"
} as t_9b77cbb0).had561a20_0, "wolrf");