import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];
type handle086e3532 = [(arg_0: (arg_0: handle086e3532, arg_1: boolean) => void) => void];
type handle7214565c = [(arg_0: (arg_0: handle7214565c, arg_1: boolean) => void) => void, (arg_0: (arg_0: handle7214565c, arg_1: number) => void) => void];
type handle7b45d75e = [(arg_0: (arg_0: handle7b45d75e, arg_1: number) => void) => void, (arg_0: number, arg_1: (arg_0: handle7b45d75e) => void) => void];

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
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
const decide#6ab06b22 = (): bool#builtin ={DecideOrFail#7214565c}> raise!(
    DecideOrFail#7214565c.decide(),
)
```
*/
export const hash_6ab06b22:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: boolean) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: boolean) => void) => {
  raise(handlers, "7214565c", 0, null, (handlers, value) => done(handlers, value));
};

/**
```
const fail#0620e972 = (): int#builtin ={DecideOrFail#7214565c}> raise!(DecideOrFail#7214565c.fail())
```
*/
export const hash_0620e972:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: number) => void) => {
  raise(handlers, "7214565c", 1, null, (handlers, value) => done(handlers, value));
};

/**
```
const IntAsString#1175499e = As#As<int#builtin, string#builtin>{as#As#0: intToString#builtin}
```
*/
export const hash_1175499e: t_As<number, string> = ({
  type: "As",
  hAs_0: intToString
} as t_As<number, string>);

/**
```
const rec chooseInt#54cbbab4 = (m#:0: int#builtin, n#:1: int#builtin): int#builtin ={
    DecideOrFail#7214565c,
}> {
    if m#:0 >#builtin n#:1 {
        fail#0620e972();
        10;
    } else {
        if decide#6ab06b22() {
            m#:0;
        } else {
            54cbbab4#self(m#:0 +#builtin 1, n#:1);
        };
    };
}
```
*/
export const hash_54cbbab4:
/*from cps lambda*/
(arg_0: number, arg_1: number, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: number) => void) => void = (m: number, n: number, handlers: Handlers, done$3: (arg_0: Handlers, arg_1: number) => void) => {
  if (m > n) {
    hash_0620e972(handlers, (handlers: Handlers, returnValue: number) => {
      done$3(handlers, 10);
    });
  } else {
    hash_6ab06b22(handlers, (handlers: Handlers, returnValue$9: boolean) => {
      if (returnValue$9) {
        done$3(handlers, m);
      } else {
        hash_54cbbab4(m + 1, n, handlers, (handlers: Handlers, returnValue$7: number) => done$3(handlers, returnValue$7));
      }
    });
  }
};

/**
```
const decide#5334ea40 = (): bool#builtin ={Decide#086e3532}> raise!(Decide#086e3532.decide())
```
*/
export const hash_5334ea40:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: boolean) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: boolean) => void) => {
  raise(handlers, "086e3532", 0, null, (handlers, value) => done(handlers, value));
};

/**
```
const pythagorean#0cdd5ff0 = (m#:0: int#builtin, n#:1: int#builtin): string#builtin ={
    DecideOrFail#7214565c,
}> {
    const a#:2 = chooseInt#54cbbab4(m#:0, n: n#:1 -#builtin 1);
    const b#:3 = chooseInt#54cbbab4(m: a#:2 +#builtin 1, n#:1);
    const a2#:4 = a#:2 *#builtin a#:2;
    const b2#:5 = b#:3 *#builtin b#:3;
    log#builtin(
        "a " +#builtin a2#:4 as#1175499e string#builtin +#builtin " b " 
            +#builtin b2#:5 as#1175499e string#builtin,
    );
    if isSquare#builtin(a2#:4 +#builtin b2#:5) {
        intToString#builtin(a#:2) ++#builtin ":" ++#builtin intToString#builtin(b#:3);
    } else {
        fail#0620e972();
        "??? how did this return";
    };
}
```
*/
export const hash_0cdd5ff0:
/*from cps lambda*/
(arg_0: number, arg_1: number, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: string) => void) => void = (m: number, n: number, handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
  hash_54cbbab4(m, n - 1, handlers, (handlers: Handlers, returnValue$12: number) => {
    hash_54cbbab4(returnValue$12 + 1, n, handlers, (handlers: Handlers, returnValue$10: number) => {
      if (isSquare(returnValue$12 * returnValue$12 + returnValue$10 * returnValue$10)) {
        done$6(handlers, intToString(returnValue$12) + ":" + intToString(returnValue$10));
      } else {
        hash_0620e972(handlers, (handlers: Handlers, returnValue$8: number) => {
          done$6(handlers, "??? how did this return");
        });
      }
    });
  });
};

/**
```
const rec backtrackReverse#70ad2630 = <T#:0>(
    fn#:0: () ={DecideOrFail#7214565c}> T#:0,
    orElse#:1: () ={}> T#:0,
): T#:0 ={}> {
    handle! fn#:0 {
        DecideOrFail.decide#0(() => k#:3) => {
            70ad2630#self<T#:0>(
                (): T#:0 ={DecideOrFail#7214565c}> k#:3(false),
                (): T#:0 ={}> 70ad2630#self<T#:0>(
                    (): T#:0 ={DecideOrFail#7214565c}> k#:3(true),
                    orElse#:1,
                ),
            );
        },
        DecideOrFail.fail#1(() => _#:4) => {
            orElse#:1();
        },
        pure(x#:2) => x#:2,
    };
}
```
*/
export const hash_70ad2630: <T_0>(arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, arg_1: () => T_0) => T_0 = <T_0>(fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, orElse: () => T_0) => {
  let result: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("7214565c", fn, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result = hash_70ad2630((handlers: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(false, handlers, (handlers: Handlers, returnValue$7: T_0) => done$5(handlers, returnValue$7));
    }, () => hash_70ad2630((handlers: Handlers, done$8: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(true, handlers, (handlers: Handlers, returnValue$10: T_0) => done$8(handlers, returnValue$10));
    }, orElse));
  }, (handlers, _, _$4:
  /*from cps lambda*/
  (arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result = orElse();
  }], (handlers: Handlers, x$2: T_0) => {
    result = x$2;
  });
  return result;
};

/**
```
const rec backtrack#1603c390 = <T#:0>(
    fn#:0: () ={DecideOrFail#7214565c}> T#:0,
    orElse#:1: () ={}> T#:0,
): T#:0 ={}> {
    handle! fn#:0 {
        DecideOrFail.decide#0(() => k#:3) => {
            1603c390#self<T#:0>(
                (): T#:0 ={DecideOrFail#7214565c}> k#:3(true),
                (): T#:0 ={}> 1603c390#self<T#:0>(
                    (): T#:0 ={DecideOrFail#7214565c}> k#:3(false),
                    orElse#:1,
                ),
            );
        },
        DecideOrFail.fail#1(() => _#:4) => {
            orElse#:1();
        },
        pure(x#:2) => x#:2,
    };
}
```
*/
export const hash_1603c390: <T_0>(arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, arg_1: () => T_0) => T_0 = <T_0>(fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, orElse: () => T_0) => {
  let result: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("7214565c", fn, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result = hash_1603c390((handlers: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(true, handlers, (handlers: Handlers, returnValue$7: T_0) => done$5(handlers, returnValue$7));
    }, () => hash_1603c390((handlers: Handlers, done$8: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(false, handlers, (handlers: Handlers, returnValue$10: T_0) => done$8(handlers, returnValue$10));
    }, orElse));
  }, (handlers, _, _$4:
  /*from cps lambda*/
  (arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result = orElse();
  }], (handlers: Handlers, x$2: T_0) => {
    result = x$2;
  });
  return result;
};

/**
```
const choose#437fecbe = <T#:0>(x#:0: T#:0, y#:1: T#:0): T#:0 ={Decide#086e3532}> {
    if decide#5334ea40() {
        x#:0;
    } else {
        y#:1;
    };
}
```
*/
export const hash_437fecbe:
/*from cps lambda*/
<T_0>(arg_0: T_0, arg_1: T_0, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: T_0) => void) => void = <T_0>(x: T_0, y: T_0, handlers: Handlers, done$3: (arg_0: Handlers, arg_1: T_0) => void) => {
  hash_5334ea40(handlers, (handlers: Handlers, returnValue: boolean) => {
    let result$6: T_0;

    if (returnValue) {
      result$6 = x;
    } else {
      result$6 = y;
    }

    done$3(handlers, result$6);
  });
};

/**
```
const print#eccbfbca = (x#:0: string#builtin): void#builtin ={Write#35f4b478}> raise!(
    Write#35f4b478.write(x#:0),
)
```
*/
export const hash_eccbfbca:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (x: string, handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "35f4b478", 0, x, (handlers, value) => done(handlers, value));
};

/**
```
const callPlus5#1d5e1778 = {e#:0}(x#:0: () ={e#:0}> int#builtin): int#builtin ={e#:0}> x#:0() 
    +#builtin 5
