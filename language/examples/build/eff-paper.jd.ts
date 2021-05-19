import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];
type handle086e3532 = [(arg_0: (arg_0: handle086e3532, arg_1: boolean) => void) => void];
type handle7214565c = [(arg_0: (arg_0: handle7214565c, arg_1: boolean) => void) => void, (arg_0: (arg_0: handle7214565c, arg_1: number) => void) => void];
type handle7b45d75e = [(arg_0: (arg_0: handle7b45d75e, arg_1: number) => void) => void, (arg_0: number, arg_1: (arg_0: handle7b45d75e) => void) => void];

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
const decide#6ab06b22: () ={DecideOrFail#7214565c}> bool = () ={DecideOrFail#7214565c}> raise!(
    DecideOrFail#7214565c.decide(),
)
```
*/
export const hash_6ab06b22:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: boolean) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: boolean) => void) => {
  raise(handlers$15000, "7214565c", 0, null, (handlers$15000, value) => done$1(handlers$15000, value));
};

/**
```
const fail#0620e972: () ={DecideOrFail#7214565c}> int = () ={DecideOrFail#7214565c}> raise!(
    DecideOrFail#7214565c.fail(),
)
```
*/
export const hash_0620e972:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: number) => void) => {
  raise(handlers$15000, "7214565c", 1, null, (handlers$15000, value) => done$1(handlers$15000, value));
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
const chooseInt#54cbbab4: (int, int) ={DecideOrFail#7214565c}> int = (m#:0: int, n#:1: int) ={
    DecideOrFail#7214565c,
}> {
    if (m#:0 > n#:1) {
        fail#0620e972();
        10;
    } else {
        if decide#6ab06b22() {
            m#:0;
        } else {
            54cbbab4((m#:0 + 1), n#:1);
        };
    };
}
```
*/
export const hash_54cbbab4:
/*from cps lambda*/
(arg_0: number, arg_1: number, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: number) => void) => void = (m$0: number, n$1: number, handlers$15000: Handlers, done$3: (arg_0: Handlers, arg_1: number) => void) => {
  if (m$0 > n$1) {
    hash_0620e972(handlers$15000, (handlers$15000: Handlers, returnValue$5: number) => done$3(handlers$15000, 10));
  } else {
    hash_6ab06b22(handlers$15000, (handlers$15000: Handlers, returnValue$9: boolean) => ((handlers$15000: Handlers) => {
      if (returnValue$9) {
        done$3(handlers$15000, m$0);
      } else {
        hash_54cbbab4(m$0 + 1, n$1, handlers$15000, (handlers$15000: Handlers, returnValue$7: number) => done$3(handlers$15000, returnValue$7));
      }
    })(handlers$15000));
  }
};

/**
```
const decide#5334ea40: () ={Decide#086e3532}> bool = () ={Decide#086e3532}> raise!(
    Decide#086e3532.decide(),
)
```
*/
export const hash_5334ea40:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: boolean) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: boolean) => void) => {
  raise(handlers$15000, "086e3532", 0, null, (handlers$15000, value) => done$1(handlers$15000, value));
};

/**
```
const pythagorean#0cdd5ff0: (int, int) ={DecideOrFail#7214565c}> string = (m#:0: int, n#:1: int) ={
    DecideOrFail#7214565c,
}> {
    const a#:2 = chooseInt#54cbbab4(m#:0, (n#:1 - 1));
    const b#:3 = chooseInt#54cbbab4((a#:2 + 1), n#:1);
    const a2#:4 = (a#:2 * a#:2);
    const b2#:5 = (b#:3 * b#:3);
    log(((("a " + a2#:4 as#1175499e string) + " b ") + b2#:5 as#1175499e string));
    if isSquare((a2#:4 + b2#:5)) {
        ((intToString(a#:2) ++ ":") ++ intToString(b#:3));
    } else {
        fail#0620e972();
        "??? how did this return";
    };
}
```
*/
export const hash_0cdd5ff0:
/*from cps lambda*/
(arg_0: number, arg_1: number, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: string) => void) => void = (m$0: number, n$1: number, handlers$15000: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
  hash_54cbbab4(m$0, n$1 - 1, handlers$15000, (handlers$15000: Handlers, returnValue$12: number) => hash_54cbbab4(returnValue$12 + 1, n$1, handlers$15000, (handlers$15000: Handlers, returnValue$10: number) => ((handlers$15000: Handlers) => {
    if (isSquare(returnValue$12 * returnValue$12 + returnValue$10 * returnValue$10)) {
      done$6(handlers$15000, intToString(returnValue$12) + ":" + intToString(returnValue$10));
    } else {
      hash_0620e972(handlers$15000, (handlers$15000: Handlers, returnValue$8: number) => done$6(handlers$15000, "??? how did this return"));
    }
  })(handlers$15000)));
};

