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
const clampF#f2f2e188: (float, float, float) ={}> float = (
    v#:0: float,
    minv#:1: float,
    maxv#:2: float,
) ={}> max(min(v#:0, maxv#:2), minv#:1)
```
*/
export const hash_f2f2e188: (arg_0: number, arg_1: number, arg_2: number) => number = (v$0: number, minv$1: number, maxv$2: number) => max(min(v$0, maxv$2), minv$1);

/**
```
const negVec3#4129390c: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> {
    Vec3#9f1c0644{
        x#43802a16#0: -v#:0.x#43802a16#0,
        y#43802a16#1: -v#:0.y#43802a16#1,
        z#9f1c0644#0: -v#:0.z#9f1c0644#0,
    };
}
```
*/
export const hash_4129390c: (arg_0: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644) => ({
  type: "Vec3",
  x: -v$0.x,
  y: -v$0.y,
  z: -v$0.z
} as t_9f1c0644);

/**
```
const ScaleVec3Rev#68f73ad4: Div#5ac12902<Vec3#9f1c0644, float, Vec3#9f1c0644> = Div#5ac12902<
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
>{
    "/"#5ac12902#0: (v#:0: Vec3#9f1c0644, scale#:1: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 / scale#:1),
    },
}
```
*/
export const hash_68f73ad4: t_5ac12902<t_9f1c0644, number, t_9f1c0644> = ({
  type: "5ac12902",
  h5ac12902_0: (v$0: t_9f1c0644, scale$1: number) => ({
    type: "Vec3",
    x: v$0.x / scale$1,
    y: v$0.y / scale$1,
    z: v$0.z / scale$1
  } as t_9f1c0644)
} as t_5ac12902<t_9f1c0644, number, t_9f1c0644>);

/**
```
const roundv#65acfcda: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
    x#43802a16#0: round(v#:0.x#43802a16#0),
    y#43802a16#1: round(v#:0.y#43802a16#1),
    z#9f1c0644#0: round(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_65acfcda: (arg_0: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644) => ({
  type: "Vec3",
  x: round(v$0.x),
  y: round(v$0.y),
  z: round(v$0.z)
} as t_9f1c0644);

/**
```
const clamp#5483fdc2: (Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    v#:0: Vec3#9f1c0644,
    min#:1: Vec3#9f1c0644,
    max#:2: Vec3#9f1c0644,
) ={}> Vec3#9f1c0644{
    x#43802a16#0: clampF#f2f2e188(v#:0.x#43802a16#0, min#:1.x#43802a16#0, max#:2.x#43802a16#0),
    y#43802a16#1: clampF#f2f2e188(v#:0.y#43802a16#1, min#:1.y#43802a16#1, max#:2.y#43802a16#1),
    z#9f1c0644#0: clampF#f2f2e188(v#:0.z#9f1c0644#0, min#:1.z#9f1c0644#0, max#:2.z#9f1c0644#0),
}
```
*/
export const hash_5483fdc2: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644, min$1: t_9f1c0644, max$2: t_9f1c0644) => ({
  type: "Vec3",
  x: hash_f2f2e188(v$0.x, min$1.x, max$2.x),
  y: hash_f2f2e188(v$0.y, min$1.y, max$2.y),
  z: hash_f2f2e188(v$0.z, min$1.z, max$2.z)
} as t_9f1c0644);

/**
```
const ScaleVec3#c4a91006: Mul#1de4e4c0<float, Vec3#9f1c0644, Vec3#9f1c0644> = Mul#1de4e4c0<
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
>{
    "*"#1de4e4c0#0: (scale#:0: float, v#:1: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:1.x#43802a16#0 * scale#:0),
        y#43802a16#1: (v#:1.y#43802a16#1 * scale#:0),
        z#9f1c0644#0: (v#:1.z#9f1c0644#0 * scale#:0),
    },
}
```
*/
export const hash_c4a91006: t_1de4e4c0<number, t_9f1c0644, t_9f1c0644> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (scale$0: number, v$1: t_9f1c0644) => ({
    type: "Vec3",
    x: v$1.x * scale$0,
    y: v$1.y * scale$0,
    z: v$1.z * scale$0
  } as t_9f1c0644)
} as t_1de4e4c0<number, t_9f1c0644, t_9f1c0644>);

/**
```
const AddSubVec3#1c6fdd91: AddSub#b99b22d8<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644> = AddSub#b99b22d8<
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
>{
    "+"#b99b22d8#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1.y#43802a16#1),
        z#9f1c0644#0: (one#:0.z#9f1c0644#0 + two#:1.z#9f1c0644#0),
    },
    "-"#b99b22d8#1: (one#:2: Vec3#9f1c0644, two#:3: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3.x#43802a16#0),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3.y#43802a16#1),
        z#9f1c0644#0: (one#:2.z#9f1c0644#0 - two#:3.z#9f1c0644#0),
    },
}
```
*/
export const hash_1c6fdd91: t_b99b22d8<t_9f1c0644, t_9f1c0644, t_9f1c0644> = ({
  type: "b99b22d8",
  hb99b22d8_0: (one$0: t_9f1c0644, two$1: t_9f1c0644) => ({
    type: "Vec3",
    x: one$0.x + two$1.x,
    y: one$0.y + two$1.y,
    z: one$0.z + two$1.z
  } as t_9f1c0644),
  hb99b22d8_1: (one$2: t_9f1c0644, two$3: t_9f1c0644) => ({
    type: "Vec3",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    z: one$2.z - two$3.z
  } as t_9f1c0644)
} as t_b99b22d8<t_9f1c0644, t_9f1c0644, t_9f1c0644>);

