import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
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
type Div#ff952210<T#:0, T#:1, T#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_ff952210<T_0, T_1, T_2> = {
  type: "ff952210";
  hff952210_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Mul#2a8cceae<T#:0, T#:1, T#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_2a8cceae<T_0, T_1, T_2> = {
  type: "2a8cceae";
  h2a8cceae_0: (arg_0: T_0, arg_1: T_1) => T_2;
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
type AddSub#3760193f<T#:0> = {
    "+": (A#:0, A#:0) ={}> A#:0,
    "-": (A#:0, A#:0) ={}> A#:0,
}
```
*/
type t_3760193f<T_0> = {
  type: "3760193f";
  h3760193f_0: (arg_0: T_0, arg_1: T_0) => T_0;
  h3760193f_1: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
const AddSubVec3#7e19b481: AddSub#3760193f<Vec3#9f1c0644> = AddSub#3760193f<Vec3#9f1c0644>{
    "+"#3760193f#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1.y#43802a16#1),
        z#9f1c0644#0: (one#:0.z#9f1c0644#0 + two#:1.z#9f1c0644#0),
    },
    "-"#3760193f#1: (one#:2: Vec3#9f1c0644, two#:3: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3.x#43802a16#0),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3.y#43802a16#1),
        z#9f1c0644#0: (one#:2.z#9f1c0644#0 - two#:3.z#9f1c0644#0),
    },
}
```
*/
export const hash_7e19b481: t_3760193f<t_9f1c0644> = ({
  type: "3760193f",
  h3760193f_0: (one: t_9f1c0644, two: t_9f1c0644) => ({
    type: "Vec3",
    x: one.x + two.x,
    y: one.y + two.y,
    z: one.z + two.z
  } as t_9f1c0644),
  h3760193f_1: (one$2: t_9f1c0644, two$3: t_9f1c0644) => ({
    type: "Vec3",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    z: one$2.z - two$3.z
  } as t_9f1c0644)
} as t_3760193f<t_9f1c0644>);

/**
```
const length#1cc335a2: (Vec3#9f1c0644) ={}> float = (v#:0: Vec3#9f1c0644) ={}> {
    sqrt(
        (((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)) + (v#:0.z#9f1c0644#0 * v#:0.z#9f1c0644#0)),
    );
}
```
*/
export const hash_1cc335a2: (arg_0: t_9f1c0644) => number = (v: t_9f1c0644) => sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/**
```
const distance#dc83e420: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> float = (
    one#:0: Vec3#9f1c0644,
    two#:1: Vec3#9f1c0644,
) ={}> length#1cc335a2(AddSubVec3#7e19b481."-"#3760193f#1(two#:1, one#:0))
```
*/
export const hash_dc83e420: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (one: t_9f1c0644, two: t_9f1c0644) => hash_1cc335a2(hash_7e19b481.h3760193f_1(two, one));

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
const dot4#a0178052: (Vec4#3b941378, Vec4#3b941378) ={}> float = (
    a#:0: Vec4#3b941378,
    b#:1: Vec4#3b941378,
) ={}> {
    ((((a#:0.x#43802a16#0 * b#:1.x#43802a16#0) + (a#:0.y#43802a16#1 * b#:1.y#43802a16#1)) + (a#:0.z#9f1c0644#0 * b#:1.z#9f1c0644#0)) + (a#:0.w#3b941378#0 * b#:1.w#3b941378#0));
}
```
*/
export const hash_a0178052: (arg_0: t_3b941378, arg_1: t_3b941378) => number = (a: t_3b941378, b: t_3b941378) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

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
const vmax#3af3fc3c: (Vec3#9f1c0644) ={}> float = (v#:0: Vec3#9f1c0644) ={}> {
    max(max(v#:0.x#43802a16#0, v#:0.y#43802a16#1), v#:0.z#9f1c0644#0);
}
```
*/
export const hash_3af3fc3c: (arg_0: t_9f1c0644) => number = (v: t_9f1c0644) => max(max(v.x, v.y), v.z);

/**
```
const differenceSDF#fdad0384: (float, float) ={}> float = (distA#:0: float, distB#:1: float) ={}> {
    max(distA#:0, -distB#:1);
}
```
*/
export const hash_fdad0384: (arg_0: number, arg_1: number) => number = (distA: number, distB: number) => max(distA, -distB);

/**
```
const unionSDF#5ee91162: (float, float) ={}> float = (distA#:0: float, distB#:1: float) ={}> {
    min(distA#:0, distB#:1);
}
```
*/
export const hash_5ee91162: (arg_0: number, arg_1: number) => number = (distA: number, distB: number) => min(distA, distB);

/**
```
const sphereSDF#5cea9cf4: (Vec3#9f1c0644, Vec3#9f1c0644, float) ={}> float = (
    samplePoint#:0: Vec3#9f1c0644,
    center#:1: Vec3#9f1c0644,
    radius#:2: float,
) ={}> (distance#dc83e420(samplePoint#:0, center#:1) - radius#:2)
```
*/
export const hash_5cea9cf4: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: number) => number = (samplePoint: t_9f1c0644, center: t_9f1c0644, radius: number) => hash_dc83e420(samplePoint, center) - radius;

/**
```
const rotateY#23cedd78: (float) ={}> Mat4#d92781e8 = (theta#:0: float) ={}> {
    const c#:1 = cos(theta#:0);
    const s#:2 = sin(theta#:0);
    Mat4#d92781e8{
        r1#d92781e8#0: vec4#4d4983bb(c#:1, 0.0, s#:2, 0.0),
        r2#d92781e8#1: vec4#4d4983bb(c#:1, 1.0, c#:1, 0.0),
        r3#d92781e8#2: vec4#4d4983bb(-s#:2, 0.0, c#:1, 0.0),
        r4#d92781e8#3: vec4#4d4983bb(0.0, 0.0, 0.0, 1.0),
    };
}
```
*/
export const hash_23cedd78: (arg_0: number) => t_d92781e8 = (theta: number) => {
  let c: number = cos(theta);
  let s: number = sin(theta);
  return ({
    type: "Mat4",
    r1: hash_4d4983bb(c, 0, s, 0),
    r2: hash_4d4983bb(c, 1, c, 0),
    r3: hash_4d4983bb(-s, 0, c, 0),
    r4: hash_4d4983bb(0, 0, 0, 1)
  } as t_d92781e8);
};

/**
```
const MatByVector#069ab806: Mul#2a8cceae<Mat4#d92781e8, Vec4#3b941378, Vec4#3b941378> = Mul#2a8cceae<
    Mat4#d92781e8,
    Vec4#3b941378,
    Vec4#3b941378,
>{
    "*"#2a8cceae#0: (mat#:0: Mat4#d92781e8, vec#:1: Vec4#3b941378) ={}> Vec4#3b941378{
        z#9f1c0644#0: dot4#a0178052(mat#:0.r3#d92781e8#2, vec#:1),
        x#43802a16#0: dot4#a0178052(mat#:0.r1#d92781e8#0, vec#:1),
        y#43802a16#1: dot4#a0178052(mat#:0.r2#d92781e8#1, vec#:1),
        w#3b941378#0: dot4#a0178052(mat#:0.r4#d92781e8#3, vec#:1),
    },
}
```
*/
export const hash_069ab806: t_2a8cceae<t_d92781e8, t_3b941378, t_3b941378> = ({
  type: "2a8cceae",
  h2a8cceae_0: (mat: t_d92781e8, vec: t_3b941378) => ({
    type: "Vec4",
    z: hash_a0178052(mat.r3, vec),
    x: hash_a0178052(mat.r1, vec),
    y: hash_a0178052(mat.r2, vec),
    w: hash_a0178052(mat.r4, vec)
  } as t_3b941378)
} as t_2a8cceae<t_d92781e8, t_3b941378, t_3b941378>);

/**
```
const xyz#1aedf216: (Vec4#3b941378) ={}> Vec3#9f1c0644 = (v#:0: Vec4#3b941378) ={}> Vec3#9f1c0644{
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
const ScaleVec3Rev#6794ed84: Div#ff952210<Vec3#9f1c0644, float, Vec3#9f1c0644> = Div#ff952210<
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
>{
    "/"#ff952210#0: (v#:0: Vec3#9f1c0644, scale#:1: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 / scale#:1),
    },
}
```
*/
export const hash_6794ed84: t_ff952210<t_9f1c0644, number, t_9f1c0644> = ({
  type: "ff952210",
  hff952210_0: (v: t_9f1c0644, scale: number) => ({
    type: "Vec3",
    x: v.x / scale,
    y: v.y / scale,
    z: v.z / scale
  } as t_9f1c0644)
} as t_ff952210<t_9f1c0644, number, t_9f1c0644>);

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
export const hash_255c39c3: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (a: t_9f1c0644, b: t_9f1c0644) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
```
const ScaleVec3#3f673260: Mul#2a8cceae<float, Vec3#9f1c0644, Vec3#9f1c0644> = Mul#2a8cceae<
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
>{
    "*"#2a8cceae#0: (scale#:0: float, v#:1: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:1.x#43802a16#0 * scale#:0),
        y#43802a16#1: (v#:1.y#43802a16#1 * scale#:0),
        z#9f1c0644#0: (v#:1.z#9f1c0644#0 * scale#:0),
    },
}
```
*/
export const hash_3f673260: t_2a8cceae<number, t_9f1c0644, t_9f1c0644> = ({
  type: "2a8cceae",
  h2a8cceae_0: (scale$0: number, v$1: t_9f1c0644) => ({
    type: "Vec3",
    x: v$1.x * scale$0,
    y: v$1.y * scale$0,
    z: v$1.z * scale$0
  } as t_9f1c0644)
} as t_2a8cceae<number, t_9f1c0644, t_9f1c0644>);

/**
```
const EPSILON#17261aaa: float = 0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const sceneSDF#18cce58a: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const cubePoint#:2 = samplePoint#:1;
    const cubePoint#:3 = AddSubVec3#7e19b481."-"#3760193f#1(
        cubePoint#:2,
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
    );
    const cubePoint#:4 = xyz#1aedf216(
        MatByVector#069ab806."*"#2a8cceae#0(
            rotateY#23cedd78((iTime#:0 / PI)),
            Vec4#3b941378{...cubePoint#:3, w#3b941378#0: 1.0},
        ),
    );
    const size#:5 = ((sin(iTime#:0) * 0.2) + 0.4);
    const cosize#:6 = ((cos(iTime#:0) * 0.2) + 0.4);
    const offset#:7 = 0.6;
    const cubeSize#:8 = Vec3#9f1c0644{
        x#43802a16#0: size#:5,
        y#43802a16#1: cosize#:6,
        z#9f1c0644#0: size#:5,
    };
    const innerCubeSize#:9 = Vec3#9f1c0644{
        x#43802a16#0: (size#:5 * offset#:7),
        y#43802a16#1: (cosize#:6 * offset#:7),
        z#9f1c0644#0: (size#:5 * offset#:7),
    };
    const circles#:10 = min(
        sphereSDF#5cea9cf4(
            samplePoint#:1,
            Vec3#9f1c0644{x#43802a16#0: 0.25, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
            0.5,
        ),
        sphereSDF#5cea9cf4(
            samplePoint#:1,
            Vec3#9f1c0644{x#43802a16#0: -0.5, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
            0.5,
        ),
    );
    unionSDF#5ee91162(
        differenceSDF#fdad0384(
            circles#:10,
            vmax#3af3fc3c(
                AddSubVec3#7e19b481."-"#3760193f#1(vabs#1a074578(cubePoint#:4), cubeSize#:8),
            ),
        ),
        vmax#3af3fc3c(
            AddSubVec3#7e19b481."-"#3760193f#1(vabs#1a074578(cubePoint#:4), innerCubeSize#:9),
        ),
    );
}
```
*/
export const hash_18cce58a: (arg_0: number, arg_1: t_9f1c0644) => number = (iTime: number, samplePoint$1: t_9f1c0644) => {
  let cubePoint: t_9f1c0644 = hash_1aedf216(hash_069ab806.h2a8cceae_0(hash_23cedd78(iTime / PI), ({ ...hash_7e19b481.h3760193f_1(samplePoint$1, ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: -1
    } as t_9f1c0644)),
    type: "Vec4",
    w: 1
  } as t_3b941378)));
  let size: number = sin(iTime) * 0.2 + 0.4;
  let cosize: number = cos(iTime) * 0.2 + 0.4;
  return hash_5ee91162(hash_fdad0384(min(hash_5cea9cf4(samplePoint$1, ({
    type: "Vec3",
    x: 0.25,
    y: 0,
    z: -1
  } as t_9f1c0644), 0.5), hash_5cea9cf4(samplePoint$1, ({
    type: "Vec3",
    x: -0.5,
    y: 0,
    z: -1
  } as t_9f1c0644), 0.5)), hash_3af3fc3c(hash_7e19b481.h3760193f_1(hash_1a074578(cubePoint), ({
    type: "Vec3",
    x: size,
    y: cosize,
    z: size
  } as t_9f1c0644)))), hash_3af3fc3c(hash_7e19b481.h3760193f_1(hash_1a074578(cubePoint), ({
    type: "Vec3",
    x: size * 0.6,
    y: cosize * 0.6,
    z: size * 0.6
  } as t_9f1c0644))));
};

/**
```
const normalize#d30b20e4: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> ScaleVec3Rev#6794ed84."/"#ff952210#0(
    v#:0,
    length#1cc335a2(v#:0),
)
```
*/
export const hash_d30b20e4: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => hash_6794ed84.hff952210_0(v, hash_1cc335a2(v));

/**
```
const MulVec3#3283b65e: Mul#2a8cceae<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644> = Mul#2a8cceae<
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
>{
    "*"#2a8cceae#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:0.x#43802a16#0 * two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 * two#:1.y#43802a16#1),
        z#9f1c0644#0: (one#:0.z#9f1c0644#0 * two#:1.z#9f1c0644#0),
    },
}
```
*/
export const hash_3283b65e: t_2a8cceae<t_9f1c0644, t_9f1c0644, t_9f1c0644> = ({
  type: "2a8cceae",
  h2a8cceae_0: (one: t_9f1c0644, two: t_9f1c0644) => ({
    type: "Vec3",
    x: one.x * two.x,
    y: one.y * two.y,
    z: one.z * two.z
  } as t_9f1c0644)
} as t_2a8cceae<t_9f1c0644, t_9f1c0644, t_9f1c0644>);

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
export const hash_4129390c: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: -v.x,
  y: -v.y,
  z: -v.z
} as t_9f1c0644);

