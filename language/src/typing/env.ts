// Ok

import hashObjectSum from 'hash-sum';
import {
    DecoratedExpression,
    DecoratorDef,
    Define,
    Effect,
    EnumDef,
    EnumExternal,
    EnumInternal,
    EnumSpread,
    Expression,
    Identifier,
    Location,
    RecordRow,
    RecordSpread,
    StructDef,
    Toplevel,
    Type as ParseType,
    TypeDecl,
} from '../parsing/parser';
import typeExpr, { showLocation } from './typeExpr';
import typeType, { newEnvWithTypeAndEffectVbls, newTypeVbl } from './typeType';
import {
    EffectRef,
    Env,
    getAllSubTypes,
    DecoratorDef as TypedDecoratorDef,
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
    newLocal,
    UserTypeReference,
    newWithGlobal,
    nullLocation,
    DecoratorDefArg,
    UserReference,
    ToplevelT,
    ToplevelRecord,
} from './types';
import { void_ } from './preset';
import { LocatedError, TypeError } from './errors';
import { getTypeError } from './getTypeError';
import { env } from 'process';
import { uniqueDecorator } from './typeFile';

export const addToplevelToEnv = (
    env: Env,
    top: ToplevelT,
): { env: Env; id: Id } => {
    switch (top.type) {
        case 'Define':
            return addDefine(env, top.name, top.term);
        case 'Expression':
            return addExpr(env, top.term, null);
        case 'RecordDef':
            return addRecord(env, top.name, top.attrNames, top.def);
        case 'Effect':
            return addEffect(env, top.name, top.constrNames, top.effect);
        case 'EnumDef':
            top.inner.forEach((record) => {
                ({ env } = addRecord(
                    env,
                    record.name,
                    record.attrNames,
                    record.def,
                ));
            });
            return addEnum(env, top.name, top.def);
        case 'Decorator':
            return addDecoratorToEnv(env, top.name, top.defn);
        default:
            const _x: never = top;
            throw new Error(`Unexpected toplevel type`);
    }
};

