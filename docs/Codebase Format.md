# Codebase Format

What's this look like?

## V0.0 - text

gotta start somewhere.
the tslike syntax can parse & pretty print, with optional explicit content addresses.

will want to keep support for this so I can easily edit & load up test cases.

## V0.1 - json blob

This is the simplest, we just serialize the whole global `env` and call it good.
That has all terms and such.

If/when I change the types of Env things, converting code between the old & new versions can go through serialization to the tslike syntax?

I can also eval & cache non-function terms, but that might be overkill?
also it would be backend-specific probably.

## V1 - sqlite database

databases are good at things! like looking up terms that use a given term, etc.

sqlite's json_each function (https://www.sqlite.org/json1.html) can be used
to query an array.
So I would want to denormalize any term references into a toplevel array on whatever json blob I serialize. would just need to regnerate it any time I store a term in the database.

Would the database contain all of everything? and you load third-party libraries into it?
it seems like if that's the case you'd only ever have one super-database, which is what unison is doing.
This makes git a little weird.

And so of course the essential question: what do you put on github?
It could be a single text file, where you have lines starting with the hash of the contents, and then like a json-stringified value of the term.
and then at the end it would have a listing of the names and such? idk.
that way git would be at least marginally useful.


# Options for github compatability

What does git(hub) give us?
1. tracking authorship
2. tracking timestamps of changes
3. history of changed lines
4. browseable code

## just chuck the sqlite database up there, who cares

the git repos would be very large all the time, sad panda, because storing diffs would include much of the database I imagine.
we could, at the same time, render out all terms to markdown files.
So you could probably keep track of authorsip / changes / etc. by looking at the changes to the markdown files.
But the source of truth would be the sqlite database.

## each term is a file, and the name is the hash, and the contents are pretty-printed tslike

so unison is (currenty) doing the "each term is a file" thing, although they're switching to a new database format I believe. But the contents of the file is binary.

What would this look like?
- probably a toplevel manifest file indicating where to get "external" definitions. Would it list out all the definitions available from that external source? that might get a bit wordy. I think it would list all the ones you're using.
  - yeah, so this would have "source repo / location" and "list of hashes". we could also denormalize the types of the terms there, just for funs? and the name? idk. kinda might as well tbh
- and then each term would have its own file.
  - term's metadata:
    - "parent" term, if any (the term this term was edited from)
    - creation timestamp probably (this is duplicated with git? it could just be stored in the file creation timestamp, if I can edit that.)
    - creating user? (duplicate info with git tho)
  - would I still pretty-print the file to markdown? for hyperlink goodness (without having to rely on github's good graces). I mean probably best to just generate the docs directory directly.

So the neat thing about this is that git will probably track "renames" and "copies".

Ohhh mm how about pull requests?
yeah I think this still works?
