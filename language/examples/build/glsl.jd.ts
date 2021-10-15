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
const NegVec3#4d12c551 = Neg#616f559e<Vec3#b79db448, Vec3#b79db448>{
    "-"#616f559e#0: (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: -v#:0.x#08f7c2ac#0,
        y#08f7c2ac#1: -v#:0.y#08f7c2ac#1,
        z#b79db448#0: -v#:0.z#b79db448#0,
    },
}
Neg#🚣‍♀️⚾🐭😃{TODO SPREADs}{
    h616f559e_0: (v#:0: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: -v#:0.#Vec3#😦#0,
        x: -v#:0.#Vec2#🍱🐶💣#0,
        y: -v#:0.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_4d12c551: t_616f559e<t_b79db448, t_b79db448> = ({
  type: "616f559e",
  h616f559e_0: (v: t_b79db448) => ({
    type: "Vec3",
    x: -v.x,
    y: -v.y,
    z: -v.z
  } as t_b79db448)
} as t_616f559e<t_b79db448, t_b79db448>);

/**
```
const ScaleVec3Rev#f86c15e0 = Div#3b763160<Vec3#b79db448, float#builtin, Vec3#b79db448>{
    "/"#3b763160#0: (v#:0: Vec3#b79db448, scale#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1,
        z#b79db448#0: v#:0.z#b79db448#0 /#builtin scale#:1,
    },
}
Div#🧜‍♂️🧖💧{TODO SPREADs}{
    h3b763160_0: (v#:0: Vec3#😦, scale#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: v#:0.#Vec3#😦#0 / scale#:1,
        x: v#:0.#Vec2#🍱🐶💣#0 / scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 / scale#:1,
    },
}
```
*/
export const hash_f86c15e0: t_3b763160<t_b79db448, number, t_b79db448> = ({
  type: "3b763160",
  h3b763160_0: (v: t_b79db448, scale: number) => ({
    type: "Vec3",
    x: v.x / scale,
    y: v.y / scale,
    z: v.z / scale
  } as t_b79db448)
} as t_3b763160<t_b79db448, number, t_b79db448>);

/**
```
const round#ec75c0c2 = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
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
export const hash_ec75c0c2: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => ({
  type: "Vec3",
  x: round(v.x),
  y: round(v.y),
  z: round(v.z)
} as t_b79db448);

/**
```
const clamp#162a8d68 = (v#:0: Vec3#b79db448, min#:1: Vec3#b79db448, max#:2: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
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
    z#b79db448#0: clamp#f2f2e188(
        v: v#:0.z#b79db448#0,
        minv: min#:1.z#b79db448#0,
        maxv: max#:2.z#b79db448#0,
    ),
}
(v#:0: Vec3#😦, min#:1: Vec3#😦, max#:2: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: clamp#🕴️(v#:0.#Vec3#😦#0, min#:1.#Vec3#😦#0, max#:2.#Vec3#😦#0),
    x: clamp#🕴️(v#:0.#Vec2#🍱🐶💣#0, min#:1.#Vec2#🍱🐶💣#0, max#:2.#Vec2#🍱🐶💣#0),
    y: clamp#🕴️(v#:0.#Vec2#🍱🐶💣#1, min#:1.#Vec2#🍱🐶💣#1, max#:2.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_162a8d68: (arg_0: t_b79db448, arg_1: t_b79db448, arg_2: t_b79db448) => t_b79db448 = (v: t_b79db448, min: t_b79db448, max: t_b79db448) => ({
  type: "Vec3",
  x: hash_f2f2e188(v.x, min.x, max.x),
  y: hash_f2f2e188(v.y, min.y, max.y),
  z: hash_f2f2e188(v.z, min.z, max.z)
} as t_b79db448);

/**
```
const ScaleVec3#6bec1050 = Mul#02cc25c4<float#builtin, Vec3#b79db448, Vec3#b79db448>{
    "*"#02cc25c4#0: (scale#:0: float#builtin, v#:1: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: v#:1.x#08f7c2ac#0 *#builtin scale#:0,
        y#08f7c2ac#1: v#:1.y#08f7c2ac#1 *#builtin scale#:0,
        z#b79db448#0: v#:1.z#b79db448#0 *#builtin scale#:0,
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (scale#:0: float, v#:1: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: v#:1.#Vec3#😦#0 * scale#:0,
        x: v#:1.#Vec2#🍱🐶💣#0 * scale#:0,
        y: v#:1.#Vec2#🍱🐶💣#1 * scale#:0,
    },
}
```
*/
export const hash_6bec1050: t_02cc25c4<number, t_b79db448, t_b79db448> = ({
  type: "02cc25c4",
  h02cc25c4_0: (scale$0: number, v$1: t_b79db448) => ({
    type: "Vec3",
    x: v$1.x * scale$0,
    y: v$1.y * scale$0,
    z: v$1.z * scale$0
  } as t_b79db448)
} as t_02cc25c4<number, t_b79db448, t_b79db448>);

