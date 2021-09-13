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
@ffi("Mat4") type Mat4#205100f4 = {
    r1: Vec4#51a53bbe,
    r2: Vec4#51a53bbe,
    r3: Vec4#51a53bbe,
    r4: Vec4#51a53bbe,
}
```
*/
type t_205100f4 = {
  type: "Mat4";
  r1: t_51a53bbe;
  r2: t_51a53bbe;
  r3: t_51a53bbe;
  r4: t_51a53bbe;
};

/**
```
@unique(1) type Mul#02cc25c4<A#:0, B#:1, C#:2> = {
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
@unique(0) type AddSub#3d436b7e<A#:0, B#:1, C#:2> = {
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
@unique(3) type Neg#616f559e<A#:0, B#:1> = {
    "-": (A#:0) ={}> B#:1,
}
```
*/
type t_616f559e<T_0, T_1> = {
  type: "616f559e";
  h616f559e_0: (arg_0: T_0) => T_1;
};

/**
```
@unique(2) type Div#3b763160<A#:0, B#:1, C#:2> = {
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
const length#0336cfd0 = (v#:0: Vec3#40e2c712): float#builtin ={}> sqrt#builtin(
    v#:0.x#08f7c2ac#0 *#builtin v#:0.x#08f7c2ac#0 
            +#builtin v#:0.y#08f7c2ac#1 *#builtin v#:0.y#08f7c2ac#1 
        +#builtin v#:0.z#40e2c712#0 *#builtin v#:0.z#40e2c712#0,
)
(v#:0: Vec3#🕍🤲😍😃): float => sqrt(
    v#:0.#Vec2#🍱🐶💣#0 * v#:0.#Vec2#🍱🐶💣#0 + v#:0.#Vec2#🍱🐶💣#1 * v#:0.#Vec2#🍱🐶💣#1 + v#:0.#Vec3#🕍🤲😍😃#0 * v#:0.#Vec3#🕍🤲😍😃#0,
)
```
*/
export const hash_0336cfd0: (arg_0: t_40e2c712) => number = (v: t_40e2c712) => sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/**
```
const ScaleVec3Rev#3cd38ed2 = Div#3b763160<Vec3#40e2c712, float#builtin, Vec3#40e2c712>{
    "/"#3b763160#0: (v#:0: Vec3#40e2c712, scale#:1: float#builtin): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1,
        z#40e2c712#0: v#:0.z#40e2c712#0 /#builtin scale#:1,
    },
}
Div#🧜‍♂️🧖💧{TODO SPREADs}{
    h3b763160_0: (v#:0: Vec3#🕍🤲😍😃, scale#:1: float): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: v#:0.#Vec3#🕍🤲😍😃#0 / scale#:1,
        x: v#:0.#Vec2#🍱🐶💣#0 / scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 / scale#:1,
    },
}
```
*/
export const hash_3cd38ed2: t_3b763160<t_40e2c712, number, t_40e2c712> = ({
  type: "3b763160",
  h3b763160_0: (v: t_40e2c712, scale: number) => ({
    type: "Vec3",
    x: v.x / scale,
    y: v.y / scale,
    z: v.z / scale
  } as t_40e2c712)
} as t_3b763160<t_40e2c712, number, t_40e2c712>);

/**
```
const dot#4952025c = (a#:0: Vec4#51a53bbe, b#:1: Vec4#51a53bbe): float#builtin ={}> {
    a#:0.x#08f7c2ac#0 *#builtin b#:1.x#08f7c2ac#0 
                +#builtin a#:0.y#08f7c2ac#1 *#builtin b#:1.y#08f7c2ac#1 
            +#builtin a#:0.z#40e2c712#0 *#builtin b#:1.z#40e2c712#0 
        +#builtin a#:0.w#51a53bbe#0 *#builtin b#:1.w#51a53bbe#0;
}
(a#:0: Vec4#✨🤶👨‍🔬😃, b#:1: Vec4#✨🤶👨‍🔬😃): float => a#:0.#Vec2#🍱🐶💣#0 * b#:1.#Vec2#🍱🐶💣#0 + a#:0.#Vec2#🍱🐶💣#1 * b#:1.#Vec2#🍱🐶💣#1 + a#:0.#Vec3#🕍🤲😍😃#0 * b#:1.#Vec3#🕍🤲😍😃#0 + a#:0.#Vec4#✨🤶👨‍🔬😃#0 * b#:1.#Vec4#✨🤶👨‍🔬😃#0
```
*/
export const hash_4952025c: (arg_0: t_51a53bbe, arg_1: t_51a53bbe) => number = (a: t_51a53bbe, b: t_51a53bbe) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

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
const NegVec3#23a08bf5 = Neg#616f559e<Vec3#40e2c712, Vec3#40e2c712>{
    "-"#616f559e#0: (v#:0: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: -v#:0.x#08f7c2ac#0,
        y#08f7c2ac#1: -v#:0.y#08f7c2ac#1,
        z#40e2c712#0: -v#:0.z#40e2c712#0,
    },
}
Neg#🚣‍♀️⚾🐭😃{TODO SPREADs}{
    h616f559e_0: (v#:0: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: -v#:0.#Vec3#🕍🤲😍😃#0,
        x: -v#:0.#Vec2#🍱🐶💣#0,
        y: -v#:0.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_23a08bf5: t_616f559e<t_40e2c712, t_40e2c712> = ({
  type: "616f559e",
  h616f559e_0: (v: t_40e2c712) => ({
    type: "Vec3",
    x: -v.x,
    y: -v.y,
    z: -v.z
  } as t_40e2c712)
} as t_616f559e<t_40e2c712, t_40e2c712>);

/**
```
const cross#4ada6ec0 = (one#:0: Vec3#40e2c712, two#:1: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
    x#08f7c2ac#0: one#:0.y#08f7c2ac#1 *#builtin two#:1.z#40e2c712#0 
        -#builtin two#:1.y#08f7c2ac#1 *#builtin one#:0.z#40e2c712#0,
    y#08f7c2ac#1: one#:0.z#40e2c712#0 *#builtin two#:1.x#08f7c2ac#0 
        -#builtin two#:1.z#40e2c712#0 *#builtin one#:0.x#08f7c2ac#0,
    z#40e2c712#0: one#:0.x#08f7c2ac#0 *#builtin two#:1.y#08f7c2ac#1 
        -#builtin two#:1.x#08f7c2ac#0 *#builtin one#:0.y#08f7c2ac#1,
}
(one#:0: Vec3#🕍🤲😍😃, two#:1: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: one#:0.#Vec2#🍱🐶💣#0 * two#:1.#Vec2#🍱🐶💣#1 - two#:1.#Vec2#🍱🐶💣#0 * one#:0.#Vec2#🍱🐶💣#1,
    x: one#:0.#Vec2#🍱🐶💣#1 * two#:1.#Vec3#🕍🤲😍😃#0 - two#:1.#Vec2#🍱🐶💣#1 * one#:0.#Vec3#🕍🤲😍😃#0,
    y: one#:0.#Vec3#🕍🤲😍😃#0 * two#:1.#Vec2#🍱🐶💣#0 - two#:1.#Vec3#🕍🤲😍😃#0 * one#:0.#Vec2#🍱🐶💣#0,
}
```
*/
export const hash_4ada6ec0: (arg_0: t_40e2c712, arg_1: t_40e2c712) => t_40e2c712 = (one: t_40e2c712, two: t_40e2c712) => ({
  type: "Vec3",
  x: one.y * two.z - two.y * one.z,
  y: one.z * two.x - two.z * one.x,
  z: one.x * two.y - two.x * one.y
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
const normalize#8aeba40a = (v#:0: Vec3#40e2c712): Vec3#40e2c712 ={}> v#:0 
    /#3cd38ed2#3b763160#0 length#0336cfd0(v#:0)
(v#:0: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => ScaleVec3Rev#☕🙎🎫.#Div#🧜‍♂️🧖💧#0(
    v#:0,
    length#🏅🤼‍♀️🤮(v#:0),
)
```
*/
export const hash_8aeba40a: (arg_0: t_40e2c712) => t_40e2c712 = (v: t_40e2c712) => hash_3cd38ed2.h3b763160_0(v, hash_0336cfd0(v));

