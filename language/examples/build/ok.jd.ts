import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];

/**
```
type Person#ba1e5642 = {
    name: string,
    age: int,
}
```
*/
type t_ba1e5642 = {
  type: "ba1e5642";
  hba1e5642_0: string;
  hba1e5642_1: number;
};

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
export const hash_7825e3a8: <T_0>(arg_0: Array<T_0>, arg_1: Array<T_0>, arg_2: t_553b4b8e<T_0>) => boolean = <T_0>(one: Array<T_0>, two: Array<T_0>, eq: t_553b4b8e<T_0>) => {
  let one_i: number = 0;
  let two_i: number = 0;

  while (true) {
    if (two.length - two_i == 0 && one.length - one_i == 0) {
      return true;
    }

    if (two.length - two_i >= 1 && one.length - one_i >= 1) {
      if (eq.h553b4b8e_0(one[0 + one_i], two[0 + two_i])) {
        one_i = one_i + 1;
        two_i = two_i + 1;
        eq = eq;
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => done(handlers, value));
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
  h553b4b8e_0: (one$1: Array<T_0>, two$2: Array<T_0>) => hash_9275f914.h553b4b8e_0(len(one$1), len(two$2)) && hash_7825e3a8(one$1, two$2, eq$0)
} as t_553b4b8e<Array<T_0>>);

/**
```
const getPerson#5d7fc4f0: () ={Read#22024b72}> Person#ba1e5642 = () ={Read#22024b72}> Person#ba1e5642{
    name#ba1e5642#0: getString#64605d94(),
    age#ba1e5642#1: 5,
}
```
*/
export const hash_5d7fc4f0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: t_ba1e5642) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: t_ba1e5642) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue: string) => done$2(handlers, ({
    type: "ba1e5642",
    hba1e5642_0: returnValue,
    hba1e5642_1: 5
  } as t_ba1e5642)));
};

