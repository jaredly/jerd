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
@ffi("Vec3") type Vec3#b79db448 = {
    ...Vec2#08f7c2ac,
    z: float#builtin,
}
```
*/
type t_b79db448 = {
  type: "Vec3";
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi("GLSLEnv") type GLSLEnv#a25a17de = {
    time: float#builtin,
    resolution: Vec2#08f7c2ac,
    camera: Vec3#b79db448,
    mouse: Vec2#08f7c2ac,
}
```
*/
type t_a25a17de = {
  type: "GLSLEnv";
  time: number;
  resolution: t_08f7c2ac;
  camera: t_b79db448;
  mouse: t_08f7c2ac;
};

/**
```
@unique(2) type Div#44e31bac<A#:0, B#:1, C#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_44e31bac<A, B, C> = {
  type: "44e31bac";
  h44e31bac_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
@ffi("Vec4") type Vec4#b1f05ae8 = {
    ...Vec3#b79db448,
    w: float#builtin,
}
```
*/
type t_b1f05ae8 = {
  type: "Vec4";
  w: number;
  z: number;
  x: number;
  y: number;
};

/**
```
@unique(0) type AddSub#6ca64060<A#:0, B#:1, C#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_6ca64060<A, B, C> = {
  type: "6ca64060";
  h6ca64060_0: (arg_0: T_0, arg_1: T_1) => T_2;
  h6ca64060_1: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
@unique(1) type Mul#63513dcd<A#:0, B#:1, C#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_63513dcd<A, B, C> = {
  type: "63513dcd";
  h63513dcd_0: (arg_0: T_0, arg_1: T_1) => T_2;
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
const clamp#c11492dc = (v#:0: Vec3#b79db448, min#:1: Vec3#b79db448, max#:2: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
    x#08f7c2ac#0: clamp#0611a7c0(
        v: v#:0.x#08f7c2ac#0,
        minv: min#:1.x#08f7c2ac#0,
        maxv: max#:2.x#08f7c2ac#0,
    ),
    y#08f7c2ac#1: clamp#0611a7c0(
        v: v#:0.y#08f7c2ac#1,
        minv: min#:1.y#08f7c2ac#1,
        maxv: max#:2.y#08f7c2ac#1,
    ),
    z#b79db448#0: clamp#0611a7c0(
        v: v#:0.z#b79db448#0,
        minv: min#:1.z#b79db448#0,
        maxv: max#:2.z#b79db448#0,
    ),
}
(v#:0: Vec3#😦, min#:1: Vec3#😦, max#:2: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: clamp#🎉😹👹(v#:0.#Vec3#😦#0, min#:1.#Vec3#😦#0, max#:2.#Vec3#😦#0),
    x: clamp#🎉😹👹(v#:0.#Vec2#🍱🐶💣#0, min#:1.#Vec2#🍱🐶💣#0, max#:2.#Vec2#🍱🐶💣#0),
    y: clamp#🎉😹👹(v#:0.#Vec2#🍱🐶💣#1, min#:1.#Vec2#🍱🐶💣#1, max#:2.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_c11492dc: (arg_0: t_b79db448, arg_1: t_b79db448, arg_2: t_b79db448) => t_b79db448 = (v: t_b79db448, min: t_b79db448, max: t_b79db448) => ({
  type: "Vec3",
  x: hash_0611a7c0(v.x, min.x, max.x),
  y: hash_0611a7c0(v.y, min.y, max.y),
  z: hash_0611a7c0(v.z, min.z, max.z)
} as t_b79db448);

/**
```
const mix#02ec5ac4 = (a#:0: Vec3#b79db448, b#:1: Vec3#b79db448, c#:2: float#builtin): Vec3#b79db448 ={}> {
    Vec3#b79db448{
        x#08f7c2ac#0: lerp#dd72dd18(a: a#:0.x#08f7c2ac#0, b: b#:1.x#08f7c2ac#0, c#:2),
        y#08f7c2ac#1: lerp#dd72dd18(a: a#:0.y#08f7c2ac#1, b: b#:1.y#08f7c2ac#1, c#:2),
        z#b79db448#0: lerp#dd72dd18(a: a#:0.z#b79db448#0, b: b#:1.z#b79db448#0, c#:2),
    };
}
(a#:0: Vec3#😦, b#:1: Vec3#😦, c#:2: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: lerp#👩‍💼(a#:0.#Vec3#😦#0, b#:1.#Vec3#😦#0, c#:2),
    x: lerp#👩‍💼(a#:0.#Vec2#🍱🐶💣#0, b#:1.#Vec2#🍱🐶💣#0, c#:2),
    y: lerp#👩‍💼(a#:0.#Vec2#🍱🐶💣#1, b#:1.#Vec2#🍱🐶💣#1, c#:2),
}
```
*/
export const hash_02ec5ac4: (arg_0: t_b79db448, arg_1: t_b79db448, arg_2: number) => t_b79db448 = (a: t_b79db448, b: t_b79db448, c: number) => ({
  type: "Vec3",
  x: hash_dd72dd18(a.x, b.x, c),
  y: hash_dd72dd18(a.y, b.y, c),
  z: hash_dd72dd18(a.z, b.z, c)
} as t_b79db448);

/**
```
const ScaleVec3#9ac70f34 = Mul#63513dcd<float#builtin, Vec3#b79db448, Vec3#b79db448>{
    "*"#63513dcd#0: (scale#:0: float#builtin, v#:1: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: v#:1.x#08f7c2ac#0 *#builtin scale#:0,
        y#08f7c2ac#1: v#:1.y#08f7c2ac#1 *#builtin scale#:0,
        z#b79db448#0: v#:1.z#b79db448#0 *#builtin scale#:0,
    },
}
Mul#👩‍❤️‍👩😱🦉😃{TODO SPREADs}{
    h63513dcd_0: (scale#:0: float, v#:1: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: v#:1.#Vec3#😦#0 * scale#:0,
        x: v#:1.#Vec2#🍱🐶💣#0 * scale#:0,
        y: v#:1.#Vec2#🍱🐶💣#1 * scale#:0,
    },
}
```
*/
export const hash_9ac70f34: t_63513dcd<number, t_b79db448, t_b79db448> = ({
  type: "63513dcd",
  h63513dcd_0: (scale: number, v$1: t_b79db448) => ({
    type: "Vec3",
    x: v$1.x * scale,
    y: v$1.y * scale,
    z: v$1.z * scale
  } as t_b79db448)
} as t_63513dcd<number, t_b79db448, t_b79db448>);

