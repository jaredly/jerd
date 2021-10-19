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
@unique(0.5383562320075749) type Eq#3b6b23ae<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_3b6b23ae<T> = {
  type: "3b6b23ae";
  h3b6b23ae_0: (arg_0: T_0, arg_1: T_0) => boolean;
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
const isLive#bc730d4a = (color#:0: Vec4#b1f05ae8): bool#builtin ={}> color#:0.x#08f7c2ac#0 
    >#builtin 0.5
(color#:0: Vec4#🌎): bool => color#:0.#Vec2#🍱🐶💣#0 > 0.5
```
*/
export const hash_bc730d4a: (arg_0: t_b1f05ae8) => boolean = (color: t_b1f05ae8) => color.x > 0.5;

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
const neighbor#21299588 = (
    offset#:0: Vec2#08f7c2ac,
    coord#:1: Vec2#08f7c2ac,
    res#:2: Vec2#08f7c2ac,
    buffer#:3: sampler2D#builtin,
): int#builtin ={}> {
    const coord#:4 = coord#:1 +#f9ef2af4#6ca64060#0 offset#:0;
    if isLive#bc730d4a(color: texture#builtin(buffer#:3, coord#:4 /#2d0db3a8#44e31bac#0 res#:2)) {
        1;
    } else {
        0;
    };
}
(offset#:0: Vec2#🍱🐶💣, coord#:1: Vec2#🍱🐶💣, res#:2: Vec2#🍱🐶💣, buffer#:3: sampler2D): int => {
    if isLive#👨‍🍼(
        texture(
            buffer#:3,
            MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(
                AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#0(coord#:1, offset#:0),
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
export const hash_21299588: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac, arg_3: sampler2D) => number = (offset: t_08f7c2ac, coord: t_08f7c2ac, res: t_08f7c2ac, buffer: sampler2D) => {
  if (hash_bc730d4a(texture(buffer, hash_2d0db3a8.h44e31bac_0(hash_f9ef2af4.h6ca64060_0(coord, offset), res)))) {
    return 1;
  } else {
    return 0;
  }
};

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
const IntEq#6d46a318 = Eq#3b6b23ae<int#builtin>{"=="#3b6b23ae#0: intEq#builtin}
Eq#☂️🍰🔥{TODO SPREADs}{h3b6b23ae_0: intEq}
```
*/
export const hash_6d46a318: t_3b6b23ae<number> = ({
  type: "3b6b23ae",
  h3b6b23ae_0: intEq
} as t_3b6b23ae<number>);

/**
```
const countNeighbors#19933c28 = (
    coord#:0: Vec2#08f7c2ac,
    res#:1: Vec2#08f7c2ac,
    buffer#:2: sampler2D#builtin,
): int#builtin ={}> {
    neighbor#21299588(
                                    offset: Vec2#08f7c2ac{x#08f7c2ac#0: -1.0, y#08f7c2ac#1: 0.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                                +#builtin neighbor#21299588(
                                    offset: Vec2#08f7c2ac{x#08f7c2ac#0: -1.0, y#08f7c2ac#1: 1.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                            +#builtin neighbor#21299588(
                                offset: Vec2#08f7c2ac{x#08f7c2ac#0: -1.0, y#08f7c2ac#1: -1.0},
                                coord#:0,
                                res#:1,
                                buffer#:2,
                            ) 
                        +#builtin neighbor#21299588(
                            offset: Vec2#08f7c2ac{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 0.0},
                            coord#:0,
                            res#:1,
                            buffer#:2,
                        ) 
                    +#builtin neighbor#21299588(
                        offset: Vec2#08f7c2ac{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0},
                        coord#:0,
                        res#:1,
                        buffer#:2,
                    ) 
                +#builtin neighbor#21299588(
                    offset: Vec2#08f7c2ac{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: -1.0},
                    coord#:0,
                    res#:1,
                    buffer#:2,
                ) 
            +#builtin neighbor#21299588(
                offset: Vec2#08f7c2ac{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 1.0},
                coord#:0,
                res#:1,
                buffer#:2,
            ) 
        +#builtin neighbor#21299588(
            offset: Vec2#08f7c2ac{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: -1.0},
            coord#:0,
            res#:1,
            buffer#:2,
        );
}
(coord#:0: Vec2#🍱🐶💣, res#:1: Vec2#🍱🐶💣, buffer#:2: sampler2D): int => neighbor#🕴️🌵🦒(
    Vec2#🍱🐶💣{TODO SPREADs}{x: -1, y: 0},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#🕴️🌵🦒(Vec2#🍱🐶💣{TODO SPREADs}{x: -1, y: 1}, coord#:0, res#:1, buffer#:2) + neighbor#🕴️🌵🦒(
    Vec2#🍱🐶💣{TODO SPREADs}{x: -1, y: -1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#🕴️🌵🦒(Vec2#🍱🐶💣{TODO SPREADs}{x: 1, y: 0}, coord#:0, res#:1, buffer#:2) + neighbor#🕴️🌵🦒(
    Vec2#🍱🐶💣{TODO SPREADs}{x: 1, y: 1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#🕴️🌵🦒(Vec2#🍱🐶💣{TODO SPREADs}{x: 1, y: -1}, coord#:0, res#:1, buffer#:2) + neighbor#🕴️🌵🦒(
    Vec2#🍱🐶💣{TODO SPREADs}{x: 0, y: 1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#🕴️🌵🦒(Vec2#🍱🐶💣{TODO SPREADs}{x: 0, y: -1}, coord#:0, res#:1, buffer#:2)
```
*/
export const hash_19933c28: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: sampler2D) => number = (coord$0: t_08f7c2ac, res$1: t_08f7c2ac, buffer$2: sampler2D) => hash_21299588(({
  type: "Vec2",
  x: -1,
  y: 0
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_21299588(({
  type: "Vec2",
  x: -1,
  y: 1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_21299588(({
  type: "Vec2",
  x: -1,
  y: -1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_21299588(({
  type: "Vec2",
  x: 1,
  y: 0
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_21299588(({
  type: "Vec2",
  x: 1,
  y: 1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_21299588(({
  type: "Vec2",
  x: 1,
  y: -1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_21299588(({
  type: "Vec2",
  x: 0,
  y: 1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_21299588(({
  type: "Vec2",
  x: 0,
  y: -1
} as t_08f7c2ac), coord$0, res$1, buffer$2);

/**
```
const dead#2644cff4 = Vec4#b1f05ae8{
    z#b79db448#0: 0.0,
    x#08f7c2ac#0: 0.0,
    y#08f7c2ac#1: 0.0,
    w#b1f05ae8#0: 1.0,
}
Vec4#🌎{TODO SPREADs}{w: 1, z: 0}
```
*/
export const hash_2644cff4: t_b1f05ae8 = ({
  type: "Vec4",
  z: 0,
  x: 0,
  y: 0,
  w: 1
} as t_b1f05ae8);

/**
```
const live#cb0d797a = Vec4#b1f05ae8{
    z#b79db448#0: 1.0,
    x#08f7c2ac#0: 1.0,
    y#08f7c2ac#1: 0.6,
    w#b1f05ae8#0: 1.0,
}
Vec4#🌎{TODO SPREADs}{w: 1, z: 1}
```
*/
export const hash_cb0d797a: t_b1f05ae8 = ({
  type: "Vec4",
  z: 1,
  x: 1,
  y: 0.6,
  w: 1
} as t_b1f05ae8);

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
const drawToScreen#32209a5c = (
    env#:0: GLSLEnv#a25a17de,
    fragCoord#:1: Vec2#08f7c2ac,
    buffer0#:2: sampler2D#builtin,
): Vec4#b1f05ae8 ={}> {
    const diff#:3 = env#:0.mouse#a25a17de#3 -#f9ef2af4#6ca64060#1 fragCoord#:1;
    if length#0f32aa7b(v: diff#:3) <#builtin 250.0 {
        const newCoord#:4 = env#:0.mouse#a25a17de#3 
            -#f9ef2af4#6ca64060#1 diff#:3 /#6a0c8558#44e31bac#0 4.0;
        texture#builtin(buffer0#:2, newCoord#:4 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1);
    } else {
        texture#builtin(buffer0#:2, fragCoord#:1 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1);
    };
}
(env#:0: GLSLEnv#🏏, fragCoord#:1: Vec2#🍱🐶💣, buffer0#:2: sampler2D): Vec4#🌎 => {
    const diff#:3: Vec2#🍱🐶💣 = AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
        env#:0.#GLSLEnv#🏏#3,
        fragCoord#:1,
    );
    if length#🥝✊🧏‍♂️(diff#:3) < 250 {
        return texture(
            buffer0#:2,
            MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(
                AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(
                    env#:0.#GLSLEnv#🏏#3,
                    ScaleVec2Rev#🧙‍♀️🎡🥙😃.#Div#🌈👶😭😃#0(diff#:3, 4),
                ),
                env#:0.#GLSLEnv#🏏#1,
            ),
        );
    } else {
        return texture(
            buffer0#:2,
            MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(fragCoord#:1, env#:0.#GLSLEnv#🏏#1),
        );
    };
}
```
*/
export const hash_32209a5c: (arg_0: t_a25a17de, arg_1: t_08f7c2ac, arg_2: sampler2D) => t_b1f05ae8 = (env: t_a25a17de, fragCoord: t_08f7c2ac, buffer0: sampler2D) => {
  let diff: t_08f7c2ac = hash_f9ef2af4.h6ca64060_1(env.mouse, fragCoord);

  if (hash_0f32aa7b(diff) < 250) {
    return texture(buffer0, hash_2d0db3a8.h44e31bac_0(hash_f9ef2af4.h6ca64060_1(env.mouse, hash_6a0c8558.h44e31bac_0(diff, 4)), env.resolution));
  } else {
    return texture(buffer0, hash_2d0db3a8.h44e31bac_0(fragCoord, env.resolution));
  }
};

/**
```
const drawToBuffer#43fec942 = (
    env#:0: GLSLEnv#a25a17de,
    fragCoord#:1: Vec2#08f7c2ac,
    buffer#:2: sampler2D#builtin,
): Vec4#b1f05ae8 ={}> {
    if env#:0.time#a25a17de#0 <#builtin 0.01 {
        if random#a9479c34(st: fragCoord#:1 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1) 
            >#builtin 0.95 {
            live#cb0d797a;
        } else {
            dead#2644cff4;
        };
    } else {
        const self#:3 = isLive#bc730d4a(
            color: texture#builtin(
                buffer#:2,
                fragCoord#:1 /#2d0db3a8#44e31bac#0 env#:0.resolution#a25a17de#1,
            ),
        );
        const neighbors#:4 = countNeighbors#19933c28(
            coord: fragCoord#:1,
            res: env#:0.resolution#a25a17de#1,
            buffer#:2,
        );
        if (self#:3 &&#builtin neighbors#:4 ==#6d46a318#3b6b23ae#0 2) 
            ||#builtin neighbors#:4 ==#6d46a318#3b6b23ae#0 3 {
            live#cb0d797a;
        } else {
            dead#2644cff4;
        };
    };
}
(env#:0: GLSLEnv#🏏, fragCoord#:1: Vec2#🍱🐶💣, buffer#:2: sampler2D): Vec4#🌎 => {
    if env#:0.#GLSLEnv#🏏#0 < 0.01 {
        if random#🤧(MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(fragCoord#:1, env#:0.#GLSLEnv#🏏#1)) > 0.95 {
            return live#🧑‍🦯;
        } else {
            return dead#🧿🕵️‍♀️🌴;
        };
    } else {
        const neighbors#:4: int = countNeighbors#😬👨‍🦱🏄(
            fragCoord#:1,
            env#:0.#GLSLEnv#🏏#1,
            buffer#:2,
        );
        if (isLive#👨‍🍼(
            texture(buffer#:2, MulVec2#🌪️⏳🍼.#Div#🌈👶😭😃#0(fragCoord#:1, env#:0.#GLSLEnv#🏏#1)),
        ) && IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0(neighbors#:4, 2)) || (IntEq#🌃🚴🍶😃.#Eq#☂️🍰🔥#0(
            neighbors#:4,
            3,
        )) {
            return live#🧑‍🦯;
        } else {
            return dead#🧿🕵️‍♀️🌴;
        };
    };
}
```
*/
export const hash_43fec942: (arg_0: t_a25a17de, arg_1: t_08f7c2ac, arg_2: sampler2D) => t_b1f05ae8 = (env: t_a25a17de, fragCoord: t_08f7c2ac, buffer$2: sampler2D) => {
  if (env.time < 0.01) {
    if (hash_a9479c34(hash_2d0db3a8.h44e31bac_0(fragCoord, env.resolution)) > 0.95) {
      return hash_cb0d797a;
    } else {
      return hash_2644cff4;
    }
  } else {
    let neighbors: number = hash_19933c28(fragCoord, env.resolution, buffer$2);

    if (hash_bc730d4a(texture(buffer$2, hash_2d0db3a8.h44e31bac_0(fragCoord, env.resolution))) && hash_6d46a318.h3b6b23ae_0(neighbors, 2) || hash_6d46a318.h3b6b23ae_0(neighbors, 3)) {
      return hash_cb0d797a;
    } else {
      return hash_2644cff4;
    }
  }
};
export const drawToBuffer = hash_43fec942;
export const drawToScreen = hash_32209a5c;