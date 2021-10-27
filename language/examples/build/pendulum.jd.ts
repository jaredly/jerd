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
const lerp#dd72dd18 = (a#:0: float#builtin, b#:1: float#builtin, c#:2: float#builtin): float#builtin ={}> c#:2 
        *#builtin (b#:1 -#builtin a#:0) 
    +#builtin a#:0
(a#:0: float, b#:1: float, c#:2: float): float => c#:2 * b#:1 - a#:0 + a#:0
```
*/
export const hash_dd72dd18: (arg_0: number, arg_1: number, arg_2: number) => number = (a: number, b: number, c: number) => c * (b - a) + a;

/**
```
const fract#14e72ade = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
(v#:0: float): float => v#:0 - floor(v#:0)
```
*/
export const hash_14e72ade: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const MaxVelocity#158e986a = 0.1
0.1
```
*/
export const hash_158e986a: number = 0.1;

/**
```
const TWO_PI#fc1474ce = PI#builtin *#builtin 2.0
PI * 2
```
*/
export const hash_fc1474ce: number = PI * 2;

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
const mix#5e40449c = (a#:0: Vec3#1b597af1, b#:1: Vec3#1b597af1, c#:2: float#builtin): Vec3#1b597af1 ={}> {
    Vec3#1b597af1{
        x#78566d10#0: lerp#dd72dd18(a: a#:0.x#78566d10#0, b: b#:1.x#78566d10#0, c#:2),
        y#78566d10#1: lerp#dd72dd18(a: a#:0.y#78566d10#1, b: b#:1.y#78566d10#1, c#:2),
        z#1b597af1#0: lerp#dd72dd18(a: a#:0.z#1b597af1#0, b: b#:1.z#1b597af1#0, c#:2),
    };
}
(a#:0: Vec3#🗻🌻🤽‍♂️, b#:1: Vec3#🗻🌻🤽‍♂️, c#:2: float): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: lerp#👩‍💼(a#:0.#Vec3#🗻🌻🤽‍♂️#0, b#:1.#Vec3#🗻🌻🤽‍♂️#0, c#:2),
    x: lerp#👩‍💼(a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0, b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0, c#:2),
    y: lerp#👩‍💼(a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1, b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1, c#:2),
}
```
*/
export const hash_5e40449c: (arg_0: t_1b597af1, arg_1: t_1b597af1, arg_2: number) => t_1b597af1 = (a: t_1b597af1, b: t_1b597af1, c: number) => ({
  type: "Vec3",
  x: hash_dd72dd18(a.x, b.x, c),
  y: hash_dd72dd18(a.y, b.y, c),
  z: hash_dd72dd18(a.z, b.z, c)
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
  h49fef1f5_0: (scale: number, v$1: t_1b597af1) => ({
    type: "Vec3",
    x: v$1.x * scale,
    y: v$1.y * scale,
    z: v$1.z * scale
  } as t_1b597af1)
} as t_49fef1f5<number, t_1b597af1, t_1b597af1>);

/**
```
const kxyz#3348c881 = Vec3#1b597af1{
    x#78566d10#0: 1.0,
    y#78566d10#1: 2.0 /#builtin 3.0,
    z#1b597af1#0: 1.0 /#builtin 3.0,
}
Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 1 / 3, x: 1, y: 2 / 3}
```
*/
export const hash_3348c881: t_1b597af1 = ({
  type: "Vec3",
  x: 1,
  y: 2 / 3,
  z: 1 / 3
} as t_1b597af1);

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
const fract#bc35bdbc = (v#:0: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: fract#14e72ade(v: v#:0.x#78566d10#0),
    y#78566d10#1: fract#14e72ade(v: v#:0.y#78566d10#1),
    z#1b597af1#0: fract#14e72ade(v: v#:0.z#1b597af1#0),
}
(v#:0: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: fract#🧃💑🤶(v#:0.#Vec3#🗻🌻🤽‍♂️#0),
    x: fract#🧃💑🤶(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0),
    y: fract#🧃💑🤶(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1),
}
```
*/
export const hash_bc35bdbc: (arg_0: t_1b597af1) => t_1b597af1 = (v: t_1b597af1) => ({
  type: "Vec3",
  x: hash_14e72ade(v.x),
  y: hash_14e72ade(v.y),
  z: hash_14e72ade(v.z)
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
  h49fef1f5_0: (v: t_1b597af1, scale$1: number) => ({
    type: "Vec3",
    x: v.x * scale$1,
    y: v.y * scale$1,
    z: v.z * scale$1
  } as t_1b597af1)
} as t_49fef1f5<t_1b597af1, number, t_1b597af1>);

