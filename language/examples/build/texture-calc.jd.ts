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
const main#410f0774 = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#78566d10,
    iResolution#:2: Vec2#78566d10,
    uCamera#:3: Vec3#1b597af1,
    buffer#:4: sampler2D#builtin,
): Vec4#38dc9122 ={}> {
    texture#builtin(buffer#:4, fragCoord#:1 /#85252e14#2b90cfd4#0 iResolution#:2);
}
(
    iTime#:0: float,
    fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    iResolution#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    uCamera#:3: Vec3#🗻🌻🤽‍♂️,
    buffer#:4: sampler2D,
): Vec4#🧑‍🎨🎪🌔 => texture(buffer#:4, MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:1, iResolution#:2))
```
*/
export const hash_410f0774: (arg_0: number, arg_1: t_78566d10, arg_2: t_78566d10, arg_3: t_1b597af1, arg_4: sampler2D) => t_38dc9122 = (iTime: number, fragCoord: t_78566d10, iResolution: t_78566d10, uCamera: t_1b597af1, buffer: sampler2D) => texture(buffer, hash_85252e14.h2b90cfd4_0(fragCoord, iResolution));

/**
```
const pendulum#0ee6fb9a = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#78566d10,
    iResolution#:2: Vec2#78566d10,
    uCamera#:3: Vec3#1b597af1,
    buffer#:4: sampler2D#builtin,
): Vec4#38dc9122 ={}> {
    if iTime#:0 <#builtin 0.1 {
        Vec4#38dc9122{
            z#1b597af1#0: 0.0,
            x#78566d10#0: 0.0,
            y#78566d10#1: 0.0,
            w#38dc9122#0: 1.0,
        };
    } else {
        const current#:5 = texture#builtin(
            buffer#:4,
            fragCoord#:1 /#85252e14#2b90cfd4#0 iResolution#:2,
        );
        Vec4#38dc9122{...current#:5, x#78566d10#0: current#:5.x#78566d10#0 +#builtin 0.00001};
    };
}
(
    iTime#:0: float,
    fragCoord#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    iResolution#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    uCamera#:3: Vec3#🗻🌻🤽‍♂️,
    buffer#:4: sampler2D,
): Vec4#🧑‍🎨🎪🌔 => {
    if iTime#:0 < 0.1 {
        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: 1, z: 0};
    } else {
        const current#:5: Vec4#🧑‍🎨🎪🌔 = texture(
            buffer#:4,
            MulVec2#🦏.#Div#⚽🤮🍡#0(fragCoord#:1, iResolution#:2),
        );
        return Vec4#🧑‍🎨🎪🌔{TODO SPREADs}{w: _#:0, z: _#:0};
    };
}
```
*/
export const hash_0ee6fb9a: (arg_0: number, arg_1: t_78566d10, arg_2: t_78566d10, arg_3: t_1b597af1, arg_4: sampler2D) => t_38dc9122 = (iTime: number, fragCoord: t_78566d10, iResolution: t_78566d10, uCamera: t_1b597af1, buffer: sampler2D) => {
  if (iTime < 0.1) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_38dc9122);
  } else {
    let current: t_38dc9122 = texture(buffer, hash_85252e14.h2b90cfd4_0(fragCoord, iResolution));
    return ({ ...current,
      type: "Vec4",
      x: current.x + 0.00001
    } as t_38dc9122);
  }
};
export const pendulum = hash_0ee6fb9a;
export const main = hash_410f0774;