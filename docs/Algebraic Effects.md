# Algebraic Effects

Very much based off of eff-lang, but taking, like unison, the choice of making handlers "shallow" (https://www.eff-lang.org/handlers-tutorial.pdf).



## Todo

- want to make the handlers list a linked list probably



## How to optimize performance of the handlers data structure?

This backtracking thing is definitely a stress test 😅.

Currently I'm using an Array.

What about a linked list?

`[head, tail]` where `head` is `{hash, fn}`, and `tail` is `nil === []` or `[head, tail]`



## Editor Integration

So one thing I want to make super easy is fixture tests for all terms.
(and probably generative tests too)
this will be built-in to the editor.
When you're working with a term, you can have a sidebar open listing the inputs and the expected outputs.
also, if you just provide an input, the output will be filled in (yay jest fixtures), and you can choose to accept or reject.

So with effects, the fixture harness will allow you to specify a list of effects that you want to spoof.
OR probably you can reference one or many handlers that are already defined, that will wrap the current term n stuff.

So you have
- myCoolFn
- Fixture lists
    - handlers: x, y, z
      fixtures:
      - input: x; output: y
      - input z;  output: a
    - handlers: a, b, c
      fixtures:
      - ...

And handlers just needs to be a list of functions that handle effects. they'll be applied left to right.


