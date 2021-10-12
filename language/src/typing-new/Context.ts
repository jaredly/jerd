import { Location } from '../parsing/parser-new';
import * as typed from '../typing/types';
import { Library } from './Library';

/*
Ok, clean slate. How does this database work?

Let's lean into `toplevel`s.

types: {
    nameToId: {[key: string]: Array<Id>},
    idToType: {
        [key: string]: TypeDefn,
    }
}


*/

export type Context = {
    library: Library;
    builtins: {
        terms: {
            [key: string]: typed.Type;
        };
        types: {
            [key: string]: number; // number of type variables accepted.
        };
    };
    bindings: Bindings;
    warnings: Array<{ location: Location; text: string }>;
};

export type Bindings = {
    unique: { current: number };
    self: null | { type: typed.Type; name: string };
    values: Array<{
        location: Location;
        sym: typed.Symbol;
        type: typed.Type;
    }>;
    types: Array<{
        location: Location;
        sym: typed.Symbol;
        subTypes: Array<typed.Id>;
    }>;
    effects: Array<{ location: Location; sym: typed.Symbol }>;
};

export type ConstructorNames = {
    names: { [key: string]: Array<{ id: typed.Id; idx: number }> };
    idToNames: { [key: string]: Array<string> };
};

export type MetaData = {
    created: number;
    author?: string;
    basedOn?: typed.Id;
    deprecated?: number;
};

export type Upgrade<Payload> = {
    author?: string;
    created: number;
    message?: string;
    target: typed.Id;
    payload: Payload;
};

export type NamedDefns<Defn> = {
    // this is a cache of the other?
    // let's just keep one around. we can reconstruct the other.
    names: { [key: string]: Array<typed.Id> };
    defns: {
        [key: string]: {
            defn: Defn;
            meta: MetaData;
        };
    };
    // Ok, so let's actually think about the upgrade story.
    // I'm thinking that when I say that something "uspercedes" another,
    // I'll make you provide a conversion function.
    // Right?
    // Like, if you change a type from {name: string} to {firstName: string, lastNames: string}
    // you'll need to provide a name(newType): string
    // or maybe just a generial backwards(newType): oldType? that's a fair start
    // And if you change the signature of a function, and it doesn't have defaults,
    // then .. you provide some defaults? or some way to construct the new arguments from
    // the old arguments, more like.
    // Yeah, a (...oldArgs) => newFn(etc)
    //
    // And if you don't provide that, then there's no automatic upgrade?
    // or maybe there is ... but ... it'll result in errors that you'll have
    // to fix progressively.
    // So I think that upgrade info ... gets stored separately ...
    // Hmm, maybe like an "upgrades" um dealio
    // ok but where does information about unit tests,
    // oh and also documentation, live?
};

// START HERE: RESOLVE the type errors I just introduced by redefining NamedDefns.

// Ok, how do we do documentation?
// and tests?
// Maybe that's just derived data?
// Like, you do `@documents(Other) SomeDocLiteral`, and we collect those
// somewhere, so you can view the various doc literals that document a given thing
// And you do `@tests(Other) someTestSomeHow` and we collect those?
// We should probably have a concept of "retired" values, separate from
// upgrades ... right? like, deprecated. "don't use this"
//
// hmm does "deprecated" really capture it?
// because I really need a way to ~retire things that have been redefined.
// I mean maybe once I redefine something, if it's not in use at all,
// I just cull it? Move it to an archive library or something?
// I dunno.
// I guess it's fine to just check if the upgrades[] map has an entry for
// the given thing.
