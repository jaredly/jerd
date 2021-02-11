

// taking care of recursive definitions yep
struct Id {
    hash: String,
    size: usize,
    pos: usize,
}

// All terms can have annotations (comments).
// ooooh also an annotation could be the macro that was invoked to produce this code 🤔
// so, what happens if you update a macro?
// you can choose to re-run the places that was run.
// ohhh and macros *definitely* have access to full type information, on everything up to where they are.
// and if they use something that doesn't have an annotation yet (or inferred), then we just ask the
// use what the type should be. Right?

// Uhhh I should probably be making the compiler in javascript, shouldn't I.
// so that it can be web-ready from the get-go. Yeah.
// ugh but I want rich case statements and stuff.

// Ok, is there any benefit to "modular implicitst editor?
// Ok, is there any benefit to "modular implicits" in a world with a sufficiently-smart editor?

// One-owner types is nice, lets us do "controlled mutation"
// a one-owner type can be "released" to be multi-owner (the normal state of things)
// but you can't go the other way around, without a `copy()`.
// Yeah having affine types would be super cool.
// Do I care about "relevant" types? depends on what "used" means I guess. probably not.

// ugh does that mean all function arguments need a potential "mut" keyword? hrm I guess.
// but no borrowing. if you have a mut thing, you are definitely the only one, right? well
// no I guess we can borrow. uh it just means uh you can't hm store it anywhere if you have a borrow.
// hmmmmmm this is a little more complicated.
// so we have "move" and "mut". "move" is also "mut".
// if you want an arg to be "move" hm

enum Reference {
    Builtin(String),
    Id(Id),
}

enum Term {
    Ref(Reference, Type), // denormalized type here
    Var(String, Type),

    // Literals
    Text(String),
    Int(isize),
    Float(f64), // this isn't quite true in javascript, but we live with it.
    Char(char),

    Vector(Vec<Term>, Type), // do I need this type here? it's denormalizing, which maybe isn't good. oh but if empty, we do.
    List(Vec<Term>, Type),
    Map(Map<String, Term>, Type),
    // ummmmm do I allow non-string map keys? b/c thats hard for js
    // on the other hand, I could have a separate fancy-map that uses the js `Map`
    // maybe the js-friendly one would be called Assoc or something
    Macro(
        Reference,
        // Args
        Vec<Term>,
        // Produced AST
        Box<Term>
    ),

    Lambda(
        // args
        Vec<(String, Type, Option<Term>)>,
        // effects
        Vec<Effect>,
        // hm implicits here?
        Box<Term>,
    ),
    If(Box<Term>, Box<Term>, Box<Term>),
    // everything is let* unless it's letrec
    Let(Vec<(String, Term)>, Box<Term>),

    Ann(Box<Term>, Type), // explicit annotation

    Index(Box<Term>, Box<Term>),
    Attribute(Box<Term>, usize),
    ImplicitMethod(Reference, )
}

// how do I do macros?
// what's an example of a macro?
// I've been thinking about match as a macro

enum Effect {
    Generic(String),
    Id(Id, Vec<Type>)
}

enum Type {
    Hole, // this is how things start out
    Constructor(Reference, Vec<Type>),
}

enum TypeDef {
    Sum(Vec<Type>),
    Product(Vec<(String, Type)>),
    Alias(Type),
}
