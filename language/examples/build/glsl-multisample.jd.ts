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
@ffi("Mat4") type Mat4#d92781e8 = {
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
type Neg#3c2a4898<T#:0, T#:1> = {
    "-": (A#:0) ={}> B#:1,
}
```
*/
type t_3c2a4898<T_0, T_1> = {
  type: "3c2a4898";
  h3c2a4898_0: (arg_0: T_0) => T_1;
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
const length#63e16b7a = (v#:0: Vec3#9f1c0644): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
            +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1 
        +#builtin v#:0.z#9f1c0644#0 *#builtin v#:0.z#9f1c0644#0,
)
```
*/
export const hash_63e16b7a: (arg_0: t_9f1c0644) => number = (v: t_9f1c0644) => sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/**
```
const ScaleVec3Rev#68f73ad4 = Div#5ac12902<Vec3#9f1c0644, float#builtin, Vec3#9f1c0644>{
    "/"#5ac12902#0: (v#:0: Vec3#9f1c0644, scale#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1,
        z#9f1c0644#0: v#:0.z#9f1c0644#0 /#builtin scale#:1,
    },
}
```
*/
export const hash_68f73ad4: t_5ac12902<t_9f1c0644, number, t_9f1c0644> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_9f1c0644, scale: number) => ({
    type: "Vec3",
    x: v.x / scale,
    y: v.y / scale,
    z: v.z / scale
  } as t_9f1c0644)
} as t_5ac12902<t_9f1c0644, number, t_9f1c0644>);

/**
```
const dot#a0178052 = (a#:0: Vec4#3b941378, b#:1: Vec4#3b941378): float#builtin ={}> {
    a#:0.x#43802a16#0 *#builtin b#:1.x#43802a16#0 
                +#builtin a#:0.y#43802a16#1 *#builtin b#:1.y#43802a16#1 
            +#builtin a#:0.z#9f1c0644#0 *#builtin b#:1.z#9f1c0644#0 
        +#builtin a#:0.w#3b941378#0 *#builtin b#:1.w#3b941378#0;
}
```
*/
export const hash_a0178052: (arg_0: t_3b941378, arg_1: t_3b941378) => number = (a: t_3b941378, b: t_3b941378) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

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
const NegVec3#a5cd53ce = Neg#3c2a4898<Vec3#9f1c0644, Vec3#9f1c0644>{
    "-"#3c2a4898#0: (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: -v#:0.x#43802a16#0,
        y#43802a16#1: -v#:0.y#43802a16#1,
        z#9f1c0644#0: -v#:0.z#9f1c0644#0,
    },
}
```
*/
export const hash_a5cd53ce: t_3c2a4898<t_9f1c0644, t_9f1c0644> = ({
  type: "3c2a4898",
  h3c2a4898_0: (v: t_9f1c0644) => ({
    type: "Vec3",
    x: -v.x,
    y: -v.y,
    z: -v.z
  } as t_9f1c0644)
} as t_3c2a4898<t_9f1c0644, t_9f1c0644>);

/**
```
const cross#54f2119c = (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: one#:0.y#43802a16#1 *#builtin two#:1.z#9f1c0644#0 
        -#builtin two#:1.y#43802a16#1 *#builtin one#:0.z#9f1c0644#0,
    y#43802a16#1: one#:0.z#9f1c0644#0 *#builtin two#:1.x#43802a16#0 
        -#builtin two#:1.z#9f1c0644#0 *#builtin one#:0.x#43802a16#0,
    z#9f1c0644#0: one#:0.x#43802a16#0 *#builtin two#:1.y#43802a16#1 
        -#builtin two#:1.x#43802a16#0 *#builtin one#:0.y#43802a16#1,
}
```
*/
export const hash_54f2119c: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => t_9f1c0644 = (one: t_9f1c0644, two: t_9f1c0644) => ({
  type: "Vec3",
  x: one.y * two.z - two.y * one.z,
  y: one.z * two.x - two.z * one.x,
  z: one.x * two.y - two.x * one.y
} as t_9f1c0644);

/**
```
const AddSubVec3#1c6fdd91 = AddSub#b99b22d8<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644>{
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
const normalize#48e6ea27 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> v#:0 
    /#68f73ad4#5ac12902#0 length#63e16b7a(v#:0)
