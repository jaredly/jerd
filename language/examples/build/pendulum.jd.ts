import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

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
@ffi type GLSLEnv#451d5252 = {
    time: float,
    resolution: Vec2#43802a16,
    camera: Vec3#9f1c0644,
    mouse: Vec2#43802a16,
}
```
*/
type t_451d5252 = {
  type: "GLSLEnv";
  time: number;
  resolution: t_43802a16;
  camera: t_9f1c0644;
  mouse: t_43802a16;
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
const clampF#f2f2e188: (float, float, float) ={}> float = (
    v#:0: float,
    minv#:1: float,
    maxv#:2: float,
) ={}> max(min(v#:0, maxv#:2), minv#:1)
```
*/
export const hash_f2f2e188: (arg_0: number, arg_1: number, arg_2: number) => number = (v: number, minv: number, maxv: number) => max(min(v, maxv), minv);

/**
```
const lerp#0c604a2c: (float, float, float) ={}> float = (a#:0: float, b#:1: float, c#:2: float) ={}> ((c#:2 * (b#:1 - a#:0)) + a#:0)
```
*/
export const hash_0c604a2c: (arg_0: number, arg_1: number, arg_2: number) => number = (a: number, b: number, c: number) => c * (b - a) + a;

/**
```
const fract#495c4d22: (float) ={}> float = (v#:0: float) ={}> (v#:0 - floor(v#:0))
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const MaxVelocity#158e986a: float = 0.1
```
*/
export const hash_158e986a: number = 0.1;

/**
```
const TWO_PI#fc1474ce: float = (PI * 2.0)
```
*/
export const hash_fc1474ce: number = PI * 2;

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
export const hash_5483fdc2: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644, min: t_9f1c0644, max: t_9f1c0644) => ({
  type: "Vec3",
  x: hash_f2f2e188(v.x, min.x, max.x),
  y: hash_f2f2e188(v.y, min.y, max.y),
  z: hash_f2f2e188(v.z, min.z, max.z)
} as t_9f1c0644);

/**
```
const mix#1d944e78: (Vec3#9f1c0644, Vec3#9f1c0644, float) ={}> Vec3#9f1c0644 = (
    a#:0: Vec3#9f1c0644,
    b#:1: Vec3#9f1c0644,
    c#:2: float,
) ={}> {
    Vec3#9f1c0644{
        x#43802a16#0: lerp#0c604a2c(a#:0.x#43802a16#0, b#:1.x#43802a16#0, c#:2),
        y#43802a16#1: lerp#0c604a2c(a#:0.y#43802a16#1, b#:1.y#43802a16#1, c#:2),
        z#9f1c0644#0: lerp#0c604a2c(a#:0.z#9f1c0644#0, b#:1.z#9f1c0644#0, c#:2),
    };
}
```
*/
export const hash_1d944e78: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: number) => t_9f1c0644 = (a: t_9f1c0644, b: t_9f1c0644, c: number) => ({
  type: "Vec3",
  x: hash_0c604a2c(a.x, b.x, c),
  y: hash_0c604a2c(a.y, b.y, c),
  z: hash_0c604a2c(a.z, b.z, c)
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
  h1de4e4c0_0: (scale: number, v$1: t_9f1c0644) => ({
    type: "Vec3",
    x: v$1.x * scale,
    y: v$1.y * scale,
    z: v$1.z * scale
  } as t_9f1c0644)
} as t_1de4e4c0<number, t_9f1c0644, t_9f1c0644>);

