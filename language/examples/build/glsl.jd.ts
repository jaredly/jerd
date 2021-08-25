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
const clamp#f2f2e188 = (v#:0: float#builtin, minv#:1: float#builtin, maxv#:2: float#builtin): float#builtin ={}> max#builtin(
    min#builtin(v#:0, maxv#:2),
    minv#:1,
)
```
*/
export const hash_f2f2e188: (arg_0: number, arg_1: number, arg_2: number) => number = (v: number, minv: number, maxv: number) => max(min(v, maxv), minv);

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
const round#5089ef00 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: round#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: round#builtin(v#:0.y#43802a16#1),
    z#9f1c0644#0: round#builtin(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_5089ef00: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: round(v.x),
  y: round(v.y),
  z: round(v.z)
} as t_9f1c0644);

/**
```
const clamp#6954efc0 = (v#:0: Vec3#9f1c0644, min#:1: Vec3#9f1c0644, max#:2: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
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
export const hash_6954efc0: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644, min: t_9f1c0644, max: t_9f1c0644) => ({
  type: "Vec3",
  x: hash_f2f2e188(v.x, min.x, max.x),
  y: hash_f2f2e188(v.y, min.y, max.y),
  z: hash_f2f2e188(v.z, min.z, max.z)
} as t_9f1c0644);

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
const sminCubic#e7c85424 = (a#:0: float#builtin, b#:1: float#builtin, k#:2: float#builtin): float#builtin ={}> {
    const h#:3 = max#builtin(k#:2 -#builtin abs#builtin(a#:0 -#builtin b#:1), 0.0) /#builtin k#:2;
    const sixth#:4 = 1.0 /#builtin 6.0;
    min#builtin(a#:0, b#:1) 
        -#builtin h#:3 *#builtin h#:3 *#builtin h#:3 *#builtin k#:2 *#builtin sixth#:4;
}
```
*/
export const hash_e7c85424: (arg_0: number, arg_1: number, arg_2: number) => number = (a: number, b: number, k: number) => {
  let h: number = max(k - abs(a - b), 0) / k;
  return min(a, b) - h * h * h * k * (1 / 6);
};

/**
```
const opRepLim#4e4607e8 = (p#:0: Vec3#9f1c0644, c#:1: float#builtin, l#:2: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    p#:0 
        -#8e58b954#b99b22d8#1 c#:1 
            *#44baf212#1de4e4c0#0 clamp#6954efc0(
                v: round#5089ef00(v: p#:0 /#8863b0ac#5ac12902#0 c#:1),
                min: NegVec3#52db783c."-"#3c2a4898#0(l#:2),
                max: l#:2,
            );
}
```
*/
export const hash_4e4607e8: (arg_0: t_9f1c0644, arg_1: number, arg_2: t_9f1c0644) => t_9f1c0644 = (p: t_9f1c0644, c: number, l: t_9f1c0644) => hash_8e58b954.hb99b22d8_1(p, hash_44baf212.h1de4e4c0_0(c, hash_6954efc0(hash_5089ef00(hash_8863b0ac.h5ac12902_0(p, c)), hash_52db783c.h3c2a4898_0(l), l)));

/**
```
const EPSILON#ec7f8d1c = 0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

