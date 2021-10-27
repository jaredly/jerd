import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@ffi("Vec2") type Vec2#78566d10 = {
    x: float#builtin,
    y: float#builtin,
}
```
*/
type t_78566d10 = {
  type: "Vec2";
  x: number;
  y: number;
};

/**
```
@ffi("Vec3") type Vec3#1b597af1 = {
    ...Vec2#78566d10,
    z: float#builtin,
}
```
*/
type t_1b597af1 = {
  type: "Vec3";
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi("GLSLEnv") type GLSLEnv#5cec7724 = {
    time: float#builtin,
    resolution: Vec2#78566d10,
    camera: Vec3#1b597af1,
    mouse: Vec2#78566d10,
}
```
*/
type t_5cec7724 = {
  type: "GLSLEnv";
  time: number;
  resolution: t_78566d10;
  camera: t_1b597af1;
  mouse: t_78566d10;
};

/**
```
@ffi("Vec4") type Vec4#38dc9122 = {
    ...Vec3#1b597af1,
    w: float#builtin,
}
```
*/
type t_38dc9122 = {
  type: "Vec4";
  w: number;
  z: number;
  x: number;
  y: number;
};

/**
```
@unique(0) type AddSub#70e0d6d0<A#:0, B#:1, C#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_70e0d6d0<A, B, C> = {
  type: "70e0d6d0";
  h70e0d6d0_0: (arg_0: A, arg_1: B) => C;
  h70e0d6d0_1: (arg_0: A, arg_1: B) => C;
};

/**
```
@unique(1) type Mul#49fef1f5<A#:0, B#:1, C#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_49fef1f5<A, B, C> = {
  type: "49fef1f5";
  h49fef1f5_0: (arg_0: A, arg_1: B) => C;
};

/**
```
@unique(2) type Div#2b90cfd4<A#:0, B#:1, C#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_2b90cfd4<A, B, C> = {
  type: "2b90cfd4";
  h2b90cfd4_0: (arg_0: A, arg_1: B) => C;
};

/**
```
@unique(3) type Neg#f6e074a4<A#:0, B#:1> = {
    "-": (A#:0) ={}> B#:1,
}
```
*/
type t_f6e074a4<A, B> = {
  type: "f6e074a4";
  hf6e074a4_0: (arg_0: A) => B;
};

/**
```
const clamp#0611a7c0 = (v#:0: float#builtin, minv#:1: float#builtin, maxv#:2: float#builtin): float#builtin ={}> max#builtin(
    min#builtin(v#:0, maxv#:2),
    minv#:1,
)
(v#:0: float, minv#:1: float, maxv#:2: float): float => max(min(v#:0, maxv#:2), minv#:1)
```
*/
export const hash_0611a7c0: (arg_0: number, arg_1: number, arg_2: number) => number = (v: number, minv: number, maxv: number) => max(min(v, maxv), minv);

/**
```
const NegVec3#68c0a879 = Neg#f6e074a4<Vec3#1b597af1, Vec3#1b597af1>{
    "-"#f6e074a4#0: (v#:0: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: -v#:0.x#78566d10#0,
        y#78566d10#1: -v#:0.y#78566d10#1,
        z#1b597af1#0: -v#:0.z#1b597af1#0,
    },
}
Neg#👆{TODO SPREADs}{
    hf6e074a4_0: (v#:0: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: -v#:0.#Vec3#🗻🌻🤽‍♂️#0,
        x: -v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: -v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
}
```
*/
export const hash_68c0a879: t_f6e074a4<t_1b597af1, t_1b597af1> = ({
  type: "f6e074a4",
  hf6e074a4_0: (v: t_1b597af1) => ({
    type: "Vec3",
    x: -v.x,
    y: -v.y,
    z: -v.z
  } as t_1b597af1)
} as t_f6e074a4<t_1b597af1, t_1b597af1>);

/**
```
const ScaleVec3Rev#68cd48ad = Div#2b90cfd4<Vec3#1b597af1, float#builtin, Vec3#1b597af1>{
    "/"#2b90cfd4#0: (v#:0: Vec3#1b597af1, scale#:1: float#builtin): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: v#:0.x#78566d10#0 /#builtin scale#:1,
        y#78566d10#1: v#:0.y#78566d10#1 /#builtin scale#:1,
        z#1b597af1#0: v#:0.z#1b597af1#0 /#builtin scale#:1,
    },
}
Div#⚽🤮🍡{TODO SPREADs}{
    h2b90cfd4_0: (v#:0: Vec3#🗻🌻🤽‍♂️, scale#:1: float): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: v#:0.#Vec3#🗻🌻🤽‍♂️#0 / scale#:1,
        x: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 / scale#:1,
        y: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 / scale#:1,
    },
}
```
*/
export const hash_68cd48ad: t_2b90cfd4<t_1b597af1, number, t_1b597af1> = ({
  type: "2b90cfd4",
  h2b90cfd4_0: (v: t_1b597af1, scale: number) => ({
    type: "Vec3",
    x: v.x / scale,
    y: v.y / scale,
    z: v.z / scale
  } as t_1b597af1)
} as t_2b90cfd4<t_1b597af1, number, t_1b597af1>);

/**
```
const round#29c3f03c = (v#:0: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: round#builtin(v#:0.x#78566d10#0),
    y#78566d10#1: round#builtin(v#:0.y#78566d10#1),
    z#1b597af1#0: round#builtin(v#:0.z#1b597af1#0),
}
(v#:0: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: round(v#:0.#Vec3#🗻🌻🤽‍♂️#0),
    x: round(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0),
    y: round(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1),
}
```
*/
export const hash_29c3f03c: (arg_0: t_1b597af1) => t_1b597af1 = (v: t_1b597af1) => ({
  type: "Vec3",
  x: round(v.x),
  y: round(v.y),
  z: round(v.z)
} as t_1b597af1);

