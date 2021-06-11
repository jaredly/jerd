import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];

/**
```
type Person#066d8180 = {
    name: string,
    age: int,
}
```
*/
type t_066d8180 = {
  type: "066d8180";
  h066d8180_0: string;
  h066d8180_1: number;
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
const rec arrayEq#7825e3a8 = <T#:0>(
    one#:0: Array<T#:0>,
    two#:1: Array<T#:0>,
    eq#:2: Eq#553b4b8e<T#:0>,
): bool ={}> {
    switch (one#:0, two#:1) {
        ([], []) => true,
        ([one#:3, ...rone#:4], [two#:5, ...rtwo#:6]) => if eq#:2."=="#553b4b8e#0(one#:3, two#:5) {
            7825e3a8#self<T#:0>(rone#:4, rtwo#:6, eq#:2);
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
const IntEq#9275f914 = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const getString#64605d94 = (): string ={Read#22024b72}> raise!(Read#22024b72.read())
```
*/
export const hash_64605d94:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => done(handlers, value));
};

/**
```
const IntAsString#1175499e = As#As<int, string>{as#As#0: intToString}
```
*/
export const hash_1175499e: t_As<number, string> = ({
  type: "As",
  hAs_0: intToString
} as t_As<number, string>);

/**
```
const StringEq#606c7034 = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/**
```
const ArrayEq#bef2134a = <T#:0>(eq#:0: Eq#553b4b8e<T#:0>): Eq#553b4b8e<Array<T#:0>> ={}> Eq#553b4b8e<
    Array<T#:0>,
>{
    "=="#553b4b8e#0: (one#:1: Array<T#:0>, two#:2: Array<T#:0>): bool ={}> len<T#:0>(one#:1) 
            ==#9275f914#553b4b8e#0 len<T#:0>(two#:2) 
        && arrayEq#7825e3a8<T#:0>(one#:1, two#:2, eq#:0),
}
```
*/
export const hash_bef2134a: <T_0>(arg_0: t_553b4b8e<T_0>) => t_553b4b8e<Array<T_0>> = <T_0>(eq$0: t_553b4b8e<T_0>) => ({
  type: "553b4b8e",
  h553b4b8e_0: (one$1: Array<T_0>, two$2: Array<T_0>) => hash_9275f914.h553b4b8e_0(len(one$1), len(two$2)) && hash_7825e3a8(one$1, two$2, eq$0)
} as t_553b4b8e<Array<T_0>>);

/**
```
const getPerson#2a1f854a = (): Person#066d8180 ={Read#22024b72}> Person#066d8180{
    name#066d8180#0: getString#64605d94(),
    age#066d8180#1: 5,
}
```
*/
export const hash_2a1f854a:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: t_066d8180) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: t_066d8180) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue: string) => {
    done$2(handlers, ({
      type: "066d8180",
      h066d8180_0: returnValue,
      h066d8180_1: 5
    } as t_066d8180));
  });
};

/**
```
const getPersonName#3b2dbacb = (): string ={Read#22024b72}> Person#066d8180{
    name#066d8180#0: getString#64605d94(),
    age#066d8180#1: 5,
}.name#066d8180#0
```
*/
export const hash_3b2dbacb:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => {
    done$3(handlers, ({
      type: "066d8180",
      h066d8180_0: returnValue$5,
      h066d8180_1: 5
    } as t_066d8180).h066d8180_0);
  });
};

/**
```
const getStringArr#3bfdbd8c = (): Array<string> ={Read#22024b72}> <string>[getString#64605d94()]
```
*/
export const hash_3bfdbd8c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: Array<string>) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue: string) => {
    done$2(handlers, [returnValue]);
  });
};

/**
```
const rec provideIncrement#4ffa1f88 = <T#:0>(
    v#:0: string,
    i#:1: int,
    fn#:2: () ={Read#22024b72}> T#:0,
): T#:0 ={}> handle! fn#:2 {
    Read.read#0(() => k#:4) => 4ffa1f88#self<T#:0>(
        v#:0,
        i#:1 + 1,
        (): T#:0 ={Read#22024b72}> k#:4(v#:0 + i#:1 as#1175499e string),
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
    result = (() => hash_4ffa1f88(v, i + 1, (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$4(v + hash_1175499e.hAs_0(i), handlers, (handlers: Handlers, returnValue$8: T_0) => done$6(handlers, returnValue$8));
    }))();
  }], (handlers: Handlers, v$3: T_0) => {
    result = (() => v$3)();
  });
  return result;
};

/**
```
const ArrayStringEq#0d35c408 = ArrayEq#bef2134a<string>(eq: StringEq#606c7034)
```
*/
export const hash_0d35c408: t_553b4b8e<Array<T_0>> = hash_bef2134a(hash_606c7034);

