import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
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
const length#63e16b7a = (v#:0: Vec3#9f1c0644): float ={}> sqrt(
    v#:0.x#43802a16#0 * v#:0.x#43802a16#0 + v#:0.y#43802a16#1 * v#:0.y#43802a16#1 + v#:0.z#9f1c0644#0 * v#:0.z#9f1c0644#0,
)
```
*/
export const hash_63e16b7a: (arg_0: t_9f1c0644) => number = (v: t_9f1c0644) => sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/**
```
const ScaleVec3Rev#68f73ad4 = Div#5ac12902<Vec3#9f1c0644, float, Vec3#9f1c0644>{
    "/"#5ac12902#0: (v#:0: Vec3#9f1c0644, scale#:1: float): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:0.x#43802a16#0 / scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 / scale#:1,
        z#9f1c0644#0: v#:0.z#9f1c0644#0 / scale#:1,
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
const dot#255c39c3 = (a#:0: Vec3#9f1c0644, b#:1: Vec3#9f1c0644): float ={}> {
    a#:0.x#43802a16#0 * b#:1.x#43802a16#0 + a#:0.y#43802a16#1 * b#:1.y#43802a16#1 + a#:0.z#9f1c0644#0 * b#:1.z#9f1c0644#0;
}
```
*/
export const hash_255c39c3: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (a: t_9f1c0644, b: t_9f1c0644) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
```
const ScaleVec3#c4a91006 = Mul#1de4e4c0<float, Vec3#9f1c0644, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (scale#:0: float, v#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:1.x#43802a16#0 * scale#:0,
        y#43802a16#1: v#:1.y#43802a16#1 * scale#:0,
        z#9f1c0644#0: v#:1.z#9f1c0644#0 * scale#:0,
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
const AddSubVec3#1c6fdd91 = AddSub#b99b22d8<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644>{
    "+"#b99b22d8#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: one#:0.x#43802a16#0 + two#:1.x#43802a16#0,
        y#43802a16#1: one#:0.y#43802a16#1 + two#:1.y#43802a16#1,
        z#9f1c0644#0: one#:0.z#9f1c0644#0 + two#:1.z#9f1c0644#0,
    },
    "-"#b99b22d8#1: (one#:2: Vec3#9f1c0644, two#:3: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: one#:2.x#43802a16#0 - two#:3.x#43802a16#0,
        y#43802a16#1: one#:2.y#43802a16#1 - two#:3.y#43802a16#1,
        z#9f1c0644#0: one#:2.z#9f1c0644#0 - two#:3.z#9f1c0644#0,
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
const EPSILON#ec7f8d1c = 0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

/**
```
const normalize#48e6ea27 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> v#:0 /#68f73ad4#5ac12902#0 length#63e16b7a(
    v#:0,
)
```
*/
export const hash_48e6ea27: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => hash_68f73ad4.h5ac12902_0(v, hash_63e16b7a(v));

/**
```
const clamp#f2f2e188 = (v#:0: float, minv#:1: float, maxv#:2: float): float ={}> max(
    min(v#:0, maxv#:2),
    minv#:1,
)
```
*/
export const hash_f2f2e188: (arg_0: number, arg_1: number, arg_2: number) => number = (v: number, minv: number, maxv: number) => max(min(v, maxv), minv);

