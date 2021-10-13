
## EDITOR DUMP

OK so this is all well and fun,
but I seriously need a way to DUMP the editor state into text,
so I can re-parse it with some things being very different.

Like:
- record literals no longer have things organized super weird.
- and such, idk.


Have a function that is: Library -> TXT and TXT -> Library
- [ ] GlobalEnv -> Library
  - [x] preserve metadata!
- [ ] Library -> GlobalEnv
- do a test that I can go forward and back
- [ ] maybe that's it?
- [ ] text -> Library function
- [ ] and a Library -> text function
- [ ] add annotations for metadatas
- [ ] verify that round-tripping GlobalEnv -> Txt -> GlobalEnv produces the same hash.



## TYPE SYSTEM REWRITE

OPS TESTS
- [x] a bunch
- [x] local variable impl
- [x] various failure modes probably
- [x] hashes that work
- [x] hashes that dont so we fall back
- [x] the left is correct but the right is not
- [x] subtyping maybe? hmmmm
- [x] hash, where the value is generic n stuff

- [x] my "passthrough" dealop (_drop suffix) produces types that are extremely annoying.
  like {x} | TheFallthrough. So I can't reference the object type itself.
  I need to create an alias for the object type. Not 100% sure how to plumb it all.
- [x] autogen parser types
  - [x] make fallthrough a thing, IFF you have
    one array, and one non-array; if the array is empty,
    fall through to the other thing.
- [x] autogen transformers of the typed ast types
- [ ] Write the whole type checker
  - [x] organize binops
  - [ ] decide how to make a maximally recovering binop typer
    - basically, even if they specified a hash, if it errors and something else doesn't, pick the something else I think...
- [ ] profit

## WEB UI MAKE IT USABLE

- [ ] clicking the hash should NOT just remove it, but pull up a UI autocompleter so you can repalce it.



## GLSL

Think about doing lambdas as "id that goes into a mega function", the mega function being.


# Let's make some things much nicer, ok?

- [x] autogenerate actually correct typescript types for our parsed whatsit.
- um, profit? yeah I actually can't remember where I was going with this one. I mean doing this makes it easier to think about a recovering parser, I think, but that's not what I'm doing just yet.
- let's start from scratch with the type checker, so as to be maximally recovery-oriented? I think.

- [x] autogenerate the `transform` impl from the typescript types for the AST.
  As config, provide the tyeps that you want to transform (Term, Type, Let, ToplevelT, Location, Pattern)
- [x] have the parser-generator add indices already folks. it should be super easy
- [ ] let's keep track of comments
- [ ] start rewriting the parser->typed tree stuff? probably using a visitor pattern, or something ... hmm .... knowing what I now know, I could probably do a better job of setting up the `env` and stuff. Also, `global` env is read-only, and `local` env is as well, but you add to it when passing it down. Right?


# Editor basic decency

- when parsing a file with IDs, such as a gist, we should notice the hashes that types and terms claim to have, and if the actual hash is different, make note, and use it as a substitute going forward.
- on the other hand, when parsing in the editor, ignore the hash that a define claims to have. Also, when in the editor, but not in batch mode, we should try to auto-resolve errors where possible. So if an ID is specified, but there's a type error, and a different term with the same method fits, then swap it out, and keep track of swaps we make so we can inform the user.

I probably want to do an env dump, and then make a script to "clean up" then env, rectifying hashes, flushing deprecations (making the most recent thing as the thing that deprecates the others), etc.o

- GOT TO autocomplete, my goodness. Absolute must.
- and then, go through and do a thorough reconning, figuring out how I can gracefully fail during type checking wherever possible.

- ALSOOO if a term has TypeErrors in it, dont add it to the env!!!!

Hmmmm I'm definitely wanting:
- the ability to have a cell that is "this term with this set of slider values"
- also I want markdown cells


Ok but also I want to be able to export the slider config (as a json blob to clipboard), and import it (copy from clipboard or something), and also when exporting to 

oh noessssss we lost all the data again
ok I gotta have this backing up somewhere.
ayyyy having exported to a gist means I have the code saved!! Love it.

NEXT UP: please let me import a .jd file.

# GO version fo euler-big

- [ ] get it compiling
  - [x] figure out the maxUnique issue
  - [ ] make a `containsInvalidGo`, re-using stuff from glsl where possible
    - [ ] no generics allowed, for example
    - [ ] maybe that's it for now?
  - [ ] figure out why this function isn't being optimized.



```bash
env NODE_OPTIONS=--stack-trace-limit=100 node --enable-source-maps bootstrap.js go  --run examples/euler-spiral.jd
```
- [x] deduplicate that one thing
- [x] add location indicates! Pleeease folks
- [ ] turn the slider dealios into GLOBALS?
  - we need a way to not necessarily override, right?
    now I guess current sliders will only slider literals.
    so for the moment, I can 
    - [ ] replace the slider term with a global reference,
    - [ ] make a toplevel `var _slider_hash_idx = 10`
    - [ ] have the cli args set the toplevel var if it's provided.
- [ ] also the SVG writer dealio should accept a cli arg as the filename, if provided.
  - might be a little hacky...

# GO SLIDERS
basically, if there are sliders, accept them as CLI arguments.

## Comparing implementations, what to do (go vs node vs rust):
### Prep for rust

I would like to start producing rust, so as to be able to compare go, rust, and nodejs.
In order to stem the tide of copy/pasting, I think I should make another visitor pattern style thing, so that `blockToX` could be re-used between all the languages that have c-style blocks. And `returnToX` would be common as well.

## Need to be able to delete a term from the UI.
Or really, to say "this one is deprecated" would probably be sufficient.
When parsing, I think a `@deprecates(xyz)` could be cool.
Yeah I think that would do the trick?

Anyway, I need to
- [x] when a term is deprecated, *show it* using css. Like printTsLike should do something about it.

OK, so how does deprecation work?
- when clicking the button to "overwrite" the current cell with the new contents, the default behavior should be to "deprecate the old one", if the /name hasn't changed/. Yeah I mean maybe I don't need to do anything special, only have deprecating if you're in the same cell.

- [x] I don't want the `@unique` rendered in the web for types...
- [x] proposed needs to have a `name` attribute. hmm. ok it already has this.
- [x] I need a way to just rename a term. Maybe if you just edit the name, and the hash stays the same?

- [x] I really want to be able to hover an id-having thing, and have it popup the definition for me.
  - [x] show which record attribute we're on
- [ ] clicking the id when in text mode shouldn't just /remove/ the id, it should bring up an autocomplete box so you can pick a different one, or optionally remove it.


START HERE:

Ok, let's start working on: the go built dealio should use sliders for cli args.

- [ ] ok but also I really want sliders to be able to depend on constants (and other sliders)
  This would just require ... I mean, I probably want to just hack it, instead of allowing arbitrary resolution of stuff. Like, you can directly access a variable that's a slider, but we won't track renames and whatnots. So that we don't have to re-crawl the term after modifying it, right?



- [ ] why is this one thing showing up as deprecated?


- [ ] ohhk, so there's "terms can have tests", but in /this/ case, what I want is to say
    "how would this proposed change impact the other things on this workspace"?


- [ ] typing `#` should bring up autocomplete, everyyytime
  - 


Also, ambiguity shouldn't sink the ship.

## Raw SVGs in the UI
- remove the old version of drawabletoSvg -- need a way to remove terms. Check whether it's used by any active cell...
- [ ] hmmm

## String Interpolation 🎉🎉

What if: all strings could contain '\n' and ${} interpolation? I don't think I want to give up \` as a character though. Seems to handy. Also, maybe ' isn't needed as well? I mean it's annoying to need to escape all ". Maybe I'll do like rust, and have `r#"..."#`? idk.
Anyway, interpolation: Can I get the best of both worlds of: the value is inline so it's clear what's going in, and you can control the formatting with like %0.2f?
I mean and format strings can be nice too though. hmm.
Ok, but anyway... for now, I can add ${} and multilineness to strings, and we'll go from there.
Rules:
Multiline strings have the opening whitespace trimmed up to the level of the opening `"`.
So
```ts
const x = "hello
            folks"
is "hello\n folks"
while
const x = "hello
    folks
      stuff"
is "hello\nfolks\nstuff"
```
Does that sound reasonable? idk. Autoformatting will fix it.

