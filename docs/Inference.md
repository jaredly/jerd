# Type inference

Functions can have type variables.
When constructing the typed AST, things without explicit annotations
are initially given their own custom type variables.
And then we go through, and record the various constraints that come up.
One thing that's weird in the non-IDE setup, is that
we're doing name resolution without user feedback.

yeah let's see how this goes.

Also, how do type variables play at the lambda level?
I don't know!

should type variables be anchored to the closest lambda?
yeah I think that makes sense.
And if they get constrained across the boundary that's fine.


## Ok what are we inferring?

const m = (a, f) => (a + 2, f(a))
// might be
<A, B>(a: int, f: <A>(arg: A) => B) => B

// or like
<A, B>(a: int, f: <A, C=B>(arg: A) => C) = B

right?

hrmmmmm what would it mean

### Types of arguments and return value
Pretty basic stuff.
I'll probably want to infer the most conrete type that's valid.

### Types of effects!
For functions that are passed in, we'll want to add the existential effect.


### How to do type-classess stuff

Got to pass in another argument, that holds the modular implicit implementations.

Do I do combinatorix?
Options include:

```ts
impl Concat<Array<X>, X>
    concat(a, b): a.concat([b])

<A, I, Concat<A, I>>(x: A, i: I) => concat(x, i)
```

huh I need to know more about typeclasses.

```ts
<A, Addable<A>>(x: A, y: A) => x + y
// becomes
(x, y, ATypeClasses) => ATypeClasses.Addable['+'](x, y)
```

right?
I mean in this case it could be simpler b/c there's only one.

```ts
<A, Addable<A>>(x: A, y: A) => x + y
// becomes
(x, y, Addable) => Addable['+'](x, y)
```

But if there are multiple, we'd want to group them I think

```ts
<A, Addable<A>, Subbable<A>>(x: A, y: A, z: A) => x + y - z
// becomes
(x, y, ATypeClasses) => ATypeClasses.Subbable['-'](
    ATypeClasses.Addable['+'](x, y),
    z
)
```

Ok so for passing in functions, that needs a typeclass,
we can just wrap it in a lambda and pass in the parameter.

hm ok yeah.
so implicit parameters are really just a convenience

but so if you don't name them, then you can pretend they don't exist?
hm yeah it looks like using them explicitly makes sense.

const (+) = <A, B>(x: A, y: B, M: Adder<A, B>) => M.add(x, y)

// if it's unnamed, it can be provided implicitly.
const (+) = <A, B>(x: A, y: B, :Adder<A, B>) => :add(x, y)



Syntaxes:

- a.b - record attribute access
- .0 .1 .2 for tuple access
- a:b - implicit module access
- a:M.b - explicit module access
- 



Ok, so something that would be really nice, is to be able to
have an array of values that each have a modular implicit with them.
so a polymorhpic array, if you will.

const log = <A...>(...arg: A, ...:Show<A>) => {
    for each arg arg:show(x)
}
hm that might be weird though.
simpler maybe is to have a macro do things?
log!(a, b, c)
becomes
log([(a, Show_int), (b, Show_float), (c, Show_string)])

const log = (args: Array<<A>(A, Show<A>)>) ={Stdio}> unit

So basically we want the ability for an object (tuple, enum, record)
to have a type variable.
I think this is what allows for GADTs, too. ?? maybe? idk what's up with that

type Showable = <A>(A, Show<A>)


is that gonna make things weird?
or really hard to infer?

But in the IDE I won't need as much inference.

hmmmmm is there a way to indicate in the UI where I'm doing type abstraction?

ok what about rust traits?
is that the same story?
except you can pass around implementations........ maybe?
hmm maybe it's very like traits.



hmmmmm 
so is there a way to have the syntax elide the module we're using?
What if using a module looked like M:add(x, y)?
and then you could do :add(x, y) and it would hide the M?
it could even be x:add(y)

anyway, so module arguments are hid by default? well only if they're hmmm you could mark them as explicit maybe? if you want to.

Ok, but the nice thing about this is that go's interfaces work here, right?
Are there other things that won't work?

ok well I'm not 100% sure about how handlers will work. or rather, how they'll play with go's interfaces.

hm so handlers, could be synchronous in a number of cases, if they don't do anything fancy.
But also, I should determine how much of a hit it actually is to introduce a handler. maybe it's not a big deal.