/**
```
const vec3#4be2bbc8 = (v#:0: Vec2#08f7c2ac, z#:1: float#builtin): Vec3#40e2c712 ={}> Vec3#40e2c712{
    ...v#:0,
    z#40e2c712#0: z#:1,
}
(v#:0: Vec2#🍱🐶💣, z#:1: float): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: z#:1,
    x: _#:0,
    y: _#:0,
}
```
*/
export const hash_4be2bbc8: (arg_0: t_08f7c2ac, arg_1: number) => t_40e2c712 = (v: t_08f7c2ac, z$1: number) => ({ ...v,
  type: "Vec3",
  z: z$1
} as t_40e2c712);

/**
```
const radians#dabe7f9c = (degrees#:0: float#builtin): float#builtin ={}> degrees#:0 /#builtin 180.0 
    *#builtin PI#builtin
(degrees#:0: float): float => degrees#:0 / 180 * PI
```
*/
export const hash_dabe7f9c: (arg_0: number) => number = (degrees: number) => degrees / 180 * PI;

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
const EPSILON#17261aaa = 0.0001
0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const vec3#dca6e164 = (x#:0: float#builtin, y#:1: float#builtin, z#:2: float#builtin): Vec3#40e2c712 ={}> Vec3#40e2c712{
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
    z#40e2c712#0: z#:2,
}
(x#:0: float, y#:1: float, z#:2: float): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: z#:2,
    x: x#:0,
    y: y#:1,
}
```
*/
export const hash_dca6e164: (arg_0: number, arg_1: number, arg_2: number) => t_40e2c712 = (x: number, y: number, z: number) => ({
  type: "Vec3",
  x: x,
  y: y,
  z: z
} as t_40e2c712);

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
const MatByVector#197a9c42 = Mul#02cc25c4<Mat4#205100f4, Vec4#51a53bbe, Vec4#51a53bbe>{
    "*"#02cc25c4#0: (mat#:0: Mat4#205100f4, vec#:1: Vec4#51a53bbe): Vec4#51a53bbe ={}> Vec4#51a53bbe{
        z#40e2c712#0: dot#4952025c(a: mat#:0.r3#205100f4#2, b: vec#:1),
        x#08f7c2ac#0: dot#4952025c(a: mat#:0.r1#205100f4#0, b: vec#:1),
        y#08f7c2ac#1: dot#4952025c(a: mat#:0.r2#205100f4#1, b: vec#:1),
        w#51a53bbe#0: dot#4952025c(a: mat#:0.r4#205100f4#3, b: vec#:1),
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (mat#:0: Mat4#🧏‍♀️😟🐂, vec#:1: Vec4#✨🤶👨‍🔬😃): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{
        w: dot#🥀🧡💤😃(mat#:0.#Mat4#🧏‍♀️😟🐂#3, vec#:1),
        z: dot#🥀🧡💤😃(mat#:0.#Mat4#🧏‍♀️😟🐂#2, vec#:1),
    },
}
```
*/
export const hash_197a9c42: t_02cc25c4<t_205100f4, t_51a53bbe, t_51a53bbe> = ({
  type: "02cc25c4",
  h02cc25c4_0: (mat: t_205100f4, vec: t_51a53bbe) => ({
    type: "Vec4",
    z: hash_4952025c(mat.r3, vec),
    x: hash_4952025c(mat.r1, vec),
    y: hash_4952025c(mat.r2, vec),
    w: hash_4952025c(mat.r4, vec)
  } as t_51a53bbe)
} as t_02cc25c4<t_205100f4, t_51a53bbe, t_51a53bbe>);

