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
const TWO_PI#fc1474ce: float = (PI * 2.0)
```
*/
export const hash_fc1474ce: number = PI * 2;

/**
```
const MaxVelocity#6d7559cf: float = 0.01
```
*/
export const hash_6d7559cf: number = 0.01;

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
const normalizeTheta#c3a71e42: (float) ={}> float = (t#:0: float) ={}> if (t#:0 > PI) {
    (t#:0 - TWO_PI#fc1474ce);
} else {
    if (t#:0 < -PI) {
        (t#:0 + TWO_PI#fc1474ce);
    } else {
        t#:0;
    };
}
```
*/
export const hash_c3a71e42: (arg_0: number) => number = (t$0: number) => {
  if (t$0 > PI) {
    return t$0 - hash_fc1474ce;
  } else {
    if (t$0 < -PI) {
      return t$0 + hash_fc1474ce;
    } else {
      return t$0;
    }
  }
};

/**
```
const r2#0ce717e6: float = 100.0
```
*/
export const hash_0ce717e6: number = 100;

/**
```
const m2#b48c60a0: float = 20.0
```
*/
export const hash_b48c60a0: number = 20;

/**
```
const g#4466af4c: float = 0.15
```
*/
export const hash_4466af4c: number = 0.15;

/**
```
const pixOff#4f73f579: Vec4#3b941378 = Vec4#3b941378{
    z#9f1c0644#0: MaxVelocity#6d7559cf,
    x#43802a16#0: PI,
    y#43802a16#1: PI,
    w#3b941378#0: MaxVelocity#6d7559cf,
}
```
*/
export const hash_4f73f579: t_3b941378 = ({
  type: "Vec4",
  z: hash_6d7559cf,
  x: PI,
  y: PI,
  w: hash_6d7559cf
} as t_3b941378);

/**
```
const pixScale#f568896e: Vec4#3b941378 = Vec4#3b941378{
    z#9f1c0644#0: (MaxVelocity#6d7559cf * 2.0),
    x#43802a16#0: TWO_PI#fc1474ce,
    y#43802a16#1: TWO_PI#fc1474ce,
    w#3b941378#0: (MaxVelocity#6d7559cf * 2.0),
}
```
*/
export const hash_f568896e: t_3b941378 = ({
  type: "Vec4",
  z: hash_6d7559cf * 2,
  x: hash_fc1474ce,
  y: hash_fc1474ce,
  w: hash_6d7559cf * 2
} as t_3b941378);

/**
```
const Mul42#1b694fee: Mul#1de4e4c0<Vec4#3b941378, Vec4#3b941378, Vec4#3b941378> = Mul#1de4e4c0<
    Vec4#3b941378,
    Vec4#3b941378,
    Vec4#3b941378,
>{
    "*"#1de4e4c0#0: (v#:0: Vec4#3b941378, scale#:1: Vec4#3b941378) ={}> Vec4#3b941378{
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 * scale#:1.z#9f1c0644#0),
        x#43802a16#0: (v#:0.x#43802a16#0 * scale#:1.x#43802a16#0),
        y#43802a16#1: (v#:0.y#43802a16#1 * scale#:1.y#43802a16#1),
        w#3b941378#0: (v#:0.w#3b941378#0 * scale#:1.w#3b941378#0),
    },
}
```
*/
export const hash_1b694fee: t_1de4e4c0<t_3b941378, t_3b941378, t_3b941378> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (v$0: t_3b941378, scale$1: t_3b941378) => ({
    type: "Vec4",
    z: v$0.z * scale$1.z,
    x: v$0.x * scale$1.x,
    y: v$0.y * scale$1.y,
    w: v$0.w * scale$1.w
  } as t_3b941378)
} as t_1de4e4c0<t_3b941378, t_3b941378, t_3b941378>);

