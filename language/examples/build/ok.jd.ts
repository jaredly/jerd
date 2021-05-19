import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];

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
type Person#292d6646 = {
    name: string,
    age: int,
}
```
*/
type t_292d6646 = {
  type: "292d6646";
  h292d6646_0: string;
  h292d6646_1: number;
};

/**
```
const arrayEq#7825e3a8: <T#:0>(Array<T#:0>, Array<T#:0>, Eq#553b4b8e<T#:0>) ={}> bool = <T#:0>(
    one#:0: Array<T#:0>,
    two#:1: Array<T#:0>,
    eq#:2: Eq#553b4b8e<T#:0>,
) ={}> {
    switch (one#:0, two#:1) {
        ([], []) => true,
        ([one#:3, ...rone#:4], [two#:5, ...rtwo#:6]) => if eq#:2."=="#553b4b8e#0(one#:3, two#:5) {
            7825e3a8<T#:0>(rone#:4, rtwo#:6, eq#:2);
        } else {
            false;
        },
        _#:7 => false,
    };
}
```
*/
export const hash_7825e3a8: <T_0>(arg_0: Array<T_0>, arg_1: Array<T_0>, arg_2: t_553b4b8e<T_0>) => boolean = <T_0>(one$0: Array<T_0>, two$1: Array<T_0>, eq$2: t_553b4b8e<T_0>) => {
  let one_i$12: number = 0;
  let two_i$13: number = 0;

  while (true) {
    if (two$1.length - two_i$13 == 0 && one$0.length - one_i$12 == 0) {
      return true;
    }

    if (two$1.length - two_i$13 >= 1 && one$0.length - one_i$12 >= 1) {
      if (eq$2.h553b4b8e_0(one$0[0 + one_i$12], two$1[0 + two_i$13])) {
        one_i$12 = one_i$12 + 1;
        two_i$13 = two_i$13 + 1;
        eq$2 = eq$2;
        continue;
      } else {
        return false;
      }
    }

    return false;
  }
};

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
const getString#64605d94: () ={Read#22024b72}> string = () ={Read#22024b72}> raise!(
    Read#22024b72.read(),
)
```
*/
export const hash_64605d94:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => done$1(handlers$15000, value));
};

/**
```
const IntAsString#1175499e: As#As<int, string> = As#As<int, string>{as#As#0: intToString}
```
*/
export const hash_1175499e: t_As<number, string> = ({
  type: "As",
  hAs_0: intToString
} as t_As<number, string>);

/**
```
const StringEq#606c7034: Eq#553b4b8e<string> = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/**
```
const ArrayEq#bef2134a: <T#:0>(Eq#553b4b8e<T#:0>) ={}> Eq#553b4b8e<Array<T#:0>> = <T#:0>(
    eq#:0: Eq#553b4b8e<T#:0>,
) ={}> Eq#553b4b8e<Array<T#:0>>{
    "=="#553b4b8e#0: (one#:1: Array<T#:0>, two#:2: Array<T#:0>) ={}> (IntEq#9275f914."=="#553b4b8e#0(
        len<T#:0>(one#:1),
        len<T#:0>(two#:2),
    ) && arrayEq#7825e3a8<T#:0>(one#:1, two#:2, eq#:0)),
}
```
*/
export const hash_bef2134a: <T_0>(arg_0: t_553b4b8e<T_0>) => t_553b4b8e<Array<T_0>> = <T_0>(eq$0: t_553b4b8e<T_0>) => ({
  type: "553b4b8e",
  h553b4b8e_0: (one$1: Array<T_0>, two$2: Array<T_0>) => intEq(len(one$1), len(two$2)) && hash_7825e3a8(one$1, two$2, eq$0)
} as t_553b4b8e<Array<T_0>>);

