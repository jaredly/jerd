
## Tracing!

This might belong as just a sub-topic of something else, but that's fine.

So, you can put `trace!()` around any term, and it gets traced!
What does that mean?
Well, if you're compiling with tracing enabled, then it gets added to a magicaly somethingorother.
Probably the trace!() is identified by its DFS traversal index, right? Because line/col doesn't make as much sense.
oh or I could just do a simple index. That's uh much simpler.

Ok, so with tracing enabled, we have a global `traces` object probably,
like
```ts
type Trace = {
  value: any,
  ts: number,
}
type Traces = {
  [idName: string]: Array<Array<Trace>>
}
```

Or maybe those calls just have a reference to the global trace function,
which can do whatever it wants?
That's probably a better strategy. Don't calcify too much.
so, `trace!()` becomes
`global$trace(termHash, traceIdx, ...values)`

Yeah and that's all we'll do for the moment,
but I have the sense that I'll want more complex tracing configuration,
like being able to specify what kind of data I'm tracing, so that it can be displayed nicely...
