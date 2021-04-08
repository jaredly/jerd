# jerd
(rhymes with "bird" or "herd")

a language, I think

## Development

Cli/core (in the `language` directory)
- `yarn watch` in one tab
- `yarn watch-tests` in another

Web/editor (in the `web` directory)
- `yarn start`
- open up `http://localhost:4343`


## (intended) Features:

- [x] algebraic effects
- [x] compile to readable javascript
- [x] code is hashed typed AST in a database, not text in files
    - for convenience of reading and stuff, there will be a readable
      file format. It will not be the main method of development though.
      but it's also super useful for showing examples, and project templates,
      and runtime tests.
- [ ] typed macros
    - also untyped macros I guess (?) for when you want to make changes before the typing has happened.
    - but macros are written in this language, and so are referenced by hash, so you can run them once and store the results right? well I guess if they have access to the typing env, then it's possible for them to be less reproducible. I'll need to make sure they are deterministic.
- [ ] modular implicits (type classes)
- [ ] higher kinded types
- [ ] structured editor
    - you can annotate an AST node with a "log me please" thing that will be interpreted by the dev env, but doesn't impact the hash. For debugging.
- [x] sum & product types (rich enums & structs/records)
- [x] "row polymophism"-ish. subtyping on both enums and structs
- [x] generics
- [ ] well type-checked interface with typescript
- [ ] "partial" types for WIP development
    - if you have a type error, you can still compile, but your function
      will now require the "type error" effect, which isn't something you can
      handle in user code, meaning you can only run this code inside of the
      dev env.
      inspured by that one language, that maybe was a color? or a nut?
      had a structured editor.
- [ ] affine types for safe mutability
    - I might actually not do this... following roc's lead seems like the more reasonable approach.



## Inspirations

- unison
- rust
- ocaml/rescript
- shem/golem
- scheme
- clojure

## What do I want to build?

A web party thing for making fun animated gifs.
You will have a canvas
and such.

What's the method for interacting with the canvas?
some pure functional description of a scene?
or mutable stuffs?

hmm.
inspired by http://www.quil.info/ probably?
also reprocessing to some extent.


## Status

- [x] working on getting a basic effects setup going
- [x] need to support self-recursive functions.
- [x] then probably need to support `let`, b/c that's important

What am I trying to build?
As my example project?
A webserver? idk.
Oh whats my react interop gonna look like?
The type of react fns will definitely be required pure. so that's fine.
ehm
also do I actually want to try to build a go backend?
i wonder what i would do with it.


## Some local type inference

because I'll need it I assume.

Basic idea:
- whenever I come across an undetermined type, add a type arg to the local env
- when I encounter a constraint on the type, add that constraint to a list
- at the end, try to unify all constraints. This can be polynomial time or something, it's fine.


## CPS how do we do it now.

So basically I'm thinking: Every function is either CPS or Pure.
Some functions are generic, so can be both. And those will have a hash_XYZ_pure and hash_XYZ.

## Code is referenced by-hash, not by-name

- renames don't break things
- reordering args (?) um doesn't break things? (maybe need annotation on the function definition to indicate visual reordering)
- if you change a function, none of the things using it change, unless you rebase them explicitly.
- same for if you change a type

## Macros

Macros get a typed-ast, and the typing environment.
All terms are evaulated "top" to "bottom", only explicit circular dependencies for terms declared at the same time.
Including quasiquoting I think.

What things are macros? is `match` a macro?
Do macros always get a `continuation`? Or are they just allowed to `return`? .....
....
...
..
.



## Effects

OPEN ISSUES:
- the handleSimpleEffects2 has this hack where if you don't pass any arguments, and therefore it only gets 2 args intead of three, it knows the first one should have been a null. This is a hack and I should fix it.
options include:
- effects can't return void, they can return `unit`. which ends up being null.
  but would that mean that any zero-arg calls have to be passing unit around?
  that's a pain.
  or that `k()` turns into `k(())`, which is also awkward.
  is there a way to, at the place where I produce the `k`, make it a lambda
  yeah idk.



