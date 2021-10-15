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
@unique(2) type As#As<T#:10000, Y#:10001> = {
    as: (T#:10000) ={}> Y#:10001,
}
```
*/
type t_As<T_10000, T_10001> = {
  type: "As";
  hAs_0: (arg_0: T_10000) => T_10001;
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
const EPSILON#ec7f8d1c = 0.00005
0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

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
const normalize#2dc09b90 = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> v#:0 
    /#f86c15e0#3b763160#0 length#57739f70(v#:0)
(v#:0: Vec3#😦): Vec3#😦 => ScaleVec3Rev#👨‍👧.#Div#🧜‍♂️🧖💧#0(v#:0, length#⏲️🙅‍♂️🧎😃(v#:0))
```
*/
export const hash_2dc09b90: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => hash_f86c15e0.h3b763160_0(v, hash_57739f70(v));

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
const rec shortestDistanceToSurface#24b9c3fa = (
    sceneSDF#:0: (float#builtin, Vec3#b79db448) ={}> float#builtin,
    iTime#:1: float#builtin,
    eye#:2: Vec3#b79db448,
    marchingDirection#:3: Vec3#b79db448,
    start#:4: float#builtin,
    end#:5: float#builtin,
    stepsLeft#:6: int#builtin,
): float#builtin ={}> {
    if stepsLeft#:6 <=#builtin 0 {
        end#:5;
    } else {
        const dist#:7 = sceneSDF#:0(
            iTime#:1,
            eye#:2 +#dff30886#3d436b7e#0 start#:4 *#6bec1050#02cc25c4#0 marchingDirection#:3,
        );
        if dist#:7 <#builtin EPSILON#ec7f8d1c {
            start#:4;
        } else {
            const depth#:8 = start#:4 +#builtin dist#:7;
            if depth#:8 >=#builtin end#:5 {
                end#:5;
            } else {
                24b9c3fa#self(
                    sceneSDF#:0,
                    iTime#:1,
                    eye#:2,
                    marchingDirection#:3,
                    depth#:8,
                    end#:5,
                    stepsLeft#:6 -#builtin 1,
                );
            };
        };
    };
}
(
    sceneSDF#:0: (float, Vec3#😦) => float,
    iTime#:1: float,
    eye#:2: Vec3#😦,
    marchingDirection#:3: Vec3#😦,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
): float => {
    for (; stepsLeft#:6 > 0; stepsLeft#:6 = stepsLeft#:6 - 1) {
        const dist#:7: float = sceneSDF#:0(
            iTime#:1,
            AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#0(
                eye#:2,
                ScaleVec3#😖🏨🦞😃.#Mul#👫🏭😪#0(start#:4, marchingDirection#:3),
            ),
        );
        if dist#:7 < EPSILON#🧑‍💻 {
            return start#:4;
        } else {
            const depth#:8: float = start#:4 + dist#:7;
            if depth#:8 >= end#:5 {
                return end#:5;
            } else {
                start#:4 = depth#:8;
                continue;
            };
        };
    };
    return end#:5;
}
```
*/
export const hash_24b9c3fa: (arg_0: (arg_0: number, arg_1: t_b79db448) => number, arg_1: number, arg_2: t_b79db448, arg_3: t_b79db448, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF: (arg_0: number, arg_1: t_b79db448) => number, iTime: number, eye: t_b79db448, marchingDirection: t_b79db448, start: number, end: number, stepsLeft: number) => {
  for (; stepsLeft > 0; stepsLeft = stepsLeft - 1) {
    let dist: number = sceneSDF(iTime, hash_dff30886.h3d436b7e_0(eye, hash_6bec1050.h02cc25c4_0(start, marchingDirection)));

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
const distance#2954b2b2 = (one#:0: Vec3#b79db448, two#:1: Vec3#b79db448): float#builtin ={}> length#57739f70(
    v: two#:1 -#dff30886#3d436b7e#1 one#:0,
)
(one#:0: Vec3#😦, two#:1: Vec3#😦): float => length#⏲️🙅‍♂️🧎😃(
    AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(two#:1, one#:0),
)
```
*/
export const hash_2954b2b2: (arg_0: t_b79db448, arg_1: t_b79db448) => number = (one: t_b79db448, two: t_b79db448) => hash_57739f70(hash_dff30886.h3d436b7e_1(two, one));

