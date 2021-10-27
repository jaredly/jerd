import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle1da337a2 = [(arg_0: (arg_0: handle1da337a2, arg_1: string) => void) => void, (arg_0: string, arg_1: (arg_0: handle1da337a2) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];
type handle6ddb76fe = [(arg_0: number, arg_1: string, arg_2: (arg_0: handle6ddb76fe, arg_1: string) => void) => void];

/**
```
@unique(0.5383562320075749) type Eq#2f333afa<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_2f333afa<T> = {
  type: "2f333afa";
  h2f333afa_0: (arg_0: T, arg_1: T) => boolean;
};

/**
```
const log#307f5538 = (k#:0: string#builtin): void#builtin ={Log#35f4b478}> raise!(
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
export const hash_307f5538:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (k: string, handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "35f4b478", 0, k, (handlers, value) => done(handlers, value));
};

/**
```
const StringEq#8a86d00e = Eq#2f333afa<string#builtin>{"=="#2f333afa#0: stringEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: stringEq}
```
*/
export const hash_8a86d00e: t_2f333afa<string> = ({
  type: "2f333afa",
  h2f333afa_0: stringEq
} as t_2f333afa<string>);

/**
```
const farther#03ccaa7c = (name#:0: string#builtin): string#builtin ={Stdio#1da337a2, Log#35f4b478}> {
    log#307f5538(k: "yes please " ++#builtin name#:0);
    raise!(Stdio#1da337a2.read());
}
(
    name#:0: string,
    handlers#:15000: nope type: effect-handler,
    done#:1: (nope type: effect-handler, string) => void,
): void => {
    log#👷‍♂️⚾🏫(
        ++("yes please ", name#:0),
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler): void => {
            TODO raise;
        },
    );
}
```
*/
export const hash_03ccaa7c:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void, arg_3: Handlers, arg_4: (arg_0: Handlers, arg_1: string) => void) => void = (name: string, handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  hash_307f5538("yes please " + name, handlers, (handlers: Handlers) => {
    raise(handlers, "1da337a2", 0, null, (handlers, value) => done(handlers, value));
  });
};

/**
```
const rec handleMulti#28e499bc = (f#:0: () ={MultiArg#6ddb76fe}> string#builtin): string#builtin ={}> {
    handle! f#:0 {
        MultiArg.putTwo#0((num#:2, text#:3) => k#:4) => 28e499bc#self(
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
export const hash_28e499bc: (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (f:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result: string = (null as any);
  handleSimpleShallow2<any, any, any>("6ddb76fe", f, [(handlers, [num$2, text$3], k$4:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result = hash_28e499bc((handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
      k$4(intToString(num$2) + ":" + text$3, handlers, (handlers: Handlers, returnValue: string) => done$6(handlers, returnValue));
    });
  }], (handlers: Handlers, v$1: string) => {
    result = v$1 + ":ok";
  });
  return result;
};

/**
```
const letBind#501bcf28 = (): void#builtin ={Stdio#1da337a2, Log#35f4b478}> {
    const x#:0 = raise!(Stdio#1da337a2.read());
    log#307f5538(k: x#:0 ++#builtin "Hello");
}
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
    TODO raise;
}
```
*/
export const hash_501bcf28:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void, arg_2: Handlers, arg_3: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, x: string) => {
    hash_307f5538(x + "Hello", handlers, (handlers: Handlers) => done(handlers));
  })(handlers, value));
};