/**
```
const reflect#73887ab0: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    I#:0: Vec3#9f1c0644,
    N#:1: Vec3#9f1c0644,
) ={}> {
    AddSubVec3#7e19b481."-"#3760193f#1(
        I#:0,
        ScaleVec3#3f673260."*"#2a8cceae#0((2.0 * dot#255c39c3(N#:1, I#:0)), N#:1),
    );
}
```
*/
export const hash_73887ab0: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => t_9f1c0644 = (I: t_9f1c0644, N: t_9f1c0644) => hash_7e19b481.h3760193f_1(I, hash_3f673260.h2a8cceae_0(2 * hash_255c39c3(N, I), N));

/**
```
const estimateNormal#7fc9583a: (float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
) ={}> normalize#d30b20e4(
    Vec3#9f1c0644{
        x#43802a16#0: (sceneSDF#18cce58a(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 + EPSILON#17261aaa)},
        ) - sceneSDF#18cce58a(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 - EPSILON#17261aaa)},
        )),
        y#43802a16#1: (sceneSDF#18cce58a(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 + EPSILON#17261aaa)},
        ) - sceneSDF#18cce58a(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 - EPSILON#17261aaa)},
        )),
        z#9f1c0644#0: (sceneSDF#18cce58a(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 + EPSILON#17261aaa)},
        ) - sceneSDF#18cce58a(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 - EPSILON#17261aaa)},
        )),
    },
)
```
*/
export const hash_7fc9583a: (arg_0: number, arg_1: t_9f1c0644) => t_9f1c0644 = (iTime: number, p: t_9f1c0644) => hash_d30b20e4(({
  type: "Vec3",
  x: hash_18cce58a(iTime, ({ ...p,
    type: "Vec3",
    x: p.x + hash_17261aaa
  } as t_9f1c0644)) - hash_18cce58a(iTime, ({ ...p,
    type: "Vec3",
    x: p.x - hash_17261aaa
  } as t_9f1c0644)),
  y: hash_18cce58a(iTime, ({ ...p,
    type: "Vec3",
    y: p.y + hash_17261aaa
  } as t_9f1c0644)) - hash_18cce58a(iTime, ({ ...p,
    type: "Vec3",
    y: p.y - hash_17261aaa
  } as t_9f1c0644)),
  z: hash_18cce58a(iTime, ({ ...p,
    type: "Vec3",
    z: p.z + hash_17261aaa
  } as t_9f1c0644)) - hash_18cce58a(iTime, ({ ...p,
    type: "Vec3",
    z: p.z - hash_17261aaa
  } as t_9f1c0644))
} as t_9f1c0644));

