
; match macro, basically

(match target
    something => body
    otherthing => body1
    _ => body3)

(let [tmp target]
    (match!<typeof something> `tmp something body
        `(match!<typeof otherthing> otherthing body1
        // so the type checker could know about unreachables?
            `(match! _ body3 (unreachable))))
)

; umm ok so I got sidetracked trying to figure out types and macros

case-let


ok, do I have the statement / expression split?
I do like early-returns...
and for loops don't make sense as an expression
but i do kindof want to support them

but lisp is so eleganttttttt

ok maybe the match thing can just be a modular implicit.
so like there are a couple of ways to destructure a thing, right?
oh yeah it should work with destructuring anywhere.
let {x: y} = z // but any of these might not match, right?

(interface DestructureArrayLike<T<I>>
    length(T<I>) -> int
    empty(T<I>) -> bool
    first(T<I>) -> Option<I>
    last(T<I>) -> Option<I>
    cons(T<I>) -> Option<(I, T<I>)>
    snoc(T<I>) -> Option<(T<I>, I)>
    at(T<I>, int) -> Option<I>
    drop(T<I>, int) -> T<I>
    take(T<I>, int) -> T<I>
)

(interface DestructureMapLike<T<K, V>>
    empty(T<K, V>) -> bool
    get(T<K, V>, K) -> Option<V>
    drop(T<K, V>, K) -> T<K, V>
)

so
I think that's the shape of it
am I overthinking this?
what other collections datastructures do people have?

(interface ArrayLike<T<I>>
    create(Array<I>) -> T<I>
    unshift(T<I>, I) -> T<I>
    push(T<I>, I) -> T<I>
    concat(T<I>, T<I>) -> T<I>
    append(T<I>, Array<I>) -> T<I>
)

(interface Ord<A, B>
    lt(A, B) -> bool
    eq(A, B) -> bool
    lte(A, B) -> bool = (a, b) => eq(a, b) || lt(a, b)
    gt(A, B) -> bool = (a, b) => !lte(a, b)
)

; handle Effect<X>


; can I add modular implicits later?
; can I add everything later?

VERY basic
um

just ints
just apply
just builtins
+ is just Int.+ its builtin

;;

code lives in a database! sqlite for surez.
with an index table of dependencies

;;;

;;

;

ok, getting into effects.

unison has effects, even parameterized ones,
but when you handle effects, you're matching directly on the effects.
because no HKT

But *what* if you could match on *implements X*?
like "any kind of Error"? like go's `error` interface.

-- eh maybe this is Too Much Magic. effects are already a bit of magic.
-- if needed we can have wrappers to convert between effects

oh yeah I also want to be able to have 'non-resuming effects' as a type.
so that errors are cheaper.

effect Error {
    error Text -> . // means it can't return. no continuation needed.
}

but ok that can come later.

















ok also
macros can be expressiony or statementy or termy, right?
like there are different rules for what it could produce
oh or typey? what am I getting myself into.
ocaml's many layers of ppx are pretty complicated.





















; um can I just use javascript's syntax? like typescript?
; and esbuild? or something?
; it's got a bunch of stuff going for it.
; it might be a little funny.

; raising an effect takes a special symbol. or a builtin function? could be.
; handlers are typed, and must be total.

; ugh I want a parser generator that will also generate a pretty-printer, and a syntax highlighter.
; I kinda want javascript but with a more powerful case syntax. right?

; stack-local mutability. "mutability is fine of no-one else can see it."
; so like.
; idk. maybe that's too weird.

; ok folks
; so, the function call to one, when I invoke it, needs to specify what Adder implementation I'm referencing.
(define (one two three) : (a, List<a>) => a with 'a: Adder<a>
    ('a#+ two (List.head three))
    )

; so I'm gonna need some level of local inference.

(interface Adder<a>
    +: (a, a) => a
    )

(module IntAdder : Adder<int>
    +: (a, b) => Int.add a b
    )

(module FloatAdder : Adder<int>
    +: (a, b) => Float.add a b
    )

; do we allow panics?
; I mean, unhandled effects sure
; so unchecked get might throw an effect?
; just like a generic exn?
; hm Kinds hm. ok so rust's HKTs
(defmacro (![]<Array<T>> items body)
    if items[0] == Some('...') {
        rest = items[1:]
    }
    // [a, b, ..._]
    // [..._, a, b]
    // [a, ..._, b, c]
    // [a, b, :...]
    mut lefts = []
    mut rights = []
    mut full = false
    mut where = 0
    for x in items {
        if x === ... {
            if where == 1 {
                return ummm // do I do returns?
                // am I making a functional language?
                // or something?
            }
        }
    }
)

; orrr do I do compiler magic to unroll `loop/recur` into normal imperative code?
; hmmmm
(loop (lefts [] rights [] full #f where 0)
    // uh
)
; I definitely like working in a lisp

; what kind of a syntax do I even want?
; lisps are super fun
; does it matter
; no it doesnt
; the whole point is to be syntax agnostic.

; can modules be generic?
; can values be generic?
; like, that's what GADTs are, right?
; which is definitely cool.
; although then you have the issues of things escaping, right? which is weird.

(module AnyAdder<a> : Adder<a>
    +: (a, b) => a
)

; like, it seems like this should in principle be legal.

; can I dynamically create `module`s? With scope n stuff?
; I mean sure, right? like it's just a record of functions, in the end, that gets automagically added into things.
; can it also have values? I mean why not?
; ok at this point how is it different from a record?

; here we can make the choice. Do we specify the modular implicit for one, or do we let the use-case specify it?
; oh default values! hm yeah we could even have er well wait. Yeah like we really could.
; so 
(define (double awe) : (float) => float with 'a: Adder<float> = FloatAdder
    (one awe [5.0]))

; syntactically, you can do (one 5 _), and the `_` means "we're making a lambda that leaves this arg out"
; if you do (one 5 _:ok) then it has the label "ok"? maybe too weird.

(one 1.0 [1.0, 2.0]) ; this gets compiled as `Call{ target: one, args: [1.0, [1.0, 2.0]], modules: {'a: FloatAdder}}