/**
```
const vabs#1a074578: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
    x#43802a16#0: abs(v#:0.x#43802a16#0),
    y#43802a16#1: abs(v#:0.y#43802a16#1),
    z#9f1c0644#0: abs(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_1a074578: (arg_0: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644) => ({
  type: "Vec3",
  x: abs(v$0.x),
  y: abs(v$0.y),
  z: abs(v$0.z)
} as t_9f1c0644);

/**
```
const vmax#3af3fc3c: (Vec3#9f1c0644) ={}> float = (v#:0: Vec3#9f1c0644) ={}> {
    max(max(v#:0.x#43802a16#0, v#:0.y#43802a16#1), v#:0.z#9f1c0644#0);
}
```
*/
export const hash_3af3fc3c: (arg_0: t_9f1c0644) => number = (v$0: t_9f1c0644) => max(max(v$0.x, v$0.y), v$0.z);

/**
```
const opRepLim#47cca838: (Vec3#9f1c0644, float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    p#:0: Vec3#9f1c0644,
    c#:1: float,
    l#:2: Vec3#9f1c0644,
) ={}> {
    AddSubVec3#1c6fdd91."-"#b99b22d8#1(
        p#:0,
        ScaleVec3#c4a91006."*"#1de4e4c0#0(
            c#:1,
            clamp#5483fdc2(
                roundv#65acfcda(ScaleVec3Rev#68f73ad4."/"#5ac12902#0(p#:0, c#:1)),
                negVec3#4129390c(l#:2),
                l#:2,
            ),
        ),
    );
}
```
*/
export const hash_47cca838: (arg_0: t_9f1c0644, arg_1: number, arg_2: t_9f1c0644) => t_9f1c0644 = (p$0: t_9f1c0644, c$1: number, l$2: t_9f1c0644) => hash_1c6fdd91.hb99b22d8_1(p$0, hash_c4a91006.h1de4e4c0_0(c$1, hash_5483fdc2(hash_65acfcda(hash_68f73ad4.h5ac12902_0(p$0, c$1)), hash_4129390c(l$2), l$2)));

/**
```
const length#1cc335a2: (Vec3#9f1c0644) ={}> float = (v#:0: Vec3#9f1c0644) ={}> {
    sqrt(
        (((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)) + (v#:0.z#9f1c0644#0 * v#:0.z#9f1c0644#0)),
    );
}
```
*/
export const hash_1cc335a2: (arg_0: t_9f1c0644) => number = (v$0: t_9f1c0644) => sqrt(v$0.x * v$0.x + v$0.y * v$0.y + v$0.z * v$0.z);

/**
```
const EPSILON#ec7f8d1c: float = 0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

/**
```
const sceneSDF#51cd937e: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const double#:2 = (iTime#:0 * 2.0);
    const p1#:3 = opRepLim#47cca838(
        samplePoint#:1,
        0.25,
        Vec3#9f1c0644{x#43802a16#0: 2.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
    );
    min(
        max(
            vmax#3af3fc3c(
                AddSubVec3#1c6fdd91."-"#b99b22d8#1(
                    vabs#1a074578(p1#:3),
                    Vec3#9f1c0644{x#43802a16#0: 0.1, y#43802a16#1: 0.3, z#9f1c0644#0: 0.6},
                ),
            ),
            -vmax#3af3fc3c(
                AddSubVec3#1c6fdd91."-"#b99b22d8#1(
                    vabs#1a074578(p1#:3),
                    Vec3#9f1c0644{x#43802a16#0: 0.11, y#43802a16#1: 0.2, z#9f1c0644#0: 0.55},
                ),
            ),
        ),
        vmax#3af3fc3c(
            AddSubVec3#1c6fdd91."-"#b99b22d8#1(
                vabs#1a074578(
                    AddSubVec3#1c6fdd91."-"#b99b22d8#1(
                        samplePoint#:1,
                        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: -0.1},
                    ),
                ),
                Vec3#9f1c0644{x#43802a16#0: 10.2, y#43802a16#1: 10.0, z#9f1c0644#0: 0.1},
            ),
        ),
    );
}
```
*/
export const hash_51cd937e: (arg_0: number, arg_1: t_9f1c0644) => number = (iTime$0: number, samplePoint$1: t_9f1c0644) => {
  let p1$3: t_9f1c0644 = hash_47cca838(samplePoint$1, 0.25, ({
    type: "Vec3",
    x: 2,
    y: 0,
    z: 0
  } as t_9f1c0644));
  return min(max(hash_3af3fc3c(hash_1c6fdd91.hb99b22d8_1(hash_1a074578(p1$3), ({
    type: "Vec3",
    x: 0.1,
    y: 0.3,
    z: 0.6
  } as t_9f1c0644))), -hash_3af3fc3c(hash_1c6fdd91.hb99b22d8_1(hash_1a074578(p1$3), ({
    type: "Vec3",
    x: 0.11,
    y: 0.2,
    z: 0.55
  } as t_9f1c0644)))), hash_3af3fc3c(hash_1c6fdd91.hb99b22d8_1(hash_1a074578(hash_1c6fdd91.hb99b22d8_1(samplePoint$1, ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: -0.1
  } as t_9f1c0644))), ({
    type: "Vec3",
    x: 10.2,
    y: 10,
    z: 0.1
  } as t_9f1c0644))));
};

/**
```
const normalize#ce463a80: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> ScaleVec3Rev#68f73ad4."/"#5ac12902#0(
    v#:0,
    length#1cc335a2(v#:0),
)
```
*/
export const hash_ce463a80: (arg_0: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644) => hash_68f73ad4.h5ac12902_0(v$0, hash_1cc335a2(v$0));