/**
```
const MAX_MARCHING_STEPS#62404440 = 255
255
```
*/
export const hash_62404440: number = 255;

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
const estimateNormal#240b3a72 = (
    sceneSDF#:0: (float#builtin, Vec3#b79db448) ={}> float#builtin,
    iTime#:1: float#builtin,
    p#:2: Vec3#b79db448,
): Vec3#b79db448 ={}> normalize#2dc09b90(
    v: Vec3#b79db448{
        x#08f7c2ac#0: sceneSDF#:0(
                iTime#:1,
                Vec3#b79db448{...p#:2, x#08f7c2ac#0: p#:2.x#08f7c2ac#0 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#b79db448{...p#:2, x#08f7c2ac#0: p#:2.x#08f7c2ac#0 -#builtin EPSILON#ec7f8d1c},
            ),
        y#08f7c2ac#1: sceneSDF#:0(
                iTime#:1,
                Vec3#b79db448{...p#:2, y#08f7c2ac#1: p#:2.y#08f7c2ac#1 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#b79db448{...p#:2, y#08f7c2ac#1: p#:2.y#08f7c2ac#1 -#builtin EPSILON#ec7f8d1c},
            ),
        z#b79db448#0: sceneSDF#:0(
                iTime#:1,
                Vec3#b79db448{...p#:2, z#b79db448#0: p#:2.z#b79db448#0 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#b79db448{...p#:2, z#b79db448#0: p#:2.z#b79db448#0 -#builtin EPSILON#ec7f8d1c},
            ),
    },
)
(sceneSDF#:0: (float, Vec3#😦) => float, iTime#:1: float, p#:2: Vec3#😦): Vec3#😦 => normalize#🌗😒🥃(
    Vec3#😦{TODO SPREADs}{
        z: sceneSDF#:0(
            iTime#:1,
            Vec3#😦{TODO SPREADs}{z: p#:2.#Vec3#😦#0 + EPSILON#🧑‍💻, x: _#:0, y: _#:0},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#😦{TODO SPREADs}{z: p#:2.#Vec3#😦#0 - EPSILON#🧑‍💻, x: _#:0, y: _#:0},
        ),
        x: sceneSDF#:0(
            iTime#:1,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: p#:2.#Vec2#🍱🐶💣#0 + EPSILON#🧑‍💻, y: _#:0},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: p#:2.#Vec2#🍱🐶💣#0 - EPSILON#🧑‍💻, y: _#:0},
        ),
        y: sceneSDF#:0(
            iTime#:1,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: _#:0, y: p#:2.#Vec2#🍱🐶💣#1 + EPSILON#🧑‍💻},
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#😦{TODO SPREADs}{z: _#:0, x: _#:0, y: p#:2.#Vec2#🍱🐶💣#1 - EPSILON#🧑‍💻},
        ),
    },
)
```
*/
export const hash_240b3a72: (arg_0: (arg_0: number, arg_1: t_b79db448) => number, arg_1: number, arg_2: t_b79db448) => t_b79db448 = (sceneSDF: (arg_0: number, arg_1: t_b79db448) => number, iTime: number, p: t_b79db448) => hash_2dc09b90(({
  type: "Vec3",
  x: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    x: p.x + hash_ec7f8d1c
  } as t_b79db448)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    x: p.x - hash_ec7f8d1c
  } as t_b79db448)),
  y: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    y: p.y + hash_ec7f8d1c
  } as t_b79db448)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    y: p.y - hash_ec7f8d1c
  } as t_b79db448)),
  z: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    z: p.z + hash_ec7f8d1c
  } as t_b79db448)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    z: p.z - hash_ec7f8d1c
  } as t_b79db448))
} as t_b79db448));

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
const volumetricSample#5361d7cb = (
    sceneSDF#:0: (float#builtin, Vec3#b79db448) ={}> float#builtin,
    iTime#:1: float#builtin,
    light#:2: Vec3#b79db448,
    eye#:3: Vec3#b79db448,
    dist#:4: float#builtin,
    percent#:5: float#builtin,
    dir#:6: Vec3#b79db448,
    left#:7: int#builtin,
): float#builtin ={}> {
    const rdist#:8 = percent#:5 *#builtin dist#:4;
    const sample#:9 = eye#:3 +#dff30886#3d436b7e#0 rdist#:8 *#6bec1050#02cc25c4#0 dir#:6;
    const lightDist#:10 = distance#2954b2b2(one: sample#:9, two: light#:2);
    const toLight#:11 = sample#:9 -#dff30886#3d436b7e#1 light#:2;
    const marchToLight#:12 = shortestDistanceToSurface#24b9c3fa(
        sceneSDF#:0,
        iTime#:1,
        eye: sample#:9,
        marchingDirection: -1.0 *#6bec1050#02cc25c4#0 normalize#2dc09b90(v: toLight#:11),
        start: 0.0,
        end: lightDist#:10,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    if marchToLight#:12 >=#builtin lightDist#:10 -#builtin 0.1 {
        dist#:4 /#builtin pow#builtin(1.0 +#builtin lightDist#:10, 2.0);
    } else {
        0.0;
    };
}
(
    sceneSDF#:0: (float, Vec3#😦) => float,
    iTime#:1: float,
    light#:2: Vec3#😦,
    eye#:3: Vec3#😦,
    dist#:4: float,
    percent#:5: float,
    dir#:6: Vec3#😦,
    left#:7: int,
): float => {
    const sample#:9: Vec3#😦 = AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#0(
        eye#:3,
        ScaleVec3#😖🏨🦞😃.#Mul#👫🏭😪#0(percent#:5 * dist#:4, dir#:6),
    );
    const lightDist#:10: float = distance#🍝👨‍🚒🍗(sample#:9, light#:2);
    if shortestDistanceToSurface#🧸🍊🐌(
        sceneSDF#:0,
        iTime#:1,
        sample#:9,
        ScaleVec3#😖🏨🦞😃.#Mul#👫🏭😪#0(
            -1,
            normalize#🌗😒🥃(AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(sample#:9, light#:2)),
        ),
        0,
        lightDist#:10,
        MAX_MARCHING_STEPS#😟😗🦦😃,
    ) >= lightDist#:10 - 0.1 {
        return dist#:4 / pow(1 + lightDist#:10, 2);
    } else {
        return 0;
    };
}
```
*/
export const hash_5361d7cb: (arg_0: (arg_0: number, arg_1: t_b79db448) => number, arg_1: number, arg_2: t_b79db448, arg_3: t_b79db448, arg_4: number, arg_5: number, arg_6: t_b79db448, arg_7: number) => number = (sceneSDF: (arg_0: number, arg_1: t_b79db448) => number, iTime: number, light: t_b79db448, eye$3: t_b79db448, dist$4: number, percent: number, dir: t_b79db448, left: number) => {
  let sample: t_b79db448 = hash_dff30886.h3d436b7e_0(eye$3, hash_6bec1050.h02cc25c4_0(percent * dist$4, dir));
  let lightDist: number = hash_2954b2b2(sample, light);

  if (hash_24b9c3fa(sceneSDF, iTime, sample, hash_6bec1050.h02cc25c4_0(-1, hash_2dc09b90(hash_dff30886.h3d436b7e_1(sample, light))), 0, lightDist, hash_62404440) >= lightDist - 0.1) {
    return dist$4 / pow(1 + lightDist, 2);
  } else {
    return 0;
  }
};

