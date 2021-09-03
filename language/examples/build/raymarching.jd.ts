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
type Neg#616f559e<A#:0, B#:1> = {
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
const distance#68c654a3 = (one#:0: Vec3#40e2c712, two#:1: Vec3#40e2c712): float#builtin ={}> length#0336cfd0(
    v: two#:1 -#ab6a3504#3d436b7e#1 one#:0,
)
(one#:0: Vec3#🕍🤲😍😃, two#:1: Vec3#🕍🤲😍😃): float => length#🏅🤼‍♀️🤮(
    AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#1(two#:1, one#:0),
)
```
*/
export const hash_68c654a3: (arg_0: t_40e2c712, arg_1: t_40e2c712) => number = (one: t_40e2c712, two: t_40e2c712) => hash_0336cfd0(hash_ab6a3504.h3d436b7e_1(two, one));

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
const max#831cd664 = (v#:0: Vec3#40e2c712): float#builtin ={}> {
    max#builtin(max#builtin(v#:0.x#08f7c2ac#0, v#:0.y#08f7c2ac#1), v#:0.z#40e2c712#0);
}
(v#:0: Vec3#🕍🤲😍😃): float => max(
    max(v#:0.#Vec2#🍱🐶💣#0, v#:0.#Vec2#🍱🐶💣#1),
    v#:0.#Vec3#🕍🤲😍😃#0,
)
```
*/
export const hash_831cd664: (arg_0: t_40e2c712) => number = (v: t_40e2c712) => max(max(v.x, v.y), v.z);

/**
```
const differenceSDF#fdad0384 = (distA#:0: float#builtin, distB#:1: float#builtin): float#builtin ={}> {
    max#builtin(distA#:0, -distB#:1);
}
(distA#:0: float, distB#:1: float): float => max(distA#:0, -distB#:1)
```
*/
export const hash_fdad0384: (arg_0: number, arg_1: number) => number = (distA: number, distB: number) => max(distA, -distB);

/**
```
const unionSDF#5ee91162 = (distA#:0: float#builtin, distB#:1: float#builtin): float#builtin ={}> {
    min#builtin(distA#:0, distB#:1);
}
(distA#:0: float, distB#:1: float): float => min(distA#:0, distB#:1)
```
*/
export const hash_5ee91162: (arg_0: number, arg_1: number) => number = (distA: number, distB: number) => min(distA, distB);

/**
```
const sphereSDF#386fd2b7 = (
    samplePoint#:0: Vec3#40e2c712,
    center#:1: Vec3#40e2c712,
    radius#:2: float#builtin,
): float#builtin ={}> distance#68c654a3(one: samplePoint#:0, two: center#:1) -#builtin radius#:2
(samplePoint#:0: Vec3#🕍🤲😍😃, center#:1: Vec3#🕍🤲😍😃, radius#:2: float): float => distance#👉🏂🍞😃(
    samplePoint#:0,
    center#:1,
) - radius#:2
```
*/
export const hash_386fd2b7: (arg_0: t_40e2c712, arg_1: t_40e2c712, arg_2: number) => number = (samplePoint: t_40e2c712, center: t_40e2c712, radius: number) => hash_68c654a3(samplePoint, center) - radius;

