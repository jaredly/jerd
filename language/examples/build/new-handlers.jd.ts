import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];
type handle1da337a2 = [(arg_0: (arg_0: handle1da337a2, arg_1: string) => void) => void, (arg_0: string, arg_1: (arg_0: handle1da337a2) => void) => void];

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
const log#eccbfbca: (string) ={Log#35f4b478}> void = (k#:0: string) ={Log#35f4b478}> raise!(
    Log#35f4b478.log(k#:0),
)
```
*/
export const hash_eccbfbca:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (k$0: string, handlers$15000: Handlers, done$1: (arg_0: Handlers) => void) => {
  raise(handlers$15000, "35f4b478", 0, k$0, (handlers$15000, value) => done$1(handlers$15000, value));
};

/**
```
const farther#dd523212: (string) ={Stdio#1da337a2, Log#35f4b478}> string = (name#:0: string) ={
    Stdio#1da337a2,
    Log#35f4b478,
}> {
    log#eccbfbca(("yes please " ++ name#:0));
    raise!(Stdio#1da337a2.read());
}
```
*/
export const hash_dd523212:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void = (name$0: string, handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  hash_eccbfbca("yes please " + name$0, handlers$15000, (handlers$15000: Handlers) => raise(handlers$15000, "1da337a2", 0, null, (handlers$15000, value) => done$1(handlers$15000, value)));
};

/**
```
const inner#19effbea: (string) ={Stdio#1da337a2, Log#35f4b478}> void = (name#:0: string) ={
    Stdio#1da337a2,
    Log#35f4b478,
}> {
    log#eccbfbca((farther#dd523212("Folks") ++ " from farther"));
    log#eccbfbca("getting");
    log#eccbfbca(name#:0);
    log#eccbfbca(((raise!(Stdio#1da337a2.read()) ++ " and ") ++ raise!(Stdio#1da337a2.read())));
    log#eccbfbca(("And then " ++ raise!(Stdio#1da337a2.read())));
    log#eccbfbca("Dones");
}
```
*/
export const hash_19effbea:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (name$0: string, handlers$15000: Handlers, done$9: (arg_0: Handlers) => void) => {
  hash_dd523212("Folks", handlers$15000, (handlers$15000: Handlers, returnValue$17: string) => hash_eccbfbca(returnValue$17 + " from farther", handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca("getting", handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca(name$0, handlers$15000, (handlers$15000: Handlers) => raise(handlers$15000, "1da337a2", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_0$6: string) => raise(handlers$15000, "1da337a2", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_1$5: string) => hash_eccbfbca(arg_lift_0$6 + " and " + arg_lift_1$5, handlers$15000, (handlers$15000: Handlers) => raise(handlers$15000, "1da337a2", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_1$8: string) => hash_eccbfbca("And then " + arg_lift_1$8, handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca("Dones", handlers$15000, (handlers$15000: Handlers) => done$9(handlers$15000))))(handlers$15000, value))))(handlers$15000, value)))(handlers$15000, value))))));
};

/**
```
const respondWith#59070068: (string) ={}> <T#:0>{e#:0}(() ={Stdio#1da337a2, e#:0}> T#:0) ={
    Log#35f4b478,
    e#:0,
}> T#:0 = (responseValue#:0: string) ={}> <T#:0>{e#:0}(fn#:1: () ={Stdio#1da337a2, e#:0}> T#:0) ={
    Log#35f4b478,
    e#:0,
}> {
    handle! fn#:1 {
        Stdio.read#0(() => k#:3) => 59070068((responseValue#:0 ++ "."))<T#:0>{e#:0}(
            () ={Stdio#1da337a2, e#:0}> k#:3(responseValue#:0),
        ),
        Stdio.write#1((v#:4) => k#:5) => {
            log#eccbfbca(v#:4);
            59070068((responseValue#:0 ++ "-"))<T#:0>{e#:0}(() ={Stdio#1da337a2, e#:0}> k#:5());
        },
        pure(a#:2) => a#:2,
    };
}
```
*/
export const hash_59070068: (arg_0: string) =>
/*from cps lambda*/
<T_0>(arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void = (responseValue$0: string) => <T_0>(fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, handlers$15000: Handlers, done$6: (arg_0: Handlers, arg_1: T_0) => void) => {
  handleSimpleShallow2<any, any, any>("1da337a2", fn$1, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    hash_59070068(responseValue$0 + ".")((handlers$15000: Handlers, done$8: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(responseValue$0, handlers$15000, (handlers$15000: Handlers, returnValue$10: T_0) => done$8(handlers$15000, returnValue$10));
    }, handlers$15000, (handlers$15000: Handlers, returnValue$11: T_0) => done$6(handlers$15000, returnValue$11));
  }, (handlers$15000, v$4: string, k$5:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    hash_eccbfbca(v$4, handlers$15000, (handlers$15000: Handlers) => hash_59070068(responseValue$0 + "-")((handlers$15000: Handlers, done$13: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$5(handlers$15000, (handlers$15000: Handlers, returnValue$15: T_0) => done$13(handlers$15000, returnValue$15));
    }, handlers$15000, (handlers$15000: Handlers, returnValue$16: T_0) => done$6(handlers$15000, returnValue$16)));
  }], (handlers$15000: Handlers, a$2: T_0) => {
    done$6(handlers$15000, a$2);
  }, handlers$15000);
};

/**
```
const collect#2ce3943a: {e#:0}(() ={Log#35f4b478, e#:0}> void) ={e#:0}> string = {e#:0}(
    fn#:0: () ={Log#35f4b478, e#:0}> void,
) ={e#:0}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            ((v#:2 ++ "\n") ++ 2ce3943a{e#:0}(() ={Log#35f4b478, e#:0}> k#:3()));
        },
        pure(a#:1) => "end",
    };
}
```
*/
export const hash_2ce3943a: any = {
  effectful: (fn$13:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void, handlers$15000: Handlers, done$14: (arg_0: Handlers, arg_1: string) => void) => {
    handleSimpleShallow2<any, any, any>("35f4b478", fn$13, [(handlers$15000, v$15: string, k$16:
    /*from cps lambda*/
    (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
      hash_2ce3943a.effectful((handlers$15000: Handlers, done$18: (arg_0: Handlers) => void) => {
        k$16(handlers$15000, (handlers$15000: Handlers) => done$18(handlers$15000));
      }, handlers$15000, (handlers$15000: Handlers, returnValue$19: string) => done$14(handlers$15000, v$15 + "\n" + returnValue$19));
    }], (handlers$15000: Handlers, a$17: void) => {
      done$14(handlers$15000, "end");
    }, handlers$15000);
  },
  direct: (fn$0:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
    let result$5: string = (null as any);
    handleSimpleShallow2<any, any, any>("35f4b478", fn$0, [(handlers$15000, v$2: string, k$3:
    /*from cps lambda*/
    (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
      let lambdaBlockResult$21: string;
      lambdaBlockResult$21 = v$2 + "\n" + hash_2ce3943a.direct((handlers$15000: Handlers, done$6: (arg_0: Handlers) => void) => {
        k$3(handlers$15000, (handlers$15000: Handlers) => done$6(handlers$15000));
      });
      result$5 = lambdaBlockResult$21;
    }], (handlers$15000: Handlers, a$1: void) => {
      result$5 = "end";
    });
    return result$5;
  }
};

/**
```
const appendLog#0ea0eb0a: (() ={Log#35f4b478}> string) ={}> string = (
    fn#:0: () ={Log#35f4b478}> string,
) ={}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            ((v#:2 ++ "\n") ++ 0ea0eb0a(() ={Log#35f4b478}> k#:3()));
        },
        pure(a#:1) => a#:1,
    };
}
```
*/
export const hash_0ea0eb0a: (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result$4: string = (null as any);
  handleSimpleShallow2<any, any, any>("35f4b478", fn$0, [(handlers$15000, v$2: string, k$3:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result$4 = v$2 + "\n" + hash_0ea0eb0a((handlers$15000: Handlers, done$5: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(handlers$15000, (handlers$15000: Handlers, returnValue$7: string) => done$5(handlers$15000, returnValue$7));
    });
  }], (handlers$15000: Handlers, a$1: string) => {
    result$4 = a$1;
  });
  return result$4;
};

/**
```
const provide#5c316d50: <T#:0>(string, () ={Read#22024b72}> T#:0) ={}> T#:0 = <T#:0>(
    v#:0: string,
    fn#:1: () ={Read#22024b72}> T#:0,
) ={}> {
    handle! fn#:1 {
        Read.read#0(() => k#:3) => {
            5c316d50<T#:0>((("<" + v#:0) + ">"), () ={Read#22024b72}> k#:3(v#:0));
        },
        pure(a#:2) => a#:2,
    };
}
```
*/
export const hash_5c316d50: <T_0>(arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(v$0: string, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$4: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = hash_5c316d50("<" + v$0 + ">", (handlers$15000: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(v$0, handlers$15000, (handlers$15000: Handlers, returnValue$7: T_0) => done$5(handlers$15000, returnValue$7));
    });
  }], (handlers$15000: Handlers, a$2: T_0) => {
    result$4 = a$2;
  });
  return result$4;
};

/**
```
const collectNew#4465c66a: (() ={Log#35f4b478}> void) ={}> string = (
    fn#:0: () ={Log#35f4b478}> void,
) ={}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            ((v#:2 ++ "\n") ++ 4465c66a(() ={Log#35f4b478}> k#:3()));
        },
        pure(a#:1) => "end",
    };
}
```
*/
export const hash_4465c66a: (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => string = (fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
  let result$4: string = (null as any);
  handleSimpleShallow2<any, any, any>("35f4b478", fn$0, [(handlers$15000, v$2: string, k$3:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
    result$4 = v$2 + "\n" + hash_4465c66a((handlers$15000: Handlers, done$5: (arg_0: Handlers) => void) => {
      k$3(handlers$15000, (handlers$15000: Handlers) => done$5(handlers$15000));
    });
  }], (handlers$15000: Handlers, a$1: void) => {
    result$4 = "end";
  });
  return result$4;
};

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
const test1#22486482: () ={Log#35f4b478}> void = () ={Log#35f4b478}> {
    respondWith#59070068("<read>")<void>{Log#35f4b478}(
        () ={Stdio#1da337a2, Log#35f4b478}> inner#19effbea("Yes"),
    );
}
```
*/
export const hash_22486482:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers) => void) => {
  hash_59070068("<read>")((handlers$15000: Handlers, done$3: (arg_0: Handlers) => void) => {
    hash_19effbea("Yes", handlers$15000, (handlers$15000: Handlers) => done$3(handlers$15000));
  }, handlers$15000, (handlers$15000: Handlers, returnValue$5: T_0) => done$1(handlers$15000));
};

