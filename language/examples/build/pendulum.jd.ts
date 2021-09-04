import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@ffi("Vec2") type Vec2#08f7c2ac = {
    x: float#builtin,
    y: float#builtin,
}
```
*/
type t_08f7c2ac = {
  type: "Vec2";
  x: number;
  y: number;
};

/**
```
@ffi("Vec3") type Vec3#40e2c712 = {
    ...Vec2#08f7c2ac,
    z: float#builtin,
}
```
*/
type t_40e2c712 = {
  type: "Vec3";
  z: number;
  x: number;
  y: number;
};

/**
```
type Div#3b763160<A#:0, B#:1, C#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_3b763160<T_0, T_1, T_2> = {
  type: "3b763160";
  h3b763160_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
@ffi("Vec4") type Vec4#51a53bbe = {
    ...Vec3#40e2c712,
    w: float#builtin,
}
```
*/
type t_51a53bbe = {
  type: "Vec4";
  w: number;
  z: number;
  x: number;
  y: number;
};

/**
```
type Mul#02cc25c4<A#:0, B#:1, C#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_02cc25c4<T_0, T_1, T_2> = {
  type: "02cc25c4";
  h02cc25c4_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type AddSub#3d436b7e<A#:0, B#:1, C#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_3d436b7e<T_0, T_1, T_2> = {
  type: "3d436b7e";
  h3d436b7e_0: (arg_0: T_0, arg_1: T_1) => T_2;
  h3d436b7e_1: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
@ffi("GLSLEnv") type GLSLEnv#88074884 = {
    time: float#builtin,
    resolution: Vec2#08f7c2ac,
    camera: Vec3#40e2c712,
    mouse: Vec2#08f7c2ac,
}
```
*/
type t_88074884 = {
  type: "GLSLEnv";
  time: number;
  resolution: t_08f7c2ac;
  camera: t_40e2c712;
  mouse: t_08f7c2ac;
};

/**
```
const clamp#f2f2e188 = (v#:0: float#builtin, minv#:1: float#builtin, maxv#:2: float#builtin): float#builtin ={}> max#builtin(
    min#builtin(v#:0, maxv#:2),
    minv#:1,
)
(v#:0: float, minv#:1: float, maxv#:2: float): float => max(min(v#:0, maxv#:2), minv#:1)
```
*/
export const hash_f2f2e188: (arg_0: number, arg_1: number, arg_2: number) => number = (v: number, minv: number, maxv: number) => max(min(v, maxv), minv);

/**
```
const lerp#0c604a2c = (a#:0: float#builtin, b#:1: float#builtin, c#:2: float#builtin): float#builtin ={}> c#:2 
        *#builtin (b#:1 -#builtin a#:0) 
    +#builtin a#:0
(a#:0: float, b#:1: float, c#:2: float): float => c#:2 * b#:1 - a#:0 + a#:0
```
*/
export const hash_0c604a2c: (arg_0: number, arg_1: number, arg_2: number) => number = (a: number, b: number, c: number) => c * (b - a) + a;

/**
```
const fract#495c4d22 = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
(v#:0: float): float => v#:0 - floor(v#:0)
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

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
const clamp#0bd616ea = (v#:0: Vec3#40e2c712, min#:1: Vec3#40e2c712, max#:2: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
    x#08f7c2ac#0: clamp#f2f2e188(
        v: v#:0.x#08f7c2ac#0,
        minv: min#:1.x#08f7c2ac#0,
        maxv: max#:2.x#08f7c2ac#0,
    ),
    y#08f7c2ac#1: clamp#f2f2e188(
        v: v#:0.y#08f7c2ac#1,
        minv: min#:1.y#08f7c2ac#1,
        maxv: max#:2.y#08f7c2ac#1,
    ),
    z#40e2c712#0: clamp#f2f2e188(
        v: v#:0.z#40e2c712#0,
        minv: min#:1.z#40e2c712#0,
        maxv: max#:2.z#40e2c712#0,
    ),
}
(v#:0: Vec3#🕍🤲😍😃, min#:1: Vec3#🕍🤲😍😃, max#:2: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: clamp#🕴️(v#:0.#Vec3#🕍🤲😍😃#0, min#:1.#Vec3#🕍🤲😍😃#0, max#:2.#Vec3#🕍🤲😍😃#0),
    x: clamp#🕴️(v#:0.#Vec2#🍱🐶💣#0, min#:1.#Vec2#🍱🐶💣#0, max#:2.#Vec2#🍱🐶💣#0),
    y: clamp#🕴️(v#:0.#Vec2#🍱🐶💣#1, min#:1.#Vec2#🍱🐶💣#1, max#:2.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_0bd616ea: (arg_0: t_40e2c712, arg_1: t_40e2c712, arg_2: t_40e2c712) => t_40e2c712 = (v: t_40e2c712, min: t_40e2c712, max: t_40e2c712) => ({
  type: "Vec3",
  x: hash_f2f2e188(v.x, min.x, max.x),
  y: hash_f2f2e188(v.y, min.y, max.y),
  z: hash_f2f2e188(v.z, min.z, max.z)
} as t_40e2c712);

/**
```
const mix#045e6e5c = (a#:0: Vec3#40e2c712, b#:1: Vec3#40e2c712, c#:2: float#builtin): Vec3#40e2c712 ={}> {
    Vec3#40e2c712{
        x#08f7c2ac#0: lerp#0c604a2c(a: a#:0.x#08f7c2ac#0, b: b#:1.x#08f7c2ac#0, c#:2),
        y#08f7c2ac#1: lerp#0c604a2c(a: a#:0.y#08f7c2ac#1, b: b#:1.y#08f7c2ac#1, c#:2),
        z#40e2c712#0: lerp#0c604a2c(a: a#:0.z#40e2c712#0, b: b#:1.z#40e2c712#0, c#:2),
    };
}
(a#:0: Vec3#🕍🤲😍😃, b#:1: Vec3#🕍🤲😍😃, c#:2: float): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: lerp#🐣☺️👶(a#:0.#Vec3#🕍🤲😍😃#0, b#:1.#Vec3#🕍🤲😍😃#0, c#:2),
    x: lerp#🐣☺️👶(a#:0.#Vec2#🍱🐶💣#0, b#:1.#Vec2#🍱🐶💣#0, c#:2),
    y: lerp#🐣☺️👶(a#:0.#Vec2#🍱🐶💣#1, b#:1.#Vec2#🍱🐶💣#1, c#:2),
}
```
*/
export const hash_045e6e5c: (arg_0: t_40e2c712, arg_1: t_40e2c712, arg_2: number) => t_40e2c712 = (a: t_40e2c712, b: t_40e2c712, c: number) => ({
  type: "Vec3",
  x: hash_0c604a2c(a.x, b.x, c),
  y: hash_0c604a2c(a.y, b.y, c),
  z: hash_0c604a2c(a.z, b.z, c)
} as t_40e2c712);