/**
```
const shortestDistanceToSurface#22a8b392: (float, Vec3#9f1c0644, Vec3#9f1c0644, float, float, int) ={}> float = (
    iTime#:0: float,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
) ={}> {
    if (stepsLeft#:5 <= 0) {
        end#:4;
    } else {
        const dist#:6 = sceneSDF#51cd937e(
            iTime#:0,
            AddSubVec3#1c6fdd91."+"#b99b22d8#0(
                eye#:1,
                ScaleVec3#c4a91006."*"#1de4e4c0#0(start#:3, marchingDirection#:2),
            ),
        );
        if (dist#:6 < EPSILON#ec7f8d1c) {
            start#:3;
        } else {
            const depth#:7 = (start#:3 + dist#:6);
            if (depth#:7 >= end#:4) {
                end#:4;
            } else {
                22a8b392(
                    iTime#:0,
                    eye#:1,
                    marchingDirection#:2,
                    depth#:7,
                    end#:4,
                    (stepsLeft#:5 - 1),
                );
            };
        };
    };
}
```
*/
export const hash_22a8b392: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: number, arg_5: number) => number = (iTime$0: number, eye$1: t_9f1c0644, marchingDirection$2: t_9f1c0644, start$3: number, end$4: number, stepsLeft$5: number) => {
  while (true) {
    if (stepsLeft$5 <= 0) {
      return end$4;
    } else {
      let dist$6: number = hash_51cd937e(iTime$0, hash_1c6fdd91.hb99b22d8_0(eye$1, hash_c4a91006.h1de4e4c0_0(start$3, marchingDirection$2)));

      if (dist$6 < hash_ec7f8d1c) {
        return start$3;
      } else {
        let depth$7: number = start$3 + dist$6;

        if (depth$7 >= end$4) {
          return end$4;
        } else {
          iTime$0 = iTime$0;
          eye$1 = eye$1;
          marchingDirection$2 = marchingDirection$2;
          start$3 = depth$7;
          end$4 = end$4;
          stepsLeft$5 = stepsLeft$5 - 1;
          continue;
        }
      }
    }
  }
};

/**
```
const distance#b962a56c: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> float = (
    one#:0: Vec3#9f1c0644,
    two#:1: Vec3#9f1c0644,
) ={}> length#1cc335a2(AddSubVec3#1c6fdd91."-"#b99b22d8#1(two#:1, one#:0))
```
*/
export const hash_b962a56c: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (one$0: t_9f1c0644, two$1: t_9f1c0644) => hash_1cc335a2(hash_1c6fdd91.hb99b22d8_1(two$1, one$0));

/**
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const dot#255c39c3: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> float = (
    a#:0: Vec3#9f1c0644,
    b#:1: Vec3#9f1c0644,
) ={}> {
    (((a#:0.x#43802a16#0 * b#:1.x#43802a16#0) + (a#:0.y#43802a16#1 * b#:1.y#43802a16#1)) + (a#:0.z#9f1c0644#0 * b#:1.z#9f1c0644#0));
}
```
*/
export const hash_255c39c3: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (a$0: t_9f1c0644, b$1: t_9f1c0644) => a$0.x * b$1.x + a$0.y * b$1.y + a$0.z * b$1.z;

