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
@unique(0.5383562320075749) type Eq#51ea2a36<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_51ea2a36<T_0> = {
  type: "51ea2a36";
  h51ea2a36_0: (arg_0: T_0, arg_1: T_0) => boolean;
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
const isLive#4ccee460 = (color#:0: Vec4#51a53bbe): bool#builtin ={}> color#:0.x#08f7c2ac#0 
    >#builtin 0.5
(color#:0: Vec4#✨🤶👨‍🔬😃): bool => color#:0.#Vec2#🍱🐶💣#0 > 0.5
```
*/
export const hash_4ccee460: (arg_0: t_51a53bbe) => boolean = (color: t_51a53bbe) => color.x > 0.5;

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
const neighbor#51c931e8 = (
    offset#:0: Vec2#08f7c2ac,
    coord#:1: Vec2#08f7c2ac,
    res#:2: Vec2#08f7c2ac,
    buffer#:3: sampler2D#builtin,
): int#builtin ={}> {
    const coord#:4 = coord#:1 +#04f14e9c#3d436b7e#0 offset#:0;
    if isLive#4ccee460(color: texture#builtin(buffer#:3, coord#:4 /#08bab8c4#3b763160#0 res#:2)) {
        1;
    } else {
        0;
    };
}
(offset#:0: Vec2#🍱🐶💣, coord#:1: Vec2#🍱🐶💣, res#:2: Vec2#🍱🐶💣, buffer#:3: sampler2D): int => {
    if isLive#🤡🎃👨😃(
        texture(
            buffer#:3,
            MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(
                AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#0(coord#:1, offset#:0),
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
export const hash_51c931e8: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac, arg_3: sampler2D) => number = (offset: t_08f7c2ac, coord: t_08f7c2ac, res: t_08f7c2ac, buffer: sampler2D) => {
  if (hash_4ccee460(texture(buffer, hash_08bab8c4.h3b763160_0(hash_04f14e9c.h3d436b7e_0(coord, offset), res)))) {
    return 1;
  } else {
    return 0;
  }
};

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
const IntEq#ec95f154 = Eq#51ea2a36<int#builtin>{"=="#51ea2a36#0: intEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: intEq}
```
*/
export const hash_ec95f154: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: intEq
} as t_51ea2a36<number>);

