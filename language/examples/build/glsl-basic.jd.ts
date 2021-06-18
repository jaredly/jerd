import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@ffi type Vec2#43802a16 = {
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
@ffi type Vec3#9f1c0644 = {
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
@ffi type Vec4#3b941378 = {
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
@ffi type GLSLEnv#451d5252 = {
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
type Min#6cb43a8e<T#:0> = {
    "--": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_6cb43a8e<T_0> = {
  type: "6cb43a8e";
  h6cb43a8e_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
type Circle#6969c263 = {
    pos: Vec2#43802a16,
    r: float#builtin,
}
```
*/
type t_6969c263 = {
  type: "6969c263";
  h6969c263_0: t_43802a16;
  h6969c263_1: number;
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
const AddSubVec2#70bb2056 = AddSub#b99b22d8<Vec2#43802a16, Vec2#43802a16, Vec2#43802a16>{
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
const length#c2805852 = (v#:0: Vec2#43802a16): float#builtin ={}> sqrt#builtin(
    v#:0.x#43802a16#0 *#builtin v#:0.x#43802a16#0 
        +#builtin v#:0.y#43802a16#1 *#builtin v#:0.y#43802a16#1,
)
```
*/
export const hash_c2805852: (arg_0: t_43802a16) => number = (v: t_43802a16) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const abs#1a074578 = (v#:0: Vec3#9f1c0644): Vec3#9f1c0644 ={}> Vec3#9f1c0644{
    x#43802a16#0: abs#builtin(v#:0.x#43802a16#0),
    y#43802a16#1: abs#builtin(v#:0.y#43802a16#1),
    z#9f1c0644#0: abs#builtin(v#:0.z#9f1c0644#0),
}
```
*/
export const hash_1a074578: (arg_0: t_9f1c0644) => t_9f1c0644 = (v: t_9f1c0644) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_9f1c0644);

/**
```
const FloatAsInt#184a69ed = As#As<float#builtin, int#builtin>{as#As#0: floatToInt#builtin}
```
*/
export const hash_184a69ed: t_As<number, number> = ({
  type: "As",
  hAs_0: floatToInt
} as t_As<number, number>);

/**
```
const circleSDF#6a082378 = (p#:0: Vec2#43802a16, circle#:1: Circle#6969c263): float#builtin ={}> {
    length#c2805852(v: p#:0 -#70bb2056#b99b22d8#1 circle#:1.pos#6969c263#0) 
        -#builtin circle#:1.r#6969c263#1;
}
```
*/
export const hash_6a082378: (arg_0: t_43802a16, arg_1: t_6969c263) => number = (p: t_43802a16, circle: t_6969c263) => hash_c2805852(hash_70bb2056.hb99b22d8_1(p, circle.h6969c263_0)) - circle.h6969c263_1;

/**
```
const Min#1f194978 = Min#6cb43a8e<float#builtin>{"--"#6cb43a8e#0: min#builtin}
```
*/
export const hash_1f194978: t_6cb43a8e<number> = ({
  type: "6cb43a8e",
  h6cb43a8e_0: min
} as t_6cb43a8e<number>);

/**
```
const hello#1397fc70 = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const circle#:2 = Circle#6969c263{
        pos#6969c263#0: env#:0.mouse#451d5252#3,
        r#6969c263#1: 40.0 
            +#builtin cos#builtin(env#:0.time#451d5252#0 *#builtin 4.0) *#builtin 20.0,
    };
    const color#:4 = if circleSDF#6a082378(p: fragCoord#:1, circle#:2) 
            --#1f194978#6cb43a8e#0 circleSDF#6a082378(
                p: fragCoord#:1,
                circle: Circle#6969c263{
                    pos#6969c263#0: env#:0.mouse#451d5252#3 
                        +#70bb2056#b99b22d8#0 Vec2#43802a16{
                            x#43802a16#0: 10.0,
                            y#43802a16#1: 20.0,
                        },
                    r#6969c263#1: 30.0,
                },
            ) 
        <#builtin 0.0 {
        switch modInt#builtin(fragCoord#:1.x#43802a16#0 as#184a69ed int#builtin, 2) {
            0 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 0.0, z#9f1c0644#0: 0.0},
            _#:3 => Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 0.0},
        };
    } else {
        abs#1a074578(v: Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: -1.0});
    };
    Vec4#3b941378{...color#:4, w#3b941378#0: 1.0};
}
```
*/
export const hash_1397fc70: (arg_0: t_451d5252, arg_1: t_43802a16) => t_3b941378 = (env: t_451d5252, fragCoord: t_43802a16) => {
  let lambdaBlockResult: t_9f1c0644 = (null as any);
  let continueBlock: boolean = true;

  if (hash_1f194978.h6cb43a8e_0(hash_6a082378(fragCoord, ({
    type: "6969c263",
    h6969c263_0: env.mouse,
    h6969c263_1: 40 + cos(env.time * 4) * 20
  } as t_6969c263)), hash_6a082378(fragCoord, ({
    type: "6969c263",
    h6969c263_0: hash_70bb2056.hb99b22d8_0(env.mouse, ({
      type: "Vec2",
      x: 10,
      y: 20
    } as t_43802a16)),
    h6969c263_1: 30
  } as t_6969c263))) < 0) {
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
    lambdaBlockResult = hash_1a074578(({
      type: "Vec3",
      x: 1,
      y: 1,
      z: -1
    } as t_9f1c0644));
    continueBlock = false;
  }

  return ({ ...lambdaBlockResult,
    type: "Vec4",
    w: 1
  } as t_3b941378);
};
export const hello = hash_1397fc70;