```
*/
export const hash_1d5e1778: any = {
  effectful: (x$5:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void, handlers: Handlers, done$6: (arg_0: Handlers, arg_1: number) => void) => {
    x$5(handlers, (handlers: Handlers, returnValue$7: number) => {
      done$6(handlers, returnValue$7 + 5);
    });
  },
  direct: (x: () => number) => x() + 5
};

/**
```
const getAndSet#463fdaf6 = (): string#builtin ={Store#7b45d75e}> {
    const x#:0 = raise!(Store#7b45d75e.get());
    raise!(Store#7b45d75e.set(x#:0 +#builtin 4));
    intToString#builtin(x#:0) ++#builtin ":" 
        ++#builtin intToString#builtin(raise!(Store#7b45d75e.get()));
}
```
*/
export const hash_463fdaf6:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "7b45d75e", 0, null, (handlers, value) => ((handlers: Handlers, x: number) => {
    raise(handlers, "7b45d75e", 1, x + 4, (handlers, value) => ((handlers: Handlers) => {
      raise(handlers, "7b45d75e", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0: number) => {
        done$3(handlers, intToString(x) + ":" + intToString(arg_lift_0));
      })(handlers, value));
    })(handlers, value));
  })(handlers, value));
};

/**
```
const rec withInitialValue#478ee9c0 = <T#:0>(
    value#:0: int#builtin,
    fn#:1: () ={Store#7b45d75e}> T#:0,
): T#:0 ={}> {
    handle! fn#:1 {
        Store.get#0(() => k#:3) => 478ee9c0#self<T#:0>(
            value#:0,
            (): T#:0 ={Store#7b45d75e}> k#:3(value#:0),
        ),
        Store.set#1((newValue#:4) => k#:5) => 478ee9c0#self<T#:0>(newValue#:4, k#:5),
        pure(x#:2) => x#:2,
    };
}
```
*/
export const hash_478ee9c0: <T_0>(arg_0: number, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(value: number, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$6: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("7b45d75e", fn$1, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$6 = hash_478ee9c0(value, (handlers: Handlers, done$7: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(value, handlers, (handlers: Handlers, returnValue$9: T_0) => done$7(handlers, returnValue$9));
    });
  }, (handlers, newValue$4: number, k$5:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$6 = hash_478ee9c0(newValue$4, k$5);
  }], (handlers: Handlers, x$2: T_0) => {
    result$6 = x$2;
  });
  return result$6;
};

/**
```
const backtrackPythagReverse#5f048050 = (m#:0: int#builtin, n#:1: int#builtin): string#builtin ={}> backtrackReverse#70ad2630<
    string#builtin,
