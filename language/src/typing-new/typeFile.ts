// Ok

import {
    DecoratedToplevel,
    Decorator,
    DecoratorDef,
    EnumDef,
    File,
    LabeledDecoratorArg,
    Toplevel,
    Type,
} from '../parsing/parser-new';
import { hashObject, idFromName } from '../typing/env';
import { showLocation } from '../typing/typeExpr';
import * as typed from '../typing/types';
import { Term } from '../typing/types';
import { Context, MetaData } from './Context';
import { addToplevel, Library } from './Library';
import { resolveEffectId } from './resolve';
import { typeEffVblDecl, typeTypeVblDecl } from './typeArrow';
import { typeExpression } from './typeExpression';
import { typeStructDef } from './typeStructDef';
import { simpleTemplateString } from './typeTemplateString';
import { typeType } from './typeType';

export const typeToplevel = (
    ctx: Context,
    top: Toplevel,
    unique?: number,
    ffi?: string,
): typed.ToplevelT => {
    // Isolate the 'unique'
    ctx = { ...ctx, bindings: { ...ctx.bindings, unique: { current: 0 } } };
    switch (top.type) {
        case 'ToplevelExpression': {
            const term = typeExpression(ctx, top.expr, []);
            return {
                type: 'Expression',
                id: idFromName(hashObject(term)),
                location: top.location,
                term,
            };
        }
        case 'Define': {
            let t = top.ann ? typeType(ctx, top.ann) : null;
            if (top.id.type !== 'Identifier') {
                throw new Error('oops fancy pattern');
            }
            let inner: Context = ctx;
            if (top.rec) {
                if (top.expr.type !== 'Lambda') {
                    console.warn(`can't do recursive with a non-lambda`);
                } else if (!t) {
                    const inner: Context = {
                        ...ctx,
                        bindings: {
                            ...ctx.bindings,
                        },
                    };

                    const effectVbls =
                        top.expr.effvbls?.inner?.items.map((t, i) =>
                            typeEffVblDecl(inner, t, i),
                        ) || [];
                    inner.bindings.effects = effectVbls.concat(
                        inner.bindings.effects,
                    );
                    const typeVbls =
                        top.expr.typevbls?.items.map((t) =>
                            typeTypeVblDecl(inner, t),
                        ) || [];
                    inner.bindings.types = typeVbls.concat(
                        inner.bindings.types,
                    );

                    const effects = top.expr.effects
                        ? (top.expr.effects.effects?.items
                              .map((id) => resolveEffectId(inner, id))
                              .filter(Boolean) as Array<typed.EffectRef>) || []
                        : [];

                    t = {
                        type: 'lambda',
                        args:
                            top.expr.args?.items.map((t) =>
                                t.type
                                    ? typeType(inner, t.type)
                                    : { type: 'THole', location: t.location },
                            ) || [],
                        effectVbls,
                        effects,
                        location: top.location,
                        res: top.expr.rettype
                            ? typeType(inner, top.expr.rettype)
                            : { type: 'THole', location: top.location },
                        rest: null,
                        typeVbls,
                    };
                }
                inner = {
                    ...ctx,
                    bindings: {
                        ...ctx.bindings,
                        self: { name: top.id.text, type: t! },
                    },
                };
            }
            const term = typeExpression(inner, top.expr, t ? [t] : []);
            return {
                type: 'Define',
                term,
                id: idFromName(hashObject(term)),
                location: top.location,
                name: top.id.text,
            };
        }
        case 'Effect': {
            const defn: typed.EffectDef = {
                constrs: top.constrs.map((constr) => ({
                    args:
                        constr.type.args?.items.map((arg) =>
                            typeType(ctx, arg.type),
                        ) || [],
                    ret: typeType(ctx, constr.type.res),
                })),
                // unique: unique != null ? unique : ctx.rng(),
                location: top.location,
                type: 'EffectDef',
            };
            return {
                type: 'Effect',
                constrNames: top.constrs.map((t) => t.id.text),
                effect: defn,
                id: idFromName(hashObject(defn)),
                location: top.location,
                name: top.id.text,
            };
        }
        case 'DecoratorDef': {
            return typeDecoratorDef(ctx, top, unique);
        }
        case 'StructDef': {
            return typeStructDef(
                ctx,
                top.decl,
                top.typeVbls,
                top.id.text,
                top.location,
                unique,
                ffi,
            );
        }
        case 'EnumDef':
            return typeEnumDef(ctx, top, unique);
        default:
            let _x: never = top;
    }
    throw new Error(`nope`);
};