/**
```
const kxyz#32c0f7cc = Vec3#b79db448{
    x#08f7c2ac#0: 1.0,
    y#08f7c2ac#1: 2.0 /#builtin 3.0,
    z#b79db448#0: 1.0 /#builtin 3.0,
}
Vec3#😦{TODO SPREADs}{z: 1 / 3, x: 1, y: 2 / 3}
```
*/
export const hash_32c0f7cc: t_b79db448 = ({
  type: "Vec3",
  x: 1,
  y: 2 / 3,
  z: 1 / 3
} as t_b79db448);

/**
```
const AddSubVec3#44c647be = AddSub#6ca64060<Vec3#b79db448, Vec3#b79db448, Vec3#b79db448>{
    "+"#6ca64060#0: (one#:0: Vec3#b79db448, two#:1: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
        z#b79db448#0: one#:0.z#b79db448#0 +#builtin two#:1.z#b79db448#0,
    },
    "-"#6ca64060#1: (one#:2: Vec3#b79db448, two#:3: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
        z#b79db448#0: one#:2.z#b79db448#0 -#builtin two#:3.z#b79db448#0,
    },
}
AddSub#🤡🧗‍♂️🥧😃{TODO SPREADs}{
    h6ca64060_0: (one#:0: Vec3#😦, two#:1: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: one#:0.#Vec3#😦#0 + two#:1.#Vec3#😦#0,
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1.#Vec2#🍱🐶💣#0,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1.#Vec2#🍱🐶💣#1,
    },
    h6ca64060_1: (one#:2: Vec3#😦, two#:3: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: one#:2.#Vec3#😦#0 - two#:3.#Vec3#😦#0,
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3.#Vec2#🍱🐶💣#0,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_44c647be: t_6ca64060<t_b79db448, t_b79db448, t_b79db448> = ({
  type: "6ca64060",
  h6ca64060_0: (one: t_b79db448, two: t_b79db448) => ({
    type: "Vec3",
    x: one.x + two.x,
    y: one.y + two.y,
    z: one.z + two.z
  } as t_b79db448),
  h6ca64060_1: (one$2: t_b79db448, two$3: t_b79db448) => ({
    type: "Vec3",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    z: one$2.z - two$3.z
  } as t_b79db448)
} as t_6ca64060<t_b79db448, t_b79db448, t_b79db448>);

/**
```
const fract#00a465ac = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
    x#08f7c2ac#0: fract#14e72ade(v: v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: fract#14e72ade(v: v#:0.y#08f7c2ac#1),
    z#b79db448#0: fract#14e72ade(v: v#:0.z#b79db448#0),
}
(v#:0: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: fract#🧃💑🤶(v#:0.#Vec3#😦#0),
    x: fract#🧃💑🤶(v#:0.#Vec2#🍱🐶💣#0),
    y: fract#🧃💑🤶(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_00a465ac: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => ({
  type: "Vec3",
  x: hash_14e72ade(v.x),
  y: hash_14e72ade(v.y),
  z: hash_14e72ade(v.z)
} as t_b79db448);

/**
```
const ScaleVec3_#f2b2c8e8 = Mul#63513dcd<Vec3#b79db448, float#builtin, Vec3#b79db448>{
    "*"#63513dcd#0: (v#:0: Vec3#b79db448, scale#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1,
        z#b79db448#0: v#:0.z#b79db448#0 *#builtin scale#:1,
    },
}
Mul#👩‍❤️‍👩😱🦉😃{TODO SPREADs}{
    h63513dcd_0: (v#:0: Vec3#😦, scale#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: v#:0.#Vec3#😦#0 * scale#:1,
        x: v#:0.#Vec2#🍱🐶💣#0 * scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 * scale#:1,
    },
}
```
*/
export const hash_f2b2c8e8: t_63513dcd<t_b79db448, number, t_b79db448> = ({
  type: "63513dcd",
  h63513dcd_0: (v: t_b79db448, scale$1: number) => ({
    type: "Vec3",
    x: v.x * scale$1,
    y: v.y * scale$1,
    z: v.z * scale$1
  } as t_b79db448)
} as t_63513dcd<t_b79db448, number, t_b79db448>);

/**
```
const AddSubVec3_#093fe9fe = AddSub#6ca64060<Vec3#b79db448, float#builtin, Vec3#b79db448>{
    "+"#6ca64060#0: (one#:0: Vec3#b79db448, two#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1,
        z#b79db448#0: one#:0.z#b79db448#0 +#builtin two#:1,
    },
    "-"#6ca64060#1: (one#:2: Vec3#b79db448, two#:3: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3,
        z#b79db448#0: one#:2.z#b79db448#0 -#builtin two#:3,
    },
}
AddSub#🤡🧗‍♂️🥧😃{TODO SPREADs}{
    h6ca64060_0: (one#:0: Vec3#😦, two#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: one#:0.#Vec3#😦#0 + two#:1,
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1,
    },
    h6ca64060_1: (one#:2: Vec3#😦, two#:3: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: one#:2.#Vec3#😦#0 - two#:3,
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3,
    },
}
```
*/
export const hash_093fe9fe: t_6ca64060<t_b79db448, number, t_b79db448> = ({
  type: "6ca64060",
  h6ca64060_0: (one: t_b79db448, two: number) => ({
    type: "Vec3",
    x: one.x + two,
    y: one.y + two,
    z: one.z + two
  } as t_b79db448),
  h6ca64060_1: (one$2: t_b79db448, two$3: number) => ({
    type: "Vec3",
    x: one$2.x - two$3,
    y: one$2.y - two$3,
    z: one$2.z - two$3
  } as t_b79db448)
} as t_6ca64060<t_b79db448, number, t_b79db448>);