/**
```
const spreadPerson#4668b1c3 = (): Person#066d8180 ={Read#22024b72}> Person#066d8180{
    ...getPerson#2a1f854a(),
    age#066d8180#1: 20,
}
```
*/
export const hash_4668b1c3:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: t_066d8180) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: t_066d8180) => void) => {
  hash_2a1f854a(handlers, (handlers: Handlers, returnValue: t_066d8180) => {
    done$2(handlers, ({ ...returnValue,
      type: "066d8180",
      h066d8180_1: 20
    } as t_066d8180));
  });
};

/**
```
const callAgain#a8135548 = (): () ={}> string ={Read#22024b72}> {
    const v#:0 = getString#64605d94();
    (): string ={}> v#:0;
}
```
*/
export const hash_a8135548:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: () => string) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: () => string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$3: string) => {
    done(handlers, () => returnValue$3);
  });
};

/**
```
const sideBar#2df6410a = (n#:0: int): string ={Read#22024b72}> {
    if n#:0 ==#9275f914#553b4b8e#0 5 {
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
const ifYes#5bf7f75c = (): string ={Read#22024b72}> {
    if getString#64605d94() ==#606c7034#553b4b8e#0 "Yes" {
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
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => {
    let lambdaBlockResult: string = (null as any);

    if (hash_606c7034.h553b4b8e_0(returnValue$5, "Yes")) {
      lambdaBlockResult = "good";
    } else {
      lambdaBlockResult = "nope";
    }

    done$3(handlers, lambdaBlockResult);
  });
};

/**
```
const rec provideStringPlain#2dbf3eae = <T#:0>(v#:0: string, fn#:1: () ={Read#22024b72}> T#:0): T#:0 ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => 2dbf3eae#self<T#:0>(v#:0, (): T#:0 ={Read#22024b72}> k#:3(v#:0)),
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
    result$4 = (() => hash_2dbf3eae(v, (handlers: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(v, handlers, (handlers: Handlers, returnValue$7: T_0) => done$5(handlers, returnValue$7));
    }))();
  }], (handlers: Handlers, v$2: T_0) => {
    result$4 = (() => v$2)();
  });
  return result$4;
};

/**
```
const rec provideString#0247dd82 = (v#:0: string, fn#:1: () ={Read#22024b72}> string): string ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => 0247dd82#self(
            v#:0,
            (): string ={Read#22024b72}> k#:3(v#:0 + "got") + "back",
        ) 
        + "provided",
    pure(v#:2) => v#:2 + "pure",
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
    result = (() => hash_0247dd82(v, (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(v + "got", handlers, (handlers: Handlers, returnValue$8: string) => ((handlers: Handlers, arg_lift_0: string) => ((handlers: Handlers) => {
        done$6(handlers, arg_lift_0 + "back");
      })(handlers))(handlers, returnValue$8));
    }) + "provided")();
  }], (handlers: Handlers, v$2: string) => {
    result = (() => v$2 + "pure")();
  });
  return result;
};

/**
```
const both#bc94fd0c = (): void ={Read#22024b72, Write#35f4b478}> {
    const value#:0 = raise!(Read#22024b72.read());
    raise!(Write#35f4b478.write(value#:0));
}
```
*/
export const hash_bc94fd0c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, value: string) => {
    raise(handlers, "35f4b478", 0, value, (handlers, value) => done(handlers, value));
  })(handlers, value));
};

/*
(a#:0: int, b#:1: string): string ={Read#22024b72, Write#35f4b478}> b#:1 + getString#64605d94()
*/
(a: number, b: string, handlers: Handlers, done$4: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$6: string) => {
    let continueBlock: boolean = true;
    done$4(handlers, b + returnValue$6);
  });
};

/*
both#bc94fd0c
*/
hash_bc94fd0c;