/**
```
const rotateY#3c48f9e2 = (theta#:0: float#builtin): Mat4#205100f4 ={}> {
    const c#:1 = cos#builtin(theta#:0);
    const s#:2 = sin#builtin(theta#:0);
    Mat4#205100f4{
        r1#205100f4#0: vec4#9d013532(x: c#:1, y: 0.0, z: s#:2, w: 0.0),
        r2#205100f4#1: vec4#9d013532(x: c#:1, y: 1.0, z: c#:1, w: 0.0),
        r3#205100f4#2: vec4#9d013532(x: -s#:2, y: 0.0, z: c#:1, w: 0.0),
        r4#205100f4#3: vec4#9d013532(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(theta#:0: float): Mat4#🧏‍♀️😟🐂 => {
    const c#:1: float = cos(theta#:0);
    const s#:2: float = sin(theta#:0);
    return Mat4#🧏‍♀️😟🐂{TODO SPREADs}{
        r1: vec4#🕵️‍♂️(c#:1, 0, s#:2, 0),
        r2: vec4#🕵️‍♂️(c#:1, 1, c#:1, 0),
        r3: vec4#🕵️‍♂️(-s#:2, 0, c#:1, 0),
        r4: vec4#🕵️‍♂️(0, 0, 0, 1),
    };
}
```
*/
export const hash_3c48f9e2: (arg_0: number) => t_205100f4 = (theta: number) => {
  let c: number = cos(theta);
  let s: number = sin(theta);
  return ({
    type: "Mat4",
    r1: hash_9d013532(c, 0, s, 0),
    r2: hash_9d013532(c, 1, c, 0),
    r3: hash_9d013532(-s, 0, c, 0),
    r4: hash_9d013532(0, 0, 0, 1)
  } as t_205100f4);
};

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
const dot#35634032 = (a#:0: Vec3#40e2c712, b#:1: Vec3#40e2c712): float#builtin ={}> {
    a#:0.x#08f7c2ac#0 *#builtin b#:1.x#08f7c2ac#0 
            +#builtin a#:0.y#08f7c2ac#1 *#builtin b#:1.y#08f7c2ac#1 
        +#builtin a#:0.z#40e2c712#0 *#builtin b#:1.z#40e2c712#0;
}
(a#:0: Vec3#🕍🤲😍😃, b#:1: Vec3#🕍🤲😍😃): float => a#:0.#Vec2#🍱🐶💣#0 * b#:1.#Vec2#🍱🐶💣#0 + a#:0.#Vec2#🍱🐶💣#1 * b#:1.#Vec2#🍱🐶💣#1 + a#:0.#Vec3#🕍🤲😍😃#0 * b#:1.#Vec3#🕍🤲😍😃#0
```
*/
export const hash_35634032: (arg_0: t_40e2c712, arg_1: t_40e2c712) => number = (a: t_40e2c712, b: t_40e2c712) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
```
const EPSILON#17261aaa = 0.0001
0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const sceneSDF#3ae94934 = (iTime#:0: float#builtin, samplePoint#:1: Vec3#40e2c712): float#builtin ={}> {
    const cubePoint#:2 = samplePoint#:1;
    const cubePoint#:3 = cubePoint#:2 
        -#ab6a3504#3d436b7e#1 Vec3#40e2c712{
            x#08f7c2ac#0: 0.0,
            y#08f7c2ac#1: 0.0,
            z#40e2c712#0: -1.0,
        };
    const cubePoint#:4 = xyz#312e3c78(
        v: rotateY#3c48f9e2(theta: iTime#:0 /#builtin PI#builtin) 
            *#197a9c42#02cc25c4#0 Vec4#51a53bbe{...cubePoint#:3, w#51a53bbe#0: 1.0},
    );
    const size#:5 = sin#builtin(iTime#:0) *#builtin 0.2 +#builtin 0.4;
    const cosize#:6 = cos#builtin(iTime#:0) *#builtin 0.2 +#builtin 0.4;
    const offset#:7 = 0.6;
    const cubeSize#:8 = Vec3#40e2c712{
        x#08f7c2ac#0: size#:5,
        y#08f7c2ac#1: cosize#:6,
        z#40e2c712#0: size#:5,
    };
    const innerCubeSize#:9 = Vec3#40e2c712{
        x#08f7c2ac#0: size#:5 *#builtin offset#:7,
        y#08f7c2ac#1: cosize#:6 *#builtin offset#:7,
        z#40e2c712#0: size#:5 *#builtin offset#:7,
    };
    const circles#:10 = min#builtin(
        sphereSDF#386fd2b7(
            samplePoint#:1,
            center: Vec3#40e2c712{x#08f7c2ac#0: 0.25, y#08f7c2ac#1: 0.0, z#40e2c712#0: -1.0},
            radius: 0.5,
        ),
        sphereSDF#386fd2b7(
            samplePoint#:1,
            center: Vec3#40e2c712{x#08f7c2ac#0: -0.5, y#08f7c2ac#1: 0.0, z#40e2c712#0: -1.0},
            radius: 0.5,
        ),
    );
    unionSDF#5ee91162(
        distA: differenceSDF#fdad0384(
            distA: circles#:10,
            distB: max#831cd664(v: abs#3e9c70b8(v: cubePoint#:4) -#ab6a3504#3d436b7e#1 cubeSize#:8),
        ),
        distB: max#831cd664(v: abs#3e9c70b8(v: cubePoint#:4) -#ab6a3504#3d436b7e#1 innerCubeSize#:9),
    );
}
(iTime#:0: float, samplePoint#:1: Vec3#🕍🤲😍😃): float => {
    const cubePoint#:4: Vec3#🕍🤲😍😃 = xyz#💗🌖🕍(
        MatByVector#☹️🥗🏌️‍♂️.#Mul#👫🏭😪#0(
            rotateY#👨‍👧‍👧🐲🎎(iTime#:0 / PI),
            Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: _#:0},
        ),
    );
    const size#:5: float = sin(iTime#:0) * 0.2 + 0.4;
    const cosize#:6: float = cos(iTime#:0) * 0.2 + 0.4;
    return unionSDF#🧝🐬🦍😃(
        differenceSDF#🕘(
            min(
                sphereSDF#🍥🧿🕙(
                    samplePoint#:1,
                    Vec3#🕍🤲😍😃{TODO SPREADs}{z: -1, x: 0.25, y: 0},
                    0.5,
                ),
                sphereSDF#🍥🧿🕙(
                    samplePoint#:1,
                    Vec3#🕍🤲😍😃{TODO SPREADs}{z: -1, x: -0.5, y: 0},
                    0.5,
                ),
            ),
            max#🌴(
                AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#1(
                    abs#🦾🌆🎣(cubePoint#:4),
                    Vec3#🕍🤲😍😃{TODO SPREADs}{z: size#:5, x: size#:5, y: cosize#:6},
                ),
            ),
        ),
        max#🌴(
            AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#1(
                abs#🦾🌆🎣(cubePoint#:4),
                Vec3#🕍🤲😍😃{TODO SPREADs}{z: size#:5 * 0.6, x: size#:5 * 0.6, y: cosize#:6 * 0.6},
            ),
        ),
    );
}
```
*/
export const hash_3ae94934: (arg_0: number, arg_1: t_40e2c712) => number = (iTime: number, samplePoint$1: t_40e2c712) => {
  let cubePoint: t_40e2c712 = hash_312e3c78(hash_197a9c42.h02cc25c4_0(hash_3c48f9e2(iTime / PI), ({ ...hash_ab6a3504.h3d436b7e_1(samplePoint$1, ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: -1
    } as t_40e2c712)),
    type: "Vec4",
    w: 1
  } as t_51a53bbe)));
  let size: number = sin(iTime) * 0.2 + 0.4;
  let cosize: number = cos(iTime) * 0.2 + 0.4;
  return hash_5ee91162(hash_fdad0384(min(hash_386fd2b7(samplePoint$1, ({
    type: "Vec3",
    x: 0.25,
    y: 0,
    z: -1
  } as t_40e2c712), 0.5), hash_386fd2b7(samplePoint$1, ({
    type: "Vec3",
    x: -0.5,
    y: 0,
    z: -1
  } as t_40e2c712), 0.5)), hash_831cd664(hash_ab6a3504.h3d436b7e_1(hash_3e9c70b8(cubePoint), ({
    type: "Vec3",
    x: size,
    y: cosize,
    z: size
  } as t_40e2c712)))), hash_831cd664(hash_ab6a3504.h3d436b7e_1(hash_3e9c70b8(cubePoint), ({
    type: "Vec3",
    x: size * 0.6,
    y: cosize * 0.6,
    z: size * 0.6
  } as t_40e2c712))));
};

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
const MulVec3#d7070b2e = Mul#02cc25c4<Vec3#40e2c712, Vec3#40e2c712, Vec3#40e2c712>{
    "*"#02cc25c4#0: (one#:0: Vec3#40e2c712, two#:1: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 *#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 *#builtin two#:1.y#08f7c2ac#1,
        z#40e2c712#0: one#:0.z#40e2c712#0 *#builtin two#:1.z#40e2c712#0,
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (one#:0: Vec3#🕍🤲😍😃, two#:1: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: one#:0.#Vec3#🕍🤲😍😃#0 * two#:1.#Vec3#🕍🤲😍😃#0,
        x: one#:0.#Vec2#🍱🐶💣#0 * two#:1.#Vec2#🍱🐶💣#0,
        y: one#:0.#Vec2#🍱🐶💣#1 * two#:1.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_d7070b2e: t_02cc25c4<t_40e2c712, t_40e2c712, t_40e2c712> = ({
  type: "02cc25c4",
  h02cc25c4_0: (one: t_40e2c712, two: t_40e2c712) => ({
    type: "Vec3",
    x: one.x * two.x,
    y: one.y * two.y,
    z: one.z * two.z
  } as t_40e2c712)
} as t_02cc25c4<t_40e2c712, t_40e2c712, t_40e2c712>);

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
const reflect#7a94d310 = (I#:0: Vec3#40e2c712, N#:1: Vec3#40e2c712): Vec3#40e2c712 ={}> {
    I#:0 
        -#ab6a3504#3d436b7e#1 2.0 *#builtin dot#35634032(a: N#:1, b: I#:0) 
            *#47332321#02cc25c4#0 N#:1;
}
(I#:0: Vec3#🕍🤲😍😃, N#:1: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#1(
    I#:0,
    ScaleVec3#🎡👦💋😃.#Mul#👫🏭😪#0(2 * dot#🤢👨‍🦳🛶(N#:1, I#:0), N#:1),
)
```
*/
export const hash_7a94d310: (arg_0: t_40e2c712, arg_1: t_40e2c712) => t_40e2c712 = (I: t_40e2c712, N: t_40e2c712) => hash_ab6a3504.h3d436b7e_1(I, hash_47332321.h02cc25c4_0(2 * hash_35634032(N, I), N));