/**
```
const MulVec3#73d73040 = Mul#1de4e4c0<Vec3#9f1c0644, Vec3#9f1c0644, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: one#:0.x#43802a16#0 * two#:1.x#43802a16#0,
        y#43802a16#1: one#:0.y#43802a16#1 * two#:1.y#43802a16#1,
        z#9f1c0644#0: one#:0.z#9f1c0644#0 * two#:1.z#9f1c0644#0,
    },
}
```
*/
export const hash_73d73040: t_1de4e4c0<t_9f1c0644, t_9f1c0644, t_9f1c0644> = ({
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
const ScaleVec3_#1d31aa6e = Mul#1de4e4c0<Vec3#9f1c0644, float, Vec3#9f1c0644>{
    "*"#1de4e4c0#0: (v#:0: Vec3#9f1c0644, scale#:1: float): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
        x#43802a16#0: v#:0.x#43802a16#0 * scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 * scale#:1,
        z#9f1c0644#0: v#:0.z#9f1c0644#0 * scale#:1,
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
const reflect#a6961410 = (I#:0: Vec3#9f1c0644, N#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    I#:0 -#1c6fdd91#b99b22d8#1 2.0 * dot#255c39c3(N#:1, I#:0) *#c4a91006#1de4e4c0#0 N#:1;
}
```
*/
export const hash_a6961410: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => t_9f1c0644 = (I: t_9f1c0644, N: t_9f1c0644) => hash_1c6fdd91.hb99b22d8_1(I, hash_c4a91006.h1de4e4c0_0(2 * hash_255c39c3(N, I), N));

/**
```
const estimateNormal#6700be1f = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    p#:2: Vec3#9f1c0644,
): Vec3#9f1c0644 ={}> normalize#48e6ea27(
    Vec3#9f1c0644{
        x#43802a16#0: sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, x#43802a16#0: p#:2.x#43802a16#0 + EPSILON#ec7f8d1c},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, x#43802a16#0: p#:2.x#43802a16#0 - EPSILON#ec7f8d1c},
        ),
        y#43802a16#1: sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, y#43802a16#1: p#:2.y#43802a16#1 + EPSILON#ec7f8d1c},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, y#43802a16#1: p#:2.y#43802a16#1 - EPSILON#ec7f8d1c},
        ),
        z#9f1c0644#0: sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, z#9f1c0644#0: p#:2.z#9f1c0644#0 + EPSILON#ec7f8d1c},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#9f1c0644{...p#:2, z#9f1c0644#0: p#:2.z#9f1c0644#0 - EPSILON#ec7f8d1c},
        ),
    },
)
```
*/
export const hash_6700be1f: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644) => t_9f1c0644 = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, p: t_9f1c0644) => hash_48e6ea27(({
  type: "Vec3",
  x: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    x: p.x + hash_ec7f8d1c
  } as t_9f1c0644)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    x: p.x - hash_ec7f8d1c
  } as t_9f1c0644)),
  y: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    y: p.y + hash_ec7f8d1c
  } as t_9f1c0644)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    y: p.y - hash_ec7f8d1c
  } as t_9f1c0644)),
  z: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    z: p.z + hash_ec7f8d1c
  } as t_9f1c0644)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    z: p.z - hash_ec7f8d1c
  } as t_9f1c0644))
} as t_9f1c0644));

/**
```
const round#65acfcda = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: round(v#:0.x#43802a16#0),
    y#43802a16#1: round(v#:0.y#43802a16#1),
    z#9f1c0644#0: round(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_65acfcda: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: round(v.x),
  y: round(v.y),
  z: round(v.z)
} as t_9f1c0644);