/**
```
const AddSubVec3_#75ce00da = AddSub#70e0d6d0<Vec3#1b597af1, float#builtin, Vec3#1b597af1>{
    "+"#70e0d6d0#0: (one#:0: Vec3#1b597af1, two#:1: float#builtin): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: one#:0.x#78566d10#0 +#builtin two#:1,
        y#78566d10#1: one#:0.y#78566d10#1 +#builtin two#:1,
        z#1b597af1#0: one#:0.z#1b597af1#0 +#builtin two#:1,
    },
    "-"#70e0d6d0#1: (one#:2: Vec3#1b597af1, two#:3: float#builtin): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: one#:2.x#78566d10#0 -#builtin two#:3,
        y#78566d10#1: one#:2.y#78566d10#1 -#builtin two#:3,
        z#1b597af1#0: one#:2.z#1b597af1#0 -#builtin two#:3,
    },
}
AddSub#🍼🥵🗽😃{TODO SPREADs}{
    h70e0d6d0_0: (one#:0: Vec3#🗻🌻🤽‍♂️, two#:1: float): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: one#:0.#Vec3#🗻🌻🤽‍♂️#0 + two#:1,
        x: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + two#:1,
        y: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + two#:1,
    },
    h70e0d6d0_1: (one#:2: Vec3#🗻🌻🤽‍♂️, two#:3: float): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: one#:2.#Vec3#🗻🌻🤽‍♂️#0 - two#:3,
        x: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - two#:3,
        y: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - two#:3,
    },
}
```
*/
export const hash_75ce00da: t_70e0d6d0<t_1b597af1, number, t_1b597af1> = ({
  type: "70e0d6d0",
  h70e0d6d0_0: (one: t_1b597af1, two: number) => ({
    type: "Vec3",
    x: one.x + two,
    y: one.y + two,
    z: one.z + two
  } as t_1b597af1),
  h70e0d6d0_1: (one$2: t_1b597af1, two$3: number) => ({
    type: "Vec3",
    x: one$2.x - two$3,
    y: one$2.y - two$3,
    z: one$2.z - two$3
  } as t_1b597af1)
} as t_70e0d6d0<t_1b597af1, number, t_1b597af1>);

/**
```
const abs#99c811a0 = (v#:0: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: abs#builtin(v#:0.x#78566d10#0),
    y#78566d10#1: abs#builtin(v#:0.y#78566d10#1),
    z#1b597af1#0: abs#builtin(v#:0.z#1b597af1#0),
}
(v#:0: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: abs(v#:0.#Vec3#🗻🌻🤽‍♂️#0),
    x: abs(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0),
    y: abs(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1),
}
```
*/
export const hash_99c811a0: (arg_0: t_1b597af1) => t_1b597af1 = (v: t_1b597af1) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_1b597af1);

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
const abs#7164c2c0 = (v#:0: Vec2#78566d10): Vec2#78566d10 ={}> Vec2#78566d10{
    x#78566d10#0: abs#builtin(v#:0.x#78566d10#0),
    y#78566d10#1: abs#builtin(v#:0.y#78566d10#1),
}
(v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
    x: abs(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0),
    y: abs(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1),
}
```
*/
export const hash_7164c2c0: (arg_0: t_78566d10) => t_78566d10 = (v: t_78566d10) => ({
  type: "Vec2",
  x: abs(v.x),
  y: abs(v.y)
} as t_78566d10);

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
const max#6b01bf52 = (v#:0: Vec2#78566d10): float#builtin ={}> {
    max#builtin(v#:0.x#78566d10#0, v#:0.y#78566d10#1);
}
(v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃): float => max(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0, v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1)
```
*/
export const hash_6b01bf52: (arg_0: t_78566d10) => number = (v: t_78566d10) => max(v.x, v.y);

/**
```
const length#9702bed4 = (v#:0: Vec2#78566d10): float#builtin ={}> sqrt#builtin(
    v#:0.x#78566d10#0 *#builtin v#:0.x#78566d10#0 
        +#builtin v#:0.y#78566d10#1 *#builtin v#:0.y#78566d10#1,
)
(v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃): float => sqrt(
    v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
)
```
*/
export const hash_9702bed4: (arg_0: t_78566d10) => number = (v: t_78566d10) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const pixOff#2fcba44e = Vec4#38dc9122{
    z#1b597af1#0: MaxVelocity#158e986a,
    x#78566d10#0: PI#builtin,
    y#78566d10#1: PI#builtin,
    w#38dc9122#0: MaxVelocity#158e986a,
}
Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: MaxVelocity#😻🌨️🧙‍♀️, z: MaxVelocity#😻🌨️🧙‍♀️}
```
*/
export const hash_2fcba44e: t_38dc9122 = ({
  type: "Vec4",
  z: hash_158e986a,
  x: PI,
  y: PI,
  w: hash_158e986a
} as t_38dc9122);

/**
```
const pixScale#1b256348 = Vec4#38dc9122{
    z#1b597af1#0: MaxVelocity#158e986a *#builtin 2.0,
    x#78566d10#0: TWO_PI#fc1474ce,
    y#78566d10#1: TWO_PI#fc1474ce,
    w#38dc9122#0: MaxVelocity#158e986a *#builtin 2.0,
}
Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: MaxVelocity#😻🌨️🧙‍♀️ * 2, z: MaxVelocity#😻🌨️🧙‍♀️ * 2}
```
*/
export const hash_1b256348: t_38dc9122 = ({
  type: "Vec4",
  z: hash_158e986a * 2,
  x: hash_fc1474ce,
  y: hash_fc1474ce,
  w: hash_158e986a * 2
} as t_38dc9122);

/**
```
const Mul42#902d45ae = Mul#49fef1f5<Vec4#38dc9122, Vec4#38dc9122, Vec4#38dc9122>{
    "*"#49fef1f5#0: (v#:0: Vec4#38dc9122, scale#:1: Vec4#38dc9122): Vec4#38dc9122 ={}> Vec4#38dc9122{
        z#1b597af1#0: v#:0.z#1b597af1#0 *#builtin scale#:1.z#1b597af1#0,
        x#78566d10#0: v#:0.x#78566d10#0 *#builtin scale#:1.x#78566d10#0,
        y#78566d10#1: v#:0.y#78566d10#1 *#builtin scale#:1.y#78566d10#1,
        w#38dc9122#0: v#:0.w#38dc9122#0 *#builtin scale#:1.w#38dc9122#0,
    },
}
Mul#🐺🎇🤟😃{TODO SPREADs}{
    h49fef1f5_0: (v#:0: Vec4#🧑‍🎨🎪🌔, scale#:1: Vec4#🧑‍🎨🎪🌔): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{
        w: v#:0.#Vec4#🧑‍🎨🎪🌔#0 * scale#:1.#Vec4#🧑‍🎨🎪🌔#0,
        z: v#:0.#Vec3#🗻🌻🤽‍♂️#0 * scale#:1.#Vec3#🗻🌻🤽‍♂️#0,
    },
}
```
*/
export const hash_902d45ae: t_49fef1f5<t_38dc9122, t_38dc9122, t_38dc9122> = ({
  type: "49fef1f5",
  h49fef1f5_0: (v: t_38dc9122, scale$1: t_38dc9122) => ({
    type: "Vec4",
    z: v.z * scale$1.z,
    x: v.x * scale$1.x,
    y: v.y * scale$1.y,
    w: v.w * scale$1.w
  } as t_38dc9122)
} as t_49fef1f5<t_38dc9122, t_38dc9122, t_38dc9122>);

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
const normalizeTheta#4c35759b = (t#:0: float#builtin): float#builtin ={}> if t#:0 
    >#builtin PI#builtin {
    t#:0 -#builtin TWO_PI#fc1474ce;
} else if t#:0 <#builtin -PI#builtin {
    t#:0 +#builtin TWO_PI#fc1474ce;
} else {
    t#:0;
}
(t#:0: float): float => {
    if t#:0 > PI {
        return t#:0 - TWO_PI#👨‍🦰;
    } else {
        if t#:0 < -PI {
            return t#:0 + TWO_PI#👨‍🦰;
        } else {
            return t#:0;
        };
    };
}
```
*/
export const hash_4c35759b: (arg_0: number) => number = (t: number) => {
  if (t > PI) {
    return t - hash_fc1474ce;
  } else {
    if (t < -PI) {
      return t + hash_fc1474ce;
    } else {
      return t;
    }
  }
};