/**
```
const abs#cb5109f8 = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
    x#08f7c2ac#0: abs#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: abs#builtin(v#:0.y#08f7c2ac#1),
    z#b79db448#0: abs#builtin(v#:0.z#b79db448#0),
}
(v#:0: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: abs(v#:0.#Vec3#😦#0),
    x: abs(v#:0.#Vec2#🍱🐶💣#0),
    y: abs(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_cb5109f8: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_b79db448);

/**
```
const vec4#25a5853b = (
    x#:0: float#builtin,
    y#:1: float#builtin,
    z#:2: float#builtin,
    w#:3: float#builtin,
): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
    z#b79db448#0: z#:2,
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
    w#b1f05ae8#0: w#:3,
}
(x#:0: float, y#:1: float, z#:2: float, w#:3: float): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
    w: w#:3,
    z: z#:2,
}
```
*/
export const hash_25a5853b: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_b1f05ae8 = (x: number, y: number, z: number, w: number) => ({
  type: "Vec4",
  z: z,
  x: x,
  y: y,
  w: w
} as t_b1f05ae8);

/**
```
const abs#23e0e8a0 = (v#:0: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: abs#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: abs#builtin(v#:0.y#08f7c2ac#1),
}
(v#:0: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
    x: abs(v#:0.#Vec2#🍱🐶💣#0),
    y: abs(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_23e0e8a0: (arg_0: t_08f7c2ac) => t_08f7c2ac = (v: t_08f7c2ac) => ({
  type: "Vec2",
  x: abs(v.x),
  y: abs(v.y)
} as t_08f7c2ac);

/**
```
const AddSubVec2#f9ef2af4 = AddSub#6ca64060<Vec2#08f7c2ac, Vec2#08f7c2ac, Vec2#08f7c2ac>{
    "+"#6ca64060#0: (one#:0: Vec2#08f7c2ac, two#:1: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
    },
    "-"#6ca64060#1: (one#:2: Vec2#08f7c2ac, two#:3: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
    },
}
AddSub#🤡🧗‍♂️🥧😃{TODO SPREADs}{
    h6ca64060_0: (one#:0: Vec2#🍱🐶💣, two#:1: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1.#Vec2#🍱🐶💣#0,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1.#Vec2#🍱🐶💣#1,
    },
    h6ca64060_1: (one#:2: Vec2#🍱🐶💣, two#:3: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3.#Vec2#🍱🐶💣#0,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_f9ef2af4: t_6ca64060<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac> = ({
  type: "6ca64060",
  h6ca64060_0: (one: t_08f7c2ac, two: t_08f7c2ac) => ({
    type: "Vec2",
    x: one.x + two.x,
    y: one.y + two.y
  } as t_08f7c2ac),
  h6ca64060_1: (one$2: t_08f7c2ac, two$3: t_08f7c2ac) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_08f7c2ac)
} as t_6ca64060<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac>);

/**
```
const max#66dcb50a = (v#:0: Vec2#08f7c2ac): float#builtin ={}> {
    max#builtin(v#:0.x#08f7c2ac#0, v#:0.y#08f7c2ac#1);
}
(v#:0: Vec2#🍱🐶💣): float => max(v#:0.#Vec2#🍱🐶💣#0, v#:0.#Vec2#🍱🐶💣#1)
```
*/
export const hash_66dcb50a: (arg_0: t_08f7c2ac) => number = (v: t_08f7c2ac) => max(v.x, v.y);

