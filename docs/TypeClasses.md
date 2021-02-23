


could I use implicits for dependency injection?


:local-module (implicit arg)
::globally-resolved


Ok, things I'm hoping implicits will do for me:
- equality anywhere I want it
- traversal, visitor pattern and such

Should I make a distinction between Modules and Records?
Does there need to be one?
The idea of modules is that they're mostly about functions you call.
can we do variables as well?
types? I don't think we can do types. although, hm maybe, locally abstract types.

Making the distinction could be helpful for resolution, potentially.

Ok what about "default implementations"? That's something typeclasses have.
I could probably get that done with a macro

So unison's "metadata" thing does seem pretty cool.
b/c you could have a meta-node on the record type, that provides some default
implementations.

oh so the thing about records, is the functions don't generally have access to the other functions on the record. the 'bound this' in javascript.




Here are some builtin haskell typeclasses https://www.haskell.org/onlinereport/haskell2010/haskellch6.html

- Ord
- Read
- Show
- Eq
- Functor
- Monad
- Bounded
- 




  class  (Eq a) => Ord a  where  
    compare              :: a -> a -> Ordering  
    (<), (<=), (>=), (>) :: a -> a -> Bool  
    max, min             :: a -> a -> a  
 
    compare x y | x == y    = EQ  
                | x <= y    = LT  
                | otherwise = GT  
 
    x <= y  = compare x y /= GT  
    x <  y  = compare x y == LT  
    x >= y  = compare x y /= LT  
    x >  y  = compare x y == GT  
 
    -- Note that (min x y, max x y) = (x,y) or (y,x)  
    max x y | x <= y    =  y  
            | otherwise =  x  
    min x y | x <= y    =  x  
            | otherwise =  y

The Ord class is used for totally ordered datatypes. All basic datatypes except for functions, IO, and IOError, are instances of this class. Instances of Ord can be derived for any user-defined datatype whose constituent types are in Ord. The declared order of the constructors in the data declaration determines the ordering in derived Ord instances. The Ordering datatype allows a single comparison to determine the precise ordering of two objects.

The default declarations allow a user to create an Ord instance either with a type-specific compare function or with type-specific == and <= functions.



  class  Eq a  where  
        (==), (/=)  ::  a -> a -> Bool  
 
        x /= y  = not (x == y)  
        x == y  = not (x /= y)


// by default, binary operations that don't start with a colon are assumed to be global (with `::`).

::==
::=>
::<=
::>
::<

// and that would derive the other one?
personEq : Eq<Person> = @typeClass({
    '==': (left, right) => left.id == right.id
})

hm so syntactically, terms in a haskell typeclass can depend on each other.
in scala, classes can do the same.
ocaml's modules as well to some extent.
So I guess that's a reason to have them be different from records....
although allowing them to carry data would still be cool.


Ok, here's an example of using "higher kinded types":

ageForUser :: Functor a => String -> (String -> a User) -> a Int
ageForUser name userFinder = fmap age (userFinder name)

from https://medium.com/@patxi/intro-to-higher-kinded-types-in-haskell-df6b719e7a69

So the gist here is, being able to express "T<String> for any T that's a Functor" is cool.

So the way that makes sense to me to express it would be `Functor<T<String>>`? hmm maybe not
also, does not having partial application make people mad?
I could possibly have partial application in the type world, but not in the values world 🤔

Here's another well-written example indicating what I probably want to do.

https://www.baeldung.com/scala/higher-kinded-types


```ts
const ageForUser = <T>(name: string, userFinder: (string) => T<User>, :Functor<T>) => :fmap(user => user.age, userFinder(name))

const ListFunctor: <X>Functor<List<X>> = <X>{
    fmap: <Y>(fn: (contained: X) => Y, container: List<X>): List<Y> => list.map(fn)
}

// ok so here fmap could just have been parameterized by <X, Y>, we didn't need the functor to be parameterized, right?

`
type <X>Functor<T<X>> = <X>{
    fmap: <Y>((X) => Y, T<X>) => T<Y>
}
`

or

`
type Functor<T<_>> = {
    fmap: <X, Y>((X) => Y, T<X>) => T<Y>
}
`

`
class Monad m where
  (>>=)  :: m a -> (  a -> m b) -> m b
  (>>)   :: m a ->  m b         -> m b
  return ::   a                 -> m a
  fail   :: String -> m a