/**
```
const r2#0ce717e6 = 100.0
100
```
*/
export const hash_0ce717e6: number = 100;

/**
```
const m2#b48c60a0 = 20.0
20
```
*/
export const hash_b48c60a0: number = 20;

/**
```
const g#4466af4c = 0.15
0.15
```
*/
export const hash_4466af4c: number = 0.15;

/**
```
const Scale42#062c3669 = Div#2b90cfd4<Vec4#38dc9122, Vec4#38dc9122, Vec4#38dc9122>{
    "/"#2b90cfd4#0: (v#:0: Vec4#38dc9122, scale#:1: Vec4#38dc9122): Vec4#38dc9122 ={}> Vec4#38dc9122{
        z#1b597af1#0: v#:0.z#1b597af1#0 /#builtin scale#:1.z#1b597af1#0,
        x#78566d10#0: v#:0.x#78566d10#0 /#builtin scale#:1.x#78566d10#0,
        y#78566d10#1: v#:0.y#78566d10#1 /#builtin scale#:1.y#78566d10#1,
        w#38dc9122#0: v#:0.w#38dc9122#0 /#builtin scale#:1.w#38dc9122#0,
    },
}
Div#⚽🤮🍡{TODO SPREADs}{
    h2b90cfd4_0: (v#:0: Vec4#🧑‍🎨🎪🌔, scale#:1: Vec4#🧑‍🎨🎪🌔): Vec4#🧑‍🎨🎪🌔 => Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{
        w: v#:0.#Vec4#🧑‍🎨🎪🌔#0 / scale#:1.#Vec4#🧑‍🎨🎪🌔#0,
        z: v#:0.#Vec3#🗻🌻🤽‍♂️#0 / scale#:1.#Vec3#🗻🌻🤽‍♂️#0,
    },
}
```
*/
export const hash_062c3669: t_2b90cfd4<t_38dc9122, t_38dc9122, t_38dc9122> = ({
  type: "2b90cfd4",
  h2b90cfd4_0: (v: t_38dc9122, scale$1: t_38dc9122) => ({
    type: "Vec4",
    z: v.z / scale$1.z,
    x: v.x / scale$1.x,
    y: v.y / scale$1.y,
    w: v.w / scale$1.w
  } as t_38dc9122)
} as t_2b90cfd4<t_38dc9122, t_38dc9122, t_38dc9122>);