/**
```
const length#0f32aa7b = (v#:0: Vec2#08f7c2ac): float#builtin ={}> sqrt#builtin(
    v#:0.x#08f7c2ac#0 *#builtin v#:0.x#08f7c2ac#0 
        +#builtin v#:0.y#08f7c2ac#1 *#builtin v#:0.y#08f7c2ac#1,
)
(v#:0: Vec2#🍱🐶💣): float => sqrt(
    v#:0.#Vec2#🍱🐶💣#0 * v#:0.#Vec2#🍱🐶💣#0 + v#:0.#Vec2#🍱🐶💣#1 * v#:0.#Vec2#🍱🐶💣#1,
)
```
*/
export const hash_0f32aa7b: (arg_0: t_08f7c2ac) => number = (v: t_08f7c2ac) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const pixOff#f0ae504e = Vec4#b1f05ae8{
    z#b79db448#0: MaxVelocity#158e986a,
    x#08f7c2ac#0: PI#builtin,
    y#08f7c2ac#1: PI#builtin,
    w#b1f05ae8#0: MaxVelocity#158e986a,
}
Vec4#🌎{TODO SPREADs}{w: MaxVelocity#😻🌨️🧙‍♀️, z: MaxVelocity#😻🌨️🧙‍♀️}
```
*/
export const hash_f0ae504e: t_b1f05ae8 = ({
  type: "Vec4",
  z: hash_158e986a,
  x: PI,
  y: PI,
  w: hash_158e986a
} as t_b1f05ae8);

/**
```
const pixScale#7f734bee = Vec4#b1f05ae8{
    z#b79db448#0: MaxVelocity#158e986a *#builtin 2.0,
    x#08f7c2ac#0: TWO_PI#fc1474ce,
    y#08f7c2ac#1: TWO_PI#fc1474ce,
    w#b1f05ae8#0: MaxVelocity#158e986a *#builtin 2.0,
}
Vec4#🌎{TODO SPREADs}{w: MaxVelocity#😻🌨️🧙‍♀️ * 2, z: MaxVelocity#😻🌨️🧙‍♀️ * 2}
```
*/
export const hash_7f734bee: t_b1f05ae8 = ({
  type: "Vec4",
  z: hash_158e986a * 2,
  x: hash_fc1474ce,
  y: hash_fc1474ce,
  w: hash_158e986a * 2
} as t_b1f05ae8);

/**
```
const Mul42#3f848f44 = Mul#63513dcd<Vec4#b1f05ae8, Vec4#b1f05ae8, Vec4#b1f05ae8>{
    "*"#63513dcd#0: (v#:0: Vec4#b1f05ae8, scale#:1: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: v#:0.z#b79db448#0 *#builtin scale#:1.z#b79db448#0,
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1.y#08f7c2ac#1,
        w#b1f05ae8#0: v#:0.w#b1f05ae8#0 *#builtin scale#:1.w#b1f05ae8#0,
    },
}
Mul#👩‍❤️‍👩😱🦉😃{TODO SPREADs}{
    h63513dcd_0: (v#:0: Vec4#🌎, scale#:1: Vec4#🌎): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: v#:0.#Vec4#🌎#0 * scale#:1.#Vec4#🌎#0,
        z: v#:0.#Vec3#😦#0 * scale#:1.#Vec3#😦#0,
    },
}
```
*/
export const hash_3f848f44: t_63513dcd<t_b1f05ae8, t_b1f05ae8, t_b1f05ae8> = ({
  type: "63513dcd",
  h63513dcd_0: (v: t_b1f05ae8, scale$1: t_b1f05ae8) => ({
    type: "Vec4",
    z: v.z * scale$1.z,
    x: v.x * scale$1.x,
    y: v.y * scale$1.y,
    w: v.w * scale$1.w
  } as t_b1f05ae8)
} as t_63513dcd<t_b1f05ae8, t_b1f05ae8, t_b1f05ae8>);

/**
```
const AddSubVec4#6704233e = AddSub#6ca64060<Vec4#b1f05ae8, Vec4#b1f05ae8, Vec4#b1f05ae8>{
    "+"#6ca64060#0: (one#:0: Vec4#b1f05ae8, two#:1: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: one#:0.z#b79db448#0 +#builtin two#:1.z#b79db448#0,
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
        w#b1f05ae8#0: one#:0.w#b1f05ae8#0 +#builtin two#:1.w#b1f05ae8#0,
    },
    "-"#6ca64060#1: (one#:2: Vec4#b1f05ae8, two#:3: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: one#:2.z#b79db448#0 -#builtin two#:3.z#b79db448#0,
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
        w#b1f05ae8#0: one#:2.w#b1f05ae8#0 -#builtin two#:3.w#b1f05ae8#0,
    },
}
AddSub#🤡🧗‍♂️🥧😃{TODO SPREADs}{
    h6ca64060_0: (one#:0: Vec4#🌎, two#:1: Vec4#🌎): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: one#:0.#Vec4#🌎#0 + two#:1.#Vec4#🌎#0,
        z: one#:0.#Vec3#😦#0 + two#:1.#Vec3#😦#0,
    },
    h6ca64060_1: (one#:2: Vec4#🌎, two#:3: Vec4#🌎): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: one#:2.#Vec4#🌎#0 - two#:3.#Vec4#🌎#0,
        z: one#:2.#Vec3#😦#0 - two#:3.#Vec3#😦#0,
    },
}
```
*/
export const hash_6704233e: t_6ca64060<t_b1f05ae8, t_b1f05ae8, t_b1f05ae8> = ({
  type: "6ca64060",
  h6ca64060_0: (one: t_b1f05ae8, two: t_b1f05ae8) => ({
    type: "Vec4",
    z: one.z + two.z,
    x: one.x + two.x,
    y: one.y + two.y,
    w: one.w + two.w
  } as t_b1f05ae8),
  h6ca64060_1: (one$2: t_b1f05ae8, two$3: t_b1f05ae8) => ({
    type: "Vec4",
    z: one$2.z - two$3.z,
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    w: one$2.w - two$3.w
  } as t_b1f05ae8)
} as t_6ca64060<t_b1f05ae8, t_b1f05ae8, t_b1f05ae8>);

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
const Scale42#9cfe88e4 = Div#44e31bac<Vec4#b1f05ae8, Vec4#b1f05ae8, Vec4#b1f05ae8>{
    "/"#44e31bac#0: (v#:0: Vec4#b1f05ae8, scale#:1: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: v#:0.z#b79db448#0 /#builtin scale#:1.z#b79db448#0,
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1.y#08f7c2ac#1,
        w#b1f05ae8#0: v#:0.w#b1f05ae8#0 /#builtin scale#:1.w#b1f05ae8#0,
    },
}
Div#🌈👶😭😃{TODO SPREADs}{
    h44e31bac_0: (v#:0: Vec4#🌎, scale#:1: Vec4#🌎): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: v#:0.#Vec4#🌎#0 / scale#:1.#Vec4#🌎#0,
        z: v#:0.#Vec3#😦#0 / scale#:1.#Vec3#😦#0,
    },
}
```
*/
export const hash_9cfe88e4: t_44e31bac<t_b1f05ae8, t_b1f05ae8, t_b1f05ae8> = ({
  type: "44e31bac",
  h44e31bac_0: (v: t_b1f05ae8, scale$1: t_b1f05ae8) => ({
    type: "Vec4",
    z: v.z / scale$1.z,
    x: v.x / scale$1.x,
    y: v.y / scale$1.y,
    w: v.w / scale$1.w
  } as t_b1f05ae8)
} as t_44e31bac<t_b1f05ae8, t_b1f05ae8, t_b1f05ae8>);