/**
```
const AddSubVec3#dff30886 = AddSub#3d436b7e<Vec3#b79db448, Vec3#b79db448, Vec3#b79db448>{
    "+"#3d436b7e#0: (one#:0: Vec3#b79db448, two#:1: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
        z#b79db448#0: one#:0.z#b79db448#0 +#builtin two#:1.z#b79db448#0,
    },
    "-"#3d436b7e#1: (one#:2: Vec3#b79db448, two#:3: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
        z#b79db448#0: one#:2.z#b79db448#0 -#builtin two#:3.z#b79db448#0,
    },
}
AddSub#🕕🧑‍🦲⚽{TODO SPREADs}{
    h3d436b7e_0: (one#:0: Vec3#😦, two#:1: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: one#:0.#Vec3#😦#0 + two#:1.#Vec3#😦#0,
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1.#Vec2#🍱🐶💣#0,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1.#Vec2#🍱🐶💣#1,
    },
    h3d436b7e_1: (one#:2: Vec3#😦, two#:3: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: one#:2.#Vec3#😦#0 - two#:3.#Vec3#😦#0,
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3.#Vec2#🍱🐶💣#0,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_dff30886: t_3d436b7e<t_b79db448, t_b79db448, t_b79db448> = ({
  type: "3d436b7e",
  h3d436b7e_0: (one: t_b79db448, two: t_b79db448) => ({
    type: "Vec3",
    x: one.x + two.x,
    y: one.y + two.y,
    z: one.z + two.z
  } as t_b79db448),
  h3d436b7e_1: (one$2: t_b79db448, two$3: t_b79db448) => ({
    type: "Vec3",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    z: one$2.z - two$3.z
  } as t_b79db448)
} as t_3d436b7e<t_b79db448, t_b79db448, t_b79db448>);

/**
```
const length#57739f70 = (v#:0: Vec3#b79db448): float#builtin ={}> sqrt#builtin(
    v#:0.x#08f7c2ac#0 *#builtin v#:0.x#08f7c2ac#0 
            +#builtin v#:0.y#08f7c2ac#1 *#builtin v#:0.y#08f7c2ac#1 
        +#builtin v#:0.z#b79db448#0 *#builtin v#:0.z#b79db448#0,
)
(v#:0: Vec3#😦): float => sqrt(
    v#:0.#Vec2#🍱🐶💣#0 * v#:0.#Vec2#🍱🐶💣#0 + v#:0.#Vec2#🍱🐶💣#1 * v#:0.#Vec2#🍱🐶💣#1 + v#:0.#Vec3#😦#0 * v#:0.#Vec3#😦#0,
)
```
*/
export const hash_57739f70: (arg_0: t_b79db448) => number = (v: t_b79db448) => sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/**
```
const sminCubic#e7c85424 = (a#:0: float#builtin, b#:1: float#builtin, k#:2: float#builtin): float#builtin ={}> {
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
export const hash_e7c85424: (arg_0: number, arg_1: number, arg_2: number) => number = (a: number, b: number, k: number) => {
  let h: number = max(k - abs(a - b), 0) / k;
  return min(a, b) - h * h * h * k * (1 / 6);
};

/**
```
const opRepLim#4f0b1aa0 = (p#:0: Vec3#b79db448, c#:1: float#builtin, l#:2: Vec3#b79db448): Vec3#b79db448 ={}> {
    p#:0 
        -#dff30886#3d436b7e#1 c#:1 
            *#6bec1050#02cc25c4#0 clamp#162a8d68(
                v: round#ec75c0c2(v: p#:0 /#f86c15e0#3b763160#0 c#:1),
                min: NegVec3#4d12c551."-"#616f559e#0(l#:2),
                max: l#:2,
            );
}
(p#:0: Vec3#😦, c#:1: float, l#:2: Vec3#😦): Vec3#😦 => AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(
    p#:0,
    ScaleVec3#😖🏨🦞😃.#Mul#👫🏭😪#0(
        c#:1,
        clamp#🧟🍳🧝(
            round#👀(ScaleVec3Rev#👨‍👧.#Div#🧜‍♂️🧖💧#0(p#:0, c#:1)),
            NegVec3#🦸‍♂️🤲👨‍🦲😃.#Neg#🚣‍♀️⚾🐭😃#0(l#:2),
            l#:2,
        ),
    ),
)
```
*/
export const hash_4f0b1aa0: (arg_0: t_b79db448, arg_1: number, arg_2: t_b79db448) => t_b79db448 = (p: t_b79db448, c: number, l: t_b79db448) => hash_dff30886.h3d436b7e_1(p, hash_6bec1050.h02cc25c4_0(c, hash_162a8d68(hash_ec75c0c2(hash_f86c15e0.h3b763160_0(p, c)), hash_4d12c551.h616f559e_0(l), l)));

