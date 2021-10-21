```ts
// @ts-nocheck


@ffi
type GLSLScene<T> = {
    initial: T,
    step: (a: GLSLEnv<T>, b: GLSLEnv<T>, c: Array<GLSLEvent>) => T,
    render: (a: GLSLEnv<T>, c: Vec2) => Vec4,
}

/*
....

how do I do scenes that have a variable number of buffers?
Like, is this where I want explicit array lengths? I mean it kindof is.
they'd be a separate type.
which is probably fine? idk
*/

type GLSLBuffered<N: int, T> = FixedArray<N, (env: GLSLEnv<T>, pos: Vec2, buffers: FixedArray<N, sampler2d>) => Vec4>,

type GLSLSceneBuffered<N: int, T> = {
	initial: T,
	// does this make sense?
	// like, the default?
	// Also, for some things I kinda want it to be size-independent.
	// But have ... the outer thing ... be ... 
	// oRRRR it could be relative sizes? Like, 1.0 is full size, and
	// 0.1 is 1/10th the size? And all of them would be the same aspect ratio?
	// 
	sizes: <N, Vec2> = <N, _>[vec2(100.0)],
	render: GLSLBuffered<N, T>,
	// Step doesn't have access to buffers, which is as it should be.
	step: (env: GLSLEnv<T>, prev: GLSLEnv<T>, events: Array<GLSLEvent>) => T,
}

// Ok, so this would be the syntax for "inline fixed array"
<2, _>[
	(ok) => folks,
	(hm) => yeah,
]

// yeah
// ok so also, if you do <X, _>[one_thing], it's shorthand for filling the whole thing
// so that's fun.


// OOOOOOOHHHHH ok folks
// What if I had "empty shorthand"?
// Like, Nil is shorthand for "the enum variant that's nil"
// so basically
enum Sized {
	NotSized, // this is the nil version
	// this is the non-nil version
	Sized { contents: Vec2 }
}
// And so, if there's a nil (no contents) and a non-nil (contents),
// and it can be inferred from context what type you want to put there,
// you don't have to do `Sized:NotSized`, or `Sized:Sized{_: x}`, you can
// just do `Sized{_: x}` or even `x`.
// .....
// So some/none goes away at use-site, which is kinda nice.
// BUT
// how to make things generic over the now-multiplicitous Optional types?
// maybe don't? idk. Or we just define a typeclass,
@monad
enum Sized {
	NotSized,
	Sized {contents: Vec2 }
}
// Which creates
// const Monad: Monad<Sized> = {
//     pure: () => Sized::NotSized,
//     just: (t: Vec2) => Sized::Sized{contents: t}
// }
```

And so we can use `pure()` and `just()`?
like that's cool.

And then of course you can generic over those without any issues.


ok folks
hmm

ugh I think I want an in-place update syntax
but
hmmm
like `A with b.c.d = 4` to do deep updates
and what about deep type refinements?

because how do I unify fixed-length arrays and variable ones?
pleeeease?


Ok, but so what about a syntax for type refinement?
like

enum B { C, D }
type A {
	b: B
}

A with b == B::C or something? like idk.



<.., int>[1, 2, 3] // indeterminate length

```ts

const numbers = <int, 3>[1, 2, 3];
const first = numbers[0]; // statically verified indexer
const rest = numbers[1:]; // now of type Array<2, int>
const floats = <float, _>[1, 2]; // _ means "fill in please", is inferred to be 2
const indefinite = <int, ..>[1, 2, 3]; // explicitly indefinite numeric type variable
// Recursive function with explicit numeric type variable
const rec range = <N: 0..>(n: N): Array<int, N> => {
	if n == 0 {
		[]
	} else {
		[...range(n - 1), n]
	}
}
// The union of A and B is just 0.., so that's all we know
// about the returned array.
const couldBeEither = <A: 0..10, B: A + 5..>(
	flag: bool,
	one: Array<int, A>,
	two: Array<int, B>,
): Array<int, 0..> => {
	if flag { one } else { two }
}
// You can also do some arithmetic with numeric type variables
const appends = <N: 0..>(items: Array<int, N>): Array<int, N + 1> =>
	[...items, 20]



const get = <N: int, T>(array: Array<N, T>, i: 0..<N) => array[i];
const getWrapped = <T>(array: Array<.., T>, i: 0.., _: Wrap<T>) =>
	if i < len(array) {
		.wrap(get(array, i))
	} else {
		.empty // using dot-syntax, you can leave off the parens, because it's
		// assumed you're calling a function. If you want to reference the function
		// itself, spell it out.
	}
```

does that make any sense?

it's ... a rather more complex type system.
is `int` just an alias for `..`?
And would `uint` just be an alias for `0..`?
no, not really; .. can only be used for numeric type variables.
and int can only be used for normal type variables.