/**
```
const getPerson#6e599d64: () ={Read#22024b72}> Person#292d6646 = () ={Read#22024b72}> Person#292d6646{
    name#292d6646#0: getString#64605d94(),
    age#292d6646#1: 5,
}
```
*/
export const hash_6e599d64:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: t_292d6646) => void) => void = (handlers$15000: Handlers, done$2: (arg_0: Handlers, arg_1: t_292d6646) => void) => {
  hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$4: string) => done$2(handlers$15000, ({
    type: "292d6646",
    h292d6646_0: returnValue$4,
    h292d6646_1: 5
  } as t_292d6646)));
};

/**
```
const getPersonName#1f8dfece: () ={Read#22024b72}> string = () ={Read#22024b72}> Person#292d6646{
    name#292d6646#0: getString#64605d94(),
    age#292d6646#1: 5,
}.name#292d6646#0
```
*/
export const hash_1f8dfece:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers$15000: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$5: string) => done$3(handlers$15000, ({
    type: "292d6646",
    h292d6646_0: returnValue$5,
    h292d6646_1: 5
  } as t_292d6646).h292d6646_0));
};

/**
```
const getStringArr#3bfdbd8c: () ={Read#22024b72}> Array<string> = () ={Read#22024b72}> <string>[
    getString#64605d94(),
]
```
*/
export const hash_3bfdbd8c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: Array<string>) => void) => void = (handlers$15000: Handlers, done$2: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$4: string) => done$2(handlers$15000, [returnValue$4]));
};

/**
```
const provideIncrement#4ffa1f88: <T#:0>(string, int, () ={Read#22024b72}> T#:0) ={}> T#:0 = <T#:0>(
    v#:0: string,
    i#:1: int,
    fn#:2: () ={Read#22024b72}> T#:0,
) ={}> handle! fn#:2 {
    Read.read#0(() => k#:4) => 4ffa1f88<T#:0>(
        v#:0,
        (i#:1 + 1),
        () ={Read#22024b72}> k#:4((v#:0 + i#:1 as#1175499e string)),
    ),
    pure(v#:3) => v#:3,
}
```
*/
export const hash_4ffa1f88: <T_0>(arg_0: string, arg_1: number, arg_2:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(v$0: string, i$1: number, fn$2:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$5: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$2, [(handlers$15000, _, k$4:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$5 = hash_4ffa1f88(v$0, i$1 + 1, (handlers$15000: Handlers, done$6: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$4(v$0 + intToString(i$1), handlers$15000, (handlers$15000: Handlers, returnValue$8: T_0) => done$6(handlers$15000, returnValue$8));
    });
  }], (handlers$15000: Handlers, v$3: T_0) => {
    result$5 = v$3;
  });
  return result$5;
};

/**
```
const ArrayStringEq#0d35c408: Eq#553b4b8e<Array<string>> = ArrayEq#bef2134a<string>(
    StringEq#606c7034,
)
```
*/
export const hash_0d35c408: t_553b4b8e<Array<T_0>> = hash_bef2134a(hash_606c7034);

/**
```
const spreadPerson#4cd38480: () ={Read#22024b72}> Person#292d6646 = () ={Read#22024b72}> Person#292d6646{
    ...getPerson#6e599d64(),
    age#292d6646#1: 20,
}
```
*/
export const hash_4cd38480:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: t_292d6646) => void) => void = (handlers$15000: Handlers, done$2: (arg_0: Handlers, arg_1: t_292d6646) => void) => {
  hash_6e599d64(handlers$15000, (handlers$15000: Handlers, returnValue$4: t_292d6646) => done$2(handlers$15000, ({ ...returnValue$4,
    type: "292d6646",
    h292d6646_1: 20
  } as t_292d6646)));
};

/**
```
const callAgain#a8135548: () ={Read#22024b72}> () ={}> string = () ={Read#22024b72}> {
    const v#:0 = getString#64605d94();
    () ={}> v#:0;
}
```
*/
export const hash_a8135548:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: () => string) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: () => string) => void) => {
  hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$3: string) => done$1(handlers$15000, () => returnValue$3));
};

