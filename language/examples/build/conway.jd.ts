import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

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
@ffi type GLSLEnv#451d5252 = {
    time: float,
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
  h5ac12902_0: (v: t_43802a16, scale: t_43802a16) => ({
    type: "Vec2",
    x: v.x / scale.x,
    y: v.y / scale.y
  } as t_43802a16)
} as t_5ac12902<t_43802a16, t_43802a16, t_43802a16>);

/**
```
const isLive#5df4f34f: (Vec4#3b941378) ={}> bool = (color#:0: Vec4#3b941378) ={}> (color#:0.x#43802a16#0 > 0.5)
```
*/
export const hash_5df4f34f: (arg_0: t_3b941378) => boolean = (color: t_3b941378) => color.x > 0.5;

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
export const hash_821c67e8: (arg_0: t_43802a16, arg_1: t_43802a16, arg_2: t_43802a16, arg_3: sampler2D) => number = (offset: t_43802a16, coord: t_43802a16, res: t_43802a16, buffer: sampler2D) => {
  if (hash_5df4f34f(texture(buffer, hash_090f77e7.h5ac12902_0(hash_70bb2056.hb99b22d8_0(coord, offset), res)))) {
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
export const hash_369652bb: (arg_0: t_43802a16, arg_1: t_43802a16) => number = (a: t_43802a16, b: t_43802a16) => a.x * b.x + a.y * b.y;

/**
```
const fract#495c4d22: (float) ={}> float = (v#:0: float) ={}> (v#:0 - floor(v#:0))
```
*/
export const hash_495c4d22: (arg_0: number) => number = (v: number) => v - floor(v);

/**
```
const ScaleVec2Rev#afc24bbe: Div#5ac12902<Vec2#43802a16, float, Vec2#43802a16> = Div#5ac12902<
    Vec2#43802a16,
    float,
    Vec2#43802a16,
>{
    "/"#5ac12902#0: (v#:0: Vec2#43802a16, scale#:1: float) ={}> Vec2#43802a16{
        x#43802a16#0: (v#:0.x#43802a16#0 / scale#:1),
        y#43802a16#1: (v#:0.y#43802a16#1 / scale#:1),
    },
}
```
*/
export const hash_afc24bbe: t_5ac12902<t_43802a16, number, t_43802a16> = ({
  type: "5ac12902",
  h5ac12902_0: (v: t_43802a16, scale: number) => ({
    type: "Vec2",
    x: v.x / scale,
    y: v.y / scale
  } as t_43802a16)
} as t_5ac12902<t_43802a16, number, t_43802a16>);

/**
```
const length2#2e6a5f32: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    sqrt(((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)));
}
```
*/
export const hash_2e6a5f32: (arg_0: t_43802a16) => number = (v: t_43802a16) => sqrt(v.x * v.x + v.y * v.y);

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
export const hash_347089ef: (arg_0: t_43802a16) => number = (st: t_43802a16) => hash_495c4d22(sin(hash_369652bb(st, ({
  type: "Vec2",
  x: 12.9898,
  y: 78.233
} as t_43802a16))) * 43758.5453123);

/**
```
const drawToScreen#099ef762: (GLSLEnv#451d5252, Vec2#43802a16, sampler2D) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer0#:2: sampler2D,
) ={}> {
    const diff#:3 = AddSubVec2#70bb2056."-"#b99b22d8#1(env#:0.mouse#451d5252#3, fragCoord#:1);
    if (length2#2e6a5f32(diff#:3) < 250.0) {
        const newCoord#:4 = AddSubVec2#70bb2056."-"#b99b22d8#1(
            env#:0.mouse#451d5252#3,
            ScaleVec2Rev#afc24bbe."/"#5ac12902#0(diff#:3, 4.0),
        );
        texture(
            buffer0#:2,
            MulVec2#090f77e7."/"#5ac12902#0(newCoord#:4, env#:0.resolution#451d5252#1),
        );
    } else {
        texture(
            buffer0#:2,
            MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
        );
    };
}
```
*/
export const hash_099ef762: (arg_0: t_451d5252, arg_1: t_43802a16, arg_2: sampler2D) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16, buffer0: sampler2D) => {
  let diff: t_43802a16 = hash_70bb2056.hb99b22d8_1(env.mouse, fragCoord);

  if (hash_2e6a5f32(diff) < 250) {
    return texture(buffer0, hash_090f77e7.h5ac12902_0(hash_70bb2056.hb99b22d8_1(env.mouse, hash_afc24bbe.h5ac12902_0(diff, 4)), env.resolution));
  } else {
    return texture(buffer0, hash_090f77e7.h5ac12902_0(fragCoord, env.resolution));
  }
};

/**
```
const drawToBuffer#5af2137f: (GLSLEnv#451d5252, Vec2#43802a16, sampler2D) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
    buffer#:2: sampler2D,
) ={}> {
    if (env#:0.time#451d5252#0 < 0.01) {
        if (random#347089ef(
            MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
        ) > 0.95) {
            live#59488bde;
        } else {
            dead#b12c041e;
        };
    } else {
        const self#:3 = isLive#5df4f34f(
            texture(
                buffer#:2,
                MulVec2#090f77e7."/"#5ac12902#0(fragCoord#:1, env#:0.resolution#451d5252#1),
            ),
        );
        const neighbors#:4 = countNeighbors#77a447bc(
            fragCoord#:1,
            env#:0.resolution#451d5252#1,
            buffer#:2,
        );
        if ((self#:3 && IntEq#9275f914."=="#553b4b8e#0(neighbors#:4, 2)) || IntEq#9275f914."=="#553b4b8e#0(
            neighbors#:4,
            3,
        )) {
            live#59488bde;
        } else {
            dead#b12c041e;
        };
    };
}
```
*/
export const hash_5af2137f: (arg_0: t_451d5252, arg_1: t_43802a16, arg_2: sampler2D) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16, buffer$2: sampler2D) => {
  if (env.time < 0.01) {
    if (hash_347089ef(hash_090f77e7.h5ac12902_0(fragCoord, env.resolution)) > 0.95) {
      return hash_59488bde;
    } else {
      return hash_b12c041e;
    }
  } else {
    let neighbors: number = hash_77a447bc(fragCoord, env.resolution, buffer$2);

    if (hash_5df4f34f(texture(buffer$2, hash_090f77e7.h5ac12902_0(fragCoord, env.resolution))) && intEq(neighbors, 2) || intEq(neighbors, 3)) {
      return hash_59488bde;
    } else {
      return hash_b12c041e;
    }
  }
};
export const drawToBuffer = hash_5af2137f;
export const drawToScreen = hash_099ef762;