/**
```
const kxyz#68284c09 = Vec3#40e2c712{
    x#08f7c2ac#0: 1.0,
    y#08f7c2ac#1: 2.0 /#builtin 3.0,
    z#40e2c712#0: 1.0 /#builtin 3.0,
}
Vec3#🕍🤲😍😃{TODO SPREADs}{z: 1 / 3, x: 1, y: 2 / 3}
```
*/
export const hash_68284c09: t_40e2c712 = ({
  type: "Vec3",
  x: 1,
  y: 2 / 3,
  z: 1 / 3
} as t_40e2c712);

/**
```
const AddSubVec3#ab6a3504 = AddSub#3d436b7e<Vec3#40e2c712, Vec3#40e2c712, Vec3#40e2c712>{
    "+"#3d436b7e#0: (one#:0: Vec3#40e2c712, two#:1: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
        z#40e2c712#0: one#:0.z#40e2c712#0 +#builtin two#:1.z#40e2c712#0,
    },
    "-"#3d436b7e#1: (one#:2: Vec3#40e2c712, two#:3: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
        z#40e2c712#0: one#:2.z#40e2c712#0 -#builtin two#:3.z#40e2c712#0,
    },
}
AddSub#🕕🧑‍🦲⚽{TODO SPREADs}{
    h3d436b7e_0: (one#:0: Vec3#🕍🤲😍😃, two#:1: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: one#:0.#Vec3#🕍🤲😍😃#0 + two#:1.#Vec3#🕍🤲😍😃#0,
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1.#Vec2#🍱🐶💣#0,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1.#Vec2#🍱🐶💣#1,
    },
    h3d436b7e_1: (one#:2: Vec3#🕍🤲😍😃, two#:3: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: one#:2.#Vec3#🕍🤲😍😃#0 - two#:3.#Vec3#🕍🤲😍😃#0,
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3.#Vec2#🍱🐶💣#0,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_ab6a3504: t_3d436b7e<t_40e2c712, t_40e2c712, t_40e2c712> = ({
  type: "3d436b7e",
  h3d436b7e_0: (one: t_40e2c712, two: t_40e2c712) => ({
    type: "Vec3",
    x: one.x + two.x,
    y: one.y + two.y,
    z: one.z + two.z
  } as t_40e2c712),
  h3d436b7e_1: (one$2: t_40e2c712, two$3: t_40e2c712) => ({
    type: "Vec3",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    z: one$2.z - two$3.z
  } as t_40e2c712)
} as t_3d436b7e<t_40e2c712, t_40e2c712, t_40e2c712>);

/**
```
const fract#75637b72 = (v#:0: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
    x#08f7c2ac#0: fract#495c4d22(v: v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: fract#495c4d22(v: v#:0.y#08f7c2ac#1),
    z#40e2c712#0: fract#495c4d22(v: v#:0.z#40e2c712#0),
}
(v#:0: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: fract#🧑‍🎨⛩️💤😃(v#:0.#Vec3#🕍🤲😍😃#0),
    x: fract#🧑‍🎨⛩️💤😃(v#:0.#Vec2#🍱🐶💣#0),
    y: fract#🧑‍🎨⛩️💤😃(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_75637b72: (arg_0: t_40e2c712) => t_40e2c712 = (v: t_40e2c712) => ({
  type: "Vec3",
  x: hash_495c4d22(v.x),
  y: hash_495c4d22(v.y),
  z: hash_495c4d22(v.z)
} as t_40e2c712);

/**
```
const ScaleVec3_#93ca49f4 = Mul#02cc25c4<Vec3#40e2c712, float#builtin, Vec3#40e2c712>{
    "*"#02cc25c4#0: (v#:0: Vec3#40e2c712, scale#:1: float#builtin): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1,
        z#40e2c712#0: v#:0.z#40e2c712#0 *#builtin scale#:1,
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (v#:0: Vec3#🕍🤲😍😃, scale#:1: float): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: v#:0.#Vec3#🕍🤲😍😃#0 * scale#:1,
        x: v#:0.#Vec2#🍱🐶💣#0 * scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 * scale#:1,
    },
}
```
*/
export const hash_93ca49f4: t_02cc25c4<t_40e2c712, number, t_40e2c712> = ({
  type: "02cc25c4",
  h02cc25c4_0: (v: t_40e2c712, scale: number) => ({
    type: "Vec3",
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale
  } as t_40e2c712)
} as t_02cc25c4<t_40e2c712, number, t_40e2c712>);

/**
```
const AddSubVec3_#7aad9d8e = AddSub#3d436b7e<Vec3#40e2c712, float#builtin, Vec3#40e2c712>{
    "+"#3d436b7e#0: (one#:0: Vec3#40e2c712, two#:1: float#builtin): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1,
        z#40e2c712#0: one#:0.z#40e2c712#0 +#builtin two#:1,
    },
    "-"#3d436b7e#1: (one#:2: Vec3#40e2c712, two#:3: float#builtin): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3,
        z#40e2c712#0: one#:2.z#40e2c712#0 -#builtin two#:3,
    },
}
AddSub#🕕🧑‍🦲⚽{TODO SPREADs}{
    h3d436b7e_0: (one#:0: Vec3#🕍🤲😍😃, two#:1: float): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: one#:0.#Vec3#🕍🤲😍😃#0 + two#:1,
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1,
    },
    h3d436b7e_1: (one#:2: Vec3#🕍🤲😍😃, two#:3: float): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: one#:2.#Vec3#🕍🤲😍😃#0 - two#:3,
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3,
    },
}
```
*/
export const hash_7aad9d8e: t_3d436b7e<t_40e2c712, number, t_40e2c712> = ({
  type: "3d436b7e",
  h3d436b7e_0: (one: t_40e2c712, two: number) => ({
    type: "Vec3",
    x: one.x + two,
    y: one.y + two,
    z: one.z + two
  } as t_40e2c712),
  h3d436b7e_1: (one$2: t_40e2c712, two$3: number) => ({
    type: "Vec3",
    x: one$2.x - two$3,
    y: one$2.y - two$3,
    z: one$2.z - two$3
  } as t_40e2c712)
} as t_3d436b7e<t_40e2c712, number, t_40e2c712>);