/**
```
const sideBar#2df6410a: (int) ={Read#22024b72}> string = (n#:0: int) ={Read#22024b72}> {
    if IntEq#9275f914."=="#553b4b8e#0(n#:0, 5) {
        getString#64605d94();
    } else {
        "wot";
    };
}
```
*/
export const hash_2df6410a:
/*from cps lambda*/
(arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void = (n$0: number, handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  if (intEq(n$0, 5)) {
    hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$3: string) => done$1(handlers$15000, returnValue$3));
  } else {
    done$1(handlers$15000, "wot");
  }
};

/**
```
const ifYes#5bf7f75c: () ={Read#22024b72}> string = () ={Read#22024b72}> {
    if StringEq#606c7034."=="#553b4b8e#0(getString#64605d94(), "Yes") {
        "good";
    } else {
        "nope";
    };
}
```
*/
export const hash_5bf7f75c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers$15000: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$5: string) => done$3(handlers$15000, (() => {
    if (stringEq(returnValue$5, "Yes")) {
      return "good";
    } else {
      return "nope";
    }
  })()));
};

/**
```
const provideStringPlain#2dbf3eae: <T#:0>(string, () ={Read#22024b72}> T#:0) ={}> T#:0 = <T#:0>(
    v#:0: string,
    fn#:1: () ={Read#22024b72}> T#:0,
) ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => 2dbf3eae<T#:0>(v#:0, () ={Read#22024b72}> k#:3(v#:0)),
    pure(v#:2) => v#:2,
}
```
*/
export const hash_2dbf3eae: <T_0>(arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(v$0: string, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$4: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = hash_2dbf3eae(v$0, (handlers$15000: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(v$0, handlers$15000, (handlers$15000: Handlers, returnValue$7: T_0) => done$5(handlers$15000, returnValue$7));
    });
  }], (handlers$15000: Handlers, v$2: T_0) => {
    result$4 = v$2;
  });
  return result$4;
};

/**
```
const provideString#0247dd82: (string, () ={Read#22024b72}> string) ={}> string = (
    v#:0: string,
    fn#:1: () ={Read#22024b72}> string,
) ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => (0247dd82(v#:0, () ={Read#22024b72}> (k#:3((v#:0 + "got")) + "back")) + "provided"),
    pure(v#:2) => (v#:2 + "pure"),
}
```
*/
export const hash_0247dd82: (arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (v$0: string, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result$5: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result$5 = hash_0247dd82(v$0, (handlers$15000: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(v$0 + "got", handlers$15000, (handlers$15000: Handlers, returnValue$8: string) => done$6(handlers$15000, returnValue$8 + "back"));
    }) + "provided";
  }], (handlers$15000: Handlers, v$2: string) => {
    result$5 = v$2 + "pure";
  });
  return result$5;
};

/**
```
const both#bc94fd0c: () ={Read#22024b72, Write#35f4b478}> void = () ={Read#22024b72, Write#35f4b478}> {
    const value#:0 = raise!(Read#22024b72.read());
    raise!(Write#35f4b478.write(value#:0));
}
```
*/
export const hash_bc94fd0c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers) => void) => {
  raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, value$0: string) => raise(handlers$15000, "35f4b478", 0, value$0, (handlers$15000, value) => done$1(handlers$15000, value)))(handlers$15000, value));
};

/*
(a#:0: int, b#:1: string) ={Read#22024b72, Write#35f4b478}> (b#:1 + getString#64605d94())
*/
(a$0: number, b$1: string, handlers$15000: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$5: string) => done$3(handlers$15000, b$1 + returnValue$5));
};

/*
both#bc94fd0c
*/
hash_bc94fd0c;

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideString#0247dd82("Yes", getString#64605d94),
    "Yesgotbackpureprovided",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0247dd82("Yes", hash_64605d94), "Yesgotbackpureprovided");

