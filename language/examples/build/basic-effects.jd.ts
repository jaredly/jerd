import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle1da337a2 = [(arg_0: (arg_0: handle1da337a2, arg_1: string) => void) => void, (arg_0: string, arg_1: (arg_0: handle1da337a2) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];
type handle6ddb76fe = [(arg_0: number, arg_1: string, arg_2: (arg_0: handle6ddb76fe, arg_1: string) => void) => void];

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
const log#eccbfbca = (k#:0: string): void ={Log#35f4b478}> raise!(Log#35f4b478.log(k#:0))
```
*/
export const hash_eccbfbca:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (k: string, handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "35f4b478", 0, k, (handlers, value) => done(handlers, value));
};

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
const farther#dd523212 = (name#:0: string): string ={Stdio#1da337a2, Log#35f4b478}> {
    log#eccbfbca(("yes please " ++ name#:0));
    raise!(Stdio#1da337a2.read());
}
```
*/
export const hash_dd523212:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void = (name: string, handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  hash_eccbfbca("yes please " + name, handlers, (handlers: Handlers) => {
    raise(handlers, "1da337a2", 0, null, (handlers, value) => done(handlers, value));
  });
};

/**
```
const handleMulti#fadf30b0 = (f#:0: () ={MultiArg#6ddb76fe}> string): string ={}> {
    handle! f#:0 {
        MultiArg.putTwo#0((num#:2, text#:3) => k#:4) => fadf30b0#self(
            (): string ={MultiArg#6ddb76fe}> k#:4(((intToString(num#:2) ++ ":") ++ text#:3)),
        ),
        pure(v#:1) => (v#:1 ++ ":ok"),
    };
}
```
*/
export const hash_fadf30b0: (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (f:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result: string = (null as any);
  handleSimpleShallow2<any, any, any>("6ddb76fe", f, [(handlers, [num$2, text$3], k$4:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result = (() => hash_fadf30b0((handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
      k$4(intToString(num$2) + ":" + text$3, handlers, (handlers: Handlers, returnValue: string) => done$6(handlers, returnValue));
    }))();
  }], (handlers: Handlers, v$1: string) => {
    result = (() => v$1 + ":ok")();
  });
  return result;
};

/**
```
const letBind#12c25e9b = (): void ={Stdio#1da337a2, Log#35f4b478}> {
    const x#:0 = raise!(Stdio#1da337a2.read());
    log#eccbfbca((x#:0 ++ "Hello"));
}
```
*/
export const hash_12c25e9b:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, x: string) => {
    hash_eccbfbca(x + "Hello", handlers, (handlers: Handlers) => done(handlers));
  })(handlers, value));
};

/**
```
const respondWith#59070068 = (responseValue#:0: string): <T#:0>{e#:0}(
    () ={Stdio#1da337a2, e#:0}> T#:0,
) ={Log#35f4b478, e#:0}> T#:0 ={}> <T#:0>{e#:0}(fn#:1: () ={Stdio#1da337a2, e#:0}> T#:0): T#:0 ={
    Log#35f4b478,
    e#:0,
}> {
    handle! fn#:1 {
        Stdio.read#0(() => k#:3) => 59070068#self((responseValue#:0 ++ "."))<T#:0>{e#:0}(
            (): T#:0 ={Stdio#1da337a2, e#:0}> k#:3(responseValue#:0),
        ),
        Stdio.write#1((v#:4) => k#:5) => {
            log#eccbfbca(v#:4);
            59070068#self((responseValue#:0 ++ "-"))<T#:0>{e#:0}(
                (): T#:0 ={Stdio#1da337a2, e#:0}> k#:5(),
            );
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void = (responseValue: string) => <T_0>(fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, handlers: Handlers, done$6: (arg_0: Handlers, arg_1: T_0) => void) => {
  handleSimpleShallow2<any, any, any>("1da337a2", fn, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    hash_59070068(responseValue + ".")((handlers: Handlers, done$8: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(responseValue, handlers, (handlers: Handlers, returnValue$10: T_0) => done$8(handlers, returnValue$10));
    }, handlers, (handlers: Handlers, returnValue$11: T_0) => done$6(handlers, returnValue$11));
  }, (handlers, v$4: string, k$5:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    hash_eccbfbca(v$4, handlers, (handlers: Handlers) => ((handlers: Handlers) => {
      hash_59070068(responseValue + "-")((handlers: Handlers, done$13: (arg_0: Handlers, arg_1: T_0) => void) => {
        k$5(handlers, (handlers: Handlers, returnValue$15: T_0) => done$13(handlers, returnValue$15));
      }, handlers, (handlers: Handlers, returnValue$16: T_0) => done$6(handlers, returnValue$16));
    })(handlers));
  }], (handlers: Handlers, a$2: T_0) => {
    done$6(handlers, a$2);
  }, handlers);
};

/**
```
const raiseIf#fce40b70 = (check#:0: string): string ={Stdio#1da337a2}> {
    if (raise!(Stdio#1da337a2.read()) ==#606c7034#553b4b8e#0 check#:0) {
        raise!(Stdio#1da337a2.read());
    } else {
        "didn't raise";
    };
}
```
*/
export const hash_fce40b70:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void = (check: string, handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0: string) => {
    if (hash_606c7034.h553b4b8e_0(arg_lift_0, check)) {
      raise(handlers, "1da337a2", 0, null, (handlers, value) => done$3(handlers, value));
    } else {
      done$3(handlers, "didn't raise");
    }
  })(handlers, value));
};

