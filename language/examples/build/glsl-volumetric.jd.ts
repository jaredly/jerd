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
@unique(2) type As#As<T#:10000, Y#:10001> = {
    as: (T#:10000) ={}> Y#:10001,
}
```
*/
type t_As<T, Y> = {
  type: "As";
  hAs_0: (arg_0: T) => Y;
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
const EPSILON#ec7f8d1c = 0.00005
0.00005
```
*/
export const hash_ec7f8d1c: number = 0.00005;

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
const rec shortestDistanceToSurface#b287cb44 = (
    sceneSDF#:0: (float#builtin, Vec3#1b597af1) ={}> float#builtin,
    iTime#:1: float#builtin,
    eye#:2: Vec3#1b597af1,
    marchingDirection#:3: Vec3#1b597af1,
    start#:4: float#builtin,
    end#:5: float#builtin,
    stepsLeft#:6: int#builtin,
): float#builtin ={}> {
    if stepsLeft#:6 <=#builtin 0 {
        end#:5;
    } else {
        const dist#:7 = sceneSDF#:0(
            iTime#:1,
            eye#:2 +#3de90345#70e0d6d0#0 start#:4 *#11ee14c0#49fef1f5#0 marchingDirection#:3,
        );
        if dist#:7 <#builtin EPSILON#ec7f8d1c {
            start#:4;
        } else {
            const depth#:8 = start#:4 +#builtin dist#:7;
            if depth#:8 >=#builtin end#:5 {
                end#:5;
            } else {
                b287cb44#self(
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
    sceneSDF#:0: (float, Vec3#🗻🌻🤽‍♂️) => float,
    iTime#:1: float,
    eye#:2: Vec3#🗻🌻🤽‍♂️,
    marchingDirection#:3: Vec3#🗻🌻🤽‍♂️,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
): float => {
    for (; stepsLeft#:6 > 0; stepsLeft#:6 = stepsLeft#:6 - 1) {
        const dist#:7: float = sceneSDF#:0(
            iTime#:1,
            AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
                eye#:2,
                ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(start#:4, marchingDirection#:3),
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
export const hash_b287cb44: (arg_0: (arg_0: number, arg_1: t_1b597af1) => number, arg_1: number, arg_2: t_1b597af1, arg_3: t_1b597af1, arg_4: number, arg_5: number, arg_6: number) => number = (sceneSDF: (arg_0: number, arg_1: t_1b597af1) => number, iTime: number, eye: t_1b597af1, marchingDirection: t_1b597af1, start: number, end: number, stepsLeft: number) => {
  for (; stepsLeft > 0; stepsLeft = stepsLeft - 1) {
    let dist: number = sceneSDF(iTime, hash_3de90345.h70e0d6d0_0(eye, hash_11ee14c0.h49fef1f5_0(start, marchingDirection)));

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
const MAX_MARCHING_STEPS#62404440 = 255
255
```
*/
export const hash_62404440: number = 255;

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
const estimateNormal#57396b92 = (
    sceneSDF#:0: (float#builtin, Vec3#1b597af1) ={}> float#builtin,
    iTime#:1: float#builtin,
    p#:2: Vec3#1b597af1,
): Vec3#1b597af1 ={}> normalize#35d412d2(
    v: Vec3#1b597af1{
        x#78566d10#0: sceneSDF#:0(
                iTime#:1,
                Vec3#1b597af1{...p#:2, x#78566d10#0: p#:2.x#78566d10#0 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#1b597af1{...p#:2, x#78566d10#0: p#:2.x#78566d10#0 -#builtin EPSILON#ec7f8d1c},
            ),
        y#78566d10#1: sceneSDF#:0(
                iTime#:1,
                Vec3#1b597af1{...p#:2, y#78566d10#1: p#:2.y#78566d10#1 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#1b597af1{...p#:2, y#78566d10#1: p#:2.y#78566d10#1 -#builtin EPSILON#ec7f8d1c},
            ),
        z#1b597af1#0: sceneSDF#:0(
                iTime#:1,
                Vec3#1b597af1{...p#:2, z#1b597af1#0: p#:2.z#1b597af1#0 +#builtin EPSILON#ec7f8d1c},
            ) 
            -#builtin sceneSDF#:0(
                iTime#:1,
                Vec3#1b597af1{...p#:2, z#1b597af1#0: p#:2.z#1b597af1#0 -#builtin EPSILON#ec7f8d1c},
            ),
    },
)
(sceneSDF#:0: (float, Vec3#🗻🌻🤽‍♂️) => float, iTime#:1: float, p#:2: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => normalize#☕🧑‍🏫🛩️(
    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
        z: sceneSDF#:0(
            iTime#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: p#:2.#Vec3#🗻🌻🤽‍♂️#0 + EPSILON#🧑‍💻,
                x: _#:0,
                y: _#:0,
            },
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: p#:2.#Vec3#🗻🌻🤽‍♂️#0 - EPSILON#🧑‍💻,
                x: _#:0,
                y: _#:0,
            },
        ),
        x: sceneSDF#:0(
            iTime#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: p#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + EPSILON#🧑‍💻,
                y: _#:0,
            },
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: p#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - EPSILON#🧑‍💻,
                y: _#:0,
            },
        ),
        y: sceneSDF#:0(
            iTime#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + EPSILON#🧑‍💻,
            },
        ) - sceneSDF#:0(
            iTime#:1,
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
                z: _#:0,
                x: _#:0,
                y: p#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - EPSILON#🧑‍💻,
            },
        ),
    },
)
```
*/
export const hash_57396b92: (arg_0: (arg_0: number, arg_1: t_1b597af1) => number, arg_1: number, arg_2: t_1b597af1) => t_1b597af1 = (sceneSDF: (arg_0: number, arg_1: t_1b597af1) => number, iTime: number, p: t_1b597af1) => hash_35d412d2(({
  type: "Vec3",
  x: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    x: p.x + hash_ec7f8d1c
  } as t_1b597af1)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    x: p.x - hash_ec7f8d1c
  } as t_1b597af1)),
  y: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    y: p.y + hash_ec7f8d1c
  } as t_1b597af1)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    y: p.y - hash_ec7f8d1c
  } as t_1b597af1)),
  z: sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    z: p.z + hash_ec7f8d1c
  } as t_1b597af1)) - sceneSDF(iTime, ({ ...p,
    type: "Vec3",
    z: p.z - hash_ec7f8d1c
  } as t_1b597af1))
} as t_1b597af1));

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
const round#29c3f03c = (v#:0: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: round#builtin(v#:0.x#78566d10#0),
    y#78566d10#1: round#builtin(v#:0.y#78566d10#1),
    z#1b597af1#0: round#builtin(v#:0.z#1b597af1#0),
}
(v#:0: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: round(v#:0.#Vec3#🗻🌻🤽‍♂️#0),
    x: round(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0),
    y: round(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1),
}
```
*/
export const hash_29c3f03c: (arg_0: t_1b597af1) => t_1b597af1 = (v: t_1b597af1) => ({
  type: "Vec3",
  x: round(v.x),
  y: round(v.y),
  z: round(v.z)
} as t_1b597af1);

/**
```
const clamp#83e54cbc = (v#:0: Vec3#1b597af1, min#:1: Vec3#1b597af1, max#:2: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: clamp#0611a7c0(
        v: v#:0.x#78566d10#0,
        minv: min#:1.x#78566d10#0,
        maxv: max#:2.x#78566d10#0,
    ),
    y#78566d10#1: clamp#0611a7c0(
        v: v#:0.y#78566d10#1,
        minv: min#:1.y#78566d10#1,
        maxv: max#:2.y#78566d10#1,
    ),
    z#1b597af1#0: clamp#0611a7c0(
        v: v#:0.z#1b597af1#0,
        minv: min#:1.z#1b597af1#0,
        maxv: max#:2.z#1b597af1#0,
    ),
}
(v#:0: Vec3#🗻🌻🤽‍♂️, min#:1: Vec3#🗻🌻🤽‍♂️, max#:2: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: clamp#🎉😹👹(v#:0.#Vec3#🗻🌻🤽‍♂️#0, min#:1.#Vec3#🗻🌻🤽‍♂️#0, max#:2.#Vec3#🗻🌻🤽‍♂️#0),
    x: clamp#🎉😹👹(
        v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        min#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        max#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
    ),
    y: clamp#🎉😹👹(
        v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
        min#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
        max#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    ),
}
```
*/
export const hash_83e54cbc: (arg_0: t_1b597af1, arg_1: t_1b597af1, arg_2: t_1b597af1) => t_1b597af1 = (v: t_1b597af1, min: t_1b597af1, max: t_1b597af1) => ({
  type: "Vec3",
  x: hash_0611a7c0(v.x, min.x, max.x),
  y: hash_0611a7c0(v.y, min.y, max.y),
  z: hash_0611a7c0(v.z, min.z, max.z)
} as t_1b597af1);

/**
```
const volumetricSample#27b9b3c4 = (
    sceneSDF#:0: (float#builtin, Vec3#1b597af1) ={}> float#builtin,
    iTime#:1: float#builtin,
    light#:2: Vec3#1b597af1,
    eye#:3: Vec3#1b597af1,
    dist#:4: float#builtin,
    percent#:5: float#builtin,
    dir#:6: Vec3#1b597af1,
    left#:7: int#builtin,
): float#builtin ={}> {
    const rdist#:8 = percent#:5 *#builtin dist#:4;
    const sample#:9 = eye#:3 +#3de90345#70e0d6d0#0 rdist#:8 *#11ee14c0#49fef1f5#0 dir#:6;
    const lightDist#:10 = distance#99709002(one: sample#:9, two: light#:2);
    const toLight#:11 = sample#:9 -#3de90345#70e0d6d0#1 light#:2;
    const marchToLight#:12 = shortestDistanceToSurface#b287cb44(
        sceneSDF#:0,
        iTime#:1,
        eye: sample#:9,
        marchingDirection: -1.0 *#11ee14c0#49fef1f5#0 normalize#35d412d2(v: toLight#:11),
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
    sceneSDF#:0: (float, Vec3#🗻🌻🤽‍♂️) => float,
    iTime#:1: float,
    light#:2: Vec3#🗻🌻🤽‍♂️,
    eye#:3: Vec3#🗻🌻🤽‍♂️,
    dist#:4: float,
    percent#:5: float,
    dir#:6: Vec3#🗻🌻🤽‍♂️,
    left#:7: int,
): float => {
    const sample#:9: Vec3#🗻🌻🤽‍♂️ = AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#0(
        eye#:3,
        ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(percent#:5 * dist#:4, dir#:6),
    );
    const lightDist#:10: float = distance#😄(sample#:9, light#:2);
    if shortestDistanceToSurface#🦽(
        sceneSDF#:0,
        iTime#:1,
        sample#:9,
        ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(
            -1,
            normalize#☕🧑‍🏫🛩️(AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(sample#:9, light#:2)),
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
export const hash_27b9b3c4: (arg_0: (arg_0: number, arg_1: t_1b597af1) => number, arg_1: number, arg_2: t_1b597af1, arg_3: t_1b597af1, arg_4: number, arg_5: number, arg_6: t_1b597af1, arg_7: number) => number = (sceneSDF: (arg_0: number, arg_1: t_1b597af1) => number, iTime: number, light: t_1b597af1, eye$3: t_1b597af1, dist$4: number, percent: number, dir: t_1b597af1, left: number) => {
  let sample: t_1b597af1 = hash_3de90345.h70e0d6d0_0(eye$3, hash_11ee14c0.h49fef1f5_0(percent * dist$4, dir));
  let lightDist: number = hash_99709002(sample, light);

  if (hash_b287cb44(sceneSDF, iTime, sample, hash_11ee14c0.h49fef1f5_0(-1, hash_35d412d2(hash_3de90345.h70e0d6d0_1(sample, light))), 0, lightDist, hash_62404440) >= lightDist - 0.1) {
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
const white#7579bd1c = Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: 1.0}
Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 1, x: 1, y: 1}
```
*/
export const hash_7579bd1c: t_1b597af1 = ({
  type: "Vec3",
  x: 1,
  y: 1,
  z: 1
} as t_1b597af1);

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
const isPointingTowardLight#4c23c7fc = (
    sceneSDF#:0: (float#builtin, Vec3#1b597af1) ={}> float#builtin,
    iTime#:1: float#builtin,
    p#:2: Vec3#1b597af1,
    lightPos#:3: Vec3#1b597af1,
): bool#builtin ={}> {
    const N#:4 = estimateNormal#57396b92(sceneSDF#:0, iTime#:1, p#:2);
    const L#:5 = normalize#35d412d2(v: lightPos#:3 -#3de90345#70e0d6d0#1 p#:2);
    const dotLN#:6 = dot#489fc39f(a: L#:5, b: N#:4);
    dotLN#:6 >=#builtin 0.0;
}
(
    sceneSDF#:0: (float, Vec3#🗻🌻🤽‍♂️) => float,
    iTime#:1: float,
    p#:2: Vec3#🗻🌻🤽‍♂️,
    lightPos#:3: Vec3#🗻🌻🤽‍♂️,
): bool => dot#☁️🪀💢😃(
    normalize#☕🧑‍🏫🛩️(AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(lightPos#:3, p#:2)),
    estimateNormal#🌙🏵️🚶‍♀️😃(sceneSDF#:0, iTime#:1, p#:2),
) >= 0
```
*/
export const hash_4c23c7fc: (arg_0: (arg_0: number, arg_1: t_1b597af1) => number, arg_1: number, arg_2: t_1b597af1, arg_3: t_1b597af1) => boolean = (sceneSDF: (arg_0: number, arg_1: t_1b597af1) => number, iTime: number, p: t_1b597af1, lightPos: t_1b597af1) => hash_489fc39f(hash_35d412d2(hash_3de90345.h70e0d6d0_1(lightPos, p)), hash_57396b92(sceneSDF, iTime, p)) >= 0;

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
const cross#22741973 = (one#:0: Vec3#1b597af1, two#:1: Vec3#1b597af1): Vec3#1b597af1 ={}> Vec3#1b597af1{
    x#78566d10#0: one#:0.y#78566d10#1 *#builtin two#:1.z#1b597af1#0 
        -#builtin two#:1.y#78566d10#1 *#builtin one#:0.z#1b597af1#0,
    y#78566d10#1: one#:0.z#1b597af1#0 *#builtin two#:1.x#78566d10#0 
        -#builtin two#:1.z#1b597af1#0 *#builtin one#:0.x#78566d10#0,
    z#1b597af1#0: one#:0.x#78566d10#0 *#builtin two#:1.y#78566d10#1 
        -#builtin two#:1.x#78566d10#0 *#builtin one#:0.y#78566d10#1,
}
(one#:0: Vec3#🗻🌻🤽‍♂️, two#:1: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{
    z: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    x: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * two#:1.#Vec3#🗻🌻🤽‍♂️#0 - two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * one#:0.#Vec3#🗻🌻🤽‍♂️#0,
    y: one#:0.#Vec3#🗻🌻🤽‍♂️#0 * two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - two#:1.#Vec3#🗻🌻🤽‍♂️#0 * one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
}
```
*/
export const hash_22741973: (arg_0: t_1b597af1, arg_1: t_1b597af1) => t_1b597af1 = (one: t_1b597af1, two: t_1b597af1) => ({
  type: "Vec3",
  x: one.y * two.z - two.y * one.z,
  y: one.z * two.x - two.z * one.x,
  z: one.x * two.y - two.x * one.y
} as t_1b597af1);

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
const opRepLim#22682d50 = (p#:0: Vec3#1b597af1, c#:1: float#builtin, l#:2: Vec3#1b597af1): Vec3#1b597af1 ={}> {
    p#:0 
        -#3de90345#70e0d6d0#1 c#:1 
            *#11ee14c0#49fef1f5#0 clamp#83e54cbc(
                v: round#29c3f03c(v: p#:0 /#68cd48ad#2b90cfd4#0 c#:1),
                min: NegVec3#68c0a879."-"#f6e074a4#0(l#:2),
                max: l#:2,
            );
}
(p#:0: Vec3#🗻🌻🤽‍♂️, c#:1: float, l#:2: Vec3#🗻🌻🤽‍♂️): Vec3#🗻🌻🤽‍♂️ => AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
    p#:0,
    ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(
        c#:1,
        clamp#👂(
            round#😎🤷‍♂️🥪(ScaleVec3Rev#🤜🛑🍞😃.#Div#⚽🤮🍡#0(p#:0, c#:1)),
            NegVec3#💓😌🍞😃.#Neg#👆#0(l#:2),
            l#:2,
        ),
    ),
)
```
*/
export const hash_22682d50: (arg_0: t_1b597af1, arg_1: number, arg_2: t_1b597af1) => t_1b597af1 = (p$0: t_1b597af1, c: number, l: t_1b597af1) => hash_3de90345.h70e0d6d0_1(p$0, hash_11ee14c0.h49fef1f5_0(c, hash_83e54cbc(hash_29c3f03c(hash_68cd48ad.h2b90cfd4_0(p$0, c)), hash_68c0a879.hf6e074a4_0(l), l)));

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
const AddSubVec2_#52aa929e = AddSub#70e0d6d0<Vec2#78566d10, float#builtin, Vec2#78566d10>{
    "+"#70e0d6d0#0: (one#:0: Vec2#78566d10, two#:1: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: one#:0.x#78566d10#0 +#builtin two#:1,
        y#78566d10#1: one#:0.y#78566d10#1 +#builtin two#:1,
    },
    "-"#70e0d6d0#1: (one#:2: Vec2#78566d10, two#:3: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: one#:2.x#78566d10#0 -#builtin two#:3,
        y#78566d10#1: one#:2.y#78566d10#1 -#builtin two#:3,
    },
}
AddSub#🍼🥵🗽😃{TODO SPREADs}{
    h70e0d6d0_0: (one#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, two#:1: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + two#:1,
        y: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + two#:1,
    },
    h70e0d6d0_1: (one#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃, two#:3: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - two#:3,
        y: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - two#:3,
    },
}
```
*/
export const hash_52aa929e: t_70e0d6d0<t_78566d10, number, t_78566d10> = ({
  type: "70e0d6d0",
  h70e0d6d0_0: (one: t_78566d10, two: number) => ({
    type: "Vec2",
    x: one.x + two,
    y: one.y + two
  } as t_78566d10),
  h70e0d6d0_1: (one$2: t_78566d10, two$3: number) => ({
    type: "Vec2",
    x: one$2.x - two$3,
    y: one$2.y - two$3
  } as t_78566d10)
} as t_70e0d6d0<t_78566d10, number, t_78566d10>);

/**
```
const rec volumetric#8c21cbdc = (
    sceneSDF#:0: (float#builtin, Vec3#1b597af1) ={}> float#builtin,
    iTime#:1: float#builtin,
    seed#:2: Vec2#78566d10,
    light#:3: Vec3#1b597af1,
    eye#:4: Vec3#1b597af1,
    dist#:5: float#builtin,
    dir#:6: Vec3#1b597af1,
    current#:7: float#builtin,
    left#:8: int#builtin,
    total#:9: float#builtin,
): float#builtin ={}> {
    if left#:8 <=#builtin 0 {
        current#:7;
    } else {
        const percent#:10 = left#:8 as#6f186ad1 float#builtin /#builtin total#:9;
        const sample#:11 = volumetricSample#27b9b3c4(
            sceneSDF#:0,
            iTime#:1,
            light#:3,
            eye#:4,
            dist#:5,
            percent#:10,
            dir#:6,
            left#:8,
        );
        8c21cbdc#self(
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
    sceneSDF#:0: (float, Vec3#🗻🌻🤽‍♂️) => float,
    iTime#:1: float,
    seed#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    light#:3: Vec3#🗻🌻🤽‍♂️,
    eye#:4: Vec3#🗻🌻🤽‍♂️,
    dist#:5: float,
    dir#:6: Vec3#🗻🌻🤽‍♂️,
    current#:7: float,
    left#:8: int,
    total#:9: float,
): float => {
    for (; left#:8 > 0; left#:8 = left#:8 - 1) {
        current#:7 = current#:7 + volumetricSample#🎎🍃🥝(
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
export const hash_8c21cbdc: (arg_0: (arg_0: number, arg_1: t_1b597af1) => number, arg_1: number, arg_2: t_78566d10, arg_3: t_1b597af1, arg_4: t_1b597af1, arg_5: number, arg_6: t_1b597af1, arg_7: number, arg_8: number, arg_9: number) => number = (sceneSDF: (arg_0: number, arg_1: t_1b597af1) => number, iTime: number, seed: t_78566d10, light$3: t_1b597af1, eye$4: t_1b597af1, dist$5: number, dir: t_1b597af1, current: number, left$8: number, total: number) => {
  for (; left$8 > 0; left$8 = left$8 - 1) {
    current = current + hash_27b9b3c4(sceneSDF, iTime, light$3, eye$4, dist$5, hash_6f186ad1.hAs_0(left$8) / total, dir, left$8);
    continue;
  }

  return current;
};

/**
```
const lightSurface#12f958e8 = (
    sceneSDF#:0: (float#builtin, Vec3#1b597af1) ={}> float#builtin,
    iTime#:1: float#builtin,
    worldPosForPixel#:2: Vec3#1b597af1,
    light1Pos#:3: Vec3#1b597af1,
    light#:4: float#builtin,
    hit#:5: float#builtin,
): Vec4#38dc9122 ={}> {
    if isPointingTowardLight#4c23c7fc(
        sceneSDF#:0,
        iTime#:1,
        p: worldPosForPixel#:2,
        lightPos: light1Pos#:3,
    ) {
        const toLight#:6 = light1Pos#:3 -#3de90345#70e0d6d0#1 worldPosForPixel#:2;
        const marchToLight#:7 = shortestDistanceToSurface#b287cb44(
            sceneSDF#:0,
            iTime#:1,
            eye: light1Pos#:3,
            marchingDirection: -1.0 *#11ee14c0#49fef1f5#0 normalize#35d412d2(v: toLight#:6),
            start: MIN_DIST#f2cd39b8,
            end: MAX_DIST#0ce717e6,
            stepsLeft: MAX_MARCHING_STEPS#62404440,
        );
        if marchToLight#:7 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c *#builtin 10.0 {
            Vec4#38dc9122{...white#7579bd1c *#a5e3bb34#49fef1f5#0 light#:4, w#38dc9122#0: 1.0};
        } else {
            const offset#:8 = marchToLight#:7 -#builtin length#78bdad43(v: toLight#:6);
            const penumbra#:9 = 0.1;
            if offset#:8 <#builtin -EPSILON#ec7f8d1c *#builtin 1000.0 {
                Vec4#38dc9122{...white#7579bd1c *#a5e3bb34#49fef1f5#0 light#:4, w#38dc9122#0: 1.0};
            } else {
                Vec4#38dc9122{...white#7579bd1c *#a5e3bb34#49fef1f5#0 hit#:5, w#38dc9122#0: 1.0};
            };
        };
    } else {
        Vec4#38dc9122{...white#7579bd1c *#a5e3bb34#49fef1f5#0 light#:4, w#38dc9122#0: 1.0};
    };
}
(
    sceneSDF#:0: (float, Vec3#🗻🌻🤽‍♂️) => float,
    iTime#:1: float,
    worldPosForPixel#:2: Vec3#🗻🌻🤽‍♂️,
    light1Pos#:3: Vec3#🗻🌻🤽‍♂️,
    light#:4: float,
    hit#:5: float,
): Vec4#🧑‍🎨🎪🌔 => {
    if isPointingTowardLight#♥️🙋‍♀️👀😃(sceneSDF#:0, iTime#:1, worldPosForPixel#:2, light1Pos#:3) {
        const toLight#:6: Vec3#🗻🌻🤽‍♂️ = AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
            light1Pos#:3,
            worldPosForPixel#:2,
        );
        const marchToLight#:7: float = shortestDistanceToSurface#🦽(
            sceneSDF#:0,
            iTime#:1,
            light1Pos#:3,
            ScaleVec3#🦷🕤👩‍💻.#Mul#🐺🎇🤟😃#0(-1, normalize#☕🧑‍🏫🛩️(toLight#:6)),
            MIN_DIST#🤾‍♂️,
            MAX_DIST#🥅👬👨‍🦰,
            MAX_MARCHING_STEPS#😟😗🦦😃,
        );
        if marchToLight#:7 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 * 10 {
            return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
        } else {
            if marchToLight#:7 - length#🤵‍♀️⌛🌒😃(toLight#:6) < -EPSILON#🧑‍💻 * 1000 {
                return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
            } else {
                return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
            };
        };
    } else {
        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
    };
}
```
*/
export const hash_12f958e8: (arg_0: (arg_0: number, arg_1: t_1b597af1) => number, arg_1: number, arg_2: t_1b597af1, arg_3: t_1b597af1, arg_4: number, arg_5: number) => t_38dc9122 = (sceneSDF: (arg_0: number, arg_1: t_1b597af1) => number, iTime: number, worldPosForPixel: t_1b597af1, light1Pos: t_1b597af1, light$4: number, hit: number) => {
  if (hash_4c23c7fc(sceneSDF, iTime, worldPosForPixel, light1Pos)) {
    let toLight: t_1b597af1 = hash_3de90345.h70e0d6d0_1(light1Pos, worldPosForPixel);
    let marchToLight: number = hash_b287cb44(sceneSDF, iTime, light1Pos, hash_11ee14c0.h49fef1f5_0(-1, hash_35d412d2(toLight)), hash_f2cd39b8, hash_0ce717e6, hash_62404440);

    if (marchToLight > hash_0ce717e6 - hash_ec7f8d1c * 10) {
      return ({ ...hash_a5e3bb34.h49fef1f5_0(hash_7579bd1c, light$4),
        type: "Vec4",
        w: 1
      } as t_38dc9122);
    } else {
      if (marchToLight - hash_78bdad43(toLight) < -hash_ec7f8d1c * 1000) {
        return ({ ...hash_a5e3bb34.h49fef1f5_0(hash_7579bd1c, light$4),
          type: "Vec4",
          w: 1
        } as t_38dc9122);
      } else {
        return ({ ...hash_a5e3bb34.h49fef1f5_0(hash_7579bd1c, hit),
          type: "Vec4",
          w: 1
        } as t_38dc9122);
      }
    }
  } else {
    return ({ ...hash_a5e3bb34.h49fef1f5_0(hash_7579bd1c, light$4),
      type: "Vec4",
      w: 1
    } as t_38dc9122);
  }
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
const viewMatrix#40b5a23c = (eye#:0: Vec3#1b597af1, center#:1: Vec3#1b597af1, up#:2: Vec3#1b597af1): Mat4#314455dc ={}> {
    const f#:3 = normalize#35d412d2(v: center#:1 -#3de90345#70e0d6d0#1 eye#:0);
    const s#:4 = normalize#35d412d2(v: cross#22741973(one: f#:3, two: up#:2));
    const u#:5 = cross#22741973(one: s#:4, two: f#:3);
    Mat4#314455dc{
        r1#314455dc#0: Vec4#38dc9122{...s#:4, w#38dc9122#0: 0.0},
        r2#314455dc#1: Vec4#38dc9122{...u#:5, w#38dc9122#0: 0.0},
        r3#314455dc#2: Vec4#38dc9122{...NegVec3#68c0a879."-"#f6e074a4#0(f#:3), w#38dc9122#0: 0.0},
        r4#314455dc#3: vec4#1eaae93f(x: 0.0, y: 0.0, z: 0.0, w: 1.0),
    };
}
(eye#:0: Vec3#🗻🌻🤽‍♂️, center#:1: Vec3#🗻🌻🤽‍♂️, up#:2: Vec3#🗻🌻🤽‍♂️): Mat4#👩‍👩‍👦‍👦👩‍🏭🕋 => {
    const f#:3: Vec3#🗻🌻🤽‍♂️ = normalize#☕🧑‍🏫🛩️(
        AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(center#:1, eye#:0),
    );
    const s#:4: Vec3#🗻🌻🤽‍♂️ = normalize#☕🧑‍🏫🛩️(cross#🚶‍♀️👩‍🏫🦡(f#:3, up#:2));
    return Mat4#👩‍👩‍👦‍👦👩‍🏭🕋{TODO SPREADs}{
        r1: Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 0, z: _#:0},
        r2: Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 0, z: _#:0},
        r3: Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 0, z: _#:0},
        r4: vec4#👲🥟👥(0, 0, 0, 1),
    };
}
```
*/
export const hash_40b5a23c: (arg_0: t_1b597af1, arg_1: t_1b597af1, arg_2: t_1b597af1) => t_314455dc = (eye$0: t_1b597af1, center: t_1b597af1, up: t_1b597af1) => {
  let f: t_1b597af1 = hash_35d412d2(hash_3de90345.h70e0d6d0_1(center, eye$0));
  let s: t_1b597af1 = hash_35d412d2(hash_22741973(f, up));
  return ({
    type: "Mat4",
    r1: ({ ...s,
      type: "Vec4",
      w: 0
    } as t_38dc9122),
    r2: ({ ...hash_22741973(s, f),
      type: "Vec4",
      w: 0
    } as t_38dc9122),
    r3: ({ ...hash_68c0a879.hf6e074a4_0(f),
      type: "Vec4",
      w: 0
    } as t_38dc9122),
    r4: hash_1eaae93f(0, 0, 0, 1)
  } as t_314455dc);
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
export const hash_4f8fc2b8: (arg_0: number, arg_1: t_78566d10, arg_2: t_78566d10) => t_1b597af1 = (fieldOfView: number, size: t_78566d10, fragCoord: t_78566d10) => hash_35d412d2(hash_1b424e12(hash_482bc839.h70e0d6d0_1(fragCoord, hash_72d6e294.h2b90cfd4_0(size, 2)), -(size.y / tan(hash_19bbb79c(fieldOfView) / 2))));

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
const sceneSDF#715cdc8c = (iTime#:0: float#builtin, samplePoint#:1: Vec3#1b597af1): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p1#:3 = opRepLim#22682d50(
        p: samplePoint#:1,
        c: 0.25,
        l: Vec3#1b597af1{x#78566d10#0: 2.0, y#78566d10#1: 0.0, z#1b597af1#0: 0.0},
    );
    min#builtin(
        max#builtin(
            max#199da620(
                v: abs#99c811a0(v: p1#:3) 
                    -#3de90345#70e0d6d0#1 Vec3#1b597af1{
                        x#78566d10#0: 0.1,
                        y#78566d10#1: 0.3,
                        z#1b597af1#0: 0.6,
                    },
            ),
            -max#199da620(
                v: abs#99c811a0(v: p1#:3) 
                    -#3de90345#70e0d6d0#1 Vec3#1b597af1{
                        x#78566d10#0: 0.11,
                        y#78566d10#1: 0.2,
                        z#1b597af1#0: 0.55,
                    },
            ),
        ),
        max#199da620(
            v: abs#99c811a0(
                    v: samplePoint#:1 
                        -#3de90345#70e0d6d0#1 Vec3#1b597af1{
                            x#78566d10#0: 0.0,
                            y#78566d10#1: 1.0,
                            z#1b597af1#0: -0.1,
                        },
                ) 
                -#3de90345#70e0d6d0#1 Vec3#1b597af1{
                    x#78566d10#0: 2.1,
                    y#78566d10#1: 0.1,
                    z#1b597af1#0: 2.1,
                },
        ),
    );
}
(iTime#:0: float, samplePoint#:1: Vec3#🗻🌻🤽‍♂️): float => {
    const p1#:3: Vec3#🗻🌻🤽‍♂️ = opRepLim#🦸🐽🦘(
        samplePoint#:1,
        0.25,
        Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 2, y: 0},
    );
    return min(
        max(
            max#🐻‍❄️🛎️🏄(
                AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
                    abs#🏊‍♂️(p1#:3),
                    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0.6, x: 0.1, y: 0.3},
                ),
            ),
            -max#🐻‍❄️🛎️🏄(
                AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
                    abs#🏊‍♂️(p1#:3),
                    Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0.55, x: 0.11, y: 0.2},
                ),
            ),
        ),
        max#🐻‍❄️🛎️🏄(
            AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
                abs#🏊‍♂️(
                    AddSubVec3#🦼🦕🏏.#AddSub#🍼🥵🗽😃#1(
                        samplePoint#:1,
                        Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: -0.1, x: 0, y: 1},
                    ),
                ),
                Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 2.1, x: 2.1, y: 0.1},
            ),
        ),
    );
}
```
*/
export const hash_715cdc8c: (arg_0: number, arg_1: t_1b597af1) => number = (iTime$0: number, samplePoint: t_1b597af1) => {
  let p1: t_1b597af1 = hash_22682d50(samplePoint, 0.25, ({
    type: "Vec3",
    x: 2,
    y: 0,
    z: 0
  } as t_1b597af1));
  return min(max(hash_199da620(hash_3de90345.h70e0d6d0_1(hash_99c811a0(p1), ({
    type: "Vec3",
    x: 0.1,
    y: 0.3,
    z: 0.6
  } as t_1b597af1))), -hash_199da620(hash_3de90345.h70e0d6d0_1(hash_99c811a0(p1), ({
    type: "Vec3",
    x: 0.11,
    y: 0.2,
    z: 0.55
  } as t_1b597af1)))), hash_199da620(hash_3de90345.h70e0d6d0_1(hash_99c811a0(hash_3de90345.h70e0d6d0_1(samplePoint, ({
    type: "Vec3",
    x: 0,
    y: 1,
    z: -0.1
  } as t_1b597af1))), ({
    type: "Vec3",
    x: 2.1,
    y: 0.1,
    z: 2.1
  } as t_1b597af1))));
};