/**
```
const backtrackReverse#70ad2630: <T#:0>(() ={DecideOrFail#7214565c}> T#:0, () ={}> T#:0) ={}> T#:0 = <
    T#:0,
>(fn#:0: () ={DecideOrFail#7214565c}> T#:0, orElse#:1: () ={}> T#:0) ={}> {
    handle! fn#:0 {
        DecideOrFail.decide#0(() => k#:3) => {
            70ad2630<T#:0>(
                () ={DecideOrFail#7214565c}> k#:3(false),
                () ={}> 70ad2630<T#:0>(() ={DecideOrFail#7214565c}> k#:3(true), orElse#:1),
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, arg_1: () => T_0) => T_0 = <T_0>(fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, orElse$1: () => T_0) => {
  let result$4: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("7214565c", fn$0, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = hash_70ad2630((handlers$15000: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(false, handlers$15000, (handlers$15000: Handlers, returnValue$7: T_0) => done$5(handlers$15000, returnValue$7));
    }, () => hash_70ad2630((handlers$15000: Handlers, done$8: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(true, handlers$15000, (handlers$15000: Handlers, returnValue$10: T_0) => done$8(handlers$15000, returnValue$10));
    }, orElse$1));
  }, (handlers$15000, _, _$4:
  /*from cps lambda*/
  (arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = orElse$1();
  }], (handlers$15000: Handlers, x$2: T_0) => {
    result$4 = x$2;
  });
  return result$4;
};

/**
```
const backtrack#1603c390: <T#:0>(() ={DecideOrFail#7214565c}> T#:0, () ={}> T#:0) ={}> T#:0 = <T#:0>(
    fn#:0: () ={DecideOrFail#7214565c}> T#:0,
    orElse#:1: () ={}> T#:0,
) ={}> {
    handle! fn#:0 {
        DecideOrFail.decide#0(() => k#:3) => {
            1603c390<T#:0>(
                () ={DecideOrFail#7214565c}> k#:3(true),
                () ={}> 1603c390<T#:0>(() ={DecideOrFail#7214565c}> k#:3(false), orElse#:1),
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, arg_1: () => T_0) => T_0 = <T_0>(fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, orElse$1: () => T_0) => {
  let result$4: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("7214565c", fn$0, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = hash_1603c390((handlers$15000: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(true, handlers$15000, (handlers$15000: Handlers, returnValue$7: T_0) => done$5(handlers$15000, returnValue$7));
    }, () => hash_1603c390((handlers$15000: Handlers, done$8: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(false, handlers$15000, (handlers$15000: Handlers, returnValue$10: T_0) => done$8(handlers$15000, returnValue$10));
    }, orElse$1));
  }, (handlers$15000, _, _$4:
  /*from cps lambda*/
  (arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = orElse$1();
  }], (handlers$15000: Handlers, x$2: T_0) => {
    result$4 = x$2;
  });
  return result$4;
};

