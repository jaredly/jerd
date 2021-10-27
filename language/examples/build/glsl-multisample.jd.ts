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
@ffi("Mat4") type Mat4#314455dc = {
    r1: Vec4#38dc9122,
    r2: Vec4#38dc9122,
    r3: Vec4#38dc9122,
    r4: Vec4#38dc9122,
}
```
*/
type t_314455dc = {
  type: "Mat4";
  r1: t_38dc9122;
  r2: t_38dc9122;
  r3: t_38dc9122;
  r4: t_38dc9122;
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
const dot#21b15460 = (a#:0: Vec4#38dc9122, b#:1: Vec4#38dc9122): float#builtin ={}> {
    a#:0.x#78566d10#0 *#builtin b#:1.x#78566d10#0 
                +#builtin a#:0.y#78566d10#1 *#builtin b#:1.y#78566d10#1 
            +#builtin a#:0.z#1b597af1#0 *#builtin b#:1.z#1b597af1#0 
        +#builtin a#:0.w#38dc9122#0 *#builtin b#:1.w#38dc9122#0;
}
(a#:0: Vec4#🧑‍🎨🎪🌔, b#:1: Vec4#🧑‍🎨🎪🌔): float => a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + a#:0.#Vec3#🗻🌻🤽‍♂️#0 * b#:1.#Vec3#🗻🌻🤽‍♂️#0 + a#:0.#Vec4#🧑‍🎨🎪🌔#0 * b#:1.#Vec4#🧑‍🎨🎪🌔#0
```
*/
export const hash_21b15460: (arg_0: t_38dc9122, arg_1: t_38dc9122) => number = (a: t_38dc9122, b: t_38dc9122) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

