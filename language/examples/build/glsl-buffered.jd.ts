import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
type As#As<T#:10000, T#:10001> = {
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
type None#None = {}
```
*/
type t_None = {
  type: "None";
};

/**
```
type Some#Some<T#:10000> = {
    contents: T#:10000,
}
```
*/
type t_Some<T_10000> = {
  type: "Some";
  hSome_0: T_10000;
};

/**
```
type ToStr#b416ead2<T#:0> = {
    str: (T#:0) ={}> string,
}
```
*/
type t_b416ead2<T_0> = {
  type: "b416ead2";
  hb416ead2_0: (arg_0: T_0) => string;
};

/**
```
type ToFloat#c13d2c8a<T#:0> = {
    float: (T#:0) ={}> float,
}
```
*/
type t_c13d2c8a<T_0> = {
  type: "c13d2c8a";
  hc13d2c8a_0: (arg_0: T_0) => number;
};

/**
```
type ToInt#c5d60378<T#:0> = {
    int: (T#:0) ={}> int,
}
```
*/
type t_c5d60378<T_0> = {
  type: "c5d60378";
  hc5d60378_0: (arg_0: T_0) => number;
};

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
@ffi type Vec2#43802a16 = {
    x: float,
    y: float,
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
@ffi type Vec3#9f1c0644 = {
    ...Vec2#43802a16,
    z: float,
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
@ffi type Vec4#3b941378 = {
    ...Vec3#9f1c0644,
    w: float,
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
@ffi type Mat4#d92781e8 = {
    r1: Vec4#3b941378,
    r2: Vec4#3b941378,
    r3: Vec4#3b941378,
    r4: Vec4#3b941378,
}
```
*/
type t_d92781e8 = {
  type: "Mat4";
  r1: t_3b941378;
  r2: t_3b941378;
  r3: t_3b941378;
  r4: t_3b941378;
};

/**
```
type AddSub#b99b22d8<T#:0, T#:1, T#:2> = {
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
type Mul#1de4e4c0<T#:0, T#:1, T#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_1de4e4c0<T_0, T_1, T_2> = {
  type: "1de4e4c0";
  h1de4e4c0_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
type Div#5ac12902<T#:0, T#:1, T#:2> = {
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
const MulVec2#090f77e7: Div#5ac12902<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16> = Div#5ac12902<
    Vec2#43802a16,
    Vec2#43802a16,
    Vec2#43802a16,
>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1.x#43802a16#0),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1.y#43802a16#1),
    },
}
```
*/
export const hash_090f77e7: t_5ac12902<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v$0: t_43802a16, scale$1: t_43802a16) => ({
    type: "Vec2",
    x: v$0.x / scale$1.x,
    y: v$0.y / scale$1.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const isLive#5df4f34f: (Vec4#3b941378) ={}> bool = (color#:0: Vec4#3b941378) ={}> (color#:0.x#43802a16#0 > 0.5)
```
*/
export const hash_5df4f34f: (arg_0: t_3b941378) => boolean = (color$0: t_3b941378) => color$0.x > 0.5;

/**
```
const AddSubVec2#70bb2056: AddSub#b99b22d8<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16> = AddSub#b99b22d8<
    Vec2#43802a16,
    Vec2#43802a16,
    Vec2#43802a16,
>{
    "+"#b99b22d8#0: (one#:0: Vec2#43802a16, two#:1: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:0.x#43802a16#0 + two#:1.x#43802a16#0),
        y#43802a16#1: (one#:0.y#43802a16#1 + two#:1.y#43802a16#1),
    },
    "-"#b99b22d8#1: (one#:2: Vec2#43802a16, two#:3: Vec2#43802a16) ={}> Vec2#43802a16{
        x#43802a16#0: (one#:2.x#43802a16#0 - two#:3.x#43802a16#0),
        y#43802a16#1: (one#:2.y#43802a16#1 - two#:3.y#43802a16#1),
    },
}
```
*/
export const hash_70bb2056: t_b99b22d8<t_43802a16, t_43802a16, t_43802a16> = ({
  type: "b99b22d8",
  hb99b22d8_0: (one$0: t_43802a16, two$1: t_43802a16) => ({
    type: "Vec2",
    x: one$0.x + two$1.x,
    y: one$0.y + two$1.y
  } as t_43802a16),
  hb99b22d8_1: (one$2: t_43802a16, two$3: t_43802a16) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_43802a16)
} as t_b99b22d8<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const neighbor#821c67e8: (Vec2#43802a16, Vec2#43802a16, Vec2#43802a16, sampler2D) ={}> int = (
    offset#:0: Vec2#43802a16,
    coord#:1: Vec2#43802a16,
    res#:2: Vec2#43802a16,
    buffer#:3: sampler2D,
) ={}> {
    const coord#:4 = AddSubVec2#70bb2056."+"#b99b22d8#0(coord#:1, offset#:0);
    if isLive#5df4f34f(texture(buffer#:3, MulVec2#090f77e7."/"#5ac12902#0(coord#:4, res#:2))) {
        1;
    } else {
        0;
    };
}
```
*/
export const hash_821c67e8: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: sampler2D) => number = (offset$0: t_43802a16, coord$1: t_43802a16, res$2: t_43802a16, buffer$3: sampler2D) => {
  if (hash_5df4f34f(texture(buffer$3, hash_090f77e7.h5ac12902_0(hash_70bb2056.hb99b22d8_0(coord$1, offset$0), res$2)))) {
    return 1;
  } else {
    return 0;
  }
};