/**
```
const clamp#83e54cbc = (v#:0: Vec3#1b597af1, min#:1: Vec3#1b597af1, max#:2: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: clamp#0611a7c0(
        v: v#:0.x#78566d10#0,
        minv: min#:1.x#78566d10#0,
        maxv: max#:2.x#78566d10#0,
    ),
    y#78566d10#1: clamp#0611a7c0(
        v: v#:0.y#78566d10#1,
        minv: min#:1.y#78566d10#1,
        maxv: max#:2.y#78566d10#1,
    ),
    z#1b597af1#0: clamp#0611a7c0(
        v: v#:0.z#1b597af1#0,
        minv: min#:1.z#1b597af1#0,
        maxv: max#:2.z#1b597af1#0,
    ),
}
(v#:0: Vec3#🗻🌻🤽‍♂️, min#:1: Vec3#🗻🌻🤽‍♂️, max#:2: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: clamp#🎉😹👹(v#:0.#Vec3#🗻🌻🤽‍♂️#0, min#:1.#Vec3#🗻🌻🤽‍♂️#0, max#:2.#Vec3#🗻🌻🤽‍♂️#0),
    x: clamp#🎉😹👹(
        v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        min#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        max#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
    ),
    y: clamp#🎉😹👹(
        v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
        min#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
        max#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    ),
}
```
*/
export const hash_83e54cbc: (arg_0: t_1b597af1, arg_1: t_1b597af1, arg_2: t_1b597af1) => t_1b597af1 = (v: t_1b597af1, min: t_1b597af1, max: t_1b597af1) => ({
  type: "Vec3",
  x: hash_0611a7c0(v.x, min.x, max.x),
  y: hash_0611a7c0(v.y, min.y, max.y),
  z: hash_0611a7c0(v.z, min.z, max.z)
} as t_1b597af1);

/**
```
const ScaleVec3#11ee14c0 = Mul#49fef1f5<float#builtin, Vec3#1b597af1, Vec3#1b597af1>{
    "*"#49fef1f5#0: (scale#:0: float#builtin, v#:1: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: v#:1.x#78566d10#0 *#builtin scale#:0,
        y#78566d10#1: v#:1.y#78566d10#1 *#builtin scale#:0,
        z#1b597af1#0: v#:1.z#1b597af1#0 *#builtin scale#:0,
    },
}
Mul#🐺🎇🤟😃{TODO SPREADs}{
    h49fef1f5_0: (scale#:0: float, v#:1: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: v#:1.#Vec3#🗻🌻🤽‍♂️#0 * scale#:0,
        x: v#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * scale#:0,
        y: v#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * scale#:0,
    },
}
```
*/
export const hash_11ee14c0: t_49fef1f5<number, t_1b597af1, t_1b597af1> = ({
  type: "49fef1f5",
  h49fef1f5_0: (scale$0: number, v$1: t_1b597af1) => ({
    type: "Vec3",
    x: v$1.x * scale$0,
    y: v$1.y * scale$0,
    z: v$1.z * scale$0
  } as t_1b597af1)
} as t_49fef1f5<number, t_1b597af1, t_1b597af1>);

/**
```
const AddSubVec3#3de90345 = AddSub#70e0d6d0<Vec3#1b597af1, Vec3#1b597af1, Vec3#1b597af1>{
    "+"#70e0d6d0#0: (one#:0: Vec3#1b597af1, two#:1: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: one#:0.x#78566d10#0 +#builtin two#:1.x#78566d10#0,
        y#78566d10#1: one#:0.y#78566d10#1 +#builtin two#:1.y#78566d10#1,
        z#1b597af1#0: one#:0.z#1b597af1#0 +#builtin two#:1.z#1b597af1#0,
    },
    "-"#70e0d6d0#1: (one#:2: Vec3#1b597af1, two#:3: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: one#:2.x#78566d10#0 -#builtin two#:3.x#78566d10#0,
        y#78566d10#1: one#:2.y#78566d10#1 -#builtin two#:3.y#78566d10#1,
        z#1b597af1#0: one#:2.z#1b597af1#0 -#builtin two#:3.z#1b597af1#0,
    },
}
AddSub#🍼🥵🗽😃{TODO SPREADs}{
    h70e0d6d0_0: (one#:0: Vec3#🗻🌻🤽‍♂️, two#:1: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: one#:0.#Vec3#🗻🌻🤽‍♂️#0 + two#:1.#Vec3#🗻🌻🤽‍♂️#0,
        x: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
    h70e0d6d0_1: (one#:2: Vec3#🗻🌻🤽‍♂️, two#:3: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: one#:2.#Vec3#🗻🌻🤽‍♂️#0 - two#:3.#Vec3#🗻🌻🤽‍♂️#0,
        x: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - two#:3.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - two#:3.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
}
```
*/
export const hash_3de90345: t_70e0d6d0<t_1b597af1, t_1b597af1, t_1b597af1> = ({
  type: "70e0d6d0",
  h70e0d6d0_0: (one: t_1b597af1, two: t_1b597af1) => ({
    type: "Vec3",
    x: one.x + two.x,
    y: one.y + two.y,
    z: one.z + two.z
  } as t_1b597af1),
  h70e0d6d0_1: (one$2: t_1b597af1, two$3: t_1b597af1) => ({
    type: "Vec3",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    z: one$2.z - two$3.z
  } as t_1b597af1)
} as t_70e0d6d0<t_1b597af1, t_1b597af1, t_1b597af1>);

/**
```
const length#78bdad43 = (v#:0: Vec3#1b597af1): float#builtin ={}> sqrt#builtin(
    v#:0.x#78566d10#0 *#builtin v#:0.x#78566d10#0 
            +#builtin v#:0.y#78566d10#1 *#builtin v#:0.y#78566d10#1 
        +#builtin v#:0.z#1b597af1#0 *#builtin v#:0.z#1b597af1#0,
)
(v#:0: Vec3#🗻🌻🤽‍♂️): float => sqrt(
    v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + v#:0.#Vec3#🗻🌻🤽‍♂️#0 * v#:0.#Vec3#🗻🌻🤽‍♂️#0,
)
```
*/
export const hash_78bdad43: (arg_0: t_1b597af1) => number = (v: t_1b597af1) => sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/**
```
const sminCubic#5069ed00 = (a#:0: float#builtin, b#:1: float#builtin, k#:2: float#builtin): float#builtin ={}> {
    const h#:3 = max#builtin(k#:2 -#builtin abs#builtin(a#:0 -#builtin b#:1), 0.0) /#builtin k#:2;
    const sixth#:4 = 1.0 /#builtin 6.0;
    min#builtin(a#:0, b#:1) 
        -#builtin h#:3 *#builtin h#:3 *#builtin h#:3 *#builtin k#:2 *#builtin sixth#:4;
}
(a#:0: float, b#:1: float, k#:2: float): float => {
    const h#:3: float = max(k#:2 - abs(a#:0 - b#:1), 0) / k#:2;
    return min(a#:0, b#:1) - h#:3 * h#:3 * h#:3 * k#:2 * 1 / 6;
}
```
*/
export const hash_5069ed00: (arg_0: number, arg_1: number, arg_2: number) => number = (a: number, b: number, k: number) => {
  let h: number = max(k - abs(a - b), 0) / k;
  return min(a, b) - h * h * h * k * (1 / 6);
};