/**
```
const hsv2rgb#01e4a6d7 = (c#:0: Vec3#b79db448): Vec3#b79db448 ={}> {
    const K#:1 = vec4#25a5853b(x: 1.0, y: 2.0 /#builtin 3.0, z: 1.0 /#builtin 3.0, w: 3.0);
    const xxx#:2 = Vec3#b79db448{
        x#08f7c2ac#0: c#:0.x#08f7c2ac#0,
        y#08f7c2ac#1: c#:0.x#08f7c2ac#0,
        z#b79db448#0: c#:0.x#08f7c2ac#0,
    };
    const p#:3 = abs#cb5109f8(
        v: fract#00a465ac(v: xxx#:2 +#44c647be#6ca64060#0 kxyz#32c0f7cc) *#f2b2c8e8#63513dcd#0 6.0 
            -#093fe9fe#6ca64060#1 3.0,
    );
    const kxxx#:4 = Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 1.0};
    c#:0.z#b79db448#0 
        *#9ac70f34#63513dcd#0 mix#02ec5ac4(
            a: kxxx#:4,
            b: clamp#c11492dc(
                v: p#:3 -#44c647be#6ca64060#1 kxxx#:4,
                min: Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 0.0},
                max: Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 1.0},
            ),
            c: c#:0.y#08f7c2ac#1,
        );
}
(c#:0: Vec3#😦): Vec3#😦 => {
    const kxxx#:4: Vec3#😦 = Vec3#😦{TODO SPREADs}{z: 1, x: 1, y: 1};
    return ScaleVec3#🚐.#Mul#👩‍❤️‍👩😱🦉😃#0(
        c#:0.#Vec3#😦#0,
        mix#🍨⛺😴(
            kxxx#:4,
            clamp#🥃(
                AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#1(
                    abs#🐱(
                        AddSubVec3_#🐆🧸🗯️.#AddSub#🤡🧗‍♂️🥧😃#1(
                            ScaleVec3_#🙅‍♀️.#Mul#👩‍❤️‍👩😱🦉😃#0(
                                fract#🚵‍♂️🧑‍🔬😉(
                                    AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#0(
                                        Vec3#😦{TODO SPREADs}{
                                            z: c#:0.#Vec2#🍱🐶💣#0,
                                            x: c#:0.#Vec2#🍱🐶💣#0,
                                            y: c#:0.#Vec2#🍱🐶💣#0,
                                        },
                                        kxyz#🎟️🤓🚉,
                                    ),
                                ),
                                6,
                            ),
                            3,
                        ),
                    ),
                    kxxx#:4,
                ),
                Vec3#😦{TODO SPREADs}{z: 0, x: 0, y: 0},
                Vec3#😦{TODO SPREADs}{z: 1, x: 1, y: 1},
            ),
            c#:0.#Vec2#🍱🐶💣#1,
        ),
    );
}
```
*/
export const hash_01e4a6d7: (arg_0: t_b79db448) => t_b79db448 = (c$0: t_b79db448) => {
  let kxxx: t_b79db448 = ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_b79db448);
  return hash_9ac70f34.h63513dcd_0(c$0.z, hash_02ec5ac4(kxxx, hash_c11492dc(hash_44c647be.h6ca64060_1(hash_cb5109f8(hash_093fe9fe.h6ca64060_1(hash_f2b2c8e8.h63513dcd_0(hash_00a465ac(hash_44c647be.h6ca64060_0(({
    type: "Vec3",
    x: c$0.x,
    y: c$0.x,
    z: c$0.x
  } as t_b79db448), hash_32c0f7cc)), 6), 3)), kxxx), ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 0
  } as t_b79db448), ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_b79db448)), c$0.y));
};

/**
```
const rect#fec35b28 = (
    samplePos#:0: Vec2#08f7c2ac,
    center#:1: Vec2#08f7c2ac,
    w#:2: float#builtin,
    h#:3: float#builtin,
): float#builtin ={}> {
    max#66dcb50a(
        v: abs#23e0e8a0(v: samplePos#:0 -#f9ef2af4#6ca64060#1 center#:1) 
            -#f9ef2af4#6ca64060#1 Vec2#08f7c2ac{x#08f7c2ac#0: w#:2, y#08f7c2ac#1: h#:3},
    );
}
(samplePos#:0: Vec2#🍱🐶💣, center#:1: Vec2#🍱🐶💣, w#:2: float, h#:3: float): float => max#🧑‍🌾🚊🍇😃(
    AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
        abs#🤘🤠🐲(AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(samplePos#:0, center#:1)),
        Vec2#🍱🐶💣{TODO SPREADs}{x: w#:2, y: h#:3},
    ),
)
```
*/
export const hash_fec35b28: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: number, arg_3: number) => number = (samplePos: t_08f7c2ac, center: t_08f7c2ac, w$2: number, h: number) => hash_66dcb50a(hash_f9ef2af4.h6ca64060_1(hash_23e0e8a0(hash_f9ef2af4.h6ca64060_1(samplePos, center)), ({
  type: "Vec2",
  x: w$2,
  y: h
} as t_08f7c2ac)));

/**
```
const circle#f79bf7c8 = (samplePos#:0: Vec2#08f7c2ac, center#:1: Vec2#08f7c2ac, r#:2: float#builtin): float#builtin ={}> {
    length#0f32aa7b(v: samplePos#:0 -#f9ef2af4#6ca64060#1 center#:1) -#builtin r#:2;
}
(samplePos#:0: Vec2#🍱🐶💣, center#:1: Vec2#🍱🐶💣, r#:2: float): float => length#🥝✊🧏‍♂️(
    AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(samplePos#:0, center#:1),
) - r#:2
```
*/
export const hash_f79bf7c8: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: number) => number = (samplePos: t_08f7c2ac, center: t_08f7c2ac, r: number) => hash_0f32aa7b(hash_f9ef2af4.h6ca64060_1(samplePos, center)) - r;

/**
```
const ScaleVec2Rev#6a0c8558 = Div#44e31bac<Vec2#08f7c2ac, float#builtin, Vec2#08f7c2ac>{
    "/"#44e31bac#0: (v#:0: Vec2#08f7c2ac, scale#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1,
    },
}
Div#🌈👶😭😃{TODO SPREADs}{
    h44e31bac_0: (v#:0: Vec2#🍱🐶💣, scale#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: v#:0.#Vec2#🍱🐶💣#0 / scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 / scale#:1,
    },
}
```
*/
export const hash_6a0c8558: t_44e31bac<t_08f7c2ac, number, t_08f7c2ac> = ({
  type: "44e31bac",
  h44e31bac_0: (v: t_08f7c2ac, scale$1: number) => ({
    type: "Vec2",
    x: v.x / scale$1,
    y: v.y / scale$1
  } as t_08f7c2ac)
} as t_44e31bac<t_08f7c2ac, number, t_08f7c2ac>);

/**
```
const pixelToData#709719a8 = (v#:0: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> v#:0 
        *#3f848f44#63513dcd#0 pixScale#7f734bee 
    -#6704233e#6ca64060#1 pixOff#f0ae504e
(v#:0: Vec4#🌎): Vec4#🌎 => AddSubVec4#🚚👨‍⚖️🍊😃.#AddSub#🤡🧗‍♂️🥧😃#1(
    Mul42#🦽👨‍🎨🎲.#Mul#👩‍❤️‍👩😱🦉😃#0(v#:0, pixScale#🥌👩🎰😃),
    pixOff#😭,
)
```
*/
export const hash_709719a8: (arg_0: t_b1f05ae8) => t_b1f05ae8 = (v: t_b1f05ae8) => hash_6704233e.h6ca64060_1(hash_3f848f44.h63513dcd_0(v, hash_7f734bee), hash_f0ae504e);