Question: can I unify "effect definitions" with something else?
- record definition? not really. enum? also no
- modular implicit? 🤔 there definitely seems to be something similar here.
- but in this case the thing I'm accessing is Global
  > ok so the big deal here is ... hm so for unison, the big deal is mutation
  > because otherwise there's no mutation.
  > but I'll have single-owner mutation, right?
  > so async is the big win, I think?
  > I mean, hmmm
  > yeah if we have modular implicits too, some of the wins are less for effects.
  > but yeah, IO. so you can mock it out. especially to do the asynclyness

Ok is there another layer of "dependency injection" that I want to capture?
maybe, but I'll think about it later.





so, continuation passing style
what do handlers look like?
am I still adding something to the "global" handler stack?
seems like that wouldn't really gel.
come to think of it, the scheme version would probably
not be happy about using green-threads or whatnot.
So, I'm thinking the handlers are ... something that's passed along with context?

yeah I should definitely figure out what I want to be doing there.



Ok so I need to capture
um
wait ok so what do handlers look like? that's where cps might start, right?

```

ok but I really need to graph this out.
and maybe I can just construct a bunch of tests with the current runner?
and add tracing?




the type of raise! is
Effect<'b> => 'b

the type of handle!<Effect<'a>>
(
    () ={'a, e}> 'b,
    'a ={f}> 'c, // impure case. where does 'b go here?
    'b ={g}> 'c  // pure case
) ={e + f + g}> 'c



; ('a, () ={Store 'a, 'e}> 'b) ={'e}> 'b
(define (withInitialValue v f)
    (handle! f
        (get () => k) => (withInitialValue v '(k v))
        (set (v) => k) => (withInitialValue v '(k v))
        (pure x) => x
        )
)

; () ={Store int}> int
(define (example)
    (raise! (set (+ (raise! (get)) 4)))
    (raise! (get))
    )

(define test1 
    (==
        5
        (withInitialValue 1 example)))


// if there's a way to do pure
const test1 = 5 == withInitialValue_pure(1, example)

// otherwise, everything has a continuation, ugh
const test1 = k => withInitialValue(1, example, [], res => k(5 == res))

const example = ()






const withInitialState = (v, f, handlers, k) => {

}





















// This is the "impure" version; with higher handlers
const withInitialValue = (v, f, handlers, kont) => {
    // ermmm maybe this is hard?
    let res;
    f([{
        get: (k) => {

        },
        set: (v, k) => {

        }
    }, ...handlers], v => {
        kont(v)
    })
}

const addFive = (handlers, k) => {
    /* set(get + 5); 12 */
    // ummm I think we need a new k? hm yeah.
    // hm what happens to the old k?
    handlers.get((v, k) => handlers.set(v + 5, (_, k) => k(12)))
}









// This is the "pure" version; no higher handlers
const withInitialValue = (v, f) => {
    // ermmm maybe this is hard?
    let res;
    f([{
        get: (k) => {

        },
        set: (v, k) => {

        }
    }], v => {
        // this is the "pure" maybe?
    })
}


```



So, is it easier to think of transforming to call/cc and then to cps?
or just directly?

```
const maybeThrow = (v, k) => {
    if (v) {
        raiseAbility(someAbility, k)
    } else {
        // BUT if we know for sure that doSomethingElse has no effects,
        // then we can just do `const res = doSomethingElse(4)`
        doSomethingElse(4, res => k(res))
    }
}
```

Ok yeah that wasn't so bad.
but the global stack of abilities won't play nice with javascript's asyncness.
So I think we'll want a second parameter that's passed all along,
that is the "handler stack".

```
const maybeThrow = (v, handlerStack, k) => {
    if (v) {
        raiseAbility(handlerStack, someAbility, k)
    } else {
        doSomethingElse(4, handlerStack, res => k(res))
    }
}
```

Yeah I feel like that should work?

Ok so this means that we're going to need an IR that probably loses some type definition? but we want to do something source-mappy (a DFS traversal visit ID of the node in the TypedTree that we came from, probably).

Also the handler stack, each handler will be annotated with the effects
that it can handle. and it'll get skipped if it can't.
And if none can, then we get to skip right to the builtin implementation potentially.

----

yeah ok let's see if we can get effects working