/**
```
const opRepLim#22682d50 = (p#:0: Vec3#1b597af1, c#:1: float#builtin, l#:2: Vec3#1b597af1): Vec3#1b597af1 ={}> {
    p#:0 
        -#3de90345#70e0d6d0#1 c#:1 
            *#11ee14c0#49fef1f5#0 clamp#83e54cbc(
                v: round#29c3f03c(v: p#:0 /#68cd48ad#2b90cfd4#0 c#:1),
                min: NegVec3#68c0a879."-"#f6e074a4#0(l#:2),
                max: l#:2,
            );
}
(p#:0: Vec3#🗻🌻🤽‍♂️, c#:1: float, l#:2: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
    p#:0,
    ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(
        c#:1,
        clamp#👂(
            round#😎🤷‍♂️🥪(ScaleVec3Rev#🤜🛑🍞😃.#Div#⚽🤮🍡#0(p#:0, c#:1)),
            NegVec3#💓😌🍞😃.#Neg#👆#0(l#:2),
            l#:2,
        ),
    ),
)
```
*/
export const hash_22682d50: (arg_0: t_1b597af1, arg_1: number, arg_2: t_1b597af1) => t_1b597af1 = (p: t_1b597af1, c: number, l: t_1b597af1) => hash_3de90345.h70e0d6d0_1(p, hash_11ee14c0.h49fef1f5_0(c, hash_83e54cbc(hash_29c3f03c(hash_68cd48ad.h2b90cfd4_0(p, c)), hash_68c0a879.hf6e074a4_0(l), l)));

/**
```
const EPSILON#ec7f8d1c = 0.00005
0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

/**
```
const sceneSDF#e1735eba = (iTime#:0: float#builtin, samplePoint#:1: Vec3#1b597af1): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p2#:3 = samplePoint#:1 
        -#3de90345#70e0d6d0#1 Vec3#1b597af1{
            x#78566d10#0: -sin#builtin(double#:2) /#builtin 2.0,
            y#78566d10#1: sin#builtin(iTime#:0 /#builtin 4.0) /#builtin 2.0,
            z#1b597af1#0: cos#builtin(double#:2) /#builtin 2.0,
        };
    const p1#:4 = samplePoint#:1;
    const p2#:5 = opRepLim#22682d50(
        p: p2#:3,
        c: 0.1,
        l: Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: 1.0},
    );
    sminCubic#5069ed00(
        a: length#78bdad43(v: p1#:4) -#builtin 0.5,
        b: length#78bdad43(v: p2#:5) -#builtin 0.03,
        k: 0.1,
    );
}
(iTime#:0: float, samplePoint#:1: Vec3#🗻🌻🤽‍♂️): float => {
    const double#:2: float = iTime#:0 * 2;
    return sminCubic#👩‍⚕️🥝👩‍🏫😃(
        length#🤵‍♀️⌛🌒😃(samplePoint#:1) - 0.5,
        length#🤵‍♀️⌛🌒😃(
            opRepLim#🦸🐽🦘(
                AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
                    samplePoint#:1,
                    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                        z: cos(double#:2) / 2,
                        x: -sin(double#:2) / 2,
                        y: sin(iTime#:0 / 4) / 2,
                    },
                ),
                0.1,
                Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 1, x: 1, y: 1},
            ),
        ) - 0.03,
        0.1,
    );
}
```
*/
export const hash_e1735eba: (arg_0: number, arg_1: t_1b597af1) => number = (iTime: number, samplePoint: t_1b597af1) => {
  let double: number = iTime * 2;
  return hash_5069ed00(hash_78bdad43(samplePoint) - 0.5, hash_78bdad43(hash_22682d50(hash_3de90345.h70e0d6d0_1(samplePoint, ({
    type: "Vec3",
    x: -sin(double) / 2,
    y: sin(iTime / 4) / 2,
    z: cos(double) / 2
  } as t_1b597af1)), 0.1, ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_1b597af1))) - 0.03, 0.1);
};

/**
```
const normalize#35d412d2 = (v#:0: Vec3#1b597af1): Vec3#1b597af1 ={}> v#:0 
    /#68cd48ad#2b90cfd4#0 length#78bdad43(v#:0)
(v#:0: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => ScaleVec3Rev#🤜🛑🍞😃.#Div#⚽🤮🍡#0(
    v#:0,
    length#🤵‍♀️⌛🌒😃(v#:0),
)
```
*/
export const hash_35d412d2: (arg_0: t_1b597af1) => t_1b597af1 = (v: t_1b597af1) => hash_68cd48ad.h2b90cfd4_0(v, hash_78bdad43(v));