>(
    fn: (): string#builtin ={DecideOrFail#7214565c}> pythagorean#0cdd5ff0(m#:0, n#:1),
    orElse: (): string#builtin ={}> "No solution found",
)
```
*/
export const hash_5f048050: (arg_0: number, arg_1: number) => T_0 = (m: number, n: number) => hash_70ad2630((handlers: Handlers, done$2: (arg_0: Handlers, arg_1: string) => void) => {
  hash_0cdd5ff0(m, n, handlers, (handlers: Handlers, returnValue$4: string) => done$2(handlers, returnValue$4));
}, () => "No solution found");

/**
```
const backtrackPythag#db67c018 = (m#:0: int#builtin, n#:1: int#builtin): string#builtin ={}> backtrack#1603c390<
    string#builtin,
>(
    fn: (): string#builtin ={DecideOrFail#7214565c}> pythagorean#0cdd5ff0(m#:0, n#:1),
    orElse: (): string#builtin ={}> "No solution found",
)
```
*/
export const hash_db67c018: (arg_0: number, arg_1: number) => T_0 = (m: number, n: number) => hash_1603c390((handlers: Handlers, done$2: (arg_0: Handlers, arg_1: string) => void) => {
  hash_0cdd5ff0(m, n, handlers, (handlers: Handlers, returnValue$4: string) => done$2(handlers, returnValue$4));
}, () => "No solution found");

/**
```
const rec pickMax#998219d8 = (fn#:0: () ={Decide#086e3532}> int#builtin): int#builtin ={}> handle! fn#:0 {
    Decide.decide#0(() => k#:2) => {
        const xt#:3 = 998219d8#self((): int#builtin ={Decide#086e3532}> k#:2(true));
        const xf#:4 = 998219d8#self((): int#builtin ={Decide#086e3532}> k#:2(false));
        if xt#:3 >#builtin xf#:4 {
            xt#:3;
        } else {
            xf#:4;
        };
    },
    pure(x#:1) => x#:1,
}
```
*/
export const hash_998219d8: (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void) => number = (fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void) => {
  let result$5: number = (null as any);
  handleSimpleShallow2<any, any, any>("086e3532", fn, [(handlers, _, k$2:
  /*from cps lambda*/
  (arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: number) => void) => void) => {
    let result$12: number;
    let xt: number = hash_998219d8((handlers: Handlers, done$6: (arg_0: Handlers, arg_1: number) => void) => {
      k$2(true, handlers, (handlers: Handlers, returnValue$8: number) => done$6(handlers, returnValue$8));
    });
    let xf: number = hash_998219d8((handlers: Handlers, done$9: (arg_0: Handlers, arg_1: number) => void) => {
      k$2(false, handlers, (handlers: Handlers, returnValue$11: number) => done$9(handlers, returnValue$11));
    });

    if (xt > xf) {
      result$12 = xt;
    } else {
      result$12 = xf;
    }

    result$5 = result$12;
  }], (handlers: Handlers, x$1: number) => {
    result$5 = x$1;
  });
  return result$5;
};

/**
```
const chooseDiff#61f16268 = (): int#builtin ={Decide#086e3532}> {
    const x1#:0 = choose#437fecbe<int#builtin>(x: 15, y: 30);
    const x2#:1 = choose#437fecbe<int#builtin>(x: 5, y: 10);
    x1#:0 -#builtin x2#:1;
}
```
*/
export const hash_61f16268:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: number) => void) => {
  hash_437fecbe(15, 30, handlers, (handlers: Handlers, returnValue$6: T_0) => {
    hash_437fecbe(5, 10, handlers, (handlers: Handlers, returnValue$4: T_0) => {
      done$2(handlers, returnValue$6 - returnValue$4);
    });
  });
};

/**
```
const rec pickTrue#268d3ca7 = <T#:0>(fn#:0: () ={Decide#086e3532}> T#:0): T#:0 ={}> handle! fn#:0 {
    Decide.decide#0(() => k#:2) => 268d3ca7#self<T#:0>((): T#:0 ={Decide#086e3532}> k#:2(true)),
    pure(x#:1) => x#:1,
}
```
*/
export const hash_268d3ca7: <T_0>(arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$3: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("086e3532", fn, [(handlers, _, k$2:
  /*from cps lambda*/
  (arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$3 = hash_268d3ca7((handlers: Handlers, done$4: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$2(true, handlers, (handlers: Handlers, returnValue$6: T_0) => done$4(handlers, returnValue$6));
    });
  }], (handlers: Handlers, x$1: T_0) => {
    result$3 = x$1;
  });
  return result$3;
};

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const rec reverse#f201f930 = (fn#:0: () ={Write#35f4b478}> void#builtin): void#builtin ={
    Write#35f4b478,
}> {
    handle! fn#:0 {
        Write.write#0((v#:2) => k#:3) => {
            f201f930#self(k#:3);
            print#eccbfbca(x: v#:2);
        },
        pure(a#:1) => a#:1,
    };
}
```
*/
export const hash_f201f930:
/*from cps lambda*/
(arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void, handlers: Handlers, done$4: (arg_0: Handlers) => void) => {
  handleSimpleShallow2<any, any, any>("35f4b478", fn, [(handlers, v$2: string, k$3:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
    hash_f201f930(k$3, handlers, (handlers: Handlers) => {
      hash_eccbfbca(v$2, handlers, (handlers: Handlers) => done$4(handlers));
    });
  }], (handlers: Handlers, a$1: void) => {
    done$4(handlers);
  }, handlers);
};