/**
```
const kxyz#1f96d598: Vec3#9f1c0644 = Vec3#9f1c0644{
    x#43802a16#0: 1.0,
    y#43802a16#1: (2.0 / 3.0),
    z#9f1c0644#0: (1.0 / 3.0),
}
```
*/
export const hash_1f96d598: t_9f1c0644 = ({
  type: "Vec3",
  x: 1,
  y: 2 / 3,
  z: 1 / 3
} as t_9f1c0644);

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
  hb99b22d8_0: (one: t_9f1c0644, two: t_9f1c0644) => ({
    type: "Vec3",
    x: one.x + two.x,
    y: one.y + two.y,
    z: one.z + two.z
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
const fract3#228606f4: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
    x#43802a16#0: fract#495c4d22(v#:0.x#43802a16#0),
    y#43802a16#1: fract#495c4d22(v#:0.y#43802a16#1),
    z#9f1c0644#0: fract#495c4d22(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_228606f4: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: hash_495c4d22(v.x),
  y: hash_495c4d22(v.y),
  z: hash_495c4d22(v.z)
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
  h1de4e4c0_0: (v: t_9f1c0644, scale$1: number) => ({
    type: "Vec3",
    x: v.x * scale$1,
    y: v.y * scale$1,
    z: v.z * scale$1
  } as t_9f1c0644)
} as t_1de4e4c0<t_9f1c0644, number, t_9f1c0644>);

/**
```
const AddSubVec3_#3b80b971: AddSub#b99b22d8<Vec3#9f1c0644, float, Vec3#9f1c0644> = AddSub#b99b22d8<
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
>{
    "+"#b99b22d8#0: (one#:0: Vec3#9f1c0644, two#:1: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1),
        z#9f1c0644#0: (one#:0.z#9f1c0644#0 + two#:1),
    },
    "-"#b99b22d8#1: (one#:2: Vec3#9f1c0644, two#:3: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3),
        z#9f1c0644#0: (one#:2.z#9f1c0644#0 - two#:3),
    },
}
```
*/
export const hash_3b80b971: t_b99b22d8<t_9f1c0644, number, t_9f1c0644> = ({
  type: "b99b22d8",
  hb99b22d8_0: (one: t_9f1c0644, two: number) => ({
    type: "Vec3",
    x: one.x + two,
    y: one.y + two,
    z: one.z + two
  } as t_9f1c0644),
  hb99b22d8_1: (one$2: t_9f1c0644, two$3: number) => ({
    type: "Vec3",
    x: one$2.x - two$3,
    y: one$2.y - two$3,
    z: one$2.z - two$3
  } as t_9f1c0644)
} as t_b99b22d8<t_9f1c0644, number, t_9f1c0644>);

/**
```
const vabs#1a074578: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
    x#43802a16#0: abs(v#:0.x#43802a16#0),
    y#43802a16#1: abs(v#:0.y#43802a16#1),
    z#9f1c0644#0: abs(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_1a074578: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_9f1c0644);

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
export const hash_4d4983bb: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_3b941378 = (x: number, y: number, z: number, w: number) => ({
  type: "Vec4",
  z: z,
  x: x,
  y: y,
  w: w
} as t_3b941378);

/**
```
const vabs2#394fe488: (Vec2#43802a16) ={}> Vec2#43802a16 = (v#:0: Vec2#43802a16) ={}> Vec2#43802a16{
    x#43802a16#0: abs(v#:0.x#43802a16#0),
    y#43802a16#1: abs(v#:0.y#43802a16#1),
}
```
*/
export const hash_394fe488: (arg_0: t_43802a16) => t_43802a16 = (v: t_43802a16) => ({
  type: "Vec2",
  x: abs(v.x),
  y: abs(v.y)
} as t_43802a16);

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
  hb99b22d8_0: (one: t_43802a16, two: t_43802a16) => ({
    type: "Vec2",
    x: one.x + two.x,
    y: one.y + two.y
  } as t_43802a16),
  hb99b22d8_1: (one$2: t_43802a16, two$3: t_43802a16) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_43802a16)
} as t_b99b22d8<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const vmax2#e8162c1c: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    max(v#:0.x#43802a16#0, v#:0.y#43802a16#1);
}
```
*/
export const hash_e8162c1c: (arg_0: t_43802a16) => number = (v: t_43802a16) => max(v.x, v.y);

/**
```
const length2#2e6a5f32: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    sqrt(((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)));
}
```
*/
export const hash_2e6a5f32: (arg_0: t_43802a16) => number = (v: t_43802a16) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const pixOff#44de0a86: Vec4#3b941378 = Vec4#3b941378{
    z#9f1c0644#0: MaxVelocity#158e986a,
    x#43802a16#0: PI,
    y#43802a16#1: PI,
    w#3b941378#0: MaxVelocity#158e986a,
}
```
*/
export const hash_44de0a86: t_3b941378 = ({
  type: "Vec4",
  z: hash_158e986a,
  x: PI,
  y: PI,
  w: hash_158e986a
} as t_3b941378);

