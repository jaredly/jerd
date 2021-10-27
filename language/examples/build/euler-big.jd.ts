import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";

/**
```
@ffi("Vec2") type Vec2#78566d10 = {
    x: float#builtin,
    y: float#builtin,
}
```
*/
type t_78566d10 = {
  type: "Vec2";
  x: number;
  y: number;
};

/**
```
@ffi("Arc") type Arc#7ab021e4 = {
    center: Vec2#78566d10,
    startAngle: float#builtin,
    endAngle: float#builtin,
    counterClockwise: bool#builtin = false,
}
```
*/
type t_7ab021e4 = {
  type: "Arc";
  center: t_78566d10;
  startAngle: number;
  endAngle: number;
  counterClockwise: boolean;
};

/**
```
@ffi("EllipsePath") type EllipsePath#71924611 = {
    ...Arc#7ab021e4,
    radius: Vec2#78566d10,
    rotation: float#builtin,
}
```
*/
type t_71924611 = {
  type: "EllipsePath";
  radius: t_78566d10;
  rotation: number;
  center: t_78566d10;
  startAngle: number;
  endAngle: number;
  counterClockwise: boolean;
};

/**
```
@ffi("Rounded") type Rounded#9a960e4c = {
    c1: Vec2#78566d10,
    c2: Vec2#78566d10,
    radius: float#builtin,
}
```
*/
type t_9a960e4c = {
  type: "Rounded";
  c1: t_78566d10;
  c2: t_78566d10;
  radius: number;
};

/**
```
@ffi("Bezier") type Bezier#8a5a2244 = {
    c1: Vec2#78566d10,
    c2: Vec2#78566d10,
    c3: Vec2#78566d10,
    c4: Vec2#78566d10,
    end: Vec2#78566d10,
}
```
*/
type t_8a5a2244 = {
  type: "Bezier";
  c1: t_78566d10;
  c2: t_78566d10;
  c3: t_78566d10;
  c4: t_78566d10;
  end: t_78566d10;
};

/**
```
@ffi("Quadratic") type Quadratic#51345096 = {
    control: Vec2#78566d10,
    end: Vec2#78566d10,
}
```
*/
type t_51345096 = {
  type: "Quadratic";
  control: t_78566d10;
  end: t_78566d10;
};

/*enum PathPart#32ecdb20 {
    Vec2#78566d10,
    Quadratic#51345096,
    Bezier#8a5a2244,
    Rounded#9a960e4c,
    Arc#7ab021e4,
    EllipsePath#71924611,
}*/
type t_32ecdb20 = t_78566d10 | t_51345096 | t_8a5a2244 | t_9a960e4c | t_7ab021e4 | t_71924611;

/**
```
@ffi("End") type End#9d8f7940 = {}
```
*/
type t_9d8f7940 = {
  type: "End";
};

/**
```
@ffi("Start") type Start#6fcdc9d5 = {}
```
*/
type t_6fcdc9d5 = {
  type: "Start";
};

/**
```
@ffi("Center") type Center#37b17a3c = {}
```
*/
type t_37b17a3c = {
  type: "Center";
};

/**
```
@ffi("Right") type Right#11631a3e = {}
```
*/
type t_11631a3e = {
  type: "Right";
};

