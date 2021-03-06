
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

