import { hashObject, idFromName, idName } from '../typing/env';
import {
    Id,
    EnumDef,
    EffectDef,
    Term,
    RecordDef,
    DecoratorDef,
} from '../typing/types';
import { NamedDefns, ConstructorNames } from './typeFile';

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
    return [
        {
            ...lib,
            terms: {
                defns: {
                    ...lib.terms.defns,
                    [idName(id)]: term,
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
    return [
        {
            ...lib,
            effects: {
                ...lib.effects,
                defns: {
                    ...lib.effects.defns,
                    [idName(id)]: effDef,
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
    const addSupers = (id: Id, extenders: Array<Id>) => {
        extenders.forEach((inner) => {
            const nid = idName(inner);
            superTypes[nid] = superTypes[nid].concat([id]);
            const defn = lib.types.defns[nid];
            if (defn.type === 'Record' && defn.extends.length) {
                addSupers(id, defn.extends);
            }
        });
    };
    addSupers(id, record.extends);
    return [
        {
            ...lib,
            types: {
                ...lib.types,
                defns: {
                    ...lib.types.defns,
                    [idName(id)]: record,
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