```
*/
export const hash_48e6ea27: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => hash_68f73ad4.h5ac12902_0(v, hash_63e16b7a(v));

/**
```
const vec3#5808ec54 = (v#:0: Vec2#43802a16, z#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    ...v#:0,
    z#9f1c0644#0: z#:1,
}
```
*/
export const hash_5808ec54: (arg_0: t_43802a16, arg_1: number) => t_9f1c0644 = (v: t_43802a16, z$1: number) => ({ ...v,
  type: "Vec3",
  z: z$1
} as t_9f1c0644);

/**
```
const radians#dabe7f9c = (degrees#:0: float#builtin): float#builtin ={}> degrees#:0 /#builtin 180.0 
    *#builtin PI#builtin
```
*/
export const hash_dabe7f9c: (arg_0: number) => number = (degrees: number) => degrees / 180 * PI;

/**
```
const ScaleVec2Rev#afc24bbe = Div#5ac12902<Vec2#43802a16, float#builtin, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1,
    },
}
```
*/
export const hash_afc24bbe: t_5ac12902<t_43802a16, number, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale: number) => ({
    type: "Vec2",
    x: v.x / scale,
    y: v.y / scale
  } as t_43802a16)
} as t_5ac12902<t_43802a16, number, t_43802a16>);

/**
```
const AddSubVec2#70bb2056 = AddSub#b99b22d8<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
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
const EPSILON#17261aaa = 0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const vec3#18cdf03e = (x#:0: float#builtin, y#:1: float#builtin, z#:2: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: x#:0,
    y#43802a16#1: y#:1,
    z#9f1c0644#0: z#:2,
}
```
*/
export const hash_18cdf03e: (arg_0: number, arg_1: number, arg_2: number) => t_9f1c0644 = (x: number, y: number, z: number) => ({
  type: "Vec3",
  x: x,
  y: y,
  z: z
} as t_9f1c0644);

/**
```
const ScaleVec3#c4a91006 = Mul#1de4e4c0<float#builtin, Vec3#9f1c0644, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (scale#:0: float#builtin, v#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:1.x#43802a16#0 *#builtin scale#:0,
        y#43802a16#1: v#:1.y#43802a16#1 *#builtin scale#:0,
        z#9f1c0644#0: v#:1.z#9f1c0644#0 *#builtin scale#:0,
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
const MatByVector#16557d10 = Mul#1de4e4c0<Mat4#d92781e8, Vec4#3b941378, Vec4#3b941378>{
    "*"#1de4e4c0#0: (mat#:0: Mat4#d92781e8, vec#:1: Vec4#3b941378): Vec4#3b941378 ={}> Vec4#3b941378{
        z#9f1c0644#0: dot#a0178052(a: mat#:0.r3#d92781e8#2, b: vec#:1),
        x#43802a16#0: dot#a0178052(a: mat#:0.r1#d92781e8#0, b: vec#:1),
        y#43802a16#1: dot#a0178052(a: mat#:0.r2#d92781e8#1, b: vec#:1),
        w#3b941378#0: dot#a0178052(a: mat#:0.r4#d92781e8#3, b: vec#:1),
    },
}
```
*/
export const hash_16557d10: t_1de4e4c0<t_d92781e8, t_3b941378, t_3b941378> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (mat: t_d92781e8, vec: t_3b941378) => ({
    type: "Vec4",
    z: hash_a0178052(mat.r3, vec),
    x: hash_a0178052(mat.r1, vec),
    y: hash_a0178052(mat.r2, vec),
    w: hash_a0178052(mat.r4, vec)
  } as t_3b941378)
} as t_1de4e4c0<t_d92781e8, t_3b941378, t_3b941378>);

/**
```
const xyz#1aedf216 = (v#:0: Vec4#3b941378): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: v#:0.x#43802a16#0,
    y#43802a16#1: v#:0.y#43802a16#1,
    z#9f1c0644#0: v#:0.z#9f1c0644#0,
}
```
*/
export const hash_1aedf216: (arg_0: t_3b941378) => t_9f1c0644 = (v: t_3b941378) => ({
  type: "Vec3",
  x: v.x,
  y: v.y,
  z: v.z
} as t_9f1c0644);

/**
```
const viewMatrix#c336d78c = (eye#:0: Vec3#9f1c0644, center#:1: Vec3#9f1c0644, up#:2: Vec3#9f1c0644): Mat4#d92781e8 ={}> {
    const f#:3 = normalize#48e6ea27(v: center#:1 -#1c6fdd91#b99b22d8#1 eye#:0);
    const s#:4 = normalize#48e6ea27(v: cross#54f2119c(one: f#:3, two: up#:2));
    const u#:5 = cross#54f2119c(one: s#:4, two: f#:3);
    Mat4#d92781e8{
        r1#d92781e8#0: Vec4#3b941378{...s#:4, w#3b941378#0: 0.0},
        r2#d92781e8#1: Vec4#3b941378{...u#:5, w#3b941378#0: 0.0},
        r3#d92781e8#2: Vec4#3b941378{...NegVec3#a5cd53ce."-"#3c2a4898#0(f#:3), w#3b941378#0: 0.0},
        r4#d92781e8#3: vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