/**
```
const countNeighbors#0dfe116c = (
    coord#:0: Vec2#08f7c2ac,
    res#:1: Vec2#08f7c2ac,
    buffer#:2: sampler2D#builtin,
): int#builtin ={}> {
    neighbor#51c931e8(
                                    offset: Vec2#08f7c2ac{x#08f7c2ac#0: -1.0, y#08f7c2ac#1: 0.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                                +#builtin neighbor#51c931e8(
                                    offset: Vec2#08f7c2ac{x#08f7c2ac#0: -1.0, y#08f7c2ac#1: 1.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                            +#builtin neighbor#51c931e8(
                                offset: Vec2#08f7c2ac{x#08f7c2ac#0: -1.0, y#08f7c2ac#1: -1.0},
                                coord#:0,
                                res#:1,
                                buffer#:2,
                            ) 
                        +#builtin neighbor#51c931e8(
                            offset: Vec2#08f7c2ac{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 0.0},
                            coord#:0,
                            res#:1,
                            buffer#:2,
                        ) 
                    +#builtin neighbor#51c931e8(
                        offset: Vec2#08f7c2ac{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0},
                        coord#:0,
                        res#:1,
                        buffer#:2,
                    ) 
                +#builtin neighbor#51c931e8(
                    offset: Vec2#08f7c2ac{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: -1.0},
                    coord#:0,
                    res#:1,
                    buffer#:2,
                ) 
            +#builtin neighbor#51c931e8(
                offset: Vec2#08f7c2ac{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 1.0},
                coord#:0,
                res#:1,
                buffer#:2,
            ) 
        +#builtin neighbor#51c931e8(
            offset: Vec2#08f7c2ac{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: -1.0},
            coord#:0,
            res#:1,
            buffer#:2,
        );
}
(coord#:0: Vec2#🍱🐶💣, res#:1: Vec2#🍱🐶💣, buffer#:2: sampler2D): int => neighbor#🗣️🦋🧑‍💻😃(
    Vec2#🍱🐶💣{TODO SPREADs}{x: -1, y: 0},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#🗣️🦋🧑‍💻😃(Vec2#🍱🐶💣{TODO SPREADs}{x: -1, y: 1}, coord#:0, res#:1, buffer#:2) + neighbor#🗣️🦋🧑‍💻😃(
    Vec2#🍱🐶💣{TODO SPREADs}{x: -1, y: -1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#🗣️🦋🧑‍💻😃(Vec2#🍱🐶💣{TODO SPREADs}{x: 1, y: 0}, coord#:0, res#:1, buffer#:2) + neighbor#🗣️🦋🧑‍💻😃(
    Vec2#🍱🐶💣{TODO SPREADs}{x: 1, y: 1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#🗣️🦋🧑‍💻😃(Vec2#🍱🐶💣{TODO SPREADs}{x: 1, y: -1}, coord#:0, res#:1, buffer#:2) + neighbor#🗣️🦋🧑‍💻😃(
    Vec2#🍱🐶💣{TODO SPREADs}{x: 0, y: 1},
    coord#:0,
    res#:1,
    buffer#:2,
) + neighbor#🗣️🦋🧑‍💻😃(Vec2#🍱🐶💣{TODO SPREADs}{x: 0, y: -1}, coord#:0, res#:1, buffer#:2)
```
*/
export const hash_0dfe116c: (arg_0: t_08f7c2ac, arg_1: t_08f7c2ac, arg_2: sampler2D) => number = (coord$0: t_08f7c2ac, res$1: t_08f7c2ac, buffer$2: sampler2D) => hash_51c931e8(({
  type: "Vec2",
  x: -1,
  y: 0
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_51c931e8(({
  type: "Vec2",
  x: -1,
  y: 1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_51c931e8(({
  type: "Vec2",
  x: -1,
  y: -1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_51c931e8(({
  type: "Vec2",
  x: 1,
  y: 0
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_51c931e8(({
  type: "Vec2",
  x: 1,
  y: 1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_51c931e8(({
  type: "Vec2",
  x: 1,
  y: -1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_51c931e8(({
  type: "Vec2",
  x: 0,
  y: 1
} as t_08f7c2ac), coord$0, res$1, buffer$2) + hash_51c931e8(({
  type: "Vec2",
  x: 0,
  y: -1
} as t_08f7c2ac), coord$0, res$1, buffer$2);

/**
```
const dead#f9b04718 = Vec4#51a53bbe{
    z#40e2c712#0: 0.0,
    x#08f7c2ac#0: 0.0,
    y#08f7c2ac#1: 0.0,
    w#51a53bbe#0: 1.0,
}
Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: 0}
```
*/
export const hash_f9b04718: t_51a53bbe = ({
  type: "Vec4",
  z: 0,
  x: 0,
  y: 0,
  w: 1
} as t_51a53bbe);

/**
```
const live#2721d946 = Vec4#51a53bbe{
    z#40e2c712#0: 1.0,
    x#08f7c2ac#0: 1.0,
    y#08f7c2ac#1: 0.6,
    w#51a53bbe#0: 1.0,
}
Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: 1}
```
*/
export const hash_2721d946: t_51a53bbe = ({
  type: "Vec4",
  z: 1,
  x: 1,
  y: 0.6,
  w: 1
} as t_51a53bbe);

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
const drawToBuffer#4c6c94c8 = (
    env#:0: GLSLEnv#88074884,
    fragCoord#:1: Vec2#08f7c2ac,
    buffer#:2: sampler2D#builtin,
): Vec4#51a53bbe ={}> {
    if env#:0.time#88074884#0 <#builtin 0.01 {
        if random#2f576342(st: fragCoord#:1 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1) 
            >#builtin 0.95 {
            live#2721d946;
        } else {
            dead#f9b04718;
        };
    } else {
        const self#:3 = isLive#4ccee460(
            color: texture#builtin(
                buffer#:2,
                fragCoord#:1 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1,
            ),
        );
        const neighbors#:4 = countNeighbors#0dfe116c(
            coord: fragCoord#:1,
            res: env#:0.resolution#88074884#1,
            buffer#:2,
        );
        if (self#:3 &&#builtin neighbors#:4 ==#ec95f154#51ea2a36#0 2) 
            ||#builtin neighbors#:4 ==#ec95f154#51ea2a36#0 3 {
            live#2721d946;
        } else {
            dead#f9b04718;
        };
    };
}
(env#:0: GLSLEnv#💜, fragCoord#:1: Vec2#🍱🐶💣, buffer#:2: sampler2D): Vec4#✨🤶👨‍🔬😃 => {
    if env#:0.#GLSLEnv#💜#0 < 0.01 {
        if random#🏍️👨‍👨‍👧‍👧🏝️(
            MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, env#:0.#GLSLEnv#💜#1),
        ) > 0.95 {
            return live#👰‍♀️💝🍌;
        } else {
            return dead#🌃;
        };
    } else {
        const neighbors#:4: int = countNeighbors#💆‍♂️🕘👵(
            fragCoord#:1,
            env#:0.#GLSLEnv#💜#1,
            buffer#:2,
        );
        if (isLive#🤡🎃👨😃(
            texture(buffer#:2, MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, env#:0.#GLSLEnv#💜#1)),
        ) && IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(neighbors#:4, 2)) || (IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(
            neighbors#:4,
            3,
        )) {
            return live#👰‍♀️💝🍌;
        } else {
            return dead#🌃;
        };
    };
}
```
*/
export const hash_4c6c94c8: (arg_0: t_88074884, arg_1: t_08f7c2ac, arg_2: sampler2D) => t_51a53bbe = (env: t_88074884, fragCoord: t_08f7c2ac, buffer$2: sampler2D) => {
  if (env.time < 0.01) {
    if (hash_2f576342(hash_08bab8c4.h3b763160_0(fragCoord, env.resolution)) > 0.95) {
      return hash_2721d946;
    } else {
      return hash_f9b04718;
    }
  } else {
    let neighbors: number = hash_0dfe116c(fragCoord, env.resolution, buffer$2);

    if (hash_4ccee460(texture(buffer$2, hash_08bab8c4.h3b763160_0(fragCoord, env.resolution))) && hash_ec95f154.h51ea2a36_0(neighbors, 2) || hash_ec95f154.h51ea2a36_0(neighbors, 3)) {
      return hash_2721d946;
    } else {
      return hash_f9b04718;
    }
  }
};

/**
```
const drawToScreen#70605494 = (
    env#:0: GLSLEnv#88074884,
    fragCoord#:1: Vec2#08f7c2ac,
    buffer0#:2: sampler2D#builtin,
): Vec4#51a53bbe ={}> {
    const diff#:3 = env#:0.mouse#88074884#3 -#04f14e9c#3d436b7e#1 fragCoord#:1;
    if length#077fa0cc(v: diff#:3) <#builtin 250.0 {
        const newCoord#:4 = env#:0.mouse#88074884#3 
            -#04f14e9c#3d436b7e#1 diff#:3 /#02622a76#3b763160#0 4.0;
        texture#builtin(buffer0#:2, newCoord#:4 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1);
    } else {
        texture#builtin(buffer0#:2, fragCoord#:1 /#08bab8c4#3b763160#0 env#:0.resolution#88074884#1);
    };
}
(env#:0: GLSLEnv#💜, fragCoord#:1: Vec2#🍱🐶💣, buffer0#:2: sampler2D): Vec4#✨🤶👨‍🔬😃 => {
    const diff#:3: Vec2#🍱🐶💣 = AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
        env#:0.#GLSLEnv#💜#3,
        fragCoord#:1,
    );
    if length#👨⛸️💖(diff#:3) < 250 {
        return texture(
            buffer0#:2,
            MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(
                AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(
                    env#:0.#GLSLEnv#💜#3,
                    ScaleVec2Rev#🍏💥😒.#Div#🧜‍♂️🧖💧#0(diff#:3, 4),
                ),
                env#:0.#GLSLEnv#💜#1,
            ),
        );
    } else {
        return texture(
            buffer0#:2,
            MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, env#:0.#GLSLEnv#💜#1),
        );
    };
}
```
*/
export const hash_70605494: (arg_0: t_88074884, arg_1: t_08f7c2ac, arg_2: sampler2D) => t_51a53bbe = (env: t_88074884, fragCoord: t_08f7c2ac, buffer0: sampler2D) => {
  let diff: t_08f7c2ac = hash_04f14e9c.h3d436b7e_1(env.mouse, fragCoord);

  if (hash_077fa0cc(diff) < 250) {
    return texture(buffer0, hash_08bab8c4.h3b763160_0(hash_04f14e9c.h3d436b7e_1(env.mouse, hash_02622a76.h3b763160_0(diff, 4)), env.resolution));
  } else {
    return texture(buffer0, hash_08bab8c4.h3b763160_0(fragCoord, env.resolution));
  }
};
export const drawToBuffer = hash_4c6c94c8;
export const drawToScreen = hash_70605494;