// Ok

import hashObjectSum from 'hash-sum';
import {
    Define,
    Effect,
    EnumDef,
    Expression,
    Identifier,
    Location,
    RecordRow,
    RecordSpread,
    StructDef,
    Toplevel,
} from '../parsing/parser';
import typeExpr, { showLocation } from './typeExpr';
import typeType, { newEnvWithTypeAndEffectVbls, newTypeVbl } from './typeType';
import {
    EffectRef,
    Env,
    getAllSubTypes,
    getEffects,
    GlobalEnv,
    Id,
    idsEqual,
    RecordDef,
    Term,
    Type,
    TypeConstraint,
    EnumDef as TypeEnumDef,
    TypeReference,
    Reference,
    Symbol,
    cloneGlobalEnv,
    EffectDef,
    Self,
    selfEnv,
} from './types';
import { ToplevelT } from '../printing/printTsLike';
import { void_ } from './preset';
import { LocatedError, TypeError } from './errors';
import { getTypeError } from './getTypeError';

export const typeToplevelT = (
    env: Env,
    item: Toplevel,
    unique?: number | null,
): ToplevelT => {
    switch (item.type) {
        case 'define': {
            // TODO type annotation
            const term = typeDefineInner(env, item);
            const hash = hashObject(term);
            const id = { hash, size: 1, pos: 0 };
            return {
                type: 'Define',
                id,
                term,
                location: item.location,
                name: item.id.text,
            };
        }
        case 'StructDef': {
            const defn = typeRecordDefn(env, item, unique);
            const hash = hashObject(defn);
            return {
                type: 'RecordDef',
                def: defn,
                id: { hash, size: 1, pos: 0 },
                location: item.location!,
                name: item.id.text,
                attrNames: (item.decl.items.filter(
                    (x) => x.type === 'Row',
                ) as Array<RecordRow>).map((x) => x.id),
            };
        }
        case 'Decorated': {
            if (item.decorators[0].id.text !== 'ffi') {
                throw new LocatedError(item.location, `Unexpected decorated`);
            }
            if (item.wrapped.type !== 'StructDef') {
                throw new Error(`@ffi can only be applied to RecordDef`);
            }
            const tag =
                item.decorators[0].args.length === 1
                    ? typeExpr(env, item.decorators[0].args[0])
                    : null;
            if (tag && tag.type !== 'string') {
                throw new Error(`ffi tag must be a string literal`);
            }
            const defn = typeRecordDefn(
                env,
                item.wrapped,
                unique,
                tag ? tag.type : item.wrapped.id.text,
            );
            const hash = hashObject(defn);
            return {
                type: 'RecordDef',
                def: defn,
                id: { hash, size: 1, pos: 0 },
                location: item.location!,
                name: item.wrapped.id.text,
                attrNames: (item.wrapped.decl.items.filter(
                    (x) => x.type === 'Row',
                ) as Array<RecordRow>).map((x) => x.id),
            };
        }
        case 'EnumDef': {
            const defn = typeEnumInner(env, item);
            const hash = hashObject(defn);
            return {
                type: 'EnumDef',
                def: defn,
                id: { hash, size: 1, pos: 0 },
                location: item.location!,
                name: item.id.text,
            };
        }
        case 'effect': {
            const defn = typeEffectInner(env, item);
            const hash = hashObject(defn);
            return {
                type: 'Effect',
                effect: defn,
                location: defn.location,
                id: { hash, size: 1, pos: 0 },
                name: item.id.text,
                constrNames: item.constrs.map((c) => c.id.text),
            };
        }
        default:
            const term = typeExpr(env, item as Expression);
            return {
                type: 'Expression',
                term,
                location: item.location,
            };
    }
};

export const typeEffectInner = (env: Env, item: Effect): EffectDef => {
    const defn: EffectDef = {
        type: 'EffectDef',
        constrs: item.constrs.map(({ type }) => {
            return {
                args: type.args ? type.args.map((a) => typeType(env, a)) : [],
                ret: typeType(env, type.res),
            };
        }),
        location: item.location,
    };

    return defn;
};

export const typeEffect = (env: Env, item: Effect): Env => {
    const defn = typeEffectInner(env, item);

    return addEffect(
        env,
        item.id.text,
        item.constrs.map((c) => c.id.text),
        defn,
    ).env;
};

// export const addToplevel = (
//     env: Env,
//     item: ToplevelT
// ): {env: Env, id: Id} => {

// }