/**
```
const estimateNormal#40f2b702: (float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
) ={}> normalize#ce463a80(
    Vec3#9f1c0644{
        x#43802a16#0: (sceneSDF#51cd937e(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#51cd937e(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 - EPSILON#ec7f8d1c)},
        )),
        y#43802a16#1: (sceneSDF#51cd937e(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#51cd937e(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 - EPSILON#ec7f8d1c)},
        )),
        z#9f1c0644#0: (sceneSDF#51cd937e(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#51cd937e(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 - EPSILON#ec7f8d1c)},
        )),
    },
)
```
*/
export const hash_40f2b702: (arg_0: number, arg_1: t_9f1c0644) => t_9f1c0644 = (iTime$0: number, p$1: t_9f1c0644) => hash_ce463a80(({
  type: "Vec3",
  x: hash_51cd937e(iTime$0, ({ ...p$1,
    type: "Vec3",
    x: p$1.x + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_51cd937e(iTime$0, ({ ...p$1,
    type: "Vec3",
    x: p$1.x - hash_ec7f8d1c
  } as t_9f1c0644)),
  y: hash_51cd937e(iTime$0, ({ ...p$1,
    type: "Vec3",
    y: p$1.y + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_51cd937e(iTime$0, ({ ...p$1,
    type: "Vec3",
    y: p$1.y - hash_ec7f8d1c
  } as t_9f1c0644)),
  z: hash_51cd937e(iTime$0, ({ ...p$1,
    type: "Vec3",
    z: p$1.z + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_51cd937e(iTime$0, ({ ...p$1,
    type: "Vec3",
    z: p$1.z - hash_ec7f8d1c
  } as t_9f1c0644))
} as t_9f1c0644));

/**
```
const volumetricSample#bc6322d4: (
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    float,
    Vec3#9f1c0644,
    int,
) ={}> float = (
    iTime#:0: float,
    light#:1: Vec3#9f1c0644,
    eye#:2: Vec3#9f1c0644,
    dist#:3: float,
    percent#:4: float,
    dir#:5: Vec3#9f1c0644,
    left#:6: int,
) ={}> {
    const rdist#:7 = (percent#:4 * dist#:3);
    const sample#:8 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
        eye#:2,
        ScaleVec3#c4a91006."*"#1de4e4c0#0(rdist#:7, dir#:5),
    );
    const lightDist#:9 = distance#b962a56c(sample#:8, light#:1);
    const toLight#:10 = AddSubVec3#1c6fdd91."-"#b99b22d8#1(sample#:8, light#:1);
    const marchToLight#:11 = shortestDistanceToSurface#22a8b392(
        iTime#:0,
        sample#:8,
        ScaleVec3#c4a91006."*"#1de4e4c0#0(-1.0, normalize#ce463a80(toLight#:10)),
        0.0,
        lightDist#:9,
        MAX_MARCHING_STEPS#62404440,
    );
    if (marchToLight#:11 >= (lightDist#:9 - 0.1)) {
        (dist#:3 / pow((1.0 + lightDist#:9), 2.0));
    } else {
        0.0;
    };
}
```
*/
export const hash_bc6322d4: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: number, arg_5: t_9f1c0644, arg_6: number) => number = (iTime$0: number, light$1: t_9f1c0644, eye$2: t_9f1c0644, dist$3: number, percent$4: number, dir$5: t_9f1c0644, left$6: number) => {
  let sample$8: t_9f1c0644 = hash_1c6fdd91.hb99b22d8_0(eye$2, hash_c4a91006.h1de4e4c0_0(percent$4 * dist$3, dir$5));
  let lightDist$9: number = hash_b962a56c(sample$8, light$1);

  if (hash_22a8b392(iTime$0, sample$8, hash_c4a91006.h1de4e4c0_0(-1, hash_ce463a80(hash_1c6fdd91.hb99b22d8_1(sample$8, light$1))), 0, lightDist$9, hash_62404440) >= lightDist$9 - 0.1) {
    return dist$3 / pow(1 + lightDist$9, 2);
  } else {
    return 0;
  }
};

/**
```
const IntAsFloat#6f186ad1: As#As<int, float> = As#As<int, float>{as#As#0: intToFloat}
```
*/
export const hash_6f186ad1: t_As<number, number> = ({
  type: "As",
  hAs_0: intToFloat
} as t_As<number, number>);

/**
```
const white#0678f03c: Vec3#9f1c0644 = Vec3#9f1c0644{
    x#43802a16#0: 1.0,
    y#43802a16#1: 1.0,
    z#9f1c0644#0: 1.0,
}
```
*/
export const hash_0678f03c: t_9f1c0644 = ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_9f1c0644);

/**
```
const ScaleVec3_#1d31aa6e: Mul#1de4e4c0<Vec3#9f1c0644, float, Vec3#9f1c0644> = Mul#1de4e4c0<
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
>{
    "*"#1de4e4c0#0: (v#:0: Vec3#9f1c0644, scale#:1: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:0.x#43802a16#0 * scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 * scale#:1),
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 * scale#:1),
    },
}
```
*/
export const hash_1d31aa6e: t_1de4e4c0<t_9f1c0644, number, t_9f1c0644> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (v$0: t_9f1c0644, scale$1: number) => ({
    type: "Vec3",
    x: v$0.x * scale$1,
    y: v$0.y * scale$1,
    z: v$0.z * scale$1
  } as t_9f1c0644)
} as t_1de4e4c0<t_9f1c0644, number, t_9f1c0644>);

/**
```
const MAX_DIST#0ce717e6: float = 100.0
```
*/
export const hash_0ce717e6: number = 100;

/**
```
const MIN_DIST#f2cd39b8: float = 0.0
```
*/
export const hash_f2cd39b8: number = 0;

/**
```
const isPointingTowardLight#2493fec0: (float, Vec3#9f1c0644, Vec3#9f1c0644) ={}> bool = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
    lightPos#:2: Vec3#9f1c0644,
) ={}> {
    const N#:3 = estimateNormal#40f2b702(iTime#:0, p#:1);
    const L#:4 = normalize#ce463a80(AddSubVec3#1c6fdd91."-"#b99b22d8#1(lightPos#:2, p#:1));
    const dotLN#:5 = dot#255c39c3(L#:4, N#:3);
    (dotLN#:5 >= 0.0);
}
```
*/
export const hash_2493fec0: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => boolean = (iTime$0: number, p$1: t_9f1c0644, lightPos$2: t_9f1c0644) => hash_255c39c3(hash_ce463a80(hash_1c6fdd91.hb99b22d8_1(lightPos$2, p$1)), hash_40f2b702(iTime$0, p$1)) >= 0;

/**
```
const dot4#a0178052: (Vec4#3b941378, Vec4#3b941378) ={}> float = (
    a#:0: Vec4#3b941378,
    b#:1: Vec4#3b941378,
) ={}> {
    ((((a#:0.x#43802a16#0 * b#:1.x#43802a16#0) + (a#:0.y#43802a16#1 * b#:1.y#43802a16#1)) + (a#:0.z#9f1c0644#0 * b#:1.z#9f1c0644#0)) + (a#:0.w#3b941378#0 * b#:1.w#3b941378#0));
}
```
*/
export const hash_a0178052: (arg_0: t_3b941378, arg_1: t_3b941378) => number = (a$0: t_3b941378, b$1: t_3b941378) => a$0.x * b$1.x + a$0.y * b$1.y + a$0.z * b$1.z + a$0.w * b$1.w;

/**
```
const vec4#4d4983bb: (float, float, float, float) ={}> Vec4#3b941378 = (
    x#:0: float,
    y#:1: float,
    z#:2: float,
    w#:3: float,
) ={}> Vec4#3b941378{z#9f1c0644#0: z#:2, x#43802a16#0: x#:0, y#43802a16#1: y#:1, w#3b941378#0: w#:3}
```
*/
export const hash_4d4983bb: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_3b941378 = (x$0: number, y$1: number, z$2: number, w$3: number) => ({
  type: "Vec4",
  z: z$2,
  x: x$0,
  y: y$1,
  w: w$3
} as t_3b941378);

/**
```
const cross#54f2119c: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    one#:0: Vec3#9f1c0644,
    two#:1: Vec3#9f1c0644,
) ={}> Vec3#9f1c0644{
    x#43802a16#0: ((one#:0.y#43802a16#1 * two#:1.z#9f1c0644#0) - (two#:1.y#43802a16#1 * one#:0.z#9f1c0644#0)),
    y#43802a16#1: ((one#:0.z#9f1c0644#0 * two#:1.x#43802a16#0) - (two#:1.z#9f1c0644#0 * one#:0.x#43802a16#0)),
    z#9f1c0644#0: ((one#:0.x#43802a16#0 * two#:1.y#43802a16#1) - (two#:1.x#43802a16#0 * one#:0.y#43802a16#1)),
}
```
*/
export const hash_54f2119c: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => t_9f1c0644 = (one$0: t_9f1c0644, two$1: t_9f1c0644) => ({
  type: "Vec3",
  x: one$0.y * two$1.z - two$1.y * one$0.z,
  y: one$0.z * two$1.x - two$1.z * one$0.x,
  z: one$0.x * two$1.y - two$1.x * one$0.y
} as t_9f1c0644);

/**
```
const vec3#5808ec54: (Vec2#43802a16, float) ={}> Vec3#9f1c0644 = (v#:0: Vec2#43802a16, z#:1: float) ={}> Vec3#9f1c0644{
    ...v#:0,
    z#9f1c0644#0: z#:1,
}
```
*/
export const hash_5808ec54: (arg_0: t_43802a16, arg_1: number) => t_9f1c0644 = (v$0: t_43802a16, z$1: number) => ({ ...v$0,
  type: "Vec3",
  z: z$1
} as t_9f1c0644);

/**
```
const radians#dabe7f9c: (float) ={}> float = (degrees#:0: float) ={}> ((degrees#:0 / 180.0) * PI)
```
*/
export const hash_dabe7f9c: (arg_0: number) => number = (degrees$0: number) => degrees$0 / 180 * PI;

/**
```
const ScaleVec2Rev#afc24bbe: Div#5ac12902<Vec2#43802a16, float, Vec2#43802a16> = Div#5ac12902<
    Vec2#43802a16,
    float,
    Vec2#43802a16,
>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: float) ={}> Vec2#43802a16{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
    },
}
```
*/
export const hash_afc24bbe: t_5ac12902<t_43802a16, number, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v$0: t_43802a16, scale$1: number) => ({
    type: "Vec2",
    x: v$0.x / scale$1,
    y: v$0.y / scale$1
  } as t_43802a16)
} as t_5ac12902<t_43802a16, number, t_43802a16>);

/**
```
const AddSubVec2#70bb2056: AddSub#b99b22d8<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16> = AddSub#b99b22d8<
    Vec2#43802a16,
    Vec2#43802a16,
    Vec2#43802a16,
>{
    "+"#b99b22d8#0: (one#:0: Vec2#43802a16, two#:1: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1.y#43802a16#1),
    },
    "-"#b99b22d8#1: (one#:2: Vec2#43802a16, two#:3: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3.x#43802a16#0),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3.y#43802a16#1),
    },
}
```
*/
export const hash_70bb2056: t_b99b22d8<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "b99b22d8",
  hb99b22d8_0: (one$0: t_43802a16, two$1: t_43802a16) => ({
    type: "Vec2",
    x: one$0.x + two$1.x,
    y: one$0.y + two$1.y
  } as t_43802a16),
  hb99b22d8_1: (one$2: t_43802a16, two$3: t_43802a16) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_43802a16)
} as t_b99b22d8<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const FloatAsInt#184a69ed: As#As<float, int> = As#As<float, int>{as#As#0: floatToInt}
```
*/
export const hash_184a69ed: t_As<number, number> = ({
  type: "As",
  hAs_0: floatToInt
} as t_As<number, number>);

/**
```
const MulVec2#090f77e7: Div#5ac12902<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16> = Div#5ac12902<
    Vec2#43802a16,
    Vec2#43802a16,
    Vec2#43802a16,