/**
```
const choose#437fecbe: <T#:0>(T#:0, T#:0) ={Decide#086e3532}> T#:0 = <T#:0>(x#:0: T#:0, y#:1: T#:0) ={
    Decide#086e3532,
}> {
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
<T_0>(arg_0: T_0, arg_1: T_0, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: T_0) => void) => void = <T_0>(x$0: T_0, y$1: T_0, handlers$15000: Handlers, done$3: (arg_0: Handlers, arg_1: T_0) => void) => {
  hash_5334ea40(handlers$15000, (handlers$15000: Handlers, returnValue$5: boolean) => done$3(handlers$15000, (() => {
    if (returnValue$5) {
      return x$0;
    } else {
      return y$1;
    }
  })()));
};

/**
```
const print#eccbfbca: (string) ={Write#35f4b478}> void = (x#:0: string) ={Write#35f4b478}> raise!(
    Write#35f4b478.write(x#:0),
)
```
*/
export const hash_eccbfbca:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (x$0: string, handlers$15000: Handlers, done$1: (arg_0: Handlers) => void) => {
  raise(handlers$15000, "35f4b478", 0, x$0, (handlers$15000, value) => done$1(handlers$15000, value));
};

/**
```
const callPlus5#1d5e1778: {e#:0}(() ={e#:0}> int) ={e#:0}> int = {e#:0}(x#:0: () ={e#:0}> int) ={
    e#:0,
}> (x#:0() + 5)
```
*/
export const hash_1d5e1778: any = {
  effectful: (x$5:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void, handlers$15000: Handlers, done$6: (arg_0: Handlers, arg_1: number) => void) => {
    x$5(handlers$15000, (handlers$15000: Handlers, returnValue$7: number) => done$6(handlers$15000, returnValue$7 + 5));
  },
  direct: (x$0: () => number) => {
    return x$0() + 5;
  }
};

/**
```
const getAndSet#463fdaf6: () ={Store#7b45d75e}> string = () ={Store#7b45d75e}> {
    const x#:0 = raise!(Store#7b45d75e.get());
    raise!(Store#7b45d75e.set((x#:0 + 4)));
    ((intToString(x#:0) ++ ":") ++ intToString(raise!(Store#7b45d75e.get())));
}
```
*/
export const hash_463fdaf6:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers$15000: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers$15000, "7b45d75e", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, x$0: number) => raise(handlers$15000, "7b45d75e", 1, x$0 + 4, (handlers$15000, value) => ((handlers$15000: Handlers) => {
    raise(handlers$15000, "7b45d75e", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_0$2: number) => done$3(handlers$15000, intToString(x$0) + ":" + intToString(arg_lift_0$2)))(handlers$15000, value));
  })(handlers$15000, value)))(handlers$15000, value));
};

/**
```
const withInitialValue#478ee9c0: <T#:0>(int, () ={Store#7b45d75e}> T#:0) ={}> T#:0 = <T#:0>(
    value#:0: int,
    fn#:1: () ={Store#7b45d75e}> T#:0,
) ={}> {
    handle! fn#:1 {
        Store.get#0(() => k#:3) => 478ee9c0<T#:0>(value#:0, () ={Store#7b45d75e}> k#:3(value#:0)),
        Store.set#1((newValue#:4) => k#:5) => 478ee9c0<T#:0>(newValue#:4, k#:5),
        pure(x#:2) => x#:2,
    };
}
```
*/
export const hash_478ee9c0: <T_0>(arg_0: number, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(value$0: number, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$6: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("7b45d75e", fn$1, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$6 = hash_478ee9c0(value$0, (handlers$15000: Handlers, done$7: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(value$0, handlers$15000, (handlers$15000: Handlers, returnValue$9: T_0) => done$7(handlers$15000, returnValue$9));
    });
  }, (handlers$15000, newValue$4: number, k$5:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$6 = hash_478ee9c0(newValue$4, k$5);
  }], (handlers$15000: Handlers, x$2: T_0) => {
    result$6 = x$2;
  });
  return result$6;
};