/**
```
const fishingBoueys#05c37492 = (
    sceneSDF#:0: (float#builtin, Vec3#1b597af1) ={}> float#builtin,
    iTime#:1: float#builtin,
    fragCoord#:2: Vec2#78566d10,
    iResolution#:3: Vec2#78566d10,
    uCamera#:4: Vec3#1b597af1,
): Vec4#38dc9122 ={}> {
    const viewDir#:5 = rayDirection#4f8fc2b8(fieldOfView: 45.0, size: iResolution#:3, fragCoord#:2);
    const eye#:6 = uCamera#:4;
    const viewToWorld#:7 = viewMatrix#40b5a23c(
        eye#:6,
        center: Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 0.0, z#1b597af1#0: 0.0},
        up: Vec3#1b597af1{x#78566d10#0: 0.0, y#78566d10#1: 1.0, z#1b597af1#0: 0.0},
    );
    const worldDir#:8 = xyz#052cd680(
        v: viewToWorld#:7 *#5209b424#49fef1f5#0 Vec4#38dc9122{...viewDir#:5, w#38dc9122#0: 0.0},
    );
    const dir#:9 = worldDir#:8;
    const dist#:10 = shortestDistanceToSurface#b287cb44(
        sceneSDF#:0,
        iTime#:1,
        eye#:6,
        marchingDirection: dir#:9,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    if dist#:10 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c {
        Vec4#38dc9122{
            z#1b597af1#0: 0.0,
            x#78566d10#0: 1.0,
            y#78566d10#1: 1.0,
            w#38dc9122#0: 1.0,
        };
    } else {
        const worldPosForPixel#:11 = eye#:6 
            +#3de90345#70e0d6d0#0 dist#:10 *#11ee14c0#49fef1f5#0 dir#:9;
        const light1Pos#:12 = Vec3#1b597af1{
            x#78566d10#0: 0.15 +#builtin sin#builtin(iTime#:1 /#builtin 2.0) /#builtin 1.0,
            y#78566d10#1: 0.0,
            z#1b597af1#0: 0.05,
        };
        const surfaces#:13 = lightSurface#12f958e8(
            sceneSDF#:0,
            iTime#:1,
            worldPosForPixel#:11,
            light1Pos#:12,
            light: 0.0,
            hit: 0.01,
        );
        const samples#:14 = 10.0;
        const brightness#:15 = volumetric#8c21cbdc(
                    sceneSDF#:0,
                    iTime#:1,
                    seed: fragCoord#:2 /#85252e14#2b90cfd4#0 iResolution#:3 
                        +#52aa929e#70e0d6d0#0 iTime#:1 /#builtin 1000.0,
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
        Vec4#38dc9122{
            ...white#7579bd1c *#a5e3bb34#49fef1f5#0 brightness#:15 
                    *#a5e3bb34#49fef1f5#0 brightness#:15 
                *#a5e3bb34#49fef1f5#0 brightness#:15,
            w#38dc9122#0: 1.0,
        };
    };
}
(
    sceneSDF#:0: (float, Vec3#🗻🌻🤽‍♂️) => float,
    iTime#:1: float,
    fragCoord#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    iResolution#:3: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    uCamera#:4: Vec3#🗻🌻🤽‍♂️,
): Vec4#🧑‍🎨🎪🌔 => {
    const worldDir#:8: Vec3#🗻🌻🤽‍♂️ = xyz#🥔🚑😞(
        MatByVector#😶🍇👨‍🎤😃.#Mul#🐺🎇🤟😃#0(
            viewMatrix#🦎🧟😊😃(
                uCamera#:4,
                Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 0, y: 0},
                Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 0, y: 1},
            ),
            Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 0, z: _#:0},
        ),
    );
    const dist#:10: float = shortestDistanceToSurface#🦽(
        sceneSDF#:0,
        iTime#:1,
        uCamera#:4,
        worldDir#:8,
        MIN_DIST#🤾‍♂️,
        MAX_DIST#🥅👬👨‍🦰,
        MAX_MARCHING_STEPS#😟😗🦦😃,
    );
    if dist#:10 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 {
        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: 0};
    } else {
        const brightness#:15: float = volumetric#🥏(
            sceneSDF#:0,
            iTime#:1,
            AddSubVec2_#🌯🥘👩‍🚀😃.#AddSub#🍼🥵🗽😃#0(
                MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:2, iResolution#:3),
                iTime#:1 / 1000,
            ),
            Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0.05, x: 0.15 + sin(iTime#:1 / 2) / 1, y: 0},
            uCamera#:4,
            dist#:10,
            worldDir#:8,
            0,
            FloatAsInt#🐒🍕🏃‍♂️.#As#😉#0(10),
            10,
        ) * 3 / 10;
        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
    };
}
```
*/
export const hash_05c37492: (arg_0: (arg_0: number, arg_1: t_1b597af1) => number, arg_1: number, arg_2: t_78566d10, arg_3: t_78566d10, arg_4: t_1b597af1) => t_38dc9122 = (sceneSDF: (arg_0: number, arg_1: t_1b597af1) => number, iTime: number, fragCoord: t_78566d10, iResolution: t_78566d10, uCamera: t_1b597af1) => {
  let worldDir: t_1b597af1 = hash_052cd680(hash_5209b424.h49fef1f5_0(hash_40b5a23c(uCamera, ({
    type: "Vec3",
    x: 0,
    y: 0,
    z: 0
  } as t_1b597af1), ({
    type: "Vec3",
    x: 0,
    y: 1,
    z: 0
  } as t_1b597af1)), ({ ...hash_4f8fc2b8(45, iResolution, fragCoord),
    type: "Vec4",
    w: 0
  } as t_38dc9122)));
  let dist$10: number = hash_b287cb44(sceneSDF, iTime, uCamera, worldDir, hash_f2cd39b8, hash_0ce717e6, hash_62404440);

  if (dist$10 > hash_0ce717e6 - hash_ec7f8d1c) {
    return ({
      type: "Vec4",
      z: 0,
      x: 1,
      y: 1,
      w: 1
    } as t_38dc9122);
  } else {
    let brightness: number = hash_8c21cbdc(sceneSDF, iTime, hash_52aa929e.h70e0d6d0_0(hash_85252e14.h2b90cfd4_0(fragCoord, iResolution), iTime / 1000), ({
      type: "Vec3",
      x: 0.15 + sin(iTime / 2) / 1,
      y: 0,
      z: 0.05
    } as t_1b597af1), uCamera, dist$10, worldDir, 0, hash_184a69ed.hAs_0(10), 10) * 3 / 10;
    return ({ ...hash_a5e3bb34.h49fef1f5_0(hash_a5e3bb34.h49fef1f5_0(hash_a5e3bb34.h49fef1f5_0(hash_7579bd1c, brightness), brightness), brightness),
      type: "Vec4",
      w: 1
    } as t_38dc9122);
  }
};

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
const vec2#3ac18ce8 = (x#:0: float#builtin, y#:1: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
    x#78566d10#0: x#:0,
    y#78566d10#1: y#:1,
}
(x#:0: float, y#:1: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
    x: x#:0,
    y: y#:1,
}
```
*/
export const hash_3ac18ce8: (arg_0: number, arg_1: number) => t_78566d10 = (x: number, y: number) => ({
  type: "Vec2",
  x: x,
  y: y
} as t_78566d10);

/**
```
const round#6e17a683 = (v#:0: Vec2#78566d10): Vec2#78566d10 ={}> Vec2#78566d10{
    x#78566d10#0: round#builtin(v#:0.x#78566d10#0),
    y#78566d10#1: round#builtin(v#:0.y#78566d10#1),
}
(v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
    x: round(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0),
    y: round(v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1),
}
```
*/
export const hash_6e17a683: (arg_0: t_78566d10) => t_78566d10 = (v: t_78566d10) => ({
  type: "Vec2",
  x: round(v.x),
  y: round(v.y)
} as t_78566d10);

/**
```
const Vec2float#4adf81cc = Mul#49fef1f5<Vec2#78566d10, float#builtin, Vec2#78566d10>{
    "*"#49fef1f5#0: (v#:0: Vec2#78566d10, scale#:1: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: v#:0.x#78566d10#0 *#builtin scale#:1,
        y#78566d10#1: v#:0.y#78566d10#1 *#builtin scale#:1,
    },
}
Mul#🐺🎇🤟😃{TODO SPREADs}{
    h49fef1f5_0: (v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, scale#:1: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * scale#:1,
        y: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * scale#:1,
    },
}
```
*/
export const hash_4adf81cc: t_49fef1f5<t_78566d10, number, t_78566d10> = ({
  type: "49fef1f5",
  h49fef1f5_0: (v: t_78566d10, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_78566d10)
} as t_49fef1f5<t_78566d10, number, t_78566d10>);

/**
```
const randFolks#7ef8b71c = (env#:0: GLSLEnv#5cec7724, fragCoord#:1: Vec2#78566d10): Vec4#38dc9122 ={}> {
    const scale#:2 = 40.0;
    const small#:3 = round#6e17a683(v: fragCoord#:1 /#72d6e294#2b90cfd4#0 scale#:2) 
        *#4adf81cc#49fef1f5#0 scale#:2;
    const small#:4 = vec2#3ac18ce8(
        x: small#:3.x#78566d10#0,
        y: small#:3.y#78566d10#1 +#builtin env#:0.time#5cec7724#0,
    );
    const v#:5 = random#d9cae79c(st: small#:4 /#85252e14#2b90cfd4#0 env#:0.resolution#5cec7724#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const bouey#:6 = fishingBoueys#05c37492(
        sceneSDF#715cdc8c,
        iTime: env#:0.time#5cec7724#0,
        fragCoord#:1,
        iResolution: env#:0.resolution#5cec7724#1,
        uCamera: env#:0.camera#5cec7724#2 *#a5e3bb34#49fef1f5#0 -1.0,
    );
    bouey#:6;
}
(env#:0: GLSLEnv#🎪🌇👪😃, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec4#🧑‍🎨🎪🌔 => fishingBoueys#🗨️🧓👿(
    sceneSDF#💦🚓⛲😃,
    env#:0.#GLSLEnv#🎪🌇👪😃#0,
    fragCoord#:1,
    env#:0.#GLSLEnv#🎪🌇👪😃#1,
    ScaleVec3_#🚐.#Mul#🐺🎇🤟😃#0(env#:0.#GLSLEnv#🎪🌇👪😃#2, -1),
)
```
*/
export const hash_7ef8b71c: (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122 = (env: t_5cec7724, fragCoord$1: t_78566d10) => hash_05c37492(hash_715cdc8c, env.time, fragCoord$1, env.resolution, hash_a5e3bb34.h49fef1f5_0(env.camera, -1));
export const randFolks = hash_7ef8b71c;