/**
```
const AddSubVec4#0555d260: AddSub#b99b22d8<Vec4#3b941378, Vec4#3b941378, Vec4#3b941378> = AddSub#b99b22d8<
    Vec4#3b941378,
    Vec4#3b941378,
    Vec4#3b941378,
>{
    "+"#b99b22d8#0: (one#:0: Vec4#3b941378, two#:1: Vec4#3b941378) ={}> Vec4#3b941378{
        z#9f1c0644#0: (one#:0.z#9f1c0644#0 + two#:1.z#9f1c0644#0),
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1.y#43802a16#1),
        w#3b941378#0: (one#:0.w#3b941378#0 + two#:1.w#3b941378#0),
    },
    "-"#b99b22d8#1: (one#:2: Vec4#3b941378, two#:3: Vec4#3b941378) ={}> Vec4#3b941378{
        z#9f1c0644#0: (one#:2.z#9f1c0644#0 - two#:3.z#9f1c0644#0),
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3.x#43802a16#0),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3.y#43802a16#1),
        w#3b941378#0: (one#:2.w#3b941378#0 - two#:3.w#3b941378#0),
    },
}
```
*/
export const hash_0555d260: t_b99b22d8<t_3b941378, t_3b941378, t_3b941378> = ({
  type: "b99b22d8",
  hb99b22d8_0: (one$0: t_3b941378, two$1: t_3b941378) => ({
    type: "Vec4",
    z: one$0.z + two$1.z,
    x: one$0.x + two$1.x,
    y: one$0.y + two$1.y,
    w: one$0.w + two$1.w
  } as t_3b941378),
  hb99b22d8_1: (one$2: t_3b941378, two$3: t_3b941378) => ({
    type: "Vec4",
    z: one$2.z - two$3.z,
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    w: one$2.w - two$3.w
  } as t_3b941378)
} as t_b99b22d8<t_3b941378, t_3b941378, t_3b941378>);

/**
```
const Scale42#5776a60e: Div#5ac12902<Vec4#3b941378, Vec4#3b941378, Vec4#3b941378> = Div#5ac12902<
    Vec4#3b941378,
    Vec4#3b941378,
    Vec4#3b941378,
>{
    "/"#5ac12902#0: (v#:0: Vec4#3b941378, scale#:1: Vec4#3b941378) ={}> Vec4#3b941378{
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 / scale#:1.z#9f1c0644#0),
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1.x#43802a16#0),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1.y#43802a16#1),
        w#3b941378#0: (v#:0.w#3b941378#0 / scale#:1.w#3b941378#0),
    },
}
```
*/
export const hash_5776a60e: t_5ac12902<t_3b941378, t_3b941378, t_3b941378> = ({
  type: "5ac12902",
  h5ac12902_0: (v$0: t_3b941378, scale$1: t_3b941378) => ({
    type: "Vec4",
    z: v$0.z / scale$1.z,
    x: v$0.x / scale$1.x,
    y: v$0.y / scale$1.y,
    w: v$0.w / scale$1.w
  } as t_3b941378)
} as t_5ac12902<t_3b941378, t_3b941378, t_3b941378>);

/**
```
const vabs2#394fe488: (Vec2#43802a16) ={}> Vec2#43802a16 = (v#:0: Vec2#43802a16) ={}> Vec2#43802a16{
    x#43802a16#0: abs(v#:0.x#43802a16#0),
    y#43802a16#1: abs(v#:0.y#43802a16#1),
}
```
*/
export const hash_394fe488: (arg_0: t_43802a16) => t_43802a16 = (v$0: t_43802a16) => ({
  type: "Vec2",
  x: abs(v$0.x),
  y: abs(v$0.y)
} as t_43802a16);

/**
```
const vmax2#e8162c1c: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    max(v#:0.x#43802a16#0, v#:0.y#43802a16#1);
}
```
*/
export const hash_e8162c1c: (arg_0: t_43802a16) => number = (v$0: t_43802a16) => {
  return max(v$0.x, v$0.y);
};