export const typeToplevelT = (
    env: Env,
    item: Toplevel,
    unique?: number | null,
): ToplevelT => {
    env = { ...env, local: newLocal() };
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
            if (!defn) {
                throw new Error(`No record defn`);
            }
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
            switch (item.wrapped.type) {
                case 'DecoratorDef': {
                    const { unique, decorators } = uniqueDecorator(
                        item.decorators,
                    );
                    if (decorators.length) {
                        throw new Error(
                            `Decorators can only have the 'unique' decorator`,
                        );
                    }
                    if (unique === null) {
                        throw new Error(`Impossible`);
                    }
                    const defn = typeDecoratorInner(env, item.wrapped, unique);
                    return {
                        type: 'Decorator',
                        defn,
                        id: idFromName(hashObject(defn)),
                        location: item.location,
                        name: item.wrapped.id.text,
                    };
                }
                case 'StructDef': {
                    const { unique, decorators } = uniqueDecorator(
                        item.decorators,
                    );
                    const ffi = decorators.filter((d) => d.id.text === 'ffi');
                    // const unum = unique != null ? unique : undefined;
                    let tag = undefined;
                    if (ffi.length) {
                        tag = item.wrapped.id.text;
                        if (ffi[0].args.length === 1) {
                            if (
                                ffi[0].args[0].type !== 'Expr' ||
                                ffi[0].args[0].expr.type !== 'string'
                            ) {
                                throw new LocatedError(
                                    item.location,
                                    `ffi arg must be a string`,
                                );
                            }
                            tag = ffi[0].args[0].expr.text;
                        } else if (ffi[0].args.length > 1) {
                            throw new Error(`@ffi only expectes one argument`);
                        }
                        if (ffi.length > 1) {
                            throw new Error(`multiple ffi decorators`);
                        }
                    }
                    if (decorators.length !== ffi.length) {
                        throw new Error(`Unhandled decorators`);
                    }
                    // env = typeTypeDefn(env, item.wrapped, tag, unum);
                    const defn = typeRecordDefn(env, item.wrapped, unique, tag);
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
                case 'Expression':
                    const term = typeExpr(env, {
                        ...item,
                        wrapped: item.wrapped.expr,
                    } as DecoratedExpression);
                    return {
                        id: idFromName(hashObject(term)),
                        type: 'Expression',
                        term,
                        location: item.location,
                    };
                case 'EnumDef': {
                    const ffi = item.decorators.filter(
                        (d) => d.id.text === 'ffi',
                    );
                    if (ffi.length) {
                        const defn = typeEnumInner(env, item.wrapped, true);
                        const hash = hashObject(defn);
                        return {
                            type: 'EnumDef',
                            def: defn.defn,
                            id: { hash, size: 1, pos: 0 },
                            location: item.location!,
                            name: item.wrapped.id.text,
                            inner: defn.inline.map(
                                (inner): ToplevelRecord => ({
                                    type: 'RecordDef',
                                    attrNames: inner.rows,
                                    name: inner.name,
                                    def: inner.defn,
                                    id: idFromName(hashObject(inner.defn)),
                                    location: inner.defn.location,
                                }),
                            ),
                        };
                    } else {
                        throw new LocatedError(
                            item.location,
                            `Unexpected decorator on enum definition`,
                        );
                    }
                }

                default:
                    console.log(item.decorators);
                    throw new Error(
                        `Decorators not supported for toplevels other than Struct and DecoratorDef (found ${item.wrapped.type})`,
                    );
            }
        }
        case 'EnumDef': {
            const defn = typeEnumInner(env, item);
            const hash = hashObject(defn);
            return {
                type: 'EnumDef',
                def: defn.defn,
                id: { hash, size: 1, pos: 0 },
                location: item.location!,
                name: item.id.text,
                inner: defn.inline.map(
                    (inner): ToplevelRecord => ({
                        type: 'RecordDef',
                        attrNames: inner.rows,
                        name: inner.name,
                        def: inner.defn,
                        id: idFromName(hashObject(inner.defn)),
                        location: inner.defn.location,
                    }),
                ),
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
        case 'DecoratorDef':
            const defn = typeDecoratorInner(env, item);
            const hash = hashObject(defn);
            return {
                type: 'Decorator',
                defn,
                id: idFromName(hash),
                location: item.location,
                name: item.id.text,
            };
        case 'Expression':
            const term = typeExpr(env, item.expr);
            return {
                id: idFromName(hashObject(term)),
                type: 'Expression',
                term,
                location: item.expr.location,
            };
    }
};

export const typeEffectInner = (env: Env, item: Effect): EffectDef => {
    const innerEnv = selfEnv(env, {
        type: 'Effect',
        name: item.id.text,
        vbls: [],
    });
    const defn: EffectDef = {
        type: 'EffectDef',
        constrs: item.constrs.map(({ type }) => {
            return {
                args: type.args
                    ? type.args.map((a) => typeType(innerEnv, a.type))
                    : [],
                ret: typeType(innerEnv, type.res),
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

export const newSym = (env: Env, name: string): Symbol => ({
    name,
    unique: env.local.unique.current++,
});

// HMMMM WHY do things not work when I run several at once,
// but they do work individually?
// I'm guessing it's the shared prelude.
// Let's try that.

export const addToMap = (
    map: { [key: string]: Array<Id> },
    name: string,
    id: Id,
) => {
    if (!map[name]) {
        map[name] = [id];
    } else if (!map[name].find((f) => idsEqual(f, id))) {
        map[name] = [id].concat(map[name]);
        // map[name].unshift(id);
    }
};

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
    // addToMap(glob.effectNames, name, id);
    if (glob.effectNames[name]) {
        // glob.effectNames[name].unshift(idName(id));
        glob.effectNames[name] = [idName(id)].concat(glob.effectNames[name]);
    } else {
        glob.effectNames[name] = [idName(id)];
    }
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

export const addDecoratorToEnv = (
    env: Env,
    name: string,
    defn: TypedDecoratorDef,
): { id: Id; env: Env } => {
    env = newWithGlobal(env.global);
    const hash = hashObject(defn);

    const id = idFromName(hash);
    if (env.global.decoratorNames[name]) {
        env.global.decoratorNames[name] = [id].concat(
            env.global.decoratorNames[name],
        );
    } else {
        env.global.decoratorNames[name] = [id];
    }
    env.global.decorators[idName(id)] = defn;
    env.global.idNames[idName(id)] = name;
    return { env, id };
};

export const typeMaybeConstantType = (env: Env, type: ParseType): Type => {
    if (
        type.type === 'TypeRef' &&
        (type.id.hash === '#builtin' || !type.id.hash) &&
        type.id.text === 'Constant' &&
        type.typeVbls &&
        type.typeVbls.length === 1
    ) {
        return {
            type: 'ref',
            ref: { type: 'builtin', name: 'Constant' },
            typeVbls: [typeType(env, type.typeVbls[0])],
            location: type.location,
        };
    }
    return typeType(env, type);
};

// TODO:
export const typeDecoratorInner = (
    env: Env,
    item: DecoratorDef,
    unique?: number,
): TypedDecoratorDef => {
    let restArg: null | any = null;
    let args: Array<DecoratorDefArg> = [];
    const { typeInner, typeVbls } = newEnvWithTypeAndEffectVbls(
        env,
        item.typeVbls || [],
        [],
    );
    if (item.args) {
        args = item.args.map((arg) => ({
            argLocation: arg.id.location,
            argName: arg.id.text,
            location: arg.location,
            type: typeMaybeConstantType(typeInner, arg.type),
        }));
    } else {
        restArg = {
            argLocation: nullLocation,
            argName: 'args',
            location: nullLocation,
            type: null,
        };
    }
    const d: TypedDecoratorDef = {
        unique: unique != null ? unique : typeInner.global.rng(),
        typeArgs: [],
        typeVbls,
        location: item.location,
        targetType: item.targetType
            ? typeMaybeConstantType(typeInner, item.targetType)
            : null,
        arguments: args,
        restArg: restArg,
    };

    return d;
};

export const typeDecoratorDef = (
    env: Env,
    item: DecoratorDef,
    unique?: number,
): { id: Id; env: Env } => {
    return addDecoratorToEnv(
        env,
        item.id.text,
        typeDecoratorInner(env, item, unique),
    );
};

export const typeTypeDefn = (
    env: Env,
    defn: StructDef,
    ffiTag?: string,
    unum?: number,
): Env => {
    return typeRecord(env, defn, ffiTag, unum).env;
};

export const typeEnumInner = (env: Env, defn: EnumDef, ffi?: boolean) => {
    const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
        env,
        defn.typeVbls,
        [], // TODO effect vbls
    );

    let typeInnerWithSelf = selfEnv(typeInner, {
        type: 'Type',
        vbls: typeVbls,
        name: defn.id.text,
    });
    // console.log('Type Enum');
    // console.log(defn.items);

    const addedTypes: Array<{
        name: string;
        rows: Array<string>;
        defn: RecordDef;
    }> = [];

    const items: Array<UserTypeReference> = (defn.items.filter(
        (x) => x.type !== 'Spread',
    ) as Array<EnumExternal | EnumInternal>).map((x) => {
        if (x.type === 'Internal') {
            const defn = typeRecordDefn(
                typeInnerWithSelf,
                {
                    type: 'StructDef',
                    id: x.id,
                    decl: x.decl,
                    typeVbls: [],
                    location: x.location,
                },
                undefined,
                ffi ? x.id.text : undefined,
            );
            const rowNames = (x.decl.items.filter(
                (r) => r.type === 'Row',
            ) as Array<RecordRow>).map((row) => row.id);
            addedTypes.push({ name: x.id.text, rows: rowNames, defn });
            // typeInnerWithSelf = nenv;
            return {
                type: 'ref',
                ref: { type: 'user', id: idFromName(hashObject(defn)) },
                typeVbls: [],
                location: x.location,
            };
        }
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
        return row as UserTypeReference;
    });
    const extend = (defn.items.filter(
        (x) => x.type === 'Spread',
    ) as Array<EnumSpread>).map((x) => {
        const sub = typeType(typeInnerWithSelf, x.ref) as UserTypeReference;
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

    return { inline: addedTypes, defn: d };
};

export const typeEnumDefn = (env: Env, defn: EnumDef, ffi?: boolean) => {
    const d = typeEnumInner(env, defn, ffi);
    d.inline.forEach((inner) => {
        ({ env } = addRecord(env, inner.name, inner.rows, inner.defn));
    });
    return addEnum(env, defn.id.text, d.defn);
};

export const addEnum = (
    env: Env,
    name: string,
    d: TypeEnumDef,
    // inner: Array<ToplevelRecord>,
): { id: Id; env: Env } => {
    const hash = hashObject(d);
    const idid = { hash, pos: 0, size: 1 };
    if (env.global.types[idName(idid)]) {
        console.warn(`Redefining ${idName(idid)}`);
    }
    const glob = cloneGlobalEnv(env.global);
    glob.types[idName(idid)] = d;
    addToMap(glob.typeNames, name, idid);
    // if (glob.typeNames[name]) {
    //     glob.typeNames[name].unshift(idid);
    // } else {
    //     glob.typeNames[name] = [idid];
    // }
    glob.idNames[idName(idid)] = name;
    return { id: idid, env: { ...env, global: glob } };
};

export const idFromName = (name: string) => ({ hash: name, size: 1, pos: 0 });
export const idName = (id: Id) => id.hash + (id.pos !== 0 ? '_' + id.pos : '');

export const refName = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : idName(ref.id);

export const resolveType = (env: Env, id: Identifier): Array<Id> => {
    if (id.hash != null) {
        const rawId = id.hash.slice(1);
        if (!env.global.types[rawId]) {
            throw new Error(`Unknown type hash ${rawId}`);
        }
        return [idFromName(rawId)];
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

// ok so ffi records don't have a unique. That's what I want.
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

    // STOPSHIP: Need to prevent people supplying two defaults
    // for the same row.
    const defaults: {
        [key: string]: { id: Id | null; idx: number; value: Term };
    } = {};
    const items = (record.items.filter(
        (r) => r.type === 'Row',
    ) as Array<RecordRow>).map((r, i) => {
        const res = typeType(typeInnerWithSelf, r.rtype);
        if (r.value) {
            const term = typeExpr(env, r.value);
            if (getEffects(term).length) {
                throw new LocatedError(
                    id.location,
                    `Record defaults can't be effectful`,
                );
            }
            defaults[`${i}`] = {
                id: null,
                idx: i,
                value: term,
            };
        }
        return res;
    });
    const extenders = (record.items.filter(
        (r) => r.type === 'Spread',
    ) as Array<RecordSpread>)
        // TODO: only allow ffi to spread into ffi, etc.
        .map((r) => {
            const t = resolveType(typeInnerWithSelf, r.constr)[0];
            const subTypes = getAllSubTypes(env.global.types, [t]);
            if (r.defaults && r.defaults.length) {
                r.defaults.forEach(({ id, value }) => {
                    // TODO: recognize hashes
                    for (let st of subTypes) {
                        const names = env.global.recordGroups[idName(st)];
                        const idx = names.indexOf(id.text);
                        if (idx !== -1) {
                            const term = typeExpr(env, value);
                            if (getEffects(term).length) {
                                throw new LocatedError(
                                    id.location,
                                    `Record defaults can't be effectful`,
                                );
                            }
                            defaults[`${idName(st)}#${idx}`] = {
                                id: st,
                                idx,
                                value: term,
                            };
                            return;
                        }
                    }
                    throw new LocatedError(
                        id.location,
                        `Unknown attribute name, doesn't match ${idName(
                            t,
                        )} or any subtypes`,
                    );
                });
            }
            return t;
        });
    // const defa

    return {
        type: 'Record',
        unique: ffiTag ? 0 : unique != null ? unique : env.global.rng(),
        typeVbls,
        location,
        effectVbls,
        ffi,
        extends: extenders,
        items: items,
        defaults: Object.keys(defaults).length ? defaults : undefined,
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
    addToMap(glob.typeNames, name, idid);
    // if (!glob.typeNames[name]) {
    //     glob.typeNames[name] = [idid];
    // } else {
    //     glob.typeNames[name].unshift(idid);
    // }
    glob.idNames[idName(idid)] = name;
    glob.recordGroups[idName(idid)] = attrNames;
    attrNames.forEach((r, i) => {
        // addToMap(glob.attributeNames, r, idid)
        if (glob.attributeNames[r]) {
            glob.attributeNames[r] = [{ id: idid, idx: i }].concat(
                glob.attributeNames[r],
            );
        } else {
            glob.attributeNames[r] = [{ id: idid, idx: i }];
        }
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

// export const withoutLocs = <T>(obj: T): T => {
//     if (!obj) {
//         return obj;
//     }
//     if (Array.isArray(obj)) {
//         return (obj as any).map(withoutLocs);
//     }
//     if (typeof obj === 'object') {
//         const res: any = {};
//         Object.keys(obj).forEach((key) => {
//             if (key === 'loc' || key === 'location' || key === 'idLocation') {
//                 return;
//             }
//             // It's a symbol, ditch it for the purposes of hashing
//             // @ts-ignore
//             if (key === 'name' && obj.unique != null) {
//                 return;
//             }
//             // Whether an attribute target was inferred or not
//             // shouldn't impact the hash.
//             // @ts-ignore
//             if (key === 'inferred' && obj.type === 'Attribute') {
//                 return;
//             }
//             // @ts-ignore
//             res[key] = withoutLocs(obj[key]);
//         });
//         return res;
//     }
//     return obj;
// };

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
            if (
                key === 'loc' ||
                key === 'location' ||
                key === 'idLocation' ||
                key === 'idLocations' ||
                key === 'argLocation' ||
                key === 'argName' ||
                key === 'argNames'
            ) {
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

export const getToplevelAnnotation = (env: Env, item: Define): Type => {
    if (item.ann) {
        return typeType(env, item.ann);
    }
    if (item.expr.type === 'lambda') {
        const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
            env,
            item.expr.typevbls,
            item.expr.effvbls,
        );

        return {
            type: 'lambda',
            args: item.expr.args.map((arg) => typeType(typeInner, arg.type)),
            argNames: item.expr.args.map((arg) => ({
                text: arg.id.text,
                location: arg.id.location,
            })),
            res: typeType(typeInner, item.expr.rettype) || void_,
            location: item.expr.location,
            typeVbls,
            effectVbls,
            effects: item.expr.effects
                ? item.expr.effects.map((effName) =>
                      resolveEffect(typeInner, effName),
                  )
                : [],
            rest: null,
        };
    }
    return void_;
};

export const typeDefineInner = (env: Env, item: Define) => {
    const tmpTypeVbls: { [key: string]: Array<TypeConstraint> } = {};
    const subEnv: Env = {
        ...env,
        // local: { ...env.local, tmpTypeVbls },
        local: { ...newLocal(), tmpTypeVbls },
        term: { nextTraceId: 0, localNames: {} },
    };

    const self: Self | null = item.rec
        ? {
              type: 'Term',
              name: item.id.text,
              ann: getToplevelAnnotation(subEnv, item),
              //   ann: item.ann ? typeType(subEnv, item.ann) : void_,
          }
        : null;

    subEnv.local.self = self;
    let term;
    try {
        term = typeExpr(subEnv, item.expr);
    } catch (err) {
        console.log(showLocation(item.location));
        throw err;
    }
    if (item.ann && self) {
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
): { hash: string; term: Term; env: Env; id: Id } => {
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
    addToMap(glob.names, item.id.text, id);
    // if (!glob.names[item.id.text]) {
    //     glob.names[item.id.text] = [id];
    // } else {
    //     glob.names[item.id.text].unshift(id);
    // }
    glob.idNames[idName(id)] = item.id.text;
    glob.terms[hash] = term;
    return { hash, term, env: { ...env, global: glob }, id };
};

export const addDefine = (
    env: Env,
    name: string,
    term: Term,
    idToOverride?: Id,
) => {
    const hash: string = hashObject(term);
    const id: Id = { hash: hash, size: 1, pos: 0 };
    const glob = cloneGlobalEnv(env.global);
    addToMap(glob.names, name, id);
    glob.idNames[idName(id)] = name;
    glob.terms[hash] = term;
    glob.metaData[hash] = {
        createdMs: Date.now(),
        tags: [],
        supersedes: idToOverride ? idName(idToOverride) : undefined,
    };
    if (idToOverride) {
        glob.metaData[idName(idToOverride)] = {
            ...(glob.metaData[idName(idToOverride)] || {
                createdMs: Date.now(),
                tags: [],
            }),
            supersededBy: hash,
        };
    }
    return { id, env: { ...env, global: glob } };
};

export const addExpr = (
    env: Env,
    term: Term,
    pid: Id | null,
): { id: Id; env: Env } => {
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
                metaData: {
                    ...env.global.metaData,
                    [hash]: {
                        createdMs: Date.now(),
                        tags: [],
                        supersedes: pid ? idName(pid) : undefined,
                    },
                    ...(pid
                        ? {
                              [idName(pid)]: {
                                  ...env.global.metaData[idName(pid)],
                                  supersededBy: idName(id),
                              },
                          }
                        : {}),
                },
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
                throw new Error(`Could not resolve effect symbol ${hash}`);
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

    if (
        env.local.self &&
        env.local.self.type === 'Effect' &&
        env.local.self.name === text
    ) {
        return {
            type: 'ref',
            location,
            ref: {
                type: 'user',
                id: { hash: '<self>', pos: 0, size: 1 },
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
            id: idFromName(env.global.effectNames[text][0]),
        },
    };
};

export const symPrefix = '#:';

export const makeLocal = (env: Env, id: Identifier, type: Type): Symbol => {
    const unique = env.local.unique.current++;
    // let max = Object.keys(env.local.locals).reduce(
    //     (max, k) => Math.max(env.local.locals[k].sym.unique, max),
    //     0,
    // );
    // const unique = max + 1; // Object.keys(env.local.locals).length;

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
        let [first, second] = hash.slice(1).split('#');

        if (first === 'builtin') {
            const type = env.global.builtins[text];
            if (!type) {
                throw new LocatedError(location, `Unknown builtin ${text}`);
            }
            return {
                type: 'ref',
                location,
                is: type,
                ref: { type: 'builtin', name: text },
            };
        }

        if (
            env.local.self &&
            env.local.self.type === 'Term' &&
            first === 'self'
        ) {
            return {
                location,
                type: 'self',
                is: env.local.self.ann,
            };
        }

        if (!env.global.terms[first]) {
            if (env.global.types[first]) {
                const id = idFromName(first);
                const t = env.global.types[idName(id)];
                if (t.type === 'Record' && !hasRequiredItems(env.global, t)) {
                    return plainRecord(env.global, id, location);
                }
            }

            const starts = Object.keys(env.global.terms).filter((k) =>
                k.startsWith(first),
            );
            if (starts.length) {
                first = starts[0];
            } else {
                throw new Error(
                    `Unknown hash ${hash} ${showLocation(location)}`,
                );
            }
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

    const candidates: Array<Term> = [];

    if (env.global.names[text]) {
        env.global.names[text].forEach((id) => {
            candidates.push({
                type: 'ref',
                location,
                is: env.global.terms[idName(id)].is,
                ref: { type: 'user', id },
            });
        });

        // const ids = env.global.names[text];
        // if (ids.length > 1) {
        //     return {
        //         type: 'Ambiguous',
        //         options: ids
        //             .filter((id) => env.global.terms[idName(id)] != null)
        //             .map((id) => ({
        //                 type: 'ref',
        //                 location,
        //                 is: env.global.terms[idName(id)].is,
        //                 ref: { type: 'user', id },
        //             })),
        //         is: { type: 'Ambiguous', location },
        //         location,
        //     };
        // }
        // const term = env.global.terms[idName(ids[0])];
        // return {
        //     type: 'ref',
        //     location,
        //     ref: {
        //         type: 'user',
        //         id: ids[0],
        //     },
        //     is: term.is,
        // };
    }

    if (env.global.builtins[text]) {
        const type = env.global.builtins[text];
        candidates.push({
            type: 'ref',
            location,
            is: type,
            ref: { type: 'builtin', name: text },
        });
    }

    if (candidates.length) {
        if (candidates.length > 1) {
            return {
                type: 'Ambiguous',
                options: candidates,
                is: { type: 'Ambiguous', location },
                location,
            };
        }
        return candidates[0];
    }

    if (env.global.typeNames[text]) {
        const id = env.global.typeNames[text][0];
        const t = env.global.types[idName(id)];
        if (t.type === 'Record') {
            // Ok, so we want to cehck the number of required items
        }
        if (t.type === 'Record' && !hasRequiredItems(env.global, t)) {
            return plainRecord(env.global, id, location);
        }
    }
    return null;
};

const hasRequiredItems = (env: GlobalEnv, defn: RecordDef): boolean => {
    if (defn.items.length === 0 && defn.extends.length === 0) {
        return false;
    }
    const defaults = defn.defaults;
    if (!defaults) {
        return true;
    }
    const own = defn.items.some((_, i) => !defaults[`${i}`]);
    if (own) {
        return true;
    }
    if (!defn.extends.length) {
        return false;
    }
    const allSubTypes = getAllSubTypes(env.types, defn.extends);
    const together = allDefaults(env, defn, allSubTypes);
    return allSubTypes.some((id) =>
        env.types[idName(id)].items.some(
            (_, i) => !together[`${idName(id)}#${i}`],
        ),
    );
};

export const allDefaults = (
    env: GlobalEnv,
    defn: RecordDef,
    allSubTypes?: Array<Id>,
) => {
    const together = { ...defn.defaults };
    if (!allSubTypes) {
        allSubTypes = getAllSubTypes(env.types, defn.extends);
    }
    allSubTypes.forEach((id) => {
        const t = env.types[idName(id)] as RecordDef;
        const inner = t.defaults;
        if (inner) {
            Object.keys(inner).forEach((k) => {
                if (inner[k].id) {
                    if (!together[k]) {
                        together[k] = inner[k];
                    }
                } else {
                    const key = `${idName(id)}#${inner[k].idx}`;
                    if (!together[key]) {
                        together[key] = {
                            ...inner[k],
                            id,
                        };
                    }
                }
            });
        }
    });
    return together;
};

const plainRecord = (env: GlobalEnv, id: Id, location: Location): Term => {
    const t = env.types[idName(id)] as RecordDef;
    const subTypes: {
        [key: string]: {
            spread: Term | null;
            covered: boolean;
            rows: Array<Term | null>;
        };
    } = {};
    getAllSubTypes(env.types, t.extends).forEach((id) => {
        const t = env.types[idName(id)] as RecordDef;
        subTypes[idName(id)] = {
            spread: null,
            rows: t.items.map((_) => null),
            covered: false,
        };
    });
    return {
        type: 'Record',
        base: {
            type: 'Concrete',
            ref: { type: 'user', id },
            rows: t.items.map((_) => null),
            location: location,
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
        subTypes,
    };
};

export const hasSubType = (env: Env, type: Type, id: Id) => {
    if (type.type === 'var') {
        const found = env.local.typeVbls[type.sym.unique];
        for (let sid of found.subTypes) {
            if (idsEqual(id, sid)) {
                return true;
            }
            const t = env.global.types[idName(sid)] as RecordDef;
            const allSubTypes = getAllSubTypes(env.global.types, t.extends);
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
    const allSubTypes = getAllSubTypes(env.global.types, t.extends);
    return allSubTypes.find((x) => idsEqual(id, x)) != null;
};
