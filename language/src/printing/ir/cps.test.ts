/*
OK
if I were writing tests for this
which I'm not

hello(one, two)
// w/ effects {A, B}
->
hello(one, two, handleA, handleB, done)
// right?

10
// w/ no effects
done(10)
// that's the whole story

UNLESS
done has effects
oh right love it

so like
gotta keep track of the effects of our dones


let x = doSomething(1, 2)
// becomes
doSomething(1, 2, handleA, handleB, (handleA, handleB, x) => {
    // maybe a little weird that the "done" functions
    // have the handlers prepended
    // while the calls have handlers appended
    // to the arg list.
})

but what if

hm
ok
so

ok, so I don't have a ton of visibility into this system
which is frustrating

I'd love to have fixture tests or something.



ok, but so with this new handlers transform
can I actually stay within the Terms fully typed world?
that might be interesting.

*/
