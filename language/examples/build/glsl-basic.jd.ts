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
type Min#2d04cd92<T#:0> = {
    "--": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_2d04cd92<T_0> = {
  type: "2d04cd92";
  h2d04cd92_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
type Circle#34fb982c = {
    pos: Vec2#08f7c2ac,
    r: float#builtin,
}
```
*/
type t_34fb982c = {
  type: "34fb982c";
  h34fb982c_0: t_08f7c2ac;
  h34fb982c_1: number;
};

/**
```
type As#As<T#:10000, Y#:10001> = {
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
type AddSub#3d436b7e<A#:0, B#:1, C#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_3d436b7e<T_0, T_1, T_2> = {
  type: "3d436b7e";
  h3d436b7e_0: (arg_0: T_0, arg_1: T_1) => T_2;
  h3d436b7e_1: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
@ffi("GLSLEnv") type GLSLEnv#88074884 = {
    time: float#builtin,
    resolution: Vec2#08f7c2ac,
    camera: Vec3#40e2c712,
    mouse: Vec2#08f7c2ac,
}
```
*/
type t_88074884 = {
  type: "GLSLEnv";
  time: number;
  resolution: t_08f7c2ac;
  camera: t_40e2c712;
  mouse: t_08f7c2ac;
};

/**
```
const AddSubVec2#04f14e9c = AddSub#3d436b7e<Vec2#08f7c2ac, Vec2#08f7c2ac, Vec2#08f7c2ac>{
    "+"#3d436b7e#0: (one#:0: Vec2#08f7c2ac, two#:1: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: one#:0.x#08f7c2ac#0 +#builtin two#:1.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:0.y#08f7c2ac#1 +#builtin two#:1.y#08f7c2ac#1,
    },
    "-"#3d436b7e#1: (one#:2: Vec2#08f7c2ac, two#:3: Vec2#08f7c2ac): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: one#:2.x#08f7c2ac#0 -#builtin two#:3.x#08f7c2ac#0,
        y#08f7c2ac#1: one#:2.y#08f7c2ac#1 -#builtin two#:3.y#08f7c2ac#1,
    },
}
AddSub#🕕🧑‍🦲⚽{TODO SPREADs}{
    h3d436b7e_0: (one#:0: Vec2#🍱🐶💣, two#:1: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: one#:0.#Vec2#🍱🐶💣#0 + two#:1.#Vec2#🍱🐶💣#0,
        y: one#:0.#Vec2#🍱🐶💣#1 + two#:1.#Vec2#🍱🐶💣#1,
    },
    h3d436b7e_1: (one#:2: Vec2#🍱🐶💣, two#:3: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: one#:2.#Vec2#🍱🐶💣#0 - two#:3.#Vec2#🍱🐶💣#0,
        y: one#:2.#Vec2#🍱🐶💣#1 - two#:3.#Vec2#🍱🐶💣#1,
    },
}
```
*/
export const hash_04f14e9c: t_3d436b7e<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac> = ({
  type: "3d436b7e",
  h3d436b7e_0: (one: t_08f7c2ac, two: t_08f7c2ac) => ({
    type: "Vec2",
    x: one.x + two.x,
    y: one.y + two.y
  } as t_08f7c2ac),
  h3d436b7e_1: (one$2: t_08f7c2ac, two$3: t_08f7c2ac) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_08f7c2ac)
} as t_3d436b7e<t_08f7c2ac, t_08f7c2ac, t_08f7c2ac>);

/**
```
const length#077fa0cc = (v#:0: Vec2#08f7c2ac): float#builtin ={}> sqrt#builtin(
    v#:0.x#08f7c2ac#0 *#builtin v#:0.x#08f7c2ac#0 
        +#builtin v#:0.y#08f7c2ac#1 *#builtin v#:0.y#08f7c2ac#1,
)
(v#:0: Vec2#🍱🐶💣): float => sqrt(
    v#:0.#Vec2#🍱🐶💣#0 * v#:0.#Vec2#🍱🐶💣#0 + v#:0.#Vec2#🍱🐶💣#1 * v#:0.#Vec2#🍱🐶💣#1,
)
```
*/
export const hash_077fa0cc: (arg_0: t_08f7c2ac) => number = (v: t_08f7c2ac) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const abs#3e9c70b8 = (v#:0: Vec3#40e2c712): Vec3#40e2c712 ={}> Vec3#40e2c712{
    x#08f7c2ac#0: abs#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: abs#builtin(v#:0.y#08f7c2ac#1),
    z#40e2c712#0: abs#builtin(v#:0.z#40e2c712#0),
}
(v#:0: Vec3#🕍🤲😍😃): Vec3#🕍🤲😍😃 => Vec3#🕍🤲😍😃{TODO SPREADs}{
    z: abs(v#:0.#Vec3#🕍🤲😍😃#0),
    x: abs(v#:0.#Vec2#🍱🐶💣#0),
    y: abs(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_3e9c70b8: (arg_0: t_40e2c712) => t_40e2c712 = (v: t_40e2c712) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_40e2c712);

/**
```
const FloatAsInt#184a69ed = As#As<float#builtin, int#builtin>{as#As#0: floatToInt#builtin}
As#😉{TODO SPREADs}{hAs_0: floatToInt}
```
*/
export const hash_184a69ed: t_As<number, number> = ({
  type: "As",
  hAs_0: floatToInt
} as t_As<number, number>);

/**
```
const circleSDF#16a77998 = (p#:0: Vec2#08f7c2ac, circle#:1: Circle#34fb982c): float#builtin ={}> {
    length#077fa0cc(v: p#:0 -#04f14e9c#3d436b7e#1 circle#:1.pos#34fb982c#0) 
        -#builtin circle#:1.r#34fb982c#1;
}
(p#:0: Vec2#🍱🐶💣, circle#:1: Circle#😪🏺🚨): float => length#👨⛸️💖(
    AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#1(p#:0, circle#:1.#Circle#😪🏺🚨#0),
) - circle#:1.#Circle#😪🏺🚨#1
```
*/
export const hash_16a77998: (arg_0: t_08f7c2ac, arg_1: t_34fb982c) => number = (p: t_08f7c2ac, circle: t_34fb982c) => hash_077fa0cc(hash_04f14e9c.h3d436b7e_1(p, circle.h34fb982c_0)) - circle.h34fb982c_1;

/**
```
const Min#7beb2a5a = Min#2d04cd92<float#builtin>{"--"#2d04cd92#0: min#builtin}
Min#🤺🕵️‍♀️🍼{TODO SPREADs}{h2d04cd92_0: min}
```
*/
export const hash_7beb2a5a: t_2d04cd92<number> = ({
  type: "2d04cd92",
  h2d04cd92_0: min
} as t_2d04cd92<number>);

/**
```
const hello#3def23d7 = (env#:0: GLSLEnv#88074884, fragCoord#:1: Vec2#08f7c2ac): Vec4#51a53bbe ={}> {
    const circle#:2 = Circle#34fb982c{
        pos#34fb982c#0: env#:0.mouse#88074884#3,
        r#34fb982c#1: 40.0 
            +#builtin cos#builtin(env#:0.time#88074884#0 *#builtin 4.0) *#builtin 20.0,
    };
    const color#:3 = if circleSDF#16a77998(p: fragCoord#:1, circle#:2) 
            --#7beb2a5a#2d04cd92#0 circleSDF#16a77998(
                p: fragCoord#:1,
                circle: Circle#34fb982c{
                    pos#34fb982c#0: env#:0.mouse#88074884#3 
                        +#04f14e9c#3d436b7e#0 Vec2#08f7c2ac{
                            x#08f7c2ac#0: 10.0,
                            y#08f7c2ac#1: 20.0,
                        },
                    r#34fb982c#1: 30.0,
                },
            ) 
        <#builtin 0.0 {
        switch modInt#builtin(fragCoord#:1.x#08f7c2ac#0 as#184a69ed int#builtin, 2) {
            0 => Vec3#40e2c712{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 0.0, z#40e2c712#0: 0.0},
            _ => Vec3#40e2c712{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#40e2c712#0: 0.0},
        };
    } else {
        abs#3e9c70b8(v: Vec3#40e2c712{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#40e2c712#0: -1.0});
    };
    Vec4#51a53bbe{...color#:3, w#51a53bbe#0: 1.0};
}
(env#:0: GLSLEnv#💜, fragCoord#:1: Vec2#🍱🐶💣): Vec4#✨🤶👨‍🔬😃 => {
    const result#:5: Vec3#🕍🤲😍😃;
    const continueBlock#:6: bool = true;
    if Min#🏵️🥧✨😃.#Min#🤺🕵️‍♀️🍼#0(
        circleSDF#🏌️‍♀️👨‍👦🧟‍♀️(
            fragCoord#:1,
            Circle#😪🏺🚨{TODO SPREADs}{
                h34fb982c_0: env#:0.#GLSLEnv#💜#3,
                h34fb982c_1: 40 + cos(env#:0.#GLSLEnv#💜#0 * 4) * 20,
            },
        ),
        circleSDF#🏌️‍♀️👨‍👦🧟‍♀️(
            fragCoord#:1,
            Circle#😪🏺🚨{TODO SPREADs}{
                h34fb982c_0: AddSubVec2#🥪😓😱.#AddSub#🕕🧑‍🦲⚽#0(
                    env#:0.#GLSLEnv#💜#3,
                    Vec2#🍱🐶💣{TODO SPREADs}{x: 10, y: 20},
                ),
                h34fb982c_1: 30,
            },
        ),
    ) < 0 {
        if FloatAsInt#🐒🍕🏃‍♂️.#As#😉#0(fragCoord#:1.#Vec2#🍱🐶💣#0) modInt 2 == 0 {
            result#:5 = Vec3#🕍🤲😍😃{TODO SPREADs}{z: 0, x: 1, y: 0};
            continueBlock#:6 = false;
        };
        if continueBlock#:6 {
            result#:5 = Vec3#🕍🤲😍😃{TODO SPREADs}{z: 0, x: 1, y: 1};
            continueBlock#:6 = false;
        };
    } else {
        result#:5 = abs#🦾🌆🎣(Vec3#🕍🤲😍😃{TODO SPREADs}{z: -1, x: 1, y: 1});
        continueBlock#:6 = false;
    };
    return Vec4#✨🤶👨‍🔬😃{TODO SPREADs}{w: 1, z: _#:0};
}
```
*/
export const hash_3def23d7: (arg_0: t_88074884, arg_1: t_08f7c2ac) => t_51a53bbe = (env: t_88074884, fragCoord: t_08f7c2ac) => {
  let result: t_40e2c712;
  let continueBlock: boolean = true;

  if (hash_7beb2a5a.h2d04cd92_0(hash_16a77998(fragCoord, ({
    type: "34fb982c",
    h34fb982c_0: env.mouse,
    h34fb982c_1: 40 + cos(env.time * 4) * 20
  } as t_34fb982c)), hash_16a77998(fragCoord, ({
    type: "34fb982c",
    h34fb982c_0: hash_04f14e9c.h3d436b7e_0(env.mouse, ({
      type: "Vec2",
      x: 10,
      y: 20
    } as t_08f7c2ac)),
    h34fb982c_1: 30
  } as t_34fb982c))) < 0) {
    if (modInt(hash_184a69ed.hAs_0(fragCoord.x), 2) === 0) {
      result = ({
        type: "Vec3",
        x: 1,
        y: 0,
        z: 0
      } as t_40e2c712);
      continueBlock = false;
    }

    if (continueBlock) {
      result = ({
        type: "Vec3",
        x: 1,
        y: 1,
        z: 0
      } as t_40e2c712);
      continueBlock = false;
    }
  } else {
    result = hash_3e9c70b8(({
      type: "Vec3",
      x: 1,
      y: 1,
      z: -1
    } as t_40e2c712));
    continueBlock = false;
  }

  return ({ ...result,
    type: "Vec4",
    w: 1
  } as t_51a53bbe);
};
export const hello = hash_3def23d7;