/**
```
const clamp#5483fdc2 = (v#:0: Vec3#9f1c0644, min#:1: Vec3#9f1c0644, max#:2: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: clamp#f2f2e188(v#:0.x#43802a16#0, min#:1.x#43802a16#0, max#:2.x#43802a16#0),
    y#43802a16#1: clamp#f2f2e188(v#:0.y#43802a16#1, min#:1.y#43802a16#1, max#:2.y#43802a16#1),
    z#9f1c0644#0: clamp#f2f2e188(v#:0.z#9f1c0644#0, min#:1.z#9f1c0644#0, max#:2.z#9f1c0644#0),
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
const phongContribForLight#61e7f2ba = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    k_d#:2: Vec3#9f1c0644,
    k_s#:3: Vec3#9f1c0644,
    alpha#:4: float,
    p#:5: Vec3#9f1c0644,
    eye#:6: Vec3#9f1c0644,
    lightPos#:7: Vec3#9f1c0644,
    lightIntensity#:8: Vec3#9f1c0644,
): Vec3#9f1c0644 ={}> {
    const N#:9 = estimateNormal#6700be1f(sceneSDF#:0, iTime#:1, p#:5);
    const L#:10 = normalize#48e6ea27(lightPos#:7 -#1c6fdd91#b99b22d8#1 p#:5);
    const V#:11 = normalize#48e6ea27(eye#:6 -#1c6fdd91#b99b22d8#1 p#:5);
    const R#:12 = normalize#48e6ea27(reflect#a6961410(NegVec3#a5cd53ce."-"#3c2a4898#0(L#:10), N#:9));
    const dotLN#:13 = dot#255c39c3(L#:10, N#:9);
    if dotLN#:13 < 0.0 {
        Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0};
    } else {
        const dotRV#:14 = dot#255c39c3(R#:12, V#:11);
        if dotRV#:14 < 0.0 {
            const m#:15 = k_d#:2 *#1d31aa6e#1de4e4c0#0 dotLN#:13;
            lightIntensity#:8 *#73d73040#1de4e4c0#0 m#:15;
        } else {
            const m#:16 = k_d#:2 *#1d31aa6e#1de4e4c0#0 dotLN#:13 +#1c6fdd91#b99b22d8#0 k_s#:3 *#1d31aa6e#1de4e4c0#0 pow(
                dotRV#:14,
                alpha#:4,
            );
            lightIntensity#:8 *#73d73040#1de4e4c0#0 m#:16;
        };
    };
}
```
*/
export const hash_61e7f2ba: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: t_9f1c0644, arg_6: t_9f1c0644, arg_7: t_9f1c0644, arg_8: t_9f1c0644) => t_9f1c0644 = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, k_d: t_9f1c0644, k_s: t_9f1c0644, alpha: number, p$5: t_9f1c0644, eye: t_9f1c0644, lightPos: t_9f1c0644, lightIntensity: t_9f1c0644) => {
  let N$9: t_9f1c0644 = hash_6700be1f(sceneSDF, iTime, p$5);
  let L: t_9f1c0644 = hash_48e6ea27(hash_1c6fdd91.hb99b22d8_1(lightPos, p$5));
  let dotLN: number = hash_255c39c3(L, N$9);

  if (dotLN < 0) {
    return ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: 0
    } as t_9f1c0644);
  } else {
    let dotRV: number = hash_255c39c3(hash_48e6ea27(hash_a6961410(hash_a5cd53ce.h3c2a4898_0(L), N$9)), hash_48e6ea27(hash_1c6fdd91.hb99b22d8_1(eye, p$5)));

    if (dotRV < 0) {
      return hash_73d73040.h1de4e4c0_0(lightIntensity, hash_1d31aa6e.h1de4e4c0_0(k_d, dotLN));
    } else {
      return hash_73d73040.h1de4e4c0_0(lightIntensity, hash_1c6fdd91.hb99b22d8_0(hash_1d31aa6e.h1de4e4c0_0(k_d, dotLN), hash_1d31aa6e.h1de4e4c0_0(k_s, pow(dotRV, alpha))));
    }
  }
};

/**
```
const vec3#5808ec54 = (v#:0: Vec2#43802a16, z#:1: float): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
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
const radians#dabe7f9c = (degrees#:0: float): float ={}> degrees#:0 / 180.0 * PI
```
*/
export const hash_dabe7f9c: (arg_0: number) => number = (degrees: number) => degrees / 180 * PI;

/**
```
const ScaleVec2Rev#afc24bbe = Div#5ac12902<Vec2#43802a16, float, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: float): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 / scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 / scale#:1,
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
        x#43802a16#0: one#:0.x#43802a16#0 + two#:1.x#43802a16#0,
        y#43802a16#1: one#:0.y#43802a16#1 + two#:1.y#43802a16#1,
    },
    "-"#b99b22d8#1: (one#:2: Vec2#43802a16, two#:3: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: one#:2.x#43802a16#0 - two#:3.x#43802a16#0,
        y#43802a16#1: one#:2.y#43802a16#1 - two#:3.y#43802a16#1,
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
const abs#1a074578 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
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
const max#3af3fc3c = (v#:0: Vec3#9f1c0644): float ={}> {
    max(max(v#:0.x#43802a16#0, v#:0.y#43802a16#1), v#:0.z#9f1c0644#0);
}
```
*/
export const hash_3af3fc3c: (arg_0: t_9f1c0644) => number = (v: t_9f1c0644) => max(max(v.x, v.y), v.z);

