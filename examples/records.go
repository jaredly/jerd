package main

import "fmt"

type Copyable interface {
	Copy() interface{}
}

type Awesome interface {
	SetName(name string)
}

type X struct{ name string }

func (m *X) SetName(name string) {
	m.name = name
}

func (m *X) Copy() interface{} {
	copy := *m
	return &copy
}

type Y struct {
	name  string
	other string
}

func (m *Y) SetName(name string) {
	m.name = name
}

func WithNewName(item interface {
	Awesome
	Copyable
}, name string) interface{} {
	inner := item.Copy()
	inner.(Awesome).SetName(name)
	return inner
}

func main() {
	fmt.Println("Hello, playground")
	x := X{name: "Yes"}
	y := Y{name: "Yes", other: "Ho"}

	fmt.Println("A new", WithNewName(&x, "Awe"), x)
	fmt.Println(x, y)
	// a := A{P: 10}

	// // fmt.Println(start)
	// elapsed := DoABunchOfThings(&a)
	// fmt.Println("Ok", elapsed, a.P)

	// elapsed2 := DoABunchOfThingsFaster(&a)
	// fmt.Println("Ok-", elapsed2, a.P)

	// // elapsed := time.Now().Sub(start)
	// // fmt.Println(time.Now())

	// reflect.ValueOf(&a).Elem().Field(0).Set(reflect.ValueOf(200))
	// fmt.Println(reflect.ValueOf(&a).Elem().Field(0).Int())
	// fmt.Println(a)
}