>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1.x#43802a16#0),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1.y#43802a16#1),
    },
}
```
*/
export const hash_090f77e7: t_5ac12902<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v$0: t_43802a16, scale$1: t_43802a16) => ({
    type: "Vec2",
    x: v$0.x / scale$1.x,
    y: v$0.y / scale$1.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const AddSubVec2_#6d631644: AddSub#b99b22d8<Vec2#43802a16, float, Vec2#43802a16> = AddSub#b99b22d8<
    Vec2#43802a16,
    float,
    Vec2#43802a16,
>{
    "+"#b99b22d8#0: (one#:0: Vec2#43802a16, two#:1: float) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1),
    },
    "-"#b99b22d8#1: (one#:2: Vec2#43802a16, two#:3: float) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3),
    },
}
```
*/
export const hash_6d631644: t_b99b22d8<t_43802a16, number, t_43802a16> = ({
  type: "b99b22d8",
  hb99b22d8_0: (one$0: t_43802a16, two$1: number) => ({
    type: "Vec2",
    x: one$0.x + two$1,
    y: one$0.y + two$1
  } as t_43802a16),
  hb99b22d8_1: (one$2: t_43802a16, two$3: number) => ({
    type: "Vec2",
    x: one$2.x - two$3,
    y: one$2.y - two$3
  } as t_43802a16)
} as t_b99b22d8<t_43802a16, number, t_43802a16>);