/**
```
const sceneSDF#ebf8d27c = (iTime#:0: float#builtin, samplePoint#:1: Vec3#9f1c0644): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p2#:3 = samplePoint#:1 
        -#8e58b954#b99b22d8#1 Vec3#9f1c0644{
            x#43802a16#0: -sin#builtin(double#:2) /#builtin 2.0,
            y#43802a16#1: sin#builtin(iTime#:0 /#builtin 4.0) /#builtin 2.0,
            z#9f1c0644#0: cos#builtin(double#:2) /#builtin 2.0,
        };
    const p1#:4 = samplePoint#:1;
    const p2#:5 = opRepLim#4e4607e8(
        p: p2#:3,
        c: 0.1,
        l: Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
    );
    sminCubic#e7c85424(
        a: length#1e74e8e4(v: p1#:4) -#builtin 0.5,
        b: length#1e74e8e4(v: p2#:5) -#builtin 0.03,
        k: 0.1,
    );
}
```
*/
export const hash_ebf8d27c: (arg_0: number, arg_1: t_9f1c0644) => number = (iTime: number, samplePoint: t_9f1c0644) => {
  let double: number = iTime * 2;
  return hash_e7c85424(hash_1e74e8e4(samplePoint) - 0.5, hash_1e74e8e4(hash_4e4607e8(hash_8e58b954.hb99b22d8_1(samplePoint, ({
    type: "Vec3",
    x: -sin(double) / 2,
    y: sin(iTime / 4) / 2,
    z: cos(double) / 2
  } as t_9f1c0644)), 0.1, ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_9f1c0644))) - 0.03, 0.1);
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
const estimateNormal#9eebeda6 = (iTime#:0: float#builtin, p#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> normalize#d508ff52(
    v: Vec3#9f1c0644{
        x#43802a16#0: sceneSDF#ebf8d27c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    x#43802a16#0: p#:1.x#43802a16#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#ebf8d27c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    x#43802a16#0: p#:1.x#43802a16#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        y#43802a16#1: sceneSDF#ebf8d27c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    y#43802a16#1: p#:1.y#43802a16#1 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#ebf8d27c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    y#43802a16#1: p#:1.y#43802a16#1 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        z#9f1c0644#0: sceneSDF#ebf8d27c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    z#9f1c0644#0: p#:1.z#9f1c0644#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#ebf8d27c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    z#9f1c0644#0: p#:1.z#9f1c0644#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
    },
)
```
*/
export const hash_9eebeda6: (arg_0: number, arg_1: t_9f1c0644) => t_9f1c0644 = (iTime: number, p$1: t_9f1c0644) => hash_d508ff52(({
  type: "Vec3",
  x: hash_ebf8d27c(iTime, ({ ...p$1,
    type: "Vec3",
    x: p$1.x + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_ebf8d27c(iTime, ({ ...p$1,
    type: "Vec3",
    x: p$1.x - hash_ec7f8d1c
  } as t_9f1c0644)),
  y: hash_ebf8d27c(iTime, ({ ...p$1,
    type: "Vec3",
    y: p$1.y + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_ebf8d27c(iTime, ({ ...p$1,
    type: "Vec3",
    y: p$1.y - hash_ec7f8d1c
  } as t_9f1c0644)),
  z: hash_ebf8d27c(iTime, ({ ...p$1,
    type: "Vec3",
    z: p$1.z + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_ebf8d27c(iTime, ({ ...p$1,
    type: "Vec3",
    z: p$1.z - hash_ec7f8d1c
  } as t_9f1c0644))
} as t_9f1c0644));

/**
```
const vec3#5808ec54 = (v#:0: Vec2#43802a16, z#:1: float#builtin): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    ...v#:0,
    z#9f1c0644#0: z#:1,
}
```
*/
export const hash_5808ec54: (arg_0: t_43802a16, arg_1: number) => t_9f1c0644 = (v: t_43802a16, z: number) => ({ ...v,
  type: "Vec3",
  z: z
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
const white#0678f03c = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0}
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
const isPointingTowardLight#7d296043 = (
    iTime#:0: float#builtin,
    p#:1: Vec3#9f1c0644,
    lightPos#:2: Vec3#9f1c0644,
): bool#builtin ={}> {
    const N#:3 = estimateNormal#9eebeda6(iTime#:0, p#:1);
    const L#:4 = normalize#d508ff52(v: lightPos#:2 -#8e58b954#b99b22d8#1 p#:1);
    const dotLN#:5 = dot#e17ea18c(a: L#:4, b: N#:3);
    dotLN#:5 >=#builtin 0.0;
}
```
*/
export const hash_7d296043: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => boolean = (iTime: number, p$1: t_9f1c0644, lightPos: t_9f1c0644) => hash_e17ea18c(hash_d508ff52(hash_8e58b954.hb99b22d8_1(lightPos, p$1)), hash_9eebeda6(iTime, p$1)) >= 0;

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
const rec shortestDistanceToSurface#664431aa = (
    iTime#:0: float#builtin,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float#builtin,
    end#:4: float#builtin,
    stepsLeft#:5: int#builtin,
): float#builtin ={}> {
    if stepsLeft#:5 <=#builtin 0 {
        end#:4;
    } else {
        const dist#:6 = sceneSDF#ebf8d27c(
            iTime#:0,
            samplePoint: eye#:1 
                +#8e58b954#b99b22d8#0 start#:3 *#44baf212#1de4e4c0#0 marchingDirection#:2,
        );
        if dist#:6 <#builtin EPSILON#ec7f8d1c {
            start#:3;
        } else {
            const depth#:7 = start#:3 +#builtin dist#:6;
            if depth#:7 >=#builtin end#:4 {
                end#:4;
            } else {
                664431aa#self(
                    iTime#:0,
                    eye#:1,
                    marchingDirection#:2,
                    depth#:7,
                    end#:4,
                    stepsLeft#:5 -#builtin 1,
                );
            };
        };
    };
}
```
*/
export const hash_664431aa: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: number, arg_5: number) => number = (iTime: number, eye: t_9f1c0644, marchingDirection: t_9f1c0644, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = hash_ebf8d27c(iTime, hash_8e58b954.hb99b22d8_0(eye, hash_44baf212.h1de4e4c0_0(start, marchingDirection)));

    if (dist < hash_ec7f8d1c) {
      return start;
    } else {
      let depth: number = start + dist;

      if (depth >= end) {
        return end;
      } else {
        start = depth;
        continue;
      }
    }
  }

  return end;
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
export const hash_09636498: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_9f1c0644 = (fieldOfView: number, size: t_43802a16, fragCoord: t_43802a16) => hash_d508ff52(hash_5808ec54(hash_057d15c6.hb99b22d8_1(fragCoord, hash_5e752e2e.h5ac12902_0(size, 2)), -(size.y / tan(hash_dabe7f9c(fieldOfView) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const dot#f921b900 = (a#:0: Vec2#43802a16, b#:1: Vec2#43802a16): float#builtin ={}> {
    a#:0.x#43802a16#0 *#builtin b#:1.x#43802a16#0 
        +#builtin a#:0.y#43802a16#1 *#builtin b#:1.y#43802a16#1;
}
```
*/
export const hash_f921b900: (arg_0: t_43802a16, arg_1: t_43802a16) => number = (a: t_43802a16, b: t_43802a16) => a.x * b.x + a.y * b.y;

