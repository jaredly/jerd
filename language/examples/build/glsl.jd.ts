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
const clampF#f2f2e188: (float, float, float) ={}> float = (
    v#:0: float,
    minv#:1: float,
    maxv#:2: float,
) ={}> max(min(v#:0, maxv#:2), minv#:1)
```
*/
export const hash_f2f2e188: (arg_0: number, arg_1: number, arg_2: number) => number = (v$0: number, minv$1: number, maxv$2: number) => max(min(v$0, maxv$2), minv$1);

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
const ScaleVec3Rev#68f73ad4: Div#5ac12902<Vec3#9f1c0644, float, Vec3#9f1c0644> = Div#5ac12902<
    Vec3#9f1c0644,
    float,
    Vec3#9f1c0644,
>{
    "/"#5ac12902#0: (v#:0: Vec3#9f1c0644, scale#:1: float) ={}> Vec3#9f1c0644{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 / scale#:1),
    },
}
```
*/
export const hash_68f73ad4: t_5ac12902<t_9f1c0644, number, t_9f1c0644> = ({
  type: "5ac12902",
  h5ac12902_0: (v$0: t_9f1c0644, scale$1: number) => ({
    type: "Vec3",
    x: v$0.x / scale$1,
    y: v$0.y / scale$1,
    z: v$0.z / scale$1
  } as t_9f1c0644)
} as t_5ac12902<t_9f1c0644, number, t_9f1c0644>);

/**
```
const roundv#65acfcda: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> Vec3#9f1c0644{
    x#43802a16#0: round(v#:0.x#43802a16#0),
    y#43802a16#1: round(v#:0.y#43802a16#1),
    z#9f1c0644#0: round(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_65acfcda: (arg_0: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644) => ({
  type: "Vec3",
  x: round(v$0.x),
  y: round(v$0.y),
  z: round(v$0.z)
} as t_9f1c0644);

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
export const hash_5483fdc2: (arg_0: t_9f1c0644, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644, min$1: t_9f1c0644, max$2: t_9f1c0644) => ({
  type: "Vec3",
  x: hash_f2f2e188(v$0.x, min$1.x, max$2.x),
  y: hash_f2f2e188(v$0.y, min$1.y, max$2.y),
  z: hash_f2f2e188(v$0.z, min$1.z, max$2.z)
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
  h1de4e4c0_0: (scale$0: number, v$1: t_9f1c0644) => ({
    type: "Vec3",
    x: v$1.x * scale$0,
    y: v$1.y * scale$0,
    z: v$1.z * scale$0
  } as t_9f1c0644)
} as t_1de4e4c0<number, t_9f1c0644, t_9f1c0644>);

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
  hb99b22d8_0: (one$0: t_9f1c0644, two$1: t_9f1c0644) => ({
    type: "Vec3",
    x: one$0.x + two$1.x,
    y: one$0.y + two$1.y,
    z: one$0.z + two$1.z
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
const sminCubic#e7c85424: (float, float, float) ={}> float = (a#:0: float, b#:1: float, k#:2: float) ={}> {
    const h#:3 = (max((k#:2 - abs((a#:0 - b#:1))), 0.0) / k#:2);
    const sixth#:4 = (1.0 / 6.0);
    (min(a#:0, b#:1) - ((((h#:3 * h#:3) * h#:3) * k#:2) * sixth#:4));
}
```
*/
export const hash_e7c85424: (arg_0: number, arg_1: number, arg_2: number) => number = (a$0: number, b$1: number, k$2: number) => {
  let h$3: number = max(k$2 - abs(a$0 - b$1), 0) / k$2;
  return min(a$0, b$1) - h$3 * h$3 * h$3 * k$2 * (1 / 6);
};

/**
```
const opRepLim#47cca838: (Vec3#9f1c0644, float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    p#:0: Vec3#9f1c0644,
    c#:1: float,
    l#:2: Vec3#9f1c0644,
) ={}> {
    AddSubVec3#1c6fdd91."-"#b99b22d8#1(
        p#:0,
        ScaleVec3#c4a91006."*"#1de4e4c0#0(
            c#:1,
            clamp#5483fdc2(
                roundv#65acfcda(ScaleVec3Rev#68f73ad4."/"#5ac12902#0(p#:0, c#:1)),
                negVec3#4129390c(l#:2),
                l#:2,
            ),
        ),
    );
}
```
*/
export const hash_47cca838: (arg_0: t_9f1c0644, arg_1: number, arg_2: t_9f1c0644) => t_9f1c0644 = (p$0: t_9f1c0644, c$1: number, l$2: t_9f1c0644) => hash_1c6fdd91.hb99b22d8_1(p$0, hash_c4a91006.h1de4e4c0_0(c$1, hash_5483fdc2(hash_65acfcda(hash_68f73ad4.h5ac12902_0(p$0, c$1)), hash_4129390c(l$2), l$2)));

/**
```
const EPSILON#ec7f8d1c: float = 0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

/**
```
const sceneSDF#737360a9: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const double#:2 = (iTime#:0 * 2.0);
    const p2#:3 = AddSubVec3#1c6fdd91."-"#b99b22d8#1(
        samplePoint#:1,
        Vec3#9f1c0644{
            x#43802a16#0: (-sin(double#:2) / 2.0),
            y#43802a16#1: (sin((iTime#:0 / 4.0)) / 2.0),
            z#9f1c0644#0: (cos(double#:2) / 2.0),
        },
    );
    const p1#:4 = samplePoint#:1;
    const p2#:5 = opRepLim#47cca838(
        p2#:3,
        0.1,
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
    );
    sminCubic#e7c85424((length#1cc335a2(p1#:4) - 0.5), (length#1cc335a2(p2#:5) - 0.03), 0.1);
}
```
*/
export const hash_737360a9: (arg_0: number, arg_1: t_9f1c0644) => number = (iTime$0: number, samplePoint$1: t_9f1c0644) => {
  let double$2: number = iTime$0 * 2;
  return hash_e7c85424(hash_1cc335a2(samplePoint$1) - 0.5, hash_1cc335a2(hash_47cca838(hash_1c6fdd91.hb99b22d8_1(samplePoint$1, ({
    type: "Vec3",
    x: -sin(double$2) / 2,
    y: sin(iTime$0 / 4) / 2,
    z: cos(double$2) / 2
  } as t_9f1c0644)), 0.1, ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_9f1c0644))) - 0.03, 0.1);
};

/**
```
const normalize#ce463a80: (Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (v#:0: Vec3#9f1c0644) ={}> ScaleVec3Rev#68f73ad4."/"#5ac12902#0(
    v#:0,
    length#1cc335a2(v#:0),
)
```
*/
export const hash_ce463a80: (arg_0: t_9f1c0644) => t_9f1c0644 = (v$0: t_9f1c0644) => hash_68f73ad4.h5ac12902_0(v$0, hash_1cc335a2(v$0));

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
const estimateNormal#fcd3504c: (float, Vec3#9f1c0644) ={}> Vec3#9f1c0644 = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
) ={}> normalize#ce463a80(
    Vec3#9f1c0644{
        x#43802a16#0: (sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, x#43802a16#0: (p#:1.x#43802a16#0 - EPSILON#ec7f8d1c)},
        )),
        y#43802a16#1: (sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, y#43802a16#1: (p#:1.y#43802a16#1 - EPSILON#ec7f8d1c)},
        )),
        z#9f1c0644#0: (sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 + EPSILON#ec7f8d1c)},
        ) - sceneSDF#737360a9(
            iTime#:0,
            Vec3#9f1c0644{...p#:1, z#9f1c0644#0: (p#:1.z#9f1c0644#0 - EPSILON#ec7f8d1c)},
        )),
    },
)
```
*/
export const hash_fcd3504c: (arg_0: number, arg_1: t_9f1c0644) => t_9f1c0644 = (iTime$0: number, p$1: t_9f1c0644) => hash_ce463a80(({
  type: "Vec3",
  x: hash_737360a9(iTime$0, ({ ...p$1,
    type: "Vec3",
    x: p$1.x + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_737360a9(iTime$0, ({ ...p$1,
    type: "Vec3",
    x: p$1.x - hash_ec7f8d1c
  } as t_9f1c0644)),
  y: hash_737360a9(iTime$0, ({ ...p$1,
    type: "Vec3",
    y: p$1.y + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_737360a9(iTime$0, ({ ...p$1,
    type: "Vec3",
    y: p$1.y - hash_ec7f8d1c
  } as t_9f1c0644)),
  z: hash_737360a9(iTime$0, ({ ...p$1,
    type: "Vec3",
    z: p$1.z + hash_ec7f8d1c
  } as t_9f1c0644)) - hash_737360a9(iTime$0, ({ ...p$1,
    type: "Vec3",
    z: p$1.z - hash_ec7f8d1c
  } as t_9f1c0644))
} as t_9f1c0644));

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
const white#0678f03c: Vec3#9f1c0644 = Vec3#9f1c0644{
    x#43802a16#0: 1.0,
    y#43802a16#1: 1.0,
    z#9f1c0644#0: 1.0,
}
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
  h1de4e4c0_0: (v$0: t_9f1c0644, scale$1: number) => ({
    type: "Vec3",
    x: v$0.x * scale$1,
    y: v$0.y * scale$1,
    z: v$0.z * scale$1
  } as t_9f1c0644)
} as t_1de4e4c0<t_9f1c0644, number, t_9f1c0644>);

/**
```
const isPointingTowardLight#bbae554c: (float, Vec3#9f1c0644, Vec3#9f1c0644) ={}> bool = (
    iTime#:0: float,
    p#:1: Vec3#9f1c0644,
    lightPos#:2: Vec3#9f1c0644,
) ={}> {
    const N#:3 = estimateNormal#fcd3504c(iTime#:0, p#:1);
    const L#:4 = normalize#ce463a80(AddSubVec3#1c6fdd91."-"#b99b22d8#1(lightPos#:2, p#:1));
    const dotLN#:5 = dot#255c39c3(L#:4, N#:3);
    (dotLN#:5 >= 0.0);
}
```
*/
export const hash_bbae554c: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644) => boolean = (iTime$0: number, p$1: t_9f1c0644, lightPos$2: t_9f1c0644) => hash_255c39c3(hash_ce463a80(hash_1c6fdd91.hb99b22d8_1(lightPos$2, p$1)), hash_fcd3504c(iTime$0, p$1)) >= 0;

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
const shortestDistanceToSurface#7b1e309a: (float, Vec3#9f1c0644, Vec3#9f1c0644, float, float, int) ={}> float = (
    iTime#:0: float,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
) ={}> {
    if (stepsLeft#:5 <= 0) {
        end#:4;
    } else {
        const dist#:6 = sceneSDF#737360a9(
            iTime#:0,
            AddSubVec3#1c6fdd91."+"#b99b22d8#0(
                eye#:1,
                ScaleVec3#c4a91006."*"#1de4e4c0#0(start#:3, marchingDirection#:2),
            ),
        );
        if (dist#:6 < EPSILON#ec7f8d1c) {
            start#:3;
        } else {
            const depth#:7 = (start#:3 + dist#:6);
            if (depth#:7 >= end#:4) {
                end#:4;
            } else {
                7b1e309a(
                    iTime#:0,
                    eye#:1,
                    marchingDirection#:2,
                    depth#:7,
                    end#:4,
                    (stepsLeft#:5 - 1),
                );
            };
        };
    };
}
```
*/
export const hash_7b1e309a: (arg_0: number, arg_1: t_9f1c0644, arg_2: t_9f1c0644, arg_3: number, arg_4: number, arg_5: number) => number = (iTime$0: number, eye$1: t_9f1c0644, marchingDirection$2: t_9f1c0644, start$3: number, end$4: number, stepsLeft$5: number) => {
  while (true) {
    if (stepsLeft$5 <= 0) {
      return end$4;
    } else {
      let dist$6: number = hash_737360a9(iTime$0, hash_1c6fdd91.hb99b22d8_0(eye$1, hash_c4a91006.h1de4e4c0_0(start$3, marchingDirection$2)));

      if (dist$6 < hash_ec7f8d1c) {
        return start$3;
      } else {
        let depth$7: number = start$3 + dist$6;

        if (depth$7 >= end$4) {
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
  }
};

/**
```
const rayDirection#fb220c84: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec3#9f1c0644 = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
) ={}> {
    const xy#:3 = AddSubVec2#70bb2056."-"#b99b22d8#1(
        fragCoord#:2,
        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(size#:1, 2.0),
    );
    const z#:4 = (size#:1.y#43802a16#1 / tan((radians#dabe7f9c(fieldOfView#:0) / 2.0)));
    normalize#ce463a80(vec3#5808ec54(xy#:3, -z#:4));
}
```
*/
export const hash_fb220c84: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_9f1c0644 = (fieldOfView$0: number, size$1: t_43802a16, fragCoord$2: t_43802a16) => hash_ce463a80(hash_5808ec54(hash_70bb2056.hb99b22d8_1(fragCoord$2, hash_afc24bbe.h5ac12902_0(size$1, 2)), -(size$1.y / tan(hash_dabe7f9c(fieldOfView$0) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
*/
export const hash_62404440: number = 255;

/**
```
const dot2#369652bb: (Vec2#43802a16, Vec2#43802a16) ={}> float = (
    a#:0: Vec2#43802a16,
    b#:1: Vec2#43802a16,
) ={}> {
    ((a#:0.x#43802a16#0 * b#:1.x#43802a16#0) + (a#:0.y#43802a16#1 * b#:1.y#43802a16#1));
}
```
*/
export const hash_369652bb: (arg_0: t_43802a16, arg_1: t_43802a16) => number = (a$0: t_43802a16, b$1: t_43802a16) => a$0.x * b$1.x + a$0.y * b$1.y;

/**
```
const fract#495c4d22: (float) ={}> float = (v#:0: float) ={}> (v#:0 - floor(v#:0))
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v$0: number) => v$0 - floor(v$0);

/**
```
const Scale4#56d43c0e: Div#5ac12902<Vec4#3b941378, float, Vec4#3b941378> = Div#5ac12902<
    Vec4#3b941378,
    float,
    Vec4#3b941378,
>{
    "/"#5ac12902#0: (v#:0: Vec4#3b941378, scale#:1: float) ={}> Vec4#3b941378{
        z#9f1c0644#0: (v#:0.z#9f1c0644#0 / scale#:1),
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
        w#3b941378#0: (v#:0.w#3b941378#0 / scale#:1),
    },
}
```
*/
export const hash_56d43c0e: t_5ac12902<t_3b941378, number, t_3b941378> = ({
  type: "5ac12902",
  h5ac12902_0: (v$0: t_3b941378, scale$1: number) => ({
    type: "Vec4",
    z: v$0.z / scale$1,
    x: v$0.x / scale$1,
    y: v$0.y / scale$1,
    w: v$0.w / scale$1
  } as t_3b941378)
} as t_5ac12902<t_3b941378, number, t_3b941378>);

/**
```
const fishingBoueys#3cabd8b2: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
) ={}> {
    const dir#:3 = rayDirection#fb220c84(45.0, iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#7b1e309a(
        iTime#:0,
        eye#:4,
        dir#:3,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    const light#:6 = 0.2;
    if (dist#:5 > (MAX_DIST#0ce717e6 - EPSILON#ec7f8d1c)) {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 0.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        const worldPosForPixel#:7 = AddSubVec3#1c6fdd91."+"#b99b22d8#0(
            eye#:4,
            ScaleVec3#c4a91006."*"#1de4e4c0#0(dist#:5, dir#:3),
        );
        const K_a#:8 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:9 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:10 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:11 = 10.0;
        const light1Pos#:12 = Vec3#9f1c0644{
            x#43802a16#0: (10.0 * sin(iTime#:0)),
            y#43802a16#1: (10.0 * cos(iTime#:0)),
            z#9f1c0644#0: 5.0,
        };
        const toLight#:13 = AddSubVec3#1c6fdd91."-"#b99b22d8#1(light1Pos#:12, worldPosForPixel#:7);
        if isPointingTowardLight#bbae554c(iTime#:0, worldPosForPixel#:7, light1Pos#:12) {
            const marchToLight#:14 = shortestDistanceToSurface#7b1e309a(
                iTime#:0,
                light1Pos#:12,
                ScaleVec3#c4a91006."*"#1de4e4c0#0(-1.0, normalize#ce463a80(toLight#:13)),
                MIN_DIST#f2cd39b8,
                MAX_DIST#0ce717e6,
                MAX_MARCHING_STEPS#62404440,
            );
            if (marchToLight#:14 > (MAX_DIST#0ce717e6 - (EPSILON#ec7f8d1c * 10.0))) {
                Vec4#3b941378{
                    ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:6),
                    w#3b941378#0: 1.0,
                };
            } else {
                const offset#:15 = (marchToLight#:14 - length#1cc335a2(toLight#:13));
                const penumbra#:16 = 0.1;
                if (offset#:15 < (-EPSILON#ec7f8d1c * 1000.0)) {
                    Vec4#3b941378{
                        ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:6),
                        w#3b941378#0: 1.0,
                    };
                } else {
                    Vec4#3b941378{...white#0678f03c, w#3b941378#0: 1.0};
                };
            };
        } else {
            Vec4#3b941378{
                ...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(white#0678f03c, light#:6),
                w#3b941378#0: 1.0,
            };
        };
    };
}
```
*/
export const hash_3cabd8b2: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16) => {
  let dir$3: t_9f1c0644 = hash_fb220c84(45, iResolution$2, fragCoord$1);
  let eye$4: t_9f1c0644 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_9f1c0644);
  let dist$5: number = hash_7b1e309a(iTime$0, eye$4, dir$3, hash_f2cd39b8, hash_0ce717e6, hash_62404440);
  let light$6: number = 0.2;

  if (dist$5 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_3b941378);
  } else {
    let worldPosForPixel$7: t_9f1c0644 = hash_1c6fdd91.hb99b22d8_0(eye$4, hash_c4a91006.h1de4e4c0_0(dist$5, dir$3));
    let light1Pos$12: t_9f1c0644 = ({
      type: "Vec3",
      x: 10 * sin(iTime$0),
      y: 10 * cos(iTime$0),
      z: 5
    } as t_9f1c0644);
    let toLight$13: t_9f1c0644 = hash_1c6fdd91.hb99b22d8_1(light1Pos$12, worldPosForPixel$7);

    if (hash_bbae554c(iTime$0, worldPosForPixel$7, light1Pos$12)) {
      let marchToLight$14: number = hash_7b1e309a(iTime$0, light1Pos$12, hash_c4a91006.h1de4e4c0_0(-1, hash_ce463a80(toLight$13)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

      if (marchToLight$14 > hash_0ce717e6 - hash_ec7f8d1c * 10) {
        return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$6),
          type: "Vec4",
          w: 1
        } as t_3b941378);
      } else {
        if (marchToLight$14 - hash_1cc335a2(toLight$13) < -hash_ec7f8d1c * 1000) {
          return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$6),
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
      return ({ ...hash_1d31aa6e.h1de4e4c0_0(hash_0678f03c, light$6),
        type: "Vec4",
        w: 1
      } as t_3b941378);
    }
  }
};

/**
```
const red#7d188c3c: Vec3#9f1c0644 = Vec3#9f1c0644{
    x#43802a16#0: 1.0,
    y#43802a16#1: 0.0,
    z#9f1c0644#0: 0.0,
}
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
  h5ac12902_0: (v$0: t_43802a16, scale$1: t_43802a16) => ({
    type: "Vec2",
    x: v$0.x / scale$1.x,
    y: v$0.y / scale$1.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const random#347089ef: (Vec2#43802a16) ={}> float = (st#:0: Vec2#43802a16) ={}> {
    fract#495c4d22(
        (sin(dot2#369652bb(st#:0, Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233})) * 43758.5453123),
    );
}
```
*/
export const hash_347089ef: (arg_0: t_43802a16) => number = (st$0: t_43802a16) => hash_495c4d22(sin(hash_369652bb(st$0, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_43802a16))) * 43758.5453123);

/**
```
const roundv2#b9171b62: (Vec2#43802a16) ={}> Vec2#43802a16 = (v#:0: Vec2#43802a16) ={}> Vec2#43802a16{
    x#43802a16#0: round(v#:0.x#43802a16#0),
    y#43802a16#1: round(v#:0.y#43802a16#1),
}
```
*/
export const hash_b9171b62: (arg_0: t_43802a16) => t_43802a16 = (v$0: t_43802a16) => ({
  type: "Vec2",
  x: round(v$0.x),
  y: round(v$0.y)
} as t_43802a16);

/**
```
const Vec2float#28569bc0: Mul#1de4e4c0<Vec2#43802a16, float, Vec2#43802a16> = Mul#1de4e4c0<
    Vec2#43802a16,
    float,
    Vec2#43802a16,
>{
    "*"#1de4e4c0#0: (v#:0: Vec2#43802a16, scale#:1: float) ={}> Vec2#43802a16{
        x#43802a16#0: (v#:0.x#43802a16#0 * scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 * scale#:1),
    },
}
```
*/
export const hash_28569bc0: t_1de4e4c0<t_43802a16, number, t_43802a16> = ({
  type: "1de4e4c0",
  h1de4e4c0_0: (v$0: t_43802a16, scale$1: number) => ({
    type: "Vec2",
    x: v$0.x * scale$1,
    y: v$0.y * scale$1
  } as t_43802a16)
} as t_1de4e4c0<t_43802a16, number, t_43802a16>);

/**
```
const randFolks#3fa3c492: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
) ={}> {
    const scale#:3 = 14.0;
    const small#:4 = Vec2float#28569bc0."*"#1de4e4c0#0(
        roundv2#b9171b62(ScaleVec2Rev#afc24bbe."/"#5ac12902#0(fragCoord#:1, scale#:3)),
        scale#:3,
    );
    const small#:5 = Vec2#43802a16{
        x#43802a16#0: small#:4.x#43802a16#0,
        y#43802a16#1: (small#:4.y#43802a16#1 + iTime#:0),
    };
    const v#:6 = ((random#347089ef(MulVec2#090f77e7."/"#5ac12902#0(small#:5, iResolution#:2)) / 10.0) + 0.9);
    const two#:7 = AddSubVec4#0555d260."+"#b99b22d8#0(
        Vec4#3b941378{...ScaleVec3_#1d31aa6e."*"#1de4e4c0#0(red#7d188c3c, v#:6), w#3b941378#0: 1.0},
        fishingBoueys#3cabd8b2(iTime#:0, fragCoord#:1, iResolution#:2),
    );
    Scale4#56d43c0e."/"#5ac12902#0(two#:7, 2.0);
}
```
*/
export const hash_3fa3c492: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16) => {
  let scale$3: number = 14;
  let small$4: t_43802a16 = hash_28569bc0.h1de4e4c0_0(hash_b9171b62(hash_afc24bbe.h5ac12902_0(fragCoord$1, scale$3)), scale$3);
  return hash_56d43c0e.h5ac12902_0(hash_0555d260.hb99b22d8_0(({ ...hash_1d31aa6e.h1de4e4c0_0(hash_7d188c3c, hash_347089ef(hash_090f77e7.h5ac12902_0(({
      type: "Vec2",
      x: small$4.x,
      y: small$4.y + iTime$0
    } as t_43802a16), iResolution$2)) / 10 + 0.9),
    type: "Vec4",
    w: 1
  } as t_3b941378), hash_3cabd8b2(iTime$0, fragCoord$1, iResolution$2)), 2);
};
export const randFolks = hash_3fa3c492;