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
@ffi("GLSLEnv") type GLSLEnv#451d5252 = {
    time: float#builtin,
    resolution: Vec2#43802a16,
    camera: Vec3#9f1c0644,
    mouse: Vec2#43802a16,
}
```
*/
type t_451d5252 = {
  type: "GLSLEnv";
  time: number;
  resolution: t_43802a16;
  camera: t_9f1c0644;
  mouse: t_43802a16;
};

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
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
type AddSub#b99b22d8<A#:0, B#:1, C#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_b99b22d8<T_0, T_1, T_2> = {
  type: "b99b22d8";
  hb99b22d8_0: (arg_0: T_0, arg_1: T_1) => T_2;
  hb99b22d8_1: (arg_0: T_0, arg_1: T_1) => T_2;
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
const isLive#612df647 = (color#:0: Vec4#3b941378): bool#builtin ={}> color#:0.x#43802a16#0 
    >#builtin 0.5
```
*/
export const hash_612df647: (arg_0: t_3b941378) => boolean = (color: t_3b941378) => color.x > 0.5;

/**
```
const AddSubVec2#5fdcc910 = AddSub#b99b22d8<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
    "+"#b99b22d8#0: (one#:0: Vec2#43802a16, two#:1: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: one#:0.x#43802a16#0 +#builtin two#:1.x#43802a16#0,
        y#43802a16#1: one#:0.y#43802a16#1 +#builtin two#:1.y#43802a16#1,
    },
    "-"#b99b22d8#1: (one#:2: Vec2#43802a16, two#:3: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: one#:2.x#43802a16#0 -#builtin two#:3.x#43802a16#0,
        y#43802a16#1: one#:2.y#43802a16#1 -#builtin two#:3.y#43802a16#1,
    },
}
```
*/
export const hash_5fdcc910: t_b99b22d8<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "b99b22d8",
  hb99b22d8_0: (one: t_43802a16, two: t_43802a16) => ({
    type: "Vec2",
    x: one.x + two.x,
    y: one.y + two.y
  } as t_43802a16),
  hb99b22d8_1: (one$2: t_43802a16, two$3: t_43802a16) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_43802a16)
} as t_b99b22d8<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const MulVec2#46209244 = Div#5ac12902<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: Vec2#43802a16): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1.x#43802a16#0,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1.y#43802a16#1,
    },
}
```
*/
export const hash_46209244: t_5ac12902<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale: t_43802a16) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const neighbor#c05a5dac = (
    offset#:0: Vec2#43802a16,
    coord#:1: Vec2#43802a16,
    res#:2: Vec2#43802a16,
    buffer#:3: sampler2D#builtin,
): int#builtin ={}> {
    const coord#:4 = coord#:1 +#5fdcc910#b99b22d8#0 offset#:0;
    if isLive#612df647(color: texture#builtin(buffer#:3, coord#:4 /#46209244#5ac12902#0 res#:2)) {
        1;
    } else {
        0;
    };
}
```
*/
export const hash_c05a5dac: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: sampler2D) => number = (offset: t_43802a16, coord: t_43802a16, res: t_43802a16, buffer: sampler2D) => {
  if (hash_612df647(texture(buffer, hash_46209244.h5ac12902_0(hash_5fdcc910.hb99b22d8_0(coord, offset), res)))) {
    return 1;
  } else {
    return 0;
  }
};

/**
```
const dot#b3a4deb8 = (a#:0: Vec2#43802a16, b#:1: Vec2#43802a16): float#builtin ={}> {
    a#:0.x#43802a16#0 *#builtin b#:1.x#43802a16#0 
        +#builtin a#:0.y#43802a16#1 *#builtin b#:1.y#43802a16#1;
}
```
*/
export const hash_b3a4deb8: (arg_0: t_43802a16, arg_1: t_43802a16) => number = (a: t_43802a16, b: t_43802a16) => a.x * b.x + a.y * b.y;

