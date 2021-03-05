# Row Polymorphism

Ok but really it's maybe just normal subtyping?

Anyway, here's the type-level representation:

```ts
type Named = {name: string}
type Aged = {age: int}
type Person = {...Named, ...Aged}
type Employee = {...Person, address: string}

const getName = <T: Named>(item: T): string => item.name
const me = Employee{name: "A", age: 2, address: "Here"}


// this
Employee{...me, age: 3}
// and this
Employee{...me, ...Aged{age: 3}}
// are both valid

```

Employee:
- rows: [address: string]
- extends: [Named, Aged]

Named:
- rows: [name: string]

Aged:
- rows: [age: int]

Term:Record
- ref: Employee
- rows: [address: "Here"]
- extends:
    Named: (Term:Record)
      - rows: [name:]





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


Ok but actually can't I just use interfaces for this?

```go

interface HasName {
    GetName() string
    SetName(string)
}

interface HasAge {
    GetAge() int
    SetAge(int)
}

type Person struct {
    Name string
    Age int
}
func (p *Person) GetName() string {
    return p.Name
}
func (p *Person) SetName(name string) {
    p.Name = name
}
```

And then for extending stuff, you clone first and do a bunch of sets.

I'll want to pass almost everything around as pointers, which might be interesting.


So the really trickyness with go will be effect handlers, right?
Like, what's the type of `handlers`? A Map? I guess it could be. Might have some sad perf impacts, but what do you do.
So you query it for a handler, and then coerce it to the expected signature.
That might not work out too bad.

Ok but also we need immutable updating, right? So a vec might be better?
I mean maybe its just as bad. I mean a linked list?
yeah a singly linked list sounds about right.

```go
type Handlers struct {
    Name string
    Fn interface{}
    Tail *Handlers
}
func (h *Handlers) GetHandler(name string) interface{} {
    if (h.Name == name) {
        return h.Fn
    }
    if Tail == nil {
        return nil
    }
    return Tail.GetHandler(name)
}
func (h *Handlers) Add(name string, fn interface{}) Handlers {
    return Handlers {
        Name: name,
        Fn: fn,
        Tail: h,
    }
}
```

Yeah I recon that's enough to get things going. Dunno what perf would be like though.