/**
```
const printFullName#ea51ddfc = (): void#builtin ={Read#22024b72, Write#35f4b478}> {
    print#eccbfbca(x: "What is your forename?");
    const foreName#:0 = raise!(Read#22024b72.read());
    print#eccbfbca(x: "What is your surname?");
    const surName#:1 = raise!(Read#22024b72.read());
    print#eccbfbca(x: foreName#:0 ++#builtin " " ++#builtin surName#:1);
}
```
*/
export const hash_ea51ddfc:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers) => void) => {
  hash_eccbfbca("What is your forename?", handlers, (handlers: Handlers) => {
    raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, foreName: string) => {
      hash_eccbfbca("What is your surname?", handlers, (handlers: Handlers) => {
        raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, surName: string) => {
          hash_eccbfbca(foreName + " " + surName, handlers, (handlers: Handlers) => done$2(handlers));
        })(handlers, value));
      });
    })(handlers, value));
  });
};

/**
```
const read#64605d94 = (): string#builtin ={Read#22024b72}> raise!(Read#22024b72.read())
```
*/
export const hash_64605d94:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => done(handlers, value));
};

/**
```
const rec alwaysRead#1762d528 = <T#:0>{e#:0}(
    value#:0: string#builtin,
    fn#:1: () ={Read#22024b72, e#:0}> T#:0,
): T#:0 ={e#:0}> {
    handle! fn#:1 {
        Read.read#0(() => k#:3) => {
            1762d528#self<T#:0>{e#:0}(value#:0, (): T#:0 ={Read#22024b72, e#:0}> k#:3(value#:0));
        },
        pure(a#:2) => a#:2,
    };
}
```
*/
export const hash_1762d528: any = {
  effectful: <T_0>(value$14: string, fn$15:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, handlers: Handlers, done$16: (arg_0: Handlers, arg_1: T_0) => void) => {
    handleSimpleShallow2<any, any, any>("22024b72", fn$15, [(handlers, _, k$17:
    /*from cps lambda*/
    (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
      hash_1762d528.effectful(value$14, (handlers: Handlers, done$19: (arg_0: Handlers, arg_1: T_0) => void) => {
        k$17(value$14, handlers, (handlers: Handlers, returnValue$20: T_0) => done$19(handlers, returnValue$20));
      }, handlers, (handlers: Handlers, returnValue$21: T_0) => done$16(handlers, returnValue$21));
    }], (handlers: Handlers, a$18: T_0) => {
      done$16(handlers, a$18);
    }, handlers);
  },
  direct: <T_0>(value: string, fn$1:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    let result: T_0 = (null as any);
    handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers, _, k$3:
    /*from cps lambda*/
    (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
      result = hash_1762d528.direct(value, (handlers: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
        k$3(value, handlers, (handlers: Handlers, returnValue$7: T_0) => done$5(handlers, returnValue$7));
      });
    }], (handlers: Handlers, a$2: T_0) => {
      result = a$2;
    });
    return result;
  }
};

