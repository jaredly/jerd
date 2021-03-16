# Editor

So the editor will be a web page
ideally written in jerd.
and the backend will talk to it n stuff.

Thinking about this [video about rtfeldman's roc](https://www.youtube.com/watch?t=4790&v=ZnYa99QoznE), how do we want to do editor extensions?

- unison has the concept of 'associating' one term with another (used for associating a docstring with a term)
- we could associate a (something) with a Type in a library, and then the editor could notice that when we're rendering that type, and show you the alternate UI. Right?
- would definitely want to lock down the type of that, so it would be hard for plugins to misbehave.


ugh I really need to publish my literature review of structured editors.
Would a github pages site make sense? probably.
with a minimal build tool to turn markdown files into something that's interconnected.

## REPL

Here's what this looks like

- [x] env needs to be immutable (typeDefine & friends return a new env)
- [x] the central concept is a vertical list of "cells". Cells have a "contents" and a "display".
  - the contents is a hash, referring to a term or an expression or a type or effect
  - the "display" is configurable. the default is to show the result of the expression / value of the term.
  - but you can e.g. have the display be "element", where, if it's an effectful function, it runs the function in the context of React, or something.
  - or you can have the display be "animation", where it runs the function over and over with increasing timestamps, and renders to a canvas.
  - yeah that's my main hope
- [x] expression results are stored in a different data structure; for pure expressions, there's only ever one entry. for impure ones, it's a list of results, with timestamps.
- [ ] persist env to localstorage for now.
- [ ] probably allow saving to file & loading from file? not sure exactly how though.
  - would gzipped json, or msgpack, be smaller?

ooh look to shem/golem for inspiration on what demos look ince.


## Bugs

- [ ] when editing a record, we're rng'ing a new unique each time, which isn't great. how do I keep track of the rng we've made for this already?