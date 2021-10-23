import { RecordPattern } from '../../parsing/parser-new';
import { idName } from '../../typing/env';
import {
    Id,
    Pattern as TPattern,
    RecordBase,
    RecordDef,
    RecordPatternItem,
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
    if (!id) {
        return { type: 'PHole', location: term.location };
    }
    // const ids = ctx.library.types.names[term.id.text];
    // if (!ids) {
    // 	throw new Error(`Unknown type ${term.id.text}`);
    // }
    // const id = ids[0];

    // Validate record in enum
    if (expected.type !== 'ref' || expected.ref.type !== 'user') {
        return { type: 'PHole', location: term.location };
    }
    let found: TypeReference | null = null;
    let enumDef = typeDef(ctx.library, expected.ref);
    if (enumDef && enumDef.type === 'Record') {
        found = expected;
    } else {
        const allReferences = getEnumReferences(
            ctx,
            expected as UserTypeReference,
            term.location,
        );
        for (let ref of allReferences) {
            if (refsEqual(ref.ref, { type: 'user', id })) {
                found = ref;
                break;
            }
        }
        if (!found) {
            throw new Error(`Enum doesn't match`);
        }
    }

    let t = typeDef(ctx.library, { type: 'user', id });
    if (!t || t.type !== 'Record') {
        return { type: 'PHole', location: term.location };
    }
    t = applyTypeVariablesToRecord(
        ctx,
        t,
        found.typeVbls,
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
        // const t = ctx.library.types.defns[idName(id)] as RecordDef;
        subTypeTypes[idName(id)] = t;
        // const rows = new Array(t.items.length);
        // t.items.forEach((type, i) => {
        //     rows[i] = { type, value: null };
        // });
        // subTypes[idName(id)] = {
        //     covered: false,
        //     spread: null,
        //     rows,
        // };
        ctx.library.types.constructors.idToNames[idName(id)].forEach(
            (name, i) => (names[name] = { i, id }),
        );
    });

    const items: Array<RecordPatternItem> = [];

    term.items.items.forEach((row, idx) => {
        // ok

        let rowId: Id | null = null;
        let ref: Reference;
        let i: number;
        if (row.id.text === '_') {
            if (base.type !== 'Concrete') {
                throw new Error(
                    `Can only omit attribute names for concrete record declarations`,
                );
            }
            // Umm TODO throw if you're mixing unnamed attributes and like literally anything else?
            // rowId = id;
            i = idx;
            ref = { type: 'user', id };
        } else {
            if (!names[row.id.text]) {
                throw new Error(
                    `Ok what`,
                    // `Unexpected attribute name ${row.id.text} at ${showLocation(
                    //     row.id.location,
                    // )}`,
                );
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
            console.log(row, base, rowId, subTypeTypes);

            throw new Error(`No record`);
        }

        const is = recordType.items[i];

        let pattern: TPattern;
        if (row.pattern == null) {
            const sym = idToSym(ctx, row.id);
            pattern = { type: 'Binding', location: row.location, sym };
        } else {
            pattern = typePattern(ctx, row.pattern, bindings, is);
        }

        items.push({
            ref,
            idx: i,
            location: row.location,
            pattern,
            is,
        });
    });

    return {
        type: 'Record',
        ref: found,
        items,
        location: term.location,
    };
}
