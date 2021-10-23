import {
    Location,
    RecordPattern,
    RecordPatternItem,
} from '../../parsing/parser-new';
import { idName } from '../../typing/env';
import { void_ } from '../../typing/preset';
import {
    Id,
    Pattern as TPattern,
    RecordBase,
    EnumDef,
    RecordDef,
    RecordPatternItem as TRecordPatternItem,
    Reference,
    refsEqual,
    Term,
    Type,
    TypeReference,
    UserTypeReference,
} from '../../typing/types';
import { Context, idToSym, ValueBinding } from '../Context';
import { getEnumReferences, typeDef } from '../Library';
import { applyTypeVariablesToRecord } from '../ops';
import { resolveTypeId } from '../resolve';
import { getAllSubTypes } from '../typeRecord';
import { typePattern } from './typePattern';

export function typeRecordPattern(
    ctx: Context,
    term: RecordPattern,
    bindings: ValueBinding[],
    expected: Type,
): TPattern {
    const names: { [key: string]: { i: number; id: Id | null } } = {};
    let subTypeIds: Array<Id>;
    let base: RecordBase<{ type: Type; value: Term | null }>;
    const subTypeTypes: { [id: string]: RecordDef } = {};

    // TODO: if I allow destructuring of type vbl records,
    // like in a let, I'll need this.
    // if (env.local.typeVblNames[pattern.id.text]) {
    //     const sym = env.local.typeVblNames[pattern.id.text];
    //     const t = env.local.typeVbls[sym.unique];
    //     subTypeIds = [];
    //     t.subTypes.forEach((id) => {
    //         const t = env.global.types[idName(id)] as RecordDef;
    //         subTypeIds.push(...getAllSubTypes(env.global, t));
    //     });
    //     base = {
    //         type: 'Variable',
    //         var: sym,
    //         spread: null as any,
    //     };
    // } else {

    const id = resolveTypeId(ctx, term.id);
    const found = id ? findRecordDefn(ctx, expected, id, term.location) : null;

    // Soo ... if you ge tthe wrong name, should we infer from the attribute?

    if (!found || !id) {
        const extraItems: Array<{
            text: string;
            pattern: TPattern;
        }> = term.items.items.map((row, idx) => ({
            text: row.id.text,
            pattern: typeRowPattern(ctx, row, bindings, void_),
        }));

        return {
            type: 'ErrorRecordPattern',
            extraItems,
            inner: {
                type: 'PNotFound',
                location: term.location,
                text: term.id.text,
            },
            items: [],
            location: term.location,
        };
    }

    const [typeRef, validType] = found;

    let t = typeDef(ctx.library, { type: 'user', id });
    if (!t || t.type !== 'Record') {
        return {
            type: 'PNotFound',
            location: term.location,
            text: term.id.text,
        };
    }
    t = applyTypeVariablesToRecord(
        ctx,
        t,
        typeRef.typeVbls,
        term.location,
        id.hash,
    );

    subTypeIds = getAllSubTypes(
        ctx.library,
        t.extends.map((t) => t.ref.id),
    );

    ctx.library.types.constructors.idToNames[idName(id)].forEach(
        (name, i) => (names[name] = { i, id: null }),
    );
    const ref: Reference = { type: 'user', id };
    base = {
        rows: [],
        ref,
        type: 'Concrete',
        spread: null,
        location: term.id.location,
    };

    subTypeIds.forEach((id) => {
        // STOPSHIP: need to substitute type variables
        const t = typeDef(ctx.library, { type: 'user', id }) as RecordDef;
        subTypeTypes[idName(id)] = t;
        ctx.library.types.constructors.idToNames[idName(id)].forEach(
            (name, i) => (names[name] = { i, id }),
        );
    });

    const items: Array<TRecordPatternItem> = [];
    const extraItems: Array<{ text: string; pattern: TPattern }> = [];
    term.items.items.forEach((row, idx) => {
        const res = typeRecordPatternItem(
            row,
            base,
            idx,
            id,
            names,
            t,
            subTypeTypes,
            ctx,
            bindings,
        );
        if ('text' in res) {
            extraItems.push(res);
        } else {
            items.push(res);
        }
    });

    const res: TPattern = {
        type: 'Record',
        ref: typeRef,
        items,
        location: term.location,
    };
    if (extraItems.length) {
        return {
            type: 'ErrorRecordPattern',
            extraItems,
            inner: res,
            items,
            location: res.location,
        };
    }
    if (!validType) {
        return {
            type: 'PTypeError',
            is: expected,
            inner: res,
            location: term.location,
        };
    }
    return res;
}

