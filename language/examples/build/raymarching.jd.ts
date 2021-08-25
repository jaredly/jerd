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
type Neg#3c2a4898<A#:0, B#:1> = {
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
const AddSubVec3#8e58b954 = AddSub#b99b22d8<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644>{
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
export const hash_8e58b954: t_b99b22d8<t_9f1c0644, t_9f1c0644, t_9f1c0644> = ({
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
const length#1e74e8e4 = (v#:0: Vec3#9f1c0644): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
            +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1 
        +#builtin v#:0.z#9f1c0644#0 *#builtin v#:0.z#9f1c0644#0,
)
```
*/
export const hash_1e74e8e4: (arg_0: t_9f1c0644) => number = (v: t_9f1c0644) => sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/**
```
const distance#5b517fea = (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): float#builtin ={}> length#1e74e8e4(
    v: two#:1 -#8e58b954#b99b22d8#1 one#:0,
)
```
*/
export const hash_5b517fea: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (one: t_9f1c0644, two: t_9f1c0644) => hash_1e74e8e4(hash_8e58b954.hb99b22d8_1(two, one));

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
const dot#aa893e90 = (a#:0: Vec4#3b941378, b#:1: Vec4#3b941378): float#builtin ={}> {
    a#:0.x#43802a16#0 *#builtin b#:1.x#43802a16#0 
                +#builtin a#:0.y#43802a16#1 *#builtin b#:1.y#43802a16#1 
            +#builtin a#:0.z#9f1c0644#0 *#builtin b#:1.z#9f1c0644#0 
        +#builtin a#:0.w#3b941378#0 *#builtin b#:1.w#3b941378#0;
}
```
*/
export const hash_aa893e90: (arg_0: t_3b941378, arg_1: t_3b941378) => number = (a: t_3b941378, b: t_3b941378) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

/**
```
const abs#84e8317c = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: abs#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: abs#builtin(v#:0.y#43802a16#1),
    z#9f1c0644#0: abs#builtin(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_84e8317c: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_9f1c0644);

/**
```
const max#39ebceb8 = (v#:0: Vec3#9f1c0644): float#builtin ={}> {
    max#builtin(max#builtin(v#:0.x#43802a16#0, v#:0.y#43802a16#1), v#:0.z#9f1c0644#0);
}
```
*/
export const hash_39ebceb8: (arg_0: t_9f1c0644) => number = (v: t_9f1c0644) => max(max(v.x, v.y), v.z);

/**
```
const differenceSDF#fdad0384 = (distA#:0: float#builtin, distB#:1: float#builtin): float#builtin ={}> {
    max#builtin(distA#:0, -distB#:1);
}
```
*/
export const hash_fdad0384: (arg_0: number, arg_1: number) => number = (distA: number, distB: number) => max(distA, -distB);

/**
```
const unionSDF#5ee91162 = (distA#:0: float#builtin, distB#:1: float#builtin): float#builtin ={}> {
    min#builtin(distA#:0, distB#:1);
}
```
*/
export const hash_5ee91162: (arg_0: number, arg_1: number) => number = (distA: number, distB: number) => min(distA, distB);

/**
```
const sphereSDF#67002bf3 = (
    samplePoint#:0: Vec3#9f1c0644,
    center#:1: Vec3#9f1c0644,
    radius#:2: float#builtin,
): float#builtin ={}> distance#5b517fea(one: samplePoint#:0, two: center#:1) -#builtin radius#:2
```
*/
export const hash_67002bf3: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: number) => number = (samplePoint: t_9f1c0644, center: t_9f1c0644, radius: number) => hash_5b517fea(samplePoint, center) - radius;

