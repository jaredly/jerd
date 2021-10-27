import { Location } from '../parsing/parser-new';
import { printToString } from '../printing/printer';
import {
    termToPretty,
    toplevelToPretty,
    typeToPretty,
} from '../printing/printTsLike';
import {
    isErrorPattern,
    isErrorTerm,
    isErrorType,
    transformTerm,
    transformToplevelT,
    Visitor,
} from '../typing/auto-transform';
import { hashObject, idFromName, idName } from '../typing/env';
import { void_ } from '../typing/preset';
import { showLocation } from '../typing/typeExpr';
import {
    Id,
    EnumDef,
    EffectDef,
    Term,
    RecordDef,
    DecoratorDef,
    ToplevelT,
    Reference,
    UserTypeReference,
    TypeReference,
    ErrorTerm,
    ErrorType,
    ErrorPattern,
    Pattern,
    Type,
} from '../typing/types';
import { NamedDefns, ConstructorNames, MetaData, Context } from './Context';
import { ctxToEnv } from './migrate';
import { newContext } from './test-utils';
import { applyTypeVariablesToEnum, matchingTypeVbls } from './typeEnum';

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

export type ErrorTracker = {
    terms: Array<ErrorTerm>;
    types: Array<ErrorType>;
    patterns: Array<ErrorPattern>;
};

export const errorTracker = (): ErrorTracker => ({
    terms: [],
    types: [],
    patterns: [],
});

export const errorVisitor = (tracker: ErrorTracker): Visitor<null> => ({
    Term(node: Term) {
        if (isErrorTerm(node)) {
            tracker.terms.push(node);
        }
        return null;
    },
    Pattern(node: Pattern) {
        if (isErrorPattern(node)) {
            tracker.patterns.push(node);
        }
        return null;
    },
    Type(node: Type) {
        if (isErrorType(node)) {
            tracker.types.push(node);
        }
        return null;
    },
});

export const countErrors = (term: Term): number => {
    const tracker = errorTracker();
    transformTerm(term, errorVisitor(tracker), null);
    return (
        tracker.types.length + tracker.terms.length + tracker.patterns.length
    );
};

export const validateToplevel = (top: ToplevelT): ErrorTracker | null => {
    const tracker = errorTracker();
    transformToplevelT(top, errorVisitor(tracker), null);
    if (
        tracker.terms.length ||
        tracker.patterns.length ||
        tracker.types.length
    ) {
        return tracker;
    }
    return null;
};

// TODO: Add meta to toplevel definition
export const addToplevel = (lib: Library, top: ToplevelT, meta: MetaData) => {
    const errors = validateToplevel(top);
    if (errors != null) {
        console.log(errors.types);
        let ctx = newContext();
        let env = ctxToEnv({
            ...ctx,
            library: lib,
            bindings: {
                ...ctx.bindings,
                self: { name: 'SELF', type: void_ },
            },
        });
        console.log(
            'Term Errors:\n' +
                errors.terms
                    .map(
                        (item) =>
                            item.type +
                            ': ' +
                            printToString(termToPretty(env, item), 100) +
                            '\ntype: ' +
                            printToString(typeToPretty(env, item.is), 100) +
                            '\n' +
                            (item.type === 'TypeError'
                                ? 'found: ' +
                                  printToString(
                                      typeToPretty(env, item.inner.is),
                                      100,
                                  )
                                : ''),
                    )
                    .join('\n\n'),
        );
        console.log(errors.terms);
        console.log(errors.patterns);
        console.log(top);
        console.log(printToString(toplevelToPretty(env, top), 100));
        throw new Error(
            `Cannot add invalid toplevel to library ${showLocation(
                top.location,
            )}.`,
        );
    }

    switch (top.type) {
        case 'Define':
            return addTerm(lib, top.term, top.name, {
                ...meta,
                tags: top.tags,
            });
        case 'RecordDef':
            return addRecord(lib, top.def, top.name, top.attrNames, meta);
        case 'Effect':
            return addEffect(lib, top.effect, top.name, top.constrNames, meta);
        case 'Decorator':
            return addDecorator(lib, top.defn, top.name, meta);
        case 'EnumDef':
            top.inner.forEach((inner) => {
                // hmm metadata won't really propagate correctly here...
                // YEAH we should just embed the metadata in the toplevel
                // yes....
                [lib] = addToplevel(lib, inner, { created: meta.created });
            });
            return addEnum(lib, top.def, top.name, meta);
        default:
            throw new Error('nope');
    }
};

