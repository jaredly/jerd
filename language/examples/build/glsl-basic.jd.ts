import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq } from "./prelude.mjs";
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
type Min#3bec28f0<T#:0> = {
    "--": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_3bec28f0<T_0> = {
  type: "3bec28f0";
  h3bec28f0_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
type Circle#54e20644 = {
    pos: Vec2#43802a16,
    r: float,
}
```
*/
type t_54e20644 = {
  type: "54e20644";
  h54e20644_0: t_43802a16;
  h54e20644_1: number;
};

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
const length2#2e6a5f32: (Vec2#43802a16) ={}> float = (v#:0: Vec2#43802a16) ={}> {
    sqrt(((v#:0.x#43802a16#0 * v#:0.x#43802a16#0) + (v#:0.y#43802a16#1 * v#:0.y#43802a16#1)));
}
```
*/
export const hash_2e6a5f32: (arg_0: t_43802a16) => number = (v: t_43802a16) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const FloatAsInt#184a69ed: As#As<float, int> = As#As<float, int>{as#As#0: floatToInt}
```
*/
export const hash_184a69ed: t_As<number, number> = ({
  type: "As",
  hAs_0: floatToInt
} as t_As<number, number>);

/**
```
const circleSDF#d5823080: (Vec2#43802a16, Circle#54e20644) ={}> float = (
    p#:0: Vec2#43802a16,
    circle#:1: Circle#54e20644,
) ={}> {
    (length2#2e6a5f32(AddSubVec2#70bb2056."-"#b99b22d8#1(p#:0, circle#:1.pos#54e20644#0)) - circle#:1.r#54e20644#1);
}
```
*/
export const hash_d5823080: (arg_0: t_43802a16, arg_1: t_54e20644) => number = (p: t_43802a16, circle: t_54e20644) => hash_2e6a5f32(hash_70bb2056.hb99b22d8_1(p, circle.h54e20644_0)) - circle.h54e20644_1;

/**
```
const Min#0ac5242d: Min#3bec28f0<float> = Min#3bec28f0<float>{"--"#3bec28f0#0: min}
```
*/
export const hash_0ac5242d: t_3bec28f0<number> = ({
  type: "3bec28f0",
  h3bec28f0_0: min
} as t_3bec28f0<number>);

/**
```
const hello#7db5738a: (GLSLEnv#451d5252, Vec2#43802a16) ={}> Vec4#3b941378 = (
    env#:0: GLSLEnv#451d5252,
    fragCoord#:1: Vec2#43802a16,
) ={}> {
    const circle#:2 = Circle#54e20644{
        pos#54e20644#0: env#:0.mouse#451d5252#3,
        r#54e20644#1: (40.0 + (cos((env#:0.time#451d5252#0 * 4.0)) * 20.0)),
    };
    const color#:4 = if (Min#0ac5242d."--"#3bec28f0#0(
        circleSDF#d5823080(fragCoord#:1, circle#:2),
        circleSDF#d5823080(
            fragCoord#:1,
            Circle#54e20644{
                pos#54e20644#0: AddSubVec2#70bb2056."+"#b99b22d8#0(
                    env#:0.mouse#451d5252#3,
                    Vec2#43802a16{x#43802a16#0: 10.0, y#43802a16#1: 20.0},
                ),
                r#54e20644#1: 30.0,
            },
        ),
    ) < 0.0) {
        switch modInt(fragCoord#:1.x#43802a16#0 as#184a69ed int, 2) {
            0 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
            _#:3 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
        };
    } else {
        Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
    };
    Vec4#3b941378{...color#:4, w#3b941378#0: 1.0};
}
```
*/
export const hash_7db5738a: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16) => {
  let lambdaBlockResult: t_9f1c0644 = (null as any);
  let continueBlock: boolean = true;

  if (hash_0ac5242d.h3bec28f0_0(hash_d5823080(fragCoord, ({
    type: "54e20644",
    h54e20644_0: env.mouse,
    h54e20644_1: 40 + cos(env.time * 4) * 20
  } as t_54e20644)), hash_d5823080(fragCoord, ({
    type: "54e20644",
    h54e20644_0: hash_70bb2056.hb99b22d8_0(env.mouse, ({
      type: "Vec2",
      x: 10,
      y: 20
    } as t_43802a16)),
    h54e20644_1: 30
  } as t_54e20644))) < 0) {
    if (modInt(hash_184a69ed.hAs_0(fragCoord.x), 2) === 0) {
      lambdaBlockResult = ({
        type: "Vec3",
        x: 1,
        y: 0,
        z: 0
      } as t_9f1c0644);
      continueBlock = false;
    }

    if (continueBlock) {
      lambdaBlockResult = ({
        type: "Vec3",
        x: 1,
        y: 1,
        z: 0
      } as t_9f1c0644);
      continueBlock = false;
    }
  } else {
    lambdaBlockResult = ({
      type: "Vec3",
      x: 1,
      y: 1,
      z: 1
    } as t_9f1c0644);
    continueBlock = false;
  }

  return ({ ...lambdaBlockResult,
    type: "Vec4",
    w: 1
  } as t_3b941378);
};
export const hello = hash_7db5738a;