# What's in an IR?

So, basically the IR grew out of the javascript backend, and was made more general.
but
I might need to rething things a little

what if there were multiple steps:
1) the full typed tree, with all the goodness
  - applications can be polymorphic, functions and structs have type variables
  - switches, raises, handlers
2) compile effects into CPS
  - applications are still polymorphic, functions and structs have type variables
3) 
  - switch -> ifs
  - tail-call -> loop
  - expressions -> returns
> javascript gets off the bus
4) monomorphize
> go gets off the bus
- this is the break where I think it makes sense to have a shared llvm intermediate layer -
5) lift lambdas to toplevel functions, handling closure scope
6) do reuse analysis or whatever and get some GC going folks. like perceus or whatnot.

Soooo conceptually
- Monomorphizing can happen within the normal AST.
- but switch->if, tail-call->loop, expression->return cannot
So that's maybe something that's feeling weird
because I'd been assuming that monomorphizing would happen /after/ doing the other transformations.
well and monomorphizing will have to mess with function arguments, in the case of polymorphic lambdas. *but* we'll have to do an iterative process.

so now "TermTypeLevel1 -> TermTypeLevel2"
but Term -> Term (with stricter assumptions)

hrmmmmm

would definitely be worth looking at roc's IR (mono/src/ir)