/**
```
const ScaleVec3_#38386821: Mul#2a8cceae<Vec3#9f1c0644, float, Vec3#9f1c0644> = Mul#2a8cceae<
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
>{
    "*"#2a8cceae#0: (v#:0: Vec3#9f1c0644, scale#:1: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:0.x#43802a16#0 * scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 * scale#:1),
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 * scale#:1),
    },
}
```
*/
export const hash_38386821: t_2a8cceae<t_9f1c0644, number, t_9f1c0644> = ({
  type: "2a8cceae",
  h2a8cceae_0: (v: t_9f1c0644, scale: number) => ({
    type: "Vec3",
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale
  } as t_9f1c0644)
} as t_2a8cceae<t_9f1c0644, number, t_9f1c0644>);

/**
```
const phongContribForLight#54cb7b3c: (
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    k_d#:1: Vec3#9f1c0644,
    k_s#:2: Vec3#9f1c0644,
    alpha#:3: float,
    p#:4: Vec3#9f1c0644,
    eye#:5: Vec3#9f1c0644,
    lightPos#:6: Vec3#9f1c0644,
    lightIntensity#:7: Vec3#9f1c0644,
) ={}> {
    const N#:8 = estimateNormal#7fc9583a(iTime#:0, p#:4);
    const L#:9 = normalize#d30b20e4(AddSubVec3#7e19b481."-"#3760193f#1(lightPos#:6, p#:4));
    const V#:10 = normalize#d30b20e4(AddSubVec3#7e19b481."-"#3760193f#1(eye#:5, p#:4));
    const R#:11 = normalize#d30b20e4(reflect#73887ab0(negVec3#4129390c(L#:9), N#:8));
    const dotLN#:12 = dot#255c39c3(L#:9, N#:8);
    const dotRV#:13 = dot#255c39c3(R#:11, V#:10);
    if (dotLN#:12 < 0.0) {
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0};
    } else {
        if (dotRV#:13 < 0.0) {
            const m#:14 = ScaleVec3_#38386821."*"#2a8cceae#0(k_d#:1, dotLN#:12);
            MulVec3#3283b65e."*"#2a8cceae#0(lightIntensity#:7, m#:14);
        } else {
            const m#:15 = AddSubVec3#7e19b481."+"#3760193f#0(
                ScaleVec3_#38386821."*"#2a8cceae#0(k_d#:1, dotLN#:12),
                ScaleVec3_#38386821."*"#2a8cceae#0(k_s#:2, pow(dotRV#:13, alpha#:3)),
            );
            MulVec3#3283b65e."*"#2a8cceae#0(lightIntensity#:7, m#:15);
        };
    };
}
```
*/
export const hash_54cb7b3c: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: t_9f1c0644, arg_5: t_9f1c0644, arg_6: t_9f1c0644, arg_7: t_9f1c0644) => t_9f1c0644 = (iTime: number, k_d: t_9f1c0644, k_s: t_9f1c0644, alpha: number, p$4: t_9f1c0644, eye: t_9f1c0644, lightPos: t_9f1c0644, lightIntensity: t_9f1c0644) => {
  let N$8: t_9f1c0644 = hash_7fc9583a(iTime, p$4);
  let L: t_9f1c0644 = hash_d30b20e4(hash_7e19b481.h3760193f_1(lightPos, p$4));
  let dotLN: number = hash_255c39c3(L, N$8);
  let dotRV: number = hash_255c39c3(hash_d30b20e4(hash_73887ab0(hash_4129390c(L), N$8)), hash_d30b20e4(hash_7e19b481.h3760193f_1(eye, p$4)));

  if (dotLN < 0) {
    return ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: 0
    } as t_9f1c0644);
  } else {
    if (dotRV < 0) {
      return hash_3283b65e.h2a8cceae_0(lightIntensity, hash_38386821.h2a8cceae_0(k_d, dotLN));
    } else {
      return hash_3283b65e.h2a8cceae_0(lightIntensity, hash_7e19b481.h3760193f_0(hash_38386821.h2a8cceae_0(k_d, dotLN), hash_38386821.h2a8cceae_0(k_s, pow(dotRV, alpha))));
    }
  }
};