Ok, and then the rules for interpolation:
`"Hello ${name}, are you ${age}?"`, the $ will be underlined/loc'd to a specific `As`; because this expands to
`"Hello " + name as string + ", are you " + age as string + "?"`
Ok, but what about `%0.2f`? I mean we could just have a stdlib `fixed` function.
Are there other formatting magicals that I'd want to use on the regular?
ohh a `debug(anyType)` that just exists. I'll want to codegen that... hmm how do I make that work with generics? ... oh this is the famous typeclasses again.
but yeah, so maybe it's `.debug(mything)` which will attempt to intuit a globally available implementation to a type that has a `.debug` function, where the argument type matches what you're passing in. And so if I'm just autogenning `.debug` impls 

- [ ] parse interpolated strings. It's a list of pairs Array<(String, Expr, AsImpl)> with FinalString
- [ ] print them back out, with the hash for the AsImpl going on the $ I think? Unless I want it to be on the inside of the ${}. like `${#abcde hello}`. I don't love that as much. Yeah let's just go with `$#abcd{hello}`.
- [ ] make it work in my printer dealios!

## Compare node to go

First off though, doing euler-spiral.jd to javascript, and benchmarking it against go, would be cool.
And then writing a `spreadLoopToAppend` optimizer, that would run in js + rust, but not go or glsl. And see how much better the nodejs got.

- [x] get spreadLoopToAppend goig
- [ ] arrayAppend should be called arrayPush and should be a Stmt, not an Expr


## Sliders in Go CLIs

When generating the go, it would be very cool if sliders (decorator widgets) turned into cli arguments. Of course, they would only accept literals, which I hope won't always be a limitation for my web ui, but currently is there as well.


# Generating some go here, it's pretty fun.

We have euler-spiral-calc working just fine, which is super cool.
We just need a way to hand it off to a thing that draws stuff, right?

ok so I have hacked my way around a golang drawing dealio ..
.. I'm not convinced it's a ton faster, though 🤔.
I mean I'm still doing the "generate a very large array, then draw it". I really need to figure out how to combine those two.
hmmmmmmmmmmmmmmmmmmmmmmmmmm what if I passed around a `ctx` variable as the first argument of all functions, and host-side thunk mappers could have access to it?
That way it could be deep in the stack somewhere, and just call a thing. hmmm. that might be very nice.
and it would only be done for functions that can have effects, right? I think so.

- [x] do some basic inlining
  - ok that didn't help appreciably
- [ ] ok, so what /would/ it look like to get effects going?
- [ ] I could also try out rust, because that sounds fun too.
  - although rust would want me to convert array spreads to pushes first, which is another step.


Ok, so the basic effects example that I want to work:

```
const drawSomething = (p: Vec2) ={Draw}> {
  raise!(Draw.circle(p, 5.0, ));
  raise!(Draw.)
}
```

// Ok but I really should check to see if this would be much faster.
// lol ok it, uh, wouldn't. Which is very interesting.

Ok yeah, so let's go with the "svg" route.
Ok, let's actually formalize the "go drawable" dealio here. How can we get go "backends" (to use the Roc term) to work?


- [-] get export actually working
  - [x] fix type dependency tracking
  - [x] export decorators if needed
  - [x] we need reproducable parsing for decorators! handle `@unique` on decorator definitions, and print them out as well.
- [ ] get go generation to complete
- [ ] make a go type generator! This will be about the point where I want much smarter enum packing, I imagine.
  - I'll generate go types into a go-backends package, which can then use those types.
- [ ] fix the go printer in whatever ways needed


Hrmrmmmmmmmm so
How do I make sure I'm not defining my types multiple places?
That is to say:
- I'm exporting the types in canvas.jd to go-backends/drawable
- Then when I generate the go code for the /term/ in the web ui, I need to /not/ export go types for the types in canvas.jd, and instead use go's module referencing & importing bonanza.
- a, much hackier option, would be to make a types.go file, and /copy/ the backend impl into our new thing, and just copy things with abandon. But that would be much simpler, maybe I'll do that for the moment.

Ok, so the basics are:
- generate a types.go file into all my go-backends, why not
- then I can develop the backend.go file
- when building with a backend, I just copy the backend.go file over. I might have to parse the backend.go file to determine which types actually get used... hmmm ....


ohhhhhh how do I do type variables 🤔.
do I make some pseudo-go code or something?
(ok I don't actually have to deal with this just yet, but it does concern me. Or wait maybe I'll just use `interface{}`).



## Ok, so thinking about '@display's that are written in /jerd/:

because I still think it's useful to have the term return a `Drawable`, instead of inline converting it to an svg string;
BUT what if we had a way to define `@display`s inline, that then delegated to lower-level displays.

like the 'drawableToSvg` would pass a string on to an svg native-defined drawable.


```ts

@svg // this means that it delegates to the svg displayPlugin.
// now, what if the svg displayPlugin takes arguments ... how do I supply them?
@displayPlugin
const drawableToSvg = (drawable: Drawable, size: Vec2 = getBounds(drawable)): string => {
  // yeah go for it
}
```

but like,
so I feel like a cool ~endpoint would be to make the UI powerful enough that any term that evaluates to `Displayable` will work.
And then there are some native-builtin functions that can return the opaque Displayable type.

So you'd have `displayOpenGl: <T>(GLSLScene<T>) => Displayable`.
And then a cell would, in order to tell you what can be displayed, just find functions from (returnType) to (Displayable).
And then composition becomes super easy.
BUT

currently my GLSLScene renderer requires that you provide the struct as a toplevel literal. What's the right way to relax that requirement?

I mean I could just do tree-walking evaluation until I got to the literal I'm looking for, and then hand things off ......
So that would mean writing a virtual machine for my language. Which probably isn't the worst, idk.
Oh would I operate at the level of Terms, or Exprs? Honestly I think the Terms level would be nicer?

Ok so yeah I think that's kindof a reasonable approach? idk.

Ok, anyway, we won't be doing `@displayPlugin`, right?
I mean I could do it as a stop-gap.
like
`@displayPlugin("image:svg") const myFn = (a: A): string => {...}`
it would certainly be a simpler change.
it doesn't allow for multiple levels of composition, but that's fine. And we'd only allow one-argument functions, which is also fine.







And then the go generator can be like "import this go-backends package, and `func main() { backend.run(myToplevelDealio )}`




Ok now that I've got the IR ... hmm ... I should try adding effects back in from the ground up. So that the IR will be well-formed.


We need a new plan for time limits. If I'm doing something computationally intensive, 
ooooh am I going to bring my go compilation target back online so I can run eulers-spirals as a server? hmmmmmmmm. Then I could get really high fidelity dealios. yeah that would be super fun.
I mean I think I could?
Also, I wonder if I could beef up performance by turning on some optimizations.


- [ ] do a little bit of perf analysis on my euler-spiral, see how it's doing.


hermmmm ok interesting, in the online editor, it's not going to be able to do the same aggressive inlining and optimizations...
- [x] ... although the "turn this into a loop" should be doable as-is....

- [ ] ohhh it was the execution limit. hmm I wonder if the limit would be better handled as a transform()? Instead of an IR "outputoption"? That would probably be cleaner, and you could apply it after all the magic has happened 🤔
- [ ] 

It would be verrry cool to be able to get "array.push" working for languages that have that.
So it would be something like "newArray = oldArray.slice" and then every "equals to spread" would be a push. It's very similar to what I'm doing with inferred fixed size arrays ...... I wonder if there's a way to unify these things? Like, have it be in a single format, and then print differently depending on whether the array length is known?


