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
const distance#99709002 = (one#:0: Vec3#1b597af1, two#:1: Vec3#1b597af1): float#builtin ={}> length#78bdad43(
    v: two#:1 -#3de90345#70e0d6d0#1 one#:0,
)
(one#:0: Vec3#🗻🌻🤽‍♂️, two#:1: Vec3#🗻🌻🤽‍♂️): float => length#🤵‍♀️⌛🌒😃(
    AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(two#:1, one#:0),
)
```
*/
export const hash_99709002: (arg_0: t_1b597af1, arg_1: t_1b597af1) => number = (one: t_1b597af1, two: t_1b597af1) => hash_78bdad43(hash_3de90345.h70e0d6d0_1(two, one));

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
const max#199da620 = (v#:0: Vec3#1b597af1): float#builtin ={}> {
    max#builtin(max#builtin(v#:0.x#78566d10#0, v#:0.y#78566d10#1), v#:0.z#1b597af1#0);
}
(v#:0: Vec3#🗻🌻🤽‍♂️): float => max(
    max(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0, v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1),
    v#:0.#Vec3#🗻🌻🤽‍♂️#0,
)
```
*/
export const hash_199da620: (arg_0: t_1b597af1) => number = (v: t_1b597af1) => max(max(v.x, v.y), v.z);

/**
```
const differenceSDF#84f0a95c = (distA#:0: float#builtin, distB#:1: float#builtin): float#builtin ={}> {
    max#builtin(distA#:0, -distB#:1);
}
(distA#:0: float, distB#:1: float): float => max(distA#:0, -distB#:1)
```
*/
export const hash_84f0a95c: (arg_0: number, arg_1: number) => number = (distA: number, distB: number) => max(distA, -distB);

/**
```
const unionSDF#62012b8a = (distA#:0: float#builtin, distB#:1: float#builtin): float#builtin ={}> {
    min#builtin(distA#:0, distB#:1);
}
(distA#:0: float, distB#:1: float): float => min(distA#:0, distB#:1)
```
*/
export const hash_62012b8a: (arg_0: number, arg_1: number) => number = (distA: number, distB: number) => min(distA, distB);

/**
```
const sphereSDF#29a4e09c = (
    samplePoint#:0: Vec3#1b597af1,
    center#:1: Vec3#1b597af1,
    radius#:2: float#builtin,
): float#builtin ={}> distance#99709002(one: samplePoint#:0, two: center#:1) -#builtin radius#:2
(samplePoint#:0: Vec3#🗻🌻🤽‍♂️, center#:1: Vec3#🗻🌻🤽‍♂️, radius#:2: float): float => distance#😄(
    samplePoint#:0,
    center#:1,
) - radius#:2
```
*/
export const hash_29a4e09c: (arg_0: t_1b597af1, arg_1: t_1b597af1, arg_2: number) => number = (samplePoint: t_1b597af1, center: t_1b597af1, radius: number) => hash_99709002(samplePoint, center) - radius;

/**
```
const rotateY#17654b4e = (theta#:0: float#builtin): Mat4#314455dc ={}> {
    const c#:1 = cos#builtin(theta#:0);
    const s#:2 = sin#builtin(theta#:0);
    Mat4#314455dc{
        r1#314455dc#0: vec4#1eaae93f(x: c#:1, y: 0.0, z: s#:2, w: 0.0),
        r2#314455dc#1: vec4#1eaae93f(x: c#:1, y: 1.0, z: c#:1, w: 0.0),
        r3#314455dc#2: vec4#1eaae93f(x: -s#:2, y: 0.0, z: c#:1, w: 0.0),
        r4#314455dc#3: vec4#1eaae93f(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(theta#:0: float): Mat4#👩‍👩‍👦‍👦👩‍🏭🕋 => {
    const c#:1: float = cos(theta#:0);
    const s#:2: float = sin(theta#:0);
    return Mat4#👩‍👩‍👦‍👦👩‍🏭🕋{TODO SPREADs}{
        r1: vec4#👲🥟👥(c#:1, 0, s#:2, 0),
        r2: vec4#👲🥟👥(c#:1, 1, c#:1, 0),
        r3: vec4#👲🥟👥(-s#:2, 0, c#:1, 0),
        r4: vec4#👲🥟👥(0, 0, 0, 1),
    };
}
```
*/
export const hash_17654b4e: (arg_0: number) => t_314455dc = (theta: number) => {
  let c: number = cos(theta);
  let s: number = sin(theta);
  return ({
    type: "Mat4",
    r1: hash_1eaae93f(c, 0, s, 0),
    r2: hash_1eaae93f(c, 1, c, 0),
    r3: hash_1eaae93f(-s, 0, c, 0),
    r4: hash_1eaae93f(0, 0, 0, 1)
  } as t_314455dc);
};

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
const EPSILON#17261aaa = 0.0001
0.0001
```
*/
export const hash_17261aaa: number = 0.0001;

/**
```
const sceneSDF#0543e510 = (iTime#:0: float#builtin, samplePoint#:1: Vec3#1b597af1): float#builtin ={}> {
    const cubePoint#:2 = samplePoint#:1;
    const cubePoint#:3 = cubePoint#:2 
        -#3de90345#70e0d6d0#1 Vec3#1b597af1{
            x#78566d10#0: 0.0,
            y#78566d10#1: 0.0,
            z#1b597af1#0: -1.0,
        };
    const cubePoint#:4 = xyz#052cd680(
        v: rotateY#17654b4e(theta: iTime#:0 /#builtin PI#builtin) 
            *#5209b424#49fef1f5#0 Vec4#38dc9122{...cubePoint#:3, w#38dc9122#0: 1.0},
    );
    const size#:5 = sin#builtin(iTime#:0) *#builtin 0.2 +#builtin 0.4;
    const cosize#:6 = cos#builtin(iTime#:0) *#builtin 0.2 +#builtin 0.4;
    const offset#:7 = 0.6;
    const cubeSize#:8 = Vec3#1b597af1{
        x#78566d10#0: size#:5,
        y#78566d10#1: cosize#:6,
        z#1b597af1#0: size#:5,
    };
    const innerCubeSize#:9 = Vec3#1b597af1{
        x#78566d10#0: size#:5 *#builtin offset#:7,
        y#78566d10#1: cosize#:6 *#builtin offset#:7,
        z#1b597af1#0: size#:5 *#builtin offset#:7,
    };
    const circles#:10 = min#builtin(
        sphereSDF#29a4e09c(
            samplePoint#:1,
            center: Vec3#1b597af1{x#78566d10#0: 0.25, y#78566d10#1: 0.0, z#1b597af1#0: -1.0},
            radius: 0.5,
        ),
        sphereSDF#29a4e09c(
            samplePoint#:1,
            center: Vec3#1b597af1{x#78566d10#0: -0.5, y#78566d10#1: 0.0, z#1b597af1#0: -1.0},
            radius: 0.5,
        ),
    );
    unionSDF#62012b8a(
        distA: differenceSDF#84f0a95c(
            distA: circles#:10,
            distB: max#199da620(v: abs#99c811a0(v: cubePoint#:4) -#3de90345#70e0d6d0#1 cubeSize#:8),
        ),
        distB: max#199da620(v: abs#99c811a0(v: cubePoint#:4) -#3de90345#70e0d6d0#1 innerCubeSize#:9),
    );
}
(iTime#:0: float, samplePoint#:1: Vec3#🗻🌻🤽‍♂️): float => {
    const cubePoint#:4: Vec3#🗻🌻🤽‍♂️ = xyz#🥔🚑😞(
        MatByVector#😶🍇👨‍🎤😃.#Mul#🐺🎇🤟😃#0(
            rotateY#⛽🦸‍♀️🧍‍♀️(iTime#:0 / PI),
            Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0},
        ),
    );
    const size#:5: float = sin(iTime#:0) * 0.2 + 0.4;
    const cosize#:6: float = cos(iTime#:0) * 0.2 + 0.4;
    return unionSDF#🌑😨🐻‍❄️😃(
        differenceSDF#🧛(
            min(
                sphereSDF#🤏👷‍♂️🍕(
                    samplePoint#:1,
                    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: -1, x: 0.25, y: 0},
                    0.5,
                ),
                sphereSDF#🤏👷‍♂️🍕(
                    samplePoint#:1,
                    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: -1, x: -0.5, y: 0},
                    0.5,
                ),
            ),
            max#🐻‍❄️🛎️🏄(
                AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
                    abs#🏊‍♂️(cubePoint#:4),
                    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: size#:5, x: size#:5, y: cosize#:6},
                ),
            ),
        ),
        max#🐻‍❄️🛎️🏄(
            AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
                abs#🏊‍♂️(cubePoint#:4),
                Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: size#:5 * 0.6, x: size#:5 * 0.6, y: cosize#:6 * 0.6},
            ),
        ),
    );
}
```
*/
export const hash_0543e510: (arg_0: number, arg_1: t_1b597af1) => number = (iTime: number, samplePoint$1: t_1b597af1) => {
  let cubePoint: t_1b597af1 = hash_052cd680(hash_5209b424.h49fef1f5_0(hash_17654b4e(iTime / PI), ({ ...hash_3de90345.h70e0d6d0_1(samplePoint$1, ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: -1
    } as t_1b597af1)),
    type: "Vec4",
    w: 1
  } as t_38dc9122)));
  let size: number = sin(iTime) * 0.2 + 0.4;
  let cosize: number = cos(iTime) * 0.2 + 0.4;
  return hash_62012b8a(hash_84f0a95c(min(hash_29a4e09c(samplePoint$1, ({
    type: "Vec3",
    x: 0.25,
    y: 0,
    z: -1
  } as t_1b597af1), 0.5), hash_29a4e09c(samplePoint$1, ({
    type: "Vec3",
    x: -0.5,
    y: 0,
    z: -1
  } as t_1b597af1), 0.5)), hash_199da620(hash_3de90345.h70e0d6d0_1(hash_99c811a0(cubePoint), ({
    type: "Vec3",
    x: size,
    y: cosize,
    z: size
  } as t_1b597af1)))), hash_199da620(hash_3de90345.h70e0d6d0_1(hash_99c811a0(cubePoint), ({
    type: "Vec3",
    x: size * 0.6,
    y: cosize * 0.6,
    z: size * 0.6
  } as t_1b597af1))));
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
const MulVec3#89a11be4 = Mul#49fef1f5<Vec3#1b597af1, Vec3#1b597af1, Vec3#1b597af1>{
    "*"#49fef1f5#0: (one#:0: Vec3#1b597af1, two#:1: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
        x#78566d10#0: one#:0.x#78566d10#0 *#builtin two#:1.x#78566d10#0,
        y#78566d10#1: one#:0.y#78566d10#1 *#builtin two#:1.y#78566d10#1,
        z#1b597af1#0: one#:0.z#1b597af1#0 *#builtin two#:1.z#1b597af1#0,
    },
}
Mul#🐺🎇🤟😃{TODO SPREADs}{
    h49fef1f5_0: (one#:0: Vec3#🗻🌻🤽‍♂️, two#:1: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: one#:0.#Vec3#🗻🌻🤽‍♂️#0 * two#:1.#Vec3#🗻🌻🤽‍♂️#0,
        x: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
}
```
*/
export const hash_89a11be4: t_49fef1f5<t_1b597af1, t_1b597af1, t_1b597af1> = ({
  type: "49fef1f5",
  h49fef1f5_0: (one: t_1b597af1, two: t_1b597af1) => ({
    type: "Vec3",
    x: one.x * two.x,
    y: one.y * two.y,
    z: one.z * two.z
  } as t_1b597af1)
} as t_49fef1f5<t_1b597af1, t_1b597af1, t_1b597af1>);

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
const reflect#76a8c89b = (I#:0: Vec3#1b597af1, N#:1: Vec3#1b597af1): Vec3#1b597af1 ={}> {
    I#:0 
        -#3de90345#70e0d6d0#1 2.0 *#builtin dot#489fc39f(a: N#:1, b: I#:0) 
            *#11ee14c0#49fef1f5#0 N#:1;
}
(I#:0: Vec3#🗻🌻🤽‍♂️, N#:1: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
    I#:0,
    ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(2 * dot#☁️🪀💢😃(N#:1, I#:0), N#:1),
)
```
*/
export const hash_76a8c89b: (arg_0: t_1b597af1, arg_1: t_1b597af1) => t_1b597af1 = (I: t_1b597af1, N: t_1b597af1) => hash_3de90345.h70e0d6d0_1(I, hash_11ee14c0.h49fef1f5_0(2 * hash_489fc39f(N, I), N));

/**
```
const estimateNormal#564fd490 = (iTime#:0: float#builtin, p#:1: Vec3#1b597af1): Vec3#1b597af1 ={}> normalize#35d412d2(
    v: Vec3#1b597af1{
        x#78566d10#0: sceneSDF#0543e510(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    x#78566d10#0: p#:1.x#78566d10#0 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#0543e510(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    x#78566d10#0: p#:1.x#78566d10#0 -#builtin EPSILON#17261aaa,
                },
            ),
        y#78566d10#1: sceneSDF#0543e510(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    y#78566d10#1: p#:1.y#78566d10#1 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#0543e510(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    y#78566d10#1: p#:1.y#78566d10#1 -#builtin EPSILON#17261aaa,
                },
            ),
        z#1b597af1#0: sceneSDF#0543e510(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    z#1b597af1#0: p#:1.z#1b597af1#0 +#builtin EPSILON#17261aaa,
                },
            ) 
            -#builtin sceneSDF#0543e510(
                iTime#:0,
                samplePoint: Vec3#1b597af1{
                    ...p#:1,
                    z#1b597af1#0: p#:1.z#1b597af1#0 -#builtin EPSILON#17261aaa,
                },
            ),
    },
)
(iTime#:0: float, p#:1: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => normalize#☕🧑‍🏫🛩️(
    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: sceneSDF#🧑‍🔧🤦‍♂️😩(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: p#:1.#Vec3#🗻🌻🤽‍♂️#0 + EPSILON#🧂💃🚶‍♂️,
                x: _#:0,
                y: _#:0,
            },
        ) - sceneSDF#🧑‍🔧🤦‍♂️😩(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: p#:1.#Vec3#🗻🌻🤽‍♂️#0 - EPSILON#🧂💃🚶‍♂️,
                x: _#:0,
                y: _#:0,
            },
        ),
        x: sceneSDF#🧑‍🔧🤦‍♂️😩(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: p#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + EPSILON#🧂💃🚶‍♂️,
                y: _#:0,
            },
        ) - sceneSDF#🧑‍🔧🤦‍♂️😩(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: p#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - EPSILON#🧂💃🚶‍♂️,
                y: _#:0,
            },
        ),
        y: sceneSDF#🧑‍🔧🤦‍♂️😩(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + EPSILON#🧂💃🚶‍♂️,
            },
        ) - sceneSDF#🧑‍🔧🤦‍♂️😩(
            iTime#:0,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - EPSILON#🧂💃🚶‍♂️,
            },
        ),
    },
)
```
*/
export const hash_564fd490: (arg_0: number, arg_1: t_1b597af1) => t_1b597af1 = (iTime: number, p: t_1b597af1) => hash_35d412d2(({
  type: "Vec3",
  x: hash_0543e510(iTime, ({ ...p,
    type: "Vec3",
    x: p.x + hash_17261aaa
  } as t_1b597af1)) - hash_0543e510(iTime, ({ ...p,
    type: "Vec3",
    x: p.x - hash_17261aaa
  } as t_1b597af1)),
  y: hash_0543e510(iTime, ({ ...p,
    type: "Vec3",
    y: p.y + hash_17261aaa
  } as t_1b597af1)) - hash_0543e510(iTime, ({ ...p,
    type: "Vec3",
    y: p.y - hash_17261aaa
  } as t_1b597af1)),
  z: hash_0543e510(iTime, ({ ...p,
    type: "Vec3",
    z: p.z + hash_17261aaa
  } as t_1b597af1)) - hash_0543e510(iTime, ({ ...p,
    type: "Vec3",
    z: p.z - hash_17261aaa
  } as t_1b597af1))
} as t_1b597af1));

/**
```
const phongContribForLight#9e20b218 = (
    iTime#:0: float#builtin,
    k_d#:1: Vec3#1b597af1,
    k_s#:2: Vec3#1b597af1,
    alpha#:3: float#builtin,
    p#:4: Vec3#1b597af1,
    eye#:5: Vec3#1b597af1,
    lightPos#:6: Vec3#1b597af1,
    lightIntensity#:7: Vec3#1b597af1,
): Vec3#1b597af1 ={}> {
    const N#:8 = estimateNormal#564fd490(iTime#:0, p#:4);
    const L#:9 = normalize#35d412d2(v: lightPos#:6 -#3de90345#70e0d6d0#1 p#:4);
    const V#:10 = normalize#35d412d2(v: eye#:5 -#3de90345#70e0d6d0#1 p#:4);
    const R#:11 = normalize#35d412d2(
        v: reflect#76a8c89b(I: NegVec3#68c0a879."-"#f6e074a4#0(L#:9), N#:8),
    );
    const dotLN#:12 = dot#489fc39f(a: L#:9, b: N#:8);
    const dotRV#:13 = dot#489fc39f(a: R#:11, b: V#:10);
    if dotLN#:12 <#builtin 0.0 {
        Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.0, z#1b597af1#0: 0.0};
    } else if dotRV#:13 <#builtin 0.0 {
        const m#:14 = k_d#:1 *#a5e3bb34#49fef1f5#0 dotLN#:12;
        lightIntensity#:7 *#89a11be4#49fef1f5#0 m#:14;
    } else {
        const m#:15 = k_d#:1 *#a5e3bb34#49fef1f5#0 dotLN#:12 
            +#3de90345#70e0d6d0#0 k_s#:2 *#a5e3bb34#49fef1f5#0 pow#builtin(dotRV#:13, alpha#:3);
        lightIntensity#:7 *#89a11be4#49fef1f5#0 m#:15;
    };
}
(
    iTime#:0: float,
    k_d#:1: Vec3#🗻🌻🤽‍♂️,
    k_s#:2: Vec3#🗻🌻🤽‍♂️,
    alpha#:3: float,
    p#:4: Vec3#🗻🌻🤽‍♂️,
    eye#:5: Vec3#🗻🌻🤽‍♂️,
    lightPos#:6: Vec3#🗻🌻🤽‍♂️,
    lightIntensity#:7: Vec3#🗻🌻🤽‍♂️,
): Vec3#🗻🌻🤽‍♂️ => {
    const N#:8: Vec3#🗻🌻🤽‍♂️ = estimateNormal#💬🎮🧝‍♀️😃(iTime#:0, p#:4);
    const L#:9: Vec3#🗻🌻🤽‍♂️ = normalize#☕🧑‍🏫🛩️(
        AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(lightPos#:6, p#:4),
    );
    const dotLN#:12: float = dot#☁️🪀💢😃(L#:9, N#:8);
    const dotRV#:13: float = dot#☁️🪀💢😃(
        normalize#☕🧑‍🏫🛩️(reflect#👌🦅🧳😃(NegVec3#💓😌🍞😃.#Neg#👆#0(L#:9), N#:8)),
        normalize#☕🧑‍🏫🛩️(AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(eye#:5, p#:4)),
    );
    if dotLN#:12 < 0 {
        return Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 0, y: 0};
    } else {
        if dotRV#:13 < 0 {
            return MulVec3#🥊.#Mul#🐺🎇🤟😃#0(
                lightIntensity#:7,
                ScaleVec3_#🚐.#Mul#🐺🎇🤟😃#0(k_d#:1, dotLN#:12),
            );
        } else {
            return MulVec3#🥊.#Mul#🐺🎇🤟😃#0(
                lightIntensity#:7,
                AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
                    ScaleVec3_#🚐.#Mul#🐺🎇🤟😃#0(k_d#:1, dotLN#:12),
                    ScaleVec3_#🚐.#Mul#🐺🎇🤟😃#0(k_s#:2, pow(dotRV#:13, alpha#:3)),
                ),
            );
        };
    };
}
```
*/
export const hash_9e20b218: (arg_0: number, arg_1: t_1b597af1, arg_2: t_1b597af1, arg_3: number, arg_4: t_1b597af1, arg_5: t_1b597af1, arg_6: t_1b597af1, arg_7: t_1b597af1) => t_1b597af1 = (iTime: number, k_d: t_1b597af1, k_s: t_1b597af1, alpha: number, p$4: t_1b597af1, eye: t_1b597af1, lightPos: t_1b597af1, lightIntensity: t_1b597af1) => {
  let N$8: t_1b597af1 = hash_564fd490(iTime, p$4);
  let L: t_1b597af1 = hash_35d412d2(hash_3de90345.h70e0d6d0_1(lightPos, p$4));
  let dotLN: number = hash_489fc39f(L, N$8);
  let dotRV: number = hash_489fc39f(hash_35d412d2(hash_76a8c89b(hash_68c0a879.hf6e074a4_0(L), N$8)), hash_35d412d2(hash_3de90345.h70e0d6d0_1(eye, p$4)));

  if (dotLN < 0) {
    return ({
      type: "Vec3",
      x: 0,
      y: 0,
      z: 0
    } as t_1b597af1);
  } else {
    if (dotRV < 0) {
      return hash_89a11be4.h49fef1f5_0(lightIntensity, hash_a5e3bb34.h49fef1f5_0(k_d, dotLN));
    } else {
      return hash_89a11be4.h49fef1f5_0(lightIntensity, hash_3de90345.h70e0d6d0_0(hash_a5e3bb34.h49fef1f5_0(k_d, dotLN), hash_a5e3bb34.h49fef1f5_0(k_s, pow(dotRV, alpha))));
    }
  }
};

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
const phongIllumination#619bd72c = (
    iTime#:0: float#builtin,
    k_a#:1: Vec3#1b597af1,
    k_d#:2: Vec3#1b597af1,
    k_s#:3: Vec3#1b597af1,
    alpha#:4: float#builtin,
    p#:5: Vec3#1b597af1,
    eye#:6: Vec3#1b597af1,
): Vec3#1b597af1 ={}> {
    const ambientLight#:7 = 0.5 
        *#11ee14c0#49fef1f5#0 Vec3#1b597af1{
            x#78566d10#0: 1.0,
            y#78566d10#1: 1.0,
            z#1b597af1#0: 1.0,
        };
    const color#:8 = ambientLight#:7 *#89a11be4#49fef1f5#0 k_a#:1;
    const light1Pos#:9 = Vec3#1b597af1{
        x#78566d10#0: 4.0 *#builtin sin#builtin(iTime#:0),
        y#78566d10#1: 2.0,
        z#1b597af1#0: 4.0 *#builtin cos#builtin(iTime#:0),
    };
    const light1Intensity#:10 = Vec3#1b597af1{
        x#78566d10#0: 0.4,
        y#78566d10#1: 0.4,
        z#1b597af1#0: 0.4,
    };
    const color#:11 = color#:8 
        +#3de90345#70e0d6d0#0 phongContribForLight#9e20b218(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            lightPos: light1Pos#:9,
            lightIntensity: light1Intensity#:10,
        );
    const light2Pos#:12 = Vec3#1b597af1{
        x#78566d10#0: 2.0 *#builtin sin#builtin(0.37 *#builtin iTime#:0),
        y#78566d10#1: 2.0 *#builtin cos#builtin(0.37 *#builtin iTime#:0),
        z#1b597af1#0: 2.0,
    };
    const light2Intensity#:13 = Vec3#1b597af1{
        x#78566d10#0: 0.4,
        y#78566d10#1: 0.4,
        z#1b597af1#0: 0.4,
    };
    const color#:14 = color#:11 
        +#3de90345#70e0d6d0#0 phongContribForLight#9e20b218(
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
    k_a#:1: Vec3#🗻🌻🤽‍♂️,
    k_d#:2: Vec3#🗻🌻🤽‍♂️,
    k_s#:3: Vec3#🗻🌻🤽‍♂️,
    alpha#:4: float,
    p#:5: Vec3#🗻🌻🤽‍♂️,
    eye#:6: Vec3#🗻🌻🤽‍♂️,
): Vec3#🗻🌻🤽‍♂️ => AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
    AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
        MulVec3#🥊.#Mul#🐺🎇🤟😃#0(
            ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(0.5, Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 1, x: 1, y: 1}),
            k_a#:1,
        ),
        phongContribForLight#🐀(
            iTime#:0,
            k_d#:2,
            k_s#:3,
            alpha#:4,
            p#:5,
            eye#:6,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 4 * cos(iTime#:0), x: 4 * sin(iTime#:0), y: 2},
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0.4, x: 0.4, y: 0.4},
        ),
    ),
    phongContribForLight#🐀(
        iTime#:0,
        k_d#:2,
        k_s#:3,
        alpha#:4,
        p#:5,
        eye#:6,
        Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 2, x: 2 * sin(0.37 * iTime#:0), y: 2 * cos(0.37 * iTime#:0)},
        Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0.4, x: 0.4, y: 0.4},
    ),
)
```
*/
export const hash_619bd72c: (arg_0: number, arg_1: t_1b597af1, arg_2: t_1b597af1, arg_3: t_1b597af1, arg_4: number, arg_5: t_1b597af1, arg_6: t_1b597af1) => t_1b597af1 = (iTime: number, k_a: t_1b597af1, k_d$2: t_1b597af1, k_s$3: t_1b597af1, alpha$4: number, p$5: t_1b597af1, eye$6: t_1b597af1) => hash_3de90345.h70e0d6d0_0(hash_3de90345.h70e0d6d0_0(hash_89a11be4.h49fef1f5_0(hash_11ee14c0.h49fef1f5_0(0.5, ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_1b597af1)), k_a), hash_9e20b218(iTime, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 4 * sin(iTime),
  y: 2,
  z: 4 * cos(iTime)
} as t_1b597af1), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_1b597af1))), hash_9e20b218(iTime, k_d$2, k_s$3, alpha$4, p$5, eye$6, ({
  type: "Vec3",
  x: 2 * sin(0.37 * iTime),
  y: 2 * cos(0.37 * iTime),
  z: 2
} as t_1b597af1), ({
  type: "Vec3",
  x: 0.4,
  y: 0.4,
  z: 0.4
} as t_1b597af1)));

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
const rec shortestDistanceToSurface#54af2ae0 = (
    iTime#:0: float#builtin,
    eye#:1: Vec3#1b597af1,
    marchingDirection#:2: Vec3#1b597af1,
    start#:3: float#builtin,
    end#:4: float#builtin,
    stepsLeft#:5: int#builtin,
): float#builtin ={}> {
    const dist#:6 = sceneSDF#0543e510(
        iTime#:0,
        samplePoint: eye#:1 
            +#3de90345#70e0d6d0#0 start#:3 *#11ee14c0#49fef1f5#0 marchingDirection#:2,
    );
    if dist#:6 <#builtin EPSILON#17261aaa {
        start#:3;
    } else {
        const depth#:7 = start#:3 +#builtin dist#:6;
        if depth#:7 >=#builtin end#:4 ||#builtin stepsLeft#:5 <=#builtin 0 {
            end#:4;
        } else {
            54af2ae0#self(
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
    eye#:1: Vec3#🗻🌻🤽‍♂️,
    marchingDirection#:2: Vec3#🗻🌻🤽‍♂️,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
): float => {
    loop(unbounded) {
        const dist#:6: float = sceneSDF#🧑‍🔧🤦‍♂️😩(
            iTime#:0,
            AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
                eye#:1,
                ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(start#:3, marchingDirection#:2),
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
export const hash_54af2ae0: (arg_0: number, arg_1: t_1b597af1, arg_2: t_1b597af1, arg_3: number, arg_4: number, arg_5: number) => number = (iTime: number, eye$1: t_1b597af1, marchingDirection: t_1b597af1, start: number, end: number, stepsLeft: number) => {
  while (true) {
    let dist: number = hash_0543e510(iTime, hash_3de90345.h70e0d6d0_0(eye$1, hash_11ee14c0.h49fef1f5_0(start, marchingDirection)));

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
export const hash_4f8fc2b8: (arg_0: number, arg_1: t_78566d10, arg_2: t_78566d10) => t_1b597af1 = (fieldOfView: number, size$1: t_78566d10, fragCoord: t_78566d10) => hash_35d412d2(hash_1b424e12(hash_482bc839.h70e0d6d0_1(fragCoord, hash_72d6e294.h2b90cfd4_0(size$1, 2)), -(size$1.y / tan(hash_19bbb79c(fieldOfView) / 2))));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
255
```
*/
export const hash_62404440: number = 255;

/**
```
const mainImage#57af5452 = (env#:0: GLSLEnv#5cec7724, fragCoord#:1: Vec2#78566d10): Vec4#38dc9122 ={}> {
    const dir#:2 = rayDirection#4f8fc2b8(
        fieldOfView: 45.0,
        size: env#:0.resolution#5cec7724#1,
        fragCoord#:1,
    );
    const eye#:3 = Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.0, z#1b597af1#0: 5.0};
    const dist#:4 = shortestDistanceToSurface#54af2ae0(
        iTime: env#:0.time#5cec7724#0,
        eye#:3,
        marchingDirection: dir#:2,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    if dist#:4 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#17261aaa {
        Vec4#38dc9122{
            z#1b597af1#0: 1.0,
            x#78566d10#0: 1.0,
            y#78566d10#1: 1.0,
            w#38dc9122#0: 1.0,
        };
    } else {
        const p#:5 = eye#:3 +#3de90345#70e0d6d0#0 dist#:4 *#11ee14c0#49fef1f5#0 dir#:2;
        const K_a#:6 = Vec3#1b597af1{x#78566d10#0: 0.9, y#78566d10#1: 0.2, z#1b597af1#0: 0.3};
        const K_d#:7 = Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.2, z#1b597af1#0: 0.7};
        const K_s#:8 = Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: 1.0};
        const shininess#:9 = 10.0;
        const color#:10 = phongIllumination#619bd72c(
            iTime: env#:0.time#5cec7724#0,
            k_a: K_a#:6,
            k_d: K_d#:7,
            k_s: K_s#:8,
            alpha: shininess#:9,
            p#:5,
            eye#:3,
        );
        Vec4#38dc9122{...color#:10, w#38dc9122#0: 1.0};
    };
}
(env#:0: GLSLEnv#🎪🌇👪😃, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec4#🧑‍🎨🎪🌔 => {
    const dir#:2: Vec3#🗻🌻🤽‍♂️ = rayDirection#🥮🪀🤦😃(
        45,
        env#:0.#GLSLEnv#🎪🌇👪😃#1,
        fragCoord#:1,
    );
    const eye#:3: Vec3#🗻🌻🤽‍♂️ = Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 5, x: 0, y: 0};
    const dist#:4: float = shortestDistanceToSurface#🧊🎁👨‍🍼😃(
        env#:0.#GLSLEnv#🎪🌇👪😃#0,
        eye#:3,
        dir#:2,
        MIN_DIST#🤾‍♂️,
        MAX_DIST#🥅👬👨‍🦰,
        MAX_MARCHING_STEPS#😟😗🦦😃,
    );
    if dist#:4 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧂💃🚶‍♂️ {
        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: 1};
    } else {
        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
    };
}
```
*/
export const hash_57af5452: (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122 = (env: t_5cec7724, fragCoord$1: t_78566d10) => {
  let dir: t_1b597af1 = hash_4f8fc2b8(45, env.resolution, fragCoord$1);
  let eye$3: t_1b597af1 = ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 5
  } as t_1b597af1);
  let dist$4: number = hash_54af2ae0(env.time, eye$3, dir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$4 > hash_0ce717e6 - hash_17261aaa) {
    return ({
      type: "Vec4",
      z: 1,
      x: 1,
      y: 1,
      w: 1
    } as t_38dc9122);
  } else {
    return ({ ...hash_619bd72c(env.time, ({
        type: "Vec3",
        x: 0.9,
        y: 0.2,
        z: 0.3
      } as t_1b597af1), ({
        type: "Vec3",
        x: 0,
        y: 0.2,
        z: 0.7
      } as t_1b597af1), ({
        type: "Vec3",
        x: 1,
        y: 1,
        z: 1
      } as t_1b597af1), 10, hash_3de90345.h70e0d6d0_0(eye$3, hash_11ee14c0.h49fef1f5_0(dist$4, dir)), eye$3),
      type: "Vec4",
      w: 1
    } as t_38dc9122);
  }
};

/*
2.0 *#11ee14c0#49fef1f5#0 Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 2.0, z#1b597af1#0: 3.0}
ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(2, Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 3, x: 1, y: 2})
*/
hash_11ee14c0.h49fef1f5_0(2, ({
  type: "Vec3",
  x: 1,
  y: 2,
  z: 3
} as t_1b597af1));

/*
estimateNormal#564fd490
estimateNormal#💬🎮🧝‍♀️😃
*/
hash_564fd490;
export const mainImage = hash_57af5452;