/**
```
const rec respondWith#b713e798 = (responseValue#:0: string#builtin): <T#:0>{e#:0}(
    fn: () ={Stdio#1da337a2, e#:0}> T#:0,
) ={Log#35f4b478, e#:0}> T#:0 ={}> <T#:0>{e#:0}(fn#:1: () ={Stdio#1da337a2, e#:0}> T#:0): T#:0 ={
    Log#35f4b478,
    e#:0,
}> {
    handle! fn#:1 {
        Stdio.read#0(() => k#:3) => b713e798#self(responseValue#:0 ++#builtin ".")<T#:0>{e#:0}(
            (): T#:0 ={Stdio#1da337a2, e#:0}> k#:3(responseValue#:0),
        ),
        Stdio.write#1((v#:4) => k#:5) => {
            log#307f5538(k: v#:4);
            b713e798#self(responseValue#:0 ++#builtin "-")<T#:0>{e#:0}(
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
export const hash_b713e798: (arg_0: string) =>
/*from cps lambda*/
<T>(arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T) => void) => void, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T) => void) => void = (responseValue: string) => <T>(fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T) => void) => void, handlers: Handlers, done$6: (arg_0: Handlers, arg_1: T) => void) => {
  handleSimpleShallow2<any, any, any>("1da337a2", fn, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T) => void) => void) => {
    hash_b713e798(responseValue + ".")((handlers: Handlers, done$8: (arg_0: Handlers, arg_1: T) => void) => {
      k$3(responseValue, handlers, (handlers: Handlers, returnValue$10: T) => done$8(handlers, returnValue$10));
    }, handlers, (handlers: Handlers, returnValue$11: T) => done$6(handlers, returnValue$11));
  }, (handlers, v$4: string, k$5:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T) => void) => void) => {
    hash_307f5538(v$4, handlers, (handlers: Handlers) => {
      hash_b713e798(responseValue + "-")((handlers: Handlers, done$13: (arg_0: Handlers, arg_1: T) => void) => {
        k$5(handlers, (handlers: Handlers, returnValue$15: T) => done$13(handlers, returnValue$15));
      }, handlers, (handlers: Handlers, returnValue$16: T) => done$6(handlers, returnValue$16));
    });
  }], (handlers: Handlers, a$2: T) => {
    done$6(handlers, a$2);
  }, handlers);
};

/**
```
const raiseIf#10d0e26a = (check#:0: string#builtin): string#builtin ={Stdio#1da337a2}> {
    if raise!(Stdio#1da337a2.read()) ==#8a86d00e#2f333afa#0 check#:0 {
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
export const hash_10d0e26a:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void, arg_3: Handlers, arg_4: (arg_0: Handlers, arg_1: string) => void) => void = (check: string, handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0: string) => {
    if (hash_8a86d00e.h2f333afa_0(arg_lift_0, check)) {
      raise(handlers, "1da337a2", 0, null, (handlers, value) => done$3(handlers, value));
    } else {
      done$3(handlers, "didn't raise");
    }
  })(handlers, value));
};

/**
```
const maybeRaise#a750f0d8 = (shouldRaise#:0: bool#builtin): string#builtin ={Stdio#1da337a2}> {
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
export const hash_a750f0d8:
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
const inner#015e7043 = (name#:0: string#builtin): void#builtin ={Stdio#1da337a2, Log#35f4b478}> {
    log#307f5538(k: farther#03ccaa7c(name: "Folks") ++#builtin " from farther");
    log#307f5538(k: "getting");
    log#307f5538(k: name#:0);
    log#307f5538(
        k: raise!(Stdio#1da337a2.read()) ++#builtin " and " 
            ++#builtin raise!(Stdio#1da337a2.read()),
    );
    log#307f5538(k: "And then " ++#builtin raise!(Stdio#1da337a2.read()));
    log#307f5538(k: "Dones");
}
(
    name#:0: string,
    handlers#:15000: nope type: effect-handler,
    done#:9: (nope type: effect-handler) => void,
): void => {
    farther#🍅🚇😎(
        "Folks",
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:17: string): void => {
            log#👷‍♂️⚾🏫(
                ++(returnValue#:17, " from farther"),
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler): void => {
                    log#👷‍♂️⚾🏫(
                        "getting",
                        handlers#:15000,
                        (handlers#:15000: nope type: effect-handler): void => {
                            log#👷‍♂️⚾🏫(
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
export const hash_015e7043:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void, arg_3: Handlers, arg_4: (arg_0: Handlers) => void) => void = (name: string, handlers: Handlers, done$9: (arg_0: Handlers) => void) => {
  hash_03ccaa7c("Folks", handlers, (handlers: Handlers, returnValue$17: string) => {
    hash_307f5538(returnValue$17 + " from farther", handlers, (handlers: Handlers) => {
      hash_307f5538("getting", handlers, (handlers: Handlers) => {
        hash_307f5538(name, handlers, (handlers: Handlers) => {
          raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0$6: string) => {
            raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_1: string) => {
              hash_307f5538(arg_lift_0$6 + " and " + arg_lift_1, handlers, (handlers: Handlers) => {
                raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_1$8: string) => {
                  hash_307f5538("And then " + arg_lift_1$8, handlers, (handlers: Handlers) => {
                    hash_307f5538("Dones", handlers, (handlers: Handlers) => done$9(handlers));
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
const full#20454ca2 = (): string#builtin ={}> {
    handleMulti#28e499bc(
        f: (): string#builtin ={MultiArg#6ddb76fe}> raise!(MultiArg#6ddb76fe.putTwo(4, "five")),
    );
}
(): string => handleMulti#🤹‍♀️👨‍✈️🥖(
    (
        handlers#:15000: nope type: effect-handler,
        done#:1: (nope type: effect-handler, string) => void,
    ): void => {
        TODO raise;
    },
)
```
*/
export const hash_20454ca2: () => string = () => hash_28e499bc((handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "6ddb76fe", 0, [4, "five"], (handlers, value) => done(handlers, value));
});