/**
```
const hsv2rgb#0129a79b = (c#:0: Vec3#1b597af1): Vec3#1b597af1 ={}> {
    const K#:1 = vec4#1eaae93f(x: 1.0, y: 2.0 /#builtin 3.0, z: 1.0 /#builtin 3.0, w: 3.0);
    const xxx#:2 = Vec3#1b597af1{
        x#78566d10#0: c#:0.x#78566d10#0,
        y#78566d10#1: c#:0.x#78566d10#0,
        z#1b597af1#0: c#:0.x#78566d10#0,
    };
    const p#:3 = abs#99c811a0(
        v: fract#bc35bdbc(v: xxx#:2 +#3de90345#70e0d6d0#0 kxyz#3348c881) *#a5e3bb34#49fef1f5#0 6.0 
            -#75ce00da#70e0d6d0#1 3.0,
    );
    const kxxx#:4 = Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: 1.0};
    c#:0.z#1b597af1#0 
        *#11ee14c0#49fef1f5#0 mix#5e40449c(
            a: kxxx#:4,
            b: clamp#83e54cbc(
                v: p#:3 -#3de90345#70e0d6d0#1 kxxx#:4,
                min: Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.0, z#1b597af1#0: 0.0},
                max: Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: 1.0},
            ),
            c: c#:0.y#78566d10#1,
        );
}
(c#:0: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => {
    const kxxx#:4: Vec3#🗻🌻🤽‍♂️ = Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 1, x: 1, y: 1};
    return ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(
        c#:0.#Vec3#🗻🌻🤽‍♂️#0,
        mix#🤏😗👩‍👦‍👦😃(
            kxxx#:4,
            clamp#👂(
                AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
                    abs#🏊‍♂️(
                        AddSubVec3_#🧑‍🦲🕖✈️😃.#AddSub#🍼🥵🗽😃#1(
                            ScaleVec3_#🚐.#Mul#🐺🎇🤟😃#0(
                                fract#🤹‍♀️(
                                    AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
                                        Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                                            z: c#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
                                            x: c#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
                                            y: c#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
                                        },
                                        kxyz#💛🦅🚐,
                                    ),
                                ),
                                6,
                            ),
                            3,
                        ),
                    ),
                    kxxx#:4,
                ),
                Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 0, y: 0},
                Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 1, x: 1, y: 1},
            ),
            c#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
        ),
    );
}
```
*/
export const hash_0129a79b: (arg_0: t_1b597af1) => t_1b597af1 = (c$0: t_1b597af1) => {
  let kxxx: t_1b597af1 = ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_1b597af1);
  return hash_11ee14c0.h49fef1f5_0(c$0.z, hash_5e40449c(kxxx, hash_83e54cbc(hash_3de90345.h70e0d6d0_1(hash_99c811a0(hash_75ce00da.h70e0d6d0_1(hash_a5e3bb34.h49fef1f5_0(hash_bc35bdbc(hash_3de90345.h70e0d6d0_0(({
    type: "Vec3",
    x: c$0.x,
    y: c$0.x,
    z: c$0.x
  } as t_1b597af1), hash_3348c881)), 6), 3)), kxxx), ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 0
  } as t_1b597af1), ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_1b597af1)), c$0.y));
};

/**
```
const rect#24c89138 = (
    samplePos#:0: Vec2#78566d10,
    center#:1: Vec2#78566d10,
    w#:2: float#builtin,
    h#:3: float#builtin,
): float#builtin ={}> {
    max#6b01bf52(
        v: abs#7164c2c0(v: samplePos#:0 -#482bc839#70e0d6d0#1 center#:1) 
            -#482bc839#70e0d6d0#1 Vec2#78566d10{x#78566d10#0: w#:2, y#78566d10#1: h#:3},
    );
}
(samplePos#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, center#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, w#:2: float, h#:3: float): float => max#🛑😾🍛😃(
    AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
        abs#🦑👮‍♀️⛺😃(AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(samplePos#:0, center#:1)),
        Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: w#:2, y: h#:3},
    ),
)
```
*/
export const hash_24c89138: (arg_0: t_78566d10, arg_1: t_78566d10, arg_2: number, arg_3: number) => number = (samplePos: t_78566d10, center: t_78566d10, w$2: number, h: number) => hash_6b01bf52(hash_482bc839.h70e0d6d0_1(hash_7164c2c0(hash_482bc839.h70e0d6d0_1(samplePos, center)), ({
  type: "Vec2",
  x: w$2,
  y: h
} as t_78566d10)));

/**
```
const circle#066692cf = (samplePos#:0: Vec2#78566d10, center#:1: Vec2#78566d10, r#:2: float#builtin): float#builtin ={}> {
    length#9702bed4(v: samplePos#:0 -#482bc839#70e0d6d0#1 center#:1) -#builtin r#:2;
}
(samplePos#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, center#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, r#:2: float): float => length#🍶(
    AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(samplePos#:0, center#:1),
) - r#:2
```
*/
export const hash_066692cf: (arg_0: t_78566d10, arg_1: t_78566d10, arg_2: number) => number = (samplePos: t_78566d10, center: t_78566d10, r: number) => hash_9702bed4(hash_482bc839.h70e0d6d0_1(samplePos, center)) - r;

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
  h2b90cfd4_0: (v: t_78566d10, scale$1: number) => ({
    type: "Vec2",
    x: v.x / scale$1,
    y: v.y / scale$1
  } as t_78566d10)
} as t_2b90cfd4<t_78566d10, number, t_78566d10>);

/**
```
const pixelToData#ca3a7cf0 = (v#:0: Vec4#38dc9122): Vec4#38dc9122 ={}> v#:0 
        *#902d45ae#49fef1f5#0 pixScale#1b256348 
    -#5f52bff1#70e0d6d0#1 pixOff#2fcba44e
(v#:0: Vec4#🧑‍🎨🎪🌔): Vec4#🧑‍🎨🎪🌔 => AddSubVec4#🪁🙌🐺😃.#AddSub#🍼🥵🗽😃#1(
    Mul42#🤸.#Mul#🐺🎇🤟😃#0(v#:0, pixScale#🛴🧙‍♀️🤼‍♂️),
    pixOff#😭🌏🏚️,
)
```
*/
export const hash_ca3a7cf0: (arg_0: t_38dc9122) => t_38dc9122 = (v: t_38dc9122) => hash_5f52bff1.h70e0d6d0_1(hash_902d45ae.h49fef1f5_0(v, hash_1b256348), hash_2fcba44e);

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
  h2b90cfd4_0: (v: t_78566d10, scale$1: t_78566d10) => ({
    type: "Vec2",
    x: v.x / scale$1.x,
    y: v.y / scale$1.y
  } as t_78566d10)
} as t_2b90cfd4<t_78566d10, t_78566d10, t_78566d10>);