/**
```
const vec3#5808ec54: (Vec2#43802a16, float) ={}> Vec3#9f1c0644 = (v#:0: Vec2#43802a16, z#:1: float) ={}> Vec3#9f1c0644{
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
const radians#dabe7f9c: (float) ={}> float = (degrees#:0: float) ={}> ((degrees#:0 / 180.0) * PI)
```
*/
export const hash_dabe7f9c: (arg_0: number) => number = (degrees: number) => degrees / 180 * PI;

/**
```
const ScaleVec2Rev#3e41e940: Div#ff952210<Vec2#43802a16, float, Vec2#43802a16> = Div#ff952210<
    Vec2#43802a16,
    float,
    Vec2#43802a16,
>{
    "/"#ff952210#0: (v#:0: Vec2#43802a16, scale#:1: float) ={}> Vec2#43802a16{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
    },
}
```
*/
export const hash_3e41e940: t_ff952210<t_43802a16, number, t_43802a16> = ({
  type: "ff952210",
  hff952210_0: (v: t_43802a16, scale: number) => ({
    type: "Vec2",
    x: v.x / scale,
    y: v.y / scale
  } as t_43802a16)
} as t_ff952210<t_43802a16, number, t_43802a16>);

/**
```
const AddSubVec2#4fc60a94: AddSub#3760193f<Vec2#43802a16> = AddSub#3760193f<Vec2#43802a16>{
    "+"#3760193f#0: (one#:0: Vec2#43802a16, two#:1: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1.y#43802a16#1),
    },
    "-"#3760193f#1: (one#:2: Vec2#43802a16, two#:3: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3.x#43802a16#0),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3.y#43802a16#1),
    },
}
```
*/
export const hash_4fc60a94: t_3760193f<t_43802a16> = ({
  type: "3760193f",
  h3760193f_0: (one: t_43802a16, two: t_43802a16) => ({
    type: "Vec2",
    x: one.x + two.x,
    y: one.y + two.y
  } as t_43802a16),
  h3760193f_1: (one$2: t_43802a16, two$3: t_43802a16) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_43802a16)
} as t_3760193f<t_43802a16>);