/**
```
const pixScale#32bd7938: Vec4#3b941378 = Vec4#3b941378{
    z#9f1c0644#0: (MaxVelocity#158e986a * 2.0),
    x#43802a16#0: TWO_PI#fc1474ce,
    y#43802a16#1: TWO_PI#fc1474ce,
    w#3b941378#0: (MaxVelocity#158e986a * 2.0),
}
```
*/
export const hash_32bd7938: t_3b941378 = ({
  type: "Vec4",
  z: hash_158e986a * 2,
  x: hash_fc1474ce,
  y: hash_fc1474ce,
  w: hash_158e986a * 2
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
  h1de4e4c0_0: (v: t_3b941378, scale$1: t_3b941378) => ({
    type: "Vec4",
    z: v.z * scale$1.z,
    x: v.x * scale$1.x,
    y: v.y * scale$1.y,
    w: v.w * scale$1.w
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
  hb99b22d8_0: (one: t_3b941378, two: t_3b941378) => ({
    type: "Vec4",
    z: one.z + two.z,
    x: one.x + two.x,
    y: one.y + two.y,
    w: one.w + two.w
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
export const hash_c3a71e42: (arg_0: number) => number = (t: number) => {
  if (t > PI) {
    return t - hash_fc1474ce;
  } else {
    if (t < -PI) {
      return t + hash_fc1474ce;
    } else {
      return t;
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
  h5ac12902_0: (v: t_3b941378, scale$1: t_3b941378) => ({
    type: "Vec4",
    z: v.z / scale$1.z,
    x: v.x / scale$1.x,
    y: v.y / scale$1.y,
    w: v.w / scale$1.w
  } as t_3b941378)
} as t_5ac12902<t_3b941378, t_3b941378, t_3b941378>);

/**
```
const hsv2rgb#5c8b4a90: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (c#:0: Vec3#9f1c0644) ={}> {
    const K#:1 = vec4#4d4983bb(1.0, (2.0 / 3.0), (1.0 / 3.0), 3.0);
    const xxx#:2 = Vec3#9f1c0644{
        x#43802a16#0: c#:0.x#43802a16#0,
        y#43802a16#1: c#:0.x#43802a16#0,
        z#9f1c0644#0: c#:0.x#43802a16#0,
    };
    const p#:3 = vabs#1a074578(
        AddSubVec3_#3b80b971."-"#b99b22d8#1(
            ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(
                fract3#228606f4(AddSubVec3#1c6fdd91."+"#b99b22d8#0(xxx#:2, kxyz#1f96d598)),
                6.0,
            ),
            3.0,
        ),
    );
    const kxxx#:4 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
    ScaleVec3#c4a91006."*"#1de4e4c0#0(
        c#:0.z#9f1c0644#0,
        mix#1d944e78(
            kxxx#:4,
            clamp#5483fdc2(
                AddSubVec3#1c6fdd91."-"#b99b22d8#1(p#:3, kxxx#:4),
                Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
                Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
            ),
            c#:0.y#43802a16#1,
        ),
    );
}
```
*/
export const hash_5c8b4a90: (arg_0: t_9f1c0644) => t_9f1c0644 = (c$0: t_9f1c0644) => {
  let kxxx: t_9f1c0644 = ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_9f1c0644);
  return hash_c4a91006.h1de4e4c0_0(c$0.z, hash_1d944e78(kxxx, hash_5483fdc2(hash_1c6fdd91.hb99b22d8_1(hash_1a074578(hash_3b80b971.hb99b22d8_1(hash_1d31aa6e.h1de4e4c0_0(hash_228606f4(hash_1c6fdd91.hb99b22d8_0(({
    type: "Vec3",
    x: c$0.x,
    y: c$0.x,
    z: c$0.x
  } as t_9f1c0644), hash_1f96d598)), 6), 3)), kxxx), ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 0
  } as t_9f1c0644), ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_9f1c0644)), c$0.y));
};

/**
```
const rect#0fa3bd82: (Vec2#43802a16, Vec2#43802a16, float, float) ={}> float = (
    samplePos#:0: Vec2#43802a16,
    center#:1: Vec2#43802a16,
    w#:2: float,
    h#:3: float,
) ={}> {
    vmax2#e8162c1c(
        AddSubVec2#70bb2056."-"#b99b22d8#1(
            vabs2#394fe488(AddSubVec2#70bb2056."-"#b99b22d8#1(samplePos#:0, center#:1)),
            Vec2#43802a16{x#43802a16#0: w#:2, y#43802a16#1: h#:3},
        ),
    );
}
```
*/
export const hash_0fa3bd82: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: number, arg_3: number) => number = (samplePos: t_43802a16, center: t_43802a16, w$2: number, h: number) => hash_e8162c1c(hash_70bb2056.hb99b22d8_1(hash_394fe488(hash_70bb2056.hb99b22d8_1(samplePos, center)), ({
  type: "Vec2",
  x: w$2,
  y: h
} as t_43802a16)));

/**
```
const circle#7103c1d2: (Vec2#43802a16, Vec2#43802a16, float) ={}> float = (
    samplePos#:0: Vec2#43802a16,
    center#:1: Vec2#43802a16,
    r#:2: float,
) ={}> {
    (length2#2e6a5f32(AddSubVec2#70bb2056."-"#b99b22d8#1(samplePos#:0, center#:1)) - r#:2);
}
```
*/
export const hash_7103c1d2: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: number) => number = (samplePos: t_43802a16, center: t_43802a16, r: number) => hash_2e6a5f32(hash_70bb2056.hb99b22d8_1(samplePos, center)) - r;

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
  h5ac12902_0: (v: t_43802a16, scale$1: number) => ({
    type: "Vec2",
    x: v.x / scale$1,
    y: v.y / scale$1
  } as t_43802a16)
} as t_5ac12902<t_43802a16, number, t_43802a16>);