/**
```
const rec collect#2ce3943a = {e#:0}(fn#:0: () ={Write#35f4b478, e#:0}> void#builtin): string#builtin ={
    e#:0,
}> {
    handle! fn#:0 {
        Write.write#0((v#:2) => k#:3) => {
            v#:2 ++#builtin "\n" 
                ++#builtin 2ce3943a#self{e#:0}((): void#builtin ={Write#35f4b478, e#:0}> k#:3());
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
      hash_2ce3943a.effectful((handlers: Handlers, done$18: (arg_0: Handlers) => void) => {
        k$16(handlers, (handlers: Handlers) => done$18(handlers));
      }, handlers, (handlers: Handlers, returnValue$19: string) => {
        done$14(handlers, v$15 + "\n" + returnValue$19);
      });
    }], (handlers: Handlers, a$17: void) => {
      done$14(handlers, "end");
    }, handlers);
  },
  direct: (fn:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
    let result$5: string = (null as any);
    handleSimpleShallow2<any, any, any>("35f4b478", fn, [(handlers, v$2: string, k$3:
    /*from cps lambda*/
    (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
      result$5 = v$2 + "\n" + hash_2ce3943a.direct((handlers: Handlers, done$6: (arg_0: Handlers) => void) => {
        k$3(handlers, (handlers: Handlers) => done$6(handlers));
      });
    }], (handlers: Handlers, a$1: void) => {
      result$5 = "end";
    });
    return result$5;
  }
};