/**
```
const rotateY#23cedd78 = (theta#:0: float#builtin): Mat4#d92781e8 ={}> {
    const c#:1 = cos#builtin(theta#:0);
    const s#:2 = sin#builtin(theta#:0);
    Mat4#d92781e8{
        r1#d92781e8#0: vec4#4d4983bb(x: c#:1, y: 0.0, z: s#:2, w: 0.0),
        r2#d92781e8#1: vec4#4d4983bb(x: c#:1, y: 1.0, z: c#:1, w: 0.0),
        r3#d92781e8#2: vec4#4d4983bb(x: -s#:2, y: 0.0, z: c#:1, w: 0.0),
        r4#d92781e8#3: vec4#4d4983bb(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
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
const MatByVector#e3e7521e = Mul#1de4e4c0<Mat4#d92781e8, Vec4#3b941378, Vec4#3b941378>{
    "*"#1de4e4c0#0: (mat#:0: Mat4#d92781e8, vec#:1: Vec4#3b941378): Vec4#3b941378 ={}> Vec4#3b941378{
        z#9f1c0644#0: dot#aa893e90(a: mat#:0.r3#d92781e8#2, b: vec#:1),
        x#43802a16#0: dot#aa893e90(a: mat#:0.r1#d92781e8#0, b: vec#:1),
        y#43802a16#1: dot#aa893e90(a: mat#:0.r2#d92781e8#1, b: vec#:1),
        w#3b941378#0: dot#aa893e90(a: mat#:0.r4#d92781e8#3, b: vec#:1),
    },
}
```
*/
export const hash_e3e7521e: t_1de4e4c0<t_d92781e8, t_3b941378, t_3b941378> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (mat: t_d92781e8, vec: t_3b941378) => ({
    type: "Vec4",
    z: hash_aa893e90(mat.r3, vec),
    x: hash_aa893e90(mat.r1, vec),
    y: hash_aa893e90(mat.r2, vec),
    w: hash_aa893e90(mat.r4, vec)
  } as t_3b941378)
} as t_1de4e4c0<t_d92781e8, t_3b941378, t_3b941378>);

/**
```
const xyz#b3d2d308 = (v#:0: Vec4#3b941378): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: v#:0.x#43802a16#0,
    y#43802a16#1: v#:0.y#43802a16#1,
    z#9f1c0644#0: v#:0.z#9f1c0644#0,
}
```
*/
export const hash_b3d2d308: (arg_0: t_3b941378) => t_9f1c0644 = (v: t_3b941378) => ({
  type: "Vec3",
  x: v.x,
  y: v.y,
  z: v.z
} as t_9f1c0644);

/**
```
const ScaleVec3Rev#8863b0ac = Div#5ac12902<Vec3#9f1c0644, float#builtin, Vec3#9f1c0644>{
    "/"#5ac12902#0: (v#:0: Vec3#9f1c0644, scale#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1,
        z#9f1c0644#0: v#:0.z#9f1c0644#0 /#builtin scale#:1,
    },
}
```
*/
export const hash_8863b0ac: t_5ac12902<t_9f1c0644, number, t_9f1c0644> = ({
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
const dot#e17ea18c = (a#:0: Vec3#9f1c0644, b#:1: Vec3#9f1c0644): float#builtin ={}> {
    a#:0.x#43802a16#0 *#builtin b#:1.x#43802a16#0 
            +#builtin a#:0.y#43802a16#1 *#builtin b#:1.y#43802a16#1 
        +#builtin a#:0.z#9f1c0644#0 *#builtin b#:1.z#9f1c0644#0;
}
```
*/
export const hash_e17ea18c: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (a: t_9f1c0644, b: t_9f1c0644) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
```
const ScaleVec3#44baf212 = Mul#1de4e4c0<float#builtin, Vec3#9f1c0644, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (scale#:0: float#builtin, v#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:1.x#43802a16#0 *#builtin scale#:0,
        y#43802a16#1: v#:1.y#43802a16#1 *#builtin scale#:0,
        z#9f1c0644#0: v#:1.z#9f1c0644#0 *#builtin scale#:0,
    },
}
```
*/
export const hash_44baf212: t_1de4e4c0<number, t_9f1c0644, t_9f1c0644> = ({
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
const EPSILON#17261aaa = 0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const sceneSDF#bbafa194 = (iTime#:0: float#builtin, samplePoint#:1: Vec3#9f1c0644): float#builtin ={}> {
    const cubePoint#:2 = samplePoint#:1;
    const cubePoint#:3 = cubePoint#:2 
        -#8e58b954#b99b22d8#1 Vec3#9f1c0644{
            x#43802a16#0: 0.0,
            y#43802a16#1: 0.0,
            z#9f1c0644#0: -1.0,
        };
    const cubePoint#:4 = xyz#b3d2d308(
        v: rotateY#23cedd78(theta: iTime#:0 /#builtin PI#builtin) 
            *#e3e7521e#1de4e4c0#0 Vec4#3b941378{...cubePoint#:3, w#3b941378#0: 1.0},
    );
    const size#:5 = sin#builtin(iTime#:0) *#builtin 0.2 +#builtin 0.4;
    const cosize#:6 = cos#builtin(iTime#:0) *#builtin 0.2 +#builtin 0.4;
    const offset#:7 = 0.6;
    const cubeSize#:8 = Vec3#9f1c0644{
        x#43802a16#0: size#:5,
        y#43802a16#1: cosize#:6,
        z#9f1c0644#0: size#:5,
    };
    const innerCubeSize#:9 = Vec3#9f1c0644{
        x#43802a16#0: size#:5 *#builtin offset#:7,
        y#43802a16#1: cosize#:6 *#builtin offset#:7,
        z#9f1c0644#0: size#:5 *#builtin offset#:7,
    };
    const circles#:10 = min#builtin(
        sphereSDF#67002bf3(
            samplePoint#:1,
            center: Vec3#9f1c0644{x#43802a16#0: 0.25, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
            radius: 0.5,
        ),
        sphereSDF#67002bf3(
            samplePoint#:1,
            center: Vec3#9f1c0644{x#43802a16#0: -0.5, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
            radius: 0.5,
        ),
    );
    unionSDF#5ee91162(
        distA: differenceSDF#fdad0384(
            distA: circles#:10,
            distB: max#39ebceb8(v: abs#84e8317c(v: cubePoint#:4) -#8e58b954#b99b22d8#1 cubeSize#:8),
        ),
        distB: max#39ebceb8(v: abs#84e8317c(v: cubePoint#:4) -#8e58b954#b99b22d8#1 innerCubeSize#:9),
    );
}
```
*/
export const hash_bbafa194: (arg_0: number, arg_1: t_9f1c0644) => number = (iTime: number, samplePoint$1: t_9f1c0644) => {
  let cubePoint: t_9f1c0644 = hash_b3d2d308(hash_e3e7521e.h1de4e4c0_0(hash_23cedd78(iTime / PI), ({ ...hash_8e58b954.hb99b22d8_1(samplePoint$1, ({
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
  return hash_5ee91162(hash_fdad0384(min(hash_67002bf3(samplePoint$1, ({
    type: "Vec3",
    x: 0.25,
    y: 0,
    z: -1
  } as t_9f1c0644), 0.5), hash_67002bf3(samplePoint$1, ({
    type: "Vec3",
    x: -0.5,
    y: 0,
    z: -1
  } as t_9f1c0644), 0.5)), hash_39ebceb8(hash_8e58b954.hb99b22d8_1(hash_84e8317c(cubePoint), ({
    type: "Vec3",
    x: size,
    y: cosize,
    z: size
  } as t_9f1c0644)))), hash_39ebceb8(hash_8e58b954.hb99b22d8_1(hash_84e8317c(cubePoint), ({
    type: "Vec3",
    x: size * 0.6,
    y: cosize * 0.6,
    z: size * 0.6
  } as t_9f1c0644))));
};

/**
```
const normalize#d508ff52 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> v#:0 
    /#8863b0ac#5ac12902#0 length#1e74e8e4(v#:0)
```
*/
export const hash_d508ff52: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => hash_8863b0ac.h5ac12902_0(v, hash_1e74e8e4(v));

/**
```
const MulVec3#72ac0e94 = Mul#1de4e4c0<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: one#:0.x#43802a16#0 *#builtin two#:1.x#43802a16#0,
        y#43802a16#1: one#:0.y#43802a16#1 *#builtin two#:1.y#43802a16#1,
        z#9f1c0644#0: one#:0.z#9f1c0644#0 *#builtin two#:1.z#9f1c0644#0,
    },
}
```
*/
export const hash_72ac0e94: t_1de4e4c0<t_9f1c0644, t_9f1c0644, t_9f1c0644> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (one: t_9f1c0644, two: t_9f1c0644) => ({
    type: "Vec3",
    x: one.x * two.x,
    y: one.y * two.y,
    z: one.z * two.z
  } as t_9f1c0644)
} as t_1de4e4c0<t_9f1c0644, t_9f1c0644, t_9f1c0644>);

/**
```
const ScaleVec3_#42016d26 = Mul#1de4e4c0<Vec3#9f1c0644, float#builtin, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (v#:0: Vec3#9f1c0644, scale#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:0.x#43802a16#0 *#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 *#builtin scale#:1,
        z#9f1c0644#0: v#:0.z#9f1c0644#0 *#builtin scale#:1,
    },
}
```
*/
export const hash_42016d26: t_1de4e4c0<t_9f1c0644, number, t_9f1c0644> = ({
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
const NegVec3#52db783c = Neg#3c2a4898<Vec3#9f1c0644, Vec3#9f1c0644>{
    "-"#3c2a4898#0: (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: -v#:0.x#43802a16#0,
        y#43802a16#1: -v#:0.y#43802a16#1,
        z#9f1c0644#0: -v#:0.z#9f1c0644#0,
    },
}
```
*/
export const hash_52db783c: t_3c2a4898<t_9f1c0644, t_9f1c0644> = ({
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
const reflect#bb1a6a98 = (I#:0: Vec3#9f1c0644, N#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    I#:0 
        -#8e58b954#b99b22d8#1 2.0 *#builtin dot#e17ea18c(a: N#:1, b: I#:0) 
            *#44baf212#1de4e4c0#0 N#:1;
}
```
*/
export const hash_bb1a6a98: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => t_9f1c0644 = (I: t_9f1c0644, N: t_9f1c0644) => hash_8e58b954.hb99b22d8_1(I, hash_44baf212.h1de4e4c0_0(2 * hash_e17ea18c(N, I), N));

/**
```
const estimateNormal#26d624dc = (iTime#:0: float#builtin, p#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> normalize#d508ff52(
    v: Vec3#9f1c0644{
        x#43802a16#0: sceneSDF#bbafa194(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    x#43802a16#0: p#:1.x#43802a16#0 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#bbafa194(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    x#43802a16#0: p#:1.x#43802a16#0 -#builtin EPSILON#17261aaa,
                },
            ),
        y#43802a16#1: sceneSDF#bbafa194(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    y#43802a16#1: p#:1.y#43802a16#1 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#bbafa194(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    y#43802a16#1: p#:1.y#43802a16#1 -#builtin EPSILON#17261aaa,
                },
            ),
        z#9f1c0644#0: sceneSDF#bbafa194(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    z#9f1c0644#0: p#:1.z#9f1c0644#0 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#bbafa194(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    z#9f1c0644#0: p#:1.z#9f1c0644#0 -#builtin EPSILON#17261aaa,
                },
            ),
    },
)
```
*/
export const hash_26d624dc: (arg_0: number, arg_1: t_9f1c0644) => t_9f1c0644 = (iTime: number, p: t_9f1c0644) => hash_d508ff52(({
  type: "Vec3",
  x: hash_bbafa194(iTime, ({ ...p,
    type: "Vec3",
    x: p.x + hash_17261aaa
  } as t_9f1c0644)) - hash_bbafa194(iTime, ({ ...p,
    type: "Vec3",
    x: p.x - hash_17261aaa
  } as t_9f1c0644)),
  y: hash_bbafa194(iTime, ({ ...p,
    type: "Vec3",
    y: p.y + hash_17261aaa
  } as t_9f1c0644)) - hash_bbafa194(iTime, ({ ...p,
    type: "Vec3",
    y: p.y - hash_17261aaa
  } as t_9f1c0644)),
  z: hash_bbafa194(iTime, ({ ...p,
    type: "Vec3",
    z: p.z + hash_17261aaa
  } as t_9f1c0644)) - hash_bbafa194(iTime, ({ ...p,
    type: "Vec3",
    z: p.z - hash_17261aaa
  } as t_9f1c0644))
} as t_9f1c0644));

/**
```
const phongContribForLight#690f84cc = (
    iTime#:0: float#builtin,
    k_d#:1: Vec3#9f1c0644,
    k_s#:2: Vec3#9f1c0644,
    alpha#:3: float#builtin,
    p#:4: Vec3#9f1c0644,
    eye#:5: Vec3#9f1c0644,
    lightPos#:6: Vec3#9f1c0644,
    lightIntensity#:7: Vec3#9f1c0644,
): Vec3#9f1c0644 ={}> {
    const N#:8 = estimateNormal#26d624dc(iTime#:0, p#:4);
    const L#:9 = normalize#d508ff52(v: lightPos#:6 -#8e58b954#b99b22d8#1 p#:4);
    const V#:10 = normalize#d508ff52(v: eye#:5 -#8e58b954#b99b22d8#1 p#:4);
    const R#:11 = normalize#d508ff52(
        v: reflect#bb1a6a98(I: NegVec3#52db783c."-"#3c2a4898#0(L#:9), N#:8),
    );
    const dotLN#:12 = dot#e17ea18c(a: L#:9, b: N#:8);
    const dotRV#:13 = dot#e17ea18c(a: R#:11, b: V#:10);
    if dotLN#:12 <#builtin 0.0 {
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0};
    } else if dotRV#:13 <#builtin 0.0 {
        const m#:14 = k_d#:1 *#42016d26#1de4e4c0#0 dotLN#:12;
        lightIntensity#:7 *#72ac0e94#1de4e4c0#0 m#:14;
    } else {
        const m#:15 = k_d#:1 *#42016d26#1de4e4c0#0 dotLN#:12 
            +#8e58b954#b99b22d8#0 k_s#:2 *#42016d26#1de4e4c0#0 pow#builtin(dotRV#:13, alpha#:3);
        lightIntensity#:7 *#72ac0e94#1de4e4c0#0 m#:15;
    };
}
```
*/
export const hash_690f84cc: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: t_9f1c0644, arg_5: t_9f1c0644, arg_6: t_9f1c0644, arg_7: t_9f1c0644) => t_9f1c0644 = (iTime: number, k_d: t_9f1c0644, k_s: t_9f1c0644, alpha: number, p$4: t_9f1c0644, eye: t_9f1c0644, lightPos: t_9f1c0644, lightIntensity: t_9f1c0644) => {
  let N$8: t_9f1c0644 = hash_26d624dc(iTime, p$4);
  let L: t_9f1c0644 = hash_d508ff52(hash_8e58b954.hb99b22d8_1(lightPos, p$4));
  let dotLN: number = hash_e17ea18c(L, N$8);
  let dotRV: number = hash_e17ea18c(hash_d508ff52(hash_bb1a6a98(hash_52db783c.h3c2a4898_0(L), N$8)), hash_d508ff52(hash_8e58b954.hb99b22d8_1(eye, p$4)));

  if (dotLN < 0) {
    return ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: 0
    } as t_9f1c0644);
  } else {
    if (dotRV < 0) {
      return hash_72ac0e94.h1de4e4c0_0(lightIntensity, hash_42016d26.h1de4e4c0_0(k_d, dotLN));
    } else {
      return hash_72ac0e94.h1de4e4c0_0(lightIntensity, hash_8e58b954.hb99b22d8_0(hash_42016d26.h1de4e4c0_0(k_d, dotLN), hash_42016d26.h1de4e4c0_0(k_s, pow(dotRV, alpha))));
    }
  }
};

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
const ScaleVec2Rev#5e752e2e = Div#5ac12902<Vec2#43802a16, float#builtin, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1,
    },
}
```
*/
export const hash_5e752e2e: t_5ac12902<t_43802a16, number, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale: number) => ({
    type: "Vec2",
    x: v.x / scale,
    y: v.y / scale
  } as t_43802a16)
} as t_5ac12902<t_43802a16, number, t_43802a16>);

/**
```
const AddSubVec2#057d15c6 = AddSub#b99b22d8<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
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
export const hash_057d15c6: t_b99b22d8<t_43802a16, t_43802a16, t_43802a16> = ({
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
const phongIllumination#388cc5f2 = (
    iTime#:0: float#builtin,
    k_a#:1: Vec3#9f1c0644,
    k_d#:2: Vec3#9f1c0644,
    k_s#:3: Vec3#9f1c0644,
    alpha#:4: float#builtin,
    p#:5: Vec3#9f1c0644,
    eye#:6: Vec3#9f1c0644,
): Vec3#9f1c0644 ={}> {
    const ambientLight#:7 = 0.5 
        *#44baf212#1de4e4c0#0 Vec3#9f1c0644{
            x#43802a16#0: 1.0,
            y#43802a16#1: 1.0,
            z#9f1c0644#0: 1.0,
        };
    const color#:8 = ambientLight#:7 *#72ac0e94#1de4e4c0#0 k_a#:1;
    const light1Pos#:9 = Vec3#9f1c0644{
        x#43802a16#0: 4.0 *#builtin sin#builtin(iTime#:0),
        y#43802a16#1: 2.0,
        z#9f1c0644#0: 4.0 *#builtin cos#builtin(iTime#:0),
    };
    const light1Intensity#:10 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:11 = color#:8 
        +#8e58b954#b99b22d8#0 phongContribForLight#690f84cc(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            lightPos: light1Pos#:9,
            lightIntensity: light1Intensity#:10,
        );
    const light2Pos#:12 = Vec3#9f1c0644{
        x#43802a16#0: 2.0 *#builtin sin#builtin(0.37 *#builtin iTime#:0),
        y#43802a16#1: 2.0 *#builtin cos#builtin(0.37 *#builtin iTime#:0),
        z#9f1c0644#0: 2.0,
    };
    const light2Intensity#:13 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:14 = color#:11 
        +#8e58b954#b99b22d8#0 phongContribForLight#690f84cc(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            lightPos: light2Pos#:12,
            lightIntensity: light2Intensity#:13,
        );
    color#:14;
}
```
*/
export const hash_388cc5f2: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: t_9f1c0644, arg_6: t_9f1c0644) => t_9f1c0644 = (iTime: number, k_a: t_9f1c0644, k_d$2: t_9f1c0644, k_s$3: t_9f1c0644, alpha$4: number, p$5: t_9f1c0644, eye$6: t_9f1c0644) => hash_8e58b954.hb99b22d8_0(hash_8e58b954.hb99b22d8_0(hash_72ac0e94.h1de4e4c0_0(hash_44baf212.h1de4e4c0_0(0.5, ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_9f1c0644)), k_a), hash_690f84cc(iTime, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 4 * sin(iTime),
  y: 2,
  z: 4 * cos(iTime)
} as t_9f1c0644), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_9f1c0644))), hash_690f84cc(iTime, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
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
const MAX_DIST#0ce717e6 = 100.0
```
*/
export const hash_0ce717e6: number = 100;

