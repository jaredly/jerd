# FFI

What's my current vote?
hmmmmm.
if I want to have react, and I kinda do (b/c my goodness the community libraries)
the maybe I need C? Although I'd like to see how far I can get with A.
And maybe it's "components return my custom datatype that gets turned into elements".
Which hopefully wouldn't be too expensive.


## Pure Options

### A) It's all just handlers

The environment running your stuff knows about certain unique effects
and passes in handlers at the top level.

This is definitely easiest to implement, no new machinery.

Buuut how would it play with react?
Not terribly well.
I mean I can spoof React.createElement
hm not terribly well.
hmm.

Ok actually I do wonder whether I could get this working without an obnoxious amount of glue.

### B) It's handlers, but effects can be marked as "simple"

This means that the handler can't do anything async, they don't get the first-class "k" to mess with.
And so *those* effects wouldn't trigger CPS.

I would need to make a way to locally handle such simple effects as well.

This wouldn't totally get React working though, because functions would still expect a "handlers" object (hm yeah we'd still have to modify all function calls to take the extra handlers argument)
So passing a function component to React.createElement would be wonky.
Although not insurmountable.
but anyway, non-CPS doesn't mean "no extra dealio".

But yeah this means you can mock out react n stuff, which is cool.
BUT also it's somewhat of a hassle to "start using a new npm package".
I mean I could probably codegen a decent amount of that?

## Impure Options

### C) It's normal-looking functions with the special "ffi" effects

So the `ffi` effect signals that these aren't pure.
And the functions would be declared via something that looks kindof like `external`.


## How do I do "drop in some js plz"?

So that might trigger a special `jsraw` effect? I found being able to drop down to javascript quite useful sometimes. Not sure if that will still be the case.