/**
```
const update#8a7eb84c = (
    a1#:0: float#builtin,
    a2#:1: float#builtin,
    a1_v#:2: float#builtin,
    a2_v#:3: float#builtin,
): Vec4#38dc9122 ={}> {
    const num1#:4 = -g#4466af4c *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0) 
        *#builtin sin#builtin(a1#:0);
    const num2#:5 = -m2#b48c60a0 *#builtin g#4466af4c 
        *#builtin sin#builtin(a1#:0 -#builtin 2.0 *#builtin a2#:1);
    const num3#:6 = -2.0 *#builtin sin#builtin(a1#:0 -#builtin a2#:1) *#builtin m2#b48c60a0;
    const num4#:7 = a2_v#:3 *#builtin a2_v#:3 *#builtin r2#0ce717e6 
        +#builtin a1_v#:2 *#builtin a1_v#:2 *#builtin r2#0ce717e6 
            *#builtin cos#builtin(a1#:0 -#builtin a2#:1);
    const den#:8 = r2#0ce717e6 
        *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0 
            -#builtin m2#b48c60a0 
                *#builtin cos#builtin(2.0 *#builtin a1#:0 -#builtin 2.0 *#builtin a2#:1));
    const a1_a#:9 = (num1#:4 +#builtin num2#:5 +#builtin num3#:6 *#builtin num4#:7) /#builtin den#:8;
    const num1#:10 = 2.0 *#builtin sin#builtin(a1#:0 -#builtin a2#:1);
    const num2#:11 = a1_v#:2 *#builtin a1_v#:2 *#builtin r2#0ce717e6 
        *#builtin (m2#b48c60a0 +#builtin m2#b48c60a0);
    const num3#:12 = g#4466af4c *#builtin (m2#b48c60a0 +#builtin m2#b48c60a0) 
        *#builtin cos#builtin(a1#:0);
    const num4#:13 = a2_v#:3 *#builtin a2_v#:3 *#builtin r2#0ce717e6 *#builtin m2#b48c60a0 
        *#builtin cos#builtin(a1#:0 -#builtin a2#:1);
    const den#:14 = r2#0ce717e6 
        *#builtin (2.0 *#builtin m2#b48c60a0 +#builtin m2#b48c60a0 
            -#builtin m2#b48c60a0 
                *#builtin cos#builtin(2.0 *#builtin a1#:0 -#builtin 2.0 *#builtin a2#:1));
    const a2_a#:15 = num1#:10 *#builtin (num2#:11 +#builtin num3#:12 +#builtin num4#:13) 
        /#builtin den#:14;
    const a1_v#:16 = a1_v#:2 +#builtin a1_a#:9;
    const a2_v#:17 = a2_v#:3 +#builtin a2_a#:15;
    const a1#:18 = a1#:0 +#builtin a1_v#:16;
    const a2#:19 = a2#:1 +#builtin a2_v#:17;
    const a1#:20 = normalizeTheta#4c35759b(t: a1#:18);
    const a2#:21 = normalizeTheta#4c35759b(t: a2#:19);
    vec4#1eaae93f(x: a1#:20, y: a2#:21, z: a1_v#:16, w: a2_v#:17);
}
(a1#:0: float, a2#:1: float, a1_v#:2: float, a2_v#:3: float): Vec4#🧑‍🎨🎪🌔 => {
    const a1_v#:16: float = a1_v#:2 + (-g#🛤️🚵😳😃 * 2 * m2#🤘 + m2#🤘 * sin(a1#:0) + -m2#🤘 * g#🛤️🚵😳😃 * sin(
        a1#:0 - 2 * a2#:1,
    ) + -2 * sin(a1#:0 - a2#:1) * m2#🤘 * a2_v#:3 * a2_v#:3 * r2#🥅👬👨‍🦰 + a1_v#:2 * a1_v#:2 * r2#🥅👬👨‍🦰 * cos(
        a1#:0 - a2#:1,
    )) / (r2#🥅👬👨‍🦰 * 2 * m2#🤘 + m2#🤘 - m2#🤘 * cos(2 * a1#:0 - 2 * a2#:1));
    const a2_v#:17: float = a2_v#:3 + 2 * sin(a1#:0 - a2#:1) * a1_v#:2 * a1_v#:2 * r2#🥅👬👨‍🦰 * m2#🤘 + m2#🤘 + g#🛤️🚵😳😃 * m2#🤘 + m2#🤘 * cos(
        a1#:0,
    ) + a2_v#:3 * a2_v#:3 * r2#🥅👬👨‍🦰 * m2#🤘 * cos(a1#:0 - a2#:1) / r2#🥅👬👨‍🦰 * 2 * m2#🤘 + m2#🤘 - m2#🤘 * cos(
        2 * a1#:0 - 2 * a2#:1,
    );
    return vec4#👲🥟👥(
        normalizeTheta#🏄‍♀️🧛‍♂️👁️😃(a1#:0 + a1_v#:16),
        normalizeTheta#🏄‍♀️🧛‍♂️👁️😃(a2#:1 + a2_v#:17),
        a1_v#:16,
        a2_v#:17,
    );
}
```
*/
export const hash_8a7eb84c: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_38dc9122 = (a1: number, a2: number, a1_v: number, a2_v: number) => {
  let a1_v$16: number = a1_v + (-hash_4466af4c * (2 * hash_b48c60a0 + hash_b48c60a0) * sin(a1) + -hash_b48c60a0 * hash_4466af4c * sin(a1 - 2 * a2) + -2 * sin(a1 - a2) * hash_b48c60a0 * (a2_v * a2_v * hash_0ce717e6 + a1_v * a1_v * hash_0ce717e6 * cos(a1 - a2))) / (hash_0ce717e6 * (2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0 * cos(2 * a1 - 2 * a2)));
  let a2_v$17: number = a2_v + 2 * sin(a1 - a2) * (a1_v * a1_v * hash_0ce717e6 * (hash_b48c60a0 + hash_b48c60a0) + hash_4466af4c * (hash_b48c60a0 + hash_b48c60a0) * cos(a1) + a2_v * a2_v * hash_0ce717e6 * hash_b48c60a0 * cos(a1 - a2)) / (hash_0ce717e6 * (2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0 * cos(2 * a1 - 2 * a2)));
  return hash_1eaae93f(hash_4c35759b(a1 + a1_v$16), hash_4c35759b(a2 + a2_v$17), a1_v$16, a2_v$17);
};