export const typeEnumDef = (
    ctx: Context,
    top: EnumDef,
    unique?: number,
): typed.ToplevelEnum => {
    const typeVbls =
        top.typeVbls?.items.map((item) => typeTypeVblDecl(ctx, item)) || [];
    const innerCtx: Context = {
        ...ctx,
        bindings: {
            ...ctx.bindings,
            types: typeVbls.concat(ctx.bindings.types),
        },
    };
    const inner: Array<typed.ToplevelRecord> = [];
    const extends_: Array<typed.UserTypeReference> = [];
    const items: Array<typed.UserTypeReference> = [];
    top.items.items.forEach((item) => {
        switch (item.type) {
            case 'EnumSpread': {
                const t = typeType(innerCtx, item.ref);
                if (t.type === 'ref' && t.ref.type === 'user') {
                    extends_.push(t as typed.UserTypeReference);
                }
                return;
            }
            case 'EnumExternal': {
                const t = typeType(innerCtx, item.ref);
                if (t.type === 'ref' && t.ref.type === 'user') {
                    items.push(t as typed.UserTypeReference);
                }
                return;
            }
            case 'EnumInternal': {
                const sdef = typeStructDef(
                    innerCtx,
                    item.decl,
                    null,
                    item.id.text,
                    item.location,
                );
                inner.push(sdef);
                items.push({
                    type: 'ref',
                    ref: { type: 'user', id: sdef.id },
                    location: item.location,
                    typeVbls: [],
                });
            }
        }
    });
    const defn: typed.EnumDef = {
        type: 'Enum',
        effectVbls: [],
        extends: extends_,
        items,
        location: top.location,
        typeVbls,
    };
    return {
        type: 'EnumDef',
        def: defn,
        id: idFromName(hashObject(defn)),
        inner,
        location: top.location,
        name: top.id.text,
    };
};

export const parseMetaId = (
    lib: Library,
    args?: Array<LabeledDecoratorArg>,
): null | typed.Id => {
    if (!args || args.length !== 1) {
        return null;
    }
    const arg = args[0].arg;
    if (arg.type === 'DecType') {
        if (arg.type_.type !== 'TypeRef') {
            return null;
        }
        if (!arg.type_.id.hash) {
            const found = lib.types.names[arg.type_.id.text];
            if (!found) {
                return null;
            }
            return found[0];
        }
        return idFromName(arg.type_.id.hash.slice(1));
    }
    if (arg.type !== 'DecExpr' || arg.expr.type !== 'Identifier') {
        return null;
    }
    if (!arg.expr.hash) {
        const found = lib.terms.names[arg.expr.text];
        if (!found) {
            return null;
        }
        return found[0];
    }
    return idFromName(arg.expr.hash.slice(1));
};

export const parseMetaFloat = (
    args?: Array<LabeledDecoratorArg>,
): null | number => {
    if (!args || args.length !== 1) {
        return null;
    }
    const arg = args[0].arg;
    if (arg.type !== 'DecExpr') {
        return null;
    }
    if (arg.expr.type !== 'Float' && arg.expr.type !== 'Int') {
        return null;
    }
    return parseFloat(arg.expr.contents);
};

export const parseMetaString = (
    args?: Array<LabeledDecoratorArg>,
): null | string => {
    if (!args || args.length !== 1) {
        return null;
    }
    const arg = args[0].arg;
    if (arg.type !== 'DecExpr') {
        return null;
    }
    if (arg.expr.type !== 'TemplateString') {
        return null;
    }
    return simpleTemplateString(arg.expr);
};

export const parseMetaInt = (
    args?: Array<LabeledDecoratorArg>,
): null | number => {
    if (!args || args.length !== 1) {
        return null;
    }
    const arg = args[0].arg;
    if (arg.type !== 'DecExpr') {
        return null;
    }
    if (arg.expr.type !== 'Int') {
        return null;
    }
    return +arg.expr.contents;
};

export const typeFile = (
    ctx: Context,
    file: File,
): [Library, Array<Term>, Array<typed.Id>] => {
    let lib = ctx.library;
    let expressions: Array<Term> = [];
    let ids: Array<typed.Id> = [];
    if (file.tops) {
        file.tops.items.forEach((top) => {
            let res;
            [lib, res] = typeDecoratedToplevel({ ...ctx, library: lib }, top);
            if (res.type === 'expr') {
                expressions.push(res.expr);
            } else {
                ids.push(res.id);
            }
        });
    }
    return [lib, expressions, ids];
};

export const explicitIdForTop = (top: Toplevel) => {
    switch (top.type) {
        case 'StructDef':
        case 'EnumDef':
        case 'DecoratorDef':
        case 'Effect':
            return top.id.hash?.slice(1);
        case 'Define':
            if (top.id.type === 'Identifier') {
                return top.id.hash?.slice(1);
            }
        case 'ToplevelExpression':
            return undefined;
    }
};