/**
```
const EPSILON#ec7f8d1c = 0.00005
0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

/**
```
const normalize#2dc09b90 = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> v#:0 
    /#f86c15e0#3b763160#0 length#57739f70(v#:0)
(v#:0: Vec3#😦): Vec3#😦 => ScaleVec3Rev#👨‍👧.#Div#🧜‍♂️🧖💧#0(v#:0, length#⏲️🙅‍♂️🧎😃(v#:0))
```
*/
export const hash_2dc09b90: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => hash_f86c15e0.h3b763160_0(v, hash_57739f70(v));

/**
```
const sceneSDF#56591574 = (iTime#:0: float#builtin, samplePoint#:1: Vec3#b79db448): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p2#:3 = samplePoint#:1 
        -#dff30886#3d436b7e#1 Vec3#b79db448{
            x#08f7c2ac#0: -sin#builtin(double#:2) /#builtin 2.0,
            y#08f7c2ac#1: sin#builtin(iTime#:0 /#builtin 4.0) /#builtin 2.0,
            z#b79db448#0: cos#builtin(double#:2) /#builtin 2.0,
        };
    const p1#:4 = samplePoint#:1;
    const p2#:5 = opRepLim#4f0b1aa0(
        p: p2#:3,
        c: 0.1,
        l: Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 1.0},
    );
    sminCubic#e7c85424(
        a: length#57739f70(v: p1#:4) -#builtin 0.5,
        b: length#57739f70(v: p2#:5) -#builtin 0.03,
        k: 0.1,
    );
}
(iTime#:0: float, samplePoint#:1: Vec3#😦): float => {
    const double#:2: float = iTime#:0 * 2;
    return sminCubic#😶(
        length#⏲️🙅‍♂️🧎😃(samplePoint#:1) - 0.5,
        length#⏲️🙅‍♂️🧎😃(
            opRepLim#🥙🍪🙋‍♂️😃(
                AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(
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
export const hash_56591574: (arg_0: number, arg_1: t_b79db448) => number = (iTime: number, samplePoint: t_b79db448) => {
  let double: number = iTime * 2;
  return hash_e7c85424(hash_57739f70(samplePoint) - 0.5, hash_57739f70(hash_4f0b1aa0(hash_dff30886.h3d436b7e_1(samplePoint, ({
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
const dot#4390c737 = (a#:0: Vec3#b79db448, b#:1: Vec3#b79db448): float#builtin ={}> {
    a#:0.x#08f7c2ac#0 *#builtin b#:1.x#08f7c2ac#0 
            +#builtin a#:0.y#08f7c2ac#1 *#builtin b#:1.y#08f7c2ac#1 
        +#builtin a#:0.z#b79db448#0 *#builtin b#:1.z#b79db448#0;
}
(a#:0: Vec3#😦, b#:1: Vec3#😦): float => a#:0.#Vec2#🍱🐶💣#0 * b#:1.#Vec2#🍱🐶💣#0 + a#:0.#Vec2#🍱🐶💣#1 * b#:1.#Vec2#🍱🐶💣#1 + a#:0.#Vec3#😦#0 * b#:1.#Vec3#😦#0
```
*/
export const hash_4390c737: (arg_0: t_b79db448, arg_1: t_b79db448) => number = (a: t_b79db448, b: t_b79db448) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
```
const estimateNormal#7b8a678f = (iTime#:0: float#builtin, p#:1: Vec3#b79db448): Vec3#b79db448 ={}> normalize#2dc09b90(
    v: Vec3#b79db448{
        x#08f7c2ac#0: sceneSDF#56591574(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    x#08f7c2ac#0: p#:1.x#08f7c2ac#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#56591574(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    x#08f7c2ac#0: p#:1.x#08f7c2ac#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        y#08f7c2ac#1: sceneSDF#56591574(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    y#08f7c2ac#1: p#:1.y#08f7c2ac#1 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#56591574(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    y#08f7c2ac#1: p#:1.y#08f7c2ac#1 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        z#b79db448#0: sceneSDF#56591574(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    z#b79db448#0: p#:1.z#b79db448#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#56591574(
                iTime#:0,
                samplePoint: Vec3#b79db448{
                    ...p#:1,
                    z#b79db448#0: p#:1.z#b79db448#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
    },
)
(iTime#:0: float, p#:1: Vec3#😦): Vec3#😦 => normalize#🌗😒🥃(
    Vec3#😦{TODO SPREADs}{
        z: sceneSDF#🧍🐟🧞😃(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: p#:1.#Vec3#😦#0 + EPSILON#🧑‍💻, x: _#:0, y: _#:0},
        ) - sceneSDF#🧍🐟🧞😃(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: p#:1.#Vec3#😦#0 - EPSILON#🧑‍💻, x: _#:0, y: _#:0},
        ),
        x: sceneSDF#🧍🐟🧞😃(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: p#:1.#Vec2#🍱🐶💣#0 + EPSILON#🧑‍💻, y: _#:0},
        ) - sceneSDF#🧍🐟🧞😃(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: p#:1.#Vec2#🍱🐶💣#0 - EPSILON#🧑‍💻, y: _#:0},
        ),
        y: sceneSDF#🧍🐟🧞😃(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: _#:0, y: p#:1.#Vec2#🍱🐶💣#1 + EPSILON#🧑‍💻},
        ) - sceneSDF#🧍🐟🧞😃(
            iTime#:0,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: _#:0, y: p#:1.#Vec2#🍱🐶💣#1 - EPSILON#🧑‍💻},
        ),
    },
)
```
*/
export const hash_7b8a678f: (arg_0: number, arg_1: t_b79db448) => t_b79db448 = (iTime: number, p$1: t_b79db448) => hash_2dc09b90(({
  type: "Vec3",
  x: hash_56591574(iTime, ({ ...p$1,
    type: "Vec3",
    x: p$1.x + hash_ec7f8d1c
  } as t_b79db448)) - hash_56591574(iTime, ({ ...p$1,
    type: "Vec3",
    x: p$1.x - hash_ec7f8d1c
  } as t_b79db448)),
  y: hash_56591574(iTime, ({ ...p$1,
    type: "Vec3",
    y: p$1.y + hash_ec7f8d1c
  } as t_b79db448)) - hash_56591574(iTime, ({ ...p$1,
    type: "Vec3",
    y: p$1.y - hash_ec7f8d1c
  } as t_b79db448)),
  z: hash_56591574(iTime, ({ ...p$1,
    type: "Vec3",
    z: p$1.z + hash_ec7f8d1c
  } as t_b79db448)) - hash_56591574(iTime, ({ ...p$1,
    type: "Vec3",
    z: p$1.z - hash_ec7f8d1c
  } as t_b79db448))
} as t_b79db448));

