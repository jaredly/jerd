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
const EPSILON#ec7f8d1c = 0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

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
const normalize#48e6ea27 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> v#:0 
    /#68f73ad4#5ac12902#0 length#63e16b7a(v#:0)
```
*/
export const hash_48e6ea27: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => hash_68f73ad4.h5ac12902_0(v, hash_63e16b7a(v));

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
const distance#29bb6cab = (one#:0: Vec3#9f1c0644, two#:1: Vec3#9f1c0644): float#builtin ={}> length#63e16b7a(
    v: two#:1 -#1c6fdd91#b99b22d8#1 one#:0,
)
```
*/
export const hash_29bb6cab: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (one: t_9f1c0644, two: t_9f1c0644) => hash_63e16b7a(hash_1c6fdd91.hb99b22d8_1(two, one));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const rec shortestDistanceToSurface#56314282 = (
    sceneSDF#:0: (float#builtin, Vec3#9f1c0644) ={}> float#builtin,
    iTime#:1: float#builtin,
    eye#:2: Vec3#9f1c0644,
    marchingDirection#:3: Vec3#9f1c0644,
    start#:4: float#builtin,
    end#:5: float#builtin,
    stepsLeft#:6: int#builtin,
): float#builtin ={}> {
    if stepsLeft#:6 <=#builtin 0 {
        end#:5;
    } else {
        const dist#:7 = sceneSDF#:0(
            iTime#:1,
            eye#:2 +#1c6fdd91#b99b22d8#0 start#:4 *#c4a91006#1de4e4c0#0 marchingDirection#:3,
        );
        if dist#:7 <#builtin EPSILON#ec7f8d1c {
            start#:4;
        } else {
            const depth#:8 = start#:4 +#builtin dist#:7;
            if depth#:8 >=#builtin end#:5 {
                end#:5;
            } else {
                56314282#self(
                    sceneSDF#:0,
                    iTime#:1,
                    eye#:2,
                    marchingDirection#:3,
                    depth#:8,
                    end#:5,
                    stepsLeft#:6 -#builtin 1,
                );
            };
        };
    };
}
```
*/
export const hash_56314282: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, eye: t_9f1c0644, marchingDirection: t_9f1c0644, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = sceneSDF(iTime, hash_1c6fdd91.hb99b22d8_0(eye, hash_c4a91006.h1de4e4c0_0(start, marchingDirection)));

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
const dot#255c39c3 = (a#:0: Vec3#9f1c0644, b#:1: Vec3#9f1c0644): float#builtin ={}> {
    a#:0.x#43802a16#0 *#builtin b#:1.x#43802a16#0 
            +#builtin a#:0.y#43802a16#1 *#builtin b#:1.y#43802a16#1 
        +#builtin a#:0.z#9f1c0644#0 *#builtin b#:1.z#9f1c0644#0;
}
```
*/
export const hash_255c39c3: (arg_0: t_9f1c0644, arg_1: t_9f1c0644) => number = (a: t_9f1c0644, b: t_9f1c0644) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
```
const estimateNormal#6700be1f = (
    sceneSDF#:0: (float#builtin, Vec3#9f1c0644) ={}> float#builtin,
    iTime#:1: float#builtin,
    p#:2: Vec3#9f1c0644,
): Vec3#9f1c0644 ={}> normalize#48e6ea27(
    v: Vec3#9f1c0644{
        x#43802a16#0: sceneSDF#:0(
                iTime#:1,
                Vec3#9f1c0644{...p#:2, x#43802a16#0: p#:2.x#43802a16#0 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#9f1c0644{...p#:2, x#43802a16#0: p#:2.x#43802a16#0 -#builtin EPSILON#ec7f8d1c},
            ),
        y#43802a16#1: sceneSDF#:0(
                iTime#:1,
                Vec3#9f1c0644{...p#:2, y#43802a16#1: p#:2.y#43802a16#1 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#9f1c0644{...p#:2, y#43802a16#1: p#:2.y#43802a16#1 -#builtin EPSILON#ec7f8d1c},
            ),
        z#9f1c0644#0: sceneSDF#:0(
                iTime#:1,
                Vec3#9f1c0644{...p#:2, z#9f1c0644#0: p#:2.z#9f1c0644#0 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#9f1c0644{...p#:2, z#9f1c0644#0: p#:2.z#9f1c0644#0 -#builtin EPSILON#ec7f8d1c},
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
const round#65acfcda = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: round#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: round#builtin(v#:0.y#43802a16#1),
    z#9f1c0644#0: round#builtin(v#:0.z#9f1c0644#0),
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
export const hash_5483fdc2: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644, min: t_9f1c0644, max: t_9f1c0644) => ({
  type: "Vec3",
  x: hash_f2f2e188(v.x, min.x, max.x),
  y: hash_f2f2e188(v.y, min.y, max.y),
  z: hash_f2f2e188(v.z, min.z, max.z)
} as t_9f1c0644);

/**
```
const volumetricSample#6354c64c = (
    sceneSDF#:0: (float#builtin, Vec3#9f1c0644) ={}> float#builtin,
    iTime#:1: float#builtin,
    light#:2: Vec3#9f1c0644,
    eye#:3: Vec3#9f1c0644,
    dist#:4: float#builtin,
    percent#:5: float#builtin,
    dir#:6: Vec3#9f1c0644,
    left#:7: int#builtin,
): float#builtin ={}> {
    const rdist#:8 = percent#:5 *#builtin dist#:4;
    const sample#:9 = eye#:3 +#1c6fdd91#b99b22d8#0 rdist#:8 *#c4a91006#1de4e4c0#0 dir#:6;
    const lightDist#:10 = distance#29bb6cab(one: sample#:9, two: light#:2);
    const toLight#:11 = sample#:9 -#1c6fdd91#b99b22d8#1 light#:2;
    const marchToLight#:12 = shortestDistanceToSurface#56314282(
        sceneSDF#:0,
        iTime#:1,
        eye: sample#:9,
        marchingDirection: -1.0 *#c4a91006#1de4e4c0#0 normalize#48e6ea27(v: toLight#:11),
        start: 0.0,
        end: lightDist#:10,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    if marchToLight#:12 >=#builtin lightDist#:10 -#builtin 0.1 {
        dist#:4 /#builtin pow#builtin(1.0 +#builtin lightDist#:10, 2.0);
    } else {
        0.0;
    };
}
```
*/
export const hash_6354c64c: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: number, arg_6: t_9f1c0644, arg_7: number) => number = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, light: t_9f1c0644, eye$3: t_9f1c0644, dist$4: number, percent: number, dir: t_9f1c0644, left: number) => {
  let sample: t_9f1c0644 = hash_1c6fdd91.hb99b22d8_0(eye$3, hash_c4a91006.h1de4e4c0_0(percent * dist$4, dir));
  let lightDist: number = hash_29bb6cab(sample, light);

  if (hash_56314282(sceneSDF, iTime, sample, hash_c4a91006.h1de4e4c0_0(-1, hash_48e6ea27(hash_1c6fdd91.hb99b22d8_1(sample, light))), 0, lightDist, hash_62404440) >= lightDist - 0.1) {
    return dist$4 / pow(1 + lightDist, 2);
  } else {
    return 0;
  }
};

/**
```
const IntAsFloat#6f186ad1 = As#As<int#builtin, float#builtin>{as#As#0: intToFloat#builtin}
```
*/
export const hash_6f186ad1: t_As<number, number> = ({
  type: "As",
  hAs_0: intToFloat
} as t_As<number, number>);

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
const isPointingTowardLight#2a21d322 = (
    sceneSDF#:0: (float#builtin, Vec3#9f1c0644) ={}> float#builtin,
    iTime#:1: float#builtin,
    p#:2: Vec3#9f1c0644,
    lightPos#:3: Vec3#9f1c0644,
): bool#builtin ={}> {
    const N#:4 = estimateNormal#6700be1f(sceneSDF#:0, iTime#:1, p#:2);
    const L#:5 = normalize#48e6ea27(v: lightPos#:3 -#1c6fdd91#b99b22d8#1 p#:2);
    const dotLN#:6 = dot#255c39c3(a: L#:5, b: N#:4);
    dotLN#:6 >=#builtin 0.0;
}
```
*/
export const hash_2a21d322: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644, arg_3: t_9f1c0644) => boolean = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, p: t_9f1c0644, lightPos: t_9f1c0644) => hash_255c39c3(hash_48e6ea27(hash_1c6fdd91.hb99b22d8_1(lightPos, p)), hash_6700be1f(sceneSDF, iTime, p)) >= 0;

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
const abs#1a074578 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: abs#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: abs#builtin(v#:0.y#43802a16#1),
    z#9f1c0644#0: abs#builtin(v#:0.z#9f1c0644#0),
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
const max#3af3fc3c = (v#:0: Vec3#9f1c0644): float#builtin ={}> {
    max#builtin(max#builtin(v#:0.x#43802a16#0, v#:0.y#43802a16#1), v#:0.z#9f1c0644#0);
}
```
*/
export const hash_3af3fc3c: (arg_0: t_9f1c0644) => number = (v: t_9f1c0644) => max(max(v.x, v.y), v.z);

/**
```
const opRepLim#cffec7f4 = (p#:0: Vec3#9f1c0644, c#:1: float#builtin, l#:2: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    p#:0 
        -#1c6fdd91#b99b22d8#1 c#:1 
            *#c4a91006#1de4e4c0#0 clamp#5483fdc2(
                v: round#65acfcda(v: p#:0 /#68f73ad4#5ac12902#0 c#:1),
                min: NegVec3#a5cd53ce."-"#3c2a4898#0(l#:2),
                max: l#:2,
            );
}
```
*/
export const hash_cffec7f4: (arg_0: t_9f1c0644, arg_1: number, arg_2: t_9f1c0644) => t_9f1c0644 = (p$0: t_9f1c0644, c: number, l: t_9f1c0644) => hash_1c6fdd91.hb99b22d8_1(p$0, hash_c4a91006.h1de4e4c0_0(c, hash_5483fdc2(hash_65acfcda(hash_68f73ad4.h5ac12902_0(p$0, c)), hash_a5cd53ce.h3c2a4898_0(l), l)));

/**
```
const FloatAsInt#184a69ed = As#As<float#builtin, int#builtin>{as#As#0: floatToInt#builtin}
```
*/
export const hash_184a69ed: t_As<number, number> = ({
  type: "As",
  hAs_0: floatToInt
} as t_As<number, number>);

/**
```
const MulVec2#090f77e7 = Div#5ac12902<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1.x#43802a16#0,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1.y#43802a16#1,
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
const AddSubVec2_#6d631644 = AddSub#b99b22d8<Vec2#43802a16, float#builtin, Vec2#43802a16>{
    "+"#b99b22d8#0: (one#:0: Vec2#43802a16, two#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: one#:0.x#43802a16#0 +#builtin two#:1,
        y#43802a16#1: one#:0.y#43802a16#1 +#builtin two#:1,
    },
    "-"#b99b22d8#1: (one#:2: Vec2#43802a16, two#:3: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: one#:2.x#43802a16#0 -#builtin two#:3,
        y#43802a16#1: one#:2.y#43802a16#1 -#builtin two#:3,
    },
}
```
*/
export const hash_6d631644: t_b99b22d8<t_43802a16, number, t_43802a16> = ({
  type: "b99b22d8",
  hb99b22d8_0: (one: t_43802a16, two: number) => ({
    type: "Vec2",
    x: one.x + two,
    y: one.y + two
  } as t_43802a16),
  hb99b22d8_1: (one$2: t_43802a16, two$3: number) => ({
    type: "Vec2",
    x: one$2.x - two$3,
    y: one$2.y - two$3
  } as t_43802a16)
} as t_b99b22d8<t_43802a16, number, t_43802a16>);

/**
```
const rec volumetric#359cb0c1 = (
    sceneSDF#:0: (float#builtin, Vec3#9f1c0644) ={}> float#builtin,
    iTime#:1: float#builtin,
    seed#:2: Vec2#43802a16,
    light#:3: Vec3#9f1c0644,
    eye#:4: Vec3#9f1c0644,
    dist#:5: float#builtin,
    dir#:6: Vec3#9f1c0644,
    current#:7: float#builtin,
    left#:8: int#builtin,
    total#:9: float#builtin,
): float#builtin ={}> {
    if left#:8 <=#builtin 0 {
        current#:7;
    } else {
        const percent#:10 = left#:8 as#6f186ad1 float#builtin /#builtin total#:9;
        const sample#:11 = volumetricSample#6354c64c(
            sceneSDF#:0,
            iTime#:1,
            light#:3,
            eye#:4,
            dist#:5,
            percent#:10,
            dir#:6,
            left#:8,
        );
        359cb0c1#self(
            sceneSDF#:0,
            iTime#:1,
            seed#:2,
            light#:3,
            eye#:4,
            dist#:5,
            dir#:6,
            current#:7 +#builtin sample#:11,
            left#:8 -#builtin 1,
            total#:9,
        );
    };
}
```
*/
export const hash_359cb0c1: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_43802a16, arg_3: t_9f1c0644, arg_4: t_9f1c0644, arg_5: number, arg_6: t_9f1c0644, arg_7: number, arg_8: number, arg_9: number) => number = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, seed: t_43802a16, light$3: t_9f1c0644, eye$4: t_9f1c0644, dist$5: number, dir: t_9f1c0644, current: number, left$8: number, total: number) => {
  while (true) {
    current = current + hash_6354c64c(sceneSDF, iTime, light$3, eye$4, dist$5, hash_6f186ad1.hAs_0(left$8) / total, dir, left$8);
    continue;
  }

  return current;
};

/**
```
const lightSurface#c90c34d4 = (
    sceneSDF#:0: (float#builtin, Vec3#9f1c0644) ={}> float#builtin,
    iTime#:1: float#builtin,
    worldPosForPixel#:2: Vec3#9f1c0644,
    light1Pos#:3: Vec3#9f1c0644,
    light#:4: float#builtin,
    hit#:5: float#builtin,
): Vec4#3b941378 ={}> {
    if isPointingTowardLight#2a21d322(
        sceneSDF#:0,
        iTime#:1,
        p: worldPosForPixel#:2,
        lightPos: light1Pos#:3,
    ) {
        const toLight#:6 = light1Pos#:3 -#1c6fdd91#b99b22d8#1 worldPosForPixel#:2;
        const marchToLight#:7 = shortestDistanceToSurface#56314282(
            sceneSDF#:0,
            iTime#:1,
            eye: light1Pos#:3,
            marchingDirection: -1.0 *#c4a91006#1de4e4c0#0 normalize#48e6ea27(v: toLight#:6),
            start: MIN_DIST#f2cd39b8,
            end: MAX_DIST#0ce717e6,
            stepsLeft: MAX_MARCHING_STEPS#62404440,
        );
        if marchToLight#:7 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c *#builtin 10.0 {
            Vec4#3b941378{...white#0678f03c *#1d31aa6e#1de4e4c0#0 light#:4, w#3b941378#0: 1.0};
        } else {
            const offset#:8 = marchToLight#:7 -#builtin length#63e16b7a(v: toLight#:6);
            const penumbra#:9 = 0.1;
            if offset#:8 <#builtin -EPSILON#ec7f8d1c *#builtin 1000.0 {
                Vec4#3b941378{...white#0678f03c *#1d31aa6e#1de4e4c0#0 light#:4, w#3b941378#0: 1.0};
            } else {
                Vec4#3b941378{...white#0678f03c *#1d31aa6e#1de4e4c0#0 hit#:5, w#3b941378#0: 1.0};
            };
        };
    } else {
        Vec4#3b941378{...white#0678f03c *#1d31aa6e#1de4e4c0#0 light#:4, w#3b941378#0: 1.0};
    };
}
```
*/
export const hash_c90c34d4: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_9f1c0644, arg_3: t_9f1c0644, arg_4: number, arg_5: number) => t_3b941378 = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, worldPosForPixel: t_9f1c0644, light1Pos: t_9f1c0644, light$4: number, hit: number) => {
  if (hash_2a21d322(sceneSDF, iTime, worldPosForPixel, light1Pos)) {
    let toLight: t_9f1c0644 = hash_1c6fdd91.hb99b22d8_1(light1Pos, worldPosForPixel);
    let marchToLight: number = hash_56314282(sceneSDF, iTime, light1Pos, hash_c4a91006.h1de4e4c0_0(-1, hash_48e6ea27(toLight)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

    if (marchToLight > hash_0ce717e6 - hash_ec7f8d1c * 10) {
      return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$4),
        type: "Vec4",
        w: 1
      } as t_3b941378);
    } else {
      if (marchToLight - hash_63e16b7a(toLight) < -hash_ec7f8d1c * 1000) {
        return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$4),
          type: "Vec4",
          w: 1
        } as t_3b941378);
      } else {
        return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, hit),
          type: "Vec4",
          w: 1
        } as t_3b941378);
      }
    }
  } else {
    return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$4),
      type: "Vec4",
      w: 1
    } as t_3b941378);
  }
};

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
export const hash_c336d78c: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_d92781e8 = (eye$0: t_9f1c0644, center: t_9f1c0644, up: t_9f1c0644) => {
  let f: t_9f1c0644 = hash_48e6ea27(hash_1c6fdd91.hb99b22d8_1(center, eye$0));
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
const dot#369652bb = (a#:0: Vec2#43802a16, b#:1: Vec2#43802a16): float#builtin ={}> {
    a#:0.x#43802a16#0 *#builtin b#:1.x#43802a16#0 
        +#builtin a#:0.y#43802a16#1 *#builtin b#:1.y#43802a16#1;
}
```
*/
export const hash_369652bb: (arg_0: t_43802a16, arg_1: t_43802a16) => number = (a: t_43802a16, b: t_43802a16) => a.x * b.x + a.y * b.y;

