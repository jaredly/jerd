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
@ffi("Arc") type Arc#443a6bbd = {
    center: Vec2#08f7c2ac,
    startAngle: float#builtin,
    endAngle: float#builtin,
    counterClockwise: bool#builtin = false,
}
```
*/
type t_443a6bbd = {
  type: "Arc";
  center: t_08f7c2ac;
  startAngle: number;
  endAngle: number;
  counterClockwise: boolean;
};

/**
```
@ffi("EllipsePath") type EllipsePath#163da40e = {
    ...Arc#443a6bbd,
    radius: Vec2#08f7c2ac,
    rotation: float#builtin,
}
```
*/
type t_163da40e = {
  type: "EllipsePath";
  radius: t_08f7c2ac;
  rotation: number;
  center: t_08f7c2ac;
  startAngle: number;
  endAngle: number;
  counterClockwise: boolean;
};

/**
```
@ffi("Rounded") type Rounded#b7a4f230 = {
    c1: Vec2#08f7c2ac,
    c2: Vec2#08f7c2ac,
    radius: float#builtin,
}
```
*/
type t_b7a4f230 = {
  type: "Rounded";
  c1: t_08f7c2ac;
  c2: t_08f7c2ac;
  radius: number;
};

/**
```
@ffi("Bezier") type Bezier#37a1f256 = {
    c1: Vec2#08f7c2ac,
    c2: Vec2#08f7c2ac,
    c3: Vec2#08f7c2ac,
    c4: Vec2#08f7c2ac,
    end: Vec2#08f7c2ac,
}
```
*/
type t_37a1f256 = {
  type: "Bezier";
  c1: t_08f7c2ac;
  c2: t_08f7c2ac;
  c3: t_08f7c2ac;
  c4: t_08f7c2ac;
  end: t_08f7c2ac;
};

/**
```
@ffi("Quadratic") type Quadratic#5c0c4fd8 = {
    control: Vec2#08f7c2ac,
    end: Vec2#08f7c2ac,
}
```
*/
type t_5c0c4fd8 = {
  type: "Quadratic";
  control: t_08f7c2ac;
  end: t_08f7c2ac;
};

/*enum PathPart#1bf9b3a6 {
    Vec2#08f7c2ac,
    Quadratic#5c0c4fd8,
    Bezier#37a1f256,
    Rounded#b7a4f230,
    Arc#443a6bbd,
    EllipsePath#163da40e,
}*/
type t_1bf9b3a6 = t_08f7c2ac | t_5c0c4fd8 | t_37a1f256 | t_b7a4f230 | t_443a6bbd | t_163da40e;

/**
```
@ffi("End") type End#830ad468 = {}
```
*/
type t_830ad468 = {
  type: "End";
};

/**
```
@ffi("Start") type Start#098d99e8 = {}
```
*/
type t_098d99e8 = {
  type: "Start";
};

/**
```
@ffi("Center") type Center#1189540a = {}
```
*/
type t_1189540a = {
  type: "Center";
};

/**
```
@ffi("Right") type Right#5cfc662e = {}
```
*/
type t_5cfc662e = {
  type: "Right";
};

/**
```
@ffi("Left") type Left#43051e9e = {}
```
*/
type t_43051e9e = {
  type: "Left";
};

/**
```
@ffi("Rgba") type Rgba#52033f94 = {
    r: float#builtin,
    g: float#builtin,
    b: float#builtin,
    a: float#builtin = 1.0,
}
```
*/
type t_52033f94 = {
  type: "Rgba";
  r: number;
  g: number;
  b: number;
  a: number;
};

/**
```
@ffi("CSS") type CSS#742a31c2 = {
    value: string#builtin,
}
```
*/
type t_742a31c2 = {
  type: "CSS";
  value: string;
};

/**
```
@ffi("Square") type Square#155bb0ac = {}
```
*/
type t_155bb0ac = {
  type: "Square";
};

/**
```
@ffi("Round") type Round#51486760 = {}
```
*/
type t_51486760 = {
  type: "Round";
};

/**
```
@ffi("Butt") type Butt#1ac05bf8 = {}
```
*/
type t_1ac05bf8 = {
  type: "Butt";
};

/**
```
@ffi("Path") type Path#6d986b7c = {
    start: Vec2#08f7c2ac,
    closed: bool#builtin = false,
    parts: Array#builtin<PathPart#1bf9b3a6>,
}
```
*/
type t_6d986b7c = {
  type: "Path";
  start: t_08f7c2ac;
  closed: boolean;
  parts: Array<t_1bf9b3a6>;
};

/**
```
@ffi("Rect") type Rect#126fdf00 = {
    pos: Vec2#08f7c2ac,
    size: Vec2#08f7c2ac,
    rotation: float#builtin = 0.0,
}
```
*/
type t_126fdf00 = {
  type: "Rect";
  pos: t_08f7c2ac;
  size: t_08f7c2ac;
  rotation: number;
};

/**
```
@ffi("Polygon") type Polygon#cafe28b8 = {
    points: Array#builtin<Vec2#08f7c2ac>,
    closed: bool#builtin = true,
}
```
*/
type t_cafe28b8 = {
  type: "Polygon";
  points: Array<t_08f7c2ac>;
  closed: boolean;
};

/**
```
@ffi("Line") type Line#565da092 = {
    p1: Vec2#08f7c2ac,
    p2: Vec2#08f7c2ac,
}
```
*/
type t_565da092 = {
  type: "Line";
  p1: t_08f7c2ac;
  p2: t_08f7c2ac;
};

/**
```
@ffi("Ellipse") type Ellipse#098fbabc = {
    pos: Vec2#08f7c2ac,
    radius: Vec2#08f7c2ac,
    rotation: float#builtin = 0.0,
}
```
*/
type t_098fbabc = {
  type: "Ellipse";
  pos: t_08f7c2ac;
  radius: t_08f7c2ac;
  rotation: number;
};

/*enum TextAlign#eaefd106 {
    Left#43051e9e,
    Right#5cfc662e,
    Center#1189540a,
    Start#098d99e8,
    End#830ad468,
}*/
type t_eaefd106 = t_43051e9e | t_5cfc662e | t_1189540a | t_098d99e8 | t_830ad468;

/*enum Color#1fe34118 {
    CSS#742a31c2,
    Rgba#52033f94,
}*/
type t_1fe34118 = t_742a31c2 | t_52033f94;

/*enum LineCap#5e11f0b9 {
    Butt#1ac05bf8,
    Round#51486760,
    Square#155bb0ac,
}*/
type t_5e11f0b9 = t_1ac05bf8 | t_51486760 | t_155bb0ac;

/*enum Geom#298247f2 {
    Ellipse#098fbabc,
    Line#565da092,
    Polygon#cafe28b8,
    Rect#126fdf00,
    Path#6d986b7c,
}*/
type t_298247f2 = t_098fbabc | t_565da092 | t_cafe28b8 | t_126fdf00 | t_6d986b7c;

/**
```
@ffi("Text") type Text#d86ebaa8 = {
    text: string#builtin,
    color: Color#1fe34118,
    pos: Vec2#08f7c2ac,
    stroke: float#builtin = 0.0,
    font: string#builtin = "",
    textAlign: TextAlign#eaefd106 = TextAlign#eaefd106:Start#098d99e8,
}
```
*/
type t_d86ebaa8 = {
  type: "Text";
  text: string;
  color: t_1fe34118;
  pos: t_08f7c2ac;
  stroke: number;
  font: string;
  textAlign: t_eaefd106;
};

/**
```
@ffi("Stroke") type Stroke#522b6fec = {
    geom: Geom#298247f2,
    color: Color#1fe34118,
    width: float#builtin = 1.0,
    lineCaps: LineCap#5e11f0b9 = LineCap#5e11f0b9:Round#51486760,
}
```
*/
type t_522b6fec = {
  type: "Stroke";
  geom: t_298247f2;
  color: t_1fe34118;
  width: number;
  lineCaps: t_5e11f0b9;
};

/**
```
@ffi("Fill") type Fill#70b1add0 = {
    geom: Geom#298247f2,
    color: Color#1fe34118,
}
```
*/
type t_70b1add0 = {
  type: "Fill";
  geom: t_298247f2;
  color: t_1fe34118;
};

/*enum Drawable#61499b8c {
    Fill#70b1add0,
    Stroke#522b6fec,
    Text#d86ebaa8,
}*/
type t_61499b8c = t_70b1add0 | t_522b6fec | t_d86ebaa8;

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
@unique(1) type Mul#63513dcd<A#:0, B#:1, C#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_63513dcd<A, B, C> = {
  type: "63513dcd";
  h63513dcd_0: (arg_0: T_0, arg_1: T_1) => T_2;
};

/**
```
const vec2#5531df03 = (x#:0: float#builtin, y#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
}
(x#:0: float, y#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{x: x#:0, y: y#:1}
```
*/
export const hash_5531df03: (arg_0: number, arg_1: number) => t_08f7c2ac = (x: number, y: number) => ({
  type: "Vec2",
  x: x,
  y: y
} as t_08f7c2ac);

/**
```
const thetaPos2#3d82c362 = (theta#:0: float#builtin): Vec2#08f7c2ac ={}> vec2#5531df03(
    x: cos#builtin(theta#:0),
    y: sin#builtin(theta#:0),
)
(theta#:0: float): Vec2#🍱🐶💣 => vec2#🏦💖🦹😃(cos(theta#:0), sin(theta#:0))
```
*/
export const hash_3d82c362: (arg_0: number) => t_08f7c2ac = (theta: number) => hash_5531df03(cos(theta), sin(theta));

/**
```
const Vec2float#a302b9d4 = Mul#63513dcd<Vec2#08f7c2ac, float#builtin, Vec2#08f7c2ac>{
    "*"#63513dcd#0: (v#:0: Vec2#08f7c2ac, scale#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
        x#08f7c2ac#0: v#:0.x#08f7c2ac#0 *#builtin scale#:1,
        y#08f7c2ac#1: v#:0.y#08f7c2ac#1 *#builtin scale#:1,
    },
}
Mul#👩‍❤️‍👩😱🦉😃{TODO SPREADs}{
    h63513dcd_0: (v#:0: Vec2#🍱🐶💣, scale#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
        x: v#:0.#Vec2#🍱🐶💣#0 * scale#:1,
        y: v#:0.#Vec2#🍱🐶💣#1 * scale#:1,
    },
}
```
*/
export const hash_a302b9d4: t_63513dcd<t_08f7c2ac, number, t_08f7c2ac> = ({
  type: "63513dcd",
  h63513dcd_0: (v: t_08f7c2ac, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_08f7c2ac)
} as t_63513dcd<t_08f7c2ac, number, t_08f7c2ac>);

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
const IntAsFloat#6f186ad1 = As#As<int#builtin, float#builtin>{as#As#0: intToFloat#builtin}
As#😉{TODO SPREADs}{hAs_0: intToFloat}
```
*/
export const hash_6f186ad1: t_As<number, number> = ({
  type: "As",
  hAs_0: intToFloat
} as t_As<number, number>);