export const addEffect = (
    env: Env,
    name: string,
    constrNames: Array<string>,
    defn: EffectDef,
) => {
    const hash: string = hashObject(defn);
    const id = { hash, size: 1, pos: 0 };
    if (env.global.effects[hash]) {
        console.warn(
            `Redefining effect ${hash} at ${showLocation(defn.location)}`,
        );
    }

    const glob = cloneGlobalEnv(env.global);
    glob.effectNames[name] = idName(id);
    glob.idNames[idName(id)] = name;
    glob.effectConstrNames[idName(id)] = constrNames;
    constrNames.forEach((c, i) => {
        glob.effectConstructors[name + '.' + c] = {
            idx: i,
            idName: idName(id),
        };
    });
    glob.effects[hash] = defn.constrs;
    return { env: { ...env, global: glob }, id };
};

export const typeTypeDefn = (
    env: Env,
    defn: StructDef,
    ffiTag?: string,
): Env => {
    return typeRecord(env, defn, ffiTag).env;
};

export const typeEnumInner = (env: Env, defn: EnumDef) => {
    const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
        env,
        defn.typeVbls,
        [], // TODO effect vbls
    );

    const typeInnerWithSelf = selfEnv(typeInner, {
        type: 'Type',
        vbls: typeVbls,
        name: defn.id.text,
    });
    // console.log('Type Enum');
    // console.log(defn.items);

    const items = defn.items
        .filter((x) => x.type === 'External')
        .map((x) => {
            const row = typeType(typeInnerWithSelf, x.ref);
            if (row.type !== 'ref') {
                throw new Error(`Cannot have a ${row.type} as an enum item.`);
            }
            if (row.ref.type !== 'user') {
                throw new Error(`Cannot have a builtin as an enum item.`);
            }
            const t = env.global.types[idName(row.ref.id)];
            if (t.type !== 'Record') {
                throw new Error(
                    `${idName(row.ref.id)} is an enum. use ...spread syntax.`,
                );
            }
            return row as TypeReference;
        });
    const extend = defn.items
        .filter((x) => x.type === 'Spread')
        .map((x) => {
            const sub = typeType(typeInnerWithSelf, x.ref) as TypeReference;
            return sub;
        });
    // console.log(items.length, extend.length);
    const d: TypeEnumDef = {
        type: 'Enum',
        typeVbls,
        effectVbls,
        extends: extend,
        location: defn.location,
        items,
    };

    return d;
};

export const typeEnumDefn = (env: Env, defn: EnumDef) => {
    const d = typeEnumInner(env, defn);
    return addEnum(env, defn.id.text, d);
};

export const addEnum = (
    env: Env,
    name: string,
    d: TypeEnumDef,
): { id: Id; env: Env } => {
    const hash = hashObject(d);
    const idid = { hash, pos: 0, size: 1 };
    if (env.global.types[idName(idid)]) {
        console.warn(`Redefining ${idName(idid)}`);
    }
    const glob = cloneGlobalEnv(env.global);
    glob.types[idName(idid)] = d;
    glob.typeNames[name] = idid;
    glob.idNames[idName(idid)] = name;
    return { id: idid, env: { ...env, global: glob } };
};

export const idFromName = (name: string) => ({ hash: name, size: 1, pos: 0 });
export const idName = (id: Id) => id.hash + (id.pos !== 0 ? '_' + id.pos : '');

export const refName = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : idName(ref.id);

export const resolveType = (env: Env, id: Identifier): Id => {
    if (id.hash != null) {
        const rawId = id.hash.slice(1);
        if (!env.global.types[rawId]) {
            throw new Error(`Unknown type hash ${rawId}`);
        }
        return idFromName(rawId);
    }
    // if (
    //     env.local.self &&
    //     env.local.self.type === 'Type' &&
    //     id.text === env.local.self.name
    // ) {
    //     throw new Error(`Can't resolve`)
    //     // return env.local.self.id;
    // }
    if (!env.global.typeNames[id.text]) {
        throw new Error(`Unable to resolve type ${id.text}`);
    }
    return env.global.typeNames[id.text];
};