export const findRecordDefn = (
    ctx: Context,
    expected: Type,
    id: Id,
    location: Location,
): [TypeReference, boolean] | null => {
    // Validate record in enum
    if (expected.type !== 'ref' || expected.ref.type !== 'user') {
        const idDefn = typeDef(ctx.library, { type: 'user', id });
        return idDefn?.type === 'Record'
            ? [
                  {
                      type: 'ref',
                      typeVbls: [],
                      ref: { type: 'user', id },
                      location,
                  },
                  false,
              ]
            : null;
    }

    let enumDef = typeDef(ctx.library, expected.ref);
    if (enumDef && enumDef.type === 'Record') {
        return [expected, true];
    } else {
        const allReferences = getEnumReferences(
            ctx,
            expected as UserTypeReference,
            location,
        );
        for (let ref of allReferences) {
            if (refsEqual(ref.ref, { type: 'user', id })) {
                return [ref, true];
            }
        }
    }

    const idDefn = typeDef(ctx.library, { type: 'user', id });
    return idDefn?.type === 'Record'
        ? [
              {
                  type: 'ref',
                  typeVbls: [],
                  ref: { type: 'user', id },
                  location,
              },
              false,
          ]
        : null;
};

export function typeRecordPatternItem(
    row: RecordPatternItem,
    base: RecordBase<{ type: Type; value: Term | null }>,
    idx: number,
    id: Id,
    names: { [key: string]: { i: number; id: Id | null } },
    t: EnumDef | RecordDef | null,
    subTypeTypes: { [id: string]: RecordDef },
    ctx: Context,
    bindings: ValueBinding[],
): TRecordPatternItem | { text: string; pattern: TPattern } {
    let rowId: Id | null = null;
    let ref: Reference;
    let i: number;
    if (row.id.text === '_') {
        if (base.type !== 'Concrete') {
            return {
                text: '_',
                pattern: typeRowPattern(ctx, row, bindings, void_),
            };
        }
        i = idx;
        ref = { type: 'user', id };
    } else {
        if (!names[row.id.text]) {
            return {
                text: row.id.text,
                pattern: typeRowPattern(ctx, row, bindings, void_),
            };
        }
        const got = names[row.id.text];
        i = got.i;
        rowId = got.id;
        ref = { type: 'user', id: got.id || id };
    }

    const recordType =
        rowId == null && base.type === 'Concrete'
            ? t
            : subTypeTypes[idName(rowId!)];

    if (!recordType) {
        return {
            text: row.id.text,
            pattern: typeRowPattern(ctx, row, bindings, void_),
        };
    }

    const is = recordType.items[i];

    return {
        ref,
        idx: i,
        location: row.location,
        pattern: typeRowPattern(ctx, row, bindings, is),
        is,
    };
}

function typeRowPattern(
    ctx: Context,
    row: RecordPatternItem,
    bindings: ValueBinding[],
    is: Type | UserTypeReference,
): TPattern {
    if (row.pattern == null) {
        const sym = idToSym(ctx, row.id);
        bindings.push({ sym, location: row.location, type: is });
        return { type: 'Binding', location: row.location, sym };
    } else {
        return typePattern(ctx, row.pattern, bindings, is);
    }
}
