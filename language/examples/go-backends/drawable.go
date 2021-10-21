package main

import (
	"fmt"
	"io/ioutil"
	"math"
)

const hello int = 10

func colorToString(color Color) string {
	switch color.tag {
	case Color_CSS:
		return color.value
	case Color_Rgba:
		return fmt.Sprintf("rgba(%0.2f, %0.2f, %0.2f, %0.2f)", color.r, color.g, color.b, color.a)
	}
	panic("Invalid color tag")
}

func lineCapToString(tag int) string {
	switch tag {
	case LineCap_Butt:
		return "butt"
	case LineCap_Round:
		return "round"
	case LineCap_Square:
		return "square"
	}
	panic("Invalid line cap")
}

type bounds struct {
	pos  Vec2
	size Vec2
}

// x, y, w, h
func drawableBounds(d Drawable) bounds {
	switch d.tag {
	case Drawable_Fill:
	case Drawable_Stroke:
		return geomBounds(d.geom)
	case Drawable_Text:
		panic("no text")
	}
	panic("invalid tag")
}

// x, y, w, h
func geomBounds(g Geom) bounds {
	switch g.tag {
	case Geom_Rect:
		return bounds{g.pos, g.size}
	case Geom_Line:
		x := math.Min(g.p1.x, g.p2.x)
		y := math.Min(g.p1.y, g.p2.y)
		x2 := math.Max(g.p1.x, g.p2.x)
		y2 := math.Max(g.p1.y, g.p2.y)
		return bounds{Vec2{x, y}, Vec2{x2 - x, y2 - y}}
	case Geom_Polygon:
		x := math.Inf(1)
		y := math.Inf(1)
		x2 := math.Inf(-1)
		y2 := math.Inf(-1)
		for _, point := range g.points {
			x = math.Min(x, point.x)
			y = math.Min(y, point.y)
			x2 = math.Max(x2, point.x)
			y2 = math.Max(y2, point.y)
		}
		return bounds{Vec2{x, y}, Vec2{x2 - x, y2 - y}}
	}
	panic("Unsupported bounds calc")
}

func drawable(drawable Drawable) {
	// TODO: Measure the bounds of the drawable
	bounds := drawableBounds(drawable)
	width := bounds.size.x
	height := bounds.size.y
	top := fmt.Sprintf("<?xml version='1.0' encoding='UTF-8' standalone='no'?>\n"+
		"<svg width='%0.1f' height='%0.1f' viewBox='%0.1f %0.1f %0.1f %0.1f' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg'>\n", width, height,
		bounds.pos.x, bounds.pos.y, bounds.size.x, bounds.size.y,
	)
	raw := drawableToSvg(drawable)
	full := top + raw + "\n</svg>"
	ioutil.WriteFile("go.svg", []byte(full), 0644)
}

func drawableToSvg(drawable Drawable) string {
	switch drawable.tag {
	case Drawable_Stroke:
		// hrm ok so here it's awkward to try to know which is right.
		// I could have a `drawableToStroke` generated function, but that's overhead.
		attrs := fmt.Sprintf("fill='none' stroke-width='%0.2f' stroke='%s' line-cap='%s'", drawable.width, colorToString(drawable.color), lineCapToString(drawable.lineCaps.tag))
		return geomToSvg(drawable.geom, attrs)
	case Drawable_Fill:
		attrs := fmt.Sprintf("fill='%s' stroke='none'", colorToString(drawable.color))
		return geomToSvg(drawable.geom, attrs)
	case Drawable_Text:
		panic("Text not supported yet")
	}
	panic("Invalid drawable")
}

// Hrmmmm shoudl I just be doing this in jerd? Like, I can construct strings, it's fine.
// It could also give me a chance to figure out what I want to do for template strings.
// hm but I don't actually love that, because I want jerd's product to be more ... structured than that? idk.
// I mean maybe it's fine ...
func geomToSvg(geom Geom, attrs string) string {
	switch geom.tag {
	case Geom_Rect:
		return fmt.Sprintf("<rect x='%0.2f' y='%0.2f' width='%0.2f' height='%0.2f' %s />", geom.pos.x, geom.pos.y, geom.size.x, geom.size.y, attrs)
	case Geom_Path:
		return fmt.Sprintf("<path d='%s' %s />", formatPath(geom.start, geom.parts, geom.closed), attrs)
	case Geom_Polygon:
		path := fmt.Sprintf("M%0.2f,%0.2f", geom.points[0].x, geom.points[0].y)
		for _, point := range geom.points[1:] {
			path += fmt.Sprintf(" L%0.2f,%0.2f", point.x, point.y)
		}
		if geom.closed {
			path += " Z"
		}
		return fmt.Sprintf("<path d='%s' %s />", path, attrs)
	}
	panic("unsupported geom")
}

func pathPartTOString(part PathPart) string {
	switch part.tag {
	case PathPart_Vec2:
		return fmt.Sprintf("L%0.2f,%0.2f", part.x, part.y)
	}
	panic("Unsupported path part")
}

func formatPath(start Vec2, parts []PathPart, closed bool) string {
	result := fmt.Sprintf("M%0.2f,%0.2f")
	for _, part := range parts {
		result += " " + pathPartTOString(part)
	}
	if closed {
		result += " Z"
	}
	return result
}
