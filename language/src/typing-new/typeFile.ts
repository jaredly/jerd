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
} from '../parsing/parser-new';
import { hashObject, idFromName } from '../typing/env';
import { getOpLevel, organizeDeep } from '../typing/terms/ops';
import * as typed from '../typing/types';
import * as preset from '../typing/preset';
import { Term, Type } from '../typing/types';
import { reGroupOps, typeGroup } from './ops';
import { parseIdOrSym } from './hashes';
import { resolveNamedValue, resolveValue } from './resolve';
import { typeExpression } from './typeExpression';
import { Context, MetaData } from './Context';
import { typeType } from './typeType';
import { typeTypeVblDecl } from './typeArrow';
import { addToplevel, Library } from './Library';

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
            const defn: typed.DecoratorDef = {
                arguments:
                    top.args?.items.map((arg) => ({
                        argLocation: arg.id.location,
                        argName: arg.id.text,
                        location: arg.location,
                        type: typeType(ctx, arg.type),
                    })) || [],
                location: top.location,
                restArg: null,
                targetType: top.targetType
                    ? typeType(ctx, top.targetType)
                    : null,
                typeArgs: [],
                typeVbls:
                    top.typeVbls?.items.map((t) => typeTypeVblDecl(ctx, t)) ||
                    [],
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
        case 'EnumDef':
        case 'StructDef':
            break;
        default:
            let _x: never = top;
        // case 'Define': {
        //     const t = top.ann ? typeType(ctx, )
        //     const term = typeExpression(ctx, top.expr,)
        // }
        // case 'DecoratorDef':
        // 	const defn = typeDecoratorDef(ctx, top.id, top.args, top.targetType)
        // 	return {
        // 		type: 'Decorator',
        // 		id: top.id,
        // 		location: top.location,
        // 		name: top.id.text,
        // 		defn: {
        // 			unique
        // 		}
        // 	}
    }
    throw new Error(`nope`);
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
    if (arg.expr.type !== 'Float') {
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
                    if (dec.id.hash === '#builtin') {
                        switch (dec.id.text) {
                            case 'basedOn': {
                                const id = parseMetaId(
                                    ctx.library,
                                    dec.args?.items,
                                );
                                if (id) {
                                    meta.basedOn = id;
                                    return false;
                                }
                                return true;
                            }
                            case 'supercedes':
                                const id = parseMetaId(
                                    ctx.library,
                                    dec.args?.items,
                                );
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
                    throw new Error(
                        `Not handling non-builtin toplevel decorators at the moment.`,
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