/**
```
const abs#3e9c70b8 = (v#:0: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
    x#08f7c2ac#0: abs#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: abs#builtin(v#:0.y#08f7c2ac#1),
    z#40e2c712#0: abs#builtin(v#:0.z#40e2c712#0),
}
(v#:0: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: abs(v#:0.#Vec3#🕍🤲😍😃#0),
    x: abs(v#:0.#Vec2#🍱🐶💣#0),
    y: abs(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_3e9c70b8: (arg_0: t_40e2c712) => t_40e2c712 = (v: t_40e2c712) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_40e2c712);

/**
```
const vec4#9d013532 = (
    x#:0: float#builtin,
    y#:1: float#builtin,
    z#:2: float#builtin,
    w#:3: float#builtin,
): Vec4#51a53bbe ={}> Vec4#51a53bbe{
    z#40e2c712#0: z#:2,
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
    w#51a53bbe#0: w#:3,
}
(x#:0: float, y#:1: float, z#:2: float, w#:3: float): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{
    w: w#:3,
    z: z#:2,
}
```
*/
export const hash_9d013532: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_51a53bbe = (x: number, y: number, z: number, w: number) => ({
  type: "Vec4",
  z: z,
  x: x,
  y: y,
  w: w
} as t_51a53bbe);

/**
```
const ScaleVec3#47332321 = Mul#02cc25c4<float#builtin, Vec3#40e2c712, Vec3#40e2c712>{
    "*"#02cc25c4#0: (scale#:0: float#builtin, v#:1: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: v#:1.x#08f7c2ac#0 *#builtin scale#:0,
        y#08f7c2ac#1: v#:1.y#08f7c2ac#1 *#builtin scale#:0,
        z#40e2c712#0: v#:1.z#40e2c712#0 *#builtin scale#:0,
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (scale#:0: float, v#:1: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: v#:1.#Vec3#🕍🤲😍😃#0 * scale#:0,
        x: v#:1.#Vec2#🍱🐶💣#0 * scale#:0,
        y: v#:1.#Vec2#🍱🐶💣#1 * scale#:0,
    },
}
```
*/
export const hash_47332321: t_02cc25c4<number, t_40e2c712, t_40e2c712> = ({
  type: "02cc25c4",
  h02cc25c4_0: (scale$0: number, v$1: t_40e2c712) => ({
    type: "Vec3",
    x: v$1.x * scale$0,
    y: v$1.y * scale$0,
    z: v$1.z * scale$0
  } as t_40e2c712)
} as t_02cc25c4<number, t_40e2c712, t_40e2c712>);

/**
```
const abs#0a530a64 = (v#:0: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: abs#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: abs#builtin(v#:0.y#08f7c2ac#1),
}
(v#:0: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
    x: abs(v#:0.#Vec2#🍱🐶💣#0),
    y: abs(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_0a530a64: (arg_0: t_08f7c2ac) => t_08f7c2ac = (v: t_08f7c2ac) => ({
  type: "Vec2",
  x: abs(v.x),
  y: abs(v.y)
} as t_08f7c2ac);

/**
```
const AddSubVec2#04f14e9c = AddSub#3d436b7e<Vec2#08f7c2ac, Vec2#08f7c2ac, Vec2#08f7c2ac>{
    "+"#3d436b7e#0: (one#:0: Vec2#08f7c2ac, two#:1: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
    },
    "-"#3d436b7e#1: (one#:2: Vec2#08f7c2ac, two#:3: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
    },
}
AddSub#🕕🧑‍🦲⚽{TODO SPREADs}{
    h3d436b7e_0: (one#:0: Vec2#🍱🐶💣, two#:1: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1.#Vec2#🍱🐶💣#0,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1.#Vec2#🍱🐶💣#1,
    },
    h3d436b7e_1: (one#:2: Vec2#🍱🐶💣, two#:3: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3.#Vec2#🍱🐶💣#0,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_04f14e9c: t_3d436b7e<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac> = ({
  type: "3d436b7e",
  h3d436b7e_0: (one: t_08f7c2ac, two: t_08f7c2ac) => ({
    type: "Vec2",
    x: one.x + two.x,
    y: one.y + two.y
  } as t_08f7c2ac),
  h3d436b7e_1: (one$2: t_08f7c2ac, two$3: t_08f7c2ac) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_08f7c2ac)
} as t_3d436b7e<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac>);

/**
```
const max#01aa8278 = (v#:0: Vec2#08f7c2ac): float#builtin ={}> {
    max#builtin(v#:0.x#08f7c2ac#0, v#:0.y#08f7c2ac#1);
}
(v#:0: Vec2#🍱🐶💣): float => max(v#:0.#Vec2#🍱🐶💣#0, v#:0.#Vec2#🍱🐶💣#1)
```
*/
export const hash_01aa8278: (arg_0: t_08f7c2ac) => number = (v: t_08f7c2ac) => max(v.x, v.y);

