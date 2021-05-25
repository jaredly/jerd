
## Ok, grand vision folks
This will probably get people excited.
Make an explorable explanation for the pendulum fractal.
For the code, we could go fairly simple and have the rendered version w/ "knobs" a la worrydream's thing, and then you can "edit" to get into a full text editor scenario.
But that will be on a per-term basis.
But then there will probably be a full tree-notablemind-style dealio for the text, where it's rich text, and we can have nested things, and headings that expand.
And maybe a toggle at the top that's like "I know GLSL / shader stuff" vs "I don't"? And "I know trig & pendulum physics" vs "I don't"? Although maybe we can just let people scroll?

Anyway, I feel like it would be super cool.
And then let people see the generated GLSL, for funs and such.

Basic layout:
- do one where we're just drawing the pendulum, nailing down the `update` function
- we'll cover "storing the state in a texture"
- but only for the top left point
- then do the full fractal
- then bring back the visualization for a single point
- then bring in the mouse pointer
- then bring in another buffer to track the last several points? or wait, there's "u_trails".... maybe I can use that instead? that sounds reasonable. that'll require some constant folding I do believe.

Yeah, but allowing people to right-click on a thing and "add a trace" sounds super fun :D :D :D


> SO
> Things to impl to get to this glorious future:
- all the inlining, thanks

oooh so having a `min()` function that takes varargs and then does a reduce on the array
in glsl, varargs become a FixedArray...which I still need to figure out how to represent
OH but then, if it then just ends up being `foreach i of values { res += i }`, then I can do loop unrolling! because values has a fixed length.

... although the much simpler thing is to define a custom operator....


Should I turn back on call args type-checking?
I think I'll need to get done-lambda going? In order to do that?

So I also want pretty-printing I guess
but I'll need to keep track of comments in order to do that.



## Lets do fun things! Raymarching and such

- [x] desperately need inlining. What will that take?
      Should I do whole-program-opt in the IR?
- [x] make uniques actually truly unique
- [x] ugh I need parenthesis for overriding op precedence.
- [x] break out toplevel record items, so we can do resonable
  custom operators, and have them get treated right
- [x] inline immediately applied functions, let's really get this done.
  - PLAN FOR THIS
    - cases to consider
      - basic final if/else
      - if/else to variable
      - switch statement, which will be a bunch of ifs
      - if that doesn't end in a return. but might contain something that does.
      - So, in the general case, I think we just do: we have a top-level "hasReturned", and put all blocks in a "hasReturned" if (merging with an if if it exists?)
- [x] specialize functions that take a function argument
- [ ] handle passing a lambda
  - options:
    - immediately toplevel-it
      - this seems better
      - ok, so if it requires in-scope variables, ignore it for now.
      - and later we'll do a fun struct thing.
    - try to inline it, and then toplevel it if necessary.
- [ ] forbid the use of lambdas that close over things? or just convert the closed stuff to a record?
- [ ] fix inlining of recursive functions? well to do that I need to do inlining of lambdas that capture scope variables.
- [ ] OK and then we also need MULTIPLE NAMES. So idNames needs to be a list. And let's extract all usages of idNames into env.ts.
  - Then we can overload all the builtin functions to our heart's content, and maybe be ready to actually demo stuff?
  - of course, we'll then need the ability to indicate that a given term "overrides" another term, and should take precedence in the 'idNames' list. ... although, maybe that's settled by just having newer things sorted after? ok but I do want a replaces thing. But will also need a 'createdDate' metadata, do want that.
- [ ] AND THEN we can bring this wonderful GLSL goodness to our web editor bonanza.



- [ ] full and correct inlining of functions. Every function should be inlineable, unless it is recursive. We will then only use inlining for:
  - eliminating lambdas

How / what to inline and stuff?
- Ok, so we also want to fix the "toplevel struct" issue.
- OH yes let's have struct support too folks. So we can do tuples and whatnot, thats nice
- ALSO: type-directed name resolution, allow multiple names for things, so that we can overload vec4 and stuff, that would be extremely nice. Also so we can have "-" as a unary op and a binary op and so we can have "+" be for strings.

- [ ] now that I have uniques, I don't have to worry about declaration collisions.
- [ ] make a transformer to sweep through blocks and move up empty defines to the first assign

Whole program opt:
- if a function is always called with one argument as the same value (either a constant, or like a global hash, or something), then delete that argument, and inline that value.
  Ok this is whole-program, and would be moderately complex.
- inline anything that doesn't have lets? might as well. Could have an @inline annotation if we wanted. But cooler to do it automatically.
- yeah this is super fun. although, quite slow. will be cool to make the switch to GLSL.

- [ ] it would be really nice to be able to spread a larger type into a smaller type, ya know? like `Vec3{...someVec4}`. Just sayin.






## How to convert to the new handlers representation without it getting out of hand?

### Refactors needed