/**
```
const getPersonName#5499a084: () ={Read#22024b72}> string = () ={Read#22024b72}> Person#ba1e5642{
    name#ba1e5642#0: getString#64605d94(),
    age#ba1e5642#1: 5,
}.name#ba1e5642#0
```
*/
export const hash_5499a084:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => done$3(handlers, ({
    type: "ba1e5642",
    hba1e5642_0: returnValue$5,
    hba1e5642_1: 5
  } as t_ba1e5642).hba1e5642_0));
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: Array<string>) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue: string) => done$2(handlers, [returnValue]));
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(v: string, i: number, fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn, [(handlers, _, k$4:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result = hash_4ffa1f88(v, i + 1, (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$4(v + hash_1175499e.hAs_0(i), handlers, (handlers: Handlers, returnValue$8: T_0) => done$6(handlers, returnValue$8));
    });
  }], (handlers: Handlers, v$3: T_0) => {
    result = v$3;
  });
  return result;
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
const spreadPerson#279e45cf: () ={Read#22024b72}> Person#ba1e5642 = () ={Read#22024b72}> Person#ba1e5642{
    ...getPerson#5d7fc4f0(),
    age#ba1e5642#1: 20,
}
```
*/
export const hash_279e45cf:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: t_ba1e5642) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: t_ba1e5642) => void) => {
  hash_5d7fc4f0(handlers, (handlers: Handlers, returnValue: t_ba1e5642) => done$2(handlers, ({ ...returnValue,
    type: "ba1e5642",
    hba1e5642_1: 20
  } as t_ba1e5642)));
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: () => string) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: () => string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$3: string) => done(handlers, () => returnValue$3));
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
(arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void = (n: number, handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  if (hash_9275f914.h553b4b8e_0(n, 5)) {
    hash_64605d94(handlers, (handlers: Handlers, returnValue$3: string) => done(handlers, returnValue$3));
  } else {
    done(handlers, "wot");
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => ((handlers: Handlers) => {
    let lambdaBlockResult: string;

    if (hash_606c7034.h553b4b8e_0(returnValue$5, "Yes")) {
      lambdaBlockResult = "good";
    } else {
      lambdaBlockResult = "nope";
    }

    done$3(handlers, lambdaBlockResult);
  })(handlers));
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(v: string, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$4: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = hash_2dbf3eae(v, (handlers: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(v, handlers, (handlers: Handlers, returnValue$7: T_0) => done$5(handlers, returnValue$7));
    });
  }], (handlers: Handlers, v$2: T_0) => {
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (v: string, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result = hash_0247dd82(v, (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(v + "got", handlers, (handlers: Handlers, returnValue$8: string) => done$6(handlers, returnValue$8 + "back"));
    }) + "provided";
  }], (handlers: Handlers, v$2: string) => {
    result = v$2 + "pure";
  });
  return result;
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
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, value: string) => raise(handlers, "35f4b478", 0, value, (handlers, value) => done(handlers, value)))(handlers, value));
};

/*
(a#:0: int, b#:1: string) ={Read#22024b72, Write#35f4b478}> (b#:1 + getString#64605d94())
*/
(a: number, b: string, handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => done$3(handlers, b + returnValue$5));
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
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Yes", (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
  hash_2df6410a(5, handlers, (handlers: Handlers, returnValue$8: string) => done$6(handlers, returnValue$8));
}) + ":" + hash_2dbf3eae("Yes?", (handlers: Handlers, done$9: (arg_0: Handlers, arg_1: string) => void) => {
  hash_2df6410a(4, handlers, (handlers: Handlers, returnValue$11: string) => done$9(handlers, returnValue$11));
}), "Yes:wot");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringPlain#2dbf3eae<string>("what", () ={Read#22024b72}> callAgain#a8135548()()),
    "what",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("what", (handlers: Handlers, done$13: (arg_0: Handlers, arg_1: string) => void) => {
  hash_a8135548(handlers, (handlers: Handlers, returnValue$15: () => string) => done$13(handlers, returnValue$15()));
}), "what");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringPlain#2dbf3eae<Person#ba1e5642>("Me", getPerson#5d7fc4f0).name#ba1e5642#0,
    "Me",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Me", hash_5d7fc4f0).hba1e5642_0, "Me");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringPlain#2dbf3eae<Person#ba1e5642>("Me", spreadPerson#279e45cf).name#ba1e5642#0,
    "Me",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Me", hash_279e45cf).hba1e5642_0, "Me");

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
assertCall(hash_0d35c408.h553b4b8e_0, hash_4ffa1f88("Hi", 0, (handlers: Handlers, done$18: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$22: string) => hash_64605d94(handlers, (handlers: Handlers, returnValue$20: string) => done$18(handlers, [returnValue$22, returnValue$20])));
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
assertCall(hash_0d35c408.h553b4b8e_0, hash_4ffa1f88("Hi", 0, (handlers: Handlers, done$25: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_3bfdbd8c(handlers, (handlers: Handlers, returnValue$29: Array<string>) => hash_64605d94(handlers, (handlers: Handlers, returnValue$27: string) => done$25(handlers, [...returnValue$29, returnValue$27])));
}), ["Hi0", "Hi1"]);

/*
() ={Read#22024b72, Write#35f4b478}> {
    raise!(Write#35f4b478.write("hello"));
    getString#64605d94();
}
*/
(handlers: Handlers, done$30: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "35f4b478", 0, "hello", (handlers, value) => ((handlers: Handlers) => {
    hash_64605d94(handlers, (handlers: Handlers, returnValue$32: string) => done$30(handlers, returnValue$32));
  })(handlers, value));
};

/*
() ={Read#22024b72}> (getString#64605d94(), 1.0).0
*/
(handlers: Handlers, done$35: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$37: string) => done$35(handlers, [returnValue$37, 1][0]));
};

/*
StringEq#606c7034."=="#553b4b8e#0(
    provideStringPlain#2dbf3eae<string>("ok", getPersonName#5499a084),
    "ok",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("ok", hash_5499a084), "ok");