/**
```
const xyz#312e3c78 = (v#:0: Vec4#51a53bbe): Vec3#40e2c712 ={}> Vec3#40e2c712{
    x#08f7c2ac#0: v#:0.x#08f7c2ac#0,
    y#08f7c2ac#1: v#:0.y#08f7c2ac#1,
    z#40e2c712#0: v#:0.z#40e2c712#0,
}
(v#:0: Vec4#✨🤶👨‍🔬😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: v#:0.#Vec3#🕍🤲😍😃#0,
    x: v#:0.#Vec2#🍱🐶💣#0,
    y: v#:0.#Vec2#🍱🐶💣#1,
}
```
*/
export const hash_312e3c78: (arg_0: t_51a53bbe) => t_40e2c712 = (v: t_51a53bbe) => ({
  type: "Vec3",
  x: v.x,
  y: v.y,
  z: v.z
} as t_40e2c712);

/**
```
const viewMatrix#b5e6bab8 = (eye#:0: Vec3#40e2c712, center#:1: Vec3#40e2c712, up#:2: Vec3#40e2c712): Mat4#205100f4 ={}> {
    const f#:3 = normalize#8aeba40a(v: center#:1 -#ab6a3504#3d436b7e#1 eye#:0);
    const s#:4 = normalize#8aeba40a(v: cross#4ada6ec0(one: f#:3, two: up#:2));
    const u#:5 = cross#4ada6ec0(one: s#:4, two: f#:3);
    Mat4#205100f4{
        r1#205100f4#0: Vec4#51a53bbe{...s#:4, w#51a53bbe#0: 0.0},
        r2#205100f4#1: Vec4#51a53bbe{...u#:5, w#51a53bbe#0: 0.0},
        r3#205100f4#2: Vec4#51a53bbe{...NegVec3#23a08bf5."-"#616f559e#0(f#:3), w#51a53bbe#0: 0.0},
        r4#205100f4#3: vec4#9d013532(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(eye#:0: Vec3#🕍🤲😍😃, center#:1: Vec3#🕍🤲😍😃, up#:2: Vec3#🕍🤲😍😃): Mat4#🧏‍♀️😟🐂 => {
    const f#:3: Vec3#🕍🤲😍😃 = normalize#😉(AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#1(center#:1, eye#:0));
    const s#:4: Vec3#🕍🤲😍😃 = normalize#😉(cross#🦑🌭🤜😃(f#:3, up#:2));
    return Mat4#🧏‍♀️😟🐂{TODO SPREADs}{
        r1: Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 0, z: _#:0},
        r2: Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 0, z: _#:0},
        r3: Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 0, z: _#:0},
        r4: vec4#🕵️‍♂️(0, 0, 0, 1),
    };
}
```
*/
export const hash_b5e6bab8: (arg_0: t_40e2c712, arg_1: t_40e2c712, arg_2: t_40e2c712) => t_205100f4 = (eye: t_40e2c712, center: t_40e2c712, up: t_40e2c712) => {
  let f: t_40e2c712 = hash_8aeba40a(hash_ab6a3504.h3d436b7e_1(center, eye));
  let s: t_40e2c712 = hash_8aeba40a(hash_4ada6ec0(f, up));
  return ({
    type: "Mat4",
    r1: ({ ...s,
      type: "Vec4",
      w: 0
    } as t_51a53bbe),
    r2: ({ ...hash_4ada6ec0(s, f),
      type: "Vec4",
      w: 0
    } as t_51a53bbe),
    r3: ({ ...hash_23a08bf5.h616f559e_0(f),
      type: "Vec4",
      w: 0
    } as t_51a53bbe),
    r4: hash_9d013532(0, 0, 0, 1)
  } as t_205100f4);
};

/**
```
const rayDirection#4bc41cc8 = (
    fieldOfView#:0: float#builtin,
    size#:1: Vec2#08f7c2ac,
    fragCoord#:2: Vec2#08f7c2ac,
): Vec3#40e2c712 ={}> {
    const xy#:3 = fragCoord#:2 -#04f14e9c#3d436b7e#1 size#:1 /#02622a76#3b763160#0 2.0;
    const z#:4 = size#:1.y#08f7c2ac#1 
        /#builtin tan#builtin(radians#dabe7f9c(degrees: fieldOfView#:0) /#builtin 2.0);
    normalize#8aeba40a(v: vec3#4be2bbc8(v: xy#:3, z: -z#:4));
}
(fieldOfView#:0: float, size#:1: Vec2#🍱🐶💣, fragCoord#:2: Vec2#🍱🐶💣): Vec3#🕍🤲😍😃 => normalize#😉(
    vec3#🧧👏👃😃(
        AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
            fragCoord#:2,
            ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(size#:1, 2),
        ),
        -size#:1.#Vec2#🍱🐶💣#1 / tan(radians#🌟(fieldOfView#:0) / 2),
    ),
)
```
*/
export const hash_4bc41cc8: (arg_0: number, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac) => t_40e2c712 = (fieldOfView: number, size: t_08f7c2ac, fragCoord: t_08f7c2ac) => hash_8aeba40a(hash_4be2bbc8(hash_04f14e9c.h3d436b7e_1(fragCoord, hash_02622a76.h3b763160_0(size, 2)), -(size.y / tan(hash_dabe7f9c(fieldOfView) / 2))));

