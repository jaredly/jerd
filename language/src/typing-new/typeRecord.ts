import {
    IdTextOrString,
    RecordLiteral,
    RecordLiteralItem,
    RecordLiteralRow,
    RecordLiteralSpread,
    String,
} from '../parsing/parser-new';
import { transformTerm } from '../typing/auto-transform';
import { idName } from '../typing/env';
import { void_ } from '../typing/preset';
import {
    Id,
    RecordBase,
    RecordBaseConcrete,
    RecordDef,
    Record,
    Term,
    Type,
    refsEqual,
    UnusedAttribute,
    RecordSubType,
    UserTypeReference,
    ErrorTerm,
    isErrorTerm,
    typesEqual,
} from '../typing/types';
import { Context, TypeBinding } from './Context';
import { IdOrSym, parseIdOrSym } from './hashes';
import { Library } from './Library';
import { applyTypeVariablesToRecord } from './ops';
import { typeExpression, wrapExpected } from './typeExpression';
import { typeType, typeVariablesMatch } from './typeType';

export const getAllSubTypes = (
    library: Library,
    extend: Array<Id>,
): Array<Id> => {
    return ([] as Array<Id>).concat(
        ...extend.map((id) =>
            [id].concat(
                getAllSubTypes(
                    library,
                    (library.types.defns[idName(id)]
                        .defn as RecordDef).extends.map((t) => t.ref.id),
                ),
            ),
        ),
    );
};

export const processSpreadFolks = (
    ctx: Context,
    row: RecordLiteralSpread,
    idx: number,
    subTypeIds: Array<Id>,
    spreadOrder: Array<Id>,
    subTypes: SubTypes,
    subTypeTypes: { [id: string]: RecordDef },
) => {
    // STOPSHIP: Put in possible spreads, each of the subtypes here
    const v = typeExpression(ctx, row.value, []);
    // ummm I kindof want to
    for (let id of subTypeIds) {
        if (
            // ermmm we're gonna ignore type variables here
            v.is.type === 'ref' &&
            refsEqual({ type: 'user', id }, v.is.ref)
        ) {
            spreadOrder.push(id);
            const sub = subTypes[idName(id)];
            if (sub.spread != null) {
                // This is a duplicate spread, toss this one.
                return v;
            }
            sub.spread = v;
            sub.covered = true;
            getAllSubTypes(
                ctx.library,
                subTypeTypes[idName(id)].extends.map((t) => t.ref.id),
            ).forEach((sid) => {
                subTypes[idName(sid)].covered = true;
            });
            return;
        }
    }
    return v;
};

export type SubTypes = {
    [id: string]: {
        covered: boolean;
        spread: Term | null;
        rows: Array<{ type: Type; value: Term | null }>;
    };
};

export const findSpread = (
    ctx: Context,
    goalType: Type,
    record: RecordLiteral,
    rows: Array<RecordLiteralRow>,
): Term => {
    // So we need a base spread
    for (let row of rows) {
        if (row.type !== 'RecordLiteralSpread') {
            continue;
        }
        // NOTE: this can have a little weirdness ifff
        // um the goalType um is an unresolved ... binding?
        const typed = typeExpression(ctx, row.value, [goalType]);
        // check to see if it was wrapped
        if (typed.type !== 'TypeError') {
            // Remove that row, we've used it.
            rows.splice(rows.indexOf(row), 1);
            return typed;
        }
    }
    return { type: 'Hole', is: goalType, location: record.location };
};

export const typeVariableRecord = (
    ctx: Context,
    binding: TypeBinding,
    record: RecordLiteral,
): Term => {
    const rows = record.rows?.items.slice() || [];
    const goalType: Type = {
        type: 'var',
        location: record.id.location,
        sym: binding.sym,
    };
    const spread = findSpread(ctx, goalType, record, rows);

    // Also, we need to enumerate the possible subtypes
    const subTypeIds = ([] as Array<Id>).concat(
        ...binding.subTypes.map((id) =>
            getAllSubTypes(
                ctx.library,
                (ctx.library.types.defns[idName(id)]
                    .defn as RecordDef).extends.map((t) => t.ref.id),
            ),
        ),
    );
    const { subTypes, unusedAttributes, unusedSpreads } = calculateSubTypes(
        ctx,
        subTypeIds,
        rows,
        record,
    );

    return wrapUnused(
        {
            type: 'Record',
            base: {
                type: 'Variable',
                location: record.id.location,
                spread,
                var: binding.sym,
            },
            is: goalType,
            location: record.location,
            subTypes,
        },
        unusedSpreads,
        unusedAttributes,
    );
};

export const wrapUnused = (
    record: Record,
    extraSpreads: Array<Term>,
    extraAttributes: Array<UnusedAttribute>,
): Term => {
    if (!extraAttributes.length && !extraSpreads.length) {
        return record;
    }
    return {
        type: 'InvalidRecordAttributes',
        extraAttributes,
        extraSpreads,
        inner: record,
        is: record.is,
        location: record.location,
    };
};

