
# Functions

```ts
const hello = <T,>(x: T) => x + 2
```

# Application

```ts
someFn(arg, arg)
```

# Effects

```ts
raise!(Some.effect(arg1, arg2))

handle! lambda {
    Some.effect((arg1, arg2) => k) => {},
    pure(v) => {},
}
```

# if

```ts
const x = if (hello) {
    23
} else {
    40
};
x + 2
```

# switch

```ts
switch x {
    Some{_: x} => {
        // please
    },
    None => {
        // yes
    }
}
```

ummmm should I do the "capitalization matters"?
like, how do I distinguish between a variable name?
oh "x as y"

# Patterns

```ts
let (x, y, z) = // tuple
```

# Control structures

- if expression
- switch expression
- for loop????
- loop/recur?

# Variable declaration

```ts
const x = y
```

# Mutability!

```ts
let x = mutable!(y)
// affine types here we come

immutable!(x)
```

# Comments

```ts
// c-style
/* and multi
line */
```

# Infix operators

Your standard `+ - / * < > <= >= ==`.
Gonna have typeclasses for these, so we can grab the right implementation of `==` for example.
And want to have a macro for essentially `@deriving ord`.

# Basic builtin types

- string (utf8 string)
- int (64 bit float in js)
- float (64 bit float)
- bool (true/false)
- Array<T> (js array)
- StrMap<T> (js object, go map[string]interface{})

- tuples (in go, `struct {T_0 interface{}; T_1 interface{}})`, defined in the prelude probably?)

# Builtin functions

- `hash` probably? Might not be the same between platforms? idk

# Prelude types

- Option<T> (Some/None)
- Result<Ok, Err> (Ok/Err)

# Records

```ts
type Person = Person{
    name: string,
    age: int,
}
type Employee = Employee{
    ...Person,
    level: int,
}
type Buildable<T> = Buildable{
    inner: T,
    built: bool,
}
```

# Enums

```ts
type Pet = Cat | Dog(int)

type Animal = ...Pet | Cow{
    fleas: int,
}
```
