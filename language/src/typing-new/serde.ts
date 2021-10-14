import { printToString } from '../printing/printer';
import { idFromName } from '../typing/env';
import { Id, ToplevelDefine, ToplevelT } from '../typing/types';
import { Library } from './Library';

export type TopRef = {
    id: Id;
    type: 'Define' | 'Decorator' | 'Type' | 'Effect';
};

// Ok folks, builtin annotations that we need to support:
// @meta.altName(someName)
// @meta.supercedes(otherTerm) // also does basedOn
// @meta.basedOn(otherTerm)
// @meta.createdAt(timestamp)
// @meta.glslBuiltin I guess?
// yeah maybe I'll reserve the meta. prefix for myself?
// or I mean people can always specify hash, and these will be
// #builtin

/*
Should I just have a toplevel
"Names" structure?
And then build an index ...

*/

/*
ooh uhhhhh do I allow namespaces with the same names?
like are namespaces like a first-class organizational thing?
or something?
can namespaces .. be ordered?

More importantly, can I unify the concepts of
Namespace
and Workspace?
Like, here I am editing a Namespace?
Which is like a scratch namespace,
but once I tidy it up, I can put it somewhere more permanent?
This is very appealing.
but
with workspaces,
it's been nice to be able to define something
and then let it go (close it)
also, it's nice to be able to bring in something I defined
in another workspace, to look at it.

hmmm

So maybe "close" just means "hide"
and
maybe the final, "shareable-quality" view of a namespace
isn't an ordered list of items, but rather a docstring-like
term of type Doc, named __doc__ or something.

ok, but did we still unify namespace and workspace?
I guess a question is, do we want .. to allow multiple
/views/ of the same namespace?

and

do we want a view to span several namespaces?
no, I think it's fine to be rooted in a single namespace.

ALSO namespaces can definitely nest.

Ok and also, within a namespace, names are unique? that seems like a good rule.
wait no, not necessarily. Like overloading, right? should be ok. Yeah ok we can do
an array, it's no big. Like it's technically a set, but to serialize we sort based on
date or something.

ummmmmm
should I take the leap and just use sqlite?
like, in nodejs I could use sqlite with an in-memory db
and on the web I could use sql.js
or absurd-sdl.
yeah ok so a little rabbit-holy, but now remembering
that better-sqlite3 is the way to go in nodejs.
love that the api is synchronous.
buuut
if we go to use absurd-sql, then we need to use a webworker.
which I don't love.

but maybe it's ok?
like, what things need the DB from our UI?

<>> autocomplete hm
	<>> I should benchmark the wait times on this. It's probably fine. But it wouldn't be sync
		which is probably fine?
<>> compiling obvs

I mean tbh I might want to be executing stuff in a worker too.
effects mean I can completely isolate that stuff.

is there a way ... to write things sufficiently abstracted,
such that I could have my normal js object under the hood,
OR sqlite, and either would work?
Seems like a reasonable thing to want.

...


ok obviously not right this minute.

ok also, namespaces can declare what other namespaces they know about.
like what things are imported. and maybe info on where they were got from?
could be rad.

Maybe only root namespaces would care about importing other namespaces?

Namespace {
	name: string,
	// can a namespace have only one name?
	// um.
	// maybe?

	terms {[name]: Array<{id, date, author}>}
	types {name: ...}
	decorators {name: ...}
	effects {name: ...}

	views: 
}

ok, what would the hash of a namespace be based on?
the list of IDs it contains, right?
and like the views or something.
sounds legit.

or, maybe we don't hash namespaces?
like, seems a little weird to do.
namespaces are a human-space organizational unit.
the assembler doesn't need to know anything about them.
Yeah. Namespaces map names to IDs.

OK do we denormalize the Type of a term into the namespace object?
Given that it's immutable, seems like might as well.
but we don't have to just yet. That could be a future innovation.

OK namespaces can only have one name, for now. We'll see if I want it different at some point.

but so
when you import someone's namespace
do you get all their views?
seems like they should be stored separately.

and a view ...
has to have a namespace? a primary namespace, yeah.
That's how it knows where to put named things.

and ... it can have 1 parent namespace.
right?
or should we define them the other way around.
that a parent has children.

ok, but then if you're /editing/ a namespace that appears in multiple places.
that feels weird.

I think unison had some immutable datastructure for namespaces (branches),
such that such issues wouldn't occur. but, would that result in other issues?

🤔

like the way git does ... things. somehow.

so each namespace naems its children, and is identified by
the hash of the names & child hashes.
but it doesn't name itself.
and then there's a root namespace to bind them all.

How would we store diffs?
I guess git doesn't really store diffs, but snapshots.
and then sometimes diffs, to free up space.


OOOKKKKKK we're going to just leave this alone, we're literally
building an upgrade strategy so we can mess with this kind of stuff later.
tada.


*/