/**
```
const dot#489fc39f = (a#:0: Vec3#1b597af1, b#:1: Vec3#1b597af1): float#builtin ={}> {
    a#:0.x#78566d10#0 *#builtin b#:1.x#78566d10#0 
            +#builtin a#:0.y#78566d10#1 *#builtin b#:1.y#78566d10#1 
        +#builtin a#:0.z#1b597af1#0 *#builtin b#:1.z#1b597af1#0;
}
(a#:0: Vec3#🗻🌻🤽‍♂️, b#:1: Vec3#🗻🌻🤽‍♂️): float => a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + a#:0.#Vec3#🗻🌻🤽‍♂️#0 * b#:1.#Vec3#🗻🌻🤽‍♂️#0
```
*/
export const hash_489fc39f: (arg_0: t_1b597af1, arg_1: t_1b597af1) => number = (a: t_1b597af1, b: t_1b597af1) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
```
const estimateNormal#48ad3d0c = (iTime#:0: float#builtin, p#:1: Vec3#1b597af1): Vec3#1b597af1 ={}> normalize#35d412d2(
    v: Vec3#1b597af1{
        x#78566d10#0: sceneSDF#e1735eba(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    x#78566d10#0: p#:1.x#78566d10#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#e1735eba(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    x#78566d10#0: p#:1.x#78566d10#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        y#78566d10#1: sceneSDF#e1735eba(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    y#78566d10#1: p#:1.y#78566d10#1 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#e1735eba(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    y#78566d10#1: p#:1.y#78566d10#1 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        z#1b597af1#0: sceneSDF#e1735eba(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    z#1b597af1#0: p#:1.z#1b597af1#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#e1735eba(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    z#1b597af1#0: p#:1.z#1b597af1#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
    },
)
(iTime#:0: float, p#:1: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => normalize#☕🧑‍🏫🛩️(
    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: sceneSDF#🥟(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: p#:1.#Vec3#🗻🌻🤽‍♂️#0 + EPSILON#🧑‍💻,
                x: _#:0,
                y: _#:0,
            },
        ) - sceneSDF#🥟(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: p#:1.#Vec3#🗻🌻🤽‍♂️#0 - EPSILON#🧑‍💻,
                x: _#:0,
                y: _#:0,
            },
        ),
        x: sceneSDF#🥟(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: p#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + EPSILON#🧑‍💻,
                y: _#:0,
            },
        ) - sceneSDF#🥟(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: p#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - EPSILON#🧑‍💻,
                y: _#:0,
            },
        ),
        y: sceneSDF#🥟(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + EPSILON#🧑‍💻,
            },
        ) - sceneSDF#🥟(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - EPSILON#🧑‍💻,
            },
        ),
    },
)
```
*/
export const hash_48ad3d0c: (arg_0: number, arg_1: t_1b597af1) => t_1b597af1 = (iTime: number, p$1: t_1b597af1) => hash_35d412d2(({
  type: "Vec3",
  x: hash_e1735eba(iTime, ({ ...p$1,
    type: "Vec3",
    x: p$1.x + hash_ec7f8d1c
  } as t_1b597af1)) - hash_e1735eba(iTime, ({ ...p$1,
    type: "Vec3",
    x: p$1.x - hash_ec7f8d1c
  } as t_1b597af1)),
  y: hash_e1735eba(iTime, ({ ...p$1,
    type: "Vec3",
    y: p$1.y + hash_ec7f8d1c
  } as t_1b597af1)) - hash_e1735eba(iTime, ({ ...p$1,
    type: "Vec3",
    y: p$1.y - hash_ec7f8d1c
  } as t_1b597af1)),
  z: hash_e1735eba(iTime, ({ ...p$1,
    type: "Vec3",
    z: p$1.z + hash_ec7f8d1c
  } as t_1b597af1)) - hash_e1735eba(iTime, ({ ...p$1,
    type: "Vec3",
    z: p$1.z - hash_ec7f8d1c
  } as t_1b597af1))
} as t_1b597af1));

/**
```
const vec3#1b424e12 = (v#:0: Vec2#78566d10, z#:1: float#builtin): Vec3#1b597af1 ={}> Vec3#1b597af1{
    ...v#:0,
    z#1b597af1#0: z#:1,
}
(v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, z#:1: float): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: z#:1,
    x: _#:0,
    y: _#:0,
}
```
*/
export const hash_1b424e12: (arg_0: t_78566d10, arg_1: number) => t_1b597af1 = (v: t_78566d10, z: number) => ({ ...v,
  type: "Vec3",
  z: z
} as t_1b597af1);

/**
```
const radians#19bbb79c = (degrees#:0: float#builtin): float#builtin ={}> degrees#:0 /#builtin 180.0 
    *#builtin PI#builtin
(degrees#:0: float): float => degrees#:0 / 180 * PI
```
*/
export const hash_19bbb79c: (arg_0: number) => number = (degrees: number) => degrees / 180 * PI;

/**
```
const ScaleVec2Rev#72d6e294 = Div#2b90cfd4<Vec2#78566d10, float#builtin, Vec2#78566d10>{
    "/"#2b90cfd4#0: (v#:0: Vec2#78566d10, scale#:1: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: v#:0.x#78566d10#0 /#builtin scale#:1,
        y#78566d10#1: v#:0.y#78566d10#1 /#builtin scale#:1,
    },
}
Div#⚽🤮🍡{TODO SPREADs}{
    h2b90cfd4_0: (v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, scale#:1: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 / scale#:1,
        y: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 / scale#:1,
    },
}
```
*/
export const hash_72d6e294: t_2b90cfd4<t_78566d10, number, t_78566d10> = ({
  type: "2b90cfd4",
  h2b90cfd4_0: (v: t_78566d10, scale: number) => ({
    type: "Vec2",
    x: v.x / scale,
    y: v.y / scale
  } as t_78566d10)
} as t_2b90cfd4<t_78566d10, number, t_78566d10>);

/**
```
const AddSubVec2#482bc839 = AddSub#70e0d6d0<Vec2#78566d10, Vec2#78566d10, Vec2#78566d10>{
    "+"#70e0d6d0#0: (one#:0: Vec2#78566d10, two#:1: Vec2#78566d10): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: one#:0.x#78566d10#0 +#builtin two#:1.x#78566d10#0,
        y#78566d10#1: one#:0.y#78566d10#1 +#builtin two#:1.y#78566d10#1,
    },
    "-"#70e0d6d0#1: (one#:2: Vec2#78566d10, two#:3: Vec2#78566d10): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: one#:2.x#78566d10#0 -#builtin two#:3.x#78566d10#0,
        y#78566d10#1: one#:2.y#78566d10#1 -#builtin two#:3.y#78566d10#1,
    },
}
AddSub#🍼🥵🗽😃{TODO SPREADs}{
    h70e0d6d0_0: (one#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, two#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
    h70e0d6d0_1: (one#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃, two#:3: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - two#:3.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - two#:3.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
}
```
*/
export const hash_482bc839: t_70e0d6d0<t_78566d10, t_78566d10, t_78566d10> = ({
  type: "70e0d6d0",
  h70e0d6d0_0: (one: t_78566d10, two: t_78566d10) => ({
    type: "Vec2",
    x: one.x + two.x,
    y: one.y + two.y
  } as t_78566d10),
  h70e0d6d0_1: (one$2: t_78566d10, two$3: t_78566d10) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_78566d10)
} as t_70e0d6d0<t_78566d10, t_78566d10, t_78566d10>);

/**
```
const white#7579bd1c = Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: 1.0}
Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 1, x: 1, y: 1}
```
*/
export const hash_7579bd1c: t_1b597af1 = ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_1b597af1);

