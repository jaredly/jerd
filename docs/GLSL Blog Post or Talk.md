What does it take to compile to GLSL?

Things needed to go functional -> imperative
- ifs / switches as values vs statements
- eliminating tail-calls where possible

Restrictions:
- no enums
- no pointers (including function pointers)
- no heap allocation (dynamically sized objects, arrays, recursive data, strings)
- no custom types for toplevel constants
- no recursion
- only constant-bounded loops