/**
```
const rec accurateSpiral#0e36e662 = (
    at#:0: int#builtin,
    by#:1: float#builtin,
    length#:2: float#builtin,
    theta#:3: float#builtin,
    pos#:4: Vec2#08f7c2ac,
    points#:5: Array#builtin<Vec2#08f7c2ac>,
    max#:6: int#builtin,
): Array#builtin<Vec2#08f7c2ac> ={}> {
    if at#:0 >=#builtin max#:6 {
        points#:5;
    } else {
        const next#:7 = theta#:3 +#builtin by#:1 *#builtin at#:0 as#6f186ad1 float#builtin;
        const nextPos#:8 = pos#:4 
            +#f9ef2af4#6ca64060#0 thetaPos2#3d82c362(theta#:3) *#a302b9d4#63513dcd#0 length#:2;
        0e36e662#self(
            at#:0 +#builtin 1,
            by#:1,
            length#:2,
            next#:7,
            nextPos#:8,
            <Vec2#08f7c2ac>[...points#:5, nextPos#:8],
            max#:6,
        );
    };
}
(
    at#:0: int,
    by#:1: float,
    length#:2: float,
    theta#:3: float,
    pos#:4: Vec2#🍱🐶💣,
    points#:5: Array<Vec2#🍱🐶💣>,
    max#:6: int,
): Array<Vec2#🍱🐶💣> => {
    const points#:16: Array<Vec2#🍱🐶💣> = *arrayCopy*(points#:5);
    for (; at#:0 < max#:6; at#:0 = at#:0 + 1) {
        const nextPos#:8: Vec2#🍱🐶💣 = AddSubVec2#🏜️.#AddSub#🤡🧗‍♂️🥧😃#0(
            pos#:4,
            Vec2float#👨‍👨‍👦.#Mul#👩‍❤️‍👩😱🦉😃#0(thetaPos2#🚁👐🏐(theta#:3), length#:2),
        );
        theta#:3 = theta#:3 + by#:1 * IntAsFloat#🥛🐰🗻😃.#As#😉#0(at#:0);
        pos#:4 = nextPos#:8;
        points#:16.*push*(nextPos#:8);
        continue;
    };
    return points#:16;
}
```
*/
export const hash_0e36e662: (arg_0: number, arg_1: number, arg_2: number, arg_3: number, arg_4: t_08f7c2ac, arg_5: Array<t_08f7c2ac>, arg_6: number) => Array<t_08f7c2ac> = (at: number, by: number, length: number, theta$3: number, pos: t_08f7c2ac, points: Array<t_08f7c2ac>, max: number) => {
  let points$16: Array<t_08f7c2ac> = points.slice();

  for (; at < max; at = at + 1) {
    let nextPos: t_08f7c2ac = hash_f9ef2af4.h6ca64060_0(pos, hash_a302b9d4.h63513dcd_0(hash_3d82c362(theta$3), length));
    theta$3 = theta$3 + by * hash_6f186ad1.hAs_0(at);
    pos = nextPos;
    points$16.push(nextPos);
    continue;
  }

  return points$16;
};

