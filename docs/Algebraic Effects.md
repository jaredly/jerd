# Algebraic Effects

Very much based off of eff-lang, but taking, like unison, the choice of making handlers "shallow" (https://www.eff-lang.org/handlers-tutorial.pdf).



## Todo

- want to make the handlers list a linked list probably



## How to optimize performance of the handlers data structure?

This backtracking thing is definitely a stress test 😅.

Currently I'm using an Array.

What about a linked list?

`[head, tail]` where `head` is `{hash, fn}`, and `tail` is `nil === []` or `[head, tail]`