/**
```
const pixelToData#446114f2: (Vec4#3b941378) ={}> Vec4#3b941378 = (v#:0: Vec4#3b941378) ={}> AddSubVec4#0555d260."-"#b99b22d8#1(
    Mul42#1b694fee."*"#1de4e4c0#0(v#:0, pixScale#32bd7938),
    pixOff#44de0a86,
)
```
*/
export const hash_446114f2: (arg_0: t_3b941378) => t_3b941378 = (v: t_3b941378) => hash_0555d260.hb99b22d8_1(hash_1b694fee.h1de4e4c0_0(v, hash_32bd7938), hash_44de0a86);

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
  h5ac12902_0: (v: t_43802a16, scale$1: t_43802a16) => ({
    type: "Vec2",
    x: v.x / scale$1.x,
    y: v.y / scale$1.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const update#74a18562: (float, float, float, float) ={}> Vec4#3b941378 = (
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
    const den#:8 = (r2#0ce717e6 * (((2.0 * m2#b48c60a0) + m2#b48c60a0) - (m2#b48c60a0 * cos(
        ((2.0 * a1#:0) - (2.0 * a2#:1)),
    ))));
    const a1_a#:9 = (((num1#:4 + num2#:5) + (num3#:6 * num4#:7)) / den#:8);
    const num1#:10 = (2.0 * sin((a1#:0 - a2#:1)));
    const num2#:11 = (((a1_v#:2 * a1_v#:2) * r2#0ce717e6) * (m2#b48c60a0 + m2#b48c60a0));
    const num3#:12 = ((g#4466af4c * (m2#b48c60a0 + m2#b48c60a0)) * cos(a1#:0));
    const num4#:13 = ((((a2_v#:3 * a2_v#:3) * r2#0ce717e6) * m2#b48c60a0) * cos((a1#:0 - a2#:1)));
    const den#:14 = (r2#0ce717e6 * (((2.0 * m2#b48c60a0) + m2#b48c60a0) - (m2#b48c60a0 * cos(
        ((2.0 * a1#:0) - (2.0 * a2#:1)),
    ))));
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
export const hash_74a18562: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_3b941378 = (a1: number, a2: number, a1_v: number, a2_v: number) => {
  let a1_v$16: number = a1_v + (-hash_4466af4c * (2 * hash_b48c60a0 + hash_b48c60a0) * sin(a1) + -hash_b48c60a0 * hash_4466af4c * sin(a1 - 2 * a2) + -2 * sin(a1 - a2) * hash_b48c60a0 * (a2_v * a2_v * hash_0ce717e6 + a1_v * a1_v * hash_0ce717e6 * cos(a1 - a2))) / (hash_0ce717e6 * (2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0 * cos(2 * a1 - 2 * a2)));
  let a2_v$17: number = a2_v + 2 * sin(a1 - a2) * (a1_v * a1_v * hash_0ce717e6 * (hash_b48c60a0 + hash_b48c60a0) + hash_4466af4c * (hash_b48c60a0 + hash_b48c60a0) * cos(a1) + a2_v * a2_v * hash_0ce717e6 * hash_b48c60a0 * cos(a1 - a2)) / (hash_0ce717e6 * (2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0 * cos(2 * a1 - 2 * a2)));
  return hash_4d4983bb(hash_c3a71e42(a1 + a1_v$16), hash_c3a71e42(a2 + a2_v$17), a1_v$16, a2_v$17);
};