/**
```
const backtrackPythagReverse#5f048050: (int, int) ={}> string = (m#:0: int, n#:1: int) ={}> backtrackReverse#70ad2630<
    string,
>(() ={DecideOrFail#7214565c}> pythagorean#0cdd5ff0(m#:0, n#:1), () ={}> "No solution found")
```
*/
export const hash_5f048050: (arg_0: number, arg_1: number) => T_0 = (m$0: number, n$1: number) => hash_70ad2630((handlers$15000: Handlers, done$2: (arg_0: Handlers, arg_1: string) => void) => {
  hash_0cdd5ff0(m$0, n$1, handlers$15000, (handlers$15000: Handlers, returnValue$4: string) => done$2(handlers$15000, returnValue$4));
}, () => "No solution found");

/**
```
const backtrackPythag#db67c018: (int, int) ={}> string = (m#:0: int, n#:1: int) ={}> backtrack#1603c390<
    string,
>(() ={DecideOrFail#7214565c}> pythagorean#0cdd5ff0(m#:0, n#:1), () ={}> "No solution found")
```
*/
export const hash_db67c018: (arg_0: number, arg_1: number) => T_0 = (m$0: number, n$1: number) => hash_1603c390((handlers$15000: Handlers, done$2: (arg_0: Handlers, arg_1: string) => void) => {
  hash_0cdd5ff0(m$0, n$1, handlers$15000, (handlers$15000: Handlers, returnValue$4: string) => done$2(handlers$15000, returnValue$4));
}, () => "No solution found");

/**
```
const pickMax#998219d8: (() ={Decide#086e3532}> int) ={}> int = (fn#:0: () ={Decide#086e3532}> int) ={}> handle! fn#:0 {
    Decide.decide#0(() => k#:2) => {
        const xt#:3 = 998219d8(() ={Decide#086e3532}> k#:2(true));
        const xf#:4 = 998219d8(() ={Decide#086e3532}> k#:2(false));
        if (xt#:3 > xf#:4) {
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
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void) => number = (fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void) => {
  let result$5: number = (null as any);
  handleSimpleShallow2<any, any, any>("086e3532", fn$0, [(handlers$15000, _, k$2:
  /*from cps lambda*/
  (arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: number) => void) => void) => {
    result$5 = (() => {
      let xt$3: number = hash_998219d8((handlers$15000: Handlers, done$6: (arg_0: Handlers, arg_1: number) => void) => {
        k$2(true, handlers$15000, (handlers$15000: Handlers, returnValue$8: number) => done$6(handlers$15000, returnValue$8));
      });
      let xf$4: number = hash_998219d8((handlers$15000: Handlers, done$9: (arg_0: Handlers, arg_1: number) => void) => {
        k$2(false, handlers$15000, (handlers$15000: Handlers, returnValue$11: number) => done$9(handlers$15000, returnValue$11));
      });

      if (xt$3 > xf$4) {
        return xt$3;
      } else {
        return xf$4;
      }
    })();
  }], (handlers$15000: Handlers, x$1: number) => {
    result$5 = x$1;
  });
  return result$5;
};

/**
```
const chooseDiff#61f16268: () ={Decide#086e3532}> int = () ={Decide#086e3532}> {
    const x1#:0 = choose#437fecbe<int>(15, 30);
    const x2#:1 = choose#437fecbe<int>(5, 10);
    (x1#:0 - x2#:1);
}
```
*/
export const hash_61f16268:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: number) => void) => void = (handlers$15000: Handlers, done$2: (arg_0: Handlers, arg_1: number) => void) => {
  hash_437fecbe(15, 30, handlers$15000, (handlers$15000: Handlers, returnValue$6: T_0) => hash_437fecbe(5, 10, handlers$15000, (handlers$15000: Handlers, returnValue$4: T_0) => done$2(handlers$15000, returnValue$6 - returnValue$4)));
};