/**
```
const length#077fa0cc = (v#:0: Vec2#08f7c2ac): float#builtin ={}> sqrt#builtin(
    v#:0.x#08f7c2ac#0 *#builtin v#:0.x#08f7c2ac#0 
        +#builtin v#:0.y#08f7c2ac#1 *#builtin v#:0.y#08f7c2ac#1,
)
(v#:0: Vec2#🍱🐶💣): float => sqrt(
    v#:0.#Vec2#🍱🐶💣#0 * v#:0.#Vec2#🍱🐶💣#0 + v#:0.#Vec2#🍱🐶💣#1 * v#:0.#Vec2#🍱🐶💣#1,
)
```
*/
export const hash_077fa0cc: (arg_0: t_08f7c2ac) => number = (v: t_08f7c2ac) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const pixOff#aca447b4 = Vec4#51a53bbe{
    z#40e2c712#0: MaxVelocity#158e986a,
    x#08f7c2ac#0: PI#builtin,
    y#08f7c2ac#1: PI#builtin,
    w#51a53bbe#0: MaxVelocity#158e986a,
}
Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: MaxVelocity#😻🌨️🧙‍♀️, z: MaxVelocity#😻🌨️🧙‍♀️}
```
*/
export const hash_aca447b4: t_51a53bbe = ({
  type: "Vec4",
  z: hash_158e986a,
  x: PI,
  y: PI,
  w: hash_158e986a
} as t_51a53bbe);

/**
```
const pixScale#21a731a0 = Vec4#51a53bbe{
    z#40e2c712#0: MaxVelocity#158e986a *#builtin 2.0,
    x#08f7c2ac#0: TWO_PI#fc1474ce,
    y#08f7c2ac#1: TWO_PI#fc1474ce,
    w#51a53bbe#0: MaxVelocity#158e986a *#builtin 2.0,
}
Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: MaxVelocity#😻🌨️🧙‍♀️ * 2, z: MaxVelocity#😻🌨️🧙‍♀️ * 2}
```
*/
export const hash_21a731a0: t_51a53bbe = ({
  type: "Vec4",
  z: hash_158e986a * 2,
  x: hash_fc1474ce,
  y: hash_fc1474ce,
  w: hash_158e986a * 2
} as t_51a53bbe);

/**
```
const Mul42#5525be00 = Mul#02cc25c4<Vec4#51a53bbe, Vec4#51a53bbe, Vec4#51a53bbe>{
    "*"#02cc25c4#0: (v#:0: Vec4#51a53bbe, scale#:1: Vec4#51a53bbe): Vec4#51a53bbe ={}> Vec4#51a53bbe{
        z#40e2c712#0: v#:0.z#40e2c712#0 *#builtin scale#:1.z#40e2c712#0,
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1.y#08f7c2ac#1,
        w#51a53bbe#0: v#:0.w#51a53bbe#0 *#builtin scale#:1.w#51a53bbe#0,
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (v#:0: Vec4#✨🤶👨‍🔬😃, scale#:1: Vec4#✨🤶👨‍🔬😃): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{
        w: v#:0.#Vec4#✨🤶👨‍🔬😃#0 * scale#:1.#Vec4#✨🤶👨‍🔬😃#0,
        z: v#:0.#Vec3#🕍🤲😍😃#0 * scale#:1.#Vec3#🕍🤲😍😃#0,
    },
}
```
*/
export const hash_5525be00: t_02cc25c4<t_51a53bbe, t_51a53bbe, t_51a53bbe> = ({
  type: "02cc25c4",
  h02cc25c4_0: (v: t_51a53bbe, scale: t_51a53bbe) => ({
    type: "Vec4",
    z: v.z * scale.z,
    x: v.x * scale.x,
    y: v.y * scale.y,
    w: v.w * scale.w
  } as t_51a53bbe)
} as t_02cc25c4<t_51a53bbe, t_51a53bbe, t_51a53bbe>);

/**
```
const AddSubVec4#dcd86334 = AddSub#3d436b7e<Vec4#51a53bbe, Vec4#51a53bbe, Vec4#51a53bbe>{
    "+"#3d436b7e#0: (one#:0: Vec4#51a53bbe, two#:1: Vec4#51a53bbe): Vec4#51a53bbe ={}> Vec4#51a53bbe{
        z#40e2c712#0: one#:0.z#40e2c712#0 +#builtin two#:1.z#40e2c712#0,
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
        w#51a53bbe#0: one#:0.w#51a53bbe#0 +#builtin two#:1.w#51a53bbe#0,
    },
    "-"#3d436b7e#1: (one#:2: Vec4#51a53bbe, two#:3: Vec4#51a53bbe): Vec4#51a53bbe ={}> Vec4#51a53bbe{
        z#40e2c712#0: one#:2.z#40e2c712#0 -#builtin two#:3.z#40e2c712#0,
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
        w#51a53bbe#0: one#:2.w#51a53bbe#0 -#builtin two#:3.w#51a53bbe#0,
    },
}
AddSub#🕕🧑‍🦲⚽{TODO SPREADs}{
    h3d436b7e_0: (one#:0: Vec4#✨🤶👨‍🔬😃, two#:1: Vec4#✨🤶👨‍🔬😃): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{
        w: one#:0.#Vec4#✨🤶👨‍🔬😃#0 + two#:1.#Vec4#✨🤶👨‍🔬😃#0,
        z: one#:0.#Vec3#🕍🤲😍😃#0 + two#:1.#Vec3#🕍🤲😍😃#0,
    },
    h3d436b7e_1: (one#:2: Vec4#✨🤶👨‍🔬😃, two#:3: Vec4#✨🤶👨‍🔬😃): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{
        w: one#:2.#Vec4#✨🤶👨‍🔬😃#0 - two#:3.#Vec4#✨🤶👨‍🔬😃#0,
        z: one#:2.#Vec3#🕍🤲😍😃#0 - two#:3.#Vec3#🕍🤲😍😃#0,
    },
}
```
*/
export const hash_dcd86334: t_3d436b7e<t_51a53bbe, t_51a53bbe, t_51a53bbe> = ({
  type: "3d436b7e",
  h3d436b7e_0: (one: t_51a53bbe, two: t_51a53bbe) => ({
    type: "Vec4",
    z: one.z + two.z,
    x: one.x + two.x,
    y: one.y + two.y,
    w: one.w + two.w
  } as t_51a53bbe),
  h3d436b7e_1: (one$2: t_51a53bbe, two$3: t_51a53bbe) => ({
    type: "Vec4",
    z: one$2.z - two$3.z,
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    w: one$2.w - two$3.w
  } as t_51a53bbe)
} as t_3d436b7e<t_51a53bbe, t_51a53bbe, t_51a53bbe>);

/**
```
const normalizeTheta#c3a71e42 = (t#:0: float#builtin): float#builtin ={}> if t#:0 
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
export const hash_c3a71e42: (arg_0: number) => number = (t: number) => {
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
const Scale42#4ae0e9b4 = Div#3b763160<Vec4#51a53bbe, Vec4#51a53bbe, Vec4#51a53bbe>{
    "/"#3b763160#0: (v#:0: Vec4#51a53bbe, scale#:1: Vec4#51a53bbe): Vec4#51a53bbe ={}> Vec4#51a53bbe{
        z#40e2c712#0: v#:0.z#40e2c712#0 /#builtin scale#:1.z#40e2c712#0,
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1.y#08f7c2ac#1,
        w#51a53bbe#0: v#:0.w#51a53bbe#0 /#builtin scale#:1.w#51a53bbe#0,
    },
}
Div#🧜‍♂️🧖💧{TODO SPREADs}{
    h3b763160_0: (v#:0: Vec4#✨🤶👨‍🔬😃, scale#:1: Vec4#✨🤶👨‍🔬😃): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{
        w: v#:0.#Vec4#✨🤶👨‍🔬😃#0 / scale#:1.#Vec4#✨🤶👨‍🔬😃#0,
        z: v#:0.#Vec3#🕍🤲😍😃#0 / scale#:1.#Vec3#🕍🤲😍😃#0,
    },
}
```
*/
export const hash_4ae0e9b4: t_3b763160<t_51a53bbe, t_51a53bbe, t_51a53bbe> = ({
  type: "3b763160",
  h3b763160_0: (v: t_51a53bbe, scale: t_51a53bbe) => ({
    type: "Vec4",
    z: v.z / scale.z,
    x: v.x / scale.x,
    y: v.y / scale.y,
    w: v.w / scale.w
  } as t_51a53bbe)
} as t_3b763160<t_51a53bbe, t_51a53bbe, t_51a53bbe>);

/**
```
const hsv2rgb#3342eeb2 = (c#:0: Vec3#40e2c712): Vec3#40e2c712 ={}> {
    const K#:1 = vec4#9d013532(x: 1.0, y: 2.0 /#builtin 3.0, z: 1.0 /#builtin 3.0, w: 3.0);
    const xxx#:2 = Vec3#40e2c712{
        x#08f7c2ac#0: c#:0.x#08f7c2ac#0,
        y#08f7c2ac#1: c#:0.x#08f7c2ac#0,
        z#40e2c712#0: c#:0.x#08f7c2ac#0,
    };
    const p#:3 = abs#3e9c70b8(
        v: fract#75637b72(v: xxx#:2 +#ab6a3504#3d436b7e#0 kxyz#68284c09) *#93ca49f4#02cc25c4#0 6.0 
            -#7aad9d8e#3d436b7e#1 3.0,
    );
    const kxxx#:4 = Vec3#40e2c712{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#40e2c712#0: 1.0};
    c#:0.z#40e2c712#0 
        *#47332321#02cc25c4#0 mix#045e6e5c(
            a: kxxx#:4,
            b: clamp#0bd616ea(
                v: p#:3 -#ab6a3504#3d436b7e#1 kxxx#:4,
                min: Vec3#40e2c712{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#40e2c712#0: 0.0},
                max: Vec3#40e2c712{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#40e2c712#0: 1.0},
            ),
            c: c#:0.y#08f7c2ac#1,
        );
}
(c#:0: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => {
    const kxxx#:4: Vec3#🕍🤲😍😃 = Vec3#🕍🤲😍😃{TODO SPREADs}{z: 1, x: 1, y: 1};
    return ScaleVec3#🎡👦💋😃.#Mul#👫🏭😪#0(
        c#:0.#Vec3#🕍🤲😍😃#0,
        mix#🥀⭐😲(
            kxxx#:4,
            clamp#🌐🏃‍♀️🦻(
                AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#1(
                    abs#🦾🌆🎣(
                        AddSubVec3_#🧖‍♀️🚀🌬️😃.#AddSub#🕕🧑‍🦲⚽#1(
                            ScaleVec3_#🐩.#Mul#👫🏭😪#0(
                                fract#🕛👴🛶😃(
                                    AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#0(
                                        Vec3#🕍🤲😍😃{TODO SPREADs}{
                                            z: c#:0.#Vec2#🍱🐶💣#0,
                                            x: c#:0.#Vec2#🍱🐶💣#0,
                                            y: c#:0.#Vec2#🍱🐶💣#0,
                                        },
                                        kxyz#🙃🐘🌽😃,
                                    ),
                                ),
                                6,
                            ),
                            3,
                        ),
                    ),
                    kxxx#:4,
                ),
                Vec3#🕍🤲😍😃{TODO SPREADs}{z: 0, x: 0, y: 0},
                Vec3#🕍🤲😍😃{TODO SPREADs}{z: 1, x: 1, y: 1},
            ),
            c#:0.#Vec2#🍱🐶💣#1,
        ),
    );
}
```
*/
export const hash_3342eeb2: (arg_0: t_40e2c712) => t_40e2c712 = (c$0: t_40e2c712) => {
  let kxxx: t_40e2c712 = ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_40e2c712);
  return hash_47332321.h02cc25c4_0(c$0.z, hash_045e6e5c(kxxx, hash_0bd616ea(hash_ab6a3504.h3d436b7e_1(hash_3e9c70b8(hash_7aad9d8e.h3d436b7e_1(hash_93ca49f4.h02cc25c4_0(hash_75637b72(hash_ab6a3504.h3d436b7e_0(({
    type: "Vec3",
    x: c$0.x,
    y: c$0.x,
    z: c$0.x
  } as t_40e2c712), hash_68284c09)), 6), 3)), kxxx), ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 0
  } as t_40e2c712), ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_40e2c712)), c$0.y));
};

/**
```
const rect#19c69f73 = (
    samplePos#:0: Vec2#08f7c2ac,
    center#:1: Vec2#08f7c2ac,
    w#:2: float#builtin,
    h#:3: float#builtin,
): float#builtin ={}> {
    max#01aa8278(
        v: abs#0a530a64(v: samplePos#:0 -#04f14e9c#3d436b7e#1 center#:1) 
            -#04f14e9c#3d436b7e#1 Vec2#08f7c2ac{x#08f7c2ac#0: w#:2, y#08f7c2ac#1: h#:3},
    );
}
(samplePos#:0: Vec2#🍱🐶💣, center#:1: Vec2#🍱🐶💣, w#:2: float, h#:3: float): float => max#🍑🥙😝(
    AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
        abs#🌴👀🖕(AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(samplePos#:0, center#:1)),
        Vec2#🍱🐶💣{TODO SPREADs}{x: w#:2, y: h#:3},
    ),
)
```
*/
export const hash_19c69f73: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: number, arg_3: number) => number = (samplePos: t_08f7c2ac, center: t_08f7c2ac, w$2: number, h: number) => hash_01aa8278(hash_04f14e9c.h3d436b7e_1(hash_0a530a64(hash_04f14e9c.h3d436b7e_1(samplePos, center)), ({
  type: "Vec2",
  x: w$2,
  y: h
} as t_08f7c2ac)));

/**
```
const circle#83243b30 = (samplePos#:0: Vec2#08f7c2ac, center#:1: Vec2#08f7c2ac, r#:2: float#builtin): float#builtin ={}> {
    length#077fa0cc(v: samplePos#:0 -#04f14e9c#3d436b7e#1 center#:1) -#builtin r#:2;
}
(samplePos#:0: Vec2#🍱🐶💣, center#:1: Vec2#🍱🐶💣, r#:2: float): float => length#👨⛸️💖(
    AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(samplePos#:0, center#:1),
) - r#:2
```
*/
export const hash_83243b30: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: number) => number = (samplePos: t_08f7c2ac, center: t_08f7c2ac, r: number) => hash_077fa0cc(hash_04f14e9c.h3d436b7e_1(samplePos, center)) - r;

/**
```
const ScaleVec2Rev#02622a76 = Div#3b763160<Vec2#08f7c2ac, float#builtin, Vec2#08f7c2ac>{
    "/"#3b763160#0: (v#:0: Vec2#08f7c2ac, scale#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1,
    },
}
Div#🧜‍♂️🧖💧{TODO SPREADs}{
    h3b763160_0: (v#:0: Vec2#🍱🐶💣, scale#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: v#:0.#Vec2#🍱🐶💣#0 / scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 / scale#:1,
    },
}
```
*/
export const hash_02622a76: t_3b763160<t_08f7c2ac, number, t_08f7c2ac> = ({
  type: "3b763160",
  h3b763160_0: (v: t_08f7c2ac, scale: number) => ({
    type: "Vec2",
    x: v.x / scale,
    y: v.y / scale
  } as t_08f7c2ac)
} as t_3b763160<t_08f7c2ac, number, t_08f7c2ac>);

/**
```
const pixelToData#6762fe80 = (v#:0: Vec4#51a53bbe): Vec4#51a53bbe ={}> v#:0 
        *#5525be00#02cc25c4#0 pixScale#21a731a0 
    -#dcd86334#3d436b7e#1 pixOff#aca447b4
