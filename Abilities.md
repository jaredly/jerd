




# Mapping out how abilities work

So, Expressions have effects. (here are the effects required to evaluate)
Handle's provide effects.
Raise's are the source of effects.

There are a couple ways to do it.

It looks like Eff captures the state explicitly in the effect execution context.

```
instance Handler State m where
    handle st Get k = k st st
    handle st (Put n) k = k () n
```

So `put` actually creates the context ...
and ... well handlers are registered globally, which is difficult.

Ok so what unison does, is:

handle X with Y

if a handler gets triggered, it gets de-listed.
BUT when the continuation is called, all handlers above this one
in the stack are re-instantiated.

which makes sense.
the `k` that you get still expects to be able to use the
effect that you're handling.
And you definitely don't want to have to know all the effects
from the thing inside of you. it should already be handled.



```
inner f = handle !f with cases
    {One.one -> k} -> (k "inner")
    { a } -> a

outer f = handle (inner f)  with cases
    {a} -> a
    {Two.two -> k} -> handle (k "outer") with cases
        {One.one -> k} -> handle (k "outer handling inner") with cases {a} -> a
        {a} -> a

t = eq (outer '(Two.two, One.one)) ("outer", "inner")
```



















```
-- abilities

ability abilities.a_01 where
    getInt : Int

ability abilities.a_02 where
    plus5 : Int -> Int

ability abilities.a_03 where
    getTwo : Nat -> Nat -> (Nat, Nat)

-- helper functions

abilities.h_plus5 inner = cases[1]
    { a } -> [2]a
    { abilities.a_02.plus5 v -> k } -> [2]inner '([3]k (v + +5))
abilities.h_getInt v inner = cases[1]
    { a } -> [2]a
    { abilities.a_01.getInt -> k } -> [3]inner '([4]k v)
abilities.h_maybePlus5 test respond inner = cases[1]
    { a } -> [2]a
    -- woah we drop the k on the floor here :thinking-face:
    { abilities.a_02.plus5 v -> k } | [3]test v -> [4]inner '([5]respond v)

-- tests for them

abilities.f_01 = handle ([1]abilities.a_01.getInt) with cases[2]
    { a } -> [3](a, 2)
    { abilities.a_01.getInt -> k } -> [4]handle ([5]k +5) with cases[6] { a } -> [7](a, 3)
abilities.t_01 = abilities.f_01 == (+5, 3)

abilities.v_02 = handle (abilities.a_02.plus5 +6) with cases
    { a } -> (a, 1)
    { abilities.a_02.plus5 v -> k } -> handle (k (v + +5)) with cases { a } -> (a, 2)
abilities.t_02 = abilities.v_02 == (+11, 2)

abilities.v_03 = handle ((abilities.a_03.getTwo 2 4), 3) with cases
    { a } -> (a, 1)
    { abilities.a_03.getTwo 1 0 -> _ } -> (((0, 0), 0), 0)
    { abilities.a_03.getTwo a b -> k } -> handle (k (a, b)) with cases
        { a } -> (a, 2)
abilities.t_03 = abilities.v_03 == (((2, 4), 3), 2)

abilities.v_04 = 
    go m = handle !m with (abilities.h_plus5 go)
    go '(abilities.a_02.plus5 +3)
abilities.t_04 = abilities.v_04 == +8

abilities.v_05 =
    go m = handle !m with (abilities.h_maybePlus5 (_ -> true) (_ -> +4) go)
    go '(abilities.a_02.plus5 +3)
abilities.t_05 = abilities.v_05 == +4

abilities.v_06 =
    go m = handle (
        handle !m with (abilities.h_maybePlus5 (_ -> false) (_ -> +4) go)
    ) with (abilities.h_plus5 go)
    go '(abilities.a_02.plus5 +3)
abilities.t_06 = abilities.v_06 == +8

abilities.t_07 = (handle (abilities.a_02.plus5 +3) with cases
    { a } -> 3
    { abilities.a_02.plus5 v -> _ } -> 4) == 4

abilities.v_08 =
    go m = handle (
        handle !m with (abilities.h_getInt +3 go)
    ) with (abilities.h_plus5 go)
    go '(abilities.a_02.plus5 +3)
abilities.t_08 = abilities.v_08 == +8

abilities.v_09 =
    one x = (go x) + +1
    two m = (abilities.h_getInt +3 go m)
    go m = handle (
        handle !m with two
    ) with (abilities.h_plus5 go)
    one '(abilities.a_02.plus5 +3)
abilities.t_09 = abilities.v_09 == +9

-- ok, I need more abilities tests.

-- abilities.v_10 =

> abilities.t_10

abilities.v_10 = handle (let
	handle (Store.put 1) with cases { a } -> a
	Store.get) with cases
		{ a } -> a
		{ Store.get -> k } -> 500
		{ Store.put m -> k } -> handle !k with cases
			{ a } -> a
			{ Store.get -> k } -> handle k m with cases
				{ Store.get -> _ } -> 100
				{ a } -> a
abilities.t_10 = abilities.v_10 == 1

-- abilities.v_11 NAILED IT! Found a bug.
abilities.v_11 =
	answer n = cases
		{ a } -> a
		{ Ask.ask -> k } -> handle (k n) with (answer n)
	Store.withInitialValue 5 '(handle (Store.get + Ask.ask) with (answer 12))

abilities.t_11 = abilities.v_11 == 17

abilities.v_12 = Store.withInitialValue 0 'let
	handle (repeat 3 '(Store.modify (x -> x + 1))) with cases { a } -> a
	Store.get
abilities.t_12 = abilities.v_12 == 3

abilities.v_13 = Store.withInitialValue 0 'let
	handle (Store.modify (x -> x + 1)) with cases { a } -> a
	Store.get
abilities.t_13 = abilities.v_13 == 1

abilities.v_14 = Store.withInitialValue 0 'let
	handle (Store.put 1) with cases { a } -> a
	Store.get
abilities.t_14 = abilities.v_14 == 1

```