/**
```
const vec4#1eaae93f = (
    x#:0: float#builtin,
    y#:1: float#builtin,
    z#:2: float#builtin,
    w#:3: float#builtin,
): Vec4#38dc9122 ={}> Vec4#38dc9122{
    z#1b597af1#0: z#:2,
    x#78566d10#0: x#:0,
    y#78566d10#1: y#:1,
    w#38dc9122#0: w#:3,
}
(x#:0: float, y#:1: float, z#:2: float, w#:3: float): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{
    w: w#:3,
    z: z#:2,
}
```
*/
export const hash_1eaae93f: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_38dc9122 = (x: number, y: number, z: number, w: number) => ({
  type: "Vec4",
  z: z,
  x: x,
  y: y,
  w: w
} as t_38dc9122);

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
const cross#22741973 = (one#:0: Vec3#1b597af1, two#:1: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: one#:0.y#78566d10#1 *#builtin two#:1.z#1b597af1#0 
        -#builtin two#:1.y#78566d10#1 *#builtin one#:0.z#1b597af1#0,
    y#78566d10#1: one#:0.z#1b597af1#0 *#builtin two#:1.x#78566d10#0 
        -#builtin two#:1.z#1b597af1#0 *#builtin one#:0.x#78566d10#0,
    z#1b597af1#0: one#:0.x#78566d10#0 *#builtin two#:1.y#78566d10#1 
        -#builtin two#:1.x#78566d10#0 *#builtin one#:0.y#78566d10#1,
}
(one#:0: Vec3#🗻🌻🤽‍♂️, two#:1: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    x: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * two#:1.#Vec3#🗻🌻🤽‍♂️#0 - two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * one#:0.#Vec3#🗻🌻🤽‍♂️#0,
    y: one#:0.#Vec3#🗻🌻🤽‍♂️#0 * two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - two#:1.#Vec3#🗻🌻🤽‍♂️#0 * one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
}
```
*/
export const hash_22741973: (arg_0: t_1b597af1, arg_1: t_1b597af1) => t_1b597af1 = (one: t_1b597af1, two: t_1b597af1) => ({
  type: "Vec3",
  x: one.y * two.z - two.y * one.z,
  y: one.z * two.x - two.z * one.x,
  z: one.x * two.y - two.x * one.y
} as t_1b597af1);

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
export const hash_1b424e12: (arg_0: t_78566d10, arg_1: number) => t_1b597af1 = (v: t_78566d10, z$1: number) => ({ ...v,
  type: "Vec3",
  z: z$1
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
const EPSILON#17261aaa = 0.0001
0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const vec3#01833af0 = (x#:0: float#builtin, y#:1: float#builtin, z#:2: float#builtin): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: x#:0,
    y#78566d10#1: y#:1,
    z#1b597af1#0: z#:2,
}
(x#:0: float, y#:1: float, z#:2: float): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: z#:2,
    x: x#:0,
    y: y#:1,
}
```
*/
export const hash_01833af0: (arg_0: number, arg_1: number, arg_2: number) => t_1b597af1 = (x: number, y: number, z: number) => ({
  type: "Vec3",
  x: x,
  y: y,
  z: z
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
const MatByVector#5209b424 = Mul#49fef1f5<Mat4#314455dc, Vec4#38dc9122, Vec4#38dc9122>{
    "*"#49fef1f5#0: (mat#:0: Mat4#314455dc, vec#:1: Vec4#38dc9122): Vec4#38dc9122 ={}> Vec4#38dc9122{
        z#1b597af1#0: dot#21b15460(a: mat#:0.r3#314455dc#2, b: vec#:1),
        x#78566d10#0: dot#21b15460(a: mat#:0.r1#314455dc#0, b: vec#:1),
        y#78566d10#1: dot#21b15460(a: mat#:0.r2#314455dc#1, b: vec#:1),
        w#38dc9122#0: dot#21b15460(a: mat#:0.r4#314455dc#3, b: vec#:1),
    },
}
Mul#🐺🎇🤟😃{TODO SPREADs}{
    h49fef1f5_0: (mat#:0: Mat4#👩‍👩‍👦‍👦👩‍🏭🕋, vec#:1: Vec4#🧑‍🎨🎪🌔): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{
        w: dot#🤡😫🐇(mat#:0.#Mat4#👩‍👩‍👦‍👦👩‍🏭🕋#3, vec#:1),
        z: dot#🤡😫🐇(mat#:0.#Mat4#👩‍👩‍👦‍👦👩‍🏭🕋#2, vec#:1),
    },
}
```
*/
export const hash_5209b424: t_49fef1f5<t_314455dc, t_38dc9122, t_38dc9122> = ({
  type: "49fef1f5",
  h49fef1f5_0: (mat: t_314455dc, vec: t_38dc9122) => ({
    type: "Vec4",
    z: hash_21b15460(mat.r3, vec),
    x: hash_21b15460(mat.r1, vec),
    y: hash_21b15460(mat.r2, vec),
    w: hash_21b15460(mat.r4, vec)
  } as t_38dc9122)
} as t_49fef1f5<t_314455dc, t_38dc9122, t_38dc9122>);

/**
```
const xyz#052cd680 = (v#:0: Vec4#38dc9122): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: v#:0.x#78566d10#0,
    y#78566d10#1: v#:0.y#78566d10#1,
    z#1b597af1#0: v#:0.z#1b597af1#0,
}
(v#:0: Vec4#🧑‍🎨🎪🌔): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: v#:0.#Vec3#🗻🌻🤽‍♂️#0,
    x: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
    y: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
}
```
*/
export const hash_052cd680: (arg_0: t_38dc9122) => t_1b597af1 = (v: t_38dc9122) => ({
  type: "Vec3",
  x: v.x,
  y: v.y,
  z: v.z
} as t_1b597af1);

/**
```
const viewMatrix#40b5a23c = (eye#:0: Vec3#1b597af1, center#:1: Vec3#1b597af1, up#:2: Vec3#1b597af1): Mat4#314455dc ={}> {
    const f#:3 = normalize#35d412d2(v: center#:1 -#3de90345#70e0d6d0#1 eye#:0);
    const s#:4 = normalize#35d412d2(v: cross#22741973(one: f#:3, two: up#:2));
    const u#:5 = cross#22741973(one: s#:4, two: f#:3);
    Mat4#314455dc{
        r1#314455dc#0: Vec4#38dc9122{...s#:4, w#38dc9122#0: 0.0},
        r2#314455dc#1: Vec4#38dc9122{...u#:5, w#38dc9122#0: 0.0},
        r3#314455dc#2: Vec4#38dc9122{...NegVec3#68c0a879."-"#f6e074a4#0(f#:3), w#38dc9122#0: 0.0},
        r4#314455dc#3: vec4#1eaae93f(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(eye#:0: Vec3#🗻🌻🤽‍♂️, center#:1: Vec3#🗻🌻🤽‍♂️, up#:2: Vec3#🗻🌻🤽‍♂️): Mat4#👩‍👩‍👦‍👦👩‍🏭🕋 => {
    const f#:3: Vec3#🗻🌻🤽‍♂️ = normalize#☕🧑‍🏫🛩️(
        AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(center#:1, eye#:0),
    );
    const s#:4: Vec3#🗻🌻🤽‍♂️ = normalize#☕🧑‍🏫🛩️(cross#🚶‍♀️👩‍🏫🦡(f#:3, up#:2));
    return Mat4#👩‍👩‍👦‍👦👩‍🏭🕋{TODO SPREADs}{
        r1: Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 0, z: _#:0},
        r2: Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 0, z: _#:0},
        r3: Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 0, z: _#:0},
        r4: vec4#👲🥟👥(0, 0, 0, 1),
    };
}
```
*/
export const hash_40b5a23c: (arg_0: t_1b597af1, arg_1: t_1b597af1, arg_2: t_1b597af1) => t_314455dc = (eye: t_1b597af1, center: t_1b597af1, up: t_1b597af1) => {
  let f: t_1b597af1 = hash_35d412d2(hash_3de90345.h70e0d6d0_1(center, eye));
  let s: t_1b597af1 = hash_35d412d2(hash_22741973(f, up));
  return ({
    type: "Mat4",
    r1: ({ ...s,
      type: "Vec4",
      w: 0
    } as t_38dc9122),
    r2: ({ ...hash_22741973(s, f),
      type: "Vec4",
      w: 0
    } as t_38dc9122),
    r3: ({ ...hash_68c0a879.hf6e074a4_0(f),
      type: "Vec4",
      w: 0
    } as t_38dc9122),
    r4: hash_1eaae93f(0, 0, 0, 1)
  } as t_314455dc);
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
const vec4#46f27b52 = (v#:0: Vec3#1b597af1, w#:1: float#builtin): Vec4#38dc9122 ={}> Vec4#38dc9122{
    ...v#:0,
    w#38dc9122#0: w#:1,
}
(v#:0: Vec3#🗻🌻🤽‍♂️, w#:1: float): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{
    w: w#:1,
    z: _#:0,
}
```
*/
export const hash_46f27b52: (arg_0: t_1b597af1, arg_1: number) => t_38dc9122 = (v: t_1b597af1, w$1: number) => ({ ...v,
  type: "Vec4",
  w: w$1
} as t_38dc9122);