(v#:0: Vec4#✨🤶👨‍🔬😃): Vec4#✨🤶👨‍🔬😃 => AddSubVec4#🚐.#AddSub#🕕🧑‍🦲⚽#1(
    Mul42#🐎💇‍♂️🦸‍♀️😃.#Mul#👫🏭😪#0(v#:0, pixScale#🏊‍♂️👨‍❤️‍👨🐰),
    pixOff#⛄,
)
```
*/
export const hash_6762fe80: (arg_0: t_51a53bbe) => t_51a53bbe = (v: t_51a53bbe) => hash_dcd86334.h3d436b7e_1(hash_5525be00.h02cc25c4_0(v, hash_21a731a0), hash_aca447b4);

/**
```
const MulVec2#08bab8c4 = Div#3b763160<Vec2#08f7c2ac, Vec2#08f7c2ac, Vec2#08f7c2ac>{
    "/"#3b763160#0: (v#:0: Vec2#08f7c2ac, scale#:1: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1.y#08f7c2ac#1,
    },
}
Div#🧜‍♂️🧖💧{TODO SPREADs}{
    h3b763160_0: (v#:0: Vec2#🍱🐶💣, scale#:1: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: v#:0.#Vec2#🍱🐶💣#0 / scale#:1.#Vec2#🍱🐶💣#0,
        y: v#:0.#Vec2#🍱🐶💣#1 / scale#:1.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_08bab8c4: t_3b763160<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac> = ({
  type: "3b763160",
  h3b763160_0: (v: t_08f7c2ac, scale: t_08f7c2ac) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_08f7c2ac)
} as t_3b763160<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac>);

