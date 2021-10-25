// Ok

import {
    BinOp,
    BinOpRight,
    binopWithHash,
    File,
    Toplevel,
    WithUnary,
    WithSuffix,
    Apsub,
    BinOp_inner,
    Identifier,
    DecoratorArg,
    LabeledDecoratorArg,
    RecordSpread,
    RecordItem,
    StructDef,
    DecoratorDef,
    EnumDef,
    EnumSpread,
    RecordDecl,
    TypeVbls,
    Location,
} from '../parsing/parser-new';
import { hashObject, idFromName } from '../typing/env';
import { getOpLevel, organizeDeep } from '../typing/terms/ops';
import * as typed from '../typing/types';
import * as preset from '../typing/preset';
import { Term, Type } from '../typing/types';
import { reGroupOps, typeGroup } from './ops';
import { parseIdOrSym } from './hashes';
import { resolveNamedValue, resolveTypeId, resolveValue } from './resolve';
import { typeExpression } from './typeExpression';
import { Context, MetaData } from './Context';
import { typeType } from './typeType';
import { typeTypeVblDecl } from './typeArrow';
import { addToplevel, Library } from './Library';
import { parseIdTextOrString } from './typeRecord';
import { showLocation } from '../typing/typeExpr';

export const typeToplevel = (
    ctx: Context,
    top: Toplevel,
    unique?: number,
): typed.ToplevelT => {
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
            const t = top.ann ? typeType(ctx, top.ann) : null;
            const term = typeExpression(ctx, top.expr, t ? [t] : []);
            if (top.id.type !== 'Identifier') {
                throw new Error('oops fancy pattern');
            }
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
    const inner: Array<typed.ToplevelRecord> = [];
    const extends_: Array<typed.UserTypeReference> = [];
    const items: Array<typed.UserTypeReference> = [];
    top.items.items.forEach((item) => {
        switch (item.type) {
            case 'EnumSpread': {
                const t = typeType(ctx, item.ref);
                if (t.type === 'ref' && t.ref.type === 'user') {
                    extends_.push(t as typed.UserTypeReference);
                }
                return;
            }
            case 'EnumExternal': {
                const t = typeType(ctx, item.ref);
                if (t.type === 'ref' && t.ref.type === 'user') {
                    items.push(t as typed.UserTypeReference);
                }
                return;
            }
            case 'EnumInternal': {
                const sdef = typeStructDef(
                    ctx,
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
        typeVbls: top.typeVbls?.items.map((v) => typeTypeVblDecl(ctx, v)) || [],
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
            let meta: MetaData = { created: Date.now() };
            let unique: number | undefined;
            if (top.decorators) {
                let left = top.decorators.filter((dec) => {
                    if (
                        dec.id.hash === '#builtin' ||
                        !lib.decorators.names[dec.id.text]
                    ) {
                        switch (dec.id.text) {
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
                if (left.length) {
                    console.warn(
                        `Not handling non-builtin toplevel decorators at the moment. ${showLocation(
                            top.location,
                        )}`,
                    );
                }
            }
            const ttop = typeToplevel(
                { ...ctx, library: lib },
                top.top,
                unique,
            );
            if (ttop.type === 'Expression') {
                expressions.push(ttop.term);
            } else {
                let id;
                [lib, id] = addToplevel(lib, ttop, meta);
                ids.push(id);
            }
        });
    }
    return [lib, expressions, ids];
};

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
                type: typeType(inner, arg.type),
            })) || [],
        location: top.location,
        restArg: null,
        targetType: top.targetType ? typeType(inner, top.targetType) : null,
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

function typeStructDef(
    ctx: Context,
    decl: RecordDecl,
    typeVbls: TypeVbls | null,
    name: string,
    location: Location,
    unique?: number,
): typed.ToplevelRecord {
    const items =
        (decl.items?.items.filter(
            (item) => item.type !== 'RecordSpread',
        ) as Array<RecordItem>) || [];
    const defn: typed.RecordDef = {
        type: 'Record',
        effectVbls: [],
        extends: (
            (decl.items?.items.filter(
                (item) => item.type === 'RecordSpread',
            ) as Array<RecordSpread>) || []
        )
            .map((item) => {
                const resolved = resolveTypeId(ctx, item.constr);
                if (!resolved) {
                    return null;
                }
                return {
                    type: 'ref',
                    ref: { type: 'user', id: resolved },
                    typeVbls: [],
                    location: item.location,
                };
            })
            .filter(Boolean) as Array<typed.UserTypeReference>,
        ffi: null,
        items: items.map((item): typed.Type => typeType(ctx, item.type)),
        location: location,
        typeVbls: typeVbls?.items.map((t) => typeTypeVblDecl(ctx, t)) || [],
        unique: unique != null ? unique : ctx.rng(),
    };
    return {
        type: 'RecordDef',
        attrNames: items.map((item) => parseIdTextOrString(item.id)),
        def: defn,
        id: idFromName(hashObject(defn)),
        location: location,
        name,
    };
}