/**
```
const dataToPixel#801c22dc = (v#:0: Vec4#38dc9122): Vec4#38dc9122 ={}> {
    const res#:1 = (v#:0 +#5f52bff1#70e0d6d0#0 pixOff#2fcba44e) 
        /#062c3669#2b90cfd4#0 pixScale#1b256348;
    res#:1;
}
(v#:0: Vec4#🧑‍🎨🎪🌔): Vec4#🧑‍🎨🎪🌔 => Scale42#🍀🗼👺.#Div#⚽🤮🍡#0(
    AddSubVec4#🪁🙌🐺😃.#AddSub#🍼🥵🗽😃#0(v#:0, pixOff#😭🌏🏚️),
    pixScale#🛴🧙‍♀️🤼‍♂️,
)
```
*/
export const hash_801c22dc: (arg_0: t_38dc9122) => t_38dc9122 = (v: t_38dc9122) => hash_062c3669.h2b90cfd4_0(hash_5f52bff1.h70e0d6d0_0(v, hash_2fcba44e), hash_1b256348);

/**
```
const main#6f5ec52b = (
    env#:0: GLSLEnv#5cec7724,
    fragCoord#:1: Vec2#78566d10,
    buffer#:2: sampler2D#builtin,
): Vec4#38dc9122 ={}> {
    const currentPos#:3 = env#:0.mouse#5cec7724#3 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1;
    const currentp#:4 = texture#builtin(buffer#:2, currentPos#:3);
    const current#:5 = pixelToData#ca3a7cf0(v: currentp#:4);
    const p1#:6 = fragCoord#:1 
        -#482bc839#70e0d6d0#1 env#:0.resolution#5cec7724#1 /#72d6e294#2b90cfd4#0 2.0;
    const c1#:7 = Vec2#78566d10{
        x#78566d10#0: sin#builtin(current#:5.x#78566d10#0) *#builtin r2#0ce717e6,
        y#78566d10#1: -cos#builtin(current#:5.x#78566d10#0) *#builtin r2#0ce717e6,
    };
    const c2#:8 = Vec2#78566d10{
        x#78566d10#0: c1#:7.x#78566d10#0 
            +#builtin sin#builtin(current#:5.y#78566d10#1) *#builtin r2#0ce717e6,
        y#78566d10#1: c1#:7.y#78566d10#1 
            -#builtin cos#builtin(current#:5.y#78566d10#1) *#builtin r2#0ce717e6,
    };
    if circle#066692cf(samplePos: p1#:6, center: c1#:7, r: 10.0) <#builtin 0.0 {
        vec4#1eaae93f(x: 1.0, y: 0.0, z: 0.0, w: 1.0);
    } else if circle#066692cf(samplePos: p1#:6, center: c2#:8, r: 10.0) <#builtin 0.0 {
        vec4#1eaae93f(x: 1.0, y: 1.0, z: 0.0, w: 1.0);
    } else if max#builtin(
            rect#24c89138(
                samplePos: p1#:6,
                center: env#:0.mouse#5cec7724#3 
                    -#482bc839#70e0d6d0#1 env#:0.resolution#5cec7724#1 /#72d6e294#2b90cfd4#0 2.0,
                w: 10.0,
                h: 10.0,
            ),
            -rect#24c89138(
                samplePos: p1#:6,
                center: env#:0.mouse#5cec7724#3 
                    -#482bc839#70e0d6d0#1 env#:0.resolution#5cec7724#1 /#72d6e294#2b90cfd4#0 2.0,
                w: 9.0,
                h: 9.0,
            ),
        ) 
        <#builtin 0.0 {
        vec4#1eaae93f(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else if length#9702bed4(
            v: p1#:6 
                -#482bc839#70e0d6d0#1 (env#:0.mouse#5cec7724#3 
                    -#482bc839#70e0d6d0#1 env#:0.resolution#5cec7724#1 /#72d6e294#2b90cfd4#0 2.0),
        ) 
        <#builtin 100.0 {
        const t#:9 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1,
        );
        const rgb#:10 = hsv2rgb#0129a79b(
            c: Vec3#1b597af1{
                x#78566d10#0: t#:9.z#1b597af1#0,
                y#78566d10#1: t#:9.w#38dc9122#0,
                z#1b597af1#0: 1.0,
            },
        );
        Vec4#38dc9122{...rgb#:10, w#38dc9122#0: 1.0};
    } else if length#9702bed4(
            v: p1#:6 
                -#482bc839#70e0d6d0#1 (env#:0.mouse#5cec7724#3 
                    -#482bc839#70e0d6d0#1 env#:0.resolution#5cec7724#1 /#72d6e294#2b90cfd4#0 2.0),
        ) 
        <#builtin 101.0 {
        vec4#1eaae93f(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else {
        const t#:11 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1,
        );
        const rgb#:12 = hsv2rgb#0129a79b(
            c: Vec3#1b597af1{
                x#78566d10#0: t#:11.y#78566d10#1,
                y#78566d10#1: t#:11.x#78566d10#0,
                z#1b597af1#0: 1.0,
            },
        );
        Vec4#38dc9122{...rgb#:12, w#38dc9122#0: 1.0};
    };
}
(env#:0: GLSLEnv#🎪🌇👪😃, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, buffer#:2: sampler2D): Vec4#🧑‍🎨🎪🌔 => {
    const current#:5: Vec4#🧑‍🎨🎪🌔 = pixelToData#🙋‍♂️(
        texture(
            buffer#:2,
            MulVec2#🦏.#Div#⚽🤮🍡#0(env#:0.#GLSLEnv#🎪🌇👪😃#3, env#:0.#GLSLEnv#🎪🌇👪😃#1),
        ),
    );
    const p1#:6: Vec2#🧑‍🔧🏄‍♀️🕤😃 = AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
        fragCoord#:1,
        ScaleVec2Rev#🍖🤾‍♂️🚊😃.#Div#⚽🤮🍡#0(env#:0.#GLSLEnv#🎪🌇👪😃#1, 2),
    );
    const c1#:7: Vec2#🧑‍🔧🏄‍♀️🕤😃 = Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: sin(current#:5.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0) * r2#🥅👬👨‍🦰,
        y: -cos(current#:5.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0) * r2#🥅👬👨‍🦰,
    };
    if circle#🍯⛹️‍♀️🤖(p1#:6, c1#:7, 10) < 0 {
        return vec4#👲🥟👥(1, 0, 0, 1);
    } else {
        if circle#🍯⛹️‍♀️🤖(
            p1#:6,
            Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
                x: c1#:7.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + sin(current#:5.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1) * r2#🥅👬👨‍🦰,
                y: c1#:7.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - cos(current#:5.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1) * r2#🥅👬👨‍🦰,
            },
            10,
        ) < 0 {
            return vec4#👲🥟👥(1, 1, 0, 1);
        } else {
            if max(
                rect#👷‍♂️🦦🦋(
                    p1#:6,
                    AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
                        env#:0.#GLSLEnv#🎪🌇👪😃#3,
                        ScaleVec2Rev#🍖🤾‍♂️🚊😃.#Div#⚽🤮🍡#0(env#:0.#GLSLEnv#🎪🌇👪😃#1, 2),
                    ),
                    10,
                    10,
                ),
                -rect#👷‍♂️🦦🦋(
                    p1#:6,
                    AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
                        env#:0.#GLSLEnv#🎪🌇👪😃#3,
                        ScaleVec2Rev#🍖🤾‍♂️🚊😃.#Div#⚽🤮🍡#0(env#:0.#GLSLEnv#🎪🌇👪😃#1, 2),
                    ),
                    9,
                    9,
                ),
            ) < 0 {
                return vec4#👲🥟👥(0, 0, 0, 1);
            } else {
                if length#🍶(
                    AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
                        p1#:6,
                        AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
                            env#:0.#GLSLEnv#🎪🌇👪😃#3,
                            ScaleVec2Rev#🍖🤾‍♂️🚊😃.#Div#⚽🤮🍡#0(env#:0.#GLSLEnv#🎪🌇👪😃#1, 2),
                        ),
                    ),
                ) < 100 {
                    const t#:9: Vec4#🧑‍🎨🎪🌔 = texture(
                        buffer#:2,
                        MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:1, env#:0.#GLSLEnv#🎪🌇👪😃#1),
                    );
                    return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
                } else {
                    if length#🍶(
                        AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
                            p1#:6,
                            AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
                                env#:0.#GLSLEnv#🎪🌇👪😃#3,
                                ScaleVec2Rev#🍖🤾‍♂️🚊😃.#Div#⚽🤮🍡#0(env#:0.#GLSLEnv#🎪🌇👪😃#1, 2),
                            ),
                        ),
                    ) < 101 {
                        return vec4#👲🥟👥(0, 0, 0, 1);
                    } else {
                        const t#:11: Vec4#🧑‍🎨🎪🌔 = texture(
                            buffer#:2,
                            MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:1, env#:0.#GLSLEnv#🎪🌇👪😃#1),
                        );
                        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
                    };
                };
            };
        };
    };
}
```
*/
export const hash_6f5ec52b: (arg_0: t_5cec7724, arg_1: t_78566d10, arg_2: sampler2D) => t_38dc9122 = (env: t_5cec7724, fragCoord: t_78566d10, buffer: sampler2D) => {
  let current: t_38dc9122 = hash_ca3a7cf0(texture(buffer, hash_85252e14.h2b90cfd4_0(env.mouse, env.resolution)));
  let p1: t_78566d10 = hash_482bc839.h70e0d6d0_1(fragCoord, hash_72d6e294.h2b90cfd4_0(env.resolution, 2));
  let c1: t_78566d10 = ({
    type: "Vec2",
    x: sin(current.x) * hash_0ce717e6,
    y: -cos(current.x) * hash_0ce717e6
  } as t_78566d10);

  if (hash_066692cf(p1, c1, 10) < 0) {
    return hash_1eaae93f(1, 0, 0, 1);
  } else {
    if (hash_066692cf(p1, ({
      type: "Vec2",
      x: c1.x + sin(current.y) * hash_0ce717e6,
      y: c1.y - cos(current.y) * hash_0ce717e6
    } as t_78566d10), 10) < 0) {
      return hash_1eaae93f(1, 1, 0, 1);
    } else {
      if (max(hash_24c89138(p1, hash_482bc839.h70e0d6d0_1(env.mouse, hash_72d6e294.h2b90cfd4_0(env.resolution, 2)), 10, 10), -hash_24c89138(p1, hash_482bc839.h70e0d6d0_1(env.mouse, hash_72d6e294.h2b90cfd4_0(env.resolution, 2)), 9, 9)) < 0) {
        return hash_1eaae93f(0, 0, 0, 1);
      } else {
        if (hash_9702bed4(hash_482bc839.h70e0d6d0_1(p1, hash_482bc839.h70e0d6d0_1(env.mouse, hash_72d6e294.h2b90cfd4_0(env.resolution, 2)))) < 100) {
          let t$9: t_38dc9122 = texture(buffer, hash_85252e14.h2b90cfd4_0(fragCoord, env.resolution));
          return ({ ...hash_0129a79b(({
              type: "Vec3",
              x: t$9.z,
              y: t$9.w,
              z: 1
            } as t_1b597af1)),
            type: "Vec4",
            w: 1
          } as t_38dc9122);
        } else {
          if (hash_9702bed4(hash_482bc839.h70e0d6d0_1(p1, hash_482bc839.h70e0d6d0_1(env.mouse, hash_72d6e294.h2b90cfd4_0(env.resolution, 2)))) < 101) {
            return hash_1eaae93f(0, 0, 0, 1);
          } else {
            let t$11: t_38dc9122 = texture(buffer, hash_85252e14.h2b90cfd4_0(fragCoord, env.resolution));
            return ({ ...hash_0129a79b(({
                type: "Vec3",
                x: t$11.y,
                y: t$11.x,
                z: 1
              } as t_1b597af1)),
              type: "Vec4",
              w: 1
            } as t_38dc9122);
          }
        }
      }
    }
  }
};