/**
```
const dot2#369652bb: (Vec2#43802a16, Vec2#43802a16) ={}> float = (
    a#:0: Vec2#43802a16,
    b#:1: Vec2#43802a16,
) ={}> {
    ((a#:0.x#43802a16#0 * b#:1.x#43802a16#0) + (a#:0.y#43802a16#1 * b#:1.y#43802a16#1));
}
```
*/
export const hash_369652bb: (arg_0: t_43802a16, arg_1: t_43802a16) => number = (a$0: t_43802a16, b$1: t_43802a16) => a$0.x * b$1.x + a$0.y * b$1.y;

/**
```
const fract#495c4d22: (float) ={}> float = (v#:0: float) ={}> (v#:0 - floor(v#:0))
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v$0: number) => v$0 - floor(v$0);

/**
```
const IntEq#9275f914: Eq#553b4b8e<int> = Eq#553b4b8e<int>{"=="#553b4b8e#0: intEq}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const countNeighbors#77a447bc: (Vec2#43802a16, Vec2#43802a16, sampler2D) ={}> int = (
    coord#:0: Vec2#43802a16,
    res#:1: Vec2#43802a16,
    buffer#:2: sampler2D,
) ={}> {
    (((((((neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: 0.0},
        coord#:0,
        res#:1,
        buffer#:2,
    ) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: 1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: -1.0, y#43802a16#1: -1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: 0.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: 1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 1.0, y#43802a16#1: -1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: 1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    )) + neighbor#821c67e8(
        Vec2#43802a16{x#43802a16#0: 0.0, y#43802a16#1: -1.0},
        coord#:0,
        res#:1,
        buffer#:2,
    ));
}
```
*/
export const hash_77a447bc: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: sampler2D) => number = (coord$0: t_43802a16, res$1: t_43802a16, buffer$2: sampler2D) => hash_821c67e8(({
  type: "Vec2",
  x: -1,
  y: 0
} as t_43802a16), coord$0, res$1, buffer$2) + hash_821c67e8(({
  type: "Vec2",
  x: -1,
  y: 1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_821c67e8(({
  type: "Vec2",
  x: -1,
  y: -1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_821c67e8(({
  type: "Vec2",
  x: 1,
  y: 0
} as t_43802a16), coord$0, res$1, buffer$2) + hash_821c67e8(({
  type: "Vec2",
  x: 1,
  y: 1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_821c67e8(({
  type: "Vec2",
  x: 1,
  y: -1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_821c67e8(({
  type: "Vec2",
  x: 0,
  y: 1
} as t_43802a16), coord$0, res$1, buffer$2) + hash_821c67e8(({
  type: "Vec2",
  x: 0,
  y: -1
} as t_43802a16), coord$0, res$1, buffer$2);

/**
```
const dead#b12c041e: Vec4#3b941378 = Vec4#3b941378{
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
const live#59488bde: Vec4#3b941378 = Vec4#3b941378{
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
const random#347089ef: (Vec2#43802a16) ={}> float = (st#:0: Vec2#43802a16) ={}> {
    fract#495c4d22(
        (sin(dot2#369652bb(st#:0, Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233})) * 43758.5453123),
    );
}
```
*/
export const hash_347089ef: (arg_0: t_43802a16) => number = (st$0: t_43802a16) => hash_495c4d22(sin(hash_369652bb(st$0, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_43802a16))) * 43758.5453123);

/**
```
const main#3a366a4a: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644, sampler2D) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
    buffer0#:4: sampler2D,
) ={}> {
    texture(buffer0#:4, MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, iResolution#:2));
}
```
*/
export const hash_3a366a4a: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: t_9f1c0644, arg_4: sampler2D) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16, uCamera$3: t_9f1c0644, buffer0$4: sampler2D) => texture(buffer0$4, hash_090f77e7.h5ac12902_0(fragCoord$1, iResolution$2));

/**
```
const gameOfLife#bd6f50e0: (float, Vec2#43802a16, Vec2#43802a16, Vec3#9f1c0644, sampler2D) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
    uCamera#:3: Vec3#9f1c0644,
    buffer#:4: sampler2D,
) ={}> {
    if (iTime#:0 < 1.0) {
        if (random#347089ef(MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, iResolution#:2)) > 0.95) {
            live#59488bde;
        } else {
            dead#b12c041e;
        };
    } else {
        const self#:5 = isLive#5df4f34f(
            texture(buffer#:4, MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, iResolution#:2)),
        );
        const neighbors#:6 = countNeighbors#77a447bc(fragCoord#:1, iResolution#:2, buffer#:4);
        if (self#:5 && IntEq#9275f914."=="#553b4b8e#0(neighbors#:6, 2)) {
            live#59488bde;
        } else {
            if IntEq#9275f914."=="#553b4b8e#0(neighbors#:6, 3) {
                live#59488bde;
            } else {
                dead#b12c041e;
            };
        };
    };
}
```
*/
export const hash_bd6f50e0: (arg_0: number, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: t_9f1c0644, arg_4: sampler2D) => t_3b941378 = (iTime$0: number, fragCoord$1: t_43802a16, iResolution$2: t_43802a16, uCamera$3: t_9f1c0644, buffer$4: sampler2D) => {
  if (iTime$0 < 1) {
    if (hash_347089ef(hash_090f77e7.h5ac12902_0(fragCoord$1, iResolution$2)) > 0.95) {
      return hash_59488bde;
    } else {
      return hash_b12c041e;
    }
  } else {
    let neighbors$6: number = hash_77a447bc(fragCoord$1, iResolution$2, buffer$4);

    if (hash_5df4f34f(texture(buffer$4, hash_090f77e7.h5ac12902_0(fragCoord$1, iResolution$2))) && intEq(neighbors$6, 2)) {
      return hash_59488bde;
    } else {
      if (intEq(neighbors$6, 3)) {
        return hash_59488bde;
      } else {
        return hash_b12c041e;
      }
    }
  }
};
export const gameOfLife = hash_bd6f50e0;
export const main = hash_3a366a4a;