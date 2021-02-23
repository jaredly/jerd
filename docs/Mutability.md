# Mutability

Mutable variables need to be declared as such
Passing a mutable variable into a function transfers ownership, it cannot be used again
assigning to an attribute transfers ownership
returning transfers ownership.


Is that the simple model I want? Then I don't have to worry about the difference between `mut` and `&mut`, right?
but then, do I special-case tuples or something?
like how do I return the mutable thing, and another value?
that's not super satisfying.

but like you shouldn't be able to `immutable!()` a borrowed thing, without cloning it.

"shallow mutability" is what we're talking about at any rate, I think. because we can't have guarentees for child things.

Ok, simpler thing: If you created it, you own it. Can't go out of scope. But you can pass it as a borrowed thing.
Does that work? So any functions that are accepting `mut` things are taking the borrowed version, but can't store or return without cloning.
But if you declare it locally, you own it, and can pass the borrowed version.

BUT once you `immutable!()` it, you can't pass it to places.

Also, mutable things can never go into effects.

Also mutable things can't be captured by scope.

Are those enough rules?
- can't pass on scope
- can't be assigned into things
- can't go to functions that aren't expecting them to be mutable
    - type args for records can't be mutable. for functions they probably can be












## Brainstorm

Mutation can be very important for performance.
However, mutable shared objects are the source of much frustration and unpredictable behavior.

The plan:
use affine types (single-owner) to allow "mutability no one else can see".
This is a more limited version of rust's mutability. algorithm.

Overview:
- objects can be created as mutable, but as soon as they are used as immutable they can't be used as mutable again
- "returning" a value makes it immutable (mutable return types aren't allowed)
- 



ok simpler rules
- there are single-owner and multi-owner values
- single-owner can be converted to multi-owner, but not the other way around
- single-owner can be mutated.
- sub-objects (record attributes) are always multi-owner

Does that actually do anything for us?
other than arrays and maps and stuff.
but maybe arrays are all one needs for the perf that we want?
hmmm
but no custom data structures.


Rules:
- you can only "own" an object you created (in this scope)
- you can only "store" an object that you own, or that is immutable.

Question: Is there a way to implement clojure's transients using these rules?
that would be cool.
so clojure's transients require that things are consumed.

oh what if there's a manual special method to call to turn something immutable again?
that could be cool. `immutable!()`
and a `mutable!()` thing that also clones.

I think the first pass, I would only have a shallow mutability. So attributes of records wouldn't be mutable, but they could be replaced.

because clojure's transients support sub-item mutations. Although internally they probably rely on it?


