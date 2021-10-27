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
@unique(0.5383562320075749) type Eq#2f333afa<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_2f333afa<T> = {
  type: "2f333afa";
  h2f333afa_0: (arg_0: T, arg_1: T) => boolean;
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
  h2b90cfd4_0: (v: t_78566d10, scale: t_78566d10) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_78566d10)
} as t_2b90cfd4<t_78566d10, t_78566d10, t_78566d10>);

/**
```
const isLive#0502f2ea = (color#:0: Vec4#38dc9122): bool#builtin ={}> color#:0.x#78566d10#0 
    >#builtin 0.5
(color#:0: Vec4#🧑‍🎨🎪🌔): bool => color#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 > 0.5
```
*/
export const hash_0502f2ea: (arg_0: t_38dc9122) => boolean = (color: t_38dc9122) => color.x > 0.5;

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
const neighbor#3b065c1a = (
    offset#:0: Vec2#78566d10,
    coord#:1: Vec2#78566d10,
    res#:2: Vec2#78566d10,
    buffer#:3: sampler2D#builtin,
): int#builtin ={}> {
    const coord#:4 = coord#:1 +#482bc839#70e0d6d0#0 offset#:0;
    if isLive#0502f2ea(color: texture#builtin(buffer#:3, coord#:4 /#85252e14#2b90cfd4#0 res#:2)) {
        1;
    } else {
        0;
    };
}
(
    offset#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    coord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    res#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    buffer#:3: sampler2D,
): int => {
    if isLive#🌐👂😖(
        texture(
            buffer#:3,
            MulVec2#🦏.#Div#⚽🤮🍡#0(
                AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#0(coord#:1, offset#:0),
                res#:2,
            ),
        ),
    ) {
        return 1;
    } else {
        return 0;
    };
}
```
*/
export const hash_3b065c1a: (arg_0: t_78566d10, arg_1: t_78566d10, arg_2: t_78566d10, arg_3: sampler2D) => number = (offset: t_78566d10, coord: t_78566d10, res: t_78566d10, buffer: sampler2D) => {
  if (hash_0502f2ea(texture(buffer, hash_85252e14.h2b90cfd4_0(hash_482bc839.h70e0d6d0_0(coord, offset), res)))) {
    return 1;
  } else {
    return 0;
  }
};

/**
```
const dot#c8c58fec = (a#:0: Vec2#78566d10, b#:1: Vec2#78566d10): float#builtin ={}> {
    a#:0.x#78566d10#0 *#builtin b#:1.x#78566d10#0 
        +#builtin a#:0.y#78566d10#1 *#builtin b#:1.y#78566d10#1;
}
(a#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, b#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): float => a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + a#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * b#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1
```
*/
export const hash_c8c58fec: (arg_0: t_78566d10, arg_1: t_78566d10) => number = (a: t_78566d10, b: t_78566d10) => a.x * b.x + a.y * b.y;

/**
```
const fract#14e72ade = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
(v#:0: float): float => v#:0 - floor(v#:0)
```
*/
export const hash_14e72ade: (arg_0: number) => number = (v: number) => v - floor(v);

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
const countNeighbors#51dd06db = (
    coord#:0: Vec2#78566d10,
    res#:1: Vec2#78566d10,
    buffer#:2: sampler2D#builtin,
): int#builtin ={}> {
    neighbor#3b065c1a(
                                    offset: Vec2#78566d10{x#78566d10#0: -1.0, y#78566d10#1: 0.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                                +#builtin neighbor#3b065c1a(
                                    offset: Vec2#78566d10{x#78566d10#0: -1.0, y#78566d10#1: 1.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                            +#builtin neighbor#3b065c1a(
                                offset: Vec2#78566d10{x#78566d10#0: -1.0, y#78566d10#1: -1.0},
                                coord#:0,
                                res#:1,
                                buffer#:2,
                            ) 
                        +#builtin neighbor#3b065c1a(
                            offset: Vec2#78566d10{x#78566d10#0: 1.0, y#78566d10#1: 0.0},
                            coord#:0,
                            res#:1,
                            buffer#:2,
                        ) 
                    +#builtin neighbor#3b065c1a(
                        offset: Vec2#78566d10{x#78566d10#0: 1.0, y#78566d10#1: 1.0},
                        coord#:0,
                        res#:1,
                        buffer#:2,
                    ) 
                +#builtin neighbor#3b065c1a(
                    offset: Vec2#78566d10{x#78566d10#0: 1.0, y#78566d10#1: -1.0},
                    coord#:0,
                    res#:1,
                    buffer#:2,
                ) 
            +#builtin neighbor#3b065c1a(
                offset: Vec2#78566d10{x#78566d10#0: 0.0, y#78566d10#1: 1.0},
                coord#:0,
                res#:1,
                buffer#:2,
            ) 
        +#builtin neighbor#3b065c1a(
            offset: Vec2#78566d10{x#78566d10#0: 0.0, y#78566d10#1: -1.0},
            coord#:0,
            res#:1,
            buffer#:2,
        );
}
(coord#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, res#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, buffer#:2: sampler2D): int => neighbor#😝🏌️‍♂️⛱️(
    Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: -1, y: 0},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#😝🏌️‍♂️⛱️(Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: -1, y: 1}, coord#:0, res#:1, buffer#:2) + neighbor#😝🏌️‍♂️⛱️(
    Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: -1, y: -1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#😝🏌️‍♂️⛱️(Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 1, y: 0}, coord#:0, res#:1, buffer#:2) + neighbor#😝🏌️‍♂️⛱️(
    Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 1, y: 1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#😝🏌️‍♂️⛱️(Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 1, y: -1}, coord#:0, res#:1, buffer#:2) + neighbor#😝🏌️‍♂️⛱️(
    Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 0, y: 1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#😝🏌️‍♂️⛱️(Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 0, y: -1}, coord#:0, res#:1, buffer#:2)
```
*/
export const hash_51dd06db: (arg_0: t_78566d10, arg_1: t_78566d10, arg_2: sampler2D) => number = (coord$0: t_78566d10, res$1: t_78566d10, buffer$2: sampler2D) => hash_3b065c1a(({
  type: "Vec2",
  x: -1,
  y: 0
} as t_78566d10), coord$0, res$1, buffer$2) + hash_3b065c1a(({
  type: "Vec2",
  x: -1,
  y: 1
} as t_78566d10), coord$0, res$1, buffer$2) + hash_3b065c1a(({
  type: "Vec2",
  x: -1,
  y: -1
} as t_78566d10), coord$0, res$1, buffer$2) + hash_3b065c1a(({
  type: "Vec2",
  x: 1,
  y: 0
} as t_78566d10), coord$0, res$1, buffer$2) + hash_3b065c1a(({
  type: "Vec2",
  x: 1,
  y: 1
} as t_78566d10), coord$0, res$1, buffer$2) + hash_3b065c1a(({
  type: "Vec2",
  x: 1,
  y: -1
} as t_78566d10), coord$0, res$1, buffer$2) + hash_3b065c1a(({
  type: "Vec2",
  x: 0,
  y: 1
} as t_78566d10), coord$0, res$1, buffer$2) + hash_3b065c1a(({
  type: "Vec2",
  x: 0,
  y: -1
} as t_78566d10), coord$0, res$1, buffer$2);

/**
```
const dead#2278c9d8 = Vec4#38dc9122{
    z#1b597af1#0: 0.0,
    x#78566d10#0: 0.0,
    y#78566d10#1: 0.0,
    w#38dc9122#0: 1.0,
}
Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: 0}
```
*/
export const hash_2278c9d8: t_38dc9122 = ({
  type: "Vec4",
  z: 0,
  x: 0,
  y: 0,
  w: 1
} as t_38dc9122);

/**
```
const live#d46691f4 = Vec4#38dc9122{
    z#1b597af1#0: 1.0,
    x#78566d10#0: 1.0,
    y#78566d10#1: 0.6,
    w#38dc9122#0: 1.0,
}
Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: 1}
```
*/
export const hash_d46691f4: t_38dc9122 = ({
  type: "Vec4",
  z: 1,
  x: 1,
  y: 0.6,
  w: 1
} as t_38dc9122);

/**
```
const random#d9cae79c = (st#:0: Vec2#78566d10): float#builtin ={}> {
    fract#14e72ade(
        v: sin#builtin(
                dot#c8c58fec(
                    a: st#:0,
                    b: Vec2#78566d10{x#78566d10#0: 12.9898, y#78566d10#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
(st#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃): float => fract#🧃💑🤶(
    sin(dot#🎿(st#:0, Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 12.9898, y: 78.233})) * 43758.5453123,
)
```
*/
export const hash_d9cae79c: (arg_0: t_78566d10) => number = (st: t_78566d10) => hash_14e72ade(sin(hash_c8c58fec(st, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_78566d10))) * 43758.5453123);

/**
```
const IntEq#24558044 = Eq#2f333afa<int#builtin>{"=="#2f333afa#0: intEq#builtin}
Eq#🧱👨‍🦰🏖️{TODO SPREADs}{h2f333afa_0: intEq}
```
*/
export const hash_24558044: t_2f333afa<number> = ({
  type: "2f333afa",
  h2f333afa_0: intEq
} as t_2f333afa<number>);

/**
```
const drawToScreen#0dd4a243 = (
    env#:0: GLSLEnv#5cec7724,
    fragCoord#:1: Vec2#78566d10,
    buffer0#:2: sampler2D#builtin,
): Vec4#38dc9122 ={}> {
    const diff#:3 = env#:0.mouse#5cec7724#3 -#482bc839#70e0d6d0#1 fragCoord#:1;
    if length#9702bed4(v: diff#:3) <#builtin 250.0 {
        const newCoord#:4 = env#:0.mouse#5cec7724#3 
            -#482bc839#70e0d6d0#1 diff#:3 /#72d6e294#2b90cfd4#0 4.0;
        texture#builtin(buffer0#:2, newCoord#:4 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1);
    } else {
        texture#builtin(buffer0#:2, fragCoord#:1 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1);
    };
}
(env#:0: GLSLEnv#🎪🌇👪😃, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, buffer0#:2: sampler2D): Vec4#🧑‍🎨🎪🌔 => {
    const diff#:3: Vec2#🧑‍🔧🏄‍♀️🕤😃 = AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
        env#:0.#GLSLEnv#🎪🌇👪😃#3,
        fragCoord#:1,
    );
    if length#🍶(diff#:3) < 250 {
        return texture(
            buffer0#:2,
            MulVec2#🦏.#Div#⚽🤮🍡#0(
                AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(
                    env#:0.#GLSLEnv#🎪🌇👪😃#3,
                    ScaleVec2Rev#🍖🤾‍♂️🚊😃.#Div#⚽🤮🍡#0(diff#:3, 4),
                ),
                env#:0.#GLSLEnv#🎪🌇👪😃#1,
            ),
        );
    } else {
        return texture(
            buffer0#:2,
            MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:1, env#:0.#GLSLEnv#🎪🌇👪😃#1),
        );
    };
}
```
*/
export const hash_0dd4a243: (arg_0: t_5cec7724, arg_1: t_78566d10, arg_2: sampler2D) => t_38dc9122 = (env: t_5cec7724, fragCoord: t_78566d10, buffer0: sampler2D) => {
  let diff: t_78566d10 = hash_482bc839.h70e0d6d0_1(env.mouse, fragCoord);

  if (hash_9702bed4(diff) < 250) {
    return texture(buffer0, hash_85252e14.h2b90cfd4_0(hash_482bc839.h70e0d6d0_1(env.mouse, hash_72d6e294.h2b90cfd4_0(diff, 4)), env.resolution));
  } else {
    return texture(buffer0, hash_85252e14.h2b90cfd4_0(fragCoord, env.resolution));
  }
};

/**
```
const drawToBuffer#50721fa3 = (
    env#:0: GLSLEnv#5cec7724,
    fragCoord#:1: Vec2#78566d10,
    buffer#:2: sampler2D#builtin,
): Vec4#38dc9122 ={}> {
    if env#:0.time#5cec7724#0 <#builtin 0.01 {
        if random#d9cae79c(st: fragCoord#:1 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1) 
            >#builtin 0.95 {
            live#d46691f4;
        } else {
            dead#2278c9d8;
        };
    } else {
        const self#:3 = isLive#0502f2ea(
            color: texture#builtin(
                buffer#:2,
                fragCoord#:1 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1,
            ),
        );
        const neighbors#:4 = countNeighbors#51dd06db(
            coord: fragCoord#:1,
            res: env#:0.resolution#5cec7724#1,
            buffer#:2,
        );
        if (self#:3 &&#builtin neighbors#:4 ==#24558044#2f333afa#0 2) 
            ||#builtin neighbors#:4 ==#24558044#2f333afa#0 3 {
            live#d46691f4;
        } else {
            dead#2278c9d8;
        };
    };
}
(env#:0: GLSLEnv#🎪🌇👪😃, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃, buffer#:2: sampler2D): Vec4#🧑‍🎨🎪🌔 => {
    if env#:0.#GLSLEnv#🎪🌇👪😃#0 < 0.01 {
        if random#🌟(MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:1, env#:0.#GLSLEnv#🎪🌇👪😃#1)) > 0.95 {
            return live#🐩;
        } else {
            return dead#👨‍👨‍👧‍👧🦅🦡;
        };
    } else {
        const neighbors#:4: int = countNeighbors#🥂🏎️👨‍💻😃(
            fragCoord#:1,
            env#:0.#GLSLEnv#🎪🌇👪😃#1,
            buffer#:2,
        );
        if (isLive#🌐👂😖(
            texture(buffer#:2, MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:1, env#:0.#GLSLEnv#🎪🌇👪😃#1)),
        ) && IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0(neighbors#:4, 2)) || (IntEq#😯🧜‍♂️🐟.#Eq#🧱👨‍🦰🏖️#0(
            neighbors#:4,
            3,
        )) {
            return live#🐩;
        } else {
            return dead#👨‍👨‍👧‍👧🦅🦡;
        };
    };
}
```
*/
export const hash_50721fa3: (arg_0: t_5cec7724, arg_1: t_78566d10, arg_2: sampler2D) => t_38dc9122 = (env: t_5cec7724, fragCoord: t_78566d10, buffer$2: sampler2D) => {
  if (env.time < 0.01) {
    if (hash_d9cae79c(hash_85252e14.h2b90cfd4_0(fragCoord, env.resolution)) > 0.95) {
      return hash_d46691f4;
    } else {
      return hash_2278c9d8;
    }
  } else {
    let neighbors: number = hash_51dd06db(fragCoord, env.resolution, buffer$2);

    if (hash_0502f2ea(texture(buffer$2, hash_85252e14.h2b90cfd4_0(fragCoord, env.resolution))) && hash_24558044.h2f333afa_0(neighbors, 2) || hash_24558044.h2f333afa_0(neighbors, 3)) {
      return hash_d46691f4;
    } else {
      return hash_2278c9d8;
    }
  }
};
export const drawToBuffer = hash_50721fa3;
export const drawToScreen = hash_0dd4a243;