/**
```
const pickTrue#268d3ca7: <T#:0>(() ={Decide#086e3532}> T#:0) ={}> T#:0 = <T#:0>(
    fn#:0: () ={Decide#086e3532}> T#:0,
) ={}> handle! fn#:0 {
    Decide.decide#0(() => k#:2) => 268d3ca7<T#:0>(() ={Decide#086e3532}> k#:2(true)),
    pure(x#:1) => x#:1,
}
```
*/
export const hash_268d3ca7: <T_0>(arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$3: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("086e3532", fn$0, [(handlers$15000, _, k$2:
  /*from cps lambda*/
  (arg_0: boolean, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$3 = hash_268d3ca7((handlers$15000: Handlers, done$4: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$2(true, handlers$15000, (handlers$15000: Handlers, returnValue$6: T_0) => done$4(handlers$15000, returnValue$6));
    });
  }], (handlers$15000: Handlers, x$1: T_0) => {
    result$3 = x$1;
  });
  return result$3;
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
const reverse#f201f930: (() ={Write#35f4b478}> void) ={Write#35f4b478}> void = (
    fn#:0: () ={Write#35f4b478}> void,
) ={Write#35f4b478}> {
    handle! fn#:0 {
        Write.write#0((v#:2) => k#:3) => {
            f201f930(k#:3);
            print#eccbfbca(v#:2);
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
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void, arg_1: Handlers, arg_2: (arg_0: Handlers) => void) => void = (fn$0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void, handlers$15000: Handlers, done$4: (arg_0: Handlers) => void) => {
  handleSimpleShallow2<any, any, any>("35f4b478", fn$0, [(handlers$15000, v$2: string, k$3:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void) => {
    hash_f201f930(k$3, handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca(v$2, handlers$15000, (handlers$15000: Handlers) => done$4(handlers$15000)));
  }], (handlers$15000: Handlers, a$1: void) => {
    done$4(handlers$15000);
  }, handlers$15000);
};

/**
```
const printFullName#ea51ddfc: () ={Read#22024b72, Write#35f4b478}> void = () ={
    Read#22024b72,
    Write#35f4b478,
}> {
    print#eccbfbca("What is your forename?");
    const foreName#:0 = raise!(Read#22024b72.read());
    print#eccbfbca("What is your surname?");
    const surName#:1 = raise!(Read#22024b72.read());
    print#eccbfbca(((foreName#:0 ++ " ") ++ surName#:1));
}
```
*/
export const hash_ea51ddfc:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void) => void = (handlers$15000: Handlers, done$2: (arg_0: Handlers) => void) => {
  hash_eccbfbca("What is your forename?", handlers$15000, (handlers$15000: Handlers) => raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, foreName$0: string) => hash_eccbfbca("What is your surname?", handlers$15000, (handlers$15000: Handlers) => raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, surName$1: string) => hash_eccbfbca(foreName$0 + " " + surName$1, handlers$15000, (handlers$15000: Handlers) => done$2(handlers$15000)))(handlers$15000, value))))(handlers$15000, value)));
};

/**
```
const read#64605d94: () ={Read#22024b72}> string = () ={Read#22024b72}> raise!(Read#22024b72.read())
```
*/
export const hash_64605d94:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers$15000: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => done$1(handlers$15000, value));
};

