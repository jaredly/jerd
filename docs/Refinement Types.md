
So basic idea being: why not allow anything that can be expressed in a switch statement to be represented in the type system?

Like
switch thing {
	[Person{name: "hello"}, ..._] as v => (v now has the type of an array of at least length 1, where the first element's name is "hello")
}

How is this different from dependent types?
I think dependent types allow dependencies /between/ arguments or such, like "this list is longer than this list"
which ... idk seems very complicated, and maybe not super useful? idk.

So I mean,
I already need fixed-length arrays, for glsl.

Ok, but I want to make sure I can accommodate:
- fixed-unknown length arrays (which can just be a generic variable)
- variable-length arrays (like Array<Array<int, variable>, N>)

Given that my arrays are immutable, all top-level arrays that are arguments can be fixed.
But return values need to be variable.
howw do I express that? it seems weird to talk about an optional type variable ..... hmm ......
oh, well maybe this is where we want gadts?
🤔
yeah, if it's just locally existential ... 

```ts
type UnknowableLength<T> = Array<T, N>
```

ok, but the cool thing you can do with existentials is:
```ts
type Stringable = {
	value: A,
	toString: (A) => string
}
const stringables: Array<Stringable> = [];
```

Do we call it a "hidden type variable"?

probably.
Do I want there to be a way to ... indicate explicitly?
Like how I do `Person<int>{age: 10}`...
...
because I do kinda want a way to be explicit about what names are what
like
```ts
type Stringable<A, hidden B> = {
	other: A,
	value: B,
	toString: (B) => string
}
```

oh
hm

so the other thing,
is I want to be able to use aliases to hide things.
right?
like
`Array<Item, Length: int>`
oh btw do I care that one coult technically ask for an array of length string? there'd be no way to construct it, so I think it's fine?
`type VariableArray<Item, hidden A> = Array<Item, A>`

ok, but the other way to do this, would be to allow existential variables directly, right?
so you can just have `() => Array<int, 'a>`
and `type Stringable<A> = {other: A, value: 'b, toString: ('b) => string}`

how to ensure that when accessing existentials, I'm identifying things correctly? I think ocaml keeps track of like a global uniquifier or something.

ok so I think I'll want to do a bit of magic around arrays,
because I want the length type variable to be optional.
which isn't something typically supported.
/and/ I want to do automatic subtyping. which I definitely don't
want to support in the general case.
but is required for people to be able to use arrays without caring
about lengths, if they don't want to.





oh unrelated, maybe ' can be my quasiquote mark? b/c I'm not using it for anything yet