/**
```
const opRepLim#cffec7f4 = (p#:0: Vec3#9f1c0644, c#:1: float, l#:2: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    p#:0 -#1c6fdd91#b99b22d8#1 c#:1 *#c4a91006#1de4e4c0#0 clamp#5483fdc2(
        round#65acfcda(p#:0 /#68f73ad4#5ac12902#0 c#:1),
        NegVec3#a5cd53ce."-"#3c2a4898#0(l#:2),
        l#:2,
    );
}
```
*/
export const hash_cffec7f4: (arg_0: t_9f1c0644, arg_1: number, arg_2: t_9f1c0644) => t_9f1c0644 = (p$0: t_9f1c0644, c: number, l: t_9f1c0644) => hash_1c6fdd91.hb99b22d8_1(p$0, hash_c4a91006.h1de4e4c0_0(c, hash_5483fdc2(hash_65acfcda(hash_68f73ad4.h5ac12902_0(p$0, c)), hash_a5cd53ce.h3c2a4898_0(l), l)));

/**
```
const phongIllumination#22d47860 = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    k_a#:2: Vec3#9f1c0644,
    k_d#:3: Vec3#9f1c0644,
    k_s#:4: Vec3#9f1c0644,
    alpha#:5: float,
    p#:6: Vec3#9f1c0644,
    eye#:7: Vec3#9f1c0644,
): Vec3#9f1c0644 ={}> {
    const ambientLight#:8 = 0.5 *#c4a91006#1de4e4c0#0 Vec3#9f1c0644{
        x#43802a16#0: 1.0,
        y#43802a16#1: 1.0,
        z#9f1c0644#0: 1.0,
    };
    const color#:9 = ambientLight#:8 *#73d73040#1de4e4c0#0 k_a#:2;
    const light1Pos#:10 = Vec3#9f1c0644{
        x#43802a16#0: 4.0 * sin(iTime#:1),
        y#43802a16#1: 2.0,
        z#9f1c0644#0: 4.0 * cos(iTime#:1),
    };
    const light1Intensity#:11 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:12 = color#:9 +#1c6fdd91#b99b22d8#0 phongContribForLight#61e7f2ba(
        sceneSDF#:0,
        iTime#:1,
        k_d#:3,
        k_s#:4,
        alpha#:5,
        p#:6,
        eye#:7,
        light1Pos#:10,
        light1Intensity#:11,
    );
    const light2Pos#:13 = Vec3#9f1c0644{
        x#43802a16#0: 2.0 * sin(0.37 * iTime#:1),
        y#43802a16#1: 2.0 * cos(0.37 * iTime#:1),
        z#9f1c0644#0: 2.0,
    };
    const light2Intensity#:14 = Vec3#9f1c0644{
        x#43802a16#0: 0.4,
        y#43802a16#1: 0.4,
        z#9f1c0644#0: 0.4,
    };
    const color#:15 = color#:12 +#1c6fdd91#b99b22d8#0 phongContribForLight#61e7f2ba(
        sceneSDF#:0,
        iTime#:1,
        k_d#:3,
        k_s#:4,
        alpha#:5,
        p#:6,
        eye#:7,
        light2Pos#:13,
        light2Intensity#:14,
    );
    color#:15;
}
```
*/
export const hash_22d47860: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: t_9f1c0644, arg_5: number, arg_6: t_9f1c0644, arg_7: t_9f1c0644) => t_9f1c0644 = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, k_a: t_9f1c0644, k_d$3: t_9f1c0644, k_s$4: t_9f1c0644, alpha$5: number, p$6: t_9f1c0644, eye$7: t_9f1c0644) => hash_1c6fdd91.hb99b22d8_0(hash_1c6fdd91.hb99b22d8_0(hash_73d73040.h1de4e4c0_0(hash_c4a91006.h1de4e4c0_0(0.5, ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_9f1c0644)), k_a), hash_61e7f2ba(sceneSDF, iTime, k_d$3, k_s$4, alpha$5, p$6, eye$7, ({
  type: "Vec3",
  x: 4 * sin(iTime),
  y: 2,
  z: 4 * cos(iTime)
} as t_9f1c0644), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_9f1c0644))), hash_61e7f2ba(sceneSDF, iTime, k_d$3, k_s$4, alpha$5, p$6, eye$7, ({
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
const vec3#dc78826c = (x#:0: float): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: x#:0,
    y#43802a16#1: x#:0,
    z#9f1c0644#0: x#:0,
}
```
*/
export const hash_dc78826c: (arg_0: number) => t_9f1c0644 = (x: number) => ({
  type: "Vec3",
  x: x,
  y: x,
  z: x
} as t_9f1c0644);

/**
```
const vec4#b00b79a0 = (v#:0: Vec3#9f1c0644, w#:1: float): Vec4#3b941378 ={}> Vec4#3b941378{
    ...v#:0,
    w#3b941378#0: w#:1,
}
```
*/
export const hash_b00b79a0: (arg_0: t_9f1c0644, arg_1: number) => t_3b941378 = (v: t_9f1c0644, w: number) => ({ ...v,
  type: "Vec4",
  w: w
} as t_3b941378);

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
const rayDirection#6258178a = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
): Vec3#9f1c0644 ={}> {
    const xy#:3 = fragCoord#:2 -#70bb2056#b99b22d8#1 size#:1 /#afc24bbe#5ac12902#0 2.0;
    const z#:4 = size#:1.y#43802a16#1 / tan(radians#dabe7f9c(fieldOfView#:0) / 2.0);
    normalize#48e6ea27(vec3#5808ec54(xy#:3, -z#:4));
}
```
*/
export const hash_6258178a: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_9f1c0644 = (fieldOfView: number, size: t_43802a16, fragCoord: t_43802a16) => hash_48e6ea27(hash_5808ec54(hash_70bb2056.hb99b22d8_1(fragCoord, hash_afc24bbe.h5ac12902_0(size, 2)), -(size.y / tan(hash_dabe7f9c(fieldOfView) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const rec shortestDistanceToSurface#56314282 = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    eye#:2: Vec3#9f1c0644,
    marchingDirection#:3: Vec3#9f1c0644,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
): float ={}> {
    if stepsLeft#:6 <= 0 {
        end#:5;
    } else {
        const dist#:7 = sceneSDF#:0(
            iTime#:1,
            eye#:2 +#1c6fdd91#b99b22d8#0 start#:4 *#c4a91006#1de4e4c0#0 marchingDirection#:3,
        );
        if dist#:7 < EPSILON#ec7f8d1c {
            start#:4;
        } else {
            const depth#:8 = start#:4 + dist#:7;
            if depth#:8 >= end#:5 {
                end#:5;
            } else {
                56314282#self(
                    sceneSDF#:0,
                    iTime#:1,
                    eye#:2,
                    marchingDirection#:3,
                    depth#:8,
                    end#:5,
                    stepsLeft#:6 - 1,
                );
            };
        };
    };
}
```
*/
export const hash_56314282: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, eye$2: t_9f1c0644, marchingDirection: t_9f1c0644, start: number, end: number, stepsLeft: number) => {
  while (true) {
    if (stepsLeft <= 0) {
      return end;
    } else {
      let dist: number = sceneSDF(iTime, hash_1c6fdd91.hb99b22d8_0(eye$2, hash_c4a91006.h1de4e4c0_0(start, marchingDirection)));

      if (dist < hash_ec7f8d1c) {
        return start;
      } else {
        let depth: number = start + dist;

        if (depth >= end) {
          return end;
        } else {
          start = depth;
          stepsLeft = stepsLeft - 1;
          continue;
        }
      }
    }
  }
};

/**
```
const dot#369652bb = (a#:0: Vec2#43802a16, b#:1: Vec2#43802a16): float ={}> {
    a#:0.x#43802a16#0 * b#:1.x#43802a16#0 + a#:0.y#43802a16#1 * b#:1.y#43802a16#1;
}
```
*/
export const hash_369652bb: (arg_0: t_43802a16, arg_1: t_43802a16) => number = (a: t_43802a16, b: t_43802a16) => a.x * b.x + a.y * b.y;

/**
```
const fract#495c4d22 = (v#:0: float): float ={}> v#:0 - floor(v#:0)
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const sceneSDF#c6d72c68 = (iTime#:0: float, samplePoint#:1: Vec3#9f1c0644): float ={}> {
    const double#:2 = iTime#:0 * 2.0;
    const p1#:3 = opRepLim#cffec7f4(
        samplePoint#:1,
        0.25,
        Vec3#9f1c0644{x#43802a16#0: 2.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
    );
    min(
        max(
            max#3af3fc3c(
                abs#1a074578(p1#:3) -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                    x#43802a16#0: 0.1,
                    y#43802a16#1: 0.3,
                    z#9f1c0644#0: 0.6,
                },
            ),
            -max#3af3fc3c(
                abs#1a074578(p1#:3) -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                    x#43802a16#0: 0.11,
                    y#43802a16#1: 0.2,
                    z#9f1c0644#0: 0.55,
                },
            ),
        ),
        max#3af3fc3c(
            abs#1a074578(
                samplePoint#:1 -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                    x#43802a16#0: 0.0,
                    y#43802a16#1: 1.0,
                    z#9f1c0644#0: -0.1,
                },
            ) -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                x#43802a16#0: 2.1,
                y#43802a16#1: 0.1,
                z#9f1c0644#0: 2.1,
            },
        ),
    );
}
```
*/
export const hash_c6d72c68: (arg_0: number, arg_1: t_9f1c0644) => number = (iTime$0: number, samplePoint: t_9f1c0644) => {
  let p1: t_9f1c0644 = hash_cffec7f4(samplePoint, 0.25, ({
    type: "Vec3",
    x: 2,
    y: 0,
    z: 0
  } as t_9f1c0644));
  return min(max(hash_3af3fc3c(hash_1c6fdd91.hb99b22d8_1(hash_1a074578(p1), ({
    type: "Vec3",
    x: 0.1,
    y: 0.3,
    z: 0.6
  } as t_9f1c0644))), -hash_3af3fc3c(hash_1c6fdd91.hb99b22d8_1(hash_1a074578(p1), ({
    type: "Vec3",
    x: 0.11,
    y: 0.2,
    z: 0.55
  } as t_9f1c0644)))), hash_3af3fc3c(hash_1c6fdd91.hb99b22d8_1(hash_1a074578(hash_1c6fdd91.hb99b22d8_1(samplePoint, ({
    type: "Vec3",
    x: 0,
    y: 1,
    z: -0.1
  } as t_9f1c0644))), ({
    type: "Vec3",
    x: 2.1,
    y: 0.1,
    z: 2.1
  } as t_9f1c0644))));
};

/**
```
const phongLit#528645fb = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    env#:1: GLSLEnv#451d5252,
    fragCoord#:2: Vec2#43802a16,
): Vec4#3b941378 ={}> {
    const dir#:3 = rayDirection#6258178a(45.0, env#:1.resolution#451d5252#1, fragCoord#:2);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#56314282(
        sceneSDF#:0,
        env#:1.time#451d5252#0,
        eye#:4,
        dir#:3,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    if dist#:5 > MAX_DIST#0ce717e6 - EPSILON#ec7f8d1c {
        vec4#b00b79a0(vec3#dc78826c(0.0), 1.0);
    } else {
        const worldPosForPixel#:6 = eye#:4 +#1c6fdd91#b99b22d8#0 dist#:5 *#c4a91006#1de4e4c0#0 dir#:3;
        const K_a#:7 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:8 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:9 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:10 = 10.0;
        const color#:11 = phongIllumination#22d47860(
            sceneSDF#:0,
            env#:1.time#451d5252#0,
            K_a#:7,
            K_d#:8,
            K_s#:9,
            shininess#:10,
            worldPosForPixel#:6,
            eye#:4,
        );
        Vec4#3b941378{...color#:11, w#3b941378#0: 1.0};
    };
}
```
*/
export const hash_528645fb: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: t_451d5252, arg_2: t_43802a16) => t_3b941378 = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, env: t_451d5252, fragCoord: t_43802a16) => {
  let dir: t_9f1c0644 = hash_6258178a(45, env.resolution, fragCoord);
  let eye$4: t_9f1c0644 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_9f1c0644);
  let dist$5: number = hash_56314282(sceneSDF, env.time, eye$4, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$5 > hash_0ce717e6 - hash_ec7f8d1c) {
    return hash_b00b79a0(hash_dc78826c(0), 1);
  } else {
    return ({ ...hash_22d47860(sceneSDF, env.time, ({
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
      } as t_9f1c0644), 10, hash_1c6fdd91.hb99b22d8_0(eye$4, hash_c4a91006.h1de4e4c0_0(dist$5, dir)), eye$4),
      type: "Vec4",
      w: 1
    } as t_3b941378);
  }
};

/**
```
const MulVec2#090f77e7 = Div#5ac12902<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 / scale#:1.x#43802a16#0,
        y#43802a16#1: v#:0.y#43802a16#1 / scale#:1.y#43802a16#1,
    },
}
```
*/
export const hash_090f77e7: t_5ac12902<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale: t_43802a16) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const random#347089ef = (st#:0: Vec2#43802a16): float ={}> {
    fract#495c4d22(
        sin(dot#369652bb(st#:0, Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233})) * 43758.5453123,
    );
}
```
*/
export const hash_347089ef: (arg_0: t_43802a16) => number = (st: t_43802a16) => hash_495c4d22(sin(hash_369652bb(st, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_43802a16))) * 43758.5453123);

