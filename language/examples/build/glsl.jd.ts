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
const round#cec77de2 = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
    x#08f7c2ac#0: round#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: round#builtin(v#:0.y#08f7c2ac#1),
    z#b79db448#0: round#builtin(v#:0.z#b79db448#0),
}
(v#:0: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: round(v#:0.#Vec3#😦#0),
    x: round(v#:0.#Vec2#🍱🐶💣#0),
    y: round(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_cec77de2: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => ({
  type: "Vec3",
  x: round(v.x),
  y: round(v.y),
  z: round(v.z)
} as t_b79db448);

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
const opRepLim#43bef4b0 = (p#:0: Vec3#b79db448, c#:1: float#builtin, l#:2: Vec3#b79db448): Vec3#b79db448 ={}> {
    p#:0 
        -#44c647be#6ca64060#1 c#:1 
            *#9ac70f34#63513dcd#0 clamp#c11492dc(
                v: round#cec77de2(v: p#:0 /#6c199ef1#44e31bac#0 c#:1),
                min: NegVec3#4193998e."-"#220c6cb6#0(l#:2),
                max: l#:2,
            );
}
(p#:0: Vec3#😦, c#:1: float, l#:2: Vec3#😦): Vec3#😦 => AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#1(
    p#:0,
    ScaleVec3#🚐.#Mul#👩‍❤️‍👩😱🦉😃#0(
        c#:1,
        clamp#🥃(
            round#👨‍👧‍👧(ScaleVec3Rev#🗻🌿🦪😃.#Div#🌈👶😭😃#0(p#:0, c#:1)),
            NegVec3#🧖‍♀️🙅🤪😃.#Neg#🤳🌅🐻‍❄️#0(l#:2),
            l#:2,
        ),
    ),
)
```
*/
export const hash_43bef4b0: (arg_0: t_b79db448, arg_1: number, arg_2: t_b79db448) => t_b79db448 = (p: t_b79db448, c: number, l: t_b79db448) => hash_44c647be.h6ca64060_1(p, hash_9ac70f34.h63513dcd_0(c, hash_c11492dc(hash_cec77de2(hash_6c199ef1.h44e31bac_0(p, c)), hash_4193998e.h220c6cb6_0(l), l)));

/**
```
const EPSILON#ec7f8d1c = 0.00005
0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

