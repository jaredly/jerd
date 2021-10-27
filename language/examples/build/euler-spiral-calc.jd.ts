import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

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
const thetaPos2#6a70223c = (theta#:0: float#builtin): Vec2#78566d10 ={}> vec2#3ac18ce8(
    x: cos#builtin(theta#:0),
    y: sin#builtin(theta#:0),
)
(theta#:0: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => vec2#🙅‍♀️👻🌈(cos(theta#:0), sin(theta#:0))
```
*/
export const hash_6a70223c: (arg_0: number) => t_78566d10 = (theta: number) => hash_3ac18ce8(cos(theta), sin(theta));

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
const rec accurateSpiral#722abb92 = (
    at#:0: int#builtin,
    by#:1: float#builtin,
    length#:2: float#builtin,
    theta#:3: float#builtin,
    pos#:4: Vec2#78566d10,
    points#:5: Array#builtin<Vec2#78566d10>,
    max#:6: int#builtin,
): Array#builtin<Vec2#78566d10> ={}> {
    if at#:0 >=#builtin max#:6 {
        points#:5;
    } else {
        const next#:7 = theta#:3 +#builtin by#:1 *#builtin at#:0 as#6f186ad1 float#builtin;
        const nextPos#:8 = pos#:4 
            +#482bc839#70e0d6d0#0 thetaPos2#6a70223c(theta#:3) *#4adf81cc#49fef1f5#0 length#:2;
        722abb92#self(
            at#:0 +#builtin 1,
            by#:1,
            length#:2,
            next#:7,
            nextPos#:8,
            <Vec2#78566d10>[...points#:5, nextPos#:8],
            max#:6,
        );
    };
}
(
    at#:0: int,
    by#:1: float,
    length#:2: float,
    theta#:3: float,
    pos#:4: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    points#:5: Array<Vec2#🧑‍🔧🏄‍♀️🕤😃>,
    max#:6: int,
): Array<Vec2#🧑‍🔧🏄‍♀️🕤😃> => {
    const points#:16: Array<Vec2#🧑‍🔧🏄‍♀️🕤😃> = *arrayCopy*(points#:5);
    for (; at#:0 < max#:6; at#:0 = at#:0 + 1) {
        const nextPos#:8: Vec2#🧑‍🔧🏄‍♀️🕤😃 = AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#0(
            pos#:4,
            Vec2float#👨‍❤️‍👨🏒🤜😃.#Mul#🐺🎇🤟😃#0(thetaPos2#🦎🙂🥗😃(theta#:3), length#:2),
        );
        theta#:3 = theta#:3 + by#:1 * IntAsFloat#🥛🐰🗻😃.#As#😉#0(at#:0);
        pos#:4 = nextPos#:8;
        points#:16.*push*(nextPos#:8);
        continue;
    };
    return points#:16;
}
```
*/
export const hash_722abb92: (arg_0: number, arg_1: number, arg_2: number, arg_3: number, arg_4: t_78566d10, arg_5: Array<t_78566d10>, arg_6: number) => Array<t_78566d10> = (at: number, by: number, length: number, theta$3: number, pos: t_78566d10, points: Array<t_78566d10>, max: number) => {
  let points$16: Array<t_78566d10> = points.slice();

  for (; at < max; at = at + 1) {
    let nextPos: t_78566d10 = hash_482bc839.h70e0d6d0_0(pos, hash_4adf81cc.h49fef1f5_0(hash_6a70223c(theta$3), length));
    theta$3 = theta$3 + by * hash_6f186ad1.hAs_0(at);
    pos = nextPos;
    points$16.push(nextPos);
    continue;
  }

  return points$16;
};

/*
accurateSpiral#722abb92(
    at: 0,
    by: 3.14159 /#builtin 10.0,
    length: 1.0,
    theta: 0.0,
    pos: Vec2#78566d10{x#78566d10#0: 0.0, y#78566d10#1: 0.0},
    points: <Vec2#78566d10>[],
    max: 200,
)
accurateSpiral#🌙🍙🎢😃(
    0,
    3.14159 / 10,
    1,
    0,
    Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: 0, y: 0},
    [],
    200,
)
*/
hash_722abb92(0, 3.14159 / 10, 1, 0, ({
  type: "Vec2",
  x: 0,
  y: 0
} as t_78566d10), [], 200);