```
*/
export const hash_c336d78c: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_d92781e8 = (eye: t_9f1c0644, center: t_9f1c0644, up: t_9f1c0644) => {
  let f: t_9f1c0644 = hash_48e6ea27(hash_1c6fdd91.hb99b22d8_1(center, eye));
  let s: t_9f1c0644 = hash_48e6ea27(hash_54f2119c(f, up));
  return ({
    type: "Mat4",
    r1: ({ ...s,
      type: "Vec4",
      w: 0
    } as t_3b941378),
    r2: ({ ...hash_54f2119c(s, f),
      type: "Vec4",
      w: 0
    } as t_3b941378),
    r3: ({ ...hash_a5cd53ce.h3c2a4898_0(f),
      type: "Vec4",
      w: 0
    } as t_3b941378),
    r4: hash_4d4983bb(0, 0, 0, 1)
  } as t_d92781e8);
};

/**
```
const rayDirection#6258178a = (
    fieldOfView#:0: float#builtin,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
): Vec3#9f1c0644 ={}> {
    const xy#:3 = fragCoord#:2 -#70bb2056#b99b22d8#1 size#:1 /#afc24bbe#5ac12902#0 2.0;
    const z#:4 = size#:1.y#43802a16#1 
        /#builtin tan#builtin(radians#dabe7f9c(degrees: fieldOfView#:0) /#builtin 2.0);
    normalize#48e6ea27(v: vec3#5808ec54(v: xy#:3, z: -z#:4));
}
```
*/
export const hash_6258178a: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_9f1c0644 = (fieldOfView: number, size: t_43802a16, fragCoord: t_43802a16) => hash_48e6ea27(hash_5808ec54(hash_70bb2056.hb99b22d8_1(fragCoord, hash_afc24bbe.h5ac12902_0(size, 2)), -(size.y / tan(hash_dabe7f9c(fieldOfView) / 2))));

/**
```
const vec4#b00b79a0 = (v#:0: Vec3#9f1c0644, w#:1: float#builtin): Vec4#3b941378 ={}> Vec4#3b941378{
    ...v#:0,
    w#3b941378#0: w#:1,
}
```
*/
export const hash_b00b79a0: (arg_0: t_9f1c0644, arg_1: number) => t_3b941378 = (v: t_9f1c0644, w$1: number) => ({ ...v,
  type: "Vec4",
  w: w$1
} as t_3b941378);

/**
```
const rotate#d804569c = (tx#:0: float#builtin, ty#:1: float#builtin, tz#:2: float#builtin): Mat4#d92781e8 ={}> {
    const cg#:3 = cos#builtin(tx#:0);
    const sg#:4 = sin#builtin(tx#:0);
    const cb#:5 = cos#builtin(ty#:1);
    const sb#:6 = sin#builtin(ty#:1);
    const ca#:7 = cos#builtin(tz#:2);
    const sa#:8 = sin#builtin(tz#:2);
    Mat4#d92781e8{
        r1#d92781e8#0: vec4#4d4983bb(
            x: ca#:7 *#builtin cb#:5,
            y: ca#:7 *#builtin sb#:6 *#builtin sg#:4 -#builtin sa#:8 *#builtin cg#:3,
            z: ca#:7 *#builtin sb#:6 *#builtin cg#:3 +#builtin sa#:8 *#builtin sg#:4,
            w: 0.0,
        ),
        r2#d92781e8#1: vec4#4d4983bb(
            x: sa#:8 *#builtin cb#:5,
            y: sa#:8 *#builtin sb#:6 *#builtin sg#:4 +#builtin ca#:7 *#builtin cg#:3,
            z: sa#:8 *#builtin sb#:6 *#builtin cg#:3 -#builtin ca#:7 *#builtin sg#:4,
            w: 0.0,
        ),
        r3#d92781e8#2: vec4#4d4983bb(
            x: -sb#:6,
            y: cb#:5 *#builtin sg#:4,
            z: cb#:5 *#builtin cg#:3,
            w: 0.0,
        ),
        r4#d92781e8#3: vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
