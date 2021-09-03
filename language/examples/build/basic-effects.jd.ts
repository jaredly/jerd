import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle1da337a2 = [(arg_0: (arg_0: handle1da337a2, arg_1: string) => void) => void, (arg_0: string, arg_1: (arg_0: handle1da337a2) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];
type handle6ddb76fe = [(arg_0: number, arg_1: string, arg_2: (arg_0: handle6ddb76fe, arg_1: string) => void) => void];

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
const log#eccbfbca = (k#:0: string#builtin): void#builtin ={Log#35f4b478}> raise!(
    Log#35f4b478.log(k#:0),
)
(
    k#:0: string,
    handlers#:15000: nope type: effect-handler,
    done#:1: (nope type: effect-handler) => void,
): void => {
    TODO raise;
}
```
*/
export const hash_eccbfbca:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (k: string, handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "35f4b478", 0, k, (handlers, value) => done(handlers, value));
};

/**
```
const StringEq#da00b310 = Eq#51ea2a36<string#builtin>{"=="#51ea2a36#0: stringEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: stringEq}
```
*/
export const hash_da00b310: t_51ea2a36<string> = ({
  type: "51ea2a36",
  h51ea2a36_0: stringEq
} as t_51ea2a36<string>);

/**
```
const farther#dd523212 = (name#:0: string#builtin): string#builtin ={Stdio#1da337a2, Log#35f4b478}> {
    log#eccbfbca(k: "yes please " ++#builtin name#:0);
    raise!(Stdio#1da337a2.read());
}
(
    name#:0: string,
    handlers#:15000: nope type: effect-handler,
    done#:1: (nope type: effect-handler, string) => void,
): void => {
    log#🎁(
        ++("yes please ", name#:0),
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler): void => {
            TODO raise;
        },
    );
}
```
*/
export const hash_dd523212:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void, arg_3: Handlers, arg_4: (arg_0: Handlers, arg_1: string) => void) => void = (name: string, handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  hash_eccbfbca("yes please " + name, handlers, (handlers: Handlers) => {
    raise(handlers, "1da337a2", 0, null, (handlers, value) => done(handlers, value));
  });
};

/**
```
const rec handleMulti#fadf30b0 = (f#:0: () ={MultiArg#6ddb76fe}> string#builtin): string#builtin ={}> {
    handle! f#:0 {
        MultiArg.putTwo#0((num#:2, text#:3) => k#:4) => fadf30b0#self(
            (): string#builtin ={MultiArg#6ddb76fe}> k#:4(
                intToString#builtin(num#:2) ++#builtin ":" ++#builtin text#:3,
            ),
        ),
        pure(v#:1) => v#:1 ++#builtin ":ok",
    };
}
(f#:0: nope type: cps-lambda): string => {
    const result#:5: string;
    TODO Handle;
    return result#:5;
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
    result = hash_fadf30b0((handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
      k$4(intToString(num$2) + ":" + text$3, handlers, (handlers: Handlers, returnValue: string) => done$6(handlers, returnValue));
    });
  }], (handlers: Handlers, v$1: string) => {
    result = v$1 + ":ok";
  });
  return result;
};

/**
```
const letBind#12c25e9b = (): void#builtin ={Stdio#1da337a2, Log#35f4b478}> {
    const x#:0 = raise!(Stdio#1da337a2.read());
    log#eccbfbca(k: x#:0 ++#builtin "Hello");
}
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
    TODO raise;
}
```
*/
export const hash_12c25e9b:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void, arg_2: Handlers, arg_3: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, x: string) => {
    hash_eccbfbca(x + "Hello", handlers, (handlers: Handlers) => done(handlers));
  })(handlers, value));
};

