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
} from './types';
import { fitsExpectation } from './unify';

export const typeEffect = (env: Env, item: Effect) => {
    const constrs = item.constrs.map(({ type }) => {
        return {
            args: type.args ? type.args.map((a) => typeType(env, a)) : [],
            ret: typeType(env, type.res),
        };
    });
    const hash: string = hashObject(constrs);
    env.global.effectNames[item.id.text] = hash;
    item.constrs.forEach((c, i) => {
        env.global.effectConstructors[item.id.text + '.' + c.id.text] = {
            idx: i,
            hash: hash,
        };
    });
    env.global.effects[hash] = constrs;
};

export const typeTypeDefn = (env: Env, { id, decl, typeVbls }: StructDef) => {
    if (decl.type === 'Record') {
        return typeRecord(env, id, typeVbls, decl);
    }
};

export const typeEnumDefn = (env: Env, defn: EnumDef) => {
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
        items,
    };
    const hash = hashObject(d);
    const idid = { hash, pos: 0, size: 1 };
    env.global.types[idName(idid)] = d;
    env.global.typeNames[defn.id.text] = idid;
    env.global.idNames[idName(idid)] = defn.id.text;
};

export const idName = (id: Id) => id.hash; // STOPSHIP incorporate other things

export const resolveType = (env: GlobalEnv, id: Identifier) => {
    if (!env.typeNames[id.text]) {
        throw new Error(`Unable to resolve type ${id.text}`);
    }
    return env.typeNames[id.text];
};

export const typeRecord = (
    env: Env,
    id: Identifier,
    typeVblsRaw: Array<TypeVbl>,
    record: RecordDecl,
) => {
    const rows = record.items.filter(
        (r) => r.type === 'Row',
    ) as Array<RecordRow>;

    // const env = typeVbls.length ? envWithTypeVbls(env, typeVbls) : env;
    const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
        env,
        typeVblsRaw,
        [],
    );

    const defn: RecordDef = {
        type: 'Record',
        unique: env.global.rng(),
        typeVbls,
        effectVbls,
        extends: record.items
            .filter((r) => r.type === 'Spread')
            .map((r) =>
                resolveType(typeInner.global, (r as RecordSpread).constr),
            ),
        items: rows.map((r) => typeType(typeInner, (r as RecordRow).rtype)),
    };
    const hash = hashObject(defn);
    const idid = { hash, pos: 0, size: 1 };
    env.global.types[idName(idid)] = defn;
    env.global.typeNames[id.text] = idid;
    env.global.idNames[idName(idid)] = id.text;
    env.global.recordGroups[idName(idid)] = rows.map((r) => r.id.text);
    rows.forEach((r, i) => {
        env.global.attributeNames[r.id.text] = { id: idid, idx: i };
    });
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
            // @ts-ignore
            res[key] = withoutLocations(obj[key]);
        });
        return res;
    }
    return obj;
};

export const typeDefine = (env: Env, item: Define) => {
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
    env.global.names[item.id.text] = id;
    env.global.idNames[idName(id)] = item.id.text;
    env.global.terms[hash] = term;
    return { hash, term };
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

export const resolveEffect = (env: Env, id: Identifier): EffectRef => {
    // TODO abstract this into "resolveEffect" probably
    if (env.local.effectVbls[id.text]) {
        return {
            type: 'var',
            sym: env.local.effectVbls[id.text],
        };
    }
    if (!env.global.effectNames[id.text]) {
        throw new Error(`No effect named ${id.text}`);
    }
    return {
        type: 'ref',
        ref: {
            type: 'user',
            id: {
                hash: env.global.effectNames[id.text],
                pos: 0,
                size: 1,
            },
        },
    };
};

// TODO type-directed resolution pleaseeeee
export const resolveIdentifier = (
    env: Env,
    { text, location, hash }: Identifier,
): Term | null => {
    if (hash != null) {
        const [first, _second] = hash.slice(1).split('#');
        if (!env.global.terms[first]) {
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
            return {
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
            };
        }
    }
    return null;
};

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