// type NamedIds = {
//     [name: string]: Array<{ id: Id; date: number; author?: string }>;
// };

// type NameSpace = {
//     name: string;
//     terms: NamedIds;
//     types: NamedIds;
//     decorators: NamedIds;
//     effects: NamedIds;
//     views: {
//         [id: string]: {
//             title: string;
//             cells: {
//                 [id: string]: {
//                     // ummmmm
//                     // So.
//                     // A cell /might/ be an uncommitted thing.
//                     // Or it might be a committed thing.
//                     // If it's uncommitted.
//                     //
//                 };
//             };
//         };
//     };
// };

const toplevelDefines = (lib: Library): Array<ToplevelDefine> => {
    const namesForIds = {};
    Object.keys(lib.terms.names).forEach((name) => {
        // Do I want metadata about each name? I kinda do?
        // hmmmmmmmm. maybe I do want the arrows in the other
        // direction? hmmmmmmmmmmmm.
        // what metadata?
        // "when added" probably.
        // and who added it I think.
        // would ... namespaces ... go somewhere?
        // TO the problem of namespace clashes.
        // or rather, HOW to distinguish between
        // NS.NS.VBL
        // and
        // VBL.ATTR
        //
        // OCaml in its infinite wisdom says:
        // Namespaces start with a cap
        // variables don't.
        //
        // Rust uses : to separate namespaces.
        // one::two::three
        // and then
        // one:two .. doesn't exist maybe
        // namespaces are generally lowercased, which is interesting.
        //
        // Also, Enums use :: as well! So it's a pseudo-namespace.
        // And what happens if you try to do both? It's a clash!
        // So there's that at least.
        //
        // But, the rust compiler will #warn you if you have
        // an enum that's not UpperCamel, or if you have a module
        // that's not lower_snake
        //
        // so like, why not just enforce it?
        // I guess it's confusing/annoying for folks that are writing a bunch
        // of stuff?
        //
        // like, no one likes it when the compiler tells you you're doing it wrong.
        // especially if you're just naming something.
        //
        // but anyway, back to the story at hand.
        // it does seem like rust picked the right battle.
        // the "is this a module or an enum" resolution seems
        // like an easier games than "is this a variable or a module"
        // ok but anyway.
        //
        // Moving a module around, shouldn't require re-naming all of the things
        // in that module.
        // So we shouldn't just store things as name: "a::b::c::d"
        // Instead, we want something like
        // oh, do we just say "modules can point to terms"
        // and terms get to define their names?
        // Is it important that modules get control over the "default name"
        // of the thing inside of them?
        // It seems like it might be a good idea.
        // hmmm.
        lib.terms.names[name].forEach((id) => {});
    });
    return Object.keys(lib.terms.defns).map((k) => ({
        type: 'Define',
        id: idFromName(k),
        location: lib.terms.defns[k].defn.location,
        name: lib.terms.n,
    }));
};

const allTopLevels = (lib: Library): Array<ToplevelT> => {};

const libraryToSyntax = (lib: Library) => {
    // Order of potential dependencies:
    // types before terms ... well except
    // for default values 🤦‍♂️
    // Ok, so types can depend on terms
    // and terms on types
    // and both on decorators
    // and decorators can depend on types,
    // and by extension terms
    printToString(printter);
};