export const typeRecordDefn = (
    env: Env,
    { decl: record, id, typeVbls: typeVblsRaw, location }: StructDef,
    unique?: number | null,
    ffiTag?: string,
): RecordDef => {
    const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
        env,
        typeVblsRaw,
        [],
    );

    const typeInnerWithSelf = selfEnv(typeInner, {
        type: 'Type',
        vbls: typeVbls,
        name: id.text,
    });

    const ffi = ffiTag
        ? {
              tag: ffiTag,
              names: record.items
                  .filter((r) => r.type === 'Row')
                  .map((r) => (r as RecordRow).id),
          }
        : null;

    return {
        type: 'Record',
        unique: unique != null ? unique : env.global.rng(),
        typeVbls,
        location,
        effectVbls,
        ffi,
        extends: record.items
            .filter((r) => r.type === 'Spread')
            // TODO: only allow ffi to spread into ffi, etc.
            .map((r) =>
                resolveType(typeInnerWithSelf, (r as RecordSpread).constr),
            ),
        items: record.items
            .filter((r) => r.type === 'Row')
            .map((r) => typeType(typeInnerWithSelf, (r as RecordRow).rtype)),
    };
};

export const addRecord = (
    env: Env,
    name: string,
    attrNames: Array<string>,
    defn: RecordDef,
): { id: Id; env: Env } => {
    const hash = hashObject(defn);
    const idid = { hash, pos: 0, size: 1 };
    if (env.global.types[idName(idid)]) {
        console.warn(`Redefining ${idName(idid)}`);
    }
    const glob = cloneGlobalEnv(env.global);
    glob.types[idName(idid)] = defn;
    glob.typeNames[name] = idid;
    glob.idNames[idName(idid)] = name;
    glob.recordGroups[idName(idid)] = attrNames;
    attrNames.forEach((r, i) => {
        glob.attributeNames[r] = { id: idid, idx: i };
    });
    return { id: idid, env: { ...env, global: glob } };
};

export const typeRecord = (
    env: Env,
    defnRaw: StructDef,
    ffiTag?: string,
    // id: Identifier,
    // typeVblsRaw: Array<TypeVbl>,
    // record: RecordDecl,
    unique?: number,
): { id: Id; env: Env } => {
    const rows = defnRaw.decl.items.filter(
        (r) => r.type === 'Row',
    ) as Array<RecordRow>;

    const defn = typeRecordDefn(env, defnRaw, unique, ffiTag);
    return addRecord(
        env,
        defnRaw.id.text,
        rows.map((r) => r.id),
        defn,
    );
};

export const hashObject = (obj: any): string =>
    hashObjectSum(withoutLocations(obj));

export const withoutLocations = <T>(obj: T): T => {
    if (!obj) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return (obj as any).map(withoutLocations);
    }
    if (typeof obj === 'object') {
        const res: any = {};
        Object.keys(obj).forEach((key) => {
            if (key === 'location') {
                return;
            }
            // It's a symbol, ditch it for the purposes of hashing
            // @ts-ignore
            if (key === 'name' && obj.unique != null) {
                return;
            }
            // Whether an attribute target was inferred or not
            // shouldn't impact the hash.
            // @ts-ignore
            if (key === 'inferred' && obj.type === 'Attribute') {
                return;
            }
            // @ts-ignore
            res[key] = withoutLocations(obj[key]);
        });
        return res;
    }
    return obj;
};

export const typeDefineInner = (env: Env, item: Define) => {
    const tmpTypeVbls: { [key: string]: Array<TypeConstraint> } = {};
    const subEnv: Env = {
        ...env,
        local: { ...env.local, tmpTypeVbls },
    };

    const self: Self = {
        type: 'Term',
        name: item.id.text,
        ann: item.ann ? typeType(env, item.ann) : void_,
    };

    subEnv.local.self = self;
    let term;
    try {
        term = typeExpr(subEnv, item.expr);
    } catch (err) {
        console.log(showLocation(item.location));
        throw err;
    }
    if (item.ann) {
        const err = getTypeError(subEnv, term.is, self.ann, item.location);
        if (err != null) {
            throw new TypeError(`Term's type doesn't match annotation`).wrap(
                err,
            );
        }
    }

    if (getEffects(term).length > 0) {
        throw new Error(
            `Term at ${showLocation(term.location)} has toplevel effects.`,
        );
    }

    unifyToplevel(term, tmpTypeVbls);

    return term;
};

export const typeDefine = (
    env: Env,
    item: Define,
): { hash: string; term: Term; env: Env } => {
    const term = typeDefineInner(env, item);

    const hash: string = hashObject(term);
    const id: Id = { hash: hash, size: 1, pos: 0 };
    if (env.global.terms[hash]) {
        console.warn(
            `Redefining ${hash} at ${showLocation(
                item.location,
            )} (previous at ${showLocation(env.global.terms[hash].location)})`,
        );
    }
    const glob = cloneGlobalEnv(env.global);
    glob.names[item.id.text] = id;
    glob.idNames[idName(id)] = item.id.text;
    glob.terms[hash] = term;
    return { hash, term, env: { ...env, global: glob } };
};

