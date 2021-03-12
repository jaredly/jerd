# Types


## Atomic types

- strings
- int / float
- bool
- char?
- byte?

## Function types

Functions can be polymorphic over types or effects. Both must appear in the arguments list to make any sense.

## Records

Records can be polymorphic over types and effects.
Records can be subtypes of any number of other records.
Record attributes are guarenteed not to collide, because they are prefixed with the unique hash of the type.
In JS, records contain a `type` attribute that contains the hash of the type, for discrimination.

Records can have higher-kinded type variables, which is how you do type-classes folks.


Ok, how do we do records without attribute names? like `Some(x)`.
It could just be a syntax trick tbh.
`Some{a, b}` => `Some{a: a, b: b}`, but `Some{:a, :b}` for nameless?
hmm actually maybe the punning syntax should be the more awkward one? b/c for real optionals happen a ton.
so `Some{5}` is `Some{contents: 5}`, and `Some{:contents}` is `Some{contents:contents}`. sounds legit.


## Enums

I'm not yet 100% sure what to do here, but I have an idea.

It's *very* attractive to me to have enums *just* be the named disjunction of other record types.

That means that:
```ts
type X = One | Two | Three{name: string}
```
defines 4 types; "One", "Two", "Three", and "X".

Ok, but how do I reference an actual already-defined enum?
Just some different syntax. like `@One` or something? idk.

So these folks have a similar thing going in Opa https://hbbio.tumblr.com/post/32392287727/power-rows-part-2

## Builtin collections

- `Array<T>`, gotta have it
- `StringMap<T>`, backed by the js object
- `Map<K, T>` for when you need more