/**
```
const rotate#1f9b58ec = (tx#:0: float#builtin, ty#:1: float#builtin, tz#:2: float#builtin): Mat4#314455dc ={}> {
    const cg#:3 = cos#builtin(tx#:0);
    const sg#:4 = sin#builtin(tx#:0);
    const cb#:5 = cos#builtin(ty#:1);
    const sb#:6 = sin#builtin(ty#:1);
    const ca#:7 = cos#builtin(tz#:2);
    const sa#:8 = sin#builtin(tz#:2);
    Mat4#314455dc{
        r1#314455dc#0: vec4#1eaae93f(
            x: ca#:7 *#builtin cb#:5,
            y: ca#:7 *#builtin sb#:6 *#builtin sg#:4 -#builtin sa#:8 *#builtin cg#:3,
            z: ca#:7 *#builtin sb#:6 *#builtin cg#:3 +#builtin sa#:8 *#builtin sg#:4,
            w: 0.0,
        ),
        r2#314455dc#1: vec4#1eaae93f(
            x: sa#:8 *#builtin cb#:5,
            y: sa#:8 *#builtin sb#:6 *#builtin sg#:4 +#builtin ca#:7 *#builtin cg#:3,
            z: sa#:8 *#builtin sb#:6 *#builtin cg#:3 -#builtin ca#:7 *#builtin sg#:4,
            w: 0.0,
        ),
        r3#314455dc#2: vec4#1eaae93f(
            x: -sb#:6,
            y: cb#:5 *#builtin sg#:4,
            z: cb#:5 *#builtin cg#:3,
            w: 0.0,
        ),
        r4#314455dc#3: vec4#1eaae93f(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(tx#:0: float, ty#:1: float, tz#:2: float): Mat4#👩‍👩‍👦‍👦👩‍🏭🕋 => {
    const cg#:3: float = cos(tx#:0);
    const sg#:4: float = sin(tx#:0);
    const cb#:5: float = cos(ty#:1);
    const sb#:6: float = sin(ty#:1);
    const ca#:7: float = cos(tz#:2);
    const sa#:8: float = sin(tz#:2);
    return Mat4#👩‍👩‍👦‍👦👩‍🏭🕋{TODO SPREADs}{
        r1: vec4#👲🥟👥(
            ca#:7 * cb#:5,
            ca#:7 * sb#:6 * sg#:4 - sa#:8 * cg#:3,
            ca#:7 * sb#:6 * cg#:3 + sa#:8 * sg#:4,
            0,
        ),
        r2: vec4#👲🥟👥(
            sa#:8 * cb#:5,
            sa#:8 * sb#:6 * sg#:4 + ca#:7 * cg#:3,
            sa#:8 * sb#:6 * cg#:3 - ca#:7 * sg#:4,
            0,
        ),
        r3: vec4#👲🥟👥(-sb#:6, cb#:5 * sg#:4, cb#:5 * cg#:3, 0),
        r4: vec4#👲🥟👥(0, 0, 0, 1),
    };
}
```
*/
export const hash_1f9b58ec: (arg_0: number, arg_1: number, arg_2: number) => t_314455dc = (tx: number, ty: number, tz: number) => {
  let cg: number = cos(tx);
  let sg: number = sin(tx);
  let cb: number = cos(ty);
  let sb: number = sin(ty);
  let ca: number = cos(tz);
  let sa: number = sin(tz);
  return ({
    type: "Mat4",
    r1: hash_1eaae93f(ca * cb, ca * sb * sg - sa * cg, ca * sb * cg + sa * sg, 0),
    r2: hash_1eaae93f(sa * cb, sa * sb * sg + ca * cg, sa * sb * cg - ca * sg, 0),
    r3: hash_1eaae93f(-sb, cb * sg, cb * cg, 0),
    r4: hash_1eaae93f(0, 0, 0, 1)
  } as t_314455dc);
};