/**
```
const fract#495c4d22 = (v#:0: float#builtin): float#builtin ={}> v#:0 -#builtin floor#builtin(v#:0)
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const ScaleVec2Rev#368fe720 = Div#5ac12902<Vec2#43802a16, float#builtin, Vec2#43802a16>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: float#builtin): Vec2#43802a16 ={}> Vec2#43802a16{
        x#43802a16#0: v#:0.x#43802a16#0 /#builtin scale#:1,
        y#43802a16#1: v#:0.y#43802a16#1 /#builtin scale#:1,
    },
}
```
*/
export const hash_368fe720: t_5ac12902<t_43802a16, number, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale: number) => ({
    type: "Vec2",
    x: v.x / scale,
    y: v.y / scale
  } as t_43802a16)
} as t_5ac12902<t_43802a16, number, t_43802a16>);

/**
```
const length#b4a9b048 = (v#:0: Vec2#43802a16): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
        +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1,
)
```
*/
export const hash_b4a9b048: (arg_0: t_43802a16) => number = (v: t_43802a16) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const countNeighbors#5e0437fe = (
    coord#:0: Vec2#43802a16,
    res#:1: Vec2#43802a16,
    buffer#:2: sampler2D#builtin,
): int#builtin ={}> {
    neighbor#c05a5dac(
                                    offset: Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: 0.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                                +#builtin neighbor#c05a5dac(
                                    offset: Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: 1.0},
                                    coord#:0,
                                    res#:1,
                                    buffer#:2,
                                ) 
                            +#builtin neighbor#c05a5dac(
                                offset: Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: -1.0},
                                coord#:0,
                                res#:1,
                                buffer#:2,
                            ) 
                        +#builtin neighbor#c05a5dac(
                            offset: Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: 0.0},
                            coord#:0,
                            res#:1,
                            buffer#:2,
                        ) 
                    +#builtin neighbor#c05a5dac(
                        offset: Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: 1.0},
                        coord#:0,
                        res#:1,
                        buffer#:2,
                    ) 
                +#builtin neighbor#c05a5dac(
                    offset: Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: -1.0},
                    coord#:0,
                    res#:1,
                    buffer#:2,
                ) 
            +#builtin neighbor#c05a5dac(
                offset: Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: 1.0},
                coord#:0,
                res#:1,
                buffer#:2,
            ) 
        +#builtin neighbor#c05a5dac(
            offset: Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: -1.0},
            coord#:0,
            res#:1,
            buffer#:2,
        );
}
```
*/
export const hash_5e0437fe: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: sampler2D) => number = (coord$0: t_43802a16, res$1: t_43802a16, buffer$2: sampler2D) => hash_c05a5dac(({
  type: "Vec2",
  x: -1,
  y: 0
} as t_43802a16), coord$0, res$1, buffer$2) + hash_c05a5dac(({
  type: "Vec2",
  x: -1,
  y: 1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_c05a5dac(({
  type: "Vec2",
  x: -1,
  y: -1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_c05a5dac(({
  type: "Vec2",
  x: 1,
  y: 0
} as t_43802a16), coord$0, res$1, buffer$2) + hash_c05a5dac(({
  type: "Vec2",
  x: 1,
  y: 1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_c05a5dac(({
  type: "Vec2",
  x: 1,
  y: -1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_c05a5dac(({
  type: "Vec2",
  x: 0,
  y: 1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_c05a5dac(({
  type: "Vec2",
  x: 0,
  y: -1
} as t_43802a16), coord$0, res$1, buffer$2);

/**
```
const dead#b12c041e = Vec4#3b941378{
    z#9f1c0644#0: 0.0,
    x#43802a16#0: 0.0,
    y#43802a16#1: 0.0,
    w#3b941378#0: 1.0,
}
```
*/
export const hash_b12c041e: t_3b941378 = ({
  type: "Vec4",
  z: 0,
  x: 0,
  y: 0,
  w: 1
} as t_3b941378);

/**
```
const live#59488bde = Vec4#3b941378{
    z#9f1c0644#0: 1.0,
    x#43802a16#0: 1.0,
    y#43802a16#1: 0.6,
    w#3b941378#0: 1.0,
}
```
*/
export const hash_59488bde: t_3b941378 = ({
  type: "Vec4",
  z: 1,
  x: 1,
  y: 0.6,
  w: 1
} as t_3b941378);

/**
```
const random#72fb5b1c = (st#:0: Vec2#43802a16): float#builtin ={}> {
    fract#495c4d22(
        v: sin#builtin(
                dot#b3a4deb8(
                    a: st#:0,
                    b: Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
