package main

import (
	"fmt"
	"reflect"
	"time"
)

type A struct {
	P int
	D bool
}

func Scan(x interface{}) {
	v := reflect.ValueOf(x).Elem()
	for i := 0; i < v.NumField(); i++ {
		switch f := v.Field(i); f.Kind() {
		case reflect.Int:
			nv := 37
			f.Set(reflect.ValueOf(nv))
		case reflect.Bool:
			nv := true
			f.Set(reflect.ValueOf(nv))
		}
	}
}

func DoABunchOfThings(x interface{}) int64 {
	start := time.Now()
	for i := 0; i < 100000; i++ {
		current := reflect.ValueOf(x).Elem().Field(0).Int()
		reflect.ValueOf(x).Elem().Field(0).Set(reflect.ValueOf(int(current + 2)))
	}
	return time.Now().Sub(start).Nanoseconds()
}

func DoABunchOfThingsFaster(a *A) int64 {
	start := time.Now()
	for i := 0; i < 100000; i++ {
		a.P = a.P + 2

		// current := reflect.ValueOf(x).Elem().Field(0).Int()
		// reflect.ValueOf(x).Elem().Field(0).Set(reflect.ValueOf(int(current + 2)))
	}
	return time.Now().Sub(start).Nanoseconds()
}

func main() {
	fmt.Println("Hello, playground")
	a := A{P: 10}

	// fmt.Println(start)
	elapsed := DoABunchOfThings(&a)
	fmt.Println("Ok", elapsed, a.P)

	elapsed2 := DoABunchOfThingsFaster(&a)
	fmt.Println("Ok-", elapsed2, a.P)

	// elapsed := time.Now().Sub(start)
	// fmt.Println(time.Now())

	reflect.ValueOf(&a).Elem().Field(0).Set(reflect.ValueOf(200))
	fmt.Println(reflect.ValueOf(&a).Elem().Field(0).Int())
	fmt.Println(a)
}
