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
  hAs_0: (arg_0: T_10000) => T_10001;
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
@unique(1) type Mul#63513dcd<A#:0, B#:1, C#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_63513dcd<A, B, C> = {
  type: "63513dcd";
  h63513dcd_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

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
const vec2#5531df03 = (x#:0: float#builtin, y#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
}
(x#:0: float, y#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{x: x#:0, y: y#:1}
```
*/
export const hash_5531df03: (arg_0: number, arg_1: number) => t_08f7c2ac = (x: number, y: number) => ({
  type: "Vec2",
  x: x,
  y: y
} as t_08f7c2ac);

/**
```
const thetaPos2#3d82c362 = (theta#:0: float#builtin): Vec2#08f7c2ac ={}> vec2#5531df03(
    x: cos#builtin(theta#:0),
    y: sin#builtin(theta#:0),
)
(theta#:0: float): Vec2#🍱🐶💣 => vec2#🏦💖🦹😃(cos(theta#:0), sin(theta#:0))
```
*/
export const hash_3d82c362: (arg_0: number) => t_08f7c2ac = (theta: number) => hash_5531df03(cos(theta), sin(theta));

/**
```
const Vec2float#a302b9d4 = Mul#63513dcd<Vec2#08f7c2ac, float#builtin, Vec2#08f7c2ac>{
    "*"#63513dcd#0: (v#:0: Vec2#08f7c2ac, scale#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1,
    },
}
Mul#👩‍❤️‍👩😱🦉😃{TODO SPREADs}{
    h63513dcd_0: (v#:0: Vec2#🍱🐶💣, scale#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: v#:0.#Vec2#🍱🐶💣#0 * scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 * scale#:1,
    },
}
```
*/
export const hash_a302b9d4: t_63513dcd<t_08f7c2ac, number, t_08f7c2ac> = ({
  type: "63513dcd",
  h63513dcd_0: (v: t_08f7c2ac, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_08f7c2ac)
} as t_63513dcd<t_08f7c2ac, number, t_08f7c2ac>);

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
const rec accurateSpiral#0e36e662 = (
    at#:0: int#builtin,
    by#:1: float#builtin,
    length#:2: float#builtin,
    theta#:3: float#builtin,
    pos#:4: Vec2#08f7c2ac,
    points#:5: Array#builtin<Vec2#08f7c2ac>,
    max#:6: int#builtin,
): Array#builtin<Vec2#08f7c2ac> ={}> {
    if at#:0 >=#builtin max#:6 {
        points#:5;
    } else {
        const next#:7 = theta#:3 +#builtin by#:1 *#builtin at#:0 as#6f186ad1 float#builtin;
        const nextPos#:8 = pos#:4 
            +#f9ef2af4#6ca64060#0 thetaPos2#3d82c362(theta#:3) *#a302b9d4#63513dcd#0 length#:2;
        0e36e662#self(
            at#:0 +#builtin 1,
            by#:1,
            length#:2,
            next#:7,
            nextPos#:8,
            <Vec2#08f7c2ac>[...points#:5, nextPos#:8],
            max#:6,
        );
    };
}
(
    at#:0: int,
    by#:1: float,
    length#:2: float,
    theta#:3: float,
    pos#:4: Vec2#🍱🐶💣,
    points#:5: Array<Vec2#🍱🐶💣>,
    max#:6: int,
): Array<Vec2#🍱🐶💣> => {
    const points#:16: Array<Vec2#🍱🐶💣> = *arrayCopy*(points#:5);
    for (; at#:0 < max#:6; at#:0 = at#:0 + 1) {
        const nextPos#:8: Vec2#🍱🐶💣 = AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#0(
            pos#:4,
            Vec2float#👨‍👨‍👦.#Mul#👩‍❤️‍👩😱🦉😃#0(thetaPos2#🚁👐🏐(theta#:3), length#:2),
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
export const hash_0e36e662: (arg_0: number, arg_1: number, arg_2: number, arg_3: number, arg_4: t_08f7c2ac, arg_5: Array<t_08f7c2ac>, arg_6: number) => Array<t_08f7c2ac> = (at: number, by: number, length: number, theta$3: number, pos: t_08f7c2ac, points: Array<t_08f7c2ac>, max: number) => {
  let points$16: Array<t_08f7c2ac> = points.slice();

  for (; at < max; at = at + 1) {
    let nextPos: t_08f7c2ac = hash_f9ef2af4.h6ca64060_0(pos, hash_a302b9d4.h63513dcd_0(hash_3d82c362(theta$3), length));
    theta$3 = theta$3 + by * hash_6f186ad1.hAs_0(at);
    pos = nextPos;
    points$16.push(nextPos);
    continue;
  }

  return points$16;
};

/*
accurateSpiral#0e36e662(
    at: 0,
    by: 3.14159 /#builtin 10.0,
    length: 1.0,
    theta: 0.0,
    pos: Vec2#08f7c2ac{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0},
    points: <Vec2#08f7c2ac>[],
    max: 200,
)
accurateSpiral#🌲🤾‍♀️🙎(0, 3.14159 / 10, 1, 0, Vec2#🍱🐶💣{TODO SPREADs}{x: 0, y: 0}, [], 200)
*/
hash_0e36e662(0, 3.14159 / 10, 1, 0, ({
  type: "Vec2",
  x: 0,
  y: 0
} as t_08f7c2ac), [], 200);