/**
```
const pendulum#449c579c = (
    env#:0: GLSLEnv#5cec7724,
    fragCoord#:1: Vec2#78566d10,
    buffer#:2: sampler2D#builtin,
): Vec4#38dc9122 ={}> {
    if env#:0.time#5cec7724#0 <=#builtin 0.01 {
        const t#:3 = fragCoord#:1 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1;
        vec4#1eaae93f(x: 0.0, y: 0.0, z: t#:3.x#78566d10#0, w: t#:3.y#78566d10#1);
    } else {
        const current#:4 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1,
        );
        const current#:5 = pixelToData#ca3a7cf0(v: current#:4);
        dataToPixel#801c22dc(
            v: update#8a7eb84c(
                a1: current#:5.x#78566d10#0,
                a2: current#:5.y#78566d10#1,
                a1_v: current#:5.z#1b597af1#0,
                a2_v: current#:5.w#38dc9122#0,
            ),
        );
    };
}
(env#:0: GLSLEnv#🎪🌇👪😃, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, buffer#:2: sampler2D): Vec4#🧑‍🎨🎪🌔 => {
    if env#:0.#GLSLEnv#🎪🌇👪😃#0 <= 0.01 {
        const t#:3: Vec2#🧑‍🔧🏄‍♀️🕤😃 = MulVec2#🦏.#Div#⚽🤮🍡#0(
            fragCoord#:1,
            env#:0.#GLSLEnv#🎪🌇👪😃#1,
        );
        return vec4#👲🥟👥(0, 0, t#:3.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0, t#:3.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1);
    } else {
        const current#:5: Vec4#🧑‍🎨🎪🌔 = pixelToData#🙋‍♂️(
            texture(buffer#:2, MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:1, env#:0.#GLSLEnv#🎪🌇👪😃#1)),
        );
        return dataToPixel#🥃(
            update#😥(
                current#:5.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
                current#:5.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
                current#:5.#Vec3#🗻🌻🤽‍♂️#0,
                current#:5.#Vec4#🧑‍🎨🎪🌔#0,
            ),
        );
    };
}
```
*/
export const hash_449c579c: (arg_0: t_5cec7724, arg_1: t_78566d10, arg_2: sampler2D) => t_38dc9122 = (env: t_5cec7724, fragCoord: t_78566d10, buffer: sampler2D) => {
  if (env.time <= 0.01) {
    let t$3: t_78566d10 = hash_85252e14.h2b90cfd4_0(fragCoord, env.resolution);
    return hash_1eaae93f(0, 0, t$3.x, t$3.y);
  } else {
    let current: t_38dc9122 = hash_ca3a7cf0(texture(buffer, hash_85252e14.h2b90cfd4_0(fragCoord, env.resolution)));
    return hash_801c22dc(hash_8a7eb84c(current.x, current.y, current.z, current.w));
  }
};
export const r1 = hash_0ce717e6;
export const r2 = hash_0ce717e6;
export const update = hash_8a7eb84c;
export const pendulum = hash_449c579c;
export const main = hash_6f5ec52b;