/**
```
const vec4#820652cc = (v#:0: Vec3#40e2c712, w#:1: float#builtin): Vec4#51a53bbe ={}> Vec4#51a53bbe{
    ...v#:0,
    w#51a53bbe#0: w#:1,
}
(v#:0: Vec3#🕍🤲😍😃, w#:1: float): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{
    w: w#:1,
    z: _#:0,
}
```
*/
export const hash_820652cc: (arg_0: t_40e2c712, arg_1: number) => t_51a53bbe = (v: t_40e2c712, w$1: number) => ({ ...v,
  type: "Vec4",
  w: w$1
} as t_51a53bbe);

/**
```
const rotate#d95d304a = (tx#:0: float#builtin, ty#:1: float#builtin, tz#:2: float#builtin): Mat4#205100f4 ={}> {
    const cg#:3 = cos#builtin(tx#:0);
    const sg#:4 = sin#builtin(tx#:0);
    const cb#:5 = cos#builtin(ty#:1);
    const sb#:6 = sin#builtin(ty#:1);
    const ca#:7 = cos#builtin(tz#:2);
    const sa#:8 = sin#builtin(tz#:2);
    Mat4#205100f4{
        r1#205100f4#0: vec4#9d013532(
            x: ca#:7 *#builtin cb#:5,
            y: ca#:7 *#builtin sb#:6 *#builtin sg#:4 -#builtin sa#:8 *#builtin cg#:3,
            z: ca#:7 *#builtin sb#:6 *#builtin cg#:3 +#builtin sa#:8 *#builtin sg#:4,
            w: 0.0,
        ),
        r2#205100f4#1: vec4#9d013532(
            x: sa#:8 *#builtin cb#:5,
            y: sa#:8 *#builtin sb#:6 *#builtin sg#:4 +#builtin ca#:7 *#builtin cg#:3,
            z: sa#:8 *#builtin sb#:6 *#builtin cg#:3 -#builtin ca#:7 *#builtin sg#:4,
            w: 0.0,
        ),
        r3#205100f4#2: vec4#9d013532(
            x: -sb#:6,
            y: cb#:5 *#builtin sg#:4,
            z: cb#:5 *#builtin cg#:3,
            w: 0.0,
        ),
        r4#205100f4#3: vec4#9d013532(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(tx#:0: float, ty#:1: float, tz#:2: float): Mat4#🧏‍♀️😟🐂 => {
    const cg#:3: float = cos(tx#:0);
    const sg#:4: float = sin(tx#:0);
    const cb#:5: float = cos(ty#:1);
    const sb#:6: float = sin(ty#:1);
    const ca#:7: float = cos(tz#:2);
    const sa#:8: float = sin(tz#:2);
    return Mat4#🧏‍♀️😟🐂{TODO SPREADs}{
        r1: vec4#🕵️‍♂️(
            ca#:7 * cb#:5,
            ca#:7 * sb#:6 * sg#:4 - sa#:8 * cg#:3,
            ca#:7 * sb#:6 * cg#:3 + sa#:8 * sg#:4,
            0,
        ),
        r2: vec4#🕵️‍♂️(
            sa#:8 * cb#:5,
            sa#:8 * sb#:6 * sg#:4 + ca#:7 * cg#:3,
            sa#:8 * sb#:6 * cg#:3 - ca#:7 * sg#:4,
            0,
        ),
        r3: vec4#🕵️‍♂️(-sb#:6, cb#:5 * sg#:4, cb#:5 * cg#:3, 0),
        r4: vec4#🕵️‍♂️(0, 0, 0, 1),
    };
}
```
*/
export const hash_d95d304a: (arg_0: number, arg_1: number, arg_2: number) => t_205100f4 = (tx: number, ty: number, tz: number) => {
  let cg: number = cos(tx);
  let sg: number = sin(tx);
  let cb: number = cos(ty);
  let sb: number = sin(ty);
  let ca: number = cos(tz);
  let sa: number = sin(tz);
  return ({
    type: "Mat4",
    r1: hash_9d013532(ca * cb, ca * sb * sg - sa * cg, ca * sb * cg + sa * sg, 0),
    r2: hash_9d013532(sa * cb, sa * sb * sg + ca * cg, sa * sb * cg - ca * sg, 0),
    r3: hash_9d013532(-sb, cb * sg, cb * cg, 0),
    r4: hash_9d013532(0, 0, 0, 1)
  } as t_205100f4);
};