/**
```
@ffi("Left") type Left#53a3ac86 = {}
```
*/
type t_53a3ac86 = {
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
@ffi("CSS") type CSS#064a2c2c = {
    value: string#builtin,
}
```
*/
type t_064a2c2c = {
  type: "CSS";
  value: string;
};

/**
```
@ffi("Square") type Square#2d14c9e4 = {}
```
*/
type t_2d14c9e4 = {
  type: "Square";
};

/**
```
@ffi("Round") type Round#77f74444 = {}
```
*/
type t_77f74444 = {
  type: "Round";
};

/**
```
@ffi("Butt") type Butt#23492f54 = {}
```
*/
type t_23492f54 = {
  type: "Butt";
};

/**
```
@ffi("Path") type Path#278bd75e = {
    start: Vec2#78566d10,
    closed: bool#builtin = false,
    parts: Array#builtin<PathPart#32ecdb20>,
}
```
*/
type t_278bd75e = {
  type: "Path";
  start: t_78566d10;
  closed: boolean;
  parts: Array<t_32ecdb20>;
};

/**
```
@ffi("Rect") type Rect#d96b9044 = {
    pos: Vec2#78566d10,
    size: Vec2#78566d10,
    rotation: float#builtin = 0.0,
}
```
*/
type t_d96b9044 = {
  type: "Rect";
  pos: t_78566d10;
  size: t_78566d10;
  rotation: number;
};

/**
```
@ffi("Polygon") type Polygon#ca3bd320 = {
    points: Array#builtin<Vec2#78566d10>,
    closed: bool#builtin = true,
}
```
*/
type t_ca3bd320 = {
  type: "Polygon";
  points: Array<t_78566d10>;
  closed: boolean;
};

/**
```
@ffi("Line") type Line#2572b039 = {
    p1: Vec2#78566d10,
    p2: Vec2#78566d10,
}
```
*/
type t_2572b039 = {
  type: "Line";
  p1: t_78566d10;
  p2: t_78566d10;
};

/**
```
@ffi("Ellipse") type Ellipse#73aa20a0 = {
    pos: Vec2#78566d10,
    radius: Vec2#78566d10,
    rotation: float#builtin = 0.0,
}
```
*/
type t_73aa20a0 = {
  type: "Ellipse";
  pos: t_78566d10;
  radius: t_78566d10;
  rotation: number;
};

/*enum TextAlign#4b4337ca {
    Left#53a3ac86,
    Right#11631a3e,
    Center#37b17a3c,
    Start#6fcdc9d5,
    End#9d8f7940,
}*/
type t_4b4337ca = t_53a3ac86 | t_11631a3e | t_37b17a3c | t_6fcdc9d5 | t_9d8f7940;

/*enum Color#dd7b99d4 {
    CSS#064a2c2c,
    Rgba#52033f94,
}*/
type t_dd7b99d4 = t_064a2c2c | t_52033f94;

/*enum LineCap#a2698308 {
    Butt#23492f54,
    Round#77f74444,
    Square#2d14c9e4,
}*/
type t_a2698308 = t_23492f54 | t_77f74444 | t_2d14c9e4;

/*enum Geom#fa385f98 {
    Ellipse#73aa20a0,
    Line#2572b039,
    Polygon#ca3bd320,
    Rect#d96b9044,
    Path#278bd75e,
}*/
type t_fa385f98 = t_73aa20a0 | t_2572b039 | t_ca3bd320 | t_d96b9044 | t_278bd75e;

/**
```
@ffi("Text") type Text#36ac6584 = {
    text: string#builtin,
    color: Color#dd7b99d4,
    pos: Vec2#78566d10,
    stroke: float#builtin = 0.0,
    font: string#builtin = "",
    textAlign: TextAlign#4b4337ca = TextAlign#4b4337ca:Start#6fcdc9d5,
}
```
*/
type t_36ac6584 = {
  type: "Text";
  text: string;
  color: t_dd7b99d4;
  pos: t_78566d10;
  stroke: number;
  font: string;
  textAlign: t_4b4337ca;
};

/**
```
@ffi("Stroke") type Stroke#17b6ae86 = {
    geom: Geom#fa385f98,
    color: Color#dd7b99d4,
    width: float#builtin = 1.0,
    lineCaps: LineCap#a2698308 = LineCap#a2698308:Round#77f74444,
}
```
*/
type t_17b6ae86 = {
  type: "Stroke";
  geom: t_fa385f98;
  color: t_dd7b99d4;
  width: number;
  lineCaps: t_a2698308;
};

/**
```
@ffi("Fill") type Fill#cee10304 = {
    geom: Geom#fa385f98,
    color: Color#dd7b99d4,
}
```
*/
type t_cee10304 = {
  type: "Fill";
  geom: t_fa385f98;
  color: t_dd7b99d4;
};

/*enum Drawable#58028ffa {
    Fill#cee10304,
    Stroke#17b6ae86,
    Text#36ac6584,
}*/
type t_58028ffa = t_cee10304 | t_17b6ae86 | t_36ac6584;

/**
```
@unique(2) type As#As<T#:10000, Y#:10001> = {
    as: (T#:10000) ={}> Y#:10001,
}
```
*/
type t_As<T, Y> = {
  type: "As";
  hAs_0: (arg_0: T) => Y;
};

/**
```
@unique(0) type AddSub#70e0d6d0<A#:0, B#:1, C#:2> = {
    "+": (A#:0, B#:1) ={}> C#:2,
    "-": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_70e0d6d0<A, B, C> = {
  type: "70e0d6d0";
  h70e0d6d0_0: (arg_0: A, arg_1: B) => C;
  h70e0d6d0_1: (arg_0: A, arg_1: B) => C;
};

/**
```
@unique(1) type Mul#49fef1f5<A#:0, B#:1, C#:2> = {
    "*": (A#:0, B#:1) ={}> C#:2,
}
```
*/
type t_49fef1f5<A, B, C> = {
  type: "49fef1f5";
  h49fef1f5_0: (arg_0: A, arg_1: B) => C;
};

/**
```
const vec2#3ac18ce8 = (x#:0: float#builtin, y#:1: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
    x#78566d10#0: x#:0,
    y#78566d10#1: y#:1,
}
(x#:0: float, y#:1: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
    x: x#:0,
    y: y#:1,
}
```
*/
export const hash_3ac18ce8: (arg_0: number, arg_1: number) => t_78566d10 = (x: number, y: number) => ({
  type: "Vec2",
  x: x,
  y: y
} as t_78566d10);

/**
```
const thetaPos2#6a70223c = (theta#:0: float#builtin): Vec2#78566d10 ={}> vec2#3ac18ce8(
    x: cos#builtin(theta#:0),
    y: sin#builtin(theta#:0),
)
(theta#:0: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => vec2#🙅‍♀️👻🌈(cos(theta#:0), sin(theta#:0))
```
*/
export const hash_6a70223c: (arg_0: number) => t_78566d10 = (theta: number) => hash_3ac18ce8(cos(theta), sin(theta));

/**
```
const Vec2float#4adf81cc = Mul#49fef1f5<Vec2#78566d10, float#builtin, Vec2#78566d10>{
    "*"#49fef1f5#0: (v#:0: Vec2#78566d10, scale#:1: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: v#:0.x#78566d10#0 *#builtin scale#:1,
        y#78566d10#1: v#:0.y#78566d10#1 *#builtin scale#:1,
    },
}
Mul#🐺🎇🤟😃{TODO SPREADs}{
    h49fef1f5_0: (v#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, scale#:1: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 * scale#:1,
        y: v#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 * scale#:1,
    },
}
```
*/
export const hash_4adf81cc: t_49fef1f5<t_78566d10, number, t_78566d10> = ({
  type: "49fef1f5",
  h49fef1f5_0: (v: t_78566d10, scale: number) => ({
    type: "Vec2",
    x: v.x * scale,
    y: v.y * scale
  } as t_78566d10)
} as t_49fef1f5<t_78566d10, number, t_78566d10>);

/**
```
const AddSubVec2#482bc839 = AddSub#70e0d6d0<Vec2#78566d10, Vec2#78566d10, Vec2#78566d10>{
    "+"#70e0d6d0#0: (one#:0: Vec2#78566d10, two#:1: Vec2#78566d10): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: one#:0.x#78566d10#0 +#builtin two#:1.x#78566d10#0,
        y#78566d10#1: one#:0.y#78566d10#1 +#builtin two#:1.y#78566d10#1,
    },
    "-"#70e0d6d0#1: (one#:2: Vec2#78566d10, two#:3: Vec2#78566d10): Vec2#78566d10 ={}> Vec2#78566d10{
        x#78566d10#0: one#:2.x#78566d10#0 -#builtin two#:3.x#78566d10#0,
        y#78566d10#1: one#:2.y#78566d10#1 -#builtin two#:3.y#78566d10#1,
    },
}
AddSub#🍼🥵🗽😃{TODO SPREADs}{
    h70e0d6d0_0: (one#:0: Vec2#🧑‍🔧🏄‍♀️🕤😃, two#:1: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 + two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: one#:0.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 + two#:1.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
    h70e0d6d0_1: (one#:2: Vec2#🧑‍🔧🏄‍♀️🕤😃, two#:3: Vec2#🧑‍🔧🏄‍♀️🕤😃): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{
        x: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0 - two#:3.#Vec2#🧑‍🔧🏄‍♀️🕤😃#0,
        y: one#:2.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1 - two#:3.#Vec2#🧑‍🔧🏄‍♀️🕤😃#1,
    },
}
```
*/
export const hash_482bc839: t_70e0d6d0<t_78566d10, t_78566d10, t_78566d10> = ({
  type: "70e0d6d0",
  h70e0d6d0_0: (one: t_78566d10, two: t_78566d10) => ({
    type: "Vec2",
    x: one.x + two.x,
    y: one.y + two.y
  } as t_78566d10),
  h70e0d6d0_1: (one$2: t_78566d10, two$3: t_78566d10) => ({
    type: "Vec2",
    x: one$2.x - two$3.x,
    y: one$2.y - two$3.y
  } as t_78566d10)
} as t_70e0d6d0<t_78566d10, t_78566d10, t_78566d10>);

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
const rec accurateSpiral#722abb92 = (
    at#:0: int#builtin,
    by#:1: float#builtin,
    length#:2: float#builtin,
    theta#:3: float#builtin,
    pos#:4: Vec2#78566d10,
    points#:5: Array#builtin<Vec2#78566d10>,
    max#:6: int#builtin,
): Array#builtin<Vec2#78566d10> ={}> {
    if at#:0 >=#builtin max#:6 {
        points#:5;
    } else {
        const next#:7 = theta#:3 +#builtin by#:1 *#builtin at#:0 as#6f186ad1 float#builtin;
        const nextPos#:8 = pos#:4 
            +#482bc839#70e0d6d0#0 thetaPos2#6a70223c(theta#:3) *#4adf81cc#49fef1f5#0 length#:2;
        722abb92#self(
            at#:0 +#builtin 1,
            by#:1,
            length#:2,
            next#:7,
            nextPos#:8,
            <Vec2#78566d10>[...points#:5, nextPos#:8],
            max#:6,
        );
    };
}
(
    at#:0: int,
    by#:1: float,
    length#:2: float,
    theta#:3: float,
    pos#:4: Vec2#🧑‍🔧🏄‍♀️🕤😃,
    points#:5: Array<Vec2#🧑‍🔧🏄‍♀️🕤😃>,
    max#:6: int,
): Array<Vec2#🧑‍🔧🏄‍♀️🕤😃> => {
    const points#:16: Array<Vec2#🧑‍🔧🏄‍♀️🕤😃> = *arrayCopy*(points#:5);
    for (; at#:0 < max#:6; at#:0 = at#:0 + 1) {
        const nextPos#:8: Vec2#🧑‍🔧🏄‍♀️🕤😃 = AddSubVec2#🤯🏕️💚😃.#AddSub#🍼🥵🗽😃#0(
            pos#:4,
            Vec2float#👨‍❤️‍👨🏒🤜😃.#Mul#🐺🎇🤟😃#0(thetaPos2#🦎🙂🥗😃(theta#:3), length#:2),
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
export const hash_722abb92: (arg_0: number, arg_1: number, arg_2: number, arg_3: number, arg_4: t_78566d10, arg_5: Array<t_78566d10>, arg_6: number) => Array<t_78566d10> = (at: number, by: number, length: number, theta$3: number, pos: t_78566d10, points: Array<t_78566d10>, max: number) => {
  let points$16: Array<t_78566d10> = points.slice();

  for (; at < max; at = at + 1) {
    let nextPos: t_78566d10 = hash_482bc839.h70e0d6d0_0(pos, hash_4adf81cc.h49fef1f5_0(hash_6a70223c(theta$3), length));
    theta$3 = theta$3 + by * hash_6f186ad1.hAs_0(at);
    pos = nextPos;
    points$16.push(nextPos);
    continue;
  }

  return points$16;
};

/**
```
const vec2#6d16482a = (x#:0: float#builtin): Vec2#78566d10 ={}> Vec2#78566d10{
    x#78566d10#0: x#:0,
    y#78566d10#1: x#:0,
}
(x#:0: float): Vec2#🧑‍🔧🏄‍♀️🕤😃 => Vec2#🧑‍🔧🏄‍♀️🕤😃{TODO SPREADs}{x: x#:0, y: x#:0}
```
*/
export const hash_6d16482a: (arg_0: number) => t_78566d10 = (x: number) => ({
  type: "Vec2",
  x: x,
  y: x
} as t_78566d10);

/**
```
const drawSpiralCustom#2f797cda = (
    A#:0: int#builtin,
    B#:1: int#builtin,
    C#:2: int#builtin,
    pos#:3: Vec2#78566d10,
    length#:4: float#builtin,
): Drawable#58028ffa ={}> {
    const bottom#:5 = A#:0 *#builtin B#:1 +#builtin C#:2;
    const result#:6 = accurateSpiral#722abb92(
        at: bottom#:5,
        by: A#:0 as#6f186ad1 float#builtin *#builtin PI#builtin 
            /#builtin bottom#:5 as#6f186ad1 float#builtin,
        length#:4,
        theta: (bottom#:5 as#6f186ad1 float#builtin +#builtin 1.0) /#builtin 2.0 
                *#builtin A#:0 as#6f186ad1 float#builtin 
            *#builtin PI#builtin,
        pos#:3,
        points: <Vec2#78566d10>[],
        max: bottom#:5 *#builtin 3,
    );
    Drawable#58028ffa:Stroke#17b6ae86{
        geom#17b6ae86#0: Geom#fa385f98:Polygon#ca3bd320{
            points#ca3bd320#0: result#:6,
            closed#ca3bd320#1: false,
        },
        color#17b6ae86#1: Color#dd7b99d4:CSS#064a2c2c{value#064a2c2c#0: "red"},
    };
}
(A#:0: int, B#:1: int, C#:2: int, pos#:3: Vec2#🧑‍🔧🏄‍♀️🕤😃, length#:4: float): Drawable#🧸👉🧑‍🦽😃 => {
    const bottom#:5: int = A#:0 * B#:1 + C#:2;
    return Drawable#🧸👉🧑‍🦽😃:Stroke#🥦🚵👨‍🦯{TODO SPREADs}{
        geom: Geom#🌝:Polygon#🎠{TODO SPREADs}{
            points: accurateSpiral#🌙🍙🎢😃(
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
        color: Color#👨‍👨‍👦:CSS#😪🌰👽{TODO SPREADs}{value: "red"},
        width: 1,
        lineCaps: LineCap#🏬:Round#😯👨‍👩‍👧‍👦🕡😃{TODO SPREADs}{},
    };
}
```
*/
export const hash_2f797cda: (arg_0: number, arg_1: number, arg_2: number, arg_3: t_78566d10, arg_4: number) => t_58028ffa = (A: number, B: number, C: number, pos$3: t_78566d10, length$4: number) => {
  let bottom: number = A * B + C;
  return ({
    type: "Stroke",
    geom: ({
      type: "Polygon",
      points: hash_722abb92(bottom, hash_6f186ad1.hAs_0(A) * PI / hash_6f186ad1.hAs_0(bottom), length$4, (hash_6f186ad1.hAs_0(bottom) + 1) / 2 * hash_6f186ad1.hAs_0(A) * PI, pos$3, [], bottom * 3),
      closed: false
    } as t_fa385f98),
    color: ({
      type: "CSS",
      value: "red"
    } as t_dd7b99d4),
    width: 1,
    lineCaps: ({
      type: "Round"
    } as t_a2698308)
  } as t_58028ffa);
};

/*
@display#d9afd40a(id: "drawable") {
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
    drawSpiralCustom#2f797cda(A#:12, B: s0p1#:0, C#:7, pos: vec2#6d16482a(x: 0.0), length#:8);
}
((): Drawable#🧸👉🧑‍🦽😃 => {
    const W#:6: int = 3 * 40 * 8 + 7;
    const C#:7: int = W#:6 * 1 * 8 + 40;
    return drawSpiralCustom#🧑‍🦲🌼🏟️(
        C#:7 * 0 * 2 + 0 + W#:6 + 2 * C#:7 * 8,
        5,
        C#:7,
        vec2#😌🤺🥛😃(0),
        1,
    );
})()
*/
(() => {
  let W: number = 3 * 40 * 8 + 7;
  let C$7: number = W * 1 * 8 + 40;
  return hash_2f797cda(C$7 * (0 * 2 + 0) + W + 2 * C$7 * 8, 5, C$7, hash_6d16482a(0), 1);
})();