`

type Monad<T<_>> = {
    return: <X>(X) => T<X>,
    // Fail is weird, lets ignore it
    // fail: <X>(string) => T<X>,
    bind: <X, Y>(T<X>, X => T<Y>) => T<Y>,
    map: <X, Y>(T<X>, X => Y) => T<Y>
}

type Maybe<X> =
    | None
    | Some(X);

const MaybeMonad: Monad<Maybe<_>>> = {
    return: <X>(c: X) => Some(X),
    // fail: <X>(message: string) => None,
    map: <X, Y>(v: Maybe<X>>, op: (X) => Y) => switch v {
        None => None,
        Some(x) => Some(op(x))
    },
    bind: <X, Y>(v: Maybe<X>>, op: (X) => Maybe<Y>) => switch v {
        None => None,
        Some(x) => op(x)
    },
}

// ok, but what about types with multiple arguments.
// like Either
type Result<Ok, Fail> =
    | Ok<Ok>
    | Fail<Fail>

// So, like, what even is happening here
const OkMonad: Monad<Result<A, B>> = {
    return: <X, Y>(c: X): Result<X, Y> => Ok(c),
    map: <X, Y, Z>(v: Result<X, Z>, op: (X) => Y) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => Ok(op(x)),
    },
    bind: <X, Y, Z>(v: Result<X, Z>, op: (X) => Result<Y, Z>) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => op(x),
    },
}

// So, like, what even is happening here
const OkMonad: <B>Monad<Result<_, B>> = <B>{
    return: <X>(c: X): Result<X, Y> => Ok(c),
    map: <X, Y>(v: Result<X, Z>, op: (X) => Y) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => Ok(op(x)),
    },
    bind: <X, Y>(v: Result<X, Z>, op: (X) => Result<Y, Z>) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => op(x),
    },
}

// ** what if we lifted things up to be clearer
// ugh maybe not clearer

type <X>Monad<X, T<X>> = {
    return: <X>(X) => T<X>,
    // Fail is weird, lets ignore it
    // fail: <X>(string) => T<X>,
    bind: <X, Y>(T<X>, X => T<Y>) => T<Y>,
    map: <X, Y>(T<X>, X => Y) => T<Y>
}

// So, like, what even is happening here
const OkMonad: <B>Monad<Result<_, B>> = <B>{
    return: <X>(c: X): Result<X, Y> => Ok(c),
    map: <X, Y>(v: Result<X, Z>, op: (X) => Y) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => Ok(op(x)),
    },
    bind: <X, Y>(v: Result<X, Z>, op: (X) => Result<Y, Z>) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => op(x),
    },
}






// thought: what if I had the attributes of a record instantiationbe able to call each other? basically in an implicit 'letrec'? hmm I guess I could have a macro that does that.
// nother thought: I think I want a distinction between "macro" and "typed macro"... 🤔
// althought that might mess up the editor experience?
// b/c like this macro would be pre-type-inference
// but there are also macros I want to run post-type-inference.

// and then you could do
const ageForUser = <T>()

```

ok, but what happens when we have a type that accepts multiple parameters?

```

```


Ok, so basically typeclasses are often operating on higher kinded types.


And yeah, why shouldn't I have higher kinded types?
- types can have types as arguments
- values can have values as arguments
- values can have functions as arguments
- types can have HKTs as arguments.

So what's the syntax for an HKT?
The thing is, the basic syntax is generics. And I don't want to lose that.

So `T<K>` is haskell's `T K`.
and `T<K, A>` is `T K A`.
If I wanted to mirror function application, it would be, well
hm.
a function `T = A => M`. So `K => T<K>` is maybe the way to say it.
abbreviated `T<_>`? But you could do `K => M => T<K, M>` if you wanted?

or `K => T<K, int>`

Yeah ok I guess this is fine.

we can have function declarations at the type level.


