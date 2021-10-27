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
@unique(0.43555946525519457) type Circle#637d197c = {
    pos: Vec2#78566d10,
    r: float#builtin,
}
```
*/
type t_637d197c = {
  type: "637d197c";
  h637d197c_0: t_78566d10;
  h637d197c_1: number;
};

/**
```
@unique(0.07079698207722875) type Min#6fe15626<T#:0> = {
    "--": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_6fe15626<T> = {
  type: "6fe15626";
  h6fe15626_0: (arg_0: T, arg_1: T) => T;
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
const Min#37abd7fa = Min#6fe15626<float#builtin>{"--"#6fe15626#0: min#builtin}
Min#🦘😫🏡😃{TODO SPREADs}{h6fe15626_0: min}
```
*/
export const hash_37abd7fa: t_6fe15626<number> = ({
  type: "6fe15626",
  h6fe15626_0: min
} as t_6fe15626<number>);

/**
```
const circleSDF#65933924 = (p#:0: Vec2#78566d10, circle#:1: Circle#637d197c): float#builtin ={}> {
    length#9702bed4(v: p#:0 -#482bc839#70e0d6d0#1 circle#:1.pos#637d197c#0) 
        -#builtin circle#:1.r#637d197c#1;
}
(p#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, circle#:1: Circle#👩‍🦯🛺🦚😃): float => length#🍶(
    AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#1(p#:0, circle#:1.#Circle#👩‍🦯🛺🦚😃#0),
) - circle#:1.#Circle#👩‍🦯🛺🦚😃#1
```
*/
export const hash_65933924: (arg_0: t_78566d10, arg_1: t_637d197c) => number = (p: t_78566d10, circle: t_637d197c) => hash_9702bed4(hash_482bc839.h70e0d6d0_1(p, circle.h637d197c_0)) - circle.h637d197c_1;

/**
```
const hello#13920370 = (env#:0: GLSLEnv#5cec7724, fragCoord#:1: Vec2#78566d10): Vec4#38dc9122 ={}> {
    const circle#:2 = Circle#637d197c{
        pos#637d197c#0: env#:0.mouse#5cec7724#3,
        r#637d197c#1: 40.0 
            +#builtin cos#builtin(env#:0.time#5cec7724#0 *#builtin 4.0) *#builtin 20.0,
    };
    const color#:3 = if circleSDF#65933924(p: fragCoord#:1, circle#:2) 
            --#37abd7fa#6fe15626#0 circleSDF#65933924(
                p: fragCoord#:1,
                circle: Circle#637d197c{
                    pos#637d197c#0: env#:0.mouse#5cec7724#3 
                        +#482bc839#70e0d6d0#0 Vec2#78566d10{
                            x#78566d10#0: 10.0,
                            y#78566d10#1: 20.0,
                        },
                    r#637d197c#1: 30.0,
                },
            ) 
        <#builtin 0.0 {
        switch modInt#builtin(fragCoord#:1.x#78566d10#0 as#184a69ed int#builtin, 2) {
            0 => Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 0.0, z#1b597af1#0: 0.0},
            _ => Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: 0.0},
        };
    } else {
        abs#99c811a0(v: Vec3#1b597af1{x#78566d10#0: 1.0, y#78566d10#1: 1.0, z#1b597af1#0: -1.0});
    };
    Vec4#38dc9122{...color#:3, w#38dc9122#0: 1.0};
}
(env#:0: GLSLEnv#🎪🌇👪😃, fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec4#🧑‍🎨🎪🌔 => {
    const result#:5: Vec3#🗻🌻🤽‍♂️;
    const continueBlock#:6: bool = true;
    if Min#🧸🏝️🕓.#Min#🦘😫🏡😃#0(
        circleSDF#👩‍🎨👨‍🦰💮😃(
            fragCoord#:1,
            Circle#👩‍🦯🛺🦚😃{TODO SPREADs}{
                h637d197c_0: env#:0.#GLSLEnv#🎪🌇👪😃#3,
                h637d197c_1: 40 + cos(env#:0.#GLSLEnv#🎪🌇👪😃#0 * 4) * 20,
            },
        ),
        circleSDF#👩‍🎨👨‍🦰💮😃(
            fragCoord#:1,
            Circle#👩‍🦯🛺🦚😃{TODO SPREADs}{
                h637d197c_0: AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#0(
                    env#:0.#GLSLEnv#🎪🌇👪😃#3,
                    Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 10, y: 20},
                ),
                h637d197c_1: 30,
            },
        ),
    ) < 0 {
        if FloatAsInt#🐒🍕🏃‍♂️.#As#😉#0(fragCoord#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0) modInt 2 == 0 {
            result#:5 = Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 1, y: 0};
            continueBlock#:6 = false;
        };
        if continueBlock#:6 {
            result#:5 = Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: 0, x: 1, y: 1};
            continueBlock#:6 = false;
        };
    } else {
        result#:5 = abs#🏊‍♂️(Vec3#🗻🌻🤽‍♂️{TODO SPREADs}{z: -1, x: 1, y: 1});
        continueBlock#:6 = false;
    };
    return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: _#:0};
}
```
*/
export const hash_13920370: (arg_0: t_5cec7724, arg_1: t_78566d10) => t_38dc9122 = (env: t_5cec7724, fragCoord: t_78566d10) => {
  let result: t_1b597af1;
  let continueBlock: boolean = true;

  if (hash_37abd7fa.h6fe15626_0(hash_65933924(fragCoord, ({
    type: "637d197c",
    h637d197c_0: env.mouse,
    h637d197c_1: 40 + cos(env.time * 4) * 20
  } as t_637d197c)), hash_65933924(fragCoord, ({
    type: "637d197c",
    h637d197c_0: hash_482bc839.h70e0d6d0_0(env.mouse, ({
      type: "Vec2",
      x: 10,
      y: 20
    } as t_78566d10)),
    h637d197c_1: 30
  } as t_637d197c))) < 0) {
    if (modInt(hash_184a69ed.hAs_0(fragCoord.x), 2) === 0) {
      result = ({
        type: "Vec3",
        x: 1,
        y: 0,
        z: 0
      } as t_1b597af1);
      continueBlock = false;
    }

    if (continueBlock) {
      result = ({
        type: "Vec3",
        x: 1,
        y: 1,
        z: 0
      } as t_1b597af1);
      continueBlock = false;
    }
  } else {
    result = hash_99c811a0(({
      type: "Vec3",
      x: 1,
      y: 1,
      z: -1
    } as t_1b597af1));
    continueBlock = false;
  }

  return ({ ...result,
    type: "Vec4",
    w: 1
  } as t_38dc9122);
};
export const hello = hash_13920370;