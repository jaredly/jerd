package main

import "io/ioutil"

func rawSvg(rawSvg string) {
	// TODO: Measure the bounds of the drawable
	ioutil.WriteFile("raw.svg", []byte(rawSvg), 0644)
}