/*
StringEq#606c7034."=="#553b4b8e#0(
    collectNew#4465c66a(
        () ={Log#35f4b478}> {
            raise!(Log#35f4b478.log("Hello"));
            raise!(Log#35f4b478.log("Folks"));
        },
    ),
    "Hello\nFolks\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_4465c66a((handlers$15000: Handlers, done$6: (arg_0: Handlers) => void) => {
  raise(handlers$15000, "35f4b478", 0, "Hello", (handlers$15000, value) => ((handlers$15000: Handlers) => {
    raise(handlers$15000, "35f4b478", 0, "Folks", (handlers$15000, value) => done$6(handlers$15000, value));
  })(handlers$15000, value));
}), "Hello\nFolks\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provide#5c316d50<string>("Hello", () ={Read#22024b72}> raise!(Read#22024b72.read())),
    "Hello",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5c316d50("Hello", (handlers$15000: Handlers, done$7: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => done$7(handlers$15000, value));
}), "Hello");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provide#5c316d50<string>(
        "Hello",
        () ={Read#22024b72}> (raise!(Read#22024b72.read()) + raise!(Read#22024b72.read())),
    ),
    "Hello<Hello>",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5c316d50("Hello", (handlers$15000: Handlers, done$10: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_0$8: string) => raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_1$9: string) => done$10(handlers$15000, arg_lift_0$8 + arg_lift_1$9))(handlers$15000, value)))(handlers$15000, value));
}), "Hello<Hello>");

/*
StringEq#606c7034."=="#553b4b8e#0(
    appendLog#0ea0eb0a(
        () ={Log#35f4b478}> {
            raise!(Log#35f4b478.log("Hello"));
            raise!(Log#35f4b478.log("Folks"));
            "Final value";
        },
    ),
    "Hello\nFolks\nFinal value",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0ea0eb0a((handlers$15000: Handlers, done$11: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers$15000, "35f4b478", 0, "Hello", (handlers$15000, value) => ((handlers$15000: Handlers) => {
    raise(handlers$15000, "35f4b478", 0, "Folks", (handlers$15000, value) => ((handlers$15000: Handlers) => {
      done$11(handlers$15000, "Final value");
    })(handlers$15000, value));
  })(handlers$15000, value));
}), "Hello\nFolks\nFinal value");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(() ={Log#35f4b478}> raise!(Log#35f4b478.log("Good news"))),
    "Good news\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$12: (arg_0: Handlers) => void) => {
  raise(handlers$15000, "35f4b478", 0, "Good news", (handlers$15000, value) => done$12(handlers$15000, value));
}), "Good news\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    provide#5c316d50<string>(
        "Folks",
        () ={Read#22024b72}> collect#2ce3943a{Read#22024b72}(
            () ={Read#22024b72, Log#35f4b478}> raise!(
                Log#35f4b478.log(("Good news " + raise!(Read#22024b72.read()))),
            ),
        ),
    ),
    "Good news Folks\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5c316d50("Folks", (handlers$15000: Handlers, done$15: (arg_0: Handlers, arg_1: string) => void) => {
  hash_2ce3943a.effectful((handlers$15000: Handlers, done$17: (arg_0: Handlers) => void) => {
    raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_1$14: string) => raise(handlers$15000, "35f4b478", 0, "Good news " + arg_lift_1$14, (handlers$15000, value) => done$17(handlers$15000, value)))(handlers$15000, value));
  }, handlers$15000, (handlers$15000: Handlers, returnValue$18: string) => done$15(handlers$15000, returnValue$18));
}), "Good news Folks\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(test1#22486482),
    "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct(hash_22486482), "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend");