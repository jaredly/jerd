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
type AddSub#6dd04510<T#:0> = {
    "+": (A#:0, A#:0) ={}> A#:0,
    "-": (A#:0, A#:0) ={}> A#:0,
}
```
*/
type t_6dd04510<T_0> = {
  type: "6dd04510";
  h6dd04510_0: (arg_0: T_0, arg_1: T_0) => T_0;
  h6dd04510_1: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
type Mul#3705f17c<T#:0, T#:1, T#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_3705f17c<T_0, T_1, T_2> = {
  type: "3705f17c";
  h3705f17c_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Div#700c983a<T#:0, T#:1, T#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_700c983a<T_0, T_1, T_2> = {
  type: "700c983a";
  h700c983a_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
const AddSubVec3#76becd46: AddSub#6dd04510<Vec3#9f1c0644> = AddSub#6dd04510<Vec3#9f1c0644>{
    "+"#6dd04510#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1.y#43802a16#1),
        z#9f1c0644#0: (one#:0.z#9f1c0644#0 + two#:1.z#9f1c0644#0),
    },
    "-"#6dd04510#1: (one#:2: Vec3#9f1c0644, two#:3: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3.x#43802a16#0),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3.y#43802a16#1),
        z#9f1c0644#0: (one#:2.z#9f1c0644#0 - two#:3.z#9f1c0644#0),
    },
}
```
*/
export const hash_76becd46: t_6dd04510<t_9f1c0644> = ({
  type: "6dd04510",
  h6dd04510_0: (one$0: t_9f1c0644, two$1: t_9f1c0644) => ({
    type: "Vec3",
    x: one$0.x + two$1.x,
    y: one$0.y + two$1.y,
    z: one$0.z + two$1.z
  } as t_9f1c0644),
  h6dd04510_1: (one$2: t_9f1c0644, two$3: t_9f1c0644) => ({
    type: "Vec3",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    z: one$2.z - two$3.z
  } as t_9f1c0644)
} as t_6dd04510<t_9f1c0644>);

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
const distance#ad296b80: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> float = (
    one#:0: Vec3#9f1c0644,
    two#:1: Vec3#9f1c0644,
) ={}> length#1cc335a2(AddSubVec3#76becd46."-"#6dd04510#1(two#:1, one#:0))
```
*/
export const hash_ad296b80: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (one$0: t_9f1c0644, two$1: t_9f1c0644) => hash_1cc335a2(hash_76becd46.h6dd04510_1(two$1, one$0));

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
const differenceSDF#fdad0384: (float, float) ={}> float = (distA#:0: float, distB#:1: float) ={}> {
    max(distA#:0, -distB#:1);
}
```
*/
export const hash_fdad0384: (arg_0: number, arg_1: number) => number = (distA$0: number, distB$1: number) => max(distA$0, -distB$1);

/**
```
const unionSDF#5ee91162: (float, float) ={}> float = (distA#:0: float, distB#:1: float) ={}> {
    min(distA#:0, distB#:1);
}
```
*/
export const hash_5ee91162: (arg_0: number, arg_1: number) => number = (distA$0: number, distB$1: number) => min(distA$0, distB$1);

/**
```
const sphereSDF#a6a5c8ec: (Vec3#9f1c0644, Vec3#9f1c0644, float) ={}> float = (
    samplePoint#:0: Vec3#9f1c0644,
    center#:1: Vec3#9f1c0644,
    radius#:2: float,
) ={}> (distance#ad296b80(samplePoint#:0, center#:1) - radius#:2)
```
*/
export const hash_a6a5c8ec: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: number) => number = (samplePoint$0: t_9f1c0644, center$1: t_9f1c0644, radius$2: number) => hash_ad296b80(samplePoint$0, center$1) - radius$2;

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
export const hash_23cedd78: (arg_0: number) => t_d92781e8 = (theta$0: number) => {
  let c$1: number = cos(theta$0);
  let s$2: number = sin(theta$0);
  return ({
    type: "Mat4",
    r1: hash_4d4983bb(c$1, 0, s$2, 0),
    r2: hash_4d4983bb(c$1, 1, c$1, 0),
    r3: hash_4d4983bb(-s$2, 0, c$1, 0),
    r4: hash_4d4983bb(0, 0, 0, 1)
  } as t_d92781e8);
};

/**
```
const MatByVector#4f97293e: Mul#3705f17c<Mat4#d92781e8, Vec4#3b941378, Vec4#3b941378> = Mul#3705f17c<
    Mat4#d92781e8,
    Vec4#3b941378,
    Vec4#3b941378,
>{
    "*"#3705f17c#0: (mat#:0: Mat4#d92781e8, vec#:1: Vec4#3b941378) ={}> Vec4#3b941378{
        z#9f1c0644#0: dot4#a0178052(mat#:0.r3#d92781e8#2, vec#:1),
        x#43802a16#0: dot4#a0178052(mat#:0.r1#d92781e8#0, vec#:1),
        y#43802a16#1: dot4#a0178052(mat#:0.r2#d92781e8#1, vec#:1),
        w#3b941378#0: dot4#a0178052(mat#:0.r4#d92781e8#3, vec#:1),
    },
}
```
*/
export const hash_4f97293e: t_3705f17c<t_d92781e8, t_3b941378, t_3b941378> = ({
  type: "3705f17c",
  h3705f17c_0: (mat$0: t_d92781e8, vec$1: t_3b941378) => ({
    type: "Vec4",
    z: hash_a0178052(mat$0.r3, vec$1),
    x: hash_a0178052(mat$0.r1, vec$1),
    y: hash_a0178052(mat$0.r2, vec$1),
    w: hash_a0178052(mat$0.r4, vec$1)
  } as t_3b941378)
} as t_3705f17c<t_d92781e8, t_3b941378, t_3b941378>);

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
const ScaleVec3Rev#24e3ffa1: Div#700c983a<Vec3#9f1c0644, float, Vec3#9f1c0644> = Div#700c983a<
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
>{
    "/"#700c983a#0: (v#:0: Vec3#9f1c0644, scale#:1: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 / scale#:1),
    },
}
```
*/
export const hash_24e3ffa1: t_700c983a<t_9f1c0644, number, t_9f1c0644> = ({
  type: "700c983a",
  h700c983a_0: (v$0: t_9f1c0644, scale$1: number) => ({
    type: "Vec3",
    x: v$0.x / scale$1,
    y: v$0.y / scale$1,
    z: v$0.z / scale$1
  } as t_9f1c0644)
} as t_700c983a<t_9f1c0644, number, t_9f1c0644>);

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
const ScaleVec3#a16fada6: Mul#3705f17c<float, Vec3#9f1c0644, Vec3#9f1c0644> = Mul#3705f17c<
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
>{
    "*"#3705f17c#0: (scale#:0: float, v#:1: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:1.x#43802a16#0 * scale#:0),
        y#43802a16#1: (v#:1.y#43802a16#1 * scale#:0),
        z#9f1c0644#0: (v#:1.z#9f1c0644#0 * scale#:0),
    },
}
```
*/
export const hash_a16fada6: t_3705f17c<number, t_9f1c0644, t_9f1c0644> = ({
  type: "3705f17c",
  h3705f17c_0: (scale$0: number, v$1: t_9f1c0644) => ({
    type: "Vec3",
    x: v$1.x * scale$0,
    y: v$1.y * scale$0,
    z: v$1.z * scale$0
  } as t_9f1c0644)
} as t_3705f17c<number, t_9f1c0644, t_9f1c0644>);

/**
```
const EPSILON#17261aaa: float = 0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const sceneSDF#087c0ca4: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const cubePoint#:2 = samplePoint#:1;
    const cubePoint#:3 = AddSubVec3#76becd46."-"#6dd04510#1(
        cubePoint#:2,
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
    );
    const cubePoint#:4 = xyz#1aedf216(
        MatByVector#4f97293e."*"#3705f17c#0(
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
        sphereSDF#a6a5c8ec(
            samplePoint#:1,
            Vec3#9f1c0644{x#43802a16#0: 0.25, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
            0.5,
        ),
        sphereSDF#a6a5c8ec(
            samplePoint#:1,
            Vec3#9f1c0644{x#43802a16#0: -0.5, y#43802a16#1: 0.0, z#9f1c0644#0: -1.0},
            0.5,
        ),
    );
    unionSDF#5ee91162(
        differenceSDF#fdad0384(
            circles#:10,
            vmax#3af3fc3c(
                AddSubVec3#76becd46."-"#6dd04510#1(vabs#1a074578(cubePoint#:4), cubeSize#:8),
            ),
        ),
        vmax#3af3fc3c(
            AddSubVec3#76becd46."-"#6dd04510#1(vabs#1a074578(cubePoint#:4), innerCubeSize#:9),
        ),
    );
}
```
*/
export const hash_087c0ca4: (arg_0: number, arg_1: t_9f1c0644) => number = (iTime$0: number, samplePoint$1: t_9f1c0644) => {
  let cubePoint$4: t_9f1c0644 = hash_1aedf216(hash_4f97293e.h3705f17c_0(hash_23cedd78(iTime$0 / PI), ({ ...hash_76becd46.h6dd04510_1(samplePoint$1, ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: -1
    } as t_9f1c0644)),
    type: "Vec4",
    w: 1
  } as t_3b941378)));
  let size$5: number = sin(iTime$0) * 0.2 + 0.4;
  let cosize$6: number = cos(iTime$0) * 0.2 + 0.4;
  let offset$7: number = 0.6;
  return hash_5ee91162(hash_fdad0384(min(hash_a6a5c8ec(samplePoint$1, ({
    type: "Vec3",
    x: 0.25,
    y: 0,
    z: -1
  } as t_9f1c0644), 0.5), hash_a6a5c8ec(samplePoint$1, ({
    type: "Vec3",
    x: -0.5,
    y: 0,
    z: -1
  } as t_9f1c0644), 0.5)), hash_3af3fc3c(hash_76becd46.h6dd04510_1(hash_1a074578(cubePoint$4), ({
    type: "Vec3",
    x: size$5,
    y: cosize$6,
    z: size$5
  } as t_9f1c0644)))), hash_3af3fc3c(hash_76becd46.h6dd04510_1(hash_1a074578(cubePoint$4), ({
    type: "Vec3",
    x: size$5 * offset$7,
    y: cosize$6 * offset$7,
    z: size$5 * offset$7
  } as t_9f1c0644))));
};

/**
```
const normalize#19f598f6: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> ScaleVec3Rev#24e3ffa1."/"#700c983a#0(
    v#:0,
    length#1cc335a2(v#:0),
)
```
*/
export const hash_19f598f6: (arg_0: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644) => hash_24e3ffa1.h700c983a_0(v$0, hash_1cc335a2(v$0));

/**
```
const MulVec3#50c8f71c: Mul#3705f17c<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644> = Mul#3705f17c<
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
>{
    "*"#3705f17c#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
        x#43802a16#0: (one#:0.x#43802a16#0 * two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 * two#:1.y#43802a16#1),
        z#9f1c0644#0: (one#:0.z#9f1c0644#0 * two#:1.z#9f1c0644#0),
    },
}
```
*/
export const hash_50c8f71c: t_3705f17c<t_9f1c0644, t_9f1c0644, t_9f1c0644> = ({
  type: "3705f17c",
  h3705f17c_0: (one$0: t_9f1c0644, two$1: t_9f1c0644) => ({
    type: "Vec3",
    x: one$0.x * two$1.x,
    y: one$0.y * two$1.y,
    z: one$0.z * two$1.z
  } as t_9f1c0644)
} as t_3705f17c<t_9f1c0644, t_9f1c0644, t_9f1c0644>);

/**
```
const ScaleVec3_#61fd70dc: Mul#3705f17c<Vec3#9f1c0644, float, Vec3#9f1c0644> = Mul#3705f17c<
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
>{
    "*"#3705f17c#0: (v#:0: Vec3#9f1c0644, scale#:1: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:0.x#43802a16#0 * scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 * scale#:1),
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 * scale#:1),
    },
}
```
*/
export const hash_61fd70dc: t_3705f17c<t_9f1c0644, number, t_9f1c0644> = ({
  type: "3705f17c",
  h3705f17c_0: (v$0: t_9f1c0644, scale$1: number) => ({
    type: "Vec3",
    x: v$0.x * scale$1,
    y: v$0.y * scale$1,
    z: v$0.z * scale$1
  } as t_9f1c0644)
} as t_3705f17c<t_9f1c0644, number, t_9f1c0644>);

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
const reflect#2c51a170: (Vec3#9f1c0644, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    I#:0: Vec3#9f1c0644,
    N#:1: Vec3#9f1c0644,
) ={}> {
    AddSubVec3#76becd46."-"#6dd04510#1(
        I#:0,
        ScaleVec3#a16fada6."*"#3705f17c#0((2.0 * dot#255c39c3(N#:1, I#:0)), N#:1),
    );
}
```
*/
export const hash_2c51a170: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => t_9f1c0644 = (I$0: t_9f1c0644, N$1: t_9f1c0644) => hash_76becd46.h6dd04510_1(I$0, hash_a16fada6.h3705f17c_0(2 * hash_255c39c3(N$1, I$0), N$1));

/**
```
const estimateNormal#1f7c9e13: (float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
) ={}> normalize#19f598f6(
    Vec3#9f1c0644{
        x#43802a16#0: (sceneSDF#087c0ca4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 + EPSILON#17261aaa)},
        ) - sceneSDF#087c0ca4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 - EPSILON#17261aaa)},
        )),
        y#43802a16#1: (sceneSDF#087c0ca4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 + EPSILON#17261aaa)},
        ) - sceneSDF#087c0ca4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 - EPSILON#17261aaa)},
        )),
        z#9f1c0644#0: (sceneSDF#087c0ca4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 + EPSILON#17261aaa)},
        ) - sceneSDF#087c0ca4(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 - EPSILON#17261aaa)},
        )),
    },
)
```
*/
export const hash_1f7c9e13: (arg_0: number, arg_1: t_9f1c0644) => t_9f1c0644 = (iTime$0: number, p$1: t_9f1c0644) => hash_19f598f6(({
  type: "Vec3",
  x: hash_087c0ca4(iTime$0, ({ ...p$1,
    type: "Vec3",
    x: p$1.x + hash_17261aaa
  } as t_9f1c0644)) - hash_087c0ca4(iTime$0, ({ ...p$1,
    type: "Vec3",
    x: p$1.x - hash_17261aaa
  } as t_9f1c0644)),
  y: hash_087c0ca4(iTime$0, ({ ...p$1,
    type: "Vec3",
    y: p$1.y + hash_17261aaa
  } as t_9f1c0644)) - hash_087c0ca4(iTime$0, ({ ...p$1,
    type: "Vec3",
    y: p$1.y - hash_17261aaa
  } as t_9f1c0644)),
  z: hash_087c0ca4(iTime$0, ({ ...p$1,
    type: "Vec3",
    z: p$1.z + hash_17261aaa
  } as t_9f1c0644)) - hash_087c0ca4(iTime$0, ({ ...p$1,
    type: "Vec3",
    z: p$1.z - hash_17261aaa
  } as t_9f1c0644))
} as t_9f1c0644));

/**
```
const phongContribForLight#2b1c973b: (
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
    const N#:8 = estimateNormal#1f7c9e13(iTime#:0, p#:4);
    const L#:9 = normalize#19f598f6(AddSubVec3#76becd46."-"#6dd04510#1(lightPos#:6, p#:4));
    const V#:10 = normalize#19f598f6(AddSubVec3#76becd46."-"#6dd04510#1(eye#:5, p#:4));
    const R#:11 = normalize#19f598f6(reflect#2c51a170(negVec3#4129390c(L#:9), N#:8));
    const dotLN#:12 = dot#255c39c3(L#:9, N#:8);
    const dotRV#:13 = dot#255c39c3(R#:11, V#:10);
    if (dotLN#:12 < 0.0) {
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0};
    } else {
        if (dotRV#:13 < 0.0) {
            const m#:14 = ScaleVec3_#61fd70dc."*"#3705f17c#0(k_d#:1, dotLN#:12);
            MulVec3#50c8f71c."*"#3705f17c#0(lightIntensity#:7, m#:14);
        } else {
            const m#:15 = AddSubVec3#76becd46."+"#6dd04510#0(
                ScaleVec3_#61fd70dc."*"#3705f17c#0(k_d#:1, dotLN#:12),
                ScaleVec3_#61fd70dc."*"#3705f17c#0(k_s#:2, pow(dotRV#:13, alpha#:3)),
            );
            MulVec3#50c8f71c."*"#3705f17c#0(lightIntensity#:7, m#:15);
        };
    };
}
```
*/
export const hash_2b1c973b: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: t_9f1c0644, arg_5: t_9f1c0644, arg_6: t_9f1c0644, arg_7: t_9f1c0644) => t_9f1c0644 = (iTime$0: number, k_d$1: t_9f1c0644, k_s$2: t_9f1c0644, alpha$3: number, p$4: t_9f1c0644, eye$5: t_9f1c0644, lightPos$6: t_9f1c0644, lightIntensity$7: t_9f1c0644) => {
  let N$8: t_9f1c0644 = hash_1f7c9e13(iTime$0, p$4);
  let L$9: t_9f1c0644 = hash_19f598f6(hash_76becd46.h6dd04510_1(lightPos$6, p$4));
  let dotLN$12: number = hash_255c39c3(L$9, N$8);
  let dotRV$13: number = hash_255c39c3(hash_19f598f6(hash_2c51a170(hash_4129390c(L$9), N$8)), hash_19f598f6(hash_76becd46.h6dd04510_1(eye$5, p$4)));

  if (dotLN$12 < 0) {
    return ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: 0
    } as t_9f1c0644);
  } else {
    if (dotRV$13 < 0) {
      return hash_50c8f71c.h3705f17c_0(lightIntensity$7, hash_61fd70dc.h3705f17c_0(k_d$1, dotLN$12));
    } else {
      return hash_50c8f71c.h3705f17c_0(lightIntensity$7, hash_76becd46.h6dd04510_0(hash_61fd70dc.h3705f17c_0(k_d$1, dotLN$12), hash_61fd70dc.h3705f17c_0(k_s$2, pow(dotRV$13, alpha$3))));
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
const ScaleVec2Rev#97d0aef8: Div#700c983a<Vec2#43802a16, float, Vec2#43802a16> = Div#700c983a<
    Vec2#43802a16,
    float,
    Vec2#43802a16,
>{
    "/"#700c983a#0: (v#:0: Vec2#43802a16, scale#:1: float) ={}> Vec2#43802a16{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
    },
}
```
*/
export const hash_97d0aef8: t_700c983a<t_43802a16, number, t_43802a16> = ({
  type: "700c983a",
  h700c983a_0: (v$0: t_43802a16, scale$1: number) => ({
    type: "Vec2",
    x: v$0.x / scale$1,
    y: v$0.y / scale$1
  } as t_43802a16)
} as t_700c983a<t_43802a16, number, t_43802a16>);

/**
```
const AddSubVec2#70680826: AddSub#6dd04510<Vec2#43802a16> = AddSub#6dd04510<Vec2#43802a16>{
    "+"#6dd04510#0: (one#:0: Vec2#43802a16, two#:1: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1.y#43802a16#1),
    },
    "-"#6dd04510#1: (one#:2: Vec2#43802a16, two#:3: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3.x#43802a16#0),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3.y#43802a16#1),
    },
}
```
*/
export const hash_70680826: t_6dd04510<t_43802a16> = ({
  type: "6dd04510",
  h6dd04510_0: (one$0: t_43802a16, two$1: t_43802a16) => ({
    type: "Vec2",
    x: one$0.x + two$1.x,
    y: one$0.y + two$1.y
  } as t_43802a16),
  h6dd04510_1: (one$2: t_43802a16, two$3: t_43802a16) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_43802a16)
} as t_6dd04510<t_43802a16>);

/**
```
const phongIllumination#4926e368: (
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
    const ambientLight#:7 = ScaleVec3#a16fada6."*"#3705f17c#0(
        0.5,
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
    );
    const color#:8 = MulVec3#50c8f71c."*"#3705f17c#0(ambientLight#:7, k_a#:1);
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
    const color#:11 = AddSubVec3#76becd46."+"#6dd04510#0(
        color#:8,
        phongContribForLight#2b1c973b(
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
    const color#:14 = AddSubVec3#76becd46."+"#6dd04510#0(
        color#:11,
        phongContribForLight#2b1c973b(
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
export const hash_4926e368: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: t_9f1c0644, arg_6: t_9f1c0644) => t_9f1c0644 = (iTime$0: number, k_a$1: t_9f1c0644, k_d$2: t_9f1c0644, k_s$3: t_9f1c0644, alpha$4: number, p$5: t_9f1c0644, eye$6: t_9f1c0644) => hash_76becd46.h6dd04510_0(hash_76becd46.h6dd04510_0(hash_50c8f71c.h3705f17c_0(hash_a16fada6.h3705f17c_0(0.5, ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_9f1c0644)), k_a$1), hash_2b1c973b(iTime$0, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 4 * sin(iTime$0),
  y: 2,
  z: 4 * cos(iTime$0)
} as t_9f1c0644), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_9f1c0644))), hash_2b1c973b(iTime$0, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 2 * sin(0.37 * iTime$0),
  y: 2 * cos(0.37 * iTime$0),
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
const shortestDistanceToSurface#68bd632f: (float, Vec3#9f1c0644, Vec3#9f1c0644, float, float, int) ={}> float = (
    iTime#:0: float,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
) ={}> {
    const dist#:6 = sceneSDF#087c0ca4(
        iTime#:0,
        AddSubVec3#76becd46."+"#6dd04510#0(
            eye#:1,
            ScaleVec3#a16fada6."*"#3705f17c#0(start#:3, marchingDirection#:2),
        ),
    );
    if (dist#:6 < EPSILON#17261aaa) {
        start#:3;
    } else {
        const depth#:7 = (start#:3 + dist#:6);
        if ((depth#:7 >= end#:4) || (stepsLeft#:5 <= 0)) {
            end#:4;
        } else {
            68bd632f(iTime#:0, eye#:1, marchingDirection#:2, depth#:7, end#:4, (stepsLeft#:5 - 1));
        };
    };
}
```
*/
export const hash_68bd632f: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: number, arg_5: number) => number = (iTime$0: number, eye$1: t_9f1c0644, marchingDirection$2: t_9f1c0644, start$3: number, end$4: number, stepsLeft$5: number) => {
  while (true) {
    let dist$6: number = hash_087c0ca4(iTime$0, hash_76becd46.h6dd04510_0(eye$1, hash_a16fada6.h3705f17c_0(start$3, marchingDirection$2)));

    if (dist$6 < hash_17261aaa) {
      return start$3;
    } else {
      let depth$7: number = start$3 + dist$6;

      if (depth$7 >= end$4 || stepsLeft$5 <= 0) {
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
};

/**
```
const rayDirection#5ba32c50: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec3#9f1c0644 = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
) ={}> {
    const xy#:3 = AddSubVec2#70680826."-"#6dd04510#1(
        fragCoord#:2,
        ScaleVec2Rev#97d0aef8."/"#700c983a#0(size#:1, 2.0),
    );
    const z#:4 = (size#:1.y#43802a16#1 / tan((radians#dabe7f9c(fieldOfView#:0) / 2.0)));
    normalize#19f598f6(vec3#5808ec54(xy#:3, -z#:4));
}
```
*/
export const hash_5ba32c50: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_9f1c0644 = (fieldOfView$0: number, size$1: t_43802a16, fragCoord$2: t_43802a16) => hash_19f598f6(hash_5808ec54(hash_70680826.h6dd04510_1(fragCoord$2, hash_97d0aef8.h700c983a_0(size$1, 2)), -(size$1.y / tan(hash_dabe7f9c(fieldOfView$0) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const mainImage#12e3ef30: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
) ={}> {
    const dir#:3 = rayDirection#5ba32c50(45.0, iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#68bd632f(
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
        const p#:6 = AddSubVec3#76becd46."+"#6dd04510#0(
            eye#:4,
            ScaleVec3#a16fada6."*"#3705f17c#0(dist#:5, dir#:3),
        );
        const K_a#:7 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:8 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:9 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:10 = 10.0;
        const color#:11 = phongIllumination#4926e368(
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
export const hash_12e3ef30: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16) => {
  let dir$3: t_9f1c0644 = hash_5ba32c50(45, iResolution$2, fragCoord$1);
  let eye$4: t_9f1c0644 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_9f1c0644);
  let dist$5: number = hash_68bd632f(iTime$0, eye$4, dir$3, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$5 > hash_0ce717e6 - hash_17261aaa) {
    return ({
      type: "Vec4",
      z: 1,
      x: 1,
      y: 1,
      w: 1
    } as t_3b941378);
  } else {
    return ({ ...hash_4926e368(iTime$0, ({
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
      } as t_9f1c0644), 10, hash_76becd46.h6dd04510_0(eye$4, hash_a16fada6.h3705f17c_0(dist$5, dir$3)), eye$4),
      type: "Vec4",
      w: 1
    } as t_3b941378);
  }
};

/*
ScaleVec3#a16fada6."*"#3705f17c#0(
    2.0,
    Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 2.0, z#9f1c0644#0: 3.0},
)
*/
hash_a16fada6.h3705f17c_0(2, ({
  type: "Vec3",
  x: 1,
  y: 2,
  z: 3
} as t_9f1c0644));

/*
estimateNormal#1f7c9e13
*/
hash_1f7c9e13;

/*
mainImage#12e3ef30
*/
hash_12e3ef30;
export const mainImage = hash_12e3ef30;