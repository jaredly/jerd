import { IdOrSym } from './hashes';
import { Context } from './typeFile';
import { Library } from './Library';
import * as t from '../typing/types';
import { Location } from '../parsing/parser-new';
import { idName } from '../typing/env';

export type ResolvedType =
    | { type: 'id'; id: t.Id; typeVbls: Array<t.TypeVblDecl> }
    | { type: 'var'; binding: { sym: t.Symbol; subTypes: Array<t.Id> } };

export const resolveTypeSym = (ctx: Context, unique: number) =>
    ctx.bindings.types.find((b) => b.sym.unique === unique);

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
                typeVbls: type.typeVbls,
            };
        }
        return null;
    }
};

// START HERE:
// OOoooooooh ok folks
// So if you specified /too many/ type variables, we wrap it in an 'extra type variables' dealio
// but if you didn't specify /enough/, then we can just fill in with type holes.
// BUT let's talk about fallthrough behavior.
// if you have the wrong number of type variables for this one, but the right for another...
// Yeah, I think we want another "options" setup. So we can go through and see what matches.
// And if nothing does, we take the top one and jimmy it up.

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
                is: term.is,
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
            !expectedTypes.some((et) => t.typesEqual(term.is, et))
        ) {
            continue;
        }
        return {
            type: 'ref',
            is: term.is,
            location,
            ref: { type: 'user', id },
        };
    }
    // TODO: find the /closest/ one, and put it in here w/ a typeError
    return null;
};
