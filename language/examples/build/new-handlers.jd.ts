import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];
type handle1da337a2 = [(arg_0: (arg_0: handle1da337a2, arg_1: string) => void) => void, (arg_0: string, arg_1: (arg_0: handle1da337a2) => void) => void];

/**
```
@unique(0.5383562320075749) type Eq#3b6b23ae<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_3b6b23ae<T> = {
  type: "3b6b23ae";
  h3b6b23ae_0: (arg_0: T_0, arg_1: T_0) => boolean;
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
  hash_03ccaa7c("Folks", handlers, (handlers: Handlers, returnValue: string) => {
    hash_307f5538(returnValue + " from farther", handlers, (handlers: Handlers) => {
      hash_307f5538("getting", handlers, (handlers: Handlers) => {
        hash_307f5538(name, handlers, (handlers: Handlers) => {
          raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0: string) => {
            raise(handlers, "1da337a2", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_1: string) => {
              hash_307f5538(arg_lift_0 + " and " + arg_lift_1, handlers, (handlers: Handlers) => {
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void = (responseValue: string) => <T>(fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, handlers: Handlers, done$6: (arg_0: Handlers, arg_1: T_0) => void) => {
  handleSimpleShallow2<any, any, any>("1da337a2", fn, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    hash_b713e798(responseValue + ".")((handlers: Handlers, done$8: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(responseValue, handlers, (handlers: Handlers, returnValue$10: T_0) => done$8(handlers, returnValue$10));
    }, handlers, (handlers: Handlers, returnValue$11: T_0) => done$6(handlers, returnValue$11));
  }, (handlers, v$4: string, k$5:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    hash_307f5538(v$4, handlers, (handlers: Handlers) => {
      hash_b713e798(responseValue + "-")((handlers: Handlers, done$13: (arg_0: Handlers, arg_1: T_0) => void) => {
        k$5(handlers, (handlers: Handlers, returnValue$15: T_0) => done$13(handlers, returnValue$15));
      }, handlers, (handlers: Handlers, returnValue$16: T_0) => done$6(handlers, returnValue$16));
    });
  }], (handlers: Handlers, a$2: T_0) => {
    done$6(handlers, a$2);
  }, handlers);
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
  }, handlers, (handlers: Handlers, returnValue$5: T_0) => done(handlers));
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
const rec appendLog#7e2e6d04 = (fn#:0: () ={Log#35f4b478}> string#builtin): string#builtin ={}> {
    handle! fn#:0 {
        Log.log#0((v#:2) => k#:3) => {
            v#:2 ++#builtin "\n" 
                ++#builtin 7e2e6d04#self((): string#builtin ={Log#35f4b478}> k#:3());
        },
        pure(a#:1) => a#:1,
    };
}
(fn#:0: nope type: cps-lambda): string => {
    const result#:4: string;
    TODO Handle;
    return result#:4;
}
```
*/
export const hash_7e2e6d04: (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result$4: string = (null as any);
  handleSimpleShallow2<any, any, any>("35f4b478", fn$0, [(handlers, v$2: string, k$3:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result$4 = v$2 + "\n" + hash_7e2e6d04((handlers: Handlers, done$5: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(handlers, (handlers: Handlers, returnValue$7: string) => done$5(handlers, returnValue$7));
    });
  }], (handlers: Handlers, a$1: string) => {
    result$4 = a$1;
  });
  return result$4;
};

/**
```
const rec provide#1e2a9f14 = <T#:0>(v#:0: string#builtin, fn#:1: () ={Read#22024b72}> T#:0): T#:0 ={}> {
    handle! fn#:1 {
        Read.read#0(() => k#:3) => {
            1e2a9f14#self<T#:0>(
                "<" +#builtin v#:0 +#builtin ">",
                (): T#:0 ={Read#22024b72}> k#:3(v#:0),
            );
        },
        pure(a#:2) => a#:2,
    };
}
<T>(v#:0: string, fn#:1: nope type: cps-lambda): [var]T#:0 => {
    const result#:4: [var]T#:0;
    TODO Handle;
    return result#:4;
}
```
*/
export const hash_1e2a9f14: <T>(arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T>(v: string, fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$4: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = hash_1e2a9f14("<" + v + ">", (handlers: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(v, handlers, (handlers: Handlers, returnValue$7: T_0) => done$5(handlers, returnValue$7));
    });
  }], (handlers: Handlers, a$2: T_0) => {
    result$4 = a$2;
  });
  return result$4;
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

/**
```
const StringEq#0d81b26d = Eq#3b6b23ae<string#builtin>{"=="#3b6b23ae#0: stringEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: stringEq}
```
*/
export const hash_0d81b26d: t_3b6b23ae<string> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: stringEq
} as t_3b6b23ae<string>);