/**
```
const IntAsFloat#6f186ad1 = As#As<int#builtin, float#builtin>{as#As#0: intToFloat#builtin}
As#😉{TODO SPREADs}{hAs_0: intToFloat}
```
*/
export const hash_6f186ad1: t_As<number, number> = ({
  type: "As",
  hAs_0: intToFloat
} as t_As<number, number>);

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
const isPointingTowardLight#26d11f44 = (
    sceneSDF#:0: (float#builtin, Vec3#b79db448) ={}> float#builtin,
    iTime#:1: float#builtin,
    p#:2: Vec3#b79db448,
    lightPos#:3: Vec3#b79db448,
): bool#builtin ={}> {
    const N#:4 = estimateNormal#240b3a72(sceneSDF#:0, iTime#:1, p#:2);
    const L#:5 = normalize#2dc09b90(v: lightPos#:3 -#dff30886#3d436b7e#1 p#:2);
    const dotLN#:6 = dot#4390c737(a: L#:5, b: N#:4);
    dotLN#:6 >=#builtin 0.0;
}
(sceneSDF#:0: (float, Vec3#😦) => float, iTime#:1: float, p#:2: Vec3#😦, lightPos#:3: Vec3#😦): bool => dot#🚓🤕🤯😃(
    normalize#🌗😒🥃(AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(lightPos#:3, p#:2)),
    estimateNormal#🍌🍮🦕(sceneSDF#:0, iTime#:1, p#:2),
) >= 0
```
*/
export const hash_26d11f44: (arg_0: (arg_0: number, arg_1: t_b79db448) => number, arg_1: number, arg_2: t_b79db448, arg_3: t_b79db448) => boolean = (sceneSDF: (arg_0: number, arg_1: t_b79db448) => number, iTime: number, p: t_b79db448, lightPos: t_b79db448) => hash_4390c737(hash_2dc09b90(hash_dff30886.h3d436b7e_1(lightPos, p)), hash_240b3a72(sceneSDF, iTime, p)) >= 0;

/**
```
const dot#f22a3fca = (a#:0: Vec4#b1f05ae8, b#:1: Vec4#b1f05ae8): float#builtin ={}> {
    a#:0.x#08f7c2ac#0 *#builtin b#:1.x#08f7c2ac#0 
                +#builtin a#:0.y#08f7c2ac#1 *#builtin b#:1.y#08f7c2ac#1 
            +#builtin a#:0.z#b79db448#0 *#builtin b#:1.z#b79db448#0 
        +#builtin a#:0.w#b1f05ae8#0 *#builtin b#:1.w#b1f05ae8#0;
}
(a#:0: Vec4#🌎, b#:1: Vec4#🌎): float => a#:0.#Vec2#🍱🐶💣#0 * b#:1.#Vec2#🍱🐶💣#0 + a#:0.#Vec2#🍱🐶💣#1 * b#:1.#Vec2#🍱🐶💣#1 + a#:0.#Vec3#😦#0 * b#:1.#Vec3#😦#0 + a#:0.#Vec4#🌎#0 * b#:1.#Vec4#🌎#0
```
*/
export const hash_f22a3fca: (arg_0: t_b1f05ae8, arg_1: t_b1f05ae8) => number = (a: t_b1f05ae8, b: t_b1f05ae8) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

/**
```
const vec4#67fdfe9c = (
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
export const hash_67fdfe9c: (arg_0: number, arg_1: number, arg_2: number, arg_3: number) => t_b1f05ae8 = (x: number, y: number, z: number, w: number) => ({
  type: "Vec4",
  z: z,
  x: x,
  y: y,
  w: w
} as t_b1f05ae8);

/**
```
const cross#3748673e = (one#:0: Vec3#b79db448, two#:1: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
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
export const hash_3748673e: (arg_0: t_b79db448, arg_1: t_b79db448) => t_b79db448 = (one: t_b79db448, two: t_b79db448) => ({
  type: "Vec3",
  x: one.y * two.z - two.y * one.z,
  y: one.z * two.x - two.z * one.x,
  z: one.x * two.y - two.x * one.y
} as t_b79db448);

/**
```
const vec3#30188c24 = (v#:0: Vec2#08f7c2ac, z#:1: float#builtin): Vec3#b79db448 ={}> Vec3#b79db448{
    ...v#:0,
    z#b79db448#0: z#:1,
}
(v#:0: Vec2#🍱🐶💣, z#:1: float): Vec3#😦 => Vec3#😦{TODO SPREADs}{z: z#:1, x: _#:0, y: _#:0}
```
*/
export const hash_30188c24: (arg_0: t_08f7c2ac, arg_1: number) => t_b79db448 = (v: t_08f7c2ac, z$1: number) => ({ ...v,
  type: "Vec3",
  z: z$1
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
const abs#0a278ac2 = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
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
export const hash_0a278ac2: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_b79db448);

/**
```
const max#600c090a = (v#:0: Vec3#b79db448): float#builtin ={}> {
    max#builtin(max#builtin(v#:0.x#08f7c2ac#0, v#:0.y#08f7c2ac#1), v#:0.z#b79db448#0);
}
(v#:0: Vec3#😦): float => max(max(v#:0.#Vec2#🍱🐶💣#0, v#:0.#Vec2#🍱🐶💣#1), v#:0.#Vec3#😦#0)
```
*/
export const hash_600c090a: (arg_0: t_b79db448) => number = (v: t_b79db448) => max(max(v.x, v.y), v.z);

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
export const hash_4f0b1aa0: (arg_0: t_b79db448, arg_1: number, arg_2: t_b79db448) => t_b79db448 = (p$0: t_b79db448, c: number, l: t_b79db448) => hash_dff30886.h3d436b7e_1(p$0, hash_6bec1050.h02cc25c4_0(c, hash_162a8d68(hash_ec75c0c2(hash_f86c15e0.h3b763160_0(p$0, c)), hash_4d12c551.h616f559e_0(l), l)));

/**
```
const FloatAsInt#184a69ed = As#As<float#builtin, int#builtin>{as#As#0: floatToInt#builtin}
As#😉{TODO SPREADs}{hAs_0: floatToInt}
```
*/
export const hash_184a69ed: t_As<number, number> = ({
  type: "As",
  hAs_0: floatToInt
} as t_As<number, number>);

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
const AddSubVec2_#23f7c6c9 = AddSub#3d436b7e<Vec2#08f7c2ac, float#builtin, Vec2#08f7c2ac>{
    "+"#3d436b7e#0: (one#:0: Vec2#08f7c2ac, two#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1,
    },
    "-"#3d436b7e#1: (one#:2: Vec2#08f7c2ac, two#:3: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3,
    },
}
AddSub#🕕🧑‍🦲⚽{TODO SPREADs}{
    h3d436b7e_0: (one#:0: Vec2#🍱🐶💣, two#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1,
    },
    h3d436b7e_1: (one#:2: Vec2#🍱🐶💣, two#:3: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3,
    },
}
```
*/
export const hash_23f7c6c9: t_3d436b7e<t_08f7c2ac, number, t_08f7c2ac> = ({
  type: "3d436b7e",
  h3d436b7e_0: (one: t_08f7c2ac, two: number) => ({
    type: "Vec2",
    x: one.x + two,
    y: one.y + two
  } as t_08f7c2ac),
  h3d436b7e_1: (one$2: t_08f7c2ac, two$3: number) => ({
    type: "Vec2",
    x: one$2.x - two$3,
    y: one$2.y - two$3
  } as t_08f7c2ac)
} as t_3d436b7e<t_08f7c2ac, number, t_08f7c2ac>);

/**
```
const rec volumetric#0c670cec = (
    sceneSDF#:0: (float#builtin, Vec3#b79db448) ={}> float#builtin,
    iTime#:1: float#builtin,
    seed#:2: Vec2#08f7c2ac,
    light#:3: Vec3#b79db448,
    eye#:4: Vec3#b79db448,
    dist#:5: float#builtin,
    dir#:6: Vec3#b79db448,
    current#:7: float#builtin,
    left#:8: int#builtin,
    total#:9: float#builtin,
): float#builtin ={}> {
    if left#:8 <=#builtin 0 {
        current#:7;
    } else {
        const percent#:10 = left#:8 as#6f186ad1 float#builtin /#builtin total#:9;
        const sample#:11 = volumetricSample#5361d7cb(
            sceneSDF#:0,
            iTime#:1,
            light#:3,
            eye#:4,
            dist#:5,
            percent#:10,
            dir#:6,
            left#:8,
        );
        0c670cec#self(
            sceneSDF#:0,
            iTime#:1,
            seed#:2,
            light#:3,
            eye#:4,
            dist#:5,
            dir#:6,
            current#:7 +#builtin sample#:11,
            left#:8 -#builtin 1,
            total#:9,
        );
    };
}
(
    sceneSDF#:0: (float, Vec3#😦) => float,
    iTime#:1: float,
    seed#:2: Vec2#🍱🐶💣,
    light#:3: Vec3#😦,
    eye#:4: Vec3#😦,
    dist#:5: float,
    dir#:6: Vec3#😦,
    current#:7: float,
    left#:8: int,
    total#:9: float,
): float => {
    for (; left#:8 > 0; left#:8 = left#:8 - 1) {
        current#:7 = current#:7 + volumetricSample#🎗️💘💂‍♀️😃(
            sceneSDF#:0,
            iTime#:1,
            light#:3,
            eye#:4,
            dist#:5,
            IntAsFloat#🥛🐰🗻😃.#As#😉#0(left#:8) / total#:9,
            dir#:6,
            left#:8,
        );
        continue;
    };
    return current#:7;
}
```
*/
export const hash_0c670cec: (arg_0: (arg_0: number, arg_1: t_b79db448) => number, arg_1: number, arg_2: t_08f7c2ac, arg_3: t_b79db448, arg_4: t_b79db448, arg_5: number, arg_6: t_b79db448, arg_7: number, arg_8: number, arg_9: number) => number = (sceneSDF: (arg_0: number, arg_1: t_b79db448) => number, iTime: number, seed: t_08f7c2ac, light$3: t_b79db448, eye$4: t_b79db448, dist$5: number, dir: t_b79db448, current: number, left$8: number, total: number) => {
  for (; left$8 > 0; left$8 = left$8 - 1) {
    current = current + hash_5361d7cb(sceneSDF, iTime, light$3, eye$4, dist$5, hash_6f186ad1.hAs_0(left$8) / total, dir, left$8);
    continue;
  }

  return current;
};

/**
```
const lightSurface#6b7f7052 = (
    sceneSDF#:0: (float#builtin, Vec3#b79db448) ={}> float#builtin,
    iTime#:1: float#builtin,
    worldPosForPixel#:2: Vec3#b79db448,
    light1Pos#:3: Vec3#b79db448,
    light#:4: float#builtin,
    hit#:5: float#builtin,
): Vec4#b1f05ae8 ={}> {
    if isPointingTowardLight#26d11f44(
        sceneSDF#:0,
        iTime#:1,
        p: worldPosForPixel#:2,
        lightPos: light1Pos#:3,
    ) {
        const toLight#:6 = light1Pos#:3 -#dff30886#3d436b7e#1 worldPosForPixel#:2;
        const marchToLight#:7 = shortestDistanceToSurface#24b9c3fa(
            sceneSDF#:0,
            iTime#:1,
            eye: light1Pos#:3,
            marchingDirection: -1.0 *#6bec1050#02cc25c4#0 normalize#2dc09b90(v: toLight#:6),
            start: MIN_DIST#f2cd39b8,
            end: MAX_DIST#0ce717e6,
            stepsLeft: MAX_MARCHING_STEPS#62404440,
        );
        if marchToLight#:7 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c *#builtin 10.0 {
            Vec4#b1f05ae8{...white#365fd554 *#24e970fe#02cc25c4#0 light#:4, w#b1f05ae8#0: 1.0};
        } else {
            const offset#:8 = marchToLight#:7 -#builtin length#57739f70(v: toLight#:6);
            const penumbra#:9 = 0.1;
            if offset#:8 <#builtin -EPSILON#ec7f8d1c *#builtin 1000.0 {
                Vec4#b1f05ae8{...white#365fd554 *#24e970fe#02cc25c4#0 light#:4, w#b1f05ae8#0: 1.0};
            } else {
                Vec4#b1f05ae8{...white#365fd554 *#24e970fe#02cc25c4#0 hit#:5, w#b1f05ae8#0: 1.0};
            };
        };
    } else {
        Vec4#b1f05ae8{...white#365fd554 *#24e970fe#02cc25c4#0 light#:4, w#b1f05ae8#0: 1.0};
    };
}
(
    sceneSDF#:0: (float, Vec3#😦) => float,
    iTime#:1: float,
    worldPosForPixel#:2: Vec3#😦,
    light1Pos#:3: Vec3#😦,
    light#:4: float,
    hit#:5: float,
): Vec4#🌎 => {
    if isPointingTowardLight#🦽🥺🍇(sceneSDF#:0, iTime#:1, worldPosForPixel#:2, light1Pos#:3) {
        const toLight#:6: Vec3#😦 = AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(
            light1Pos#:3,
            worldPosForPixel#:2,
        );
        const marchToLight#:7: float = shortestDistanceToSurface#🧸🍊🐌(
            sceneSDF#:0,
            iTime#:1,
            light1Pos#:3,
            ScaleVec3#😖🏨🦞😃.#Mul#👫🏭😪#0(-1, normalize#🌗😒🥃(toLight#:6)),
            MIN_DIST#🤾‍♂️,
            MAX_DIST#🥅👬👨‍🦰,
            MAX_MARCHING_STEPS#😟😗🦦😃,
        );
        if marchToLight#:7 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 * 10 {
            return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
        } else {
            if marchToLight#:7 - length#⏲️🙅‍♂️🧎😃(toLight#:6) < -EPSILON#🧑‍💻 * 1000 {
                return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
            } else {
                return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
            };
        };
    } else {
        return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
    };
}
```
*/
export const hash_6b7f7052: (arg_0: (arg_0: number, arg_1: t_b79db448) => number, arg_1: number, arg_2: t_b79db448, arg_3: t_b79db448, arg_4: number, arg_5: number) => t_b1f05ae8 = (sceneSDF: (arg_0: number, arg_1: t_b79db448) => number, iTime: number, worldPosForPixel: t_b79db448, light1Pos: t_b79db448, light$4: number, hit: number) => {
  if (hash_26d11f44(sceneSDF, iTime, worldPosForPixel, light1Pos)) {
    let toLight: t_b79db448 = hash_dff30886.h3d436b7e_1(light1Pos, worldPosForPixel);
    let marchToLight: number = hash_24b9c3fa(sceneSDF, iTime, light1Pos, hash_6bec1050.h02cc25c4_0(-1, hash_2dc09b90(toLight)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

    if (marchToLight > hash_0ce717e6 - hash_ec7f8d1c * 10) {
      return ({ ...hash_24e970fe.h02cc25c4_0(hash_365fd554, light$4),
        type: "Vec4",
        w: 1
      } as t_b1f05ae8);
    } else {
      if (marchToLight - hash_57739f70(toLight) < -hash_ec7f8d1c * 1000) {
        return ({ ...hash_24e970fe.h02cc25c4_0(hash_365fd554, light$4),
          type: "Vec4",
          w: 1
        } as t_b1f05ae8);
      } else {
        return ({ ...hash_24e970fe.h02cc25c4_0(hash_365fd554, hit),
          type: "Vec4",
          w: 1
        } as t_b1f05ae8);
      }
    }
  } else {
    return ({ ...hash_24e970fe.h02cc25c4_0(hash_365fd554, light$4),
      type: "Vec4",
      w: 1
    } as t_b1f05ae8);
  }
};

/**
```
const MatByVector#c7283624 = Mul#02cc25c4<Mat4#0d95d60e, Vec4#b1f05ae8, Vec4#b1f05ae8>{
    "*"#02cc25c4#0: (mat#:0: Mat4#0d95d60e, vec#:1: Vec4#b1f05ae8): Vec4#b1f05ae8 ={}> Vec4#b1f05ae8{
        z#b79db448#0: dot#f22a3fca(a: mat#:0.r3#0d95d60e#2, b: vec#:1),
        x#08f7c2ac#0: dot#f22a3fca(a: mat#:0.r1#0d95d60e#0, b: vec#:1),
        y#08f7c2ac#1: dot#f22a3fca(a: mat#:0.r2#0d95d60e#1, b: vec#:1),
        w#b1f05ae8#0: dot#f22a3fca(a: mat#:0.r4#0d95d60e#3, b: vec#:1),
    },
}
Mul#👫🏭😪{TODO SPREADs}{
    h02cc25c4_0: (mat#:0: Mat4#🐐🧍‍♂️👩‍🦲, vec#:1: Vec4#🌎): Vec4#🌎 => Vec4#🌎{TODO SPREADs}{
        w: dot#🎁(mat#:0.#Mat4#🐐🧍‍♂️👩‍🦲#3, vec#:1),
        z: dot#🎁(mat#:0.#Mat4#🐐🧍‍♂️👩‍🦲#2, vec#:1),
    },
}
```
*/
export const hash_c7283624: t_02cc25c4<t_0d95d60e, t_b1f05ae8, t_b1f05ae8> = ({
  type: "02cc25c4",
  h02cc25c4_0: (mat: t_0d95d60e, vec: t_b1f05ae8) => ({
    type: "Vec4",
    z: hash_f22a3fca(mat.r3, vec),
    x: hash_f22a3fca(mat.r1, vec),
    y: hash_f22a3fca(mat.r2, vec),
    w: hash_f22a3fca(mat.r4, vec)
  } as t_b1f05ae8)
} as t_02cc25c4<t_0d95d60e, t_b1f05ae8, t_b1f05ae8>);

/**
```
const xyz#4e75153a = (v#:0: Vec4#b1f05ae8): Vec3#b79db448 ={}> Vec3#b79db448{
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
export const hash_4e75153a: (arg_0: t_b1f05ae8) => t_b79db448 = (v: t_b1f05ae8) => ({
  type: "Vec3",
  x: v.x,
  y: v.y,
  z: v.z
} as t_b79db448);