```
*/
export const hash_d804569c: (arg_0: number, arg_1: number, arg_2: number) => t_d92781e8 = (tx: number, ty: number, tz: number) => {
  let cg: number = cos(tx);
  let sg: number = sin(tx);
  let cb: number = cos(ty);
  let sb: number = sin(ty);
  let ca: number = cos(tz);
  let sa: number = sin(tz);
  return ({
    type: "Mat4",
    r1: hash_4d4983bb(ca * cb, ca * sb * sg - sa * cg, ca * sb * cg + sa * sg, 0),
    r2: hash_4d4983bb(sa * cb, sa * sb * sg + ca * cg, sa * sb * cg - ca * sg, 0),
    r3: hash_4d4983bb(-sb, cb * sg, cb * cg, 0),
    r4: hash_4d4983bb(0, 0, 0, 1)
  } as t_d92781e8);
};

/**
```
const estimateNormal#58f494f2 = (
    sceneSDF#:0: (GLSLEnv#451d5252, Vec3#9f1c0644) ={}> float#builtin,
    env#:1: GLSLEnv#451d5252,
    p#:2: Vec3#9f1c0644,
): Vec3#9f1c0644 ={}> normalize#48e6ea27(
    v: vec3#18cdf03e(
        x: sceneSDF#:0(
                env#:1,
                Vec3#9f1c0644{...p#:2, x#43802a16#0: p#:2.x#43802a16#0 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#9f1c0644{...p#:2, x#43802a16#0: p#:2.x#43802a16#0 -#builtin EPSILON#17261aaa},
            ),
        y: sceneSDF#:0(
                env#:1,
                Vec3#9f1c0644{...p#:2, y#43802a16#1: p#:2.y#43802a16#1 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#9f1c0644{...p#:2, y#43802a16#1: p#:2.y#43802a16#1 -#builtin EPSILON#17261aaa},
            ),
        z: sceneSDF#:0(
                env#:1,
                Vec3#9f1c0644{...p#:2, z#9f1c0644#0: p#:2.z#9f1c0644#0 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#9f1c0644{...p#:2, z#9f1c0644#0: p#:2.z#9f1c0644#0 -#builtin EPSILON#17261aaa},
            ),
    ),
)
```
*/
export const hash_58f494f2: (arg_0: (arg_0: t_451d5252, arg_1: t_9f1c0644) => number, arg_1: t_451d5252, arg_2: t_9f1c0644) => t_9f1c0644 = (sceneSDF: (arg_0: t_451d5252, arg_1: t_9f1c0644) => number, env: t_451d5252, p: t_9f1c0644) => hash_48e6ea27(hash_18cdf03e(sceneSDF(env, ({ ...p,
  type: "Vec3",
  x: p.x + hash_17261aaa
} as t_9f1c0644)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  x: p.x - hash_17261aaa
} as t_9f1c0644)), sceneSDF(env, ({ ...p,
  type: "Vec3",
  y: p.y + hash_17261aaa
} as t_9f1c0644)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  y: p.y - hash_17261aaa
} as t_9f1c0644)), sceneSDF(env, ({ ...p,
  type: "Vec3",
  z: p.z + hash_17261aaa
} as t_9f1c0644)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  z: p.z - hash_17261aaa
} as t_9f1c0644))));

/**
```
const ScaleVec3_#1d31aa6e = Mul#1de4e4c0<Vec3#9f1c0644, float#builtin, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (v#:0: Vec3#9f1c0644, scale#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:0.x#43802a16#0 *#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 *#builtin scale#:1,
        z#9f1c0644#0: v#:0.z#9f1c0644#0 *#builtin scale#:1,
    },
}
```
*/
export const hash_1d31aa6e: t_1de4e4c0<t_9f1c0644, number, t_9f1c0644> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (v: t_9f1c0644, scale: number) => ({
    type: "Vec3",
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale
  } as t_9f1c0644)
} as t_1de4e4c0<t_9f1c0644, number, t_9f1c0644>);

/**
```
const vec4#72fca9b4 = (x#:0: float#builtin): Vec4#3b941378 ={}> Vec4#3b941378{
    z#9f1c0644#0: x#:0,
    x#43802a16#0: x#:0,
    y#43802a16#1: x#:0,
    w#3b941378#0: x#:0,
}
```
*/
export const hash_72fca9b4: (arg_0: number) => t_3b941378 = (x: number) => ({
  type: "Vec4",
  z: x,
  x: x,
  y: x,
  w: x
} as t_3b941378);

/**
```
const rec shortestDistanceToSurface#52c7ebac = (
    sceneSDF#:0: (GLSLEnv#451d5252, Vec3#9f1c0644) ={}> float#builtin,
    env#:1: GLSLEnv#451d5252,
    eye#:2: Vec3#9f1c0644,
    marchingDirection#:3: Vec3#9f1c0644,
    start#:4: float#builtin,
    end#:5: float#builtin,
    stepsLeft#:6: int#builtin,
): float#builtin ={}> {
    const dist#:7 = sceneSDF#:0(
        env#:1,
        eye#:2 +#1c6fdd91#b99b22d8#0 start#:4 *#c4a91006#1de4e4c0#0 marchingDirection#:3,
    );
    if dist#:7 <#builtin EPSILON#17261aaa {
        start#:4;
    } else {
        const depth#:8 = start#:4 +#builtin dist#:7;
        if depth#:8 >=#builtin end#:5 ||#builtin stepsLeft#:6 <=#builtin 0 {
            end#:5;
        } else {
            52c7ebac#self(
                sceneSDF#:0,
                env#:1,
                eye#:2,
                marchingDirection#:3,
                depth#:8,
                end#:5,
                stepsLeft#:6 -#builtin 1,
            );
        };
    };
}
```
*/
export const hash_52c7ebac: (arg_0: (arg_0: t_451d5252, arg_1: t_9f1c0644) => number, arg_1: t_451d5252, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF: (arg_0: t_451d5252, arg_1: t_9f1c0644) => number, env: t_451d5252, eye$2: t_9f1c0644, marchingDirection: t_9f1c0644, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = sceneSDF(env, hash_1c6fdd91.hb99b22d8_0(eye$2, hash_c4a91006.h1de4e4c0_0(start, marchingDirection)));

    if (dist < hash_17261aaa) {
      return start;
    } else {
      let depth: number = start + dist;

      if (depth >= end || stepsLeft <= 0) {
        return end;
      } else {
        start = depth;
        stepsLeft = stepsLeft - 1;
        continue;
      }
    }
  }
};

/**
```
const getWorldDir#92052fca = (
    resolution#:0: Vec2#43802a16,
    coord#:1: Vec2#43802a16,
    eye#:2: Vec3#9f1c0644,
    fieldOfView#:3: float#builtin,
): Vec3#9f1c0644 ={}> {
    const viewDir#:4 = rayDirection#6258178a(
        fieldOfView#:3,
        size: resolution#:0,
        fragCoord: coord#:1,
    );
    const eye#:5 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const viewToWorld#:6 = viewMatrix#c336d78c(
        eye#:5,
        center: Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
        up: Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
    );
    xyz#1aedf216(
        v: viewToWorld#:6 *#16557d10#1de4e4c0#0 Vec4#3b941378{...viewDir#:4, w#3b941378#0: 0.0},
    );
}
```
*/
export const hash_92052fca: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: t_9f1c0644, arg_3: number) => t_9f1c0644 = (resolution: t_43802a16, coord: t_43802a16, eye$2: t_9f1c0644, fieldOfView$3: number) => hash_1aedf216(hash_16557d10.h1de4e4c0_0(hash_c336d78c(({
  type: "Vec3",
  x: 0,
  y: 0,
  z: 5
} as t_9f1c0644), ({
  type: "Vec3",
  x: 0,
  y: 0,
  z: 0
} as t_9f1c0644), ({
  type: "Vec3",
  x: 0,
  y: 1,
  z: 0
} as t_9f1c0644)), ({ ...hash_6258178a(fieldOfView$3, resolution, coord),
  type: "Vec4",
  w: 0
} as t_3b941378)));

/**
```
const Scale4#56d43c0e = Div#5ac12902<Vec4#3b941378, float#builtin, Vec4#3b941378>{
    "/"#5ac12902#0: (v#:0: Vec4#3b941378, scale#:1: float#builtin): Vec4#3b941378 ={}> Vec4#3b941378{
        z#9f1c0644#0: v#:0.z#9f1c0644#0 /#builtin scale#:1,
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1,
        w#3b941378#0: v#:0.w#3b941378#0 /#builtin scale#:1,
    },
}
```
*/
export const hash_56d43c0e: t_5ac12902<t_3b941378, number, t_3b941378> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_3b941378, scale: number) => ({
    type: "Vec4",
    z: v.z / scale,
    x: v.x / scale,
    y: v.y / scale,
    w: v.w / scale
  } as t_3b941378)
} as t_5ac12902<t_3b941378, number, t_3b941378>);

/**
```
const vec2#54a9f2ef = (x#:0: float#builtin, y#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
    x#43802a16#0: x#:0,
    y#43802a16#1: y#:1,
}
```
*/
export const hash_54a9f2ef: (arg_0: number, arg_1: number) => t_43802a16 = (x: number, y: number) => ({
  type: "Vec2",
  x: x,
  y: y
} as t_43802a16);

/**
```
const AddSubVec4#0555d260 = AddSub#b99b22d8<Vec4#3b941378, Vec4#3b941378, Vec4#3b941378>{
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
const rotate#6734d670 = (
    v#:0: Vec3#9f1c0644,
    x#:1: float#builtin,
    y#:2: float#builtin,
    z#:3: float#builtin,
): Vec3#9f1c0644 ={}> {
    xyz#1aedf216(
        v: rotate#d804569c(tx: x#:1, ty: y#:2, tz: z#:3) 
            *#16557d10#1de4e4c0#0 vec4#b00b79a0(v#:0, w: 1.0),
    );
}
```
*/
export const hash_6734d670: (arg_0: t_9f1c0644, arg_1: number, arg_2: number, arg_3: number) => t_9f1c0644 = (v: t_9f1c0644, x$1: number, y$2: number, z$3: number) => hash_1aedf216(hash_16557d10.h1de4e4c0_0(hash_d804569c(x$1, y$2, z$3), hash_b00b79a0(v, 1)));

/**
```
const marchNormals#132bd797 = (sceneSDF#:0: (GLSLEnv#451d5252, Vec3#9f1c0644) ={}> float#builtin): (
    GLSLEnv#451d5252,
    Vec2#43802a16,
) ={}> Vec4#3b941378 ={}> (env#:1: GLSLEnv#451d5252, coord#:2: Vec2#43802a16): Vec4#3b941378 ={}> {
    const eye#:3 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const worldDir#:4 = getWorldDir#92052fca(
        resolution: env#:1.resolution#451d5252#1,
        coord#:2,
        eye#:3,
        fieldOfView: 45.0,
    );
    const maxDist#:5 = 100.0;
    const dist#:6 = shortestDistanceToSurface#52c7ebac(
        sceneSDF#:0,
        env#:1,
        eye#:3,
        marchingDirection: worldDir#:4,
        start: 0.0,
        end: maxDist#:5,
        stepsLeft: 255,
    );
    if dist#:6 >#builtin maxDist#:5 -#builtin EPSILON#17261aaa {
        vec4#72fca9b4(x: 0.0);
    } else {
        const worldPos#:7 = eye#:3 +#1c6fdd91#b99b22d8#0 worldDir#:4 *#1d31aa6e#1de4e4c0#0 dist#:6;
        const normal#:8 = estimateNormal#58f494f2(sceneSDF#:0, env#:1, p: worldPos#:7);
        vec4#b00b79a0(v: normal#:8, w: 1.0);
    };
}
```
*/
export const hash_132bd797: (arg_0: (arg_0: t_451d5252, arg_1: t_9f1c0644) => number) => (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = (sceneSDF: (arg_0: t_451d5252, arg_1: t_9f1c0644) => number) => (env: t_451d5252, coord$2: t_43802a16) => {
  let eye$3: t_9f1c0644 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_9f1c0644);
  let worldDir: t_9f1c0644 = hash_92052fca(env.resolution, coord$2, eye$3, 45);
  let dist$6: number = hash_52c7ebac(sceneSDF, env, eye$3, worldDir, 0, 100, 255);

  if (dist$6 > 100 - hash_17261aaa) {
    return hash_72fca9b4(0);
  } else {
    return hash_b00b79a0(hash_58f494f2(sceneSDF, env, hash_1c6fdd91.hb99b22d8_0(eye$3, hash_1d31aa6e.h1de4e4c0_0(worldDir, dist$6))), 1);
  }
};

/**
```
const multiSample#0ae0f98c = (fn#:0: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378): (
    GLSLEnv#451d5252,
    Vec2#43802a16,
) ={}> Vec4#3b941378 ={}> (env#:1: GLSLEnv#451d5252, pos#:2: Vec2#43802a16): Vec4#3b941378 ={}> {
    const total#:3 = fn#:0(env#:1, pos#:2) 
                    +#0555d260#b99b22d8#0 fn#:0(
                        env#:1,
                        pos#:2 +#70bb2056#b99b22d8#0 vec2#54a9f2ef(x: 0.5, y: 0.0),
                    ) 
                +#0555d260#b99b22d8#0 fn#:0(
                    env#:1,
                    pos#:2 +#70bb2056#b99b22d8#0 vec2#54a9f2ef(x: -0.5, y: 0.0),
                ) 
            +#0555d260#b99b22d8#0 fn#:0(
                env#:1,
                pos#:2 +#70bb2056#b99b22d8#0 vec2#54a9f2ef(x: 0.0, y: 0.5),
            ) 
        +#0555d260#b99b22d8#0 fn#:0(
            env#:1,
            pos#:2 +#70bb2056#b99b22d8#0 vec2#54a9f2ef(x: 0.0, y: -0.5),
        );
    total#:3 /#56d43c0e#5ac12902#0 5.0;
}
```
*/
export const hash_0ae0f98c: (arg_0: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378) => (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = (fn: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378) => (env: t_451d5252, pos: t_43802a16) => hash_56d43c0e.h5ac12902_0(hash_0555d260.hb99b22d8_0(hash_0555d260.hb99b22d8_0(hash_0555d260.hb99b22d8_0(hash_0555d260.hb99b22d8_0(fn(env, pos), fn(env, hash_70bb2056.hb99b22d8_0(pos, hash_54a9f2ef(0.5, 0)))), fn(env, hash_70bb2056.hb99b22d8_0(pos, hash_54a9f2ef(-0.5, 0)))), fn(env, hash_70bb2056.hb99b22d8_0(pos, hash_54a9f2ef(0, 0.5)))), fn(env, hash_70bb2056.hb99b22d8_0(pos, hash_54a9f2ef(0, -0.5)))), 5);

/**
```
const ok#0cccfe1a = multiSample#0ae0f98c(
    fn: marchNormals#132bd797(
        sceneSDF: (env#:0: GLSLEnv#451d5252, pos#:1: Vec3#9f1c0644): float#builtin ={}> {
            const pos#:2 = rotate#6734d670(
                v: pos#:1,
                x: 0.0,
                y: env#:0.time#451d5252#0 /#builtin 2.0,
                z: env#:0.time#451d5252#0,
            );
            const mag#:3 = (sin#builtin(env#:0.time#451d5252#0 /#builtin 2.0) +#builtin 1.0) 
                    *#builtin 60.0 
                +#builtin 1.0;
            const period#:4 = 30.0 *#builtin (sin#builtin(env#:0.time#451d5252#0) +#builtin 1.0);
            const sphere#:5 = length#63e16b7a(v: pos#:2) -#builtin 0.5;
            const bumps#:6 = sin#builtin(pos#:2.x#43802a16#0 *#builtin period#:4) 
                    +#builtin sin#builtin(pos#:2.z#9f1c0644#0 *#builtin period#:4) 
                +#builtin sin#builtin(pos#:2.y#43802a16#1 *#builtin period#:4);
            sphere#:5 -#builtin bumps#:6 /#builtin mag#:3;
        },
    ),
)
```
*/
export const hash_0cccfe1a: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = hash_0ae0f98c(hash_132bd797((env$0: t_451d5252, pos$1: t_9f1c0644) => {
  let pos: t_9f1c0644 = hash_6734d670(pos$1, 0, env$0.time / 2, env$0.time);
  let period: number = 30 * (sin(env$0.time) + 1);
  return hash_63e16b7a(pos) - 0.5 - (sin(pos.x * period) + sin(pos.z * period) + sin(pos.y * period)) / ((sin(env$0.time / 2) + 1) * 60 + 1);
}));
export const ok = hash_0cccfe1a;