/**
```
const estimateNormal#46ebbca4 = (
    sceneSDF#:0: (GLSLEnv#88074884, Vec3#40e2c712) ={}> float#builtin,
    env#:1: GLSLEnv#88074884,
    p#:2: Vec3#40e2c712,
): Vec3#40e2c712 ={}> normalize#8aeba40a(
    v: vec3#dca6e164(
        x: sceneSDF#:0(
                env#:1,
                Vec3#40e2c712{...p#:2, x#08f7c2ac#0: p#:2.x#08f7c2ac#0 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#40e2c712{...p#:2, x#08f7c2ac#0: p#:2.x#08f7c2ac#0 -#builtin EPSILON#17261aaa},
            ),
        y: sceneSDF#:0(
                env#:1,
                Vec3#40e2c712{...p#:2, y#08f7c2ac#1: p#:2.y#08f7c2ac#1 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#40e2c712{...p#:2, y#08f7c2ac#1: p#:2.y#08f7c2ac#1 -#builtin EPSILON#17261aaa},
            ),
        z: sceneSDF#:0(
                env#:1,
                Vec3#40e2c712{...p#:2, z#40e2c712#0: p#:2.z#40e2c712#0 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#40e2c712{...p#:2, z#40e2c712#0: p#:2.z#40e2c712#0 -#builtin EPSILON#17261aaa},
            ),
    ),
)
(sceneSDF#:0: (GLSLEnv#💜, Vec3#🕍🤲😍😃) => float, env#:1: GLSLEnv#💜, p#:2: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => normalize#😉(
    vec3#🧝‍♀️(
        sceneSDF#:0(
            env#:1,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: _#:0,
                x: p#:2.#Vec2#🍱🐶💣#0 + EPSILON#🧂💃🚶‍♂️,
                y: _#:0,
            },
        ) - sceneSDF#:0(
            env#:1,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: _#:0,
                x: p#:2.#Vec2#🍱🐶💣#0 - EPSILON#🧂💃🚶‍♂️,
                y: _#:0,
            },
        ),
        sceneSDF#:0(
            env#:1,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:2.#Vec2#🍱🐶💣#1 + EPSILON#🧂💃🚶‍♂️,
            },
        ) - sceneSDF#:0(
            env#:1,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:2.#Vec2#🍱🐶💣#1 - EPSILON#🧂💃🚶‍♂️,
            },
        ),
        sceneSDF#:0(
            env#:1,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: p#:2.#Vec3#🕍🤲😍😃#0 + EPSILON#🧂💃🚶‍♂️,
                x: _#:0,
                y: _#:0,
            },
        ) - sceneSDF#:0(
            env#:1,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: p#:2.#Vec3#🕍🤲😍😃#0 - EPSILON#🧂💃🚶‍♂️,
                x: _#:0,
                y: _#:0,
            },
        ),
    ),
)
```
*/
export const hash_46ebbca4: (arg_0: (arg_0: t_88074884, arg_1: t_40e2c712) => number, arg_1: t_88074884, arg_2: t_40e2c712) => t_40e2c712 = (sceneSDF: (arg_0: t_88074884, arg_1: t_40e2c712) => number, env: t_88074884, p: t_40e2c712) => hash_8aeba40a(hash_dca6e164(sceneSDF(env, ({ ...p,
  type: "Vec3",
  x: p.x + hash_17261aaa
} as t_40e2c712)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  x: p.x - hash_17261aaa
} as t_40e2c712)), sceneSDF(env, ({ ...p,
  type: "Vec3",
  y: p.y + hash_17261aaa
} as t_40e2c712)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  y: p.y - hash_17261aaa
} as t_40e2c712)), sceneSDF(env, ({ ...p,
  type: "Vec3",
  z: p.z + hash_17261aaa
} as t_40e2c712)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  z: p.z - hash_17261aaa
} as t_40e2c712))));

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
const vec4#17ba07d0 = (x#:0: float#builtin): Vec4#51a53bbe ={}> Vec4#51a53bbe{
    z#40e2c712#0: x#:0,
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: x#:0,
    w#51a53bbe#0: x#:0,
}
(x#:0: float): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: x#:0, z: x#:0}
```
*/
export const hash_17ba07d0: (arg_0: number) => t_51a53bbe = (x: number) => ({
  type: "Vec4",
  z: x,
  x: x,
  y: x,
  w: x
} as t_51a53bbe);

/**
```
const rec shortestDistanceToSurface#3337f13c = (
    sceneSDF#:0: (GLSLEnv#88074884, Vec3#40e2c712) ={}> float#builtin,
    env#:1: GLSLEnv#88074884,
    eye#:2: Vec3#40e2c712,
    marchingDirection#:3: Vec3#40e2c712,
    start#:4: float#builtin,
    end#:5: float#builtin,
    stepsLeft#:6: int#builtin,
): float#builtin ={}> {
    const dist#:7 = sceneSDF#:0(
        env#:1,
        eye#:2 +#ab6a3504#3d436b7e#0 start#:4 *#47332321#02cc25c4#0 marchingDirection#:3,
    );
    if dist#:7 <#builtin EPSILON#17261aaa {
        start#:4;
    } else {
        const depth#:8 = start#:4 +#builtin dist#:7;
        if depth#:8 >=#builtin end#:5 ||#builtin stepsLeft#:6 <=#builtin 0 {
            end#:5;
        } else {
            3337f13c#self(
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
    sceneSDF#:0: (GLSLEnv#💜, Vec3#🕍🤲😍😃) => float,
    env#:1: GLSLEnv#💜,
    eye#:2: Vec3#🕍🤲😍😃,
    marchingDirection#:3: Vec3#🕍🤲😍😃,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
): float => {
    loop(unbounded) {
        const dist#:7: float = sceneSDF#:0(
            env#:1,
            AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#0(
                eye#:2,
                ScaleVec3#🎡👦💋😃.#Mul#👫🏭😪#0(start#:4, marchingDirection#:3),
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
export const hash_3337f13c: (arg_0: (arg_0: t_88074884, arg_1: t_40e2c712) => number, arg_1: t_88074884, arg_2: t_40e2c712, arg_3: t_40e2c712, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF: (arg_0: t_88074884, arg_1: t_40e2c712) => number, env: t_88074884, eye$2: t_40e2c712, marchingDirection: t_40e2c712, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = sceneSDF(env, hash_ab6a3504.h3d436b7e_0(eye$2, hash_47332321.h02cc25c4_0(start, marchingDirection)));

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
const getWorldDir#fe382480 = (
    resolution#:0: Vec2#08f7c2ac,
    coord#:1: Vec2#08f7c2ac,
    eye#:2: Vec3#40e2c712,
    fieldOfView#:3: float#builtin,
): Vec3#40e2c712 ={}> {
    const viewDir#:4 = rayDirection#4bc41cc8(
        fieldOfView#:3,
        size: resolution#:0,
        fragCoord: coord#:1,
    );
    const eye#:5 = Vec3#40e2c712{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#40e2c712#0: 5.0};
    const viewToWorld#:6 = viewMatrix#b5e6bab8(
        eye#:5,
        center: Vec3#40e2c712{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#40e2c712#0: 0.0},
        up: Vec3#40e2c712{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 1.0, z#40e2c712#0: 0.0},
    );
    xyz#312e3c78(
        v: viewToWorld#:6 *#197a9c42#02cc25c4#0 Vec4#51a53bbe{...viewDir#:4, w#51a53bbe#0: 0.0},
    );
}
(resolution#:0: Vec2#🍱🐶💣, coord#:1: Vec2#🍱🐶💣, eye#:2: Vec3#🕍🤲😍😃, fieldOfView#:3: float): Vec3#🕍🤲😍😃 => xyz#💗🌖🕍(
    MatByVector#☹️🥗🏌️‍♂️.#Mul#👫🏭😪#0(
        viewMatrix#🥮(
            Vec3#🕍🤲😍😃{TODO SPREADs}{z: 5, x: 0, y: 0},
            Vec3#🕍🤲😍😃{TODO SPREADs}{z: 0, x: 0, y: 0},
            Vec3#🕍🤲😍😃{TODO SPREADs}{z: 0, x: 0, y: 1},
        ),
        Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 0, z: _#:0},
    ),
)
```
*/
export const hash_fe382480: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: t_40e2c712, arg_3: number) => t_40e2c712 = (resolution: t_08f7c2ac, coord: t_08f7c2ac, eye$2: t_40e2c712, fieldOfView$3: number) => hash_312e3c78(hash_197a9c42.h02cc25c4_0(hash_b5e6bab8(({
  type: "Vec3",
  x: 0,
  y: 0,
  z: 5
} as t_40e2c712), ({
  type: "Vec3",
  x: 0,
  y: 0,
  z: 0
} as t_40e2c712), ({
  type: "Vec3",
  x: 0,
  y: 1,
  z: 0
} as t_40e2c712)), ({ ...hash_4bc41cc8(fieldOfView$3, resolution, coord),
  type: "Vec4",
  w: 0
} as t_51a53bbe)));

/**
```
const Scale4#4d024096 = Div#3b763160<Vec4#51a53bbe, float#builtin, Vec4#51a53bbe>{
    "/"#3b763160#0: (v#:0: Vec4#51a53bbe, scale#:1: float#builtin): Vec4#51a53bbe ={}> Vec4#51a53bbe{
        z#40e2c712#0: v#:0.z#40e2c712#0 /#builtin scale#:1,
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1,
        w#51a53bbe#0: v#:0.w#51a53bbe#0 /#builtin scale#:1,
    },
}
Div#🧜‍♂️🧖💧{TODO SPREADs}{
    h3b763160_0: (v#:0: Vec4#✨🤶👨‍🔬😃, scale#:1: float): Vec4#✨🤶👨‍🔬😃 => Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{
        w: v#:0.#Vec4#✨🤶👨‍🔬😃#0 / scale#:1,
        z: v#:0.#Vec3#🕍🤲😍😃#0 / scale#:1,
    },
}
```
*/
export const hash_4d024096: t_3b763160<t_51a53bbe, number, t_51a53bbe> = ({
  type: "3b763160",
  h3b763160_0: (v: t_51a53bbe, scale: number) => ({
    type: "Vec4",
    z: v.z / scale,
    x: v.x / scale,
    y: v.y / scale,
    w: v.w / scale
  } as t_51a53bbe)
} as t_3b763160<t_51a53bbe, number, t_51a53bbe>);

/**
```
const vec2#fa534764 = (x#:0: float#builtin, y#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
}
(x#:0: float, y#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{x: x#:0, y: y#:1}
```
*/
export const hash_fa534764: (arg_0: number, arg_1: number) => t_08f7c2ac = (x: number, y: number) => ({
  type: "Vec2",
  x: x,
  y: y
} as t_08f7c2ac);

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
const rotate#a1bd5370 = (
    v#:0: Vec3#40e2c712,
    x#:1: float#builtin,
    y#:2: float#builtin,
    z#:3: float#builtin,
): Vec3#40e2c712 ={}> {
    xyz#312e3c78(
        v: rotate#d95d304a(tx: x#:1, ty: y#:2, tz: z#:3) 
            *#197a9c42#02cc25c4#0 vec4#820652cc(v#:0, w: 1.0),
    );
}
(v#:0: Vec3#🕍🤲😍😃, x#:1: float, y#:2: float, z#:3: float): Vec3#🕍🤲😍😃 => xyz#💗🌖🕍(
    MatByVector#☹️🥗🏌️‍♂️.#Mul#👫🏭😪#0(rotate#😨(x#:1, y#:2, z#:3), vec4#🍬(v#:0, 1)),
)
```
*/
export const hash_a1bd5370: (arg_0: t_40e2c712, arg_1: number, arg_2: number, arg_3: number) => t_40e2c712 = (v: t_40e2c712, x$1: number, y$2: number, z$3: number) => hash_312e3c78(hash_197a9c42.h02cc25c4_0(hash_d95d304a(x$1, y$2, z$3), hash_820652cc(v, 1)));

/**
```
const marchNormals#6b119230 = (sceneSDF#:0: (GLSLEnv#88074884, Vec3#40e2c712) ={}> float#builtin): (
    env: GLSLEnv#88074884,
    coord: Vec2#08f7c2ac,
) ={}> Vec4#51a53bbe ={}> (env#:1: GLSLEnv#88074884, coord#:2: Vec2#08f7c2ac): Vec4#51a53bbe ={}> {
    const eye#:3 = Vec3#40e2c712{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#40e2c712#0: 5.0};
    const worldDir#:4 = getWorldDir#fe382480(
        resolution: env#:1.resolution#88074884#1,
        coord#:2,
        eye#:3,
        fieldOfView: 45.0,
    );
    const maxDist#:5 = 100.0;
    const dist#:6 = shortestDistanceToSurface#3337f13c(
        sceneSDF#:0,
        env#:1,
        eye#:3,
        marchingDirection: worldDir#:4,
        start: 0.0,
        end: maxDist#:5,
        stepsLeft: 255,
    );
    if dist#:6 >#builtin maxDist#:5 -#builtin EPSILON#17261aaa {
        vec4#17ba07d0(x: 0.0);
    } else {
        const worldPos#:7 = eye#:3 +#ab6a3504#3d436b7e#0 worldDir#:4 *#93ca49f4#02cc25c4#0 dist#:6;
        const normal#:8 = estimateNormal#46ebbca4(sceneSDF#:0, env#:1, p: worldPos#:7);
        vec4#820652cc(v: normal#:8, w: 1.0);
    };
}
(sceneSDF#:0: (GLSLEnv#💜, Vec3#🕍🤲😍😃) => float): (GLSLEnv#💜, Vec2#🍱🐶💣) => Vec4#✨🤶👨‍🔬😃 => (
    env#:1: GLSLEnv#💜,
    coord#:2: Vec2#🍱🐶💣,
): Vec4#✨🤶👨‍🔬😃 => {
    const eye#:3: Vec3#🕍🤲😍😃 = Vec3#🕍🤲😍😃{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:4: Vec3#🕍🤲😍😃 = getWorldDir#🧡(env#:1.#GLSLEnv#💜#1, coord#:2, eye#:3, 45);
    const dist#:6: float = shortestDistanceToSurface#👳🐯🚎(
        sceneSDF#:0,
        env#:1,
        eye#:3,
        worldDir#:4,
        0,
        100,
        255,
    );
    if dist#:6 > 100 - EPSILON#🧂💃🚶‍♂️ {
        return vec4#🏅🥕👨‍🦯(0);
    } else {
        return vec4#🍬(
            estimateNormal#👆⛰️😿😃(
                sceneSDF#:0,
                env#:1,
                AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#0(
                    eye#:3,
                    ScaleVec3_#🐩.#Mul#👫🏭😪#0(worldDir#:4, dist#:6),
                ),
            ),
            1,
        );
    };
}
```
*/
export const hash_6b119230: (arg_0: (arg_0: t_88074884, arg_1: t_40e2c712) => number) => (arg_0: t_88074884, arg_1: t_08f7c2ac) => t_51a53bbe = (sceneSDF: (arg_0: t_88074884, arg_1: t_40e2c712) => number) => (env: t_88074884, coord$2: t_08f7c2ac) => {
  let eye$3: t_40e2c712 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_40e2c712);
  let worldDir: t_40e2c712 = hash_fe382480(env.resolution, coord$2, eye$3, 45);
  let dist$6: number = hash_3337f13c(sceneSDF, env, eye$3, worldDir, 0, 100, 255);

  if (dist$6 > 100 - hash_17261aaa) {
    return hash_17ba07d0(0);
  } else {
    return hash_820652cc(hash_46ebbca4(sceneSDF, env, hash_ab6a3504.h3d436b7e_0(eye$3, hash_93ca49f4.h02cc25c4_0(worldDir, dist$6))), 1);
  }
};

