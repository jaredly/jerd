import { Identifier, Type, TypeRef, TypeVbl } from '../parsing/parser-new';
import { Bindings, Context } from './typeFile';
import * as t from '../typing/types';
import { parseIdOrSym, parseSym } from './hashes';
import { resolveEffectId, resolveType, resolveTypeId } from './resolve';
import { getAllSubTypes } from './utils';
import { idName } from '../typing/env';
import { Id } from '../typing/types';

export const typeTypeRef = (ctx: Context, type: TypeRef): t.Type => {
    const vbls = type.typeVbls
        ? type.typeVbls.inner.items.map((item) => typeType(ctx, item))
        : [];
    const options: Array<{
        vbls: Array<Array<t.Id>>;
        ref: t.Reference;
    }> = [];
    if (type.id.hash === '#builtin') {
        if (ctx.builtins.types[type.id.text] != null) {
            const decls: Array<Array<t.Id>> = [];
            for (let i = 0; i < ctx.builtins.types[type.id.text]; i++) {
                decls.push([]);
            }
            options.push({
                vbls: decls,
                ref: { type: 'builtin', name: type.id.text },
            });

            // if (vbls.length !== ctx.builtins.types[type.id.text]) {
            // 	// Ok we don't fall through / recover if this is abuiltin, we just assume something is wrong.
            // 	return {
            // 		type: 'InvalidTypeApplication',
            // 		inner: {type: 'ref', location: type.location, ref: {type: 'builtin', name: type.id.text}, typeVbls: []},
            // 		location: type.location,
            // 		typeVbls: vbls
            // 	}
            // }
        }
        // return {
        // 	type: 'ref',
        // 	location: type.location,
        // 	ref: {type: 'builtin', name: type.id.text},
        // 	typeVbls: vbls,
        // }
    }

    if (type.id.hash) {
        const parsed = parseIdOrSym(type.id.hash.slice(1));
        const resolved = parsed && resolveType(ctx, parsed, type.location);
        if (resolved) {
            if (resolved.type === 'var') {
                const inner: t.Type = {
                    type: 'var',
                    location: type.location,
                    sym: resolved.binding.sym,
                };
                if (vbls.length) {
                    return {
                        type: 'InvalidTypeApplication',
                        inner,
                        location: type.location,
                        typeVbls: vbls,
                    };
                }
                return inner;
            } else {
                options.push({
                    ref: { type: 'user', id: resolved.id },
                    vbls: resolved.typeVbls.map((decl) => decl.subTypes),
                });
            }
        }
    }

    for (let binding of ctx.bindings.types) {
        if (type.id.text === binding.sym.name) {
            const inner: t.Type = {
                type: 'var',
                location: type.location,
                sym: binding.sym,
            };
            if (vbls.length) {
                return {
                    type: 'InvalidTypeApplication',
                    inner,
                    location: type.location,
                    typeVbls: vbls,
                };
            }
            return inner;
        }
    }

    for (let id of ctx.library.types.names[type.id.text] || []) {
        const decl = ctx.library.types.defns[idName(id)];
        options.push({
            ref: { type: 'user', id },
            vbls: decl.typeVbls.map((v) => v.subTypes),
        });
    }

    for (let option of options) {
        if (typeVariablesMatch(ctx, option.vbls, vbls)) {
            return {
                type: 'ref',
                ref: option.ref,
                location: type.location,
                typeVbls: vbls,
            };
        }
    }

    if (!options.length) {
        return {
            type: 'NotFound',
            text: type.id.text,
            location: type.location,
        };
    }

    const typeVbls = options[0].vbls.map(
        (subTypes, i): t.Type => {
            if (vbls.length <= i) {
                return { type: 'Hole', location: type.location };
            }
            if (!subTypes.length) {
                return vbls[i];
            }
            const vi = vbls[i];
            if (vi.type !== 'ref' || vi.ref.type !== 'user') {
                return {
                    type: 'NotASubType',
                    subTypes,
                    inner: vi,
                    location: vi.location,
                };
            }

            const id = vi.ref.id;
            if (
                subTypes.some(
                    (sub) =>
                        !ctx.library.types.superTypes[idName(sub)].some((sid) =>
                            t.idsEqual(sid, id),
                        ),
                )
            ) {
                return {
                    type: 'NotASubType',
                    subTypes,
                    inner: vi,
                    location: vi.location,
                };
            }
            return vi;
        },
    );

    const inner: t.Type = {
        type: 'ref',
        typeVbls,
        ref: options[0].ref,
        location: type.location,
    };
    if (options[0].vbls.length >= vbls.length) {
        return inner;
    }

    return {
        type: 'InvalidTypeApplication',
        location: type.location,
        inner,
        typeVbls: vbls.slice(options[0].vbls.length),
    };
};

