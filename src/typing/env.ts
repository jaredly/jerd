// Ok

import hashObjectSum from 'hash-sum';
import {
    Define,
    Effect,
    EnumDef,
    Identifier,
    Location,
    RecordDecl,
    RecordRow,
    RecordSpread,
    StructDef,
    TypeVbl,
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
} from './types';
import { fitsExpectation } from './unify';

export const typeEffect = (env: Env, item: Effect): Env => {
    const constrs = item.constrs.map(({ type }) => {
        return {
            args: type.args ? type.args.map((a) => typeType(env, a)) : [],
            ret: typeType(env, type.res),
        };
    });
    const hash: string = hashObject(constrs);
    const id = { hash, size: 1, pos: 0 };
    if (env.global.effects[hash]) {
        throw new Error(
            `Redefining effect ${hash} at ${showLocation(item.id.location)}`,
        );
    }

    const glob = cloneGlobalEnv(env.global);
    glob.effectNames[item.id.text] = hash;
    glob.idNames[idName(id)] = item.id.text;
    glob.effectConstrNames[idName(id)] = item.constrs.map((c) => c.id.text);
    item.constrs.forEach((c, i) => {
        glob.effectConstructors[item.id.text + '.' + c.id.text] = {
            idx: i,
            hash: hash,
        };
    });
    glob.effects[hash] = constrs;
    return { ...env, global: glob };
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
        throw new Error(`Redefining ${idName(idid)}`);
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
    unique?: number,
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
        unique: unique || env.global.rng(),
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
    const hash = hashObject(defn);
    const idid = { hash, pos: 0, size: 1 };
    if (env.global.types[idName(idid)]) {
        throw new Error(`Redefining ${idName(idid)}`);
    }
    const glob = cloneGlobalEnv(env.global);
    glob.types[idName(idid)] = defn;
    glob.typeNames[defnRaw.id.text] = idid;
    glob.idNames[idName(idid)] = defnRaw.id.text;
    glob.recordGroups[idName(idid)] = rows.map((r) => r.id.text);
    rows.forEach((r, i) => {
        glob.attributeNames[r.id.text] = { id: idid, idx: i };
    });
    return { id: idid, env: { ...env, global: glob } };
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

export const typeDefine = (
    env: Env,
    item: Define,
): { hash: string; term: Term; env: Env } => {
    const tmpTypeVbls: { [key: string]: Array<TypeConstraint> } = {};
    const subEnv: Env = {
        ...env,
        local: { ...env.local, tmpTypeVbls },
    };

    const self = {
        name: item.id.text,
        type: item.ann ? typeType(env, item.ann) : newTypeVbl(subEnv),
    };

    subEnv.local.self = self;
    let term;
    try {
        term = typeExpr(subEnv, item.expr);
    } catch (err) {
        console.log(showLocation(item.location));
        throw err;
    }
    if (fitsExpectation(subEnv, term.is, self.type) !== true) {
        throw new Error(`Term's type doesn't match annotation`);
    }

    if (getEffects(term).length > 0) {
        throw new Error(
            `Term at ${showLocation(term.location)} has toplevel effects.`,
        );
    }

    unifyToplevel(term, tmpTypeVbls);

    const hash: string = hashObject(term);
    const id: Id = { hash: hash, size: 1, pos: 0 };
    if (env.global.terms[hash]) {
        throw new Error(
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
    if (hash != null) {
        const [first, second] = hash.slice(1).split('#');

        if (first === 'sym') {
            const unique = +second;
            let found: Type | null = null;
            Object.keys(env.local.locals).forEach((t) => {
                if (env.local.locals[t].sym.unique === unique) {
                    found = env.local.locals[t].type;
                }
            });
            if (!found) {
                throw new Error(`Could not resolve symbol`);
            }
            return {
                type: 'var',
                location,
                sym: { unique: unique, name: text },
                is: found!,
            };
        }

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

    if (env.local.locals[text]) {
        const { sym, type } = env.local.locals[text];
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
