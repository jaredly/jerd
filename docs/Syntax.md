
# Macros!
So rust does `name!`, which is neat. And also `#[decorator()]` stuff.
Then there's python's `@decorator`, which has a certain charm. Especially because I'm thinking of allowing decorators anywhere in the tree, not just at toplevel. There's also a stage-2 proposal for js using `@`, which is nice.

So
```ts
@something yes
@something("please") yes
```

So, how about things that replace nodes?
Like a macro invocation that replaces nodes?
maybe start with a hash? or do the bang?
`#something(yes)`
or
`something!(yes)`

and again, I'm not going to do custom syntax.
All nodes will be parsed and type-checked before going in,
unless explicitly quoted (need a quasi-quote node folks).

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
oh "x as y". um just scoping folks. yolo.

# Patterns

- constructors `Some(x)`
- tuples `(x, y)`
- arrays `[x, y, z]`
    - array spreads? `[x, y, ...z]` is easy to represent in my exhaustiveness checker, just turn it into `Cons()`.
    - but what about spreads at the start? how do you determine exhaustiveness? like `[...a, b, c]`. oh we could have "cons" and "snoc" constructors .... that could be nested. would that be weird? might be doable. so `[...a, b, c]` would be `Snoc(Snoc(a, b), c)` and `[a, b, ...c, d, e]` would be `Snoc(Snoc(Cons(a, Cons(b, c)), d), e)`. And a list could be `Snoc | Cons | Nil`. That doesn't quite do the trick though I don't think. because `[_, _, ..._] | [..._, _] | [_] | []` is exhaustive. So yeah might need a new pattern type representation for that.
    - ok folks I figured out a way to do it, without changing the algorithm! pretty jazzed about it.

- literals `"hello"`
- should I allow "equals variable"s? would that get in the way of exhaustiveness checking? I mean it might make redundancy harder to do, so we can say "this might not detect redundant ones". But that's fine. I feel like `=vbl` would be good syntax.
- how about "guards"? they can be quite useful. maybe I'd want to require that guards be pure? yeah, I think for the moment I probably do. I could relax that restriction later, but it kinda makes sense.


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
