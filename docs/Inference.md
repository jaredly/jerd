# Type inference

Functions can have type variables.
When constructing the typed AST, things without explicit annotations
are initially given their own custom type variables.
And then we go through, and record the various constraints that come up.
One thing that's weird in the non-IDE setup, is that
we're doing name resolution without user feedback.

yeah let's see how this goes.

Also, how do type variables play at the lambda level?
I don't know!

should type variables be anchored to the closest lambda?
yeah I think that makes sense.
And if they get constrained across the boundary that's fine.