/**
```
const dataToPixel#6ca470d0: (Vec4#3b941378) ={}> Vec4#3b941378 = (v#:0: Vec4#3b941378) ={}> {
    const res#:1 = Scale42#5776a60e."/"#5ac12902#0(
        AddSubVec4#0555d260."+"#b99b22d8#0(v#:0, pixOff#44de0a86),
        pixScale#32bd7938,
    );
    res#:1;
}
```
*/
export const hash_6ca470d0: (arg_0: t_3b941378) => t_3b941378 = (v: t_3b941378) => hash_5776a60e.h5ac12902_0(hash_0555d260.hb99b22d8_0(v, hash_44de0a86), hash_32bd7938);

/**
```
const main#6b937d8a: (GLSLEnv#451d5252, Vec2#43802a16, sampler2D) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D,
) ={}> {
    const currentPos#:3 = MulVec2#090f77e7."/"#5ac12902#0(
        env#:0.mouse#451d5252#3,
        env#:0.resolution#451d5252#1,
    );
    const currentp#:4 = texture(buffer#:2, currentPos#:3);
    const current#:5 = pixelToData#446114f2(currentp#:4);
    const p1#:6 = AddSubVec2#70bb2056."-"#b99b22d8#1(
        fragCoord#:1,
        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(env#:0.resolution#451d5252#1, 2.0),
    );
    const c1#:7 = Vec2#43802a16{
        x#43802a16#0: (sin(current#:5.x#43802a16#0) * r2#0ce717e6),
        y#43802a16#1: (-cos(current#:5.x#43802a16#0) * r2#0ce717e6),
    };
    const c2#:8 = Vec2#43802a16{
        x#43802a16#0: (c1#:7.x#43802a16#0 + (sin(current#:5.y#43802a16#1) * r2#0ce717e6)),
        y#43802a16#1: (c1#:7.y#43802a16#1 - (cos(current#:5.y#43802a16#1) * r2#0ce717e6)),
    };
    if (circle#7103c1d2(p1#:6, c1#:7, 10.0) < 0.0) {
        vec4#4d4983bb(1.0, 0.0, 0.0, 1.0);
    } else {
        if (circle#7103c1d2(p1#:6, c2#:8, 10.0) < 0.0) {
            vec4#4d4983bb(1.0, 1.0, 0.0, 1.0);
        } else {
            if (max(
                rect#0fa3bd82(
                    p1#:6,
                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                        env#:0.mouse#451d5252#3,
                        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(env#:0.resolution#451d5252#1, 2.0),
                    ),
                    10.0,
                    10.0,
                ),
                -rect#0fa3bd82(
                    p1#:6,
                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                        env#:0.mouse#451d5252#3,
                        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(env#:0.resolution#451d5252#1, 2.0),
                    ),
                    9.0,
                    9.0,
                ),
            ) < 0.0) {
                vec4#4d4983bb(0.0, 0.0, 0.0, 1.0);
            } else {
                if (length2#2e6a5f32(
                    AddSubVec2#70bb2056."-"#b99b22d8#1(
                        p1#:6,
                        AddSubVec2#70bb2056."-"#b99b22d8#1(
                            env#:0.mouse#451d5252#3,
                            ScaleVec2Rev#afc24bbe."/"#5ac12902#0(env#:0.resolution#451d5252#1, 2.0),
                        ),
                    ),
                ) < 100.0) {
                    const t#:9 = texture(
                        buffer#:2,
                        MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
                    );
                    const rgb#:10 = hsv2rgb#5c8b4a90(
                        Vec3#9f1c0644{
                            x#43802a16#0: t#:9.z#9f1c0644#0,
                            y#43802a16#1: t#:9.w#3b941378#0,
                            z#9f1c0644#0: 1.0,
                        },
                    );
                    Vec4#3b941378{...rgb#:10, w#3b941378#0: 1.0};
                } else {
                    if (length2#2e6a5f32(
                        AddSubVec2#70bb2056."-"#b99b22d8#1(
                            p1#:6,
                            AddSubVec2#70bb2056."-"#b99b22d8#1(
                                env#:0.mouse#451d5252#3,
                                ScaleVec2Rev#afc24bbe."/"#5ac12902#0(
                                    env#:0.resolution#451d5252#1,
                                    2.0,
                                ),
                            ),
                        ),
                    ) < 101.0) {
                        vec4#4d4983bb(0.0, 0.0, 0.0, 1.0);
                    } else {
                        const t#:11 = texture(
                            buffer#:2,
                            MulVec2#090f77e7."/"#5ac12902#0(
                                fragCoord#:1,
                                env#:0.resolution#451d5252#1,
                            ),
                        );
                        const rgb#:12 = hsv2rgb#5c8b4a90(
                            Vec3#9f1c0644{
                                x#43802a16#0: t#:11.y#43802a16#1,
                                y#43802a16#1: t#:11.x#43802a16#0,
                                z#9f1c0644#0: 1.0,
                            },
                        );
                        Vec4#3b941378{...rgb#:12, w#3b941378#0: 1.0};
                    };
                };
            };
        };
    };
}
```
*/
export const hash_6b937d8a: (arg_0: t_451d5252, arg_1: t_43802a16, arg_2: sampler2D) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16, buffer: sampler2D) => {
  let current: t_3b941378 = hash_446114f2(texture(buffer, hash_090f77e7.h5ac12902_0(env.mouse, env.resolution)));
  let p1: t_43802a16 = hash_70bb2056.hb99b22d8_1(fragCoord, hash_afc24bbe.h5ac12902_0(env.resolution, 2));
  let c1: t_43802a16 = ({
    type: "Vec2",
    x: sin(current.x) * hash_0ce717e6,
    y: -cos(current.x) * hash_0ce717e6
  } as t_43802a16);

  if (hash_7103c1d2(p1, c1, 10) < 0) {
    return hash_4d4983bb(1, 0, 0, 1);
  } else {
    if (hash_7103c1d2(p1, ({
      type: "Vec2",
      x: c1.x + sin(current.y) * hash_0ce717e6,
      y: c1.y - cos(current.y) * hash_0ce717e6
    } as t_43802a16), 10) < 0) {
      return hash_4d4983bb(1, 1, 0, 1);
    } else {
      if (max(hash_0fa3bd82(p1, hash_70bb2056.hb99b22d8_1(env.mouse, hash_afc24bbe.h5ac12902_0(env.resolution, 2)), 10, 10), -hash_0fa3bd82(p1, hash_70bb2056.hb99b22d8_1(env.mouse, hash_afc24bbe.h5ac12902_0(env.resolution, 2)), 9, 9)) < 0) {
        return hash_4d4983bb(0, 0, 0, 1);
      } else {
        if (hash_2e6a5f32(hash_70bb2056.hb99b22d8_1(p1, hash_70bb2056.hb99b22d8_1(env.mouse, hash_afc24bbe.h5ac12902_0(env.resolution, 2)))) < 100) {
          let t$9: t_3b941378 = texture(buffer, hash_090f77e7.h5ac12902_0(fragCoord, env.resolution));
          return ({ ...hash_5c8b4a90(({
              type: "Vec3",
              x: t$9.z,
              y: t$9.w,
              z: 1
            } as t_9f1c0644)),
            type: "Vec4",
            w: 1
          } as t_3b941378);
        } else {
          if (hash_2e6a5f32(hash_70bb2056.hb99b22d8_1(p1, hash_70bb2056.hb99b22d8_1(env.mouse, hash_afc24bbe.h5ac12902_0(env.resolution, 2)))) < 101) {
            return hash_4d4983bb(0, 0, 0, 1);
          } else {
            let t$11: t_3b941378 = texture(buffer, hash_090f77e7.h5ac12902_0(fragCoord, env.resolution));
            return ({ ...hash_5c8b4a90(({
                type: "Vec3",
                x: t$11.y,
                y: t$11.x,
                z: 1
              } as t_9f1c0644)),
              type: "Vec4",
              w: 1
            } as t_3b941378);
          }
        }
      }
    }
  }
};

