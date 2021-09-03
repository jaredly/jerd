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
type Div#3b763160<A#:0, B#:1, C#:2> = {
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
const main#8cecbde4 = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#08f7c2ac,
    iResolution#:2: Vec2#08f7c2ac,
    uCamera#:3: Vec3#40e2c712,
    buffer#:4: sampler2D#builtin,
): Vec4#51a53bbe ={}> {
    texture#builtin(buffer#:4, fragCoord#:1 /#08bab8c4#3b763160#0 iResolution#:2);
}
(
    iTime#:0: float,
    fragCoord#:1: Vec2#🍱🐶💣,
    iResolution#:2: Vec2#🍱🐶💣,
    uCamera#:3: Vec3#🕍🤲😍😃,
    buffer#:4: sampler2D,
): Vec4#✨🤶👨‍🔬😃 => texture(
    buffer#:4,
    MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, iResolution#:2),
)
```
*/
export const hash_8cecbde4: (arg_0: number, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac, arg_3: t_40e2c712, arg_4: sampler2D) => t_51a53bbe = (iTime: number, fragCoord: t_08f7c2ac, iResolution: t_08f7c2ac, uCamera: t_40e2c712, buffer: sampler2D) => texture(buffer, hash_08bab8c4.h3b763160_0(fragCoord, iResolution));

/**
```
const pendulum#15baf72c = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#08f7c2ac,
    iResolution#:2: Vec2#08f7c2ac,
    uCamera#:3: Vec3#40e2c712,
    buffer#:4: sampler2D#builtin,
): Vec4#51a53bbe ={}> {
    if iTime#:0 <#builtin 0.1 {
        Vec4#51a53bbe{
            z#40e2c712#0: 0.0,
            x#08f7c2ac#0: 0.0,
            y#08f7c2ac#1: 0.0,
            w#51a53bbe#0: 1.0,
        };
    } else {
        const current#:5 = texture#builtin(
            buffer#:4,
            fragCoord#:1 /#08bab8c4#3b763160#0 iResolution#:2,
        );
        Vec4#51a53bbe{...current#:5, x#08f7c2ac#0: current#:5.x#08f7c2ac#0 +#builtin 0.00001};
    };
}
(
    iTime#:0: float,
    fragCoord#:1: Vec2#🍱🐶💣,
    iResolution#:2: Vec2#🍱🐶💣,
    uCamera#:3: Vec3#🕍🤲😍😃,
    buffer#:4: sampler2D,
): Vec4#✨🤶👨‍🔬😃 => {
    if iTime#:0 < 0.1 {
        return Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: 0};
    } else {
        const current#:5: Vec4#✨🤶👨‍🔬😃 = texture(
            buffer#:4,
            MulVec2#👅🍙💫.#Div#🧜‍♂️🧖💧#0(fragCoord#:1, iResolution#:2),
        );
        return Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: _#:0, z: _#:0};
    };
}
```
*/
export const hash_15baf72c: (arg_0: number, arg_1: t_08f7c2ac, arg_2: t_08f7c2ac, arg_3: t_40e2c712, arg_4: sampler2D) => t_51a53bbe = (iTime: number, fragCoord: t_08f7c2ac, iResolution: t_08f7c2ac, uCamera: t_40e2c712, buffer: sampler2D) => {
  if (iTime < 0.1) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_51a53bbe);
  } else {
    let current: t_51a53bbe = texture(buffer, hash_08bab8c4.h3b763160_0(fragCoord, iResolution));
    return ({ ...current,
      type: "Vec4",
      x: current.x + 0.00001
    } as t_51a53bbe);
  }
};
export const pendulum = hash_15baf72c;
export const main = hash_8cecbde4;