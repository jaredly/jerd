
So, in javascript, it's easy to do row polymorphism
so we can do

```ts
type hasAge = {age: int} // #2234
type hasName = {name: string} // #4321
type person = {...hasAge, ...hasName} // #4123
```

The representation of person `{age: 10, name: "Me"}` is:

```json
// hi
{
    "2234_0": 10,
    "4321_0": "Me",
}
```

so accessing `person.name` becomes `person["4321_0"]`. So easy.
And updating a record `{...person, name: "NewName"}` similarly easy, `{...person, ["4321_0"]: "NewName"}`.

The trick of it is: How do to this in a language that doesn't have a hashmap primitive?
For example, scheme.

And the gist of it would be: if you have a function that expects a `hasAge`, and you're passing in a `person`, you would pass both the `person` object *and* an "offset". Where person is a list in this case of `(list 10 "Me")`, and hasAge is at index 0. Whereas hasName is at offset 1. And then update is clone the list + set at index 0.
(vectors might be more appropriate in this case, as it happens).

Now it's even trickier to think about a go backend ... and maybe that's just beyond what I can figure out at this point?

oh wait in go I can just do "records are interface arrays hahaha" and then manually index into them?
that seems a little bit ffi-hostile.

One cool thing is: row-polymorphism will be explicit.
So if you want it, you have to do `<T: hasAge>(t: T) => t.age`. So callers & the body know that we're in a row-polymorphism setup.

hmmmmmmm.
So my question is: can I use reflection to figure out where in the thing ...
can I get a struct field by index?


```go
current := reflect.ValueOf(x).Elem().Field(0).Int()
reflect.ValueOf(x).Elem().Field(0).Set(reflect.ValueOf(int(current + 2)))
```

That's 3x slower than `p.P += 2`. Which is maybe an acceptable cost?

and we'd need to pass an int offset along with the value.

because it would look like

```go
type HasName struct { H_1234 string }
type HasAge struct { H_4321 int }
type Person struct {
    H_1234 string
    H_4321 int
}
```

and then
`const getAge = <T: hasAge>(t: T) => t.age` would look like

```go
// getAge
func H_53452(t interface {}, offset uint) int {
    return reflect.ValueOf(x).Elem().Field(offset).Int()
}
```

so, you know, a little wonky.
but maybe not a huge perf hole.


