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
} from './types';
import { getTypeErrorOld } from './unify';
import { ToplevelT } from '../printing/printTsLike';
import { void_ } from './preset';

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
                ) as Array<RecordRow>).map((x) => x.id.text),
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
    glob.effectNames[name] = hash;
    glob.idNames[idName(id)] = name;
    glob.effectConstrNames[idName(id)] = constrNames;
    constrNames.forEach((c, i) => {
        glob.effectConstructors[name + '.' + c] = {
            idx: i,
            hash: hash,
        };
    });
    // STOPSHIP bring this in
    glob.effects[hash] = defn.constrs;
    return { env: { ...env, global: glob }, id };
};

export const typeTypeDefn = (env: Env, defn: StructDef): Env => {
    return typeRecord(env, defn).env;
};

export const typeEnumInner = (env: Env, defn: EnumDef) => {
    const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
        env,
        defn.typeVbls,
        [], // TODO effect vbls
    );

    // console.log('Type Enum');
    // console.log(defn.items);

    const items = defn.items
        .filter((x) => x.type === 'External')
        .map((x) => typeType(typeInner, x.ref) as TypeReference);
    const extend = defn.items
        .filter((x) => x.type === 'Spread')
        .map((x) => typeType(typeInner, x.ref) as TypeReference);
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
    const hash = hashObject(d);
    const idid = { hash, pos: 0, size: 1 };
    if (env.global.types[idName(idid)]) {
        console.warn(`Redefining ${idName(idid)}`);
    }
    const glob = cloneGlobalEnv(env.global);
    glob.types[idName(idid)] = d;
    glob.typeNames[defn.id.text] = idid;
    glob.idNames[idName(idid)] = defn.id.text;
    return { id: idid, env: { ...env, global: glob } };
};

export const idName = (id: Id) => id.hash; // STOPSHIP incorporate other things

export const refName = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : idName(ref.id);

export const resolveType = (env: GlobalEnv, id: Identifier) => {
    if (!env.typeNames[id.text]) {
        throw new Error(`Unable to resolve type ${id.text}`);
    }
    return env.typeNames[id.text];
};

export const typeRecordDefn = (
    env: Env,
    { decl: record, id, typeVbls: typeVblsRaw, location }: StructDef,
    unique?: number | null,
): RecordDef => {
    // const env = typeVbls.length ? envWithTypeVbls(env, typeVbls) : env;
    // console.log('RECORD', typeVblsRaw, showLocation(location));
    const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
        env,
        typeVblsRaw,
        [],
    );
    // console.log('EBLS', typeInner.local.typeVbls);

    return {
        type: 'Record',
        unique: unique != null ? unique : env.global.rng(),
        typeVbls,
        location,
        effectVbls,
        extends: record.items
            .filter((r) => r.type === 'Spread')
            .map((r) =>
                resolveType(typeInner.global, (r as RecordSpread).constr),
            ),
        items: record.items
            .filter((r) => r.type === 'Row')
            .map((r) => typeType(typeInner, (r as RecordRow).rtype)),
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
    // id: Identifier,
    // typeVblsRaw: Array<TypeVbl>,
    // record: RecordDecl,
    unique?: number,
): { id: Id; env: Env } => {
    const rows = defnRaw.decl.items.filter(
        (r) => r.type === 'Row',
    ) as Array<RecordRow>;

    const defn = typeRecordDefn(env, defnRaw, unique);
    return addRecord(
        env,
        defnRaw.id.text,
        rows.map((r) => r.id.text),
        defn,
    );

    // const hash = hashObject(defn);
    // const idid = { hash, pos: 0, size: 1 };
    // if (env.global.types[idName(idid)]) {
    //     throw new Error(`Redefining ${idName(idid)}`);
    // }
    // const glob = cloneGlobalEnv(env.global);
    // glob.types[idName(idid)] = defn;
    // glob.typeNames[defnRaw.id.text] = idid;
    // glob.idNames[idName(idid)] = defnRaw.id.text;
    // glob.recordGroups[idName(idid)] = rows.map((r) => r.id.text);
    // rows.forEach((r, i) => {
    //     glob.attributeNames[r.id.text] = { id: idid, idx: i };
    // });
    // return { id: idid, env: { ...env, global: glob } };
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

    const self = {
        name: item.id.text,
        type: item.ann ? typeType(env, item.ann) : void_,
    };

    subEnv.local.self = self;
    let term;
    try {
        term = typeExpr(subEnv, item.expr);
    } catch (err) {
        console.log(showLocation(item.location));
        throw err;
    }
    if (item.ann && getTypeErrorOld(subEnv, term.is, self.type) !== true) {
        throw new Error(`Term's type doesn't match annotation`);
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
        const [first, second] = hash.slice(1).split('#');

        if (first === 'sym') {
            const unique = +second;
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

        if (!env.global.effects[first]) {
            throw new Error(
                `Unknown effect hash ${hash} ${showLocation(location)}`,
            );
        }
        const id = { hash: first, size: 1, pos: 0 };
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
        throw new Error(`No effect named ${text}`);
    }
    return {
        type: 'ref',
        ref: {
            type: 'user',
            id: {
                hash: env.global.effectNames[text],
                pos: 0,
                size: 1,
            },
        },
    };
};

export const makeLocal = (env: Env, id: Identifier, type: Type): Symbol => {
    let max = Object.keys(env.local.locals).reduce(
        (max, k) => Math.max(env.local.locals[k].sym.unique, max),
        0,
    );
    const unique = max + 1; // Object.keys(env.local.locals).length;

    const found =
        id.hash && id.hash.startsWith('#sym#')
            ? +id.hash.slice('#sym#'.length)
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
    if (hash && hash.startsWith('#sym')) {
        const got = +hash.slice('#sym#'.length);
        if (env.local.symMapping[got] == null) {
            throw new Error(`No symbol mapping for ${got}`);
        }
        const unique = env.local.symMapping[got];
        if (!env.local.locals[unique]) {
            throw new Error(
                `Could not resolve symbol #sym#${unique} ${showLocation(
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

        // if (first === 'sym') {
        // }

        if (!env.global.terms[first]) {
            if (env.global.types[first]) {
                const id = { hash: first, size: 1, pos: 0 };
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
        const id = { hash: first, size: 1, pos: 0 };
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
    if (env.local.self && text === env.local.self.name) {
        return {
            location,
            type: 'self',
            is: env.local.self.type,
        };
    }
    if (env.global.names[text]) {
        const id = env.global.names[text];
        const term = env.global.terms[id.hash];
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
        effectVbls: [],
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
