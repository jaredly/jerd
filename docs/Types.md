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

## Records with type variables

// this record is not-yet type-applied?

```ts
const addTwoInt = (one: Array<int>, two: Array<int>, adder: Addable<Array<int>>) => {
  adder."+"(one, two)
}

const ArrayAddable = T -> Addable<Array<T>>{
    "+": (a: Array<T>, b: Array<T>) => concat<T>(a, b),
}

addTwoInt([1], [2,3], ArrayAddable<int>)

// ^-- so here, with monomorphization, we can codegen
// ArrayAddable<int> as its own struct.

// What about fully generic?
const addTwo = <T,>(one: Array<T>, two: Array<T>, adder: Addable<Array<T>>) => {
  adder."+"(one, two)
}

// hm ok actually this is the same story.
// Would I ever want to do something like this?
const addTwo = (one: Array<int>, two: Array<float>, adder: T -> Addable<Array<T>>) => {
  adder<int>."+"(one, one)
  adder<float>."+"(two, two)
}
// Should that be allowed? Can I disallow it?
// It feels like this would defy monomorphisation ...
// Mitigation strategies:
// - only allow type-variable record literals at the toplevel
// - not allow them to be passed un-quantified into functions

/*
but like maybe I can monomorphize it?

yeah, so it would mean: turn every (arg: T -> what) into multiple args, one for each incarnation.

which seems at least theoretically possible?

ok, and any definition inside of a function also gets expanded out into all necessary uses.

hmk that does seem a little extensive. but still possible.

Ok, so maybe I won't worry about restricting use of this,
and just work on making it work correctly.

*/

```

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


## GADTs

How would I do existential types?
Like
```
type X = <T>{
  val: T,
  toString: T => string
}
```
?

hmmmm that wouldn't work really for comparing props,
because we don't have universal equality...
I mean we could I guess. deepEqual till the cows come home.

Also, at some point I might want to go ahead and do the "functions can be comparable & sendable" thing. Here's how I would do it:
- functions would have a hash attribute `myFn.hash = 'abcdef'`
- functions would have a `scope` attribute, which is a mapping of scope vbl names to values
- when calling a function, you pass in the scope attribute as the first argument.
so
```ts
const myFn = (scope, x) => scope.y + x
myFn.hash = "some hash"
myFn.scope = {y: y}
```
