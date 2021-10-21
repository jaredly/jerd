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
@ffi("Mat4") type Mat4#0d95d60e = {
    r1: Vec4#b1f05ae8,
    r2: Vec4#b1f05ae8,
    r3: Vec4#b1f05ae8,
    r4: Vec4#b1f05ae8,
}
```
*/
type t_0d95d60e = {
  type: "Mat4";
  r1: t_b1f05ae8;
  r2: t_b1f05ae8;
  r3: t_b1f05ae8;
  r4: t_b1f05ae8;
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
@unique(3) type Neg#220c6cb6<A#:0, B#:1> = {
    "-": (A#:0) ={}> B#:1,
}
```
*/
type t_220c6cb6<A, B> = {
  type: "220c6cb6";
  h220c6cb6_0: (arg_0: T_0) => T_1;
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
const length#7b44054f = (v#:0: Vec3#b79db448): float#builtin ={}> sqrt#builtin(
    v#:0.x#08f7c2ac#0 *#builtin v#:0.x#08f7c2ac#0 
            +#builtin v#:0.y#08f7c2ac#1 *#builtin v#:0.y#08f7c2ac#1 
        +#builtin v#:0.z#b79db448#0 *#builtin v#:0.z#b79db448#0,
)
(v#:0: Vec3#😦): float => sqrt(
    v#:0.#Vec2#🍱🐶💣#0 * v#:0.#Vec2#🍱🐶💣#0 + v#:0.#Vec2#🍱🐶💣#1 * v#:0.#Vec2#🍱🐶💣#1 + v#:0.#Vec3#😦#0 * v#:0.#Vec3#😦#0,
)
```
*/
export const hash_7b44054f: (arg_0: t_b79db448) => number = (v: t_b79db448) => sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/**
```
const ScaleVec3Rev#6c199ef1 = Div#44e31bac<Vec3#b79db448, float#builtin, Vec3#b79db448>{
    "/"#44e31bac#0: (v#:0: Vec3#b79db448, scale#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1,
        z#b79db448#0: v#:0.z#b79db448#0 /#builtin scale#:1,
    },
}
Div#🌈👶😭😃{TODO SPREADs}{
    h44e31bac_0: (v#:0: Vec3#😦, scale#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: v#:0.#Vec3#😦#0 / scale#:1,
        x: v#:0.#Vec2#🍱🐶💣#0 / scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 / scale#:1,
    },
}
```
*/
export const hash_6c199ef1: t_44e31bac<t_b79db448, number, t_b79db448> = ({
  type: "44e31bac",
  h44e31bac_0: (v: t_b79db448, scale: number) => ({
    type: "Vec3",
    x: v.x / scale,
    y: v.y / scale,
    z: v.z / scale
  } as t_b79db448)
} as t_44e31bac<t_b79db448, number, t_b79db448>);

/**
```
const dot#a5d188a8 = (a#:0: Vec4#b1f05ae8, b#:1: Vec4#b1f05ae8): float#builtin ={}> {
    a#:0.x#08f7c2ac#0 *#builtin b#:1.x#08f7c2ac#0 
                +#builtin a#:0.y#08f7c2ac#1 *#builtin b#:1.y#08f7c2ac#1 
            +#builtin a#:0.z#b79db448#0 *#builtin b#:1.z#b79db448#0 
        +#builtin a#:0.w#b1f05ae8#0 *#builtin b#:1.w#b1f05ae8#0;
}
(a#:0: Vec4#🌎, b#:1: Vec4#🌎): float => a#:0.#Vec2#🍱🐶💣#0 * b#:1.#Vec2#🍱🐶💣#0 + a#:0.#Vec2#🍱🐶💣#1 * b#:1.#Vec2#🍱🐶💣#1 + a#:0.#Vec3#😦#0 * b#:1.#Vec3#😦#0 + a#:0.#Vec4#🌎#0 * b#:1.#Vec4#🌎#0
```
*/
export const hash_a5d188a8: (arg_0: t_b1f05ae8, arg_1: t_b1f05ae8) => number = (a: t_b1f05ae8, b: t_b1f05ae8) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

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
const NegVec3#4193998e = Neg#220c6cb6<Vec3#b79db448, Vec3#b79db448>{
    "-"#220c6cb6#0: (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: -v#:0.x#08f7c2ac#0,
        y#08f7c2ac#1: -v#:0.y#08f7c2ac#1,
        z#b79db448#0: -v#:0.z#b79db448#0,
    },
}
Neg#🤳🌅🐻‍❄️{TODO SPREADs}{
    h220c6cb6_0: (v#:0: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: -v#:0.#Vec3#😦#0,
        x: -v#:0.#Vec2#🍱🐶💣#0,
        y: -v#:0.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_4193998e: t_220c6cb6<t_b79db448, t_b79db448> = ({
  type: "220c6cb6",
  h220c6cb6_0: (v: t_b79db448) => ({
    type: "Vec3",
    x: -v.x,
    y: -v.y,
    z: -v.z
  } as t_b79db448)
} as t_220c6cb6<t_b79db448, t_b79db448>);

/**
```
const cross#6268778c = (one#:0: Vec3#b79db448, two#:1: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
    x#08f7c2ac#0: one#:0.y#08f7c2ac#1 *#builtin two#:1.z#b79db448#0 
        -#builtin two#:1.y#08f7c2ac#1 *#builtin one#:0.z#b79db448#0,
    y#08f7c2ac#1: one#:0.z#b79db448#0 *#builtin two#:1.x#08f7c2ac#0 
        -#builtin two#:1.z#b79db448#0 *#builtin one#:0.x#08f7c2ac#0,
    z#b79db448#0: one#:0.x#08f7c2ac#0 *#builtin two#:1.y#08f7c2ac#1 
        -#builtin two#:1.x#08f7c2ac#0 *#builtin one#:0.y#08f7c2ac#1,
}
(one#:0: Vec3#😦, two#:1: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: one#:0.#Vec2#🍱🐶💣#0 * two#:1.#Vec2#🍱🐶💣#1 - two#:1.#Vec2#🍱🐶💣#0 * one#:0.#Vec2#🍱🐶💣#1,
    x: one#:0.#Vec2#🍱🐶💣#1 * two#:1.#Vec3#😦#0 - two#:1.#Vec2#🍱🐶💣#1 * one#:0.#Vec3#😦#0,
    y: one#:0.#Vec3#😦#0 * two#:1.#Vec2#🍱🐶💣#0 - two#:1.#Vec3#😦#0 * one#:0.#Vec2#🍱🐶💣#0,
}
```
*/
export const hash_6268778c: (arg_0: t_b79db448, arg_1: t_b79db448) => t_b79db448 = (one: t_b79db448, two: t_b79db448) => ({
  type: "Vec3",
  x: one.y * two.z - two.y * one.z,
  y: one.z * two.x - two.z * one.x,
  z: one.x * two.y - two.x * one.y
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
const normalize#b5ee376c = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> v#:0 
    /#6c199ef1#44e31bac#0 length#7b44054f(v#:0)
(v#:0: Vec3#😦): Vec3#😦 => ScaleVec3Rev#🗻🌿🦪😃.#Div#🌈👶😭😃#0(v#:0, length#🧑‍🎄🧑‍🎓⛄😃(v#:0))
```
*/
export const hash_b5ee376c: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => hash_6c199ef1.h44e31bac_0(v, hash_7b44054f(v));