/**
```
const sceneSDF#ef6c280a = (iTime#:0: float#builtin, samplePoint#:1: Vec3#b79db448): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p2#:3 = samplePoint#:1 
        -#44c647be#6ca64060#1 Vec3#b79db448{
            x#08f7c2ac#0: -sin#builtin(double#:2) /#builtin 2.0,
            y#08f7c2ac#1: sin#builtin(iTime#:0 /#builtin 4.0) /#builtin 2.0,
            z#b79db448#0: cos#builtin(double#:2) /#builtin 2.0,
        };
    const p1#:4 = samplePoint#:1;
    const p2#:5 = opRepLim#43bef4b0(
        p: p2#:3,
        c: 0.1,
        l: Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 1.0},
    );
    sminCubic#5069ed00(
        a: length#7b44054f(v: p1#:4) -#builtin 0.5,
        b: length#7b44054f(v: p2#:5) -#builtin 0.03,
        k: 0.1,
    );
}
(iTime#:0: float, samplePoint#:1: Vec3#😦): float => {
    const double#:2: float = iTime#:0 * 2;
    return sminCubic#👩‍⚕️🥝👩‍🏫😃(
        length#🧑‍🎄🧑‍🎓⛄😃(samplePoint#:1) - 0.5,
        length#🧑‍🎄🧑‍🎓⛄😃(
            opRepLim#👐🧨🥳😃(
                AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#1(
                    samplePoint#:1,
                    Vec3#😦{TODO SPREADs}{
                        z: cos(double#:2) / 2,
                        x: -sin(double#:2) / 2,
                        y: sin(iTime#:0 / 4) / 2,
                    },
                ),
                0.1,
                Vec3#😦{TODO SPREADs}{z: 1, x: 1, y: 1},
            ),
        ) - 0.03,
        0.1,
    );
}
```
*/
export const hash_ef6c280a: (arg_0: number, arg_1: t_b79db448) => number = (iTime: number, samplePoint: t_b79db448) => {
  let double: number = iTime * 2;
  return hash_5069ed00(hash_7b44054f(samplePoint) - 0.5, hash_7b44054f(hash_43bef4b0(hash_44c647be.h6ca64060_1(samplePoint, ({
    type: "Vec3",
    x: -sin(double) / 2,
    y: sin(iTime / 4) / 2,
    z: cos(double) / 2
  } as t_b79db448)), 0.1, ({
    type: "Vec3",
    x: 1,
    y: 1,
    z: 1
  } as t_b79db448))) - 0.03, 0.1);
};

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
const dot#00887a88 = (a#:0: Vec3#b79db448, b#:1: Vec3#b79db448): float#builtin ={}> {
    a#:0.x#08f7c2ac#0 *#builtin b#:1.x#08f7c2ac#0 
            +#builtin a#:0.y#08f7c2ac#1 *#builtin b#:1.y#08f7c2ac#1 
        +#builtin a#:0.z#b79db448#0 *#builtin b#:1.z#b79db448#0;
}
(a#:0: Vec3#😦, b#:1: Vec3#😦): float => a#:0.#Vec2#🍱🐶💣#0 * b#:1.#Vec2#🍱🐶💣#0 + a#:0.#Vec2#🍱🐶💣#1 * b#:1.#Vec2#🍱🐶💣#1 + a#:0.#Vec3#😦#0 * b#:1.#Vec3#😦#0
```
*/
export const hash_00887a88: (arg_0: t_b79db448, arg_1: t_b79db448) => number = (a: t_b79db448, b: t_b79db448) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
```
const estimateNormal#39ebd8b2 = (iTime#:0: float#builtin, p#:1: Vec3#b79db448): Vec3#b79db448 ={}> normalize#b5ee376c(
    v: Vec3#b79db448{
        x#08f7c2ac#0: sceneSDF#ef6c280a(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    x#08f7c2ac#0: p#:1.x#08f7c2ac#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#ef6c280a(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    x#08f7c2ac#0: p#:1.x#08f7c2ac#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        y#08f7c2ac#1: sceneSDF#ef6c280a(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    y#08f7c2ac#1: p#:1.y#08f7c2ac#1 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#ef6c280a(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    y#08f7c2ac#1: p#:1.y#08f7c2ac#1 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        z#b79db448#0: sceneSDF#ef6c280a(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    z#b79db448#0: p#:1.z#b79db448#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#ef6c280a(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    z#b79db448#0: p#:1.z#b79db448#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
    },
)
(iTime#:0: float, p#:1: Vec3#😦): Vec3#😦 => normalize#⏳(
    Vec3#😦{TODO SPREADs}{
        z: sceneSDF#😉(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: p#:1.#Vec3#😦#0 + EPSILON#🧑‍💻, x: _#:0, y: _#:0},
        ) - sceneSDF#😉(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: p#:1.#Vec3#😦#0 - EPSILON#🧑‍💻, x: _#:0, y: _#:0},
        ),
        x: sceneSDF#😉(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: p#:1.#Vec2#🍱🐶💣#0 + EPSILON#🧑‍💻, y: _#:0},
        ) - sceneSDF#😉(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: p#:1.#Vec2#🍱🐶💣#0 - EPSILON#🧑‍💻, y: _#:0},
        ),
        y: sceneSDF#😉(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: _#:0, y: p#:1.#Vec2#🍱🐶💣#1 + EPSILON#🧑‍💻},
        ) - sceneSDF#😉(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: _#:0, y: p#:1.#Vec2#🍱🐶💣#1 - EPSILON#🧑‍💻},
        ),
    },
)
```
*/
export const hash_39ebd8b2: (arg_0: number, arg_1: t_b79db448) => t_b79db448 = (iTime: number, p$1: t_b79db448) => hash_b5ee376c(({
  type: "Vec3",
  x: hash_ef6c280a(iTime, ({ ...p$1,
    type: "Vec3",
    x: p$1.x + hash_ec7f8d1c
  } as t_b79db448)) - hash_ef6c280a(iTime, ({ ...p$1,
    type: "Vec3",
    x: p$1.x - hash_ec7f8d1c
  } as t_b79db448)),
  y: hash_ef6c280a(iTime, ({ ...p$1,
    type: "Vec3",
    y: p$1.y + hash_ec7f8d1c
  } as t_b79db448)) - hash_ef6c280a(iTime, ({ ...p$1,
    type: "Vec3",
    y: p$1.y - hash_ec7f8d1c
  } as t_b79db448)),
  z: hash_ef6c280a(iTime, ({ ...p$1,
    type: "Vec3",
    z: p$1.z + hash_ec7f8d1c
  } as t_b79db448)) - hash_ef6c280a(iTime, ({ ...p$1,
    type: "Vec3",
    z: p$1.z - hash_ec7f8d1c
  } as t_b79db448))
} as t_b79db448));

/**
```
const vec3#1a676ed2 = (v#:0: Vec2#08f7c2ac, z#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
    ...v#:0,
    z#b79db448#0: z#:1,
}
(v#:0: Vec2#🍱🐶💣, z#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{z: z#:1, x: _#:0, y: _#:0}
```
*/
export const hash_1a676ed2: (arg_0: t_08f7c2ac, arg_1: number) => t_b79db448 = (v: t_08f7c2ac, z: number) => ({ ...v,
  type: "Vec3",
  z: z
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
const white#365fd554 = Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 1.0}
Vec3#😦{TODO SPREADs}{z: 1, x: 1, y: 1}
```
*/
export const hash_365fd554: t_b79db448 = ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
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
  h63513dcd_0: (v: t_b79db448, scale: number) => ({
    type: "Vec3",
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale
  } as t_b79db448)
} as t_63513dcd<t_b79db448, number, t_b79db448>);