Ones that are non-breaking
- [x] liftEffects is nice
- [x] adding types to IR Exprs
- [x] use helpers for lots of IR exprs
- [x] helpers need less types
- [x] type-checking the IR as I create it
- [x] converting types to passing-handlers instead of having-effects (this can be a place where we then convert, yeah that's great.)
- [x] fix the `unknown` type hack. sequences should be able to know that the `done` doesn't need another variable. And if the `done` does need another variable, it really shouldn't. So yeah sequences need to be smarter about that. I guess I could inspect the `done`. ... and that might be the best way to do it? Oh but first I want to abstract the "call done" thing into a central place (because that's where handlers are passed). And then I can have that be the only place where I check if the done wants a value.
- [x] fix the backtracking handler to be compatible with the new method
- [x] make an outputoption for the new version
- [x] make a cps-lambda type so I'm not making up garbage everywhere, looking for effects and stuff.
- [ ] make a done-lambda type to y'all
- [ ] re-enable call checking, figure out why types aren't happening right for the T0 thats actually void.
- [ ] update the new stuff to use these new types its great


More non-breaking please:
- [ ] make a cps-lambda type? er maybe its not 100% working
      maybe lets just add info to the current lambda type
      as a stopgap.
      given that we never modify things (or well I guess we
      kinda do? idk)



orr hmmm can I jump into it right now?
just try to do the new effects bonanza?
oh ok what if
I have a setting for the new version. yeah that's nice.
and outputoption I believe?

Ones that are breaking
- [ ] switch from a single handlers variable to several, so we can handle polymorphic effects

<!-- - [ ] move handler & raise generation into the IR. This'll be a little dicey(?) because some functions don't have
- [ ] abstract out all the places where we're using `handlerVar` &c explicitly. -->

## Immediate:

Type system changes:
- [x] types need to be able to refer to themselves (recursion)
  - [x] basic self-referrential enum
  - [x] basic self-referrential struct
  - [x] destructured items from an enum or struct should .. work correctly. Maybe modify the `apply type variables` to also substitute `self` references? tbh that sounds pretty good. I mean we could treat `self` as a variable ... hmm ... oh didn't need that. the applyTypeVariables worked for piggybacking.
- [ ] effects need to be able to refer to themselves (recursion)
  - effecs need a 'substituteTypeVariabels
- [ ] mutually recursive types pleeeease
- [x] `enum Child<T>{A, T}` should definitely not work...

or, hrmmm mmaybe I need to allow effects to be effect-polymorphic?
like, I'm making this `timer` effect, to allow setTimeout.
and I'm not sure what effects the function I'm passing in should be
allowed to call.
how do I restrict that?
maybe that's the reason for the blanket "IO" type. Like "this is everything you
can do from an IO context".
But I want to be able to restrict that.

```ts
effect Time{e} {
  setTimeout: (() ={Time, e}> void) => void,
}
```

certainly you should be able to produce new timers from within a timer.
but semantically,
Time{Time} wouldn't be able to resolve, Time{Time{Time...etc}}
how do we solve this? generally through type aliases, right?
alias TimeWithTime{e} = Time{TimeWithTime{e}, e}

anyway, that's quite complex.


But at the end of the day, I want a platform to be able to say:
"we provide Time, FS, and Web, and you can call any of those from any of those"

hmmm should we have `@ffi effect`s? For ease of specifying?


Type system changes:
- should we have a `map` type? yeah, stringmap. builtin. Literal `{"yes": thing}`
- general `Map` is also available, but it doesn't have the literal syntax I think? orr I think yeah you pass in a list, but if it's all literals, we optimize away the list or something
- Some/None, gotta have it. because it would be super nice to have optional record items. (in js, None = undefined if the contents are conrete and not another optional... orr wait, None is always undefined, and `Some` is just the thing if the contents are concrete and not another optional, otherwise it's a one-tuple)

Hmmmmm I wanttt a better solution for nullable / optional types.
Ideally one that doesn't have to box nulls if possible.

Editor things
- [ ] multiple notebooks
- [ ] export & import to file (will lose metadata, unfortunately maybe, unless I do a decorator)
- [ ] 

Codebase format changes:
- [ ] allow multiple things with the same name?
- [ ] modules! please
- [ ] also have metadata about terms, including
  - deprecatedBy (newTerm)
  - derivedFrom (oldTerm)
  - author name
  - creationDate number


- [x] fitsExpectations => make it exact, using nice errors. remove all unification whatnot for now.
- [x] FFI type (something on record, parsed as a decorator)
- [x] graphic repl (see shem)
  - so for the moment ... I'll ...
    add these definitions to a special "web prelude"
    and know about the IDs of things? or wait, no they're
    tagged by normal names. So I can just start rendering them.
    or wait. No, I do need to know the IDs, so that I can know
    what type to watch out for to trigger rendering. Yes.
- [x] array destructuring please
- [x] allow qualified binops, so + doesn't lie
  - also so that I can do `.str()` and it will pick the right one. So like, I need more builtins? And builtin types?
- [x] better builtins setup (only defined in one place)
- [x] prelude in jerd, for operations and stuff
- [x] tuples, you need them yes
- [ ] generic effects please
- [/] intermediate output, target go or python
  - what level of granularity? do I assume switches? naw, I don't think so.
  - So the main task is doing the CPS transform, right?
  - are there other tasks to be done here?
  - [x] initial go generation
  - [ ] do I monomorphize for go or swift targetting? orrr have an explicit "Box" and "Unbox" IR type.
  - [ ] fully handle type conversions
- [ ] structured editor with type holes and such
- [ ] documentation as data!
- [ ] comments as data pleaseee
- [ ] "commended-out" ast nodes, that are still parsed & type-checked?

- um think about making type representation simpler :0: like typing-haskell-in-haskell

- [x] base types (string, int)
- [x] functions
- [x] binops
- [x] validate basic effects setup (CPS etc)
- [x] basic generics!
- [x] if
- [x] simple-let. gotta have it
- [x] type variables in type declarations
- [x] effect handler return value fix
- [x] source maps!
  - [x] basics
  - [x] actually map all the things, so we can step through reasonably
- [x] verify that nested effects work
- [x] implement all the examples from the eff paper
  - [x] basic (collect)
  - [x] reverse
  - [x] pickTrue
  - [x] pickMax
  - [x] backtracking
    - oof this has really bad time & space complexity.
    - need to figure out what's going on.
    - maybe stepping through with sourcemaps will work? maybe?
    - or generating a trace of the execution? and some
      way to visualize it?
      I would love to have a diagram of the stack,
      and handlers, and such. idk.
    - found the bug! turns out I was concatting the same array to itself in some places
      which gets very large very fast.
  - [x] State
- [x] effect variables, cmon (functions generic over effects)
  - [x] make it work when pure too
    - ok plan is: `directOrEffectful: 'direct' | 'effectful' | null`
    - and then {direct: fn(), effectful: fn()}
  - recursive isn't working for some reason
- [x] some coverage testing of what we already have, just to check.
- [x] records
  - [x] basic
  - [x] spread to update
  - [x] ~inheritance (subtyping)
  - [x] generic
  - [x] FFIable types. (with nice attribute names and such)
- [x] nail down type checking, remove any subtyping.
- [x] give me Array<T> or give me sadness
- [x] NamedTuples (records without attribute names) so I have `Some()`
  - ok copout on this one, I'm allowing you to do `Some{_: 10}`, to omit the attribute name. I don't love it, but I don't want to sink too much time into it.
- [x] enums
  - [x] basic
  - [x] generic
  - [x] also subtyping? like polymorphic variants?
- [x] match
  - [x] very basic
  - [x] record patterns
  - [x] exhaustiveness analysis
    - so the plan here is to keep track of 'paths' that are partial. a later path can come through and make it total. when going in, need to list out the other options that need to be filled. or if it's like numbers, then good luck folks. or strings.
    - ok but this case analysis needs to be done *after* type checking. yeah. not as part of it. so that I can reuse it in the structured editors.
    - [x] basic impl of the Maranget paper
    - [x] hook it up folks!
  - [x] sub-enums
  - [x] arrays! slice! dice! thrice!
  - [ ] guards I do believe (restrict to pure tho)
  - [ ] ors too x | y
- [x] some builtin macros!
  - [x] @typeError("message")
    - to indicate that this expression should trigger a type error. so I can verify that I'm excluding invalid stuff.
- [x] put this on a web sit! animations or some such.
  - [x] basic thing
  - [x] make source mapping really solid!
  - [ ] Probably update that source map visualizer to track issues.
  - [ ] then we can do cursor-preserving auto-format. *but* we would also want type inference at that point. And when rendering, indicate which things are inferred. And have a way to show a type error or something.
  - [x] yeah, so first pass would be like a textarea per term, orr maybe a contenteditable? need look up the latest dealios.
  - [ ] and then try doing a full-on structured editor. would start small & build up, with an eye to making it possible to generate the structured editor "visual syntax" from a grammar definition.
  - [ ] modal editing for life. might make people sad though, should have a non-modal option.

- [x] basic attempt at compiling to go or swift or something?
  - Yeah I really should get on this before too long, so I can see what hurdles I run into.
- [x] loop/recur please (turns out just converting self-tail-call into while(true) is good)
- [ ] generic effects (Store<T>)
- [x] tuples
- [ ] port the unison runtime effects tests, verify that all is well.
- [ ] exit-only effects? (call/ec) Can I just use exceptions in the js? would need to check.
    I don't *think* I can in go... oh wait, panic/recover might get it done.
- [ ] let & function arg destructuring of records
- [ ] array types, literals, indexers
  - what do I think about "index out of range"? Should I allow "panics"?
  - or should I be perfectly safe 🤔
  - I guess it could be a "pseudo-effect" as well, like "ffi".
  - or it could be the same as "ffi"? naw, might as well distinguish.
  - so yeah, have a builtin `panic` effect, and the unchecked versions of array and map access use it.
    - or should I use something other than effects? like it might be weird/confusing to have these "special" effects that don't trigger CPS, but aren't pure. ah lets have them be combined, at least for now. like my goodness.
- [ ] type classes (inferred-ish? dunno how to dance that)
- [ ] affine types prolly, once type classes are a thing
- [ ] type inference!
- [ ] effects inference!