/**
```
const ScaleVec3_#a5e3bb34 = Mul#49fef1f5<Vec3#1b597af1, float#builtin, Vec3#1b597af1>{
    "*"#49fef1f5#0: (v#:0: Vec3#1b597af1, scale#:1: float#builtin): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: v#:0.x#78566d10#0 *#builtin scale#:1,
        y#78566d10#1: v#:0.y#78566d10#1 *#builtin scale#:1,
        z#1b597af1#0: v#:0.z#1b597af1#0 *#builtin scale#:1,
    },
}
Mul#🐺🎇🤟😃{TODO SPREADs}{
    h49fef1f5_0: (v#:0: Vec3#🗻🌻🤽‍♂️, scale#:1: float): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: v#:0.#Vec3#🗻🌻🤽‍♂️#0 * scale#:1,
        x: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * scale#:1,
        y: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * scale#:1,
    },
}
```
*/
export const hash_a5e3bb34: t_49fef1f5<t_1b597af1, number, t_1b597af1> = ({
  type: "49fef1f5",
  h49fef1f5_0: (v: t_1b597af1, scale: number) => ({
    type: "Vec3",
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale
  } as t_1b597af1)
} as t_49fef1f5<t_1b597af1, number, t_1b597af1>);

/**
```
const isPointingTowardLight#f33aec9a = (
    iTime#:0: float#builtin,
    p#:1: Vec3#1b597af1,
    lightPos#:2: Vec3#1b597af1,
): bool#builtin ={}> {
    const N#:3 = estimateNormal#48ad3d0c(iTime#:0, p#:1);
    const L#:4 = normalize#35d412d2(v: lightPos#:2 -#3de90345#70e0d6d0#1 p#:1);
    const dotLN#:5 = dot#489fc39f(a: L#:4, b: N#:3);
    dotLN#:5 >=#builtin 0.0;
}
(iTime#:0: float, p#:1: Vec3#🗻🌻🤽‍♂️, lightPos#:2: Vec3#🗻🌻🤽‍♂️): bool => dot#☁️🪀💢😃(
    normalize#☕🧑‍🏫🛩️(AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(lightPos#:2, p#:1)),
    estimateNormal#👩‍🌾🚨💥😃(iTime#:0, p#:1),
) >= 0
```
*/
export const hash_f33aec9a: (arg_0: number, arg_1: t_1b597af1, arg_2: t_1b597af1) => boolean = (iTime: number, p$1: t_1b597af1, lightPos: t_1b597af1) => hash_489fc39f(hash_35d412d2(hash_3de90345.h70e0d6d0_1(lightPos, p$1)), hash_48ad3d0c(iTime, p$1)) >= 0;

/**
```
const MAX_DIST#0ce717e6 = 100.0
100
```
*/
export const hash_0ce717e6: number = 100;

/**
```
const MIN_DIST#f2cd39b8 = 0.0
0
```
*/
export const hash_f2cd39b8: number = 0;

/**
```
const rec shortestDistanceToSurface#38b09114 = (
    iTime#:0: float#builtin,
    eye#:1: Vec3#1b597af1,
    marchingDirection#:2: Vec3#1b597af1,
    start#:3: float#builtin,
    end#:4: float#builtin,
    stepsLeft#:5: int#builtin,
): float#builtin ={}> {
    if stepsLeft#:5 <=#builtin 0 {
        end#:4;
    } else {
        const dist#:6 = sceneSDF#e1735eba(
            iTime#:0,
            samplePoint: eye#:1 
                +#3de90345#70e0d6d0#0 start#:3 *#11ee14c0#49fef1f5#0 marchingDirection#:2,
        );
        if dist#:6 <#builtin EPSILON#ec7f8d1c {
            start#:3;
        } else {
            const depth#:7 = start#:3 +#builtin dist#:6;
            if depth#:7 >=#builtin end#:4 {
                end#:4;
            } else {
                38b09114#self(
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
(
    iTime#:0: float,
    eye#:1: Vec3#🗻🌻🤽‍♂️,
    marchingDirection#:2: Vec3#🗻🌻🤽‍♂️,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
): float => {
    for (; stepsLeft#:5 > 0; stepsLeft#:5 = stepsLeft#:5 - 1) {
        const dist#:6: float = sceneSDF#🥟(
            iTime#:0,
            AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
                eye#:1,
                ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(start#:3, marchingDirection#:2),
            ),
        );
        if dist#:6 < EPSILON#🧑‍💻 {
            return start#:3;
        } else {
            const depth#:7: float = start#:3 + dist#:6;
            if depth#:7 >= end#:4 {
                return end#:4;
            } else {
                start#:3 = depth#:7;
                continue;
            };
        };
    };
    return end#:4;
}
```
*/
export const hash_38b09114: (arg_0: number, arg_1: t_1b597af1, arg_2: t_1b597af1, arg_3: number, arg_4: number, arg_5: number) => number = (iTime: number, eye: t_1b597af1, marchingDirection: t_1b597af1, start: number, end: number, stepsLeft: number) => {
  for (; stepsLeft > 0; stepsLeft = stepsLeft - 1) {
    let dist: number = hash_e1735eba(iTime, hash_3de90345.h70e0d6d0_0(eye, hash_11ee14c0.h49fef1f5_0(start, marchingDirection)));

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
const rayDirection#4f8fc2b8 = (
    fieldOfView#:0: float#builtin,
    size#:1: Vec2#78566d10,
    fragCoord#:2: Vec2#78566d10,
): Vec3#1b597af1 ={}> {
    const xy#:3 = fragCoord#:2 -#482bc839#70e0d6d0#1 size#:1 /#72d6e294#2b90cfd4#0 2.0;
    const z#:4 = size#:1.y#78566d10#1 
        /#builtin tan#builtin(radians#19bbb79c(degrees: fieldOfView#:0) /#builtin 2.0);
    normalize#35d412d2(v: vec3#1b424e12(v: xy#:3, z: -z#:4));
}
(fieldOfView#:0: float, size#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, fragCoord#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec3#🗻🌻🤽‍♂️ => normalize#☕🧑‍🏫🛩️(
    vec3#🦒🗯️🤽(
        AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
            fragCoord#:2,
            ScaleVec2Rev#🍖🤾‍♂️🚊😃.#Div#⚽🤮🍡#0(size#:1, 2),
        ),
        -size#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 / tan(radians#🌟🧭🏄‍♀️(fieldOfView#:0) / 2),
    ),
)
```
*/
export const hash_4f8fc2b8: (arg_0: number, arg_1: t_78566d10, arg_2: t_78566d10) => t_1b597af1 = (fieldOfView: number, size: t_78566d10, fragCoord: t_78566d10) => hash_35d412d2(hash_1b424e12(hash_482bc839.h70e0d6d0_1(fragCoord, hash_72d6e294.h2b90cfd4_0(size, 2)), -(size.y / tan(hash_19bbb79c(fieldOfView) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
255
```
*/
export const hash_62404440: number = 255;

