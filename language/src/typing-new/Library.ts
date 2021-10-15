import { hashObject, idFromName, idName } from '../typing/env';
import {
    Id,
    EnumDef,
    EffectDef,
    Term,
    RecordDef,
    DecoratorDef,
} from '../typing/types';
import { NamedDefns, ConstructorNames, MetaData } from './Context';

/*

Thinking about DOCS

Also, this means that we could have our "this is a text cell",
but psych it's actually a Term that's a Doc literal, and we
switch on the documentation ~wsywig editor. And like, as long
as the docs literal can be transformed to markdown, we can just
edit it as markdown. Right?

OK BUT
also
we really need to be able to define type aliases.
ARE THESE just cosmetic?
I don't think so. Like, they should exist in the library.
For one thing, so that we can use an ID in docs that points
to an alias, for example.

*/

// Yeah not sure how this is going to work.

/*
What might upgrades look like?

For a record:
- adding an attribute
    Creation:
        - need to /either/ provide a default value, /or/ a way to derive it from
        other values, /or/ set the default value to "Hole" I guess, requiring
        user input at each creation site.
        - it does occur to me that it might be nice to have a semi-automated
        mode, where the system has a couple of preset upgrade modes, and the
        user is asked which one of the upgrades is appropriate for a given
        case. For example, having a default available, but allowing the user
        to override it where needed.
    Consumption:
        - nothing to do
- changed the type of an attribute, we need to both
    Creation:
        - similar to creation, but we have the option of producing the value
        directly from the previous type, or with a 


Ok, but at the end of the day:
I don't want to ~just proivide like an ID to introduce a function call
everywhere, that would produce a ton of cruft.
What I want is to provide transformer functions, which are probably essentially
macros. ... yeah.
Ok, so I don't have first-class macros quite yet ...
Ok so I think for the moment we'll stick to ... 


I'm imagining some kind of UI where you're like "I want to publicize a new version
of my library", and it goes through and checks to verify that you've specified
upgrade macros or information for everything that changed.
And if the hash of something changed, but the signature didn't and the tests didn't,
then ... you're fine? And I guess I can just check that the tests didn't by
hashing the new tests with the old term inserted...

Ok but where do these upgrades live?
Yeah, probably as their own terms, with an @upgrade decorator.

like
@upgrade(OldType, NewType)?
That can't really account for it, because we need different macros, for

// Very simple example
@upgrade.default(OldType, NewType, "newField")
someDefaultValueForNewField

ORR another way to do it, that doesn't require people to mess with macros,
which would be very nice, is you specify a function that does the transformation,
and then we opportunistically inline.

// If we're using a field that was deleted, what to do?
@upgrade.deleted(OldType, "deletedField", NewType)
(newValue: NewType): typeOfDeletedField => { ... etc ... }

^ This doesn't just have to be deleted though; it could just as well
be called `@upgrade.usage` to cover any usage of a field that's changed,
or deleted.

// This seems like it would be tricky to pull off, because in the moment you
// *don't* actually have an instance of oldValue. So this wouldn't just be an
// "opportunistically inline", it would require inlining and munging.
@upgrade.added(OldType, NewType, "newField")
(oldValue: OldType): typeOfNewField => { ... }

// This would be a lot easier; we just specify the fields from the old type
// that we're consuming, which must of necessity be present whenever we were creating
// a value of the old type.
@upgrade.added(OldType, NewType, "newField", "oldField1", "oldField2")
(oldField1: t, oldField2: t): newFieldT => { ... }


Ok so what about the case where we're changing `name` to be firstName and lastName,
how to transform instances where name was /set/?
const person2 = Person{...person1, name: "What sit"}

oooh ok so if we establish a relationship between name and firstName in @upgrade.added,
then we can leverage that, right?

And again, this will be user-assisted, not just mindlessly changing things? Maybe?
And then also we hope tests will do good things.


OK I've waited wait too long on this, fortunately the conclusion is:
I'll define upgrades as terms, which like maybe will end up on metadata,
but maybe will just be indexed as editor state or something.

*/

// export type TypeUpgrade = Term;
// export type TermUpgrade = Term;

export type SuperTypes = { [key: string]: Array<Id> };
export type Library = {
    types: NamedDefns<RecordDef | EnumDef> & {
        constructors: ConstructorNames;
        superTypes: SuperTypes;
    };
    terms: NamedDefns<Term>;
    effects: NamedDefns<EffectDef> & { constructors: ConstructorNames };
    decorators: NamedDefns<DecoratorDef>;
};

export const addTerm = (
    lib: Library,
    term: Term,
    name?: string,
): [Library, Id] => {
    const id = idFromName(hashObject(term));
    const meta: MetaData = { created: Date.now() };
    return [
        {
            ...lib,
            terms: {
                defns: {
                    ...lib.terms.defns,
                    [idName(id)]: {
                        defn: term,
                        meta,
                    },
                },
                names: name
                    ? {
                          ...lib.terms.names,
                          [name]: (lib.terms.names[name] || []).concat([id]),
                      }
                    : lib.terms.names,
            },
        },
        id,
    ];
};

export const addEffect = (
    lib: Library,
    effDef: EffectDef,
    name: string,
    constrNames: Array<string>,
): [Library, Id] => {
    const id = idFromName(hashObject(effDef));
    const names = {
        ...lib.effects.constructors.names,
    };
    constrNames.forEach((name, i) => {
        names[name] = (names[name] || []).concat({ id, idx: i });
    });
    const meta: MetaData = { created: Date.now() };
    return [
        {
            ...lib,
            effects: {
                ...lib.effects,
                defns: {
                    ...lib.effects.defns,
                    [idName(id)]: { defn: effDef, meta },
                },
                names: {
                    ...lib.effects.names,
                    [name]: (lib.effects.names[name] || []).concat([id]),
                },
                constructors: {
                    idToNames: {
                        ...lib.effects.constructors.idToNames,
                        [idName(id)]: constrNames,
                    },
                    names,
                },
            },
        },
        id,
    ];
};

export const addRecord = (
    lib: Library,
    record: RecordDef,
    name: string,
    attrNames: Array<string>,
): [Library, Id] => {
    const id = idFromName(hashObject(record));
    const names = {
        ...lib.types.constructors.names,
    };
    attrNames.forEach((name, i) => {
        names[name] = (names[name] || []).concat({ id, idx: i });
    });
    const superTypes: Library['types']['superTypes'] = {
        ...lib.types.superTypes,
        [idName(id)]: [],
    };
    const meta: MetaData = { created: Date.now() };
    const addSupers = (id: Id, extenders: Array<Id>) => {
        extenders.forEach((inner) => {
            const nid = idName(inner);
            superTypes[nid] = superTypes[nid].concat([id]);
            const { defn } = lib.types.defns[nid];
            if (defn.type === 'Record' && defn.extends.length) {
                addSupers(
                    id,
                    defn.extends.map((t) => t.ref.id),
                );
            }
        });
    };
    addSupers(
        id,
        record.extends.map((t) => t.ref.id),
    );
    return [
        {
            ...lib,
            types: {
                ...lib.types,
                defns: {
                    ...lib.types.defns,
                    [idName(id)]: { defn: record, meta },
                },
                names: {
                    ...lib.types.names,
                    [name]: (lib.types.names[name] || []).concat([id]),
                },
                constructors: {
                    idToNames: {
                        ...lib.types.constructors.idToNames,
                        [idName(id)]: attrNames,
                    },
                    names,
                },
                superTypes,
            },
        },
        id,
    ];
};
