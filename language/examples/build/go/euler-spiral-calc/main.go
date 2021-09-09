package main

import (
	"image/color"

	// "image"
	// "image/draw"
	// "image/png"

	"math"

	"github.com/tdewolff/canvas"
	"github.com/tdewolff/canvas/renderers"
)

/* struct Vec2#🍱🐶💣 {
    x: float;
    y: float;
} */
type T08f7c2ac struct {
	x float64
	y float64
} /**
```
const vec2#fa534764 = (x#:0: float#builtin, y#:1: float#builtin): Vec2#08f7c2ac ={}> Vec2#08f7c2ac{
    x#08f7c2ac#0: x#:0,
    y#08f7c2ac#1: y#:1,
}
```
*/
/* (
    x#:0: float,
    y#:1: float,
): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{x: x#:0, y: y#:1} */
func Vfa534764(
	x_0 float64,
	y_1 float64,
) T08f7c2ac {
	return T08f7c2ac{x_0, y_1}
} /**
```
const thetaPos2#b03288dc = (theta#:0: float#builtin): Vec2#08f7c2ac ={}> vec2#fa534764(
    x: cos#builtin(theta#:0),
    y: sin#builtin(theta#:0),
)
```
*/
/* (
    theta#:0: float,
): Vec2#🍱🐶💣 => vec2#🚠(cos(theta#:0), sin(theta#:0)) */
func Vb03288dc(theta_0 float64) T08f7c2ac {
	return Vfa534764(math.Cos(theta_0), math.Sin(theta_0))
} /* -- generated -- */
/* (v#:0: Vec2#🍱🐶💣, scale#:1: float): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
    x: v#:0.#Vec2#🍱🐶💣#0 * scale#:1,
    y: v#:0.#Vec2#🍱🐶💣#1 * scale#:1,
} */
func Vdb41487e_bfa05bcc_0(v_0 T08f7c2ac, scale_1 float64) T08f7c2ac {
	return T08f7c2ac{(v_0.x * scale_1), (v_0.y * scale_1)}
} /* -- generated -- */
/* (one#:0: Vec2#🍱🐶💣, two#:1: Vec2#🍱🐶💣): Vec2#🍱🐶💣 => Vec2#🍱🐶💣{TODO SPREADs}{
    x: one#:0.#Vec2#🍱🐶💣#0 + two#:1.#Vec2#🍱🐶💣#0,
    y: one#:0.#Vec2#🍱🐶💣#1 + two#:1.#Vec2#🍱🐶💣#1,
} */
func V04f14e9c_21f94b5c_0(one_0 T08f7c2ac, two_1 T08f7c2ac) T08f7c2ac {
	return T08f7c2ac{(one_0.x + two_1.x), (one_0.y + two_1.y)}
} /**
```
const rec accurateSpiral#ae2070ac = (
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
            +#04f14e9c#3d436b7e#0 thetaPos2#b03288dc(theta#:3) *#db41487e#02cc25c4#0 length#:2;
        ae2070ac#self(
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
```
*/
/* (
    at#:0: int,
    by#:1: float,
    length#:2: float,
    theta#:3: float,
    pos#:4: Vec2#🍱🐶💣,
    points#:5: Array<Vec2#🍱🐶💣; size#:16>,
    max#:6: int,
): Array<Vec2#🍱🐶💣; size#:16> => {
    for (; at#:0 < max#:6; at#:0 = at#:0 + 1) {
        const nextPos#:8: Vec2#🍱🐶💣 = generated#04f14e9c_21f94b5c_0(
            pos#:4,
            generated#db41487e_bfa05bcc_0(thetaPos2#👱‍♂️(theta#:3), length#:2),
        );
        theta#:3 = theta#:3 + by#:1 * intToFloat(at#:0);
        pos#:4 = nextPos#:8;
        points#:5 = [...points#:5, nextPos#:8];
        continue;
    };
    return points#:5;
} */
func Vae2070ac(
	at_0 int64,
	by_1 float64,
	length_2 float64,
	theta_3 float64,
	pos_4 T08f7c2ac,
	points_5 []T08f7c2ac,
	max_6 int64,
) []T08f7c2ac {
	for ; at_0 < max_6; at_0++ {
		var nextPos T08f7c2ac = V04f14e9c_21f94b5c_0(
			pos_4,
			Vdb41487e_bfa05bcc_0(Vb03288dc(theta_3), length_2),
		)
		theta_3 += (by_1 * float64(at_0))
		pos_4 = nextPos
		points_5 = append(points_5, nextPos)
		continue
	}
	return points_5
} /**
```
const main#3bbfe258 = (): void#builtin ={}> {
    fmt.Printf#builtin(
        "%#v\n",
        accurateSpiral#ae2070ac(
            at: 0,
            by: 3.14159 /#builtin 10.0,
            length: 1.0,
            theta: 0.0,
            pos: Vec2#08f7c2ac{x#08f7c2ac#0: 0.0, y#08f7c2ac#1: 0.0},
            points: <Vec2#08f7c2ac>[],
            max: 200,
        ),
    );
}
```
*/
/* (): void => fmt.Printf(
    "%#v\n",
    accurateSpiral#🤛(0, 0, 1, 0, Vec2#🍱🐶💣{TODO SPREADs}{x: 0, y: 0}, [], 200),
) */
// func V3bbfe258() {
// 	fmt.Printf("%#v\n", Vae2070ac(0, 0.0, 1.0, 0.0, T08f7c2ac{0.0, 0.0}, []T08f7c2ac{}, 200))
// 	return
// }
func main() {
	width := 1000.0
	height := 1000.0
	points := Vae2070ac(0, math.Pi*5.0/501.0, 10.0, 0.0, T08f7c2ac{500.0, 500.0}, []T08f7c2ac{}, 20000)

	c := canvas.New(width, height)
	ctx := canvas.NewContext(c)

	ctx.SetStrokeWidth(1.0)
	ctx.SetStrokeColor(color.RGBA{255, 0, 0, 255})
	// ctx.Set

	// path := canvas.Path{}
	// r := vector.NewRasterizer(width, height)
	// r.DrawOp = draw.Src
	for i, point := range points {
		if i == 0 {
			ctx.MoveTo((point.x), (point.y))
		} else {
			ctx.LineTo((point.x), (point.y))
		}
	}
	// ctx.DrawPath(100.0, 100.0, &path)
	ctx.Stroke()
	// r.MoveTo(1, 2)
	// r.LineTo(20, 2)
	// r.QuadTo(40.5, 15, 10, 20)
	// r.ClosePath()

	// dst := image.NewAlpha(image.Rect(0, 0, width, height))
	// r.Draw(dst, dst.Bounds(), image.Black, image.Point{500.0, 500.0})
	// w, _ := os.OpenFile("hello.png", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0600)
	// defer w.Close()
	// png.Encode(w, dst)

	renderers.Write("hello.png", c, canvas.DPMM(8.0))
}