/**
```
const phongIllumination#7a05e9a8: (
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    k_a#:1: Vec3#9f1c0644,
    k_d#:2: Vec3#9f1c0644,
    k_s#:3: Vec3#9f1c0644,
    alpha#:4: float,
    p#:5: Vec3#9f1c0644,
    eye#:6: Vec3#9f1c0644,
) ={}> {
    const ambientLight#:7 = ScaleVec3#3f673260."*"#2a8cceae#0(
        0.5,
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
    );
    const color#:8 = MulVec3#3283b65e."*"#2a8cceae#0(ambientLight#:7, k_a#:1);
    const light1Pos#:9 = Vec3#9f1c0644{
        x#43802a16#0: (4.0 * sin(iTime#:0)),
        y#43802a16#1: 2.0,
        z#9f1c0644#0: (4.0 * cos(iTime#:0)),
    };
    const light1Intensity#:10 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:11 = AddSubVec3#7e19b481."+"#3760193f#0(
        color#:8,
        phongContribForLight#54cb7b3c(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            light1Pos#:9,
            light1Intensity#:10,
        ),
    );
    const light2Pos#:12 = Vec3#9f1c0644{
        x#43802a16#0: (2.0 * sin((0.37 * iTime#:0))),
        y#43802a16#1: (2.0 * cos((0.37 * iTime#:0))),
        z#9f1c0644#0: 2.0,
    };
    const light2Intensity#:13 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:14 = AddSubVec3#7e19b481."+"#3760193f#0(
        color#:11,
        phongContribForLight#54cb7b3c(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            light2Pos#:12,
            light2Intensity#:13,
        ),
    );
    color#:14;
}
```
*/
export const hash_7a05e9a8: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: t_9f1c0644, arg_6: t_9f1c0644) => t_9f1c0644 = (iTime: number, k_a: t_9f1c0644, k_d$2: t_9f1c0644, k_s$3: t_9f1c0644, alpha$4: number, p$5: t_9f1c0644, eye$6: t_9f1c0644) => hash_7e19b481.h3760193f_0(hash_7e19b481.h3760193f_0(hash_3283b65e.h2a8cceae_0(hash_3f673260.h2a8cceae_0(0.5, ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_9f1c0644)), k_a), hash_54cb7b3c(iTime, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 4 * sin(iTime),
  y: 2,
  z: 4 * cos(iTime)
} as t_9f1c0644), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_9f1c0644))), hash_54cb7b3c(iTime, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 2 * sin(0.37 * iTime),
  y: 2 * cos(0.37 * iTime),
  z: 2
} as t_9f1c0644), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_9f1c0644)));

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
const shortestDistanceToSurface#532cff63: (float, Vec3#9f1c0644, Vec3#9f1c0644, float, float, int) ={}> float = (
    iTime#:0: float,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
) ={}> {
    const dist#:6 = sceneSDF#18cce58a(
        iTime#:0,
        AddSubVec3#7e19b481."+"#3760193f#0(
            eye#:1,
            ScaleVec3#3f673260."*"#2a8cceae#0(start#:3, marchingDirection#:2),
        ),
    );
    if (dist#:6 < EPSILON#17261aaa) {
        start#:3;
    } else {
        const depth#:7 = (start#:3 + dist#:6);
        if ((depth#:7 >= end#:4) || (stepsLeft#:5 <= 0)) {
            end#:4;
        } else {
            532cff63(iTime#:0, eye#:1, marchingDirection#:2, depth#:7, end#:4, (stepsLeft#:5 - 1));
        };
    };
}
```
*/
export const hash_532cff63: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: number, arg_5: number) => number = (iTime: number, eye$1: t_9f1c0644, marchingDirection: t_9f1c0644, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = hash_18cce58a(iTime, hash_7e19b481.h3760193f_0(eye$1, hash_3f673260.h2a8cceae_0(start, marchingDirection)));

    if (dist < hash_17261aaa) {
      return start;
    } else {
      let depth: number = start + dist;

      if (depth >= end || stepsLeft <= 0) {
        return end;
      } else {
        iTime = iTime;
        eye$1 = eye$1;
        marchingDirection = marchingDirection;
        start = depth;
        end = end;
        stepsLeft = stepsLeft - 1;
        continue;
      }
    }
  }
};

/**
```
const rayDirection#5ca09574: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec3#9f1c0644 = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
) ={}> {
    const xy#:3 = AddSubVec2#4fc60a94."-"#3760193f#1(
        fragCoord#:2,
        ScaleVec2Rev#3e41e940."/"#ff952210#0(size#:1, 2.0),
    );
    const z#:4 = (size#:1.y#43802a16#1 / tan((radians#dabe7f9c(fieldOfView#:0) / 2.0)));
    normalize#d30b20e4(vec3#5808ec54(xy#:3, -z#:4));
}
```
*/
export const hash_5ca09574: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_9f1c0644 = (fieldOfView: number, size$1: t_43802a16, fragCoord: t_43802a16) => hash_d30b20e4(hash_5808ec54(hash_4fc60a94.h3760193f_1(fragCoord, hash_3e41e940.hff952210_0(size$1, 2)), -(size$1.y / tan(hash_dabe7f9c(fieldOfView) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const mainImage#47679440: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
) ={}> {
    const dir#:3 = rayDirection#5ca09574(45.0, iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#532cff63(
        iTime#:0,
        eye#:4,
        dir#:3,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    if (dist#:5 > (MAX_DIST#0ce717e6 - EPSILON#17261aaa)) {
        Vec4#3b941378{z#9f1c0644#0: 1.0, x#43802a16#0: 1.0, y#43802a16#1: 1.0, w#3b941378#0: 1.0};
    } else {
        const p#:6 = AddSubVec3#7e19b481."+"#3760193f#0(
            eye#:4,
            ScaleVec3#3f673260."*"#2a8cceae#0(dist#:5, dir#:3),
        );
        const K_a#:7 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:8 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:9 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:10 = 10.0;
        const color#:11 = phongIllumination#7a05e9a8(
            iTime#:0,
            K_a#:7,
            K_d#:8,
            K_s#:9,
            shininess#:10,
            p#:6,
            eye#:4,
        );
        Vec4#3b941378{...color#:11, w#3b941378#0: 1.0};
    };
}
```
*/
export const hash_47679440: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_3b941378 = (iTime: number, fragCoord$1: t_43802a16, iResolution: t_43802a16) => {
  let dir: t_9f1c0644 = hash_5ca09574(45, iResolution, fragCoord$1);
  let eye$4: t_9f1c0644 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_9f1c0644);
  let dist$5: number = hash_532cff63(iTime, eye$4, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$5 > hash_0ce717e6 - hash_17261aaa) {
    return ({
      type: "Vec4",
      z: 1,
      x: 1,
      y: 1,
      w: 1
    } as t_3b941378);
  } else {
    return ({ ...hash_7a05e9a8(iTime, ({
        type: "Vec3",
        x: 0.9,
        y: 0.2,
        z: 0.3
      } as t_9f1c0644), ({
        type: "Vec3",
        x: 0,
        y: 0.2,
        z: 0.7
      } as t_9f1c0644), ({
        type: "Vec3",
        x: 1,
        y: 1,
        z: 1
      } as t_9f1c0644), 10, hash_7e19b481.h3760193f_0(eye$4, hash_3f673260.h2a8cceae_0(dist$5, dir)), eye$4),
      type: "Vec4",
      w: 1
    } as t_3b941378);
  }
};

/*
ScaleVec3#3f673260."*"#2a8cceae#0(
    2.0,
    Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 2.0, z#9f1c0644#0: 3.0},
)
*/
hash_3f673260.h2a8cceae_0(2, ({
  type: "Vec3",
  x: 1,
  y: 2,
  z: 3
} as t_9f1c0644));

/*
estimateNormal#7fc9583a
*/
hash_7fc9583a;

/*
mainImage#47679440
*/
hash_47679440;
export const mainImage = hash_47679440;