/**
```
const StringEq#606c7034 = Eq#553b4b8e<string#builtin>{"=="#553b4b8e#0: stringEq#builtin}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> {
            raise!(Write#35f4b478.write("one"));
            raise!(Write#35f4b478.write("two"));
            raise!(Write#35f4b478.write("three"));
        },
    ) 
    ==#606c7034#553b4b8e#0 "one\ntwo\nthree\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "35f4b478", 0, "one", (handlers, value) => ((handlers: Handlers) => {
    raise(handlers, "35f4b478", 0, "two", (handlers, value) => ((handlers: Handlers) => {
      raise(handlers, "35f4b478", 0, "three", (handlers, value) => done(handlers, value));
    })(handlers, value));
  })(handlers, value));
}), "one\ntwo\nthree\nend");

/*
collect#2ce3943a{}(fn: (): void#builtin ={Write#35f4b478}> {
        print#eccbfbca(x: "HI");
    }) 
    ==#606c7034#553b4b8e#0 "HI\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$2: (arg_0: Handlers) => void) => {
  hash_eccbfbca("HI", handlers, (handlers: Handlers) => done$2(handlers));
}), "HI\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> {
            print#eccbfbca(x: "HI");
            print#eccbfbca(x: "HO");
        },
    ) 
    ==#606c7034#553b4b8e#0 "HI\nHO\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$4: (arg_0: Handlers) => void) => {
  hash_eccbfbca("HI", handlers, (handlers: Handlers) => {
    hash_eccbfbca("HO", handlers, (handlers: Handlers) => done$4(handlers));
  });
}), "HI\nHO\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> {
            raise!(Write#35f4b478.write("HI"));
            raise!(Write#35f4b478.write("HO"));
        },
    ) 
    ==#606c7034#553b4b8e#0 "HI\nHO\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$7: (arg_0: Handlers) => void) => {
  raise(handlers, "35f4b478", 0, "HI", (handlers, value) => ((handlers: Handlers) => {
    raise(handlers, "35f4b478", 0, "HO", (handlers, value) => done$7(handlers, value));
  })(handlers, value));
}), "HI\nHO\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> alwaysRead#1762d528<void#builtin>{Write#35f4b478}(
            value: "hi",
            fn: (): void#builtin ={Read#22024b72, Write#35f4b478}> print#eccbfbca(
                x: raise!(Read#22024b72.read()) ++#builtin " and " 
                    ++#builtin raise!(Read#22024b72.read()),
            ),
        ),
    ) 
    ==#606c7034#553b4b8e#0 "hi and hi\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$12: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("hi", (handlers: Handlers, done$14: (arg_0: Handlers) => void) => {
    raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_0$11: string) => {
      (() => {
        let arg_lift_0$9: string = arg_lift_0$11 + " and ";
        raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, arg_lift_1: string) => {
          (() => {
            let arg_lift_0$8: string = arg_lift_0$9 + arg_lift_1;
            hash_eccbfbca(arg_lift_0$8, handlers, (handlers: Handlers) => done$14(handlers));
          })();
        })(handlers, value));
      })();
    })(handlers, value));
  }, handlers, (handlers: Handlers, returnValue$16: T_0) => done$12(handlers));
}), "hi and hi\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> {
            print#eccbfbca(x: "A");
            print#eccbfbca(x: "B");
        },
    ) 
    ==#606c7034#553b4b8e#0 "A\nB\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$17: (arg_0: Handlers) => void) => {
  hash_eccbfbca("A", handlers, (handlers: Handlers) => {
    hash_eccbfbca("B", handlers, (handlers: Handlers) => done$17(handlers));
  });
}), "A\nB\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> alwaysRead#1762d528<void#builtin>{Write#35f4b478}(
            value: "hi",
            fn: (): void#builtin ={Read#22024b72, Write#35f4b478}> {
                print#eccbfbca(x: read#64605d94());
                print#eccbfbca(x: "YA");
                print#eccbfbca(x: read#64605d94());
                print#eccbfbca(x: "B");
            },
        ),
    ) 
    ==#606c7034#553b4b8e#0 "hi\nYA\nhi\nB\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$22: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("hi", (handlers: Handlers, done$24: (arg_0: Handlers) => void) => {
    hash_64605d94(handlers, (handlers: Handlers, returnValue$32: string) => {
      let arg_lift_0$20: string = returnValue$32;
      return (() => {
        hash_eccbfbca(arg_lift_0$20, handlers, (handlers: Handlers) => {
          hash_eccbfbca("YA", handlers, (handlers: Handlers) => {
            hash_64605d94(handlers, (handlers: Handlers, returnValue$28: string) => {
              let arg_lift_0$21: string = returnValue$28;
              return (() => {
                hash_eccbfbca(arg_lift_0$21, handlers, (handlers: Handlers) => {
                  hash_eccbfbca("B", handlers, (handlers: Handlers) => done$24(handlers));
                });
              })();
            });
          });
        });
      })();
    });
  }, handlers, (handlers: Handlers, returnValue$33: T_0) => done$22(handlers));
}), "hi\nYA\nhi\nB\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> alwaysRead#1762d528<void#builtin>{Write#35f4b478}(
            value: "hi",
            fn: (): void#builtin ={Read#22024b72, Write#35f4b478}> {
                raise!(Write#35f4b478.write("A"));
                const x#:0 = raise!(Read#22024b72.read());
                raise!(Write#35f4b478.write("B"));
            },
        ),
    ) 
    ==#606c7034#553b4b8e#0 "A\nB\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$34: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("hi", (handlers: Handlers, done$36: (arg_0: Handlers) => void) => {
    raise(handlers, "35f4b478", 0, "A", (handlers, value) => ((handlers: Handlers) => {
      raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, x: string) => {
        raise(handlers, "35f4b478", 0, "B", (handlers, value) => done$36(handlers, value));
      })(handlers, value));
    })(handlers, value));
  }, handlers, (handlers: Handlers, returnValue$37: T_0) => done$34(handlers));
}), "A\nB\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> alwaysRead#1762d528<void#builtin>{Write#35f4b478}(
            value: "hi",
            fn: (): void#builtin ={Read#22024b72, Write#35f4b478}> {
                const x#:0 = raise!(Read#22024b72.read());
                raise!(Write#35f4b478.write("B"));
            },
        ),
    ) 
    ==#606c7034#553b4b8e#0 "B\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$38: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("hi", (handlers: Handlers, done$40: (arg_0: Handlers) => void) => {
    raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, x: string) => {
      raise(handlers, "35f4b478", 0, "B", (handlers, value) => done$40(handlers, value));
    })(handlers, value));
  }, handlers, (handlers: Handlers, returnValue$41: T_0) => done$38(handlers));
}), "B\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> {
            alwaysRead#1762d528<void#builtin>{Write#35f4b478}(
                value: "Me",
                fn: printFullName#ea51ddfc,
            );
        },
    ) 
    ==#606c7034#553b4b8e#0 "What is your forename?\nWhat is your surname?\nMe Me\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$42: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("Me", hash_ea51ddfc, handlers, (handlers: Handlers, returnValue$44: T_0) => done$42(handlers));
}), "What is your forename?\nWhat is your surname?\nMe Me\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> reverse#f201f930(
            fn: (): void#builtin ={Write#35f4b478}> {
                print#eccbfbca(x: "A");
                print#eccbfbca(x: "B");
            },
        ),
    ) 
    ==#606c7034#553b4b8e#0 "B\nA\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$45: (arg_0: Handlers) => void) => {
  hash_f201f930((handlers: Handlers, done$47: (arg_0: Handlers) => void) => {
    hash_eccbfbca("A", handlers, (handlers: Handlers) => {
      hash_eccbfbca("B", handlers, (handlers: Handlers) => done$47(handlers));
    });
  }, handlers, (handlers: Handlers) => done$45(handlers));
}), "B\nA\nend");

/*
collect#2ce3943a{}(
        fn: (): void#builtin ={Write#35f4b478}> {
            reverse#f201f930(
                fn: (): void#builtin ={Write#35f4b478}> {
                    alwaysRead#1762d528<void#builtin>{Write#35f4b478}(
                        value: "Me",
                        fn: printFullName#ea51ddfc,
                    );
                },
            );
        },
    ) 
    ==#606c7034#553b4b8e#0 "Me Me\nWhat is your surname?\nWhat is your forename?\nend"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers: Handlers, done$50: (arg_0: Handlers) => void) => {
  hash_f201f930((handlers: Handlers, done$52: (arg_0: Handlers) => void) => {
    hash_1762d528.effectful("Me", hash_ea51ddfc, handlers, (handlers: Handlers, returnValue$54: T_0) => done$52(handlers));
  }, handlers, (handlers: Handlers) => done$50(handlers));
}), "Me Me\nWhat is your surname?\nWhat is your forename?\nend");

/*
pickTrue#268d3ca7<int#builtin>(fn: chooseDiff#61f16268) ==#9275f914#553b4b8e#0 10
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_268d3ca7(hash_61f16268), 10);

/*
pickMax#998219d8(fn: chooseDiff#61f16268) ==#9275f914#553b4b8e#0 25
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_998219d8(hash_61f16268), 25);

/*
backtrackPythag#db67c018(m: 4, n: 15) ==#606c7034#553b4b8e#0 "5:12"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_db67c018(4, 15), "5:12");

/*
backtrackPythag#db67c018(m: 7, n: 10) ==#606c7034#553b4b8e#0 "No solution found"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_db67c018(7, 10), "No solution found");

/*
backtrackPythagReverse#5f048050(m: 4, n: 15) ==#606c7034#553b4b8e#0 "9:12"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5f048050(4, 15), "9:12");

/*
10
*/
10;

/*
withInitialValue#478ee9c0<string#builtin>(value: 10, fn: getAndSet#463fdaf6) 
    ==#606c7034#553b4b8e#0 "10:14"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_478ee9c0(10, hash_463fdaf6), "10:14");

/*
withInitialValue#478ee9c0<int#builtin>(
        value: 4,
        fn: (): int#builtin ={Store#7b45d75e}> callPlus5#1d5e1778{Store#7b45d75e}(
            x: (): int#builtin ={Store#7b45d75e}> raise!(Store#7b45d75e.get()),
        ),
    ) 
    ==#9275f914#553b4b8e#0 9
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_478ee9c0(4, (handlers: Handlers, done$55: (arg_0: Handlers, arg_1: number) => void) => {
  hash_1d5e1778.effectful((handlers: Handlers, done$57: (arg_0: Handlers, arg_1: number) => void) => {
    raise(handlers, "7b45d75e", 0, null, (handlers, value) => done$57(handlers, value));
  }, handlers, (handlers: Handlers, returnValue$58: number) => done$55(handlers, returnValue$58));
}), 9);

/*
callPlus5#1d5e1778{}(x: (): int#builtin ={}> 4) ==#9275f914#553b4b8e#0 9
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_1d5e1778.direct(() => 4), 9);