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
@ffi("Vec3") type Vec3#b79db448 = {
    ...Vec2#08f7c2ac,
    z: float#builtin,
}
```
*/
type t_b79db448 = {
  type: "Vec3";
  z: number;
  x: number;
  y: number;
};

/**
```
@ffi("GLSLEnv") type GLSLEnv#a25a17de = {
    time: float#builtin,
    resolution: Vec2#08f7c2ac,
    camera: Vec3#b79db448,
    mouse: Vec2#08f7c2ac,
}
```
*/
type t_a25a17de = {
  type: "GLSLEnv";
  time: number;
  resolution: t_08f7c2ac;
  camera: t_b79db448;
  mouse: t_08f7c2ac;
};

/**
```
@ffi("Vec4") type Vec4#b1f05ae8 = {
    ...Vec3#b79db448,
    w: float#builtin,
}
```
*/
type t_b1f05ae8 = {
  type: "Vec4";
  w: number;
  z: number;
  x: number;
  y: number;
};

/**
```
@unique(0.07079698207722875) type Min#5a33e574<T#:0> = {
    "--": (T#:0, T#:0) ={}> T#:0,
}
```
*/
type t_5a33e574<T> = {
  type: "5a33e574";
  h5a33e574_0: (arg_0: T_0, arg_1: T_0) => T_0;
};

/**
```
@unique(0.43555946525519457) type Circle#37d95758 = {
    pos: Vec2#08f7c2ac,
    r: float#builtin,
}
```
*/
type t_37d95758 = {
  type: "37d95758";
  h37d95758_0: t_08f7c2ac;
  h37d95758_1: number;
};

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
const length#0f32aa7b = (v#:0: Vec2#08f7c2ac): float#builtin ={}> sqrt#builtin(
    v#:0.x#08f7c2ac#0 *#builtin v#:0.x#08f7c2ac#0 
        +#builtin v#:0.y#08f7c2ac#1 *#builtin v#:0.y#08f7c2ac#1,
)
(v#:0: Vec2#🍱🐶💣): float => sqrt(
    v#:0.#Vec2#🍱🐶💣#0 * v#:0.#Vec2#🍱🐶💣#0 + v#:0.#Vec2#🍱🐶💣#1 * v#:0.#Vec2#🍱🐶💣#1,
)
```
*/
export const hash_0f32aa7b: (arg_0: t_08f7c2ac) => number = (v: t_08f7c2ac) => sqrt(v.x * v.x + v.y * v.y);

