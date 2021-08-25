import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@ffi("Vec2") type Vec2#43802a16 = {
    x: float#builtin,
    y: float#builtin,
}
```
*/
type t_43802a16 = {
  type: "Vec2";
  x: number;
  y: number;
};

/**
```
@ffi("Vec3") type Vec3#9f1c0644 = {
    ...Vec2#43802a16,
    z: float#builtin,
}
```
*/
type t_9f1c0644 = {
  type: "Vec3";
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi("Vec4") type Vec4#3b941378 = {
    ...Vec3#9f1c0644,
    w: float#builtin,
}
```
*/
type t_3b941378 = {
  type: "Vec4";
  w: number;
  z: number;
  x: number;
  y: number;
};

/**
```
type Div#5ac12902<A#:0, B#:1, C#:2> = {
    "/": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_5ac12902<T_0, T_1, T_2> = {
  type: "5ac12902";
  h5ac12902_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
const MulVec2#1899d36e = Div#5ac12902<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1.x#43802a16#0,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1.y#43802a16#1,
    },
}
```
*/
export const hash_1899d36e: t_5ac12902<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale: t_43802a16) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const main#d96e428a = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
    buffer#:4: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    texture#builtin(buffer#:4, fragCoord#:1 /#1899d36e#5ac12902#0 iResolution#:2);
}
```
*/
export const hash_d96e428a: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: t_9f1c0644, arg_4: sampler2D) => t_3b941378 = (iTime: number, fragCoord: t_43802a16, iResolution: t_43802a16, uCamera: t_9f1c0644, buffer: sampler2D) => texture(buffer, hash_1899d36e.h5ac12902_0(fragCoord, iResolution));

/**
```
const pendulum#29e1fdb6 = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
    buffer#:4: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    if iTime#:0 <#builtin 0.1 {
        Vec4#3b941378{
            z#9f1c0644#0: 0.0,
            x#43802a16#0: 0.0,
            y#43802a16#1: 0.0,
            w#3b941378#0: 1.0,
        };
    } else {
        const current#:5 = texture#builtin(
            buffer#:4,
            fragCoord#:1 /#1899d36e#5ac12902#0 iResolution#:2,
        );
        Vec4#3b941378{...current#:5, x#43802a16#0: current#:5.x#43802a16#0 +#builtin 0.00001};
    };
}
```
*/
export const hash_29e1fdb6: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: t_9f1c0644, arg_4: sampler2D) => t_3b941378 = (iTime: number, fragCoord: t_43802a16, iResolution: t_43802a16, uCamera: t_9f1c0644, buffer: sampler2D) => {
  if (iTime < 0.1) {
    return ({
      type: "Vec4",
      z: 0,
      x: 0,
      y: 0,
      w: 1
    } as t_3b941378);
  } else {
    let current: t_3b941378 = texture(buffer, hash_1899d36e.h5ac12902_0(fragCoord, iResolution));
    return ({ ...current,
      type: "Vec4",
      x: current.x + 0.00001
    } as t_3b941378);
  }
};
export const pendulum = hash_29e1fdb6;
export const main = hash_d96e428a;