/**
```
const estimateNormal#c41d8552 = (
    sceneSDF#:0: (GLSLEnv#5cec7724, Vec3#1b597af1) ={}> float#builtin,
    env#:1: GLSLEnv#5cec7724,
    p#:2: Vec3#1b597af1,
): Vec3#1b597af1 ={}> normalize#35d412d2(
    v: vec3#01833af0(
        x: sceneSDF#:0(
                env#:1,
                Vec3#1b597af1{...p#:2, x#78566d10#0: p#:2.x#78566d10#0 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#1b597af1{...p#:2, x#78566d10#0: p#:2.x#78566d10#0 -#builtin EPSILON#17261aaa},
            ),
        y: sceneSDF#:0(
                env#:1,
                Vec3#1b597af1{...p#:2, y#78566d10#1: p#:2.y#78566d10#1 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#1b597af1{...p#:2, y#78566d10#1: p#:2.y#78566d10#1 -#builtin EPSILON#17261aaa},
            ),
        z: sceneSDF#:0(
                env#:1,
                Vec3#1b597af1{...p#:2, z#1b597af1#0: p#:2.z#1b597af1#0 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#1b597af1{...p#:2, z#1b597af1#0: p#:2.z#1b597af1#0 -#builtin EPSILON#17261aaa},
            ),
    ),
)
(
    sceneSDF#:0: (GLSLEnv#🎪🌇👪😃, Vec3#🗻🌻🤽‍♂️) => float,
    env#:1: GLSLEnv#🎪🌇👪😃,
    p#:2: Vec3#🗻🌻🤽‍♂️,
): Vec3#🗻🌻🤽‍♂️ => normalize#☕🧑‍🏫🛩️(
    vec3#🌋👨‍🦰😜(
        sceneSDF#:0(
            env#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: p#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + EPSILON#🧂💃🚶‍♂️,
                y: _#:0,
            },
        ) - sceneSDF#:0(
            env#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: p#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - EPSILON#🧂💃🚶‍♂️,
                y: _#:0,
            },
        ),
        sceneSDF#:0(
            env#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + EPSILON#🧂💃🚶‍♂️,
            },
        ) - sceneSDF#:0(
            env#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - EPSILON#🧂💃🚶‍♂️,
            },
        ),
        sceneSDF#:0(
            env#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: p#:2.#Vec3#🗻🌻🤽‍♂️#0 + EPSILON#🧂💃🚶‍♂️,
                x: _#:0,
                y: _#:0,
            },
        ) - sceneSDF#:0(
            env#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: p#:2.#Vec3#🗻🌻🤽‍♂️#0 - EPSILON#🧂💃🚶‍♂️,
                x: _#:0,
                y: _#:0,
            },
        ),
    ),
)
```
*/
export const hash_c41d8552: (arg_0: (arg_0: t_5cec7724, arg_1: t_1b597af1) => number, arg_1: t_5cec7724, arg_2: t_1b597af1) => t_1b597af1 = (sceneSDF: (arg_0: t_5cec7724, arg_1: t_1b597af1) => number, env: t_5cec7724, p: t_1b597af1) => hash_35d412d2(hash_01833af0(sceneSDF(env, ({ ...p,
  type: "Vec3",
  x: p.x + hash_17261aaa
} as t_1b597af1)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  x: p.x - hash_17261aaa
} as t_1b597af1)), sceneSDF(env, ({ ...p,
  type: "Vec3",
  y: p.y + hash_17261aaa
} as t_1b597af1)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  y: p.y - hash_17261aaa
} as t_1b597af1)), sceneSDF(env, ({ ...p,
  type: "Vec3",
  z: p.z + hash_17261aaa
} as t_1b597af1)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  z: p.z - hash_17261aaa
} as t_1b597af1))));

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
const vec4#16a20410 = (x#:0: float#builtin): Vec4#38dc9122 ={}> Vec4#38dc9122{
    z#1b597af1#0: x#:0,
    x#78566d10#0: x#:0,
    y#78566d10#1: x#:0,
    w#38dc9122#0: x#:0,
}
(x#:0: float): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: x#:0, z: x#:0}
```
*/
export const hash_16a20410: (arg_0: number) => t_38dc9122 = (x: number) => ({
  type: "Vec4",
  z: x,
  x: x,
  y: x,
  w: x
} as t_38dc9122);

/**
```
const rec shortestDistanceToSurface#d216689c = (
    sceneSDF#:0: (GLSLEnv#5cec7724, Vec3#1b597af1) ={}> float#builtin,
    env#:1: GLSLEnv#5cec7724,
    eye#:2: Vec3#1b597af1,
    marchingDirection#:3: Vec3#1b597af1,
    start#:4: float#builtin,
    end#:5: float#builtin,
    stepsLeft#:6: int#builtin,
): float#builtin ={}> {
    const dist#:7 = sceneSDF#:0(
        env#:1,
        eye#:2 +#3de90345#70e0d6d0#0 start#:4 *#11ee14c0#49fef1f5#0 marchingDirection#:3,
    );
    if dist#:7 <#builtin EPSILON#17261aaa {
        start#:4;
    } else {
        const depth#:8 = start#:4 +#builtin dist#:7;
        if depth#:8 >=#builtin end#:5 ||#builtin stepsLeft#:6 <=#builtin 0 {
            end#:5;
        } else {
            d216689c#self(
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
(
    sceneSDF#:0: (GLSLEnv#🎪🌇👪😃, Vec3#🗻🌻🤽‍♂️) => float,
    env#:1: GLSLEnv#🎪🌇👪😃,
    eye#:2: Vec3#🗻🌻🤽‍♂️,
    marchingDirection#:3: Vec3#🗻🌻🤽‍♂️,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
): float => {
    loop(unbounded) {
        const dist#:7: float = sceneSDF#:0(
            env#:1,
            AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
                eye#:2,
                ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(start#:4, marchingDirection#:3),
            ),
        );
        if dist#:7 < EPSILON#🧂💃🚶‍♂️ {
            return start#:4;
        } else {
            const depth#:8: float = start#:4 + dist#:7;
            if depth#:8 >= end#:5 || stepsLeft#:6 <= 0 {
                return end#:5;
            } else {
                start#:4 = depth#:8;
                stepsLeft#:6 = stepsLeft#:6 - 1;
                continue;
            };
        };
    };
}
```
*/
export const hash_d216689c: (arg_0: (arg_0: t_5cec7724, arg_1: t_1b597af1) => number, arg_1: t_5cec7724, arg_2: t_1b597af1, arg_3: t_1b597af1, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF: (arg_0: t_5cec7724, arg_1: t_1b597af1) => number, env: t_5cec7724, eye$2: t_1b597af1, marchingDirection: t_1b597af1, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = sceneSDF(env, hash_3de90345.h70e0d6d0_0(eye$2, hash_11ee14c0.h49fef1f5_0(start, marchingDirection)));

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
const getWorldDir#3c4872b9 = (
    resolution#:0: Vec2#78566d10,
    coord#:1: Vec2#78566d10,
    eye#:2: Vec3#1b597af1,
    fieldOfView#:3: float#builtin,
): Vec3#1b597af1 ={}> {
    const viewDir#:4 = rayDirection#4f8fc2b8(
        fieldOfView#:3,
        size: resolution#:0,
        fragCoord: coord#:1,
    );
    const eye#:5 = Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.0, z#1b597af1#0: 5.0};
    const viewToWorld#:6 = viewMatrix#40b5a23c(
        eye#:5,
        center: Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.0, z#1b597af1#0: 0.0},
        up: Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 1.0, z#1b597af1#0: 0.0},
    );
    xyz#052cd680(
        v: viewToWorld#:6 *#5209b424#49fef1f5#0 Vec4#38dc9122{...viewDir#:4, w#38dc9122#0: 0.0},
    );
}
(
    resolution#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    coord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    eye#:2: Vec3#🗻🌻🤽‍♂️,
    fieldOfView#:3: float,
): Vec3#🗻🌻🤽‍♂️ => xyz#🥔🚑😞(
    MatByVector#😶🍇👨‍🎤😃.#Mul#🐺🎇🤟😃#0(
        viewMatrix#🦎🧟😊😃(
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 5, x: 0, y: 0},
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 0, y: 0},
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 0, y: 1},
        ),
        Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 0, z: _#:0},
    ),
)
```
*/
export const hash_3c4872b9: (arg_0: t_78566d10, arg_1: t_78566d10, arg_2: t_1b597af1, arg_3: number) => t_1b597af1 = (resolution: t_78566d10, coord: t_78566d10, eye$2: t_1b597af1, fieldOfView$3: number) => hash_052cd680(hash_5209b424.h49fef1f5_0(hash_40b5a23c(({
  type: "Vec3",
  x: 0,
  y: 0,
  z: 5
} as t_1b597af1), ({
  type: "Vec3",
  x: 0,
  y: 0,
  z: 0
} as t_1b597af1), ({
  type: "Vec3",
  x: 0,
  y: 1,
  z: 0
} as t_1b597af1)), ({ ...hash_4f8fc2b8(fieldOfView$3, resolution, coord),
  type: "Vec4",
  w: 0
} as t_38dc9122)));

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
const vec2#3ac18ce8 = (x#:0: float#builtin, y#:1: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
    x#78566d10#0: x#:0,
    y#78566d10#1: y#:1,
}
(x#:0: float, y#:1: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
    x: x#:0,
    y: y#:1,
}
```
*/
export const hash_3ac18ce8: (arg_0: number, arg_1: number) => t_78566d10 = (x: number, y: number) => ({
  type: "Vec2",
  x: x,
  y: y
} as t_78566d10);

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
const rotate#3a2bf5e4 = (
    v#:0: Vec3#1b597af1,
    x#:1: float#builtin,
    y#:2: float#builtin,
    z#:3: float#builtin,
): Vec3#1b597af1 ={}> {
    xyz#052cd680(
        v: rotate#1f9b58ec(tx: x#:1, ty: y#:2, tz: z#:3) 
            *#5209b424#49fef1f5#0 vec4#46f27b52(v#:0, w: 1.0),
    );
}
(v#:0: Vec3#🗻🌻🤽‍♂️, x#:1: float, y#:2: float, z#:3: float): Vec3#🗻🌻🤽‍♂️ => xyz#🥔🚑😞(
    MatByVector#😶🍇👨‍🎤😃.#Mul#🐺🎇🤟😃#0(rotate#💁🍷🐈(x#:1, y#:2, z#:3), vec4#🛑🤞😾😃(v#:0, 1)),
)
```
*/
export const hash_3a2bf5e4: (arg_0: t_1b597af1, arg_1: number, arg_2: number, arg_3: number) => t_1b597af1 = (v: t_1b597af1, x$1: number, y$2: number, z$3: number) => hash_052cd680(hash_5209b424.h49fef1f5_0(hash_1f9b58ec(x$1, y$2, z$3), hash_46f27b52(v, 1)));