/**
```
const MulVec2#2d0db3a8 = Div#44e31bac<Vec2#08f7c2ac, Vec2#08f7c2ac, Vec2#08f7c2ac>{
    "/"#44e31bac#0: (v#:0: Vec2#08f7c2ac, scale#:1: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1.y#08f7c2ac#1,
    },
}
Div#🌈👶😭😃{TODO SPREADs}{
    h44e31bac_0: (v#:0: Vec2#🍱🐶💣, scale#:1: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: v#:0.#Vec2#🍱🐶💣#0 / scale#:1.#Vec2#🍱🐶💣#0,
        y: v#:0.#Vec2#🍱🐶💣#1 / scale#:1.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_2d0db3a8: t_44e31bac<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac> = ({
  type: "44e31bac",
  h44e31bac_0: (v: t_08f7c2ac, scale$1: t_08f7c2ac) => ({
    type: "Vec2",
    x: v.x / scale$1.x,
    y: v.y / scale$1.y
  } as t_08f7c2ac)
} as t_44e31bac<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac>);

/**
```
const update#47d59d3c = (
    a1#:0: float#builtin,
    a2#:1: float#builtin,
    a1_v#:2: float#builtin,
    a2_v#:3: float#builtin,
): Vec4#b1f05ae8 ={}> {
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
    vec4#25a5853b(x: a1#:20, y: a2#:21, z: a1_v#:16, w: a2_v#:17);
}
(a1#:0: float, a2#:1: float, a1_v#:2: float, a2_v#:3: float): Vec4#🌎 => {
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
    return vec4#👸🧜‍♀️🏵️(
        normalizeTheta#🏄‍♀️🧛‍♂️👁️😃(a1#:0 + a1_v#:16),
        normalizeTheta#🏄‍♀️🧛‍♂️👁️😃(a2#:1 + a2_v#:17),
        a1_v#:16,
        a2_v#:17,
    );
}
```
*/
export const hash_47d59d3c: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_b1f05ae8 = (a1: number, a2: number, a1_v: number, a2_v: number) => {
  let a1_v$16: number = a1_v + (-hash_4466af4c * (2 * hash_b48c60a0 + hash_b48c60a0) * sin(a1) + -hash_b48c60a0 * hash_4466af4c * sin(a1 - 2 * a2) + -2 * sin(a1 - a2) * hash_b48c60a0 * (a2_v * a2_v * hash_0ce717e6 + a1_v * a1_v * hash_0ce717e6 * cos(a1 - a2))) / (hash_0ce717e6 * (2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0 * cos(2 * a1 - 2 * a2)));
  let a2_v$17: number = a2_v + 2 * sin(a1 - a2) * (a1_v * a1_v * hash_0ce717e6 * (hash_b48c60a0 + hash_b48c60a0) + hash_4466af4c * (hash_b48c60a0 + hash_b48c60a0) * cos(a1) + a2_v * a2_v * hash_0ce717e6 * hash_b48c60a0 * cos(a1 - a2)) / (hash_0ce717e6 * (2 * hash_b48c60a0 + hash_b48c60a0 - hash_b48c60a0 * cos(2 * a1 - 2 * a2)));
  return hash_25a5853b(hash_4c35759b(a1 + a1_v$16), hash_4c35759b(a2 + a2_v$17), a1_v$16, a2_v$17);
};

/**
```
const dataToPixel#46edfaef = (v#:0: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> {
    const res#:1 = (v#:0 +#6704233e#6ca64060#0 pixOff#f0ae504e) 
        /#9cfe88e4#44e31bac#0 pixScale#7f734bee;
    res#:1;
}
(v#:0: Vec4#🌎): Vec4#🌎 => Scale42#🙎‍♂️.#Div#🌈👶😭😃#0(
    AddSubVec4#🚚👨‍⚖️🍊😃.#AddSub#🤡🧗‍♂️🥧😃#0(v#:0, pixOff#😭),
    pixScale#🥌👩🎰😃,
)
```
*/
export const hash_46edfaef: (arg_0: t_b1f05ae8) => t_b1f05ae8 = (v: t_b1f05ae8) => hash_9cfe88e4.h44e31bac_0(hash_6704233e.h6ca64060_0(v, hash_f0ae504e), hash_7f734bee);