export const typeConcreteRecord = (
    ctx: Context,
    id: Id,
    record: RecordLiteral,
): Term => {
    const baseNames = ctx.library.types.constructors.idToNames[idName(id)];

    const typeVbls =
        record.typeVbls?.inner.items.map((item) => typeType(ctx, item)) || [];

    const goalType: UserTypeReference = {
        type: 'ref',
        ref: { type: 'user', id },
        typeVbls,
        location: record.id.location,
    };

    let defn = ctx.library.types.defns[idName(id)].defn as RecordDef;
    defn = applyTypeVariablesToRecord(
        ctx,
        defn,
        typeVbls,
        [],
        record.location,
        '',
    );
    const baseRows: Array<Term | null> = defn.items.map((_) => null);

    let rows =
        record.rows?.items.filter((row, i) => {
            if (row.type === 'RecordLiteralSpread') {
                return true;
            }
            const attrName = parseIdTextOrString(row.id.text);
            const idx = baseNames.indexOf(attrName);
            if (idx !== -1) {
                baseRows[idx] = typeExpression(ctx, row.value, [
                    defn.items[idx],
                ]);
                return false;
            }
            return true;
        }) || [];
    const spread = findSpread(ctx, goalType, record, rows);

    // Also, we need to enumerate the possible subtypes
    const subTypeIds = getAllSubTypes(
        ctx.library,
        (ctx.library.types.defns[idName(id)].defn as RecordDef).extends.map(
            (t) => t.ref.id,
        ),
    );

    const { subTypes, unusedAttributes, unusedSpreads } = calculateSubTypes(
        ctx,
        subTypeIds,
        rows,
        record,
    );

    return wrapUnused(
        {
            type: 'Record',
            base: {
                type: 'Concrete',
                location: record.id.location,
                spread: spread.type === 'Hole' ? null : spread,
                ref: { type: 'user', id },
                rows: baseRows,
            },
            is: goalType,
            location: record.location,
            subTypes,
        },
        unusedSpreads,
        unusedAttributes,
    );
};

export const typeRecord = (
    ctx: Context,
    record: RecordLiteral,
    expected: Array<Type>,
): Term => {
    // WHAT HAPPENS
    // if the top id disagrees with child items?
    // top id wins, rewrite child items.
    // I think we'll need a `InvalidRecordAttributes`
    // - extra AND missing.. wait, we don't need missing. just use holes.
    // thing that we wrap the literal in, similar to
    // the InvalidApplication
    // record.id

    // Options
    // - id hash
    // - id name

    // Constraints
    // - expected[]
    // - rows / spreads

    // So, if there are multiple options,
    // we could potentially have a split,
    // where one agreed with the expected,
    // and the other agreed with the arguments.
    // In that case, we'd rather go with the arguments,
    // and wrap in a typeError, instead of going with
    // the expected.
    // So I think I'll go with that for the moment.

    const options: Array<IdOrSym> = [];

    if (record.id.hash) {
        const idOrSym = parseIdOrSym(record.id.hash.slice(1));
        if (idOrSym) {
            options.push(idOrSym);
        }
    }
    const binding = ctx.bindings.types.find(
        (t) => t.sym.name === record.id.text,
    );
    if (binding) {
        options.push({ type: 'sym', unique: binding.sym.unique });
    }
    if (ctx.library.types.names[record.id.text]) {
        ctx.library.types.names[record.id.text].forEach((id) => {
            options.push({ type: 'id', id });
        });
    }

    const results: Array<{
        record: Record;
        errors: Array<ErrorTerm>;
        fits: boolean;
    }> = [];

    for (let option of options) {
        let result: Record;
        if (option.type === 'sym') {
            const binding = ctx.bindings.types.find(
                (t) => t.sym.unique === (option as any).unique,
            );
            if (!binding) {
                continue;
            }
            // NOTE:
            result = typeVariableRecord(ctx, binding, record);
        } else {
            result = typeConcreteRecord(ctx, option.id, record);
        }
        const fits =
            !expected.length || expected.some((t) => typesEqual(t, result.is));
        const errors = findErrors(result);
        if (fits && errors.length === 0) {
            return result;
        }
        results.push({ record: result, errors, fits });
    }
    results.sort((a, b) => {
        if (a.fits !== b.fits) {
            return a.fits ? -1 : 1;
        }
        if (a.errors.length !== b.errors.length) {
            return a.errors.length - b.errors.length;
        }
        return 0;
    });
    if (results.length) {
        return wrapExpected(results[0].record, expected);
    }

    return {
        type: 'Hole',
        location: record.location,
        is: expected.length ? expected[0] : void_,
    };
};