/**
```
const update#4b0c6d60 = (
    a1#:0: float#builtin,
    a2#:1: float#builtin,
    a1_v#:2: float#builtin,
    a2_v#:3: float#builtin,
): Vec4#51a53bbe ={}> {
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
    const a1#:20 = normalizeTheta#c3a71e42(t: a1#:18);
    const a2#:21 = normalizeTheta#c3a71e42(t: a2#:19);
    vec4#9d013532(x: a1#:20, y: a2#:21, z: a1_v#:16, w: a2_v#:17);
}
(a1#:0: float, a2#:1: float, a1_v#:2: float, a2_v#:3: float): Vec4#✨🤶👨‍🔬😃 => {
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
    return vec4#🕵️‍♂️(
        normalizeTheta#🐳(a1#:0 + a1_v#:16),
        normalizeTheta#🐳(a2#:1 + a2_v#:17),
        a1_v#:16,
        a2_v#:17,
    );
}
```
*/
export const hash_4b0c6d60: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_51a53bbe = (a1: number, a2: number, a1_v: number, a2_v: number) => {
  let a1_v$16: number = a1_v + (-hash_4466af4c * (2 * hash_b48c60a0 + hash_b48c60a0) * sin(a1) + -hash_b48c60a0 * hash_4466af4c * sin(a1 - 2 * a2) + -2 * sin(a1 - a2) * hash_b48c60a0 * (a2_v * a2_v * hash_0ce717e6 + a1_v * a1_v * hash_0ce717e6 * cos(a1 - a2))) / (hash_0ce717e6 * (2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0 * cos(2 * a1 - 2 * a2)));
  let a2_v$17: number = a2_v + 2 * sin(a1 - a2) * (a1_v * a1_v * hash_0ce717e6 * (hash_b48c60a0 + hash_b48c60a0) + hash_4466af4c * (hash_b48c60a0 + hash_b48c60a0) * cos(a1) + a2_v * a2_v * hash_0ce717e6 * hash_b48c60a0 * cos(a1 - a2)) / (hash_0ce717e6 * (2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0 * cos(2 * a1 - 2 * a2)));
  return hash_9d013532(hash_c3a71e42(a1 + a1_v$16), hash_c3a71e42(a2 + a2_v$17), a1_v$16, a2_v$17);
};

/**
```
const dataToPixel#51165250 = (v#:0: Vec4#51a53bbe): Vec4#51a53bbe ={}> {
    const res#:1 = (v#:0 +#dcd86334#3d436b7e#0 pixOff#aca447b4) 
        /#4ae0e9b4#3b763160#0 pixScale#21a731a0;
    res#:1;
}
(v#:0: Vec4#✨🤶👨‍🔬😃): Vec4#✨🤶👨‍🔬😃 => Scale42#🤽🤠👏😃.#Div#🧜‍♂️🧖💧#0(
    AddSubVec4#🚐.#AddSub#🕕🧑‍🦲⚽#0(v#:0, pixOff#⛄),
    pixScale#🏊‍♂️👨‍❤️‍👨🐰,
)
```
*/
export const hash_51165250: (arg_0: t_51a53bbe) => t_51a53bbe = (v: t_51a53bbe) => hash_4ae0e9b4.h3b763160_0(hash_dcd86334.h3d436b7e_0(v, hash_aca447b4), hash_21a731a0);

