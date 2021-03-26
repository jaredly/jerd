# Type System

I want to formally specify the type system

Values, represented in memory:
- base (string, int, bool, char, float)
- record (tag string, v1, v2, ...)
  - arrays are considered to be a special kind of record
- function (arg1, arg2, ... => value)

- functions can be `Apply`d
- records can be created, accessed, and destructured


And that's it.
Values can have types:
- Function types, for functions
- Record reference
- Enum reference
- Variable types, which might be either function or non-function, or potentially might be higher-kinded.

Can I unify function types and non-function types?
I think haskell does. And the haskell-in-haskell paper. It's just "Arrow is a HKT from * to * or sth)

so,
functions being auto-curried helps
also records being auto-curried



THIH version:
```
data Kind = Star | Kfun Kind Kind
data Type =
  | TVar Tyvar
  | TCon Tycon
  | TAp Type Type
  | TGen Int
data Tyvar = Tyvar Id Kind
data Tycon = Tycon Id Kind

tUnit = TCon (Tycon "()" Star)
tChar = TCon (Tycon "Char" Star)
tBool = TCon (Tycon "Bool" Star)
tInt = TCon (Tycon "Int" Star)
tFloat = TCon (Tycon "Float" Star)

tList = TCon (Tycon "[]", (Kfun Star Star))
tArrow = TCon (Tycon "(->)" (Kfun Star (Kfun Star Star)))
tTuple = TCon (Tycon "(,)" (Kfun Star (Kfun Star Star)))

; Int -> [a]
TAp (TAp tArrow tInt) (TAp tList (TVar (Tyvar "a" Star)))

list t = TAp tList t
a fn-> b = TAp (TAp tArrow a) b

var name = TVar (Tyvar name Star)

; Int -> [a]
tInt fn-> list (var "a")


```




Ok so I've been worried about records, but if I just think of attributes as getter functions, maybe it becomes more straightforward?

because I know how functions work?
like a getter function can be simpler to type?

```
type Whatsit{e}<T> = {
  a: T,
  f: (v: T) ={e}> int
}
// is basically
getA{e}<T>(v: Whatsit{e}<T>): T
getF{e}<T>(v: Whatsit{e}<T>): (v: T) ={e}> int
// is that easier to think about?
// but also is it more annoying? because we might have to specify the variables twice?

v.{e}<T>a // looks hella awkward
// ok we'll just inherit whatever effect & type args from the target objects.
```

Ok, because I have covariance & contravariance, I don't think I can do the THIH thing
and not have a first-class representation of functions.

another thing that happens is that I want explicit instantiations of things,
and haskell doesn't even have the syntax for it.


Covariance, Contravariance, Invariance
```
const impure: () ={Stdio}> int
const pure: () ={}> int

const takesEither = {e}(f: () ={e}> int): int ={e}> f() + 4

// all good
takesEither{}(pure)
takesEither{Stdio}(impure)

// what does this mean?
const goesDeeper = {e}(): (() ={e}> int) ={e}> int => takesEither{e}

Yeah I don't think I want to allow that.
Ok, so rules around Effect variables:
- must map onto one of the function arguments
- must be part of this function's explicit delios?

const multiples = {e, f}(a: (() ={e}> int) ={f}> int, b: () ={e}> int): int ={f}> {
  a(b)
}

// ok, but like this isn't subtyping, right? because it's explicit?

const expectsStdio = (f: () ={Stdio}> int): int => mockStdio(f) + 12

expectsStdio(impure)
expectsStdio(pure) // this is subtyping
expectsStdio(() ={Stdio}> pure()) // this is without subtyping

tbh maybe I just want to try things without subtyping.
and like maybe there could be a macro to subtype the things?

```














