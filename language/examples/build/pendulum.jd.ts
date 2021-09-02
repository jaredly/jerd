import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@ffi("Vec2") type Vec2#43802a16 = {
    x: float#builtin,
    y: float#builtin,
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
@ffi("Vec3") type Vec3#9f1c0644 = {
    ...Vec2#43802a16,
    z: float#builtin,
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
@ffi("GLSLEnv") type GLSLEnv#451d5252 = {
    time: float#builtin,
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
type Div#5ac12902<A#:0, B#:1, C#:2> = {
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
@ffi("Vec4") type Vec4#3b941378 = {
    ...Vec3#9f1c0644,
    w: float#builtin,
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
type AddSub#b99b22d8<A#:0, B#:1, C#:2> = {
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
type Mul#1de4e4c0<A#:0, B#:1, C#:2> = {
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
const clamp#f2f2e188 = (v#:0: float#builtin, minv#:1: float#builtin, maxv#:2: float#builtin): float#builtin ={}> max#builtin(
    min#builtin(v#:0, maxv#:2),
    minv#:1,
)
```
*/
export const hash_f2f2e188: (arg_0: number, arg_1: number, arg_2: number) => number = (v: number, minv: number, maxv: number) => max(min(v, maxv), minv);

/**
```
const lerp#0c604a2c = (a#:0: float#builtin, b#:1: float#builtin, c#:2: float#builtin): float#builtin ={}> c#:2 
        *#builtin (b#:1 -#builtin a#:0) 
    +#builtin a#:0