/**
```
const multiSample#25217e68 = (fn#:0: (GLSLEnv#88074884, Vec2#08f7c2ac) ={}> Vec4#51a53bbe): (
    env: GLSLEnv#88074884,
    pos: Vec2#08f7c2ac,
) ={}> Vec4#51a53bbe ={}> (env#:1: GLSLEnv#88074884, pos#:2: Vec2#08f7c2ac): Vec4#51a53bbe ={}> {
    const total#:3 = fn#:0(env#:1, pos#:2) 
                    +#dcd86334#3d436b7e#0 fn#:0(
                        env#:1,
                        pos#:2 +#04f14e9c#3d436b7e#0 vec2#fa534764(x: 0.5, y: 0.0),
                    ) 
                +#dcd86334#3d436b7e#0 fn#:0(
                    env#:1,
                    pos#:2 +#04f14e9c#3d436b7e#0 vec2#fa534764(x: -0.5, y: 0.0),
                ) 
            +#dcd86334#3d436b7e#0 fn#:0(
                env#:1,
                pos#:2 +#04f14e9c#3d436b7e#0 vec2#fa534764(x: 0.0, y: 0.5),
            ) 
        +#dcd86334#3d436b7e#0 fn#:0(
            env#:1,
            pos#:2 +#04f14e9c#3d436b7e#0 vec2#fa534764(x: 0.0, y: -0.5),
        );
    total#:3 /#4d024096#3b763160#0 5.0;
}
(fn#:0: (GLSLEnv#💜, Vec2#🍱🐶💣) => Vec4#✨🤶👨‍🔬😃): (GLSLEnv#💜, Vec2#🍱🐶💣) => Vec4#✨🤶👨‍🔬😃 => (
    env#:1: GLSLEnv#💜,
    pos#:2: Vec2#🍱🐶💣,
): Vec4#✨🤶👨‍🔬😃 => Scale4#👋💬👨‍🦳😃.#Div#🧜‍♂️🧖💧#0(
    AddSubVec4#🚐.#AddSub#🕕🧑‍🦲⚽#0(
        AddSubVec4#🚐.#AddSub#🕕🧑‍🦲⚽#0(
            AddSubVec4#🚐.#AddSub#🕕🧑‍🦲⚽#0(
                AddSubVec4#🚐.#AddSub#🕕🧑‍🦲⚽#0(
                    fn#:0(env#:1, pos#:2),
                    fn#:0(env#:1, AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#0(pos#:2, vec2#🚠(0.5, 0))),
                ),
                fn#:0(env#:1, AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#0(pos#:2, vec2#🚠(-0.5, 0))),
            ),
            fn#:0(env#:1, AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#0(pos#:2, vec2#🚠(0, 0.5))),
        ),
        fn#:0(env#:1, AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#0(pos#:2, vec2#🚠(0, -0.5))),
    ),
    5,
)
```
*/
export const hash_25217e68: (arg_0: (arg_0: t_88074884, arg_1: t_08f7c2ac) => t_51a53bbe) => (arg_0: t_88074884, arg_1: t_08f7c2ac) => t_51a53bbe = (fn: (arg_0: t_88074884, arg_1: t_08f7c2ac) => t_51a53bbe) => (env: t_88074884, pos: t_08f7c2ac) => hash_4d024096.h3b763160_0(hash_dcd86334.h3d436b7e_0(hash_dcd86334.h3d436b7e_0(hash_dcd86334.h3d436b7e_0(hash_dcd86334.h3d436b7e_0(fn(env, pos), fn(env, hash_04f14e9c.h3d436b7e_0(pos, hash_fa534764(0.5, 0)))), fn(env, hash_04f14e9c.h3d436b7e_0(pos, hash_fa534764(-0.5, 0)))), fn(env, hash_04f14e9c.h3d436b7e_0(pos, hash_fa534764(0, 0.5)))), fn(env, hash_04f14e9c.h3d436b7e_0(pos, hash_fa534764(0, -0.5)))), 5);

