
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


