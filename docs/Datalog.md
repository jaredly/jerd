
Should I try using datalog for type inference?
It would be very cool to be able to express the type checker as logical rules...
seems like it would be easier to audit and such.

Question: Can I do this well without requiring negation?
Folks were saying that I would need to be able to do `error(pos) :- expected(X, pos) & provided(~X, pos)`
but couldn't I just get the expecteds and provideds for each position ... and 
hmmmm
yeah I don't know how that would work.

also, is there a way to establish a correspondence between datalog rules and a ~reasonaby performant imperative implementation?
like that would be cool.