```
*/
export const hash_0c604a2c: (arg_0: number, arg_1: number, arg_2: number) => number = (a: number, b: number, c: number) => c * (b - a) + a;

/**
```
const fract#495c4d22 = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const MaxVelocity#158e986a = 0.1
```
*/
export const hash_158e986a: number = 0.1;

/**
```
const TWO_PI#fc1474ce = PI#builtin *#builtin 2.0
```
*/
export const hash_fc1474ce: number = PI * 2;

/**
```
const clamp#58cc5fcf = (v#:0: Vec3#9f1c0644, min#:1: Vec3#9f1c0644, max#:2: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: clamp#f2f2e188(
        v: v#:0.x#43802a16#0,
        minv: min#:1.x#43802a16#0,
        maxv: max#:2.x#43802a16#0,
    ),
    y#43802a16#1: clamp#f2f2e188(
        v: v#:0.y#43802a16#1,
        minv: min#:1.y#43802a16#1,
        maxv: max#:2.y#43802a16#1,
    ),
    z#9f1c0644#0: clamp#f2f2e188(
        v: v#:0.z#9f1c0644#0,
        minv: min#:1.z#9f1c0644#0,
        maxv: max#:2.z#9f1c0644#0,
    ),
}
```
*/
export const hash_58cc5fcf: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644, min: t_9f1c0644, max: t_9f1c0644) => ({
  type: "Vec3",
  x: hash_f2f2e188(v.x, min.x, max.x),
  y: hash_f2f2e188(v.y, min.y, max.y),
  z: hash_f2f2e188(v.z, min.z, max.z)
} as t_9f1c0644);

/**
```
const mix#24a43cac = (a#:0: Vec3#9f1c0644, b#:1: Vec3#9f1c0644, c#:2: float#builtin): Vec3#9f1c0644 ={}> {
    Vec3#9f1c0644{
        x#43802a16#0: lerp#0c604a2c(a: a#:0.x#43802a16#0, b: b#:1.x#43802a16#0, c#:2),
        y#43802a16#1: lerp#0c604a2c(a: a#:0.y#43802a16#1, b: b#:1.y#43802a16#1, c#:2),
        z#9f1c0644#0: lerp#0c604a2c(a: a#:0.z#9f1c0644#0, b: b#:1.z#9f1c0644#0, c#:2),
    };
}
```
*/
export const hash_24a43cac: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: number) => t_9f1c0644 = (a: t_9f1c0644, b: t_9f1c0644, c: number) => ({
  type: "Vec3",
  x: hash_0c604a2c(a.x, b.x, c),
  y: hash_0c604a2c(a.y, b.y, c),
  z: hash_0c604a2c(a.z, b.z, c)
} as t_9f1c0644);

/**
```
const ScaleVec3#fab8930c = Mul#1de4e4c0<float#builtin, Vec3#9f1c0644, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (scale#:0: float#builtin, v#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:1.x#43802a16#0 *#builtin scale#:0,
        y#43802a16#1: v#:1.y#43802a16#1 *#builtin scale#:0,
        z#9f1c0644#0: v#:1.z#9f1c0644#0 *#builtin scale#:0,
    },
}
```
*/
export const hash_fab8930c: t_1de4e4c0<number, t_9f1c0644, t_9f1c0644> = ({
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
const kxyz#1f96d598 = Vec3#9f1c0644{
    x#43802a16#0: 1.0,
    y#43802a16#1: 2.0 /#builtin 3.0,
    z#9f1c0644#0: 1.0 /#builtin 3.0,
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
const AddSubVec3#0ec72cf4 = AddSub#b99b22d8<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644>{
    "+"#b99b22d8#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: one#:0.x#43802a16#0 +#builtin two#:1.x#43802a16#0,
        y#43802a16#1: one#:0.y#43802a16#1 +#builtin two#:1.y#43802a16#1,
        z#9f1c0644#0: one#:0.z#9f1c0644#0 +#builtin two#:1.z#9f1c0644#0,
    },
    "-"#b99b22d8#1: (one#:2: Vec3#9f1c0644, two#:3: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: one#:2.x#43802a16#0 -#builtin two#:3.x#43802a16#0,
        y#43802a16#1: one#:2.y#43802a16#1 -#builtin two#:3.y#43802a16#1,
        z#9f1c0644#0: one#:2.z#9f1c0644#0 -#builtin two#:3.z#9f1c0644#0,
    },
}
```
*/
export const hash_0ec72cf4: t_b99b22d8<t_9f1c0644, t_9f1c0644, t_9f1c0644> = ({
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
const fract#11f8b1b0 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: fract#495c4d22(v: v#:0.x#43802a16#0),
    y#43802a16#1: fract#495c4d22(v: v#:0.y#43802a16#1),
    z#9f1c0644#0: fract#495c4d22(v: v#:0.z#9f1c0644#0),
}
```
*/
export const hash_11f8b1b0: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: hash_495c4d22(v.x),
  y: hash_495c4d22(v.y),
  z: hash_495c4d22(v.z)
} as t_9f1c0644);

/**
```
const ScaleVec3_#3dc35220 = Mul#1de4e4c0<Vec3#9f1c0644, float#builtin, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (v#:0: Vec3#9f1c0644, scale#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:0.x#43802a16#0 *#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 *#builtin scale#:1,
        z#9f1c0644#0: v#:0.z#9f1c0644#0 *#builtin scale#:1,
    },
}
```
*/
export const hash_3dc35220: t_1de4e4c0<t_9f1c0644, number, t_9f1c0644> = ({
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
const AddSubVec3_#c02461a4 = AddSub#b99b22d8<Vec3#9f1c0644, float#builtin, Vec3#9f1c0644>{
    "+"#b99b22d8#0: (one#:0: Vec3#9f1c0644, two#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: one#:0.x#43802a16#0 +#builtin two#:1,
        y#43802a16#1: one#:0.y#43802a16#1 +#builtin two#:1,
        z#9f1c0644#0: one#:0.z#9f1c0644#0 +#builtin two#:1,
    },
    "-"#b99b22d8#1: (one#:2: Vec3#9f1c0644, two#:3: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: one#:2.x#43802a16#0 -#builtin two#:3,
        y#43802a16#1: one#:2.y#43802a16#1 -#builtin two#:3,
        z#9f1c0644#0: one#:2.z#9f1c0644#0 -#builtin two#:3,
    },
}
```
*/
export const hash_c02461a4: t_b99b22d8<t_9f1c0644, number, t_9f1c0644> = ({
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
const abs#523d7378 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: abs#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: abs#builtin(v#:0.y#43802a16#1),
    z#9f1c0644#0: abs#builtin(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_523d7378: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_9f1c0644);

/**
```
const vec4#4d4983bb = (
    x#:0: float#builtin,
    y#:1: float#builtin,
    z#:2: float#builtin,
    w#:3: float#builtin,
): Vec4#3b941378 ={}> Vec4#3b941378{
    z#9f1c0644#0: z#:2,
    x#43802a16#0: x#:0,
    y#43802a16#1: y#:1,
    w#3b941378#0: w#:3,
}
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
const abs#475ec8fa = (v#:0: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
    x#43802a16#0: abs#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: abs#builtin(v#:0.y#43802a16#1),
}
```
*/
export const hash_475ec8fa: (arg_0: t_43802a16) => t_43802a16 = (v: t_43802a16) => ({
  type: "Vec2",
  x: abs(v.x),
  y: abs(v.y)
} as t_43802a16);

/**
```
const AddSubVec2#5fdcc910 = AddSub#b99b22d8<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
    "+"#b99b22d8#0: (one#:0: Vec2#43802a16, two#:1: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: one#:0.x#43802a16#0 +#builtin two#:1.x#43802a16#0,
        y#43802a16#1: one#:0.y#43802a16#1 +#builtin two#:1.y#43802a16#1,
    },
    "-"#b99b22d8#1: (one#:2: Vec2#43802a16, two#:3: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: one#:2.x#43802a16#0 -#builtin two#:3.x#43802a16#0,
        y#43802a16#1: one#:2.y#43802a16#1 -#builtin two#:3.y#43802a16#1,
    },
}
```
*/
export const hash_5fdcc910: t_b99b22d8<t_43802a16, t_43802a16, t_43802a16> = ({
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
const max#ac706cda = (v#:0: Vec2#43802a16): float#builtin ={}> {
    max#builtin(v#:0.x#43802a16#0, v#:0.y#43802a16#1);
}
```
*/
export const hash_ac706cda: (arg_0: t_43802a16) => number = (v: t_43802a16) => max(v.x, v.y);

/**
```
const length#b4a9b048 = (v#:0: Vec2#43802a16): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
        +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1,
)
```
*/
export const hash_b4a9b048: (arg_0: t_43802a16) => number = (v: t_43802a16) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const pixOff#44de0a86 = Vec4#3b941378{
    z#9f1c0644#0: MaxVelocity#158e986a,
    x#43802a16#0: PI#builtin,
    y#43802a16#1: PI#builtin,
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
const pixScale#32bd7938 = Vec4#3b941378{
    z#9f1c0644#0: MaxVelocity#158e986a *#builtin 2.0,
    x#43802a16#0: TWO_PI#fc1474ce,
    y#43802a16#1: TWO_PI#fc1474ce,
    w#3b941378#0: MaxVelocity#158e986a *#builtin 2.0,
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
const Mul42#164ba904 = Mul#1de4e4c0<Vec4#3b941378, Vec4#3b941378, Vec4#3b941378>{
    "*"#1de4e4c0#0: (v#:0: Vec4#3b941378, scale#:1: Vec4#3b941378): Vec4#3b941378 ={}> Vec4#3b941378{
        z#9f1c0644#0: v#:0.z#9f1c0644#0 *#builtin scale#:1.z#9f1c0644#0,
        x#43802a16#0: v#:0.x#43802a16#0 *#builtin scale#:1.x#43802a16#0,
        y#43802a16#1: v#:0.y#43802a16#1 *#builtin scale#:1.y#43802a16#1,
        w#3b941378#0: v#:0.w#3b941378#0 *#builtin scale#:1.w#3b941378#0,
    },
}
```
*/
export const hash_164ba904: t_1de4e4c0<t_3b941378, t_3b941378, t_3b941378> = ({
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
const AddSubVec4#cd6cb2f6 = AddSub#b99b22d8<Vec4#3b941378, Vec4#3b941378, Vec4#3b941378>{
    "+"#b99b22d8#0: (one#:0: Vec4#3b941378, two#:1: Vec4#3b941378): Vec4#3b941378 ={}> Vec4#3b941378{
        z#9f1c0644#0: one#:0.z#9f1c0644#0 +#builtin two#:1.z#9f1c0644#0,
        x#43802a16#0: one#:0.x#43802a16#0 +#builtin two#:1.x#43802a16#0,
        y#43802a16#1: one#:0.y#43802a16#1 +#builtin two#:1.y#43802a16#1,
        w#3b941378#0: one#:0.w#3b941378#0 +#builtin two#:1.w#3b941378#0,
    },
    "-"#b99b22d8#1: (one#:2: Vec4#3b941378, two#:3: Vec4#3b941378): Vec4#3b941378 ={}> Vec4#3b941378{
        z#9f1c0644#0: one#:2.z#9f1c0644#0 -#builtin two#:3.z#9f1c0644#0,
        x#43802a16#0: one#:2.x#43802a16#0 -#builtin two#:3.x#43802a16#0,
        y#43802a16#1: one#:2.y#43802a16#1 -#builtin two#:3.y#43802a16#1,
        w#3b941378#0: one#:2.w#3b941378#0 -#builtin two#:3.w#3b941378#0,
    },
}
```
*/
export const hash_cd6cb2f6: t_b99b22d8<t_3b941378, t_3b941378, t_3b941378> = ({
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
const normalizeTheta#c3a71e42 = (t#:0: float#builtin): float#builtin ={}> if t#:0 
    >#builtin PI#builtin {
    t#:0 -#builtin TWO_PI#fc1474ce;
} else if t#:0 <#builtin -PI#builtin {
    t#:0 +#builtin TWO_PI#fc1474ce;
} else {
    t#:0;
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
const r2#0ce717e6 = 100.0
```
*/
export const hash_0ce717e6: number = 100;

/**
```
const m2#b48c60a0 = 20.0
```
*/
export const hash_b48c60a0: number = 20;

/**
```
const g#4466af4c = 0.15
```
*/
export const hash_4466af4c: number = 0.15;

/**
```
const Scale42#081f8f18 = Div#5ac12902<Vec4#3b941378, Vec4#3b941378, Vec4#3b941378>{
    "/"#5ac12902#0: (v#:0: Vec4#3b941378, scale#:1: Vec4#3b941378): Vec4#3b941378 ={}> Vec4#3b941378{
        z#9f1c0644#0: v#:0.z#9f1c0644#0 /#builtin scale#:1.z#9f1c0644#0,
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1.x#43802a16#0,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1.y#43802a16#1,
        w#3b941378#0: v#:0.w#3b941378#0 /#builtin scale#:1.w#3b941378#0,
    },
}
```
*/
export const hash_081f8f18: t_5ac12902<t_3b941378, t_3b941378, t_3b941378> = ({
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
const hsv2rgb#361ea548 = (c#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    const K#:1 = vec4#4d4983bb(x: 1.0, y: 2.0 /#builtin 3.0, z: 1.0 /#builtin 3.0, w: 3.0);
    const xxx#:2 = Vec3#9f1c0644{
        x#43802a16#0: c#:0.x#43802a16#0,
        y#43802a16#1: c#:0.x#43802a16#0,
        z#9f1c0644#0: c#:0.x#43802a16#0,
    };
    const p#:3 = abs#523d7378(
        v: fract#11f8b1b0(v: xxx#:2 +#0ec72cf4#b99b22d8#0 kxyz#1f96d598) *#3dc35220#1de4e4c0#0 6.0 
            -#c02461a4#b99b22d8#1 3.0,
    );
    const kxxx#:4 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
    c#:0.z#9f1c0644#0 
        *#fab8930c#1de4e4c0#0 mix#24a43cac(
            a: kxxx#:4,
            b: clamp#58cc5fcf(
                v: p#:3 -#0ec72cf4#b99b22d8#1 kxxx#:4,
                min: Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
                max: Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
            ),
            c: c#:0.y#43802a16#1,
        );
}
```
*/
export const hash_361ea548: (arg_0: t_9f1c0644) => t_9f1c0644 = (c$0: t_9f1c0644) => {
  let kxxx: t_9f1c0644 = ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_9f1c0644);
  return hash_fab8930c.h1de4e4c0_0(c$0.z, hash_24a43cac(kxxx, hash_58cc5fcf(hash_0ec72cf4.hb99b22d8_1(hash_523d7378(hash_c02461a4.hb99b22d8_1(hash_3dc35220.h1de4e4c0_0(hash_11f8b1b0(hash_0ec72cf4.hb99b22d8_0(({
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
const rect#004f57b3 = (
    samplePos#:0: Vec2#43802a16,
    center#:1: Vec2#43802a16,
    w#:2: float#builtin,
    h#:3: float#builtin,
): float#builtin ={}> {
    max#ac706cda(
        v: abs#475ec8fa(v: samplePos#:0 -#5fdcc910#b99b22d8#1 center#:1) 
            -#5fdcc910#b99b22d8#1 Vec2#43802a16{x#43802a16#0: w#:2, y#43802a16#1: h#:3},
    );
}
```
*/
export const hash_004f57b3: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: number, arg_3: number) => number = (samplePos: t_43802a16, center: t_43802a16, w$2: number, h: number) => hash_ac706cda(hash_5fdcc910.hb99b22d8_1(hash_475ec8fa(hash_5fdcc910.hb99b22d8_1(samplePos, center)), ({
  type: "Vec2",
  x: w$2,
  y: h
} as t_43802a16)));

