
Immediate:
- [ ] fitsExpectations => make it exact, using nice errors. remove all unification whatnot for now.
- [ ] FFI type (something on record, parsed as a decorator)
- [ ] graphic repl (see shem)
- [ ] intermediate output, target go or python
- [ ] structured editor with type holes and such

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
- [ ] source maps!
  - [x] basics
  - [ ] actually map all the things, so we can step through reasonably
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
- [ ] records
  - [x] basic
  - [x] spread to update
  - [x] ~inheritance (subtyping)
  - [x] generic
  - [ ] FFIable types. (with nice attribute names and such)
- [ ] nail down type checking, remove any subtyping.
- [x] give me Array<T> or give me sadness
- [x] NamedTuples (records without attribute names) so I have `Some()`
  - ok copout on this one, I'm allowing you to do `Some{_: 10}`, to omit the attribute name. I don't love it, but I don't want to sink too much time into it.
- [x] enums
  - [x] basic
  - [x] generic
  - [x] also subtyping? like polymorphic variants?
- [ ] match
  - [x] very basic
  - [x] record patterns
  - [x] exhaustiveness analysis
    - so the plan here is to keep track of 'paths' that are partial. a later path can come through and make it total. when going in, need to list out the other options that need to be filled. or if it's like numbers, then good luck folks. or strings.
    - ok but this case analysis needs to be done *after* type checking. yeah. not as part of it. so that I can reuse it in the structured editors.
    - [x] basic impl of the Maranget paper
    - [x] hook it up folks!
  - [x] sub-enums
  - [ ] arrays! slice! dice! thrice!
  - [ ] guards I do believe (restrict to pure tho)
- [x] some builtin macros!
  - [x] @typeError("message")
    - to indicate that this expression should trigger a type error. so I can verify that I'm excluding invalid stuff.
  - [ ] @assert? or should I keep just doing my magic?
- [ ] put this on a web sit! animations or some such.
  - [x] basic thing
  - [ ] make source mapping really solid! Probably update that source map visualizer to track issues.
  - [ ] then we can do cursor-preserving auto-format. *but* we would also want type inference at that point. And when rendering, indicate which things are inferred. And have a way to show a type error or something.
  - yeah, so first pass would be like a textarea per term, orr maybe a contenteditable? need look up the latest dealios.
  - and then try doing a full-on structured editor. would start small & build up, with an eye to making it possible to generate the structured editor "visual syntax" from a grammar definition.
  - modal for life. might make people sad though, should have a non-modal option.

- [ ] basic attempt at compiling to go or swift or something?
  - Yeah I really should get on this before too long, so I can see what hurdles I run into.
- [ ] loop/recur please. and maybe a foreach? idk. or a map? naw.
- [ ] generic effects (Store<T>)
- [ ] tuples
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