/**
```
const rec respondWith#59070068 = (responseValue#:0: string#builtin): <T#:0>{e#:0}(
    fn: () ={Stdio#1da337a2, e#:0}> T#:0,
) ={Log#35f4b478, e#:0}> T#:0 ={}> <T#:0>{e#:0}(fn#:1: () ={Stdio#1da337a2, e#:0}> T#:0): T#:0 ={
    Log#35f4b478,
    e#:0,
}> {
    handle! fn#:1 {
        Stdio.read#0(() => k#:3) => 59070068#self(responseValue#:0 ++#builtin ".")<T#:0>{e#:0}(
            (): T#:0 ={Stdio#1da337a2, e#:0}> k#:3(responseValue#:0),
        ),
        Stdio.write#1((v#:4) => k#:5) => {
            log#eccbfbca(k: v#:4);
            59070068#self(responseValue#:0 ++#builtin "-")<T#:0>{e#:0}(
                (): T#:0 ={Stdio#1da337a2, e#:0}> k#:5(),
            );
        },
        pure(a#:2) => a#:2,
    };
}
(responseValue#:0: string): nope type: cps-lambda => <T>(
    fn#:1: nope type: cps-lambda,
    handlers#:15000: nope type: effect-handler,
    done#:6: (nope type: effect-handler, [var]T#:0) => void,
): void => {
    TODO Handle;
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
    hash_eccbfbca(v$4, handlers, (handlers: Handlers) => {
      hash_59070068(responseValue + "-")((handlers: Handlers, done$13: (arg_0: Handlers, arg_1: T_0) => void) => {
        k$5(handlers, (handlers: Handlers, returnValue$15: T_0) => done$13(handlers, returnValue$15));
      }, handlers, (handlers: Handlers, returnValue$16: T_0) => done$6(handlers, returnValue$16));
    });
  }], (handlers: Handlers, a$2: T_0) => {
    done$6(handlers, a$2);
  }, handlers);
};

/**
```
const raiseIf#bbce4e9c = (check#:0: string#builtin): string#builtin ={Stdio#1da337a2}> {
    if raise!(Stdio#1da337a2.read()) ==#da00b310#51ea2a36#0 check#:0 {
        raise!(Stdio#1da337a2.read());
    } else {
        "didn't raise";
    };
}
(
    check#:0: string,
    handlers#:15000: nope type: effect-handler,
    done#:3: (nope type: effect-handler, string) => void,
): void => {
    TODO raise;
}
```
*/
export const hash_bbce4e9c:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void, arg_3: Handlers, arg_4: (arg_0: Handlers, arg_1: string) => void) => void = (check: string, handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0: string) => {
    if (hash_da00b310.h51ea2a36_0(arg_lift_0, check)) {
      raise(handlers, "1da337a2", 0, null, (handlers, value) => done$3(handlers, value));
    } else {
      done$3(handlers, "didn't raise");
    }
  })(handlers, value));
};