/**
```
const vec2#12a84b0a = (x#:0: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: x#:0,
}
(x#:0: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{x: x#:0, y: x#:0}
```
*/
export const hash_12a84b0a: (arg_0: number) => t_08f7c2ac = (x: number) => ({
  type: "Vec2",
  x: x,
  y: x
} as t_08f7c2ac);

/**
```
const drawSpiralCustom#14e2b2e4 = (
    A#:0: int#builtin,
    B#:1: int#builtin,
    C#:2: int#builtin,
    pos#:3: Vec2#08f7c2ac,
    length#:4: float#builtin,
): Drawable#61499b8c ={}> {
    const bottom#:5 = A#:0 *#builtin B#:1 +#builtin C#:2;
    const result#:6 = accurateSpiral#0e36e662(
        at: bottom#:5,
        by: A#:0 as#6f186ad1 float#builtin *#builtin PI#builtin 
            /#builtin bottom#:5 as#6f186ad1 float#builtin,
        length#:4,
        theta: (bottom#:5 as#6f186ad1 float#builtin +#builtin 1.0) /#builtin 2.0 
                *#builtin A#:0 as#6f186ad1 float#builtin 
            *#builtin PI#builtin,
        pos#:3,
        points: <Vec2#08f7c2ac>[],
        max: bottom#:5 *#builtin 3,
    );
    Drawable#61499b8c:Stroke#522b6fec{
        geom#522b6fec#0: Geom#298247f2:Polygon#cafe28b8{
            points#cafe28b8#0: result#:6,
            closed#cafe28b8#1: false,
        },
        color#522b6fec#1: Color#1fe34118:CSS#742a31c2{value#742a31c2#0: "red"},
    };
}
(A#:0: int, B#:1: int, C#:2: int, pos#:3: Vec2#🍱🐶💣, length#:4: float): Drawable#🌓🌾🦏😃 => {
    const bottom#:5: int = A#:0 * B#:1 + C#:2;
    return Drawable#🌓🌾🦏😃:Stroke#🎿🥂🧑‍🎨😃{TODO SPREADs}{
        geom: Geom#🎱👁️‍🗨️🍔:Polygon#🦾{TODO SPREADs}{
            points: accurateSpiral#🌲🤾‍♀️🙎(
                bottom#:5,
                IntAsFloat#🥛🐰🗻😃.#As#😉#0(A#:0) * PI / IntAsFloat#🥛🐰🗻😃.#As#😉#0(bottom#:5),
                length#:4,
                (IntAsFloat#🥛🐰🗻😃.#As#😉#0(bottom#:5) + 1) / (2) * IntAsFloat#🥛🐰🗻😃.#As#😉#0(
                    A#:0,
                ) * PI,
                pos#:3,
                [],
                bottom#:5 * 3,
            ),
            closed: false,
        },
        color: Color#👩‍💼👨‍🦳🐆:CSS#🧑‍🤝‍🧑🍞🏍️😃{TODO SPREADs}{value: "red"},
        width: 1,
        lineCaps: LineCap#🦿💟👨‍👧‍👦😃:Round#🪂🐹👨‍🏭😃{TODO SPREADs}{},
    };
}
```
*/
export const hash_14e2b2e4: (arg_0: number, arg_1: number, arg_2: number, arg_3: t_08f7c2ac, arg_4: number) => t_61499b8c = (A: number, B: number, C: number, pos$3: t_08f7c2ac, length$4: number) => {
  let bottom: number = A * B + C;
  return ({
    type: "Stroke",
    geom: ({
      type: "Polygon",
      points: hash_0e36e662(bottom, hash_6f186ad1.hAs_0(A) * PI / hash_6f186ad1.hAs_0(bottom), length$4, (hash_6f186ad1.hAs_0(bottom) + 1) / 2 * hash_6f186ad1.hAs_0(A) * PI, pos$3, [], bottom * 3),
      closed: false
    } as t_298247f2),
    color: ({
      type: "CSS",
      value: "red"
    } as t_1fe34118),
    width: 1,
    lineCaps: ({
      type: "Round"
    } as t_5e11f0b9)
  } as t_61499b8c);
};