/*
collectNew#75fe06a4(
        fn: (): void#builtin ={Log#35f4b478}> {
            raise!(Log#35f4b478.log("Hello"));
            raise!(Log#35f4b478.log("Folks"));
        },
    ) 
    ==#0d81b26d#3b6b23ae#0 "Hello\nFolks\nend"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    collectNew#🥘🕢🛬😃(
        (handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
            TODO raise;
        },
    ),
    "Hello\nFolks\nend",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_75fe06a4((handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "35f4b478", 0, "Hello", (handlers, value) => ((handlers: Handlers) => {
    raise(handlers, "35f4b478", 0, "Folks", (handlers, value) => done(handlers, value));
  })(handlers, value));
}), "Hello\nFolks\nend");

/*
provide#1e2a9f14<string#builtin>(
        v: "Hello",
        fn: (): string#builtin ={Read#22024b72}> raise!(Read#22024b72.read()),
    ) 
    ==#0d81b26d#3b6b23ae#0 "Hello"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    provide#🕋🥗👨‍👧‍👧<string>(
        "Hello",
        (
            handlers#:15000: nope type: effect-handler,
            done#:1: (nope type: effect-handler, string) => void,
        ): void => {
            TODO raise;
        },
    ),
    "Hello",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_1e2a9f14("Hello", (handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => done(handlers, value));
}), "Hello");

/*
provide#1e2a9f14<string#builtin>(
        v: "Hello",
        fn: (): string#builtin ={Read#22024b72}> raise!(Read#22024b72.read()) 
            +#builtin raise!(Read#22024b72.read()),
    ) 
    ==#0d81b26d#3b6b23ae#0 "Hello<Hello>"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    provide#🕋🥗👨‍👧‍👧<string>(
        "Hello",
        (
            handlers#:15000: nope type: effect-handler,
            done#:3: (nope type: effect-handler, string) => void,
        ): void => {
            TODO raise;
        },
    ),
    "Hello<Hello>",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_1e2a9f14("Hello", (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0$1: string) => {
    raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_1$2: string) => {
      done$3(handlers, arg_lift_0$1 + arg_lift_1$2);
    })(handlers, value));
  })(handlers, value));
}), "Hello<Hello>");

/*
appendLog#7e2e6d04(
        fn: (): string#builtin ={Log#35f4b478}> {
            raise!(Log#35f4b478.log("Hello"));
            raise!(Log#35f4b478.log("Folks"));
            "Final value";
        },
    ) 
    ==#0d81b26d#3b6b23ae#0 "Hello\nFolks\nFinal value"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    appendLog#🧑‍🏫⭐🏓😃(
        (
            handlers#:15000: nope type: effect-handler,
            done#:1: (nope type: effect-handler, string) => void,
        ): void => {
            TODO raise;
        },
    ),
    "Hello\nFolks\nFinal value",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_7e2e6d04((handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "35f4b478", 0, "Hello", (handlers, value) => ((handlers: Handlers) => {
    raise(handlers, "35f4b478", 0, "Folks", (handlers, value) => ((handlers: Handlers) => {
      done(handlers, "Final value");
    })(handlers, value));
  })(handlers, value));
}), "Hello\nFolks\nFinal value");

/*
collect#d6c08ba2{}(fn: (): void#builtin ={Log#35f4b478}> raise!(Log#35f4b478.log("Good news"))) 
    ==#0d81b26d#3b6b23ae#0 "Good news\nend"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    get effectful or direct TODO(
        (handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
            TODO raise;
        },
    ),
    "Good news\nend",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_d6c08ba2.direct((handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "35f4b478", 0, "Good news", (handlers, value) => done(handlers, value));
}), "Good news\nend");

/*
provide#1e2a9f14<string#builtin>(
        v: "Folks",
        fn: (): string#builtin ={Read#22024b72}> collect#d6c08ba2{Read#22024b72}(
            fn: (): void#builtin ={Read#22024b72, Log#35f4b478}> raise!(
                Log#35f4b478.log("Good news " +#builtin raise!(Read#22024b72.read())),
            ),
        ),
    ) 
    ==#0d81b26d#3b6b23ae#0 "Good news Folks\nend"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    provide#🕋🥗👨‍👧‍👧<string>(
        "Folks",
        (
            handlers#:15000: nope type: effect-handler,
            done#:3: (nope type: effect-handler, string) => void,
        ): void => {
            get effectful or direct TODO(
                (
                    handlers#:15000: nope type: effect-handler,
                    done#:5: (nope type: effect-handler) => void,
                ): void => {
                    TODO raise;
                },
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:6: string): void => done#:3(
                    handlers#:15000,
                    returnValue#:6,
                ),
            );
        },
    ),
    "Good news Folks\nend",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_1e2a9f14("Folks", (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_d6c08ba2.effectful((handlers: Handlers, done$5: (arg_0: Handlers) => void) => {
    raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_1$2: string) => {
      raise(handlers, "35f4b478", 0, "Good news " + arg_lift_1$2, (handlers, value) => done$5(handlers, value));
    })(handlers, value));
  }, handlers, (handlers: Handlers, returnValue$6: string) => done$3(handlers, returnValue$6));
}), "Good news Folks\nend");

/*
collect#d6c08ba2{}(fn: test1#99109ce2) 
    ==#0d81b26d#3b6b23ae#0 "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend"
assertCall(
    StringEq#🍇😽🧑‍🦳.#Eq#☂️🍰🔥#0,
    get effectful or direct TODO(test1#🙍‍♀️),
    "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend",
)
*/
assertCall(hash_0d81b26d.h3b6b23ae_0, hash_d6c08ba2.direct(hash_99109ce2), "yes please Folks\n<read> from farther\ngetting\nYes\n<read>. and <read>..\nAnd then <read>...\nDones\nend");