/**
```
const dot#c8c58fec = (a#:0: Vec2#78566d10, b#:1: Vec2#78566d10): float#builtin ={}> {
    a#:0.x#78566d10#0 *#builtin b#:1.x#78566d10#0 
        +#builtin a#:0.y#78566d10#1 *#builtin b#:1.y#78566d10#1;
}
(a#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, b#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): float => a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1
```
*/
export const hash_c8c58fec: (arg_0: t_78566d10, arg_1: t_78566d10) => number = (a: t_78566d10, b: t_78566d10) => a.x * b.x + a.y * b.y;

/**
```
const fract#14e72ade = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
(v#:0: float): float => v#:0 - floor(v#:0)
```
*/
export const hash_14e72ade: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const Scale4#6c38738c = Div#2b90cfd4<Vec4#38dc9122, float#builtin, Vec4#38dc9122>{
    "/"#2b90cfd4#0: (v#:0: Vec4#38dc9122, scale#:1: float#builtin): Vec4#38dc9122 ={}> Vec4#38dc9122{
        z#1b597af1#0: v#:0.z#1b597af1#0 /#builtin scale#:1,
        x#78566d10#0: v#:0.x#78566d10#0 /#builtin scale#:1,
        y#78566d10#1: v#:0.y#78566d10#1 /#builtin scale#:1,
        w#38dc9122#0: v#:0.w#38dc9122#0 /#builtin scale#:1,
    },
}
Div#⚽🤮🍡{TODO SPREADs}{
    h2b90cfd4_0: (v#:0: Vec4#🧑‍🎨🎪🌔, scale#:1: float): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{
        w: v#:0.#Vec4#🧑‍🎨🎪🌔#0 / scale#:1,
        z: v#:0.#Vec3#🗻🌻🤽‍♂️#0 / scale#:1,
    },
}
```
*/
export const hash_6c38738c: t_2b90cfd4<t_38dc9122, number, t_38dc9122> = ({
  type: "2b90cfd4",
  h2b90cfd4_0: (v: t_38dc9122, scale: number) => ({
    type: "Vec4",
    z: v.z / scale,
    x: v.x / scale,
    y: v.y / scale,
    w: v.w / scale
  } as t_38dc9122)
} as t_2b90cfd4<t_38dc9122, number, t_38dc9122>);

/**
```
const fishingBoueys#d7b2114a = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#78566d10,
    iResolution#:2: Vec2#78566d10,
): Vec4#38dc9122 ={}> {
    const dir#:3 = rayDirection#4f8fc2b8(fieldOfView: 45.0, size: iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.0, z#1b597af1#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#38b09114(
        iTime#:0,
        eye#:4,
        marchingDirection: dir#:3,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    const light#:6 = 0.2;
    if dist#:5 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c {
        Vec4#38dc9122{
            z#1b597af1#0: 0.0,
            x#78566d10#0: 0.0,
            y#78566d10#1: 0.0,
            w#38dc9122#0: 1.0,
        };
    } else {
        const worldPosForPixel#:7 = eye#:4 
            +#3de90345#70e0d6d0#0 dist#:5 *#11ee14c0#49fef1f5#0 dir#:3;
        const K_a#:8 = Vec3#1b597af1{x#78566d10#0: 0.9, y#78566d10#1: 0.2, z#1b597af1#0: 0.3};
        const K_d#:9 = Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.2, z#1b597af1#0: 0.7};
        const K_s#:10 = Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: 1.0};
        const shininess#:11 = 10.0;
        const light1Pos#:12 = Vec3#1b597af1{
            x#78566d10#0: 10.0 *#builtin sin#builtin(iTime#:0),
            y#78566d10#1: 10.0 *#builtin cos#builtin(iTime#:0),
            z#1b597af1#0: 5.0,
        };
        const toLight#:13 = light1Pos#:12 -#3de90345#70e0d6d0#1 worldPosForPixel#:7;
        if isPointingTowardLight#f33aec9a(iTime#:0, p: worldPosForPixel#:7, lightPos: light1Pos#:12) {
            const marchToLight#:14 = shortestDistanceToSurface#38b09114(
                iTime#:0,
                eye: light1Pos#:12,
                marchingDirection: -1.0 *#11ee14c0#49fef1f5#0 normalize#35d412d2(v: toLight#:13),
                start: MIN_DIST#f2cd39b8,
                end: MAX_DIST#0ce717e6,
                stepsLeft: MAX_MARCHING_STEPS#62404440,
            );
            if marchToLight#:14 
                >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c *#builtin 10.0 {
                Vec4#38dc9122{...white#7579bd1c *#a5e3bb34#49fef1f5#0 light#:6, w#38dc9122#0: 1.0};
            } else {
                const offset#:15 = marchToLight#:14 -#builtin length#78bdad43(v: toLight#:13);
                const penumbra#:16 = 0.1;
                if offset#:15 <#builtin -EPSILON#ec7f8d1c *#builtin 1000.0 {
                    Vec4#38dc9122{
                        ...white#7579bd1c *#a5e3bb34#49fef1f5#0 light#:6,
                        w#38dc9122#0: 1.0,
                    };
                } else {
                    Vec4#38dc9122{...white#7579bd1c, w#38dc9122#0: 1.0};
                };
            };
        } else {
            Vec4#38dc9122{...white#7579bd1c *#a5e3bb34#49fef1f5#0 light#:6, w#38dc9122#0: 1.0};
        };
    };
}
(iTime#:0: float, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, iResolution#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec4#🧑‍🎨🎪🌔 => {
    const dir#:3: Vec3#🗻🌻🤽‍♂️ = rayDirection#🥮🪀🤦😃(45, iResolution#:2, fragCoord#:1);
    const eye#:4: Vec3#🗻🌻🤽‍♂️ = Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 5, x: 0, y: 0};
    const dist#:5: float = shortestDistanceToSurface#👨‍🏭😶🌒(
        iTime#:0,
        eye#:4,
        dir#:3,
        MIN_DIST#🤾‍♂️,
        MAX_DIST#🥅👬👨‍🦰,
        MAX_MARCHING_STEPS#😟😗🦦😃,
    );
    if dist#:5 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 {
        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: 0};
    } else {
        const worldPosForPixel#:7: Vec3#🗻🌻🤽‍♂️ = AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
            eye#:4,
            ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(dist#:5, dir#:3),
        );
        const light1Pos#:12: Vec3#🗻🌻🤽‍♂️ = Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
            z: 5,
            x: 10 * sin(iTime#:0),
            y: 10 * cos(iTime#:0),
        };
        const toLight#:13: Vec3#🗻🌻🤽‍♂️ = AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
            light1Pos#:12,
            worldPosForPixel#:7,
        );
        if isPointingTowardLight#🖖(iTime#:0, worldPosForPixel#:7, light1Pos#:12) {
            const marchToLight#:14: float = shortestDistanceToSurface#👨‍🏭😶🌒(
                iTime#:0,
                light1Pos#:12,
                ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(-1, normalize#☕🧑‍🏫🛩️(toLight#:13)),
                MIN_DIST#🤾‍♂️,
                MAX_DIST#🥅👬👨‍🦰,
                MAX_MARCHING_STEPS#😟😗🦦😃,
            );
            if marchToLight#:14 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 * 10 {
                return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
            } else {
                if marchToLight#:14 - length#🤵‍♀️⌛🌒😃(toLight#:13) < -EPSILON#🧑‍💻 * 1000 {
                    return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
                } else {
                    return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
                };
            };
        } else {
            return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
        };
    };
}
```
*/
export const hash_d7b2114a: (arg_0: number, arg_1: t_78566d10, arg_2: t_78566d10) => t_38dc9122 = (iTime: number, fragCoord$1: t_78566d10, iResolution: t_78566d10) => {
  let dir: t_1b597af1 = hash_4f8fc2b8(45, iResolution, fragCoord$1);
  let eye$4: t_1b597af1 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_1b597af1);
  let dist$5: number = hash_38b09114(iTime, eye$4, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$5 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_38dc9122);
  } else {
    let worldPosForPixel: t_1b597af1 = hash_3de90345.h70e0d6d0_0(eye$4, hash_11ee14c0.h49fef1f5_0(dist$5, dir));
    let light1Pos: t_1b597af1 = ({
      type: "Vec3",
      x: 10 * sin(iTime),
      y: 10 * cos(iTime),
      z: 5
    } as t_1b597af1);
    let toLight: t_1b597af1 = hash_3de90345.h70e0d6d0_1(light1Pos, worldPosForPixel);

    if (hash_f33aec9a(iTime, worldPosForPixel, light1Pos)) {
      let marchToLight: number = hash_38b09114(iTime, light1Pos, hash_11ee14c0.h49fef1f5_0(-1, hash_35d412d2(toLight)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

      if (marchToLight > hash_0ce717e6 - hash_ec7f8d1c * 10) {
        return ({ ...hash_a5e3bb34.h49fef1f5_0(hash_7579bd1c, 0.2),
          type: "Vec4",
          w: 1
        } as t_38dc9122);
      } else {
        if (marchToLight - hash_78bdad43(toLight) < -hash_ec7f8d1c * 1000) {
          return ({ ...hash_a5e3bb34.h49fef1f5_0(hash_7579bd1c, 0.2),
            type: "Vec4",
            w: 1
          } as t_38dc9122);
        } else {
          return ({ ...hash_7579bd1c,
            type: "Vec4",
            w: 1
          } as t_38dc9122);
        }
      }
    } else {
      return ({ ...hash_a5e3bb34.h49fef1f5_0(hash_7579bd1c, 0.2),
        type: "Vec4",
        w: 1
      } as t_38dc9122);
    }
  }
};

/**
```
const red#71629e7c = Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 0.0, z#1b597af1#0: 0.0}
Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 1, y: 0}
```
*/
export const hash_71629e7c: t_1b597af1 = ({
  type: "Vec3",
  x: 1,
  y: 0,
  z: 0
} as t_1b597af1);

/**
```
const AddSubVec4#5f52bff1 = AddSub#70e0d6d0<Vec4#38dc9122, Vec4#38dc9122, Vec4#38dc9122>{
    "+"#70e0d6d0#0: (one#:0: Vec4#38dc9122, two#:1: Vec4#38dc9122): Vec4#38dc9122 ={}> Vec4#38dc9122{
        z#1b597af1#0: one#:0.z#1b597af1#0 +#builtin two#:1.z#1b597af1#0,
        x#78566d10#0: one#:0.x#78566d10#0 +#builtin two#:1.x#78566d10#0,
        y#78566d10#1: one#:0.y#78566d10#1 +#builtin two#:1.y#78566d10#1,
        w#38dc9122#0: one#:0.w#38dc9122#0 +#builtin two#:1.w#38dc9122#0,
    },
    "-"#70e0d6d0#1: (one#:2: Vec4#38dc9122, two#:3: Vec4#38dc9122): Vec4#38dc9122 ={}> Vec4#38dc9122{
        z#1b597af1#0: one#:2.z#1b597af1#0 -#builtin two#:3.z#1b597af1#0,
        x#78566d10#0: one#:2.x#78566d10#0 -#builtin two#:3.x#78566d10#0,
        y#78566d10#1: one#:2.y#78566d10#1 -#builtin two#:3.y#78566d10#1,
        w#38dc9122#0: one#:2.w#38dc9122#0 -#builtin two#:3.w#38dc9122#0,
    },
}
AddSub#🍼🥵🗽😃{TODO SPREADs}{
    h70e0d6d0_0: (one#:0: Vec4#🧑‍🎨🎪🌔, two#:1: Vec4#🧑‍🎨🎪🌔): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{
        w: one#:0.#Vec4#🧑‍🎨🎪🌔#0 + two#:1.#Vec4#🧑‍🎨🎪🌔#0,
        z: one#:0.#Vec3#🗻🌻🤽‍♂️#0 + two#:1.#Vec3#🗻🌻🤽‍♂️#0,
    },
    h70e0d6d0_1: (one#:2: Vec4#🧑‍🎨🎪🌔, two#:3: Vec4#🧑‍🎨🎪🌔): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{
        w: one#:2.#Vec4#🧑‍🎨🎪🌔#0 - two#:3.#Vec4#🧑‍🎨🎪🌔#0,
        z: one#:2.#Vec3#🗻🌻🤽‍♂️#0 - two#:3.#Vec3#🗻🌻🤽‍♂️#0,
    },
}
```
*/
export const hash_5f52bff1: t_70e0d6d0<t_38dc9122, t_38dc9122, t_38dc9122> = ({
  type: "70e0d6d0",
  h70e0d6d0_0: (one: t_38dc9122, two: t_38dc9122) => ({
    type: "Vec4",
    z: one.z + two.z,
    x: one.x + two.x,
    y: one.y + two.y,
    w: one.w + two.w
  } as t_38dc9122),
  h70e0d6d0_1: (one$2: t_38dc9122, two$3: t_38dc9122) => ({
    type: "Vec4",
    z: one$2.z - two$3.z,
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    w: one$2.w - two$3.w
  } as t_38dc9122)
} as t_70e0d6d0<t_38dc9122, t_38dc9122, t_38dc9122>);

/**
```
const MulVec2#85252e14 = Div#2b90cfd4<Vec2#78566d10, Vec2#78566d10, Vec2#78566d10>{
    "/"#2b90cfd4#0: (v#:0: Vec2#78566d10, scale#:1: Vec2#78566d10): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: v#:0.x#78566d10#0 /#builtin scale#:1.x#78566d10#0,
        y#78566d10#1: v#:0.y#78566d10#1 /#builtin scale#:1.y#78566d10#1,
    },
}
Div#⚽🤮🍡{TODO SPREADs}{
    h2b90cfd4_0: (v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, scale#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 / scale#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 / scale#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
}
```
*/
export const hash_85252e14: t_2b90cfd4<t_78566d10, t_78566d10, t_78566d10> = ({
  type: "2b90cfd4",
  h2b90cfd4_0: (v: t_78566d10, scale: t_78566d10) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_78566d10)
} as t_2b90cfd4<t_78566d10, t_78566d10, t_78566d10>);

/**
```
const random#d9cae79c = (st#:0: Vec2#78566d10): float#builtin ={}> {
    fract#14e72ade(
        v: sin#builtin(
                dot#c8c58fec(
                    a: st#:0,
                    b: Vec2#78566d10{x#78566d10#0: 12.9898, y#78566d10#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