/**
```
const volumetric#51a6cf2c: (
    float,
    Vec2#43802a16,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
    float,
    int,
    float,
) ={}> float = (
    iTime#:0: float,
    seed#:1: Vec2#43802a16,
    light#:2: Vec3#9f1c0644,
    eye#:3: Vec3#9f1c0644,
    dist#:4: float,
    dir#:5: Vec3#9f1c0644,
    current#:6: float,
    left#:7: int,
    total#:8: float,
) ={}> {
    if (left#:7 <= 0) {
        current#:6;
    } else {
        const percent#:9 = (left#:7 as#6f186ad1 float / total#:8);
        const sample#:10 = volumetricSample#bc6322d4(
            iTime#:0,
            light#:2,
            eye#:3,
            dist#:4,
            percent#:9,
            dir#:5,
            left#:7,
        );
        51a6cf2c(
            iTime#:0,
            seed#:1,
            light#:2,
            eye#:3,
            dist#:4,
            dir#:5,
            (current#:6 + sample#:10),
            (left#:7 - 1),
            total#:8,
        );
    };
}
```
*/
export const hash_51a6cf2c: (arg_0: number, arg_1: t_43802a16, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: t_9f1c0644, arg_6: number, arg_7: number, arg_8: number) => number = (iTime$0: number, seed$1: t_43802a16, light$2: t_9f1c0644, eye$3: t_9f1c0644, dist$4: number, dir$5: t_9f1c0644, current$6: number, left$7: number, total$8: number) => {
  while (true) {
    if (left$7 <= 0) {
      return current$6;
    } else {
      let recur$17: number = current$6 + hash_bc6322d4(iTime$0, light$2, eye$3, dist$4, intToFloat(left$7) / total$8, dir$5, left$7);
      iTime$0 = iTime$0;
      seed$1 = seed$1;
      light$2 = light$2;
      eye$3 = eye$3;
      dist$4 = dist$4;
      dir$5 = dir$5;
      current$6 = recur$17;
      left$7 = left$7 - 1;
      total$8 = total$8;
      continue;
    }
  }
};

/**
```
const lightSurface#61465ac7: (float, Vec3#9f1c0644, Vec3#9f1c0644, float, float) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    worldPosForPixel#:1: Vec3#9f1c0644,
    light1Pos#:2: Vec3#9f1c0644,
    light#:3: float,
    hit#:4: float,
) ={}> {
    if isPointingTowardLight#2493fec0(iTime#:0, worldPosForPixel#:1, light1Pos#:2) {
        const toLight#:5 = AddSubVec3#1c6fdd91."-"#b99b22d8#1(light1Pos#:2, worldPosForPixel#:1);
        const marchToLight#:6 = shortestDistanceToSurface#22a8b392(
            iTime#:0,
            light1Pos#:2,
            ScaleVec3#c4a91006."*"#1de4e4c0#0(-1.0, normalize#ce463a80(toLight#:5)),
            MIN_DIST#f2cd39b8,
            MAX_DIST#0ce717e6,
            MAX_MARCHING_STEPS#62404440,
        );
        if (marchToLight#:6 > (MAX_DIST#0ce717e6 - (EPSILON#ec7f8d1c * 10.0))) {
            Vec4#3b941378{
                ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:3),
                w#3b941378#0: 1.0,
            };
        } else {
            const offset#:7 = (marchToLight#:6 - length#1cc335a2(toLight#:5));
            const penumbra#:8 = 0.1;
            if (offset#:7 < (-EPSILON#ec7f8d1c * 1000.0)) {
                Vec4#3b941378{
                    ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:3),
                    w#3b941378#0: 1.0,
                };
            } else {
                Vec4#3b941378{
                    ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, hit#:4),
                    w#3b941378#0: 1.0,
                };
            };
        };
    } else {
        Vec4#3b941378{
            ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:3),
            w#3b941378#0: 1.0,
        };
    };
}
```
*/
export const hash_61465ac7: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: number) => t_3b941378 = (iTime$0: number, worldPosForPixel$1: t_9f1c0644, light1Pos$2: t_9f1c0644, light$3: number, hit$4: number) => {
  if (hash_2493fec0(iTime$0, worldPosForPixel$1, light1Pos$2)) {
    let toLight$5: t_9f1c0644 = hash_1c6fdd91.hb99b22d8_1(light1Pos$2, worldPosForPixel$1);
    let marchToLight$6: number = hash_22a8b392(iTime$0, light1Pos$2, hash_c4a91006.h1de4e4c0_0(-1, hash_ce463a80(toLight$5)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

    if (marchToLight$6 > hash_0ce717e6 - hash_ec7f8d1c * 10) {
      return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$3),
        type: "Vec4",
        w: 1
      } as t_3b941378);
    } else {
      if (marchToLight$6 - hash_1cc335a2(toLight$5) < -hash_ec7f8d1c * 1000) {
        return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$3),
          type: "Vec4",
          w: 1
        } as t_3b941378);
      } else {
        return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, hit$4),
          type: "Vec4",
          w: 1
        } as t_3b941378);
      }
    }
  } else {
    return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$3),
      type: "Vec4",
      w: 1
    } as t_3b941378);
  }
};

/**
```
const MatByVector#16557d10: Mul#1de4e4c0<Mat4#d92781e8, Vec4#3b941378, Vec4#3b941378> = Mul#1de4e4c0<
    Mat4#d92781e8,
    Vec4#3b941378,
    Vec4#3b941378,
>{
    "*"#1de4e4c0#0: (mat#:0: Mat4#d92781e8, vec#:1: Vec4#3b941378) ={}> Vec4#3b941378{
        z#9f1c0644#0: dot4#a0178052(mat#:0.r3#d92781e8#2, vec#:1),
        x#43802a16#0: dot4#a0178052(mat#:0.r1#d92781e8#0, vec#:1),
        y#43802a16#1: dot4#a0178052(mat#:0.r2#d92781e8#1, vec#:1),
        w#3b941378#0: dot4#a0178052(mat#:0.r4#d92781e8#3, vec#:1),
    },
}
```
*/
export const hash_16557d10: t_1de4e4c0<t_d92781e8, t_3b941378, t_3b941378> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (mat$0: t_d92781e8, vec$1: t_3b941378) => ({
    type: "Vec4",
    z: hash_a0178052(mat$0.r3, vec$1),
    x: hash_a0178052(mat$0.r1, vec$1),
    y: hash_a0178052(mat$0.r2, vec$1),
    w: hash_a0178052(mat$0.r4, vec$1)
  } as t_3b941378)
} as t_1de4e4c0<t_d92781e8, t_3b941378, t_3b941378>);

