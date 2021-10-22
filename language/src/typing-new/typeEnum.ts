import { EnumLiteral } from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import { void_ } from '../typing/preset';
import { EnumDef, Id, Term, Type } from '../typing/types';
import { Context } from './Context';
import {
    applyTypeVariablesToRecord,
    createTypeVblMapping,
    mapTypeAndEffectVariablesInType,
} from './ops';
import { typeExpression } from './typeExpression';
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
    const defn = ctx.library.types.defns[idName(id)].defn as EnumDef;
    const typeVbls =
        term.typeVbls?.inner.items.map((t) => typeType(ctx, t)) || [];
    // TODO: preserve extra type arguments
    // TODO: allow these holes to be inferred!
    const passVbls: Array<Type> = defn.typeVbls.map((_, i) =>
        i >= typeVbls.length
            ? { type: 'THole', location: term.location }
            : typeVbls[i],
    );
    const mapping = createTypeVblMapping(
        ctx,
        defn.typeVbls,
        passVbls,
        term.location,
    );
    const items = defn.items.map((t) =>
        mapTypeAndEffectVariablesInType(mapping!, {}, t),
    );
    // STOPSHIP: handle enum extends!!
    return {
        type: 'Enum',
        inner: typeExpression(ctx, term.expr, items),
        is: {
            type: 'ref',
            location: term.location,
            ref: { type: 'user', id },
            typeVbls: passVbls,
        },
        location: term.location,
    };
};