export const typeMaybeConstantType = (ctx: Context, type: Type): typed.Type => {
    if (
        type.type === 'TypeRef' &&
        (type.id.hash === '#builtin' || !type.id.hash) &&
        type.id.text === 'Constant' &&
        type.typeVbls &&
        type.typeVbls.inner.items.length === 1
    ) {
        return {
            type: 'ref',
            ref: { type: 'builtin', name: 'Constant' },
            typeVbls: [typeType(ctx, type.typeVbls.inner.items[0])],
            location: type.location,
        };
    }
    return typeType(ctx, type);
};

export function typeDecoratedToplevel(
    ctx: Context,
    top: DecoratedToplevel,
): [Library, { type: 'id'; id: typed.Id } | { type: 'expr'; expr: Term }] {
    let { unique, ffi, meta, left } = processToplevelBuiltinDecorators(
        top,
        ctx.library,
    );
    if (left.length) {
        // console.warn(
        //     `Not handling non-builtin toplevel decorators at the moment. ${showLocation(
        //         top.location,
        //     )}`,
        // );
    }
    const ttop = typeToplevel(ctx, top.top, unique, ffi);
    if (ttop.type === 'Expression') {
        // expressions.push(ttop.term);
        return [ctx.library, { type: 'expr', expr: ttop.term }];
    }
    let explicitId = explicitIdForTop(top.top);
    let [lib, id] = addToplevel(ctx.library, ttop, meta);
    // ids.push(id);
    if (explicitId && explicitId !== id.hash) {
        ctx.idRemap[explicitId] = id.hash;
    }
    return [lib, { type: 'id', id }];
}

export function processToplevelBuiltinDecorators(
    top: DecoratedToplevel,
    lib: Library,
) {
    let meta: MetaData = { created: Date.now() };
    let unique: number | undefined;
    let ffi: string | undefined;
    let left: Array<Decorator> = [];
    if (top.decorators) {
        left = top.decorators.filter((dec) => {
            if (
                dec.id.hash === '#builtin' ||
                !lib.decorators.names[dec.id.text]
            ) {
                switch (dec.id.text) {
                    case 'ffi': {
                        if (top.top.type === 'StructDef') {
                            const name = parseMetaString(dec.args?.items);
                            if (name != null) {
                                ffi = name;
                            } else {
                                ffi = top.top.id.text;
                            }
                            return false;
                        }
                        break;
                    }
                    case 'basedOn': {
                        const id = parseMetaId(lib, dec.args?.items);
                        if (id) {
                            meta.basedOn = id;
                            return false;
                        }
                        return true;
                    }
                    case 'supercedes':
                        const id = parseMetaId(lib, dec.args?.items);
                        if (id) {
                            meta.supercedes = id;
                            return false;
                        }
                        return true;
                    case 'createdAt': {
                        const at = parseMetaInt(dec.args?.items);
                        if (at != null) {
                            meta.created = at;
                            return false;
                        }
                        return true;
                    }
                    case 'deprecated':
                        const at = parseMetaInt(dec.args?.items);
                        if (at != null) {
                            meta.deprecated = at;
                            return false;
                        }
                        return true;
                    case 'unique':
                        const u = parseMetaFloat(dec.args?.items);
                        if (u != null) {
                            unique = u;
                            return false;
                        }
                        return true;
                }
            }
            return true;
        });
    }
    return { unique, ffi, meta, left };
}

function typeDecoratorDef(
    ctx: Context,
    top: DecoratorDef,
    unique?: number,
): typed.ToplevelDecorator {
    const typeVbls =
        top.typeVbls?.items.map((t) => typeTypeVblDecl(ctx, t)) || [];
    const inner = typeVbls.length
        ? {
              ...ctx,
              bindings: {
                  ...ctx.bindings,
                  types: typeVbls.concat(ctx.bindings.types),
              },
          }
        : ctx;
    const defn: typed.DecoratorDef = {
        arguments:
            top.args?.items.map((arg) => ({
                argLocation: arg.id.location,
                argName: arg.id.text,
                location: arg.location,
                type: typeMaybeConstantType(inner, arg.type),
            })) || [],
        location: top.location,
        restArg: null,
        targetType: top.targetType
            ? typeMaybeConstantType(inner, top.targetType)
            : null,
        typeArgs: [],
        typeVbls,
        unique: unique != null ? unique : ctx.rng(),
    };
    return {
        type: 'Decorator',
        defn,
        id: idFromName(hashObject(defn)),
        location: top.location,
        name: top.id.text,
    };
}