/**
```
const test4#6d274ca2 = (): void#builtin ={Log#35f4b478}> {
    respondWith#b713e798(responseValue: "<read>")<void#builtin>{Log#35f4b478}(letBind#501bcf28);
}
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
    respondWith#🌝("<read>")<void>(
        letBind#🚅🏖️🧑‍🎓😃,
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:3: [var]T#:0): void => done#:1(
            handlers#:15000,
        ),
    );
}
```
*/
export const hash_6d274ca2:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  hash_b713e798("<read>")(hash_501bcf28, handlers, (handlers: Handlers, returnValue$3: T) => done(handlers));
};

/**
```
const test3#40574af3 = (): void#builtin ={Log#35f4b478}> {
    log#307f5538(
        k: respondWith#b713e798(responseValue: "<read>")<string#builtin>{Log#35f4b478}(
            (): string#builtin ={Stdio#1da337a2, Log#35f4b478}> raiseIf#10d0e26a(check: "<read>"),
        ),
    );
}
(handlers#:15000: nope type: effect-handler, done#:2: (nope type: effect-handler) => void): void => {
    respondWith#🌝("<read>")<string>(
        (
            handlers#:15000: nope type: effect-handler,
            done#:5: (nope type: effect-handler, string) => void,
        ): void => {
            raiseIf#🍁😵🧑‍🍳(
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
            log#👷‍♂️⚾🏫(
                returnValue#:8,
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler): void => done#:2(handlers#:15000),
            );
        },
    );
}
```
*/
export const hash_40574af3:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void, arg_2: Handlers, arg_3: (arg_0: Handlers) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers) => void) => {
  hash_b713e798("<read>")((handlers: Handlers, done$5: (arg_0: Handlers, arg_1: string) => void) => {
    hash_10d0e26a("<read>", handlers, (handlers: Handlers, returnValue$7: string) => done$5(handlers, returnValue$7));
  }, handlers, (handlers: Handlers, returnValue: T) => {
    hash_307f5538(returnValue, handlers, (handlers: Handlers) => done$2(handlers));
  });
};