```ts


// So, like, what even is happening here
// -> )
// uh hm.

// :>

type Monad<X => T<X>> = {
    return: <X>(X) => T<X>,
    // Fail is weird, lets ignore it
    // fail: <X>(string) => T<X>,
    bind: <X, Y>(T<X>, X => T<Y>) => T<Y>,
    map: <X, Y>(T<X>, X => Y) => T<Y>
}


type Monad<X => T<X>> = {
    return: <X>(X) => T<X>,

    // Fail is weird, lets ignore it
    // fail: <X>(string) => T<X>,
    bind: <X, Y>(T<X>, X => T<Y>) => T<Y>,
    map:  <X, Y>(T<X>, X => Y) => T<Y>
}

`
class Monad m where
  (>>=)  :: m a -> (  a -> m b) -> m b
  (>>)   :: m a ->  m b         -> m b
  return ::   a                 -> m a
  fail   :: String -> m a
`

const OkMonad: Monad<K => Result<K, B>> = <B>{
    return: <X>(c: X): Result<X, Y> => Ok(c),
    map: <X, Y>(v: Result<X, Z>, op: (X) => Y) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => Ok(op(x)),
    },
    bind: <X, Y>(v: Result<X, Z>, op: (X) => Result<Y, Z>) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => op(x),
    },
}

const ageForUser = <T>(name: string, userFinder: (string) => T<User>, :Monad<T>): T => :fmap(user => user.age, userFinder(name))

const concatter = <X, T<X>>(value: X, container: T<X>, :Monad<T>) => :bind()

// If you can provide a proove that the value you're giving me is a Monad, then by all means go to town.
// OkMonad needs to be convincing that `Result<User, String>` is a monad?
// or that `Result` is a monad?
// where are we instantiating things?
// ageForUser<Result<User, String>> is in fact the T in question.

// ok yeah, so what we want here is to verify that
// OkMonad satisfies Monad for Result<User, String>
// Do we need to assert what type argument we're dealing with?
// I don't think so?
// Once OkMonad has been verified as being valid for Result,
// we're good to go.

const OkMonad: Monad<Result<_, _>> = <B>{
    return: <X>(c: X): Result<X, Y> => Ok(c),
    map: <X, Y>(v: Result<X, Z>, op: (X) => Y) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => Ok(op(x)),
    },
    bind: <X, Y>(v: Result<X, Z>, op: (X) => Result<Y, Z>) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => op(x),
    },
}

// ok so like here we have the record, and its type is...
/// parameterized?

type Monad<T<_>> = {
    return: <X>(X) => T<X>,
    bind: <X, Y>(T<X>, X => T<Y>) => T<Y>,
    map:  <X, Y>(T<X>, X => Y) => T<Y>
}

// hrrrrrrm yeah we're really not going to be able to get this
// done without some more syntax, are we.

// because substituting T<X> in here, how do we know it's correct
// what if it swapped the things
// Also, when people ask for `Monad:return(5)` they're expecting `Result<User, string><int>`? That makes no sense.
// Monad needs to be about the type itself, not the arguments.
// Unless there are further constraints on the arguments.



// so 
const userFinder: string => Result<User, string>;
ageForUser<Result<User, String>>("Yes", userFinder, OkMonad)

const ListFunctor: <X>Functor<List<X>> = <X>{
    fmap: <Y>(fn: (contained: X) => Y, container: List<X>): List<Y> => list.map(fn)
}



```





#### More Haskelish, Inspured by Scala a bunch


```ts
const OkMonad: <Err>Monad<Either<Err>> = <Err>{
    return: <X>(c: X): Either<Err, X> => Ok(c),
    map: <X, Y>(v: Either<Err, X>, op: (X) => Y) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => Ok(op(x)),
    },
    bind: <X, Y>(v: Either<Err, Z>, op: (X) => Either<Err, Z>) => switch v {
        Fail(x) => Fail(x),
        Ok(x) => op(x),
    },
}
```

Ok yeah I think I can actually think about this.

```ts
// <X> =>> Either<X, Ok>

const ErrMonad: <Ok>Monad<Either<_, Ok>> = <Ok>{
    return: <Err>(c: Err): Either<Ok, Err> => Err(c),
    map: <Err, Err2>(v: Either<Ok, Err>, op: (Err) => Err2): Either<Ok, Err2> => switch v {
        Fail(x) => Fail(ok(x)),
        Ok(x) => Ok(x),
    },
    bind: <Err, Err2>(v: Either<Err, Ok>, op: (Err) => Either<Err2, Ok>): Either<Err2, Ok> => switch v {
        Fail(x) => op(x),
        Ok(x) => Ok(x)
    },
}
```


##### Ok *I think* this is a full example that makes sense