```
*/
export const hash_72fb5b1c: (arg_0: t_43802a16) => number = (st: t_43802a16) => hash_495c4d22(sin(hash_b3a4deb8(st, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_43802a16))) * 43758.5453123);

/**
```
const drawToScreen#4b16fe62 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer0#:2: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    const diff#:3 = env#:0.mouse#451d5252#3 -#5fdcc910#b99b22d8#1 fragCoord#:1;
    if length#b4a9b048(v: diff#:3) <#builtin 250.0 {
        const newCoord#:4 = env#:0.mouse#451d5252#3 
            -#5fdcc910#b99b22d8#1 diff#:3 /#368fe720#5ac12902#0 4.0;
        texture#builtin(buffer0#:2, newCoord#:4 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1);
    } else {
        texture#builtin(buffer0#:2, fragCoord#:1 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1);
    };
}
```
*/
export const hash_4b16fe62: (arg_0: t_451d5252, arg_1: t_43802a16, arg_2: sampler2D) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16, buffer0: sampler2D) => {
  let diff: t_43802a16 = hash_5fdcc910.hb99b22d8_1(env.mouse, fragCoord);

  if (hash_b4a9b048(diff) < 250) {
    return texture(buffer0, hash_46209244.h5ac12902_0(hash_5fdcc910.hb99b22d8_1(env.mouse, hash_368fe720.h5ac12902_0(diff, 4)), env.resolution));
  } else {
    return texture(buffer0, hash_46209244.h5ac12902_0(fragCoord, env.resolution));
  }
};

/**
```
const drawToBuffer#58167e03 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D#builtin,
): Vec4#3b941378 ={}> {
    if env#:0.time#451d5252#0 <#builtin 0.01 {
        if random#72fb5b1c(st: fragCoord#:1 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1) 
            >#builtin 0.95 {
            live#59488bde;
        } else {
            dead#b12c041e;
        };
    } else {
        const self#:3 = isLive#612df647(
            color: texture#builtin(
                buffer#:2,
                fragCoord#:1 /#46209244#5ac12902#0 env#:0.resolution#451d5252#1,
            ),
        );
        const neighbors#:4 = countNeighbors#5e0437fe(
            coord: fragCoord#:1,
            res: env#:0.resolution#451d5252#1,
            buffer#:2,
        );
        if (self#:3 &&#builtin neighbors#:4 ==#9275f914#553b4b8e#0 2) 
            ||#builtin neighbors#:4 ==#9275f914#553b4b8e#0 3 {
            live#59488bde;
        } else {
            dead#b12c041e;
        };
    };
}
```
*/
export const hash_58167e03: (arg_0: t_451d5252, arg_1: t_43802a16, arg_2: sampler2D) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16, buffer$2: sampler2D) => {
  if (env.time < 0.01) {
    if (hash_72fb5b1c(hash_46209244.h5ac12902_0(fragCoord, env.resolution)) > 0.95) {
      return hash_59488bde;
    } else {
      return hash_b12c041e;
    }
  } else {
    let neighbors: number = hash_5e0437fe(fragCoord, env.resolution, buffer$2);

    if (hash_612df647(texture(buffer$2, hash_46209244.h5ac12902_0(fragCoord, env.resolution))) && hash_9275f914.h553b4b8e_0(neighbors, 2) || hash_9275f914.h553b4b8e_0(neighbors, 3)) {
      return hash_59488bde;
    } else {
      return hash_b12c041e;
    }
  }
};
export const drawToBuffer = hash_58167e03;
export const drawToScreen = hash_4b16fe62;