/**
```
const estimateNormal#31dce8c8 = (iTime#:0: float#builtin, p#:1: Vec3#40e2c712): Vec3#40e2c712 ={}> normalize#8aeba40a(
    v: Vec3#40e2c712{
        x#08f7c2ac#0: sceneSDF#3ae94934(
                iTime#:0,
                samplePoint: Vec3#40e2c712{
                    ...p#:1,
                    x#08f7c2ac#0: p#:1.x#08f7c2ac#0 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#3ae94934(
                iTime#:0,
                samplePoint: Vec3#40e2c712{
                    ...p#:1,
                    x#08f7c2ac#0: p#:1.x#08f7c2ac#0 -#builtin EPSILON#17261aaa,
                },
            ),
        y#08f7c2ac#1: sceneSDF#3ae94934(
                iTime#:0,
                samplePoint: Vec3#40e2c712{
                    ...p#:1,
                    y#08f7c2ac#1: p#:1.y#08f7c2ac#1 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#3ae94934(
                iTime#:0,
                samplePoint: Vec3#40e2c712{
                    ...p#:1,
                    y#08f7c2ac#1: p#:1.y#08f7c2ac#1 -#builtin EPSILON#17261aaa,
                },
            ),
        z#40e2c712#0: sceneSDF#3ae94934(
                iTime#:0,
                samplePoint: Vec3#40e2c712{
                    ...p#:1,
                    z#40e2c712#0: p#:1.z#40e2c712#0 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#3ae94934(
                iTime#:0,
                samplePoint: Vec3#40e2c712{
                    ...p#:1,
                    z#40e2c712#0: p#:1.z#40e2c712#0 -#builtin EPSILON#17261aaa,
                },
            ),
    },
)
(iTime#:0: float, p#:1: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => normalize#😉(
    Vec3#🕍🤲😍😃{TODO SPREADs}{
        z: sceneSDF#💂🕷️☂️(
            iTime#:0,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: p#:1.#Vec3#🕍🤲😍😃#0 + EPSILON#🧂💃🚶‍♂️,
                x: _#:0,
                y: _#:0,
            },
        ) - sceneSDF#💂🕷️☂️(
            iTime#:0,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: p#:1.#Vec3#🕍🤲😍😃#0 - EPSILON#🧂💃🚶‍♂️,
                x: _#:0,
                y: _#:0,
            },
        ),
        x: sceneSDF#💂🕷️☂️(
            iTime#:0,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: _#:0,
                x: p#:1.#Vec2#🍱🐶💣#0 + EPSILON#🧂💃🚶‍♂️,
                y: _#:0,
            },
        ) - sceneSDF#💂🕷️☂️(
            iTime#:0,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: _#:0,
                x: p#:1.#Vec2#🍱🐶💣#0 - EPSILON#🧂💃🚶‍♂️,
                y: _#:0,
            },
        ),
        y: sceneSDF#💂🕷️☂️(
            iTime#:0,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:1.#Vec2#🍱🐶💣#1 + EPSILON#🧂💃🚶‍♂️,
            },
        ) - sceneSDF#💂🕷️☂️(
            iTime#:0,
            Vec3#🕍🤲😍😃{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:1.#Vec2#🍱🐶💣#1 - EPSILON#🧂💃🚶‍♂️,
            },
        ),
    },
)
```
*/
export const hash_31dce8c8: (arg_0: number, arg_1: t_40e2c712) => t_40e2c712 = (iTime: number, p: t_40e2c712) => hash_8aeba40a(({
  type: "Vec3",
  x: hash_3ae94934(iTime, ({ ...p,
    type: "Vec3",
    x: p.x + hash_17261aaa
  } as t_40e2c712)) - hash_3ae94934(iTime, ({ ...p,
    type: "Vec3",
    x: p.x - hash_17261aaa
  } as t_40e2c712)),
  y: hash_3ae94934(iTime, ({ ...p,
    type: "Vec3",
    y: p.y + hash_17261aaa
  } as t_40e2c712)) - hash_3ae94934(iTime, ({ ...p,
    type: "Vec3",
    y: p.y - hash_17261aaa
  } as t_40e2c712)),
  z: hash_3ae94934(iTime, ({ ...p,
    type: "Vec3",
    z: p.z + hash_17261aaa
  } as t_40e2c712)) - hash_3ae94934(iTime, ({ ...p,
    type: "Vec3",
    z: p.z - hash_17261aaa
  } as t_40e2c712))
} as t_40e2c712));