Ok, so thinking about this drawing thing
it would be reeeeally cool, if I could use an effect setup, so I'm drawing the lines in real time, instead of constructing this supermassive array and then looping over it.
And so I'd have this effect, which the harness would then handle
but, it would be reeeally cool if I could inline the effect handler (given that it's synchronous).

Ok anyway, how do I get some nice quality renders of this stuff?
I mean I'm sure all the array spreads aren't helping.


## Better sliders, can rely on other sliders

- [ ] allow sliders to rely on other constants, and math expressions thanks.
  - I mean I guess I don't actually have to do this right now, but it sure would be nice.
- [ ] auto-infer slider title if we're being assigned to a value?

At some point I should think about a hazel-esque thing where you can type arbitrary jerd expressions into the slider box, and it knows what variables are in scope for that expression, etc.

## Default function arguments!! Yes please and thanks.

Recreate this! https://twitter.com/matthen2/status/1249611168265547776

Ok, we're well on our way.
Let's get some test cases going though.
Do they live in metaData? I think so.

- [x] yayy so much goodness. I mean the editing experience leaves a lot to be desired
- [x] export a pinnable thing, the full dependent env, right?
  yassssss so good
- [ ] umm now I really want to be able to persist the slider valuessssss
  - hm that would require a little bit more jiggering; or ... hm ... yeah because sliders don't know how to "save" and "restore" their state just yet. but that'd be very cool. Yeah I can just do the same preemptive term-rewriting, right? I mean it might be annoying, we'll see
- [ ] hrmmmm I reeeeally want default values for functions. buuut question is, how do they work?
      what happens is: they don't impact the type at all. So if you have a function of type T, you know nothing about default args, and have no way of accessing them. Only if what you call is ... a literal ... that you have ready access to ... hmm .... that's maybe a little wonky if for example you pop it into a tuple, and when you get it out you can't use the default arguments. Also to have /type/checking need to resolve the variable, potentially multiple times .... but I think that's fine.
      Ok, and then same story, once we hit the IR, function arguments are injected the same way you might expect. hmm this /also/ means that, by construction, you can totally access local scope within the default arguments, because they won't be able to be applied in a case where they aren't accessible. Right? Like you have to be accessing the function in the same scope. That's super rad.
      So: the lambda expr needs a `defaults` list.


BIG Usability issues:
- [ ] it looks like { const x = 10 } has type int, which is bad.
- [ ] oh I apparently can't rename terms in a cell. Figure out what to do there.
- [ ] dontttt propage terms that have errors in them!
- [ ] when I refuse to execute something because it has TypeErrors, show a useful thing!
- [x] when you select a node fully and type to replace it, it should remove the surrounding span & any formatting.
- [ ] selecting some things and typing should remove the selection, always folks.
- [ ] my execution time limit doesn't seem to be working, figure that out
  - oof, ok it's the drawing time that's taking too long, not sure how to sort that out.
  - I mean I could do some time slicing, or like keep track of "how long it takes to render N segments", and if it looks like we'd be over budget let them know we're going off auto.
- [ ] there are a lot of ways that my new thing might error, and I really need to catch them
- [ ] I might want a `SimpleScene` type that doesn't have state, but does have bounds ...



BUGS
- [x] show errors below please! Need to know why it's not working.
- [x] uhhh why is glsl not using native types anymore??? I should have been keeping track of this... oh it was prelude-types needing to be regenerated.
- [ ] ok why can't I add vec2s
  - yeah this isn't great. looks like `persistence` isn't loading binops correctly somehow?
  - I should really split things up, make a `mergeEnvs` functio nthat lives in language, and knows how to do things.

- [x] if there's a pending, the plugin doesn't show. Maybe I'm not evaluating it?
- [ ] if the thing doesn't evaluate for a second, the plugin view goes away. I should retain the last valid thing.
- [x] let's get fps going!
- [ ] fix pinning. make it work with proposed and sliders and such.

- [ ] ok so somewhere we're not handling unique++ right.
  because the unique isn't ... ... .. at what point

- [x] ugh ok fix the currently failing tests.
- [x] enums needs to be able to declare inline records, pleeease

- [ ] Records with Defaults! Let's goooo
  - [x] example syntax & tests
  - [x] get it to parse
  - [x] process the defn
  - [x] get reprint working
  - [x] process the record constructors
    - [x] ensure that the values aren't effectful
  - [x] oh wait I wanted to do the translation at th IR level,
        not when type checking.
  - [x] get the extended version to type check & pass

- I want records to be able to supply /defaults/ for any of the attributes. These defaults ... get inlined at the /ir/ translation level? yeah that sounds fine. so ... in the editing UI they wouldn't be auto-applied, which I like, so that you can add the attribute later if you want. Yeah. 
  - ok what does the data type look like? this is part of the RecordDef, right? And it'll be an optional attribute
  - do I want you to be able to supply default values for subTypes? Probably, right? Seems like it could be handy.

- should I do the same thing for function arguments? kinda like why not, right? again, they could be eliminated by the time you get to IR ... same with rest args tbh. yeah that's kinda fun.






- [x] improve perf, make it super cheap to switch between
- [ ] why is it selecting the last one? I don't like it
- [x] add nice keyboard shortcuts to normal mode
- [ ] get boids working hackily; like with a hardcoded length of 10



- [ ] let's have decorators be an @ symbol with contenteditable=false, so they're deleted as a unit ... and then when you click on one, it ... could expand to be the full text? or just havethe same popoup dialog that you would get in normal mode. yeah I think that's fine? idk.
What kinds of things are we likely to want to decorate?
- orrr do I just collapse them, and you can expand them by clicking and it becomes editable? actually that sounds hard to do right.


boiiiiids
So basically I want to do aggressive opt on the whole GLSLScene,
and then take the function for render and generate glsl, and the function for step and generate javascript. That sonds doable? I think?


## [x] Perf improvements
I'm rewriting Cell, and refactoring a bunch of stuff.

It seems like non-term things should maybe have the "Proposed" stage as well.
Ok, so I made the type-level changes. but there's other things to be doing after that.

ohh also I really need to preserve comments at some point.

- [x] We need a better initial focus point.
- [ ] if we receive the active, and we're in normal mode, get outttt. although maybe it's fine? like we just don't get in there? idk
- [ ] umm what next. oh yeah 
- [ ] now we show the rendered stuff again?

OK so now for perf:
- [ ] when switching between text & not, the term should be the same... I could do useMemo based on the hash? Might be a bit more work, ... hmmm but maybe that's fine? idk


Ok I think arrays are doing ~ok. But I need the editor to be a lot more usable so that I can make more fun things.
So
- PERF
- a i c A I
  - a = cursor at end of selection
  - i = cursor at start of selection
  - A = make a new ~thing after this one...
    - might be a new arg in the current fn
    - uhh maybe that's it? and maybe that's fine? idk
  - O o = new stmt in the closest block
  - ( and [ could be used to enclose the current thing
  - '+ - * /' could all be "make a binop with the selection as the first arg". Although it would be great to also have a way to 


## Arrayssssss

- [ ] lambda types should have arraySizeVbls, let's be honest. Then I'll be able to do monomorphizing when I see a function call that ... has the array argument corresponding to that size ... although propagating array size things might become more complicated. hmm so maybe not?





- [x] get tuple types together, for reals its very nice to have
  - this will mean monomorphizing all tuple types, which is fine.

- [x] working on turning reduce into something that's valid
  - [x] make variables
  - [x] propagate them please
- [x] get reduce working too thankss
  - [x] ok infer the bound as well! Would be super nice
  - [ ] write bunch more tests for different incarnations
  - [ ] figure out why inferring arrays goes so poorly if I do it too early (probably that I'm propagating things I shouldn't).
    - really, when I set the type of an arg to have a variable size, I need to ensure that
      the return type has a consistent size ... or else it's bad news. I think.
  - [ ] get boids going please!!! So will need to infer the length of the js array we're passing in I believe.

- [ ] maybe do loop unwrapping? Shouldn't be too bad if the value of the loop vbl is known 🤔

# THings found during coverage for parser

- ... should be a legal pattern spread, shorthand for ..._

# Widgets the great and terrible

so, using decorators, love it
one thing I want, is to ... add optional titles to things
oh hey, I could add another decorator
yeah, I was thinking "should I add an optional argument or something,
but I don't yet have support for optional arguments.
But I could just add another decorator, love it!

Going so well!!!!

- [ ] the decorator widget state should be persisted in the cell, probably. Actually, let's have it persist when pressing a button? Yeah that's fine. Like "set the defaults". And it woudl save it to "display", so it would be carried through to the "pin". So I'll need to make pins respect that.
- [ ] make the showcase be able to show any arbitrary pin. This will mean /export as much of the env is needed to render it/, and then have the showcase render the sliders too, so fun.
- [ ] sliders should allow you to input an arbitrary number too
- [ ] make the alternates dealio!!
- [ ] ok and then really integrate these decorators into normal mode. Render them with a little icon that opens a popup. And have a command to add a decorator to whatever thing, that autocompletes with things that fit. yessss

# It would be very showy to be able to generate a swift app for my opengl shader bonanzas.

#### Ok but really, to do anything interesting, I really need a Known-Length Array type

It's fine for it to be different from array, we can figure out magic later if we want.

ArrayN<int, 4>

Ok, and things like switches ... should also work, right?

And <A, N>[a, b] does ArrayN, not Array

Ok what's the most basic?
fixedArray.0 should work fine
oh ok so how should I do updates?
I mean, syntactically. Do I just use maps for everything? Sure why not.

Ok, so instantiate an array, map over it (meaning switches need to work), and that's it, right?


## Um so counterpoint
can't I just infer all of that?
can't I automagically track ... whether a function is called with a certain length array?
Like I would need to add annotations places
and stuff
to be like "this value ... hm type ... um has an indeterminate length or something"

Places to track it...

hrmmmmm ok so the reason I want this is for the bridge between js and jerd
so I'd need to do the inference in js, and be able to know the way things work

Ok so let's look at a single small example, see if I can manage to infer it.
What I want is: to do a boids simulation.
and do magical shader things to it.

Ok so I think I'll do all of this at the IR layer. I can have a separate type in the IR for array w/ inferred length, without changing the public types.



#

Erghhm should I switch to lezer for parser generating? Given that it supports error recovery.... NOPEaNOPE it would be much harder to work with.

## OKK new plan for widgets
It's attributes, folks.
But before I go messing around with the parser, I want to have a robust suite of tests for it. yes.

Anyway, all terms will be allowed to have attributes.
Attributes are *not* allowed to change the /semantics/ of the code in any way. (e.g. ffi changes the actual code generated, but nothing internal to jerd would be able to observe the difference).

And then the GLSL generator plugin dealio, when collecting the dependency tree of terms, would let you mess with some sliders.
And so the slider values would be saved as part of the "display" I believe. And those should be propagated to the PIN.
errr and maybe there should be an undo menu for them? uh maybe at some point.
Ok, so the plugin finds any widgets, renders them, and when you fiddle with them, it results in the whole shebang being recompiled, right?
I could get fancy at some point and allow shortcutting, if the widgets evaluate to literals (so like the slider one, not the "switch between any of these code snippets" one)
Yeah and the code snippets one would ... allow you to store alternatives, and switch the main selected one.
Like it would be 
`@alternatives([some_code, other_code]) main_code`
lovely.

Ok, but I don't yet syntatically support those things,
and it would also change hashing I think....... hmm....... ugh there's so many hacks in the hashing right now. It's fine.



## How to make configurable sliders for my GLSL canvas dealio?

So, you want to have some things be sliders
and you want to indicate, in code, what the parameters should be
could also be nice to have categorical options
Anyway, the GLSLEnv state variable looks like
State {
  itemRotate: float,
  speed: float,
  count: int,
}
and your initial state dealio is
State{itemRotate: PI, speed: 1.0, count: 10}

So where do you specify bounds and stuff?
hm so when macros are involved, and individual "cell" might produce multiple toplevels. That should be fine, right?

Ok, so I'm thinking:

@GLSLBonanza
type State = {
  @initial(0.0)@angle
  itemRotate: float,
  @initial(1.0)@slider(0.1, 2.0)
  speed: float,
  @initial(5)@bounds(1, 20)
  count: int,
}

// This would produce
State { itemRotate: float, speed: float, count: int }
initialState = State {itemRotate: 0.0, speed: 1.0, count: 5 }
widgets = [
  Widget{name: "itemRotate", config: Angle{update: (state, itemRotate) => State{...state, itemRotate}}},
  Widgte{name: "speed", config: Float{min: 0.1, max: 2.0, update: (state, speed) => State{...state, speed}}},
  Widget{name: "count", config: Int{min: 1, max: 20, update: (state, count) => State{...state, count}}}
]

Where
type Widget<State> = {name: string, config: WidgetConfig<State>}
type Angle<State> = {update: (state: State, angle: float) => State}
// TODO: Should I have default values baked into here?
// but then do I get weird behavior for subtyping? BUT I don't
// have unexplicit subtyping. So it seems like it ought to be ok?
type Float<State> = {min: float, max: float, step: float, update: (state: State, value: float) => State}
enum WidgetConfig<State> {
  Angle<State>,
  Float<State>,
  Int<State>,
}


OOooooh so what if
plugins were nestable.
hmmmmmmm
yeah idk, I'll probably just hardcode it for the moment.


Ok, so thinking about workflow again.

Aaaactually what I really want is:
to have inline widgets
that then become out-of-line
like, this isn't about uniforms (although it could be at some point idk)

So, I kinda think I want widgets represented in the AST.
Would that be of the term?





## Ok probably first thing
Make it so I can upgrade my term format, without things breaking terribly.
Because right now, I can't even reparse.

- [x] neeeeed a way to delete ids my goodness
  - ok so the editing experience isn't terrible. I'm not using the normal mode much though, because there aren't any keyboard affordances, and jumping into it has a HUGE lag. So yeah the first most important thing is make it instantaneous.

START HERE: IMPORTANT PERF FIX
- [ ] Cell should render the output, not the Editor/RenderItem
  - does this mean ... that cell owns the the temporary edit text? Yeah that sounds fine.

- [ ] Updating some other thing, such that the something rerenders, shouldn't cause recording to start again

- [ ] make the "enter" menu show up underneath the selection, not at the bottom of everything

Handling Pastes:
- one thing that happens is that syms don't line up right
- so maybe, when pasting, I drop all (external) sym IDs?
  And internal sym IDs should probably be translated to prevent conflicts.

Better text mode
- [x] don't have the hashes, that's not great. use data-id on the node
- [x] also lets get at least one test happening.
- [ ] when selection is inside a thing with an ID, show a hover,
    that will allow you to change the ID, or remove it if you want.
- [x] ok and I want to preserve selections between the two views
- [x] typing non-identifier characters should get you out of the identifier.

- [x] shift-h & l for sibling navigation
  - [x] um weird bugs I think
  - [ ] let them go to cousins... if there's nothing to go to?
- [x] cell-level jk for moving focus between cells

- [ ] let's do a bunch of jest test for partial typing. like inline type errors.

NEXT UP
- [x] inline
- [x] when extracting a term, it would be cool to be able to /mark/ some sub-expressions as "have this passed in as an argument".
  - which means I need some state for "marks"
  - [x] support marks
  - [x] have the "extract" respect marks
  - [ ] clear marks after extraction?
- [ ] preserve locs please?
  - I mean I kindof get away with not. but it would be good to do.
- [x] delete & inline var, if the outer thing is lefts as a sequence w/ single thing, then collapse it please.
- [x] shift-enter to enter text edit mode


Can we only do one renderer? renderToReact and then use innerHTML to get it for contentEditable?
- [x] try it
  - oh we don't have `#something`, so it's not locked down
- [x] let's add `data-id={id}`, so that it can be locked down
- [ ] when the cursor is on something that has `data-id`, show a thing indicating that you can remove it.
- [ ] if you /paste/ with an #id, then we can detect that & insert cleverly? maybe?



- IDX PRESERVATION
  - when adding locs to a term
    - first find the max idx
    - then, go through, and /leave/ in place, any idxes that
      haven't been seen yet.
      if it has been, then use maxIdx++


- [ ] get all explicit hashes out of the codebase
  - [x] ensure that @ffi types don't have a random unique
  - [x] export the prelude as typescript, and depend on that.
  - [ ] I'll want to have an autofixer or something that ensures we update the generated delio as needed.

- [x] provide a name when extracting things
- [x] :inline variable:
- [ ] escape to move up to the term level, then enter to
  get into the syntax-level focus.
  - [ ] shift-enter should get into raw text manipulation
- [ ] give me autocomplete or give me sadness! It's ok to need to trigger it
  - maybe if parsing fails, try inserting a semicolon after the cursor? or something.
- [ ] rename the highlighted term (globally probably)
- [ ] extract all instances of this term in this function ya know
- [ ] _d_ to delete and inline a local
- [ ] _c_ to change a local (variable to variable or literal maybe? idk)
- [ ] _+_ to replace w/ a binop (and _-_ etc)


Levels of this working
- make the term export do text as well
- version the state dealio
- if, when loading up, the state is old, say "stop, go back, export with strings"; give option to blow away state
- import should see strings and reparse them

> have a button to "tostring & reparse all terms". So I can have it defensively programmed first, and then remove that.
> have a button to "export w/ strings" so I can import w/ strings, and like reparse
> make hashing much more explicitly type safe n stuff, so I can specify exactly where and what is getting included.

## Fancy Refactors!

- [ ] turn this local variable into a fn argument for this term

## Next steps

- [-] enums?
      how do we do it
      you make a union, right? 
  - [x] passing enums as uniforms
  - [x] IsRecord
  - [x] explicit upgrading to enum (needed for glsl, but not for js interestingly)
    - [x] this is needed in the IR
  - [x] explicit downgrading from enum (if, as in glsl, it's needed)
- [x] fix the bug with flatteninig immediate calls
- [x] get pipe working, ok I mean there's some errors
- [x] combine the Define & Term content types, and just make name optional
  - [ ] then we can render them both the same too, but have an editable field at the top for changing the name or something. Also dropdownable, to indicate that there are multiple names.
    and we can display the metadata like "this supercedes this other one", or "is superceded by this other one"
  - lol and then I can stop doing "unnamed" ones 🤦‍♂️
- [x] do the workspace history for real, and show it on a given cell, so you can see the cell's histort too
- [ ] TEST CASES! Associated with the Term/Etc ID
- [ ] um now um arrays?

- [ ] also I really want a normal/node-selection mode, so I can do some rad refactorings like "extract this value into a variable" n stuff. all kinds of refactory options.

#### Test Cases

- meta for an item can list test cases
- cells can opt in to showing test cases
  - if there's a pending, it will also update the test cases accordingly, and pendingfy them 🤔
  - they can also choose to only show a specific set of test cases
- there should be a well-known TestCase type that has a render plugin, and also a render plugin for
  an array of TestCases.
- do we specify test cases Display config? Or ... set that up some other way? hmmm ...

#### Alternatives / Variants????
I should wireframe this.

hmm so I want a widget that displays differently ... when rendering to react vs to editable text.
with react, it can have a dropdowny thing
but with editable, it should be spelled out as the full macro invocation.

Ok but I can start with just the basic.

#### NORMAL MODE

Random bugs:
- [x] var definitions aren't colored?
- [x] updating a block should update pending if possible
- [ ] underline superceded things

Navigation:
- should 'attributes' count as atomic? probably actually ... idk. let's try it.
- also, when hmmm
- [x] basic navigation, arrow keys
- [ ] would be nice to maintain a "target column" for multiple-ups/downs
- [x] shift-up for navigating to parent
- [x] right should go for an item that starts after the current end
- [x] up & down should respect atomic
- [ ] shift-down should go to child if possible
- [ ] blocks/sequences don't have locations, and maybe don't have maps? idk
- [x] attributes don't have locs?
- [x] hjkl pleeease
- [ ] after the extract refactor, the vbl name should be focused, so you can rename it.
      it should probably even be focused w/ the menu up for renaming

OK PLEASE
- add locs to types n stuff

Things that still need locs:
- [x] X.attribute (the attribute id bit)
- [ ] 🤔 hmmmm custom binops aren't working again
  - ohhhh it's because I'm not counting them as atomic. hmmm
  - but I'm selecting the "attribute" level so that parentage makes sense
  - hrmmmmm what if I go "only select rendered things"? hmmm maybe the sourceMap dealio will get it done?
  - yeah that might be the most ~robust way to go about it
- [ ] a record row `hello: 20.0,`
- [ ] fn arg type annotations
- [ ] fn arg syms
  - [ ] fn args should have a loc for the thing+ annotation...
- [x] define syms

Refactor actions!
- [x] extract to a variable
- [x] extract to a toplevel
  - [x] handle locally-used variables correctly
- [x] rename a variable
- [ ] inline a variable

Editor actions
- [ ] cut/copy/paste
- [ ] UNDO/REDOOOOOO
- [ ] move up/down a line, or into a function definition

Kinds of things that can be focusable
- [ ] terms
- [ ] type annotations
- [ ] sym declarations

Bugs:
- [x] I should have non-atoms in the line lists
- [x] shift-up on custom binops isn't working

REFACTORS:
- [ ] "pull this out to block-level variable
- [ ] rename (should be a key binding folks)
- [ ] move up a block (potentially as a function call if needed)
- [ ] move out to the toplevel as a new function



- [ ] hmmm got to be honest about how long an `id` is going to be folks. I guess with hideIds it's fine...

Ok so I think what we need is:
- node loc idx, which we already have
- and then a cache that I build that does backlinks, right? and a mapping of "idx to term"
  - termsByIdx: {[idx: number]: Term}
  - idxTree: {[idx: number]: {parent: idx, children: Array<idx>}
Right? And I just build that ... as I'm walking the attributedText bonanza? I mean that makes some sense as a way to do it .... although it's a little weird. like some incidental stuff.

Anyway, I would have a "selection", which would indicate what idx is selected. Or multiple.

Ok yeah let's just write a traversal dealio that makes the idx -> child terms mapping, so that I can know where to tweak things.

- [x] make clicks ... more explicit. So you can ctrl-click something to open it, or right click to maybe open a widget if its available...
  This will pave the way for clicking to focus.
    so that I can do tree navigation.
    BUT we also want a mapping of lineno -> idx
    so that we can use arrow keys to navigate between lines in a way that makes sense.
- [x] make a "selectedIdx" state dealio
- [ ] then make a shortcut for "show refactors" or something. Maybe it's the cmd+shift+p menu? could be.


#### Pending Terms

When editing a term, the result should be in "pending", and it shouldn't "commit" until I say so
- adding the new term to env
- updating global.names
- etc.
- basically what addExpr does or whatever it is.
- and have the term saved to "pending". So I guess I can just:
  > when looking up the term to display, if there is a pending use that
  > places I currently call addExpr, do "set pending"
  > and then if there's a pending, have a button to make it the new one.

- Maybe don't do pendings until I have test cases set up though? idk.


## Editor updating

- [x] show type error on hover
- [ ] when updating a cell, check other cells and update them too folks
  - [x] do it for terms
  - [ ] ok but cells really need to keep track of history, so I can undo it too
    - hmmmm but hmmm
    - does it work to just use the workspace history log?
      that way if I delete a cell, the history doesn't get lost, right? hmmmm
  - [ ] do it for types 🤔 might need a TypeError for types? Like "this used to take a type variable, and doesn't any longer?" Yeah I think so.... also like I need an "empty" or "hole", for both types and values. I guess with an "empty" I can skip the TypeError for Types, right?

  - ok so what if there was like a "candidate" term type? or maybe not a term type, because I don't want it to impact the hash, right? or maybe it's fine? hmmmmmmmmm
    ok so maybe it's a thing that would be tracked in metadata? hmm but how. Or just in the cell info or something? 🤔. well it's something to keep in mind.
- [ ] show deprecation with an underline

### Simplest case: a constant is updated, no type change
if there's a type change, it just turns into a type error, right?
### Slightly more complex: a record type is updated in a backwards compatible way...
well adding a record item only works if there aren't any instances where things are created
but if not, then we can turn it into a type error dealio

## Can I make snake?

- [ ] arrow keys, need to be able to handle in the /step/ fn, right? Are there other events I want to handle?
    hmmmmm
    I guess a reduce is what I'd be doing, right?
    - [x] make a new GLSLScene2 type
    - [ ] weep that my js dealio doesn't have the properties of my language, such that I have to duplicate a bunch of things maybe
    - [ ] or just move to the new version, and require that all current pins get manually updated. Which is fine I guess. Would be nice to have a way to indicate (in prelude.jd) "this deprecates the old version folks" so that I can do my deprecation annotations in the editor 🎉
- [ ] arrays please?
  - so I can do a snake game probably?

- [ ] when you click a thing from a term, it opens up as a /sub/ cell. And then if you edit that cell,
      then it updates all the other things in the main & sub cells.
      - so I also need TypeErrors
        - arguments
        - attributes


- [x] monomorphize types with type variables folks
- [x] get basic scenes working!
- [x] fix my hacky hardcode of vec2, so that non-vec2 states work

## Inference

- [x] definitely arg annotations
- [ ] need to indicate somewhere that these were inferred, so that re-parsing can be more flexible with those
- anything else? hm


##

- [ ] it would be nice to be able to support the pipe operator
- [ ] how far can I get with just optimizations, on doing those array things?
      or do I have to go ahead and implement ... 
  - [ ] ok I mean reduceRange works, which is maybe good enough.
      well it almost works -- need to fix the "generate a lambda"
      to specialize the return value of the function.


- [ ] really want to have "refactor this" (I guess the selection mode has to come first), where you
      say "change the type of this argument to this other type", and it can suggest a mapping of field names.


# Ugh ok data integrity, maybe we can have it

- [x] oh ok so I fixed the immediate "everything dies" issue
- We have pins,
  and we have ... cells ...
  hmmm
  maybe I want a new workspace concept? workspacev2?
  because we've got ... 
  ok so what if I tried to just whole hog architect stuff for
  saving to the indexeddb
  in a good way

  - [ ] 1: pull back hard on passing `env` everywhere. Maybe? Once I get to a Term, I should
        have loaded its dependencies, right?
        hm



- Ok so thoughts
  - I do really like the history idea
  - what if I auto-update everything I can all the time, but provide really easy undo?
    also, pins should have history you can page through. Oh yeah. And you can say "break this
    one out into its own pin"
  - [x] ok yeah I need the concept of an "archived pin". So it's in the showcase, but it doesn't
        auto-update anymore.
        yeah, and then you can like "open the whole showcase"
    - [ ] have a button to show all archived pins, like ...
          or maybe instead of "archive" it's "frozen"? And frozen pins are hidden by default? Yeah I like that.


Workspace:
  - pins (including how to display it, might be null actually?)
  - cells




Maybe set up a server dealio.
Could we sync directly with github? hmm that sounds more complicated than I really want.
- uh well isomorphic-git will do git in the browser, which is a little wild
- hmmmmm
- ok, so I definitely want to be storing things for much more efficient writing in indexeddb.
- and then we'd have the option of only loading up /some/ of it
- BUT this would mean that we wouldn't be passing around the full "env" object, right?


- oh a pipe operator might be nice. should we do "fast pipe"? which I think is what roc is doing too?
  or does it matter, given that I'm not doing inference? orr should I have a placeholder dealio for
  on-the-fly lambdas like clojure has?
  like `hello(.., a, b, c)` or something
  I feel like I have enough other fancy things going on
  I can just ... do a normal pipe operator, a |> b(c) == b(c)(a)
  because I'm not currying everything, it makes more sense.
  -> ?
  |> ?
  how tight should it bind?
  looks like |> would get me the binding level that I want.

# NEXT UP

- make a cmd+p menu, for pulling things up
  - tabbing with a type searches for things that use that type
  - tabbing with a term searches for usages of the term
  - so cool
  - also, wow um yeah I've done a lot of experimentation.
  - hmmmmmmmm
  - so I do want a way to mouseover things and have them render
  - also to be able to give names to things that don't currently have names
  - or to give names to groups of things?
- ok I do think I need some kind of namespace support. What should that look like?
  - orrr do I also want tags or something?
  - or pins, but more so? so you can archive a pin, or something
    and also have pins take screenshots?

- I think I want a "cleanup" button to remove all unnamed items that aren't pinned or something 🤔
  which means that I need a better way to name things, obvs. which is why I think of namespaces.
  Right, I feel like what I want is to be messing around with a thing, and to be able to say "oh this is a nice one, screenshot this" or something.
  and then have it be marked as "keep" or something like that. yeah. and then when cleaning up,
  we'd clean up any superceded non-keep items as well that aren't used by anything? and do that iteratively

- UI improvements! Implement the wireframe.
  - ok but maybe "pins" ... maybe the display configs for a hash should be stored somewhere separate
    so that you can say "this is no longer pinned" but the knowledge of that config doesn't go away.
    do I want display configs to have tags? are they separate entities? are they in fact just hashes?
    🤔 I mean that would definitely be one way to do it. Have them "associated" with the term in question
    and I could display (and cache) backlinks for terms in their metadata
    so like
    there would be a type for OpenGLConfig? or something? hmmmm

# General robustness stuff

- stop just using a single localstorage value for the whole env. use dexie or something to break it into one row per term.
  - idb looks like the best dealio
- and then we can have a single row for a workspace, I think? It shouldn't get tooo expensive.
- How much should I limit the history length? I'll try 100 items, see what happens.

# Immediate stuff

- [ ] ok the very next thing I want to do is make these
      glsl bonanzas exportable
      no need to embed an editor at the moment, although
      that could also be dope
      - ok so I could have a "load from gist" if I wanted
        which would be very cool
      - but just dropping on a page is also OK

  - [x] V0
    I can paste a thing into a place and have it work (yay github gists)
    Will still need esbuild to bundle up the surrounding stuffs
    means I should extract the glslviewer stuff? maybe? maybe not though, it's fine.
    Ok so what does the viewer need? hmmm
  - [x] allow the gist to specify the size & zoom level
    - [ ] ok but we really need the plugin dealios to persist size and zoom, tyvm
  - [ ] include the source and an editor and such! the gist would be rather larger...

IDEA: Snake + LIFE
- big gameoflife board going on in the background (maybe with specific initialization, idk)
- what you see is a zoomed in like 50x50 board or something
- you are a snake? Or maybe just a spaceship, idk
- you are nagivating toward a goal maybe? or maybe just going around trying to eat the apples
- snake + apples + longer, or spaceship ya know
- how to detect collision? oh hm I could do like a hm special color that I output if I detect collision? Like I'm drawing the spaceship or something, and it's a colliding pixel
- and then the js just looks for any pixels? Can I do that at speed?



- [x] fix the "non-uniques" error

- [x] better restart (reuse textures)
- [x] yay conway love it

- [x] when we enter an invalid state, don't clear out the plugins if we don't have to.
- [ ] start on invalid type nodes
  - [ ] add an "invalid type" node for arguments with the wrong type
  - [ ] add a "error" node for unresolved values
  - [ ] when rendering that, do an autocomplete!
        hrm oh wait, I guess I first need reprint? I mean not totally, I can try it out
- [ ] ok but so I also really want to support uniforms. so that once exported, things can be twiddled as well
  - 🤔 hmmmmmm ok but so what if I did have a "livelit" like macro ... that would turn the spot into a uniform
    when exported? 🤔 I mean so it wouldn't do the closure capture thing, but still

- [ ] make an "ease" function that takes an enum config
      then we can have a Scrubber just for that function, that
      flips through the different options. could be rad
      I wonder if it would make sense to auto-scrub any enums 🤔
      like "what if this were a X". I dunno.
- [ ] can we have multiple scrubbers at once?


# Can I do some of hazel's holes with algebraic effects?
- won't be able to do "here's a partially evaluated tree"
- but might be able to do // hm yeah it won't do the closures dealio
- yeah let's just do my own thing, it's fine. I mean you know, I could still do tracing capture

# Inspired by hazel

- aww yeah I want self-hosting widget definitions
- but hm I probably want reasonable code sharing & storage and stuff?
- hmm "collected closures" seems like my "traces"

- Rolph Recto (
    really cool work. i think a killer application of this would be algorithmic music)
  - Eric is thinking of () doing some synth generation stuff
- Eelco Visser
- Hazel levine
- Fabian Muehlboek


- Can the grade_cutoffs thing choose to filter out indeterminate values?
- Can you have a livelit in the livelit definition?
- Thoughts about the choice to make a structured editor
- What can you 
- 

Marno Dursky History of Scala at Oopsla



DataFrame livelit...
have excel-like, you can put a formula in a thing

.. the way they do "closure collection", where the final value






Polymorphism + type holes is notorious (we've had a gradual typing paper at every popl for the past few years)



##

- [ ] ok lets actually use the "type holes" bananas.


- [ ] get some serious validaton in here folks

## EXAMPLES to show off a little bit

- the 2d colorFlatDist, which demonstrates some sliders
- volumetrics
- normal raymarching dealios
- game of life please


## What about dependency injection?
So I have this idea
I'm doing this marchVolume stuff
and I find myself wanting to swap out
different `random()` implementations.
And I wonder:
what if the language had first-class support
for some kind of dependency injection?
Something like "hidden arguments"
or maybe it's just default arguments?
but if you don't provide them, the default
behavior is to just forward them to the definition
of the enclosing function
and then at the very top level, you can either
- supply it
- or, if it was optional, you can not

Ways to identify them:
They could be a separate "type", like effects.
a `requirement` or something?
but then if you had two functions in the tree
with the same requirement, you couldn't
provide them differently.
Do I want to be able to provide /different/
dependencies to the /same/ function that shows
up at different points in the tree?
certainly not automatically.
It would have to be explicitly handled
at the nearest common ancestor I would think.

So maybe these requirements are identified by
... BOTH a `requirement` type, AND the hash
of the function requesting it.
So that you can know, at a function callsite,
where these dependencies are headed.
Although what about when multiple functions
all really do want the same requirement?
I mean there again ... hmm ... ok so what would it
look like to specify these explicitly?

I'm thinking like
const x = (x: int, y: float, requirement z: int) => {
  ...
}
or something?
idk what the text repesentation would be
but the HTML version would hide away all implicit
requirements...
except at the point of definition, you'd definitely want them there.
and if they're accessed explicitly anywhere within
the function, even if they're not strictly /defined/
within this function
I guess? idk

it's possible I'm overthinking this?
but it's also possible that I'm not...


## What do we need in order to make this minimally usable by other people?

- [ ] "Workspace history"
  - this shows things like "created term #xyz from term #zyx"
  - "renamed abc to def"
  - "created term abc#xyz"
  - "opened term abc"
  ... yeah it does seem like a thing that would be nice...
- [ ] cmd+p to add something to your workspace pleeeease. Maybe include search by type?




- [x] SLIDERSSSS will be so fun
  - [x] add an "idx" to Location
  - [x] make locations mandatory on Terms and Types and stuff
    - How do deal with the null case? Make a nullLoc
  - [x] populate the idx
  - [x] add the Location to PPs and AttributedText(?)
- [x] baby's first slider! A simple input range delio
- [x] Now let's do a 2d slider for vec2!
  - hmmmmm ok detecting this will require more sophisticated
    analysis of the tree than I have been doing.
    Because we want to /find the term/ and then /find its parent/. Right?
    Well I guess we could just look for "apply"s, and see ...
    yeah I mean that would work for the moment. Let's do that.

- [ ] add a 'source' thing to location, for better error reporting


- sliders brainstorm
  - ok so this is a little interesting. Here is where I figure out how much I need to change things.
    because right now I'm going (Term -> PP -> AttributedText -> React)
    and what I want is to be able to ...
    um
    in React, have a way to respond to a click event, and pop up a dialog
    and knows about the term that it was.
    hmmmm
    and I guess I don't /really/ have to modify the AttributedText while I'm messing with things,
    and maybe I actually don't want to, so you can just `escape` out of the dialog, and it will
    go back to what it was.
    Ok
    and then, I kindof want the dialog to be able to ... modify the term in-place? or something? hmmm
    I guess we could be pretty far down in the tree. Would we identify the term by in-order DFS traversal
    index? And then we could do a `transformExpr` and just swap it out .... yeah I guess that would work.
    and then go ahead and recompute the shader. Which has been plenty fast so far. There's probably some
    more caching I could do by re-using the exprs object or something.
  - Ok so /actually/, I can get away with just annotating the PPs and therefore AttributedText with a
    sourcemap-like index, that can get me back to original value.
  - KINDS OF WIDGETS
    - widgets that just operate on a literal? Simplest, easiest. So it would be Term.type-based
    - widgets that can operate on any value of /type/. This might be a little more tricky to pull off?
      unless ... it's evaluable, and I just go ahead and evaluate it 🤔. Although we might get into symbolic
      evaluation here ... unless I go ahead and add a trace!(), and then I can just use the values that are
      passed in in practice, collect a trace (while the execution is paused), yeah that would be really
      very cool.
    - widgets that operate on a /function call/. Now, widgets should be allowed to say "I only do literals for arguments" or something .... but also we can do our tracing trick here, if the values aren't immediately available.
  - Ohh hHDSAHDM hmmmm ok so I /think/ I'm going to need a tighter connection between the editor and the
    opengl output? I mean I guess I already have something of a connection, nvm I think it'll be fine.
    - OH wait no I've been thinking that these things would be happening in a NON editor context ...
      but maybe I want to make it still an editor kind of dealio ... yeah maybe I want a new component
      just to manage all of this business.
      - eh, I can refactor that out later.

- [x] named arguments folks
  - hm maybe I need types to have named arguments? hmmmm yeah I mean I think that would be nice actually. But that would mean a change to the ... hashing ... whatsit? or wait the hash needs to not care about the name ... but it still means a little bit of a change.
  ... ok I can put that off, and say "only do names if it's a term reference, it's fine"



Ok, I'm playing around with 2d sdfs, and ... i really want arrays.
... and maybe this will require like a whole new type?
hmmmm
so I might want a meta-type that's like "ArrayLiteral", similar to "AmbiguousNumeral"
so that we can withhold judgement about whether it's going to be a FixedArray or a normal
Array.

Does that mean it's time to bring back type inference?


- [ ] ugh I need `Loc`s to include filenames, so that I handle prelude better.


- [ ] I think I want the "render" stuff to happen separate from ... hmm ... or maybe just the ... ffmpeg output, show up somewhere other than a cell.



### OpenGL Bonanza
- [x] make a play / stop / restart / record hover overlay dealio. With a cog that opens config for the recording.
  - oh maybe a time slider too? If we establish what the periodicity of the thing is.
- [ ] fix the bug I'm seeing when trying to multisample.

- [x] I'd really like tracing to be able to debug #454b9144.
- [ ] right-click on a variable declaration & "make this a function argument" would be very nice, and so easy.

### Default Parameters
- [ ] is this as ~simple as generating several functions with the same name, and having some take fewer arguments? hmm it would be good to have them "joined" somehow more than just sharing a name, so that if you decide to provide another argument, the editor knows exactly which function to pick.
  - could it be a macro or something?

### THe Editor more
- [0] enable pinning when you're mid-edit! That's key.
  - [ ] oh I need to add something to the env in that case it looks like.
- [x] maybe pins should be pasued by default? That seems reasonable.
- [ ] oof I really need a way to propagate changes 😅. like I just found a bug in a term, and want to fix it everywhere...
- [ ] give me sliders to fiddle with constants, you cowards!
  - Is this where custom render-widgets for different function calls comes into play? hmmm I think I might be able to do that already, it would be a little trippy though. Like I'm rendering to this contenteditable anyway, what's stopping me? I mean it's a little awkward to be rendering to literally HTML instead of react. hmmm. and also having to write the renderer twice.
- [ ] pressing enter should auto-indent for you.
- [ ] let's acually try to reprint-as-you-type. This will require threading through locations to the PPs, so we can do source-mapping to preserve cursor position. Also maybe we'll want a more forgiving parser? idk.

### Full Page Design

I think I need to rethink the design of the page.
Maybe have the "pinned" pane be the same size as the unpinned pane?
and ditch the current left column. I don't think it's really doing anything.
I should think about how observable works
and jupyter notebooks
and then look into smalltalk maybe? idk.
but like, having "the things in focus" and then "the things I'm just transiently looking at" seems good.
Oooh maybe hovering over a term or type pops it up in the right-hand (non-pin) pane?

hmmm but then I do still like the notion of a "gallery", especially when I'm experimenting.
TODO link to that blog post -- here it is https://shalabh.com/programmable-systems/offload-mental-simulation.html
hmm also the HN comments might be good https://news.ycombinator.com/item?id=27330740

huh
ok I really need to write a blog post or two about what I'm trying to do with jerd.

But yeah, I think my north star right now should be "an IDE where I can tweak things and *hang on to the code* for each "screenshot" that I come up with.

### Tracing!
- [x] basic compiler support
- [x] basic test runner support
  - [x] would be nice for the test runner to print out traces tho
- [ ] web ide support! (need to integrate traces with the evalCache I think....)
  - [ ] yeah let's do this next, to get a feel for things.
    - I do wonder about how best to /display/ traces from other terms though.
      do I open up a temporary thing with the ...
      or maybe I have a "full page debugging" view, that will open up terms that get traces?
- [x] GLSL yes let's get this folks!
  - So the basic idea is: the IR that I'm compiling has some trace calls in it
    (should be simple to check while generating the shaders), I go ahead and
    eval the ....
    ... hmmm. ok so the `trace` function is actually set up when the function
    is first evaluated, and from then on it's basically immutable.
    so I think that means that traces would all be collected globally? which would
    be quite confusing.
    OH wait I can just do a similar trick to what I'm doing with execution limits.
    have a globally shared mutable variable, that I swap out when I'm about to execute something,
    and then harvest right after.
    Yeah that sounds legit.
    Much better this way.
  - [x] tracing without buffers
  - [ ] tracing with buffers
    - this would mean, I think, swapping in a shader that just blits the texture out onto the canvas, then using toDataURL or something like that, and doing that for each buffer ... 
    - ooh ok it would be cool to have a setting to "show the intermediate buffers" anyway. Yeah that would be neat.

### Editor squirrlyness
- [x] make it so you can't select "inside" of an ID hash
- [x] make tab & shift-tab actually work reliably

### Basic usability
- [x] make a menu for cells, so I can do "export this term and dependencies" for debugging
- [x] ok for the maximally fancy, let's do "trace!() runs the javascript, and snoops the values"
- [ ] cmd+p to search for terms, showing most recently edited things, and their types, and such
- [x] pins should have a way to open up the cell of the source
- [ ] opening a cell should select it
- [ ] editing a thing should properly make the previous version's metadata be deprecated ... I think?
  what if the previous version had a couple of names? Is it only deprecated for that name? I can deal with that later.
- [ ] if a deprecated thing is used, underline it somehow
- [ ] type error should be underlined, thanks

### GLSL Plugins
- [ ] preserve textures when updating shaders if possible....
- [x] make a button to restart the timer
- [x] make a way to specify the size!
- [ ] let's add "mouse button down" uniform! Probably a boolean I guess? or it could be an int, following https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button. And then ... have like 6 or something be "nothing pressed"? or -1?

### Parser / Printer
- [x] don't require spaces around the = for const!
- [x] fix binop printing? so that it only wraps things that are the wrong level.

### Tutorial
- [ ] make one!
- [ ] could be cool to have a way to e.g. load an editor environment from a github gist or somewheres...
- [ ] when printing a lambda, if the body is another lambda, we don't really need to print the return type. We can just infer it, right?


## Loose ends!

- I'm not printing term annotations anymore, and that will break re-parsing of recursive dealios. Need to infer the annotation from the lambda declaration.


## OTHER EXCITING THING: Dual JS + GLSL

So you compile to js for the uniform management (and maybe responding to events? idk), things that only need to be done once per frame, and then sent to the shader.
I'm imagining things like: tracking a list of "mouse trails". and such.
So we'd have an extra value on the env, that would get calculated in js & then sent down.

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
- [x] handle passing a lambda
  - options:
    - immediately toplevel-it
      - this seems better
      - ok, so if it requires in-scope variables, ignore it for now.
      - and later we'll do a fun struct thing.
    - try to inline it, and then toplevel it if necessary.
- [x] OK and then we also need MULTIPLE NAMES. So idNames needs to be a list. And let's extract all usages of idNames into env.ts.
  - Then we can overload all the builtin functions to our heart's content, and maybe be ready to actually demo stuff?
  - of course, we'll then need the ability to indicate that a given term "overrides" another term, and should take precedence in the 'idNames' list. ... although, maybe that's settled by just having newer things sorted after? ok but I do want a replaces thing. But will also need a 'createdDate' metadata, do want that.

START HERE PLEASE

## WEB INTERFACE - get ready for GLSL

- [x] add support for multiple "tabs" for different groups of cells.
- [x] AND THEN we can bring this wonderful GLSL goodness to our web editor bonanza.


HMMmmmmm I want ... and optimization debugger
... that keeps track of all of the intermediate states
... of optimization
... and then lets me flip through them
... and optionally disable them? idk. or something.

- [x] BETTER IDS!
  - Here's the plan: instead of printing out the full ID for any of this, just output a single char, `#`, and give it a span-attribute of the ID or sym or whatever hash. If the user deletes the hash, then it frees it.
  - at a later date, when we have full structured editing, we don't need that hack.

## Papercuts in the editor

- [x] fix printing of custom binops
- [x] do something about the proliferation of all those IDs. Do I have to make a more complicated editor? Or just elide the ones that can be unambiguously inferred? Yeah maybe that's the ticket.

## Let's try some SDF raymarching in the editor!

- [x] FIX optimization that's making this basic raymarch not work...

- [ ] more complex raymarch! with normals this time
  BORKEN! I'm thinking it's because ... the sceneSDF function
  is being used twice.

- [x] FIX optimization that's breaking normal js examples
- [ ] let's have a `test-optimizer` that tries running each optimizer pass individually (?) to verify that they're making changes that are sane? idk. I'd also really like to have some fixture tests or something. But maybe that would mean ... making a pretty-printer for the ir.Expr?

- [ ] ohmygosh allow me to type attr names for my function type, it's fine.
- [ ] parsing of #self in the editor seems not to be working? Oh it's that we're not printing `rec` correctly. Got to do that.
- [ ] infer lambda arguments from point of use pleeeease

- [ ] hover of things should pull up a floater that you can click to open a thing
- [ ] opening a cell *should focus it & scroll into view, gosh* (it should also be opened right below the current thing)
- [ ] drag & drop to reorder cells probably?

- [ ] might be nice to have "templates"? idk, like prefill for me the GLSLEnv, coord dealio.
- [ ] fix tab to actually work



- [ ] add grabbable sliders for twiddling constants!

## Fancier type error goodness!

- [ ] it would be super cool to detect whether `env.time` was ever accessed, and if not, just not re-render with requestanimationframe. If it doesn't change with time, no need. Right?

- [ ] start using the TypeError thing, and the Ambiguous thing, and have them show up in cool ways in the editor! not 100% sure how this will happen...

- [ ] fix inlining of recursive functions? well to do that I need to do inlining of lambdas that capture scope variables.
- [ ] properly handle lambdas that close over things, probably by making a new Expr type that groups a record of scope variables with the hash of the lifted lambda.
- [ ] make ambiguous numbers work? Not sure the extent to which we should go. Like, if you have 1 + 2 + 3 + 4.5, do we maintain the ambiguity?
    and then, do we expect that to happen to other functions too? What about if you assign it to a variable, and then use it? Does it carry over?
  Ok, I think if you assign it to a variable it gets collapsed down.
  If you use it in a function then it gets collapsed, unless it's a special numeric binop, in which case we suspend judgement.
  ??? maybe?
  yeah I guess that's fine. idk.



- [ ] full and correct inlining of functions. Every function should be inlineable, unless it is recursive. We will then only use inlining for:
  - eliminating lambdas

How / what to inline and stuff?
- Ok, so we also want to fix the "toplevel struct" issue.
- OH yes let's have struct support too folks. So we can do tuples and whatnot, thats nice
- ALSO: type-directed name resolution, allow multiple names for things, so that we can overload vec4 and stuff, that would be extremely nice. Also so we can have "-" as a unary op and a binary op and so we can have "+" be for strings.

- [x] now that I have uniques, I don't have to worry about declaration collisions.
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