export const addDefine = (env: Env, name: string, term: Term) => {
    const hash: string = hashObject(term);
    const id: Id = { hash: hash, size: 1, pos: 0 };
    const glob = cloneGlobalEnv(env.global);
    glob.names[name] = id;
    glob.idNames[idName(id)] = name;
    glob.terms[hash] = term;
    return { id, env: { ...env, global: glob } };
};

export const addExpr = (env: Env, term: Term) => {
    const hash = hashObject(term);
    const id: Id = { hash: hash, size: 1, pos: 0 };
    if (env.global.terms[hash]) {
        console.warn(`Redefining ${hash}`);
    }
    return {
        id,
        env: {
            ...env,
            global: {
                ...env.global,
                terms: { ...env.global.terms, [hash]: term },
            },
        },
    };
};

const unifyToplevel = (
    term: Term,
    typeVbls: { [key: string]: Array<TypeConstraint> },
) => {
    // // Ok so we need to be able to handle second- and nth-level
    // // indirection I imagine.
    // // hmm
    // // is this where things get undecidable?
    // // I mean, how bad could it get?
    // // for (let key of Object.keys(typeVbls)) {
    // //     unified[key] = typeVbls[key].reduce(unify, null);
    // // }
    // const unified = unifyVariables(tmpTypeVbls);
    // // let didChange = true;
    // // let iter = 0;
    // // while (didChange) {
    // //     if (iter++ > 100) {
    // //         throw new Error(
    // //             `Something is a miss in the state of unification.`,
    // //         );
    // //     }
    // //     didChange = false;
    // //     Object.keys(unified).forEach((id) => {
    // //         const t = unified[id];
    // //         if (t != null) {
    // //             const changed = unifyInType(unified, t);
    // //             if (changed != null) {
    // //                 // console.log(
    // //                 //     `${JSON.stringify(
    // //                 //         unified[id],
    // //                 //         null,
    // //                 //         2,
    // //                 //     )}\n==>\n${JSON.stringify(changed, null, 2)}`,
    // //                 // );
    // //                 didChange = true;
    // //                 unified[id] = changed;
    // //             }
    // //         }
    // //     });
    // // }
    // if (Object.keys(unified).length) {
    //     console.log(unified);
    //     unifyInTerm(unified, term);
    //     // self.type = unifyInType(unified, self.type) || self.type;
    // }
};

export const resolveEffect = (
    env: Env,
    { text, location, hash }: Identifier,
): EffectRef => {
    if (hash != null) {
        if (hash.startsWith(symPrefix)) {
            const unique = +hash.slice(symPrefix.length);
            let found: Symbol | null = null;
            Object.keys(env.local.effectVbls).forEach((t) => {
                if (env.local.effectVbls[t].unique === unique) {
                    found = env.local.effectVbls[t];
                }
            });
            if (!found) {
                throw new Error(`Could not resolve effect symbol`);
            }
            return {
                type: 'var',
                location,
                sym: found,
            };
        }

        const [first, second] = hash.slice(1).split('#');

        if (!env.global.effects[first]) {
            throw new Error(
                `Unknown effect hash ${hash} ${showLocation(location)}`,
            );
        }
        const id = idFromName(first);
        return {
            type: 'ref',
            location,
            ref: {
                type: 'user',
                id,
            },
        };
    }

    // TODO abstract this into "resolveEffect" probably
    if (env.local.effectVbls[text]) {
        return {
            type: 'var',
            sym: env.local.effectVbls[text],
        };
    }
    if (!env.global.effectNames[text]) {
        throw new LocatedError(location, `No effect named ${text}`);
    }
    return {
        type: 'ref',
        ref: {
            type: 'user',
            id: idFromName(env.global.effectNames[text]),
        },
    };
};

export const symPrefix = '#:';

