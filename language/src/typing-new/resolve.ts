import { IdOrSym, parseIdOrSym } from './hashes';
import { Context } from './Context';
import { Library } from './Library';
import * as t from '../typing/types';
import { Identifier, Location } from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';

export type ResolvedType =
    | { type: 'id'; id: t.Id; typeVbls: Array<t.TypeVblDecl> }
    | { type: 'var'; binding: { sym: t.Symbol; subTypes: Array<t.Id> } };

export const resolveTypeSym = (ctx: Context, unique: number) =>
    ctx.bindings.types.find((b) => b.sym.unique === unique);

export const resolveEffectId = (
    ctx: Context,
    id: Identifier,
): t.EffectRef | null => {
    if (id.hash) {
        const idOrSym = parseIdOrSym(id.hash);
        if (idOrSym?.type === 'sym') {
            const unique = idOrSym.unique;
            const binding = ctx.bindings.effects.find(
                (ef) => ef.sym.unique === unique,
            );
            if (binding) {
                return {
                    type: 'var',
                    sym: binding.sym,
                    location: id.location,
                };
            }
        }
        if (idOrSym?.type === 'id') {
            const found = ctx.library.effects.defns[idName(idOrSym.id)];
            if (found) {
                return {
                    type: 'ref',
                    ref: { type: 'user', id: idOrSym.id },
                    location: id.location,
                };
            }
        }
    }
    const binding = ctx.bindings.effects.find((ef) => ef.sym.name === id.text);
    if (binding) {
        return {
            type: 'var',
            sym: binding?.sym,
            location: id.location,
        };
    }
    const ids = ctx.library.effects.names[id.text];
    if (ids) {
        return {
            type: 'ref',
            location: id.location,
            ref: { type: 'user', id: ids[0] },
        };
    }
    return null;
};

export const resolveTypeId = (
    ctx: Context,
    id: Identifier,
): t.Id | undefined => {
    if (id.hash) {
        const ido = idFromName(id.hash.slice(1));
        if (ctx.library.types.defns[idName(ido)]) {
            return ido;
        }
    }
    if (ctx.library.types.names[id.text]) {
        return ctx.library.types.names[id.text][0];
    }
};

export const resolveType = (
    ctx: Context,
    idOrSym: IdOrSym,
    location: Location,
): null | ResolvedType => {
    if (idOrSym.type === 'sym') {
        const binding = ctx.bindings.types.find(
            (b) => b.sym.unique === idOrSym.unique,
        );
        if (binding) {
            return {
                type: 'var',
                binding,
            };
        }
        return null;
    } else {
        const type = ctx.library.types.defns[idName(idOrSym.id)];
        if (type != null) {
            return {
                type: 'id',
                id: idOrSym.id,
                typeVbls: type.defn.typeVbls,
            };
        }
        return null;
    }
};

export const resolveValue = (
    ctx: Context,
    idOrSym: IdOrSym,
    location: Location,
): t.Term | null => {
    if (idOrSym.type === 'sym') {
        const binding = ctx.bindings.values.find(
            (b) => b.sym.unique === idOrSym.unique,
        );
        if (binding) {
            return {
                type: 'var',
                sym: binding.sym,
                is: binding.type,
                location,
            };
        }
        return null;
    } else {
        const term = ctx.library.terms.defns[idName(idOrSym.id)];
        if (term != null) {
            return {
                type: 'ref',
                is: term.defn.is,
                location,
                ref: { type: 'user', id: idOrSym.id },
            };
        }
        return null;
    }
};

export const resolveNamedValue = (
    ctx: Context,
    name: string,
    location: Location,
    expectedTypes: Array<t.Type>,
): t.Term | null => {
    for (let binding of ctx.bindings.values) {
        if (binding.sym.name === name) {
            if (
                expectedTypes.length &&
                !expectedTypes.some((et) => t.typesEqual(binding.type, et))
            ) {
                continue;
            }
            return {
                type: 'var',
                sym: binding.sym,
                is: binding.type,
                location,
            };
        }
    }
    for (let id of ctx.library.terms.names[name] || []) {
        const term = ctx.library.terms.defns[idName(id)];
        if (
            expectedTypes.length &&
            !expectedTypes.some((et) => t.typesEqual(term.defn.is, et))
        ) {
            continue;
        }
        return {
            type: 'ref',
            is: term.defn.is,
            location,
            ref: { type: 'user', id },
        };
    }
    // TODO: find the /closest/ one, and put it in here w/ a typeError
    return null;
};
