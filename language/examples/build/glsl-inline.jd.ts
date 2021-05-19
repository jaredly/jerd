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
const normalize#ce463a80: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> ScaleVec3Rev#68f73ad4."/"#5ac12902#0(
    v#:0,
    length#1cc335a2(v#:0),
)
```
*/
export const hash_ce463a80: (arg_0: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644) => hash_68f73ad4.h5ac12902_0(v$0, hash_1cc335a2(v$0));

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
const EPSILON#ec7f8d1c: float = 0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

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
const sceneSDF#6009ff98: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const double#:2 = (iTime#:0 * 2.0);
    const p1#:3 = samplePoint#:1;
    (length#1cc335a2(p1#:3) - 0.5);
}
```
*/
export const hash_6009ff98: (arg_0: number, arg_1: t_9f1c0644) => number = (iTime$0: number, samplePoint$1: t_9f1c0644) => hash_1cc335a2(samplePoint$1) - 0.5;

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
const MAX_MARCHING_STEPS#62404440: int = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const shortestDistanceToSurface#56314282: (
    (float, Vec3#9f1c0644) ={}> float,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    float,
    int,
) ={}> float = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    eye#:2: Vec3#9f1c0644,
    marchingDirection#:3: Vec3#9f1c0644,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
) ={}> {
    if (stepsLeft#:6 <= 0) {
        end#:5;
    } else {
        const dist#:7 = sceneSDF#:0(
            iTime#:1,
            AddSubVec3#1c6fdd91."+"#b99b22d8#0(
                eye#:2,
                ScaleVec3#c4a91006."*"#1de4e4c0#0(start#:4, marchingDirection#:3),
            ),
        );
        if (dist#:7 < EPSILON#ec7f8d1c) {
            start#:4;
        } else {
            const depth#:8 = (start#:4 + dist#:7);
            if (depth#:8 >= end#:5) {
                end#:5;
            } else {
                56314282(
                    sceneSDF#:0,
                    iTime#:1,
                    eye#:2,
                    marchingDirection#:3,
                    depth#:8,
                    end#:5,
                    (stepsLeft#:6 - 1),
                );
            };
        };
    };
}
```
*/
export const hash_56314282: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF$0: (arg_0: number, arg_1: t_9f1c0644) => number, iTime$1: number, eye$2: t_9f1c0644, marchingDirection$3: t_9f1c0644, start$4: number, end$5: number, stepsLeft$6: number) => {
  while (true) {
    if (stepsLeft$6 <= 0) {
      return end$5;
    } else {
      let dist$7: number = sceneSDF$0(iTime$1, hash_1c6fdd91.hb99b22d8_0(eye$2, hash_c4a91006.h1de4e4c0_0(start$4, marchingDirection$3)));

      if (dist$7 < hash_ec7f8d1c) {
        return start$4;
      } else {
        let depth$8: number = start$4 + dist$7;

        if (depth$8 >= end$5) {
          return end$5;
        } else {
          sceneSDF$0 = sceneSDF$0;
          iTime$1 = iTime$1;
          eye$2 = eye$2;
          marchingDirection$3 = marchingDirection$3;
          start$4 = depth$8;
          end$5 = end$5;
          stepsLeft$6 = stepsLeft$6 - 1;
          continue;
        }
      }
    }
  }
};

/**
```
const fishingBoueys#f60e38b0: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
) ={}> {
    const dir#:3 = rayDirection#fb220c84(45.0, iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#56314282(
        sceneSDF#6009ff98,
        iTime#:0,
        eye#:4,
        dir#:3,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    if (dist#:5 > (MAX_DIST#0ce717e6 - EPSILON#ec7f8d1c)) {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 0.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 1.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    };
}
```
*/
export const hash_f60e38b0: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16) => {
  if (hash_56314282(hash_6009ff98, iTime$0, ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_9f1c0644), hash_fb220c84(45, iResolution$2, fragCoord$1), hash_f2cd39b8, hash_0ce717e6, hash_62404440) > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_3b941378);
  } else {
    return ({
      type: "Vec4",
      z: 0,
      x: 1,
      y: 0,
      w: 1
    } as t_3b941378);
  }
};
export const fishingBoueys = hash_f60e38b0;