export const makeLocal = (env: Env, id: Identifier, type: Type): Symbol => {
    let max = Object.keys(env.local.locals).reduce(
        (max, k) => Math.max(env.local.locals[k].sym.unique, max),
        0,
    );
    const unique = max + 1; // Object.keys(env.local.locals).length;

    const found =
        id.hash && id.hash.startsWith(symPrefix)
            ? +id.hash.slice(symPrefix.length)
            : null;
    if (found != null) {
        env.local.symMapping[found] = unique;
    }

    const sym: Symbol = { name: id.text, unique };
    // env.local.locals[id.text] = { sym, type };
    env.local.locals[unique] = { sym, type };
    env.local.localNames[id.text] = unique;
    return sym;
};

// export const resolveTypeID = (
//     env: Env,
//     { text, location, hash }: Identifier,
// ): Type | null => {

// };

// TODO type-directed resolution pleaseeeee
export const resolveIdentifier = (
    env: Env,
    { text, location, hash }: Identifier,
): Term | null => {
    if (hash && hash.startsWith(symPrefix)) {
        const got = +hash.slice(symPrefix.length);
        if (env.local.symMapping[got] == null) {
            throw new Error(`No symbol mapping for ${got}`);
        }
        const unique = env.local.symMapping[got];
        if (!env.local.locals[unique]) {
            throw new Error(
                `Could not resolve symbol ${symPrefix}${unique} ${showLocation(
                    location,
                )}`,
            );
        }
        const { sym, type } = env.local.locals[unique];
        return {
            type: 'var',
            location,
            sym: sym,
            is: type,
        };
    } else if (hash != null) {
        const [first, second] = hash.slice(1).split('#');

        if (!env.global.terms[first]) {
            if (env.global.types[first]) {
                const id = idFromName(first);
                const t = env.global.types[idName(id)];
                if (
                    t.type === 'Record' &&
                    t.items.length === 0 &&
                    t.extends.length === 0
                ) {
                    return plainRecord(id, location);
                }
            }

            throw new Error(`Unknown hash ${hash} ${showLocation(location)}`);
        }
        const id = idFromName(first);
        const term = env.global.terms[first];
        return {
            type: 'ref',
            location,
            ref: {
                type: 'user',
                id,
            },
            is: term.is,
        };
    }

    if (env.local.localNames[text] != null) {
        const { sym, type } = env.local.locals[env.local.localNames[text]];
        return {
            type: 'var',
            location,
            sym,
            is: type,
        };
    }
    if (
        env.local.self &&
        env.local.self.type === 'Term' &&
        text === env.local.self.name
    ) {
        return {
            location,
            type: 'self',
            is: env.local.self.ann,
        };
    }
    if (env.global.names[text]) {
        const id = env.global.names[text];
        const term = env.global.terms[idName(id)];
        // console.log(`${text} : its a global: ${showType(env, term.is)}`);
        return {
            type: 'ref',
            location,
            ref: {
                type: 'user',
                id,
            },
            is: term.is,
        };
    }
    if (env.global.builtins[text]) {
        const type = env.global.builtins[text];
        return {
            type: 'ref',
            location,
            is: type,
            ref: { type: 'builtin', name: text },
        };
    }
    if (env.global.typeNames[text]) {
        const id = env.global.typeNames[text];
        const t = env.global.types[idName(id)];
        if (
            t.type === 'Record' &&
            t.items.length === 0 &&
            t.extends.length === 0
        ) {
            return plainRecord(id, location);
        }
    }
    return null;
};

const plainRecord = (id: Id, location: Location): Term => ({
    type: 'Record',
    base: {
        type: 'Concrete',
        ref: { type: 'user', id },
        rows: [],
        spread: null,
    },
    location,
    is: {
        type: 'ref',
        ref: { type: 'user', id },
        location,
        typeVbls: [],
        // effectVbls: [],
    },
    subTypes: {},
});

export const hasSubType = (env: Env, type: Type, id: Id) => {
    if (type.type === 'var') {
        const found = env.local.typeVbls[type.sym.unique];
        for (let sid of found.subTypes) {
            if (idsEqual(id, sid)) {
                return true;
            }
            const t = env.global.types[idName(sid)] as RecordDef;
            const allSubTypes = getAllSubTypes(env.global, t);
            if (allSubTypes.find((x) => idsEqual(id, x)) != null) {
                return true;
            }
        }
    }
    if (type.type !== 'ref' || type.ref.type === 'builtin') {
        return false;
    }
    if (idsEqual(type.ref.id, id)) {
        return true;
    }
    const t = env.global.types[idName(type.ref.id)] as RecordDef;
    const allSubTypes = getAllSubTypes(env.global, t);
    return allSubTypes.find((x) => idsEqual(id, x)) != null;
};