/**
```
const vec3#1a676ed2 = (v#:0: Vec2#08f7c2ac, z#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
    ...v#:0,
    z#b79db448#0: z#:1,
}
(v#:0: Vec2#🍱🐶💣, z#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{z: z#:1, x: _#:0, y: _#:0}
```
*/
export const hash_1a676ed2: (arg_0: t_08f7c2ac, arg_1: number) => t_b79db448 = (v: t_08f7c2ac, z$1: number) => ({ ...v,
  type: "Vec3",
  z: z$1
} as t_b79db448);

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
  h44e31bac_0: (v: t_08f7c2ac, scale: number) => ({
    type: "Vec2",
    x: v.x / scale,
    y: v.y / scale
  } as t_08f7c2ac)
} as t_44e31bac<t_08f7c2ac, number, t_08f7c2ac>);

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
const EPSILON#17261aaa = 0.0001
0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const vec3#699ede5c = (x#:0: float#builtin, y#:1: float#builtin, z#:2: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
    z#b79db448#0: z#:2,
}
(x#:0: float, y#:1: float, z#:2: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{z: z#:2, x: x#:0, y: y#:1}
```
*/
export const hash_699ede5c: (arg_0: number, arg_1: number, arg_2: number) => t_b79db448 = (x: number, y: number, z: number) => ({
  type: "Vec3",
  x: x,
  y: y,
  z: z
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
  h63513dcd_0: (scale$0: number, v$1: t_b79db448) => ({
    type: "Vec3",
    x: v$1.x * scale$0,
    y: v$1.y * scale$0,
    z: v$1.z * scale$0
  } as t_b79db448)
} as t_63513dcd<number, t_b79db448, t_b79db448>);

/**
```
const MatByVector#3f839afc = Mul#63513dcd<Mat4#0d95d60e, Vec4#b1f05ae8, Vec4#b1f05ae8>{
    "*"#63513dcd#0: (mat#:0: Mat4#0d95d60e, vec#:1: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: dot#a5d188a8(a: mat#:0.r3#0d95d60e#2, b: vec#:1),
        x#08f7c2ac#0: dot#a5d188a8(a: mat#:0.r1#0d95d60e#0, b: vec#:1),
        y#08f7c2ac#1: dot#a5d188a8(a: mat#:0.r2#0d95d60e#1, b: vec#:1),
        w#b1f05ae8#0: dot#a5d188a8(a: mat#:0.r4#0d95d60e#3, b: vec#:1),
    },
}
Mul#👩‍❤️‍👩😱🦉😃{TODO SPREADs}{
    h63513dcd_0: (mat#:0: Mat4#🐐🧍‍♂️👩‍🦲, vec#:1: Vec4#🌎): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: dot#👍(mat#:0.#Mat4#🐐🧍‍♂️👩‍🦲#3, vec#:1),
        z: dot#👍(mat#:0.#Mat4#🐐🧍‍♂️👩‍🦲#2, vec#:1),
    },
}
```
*/
export const hash_3f839afc: t_63513dcd<t_0d95d60e, t_b1f05ae8, t_b1f05ae8> = ({
  type: "63513dcd",
  h63513dcd_0: (mat: t_0d95d60e, vec: t_b1f05ae8) => ({
    type: "Vec4",
    z: hash_a5d188a8(mat.r3, vec),
    x: hash_a5d188a8(mat.r1, vec),
    y: hash_a5d188a8(mat.r2, vec),
    w: hash_a5d188a8(mat.r4, vec)
  } as t_b1f05ae8)
} as t_63513dcd<t_0d95d60e, t_b1f05ae8, t_b1f05ae8>);

/**
```
const xyz#3c7df3a0 = (v#:0: Vec4#b1f05ae8): Vec3#b79db448 ={}> Vec3#b79db448{
    x#08f7c2ac#0: v#:0.x#08f7c2ac#0,
    y#08f7c2ac#1: v#:0.y#08f7c2ac#1,
    z#b79db448#0: v#:0.z#b79db448#0,
}
(v#:0: Vec4#🌎): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: v#:0.#Vec3#😦#0,
    x: v#:0.#Vec2#🍱🐶💣#0,
    y: v#:0.#Vec2#🍱🐶💣#1,
}
```
*/
export const hash_3c7df3a0: (arg_0: t_b1f05ae8) => t_b79db448 = (v: t_b1f05ae8) => ({
  type: "Vec3",
  x: v.x,
  y: v.y,
  z: v.z
} as t_b79db448);

/**
```
const viewMatrix#176ee0a0 = (eye#:0: Vec3#b79db448, center#:1: Vec3#b79db448, up#:2: Vec3#b79db448): Mat4#0d95d60e ={}> {
    const f#:3 = normalize#b5ee376c(v: center#:1 -#44c647be#6ca64060#1 eye#:0);
    const s#:4 = normalize#b5ee376c(v: cross#6268778c(one: f#:3, two: up#:2));
    const u#:5 = cross#6268778c(one: s#:4, two: f#:3);
    Mat4#0d95d60e{
        r1#0d95d60e#0: Vec4#b1f05ae8{...s#:4, w#b1f05ae8#0: 0.0},
        r2#0d95d60e#1: Vec4#b1f05ae8{...u#:5, w#b1f05ae8#0: 0.0},
        r3#0d95d60e#2: Vec4#b1f05ae8{...NegVec3#4193998e."-"#220c6cb6#0(f#:3), w#b1f05ae8#0: 0.0},
        r4#0d95d60e#3: vec4#25a5853b(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(eye#:0: Vec3#😦, center#:1: Vec3#😦, up#:2: Vec3#😦): Mat4#🐐🧍‍♂️👩‍🦲 => {
    const f#:3: Vec3#😦 = normalize#⏳(
        AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#1(center#:1, eye#:0),
    );
    const s#:4: Vec3#😦 = normalize#⏳(cross#🌓🦔🦘😃(f#:3, up#:2));
    return Mat4#🐐🧍‍♂️👩‍🦲{TODO SPREADs}{
        r1: Vec4#🌎{TODO SPREADs}{w: 0, z: _#:0},
        r2: Vec4#🌎{TODO SPREADs}{w: 0, z: _#:0},
        r3: Vec4#🌎{TODO SPREADs}{w: 0, z: _#:0},
        r4: vec4#👸🧜‍♀️🏵️(0, 0, 0, 1),
    };
}
```
*/
export const hash_176ee0a0: (arg_0: t_b79db448, arg_1: t_b79db448, arg_2: t_b79db448) => t_0d95d60e = (eye: t_b79db448, center: t_b79db448, up: t_b79db448) => {
  let f: t_b79db448 = hash_b5ee376c(hash_44c647be.h6ca64060_1(center, eye));
  let s: t_b79db448 = hash_b5ee376c(hash_6268778c(f, up));
  return ({
    type: "Mat4",
    r1: ({ ...s,
      type: "Vec4",
      w: 0
    } as t_b1f05ae8),
    r2: ({ ...hash_6268778c(s, f),
      type: "Vec4",
      w: 0
    } as t_b1f05ae8),
    r3: ({ ...hash_4193998e.h220c6cb6_0(f),
      type: "Vec4",
      w: 0
    } as t_b1f05ae8),
    r4: hash_25a5853b(0, 0, 0, 1)
  } as t_0d95d60e);
};

/**
```
const rayDirection#43540b9c = (
    fieldOfView#:0: float#builtin,
    size#:1: Vec2#08f7c2ac,
    fragCoord#:2: Vec2#08f7c2ac,
): Vec3#b79db448 ={}> {
    const xy#:3 = fragCoord#:2 -#f9ef2af4#6ca64060#1 size#:1 /#6a0c8558#44e31bac#0 2.0;
    const z#:4 = size#:1.y#08f7c2ac#1 
        /#builtin tan#builtin(radians#19bbb79c(degrees: fieldOfView#:0) /#builtin 2.0);
    normalize#b5ee376c(v: vec3#1a676ed2(v: xy#:3, z: -z#:4));
}
(fieldOfView#:0: float, size#:1: Vec2#🍱🐶💣, fragCoord#:2: Vec2#🍱🐶💣): Vec3#😦 => normalize#⏳(
    vec3#☕👩‍👩‍👧‍👦🏋️‍♂️(
        AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
            fragCoord#:2,
            ScaleVec2Rev#🧙‍♀️🎡🥙😃.#Div#🌈👶😭😃#0(size#:1, 2),
        ),
        -size#:1.#Vec2#🍱🐶💣#1 / tan(radians#🌟🧭🏄‍♀️(fieldOfView#:0) / 2),
    ),
)
```
*/
export const hash_43540b9c: (arg_0: number, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac) => t_b79db448 = (fieldOfView: number, size: t_08f7c2ac, fragCoord: t_08f7c2ac) => hash_b5ee376c(hash_1a676ed2(hash_f9ef2af4.h6ca64060_1(fragCoord, hash_6a0c8558.h44e31bac_0(size, 2)), -(size.y / tan(hash_19bbb79c(fieldOfView) / 2))));

/**
```
const vec4#3ffde0dc = (v#:0: Vec3#b79db448, w#:1: float#builtin): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
    ...v#:0,
    w#b1f05ae8#0: w#:1,
}
(v#:0: Vec3#😦, w#:1: float): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{w: w#:1, z: _#:0}
```
*/
export const hash_3ffde0dc: (arg_0: t_b79db448, arg_1: number) => t_b1f05ae8 = (v: t_b79db448, w$1: number) => ({ ...v,
  type: "Vec4",
  w: w$1
} as t_b1f05ae8);

/**
```
const rotate#d73bba9a = (tx#:0: float#builtin, ty#:1: float#builtin, tz#:2: float#builtin): Mat4#0d95d60e ={}> {
    const cg#:3 = cos#builtin(tx#:0);
    const sg#:4 = sin#builtin(tx#:0);
    const cb#:5 = cos#builtin(ty#:1);
    const sb#:6 = sin#builtin(ty#:1);
    const ca#:7 = cos#builtin(tz#:2);
    const sa#:8 = sin#builtin(tz#:2);
    Mat4#0d95d60e{
        r1#0d95d60e#0: vec4#25a5853b(
            x: ca#:7 *#builtin cb#:5,
            y: ca#:7 *#builtin sb#:6 *#builtin sg#:4 -#builtin sa#:8 *#builtin cg#:3,
            z: ca#:7 *#builtin sb#:6 *#builtin cg#:3 +#builtin sa#:8 *#builtin sg#:4,
            w: 0.0,
        ),
        r2#0d95d60e#1: vec4#25a5853b(
            x: sa#:8 *#builtin cb#:5,
            y: sa#:8 *#builtin sb#:6 *#builtin sg#:4 +#builtin ca#:7 *#builtin cg#:3,
            z: sa#:8 *#builtin sb#:6 *#builtin cg#:3 -#builtin ca#:7 *#builtin sg#:4,
            w: 0.0,
        ),
        r3#0d95d60e#2: vec4#25a5853b(
            x: -sb#:6,
            y: cb#:5 *#builtin sg#:4,
            z: cb#:5 *#builtin cg#:3,
            w: 0.0,
        ),
        r4#0d95d60e#3: vec4#25a5853b(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(tx#:0: float, ty#:1: float, tz#:2: float): Mat4#🐐🧍‍♂️👩‍🦲 => {
    const cg#:3: float = cos(tx#:0);
    const sg#:4: float = sin(tx#:0);
    const cb#:5: float = cos(ty#:1);
    const sb#:6: float = sin(ty#:1);
    const ca#:7: float = cos(tz#:2);
    const sa#:8: float = sin(tz#:2);
    return Mat4#🐐🧍‍♂️👩‍🦲{TODO SPREADs}{
        r1: vec4#👸🧜‍♀️🏵️(
            ca#:7 * cb#:5,
            ca#:7 * sb#:6 * sg#:4 - sa#:8 * cg#:3,
            ca#:7 * sb#:6 * cg#:3 + sa#:8 * sg#:4,
            0,
        ),
        r2: vec4#👸🧜‍♀️🏵️(
            sa#:8 * cb#:5,
            sa#:8 * sb#:6 * sg#:4 + ca#:7 * cg#:3,
            sa#:8 * sb#:6 * cg#:3 - ca#:7 * sg#:4,
            0,
        ),
        r3: vec4#👸🧜‍♀️🏵️(-sb#:6, cb#:5 * sg#:4, cb#:5 * cg#:3, 0),
        r4: vec4#👸🧜‍♀️🏵️(0, 0, 0, 1),
    };
}
```
*/
export const hash_d73bba9a: (arg_0: number, arg_1: number, arg_2: number) => t_0d95d60e = (tx: number, ty: number, tz: number) => {
  let cg: number = cos(tx);
  let sg: number = sin(tx);
  let cb: number = cos(ty);
  let sb: number = sin(ty);
  let ca: number = cos(tz);
  let sa: number = sin(tz);
  return ({
    type: "Mat4",
    r1: hash_25a5853b(ca * cb, ca * sb * sg - sa * cg, ca * sb * cg + sa * sg, 0),
    r2: hash_25a5853b(sa * cb, sa * sb * sg + ca * cg, sa * sb * cg - ca * sg, 0),
    r3: hash_25a5853b(-sb, cb * sg, cb * cg, 0),
    r4: hash_25a5853b(0, 0, 0, 1)
  } as t_0d95d60e);
};

/**
```
const estimateNormal#4f5afdb2 = (
    sceneSDF#:0: (GLSLEnv#a25a17de, Vec3#b79db448) ={}> float#builtin,
    env#:1: GLSLEnv#a25a17de,
    p#:2: Vec3#b79db448,
): Vec3#b79db448 ={}> normalize#b5ee376c(
    v: vec3#699ede5c(
        x: sceneSDF#:0(
                env#:1,
                Vec3#b79db448{...p#:2, x#08f7c2ac#0: p#:2.x#08f7c2ac#0 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#b79db448{...p#:2, x#08f7c2ac#0: p#:2.x#08f7c2ac#0 -#builtin EPSILON#17261aaa},
            ),
        y: sceneSDF#:0(
                env#:1,
                Vec3#b79db448{...p#:2, y#08f7c2ac#1: p#:2.y#08f7c2ac#1 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#b79db448{...p#:2, y#08f7c2ac#1: p#:2.y#08f7c2ac#1 -#builtin EPSILON#17261aaa},
            ),
        z: sceneSDF#:0(
                env#:1,
                Vec3#b79db448{...p#:2, z#b79db448#0: p#:2.z#b79db448#0 +#builtin EPSILON#17261aaa},
            ) 
            -#builtin sceneSDF#:0(
                env#:1,
                Vec3#b79db448{...p#:2, z#b79db448#0: p#:2.z#b79db448#0 -#builtin EPSILON#17261aaa},
            ),
    ),
)
(sceneSDF#:0: (GLSLEnv#🏏, Vec3#😦) => float, env#:1: GLSLEnv#🏏, p#:2: Vec3#😦): Vec3#😦 => normalize#⏳(
    vec3#🥀💧🍟😃(
        sceneSDF#:0(
            env#:1,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: p#:2.#Vec2#🍱🐶💣#0 + EPSILON#🧂💃🚶‍♂️, y: _#:0},
        ) - sceneSDF#:0(
            env#:1,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: p#:2.#Vec2#🍱🐶💣#0 - EPSILON#🧂💃🚶‍♂️, y: _#:0},
        ),
        sceneSDF#:0(
            env#:1,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: _#:0, y: p#:2.#Vec2#🍱🐶💣#1 + EPSILON#🧂💃🚶‍♂️},
        ) - sceneSDF#:0(
            env#:1,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: _#:0, y: p#:2.#Vec2#🍱🐶💣#1 - EPSILON#🧂💃🚶‍♂️},
        ),
        sceneSDF#:0(
            env#:1,
            Vec3#😦{TODO SPREADs}{z: p#:2.#Vec3#😦#0 + EPSILON#🧂💃🚶‍♂️, x: _#:0, y: _#:0},
        ) - sceneSDF#:0(
            env#:1,
            Vec3#😦{TODO SPREADs}{z: p#:2.#Vec3#😦#0 - EPSILON#🧂💃🚶‍♂️, x: _#:0, y: _#:0},
        ),
    ),
)
```
*/
export const hash_4f5afdb2: (arg_0: (arg_0: t_a25a17de, arg_1: t_b79db448) => number, arg_1: t_a25a17de, arg_2: t_b79db448) => t_b79db448 = (sceneSDF: (arg_0: t_a25a17de, arg_1: t_b79db448) => number, env: t_a25a17de, p: t_b79db448) => hash_b5ee376c(hash_699ede5c(sceneSDF(env, ({ ...p,
  type: "Vec3",
  x: p.x + hash_17261aaa
} as t_b79db448)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  x: p.x - hash_17261aaa
} as t_b79db448)), sceneSDF(env, ({ ...p,
  type: "Vec3",
  y: p.y + hash_17261aaa
} as t_b79db448)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  y: p.y - hash_17261aaa
} as t_b79db448)), sceneSDF(env, ({ ...p,
  type: "Vec3",
  z: p.z + hash_17261aaa
} as t_b79db448)) - sceneSDF(env, ({ ...p,
  type: "Vec3",
  z: p.z - hash_17261aaa
} as t_b79db448))));

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
  h63513dcd_0: (v: t_b79db448, scale: number) => ({
    type: "Vec3",
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale
  } as t_b79db448)
} as t_63513dcd<t_b79db448, number, t_b79db448>);

/**
```
const vec4#ba091e3e = (x#:0: float#builtin): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
    z#b79db448#0: x#:0,
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: x#:0,
    w#b1f05ae8#0: x#:0,
}
(x#:0: float): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{w: x#:0, z: x#:0}
```
*/
export const hash_ba091e3e: (arg_0: number) => t_b1f05ae8 = (x: number) => ({
  type: "Vec4",
  z: x,
  x: x,
  y: x,
  w: x
} as t_b1f05ae8);

/**
```
const rec shortestDistanceToSurface#37d4ca74 = (
    sceneSDF#:0: (GLSLEnv#a25a17de, Vec3#b79db448) ={}> float#builtin,
    env#:1: GLSLEnv#a25a17de,
    eye#:2: Vec3#b79db448,
    marchingDirection#:3: Vec3#b79db448,
    start#:4: float#builtin,
    end#:5: float#builtin,
    stepsLeft#:6: int#builtin,
): float#builtin ={}> {
    const dist#:7 = sceneSDF#:0(
        env#:1,
        eye#:2 +#44c647be#6ca64060#0 start#:4 *#9ac70f34#63513dcd#0 marchingDirection#:3,
    );
    if dist#:7 <#builtin EPSILON#17261aaa {
        start#:4;
    } else {
        const depth#:8 = start#:4 +#builtin dist#:7;
        if depth#:8 >=#builtin end#:5 ||#builtin stepsLeft#:6 <=#builtin 0 {
            end#:5;
        } else {
            37d4ca74#self(
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
    sceneSDF#:0: (GLSLEnv#🏏, Vec3#😦) => float,
    env#:1: GLSLEnv#🏏,
    eye#:2: Vec3#😦,
    marchingDirection#:3: Vec3#😦,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
): float => {
    loop(unbounded) {
        const dist#:7: float = sceneSDF#:0(
            env#:1,
            AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#0(
                eye#:2,
                ScaleVec3#🚐.#Mul#👩‍❤️‍👩😱🦉😃#0(start#:4, marchingDirection#:3),
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
export const hash_37d4ca74: (arg_0: (arg_0: t_a25a17de, arg_1: t_b79db448) => number, arg_1: t_a25a17de, arg_2: t_b79db448, arg_3: t_b79db448, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF: (arg_0: t_a25a17de, arg_1: t_b79db448) => number, env: t_a25a17de, eye$2: t_b79db448, marchingDirection: t_b79db448, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = sceneSDF(env, hash_44c647be.h6ca64060_0(eye$2, hash_9ac70f34.h63513dcd_0(start, marchingDirection)));

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
const getWorldDir#680f81da = (
    resolution#:0: Vec2#08f7c2ac,
    coord#:1: Vec2#08f7c2ac,
    eye#:2: Vec3#b79db448,
    fieldOfView#:3: float#builtin,
): Vec3#b79db448 ={}> {
    const viewDir#:4 = rayDirection#43540b9c(
        fieldOfView#:3,
        size: resolution#:0,
        fragCoord: coord#:1,
    );
    const eye#:5 = Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 5.0};
    const viewToWorld#:6 = viewMatrix#176ee0a0(
        eye#:5,
        center: Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 0.0},
        up: Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 0.0},
    );
    xyz#3c7df3a0(
        v: viewToWorld#:6 *#3f839afc#63513dcd#0 Vec4#b1f05ae8{...viewDir#:4, w#b1f05ae8#0: 0.0},
    );
}
(resolution#:0: Vec2#🍱🐶💣, coord#:1: Vec2#🍱🐶💣, eye#:2: Vec3#😦, fieldOfView#:3: float): Vec3#😦 => xyz#⛅🕔🎑(
    MatByVector#🏚️🙅🎲.#Mul#👩‍❤️‍👩😱🦉😃#0(
        viewMatrix#🤘🌊🧍‍♀️(
            Vec3#😦{TODO SPREADs}{z: 5, x: 0, y: 0},
            Vec3#😦{TODO SPREADs}{z: 0, x: 0, y: 0},
            Vec3#😦{TODO SPREADs}{z: 0, x: 0, y: 1},
        ),
        Vec4#🌎{TODO SPREADs}{w: 0, z: _#:0},
    ),
)
```
*/
export const hash_680f81da: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: t_b79db448, arg_3: number) => t_b79db448 = (resolution: t_08f7c2ac, coord: t_08f7c2ac, eye$2: t_b79db448, fieldOfView$3: number) => hash_3c7df3a0(hash_3f839afc.h63513dcd_0(hash_176ee0a0(({
  type: "Vec3",
  x: 0,
  y: 0,
  z: 5
} as t_b79db448), ({
  type: "Vec3",
  x: 0,
  y: 0,
  z: 0
} as t_b79db448), ({
  type: "Vec3",
  x: 0,
  y: 1,
  z: 0
} as t_b79db448)), ({ ...hash_43540b9c(fieldOfView$3, resolution, coord),
  type: "Vec4",
  w: 0
} as t_b1f05ae8)));

/**
```
const Scale4#9a59ed7c = Div#44e31bac<Vec4#b1f05ae8, float#builtin, Vec4#b1f05ae8>{
    "/"#44e31bac#0: (v#:0: Vec4#b1f05ae8, scale#:1: float#builtin): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: v#:0.z#b79db448#0 /#builtin scale#:1,
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1,
        w#b1f05ae8#0: v#:0.w#b1f05ae8#0 /#builtin scale#:1,
    },
}
Div#🌈👶😭😃{TODO SPREADs}{
    h44e31bac_0: (v#:0: Vec4#🌎, scale#:1: float): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: v#:0.#Vec4#🌎#0 / scale#:1,
        z: v#:0.#Vec3#😦#0 / scale#:1,
    },
}
```
*/
export const hash_9a59ed7c: t_44e31bac<t_b1f05ae8, number, t_b1f05ae8> = ({
  type: "44e31bac",
  h44e31bac_0: (v: t_b1f05ae8, scale: number) => ({
    type: "Vec4",
    z: v.z / scale,
    x: v.x / scale,
    y: v.y / scale,
    w: v.w / scale
  } as t_b1f05ae8)
} as t_44e31bac<t_b1f05ae8, number, t_b1f05ae8>);

/**
```
const vec2#5531df03 = (x#:0: float#builtin, y#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
}
(x#:0: float, y#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{x: x#:0, y: y#:1}
```
*/
export const hash_5531df03: (arg_0: number, arg_1: number) => t_08f7c2ac = (x: number, y: number) => ({
  type: "Vec2",
  x: x,
  y: y
} as t_08f7c2ac);

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
const rotate#07c521b4 = (
    v#:0: Vec3#b79db448,
    x#:1: float#builtin,
    y#:2: float#builtin,
    z#:3: float#builtin,
): Vec3#b79db448 ={}> {
    xyz#3c7df3a0(
        v: rotate#d73bba9a(tx: x#:1, ty: y#:2, tz: z#:3) 
            *#3f839afc#63513dcd#0 vec4#3ffde0dc(v#:0, w: 1.0),
    );
}
(v#:0: Vec3#😦, x#:1: float, y#:2: float, z#:3: float): Vec3#😦 => xyz#⛅🕔🎑(
    MatByVector#🏚️🙅🎲.#Mul#👩‍❤️‍👩😱🦉😃#0(rotate#🍕(x#:1, y#:2, z#:3), vec4#👱‍♂️🕒♟️(v#:0, 1)),
)
```
*/
export const hash_07c521b4: (arg_0: t_b79db448, arg_1: number, arg_2: number, arg_3: number) => t_b79db448 = (v: t_b79db448, x$1: number, y$2: number, z$3: number) => hash_3c7df3a0(hash_3f839afc.h63513dcd_0(hash_d73bba9a(x$1, y$2, z$3), hash_3ffde0dc(v, 1)));

/**
```
const marchNormals#50e5cbd8 = (sceneSDF#:0: (GLSLEnv#a25a17de, Vec3#b79db448) ={}> float#builtin): (
    env: GLSLEnv#a25a17de,
    coord: Vec2#08f7c2ac,
) ={}> Vec4#b1f05ae8 ={}> (env#:1: GLSLEnv#a25a17de, coord#:2: Vec2#08f7c2ac): Vec4#b1f05ae8 ={}> {
    const eye#:3 = Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 5.0};
    const worldDir#:4 = getWorldDir#680f81da(
        resolution: env#:1.resolution#a25a17de#1,
        coord#:2,
        eye#:3,
        fieldOfView: 45.0,
    );
    const maxDist#:5 = 100.0;
    const dist#:6 = shortestDistanceToSurface#37d4ca74(
        sceneSDF#:0,
        env#:1,
        eye#:3,
        marchingDirection: worldDir#:4,
        start: 0.0,
        end: maxDist#:5,
        stepsLeft: 255,
    );
    if dist#:6 >#builtin maxDist#:5 -#builtin EPSILON#17261aaa {
        vec4#ba091e3e(x: 0.0);
    } else {
        const worldPos#:7 = eye#:3 +#44c647be#6ca64060#0 worldDir#:4 *#f2b2c8e8#63513dcd#0 dist#:6;
        const normal#:8 = estimateNormal#4f5afdb2(sceneSDF#:0, env#:1, p: worldPos#:7);
        vec4#3ffde0dc(v: normal#:8, w: 1.0);
    };
}
(sceneSDF#:0: (GLSLEnv#🏏, Vec3#😦) => float): (GLSLEnv#🏏, Vec2#🍱🐶💣) => Vec4#🌎 => (
    env#:1: GLSLEnv#🏏,
    coord#:2: Vec2#🍱🐶💣,
): Vec4#🌎 => {
    const eye#:3: Vec3#😦 = Vec3#😦{TODO SPREADs}{z: 5, x: 0, y: 0};
    const worldDir#:4: Vec3#😦 = getWorldDir#👩‍👩‍👧🏒🥔😃(
        env#:1.#GLSLEnv#🏏#1,
        coord#:2,
        eye#:3,
        45,
    );
    const dist#:6: float = shortestDistanceToSurface#🥭🕵️‍♂️🕠(
        sceneSDF#:0,
        env#:1,
        eye#:3,
        worldDir#:4,
        0,
        100,
        255,
    );
    if dist#:6 > 100 - EPSILON#🧂💃🚶‍♂️ {
        return vec4#🐲(0);
    } else {
        return vec4#👱‍♂️🕒♟️(
            estimateNormal#🤼‍♂️🦐🙇😃(
                sceneSDF#:0,
                env#:1,
                AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#0(
                    eye#:3,
                    ScaleVec3_#🙅‍♀️.#Mul#👩‍❤️‍👩😱🦉😃#0(worldDir#:4, dist#:6),
                ),
            ),
            1,
        );
    };
}
```
*/
export const hash_50e5cbd8: (arg_0: (arg_0: t_a25a17de, arg_1: t_b79db448) => number) => (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8 = (sceneSDF: (arg_0: t_a25a17de, arg_1: t_b79db448) => number) => (env: t_a25a17de, coord$2: t_08f7c2ac) => {
  let eye$3: t_b79db448 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_b79db448);
  let worldDir: t_b79db448 = hash_680f81da(env.resolution, coord$2, eye$3, 45);
  let dist$6: number = hash_37d4ca74(sceneSDF, env, eye$3, worldDir, 0, 100, 255);

  if (dist$6 > 100 - hash_17261aaa) {
    return hash_ba091e3e(0);
  } else {
    return hash_3ffde0dc(hash_4f5afdb2(sceneSDF, env, hash_44c647be.h6ca64060_0(eye$3, hash_f2b2c8e8.h63513dcd_0(worldDir, dist$6))), 1);
  }
};

/**
```
const multiSample#6d327950 = (fn#:0: (GLSLEnv#a25a17de, Vec2#08f7c2ac) ={}> Vec4#b1f05ae8): (
    env: GLSLEnv#a25a17de,
    pos: Vec2#08f7c2ac,
) ={}> Vec4#b1f05ae8 ={}> (env#:1: GLSLEnv#a25a17de, pos#:2: Vec2#08f7c2ac): Vec4#b1f05ae8 ={}> {
    const total#:3 = fn#:0(env#:1, pos#:2) 
                    +#6704233e#6ca64060#0 fn#:0(
                        env#:1,
                        pos#:2 +#f9ef2af4#6ca64060#0 vec2#5531df03(x: 0.5, y: 0.0),
                    ) 
                +#6704233e#6ca64060#0 fn#:0(
                    env#:1,
                    pos#:2 +#f9ef2af4#6ca64060#0 vec2#5531df03(x: -0.5, y: 0.0),
                ) 
            +#6704233e#6ca64060#0 fn#:0(
                env#:1,
                pos#:2 +#f9ef2af4#6ca64060#0 vec2#5531df03(x: 0.0, y: 0.5),
            ) 
        +#6704233e#6ca64060#0 fn#:0(
            env#:1,
            pos#:2 +#f9ef2af4#6ca64060#0 vec2#5531df03(x: 0.0, y: -0.5),
        );
    total#:3 /#9a59ed7c#44e31bac#0 5.0;
}
(fn#:0: (GLSLEnv#🏏, Vec2#🍱🐶💣) => Vec4#🌎): (GLSLEnv#🏏, Vec2#🍱🐶💣) => Vec4#🌎 => (
    env#:1: GLSLEnv#🏏,
    pos#:2: Vec2#🍱🐶💣,
): Vec4#🌎 => Scale4#👩‍🦯.#Div#🌈👶😭😃#0(
    AddSubVec4#🚚👨‍⚖️🍊😃.#AddSub#🤡🧗‍♂️🥧😃#0(
        AddSubVec4#🚚👨‍⚖️🍊😃.#AddSub#🤡🧗‍♂️🥧😃#0(
            AddSubVec4#🚚👨‍⚖️🍊😃.#AddSub#🤡🧗‍♂️🥧😃#0(
                AddSubVec4#🚚👨‍⚖️🍊😃.#AddSub#🤡🧗‍♂️🥧😃#0(
                    fn#:0(env#:1, pos#:2),
                    fn#:0(
                        env#:1,
                        AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#0(pos#:2, vec2#🏦💖🦹😃(0.5, 0)),
                    ),
                ),
                fn#:0(env#:1, AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#0(pos#:2, vec2#🏦💖🦹😃(-0.5, 0))),
            ),
            fn#:0(env#:1, AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#0(pos#:2, vec2#🏦💖🦹😃(0, 0.5))),
        ),
        fn#:0(env#:1, AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#0(pos#:2, vec2#🏦💖🦹😃(0, -0.5))),
    ),
    5,
)
```
*/
export const hash_6d327950: (arg_0: (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8) => (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8 = (fn: (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8) => (env: t_a25a17de, pos: t_08f7c2ac) => hash_9a59ed7c.h44e31bac_0(hash_6704233e.h6ca64060_0(hash_6704233e.h6ca64060_0(hash_6704233e.h6ca64060_0(hash_6704233e.h6ca64060_0(fn(env, pos), fn(env, hash_f9ef2af4.h6ca64060_0(pos, hash_5531df03(0.5, 0)))), fn(env, hash_f9ef2af4.h6ca64060_0(pos, hash_5531df03(-0.5, 0)))), fn(env, hash_f9ef2af4.h6ca64060_0(pos, hash_5531df03(0, 0.5)))), fn(env, hash_f9ef2af4.h6ca64060_0(pos, hash_5531df03(0, -0.5)))), 5);

/**
```
const ok#01b88ff6 = multiSample#6d327950(
    fn: marchNormals#50e5cbd8(
        sceneSDF: (env#:0: GLSLEnv#a25a17de, pos#:1: Vec3#b79db448): float#builtin ={}> {
            const pos#:2 = rotate#07c521b4(
                v: pos#:1,
                x: 0.0,
                y: env#:0.time#a25a17de#0 /#builtin 2.0,
                z: env#:0.time#a25a17de#0,
            );
            const mag#:3 = (sin#builtin(env#:0.time#a25a17de#0 /#builtin 2.0) +#builtin 1.0) 
                    *#builtin 60.0 
                +#builtin 1.0;
            const period#:4 = 30.0 *#builtin (sin#builtin(env#:0.time#a25a17de#0) +#builtin 1.0);
            const sphere#:5 = length#7b44054f(v: pos#:2) -#builtin 0.5;
            const bumps#:6 = sin#builtin(pos#:2.x#08f7c2ac#0 *#builtin period#:4) 
                    +#builtin sin#builtin(pos#:2.z#b79db448#0 *#builtin period#:4) 
                +#builtin sin#builtin(pos#:2.y#08f7c2ac#1 *#builtin period#:4);
            sphere#:5 -#builtin bumps#:6 /#builtin mag#:3;
        },
    ),
)
multiSample#🦸🤞🍵😃(
    marchNormals#🏐🚶‍♂️👨‍🍳😃(
        (env#:0: GLSLEnv#🏏, pos#:1: Vec3#😦): float => {
            const pos#:2: Vec3#😦 = rotate#🤽🤱💟(
                pos#:1,
                0,
                env#:0.#GLSLEnv#🏏#0 / 2,
                env#:0.#GLSLEnv#🏏#0,
            );
            const period#:4: float = 30 * sin(env#:0.#GLSLEnv#🏏#0) + 1;
            return length#🧑‍🎄🧑‍🎓⛄😃(pos#:2) - 0.5 - (sin(pos#:2.#Vec2#🍱🐶💣#0 * period#:4) + sin(
                pos#:2.#Vec3#😦#0 * period#:4,
            ) + sin(pos#:2.#Vec2#🍱🐶💣#1 * period#:4)) / ((sin(env#:0.#GLSLEnv#🏏#0 / 2) + 1) * (60) + 1);
        },
    ),
)
```
*/
export const hash_01b88ff6: (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8 = hash_6d327950(hash_50e5cbd8((env$0: t_a25a17de, pos$1: t_b79db448) => {
  let pos: t_b79db448 = hash_07c521b4(pos$1, 0, env$0.time / 2, env$0.time);
  let period: number = 30 * (sin(env$0.time) + 1);
  return hash_7b44054f(pos) - 0.5 - (sin(pos.x * period) + sin(pos.z * period) + sin(pos.y * period)) / ((sin(env$0.time / 2) + 1) * 60 + 1);
}));
export const ok = hash_01b88ff6;