/**
```
const main#81b5cfe0 = (
    env#:0: GLSLEnv#a25a17de,
    fragCoord#:1: Vec2#08f7c2ac,
    buffer#:2: sampler2D#builtin,
): Vec4#b1f05ae8 ={}> {
    const currentPos#:3 = env#:0.mouse#a25a17de#3 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1;
    const currentp#:4 = texture#builtin(buffer#:2, currentPos#:3);
    const current#:5 = pixelToData#709719a8(v: currentp#:4);
    const p1#:6 = fragCoord#:1 
        -#f9ef2af4#6ca64060#1 env#:0.resolution#a25a17de#1 /#6a0c8558#44e31bac#0 2.0;
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
    if circle#f79bf7c8(samplePos: p1#:6, center: c1#:7, r: 10.0) <#builtin 0.0 {
        vec4#25a5853b(x: 1.0, y: 0.0, z: 0.0, w: 1.0);
    } else if circle#f79bf7c8(samplePos: p1#:6, center: c2#:8, r: 10.0) <#builtin 0.0 {
        vec4#25a5853b(x: 1.0, y: 1.0, z: 0.0, w: 1.0);
    } else if max#builtin(
            rect#fec35b28(
                samplePos: p1#:6,
                center: env#:0.mouse#a25a17de#3 
                    -#f9ef2af4#6ca64060#1 env#:0.resolution#a25a17de#1 /#6a0c8558#44e31bac#0 2.0,
                w: 10.0,
                h: 10.0,
            ),
            -rect#fec35b28(
                samplePos: p1#:6,
                center: env#:0.mouse#a25a17de#3 
                    -#f9ef2af4#6ca64060#1 env#:0.resolution#a25a17de#1 /#6a0c8558#44e31bac#0 2.0,
                w: 9.0,
                h: 9.0,
            ),
        ) 
        <#builtin 0.0 {
        vec4#25a5853b(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else if length#0f32aa7b(
            v: p1#:6 
                -#f9ef2af4#6ca64060#1 (env#:0.mouse#a25a17de#3 
                    -#f9ef2af4#6ca64060#1 env#:0.resolution#a25a17de#1 /#6a0c8558#44e31bac#0 2.0),
        ) 
        <#builtin 100.0 {
        const t#:9 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1,
        );
        const rgb#:10 = hsv2rgb#01e4a6d7(
            c: Vec3#b79db448{
                x#08f7c2ac#0: t#:9.z#b79db448#0,
                y#08f7c2ac#1: t#:9.w#b1f05ae8#0,
                z#b79db448#0: 1.0,
            },
        );
        Vec4#b1f05ae8{...rgb#:10, w#b1f05ae8#0: 1.0};
    } else if length#0f32aa7b(
            v: p1#:6 
                -#f9ef2af4#6ca64060#1 (env#:0.mouse#a25a17de#3 
                    -#f9ef2af4#6ca64060#1 env#:0.resolution#a25a17de#1 /#6a0c8558#44e31bac#0 2.0),
        ) 
        <#builtin 101.0 {
        vec4#25a5853b(x: 0.0, y: 0.0, z: 0.0, w: 1.0);
    } else {
        const t#:11 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1,
        );
        const rgb#:12 = hsv2rgb#01e4a6d7(
            c: Vec3#b79db448{
                x#08f7c2ac#0: t#:11.y#08f7c2ac#1,
                y#08f7c2ac#1: t#:11.x#08f7c2ac#0,
                z#b79db448#0: 1.0,
            },
        );
        Vec4#b1f05ae8{...rgb#:12, w#b1f05ae8#0: 1.0};
    };
}
(env#:0: GLSLEnv#🏏, fragCoord#:1: Vec2#🍱🐶💣, buffer#:2: sampler2D): Vec4#🌎 => {
    const current#:5: Vec4#🌎 = pixelToData#🚴💏🏭😃(
        texture(
            buffer#:2,
            MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(env#:0.#GLSLEnv#🏏#3, env#:0.#GLSLEnv#🏏#1),
        ),
    );
    const p1#:6: Vec2#🍱🐶💣 = AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
        fragCoord#:1,
        ScaleVec2Rev#🧙‍♀️🎡🥙😃.#Div#🌈👶😭😃#0(env#:0.#GLSLEnv#🏏#1, 2),
    );
    const c1#:7: Vec2#🍱🐶💣 = Vec2#🍱🐶💣{TODO SPREADs}{
        x: sin(current#:5.#Vec2#🍱🐶💣#0) * r2#🥅👬👨‍🦰,
        y: -cos(current#:5.#Vec2#🍱🐶💣#0) * r2#🥅👬👨‍🦰,
    };
    if circle#🧧(p1#:6, c1#:7, 10) < 0 {
        return vec4#👸🧜‍♀️🏵️(1, 0, 0, 1);
    } else {
        if circle#🧧(
            p1#:6,
            Vec2#🍱🐶💣{TODO SPREADs}{
                x: c1#:7.#Vec2#🍱🐶💣#0 + sin(current#:5.#Vec2#🍱🐶💣#1) * r2#🥅👬👨‍🦰,
                y: c1#:7.#Vec2#🍱🐶💣#1 - cos(current#:5.#Vec2#🍱🐶💣#1) * r2#🥅👬👨‍🦰,
            },
            10,
        ) < 0 {
            return vec4#👸🧜‍♀️🏵️(1, 1, 0, 1);
        } else {
            if max(
                rect#🚅(
                    p1#:6,
                    AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
                        env#:0.#GLSLEnv#🏏#3,
                        ScaleVec2Rev#🧙‍♀️🎡🥙😃.#Div#🌈👶😭😃#0(env#:0.#GLSLEnv#🏏#1, 2),
                    ),
                    10,
                    10,
                ),
                -rect#🚅(
                    p1#:6,
                    AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
                        env#:0.#GLSLEnv#🏏#3,
                        ScaleVec2Rev#🧙‍♀️🎡🥙😃.#Div#🌈👶😭😃#0(env#:0.#GLSLEnv#🏏#1, 2),
                    ),
                    9,
                    9,
                ),
            ) < 0 {
                return vec4#👸🧜‍♀️🏵️(0, 0, 0, 1);
            } else {
                if length#🥝✊🧏‍♂️(
                    AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
                        p1#:6,
                        AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
                            env#:0.#GLSLEnv#🏏#3,
                            ScaleVec2Rev#🧙‍♀️🎡🥙😃.#Div#🌈👶😭😃#0(env#:0.#GLSLEnv#🏏#1, 2),
                        ),
                    ),
                ) < 100 {
                    const t#:9: Vec4#🌎 = texture(
                        buffer#:2,
                        MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(fragCoord#:1, env#:0.#GLSLEnv#🏏#1),
                    );
                    return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
                } else {
                    if length#🥝✊🧏‍♂️(
                        AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
                            p1#:6,
                            AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
                                env#:0.#GLSLEnv#🏏#3,
                                ScaleVec2Rev#🧙‍♀️🎡🥙😃.#Div#🌈👶😭😃#0(env#:0.#GLSLEnv#🏏#1, 2),
                            ),
                        ),
                    ) < 101 {
                        return vec4#👸🧜‍♀️🏵️(0, 0, 0, 1);
                    } else {
                        const t#:11: Vec4#🌎 = texture(
                            buffer#:2,
                            MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(fragCoord#:1, env#:0.#GLSLEnv#🏏#1),
                        );
                        return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
                    };
                };
            };
        };
    };
}
```
*/
export const hash_81b5cfe0: (arg_0: t_a25a17de, arg_1: t_08f7c2ac, arg_2: sampler2D) => t_b1f05ae8 = (env: t_a25a17de, fragCoord: t_08f7c2ac, buffer: sampler2D) => {
  let current: t_b1f05ae8 = hash_709719a8(texture(buffer, hash_2d0db3a8.h44e31bac_0(env.mouse, env.resolution)));
  let p1: t_08f7c2ac = hash_f9ef2af4.h6ca64060_1(fragCoord, hash_6a0c8558.h44e31bac_0(env.resolution, 2));
  let c1: t_08f7c2ac = ({
    type: "Vec2",
    x: sin(current.x) * hash_0ce717e6,
    y: -cos(current.x) * hash_0ce717e6
  } as t_08f7c2ac);

  if (hash_f79bf7c8(p1, c1, 10) < 0) {
    return hash_25a5853b(1, 0, 0, 1);
  } else {
    if (hash_f79bf7c8(p1, ({
      type: "Vec2",
      x: c1.x + sin(current.y) * hash_0ce717e6,
      y: c1.y - cos(current.y) * hash_0ce717e6
    } as t_08f7c2ac), 10) < 0) {
      return hash_25a5853b(1, 1, 0, 1);
    } else {
      if (max(hash_fec35b28(p1, hash_f9ef2af4.h6ca64060_1(env.mouse, hash_6a0c8558.h44e31bac_0(env.resolution, 2)), 10, 10), -hash_fec35b28(p1, hash_f9ef2af4.h6ca64060_1(env.mouse, hash_6a0c8558.h44e31bac_0(env.resolution, 2)), 9, 9)) < 0) {
        return hash_25a5853b(0, 0, 0, 1);
      } else {
        if (hash_0f32aa7b(hash_f9ef2af4.h6ca64060_1(p1, hash_f9ef2af4.h6ca64060_1(env.mouse, hash_6a0c8558.h44e31bac_0(env.resolution, 2)))) < 100) {
          let t$9: t_b1f05ae8 = texture(buffer, hash_2d0db3a8.h44e31bac_0(fragCoord, env.resolution));
          return ({ ...hash_01e4a6d7(({
              type: "Vec3",
              x: t$9.z,
              y: t$9.w,
              z: 1
            } as t_b79db448)),
            type: "Vec4",
            w: 1
          } as t_b1f05ae8);
        } else {
          if (hash_0f32aa7b(hash_f9ef2af4.h6ca64060_1(p1, hash_f9ef2af4.h6ca64060_1(env.mouse, hash_6a0c8558.h44e31bac_0(env.resolution, 2)))) < 101) {
            return hash_25a5853b(0, 0, 0, 1);
          } else {
            let t$11: t_b1f05ae8 = texture(buffer, hash_2d0db3a8.h44e31bac_0(fragCoord, env.resolution));
            return ({ ...hash_01e4a6d7(({
                type: "Vec3",
                x: t$11.y,
                y: t$11.x,
                z: 1
              } as t_b79db448)),
              type: "Vec4",
              w: 1
            } as t_b1f05ae8);
          }
        }
      }
    }
  }
};