/**
```
const alwaysRead#1762d528: <T#:0>{e#:0}(string, () ={Read#22024b72, e#:0}> T#:0) ={e#:0}> T#:0 = <
    T#:0,
>{e#:0}(value#:0: string, fn#:1: () ={Read#22024b72, e#:0}> T#:0) ={e#:0}> {
    handle! fn#:1 {
        Read.read#0(() => k#:3) => {
            1762d528<T#:0>{e#:0}(value#:0, () ={Read#22024b72, e#:0}> k#:3(value#:0));
        },
        pure(a#:2) => a#:2,
    };
}
```
*/
export const hash_1762d528: any = {
  effectful: <T_0>(value$14: string, fn$15:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void, handlers$15000: Handlers, done$16: (arg_0: Handlers, arg_1: T_0) => void) => {
    handleSimpleShallow2<any, any, any>("22024b72", fn$15, [(handlers$15000, _, k$17:
    /*from cps lambda*/
    (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
      hash_1762d528.effectful(value$14, (handlers$15000: Handlers, done$19: (arg_0: Handlers, arg_1: T_0) => void) => {
        k$17(value$14, handlers$15000, (handlers$15000: Handlers, returnValue$20: T_0) => done$19(handlers$15000, returnValue$20));
      }, handlers$15000, (handlers$15000: Handlers, returnValue$21: T_0) => done$16(handlers$15000, returnValue$21));
    }], (handlers$15000: Handlers, a$18: T_0) => {
      done$16(handlers$15000, a$18);
    }, handlers$15000);
  },
  direct: <T_0>(value$0: string, fn$1:
  /*from cps lambda*/
  (arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    let result$4: T_0 = (null as any);
    handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers$15000, _, k$3:
    /*from cps lambda*/
    (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
      result$4 = hash_1762d528.direct(value$0, (handlers$15000: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
        k$3(value$0, handlers$15000, (handlers$15000: Handlers, returnValue$7: T_0) => done$5(handlers$15000, returnValue$7));
      });
    }], (handlers$15000: Handlers, a$2: T_0) => {
      result$4 = a$2;
    });
    return result$4;
  }
};

