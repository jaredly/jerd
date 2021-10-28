import { EnumLiteral, Location } from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import { void_ } from '../typing/preset';
import {
    EnumDef,
    Id,
    Term,
    Type,
    TypeVblDecl,
    UserTypeReference,
} from '../typing/types';
import { Context } from './Context';
import {
    applyTypeVariablesToRecord,
    createTypeVblMapping,
    mapTypeAndEffectVariablesInType,
} from './ops';
import { typeExpression } from './typeExpression';
import { getAllSubTypes, getAllSubTypesWithVbls } from './typeRecord';
import { typeType } from './typeType';

export const typeEnum = (
    ctx: Context,
    term: EnumLiteral,
    expected: Array<Type>,
): Term => {
    let id: Id | null = null;
    if (term.id.hash) {
        const hash = idFromName(term.id.hash.slice(1));
        const defn = ctx.library.types.defns[idName(hash)];
        if (defn && defn.defn.type === 'Enum') {
            id = hash;
        } else {
            ctx.warnings.push({
                location: term.location,
                text: `Invalid enum id: ${term.id.hash}`,
            });
        }
    }
    if (id == null) {
        const options = ctx.library.types.names[term.id.text];
        for (let option of options || []) {
            const defn = ctx.library.types.defns[idName(option)];
            if (defn && defn.defn.type === 'Enum') {
                id = option;
                break;
            }
        }
    }
    if (id == null) {
        // InvalidEnum? ugh too much
        return {
            type: 'Hole',
            is: expected.length ? expected[0] : void_,
            location: term.location,
        };
    }
    let defn = ctx.library.types.defns[idName(id)].defn as EnumDef;
    const typeVbls =
        term.typeVbls?.inner.items.map((t) => typeType(ctx, t)) || [];
    const passVbls = matchingTypeVbls(typeVbls, defn.typeVbls, term.location);
    // TODO: preserve extra type arguments
    // TODO: allow these holes to be inferred!
    defn = applyTypeVariablesToEnum(ctx, defn, passVbls, term.location);
    // STOPSHIP: handle enum extends!!
    const allPotentials: Array<UserTypeReference> = defn.items;
    getAllSubTypesWithVbls(ctx, defn.extends).forEach(({ ref, defn }) => {
        allPotentials.push(ref);
        if (defn.type === 'Enum') {
            allPotentials.push(...defn.items);
        }
    });
    // const allPotentials = defn.extends.concat(defn.items);
    // getAllSubTypes(ctx.library, defn.extends)
    return {
        type: 'Enum',
        inner: typeExpression(ctx, term.expr, allPotentials),
        is: {
            type: 'ref',
            location: term.location,
            ref: { type: 'user', id },
            typeVbls: passVbls,
        },
        location: term.location,
    };
};

export const matchingTypeVbls = (
    vbls: Array<Type>,
    decls: Array<TypeVblDecl>,
    location: Location,
) =>
    // TODO: Do a subTypes check? yeah
    decls.map(
        (_, i): Type =>
            i >= vbls.length ? { type: 'THole', location } : vbls[i],
    );

export const applyTypeVariablesToEnum = (
    ctx: Context,
    enumDef: EnumDef,
    typeVbls: Array<Type>,
    location: Location,
): EnumDef => {
    const mapping = createTypeVblMapping(
        ctx,
        enumDef.typeVbls,
        typeVbls,
        location,
    );
    const items = enumDef.items.map(
        (t) =>
            mapTypeAndEffectVariablesInType(
                mapping!,
                {},
                t,
            ) as UserTypeReference,
    );
    return { ...enumDef, items, typeVbls: [] };
};
