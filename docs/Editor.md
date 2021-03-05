# Editor

So the editor will be a web page
ideally written in jerd.
and the backend will talk to it n stuff.

Thinking about this [video about rtfeldman's roc](https://www.youtube.com/watch?t=4790&v=ZnYa99QoznE), how do we want to do editor extensions?

- unison has the concept of 'associating' one term with another (used for associating a docstring with a term)
- we could associate a (something) with a Type in a library, and then the editor could notice that when we're rendering that type, and show you the alternate UI. Right?
- would definitely want to lock down the type of that, so it would be hard for plugins to misbehave.


ugh I really need to publish my literature review of structured editors.
Would a github pages site make sense? probably.
with a minimal build tool to turn markdown files into something that's interconnected.