/**
```
const marchNormals#7268d13b = (sceneSDF#:0: (GLSLEnv#5cec7724, Vec3#1b597af1) ={}> float#builtin): (
    env: GLSLEnv#5cec7724,
    coord: Vec2#78566d10,
) ={}> Vec4#38dc9122 ={}> (env#:1: GLSLEnv#5cec7724, coord#:2: Vec2#78566d10): Vec4#38dc9122 ={}> {
    const eye#:3 = Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.0, z#1b597af1#0: 5.0};
    const worldDir#:4 = getWorldDir#3c4872b9(
        resolution: env#:1.resolution#5cec7724#1,
        coord#:2,
        eye#:3,
        fieldOfView: 45.0,
    );
    const maxDist#:5 = 100.0;
    const dist#:6 = shortestDistanceToSurface#d216689c(
        sceneSDF#:0,
        env#:1,
        eye#:3,
        marchingDirection: worldDir#:4,
        start: 0.0,
        end: maxDist#:5,
        stepsLeft: 255,
    );
    if dist#:6 >#builtin maxDist#:5 -#builtin EPSILON#17261aaa {
        vec4#16a20410(x: 0.0);
    } else {
        const worldPos#:7 = eye#:3 +#3de90345#70e0d6d0#0 worldDir#:4 *#a5e3bb34#49fef1f5#0 dist#:6;
        const normal#:8 = estimateNormal#c41d8552(sceneSDF#:0, env#:1, p: worldPos#:7);
        vec4#46f27b52(v: normal#:8, w: 1.0);
    };
}
(sceneSDF#:0: (GLSLEnv#🎪🌇👪😃, Vec3#🗻🌻🤽‍♂️) => float): (GLSLEnv#🎪🌇👪😃, Vec2#🧑‍🔧🏄‍♀️🕤😃) => Vec4#🧑‍🎨🎪🌔 => (
    env#:1: GLSLEnv#🎪🌇👪😃,
    coord#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃,
): Vec4#🧑‍🎨🎪🌔 => {
    const eye#:3: Vec3#🗻🌻🤽‍♂️ = Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:4: Vec3#🗻🌻🤽‍♂️ = getWorldDir#🍡🐿️🎎(
        env#:1.#GLSLEnv#🎪🌇👪😃#1,
        coord#:2,
        eye#:3,
        45,
    );
    const dist#:6: float = shortestDistanceToSurface#🤏(
        sceneSDF#:0,
        env#:1,
        eye#:3,
        worldDir#:4,
        0,
        100,
        255,
    );
    if dist#:6 > 100 - EPSILON#🧂💃🚶‍♂️ {
        return vec4#😘💛🧟‍♀️(0);
    } else {
        return vec4#🛑🤞😾😃(
            estimateNormal#🦸‍♀️(
                sceneSDF#:0,
                env#:1,
                AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
                    eye#:3,
                    ScaleVec3_#🚐.#Mul#🐺🎇🤟😃#0(worldDir#:4, dist#:6),
                ),
            ),
            1,
        );
    };
}
```
*/
export const hash_7268d13b: (arg_0: (arg_0: t_5cec7724, arg_1: t_1b597af1) => number) => (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122 = (sceneSDF: (arg_0: t_5cec7724, arg_1: t_1b597af1) => number) => (env: t_5cec7724, coord$2: t_78566d10) => {
  let eye$3: t_1b597af1 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_1b597af1);
  let worldDir: t_1b597af1 = hash_3c4872b9(env.resolution, coord$2, eye$3, 45);
  let dist$6: number = hash_d216689c(sceneSDF, env, eye$3, worldDir, 0, 100, 255);

  if (dist$6 > 100 - hash_17261aaa) {
    return hash_16a20410(0);
  } else {
    return hash_46f27b52(hash_c41d8552(sceneSDF, env, hash_3de90345.h70e0d6d0_0(eye$3, hash_a5e3bb34.h49fef1f5_0(worldDir, dist$6))), 1);
  }
};

