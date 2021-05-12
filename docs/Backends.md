
## GLSL? also Wasm?

How to do constant inlining?



Next steps:
- [x] I'd really like a web something, which could showcase the power of having a language that compiles to javascript and glsl. 
- [ ] tracing!!! Just basics for the moment, but having overlays would be so coool
    when tracing a value, have optional min & max reported, so it can show a little bar
- [ ] verify that no lambdas remain, e.g. things I can't print.
- [ ] do constant monomorphization! This could be so powerful. Pass in lambdas, get the job done!

Ok, plan being:
Have a new IR type, that's like `term`, but is `genTerm`, meaning this isn't a user term, it's something else. And it'll have `id` which is the original ID, but then a list of other hashes, representing the variables we're substituting.

And then `irTerms` is where we find the generated term?
or maybe we want a new mapping just for `genTerm`s? idk.


OK Big question:
Do I bake in the vector types that glsl expects?
like, should I just bite the bullet and make builtins for them?
Or should I continue what I'm doing and hacking it in?
idk

Also, for things like builtins
like, I kinda like the idea of being able to run a CPU version of the shader with no extra work, running in js or whatever.
And so it is useful to have implemented pure-jerd versions of these builtins, for portability.
Yeah I think i'll keep on with this, at least for the moment.

Ok, now I need to get the loop going for rayMarching I do believe.


So when thinking about targetting GLSL, I obviously can't allocate to the heap. I can do stack things.
But I definitely can't do ... hmm ... the arrays and stuff.
So I wonder if it would be interesting/useful to *infer* something like "noalloc", indicating that a function (and everything under it) *does not allocate*. and similarly, "noheap" means it doesn't need to allocate on the heap.
This way you could know *at the type level* that it would be trivially compileable into GLSL.
ok also how do I handle globals in this world?
I guess there would be a State type or something that you expect
yeah it would kindof be like a web server handler. You have the (input, output) as two variables to your toplevel function.
andddd the compiler uses the types of those things to determine what you are doing.

my goodness shadertoy has some rad things https://www.shadertoy.com/view/ls3GRr
oh wow https://www.youtube.com/watch?v=8--5LwHRhjk

https://twitter.com/greweb/status/1385709154048921604/photo/1

https://www.twitch.tv/videos/1007480150

https://www.shadertoy.com/view/ld3Sz7

and then I'd need aggressive inlining I think?
hmmm

ok so I don't really need to have that functionality to start playing with things, right? I could just start doing some compilations?

Yeah, and so like in compilation, ...
ok so things that it doesn't support:
- heap allocation (arrays folks)
- recursion of any kind (gotta tail-call optimize I guess?)
- first-class functions

Yeah so I think I could try having a really basic compilation strategy, and then add fanciness.

## TypeScript

Yup we've got it. So far typescript is able to handle everying we've thrown at it. I mean we haven't done strict typing for the handlers, but that's it.

- `ffi` types retain their names! So you can pass them to js and back

## Golang

It would be very cool to target a compiled language
I tried looking into generating go code from an AST like I'm doing with typescript, but it doesn't look like go's AST node types are meant to be user-produced 😢.
However, I can just bash strings together, and then run it through `gofmt` 🤷.

Things that are tricky:
- effect handlers
- row polymorphism
    - I think interfaces to the rescure here, with `GetX` and `SetX` functions.
- enums!
    - hmmm how to do it.
    - just have it be different types and `interface{}` do "type assertions"? like yeah I guess that works? dunno what perf implications are...

## Swift?

## C# or something?

## Scheme

Scheme is cool because it supports first-class continuations.
Although maybe that's more trouble than its worth?
And it might play weird with other things that use continuations.......? maybe? maybe not though.
oh yeah the fact that we have a global handler stack is bad news.
but maybe we could pass it along as an extra arg?
anyway, wait on this.

## LLVM?
could be fun

### Records
would need to nail down the struct representation.

Person {...HasName, ...HasAge, donuts: int}

// T: HasName
looks like (value, HasNameOffset)
where HasNameOffset tells us how to access stuff in value
and then
theThing.Name
is
add HasNameOffset to the offset for the Name (0), to get the thing.

hrmmm nope um
maybe I need change the pointer

buuuut then how do I clone the whole shebang?
yeah how do I make a copy of it?
maybe pass in a function that knows how to clone it?
my goodness this is complicated.

Ok, so
```ts
const getName = <T: HasName>(named: T) => named.name
```
becomes ...
```c
char* getname(void* named, int nameOffset) {
    return named[nameOffset + 0];
}
```

and
```ts
const withName = <T: HasName>(named: T, newName: string) => T{...named, name: newName}
```
becomes
```c
void* withName(void* named, int nameOffset, fn cloneNamed, char* newName) {
    cloned = cloneNamed(named);
    cloned[nameOffset + 0] = newName;
    return cloned
}
```

### Lambdas?
have to bring lambdas up to the top level, and the lambdas
turn into structs containing the relevant scope variables I guess?

```ts
const m = (x: int) => (y: int) => x + y
```
becomes something like
```ts
const _ml1 = (scope: {x: int}, y: int) => scope.x + y
// hmmmmmmmmmmmmmmmmm
// so we need this packed up in such a way,
// that a caller just needs to do `theLambda.fn(theLambda.scope, my, other, args)`
type lambdaFn = {fn: *fn, scope: T}
const m = (x: int) => lambdaFn{fn: _ml1, scope: {x: x}}
```

I assume this is something llvm would let me do...

side note: should I do this kind of thing in js? so that I have js function transferability / hashability / etc.?

idk. not at the moment I don't think.


