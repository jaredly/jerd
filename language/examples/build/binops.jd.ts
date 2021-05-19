import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

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
type Addable#0cd54a60<T#:0> = {
    "+": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_0cd54a60<T_0> = {
  type: "0cd54a60";
  h0cd54a60_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
type Addable#0c2608f2<T#:0> = {
    "+": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_0c2608f2<T_0> = {
  type: "0c2608f2";
  h0c2608f2_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
type AddSub#71e2c398<T#:0> = {
    "+": (T#:0, T#:0) ={}> T#:0,
    "-": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_71e2c398<T_0> = {
  type: "71e2c398";
  h71e2c398_0: (arg_0: T_0, arg_1: T_0) => T_0;
  h71e2c398_1: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
type Scale#2924da20<T#:0> = {
    scale: (T#:0, float) ={}> T#:0,
}
```
*/
type t_2924da20<T_0> = {
  type: "2924da20";
  h2924da20_0: (arg_0: T_0, arg_1: number) => T_0;
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
  while (true) {
    let discriminant$8: [Array<T_0>, Array<T_0>] = [one$0, two$1];
    {
      if (discriminant$8[1].length == 0) {
        if (discriminant$8[0].length == 0) {
          return true;
        }
      }
    }
    {
      if (discriminant$8[1].length >= 1) {
        let two$5: T_0 = discriminant$8[1][0];
        {
          let rtwo$6: Array<T_0> = discriminant$8[1].slice(1);
          {
            if (discriminant$8[0].length >= 1) {
              let one$3: T_0 = discriminant$8[0][0];
              {
                let rone$4: Array<T_0> = discriminant$8[0].slice(1);
                {
                  if (eq$2.h553b4b8e_0(one$3, two$5)) {
                    let recur$9: Array<T_0> = rone$4;
                    let recur$10: Array<T_0> = rtwo$6;
                    let recur$11: t_553b4b8e<T_0> = eq$2;
                    one$0 = recur$9;
                    two$1 = recur$10;
                    eq$2 = recur$11;
                    continue;
                  } else {
                    return false;
                  }
                }
              }
            }
          }
        }
      }
    }
    {
      let _$7: [Array<T_0>, Array<T_0>] = discriminant$8;
      {
        return false;
      }
    }
    {
      throw "Math failed";
    }
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
const deep#dcfc5c32: float = (1.0 * (2.0 - (3.0 * (4.0 + (2.0 * 10.0)))))
```
*/
export const hash_dcfc5c32: number = 1 * (2 - 3 * (4 + 2 * 10));

/**
```
const den#70ad3796: float = (1.0 * (2.0 - (3.0 * 5.0)))
```
*/
export const hash_70ad3796: number = 1 * (2 - 3 * 5);

/**
```
const FloatEq#c41f7386: Eq#553b4b8e<float> = Eq#553b4b8e<float>{"=="#553b4b8e#0: floatEq}
```
*/
export const hash_c41f7386: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: floatEq
} as t_553b4b8e<number>);

/**
```
const ArrayIntEq#4419935c: Eq#553b4b8e<Array<int>> = ArrayEq#bef2134a<int>(IntEq#9275f914)
```
*/
export const hash_4419935c: t_553b4b8e<Array<T_0>> = hash_bef2134a(hash_9275f914);

/**
```
const goToTown#a4c2a3f0: (Tuple2<int, int>) ={}> int = (t#:0: Tuple2<int, int>) ={}> t#:0.0
```
*/
export const hash_a4c2a3f0: (arg_0: [number, number]) => number = (t$0: [number, number]) => t$0[0];

/**
```
const IntArrayAddable#f2052a3a: Addable#0cd54a60<Array<int>> = Addable#0cd54a60<Array<int>>{
    "+"#0cd54a60#0: (a#:0: Array<int>, b#:1: Array<int>) ={}> concat<int>(a#:0, b#:1),
}
```
*/
export const hash_f2052a3a: t_0cd54a60<Array<number>> = ({
  type: "0cd54a60",
  h0cd54a60_0: (a$0: Array<number>, b$1: Array<number>) => concat(a$0, b$1)
} as t_0cd54a60<Array<number>>);

/*
IntArrayAddable#f2052a3a."+"#0cd54a60#0(<int>[1], <int>[2, 3])
*/
hash_f2052a3a.h0cd54a60_0([1], [2, 3]);

/*
IntEq#9275f914."=="#553b4b8e#0(goToTown#a4c2a3f0((2, 3)), 2)
*/
assertCall(hash_9275f914.h553b4b8e_0, hash_a4c2a3f0([2, 3]), 2);

/*
ArrayEq#bef2134a<int>(IntEq#9275f914)."=="#553b4b8e#0(<int>[1, 2], <int>[1, 2])
*/
assertCall(hash_bef2134a(hash_9275f914).h553b4b8e_0, [1, 2], [1, 2]);

/*
ArrayEq#bef2134a<int>(IntEq#9275f914)."=="#553b4b8e#0(<int>[1, 2, 3], <int>[1, 2, 3])
*/
assertCall(hash_bef2134a(hash_9275f914).h553b4b8e_0, [1, 2, 3], [1, 2, 3]);

/*
ArrayIntEq#4419935c."=="#553b4b8e#0(<int>[1, 2], <int>[1, 2])
*/
assertCall(hash_4419935c.h553b4b8e_0, [1, 2], [1, 2]);

/*
IntEq#9275f914."=="#553b4b8e#0((1 + (2 * 3)), 7)
*/
assertCall(hash_9275f914.h553b4b8e_0, 1 + 2 * 3, 7);

/*
FloatEq#c41f7386."=="#553b4b8e#0(den#70ad3796, -13.0)
*/
assertCall(hash_c41f7386.h553b4b8e_0, hash_70ad3796, -13);

/*
FloatEq#c41f7386."=="#553b4b8e#0(deep#dcfc5c32, -70.0)
*/
assertCall(hash_c41f7386.h553b4b8e_0, hash_dcfc5c32, -70);