/**
```
const multiSample#199bde21 = (fn#:0: (GLSLEnv#5cec7724, Vec2#78566d10) ={}> Vec4#38dc9122): (
    env: GLSLEnv#5cec7724,
    pos: Vec2#78566d10,
) ={}> Vec4#38dc9122 ={}> (env#:1: GLSLEnv#5cec7724, pos#:2: Vec2#78566d10): Vec4#38dc9122 ={}> {
    const total#:3 = fn#:0(env#:1, pos#:2) 
                    +#5f52bff1#70e0d6d0#0 fn#:0(
                        env#:1,
                        pos#:2 +#482bc839#70e0d6d0#0 vec2#3ac18ce8(x: 0.5, y: 0.0),
                    ) 
                +#5f52bff1#70e0d6d0#0 fn#:0(
                    env#:1,
                    pos#:2 +#482bc839#70e0d6d0#0 vec2#3ac18ce8(x: -0.5, y: 0.0),
                ) 
            +#5f52bff1#70e0d6d0#0 fn#:0(
                env#:1,
                pos#:2 +#482bc839#70e0d6d0#0 vec2#3ac18ce8(x: 0.0, y: 0.5),
            ) 
        +#5f52bff1#70e0d6d0#0 fn#:0(
            env#:1,
            pos#:2 +#482bc839#70e0d6d0#0 vec2#3ac18ce8(x: 0.0, y: -0.5),
        );
    total#:3 /#6c38738c#2b90cfd4#0 5.0;
}
(fn#:0: (GLSLEnv#🎪🌇👪😃, Vec2#🧑‍🔧🏄‍♀️🕤😃) => Vec4#🧑‍🎨🎪🌔): (
    GLSLEnv#🎪🌇👪😃,
    Vec2#🧑‍🔧🏄‍♀️🕤😃,
) => Vec4#🧑‍🎨🎪🌔 => (env#:1: GLSLEnv#🎪🌇👪😃, pos#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec4#🧑‍🎨🎪🌔 => Scale4#🌓🐿️🍧😃.#Div#⚽🤮🍡#0(
    AddSubVec4#🪁🙌🐺😃.#AddSub#🍼🥵🗽😃#0(
        AddSubVec4#🪁🙌🐺😃.#AddSub#🍼🥵🗽😃#0(
            AddSubVec4#🪁🙌🐺😃.#AddSub#🍼🥵🗽😃#0(
                AddSubVec4#🪁🙌🐺😃.#AddSub#🍼🥵🗽😃#0(
                    fn#:0(env#:1, pos#:2),
                    fn#:0(
                        env#:1,
                        AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#0(pos#:2, vec2#🙅‍♀️👻🌈(0.5, 0)),
                    ),
                ),
                fn#:0(
                    env#:1,
                    AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#0(pos#:2, vec2#🙅‍♀️👻🌈(-0.5, 0)),
                ),
            ),
            fn#:0(env#:1, AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#0(pos#:2, vec2#🙅‍♀️👻🌈(0, 0.5))),
        ),
        fn#:0(env#:1, AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#0(pos#:2, vec2#🙅‍♀️👻🌈(0, -0.5))),
    ),
    5,
)
```
*/
export const hash_199bde21: (arg_0: (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122) => (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122 = (fn: (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122) => (env: t_5cec7724, pos: t_78566d10) => hash_6c38738c.h2b90cfd4_0(hash_5f52bff1.h70e0d6d0_0(hash_5f52bff1.h70e0d6d0_0(hash_5f52bff1.h70e0d6d0_0(hash_5f52bff1.h70e0d6d0_0(fn(env, pos), fn(env, hash_482bc839.h70e0d6d0_0(pos, hash_3ac18ce8(0.5, 0)))), fn(env, hash_482bc839.h70e0d6d0_0(pos, hash_3ac18ce8(-0.5, 0)))), fn(env, hash_482bc839.h70e0d6d0_0(pos, hash_3ac18ce8(0, 0.5)))), fn(env, hash_482bc839.h70e0d6d0_0(pos, hash_3ac18ce8(0, -0.5)))), 5);

/**
```
const ok#624323e4 = multiSample#199bde21(
    fn: marchNormals#7268d13b(
        sceneSDF: (env#:0: GLSLEnv#5cec7724, pos#:1: Vec3#1b597af1): float#builtin ={}> {
            const pos#:2 = rotate#3a2bf5e4(
                v: pos#:1,
                x: 0.0,
                y: env#:0.time#5cec7724#0 /#builtin 2.0,
                z: env#:0.time#5cec7724#0,
            );
            const mag#:3 = (sin#builtin(env#:0.time#5cec7724#0 /#builtin 2.0) +#builtin 1.0) 
                    *#builtin 60.0 
                +#builtin 1.0;
            const period#:4 = 30.0 *#builtin (sin#builtin(env#:0.time#5cec7724#0) +#builtin 1.0);
            const sphere#:5 = length#78bdad43(v: pos#:2) -#builtin 0.5;
            const bumps#:6 = sin#builtin(pos#:2.x#78566d10#0 *#builtin period#:4) 
                    +#builtin sin#builtin(pos#:2.z#1b597af1#0 *#builtin period#:4) 
                +#builtin sin#builtin(pos#:2.y#78566d10#1 *#builtin period#:4);
            sphere#:5 -#builtin bumps#:6 /#builtin mag#:3;
        },
    ),
)
multiSample#🐨🏟️🏄(
    marchNormals#👸🦢🚃😃(
        (env#:0: GLSLEnv#🎪🌇👪😃, pos#:1: Vec3#🗻🌻🤽‍♂️): float => {
            const pos#:2: Vec3#🗻🌻🤽‍♂️ = rotate#👩‍👦‍👦🏠🌤️(
                pos#:1,
                0,
                env#:0.#GLSLEnv#🎪🌇👪😃#0 / 2,
                env#:0.#GLSLEnv#🎪🌇👪😃#0,
            );
            const period#:4: float = 30 * sin(env#:0.#GLSLEnv#🎪🌇👪😃#0) + 1;
            return length#🤵‍♀️⌛🌒😃(pos#:2) - 0.5 - (sin(pos#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * period#:4) + sin(
                pos#:2.#Vec3#🗻🌻🤽‍♂️#0 * period#:4,
            ) + sin(pos#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * period#:4)) / ((sin(
                env#:0.#GLSLEnv#🎪🌇👪😃#0 / 2,
            ) + 1) * (60) + 1);
        },
    ),
)
```
*/
export const hash_624323e4: (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122 = hash_199bde21(hash_7268d13b((env$0: t_5cec7724, pos$1: t_1b597af1) => {
  let pos: t_1b597af1 = hash_3a2bf5e4(pos$1, 0, env$0.time / 2, env$0.time);
  let period: number = 30 * (sin(env$0.time) + 1);
  return hash_78bdad43(pos) - 0.5 - (sin(pos.x * period) + sin(pos.z * period) + sin(pos.y * period)) / ((sin(env$0.time / 2) + 1) * 60 + 1);
}));
export const ok = hash_624323e4;