/**
```
const isPointingTowardLight#825048a2 = (
    iTime#:0: float#builtin,
    p#:1: Vec3#b79db448,
    lightPos#:2: Vec3#b79db448,
): bool#builtin ={}> {
    const N#:3 = estimateNormal#39ebd8b2(iTime#:0, p#:1);
    const L#:4 = normalize#b5ee376c(v: lightPos#:2 -#44c647be#6ca64060#1 p#:1);
    const dotLN#:5 = dot#00887a88(a: L#:4, b: N#:3);
    dotLN#:5 >=#builtin 0.0;
}
(iTime#:0: float, p#:1: Vec3#😦, lightPos#:2: Vec3#😦): bool => dot#🧅🦇🙂(
    normalize#⏳(AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#1(lightPos#:2, p#:1)),
    estimateNormal#🤝🏞️🌌(iTime#:0, p#:1),
) >= 0
```
*/
export const hash_825048a2: (arg_0: number, arg_1: t_b79db448, arg_2: t_b79db448) => boolean = (iTime: number, p$1: t_b79db448, lightPos: t_b79db448) => hash_00887a88(hash_b5ee376c(hash_44c647be.h6ca64060_1(lightPos, p$1)), hash_39ebd8b2(iTime, p$1)) >= 0;

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
const rec shortestDistanceToSurface#73e3d992 = (
    iTime#:0: float#builtin,
    eye#:1: Vec3#b79db448,
    marchingDirection#:2: Vec3#b79db448,
    start#:3: float#builtin,
    end#:4: float#builtin,
    stepsLeft#:5: int#builtin,
): float#builtin ={}> {
    if stepsLeft#:5 <=#builtin 0 {
        end#:4;
    } else {
        const dist#:6 = sceneSDF#ef6c280a(
            iTime#:0,
            samplePoint: eye#:1 
                +#44c647be#6ca64060#0 start#:3 *#9ac70f34#63513dcd#0 marchingDirection#:2,
        );
        if dist#:6 <#builtin EPSILON#ec7f8d1c {
            start#:3;
        } else {
            const depth#:7 = start#:3 +#builtin dist#:6;
            if depth#:7 >=#builtin end#:4 {
                end#:4;
            } else {
                73e3d992#self(
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
    eye#:1: Vec3#😦,
    marchingDirection#:2: Vec3#😦,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
): float => {
    for (; stepsLeft#:5 > 0; stepsLeft#:5 = stepsLeft#:5 - 1) {
        const dist#:6: float = sceneSDF#😉(
            iTime#:0,
            AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#0(
                eye#:1,
                ScaleVec3#🚐.#Mul#👩‍❤️‍👩😱🦉😃#0(start#:3, marchingDirection#:2),
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
export const hash_73e3d992: (arg_0: number, arg_1: t_b79db448, arg_2: t_b79db448, arg_3: number, arg_4: number, arg_5: number) => number = (iTime: number, eye: t_b79db448, marchingDirection: t_b79db448, start: number, end: number, stepsLeft: number) => {
  for (; stepsLeft > 0; stepsLeft = stepsLeft - 1) {
    let dist: number = hash_ef6c280a(iTime, hash_44c647be.h6ca64060_0(eye, hash_9ac70f34.h63513dcd_0(start, marchingDirection)));

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
const MAX_MARCHING_STEPS#62404440 = 255
255
```
*/
export const hash_62404440: number = 255;

/**
```
const dot#02728df0 = (a#:0: Vec2#08f7c2ac, b#:1: Vec2#08f7c2ac): float#builtin ={}> {
    a#:0.x#08f7c2ac#0 *#builtin b#:1.x#08f7c2ac#0 
        +#builtin a#:0.y#08f7c2ac#1 *#builtin b#:1.y#08f7c2ac#1;
}
(a#:0: Vec2#🍱🐶💣, b#:1: Vec2#🍱🐶💣): float => a#:0.#Vec2#🍱🐶💣#0 * b#:1.#Vec2#🍱🐶💣#0 + a#:0.#Vec2#🍱🐶💣#1 * b#:1.#Vec2#🍱🐶💣#1
```
*/
export const hash_02728df0: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac) => number = (a: t_08f7c2ac, b: t_08f7c2ac) => a.x * b.x + a.y * b.y;

/**
```
const fract#14e72ade = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
(v#:0: float): float => v#:0 - floor(v#:0)
```
*/
export const hash_14e72ade: (arg_0: number) => number = (v: number) => v - floor(v);

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
const fishingBoueys#7854877f = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#08f7c2ac,
    iResolution#:2: Vec2#08f7c2ac,
): Vec4#b1f05ae8 ={}> {
    const dir#:3 = rayDirection#43540b9c(fieldOfView: 45.0, size: iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#73e3d992(
        iTime#:0,
        eye#:4,
        marchingDirection: dir#:3,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    const light#:6 = 0.2;
    if dist#:5 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c {
        Vec4#b1f05ae8{
            z#b79db448#0: 0.0,
            x#08f7c2ac#0: 0.0,
            y#08f7c2ac#1: 0.0,
            w#b1f05ae8#0: 1.0,
        };
    } else {
        const worldPosForPixel#:7 = eye#:4 
            +#44c647be#6ca64060#0 dist#:5 *#9ac70f34#63513dcd#0 dir#:3;
        const K_a#:8 = Vec3#b79db448{x#08f7c2ac#0: 0.9, y#08f7c2ac#1: 0.2, z#b79db448#0: 0.3};
        const K_d#:9 = Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.2, z#b79db448#0: 0.7};
        const K_s#:10 = Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 1.0};
        const shininess#:11 = 10.0;
        const light1Pos#:12 = Vec3#b79db448{
            x#08f7c2ac#0: 10.0 *#builtin sin#builtin(iTime#:0),
            y#08f7c2ac#1: 10.0 *#builtin cos#builtin(iTime#:0),
            z#b79db448#0: 5.0,
        };
        const toLight#:13 = light1Pos#:12 -#44c647be#6ca64060#1 worldPosForPixel#:7;
        if isPointingTowardLight#825048a2(iTime#:0, p: worldPosForPixel#:7, lightPos: light1Pos#:12) {
            const marchToLight#:14 = shortestDistanceToSurface#73e3d992(
                iTime#:0,
                eye: light1Pos#:12,
                marchingDirection: -1.0 *#9ac70f34#63513dcd#0 normalize#b5ee376c(v: toLight#:13),
                start: MIN_DIST#f2cd39b8,
                end: MAX_DIST#0ce717e6,
                stepsLeft: MAX_MARCHING_STEPS#62404440,
            );
            if marchToLight#:14 
                >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c *#builtin 10.0 {
                Vec4#b1f05ae8{...white#365fd554 *#f2b2c8e8#63513dcd#0 light#:6, w#b1f05ae8#0: 1.0};
            } else {
                const offset#:15 = marchToLight#:14 -#builtin length#7b44054f(v: toLight#:13);
                const penumbra#:16 = 0.1;
                if offset#:15 <#builtin -EPSILON#ec7f8d1c *#builtin 1000.0 {
                    Vec4#b1f05ae8{
                        ...white#365fd554 *#f2b2c8e8#63513dcd#0 light#:6,
                        w#b1f05ae8#0: 1.0,
                    };
                } else {
                    Vec4#b1f05ae8{...white#365fd554, w#b1f05ae8#0: 1.0};
                };
            };
        } else {
            Vec4#b1f05ae8{...white#365fd554 *#f2b2c8e8#63513dcd#0 light#:6, w#b1f05ae8#0: 1.0};
        };
    };
}
(iTime#:0: float, fragCoord#:1: Vec2#🍱🐶💣, iResolution#:2: Vec2#🍱🐶💣): Vec4#🌎 => {
    const dir#:3: Vec3#😦 = rayDirection#🌟👨‍🎓🥵😃(45, iResolution#:2, fragCoord#:1);
    const eye#:4: Vec3#😦 = Vec3#😦{TODO SPREADs}{z: 5, x: 0, y: 0};
    const dist#:5: float = shortestDistanceToSurface#🤺🙇‍♂️🚚😃(
        iTime#:0,
        eye#:4,
        dir#:3,
        MIN_DIST#🤾‍♂️,
        MAX_DIST#🥅👬👨‍🦰,
        MAX_MARCHING_STEPS#😟😗🦦😃,
    );
    if dist#:5 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 {
        return Vec4#🌎{TODO SPREADs}{w: 1, z: 0};
    } else {
        const worldPosForPixel#:7: Vec3#😦 = AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#0(
            eye#:4,
            ScaleVec3#🚐.#Mul#👩‍❤️‍👩😱🦉😃#0(dist#:5, dir#:3),
        );
        const light1Pos#:12: Vec3#😦 = Vec3#😦{TODO SPREADs}{
            z: 5,
            x: 10 * sin(iTime#:0),
            y: 10 * cos(iTime#:0),
        };
        const toLight#:13: Vec3#😦 = AddSubVec3#✨🧗‍♀️😥😃.#AddSub#🤡🧗‍♂️🥧😃#1(
            light1Pos#:12,
            worldPosForPixel#:7,
        );
        if isPointingTowardLight#👈(iTime#:0, worldPosForPixel#:7, light1Pos#:12) {
            const marchToLight#:14: float = shortestDistanceToSurface#🤺🙇‍♂️🚚😃(
                iTime#:0,
                light1Pos#:12,
                ScaleVec3#🚐.#Mul#👩‍❤️‍👩😱🦉😃#0(-1, normalize#⏳(toLight#:13)),
                MIN_DIST#🤾‍♂️,
                MAX_DIST#🥅👬👨‍🦰,
                MAX_MARCHING_STEPS#😟😗🦦😃,
            );
            if marchToLight#:14 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 * 10 {
                return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
            } else {
                if marchToLight#:14 - length#🧑‍🎄🧑‍🎓⛄😃(toLight#:13) < -EPSILON#🧑‍💻 * 1000 {
                    return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
                } else {
                    return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
                };
            };
        } else {
            return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
        };
    };
}
```
*/
export const hash_7854877f: (arg_0: number, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac) => t_b1f05ae8 = (iTime: number, fragCoord$1: t_08f7c2ac, iResolution: t_08f7c2ac) => {
  let dir: t_b79db448 = hash_43540b9c(45, iResolution, fragCoord$1);
  let eye$4: t_b79db448 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_b79db448);
  let dist$5: number = hash_73e3d992(iTime, eye$4, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$5 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_b1f05ae8);
  } else {
    let worldPosForPixel: t_b79db448 = hash_44c647be.h6ca64060_0(eye$4, hash_9ac70f34.h63513dcd_0(dist$5, dir));
    let light1Pos: t_b79db448 = ({
      type: "Vec3",
      x: 10 * sin(iTime),
      y: 10 * cos(iTime),
      z: 5
    } as t_b79db448);
    let toLight: t_b79db448 = hash_44c647be.h6ca64060_1(light1Pos, worldPosForPixel);

    if (hash_825048a2(iTime, worldPosForPixel, light1Pos)) {
      let marchToLight: number = hash_73e3d992(iTime, light1Pos, hash_9ac70f34.h63513dcd_0(-1, hash_b5ee376c(toLight)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

      if (marchToLight > hash_0ce717e6 - hash_ec7f8d1c * 10) {
        return ({ ...hash_f2b2c8e8.h63513dcd_0(hash_365fd554, 0.2),
          type: "Vec4",
          w: 1
        } as t_b1f05ae8);
      } else {
        if (marchToLight - hash_7b44054f(toLight) < -hash_ec7f8d1c * 1000) {
          return ({ ...hash_f2b2c8e8.h63513dcd_0(hash_365fd554, 0.2),
            type: "Vec4",
            w: 1
          } as t_b1f05ae8);
        } else {
          return ({ ...hash_365fd554,
            type: "Vec4",
            w: 1
          } as t_b1f05ae8);
        }
      }
    } else {
      return ({ ...hash_f2b2c8e8.h63513dcd_0(hash_365fd554, 0.2),
        type: "Vec4",
        w: 1
      } as t_b1f05ae8);
    }
  }
};

/**
```
const red#4da6b92a = Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 0.0}
Vec3#😦{TODO SPREADs}{z: 0, x: 1, y: 0}
```
*/
export const hash_4da6b92a: t_b79db448 = ({
  type: "Vec3",
  x: 1,
  y: 0,
  z: 0
} as t_b79db448);

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
  h44e31bac_0: (v: t_08f7c2ac, scale: t_08f7c2ac) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_08f7c2ac)
} as t_44e31bac<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac>);

/**
```
const random#a9479c34 = (st#:0: Vec2#08f7c2ac): float#builtin ={}> {
    fract#14e72ade(
        v: sin#builtin(
                dot#02728df0(
                    a: st#:0,
                    b: Vec2#08f7c2ac{x#08f7c2ac#0: 12.9898, y#08f7c2ac#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
(st#:0: Vec2#🍱🐶💣): float => fract#🧃💑🤶(
    sin(dot#🐶👉🙄(st#:0, Vec2#🍱🐶💣{TODO SPREADs}{x: 12.9898, y: 78.233})) * 43758.5453123,
)
```
*/
export const hash_a9479c34: (arg_0: t_08f7c2ac) => number = (st: t_08f7c2ac) => hash_14e72ade(sin(hash_02728df0(st, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_08f7c2ac))) * 43758.5453123);

/**
```
const round#399bbba4 = (v#:0: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: round#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: round#builtin(v#:0.y#08f7c2ac#1),
}
(v#:0: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
    x: round(v#:0.#Vec2#🍱🐶💣#0),
    y: round(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_399bbba4: (arg_0: t_08f7c2ac) => t_08f7c2ac = (v: t_08f7c2ac) => ({
  type: "Vec2",
  x: round(v.x),
  y: round(v.y)
} as t_08f7c2ac);

/**
```
const Vec2float#a302b9d4 = Mul#63513dcd<Vec2#08f7c2ac, float#builtin, Vec2#08f7c2ac>{
    "*"#63513dcd#0: (v#:0: Vec2#08f7c2ac, scale#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1,
    },
}
Mul#👩‍❤️‍👩😱🦉😃{TODO SPREADs}{
    h63513dcd_0: (v#:0: Vec2#🍱🐶💣, scale#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: v#:0.#Vec2#🍱🐶💣#0 * scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 * scale#:1,
    },
}
```
*/
export const hash_a302b9d4: t_63513dcd<t_08f7c2ac, number, t_08f7c2ac> = ({
  type: "63513dcd",
  h63513dcd_0: (v: t_08f7c2ac, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_08f7c2ac)
} as t_63513dcd<t_08f7c2ac, number, t_08f7c2ac>);

/**
```
const randFolks#00e99ab6 = (env#:0: GLSLEnv#a25a17de, fragCoord#:1: Vec2#08f7c2ac): Vec4#b1f05ae8 ={}> {
    const scale#:2 = 14.0;
    const small#:3 = round#399bbba4(v: fragCoord#:1 /#6a0c8558#44e31bac#0 scale#:2) 
        *#a302b9d4#63513dcd#0 scale#:2;
    const small#:4 = Vec2#08f7c2ac{
        x#08f7c2ac#0: small#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: small#:3.y#08f7c2ac#1 +#builtin env#:0.time#a25a17de#0,
    };
    const v#:5 = random#a9479c34(st: small#:4 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const two#:6 = Vec4#b1f05ae8{...red#4da6b92a *#f2b2c8e8#63513dcd#0 v#:5, w#b1f05ae8#0: 1.0} 
        +#6704233e#6ca64060#0 fishingBoueys#7854877f(
            iTime: env#:0.time#a25a17de#0,
            fragCoord#:1,
            iResolution: env#:0.resolution#a25a17de#1,
        );
    two#:6 /#9a59ed7c#44e31bac#0 2.0;
}
(env#:0: GLSLEnv#🏏, fragCoord#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
    const small#:3: Vec2#🍱🐶💣 = Vec2float#👨‍👨‍👦.#Mul#👩‍❤️‍👩😱🦉😃#0(
        round#🌦️🏔️🌞(ScaleVec2Rev#🧙‍♀️🎡🥙😃.#Div#🌈👶😭😃#0(fragCoord#:1, 14)),
        14,
    );
    return Scale4#👩‍🦯.#Div#🌈👶😭😃#0(
        AddSubVec4#🚚👨‍⚖️🍊😃.#AddSub#🤡🧗‍♂️🥧😃#0(
            Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0},
            fishingBoueys#🕡👩‍🎤🕤😃(env#:0.#GLSLEnv#🏏#0, fragCoord#:1, env#:0.#GLSLEnv#🏏#1),
        ),
        2,
    );
}
```
*/
export const hash_00e99ab6: (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8 = (env: t_a25a17de, fragCoord$1: t_08f7c2ac) => {
  let small: t_08f7c2ac = hash_a302b9d4.h63513dcd_0(hash_399bbba4(hash_6a0c8558.h44e31bac_0(fragCoord$1, 14)), 14);
  return hash_9a59ed7c.h44e31bac_0(hash_6704233e.h6ca64060_0(({ ...hash_f2b2c8e8.h63513dcd_0(hash_4da6b92a, hash_a9479c34(hash_2d0db3a8.h44e31bac_0(({
      type: "Vec2",
      x: small.x,
      y: small.y + env.time
    } as t_08f7c2ac), env.resolution)) / 10 + 0.9),
    type: "Vec4",
    w: 1
  } as t_b1f05ae8), hash_7854877f(env.time, fragCoord$1, env.resolution)), 2);
};
export const randFolks = hash_00e99ab6;