/**
```
const pendulum#bf7a10e0: (GLSLEnv#451d5252, Vec2#43802a16, sampler2D) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D,
) ={}> {
    if (env#:0.time#451d5252#0 <= 0.01) {
        const t#:3 = MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1);
        vec4#4d4983bb(0.0, 0.0, t#:3.x#43802a16#0, t#:3.y#43802a16#1);
    } else {
        const current#:4 = texture(
            buffer#:2,
            MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
        );
        const current#:5 = pixelToData#446114f2(current#:4);
        dataToPixel#6ca470d0(
            update#74a18562(
                current#:5.x#43802a16#0,
                current#:5.y#43802a16#1,
                current#:5.z#9f1c0644#0,
                current#:5.w#3b941378#0,
            ),
        );
    };
}
```
*/
export const hash_bf7a10e0: (arg_0: t_451d5252, arg_1: t_43802a16, arg_2: sampler2D) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16, buffer: sampler2D) => {
  if (env.time <= 0.01) {
    let t$3: t_43802a16 = hash_090f77e7.h5ac12902_0(fragCoord, env.resolution);
    return hash_4d4983bb(0, 0, t$3.x, t$3.y);
  } else {
    let current: t_3b941378 = hash_446114f2(texture(buffer, hash_090f77e7.h5ac12902_0(fragCoord, env.resolution)));
    return hash_6ca470d0(hash_74a18562(current.x, current.y, current.z, current.w));
  }
};
export const r1 = hash_0ce717e6;
export const r2 = hash_0ce717e6;
export const update = hash_74a18562;
export const pendulum = hash_bf7a10e0;
export const main = hash_6b937d8a;