/**
```
const maybeRaise#42c8a590 = (shouldRaise#:0: bool): string ={Stdio#1da337a2}> {
    if shouldRaise#:0 {
        raise!(Stdio#1da337a2.read());
    } else {
        "didn't raise";
    };
}
```
*/
export const hash_42c8a590:
/*from cps lambda*/
(arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void = (shouldRaise: boolean, handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  if (shouldRaise) {
    raise(handlers, "1da337a2", 0, null, (handlers, value) => done(handlers, value));
  } else {
    done(handlers, "didn't raise");
  }
};

/**
```
const inner#19effbea = (name#:0: string): void ={Stdio#1da337a2, Log#35f4b478}> {
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
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (name: string, handlers: Handlers, done$9: (arg_0: Handlers) => void) => {
  hash_dd523212("Folks", handlers, (handlers: Handlers, returnValue$17: string) => {
    hash_eccbfbca(returnValue$17 + " from farther", handlers, (handlers: Handlers) => {
      hash_eccbfbca("getting", handlers, (handlers: Handlers) => {
        hash_eccbfbca(name, handlers, (handlers: Handlers) => {
          raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0$6: string) => {
            raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_1: string) => {
              hash_eccbfbca(arg_lift_0$6 + " and " + arg_lift_1, handlers, (handlers: Handlers) => {
                raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_1$8: string) => {
                  hash_eccbfbca("And then " + arg_lift_1$8, handlers, (handlers: Handlers) => {
                    hash_eccbfbca("Dones", handlers, (handlers: Handlers) => done$9(handlers));
                  });
                })(handlers, value));
              });
            })(handlers, value));
          })(handlers, value));
        });
      });
    });
  });
};

/**
```
const full#d649a85c = (): string ={}> {
    handleMulti#fadf30b0(
        (): string ={MultiArg#6ddb76fe}> raise!(MultiArg#6ddb76fe.putTwo(4, "five")),
    );
}
```
*/
export const hash_d649a85c: () => string = () => hash_fadf30b0((handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "6ddb76fe", 0, [4, "five"], (handlers, value) => done(handlers, value));
});

/**
```
const test4#60ecb87c = (): void ={Log#35f4b478}> {
    respondWith#59070068("<read>")<void>{Log#35f4b478}(letBind#12c25e9b);
}
```
*/
export const hash_60ecb87c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  hash_59070068("<read>")(hash_12c25e9b, handlers, (handlers: Handlers, returnValue$3: T_0) => done(handlers));
};

/**
```
const test3#1e213df0 = (): void ={Log#35f4b478}> {
    log#eccbfbca(
        respondWith#59070068("<read>")<string>{Log#35f4b478}(
            (): string ={Stdio#1da337a2, Log#35f4b478}> raiseIf#fce40b70("<read>"),
        ),
    );
}
```
*/
export const hash_1e213df0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers) => void) => {
  hash_59070068("<read>")((handlers: Handlers, done$5: (arg_0: Handlers, arg_1: string) => void) => {
    hash_fce40b70("<read>", handlers, (handlers: Handlers, returnValue$7: string) => done$5(handlers, returnValue$7));
  }, handlers, (handlers: Handlers, returnValue: T_0) => {
    hash_eccbfbca(returnValue, handlers, (handlers: Handlers) => done$2(handlers));
  });
};

