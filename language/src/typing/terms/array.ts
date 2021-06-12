import { ArrayLiteral, Expression } from '../../parsing/parser';
import { void_ } from '../preset';
import typeExpr, { showLocation } from '../typeExpr';
import {
    ArraySpread,
    Env,
    isRecord,
    Term,
    Type,
    TypeReference,
} from '../types';
import typeType from '../typeType';
import { assertFits, showType } from '../unify';

export const typeArray = (env: Env, expr: ArrayLiteral): Term => {
    // ok so the type of the first one determines it?
    // I mean, what syntax are we thinking of here for explicitly typed array?
    // like <x>[1, 2, 3]? I guess. It would be consistent. And like somewhat weird.
    // ok we can cross that bridge in a minute.
    // I guess another option would be to search for the common supertype, if it exists.
    // oh and for an empty array? what do we do? erm yeah. gotta be explicit?
    // or we could just type it as never...
    let itemType: Type | null = expr.ann ? typeType(env, expr.ann) : null;
    if (expr.ann == null && expr.items.length === 0) {
        itemType = void_;
    }
    const items: Array<Term | ArraySpread> = expr.items.map((item) => {
        if (item.type === 'ArraySpread') {
            const value = typeExpr(env, item.value);
            if (
                !isRecord(value.is, {
                    type: 'builtin',
                    name: 'Array',
                })
            ) {
                throw new Error(
                    `Can't spread something that's not an array. ${showType(
                        env,
                        value.is,
                    )} at ${showLocation(value.location)}`,
                );
            }
            if (itemType == null) {
                itemType = (value.is as TypeReference).typeVbls[0];
            } else {
                assertFits(
                    env,
                    (value.is as TypeReference).typeVbls[0],
                    itemType,
                    value.location,
                );
            }
            return {
                type: 'ArraySpread',
                location: item.location,
                value,
            };
        } else {
            const value = typeExpr(env, item);
            if (itemType == null) {
                itemType = value.is;
            } else {
                assertFits(env, value.is, itemType);
            }
            return value;
        }
    });
    return {
        type: 'Array',
        location: expr.location,
        items,
        is: {
            type: 'ref',
            ref: { type: 'builtin', name: 'Array' },
            location: expr.location,
            typeVbls: [itemType!],
            // effectVbls: [],
        },
    };
};