/*
StringEq#606c7034."=="#553b4b8e#0(
    ((provideStringPlain#2dbf3eae<string>("Yes", ifYes#5bf7f75c) + ":") + provideStringPlain#2dbf3eae<
        string,
    >("Yes?", ifYes#5bf7f75c)),
    "good:nope",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Yes", hash_5bf7f75c) + ":" + hash_2dbf3eae("Yes?", hash_5bf7f75c), "good:nope");

/*
StringEq#606c7034."=="#553b4b8e#0(
    ((provideStringPlain#2dbf3eae<string>("Yes", () ={Read#22024b72}> sideBar#2df6410a(5)) + ":") + provideStringPlain#2dbf3eae<
        string,
    >("Yes?", () ={Read#22024b72}> sideBar#2df6410a(4))),
    "Yes:wot",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Yes", (handlers$15000: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
  hash_2df6410a(5, handlers$15000, (handlers$15000: Handlers, returnValue$8: string) => done$6(handlers$15000, returnValue$8));
}) + ":" + hash_2dbf3eae("Yes?", (handlers$15000: Handlers, done$9: (arg_0: Handlers, arg_1: string) => void) => {
  hash_2df6410a(4, handlers$15000, (handlers$15000: Handlers, returnValue$11: string) => done$9(handlers$15000, returnValue$11));
}), "Yes:wot");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringPlain#2dbf3eae<string>("what", () ={Read#22024b72}> callAgain#a8135548()()),
    "what",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("what", (handlers$15000: Handlers, done$13: (arg_0: Handlers, arg_1: string) => void) => {
  hash_a8135548(handlers$15000, (handlers$15000: Handlers, returnValue$15: () => string) => done$13(handlers$15000, returnValue$15()));
}), "what");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringPlain#2dbf3eae<Person#292d6646>("Me", getPerson#6e599d64).name#292d6646#0,
    "Me",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Me", hash_6e599d64).h292d6646_0, "Me");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringPlain#2dbf3eae<Person#292d6646>("Me", spreadPerson#4cd38480).name#292d6646#0,
    "Me",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Me", hash_4cd38480).h292d6646_0, "Me");

/*
ArrayStringEq#0d35c408."=="#553b4b8e#0(
    provideIncrement#4ffa1f88<Array<string>>(
        "Hi",
        0,
        () ={Read#22024b72}> <string>[getString#64605d94(), getString#64605d94()],
    ),
    <string>["Hi0", "Hi1"],
)
*/
assertCall(hash_0d35c408.h553b4b8e_0, hash_4ffa1f88("Hi", 0, (handlers$15000: Handlers, done$18: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$22: string) => hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$20: string) => done$18(handlers$15000, [returnValue$22, returnValue$20])));
}), ["Hi0", "Hi1"]);

/*
ArrayStringEq#0d35c408."=="#553b4b8e#0(
    provideIncrement#4ffa1f88<Array<string>>(
        "Hi",
        0,
        () ={Read#22024b72}> <string>[...getStringArr#3bfdbd8c(), getString#64605d94()],
    ),
    <string>["Hi0", "Hi1"],
)
*/
assertCall(hash_0d35c408.h553b4b8e_0, hash_4ffa1f88("Hi", 0, (handlers$15000: Handlers, done$25: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_3bfdbd8c(handlers$15000, (handlers$15000: Handlers, returnValue$29: Array<string>) => hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$27: string) => done$25(handlers$15000, [...returnValue$29, returnValue$27])));
}), ["Hi0", "Hi1"]);

/*
() ={Read#22024b72, Write#35f4b478}> {
    raise!(Write#35f4b478.write("hello"));
    getString#64605d94();
}
*/
(handlers$15000: Handlers, done$30: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers$15000, "35f4b478", 0, "hello", (handlers$15000, value) => ((handlers$15000: Handlers) => {
    hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$32: string) => done$30(handlers$15000, returnValue$32));
  })(handlers$15000, value));
};

/*
() ={Read#22024b72}> (getString#64605d94(), 1.0).0
*/
(handlers$15000: Handlers, done$35: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$37: string) => done$35(handlers$15000, [returnValue$37, 1][0]));
};

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringPlain#2dbf3eae<string>("ok", getPersonName#1f8dfece),
    "ok",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("ok", hash_1f8dfece), "ok");