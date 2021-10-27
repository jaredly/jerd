import {
    Location,
    RecordDecl,
    RecordItem,
    RecordSpread,
    TypeVbls,
} from '../parsing/parser-new';
import { hashObject, idFromName, idName } from '../typing/env';
import {
    getEffects,
    Id,
    RecordDef,
    Term,
    ToplevelRecord,
    Type,
    UserTypeReference,
} from '../typing/types';
import { Context, recordWithResolvedTypes } from './Context';
import { resolveTypeId } from './resolve';
import { typeTypeVblDecl } from './typeArrow';
import { typeExpression } from './typeExpression';
import {
    getAllResolvedSubTypes,
    getAllSubTypes,
    parseIdTextOrString,
} from './typeRecord';
import { typeType } from './typeType';

export function typeStructDef(
    ctx: Context,
    decl: RecordDecl,
    typeVbls: TypeVbls | null,
    name: string,
    location: Location,
    unique?: number,
    ffi?: string,
): ToplevelRecord {
    const items =
        (decl.items?.items.filter(
            (item) => item.type !== 'RecordSpread',
        ) as Array<RecordItem>) || [];
    const typedVbls = typeVbls?.items.map((t) => typeTypeVblDecl(ctx, t)) || [];
    const inner = {
        ...ctx,
        bindings: {
            ...ctx.bindings,
            types: typedVbls.concat(ctx.bindings.types),
        },
    };
    const defaults: {
        [key: string]: { id: Id | null; value: Term; idx: number };
    } = {};
    const defn: RecordDef = {
        type: 'Record',
        effectVbls: [],
        extends: (
            (decl.items?.items.filter(
                (item) => item.type === 'RecordSpread',
            ) as Array<RecordSpread>) || []
        )
            .map((item) => {
                const resolved = resolveTypeId(inner, item.constr);
                const typeVbls =
                    item.typeVbls?.inner.items.map((t) => typeType(inner, t)) ||
                    [];
                if (!resolved) {
                    ctx.warnings.push({
                        location: item.location,
                        text: `Unable to resolve spread ${item.constr.text}`,
                    });
                    return null;
                }
                const type: UserTypeReference = {
                    type: 'ref',
                    ref: { type: 'user', id: resolved },
                    typeVbls,
                    location: item.location,
                };
                const subTypes = getAllResolvedSubTypes(ctx, [type]);
                // const subTypes = getAllSubTypes(ctx.library, [resolved]);
                if (item.defaults?.items.length) {
                    item.defaults.items.forEach(({ id, value }) => {
                        for (let st of subTypes) {
                            const names =
                                ctx.library.types.constructors.idToNames[
                                    idName(st.id)
                                ];
                            // TODO: respect hashes
                            const attrName = parseIdTextOrString(id.text);
                            const idx = names.indexOf(attrName);
                            // const defn = recordWithResolvedTypes(ctx, st)
                            const expected = st.def.items[idx];
                            if (idx !== -1) {
                                const term = typeExpression(ctx, value, [
                                    expected,
                                ]);
                                if (getEffects(term).length) {
                                    ctx.warnings.push({
                                        location: value.location,
                                        text: `Effectful defaults are not allowed. Ignoring.`,
                                    });
                                } else {
                                    defaults[`${idName(st.id)}#${idx}`] = {
                                        id: st.id,
                                        idx,
                                        value: term,
                                    };
                                }
                                return;
                            }
                        }
                        ctx.warnings.push({
                            location: value.location,
                            text: `Nooo matching thing for default sorry`,
                        });
                    });
                    console.log(defaults);
                }
                return type;
            })
            .filter(Boolean) as Array<UserTypeReference>,
        ffi: ffi
            ? {
                  tag: ffi,
                  names: items.map((item) => parseIdTextOrString(item.id)),
              }
            : null,
        items: items.map(
            (item, i): Type => {
                const type = typeType(inner, item.type);
                if (item.value) {
                    const value = typeExpression(ctx, item.value, [type]);
                    if (getEffects(value).length) {
                        ctx.warnings.push({
                            location: value.location,
                            text: `Effectful defaults are not allowed. Ignoring.`,
                        });
                    } else {
                        defaults[`${i}`] = { id: null, idx: i, value };
                    }
                }
                return type;
            },
        ),
        location: location,
        typeVbls: typedVbls,
        unique: ffi ? 0 : unique != null ? unique : ctx.rng(),
        defaults,
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