/**
```
const phongContribForLight#674a291c = (
    iTime#:0: float#builtin,
    k_d#:1: Vec3#40e2c712,
    k_s#:2: Vec3#40e2c712,
    alpha#:3: float#builtin,
    p#:4: Vec3#40e2c712,
    eye#:5: Vec3#40e2c712,
    lightPos#:6: Vec3#40e2c712,
    lightIntensity#:7: Vec3#40e2c712,
): Vec3#40e2c712 ={}> {
    const N#:8 = estimateNormal#31dce8c8(iTime#:0, p#:4);
    const L#:9 = normalize#8aeba40a(v: lightPos#:6 -#ab6a3504#3d436b7e#1 p#:4);
    const V#:10 = normalize#8aeba40a(v: eye#:5 -#ab6a3504#3d436b7e#1 p#:4);
    const R#:11 = normalize#8aeba40a(
        v: reflect#7a94d310(I: NegVec3#23a08bf5."-"#616f559e#0(L#:9), N#:8),
    );
    const dotLN#:12 = dot#35634032(a: L#:9, b: N#:8);
    const dotRV#:13 = dot#35634032(a: R#:11, b: V#:10);
    if dotLN#:12 <#builtin 0.0 {
        Vec3#40e2c712{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#40e2c712#0: 0.0};
    } else if dotRV#:13 <#builtin 0.0 {
        const m#:14 = k_d#:1 *#93ca49f4#02cc25c4#0 dotLN#:12;
        lightIntensity#:7 *#d7070b2e#02cc25c4#0 m#:14;
    } else {
        const m#:15 = k_d#:1 *#93ca49f4#02cc25c4#0 dotLN#:12 
            +#ab6a3504#3d436b7e#0 k_s#:2 *#93ca49f4#02cc25c4#0 pow#builtin(dotRV#:13, alpha#:3);
        lightIntensity#:7 *#d7070b2e#02cc25c4#0 m#:15;
    };
}
(
    iTime#:0: float,
    k_d#:1: Vec3#🕍🤲😍😃,
    k_s#:2: Vec3#🕍🤲😍😃,
    alpha#:3: float,
    p#:4: Vec3#🕍🤲😍😃,
    eye#:5: Vec3#🕍🤲😍😃,
    lightPos#:6: Vec3#🕍🤲😍😃,
    lightIntensity#:7: Vec3#🕍🤲😍😃,
): Vec3#🕍🤲😍😃 => {
    const N#:8: Vec3#🕍🤲😍😃 = estimateNormal#👦🚖🌇(iTime#:0, p#:4);
    const L#:9: Vec3#🕍🤲😍😃 = normalize#😉(AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#1(lightPos#:6, p#:4));
    const dotLN#:12: float = dot#🤢👨‍🦳🛶(L#:9, N#:8);
    const dotRV#:13: float = dot#🤢👨‍🦳🛶(
        normalize#😉(reflect#🕌💂🌫️😃(NegVec3#🎮😐🐊.#Neg#🚣‍♀️⚾🐭😃#0(L#:9), N#:8)),
        normalize#😉(AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#1(eye#:5, p#:4)),
    );
    if dotLN#:12 < 0 {
        return Vec3#🕍🤲😍😃{TODO SPREADs}{z: 0, x: 0, y: 0};
    } else {
        if dotRV#:13 < 0 {
            return MulVec3#🚝.#Mul#👫🏭😪#0(
                lightIntensity#:7,
                ScaleVec3_#🐩.#Mul#👫🏭😪#0(k_d#:1, dotLN#:12),
            );
        } else {
            return MulVec3#🚝.#Mul#👫🏭😪#0(
                lightIntensity#:7,
                AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#0(
                    ScaleVec3_#🐩.#Mul#👫🏭😪#0(k_d#:1, dotLN#:12),
                    ScaleVec3_#🐩.#Mul#👫🏭😪#0(k_s#:2, pow(dotRV#:13, alpha#:3)),
                ),
            );
        };
    };
}
```
*/
export const hash_674a291c: (arg_0: number, arg_1: t_40e2c712, arg_2: t_40e2c712, arg_3: number, arg_4: t_40e2c712, arg_5: t_40e2c712, arg_6: t_40e2c712, arg_7: t_40e2c712) => t_40e2c712 = (iTime: number, k_d: t_40e2c712, k_s: t_40e2c712, alpha: number, p$4: t_40e2c712, eye: t_40e2c712, lightPos: t_40e2c712, lightIntensity: t_40e2c712) => {
  let N$8: t_40e2c712 = hash_31dce8c8(iTime, p$4);
  let L: t_40e2c712 = hash_8aeba40a(hash_ab6a3504.h3d436b7e_1(lightPos, p$4));
  let dotLN: number = hash_35634032(L, N$8);
  let dotRV: number = hash_35634032(hash_8aeba40a(hash_7a94d310(hash_23a08bf5.h616f559e_0(L), N$8)), hash_8aeba40a(hash_ab6a3504.h3d436b7e_1(eye, p$4)));

  if (dotLN < 0) {
    return ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: 0
    } as t_40e2c712);
  } else {
    if (dotRV < 0) {
      return hash_d7070b2e.h02cc25c4_0(lightIntensity, hash_93ca49f4.h02cc25c4_0(k_d, dotLN));
    } else {
      return hash_d7070b2e.h02cc25c4_0(lightIntensity, hash_ab6a3504.h3d436b7e_0(hash_93ca49f4.h02cc25c4_0(k_d, dotLN), hash_93ca49f4.h02cc25c4_0(k_s, pow(dotRV, alpha))));
    }
  }
};

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
const phongIllumination#539433eb = (
    iTime#:0: float#builtin,
    k_a#:1: Vec3#40e2c712,
    k_d#:2: Vec3#40e2c712,
    k_s#:3: Vec3#40e2c712,
    alpha#:4: float#builtin,
    p#:5: Vec3#40e2c712,
    eye#:6: Vec3#40e2c712,
): Vec3#40e2c712 ={}> {
    const ambientLight#:7 = 0.5 
        *#47332321#02cc25c4#0 Vec3#40e2c712{
            x#08f7c2ac#0: 1.0,
            y#08f7c2ac#1: 1.0,
            z#40e2c712#0: 1.0,
        };
    const color#:8 = ambientLight#:7 *#d7070b2e#02cc25c4#0 k_a#:1;
    const light1Pos#:9 = Vec3#40e2c712{
        x#08f7c2ac#0: 4.0 *#builtin sin#builtin(iTime#:0),
        y#08f7c2ac#1: 2.0,
        z#40e2c712#0: 4.0 *#builtin cos#builtin(iTime#:0),
    };
    const light1Intensity#:10 = Vec3#40e2c712{
        x#08f7c2ac#0: 0.4,
        y#08f7c2ac#1: 0.4,
        z#40e2c712#0: 0.4,
    };
    const color#:11 = color#:8 
        +#ab6a3504#3d436b7e#0 phongContribForLight#674a291c(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            lightPos: light1Pos#:9,
            lightIntensity: light1Intensity#:10,
        );
    const light2Pos#:12 = Vec3#40e2c712{
        x#08f7c2ac#0: 2.0 *#builtin sin#builtin(0.37 *#builtin iTime#:0),
        y#08f7c2ac#1: 2.0 *#builtin cos#builtin(0.37 *#builtin iTime#:0),
        z#40e2c712#0: 2.0,
    };
    const light2Intensity#:13 = Vec3#40e2c712{
        x#08f7c2ac#0: 0.4,
        y#08f7c2ac#1: 0.4,
        z#40e2c712#0: 0.4,
    };
    const color#:14 = color#:11 
        +#ab6a3504#3d436b7e#0 phongContribForLight#674a291c(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            lightPos: light2Pos#:12,
            lightIntensity: light2Intensity#:13,
        );
    color#:14;
}
(
    iTime#:0: float,
    k_a#:1: Vec3#🕍🤲😍😃,
    k_d#:2: Vec3#🕍🤲😍😃,
    k_s#:3: Vec3#🕍🤲😍😃,
    alpha#:4: float,
    p#:5: Vec3#🕍🤲😍😃,
    eye#:6: Vec3#🕍🤲😍😃,
): Vec3#🕍🤲😍😃 => AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#0(
    AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#0(
        MulVec3#🚝.#Mul#👫🏭😪#0(
            ScaleVec3#🎡👦💋😃.#Mul#👫🏭😪#0(0.5, Vec3#🕍🤲😍😃{TODO SPREADs}{z: 1, x: 1, y: 1}),
            k_a#:1,
        ),
        phongContribForLight#🧑‍💻🥜🥭😃(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            Vec3#🕍🤲😍😃{TODO SPREADs}{z: 4 * cos(iTime#:0), x: 4 * sin(iTime#:0), y: 2},
            Vec3#🕍🤲😍😃{TODO SPREADs}{z: 0.4, x: 0.4, y: 0.4},
        ),
    ),
    phongContribForLight#🧑‍💻🥜🥭😃(
        iTime#:0,
        k_d#:2,
        k_s#:3,
        alpha#:4,
        p#:5,
        eye#:6,
        Vec3#🕍🤲😍😃{TODO SPREADs}{z: 2, x: 2 * sin(0.37 * iTime#:0), y: 2 * cos(0.37 * iTime#:0)},
        Vec3#🕍🤲😍😃{TODO SPREADs}{z: 0.4, x: 0.4, y: 0.4},
    ),
)
```
*/
export const hash_539433eb: (arg_0: number, arg_1: t_40e2c712, arg_2: t_40e2c712, arg_3: t_40e2c712, arg_4: number, arg_5: t_40e2c712, arg_6: t_40e2c712) => t_40e2c712 = (iTime: number, k_a: t_40e2c712, k_d$2: t_40e2c712, k_s$3: t_40e2c712, alpha$4: number, p$5: t_40e2c712, eye$6: t_40e2c712) => hash_ab6a3504.h3d436b7e_0(hash_ab6a3504.h3d436b7e_0(hash_d7070b2e.h02cc25c4_0(hash_47332321.h02cc25c4_0(0.5, ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_40e2c712)), k_a), hash_674a291c(iTime, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 4 * sin(iTime),
  y: 2,
  z: 4 * cos(iTime)
} as t_40e2c712), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_40e2c712))), hash_674a291c(iTime, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 2 * sin(0.37 * iTime),
  y: 2 * cos(0.37 * iTime),
  z: 2
} as t_40e2c712), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_40e2c712)));

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
const rec shortestDistanceToSurface#56acb01a = (
    iTime#:0: float#builtin,
    eye#:1: Vec3#40e2c712,
    marchingDirection#:2: Vec3#40e2c712,
    start#:3: float#builtin,
    end#:4: float#builtin,
    stepsLeft#:5: int#builtin,
): float#builtin ={}> {
    const dist#:6 = sceneSDF#3ae94934(
        iTime#:0,
        samplePoint: eye#:1 
            +#ab6a3504#3d436b7e#0 start#:3 *#47332321#02cc25c4#0 marchingDirection#:2,
    );
    if dist#:6 <#builtin EPSILON#17261aaa {
        start#:3;
    } else {
        const depth#:7 = start#:3 +#builtin dist#:6;
        if depth#:7 >=#builtin end#:4 ||#builtin stepsLeft#:5 <=#builtin 0 {
            end#:4;
        } else {
            56acb01a#self(
                iTime#:0,
                eye#:1,
                marchingDirection#:2,
                depth#:7,
                end#:4,
                stepsLeft#:5 -#builtin 1,
            );
        };
    };
}
(
    iTime#:0: float,
    eye#:1: Vec3#🕍🤲😍😃,
    marchingDirection#:2: Vec3#🕍🤲😍😃,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
): float => {
    loop(unbounded) {
        const dist#:6: float = sceneSDF#💂🕷️☂️(
            iTime#:0,
            AddSubVec3#🧑‍🏫.#AddSub#🕕🧑‍🦲⚽#0(
                eye#:1,
                ScaleVec3#🎡👦💋😃.#Mul#👫🏭😪#0(start#:3, marchingDirection#:2),
            ),
        );
        if dist#:6 < EPSILON#🧂💃🚶‍♂️ {
            return start#:3;
        } else {
            const depth#:7: float = start#:3 + dist#:6;
            if depth#:7 >= end#:4 || stepsLeft#:5 <= 0 {
                return end#:4;
            } else {
                start#:3 = depth#:7;
                stepsLeft#:5 = stepsLeft#:5 - 1;
                continue;
            };
        };
    };
}
```
*/
export const hash_56acb01a: (arg_0: number, arg_1: t_40e2c712, arg_2: t_40e2c712, arg_3: number, arg_4: number, arg_5: number) => number = (iTime: number, eye$1: t_40e2c712, marchingDirection: t_40e2c712, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = hash_3ae94934(iTime, hash_ab6a3504.h3d436b7e_0(eye$1, hash_47332321.h02cc25c4_0(start, marchingDirection)));

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
export const hash_4bc41cc8: (arg_0: number, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac) => t_40e2c712 = (fieldOfView: number, size$1: t_08f7c2ac, fragCoord: t_08f7c2ac) => hash_8aeba40a(hash_4be2bbc8(hash_04f14e9c.h3d436b7e_1(fragCoord, hash_02622a76.h3b763160_0(size$1, 2)), -(size$1.y / tan(hash_dabe7f9c(fieldOfView) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
255
```
*/
export const hash_62404440: number = 255;

/**
```
const mainImage#3db5597e = (env#:0: GLSLEnv#88074884, fragCoord#:1: Vec2#08f7c2ac): Vec4#51a53bbe ={}> {
    const dir#:2 = rayDirection#4bc41cc8(
        fieldOfView: 45.0,
        size: env#:0.resolution#88074884#1,
        fragCoord#:1,
    );
    const eye#:3 = Vec3#40e2c712{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#40e2c712#0: 5.0};
    const dist#:4 = shortestDistanceToSurface#56acb01a(
        iTime: env#:0.time#88074884#0,
        eye#:3,
        marchingDirection: dir#:2,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    if dist#:4 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#17261aaa {
        Vec4#51a53bbe{
            z#40e2c712#0: 1.0,
            x#08f7c2ac#0: 1.0,
            y#08f7c2ac#1: 1.0,
            w#51a53bbe#0: 1.0,
        };
    } else {
        const p#:5 = eye#:3 +#ab6a3504#3d436b7e#0 dist#:4 *#47332321#02cc25c4#0 dir#:2;
        const K_a#:6 = Vec3#40e2c712{x#08f7c2ac#0: 0.9, y#08f7c2ac#1: 0.2, z#40e2c712#0: 0.3};
        const K_d#:7 = Vec3#40e2c712{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.2, z#40e2c712#0: 0.7};
        const K_s#:8 = Vec3#40e2c712{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#40e2c712#0: 1.0};
        const shininess#:9 = 10.0;
        const color#:10 = phongIllumination#539433eb(
            iTime: env#:0.time#88074884#0,
            k_a: K_a#:6,
            k_d: K_d#:7,
            k_s: K_s#:8,
            alpha: shininess#:9,
            p#:5,
            eye#:3,
        );
        Vec4#51a53bbe{...color#:10, w#51a53bbe#0: 1.0};
    };
}
(env#:0: GLSLEnv#💜, fragCoord#:1: Vec2#🍱🐶💣): Vec4#✨🤶👨‍🔬😃 => {
    const dir#:2: Vec3#🕍🤲😍😃 = rayDirection#👦🧑‍⚖️👂😃(45, env#:0.#GLSLEnv#💜#1, fragCoord#:1);
    const eye#:3: Vec3#🕍🤲😍😃 = Vec3#🕍🤲😍😃{TODO SPREADs}{z: 5, x: 0, y: 0};
    const dist#:4: float = shortestDistanceToSurface#😝🚉🧟‍♀️😃(
        env#:0.#GLSLEnv#💜#0,
        eye#:3,
        dir#:2,
        MIN_DIST#🤾‍♂️,
        MAX_DIST#🥅👬👨‍🦰,
        MAX_MARCHING_STEPS#😟😗🦦😃,
    );
    if dist#:4 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧂💃🚶‍♂️ {
        return Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: 1};
    } else {
        return Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: _#:0};
    };
}
```
*/
export const hash_3db5597e: (arg_0: t_88074884, arg_1: t_08f7c2ac) => t_51a53bbe = (env: t_88074884, fragCoord$1: t_08f7c2ac) => {
  let dir: t_40e2c712 = hash_4bc41cc8(45, env.resolution, fragCoord$1);
  let eye$3: t_40e2c712 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_40e2c712);
  let dist$4: number = hash_56acb01a(env.time, eye$3, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$4 > hash_0ce717e6 - hash_17261aaa) {
    return ({
      type: "Vec4",
      z: 1,
      x: 1,
      y: 1,
      w: 1
    } as t_51a53bbe);
  } else {
    return ({ ...hash_539433eb(env.time, ({
        type: "Vec3",
        x: 0.9,
        y: 0.2,
        z: 0.3
      } as t_40e2c712), ({
        type: "Vec3",
        x: 0,
        y: 0.2,
        z: 0.7
      } as t_40e2c712), ({
        type: "Vec3",
        x: 1,
        y: 1,
        z: 1
      } as t_40e2c712), 10, hash_ab6a3504.h3d436b7e_0(eye$3, hash_47332321.h02cc25c4_0(dist$4, dir)), eye$3),
      type: "Vec4",
      w: 1
    } as t_51a53bbe);
  }
};

/*
2.0 *#47332321#02cc25c4#0 Vec3#40e2c712{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 2.0, z#40e2c712#0: 3.0}
ScaleVec3#🎡👦💋😃.#Mul#👫🏭😪#0(2, Vec3#🕍🤲😍😃{TODO SPREADs}{z: 3, x: 1, y: 2})
*/
hash_47332321.h02cc25c4_0(2, ({
  type: "Vec3",
  x: 1,
  y: 2,
  z: 3
} as t_40e2c712));

/*
estimateNormal#31dce8c8
estimateNormal#👦🚖🌇
*/
hash_31dce8c8;
export const mainImage = hash_3db5597e;