/**
```
const fract#495c4d22 = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const Scale4#ca1bf164 = Div#5ac12902<Vec4#3b941378, float#builtin, Vec4#3b941378>{
    "/"#5ac12902#0: (v#:0: Vec4#3b941378, scale#:1: float#builtin): Vec4#3b941378 ={}> Vec4#3b941378{
        z#9f1c0644#0: v#:0.z#9f1c0644#0 /#builtin scale#:1,
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1,
        w#3b941378#0: v#:0.w#3b941378#0 /#builtin scale#:1,
    },
}
```
*/
export const hash_ca1bf164: t_5ac12902<t_3b941378, number, t_3b941378> = ({
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
const fishingBoueys#203612ff = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
): Vec4#3b941378 ={}> {
    const dir#:3 = rayDirection#09636498(fieldOfView: 45.0, size: iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#664431aa(
        iTime#:0,
        eye#:4,
        marchingDirection: dir#:3,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    const light#:6 = 0.2;
    if dist#:5 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c {
        Vec4#3b941378{
            z#9f1c0644#0: 0.0,
            x#43802a16#0: 0.0,
            y#43802a16#1: 0.0,
            w#3b941378#0: 1.0,
        };
    } else {
        const worldPosForPixel#:7 = eye#:4 
            +#8e58b954#b99b22d8#0 dist#:5 *#44baf212#1de4e4c0#0 dir#:3;
        const K_a#:8 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:9 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:10 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:11 = 10.0;
        const light1Pos#:12 = Vec3#9f1c0644{
            x#43802a16#0: 10.0 *#builtin sin#builtin(iTime#:0),
            y#43802a16#1: 10.0 *#builtin cos#builtin(iTime#:0),
            z#9f1c0644#0: 5.0,
        };
        const toLight#:13 = light1Pos#:12 -#8e58b954#b99b22d8#1 worldPosForPixel#:7;
        if isPointingTowardLight#7d296043(iTime#:0, p: worldPosForPixel#:7, lightPos: light1Pos#:12) {
            const marchToLight#:14 = shortestDistanceToSurface#664431aa(
                iTime#:0,
                eye: light1Pos#:12,
                marchingDirection: -1.0 *#44baf212#1de4e4c0#0 normalize#d508ff52(v: toLight#:13),
                start: MIN_DIST#f2cd39b8,
                end: MAX_DIST#0ce717e6,
                stepsLeft: MAX_MARCHING_STEPS#62404440,
            );
            if marchToLight#:14 
                >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c *#builtin 10.0 {
                Vec4#3b941378{...white#0678f03c *#42016d26#1de4e4c0#0 light#:6, w#3b941378#0: 1.0};
            } else {
                const offset#:15 = marchToLight#:14 -#builtin length#1e74e8e4(v: toLight#:13);
                const penumbra#:16 = 0.1;
                if offset#:15 <#builtin -EPSILON#ec7f8d1c *#builtin 1000.0 {
                    Vec4#3b941378{
                        ...white#0678f03c *#42016d26#1de4e4c0#0 light#:6,
                        w#3b941378#0: 1.0,
                    };
                } else {
                    Vec4#3b941378{...white#0678f03c, w#3b941378#0: 1.0};
                };
            };
        } else {
            Vec4#3b941378{...white#0678f03c *#42016d26#1de4e4c0#0 light#:6, w#3b941378#0: 1.0};
        };
    };
}
```
*/
export const hash_203612ff: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_3b941378 = (iTime: number, fragCoord$1: t_43802a16, iResolution: t_43802a16) => {
  let dir: t_9f1c0644 = hash_09636498(45, iResolution, fragCoord$1);
  let eye$4: t_9f1c0644 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_9f1c0644);
  let dist$5: number = hash_664431aa(iTime, eye$4, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$5 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_3b941378);
  } else {
    let worldPosForPixel: t_9f1c0644 = hash_8e58b954.hb99b22d8_0(eye$4, hash_44baf212.h1de4e4c0_0(dist$5, dir));
    let light1Pos: t_9f1c0644 = ({
      type: "Vec3",
      x: 10 * sin(iTime),
      y: 10 * cos(iTime),
      z: 5
    } as t_9f1c0644);
    let toLight: t_9f1c0644 = hash_8e58b954.hb99b22d8_1(light1Pos, worldPosForPixel);

    if (hash_7d296043(iTime, worldPosForPixel, light1Pos)) {
      let marchToLight: number = hash_664431aa(iTime, light1Pos, hash_44baf212.h1de4e4c0_0(-1, hash_d508ff52(toLight)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

      if (marchToLight > hash_0ce717e6 - hash_ec7f8d1c * 10) {
        return ({ ...hash_42016d26.h1de4e4c0_0(hash_0678f03c, 0.2),
          type: "Vec4",
          w: 1
        } as t_3b941378);
      } else {
        if (marchToLight - hash_1e74e8e4(toLight) < -hash_ec7f8d1c * 1000) {
          return ({ ...hash_42016d26.h1de4e4c0_0(hash_0678f03c, 0.2),
            type: "Vec4",
            w: 1
          } as t_3b941378);
        } else {
          return ({ ...hash_0678f03c,
            type: "Vec4",
            w: 1
          } as t_3b941378);
        }
      }
    } else {
      return ({ ...hash_42016d26.h1de4e4c0_0(hash_0678f03c, 0.2),
        type: "Vec4",
        w: 1
      } as t_3b941378);
    }
  }
};

/**
```
const red#7d188c3c = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0}
```
*/
export const hash_7d188c3c: t_9f1c0644 = ({
  type: "Vec3",
  x: 1,
  y: 0,
  z: 0
} as t_9f1c0644);

/**
```
const AddSubVec4#de950816 = AddSub#b99b22d8<Vec4#3b941378, Vec4#3b941378, Vec4#3b941378>{
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
export const hash_de950816: t_b99b22d8<t_3b941378, t_3b941378, t_3b941378> = ({
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
const MulVec2#1899d36e = Div#5ac12902<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1.x#43802a16#0,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1.y#43802a16#1,
    },
}
```
*/
export const hash_1899d36e: t_5ac12902<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale: t_43802a16) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const random#549aecf7 = (st#:0: Vec2#43802a16): float#builtin ={}> {
    fract#495c4d22(
        v: sin#builtin(
                dot#f921b900(
                    a: st#:0,
                    b: Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
```
*/
export const hash_549aecf7: (arg_0: t_43802a16) => number = (st: t_43802a16) => hash_495c4d22(sin(hash_f921b900(st, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_43802a16))) * 43758.5453123);

