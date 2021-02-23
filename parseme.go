package main

import (
	"encoding/json"
	"go/parser"
	"go/token"
	"os"
)

// Welp this super didn't work
func main() {
	fset := token.NewFileSet()
	f, _ := parser.ParseFile(fset, "./parseme.go", nil, parser.ImportsOnly)
	raw, _ := json.Marshal(f)
	file, _ := os.Create("./example.go.ast")
	file.WriteString(string(raw))
	// println("Ok", raw[0:10])
}
