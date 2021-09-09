package main

import (
	"fmt"
	"image/color"

	// "image"
	// "image/draw"
	// "image/png"

	"math"

	"github.com/tdewolff/canvas"
	"github.com/tdewolff/canvas/renderers"
)

/* (): void => fmt.Printf(
    "%#v\n",
    accurateSpiral#🤛(0, 0, 1, 0, Vec2#🍱🐶💣{TODO SPREADs}{x: 0, y: 0}, [], 200),
) */
// func V3bbfe258() {
// 	fmt.Printf("%#v\n", Vae2070ac(0, 0.0, 1.0, 0.0, T08f7c2ac{0.0, 0.0}, []T08f7c2ac{}, 200))
// 	return
// }
func main() {

	width := 500.0
	height := 500.0
	for i := 0; i < 10; i++ {
		c_ := 7 + i
		w := 32
		b := 7
		aoff := 8
		length := 3.0
		a := c_*1 + w + aoff*c_*8

		bottom := a*b + c_
		by := float64(a) * math.Pi / float64(bottom)
		// math.Pi*5.0/501.0

		points := Vae2070ac(0, by, length, 0.0, T08f7c2ac{width / 2.0, height / 2.0}, []T08f7c2ac{}, 20000)

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

		renderers.Write(fmt.Sprintf("hello%d.png", i), c, canvas.DPMM(8.0))
	}
}