(st#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃): float => fract#🧃💑🤶(
    sin(dot#🎿(st#:0, Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 12.9898, y: 78.233})) * 43758.5453123,
)
```
*/
export const hash_d9cae79c: (arg_0: t_78566d10) => number = (st: t_78566d10) => hash_14e72ade(sin(hash_c8c58fec(st, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_78566d10))) * 43758.5453123);

/**
```
const round#6e17a683 = (v#:0: Vec2#78566d10): Vec2#78566d10 ={}> Vec2#78566d10{
    x#78566d10#0: round#builtin(v#:0.x#78566d10#0),
    y#78566d10#1: round#builtin(v#:0.y#78566d10#1),
}
(v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
    x: round(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0),
    y: round(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1),
}
```
*/
export const hash_6e17a683: (arg_0: t_78566d10) => t_78566d10 = (v: t_78566d10) => ({
  type: "Vec2",
  x: round(v.x),
  y: round(v.y)
} as t_78566d10);

/**
```
const Vec2float#4adf81cc = Mul#49fef1f5<Vec2#78566d10, float#builtin, Vec2#78566d10>{
    "*"#49fef1f5#0: (v#:0: Vec2#78566d10, scale#:1: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: v#:0.x#78566d10#0 *#builtin scale#:1,
        y#78566d10#1: v#:0.y#78566d10#1 *#builtin scale#:1,
    },
}
Mul#🐺🎇🤟😃{TODO SPREADs}{
    h49fef1f5_0: (v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, scale#:1: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * scale#:1,
        y: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * scale#:1,
    },
}
```
*/
export const hash_4adf81cc: t_49fef1f5<t_78566d10, number, t_78566d10> = ({
  type: "49fef1f5",
  h49fef1f5_0: (v: t_78566d10, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_78566d10)
} as t_49fef1f5<t_78566d10, number, t_78566d10>);

/**
```
const randFolks#02faa664 = (env#:0: GLSLEnv#5cec7724, fragCoord#:1: Vec2#78566d10): Vec4#38dc9122 ={}> {
    const scale#:2 = 14.0;
    const small#:3 = round#6e17a683(v: fragCoord#:1 /#72d6e294#2b90cfd4#0 scale#:2) 
        *#4adf81cc#49fef1f5#0 scale#:2;
    const small#:4 = Vec2#78566d10{
        x#78566d10#0: small#:3.x#78566d10#0,
        y#78566d10#1: small#:3.y#78566d10#1 +#builtin env#:0.time#5cec7724#0,
    };
    const v#:5 = random#d9cae79c(st: small#:4 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const two#:6 = Vec4#38dc9122{...red#71629e7c *#a5e3bb34#49fef1f5#0 v#:5, w#38dc9122#0: 1.0} 
        +#5f52bff1#70e0d6d0#0 fishingBoueys#d7b2114a(
            iTime: env#:0.time#5cec7724#0,
            fragCoord#:1,
            iResolution: env#:0.resolution#5cec7724#1,
        );
    two#:6 /#6c38738c#2b90cfd4#0 2.0;
}
(env#:0: GLSLEnv#🎪🌇👪😃, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec4#🧑‍🎨🎪🌔 => {
    const small#:3: Vec2#🧑‍🔧🏄‍♀️🕤😃 = Vec2float#👨‍❤️‍👨🏒🤜😃.#Mul#🐺🎇🤟😃#0(
        round#🌶️👤🥢😃(ScaleVec2Rev#🍖🤾‍♂️🚊😃.#Div#⚽🤮🍡#0(fragCoord#:1, 14)),
        14,
    );
    return Scale4#🌓🐿️🍧😃.#Div#⚽🤮🍡#0(
        AddSubVec4#🪁🙌🐺😃.#AddSub#🍼🥵🗽😃#0(
            Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0},
            fishingBoueys#👨‍🍼(
                env#:0.#GLSLEnv#🎪🌇👪😃#0,
                fragCoord#:1,
                env#:0.#GLSLEnv#🎪🌇👪😃#1,
            ),
        ),
        2,
    );
}
```
*/
export const hash_02faa664: (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122 = (env: t_5cec7724, fragCoord$1: t_78566d10) => {
  let small: t_78566d10 = hash_4adf81cc.h49fef1f5_0(hash_6e17a683(hash_72d6e294.h2b90cfd4_0(fragCoord$1, 14)), 14);
  return hash_6c38738c.h2b90cfd4_0(hash_5f52bff1.h70e0d6d0_0(({ ...hash_a5e3bb34.h49fef1f5_0(hash_71629e7c, hash_d9cae79c(hash_85252e14.h2b90cfd4_0(({
      type: "Vec2",
      x: small.x,
      y: small.y + env.time
    } as t_78566d10), env.resolution)) / 10 + 0.9),
    type: "Vec4",
    w: 1
  } as t_38dc9122), hash_d7b2114a(env.time, fragCoord$1, env.resolution)), 2);
};
export const randFolks = hash_02faa664;