// const matches = typeVariablesMatch(ctx, resolved.typeVbls, vbls)
// const inner: t.Type = {
// 	type: 'ref',
// 	location: type.location,
// 	ref: {type: 'user', id: resolved.id},
// 	typeVbls: vbls
// }
// if (matches) {
// 	return inner
// } else {
// 	return {
// 		type: 'InvalidTypeApplication',
// 		inner: {...inner, typeVbls: []},
// 		typeVbls: vbls,
// 		location: type.location,
// 	}
// }

// TODO: we might want to pass around and `expected` for selecting subTypes? idk
export const typeVariablesMatch = (
    ctx: Context,
    decls: Array<Array<t.Id>>,
    vbls: Array<t.Type>,
): boolean => {
    if (decls.length !== vbls.length) {
        return false;
    }
    return decls.every((decl, i) => {
        if (!decl.length) {
            return true;
        }
        const v = vbls[i];
        if (v.type !== 'ref' || v.ref.type !== 'user') {
            return false;
        }
        const id = v.ref.id;
        // If there's a subtype that our type doesn't match, we're out
        if (
            decl.some(
                (sub) =>
                    !ctx.library.types.superTypes[idName(sub)].some((sid) =>
                        t.idsEqual(sid, id),
                    ),
            )
        ) {
            return false;
        }
        return true;
    });
};

export const bindTypeAndEffectVbls = (
    ctx: Context,
    typeVblsRaw?: Array<TypeVbl>,
    effectVblsRaw?: Array<Identifier>,
) => {
    if (!typeVblsRaw && !effectVblsRaw) {
        return { bindings: ctx.bindings, typeVbls: [], effectVbls: [] };
    }
    const bindings = { ...ctx.bindings };
    const typeVbls: Array<t.TypeVblDecl> = [];
    const effectVbls: Array<number> = [];
    if (typeVblsRaw) {
        bindings.types = bindings.types.concat(
            typeVblsRaw.map((vbl) => {
                const unique =
                    parseSym(vbl.id.hash) || bindings.unique.current++;
                const res = {
                    sym: { unique, name: vbl.id.text },
                    location: vbl.id.location,
                    subTypes:
                        (vbl.subTypes?.items
                            .map((id) => {
                                const pid = resolveTypeId(ctx, id);
                                return pid;
                            })
                            .filter(Boolean) as Array<Id>) || [],
                };
                typeVbls.push({
                    name: vbl.id.text,
                    subTypes: res.subTypes,
                    unique,
                    location: vbl.location,
                });
                return res;
            }),
        );
    }
    if (effectVblsRaw) {
        bindings.effects = bindings.effects.concat(
            effectVblsRaw.map((efv) => {
                const unique = parseSym(efv.hash) || bindings.unique.current++;
                effectVbls.push(unique);
                return {
                    location: efv.location,
                    sym: { unique, name: efv.text },
                };
            }),
        );
    }
    return { bindings, effectVbls, typeVbls };
};

export const typeType = (ctx: Context, type: Type): t.Type => {
    switch (type.type) {
        case 'TupleType': {
            return {
                type: 'ref',
                ref: { type: 'builtin', name: `Tuple${type.items.length}` },
                location: type.location,
                typeVbls: type.items.map((item) => typeType(ctx, item)),
            };
        }
        case 'TypeRef': {
            return typeTypeRef(ctx, type);
        }
        case 'LambdaType': {
            const { bindings, typeVbls, effectVbls } = bindTypeAndEffectVbls(
                ctx,
                type.typevbls?.items,
                type.effvbls?.inner?.items,
            );
            const inner = { ...ctx, bindings };
            return {
                type: 'lambda',
                args: type.args
                    ? type.args.items.map((t) => typeType(inner, t.type))
                    : [],
                effectVbls,
                typeVbls,
                effects: type.effects?.items
                    .map((item) => {
                        return resolveEffectId(inner, item);
                    })
                    .filter(Boolean) as Array<t.EffectRef>,
                location: type.location,
                res: typeType(inner, type.res),
                rest: null,
                argNames:
                    type.args?.items.map((t) =>
                        t.id
                            ? { text: t.id.text, location: t.id.location }
                            : null,
                    ) || undefined,
            };
        }
    }
};