/**
```
const viewMatrix#75e3ca34 = (eye#:0: Vec3#b79db448, center#:1: Vec3#b79db448, up#:2: Vec3#b79db448): Mat4#0d95d60e ={}> {
    const f#:3 = normalize#2dc09b90(v: center#:1 -#dff30886#3d436b7e#1 eye#:0);
    const s#:4 = normalize#2dc09b90(v: cross#3748673e(one: f#:3, two: up#:2));
    const u#:5 = cross#3748673e(one: s#:4, two: f#:3);
    Mat4#0d95d60e{
        r1#0d95d60e#0: Vec4#b1f05ae8{...s#:4, w#b1f05ae8#0: 0.0},
        r2#0d95d60e#1: Vec4#b1f05ae8{...u#:5, w#b1f05ae8#0: 0.0},
        r3#0d95d60e#2: Vec4#b1f05ae8{...NegVec3#4d12c551."-"#616f559e#0(f#:3), w#b1f05ae8#0: 0.0},
        r4#0d95d60e#3: vec4#67fdfe9c(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(eye#:0: Vec3#😦, center#:1: Vec3#😦, up#:2: Vec3#😦): Mat4#🐐🧍‍♂️👩‍🦲 => {
    const f#:3: Vec3#😦 = normalize#🌗😒🥃(AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(center#:1, eye#:0));
    const s#:4: Vec3#😦 = normalize#🌗😒🥃(cross#🚚🐹🕐(f#:3, up#:2));
    return Mat4#🐐🧍‍♂️👩‍🦲{TODO SPREADs}{
        r1: Vec4#🌎{TODO SPREADs}{w: 0, z: _#:0},
        r2: Vec4#🌎{TODO SPREADs}{w: 0, z: _#:0},
        r3: Vec4#🌎{TODO SPREADs}{w: 0, z: _#:0},
        r4: vec4#🥪🕡🍆😃(0, 0, 0, 1),
    };
}
```
*/
export const hash_75e3ca34: (arg_0: t_b79db448, arg_1: t_b79db448, arg_2: t_b79db448) => t_0d95d60e = (eye$0: t_b79db448, center: t_b79db448, up: t_b79db448) => {
  let f: t_b79db448 = hash_2dc09b90(hash_dff30886.h3d436b7e_1(center, eye$0));
  let s: t_b79db448 = hash_2dc09b90(hash_3748673e(f, up));
  return ({
    type: "Mat4",
    r1: ({ ...s,
      type: "Vec4",
      w: 0
    } as t_b1f05ae8),
    r2: ({ ...hash_3748673e(s, f),
      type: "Vec4",
      w: 0
    } as t_b1f05ae8),
    r3: ({ ...hash_4d12c551.h616f559e_0(f),
      type: "Vec4",
      w: 0
    } as t_b1f05ae8),
    r4: hash_67fdfe9c(0, 0, 0, 1)
  } as t_0d95d60e);
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
const sceneSDF#55a18352 = (iTime#:0: float#builtin, samplePoint#:1: Vec3#b79db448): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p1#:3 = opRepLim#4f0b1aa0(
        p: samplePoint#:1,
        c: 0.25,
        l: Vec3#b79db448{x#08f7c2ac#0: 2.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 0.0},
    );
    min#builtin(
        max#builtin(
            max#600c090a(
                v: abs#0a278ac2(v: p1#:3) 
                    -#dff30886#3d436b7e#1 Vec3#b79db448{
                        x#08f7c2ac#0: 0.1,
                        y#08f7c2ac#1: 0.3,
                        z#b79db448#0: 0.6,
                    },
            ),
            -max#600c090a(
                v: abs#0a278ac2(v: p1#:3) 
                    -#dff30886#3d436b7e#1 Vec3#b79db448{
                        x#08f7c2ac#0: 0.11,
                        y#08f7c2ac#1: 0.2,
                        z#b79db448#0: 0.55,
                    },
            ),
        ),
        max#600c090a(
            v: abs#0a278ac2(
                    v: samplePoint#:1 
                        -#dff30886#3d436b7e#1 Vec3#b79db448{
                            x#08f7c2ac#0: 0.0,
                            y#08f7c2ac#1: 1.0,
                            z#b79db448#0: -0.1,
                        },
                ) 
                -#dff30886#3d436b7e#1 Vec3#b79db448{
                    x#08f7c2ac#0: 2.1,
                    y#08f7c2ac#1: 0.1,
                    z#b79db448#0: 2.1,
                },
        ),
    );
}
(iTime#:0: float, samplePoint#:1: Vec3#😦): float => {
    const p1#:3: Vec3#😦 = opRepLim#🥙🍪🙋‍♂️😃(
        samplePoint#:1,
        0.25,
        Vec3#😦{TODO SPREADs}{z: 0, x: 2, y: 0},
    );
    return min(
        max(
            max#🧑‍🌾🏥🐎😃(
                AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(
                    abs#🍦👨‍👧‍👧👈(p1#:3),
                    Vec3#😦{TODO SPREADs}{z: 0.6, x: 0.1, y: 0.3},
                ),
            ),
            -max#🧑‍🌾🏥🐎😃(
                AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(
                    abs#🍦👨‍👧‍👧👈(p1#:3),
                    Vec3#😦{TODO SPREADs}{z: 0.55, x: 0.11, y: 0.2},
                ),
            ),
        ),
        max#🧑‍🌾🏥🐎😃(
            AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(
                abs#🍦👨‍👧‍👧👈(
                    AddSubVec3#🖤.#AddSub#🕕🧑‍🦲⚽#1(
                        samplePoint#:1,
                        Vec3#😦{TODO SPREADs}{z: -0.1, x: 0, y: 1},
                    ),
                ),
                Vec3#😦{TODO SPREADs}{z: 2.1, x: 2.1, y: 0.1},
            ),
        ),
    );
}
```
*/
export const hash_55a18352: (arg_0: number, arg_1: t_b79db448) => number = (iTime$0: number, samplePoint: t_b79db448) => {
  let p1: t_b79db448 = hash_4f0b1aa0(samplePoint, 0.25, ({
    type: "Vec3",
    x: 2,
    y: 0,
    z: 0
  } as t_b79db448));
  return min(max(hash_600c090a(hash_dff30886.h3d436b7e_1(hash_0a278ac2(p1), ({
    type: "Vec3",
    x: 0.1,
    y: 0.3,
    z: 0.6
  } as t_b79db448))), -hash_600c090a(hash_dff30886.h3d436b7e_1(hash_0a278ac2(p1), ({
    type: "Vec3",
    x: 0.11,
    y: 0.2,
    z: 0.55
  } as t_b79db448)))), hash_600c090a(hash_dff30886.h3d436b7e_1(hash_0a278ac2(hash_dff30886.h3d436b7e_1(samplePoint, ({
    type: "Vec3",
    x: 0,
    y: 1,
    z: -0.1
  } as t_b79db448))), ({
    type: "Vec3",
    x: 2.1,
    y: 0.1,
    z: 2.1
  } as t_b79db448))));
};

/**
```
const fishingBoueys#d98f7608 = (
    sceneSDF#:0: (float#builtin, Vec3#b79db448) ={}> float#builtin,
    iTime#:1: float#builtin,
    fragCoord#:2: Vec2#08f7c2ac,
    iResolution#:3: Vec2#08f7c2ac,
    uCamera#:4: Vec3#b79db448,
): Vec4#b1f05ae8 ={}> {
    const viewDir#:5 = rayDirection#08d4f757(fieldOfView: 45.0, size: iResolution#:3, fragCoord#:2);
    const eye#:6 = uCamera#:4;
    const viewToWorld#:7 = viewMatrix#75e3ca34(
        eye#:6,
        center: Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 0.0},
        up: Vec3#b79db448{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 0.0},
    );
    const worldDir#:8 = xyz#4e75153a(
        v: viewToWorld#:7 *#c7283624#02cc25c4#0 Vec4#b1f05ae8{...viewDir#:5, w#b1f05ae8#0: 0.0},
    );
    const dir#:9 = worldDir#:8;
    const dist#:10 = shortestDistanceToSurface#24b9c3fa(
        sceneSDF#:0,
        iTime#:1,
        eye#:6,
        marchingDirection: dir#:9,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    if dist#:10 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c {
        Vec4#b1f05ae8{
            z#b79db448#0: 0.0,
            x#08f7c2ac#0: 1.0,
            y#08f7c2ac#1: 1.0,
            w#b1f05ae8#0: 1.0,
        };
    } else {
        const worldPosForPixel#:11 = eye#:6 
            +#dff30886#3d436b7e#0 dist#:10 *#6bec1050#02cc25c4#0 dir#:9;
        const light1Pos#:12 = Vec3#b79db448{
            x#08f7c2ac#0: 0.15 +#builtin sin#builtin(iTime#:1 /#builtin 2.0) /#builtin 1.0,
            y#08f7c2ac#1: 0.0,
            z#b79db448#0: 0.05,
        };
        const surfaces#:13 = lightSurface#6b7f7052(
            sceneSDF#:0,
            iTime#:1,
            worldPosForPixel#:11,
            light1Pos#:12,
            light: 0.0,
            hit: 0.01,
        );
        const samples#:14 = 10.0;
        const brightness#:15 = volumetric#0c670cec(
                    sceneSDF#:0,
                    iTime#:1,
                    seed: fragCoord#:2 /#08bab8c4#3b763160#0 iResolution#:3 
                        +#23f7c6c9#3d436b7e#0 iTime#:1 /#builtin 1000.0,
                    light: light1Pos#:12,
                    eye#:6,
                    dist#:10,
                    dir#:9,
                    current: 0.0,
                    left: samples#:14 as#184a69ed int#builtin,
                    total: samples#:14,
                ) 
                *#builtin 3.0 
            /#builtin samples#:14;
        Vec4#b1f05ae8{
            ...white#365fd554 *#24e970fe#02cc25c4#0 brightness#:15 
                    *#24e970fe#02cc25c4#0 brightness#:15 
                *#24e970fe#02cc25c4#0 brightness#:15,
            w#b1f05ae8#0: 1.0,
        };
    };
}
(
    sceneSDF#:0: (float, Vec3#😦) => float,
    iTime#:1: float,
    fragCoord#:2: Vec2#🍱🐶💣,
    iResolution#:3: Vec2#🍱🐶💣,
    uCamera#:4: Vec3#😦,
): Vec4#🌎 => {
    const worldDir#:8: Vec3#😦 = xyz#🤴👰‍♂️🙅‍♂️😃(
        MatByVector#🦦.#Mul#👫🏭😪#0(
            viewMatrix#🦢🧏🛫😃(
                uCamera#:4,
                Vec3#😦{TODO SPREADs}{z: 0, x: 0, y: 0},
                Vec3#😦{TODO SPREADs}{z: 0, x: 0, y: 1},
            ),
            Vec4#🌎{TODO SPREADs}{w: 0, z: _#:0},
        ),
    );
    const dist#:10: float = shortestDistanceToSurface#🧸🍊🐌(
        sceneSDF#:0,
        iTime#:1,
        uCamera#:4,
        worldDir#:8,
        MIN_DIST#🤾‍♂️,
        MAX_DIST#🥅👬👨‍🦰,
        MAX_MARCHING_STEPS#😟😗🦦😃,
    );
    if dist#:10 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 {
        return Vec4#🌎{TODO SPREADs}{w: 1, z: 0};
    } else {
        const brightness#:15: float = volumetric#💁👭👶(
            sceneSDF#:0,
            iTime#:1,
            AddSubVec2_#🧁🐕🐉.#AddSub#🕕🧑‍🦲⚽#0(
                MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:2, iResolution#:3),
                iTime#:1 / 1000,
            ),
            Vec3#😦{TODO SPREADs}{z: 0.05, x: 0.15 + sin(iTime#:1 / 2) / 1, y: 0},
            uCamera#:4,
            dist#:10,
            worldDir#:8,
            0,
            FloatAsInt#🐒🍕🏃‍♂️.#As#😉#0(10),
            10,
        ) * 3 / 10;
        return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
    };
}
```
*/
export const hash_d98f7608: (arg_0: (arg_0: number, arg_1: t_b79db448) => number, arg_1: number, arg_2: t_08f7c2ac, arg_3: t_08f7c2ac, arg_4: t_b79db448) => t_b1f05ae8 = (sceneSDF: (arg_0: number, arg_1: t_b79db448) => number, iTime: number, fragCoord: t_08f7c2ac, iResolution: t_08f7c2ac, uCamera: t_b79db448) => {
  let worldDir: t_b79db448 = hash_4e75153a(hash_c7283624.h02cc25c4_0(hash_75e3ca34(uCamera, ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 0
  } as t_b79db448), ({
    type: "Vec3",
    x: 0,
    y: 1,
    z: 0
  } as t_b79db448)), ({ ...hash_08d4f757(45, iResolution, fragCoord),
    type: "Vec4",
    w: 0
  } as t_b1f05ae8)));
  let dist$10: number = hash_24b9c3fa(sceneSDF, iTime, uCamera, worldDir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$10 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 1,
      y: 1,
      w: 1
    } as t_b1f05ae8);
  } else {
    let brightness: number = hash_0c670cec(sceneSDF, iTime, hash_23f7c6c9.h3d436b7e_0(hash_08bab8c4.h3b763160_0(fragCoord, iResolution), iTime / 1000), ({
      type: "Vec3",
      x: 0.15 + sin(iTime / 2) / 1,
      y: 0,
      z: 0.05
    } as t_b79db448), uCamera, dist$10, worldDir, 0, hash_184a69ed.hAs_0(10), 10) * 3 / 10;
    return ({ ...hash_24e970fe.h02cc25c4_0(hash_24e970fe.h02cc25c4_0(hash_24e970fe.h02cc25c4_0(hash_365fd554, brightness), brightness), brightness),
      type: "Vec4",
      w: 1
    } as t_b1f05ae8);
  }
};

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
const randFolks#2dcc84fc = (env#:0: GLSLEnv#a25a17de, fragCoord#:1: Vec2#08f7c2ac): Vec4#b1f05ae8 ={}> {
    const scale#:2 = 40.0;
    const small#:3 = round#73e3f152(v: fragCoord#:1 /#02622a76#3b763160#0 scale#:2) 
        *#db41487e#02cc25c4#0 scale#:2;
    const small#:4 = vec2#fa534764(
        x: small#:3.x#08f7c2ac#0,
        y: small#:3.y#08f7c2ac#1 +#builtin env#:0.time#a25a17de#0,
    );
    const v#:5 = random#2f576342(st: small#:4 /#08bab8c4#3b763160#0 env#:0.resolution#a25a17de#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const bouey#:6 = fishingBoueys#d98f7608(
        sceneSDF#55a18352,
        iTime: env#:0.time#a25a17de#0,
        fragCoord#:1,
        iResolution: env#:0.resolution#a25a17de#1,
        uCamera: env#:0.camera#a25a17de#2 *#24e970fe#02cc25c4#0 -1.0,
    );
    bouey#:6;
}
(env#:0: GLSLEnv#🏏, fragCoord#:1: Vec2#🍱🐶💣): Vec4#🌎 => fishingBoueys#🐷(
    sceneSDF#🛑🤡🧚‍♂️😃,
    env#:0.#GLSLEnv#🏏#0,
    fragCoord#:1,
    env#:0.#GLSLEnv#🏏#1,
    ScaleVec3_#🧑‍⚕️🥀🐜.#Mul#👫🏭😪#0(env#:0.#GLSLEnv#🏏#2, -1),
)
```
*/
export const hash_2dcc84fc: (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8 = (env: t_a25a17de, fragCoord$1: t_08f7c2ac) => hash_d98f7608(hash_55a18352, env.time, fragCoord$1, env.resolution, hash_24e970fe.h02cc25c4_0(env.camera, -1));
export const randFolks = hash_2dcc84fc;