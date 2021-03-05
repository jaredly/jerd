

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
  - [ ] generic
  - [ ] FFIable types.
- [ ] give me Array<T> or give me sadness
- [ ] basic attempt at compiling to go or swift or something?
  - Yeah I really should get on this before too long, so I can see what hurdles I run into.
- [ ] generic effects (Store<T>)
- [ ] enums
  - [ ] basic
  - [ ] generic
  - [ ] also subtyping? like polymorphic variants?
- [ ] tuples
- [ ] port the unison runtime effects tests, verify that all is well.
- [ ] match
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