/**
```
const test2#cf38f784 = (): void#builtin ={Log#35f4b478}> {
    respondWith#b713e798(responseValue: "<read>")<void#builtin>{Log#35f4b478}(
        (): void#builtin ={Stdio#1da337a2, Log#35f4b478}> log#307f5538(
            k: maybeRaise#a750f0d8(shouldRaise: true) 
                ++#builtin maybeRaise#a750f0d8(shouldRaise: false),
        ),
    );
}
(handlers#:15000: nope type: effect-handler, done#:4: (nope type: effect-handler) => void): void => {
    respondWith#🌝("<read>")<void>(
        (handlers#:15000: nope type: effect-handler, done#:6: (nope type: effect-handler) => void): void => {
            maybeRaise#🧑‍🦳(
                true,
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:11: string): void => {
                    maybeRaise#🧑‍🦳(
                        false,
                        handlers#:15000,
                        (handlers#:15000: nope type: effect-handler, returnValue#:9: string): void => {
                            log#👷‍♂️⚾🏫(
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
export const hash_cf38f784:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void, arg_2: Handlers, arg_3: (arg_0: Handlers) => void) => void = (handlers: Handlers, done$4: (arg_0: Handlers) => void) => {
  hash_b713e798("<read>")((handlers: Handlers, done$6: (arg_0: Handlers) => void) => {
    hash_a750f0d8(true, handlers, (handlers: Handlers, returnValue$11: string) => {
      hash_a750f0d8(false, handlers, (handlers: Handlers, returnValue$9: string) => {
        hash_307f5538(returnValue$11 + returnValue$9, handlers, (handlers: Handlers) => done$6(handlers));
      });
    });
  }, handlers, (handlers: Handlers, returnValue$12: T) => done$4(handlers));
};

/**
```
const test1#99109ce2 = (): void#builtin ={Log#35f4b478}> {
    respondWith#b713e798(responseValue: "<read>")<void#builtin>{Log#35f4b478}(
        (): void#builtin ={Stdio#1da337a2, Log#35f4b478}> inner#015e7043(name: "Yes"),
    );
}
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
    respondWith#🌝("<read>")<void>(
        (handlers#:15000: nope type: effect-handler, done#:3: (nope type: effect-handler) => void): void => {
            inner#😮🌟🥲(
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
export const hash_99109ce2:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  hash_b713e798("<read>")((handlers: Handlers, done$3: (arg_0: Handlers) => void) => {
    hash_015e7043("Yes", handlers, (handlers: Handlers) => done$3(handlers));
  }, handlers, (handlers: Handlers, returnValue$5: T) => done(handlers));
};

/**
```
const rec collect#d6c08ba2 = {e#:0}(fn#:0: () ={Log#35f4b478, e#:0}> void#builtin): string#builtin ={
    e#:0,
}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            v#:2 ++#builtin "\n" 
                ++#builtin d6c08ba2#self{e#:0}((): void#builtin ={Log#35f4b478, e#:0}> k#:3());
        },
        pure(a#:1) => "end",
    };
}
TODO effectful or direct lambda
```
*/
export const hash_d6c08ba2: any = {
  effectful: (fn$13:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void, handlers: Handlers, done$14: (arg_0: Handlers, arg_1: string) => void) => {
    handleSimpleShallow2<any, any, any>("35f4b478", fn$13, [(handlers, v$15: string, k$16:
    /*from cps lambda*/
    (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
      hash_d6c08ba2.effectful((handlers: Handlers, done$18: (arg_0: Handlers) => void) => {
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
      result = v$2 + "\n" + hash_d6c08ba2.direct((handlers: Handlers, done$6: (arg_0: Handlers) => void) => {
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
const rec collectNew#75fe06a4 = (fn#:0: () ={Log#35f4b478}> void#builtin): string#builtin ={}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            v#:2 ++#builtin "\n" ++#builtin 75fe06a4#self((): void#builtin ={Log#35f4b478}> k#:3());
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
export const hash_75fe06a4: (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => string = (fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
  let result$4: string = (null as any);
  handleSimpleShallow2<any, any, any>("35f4b478", fn$0, [(handlers, v$2: string, k$3:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
    result$4 = v$2 + "\n" + hash_75fe06a4((handlers: Handlers, done$5: (arg_0: Handlers) => void) => {
      k$3(handlers, (handlers: Handlers) => done$5(handlers));
    });
  }], (handlers: Handlers, a$1: void) => {
    result$4 = "end";
  });
  return result$4;
};

/*
collectNew#75fe06a4
collectNew#🥘🕢🛬😃
*/
hash_75fe06a4;

/*
collect#d6c08ba2{}(fn: test1#99109ce2) 
    ==#8a86d00e#2f333afa#0 "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    get effectful or direct TODO(test1#🙍‍♀️),
    "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_d6c08ba2.direct(hash_99109ce2), "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend");

/*
collect#d6c08ba2{}(fn: test2#cf38f784) ==#8a86d00e#2f333afa#0 "<read>didn't raise\nend"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    get effectful or direct TODO(test2#🕘),
    "<read>didn't raise\nend",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_d6c08ba2.direct(hash_cf38f784), "<read>didn't raise\nend");

/*
collect#d6c08ba2{}(fn: test3#40574af3) ==#8a86d00e#2f333afa#0 "<read>.\nend"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    get effectful or direct TODO(test3#🏖️👨‍👩‍👦‍👦😅😃),
    "<read>.\nend",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_d6c08ba2.direct(hash_40574af3), "<read>.\nend");

/*
collect#d6c08ba2{}(fn: test4#6d274ca2) ==#8a86d00e#2f333afa#0 "<read>Hello\nend"
assertCall(
    StringEq#😍.#Eq#🧱👨‍🦰🏖️#0,
    get effectful or direct TODO(test4#👈👨‍👩‍👧‍👧☕😃),
    "<read>Hello\nend",
)
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_d6c08ba2.direct(hash_6d274ca2), "<read>Hello\nend");

/*
full#20454ca2() ==#8a86d00e#2f333afa#0 "4:five:ok"
assertCall(StringEq#😍.#Eq#🧱👨‍🦰🏖️#0, full#👈🦹🐮(), "4:five:ok")
*/
assertCall(hash_8a86d00e.h2f333afa_0, hash_20454ca2(), "4:five:ok");