# Platforms

very much inspired by (stealth language).

## Web Graphics Repl

This is my initial impl, a creative coding sandbox.
inspired by processing.js, and beesandbombs

### Proof of concept

We've basically got it!
But it would be nice to include some interaction (mouse position?)
Should I have a full "state" object that I pass in & update?
```ts
type State = {
  t: int,
  mouse: Pos,
  mouseButton: Option<int>,
  lastMouseButton: Option<int>,
  key: Option<string>,
  lastKey: Option<string>,
}
```

Ohh and I should be able to return a state as well, obvs.

Ok but the cool thing about this is:
- I can have a display that only cares about the timestep
- and I can have a display that does the interactivity goodness.

So none of this gets into algebraic effects territory.
And tbh real-time animation doesn't seem like a place where we want to be firing effects left and right.

## React?

Can I make an encoding of components & component functions that interops somewhat-painlessly with React?

(but how do I make use of externally-defined components? I could pretend they're builtin, and ... no I wouldn't want an any-typed or a JsValue-typed map, that would be aweful. But if I could "import a component type" from typescript-land for example, hmmmmm)

Like, jerd components are just functions of type `() ={ReactEffect}> ReactNodeThing`, and ReactNodeThing is
```ts
type ReactNodeType = {
  Builtin{name: string, props: map[string]string, children: Array<ReactNode>},
  // Props are encoded as partially applied arguments
  // does that do weird things? certainly gets in the way
  // of memoization and such.
  Custom{() ={ReactEffect}> Array<ReactNode>},
}

type ReactNode = {
  Component{type: ReactNodeType, children: Array<ReactNode>},
  Str(string),
  Null,
}>
```

I might also just make a quick & dirty something something with document.createElement or whatnot.

### Proof of concept

A counter widget w/ buttons?





## Java/ANDROID

- would love to develop some neato apps my good folks

What does this mean?
- definitely want a "draw to a canvas for fun and games"
- and a "use some nice UI wodgets"

Not sure what type shenanigans I would need to support that.
I assume not too different from the react stuff? although maybe also different.

What would the elm architecture with algebraic effects look like?
how do you cache things?
I guess you might be able to cache in a couple of places.



### Proof of concept

Minimal graphicsy thing with interaction please




## SWIFT

macOS please my good folks
- qmoji needs an upgrade
- also swift is just kind of neat
iOS maybe idk I don't love it