/**
```
const main#32cf99d4 = (
    env#:0: GLSLEnv#88074884,
    fragCoord#:1: Vec2#08f7c2ac,
    buffer#:2: sampler2D#builtin,
): Vec4#51a53bbe ={}> {
    const currentPos#:3 = env#:0.mouse#88074884#3 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1;
    const currentp#:4 = texture#builtin(buffer#:2, currentPos#:3);
    const current#:5 = pixelToData#6762fe80(v: currentp#:4);
    const p1#:6 = fragCoord#:1 
        -#04f14e9c#3d436b7e#1 env#:0.resolution#88074884#1 /#02622a76#3b763160#0 2.0;
    const c1#:7 = Vec2#08f7c2ac{
        x#08f7c2ac#0: sin#builtin(current#:5.x#08f7c2ac#0) *#builtin r2#0ce717e6,
        y#08f7c2ac#1: -cos#builtin(current#:5.x#08f7c2ac#0) *#builtin r2#0ce717e6,
    };
    const c2#:8 = Vec2#08f7c2ac{
        x#08f7c2ac#0: c1#:7.x#08f7c2ac#0 
            +#builtin sin#builtin(current#:5.y#08f7c2ac#1) *#builtin r2#0ce717e6,
        y#08f7c2ac#1: c1#:7.y#08f7c2ac#1 
            -#builtin cos#builtin(current#:5.y#08f7c2ac#1) *#builtin r2#0ce717e6,
    };
    if circle#83243b30(samplePos: p1#:6, center: c1#:7, r: 10.0) <#builtin 0.0 {
        vec4#9d013532(x: 1.0, y: 0.0, z: 0.0, w: 1.0);
    } else if circle#83243b30(samplePos: p1#:6, center: c2#:8, r: 10.0) <#builtin 0.0 {
        vec4#9d013532(x: 1.0, y: 1.0, z: 0.0, w: 1.0);
    } else if max#builtin(
            rect#19c69f73(
                samplePos: p1#:6,
                center: env#:0.mouse#88074884#3 
                    -#04f14e9c#3d436b7e#1 env#:0.resolution#88074884#1 /#02622a76#3b763160#0 2.0,
                w: 10.0,
                h: 10.0,
            ),
            -rect#19c69f73(
                samplePos: p1#:6,
                center: env#:0.mouse#88074884#3 
                    -#04f14e9c#3d436b7e#1 env#:0.resolution#88074884#1 /#02622a76#3b763160#0 2.0,
                w: 9.0,
                h: 9.0,
            ),
        ) 
        <#builtin 0.0 {
        vec4#9d013532(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else if length#077fa0cc(
            v: p1#:6 
                -#04f14e9c#3d436b7e#1 (env#:0.mouse#88074884#3 
                    -#04f14e9c#3d436b7e#1 env#:0.resolution#88074884#1 /#02622a76#3b763160#0 2.0),
        ) 
        <#builtin 100.0 {
        const t#:9 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1,
        );
        const rgb#:10 = hsv2rgb#3342eeb2(
            c: Vec3#40e2c712{
                x#08f7c2ac#0: t#:9.z#40e2c712#0,
                y#08f7c2ac#1: t#:9.w#51a53bbe#0,
                z#40e2c712#0: 1.0,
            },
        );
        Vec4#51a53bbe{...rgb#:10, w#51a53bbe#0: 1.0};
    } else if length#077fa0cc(
            v: p1#:6 
                -#04f14e9c#3d436b7e#1 (env#:0.mouse#88074884#3 
                    -#04f14e9c#3d436b7e#1 env#:0.resolution#88074884#1 /#02622a76#3b763160#0 2.0),
        ) 
        <#builtin 101.0 {
        vec4#9d013532(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else {
        const t#:11 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1,
        );
        const rgb#:12 = hsv2rgb#3342eeb2(
            c: Vec3#40e2c712{
                x#08f7c2ac#0: t#:11.y#08f7c2ac#1,
                y#08f7c2ac#1: t#:11.x#08f7c2ac#0,
                z#40e2c712#0: 1.0,
            },
        );
        Vec4#51a53bbe{...rgb#:12, w#51a53bbe#0: 1.0};
    };
}
(env#:0: GLSLEnv#💜, fragCoord#:1: Vec2#🍱🐶💣, buffer#:2: sampler2D): Vec4#✨🤶👨‍🔬😃 => {
    const current#:5: Vec4#✨🤶👨‍🔬😃 = pixelToData#🥔🧠🍏😃(
        texture(
            buffer#:2,
            MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(env#:0.#GLSLEnv#💜#3, env#:0.#GLSLEnv#💜#1),
        ),
    );
    const p1#:6: Vec2#🍱🐶💣 = AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
        fragCoord#:1,
        ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(env#:0.#GLSLEnv#💜#1, 2),
    );
    const c1#:7: Vec2#🍱🐶💣 = Vec2#🍱🐶💣{TODO SPREADs}{
        x: sin(current#:5.#Vec2#🍱🐶💣#0) * r2#🥅👬👨‍🦰,
        y: -cos(current#:5.#Vec2#🍱🐶💣#0) * r2#🥅👬👨‍🦰,
    };
    if circle#🚋(p1#:6, c1#:7, 10) < 0 {
        return vec4#🕵️‍♂️(1, 0, 0, 1);
    } else {
        if circle#🚋(
            p1#:6,
            Vec2#🍱🐶💣{TODO SPREADs}{
                x: c1#:7.#Vec2#🍱🐶💣#0 + sin(current#:5.#Vec2#🍱🐶💣#1) * r2#🥅👬👨‍🦰,
                y: c1#:7.#Vec2#🍱🐶💣#1 - cos(current#:5.#Vec2#🍱🐶💣#1) * r2#🥅👬👨‍🦰,
            },
            10,
        ) < 0 {
            return vec4#🕵️‍♂️(1, 1, 0, 1);
        } else {
            if max(
                rect#🕧🏋️‍♀️🚣(
                    p1#:6,
                    AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
                        env#:0.#GLSLEnv#💜#3,
                        ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(env#:0.#GLSLEnv#💜#1, 2),
                    ),
                    10,
                    10,
                ),
                -rect#🕧🏋️‍♀️🚣(
                    p1#:6,
                    AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
                        env#:0.#GLSLEnv#💜#3,
                        ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(env#:0.#GLSLEnv#💜#1, 2),
                    ),
                    9,
                    9,
                ),
            ) < 0 {
                return vec4#🕵️‍♂️(0, 0, 0, 1);
            } else {
                if length#👨⛸️💖(
                    AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
                        p1#:6,
                        AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
                            env#:0.#GLSLEnv#💜#3,
                            ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(env#:0.#GLSLEnv#💜#1, 2),
                        ),
                    ),
                ) < 100 {
                    const t#:9: Vec4#✨🤶👨‍🔬😃 = texture(
                        buffer#:2,
                        MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, env#:0.#GLSLEnv#💜#1),
                    );
                    return Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: _#:0};
                } else {
                    if length#👨⛸️💖(
                        AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
                            p1#:6,
                            AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
                                env#:0.#GLSLEnv#💜#3,
                                ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(env#:0.#GLSLEnv#💜#1, 2),
                            ),
                        ),
                    ) < 101 {
                        return vec4#🕵️‍♂️(0, 0, 0, 1);
                    } else {
                        const t#:11: Vec4#✨🤶👨‍🔬😃 = texture(
                            buffer#:2,
                            MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, env#:0.#GLSLEnv#💜#1),
                        );
                        return Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: _#:0};
                    };
                };
            };
        };
    };
}
```
*/
export const hash_32cf99d4: (arg_0: t_88074884, arg_1: t_08f7c2ac, arg_2: sampler2D) => t_51a53bbe = (env: t_88074884, fragCoord: t_08f7c2ac, buffer: sampler2D) => {
  let current: t_51a53bbe = hash_6762fe80(texture(buffer, hash_08bab8c4.h3b763160_0(env.mouse, env.resolution)));
  let p1: t_08f7c2ac = hash_04f14e9c.h3d436b7e_1(fragCoord, hash_02622a76.h3b763160_0(env.resolution, 2));
  let c1: t_08f7c2ac = ({
    type: "Vec2",
    x: sin(current.x) * hash_0ce717e6,
    y: -cos(current.x) * hash_0ce717e6
  } as t_08f7c2ac);

  if (hash_83243b30(p1, c1, 10) < 0) {
    return hash_9d013532(1, 0, 0, 1);
  } else {
    if (hash_83243b30(p1, ({
      type: "Vec2",
      x: c1.x + sin(current.y) * hash_0ce717e6,
      y: c1.y - cos(current.y) * hash_0ce717e6
    } as t_08f7c2ac), 10) < 0) {
      return hash_9d013532(1, 1, 0, 1);
    } else {
      if (max(hash_19c69f73(p1, hash_04f14e9c.h3d436b7e_1(env.mouse, hash_02622a76.h3b763160_0(env.resolution, 2)), 10, 10), -hash_19c69f73(p1, hash_04f14e9c.h3d436b7e_1(env.mouse, hash_02622a76.h3b763160_0(env.resolution, 2)), 9, 9)) < 0) {
        return hash_9d013532(0, 0, 0, 1);
      } else {
        if (hash_077fa0cc(hash_04f14e9c.h3d436b7e_1(p1, hash_04f14e9c.h3d436b7e_1(env.mouse, hash_02622a76.h3b763160_0(env.resolution, 2)))) < 100) {
          let t$9: t_51a53bbe = texture(buffer, hash_08bab8c4.h3b763160_0(fragCoord, env.resolution));
          return ({ ...hash_3342eeb2(({
              type: "Vec3",
              x: t$9.z,
              y: t$9.w,
              z: 1
            } as t_40e2c712)),
            type: "Vec4",
            w: 1
          } as t_51a53bbe);
        } else {
          if (hash_077fa0cc(hash_04f14e9c.h3d436b7e_1(p1, hash_04f14e9c.h3d436b7e_1(env.mouse, hash_02622a76.h3b763160_0(env.resolution, 2)))) < 101) {
            return hash_9d013532(0, 0, 0, 1);
          } else {
            let t$11: t_51a53bbe = texture(buffer, hash_08bab8c4.h3b763160_0(fragCoord, env.resolution));
            return ({ ...hash_3342eeb2(({
                type: "Vec3",
                x: t$11.y,
                y: t$11.x,
                z: 1
              } as t_40e2c712)),
              type: "Vec4",
              w: 1
            } as t_51a53bbe);
          }
        }
      }
    }
  }
};