/**
```
const circle#0fffcca8 = (samplePos#:0: Vec2#43802a16, center#:1: Vec2#43802a16, r#:2: float#builtin): float#builtin ={}> {
    length#b4a9b048(v: samplePos#:0 -#5fdcc910#b99b22d8#1 center#:1) -#builtin r#:2;
}
```
*/
export const hash_0fffcca8: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: number) => number = (samplePos: t_43802a16, center: t_43802a16, r: number) => hash_b4a9b048(hash_5fdcc910.hb99b22d8_1(samplePos, center)) - r;

/**
```
const ScaleVec2Rev#368fe720 = Div#5ac12902<Vec2#43802a16, float#builtin, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1,
    },
}
```
*/
export const hash_368fe720: t_5ac12902<t_43802a16, number, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale$1: number) => ({
    type: "Vec2",
    x: v.x / scale$1,
    y: v.y / scale$1
  } as t_43802a16)
} as t_5ac12902<t_43802a16, number, t_43802a16>);

/**
```
const pixelToData#74d9047b = (v#:0: Vec4#3b941378): Vec4#3b941378 ={}> v#:0 
        *#164ba904#1de4e4c0#0 pixScale#32bd7938 
    -#cd6cb2f6#b99b22d8#1 pixOff#44de0a86
```
*/
export const hash_74d9047b: (arg_0: t_3b941378) => t_3b941378 = (v: t_3b941378) => hash_cd6cb2f6.hb99b22d8_1(hash_164ba904.h1de4e4c0_0(v, hash_32bd7938), hash_44de0a86);