/**
```
const xyz#1aedf216: (Vec4#3b941378) ={}> Vec3#9f1c0644 = (v#:0: Vec4#3b941378) ={}> Vec3#9f1c0644{
    x#43802a16#0: v#:0.x#43802a16#0,
    y#43802a16#1: v#:0.y#43802a16#1,
    z#9f1c0644#0: v#:0.z#9f1c0644#0,
}
```
*/
export const hash_1aedf216: (arg_0: t_3b941378) => t_9f1c0644 = (v$0: t_3b941378) => ({
  type: "Vec3",
  x: v$0.x,
  y: v$0.y,
  z: v$0.z
} as t_9f1c0644);

/**
```
const viewMatrix#c4780f44: (Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644) ={}> Mat4#d92781e8 = (
    eye#:0: Vec3#9f1c0644,
    center#:1: Vec3#9f1c0644,
    up#:2: Vec3#9f1c0644,
) ={}> {
    const f#:3 = normalize#ce463a80(AddSubVec3#1c6fdd91."-"#b99b22d8#1(center#:1, eye#:0));
    const s#:4 = normalize#ce463a80(cross#54f2119c(f#:3, up#:2));
    const u#:5 = cross#54f2119c(s#:4, f#:3);
    Mat4#d92781e8{
        r1#d92781e8#0: Vec4#3b941378{...s#:4, w#3b941378#0: 0.0},
        r2#d92781e8#1: Vec4#3b941378{...u#:5, w#3b941378#0: 0.0},
        r3#d92781e8#2: Vec4#3b941378{...negVec3#4129390c(f#:3), w#3b941378#0: 0.0},
        r4#d92781e8#3: vec4#4d4983bb(0.0, 0.0, 0.0, 1.0),
    };
}
```
*/
export const hash_c4780f44: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_d92781e8 = (eye$0: t_9f1c0644, center$1: t_9f1c0644, up$2: t_9f1c0644) => {
  let f$3: t_9f1c0644 = hash_ce463a80(hash_1c6fdd91.hb99b22d8_1(center$1, eye$0));
  let s$4: t_9f1c0644 = hash_ce463a80(hash_54f2119c(f$3, up$2));
  return ({
    type: "Mat4",
    r1: ({ ...s$4,
      type: "Vec4",
      w: 0
    } as t_3b941378),
    r2: ({ ...hash_54f2119c(s$4, f$3),
      type: "Vec4",
      w: 0
    } as t_3b941378),
    r3: ({ ...hash_4129390c(f$3),
      type: "Vec4",
      w: 0
    } as t_3b941378),
    r4: hash_4d4983bb(0, 0, 0, 1)
  } as t_d92781e8);
};

/**
```
const rayDirection#fb220c84: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec3#9f1c0644 = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
) ={}> {
    const xy#:3 = AddSubVec2#70bb2056."-"#b99b22d8#1(
        fragCoord#:2,
        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(size#:1, 2.0),
    );
    const z#:4 = (size#:1.y#43802a16#1 / tan((radians#dabe7f9c(fieldOfView#:0) / 2.0)));
    normalize#ce463a80(vec3#5808ec54(xy#:3, -z#:4));
}
```
*/
export const hash_fb220c84: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_9f1c0644 = (fieldOfView$0: number, size$1: t_43802a16, fragCoord$2: t_43802a16) => hash_ce463a80(hash_5808ec54(hash_70bb2056.hb99b22d8_1(fragCoord$2, hash_afc24bbe.h5ac12902_0(size$1, 2)), -(size$1.y / tan(hash_dabe7f9c(fieldOfView$0) / 2))));

/**
```
const dot2#369652bb: (Vec2#43802a16, Vec2#43802a16) ={}> float = (
    a#:0: Vec2#43802a16,
    b#:1: Vec2#43802a16,
) ={}> {
    ((a#:0.x#43802a16#0 * b#:1.x#43802a16#0) + (a#:0.y#43802a16#1 * b#:1.y#43802a16#1));
}
```
*/
export const hash_369652bb: (arg_0: t_43802a16, arg_1: t_43802a16) => number = (a$0: t_43802a16, b$1: t_43802a16) => a$0.x * b$1.x + a$0.y * b$1.y;