/**
```
const round#0ebdc097 = (v#:0: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
    x#43802a16#0: round#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: round#builtin(v#:0.y#43802a16#1),
}
```
*/
export const hash_0ebdc097: (arg_0: t_43802a16) => t_43802a16 = (v: t_43802a16) => ({
  type: "Vec2",
  x: round(v.x),
  y: round(v.y)
} as t_43802a16);

/**
```
const Vec2float#6c0f88c5 = Mul#1de4e4c0<Vec2#43802a16, float#builtin, Vec2#43802a16>{
    "*"#1de4e4c0#0: (v#:0: Vec2#43802a16, scale#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 *#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 *#builtin scale#:1,
    },
}
```
*/
export const hash_6c0f88c5: t_1de4e4c0<t_43802a16, number, t_43802a16> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (v: t_43802a16, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_43802a16)
} as t_1de4e4c0<t_43802a16, number, t_43802a16>);

/**
```
const randFolks#66399436 = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const scale#:2 = 14.0;
    const small#:3 = round#0ebdc097(v: fragCoord#:1 /#5e752e2e#5ac12902#0 scale#:2) 
        *#6c0f88c5#1de4e4c0#0 scale#:2;
    const small#:4 = Vec2#43802a16{
        x#43802a16#0: small#:3.x#43802a16#0,
        y#43802a16#1: small#:3.y#43802a16#1 +#builtin env#:0.time#451d5252#0,
    };
    const v#:5 = random#549aecf7(st: small#:4 /#1899d36e#5ac12902#0 env#:0.resolution#451d5252#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const two#:6 = Vec4#3b941378{...red#7d188c3c *#42016d26#1de4e4c0#0 v#:5, w#3b941378#0: 1.0} 
        +#de950816#b99b22d8#0 fishingBoueys#203612ff(
            iTime: env#:0.time#451d5252#0,
            fragCoord#:1,
            iResolution: env#:0.resolution#451d5252#1,
        );
    two#:6 /#ca1bf164#5ac12902#0 2.0;
}
```
*/
export const hash_66399436: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = (env: t_451d5252, fragCoord$1: t_43802a16) => {
  let small: t_43802a16 = hash_6c0f88c5.h1de4e4c0_0(hash_0ebdc097(hash_5e752e2e.h5ac12902_0(fragCoord$1, 14)), 14);
  return hash_ca1bf164.h5ac12902_0(hash_de950816.hb99b22d8_0(({ ...hash_42016d26.h1de4e4c0_0(hash_7d188c3c, hash_549aecf7(hash_1899d36e.h5ac12902_0(({
      type: "Vec2",
      x: small.x,
      y: small.y + env.time
    } as t_43802a16), env.resolution)) / 10 + 0.9),
    type: "Vec4",
    w: 1
  } as t_3b941378), hash_203612ff(env.time, fragCoord$1, env.resolution)), 2);
};
export const randFolks = hash_66399436;