/**
```
const vec2#54a9f2ef = (x#:0: float, y#:1: float): Vec2#43802a16 ={}> Vec2#43802a16{
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
const round#b9171b62 = (v#:0: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
    x#43802a16#0: round(v#:0.x#43802a16#0),
    y#43802a16#1: round(v#:0.y#43802a16#1),
}
```
*/
export const hash_b9171b62: (arg_0: t_43802a16) => t_43802a16 = (v: t_43802a16) => ({
  type: "Vec2",
  x: round(v.x),
  y: round(v.y)
} as t_43802a16);

/**
```
const Vec2float#28569bc0 = Mul#1de4e4c0<Vec2#43802a16, float, Vec2#43802a16>{
    "*"#1de4e4c0#0: (v#:0: Vec2#43802a16, scale#:1: float): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 * scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 * scale#:1,
    },
}
```
*/
export const hash_28569bc0: t_1de4e4c0<t_43802a16, number, t_43802a16> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (v: t_43802a16, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_43802a16)
} as t_1de4e4c0<t_43802a16, number, t_43802a16>);

/**
```
const randFolks#220f14aa = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const scale#:2 = 40.0;
    const small#:3 = round#b9171b62(fragCoord#:1 /#afc24bbe#5ac12902#0 scale#:2) *#28569bc0#1de4e4c0#0 scale#:2;
    const small#:4 = vec2#54a9f2ef(
        small#:3.x#43802a16#0,
        small#:3.y#43802a16#1 + env#:0.time#451d5252#0,
    );
    const v#:5 = random#347089ef(small#:4 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1) / 10.0 + 0.9;
    phongLit#528645fb(sceneSDF#c6d72c68, env#:0, fragCoord#:1);
}
```
*/
export const hash_220f14aa: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = (env$0: t_451d5252, fragCoord$1: t_43802a16) => hash_528645fb(hash_c6d72c68, env$0, fragCoord$1);
export const randFolks = hash_220f14aa;