/**
```
const fract#495c4d22: (float) ={}> float = (v#:0: float) ={}> (v#:0 - floor(v#:0))
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v$0: number) => v$0 - floor(v$0);

/**
```
const fishingBoueys#c225509c: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
) ={}> {
    const viewDir#:4 = rayDirection#fb220c84(45.0, iResolution#:2, fragCoord#:1);
    const eye#:5 = uCamera#:3;
    const viewToWorld#:6 = viewMatrix#c4780f44(
        eye#:5,
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
    );
    const worldDir#:7 = xyz#1aedf216(
        MatByVector#16557d10."*"#1de4e4c0#0(
            viewToWorld#:6,
            Vec4#3b941378{...viewDir#:4, w#3b941378#0: 0.0},
        ),
    );
    const dir#:8 = worldDir#:7;
    const dist#:9 = shortestDistanceToSurface#22a8b392(
        iTime#:0,
        eye#:5,
        dir#:8,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    if (dist#:9 > (MAX_DIST#0ce717e6 - EPSILON#ec7f8d1c)) {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 0.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        const worldPosForPixel#:10 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
            eye#:5,
            ScaleVec3#c4a91006."*"#1de4e4c0#0(dist#:9, dir#:8),
        );
        const light1Pos#:11 = Vec3#9f1c0644{
            x#43802a16#0: (0.15 + (sin((iTime#:0 / 2.0)) / 1.0)),
            y#43802a16#1: 0.0,
            z#9f1c0644#0: 0.05,
        };
        const surfaces#:12 = lightSurface#61465ac7(
            iTime#:0,
            worldPosForPixel#:10,
            light1Pos#:11,
            0.0,
            0.01,
        );
        const samples#:13 = 10.0;
        const brightness#:14 = ((volumetric#51a6cf2c(
            iTime#:0,
            AddSubVec2_#6d631644."+"#b99b22d8#0(
                MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, iResolution#:2),
                (iTime#:0 / 1000.0),
            ),
            light1Pos#:11,
            eye#:5,
            dist#:9,
            dir#:8,
            0.0,
            samples#:13 as#184a69ed int,
            samples#:13,
        ) * 3.0) / samples#:13);
        Vec4#3b941378{
            ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(
                ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(
                    ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, brightness#:14),
                    brightness#:14,
                ),
                brightness#:14,
            ),
            w#3b941378#0: 1.0,
        };
    };
}
```
*/
export const hash_c225509c: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: t_9f1c0644) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16, uCamera$3: t_9f1c0644) => {
  let eye$5: t_9f1c0644 = uCamera$3;
  let dir$8: t_9f1c0644 = hash_1aedf216(hash_16557d10.h1de4e4c0_0(hash_c4780f44(eye$5, ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 0
  } as t_9f1c0644), ({
    type: "Vec3",
    x: 0,
    y: 1,
    z: 0
  } as t_9f1c0644)), ({ ...hash_fb220c84(45, iResolution$2, fragCoord$1),
    type: "Vec4",
    w: 0
  } as t_3b941378)));
  let dist$9: number = hash_22a8b392(iTime$0, eye$5, dir$8, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$9 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_3b941378);
  } else {
    let samples$13: number = 10;
    let brightness$14: number = hash_51a6cf2c(iTime$0, hash_6d631644.hb99b22d8_0(hash_090f77e7.h5ac12902_0(fragCoord$1, iResolution$2), iTime$0 / 1000), ({
      type: "Vec3",
      x: 0.15 + sin(iTime$0 / 2) / 1,
      y: 0,
      z: 0.05
    } as t_9f1c0644), eye$5, dist$9, dir$8, 0, floatToInt(samples$13), samples$13) * 3 / samples$13;
    return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_1d31aa6e.h1de4e4c0_0(hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, brightness$14), brightness$14), brightness$14),
      type: "Vec4",
      w: 1
    } as t_3b941378);
  }
};

/**
```
const random#347089ef: (Vec2#43802a16) ={}> float = (st#:0: Vec2#43802a16) ={}> {
    fract#495c4d22(
        (sin(dot2#369652bb(st#:0, Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233})) * 43758.5453123),
    );
}
```
*/
export const hash_347089ef: (arg_0: t_43802a16) => number = (st$0: t_43802a16) => hash_495c4d22(sin(hash_369652bb(st$0, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_43802a16))) * 43758.5453123);

/**
```
const roundv2#b9171b62: (Vec2#43802a16) ={}> Vec2#43802a16 = (v#:0: Vec2#43802a16) ={}> Vec2#43802a16{
    x#43802a16#0: round(v#:0.x#43802a16#0),
    y#43802a16#1: round(v#:0.y#43802a16#1),
}
```
*/
export const hash_b9171b62: (arg_0: t_43802a16) => t_43802a16 = (v$0: t_43802a16) => ({
  type: "Vec2",
  x: round(v$0.x),
  y: round(v$0.y)
} as t_43802a16);

/**
```
const Vec2float#28569bc0: Mul#1de4e4c0<Vec2#43802a16, float, Vec2#43802a16> = Mul#1de4e4c0<
    Vec2#43802a16,
    float,
    Vec2#43802a16,
>{
    "*"#1de4e4c0#0: (v#:0: Vec2#43802a16, scale#:1: float) ={}> Vec2#43802a16{
        x#43802a16#0: (v#:0.x#43802a16#0 * scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 * scale#:1),
    },
}
```
*/
export const hash_28569bc0: t_1de4e4c0<t_43802a16, number, t_43802a16> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (v$0: t_43802a16, scale$1: number) => ({
    type: "Vec2",
    x: v$0.x * scale$1,
    y: v$0.y * scale$1
  } as t_43802a16)
} as t_1de4e4c0<t_43802a16, number, t_43802a16>);

/**
```
const randFolks#69ebacba: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
) ={}> {
    const scale#:4 = 40.0;
    const small#:5 = Vec2float#28569bc0."*"#1de4e4c0#0(
        roundv2#b9171b62(ScaleVec2Rev#afc24bbe."/"#5ac12902#0(fragCoord#:1, scale#:4)),
        scale#:4,
    );
    const small#:6 = Vec2#43802a16{
        x#43802a16#0: small#:5.x#43802a16#0,
        y#43802a16#1: (small#:5.y#43802a16#1 + iTime#:0),
    };
    const v#:7 = ((random#347089ef(MulVec2#090f77e7."/"#5ac12902#0(small#:6, iResolution#:2)) / 10.0) + 0.9);
    const bouey#:8 = fishingBoueys#c225509c(
        iTime#:0,
        fragCoord#:1,
        iResolution#:2,
        ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(uCamera#:3, -1.0),
    );
    bouey#:8;
}
```
*/
export const hash_69ebacba: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: t_9f1c0644) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16, uCamera$3: t_9f1c0644) => {
  return hash_c225509c(iTime$0, fragCoord$1, iResolution$2, hash_1d31aa6e.h1de4e4c0_0(uCamera$3, -1));
};
export const randFolks = hash_69ebacba;