<<<<>>>><<<<>>>>


## Javascript Runtime Representation

The goal is to enable easy interop with TS/Flow

- string - string
- int/float - number
- array - array
- list - linked-list via array tuples

enum Something {
    One(int, text),
    Two{name: string, age: int},
    Three,
}

```ts
type Something = 
    | {type: 'One', args: [int, text]}
    | {type: 'Two', name: string, age: int}
    | {type: 'Three'}
```

hrmmmmmm do I do hashes though intead of text names? hrmmmm how much do I care about
being rename-resiliant?

hrmmmm
interop vs ... trend setting or something
like, not having to refactor if you rename something is neat I guess
but is that such a huge issue?
I mean sure, internally changing names of arguments or whatever, sure.
that doesn't need to be externally observable.

but if we want interop, which I do,
then yeah. not sure about that one.

Because if I want to go whole-hog, then it doesn't make sense
to try to match a typescript type. just convert to & from at the border.

ok and then the record type is the same dealio.

ooooh ok so what if you could specify certain types as "ffi" types?
like "nomangle"?
And so they would have the normal names.
but then you wouldn't be able to rename stuff without a migration.
which is reasonable.

Ok so we have
- normal (structural) types
    - memory representation is an implementation detail. could be an array, or an object, or whatever.
    - names are not used in computing the hash, nor do they appear in generated code (other than as comments probably).
    - might do disc unions for typescript's checker's sake, but with `type: hash + idx` instead of a normal name.
- unique structural types
    - like normal ones, but with a few bytes of random hash to prevent conflicts I guess
- ffi (nomangle) types
    - layout done to mirror typescript/flow discriminated unions, names are used in hashing, and at runtime. so, super easy to get data in and out.

Beyond that, what does FFI look like?
How do I declare an external function?
- I mean probably with a type and a reference, right?
    - the default is for all js-sourced args to be validated, because untrustworthy. also for js functions to be wrapped in a try/catch(?). You can annotate with `@unchecked` to opt out and just rely on typescript's type checking.

// umm do I enforce npm versions? no that would cause so much sadness.
```
import createElement from "react" : <T>(string) => ReactElement
```

hm so I need a way to declare foreign types too. that is, foreign opaque types.

herm so when I say ffi, that does let messyness into the program. right? purity is lost.
which we don't love.
hmm.
the other option is to require that all ffi happen through effects.
which gets in the way of react.createElement, thats for sure.

hmmm we could have a `jsExn` effect that is an escape-continuation effect, that gets auto added to your functions if you're using javascript ffi.
well so the jsExn is one thing, and you could do a try/catch to "remove" it, which is nice.
but I feel like I still want a way to indicate that this function is "unsafe" in a general way.
and maybe an effect isn't quite the right way to do it.

but as long as I'm tracking stuff, might as well track a lack of safety, right?

hrmmm I wonder how escape-continuations would play with my cps stuff.
feels like it might be weird.

So:
- if we are in a CPS context, escape continuations can use the same mechanisms as other ones
- if we are not, they can use try/catch
- buut if I've like resumed a normal k, and then I throw, probably weird things happen?
  well I guess I would have re-set up the try/catch when I'm dealing with the new k, right? because you have to re-wrap in the handlers ....

Ok but like I definitely want to be able to write react components.
and it would just be that they're unsafe? branded? I can live with that.

ok, so jsffi is a special escape-effect that can't be handled.
operationally speaking, it's as easy as having all ffi functions have the jsffi effect on them.

```
ffi type ReactElement ; // ffi types are Unique as well. but they can have type variables
import createElement from "react" : <T>(string) ={jsffi, jsexn}> ReactElement
```

you can
`import createElement from ":global"`
if you want to probably

or `import "hello" as goodbyw from ":global" : <T>(string) ={jsffi, jsexn}> string`

and if you're importing something from `go`, then it would have the `{goffi}` effect on it.
same with scheme.

Does that make sense? what we don't want to allow things to be switched out?
Of course, if things are implemented via a modular implicit ....
hmm ....
maybe just `{ffi}` is what it should be called.
or maybe ffi unifies the different runtimes?