export const findErrors = (term: Term | null | void) => {
    if (!term) {
        return [];
    }
    const errors: Array<ErrorTerm> = [];
    transformTerm(
        term,
        {
            Term(node: Term, _) {
                if (isErrorTerm(node)) {
                    errors.push(node as ErrorTerm);
                }
                return null;
            },
        },
        null,
    );
    return errors;
};

export const parseString = (string: String) =>
    JSON.parse(string.contents.replace('\n', '\\n'));

const calculateSubTypes = (
    ctx: Context,
    subTypeIds: Id[],
    rows: RecordLiteralRow[],
    record: RecordLiteral,
) => {
    const names: { [key: string]: { i: number; id: Id } } = {};

    const subTypes: SubTypes = {};
    const subTypeTypes: { [id: string]: RecordDef } = {};

    subTypeIds.forEach((id) => {
        const t = ctx.library.types.defns[idName(id)].defn as RecordDef;
        subTypeTypes[idName(id)] = t;
        const rows = new Array(t.items.length);
        t.items.forEach((type, i) => {
            rows[i] = { type, value: null };
        });
        subTypes[idName(id)] = {
            covered: false,
            spread: null,
            rows,
        };
        ctx.library.types.constructors.idToNames[idName(id)].forEach(
            (name, i) => (names[name] = { i, id }),
        );
    });

    const spreadOrder: Array<Id> = [];

    const unusedSpreads: Array<Term> = [];
    const unusedAttributes: Array<UnusedAttribute> = [];

    rows.forEach((row, idx) => {
        if (row.type === 'RecordLiteralSpread') {
            const unusedSpread = processSpreadFolks(
                ctx,
                row,
                idx,
                subTypeIds,
                spreadOrder,
                subTypes,
                subTypeTypes,
            );
            if (unusedSpread) {
                unusedSpreads.push(unusedSpread);
            }
        } else {
            const unusedAttribute = processAttributeFolks(
                ctx,
                row,
                names,
                subTypes,
                subTypeTypes,
            );
            if (unusedAttribute) {
                unusedAttributes.push(unusedAttribute);
            }
        }
    });

    const finishedSubTypes: { [id: string]: RecordSubType } = {};
    spreadOrder.forEach((id) => {
        finishedSubTypes[idName(id)] = {
            covered: false,
            spread: null,
            rows: [],
        };
    });

    const defaults: null | { [key: string]: boolean } =
        // base.type === 'Concrete'
        //     ? allDefaults(
        //           env.global,
        //           env.global.types[idName(base.ref.id)] as RecordDef,
        //       )
        null;

    Object.keys(subTypes).forEach((id) => {
        if (!subTypes[id].covered) {
            subTypes[id].rows.forEach((row, i) => {
                if (row.value != null) {
                    return;
                }
                if (defaults && defaults[`${id}#${i}`]) {
                    return;
                }
                // Fill in any holes!
                row.value = {
                    type: 'Hole',
                    is: row.type,
                    location: record.location,
                };
            });
        }

        finishedSubTypes[id] = {
            ...subTypes[id],
            rows: subTypes[id].rows.map((r) => r.value),
        };
    });
    return { subTypes: finishedSubTypes, unusedAttributes, unusedSpreads };
};

export const parseIdTextOrString = (id: IdTextOrString) =>
    typeof id === 'string' ? id : parseString(id);

// NOTE: This is only for non-base things
function processAttributeFolks(
    ctx: Context,
    row: RecordLiteralItem,
    names: { [key: string]: { i: number; id: Id } },
    subTypes: SubTypes,
    subTypeTypes: { [id: string]: RecordDef },
): null | UnusedAttribute {
    let id: Id;
    let i: number;
    const attrName = parseIdTextOrString(row.id.text);
    // This should already have ... been ... taken care of? I think? yeah.
    if (attrName === '_') {
        return {
            ref: { type: 'unknown', text: '_' },
            idx: 0,
            value: typeExpression(ctx, row.value, []),
        };
    }
    if (!names[attrName]) {
        return {
            ref: { type: 'unknown', text: attrName },
            value: typeExpression(ctx, row.value, []),
            idx: 0,
        };
    }
    const got = names[attrName];
    i = got.i;
    id = got.id;

    let rowsToMod =
        // id == null && base.type === 'Concrete'
        //     ? base.rows
        subTypes[idName(id!)].rows;
    const recordType =
        // id == null && base.type === 'Concrete' ? (ctx.library.types.defns[idName(base.ref.id)].defn as RecordDef)
        subTypeTypes[idName(id!)];
    let v = typeExpression(ctx, row.value, [rowsToMod[i].type]);
    if (rowsToMod[i].value != null) {
        return { ref: { type: 'user', id }, idx: i, value: v };
    }
    rowsToMod[i].value = v;
    return null;
}