/**
```
const pendulum#ea978c8c = (
    env#:0: GLSLEnv#a25a17de,
    fragCoord#:1: Vec2#08f7c2ac,
    buffer#:2: sampler2D#builtin,
): Vec4#b1f05ae8 ={}> {
    if env#:0.time#a25a17de#0 <=#builtin 0.01 {
        const t#:3 = fragCoord#:1 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1;
        vec4#25a5853b(x: 0.0, y: 0.0, z: t#:3.x#08f7c2ac#0, w: t#:3.y#08f7c2ac#1);
    } else {
        const current#:4 = texture#builtin(
            buffer#:2,
            fragCoord#:1 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1,
        );
        const current#:5 = pixelToData#709719a8(v: current#:4);
        dataToPixel#46edfaef(
            v: update#47d59d3c(
                a1: current#:5.x#08f7c2ac#0,
                a2: current#:5.y#08f7c2ac#1,
                a1_v: current#:5.z#b79db448#0,
                a2_v: current#:5.w#b1f05ae8#0,
            ),
        );
    };
}
(env#:0: GLSLEnv#🏏, fragCoord#:1: Vec2#🍱🐶💣, buffer#:2: sampler2D): Vec4#🌎 => {
    if env#:0.#GLSLEnv#🏏#0 <= 0.01 {
        const t#:3: Vec2#🍱🐶💣 = MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(fragCoord#:1, env#:0.#GLSLEnv#🏏#1);
        return vec4#👸🧜‍♀️🏵️(0, 0, t#:3.#Vec2#🍱🐶💣#0, t#:3.#Vec2#🍱🐶💣#1);
    } else {
        const current#:5: Vec4#🌎 = pixelToData#🚴💏🏭😃(
            texture(buffer#:2, MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(fragCoord#:1, env#:0.#GLSLEnv#🏏#1)),
        );
        return dataToPixel#⛰️🕕😿😃(
            update#👳🧞‍♀️❣️😃(
                current#:5.#Vec2#🍱🐶💣#0,
                current#:5.#Vec2#🍱🐶💣#1,
                current#:5.#Vec3#😦#0,
                current#:5.#Vec4#🌎#0,
            ),
        );
    };
}
```
*/
export const hash_ea978c8c: (arg_0: t_a25a17de, arg_1: t_08f7c2ac, arg_2: sampler2D) => t_b1f05ae8 = (env: t_a25a17de, fragCoord: t_08f7c2ac, buffer: sampler2D) => {
  if (env.time <= 0.01) {
    let t$3: t_08f7c2ac = hash_2d0db3a8.h44e31bac_0(fragCoord, env.resolution);
    return hash_25a5853b(0, 0, t$3.x, t$3.y);
  } else {
    let current: t_b1f05ae8 = hash_709719a8(texture(buffer, hash_2d0db3a8.h44e31bac_0(fragCoord, env.resolution)));
    return hash_46edfaef(hash_47d59d3c(current.x, current.y, current.z, current.w));
  }
};
export const r1 = hash_0ce717e6;
export const r2 = hash_0ce717e6;
export const update = hash_47d59d3c;
export const pendulum = hash_ea978c8c;
export const main = hash_81b5cfe0;