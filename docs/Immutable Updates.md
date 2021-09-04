
# Deep immutable updates!

What if a.b[c].d = 10
returned you a copy of `a` with the deep update applied?
that would be very cool.
also, it would be interesting if there could be userland implementations of datastructures
that allowed for [] indexing, and could define a []= operator
so basically

a.b[c].d = 10

expands to

a.b = ((a.b)[c] = ((a.b[c]).d = 10))

Oh btw I bet decorators on things that have suffixes aren't rendering right.

yeah that's cool