/**
```
const MIN_DIST#f2cd39b8 = 0.0
```
*/
export const hash_f2cd39b8: number = 0;

/**
```
const rec shortestDistanceToSurface#534f2882 = (
    iTime#:0: float#builtin,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float#builtin,
    end#:4: float#builtin,
    stepsLeft#:5: int#builtin,
): float#builtin ={}> {
    const dist#:6 = sceneSDF#bbafa194(
        iTime#:0,
        samplePoint: eye#:1 
            +#8e58b954#b99b22d8#0 start#:3 *#44baf212#1de4e4c0#0 marchingDirection#:2,
    );
    if dist#:6 <#builtin EPSILON#17261aaa {
        start#:3;
    } else {
        const depth#:7 = start#:3 +#builtin dist#:6;
        if depth#:7 >=#builtin end#:4 ||#builtin stepsLeft#:5 <=#builtin 0 {
            end#:4;
        } else {
            534f2882#self(
                iTime#:0,
                eye#:1,
                marchingDirection#:2,
                depth#:7,
                end#:4,
                stepsLeft#:5 -#builtin 1,
            );
        };
    };
}
```
*/
export const hash_534f2882: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: number, arg_5: number) => number = (iTime: number, eye$1: t_9f1c0644, marchingDirection: t_9f1c0644, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = hash_bbafa194(iTime, hash_8e58b954.hb99b22d8_0(eye$1, hash_44baf212.h1de4e4c0_0(start, marchingDirection)));

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
const rayDirection#09636498 = (
    fieldOfView#:0: float#builtin,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
): Vec3#9f1c0644 ={}> {
    const xy#:3 = fragCoord#:2 -#057d15c6#b99b22d8#1 size#:1 /#5e752e2e#5ac12902#0 2.0;
    const z#:4 = size#:1.y#43802a16#1 
        /#builtin tan#builtin(radians#dabe7f9c(degrees: fieldOfView#:0) /#builtin 2.0);
    normalize#d508ff52(v: vec3#5808ec54(v: xy#:3, z: -z#:4));
}
```
*/
export const hash_09636498: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_9f1c0644 = (fieldOfView: number, size$1: t_43802a16, fragCoord: t_43802a16) => hash_d508ff52(hash_5808ec54(hash_057d15c6.hb99b22d8_1(fragCoord, hash_5e752e2e.h5ac12902_0(size$1, 2)), -(size$1.y / tan(hash_dabe7f9c(fieldOfView) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const mainImage#72b5106f = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const dir#:2 = rayDirection#09636498(
        fieldOfView: 45.0,
        size: env#:0.resolution#451d5252#1,
        fragCoord#:1,
    );
    const eye#:3 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:4 = shortestDistanceToSurface#534f2882(
        iTime: env#:0.time#451d5252#0,
        eye#:3,
        marchingDirection: dir#:2,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    if dist#:4 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#17261aaa {
        Vec4#3b941378{
            z#9f1c0644#0: 1.0,
            x#43802a16#0: 1.0,
            y#43802a16#1: 1.0,
            w#3b941378#0: 1.0,
        };
    } else {
        const p#:5 = eye#:3 +#8e58b954#b99b22d8#0 dist#:4 *#44baf212#1de4e4c0#0 dir#:2;
        const K_a#:6 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:7 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:8 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:9 = 10.0;
        const color#:10 = phongIllumination#388cc5f2(
            iTime: env#:0.time#451d5252#0,
            k_a: K_a#:6,
            k_d: K_d#:7,
            k_s: K_s#:8,
            alpha: shininess#:9,
            p#:5,
            eye#:3,
        );
        Vec4#3b941378{...color#:10, w#3b941378#0: 1.0};
    };
}
```
*/
export const hash_72b5106f: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = (env: t_451d5252, fragCoord$1: t_43802a16) => {
  let dir: t_9f1c0644 = hash_09636498(45, env.resolution, fragCoord$1);
  let eye$3: t_9f1c0644 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_9f1c0644);
  let dist$4: number = hash_534f2882(env.time, eye$3, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$4 > hash_0ce717e6 - hash_17261aaa) {
    return ({
      type: "Vec4",
      z: 1,
      x: 1,
      y: 1,
      w: 1
    } as t_3b941378);
  } else {
    return ({ ...hash_388cc5f2(env.time, ({
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
      } as t_9f1c0644), 10, hash_8e58b954.hb99b22d8_0(eye$3, hash_44baf212.h1de4e4c0_0(dist$4, dir)), eye$3),
      type: "Vec4",
      w: 1
    } as t_3b941378);
  }
};

/*
2.0 *#44baf212#1de4e4c0#0 Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 2.0, z#9f1c0644#0: 3.0}
*/
hash_44baf212.h1de4e4c0_0(2, ({
  type: "Vec3",
  x: 1,
  y: 2,
  z: 3
} as t_9f1c0644));

/*
estimateNormal#26d624dc
*/
hash_26d624dc;
export const mainImage = hash_72b5106f;