/**
```
const update#2e84009a: (float, float, float, float) ={}> Vec4#3b941378 = (
    a1#:0: float,
    a2#:1: float,
    a1_v#:2: float,
    a2_v#:3: float,
) ={}> {
    const num1#:4 = ((-g#4466af4c * ((2.0 * m2#b48c60a0) + m2#b48c60a0)) * sin(a1#:0));
    const num2#:5 = ((-m2#b48c60a0 * g#4466af4c) * sin((a1#:0 - (2.0 * a2#:1))));
    const num3#:6 = ((-2.0 * sin((a1#:0 - a2#:1))) * m2#b48c60a0);
    const num4#:7 = (((a2_v#:3 * a2_v#:3) * r2#0ce717e6) + (((a1_v#:2 * a1_v#:2) * r2#0ce717e6) * cos(
        (a1#:0 - a2#:1),
    )));
    const den#:8 = (r2#0ce717e6 * ((((2.0 * m2#b48c60a0) + m2#b48c60a0) - m2#b48c60a0) * cos(
        ((2.0 * a1#:0) - (2.0 * a2#:1)),
    )));
    const a1_a#:9 = ((((num1#:4 + num2#:5) + num3#:6) * num4#:7) / den#:8);
    const num1#:10 = (2.0 * sin((a1#:0 - a2#:1)));
    const num2#:11 = (((a1_v#:2 * a1_v#:2) * r2#0ce717e6) * (m2#b48c60a0 + m2#b48c60a0));
    const num3#:12 = ((g#4466af4c * (m2#b48c60a0 + m2#b48c60a0)) * cos(a1#:0));
    const num4#:13 = ((((a2_v#:3 * a2_v#:3) * r2#0ce717e6) * m2#b48c60a0) * cos((a1#:0 - a2#:1)));
    const den#:14 = (r2#0ce717e6 * ((((2.0 * m2#b48c60a0) + m2#b48c60a0) - m2#b48c60a0) * cos(
        ((2.0 * a1#:0) - (2.0 * a2#:1)),
    )));
    const a2_a#:15 = ((num1#:10 * ((num2#:11 + num3#:12) + num4#:13)) / den#:14);
    const a1_v#:16 = (a1_v#:2 + a1_a#:9);
    const a2_v#:17 = (a2_v#:3 + a2_a#:15);
    const a1#:18 = (a1#:0 + a1_v#:16);
    const a2#:19 = (a2#:1 + a2_v#:17);
    const a1#:20 = normalizeTheta#c3a71e42(a1#:18);
    const a2#:21 = normalizeTheta#c3a71e42(a2#:19);
    vec4#4d4983bb(a1#:20, a2#:21, a1_v#:16, a2_v#:17);
}
```
*/
export const hash_2e84009a: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_3b941378 = (a1$0: number, a2$1: number, a1_v$2: number, a2_v$3: number) => {
  let num1$4: number = -hash_4466af4c * (2 * hash_b48c60a0 + hash_b48c60a0) * sin(a1$0);
  let num2$5: number = -hash_b48c60a0 * hash_4466af4c * sin(a1$0 - 2 * a2$1);
  let num3$6: number = -2 * sin(a1$0 - a2$1) * hash_b48c60a0;
  let num4$7: number = a2_v$3 * a2_v$3 * hash_0ce717e6 + a1_v$2 * a1_v$2 * hash_0ce717e6 * cos(a1$0 - a2$1);
  let den$8: number = hash_0ce717e6 * ((2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0) * cos(2 * a1$0 - 2 * a2$1));
  let a1_a$9: number = (num1$4 + num2$5 + num3$6) * num4$7 / den$8;
  let num1$10: number = 2 * sin(a1$0 - a2$1);
  let num2$11: number = a1_v$2 * a1_v$2 * hash_0ce717e6 * (hash_b48c60a0 + hash_b48c60a0);
  let num3$12: number = hash_4466af4c * (hash_b48c60a0 + hash_b48c60a0) * cos(a1$0);
  let num4$13: number = a2_v$3 * a2_v$3 * hash_0ce717e6 * hash_b48c60a0 * cos(a1$0 - a2$1);
  let den$14: number = hash_0ce717e6 * ((2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0) * cos(2 * a1$0 - 2 * a2$1));
  let a2_a$15: number = num1$10 * (num2$11 + num3$12 + num4$13) / den$14;
  let a1_v$16: number = a1_v$2 + a1_a$9;
  let a2_v$17: number = a2_v$3 + a2_a$15;
  let a1$18: number = a1$0 + a1_v$16;
  let a2$19: number = a2$1 + a2_v$17;
  let a1$20: number = hash_c3a71e42(a1$18);
  let a2$21: number = hash_c3a71e42(a2$19);
  return hash_4d4983bb(a1$20, a2$21, a1_v$16, a2_v$17);
};

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
const length2#2e6a5f32: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    sqrt(((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)));
}
```
*/
export const hash_2e6a5f32: (arg_0: t_43802a16) => number = (v$0: t_43802a16) => {
  return sqrt(v$0.x * v$0.x + v$0.y * v$0.y);
};

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
const pixelToData#49f4e580: (Vec4#3b941378) ={}> Vec4#3b941378 = (v#:0: Vec4#3b941378) ={}> AddSubVec4#0555d260."-"#b99b22d8#1(
    Mul42#1b694fee."*"#1de4e4c0#0(v#:0, pixScale#f568896e),
    pixOff#4f73f579,
)
```
*/
export const hash_49f4e580: (arg_0: t_3b941378) => t_3b941378 = (v$0: t_3b941378) => hash_0555d260.hb99b22d8_1(hash_1b694fee.h1de4e4c0_0(v$0, hash_f568896e), hash_4f73f579);