/**
```
const pendulum#50bacb52 = (
    env#:0: GLSLEnv#88074884,
    fragCoord#:1: Vec2#08f7c2ac,
    buffer#:2: sampler2D#builtin,
): Vec4#51a53bbe ={}> {
    if env#:0.time#88074884#0 <=#builtin 0.01 {
        const t#:3 = fragCoord#:1 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1;
        vec4#9d013532(x: 0.0, y: 0.0, z: t#:3.x#08f7c2ac#0, w: t#:3.y#08f7c2ac#1);
    } else {
        const current#:4 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1,
        );
        const current#:5 = pixelToData#6762fe80(v: current#:4);
        dataToPixel#51165250(
            v: update#4b0c6d60(
                a1: current#:5.x#08f7c2ac#0,
                a2: current#:5.y#08f7c2ac#1,
                a1_v: current#:5.z#40e2c712#0,
                a2_v: current#:5.w#51a53bbe#0,
            ),
        );
    };
}
(env#:0: GLSLEnv#💜, fragCoord#:1: Vec2#🍱🐶💣, buffer#:2: sampler2D): Vec4#✨🤶👨‍🔬😃 => {
    if env#:0.#GLSLEnv#💜#0 <= 0.01 {
        const t#:3: Vec2#🍱🐶💣 = MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(
            fragCoord#:1,
            env#:0.#GLSLEnv#💜#1,
        );
        return vec4#🕵️‍♂️(0, 0, t#:3.#Vec2#🍱🐶💣#0, t#:3.#Vec2#🍱🐶💣#1);
    } else {
        const current#:5: Vec4#✨🤶👨‍🔬😃 = pixelToData#🥔🧠🍏😃(
            texture(buffer#:2, MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, env#:0.#GLSLEnv#💜#1)),
        );
        return dataToPixel#🐞⛷️👨‍🔧😃(
            update#🧜‍♂️🌅👐😃(
                current#:5.#Vec2#🍱🐶💣#0,
                current#:5.#Vec2#🍱🐶💣#1,
                current#:5.#Vec3#🕍🤲😍😃#0,
                current#:5.#Vec4#✨🤶👨‍🔬😃#0,
            ),
        );
    };
}
```
*/
export const hash_50bacb52: (arg_0: t_88074884, arg_1: t_08f7c2ac, arg_2: sampler2D) => t_51a53bbe = (env: t_88074884, fragCoord: t_08f7c2ac, buffer: sampler2D) => {
  if (env.time <= 0.01) {
    let t$3: t_08f7c2ac = hash_08bab8c4.h3b763160_0(fragCoord, env.resolution);
    return hash_9d013532(0, 0, t$3.x, t$3.y);
  } else {
    let current: t_51a53bbe = hash_6762fe80(texture(buffer, hash_08bab8c4.h3b763160_0(fragCoord, env.resolution)));
    return hash_51165250(hash_4b0c6d60(current.x, current.y, current.z, current.w));
  }
};
export const r1 = hash_0ce717e6;
export const r2 = hash_0ce717e6;
export const update = hash_4b0c6d60;
export const pendulum = hash_50bacb52;
export const main = hash_32cf99d4;