```ts

// Are these allowed to have effects? Do we need to specify that? At what level?
// is it like `Monad{e}<T<_>>`?
// or is it just that instances can have any effect signature they want?
// so tbh we could have 3 effect variables here, one for each function.
// if we wanted to be The Most flexible.
type Monad{re, be, me}<T<_> : * -> *> = {
    return: <Item>(Item) ={re}> T<Item>, // so this one ... well I guess could be anything
    // and these could also
    bind: <Item, Changed>(T<Item>, Item ={e}> T<Changed>) ={e, be}> T<Changed>,
    // as with this.
    map:  <Item, Changed>(T<Item>, Item ={e}> Changed) ={e, me}> T<Changed>
}


// lol what even would this mean
// like what are the kinds for these things
// I guess the kinds are variables at this point?
// (ka -> kb) -> ka -> kb
// ugh polymorphic in kind? dunno if thats ok
// how do you represent it
type Awesome<A, B> = A<B>
type JustOk = Awesome<Result, string>

// Ok so haskell's KindSignatures extension allows for explicitly defining kinds
// but I'm pretty sure they don't support 'kind variables'
// so.... should I?
// like, I would guess it makes more things undecidable ...
// ok yeah lol I really should try to cut the scope creep. so much creep.
// hm ok haskell's polytypes allow that, because of course they do.
// ok so actually I want to steer clear of rank-N bonanzas. too many bonanzas.
// 

// What would be the difference between:
// when you call oHHHHHH
// ok
// so there's a difference between:
// `bind` will maintain any effects on things you give it
// and
// `bind` might call some effects and you have no clue what they are.
// maybe that's covariant and contravariant?
// so an implementation that in `bind` had some random effect, that would have to be captured in the `Monad<T>` declaration. I think. So that we can properly bubble things up? or would it? yes because we need to know what effects the `bind` call might produce.
// ok, yes.
// so having an unconstrained `{e}` on the bind declaration doesn't make sense.
// or rather, it would be impossible to call.

// Ok, so does this mean that functions that use this monad type would be unable
// confidently generate a pure version?
// well I guess it's the same story as usual. you can say you only accept pure monads, and then it's a pure function. or you can have effect variables, and then you have to CPS.



// ok co vs contra variance https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)
// solid stuff. about what subtypes are allowed.

const OkMonad: <Err>Monad{}<Result<_, Err>> = <Err>{
    return: <Ok>(c: Ok): Result<Ok, Err> ={}> Ok(c),
    map: <Ok, Ok2>(v: Result<Ok, Err>, op: (Ok) ={e}> Ok2): Result<Ok2, Err> ={e}> switch v {
        Fail(x) => Fail(x),
        Ok(x) => Ok(op(x)),
    },
    bind: <Ok, Ok2>(
        v: Result<Ok, Err>,
        op: (Ok) ={e}> Result<Ok2, Err>,
    ): Result<Ok2, Err> ={e}> switch v {
        Fail(x) => Fail(x),
        Ok(x) => op(x),
    },
}

// concrete types: no effects, no variables
// function types: effects, variables
// record / enum types: effects, variables
// IF you have an effect variable, in a function. It has to come from an argument, or from higher up. It cannot be 'universally quantified'.
// it's a little weird to declare that thought.
// right? Like how do you say "this vbl is determined from the argument here".

const doSomething: {e}(int) ={e}> float = "no way to call this"
const doSomething: {e, f}(() ={e}> int, () ={f}> float) ={e, f}> float = "ok that works"

// does that confuse things?
type Party{e} = () ={e}> int;
// vs
type Party{e} = (() ={e}> int) ={e}> int
// yeah so this is saying "when instantiating party, you need to provide this"
// as opposed to
type Party = {e}(() ={e}> int) ={e}> int

// uh wait I don't get it.
// uh yeah we gotta know whats going on here? maybe?

// Concrete! No effect variables

const throwLog: (text: string) ={Console}> int =
    (text: string) ={Console}> {raise!(Console.log(text)); 10}

// Totally variable

const callSomething: <R>{e}(fn: () ={e}> R) ={e}> R =
    <R>{e}(fn: () ={e}> R) ={e}> fn()

const callThat: () ={Console}> int =
    () ={Console}> callSomething<int>{Console}(() ={Console}> throwLog("Yes plese"))

// Things that should fail to type check:

// calling callSomething with a function that has more effects than the declared effect arg
// like, you can declare it, but it has to be at least as big as the thing.

// the thing you pass in has to be a hasname
<T: HasName>(doSomething: T) => int

// this is the kind of thing where it doesn't really make sense, right?
// type bounds on inputs are what you want. 
// You can't return a polymorphic something you weren't provided. Right?
// Is that a law somewhere?
const makeAHasT = <T: HasName>(): T => // how do I produce a T? Noone knows.

// OHH is the more general thing "You can't produce a generic value"? Yeah maybe that's it.
// And so maybe that's easy to just, check.

// Ok, so "bounds" on things maybe don't make sense? like it should just be the thing.
// and at a function's usage site, we might be instantiating some type variables.

// yeah so even

// Ok so for subtyping



type Person = {
    name: string,
    age: int
}

type Counter<T> = {
    item: T,
    count: int,
}

type Employee = {
    ...Person,
    joined: int,
}

type FancyCounter<T, E> = {
    ...Counter<T>,
    fancy: E,
}

// Type-wise, the question we need to answer is:
// When checking attribute access, what is the type of the attribute?
// this seems pretty straightforward.

// similar for sum types
type Animal =
    | Dog
    | Cat
    | Bear{teeth: int}
    | Owl(string)

// gotta do exaustiveness analysis on stuff right
// and like, that's it, right?

// ok so if I want a Person. And someone gives me an employee. is that possible?
// maybe it's just not. you have to be doing `T: Person` if you want that.
// and maybe thats ok.

type Monad{re}<T> = {
    return: <E>(v: E) ={re}> T<E>,
}
// so when I call `Thing.return<string>` where thing is a `Monad{re=0}<Option>`, I know we're getting an Option<string>, with no effects.

const MyMonad = Monad{}<Option>{
    return: <Ok>(v: Ok) ={}> Some(v),
    map: <Ok, Ok2>(v: Option<Ok>, op: (Ok) ={e}> Ok2): Option<Ok2> ={e}> switch v {
        None => None,
        Ok(x) => Ok(op(x)),
    },
    bind: <Ok, Ok2>(v: Option<Ok>, op: (Ok) ={e}> Option<Ok2>): Result<Ok2, Err> ={e}> switch v {
        None => None,
        Ok(x) => op(x),
    },
}

const MyMonad = Monad{}<Result<_, int>>{
    return: <E>(v: E): Result<E, int> ={}> Ok(v)
    // ok here we have to unify `Result<_, int><E>` with `Result<E, int>`. Which shouldn't be too bad.
}










// Ok what's my plan here.
// 

// Parse my new syntax
// translate the parse tree into a typed tree
// catching type errors
// and probably laying the groundwork for inference
// by getting variables in to place where necessary.
// What kinds of inference variables do I have?
// - type variables (which might be higher-kinded)
// - effect variables

// START HERE. I think this is a reasonable setup.

// Ok yeah first thing is to get parsing of types.
// and then parsing of terms.

















// ok so how about the `Array of things that each have their own type`

// Here's how ocaml does it:

type rec x = Hello('a, 'a => string) : x
let xs = [Hello(5, string_of_int), Hello("hi", x => x)]
let yz = Array.map((Hello(a, b)) => b(a), xs)
Js.log(yz)

// The `: x` after the constructor indicates that this is a GADT.
// but honestly I can come back to this later. if I want full gadts it'll be complicated.
// and it's probably less important than some other things?

// like, this could now be "something you can't get `value` out of as-is", right?
type Something = {
    value: T,
    toString: T => string
}
// yeah anyway let's wait on that.



type Animal = {
    name: string,
    age: int,
}

type Person = {
    ...Animal,
    phoneNumber: string,
}

const ageForUser = <T>{e}(name: string, userFinder: (string) ={e}> T<User>, :Monad<T>): T ={e}> :map{}<User, int>(userFinder(name), user ={}> user.age)

const userFinder: string ={Get<User, string>}> Result<User, string>;
ageForUser<Result<_, string>>("Yes", userFinder, OkMonad<string>)

const ListFunctor: <X>Functor<List<X>> = <X>{
    fmap: <Y>(fn: (contained: X) => Y, container: List<X>): List<Y> => list.map(fn)
}

```