export const addTerm = (
    lib: Library,
    term: Term,
    name?: string,
    meta?: MetaData,
): [Library, Id] => {
    const id = idFromName(hashObject(term));
    meta = meta || { created: Date.now() };
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
                          [name]: [id].concat(lib.terms.names[name] || []),
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
    meta?: MetaData,
): [Library, Id] => {
    const id = idFromName(hashObject(effDef));
    const names = {
        ...lib.effects.constructors.names,
    };
    constrNames.forEach((name, i) => {
        names[name] = [{ id, idx: i }].concat(names[name] || []);
    });
    meta = meta || { created: Date.now() };
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
                    [name]: [id].concat(lib.effects.names[name] || []),
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

export const addEnum = (
    lib: Library,
    enu: EnumDef,
    name: string,
    meta?: MetaData,
): [Library, Id] => {
    const id = idFromName(hashObject(enu));
    if (lib.types.defns[idName(id)] != null) {
        console.warn(`Redefining record!`);
    }
    meta = meta || { created: Date.now() };
    return [
        {
            ...lib,
            types: {
                ...lib.types,
                defns: {
                    ...lib.types.defns,
                    [idName(id)]: { defn: enu, meta },
                },
                names: {
                    ...lib.types.names,
                    [name]: [id].concat(lib.types.names[name] || []),
                },
            },
        },
        id,
    ];
};

export const addDecorator = (
    lib: Library,
    dec: DecoratorDef,
    name: string,
    meta?: MetaData,
): [Library, Id] => {
    const id = idFromName(hashObject(dec));
    if (lib.types.defns[idName(id)] != null) {
        console.warn(`Redefining record!`);
    }
    meta = meta || { created: Date.now() };
    return [
        {
            ...lib,
            decorators: {
                ...lib.decorators,
                defns: {
                    ...lib.decorators.defns,
                    [idName(id)]: { defn: dec, meta },
                },
                names: {
                    ...lib.decorators.names,
                    [name]: [id].concat(lib.decorators.names[name] || []),
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
    meta?: MetaData,
): [Library, Id] => {
    const id = idFromName(hashObject(record));
    if (lib.types.defns[idName(id)] != null) {
        console.warn(`Redefining record!`);
    }
    const names = {
        ...lib.types.constructors.names,
    };
    attrNames.forEach((name, i) => {
        names[name] = [{ id, idx: i }].concat(names[name] || []);
    });
    if (attrNames.length !== record.items.length) {
        throw new Error(`Wrong number of attrNames for record definition.`);
    }
    const superTypes: Library['types']['superTypes'] = {
        ...lib.types.superTypes,
        [idName(id)]: [],
    };
    meta = meta || { created: Date.now() };
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
                    [name]: [id].concat(lib.types.names[name] || []),
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

export const typeDef = (
    library: Library,
    ref: Reference,
): null | EnumDef | RecordDef => {
    if (ref.type === 'builtin') {
        return null;
    }
    const got = library.types.defns[idName(ref.id)];
    return got ? got.defn : null;
};

export const getEnumReferences = (
    ctx: Context,
    enumRef: UserTypeReference,
    location: Location,
): Array<UserTypeReference> => {
    let enumDef = typeDef(ctx.library, enumRef.ref);
    if (enumDef == null) {
        return [];
    }
    if (enumDef.type !== 'Enum') {
        return [enumRef as UserTypeReference];
    }
    const passVbls = matchingTypeVbls(
        enumRef.typeVbls,
        enumDef.typeVbls,
        location,
    );
    enumDef = applyTypeVariablesToEnum(
        ctx,
        enumDef,
        passVbls,
        // hmm this is a selfHash? Whyy do I need it?
        // for recursive types? hmmmm
        // enumRef.ref.type === 'user' ? enumRef.ref.id.hash : undefined,
        location,
    );
    if (!enumDef.extends.length) {
        return enumDef.items;
    }
    // console.log(enumDef);
    return enumDef.items.concat(
        ...enumDef.extends.map((r) => getEnumReferences(ctx, r, location)),
    );
};