/**
```
const abs#cb5109f8 = (v#:0: Vec3#b79db448): Vec3#b79db448 ={}> Vec3#b79db448{
    x#08f7c2ac#0: abs#builtin(v#:0.x#08f7c2ac#0),
    y#08f7c2ac#1: abs#builtin(v#:0.y#08f7c2ac#1),
    z#b79db448#0: abs#builtin(v#:0.z#b79db448#0),
}
(v#:0: Vec3#😦): Vec3#😦 => Vec3#😦{TODO SPREADs}{
    z: abs(v#:0.#Vec3#😦#0),
    x: abs(v#:0.#Vec2#🍱🐶💣#0),
    y: abs(v#:0.#Vec2#🍱🐶💣#1),
}
```
*/
export const hash_cb5109f8: (arg_0: t_b79db448) => t_b79db448 = (v: t_b79db448) => ({
  type: "Vec3",
  x: abs(v.x),
  y: abs(v.y),
  z: abs(v.z)
} as t_b79db448);

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
const circleSDF#ebc94280 = (p#:0: Vec2#08f7c2ac, circle#:1: Circle#37d95758): float#builtin ={}> {
    length#0f32aa7b(v: p#:0 -#f9ef2af4#6ca64060#1 circle#:1.pos#37d95758#0) 
        -#builtin circle#:1.r#37d95758#1;
}
(p#:0: Vec2#🍱🐶💣, circle#:1: Circle#🛳️🦟🕠): float => length#🥝✊🧏‍♂️(
    AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#1(p#:0, circle#:1.#Circle#🛳️🦟🕠#0),
) - circle#:1.#Circle#🛳️🦟🕠#1
```
*/
export const hash_ebc94280: (arg_0: t_08f7c2ac, arg_1: t_37d95758) => number = (p: t_08f7c2ac, circle: t_37d95758) => hash_0f32aa7b(hash_f9ef2af4.h6ca64060_1(p, circle.h37d95758_0)) - circle.h37d95758_1;

/**
```
const Min#0c7eb10c = Min#5a33e574<float#builtin>{"--"#5a33e574#0: min#builtin}
Min#🧍🤦‍♂️⛹️‍♂️😃{TODO SPREADs}{h5a33e574_0: min}
```
*/
export const hash_0c7eb10c: t_5a33e574<number> = ({
  type: "5a33e574",
  h5a33e574_0: min
} as t_5a33e574<number>);

/**
```
const hello#65dfa58f = (env#:0: GLSLEnv#a25a17de, fragCoord#:1: Vec2#08f7c2ac): Vec4#b1f05ae8 ={}> {
    const circle#:2 = Circle#37d95758{
        pos#37d95758#0: env#:0.mouse#a25a17de#3,
        r#37d95758#1: 40.0 
            +#builtin cos#builtin(env#:0.time#a25a17de#0 *#builtin 4.0) *#builtin 20.0,
    };
    const color#:3 = if circleSDF#ebc94280(p: fragCoord#:1, circle#:2) 
            --#0c7eb10c#5a33e574#0 circleSDF#ebc94280(
                p: fragCoord#:1,
                circle: Circle#37d95758{
                    pos#37d95758#0: env#:0.mouse#a25a17de#3 
                        +#f9ef2af4#6ca64060#0 Vec2#08f7c2ac{
                            x#08f7c2ac#0: 10.0,
                            y#08f7c2ac#1: 20.0,
                        },
                    r#37d95758#1: 30.0,
                },
            ) 
        <#builtin 0.0 {
        switch modInt#builtin(fragCoord#:1.x#08f7c2ac#0 as#184a69ed int#builtin, 2) {
            0 => Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 0.0, z#b79db448#0: 0.0},
            _ => Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: 0.0},
        };
    } else {
        abs#cb5109f8(v: Vec3#b79db448{x#08f7c2ac#0: 1.0, y#08f7c2ac#1: 1.0, z#b79db448#0: -1.0});
    };
    Vec4#b1f05ae8{...color#:3, w#b1f05ae8#0: 1.0};
}
(env#:0: GLSLEnv#🏏, fragCoord#:1: Vec2#🍱🐶💣): Vec4#🌎 => {
    const result#:5: Vec3#😦;
    const continueBlock#:6: bool = true;
    if Min#👩‍🌾🌈🧒.#Min#🧍🤦‍♂️⛹️‍♂️😃#0(
        circleSDF#🥔(
            fragCoord#:1,
            Circle#🛳️🦟🕠{TODO SPREADs}{
                h37d95758_0: env#:0.#GLSLEnv#🏏#3,
                h37d95758_1: 40 + cos(env#:0.#GLSLEnv#🏏#0 * 4) * 20,
            },
        ),
        circleSDF#🥔(
            fragCoord#:1,
            Circle#🛳️🦟🕠{TODO SPREADs}{
                h37d95758_0: AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#0(
                    env#:0.#GLSLEnv#🏏#3,
                    Vec2#🍱🐶💣{TODO SPREADs}{x: 10, y: 20},
                ),
                h37d95758_1: 30,
            },
        ),
    ) < 0 {
        if FloatAsInt#🐒🍕🏃‍♂️.#As#😉#0(fragCoord#:1.#Vec2#🍱🐶💣#0) modInt 2 == 0 {
            result#:5 = Vec3#😦{TODO SPREADs}{z: 0, x: 1, y: 0};
            continueBlock#:6 = false;
        };
        if continueBlock#:6 {
            result#:5 = Vec3#😦{TODO SPREADs}{z: 0, x: 1, y: 1};
            continueBlock#:6 = false;
        };
    } else {
        result#:5 = abs#🐱(Vec3#😦{TODO SPREADs}{z: -1, x: 1, y: 1});
        continueBlock#:6 = false;
    };
    return Vec4#🌎{TODO SPREADs}{w: 1, z: _#:0};
}
```
*/
export const hash_65dfa58f: (arg_0: t_a25a17de, arg_1: t_08f7c2ac) => t_b1f05ae8 = (env: t_a25a17de, fragCoord: t_08f7c2ac) => {
  let result: t_b79db448;
  let continueBlock: boolean = true;

  if (hash_0c7eb10c.h5a33e574_0(hash_ebc94280(fragCoord, ({
    type: "37d95758",
    h37d95758_0: env.mouse,
    h37d95758_1: 40 + cos(env.time * 4) * 20
  } as t_37d95758)), hash_ebc94280(fragCoord, ({
    type: "37d95758",
    h37d95758_0: hash_f9ef2af4.h6ca64060_0(env.mouse, ({
      type: "Vec2",
      x: 10,
      y: 20
    } as t_08f7c2ac)),
    h37d95758_1: 30
  } as t_37d95758))) < 0) {
    if (modInt(hash_184a69ed.hAs_0(fragCoord.x), 2) === 0) {
      result = ({
        type: "Vec3",
        x: 1,
        y: 0,
        z: 0
      } as t_b79db448);
      continueBlock = false;
    }

    if (continueBlock) {
      result = ({
        type: "Vec3",
        x: 1,
        y: 1,
        z: 0
      } as t_b79db448);
      continueBlock = false;
    }
  } else {
    result = hash_cb5109f8(({
      type: "Vec3",
      x: 1,
      y: 1,
      z: -1
    } as t_b79db448));
    continueBlock = false;
  }

  return ({ ...result,
    type: "Vec4",
    w: 1
  } as t_b1f05ae8);
};
export const hello = hash_65dfa58f;