/**
```
const fract#495c4d22 = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const sceneSDF#c6d72c68 = (iTime#:0: float#builtin, samplePoint#:1: Vec3#9f1c0644): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p1#:3 = opRepLim#cffec7f4(
        p: samplePoint#:1,
        c: 0.25,
        l: Vec3#9f1c0644{x#43802a16#0: 2.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
    );
    min#builtin(
        max#builtin(
            max#3af3fc3c(
                v: abs#1a074578(v: p1#:3) 
                    -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                        x#43802a16#0: 0.1,
                        y#43802a16#1: 0.3,
                        z#9f1c0644#0: 0.6,
                    },
            ),
            -max#3af3fc3c(
                v: abs#1a074578(v: p1#:3) 
                    -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                        x#43802a16#0: 0.11,
                        y#43802a16#1: 0.2,
                        z#9f1c0644#0: 0.55,
                    },
            ),
        ),
        max#3af3fc3c(
            v: abs#1a074578(
                    v: samplePoint#:1 
                        -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
                            x#43802a16#0: 0.0,
                            y#43802a16#1: 1.0,
                            z#9f1c0644#0: -0.1,
                        },
                ) 
                -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
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
const fishingBoueys#4d821b9e = (
    sceneSDF#:0: (float#builtin, Vec3#9f1c0644) ={}> float#builtin,
    iTime#:1: float#builtin,
    fragCoord#:2: Vec2#43802a16,
    iResolution#:3: Vec2#43802a16,
    uCamera#:4: Vec3#9f1c0644,
): Vec4#3b941378 ={}> {
    const viewDir#:5 = rayDirection#6258178a(fieldOfView: 45.0, size: iResolution#:3, fragCoord#:2);
    const eye#:6 = uCamera#:4;
    const viewToWorld#:7 = viewMatrix#c336d78c(
        eye#:6,
        center: Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
        up: Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
    );
    const worldDir#:8 = xyz#1aedf216(
        v: viewToWorld#:7 *#16557d10#1de4e4c0#0 Vec4#3b941378{...viewDir#:5, w#3b941378#0: 0.0},
    );
    const dir#:9 = worldDir#:8;
    const dist#:10 = shortestDistanceToSurface#56314282(
        sceneSDF#:0,
        iTime#:1,
        eye#:6,
        marchingDirection: dir#:9,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    if dist#:10 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c {
        Vec4#3b941378{
            z#9f1c0644#0: 0.0,
            x#43802a16#0: 1.0,
            y#43802a16#1: 1.0,
            w#3b941378#0: 1.0,
        };
    } else {
        const worldPosForPixel#:11 = eye#:6 
            +#1c6fdd91#b99b22d8#0 dist#:10 *#c4a91006#1de4e4c0#0 dir#:9;
        const light1Pos#:12 = Vec3#9f1c0644{
            x#43802a16#0: 0.15 +#builtin sin#builtin(iTime#:1 /#builtin 2.0) /#builtin 1.0,
            y#43802a16#1: 0.0,
            z#9f1c0644#0: 0.05,
        };
        const surfaces#:13 = lightSurface#c90c34d4(
            sceneSDF#:0,
            iTime#:1,
            worldPosForPixel#:11,
            light1Pos#:12,
            light: 0.0,
            hit: 0.01,
        );
        const samples#:14 = 10.0;
        const brightness#:15 = volumetric#359cb0c1(
                    sceneSDF#:0,
                    iTime#:1,
                    seed: fragCoord#:2 /#090f77e7#5ac12902#0 iResolution#:3 
                        +#6d631644#b99b22d8#0 iTime#:1 /#builtin 1000.0,
                    light: light1Pos#:12,
                    eye#:6,
                    dist#:10,
                    dir#:9,
                    current: 0.0,
                    left: samples#:14 as#184a69ed int#builtin,
                    total: samples#:14,
                ) 
                *#builtin 3.0 
            /#builtin samples#:14;
        Vec4#3b941378{
            ...white#0678f03c *#1d31aa6e#1de4e4c0#0 brightness#:15 
                    *#1d31aa6e#1de4e4c0#0 brightness#:15 
                *#1d31aa6e#1de4e4c0#0 brightness#:15,
            w#3b941378#0: 1.0,
        };
    };
}
```
*/
export const hash_4d821b9e: (arg_0: (arg_0: number, arg_1: t_9f1c0644) => number, arg_1: number, arg_2: t_43802a16, arg_3: t_43802a16, arg_4: t_9f1c0644) => t_3b941378 = (sceneSDF: (arg_0: number, arg_1: t_9f1c0644) => number, iTime: number, fragCoord: t_43802a16, iResolution: t_43802a16, uCamera: t_9f1c0644) => {
  let worldDir: t_9f1c0644 = hash_1aedf216(hash_16557d10.h1de4e4c0_0(hash_c336d78c(uCamera, ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 0
  } as t_9f1c0644), ({
    type: "Vec3",
    x: 0,
    y: 1,
    z: 0
  } as t_9f1c0644)), ({ ...hash_6258178a(45, iResolution, fragCoord),
    type: "Vec4",
    w: 0
  } as t_3b941378)));
  let dist$10: number = hash_56314282(sceneSDF, iTime, uCamera, worldDir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$10 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 1,
      y: 1,
      w: 1
    } as t_3b941378);
  } else {
    let brightness: number = hash_359cb0c1(sceneSDF, iTime, hash_6d631644.hb99b22d8_0(hash_090f77e7.h5ac12902_0(fragCoord, iResolution), iTime / 1000), ({
      type: "Vec3",
      x: 0.15 + sin(iTime / 2) / 1,
      y: 0,
      z: 0.05
    } as t_9f1c0644), uCamera, dist$10, worldDir, 0, hash_184a69ed.hAs_0(10), 10) * 3 / 10;
    return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_1d31aa6e.h1de4e4c0_0(hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, brightness), brightness), brightness),
      type: "Vec4",
      w: 1
    } as t_3b941378);
  }
};