/**
```
const maybeRaise#42c8a590 = (shouldRaise#:0: bool#builtin): string#builtin ={Stdio#1da337a2}> {
    if shouldRaise#:0 {
        raise!(Stdio#1da337a2.read());
    } else {
        "didn't raise";
    };
}
(
    shouldRaise#:0: bool,
    handlers#:15000: nope type: effect-handler,
    done#:1: (nope type: effect-handler, string) => void,
): void => {
    if shouldRaise#:0 {
        TODO raise;
    } else {
        done#:1(handlers#:15000, "didn't raise");
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
const inner#19effbea = (name#:0: string#builtin): void#builtin ={Stdio#1da337a2, Log#35f4b478}> {
    log#eccbfbca(k: farther#dd523212(name: "Folks") ++#builtin " from farther");
    log#eccbfbca(k: "getting");
    log#eccbfbca(k: name#:0);
    log#eccbfbca(
        k: raise!(Stdio#1da337a2.read()) ++#builtin " and " 
            ++#builtin raise!(Stdio#1da337a2.read()),
    );
    log#eccbfbca(k: "And then " ++#builtin raise!(Stdio#1da337a2.read()));
    log#eccbfbca(k: "Dones");
}
(
    name#:0: string,
    handlers#:15000: nope type: effect-handler,
    done#:9: (nope type: effect-handler) => void,
): void => {
    farther#🦒(
        "Folks",
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:17: string): void => {
            log#🎁(
                ++(returnValue#:17, " from farther"),
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler): void => {
                    log#🎁(
                        "getting",
                        handlers#:15000,
                        (handlers#:15000: nope type: effect-handler): void => {
                            log#🎁(
                                name#:0,
                                handlers#:15000,
                                (handlers#:15000: nope type: effect-handler): void => {
                                    TODO raise;
                                },
                            );
                        },
                    );
                },
            );
        },
    );
}
```
*/
export const hash_19effbea:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void, arg_3: Handlers, arg_4: (arg_0: Handlers) => void) => void = (name: string, handlers: Handlers, done$9: (arg_0: Handlers) => void) => {
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
const full#d649a85c = (): string#builtin ={}> {
    handleMulti#fadf30b0(
        f: (): string#builtin ={MultiArg#6ddb76fe}> raise!(MultiArg#6ddb76fe.putTwo(4, "five")),
    );
}
(): string => handleMulti#👐(
    (
        handlers#:15000: nope type: effect-handler,
        done#:1: (nope type: effect-handler, string) => void,
    ): void => {
        TODO raise;
    },
)
```
*/
export const hash_d649a85c: () => string = () => hash_fadf30b0((handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "6ddb76fe", 0, [4, "five"], (handlers, value) => done(handlers, value));
});

/**
```
const test4#60ecb87c = (): void#builtin ={Log#35f4b478}> {
    respondWith#59070068(responseValue: "<read>")<void#builtin>{Log#35f4b478}(letBind#12c25e9b);
}
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
    respondWith#😸🛀🧗‍♂️😃("<read>")<void>(
        letBind#🌭🤚👨‍🚒,
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:3: [var]T#:0): void => done#:1(
            handlers#:15000,
        ),
    );
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
const test3#114043d3 = (): void#builtin ={Log#35f4b478}> {
    log#eccbfbca(
        k: respondWith#59070068(responseValue: "<read>")<string#builtin>{Log#35f4b478}(
            (): string#builtin ={Stdio#1da337a2, Log#35f4b478}> raiseIf#bbce4e9c(check: "<read>"),
        ),
    );
}
(handlers#:15000: nope type: effect-handler, done#:2: (nope type: effect-handler) => void): void => {
    respondWith#😸🛀🧗‍♂️😃("<read>")<string>(
        (
            handlers#:15000: nope type: effect-handler,
            done#:5: (nope type: effect-handler, string) => void,
        ): void => {
            raiseIf#🥪(
                "<read>",
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:7: string): void => done#:5(
                    handlers#:15000,
                    returnValue#:7,
                ),
            );
        },
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:8: [var]T#:0): void => {
            log#🎁(
                returnValue#:8,
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler): void => done#:2(handlers#:15000),
            );
        },
    );
}
```
*/
export const hash_114043d3:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void, arg_2: Handlers, arg_3: (arg_0: Handlers) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers) => void) => {
  hash_59070068("<read>")((handlers: Handlers, done$5: (arg_0: Handlers, arg_1: string) => void) => {
    hash_bbce4e9c("<read>", handlers, (handlers: Handlers, returnValue$7: string) => done$5(handlers, returnValue$7));
  }, handlers, (handlers: Handlers, returnValue: T_0) => {
    hash_eccbfbca(returnValue, handlers, (handlers: Handlers) => done$2(handlers));
  });
};

/**
```
const test2#a145008c = (): void#builtin ={Log#35f4b478}> {
    respondWith#59070068(responseValue: "<read>")<void#builtin>{Log#35f4b478}(
        (): void#builtin ={Stdio#1da337a2, Log#35f4b478}> log#eccbfbca(
            k: maybeRaise#42c8a590(shouldRaise: true) 
                ++#builtin maybeRaise#42c8a590(shouldRaise: false),
        ),
    );
}
(handlers#:15000: nope type: effect-handler, done#:4: (nope type: effect-handler) => void): void => {
    respondWith#😸🛀🧗‍♂️😃("<read>")<void>(
        (handlers#:15000: nope type: effect-handler, done#:6: (nope type: effect-handler) => void): void => {
            maybeRaise#🧗‍♂️🦃😪😃(
                true,
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:11: string): void => {
                    maybeRaise#🧗‍♂️🦃😪😃(
                        false,
                        handlers#:15000,
                        (handlers#:15000: nope type: effect-handler, returnValue#:9: string): void => {
                            log#🎁(
                                ++(returnValue#:11, returnValue#:9),
                                handlers#:15000,
                                (handlers#:15000: nope type: effect-handler): void => done#:6(
                                    handlers#:15000,
                                ),
                            );
                        },
                    );
                },
            );
        },
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:12: [var]T#:0): void => done#:4(
            handlers#:15000,
        ),
    );
}
```
*/
export const hash_a145008c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void, arg_2: Handlers, arg_3: (arg_0: Handlers) => void) => void = (handlers: Handlers, done$4: (arg_0: Handlers) => void) => {
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
const rec collect#2ce3943a = {e#:0}(fn#:0: () ={Log#35f4b478, e#:0}> void#builtin): string#builtin ={
    e#:0,
}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            v#:2 ++#builtin "\n" 
                ++#builtin 2ce3943a#self{e#:0}((): void#builtin ={Log#35f4b478, e#:0}> k#:3());
        },
        pure(a#:1) => "end",
    };
}
TODO effectful or direct lambda
```
*/
export const hash_2ce3943a: any = {
  effectful: (fn$13:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void, handlers: Handlers, done$14: (arg_0: Handlers, arg_1: string) => void) => {
    handleSimpleShallow2<any, any, any>("35f4b478", fn$13, [(handlers, v$15: string, k$16:
    /*from cps lambda*/
    (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
      hash_2ce3943a.effectful((handlers: Handlers, done$18: (arg_0: Handlers) => void) => {
        k$16(handlers, (handlers: Handlers) => done$18(handlers));
      }, handlers, (handlers: Handlers, returnValue$19: string) => {
        done$14(handlers, v$15 + "\n" + returnValue$19);
      });
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
      result = v$2 + "\n" + hash_2ce3943a.direct((handlers: Handlers, done$6: (arg_0: Handlers) => void) => {
        k$3(handlers, (handlers: Handlers) => done$6(handlers));
      });
    }], (handlers: Handlers, a$1: void) => {
      result = "end";
    });
    return result;
  }
};

/**
```
const rec collectNew#4465c66a = (fn#:0: () ={Log#35f4b478}> void#builtin): string#builtin ={}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            v#:2 ++#builtin "\n" ++#builtin 4465c66a#self((): void#builtin ={Log#35f4b478}> k#:3());
        },
        pure(a#:1) => "end",
    };
}
(fn#:0: nope type: cps-lambda): string => {
    const result#:4: string;
    TODO Handle;
    return result#:4;
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
    result$4 = v$2 + "\n" + hash_4465c66a((handlers: Handlers, done$5: (arg_0: Handlers) => void) => {
      k$3(handlers, (handlers: Handlers) => done$5(handlers));
    });
  }], (handlers: Handlers, a$1: void) => {
    result$4 = "end";
  });
  return result$4;
};

/**
```
const test1#22486482 = (): void#builtin ={Log#35f4b478}> {
    respondWith#59070068(responseValue: "<read>")<void#builtin>{Log#35f4b478}(
        (): void#builtin ={Stdio#1da337a2, Log#35f4b478}> inner#19effbea(name: "Yes"),
    );
}
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
    respondWith#😸🛀🧗‍♂️😃("<read>")<void>(
        (handlers#:15000: nope type: effect-handler, done#:3: (nope type: effect-handler) => void): void => {
            inner#🤿♣️🚣‍♀️(
                "Yes",
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler): void => done#:3(handlers#:15000),
            );
        },
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:5: [var]T#:0): void => done#:1(
            handlers#:15000,
        ),
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
collectNew#🍁🚶😳😃
*/
hash_4465c66a;

/*
collect#2ce3943a{}(fn: test1#22486482) 
    ==#da00b310#51ea2a36#0 "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    get effectful or direct TODO(test1#💚🐹🦦),
    "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_2ce3943a.direct(hash_22486482), "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend");

/*
collect#2ce3943a{}(fn: test2#a145008c) ==#da00b310#51ea2a36#0 "<read>didn't raise\nend"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    get effectful or direct TODO(test2#💦),
    "<read>didn't raise\nend",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_2ce3943a.direct(hash_a145008c), "<read>didn't raise\nend");

/*
collect#2ce3943a{}(fn: test3#114043d3) ==#da00b310#51ea2a36#0 "<read>.\nend"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    get effectful or direct TODO(test3#🥉😘👨‍🏭),
    "<read>.\nend",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_2ce3943a.direct(hash_114043d3), "<read>.\nend");

/*
collect#2ce3943a{}(fn: test4#60ecb87c) ==#da00b310#51ea2a36#0 "<read>Hello\nend"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    get effectful or direct TODO(test4#💟🚝🐐😃),
    "<read>Hello\nend",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_2ce3943a.direct(hash_60ecb87c), "<read>Hello\nend");

/*
full#d649a85c() ==#da00b310#51ea2a36#0 "4:five:ok"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, full#👿(), "4:five:ok")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_d649a85c(), "4:five:ok");