/*
@display#35d54832(id: "drawable") {
    const s0p1#:0 = @slider#4e421b50(min: 1, max: 20, step: 1) @title#1b6d573e(
        title: "s0p1: segments per spiral",
    ) 5;
    const s1p2#:1 = @slider#4e421b50(min: 0, max: 100, step: 1) @title#1b6d573e(
        title: "s1p2: spirals per superspiral",
    ) 2;
    const D#:2 = @slider#4e421b50(min: 0, max: 100, step: 1) @title#1b6d573e(
        title: "s2p3: supers per duper",
    ) 1;
    const s3p4#:3 = @slider#4e421b50(min: 1, max: 100, step: 1) @title#1b6d573e(title: "s3p4") 3;
    const D0#:4 = @slider#4e421b50(min: 1, max: 108, step: 1) @title#1b6d573e(title: "s4p5") 40;
    const r3#:5 = @slider#4e421b50(min: 0, max: 17, step: 1) 7;
    const W#:6 = s3p4#:3 *#builtin D0#:4 *#builtin 8 +#builtin r3#:5;
    const C#:7 = W#:6 *#builtin D#:2 *#builtin 8 +#builtin D0#:4;
    const length#:8 = @slider#b981a438(min: 1.0, max: 10.0, step: 1.0) @title#1b6d573e(
        title: "segment length",
    ) 1.0;
    const rotation#:9 = @slider#4e421b50(min: 0, max: 3, step: 1) @title#1b6d573e(
        title: "rotation",
    ) 0;
    const configuration#:10 = @slider#4e421b50(min: 0, max: 1, step: 1) @title#1b6d573e(
        title: "configuration",
    ) 0;
    const orientation#:11 = rotation#:9 *#builtin 2 +#builtin configuration#:10;
    const A#:12 = C#:7 *#builtin orientation#:11 +#builtin W#:6 
        +#builtin s1p2#:1 *#builtin C#:7 *#builtin 8;
    drawSpiralCustom#14e2b2e4(A#:12, B: s0p1#:0, C#:7, pos: vec2#12a84b0a(x: 0.0), length#:8);
}
((): Drawable#🌓🌾🦏😃 => {
    const W#:6: int = 3 * 40 * 8 + 7;
    const C#:7: int = W#:6 * 1 * 8 + 40;
    return drawSpiralCustom#🥄🤛🤶(
        C#:7 * 0 * 2 + 0 + W#:6 + 2 * C#:7 * 8,
        5,
        C#:7,
        vec2#🏯🦒👩‍🚀(0),
        1,
    );
})()
*/
(() => {
  let W: number = 3 * 40 * 8 + 7;
  let C$7: number = W * 1 * 8 + 40;
  return hash_14e2b2e4(C$7 * (0 * 2 + 0) + W + 2 * C$7 * 8, 5, C$7, hash_12a84b0a(0), 1);
})();