/**
```
const test2#a145008c = (): void ={Log#35f4b478}> {
    respondWith#59070068("<read>")<void>{Log#35f4b478}(
        (): void ={Stdio#1da337a2, Log#35f4b478}> log#eccbfbca(
            (maybeRaise#42c8a590(true) ++ maybeRaise#42c8a590(false)),
        ),
    );
}
```
*/
export const hash_a145008c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done$4: (arg_0: Handlers) => void) => {
  hash_59070068("<read>")((handlers: Handlers, done$6: (arg_0: Handlers) => void) => {
    hash_42c8a590(true, handlers, (handlers: Handlers, returnValue$11: string) => {
      hash_42c8a590(false, handlers, (handlers: Handlers, returnValue$9: string) => {
        hash_eccbfbca(returnValue$11 + returnValue$9, handlers, (handlers: Handlers) => done$6(handlers));
      });
    });
  }, handlers, (handlers: Handlers, returnValue$12: T_0) => done$4(handlers));
};

/**
```
const collect#2ce3943a = {e#:0}(fn#:0: () ={Log#35f4b478, e#:0}> void): string ={e#:0}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            ((v#:2 ++ "\n") ++ 2ce3943a#self{e#:0}((): void ={Log#35f4b478, e#:0}> k#:3()));
        },
        pure(a#:1) => "end",
    };
}
```
*/
export const hash_2ce3943a: any = {
  effectful: (fn$13:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void, handlers: Handlers, done$14: (arg_0: Handlers, arg_1: string) => void) => {
    handleSimpleShallow2<any, any, any>("35f4b478", fn$13, [(handlers, v$15: string, k$16:
    /*from cps lambda*/
    (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
      (() => {
        hash_2ce3943a.effectful((handlers: Handlers, done$18: (arg_0: Handlers) => void) => {
          k$16(handlers, (handlers: Handlers) => done$18(handlers));
        }, handlers, (handlers: Handlers, returnValue$19: string) => ((handlers: Handlers, arg_lift_1$20: string) => ((handlers: Handlers) => {
          done$14(handlers, v$15 + "\n" + arg_lift_1$20);
        })(handlers))(handlers, returnValue$19));
      })();
    }], (handlers: Handlers, a$17: void) => {
      done$14(handlers, "end");
    }, handlers);
  },
  direct: (fn$0:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
    let result: string = (null as any);
    handleSimpleShallow2<any, any, any>("35f4b478", fn$0, [(handlers, v$2: string, k$3:
    /*from cps lambda*/
    (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
      result = (() => v$2 + "\n" + hash_2ce3943a.direct((handlers: Handlers, done$6: (arg_0: Handlers) => void) => {
        k$3(handlers, (handlers: Handlers) => done$6(handlers));
      }))();
    }], (handlers: Handlers, a$1: void) => {
      result = (() => "end")();
    });
    return result;
  }
};

/**
```
const collectNew#4465c66a = (fn#:0: () ={Log#35f4b478}> void): string ={}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            ((v#:2 ++ "\n") ++ 4465c66a#self((): void ={Log#35f4b478}> k#:3()));
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
  handleSimpleShallow2<any, any, any>("35f4b478", fn$0, [(handlers, v$2: string, k$3:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
    result$4 = (() => v$2 + "\n" + hash_4465c66a((handlers: Handlers, done$5: (arg_0: Handlers) => void) => {
      k$3(handlers, (handlers: Handlers) => done$5(handlers));
    }))();
  }], (handlers: Handlers, a$1: void) => {
    result$4 = (() => "end")();
  });
  return result$4;
};

/**
```
const test1#22486482 = (): void ={Log#35f4b478}> {
    respondWith#59070068("<read>")<void>{Log#35f4b478}(
        (): void ={Stdio#1da337a2, Log#35f4b478}> inner#19effbea("Yes"),
    );
}
```
*/
export const hash_22486482:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  hash_59070068("<read>")((handlers: Handlers, done$3: (arg_0: Handlers) => void) => {
    hash_19effbea("Yes", handlers, (handlers: Handlers) => done$3(handlers));
  }, handlers, (handlers: Handlers, returnValue$5: T_0) => done(handlers));
};

/*
collectNew#4465c66a
*/
hash_4465c66a;

/*
(collect#2ce3943a{}(test1#22486482) ==#606c7034#553b4b8e#0 "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct(hash_22486482), "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend");

/*
(collect#2ce3943a{}(test2#a145008c) ==#606c7034#553b4b8e#0 "<read>didn't raise\nend")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct(hash_a145008c), "<read>didn't raise\nend");

/*
(collect#2ce3943a{}(test3#1e213df0) ==#606c7034#553b4b8e#0 "<read>.\nend")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct(hash_1e213df0), "<read>.\nend");

/*
(collect#2ce3943a{}(test4#60ecb87c) ==#606c7034#553b4b8e#0 "<read>Hello\nend")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct(hash_60ecb87c), "<read>Hello\nend");

/*
(full#d649a85c() ==#606c7034#553b4b8e#0 "4:five:ok")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_d649a85c(), "4:five:ok");