/*
provideString#0247dd82(v: "Yes", fn: getString#64605d94) 
    ==#606c7034#553b4b8e#0 "Yesgotbackpureprovided"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0247dd82("Yes", hash_64605d94), "Yesgotbackpureprovided");

/*
provideStringPlain#2dbf3eae<string>(v: "Yes", fn: ifYes#5bf7f75c) + ":" 
        + provideStringPlain#2dbf3eae<string>(v: "Yes?", fn: ifYes#5bf7f75c) 
    ==#606c7034#553b4b8e#0 "good:nope"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Yes", hash_5bf7f75c) + ":" + hash_2dbf3eae("Yes?", hash_5bf7f75c), "good:nope");

/*
provideStringPlain#2dbf3eae<string>(
                v: "Yes",
                fn: (): string ={Read#22024b72}> sideBar#2df6410a(n: 5),
            ) 
            + ":" 
        + provideStringPlain#2dbf3eae<string>(
            v: "Yes?",
            fn: (): string ={Read#22024b72}> sideBar#2df6410a(n: 4),
        ) 
    ==#606c7034#553b4b8e#0 "Yes:wot"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Yes", (handlers: Handlers, done$8: (arg_0: Handlers, arg_1: string) => void) => {
  hash_2df6410a(5, handlers, (handlers: Handlers, returnValue$10: string) => done$8(handlers, returnValue$10));
}) + ":" + hash_2dbf3eae("Yes?", (handlers: Handlers, done$11: (arg_0: Handlers, arg_1: string) => void) => {
  hash_2df6410a(4, handlers, (handlers: Handlers, returnValue$13: string) => done$11(handlers, returnValue$13));
}), "Yes:wot");

/*
provideStringPlain#2dbf3eae<string>(
        v: "what",
        fn: (): string ={Read#22024b72}> callAgain#a8135548()(),
    ) 
    ==#606c7034#553b4b8e#0 "what"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("what", (handlers: Handlers, done$15: (arg_0: Handlers, arg_1: string) => void) => {
  hash_a8135548(handlers, (handlers: Handlers, returnValue$17: () => string) => {
    let continueBlock$18: boolean = true;
    done$15(handlers, returnValue$17());
  });
}), "what");

/*
provideStringPlain#2dbf3eae<Person#066d8180>(v: "Me", fn: getPerson#2a1f854a).name#066d8180#0 
    ==#606c7034#553b4b8e#0 "Me"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Me", hash_2a1f854a).h066d8180_0, "Me");

/*
provideStringPlain#2dbf3eae<Person#066d8180>(v: "Me", fn: spreadPerson#4668b1c3).name#066d8180#0 
    ==#606c7034#553b4b8e#0 "Me"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("Me", hash_4668b1c3).h066d8180_0, "Me");

/*
provideIncrement#4ffa1f88<Array<string>>(
        v: "Hi",
        i: 0,
        fn: (): Array<string> ={Read#22024b72}> <string>[getString#64605d94(), getString#64605d94()],
    ) 
    ==#0d35c408#553b4b8e#0 <string>["Hi0", "Hi1"]
*/
assertCall(hash_0d35c408.h553b4b8e_0, hash_4ffa1f88("Hi", 0, (handlers: Handlers, done$21: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$25: string) => {
    let continueBlock$26: boolean = true;
    hash_64605d94(handlers, (handlers: Handlers, returnValue$23: string) => {
      let continueBlock$27: boolean = true;
      done$21(handlers, [returnValue$25, returnValue$23]);
    });
  });
}), ["Hi0", "Hi1"]);

/*
provideIncrement#4ffa1f88<Array<string>>(
        v: "Hi",
        i: 0,
        fn: (): Array<string> ={Read#22024b72}> <string>[
            ...getStringArr#3bfdbd8c(),
            getString#64605d94(),
        ],
    ) 
    ==#0d35c408#553b4b8e#0 <string>["Hi0", "Hi1"]
*/
assertCall(hash_0d35c408.h553b4b8e_0, hash_4ffa1f88("Hi", 0, (handlers: Handlers, done$30: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_3bfdbd8c(handlers, (handlers: Handlers, returnValue$34: Array<string>) => {
    let continueBlock$35: boolean = true;
    hash_64605d94(handlers, (handlers: Handlers, returnValue$32: string) => {
      let continueBlock$36: boolean = true;
      done$30(handlers, [...returnValue$34, returnValue$32]);
    });
  });
}), ["Hi0", "Hi1"]);

/*
(): string ={Read#22024b72, Write#35f4b478}> {
    raise!(Write#35f4b478.write("hello"));
    getString#64605d94();
}
*/
(handlers: Handlers, done$37: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "35f4b478", 0, "hello", (handlers, value) => ((handlers: Handlers) => {
    hash_64605d94(handlers, (handlers: Handlers, returnValue$39: string) => done$37(handlers, returnValue$39));
  })(handlers, value));
};

/*
(): string ={Read#22024b72}> (getString#64605d94(), 1.0).0
*/
(handlers: Handlers, done$42: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$44: string) => {
    let continueBlock$45: boolean = true;
    done$42(handlers, [returnValue$44, 1][0]);
  });
};

/*
provideStringPlain#2dbf3eae<string>(v: "ok", fn: getPersonName#3b2dbacb) ==#606c7034#553b4b8e#0 "ok"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2dbf3eae("ok", hash_3b2dbacb), "ok");