/**
```
const random#347089ef = (st#:0: Vec2#43802a16): float#builtin ={}> {
    fract#495c4d22(
        v: sin#builtin(
                dot#369652bb(
                    a: st#:0,
                    b: Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
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
const round#b9171b62 = (v#:0: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
    x#43802a16#0: round#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: round#builtin(v#:0.y#43802a16#1),
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
const Vec2float#28569bc0 = Mul#1de4e4c0<Vec2#43802a16, float#builtin, Vec2#43802a16>{
    "*"#1de4e4c0#0: (v#:0: Vec2#43802a16, scale#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 *#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 *#builtin scale#:1,
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
const randFolks#5bc245fa = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const scale#:2 = 40.0;
    const small#:3 = round#b9171b62(v: fragCoord#:1 /#afc24bbe#5ac12902#0 scale#:2) 
        *#28569bc0#1de4e4c0#0 scale#:2;
    const small#:4 = vec2#54a9f2ef(
        x: small#:3.x#43802a16#0,
        y: small#:3.y#43802a16#1 +#builtin env#:0.time#451d5252#0,
    );
    const v#:5 = random#347089ef(st: small#:4 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const bouey#:6 = fishingBoueys#4d821b9e(
        sceneSDF#c6d72c68,
        iTime: env#:0.time#451d5252#0,
        fragCoord#:1,
        iResolution: env#:0.resolution#451d5252#1,
        uCamera: env#:0.camera#451d5252#2 *#1d31aa6e#1de4e4c0#0 -1.0,
    );
    bouey#:6;
}
```
*/
export const hash_5bc245fa: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = (env: t_451d5252, fragCoord$1: t_43802a16) => hash_4d821b9e(hash_c6d72c68, env.time, fragCoord$1, env.resolution, hash_1d31aa6e.h1de4e4c0_0(env.camera, -1));
export const randFolks = hash_5bc245fa;