/**
```
const collect#2ce3943a: {e#:0}(() ={Write#35f4b478, e#:0}> void) ={e#:0}> string = {e#:0}(
    fn#:0: () ={Write#35f4b478, e#:0}> void,
) ={e#:0}> {
    handle! fn#:0 {
        Write.write#0((v#:2) => k#:3) => {
            ((v#:2 ++ "\n") ++ 2ce3943a{e#:0}(() ={Write#35f4b478, e#:0}> k#:3()));
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
const StringEq#606c7034: Eq#553b4b8e<string> = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> {
            raise!(Write#35f4b478.write("one"));
            raise!(Write#35f4b478.write("two"));
            raise!(Write#35f4b478.write("three"));
        },
    ),
    "one\ntwo\nthree\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$1: (arg_0: Handlers) => void) => {
  raise(handlers$15000, "35f4b478", 0, "one", (handlers$15000, value) => ((handlers$15000: Handlers) => {
    raise(handlers$15000, "35f4b478", 0, "two", (handlers$15000, value) => ((handlers$15000: Handlers) => {
      raise(handlers$15000, "35f4b478", 0, "three", (handlers$15000, value) => done$1(handlers$15000, value));
    })(handlers$15000, value));
  })(handlers$15000, value));
}), "one\ntwo\nthree\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(() ={Write#35f4b478}> {
        print#eccbfbca("HI");
    }),
    "HI\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$2: (arg_0: Handlers) => void) => {
  hash_eccbfbca("HI", handlers$15000, (handlers$15000: Handlers) => done$2(handlers$15000));
}), "HI\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(() ={Write#35f4b478}> {
        print#eccbfbca("HI");
        print#eccbfbca("HO");
    }),
    "HI\nHO\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$4: (arg_0: Handlers) => void) => {
  hash_eccbfbca("HI", handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca("HO", handlers$15000, (handlers$15000: Handlers) => done$4(handlers$15000)));
}), "HI\nHO\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> {
            raise!(Write#35f4b478.write("HI"));
            raise!(Write#35f4b478.write("HO"));
        },
    ),
    "HI\nHO\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$7: (arg_0: Handlers) => void) => {
  raise(handlers$15000, "35f4b478", 0, "HI", (handlers$15000, value) => ((handlers$15000: Handlers) => {
    raise(handlers$15000, "35f4b478", 0, "HO", (handlers$15000, value) => done$7(handlers$15000, value));
  })(handlers$15000, value));
}), "HI\nHO\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> alwaysRead#1762d528<void>{Write#35f4b478}(
            "hi",
            () ={Read#22024b72, Write#35f4b478}> print#eccbfbca(
                ((raise!(Read#22024b72.read()) ++ " and ") ++ raise!(Read#22024b72.read())),
            ),
        ),
    ),
    "hi and hi\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$12: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("hi", (handlers$15000: Handlers, done$14: (arg_0: Handlers) => void) => {
    raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_0$11: string) => raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, arg_lift_1$10: string) => hash_eccbfbca(arg_lift_0$11 + " and " + arg_lift_1$10, handlers$15000, (handlers$15000: Handlers) => done$14(handlers$15000)))(handlers$15000, value)))(handlers$15000, value));
  }, handlers$15000, (handlers$15000: Handlers, returnValue$16: T_0) => done$12(handlers$15000));
}), "hi and hi\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(() ={Write#35f4b478}> {
        print#eccbfbca("A");
        print#eccbfbca("B");
    }),
    "A\nB\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$17: (arg_0: Handlers) => void) => {
  hash_eccbfbca("A", handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca("B", handlers$15000, (handlers$15000: Handlers) => done$17(handlers$15000)));
}), "A\nB\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> alwaysRead#1762d528<void>{Write#35f4b478}(
            "hi",
            () ={Read#22024b72, Write#35f4b478}> {
                print#eccbfbca(read#64605d94());
                print#eccbfbca("YA");
                print#eccbfbca(read#64605d94());
                print#eccbfbca("B");
            },
        ),
    ),
    "hi\nYA\nhi\nB\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$22: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("hi", (handlers$15000: Handlers, done$24: (arg_0: Handlers) => void) => {
    hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$32: string) => hash_eccbfbca(returnValue$32, handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca("YA", handlers$15000, (handlers$15000: Handlers) => hash_64605d94(handlers$15000, (handlers$15000: Handlers, returnValue$28: string) => hash_eccbfbca(returnValue$28, handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca("B", handlers$15000, (handlers$15000: Handlers) => done$24(handlers$15000)))))));
  }, handlers$15000, (handlers$15000: Handlers, returnValue$33: T_0) => done$22(handlers$15000));
}), "hi\nYA\nhi\nB\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> alwaysRead#1762d528<void>{Write#35f4b478}(
            "hi",
            () ={Read#22024b72, Write#35f4b478}> {
                raise!(Write#35f4b478.write("A"));
                const x#:0 = raise!(Read#22024b72.read());
                raise!(Write#35f4b478.write("B"));
            },
        ),
    ),
    "A\nB\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$34: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("hi", (handlers$15000: Handlers, done$36: (arg_0: Handlers) => void) => {
    raise(handlers$15000, "35f4b478", 0, "A", (handlers$15000, value) => ((handlers$15000: Handlers) => {
      raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, x$0: string) => raise(handlers$15000, "35f4b478", 0, "B", (handlers$15000, value) => done$36(handlers$15000, value)))(handlers$15000, value));
    })(handlers$15000, value));
  }, handlers$15000, (handlers$15000: Handlers, returnValue$37: T_0) => done$34(handlers$15000));
}), "A\nB\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> alwaysRead#1762d528<void>{Write#35f4b478}(
            "hi",
            () ={Read#22024b72, Write#35f4b478}> {
                const x#:0 = raise!(Read#22024b72.read());
                raise!(Write#35f4b478.write("B"));
            },
        ),
    ),
    "B\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$38: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("hi", (handlers$15000: Handlers, done$40: (arg_0: Handlers) => void) => {
    raise(handlers$15000, "22024b72", 0, null, (handlers$15000, value) => ((handlers$15000: Handlers, x$0: string) => raise(handlers$15000, "35f4b478", 0, "B", (handlers$15000, value) => done$40(handlers$15000, value)))(handlers$15000, value));
  }, handlers$15000, (handlers$15000: Handlers, returnValue$41: T_0) => done$38(handlers$15000));
}), "B\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> {
            alwaysRead#1762d528<void>{Write#35f4b478}("Me", printFullName#ea51ddfc);
        },
    ),
    "What is your forename?\nWhat is your surname?\nMe Me\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$42: (arg_0: Handlers) => void) => {
  hash_1762d528.effectful("Me", hash_ea51ddfc, handlers$15000, (handlers$15000: Handlers, returnValue$44: T_0) => done$42(handlers$15000));
}), "What is your forename?\nWhat is your surname?\nMe Me\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> reverse#f201f930(
            () ={Write#35f4b478}> {
                print#eccbfbca("A");
                print#eccbfbca("B");
            },
        ),
    ),
    "B\nA\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$45: (arg_0: Handlers) => void) => {
  hash_f201f930((handlers$15000: Handlers, done$47: (arg_0: Handlers) => void) => {
    hash_eccbfbca("A", handlers$15000, (handlers$15000: Handlers) => hash_eccbfbca("B", handlers$15000, (handlers$15000: Handlers) => done$47(handlers$15000)));
  }, handlers$15000, (handlers$15000: Handlers) => done$45(handlers$15000));
}), "B\nA\nend");

/*
StringEq#606c7034."=="#553b4b8e#0(
    collect#2ce3943a{}(
        () ={Write#35f4b478}> {
            reverse#f201f930(
                () ={Write#35f4b478}> {
                    alwaysRead#1762d528<void>{Write#35f4b478}("Me", printFullName#ea51ddfc);
                },
            );
        },
    ),
    "Me Me\nWhat is your surname?\nWhat is your forename?\nend",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_2ce3943a.direct((handlers$15000: Handlers, done$50: (arg_0: Handlers) => void) => {
  hash_f201f930((handlers$15000: Handlers, done$52: (arg_0: Handlers) => void) => {
    hash_1762d528.effectful("Me", hash_ea51ddfc, handlers$15000, (handlers$15000: Handlers, returnValue$54: T_0) => done$52(handlers$15000));
  }, handlers$15000, (handlers$15000: Handlers) => done$50(handlers$15000));
}), "Me Me\nWhat is your surname?\nWhat is your forename?\nend");

/*
IntEq#9275f914."=="#553b4b8e#0(pickTrue#268d3ca7<int>(chooseDiff#61f16268), 10)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_268d3ca7(hash_61f16268), 10);

/*
IntEq#9275f914."=="#553b4b8e#0(pickMax#998219d8(chooseDiff#61f16268), 25)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_998219d8(hash_61f16268), 25);

/*
StringEq#606c7034."=="#553b4b8e#0(backtrackPythag#db67c018(4, 15), "5:12")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_db67c018(4, 15), "5:12");

/*
StringEq#606c7034."=="#553b4b8e#0(backtrackPythag#db67c018(7, 10), "No solution found")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_db67c018(7, 10), "No solution found");

/*
StringEq#606c7034."=="#553b4b8e#0(backtrackPythagReverse#5f048050(4, 15), "9:12")
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5f048050(4, 15), "9:12");

/*
10
*/
10;