/**
```
const dataToPixel#27178703: (Vec4#3b941378) ={}> Vec4#3b941378 = (v#:0: Vec4#3b941378) ={}> {
    const res#:1 = Scale42#5776a60e."/"#5ac12902#0(
        AddSubVec4#0555d260."+"#b99b22d8#0(v#:0, pixOff#4f73f579),
        pixScale#f568896e,
    );
    res#:1;
}
```
*/
export const hash_27178703: (arg_0: t_3b941378) => t_3b941378 = (v$0: t_3b941378) => {
  let res$1: t_3b941378 = hash_5776a60e.h5ac12902_0(hash_0555d260.hb99b22d8_0(v$0, hash_4f73f579), hash_f568896e);
  return res$1;
};

/**
```
const main#4d7cb99c: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644, sampler2D) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
    buffer#:4: sampler2D,
) ={}> {
    const currentp#:5 = texture(buffer#:4, Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: 0.0});
    const current#:6 = pixelToData#49f4e580(currentp#:5);
    const hw#:7 = ScaleVec2Rev#afc24bbe."/"#5ac12902#0(iResolution#:2, 2.0);
    const pos#:8 = Vec2#43802a16{
        x#43802a16#0: (hw#:7.x#43802a16#0 + (sin(current#:6.x#43802a16#0) * r2#0ce717e6)),
        y#43802a16#1: (hw#:7.y#43802a16#1 + (cos(current#:6.x#43802a16#0) * r2#0ce717e6)),
    };
    const pos2#:9 = Vec2#43802a16{
        x#43802a16#0: (pos#:8.x#43802a16#0 + (sin(current#:6.y#43802a16#1) * r2#0ce717e6)),
        y#43802a16#1: (pos#:8.y#43802a16#1 + (cos(current#:6.y#43802a16#1) * r2#0ce717e6)),
    };
    if (length2#2e6a5f32(AddSubVec2#70bb2056."-"#b99b22d8#1(pos#:8, fragCoord#:1)) < 10.0) {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 1.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        if (length2#2e6a5f32(AddSubVec2#70bb2056."-"#b99b22d8#1(pos2#:9, fragCoord#:1)) < 10.0) {
            Vec4#3b941378{
                z#9f1c0644#0: 0.0,
                x#43802a16#0: 1.0,
                y#43802a16#1: 1.0,
                w#3b941378#0: 1.0,
            };
        } else {
            const updated#:10 = dataToPixel#27178703(
                update#2e84009a(
                    current#:6.x#43802a16#0,
                    current#:6.y#43802a16#1,
                    current#:6.z#9f1c0644#0,
                    current#:6.w#3b941378#0,
                ),
            );
            const p1#:11 = AddSubVec2#70bb2056."-"#b99b22d8#1(
                fragCoord#:1,
                ScaleVec2Rev#afc24bbe."/"#5ac12902#0(iResolution#:2, 2.0),
            );
            const sdf#:12 = min(
                min(
                    min(
                        min(
                            min(
                                vmax2#e8162c1c(
                                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                                        vabs2#394fe488(
                                            AddSubVec2#70bb2056."-"#b99b22d8#1(
                                                p1#:11,
                                                Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: 0.0},
                                            ),
                                        ),
                                        Vec2#43802a16{
                                            x#43802a16#0: 5.0,
                                            y#43802a16#1: max(
                                                2.0,
                                                ((current#:6.x#43802a16#0 + PI) * 20.0),
                                            ),
                                        },
                                    ),
                                ),
                                vmax2#e8162c1c(
                                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                                        vabs2#394fe488(
                                            AddSubVec2#70bb2056."-"#b99b22d8#1(
                                                p1#:11,
                                                Vec2#43802a16{
                                                    x#43802a16#0: -10.0,
                                                    y#43802a16#1: 0.0,
                                                },
                                            ),
                                        ),
                                        Vec2#43802a16{
                                            x#43802a16#0: 3.0,
                                            y#43802a16#1: max(
                                                2.0,
                                                ((current#:6.y#43802a16#1 + PI) * 20.0),
                                            ),
                                        },
                                    ),
                                ),
                            ),
                            vmax2#e8162c1c(
                                AddSubVec2#70bb2056."-"#b99b22d8#1(
                                    vabs2#394fe488(
                                        AddSubVec2#70bb2056."-"#b99b22d8#1(
                                            p1#:11,
                                            Vec2#43802a16{x#43802a16#0: -20.0, y#43802a16#1: 0.0},
                                        ),
                                    ),
                                    Vec2#43802a16{
                                        x#43802a16#0: 3.0,
                                        y#43802a16#1: max(
                                            2.0,
                                            ((((current#:6.z#9f1c0644#0 + MaxVelocity#6d7559cf) / MaxVelocity#6d7559cf) / 2.0) * 10.0),
                                        ),
                                    },
                                ),
                            ),
                        ),
                        vmax2#e8162c1c(
                            AddSubVec2#70bb2056."-"#b99b22d8#1(
                                vabs2#394fe488(
                                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                                        p1#:11,
                                        Vec2#43802a16{x#43802a16#0: -30.0, y#43802a16#1: 0.0},
                                    ),
                                ),
                                Vec2#43802a16{
                                    x#43802a16#0: 3.0,
                                    y#43802a16#1: max(
                                        2.0,
                                        ((((current#:6.w#3b941378#0 + MaxVelocity#6d7559cf) / MaxVelocity#6d7559cf) / 2.0) * 10.0),
                                    ),
                                },
                            ),
                        ),
                    ),
                    vmax2#e8162c1c(
                        AddSubVec2#70bb2056."-"#b99b22d8#1(
                            vabs2#394fe488(
                                AddSubVec2#70bb2056."-"#b99b22d8#1(
                                    p1#:11,
                                    Vec2#43802a16{x#43802a16#0: -40.0, y#43802a16#1: 0.0},
                                ),
                            ),
                            Vec2#43802a16{
                                x#43802a16#0: 3.0,
                                y#43802a16#1: max(
                                    2.0,
                                    ((((updated#:10.z#9f1c0644#0 + MaxVelocity#6d7559cf) / MaxVelocity#6d7559cf) / 2.0) * 10.0),
                                ),
                            },
                        ),
                    ),
                ),
                vmax2#e8162c1c(
                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                        vabs2#394fe488(
                            AddSubVec2#70bb2056."-"#b99b22d8#1(
                                p1#:11,
                                Vec2#43802a16{x#43802a16#0: -50.0, y#43802a16#1: 0.0},
                            ),
                        ),
                        Vec2#43802a16{
                            x#43802a16#0: 3.0,
                            y#43802a16#1: max(
                                2.0,
                                ((((updated#:10.w#3b941378#0 + MaxVelocity#6d7559cf) / MaxVelocity#6d7559cf) / 2.0) * 10.0),
                            ),
                        },
                    ),
                ),
            );
            if (sdf#:12 < 0.0) {
                Vec4#3b941378{
                    z#9f1c0644#0: 1.0,
                    x#43802a16#0: 1.0,
                    y#43802a16#1: 1.0,
                    w#3b941378#0: 1.0,
                };
            } else {
                Vec4#3b941378{
                    z#9f1c0644#0: 0.0,
                    x#43802a16#0: 0.0,
                    y#43802a16#1: 0.0,
                    w#3b941378#0: 1.0,
                };
            };
        };
    };
}
```
*/
export const hash_4d7cb99c: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: t_9f1c0644, arg_4: sampler2D) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16, uCamera$3: t_9f1c0644, buffer$4: sampler2D) => {
  let currentp$5: t_3b941378 = texture(buffer$4, ({
    type: "Vec2",
    x: 0,
    y: 0
  } as t_43802a16));
  let current$6: t_3b941378 = hash_49f4e580(currentp$5);
  let hw$7: t_43802a16 = hash_afc24bbe.h5ac12902_0(iResolution$2, 2);
  let pos$8: t_43802a16 = ({
    type: "Vec2",
    x: hw$7.x + sin(current$6.x) * hash_0ce717e6,
    y: hw$7.y + cos(current$6.x) * hash_0ce717e6
  } as t_43802a16);
  let pos2$9: t_43802a16 = ({
    type: "Vec2",
    x: pos$8.x + sin(current$6.y) * hash_0ce717e6,
    y: pos$8.y + cos(current$6.y) * hash_0ce717e6
  } as t_43802a16);

  if (hash_2e6a5f32(hash_70bb2056.hb99b22d8_1(pos$8, fragCoord$1)) < 10) {
    return ({
      type: "Vec4",
      z: 0,
      x: 1,
      y: 0,
      w: 1
    } as t_3b941378);
  } else {
    if (hash_2e6a5f32(hash_70bb2056.hb99b22d8_1(pos2$9, fragCoord$1)) < 10) {
      return ({
        type: "Vec4",
        z: 0,
        x: 1,
        y: 1,
        w: 1
      } as t_3b941378);
    } else {
      let updated$10: t_3b941378 = hash_27178703(hash_2e84009a(current$6.x, current$6.y, current$6.z, current$6.w));
      let p1$11: t_43802a16 = hash_70bb2056.hb99b22d8_1(fragCoord$1, hash_afc24bbe.h5ac12902_0(iResolution$2, 2));
      let sdf$12: number = min(min(min(min(min(hash_e8162c1c(hash_70bb2056.hb99b22d8_1(hash_394fe488(hash_70bb2056.hb99b22d8_1(p1$11, ({
        type: "Vec2",
        x: 0,
        y: 0
      } as t_43802a16))), ({
        type: "Vec2",
        x: 5,
        y: max(2, (current$6.x + PI) * 20)
      } as t_43802a16))), hash_e8162c1c(hash_70bb2056.hb99b22d8_1(hash_394fe488(hash_70bb2056.hb99b22d8_1(p1$11, ({
        type: "Vec2",
        x: -10,
        y: 0
      } as t_43802a16))), ({
        type: "Vec2",
        x: 3,
        y: max(2, (current$6.y + PI) * 20)
      } as t_43802a16)))), hash_e8162c1c(hash_70bb2056.hb99b22d8_1(hash_394fe488(hash_70bb2056.hb99b22d8_1(p1$11, ({
        type: "Vec2",
        x: -20,
        y: 0
      } as t_43802a16))), ({
        type: "Vec2",
        x: 3,
        y: max(2, (current$6.z + hash_6d7559cf) / hash_6d7559cf / 2 * 10)
      } as t_43802a16)))), hash_e8162c1c(hash_70bb2056.hb99b22d8_1(hash_394fe488(hash_70bb2056.hb99b22d8_1(p1$11, ({
        type: "Vec2",
        x: -30,
        y: 0
      } as t_43802a16))), ({
        type: "Vec2",
        x: 3,
        y: max(2, (current$6.w + hash_6d7559cf) / hash_6d7559cf / 2 * 10)
      } as t_43802a16)))), hash_e8162c1c(hash_70bb2056.hb99b22d8_1(hash_394fe488(hash_70bb2056.hb99b22d8_1(p1$11, ({
        type: "Vec2",
        x: -40,
        y: 0
      } as t_43802a16))), ({
        type: "Vec2",
        x: 3,
        y: max(2, (updated$10.z + hash_6d7559cf) / hash_6d7559cf / 2 * 10)
      } as t_43802a16)))), hash_e8162c1c(hash_70bb2056.hb99b22d8_1(hash_394fe488(hash_70bb2056.hb99b22d8_1(p1$11, ({
        type: "Vec2",
        x: -50,
        y: 0
      } as t_43802a16))), ({
        type: "Vec2",
        x: 3,
        y: max(2, (updated$10.w + hash_6d7559cf) / hash_6d7559cf / 2 * 10)
      } as t_43802a16))));

      if (sdf$12 < 0) {
        return ({
          type: "Vec4",
          z: 1,
          x: 1,
          y: 1,
          w: 1
        } as t_3b941378);
      } else {
        return ({
          type: "Vec4",
          z: 0,
          x: 0,
          y: 0,
          w: 1
        } as t_3b941378);
      }
    }
  }
};

