


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
but also, 