/**
```
const vec3#30188c24 = (v#:0: Vec2#08f7c2ac, z#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
    ...v#:0,
    z#b79db448#0: z#:1,
}
(v#:0: Vec2#🍱🐶💣, z#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{z: z#:1, x: _#:0, y: _#:0}
```
*/
export const hash_30188c24: (arg_0: t_08f7c2ac, arg_1: number) => t_b79db448 = (v: t_08f7c2ac, z: number) => ({ ...v,
  type: "Vec3",
  z: z
} as t_b79db448);

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
const ScaleVec3_#24e970fe = Mul#02cc25c4<Vec3#b79db448, float#builtin, Vec3#b79db448>{
    "*"#02cc25c4#0: (v#:0: Vec3#b79db448, scale#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1,
        z#b79db448#0: v#:0.z#b79db448#0 *#builtin scale#:1,
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (v#:0: Vec3#😦, scale#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{
        z: v#:0.#Vec3#😦#0 * scale#:1,
        x: v#:0.#Vec2#🍱🐶💣#0 * scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 * scale#:1,
    },
}
```
*/
export const hash_24e970fe: t_02cc25c4<t_b79db448, number, t_b79db448> = ({
  type: "02cc25c4",
  h02cc25c4_0: (v: t_b79db448, scale: number) => ({
    type: "Vec3",
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale
  } as t_b79db448)
} as t_02cc25c4<t_b79db448, number, t_b79db448>);

/**
```
const isPointingTowardLight#0e6c65dc = (
    iTime#:0: float#builtin,
    p#:1: Vec3#b79db448,
    lightPos#:2: Vec3#b79db448,
): bool#builtin ={}> {
    const N#:3 = estimateNormal#7b8a678f(iTime#:0, p#:1);
    const L#:4 = normalize#2dc09b90(v: lightPos#:2 -#dff30886#3d436b7e#1 p#:1);
    const dotLN#:5 = dot#4390c737(a: L#:4, b: N#:3);
    dotLN#:5 >=#builtin 0.0;
}
(iTime#:0: float, p#:1: Vec3#😦, lightPos#:2: Vec3#😦): bool => dot#🚓🤕🤯😃(
    normalize#🌗😒🥃(AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(lightPos#:2, p#:1)),
    estimateNormal#🌖🍟🌊😃(iTime#:0, p#:1),
) >= 0
```
*/
export const hash_0e6c65dc: (arg_0: number, arg_1: t_b79db448, arg_2: t_b79db448) => boolean = (iTime: number, p$1: t_b79db448, lightPos: t_b79db448) => hash_4390c737(hash_2dc09b90(hash_dff30886.h3d436b7e_1(lightPos, p$1)), hash_7b8a678f(iTime, p$1)) >= 0;

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
const rec shortestDistanceToSurface#5fe50179 = (
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
        const dist#:6 = sceneSDF#56591574(
            iTime#:0,
            samplePoint: eye#:1 
                +#dff30886#3d436b7e#0 start#:3 *#6bec1050#02cc25c4#0 marchingDirection#:2,
        );
        if dist#:6 <#builtin EPSILON#ec7f8d1c {
            start#:3;
        } else {
            const depth#:7 = start#:3 +#builtin dist#:6;
            if depth#:7 >=#builtin end#:4 {
                end#:4;
            } else {
                5fe50179#self(
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
        const dist#:6: float = sceneSDF#🧍🐟🧞😃(
            iTime#:0,
            AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#0(
                eye#:1,
                ScaleVec3#😖🏨🦞😃.#Mul#👫🏭😪#0(start#:3, marchingDirection#:2),
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
export const hash_5fe50179: (arg_0: number, arg_1: t_b79db448, arg_2: t_b79db448, arg_3: number, arg_4: number, arg_5: number) => number = (iTime: number, eye: t_b79db448, marchingDirection: t_b79db448, start: number, end: number, stepsLeft: number) => {
  for (; stepsLeft > 0; stepsLeft = stepsLeft - 1) {
    let dist: number = hash_56591574(iTime, hash_dff30886.h3d436b7e_0(eye, hash_6bec1050.h02cc25c4_0(start, marchingDirection)));

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
const rayDirection#08d4f757 = (
    fieldOfView#:0: float#builtin,
    size#:1: Vec2#08f7c2ac,
    fragCoord#:2: Vec2#08f7c2ac,
): Vec3#b79db448 ={}> {
    const xy#:3 = fragCoord#:2 -#04f14e9c#3d436b7e#1 size#:1 /#02622a76#3b763160#0 2.0;
    const z#:4 = size#:1.y#08f7c2ac#1 
        /#builtin tan#builtin(radians#dabe7f9c(degrees: fieldOfView#:0) /#builtin 2.0);
    normalize#2dc09b90(v: vec3#30188c24(v: xy#:3, z: -z#:4));
}
(fieldOfView#:0: float, size#:1: Vec2#🍱🐶💣, fragCoord#:2: Vec2#🍱🐶💣): Vec3#😦 => normalize#🌗😒🥃(
    vec3#😶🦥🏤(
        AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
            fragCoord#:2,
            ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(size#:1, 2),
        ),
        -size#:1.#Vec2#🍱🐶💣#1 / tan(radians#🌟(fieldOfView#:0) / 2),
    ),
)
```
*/
export const hash_08d4f757: (arg_0: number, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac) => t_b79db448 = (fieldOfView: number, size: t_08f7c2ac, fragCoord: t_08f7c2ac) => hash_2dc09b90(hash_30188c24(hash_04f14e9c.h3d436b7e_1(fragCoord, hash_02622a76.h3b763160_0(size, 2)), -(size.y / tan(hash_dabe7f9c(fieldOfView) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
255
```
*/
export const hash_62404440: number = 255;

/**
```
const dot#621dd97c = (a#:0: Vec2#08f7c2ac, b#:1: Vec2#08f7c2ac): float#builtin ={}> {
    a#:0.x#08f7c2ac#0 *#builtin b#:1.x#08f7c2ac#0 
        +#builtin a#:0.y#08f7c2ac#1 *#builtin b#:1.y#08f7c2ac#1;
}
(a#:0: Vec2#🍱🐶💣, b#:1: Vec2#🍱🐶💣): float => a#:0.#Vec2#🍱🐶💣#0 * b#:1.#Vec2#🍱🐶💣#0 + a#:0.#Vec2#🍱🐶💣#1 * b#:1.#Vec2#🍱🐶💣#1
```
*/
export const hash_621dd97c: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac) => number = (a: t_08f7c2ac, b: t_08f7c2ac) => a.x * b.x + a.y * b.y;

/**
```
const fract#495c4d22 = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
(v#:0: float): float => v#:0 - floor(v#:0)
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const Scale4#26cc7591 = Div#3b763160<Vec4#b1f05ae8, float#builtin, Vec4#b1f05ae8>{
    "/"#3b763160#0: (v#:0: Vec4#b1f05ae8, scale#:1: float#builtin): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: v#:0.z#b79db448#0 /#builtin scale#:1,
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 /#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 /#builtin scale#:1,
        w#b1f05ae8#0: v#:0.w#b1f05ae8#0 /#builtin scale#:1,
    },
}
Div#🧜‍♂️🧖💧{TODO SPREADs}{
    h3b763160_0: (v#:0: Vec4#🌎, scale#:1: float): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: v#:0.#Vec4#🌎#0 / scale#:1,
        z: v#:0.#Vec3#😦#0 / scale#:1,
    },
}
```
*/
export const hash_26cc7591: t_3b763160<t_b1f05ae8, number, t_b1f05ae8> = ({
  type: "3b763160",
  h3b763160_0: (v: t_b1f05ae8, scale: number) => ({
    type: "Vec4",
    z: v.z / scale,
    x: v.x / scale,
    y: v.y / scale,
    w: v.w / scale
  } as t_b1f05ae8)
} as t_3b763160<t_b1f05ae8, number, t_b1f05ae8>);

/**
```
const fishingBoueys#07bef798 = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#08f7c2ac,
    iResolution#:2: Vec2#08f7c2ac,
): Vec4#b1f05ae8 ={}> {
    const dir#:3 = rayDirection#08d4f757(fieldOfView: 45.0, size: iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#5fe50179(
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
            +#dff30886#3d436b7e#0 dist#:5 *#6bec1050#02cc25c4#0 dir#:3;
        const K_a#:8 = Vec3#b79db448{x#08f7c2ac#0: 0.9, y#08f7c2ac#1: 0.2, z#b79db448#0: 0.3};
        const K_d#:9 = Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.2, z#b79db448#0: 0.7};
        const K_s#:10 = Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 1.0};
        const shininess#:11 = 10.0;
        const light1Pos#:12 = Vec3#b79db448{
            x#08f7c2ac#0: 10.0 *#builtin sin#builtin(iTime#:0),
            y#08f7c2ac#1: 10.0 *#builtin cos#builtin(iTime#:0),
            z#b79db448#0: 5.0,
        };
        const toLight#:13 = light1Pos#:12 -#dff30886#3d436b7e#1 worldPosForPixel#:7;
        if isPointingTowardLight#0e6c65dc(iTime#:0, p: worldPosForPixel#:7, lightPos: light1Pos#:12) {
            const marchToLight#:14 = shortestDistanceToSurface#5fe50179(
                iTime#:0,
                eye: light1Pos#:12,
                marchingDirection: -1.0 *#6bec1050#02cc25c4#0 normalize#2dc09b90(v: toLight#:13),
                start: MIN_DIST#f2cd39b8,
                end: MAX_DIST#0ce717e6,
                stepsLeft: MAX_MARCHING_STEPS#62404440,
            );
            if marchToLight#:14 
                >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c *#builtin 10.0 {
                Vec4#b1f05ae8{...white#365fd554 *#24e970fe#02cc25c4#0 light#:6, w#b1f05ae8#0: 1.0};
            } else {
                const offset#:15 = marchToLight#:14 -#builtin length#57739f70(v: toLight#:13);
                const penumbra#:16 = 0.1;
                if offset#:15 <#builtin -EPSILON#ec7f8d1c *#builtin 1000.0 {
                    Vec4#b1f05ae8{
                        ...white#365fd554 *#24e970fe#02cc25c4#0 light#:6,
                        w#b1f05ae8#0: 1.0,
                    };
                } else {
                    Vec4#b1f05ae8{...white#365fd554, w#b1f05ae8#0: 1.0};
                };
            };
        } else {
            Vec4#b1f05ae8{...white#365fd554 *#24e970fe#02cc25c4#0 light#:6, w#b1f05ae8#0: 1.0};
        };
    };
}
(iTime#:0: float, fragCoord#:1: Vec2#🍱🐶💣, iResolution#:2: Vec2#🍱🐶💣): Vec4#🌎 => {
    const dir#:3: Vec3#😦 = rayDirection#🚤👳‍♂️💨(45, iResolution#:2, fragCoord#:1);
    const eye#:4: Vec3#😦 = Vec3#😦{TODO SPREADs}{z: 5, x: 0, y: 0};
    const dist#:5: float = shortestDistanceToSurface#🧎‍♀️🧕🐆😃(
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
        const worldPosForPixel#:7: Vec3#😦 = AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#0(
            eye#:4,
            ScaleVec3#😖🏨🦞😃.#Mul#👫🏭😪#0(dist#:5, dir#:3),
        );
        const light1Pos#:12: Vec3#😦 = Vec3#😦{TODO SPREADs}{
            z: 5,
            x: 10 * sin(iTime#:0),
            y: 10 * cos(iTime#:0),
        };
        const toLight#:13: Vec3#😦 = AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(
            light1Pos#:12,
            worldPosForPixel#:7,
        );
        if isPointingTowardLight#👩‍👩‍👦‍👦🏙️🙅(iTime#:0, worldPosForPixel#:7, light1Pos#:12) {
            const marchToLight#:14: float = shortestDistanceToSurface#🧎‍♀️🧕🐆😃(
                iTime#:0,
                light1Pos#:12,
                ScaleVec3#😖🏨🦞😃.#Mul#👫🏭😪#0(-1, normalize#🌗😒🥃(toLight#:13)),
                MIN_DIST#🤾‍♂️,
                MAX_DIST#🥅👬👨‍🦰,
                MAX_MARCHING_STEPS#😟😗🦦😃,
            );
            if marchToLight#:14 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 * 10 {
                return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
            } else {
                if marchToLight#:14 - length#⏲️🙅‍♂️🧎😃(toLight#:13) < -EPSILON#🧑‍💻 * 1000 {
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
export const hash_07bef798: (arg_0: number, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac) => t_b1f05ae8 = (iTime: number, fragCoord$1: t_08f7c2ac, iResolution: t_08f7c2ac) => {
  let dir: t_b79db448 = hash_08d4f757(45, iResolution, fragCoord$1);
  let eye$4: t_b79db448 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_b79db448);
  let dist$5: number = hash_5fe50179(iTime, eye$4, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$5 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_b1f05ae8);
  } else {
    let worldPosForPixel: t_b79db448 = hash_dff30886.h3d436b7e_0(eye$4, hash_6bec1050.h02cc25c4_0(dist$5, dir));
    let light1Pos: t_b79db448 = ({
      type: "Vec3",
      x: 10 * sin(iTime),
      y: 10 * cos(iTime),
      z: 5
    } as t_b79db448);
    let toLight: t_b79db448 = hash_dff30886.h3d436b7e_1(light1Pos, worldPosForPixel);

    if (hash_0e6c65dc(iTime, worldPosForPixel, light1Pos)) {
      let marchToLight: number = hash_5fe50179(iTime, light1Pos, hash_6bec1050.h02cc25c4_0(-1, hash_2dc09b90(toLight)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

      if (marchToLight > hash_0ce717e6 - hash_ec7f8d1c * 10) {
        return ({ ...hash_24e970fe.h02cc25c4_0(hash_365fd554, 0.2),
          type: "Vec4",
          w: 1
        } as t_b1f05ae8);
      } else {
        if (marchToLight - hash_57739f70(toLight) < -hash_ec7f8d1c * 1000) {
          return ({ ...hash_24e970fe.h02cc25c4_0(hash_365fd554, 0.2),
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
      return ({ ...hash_24e970fe.h02cc25c4_0(hash_365fd554, 0.2),
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
const AddSubVec4#24c21a2e = AddSub#3d436b7e<Vec4#b1f05ae8, Vec4#b1f05ae8, Vec4#b1f05ae8>{
    "+"#3d436b7e#0: (one#:0: Vec4#b1f05ae8, two#:1: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: one#:0.z#b79db448#0 +#builtin two#:1.z#b79db448#0,
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
        w#b1f05ae8#0: one#:0.w#b1f05ae8#0 +#builtin two#:1.w#b1f05ae8#0,
    },
    "-"#3d436b7e#1: (one#:2: Vec4#b1f05ae8, two#:3: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: one#:2.z#b79db448#0 -#builtin two#:3.z#b79db448#0,
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
        w#b1f05ae8#0: one#:2.w#b1f05ae8#0 -#builtin two#:3.w#b1f05ae8#0,
    },
}
AddSub#🕕🧑‍🦲⚽{TODO SPREADs}{
    h3d436b7e_0: (one#:0: Vec4#🌎, two#:1: Vec4#🌎): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: one#:0.#Vec4#🌎#0 + two#:1.#Vec4#🌎#0,
        z: one#:0.#Vec3#😦#0 + two#:1.#Vec3#😦#0,
    },
    h3d436b7e_1: (one#:2: Vec4#🌎, two#:3: Vec4#🌎): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: one#:2.#Vec4#🌎#0 - two#:3.#Vec4#🌎#0,
        z: one#:2.#Vec3#😦#0 - two#:3.#Vec3#😦#0,
    },
}
```
*/
export const hash_24c21a2e: t_3d436b7e<t_b1f05ae8, t_b1f05ae8, t_b1f05ae8> = ({
  type: "3d436b7e",
  h3d436b7e_0: (one: t_b1f05ae8, two: t_b1f05ae8) => ({
    type: "Vec4",
    z: one.z + two.z,
    x: one.x + two.x,
    y: one.y + two.y,
    w: one.w + two.w
  } as t_b1f05ae8),
  h3d436b7e_1: (one$2: t_b1f05ae8, two$3: t_b1f05ae8) => ({
    type: "Vec4",
    z: one$2.z - two$3.z,
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y,
    w: one$2.w - two$3.w
  } as t_b1f05ae8)
} as t_3d436b7e<t_b1f05ae8, t_b1f05ae8, t_b1f05ae8>);

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
const random#2f576342 = (st#:0: Vec2#08f7c2ac): float#builtin ={}> {
    fract#495c4d22(
        v: sin#builtin(
                dot#621dd97c(
                    a: st#:0,
                    b: Vec2#08f7c2ac{x#08f7c2ac#0: 12.9898, y#08f7c2ac#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
(st#:0: Vec2#🍱🐶💣): float => fract#🧑‍🎨⛩️💤😃(
    sin(dot#👩‍🦯🕑🐨😃(st#:0, Vec2#🍱🐶💣{TODO SPREADs}{x: 12.9898, y: 78.233})) * 43758.5453123,
)
```
*/
export const hash_2f576342: (arg_0: t_08f7c2ac) => number = (st: t_08f7c2ac) => hash_495c4d22(sin(hash_621dd97c(st, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_08f7c2ac))) * 43758.5453123);

/**
```
const round#73e3f152 = (v#:0: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: round#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: round#builtin(v#:0.y#08f7c2ac#1),
}
(v#:0: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
    x: round(v#:0.#Vec2#🍱🐶💣#0),
    y: round(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_73e3f152: (arg_0: t_08f7c2ac) => t_08f7c2ac = (v: t_08f7c2ac) => ({
  type: "Vec2",
  x: round(v.x),
  y: round(v.y)
} as t_08f7c2ac);

/**
```
const Vec2float#db41487e = Mul#02cc25c4<Vec2#08f7c2ac, float#builtin, Vec2#08f7c2ac>{
    "*"#02cc25c4#0: (v#:0: Vec2#08f7c2ac, scale#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1,
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (v#:0: Vec2#🍱🐶💣, scale#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: v#:0.#Vec2#🍱🐶💣#0 * scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 * scale#:1,
    },
}
```
*/
export const hash_db41487e: t_02cc25c4<t_08f7c2ac, number, t_08f7c2ac> = ({
  type: "02cc25c4",
  h02cc25c4_0: (v: t_08f7c2ac, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_08f7c2ac)
} as t_02cc25c4<t_08f7c2ac, number, t_08f7c2ac>);

/**
```
const randFolks#86010cca = (env#:0: GLSLEnv#a25a17de, fragCoord#:1: Vec2#08f7c2ac): Vec4#b1f05ae8 ={}> {
    const scale#:2 = 14.0;
    const small#:3 = round#73e3f152(v: fragCoord#:1 /#02622a76#3b763160#0 scale#:2) 
        *#db41487e#02cc25c4#0 scale#:2;
    const small#:4 = Vec2#08f7c2ac{
        x#08f7c2ac#0: small#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: small#:3.y#08f7c2ac#1 +#builtin env#:0.time#a25a17de#0,
    };
    const v#:5 = random#2f576342(st: small#:4 /#08bab8c4#3b763160#0 env#:0.resolution#a25a17de#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const two#:6 = Vec4#b1f05ae8{...red#4da6b92a *#24e970fe#02cc25c4#0 v#:5, w#b1f05ae8#0: 1.0} 
        +#24c21a2e#3d436b7e#0 fishingBoueys#07bef798(
            iTime: env#:0.time#a25a17de#0,
            fragCoord#:1,
            iResolution: env#:0.resolution#a25a17de#1,
        );
    two#:6 /#26cc7591#3b763160#0 2.0;
}
(env#:0: GLSLEnv#🏏, fragCoord#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
    const small#:3: Vec2#🍱🐶💣 = Vec2float#💔.#Mul#👫🏭😪#0(
        round#🦸‍♀️🤷‍♂️🚚😃(ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, 14)),
        14,
    );
    return Scale4#🧗‍♀️🌇🍃.#Div#🧜‍♂️🧖💧#0(
        AddSubVec4#🐥🖤🦋.#AddSub#🕕🧑‍🦲⚽#0(
            Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0},
            fishingBoueys#🌝🧨💕(env#:0.#GLSLEnv#🏏#0, fragCoord#:1, env#:0.#GLSLEnv#🏏#1),
        ),
        2,
    );
}
```
*/
export const hash_86010cca: (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8 = (env: t_a25a17de, fragCoord$1: t_08f7c2ac) => {
  let small: t_08f7c2ac = hash_db41487e.h02cc25c4_0(hash_73e3f152(hash_02622a76.h3b763160_0(fragCoord$1, 14)), 14);
  return hash_26cc7591.h3b763160_0(hash_24c21a2e.h3d436b7e_0(({ ...hash_24e970fe.h02cc25c4_0(hash_4da6b92a, hash_2f576342(hash_08bab8c4.h3b763160_0(({
      type: "Vec2",
      x: small.x,
      y: small.y + env.time
    } as t_08f7c2ac), env.resolution)) / 10 + 0.9),
    type: "Vec4",
    w: 1
  } as t_b1f05ae8), hash_07bef798(env.time, fragCoord$1, env.resolution)), 2);
};
export const randFolks = hash_86010cca;