/**
```
const MulVec2#46209244 = Div#5ac12902<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1.x#43802a16#0,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1.y#43802a16#1,
    },
}
```
*/
export const hash_46209244: t_5ac12902<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale$1: t_43802a16) => ({
    type: "Vec2",
    x: v.x / scale$1.x,
    y: v.y / scale$1.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const update#74a18562 = (
    a1#:0: float#builtin,
    a2#:1: float#builtin,
    a1_v#:2: float#builtin,
    a2_v#:3: float#builtin,
): Vec4#3b941378 ={}> {
    const num1#:4 = -g#4466af4c *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0) 
        *#builtin sin#builtin(a1#:0);
    const num2#:5 = -m2#b48c60a0 *#builtin g#4466af4c 
        *#builtin sin#builtin(a1#:0 -#builtin 2.0 *#builtin a2#:1);
    const num3#:6 = -2.0 *#builtin sin#builtin(a1#:0 -#builtin a2#:1) *#builtin m2#b48c60a0;
    const num4#:7 = a2_v#:3 *#builtin a2_v#:3 *#builtin r2#0ce717e6 
        +#builtin a1_v#:2 *#builtin a1_v#:2 *#builtin r2#0ce717e6 
            *#builtin cos#builtin(a1#:0 -#builtin a2#:1);
    const den#:8 = r2#0ce717e6 
        *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0 
            -#builtin m2#b48c60a0 
                *#builtin cos#builtin(2.0 *#builtin a1#:0 -#builtin 2.0 *#builtin a2#:1));
    const a1_a#:9 = (num1#:4 +#builtin num2#:5 +#builtin num3#:6 *#builtin num4#:7) /#builtin den#:8;
    const num1#:10 = 2.0 *#builtin sin#builtin(a1#:0 -#builtin a2#:1);
    const num2#:11 = a1_v#:2 *#builtin a1_v#:2 *#builtin r2#0ce717e6 
        *#builtin (m2#b48c60a0 +#builtin m2#b48c60a0);
    const num3#:12 = g#4466af4c *#builtin (m2#b48c60a0 +#builtin m2#b48c60a0) 
        *#builtin cos#builtin(a1#:0);
    const num4#:13 = a2_v#:3 *#builtin a2_v#:3 *#builtin r2#0ce717e6 *#builtin m2#b48c60a0 
        *#builtin cos#builtin(a1#:0 -#builtin a2#:1);
    const den#:14 = r2#0ce717e6 
        *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0 
            -#builtin m2#b48c60a0 
                *#builtin cos#builtin(2.0 *#builtin a1#:0 -#builtin 2.0 *#builtin a2#:1));
    const a2_a#:15 = num1#:10 *#builtin (num2#:11 +#builtin num3#:12 +#builtin num4#:13) 
        /#builtin den#:14;
    const a1_v#:16 = a1_v#:2 +#builtin a1_a#:9;
    const a2_v#:17 = a2_v#:3 +#builtin a2_a#:15;
    const a1#:18 = a1#:0 +#builtin a1_v#:16;
    const a2#:19 = a2#:1 +#builtin a2_v#:17;
    const a1#:20 = normalizeTheta#c3a71e42(t: a1#:18);
    const a2#:21 = normalizeTheta#c3a71e42(t: a2#:19);
    vec4#4d4983bb(x: a1#:20, y: a2#:21, z: a1_v#:16, w: a2_v#:17);
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
const dataToPixel#16b1f8bb = (v#:0: Vec4#3b941378): Vec4#3b941378 ={}> {
    const res#:1 = (v#:0 +#cd6cb2f6#b99b22d8#0 pixOff#44de0a86) 
        /#081f8f18#5ac12902#0 pixScale#32bd7938;
    res#:1;
}
```
*/
export const hash_16b1f8bb: (arg_0: t_3b941378) => t_3b941378 = (v: t_3b941378) => hash_081f8f18.h5ac12902_0(hash_cd6cb2f6.hb99b22d8_0(v, hash_44de0a86), hash_32bd7938);

/**
```
const main#6151ab48 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    const currentPos#:3 = env#:0.mouse#451d5252#3 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1;
    const currentp#:4 = texture#builtin(buffer#:2, currentPos#:3);
    const current#:5 = pixelToData#74d9047b(v: currentp#:4);
    const p1#:6 = fragCoord#:1 
        -#5fdcc910#b99b22d8#1 env#:0.resolution#451d5252#1 /#368fe720#5ac12902#0 2.0;
    const c1#:7 = Vec2#43802a16{
        x#43802a16#0: sin#builtin(current#:5.x#43802a16#0) *#builtin r2#0ce717e6,
        y#43802a16#1: -cos#builtin(current#:5.x#43802a16#0) *#builtin r2#0ce717e6,
    };
    const c2#:8 = Vec2#43802a16{
        x#43802a16#0: c1#:7.x#43802a16#0 
            +#builtin sin#builtin(current#:5.y#43802a16#1) *#builtin r2#0ce717e6,
        y#43802a16#1: c1#:7.y#43802a16#1 
            -#builtin cos#builtin(current#:5.y#43802a16#1) *#builtin r2#0ce717e6,
    };
    if circle#0fffcca8(samplePos: p1#:6, center: c1#:7, r: 10.0) <#builtin 0.0 {
        vec4#4d4983bb(x: 1.0, y: 0.0, z: 0.0, w: 1.0);
    } else if circle#0fffcca8(samplePos: p1#:6, center: c2#:8, r: 10.0) <#builtin 0.0 {
        vec4#4d4983bb(x: 1.0, y: 1.0, z: 0.0, w: 1.0);
    } else if max#builtin(
            rect#004f57b3(
                samplePos: p1#:6,
                center: env#:0.mouse#451d5252#3 
                    -#5fdcc910#b99b22d8#1 env#:0.resolution#451d5252#1 /#368fe720#5ac12902#0 2.0,
                w: 10.0,
                h: 10.0,
            ),
            -rect#004f57b3(
                samplePos: p1#:6,
                center: env#:0.mouse#451d5252#3 
                    -#5fdcc910#b99b22d8#1 env#:0.resolution#451d5252#1 /#368fe720#5ac12902#0 2.0,
                w: 9.0,
                h: 9.0,
            ),
        ) 
        <#builtin 0.0 {
        vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else if length#b4a9b048(
            v: p1#:6 
                -#5fdcc910#b99b22d8#1 (env#:0.mouse#451d5252#3 
                    -#5fdcc910#b99b22d8#1 env#:0.resolution#451d5252#1 /#368fe720#5ac12902#0 2.0),
        ) 
        <#builtin 100.0 {
        const t#:9 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1,
        );
        const rgb#:10 = hsv2rgb#361ea548(
            c: Vec3#9f1c0644{
                x#43802a16#0: t#:9.z#9f1c0644#0,
                y#43802a16#1: t#:9.w#3b941378#0,
                z#9f1c0644#0: 1.0,
            },
        );
        Vec4#3b941378{...rgb#:10, w#3b941378#0: 1.0};
    } else if length#b4a9b048(
            v: p1#:6 
                -#5fdcc910#b99b22d8#1 (env#:0.mouse#451d5252#3 
                    -#5fdcc910#b99b22d8#1 env#:0.resolution#451d5252#1 /#368fe720#5ac12902#0 2.0),
        ) 
        <#builtin 101.0 {
        vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else {
        const t#:11 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1,
        );
        const rgb#:12 = hsv2rgb#361ea548(
            c: Vec3#9f1c0644{
                x#43802a16#0: t#:11.y#43802a16#1,
                y#43802a16#1: t#:11.x#43802a16#0,
                z#9f1c0644#0: 1.0,
            },
        );
        Vec4#3b941378{...rgb#:12, w#3b941378#0: 1.0};
    };
}
```
*/
export const hash_6151ab48: (arg_0: t_451d5252, arg_1: t_43802a16, arg_2: sampler2D) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16, buffer: sampler2D) => {
  let current: t_3b941378 = hash_74d9047b(texture(buffer, hash_46209244.h5ac12902_0(env.mouse, env.resolution)));
  let p1: t_43802a16 = hash_5fdcc910.hb99b22d8_1(fragCoord, hash_368fe720.h5ac12902_0(env.resolution, 2));
  let c1: t_43802a16 = ({
    type: "Vec2",
    x: sin(current.x) * hash_0ce717e6,
    y: -cos(current.x) * hash_0ce717e6
  } as t_43802a16);

  if (hash_0fffcca8(p1, c1, 10) < 0) {
    return hash_4d4983bb(1, 0, 0, 1);
  } else {
    if (hash_0fffcca8(p1, ({
      type: "Vec2",
      x: c1.x + sin(current.y) * hash_0ce717e6,
      y: c1.y - cos(current.y) * hash_0ce717e6
    } as t_43802a16), 10) < 0) {
      return hash_4d4983bb(1, 1, 0, 1);
    } else {
      if (max(hash_004f57b3(p1, hash_5fdcc910.hb99b22d8_1(env.mouse, hash_368fe720.h5ac12902_0(env.resolution, 2)), 10, 10), -hash_004f57b3(p1, hash_5fdcc910.hb99b22d8_1(env.mouse, hash_368fe720.h5ac12902_0(env.resolution, 2)), 9, 9)) < 0) {
        return hash_4d4983bb(0, 0, 0, 1);
      } else {
        if (hash_b4a9b048(hash_5fdcc910.hb99b22d8_1(p1, hash_5fdcc910.hb99b22d8_1(env.mouse, hash_368fe720.h5ac12902_0(env.resolution, 2)))) < 100) {
          let t$9: t_3b941378 = texture(buffer, hash_46209244.h5ac12902_0(fragCoord, env.resolution));
          return ({ ...hash_361ea548(({
              type: "Vec3",
              x: t$9.z,
              y: t$9.w,
              z: 1
            } as t_9f1c0644)),
            type: "Vec4",
            w: 1
          } as t_3b941378);
        } else {
          if (hash_b4a9b048(hash_5fdcc910.hb99b22d8_1(p1, hash_5fdcc910.hb99b22d8_1(env.mouse, hash_368fe720.h5ac12902_0(env.resolution, 2)))) < 101) {
            return hash_4d4983bb(0, 0, 0, 1);
          } else {
            let t$11: t_3b941378 = texture(buffer, hash_46209244.h5ac12902_0(fragCoord, env.resolution));
            return ({ ...hash_361ea548(({
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
const pendulum#41721b92 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    if env#:0.time#451d5252#0 <=#builtin 0.01 {
        const t#:3 = fragCoord#:1 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1;
        vec4#4d4983bb(x: 0.0, y: 0.0, z: t#:3.x#43802a16#0, w: t#:3.y#43802a16#1);
    } else {
        const current#:4 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1,
        );
        const current#:5 = pixelToData#74d9047b(v: current#:4);
        dataToPixel#16b1f8bb(
            v: update#74a18562(
                a1: current#:5.x#43802a16#0,
                a2: current#:5.y#43802a16#1,
                a1_v: current#:5.z#9f1c0644#0,
                a2_v: current#:5.w#3b941378#0,
            ),
        );
    };
}
```
*/
export const hash_41721b92: (arg_0: t_451d5252, arg_1: t_43802a16, arg_2: sampler2D) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16, buffer: sampler2D) => {
  if (env.time <= 0.01) {
    let t$3: t_43802a16 = hash_46209244.h5ac12902_0(fragCoord, env.resolution);
    return hash_4d4983bb(0, 0, t$3.x, t$3.y);
  } else {
    let current: t_3b941378 = hash_74d9047b(texture(buffer, hash_46209244.h5ac12902_0(fragCoord, env.resolution)));
    return hash_16b1f8bb(hash_74a18562(current.x, current.y, current.z, current.w));
  }
};
export const r1 = hash_0ce717e6;
export const r2 = hash_0ce717e6;
export const update = hash_74a18562;
export const pendulum = hash_41721b92;
export const main = hash_6151ab48;