/**
```
const pendulum#5407de12: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644, sampler2D) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
    buffer#:4: sampler2D,
) ={}> {
    if (iTime#:0 <= 0.01) {
        vec4#4d4983bb(0.5, 0.4, 0.5, 0.5);
    } else {
        const current#:5 = texture(buffer#:4, Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: 0.0});
        const current#:6 = pixelToData#49f4e580(current#:5);
        if ((fragCoord#:1.x#43802a16#0 <= 1.01) && (fragCoord#:1.y#43802a16#1 <= 1.01)) {
            dataToPixel#27178703(
                update#2e84009a(
                    current#:6.x#43802a16#0,
                    current#:6.y#43802a16#1,
                    current#:6.z#9f1c0644#0,
                    current#:6.w#3b941378#0,
                ),
            );
        } else {
            Vec4#3b941378{
                z#9f1c0644#0: 0.0,
                x#43802a16#0: 0.0,
                y#43802a16#1: 0.0,
                w#3b941378#0: 1.0,
            };
        };
    };
}
```
*/
export const hash_5407de12: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: t_9f1c0644, arg_4: sampler2D) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16, uCamera$3: t_9f1c0644, buffer$4: sampler2D) => {
  if (iTime$0 <= 0.01) {
    return hash_4d4983bb(0.5, 0.4, 0.5, 0.5);
  } else {
    let current$5: t_3b941378 = texture(buffer$4, ({
      type: "Vec2",
      x: 0,
      y: 0
    } as t_43802a16));
    let current$6: t_3b941378 = hash_49f4e580(current$5);

    if (fragCoord$1.x <= 1.01 && fragCoord$1.y <= 1.01) {
      return hash_27178703(hash_2e84009a(current$6.x, current$6.y, current$6.z, current$6.w));
    } else {
      return ({
        type: "Vec4",
        z: 0,
        x: 0,
        y: 0,
        w: 1
      } as t_3b941378);
    }
  }
};
export const r1 = hash_0ce717e6;
export const r2 = hash_0ce717e6;
export const update = hash_2e84009a;
export const pendulum = hash_5407de12;
export const main = hash_4d7cb99c;