/**
```
const ok#b2ebdc3c = multiSample#25217e68(
    fn: marchNormals#6b119230(
        sceneSDF: (env#:0: GLSLEnv#88074884, pos#:1: Vec3#40e2c712): float#builtin ={}> {
            const pos#:2 = rotate#a1bd5370(
                v: pos#:1,
                x: 0.0,
                y: env#:0.time#88074884#0 /#builtin 2.0,
                z: env#:0.time#88074884#0,
            );
            const mag#:3 = (sin#builtin(env#:0.time#88074884#0 /#builtin 2.0) +#builtin 1.0) 
                    *#builtin 60.0 
                +#builtin 1.0;
            const period#:4 = 30.0 *#builtin (sin#builtin(env#:0.time#88074884#0) +#builtin 1.0);
            const sphere#:5 = length#0336cfd0(v: pos#:2) -#builtin 0.5;
            const bumps#:6 = sin#builtin(pos#:2.x#08f7c2ac#0 *#builtin period#:4) 
                    +#builtin sin#builtin(pos#:2.z#40e2c712#0 *#builtin period#:4) 
                +#builtin sin#builtin(pos#:2.y#08f7c2ac#1 *#builtin period#:4);
            sphere#:5 -#builtin bumps#:6 /#builtin mag#:3;
        },
    ),
)
multiSample#☘️💩🕷️(
    marchNormals#🐧👽🍜😃(
        (env#:0: GLSLEnv#💜, pos#:1: Vec3#🕍🤲😍😃): float => {
            const pos#:2: Vec3#🕍🤲😍😃 = rotate#⏲️(
                pos#:1,
                0,
                env#:0.#GLSLEnv#💜#0 / 2,
                env#:0.#GLSLEnv#💜#0,
            );
            const period#:4: float = 30 * sin(env#:0.#GLSLEnv#💜#0) + 1;
            return length#🏅🤼‍♀️🤮(pos#:2) - 0.5 - (sin(pos#:2.#Vec2#🍱🐶💣#0 * period#:4) + sin(
                pos#:2.#Vec3#🕍🤲😍😃#0 * period#:4,
            ) + sin(pos#:2.#Vec2#🍱🐶💣#1 * period#:4)) / ((sin(env#:0.#GLSLEnv#💜#0 / 2) + 1) * (60) + 1);
        },
    ),
)
```
*/
export const hash_b2ebdc3c: (arg_0: t_88074884, arg_1: t_08f7c2ac) => t_51a53bbe = hash_25217e68(hash_6b119230((env$0: t_88074884, pos$1: t_40e2c712) => {
  let pos: t_40e2c712 = hash_a1bd5370(pos$1, 0, env$0.time / 2, env$0.time);
  let period: number = 30 * (sin(env$0.time) + 1);
  return hash_0336cfd0(pos) - 0.5 - (sin(pos.x * period) + sin(pos.z * period) + sin(pos.y * period)) / ((sin(env$0.time / 2) + 1) * 60 + 1);
}));
export const ok = hash_b2ebdc3c;