/*
StringEq#606c7034."=="#553b4b8e#0(
    withInitialValue#478ee9c0<string>(10, getAndSet#463fdaf6),
    "10:14",
)
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_478ee9c0(10, hash_463fdaf6), "10:14");

/*
IntEq#9275f914."=="#553b4b8e#0(
    withInitialValue#478ee9c0<int>(
        4,
        () ={Store#7b45d75e}> callPlus5#1d5e1778{Store#7b45d75e}(
            () ={Store#7b45d75e}> raise!(Store#7b45d75e.get()),
        ),
    ),
    9,
)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_478ee9c0(4, (handlers$15000: Handlers, done$55: (arg_0: Handlers, arg_1: number) => void) => {
  hash_1d5e1778.effectful((handlers$15000: Handlers, done$57: (arg_0: Handlers, arg_1: number) => void) => {
    raise(handlers$15000, "7b45d75e", 0, null, (handlers$15000, value) => done$57(handlers$15000, value));
  }, handlers$15000, (handlers$15000: Handlers, returnValue$58: number) => done$55(handlers$15000, returnValue$58));
}), 9);

/*
IntEq#9275f914."=="#553b4b8e#0(callPlus5#1d5e1778{}(() ={}> 4), 9)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_1d5e1778.direct(() => 4), 9);